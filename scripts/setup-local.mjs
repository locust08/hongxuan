import { execFileSync } from 'node:child_process';
import { existsSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
process.chdir(root);
const wrangler = path.join(root, 'node_modules/wrangler/bin/wrangler.js');
function run(args) {
  return execFileSync(process.execPath, [wrangler, ...args], { cwd: root, encoding: 'utf8', maxBuffer: 32 * 1024 * 1024, env: { ...process.env, CI: 'true' } });
}
if (!existsSync('.dev.vars')) writeFileSync('.dev.vars', 'MAIL_API_TOKEN=""\n');
run(['d1', 'migrations', 'apply', 'hongxuan', '--local']);
const result = JSON.parse(run(['d1', 'execute', 'hongxuan', '--local', '--command', 'SELECT COUNT(*) AS n FROM products', '--json']));
const count = Number(result[0].results[0].n);
if (count === 0) {
  if (!existsSync('private-data/active-seed.sql')) throw new Error('Private database seed is missing. Restore private-data/active-seed.sql before setup.');
  run(['d1', 'execute', 'hongxuan', '--local', '--file', 'private-data/active-seed.sql']);
  console.log('Imported the original database into local D1.');
} else console.log(`Local D1 already contains ${count} products; existing data was retained.`);
console.log('Local setup ready. Run npm run dev and open http://127.0.0.1:4321.');
