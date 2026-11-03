import type { AstroCookies } from 'astro';
import type { RequestContext, Row, Value, Session, PageResult } from './contracts.ts';
import { escapeHtml, redirect } from './html.ts';
import { legacyRoutePath } from './urls.ts';
import { deliverQueuedMail, deliverOrderMail } from './core/mail.ts';
export { queueMail, deliverQueuedMail, drainOutbox } from './core/mail.ts';
export type { MailContext } from './core/mail.ts';
const SESSION_AGE=60*60*8;
export async function all(ctx:RequestContext,sql:string,bindings:Value[]=[]):Promise<Row[]>{ return (await ctx.db.prepare(sql).bind(...bindings).all<Row>()).results; }
export async function first(ctx:RequestContext,sql:string,bindings:Value[]=[]):Promise<Row|null>{return ctx.db.prepare(sql).bind(...bindings).first<Row>();}
export async function run(ctx:RequestContext,sql:string,bindings:Value[]=[]):Promise<D1Result>{return ctx.db.prepare(sql).bind(...bindings).run();}
const token=()=>crypto.randomUUID();
export async function createContext(input:{request:Request,url:URL,cookies:AstroCookies,env:Env}):Promise<RequestContext>{
 const {request,url,cookies,env}=input;const cookie=cookies.get('hx_session')?.value;
 const row=cookie&&/^[a-f0-9-]{36}$/.test(cookie)?await env.DB.prepare('SELECT * FROM app_sessions WHERE id=? AND expires>?').bind(cookie,Math.floor(Date.now()/1000)).first<Row>():null;
 const session:Session=row?{id:String(row.id),csrf:String(row.csrf),userId:row.userid===null?null:Number(row.userid),groupId:row.groupid===null?null:Number(row.groupid),username:String(row.username),cartId:String(row.cartid)}:{id:token(),csrf:token(),userId:null,groupId:null,username:'',cartId:'modern-'+token()};
 let form=new FormData();
 if(!['GET','HEAD'].includes(request.method)){
  const length=Number(request.headers.get('content-length')||0);
  if(length>12*1024*1024)throw new Error('Request body too large');
  if(/^(application\/x-www-form-urlencoded|multipart\/form-data)/i.test(request.headers.get('content-type')||''))form=await request.formData();
 }
 const ctx:RequestContext={request,url,path:legacyRoutePath(url.pathname),form,params:new URLSearchParams(url.searchParams),db:env.DB,bucket:env.UPLOADS,env,cookies,session};
 if(url.searchParams.has('error')){
  const draft=await first(ctx,'SELECT fields FROM app_form_drafts WHERE session_id=? AND form_kind=? AND expires>?',[session.id,formKind(ctx),Date.now()]);
  if(draft){const fields:Record<string,string>=JSON.parse(String(draft.fields));for(const [key,value] of Object.entries(fields))if(!ctx.params.has(key))ctx.params.set(key,value);}
 }
 if(row){await run(ctx,'UPDATE app_sessions SET expires=? WHERE id=?',[Math.floor(Date.now()/1000)+SESSION_AGE,session.id]);cookies.set('hx_session',session.id,{path:'/',httpOnly:true,sameSite:'lax',secure:url.protocol==='https:',maxAge:SESSION_AGE});}else await saveSession(ctx);return ctx;
}
export async function saveSession(ctx:RequestContext):Promise<void>{const s=ctx.session;await run(ctx,'INSERT INTO app_sessions(id,csrf,userid,groupid,username,cartid,expires) VALUES(?,?,?,?,?,?,?) ON CONFLICT(id) DO UPDATE SET csrf=excluded.csrf,userid=excluded.userid,groupid=excluded.groupid,username=excluded.username,cartid=excluded.cartid,expires=excluded.expires',[s.id,s.csrf,s.userId,s.groupId,s.username,s.cartId,Math.floor(Date.now()/1000)+SESSION_AGE]);ctx.cookies.set('hx_session',s.id,{path:'/',httpOnly:true,sameSite:'lax',secure:ctx.url.protocol==='https:',maxAge:SESSION_AGE});}
export async function rotateSession(ctx:RequestContext):Promise<void>{await run(ctx,'DELETE FROM app_sessions WHERE id=?',[ctx.session.id]);ctx.session.id=token();ctx.session.csrf=token();await saveSession(ctx);}
export async function requireUser(ctx:RequestContext,adminOnly=false):Promise<Response|null>{
 if(!ctx.session.userId)return redirect('/app/admin/login.asp');
 const user=await first(ctx,'SELECT userid,userstatus,usergroup FROM tblusers WHERE userid=?',[ctx.session.userId]);
 if(!user||!user.userstatus){ctx.session.userId=null;ctx.session.groupId=null;ctx.session.username='';await rotateSession(ctx);return redirect('/app/admin/login.asp');}
 ctx.session.groupId=Number(user.usergroup);
 if(adminOnly&&ctx.session.groupId!==1)return new Response('Access denied',{status:403});return null;
}
export function csrf(ctx:RequestContext):string{return `<input type="hidden" name="_csrf" value="${escapeHtml(ctx.session.csrf)}">`;}
function equal(a:string,b:string):boolean{let x=a.length^b.length;for(let i=0;i<Math.max(a.length,b.length);i++)x|=(a.charCodeAt(i)||0)^(b.charCodeAt(i)||0);return x===0;}
export function checkCsrf(ctx:RequestContext):boolean{const origin=ctx.request.headers.get('origin');return (!origin||origin===ctx.url.origin)&&equal(String(ctx.form.get('_csrf')||''),ctx.session.csrf);}
const hex=(b:ArrayBuffer|Uint8Array)=>Array.from(b instanceof Uint8Array?b:new Uint8Array(b),n=>n.toString(16).padStart(2,'0')).join('');
const unhex=(s:string)=>new Uint8Array(s.match(/../g)!.map(v=>parseInt(v,16)));
async function derive(password:string,salt:Uint8Array,iterations:number):Promise<string>{const key=await crypto.subtle.importKey('raw',new TextEncoder().encode(password),'PBKDF2',false,['deriveBits']);return hex(await crypto.subtle.deriveBits({name:'PBKDF2',hash:'SHA-256',salt:new Uint8Array(salt),iterations},key,256));}
export async function hashPassword(password:string):Promise<string>{const salt=crypto.getRandomValues(new Uint8Array(16));return `pbkdf2-sha256$100000$${hex(salt)}$${await derive(password,salt,100000)}`;}
export async function verifyPassword(password:string,encoded:string):Promise<boolean>{const m=/^pbkdf2-sha256\$(\d+)\$([a-f0-9]{32})\$([a-f0-9]{64})$/.exec(encoded);if(!m||Number(m[1])<10000||Number(m[1])>100000)return false;return equal(await derive(password,unhex(m[2]),Number(m[1])),m[3]);}

