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


  /* Om skedet: en kort introduktion som öppnas på plats och stängs igen, så att man är kvar där man var.
     Texterna ligger i varje moduls innehållsfil under skedeIntro. Öppet eller stängt minns per skede under besöket. */
  var INTRO = { rubrik: 'Om skedet', fragor: [['vad', 'Vad gör vi?'], ['varfor', 'Varför är det viktigt?'], ['hur', 'Hur gör vi det?'], ['vem', 'Vem gör det?'], ['leder', 'Vad leder det till?']], stang: 'Stäng och fortsätt' };
  var introOppen = {};
  function skedeIntro(o, key) {
    if (!o) return '';
    key = key || o.namn;
    return '<details class="skede-intro" data-intro="' + esc(key) + '"' + (introOppen[key] ? ' open' : '') + '><summary>' + esc(INTRO.rubrik) + ': ' + esc(o.namn) + '</summary><div class="si-body"><dl>' +
      INTRO.fragor.filter(function (f) { return o[f[0]]; }).map(function (f) { return '<dt>' + esc(f[1]) + '</dt><dd>' + esc(o[f[0]]) + '</dd>'; }).join('') +
      '</dl><button type="button" class="btn quiet small-btn" data-intro-close>' + esc(INTRO.stang) + '</button></div></details>';
  }
  /* Lägger introduktionen direkt under stegets rubrik. */
  function withIntro(html, o, key) {
    if (!o) return html;
    var box = skedeIntro(o, key), m = /<\/h[12]>/.exec(html);
    if (!m) return box + html;
    var end = m.index + m[0].length, after = html.slice(end), lead = /^\s*<p class="lead"[^>]*>[\s\S]*?<\/p>/.exec(after);
    if (lead) end += lead[0].length;
    return html.slice(0, end) + box + html.slice(end);
  }
  if (typeof document !== 'undefined') {
    document.addEventListener('toggle', function (e) { var d = e.target; if (d && d.classList && d.classList.contains('skede-intro')) introOppen[d.getAttribute('data-intro')] = d.open; }, true);
    document.addEventListener('click', function (e) {
      var b = e.target.closest && e.target.closest('[data-intro-close]'); if (!b) return;
      var d = b.closest('details'); if (!d) return;
      d.open = false; introOppen[d.getAttribute('data-intro')] = false;
      var s = d.querySelector('summary'), r = s.getBoundingClientRect();
      if (r.top < 0) s.scrollIntoView({ block: 'start' });
      s.focus({ preventScroll: true });
    });
  }

  var TEORI = { text: 'Metodens vetenskapliga grund och litteraturlistan finns i Teoriplattformen', url: 'https://boost.mickla.se/teori/' };
  function teoriHTML(rel) { return '<p class="small muted teori-ref">' + TEORI.text + ': <a href="' + (rel || '../') + 'teori/" target="_blank" rel="noopener">' + TEORI.url.replace('https://', '') + '</a></p>'; }
  window.LCA = { INTRO: INTRO, skedeIntro: skedeIntro, withIntro: withIntro, RUBRIK: RUBRIK, TEORI: TEORI, teoriHTML: teoriHTML, reportBlock: reportBlock, reportPDF: reportPDF, FORMAT: FORMAT, MODULER: MODULER, NYCKLAR: NYCKLAR, NAMN: NAMN, wrap: wrap, unwrap: unwrap, chainFrom: chainFrom,
    readFile: readFile, download: download, fileName: fileName, slug: slug, handOff: handOff, takeHandOff: takeHandOff, clearHandOff: clearHandOff, stored: stored };
})();
