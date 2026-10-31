"""Gemensamt för filmens skärmbilder: bara arbetsytan, utan klistrat sidhuvud och nästa-rad."""
STYLE = '.topbar,.navrow{position:static!important} .info-tip{display:none!important} body{background:#f3f3f1}'
async def shot(pg, path, extra=''):
    await pg.add_style_tag(content=STYLE + extra)
    await pg.wait_for_timeout(150)
    await pg.locator('#app').screenshot(path=path)
