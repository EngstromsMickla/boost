/* Dialogverktyg — Learning Curve Approach: slutsidan.
   Statisk sida, all data stannar i webbläsaren. © Engströms Mickla AB 2026 */
(function () {
  'use strict';
  var C = window.CONTENT, app = document.getElementById('app');
  var KEY = 'lca.slut.v1';
  var TEMPO = ['Redan nu', 'Inom 1 till 3 år', 'Inom 3 till 10 år', 'Bortom 10 år'];
  var AXK = { formaga: 'förmågan', mandat: 'mandatet', vilja: 'viljan' };
  var AXN = { formaga: 'Förmåga', mandat: 'Mandat', vilja: 'Vilja' };
  var env = null;
  var BES = { fortsatt: 'fortsätt', justera: 'justera', skala: 'skala upp eller sprid', avbryt: 'avbryt' };

  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function fill(t, map) { return t.replace(/\{(\w+)\}/g, function (m, k) { return map[k] != null ? map[k] : m; }); }
  function toast(msg) { var t = document.createElement('div'); t.className = 'toast'; t.textContent = msg; document.body.appendChild(t); setTimeout(function () { t.remove(); }, 3200); }
  function lista(a) { var och = a.some(function (x) { return / och /.test(x) && !/^”/.test(x); }) ? ' samt ' : ' och '; return a.length > 1 ? a.slice(0, -1).join(', ') + och + a[a.length - 1] : (a[0] || ''); }
  function lc(x) { x = String(x || ''); return /^[A-ZÅÄÖ][a-zåäö]/.test(x) ? x.charAt(0).toLowerCase() + x.slice(1) : x; }
  function fmt(x) { return x == null || isNaN(x) ? '–' : (Math.round(x * 10) / 10).toString().replace('.', ','); }
  function get(k) { try { var s = localStorage.getItem(k); return s ? JSON.parse(s) : null; } catch (e) { return null; } }
  function set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }

  /* ---------- kedjan ---------- */
  function delar(e) {
    var s = e && e.kedja && e.kedja.sense, see = e && e.kedja && e.kedja.see, sh = e && e.modul === 'shift' ? e.lamnar : null;
    return { sense: s && s.kollisioner && s.kollisioner.length ? s : null, see: see && see.valda && see.valda.length ? see : null, shift: sh && sh.riktning ? sh : null };
  }
  function saknade(e) { var d = delar(e); return ['sense', 'see', 'shift'].filter(function (k) { return !d[k]; }); }

  /* ---------- framtidsberedskap ---------- */
  function tempoIndex(k) { if (typeof k.tempoIndex === 'number') return k.tempoIndex; var i = TEMPO.indexOf(k.tempo); return i < 0 ? 2 : i; }
  function beredskap() {
    var d = delar(env), best = null, behov = 1;
    d.sense.kollisioner.forEach(function (k) {
      if (typeof k.tryck !== 'number') return;
      var t = tempoIndex(k), niva = k.tryck >= 4 && t <= 1 ? 3 : (k.tryck >= 4 || (k.tryck >= 3 && t <= 2)) ? 2 : 1;
      if (!best || niva > best.niva || (niva === best.niva && k.tryck > best.k.tryck)) best = { niva: niva, k: k };
    });
    if (best) { behov = best.niva; best = best.k; }
    /* Stegprincipen: under nivå 2 (Definierad) låg, från 2 till 3 måttlig, från 3 hög. Indexet avrundas som det visas. */
    var idx = d.see.index, ri = Math.round(idx * 10) / 10, formaga = ri < 2 ? 1 : ri < 3 ? 2 : 3, diff = formaga - behov;
    var lage = diff > 0 ? 'over' : diff === 0 ? 'vaksam' : diff === -1 ? 'sarbar' : 'fara';
    var B = C.beredskap;
    var grund = best ? fill(B.grund, { behov: B.behovNamn[behov - 1].toLowerCase(), kollision: best.namn, tryck: best.tryck, tempo: lc(best.tempo || TEMPO[tempoIndex(best)]), formaga: B.formagaNamn[formaga - 1].toLowerCase(), index: fmt(idx) }) : '';
    return { behov: behov, formaga: formaga, lage: lage, grund: grund };
  }
  function beredskapSVG(b) {
    var W = 520, H = 360, L = 110, T = 20, w = 380, h = 270, cw = w / 3, ch = h / 3, F = 'Helvetica, Arial, sans-serif', B = C.beredskap;
    var g = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ' + W + ' ' + H + '" font-family="' + F + '" role="img" aria-label="Framtidsberedskap: tryck mot förmåga">';
    for (var bi = 1; bi <= 3; bi++) for (var fi = 1; fi <= 3; fi++) {
      var d = fi - bi, col = d > 0 ? '#f5ecd3' : d === 0 ? '#e3eeea' : d === -1 ? '#f6e4dc' : '#ecc7b6';
      g += '<rect x="' + (L + (bi - 1) * cw) + '" y="' + (T + (3 - fi) * ch) + '" width="' + cw + '" height="' + ch + '" fill="' + col + '" stroke="#fff" stroke-width="2"/>';
    }
    g += '<text x="' + (L + 0.5 * cw) + '" y="' + (T + 0.5 * ch) + '" font-size="12" fill="#a57a12" text-anchor="middle">' + esc(B.lagen.over.namn.split(' ').slice(0, 2).join(' ')) + '</text>';
    g += '<text x="' + (L + 1.5 * cw) + '" y="' + (T + 1.5 * ch + 22) + '" font-size="12" fill="#2f6b5e" text-anchor="middle">' + esc(B.lagen.vaksam.namn) + '</text>';
    g += '<text x="' + (L + 1.5 * cw) + '" y="' + (T + 2.5 * ch + 22) + '" font-size="12" fill="#b8532c" text-anchor="middle">' + esc(B.lagen.sarbar.namn) + '</text>';
    g += '<text x="' + (L + 2.5 * cw) + '" y="' + (T + 2.5 * ch + 22) + '" font-size="12" fill="#8c3b1b" text-anchor="middle">' + esc(B.lagen.fara.namn) + '</text>';
    for (var i = 0; i < 3; i++) {
      g += '<text x="' + (L + (i + 0.5) * cw) + '" y="' + (T + h + 18) + '" font-size="12" fill="#5d6773" text-anchor="middle">' + esc(B.behovNamn[i]) + '</text>';
      g += '<text x="' + (L - 10) + '" y="' + (T + (2.5 - i) * ch + 4) + '" font-size="12" fill="#5d6773" text-anchor="end">' + esc(B.formagaNamn[i]) + '</text>';
    }
    g += '<text x="' + (L + w / 2) + '" y="' + (H - 12) + '" font-size="12" font-weight="bold" fill="#1d2733" text-anchor="middle">' + esc(B.behovAxel) + '</text>';
    g += '<text x="18" y="' + (T + h / 2) + '" font-size="12" font-weight="bold" fill="#1d2733" text-anchor="middle" transform="rotate(-90 18 ' + (T + h / 2) + ')">' + esc(B.formagaAxel) + '</text>';
    var cx = L + (b.behov - 0.5) * cw, cy = T + (3 - b.formaga + 0.5) * ch - 8;
    g += '<circle cx="' + cx + '" cy="' + cy + '" r="16" fill="#1d2733"/><text x="' + cx + '" y="' + (cy + 5) + '" font-size="13" font-weight="bold" fill="#fff" text-anchor="middle">Ni</text>';
    return g + '</svg>';
  }

  /* ---------- lärandekurvan ---------- */
  function kurva() {
    var sh = delar(env).shift, lk = sh.larandekurva || {}, n = lk.avlasningar || 0;
    var fr = sh.rorelse || [], matta = fr.filter(function (r) { return r.fore != null && r.efter != null; }), upp = matta.filter(function (r) { return r.efter > r.fore; }).length;
    var s = {
      avlast: n >= 2 ? 2 : n === 1 ? 1 : 0,
      rorelse: upp > 0 && upp * 2 >= fr.length ? 2 : upp > 0 ? 1 : 0,
      faste: (lk.inforda || 0) > 0 ? 2 : (lk.delade || 0) > 0 ? 1 : 0,
      riktning: sh.period && sh.period.avslutad ? 2 : 0
    };
    var total = s.avlast + s.rorelse + s.faste + s.riktning;
    /* Tecknen räknas inte samman till ett tal. Omdömet bygger på hur många av de fyra tecknen som är uppfyllda. */
    var uppfyllda = [s.avlast, s.rorelse, s.faste, s.riktning].filter(function (v) { return v === 2; }).length;
    var omd = n === 0 ? 'tidigt' : uppfyllda === 4 ? 'uppfor' : uppfyllda >= 2 ? 'pavag' : 'borjat';
    var map = { n: n, upp: upp, inforda: lk.inforda || 0, delade: lk.delade || 0 };
    var krit = C.kurva.kriterier.map(function (k) { var v = s[k.id]; var t = v === 2 ? k.uppfyllt : v === 1 ? k.delvis : k.ej; if (k.id === 'rorelse') map.n = fr.length; if (k.id === 'avlast') map.n = n; return { namn: k.namn, v: v, text: fill(t, map) }; });
    return { s: s, total: total, omd: omd, krit: krit, pos: 0.42 + 0.56 * total / 8 };
  }
  function kurvaSVG(k) {
    var W = 640, H = 250, L = 30, R = 30, T = 20, B = 50, w = W - L - R, h = H - T - B, F = 'Helvetica, Arial, sans-serif';
    function y(x) { return T + h - h / (1 + Math.exp(-9 * (x - 0.5))); }
    var pts = []; for (var i = 0; i <= 60; i++) { var x = i / 60; pts.push((L + x * w).toFixed(1) + ',' + y(x).toFixed(1)); }
    var g = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ' + W + ' ' + H + '" font-family="' + F + '" role="img" aria-label="Er position på lärandekurvan">';
    g += '<line x1="' + L + '" y1="' + (T + h) + '" x2="' + (L + w) + '" y2="' + (T + h) + '" stroke="#ddd8cd"/>';
    var done = pts.filter(function (p) { return +p.split(',')[0] <= L + k.pos * w; });
    g += '<polyline points="' + pts.join(' ') + '" fill="none" stroke="#d9d4c8" stroke-width="6" stroke-linecap="round"/>';
    g += '<polyline points="' + done.join(' ') + '" fill="none" stroke="#2f6b5e" stroke-width="6" stroke-linecap="round"/>';
    C.kurva.faser.forEach(function (f, i) { var x = L + (0.08 + i * 0.28) * w; g += '<text x="' + x + '" y="' + (T + h + 22) + '" font-size="13" fill="#5d6773" text-anchor="middle" font-weight="bold">' + esc(f.toUpperCase()) + '</text>'; });
    var cx = L + k.pos * w, cy = y(k.pos);
    g += '<circle cx="' + cx + '" cy="' + cy + '" r="13" fill="#1d2733" stroke="#fff" stroke-width="3"/><text x="' + cx + '" y="' + (cy + 4.5) + '" font-size="11" font-weight="bold" fill="#fff" text-anchor="middle">Ni</text>';
    return g + '</svg>';
  }

  /* ---------- rapport ---------- */
  function block() {
    var d = delar(env), R = C.rapport, org = env.organisation.namn || 'Organisationen', s = d.sense, e = d.see, sh = d.shift;
    var b = beredskap(), k = kurva(), BL = C.beredskap.lagen[b.lage], KO = C.kurva.omdomen[k.omd];
    var nk = s.kollisioner.length, nf = (sh.riktning || []).length, nfo = (sh.forsok || []).length, na = (sh.larandekurva || {}).avlasningar || 0;
    var sam = [fill(R.sammanfattning, { org: org }) + ' ' +
      fill(R.sense, { fraga: (s.fokusfraga || '').replace(/[?.]$/, '') + '?', n: nk === 1 ? 'en framtidskollision' : nk + ' framtidskollisioner', framtid: (s.scenario && s.scenario.namn) || (e.scenario && e.scenario.namn) || '' }) + ' ' +
      fill(R.see, { index: fmt(e.index), omdome: lc(e.omdome || ''), valda: lista(e.valda.map(function (v) { return lc(v.namn); })) }) + ' ' +
      fill(R.shift, { nf: nf === 1 ? 'en lärandefråga' : nf + ' lärandefrågor', nfo: nfo === 1 ? 'ett trimförsök' : nfo + ' trimförsök', na: na })];
    sam.push(fill(R.slutsats, { lage: BL.namn.toLowerCase(), kurva: KO.namn }));
    var analys = [{ titel: C.beredskap.rubrik + ': ' + BL.namn, text: BL.text + ' ' + b.grund }, { titel: R.kurvaTitel + ': ' + KO.namn.toLowerCase(), text: KO.text }];
    (sh.riktning || []).forEach(function (r) {
      var rr = r.fore != null && r.efter != null ? fill(r.efter > r.fore ? R.rorelseUpp : R.rorelseNed, { fore: fmt(r.fore), efter: fmt(r.efter) }) : R.rorelseIngen;
      analys.push({ titel: R.kopplingTitel, text: fill(R.koppling, { fraga: r.fraga, axel: AXK[r.axel] || r.axel, behov: r.behov ? ' för ' + lc(r.behov) : '', rorelse: (AXN[r.axel] || '') + ' ' + rr }) });
    });
    var eff = {}; (sh.forsok || []).forEach(function (f) { (f.effekter || []).forEach(function (x) { eff[x] = (eff[x] || 0) + 1; }); });
    var top = Object.keys(eff).sort(function (a, c) { return eff[c] - eff[a]; }).slice(0, 2);
    if (top.length) analys.push(fill(R.effekter, { lista: lista(top.map(function (x) { return x.toLowerCase(); })) }));
    tillampningar().forEach(function (t) {
      analys.push({ titel: fill(R.tillampningTitel, { namn: t.namn }), text: fill(R.tillampningText, { objekt: t.objekt ? t.objekt + '. ' : '', samlad: lc(t.samlad || 'ej gjord'), sarbara: ((t.sarbara || []).length ? fill(R.tillampningSarbara, { lista: lista(t.sarbara.map(lc)) }) : '') + ((t.fallor || []).length ? fill(R.tillampningFallor, { namn: t.fallorNamn || 'Fällor', lista: lista(t.fallor.map(lc)) }) : '') }) });
    });
    var forslag = [];
    var svag = (sh.rorelse || []).filter(function (r) { return r.efter == null || r.fore == null || r.efter <= r.fore; })[0];
    if ((b.lage === 'sarbar' || b.lage === 'fara') && svag) forslag.push({ titel: R.forslagAxel, text: fill(R.forslagAxelText, { axel: AXK[svag.axel] || svag.axel, formaga: lc(svag.behov || '') }) });
    if (k.s.faste < 2) forslag.push({ titel: R.forslagFaste, text: R.forslagFasteText });
    var sett = {}, nasta = (sh.forsok || []).filter(function (f) { return f.nasta && f.status === 'klart' && !f.fortsatt && !sett[f.nasta] && (sett[f.nasta] = true); });
    if (nasta.length === 1) forslag.push({ titel: R.forslagNasta, text: nasta[0].nasta });
    else if (nasta.length > 1) forslag.push({ titel: R.forslagNastaFler, text: nasta.map(function (f) { var i = (sh.riktning || []).map(function (r) { return r.fraga; }).indexOf(f.fraga); return f.nasta.replace(/[.]$/, '') + (i >= 0 ? ' (lärandefråga ' + (i + 1) + ')' : ''); }).join('; ') + '.' });
    if (sh.ledningensHinder) forslag.push({ titel: R.forslagHinder, text: sh.ledningensHinder });
    if (s.robustaAtgarder && s.robustaAtgarder.length) forslag.push({ titel: R.forslagRobust, text: lista(s.robustaAtgarder.slice(0, 3)) + '.' });
    tillampningar().forEach(function (t) { if ((t.robustaAtgarder || []).length) forslag.push({ titel: fill(R.tillampningRobust, { namn: lc(t.namn) }), text: (function (a) { var x = lista(a.map(function (r, i) { r = r.replace(/[.]$/, ''); return i ? lc(r) : r; })); return x.charAt(0).toUpperCase() + x.slice(1) + '.'; })(t.robustaAtgarder.slice(0, 3)) }); });
    forslag.push({ titel: R.forslagNyRunda, text: R.forslagNyRundaText });
    return { sammanfattning: sam, analys: analys, forslag: forslag, b: b, k: k };
  }
  function tillampningar() { var t = env && env.kedja && env.kedja.tillampningar; return t ? Object.keys(t).map(function (k) { return t[k]; }) : []; }
  function tillampningHTML() {
    var tl = tillampningar(); if (!tl.length) return '';
    return '<h3>' + esc(C.rapport.tillampningRubrik) + '</h3>' + tl.map(function (t) {
      return '<div class="card tight"><b>' + esc(t.namn) + (t.objekt ? ': ' + esc(t.objekt) : '') + '</b><p class="small" style="margin:4px 0">' + esc(t.samlad || '') + ((t.scenarier || []).length ? ' <span class="muted">(' + esc(t.scenarier.map(function (x) { return x.namn + ': ' + lc(x.utveckling || '–'); }).join(' · ')) + ')</span>' : '') + '</p>' +
        ((t.robustaAtgarder || []).length ? '<ul class="plain">' + t.robustaAtgarder.map(function (r) { return '<li class="small">' + esc(r) + '</li>'; }).join('') + '</ul>' : '') + '</div>';
    }).join('');
  }
  function kedjaHTML() {
    var d = delar(env), s = d.sense, e = d.see, sh = d.shift, F = C.faser, lk = sh.larandekurva || {};
    function kort(id, inner) { return '<div class="card tight fas"><div class="eyebrow">' + esc(F[id].namn) + ' · ' + esc(F[id].fraga) + '</div>' + inner + '</div>'; }
    return '<div class="kedja">' +
      kort('sense', '<p class="small" style="margin-bottom:6px">' + esc(s.fokusfraga || '') + '</p>' + (s.scenario && s.scenario.namn ? '<p class="small" style="margin-bottom:6px">Framtid: <b>' + esc(s.scenario.namn) + '</b></p>' : '') + '<ul class="plain">' + s.kollisioner.map(function (k) { return '<li class="small"><b>' + esc(k.namn) + '</b><span class="muted"> · tryck ' + (k.tryck || '–') + ', ' + esc(lc(k.tempo || '')) + '</span></li>'; }).join('') + '</ul>') +
      kort('see', '<div class="index-big small-big">' + fmt(e.index) + '</div><p class="small" style="margin-bottom:6px">Lärandeindex av 4, ' + esc(lc(e.omdome || '')) + '. Profilen är ' + esc(e.form || '') + '.</p><ul class="plain">' + e.valda.map(function (v) { return '<li class="small"><b>' + esc(v.namn) + '</b><span class="muted"> · svagast: ' + esc((v.svagastAxel || []).map(function (a) { return a === 'jamn' ? 'jämn' : (AXK[a] || a); }).join(', ')) + '</span></li>'; }).join('') + '</ul>') +
      kort('shift', '<ul class="plain">' + (sh.riktning || []).map(function (r) { return '<li class="small">' + esc(r.fraga) + '<span class="muted"> · ' + esc(AXN[r.axel] || '') + ' ' + fmt(r.fore) + ' → ' + fmt(r.efter) + '</span></li>'; }).join('') + '</ul><p class="small" style="margin:8px 0 0">' + (sh.forsok || []).length + ' trimförsök, ' + (lk.avlasningar || 0) + ' kursavläsningar, ' + (lk.delade || 0) + ' lärdomar delade, ' + (lk.inforda || 0) + ' införda i arbetssätt.</p>') +
      '</div>';
  }
  function renderSida() {
    var bl = block(), b = bl.b, k = bl.k, B = C.beredskap, K = C.kurva, sh = delar(env).shift;
    var h = '<div class="eyebrow">' + esc(C.titel) + ' · Sense, See och Shift</div><h1>' + esc(env.organisation.namn || 'Er organisation') + '</h1><p class="lead">' + esc(C.undertitel) + '</p>';
    h += '<div class="actions" style="margin:0 0 18px"><button class="btn" data-act="pdf">' + esc(C.knappar.pdf) + '</button><a class="btn ghost" href="../shift/">' + esc(C.knappar.shift) + '</a><button class="btn quiet" data-act="open">' + esc(C.knappar.ny) + '</button></div>';
    h += '<div class="verdict-row"><div class="card tight verdict lage-' + b.lage + '"><div class="eyebrow">' + esc(B.rubrik) + '</div><div class="verdict-name">' + esc(B.lagen[b.lage].namn) + '</div></div><div class="card tight verdict kurva-' + k.omd + '"><div class="eyebrow">Lärandekurvan</div><div class="verdict-name">' + esc(K.omdomen[k.omd].namn) + '</div></div></div>';
    h += '<div class="card tight chartcard"><div class="chart">' + kurvaSVG(k) + '</div></div>';
    h += LCA.reportBlock({ sammanfattning: bl.sammanfattning, analys: bl.analys, forslag: bl.forslag });
    h += '<h3>' + esc(C.kedjaRubrik) + '</h3>' + kedjaHTML();
    h += tillampningHTML();
    h += '<h3>' + esc(B.rubrik) + '</h3><div class="note about-note small">' + esc(B.om) + '</div><div class="card tight chartcard bered"><div class="chart">' + beredskapSVG(b) + '</div><p class="small" style="margin:8px 0 0"><b>' + esc(B.lagen[b.lage].namn) + '.</b> ' + esc(B.lagen[b.lage].text) + ' ' + esc(b.grund) + '</p></div>';
    h += '<h3>' + esc(K.rubrik) + '</h3><div class="note about-note small">' + esc(K.om) + '</div><div class="card tight"><ul class="crit">' + k.krit.map(function (c) { return '<li class="v' + c.v + '"><span class="tag ' + (c.v === 2 ? 'cat-drivande' : c.v === 1 ? 'strong' : 'plain') + '">' + esc(K.status[c.v]) + '</span> <b>' + esc(c.namn) + '.</b> ' + esc(c.text) + '</li>'; }).join('') + '</ul></div>';
    var fo = sh.forsok || [];
    if (fo.length) h += '<h3>Trimförsöken</h3><div class="card tight"><ul class="plain">' + fo.map(function (f) { return '<li class="small"><b>' + esc(f.titel) + '</b><span class="muted"> · ' + esc(f.jamfort ? lc(f.jamfort) : 'inte avläst') + (f.beslut ? ' · ' + esc(BES[f.beslut] || f.beslut) : '') + '</span>' + (f.nasta ? '<br>Nästa: ' + esc(f.nasta) : '') + '</li>'; }).join('') + '</ul></div>';
    return h + LCA.teoriHTML() + '<p class="note small">' + esc(C.integritet) + '</p>';
  }
  function renderStart(saknas) {
    var S = C.start, h = '<div class="eyebrow">' + esc(C.titel) + '</div><h1>' + esc(C.titel) + '</h1><p class="lead">' + esc(C.undertitel) + '</p><p>' + esc(S.text) + '</p>';
    if (saknas) h += '<div class="note weak"><b>' + esc(S.saknasRubrik) + '.</b> ' + esc(fill(S.saknasText, { lista: lista(saknas.map(function (k) { return S.saknas[k]; })) })) + '</div>';
    h += '<div class="actions"><button class="btn" data-act="open">' + esc(S.oppna) + '</button><a class="btn ghost" href="../shift/">Till Shift</a></div>';
    return h + '<p class="note small" style="margin-top:20px">' + esc(C.integritet) + '</p>';
  }
  function render(saknas) { app.innerHTML = env && !saknade(env).length ? renderSida() : renderStart(saknas); window.scrollTo(0, 0); }
  function use(e) {
    if (!e || e.modul !== 'shift') { env = null; render(); toast(C.start.fel); return; }
    var m = saknade(e);
    if (m.length) { env = null; render(m); return; }
    env = e; set(KEY, e); render();
  }

  app.addEventListener('click', function (e) {
    var t = e.target.closest('button'); if (!t) return;
    var act = t.getAttribute('data-act');
    if (act === 'open') { document.getElementById('file-load').click(); return; }
    if (act === 'pdf') { makePDF(); return; }
  });
  document.getElementById('file-load').addEventListener('change', function (e) {
    var f = e.target.files[0]; e.target.value = ''; if (!f) return;
    LCA.readFile(f, function (x, err) { if (err) { toast(err); return; } use(x); });
  });

  /* ---------- PDF ---------- */
  function makePDF() {
    if (!window.jspdf) { toast('PDF-funktionen kunde inte laddas.'); return; }
    var doc = new window.jspdf.jsPDF({ unit: 'mm', format: 'a4' }), L = 18, Wt = 174, PH = 297, y = 20, bl = block(), b = bl.b, k = bl.k, B = C.beredskap, K = C.kurva;
    var INK = [29, 39, 51], MUT = [93, 103, 115], ACC = [47, 107, 94];
    function ensure(hh) { if (y + hh > PH - 20) { doc.addPage(); y = 20; } }
    function text(t, o) { o = o || {}; var size = o.size || 10, lh = size * 0.42 + 1.2; doc.setFont('helvetica', o.bold ? 'bold' : o.italic ? 'italic' : 'normal'); doc.setFontSize(size); doc.setTextColor.apply(doc, o.color || INK); doc.splitTextToSize(String(t), o.width || Wt).forEach(function (ln) { ensure(lh); doc.text(ln, o.x || L, y); y += lh; }); y += o.after == null ? 2 : o.after; }
    function label(t, col) { ensure(10); text(t.toUpperCase(), { size: 8, bold: true, color: col || ACC, after: 1 }); }
    function rule() { ensure(6); doc.setDrawColor(221, 216, 205); doc.line(L, y, L + Wt, y); y += 6; }
    function chart(svg, w, hmm) {
      var holder = document.createElement('div'); holder.style.cssText = 'position:absolute;left:-9999px;top:0;width:640px'; holder.innerHTML = svg; document.body.appendChild(holder);
      var el = holder.querySelector('svg'), vb = el.getAttribute('viewBox').split(' '); el.setAttribute('width', vb[2]); el.setAttribute('height', vb[3]);
      ensure(hmm + 4); var y0 = y; y += hmm + 4;
      return doc.svg(el, { x: L + (Wt - w) / 2, y: y0, width: w, height: hmm }).then(function () { holder.remove(); });
    }
    var d = delar(env), s = d.sense, e = d.see, sh = d.shift;
    text('Slutrapport', { size: 22, bold: true, after: 1 });
    text(C.verktyg + ' · ' + C.undertitel, { size: 9.5, color: MUT, after: 6 });
    text(env.organisation.namn || 'Er organisation', { size: 15, bold: true, after: 1 });
    text(B.rubrik + ': ' + B.lagen[b.lage].namn + ' · Lärandekurvan: ' + K.omdomen[k.omd].namn, { size: 10.5, bold: true, color: ACC, after: 4 });
    chart(kurvaSVG(k), 150, 59).then(function () {
      LCA.reportPDF({ sammanfattning: bl.sammanfattning, analys: bl.analys, forslag: bl.forslag }, text, label, L, Wt);
      rule(); label('Detaljer'); ensure(100); label(B.rubrik);
      return chart(beredskapSVG(b), 110, 76);
    }).then(function () {
      text(B.lagen[b.lage].namn + '. ' + B.lagen[b.lage].text + ' ' + b.grund, { size: 9.5 });
      text(B.om, { size: 8.5, italic: true, color: MUT, after: 4 });
      label(K.rubrik); k.krit.forEach(function (c) { text(K.status[c.v] + ': ' + c.namn + '. ' + c.text, { size: 9.5, after: 1 }); }); text(K.om, { size: 8.5, italic: true, color: MUT, after: 4 });
      rule(); label('Sense');
      text(s.fokusfraga || '', { bold: true, after: 1 });
      if (s.scenario && s.scenario.namn) text('Framtid som togs vidare: ' + s.scenario.namn + (s.scenario.text ? '. ' + s.scenario.text : ''), { size: 9.5 });
      s.kollisioner.forEach(function (x) { text('• ' + x.namn + (x.antagande ? '. Utmanar: ' + x.antagande : '') + ' (tryck ' + (x.tryck || '–') + ', ' + lc(x.tempo || '') + ')', { size: 9.5, after: 1 }); });
      tillampningar().forEach(function (t) {
        rule(); label(C.rapport.tillampningRubrik);
        text(t.namn + (t.objekt ? ': ' + t.objekt : ''), { bold: true, after: 1 });
        if (t.samlad) text(t.samlad + '. ' + (t.scenarier || []).map(function (x) { return x.namn + ': ' + lc(x.utveckling || '–'); }).join(' · '), { size: 9.5 });
        (t.robustaAtgarder || []).forEach(function (r) { text('• ' + r, { size: 9.5, after: 1 }); });
      });
      rule(); label('See');
      text('Lärandeindex ' + fmt(e.index) + ' av 4, ' + lc(e.omdome || '') + '. Profilen är ' + (e.form || '') + '.', { size: 9.5 });
      e.valda.forEach(function (v) { text('• ' + v.namn + ': svagast ' + (v.svagastAxel || []).map(function (a) { return a === 'jamn' ? 'jämn' : (AXK[a] || a); }).join(', ') + (v.beslut ? '. Beslut: ' + v.beslut : ''), { size: 9.5, after: 1 }); });
      rule(); label('Shift');
      (sh.riktning || []).forEach(function (r, i) { text((i + 1) + '. ' + r.fraga + ' (' + (AXN[r.axel] || '') + ' ' + fmt(r.fore) + ' till ' + fmt(r.efter) + ')', { size: 9.5, after: 1 }); });
      (sh.forsok || []).forEach(function (f) { text('• ' + f.titel + ': ' + (f.jamfort ? lc(f.jamfort) : 'inte avläst') + (f.beslut ? ', ' + (BES[f.beslut] || f.beslut) : '') + (f.nasta ? '. Nästa: ' + f.nasta : ''), { size: 9, after: 1 }); });
      rule(); label('Vetenskaplig grund', MUT); text(LCA.TEORI.text + ': ' + LCA.TEORI.url, { size: 8.5, color: MUT }); text(C.integritet, { size: 8, color: MUT });
      var n = doc.getNumberOfPages(), logo = document.querySelector('.footer img'); if (logo && !logo.complete) logo = null;
      for (var i = 1; i <= n; i++) { doc.setPage(i); doc.setFont('helvetica', 'normal'); doc.setFontSize(7.5); doc.setTextColor.apply(doc, MUT); doc.text(C.verktyg + ' · Slutrapport · ' + C.version + ' · ' + C.upphov, L, PH - 10); doc.text('Sida ' + i + ' av ' + n, L + Wt, PH - 10, { align: 'right' }); if (logo) { try { doc.addImage(logo, 'PNG', L + Wt - 24, PH - 13.6, 4.5, 4.5); } catch (er) {} } }
      doc.save('lca-slutrapport-' + LCA.slug(env.organisation.namn) + '-' + new Date().toISOString().slice(0, 10) + '.pdf');
    }).catch(function (err) { console.error(err); toast('Rapporten kunde inte skapas. Försök igen.'); });
  }

  document.getElementById('footer').innerHTML = '<span class="maker"><img src="../img/mickla.png" alt="Mickla" width="22" height="22">' + esc(C.upphov) + '</span><span>' + esc(C.verktyg) + ' · Slutsida · ' + esc(C.version) + '</span>';
  var ho = LCA.takeHandOff();
  if (ho && ho.modul === 'shift') { LCA.clearHandOff(); use(ho); }
  else { var st = get(KEY); if (st && !saknade(st).length) { env = st; render(); } else render(); }
  window.__slut = { env: function () { return env; }, use: use };
})();
