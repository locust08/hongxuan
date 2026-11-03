import { readFileSync, mkdirSync, writeFileSync } from 'node:fs';
const origin = process.env.AUDIT_ORIGIN || 'http://127.0.0.1:4321';
const inventory = JSON.parse(readFileSync('../.local/migration-audit/source-inventory.json', 'utf8'));
const sources = inventory.filter(r => r.path.endsWith('.asp') && !r.path.includes('_vti_cnf'));
const report = [];
let index = 0;
async function worker() {
  while (index < sources.length) {
    const item = sources[index++];
    let route = '/' + item.path;
    if (route === '/details.asp') route += '?prod_id=619';
    const legacy = await fetch(origin + route, { redirect: 'manual' });
    const canonical = legacy.status === 308 ? legacy.headers.get('location') : null;
    const response = canonical ? await fetch(new URL(canonical, origin), { redirect: 'manual' }) : legacy;
    const body = await response.text();
    report.push({ source: item.path, legacyStatus: legacy.status, canonical, status: response.status, redirect: response.headers.get('location'), applicationError: /D1_ERROR|Internal Server Error|Microsoft VBScript|error '800/.test(body), classification: item.dangerousExecution ? 'excluded-code-execution' : item.path.startsWith('test/') ? 'excluded-hosting-diagnostic' : item.path.startsWith('app/') ? 'unauthenticated-admin' : 'public' });
  }
}
await Promise.all(Array.from({ length: 5 }, worker));
report.sort((a, b) => a.source.localeCompare(b.source));
mkdirSync('validation', { recursive: true });
writeFileSync('validation/route-audit-unauthenticated.json', JSON.stringify(report, null, 2));
const failures = report.filter(r => r.applicationError || r.status >= 500 || !r.classification.startsWith('excluded') && (r.legacyStatus !== 308 || !r.canonical || /\.asp(?:[?#]|$)/i.test(r.canonical)) || r.classification === 'public' && ![200, 303, 405].includes(r.status));
console.log(JSON.stringify({ routes: report.length, legacyRedirects:report.filter(r=>r.legacyStatus===308).length, statuses: report.reduce((a, r) => ({ ...a, [r.status]: (a[r.status] || 0) + 1 }), {}), failures }, null, 2));
if (failures.length) process.exitCode = 1;
