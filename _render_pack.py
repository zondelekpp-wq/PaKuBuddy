#!/usr/bin/env python3
"""Draws every exhibit in school/packs.json into pack_preview.png so you can look at the pictures.
Also opens each picture in headless Chrome and reports parts that fall outside the 300x240 frame.
Usage: python3 _render_pack.py"""
import json, os, sys
from playwright.sync_api import sync_playwright
here=os.path.dirname(os.path.abspath(__file__))
pack=json.load(open(os.path.join(here,'school/packs.json')))
ex=pack.get('exhibits',[])
if not ex: print('no exhibits'); sys.exit(0)
cards=''.join(f'<div class="c" style="background:{x["bg"]}"><svg viewBox="0 0 300 240" data-id="{x["id"]}"><g stroke="#3A2E4F" stroke-width="3" stroke-linejoin="round" stroke-linecap="round" fill="none">{x["svg"]}</g></svg><b>{x["id"]} · {x["en"]["n"]}</b></div>' for x in ex)
page=f'<html><body style="margin:0;display:flex;flex-wrap:wrap;gap:6px;padding:6px;font:13px sans-serif;background:#fff"><style>.c{{width:330px;border-radius:12px;text-align:center}}.c svg{{width:330px;height:264px}}</style>{cards}</body></html>'
open('/tmp/_pack_preview.html','w').write(page)
with sync_playwright() as p:
    b=p.chromium.launch(); pg=b.new_page(viewport={'width':1400,'height':300*((len(ex)+3)//4)+20})
    pg.goto('file:///tmp/_pack_preview.html'); pg.wait_for_timeout(400)
    out=pg.evaluate("""()=>[...document.querySelectorAll('svg[data-id]')].flatMap(s=>[...s.querySelectorAll('[data-p]')].map(g=>{const b=g.getBBox();return {id:s.dataset.id,p:g.dataset.p,x:b.x,y:b.y,w:b.width,h:b.height};}))""")
    pg.screenshot(path=os.path.join(here,'pack_preview.png'),full_page=True); b.close()
bad=[o for o in out if o['w']==0 or o['h']==0 or o['x']<-5 or o['y']<-5 or o['x']+o['w']>305 or o['y']+o['h']>245]
for o in bad: print(f"check {o['id']}/{o['p']}: box x={o['x']:.0f} y={o['y']:.0f} w={o['w']:.0f} h={o['h']:.0f}")
print('pack_preview.png written;', 'all parts inside the frame' if not bad else f'{len(bad)} part(s) to check')
