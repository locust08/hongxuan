import assert from 'node:assert/strict';
import fs from 'node:fs';
import { pathToFileURL } from 'node:url';

const {chromium}=await import(process.env.PLAYWRIGHT_MODULE?pathToFileURL(process.env.PLAYWRIGHT_MODULE).href:'playwright');
const origin=process.env.RESPONSIVE_ORIGIN||'http://127.0.0.1:4321';
const widths=(process.env.RESPONSIVE_WIDTHS||'320,360,390,430,768,820,1024,1280,1440,1920').split(',').map(Number);
const routes=['/','/aboutus','/our-products','/new-arrival','/our-category','/our-brands','/our-brands1','/details?prod_id=619','/contactus','/211212contactus','/cart_summary','/terms','/aboutus_old','/app/admin/login'];
routes.push('/map.html',...['index.html','product/index.html','product/index2.html','product/index3.html','product/index4.html','product/index5.html','product/index6.html','product/index7.html','product/index8.html','news/index.html','contact/index.html','contact/map.html'].map(path=>'/backup/'+path));
if(process.env.RESPONSIVE_AUTH_STATE)routes.push('/app/admin/index','/app/admin/user/all_users','/app/admin/user/create_user','/app/module/catalog/all_catalog','/app/module/catalog/create_catalog','/app/module/catalog/modify_catalog?prodcode=619','/app/module/maintenance/modify_heading','/app/module/webstore/all_orders');
const browser=await chromium.launch({channel:'chrome',headless:true});
const report={origin,widths,checks:[],errors:[],failures:[]};
const output=process.env.RESPONSIVE_REPORT||'private-data/responsive-report.json';
try{
 const context=await browser.newContext();const page=await context.newPage();
 const adminContext=process.env.RESPONSIVE_AUTH_STATE?await browser.newContext({storageState:process.env.RESPONSIVE_AUTH_STATE}):context;
 const adminPage=await adminContext.newPage();
 for(const tab of [page,adminPage])tab.on('pageerror',e=>report.errors.push(e.message));
 await page.goto(origin+'/contactus');const cartToken=await page.locator('input[name=_csrf]').first().inputValue();
 await page.evaluate(async token=>{await fetch('/add_cart_action',{method:'POST',body:new URLSearchParams({_csrf:token,prod_id:'619'})});},cartToken);
 for(const width of widths){
  await page.setViewportSize({width,height:width<600?844:1000});await adminPage.setViewportSize({width,height:width<600?844:1000});
  for(const path of routes){
   const tab=path.startsWith('/app/')&&path!=='/app/admin/login'?adminPage:page;
   const response=await tab.goto(origin+path,{waitUntil:'domcontentloaded'});await tab.locator('img').evaluateAll(images=>images.forEach(image=>{image.loading='eager';}));await tab.waitForFunction(()=>[...document.images].every(image=>image.complete),{timeout:10000});await tab.waitForTimeout(80);
   if(response.status()>=500)fs.writeFileSync('private-data/responsive-http-failure.html',await response.text());
   const metrics=await tab.evaluate(()=>({viewport:innerWidth,scrollWidth:document.documentElement.scrollWidth,adminContentWidth:document.querySelector('.admin-content')?.getBoundingClientRect().width??null,broken:[...document.images].filter(i=>!i.complete||i.naturalWidth===0).map(i=>i.getAttribute('src')),gallery:document.querySelectorAll('.about-product-photo').length}));
   const check={width,path,status:response.status(),...metrics};report.checks.push(check);
   if(metrics.scrollWidth>width+1||metrics.viewport>width+1||metrics.broken.length||response.status()!==200||path==='/aboutus'&&metrics.gallery!==7||width<=1001&&metrics.adminContentWidth!==null&&metrics.adminContentWidth<(width-40)*0.9)report.failures.push(check);
   fs.writeFileSync(output,JSON.stringify(report,null,2));
  }
  console.log('Checked width '+width+'px');
 }
 await page.goto(origin+'/cart_summary');await page.evaluate(async token=>{await fetch('/checkout_action',{method:'POST',body:new URLSearchParams({_csrf:token,qty_619:'0'})});},cartToken);
 await page.goto(origin+'/cart_summary');report.cartCleanup=(await page.textContent('main')).includes('No item added.');assert.ok(report.cartCleanup,'Disposable cart removed');
 const mobile=await browser.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true});const phone=await mobile.newPage();
 await phone.goto(origin+'/aboutus');assert.equal(await phone.locator('.about-product-photo').count(),7);assert.equal(await phone.evaluate(()=>innerWidth),390);
 await phone.getByRole('link',{name:'Our Products',exact:true}).filter({visible:true}).click();assert.equal(new URL(phone.url()).pathname,'/our-products');
 await phone.locator('#mobile-keyword').fill('TS');await phone.getByRole('button',{name:'Search',exact:true}).click();assert.equal(new URL(phone.url()).searchParams.get('keyword'),'TS');
 await phone.setViewportSize({width:844,height:390});await phone.goto(origin+'/contactus');assert.ok(await phone.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
 await mobile.close();
} finally {await browser.close();fs.writeFileSync(output,JSON.stringify(report,null,2));}
console.log(JSON.stringify({origin,checks:report.checks.length,failures:report.failures.slice(0,12),failureCount:report.failures.length,errors:[...new Set(report.errors)]}));
assert.equal(report.failures.length,0,'All pages fit the viewport and load every image');assert.equal(report.errors.length,0,'No uncaught browser errors');
