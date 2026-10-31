/* Dialogverktyg — Learning Curve Approach: Utvalda tillämpningar.
   En gemensam motor för alla fall. Varje fall beskrivs i content.js under "fall".
   Statisk app, all data stannar i webbläsaren. © Engströms Mickla AB 2026 */
(function () {
  'use strict';
  var C = window.CONTENT;
  var app = document.getElementById('app');
  var fallId = (new URLSearchParams(window.location.search).get('fall') || '').replace(/[^a-z0-9-]/g, '');
  var F = C.fall.filter(function (f) { return f.id === fallId; })[0] || null;
  var KEY = F ? 'lca.tillampning.' + F.id + '.v1' : null;
  var state = F ? (load() || fresh()) : null;
  var view = { step: 'start' };

  /* ---------- hjälpfunktioner ---------- */
  function fresh() {
    return { app: 'tillampning', fall: F.id, format: 1, version: C.version, skapad: new Date().toISOString(), andrad: null,
      meta: { foretag: '', datum: new Date().toISOString().slice(0, 10), typ: 'grupp', namn: '', objekt: '' },
      scen: [0, 1, 2, 3].map(function () { return { namn: '', text: '' }; }), fokusfraga: '', franSense: false,
      faktorer: {}, egna: [],
      bed: [0, 1, 2, 3].map(function () { return { lage: {}, orsak: {}, utv: null, orsaker: '', atg: '' }; }),
      syntes: { monster: '', robusta: '', samlad: null, sakerhet: null, osakert: '' }, kedja: {} };
  }
  function load() { try { var s = localStorage.getItem(KEY); return s ? JSON.parse(s) : null; } catch (e) { return null; } }
  function save() { if (!state) return; state.andrad = new Date().toISOString(); try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) {} }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function fill(t, map) { return String(t).replace(/\{(\w+)\}/g, function (m, k) { return map[k] != null ? map[k] : m; }); }
  function toast(msg) { var t = document.createElement('div'); t.className = 'toast'; t.textContent = msg; document.body.appendChild(t); setTimeout(function () { t.remove(); }, 3000); }
  function lista(a) { var och = a.some(function (x) { return / och /.test(x) && !/^”/.test(x); }) ? ' samt ' : ' och '; return a.length > 1 ? a.slice(0, -1).join(', ') + och + a[a.length - 1] : (a[0] || ''); }
  function lc(x) { x = String(x || ''); return /^[A-ZÅÄÖ][a-zåäö]/.test(x) ? x.charAt(0).toLowerCase() + x.slice(1) : x; }
  var TAL = ['noll', 'en', 'två', 'tre', 'fyra', 'fem', 'sex', 'sju', 'åtta', 'nio', 'tio', 'elva', 'tolv'];
  function tal(n) { return TAL[n] || String(n); }
  function stor(x) { x = String(x || ''); return x.charAt(0).toUpperCase() + x.slice(1); }
  function namnLista(a) { return stor(lista(a.map(function (x, i) { return i ? lc(x) : x; }))); }
  function unika(a) { var o = []; a.forEach(function (x) { if (o.indexOf(x) < 0) o.push(x); }); return o; }
  function punkt(t) { t = String(t || '').trim(); return !t || /[.?!:]$/.test(t) ? t : t + '.'; }
  function setPath(o, p, v) { var k = p.split('.'), last = k.pop(); var t = k.reduce(function (x, kk) { if (x[kk] == null) x[kk] = {}; return x[kk]; }, o); t[last] = v; }
  function seg(attr, val, labels, cur, extra) {
    return '<div class="seg" role="group">' + labels.map(function (l, i) { var v = val(i); return '<button ' + attr + '="' + v + '"' + (extra || '') + ' aria-pressed="' + (cur === v) + '">' + esc(l) + '</button>'; }).join('') + '</div>';
  }
  function scenNamn(i) { return (state.scen[i].namn || '').trim() || 'Framtid ' + (i + 1); }
  function allaFaktorer() { return F.faktorer.concat(state.egna); }
  function faktor(id) { return allaFaktorer().filter(function (f) { return f.id === id; })[0]; }
  function fd(id) { state.faktorer[id] = state.faktorer[id] || { med: false, hos: '' }; return state.faktorer[id]; }
  function valda() { return allaFaktorer().filter(function (f) { return state.faktorer[f.id] && state.faktorer[f.id].med; }); }
  function lage(i, id) { var l = state.bed[i].lage[id]; return typeof l === 'number' ? l : 0; }
  function stat() {
    return valda().map(function (f) {
      var neg = [], pos = [];
      [0, 1, 2, 3].forEach(function (i) { var l = lage(i, f.id); if (l < 0) neg.push(i); if (l > 0) pos.push(i); });
      return { f: f, neg: neg, pos: pos };
    });
  }
  /* Nuläge (valfritt per fall): hur stark delen är i dag. Starkt i dag men försvagat i minst två framtider
     pekas ut som en fälla (Christensen 1997; Leonard-Barton 1992) eller inkuransrisk (Baum 1991). */
  function idag(id) { var v = fd(id).idag; return typeof v === 'number' ? v : null; }
  function fallor() { return F.nulage ? stat().filter(function (s) { return idag(s.f.id) === 2 && s.neg.length >= 2; }) : []; }
  function robusta() { return state.syntes.robusta.split('\n').map(function (x) { return x.trim(); }).filter(Boolean); }
  function objektRef() { var o = state.meta.objekt.trim(), r = F.objekt.ref || ''; return o ? (r ? r + ' ' + o : o) : (r || 'verksamheten'); }

  /* ---------- steg ---------- */
  function steps() { return ['start', 'uppgifter', 'underlag', 'faktorer', 'bed-0', 'bed-1', 'bed-2', 'bed-3', 'syntes', 'rapport']; }
  function etapp(st) { return st === 'uppgifter' ? 0 : st === 'underlag' ? 1 : st === 'faktorer' ? 2 : /^bed-/.test(st) ? 3 : st === 'syntes' ? 4 : 5; }
  function vagItems() { var V = C.vag; return [V.uppgifter, V.framtiderna, fill(V.faktorer, { ord: F.faktorOrd.flera }), V.bedomning, V.syntes, V.rapport].map(function (n) { return { namn: n.charAt(0).toUpperCase() + n.slice(1) }; }); }
  function nastaText(st, n) {
    var N = C.nav, V = C.vag; if (!n) return N.nasta;
    if (n === 'rapport') return N.rapport;
    if (/^bed-/.test(st) && /^bed-/.test(n)) return V.nastaFramtid;
    return N.nasta + ': ' + lc(vagItems()[etapp(n)].namn).replace(/^./, function (c) { return c.toUpperCase(); });
  }
  function canNext(st) {
    st = st || view.step;
    if (st === 'uppgifter') return !!state.meta.objekt.trim();
    if (st === 'underlag') return state.scen.every(function (s) { return (s.namn || '').trim(); });
    if (st === 'faktorer') return valda().length >= F.minFaktorer;
    if (/^bed-/.test(st)) return state.bed[+st.slice(4)].utv !== null;
    if (st === 'syntes') return state.syntes.samlad !== null;
    return true;
  }
  function saknas(st) {
    st = st || view.step; var m = [];
    if (st === 'uppgifter' && !state.meta.objekt.trim()) m.push('Ange ' + lc(F.objekt.etikett.replace(/\?$/, '')) + '.');
    if (st === 'underlag') { var tom = [0, 1, 2, 3].filter(function (i) { return !(state.scen[i].namn || '').trim(); }).length; if (tom) m.push('Ge alla fyra framtider ett namn (' + tom + ' saknas).'); }
    if (st === 'faktorer' && valda().length < F.minFaktorer) m.push('Markera minst ' + F.minFaktorer + ' ' + F.faktorOrd.flera + ' (nu ' + valda().length + ').');
    if (/^bed-/.test(st) && state.bed[+st.slice(4)].utv === null) m.push(F.bedomning.saknas || 'Gör en samlad bedömning för den här framtiden.');
    if (st === 'syntes' && state.syntes.samlad === null) m.push('Gör en samlad bedömning.');
    return m;
  }
  function go(step) { view.step = step; if (step !== 'start') { state.steg = step; save(); } render(); window.scrollTo(0, 0); app.focus({ preventScroll: true }); }
  function nav(d) { var s = steps(), i = s.indexOf(view.step); go(s[Math.max(0, Math.min(s.length - 1, i + d))]); }
  function resumeStep() { var s = steps(); for (var i = 1; i < s.length - 1; i++) if (!canNext(s[i])) return s[i]; return 'rapport'; }
  function rerender() { var y = window.scrollY; render(); window.scrollTo(0, y); }
  function eyebrow(t) { return '<div class="eyebrow">' + esc(F.namn) + (t ? ' · ' + esc(t) : '') + '</div>'; }
  function field(label, path, val, o) {
    o = o || {};
    return '<label class="field"' + (o.style ? ' style="' + o.style + '"' : '') + '><span>' + esc(label) + '</span>' + (o.area ? '<textarea rows="' + (o.rows || 3) + '" data-path="' + path + '">' + esc(val) + '</textarea>' : '<input type="text" data-path="' + path + '" value="' + esc(val) + '"' + (o.ph ? ' placeholder="' + esc(o.ph) + '"' : '') + '>') + '</label>';
  }

  /* ---------- listan ---------- */
  function renderLista() {
    var ho = LCA.takeHandOff(), h = '';
    h += '<div class="eyebrow">Smart Built Boost</div><h1>' + esc(C.titel) + '</h1><p class="lead">' + esc(C.undertitel) + '</p>' + C.intro.map(function (t) { return '<p>' + esc(t) + '</p>'; }).join('');
    if (ho && ho.modul === 'sense') h += '<div class="note"><b>' + esc(C.start.senseVantar) + '</b> ' + esc(ho.organisation.namn || '') + '. Välj tillämpning nedan, så följer framtiderna med.</div>';
    h += '<h2 class="section">' + esc(C.listRubrik) + '</h2><div class="modgrid tillgrid">' + C.fall.map(function (f, i) {
      var pg = null; try { var s = JSON.parse(localStorage.getItem('lca.tillampning.' + f.id + '.v1') || 'null'); if (s && (s.meta.objekt || s.meta.foretag)) pg = s.meta.objekt || s.meta.foretag; } catch (e) {}
      return '<article class="card modcard"><div class="modhead"><span class="modnr">' + (i + 1) + '</span><div><h3>' + esc(f.namn) + '</h3></div></div><p>' + esc(f.kort) + '</p><dl class="modfacts"><div><dt>Tid</dt><dd>' + esc(f.tid) + '</dd></div></dl>' +
        (pg ? '<p class="small note" style="margin:0 0 14px">Påbörjad körning i den här webbläsaren: <b>' + esc(pg) + '</b>.</p>' : '') +
        '<a class="btn" href="?fall=' + esc(f.id) + '">Öppna →</a></article>';
    }).join('') + '</div>';
    return h + '<p class="note small">' + esc(C.integritet) + '</p>';
  }

  /* ---------- vyer ---------- */
  function renderStart() {
    var S = C.start, has = load(), ho = LCA.takeHandOff(), h = '';
    if (ho && ho.modul !== 'tillampning' && ho.kedja && (ho.modul === 'sense' || ho.kedja.sense)) h += '<div class="note"><b>' + esc(S.senseVantar) + '</b> ' + esc(ho.organisation.namn || '') + ' <span style="display:block;margin-top:10px"><button class="btn" data-act="fromhandoff">' + esc(S.senseStarta) + '</button> <button class="btn quiet" data-act="dropho">' + esc(S.nejTack) + '</button></span></div>';
    else if (ho && ho.modul === 'tillampning' && ho.data && ho.data.fall === F.id) h += '<div class="note"><b>En sparfil från den här tillämpningen väntar.</b> <span style="display:block;margin-top:10px"><button class="btn" data-act="fromhandoff">Öppna den</button> <button class="btn quiet" data-act="dropho">' + esc(S.nejTack) + '</button></span></div>';
    h += '<p class="small"><a class="backlink" href="./">← ' + esc(S.tillLista) + '</a></p><div class="eyebrow">' + esc(C.titel) + '</div><h1>' + esc(F.namn) + '</h1><p class="lead">' + esc(F.kort) + '</p>';
    h += '<div class="note about-note small">' + esc(F.vardeDefinition) + (F.senseRad ? ' ' + esc(F.senseRad) + ' <a href="../sense/">Till Sense</a>' : '') + '</div>';
    h += '<div class="card tight"><b>Så går det till</b><ol class="steps-ol"><li>' + esc(C.underlag.rubrik) + ' från Sense</li><li>' + esc(F.faktorRubrik) + '</li><li>' + esc(F.bedomning.rubrik) + ', en framtid i taget</li><li>' + esc(F.syntes.rubrik) + '</li></ol><p class="small muted" style="margin:0">' + esc(F.tid) + ' ' + esc(F.grund) + '</p></div>';
    var resume = has && (has.meta.objekt || has.meta.foretag) ? '<div class="card"><h3>' + esc(S.fortsatt) + '</h3><p class="muted small">' + esc(S.fortsattText) + (has.meta.objekt ? ': ' + esc(has.meta.objekt) : '') + '.</p><button class="btn" data-act="resume">Fortsätt</button></div>' : '';
    h += '<div class="startgrid">' + resume + '<div class="card"><h3>' + esc(S.ny) + '</h3><p class="muted small">' + esc(S.nyText) + '</p><button class="btn" data-act="new">Starta</button></div>' +
      '<div class="card"><h3>' + esc(S.oppna) + '</h3><p class="muted small">' + esc(S.oppnaText) + '</p><button class="btn ghost" data-act="open">Välj fil</button></div></div>';
    return h + LCA.teoriHTML() + '<p class="note small">' + esc(C.integritet) + '</p>';
  }
  function renderMeta() {
    var U = C.uppgifter, m = state.meta;
    return eyebrow('Förberedelse') + '<h2>' + esc(U.rubrik) + '</h2><p class="muted">' + esc(U.text) + '</p>' +
      '<div class="card">' + field(F.objekt.etikett, 'meta.objekt', m.objekt, { ph: F.objekt.hjalp }) +
      field(U.org, 'meta.foretag', m.foretag) +
      '<label class="field"><span>' + esc(U.datum) + '</span><input type="date" data-path="meta.datum" value="' + esc(m.datum) + '"></label>' +
      '<span style="display:block;font-weight:600;font-size:15px;margin-bottom:6px">' + esc(U.vem) + '</span><div class="radios">' +
      ['grupp', 'individ'].map(function (t) { return '<label><input type="radio" name="typ" value="' + t + '"' + (m.typ === t ? ' checked' : '') + '> ' + esc(U[t]) + '</label>'; }).join('') + '</div>' +
      '<label class="field" style="margin:0"><span>' + esc(m.typ === 'grupp' ? U.namnGrupp : U.namnIndivid) + ' <span class="muted" style="display:inline;font-weight:400">' + esc(U.frivilligt) + '</span></span><input type="text" data-path="meta.namn" value="' + esc(m.namn) + '"></label></div>';
  }
  function renderUnderlag() {
    var U = C.underlag, h = eyebrow('Underlag') + '<h2>' + esc(U.rubrik) + '</h2>';
    if (state.franSense) {
      h += '<p class="muted">' + esc(U.medSense) + '</p>' + (state.fokusfraga ? '<p class="small"><b>' + esc(U.fokus) + ':</b> ' + esc(state.fokusfraga) + '</p>' : '');
      h += '<div class="scen-grid report">' + [0, 1, 2, 3].map(function (i) { var s = state.scen[i]; return '<div class="card tight"><div class="eyebrow">' + esc(U.senseMarkering) + '</div><b>' + esc(scenNamn(i)) + '</b>' + (s.kombination ? '<p class="small muted" style="margin:4px 0">' + esc(s.kombination) + '</p>' : '') + '<p class="small" style="margin:0">' + esc(s.text) + '</p></div>'; }).join('') + '</div>';
    } else {
      h += '<p class="muted">' + esc(U.utanSense) + '</p><div class="actions" style="margin:0 0 16px"><button class="btn ghost" data-act="open">' + esc(U.lasIn) + '</button></div>';
      h += '<div class="scen-grid">' + [0, 1, 2, 3].map(function (i) { return '<div class="card tight">' + field(U.namn, 'scen.' + i + '.namn', state.scen[i].namn) + field(U.text, 'scen.' + i + '.text', state.scen[i].text, { area: true, rows: 3, style: 'margin:0' }) + '</div>'; }).join('') + '</div>';
    }
    return h;
  }
  function renderFaktorer() {
    var h = eyebrow(F.faktorRubrik) + '<h2>' + esc(F.faktorRubrik) + '</h2><p class="muted">' + esc(F.faktorText) + '</p>';
    allaFaktorer().forEach(function (f) {
      var d = fd(f.id);
      h += '<div class="card tight vrow' + (d.med ? ' on' : '') + '"><label class="vcheck"><input type="checkbox" data-faktor="' + f.id + '"' + (d.med ? ' checked' : '') + '><span><b>' + esc(f.namn) + '</b><span class="muted small"> ' + esc(f.text || '') + '</span></span></label>' +
        (d.med ? field(F.hosOss, 'faktorer.' + f.id + '.hos', d.hos, { ph: f.exempel || '', style: 'margin:10px 0 0' }) +
          (F.nulage ? '<span class="lbl">' + esc(F.nulage.fraga) + '</span>' + seg('data-idag', function (k) { return k; }, F.nulage.skala, idag(f.id), ' data-f="' + f.id + '"') : '') : '') + '</div>';
    });
    h += '<div class="actions" style="margin-top:6px"><input type="text" id="egenfaktor" placeholder="' + esc(F.egen) + '" style="max-width:320px"><button class="btn ghost" data-act="addfaktor">Lägg till</button></div>';
    return h + '<p class="hint">' + valda().length + ' markerade.' + (F.nulage ? ' ' + esc(F.nulage.hjalp || '') : '') + '</p>';
  }
  function renderBed(i) {
    var B = F.bedomning, s = state.bed[i], sc = state.scen[i];
    var h = eyebrow(B.rubrik) + '<h2>' + esc(B.rubrik) + ': ' + esc(scenNamn(i)) + '</h2><p class="muted">' + esc(B.text) + '</p>';
    h += '<div class="card tight"><div class="eyebrow">Framtid ' + (i + 1) + ' av 4</div>' + (sc.kombination ? '<p class="small muted" style="margin-bottom:4px">' + esc(sc.kombination) + '</p>' : '') + (sc.text ? '<p style="margin:0">' + esc(sc.text) + '</p>' : '') + '</div>';
    valda().forEach(function (f) {
      var l = lage(i, f.id), hos = fd(f.id).hos;
      h += '<div class="card tight vind"><div class="vind-head"><b>' + esc(f.namn) + '</b>' + seg('data-lage', function (k) { return k - 1; }, B.lagen, l, ' data-f="' + f.id + '"') + '</div>' + (hos ? '<p class="small muted" style="margin:6px 0 0">' + esc(F.hosOss) + ': ' + esc(hos) + '</p>' : '') +
        (l !== 0 ? field(B.orsak, 'bed.' + i + '.orsak.' + f.id, s.orsak[f.id] || '', { style: 'margin:10px 0 0' }) : '') + '</div>';
    });
    h += '<h3>' + esc(B.utvecklingFraga) + '</h3>' + seg('data-utv', function (k) { return k - 1; }, B.utveckling, s.utv);
    h += field(B.orsaker, 'bed.' + i + '.orsaker', s.orsaker, { area: true, rows: 2, style: 'margin-top:16px' });
    h += field(B.atgarder, 'bed.' + i + '.atg', s.atg, { area: true, rows: 3 });
    return h;
  }
  function renderSyntes() {
    var Sy = F.syntes, st = stat(), neg = st.filter(function (s) { return s.neg.length >= 2; }), pos = st.filter(function (s) { return s.pos.length >= 2; });
    var h = eyebrow(Sy.rubrik) + '<h2>' + esc(Sy.rubrik) + '</h2><p class="muted">' + esc(Sy.text) + '</p>';
    h += '<div class="card tight"><div class="eyebrow" style="color:#d1431d">' + esc(Sy.sarbarheter) + '</div>' + (neg.length ? neg.map(function (s) { return '<p class="small" style="margin-bottom:4px"><b>' + esc(s.f.namn) + '</b> <span class="muted">(' + s.neg.length + ' av 4: ' + esc(lista(s.neg.map(scenNamn))) + ')</span></p>'; }).join('') : '<p class="small muted" style="margin:0">' + esc(Sy.inga) + '</p>') +
      (pos.length ? '<div class="eyebrow" style="margin-top:12px">' + esc(Sy.styrkor) + '</div>' + pos.map(function (s) { return '<p class="small" style="margin-bottom:4px"><b>' + esc(s.f.namn) + '</b> <span class="muted">(' + s.pos.length + ' av 4)</span></p>'; }).join('') : '') + '</div>';
    if (F.nulage) { var fa = fallor(); h += '<div class="card tight fallor"><div class="eyebrow" style="color:#1e5fcc">' + esc(F.nulage.rubrik) + '</div><p class="small muted" style="margin-bottom:6px">' + esc(F.nulage.forklaring) + '</p>' + (fa.length ? fa.map(function (s) { return '<p class="small" style="margin-bottom:4px"><b>' + esc(s.f.namn) + '</b> <span class="muted">(stark i dag, ' + esc(lc(F.bedomning.lagen[0])) + ' i ' + esc(lista(s.neg.map(scenNamn))) + ')</span></p>'; }).join('') : '<p class="small" style="margin:0">' + esc(F.nulage.inga) + '</p>') + '</div>'; }
    h += '<div class="tablewrap" style="margin-bottom:18px"><table class="facil"><thead><tr>' + Sy.tabell.map(function (t) { return '<th>' + esc(t) + '</th>'; }).join('') + '</tr></thead><tbody>' + [0, 1, 2, 3].map(function (i) { var u = state.bed[i].utv; return '<tr><td><b>' + esc(scenNamn(i)) + '</b></td><td>' + (u === null ? '' : esc(F.bedomning.utveckling[u + 1])) + '</td><td>' + esc(state.bed[i].atg) + '</td></tr>'; }).join('') + '</tbody></table></div>';
    h += field(Sy.monster, 'syntes.monster', state.syntes.monster, { area: true, rows: 3 });
    h += field(Sy.robusta, 'syntes.robusta', state.syntes.robusta, { area: true, rows: 4 });
    h += '<span style="display:block;font-weight:600;font-size:15px;margin-bottom:6px">' + esc(Sy.samlad) + '</span>' + seg('data-samlad', function (k) { return k - 1; }, Sy.samladSkala, state.syntes.samlad);
    h += '<span style="display:block;font-weight:600;font-size:15px;margin:10px 0 6px">' + esc(Sy.sakerhet) + '</span>' + seg('data-sakerhet', function (k) { return k; }, Sy.sakerhetSkala, state.syntes.sakerhet);
    h += field(Sy.osakert, 'syntes.osakert', state.syntes.osakert, { area: true, rows: 2, style: 'margin-top:16px' });
    return h + '<p class="small muted">' + esc(Sy.slutord) + '</p>';
  }

  /* ---------- rapport ---------- */
  function lamnar() {
    var R = F.rapport, st = stat(), sam = state.syntes.samlad;
    return {
      id: F.id, namn: F.namn, objekt: state.meta.objekt,
      samlad: sam === null ? '' : F.syntes.samladSkala[sam + 1], samladIndex: sam, sakerhet: state.syntes.sakerhet,
      sarbara: st.filter(function (s) { return s.neg.length >= 2; }).map(function (s) { return s.f.namn; }),
      styrkor: st.filter(function (s) { return s.pos.length >= 2; }).map(function (s) { return s.f.namn; }),
      robustaAtgarder: robusta(), monster: state.syntes.monster, osakert: state.syntes.osakert,
      fallor: fallor().map(function (s) { return s.f.namn; }), fallorNamn: F.nulage ? F.nulage.rubrik : '',
      scenarier: [0, 1, 2, 3].map(function (i) { var u = state.bed[i].utv; return { namn: scenNamn(i), utveckling: u === null ? null : F.bedomning.utveckling[u + 1] }; }),
      lamnarSamlad: sam === null ? '' : R.lamnarSamlad[sam + 1]
    };
  }
  function envelope() { return LCA.wrap({ modul: 'tillampning', version: C.version, skapad: state.skapad, organisation: { namn: state.meta.foretag, typ: state.meta.typ, deltagare: state.meta.namn }, data: state, lamnar: lamnar(), kedja: state.kedja || {} }); }
  function block() {
    var R = F.rapport, Sy = F.syntes, org = state.meta.foretag || 'Organisationen', st = stat();
    var sam = [fill(R.inledning, { org: org, objekt: objektRef(), fran: state.franSense && state.fokusfraga ? fill(R.franSense, { fraga: state.fokusfraga.replace(/[?.]\s*$/, '') + '?' }) : '' }) + ' ' +
      fill(R.faktorer, { n: tal(valda().length) + ' ' + (valda().length === 1 ? F.faktorOrd.en : F.faktorOrd.flera), lista: lista(valda().map(function (f) { return lc(f.namn); })) })];
    sam.push(state.syntes.samlad === null ? R.samladSaknas : fill(R.samlad, { samlad: lc(Sy.samladSkala[state.syntes.samlad + 1]), sakerhet: state.syntes.sakerhet == null ? 'osäker' : R.sakerhetOrd[state.syntes.sakerhet] }));
    var analys = [0, 1, 2, 3].map(function (i) {
      var u = state.bed[i].utv, t = u === null ? '' : fill(R.framtid, { utv: (R.utvecklingOrd || [])[u + 1] || lc(F.bedomning.utveckling[u + 1]) });
      var neg = st.filter(function (s) { return s.neg.indexOf(i) >= 0; }).map(function (s) { return lc(s.f.namn); });
      var pos = st.filter(function (s) { return s.pos.indexOf(i) >= 0; }).map(function (s) { return lc(s.f.namn); });
      if (neg.length) t += ' ' + fill(R.forsvagas, { lista: lista(neg) });
      if (pos.length) t += ' ' + fill(R.starks, { lista: lista(pos) });
      if (state.bed[i].orsaker.trim()) t += ' ' + fill(R.orsak, { text: lc(punkt(state.bed[i].orsaker)) });
      return { titel: scenNamn(i), text: t.trim() };
    });
    var negF = st.filter(function (s) { return s.neg.length >= 2; }), posF = st.filter(function (s) { return s.pos.length >= 2; });
    analys.push({ titel: R.sarbarTitel, text: negF.length ? fill(R.sarbar, { lista: namnLista(negF.map(function (s) { return s.f.namn; })) }) : R.ingenSarbar });
    var fa = fallor();
    if (F.nulage) analys.splice(5, 0, { titel: F.nulage.rubrik, text: fa.length ? fill(F.nulage.analys, { lista: namnLista(fa.map(function (s) { return s.f.namn; })) }) : F.nulage.inga });
    if (posF.length) analys.push({ titel: R.styrkaTitel, text: fill(R.styrka, { lista: namnLista(posF.map(function (s) { return s.f.namn; })) }) });
    if (state.syntes.monster.trim()) analys.push({ titel: R.monsterTitel, text: punkt(state.syntes.monster) });
    var forslag = [];
    if (fa.length && F.nulage.forslag) forslag.push({ titel: F.nulage.forslagTitel, text: fill(F.nulage.forslag, { lista: lista(fa.map(function (s) { return lc(s.f.namn); })) }) });
    if (robusta().length) forslag.push({ titel: R.robustaTitel, text: robusta().map(punkt).join(' ') });
    var vik = [0, 1, 2, 3].filter(function (i) { return state.bed[i].utv === -1 && state.bed[i].atg.trim(); });
    if (vik.length) forslag.push({ titel: R.vikandeTitel, text: fill(R.vikande, { framtider: lista(vik.map(function (i) { return '”' + scenNamn(i) + '”'; })), atg: unika(vik.map(function (i) { return punkt(state.bed[i].atg); })).join(' ') }) });
    if (state.syntes.osakert.trim()) forslag.push({ titel: R.osakertTitel, text: punkt(state.syntes.osakert) });
    forslag.push({ titel: R.vidareTitel, text: R.vidare });
    return { sammanfattning: sam, analys: analys, forslag: forslag };
  }
  function symbol(l) { return l < 0 ? '▼' : l > 0 ? '▲' : '·'; }
  function matrisHTML() {
    var R = F.rapport;
    return '<div class="tablewrap" style="margin-bottom:8px"><table class="facil vmatris"><thead><tr><th>' + esc(F.faktorOrd.flera.charAt(0).toUpperCase() + F.faktorOrd.flera.slice(1)) + '</th>' + (F.nulage ? '<th class="n">' + esc(F.nulage.kolumn) + '</th>' : '') + [0, 1, 2, 3].map(function (i) { return '<th class="n">' + esc(scenNamn(i)) + '</th>'; }).join('') + '</tr></thead><tbody>' +
      valda().map(function (f) { var fl = fallor().some(function (s) { return s.f.id === f.id; }); return '<tr' + (fl ? ' class="falla"' : '') + '><td>' + esc(f.namn) + (fl ? ' <span class="tag strong">' + esc(F.nulage.markering) + '</span>' : '') + '</td>' + (F.nulage ? '<td class="n small">' + (idag(f.id) === null ? '–' : esc(F.nulage.skala[idag(f.id)])) + '</td>' : '') + [0, 1, 2, 3].map(function (i) { var l = lage(i, f.id); return '<td class="n ' + (l < 0 ? 'neg' : l > 0 ? 'pos' : 'noll') + '" title="' + esc(F.bedomning.lagen[l + 1]) + '">' + symbol(l) + '</td>'; }).join('') + '</tr>'; }).join('') +
      '<tr class="sum"><td><b>' + esc(F.bedomning.utvecklingFraga.replace(/ i den här framtiden$/, '')) + '</b></td>' + (F.nulage ? '<td></td>' : '') + [0, 1, 2, 3].map(function (i) { var u = state.bed[i].utv; return '<td class="n"><b>' + (u === null ? '' : esc(F.bedomning.utveckling[u + 1])) + '</b></td>'; }).join('') + '</tr>' +
      '</tbody></table></div><p class="small muted">▲ ' + esc(lc(F.bedomning.lagen[2])) + ', ▼ ' + esc(lc(F.bedomning.lagen[0])) + ', · ' + esc(lc(F.bedomning.lagen[1])) + '.</p>';
  }
  function renderRapport() {
    var R = C.rapport, FR = F.rapport, m = state.meta, h = '';
    h += eyebrow(R.rubrik) + '<h2>' + esc(m.objekt || F.namn) + '</h2><p class="muted">' + esc(m.foretag || '') + (m.foretag ? ' · ' : '') + esc(m.datum) + ' · ' + (m.typ === 'grupp' ? 'Grupparbete' : 'Individuellt arbete') + (m.namn ? ' · ' + esc(m.namn) : '') + '</p>';
    h += '<div class="actions" style="margin:0 0 18px"><button class="btn" data-act="pdf">' + esc(R.pdf) + '</button><button class="btn ghost" data-act="savefile">' + esc(R.spara) + '</button></div>';
    h += LCA.reportBlock(block());
    h += '<h3>' + esc(FR.matrisRubrik) + '</h3>' + matrisHTML();
    h += '<h3>' + esc(R.fyraFramtider) + '</h3>' + (state.franSense ? '' : '<p class="small muted">' + esc(R.saknadSense) + '</p>') + '<div class="scen-grid report">' + [0, 1, 2, 3].map(function (i) {
      var b = state.bed[i], u = b.utv;
      return '<div class="card tight"><b>' + esc(scenNamn(i)) + '</b>' + (state.scen[i].text ? '<p class="small muted" style="margin:4px 0">' + esc(state.scen[i].text) + '</p>' : '') + (u !== null ? '<p class="small" style="margin:6px 0 0"><b>' + esc(F.syntes.tabell[1]) + ':</b> ' + esc(lc(F.bedomning.utveckling[u + 1])) + '</p>' : '') + (b.orsaker ? '<p class="small" style="margin:4px 0 0"><b>Orsaker:</b> ' + esc(b.orsaker) + '</p>' : '') + (b.atg ? '<p class="small" style="margin:4px 0 0"><b>Åtgärder:</b> ' + esc(b.atg) + '</p>' : '') + '</div>';
    }).join('') + '</div>';
    h += '<h3>' + esc(FR.faktorerRubrik) + '</h3><div class="card tight">' + valda().map(function (f) {
      var orsaker = [0, 1, 2, 3].map(function (i) { var o = (state.bed[i].orsak[f.id] || '').trim(); return o && lage(i, f.id) !== 0 ? scenNamn(i) + ': ' + o : ''; }).filter(Boolean);
      return '<p class="small" style="margin-bottom:6px"><b>' + esc(f.namn) + ':</b> ' + esc(fd(f.id).hos || '') + (orsaker.length ? ' <span class="muted">' + esc(orsaker.join('. ')) + '</span>' : '') + '</p>';
    }).join('') + '</div>';
    if (state.syntes.osakert.trim()) h += '<p><b>' + esc(FR.osakertTitel) + ':</b> ' + esc(state.syntes.osakert) + '</p>';
    h += '<div class="card tight next"><div class="eyebrow">' + esc(R.nastaRubrik) + '</div><p class="small">' + esc(R.nastaText) + '</p><div class="actions" style="margin-top:8px"><button class="btn" data-act="tosee">' + esc(R.tillSee) + ' →</button><button class="btn ghost" data-act="tolista">' + esc(R.tillLista) + '</button><button class="btn ghost" data-act="savefile">' + esc(R.spara) + '</button></div></div>';
    h += LCA.teoriHTML();
    return h + '<div class="actions"><button class="btn quiet" data-act="restart">' + esc(R.borjaOm) + '</button></div>';
  }

  /* ---------- rendering ---------- */
  function render() {
    var bar = document.getElementById('progress-bar');
    if (!F) { app.innerHTML = renderLista(); bar.style.width = '0%'; return; }
    var st = view.step, s = steps(), i = s.indexOf(st), html = '';
    if (i < 0) { view.step = st = resumeStep(); i = s.indexOf(st); }
    if (st === 'start') html = renderStart();
    else if (st === 'uppgifter') html = renderMeta();
    else if (st === 'underlag') html = renderUnderlag();
    else if (st === 'faktorer') html = renderFaktorer();
    else if (/^bed-/.test(st)) html = renderBed(+st.slice(4));
    else if (st === 'syntes') html = renderSyntes();
    else if (st === 'rapport') html = renderRapport();
    if (st !== 'start' && st !== 'rapport') {
      var N = C.nav;
      html += '<div class="navrow"><button class="btn quiet" data-act="back">' + esc(N.tillbaka) + '</button><button class="btn quiet savebtn" data-act="savefile" title="Ladda ner en sparfil så att arbetet inte går förlorat">' + esc(N.spara) + '</button><button class="btn" data-act="next"' + (canNext() ? '' : ' disabled') + '>' + esc(nastaText(st, s[i + 1])) + ' →</button></div><div class="missing" id="missing" aria-live="polite">' + missingHTML() + '</div>';
    }
    var sk = /^bed-/.test(st) ? 'bed' : st, si = (C.skedeIntro || {})[sk];
    if (si) { var map = { ord: F.faktorOrd.flera, objekt: F.objekt.ref || 'verksamheten' }, o = {}; Object.keys(si).forEach(function (k) { o[k] = fill(si[k], map); }); html = LCA.withIntro(html, o); }
    if (st === 'start') html = html.replace('<div class="startgrid">', LCA.infoIntroHTML() + '<div class="startgrid">');
    else html = LCA.route(vagItems(), etapp(st)) + html;
    app.innerHTML = html;
    bar.style.width = (st === 'start' ? 0 : Math.round(i / (s.length - 1) * 100)) + '%';
  }
  function missingHTML() { var m = canNext() ? [] : saknas(); return m.length ? '<b>' + esc(C.nav.forVidare) + '</b> ' + m.map(esc).join(' ') : ''; }
  function refreshNext() { var b = app.querySelector('[data-act=next]'); if (b) b.disabled = !canNext(); var h = document.getElementById('missing'); if (h) h.innerHTML = missingHTML(); }

  /* ---------- sparfiler ---------- */
  function confirmReset() { return window.confirm('Den påbörjade körningen i den här webbläsaren ersätts. Spara en sparfil först om ni vill behålla den. Fortsätta?'); }
  function hasWork() { var s = load(); return s && (s.meta.objekt || valda().length); }
  function useEnv(env) {
    if (env.modul === 'tillampning' && env.data && env.data.fall === F.id) { state = env.data; state.kedja = env.kedja || {}; save(); go(resumeStep()); return; }
    var k = LCA.chainFrom(env), sense = k.sense;
    if (!sense || !sense.scenarier) { toast('Sparfilen innehåller inga framtider från Sense. Skriv in dem i steget Framtiderna i stället.'); return; }
    state = fresh(); state.kedja = k; state.franSense = true; state.fokusfraga = sense.fokusfraga || '';
    state.scen = sense.scenarier.slice(0, 4).map(function (s) { return { namn: s.namn || '', text: s.text || '', kombination: s.kombination || '' }; });
    while (state.scen.length < 4) state.scen.push({ namn: '', text: '' });
    state.meta.foretag = env.organisation.namn || ''; state.meta.typ = env.organisation.typ || 'grupp'; state.meta.namn = env.organisation.deltagare || '';
    save(); toast('Framtiderna från Sense är inlästa.'); go('uppgifter');
  }

  /* ---------- händelser ---------- */
  app.addEventListener('click', function (e) {
    var t = e.target.closest('button'); if (!t) return;
    var act = t.getAttribute('data-act'), d = function (a) { return t.getAttribute(a); };
    if (act === 'next') { if (canNext()) nav(1); return; }
    if (act === 'back') { nav(-1); return; }
    if (act === 'new') { if (!hasWork() || confirmReset()) { state = fresh(); save(); go('uppgifter'); } return; }
    if (act === 'resume') { state = load(); go(state.steg && steps().indexOf(state.steg) > 0 ? state.steg : resumeStep()); return; }
    if (act === 'open') { document.getElementById('file-load').click(); return; }
    if (act === 'fromhandoff') { var ho = LCA.takeHandOff(); if (ho && (!hasWork() || confirmReset())) { LCA.clearHandOff(); useEnv(ho); } return; }
    if (act === 'dropho') { LCA.clearHandOff(); render(); return; }
    if (act === 'savefile') { var env = envelope(); LCA.download(env, LCA.fileName(env).replace('lca-tillampning-', 'lca-' + F.id + '-')); toast('Sparfilen är nedladdad.'); return; }
    if (act === 'pdf') { makePDF(); return; }
    if (act === 'tosee') { LCA.handOff(envelope()); window.location.href = '../see/'; return; }
    if (act === 'tolista') { LCA.handOff(envelope()); window.location.href = './'; return; }
    if (act === 'restart') { if (confirmReset()) { state = fresh(); save(); go('start'); } return; }
    if (act === 'addfaktor') { var inp = document.getElementById('egenfaktor'); if (inp && inp.value.trim()) { var id = 'e' + (state.egna.length + 1); state.egna.push({ id: id, namn: inp.value.trim(), text: '' }); fd(id).med = true; save(); rerender(); } return; }
    if (t.hasAttribute('data-lage')) { state.bed[+view.step.slice(4)].lage[d('data-f')] = +d('data-lage'); save(); rerender(); return; }
    if (t.hasAttribute('data-utv')) { state.bed[+view.step.slice(4)].utv = +d('data-utv'); save(); rerender(); return; }
    if (t.hasAttribute('data-idag')) { fd(d('data-f')).idag = +d('data-idag'); save(); rerender(); return; }
    if (t.hasAttribute('data-samlad')) { state.syntes.samlad = +d('data-samlad'); save(); rerender(); return; }
    if (t.hasAttribute('data-sakerhet')) { state.syntes.sakerhet = +d('data-sakerhet'); save(); rerender(); return; }
  });
  app.addEventListener('input', function (e) {
    var t = e.target;
    if (t.hasAttribute('data-path')) { setPath(state, t.getAttribute('data-path'), t.value); save(); refreshNext(); }
  });
  app.addEventListener('change', function (e) {
    var t = e.target;
    if (t.name === 'typ') { state.meta.typ = t.value; save(); rerender(); return; }
    if (t.hasAttribute('data-faktor')) { fd(t.getAttribute('data-faktor')).med = t.checked; save(); rerender(); }
  });
  document.getElementById('file-load').addEventListener('change', function (e) {
    var f = e.target.files[0]; e.target.value = ''; if (!f) return;
    LCA.readFile(f, function (env, err) {
      if (err) { toast(err); return; }
      if (env.modul === 'tillampning' && env.data && env.data.fall !== F.id) { LCA.handOff(env); window.location.href = '?fall=' + encodeURIComponent(env.data.fall); return; }
      if (hasWork() && !(env.modul === 'tillampning') && !confirmReset()) return;
      useEnv(env);
    });
  });
  document.getElementById('brand').addEventListener('click', function (e) { e.preventDefault(); if (F) go('start'); else render(); });

  /* ---------- PDF ---------- */
  function makePDF() {
    if (!window.jspdf) { toast('PDF-funktionen kunde inte laddas.'); return; }
    var doc = new window.jspdf.jsPDF({ unit: 'mm', format: 'a4' }), L = 18, Wt = 174, PH = 297, y = 20, m = state.meta, FR = F.rapport;
    var INK = [20, 20, 20], MUT = [92, 92, 92], ACC = [20, 20, 20];
    function ensure(h) { if (y + h > PH - 20) { doc.addPage(); y = 20; } }
    function text(t, o) {
      o = o || {}; var size = o.size || 10, lh = size * 0.42 + 1.2;
      doc.setFont('helvetica', o.bold ? 'bold' : o.italic ? 'italic' : 'normal'); doc.setFontSize(size); doc.setTextColor.apply(doc, o.color || INK);
      doc.splitTextToSize(String(t), o.width || Wt).forEach(function (ln) { ensure(lh); doc.text(ln, o.x || L, y); y += lh; });
      y += o.after == null ? 2 : o.after;
    }
    function label(t, col) { ensure(10); text(t.toUpperCase(), { size: 8, bold: true, color: col || ACC, after: 1 }); }
    function rule() { ensure(6); doc.setDrawColor(220, 220, 216); doc.line(L, y, L + Wt, y); y += 6; }
    text(F.namn + ': rapport', { size: 20, bold: true, after: 1 });
    text(C.verktyg + ' · ' + C.titel, { size: 9.5, color: MUT, after: 6 });
    text(m.objekt || F.namn, { size: 15, bold: true, after: 1 });
    text((m.foretag ? m.foretag + ' · ' : '') + m.datum + ' · ' + (m.typ === 'grupp' ? 'Grupparbete' : 'Individuellt arbete') + (m.namn ? ' · ' + m.namn : ''), { size: 10, color: MUT, after: 5 });
    LCA.reportPDF(block(), text, label, L, Wt);
    rule(); label('Detaljer'); label(FR.matrisRubrik);
    valda().forEach(function (f) {
      var neg = [0, 1, 2, 3].filter(function (i) { return lage(i, f.id) < 0; }).map(scenNamn), pos = [0, 1, 2, 3].filter(function (i) { return lage(i, f.id) > 0; }).map(scenNamn);
      var fl = fallor().some(function (x) { return x.f.id === f.id; });
      text(f.namn + (fd(f.id).hos ? ' (' + fd(f.id).hos + ')' : '') + (F.nulage && idag(f.id) !== null ? ' · ' + F.nulage.kolumn + ': ' + lc(F.nulage.skala[idag(f.id)]) : '') + (fl ? ' · ' + F.nulage.markering : ''), { bold: true, size: 9.5, after: 0.5 });
      text((neg.length ? F.bedomning.lagen[0] + ' i ' + lista(neg) + '. ' : '') + (pos.length ? F.bedomning.lagen[2] + ' i ' + lista(pos) + '. ' : '') + (!neg.length && !pos.length ? F.bedomning.lagen[1] + ' i alla framtider.' : ''), { size: 9, color: MUT, after: 2 });
    });
    rule(); label(C.rapport.fyraFramtider);
    if (!state.franSense) text(C.rapport.saknadSense, { size: 9, italic: true });
    [0, 1, 2, 3].forEach(function (i) {
      var b = state.bed[i], u = b.utv;
      text(scenNamn(i) + (u !== null ? ': ' + lc(F.bedomning.utveckling[u + 1]) : ''), { bold: true, after: 0.5 });
      if (state.scen[i].text) text(state.scen[i].text, { size: 9, color: MUT, after: 0.5 });
      if (b.orsaker) text('Orsaker: ' + b.orsaker, { size: 9.5, after: 0.5 });
      if (b.atg) text('Åtgärder: ' + b.atg, { size: 9.5, after: 0.5 });
      [0].forEach(function () {
        var o = valda().map(function (f) { var x = (b.orsak[f.id] || '').trim(); return x && lage(i, f.id) !== 0 ? f.namn + ': ' + x : ''; }).filter(Boolean);
        if (o.length) text(o.join('. ') + '.', { size: 8.5, color: MUT, after: 0.5 });
      });
      y += 2;
    });
    if (state.syntes.monster.trim() || robusta().length) { rule(); label(F.syntes.rubrik); }
    if (state.syntes.monster.trim()) text(FR.monsterTitel + ': ' + state.syntes.monster, { size: 9.5 });
    if (robusta().length) { text(FR.robustaTitel, { bold: true, after: 0.5 }); robusta().forEach(function (r) { text('• ' + r, { size: 9.5, after: 0.5 }); }); y += 2; }
    if (state.syntes.osakert.trim()) text(FR.osakertTitel + ': ' + state.syntes.osakert, { size: 9.5 });
    if (state.fokusfraga) { rule(); label(C.underlag.fokus); text(state.fokusfraga, { size: 10 }); }
    rule(); label('Om bedömningen', MUT); text(F.vardeDefinition, { size: 8.5, color: MUT });
    text(LCA.TEORI.text + ': ' + LCA.TEORI.url, { size: 8.5, color: MUT });
    text(C.integritet, { size: 8, color: MUT });
    var n = doc.getNumberOfPages(), logo = document.querySelector('.footer img'); if (logo && !logo.complete) logo = null;
    for (var i = 1; i <= n; i++) { doc.setPage(i); doc.setFont('helvetica', 'normal'); doc.setFontSize(7.5); doc.setTextColor.apply(doc, MUT); doc.text(C.verktyg + ' · ' + F.namn + ' · ' + C.version + ' · ' + C.upphov, L, PH - 10); doc.text('Sida ' + i + ' av ' + n, L + Wt, PH - 10, { align: 'right' }); if (logo) { try { doc.addImage(logo, 'PNG', L + Wt - 24, PH - 13.6, 4.5, 4.5); } catch (e) {} } }
    doc.save('lca-' + F.id + '-rapport-' + LCA.slug(m.objekt || m.foretag) + '-' + m.datum + '.pdf');
  }

  document.getElementById('footer').innerHTML = '<span class="maker"><img src="../img/mickla.png" alt="Mickla" width="22" height="22">' + esc(C.upphov) + '</span><span>' + esc(C.verktyg) + ' · ' + esc(C.titel) + ' · ' + esc(C.version) + '</span>';
  if (F) { document.getElementById('brand').textContent = 'Tillämpning'; document.getElementById('brand').title = F.namn; document.title = F.namn + ' · Dialogverktyg — Learning Curve Approach'; }
  render();
  window.__till = { state: function () { return state; }, go: go, envelope: envelope, set: function (s) { state = s; save(); } };
})();
