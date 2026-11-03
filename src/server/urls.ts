import { PUBLIC_ROUTES } from './public-route-manifest.ts';
import { sourceAdminRoutes } from './admin/routes.ts';

// These identifiers select migrated TypeScript services, never ASP files.
// Public addresses and generated links use the clean side of this manifest.
const routes=[...PUBLIC_ROUTES,...sourceAdminRoutes,'/aspcaptcha.asp','/captcha.asp','/add_cart_action.asp','/checkout_action.asp'];
const cleanByLegacy=new Map(routes.map(path=>[path.toLowerCase(),path==='/index.asp'?'/':path.replace(/\.asp$/i,'').toLowerCase()]));
const legacyByClean=new Map(routes.filter(path=>path!=='/index.asp').map(path=>[path.replace(/\.asp$/i,'').toLowerCase(),path.toLowerCase()]));
function decoded(path:string):string {try{return decodeURIComponent(path).toLowerCase();}catch{return path.toLowerCase();}}

export function legacyRoutePath(path:string):string {
 const key=decoded(path).replace(/\/$/,'')||'/';
 return legacyByClean.get(key)??decoded(path);
}

export function cleanReference(reference:string,base:string,depth=0):string {
 if(!reference||/^\s*(?:javascript:|data:|mailto:|tel:|#)/i.test(reference))return reference;
 let url:URL;let current:URL;try{current=new URL(base);url=new URL(reference,current);}catch{return reference;}
 if(url.origin!==current.origin||!/^https?:$/.test(url.protocol))return reference;
 const clean=cleanByLegacy.get(decoded(url.pathname));
 let changed=clean!==undefined&&encodeURI(clean)!==url.pathname;
 if(clean!==undefined)url.pathname=encodeURI(clean);
 if(depth<2)for(const name of ['redirect','return','return_url','returnto','next']){
  const value=url.searchParams.get(name);if(!value)continue;
  const next=cleanReference(value,current.href,depth+1);
  if(next!==value){url.searchParams.set(name,next);changed=true;}
 }
 return changed?url.pathname+url.search+url.hash:reference;
}

export function cleanScriptUrls(script:string,base:string):string {
 return script.replace(/(["'])([^"'<>\r\n]*\.asp(?:[?#][^"'<>\r\n]*)?)\1/gi,(_match,quote:string,url:string)=>quote+cleanReference(url,base)+quote);
}

export function legacyRedirect(request:Request):Response|null {
 const url=new URL(request.url);
 const key=decoded(url.pathname);
 if(key.endsWith('/')&&key!=='/'&&legacyByClean.has(key.slice(0,-1)))return new Response(null,{status:308,headers:{Location:url.pathname.slice(0,-1)+url.search}});
 // Only audited business routes redirect; excluded and arbitrary paths stay404.
 if(!/\.asp$/i.test(key)&&key!=='/index')return null;
 const clean=key==='/index'?'/':cleanByLegacy.get(key);
 if(clean===undefined)return null;
 const destination=cleanReference(encodeURI(clean)+url.search,url.origin+'/');
 return new Response(null,{status:308,headers:{Location:destination,'Cache-Control':'public, max-age=3600'}});
}

export function cleanHtml(response:Response,base:string):Response {
 const location=response.headers.get('Location');
 if(location){const headers=new Headers(response.headers);headers.set('Location',cleanReference(location,base));return new Response(response.body,{status:response.status,statusText:response.statusText,headers});}
 if(!response.body||!response.headers.get('Content-Type')?.includes('text/html'))return response;
 const rewriter=new HTMLRewriter().on('*',{
  element(element){for(const name of ['href','src','action','formaction','value','onclick','onchange','onsubmit','onload','onmouseover','onmouseout','onblur','onfocus','onkeyup','onkeydown']){
   const value=element.getAttribute(name);if(value===null)continue;
   if(['href','src','action','formaction'].includes(name))element.setAttribute(name,cleanReference(value,base));
   else if(name==='value'&&element.getAttribute('name')==='redirect')element.setAttribute(name,cleanReference(value,base));
   else if(name.startsWith('on'))element.setAttribute(name,cleanScriptUrls(value,base));
  }}
 });
 // Inline action assignments and popup links must use clean routes as well.
 let script='';
 rewriter.on('script:not([src])',{
  element(element){script='';element.onEndTag(end=>{end.before(cleanScriptUrls(script,base),{html:true});});},
  text(chunk){script+=chunk.text;chunk.remove();}
 });
 return rewriter.transform(response);
}
