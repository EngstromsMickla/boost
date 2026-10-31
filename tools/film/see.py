"""Kör See med Sense-filen som underlag (exempeldata) och tar skärmbilder till filmen."""
import asyncio, random, sys, json
from playwright.async_api import async_playwright
from common import shot
BASE = sys.argv[1] if len(sys.argv) > 1 else 'http://localhost:8765/'
OUT = sys.argv[2] if len(sys.argv) > 2 else '/tmp/film/shots/'
NIVA = [3, 2.5, 2, 3, 3.5, 1, 2.5, 1.5, 3, 2.5, 3, 2]
async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch(); pg = await b.new_page(viewport={'width': 1280, 'height': 800})
        await pg.goto(BASE + 'see/'); env = open(OUT + 'sense.json').read()
        await pg.evaluate('e => { localStorage.clear(); localStorage.setItem("lca.info.sett","1"); localStorage.setItem("lca.overlamning", e); }', env); await pg.reload()
        await pg.click('[data-act=fromhandoff]')
        k = 0
        for _ in range(60):
            st = await pg.evaluate('window.__dv.state().steg')
            if st and st.startswith('f') and st[1:].isdigit():
                v = NIVA[k % 12]; k += 1
                await pg.click(f'[data-level="{v if v % 1 else int(v)}"]')
            elif st and st.startswith('agency-'):
                ids = await pg.evaluate("[...new Set([...document.querySelectorAll('[data-likert]')].map(e=>e.getAttribute('data-likert')))]")
                for pid in ids:
                    val = {'K': 2, 'F': 4, 'U': 3, 'V': 4, 'T': 3}.get(pid[0], 3)
                    await pg.click(f'[data-likert="{pid}"][data-val="{val}"]')
            elif st and st.startswith('diagnos-'):
                if not await pg.evaluate('!!window.__dv.state().beslut[' + st.split('-')[1] + ']'):
                    await pg.locator('[data-beslut]').first.click()
                if not hasattr(main, 'd'):
                    main.d = 1; await shot(pg, OUT + 'see-diagnos.png')
            elif st == 'profil':
                await shot(pg, OUT + 'see-profil.png')
            elif st == 'styrka':
                pass
            elif st == 'egna':
                await pg.fill('[data-field="egnaAtgarder"]', 'Pröva ett nytt arbetssätt i ett avgränsat projekt före jul.')
            elif st == 'rapport':
                break
            nx = pg.locator('[data-act=next]')
            if await nx.is_disabled():
                print('fast i', st, await pg.inner_text('#app')[:300] if False else ''); break
            await nx.click(); await pg.wait_for_timeout(120)
        env = await pg.evaluate('JSON.stringify(window.__dv.envelope())')
        open(OUT + 'see.json', 'w').write(env); print('See klar i', st); await b.close()
asyncio.run(main())
