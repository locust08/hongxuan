import type { RequestContext, Row } from '../contracts.ts';

export type MailContext=Pick<RequestContext,'db'|'env'>;
const MAX_ATTEMPTS=8;
const DRAIN_LIMIT=5;

/** A Resend-compatible HTTPS transport. Outbox is always durable before network I/O. */
export async function queueMail(ctx:MailContext,kind:string,recipient:string,subject:string,payload:Record<string,unknown>,orderId:string|null=null):Promise<void>{
 const result=await ctx.db.prepare('INSERT INTO app_outbox(kind,order_id,recipient,subject,payload) VALUES(?,?,?,?,?)').bind(kind,orderId,recipient,subject,JSON.stringify(payload)).run();
 if(String(ctx.env.MAIL_MODE)==='https')await deliverQueuedMail(ctx,Number(result.meta.last_row_id));
}
function bodyText(kind:string,payload:Record<string,unknown>):string{
 const customer=payload.customer&&typeof payload.customer==='object'?payload.customer as Record<string,unknown>:payload;
 const details=['contactname','compname','compname2','email','add','state','countrydesc','contactno','faxno','remarks'].filter(key=>customer[key]).map(key=>`${key}: ${String(customer[key])}`).join('\n');
 const items=Array.isArray(payload.items)?payload.items.map((item:Record<string,unknown>)=>`Product: ${String(item.prod_name||item.prod_id)}\nQuantity: ${String(item.prod_qty)}`).join('\n\n'):'';
 return `${kind.endsWith('customer-copy')?'Thank you for your product enquiry.':'Website enquiry'}\n\n${items?items+'\n\n':''}${details}`;
}
export async function deliverQueuedMail(ctx:MailContext,id:number,transport:typeof fetch=fetch):Promise<void>{
 if(String(ctx.env.MAIL_MODE)!=='https')return;
 const now=Date.now();
 const row=await ctx.db.prepare("UPDATE app_outbox SET state='sending',attempts=attempts+1,lease_until=?,delivery_key=COALESCE(delivery_key,?) WHERE id=? AND attempts<? AND next_attempt_at<=? AND (state IN ('queued','failed') OR (state='sending' AND lease_until<?)) RETURNING *").bind(now+60000,crypto.randomUUID(),id,MAX_ATTEMPTS,now,now).first<Row>();
 if(!row)return;
 let failure='Mail provider configuration is incomplete';
 try{
  const endpoint=new URL(String(ctx.env.MAIL_API_URL));
  if(endpoint.protocol!=='https:'||endpoint.username||endpoint.password)throw new Error('configuration');
  const from=String(ctx.env.MAIL_FROM),secret=String(ctx.env.MAIL_API_TOKEN||'');
  if(!from||/[\r\n]/.test(from)||!secret)throw new Error('configuration');
  const payload:Record<string,unknown>=JSON.parse(String(row.payload));
  const customer=payload.customer&&typeof payload.customer==='object'?payload.customer as Record<string,unknown>:payload;
  const reply=typeof customer.email==='string'&&/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customer.email)?customer.email:undefined;
  const response=await transport(endpoint,{method:'POST',redirect:'error',signal:AbortSignal.timeout(10000),headers:{Authorization:`Bearer ${secret}`,'Content-Type':'application/json','Idempotency-Key':String(row.delivery_key)},body:JSON.stringify({from,to:[String(row.recipient)],subject:String(row.subject),text:bodyText(String(row.kind),payload),...(reply?{reply_to:reply}:{})})});
  // Provider acceptance is recorded; recipient receipt cannot be established by this API.
  if(response.ok){await response.body?.cancel();await ctx.db.prepare("UPDATE app_outbox SET state='sent',sent_at=CURRENT_TIMESTAMP,last_error=NULL,lease_until=0 WHERE id=? AND delivery_key=?").bind(id,row.delivery_key).run();return;}
  failure=`Provider HTTP ${response.status}`;
  await response.body?.cancel();
 }catch{failure='Mail provider request or configuration failed';}
 await ctx.db.prepare("UPDATE app_outbox SET state='failed',last_error=?,lease_until=0,next_attempt_at=? WHERE id=? AND delivery_key=?").bind(failure,Date.now()+Math.min(86400000,60000*2**(Number(row.attempts)-1)),id,row.delivery_key).run();
}
export async function deliverOrderMail(ctx:MailContext,orderId:string):Promise<void>{
 if(String(ctx.env.MAIL_MODE)!=='https')return;
 const rows=await ctx.db.prepare("SELECT id FROM app_outbox WHERE order_id=? AND state<>'sent'").bind(orderId).all<Row>();
 for(const row of rows.results)await deliverQueuedMail(ctx,Number(row.id));
}

/** Scheduled retry drain for contact, visitor copies, enquiries and membership messages alike. */
export async function drainOutbox(env:Env,transport:typeof fetch=fetch):Promise<number>{
 if(String(env.MAIL_MODE)!=='https')return 0;
 const ctx:MailContext={db:env.DB,env};const now=Date.now();
 const rows=await ctx.db.prepare("SELECT id FROM app_outbox WHERE attempts<? AND next_attempt_at<=? AND (state IN ('queued','failed') OR (state='sending' AND lease_until<?)) ORDER BY id LIMIT ?").bind(MAX_ATTEMPTS,now,now,DRAIN_LIMIT).all<Row>();
 for(const row of rows.results)await deliverQueuedMail(ctx,Number(row.id),transport);
 return rows.results.length;
}
