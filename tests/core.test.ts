import test from 'node:test';
import assert from 'node:assert/strict';
import { hashPassword, verifyPassword, checkCsrf } from '../src/server/core.ts';
test('password hashing is salted, case sensitive and rejects invalid encodings',async()=>{
 const a=await hashPassword('Password x'); const b=await hashPassword('Password x');
 assert.notEqual(a,b); assert.ok(await verifyPassword('Password x',a)); assert.equal(await verifyPassword('password x',a),false); assert.equal(await verifyPassword('Password x','legacy'),false);
});
test('CSRF requires the correct form token and rejects foreign origins',()=>{
 const form=new FormData(); form.set('_csrf','secret');
 const ctx={form,session:{csrf:'secret'},url:new URL('https://example.test/cart_summary.asp'),request:new Request('https://example.test/cart_summary.asp',{method:'POST',headers:{origin:'https://evil.test'}})};
 assert.equal(checkCsrf(ctx as never),false);
 ctx.request=new Request(ctx.url,{method:'POST',headers:{origin:ctx.url.origin}}); assert.equal(checkCsrf(ctx as never),true);form.set('_csrf','bad');assert.equal(checkCsrf(ctx as never),false);
});

import { DatabaseSync } from 'node:sqlite';
import { readFileSync, readdirSync } from 'node:fs';
import { createContext, handleCore, saveSession, requireUser } from '../src/server/core.ts';
function fixture(){
 const sqlite=new DatabaseSync(':memory:');for(const migration of readdirSync('migrations').filter(f=>f.endsWith('.sql')).sort())sqlite.exec(readFileSync('migrations/'+migration,'utf8'));
 sqlite.exec("INSERT INTO products(prod_id,prod_name) VALUES(1,'Wire'),(2,'Terminal');INSERT INTO counter(type,seq) VALUES('ORDER',1)");
 function prepare(sql:string){let values:unknown[]=[];return {bind(...args:unknown[]){values=args;return this;},async all(){return {results:sqlite.prepare(sql).all(...values as never[]),success:true};},async first(){return sqlite.prepare(sql).get(...values as never[])??null;},async run(){const result=sqlite.prepare(sql).run(...values as never[]);return {success:true,meta:{changes:result.changes,last_row_id:result.lastInsertRowid},results:[]};}};}
 const db={prepare,async batch(statements:ReturnType<typeof prepare>[]){sqlite.exec('BEGIN');try{const result=[];for(const s of statements)result.push(await s.run());sqlite.exec('COMMIT');return result;}catch(e){sqlite.exec('ROLLBACK');throw e;}}};
 const env={DB:db,UPLOADS:{},MAIL_TO:'business@example.test'};
 function browser(){let sessionCookie='';const cookies={get(){return sessionCookie?{value:sessionCookie}:undefined;},set(_name:string,value:string){sessionCookie=value;}};
 return async(path:string,fields?:Record<string,string>)=>{const url=new URL(path,'https://example.test');return createContext({url,request:new Request(url,fields?{method:'POST',body:new URLSearchParams(fields),headers:{origin:url.origin}}:undefined),cookies: cookies as never,env:env as never});};}
 return {sqlite,browser};
}
test('sessions persist and arbitrary client cart IDs cannot access another browser cart',async()=>{
 const {sqlite,browser}=fixture();const a=browser(),b=browser();const ca=await a('/');const cb=await b('/');assert.notEqual(ca.session.cartId,cb.session.cartId);
 const add=await a('/add_cart_action.asp',{_csrf:ca.session.csrf,prod_id:'1',tmp_id:cb.session.cartId});assert.equal((await handleCore(add) as Response).status,303);
 assert.equal(sqlite.prepare('SELECT tmp_order_id FROM order_products_tmp').get()!.tmp_order_id,ca.session.cartId);
 assert.equal((await a('/')).session.id,ca.session.id);
 const forged=await b('/add_cart_action.asp',{_csrf:ca.session.csrf,prod_id:'2'});assert.match((await handleCore(forged) as Response).headers.get('location')!,/csrf/);
});
test('enquiry preserves fields, allocates one order, queues two messages and is retry safe',async()=>{
 const {sqlite,browser}=fixture();const a=browser();const initial=await a('/');
 await handleCore(await a('/add_cart_action.asp',{_csrf:initial.session.csrf,prod_id:'1'}));
 await handleCore(await a('/aspcaptcha.asp'));
 const code=String(sqlite.prepare('SELECT code FROM app_captcha').get()!.code);
 const fields={_csrf:initial.session.csrf,contactname:"O'Brien",compname2:'Company',email:'buyer@example.test',add:'Address',contactno:'123',remarks:'Hello',strCAPTCHA:code,recipient:'attacker@example.test',tmp_id:'other-cart'};
 const firstResponse=await handleCore(await a('/cart_summary.asp',fields)) as Response;
 assert.match(firstResponse.headers.get('location')!,/order=HX00001/);
 const retry=await handleCore(await a('/cart_summary.asp',fields)) as Response;assert.equal(retry.headers.get('location'),firstResponse.headers.get('location'));
 assert.equal(sqlite.prepare('SELECT count(*) n FROM orders').get()!.n,1);assert.equal(sqlite.prepare('SELECT mem_name FROM orders').get()!.mem_name,"O'Brien");
 assert.equal(sqlite.prepare('SELECT count(*) n FROM order_products_tmp').get()!.n,0);assert.equal(sqlite.prepare('SELECT count(*) n FROM app_outbox').get()!.n,2);
 assert.equal(sqlite.prepare("SELECT recipient FROM app_outbox WHERE kind='enquiry'").get()!.recipient,'business@example.test');
 await handleCore(await a('/add_cart_action.asp',{_csrf:initial.session.csrf,prod_id:'2'}));assert.notEqual((await a('/')).session.cartId,initial.session.cartId);
});
test('captcha expires and is one-use; malformed quantities cannot partially change cart',async()=>{
 const {sqlite,browser}=fixture();const a=browser();const initial=await a('/');await handleCore(await a('/add_cart_action.asp',{_csrf:initial.session.csrf,prod_id:'1'}));
 const res=await handleCore(await a('/cart_summary.asp',{_csrf:initial.session.csrf,qty_1:'-1'})) as Response;assert.match(res.headers.get('location')!,/quantity/);assert.equal(sqlite.prepare('SELECT prod_qty FROM order_products_tmp').get()!.prod_qty,1);
 await handleCore(await a('/aspcaptcha.asp'));const fields={_csrf:initial.session.csrf,contactname:'Name',email:'buyer@example.test',add:'Address',contactno:'123',remarks:'Test question',strCAPTCHA:'wrong'};
 assert.match((await handleCore(await a('/contactus.asp',fields)) as Response).headers.get('location')!,/captcha/);assert.equal(sqlite.prepare('SELECT count(*) n FROM app_captcha').get()!.n,0);assert.equal(sqlite.prepare('SELECT count(*) n FROM app_outbox').get()!.n,0);
});
test('disabled accounts and changed groups are checked from the database on every authorization',async()=>{
 const {sqlite,browser}=fixture();const a=browser();const ctx=await a('/');sqlite.exec("INSERT INTO tblusers(userid,userstatus,usergroup) VALUES(7,1,2)");ctx.session.userId=7;ctx.session.groupId=1;await saveSession(ctx);
 assert.equal((await requireUser(ctx,true))!.status,403);sqlite.exec('UPDATE tblusers SET userstatus=0 WHERE userid=7');assert.equal((await requireUser(ctx))!.status,303);assert.equal(ctx.session.userId,null);
});

