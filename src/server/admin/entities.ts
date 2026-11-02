import {localTimestamp} from '../time.ts';
import type { RequestContext, PageResult, Value } from '../contracts.ts';
import { all,first,hashPassword,run,csrf } from '../core.ts';
import { batch,e,field,form,hidden,input,page,redirect,select } from './ui.ts';
import { sanitizeContent } from './policy.ts';
type Entity={table:string,key:string,query:string,fields:[string,string,string][],list:string,numeric?:boolean, title:string};
export const entities:Record<string,Entity>={
 user:{table:'tblusers',key:'userid',query:'userid',numeric:true,title:'User Module',list:'all_users.asp',fields:[['userlogin','username','Desired login name'],['username','name','Name'],['userstatus','status','Status'],['usergroup','groupname','Group']]},
 group:{table:'groups',key:'groupid',query:'groupid',numeric:true,title:'Group Module',list:'all_groups.asp',fields:[['groupname','groupname','Group name'],['groupdesc','groupdesc','Description']]},
 module:{table:'module',key:'moduleid',query:'moduleid',numeric:true,title:'Module',list:'all_modules.asp',fields:['name','desc','path','img','alt','order'].map(n=>['module'+n,'module'+n,'Module '+n]) as [string,string,string][]},
 submodule:{table:'submodule',key:'smid',query:'smid',numeric:true,title:'SubModule',list:'all_submodules.asp',fields:[['moduleid','moduleid','Module'],...['name','desc','path','img','alt','order'].map(n=>['sm'+n,'submodule'+n,'SubModule '+n] as [string,string,string]),['groupto','groupto','Group to']]},
 cat:{table:'category',key:'cat_id',query:'catcode',title:'Category',list:'all_cat.asp',fields:[['cat_id','cat_id','Category ID'],['cat_desc','cat_desc','Description']]},
 subcat:{table:'subcategory',key:'subcat_id',query:'subcat_code',title:'Subcategory',list:'all_subcat.asp',fields:[['subcat_id','subcat_id','Subcategory ID'],['subcat_desc','subcat_desc','Description'],['cat_id','cat_id','Category']]},
 brand:{table:'brand',key:'brand_id',query:'catcode',title:'Brand',list:'all_brand.asp',fields:[['brand_id','cat_id','Brand ID'],['brand_desc','cat_desc','Description'],['brand_logo','pic','Logo'],['brand_memo','myTextarea','Description HTML']]},
 status:{table:'status',key:'status_id',query:'catcode',title:'Status',list:'all_status.asp',fields:[['status_id','cat_id','Status ID'],['status_desc','cat_desc','Description'],['status_pic','pic','Picture']]},
};
export async function entityPage(ctx:RequestContext,name:string,action:string,logOnly=false):Promise<PageResult|Response>{
 const ent=entities[name]!;const base=ctx.path.slice(0,ctx.path.lastIndexOf('/')+1);const id=field(ctx,name==='subcat'?'old_subcatid':'old_cat_id',ent.query,ent.key,name==='submodule'?'submoduleid':'__unused');
 const isList=action===ent.list;const create=action.startsWith('create');const del=action.startsWith('delete');const mutation=action.includes('_action');
 if(isList){
  const filter=field(ctx,'filterby'),order=field(ctx,'orderby');const bindings:Value[]=[];const clauses:string[]=[];
  if(name==='user'&&ctx.session.groupId!==0)clauses.push('userid<>1');if(name==='group'&&ctx.session.groupId!==0)clauses.push('groupid<>0');if(name==='user'&&['0','1'].includes(filter)){clauses.push('userstatus=?');bindings.push(filter);}
  const sort=name==='user'?(order==='group'?'groupname':order==='name'?'username':'userid'):name==='group'?'groupname':name==='module'?'modulename':name==='submodule'?'moduleid,smname':`"${ent.key}"`;
  const from=name==='user'?'tblusers LEFT JOIN groups ON groups.groupid=tblusers.usergroup':`"${ent.table}"`;
  const rows=await all(ctx,`SELECT * FROM ${from}${clauses.length?' WHERE '+clauses.join(' AND '):''} ORDER BY ${sort}`,bindings);const size=20;const pages=Math.max(1,Math.ceil(rows.length/size));const current=Math.min(pages,Math.max(1,Number(field(ctx,'page'))||1));
  const params={filterby:filter,orderby:order};const href=(more:Record<string,string>)=>'?'+new URLSearchParams({...params,...more});
  const columns:Record<string,[string,string][]>= {user:[['userlogin','Login id'],['username','Name'],['groupname','Group'],['userstatus','Status']],group:[['groupid','Group id'],['groupname','Group name'],['groupdesc','Description']],module:[['moduleid','Module id'],['modulename','Module name'],['moduledesc','Description'],['moduleorder','Order']],submodule:[['moduleid','Module'],['smname','Submodule name'],['smpath','Path'],['smorder','Order']],cat:[['cat_id','Category ID'],['cat_desc','Description']],subcat:[['subcat_id','Subcategory ID'],['cat_id','Category'],['subcat_desc','Description']],brand:[['brand_id','Brand ID'],['brand_desc','Description'],['brand_logo','Logo']],status:[['status_id','Status ID'],['status_desc','Description'],['status_pic','Picture']]};const cols=columns[name]!;
  let html=name==='user'?`<form method="post" action="${e(ctx.path)}">${csrf(ctx)}${hidden('orderby',order)}<table width="100%" cellspacing="1" cellpadding="3" class="show"><tr><td width="12%"><strong>Status Filtering, by</strong></td><td width="65%">${[['1','Active'],['0','Non active'],['','All']].map(([v,label])=>`<label><input type="radio" name="filterby" value="${v}" ${filter===v?'checked':''}>${label}</label>`).join(' ')}</td><td width="23%"><button type="submit" style="border:0;background:transparent;padding:0"><img src="/app/images/buttons/btn-filter.gif" alt="Filter" width="71" height="18"></button></td></tr></table></form>`:'';
  html+=`<table width="100%" cellspacing="1" cellpadding="3" border="0" class="show"><tr bgcolor="#000080"><td colspan="${cols.length+1}" style="color:white"><strong>${name==='user'?'System - [ Display all users ]':e(ent.title)+' - [ Display all records ]'}</strong></td></tr><tr bgcolor="#4040FF" style="color:white">${cols.map(([col,label],i)=>`<td ${name==='user'?`width="${[100,230,100,50][i]}"`:''}><strong>${name==='user'&&['username','groupname'].includes(col)?`<a class="underlining1" href="${e(href({orderby:col==='username'?'name':'group'}))}">${label}</a>`:e(label)}</strong></td>`).join('')}<td ${name==='user'?'width="150"':''}><strong>Action</strong></td></tr>`;
  html+=rows.slice((current-1)*size,current*size).map((r,i)=>`<tr bgcolor="${i%2?'#C1C1F7':'#FFFFFF'}">${cols.map(([col])=>`<td>${col==='userstatus'?(r[col]?'Active':'Non active'):e(r[col])}</td>`).join('')}<td nowrap>${logOnly?`<a href="${base}view_log.asp?userid=${e(r.userid)}">View Log</a>`:`<a href="${base}modify_${name}.asp?${ent.query}=${encodeURIComponent(String(r[ent.key]))}">Modify</a> | ${name==='user'?`<a href="${base}reset_pwd.asp?userid=${e(r.userid)}">Reset Password</a>`:name==='group'?`<a href="${base}assign_profile.asp?groupid=${e(r.groupid)}">Assign Profile</a>`:`<a href="${base}delete_${name}${name==='module'?'':'_action'}.asp?${ent.query}=${encodeURIComponent(String(r[ent.key]))}">Delete</a>`}`}</td></tr>`).join('');
  if(!rows.length)html+=`<tr><td colspan="${cols.length+1}" style="text-align:center;color:red"><strong>No Records Found.</strong></td></tr>`;
  html+=`</table><hr><p class="menuitem">(Records ${rows.length?(current-1)*size+1:0} - ${Math.min(current*size,rows.length)} of total ${rows.length})<br><strong>Page ${current}</strong> ${pages>1?Array.from({length:pages},(_,n)=>n+1).filter(p=>Math.abs(p-current)<6).map(p=>`<a href="${e(href({page:String(p)}))}">${p}</a>`).join(' '):''} of ${pages}${pages>1?` [ <a href="${e(href({page:String(Math.max(1,current-1))}))}">Previous Page</a> ] [ <a href="${e(href({page:String(Math.min(pages,current+1))}))}">Next Page</a> ]`:hidden('filterby',filter)+hidden('orderby',order)}</p>`;
  if(name==='user'&&!logOnly){const groups=await all(ctx,'SELECT groupname,groupdesc FROM groups'+(ctx.session.groupId===0?'':' WHERE groupid<>0')+' ORDER BY groupid');html+='<hr><table width="600" border="1" cellpadding="1" cellspacing="1">'+groups.map(g=>`<tr><td class="smallnote" style="color:green">${e(g.groupname)}</td><td class="smallnote">${e(g.groupdesc)}</td></tr>`).join('')+'</table><hr>';}
  return page(ent.title,html);
 }
 let key:Value=id;if(!create){if(ent.numeric && !/^\d+$/.test(id))return page(ent.title,'Invalid ID',400);if(!id)return page(ent.title,'Missing ID',400);}
 const existing=!create?await first(ctx,`SELECT * FROM "${ent.table}" WHERE "${ent.key}"=?`,[key]):null;
 if(!create&&!existing)return page(ent.title,'Record not found',404);
 if(del){if(ctx.request.method!=='POST')return page(ent.title,form(ctx,base+`delete_${name}_action.asp`,'Confirm deletion',hidden(ent.query,id)+`<tr><td colspan="2">Delete ${e(id)}?</td></tr>`));
  if(name==='user'||name==='group')return page(ent.title,'This record cannot be deleted.',403);
  const statements:[string,Value[]][]=[];
  const prodCol:Record<string,string>={cat:'prod_category',subcat:'prod_subcat',brand:'prod_brand',status:'prod_status'};
  if(prodCol[name])statements.push([`UPDATE products SET ${prodCol[name]}='' WHERE ${prodCol[name]}=?`,[key]]);
  if(name==='cat')statements.push([`UPDATE subcategory SET cat_id='' WHERE cat_id=?`,[key]]);
  if(name==='submodule')statements.push(['DELETE FROM groupsubmoduleaccess WHERE smid=?',[key]]);
  if(name==='module'){statements.push(['DELETE FROM groupsubmoduleaccess WHERE smid IN (SELECT smid FROM submodule WHERE moduleid=?)',[key]],['DELETE FROM submodule WHERE moduleid=?',[key]],['DELETE FROM groupmoduleaccess WHERE moduleid=?',[key]],['DELETE FROM groupdataaccess WHERE moduleid=?',[key]]);}
  statements.push([`DELETE FROM "${ent.table}" WHERE "${ent.key}"=?`,[key]]);await batch(ctx,statements);return redirect(base+ent.list);
 }
 if(mutation){const vals:Record<string,Value>={};for(const [col,f] of ent.fields)vals[col]=field(ctx,f);
  for(const col of ['usergroup','moduleid','moduleorder','smorder','groupto'])if(col in vals && !/^\d+$/.test(String(vals[col])))return page(ent.title,`Invalid ${e(col)}`,400);
  if(name==='user'){if(!String(vals.username).trim())return page(ent.title,'Name is required',400);if(!['0','1'].includes(String(vals.userstatus)))return page(ent.title,'Invalid status',400);if(!await first(ctx,'SELECT groupid FROM groups WHERE groupid=?',[vals.usergroup!]))return page(ent.title,'Invalid group',400);if(+String(vals.usergroup)<Number(ctx.session.groupId))return page(ent.title,'Cannot assign a privileged group',403);
   if(existing&&Number(existing.usergroup)<Number(ctx.session.groupId))return page(ent.title,'Cannot modify a privileged user',403);
   if(create){const pwd=field(ctx,'password');if(!pwd||pwd!==field(ctx,'cpassword'))return page(ent.title,'Passwords must match',400);vals.userpwd=await hashPassword(pwd);}else delete vals.userlogin;
  }
  if(name==='subcat'&&vals.cat_id&&!await first(ctx,'SELECT cat_id FROM category WHERE cat_id=?',[vals.cat_id]))return page(ent.title,'Invalid category',400);
  if(name==='submodule'&&!await first(ctx,'SELECT moduleid FROM module WHERE moduleid=?',[vals.moduleid!]))return page(ent.title,'Invalid module',400);
  if(name==='brand')vals.brand_memo=sanitizeContent(String(vals.brand_memo));
  const unique=name==='user'?'userlogin':name==='group'?'groupname':name==='module'?'modulename':name==='submodule'?'smname':ent.key;
  const candidate=vals[unique];if(candidate!==undefined&&(!String(candidate).trim()||await first(ctx,`SELECT "${ent.key}" FROM "${ent.table}" WHERE "${unique}"=? COLLATE NOCASE${create?'':` AND "${ent.key}"<>?`}`,[candidate,...(create?[]:[key])])))return page(ent.title,'The name or identifier is empty or already in use.',409);
  for(const col of ['brand_logo','status_pic'])if(col in vals&&(/[\\/]|\.\./.test(String(vals[col]))))return page(ent.title,'Invalid asset filename',400);
  if(!ent.numeric){vals[ent.key]=String(vals[ent.key]).toUpperCase();if(!String(vals[ent.key]).trim())return page(ent.title,'ID is required',400);}
  if(create){if(ent.numeric){const n=await first(ctx,`SELECT COALESCE(MAX("${ent.key}"),0)+1 AS n FROM "${ent.table}"`);vals[ent.key]=Number(n?.n??1);}if(name==='user'||name==='group')vals.date_creation=localTimestamp();
   const columns=Object.keys(vals);await run(ctx,`INSERT INTO "${ent.table}" (${columns.map(c=>`"${c}"`).join(',')}) VALUES (${columns.map(()=>'?').join(',')})`,Object.values(vals));
  }else{if(name==='user'||name==='group')vals.date_modification=localTimestamp();const columns=Object.keys(vals);const statements:[string,Value[]][]=[[`UPDATE "${ent.table}" SET ${columns.map(c=>`"${c}"=?`).join(',')} WHERE "${ent.key}"=?`,[...Object.values(vals),key]]];
   const prodCol:Record<string,string>={cat:'prod_category',subcat:'prod_subcat',brand:'prod_brand',status:'prod_status'};if(prodCol[name])statements.push([`UPDATE products SET ${prodCol[name]}=? WHERE ${prodCol[name]}=?`,[vals[ent.key]!,key]]);if(name==='cat')statements.push(['UPDATE subcategory SET cat_id=? WHERE cat_id=?',[vals[ent.key]!,key]]);await batch(ctx,statements);
  }if((name==='brand'||name==='status')&&/_action1(?:_old)?\.asp$/.test(ctx.path))return redirect(base+`upload_ar${name==='brand'?'2':'1'}.asp?prodcode=${encodeURIComponent(String(vals[ent.key]??key))}`);return redirect(base+ent.list);
 }
 let body=hidden(ent.query,id);if(!create&&!ent.numeric)body+=hidden('old_cat_id',id)+hidden('old_subcatid',id);
 for(const [col,f,label] of ent.fields){if(name==='user'&&col==='userlogin'&&!create)continue;
  if(name==='user'&&col==='usergroup'){body+=select(f,label,existing?.[col]??ctx.session.groupId,await all(ctx,'SELECT groupid,groupname FROM groups WHERE groupid>=?',[ctx.session.groupId]),'groupid','groupname');continue;}
  if(name==='user'&&col==='userstatus'){body+=select(f,label,existing?.[col]??1,[{id:1,name:'Active'},{id:0,name:'Non active'}],'id','name');continue;}
  if(col==='cat_id'&&name==='subcat'){body+=select(f,label,existing?.[col]??'',await all(ctx,'SELECT * FROM category'),'cat_id','cat_desc');continue;}
  body+=input(f,label,existing?.[col]??'',/desc|memo/.test(col)?'textarea':'text');
 }if(name==='user'&&create)body+=input('password','Password','','password')+input('cpassword','Confirm password','','password');
 if(name==='brand'||name==='status')body+=`<tr><td>Upload picture</td><td><button type="submit" formaction="${base}${create?'create':'modify'}_${name}_action1.asp" style="border:0;padding:0;background:transparent;color:blue;text-decoration:underline;cursor:pointer">Upload Icon</button></td></tr>`;
 return page(ent.title,form(ctx,base+`${create?'create':'modify'}_${name}_action.asp`,`${ent.title} - [ ${create?'Create':'Modify'} ]`,body));
}
