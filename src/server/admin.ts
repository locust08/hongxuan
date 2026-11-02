import {localTimestamp} from './time.ts';
import type {RequestContext,PageResult} from './contracts.ts';
import {all,first,run,requireUser,checkCsrf,verifyPassword,rotateSession,csrf} from './core.ts';
import {canonicalAdminAction,validId} from './admin/policy.ts';
import {e,field,form,hidden,page,redirect,table} from './admin/ui.ts';
import {entities,entityPage} from './admin/entities.ts';
import {catalog} from './admin/catalog.ts';
import {uploads} from './admin/uploads.ts';
import {permissions} from './admin/access.ts';
import {personal,logs,heading,enquiries,members} from './admin/operations.ts';
import {sourceAdminRoutes} from './admin/routes.ts';
const allowedRoutes=new Set(sourceAdminRoutes.map(path=>path.toLowerCase()));

function requiredModule(path:string):number {return path.includes('/catalog/')?7:path.includes('/maintenance/')?6:path.includes('/webstore/')?5:path.includes('/members/')?4:path.includes('/admin/module/')||path.includes('/admin/submodule/')?3:path.includes('/personal/')?2:1;}
function requiredSubmodule(path:string,action:string,ctx:RequestContext):number[] {
 if(path.includes('/personal/'))return [/pwd/i.test(action)?2:11];if(path.includes('/admin/field/'))return [13];
 if(path.includes('/admin/user/'))return /log/.test(action)?[8]:action.startsWith('create')?[1]:[3];
 if(path.includes('/admin/group/'))return action.startsWith('create')?[9]:[10];if(path.includes('/admin/submodule/'))return action.startsWith('create')?[6]:[7];if(path.includes('/admin/module/'))return action.startsWith('create')?[4]:[5];
 if(path.includes('/catalog/'))return action==='display.asp'||action==='change_action.asp'?[16]:action.startsWith('create')?[14]:[15];
 if(path.includes('/maintenance/'))return /brand/.test(action)||/upload2\/|upload_ar2/.test(path)?[20]:/subcat/.test(action)?[22]:/status/.test(action)||/upload1\/|upload_ar1/.test(path)?[19]:/heading/.test(action)?[23]:[21];
 if(path.includes('/webstore/'))return action==='all_orders.asp'?[field(ctx,'type')==='new'?25:field(ctx,'type')==='update'?26:27]:/update/.test(action)?[26]:[25,26,27];return [];
}
export async function authorizeAdmin(ctx:RequestContext,action:string):Promise<Response|null>{const auth=await requireUser(ctx);if(auth)return auth;const group=Number(ctx.session.groupId);if(group===0||action==='index.asp'||action==='logout.asp')return null;if((ctx.path.includes('/admin/module/')||ctx.path.includes('/admin/submodule/'))&&group!==0)return new Response('Access denied',{status:403});if(ctx.path.includes('/admin/')&&group>2)return new Response('Access denied',{status:403});
 const module=requiredModule(ctx.path);const access=await first(ctx,'SELECT moduleid FROM groupmoduleaccess WHERE groupid=? AND moduleid=?',[group,module]);if(!access)return new Response('Access denied',{status:403});
 const subids=requiredSubmodule(ctx.path,action,ctx);if(subids.length){const sub=await first(ctx,`SELECT smid FROM groupsubmoduleaccess WHERE groupid=? AND smid IN (${subids.map(()=>'?').join(',')})`,[group,...subids]);if(!sub)return new Response('Access denied',{status:403});}
 const mode=/delete|purge/.test(action)||ctx.form.get('delete')==='Yes'?'delaccess':action.startsWith('create')?'insaccess':/action|resetpwd|changepwd/.test(action)||ctx.request.method==='POST'&&/upload/.test(ctx.path)?'modifyaccess':'viewaccess';const data=await first(ctx,'SELECT * FROM groupdataaccess WHERE groupid=? AND (moduleid=? OR moduleid IS NULL) ORDER BY moduleid DESC LIMIT 1',[group,module]);if(data&&!data[mode])return new Response('Data access denied',{status:403});return null;
}
export async function renderAdmin(ctx:RequestContext):Promise<PageResult|Response|null>{
 if(!/^\/app\/(admin|module|personal)(\/|$)/i.test(ctx.path))return null;
 let route:string;try{route=decodeURIComponent(ctx.path).toLowerCase();}catch{return page('Administration','Invalid route',400);}
 if(/^\/app\/(admin|module)\/?$/.test(route))return redirect(route.replace(/\/$/,'')+'/index.asp');
 if(!allowedRoutes.has(route))return page('Administration','Page not found.',404);
 // Dispatch and permission checks always see the same verified, normalized directory.
 ctx.path=route;
 let action=canonicalAdminAction(decodeURIComponent(ctx.path.split('/').pop()??'index.asp'));
 const fragments:Record<string,string>={catalog_form:'catalog',user_form:'user',group_form:'group',module_form:'module',submodule_form:'submodule',cat_form:'cat',subcat_form:'subcat',brand_form:'brand',brand_form_old:'brand',status_form:'status'};
 const fragment=fragments[action.replace(/\.asp$/,'')];if(fragment){const hasId=field(ctx,'prodcode','prod_id','userid','groupid','moduleid','smid','catcode','subcat_code');action=`${hasId?'modify':'create'}_${fragment}.asp`;}
 if(action==='heading_form.asp')action='modify_heading.asp';if(action==='personal_user_form.asp')action='modify_data.asp';if(action==='client_form.asp')action='verify_online_client.asp';if(action==='order_form.asp')action=field(ctx,'orderid','order_id')?'view_order.asp':'all_orders.asp';
 if(action==='login.asp')return page('Hong Xuan - Login',`<table border="0" width="100%" cellspacing="1" cellpadding="1"><tr><td width="250" valign="top"></td><td width="500" valign="top" align="center"><form name="loginForm" action="${e(ctx.path.replace(/login\.asp$/i,'login_action.asp'))}" method="post">${csrf(ctx)}<table border="0" width="100%" cellpadding="1" cellspacing="1"><tr><td width="30%">&nbsp;</td><td width="70%">&nbsp;</td></tr>${ctx.url.searchParams.has('retry')?'<tr><td></td><td style="color:red">Invalid Login !!</td></tr>':''}<tr><td>&nbsp;</td><td></td></tr><tr><td valign="top"><font class="label" color="#000080">Today is</font></td><td><font class="show" color="#000080">${e(new Date().toLocaleDateString('en-GB',{timeZone:'Asia/Kuala_Lumpur',weekday:'long',day:'numeric',month:'long',year:'numeric'}))}<br>${e(new Date().toLocaleTimeString('en-GB',{timeZone:'Asia/Kuala_Lumpur',hour12:true}))}</font></td></tr><tr><td><label class="label" style="color:#000080" for="username">Username</label></td><td><input id="username" name="username" type="text" size="20" maxlength="10" autofocus></td></tr><tr><td><label class="label" style="color:#000080" for="password">Password</label></td><td><input id="password" name="password" type="password" size="20"></td></tr><tr><td>&nbsp;</td><td><button type="submit" style="border:0;background:transparent;padding:0"><img src="/app/images/buttons/btn-login.gif" alt="Login" width="71" height="18"></button></td></tr></table></form></td></tr></table>`);
 if(action==='login_action.asp'){if(ctx.request.method!=='POST')return new Response('Method not allowed',{status:405,headers:{Allow:'POST'}});if(!checkCsrf(ctx))return new Response('Invalid CSRF token',{status:403});const user=await first(ctx,'SELECT * FROM tblusers WHERE userlogin=? COLLATE NOCASE',[field(ctx,'username')]);if(!user||!user.userstatus||!await verifyPassword(field(ctx,'password'),String(user.userpwd)))return redirect('/app/admin/login.asp?retry=password');ctx.session.userId=Number(user.userid);ctx.session.groupId=Number(user.usergroup);ctx.session.username=String(user.username);await rotateSession(ctx);await run(ctx,'INSERT INTO tbluserlog(userid,log_datetime) VALUES (?,?)',[ctx.session.userId,localTimestamp()]);return redirect(Number(user.usergroup)<=1?'/app/admin/index.asp':'/app/module/index.asp');}
 const auth=await authorizeAdmin(ctx,action);if(auth)return auth;
 if(ctx.request.method==='POST'&&!checkCsrf(ctx))return new Response('Invalid CSRF token',{status:403});
 if(action.includes('_action')&&ctx.request.method!=='POST'){
  if(action.startsWith('delete'))return page('Confirm deletion',form(ctx,ctx.path,'Confirm deletion',Array.from(ctx.url.searchParams).map(([k,v])=>hidden(k,v)).join('')+'<tr><td colspan="2">Confirm deletion?</td></tr>'));
  return new Response('Method not allowed',{status:405,headers:{Allow:'POST'}});
 }
 if(action==='logout.asp'){if(ctx.request.method!=='POST')return page('Logout',form(ctx,ctx.path,'Logout','<tr><td colspan="2">Logout?</td></tr>'));ctx.session.userId=null;ctx.session.groupId=null;ctx.session.username='';await rotateSession(ctx);return redirect('/app/admin/login.asp');}
 if(action==='index.asp')return page('Hong Xuan Administration',`<font class="h4"><strong>Welcome <font color="#0000C0">${e(ctx.session.username)}</font></strong></font>`);
 try {
  if(/\/upload[^/]*\//.test(ctx.path)||/upload_arc|upload_ar|view_picture|view_logo/.test(action))return uploads(ctx);
  if(ctx.path.includes('/personal/')||/reset_pwd|resetpwd/.test(action)&&!ctx.path.includes('/members/'))return personal(ctx,action);
  if(ctx.path.includes('/admin/user/')&&/log/.test(action))return logs(ctx,action);
  if((ctx.path==='/app/admin/field/assign_field.asp'||ctx.path==='/app/admin/field/assign_field_action.asp')||(ctx.path==='/app/admin/group/assign_profile.asp'||ctx.path==='/app/admin/group/assign_profile_action.asp'))return permissions(ctx,action);
  if(ctx.path.includes('/maintenance/')&&/heading/.test(action))return heading(ctx,action);
  if(ctx.path.includes('/webstore/'))return enquiries(ctx,action);
  if(ctx.path.includes('/members/'))return members(ctx,action);
  if(ctx.path.includes('/catalog/'))return catalog(ctx,action);
  const match=ctx.path.match(/\/admin\/(user|group|module|submodule)\//)?.[1]??action.match(/(?:create|modify|delete|all)_(subcat|cat|brand|status)/)?.[1];
  if(action==='view_order.asp'&&match==='module')return page('Module Order',table(await all(ctx,'SELECT modulename,moduleorder FROM module ORDER BY moduleorder'),['modulename','moduleorder']));
  if(action==='view_order.asp'&&match==='submodule'){const id=validId(field(ctx,'moduleid'));if(!id)return page('Submodule Order','Invalid module',400);return page('Submodule Order',table(await all(ctx,'SELECT smname,smorder FROM submodule WHERE moduleid=? ORDER BY smorder',[id]),['smname','smorder']));}
  if(match&&entities[match])return await entityPage(ctx,match,action);
  return page('Administration','Page not found.',404);
 }catch(error){if(error instanceof Error&&/UNIQUE constraint failed/i.test(error.message))return page('Record already exists','The identifier or name is already in use.',409);throw error;}
}