test('failed enquiry batch rolls back numbering, header, lines and cart deletion',async()=>{
 const {sqlite,browser}=fixture();const a=browser();const initial=await a('/');await handleCore(await a('/add_cart_action.asp',{_csrf:initial.session.csrf,prod_id:'1'}));await handleCore(await a('/aspcaptcha.asp'));
 const code=String(sqlite.prepare('SELECT code FROM app_captcha').get()!.code);sqlite.exec('DROP TABLE app_outbox');
 const ctx=await a('/cart_summary.asp',{_csrf:initial.session.csrf,contactname:'Name',email:'buyer@example.test',add:'Address',contactno:'123',remarks:'Test question',strCAPTCHA:code});
 await assert.rejects(()=>handleCore(ctx),/no such table/);
 assert.equal(sqlite.prepare('SELECT count(*) n FROM orders').get()!.n,0);assert.equal(sqlite.prepare('SELECT seq FROM counter').get()!.seq,1);assert.equal(sqlite.prepare('SELECT count(*) n FROM order_products_tmp').get()!.n,1);assert.equal(sqlite.prepare('SELECT count(*) n FROM app_submissions').get()!.n,0);
});
test('independent enquiry carts allocate distinct sequential order numbers',async()=>{
 const {sqlite,browser}=fixture();const clients=[browser(),browser()];const submissions=[];
 for(const a of clients){const ctx=await a('/');await handleCore(await a('/add_cart_action.asp',{_csrf:ctx.session.csrf,prod_id:'1'}));await handleCore(await a('/aspcaptcha.asp'));const code=String(sqlite.prepare('SELECT code FROM app_captcha WHERE session_id=?').get(ctx.session.id)!.code);submissions.push(await a('/cart_summary.asp',{_csrf:ctx.session.csrf,contactname:'Name',email:'buyer@example.test',add:'Address',contactno:'123',remarks:'Test question',strCAPTCHA:code}));}
 // SQLite adapter has a single transaction connection; D1 itself serializes atomic batches.
 for(const ctx of submissions)await handleCore(ctx);
 assert.deepEqual(sqlite.prepare('SELECT order_id FROM orders ORDER BY order_id').all().map(r=>r.order_id),['HX00001','HX00002']);
});

