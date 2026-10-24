/* Dialogverktyg — Learning Curve Approach: See. Statisk app, all data stannar i webbläsaren. © Engströms Mickla AB 2026 */
(function () {
  'use strict';
  var C = window.CONTENT, B = C.boost, M = C.matchup, Q = B.kvadranter || null;
  var CAPS = Q ? [].concat.apply([], Q.map(function (q) { return q.formagor; })).map(function (id) { return M.formagor.filter(function (c) { return c.id === id; })[0]; }) : M.formagor;
  function quad(id) { return Q ? Q.filter(function (q) { return q.formagor.indexOf(id) >= 0; })[0] : null; }
  var KEY = 'dialogverktyget.v1';
  var app = document.getElementById('app');
  var state = load() || fresh();
  var view = { step: 'start', compare: null, facil: [] };

  /* ---------- hjälpfunktioner ---------- */
  function fresh() {
    return { app: 'dialogverktyget', format: 1, version: B.version, skapad: new Date().toISOString(), andrad: null,
      meta: { foretag: '', datum: new Date().toISOString().slice(0, 10), typ: 'grupp', namn: '', scenarioNamn: '', scenarioText: '' },
      nivaer: {}, valda: null, motivering: '', styrkaRelevant: null, agency: {}, beslut: {}, noter: {}, styrkaNoter: ['', ''], egnaAtgarder: '', kedja: {} };
  }
  function load() { try { var s = localStorage.getItem(KEY); return s ? JSON.parse(s) : null; } catch (e) { return null; } }
  function save() { state.andrad = new Date().toISOString(); try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) {} }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function fmt(x, d) { if (x == null || isNaN(x)) return '–'; return (d === 0 ? String(Math.round(x * 2) / 2) : x.toFixed(d == null ? 1 : d)).replace('.', ','); }
  function fmtN(x) { return x == null ? '–' : (x % 1 === 0 ? String(x) : String(x).replace('.', ',')); }
  function cap(id) { return M.formagor.filter(function (c) { return c.id === id; })[0]; }
  function fill(t, map) { return t.replace(/\{(\w+|förmåga)\}/g, function (m, k) { return map[k] != null ? map[k] : m; }); }
  function mean(a) { return a.reduce(function (s, x) { return s + x; }, 0) / a.length; }
  function median(a) { var s = a.slice().sort(function (x, y) { return x - y; }); var n = s.length; return n % 2 ? s[(n - 1) / 2] : (s[n / 2 - 1] + s[n / 2]) / 2; }
  /* Stegprincipen: ett värde mellan två nivåer hör till steget från den nivå man har nått till nästa. Värdet avrundas som det visas. */
  function band(x) { var g = B.gransvarden; x = Math.round(x * 10) / 10; return x < g[0] ? 0 : x < g[1] ? 1 : x < g[2] ? 2 : 3; }
  function toast(msg) { var t = document.createElement('div'); t.className = 'toast'; t.textContent = msg; document.body.appendChild(t); setTimeout(function () { t.remove(); }, 2600); }
  function levelName(x) { var i = Math.floor(x); var n = CAPS[0].nivaer; return x % 1 ? n[i].namn + '/' + n[i + 1].namn.toLowerCase() : n[i].namn; }

  /* ---------- beräkningar ---------- */
  function allRated(s) { s = s || state; return CAPS.every(function (c) { return typeof s.nivaer[c.id] === 'number'; }); }
  function scores(s) { s = s || state; return CAPS.map(function (c) { return s.nivaer[c.id]; }); }
  function profile(s) {
    s = s || state; var v = scores(s); var mx = Math.max.apply(null, v), mn = Math.min.apply(null, v), r = mx - mn;
    var form = r < B.form.jamn ? 'jämn' : r < B.form.taggig ? 'ojämn' : 'taggig';
    var idx = mean(v);
    var om = M.omdome[band(idx)];
    return { index: idx, median: median(v), max: mx, min: mn, range: r, form: form, omdome: om };
  }
  function proposal() {
    var order = CAPS.map(function (c) { return { id: c.id, v: state.nivaer[c.id] }; }).sort(function (a, b) { return a.v - b.v || a.id - b.id; });
    var prop = order.slice(0, 3).map(function (o) { return o.id; });
    var tied = order.length > 3 && order[3].v === order[2].v ? order.filter(function (o) { return o.v === order[2].v; }).map(function (o) { return o.id; }) : [];
    return { ids: prop, tied: tied };
  }
  function strength() {
    if (!allRated() || !state.valda || !state.valda.length) return null;
    var p = profile(); var cand = CAPS.filter(function (c) { return state.valda.indexOf(c.id) < 0; }).sort(function (a, b) { return state.nivaer[b.id] - state.nivaer[a.id]; })[0];
    if (!cand) return null;
    var top = state.nivaer[cand.id]; var spike = top - p.median;
    var weakMin = Math.min.apply(null, state.valda.map(function (id) { return state.nivaer[id]; }));
    var dip = p.median - weakMin;
    if (spike >= B.styrka.overMedian && spike >= dip) return { id: cand.id, spike: spike, dip: dip };
    return null;
  }
  function sense() { return (state.kedja && state.kedja.sense) || null; }
  function senseHTML() {
    var s = sense(); if (!s || !s.kollisioner || !s.kollisioner.length) return '';
    return '<div class="note small" style="margin:16px 0 0"><b>' + esc(B.lca.kollisionerRubrik) + '</b><ul style="margin:6px 0 0;padding-left:20px">' + s.kollisioner.map(function (k) { return '<li>' + esc(k.namn) + (k.antagande ? '<span class="muted">. Utmanar: ' + esc(k.antagande) + '</span>' : '') + '</li>'; }).join('') + '</ul></div>';
  }
  function handOffEnv() { var e = window.LCA ? LCA.takeHandOff() : null; return e && (e.modul === 'sense' || e.modul === 'see' || e.modul === 'tillampning') ? e : null; }
  function weakestValda() { var v = (state.valda || []).slice().sort(function (a, b) { return state.nivaer[a] - state.nivaer[b]; }); return v[0]; }
  function agencyDone(id) { var a = state.agency[id] || {}; return B.pastaenden.every(function (p) { return typeof a[p.id] === 'number'; }); }
  function axes(id, s) {
    s = s || state; var a = s.agency[id] || {};
    function m(ids) { var v = ids.map(function (k) { return a[k]; }).filter(function (x) { return typeof x === 'number'; }); return v.length === ids.length ? mean(v) : null; }
    var r = { formaga: m(['K1', 'K2']) != null ? m(['K1', 'K2']) : s.nivaer[id] + 1, formellt: m(['F1', 'F2']), upplevt: m(['U1', 'U2']), vilja: m(['V1', 'V2']), tilltro: m(['T1']) };
    r.mandat = r.formellt != null && r.upplevt != null ? (r.formellt + r.upplevt) / 2 : null;
    return r;
  }
  function diagnosis(id, s) {
    s = s || state; var ax = axes(id, s); if (ax.mandat == null || ax.vilja == null) return null;
    var three = [['formaga', ax.formaga], ['mandat', ax.mandat], ['vilja', ax.vilja]].sort(function (a, b) { return a[1] - b[1]; });
    var weakest;
    /* Skalstegsprincipen: en skillnad räknas när den är minst ett helt skalsteg. */
    var steg = B.skalsteg || 1;
    if (three[2][1] - three[0][1] < steg) weakest = ['jamn'];
    else if (three[1][1] - three[0][1] < steg) weakest = [three[0][0], three[1][0]];
    else weakest = [three[0][0]];
    var gap = ax.formellt - ax.upplevt, glapp = null;
    if (gap >= B.glapp.grans) glapp = 'formelltStorre'; else if (-gap >= B.glapp.grans) glapp = 'upplevtStorre';
    var tg = null, td = ax.formaga - ax.tilltro;
    if (td >= B.tilltroGlapp.grans) tg = 'lagTilltro'; else if (-td >= B.tilltroGlapp.grans) tg = 'hogTilltro';
    var b = s.beslut[id], note = null;
    if (b === 'Ja' && ax.vilja <= 2.5) note = 'lagViljaJa';
    if ((b === 'Vänta' || b === 'Nej') && ax.vilja >= 4) note = 'hogViljaNej';
    var bd = band(s.nivaer[id]);
    return { ax: ax, weakest: weakest, glapp: glapp, tilltro: tg, note: note, band: bd,
      atgard: b ? cap(id).atgard[b][bd] + (B.beslut.tillagg && B.beslut.tillagg[b] ? ' ' + B.beslut.tillagg[b] : '') : null, intern: cap(id).intern[bd], extern: cap(id).extern[bd] };
  }

  /* ---------- steg ---------- */
  function steps() {
    var s = ['start', 'uppgifter'];
    CAPS.forEach(function (c) { s.push('f' + c.id); });
    s.push('profil');
    (state.valda || []).forEach(function (id) { s.push('agency-' + id); s.push('diagnos-' + id); });
    if (state.valda && strength() && state.styrkaRelevant) s.push('styrka');
    s.push('egna', 'rapport');
    return s;
  }
  function go(step) { view.step = step; if (step !== 'start' && state) { state.steg = step; save(); } render(); window.scrollTo(0, 0); app.focus({ preventScroll: true }); }
  function nav(delta) { var s = steps(); var i = s.indexOf(view.step); go(s[Math.max(0, Math.min(s.length - 1, i + delta))]); }
  function canNext() {
    var st = view.step;
    if (st[0] === 'f' && /^f\d+$/.test(st)) return typeof state.nivaer[+st.slice(1)] === 'number';
    if (st === 'profil') { var v = state.valda || []; var p = proposal().ids; var swapped = v.some(function (id) { return p.indexOf(id) < 0; }); var sg = strength(); return v.length >= 2 && v.length <= 3 && (!swapped || state.motivering.trim().length > 2) && (!sg || state.styrkaRelevant !== null); }
    if (st.indexOf('agency-') === 0) return agencyDone(+st.split('-')[1]);
    if (st.indexOf('diagnos-') === 0) return !!state.beslut[+st.split('-')[1]];
    return true;
  }

  /* ---------- spindeldiagram ---------- */
  function wrapLabel(t, n) { var w = t.split(' '), lines = [], cur = ''; w.forEach(function (x) { if ((cur + ' ' + x).trim().length > n && cur) { lines.push(cur); cur = x; } else cur = (cur + ' ' + x).trim(); }); if (cur) lines.push(cur); return lines; }
  function radarSVG(o) {
    var W = 860, H = 640, cx = 430, cy = 320, R = 185, n = CAPS.length, F = 'Helvetica, Arial, sans-serif';
    var off = Q ? Math.PI / n : 0;
    function pt(i, v) { var a = -Math.PI / 2 + off + i * 2 * Math.PI / n; return [cx + Math.cos(a) * R * v / 4, cy + Math.sin(a) * R * v / 4]; }
    var g = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="Spindeldiagram över alla förmågor" font-family="' + F + '">';
    for (var r = 1; r <= 4; r++) { var ring = []; for (var i = 0; i < n; i++) ring.push(pt(i, r).join(',')); g += '<polygon points="' + ring.join(' ') + '" fill="none" stroke="#d9d4c8" stroke-width="1"/>'; }
    for (i = 0; i < n; i++) { var e = pt(i, 4); g += '<line x1="' + cx + '" y1="' + cy + '" x2="' + e[0] + '" y2="' + e[1] + '" stroke="#e4e0d6" stroke-width="1"/>'; }
    for (r = 1; r <= 4; r++) { var lp = pt(0, r); g += '<text x="' + (lp[0] + 5) + '" y="' + (lp[1] + 4) + '" font-size="13" fill="#8a8f96">' + r + '</text>'; }
    if (Q) {
      g += '<line x1="' + cx + '" y1="' + (cy - R - 8) + '" x2="' + cx + '" y2="' + (cy + R + 8) + '" stroke="#c9c3b6" stroke-width="1.5"/><line x1="' + (cx - R - 8) + '" y1="' + cy + '" x2="' + (cx + R + 8) + '" y2="' + cy + '" stroke="#c9c3b6" stroke-width="1.5"/>';
      var qp = [[W - 16, 26, 'end'], [W - 16, H - 14, 'end'], [16, H - 14, 'start'], [16, 26, 'start']];
      Q.forEach(function (q, k) { g += '<text x="' + qp[k][0] + '" y="' + qp[k][1] + '" font-size="20" font-weight="bold" letter-spacing="2" text-anchor="' + qp[k][2] + '" fill="#2f6b5e">' + esc(q.namn.toUpperCase()) + '</text>'; });
    }
    if (o.index != null) g += '<circle cx="' + cx + '" cy="' + cy + '" r="' + (R * o.index / 4) + '" fill="none" stroke="#2f6b5e" stroke-width="1.5" stroke-dasharray="5 4"/>';
    (o.series || []).forEach(function (s) {
      var pts = s.values.map(function (v, i) { return pt(i, v == null ? 0 : v).join(','); }).join(' ');
      g += '<polygon points="' + pts + '" fill="' + (s.fill || 'none') + '" fill-opacity="' + (s.fillOpacity || 0.18) + '" stroke="' + s.color + '" stroke-width="' + (s.width || 2.5) + '"' + (s.dash ? ' stroke-dasharray="' + s.dash + '"' : '') + ' stroke-linejoin="round"/>';
      if (s.dots) s.values.forEach(function (v, i) { var p = pt(i, v); var id = i + 1; var col = (o.weak || []).indexOf(id) >= 0 ? '#b8532c' : o.strong === id ? '#a57a12' : s.color; var rr = col !== s.color ? 7 : 4; g += '<circle cx="' + p[0] + '" cy="' + p[1] + '" r="' + rr + '" fill="' + col + '" stroke="#fff" stroke-width="1.5"/>'; });
    });
    for (i = 0; i < n; i++) {
      var a = -Math.PI / 2 + off + i * 2 * Math.PI / n, lx = cx + Math.cos(a) * (R + 24), ly = cy + Math.sin(a) * (R + 24);
      var anchor = Math.abs(Math.cos(a)) < 0.2 ? 'middle' : Math.cos(a) > 0 ? 'start' : 'end';
      var lines = wrapLabel(CAPS[i].namn, 13), id = CAPS[i].id;
      var col = (o.weak || []).indexOf(id) >= 0 ? '#b8532c' : o.strong === id ? '#a57a12' : '#1d2733';
      var wgt = col !== '#1d2733' ? 'bold' : 'normal';
      var y0 = ly - (lines.length - 1) * 11 + (Math.sin(a) > 0.5 ? 12 : Math.sin(a) < -0.5 ? -8 : 6);
      lines.forEach(function (l, k) { g += '<text x="' + lx + '" y="' + (y0 + k * 23) + '" font-size="21" text-anchor="' + anchor + '" fill="' + col + '" font-weight="' + wgt + '">' + esc(l) + '</text>'; });
    }
    return g + '</svg>';
  }

  /* ---------- vyer ---------- */
  function renderStart() {
    var has = load();
    var resume = has && has.nivaer && Object.keys(has.nivaer).length ? '<div class="card"><h3>Fortsätt där ni var</h3><p class="muted small">Det finns en påbörjad körning sparad i den här webbläsaren' + (has.meta && has.meta.foretag ? ' för ' + esc(has.meta.foretag) : '') + '.</p><button class="btn" data-act="resume">Fortsätt</button></div>' : '';
    var ho = handOffEnv(), hoCard = '';
    if (ho && (ho.modul === 'sense' || ho.modul === 'tillampning')) { var sc = senseScenario(ho); hoCard = '<div class="note"><b>Underlag från ' + (ho.modul === 'sense' ? 'Sense' : 'Sense och Utvalda tillämpningar') + ' finns.</b> ' + esc(ho.organisation.namn || 'En organisation') + (sc.namn ? ', scenariot <b>' + esc(sc.namn) + '</b>' : '') + '. <span style="display:block;margin-top:10px"><button class="btn" data-act="fromhandoff">Starta med detta underlag</button> <button class="btn quiet" data-act="dropho">Nej tack</button></span></div>'; }
    else if (ho && ho.modul === 'see') hoCard = '<div class="note"><b>En sparfil från See väntar.</b> <span style="display:block;margin-top:10px"><button class="btn" data-act="fromhandoff">Öppna den</button> <button class="btn quiet" data-act="dropho">Nej tack</button></span></div>';
    return hoCard + '<div class="eyebrow">Smart Built Boost · See</div><h1>' + esc(B.titel) + '</h1><p class="lead">' + esc(B.undertitel) + '</p>' +
      '<p>' + esc(M.intro[0]) + '</p><p>' + esc(M.intro[1]) + '</p>' +
      '<div class="card tight"><b>Så går det till</b><ol class="steps-ol"><li>Ni anger vilket scenario från Sense bedömningen gäller.</li><li>Ni skattar organisationens nivå på tolv förmågor.</li><li>Ni väljer de två eller tre förmågor som behöver stärkas mest.</li><li>För dem tar ni ställning till mandat, vilja och tilltro.</li><li>Ni fattar ett beslut per förmåga och får en rapport att ta med er.</li></ol><p class="small muted" style="margin:0">Räkna med 30 till 45 minuter. Verktyget fungerar lika bra för en ledningsgrupp vid en gemensam skärm som för en enskild person.</p></div>' +
      '<div class="startgrid">' + resume +
      '<div class="card"><h3>Ny körning</h3><p class="muted small">Börja från början.</p><button class="btn" data-act="new">Starta</button></div>' +
      '<div class="card"><h3>Öppna en sparfil</h3><p class="muted small">Fortsätt en tidigare körning, eller börja från en sparfil från Sense.</p><button class="btn ghost" data-act="open">Välj fil</button></div>' +
      '<div class="card"><h3>Facilitatorläge</h3><p class="muted small">Lägg flera deltagares sparfiler ovanpå varandra.</p><button class="btn ghost" data-act="facil">Öppna</button></div>' +
      '</div><p class="note small">' + esc(B.integritet) + '</p>';
  }
  function renderMeta() {
    var m = state.meta;
    return '<div class="eyebrow">Steg 1</div><h2>Om bedömningen</h2><p class="muted">Uppgifterna hamnar i rapporten. Inget av det lämnar er dator.</p>' +
      '<div class="card"><label class="field"><span>Organisation</span><input type="text" data-meta="foretag" value="' + esc(m.foretag) + '" autocomplete="organization"></label>' +
      '<label class="field"><span>Datum</span><input type="date" data-meta="datum" value="' + esc(m.datum) + '"></label>' +
      '<span style="display:block;font-weight:600;font-size:15px;margin-bottom:6px">Vem fyller i?</span><div class="radios">' +
      ['grupp', 'individ'].map(function (t) { return '<label><input type="radio" name="typ" value="' + t + '"' + (m.typ === t ? ' checked' : '') + '> ' + (t === 'grupp' ? 'Vi gör det tillsammans som grupp' : 'Jag gör det som enskild person') + '</label>'; }).join('') + '</div>' +
      '<label class="field"><span>' + (m.typ === 'grupp' ? 'Gruppens namn, till exempel ledningsgruppen' : 'Ditt namn eller din roll') + ' <span class="muted" style="display:inline;font-weight:400">(frivilligt)</span></span><input type="text" data-meta="namn" value="' + esc(m.namn) + '"></label></div>' +
      '<div class="card"><h3 style="margin-top:0">Scenariot från Sense</h3><p class="muted small">Bedömningen gäller hur redo ni är att hantera ett bestämt scenario. Skriv in det scenario ni arbetade fram.</p>' +
      '<label class="field"><span>Scenariots namn</span><input type="text" data-meta="scenarioNamn" value="' + esc(m.scenarioNamn) + '"></label>' +
      '<label class="field" style="margin:0"><span>Kort beskrivning</span><textarea data-meta="scenarioText" rows="3">' + esc(m.scenarioText) + '</textarea></label>' + senseHTML() + '</div>';
  }
  function renderCap(id) {
    var c = cap(id), v = state.nivaer[id];
    var h = '<div class="eyebrow">' + (quad(id) ? esc(quad(id).namn) + ' · ' : '') + 'Förmåga ' + (CAPS.indexOf(c) + 1) + ' av ' + CAPS.length + '</div>' + (quad(id) && CAPS.indexOf(c) % 3 === 0 ? '<p class="note small">' + esc(quad(id).text) + '</p>' : '') + '<h2>' + esc(c.namn) + '</h2>' +
      '<div class="capmeta"><div><b>Vad</b>' + esc(c.vad) + '</div><div><b>Syfte</b>' + esc(c.syfte) + '</div></div>' +
      '<p style="margin-top:20px"><b>Var befinner sig er organisation i dag?</b></p><div class="levels">';
    c.nivaer.forEach(function (l, i) { h += '<button class="choice" data-level="' + i + '" aria-pressed="' + (v === i) + '"><span class="num">' + i + '</span><span><b>' + esc(l.namn) + '</b><span class="desc">' + esc(l.text) + '</span></span></button>'; });
    h += '</div><div class="halfsteps">Landar ni mellan två nivåer?';
    [0.5, 1.5, 2.5, 3.5].forEach(function (x) { h += '<button data-level="' + x + '" aria-pressed="' + (v === x) + '">' + fmtN(x) + '</button>'; });
    return h + '</div>';
  }
  function renderProfil() {
    var p = profile(), pr = proposal();
    if (!state.valda) { state.valda = pr.ids.slice(); save(); }
    var sg = strength();
    var h = '<div class="eyebrow">Er profil</div><h2>Formen säger mer än talet</h2>' +
      '<div class="card radar-wrap"><div class="radar">' + radarSVG({ index: p.index, series: [{ values: scores(), color: '#2f6b5e', fill: '#2f6b5e', dots: true }], weak: state.valda, strong: sg && state.styrkaRelevant ? sg.id : null }) + '</div>' +
      '<div><div class="muted small">Lärandeindex</div><div class="index-big">' + fmt(p.index) + '</div><p style="margin:6px 0 10px"><b>' + esc(p.omdome.namn) + '.</b> <span class="muted small">Profilen är ' + p.form + '.</span></p><p class="small">' + esc(B.form.texter[p.form]) + '</p><p class="small muted">' + esc(B.indexnot) + '</p>' +
      '<div class="legend"><span><i style="background:#2f6b5e"></i>Er skattning</span><span><i style="border:1.5px dashed #2f6b5e"></i>Index</span><span><i style="background:#b8532c"></i>Valda att stärka</span>' + (sg && state.styrkaRelevant ? '<span><i style="background:#a57a12"></i>Styrka</span>' : '') + '</div></div></div>';
    h += '<h3>Vilka förmågor går ni vidare med?</h3><p>' + esc(B.valtext) + '</p>';
    if (pr.tied.length) h += '<p class="note small">Flera förmågor har samma skattning på tredje plats. Välj själva bland dem som är markerade.</p>';
    h += '<div class="picklist">';
    CAPS.slice().sort(function (a, b) { return state.nivaer[a.id] - state.nivaer[b.id] || a.id - b.id; }).forEach(function (c) {
      var on = state.valda.indexOf(c.id) >= 0, prop = pr.ids.indexOf(c.id) >= 0 || pr.tied.indexOf(c.id) >= 0;
      h += '<label class="pick' + (prop ? ' proposed' : '') + '"><input type="checkbox" data-pick="' + c.id + '"' + (on ? ' checked' : '') + '><span>' + esc(c.namn) + (prop ? '<span class="tag">föreslagen</span>' : '') + '</span><span class="score">' + fmtN(state.nivaer[c.id]) + '</span></label>';
    });
    h += '</div><p class="hint">Välj två eller tre. ' + state.valda.length + ' valda.</p>';
    var swapped = state.valda.some(function (id) { return pr.ids.indexOf(id) < 0 && pr.tied.indexOf(id) < 0; });
    if (swapped) h += '<label class="field"><span>Varför har ni bytt ut en föreslagen förmåga?</span><textarea data-field="motivering" rows="2">' + esc(state.motivering) + '</textarea></label>';
    if (sg) {
      h += '<div class="note strong"><p style="margin-bottom:10px">' + esc(fill(B.styrka.fraga, { styrka: cap(sg.id).namn })) + '</p><div class="radios" style="margin:0">' +
        '<label><input type="radio" name="styrka" value="ja"' + (state.styrkaRelevant === true ? ' checked' : '') + '> Ja</label><label><input type="radio" name="styrka" value="nej"' + (state.styrkaRelevant === false ? ' checked' : '') + '> Nej</label></div></div>';
    }
    return h;
  }
  function renderAgency(id) {
    var c = cap(id), a = state.agency[id] || {}, i = state.valda.indexOf(id) + 1;
    var h = '<div class="eyebrow">Vald förmåga ' + i + ' av ' + state.valda.length + ' · Förmåga, mandat, vilja och tilltro</div><h2>' + esc(c.namn) + '</h2>' +
      '<p class="muted">Ta ställning till varje påstående med tanke på scenariot' + (state.meta.scenarioNamn ? ' <b>' + esc(state.meta.scenarioNamn) + '</b>' : '') + '.</p><div class="card">';
    B.pastaenden.forEach(function (p) {
      h += '<div class="statement"><p>' + esc(fill(p.text, { 'förmåga': c.namn.toLowerCase() })) + '</p><div class="likert" role="group">';
      B.skala.forEach(function (lbl, k) { h += '<button data-likert="' + p.id + '" data-val="' + (k + 1) + '" aria-pressed="' + (a[p.id] === k + 1) + '" aria-label="' + esc(lbl) + '"><b>' + (k + 1) + '</b>' + esc(lbl) + '</button>'; });
      h += '</div><div class="likert-labels"><span>' + esc(B.skala[0]) + '</span><span>' + esc(B.skala[4]) + '</span></div></div>';
    });
    return h + '</div>';
  }
  function axisRows(ax, weakest) {
    function row(key, label, v, sub) { var w = weakest.indexOf(key) >= 0; return '<div class="axis' + (sub ? ' sub' : '') + (w ? ' weakest' : '') + '"><span>' + label + '</span><div class="bar"><span style="width:' + ((v - 1) / 4 * 100) + '%"></span></div><span class="val">' + fmt(v) + '</span></div>'; }
    return '<div class="axes">' + row('formaga', 'Förmåga', ax.formaga) + row('mandat', 'Mandat', ax.mandat) + row('', '· formellt', ax.formellt, 1) + row('', '· upplevt', ax.upplevt, 1) + row('vilja', 'Vilja', ax.vilja) + row('tilltro', 'Tilltro', ax.tilltro) + '</div>';
  }
  function diagnosisHTML(id, d) {
    var h = '';
    d.weakest.forEach(function (k) { var t = B.svagastAxel[k]; h += '<div class="note' + (k === 'jamn' ? '' : ' weak') + '"><b>' + esc(t.rubrik) + '.</b> ' + esc(t.text) + '<br><span style="display:block;margin-top:6px">' + esc(t.shift) + '</span></div>'; });
    if (d.glapp) h += '<div class="note"><b>' + esc(B.glapp[d.glapp].rubrik) + '.</b> ' + esc(B.glapp[d.glapp].text) + '</div>';
    if (d.tilltro) h += '<div class="note">' + esc(B.tilltroGlapp[d.tilltro]) + '</div>';
    return h;
  }
  function renderDiagnos(id) {
    var c = cap(id), d = diagnosis(id), b = state.beslut[id];
    var h = '<div class="eyebrow">Diagnos och beslut</div><h2>' + esc(c.namn) + '</h2><p class="muted">Nivå ' + fmtN(state.nivaer[id]) + ', ' + esc(levelName(state.nivaer[id]).toLowerCase()) + '. Alla axlar visas på samma skala från 1 till 5.</p>' +
      '<div class="card">' + axisRows(d.ax, d.weakest) + diagnosisHTML(id, d) + '</div>';
    h += '<h3>' + esc(fill(B.beslut.fraga, { 'förmåga': c.namn.toLowerCase() })) + '</h3><div class="decisions">';
    Object.keys(B.beslut.alternativ).forEach(function (k) { h += '<button class="choice" data-beslut="' + k + '" aria-pressed="' + (b === k) + '"><span><b>' + esc(B.beslut.alternativ[k]) + '</b></span></button>'; });
    h += '</div>';
    if (b) {
      h += '<div class="card"><div class="eyebrow">Åtgärdsförslag</div><p style="margin:0">' + esc(d.atgard) + '</p></div>';
      if (d.note) h += '<div class="note weak">' + esc(B.beslut[d.note]) + '</div>';
      h += '<div class="card tight"><p class="small" style="margin-bottom:8px"><b>Internt:</b> ' + esc(d.intern) + '</p><p class="small" style="margin:0"><b>Ta hjälp med att:</b> ' + esc(d.extern) + '</p></div>';
      h += '<label class="field"><span>Anteckningar <span class="muted" style="display:inline;font-weight:400">(frivilligt, kommer med i rapporten)</span></span><textarea data-note="' + id + '" rows="3">' + esc(state.noter[id] || '') + '</textarea></label>';
    }
    return h;
  }
  function renderStyrka() {
    var sg = strength(), map = { styrka: cap(sg.id).namn.toLowerCase(), svag: cap(weakestValda()).namn.toLowerCase() };
    var h = '<div class="eyebrow">En tydlig styrka</div><h2>' + esc(cap(sg.id).namn) + '</h2><p>Den här förmågan sticker ut i er profil, och ni bedömer att den har betydelse för scenariot. En styrka kan bära förändring, men den kan också göra er för säkra. Samtala om båda frågorna.</p>';
    B.styrka.dialog.forEach(function (q, i) { h += '<label class="field"><span>' + esc(fill(q, map)) + '</span><textarea data-snote="' + i + '" rows="3">' + esc(state.styrkaNoter[i]) + '</textarea></label>'; });
    return h;
  }
  function renderEgna() {
    return '<div class="eyebrow">Sista steget</div><h2>Egna förslag på åtgärder</h2><p class="muted">Vad tar ni med er härifrån? Skriv gärna vem som gör vad och när.</p><textarea data-field="egnaAtgarder" rows="7">' + esc(state.egnaAtgarder) + '</textarea>';
  }
  function summary() {
    var S = B.sammanfattning, p = profile(), sg = strength(), m = state.meta, plain = [], keys = [], recs = [];
    var axName = { formaga: 'Förmåga', mandat: 'Mandat', vilja: 'Vilja' };
    var org = m.foretag || 'Organisationen';
    plain.push(m.scenarioNamn ? fill(S.inledning, { org: org, scenario: m.scenarioNamn }) : fill(S.inledningUtanScenario, { org: org }));
    plain.push(S.niva[band(p.index)] + ' ' + S.form[p.form]);
    var names = state.valda.map(function (id) { return cap(id).namn.toLowerCase(); });
    plain.push(fill(S.valda, { lista: names.length > 1 ? names.slice(0, -1).join(', ') + ' och ' + names[names.length - 1] : names[0] }));
    var analys = [], count = {};
    state.valda.forEach(function (id) { var d = diagnosis(id); if (d) d.weakest.forEach(function (k) { if (k !== 'jamn') count[k] = (count[k] || 0) + 1; }); });
    var top = Object.keys(count).sort(function (a, b) { return count[b] - count[a]; })[0];
    var shared = top && count[top] >= 2;
    if (shared) analys.push(fill(S.hinderGemensamt, { hinder: S.hinder[top] }) + ' ' + B.svagastAxel[top].shift);
    else if (state.valda.length > 1) analys.push(S.hinderOlika);
    state.valda.forEach(function (id) {
      var d = diagnosis(id); if (!d) return;
      var t = d.weakest.map(function (k) { return B.svagastAxel[k].rubrik; }).join('. ') + '.';
      if (d.glapp) t += ' ' + B.glapp[d.glapp].rubrik + '.';
      analys.push({ titel: cap(id).namn + ' (nivå ' + fmtN(state.nivaer[id]) + ')', text: t.replace(/\.\./g, '.') });
    });
    if (sg && state.styrkaRelevant) analys.push(fill(S.styrka, { styrka: cap(sg.id).namn.toLowerCase() }));
    keys.push('Lärandeindex: ' + fmt(p.index) + ' av 4 (' + p.omdome.namn.toLowerCase() + ').');
    keys.push('Profilens form: ' + p.form + ' (skillnad mellan högsta och lägsta skattning: ' + fmtN(p.range) + ').');
    if (shared) keys.push(fill(S.monster, { axel: axName[top], n: count[top], m: state.valda.length }));
    state.valda.forEach(function (id) {
      var d = diagnosis(id); if (!d) return;
      var lead = shared && d.weakest.indexOf(top) >= 0 ? '' : B.svagastAxel[d.weakest[0]].shift;
      recs.push({ titel: cap(id).namn + (state.beslut[id] ? ' (' + state.beslut[id].toLowerCase() + ')' : ''), text: ((d.atgard ? d.atgard + ' ' : '') + lead).trim() });
    });
    if (recs.length < 3 && sg && state.styrkaRelevant) recs.push({ titel: cap(sg.id).namn + ' (styrka)', text: fill(S.recStyrka, { styrka: cap(sg.id).namn.toLowerCase(), svag: cap(weakestValda()).namn.toLowerCase() }) });
    recs = recs.slice(0, 3); recs.push({ titel: B.lca.nastaForslagTitel, text: B.lca.nastaForslag });
    return { plain: plain, analys: analys.concat(keys), keys: keys, recs: recs, block: { sammanfattning: [plain.join(' ')], analys: analys.concat(keys), analysNot: S.nyckeltalHanvisning, forslag: recs } };
  }
  function summaryHTML() { return LCA.reportBlock(summary().block); }
  function guideHTML() {
    var S = B.sammanfattning;
    return '<h3>' + esc(S.lasRubrik) + '</h3><div class="card tight">' + S.las.map(function (g) { return '<p class="small"><b>' + esc(g.term) + '.</b> ' + esc(g.text) + '</p>'; }).join('') + '</div>';
  }
  function reportHTML() {
    var p = profile(), sg = strength(), m = state.meta;
    var series = [{ values: scores(), color: '#2f6b5e', fill: '#2f6b5e', dots: true }];
    if (view.compare) series.unshift({ values: scores(view.compare), color: '#8a8f96', fill: 'none', width: 2, dash: '6 5' });
    var h = '<div class="eyebrow">Rapport</div><h2>' + esc(m.foretag || 'Er organisation') + '</h2><p class="muted">' + esc(m.datum) + ' · ' + (m.typ === 'grupp' ? 'Gruppbedömning' : 'Individuell bedömning') + (m.namn ? ' · ' + esc(m.namn) : '') + '</p>';
    if (m.scenarioNamn || m.scenarioText) h += '<div class="card tight"><div class="eyebrow">Scenario</div><b>' + esc(m.scenarioNamn) + '</b><p class="small" style="margin:4px 0 0">' + esc(m.scenarioText) + '</p>' + senseHTML() + '</div>';
    h += '<div class="actions" style="margin:0 0 18px"><button class="btn" data-act="pdf">Ladda ner rapport (PDF)</button><button class="btn ghost" data-act="savefile">Spara sparfil</button><button class="btn ghost" data-act="compare">' + (view.compare ? 'Byt jämförelse' : 'Jämför med tidigare körning') + '</button></div>';
    h += summaryHTML();
    h += '<div class="card radar-wrap"><div class="radar">' + radarSVG({ index: p.index, series: series, weak: state.valda, strong: sg && state.styrkaRelevant ? sg.id : null }) + '</div><div><div class="muted small">Lärandeindex</div><div class="index-big">' + fmt(p.index) + '</div><p style="margin:6px 0 10px"><b>' + esc(p.omdome.namn) + '.</b> ' + esc(p.omdome.text) + '</p><p class="small">' + esc(B.form.texter[p.form]) + '</p>' +
      (view.compare ? '<p class="small muted">Streckad grå kontur: körningen ' + esc(view.compare.meta.datum) + ', index ' + fmt(profile(view.compare).index) + '.</p>' : '') + '</div></div>';
    if (state.motivering) h += '<p class="small"><b>Motivering till val:</b> ' + esc(state.motivering) + '</p>';
    state.valda.forEach(function (id) {
      var d = diagnosis(id); if (!d) return;
      h += '<div class="card"><div class="eyebrow">Vald förmåga</div><h3 style="margin-top:0">' + esc(cap(id).namn) + '</h3><p class="small muted">Nivå ' + fmtN(state.nivaer[id]) + ', ' + esc(levelName(state.nivaer[id]).toLowerCase()) + '.</p>' + axisRows(d.ax, d.weakest) + diagnosisHTML(id, d) +
        (state.beslut[id] ? '<p><b>Beslut:</b> ' + esc(B.beslut.alternativ[state.beslut[id]]) + '.</p><p><b>Åtgärdsförslag:</b> ' + esc(d.atgard) + '</p>' : '') + (d.note ? '<p class="note weak small">' + esc(B.beslut[d.note]) + '</p>' : '') +
        '<p class="small"><b>Internt:</b> ' + esc(d.intern) + '</p><p class="small"><b>Ta hjälp med att:</b> ' + esc(d.extern) + '</p>' + (state.noter[id] ? '<p class="small"><b>Anteckningar:</b> ' + esc(state.noter[id]) + '</p>' : '') + '</div>';
    });
    if (sg && state.styrkaRelevant) {
      var map = { styrka: cap(sg.id).namn.toLowerCase(), svag: cap(weakestValda()).namn.toLowerCase() };
      h += '<div class="card"><div class="eyebrow" style="color:#a57a12">Styrka</div><h3 style="margin-top:0">' + esc(cap(sg.id).namn) + '</h3>' + B.styrka.dialog.map(function (q, i) { return '<p class="small"><b>' + esc(fill(q, map)) + '</b><br>' + esc(state.styrkaNoter[i] || '') + '</p>'; }).join('') + '</div>';
    }
    if (state.egnaAtgarder) h += '<div class="card"><div class="eyebrow">Egna förslag på åtgärder</div><p style="white-space:pre-wrap;margin:0">' + esc(state.egnaAtgarder) + '</p></div>';
    h += '<h3>Övriga förmågor</h3><div class="card tight">' + CAPS.filter(function (c) { return state.valda.indexOf(c.id) < 0; }).map(function (c) { return '<p class="small"><b>' + esc(c.namn) + ' (' + fmtN(state.nivaer[c.id]) + '):</b> ' + esc(c.intern[band(state.nivaer[c.id])]) + '</p>'; }).join('') + '</div>';
    h += guideHTML() + LCA.teoriHTML();
    h += '<div class="card tight"><div class="eyebrow">' + esc(B.lca.nastaRubrik) + '</div><p class="small" style="margin:0">' + esc(B.lca.nastaText) + '</p><div class="actions" style="margin-top:12px"><button class="btn" data-act="toshift">' + esc(B.lca.tillShift) + ' →</button><button class="btn ghost" data-act="savefile">Spara sparfil</button><a class="btn quiet" href="../">' + esc(B.lca.tillLanding) + '</a></div></div>';
    h += '<div class="actions"><button class="btn quiet" data-act="restart">Börja om med en ny körning</button></div>';
    return h;
  }
  function renderFacil() {
    var f = view.facil, colors = ['#2f6b5e', '#b8532c', '#3d5a99', '#a57a12', '#7a4e8c', '#4f8a3a', '#c0396b', '#5d6773'];
    var h = '<div class="eyebrow">Facilitatorläge</div><h2>Gruppens profiler</h2><p class="muted">Lägg in deltagarnas sparfiler. Inget sparas efteråt.</p><div class="actions" style="margin:0 0 18px"><button class="btn" data-act="faciladd">Lägg till sparfiler</button>' + (f.length ? '<button class="btn ghost" data-act="facilclear">Töm</button>' : '') + '<span class="spacer"></span><button class="btn quiet" data-act="home">Till startsidan</button></div>';
    if (!f.length) return h + '<p class="note">Inga filer inlagda ännu.</p>';
    var series = f.map(function (s, i) { return { values: scores(s), color: colors[i % colors.length], fill: 'none', width: 2 }; });
    h += '<div class="card"><div class="radar" style="max-width:640px;margin:0 auto">' + radarSVG({ series: series }) + '</div><div class="legend">' + f.map(function (s, i) { return '<span><i style="background:' + colors[i % colors.length] + '"></i>' + esc(s.meta.namn || s.meta.foretag || 'Deltagare ' + (i + 1)) + '</span>'; }).join('') + '</div></div>';
    h += '<h3>Skattningar och spridning</h3><p class="small muted">Rader med en spridning på ett helt steg eller mer är markerade. Oenighet är ett resultat i sig och ett bra samtalsämne.</p><div class="tablewrap"><table class="facil"><thead><tr><th>Förmåga</th>' + f.map(function (s, i) { return '<th class="n">' + (i + 1) + '</th>'; }).join('') + '<th class="n">Spridning</th><th class="n">Vald av</th></tr></thead><tbody>';
    CAPS.forEach(function (c) {
      var v = f.map(function (s) { return s.nivaer[c.id]; }).filter(function (x) { return typeof x === 'number'; });
      var sp = v.length ? Math.max.apply(null, v) - Math.min.apply(null, v) : 0;
      var nv = f.filter(function (s) { return (s.valda || []).indexOf(c.id) >= 0; }).length;
      h += '<tr' + (sp >= (B.skalsteg || 1) ? ' class="spread"' : '') + '><td>' + esc(c.namn) + '</td>' + f.map(function (s) { return '<td class="n">' + fmtN(s.nivaer[c.id]) + '</td>'; }).join('') + '<td class="n">' + fmtN(sp) + '</td><td class="n">' + nv + '</td></tr>';
    });
    return h + '</tbody></table></div>';
  }

  /* ---------- rendering ---------- */
  function render() {
    var st = view.step, html = '', s = steps(), i = s.indexOf(st);
    if (st === 'start') html = renderStart();
    else if (st === 'facil') html = renderFacil();
    else if (st === 'uppgifter') html = renderMeta();
    else if (/^f\d+$/.test(st)) html = renderCap(+st.slice(1));
    else if (st === 'profil') html = renderProfil();
    else if (st.indexOf('agency-') === 0) html = renderAgency(+st.split('-')[1]);
    else if (st.indexOf('diagnos-') === 0) html = renderDiagnos(+st.split('-')[1]);
    else if (st === 'styrka') html = renderStyrka();
    else if (st === 'egna') html = renderEgna();
    else if (st === 'rapport') html = reportHTML();
    if (st !== 'start' && st !== 'facil' && st !== 'rapport') {
      var nxt = s[i + 1] === 'rapport' ? 'Visa rapporten' : 'Nästa';
      html += '<div class="navrow"><button class="btn quiet" data-act="back">← Tillbaka</button><span class="hint" id="nexthint"></span><button class="btn quiet savebtn" data-act="savefile" title="Ladda ner en sparfil så att arbetet inte går förlorat">Spara sparfil</button><button class="btn" data-act="next"' + (canNext() ? '' : ' disabled') + '>' + nxt + ' →</button></div>';
    }
    app.innerHTML = html;
    var pct = st === 'start' || st === 'facil' ? 0 : Math.round(i / (s.length - 1) * 100);
    document.getElementById('progress-bar').style.width = pct + '%';
  }
  function refreshNext() { var b = app.querySelector('[data-act=next]'); if (b) b.disabled = !canNext(); }

  /* ---------- händelser ---------- */
  app.addEventListener('click', function (e) {
    var t = e.target.closest('button'); if (!t) return;
    var act = t.getAttribute('data-act');
    if (act === 'next') { if (canNext()) nav(1); return; }
    if (act === 'back') { nav(-1); return; }
    if (act === 'new') { if (!load() || confirmReset()) { state = fresh(); save(); go('uppgifter'); } return; }
    if (act === 'resume') { state = load(); go(state.steg && state.steg !== 'start' && steps().indexOf(state.steg) >= 0 ? state.steg : resumeStep()); return; }
    if (act === 'open') { document.getElementById('file-load').click(); return; }
    if (act === 'facil') { go('facil'); return; }
    if (act === 'faciladd') { document.getElementById('file-facil').click(); return; }
    if (act === 'facilclear') { view.facil = []; render(); return; }
    if (act === 'home') { go('start'); return; }
    if (act === 'fromhandoff') { var ho = handOffEnv(); if (ho && (!load() || confirmReset())) { LCA.clearHandOff(); useEnv(ho); } return; }
    if (act === 'dropho') { LCA.clearHandOff(); render(); return; }
    if (act === 'savefile') { saveFile(); return; }
    if (act === 'toshift') { LCA.handOff(envelope()); window.location.href = '../shift/'; return; }
    if (act === 'compare') { document.getElementById('file-compare').click(); return; }
    if (act === 'pdf') { makePDF(); return; }
    if (act === 'restart') { if (confirmReset()) { state = fresh(); save(); view.compare = null; go('start'); } return; }
    if (t.hasAttribute('data-level')) { var id = +view.step.slice(1); state.nivaer[id] = +t.getAttribute('data-level'); state.valda = null; state.styrkaRelevant = null; save(); render(); return; }
    if (t.hasAttribute('data-likert')) { var cid = +view.step.split('-')[1]; state.agency[cid] = state.agency[cid] || {}; state.agency[cid][t.getAttribute('data-likert')] = +t.getAttribute('data-val'); save(); var y = window.scrollY; render(); window.scrollTo(0, y); return; }
    if (t.hasAttribute('data-beslut')) { var bid = +view.step.split('-')[1]; state.beslut[bid] = t.getAttribute('data-beslut'); save(); var y2 = window.scrollY; render(); window.scrollTo(0, y2); return; }
  });
  app.addEventListener('input', function (e) {
    var t = e.target;
    if (t.hasAttribute('data-meta')) { state.meta[t.getAttribute('data-meta')] = t.value; save(); }
    else if (t.hasAttribute('data-field')) { state[t.getAttribute('data-field')] = t.value; save(); refreshNext(); }
    else if (t.hasAttribute('data-note')) { state.noter[t.getAttribute('data-note')] = t.value; save(); }
    else if (t.hasAttribute('data-snote')) { state.styrkaNoter[+t.getAttribute('data-snote')] = t.value; save(); }
  });
  app.addEventListener('change', function (e) {
    var t = e.target;
    if (t.name === 'typ') { state.meta.typ = t.value; save(); render(); }
    else if (t.name === 'styrka') { state.styrkaRelevant = t.value === 'ja'; save(); var y = window.scrollY; render(); window.scrollTo(0, y); }
    else if (t.hasAttribute('data-pick')) {
      var id = +t.getAttribute('data-pick'), v = state.valda;
      if (t.checked) { if (v.length >= 3) { t.checked = false; toast('Välj högst tre förmågor. Avmarkera en först.'); return; } v.push(id); }
      else v.splice(v.indexOf(id), 1);
      v.sort(function (a, b) { return state.nivaer[a] - state.nivaer[b] || a - b; });
      state.styrkaRelevant = null; save(); var y3 = window.scrollY; render(); window.scrollTo(0, y3);
    }
  });
  document.getElementById('brand').addEventListener('click', function (e) { e.preventDefault(); go('start'); });
  function confirmReset() { return window.confirm('Den påbörjade körningen i den här webbläsaren ersätts. Spara en sparfil först om ni vill behålla den. Fortsätta?'); }
  function resumeStep() {
    if (!allRated()) { var c = CAPS.filter(function (c) { return typeof state.nivaer[c.id] !== 'number'; })[0]; return Object.keys(state.nivaer).length ? 'f' + c.id : 'uppgifter'; }
    if (!state.valda) return 'profil';
    for (var i = 0; i < state.valda.length; i++) { var id = state.valda[i]; if (!agencyDone(id)) return 'agency-' + id; if (!state.beslut[id]) return 'diagnos-' + id; }
    return 'rapport';
  }

  /* ---------- filer ---------- */
  function slug(s) { return (s || 'organisation').toLowerCase().replace(/[åä]/g, 'a').replace(/ö/g, 'o').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'organisation'; }
  /* Det See lämnar vidare till Shift och slutsidan (se CLAUDE.md, Gemensamt sparformat). */
  function lamnar() {
    var m = state.meta, out = { scenario: { namn: m.scenarioNamn || '', text: m.scenarioText || '' } };
    if (!allRated()) return out;
    var p = profile(); out.index = Math.round(p.index * 100) / 100; out.form = p.form; out.omdome = p.omdome.namn;
    out.nivaer = CAPS.map(function (c) { return { id: c.id, namn: c.namn, falt: quad(c.id) ? quad(c.id).namn : '', niva: state.nivaer[c.id] }; });
    out.valda = (state.valda || []).map(function (id) {
      var d = diagnosis(id), o = { id: id, namn: cap(id).namn, niva: state.nivaer[id], beslut: state.beslut[id] || null };
      if (d) { o.axlar = { formaga: d.ax.formaga, mandat: d.ax.mandat, formellt: d.ax.formellt, upplevt: d.ax.upplevt, vilja: d.ax.vilja, tilltro: d.ax.tilltro }; o.svagastAxel = d.weakest; o.atgard = d.atgard; }
      return o;
    });
    var sg = state.valda ? strength() : null;
    out.styrka = sg && state.styrkaRelevant ? { id: sg.id, namn: cap(sg.id).namn } : null;
    out.egnaAtgarder = state.egnaAtgarder || '';
    return out;
  }
  function envelope() {
    return LCA.wrap({ modul: 'see', version: B.version, skapad: state.skapad, organisation: { namn: state.meta.foretag, typ: state.meta.typ, deltagare: state.meta.namn }, data: state, lamnar: lamnar(), kedja: state.kedja || {} });
  }
  function saveFile() { var env = envelope(); LCA.download(env, LCA.fileName(env)); toast('Sparfilen är nedladdad.'); }
  /* Läser in ett kuvert: en See-körning öppnas, en Sense-körning blir underlag för en ny körning. */
  function senseScenario(env) { return (env.modul === 'sense' ? env.lamnar && env.lamnar.scenario : env.kedja && env.kedja.sense && env.kedja.sense.scenario) || {}; }
  function useEnv(env) {
    if (env.modul === 'see') { state = env.data; state.kedja = env.kedja || state.kedja || {}; save(); go(resumeStep()); return; }
    if (env.modul === 'sense' || env.modul === 'tillampning') {
      var sc = senseScenario(env);
      state = fresh(); state.kedja = LCA.chainFrom(env);
      state.meta.foretag = env.organisation.namn || ''; state.meta.typ = env.organisation.typ || 'grupp'; state.meta.namn = env.organisation.deltagare || '';
      state.meta.scenarioNamn = sc.namn || ''; state.meta.scenarioText = sc.text || '';
      save(); toast(env.modul === 'sense' ? 'Scenariot från Sense är inläst.' : 'Underlaget från Sense och Utvalda tillämpningar är inläst.'); go('uppgifter'); return;
    }
    toast(B.lca.felModul.replace('{modul}', LCA.NAMN[env.modul] || env.modul));
  }
  function readFiles(files, cb, any) {
    var out = [], n = files.length; if (!n) return;
    Array.prototype.forEach.call(files, function (f) {
      LCA.readFile(f, function (env, err) {
        if (err) toast(err);
        else if (any) out.push(env);
        else if (env.modul === 'see') out.push(env.data);
        else toast(f.name + ' är en sparfil från ' + LCA.NAMN[env.modul] + ', inte från See.');
        if (--n === 0) cb(out);
      });
    });
  }
  document.getElementById('file-load').addEventListener('change', function (e) { readFiles(e.target.files, function (d) { if (d[0]) { if (load() && load().nivaer && Object.keys(load().nivaer).length && d[0].modul !== 'see' && !confirmReset()) return; useEnv(d[0]); } }, true); e.target.value = ''; });
  document.getElementById('file-compare').addEventListener('change', function (e) { readFiles(e.target.files, function (d) { if (d[0]) { if (!allRated(d[0])) { toast('Den filen innehåller ingen fullständig skattning.'); return; } view.compare = d[0]; render(); } }); e.target.value = ''; });
  document.getElementById('file-facil').addEventListener('change', function (e) { readFiles(e.target.files, function (d) { view.facil = view.facil.concat(d.filter(function (x) { return allRated(x); })); render(); }); e.target.value = ''; });

  /* ---------- PDF ---------- */
  function makePDF() {
    if (!window.jspdf) { toast('PDF-funktionen kunde inte laddas.'); return; }
    var doc = new window.jspdf.jsPDF({ unit: 'mm', format: 'a4' });
    var L = 18, Wt = 174, y = 20, PH = 297, p = profile(), sg = strength(), m = state.meta;
    var INK = [29, 39, 51], MUT = [93, 103, 115], ACC = [47, 107, 94], WEAK = [184, 83, 44], STR = [165, 122, 18];
    function ensure(h) { if (y + h > PH - 20) { doc.addPage(); y = 20; } }
    function text(t, o) {
      o = o || {}; var size = o.size || 10, lh = size * 0.42 + (o.lh || 1.2);
      doc.setFont('helvetica', o.bold ? 'bold' : o.italic ? 'italic' : 'normal'); doc.setFontSize(size); doc.setTextColor.apply(doc, o.color || INK);
      var lines = doc.splitTextToSize(String(t), o.width || Wt);
      lines.forEach(function (ln) { ensure(lh); doc.text(ln, (o.x || L), y); y += lh; });
      y += o.after == null ? 2 : o.after;
    }
    function label(t, col) { ensure(10); text(t.toUpperCase(), { size: 8, bold: true, color: col || ACC, after: 1 }); }
    function rule() { ensure(6); doc.setDrawColor(221, 216, 205); doc.line(L, y, L + Wt, y); y += 6; }
    function bars(ax, weakest) {
      [['formaga', 'Förmåga', ax.formaga], ['mandat', 'Mandat', ax.mandat], ['', '  formellt', ax.formellt], ['', '  upplevt', ax.upplevt], ['vilja', 'Vilja', ax.vilja], ['tilltro', 'Tilltro', ax.tilltro]].forEach(function (r) {
        ensure(6); var sub = !r[0] && r[1].indexOf('  ') === 0;
        doc.setFont('helvetica', 'normal'); doc.setFontSize(sub ? 8.5 : 10); doc.setTextColor.apply(doc, sub ? MUT : INK); doc.text(r[1], L, y);
        doc.setFillColor(236, 234, 228); doc.rect(L + 26, y - 3, 110, sub ? 2 : 3.2, 'F');
        var col = weakest.indexOf(r[0]) >= 0 ? WEAK : sub ? [159, 184, 176] : ACC; doc.setFillColor.apply(doc, col); doc.rect(L + 26, y - 3, 110 * (r[2] - 1) / 4, sub ? 2 : 3.2, 'F');
        doc.text(fmt(r[2]), L + 142, y); y += sub ? 5 : 6;
      }); y += 2;
    }
    text(B.titel + ': rapport', { size: 22, bold: true, after: 1 });
    text(B.verktyg, { size: 9, color: MUT, after: 2 });
    text(B.undertitel, { size: 10.5, color: MUT, after: 6 });
    text((m.foretag || 'Er organisation'), { size: 15, bold: true, after: 1 });
    text(m.datum + ' · ' + (m.typ === 'grupp' ? 'Gruppbedömning' : 'Individuell bedömning') + (m.namn ? ' · ' + m.namn : ''), { size: 10, color: MUT, after: 5 });
    if (m.scenarioNamn || m.scenarioText) { label('Scenario'); if (m.scenarioNamn) text(m.scenarioNamn, { bold: true, after: 1 }); if (m.scenarioText) text(m.scenarioText, { after: 4 }); }
    var sn = sense(); if (sn && sn.kollisioner && sn.kollisioner.length) { label(B.lca.kollisionerRubrik); sn.kollisioner.forEach(function (k) { text('• ' + k.namn + (k.antagande ? '. Utmanar: ' + k.antagande : ''), { size: 9.5, after: 1 }); }); y += 3; }
    LCA.reportPDF(summary().block, text, label, L, Wt);
    rule(); ensure(140);
    label('Detaljer'); label('Profil');
    var series = [{ values: scores(), color: '#2f6b5e', fill: '#2f6b5e', dots: true }];
    if (view.compare) series.unshift({ values: scores(view.compare), color: '#8a8f96', fill: 'none', width: 2, dash: '6 5' });
    var holder = document.createElement('div'); holder.style.cssText = 'position:absolute;left:-9999px;top:0;width:860px'; holder.innerHTML = radarSVG({ index: p.index, series: series, weak: state.valda, strong: sg && state.styrkaRelevant ? sg.id : null }); document.body.appendChild(holder);
    var svgEl = holder.querySelector('svg'); svgEl.setAttribute('width', '860'); svgEl.setAttribute('height', '640');
    ensure(130);
    var y0 = y;
    doc.svg(svgEl, { x: L - 6, y: y, width: 134, height: 100 }).then(function () {
      holder.remove();
      var rx = L + 128, ry = y0 + 14;
      doc.setFont('helvetica', 'normal'); doc.setFontSize(9); doc.setTextColor.apply(doc, MUT); doc.text('Lärandeindex', rx, ry);
      doc.setFont('helvetica', 'bold'); doc.setFontSize(30); doc.setTextColor.apply(doc, ACC); doc.text(fmt(p.index), rx, ry + 12);
      doc.setFontSize(10); doc.setTextColor.apply(doc, INK); doc.text(p.omdome.namn, rx, ry + 20);
      doc.setFont('helvetica', 'normal'); doc.setFontSize(9); doc.setTextColor.apply(doc, MUT);
      doc.text(doc.splitTextToSize('Profilen är ' + p.form + '. ' + (view.compare ? 'Grå streckad kontur: körningen ' + view.compare.meta.datum + ', index ' + fmt(profile(view.compare).index) + '.' : ''), 46), rx, ry + 27);
      y = y0 + 112;
      text(p.omdome.namn + '. ' + p.omdome.text, { size: 10 });
      text(B.form.texter[p.form] + ' ' + B.indexnot, { size: 9.5, color: MUT, after: 5 });
      if (state.motivering) text('Motivering till val av förmågor: ' + state.motivering, { size: 9.5, italic: true, after: 4 });
      state.valda.forEach(function (id) {
        var d = diagnosis(id); if (!d) return;
        rule(); ensure(40); label('Vald förmåga', WEAK);
        text(cap(id).namn, { size: 14, bold: true, after: 1 });
        text('Nivå ' + fmtN(state.nivaer[id]) + ', ' + levelName(state.nivaer[id]).toLowerCase() + '. Alla axlar på skala 1 till 5.', { size: 9, color: MUT, after: 3 });
        bars(d.ax, d.weakest);
        d.weakest.forEach(function (k) { var t = B.svagastAxel[k]; text(t.rubrik + '.', { bold: true, after: 0.5 }); text(t.text + ' ' + t.shift, { size: 9.5, after: 3 }); });
        if (d.glapp) { text(B.glapp[d.glapp].rubrik + '.', { bold: true, after: 0.5 }); text(B.glapp[d.glapp].text, { size: 9.5, after: 3 }); }
        if (d.tilltro) text(B.tilltroGlapp[d.tilltro], { size: 9.5, after: 3 });
        if (state.beslut[id]) { text('Beslut: ' + B.beslut.alternativ[state.beslut[id]] + '.', { bold: true, after: 0.5 }); text('Åtgärdsförslag: ' + d.atgard, { size: 9.5, after: 3 }); }
        if (d.note) text(B.beslut[d.note], { size: 9.5, italic: true, color: WEAK, after: 3 });
        text('Internt: ' + d.intern, { size: 9.5, after: 1 }); text('Ta hjälp med att: ' + d.extern, { size: 9.5, after: 3 });
        if (state.noter[id]) text('Anteckningar: ' + state.noter[id], { size: 9.5, italic: true, after: 3 });
      });
      if (sg && state.styrkaRelevant) {
        var map = { styrka: cap(sg.id).namn.toLowerCase(), svag: cap(weakestValda()).namn.toLowerCase() };
        rule(); label('Styrka', STR); text(cap(sg.id).namn, { size: 14, bold: true, after: 2 });
        B.styrka.dialog.forEach(function (q, i) { text(fill(q, map), { bold: true, size: 10, after: 0.5 }); text(state.styrkaNoter[i] || '(inga anteckningar)', { size: 9.5, color: state.styrkaNoter[i] ? INK : MUT, after: 3 }); });
      }
      if (state.egnaAtgarder) { rule(); label('Egna förslag på åtgärder'); text(state.egnaAtgarder, { size: 10 }); }
      rule(); label('Övriga förmågor');
      CAPS.filter(function (c) { return state.valda.indexOf(c.id) < 0; }).forEach(function (c) { text(c.namn + ' (' + fmtN(state.nivaer[c.id]) + '): ' + c.intern[band(state.nivaer[c.id])], { size: 9, after: 1.5 }); });
      rule(); label(B.sammanfattning.lasRubrik); B.sammanfattning.las.forEach(function (g) { text(g.term + '.', { size: 9.5, bold: true, after: 0.3 }); text(g.text, { size: 9, after: 2 }); });
      rule(); label('Om verktyget', MUT); text(M.intro[1] + ' ' + B.integritet, { size: 8.5, color: MUT }); text(LCA.TEORI.text + ': ' + LCA.TEORI.url, { size: 8.5, color: MUT });
      var n = doc.getNumberOfPages(), logo = document.querySelector('.footer img');
      if (logo && !logo.complete) logo = null;
      for (var i = 1; i <= n; i++) { doc.setPage(i); doc.setFont('helvetica', 'normal'); doc.setFontSize(7.5); doc.setTextColor.apply(doc, MUT); doc.text(B.verktyg + ' · ' + B.titel + ' · ' + B.version + ' · ' + B.upphov, L, PH - 10); doc.text('Sida ' + i + ' av ' + n, L + Wt, PH - 10, { align: 'right' }); if (logo) { try { doc.addImage(logo, 'PNG', L + Wt - 24, PH - 13.6, 4.5, 4.5); } catch (e) {} } }
      doc.save('lca-see-rapport-' + slug(m.foretag) + '-' + m.datum + '.pdf');
    }).catch(function (err) { holder.remove(); console.error(err); toast('Rapporten kunde inte skapas. Försök igen.'); });
  }

  document.getElementById('footer').innerHTML = '<span class="maker"><img src="../img/mickla.png" alt="Mickla" width="22" height="22">' + esc(B.upphov) + '</span><span>' + esc(B.verktyg) + ' · ' + esc(B.titel) + ' · ' + esc(B.version) + '</span>';
  render();
  window.__dv = { state: function () { return state; }, go: go, set: function (s) { state = s; save(); }, envelope: envelope };
})();
