import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { DatabaseSync } from 'node:sqlite';
test('migration preserves every source row including duplicates and historical orphans',()=>{
 assert.ok(existsSync('private-data/active.sqlite'),'migration generated');
 const db=new DatabaseSync('private-data/active.sqlite');
 const report=JSON.parse(readFileSync('private-data/reconciliation.json','utf8'));
 assert.equal(report.active.tableCount,24); assert.equal(report.active.rowCount,2968);
 for(const t of report.active.tables){ assert.equal(db.prepare(`SELECT count(*) AS n FROM "${t.name}"`).get()!.n,t.rows); assert.equal(t.verified,true); }
 assert.equal(db.prepare('SELECT count(*) AS n FROM membership').get()!.n,0);
 assert.ok(existsSync('private-data/archive-old.sqlite'));
 assert.equal(db.prepare("SELECT count(*) AS n FROM tblusers WHERE userpwd LIKE 'pbkdf2-sha256$%'").get()!.n,4);
});

import { createHash } from 'node:crypto';
test('each imported full record matches the source export except password modernization',()=>{
 const source=JSON.parse(readFileSync('../.local/migration-audit/database-private.json','utf8').replace(/^\uFEFF/,''));const db=new DatabaseSync('private-data/active.sqlite');
 function fingerprint(rows:Record<string,unknown>[]){const normalized=rows.map(row=>JSON.stringify(Object.fromEntries(Object.entries(row).sort(([a],[b])=>a.localeCompare(b)).map(([k,v])=>[k,k==='userpwd'?'[modernized]':typeof v==='boolean'?Number(v):v])))).sort();return createHash('sha256').update(JSON.stringify(normalized)).digest('hex');}
 for(const table of source.tables){const actual=db.prepare(`SELECT * FROM "${table.name}"`).all();assert.equal(fingerprint(actual),fingerprint(table.rows),`record fingerprint matches ${table.name}`);}
 db.close();
});

test('inferred empty schemas include source-visible member and label filter names',()=>{
 const db=new DatabaseSync('private-data/active.sqlite');
 for(const [table,fields] of Object.entries({membership:['mem_pwd','mem_newsgroup'],newsgroup:['newsgroup_code','newsgroup']})){
  const names=db.prepare(`PRAGMA table_info("${table}")`).all().map(r=>r.name);for(const field of fields)assert.ok(names.includes(field),`${table}.${field} exists`);
 }
 db.close();
});