test('legacy checkout action updates quantities even when the enquiry fields are present',async()=>{
 const {sqlite,browser}=fixture();const a=browser();const initial=await a('/');await handleCore(await a('/add_cart_action.asp',{_csrf:initial.session.csrf,prod_id:'1'}));
 const response=await handleCore(await a('/checkout_action.asp',{_csrf:initial.session.csrf,qty_1:'3',contactname:'',email:''})) as Response;
 assert.equal(response.headers.get('location'),'/cart_summary.asp');assert.equal(sqlite.prepare('SELECT prod_qty FROM order_products_tmp').get()!.prod_qty,3);
});

test('clean cart endpoints retain clean product return URLs and category context',async()=>{
 const {browser}=fixture();const a=browser();const initial=await a('/');
 const response=await handleCore(await a('/add_cart_action',{_csrf:initial.session.csrf,prod_id:'1',redirect:'/details?prod_id=1&catid=A&page=3'})) as Response;
 const destination=new URL(response.headers.get('location')!,'https://example.test');assert.equal(destination.pathname,'/details');assert.equal(destination.searchParams.get('catid'),'A');assert.equal(destination.searchParams.get('page'),'3');
});
test('cart redirects retain actual original product URLs and reject external destinations',async()=>{
 const {browser}=fixture();const a=browser();const initial=await a('/');
 for(const dest of ['details.asp','our-products.asp','our-brands.asp','new-arrival.asp']){
 const response=await handleCore(await a('/add_cart_action.asp',{_csrf:initial.session.csrf,prod_id:'1',redirect:dest,keyword:'wire & terminal'})) as Response;assert.ok(response.headers.get('location')!.startsWith('/'+dest+'?'));assert.ok(response.headers.get('location')!.includes('keyword=wire+%26+terminal'));
 }
 const res=await handleCore(await a('/add_cart_action.asp',{_csrf:initial.session.csrf,prod_id:'1',redirect:'//evil.test'})) as Response;assert.ok(res.headers.get('location')!.startsWith('/cart_summary.asp'));
});
test('dated original contact variant uses the same protected mail submission',async()=>{
 const {sqlite,browser}=fixture();const a=browser();const initial=await a('/');await handleCore(await a('/aspcaptcha.asp'));const code=String(sqlite.prepare('SELECT code FROM app_captcha').get()!.code);
 const response=await handleCore(await a('/211212contactus.asp',{_csrf:initial.session.csrf,contactname:'Name',email:'buyer@example.test',add:'Address',contactno:'123',remarks:'Test question',strCAPTCHA:code})) as Response;
 assert.equal(response.status,303);assert.equal(sqlite.prepare('SELECT count(*) n FROM app_outbox').get()!.n,2);
});

test('expired captcha and products deleted before submission cannot create enquiries',async()=>{
 const {sqlite,browser}=fixture();const a=browser();const initial=await a('/');await handleCore(await a('/add_cart_action.asp',{_csrf:initial.session.csrf,prod_id:'1'}));
 const fields={_csrf:initial.session.csrf,contactname:'Name',email:'buyer@example.test',add:'Address',contactno:'123',remarks:'Test question',strCAPTCHA:''};
 await handleCore(await a('/aspcaptcha.asp'));fields.strCAPTCHA=String(sqlite.prepare('SELECT code FROM app_captcha').get()!.code);sqlite.exec('UPDATE app_captcha SET expires=0');
 assert.match((await handleCore(await a('/cart_summary.asp',fields)) as Response).headers.get('location')!,/captcha/);
 await handleCore(await a('/aspcaptcha.asp'));fields.strCAPTCHA=String(sqlite.prepare('SELECT code FROM app_captcha').get()!.code);sqlite.exec('DELETE FROM products WHERE prod_id=1');
 assert.match((await handleCore(await a('/cart_summary.asp',fields)) as Response).headers.get('location')!,/product/);assert.equal(sqlite.prepare('SELECT count(*) n FROM orders').get()!.n,0);assert.equal(sqlite.prepare('SELECT count(*) n FROM order_products_tmp').get()!.n,1);
});

