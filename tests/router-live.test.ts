import test from 'node:test';
import assert from 'node:assert/strict';

test('failed contact redirects retain privately stored user input through Astro routing', { skip: process.env.RUN_LIVE_ROUTER !== '1' }, async () => {
  const origin = process.env.LIVE_ORIGIN || 'http://127.0.0.1:4321';
  const initial = await fetch(origin + '/contactus');
  const cookie = initial.headers.get('set-cookie')!.split(';')[0]!;
  const html = await initial.text();
  const csrf = /name="_csrf" value="([^"]+)"/.exec(html)![1]!;
  const response = await fetch(origin + '/contactus', {
    method: 'POST', redirect: 'manual', headers: { cookie, origin },
    body: new URLSearchParams({ _csrf: csrf, contactname: 'Validation draft fixture', contactno: '0123456789', email: '', remarks: 'Retain this draft after validation failure' }),
  });
  assert.equal(response.status, 303);
  const page = await fetch(origin + response.headers.get('location'), { headers: { cookie } });
  const rendered = await page.text();
  assert.equal(rendered.includes('value="Validation draft fixture"'), true);
  assert.equal(rendered.includes('Retain this draft after validation failure'), true);
});
