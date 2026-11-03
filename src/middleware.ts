import { defineMiddleware } from 'astro:middleware';
import { cleanHtml, legacyRedirect } from './server/urls';

export const onRequest=defineMiddleware(async(context,next)=>{
 const redirect=legacyRedirect(context.request);
 if(redirect)return redirect;
 return cleanHtml(await next(),context.url.href);
});