test('contact address is optional, remarks required, and failed forms retain private server-side drafts',async()=>{
 const {sqlite,browser}=fixture();const a=browser();const initial=await a('/');
 const fields={_csrf:initial.session.csrf,contactname:'Test Name',contactno:'12345',email:'buyer@example.test',remarks:'Test question',add:'',strCAPTCHA:'wrong'};
 const response=await handleCore(await a('/contactus.asp',fields)) as Response;assert.equal(new URL(response.headers.get('location')!,'https://example.test').searchParams.get('error'),'captcha');
 const restored=await a(response.headers.get('location')!);assert.equal(restored.params.get('remarks'),'Test question');assert.equal(restored.params.get('email'),'buyer@example.test');assert.equal(restored.url.searchParams.has('email'),false);
 await handleCore(await a('/aspcaptcha.asp'));fields.strCAPTCHA=String(sqlite.prepare('SELECT code FROM app_captcha').get()!.code);
 const success=await handleCore(await a('/contactus.asp',fields)) as Response;assert.ok(success.headers.get('location')!.includes('submitted=1'));assert.equal(sqlite.prepare("SELECT count(*) n FROM app_outbox WHERE kind='contact'").get()!.n,1);
 const invalid=await handleCore(await a('/contactus.asp',{...fields,remarks:''})) as Response;assert.ok(invalid.headers.get('location')!.includes('error=validation'));
});
test('detail redirect retains local query context and canonical product ID',async()=>{
 const {browser}=fixture();const a=browser();const initial=await a('/');const response=await handleCore(await a('/add_cart_action.asp',{_csrf:initial.session.csrf,prod_id:'1',redirect:'/details.asp?prod_id=1&catid=A&page=3&keyword=wire%20and%20terminal&recipient=evil'})) as Response;
 const location=new URL(response.headers.get('location')!,'https://example.test');assert.equal(location.pathname,'/details.asp');assert.equal(location.searchParams.get('prod_id'),'1');assert.equal(location.searchParams.get('catid'),'A');assert.equal(location.searchParams.get('page'),'3');assert.equal(location.searchParams.get('keyword'),'wire and terminal');assert.equal(location.searchParams.has('recipient'),false);
});

test('configured HTTPS delivery records failures, retries with stable idempotency and marks successful delivery once',async()=>{
 const {sqlite,browser}=fixture();const ctx=await browser()('/');
 const { queueMail, deliverQueuedMail }=await import('../src/server/core.ts');
 await queueMail(ctx,'contact','buyer@example.test','Test enquiry',{contactname:'Test',email:'buyer@example.test',remarks:'Question'});
 const id=Number(sqlite.prepare('SELECT id FROM app_outbox').get()!.id);ctx.env={...ctx.env,MAIL_MODE:'https',MAIL_API_URL:'https://api.mail.example/send',MAIL_API_TOKEN:'test-token',MAIL_FROM:'sender@example.test'} as never;
 let calls=0;const keys:string[]=[];const provider:typeof fetch=async(_url,options)=>{calls++;keys.push(new Headers(options?.headers).get('Idempotency-Key')!);const payload=JSON.parse(String(options?.body));assert.equal(payload.from,'sender@example.test');assert.deepEqual(payload.to,['buyer@example.test']);assert.equal(new Headers(options?.headers).get('Authorization'),'Bearer test-token');return new Response('{}',{status:calls===1?503:200});};
 await deliverQueuedMail(ctx,id,provider);assert.equal(sqlite.prepare('SELECT state FROM app_outbox').get()!.state,'failed');
 sqlite.exec('UPDATE app_outbox SET next_attempt_at=0');await deliverQueuedMail(ctx,id,provider);assert.equal(sqlite.prepare('SELECT state FROM app_outbox').get()!.state,'sent');assert.equal(sqlite.prepare('SELECT attempts FROM app_outbox').get()!.attempts,2);
 await deliverQueuedMail(ctx,id,provider);assert.equal(calls,2);assert.equal(keys[0],keys[1]);
});

