"""Offline, repeatable Access export conversion. Never logs records or credentials."""
import argparse, collections, copy, hashlib, json, os, pathlib, re, sqlite3
ROOT=pathlib.Path(__file__).resolve().parents[2]
OUT=ROOT/'astro-site'/'private-data'
def qi(v): return '"'+v.replace('"','""')+'"'
def lit(v):
 if v is None:return 'NULL'
 if isinstance(v,bool):return '1' if v else '0'
 if isinstance(v,(int,float)):return repr(v)
 return "'"+str(v).replace("'","''")+"'"
def decode_password(value,key):
 digits=''.join(str(ord(c)) for c in key)
 return ''.join(chr(b^ord(digits[i%len(digits)])) for i,b in enumerate(bytes.fromhex(value.strip())))
def modern(value,key,existing=None):
 password=decode_password(value,key)
 if existing:
  match=re.fullmatch(r'pbkdf2-sha256\$(\d+)\$([a-f0-9]{32})\$([a-f0-9]{64})',existing)
  if match and hashlib.pbkdf2_hmac('sha256',password.encode(),bytes.fromhex(match[2]),int(match[1])).hex()==match[3]:return existing
 salt=os.urandom(16); iterations=100000
 digest=hashlib.pbkdf2_hmac('sha256',password.encode(),salt,iterations)
 return f'pbkdf2-sha256${iterations}${salt.hex()}${digest.hex()}'
def canon(rows):
 rows=[{k:(int(v) if isinstance(v,float) and v.is_integer() else v) for k,v in r.items()} for r in rows]
 return hashlib.sha256(json.dumps(sorted([json.dumps(r,sort_keys=True,ensure_ascii=False,separators=(',',':')) for r in rows]),ensure_ascii=False,separators=(',',':')).encode()).hexdigest()
def convert(source,label,key):
 data=json.loads(source.read_text(encoding='utf-8-sig')); sql=[]; report=[]
 previous={}; previous_path=OUT/(label+'.sqlite')
 if previous_path.exists():
  olddb=sqlite3.connect(previous_path)
  try:previous=dict(olddb.execute('SELECT userid,userpwd FROM tblusers'))
  finally:olddb.close()
 for table in data['tables']:
  name=table['name']; fields=table['fields']; pks=sorted([p for p in data['schema']['primaryKeys'] if p['TABLE_NAME']==name],key=lambda p:p['ORDINAL'])
  cols=[]
  for f in fields:
   typ='INTEGER' if f['adoType'] in [2,3,11,16,17,18,19,20,21] else 'REAL' if f['adoType'] in [4,5,6,14,131] else 'TEXT COLLATE NOCASE'
   # Password comparisons remain binary, matching original VBScript comparison.
   if f['name'] in ['userpwd','mem_password']:typ='TEXT'
   col=qi(f['name'])+' '+typ
   meta=next((c for c in data['schema']['columns'] if c['TABLE_NAME']==name and c['COLUMN_NAME']==f['name']),{})
   default=meta.get('COLUMN_DEFAULT')
   if meta.get('COLUMN_HASDEFAULT'):
    if default=='Now()':col+=" DEFAULT (datetime('now','+8 hours'))"
    elif re.fullmatch(r'-?\d+(\.\d+)?',str(default)):col+=' DEFAULT '+str(default)
    else:raise ValueError('Unsupported default for '+name+'.'+f['name'])
   cols.append(col)
  if pks:cols.append('PRIMARY KEY ('+','.join(qi(p['COLUMN_NAME']) for p in pks)+')')
  sql.append('CREATE TABLE '+qi(name)+' ('+','.join(cols)+');')
  rows=copy.deepcopy(table['rows'])
  for row in rows:
   for k,v in row.items():
    if isinstance(v,bool):row[k]=int(v)
   if name=='tblusers':row['userpwd']=modern(row['userpwd'],key,previous.get(row['userid']))
   sql.append('INSERT INTO '+qi(name)+' ('+','.join(qi(f['name']) for f in fields)+') VALUES ('+','.join(lit(row.get(f['name'])) for f in fields)+');')
  indexes=collections.defaultdict(list)
  for idx in data['schema']['indexes']:
   if idx['TABLE_NAME']==name and not idx['PRIMARY_KEY']:indexes[idx['INDEX_NAME']].append(idx)
  for iname,parts in indexes.items():
   parts.sort(key=lambda x:x['ORDINAL_POSITION']); sql.append('CREATE '+('UNIQUE ' if parts[0]['UNIQUE'] else '')+'INDEX '+qi(name+'__'+iname)+' ON '+qi(name)+' ('+','.join(qi(p['COLUMN_NAME'])+(' DESC' if p['COLLATION']==2 else '') for p in parts)+');')
  report.append({'name':name,'rows':len(rows),'canonicalHash':canon(rows)})
 dbpath=OUT/(label+'.sqlite')
 if dbpath.exists():dbpath.unlink()
 db=sqlite3.connect(dbpath); db.row_factory=sqlite3.Row; db.executescript('BEGIN;\n'+'\n'.join(sql)+'\nCOMMIT;')
 for t in report:
  actual=[dict(r) for r in db.execute('SELECT * FROM '+qi(t['name']))]
  t['verified']=canon(actual)==t['canonicalHash']
  if not t['verified']:raise ValueError('Reconciliation failed: '+t['name'])
 if label=='active':
  app='\n'.join(p.read_text() for p in sorted((ROOT/'astro-site/migrations').glob('*.sql')) if p.name!='0001_legacy_schema.sql'); db.executescript(app)
  (ROOT/'astro-site/migrations/0001_legacy_schema.sql').write_text('\n'.join(s for s in sql if s.startswith('CREATE '))+'\n',encoding='utf-8',newline='')
  (OUT/'active-seed.sql').write_text('\n'.join(s for s in sql if s.startswith('INSERT '))+'\n',encoding='utf-8',newline='')
 else:(OUT/'archive-old.sql').write_text('\n'.join(sql)+'\n',encoding='utf-8',newline='')
 db.close()
 return {'tableCount':len(report),'rowCount':sum(t['rows'] for t in report),'tables':report}
def main():
 OUT.mkdir(exist_ok=True,parents=True)
 settings=(ROOT/'app/include/settings.inc').read_text(encoding='cp1252')
 key=re.search(r'Application\("key"\)\s*=\s*"([^"]+)"',settings,re.I)[1]
 report={'active':convert(ROOT/'.local/migration-audit/database-private.json','active',key),'archive':convert(ROOT/'.local/migration-audit/database-old-private.json','archive-old',key),'rules':['Original naive timestamp strings are preserved; new wall-clock defaults use Asia/Kuala_Lumpur UTC+8.','Booleans become SQLite integers 0/1. All legacy text lookups use NOCASE (SQLite ASCII case folding).','Password values are the only intentional source-record change: decrypted offline, then salted PBKDF2 SHA-256 with 100000 iterations (Workers WebCrypto supported maximum).','No foreign keys added: all duplicates and historical orphans retained. Missing business tables are inferred and empty.','Now() defaults translated to datetime(now,+8 hours). Index names namespaced by table; composite order preserved.']}
 (OUT/'reconciliation.json').write_text(json.dumps(report,indent=2),encoding='utf-8',newline='')
 print('Reconciled active:',report['active']['tableCount'],'tables,',report['active']['rowCount'],'rows; archive:',report['archive']['tableCount'],'tables,',report['archive']['rowCount'],'rows')
if __name__=='__main__':main()
