/* The Learning Curve Approach: landningssidan. Statisk sida, all data stannar i webbläsaren. © Engströms Mickla AB 2026 */
(function () {
  'use strict';
  var C = window.CONTENT, app = document.getElementById('app');
  var ORDNING = ['sense', 'see', 'shift'];
  var opened = null;

  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function fill(t, map) { return t.replace(/\{(\w+)\}/g, function (m, k) { return map[k] != null ? map[k] : m; }); }
  function toast(msg) { var t = document.createElement('div'); t.className = 'toast'; t.textContent = msg; document.body.appendChild(t); setTimeout(function () { t.remove(); }, 3200); }
  function lista(a) { return a.length > 1 ? a.slice(0, -1).join(', ') + ' och ' + a[a.length - 1] : a[0]; }

  /* Påbörjad körning i den här webbläsaren, om någon. */
  function pagaende(id) {
    var s = LCA.stored(id); if (!s) return null;
    if (id === 'see') { if (!s.nivaer || !Object.keys(s.nivaer).length) return null; return (s.meta && s.meta.foretag) || 'namnlös organisation'; }
    return (s.organisation && s.organisation.namn) || (s.meta && s.meta.foretag) || 'namnlös organisation';
  }

  function phasesHTML() {
    return '<h2 class="section">' + esc(C.faserRubrik) + '</h2><ol class="phases">' + C.faser.map(function (f) {
      return '<li class="phase"><span class="phase-nr">' + esc(f.nr) + '</span><span class="phase-name">' + esc(f.namn) + '</span><span class="phase-q">' + esc(f.fraga) + '</span><span class="phase-meta">' + esc(f.niva) + '</span><span class="phase-move">' + esc(f.rorelse) + '</span></li>';
    }).join('') + '</ol>';
  }

  function moduleHTML(id, i) {
    var m = C.moduler[id], open = m.status === 'oppen', pg = open ? pagaende(id) : null;
    return '<article class="card modcard' + (open ? '' : ' soon') + '"><div class="modhead"><span class="modnr">' + (i + 1) + '</span><div><h3>' + esc(m.rubrik) + '</h3><p class="muted small">' + esc(m.underrubrik) + '</p></div></div>' +
      '<p>' + esc(m.text) + '</p><dl class="modfacts"><div><dt>Ni får</dt><dd>' + esc(m.far) + '</dd></div><div><dt>Tid</dt><dd>' + esc(m.tid) + '</dd></div></dl>' +
      (pg ? '<p class="small note" style="margin:0 0 14px">' + esc(C.pagaende) + ': <b>' + esc(pg) + '</b>.</p>' : '') +
      (open ? '<a class="btn" href="' + esc(m.lank) + '">' + esc(C.statusText.oppen) + ' ' + esc(id === 'see' ? 'See' : LCA.NAMN[id]) + ' →</a>' : '<span class="tag soon-tag">' + esc(C.statusText.kommer) + '</span>') +
      '</article>';
  }

  function openedHTML() {
    if (!opened) return '';
    var S = C.sparfil, env = opened, till = env.modul === 'tillampning', namn = LCA.NAMN[env.modul];
    var kedja = ORDNING.filter(function (k) { return k !== env.modul && env.kedja && env.kedja[k]; }).map(function (k) { return LCA.NAMN[k]; });
    if (env.kedja && env.kedja.tillampningar) Object.keys(env.kedja.tillampningar).forEach(function (k) { kedja.push(env.kedja.tillampningar[k].namn || LCA.NAMN.tillampning); });
    var nasta = till ? 'see' : ORDNING[ORDNING.indexOf(env.modul) + 1];
    var h = '<div class="card opened"><div class="eyebrow">' + esc(fill(S.fran, { modul: namn })) + '</div><h3 style="margin-top:0">' + esc(env.organisation.namn || 'Namnlös organisation') + '</h3>' +
      '<p class="small muted">Senast ändrad ' + esc((env.andrad || '').slice(0, 10) || 'okänt datum') + (env.version ? ' · ' + esc(env.version) : '') + '</p>';
    if (kedja.length) h += '<p class="small">' + esc(fill(S.innehaller, { lista: lista(kedja) })) + '</p>';
    if (env.aldreFormat) h += '<p class="small muted">' + esc(S.aldre) + '</p>';
    h += '<div class="actions" style="margin-top:12px">';
    if (till) h += '<button class="btn ghost" data-act="go" data-mod="tillampning">' + esc(fill(S.fortsatt, { modul: (env.lamnar && env.lamnar.namn) || namn })) + '</button>';
    else if (C.moduler[env.modul].status === 'oppen') h += '<button class="btn ghost" data-act="go" data-mod="' + env.modul + '">' + esc(fill(S.fortsatt, { modul: namn })) + '</button>';
    if (nasta) {
      if (C.moduler[nasta].status === 'oppen') h += '<button class="btn" data-act="go" data-mod="' + nasta + '">' + esc(fill(S.vidare, { modul: LCA.NAMN[nasta] })) + ' →</button>';
      else h += '<p class="small muted" style="margin:0">' + esc(fill(S.vantar, { modul: LCA.NAMN[nasta] })) + '</p>';
    } else if (env.kedja && env.kedja.sense && env.kedja.see) h += '<button class="btn" data-act="go" data-mod="slut">' + esc(C.ordning.slutKnapp) + ' →</button>';
    return h + '</div></div>';
  }


  /* Lärandekurvan i landningssidans scen: tre faser längs en S-kurva, dragen som ett penseldrag likt ormen i Micklas logotyp. */
  function curveSVG() {
    var P = [[80.0, 293.4], [280.0, 175.0], [480.0, 56.6]], anc = ['start', 'start', 'end'], dx = [18, 20, -20];
    var h = '<svg class="curve" viewBox="0 0 560 340" aria-hidden="true"><line x1="30" y1="318" x2="530" y2="318" stroke="#5a5a5a" stroke-width="1"/><line x1="30" y1="318" x2="30" y2="20" stroke="#5a5a5a" stroke-width="1"/>' +
      '<text class="q" x="530" y="334" text-anchor="end">tid</text><text class="q" x="40" y="30">lärande</text>' +
      '<path d="M30.0,296.5 L36.2,296.2 L42.5,295.8 L48.8,295.3 L55.0,294.8 L61.2,294.2 L67.5,293.5 L73.8,292.8 L80.0,291.9 L86.2,291.0 L92.5,289.9 L98.8,288.8 L105.0,287.5 L111.2,286.1 L117.5,284.6 L123.8,282.9 L130.0,281.1 L136.2,279.1 L142.5,276.9 L148.8,274.6 L155.0,272.0 L161.2,269.2 L167.5,266.2 L173.8,263.0 L180.0,259.5 L186.2,255.7 L192.5,251.7 L198.8,247.4 L205.0,242.8 L211.2,237.9 L217.5,232.7 L223.8,227.3 L230.0,221.6 L236.2,215.6 L242.5,209.4 L248.8,203.0 L255.0,196.4 L261.2,189.7 L267.5,182.9 L273.8,176.0 L280.0,169.0 L286.2,162.1 L292.5,155.3 L298.8,148.6 L305.0,142.0 L311.2,135.6 L317.5,129.4 L323.8,123.4 L330.0,117.8 L336.2,112.3 L342.5,107.2 L348.8,102.4 L355.0,97.9 L361.2,93.7 L367.5,89.8 L373.8,86.2 L380.0,82.9 L386.2,79.8 L392.5,77.0 L398.8,74.5 L405.0,72.1 L411.2,70.0 L417.5,68.0 L423.8,66.3 L430.0,64.7 L436.2,63.2 L442.5,61.8 L448.8,60.6 L455.0,59.5 L461.2,58.5 L467.5,57.5 L473.8,56.7 L480.0,55.9 L486.2,55.2 L492.5,54.6 L498.8,54.0 L505.0,53.5 L511.2,53.1 L517.5,52.7 L523.8,52.3 L530.0,52.0 L530.0,53.5 L523.8,53.8 L517.5,54.2 L511.2,54.6 L505.0,55.0 L498.8,55.5 L492.5,56.1 L486.2,56.7 L480.0,57.4 L473.8,58.2 L467.5,59.0 L461.2,60.0 L455.0,61.1 L448.8,62.3 L442.5,63.6 L436.2,65.1 L430.0,66.8 L423.8,68.7 L417.5,70.8 L411.2,73.1 L405.0,75.6 L398.8,78.3 L392.5,81.3 L386.2,84.5 L380.0,88.0 L373.8,91.8 L367.5,95.9 L361.2,100.3 L355.0,105.0 L348.8,110.0 L342.5,115.3 L336.2,120.9 L330.0,126.8 L323.8,132.9 L317.5,139.3 L311.2,145.9 L305.0,152.7 L298.8,159.6 L292.5,166.7 L286.2,173.8 L280.0,181.0 L273.8,188.1 L267.5,195.1 L261.2,202.1 L255.0,208.9 L248.8,215.5 L242.5,221.9 L236.2,228.0 L230.0,233.9 L223.8,239.5 L217.5,244.7 L211.2,249.7 L205.0,254.3 L198.8,258.6 L192.5,262.6 L186.2,266.2 L180.0,269.6 L173.8,272.7 L167.5,275.5 L161.2,278.0 L155.0,280.3 L148.8,282.4 L142.5,284.2 L136.2,285.9 L130.0,287.4 L123.8,288.7 L117.5,289.9 L111.2,291.0 L105.0,291.9 L98.8,292.8 L92.5,293.5 L86.2,294.2 L80.0,294.8 L73.8,295.3 L67.5,295.8 L61.2,296.2 L55.0,296.6 L48.8,297.0 L42.5,297.4 L36.2,297.7 L30.0,298.0Z" fill="#ffffff"/>';
    C.faser.forEach(function (f, i) {
      var p = P[i], x = p[0] + dx[i], y = p[1] + (i === 2 ? 30 : 22);
      h += '<circle cx="' + p[0] + '" cy="' + p[1] + '" r="' + (i === 1 ? 9 : 7) + '" fill="' + ['#d1431d', '#ffffff', '#6e96ff'][i] + '" stroke="#1f1f1f" stroke-width="3"/>' +
        '<text x="' + x + '" y="' + y + '" text-anchor="' + anc[i] + '">0' + esc(f.nr) + ' ' + esc(f.namn).toUpperCase() + '</text>' +
        '<text class="q" x="' + x + '" y="' + (y + 17) + '" text-anchor="' + anc[i] + '">' + esc(f.rorelse) + '</text>';
    });
    return h + '</svg>';
  }

  function filmHTML() {
    var Fm = C.film; if (!Fm) return '';
    return '<div class="film"><video controls preload="metadata" playsinline poster="' + esc(Fm.affisch) + '" aria-label="' + esc(Fm.rubrik) + '"><source src="' + esc(Fm.fil) + '" type="video/mp4">' + (Fm.webm ? '<source src="' + esc(Fm.webm) + '" type="video/webm">' : '') + '</video><p class="small muted" style="margin:8px 0 0">' + esc(Fm.text) + ' <a href="' + esc(Fm.fil) + '" download="Learning-Curve-Approach-introduktion.mp4">' + esc(Fm.ladda) + '</a></p></div>';
  }

  function render() {
    var P = C.perspektiv, O = C.ordning, S = C.sparfil;
    var h = '<section class="hero">' + curveSVG() + '<div class="eyebrow">' + esc(C.eyebrow) + '</div><h1>' + esc(C.titel) + '</h1><p class="lead">' + esc(C.lead) + '</p>' + (C.fritt ? '<p class="fritt">' + [].concat(C.fritt).map(function (t) { return '<span>' + esc(t) + '</span>'; }).join(' ') + '</p>' : '') + C.intro.map(function (t, i) { return '<p>' + esc(t) + '</p>' + (i === 0 ? filmHTML() : ''); }).join('') + '</section>';
    h += phasesHTML();
    h += '<section><h2 class="section">' + esc(P.rubrik) + '</h2>' + P.text.map(function (t) { return '<p>' + esc(t) + '</p>'; }).join('') +
      '<blockquote class="quote"><p>' + esc(P.citat) + '</p><cite>' + esc(P.kalla) + '</cite></blockquote></section>';
    h += '<section><h2 class="section">' + esc(C.modulerRubrik) + '</h2><div class="modgrid">' + ORDNING.map(moduleHTML).join('') + '</div></section>';
    var T = C.tillampningar;
    if (T) h += '<section class="tillampningar"><h2 class="section">' + esc(T.rubrik) + '</h2><p>' + esc(T.text) + '</p><div class="modgrid tillgrid">' + T.lista.map(function (t) { return '<article class="card modcard"><h3 style="margin-top:0">' + esc(t.namn) + '</h3><p class="small">' + esc(t.text) + '</p><a class="btn ghost" href="' + esc(t.lank) + '">Öppna →</a></article>'; }).join('') + '</div><p style="margin-top:14px"><a href="tillampningar/">' + esc(T.knapp) + ' →</a></p></section>';
    h += '<section class="split"><div><h2 class="section">' + esc(O.rubrik) + '</h2><p>' + esc(O.text) + '</p><p>' + esc(O.slut) + '</p><p><a class="btn ghost" href="slut/">' + esc(O.slutKnapp) + ' →</a></p></div>' +
      '<div class="card"><h3 style="margin-top:0">' + esc(S.rubrik) + '</h3><p class="small muted">' + esc(S.text) + '</p><button class="btn ghost" data-act="open">' + esc(S.knapp) + '</button></div></section>';
    h += openedHTML();
    h += '<section><h2 class="section">' + esc(C.teoriRubrik) + '</h2><p>' + esc(C.teoriText) + '</p><a class="btn ghost" href="teori/">' + esc(C.teoriKnapp) + ' →</a></section>';
    h += '<p class="note small">' + esc(C.integritet) + '</p>';
    app.innerHTML = h;
  }

  app.addEventListener('click', function (e) {
    var t = e.target.closest('button'); if (!t) return;
    var act = t.getAttribute('data-act');
    if (act === 'open') { document.getElementById('file-load').click(); return; }
    if (act === 'go' && opened) { var mod = t.getAttribute('data-mod'); LCA.handOff(opened); window.location.href = mod === 'slut' ? 'slut/' : mod === 'tillampning' ? 'tillampningar/?fall=' + encodeURIComponent((opened.data && opened.data.fall) || '') : C.moduler[mod].lank; }
  });
  document.getElementById('file-load').addEventListener('change', function (e) {
    var f = e.target.files[0]; e.target.value = ''; if (!f) return;
    LCA.readFile(f, function (env, err) {
      if (err) { toast(err); return; }
      opened = env; render();
      var el = app.querySelector('.opened'); if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
  });

  document.getElementById('footer').innerHTML = '<span class="maker"><img src="img/mickla.png" alt="Mickla" width="22" height="22">' + esc(C.upphov) + '</span><span>' + esc(C.titel) + ' · ' + esc(C.version) + '</span>';
  render();
})();