import { execFileSync } from 'node:child_process';
import { writeFileSync } from 'node:fs';
test('live HTTP: isolated carts, simultaneous enquiries, retry idempotency and optional contact address',{skip:process.env.RUN_LIVE_CORE!=='1'},async()=>{
 const base=process.env.CORE_HTTP_BASE||'http://127.0.0.1:4321';const marker='MIGRATION_CORE_HTTP_'+crypto.randomUUID();const sessions:string[]=[];
 function sql(query:string){const path='private-data/live-core-query.sql';writeFileSync(path,query);const out=execFileSync(process.execPath,['node_modules/wrangler/bin/wrangler.js','d1','execute','hongxuan','--local','--file',path,'--json'],{encoding:'utf8',maxBuffer:16*1024*1024,stdio:['ignore','pipe','pipe']});return JSON.parse(out)[0].results as Record<string,string|number|null>[];}
 const quote=(s:string)=>"'"+s.replaceAll("'","''")+"'";
 const baseline=sql("SELECT (SELECT count(*) FROM orders) orders,(SELECT count(*) FROM order_products) lines,(SELECT count(*) FROM order_products_tmp) carts,(SELECT count(*) FROM app_outbox) outbox,(SELECT seq FROM counter WHERE type='ORDER') seq,(SELECT prod_id FROM products ORDER BY prod_id LIMIT 1) product")[0];
 function client(){let cookie='';return async(path:string,fields?:Record<string,string>)=>{const res=await fetch(base+path,{redirect:'manual',headers:{...(cookie?{Cookie:cookie}:{}),...(fields?{Origin:base}:{})},...(fields?{method:'POST',body:new URLSearchParams(fields)}:{})});for(const c of res.headers.getSetCookie()){if(c.startsWith('hx_session=')){cookie=c.split(';')[0];const id=cookie.slice('hx_session='.length);if(!sessions.includes(id))sessions.push(id);}}const text=await res.text();assert.ok(res.status<500,'live Worker responded without a server error');return {res,text};};}
 const csrfOf=(html:string)=>{const value=/name="_csrf"[^>]*value="([^"]+)"/.exec(html)?.[1];assert.ok(value,'rendered form includes CSRF');return value;};
 const captchaOf=async(c:ReturnType<typeof client>)=>{const {text}=await c('/aspcaptcha');const value=/<text\b[^>]*>(\d+)<\/text>/.exec(text)?.[1];assert.ok(value,'captcha SVG includes a test-readable challenge');return value;};
 let completed=false;
 try{
  const a=client(),b=client();const initialA=await a('/contactus'),initialB=await b('/contactus');const csrfA=csrfOf(initialA.text),csrfB=csrfOf(initialB.text);const product=String(baseline.product);
  const added=await a('/add_cart_action',{_csrf:csrfA,prod_id:product,redirect:'/details?prod_id='+product+'&catid=TEST&page=2'});const destination=new URL(added.res.headers.get('location')!,base);assert.equal(destination.pathname,'/details');assert.equal(destination.searchParams.get('prod_id'),product);assert.equal(destination.searchParams.get('page'),'2');
  assert.ok((await a('/cart_summary')).text.includes('name="qty_'+product+'"'));assert.equal((await b('/cart_summary')).text.includes('name="qty_'+product+'"'),false,'other browser cannot see cart');
  const forbidden=await b('/add_cart_action',{_csrf:csrfA,prod_id:product,tmp_id:sessions[0]});assert.ok(forbidden.res.headers.get('location')?.includes('error=csrf'));
  await b('/add_cart_action',{_csrf:csrfB,prod_id:product});
  const fieldsA={_csrf:csrfA,contactname:marker,contactno:'123456',email:'migration-validation@example.invalid',add:'Disposable validation address',remarks:'Synthetic HTTP integration test',strCAPTCHA:await captchaOf(a)};
  const fieldsB={...fieldsA,_csrf:csrfB,strCAPTCHA:await captchaOf(b)};
  const result=await Promise.all([a('/cartsum',fieldsA),b('/cartsum',fieldsB)]);const orders=result.map(r=>new URL(r.res.headers.get('location')!,base).searchParams.get('order'));assert.ok(orders.every(Boolean),'both simultaneous submissions created an order');assert.notEqual(orders[0],orders[1]);
  const retry=await a('/cartsum',fieldsA);assert.equal(new URL(retry.res.headers.get('location')!,base).searchParams.get('order'),orders[0]);
  const contact=await a('/contactus',{_csrf:csrfA,contactname:marker,contactno:'123456',email:'migration-validation@example.invalid',remarks:'Contact with optional address omitted',strCAPTCHA:await captchaOf(a)});assert.ok(contact.res.headers.get('location')?.includes('submitted=1'));
  // Race another tab's quantity edit against submission, accepting only a consistent snapshot or an explicit retry.
  await a('/add_cart_action',{_csrf:csrfA,prod_id:product});
  const raceFields={...fieldsA,strCAPTCHA:await captchaOf(a)};
  const [quantityEdit,raced]=await Promise.all([a('/checkout_action',{_csrf:csrfA,['qty_'+product]:'4'}),a('/cartsum',raceFields)]);
  const raceLocation=new URL(raced.res.headers.get('location')!,base);const raceOrder=raceLocation.searchParams.get('order');
  if(raceOrder){
   const snapshot=sql(`SELECT p.prod_qty quantity,json_extract(o.payload,'$.items[0].prod_qty') mail_quantity FROM order_products p JOIN app_outbox o ON o.order_id=p.order_id AND o.kind='enquiry' WHERE p.order_id=${quote(raceOrder)}`)[0];assert.equal(snapshot.quantity,snapshot.mail_quantity,'committed order and mail use identical quantities');
   if(!quantityEdit.res.headers.get('location')?.includes('error='))assert.equal(snapshot.quantity,4,'acknowledged edit appears in submitted snapshot');
  }else{assert.equal(raceLocation.searchParams.get('error'),'cart_changed');const current=sql(`SELECT prod_qty FROM order_products_tmp WHERE tmp_order_id=(SELECT cartid FROM app_sessions WHERE id=${quote(sessions[0])})`)[0];assert.equal(current.prod_qty,4,'rejected submission preserves the concurrent edit');}
  const counts=sql(`SELECT (SELECT count(*) FROM orders WHERE mem_name=${quote(marker)}) orders,(SELECT count(*) FROM app_outbox WHERE json_extract(payload,'$.contactname')=${quote(marker)} OR json_extract(payload,'$.customer.contactname')=${quote(marker)}) messages`)[0];assert.equal(counts.orders,raceOrder?3:2);assert.equal(counts.messages,raceOrder?8:6);
  completed=true;
 }finally{
  const markerSql=quote(marker);const sessionSql=sessions.map(quote).join(',')||"''";
  const fixtureOrders=Number(sql(`SELECT count(*) n FROM orders WHERE mem_name=${markerSql}`)[0].n);
  sql(`DELETE FROM order_products WHERE order_id IN(SELECT order_id FROM orders WHERE mem_name=${markerSql});DELETE FROM app_submissions WHERE order_id IN(SELECT order_id FROM orders WHERE mem_name=${markerSql});DELETE FROM app_outbox WHERE json_extract(payload,'$.contactname')=${markerSql} OR json_extract(payload,'$.customer.contactname')=${markerSql};DELETE FROM orders WHERE mem_name=${markerSql};DELETE FROM order_products_tmp WHERE tmp_order_id IN(SELECT cartid FROM app_sessions WHERE id IN(${sessionSql}));DELETE FROM app_captcha WHERE session_id IN(${sessionSql});DELETE FROM app_form_drafts WHERE session_id IN(${sessionSql});DELETE FROM app_sessions WHERE id IN(${sessionSql});UPDATE counter SET seq=${baseline.seq} WHERE type='ORDER' AND seq=${Number(baseline.seq)+fixtureOrders};`);
  const after=sql('SELECT (SELECT count(*) FROM orders) orders,(SELECT count(*) FROM order_products) lines,(SELECT count(*) FROM order_products_tmp) carts,(SELECT count(*) FROM app_outbox) outbox')[0];for(const key of ['orders','lines','carts','outbox'])assert.equal(after[key],baseline[key],`disposable ${key} removed`);
  writeFileSync('private-data/live-core-http.json',JSON.stringify({checkedAt:new Date().toISOString(),base,passed:completed,checks:['isolated-session-carts','foreign-CSRF-rejected','local-detail-redirect-context','simultaneous-distinct-order-numbers','idempotent-retry','contact-address-optional','durable-business-and-visitor-outbox','simultaneous-cart-edit-snapshot-consistency'],cleanupVerified:true},null,2));
 }
});

