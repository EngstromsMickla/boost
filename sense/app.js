/* Dialogverktyg — Learning Curve Approach: Sense (Collision Compass).
   Statisk app, all data stannar i webbläsaren. © Engströms Mickla AB 2026 */
(function () {
  'use strict';
  var C = window.CONTENT;
  var KEY = LCA.NYCKLAR.sense;
  var app = document.getElementById('app');
  var state = load() || fresh();
  var view = { step: 'start', parkOpen: false };

  /* ---------- hjälpfunktioner ---------- */
  function fresh() {
    return { app: 'sense', format: 1, version: C.version, skapad: new Date().toISOString(), andrad: null,
      meta: { foretag: '', datum: new Date().toISOString().slice(0, 10), typ: 'grupp', namn: '' },
      fokus: { utmaningar: [], egen: '', fraga: '', fragaAndrad: false, horisont: 10 },
      trender: [], nextId: 1, seedade: [], bed: {}, urval: null, m: {},
      axlar: { val: null, motivering: '', and: {} },
      scen: [0, 1, 2, 3].map(function () { return { namn: '', text: '' }; }),
      varden: {}, egnaVarden: [],
      vind: [0, 1, 2, 3].map(function () { return { lage: {}, orsak: {}, utv: null, atg: '' }; }),
      syntes: { monster: '', robusta: '', signaler: ['', '', '', ''], samlad: null, osakert: '' },
      kollisioner: [], seeScen: null, seeMotivering: '', parkering: '', kedja: {} };
  }
  function load() { try { var s = localStorage.getItem(KEY); return s ? JSON.parse(s) : null; } catch (e) { return null; } }
  function save() { state.andrad = new Date().toISOString(); try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) {} }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function fill(t, map) { return t.replace(/\{(\w+)\}/g, function (m, k) { return map[k] != null ? map[k] : m; }); }
  function toast(msg) { var t = document.createElement('div'); t.className = 'toast'; t.textContent = msg; document.body.appendChild(t); setTimeout(function () { t.remove(); }, 2800); }
  function lista(a) { var och = a.some(function (x) { return / och /.test(x) && !/^”/.test(x); }) ? ' samt ' : ' och '; return a.length > 1 ? a.slice(0, -1).join(', ') + och + a[a.length - 1] : (a[0] || ''); }
  function short(t, n) { t = String(t || ''); n = n || 26; return t.length > n ? t.slice(0, n - 1).trim() + '…' : t; }
  function getPath(o, p) { return p.split('.').reduce(function (x, k) { return x == null ? x : x[k]; }, o); }
  function setPath(o, p, v) { var k = p.split('.'), last = k.pop(); var t = k.reduce(function (x, kk) { if (x[kk] == null) x[kk] = {}; return x[kk]; }, o); t[last] = v; }
  function omrade(id) { return C.omraden.filter(function (o) { return o.id === id; })[0]; }
  function trend(id) { return state.trender.filter(function (t) { return t.id === id; })[0]; }
  function tnr(id) { return state.trender.indexOf(trend(id)) + 1; }
  function tname(id) { var t = trend(id); return t ? (t.trend || t.signal || 'Trend ' + tnr(id)) : ''; }
  function validTrends() { return state.trender.filter(function (t) { return (t.trend || '').trim(); }); }

  /* ---------- skede 0 och 1 ---------- */
  function utmaning(id) { return C.utmaningar.filter(function (u) { return u.id === id; })[0]; }
  function fokusOmraden() {
    var out = [];
    state.fokus.utmaningar.forEach(function (u) { (utmaning(u).omraden || []).forEach(function (o) { if (out.indexOf(o) < 0) out.push(o); }); });
    return out;
  }
  function forslagFraga() {
    function lc(x) { return /^[A-ZÅÄÖ][a-zåäö]/.test(x) ? x.charAt(0).toLowerCase() + x.slice(1) : x; }
    /* En utmaning med egen frågemall (till exempel för en tillämpning) styr frågan; de andra valen blir det som påverkar. */
    var egenMall = state.fokus.utmaningar.map(utmaning).filter(function (u) { return u && u.fragaMall; })[0];
    var namn = state.fokus.utmaningar.filter(function (u) { return !egenMall || u !== egenMall.id; }).map(function (u) { return lc(utmaning(u).namn); });
    if (state.fokus.egen.trim()) namn.push(lc(state.fokus.egen.trim()));
    if (!namn.length && !egenMall) return '';
    return fill(egenMall ? egenMall.fragaMall : C.fokus.fragaMall, { lista: namn.length ? lista(namn.slice(0, 3)) : egenMall.standard, org: state.meta.foretag || 'oss', ar: new Date().getFullYear() + state.fokus.horisont });
  }
  function exempel(oid) {
    var o = omrade(oid), ex = (o.exempel || [{ signal: o.signal || '', trend: o.trend || '' }]).slice();
    /* En vald utmaning kan lyfta fram ett eget exempel först i ett område (till exempel för en tillämpning). */
    state.fokus.utmaningar.map(utmaning).forEach(function (u) {
      var t = u && u.forstaExempel && u.forstaExempel[oid], i = t ? ex.map(function (e) { return e.trend; }).indexOf(t) : -1;
      if (i > 0) ex.unshift(ex.splice(i, 1)[0]);
    });
    return ex;
  }
  function seedTrender() {
    fokusOmraden().forEach(function (oid) {
      if (state.seedade.indexOf(oid) >= 0) return;
      state.seedade.push(oid); exempel(oid).slice(0, 1).forEach(function (e) { state.trender.push({ id: 't' + state.nextId++, omrade: oid, signal: e.signal, trend: e.trend }); });
    });
  }
  function addRow(oid, blank) {
    if (state.seedade.indexOf(oid) < 0) state.seedade.push(oid);
    (blank ? [{ signal: '', trend: '' }] : exempel(oid).slice(0, 1)).forEach(function (e) { state.trender.push({ id: 't' + state.nextId++, omrade: oid, signal: e.signal, trend: e.trend }); });
  }

  /* ---------- skede 2 ---------- */
  function klass(id) {
    var b = state.bed[id]; if (!b || typeof b.p !== 'number' || typeof b.s !== 'number') return null;
    if (b.p >= 3) return b.s <= 2 ? 'kritisk' : 'forutbestamd';
    return b.p === 2 ? 'bevaka' : 'ignorera';
  }
  function allBedomda() { var v = validTrends(); return v.length && v.every(function (t) { return klass(t.id); }); }
  function forutbestamda() { return validTrends().filter(function (t) { return klass(t.id) === 'forutbestamd'; }).map(function (t) { return t.id; }); }

  /* ---------- skede 3 ---------- */
  function urvalForslag() {
    var rank = { kritisk: 0, bevaka: 1, forutbestamd: 2, ignorera: 3 };
    return validTrends().slice().sort(function (a, b) {
      var ka = klass(a.id), kb = klass(b.id), ba = state.bed[a.id], bb = state.bed[b.id];
      return rank[ka] - rank[kb] || bb.p - ba.p || ba.s - bb.s || tnr(a.id) - tnr(b.id);
    }).slice(0, 5).map(function (t) { return t.id; });
  }
  function urval() { return (state.urval || []).filter(function (id) { return trend(id); }); }
  function pairs() { var ids = urval(), out = []; ids.forEach(function (a) { ids.forEach(function (b) { if (a !== b) out.push([a, b]); }); }); return out; }
  function mv(a, b) { return state.m[a + '>' + b]; }
  function sums() {
    var ids = urval(), r = {};
    ids.forEach(function (a) { r[a] = { aktiv: 0, passiv: 0 }; });
    ids.forEach(function (a) { ids.forEach(function (b) { if (a !== b) { var v = mv(a, b) || 0; r[a].aktiv += v; r[b].passiv += v; } }); });
    var ma = ids.reduce(function (s, id) { return s + r[id].aktiv; }, 0) / (ids.length || 1);
    var mp = ids.reduce(function (s, id) { return s + r[id].passiv; }, 0) / (ids.length || 1);
    ids.forEach(function (id) {
      var hiA = r[id].aktiv >= ma && r[id].aktiv > 0, hiP = r[id].passiv >= mp && r[id].passiv > 0;
      r[id].kat = hiA && !hiP ? 'drivande' : hiA && hiP ? 'kritisk' : !hiA && hiP ? 'paverkad' : 'buffrande';
    });
    return { r: r, ma: ma, mp: mp };
  }

  /* ---------- skede 4 ---------- */
  function axelForslag() {
    var s = sums().r;
    return urval().slice().sort(function (a, b) {
      var ua = state.bed[a].s <= 2 ? 0 : 1, ub = state.bed[b].s <= 2 ? 0 : 1;
      return ua - ub || s[b].aktiv - s[a].aktiv || state.bed[b].p - state.bed[a].p;
    }).slice(0, 2);
  }
  function axlar() { return (state.axlar.val || []).filter(function (id) { return urval().indexOf(id) >= 0; }); }
  function axelBytt() { var f = axelForslag(), v = axlar(); return v.some(function (id) { return f.indexOf(id) < 0; }); }
  function axelVarningar() {
    var v = axlar(), w = [];
    v.forEach(function (id) { if (state.bed[id] && state.bed[id].s >= 3) w.push(fill(C.axlar.varningSaker, { trend: '”' + tname(id) + '”' })); });
    if (v.length === 2) {
      [[v[0], v[1]], [v[1], v[0]]].forEach(function (p) { if (mv(p[0], p[1]) === 3) w.push(fill(C.axlar.varningBeroende, { a: '”' + tname(p[0]) + '”', b: '”' + tname(p[1]) + '”' })); });
    }
    return w;
  }
  function andp(id) { state.axlar.and[id] = state.axlar.and[id] || { svag: '', stark: '' }; return state.axlar.and[id]; }
  /* Index: 0 A svag B stark, 1 A stark B stark, 2 A svag B svag, 3 A stark B svag. */
  function kombination(i) { return { aStark: i % 2 === 1, bStark: i < 2 }; }
  function kombText(i) {
    var v = axlar(); if (v.length < 2) return '';
    var k = kombination(i);
    return short(tname(v[0]), 34) + ': ' + (k.aStark ? 'stark' : 'svag') + ' · ' + short(tname(v[1]), 34) + ': ' + (k.bStark ? 'stark' : 'svag');
  }
  function scenNamn(i) { return state.scen[i].namn || 'Framtid ' + (i + 1); }

  /* ---------- skede 5 till 8 ---------- */
  function allaVarden() { return C.varden.lista.concat(state.egnaVarden); }
  function varde(id) { return allaVarden().filter(function (v) { return v.id === id; })[0]; }
  function vd(id) { state.varden[id] = state.varden[id] || { med: false, hos: '', ant: '' }; return state.varden[id]; }
  function valdaVarden() { return allaVarden().filter(function (v) { return state.varden[v.id] && state.varden[v.id].med; }); }
  function lage(i, id) { var l = state.vind[i].lage[id]; return typeof l === 'number' ? l : 0; }
  function vardeStat() {
    return valdaVarden().map(function (v) {
      var neg = [], pos = [];
      [0, 1, 2, 3].forEach(function (i) { var l = lage(i, v.id); if (l < 0) neg.push(i); if (l > 0) pos.push(i); });
      return { v: v, neg: neg, pos: pos };
    });
  }
  function kollForslag() {
    var ax = axlar().map(function (id) { return '”' + tname(id) + '”'; });
    return vardeStat().filter(function (s) { return s.neg.length; }).sort(function (a, b) { return b.neg.length - a.neg.length; }).map(function (s) {
      return { fran: s.v.id, namn: s.v.namn + ' under tryck', ant: vd(s.v.id).ant || s.v.exempel || '',
        varfor: 'Försvagas i ' + s.neg.length + ' av 4 framtider (' + lista(s.neg.map(scenNamn)) + ')' + (ax.length ? '. Drivs av ' + lista(ax) + '.' : '.') };
    });
  }
  function kollKlar(k) { return (k.namn || '').trim() && typeof k.tryck === 'number' && typeof k.tempo === 'number' && typeof k.syn === 'number'; }
  function seeForslag() {
    var fran = state.kollisioner.map(function (k) { return k.fran; }).filter(Boolean);
    var best = 0, bestScore = -1;
    [0, 1, 2, 3].forEach(function (i) {
      var ids = fran.length ? fran : valdaVarden().map(function (v) { return v.id; });
      var score = ids.filter(function (id) { return lage(i, id) < 0; }).length * 10 + (state.vind[i].utv === -1 ? 5 : state.vind[i].utv === 0 ? 2 : 0);
      if (score > bestScore) { bestScore = score; best = i; }
    });
    return best;
  }

  /* ---------- steg ---------- */
  var SKEDE = { fokus: 0, signaler: 1, bedomning: 2, urval: 3, matris: 3, axlar: 4, scenarier: 4, varden: 5, syntes: 7, karta: 8 };
  function skede(st) { if (/^q-/.test(st)) return 3; if (/^vind-/.test(st)) return 6; return SKEDE[st]; }
  function steps() {
    var s = ['start', 'uppgifter', 'fokus', 'signaler', 'bedomning', 'urval'];
    pairs().forEach(function (p, i) { s.push('q-' + i); });
    s.push('matris', 'axlar', 'scenarier', 'varden', 'vind-0', 'vind-1', 'vind-2', 'vind-3', 'syntes', 'karta', 'rapport');
    return s;
  }
  function canNext(st) {
    st = st || view.step;
    if (st === 'fokus') return (state.fokus.utmaningar.length || state.fokus.egen.trim()) && state.fokus.fraga.trim();
    if (st === 'signaler') return validTrends().length >= 5;
    if (st === 'bedomning') return allBedomda();
    if (st === 'urval') { var n = urval().length; return n >= 3 && n <= 5; }
    if (/^q-/.test(st)) { var p = pairs()[+st.slice(2)]; return p && typeof mv(p[0], p[1]) === 'number'; }
    if (st === 'axlar') { var v = axlar(); return v.length === 2 && v.every(function (id) { var a = andp(id); return a.svag.trim() && a.stark.trim(); }) && (!axelBytt() || state.axlar.motivering.trim().length > 2); }
    if (st === 'scenarier') return state.scen.every(function (s) { return s.namn.trim(); });
    if (st === 'varden') return valdaVarden().length >= 3;
    if (/^vind-/.test(st)) return state.vind[+st.slice(5)].utv !== null;
    if (st === 'karta') return state.kollisioner.length >= 1 && state.kollisioner.every(kollKlar) && state.seeScen !== null && (state.seeScen === seeForslag() || state.seeMotivering.trim().length > 2);
    return true;
  }
  /* Vad som saknas för att gå vidare, i klartext under Nästa. */
  function saknas(st) {
    st = st || view.step; var m = [];
    if (st === 'fokus') { if (!state.fokus.utmaningar.length && !state.fokus.egen.trim()) m.push('Kryssa minst en utmaning eller skriv en egen.'); if (!state.fokus.fraga.trim()) m.push('Skriv en fokusfråga.'); }
    if (st === 'signaler' && validTrends().length < 5) m.push('Ha minst fem trender med (nu ' + validTrends().length + ').');
    if (st === 'bedomning') { var ej = validTrends().filter(function (t) { return !klass(t.id); }).map(function (t) { return tnr(t.id); }); if (ej.length) m.push('Bedöm både påverkan och säkerhet för trend ' + lista(ej.map(String)) + '.'); }
    if (st === 'urval') { var n = urval().length; if (n < 3 || n > 5) m.push('Välj tre till fem trender (nu ' + n + ').'); }
    if (/^q-/.test(st) && !canNext(st)) m.push('Välj ett svar.');
    if (st === 'axlar') {
      var v = axlar(); if (v.length !== 2) m.push('Välj två axlar (nu ' + v.length + ').');
      else { if (v.some(function (id) { var a = andp(id); return !a.svag.trim() || !a.stark.trim(); })) m.push('Beskriv svag och stark utveckling för båda axlarna.'); if (axelBytt() && state.axlar.motivering.trim().length <= 2) m.push('Motivera varför ni valde andra axlar än förslaget.'); }
    }
    if (st === 'scenarier') { var tom = [0, 1, 2, 3].filter(function (i) { return !state.scen[i].namn.trim(); }); if (tom.length) m.push('Ge alla fyra framtider ett namn (' + tom.length + ' saknas).'); }
    if (st === 'varden' && valdaVarden().length < 3) m.push('Markera minst tre bärande delar (nu ' + valdaVarden().length + ').');
    if (/^vind-/.test(st) && state.vind[+st.slice(5)].utv === null) m.push('Bedöm hur verksamheten står sig i den här framtiden.');
    if (st === 'karta') {
      if (!state.kollisioner.length) m.push('Ta med minst en kollision.');
      state.kollisioner.forEach(function (k, i) {
        var f = []; if (!(k.namn || '').trim()) f.push('namn'); if (typeof k.tryck !== 'number') f.push('tryck'); if (typeof k.tempo !== 'number') f.push('tempo'); if (typeof k.syn !== 'number') f.push('synlighet');
        if (f.length) m.push('Kollision ' + (i + 1) + ' saknar ' + lista(f) + '.');
      });
      if (state.seeScen === null) m.push('Välj vilken framtid ni tar med till See.');
      else if (state.seeScen !== seeForslag() && state.seeMotivering.trim().length <= 2) m.push('Motivera varför ni valde en annan framtid än förslaget.');
    }
    return m;
  }
  function go(step) { view.step = step; if (step !== 'start' && state) { state.steg = step; save(); } render(); window.scrollTo(0, 0); app.focus({ preventScroll: true }); }
  function nav(d) { var s = steps(), i = s.indexOf(view.step); go(s[Math.max(0, Math.min(s.length - 1, i + d))]); }
  function resumeStep() { var s = steps(); for (var i = 1; i < s.length - 1; i++) if (!canNext(s[i])) return s[i]; return 'rapport'; }
  function rerender() { var y = window.scrollY; render(); window.scrollTo(0, y); }

  /* ---------- gemensamma bitar ---------- */
  function head(st, rubrik, text) {
    var k = skede(st), sk = C.skeden[k];
    return '<div class="eyebrow">Skede ' + k + ' av 8 · ' + esc(sk.namn) + ' · cirka ' + esc(sk.tid) + '</div><h2>' + esc(rubrik) + '</h2>' + (text ? '<p class="muted">' + esc(text) + '</p>' : '');
  }
  function slugB(t) { return String(t).toLowerCase().replace(/[åä]/g, 'a').replace(/ö/g, 'o').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''); }
  function omNote(key) { var o = (C.omOvningen || {})[key]; return o ? '<div class="note about-note"><b>Om övningen.</b> ' + esc(o.text) + ' <a href="../begrepp/#' + slugB(o.begrepp) + '" target="_blank" rel="noopener">Läs mer i begreppslistan</a></div>' : ''; }
  function seg(attr, val, labels, cur, extra) {
    return '<div class="seg" role="group">' + labels.map(function (l, i) { var v = val(i); return '<button ' + attr + '="' + v + '"' + (extra || '') + ' aria-pressed="' + (cur === v) + '">' + esc(l) + '</button>'; }).join('') + '</div>';
  }
  function parking() {
    var n = state.parkering.split('\n').filter(function (x) { return x.trim(); }).length;
    return '<details class="parking"' + (view.parkOpen ? ' open' : '') + '><summary>' + esc(C.parkering.rubrik) + (n ? ' (' + n + ')' : '') + '</summary><p class="small muted">' + esc(C.parkering.text) + '</p><textarea data-path="parkering" rows="3">' + esc(state.parkering) + '</textarea></details>';
  }

  /* ---------- diagram ---------- */
  var F = 'Helvetica, Arial, sans-serif';
  function bedSVG() {
    var W = 640, H = 400, L = 70, T = 40, R = 20, B = 60, w = W - L - R, h = H - T - B;
    function x(s) { return L + (s + 0.5) / 5 * w; } function y(p) { return T + h - (p + 0.5) / 5 * h; }
    var g = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ' + W + ' ' + H + '" font-family="' + F + '" role="img" aria-label="Trender efter påverkan och säkerhet">';
    g += '<rect x="' + L + '" y="' + T + '" width="' + (w * 3 / 5) + '" height="' + (h * 2 / 5) + '" fill="#fbe3da"/><rect x="' + (L + w * 3 / 5) + '" y="' + T + '" width="' + (w * 2 / 5) + '" height="' + (h * 2 / 5) + '" fill="#ececea"/>';
    g += '<text x="' + (L + 4) + '" y="' + (T - 10) + '" font-size="13" font-weight="bold" fill="#d1431d">Kritiska osäkerheter</text><text x="' + (L + w - 4) + '" y="' + (T - 10) + '" font-size="13" font-weight="bold" fill="#141414" text-anchor="end">Förutbestämda element</text>';
    g += '<rect x="' + L + '" y="' + T + '" width="' + w + '" height="' + h + '" fill="none" stroke="#dcdcd8"/>';
    for (var i = 0; i < 5; i++) {
      g += '<text x="' + x(i) + '" y="' + (T + h + 18) + '" font-size="11" fill="#5c5c5c" text-anchor="middle">' + esc(C.bedomning.sakerhet[i]) + '</text>';
      g += '<text x="' + (L - 8) + '" y="' + (y(i) + 4) + '" font-size="11" fill="#5c5c5c" text-anchor="end">' + esc(C.bedomning.paverkan[i]) + '</text>';
    }
    g += '<text x="' + (L + w / 2) + '" y="' + (H - 12) + '" font-size="12" font-weight="bold" fill="#141414" text-anchor="middle">Säkerhet</text><text x="16" y="' + (T + h / 2) + '" font-size="12" font-weight="bold" fill="#141414" text-anchor="middle" transform="rotate(-90 16 ' + (T + h / 2) + ')">Påverkan</text>';
    var cell = {};
    validTrends().forEach(function (t) {
      var b = state.bed[t.id]; if (!b || typeof b.p !== 'number' || typeof b.s !== 'number') return;
      var key = b.p + '-' + b.s, k = cell[key] = (cell[key] || 0) + 1;
      var dx = ((k - 1) % 4) * 22 - 33, dy = Math.floor((k - 1) / 4) * 22 - 6;
      g += '<circle cx="' + (x(b.s) + dx) + '" cy="' + (y(b.p) + dy) + '" r="10" fill="#141414"><title>' + esc(tnr(t.id) + '. ' + t.trend) + '</title></circle><text x="' + (x(b.s) + dx) + '" y="' + (y(b.p) + dy + 4) + '" font-size="11" font-weight="bold" fill="#fff" text-anchor="middle">' + tnr(t.id) + '</text>';
    });
    return g + '</svg>';
  }
  function matrisSVG() {
    var S = sums(), ids = urval(), W = 640, H = 420, L = 56, T = 20, R = 20, B = 50, w = W - L - R, h = H - T - B;
    var max = Math.max(3, Math.max.apply(null, ids.map(function (id) { return Math.max(S.r[id].aktiv, S.r[id].passiv); }))) + 1;
    function x(v) { return L + v / max * w; } function y(v) { return T + h - v / max * h; }
    var cols = { drivande: '#141414', kritisk: '#d1431d', paverkad: '#3d5a99', buffrande: '#8a8a86' };
    var g = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ' + W + ' ' + H + '" font-family="' + F + '" role="img" aria-label="Aktiv och passiv summa per trend">';
    g += '<rect x="' + L + '" y="' + T + '" width="' + w + '" height="' + h + '" fill="#fff" stroke="#dcdcd8"/>';
    g += '<line x1="' + x(S.mp) + '" y1="' + T + '" x2="' + x(S.mp) + '" y2="' + (T + h) + '" stroke="#c4c4bf" stroke-dasharray="5 4"/><line x1="' + L + '" y1="' + y(S.ma) + '" x2="' + (L + w) + '" y2="' + y(S.ma) + '" stroke="#c4c4bf" stroke-dasharray="5 4"/>';
    var K = C.matris.kategorier;
    g += '<text x="' + (L + 8) + '" y="' + (T + 18) + '" font-size="13" font-weight="bold" fill="' + cols.drivande + '">' + esc(K.drivande.namn.toUpperCase()) + '</text>';
    g += '<text x="' + (L + w - 8) + '" y="' + (T + 18) + '" font-size="13" font-weight="bold" fill="' + cols.kritisk + '" text-anchor="end">' + esc(K.kritisk.namn.toUpperCase()) + '</text>';
    g += '<text x="' + (L + w - 8) + '" y="' + (T + h - 8) + '" font-size="13" font-weight="bold" fill="' + cols.paverkad + '" text-anchor="end">' + esc(K.paverkad.namn.toUpperCase()) + '</text>';
    g += '<text x="' + (L + 8) + '" y="' + (T + h - 8) + '" font-size="13" font-weight="bold" fill="' + cols.buffrande + '">' + esc(K.buffrande.namn.toUpperCase()) + '</text>';
    for (var v = 0; v <= max; v += max > 8 ? 2 : 1) { g += '<text x="' + x(v) + '" y="' + (T + h + 16) + '" font-size="11" fill="#5c5c5c" text-anchor="middle">' + v + '</text><text x="' + (L - 8) + '" y="' + (y(v) + 4) + '" font-size="11" fill="#5c5c5c" text-anchor="end">' + v + '</text>'; }
    g += '<text x="' + (L + w / 2) + '" y="' + (H - 8) + '" font-size="12" font-weight="bold" fill="#141414" text-anchor="middle">Passiv summa: påverkas av de andra</text><text x="16" y="' + (T + h / 2) + '" font-size="12" font-weight="bold" fill="#141414" text-anchor="middle" transform="rotate(-90 16 ' + (T + h / 2) + ')">Aktiv summa: driver de andra</text>';
    var used = {};
    ids.forEach(function (id) {
      var r = S.r[id], key = r.aktiv + '-' + r.passiv, k = used[key] = (used[key] || 0) + 1;
      var ang = (k - 1) * 1.3, rad = k > 1 ? 24 : 0, cx = x(r.passiv) + Math.cos(ang) * rad, cy = y(r.aktiv) - Math.sin(ang) * rad;
      g += '<circle cx="' + cx + '" cy="' + cy + '" r="13" fill="' + cols[r.kat] + '" stroke="#fff" stroke-width="2"><title>' + esc(tnr(id) + '. ' + tname(id)) + '</title></circle><text x="' + cx + '" y="' + (cy + 4.5) + '" font-size="13" font-weight="bold" fill="#fff" text-anchor="middle">' + tnr(id) + '</text>';
    });
    return g + '</svg>';
  }
  function kartaSVG() {
    var W = 640, H = 420, L = 60, T = 40, R = 20, B = 56, w = W - L - R, h = H - T - B, KS = C.karta;
    function x(t) { return L + (t + 0.5) / 4 * w; } function y(p) { return T + h - (p - 0.5) / 5 * h; }
    var g = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ' + W + ' ' + H + '" font-family="' + F + '" role="img" aria-label="Collision Map">';
    g += '<rect x="' + L + '" y="' + T + '" width="' + (w / 2) + '" height="' + (h * 2 / 5) + '" fill="#fbe3da"/><rect x="' + L + '" y="' + T + '" width="' + w + '" height="' + h + '" fill="none" stroke="#dcdcd8"/>';
    g += '<text x="' + (L + 4) + '" y="' + (T - 10) + '" font-size="12" font-weight="bold" fill="#d1431d">Högt tryck, nära i tid</text>';
    KS.tempoSkala.forEach(function (l, i) { g += '<text x="' + x(i) + '" y="' + (T + h + 18) + '" font-size="11" fill="#5c5c5c" text-anchor="middle">' + esc(l) + '</text>'; });
    for (var p = 1; p <= 5; p++) g += '<text x="' + (L - 8) + '" y="' + (y(p) + 4) + '" font-size="11" fill="#5c5c5c" text-anchor="end">' + p + '</text>';
    g += '<text x="' + (L + w / 2) + '" y="' + (H - 10) + '" font-size="12" font-weight="bold" fill="#141414" text-anchor="middle">Tempo</text><text x="16" y="' + (T + h / 2) + '" font-size="12" font-weight="bold" fill="#141414" text-anchor="middle" transform="rotate(-90 16 ' + (T + h / 2) + ')">Tryck</text>';
    state.kollisioner.filter(kollKlar).forEach(function (k, i) {
      var same = state.kollisioner.filter(kollKlar).slice(0, i).filter(function (o) { return o.tempo === k.tempo && o.tryck === k.tryck; }).length;
      var cx = x(k.tempo) + same * 30, cy = y(k.tryck) - same * 10, dold = k.syn <= 2, r = 12 + k.tryck * 1.6;
      g += '<circle cx="' + cx + '" cy="' + cy + '" r="' + r + '" fill="' + (dold ? '#fff' : '#d1431d') + '" fill-opacity="' + (dold ? 1 : 0.25 + k.syn * 0.12) + '" stroke="#d1431d" stroke-width="2"' + (dold ? ' stroke-dasharray="5 4"' : '') + '><title>' + esc((i + 1) + '. ' + k.namn) + '</title></circle>';
      g += '<text x="' + cx + '" y="' + (cy + 5) + '" font-size="14" font-weight="bold" fill="#141414" text-anchor="middle">' + (i + 1) + '</text>';
    });
    return g + '</svg>';
  }

  /* ---------- vyer ---------- */
  function renderStart() {
    var has = load(), ho = LCA.takeHandOff(), h = '';
    if (ho && ho.modul === 'sense') h += '<div class="note"><b>En sparfil från Sense väntar.</b> ' + esc(ho.organisation.namn || '') + ' <span style="display:block;margin-top:10px"><button class="btn" data-act="fromhandoff">Öppna den</button> <button class="btn quiet" data-act="dropho">Nej tack</button></span></div>';
    h += '<div class="eyebrow">Smart Built Boost · Sense</div><h1>' + esc(C.titel) + '</h1><p class="lead">' + esc(C.undertitel) + '</p>' + C.intro.map(function (t) { return '<p>' + esc(t) + '</p>'; }).join('');
    h += '<div class="card tight"><b>Så går det till</b><ol class="steps-ol" start="0">' + C.skeden.map(function (s) { return '<li>' + esc(s.namn) + ' <span class="muted">(' + esc(s.tid) + ')</span></li>'; }).join('') + '</ol><p class="small muted" style="margin:0">' + esc(C.tidstext) + '</p></div>';
    var resume = has && (has.trender.length || has.meta.foretag) ? '<div class="card"><h3>Fortsätt där ni var</h3><p class="muted small">Det finns en påbörjad körning sparad i den här webbläsaren' + (has.meta.foretag ? ' för ' + esc(has.meta.foretag) : '') + '.</p><button class="btn" data-act="resume">Fortsätt</button></div>' : '';
    h += '<div class="startgrid">' + resume + '<div class="card"><h3>Ny körning</h3><p class="muted small">Börja från början.</p><button class="btn" data-act="new">Starta</button></div>' +
      '<div class="card"><h3>Öppna en sparfil</h3><p class="muted small">Fortsätt eller titta på en tidigare körning.</p><button class="btn ghost" data-act="open">Välj fil</button></div>' +
      '<div class="card"><h3>' + esc(C.forarbete.rubrik) + '</h3><p class="muted small">' + esc(C.forarbete.text) + '</p><button class="btn ghost" data-act="forarbete">Starta förarbete</button></div></div>';
    return h + '<p class="note small">' + esc(C.integritet) + '</p>';
  }
  function renderMeta() {
    var m = state.meta;
    return '<div class="eyebrow">Förberedelse</div><h2>Om arbetet</h2><p class="muted">Uppgifterna hamnar i rapporten. Inget av det lämnar er dator.</p>' +
      '<div class="card"><label class="field"><span>Organisation</span><input type="text" data-path="meta.foretag" value="' + esc(m.foretag) + '" autocomplete="organization"></label>' +
      '<label class="field"><span>Datum</span><input type="date" data-path="meta.datum" value="' + esc(m.datum) + '"></label>' +
      '<span style="display:block;font-weight:600;font-size:15px;margin-bottom:6px">Vem arbetar?</span><div class="radios">' +
      ['grupp', 'individ'].map(function (t) { return '<label><input type="radio" name="typ" value="' + t + '"' + (m.typ === t ? ' checked' : '') + '> ' + (t === 'grupp' ? 'Vi gör det tillsammans som grupp' : 'Jag gör det som enskild person') + '</label>'; }).join('') + '</div>' +
      '<label class="field" style="margin:0"><span>' + (m.typ === 'grupp' ? 'Gruppens namn, till exempel ledningsgruppen' : 'Ditt namn eller din roll') + ' <span class="muted" style="display:inline;font-weight:400">(frivilligt)</span></span><input type="text" data-path="meta.namn" value="' + esc(m.namn) + '"></label></div>';
  }
  function renderFokus() {
    var Fk = C.fokus, f = state.fokus;
    var h = head('fokus', Fk.rubrik, Fk.text) + '<div class="picklist cols">';
    C.utmaningar.forEach(function (u) { h += '<label class="pick"><input type="checkbox" data-utm="' + u.id + '"' + (f.utmaningar.indexOf(u.id) >= 0 ? ' checked' : '') + '><span>' + esc(u.namn) + '</span><span></span></label>'; });
    h += '</div><label class="field"><span>' + esc(Fk.egenEtikett) + '</span><input type="text" data-path="fokus.egen" data-refokus="1" value="' + esc(f.egen) + '"></label>';
    h += '<span style="display:block;font-weight:600;font-size:15px;margin-bottom:6px">' + esc(Fk.horisontEtikett) + '</span>' + seg('data-horisont', function (i) { return Fk.horisonter[i]; }, Fk.horisonter.map(function (y) { return y + ' år (' + (new Date().getFullYear() + y) + ')'; }), f.horisont) + '<p class="hint" style="margin-top:6px">' + esc(Fk.horisontHjalp) + '</p>';
    h += '<label class="field"><span>' + esc(Fk.fragaEtikett) + '</span><textarea data-path="fokus.fraga" data-fraga="1" rows="2">' + esc(f.fraga) + '</textarea></label><p class="hint" style="margin-top:-8px">' + esc(Fk.fragaHjalp) + '</p>' + (Fk.tillampningHjalp ? '<p class="hint">' + esc(Fk.tillampningHjalp) + '</p>' : '');
    return h;
  }
  function kollLegend() { return '<ul class="tlegend">' + state.kollisioner.map(function (k, i) { return kollKlar(k) ? '<li><span class="tnr koll-nr">' + (i + 1) + '</span>' + esc(k.namn) + '</li>' : ''; }).join('') + '</ul>'; }
  function legendHTML(ids) { return '<ul class="tlegend">' + ids.map(function (id) { return '<li><span class="tnr">' + tnr(id) + '</span>' + esc(tname(id)) + '</li>'; }).join('') + '</ul>'; }
  function trendRow(t) {
    return '<div class="trow"><span class="tnr">' + tnr(t.id) + '</span><label><span>Signal</span><textarea rows="2" data-trend="' + t.id + '" data-f="signal">' + esc(t.signal) + '</textarea></label><label><span>Indikerar trend</span><textarea rows="2" data-trend="' + t.id + '" data-f="trend">' + esc(t.trend) + '</textarea></label><button class="del" data-act="deltrend" data-id="' + t.id + '" aria-label="Ta bort">×</button>' + (t.fran && t.fran.length ? '<span class="from small muted">' + esc(C.forarbete.fran) + ': ' + esc(t.fran.join(', ')) + '</span>' : '') + '</div>';
  }
  function renderSignaler() {
    var S = C.signaler, fo = fokusOmraden(), h = head('signaler', S.rubrik, S.text);
    var shown = state.seedade.slice().sort(function (a, b) { var ia = fo.indexOf(a), ib = fo.indexOf(b); return (ia < 0 ? 99 : ia) - (ib < 0 ? 99 : ib); });
    shown.forEach(function (oid) {
      var rows = state.trender.filter(function (t) { return t.omrade === oid; });
      var fler = exempel(oid).filter(function (e) { return !state.trender.some(function (t) { return t.trend === e.trend; }); });
      h += '<div class="card tight area"><div class="area-head"><b>' + esc(omrade(oid).namn) + '</b>' + (fo.indexOf(oid) >= 0 ? '<span class="tag strong">fokus</span>' : '') + '</div>' + rows.map(trendRow).join('') +
        (fler.length ? '<div class="chips ex"><span class="small muted">Fler exempel:</span>' + fler.map(function (e) { return '<button class="chip" data-act="addex" data-om="' + oid + '" data-ex="' + esc(e.trend) + '" title="' + esc('Signal: ' + e.signal) + '">+ ' + esc(e.trend) + '</button>'; }).join('') + '</div>' : '') +
        '<button class="btn quiet small-btn" data-act="addrow" data-om="' + oid + '">+ Lägg till egen rad</button></div>';
    });
    var rest = C.omraden.filter(function (o) { return state.seedade.indexOf(o.id) < 0; });
    if (rest.length) h += '<h3>' + esc(S.ovrigaRubrik) + '</h3><div class="chips">' + rest.map(function (o) { return '<button class="chip" data-act="addarea" data-om="' + o.id + '">+ ' + esc(o.namn) + '</button>'; }).join('') + '</div>';
    h += '<p class="hint">' + validTrends().length + ' trender. ' + esc(S.minText) + '</p>';
    var FA = C.forarbete;
    if (state.forarbete) h += '<div class="card tight next"><div class="eyebrow">' + esc(FA.sparaRubrik) + '</div><p class="small">' + esc(FA.sparaText) + '</p><button class="btn" data-act="savefile">Spara förarbetet</button></div>';
    else h += '<div class="card tight"><div class="eyebrow">' + esc(FA.hamtaRubrik) + '</div><p class="small">' + esc(FA.hamtaText) + '</p><button class="btn ghost" data-act="merge">' + esc(FA.hamtaKnapp) + '</button></div>';
    return h;
  }
  function renderBedomning() {
    var Bd = C.bedomning, h = head('bedomning', Bd.rubrik, Bd.text) + omNote('bedomning');
    h += '<div class="card tight chartcard"><div class="chart">' + bedSVG() + '</div>' + legendHTML(validTrends().map(function (t) { return t.id; })) + '</div>';
    validTrends().forEach(function (t) {
      var b = state.bed[t.id] || {}, k = klass(t.id);
      h += '<div class="card tight rate"><div class="rate-head"><span class="tnr">' + tnr(t.id) + '</span><b>' + esc(t.trend) + '</b>' + (k ? '<span class="tag' + (k === 'forutbestamd' ? ' strong' : k === 'kritisk' ? '' : ' plain') + '">' + esc(Bd.klasser[k].namn) + '</span>' : '') + '</div>' +
        '<div class="rate-grid"><div><span class="lbl">Påverkan</span>' + seg('data-bp', function (i) { return i; }, Bd.paverkan, b.p, ' data-id="' + t.id + '"') + '</div><div><span class="lbl">Säkerhet</span>' + seg('data-bs', function (i) { return i; }, Bd.sakerhet, b.s, ' data-id="' + t.id + '"') + '</div></div></div>';
    });
    h += '<div class="card tight">' + ['kritisk', 'forutbestamd', 'bevaka', 'ignorera'].map(function (k) { return '<p class="small" style="margin-bottom:6px"><b>' + esc(Bd.klasser[k].namn) + '.</b> ' + esc(Bd.klasser[k].text) + '</p>'; }).join('') + '</div>';
    return h;
  }
  function renderUrval() {
    var U = C.urval, fs = urvalForslag();
    if (!state.urval) { state.urval = fs.slice(); save(); }
    var h = head('urval', U.rubrik, U.text) + omNote('urval') + '<div class="picklist">';
    validTrends().slice().sort(function (a, b) { var r = { kritisk: 0, bevaka: 1, forutbestamd: 2, ignorera: 3 }; return r[klass(a.id)] - r[klass(b.id)] || state.bed[b.id].p - state.bed[a.id].p; }).forEach(function (t) {
      var on = state.urval.indexOf(t.id) >= 0, k = klass(t.id);
      h += '<label class="pick' + (fs.indexOf(t.id) >= 0 ? ' proposed' : '') + '"><input type="checkbox" data-urval="' + t.id + '"' + (on ? ' checked' : '') + '><span><span class="tnr inline">' + tnr(t.id) + '</span>' + esc(t.trend) + (fs.indexOf(t.id) >= 0 ? '<span class="tag">föreslagen</span>' : '') + '</span><span class="muted small">' + esc(C.bedomning.klasser[k].namn) + '</span></label>';
    });
    h += '</div><p class="hint">' + urval().length + ' valda. ' + pairs().length + ' frågor i nästa steg.</p>';
    if (forutbestamda().length) h += '<p class="note small">' + esc(U.forutbestamdaText) + '</p>';
    return h;
  }
  function renderFraga(i) {
    var Q = C.fragor, p = pairs()[i], v = mv(p[0], p[1]), n = pairs().length;
    var h = head('q-' + i, Q.rubrik) + '<div class="qcount">Fråga ' + (i + 1) + ' av ' + n + '</div><div class="qbox"><p class="qtext">' + fill(esc(Q.fraga), { a: '<b>' + esc(tname(p[0])) + '</b>', b: '<b>' + esc(tname(p[1])) + '</b>' }) + '</p></div><div class="levels">';
    Q.skala.forEach(function (l, k) { h += '<button class="choice" data-mv="' + k + '" aria-pressed="' + (v === k) + '"><span class="num">' + k + '</span><span><b>' + esc(l) + '</b></span></button>'; });
    return h + '</div><p class="hint">' + esc(Q.hjalp) + '</p>';
  }
  function matrisTabell() {
    var ids = urval(), S = sums();
    var h = '<div class="tablewrap"><table class="facil mtab"><thead><tr><th>Driver ↓ / påverkar →</th>' + ids.map(function (id) { return '<th class="n">' + tnr(id) + '</th>'; }).join('') + '<th class="n">Aktiv</th></tr></thead><tbody>';
    ids.forEach(function (a) { h += '<tr><td><span class="tnr inline">' + tnr(a) + '</span>' + esc(short(tname(a), 40)) + '</td>' + ids.map(function (b) { return '<td class="n">' + (a === b ? '·' : (mv(a, b) == null ? '' : mv(a, b))) + '</td>'; }).join('') + '<td class="n"><b>' + S.r[a].aktiv + '</b></td></tr>'; });
    return h + '<tr><td><b>Passiv</b></td>' + ids.map(function (b) { return '<td class="n"><b>' + S.r[b].passiv + '</b></td>'; }).join('') + '<td></td></tr></tbody></table></div>';
  }
  function renderMatris() {
    var M = C.matris, S = sums(), h = head('matris', M.rubrik, M.text);
    h += '<div class="card tight chartcard"><div class="chart">' + matrisSVG() + '</div>' + legendHTML(urval()) + '</div>';
    h += '<div class="card tight">' + urval().slice().sort(function (a, b) { return S.r[b].aktiv - S.r[a].aktiv; }).map(function (id) { var k = S.r[id].kat; return '<p class="small" style="margin-bottom:8px"><span class="tnr inline">' + tnr(id) + '</span><span class="tag cat-' + k + '">' + esc(M.kategorier[k].namn) + '</span> ' + esc(fill(M.kategorier[k].text, { trend: '”' + tname(id) + '”' })) + ' <span class="muted">(aktiv ' + S.r[id].aktiv + ', passiv ' + S.r[id].passiv + ')</span></p>'; }).join('') + '</div>';
    return h + matrisTabell();
  }
  function renderAxlar() {
    var A = C.axlar, fs = axelForslag(), S = sums().r;
    if (!state.axlar.val) { state.axlar.val = fs.slice(); save(); }
    var h = head('axlar', A.rubrik, A.text) + omNote('axlar') + '<div class="picklist">';
    urval().forEach(function (id) {
      var on = state.axlar.val.indexOf(id) >= 0, osaker = state.bed[id].s <= 2;
      h += '<label class="pick' + (fs.indexOf(id) >= 0 ? ' proposed' : '') + '"><input type="checkbox" data-axel="' + id + '"' + (on ? ' checked' : '') + '><span><span class="tnr inline">' + tnr(id) + '</span>' + esc(tname(id)) + (fs.indexOf(id) >= 0 ? '<span class="tag">föreslagen</span>' : '') + '</span><span class="muted small">' + esc(C.matris.kategorier[S[id].kat].namn.toLowerCase()) + ', ' + (osaker ? 'osäker' : 'säker') + '</span></label>';
    });
    h += '</div><p class="hint">Välj två. ' + axlar().length + ' valda.</p>';
    axelVarningar().forEach(function (w) { h += '<div class="note weak small">' + esc(w) + '</div>'; });
    if (axelBytt()) h += '<label class="field"><span>' + esc(A.motivering) + '</span><textarea data-path="axlar.motivering" rows="2">' + esc(state.axlar.motivering) + '</textarea></label>';
    if (axlar().length === 2) {
      h += '<h3>' + esc(A.andpunkterRubrik) + '</h3><p class="muted small">' + esc(A.andpunkterText) + '</p>';
      axlar().forEach(function (id, k) {
        var a = andp(id);
        h += '<div class="card tight"><div class="eyebrow">Axel ' + (k ? 'B' : 'A') + '</div><b>' + esc(tname(id)) + '</b><div class="two"><label class="field"><span>' + esc(A.svag) + '</span><input type="text" data-path="axlar.and.' + id + '.svag" value="' + esc(a.svag) + '"></label><label class="field"><span>' + esc(A.stark) + '</span><input type="text" data-path="axlar.and.' + id + '.stark" value="' + esc(a.stark) + '"></label></div></div>';
      });
    }
    return h;
  }
  function renderScenarier() {
    var Sc = C.scenarier, v = axlar(), fb = forutbestamda(), ovr = urval().filter(function (id) { return v.indexOf(id) < 0; });
    var h = head('scenarier', Sc.rubrik, Sc.text), nyckel = v.join('+');
    if (state.scenAxlar && state.scenAxlar !== nyckel && state.scen.some(function (x) { return x.namn.trim(); })) h += '<div class="note weak small">' + esc(Sc.andrade) + '</div>';
    if (state.scen.some(function (x) { return x.namn.trim(); }) || !state.scenAxlar) { state.scenAxlar = nyckel; save(); }
    h += '<div class="card tight"><div class="eyebrow">' + esc(Sc.byggstenar) + '</div>' + (fb.length ? '<p class="small" style="margin-bottom:6px"><b>I alla framtider:</b> ' + esc(fb.map(tname).join('; ')) + '</p>' : '') + (ovr.length ? '<p class="small" style="margin:0"><b>Kan färga berättelserna:</b> ' + esc(ovr.map(tname).join('; ')) + '</p>' : '') + '</div>';
    var a = andp(v[0]), b = andp(v[1]);
    h += '<p class="small"><b>Axel A:</b> ' + esc(tname(v[0])) + ' <span class="muted">(' + esc(a.svag) + ' / ' + esc(a.stark) + ')</span><br><b>Axel B:</b> ' + esc(tname(v[1])) + ' <span class="muted">(' + esc(b.svag) + ' / ' + esc(b.stark) + ')</span></p>';
    h += '<div class="scen-wrap"><div class="axis-y"><span>' + esc(short(tname(v[1]), 30)) + '</span></div><div class="scen-grid">';
    [0, 1, 2, 3].forEach(function (i) {
      var k = kombination(i), s = state.scen[i];
      h += '<div class="card tight scen"><p class="small muted scen-k">A: ' + esc(k.aStark ? a.stark : a.svag) + ' · B: ' + esc(k.bStark ? b.stark : b.svag) + '</p><label class="field"><span>' + esc(Sc.namn) + '</span><input type="text" data-path="scen.' + i + '.namn" value="' + esc(s.namn) + '"></label><label class="field" style="margin:0"><span>' + esc(Sc.berattelse) + '</span><textarea rows="3" data-path="scen.' + i + '.text">' + esc(s.text) + '</textarea></label></div>';
    });
    h += '</div><div class="axis-x"><span>' + esc(short(tname(v[0]), 40)) + ' →</span></div></div>';
    return h;
  }
  function renderVarden() {
    var V = C.varden, h = head('varden', V.rubrik, V.text) + omNote('varden');
    allaVarden().forEach(function (v) {
      var d = vd(v.id);
      h += '<div class="card tight vrow' + (d.med ? ' on' : '') + '"><label class="vcheck"><input type="checkbox" data-varde="' + v.id + '"' + (d.med ? ' checked' : '') + '><span><b>' + esc(v.namn) + '</b><span class="muted small"> ' + esc(v.text || '') + '</span></span></label>' +
        (d.med ? '<div class="two"><label class="field"><span>' + esc(V.hosOss) + '</span><input type="text" data-path="varden.' + v.id + '.hos" value="' + esc(d.hos) + '"></label><label class="field"><span>' + esc(V.antagande) + '</span><input type="text" data-path="varden.' + v.id + '.ant" value="' + esc(d.ant) + '" placeholder="' + esc(v.exempel || '') + '"></label></div>' : '') + '</div>';
    });
    h += '<div class="actions" style="margin-top:6px"><input type="text" id="egetvarde" placeholder="Eget område" style="max-width:320px"><button class="btn ghost" data-act="addvarde">Lägg till</button></div>';
    return h + '<p class="hint">' + valdaVarden().length + ' markerade. ' + esc(V.minText) + '</p>';
  }
  function renderVind(i) {
    var Vn = C.vind, s = state.vind[i], h = head('vind-' + i, Vn.rubrik + ': ' + scenNamn(i), Vn.text) + (i === 0 ? omNote('vind') : '');
    h += '<div class="card tight"><div class="eyebrow">Framtid ' + (i + 1) + ' av 4</div><p class="small muted" style="margin-bottom:4px">' + esc(kombText(i)) + '</p>' + (state.scen[i].text ? '<p style="margin:0">' + esc(state.scen[i].text) + '</p>' : '') + '</div>';
    valdaVarden().forEach(function (v) {
      var l = lage(i, v.id);
      h += '<div class="card tight vind"><div class="vind-head"><b>' + esc(v.namn) + '</b>' + seg('data-lage', function (k) { return k - 1; }, Vn.lagen, l, ' data-v="' + v.id + '"') + '</div>' + (vd(v.id).ant ? '<p class="small muted" style="margin:6px 0 0">Bärande antagande: ' + esc(vd(v.id).ant) + '</p>' : '') +
        (l !== 0 ? '<label class="field" style="margin:10px 0 0"><span>' + esc(Vn.orsak) + '</span><input type="text" data-path="vind.' + i + '.orsak.' + v.id + '" value="' + esc(s.orsak[v.id] || '') + '"></label>' : '') + '</div>';
    });
    h += '<h3>' + esc(Vn.utvecklingFraga) + '</h3>' + seg('data-utv', function (k) { return k - 1; }, Vn.utveckling, s.utv);
    h += '<label class="field" style="margin-top:16px"><span>' + esc(Vn.atgarder) + '</span><textarea rows="3" data-path="vind.' + i + '.atg">' + esc(s.atg) + '</textarea></label>';
    return h;
  }
  function renderSyntes() {
    var Sy = C.syntes, st = vardeStat(), neg = st.filter(function (s) { return s.neg.length >= 2; }), pos = st.filter(function (s) { return s.pos.length >= 2; });
    var h = head('syntes', Sy.rubrik, Sy.text);
    h += '<div class="card tight"><div class="eyebrow" style="color:#d1431d">' + esc(Sy.sarbarheter) + '</div>' + (neg.length ? neg.map(function (s) { return '<p class="small" style="margin-bottom:4px"><b>' + esc(s.v.namn) + '</b> <span class="muted">(' + s.neg.length + ' av 4: ' + esc(lista(s.neg.map(scenNamn))) + ')</span></p>'; }).join('') : '<p class="small muted" style="margin:0">' + esc(Sy.inga) + '</p>') +
      (pos.length ? '<div class="eyebrow" style="margin-top:12px">' + esc(Sy.styrkor) + '</div>' + pos.map(function (s) { return '<p class="small" style="margin-bottom:4px"><b>' + esc(s.v.namn) + '</b> <span class="muted">(' + s.pos.length + ' av 4)</span></p>'; }).join('') : '') + '</div>';
    h += '<div class="tablewrap" style="margin-bottom:18px"><table class="facil"><thead><tr><th>Framtid</th><th>Verksamheten</th><th>Åtgärder</th></tr></thead><tbody>' + [0, 1, 2, 3].map(function (i) { var u = state.vind[i].utv; return '<tr><td><b>' + esc(scenNamn(i)) + '</b></td><td>' + (u === null ? '' : esc(C.vind.utveckling[u + 1])) + '</td><td>' + esc(state.vind[i].atg) + '</td></tr>'; }).join('') + '</tbody></table></div>';
    h += '<label class="field"><span>' + esc(Sy.monster) + '</span><textarea rows="3" data-path="syntes.monster">' + esc(state.syntes.monster) + '</textarea></label>';
    h += '<label class="field"><span>' + esc(Sy.robusta) + '</span><textarea rows="4" data-path="syntes.robusta">' + esc(state.syntes.robusta) + '</textarea></label>';
    h += '<h3>' + esc(Sy.signalerRubrik) + '</h3><p class="muted small">' + esc(Sy.signalerText) + '</p>' + [0, 1, 2, 3].map(function (i) { return '<label class="field"><span>' + esc(scenNamn(i)) + '</span><input type="text" data-path="syntes.signaler.' + i + '" value="' + esc(state.syntes.signaler[i]) + '"></label>'; }).join('');
    h += '<span style="display:block;font-weight:600;font-size:15px;margin-bottom:6px">' + esc(Sy.samlad) + '</span>' + seg('data-samlad', function (k) { return k - 1; }, C.vind.utveckling, state.syntes.samlad);
    h += '<label class="field" style="margin-top:16px"><span>' + esc(Sy.osakert) + '</span><textarea rows="2" data-path="syntes.osakert">' + esc(state.syntes.osakert) + '</textarea></label>';
    return h;
  }
  function renderKarta() {
    var K = C.karta, fs = kollForslag().filter(function (f) { return !state.kollisioner.some(function (k) { return k.fran === f.fran; }); });
    var h = head('karta', K.rubrik, K.text) + omNote('karta');
    if (fs.length && state.kollisioner.length < 3) h += '<div class="card tight"><div class="eyebrow">' + esc(K.forslag) + '</div>' + fs.map(function (f) { return '<div class="prop"><div><b>' + esc(f.namn) + '</b><p class="small muted" style="margin:2px 0 0">' + esc(f.varfor) + '</p></div><button class="btn ghost small-btn" data-act="addkoll" data-fran="' + f.fran + '">' + esc(K.laggTill) + '</button></div>'; }).join('') + '</div>';
    state.kollisioner.forEach(function (k, i) {
      h += '<div class="card koll"><div class="koll-head"><span class="kollnr">' + (i + 1) + '</span><input type="text" data-path="kollisioner.' + i + '.namn" value="' + esc(k.namn) + '" aria-label="' + esc(K.namn) + '"><button class="del" data-act="delkoll" data-i="' + i + '" aria-label="Ta bort">×</button></div>' +
        '<label class="field"><span>' + esc(K.antagande) + '</span><input type="text" data-path="kollisioner.' + i + '.ant" value="' + esc(k.ant) + '"></label>' +
        '<span class="lbl">' + esc(K.tryck) + '</span>' + seg('data-kt', function (x) { return x + 1; }, K.tryckSkala, k.tryck, ' data-i="' + i + '"') +
        '<span class="lbl">' + esc(K.tempo) + '</span>' + seg('data-ke', function (x) { return x; }, K.tempoSkala, k.tempo, ' data-i="' + i + '"') +
        '<span class="lbl">' + esc(K.synlighet) + '</span>' + seg('data-ks', function (x) { return x + 1; }, K.synlighetSkala, k.syn, ' data-i="' + i + '"') +
        (k.tryck >= 4 && k.syn && k.syn <= 2 ? '<div class="note weak small" style="margin:12px 0 0">' + esc(K.doldNot) + '</div>' : '') + '</div>';
    });
    if (state.kollisioner.length < 3) h += '<button class="btn ghost" data-act="addkoll">' + esc(K.egen) + '</button>'; else h += '<p class="hint">' + esc(K.max) + '</p>';
    if (state.kollisioner.some(kollKlar)) h += '<div class="card tight chartcard" style="margin-top:18px"><div class="chart">' + kartaSVG() + '</div>' + kollLegend() + '<p class="small muted" style="margin:6px 0 0">Streckad ring: låg synlighet. Större cirkel: högre tryck.</p></div>';
    var sf = seeForslag();
    h += '<h3>' + esc(K.scenarioRubrik) + '</h3><p class="muted small">' + esc(K.scenarioText) + '</p><div class="decisions">';
    [0, 1, 2, 3].forEach(function (i) { h += '<button class="choice" data-see="' + i + '" aria-pressed="' + (state.seeScen === i) + '"><span><b>' + esc(scenNamn(i)) + (i === sf ? '<span class="tag">föreslagen</span>' : '') + '</b><span class="desc">' + esc(state.scen[i].text) + '</span></span></button>'; });
    h += '</div>';
    if (state.seeScen !== null && state.seeScen !== sf) h += '<label class="field"><span>' + esc(K.scenarioMotivering) + '</span><textarea data-path="seeMotivering" rows="2">' + esc(state.seeMotivering) + '</textarea></label>';
    return h;
  }

  /* ---------- rapport ---------- */
  function robusta() { return state.syntes.robusta.split('\n').map(function (x) { return x.trim(); }).filter(Boolean); }
  function lamnar() {
    var K = C.karta, see = state.seeScen;
    return {
      fokusfraga: state.fokus.fraga, horisont: state.fokus.horisont,
      fokus: state.fokus.utmaningar.map(function (u) { return utmaning(u).namn; }).concat(state.fokus.egen.trim() ? [state.fokus.egen.trim()] : []),
      scenario: see === null ? { namn: '', text: '' } : { namn: scenNamn(see), text: state.scen[see].text },
      scenarier: [0, 1, 2, 3].map(function (i) { return { namn: scenNamn(i), text: state.scen[i].text, kombination: kombText(i), utveckling: state.vind[i].utv === null ? null : C.vind.utveckling[state.vind[i].utv + 1] }; }),
      axlar: axlar().map(function (id) { return { trend: tname(id), svag: andp(id).svag, stark: andp(id).stark }; }),
      forutbestamda: forutbestamda().map(tname),
      drivande: urval().filter(function (id) { return sums().r[id].kat === 'drivande'; }).map(tname),
      kollisioner: state.kollisioner.map(function (k) { return { namn: k.namn, antagande: k.ant, tryck: k.tryck, tempo: k.tempo == null ? null : K.tempoSkala[k.tempo], tempoIndex: k.tempo, synlighet: k.syn, varde: k.fran ? (varde(k.fran) || {}).namn : null }; }),
      robustaAtgarder: robusta(), signaler: state.syntes.signaler.slice()
    };
  }
  function envelope() { return LCA.wrap({ modul: 'sense', version: C.version, skapad: state.skapad, organisation: { namn: state.meta.foretag, typ: state.meta.typ, deltagare: state.meta.namn }, data: state, lamnar: lamnar(), kedja: state.kedja || {} }); }
  function sammanfattning() {
    var S = C.rapport.sammanfattning, org = state.meta.foretag || 'Organisationen', ax = axlar(), A = andp(ax[0] || ''), B = andp(ax[1] || '');
    function lc(x) { return /^[A-ZÅÄÖ][a-zåäö]/.test(x) ? x.charAt(0).toLowerCase() + x.slice(1) : x; }
    var intro = [fill(S.inledning, { org: org, fraga: state.fokus.fraga.trim().replace(/[?.]$/, '') + (/[?]$/.test(state.fokus.fraga.trim()) ? '?' : ''), horisont: state.fokus.horisont }),
      fill(axelBytt() || axelVarningar().length ? (S.grundEget || S.grund) : S.grund, { n: validTrends().length, a: tname(ax[0]), b: tname(ax[1]) })];
    if (forutbestamda().length) intro.push(fill(S.forutbestamda, { lista: lista(forutbestamda().map(function (id) { return '”' + lc(tname(id)) + '”'; })) }));
    var st = vardeStat();
    var framtider = [0, 1, 2, 3].map(function (i) {
      var k = kombination(i), u = state.vind[i].utv;
      var neg = st.filter(function (s) { return s.neg.indexOf(i) >= 0; }).map(function (s) { return lc(s.v.namn); });
      var pos = st.filter(function (s) { return s.pos.indexOf(i) >= 0; }).map(function (s) { return lc(s.v.namn); });
      var t = fill(S.framtid, { namn: scenNamn(i), a: lc(k.aStark ? A.stark : A.svag), b: lc(k.bStark ? B.stark : B.svag), utv: u === null ? S.utvecklingSaknas : S.utveckling[String(u)] });
      if (neg.length) t += ' ' + fill(S.forsvagas, { lista: lista(neg) });
      if (pos.length) t += ' ' + fill(S.starks, { lista: lista(pos) });
      return { i: i, text: t, till: state.seeScen === i };
    });
    var efter = [], negF = st.filter(function (s) { return s.neg.length >= 2; }), posF = st.filter(function (s) { return s.pos.length >= 2; });
    efter.push(negF.length ? fill(S.sarbar, { lista: lista(negF.map(function (s) { return lc(s.v.namn); })) }) : S.ingenSarbar);
    if (posF.length) efter.push(fill(S.styrka, { lista: lista(posF.map(function (s) { return lc(s.v.namn); })) }));
    if (state.kollisioner.length) efter.push(fill(S.kollisioner, { antal: state.kollisioner.length === 1 ? 'en framtidskollision' : state.kollisioner.length + ' framtidskollisioner' }));
    if (state.seeScen !== null) efter.push(fill(S.vidare, { scen: scenNamn(state.seeScen) }));
    var K = C.karta, slut = state.kollisioner.filter(kollKlar).slice().sort(function (a, b) { return b.tryck - a.tryck || a.tempo - b.tempo; }).map(function (k) {
      var t = (k.ant ? fill(S.kollision, { ant: k.ant }) + ' ' : '') + fill(S.kollisionMatt, { tryck: (K.tryckSkala[k.tryck - 1] || '').toLowerCase(), tempo: (K.tempoSkala[k.tempo] || '').toLowerCase() });
      if (k.syn <= 2) t += ' ' + S.dold;
      return { titel: k.namn, text: t };
    });
    if (robusta().length) slut.push({ titel: S.robustaTitel, text: fill(S.robustaText, { lista: lista(robusta().map(lc)) }) });
    return { rubrik: S.rubrik, intro: intro, framtiderRubrik: fill(S.framtiderRubrik, { org: org }), framtider: framtider, efter: efter, slutsatserRubrik: S.slutsatserRubrik, slutsatser: slut };
  }
  function senseBlock() {
    var sm = sammanfattning(), S = C.rapport.sammanfattning, nk = state.kollisioner.length;
    var kollItems = sm.slutsatser.filter(function (r) { return r.titel !== S.robustaTitel; });
    var analys = [{ titel: sm.framtiderRubrik, text: '' }].slice(0, 0)
      .concat(sm.framtider.map(function (f) { return f.text + (f.till ? ' (tas vidare till See)' : ''); }))
      .concat(sm.efter.filter(function (e, i) { return i < sm.efter.length - (state.seeScen !== null ? 1 : 0) - (nk ? 1 : 0); }))
      .concat(kollItems.map(function (r) { return { titel: 'Kollision: ' + r.titel, text: r.text }; }));
    var dr = urval().filter(function (id) { return sums().r[id].kat === 'drivande'; }).map(function (id) { return '”' + tname(id) + '”'; });
    if (dr.length) analys.push({ titel: 'Drivande trender', text: lista(dr) + '.' });
    var forslag = [];
    if (robusta().length) forslag.push({ titel: S.robustaTitel, text: fill(S.robustaText, { lista: lista(robusta()) }) });
    var sig = state.syntes.signaler.map(function (x, i) { return x.trim() ? scenNamn(i) + ': ' + x.trim() : ''; }).filter(Boolean);
    if (sig.length) forslag.push({ titel: C.syntes.signalerRubrik, text: sig.join('. ') + '.' });
    if (state.seeScen !== null) forslag.push({ titel: C.rapport.nastaRubrik, text: fill(S.vidare, { scen: scenNamn(state.seeScen) }) });
    var sam = [sm.intro.join(' ')];
    if (nk) sam.push(fill(S.kollisioner, { antal: nk === 1 ? 'en framtidskollision' : nk + ' framtidskollisioner' }) + ' ' + lista(state.kollisioner.map(function (k) { return '”' + k.namn + '”'; })) + '.');
    return { sammanfattning: sam, analys: analys, forslag: forslag };
  }
  function sammanfattningHTML() { return LCA.reportBlock(senseBlock()); }
  function renderRapport() {
    var R = C.rapport, m = state.meta, K = C.karta, h = '';
    h += '<div class="eyebrow">' + esc(R.rubrik) + ' · Sense</div><h2>' + esc(m.foretag || 'Er organisation') + '</h2><p class="muted">' + esc(m.datum) + ' · ' + (m.typ === 'grupp' ? 'Grupparbete' : 'Individuellt arbete') + (m.namn ? ' · ' + esc(m.namn) : '') + ' · Tidshorisont ' + state.fokus.horisont + ' år</p>';
    h += '<div class="actions" style="margin:0 0 18px"><button class="btn" data-act="pdf">Ladda ner rapport (PDF)</button><button class="btn ghost" data-act="savefile">Spara sparfil</button></div>';
    h += sammanfattningHTML();
    h += '<h3>Fyra framtider</h3><div class="scen-grid report">' + [0, 1, 2, 3].map(function (i) { var u = state.vind[i].utv; return '<div class="card tight' + (state.seeScen === i ? ' chosen' : '') + '">' + (state.seeScen === i ? '<div class="eyebrow">Till See</div>' : '') + '<b>' + esc(scenNamn(i)) + '</b><p class="small muted" style="margin:4px 0">' + esc(kombText(i)) + '</p><p class="small" style="margin:0">' + esc(state.scen[i].text) + '</p>' + (u !== null ? '<p class="small" style="margin:6px 0 0"><b>Verksamheten:</b> ' + esc(C.vind.utveckling[u + 1].toLowerCase()) + '</p>' : '') + '</div>'; }).join('') + '</div>';
    h += '<h3>Collision Map</h3><div class="card tight chartcard"><div class="chart">' + kartaSVG() + '</div>' + kollLegend() + '</div>';
    state.kollisioner.forEach(function (k, i) { h += '<div class="card tight"><b>' + (i + 1) + '. ' + esc(k.namn) + '</b><p class="small" style="margin:4px 0">Utmanat antagande: ' + esc(k.ant || '(ej angivet)') + '</p><p class="small muted" style="margin:0">Tryck ' + k.tryck + ' av 5 (' + esc((K.tryckSkala[k.tryck - 1] || '').toLowerCase()) + ') · Tempo: ' + esc((K.tempoSkala[k.tempo] || '').toLowerCase()) + ' · Synlighet ' + k.syn + ' av 5 (' + esc((K.synlighetSkala[k.syn - 1] || '').toLowerCase()) + ')</p></div>'; });
    if (state.seeMotivering && state.seeScen !== seeForslag()) h += '<p class="small"><b>Motivering till val av framtid:</b> ' + esc(state.seeMotivering) + '</p>';
    if (robusta().length) h += '<h3>Robusta åtgärder</h3><ul>' + robusta().map(function (r) { return '<li>' + esc(r) + '</li>'; }).join('') + '</ul>';
    var sig = state.syntes.signaler.map(function (s, i) { return s.trim() ? '<li><b>' + esc(scenNamn(i)) + ':</b> ' + esc(s) + '</li>' : ''; }).join('');
    if (sig) h += '<h3>Signaler att bevaka</h3><ul class="small">' + sig + '</ul>';
    if (state.syntes.monster.trim()) h += '<p><b>Gemensamma mönster:</b> ' + esc(state.syntes.monster) + '</p>';
    if (state.syntes.samlad !== null) h += '<p><b>Samlad bedömning:</b> verksamheten ' + esc({ '-1': 'försämras', '0': 'står sig', '1': 'förbättras' }[state.syntes.samlad]) + ' på längre sikt.</p>';
    if (state.syntes.osakert.trim()) h += '<p><b>Fortfarande osäkert:</b> ' + esc(state.syntes.osakert) + '</p>';
    h += '<h3>Vilka trender driver utvecklingen?</h3><div class="card tight chartcard"><div class="chart">' + matrisSVG() + '</div>' + legendHTML(urval()) + '</div>';
    if (forutbestamda().length) h += '<p class="small"><b>Förutbestämda element:</b> ' + esc(forutbestamda().map(tname).join('; ')) + '</p>';
    if (state.axlar.motivering && axelBytt()) h += '<p class="small"><b>Motivering till val av axlar:</b> ' + esc(state.axlar.motivering) + '</p>';
    h += '<h3>Bärande delar och antaganden</h3><div class="card tight">' + valdaVarden().map(function (v) { var d = vd(v.id); return '<p class="small" style="margin-bottom:6px"><b>' + esc(v.namn) + ':</b> ' + esc(d.hos || '') + (d.ant ? ' <span class="muted">Bärande antagande: ' + esc(d.ant) + '</span>' : '') + '</p>'; }).join('') + '</div>';
    if (state.parkering.trim()) h += '<h3>Parkerade frågor</h3><p class="small" style="white-space:pre-wrap">' + esc(state.parkering) + '</p>';
    h += '<div class="card tight next"><div class="eyebrow">' + esc(R.nastaRubrik) + '</div><p class="small">' + esc(R.nastaText) + '</p><div class="actions" style="margin-top:8px"><button class="btn" data-act="tosee">' + esc(R.tillSee) + ' →</button><button class="btn ghost" data-act="savefile">Spara sparfil</button></div>' + (R.tillampningText ? '<p class="small" style="margin:14px 0 0">' + esc(R.tillampningText) + '</p><div class="actions" style="margin-top:8px"><button class="btn ghost" data-act="totill">' + esc(R.tillTillampning) + ' →</button></div>' : '') + '</div>';
    h += LCA.teoriHTML();
    return h + '<div class="actions"><button class="btn quiet" data-act="restart">Börja om med en ny körning</button></div>';
  }

  /* ---------- rendering ---------- */
  function render() {
    var st = view.step, s = steps(), i = s.indexOf(st), html = '';
    if (i < 0) { view.step = st = resumeStep(); s = steps(); i = s.indexOf(st); }
    if (st === 'start') html = renderStart();
    else if (st === 'uppgifter') html = renderMeta();
    else if (st === 'fokus') html = renderFokus();
    else if (st === 'signaler') { seedTrender(); save(); html = renderSignaler(); }
    else if (st === 'bedomning') html = renderBedomning();
    else if (st === 'urval') html = renderUrval();
    else if (/^q-/.test(st)) html = renderFraga(+st.slice(2));
    else if (st === 'matris') html = renderMatris();
    else if (st === 'axlar') html = renderAxlar();
    else if (st === 'scenarier') html = renderScenarier();
    else if (st === 'varden') html = renderVarden();
    else if (/^vind-/.test(st)) html = renderVind(+st.slice(5));
    else if (st === 'syntes') html = renderSyntes();
    else if (st === 'karta') html = renderKarta();
    else if (st === 'rapport') html = renderRapport();
    if (st !== 'start' && st !== 'rapport') {
      if (st !== 'uppgifter') html += parking();
      var nxt = s[i + 1] === 'rapport' ? 'Visa rapporten' : 'Nästa';
      html += '<div class="navrow"><button class="btn quiet" data-act="back">← Tillbaka</button><button class="btn quiet savebtn" data-act="savefile" title="Ladda ner en sparfil så att arbetet inte går förlorat">Spara sparfil</button><button class="btn" data-act="next"' + (canNext() ? '' : ' disabled') + '>' + nxt + ' →</button></div><div class="missing" id="missing" aria-live="polite">' + missingHTML() + '</div>';
    }
    var sk = st === 'rapport' ? 'rapport' : skede(st);
    if (sk != null) html = LCA.withIntro(html, (C.skedeIntro || {})[sk], 'sense-' + sk);
    app.innerHTML = html;
    document.getElementById('progress-bar').style.width = (st === 'start' ? 0 : Math.round(i / (s.length - 1) * 100)) + '%';
  }
  function missingHTML() { var m = canNext() ? [] : saknas(); return m.length ? '<b>För att gå vidare:</b> ' + m.map(esc).join(' ') : ''; }
  function refreshNext() { var b = app.querySelector('[data-act=next]'); if (b) b.disabled = !canNext(); var h = document.getElementById('missing'); if (h) h.innerHTML = missingHTML(); }

  /* ---------- händelser ---------- */
  app.addEventListener('click', function (e) {
    var t = e.target.closest('button'); if (!t) return;
    var act = t.getAttribute('data-act'), d = function (a) { return t.getAttribute(a); };
    if (act === 'next') { if (canNext()) nav(1); return; }
    if (act === 'back') { nav(-1); return; }
    if (act === 'new') { if (!load() || confirmReset()) { state = fresh(); save(); go('uppgifter'); } return; }
    if (act === 'resume') { state = load(); go(state.steg && state.steg !== 'start' && steps().indexOf(state.steg) >= 0 ? state.steg : resumeStep()); return; }
    if (act === 'open') { document.getElementById('file-load').click(); return; }
    if (act === 'forarbete') { if (!load() || confirmReset()) { state = fresh(); state.forarbete = true; state.meta.typ = 'individ'; save(); go('uppgifter'); } return; }
    if (act === 'merge') { document.getElementById('file-merge').click(); return; }
    if (act === 'fromhandoff') { var ho = LCA.takeHandOff(); LCA.clearHandOff(); if (ho && (!load() || confirmReset())) useEnv(ho); return; }
    if (act === 'dropho') { LCA.clearHandOff(); render(); return; }
    if (act === 'savefile') { var env = envelope(); LCA.download(env, LCA.fileName(env)); toast('Sparfilen är nedladdad.'); return; }
    if (act === 'pdf') { makePDF(); return; }
    if (act === 'tosee') { LCA.handOff(envelope()); window.location.href = '../see/'; return; }
    if (act === 'totill') { LCA.handOff(envelope()); window.location.href = '../tillampningar/'; return; }
    if (act === 'restart') { if (confirmReset()) { state = fresh(); save(); go('start'); } return; }
    if (act === 'deltrend') { state.trender = state.trender.filter(function (x) { return x.id !== d('data-id'); }); delete state.bed[d('data-id')]; if (state.urval) state.urval = state.urval.filter(function (x) { return x !== d('data-id'); }); save(); rerender(); return; }
    if (act === 'addrow') { addRow(d('data-om'), true); save(); rerender(); return; }
    if (act === 'addex') { var ex = exempel(d('data-om')).filter(function (e) { return e.trend === d('data-ex'); })[0]; if (ex) { state.trender.push({ id: 't' + state.nextId++, omrade: d('data-om'), signal: ex.signal, trend: ex.trend }); save(); rerender(); } return; }
    if (act === 'addarea') { addRow(d('data-om'), false); save(); rerender(); return; }
    if (act === 'addvarde') { var inp = document.getElementById('egetvarde'); if (inp && inp.value.trim()) { var id = 'e' + (state.egnaVarden.length + 1); state.egnaVarden.push({ id: id, namn: inp.value.trim(), text: '', exempel: '' }); vd(id).med = true; save(); rerender(); } return; }
    if (act === 'addkoll') {
      if (state.kollisioner.length >= 3) return;
      var f = d('data-fran') ? kollForslag().filter(function (x) { return x.fran === d('data-fran'); })[0] : null;
      state.kollisioner.push({ namn: f ? f.namn : '', ant: f ? f.ant : '', tryck: null, tempo: null, syn: null, fran: f ? f.fran : null }); save(); rerender(); return;
    }
    if (act === 'delkoll') { state.kollisioner.splice(+d('data-i'), 1); save(); rerender(); return; }
    if (t.hasAttribute('data-horisont')) { state.fokus.horisont = +d('data-horisont'); if (!state.fokus.fragaAndrad) state.fokus.fraga = forslagFraga(); save(); rerender(); return; }
    if (t.hasAttribute('data-bp') || t.hasAttribute('data-bs')) { var id2 = d('data-id'); state.bed[id2] = state.bed[id2] || {}; if (t.hasAttribute('data-bp')) state.bed[id2].p = +d('data-bp'); else state.bed[id2].s = +d('data-bs'); state.urval = null; state.axlar.val = null; save(); rerender(); return; }
    if (t.hasAttribute('data-mv')) { var p = pairs()[+view.step.slice(2)]; state.m[p[0] + '>' + p[1]] = +d('data-mv'); state.axlar.val = null; save(); rerender(); setTimeout(function () { nav(1); }, 220); return; }
    if (t.hasAttribute('data-lage')) { state.vind[+view.step.slice(5)].lage[d('data-v')] = +d('data-lage'); save(); rerender(); return; }
    if (t.hasAttribute('data-utv')) { state.vind[+view.step.slice(5)].utv = +d('data-utv'); save(); rerender(); return; }
    if (t.hasAttribute('data-samlad')) { state.syntes.samlad = +d('data-samlad'); save(); rerender(); return; }
    if (t.hasAttribute('data-kt')) { state.kollisioner[+d('data-i')].tryck = +d('data-kt'); save(); rerender(); return; }
    if (t.hasAttribute('data-ke')) { state.kollisioner[+d('data-i')].tempo = +d('data-ke'); save(); rerender(); return; }
    if (t.hasAttribute('data-ks')) { state.kollisioner[+d('data-i')].syn = +d('data-ks'); save(); rerender(); return; }
    if (t.hasAttribute('data-see')) { state.seeScen = +d('data-see'); save(); rerender(); return; }
  });
  app.addEventListener('input', function (e) {
    var t = e.target;
    if (t.hasAttribute('data-path')) {
      setPath(state, t.getAttribute('data-path'), t.value);
      if (t.hasAttribute('data-fraga')) state.fokus.fragaAndrad = true;
      if (t.hasAttribute('data-refokus') && !state.fokus.fragaAndrad) { state.fokus.fraga = forslagFraga(); var fq = app.querySelector('[data-fraga]'); if (fq) fq.value = state.fokus.fraga; }
      if (t.getAttribute('data-path') === 'meta.foretag' && !state.fokus.fragaAndrad && state.fokus.fraga) state.fokus.fraga = forslagFraga();
      save(); refreshNext(); return;
    }
    if (t.hasAttribute('data-trend')) { var tr = trend(t.getAttribute('data-trend')); if (tr) { tr[t.getAttribute('data-f')] = t.value; save(); refreshNext(); } }
  });
  app.addEventListener('change', function (e) {
    var t = e.target;
    if (t.name === 'typ') { state.meta.typ = t.value; save(); rerender(); return; }
    if (t.hasAttribute('data-utm')) { var u = t.getAttribute('data-utm'), a = state.fokus.utmaningar; if (t.checked) a.push(u); else a.splice(a.indexOf(u), 1); if (!state.fokus.fragaAndrad) state.fokus.fraga = forslagFraga(); save(); rerender(); return; }
    if (t.hasAttribute('data-urval')) { var id = t.getAttribute('data-urval'), v = state.urval; if (t.checked) { if (v.length >= 5) { t.checked = false; toast('Välj högst fem trender.'); return; } v.push(id); } else v.splice(v.indexOf(id), 1); state.axlar.val = null; save(); rerender(); return; }
    if (t.hasAttribute('data-axel')) { var ax = t.getAttribute('data-axel'), av = state.axlar.val; if (t.checked) { if (av.length >= 2) { t.checked = false; toast('Välj två axlar. Avmarkera en först.'); return; } av.push(ax); } else av.splice(av.indexOf(ax), 1); save(); rerender(); return; }
    if (t.hasAttribute('data-varde')) { vd(t.getAttribute('data-varde')).med = t.checked; save(); rerender(); return; }
  });
  app.addEventListener('toggle', function (e) { if (e.target.classList && e.target.classList.contains('parking')) view.parkOpen = e.target.open; }, true);
  document.getElementById('brand').addEventListener('click', function (e) { e.preventDefault(); go('start'); });
  function confirmReset() { return window.confirm('Den påbörjade körningen i den här webbläsaren ersätts. Spara en sparfil först om ni vill behålla den. Fortsätta?'); }
  function useEnv(env) {
    if (env.modul !== 'sense') { toast('Det här är en sparfil från ' + LCA.NAMN[env.modul] + '. Öppna den i ' + LCA.NAMN[env.modul] + '.'); return; }
    state = env.data; state.kedja = env.kedja || {}; save(); go(resumeStep());
  }
  function norm(x) { return String(x || '').toLowerCase().replace(/[^a-zåäö0-9]+/g, ' ').trim(); }
  function mergeEnvs(envs) {
    var added = 0, dup = 0, who = [];
    envs.forEach(function (env, n) {
      if (env.modul !== 'sense') { toast('En av filerna kommer från ' + LCA.NAMN[env.modul] + ' och hoppades över.'); return; }
      var d = env.data || {}, namn = (d.meta && (d.meta.namn || d.meta.foretag)) || ('Deltagare ' + (n + 1));
      if (who.indexOf(namn) < 0) who.push(namn);
      (d.trender || []).forEach(function (t) {
        if (!(t.trend || '').trim()) return;
        var same = state.trender.filter(function (x) { return norm(x.trend) === norm(t.trend); })[0];
        if (same) { dup++; same.fran = same.fran || []; if (same.fran.indexOf(namn) < 0) same.fran.push(namn); return; }
        var oid = omrade(t.omrade) ? t.omrade : 'ekonomi';
        if (state.seedade.indexOf(oid) < 0) state.seedade.push(oid);
        state.trender.push({ id: 't' + state.nextId++, omrade: oid, signal: t.signal || '', trend: t.trend, fran: [namn] }); added++;
      });
    });
    save(); rerender();
    if (who.length) toast(fill(C.forarbete.resultat, { n: added, d: who.length === 1 ? '1 deltagare' : who.length + ' deltagare', dubbletter: dup }));
  }
  document.getElementById('file-merge').addEventListener('change', function (e) {
    var files = Array.prototype.slice.call(e.target.files), out = [], left = files.length; e.target.value = ''; if (!left) return;
    files.forEach(function (f) { LCA.readFile(f, function (env, err) { if (err) toast(err); else out.push(env); if (--left === 0) mergeEnvs(out); }); });
  });
  document.getElementById('file-load').addEventListener('change', function (e) {
    var f = e.target.files[0]; e.target.value = ''; if (!f) return;
    LCA.readFile(f, function (env, err) { if (err) { toast(err); return; } if (env.modul === 'sense' && load() && load().trender.length && !confirmReset()) return; useEnv(env); });
  });

  /* ---------- PDF ---------- */
  function makePDF() {
    if (!window.jspdf) { toast('PDF-funktionen kunde inte laddas.'); return; }
    var doc = new window.jspdf.jsPDF({ unit: 'mm', format: 'a4' }), L = 18, Wt = 174, PH = 297, y = 20, m = state.meta, K = C.karta;
    var INK = [20, 20, 20], MUT = [92, 92, 92], ACC = [20, 20, 20], WEAK = [209, 67, 29];
    function ensure(h) { if (y + h > PH - 20) { doc.addPage(); y = 20; } }
    function text(t, o) {
      o = o || {}; var size = o.size || 10, lh = size * 0.42 + 1.2;
      doc.setFont('helvetica', o.bold ? 'bold' : o.italic ? 'italic' : 'normal'); doc.setFontSize(size); doc.setTextColor.apply(doc, o.color || INK);
      doc.splitTextToSize(String(t), o.width || Wt).forEach(function (ln) { ensure(lh); doc.text(ln, o.x || L, y); y += lh; });
      y += o.after == null ? 2 : o.after;
    }
    function label(t, col) { ensure(10); text(t.toUpperCase(), { size: 8, bold: true, color: col || ACC, after: 1 }); }
    function rule() { ensure(6); doc.setDrawColor(220, 220, 216); doc.line(L, y, L + Wt, y); y += 6; }
    function chart(svg, hmm) {
      var holder = document.createElement('div'); holder.style.cssText = 'position:absolute;left:-9999px;top:0;width:640px'; holder.innerHTML = svg; document.body.appendChild(holder);
      var el = holder.querySelector('svg'), vb = el.getAttribute('viewBox').split(' '); el.setAttribute('width', vb[2]); el.setAttribute('height', vb[3]);
      ensure(hmm + 4); var y0 = y; y += hmm + 4;
      return doc.svg(el, { x: L, y: y0, width: Wt, height: hmm }).then(function () { holder.remove(); });
    }
    text('Sense: rapport', { size: 22, bold: true, after: 1 });
    text(C.verktyg + ' · ' + C.undertitel, { size: 9.5, color: MUT, after: 6 });
    text(m.foretag || 'Er organisation', { size: 15, bold: true, after: 1 });
    text(m.datum + ' · ' + (m.typ === 'grupp' ? 'Grupparbete' : 'Individuellt arbete') + (m.namn ? ' · ' + m.namn : '') + ' · Tidshorisont ' + state.fokus.horisont + ' år', { size: 10, color: MUT, after: 5 });
    LCA.reportPDF(senseBlock(), text, label, L, Wt);
    rule(); label('Detaljer'); ensure(120); label('Collision Map', WEAK);
    chart(kartaSVG(), 108).then(function () {
      state.kollisioner.forEach(function (k, i) { text((i + 1) + '. ' + k.namn, { bold: true, after: 0.5 }); text('Utmanat antagande: ' + (k.ant || '(ej angivet)'), { size: 9.5, after: 0.5 }); text('Tryck ' + k.tryck + ' av 5 · Tempo: ' + (K.tempoSkala[k.tempo] || '').toLowerCase() + ' · Synlighet ' + k.syn + ' av 5', { size: 9, color: MUT, after: 3 }); });
      rule(); label('Fyra framtider');
      [0, 1, 2, 3].forEach(function (i) { var u = state.vind[i].utv; text(scenNamn(i) + (state.seeScen === i ? ' (tas vidare till See)' : ''), { bold: true, after: 0.5, color: state.seeScen === i ? ACC : INK }); text(kombText(i), { size: 8.5, color: MUT, after: 0.5 }); if (state.scen[i].text) text(state.scen[i].text, { size: 9.5, after: 0.5 }); if (u !== null) text('Verksamheten: ' + C.vind.utveckling[u + 1].toLowerCase() + '. ' + (state.vind[i].atg ? 'Åtgärder: ' + state.vind[i].atg : ''), { size: 9.5, after: 3 }); else y += 2; });
      if (state.seeMotivering && state.seeScen !== seeForslag()) text('Motivering till val av framtid: ' + state.seeMotivering, { size: 9.5, italic: true });
      rule(); label('Syntes');
      if (robusta().length) { text('Robusta åtgärder', { bold: true, after: 0.5 }); robusta().forEach(function (r) { text('• ' + r, { size: 9.5, after: 0.5 }); }); y += 2; }
      state.syntes.signaler.forEach(function (s, i) { if (s.trim()) text('Signal att bevaka (' + scenNamn(i) + '): ' + s, { size: 9.5, after: 1 }); });
      if (state.syntes.monster.trim()) text('Gemensamma mönster: ' + state.syntes.monster, { size: 9.5 });
      if (state.syntes.osakert.trim()) text('Fortfarande osäkert: ' + state.syntes.osakert, { size: 9.5 });
      rule(); ensure(125); label('Vilka trender driver utvecklingen?');
      return chart(matrisSVG(), 114);
    }).then(function () {
      var S = sums().r;
      urval().forEach(function (id) { var k = S[id].kat; text(tnr(id) + '. ' + C.matris.kategorier[k].namn + ': ' + fill(C.matris.kategorier[k].text, { trend: '”' + tname(id) + '”' }), { size: 9, after: 1.5 }); });
      if (forutbestamda().length) text('Förutbestämda element: ' + forutbestamda().map(tname).join('; '), { size: 9.5 });
      text('Axlar: ' + axlar().map(function (id) { return tname(id) + ' (svag: ' + andp(id).svag + '; stark: ' + andp(id).stark + ')'; }).join(' · '), { size: 9.5 });
      if (state.axlar.motivering && axelBytt()) text('Motivering till val av axlar: ' + state.axlar.motivering, { size: 9.5, italic: true });
      rule(); label('Fokus'); text(state.fokus.fraga, { bold: true });
      rule(); label('Bärande delar och antaganden');
      valdaVarden().forEach(function (v) { var d = vd(v.id); text(v.namn + ': ' + (d.hos || '') + (d.ant ? ' Bärande antagande: ' + d.ant : ''), { size: 9.5, after: 1 }); });
      rule(); label('Alla trender');
      validTrends().forEach(function (t) { var k = klass(t.id); text(tnr(t.id) + '. ' + t.trend + (k ? ' (' + C.bedomning.klasser[k].namn.toLowerCase() + ')' : '') + (t.signal ? '. Signal: ' + t.signal : ''), { size: 8.5, after: 0.8 }); });
      if (state.parkering.trim()) { rule(); label('Parkerade frågor'); text(state.parkering, { size: 9.5 }); }
      rule(); label('Vetenskaplig grund', MUT); text(LCA.TEORI.text + ': ' + LCA.TEORI.url, { size: 8.5, color: MUT });
      text(C.integritet, { size: 8, color: MUT });
      var n = doc.getNumberOfPages(), logo = document.querySelector('.footer img'); if (logo && !logo.complete) logo = null;
      for (var i = 1; i <= n; i++) { doc.setPage(i); doc.setFont('helvetica', 'normal'); doc.setFontSize(7.5); doc.setTextColor.apply(doc, MUT); doc.text(C.verktyg + ' · Sense · ' + C.version + ' · ' + C.upphov, L, PH - 10); doc.text('Sida ' + i + ' av ' + n, L + Wt, PH - 10, { align: 'right' }); if (logo) { try { doc.addImage(logo, 'PNG', L + Wt - 24, PH - 13.6, 4.5, 4.5); } catch (e) {} } }
      doc.save('lca-sense-rapport-' + LCA.slug(m.foretag) + '-' + m.datum + '.pdf');
    }).catch(function (err) { console.error(err); toast('Rapporten kunde inte skapas. Försök igen.'); });
  }

  document.getElementById('footer').innerHTML = '<span class="maker"><img src="../img/mickla.png" alt="Mickla" width="22" height="22">' + esc(C.upphov) + '</span><span>' + esc(C.verktyg) + ' · Sense · ' + esc(C.version) + '</span>';
  render();
  window.__sense = { state: function () { return state; }, go: go, set: function (s) { state = s; save(); }, envelope: envelope, steps: steps };
})();