function field(ctx:RequestContext,name:string,max=4000):string{return String(ctx.form.get(name)||'').trim().slice(0,max);}
function formKind(ctx:RequestContext):string{return ['/contactus.asp','/211212contactus.asp'].includes(ctx.path)?'contact':'enquiry';}
async function fail(ctx:RequestContext,code:string):Promise<Response>{
 if(['validation','captcha','product','empty','cart_changed'].includes(code)&&ctx.form.has('contactname'))await run(ctx,'INSERT INTO app_form_drafts(session_id,form_kind,fields,expires) VALUES(?,?,?,?) ON CONFLICT(session_id,form_kind) DO UPDATE SET fields=excluded.fields,expires=excluded.expires',[ctx.session.id,formKind(ctx),JSON.stringify(contactValues(ctx)),Date.now()+30*60*1000]);
 return redirect((formKind(ctx)==='contact'?(ctx.path==='/211212contactus.asp'?ctx.path:'/contactus.asp'):'/cart_summary.asp')+'?error='+code);
}
async function clearDraft(ctx:RequestContext):Promise<void>{await run(ctx,'DELETE FROM app_form_drafts WHERE session_id=? AND form_kind=?',[ctx.session.id,formKind(ctx)]);}
async function captcha(ctx:RequestContext):Promise<Response>{const n=crypto.getRandomValues(new Uint32Array(1))[0]%900000+100000;await run(ctx,'INSERT INTO app_captcha(session_id,code,expires) VALUES(?,?,?) ON CONFLICT(session_id) DO UPDATE SET code=excluded.code,expires=excluded.expires',[ctx.session.id,String(n),Date.now()+5*60*1000]);return new Response(`<svg xmlns="http://www.w3.org/2000/svg" width="130" height="36" viewBox="0 0 130 36"><rect width="130" height="36" fill="#eee6bd"/><path d="M0 15L130 22M0 29L130 7" stroke="#bcb48e"/><text x="10" y="26" font-family="monospace" font-size="26" letter-spacing="3" fill="#41362b">${n}</text></svg>`,{headers:{'Content-Type':'image/svg+xml','Cache-Control':'no-store'}});}
async function consumeCaptcha(ctx:RequestContext):Promise<boolean>{const row=await ctx.db.prepare('DELETE FROM app_captcha WHERE session_id=? RETURNING code,expires').bind(ctx.session.id).first<Row>();return !!row&&Number(row.expires)>Date.now()&&equal(field(ctx,'strCAPTCHA',8),String(row.code));}
async function updateCart(ctx:RequestContext):Promise<Response|null>{
 const statements:D1PreparedStatement[]=[];
 for(const [key,value] of ctx.form.entries())if(/^qty_\d+$/.test(key)){
  const id=Number(key.slice(4)),q=String(value);if(!/^\d{1,4}$/.test(q)||Number(q)>9999)return fail(ctx,'quantity');
  statements.push(ctx.db.prepare(Number(q)===0?'DELETE FROM order_products_tmp WHERE tmp_order_id=? AND prod_id=?':'UPDATE order_products_tmp SET prod_qty=? WHERE tmp_order_id=? AND prod_id=?').bind(...(Number(q)===0?[ctx.session.cartId,id]:[Number(q),ctx.session.cartId,id])));
 }
 if(statements.length){const results=await ctx.db.batch(statements);if(results.some(result=>Number(result.meta.changes)===0))return fail(ctx,'cart_changed');}return null;
}
function contactValues(ctx:RequestContext):Record<string,string>{return Object.fromEntries(['contactname','compname','compname2','add','state','countrydesc','contactno','faxno','email','remarks'].map(k=>[k,field(ctx,k,k==='remarks'?4000:500)]));}
function validContact(v:Record<string,string>,enquiry=false):boolean{
 const common=!!(v.contactname&&v.contactno&&/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.email)&&!/[\r\n]/.test(v.email));
 return common&&(enquiry?!!v.add:!!v.remarks&&/^\d+$/.test(v.contactno)&&(!v.faxno||/^\d+$/.test(v.faxno)));
}
async function submitContact(ctx:RequestContext):Promise<Response>{const values=contactValues(ctx);if(!validContact(values))return fail(ctx,'validation');if(!await consumeCaptcha(ctx))return fail(ctx,'captcha');const queued=await ctx.db.batch([
 ctx.db.prepare('INSERT INTO app_outbox(kind,recipient,subject,payload) VALUES(?,?,?,?)').bind('contact',ctx.env.MAIL_TO||'hongxuan_trimas@yahoo.com','Website contact enquiry',JSON.stringify(values)),
 ctx.db.prepare('INSERT INTO app_outbox(kind,recipient,subject,payload) VALUES(?,?,?,?)').bind('contact-customer-copy',values.email,'Thank you for your enquiry',JSON.stringify(values))]);
 await clearDraft(ctx);if(String(ctx.env.MAIL_MODE)==='https')for(const result of queued)await deliverQueuedMail(ctx,Number(result.meta.last_row_id));return redirect('/contactus.asp?submitted=1&delivery=queued');}