test('GET cart mutation endpoints return 405 without changing any cart',async()=>{
 const {sqlite,browser}=fixture();const a=browser();for(const path of ['/add_cart_action.asp','/checkout_action.asp']){const response=await handleCore(await a(path)) as Response;assert.equal(response?.status,405);assert.equal(response.headers.get('Allow'),'POST');}assert.equal(sqlite.prepare('SELECT count(*) n FROM order_products_tmp').get()!.n,0);
});
test('contact queues both server recipient and visitor acknowledgement from original source semantics',async()=>{
 const {sqlite,browser}=fixture();const a=browser();const initial=await a('/');await handleCore(await a('/aspcaptcha.asp'));const code=String(sqlite.prepare('SELECT code FROM app_captcha').get()!.code);
 await handleCore(await a('/contactus.asp',{_csrf:initial.session.csrf,contactname:'Test',contactno:'123456',email:'buyer@example.test',remarks:'Question',strCAPTCHA:code}));
 const recipients=sqlite.prepare('SELECT recipient FROM app_outbox ORDER BY id').all().map(r=>r.recipient);assert.deepEqual(recipients,['business@example.test','buyer@example.test']);
});

test('business mail defaults to the source recipient without trusting hidden recipient fields',async()=>{
 const {sqlite,browser}=fixture();const a=browser();const initial=await a('/');await handleCore(await a('/aspcaptcha.asp'));const code=String(sqlite.prepare('SELECT code FROM app_captcha').get()!.code);
 const ctx=await a('/contactus.asp',{_csrf:initial.session.csrf,contactname:'Test',contactno:'123456',email:'buyer@example.test',remarks:'Question',strCAPTCHA:code,recipient:'attacker@example.test'});ctx.env={...ctx.env,MAIL_TO:''} as never;await handleCore(ctx);
 assert.equal(sqlite.prepare("SELECT recipient FROM app_outbox WHERE kind='contact'").get()!.recipient,'hongxuan_trimas@yahoo.com');
 await handleCore(await a('/add_cart_action.asp',{_csrf:initial.session.csrf,prod_id:'1'}));await handleCore(await a('/aspcaptcha.asp'));const challenge=String(sqlite.prepare('SELECT code FROM app_captcha').get()!.code);
 const enquiry=await a('/cartsum.asp',{_csrf:initial.session.csrf,contactname:'Test',contactno:'123456',email:'buyer@example.test',add:'Address',strCAPTCHA:challenge,recipient:'attacker@example.test'});enquiry.env={...enquiry.env,MAIL_TO:''} as never;await handleCore(enquiry);
 assert.equal(sqlite.prepare("SELECT recipient FROM app_outbox WHERE kind='enquiry'").get()!.recipient,'hongxuan_trimas@yahoo.com');
});

