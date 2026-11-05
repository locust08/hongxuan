"""Copy original business assets, excluding server source/private files."""
from pathlib import Path
import json
import re
import shutil
import base64
import runpy

project = Path(__file__).resolve().parents[1]
source = project.parent
public = project / 'public'
extensions = {'.jpg', '.jpeg', '.png', '.gif', '.ico', '.css', '.html', '.htm', '.pdf'}
count = 0
for folder in ['images', 'img', 'css', 'app/images', 'app/data', 'backup']:
    for original in (source / folder).rglob('*'):
        if not original.is_file() or '_vti_cnf' in original.parts or original.suffix.lower() not in extensions:
            continue
        target = public / original.relative_to(source)
        target.parent.mkdir(parents=True, exist_ok=True)
        shutil.copy2(original, target)
        count += 1
for name, destination in [('a.CSS', 'a.css'), ('app/b.css', 'app/b.css'), ('favicon.ico', 'favicon.ico'), ('map.html', 'map.html'), ('bottom.html', 'bottom.html'), ('category.html', 'category.html'), ('mouseover.html', 'mouseover.html')]:
    target = public / destination
    target.parent.mkdir(parents=True, exist_ok=True)
    shutil.copy2(source / name, target)

# Access/Windows allowed filename case differences that Workers does not.
# Create only aliases actually referenced by database content or source URLs.
lookup = {p.relative_to(public).as_posix().lower(): p for p in public.rglob('*') if p.is_file()}
requested = set()
export = source / '.local/migration-audit/database-private.json'
if export.exists():
    data = json.loads(export.read_text(encoding='utf-8-sig'))
    for table in data['tables']:
        for row in table['rows']:
            if table['name'] == 'products':
                for field in ['prod_pict', 'prod_pice', 'prod_picl']:
                    if row[field]: requested.add('app/data/images/products/' + str(row[field]))
                for field in ['prod_download', 'prod_download2']:
                    if row[field]: requested.add('app/data/pdf/' + str(row[field]))
            if table['name'] == 'brand' and row.get('brand_logo'): requested.add('app/data/images/' + str(row['brand_logo']))
            if table['name'] == 'status' and row.get('status_pic'): requested.add('app/data/images/' + str(row['status_pic']))
aliases = []
for name in requested:
    original = lookup.get(name.lower())
    target = public / name
    if original and original.relative_to(public).as_posix() != name:
        # Windows cannot store both spellings: route lookup handles these aliases.
        aliases.append((name, '/' + original.relative_to(public).as_posix()))
(project / 'src/server/asset-aliases.json').write_text(json.dumps(dict(aliases), indent=2), encoding='utf-8')

archive = public / 'backup/index.html'
html = archive.read_text(encoding='utf-8', errors='replace')
replacement = '<canvas id="archive-intro" width="757" height="236" role="img" aria-label="Hong Xuan automotive products"></canvas><script src="/archive-intro/animation.js" defer></script>'
html = re.sub(r'<object\b.*?</object>', replacement, html, flags=re.I | re.S)
archive.write_text(html, encoding='utf-8')
footer = public / 'bottom.html'
footer.write_text(footer.read_text(encoding='utf-8').replace('href="terms.asp"', 'href="/terms"'), encoding='utf-8')
# The supplied archive references these absent, explicitly 1x1 spacer GIFs.
# Reconstruct transparent pixels without changing the archived table geometry.
for name in ['backup/images/000none.gif', 'backup/picture/000none.gif']:
    spacer = public / name
    spacer.parent.mkdir(parents=True, exist_ok=True)
    spacer.write_bytes(base64.b64decode('R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'))
runpy.run_path(str(project/'scripts/responsive-archive.py'))
print(f'Copied {count} assets; recorded {len(aliases)} case aliases; replaced archive Flash object with Canvas.')
