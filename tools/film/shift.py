"""Kör Shift med See-filen som underlag: spelet Förmågefällan, riktning, trimförsök, kursavläsning, och slutsidan."""
import asyncio, sys, json
from playwright.async_api import async_playwright
from common import shot
BASE = sys.argv[1] if len(sys.argv) > 1 else 'http://localhost:8765/'
OUT = sys.argv[2] if len(sys.argv) > 2 else '/tmp/film/shots/'
PLAN = [(8, 0, 0, 'lar'), (8, 0, 1, None), (4, 0, 1, None), (8, 0, 0, 'lyft'), (8, 0, 0, None), (8, 0, 0, 'check'), (4, 0, 0, None), (4, 0, 0, None)]
async def nxt(pg): await pg.click('[data-act=next]'); await pg.wait_for_timeout(150)
async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch(); pg = await b.new_page(viewport={'width': 1280, 'height': 800})
        await pg.goto(BASE + 'shift/'); env = open(OUT + 'see.json').read()
        await pg.evaluate('e => { localStorage.clear(); localStorage.setItem("lca.info.sett","1"); localStorage.setItem("lca.overlamning", e); }', env); await pg.reload()
        await pg.click('[data-act=fromhandoff]')
        await nxt(pg)                      # uppgifter -> underlag
        await nxt(pg)                      # underlag -> spel
        await shot(pg, OUT + 'shift-spel-start.png')
        await pg.click('[data-act=spelstart]')
        for i, (t, g, v, k) in enumerate(PLAN):
            await pg.click(f'[data-spt="{t}"]'); await pg.click(f'[data-spgen="{g}"]'); await pg.click(f'[data-spvid="{v}"]')
            if k and await pg.locator(f'[data-spkort="{k}"]:not([disabled])').count(): await pg.click(f'[data-spkort="{k}"]')
            if i == 4: await shot(pg, OUT + 'shift-spel-vecka.png')
            await pg.click('[data-act=spelkor]'); await pg.wait_for_timeout(120)
        await pg.fill('[data-path="spel.samtal.0"]', 'Vecka tre, när beställaren tryckte på. Vi tänkte att vi tar igen det sen.')
        await shot(pg, OUT + 'shift-spel-avslojande.png')
        await nxt(pg)                      # -> riktning
        await pg.click('[data-act=addfraga][data-i="0"]')
        if await pg.locator('[data-act=addfraga][data-i="0"]').count(): await pg.click('[data-act=addfraga][data-i="0"]')
        await shot(pg, OUT + 'shift-riktning.png')
        await nxt(pg)                      # -> ram
        await pg.click('[data-act=spelhinder]'); await pg.fill('[data-path="ram.motto"]', 'Små steg, varje vecka'); await pg.fill('[data-path="ram.ansvarig"]', 'Maud')
        await nxt(pg)
        while (await pg.evaluate('window.__shift.state().steg')).startswith('plan-'):
            st = await pg.evaluate('window.__shift.state().steg'); i = await pg.evaluate("s => window.__shift.state().forsok.findIndex(f => 'plan-'+f.fraga === s)", st)
            if await pg.locator('[data-act=spelforsok]').count(): await pg.click('[data-act=spelforsok]')
            else:
                await pg.fill(f'[data-path="forsok.{i}.om"]', 'skyddar två timmar i veckan för att pröva det nya arbetssättet')
                await pg.fill(f'[data-path="forsok.{i}.tror"]', 'fler vågar pröva när tiden är avsatt')
                await pg.fill(f'[data-path="forsok.{i}.forutsagelse"]', 'Tiden används båda veckorna.')
            await pg.fill(f'[data-path="forsok.{i}.titel"]', 'Lär av någon som redan kan')
            await pg.fill(f'[data-path="forsok.{i}.var"]', 'I projektet för Plan B')
            await pg.fill(f'[data-path="forsok.{i}.matt"]', 'Färre saker som görs om')
            await pg.fill(f'[data-path="forsok.{i}.vem"]', 'Projektgruppen')
            await nxt(pg)
        await pg.evaluate("() => { const s = window.__shift.state(); s.forsok.forEach(f => { f.nar = '2026-10-01'; }); window.__shift.set(s); window.__shift.go('oversikt'); }")
        fid = await pg.evaluate('window.__shift.state().forsok[0].id')
        await pg.evaluate(f"window.__shift.go('a-{fid}')")
        await pg.fill('[data-path="forsok.0.av.hande"]', 'Vi bjöd in en projektledare från ett annat bolag som redan arbetar så. Två av oss provade arbetssättet i ett projekt.')
        await pg.click('[data-ajam="0"]'); await pg.fill('[data-path="forsok.0.av.bast"]', 'Snabbare start på analysen')
        await pg.fill('[data-path="forsok.0.av.overraskade"]', 'Hur lite som behövde ändras')
        await pg.locator('[data-eff]').nth(0).click(); await pg.locator('[data-eff]').nth(1).click()
        await pg.fill('[data-path="forsok.0.av.vilka"]', 'Kunden fick ett bättre underlag')
        await pg.click('[data-avag="1"]'); await pg.click('[data-anu="4"]'); await pg.click('[data-abes="fortsatt"]')
        await pg.fill('[data-path="forsok.0.av.nasta"]', 'Skriv ner arbetssättet som en checklista och pröva den i nästa projekt.')
        await shot(pg, OUT + 'shift-avlasning.png')
        await pg.evaluate("window.__shift.go('rapport')")
        env = await pg.evaluate('JSON.stringify(window.__shift.envelope())'); open(OUT + 'shift.json', 'w').write(env)
        await pg.click('[data-act=toslut]'); await pg.wait_for_load_state('load'); await pg.wait_for_timeout(600)
        if await pg.locator('[data-act=fromhandoff], [data-act=useho]').count(): await pg.locator('[data-act=fromhandoff], [data-act=useho]').first.click()
        await pg.wait_for_timeout(500)
        await shot(pg, OUT + 'slut.png')
        print('klart:', await pg.title()); await b.close()
asyncio.run(main())