test('cart changes after preflight roll back enquiry without losing changed quantities or newly added items',async()=>{
 for(const mutation of ['UPDATE order_products_tmp SET prod_qty=4','INSERT INTO order_products_tmp(tmp_order_id,prod_id,prod_qty) SELECT tmp_order_id,2,1 FROM order_products_tmp LIMIT 1','DELETE FROM products WHERE prod_id=1','DELETE FROM order_products_tmp']){
 const {sqlite,browser}=fixture();const a=browser();const initial=await a('/');await handleCore(await a('/add_cart_action.asp',{_csrf:initial.session.csrf,prod_id:'1'}));await handleCore(await a('/aspcaptcha.asp'));const code=String(sqlite.prepare('SELECT code FROM app_captcha').get()!.code);
 const ctx=await a('/cartsum.asp',{_csrf:initial.session.csrf,contactname:'Test',email:'buyer@example.test',add:'Address',contactno:'123',strCAPTCHA:code});const original=ctx.db;ctx.db={prepare:original.prepare.bind(original),batch:async(statements:D1PreparedStatement[])=>{sqlite.exec(mutation);return original.batch(statements);}} as never;
 const result=await handleCore(ctx) as Response;assert.match(result.headers.get('location')!,/error=cart_changed/);assert.equal(sqlite.prepare('SELECT count(*) n FROM orders').get()!.n,0);assert.equal(sqlite.prepare('SELECT seq FROM counter').get()!.seq,1);assert.equal(Number(sqlite.prepare('SELECT count(*) n FROM order_products_tmp').get()!.n)>0,mutation!=='DELETE FROM order_products_tmp');assert.equal(sqlite.prepare('SELECT count(*) n FROM app_outbox').get()!.n,0);
 if(mutation.startsWith('UPDATE'))assert.equal(sqlite.prepare('SELECT prod_qty FROM order_products_tmp').get()!.prod_qty,4);
 }
});
test('scheduled outbox drain retries due contacts and member mail but skips outbox mode, backoff, exhausted attempts and sent rows',async()=>{
 const {sqlite,browser}=fixture();const ctx=await browser()('/');const {queueMail,drainOutbox}=await import('../src/server/core.ts');
 await queueMail(ctx,'contact','buyer@example.test','Contact',{remarks:'Question'});await queueMail(ctx,'member-approval','member@example.test','Approved',{});
 const ids=sqlite.prepare('SELECT id FROM app_outbox ORDER BY id').all().map(r=>Number(r.id));let calls=0;const keys:string[]=[];const provider:typeof fetch=async(_url,options)=>{calls++;keys.push(new Headers(options?.headers).get('Idempotency-Key')!);return new Response('{}',{status:calls===1?503:200});};
 await drainOutbox(ctx.env,provider);assert.equal(calls,0);ctx.env={...ctx.env,MAIL_MODE:'https',MAIL_API_URL:'https://mail.example/send',MAIL_FROM:'sender@example.test',MAIL_API_TOKEN:'token'} as never;
 await drainOutbox(ctx.env,provider);assert.equal(calls,2);assert.equal(sqlite.prepare('SELECT state FROM app_outbox WHERE id=?').get(ids[0])!.state,'failed');
 await drainOutbox(ctx.env,provider);assert.equal(calls,2,'backoff suppresses immediate retries');sqlite.exec('UPDATE app_outbox SET next_attempt_at=0');await drainOutbox(ctx.env,provider);assert.equal(calls,3);assert.equal(keys[0],keys[2]);
 sqlite.exec("UPDATE app_outbox SET state='failed',attempts=8,next_attempt_at=0");await drainOutbox(ctx.env,provider);assert.equal(calls,3,'attempt cap prevents endless retries');
 sqlite.exec("INSERT INTO app_outbox(kind,recipient,subject,payload,state,attempts,lease_until) VALUES('expired','test@example.invalid','Test','{}','sending',1,0),('leased','test@example.invalid','Test','{}','sending',1,9999999999999)");
 await drainOutbox(ctx.env,provider);assert.equal(calls,4,'expired delivery lease is retried');assert.equal(sqlite.prepare("SELECT state FROM app_outbox WHERE kind='leased'").get()!.state,'sending');
 for(let n=0;n<7;n++)sqlite.prepare("INSERT INTO app_outbox(kind,recipient,subject,payload) VALUES('bounded','test@example.invalid','Test','{}')").run();
 await drainOutbox(ctx.env,provider);assert.equal(calls,9,'one drain attempts at most five messages');assert.equal(sqlite.prepare("SELECT count(*) n FROM app_outbox WHERE kind='bounded' AND state='queued'").get()!.n,2);

});