async function submitEnquiry(ctx:RequestContext):Promise<Response>{
 const values=contactValues(ctx);if(!validContact(values,true))return fail(ctx,'validation');
 // A completed cart is the idempotency key. A retry returns the same order, even after captcha consumption.
 const done=await first(ctx,'SELECT order_id FROM app_submissions WHERE cartid=? AND session_id=?',[ctx.session.cartId,ctx.session.id]);
 if(done?.order_id){await deliverOrderMail(ctx,String(done.order_id));return redirect('/cart_summary.asp?submitted=1&delivery=queued&order='+encodeURIComponent(String(done.order_id)));}
 if(!await consumeCaptcha(ctx))return fail(ctx,'captcha');
 const items=await all(ctx,'SELECT t.prod_id,t.prod_qty,p.prod_name FROM order_products_tmp t LEFT JOIN products p ON p.prod_id=t.prod_id WHERE t.tmp_order_id=?',[ctx.session.cartId]);
 if(!items.length)return fail(ctx,'empty');if(items.some(i=>!i.prod_name||Number(i.prod_qty)<1||Number(i.prod_qty)>9999))return fail(ctx,'product');
 const id=token(),cart=ctx.session.cartId;
 const statement=(sql:string,b:Value[]=[])=>ctx.db.prepare(sql).bind(...b);
 // One D1 batch is a transaction: the inserted submission owns this cart. Every subsequent write is gated by its random token.
 // A unique cart conflict is a concurrent duplicate and rolls back the entire batch; client can safely retry.
 try{await ctx.db.batch([
 statement('INSERT INTO app_submissions(token,session_id,cartid,snapshot) VALUES(?,?,?,?)',[id,ctx.session.id,cart,JSON.stringify(items)]),
 statement("UPDATE app_submissions SET order_id=(SELECT 'HX'||printf('%05d',seq) FROM counter WHERE type='ORDER') WHERE token=?",[id]),
 statement("UPDATE counter SET seq=seq+1 WHERE type='ORDER'"),
 statement("INSERT INTO orders(order_id,order_date,mem_name,mem_company,mem_email,mem_add,mem_contact,mem_fax,order_status,mem_enquiry) SELECT order_id,datetime('now','+8 hours'),?,?,?,?,?,?,'N',? FROM app_submissions WHERE token=?",[values.contactname,values.compname2,values.email,values.add,values.contactno,values.faxno,values.remarks,id]),
 statement("INSERT INTO order_products(order_id,prod_id,prod_qty) SELECT s.order_id,json_extract(j.value,'$.prod_id'),json_extract(j.value,'$.prod_qty') FROM app_submissions s,json_each(s.snapshot) j WHERE s.token=?",[id]),
 statement('INSERT INTO app_outbox(kind,order_id,recipient,subject,payload) SELECT ?,order_id,?,?,? FROM app_submissions WHERE token=?',['enquiry',ctx.env.MAIL_TO||'hongxuan_trimas@yahoo.com','Product enquiry',JSON.stringify({customer:values,items}),id]),
 statement('INSERT INTO app_outbox(kind,order_id,recipient,subject,payload) SELECT ?,order_id,?,?,? FROM app_submissions WHERE token=?',['customer-copy',values.email,'Thank you for your product enquiry',JSON.stringify({customer:values,items}),id]),
 statement('DELETE FROM order_products_tmp WHERE tmp_order_id=?',[cart])]);}catch(error){const duplicate=await first(ctx,'SELECT order_id FROM app_submissions WHERE cartid=? AND session_id=?',[cart,ctx.session.id]);if(!duplicate?.order_id){if(String(error).includes('CART_CHANGED'))return fail(ctx,'cart_changed');throw error;}}
 await clearDraft(ctx);
 const created=await first(ctx,'SELECT order_id FROM app_submissions WHERE cartid=? AND session_id=?',[cart,ctx.session.id]);
 if(created?.order_id)await deliverOrderMail(ctx,String(created.order_id));
 return redirect('/cart_summary.asp?submitted=1&delivery=queued&order='+encodeURIComponent(String(created?.order_id||'')));
}
function cartDestination(ctx:RequestContext,id:number):string{
 const fallback=new URL('/cart_summary.asp',ctx.url);
 let destination=fallback;
 const input=field(ctx,'redirect',2000);
 if(input&&!/^[a-z][a-z\d+.-]*:/i.test(input)&&!input.startsWith('//')&&!/[\\\r\n]/.test(input)){
  try{const candidate=new URL(input,ctx.url);if(candidate.origin===ctx.url.origin&&/^\/(?:details|our-products|our-brands|new-arrival|our-category|products|products_details|product_details|latest|category|brand|index|cart_summary)\.asp$/i.test(legacyRoutePath(candidate.pathname)))destination=candidate;}catch{}
 }
 const allowed=['id','prod_id','brand','brandid','catid','subcatid','model','keyword','pricerange','page','pagenum','search'];
 const params=new URLSearchParams();for(const key of allowed){const value=ctx.form.has(key)?field(ctx,key,500):destination.searchParams.get(key);if(value!==null)params.set(key,value.slice(0,500));}
 params.set('id',String(id));params.set('prod_id',String(id));
 return destination.pathname+'?'+params.toString();
}
export async function handleCore(ctx:RequestContext):Promise<PageResult|Response|null>{
 if(['/aspcaptcha.asp','/captcha.asp','/include/aspcaptcha.asp'].includes(ctx.path))return captcha(ctx);
 const action=ctx.request.method==='POST';if(!action){if(['/add_cart_action.asp','/checkout_action.asp'].includes(ctx.path))return new Response('Method not allowed',{status:405,headers:{Allow:'POST'}});return null;}
 const paths=['/add_cart_action.asp','/contactus.asp','/211212contactus.asp','/cart_summary.asp','/cartsum.asp','/checkout_action.asp'];if(!paths.includes(ctx.path))return null;
 if(!checkCsrf(ctx))return fail(ctx,'csrf');
 if(ctx.path==='/add_cart_action.asp'){
  const raw=field(ctx,'prod_id',20);if(!/^\d+$/.test(raw))return fail(ctx,'product');const id=Number(raw);if(!Number.isSafeInteger(id)||!await first(ctx,'SELECT prod_id FROM products WHERE prod_id=?',[id]))return fail(ctx,'product');
  // A submission may commit between this request's session read and its cart write.
  // Atomically resolve the current cart, then only add while that cart remains unsubmitted.
  let added=false;
  for(let attempt=0;attempt<3&&!added;attempt++){
   const current=await first(ctx,"UPDATE app_sessions SET cartid=CASE WHEN EXISTS(SELECT 1 FROM app_submissions WHERE cartid=app_sessions.cartid) THEN ? ELSE cartid END WHERE id=? RETURNING cartid",['modern-'+token(),ctx.session.id]);
   if(!current)return fail(ctx,'cart_changed');ctx.session.cartId=String(current.cartid);
   const result=await run(ctx,"INSERT INTO order_products_tmp(tmp_order_id,prod_id,prod_qty) SELECT ?,prod_id,1 FROM products WHERE prod_id=? AND NOT EXISTS(SELECT 1 FROM app_submissions WHERE cartid=?) ON CONFLICT(tmp_order_id,prod_id) WHERE tmp_order_id LIKE 'modern-%' DO UPDATE SET prod_qty=MIN(9999,prod_qty+1)",[ctx.session.cartId,id,ctx.session.cartId]);
   added=Number(result.meta.changes)>0;
  }
  if(!added)return fail(ctx,'cart_changed');
  const destination=cartDestination(ctx,id);return redirect(destination);
 }
 if(['/contactus.asp','/211212contactus.asp'].includes(ctx.path))return submitContact(ctx);
 const error=await updateCart(ctx);if(error)return error;
 if(ctx.path!=='/checkout_action.asp'&&ctx.form.has('contactname'))return submitEnquiry(ctx);
 return redirect('/cart_summary.asp');
}
