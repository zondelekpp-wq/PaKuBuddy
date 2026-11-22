#!/usr/bin/env python3
"""Builds PaKuBuddy.zip – the ready-to-use app (flat, no subfolders). Run before every release:  python3 _build_zip.py"""
import os, zipfile
here = os.path.dirname(os.path.abspath(__file__))
SKIP = {'PaKuBuddy.zip', '_build_zip.py', '.nojekyll', '_validate_pack.js', '_render_pack.py', 'pack_preview.png'}
files = sorted(f for f in os.listdir(here) if os.path.isfile(os.path.join(here, f)) and not f.startswith('.git') and f not in SKIP and not f.endswith('.md'))
with zipfile.ZipFile(os.path.join(here, 'PaKuBuddy.zip'), 'w', zipfile.ZIP_DEFLATED, compresslevel=9) as z:
    for f in files: z.write(os.path.join(here, f), f)
print(f'PaKuBuddy.zip: {len(files)} files')