test('real D1 batch rejects a cart mutation injected between preflight and transaction',async()=>{
 const wrangler=await import('wrangler');const {getPlatformProxy}=wrangler;const splitSqlQuery=Reflect.get(wrangler,'unstable_splitSqlQuery') as (sql:string)=>string[];const platform=await getPlatformProxy<Env>({persist:false,remoteBindings:false});
 try{
  const db=platform.env.DB;for(const migration of readdirSync('migrations').filter(f=>f.endsWith('.sql')).sort())for(const statement of splitSqlQuery(readFileSync('migrations/'+migration,'utf8')))await db.prepare(statement).run();
  await db.prepare("INSERT INTO products(prod_id,prod_name) VALUES(1,'Wire')").run();await db.prepare("INSERT INTO counter(type,seq) VALUES('ORDER',1)").run();
  let cookie='';const cookies={get(){return cookie?{value:cookie}:undefined;},set(_name:string,value:string){cookie=value;}};
  const context=async(path:string,fields?:Record<string,string>)=>{const url=new URL(path,'https://example.test');return createContext({url,request:new Request(url,fields?{method:'POST',body:new URLSearchParams(fields),headers:{origin:url.origin}}:undefined),cookies:cookies as never,env:platform.env});};
  const initial=await context('/');await handleCore(await context('/add_cart_action.asp',{_csrf:initial.session.csrf,prod_id:'1'}));await handleCore(await context('/aspcaptcha.asp'));const challenge=await db.prepare('SELECT code FROM app_captcha WHERE session_id=?').bind(initial.session.id).first<{code:string}>();
  const ctx=await context('/cartsum.asp',{_csrf:initial.session.csrf,contactname:'Synthetic validation',email:'validation@example.invalid',add:'Test',contactno:'123',strCAPTCHA:challenge!.code});
  ctx.db={prepare:db.prepare.bind(db),batch:async(statements:D1PreparedStatement[])=>{await db.prepare('UPDATE order_products_tmp SET prod_qty=4 WHERE tmp_order_id=?').bind(initial.session.cartId).run();return db.batch(statements);}} as never;
  const response=await handleCore(ctx) as Response;assert.match(response.headers.get('location')!,/error=cart_changed/);
  assert.equal((await db.prepare('SELECT count(*) n FROM orders').first<{n:number}>())!.n,0);assert.equal((await db.prepare('SELECT prod_qty FROM order_products_tmp').first<{prod_qty:number}>())!.prod_qty,4);assert.equal((await db.prepare('SELECT count(*) n FROM app_outbox').first<{n:number}>())!.n,0);
 }finally{await platform.dispose();}
});
