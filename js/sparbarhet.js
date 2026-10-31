/* Sidan Spårbarhet. Bygger reglerna, alla texter och litteraturen direkt ur innehållsfilerna. Ingen data lämnar webbläsaren. © Engströms Mickla AB 2026 */
(function () {
  'use strict';
  var I = window.INFO, S = window.SPAR, K = window.__INNEHALL || {}, app = document.getElementById('app');
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  var version = I.version;

  /* ---------- texter ur innehållsfilerna ---------- */
  var BAND = ['steg 1 (nivå 0 till 0,5)', 'steg 2 (nivå 1 till 1,5)', 'steg 3 (nivå 2 till 2,5)', 'steg 4 (nivå 3 till 4)'];
  var BESLUT = ['Ja', 'Fortsätt', 'Utred', 'Vänta', 'Nej'];
  var MODUL = { see: 'See', sense: 'Sense', shift: 'Shift', slut: 'Slutsidan', till: 'Tillämpningar', start: 'Startsidan', info: 'Om metoden' };
  /* [mönster för sökväg, del, visas när, källa eller grund] */
  var MAP = [
    [/\.skedeIntro/, 'Om skedet', 'Introduktion under stegets rubrik, öppnas av användaren', ''],
    [/^shift\.spel\.(handelser|kort|axlar)/, 'Spelets händelser, kort och axlar', 'Förmågefällan, varje vecka (SHI-8, SHI-9)', 'Repenning & Sterman 2002; Michie m.fl. 2011'],
    [/^shift\.spel\.vidSidan/, 'Vid sidan av', 'Förmågefällan, varje vecka (SHI-9)', 'Augsdorfer 2005; Criscuolo, Salter & Ter Wal 2014; Mainemelis 2010'],
    [/^shift\.spel\.(monster|avslojande|hypotes)/, 'Spelets mönster och hypotes', 'Förmågefällan efter vecka 8 (SHI-10, SHI-11)', 'Repenning & Sterman 2001; 2002'],
    [/^shift\.spel\.samtal/, 'Eftersamtal', 'Förmågefällan efter vecka 8 (SHI-11)', 'Crookall 2010'],
    [/^shift\.spel/, 'Förmågefällan', 'Steg 0 i Shift (SHI-8 till SHI-11)', 'Repenning & Sterman 2001; 2002; Sterman 1989'],
    [/^see\.boost\.svagastAxel/, 'Svagaste axel', 'Diagnos per vald förmåga (SEE-7)', 'Michie m.fl. 2011'],
    [/^see\.boost\.glapp/, 'Mandatglapp', 'Diagnos (SEE-8)', 'Kanter 1977; Spreitzer 1995'],
    [/^see\.boost\.tilltroGlapp/, 'Tilltroglapp', 'Diagnos (SEE-9)', 'Weiner 2009'],
    [/^see\.boost\.beslut/, 'Beslut', 'Beslut per förmåga (SEE-10, SEE-11)', ''],
    [/^see\.boost\.sammanfattning/, 'Rapportens sammanfattning', 'Rapport (SEE-12, SEE-13)', ''],
    [/^see\.boost\.(styrka|form|indexnot|valtext)/, 'Profil och styrka', 'Profil (SEE-3, SEE-5)', ''],
    [/^see\.boost\.pastaenden/, 'Agency-påståenden', 'Agency-steget (SEE-6)', 'Kanter 1977; Spreitzer 1995; Michie m.fl. 2011'],
    [/^see\.boost\.kvadranter/, 'Fyra fält', 'Vid skattningen', ''],
    [/^see\./, 'Övrigt', 'Hjälptext i See', ''],
    [/^sense\.bedomning/, 'Trendklasser', 'Skede 2 (SEN-3)', 'Wack 1985; Burt & Wright 2006'],
    [/^sense\.matris/, 'Påverkansmatris', 'Skede 3 (SEN-5)', 'Vester 2007; Godet 1994'],
    [/^sense\.axlar/, 'Axlar', 'Skede 4 (SEN-6, SEN-7)', 'Wright, Bradfield & Cairns 2013'],
    [/^sense\.rapport/, 'Rapport', 'Rapport (SEN-9, SEN-11, SEN-13)', ''],
    [/^sense\.karta/, 'Collision Map', 'Skede 8 (SEN-10, SEN-11)', 'Dewar 2002'],
    [/^sense\.omraden/, 'Exempel på signal och trend', 'Skede 1, läggs in eller föreslås (SEN-2)', 'Exempel på omvärldens förändring'],
    [/^sense\.utmaningar/, 'Utmaningar', 'Skede 0 (SEN-1, SEN-2)', ''],
    [/^sense\.varden/, 'Bärande delar', 'Skede 5 (SEN-8)', 'Osterwalder & Pigneur 2010; Dewar 2002'],
    [/^sense\.vind/, 'Vindtunnel', 'Skede 6 (SEN-8)', 'van der Heijden 2005'],
    [/^sense\./, 'Övrigt', 'Hjälptext i Sense', ''],
    [/^shift\.forsok\.typer/, 'Försökstyper', 'Trimförsök (SHI-3)', 'Michie m.fl. 2011'],
    [/^shift\.riktning/, 'Learning Direction Canvas', 'Riktning (SHI-2)', 'Gioia & Chittipeddi 1991'],
    [/^shift\.rapport/, 'Rapport', 'Rapport (SHI-7)', ''],
    [/^shift\.avlasning/, 'Kursavläsning', 'Kursavläsning (SHI-5, SHI-6)', 'Zollo & Winter 2002'],
    [/^shift\.forsok/, 'Trimförsök', 'Trimförsök (SHI-4)', 'Gollwitzer & Sheeran 2006; Reed & Card 2016'],
    [/^shift\.(ram|period)/, 'Ram och lärperiod', 'Riktning och lärperiodens slut', 'Edmondson 1999; Argyris & Schön 1978'],
    [/^shift\./, 'Övrigt', 'Hjälptext i Shift', ''],
    [/^slut\.beredskap/, 'Framtidsberedskap', 'Slutsidan (SLU-2 till SLU-4)', 'Rohrbeck & Kum 2018'],
    [/^slut\.kurva/, 'Lärandekurvan', 'Slutsidan (SLU-5)', 'Pisano m.fl. 2001; Zollo & Winter 2002'],
    [/^slut\./, 'Slutrapport', 'Slutsidan (SLU-6)', ''],
    [/^till\.fall\[\d+\]\.(rapport|nulage|syntes)/, 'Syntes och rapport', 'Tillämpning (TIL-1, TIL-2)', ''],
    [/^till\.fall\[\d+\]\.faktorer/, 'Faktorer', 'Tillämpning, faktorer', 'Se Teoriplattformen'],
    [/^till\./, 'Övrigt', 'Tillämpning', ''],
    [/^start\.perspektiv/, 'Perspektiv', 'Startsidan', 'Fred & Mukhtar-Landgren 2022'],
    [/^start\./, 'Startsidan', 'Startsidan', ''],
    [/^info\.om\./, 'Om metoden', 'Om metoden', '']
  ];
  var SKIP = /^see\.matchup\.(formagor|omdome)|^info\.(teori|begrepp)|\.(version|upphov|verktyg|titel|fredLank|fil|webm|affisch|lank|id|begrepp)$|integritet/;
  function walk(o, p, acc) {
    if (typeof o === 'string') acc.push([p, o]);
    else if (Array.isArray(o)) o.forEach(function (x, i) { walk(x, p + '[' + i + ']', acc); });
    else if (o && typeof o === 'object') Object.keys(o).forEach(function (k) { walk(o[k], p + '.' + k, acc); });
  }
  function texter() {
    var rows = [], FK = S.formagaKallor || {}, SKALA = 'Becker m.fl. 2009; Pöppelbuß & Röglinger 2011 (steg)';
    var see = K.see;
    if (see && see.matchup) {
      see.matchup.formagor.forEach(function (c) {
        var p = 'see.matchup.formagor[' + c.id + ']', SEEK = (FK[c.id] ? FK[c.id] + '; ' : '') + SKALA;
        rows.push(['See', c.namn, 'Förklaring vid skattning', c.vad + '. ' + (c.syfte || ''), SEEK, p + '.vad']);
        c.nivaer.forEach(function (n, i) { rows.push(['See', c.namn, 'Skalsteg ' + i + ' vid skattning (' + n.namn + ')', n.text, SEEK, p + '.nivaer[' + i + ']']); });
        for (var b = 0; b < 4; b++) {
          rows.push(['See', c.namn, 'Internt, ' + BAND[b], c.intern[b], SEEK, p + '.intern[' + b + ']']);
          rows.push(['See', c.namn, 'Ta hjälp med att, ' + BAND[b], c.extern[b], SEEK, p + '.extern[' + b + ']']);
        }
        BESLUT.forEach(function (bs) { for (var b = 0; b < 4; b++) rows.push(['See', c.namn, 'Beslut ' + bs + ', ' + BAND[b], c.atgard[bs][b], SEEK, p + '.atgard.' + bs + '[' + b + ']']); });
      });
      see.matchup.omdome.forEach(function (o, i) { rows.push(['See', 'Omdöme', 'Lärandeindex i ' + BAND[i] + ' (SEE-2)', o.namn + '. ' + o.text, 'Dawes 1979; OECD & JRC 2008; Pöppelbuß & Röglinger 2011', 'see.matchup.omdome[' + i + ']']); });
    }
    ['see', 'sense', 'shift', 'slut', 'till', 'start', 'info'].forEach(function (m) {
      if (!K[m]) return;
      var acc = []; walk(K[m], m, acc);
      acc.forEach(function (x) {
        var p = x[0], t = x[1];
        if (SKIP.test(p) || t.trim().length < 30) return;
        var hit = MAP.filter(function (r) { return r[0].test(p); })[0] || [null, 'Hjälptext', 'Hjälptext', ''];
        var modul = MODUL[m], mm = /^till\.fall\[(\d+)\]/.exec(p);
        if (mm && K.till.fall[+mm[1]]) modul = 'Tillämpning: ' + K.till.fall[+mm[1]].namn;
        rows.push([modul, hit[1], hit[2], t, hit[3], p]);
      });
    });
    return rows;
  }

  /* ---------- litteratur ---------- */
  function litteratur() {
    var A = S.anvandning || {}, keys = Object.keys(A);
    return I.teori.kallor.map(function (ref) {
      var k = keys.filter(function (x) { return ref.indexOf(x) === 0; }).sort(function (a, b) { return b.length - a.length; })[0];
      return [ref, k ? A[k] : '', 'https://scholar.google.com/scholar?q=' + encodeURIComponent(ref.slice(0, 220))];
    });
  }

  /* ---------- CSV ---------- */
  function csv(head, rows) {
    function q(v) { return '"' + String(v == null ? '' : v).replace(/"/g, '""') + '"'; }
    return '﻿' + [head].concat(rows).map(function (r) { return r.map(q).join(';'); }).join('\r\n');
  }
  function ladda(namn, text) {
    var a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([text], { type: 'text/csv;charset=utf-8' }));
    a.download = namn; document.body.appendChild(a); a.click(); setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 500);
  }
  var vfil = version.replace(/[^a-z0-9.]+/gi, '-');

  var TX = texter(), LIT = litteratur();
  var DL = {
    regler: function () { return ['lca-regler-' + vfil + '.csv', csv(['ID', 'Modul', 'Steg', 'Regel', 'Parametrar', 'Grund', 'Typ av grund', 'Var i koden'], S.regler.map(function (r) { return [r.id, r.modul, r.steg, r.regel, r.param, r.grund, r.typ, r.kod]; }))]; },
    texter: function () { return ['lca-texter-' + vfil + '.csv', csv(['Modul', 'Del', 'Visas när', 'Text', 'Källa eller grund', 'Sökväg i innehållsfilen'], TX)]; },
    litteratur: function () { return ['lca-litteratur-' + vfil + '.csv', csv(['Referens', 'Vad den bär i verktygen', 'Sök källan'], LIT)]; }
  };

  function kodLank(k) { var f = String(k).split(':')[0].trim(); return /\.js$/.test(f) ? '<a href="' + esc(S.kodbas + f) + '" target="_blank" rel="noopener">' + esc(k) + '</a>' : esc(k); }
  function laddKnapp(id, n) { return '<button class="btn ghost" data-ladda="' + id + '">Ladda ner som CSV' + (n ? ' (' + n + ' rader)' : '') + '</button>'; }

  function render() {
    var moduler = []; TX.forEach(function (r) { if (moduler.indexOf(r[0]) < 0) moduler.push(r[0]); });
    var h = '<div class="eyebrow">' + esc(I.verktyg) + ' · <a href="../om/">' + esc(I.lankOm) + '</a></div><h1>' + esc(S.rubrik) + '</h1><p class="lead">' + esc(S.ingress) + '</p>';
    h += '<div class="card spar-om"><p style="margin:0 0 6px"><b>' + esc(S.upphov) + '</b></p><p style="margin:0">' + esc(S.granskning) + '</p><p class="small muted" style="margin:8px 0 0">Version: ' + esc(version) + '. Texterna och reglerna nedan gäller den versionen.</p></div>';
    h += '<nav class="toc card tight"><b>Innehåll</b><ol><li><a href="#regler">Regler: från input till rekommendation</a></li><li><a href="#texter">Alla texter som verktygen kan visa</a></li><li><a href="#litteratur">Litteratur och vad den bär</a></li><li><a href="#logg">Ändringslogg</a></li></ol></nav>';

    h += '<h2 class="section" id="regler">Regler: från input till rekommendation</h2><p>Varje regel avgör vilken text eller vilket förslag som visas för en viss input. Gruppen kan alltid ändra verktygets förslag. Typ av grund:</p><ul class="small">' +
      Object.keys(S.typer).map(function (k) { return '<li><b>' + esc(k) + '.</b> ' + esc(S.typer[k]) + '</li>'; }).join('') + '</ul><p>' + laddKnapp('regler', S.regler.length) + '</p>';
    var mods = []; S.regler.forEach(function (r) { if (mods.indexOf(r.modul) < 0) mods.push(r.modul); });
    mods.forEach(function (m) {
      h += '<h3>' + esc(m) + '</h3><div class="spar-regler">' + S.regler.filter(function (r) { return r.modul === m; }).map(function (r) {
        return '<div class="card tight spar-regel" id="' + esc(r.id) + '"><div class="eyebrow">' + esc(r.id) + ' · ' + esc(r.steg) + ' · <span class="tag plain">' + esc(r.typ) + '</span></div><p style="margin:6px 0">' + esc(r.regel) + '</p>' +
          (r.param ? '<p class="small" style="margin:0 0 4px"><b>Parametrar:</b> ' + esc(r.param) + '</p>' : '') + (r.grund ? '<p class="small" style="margin:0 0 4px"><b>Grund:</b> ' + esc(r.grund) + '</p>' : '') +
          '<p class="small muted" style="margin:0">Var i koden: ' + kodLank(r.kod) + '</p></div>';
      }).join('') + '</div>';
    });

    h += '<h2 class="section" id="texter">Alla texter som verktygen kan visa</h2><p>Texterna är hämtade direkt ur innehållsfilerna. Kolumnen Visas när anger i vilket läge texten visas, med hänvisning till regeln. Korta knapp- och fältetiketter är inte med.</p>' +
      '<div class="spar-filter"><label class="field"><span>Modul</span><select id="fmodul"><option value="">Alla</option>' + moduler.map(function (m) { return '<option>' + esc(m) + '</option>'; }).join('') + '</select></label>' +
      '<label class="field"><span>Sök</span><input type="text" id="fsok" placeholder="Till exempel mandat eller Beslut Ja" autocomplete="off"></label></div>' +
      '<p class="small muted" id="fantal"></p><p>' + laddKnapp('texter', TX.length) + '</p><div class="tablewrap"><table class="facil spar-tab"><thead><tr><th>Modul</th><th>Del</th><th>Visas när</th><th>Text</th><th>Källa eller grund</th></tr></thead><tbody id="ftabell"></tbody></table></div>';

    h += '<h2 class="section" id="litteratur">Litteratur och vad den bär</h2><p>Hela litteraturlistan från <a href="../teori/">Teoriplattformen</a>, med vad varje källa används till i verktygen och en länk för att hitta den.</p><p>' + laddKnapp('litteratur', LIT.length) + '</p><ul class="refs lit spar-lit">' +
      LIT.map(function (r) { return '<li>' + esc(r[0]) + (r[1] ? '<br><span class="small" style="color:var(--accent)">Bär: ' + esc(r[1]) + '</span>' : '') + ' <a class="small" href="' + esc(r[2]) + '" target="_blank" rel="noopener">Sök källan</a></li>'; }).join('') + '</ul>';

    h += '<h2 class="section" id="logg">Ändringslogg</h2>' + S.logg.map(function (l) { return '<h3>' + esc(l.version) + ' <span class="muted small">' + esc(l.datum) + '</span></h3><ul>' + l.text.map(function (t) { return '<li>' + esc(t) + '</li>'; }).join('') + '</ul>'; }).join('');
    app.innerHTML = h;
    filtrera();
  }
  function filtrera() {
    var m = document.getElementById('fmodul').value, q = document.getElementById('fsok').value.trim().toLowerCase();
    var rows = TX.filter(function (r) { return (!m || r[0] === m) && (!q || (r.join(' ').toLowerCase().indexOf(q) >= 0)); });
    document.getElementById('ftabell').innerHTML = rows.map(function (r) { return '<tr><td>' + esc(r[0]) + '</td><td>' + esc(r[1]) + '</td><td>' + esc(r[2]) + '</td><td>' + esc(r[3]) + '</td><td class="small">' + esc(r[4]) + '</td></tr>'; }).join('');
    document.getElementById('fantal').textContent = rows.length + ' av ' + TX.length + ' texter.';
  }

  render();
  app.addEventListener('input', function (e) { if (e.target.id === 'fsok' || e.target.id === 'fmodul') filtrera(); });
  app.addEventListener('change', function (e) { if (e.target.id === 'fmodul') filtrera(); });
  app.addEventListener('click', function (e) { var b = e.target.closest('[data-ladda]'); if (!b) return; var x = DL[b.getAttribute('data-ladda')](); ladda(x[0], x[1]); });
  if (location.hash) { var el = document.getElementById(location.hash.slice(1)); if (el) el.scrollIntoView(); }
  document.getElementById('footer').innerHTML = '<span class="maker"><img src="../img/mickla.png" alt="Mickla" width="22" height="22">' + esc(I.upphov) + '</span><span>' + esc(I.verktyg) + ' · ' + esc(version) + '</span>';
})();
