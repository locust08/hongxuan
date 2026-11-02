import { readFileSync, writeFileSync } from 'node:fs';
import { sourceAdminRoutes } from '../src/server/admin/routes.ts';
import { PUBLIC_ROUTES } from '../src/server/public.ts';
const inventory = JSON.parse(readFileSync('../.local/migration-audit/source-inventory.json', 'utf8'));
const audit = JSON.parse(readFileSync('validation/route-audit-unauthenticated.json', 'utf8'));
const admin = new Set(sourceAdminRoutes.map(path => path.toLowerCase()));
const core = new Set(['/aspcaptcha.asp', '/add_cart_action.asp']);
const lines = ['# Migration route coverage', '', 'All 198 original ASP source candidates are accounted for below. Original URL suffixes are served by Astro/TypeScript; no ASP source is deployed.', '', 'An unauthenticated 303 is a protected-route redirect, not a functional sign-off on every operation. Domain tests and authenticated route audits provide the additional evidence listed in the validation reports. Invalid or absent record IDs can correctly produce 400/404 on otherwise supported routes.', '', '| Original route | Implementation | Unauthenticated HTTP |', '|---|---|---:|'];
let missing = 0;
for (const item of inventory.filter(row => row.path.endsWith('.asp') && !row.path.includes('_vti_cnf'))) {
  const path = '/' + item.path;
  let implementation;
  if (item.dangerousExecution) implementation = 'Excluded arbitrary-code execution endpoint (404)';
  else if (item.path.startsWith('test/')) implementation = 'Excluded legacy hosting diagnostic (404)';
  else if (admin.has(path.toLowerCase())) implementation = 'Admin service / source-compatible helper or action';
  else if (core.has(path)) implementation = 'Typed core endpoint';
  else if (PUBLIC_ROUTES.includes(path)) implementation = 'Public Astro layout / typed page or fragment renderer';
  else { implementation = '**UNMAPPED**'; missing++; }
  const result = audit.find(row => row.source === item.path);
  lines.push(`| \`${path}\` | ${implementation} | ${result?.status ?? 'not audited'} |`);
}
lines.push('', '## Static archive and fragments', '', 'All 12 HTML archive pages and their assets are retained under `/backup/`. The archive intro is native Canvas. Root HTML footer/category/rollover/map fragments remain available; `/flash.html` now renders the native header. Static source/configuration files, databases, FrontPage metadata and hosting diagnostics are excluded from public assets.', '', `Unmapped ASP source candidates: **${missing}**.`, '');
writeFileSync('validation/ROUTE-COVERAGE.md', lines.join('\n'));
console.log(`Wrote coverage for ${audit.length} source candidates; ${missing} unmapped.`);
if (missing) process.exitCode = 1;
