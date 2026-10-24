/* Sidorna Begrepp och Om metoden. Statiska, all data stannar i webbläsaren. © Engströms Mickla AB 2026 */
(function () {
  'use strict';
  var I = window.INFO, app = document.getElementById('app'), sida = document.body.getAttribute('data-sida');
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function slug(s) { return String(s).toLowerCase().replace(/[åä]/g, 'a').replace(/ö/g, 'o').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''); }
  function begrepp() {
    var B = I.begrepp;
    var h = '<div class="eyebrow">' + esc(I.verktyg) + '</div><h1>' + esc(B.rubrik) + '</h1><p class="lead">' + esc(B.ingress) + '</p>' +
      '<p class="small"><a href="../teori/">' + esc(I.lankTeori) + ': den vetenskapliga grunden →</a></p><label class="field"><span>Sök</span><input type="text" id="sok" placeholder="Till exempel trim, kollision eller mandat" autocomplete="off"></label><dl class="glossary">';
    B.lista.slice().sort(function (a, b) { return a.term.localeCompare(b.term, 'sv'); }).forEach(function (t) {
      h += '<div class="gterm" id="' + slug(t.term) + '" data-q="' + esc((t.term + ' ' + t.text + ' ' + (t.fas || '')).toLowerCase()) + '"><dt>' + esc(t.term) + (t.fas ? ' <span class="tag plain">' + esc(t.fas) + '</span>' : '') + '</dt><dd>' + esc(t.text) + (t.kalla ? ' <span class="muted small">(' + esc(t.kalla) + ')</span>' : '') + '</dd></div>';
    });
    return h + '</dl><p class="muted small" id="ingen" hidden>Inget begrepp matchar sökningen.</p>';
  }
  function om() {
    var O = I.om, k = O.kontakt;
    var h = '<div class="eyebrow">' + esc(I.verktyg) + '</div><h1>' + esc(O.rubrik) + '</h1><p class="lead">' + esc(O.ingress) + '</p><p><a class="btn" href="../teori/">' + esc(I.lankTeori) + ' →</a></p>';
    O.avsnitt.forEach(function (a) { h += '<h2 class="section">' + esc(a.rubrik) + '</h2>' + a.text.map(function (t) { return '<p>' + esc(t) + '</p>'; }).join(''); });
    h += '<div class="card contact"><h3 style="margin-top:0">' + esc(O.kontaktRubrik) + '</h3><p style="margin:0">' + esc(k.namn) + '<br>E-post: <a href="mailto:' + esc(k.epost) + '">' + esc(k.epost) + '</a><br>Mobil: <a href="tel:' + esc(k.telefon.replace(/\s/g, '')) + '">' + esc(k.telefon) + '</a></p></div>';
    h += '<p><a class="btn ghost" href="../teori/">' + esc(I.lankTeori) + ': vetenskaplig grund och litteraturlista →</a></p>';
    h += '<p><a class="btn ghost" href="../sparbarhet/">' + esc(I.lankSpar) + ': regler, texter och källor att kontrollera →</a></p>';
    return h + '<p class="note small">' + esc(O.integritet) + '</p>';
  }
  function teori() {
    var T = I.teori, h = '<div class="eyebrow">' + esc(I.verktyg) + ' · <a href="../om/">' + esc(I.lankOm) + '</a></div><h1>' + esc(T.rubrik) + '</h1><p class="lead">' + esc(T.ingress) + '</p><p class="small"><a href="../sparbarhet/">' + esc(I.lankSpar) + ': så tas varje rekommendation fram, med regler, texter och källor →</a></p>';
    h += '<nav class="toc card tight"><b>Innehåll</b><ol>' + T.avsnitt.map(function (a) { return '<li><a href="#' + slug(a.rubrik) + '">' + esc(a.rubrik) + '</a></li>'; }).join('') + '<li><a href="#litteratur">' + esc(T.kallorRubrik) + '</a></li></ol></nav>';
    T.avsnitt.forEach(function (a) { h += '<h2 class="section" id="' + slug(a.rubrik) + '">' + esc(a.rubrik) + '</h2>' + a.text.map(function (t) { return '<p>' + esc(t) + '</p>'; }).join(''); });
    return h + '<h2 class="section" id="litteratur">' + esc(T.kallorRubrik) + '</h2><ul class="refs lit">' + T.kallor.map(function (x) { return '<li>' + esc(x) + '</li>'; }).join('') + '</ul>';
  }
  app.innerHTML = sida === 'om' ? om() : sida === 'teori' ? teori() : begrepp();
  var sok = document.getElementById('sok');
  if (sok) sok.addEventListener('input', function () {
    var q = sok.value.trim().toLowerCase(), n = 0;
    app.querySelectorAll('.gterm').forEach(function (el) { var on = !q || el.getAttribute('data-q').indexOf(q) >= 0; el.hidden = !on; if (on) n++; });
    document.getElementById('ingen').hidden = n > 0;
  });
  if (location.hash) { var el = document.getElementById(location.hash.slice(1)); if (el) { el.classList.add('hit'); el.scrollIntoView(); } }
  document.getElementById('footer').innerHTML = '<span class="maker"><img src="../img/mickla.png" alt="Mickla" width="22" height="22">' + esc(I.upphov) + '</span><span>' + esc(I.verktyg) + ' · ' + esc(I.version) + '</span>';
})();
