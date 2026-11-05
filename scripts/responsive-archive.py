"""Add viewport-aware styling to the retained historical HTML pages."""
from pathlib import Path
import re
public=Path(__file__).resolve().parents[1]/'public'
for path in [*sorted((public/'backup').rglob('*.html')),public/'map.html']:
    html=path.read_text(encoding='utf-8',errors='replace')
    if 'name="viewport"' not in html:
        html=re.sub(r'</head>', '<meta name="viewport" content="width=device-width, initial-scale=1"><link rel="stylesheet" href="/styles/responsive.css"></head>',html,count=1,flags=re.I)
    if 'class="archive-page"' not in html:
        html=re.sub(r'<body\b', '<body class="archive-page"',html,count=1,flags=re.I)
    path.write_text(html,encoding='utf-8',newline='')
