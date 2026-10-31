"""Renderar introduktionsfilmen ur film.html: en bild per ruta, 25 rutor per sekund, korta övertoningar mellan scenerna.
Användning: python3 render.py [bas-url] [arbetsmapp]. Kräver att arkivets rot serveras (python3 -m http.server 8765)
och att skärmbilderna finns i tools/film/shots/ (sense.py, see.py och shift.py med OUT=tools/film/shots/)."""
import asyncio, os, subprocess, sys, json
from playwright.async_api import async_playwright
BASE = sys.argv[1] if len(sys.argv) > 1 else 'http://localhost:8765/'
WORK = sys.argv[2] if len(sys.argv) > 2 else '/tmp/film/render'
FPS, XF = 25, 0.5
ONLY = os.environ.get('ONLY')
async def main():
    os.makedirs(WORK, exist_ok=True)
    async with async_playwright() as p:
        b = await p.chromium.launch(); pg = await b.new_page(viewport={'width': 1280, 'height': 720})
        await pg.goto(BASE + 'tools/film/film.html'); await pg.evaluate('document.fonts.ready')
        manus = await pg.evaluate('MANUS.map(s => ({id: s.id, dur: s.dur, bild: s.bild || null}))')
        json.dump(manus, open(WORK + '/manus.json', 'w'))
        for i, s in enumerate(manus):
            if ONLY and s['id'] not in ONLY.split(','): continue
            d = f"{WORK}/{i:02d}"; os.makedirs(d, exist_ok=True)
            n = int(round(s['dur'] * FPS))
            await pg.evaluate(f'renderScene({i}, 0)')
            await pg.evaluate("Promise.all([...document.images].map(im => im.complete ? 0 : new Promise(r => { im.onload = im.onerror = r; })))")
            for f in range(n):
                await pg.evaluate(f'renderScene({i}, {f / FPS})')
                await pg.locator('#stage').screenshot(path=f'{d}/{f:04d}.jpg', type='jpeg', quality=94)
            print(s['id'], n, flush=True)
        await b.close()
asyncio.run(main())
