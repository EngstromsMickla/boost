/* The Learning Curve Approach: gemensamt sparformat för alla moduler.
   All data stannar i webbläsaren. © Engströms Mickla AB 2026 */
(function () {
  'use strict';
  var FORMAT = 1;
  var MODULER = ['sense', 'see', 'shift', 'tillampning'];
  var NYCKLAR = { sense: 'lca.sense.v1', see: 'dialogverktyget.v1', shift: 'lca.shift.v1' };
  var OVERLAMNING = 'lca.overlamning';
  var NAMN = { sense: 'Sense', see: 'See', shift: 'Shift', tillampning: 'Utvalda tillämpningar' };

  function clone(x) { return x == null ? x : JSON.parse(JSON.stringify(x)); }

  /* Packar en körning i det gemensamma kuvertet. */
  function wrap(o) {
    return {
      lca: FORMAT,
      modul: o.modul,
      version: o.version || '',
      skapad: o.skapad || new Date().toISOString(),
      andrad: new Date().toISOString(),
      organisation: o.organisation || { namn: '', typ: '', deltagare: '' },
      data: clone(o.data) || {},
      lamnar: clone(o.lamnar) || {},
      kedja: clone(o.kedja) || {}
    };
  }

  /* Läser ett objekt ur en sparfil. Returnerar ett kuvert eller null.
     Gamla sparfiler från Dialogverktyget (utan kuvert) räknas som See. */
  function unwrap(d) {
    if (!d || typeof d !== 'object') return null;
    if (d.lca && MODULER.indexOf(d.modul) >= 0) {
      d.kedja = d.kedja || {}; d.lamnar = d.lamnar || {}; d.data = d.data || {}; d.organisation = d.organisation || {};
      return d;
    }
    if (d.app === 'dialogverktyget' && d.nivaer) {
      var m = d.meta || {};
      return { lca: FORMAT, modul: 'see', version: d.version || '', skapad: d.skapad, andrad: d.andrad, aldreFormat: true,
        organisation: { namn: m.foretag || '', typ: m.typ || '', deltagare: m.namn || '' },
        data: d, lamnar: {}, kedja: d.kedja || {} };
    }
    return null;
  }

  /* Kedjan som nästa modul ska bära med sig: tidigare kedja plus denna moduls lamnar. */
  function chainFrom(env) {
    var k = clone(env.kedja) || {};
    if (!env.lamnar || !Object.keys(env.lamnar).length) return k;
    /* Utvalda tillämpningar samlas per fall, så att flera kan följa med i samma kedja. */
    if (env.modul === 'tillampning') { k.tillampningar = k.tillampningar || {}; k.tillampningar[env.lamnar.id || 'okand'] = clone(env.lamnar); }
    else k[env.modul] = clone(env.lamnar);
    return k;
  }

  function readFile(file, cb) {
    var r = new FileReader();
    r.onload = function () {
      var env = null;
      try { env = unwrap(JSON.parse(r.result)); } catch (e) { cb(null, 'Filen ' + file.name + ' kunde inte läsas.'); return; }
      if (!env) { cb(null, file.name + ' är inte en sparfil från The Learning Curve Approach.'); return; }
      cb(env);
    };
    r.readAsText(file);
  }

  function slug(s) { return (s || 'organisation').toLowerCase().replace(/[åä]/g, 'a').replace(/ö/g, 'o').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'organisation'; }
  function download(obj, name) {
    var a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([JSON.stringify(obj, null, 1)], { type: 'application/json' }));
    a.download = name; document.body.appendChild(a); a.click();
    setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 500);
  }
  function fileName(env) {
    var d = (env.andrad || new Date().toISOString()).slice(0, 10);
    return 'lca-' + env.modul + '-' + slug(env.organisation && env.organisation.namn) + '-' + d + '.json';
  }

  function get(key) { try { var s = localStorage.getItem(key); return s ? JSON.parse(s) : null; } catch (e) { return null; } }
  function set(key, v) { try { if (v == null) localStorage.removeItem(key); else localStorage.setItem(key, JSON.stringify(v)); } catch (e) {} }

  /* Överlämning mellan sidor på samma domän: landningssidan eller en modul lägger ett kuvert här,
     nästa modul erbjuder att använda det. */
  function handOff(env) { set(OVERLAMNING, env); }
  function takeHandOff() { var e = get(OVERLAMNING); return e ? unwrap(e) : null; }
  function clearHandOff() { set(OVERLAMNING, null); }

  /* Status för en modul i den här webbläsaren (för landningssidan). */
  function stored(modul) { return get(NYCKLAR[modul]); }

  /* Fast rapportmall för alla moduler: sammanfattning, analys och förslag före detaljerna. */
  var RUBRIK = { sammanfattning: 'Sammanfattning', analys: 'Analys', forslag: 'Förslag', detaljer: 'Detaljer' };
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function punkt(t) { t = String(t || ''); return /[.?!:]$/.test(t) ? t : t + '.'; }
  function reportBlock(r) {
    var h = '<div class="card summary report-block"><div class="eyebrow">' + RUBRIK.sammanfattning + '</div>' + (r.sammanfattning || []).map(function (p) { return '<p>' + esc(p) + '</p>'; }).join('') + (r.extraSammanfattning || '');
    if (r.analys && r.analys.length) h += '<h3>' + RUBRIK.analys + '</h3><ul class="analys">' + r.analys.map(function (a) { return '<li>' + (typeof a === 'string' ? esc(a) : '<b>' + esc(punkt(a.titel)) + '</b> ' + esc(a.text)) + '</li>'; }).join('') + '</ul>' + (r.analysNot ? '<p class="small muted">' + esc(r.analysNot) + '</p>' : '');
    if (r.forslag && r.forslag.length) h += '<h3>' + RUBRIK.forslag + '</h3><ol class="recs">' + r.forslag.map(function (f) { return '<li><b>' + esc(punkt(f.titel)) + '</b> ' + esc(f.text) + '</li>'; }).join('') + '</ol>';
    return h + '</div><h2 class="details-head">' + RUBRIK.detaljer + '</h2>';
  }
  /* Samma mall i PDF. t(text, opt) och label(text) är modulens egna skrivfunktioner. */
  function reportPDF(r, t, label, L, Wt) {
    label(RUBRIK.sammanfattning); (r.sammanfattning || []).forEach(function (p) { t(p, { size: 10.5, after: 2.5 }); });
    if (r.extraPDF) r.extraPDF();
    if (r.analys && r.analys.length) { t(RUBRIK.analys, { size: 12, bold: true, after: 1.5 }); r.analys.forEach(function (a) { t('• ' + (typeof a === 'string' ? a : punkt(a.titel) + ' ' + a.text), { size: 10, x: L + 2, width: Wt - 2, after: 1.5 }); }); if (r.analysNot) t(r.analysNot, { size: 8.5, italic: true, after: 2 }); }
    if (r.forslag && r.forslag.length) { t(RUBRIK.forslag, { size: 12, bold: true, after: 1.5 }); r.forslag.forEach(function (f, i) { t((i + 1) + '. ' + punkt(f.titel), { size: 10, bold: true, after: 0.5 }); t(f.text, { size: 9.5, x: L + 4, width: Wt - 4, after: 2.5 }); }); }
  }


  /* Vägledning (v0.7): en i-symbol vid stegets rubrik öppnar en popup med Om skedet och beskrivningen av begreppet.
     Hovra på dator, tryck på telefon och med tangentbord. Texterna ligger i varje moduls innehållsfil under skedeIntro.
     Beskrivningar av begrepp (rutor med klassen about-note) flyttas in i samma popup, så att huvudvägen syns först. */
  var INTRO = {
    rubrik: 'Om steget',
    fragor: [['vad', 'Vad gör vi?'], ['varfor', 'Varför är det viktigt?'], ['hur', 'Hur gör vi det?'], ['vem', 'Vem gör det?'], ['leder', 'Vad leder det till?']],
    stang: 'Stäng',
    ikonEtikett: 'Om steget',
    tips: 'Nytt här? Hovra över eller tryck på i för att läsa vad ni gör i steget och varför.',
    startRubrik: 'Vägledning finns vid varje rubrik',
    startText: 'Hovra över eller tryck på symbolen vid rubriken. Där står vad ni gör i steget, varför det är viktigt, hur och vem som gör det, och vad det leder till. Där förklaras också begreppen. Sidan visar annars bara det ni ska göra.'
  };
  var INFO_SETT = 'lca.info.sett';
  function infoSett() { try { return localStorage.getItem(INFO_SETT) === '1'; } catch (e) { return false; } }
  function markSett() { try { localStorage.setItem(INFO_SETT, '1'); } catch (e) {} }
  var popNr = 0;
  function infoIntroHTML() {
    return '<div class="info-intro"><span class="info-i demo" aria-hidden="true">i</span><div><b>' + esc(INTRO.startRubrik) + '.</b> ' + esc(INTRO.startText) + '</div></div>';
  }
  function popBody(o, extra) {
    var h = '';
    if (o) h += '<div class="pop-eyebrow">' + esc(INTRO.rubrik) + ': ' + esc(o.namn) + '</div><dl>' + INTRO.fragor.filter(function (f) { return o[f[0]]; }).map(function (f) { return '<dt>' + esc(f[1]) + '</dt><dd>' + esc(o[f[0]]) + '</dd>'; }).join('') + '</dl>';
    if (extra) h += '<div class="pop-begrepp">' + extra + '</div>';
    return h;
  }
  /* Lägger i-symbolen vid stegets första rubrik och flyttar begreppsrutorna in i popupen. */
  function withIntro(html, o) {
    var extra = '';
    html = html.replace(/<div class="note about-note">([\s\S]*?)<\/div>/g, function (m, inner) { extra += '<p>' + inner + '</p>'; return ''; });
    if (!o && !extra) return html;
    var m = /<h([12])([^>]*)>([\s\S]*?)<\/h\1>/.exec(html);
    if (!m) return html;
    var id = 'pop-' + (++popNr), namn = o ? o.namn : INTRO.ikonEtikett;
    var btn = '<button type="button" class="info-i" data-info="' + id + '" aria-expanded="false" aria-controls="' + id + '" aria-label="' + esc(INTRO.ikonEtikett + ': ' + namn) + '" title="' + esc(INTRO.ikonEtikett) + '">i</button>';
    var tip = infoSett() ? '' : '<span class="info-tip">' + esc(INTRO.tips) + '</span>';
    var pop = '<div class="info-pop" id="' + id + '" role="dialog" aria-label="' + esc(INTRO.ikonEtikett + ': ' + namn) + '" hidden>' + popBody(o, extra) + '<button type="button" class="btn quiet small-btn" data-info-close>' + esc(INTRO.stang) + '</button></div>';
    var head = '<div class="head-row"><h' + m[1] + m[2] + '>' + m[3] + ' ' + btn + '</h' + m[1] + '>' + tip + pop + '</div>';
    return html.slice(0, m.index) + head + html.slice(m.index + m[0].length);
  }
  function skedeIntro(o) { return o ? '<div class="info-pop static">' + popBody(o) + '</div>' : ''; }
  var pinned = null;
  function popOf(b) { return document.getElementById(b.getAttribute('data-info')); }
  function openPop(b, pin) {
    var p = popOf(b); if (!p) return;
    closeAll(b); p.hidden = false; b.setAttribute('aria-expanded', 'true');
    if (pin) pinned = b;
    if (!infoSett()) { markSett(); var t = document.querySelector('.info-tip'); if (t) t.remove(); }
  }
  function closePop(b) { var p = popOf(b); if (p) p.hidden = true; b.setAttribute('aria-expanded', 'false'); if (pinned === b) pinned = null; }
  function closeAll(except) { var bs = document.querySelectorAll('.info-i[aria-expanded="true"]'); for (var i = 0; i < bs.length; i++) if (bs[i] !== except) closePop(bs[i]); }
  if (typeof document !== 'undefined') {
    var hover = window.matchMedia && window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    document.addEventListener('click', function (e) {
      var c = e.target.closest && e.target.closest('[data-info-close]');
      if (c) { var row = c.closest('.head-row'), b = row && row.querySelector('.info-i'); if (b) { closePop(b); b.focus(); } return; }
      var b2 = e.target.closest && e.target.closest('.info-i[data-info]');
      if (b2) { if (b2.getAttribute('aria-expanded') === 'true' && pinned === b2) closePop(b2); else openPop(b2, true); return; }
      if (!(e.target.closest && e.target.closest('.info-pop'))) closeAll();
    });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') { var b = document.querySelector('.info-i[aria-expanded="true"]'); if (b) { closePop(b); b.focus(); } } });
    if (hover) {
      document.addEventListener('mouseover', function (e) { var b = e.target.closest && e.target.closest('.info-i[data-info]'); if (b && b.getAttribute('aria-expanded') !== 'true') openPop(b, false); });
      document.addEventListener('mouseout', function (e) {
        var row = e.target.closest && e.target.closest('.head-row'); if (!row) return;
        if (e.relatedTarget && row.contains(e.relatedTarget)) return;
        var b = row.querySelector('.info-i'); if (b && pinned !== b && b.getAttribute('aria-expanded') === 'true') closePop(b);
      });
    }
  }

  /* Vägvisare: huvudvägen genom modulen, med frivilliga avstickare. items: [{namn, sido}], cur: index. */
  function route(items, cur, etikett) {
    var h = '<nav class="route" aria-label="' + esc(etikett || 'Var ni är') + '"><ol>';
    items.forEach(function (it, i) {
      var st = i === cur ? 'cur' : i < cur && !it.sido ? 'done' : '';
      h += '<li class="' + (it.sido ? 'side ' : '') + st + '"' + (i === cur ? ' aria-current="step"' : '') + '><span class="dot" aria-hidden="true"></span><span class="rn">' + esc(it.namn) + (it.sido ? '<em>frivilligt</em>' : '') + '</span></li>';
    });
    return h + '</ol></nav>';
  }
  /* Vägvisaren rullas så att aktuellt steg syns, också på telefon. */
  if (typeof document !== 'undefined' && window.MutationObserver) {
    var syncRoute = function () { var r = document.querySelector('.route'), c = r && r.querySelector('li.cur'); if (r && c && r.scrollWidth > r.clientWidth) r.scrollLeft = Math.max(0, c.offsetLeft - r.clientWidth / 3); };
    var startObs = function () { var a = document.getElementById('app'); if (a) new MutationObserver(syncRoute).observe(a, { childList: true }); };
    if (document.getElementById('app')) startObs(); else document.addEventListener('DOMContentLoaded', startObs);
    window.addEventListener('load', syncRoute);
  }
  /* Källetikett för underlag som kommer från ett tidigare steg eller en tidigare modul. */
  function kalla(t) { return '<span class="src">' + esc(t) + '</span>'; }

  var TEORI = { text: 'Metodens vetenskapliga grund och litteraturlistan finns i Teoriplattformen', url: 'https://boost.mickla.se/teori/' };
  function teoriHTML(rel) { return '<p class="small muted teori-ref">' + TEORI.text + ': <a href="' + (rel || '../') + 'teori/" target="_blank" rel="noopener">' + TEORI.url.replace('https://', '') + '</a></p>'; }
  window.LCA = { INTRO: INTRO, skedeIntro: skedeIntro, withIntro: withIntro, infoIntroHTML: infoIntroHTML, route: route, kalla: kalla, RUBRIK: RUBRIK, TEORI: TEORI, teoriHTML: teoriHTML, reportBlock: reportBlock, reportPDF: reportPDF, FORMAT: FORMAT, MODULER: MODULER, NYCKLAR: NYCKLAR, NAMN: NAMN, wrap: wrap, unwrap: unwrap, chainFrom: chainFrom,
    readFile: readFile, download: download, fileName: fileName, slug: slug, handOff: handOff, takeHandOff: takeHandOff, clearHandOff: clearHandOff, stored: stored };
})();
