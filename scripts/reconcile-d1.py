"""Reconcile local or remote D1 without printing records; repair is local only."""
import argparse,hashlib,json,pathlib,sqlite3,subprocess,sys
ROOT=pathlib.Path(__file__).resolve().parents[1]
REMOTE='--remote' in sys.argv
report=json.loads((ROOT/'private-data/reconciliation.json').read_text())
def qi(v):return '"'+v.replace('"','""')+'"'
def lit(v):
 if v is None:return 'NULL'
 if isinstance(v,(int,float)):return repr(v)
 return "'"+str(v).replace("'","''")+"'"
def canon(rows):
 rows=[{k:(int(v) if isinstance(v,float) and v.is_integer() else v) for k,v in r.items()} for r in rows]
 return hashlib.sha256(json.dumps(sorted([json.dumps(r,sort_keys=True,ensure_ascii=False,separators=(',',':')) for r in rows]),ensure_ascii=False,separators=(',',':')).encode()).hexdigest()
def execute_file(path):
 args=['npx.cmd' if sys.platform=='win32' else 'npx','wrangler','d1','execute','hongxuan','--remote' if REMOTE else '--local']
 args+=['--command',path.read_text(encoding='utf-8')] if REMOTE else ['--file',str(path)]
 args+=['--json']
 proc=subprocess.run(args,cwd=ROOT,capture_output=True,text=True,encoding='utf-8')
 if proc.returncode:
  (ROOT/'private-data/d1-error.log').write_text(proc.stderr+'\n'+proc.stdout,encoding='utf-8',newline='')
  raise SystemExit('D1 command failed; private diagnostics saved to private-data/d1-error.log')
 return json.loads(proc.stdout)
def fetch_tables():
 # One local D1 call avoids a Wrangler startup per table. JSON values retain exact embedded CR/LF.
 db=sqlite3.connect(ROOT/'private-data/active.sqlite')
 statements=[]
 for table in report['active']['tables']:
  name=table['name'];fields=[r[1] for r in db.execute('PRAGMA table_info('+qi(name)+')')]
  pairs=["'__rowid__',rowid"]+[lit(f)+','+qi(f) for f in fields]
  statements.append('(SELECT json_group_array(json_object('+','.join(pairs)+')) FROM '+qi(name)+') AS '+qi(name))
 path=ROOT/'private-data/reconcile-queries.sql';path.write_text('SELECT '+','.join(statements)+';',encoding='utf-8',newline='')
 output=execute_file(path)
 return {name:json.loads(rows) for name,rows in output[0]['results'][0].items()}
def main():
 parser=argparse.ArgumentParser();parser.add_argument('--repair',action='store_true');parser.add_argument('--remote',action='store_true');args=parser.parse_args()
 if args.remote and args.repair:parser.error('Remote reconciliation is read-only; --repair is local only.')
 tables=fetch_tables()
 if args.repair:
  db=sqlite3.connect(ROOT/'private-data/active.sqlite');db.row_factory=sqlite3.Row;updates=[]
  for table in report['active']['tables']:
   name=table['name'];expected={r['__rowid__']:dict(r) for r in db.execute('SELECT rowid AS __rowid__,* FROM '+qi(name))}
   if len(expected)!=len(tables[name]):raise SystemExit('Repair requires matching row counts: '+name)
   for actual in tables[name]:
    rowid=actual['__rowid__'];target=expected.get(rowid)
    if target is None:raise SystemExit('Repair requires matching row IDs: '+name)
    changes={k:v for k,v in target.items() if k!='__rowid__' and actual.get(k)!=v}
    if changes:updates.append('UPDATE '+qi(name)+' SET '+','.join(qi(k)+'='+lit(v) for k,v in changes.items())+' WHERE rowid='+str(rowid)+';')
  path=ROOT/'private-data/repair-local.sql';path.write_text('\n'.join(updates)+'\n',encoding='utf-8',newline='')
  if updates:execute_file(path)
  print('Repaired local D1 rows:',len(updates))
  tables=fetch_tables()
 checks=[]
 for table in report['active']['tables']:
  name=table['name'];rows=[{k:v for k,v in r.items() if k!='__rowid__'} for r in tables[name]]
  check={'name':name,'rows':len(rows),'verified':len(rows)==table['rows'] and canon(rows)==table['canonicalHash']};checks.append(check)
  if not check['verified']:raise SystemExit('D1 reconciliation mismatch for table '+name)
 (ROOT/('private-data/d1-remote-reconciliation.json' if REMOTE else 'private-data/d1-reconciliation.json')).write_text(json.dumps({'tableCount':len(checks),'rowCount':sum(t['rows'] for t in checks),'tables':checks},indent=2),encoding='utf-8',newline='')
 print('Remote D1 reconciled:' if REMOTE else 'Local D1 reconciled:',len(checks),'tables,',sum(t['rows'] for t in checks),'rows; all full-record hashes match.')
if __name__=='__main__':main()
