"""Kör Sense med exempeldata (Engströms Mickla AB, påhittade svar) och tar skärmbilder till filmen."""
import asyncio, random, sys
from playwright.async_api import async_playwright
from common import shot
BASE = sys.argv[1] if len(sys.argv) > 1 else 'http://localhost:8765/'
OUT = sys.argv[2] if len(sys.argv) > 2 else '/tmp/film/shots/'
random.seed(4)
SCEN = [('Snabb omställning', 'AI och nya affärsmodeller slår igenom snabbt, och kunderna köper resultat i stället för timmar.'),
        ('Tekniken springer före', 'Verktygen finns, men beställarna håller fast vid timpris och gamla upphandlingar.'),
        ('Försiktig förnyelse', 'Förändringen går långsamt, och den som vill förnya får göra det på egen hand.'),
        ('Kompetensen avgör', 'Bristen på erfarna medarbetare styr mer än tekniken vilka uppdrag som blir av.')]
async def step(pg): return await pg.evaluate('window.__sense.state().steg')
async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch(); pg = await b.new_page(viewport={'width': 1280, 'height': 800})
        await pg.goto(BASE + 'sense/'); await pg.evaluate('localStorage.clear(); localStorage.setItem("lca.info.sett","1")'); await pg.reload()
        await pg.click('[data-act=new]'); await pg.fill('[data-path="meta.foretag"]', 'Engströms Mickla AB'); await pg.click('[data-act=next]')
        for _ in range(80):
            st = await step(pg)
            if st == 'fokus':
                for name in ['Digitalisering, data och AI', 'Kompetensförsörjning', 'Kunskapsföretagets affärsmodell']:
                    await pg.locator('label.pick', has_text=name).locator('input').check()
                await shot(pg, OUT + 'sense-fokus.png')
            elif st == 'signaler':
                n = 0
                while await pg.evaluate('window.__sense.state().trender.filter(t=>t.trend && t.trend.trim()).length') < 6 and n < 8:
                    bt = pg.locator('[data-act=addex]').first
                    if not await bt.count(): break
                    await bt.click(); n += 1
            elif st == 'bedomning':
                rows = await pg.locator('[data-bp]').count()
                for grp in ['data-bp', 'data-bs']:
                    ids = await pg.evaluate("a => [...new Set([...document.querySelectorAll('['+a+']')].map(e=>e.getAttribute('data-i')||e.getAttribute('data-id')))]", grp)
                    for i in ids:
                        sel = f'[{grp}][data-i="{i}"]' if await pg.locator(f'[{grp}][data-i="{i}"]').count() else f'[{grp}][data-id="{i}"]'
                        bs = pg.locator(sel); k = await bs.count()
                        await bs.nth(random.choice([k - 1, k - 2, k - 3]) if grp == 'data-bp' else random.randrange(k)).click()
            elif st.startswith('q-'):
                await pg.locator('[data-mv]').nth(random.choice([0, 1, 2, 2, 3])).click(); await pg.wait_for_timeout(350); continue
            elif st == 'axlar':
                for loc in await pg.locator('input[data-path^="axlar.and."]').all():
                    path = await loc.get_attribute('data-path')
                    await loc.fill('Långsamt och försiktigt' if path.endswith('svag') else 'Snabbt och genomgripande')
            elif st == 'scenarier':
                for i, (n_, t) in enumerate(SCEN):
                    await pg.fill(f'[data-path="scen.{i}.namn"]', n_)
                    if await pg.locator(f'[data-path="scen.{i}.text"]').count(): await pg.fill(f'[data-path="scen.{i}.text"]', t)
            elif st == 'varden':
                for name in ['Erbjudande och kundvärde', 'Kompetens och medarbetare', 'Ekonomi och finansiering', 'Kunder och marknad']:
                    await pg.locator('.vrow', has_text=name).locator('input[type=checkbox]').check()
                ants = {'Erbjudande': 'Kunderna betalar för vår tid', 'Kompetens': 'Erfarna medarbetare går att rekrytera', 'Ekonomi': 'Debiteringsgraden bär lönsamheten', 'Kunder': 'Beställarna köper som i dag'}
                for k, v in ants.items():
                    row = pg.locator('.vrow', has_text=k)
                    ins = row.locator('input[type=text], textarea')
                    for j in range(await ins.count()): await ins.nth(j).fill(v if j else 'Uppdrag inom samhällsbyggnad')
            elif st.startswith('vind-'):
                lg = pg.locator('[data-lage]')
                for j in range(0, await lg.count(), 3): await lg.nth(j + random.choice([0, 0, 1, 2])).click()
                u = pg.locator('[data-utv]'); await u.nth(random.choice([0, 1, 1, 2])).click()
            elif st == 'karta':
                for _ in range(2):
                    a = pg.locator('[data-act=addkoll][data-fran]')
                    if await a.count(): await a.first.click()
                for i in range(await pg.locator('.card.koll').count()):
                    ant = pg.locator(f'[data-path="kollisioner.{i}.ant"]')
                    if not (await ant.input_value()).strip(): await ant.fill('Kunderna betalar för vår tid')
                    await pg.locator(f'[data-kt][data-i="{i}"]').nth(4 - i).click()
                    await pg.locator(f'[data-ke][data-i="{i}"]').nth(1 + i).click()
                    await pg.locator(f'[data-ks][data-i="{i}"]').nth(1 + i).click()
                fs = pg.locator('[data-see]', has=pg.locator('.tag'))
                await (fs.first if await fs.count() else pg.locator('[data-see]').first).click()
                await shot(pg, OUT + 'sense-karta.png')
            elif st == 'rapport':
                break
            nx = pg.locator('[data-act=next]')
            if await nx.is_disabled():
                print('fast i', st, await pg.inner_text('#missing')); break
            await nx.click(); await pg.wait_for_timeout(120)
        env = await pg.evaluate('JSON.stringify(window.__sense.envelope())')
        open(OUT + 'sense.json', 'w').write(env)
        print('Sense klar i', await step(pg)); await b.close()
asyncio.run(main())
