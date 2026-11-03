import test from 'node:test';
import assert from 'node:assert/strict';
import { cleanReference, cleanScriptUrls, legacyRoutePath, legacyRedirect } from '../src/server/urls.ts';

const origin='https://hongxuan-astro.easondev.workers.dev';
test('canonical routes remove ASP suffixes while retaining parameters and homepage identity',()=>{
 for(const [old,next] of [['/index.asp','/'],['/aboutus.asp','/aboutus'],['/our-products.asp?catid=C03&page=2','/our-products?catid=C03&page=2'],['/new-arrival.asp','/new-arrival'],['/contactus.asp','/contactus'],['/app/admin/login.asp','/app/admin/login']]){
  assert.equal(cleanReference(old!,origin+'/'),next);
  const redirect=legacyRedirect(new Request(origin+old));assert.equal(redirect?.status,308);assert.equal(redirect?.headers.get('Location'),next);
 }
});
test('clean public, captcha and admin endpoints resolve to existing TypeScript handlers',()=>{
 assert.equal(legacyRoutePath('/aboutus'),'/aboutus.asp');
 assert.equal(legacyRoutePath('/aspcaptcha'),'/aspcaptcha.asp');
 assert.equal(legacyRoutePath('/app/module/catalog/create_catalog_action1'),'/app/module/catalog/create_catalog_action1.asp');
 assert.equal(legacyRoutePath('/app/module/members/assign_profile_action'),'/app/module/members/assign_profile_action');
 assert.equal(legacyRedirect(new Request(origin+'/NieLq77.asp')),null);
 assert.equal(legacyRedirect(new Request(origin+'/test/asp/test_mail.asp')),null);
 assert.equal(legacyRedirect(new Request(origin+'/aboutus')),null);
});
test('relative links, redirect fields and scripted form actions become clean without touching external URLs',()=>{
 assert.equal(cleanReference('modify_catalog.asp?prodcode=619',origin+'/app/module/catalog/all_catalog'),'/app/module/catalog/modify_catalog?prodcode=619');
 const clean=cleanReference('/add_cart_action.asp?redirect=%2Fdetails.asp%3Fprod_id%3D619',origin+'/');
 assert.equal(new URL(clean,origin).pathname,'/add_cart_action');assert.equal(new URL(clean,origin).searchParams.get('redirect'),'/details?prod_id=619');
 assert.equal(cleanReference('https://example.com/index.asp',origin+'/'),'https://example.com/index.asp');
 assert.equal(cleanReference('/images/example.asp.gif',origin+'/'),'/images/example.asp.gif');
 assert.equal(cleanScriptUrls("document.CartForm.action='cart_summary.asp';window.open('/details.asp?prod_id=619');",origin+'/'),"document.CartForm.action='/cart_summary';window.open('/details?prod_id=619');");
});
test('legacy POST redirects preserve method/body with308, including multipart upload actions',()=>{
 const request=new Request(origin+'/app/module/catalog/uploadc/uploadfile.asp?prodcode=619',{method:'POST',body:'unchanged'});
 const response=legacyRedirect(request);assert.equal(response?.status,308);assert.equal(response?.headers.get('Location'),'/app/module/catalog/uploadc/uploadfile?prodcode=619');
});
