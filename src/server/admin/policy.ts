export function canonicalAdminAction(name: string): string {
 return name.toLowerCase().replace(/^copy of /,'').replace(/_action[1-5](?:_old)?\.asp$/, '_action.asp').replace(/_action_old\.asp$/, '_action.asp');
}
export function validId(value: string): number|null { return /^\d+$/.test(value) && Number.isSafeInteger(+value) && +value>0 ? +value : null; }
// Rebuild allowed tags and attributes; never reuse raw markup or event handlers.
export function sanitizeContent(value: string): string {
 const escape=(s:string)=>s.replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]!));
 return value.replace(/<(script|style|iframe|object|svg|math)\b[^>]*>[\s\S]*?<\/\1\s*>/gi,'').replace(/<!--[\s\S]*?-->/g,'').replace(/<\/?([a-z][a-z0-9]*)\b[^>]*>/gi,(tag,name:string)=>{
  name=name.toLowerCase();if(!/^(p|br|b|strong|i|em|u|ul|ol|li|table|tbody|thead|tr|td|th|h[1-6]|div|span|blockquote|hr|a|font|sup|sub|center|img|strike)$/i.test(name))return '';
  if(tag.startsWith('</'))return `</${name}>`;const attrs:string[]=[];
  for(const m of tag.matchAll(/\s([\w-]+)\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))/g)){const key=m[1]!.toLowerCase(),v=m[2]??m[3]??m[4]??'';
   if(['align','valign'].includes(key)&&/^(left|right|center|justify|top|middle|bottom)$/i.test(v))attrs.push(`${key}="${v}"`);
   if(['width','height','border','cellpadding','cellspacing','colspan','rowspan','size'].includes(key)&&/^\d{1,4}%?$/.test(v))attrs.push(`${key}="${v}"`);
   if(['color','bgcolor'].includes(key)&&/^(#[a-f0-9]{3,8}|[a-z]{1,20})$/i.test(v))attrs.push(`${key}="${v}"`);
   if(key==='face'&&/^[a-z ,\-]{1,80}$/i.test(v))attrs.push(`face="${v}"`);
   const url=v.replace(/&amp;/gi,'&');
   if(key==='href'&&/^(https?:\/\/|\/(?!\/)|#|mailto:)[^\s<>"']*$/i.test(url))attrs.push(`href="${escape(url)}"`);
   if(key==='src'&&name==='img'&&/^(https:\/\/|\/app\/data\/)[^\s<>"']*$/i.test(url))attrs.push(`src="${escape(url)}"`);
   if(['alt','title'].includes(key))attrs.push(`${key}="${escape(v)}"`);
   if(key==='style'){const safe=v.split(';').filter(part=>/^\s*(text-align|font-weight|font-style|text-decoration|color|background-color|font-size|font-family)\s*:\s*[a-zA-Z0-9#%, .\-]+$/.test(part));if(safe.length)attrs.push(`style="${escape(safe.join(';'))}"`);}
  }if(name==='img'&&!attrs.some(a=>a.startsWith('src=')))return '';return `<${name}${attrs.length?' '+attrs.join(' '):''}>`;
 });
}
