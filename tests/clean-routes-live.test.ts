import test from 'node:test';
import assert from 'node:assert/strict';
const live=process.env.RUN_LIVE_ROUTER==='1';
const origin=process.env.LIVE_ORIGIN||'http://127.0.0.1:4321';

test('live Astro serves clean pages and permanently redirects old URLs without ASP navigation', {skip:!live},async()=>{
 for(const [old,path] of [['/index.asp','/'],['/aboutus.asp','/aboutus'],['/our-products.asp','/our-products'],['/new-arrival.asp','/new-arrival'],['/contactus.asp','/contactus'],['/app/admin/login.asp','/app/admin/login']]){
  const legacy=await fetch(origin+old,{redirect:'manual'});assert.equal(legacy.status,308);assert.equal(legacy.headers.get('location'),path);
  const page=await fetch(origin+path);assert.equal(page.status,200);const html=await page.text();
  assert.doesNotMatch(html,/(?:href|action|src|formaction)\s*=\s*["'][^"']*\.asp(?:[?#"'])/i);
  if(path!=='/app/admin/login')assert.ok(html.includes('rel="canonical" href="'+origin+path+'"'));
 }
});

test('live legacy POST follows308 with its body and session intact to a clean form action',{skip:!live},async()=>{
 const initial=await fetch(origin+'/contactus');const cookie=initial.headers.get('set-cookie')!.split(';')[0]!;
 const html=await initial.text();const csrf=/name="_csrf" value="([^"]+)"/.exec(html)![1]!;
 const response=await fetch(origin+'/contactus.asp',{method:'POST',headers:{cookie,origin},body:new URLSearchParams({_csrf:csrf,contactname:'Clean route preserved draft',contactno:'0123456789',email:'',remarks:'Body survived the compatibility redirect'})});
 assert.equal(response.status,200);assert.equal(new URL(response.url).pathname,'/contactus');assert.ok(new URL(response.url).searchParams.has('error'));
 const result=await response.text();assert.ok(result.includes('value="Clean route preserved draft"'));assert.ok(result.includes('Body survived the compatibility redirect'));
});

test('live clean protected routes keep authentication and excluded ASP utilities remain404',{skip:!live},async()=>{
 const protectedPage=await fetch(origin+'/app/module/catalog/all_catalog',{redirect:'manual'});assert.equal(protectedPage.status,303);assert.equal(protectedPage.headers.get('location'),'/app/admin/login');
 for(const path of ['/test/asp/test_mail.asp','/test/asp/test_mail','/NieLq77.asp','/NieLq77'])assert.equal((await fetch(origin+path,{redirect:'manual'})).status,404);
 const trailing=await fetch(origin+'/aboutus/',{redirect:'manual'});assert.equal(trailing.status,308);assert.equal(trailing.headers.get('location'),'/aboutus');
});
