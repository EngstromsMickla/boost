/* Dialogverktyg — Learning Curve Approach: Shift.
   Statisk app, all data stannar i webbläsaren. © Engströms Mickla AB 2026 */
(function () {
  'use strict';
  var C = window.CONTENT;
  var KEY = LCA.NYCKLAR.shift;
  var app = document.getElementById('app');
  var state = load() || fresh();
  var view = { step: 'start', parkOpen: false };
  var DAGAR = [7, 14, 30];
  var AX = ['formaga', 'mandat', 'vilja'];

  /* ---------- hjälpfunktioner ---------- */
  function today() { return new Date().toISOString().slice(0, 10); }
  function fresh() {
    return { app: 'shift', format: 1, version: C.version, skapad: new Date().toISOString(), andrad: null, nextId: 1,
      meta: { foretag: '', datum: today(), typ: 'grupp', namn: '' }, kedja: {},
      eget: { utmaning: '', behov: [{ id: 'b1', text: '', axel: null, niva: null }] },
      fragor: [], ram: { motto: '', ansvarig: '', datum: '', stod: [], hinder: '', rubriker: {} },
      forsok: [], period: { monster: '', fragaVal: {}, skala: '', hinder: '', nasta: '', avslutad: false }, parkering: '' };
  }
  function load() { try { var s = localStorage.getItem(KEY); return s ? JSON.parse(s) : null; } catch (e) { return null; } }
  function save() { state.andrad = new Date().toISOString(); try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) {} }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function fill(t, map) { return t.replace(/\{(\w+)\}/g, function (m, k) { return map[k] != null ? map[k] : m; }); }
  function toast(msg) { var t = document.createElement('div'); t.className = 'toast'; t.textContent = msg; document.body.appendChild(t); setTimeout(function () { t.remove(); }, 2800); }
  function lista(a) { var och = a.some(function (x) { return / och /.test(x) && !/^”/.test(x); }) ? ' samt ' : ' och '; return a.length > 1 ? a.slice(0, -1).join(', ') + och + a[a.length - 1] : (a[0] || ''); }
  function lc(x) { x = String(x || ''); return /^[A-ZÅÄÖ][a-zåäö]/.test(x) ? x.charAt(0).toLowerCase() + x.slice(1) : x; }
  function short(t, n) { t = String(t || ''); n = n || 60; return t.length > n ? t.slice(0, n - 1).trim() + '…' : t; }
  function setPath(o, p, v) { var k = p.split('.'), last = k.pop(); var t = k.reduce(function (x, kk) { if (x[kk] == null) x[kk] = {}; return x[kk]; }, o); t[last] = v; }
  function nid(p) { return p + (state.nextId++); }
  function fmt(x) { return x == null || isNaN(x) ? '–' : (Math.round(x * 10) / 10).toString().replace('.', ','); }
  function slugB(t) { return String(t).toLowerCase().replace(/[åä]/g, 'a').replace(/ö/g, 'o').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''); }
  function omNote(o) { return '<div class="note about-note"><b>Om ' + esc(/^[A-Z][a-z]+ [A-Z]/.test(o.rubrik) ? o.rubrik : lc(o.rubrik)) + '.</b> ' + esc(o.om) + ' <a href="../begrepp/#' + slugB(o.begrepp) + '" target="_blank" rel="noopener">Läs mer i begreppslistan</a></div>'; }
  function addDays(d, n) { var x = new Date(d + 'T12:00:00'); x.setDate(x.getDate() + n); return x.toISOString().slice(0, 10); }

  /* ---------- underlag från Sense och See ---------- */
  function sense() { var s = state.kedja && state.kedja.sense; return s && s.kollisioner ? s : null; }
  function see() { var s = state.kedja && state.kedja.see; return s && s.valda && s.valda.length ? s : null; }
  function kollisioner() {
    if (sense()) return sense().kollisioner.filter(function (k) { return k.namn; }).map(function (k) { return { namn: k.namn, antagande: k.antagande, tryck: k.tryck, tempo: k.tempo }; });
    if (state.eget.utmaning.trim()) return [{ namn: state.eget.utmaning.trim(), antagande: '', tryck: null, tempo: null }];
    var sc = state.kedja && state.kedja.see && state.kedja.see.scenario;
    return sc && sc.namn ? [{ namn: sc.namn, antagande: '', tryck: null, tempo: null, franSee: true }] : [];
  }
  function minAxel(ax) { return AX.slice().sort(function (a, b) { return (ax[a] == null ? 9 : ax[a]) - (ax[b] == null ? 9 : ax[b]); })[0]; }
  function behovLista() {
    if (see()) return see().valda.map(function (v) {
      var ax = v.axlar || {}, w = (v.svagastAxel || [])[0];
      var axel = w && w !== 'jamn' ? w : minAxel(ax);
      return { id: 'see-' + v.id, namn: v.namn, text: fill(C.riktning.behovMall, { formaga: lc(v.namn) }), axel: axel, jamn: w === 'jamn', fore: ax[axel] == null ? null : Math.round(ax[axel] * 10) / 10, axlar: ax, beslut: v.beslut };
    });
    return state.eget.behov.filter(function (b) { return b.text.trim() && b.axel && b.niva; }).map(function (b) { return { id: b.id, namn: b.text.trim(), text: lc(b.text.trim()), axel: b.axel, fore: b.niva, axlar: {} }; });
  }
  function behov(id) { return behovLista().filter(function (b) { return b.id === id; })[0]; }
  function axNamn(a) { return C.axlar[a] ? C.axlar[a].namn : a; }

  /* ---------- riktning ---------- */
  function fraga(id) { return state.fragor.filter(function (q) { return q.id === id; })[0]; }
  function forslagFragor() {
    var R = C.riktning, out = [], ks = kollisioner().slice().sort(function (a, b) { return (b.tryck || 0) - (a.tryck || 0); }).slice(0, 3);
    var bl = behovLista().slice(0, 3);
    (ks.length ? ks : [null]).forEach(function (k) {
      bl.forEach(function (b) {
        var text = fill(R.mallar[b.jamn ? 'jamn' : b.axel], { behov: b.text, nar: k ? fill(R.narMall, { kollision: k.namn }) : '' });
        if (!state.fragor.some(function (q) { return q.text === text; })) out.push({ text: text, kalla: b.id, axel: b.axel, fore: b.fore, kollision: k ? k.namn : '' });
      });
    });
    return out.slice(0, 6);
  }
  function addFraga(f) {
    if (state.fragor.length >= 3) { toast(C.riktning.max); return; }
    var b = f ? behov(f.kalla) : behovLista()[0];
    state.fragor.push({ id: nid('q'), text: f ? f.text : '', kalla: b ? b.id : '', axel: f ? f.axel : (b ? b.axel : 'formaga'), fore: f ? f.fore : (b ? b.fore : null), kollision: f ? f.kollision : '', rubrik: '', vi: '' });
  }

  /* ---------- försök ---------- */
  function forsok(id) { return state.forsok.filter(function (f) { return f.id === id; })[0]; }
  function forsokFor(qid) { return state.forsok.filter(function (f) { return f.fraga === qid; }); }
  function newForsok(qid, prev) {
    var q = fraga(qid), p = prev ? forsok(prev) : null;
    var f = { id: nid('f'), fraga: qid, titel: p ? short(p.av.nasta, 50) : '', skaver: p ? p.skaver : '', typ: q ? q.axel : 'formaga', om: p ? p.av.nasta : '', tror: '', nar: addDays(today(), p ? 0 : 3), var: p ? p.var : '', forutsagelse: '', matt: p ? p.matt : '', langd: 1, vem: p ? p.vem : '', behov: '', fore: prev || null, skapad: today(), av: null };
    state.forsok.push(f); return f;
  }
  function forsokKlar(f) { return f && f.titel.trim() && f.om.trim() && f.tror.trim() && f.nar && f.forutsagelse.trim(); }
  function avKlar(f) { var a = f && f.av; return a && a.hande.trim() && a.jamfort != null && a.vag != null && typeof a.axelNu === 'number' && a.beslut && a.nasta.trim(); }
  function status(f) {
    if (avKlar(f)) return 'klart';
    if (!f.nar || !forsokKlar(f)) return 'planerat';
    if (today() >= addDays(f.nar, DAGAR[f.langd])) return 'dags';
    if (today() >= f.nar) return 'pagar';
    return 'planerat';
  }
  function avlasta() { return state.forsok.filter(avKlar).sort(function (a, b) { return (a.av.datum || '').localeCompare(b.av.datum || ''); }); }
  function rorelse(q) {
    var av = forsokFor(q.id).filter(avKlar), sist = av[av.length - 1];
    return { fore: q.fore, efter: sist ? sist.av.axelNu : null };
  }

  /* ---------- steg ---------- */
  function steps() {
    var s = ['start', 'uppgifter', 'underlag', 'spel', 'riktning', 'ram'];
    state.fragor.forEach(function (q) { s.push('plan-' + q.id); });
    return s.concat(['oversikt', 'rapport']);
  }
  function sideView(st) { return /^(f|a)-/.test(st) || st === 'period'; }
  function firstForsok(qid) { return forsokFor(qid)[0]; }
  function canNext(st) {
    st = st || view.step;
    if (st === 'underlag') return behovLista().length > 0 && kollisioner().length > 0;
    if (st === 'riktning') return state.fragor.length >= 1 && state.fragor.length <= 3 && state.fragor.every(function (q) { return q.text.trim(); });
    if (/^plan-/.test(st)) return forsokKlar(firstForsok(st.slice(5)));
    if (/^f-/.test(st)) return forsokKlar(forsok(st.slice(2)));
    if (/^a-/.test(st)) return avKlar(forsok(st.slice(2)));
    return true;
  }
  function saknas(st) {
    st = st || view.step; var m = [];
    if (st === 'underlag') { if (!kollisioner().length) m.push('Beskriv förändringen eller utmaningen.'); if (!behovLista().length) m.push('Ange minst ett behov med vad som håller tillbaka och hur starkt det är i dag.'); }
    if (st === 'riktning') { if (!state.fragor.length) m.push('Välj eller skriv minst en lärandefråga.'); else if (state.fragor.some(function (q) { return !q.text.trim(); })) m.push('Skriv text i alla lärandefrågor.'); }
    if (/^(plan|f)-/.test(st)) {
      var f = /^plan-/.test(st) ? firstForsok(st.slice(5)) : forsok(st.slice(2)), F = [];
      if (f) { if (!f.titel.trim()) F.push('namn'); if (!f.om.trim()) F.push('vad ni prövar (Om vi …)'); if (!f.tror.trim()) F.push('vad ni tror ska hända'); if (!f.nar) F.push('startdatum'); if (!f.forutsagelse.trim()) F.push('förutsägelse'); }
      if (F.length) m.push('Fyll i ' + lista(F) + '.');
    }
    if (/^a-/.test(st)) {
      var a = (forsok(st.slice(2)) || {}).av || {}, A = [];
      if (!(a.hande || '').trim()) A.push('vad som hände'); if (a.jamfort == null) A.push('jämförelsen med förutsägelsen'); if (a.vag == null) A.push('lärdomens väg'); if (typeof a.axelNu !== 'number') A.push('hur starkt det är nu'); if (!a.beslut) A.push('beslut'); if (!(a.nasta || '').trim()) A.push('nästa lilla försök');
      if (A.length) m.push('Fyll i ' + lista(A) + '.');
    }
    return m;
  }
  function go(step) {
    if (/^plan-/.test(step)) { var qid = step.slice(5); if (!firstForsok(qid)) { newForsok(qid); save(); } }
    view.step = step; if (step !== 'start') { state.steg = step; save(); } render(); window.scrollTo(0, 0); app.focus({ preventScroll: true });
  }
  function nav(d) {
    if (sideView(view.step)) { go('oversikt'); return; }
    var s = steps(), i = s.indexOf(view.step); go(s[Math.max(0, Math.min(s.length - 1, i + d))]);
  }
  function resumeStep() {
    var s = steps();
    for (var i = 1; i < s.length - 2; i++) if (!canNext(s[i])) return s[i];
    return state.fragor.length ? 'oversikt' : 'riktning';
  }
  function rerender() { var y = window.scrollY; render(); window.scrollTo(0, y); }

  /* ---------- gemensamma bitar ---------- */
  function seg(attr, val, labels, cur, extra) {
    return '<div class="seg" role="group">' + labels.map(function (l, i) { var v = val(i); return '<button ' + attr + '="' + v + '"' + (extra || '') + ' aria-pressed="' + (cur === v) + '">' + esc(l) + '</button>'; }).join('') + '</div>';
  }
  function field(label, path, val, opt) {
    opt = opt || {};
    var inp = opt.area ? '<textarea data-path="' + path + '" rows="' + (opt.rows || 2) + '"' + (opt.ph ? ' placeholder="' + esc(opt.ph) + '"' : '') + '>' + esc(val) + '</textarea>' : '<input type="' + (opt.type || 'text') + '" data-path="' + path + '" value="' + esc(val) + '"' + (opt.ph ? ' placeholder="' + esc(opt.ph) + '"' : '') + '>';
    return '<label class="field"' + (opt.style ? ' style="' + opt.style + '"' : '') + '><span>' + esc(label) + '</span>' + inp + '</label>';
  }
  function parking() {
    var n = state.parkering.split('\n').filter(function (x) { return x.trim(); }).length;
    return '<details class="parking"' + (view.parkOpen ? ' open' : '') + '><summary>' + esc(C.parkering.rubrik) + (n ? ' (' + n + ')' : '') + '</summary><p class="small muted">' + esc(C.parkering.text) + '</p><textarea data-path="parkering" rows="3">' + esc(state.parkering) + '</textarea></details>';
  }
  function viText(v) { v = String(v || '').trim(); return !v ? '' : /^vi lär oss/i.test(v) ? v.charAt(0).toUpperCase() + v.slice(1) : 'Vi lär oss hur ' + v; }
  function eyebrow(t) { return '<div class="eyebrow">Shift · ' + esc(t) + '</div>'; }
  function tryckHTML() {
    var ks = kollisioner();
    if (!ks.length) return '<p class="muted small">Inget underlag.</p>';
    return '<ul class="plain">' + ks.map(function (k) { return '<li><b>' + esc(k.namn) + '</b>' + (k.antagande ? '<span class="muted small"> Utmanar: ' + esc(k.antagande) + '</span>' : '') + (k.tryck ? '<span class="muted small"> · Tryck ' + k.tryck + ' av 5' + (k.tempo ? ', ' + esc(lc(k.tempo)) : '') + '</span>' : '') + '</li>'; }).join('') + '</ul>';
  }
  function beredskapHTML() {
    var bl = behovLista();
    if (!bl.length) return '<p class="muted small">Inget underlag.</p>';
    return '<ul class="plain">' + bl.map(function (b) { return '<li><b>' + esc(b.namn) + '</b><span class="muted small"> · svagast: ' + esc(lc(axNamn(b.axel))) + (b.fore != null ? ' (' + fmt(b.fore) + ' av 5)' : '') + (b.beslut ? ' · beslut i See: ' + esc(lc(b.beslut)) : '') + '</span></li>'; }).join('') + '</ul>';
  }

  /* ---------- vyer ---------- */
  function renderStart() {
    var has = load(), ho = LCA.takeHandOff(), h = '';
    if (ho) h += '<div class="note"><b>' + (ho.modul === 'shift' ? 'En sparfil från Shift väntar.' : 'Underlag från ' + esc(LCA.NAMN[ho.modul]) + ' finns.') + '</b> ' + esc(ho.organisation.namn || '') + ' <span style="display:block;margin-top:10px"><button class="btn" data-act="fromhandoff">' + (ho.modul === 'shift' ? 'Öppna den' : 'Starta Shift med detta underlag') + '</button> <button class="btn quiet" data-act="dropho">Nej tack</button></span></div>';
    h += '<div class="eyebrow">Smart Built Boost · Shift</div><h1>' + esc(C.titel) + '</h1><p class="lead">' + esc(C.undertitel) + '</p>' + C.intro.map(function (t) { return '<p>' + esc(t) + '</p>'; }).join('');
    h += '<div class="card tight"><b>Så går det till</b><ol class="steps-ol">' + C.gang.map(function (g) { return '<li><b>' + esc(g.namn) + '.</b> ' + esc(g.text) + '</li>'; }).join('') + '</ol><p class="small muted" style="margin:0">' + esc(C.tidstext) + '</p></div>';
    var resume = has && (has.fragor.length || has.meta.foretag) ? '<div class="card"><h3>Fortsätt där ni var</h3><p class="muted small">Det finns en påbörjad körning i den här webbläsaren' + (has.meta.foretag ? ' för ' + esc(has.meta.foretag) : '') + '.</p><button class="btn" data-act="resume">Fortsätt</button></div>' : '';
    h += '<div class="startgrid">' + resume + '<div class="card"><h3>Ny körning</h3><p class="muted small">Börja från början. Har ni gjort See läser ni in den i nästa steg.</p><button class="btn" data-act="new">Starta</button></div>' +
      '<div class="card"><h3>Öppna en sparfil</h3><p class="muted small">Fortsätt en Shift-körning, eller börja från en sparfil från See eller Sense.</p><button class="btn ghost" data-act="open">Välj fil</button></div></div>';
    return h + '<p class="note small">' + esc(C.integritet) + '</p>';
  }
  function renderMeta() {
    var m = state.meta;
    return eyebrow('Förberedelse') + '<h2>Om arbetet</h2><p class="muted">Uppgifterna hamnar i rapporten. Inget av det lämnar er dator.</p><div class="card">' +
      field('Organisation', 'meta.foretag', m.foretag) + field('Datum för start', 'meta.datum', m.datum, { type: 'date' }) +
      field('Kontaktperson eller facilitator som håller i filen (frivilligt)', 'meta.namn', m.namn, { style: 'margin:0' }) + '</div>';
  }
  function tillampningar() { var t = state.kedja && state.kedja.tillampningar; return t ? Object.keys(t).map(function (k) { return t[k]; }) : []; }
  function tillampningHTML() {
    var U = C.underlag;
    return tillampningar().map(function (t) {
      return '<div class="card tight"><div class="eyebrow">' + esc(U.franTillampning) + '</div><p class="small" style="margin-bottom:6px"><b>' + esc(t.namn) + (t.objekt ? ': ' + esc(t.objekt) : '') + '</b>' + (t.samlad ? ' ' + esc(fill(U.tillampningSamlad, { samlad: lc(t.samlad) })) : '') + '</p>' +
        ((t.fallor || []).length ? '<p class="small" style="margin-bottom:6px">' + esc(fill(U.tillampningFallor, { namn: t.fallorNamn || 'Fällor', lista: lista(t.fallor.map(lc)) })) + '</p>' : '') +
        ((t.robustaAtgarder || []).length ? '<p class="small muted" style="margin-bottom:4px">' + esc(U.tillampningRobusta) + '</p><ul class="plain">' + t.robustaAtgarder.map(function (r) { return '<li class="small">' + esc(r) + '</li>'; }).join('') + '</ul>' : '') + '</div>';
    }).join('');
  }
  function renderUnderlag() {
    var U = C.underlag, h = eyebrow('Underlag') + '<h2>' + esc(U.rubrik) + '</h2><p class="muted">' + esc(U.text) + '</p>';
    h += '<div class="actions" style="margin:0 0 16px"><button class="btn ghost" data-act="open">' + esc(U.lasIn) + '</button></div>';
    h += '<div class="card tight"><div class="eyebrow">' + esc(U.fran) + '</div>';
    if (sense()) h += (sense().scenario && sense().scenario.namn ? '<p class="small" style="margin-bottom:6px">Framtid: <b>' + esc(sense().scenario.namn) + '</b></p>' : '') + tryckHTML();
    else h += '<p class="small">' + esc(U.saknasSense) + '</p>' + field(U.saknasSenseEtikett, 'eget.utmaning', state.eget.utmaning, { area: true, style: 'margin:0' });
    h += '</div>' + tillampningHTML() + '<div class="card tight"><div class="eyebrow">' + esc(U.franSee) + '</div>';
    if (see()) h += (see().index != null ? '<p class="small" style="margin-bottom:6px">Lärandeindex ' + fmt(see().index) + ' av 4, ' + esc(lc(see().omdome || '')) + '.</p>' : '') + beredskapHTML();
    else {
      if (state.kedja && state.kedja._aldre) h += '<p class="note weak small">' + esc(U.aldre) + '</p>';
      h += '<p class="small">' + esc(U.saknasSee) + '</p>';
      state.eget.behov.forEach(function (b, i) {
        h += '<div class="behov">' + field(U.behovEtikett, 'eget.behov.' + i + '.text', b.text, { ph: U.behovExempel }) +
          '<span class="lbl">' + esc(U.axelFraga) + '</span>' + seg('data-bax', function (k) { return AX[k]; }, AX.map(function (a) { return C.axlar[a].namn + ': ' + lc(C.axlar[a].fraga); }), b.axel, ' data-i="' + i + '"') +
          '<span class="lbl">' + esc(U.nivaFraga) + '</span>' + seg('data-bniva', function (k) { return k + 1; }, ['1', '2', '3', '4', '5'], b.niva, ' data-i="' + i + '"') + '</div>';
      });
      if (state.eget.behov.length < 3) h += '<button class="btn quiet small-btn" data-act="addbehov">+ ' + esc(U.laggTill) + '</button>';
    }
    return h + '</div>';
  }
  function renderRiktning() {
    var R = C.riktning, h = eyebrow('Steg 1 · Riktning') + '<h2>' + esc(R.rubrik) + '</h2>' + omNote({ rubrik: R.rubrik, om: R.om, begrepp: R.begrepp });
    h += '<div class="canvas"><div class="card tight"><div class="eyebrow">' + esc(R.falt1) + '</div>' + tryckHTML() + '</div><div class="card tight"><div class="eyebrow">' + esc(R.falt2) + '</div>' + beredskapHTML() + '</div></div>';
    h += spelFranHTML('riktning') + '<h3>' + esc(R.falt3) + '</h3><p class="muted small">' + esc(R.falt3Text) + '</p>';
    var fs = forslagFragor();
    if (fs.length && state.fragor.length < 3) h += '<div class="card tight"><div class="eyebrow">' + esc(R.forslag) + '</div>' + fs.map(function (f, i) { return '<div class="prop"><div>' + esc(f.text) + '</div><button class="btn ghost small-btn" data-act="addfraga" data-i="' + i + '">Ta med</button></div>'; }).join('') + '</div>';
    var bl = behovLista();
    state.fragor.forEach(function (q, i) {
      h += '<div class="card koll"><div class="koll-head"><span class="kollnr q">' + (i + 1) + '</span><span class="lbl" style="margin:0">' + esc(R.fragaEtikett) + '</span><button class="del" data-act="delfraga" data-i="' + i + '" aria-label="Ta bort">×</button></div>' +
        '<textarea data-path="fragor.' + i + '.text" rows="2">' + esc(q.text) + '</textarea>' +
        '<span class="lbl">' + esc(R.riktadMot) + '</span>' + (bl.length > 1 ? seg('data-qkalla', function (k) { return bl[k].id; }, bl.map(function (b) { return short(b.namn, 40); }), q.kalla, ' data-i="' + i + '"') : '<p class="small" style="margin:4px 0 8px">' + esc(bl[0] ? bl[0].namn : '') + '</p>') +
        seg('data-qaxel', function (k) { return AX[k]; }, AX.map(function (a) { return C.axlar[a].namn; }), q.axel, ' data-i="' + i + '"') + '</div>';
    });
    if (state.fragor.length < 3) h += '<button class="btn ghost" data-act="addfraga">' + esc(R.egen) + '</button>';
    return h;
  }
  function renderRam() {
    if (!state.ram.datum) { state.ram.datum = addDays(state.meta.datum || today(), 28); save(); }
    var R = C.ram, h = eyebrow('Steg 1 · Riktning') + '<h2>' + esc(R.rubrik) + '</h2><p class="muted">' + esc(R.text) + '</p>';
    state.fragor.forEach(function (q, i) {
      h += '<div class="card tight"><p class="small muted" style="margin-bottom:8px">' + esc(q.text) + '</p><div class="two">' + field(R.rubrikEtikett, 'fragor.' + i + '.rubrik', q.rubrik) + field(R.viLar, 'fragor.' + i + '.vi', q.vi) + '</div></div>';
    });
    h += '<div class="card">' + field(R.motto, 'ram.motto', state.ram.motto) + '<div class="two">' + field(R.ansvarig, 'ram.ansvarig', state.ram.ansvarig) + field(R.datum, 'ram.datum', state.ram.datum, { type: 'date' }) + '</div>';
    h += '<span class="lbl">' + esc(R.stodRubrik) + '</span><div class="chips">' + R.stod.map(function (s) { var on = state.ram.stod.indexOf(s) >= 0; return '<button class="chip' + (on ? ' on' : '') + '" data-stod="' + esc(s) + '" aria-pressed="' + on + '">' + (on ? '✓ ' : '+ ') + esc(s) + '</button>'; }).join('') + '</div>';
    h += spelFranHTML('hinder') + field(R.hinder, 'ram.hinder', state.ram.hinder, { area: true, style: 'margin:0' }) + '<p class="hint" style="margin-top:6px">' + esc(R.hinderHjalp) + '</p></div>';
    return h;
  }
  function renderForsok(f, isPlan) {
    var Fo = C.forsok, q = fraga(f.fraga), i = state.forsok.indexOf(f), p = 'forsok.' + i + '.';
    var h = eyebrow(isPlan ? 'Steg 2 · Första försöket för lärandefråga ' + (state.fragor.indexOf(q) + 1) : 'Trimförsök') + '<h2>' + esc(Fo.rubrik) + (f.titel ? ': ' + esc(f.titel) : '') + '</h2>';
    if (isPlan && state.fragor.indexOf(q) === 0) h += omNote({ rubrik: Fo.rubrik, om: Fo.om, begrepp: Fo.begrepp });
    if (f.fore) { var pf = forsok(f.fore); if (pf) h += '<p class="note small">Fortsättning på <b>' + esc(pf.titel) + '</b>. Nästa lilla försök enligt kursavläsningen: ' + esc(pf.av.nasta) + '</p>'; }
    h += '<div class="card tight"><div class="eyebrow">' + esc(Fo.fraga) + '</div><p style="margin:0">' + esc(q ? q.text : '') + '</p></div>';
    if (isPlan && state.fragor.indexOf(q) === 0) h += spelFranHTML('forsok');
    h += '<div class="card">' + field(Fo.titel, p + 'titel', f.titel) + field(Fo.skaver, p + 'skaver', f.skaver, { area: true });
    var T = Fo.typer[f.typ] || Fo.typer.formaga;
    h += '<span class="lbl">' + esc(Fo.typRubrik) + '</span>' + seg('data-ftyp', function (k) { return AX[k]; }, AX.map(function (a) { return Fo.typer[a].namn; }), f.typ) + '<p class="small muted" style="margin:-4px 0 8px">' + esc(T.text) + ' ' + esc(Fo.typText) + '</p><div class="chips ex">' + T.exempel.map(function (e) { return '<button class="chip" data-act="useex" data-ex="' + esc(e) + '">' + esc(e) + '</button>'; }).join('') + '</div>';
    h += '<div class="two">' + field(Fo.om_, p + 'om', f.om, { area: true }) + field(Fo.tror, p + 'tror', f.tror, { area: true }) + '</div>';
    h += '<div class="two">' + field(Fo.nar, p + 'nar', f.nar, { type: 'date' }) + field(Fo.var, p + 'var', f.var) + '</div><p class="hint" style="margin-top:-8px">' + esc(Fo.startHjalp) + '</p>';
    h += field(Fo.forutsagelse, p + 'forutsagelse', f.forutsagelse, { area: true }) + field(Fo.matt, p + 'matt', f.matt, { area: true });
    h += '<span class="lbl">' + esc(Fo.langd) + '</span>' + seg('data-flangd', function (k) { return k; }, Fo.langder, f.langd);
    h += '<div class="two" style="margin-top:12px">' + field(Fo.vem, p + 'vem', f.vem) + field(Fo.behov, p + 'behov', f.behov) + '</div></div>';
    return h;
  }
  function renderAvlasning(f) {
    var A = C.avlasning, i = state.forsok.indexOf(f), p = 'forsok.' + i + '.av.', q = fraga(f.fraga);
    if (!f.av) { f.av = { hande: '', jamfort: null, bast: '', overraskade: '', effekter: [], vilka: '', vag: null, axelNu: null, beslut: null, nasta: '', datum: today() }; save(); }
    var a = f.av, first = avlasta().filter(function (x) { return x !== f; }).length === 0;
    var h = eyebrow('Steg 3 · ' + A.rubrik) + '<h2>' + esc(A.rubrik) + ': ' + esc(f.titel) + '</h2>' + (first ? omNote({ rubrik: A.rubrik, om: A.om, begrepp: A.begrepp }) : '');
    h += '<div class="card tight"><p class="small" style="margin-bottom:4px"><b>Om vi</b> ' + esc(f.om) + ' <b>så tror vi att</b> ' + esc(f.tror) + '</p><p class="small" style="margin:0"><b>Förutsägelse:</b> ' + esc(f.forutsagelse) + (f.matt ? ' <span class="muted">Tecken: ' + esc(f.matt) + '</span>' : '') + '</p></div>';
    h += '<div class="card">' + field(A.hande, p + 'hande', a.hande, { area: true, rows: 3 }) + '<span class="lbl">' + esc(A.jamfort) + '</span>' + seg('data-ajam', function (k) { return k; }, A.jamforelser, a.jamfort);
    h += '<div class="two" style="margin-top:12px">' + field(A.bast, p + 'bast', a.bast, { area: true }) + field(A.overraskade, p + 'overraskade', a.overraskade, { area: true }) + '</div>';
    h += '<span class="lbl">' + esc(A.effektRubrik) + '</span><div class="chips">' + A.effekter.map(function (e) { var on = a.effekter.indexOf(e) >= 0; return '<button class="chip' + (on ? ' on' : '') + '" data-eff="' + esc(e) + '" aria-pressed="' + on + '">' + (on ? '✓ ' : '') + esc(e) + '</button>'; }).join('') + '</div>' + field(A.vilka, p + 'vilka', a.vilka) + '</div>';
    h += '<div class="card"><h3 style="margin-top:0">' + esc(A.vagRubrik) + '</h3><p class="small muted">' + esc(A.vagText) + '</p><div class="decisions">' + A.vagar.map(function (v, k) { return '<button class="choice" data-avag="' + k + '" aria-pressed="' + (a.vag === k) + '"><span><b>' + esc(v) + '</b></span></button>'; }).join('') + '</div></div>';
    var ax = q ? q.axel : f.typ;
    /* Med underlag från See: samma slags påstående och skala som där, så att före och efter mäts på samma sätt. Utan See används gruppens egen skala från underlaget. */
    var bq = q ? behov(q.kalla) : null, pst = A.rorelsePastaende && A.rorelsePastaende[ax] && bq && see() ? fill(A.rorelsePastaende[ax], { behov: bq.text }) : null;
    var fraga1 = pst ? '<b>' + esc(pst) + '</b><br><span class="muted">' + esc(A.rorelseText) + '</span>' : esc(fill(A.rorelseFraga, { axel: C.axlar[ax] ? C.axlar[ax].kort : ax }));
    var skala = pst && A.instamSkala ? A.instamSkala : C.skala5;
    h += '<div class="card"><h3 style="margin-top:0">' + esc(A.rorelseRubrik) + '</h3><p class="small">' + fraga1 + (q && q.fore != null ? ' <span class="muted">(' + esc(A.fore) + ': ' + fmt(q.fore) + ' av 5)</span>' : '') + '</p>' + seg('data-anu', function (k) { return k + 1; }, skala.map(function (s, k) { return (k + 1) + ' ' + s.toLowerCase(); }), a.axelNu) + '</div>';
    h += '<h3>' + esc(A.beslutRubrik) + '</h3>' + seg('data-abes', function (k) { return Object.keys(A.beslut)[k]; }, Object.keys(A.beslut).map(function (k) { return A.beslut[k]; }), a.beslut);
    h += field(A.nasta, p + 'nasta', a.nasta, { area: true, style: 'margin-top:14px' }) + '<p class="hint" style="margin-top:-8px">' + esc(A.nastaHjalp) + '</p>';
    var harNasta = state.forsok.some(function (x) { return x.fore === f.id; });
    if (!harNasta) h += '<div class="actions" id="nastaact"' + (avKlar(f) ? '' : ' hidden') + '><button class="btn" data-act="planeranasta" data-id="' + f.id + '">' + esc(A.planeraNasta) + ' →</button></div>';
    return h;
  }
  function kurvaSVG() {
    var av = avlasta(), n = av.length, W = 640, H = 300, L = 50, T = 20, R = 20, B = 46, w = W - L - R, h = H - T - B;
    var tot = [], del = [], inf = [], a = 0, b = 0, c = 0;
    av.forEach(function (f) { a++; if (f.av.vag >= 1) b++; if (f.av.vag === 2) c++; tot.push(a); del.push(b); inf.push(c); });
    var max = Math.max(3, a);
    function x(i) { return L + (n <= 1 ? w / 2 : i / (n - 1) * w); } function y(v) { return T + h - v / max * h; }
    var g = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ' + W + ' ' + H + '" font-family="Helvetica, Arial, sans-serif" role="img" aria-label="Lärandekurva">';
    g += '<rect x="' + L + '" y="' + T + '" width="' + w + '" height="' + h + '" fill="#fff" stroke="#dcdcd8"/>';
    for (var v = 0; v <= max; v++) g += '<line x1="' + L + '" y1="' + y(v) + '" x2="' + (L + w) + '" y2="' + y(v) + '" stroke="#f0f0ed"/><text x="' + (L - 8) + '" y="' + (y(v) + 4) + '" font-size="11" fill="#5c5c5c" text-anchor="end">' + v + '</text>';
    av.forEach(function (f, i) { g += '<text x="' + x(i) + '" y="' + (T + h + 16) + '" font-size="11" fill="#5c5c5c" text-anchor="middle">' + (i + 1) + '</text>'; });
    g += '<text x="' + (L + w / 2) + '" y="' + (H - 6) + '" font-size="12" font-weight="bold" fill="#141414" text-anchor="middle">Kursavläsningar i tidsordning</text>';
    [[tot, '#8a8a86', 'Lärdomar', '4 4'], [del, '#141414', 'Delade', ''], [inf, '#1e5fcc', 'Införda i arbetssätt', '']].forEach(function (s) {
      if (!n) return;
      g += '<polyline points="' + s[0].map(function (v, i) { return x(i) + ',' + y(v); }).join(' ') + '" fill="none" stroke="' + s[1] + '" stroke-width="3"' + (s[3] ? ' stroke-dasharray="' + s[3] + '"' : '') + ' stroke-linejoin="round"/>';
      s[0].forEach(function (v, i) { g += '<circle cx="' + x(i) + '" cy="' + y(v) + '" r="4.5" fill="' + s[1] + '"/>'; });
    });
    return g + '</svg>';
  }
  function kurvaLegend() { return '<div class="legend"><span><i style="border:2px dashed #8a8a86"></i>Lärdomar</span><span><i style="background:#141414"></i>Delade med kollegor</span><span><i style="background:#1e5fcc"></i>Införda i arbetssätt</span></div>'; }
  function rorelseHTML() {
    return '<div class="axes">' + state.fragor.map(function (q, i) {
      var r = rorelse(q), b = behov(q.kalla), lbl = (i + 1) + '. ' + axNamn(q.axel) + (b ? ', ' + short(lc(b.namn), 28) : '');
      return '<div class="axis rr"><span>' + esc(lbl) + '</span><div class="bar2"><div class="bar"><span style="width:' + (r.fore == null ? 0 : (r.fore - 1) / 4 * 100) + '%;background:#9a9a96"></span></div><div class="bar"><span style="width:' + (r.efter == null ? 0 : (r.efter - 1) / 4 * 100) + '%"></span></div></div><span class="val">' + fmt(r.fore) + ' → ' + fmt(r.efter) + '</span></div>';
    }).join('') + '</div><p class="small muted">Övre stapeln: före. Undre stapeln: senaste kursavläsningen. Skala 1 till 5.</p>';
  }
  function renderOversikt() {
    var O = C.oversikt, h = eyebrow('Översikt') + '<h2>' + esc(O.rubrik) + '</h2><p class="muted">' + esc(O.text) + '</p>';
    state.fragor.forEach(function (q, i) {
      h += '<div class="card"><div class="eyebrow">Lärandefråga ' + (i + 1) + (q.rubrik ? ' · ' + esc(q.rubrik) : '') + '</div><p style="font-weight:600">' + esc(q.text) + '</p><div class="ramp">';
      forsokFor(q.id).forEach(function (f, k) {
        var st = status(f), tag = { planerat: 'plain', pagar: 'strong', dags: '', klart: 'cat-drivande' }[st];
        h += '<div class="ramp-row"><span class="tnr">' + (k + 1) + '</span><div class="ramp-main"><b>' + esc(f.titel || 'Namnlöst försök') + '</b> <span class="tag ' + tag + '">' + esc(O.status[st]) + '</span><p class="small muted" style="margin:2px 0 0">' + (f.nar ? 'Start ' + esc(f.nar) + ', avläsning ' + esc(addDays(f.nar, DAGAR[f.langd])) : '') + (f.av && f.av.beslut ? ' · ' + esc(C.avlasning.beslut[f.av.beslut]) : '') + '</p></div><div class="ramp-act">' +
          '<button class="btn quiet small-btn" data-act="openf" data-id="' + f.id + '">' + esc(O.oppna) + '</button>' + (forsokKlar(f) ? '<button class="btn ' + (st === 'dags' ? '' : 'ghost ') + 'small-btn" data-act="opena" data-id="' + f.id + '">' + esc(st === 'klart' ? 'Kursavläsning' : O.lasAv) + '</button>' : '') + '</div></div>';
      });
      h += '</div><button class="btn quiet small-btn" data-act="nyttf" data-q="' + q.id + '">+ ' + esc(O.nyttForsok) + '</button></div>';
    });
    if (avlasta().length) {
      h += '<h3>' + esc(O.kurvaRubrik) + '</h3><div class="card tight chartcard"><div class="chart">' + kurvaSVG() + '</div>' + kurvaLegend() + '<p class="small muted" style="margin:8px 0 0">' + esc(O.kurvaText) + '</p></div>';
      h += '<h3>' + esc(O.rorelseRubrik) + '</h3><div class="card tight">' + rorelseHTML() + '</div>';
    }
    h += '<div class="actions"><button class="btn ghost" data-act="ics">' + esc(O.kalender) + '</button><button class="btn ghost" data-act="spelspela">' + esc(spelKlart() ? C.spel.namn : C.spel.spelaFranOversikt) + '</button><button class="btn ghost" data-act="period">' + esc(state.period.avslutad ? C.period.avslutad : O.period) + '</button></div>';
    return h;
  }
  function renderPeriod() {
    var P = C.period, h = eyebrow('Steg 4 · ' + P.rubrik) + '<h2>' + esc(P.rubrik) + '</h2>' + omNote({ rubrik: P.rubrik, om: P.om, begrepp: P.begrepp });
    if (avlasta().length) h += '<div class="card tight chartcard"><div class="chart">' + kurvaSVG() + '</div>' + kurvaLegend() + '</div><div class="card tight">' + rorelseHTML() + '</div>';
    h += field(P.monster, 'period.monster', state.period.monster, { area: true, rows: 3 });
    h += '<h3>' + esc(P.fragaRubrik) + '</h3>' + state.fragor.map(function (q) { return '<div class="card tight"><p class="small" style="margin-bottom:6px">' + esc(q.text) + '</p>' + seg('data-pval', function (k) { return Object.keys(P.fragaVal)[k]; }, Object.keys(P.fragaVal).map(function (k) { return P.fragaVal[k]; }), state.period.fragaVal[q.id], ' data-q="' + q.id + '"') + '</div>'; }).join('');
    h += field(P.skala, 'period.skala', state.period.skala, { area: true }) + field(P.hinder, 'period.hinder', state.period.hinder, { area: true }) + field(P.nasta, 'period.nasta', state.period.nasta, { type: 'date' });
    h += '<div class="actions"><button class="btn" data-act="avsluta">' + esc(state.period.avslutad ? P.avslutad + ' ✓' : 'Markera lärperioden som avslutad') + '</button></div>';
    return h;
  }

  /* ---------- spelet Förmågefällan (steg 0, frivilligt) ---------- */
  var SP = C.spel, SIM = window.LCASpel;
  function spel() {
    if (!state.spel) state.spel = { status: 'ny', axel: null, beslut: [], val: { t: 0, gen: false, vid: false, kort: null }, samtal: ['', '', '', ''] };
    return state.spel;
  }
  /* Den svagaste axeln: den som oftast är svagast bland behoven från See eller underlaget. Vid lika väger det första behovet. */
  function spelAxelForslag() {
    var bl = behovLista(), n = {};
    bl.forEach(function (b) { if (b.axel) n[b.axel] = (n[b.axel] || 0) + 1; });
    var ax = AX.filter(function (a) { return n[a]; }).sort(function (a, b) { return n[b] - n[a]; });
    return ax.length ? (n[ax[0]] === n[ax[1]] && bl[0] ? bl[0].axel : ax[0]) : null;
  }
  function spelAxel() { var g = spel(); return g.axel || spelAxelForslag(); }
  function hogtTryck() { return kollisioner().some(function (k) { return (k.tryck || 0) >= 4; }); }
  function spelSim(b) { return SIM.simulate(spelAxel(), b || spel().beslut, SP.handelser, { hogtTryck: hogtTryck() }); }
  function spelHandelse(w) { var ax = spelAxel(); return w === 5 && SP.handelser.vecka6[ax] ? SP.handelser.vecka6[ax] : SP.handelser.veckor[w]; }
  function spelKort() { var ax = spelAxel(); return SP.kort.filter(function (k) { return k.axel === 'alla' || k.axel === ax; }); }
  function spelMonster() { var g = spel(); return g.status === 'klar' ? SIM.monster(spelSim(), g.beslut) : []; }
  function spelTimmar() {
    var b = spel().beslut, m = b.length ? b.reduce(function (a, x) { return a + (x.t || 0); }, 0) / b.length : 8;
    return Math.max(4, Math.min(12, Math.round(m / 4) * 4));
  }
  function spelHypotes() {
    var H = SP.hypotes, ax = spelAxel() || 'mandat', mo = spelMonster(), vid = mo.indexOf('vidDolt') >= 0 || mo.indexOf('vidLyft') >= 0;
    return { om: fill(H.om[ax], { h: spelTimmar(), vid: vid ? H.vid : '' }), tror: H.tror[ax], forutsagelse: H.forutsagelse[ax], hinder: H.hinder[ax] };
  }
  function spelKlart() { return spel().status === 'klar'; }
  function tile(rubrik, niva, namn, cls, sub) {
    return '<div class="sp-tile ' + (cls || '') + '"><span class="lbl">' + esc(rubrik) + '</span><b class="sp-val lv' + niva + '">' + esc(namn) + '</b>' + (sub ? '<span class="small muted">' + esc(sub) + '</span>' : '') + '</div>';
  }
  function renderSpel() {
    var g = spel(), h = eyebrow('Steg 0 · Spel') + '<h2>' + esc(SP.namn) + '</h2><p class="lead" style="margin-top:-4px">' + esc(SP.undertitel) + '</p>';
    if (g.status === 'pagar' && g.beslut.length < SIM.VECKOR) return h + renderSpelVecka();
    if (g.status === 'klar') return h + renderSpelSlut();
    h += omNote({ rubrik: SP.namn, om: SP.om, begrepp: SP.begrepp }) + SP.intro.map(function (t) { return '<p>' + esc(t) + '</p>'; }).join('');
    var ax = spelAxel(), forslag = spelAxelForslag();
    h += '<div class="card"><h3 style="margin-top:0">' + esc(SP.axelRubrik) + '</h3><p class="small muted">' + esc(forslag ? (see() ? SP.axelFran.see : SP.axelFran.egen) + ' ' + lc(SP.axlar[forslag].namn) + '.' : SP.axelFran.ingen) + '</p>' +
      seg('data-spax', function (k) { return AX[k]; }, AX.map(function (a) { return SP.axlar[a].namn; }), ax) + (ax ? '<p class="small" style="margin:6px 0 0">' + esc(SP.axlar[ax].text) + '</p>' : '') + '</div>';
    h += '<p class="note small">' + esc(SP.varning) + '</p>';
    h += '<div class="actions"><button class="btn" data-act="spelstart"' + (ax ? '' : ' disabled') + '>' + esc(SP.starta) + ' →</button></div><p class="small muted">' + esc(SP.hoppaText) + '</p>';
    return h;
  }
  function renderSpelVecka() {
    var g = spel(), w = g.beslut.length, sim = spelSim(), r = sim.rec, sist = r[w - 1], e = spelHandelse(w), v = g.val, S = SP.signaler;
    var h = '<div class="card sp-event"><div class="eyebrow">' + esc(fill(SP.vecka, { n: w + 1 })) + '</div><h3 style="margin:2px 0 4px">' + esc(e.rubrik) + '</h3><p class="small" style="margin:0">' + esc(e.text) + '</p></div>';
    var levN = sist ? SIM.leveransNiva(sist.gap) : 1, enN = SIM.energiNiva(sist ? sist.E : SIM.M.energi);
    var synligF = w < 3 ? sim.startF : r[w - 3].F;
    h += '<div class="eyebrow" style="margin-top:6px">' + esc(SP.lage) + '</div><div class="sp-tiles">' +
      tile(SP.leverans.rubrik, levN, SP.leverans.nivaer[levN], 'lev') + tile(SP.energi.rubrik, enN, SP.energi.nivaer[enN], 'en') +
      tile(SP.formaga.rubrik, SIM.formagaNiva(synligF, sim.startF), SP.formaga.nivaer[SIM.formagaNiva(synligF, sim.startF)], 'fog', SP.formaga.dimma) + '</div>';
    var sig = [];
    if (sist) {
      if (sist.tagen) sig.push(S.tagen);
      if (spelAxel() === 'vilja' && sist.t > 0 && sist.tEff < sist.t * 0.8) sig.push(S.halvhjartat);
      if (sist.ankom > 3) sig.push(S.ankom);
      if (sist.Rw > 14) sig.push(S.omarbete);
      if ((sist.kort === 'lyft' || sist.kort === 'ja') && sim.slut.lyft > 0 && r.filter(function (x) { return x.kort === 'lyft' || x.kort === 'ja'; }).length === 1) sig.push(S.lyft);
      if (w === 6 && sim.slut.stoppat > 0) sig.push(S.stoppat);
      if (sist.S > 0.5) sig.push(S.vidSidan);
    }
    if (sig.length) h += '<ul class="sp-sig">' + sig.map(function (x) { return '<li>' + esc(x) + '</li>'; }).join('') + '</ul>';
    if (w) h += '<div class="sp-hist" aria-label="' + esc(SP.historik) + '"><span class="lbl">' + esc(SP.historik) + '</span><div>' + r.map(function (x, i) { var n = SIM.leveransNiva(x.gap); return '<span class="lv' + n + '" title="Vecka ' + (i + 1) + ': ' + esc(SP.leverans.nivaer[n]) + '">' + (i + 1) + '</span>'; }).join('') + '</div></div>';
    h += '<div class="card"><h3 style="margin-top:0">' + esc(SP.beslutRubrik) + '</h3>';
    h += '<span class="lbl">' + esc(SP.tid.rubrik) + '</span>' + seg('data-spt', function (k) { return SP.tid.varden[k]; }, SP.tid.val, v.t) + '<p class="hint" style="margin-top:-2px">' + esc(SP.tid.hjalp) + '</p>';
    h += '<div class="two"><div><span class="lbl">' + esc(SP.genvag.rubrik) + '</span>' + seg('data-spgen', function (k) { return k; }, SP.genvag.val, v.gen ? 1 : 0) + '<p class="small muted">' + esc(SP.genvag.text) + '</p></div>' +
      '<div><span class="lbl">' + esc(SP.vidSidan.rubrik) + '</span>' + seg('data-spvid', function (k) { return k; }, SP.vidSidan.val, v.vid ? 1 : 0) + '<p class="small muted">' + esc(SP.vidSidan.text) + '</p></div></div>';
    var used = {}; g.beslut.forEach(function (b, i) { if (b.kort) used[b.kort] = i + 1; });
    h += '<span class="lbl">' + esc(SP.kortRubrik) + '</span><p class="small muted" style="margin:0 0 8px">' + esc(SP.kortText) + '</p><div class="sp-kort">';
    h += '<button class="choice" data-spkort="" aria-pressed="' + (!v.kort) + '"><span><b>' + esc(SP.ingetKort) + '</b></span></button>';
    spelKort().forEach(function (k) {
      var spent = used[k.id], kanLyfta = sim.slut.S > 0.5;
      var off = spent || (k.kraver === 'vid' && !kanLyfta);
      h += '<button class="choice' + (off ? ' off' : '') + '" data-spkort="' + k.id + '" aria-pressed="' + (v.kort === k.id) + '"' + (off ? ' disabled' : '') + '><span><b>' + esc(k.namn) + '</b><span class="small sp-kt">' + esc(spent ? fill(SP.spelat, { n: spent }) : k.text) + '</span></span></button>';
    });
    h += '</div><div class="actions" style="margin-top:14px"><button class="btn" data-act="spelkor">' + esc(w === SIM.VECKOR - 1 ? SP.korSista : fill(SP.kor, { n: w + 1 })) + ' →</button></div></div>';
    return h;
  }
  /* Kurvor utan tal: formen är poängen. */
  function spelKurva(serier, typ) {
    var W = 640, H = 230, L = 74, T = 14, R = 14, B = 34, w = W - L - R, hh = H - T - B, A = SP.avslojande, all = [];
    serier.forEach(function (s) { s.v.forEach(function (x) { all.push(x); }); });
    var lo = Math.min.apply(null, all), hi = Math.max.apply(null, all);
    if (typ === 'lev') { var m = Math.max(Math.abs(lo), Math.abs(hi), 10); lo = -m; hi = m; } else { var pad = Math.max(4, (hi - lo) * 0.1); lo -= pad; hi += pad; }
    function x(i) { return L + i / (SIM.VECKOR - 1) * w; } function y(v) { return T + hh - (v - lo) / (hi - lo) * hh; }
    var g = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ' + W + ' ' + H + '" font-family="Helvetica, Arial, sans-serif" role="img" aria-label="' + esc(typ === 'lev' ? A.leveransKurva : A.formagaKurva) + '">';
    g += '<rect x="' + L + '" y="' + T + '" width="' + w + '" height="' + hh + '" fill="#fff" stroke="#dcdcd8"/>';
    if (typ === 'lev') g += '<line x1="' + L + '" y1="' + y(0) + '" x2="' + (L + w) + '" y2="' + y(0) + '" stroke="#8a8a86" stroke-dasharray="2 3"/><text x="' + (L - 8) + '" y="' + (y(0) + 4) + '" font-size="11" fill="#5c5c5c" text-anchor="end">' + esc(A.ifas) + '</text><text x="' + (L - 8) + '" y="' + (T + 11) + '" font-size="11" fill="#5c5c5c" text-anchor="end">' + esc(A.fore) + '</text><text x="' + (L - 8) + '" y="' + (T + hh - 2) + '" font-size="11" fill="#5c5c5c" text-anchor="end">' + esc(A.efter) + '</text>';
    else g += '<text x="' + (L - 8) + '" y="' + (T + 11) + '" font-size="11" fill="#5c5c5c" text-anchor="end">' + esc(A.starkare) + '</text><text x="' + (L - 8) + '" y="' + (T + hh - 2) + '" font-size="11" fill="#5c5c5c" text-anchor="end">' + esc(A.svagare) + '</text>';
    for (var i = 0; i < SIM.VECKOR; i++) g += '<text x="' + x(i) + '" y="' + (T + hh + 16) + '" font-size="11" fill="#5c5c5c" text-anchor="middle">' + (i + 1) + '</text>';
    g += '<text x="' + (L + w / 2) + '" y="' + (H - 2) + '" font-size="11" fill="#5c5c5c" text-anchor="middle">Vecka</text>';
    serier.slice().reverse().forEach(function (s) {
      g += '<polyline points="' + s.v.map(function (v, i) { return x(i) + ',' + y(v); }).join(' ') + '" fill="none" stroke="' + s.farg + '" stroke-width="' + (s.tjock ? 4 : 2.5) + '"' + (s.streck ? ' stroke-dasharray="' + s.streck + '"' : '') + ' stroke-linejoin="round"/>';
      if (s.tjock) s.v.forEach(function (v, i) { g += '<circle cx="' + x(i) + '" cy="' + y(v) + '" r="4" fill="' + s.farg + '"/>'; });
    });
    return g + '</svg>';
  }
  function spelSerier(falt) {
    var ax = spelAxel(), o = { hogtTryck: hogtTryck() }, A = SP.avslojande;
    var lev = SIM.referens(ax, 'leverans', SP.handelser, o), sk = SIM.referens(ax, 'skyddad', SP.handelser, o), er = spelSim();
    function v(sim) { return sim.rec.map(function (r) { return r[falt]; }); }
    return [{ namn: A.erVag, v: v(er), farg: '#141414', tjock: true }, { namn: A.leveransForst, v: v(lev), farg: '#d1431d', streck: '6 4' }, { namn: A.skyddad, v: v(sk), farg: '#1e5fcc', streck: '6 4' }];
  }
  function spelLegend() {
    var A = SP.avslojande;
    return '<div class="legend"><span><i style="background:#141414"></i>' + esc(A.erVag) + '</span><span><i style="border:2px dashed #d1431d"></i>' + esc(A.leveransForst) + '</span><span><i style="border:2px dashed #1e5fcc"></i>' + esc(A.skyddad) + '</span></div>';
  }
  function renderSpelSlut() {
    var g = spel(), A = SP.avslojande, Mo = SP.monster, mo = spelMonster(), hy = spelHypotes();
    var h = '<h3>' + esc(A.rubrik) + '</h3><p class="small muted">' + esc(A.text) + '</p>';
    h += '<div class="card tight chartcard"><div class="eyebrow">' + esc(A.formagaKurva) + '</div><div class="chart">' + spelKurva(spelSerier('F'), 'F') + '</div><div class="eyebrow" style="margin-top:10px">' + esc(A.leveransKurva) + '</div><div class="chart">' + spelKurva(spelSerier('gap'), 'lev') + '</div>' + spelLegend() + '</div>';
    h += '<div class="card summary"><div class="eyebrow">' + esc(Mo.rubrik) + '</div>' + mo.map(function (k) { return '<p class="small">' + esc(Mo[k]) + '</p>'; }).join('') + '</div>';
    h += '<div class="card next"><div class="eyebrow">' + esc(SP.hypotes.rubrik) + '</div><p style="margin-bottom:6px"><b>Om vi</b> ' + esc(hy.om) + ' <b>så tror vi att</b> ' + esc(hy.tror) + '.</p><p class="small muted" style="margin:0">' + esc(SP.hypotes.text) + '</p></div>';
    h += '<h3>' + esc(SP.samtal.rubrik) + '</h3><p class="small muted">' + esc(SP.samtal.text) + '</p><div class="card">' + SP.samtal.fragor.map(function (q, i) { return field(q, 'spel.samtal.' + i, g.samtal[i] || '', { area: true }); }).join('') + '</div>';
    h += '<div class="actions"><button class="btn quiet" data-act="spelom">' + esc(SP.spelaIgen) + '</button></div>';
    return h;
  }
  function spelFranHTML(typ) {
    if (!spelKlart()) return '';
    var hy = spelHypotes(), H = SP.hypotes;
    if (typ === 'hinder') return '<div class="note strong small"><b>' + esc(H.franSpelet) + ':</b> ' + esc(hy.hinder) + ' <button class="btn ghost small-btn" data-act="spelhinder">' + esc(H.anvandHinder) + '</button></div>';
    if (typ === 'forsok') return '<div class="note strong small"><b>' + esc(H.franSpelet) + ':</b> Om vi ' + esc(hy.om) + ' så tror vi att ' + esc(hy.tror) + '. <button class="btn ghost small-btn" data-act="spelforsok">' + esc(H.anvandForsok) + '</button></div>';
    var mo = spelMonster(); return mo.length ? '<div class="note strong small"><b>' + esc(H.franSpelet) + ':</b> ' + esc(SP.monster[mo[0]]) + '</div>' : '';
  }
  function spelRapport() {
    var g = spel(), R = SP.rapport;
    if (g.status === 'hoppat' || g.status === 'ny') return null;
    if (!spelKlart()) return null;
    var mo = spelMonster(), hy = spelHypotes(), ax = spelAxel();
    return { titel: R.titel, text: fill(R.spelat, { axel: lc(SP.axlar[ax].namn).replace(/^svag[a-z]* /, '') }) + ' ' + mo.map(function (k) { return SP.monster[k]; }).join(' '), hypotes: 'Om vi ' + hy.om + ' så tror vi att ' + hy.tror + '.', monster: mo, axel: ax };
  }

  /* ---------- rapport ---------- */
  function rapportBlock() {
    var R = C.rapport, org = state.meta.foretag || 'Organisationen', av = avlasta(), sam = [], analys = [], forslag = [];
    var kalla = []; if (sense()) kalla.push(R.kedjaSense); if (see()) kalla.push(R.kedjaSee); tillampningar().forEach(function (t) { kalla.push(fill(R.kedjaTillampning, { namn: lc(t.namn) })); }); if (!see()) kalla.push(R.kedjaEgen);
    sam.push(fill(R.inledning, { org: org, n: state.fragor.length, f: state.forsok.length, a: av.length }) + ' ' + fill(R.inledningKedja, { kalla: lista(kalla) }));
    if (av.length) {
      var c = [0, 0, 0, 0]; av.forEach(function (f) { c[f.av.jamfort]++; });
      sam.push(fill(R.utfall, { battre: c[0], a: av.length, som: c[1], samre: c[2] }));
    }
    var upp = 0, ned = 0, mats = 0;
    state.fragor.forEach(function (q, i) {
      var r = rorelse(q), b = behov(q.kalla), fl = forsokFor(q.id), n = fl.filter(avKlar).length;
      var t = 'Riktad mot ' + lc(axNamn(q.axel)) + (b ? ' för ' + lc(b.namn) : '') + '. ' + fl.length + ' försök, ' + n + ' avlästa.';
      if (r.efter != null && r.fore != null) { mats++; if (r.efter > r.fore) upp++; else ned++; t += ' ' + fill(R.rorelse, { fraga: 'Mottagningsförmågan', axel: axNamn(q.axel), fore: fmt(r.fore), efter: fmt(r.efter) }).replace(/^Mottagningsförmågan: /, ''); }
      analys.push({ titel: (i + 1) + '. ' + q.text, text: t });
    });
    if (av.length) {
      var v = [0, 0, 0]; av.forEach(function (f) { v[f.av.vag]++; });
      analys.push(fill(R.vag, { v0: v[0], v1: v[1], v2: v[2] }) + ' ' + (v[0] > v[1] + v[2] ? R.vagSvag : v[2] >= 1 ? R.vagStark : ''));
      if (mats) analys.push(upp === mats ? R.riktningPlus : upp ? fill(R.riktningDelvis || R.riktningPlus, { upp: upp, n: mats }) : R.riktningMinus);
    } else analys.push(R.rorelseIngen);
    var spr = spelRapport(); if (spr) analys.push({ titel: spr.titel, text: spr.text });
    var dags = state.forsok.filter(function (f) { return status(f) === 'dags'; });
    if (dags.length) forslag.push({ titel: R.forslagAvlas, text: fill(R.forslagAvlasText, { lista: lista(dags.map(function (f) { return '”' + f.titel + '”'; })) }) });
    var oppna = av.filter(function (f) { return !state.forsok.some(function (x) { return x.fore === f.id; }); });
    if (oppna.length === 1) forslag.push({ titel: R.forslagNasta, text: oppna[0].av.nasta });
    else if (oppna.length > 1) forslag.push({ titel: R.forslagNastaFler, text: oppna.map(function (f) { var i = state.fragor.indexOf(fraga(f.fraga)); return f.av.nasta.replace(/[.]$/, '') + (i >= 0 ? ' (lärandefråga ' + (i + 1) + ')' : ''); }).join('; ') + '.' });
    var sk = av.filter(function (f) { return f.av.beslut === 'skala'; }).map(function (f) { return '”' + f.titel + '”'; });
    if (sk.length || state.period.skala.trim()) forslag.push({ titel: R.forslagSkala, text: (sk.length ? lista(sk) + '. ' : '') + state.period.skala.trim() });
    var hinder = (state.period.hinder || state.ram.hinder || '').trim();
    if (hinder) forslag.push({ titel: R.forslagHinder, text: hinder });
    if (!state.period.avslutad) forslag.push({ titel: R.forslagPeriod, text: R.forslagPeriodText });
    return { sammanfattning: sam, analys: analys, forslag: forslag };
  }
  function lamnar() {
    return {
      riktning: state.fragor.map(function (q) { var r = rorelse(q), b = behov(q.kalla); return { fraga: q.text, rubrik: q.rubrik, vi: q.vi, behov: b ? b.namn : '', axel: q.axel, kollision: q.kollision, fore: r.fore, efter: r.efter }; }),
      forsok: state.forsok.map(function (f) { var q = fraga(f.fraga); return { titel: f.titel, fraga: q ? q.text : '', typ: f.typ, hypotes: 'Om vi ' + f.om + ' så tror vi att ' + f.tror, forutsagelse: f.forutsagelse, start: f.nar, status: status(f),
        jamfort: f.av && f.av.jamfort != null ? C.avlasning.jamforelser[f.av.jamfort] : null, beslut: f.av ? f.av.beslut : null, vag: f.av ? f.av.vag : null, effekter: f.av ? f.av.effekter : [], axelEfter: f.av ? f.av.axelNu : null, nasta: f.av ? f.av.nasta : '', fortsatt: state.forsok.some(function (x) { return x.fore === f.id; }) }; }),
      rorelse: state.fragor.map(function (q) { var r = rorelse(q), b = behov(q.kalla); return { fraga: q.text, behov: b ? b.namn : '', axel: q.axel, fore: r.fore, efter: r.efter }; }),
      larandekurva: (function () { var av = avlasta(); return { avlasningar: av.length, delade: av.filter(function (f) { return f.av.vag >= 1; }).length, inforda: av.filter(function (f) { return f.av.vag === 2; }).length }; })(),
      period: { avslutad: state.period.avslutad, monster: state.period.monster, nasta: state.period.nasta },
      ledningensHinder: (state.period.hinder || state.ram.hinder || '').trim(),
      spel: (function () { var r = spelRapport(); return r ? { spelat: true, axel: r.axel, monster: r.monster, text: r.text, hypotes: r.hypotes } : { spelat: false }; })(),
      underlag: { sense: !!sense(), see: !!see(), egen: see() ? null : behovLista().map(function (b) { return { namn: b.namn, axel: b.axel, niva: b.fore }; }), utmaning: sense() ? null : state.eget.utmaning }
    };
  }
  function envelope() { return LCA.wrap({ modul: 'shift', version: C.version, skapad: state.skapad, organisation: { namn: state.meta.foretag, typ: state.meta.typ, deltagare: state.meta.namn }, data: state, lamnar: lamnar(), kedja: state.kedja || {} }); }
  function forsokDetalj(f) {
    var a = f.av, A = C.avlasning, q = fraga(f.fraga);
    var h = '<div class="card tight"><b>' + esc(f.titel) + '</b> <span class="tag plain">' + esc(C.oversikt.status[status(f)]) + '</span><p class="small muted" style="margin:2px 0 6px">' + esc(q ? q.text : '') + ' · ' + esc(C.forsok.typer[f.typ] ? C.forsok.typer[f.typ].namn : '') + ' · start ' + esc(f.nar || '') + '</p>';
    if (f.skaver) h += '<p class="small" style="margin-bottom:4px"><b>Det här skaver:</b> ' + esc(f.skaver) + '</p>';
    h += '<p class="small" style="margin-bottom:4px"><b>Om vi</b> ' + esc(f.om) + ' <b>så tror vi att</b> ' + esc(f.tror) + '</p><p class="small" style="margin-bottom:4px"><b>Förutsägelse:</b> ' + esc(f.forutsagelse) + (f.matt ? ' <b>Tecken:</b> ' + esc(f.matt) : '') + '</p>';
    if (a && avKlar(f)) h += '<p class="small" style="margin:8px 0 4px"><b>Kursavläsning:</b> ' + esc(a.hande) + ' <span class="muted">(' + esc(A.jamforelser[a.jamfort].toLowerCase()) + ')</span></p>' + (a.bast ? '<p class="small" style="margin-bottom:4px"><b>Bäst:</b> ' + esc(a.bast) + '</p>' : '') + (a.overraskade ? '<p class="small" style="margin-bottom:4px"><b>Överraskade:</b> ' + esc(a.overraskade) + '</p>' : '') +
      '<p class="small" style="margin-bottom:4px"><b>Effekt:</b> ' + esc(a.effekter.join(', ') || 'ingen angiven') + (a.vilka ? ' · ' + esc(a.vilka) : '') + ' · <b>Lärdomens väg:</b> ' + esc(A.vagar[a.vag].toLowerCase()) + ' · <b>Nu:</b> ' + a.axelNu + ' av 5</p><p class="small" style="margin:0"><b>Beslut:</b> ' + esc(A.beslut[a.beslut]) + '. <b>Nästa lilla försök:</b> ' + esc(a.nasta) + '</p>';
    return h + '</div>';
  }
  function renderRapport() {
    var m = state.meta, R = C.rapport, h = '<div class="eyebrow">' + esc(R.rubrik) + ' · Shift</div><h2>' + esc(m.foretag || 'Er organisation') + '</h2><p class="muted">Start ' + esc(m.datum) + (m.namn ? ' · ' + esc(m.namn) : '') + (state.period.avslutad ? ' · Lärperioden avslutad' : ' · Lärperioden pågår') + '</p>';
    h += '<div class="actions" style="margin:0 0 18px"><button class="btn" data-act="pdf">Ladda ner rapport (PDF)</button><button class="btn ghost" data-act="savefile">Spara sparfil</button><button class="btn quiet" data-act="tooversikt">Till översikten</button></div>';
    h += LCA.reportBlock(rapportBlock());
    if (avlasta().length) h += '<h3>' + esc(C.oversikt.kurvaRubrik) + '</h3><div class="card tight chartcard"><div class="chart">' + kurvaSVG() + '</div>' + kurvaLegend() + '</div><h3>' + esc(C.oversikt.rorelseRubrik) + '</h3><div class="card tight">' + rorelseHTML() + '</div>';
    h += '<h3>Learning Direction Canvas</h3><div class="canvas"><div class="card tight"><div class="eyebrow">' + esc(C.riktning.falt1) + '</div>' + tryckHTML() + '</div><div class="card tight"><div class="eyebrow">' + esc(C.riktning.falt2) + '</div>' + beredskapHTML() + '</div></div>';
    h += '<div class="card tight"><div class="eyebrow">' + esc(C.riktning.falt3) + '</div><ol class="small">' + state.fragor.map(function (q) { return '<li><b>' + esc(q.text) + '</b>' + (q.rubrik || q.vi ? '<br>' + esc(q.rubrik) + (q.vi ? ': ' + esc(lc(viText(q.vi))) : '') : '') + '</li>'; }).join('') + '</ol>' +
      (state.ram.motto ? '<p class="small"><b>Motto:</b> ' + esc(state.ram.motto) + '</p>' : '') + '<p class="small" style="margin:0">' + (state.ram.ansvarig ? '<b>Ansvarig:</b> ' + esc(state.ram.ansvarig) + ' · ' : '') + (state.ram.datum ? '<b>Återkoppling:</b> ' + esc(state.ram.datum) + ' · ' : '') + (state.ram.stod.length ? '<b>Stöd:</b> ' + esc(state.ram.stod.join(', ').toLowerCase()) : '') + '</p></div>';
    var spr2 = spelRapport();
    if (spr2) h += '<h3>' + esc(C.spel.namn) + '</h3><div class="card tight chartcard"><div class="eyebrow">' + esc(C.spel.avslojande.formagaKurva) + '</div><div class="chart">' + spelKurva(spelSerier('F'), 'F') + '</div><div class="eyebrow" style="margin-top:10px">' + esc(C.spel.avslojande.leveransKurva) + '</div><div class="chart">' + spelKurva(spelSerier('gap'), 'lev') + '</div>' + spelLegend() + '</div><div class="card tight"><p class="small">' + esc(spr2.text) + '</p><p class="small"><b>' + esc(C.spel.hypotes.rubrik) + ':</b> ' + esc(spr2.hypotes) + '</p>' + C.spel.samtal.fragor.map(function (q, i) { var a = (spel().samtal[i] || '').trim(); return a ? '<p class="small" style="margin-bottom:4px"><b>' + esc(q) + '</b><br>' + esc(a) + '</p>' : ''; }).join('') + '</div>';
    h += '<h3>Trimförsök och kursavläsningar</h3>' + state.forsok.map(forsokDetalj).join('');
    if (state.period.monster || state.period.skala) h += '<h3>' + esc(C.period.rubrik) + '</h3><div class="card tight">' + (state.period.monster ? '<p class="small"><b>Mönster:</b> ' + esc(state.period.monster) + '</p>' : '') + state.fragor.map(function (q) { var v = state.period.fragaVal[q.id]; return v ? '<p class="small" style="margin-bottom:4px">' + esc(C.period.fragaVal[v]) + ': ' + esc(q.text) + '</p>' : ''; }).join('') + (state.period.nasta ? '<p class="small" style="margin:0"><b>Nästa lärperiod:</b> ' + esc(state.period.nasta) + '</p>' : '') + '</div>';
    if (state.parkering.trim()) h += '<h3>Parkerade frågor</h3><p class="small" style="white-space:pre-wrap">' + esc(state.parkering) + '</p>';
    var hel = sense() && see();
    h += '<div class="card tight next"><div class="eyebrow">' + esc(R.nastaRubrik) + '</div><p class="small"' + (hel ? '' : ' style="margin:0"') + '>' + esc(hel ? R.nastaText : R.slutSaknas) + '</p>' + (hel ? '<div class="actions" style="margin-top:8px"><button class="btn" data-act="toslut">' + esc(R.tillSlut) + ' →</button></div>' : '') + '</div>';
    h += LCA.teoriHTML();
    return h + '<div class="actions"><button class="btn quiet" data-act="restart">Börja om med en ny körning</button></div>';
  }

  /* ---------- rendering ---------- */
  function render() {
    var st = view.step, s = steps(), i = s.indexOf(st), html = '';
    if (i < 0 && !sideView(st)) { view.step = st = resumeStep(); s = steps(); i = s.indexOf(st); }
    if (st === 'start') html = renderStart();
    else if (st === 'uppgifter') html = renderMeta();
    else if (st === 'underlag') html = renderUnderlag();
    else if (st === 'spel') html = renderSpel();
    else if (st === 'riktning') html = renderRiktning();
    else if (st === 'ram') html = renderRam();
    else if (/^plan-/.test(st)) html = renderForsok(firstForsok(st.slice(5)), true);
    else if (/^f-/.test(st)) html = renderForsok(forsok(st.slice(2)), false);
    else if (/^a-/.test(st)) html = renderAvlasning(forsok(st.slice(2)));
    else if (st === 'oversikt') html = renderOversikt();
    else if (st === 'period') html = renderPeriod();
    else if (st === 'rapport') html = renderRapport();
    if (st !== 'start' && st !== 'rapport') {
      if (st !== 'uppgifter') html += parking();
      var side = sideView(st), nxt = side ? 'Klar, till översikten' : (st === 'spel' && spel().status === 'ny' ? C.spel.hoppa : s[i + 1] === 'rapport' ? 'Visa rapporten' : 'Nästa');
      html += '<div class="navrow"><button class="btn quiet" data-act="back">← ' + (side ? 'Översikten' : 'Tillbaka') + '</button><button class="btn quiet savebtn" data-act="savefile" title="Ladda ner en sparfil så att arbetet inte går förlorat">Spara sparfil</button><button class="btn" data-act="next"' + (canNext() ? '' : ' disabled') + '>' + nxt + ' →</button></div><div class="missing" id="missing" aria-live="polite">' + missingHTML() + '</div>';
    }
    html = LCA.withIntro(html, skedeIntroFor(st), st.replace(/-.*/, ''));
    app.innerHTML = html;
    var pi = sideView(st) ? s.indexOf('oversikt') : i;
    document.getElementById('progress-bar').style.width = (st === 'start' ? 0 : Math.round(pi / (s.length - 1) * 100)) + '%';
  }
  function skedeIntroFor(st) {
    var k = /^(plan|f)-/.test(st) ? 'forsok' : /^a-/.test(st) ? 'avlasning' : st;
    return (C.skedeIntro || {})[k];
  }
  function missingHTML() { var m = canNext() ? [] : saknas(); return m.length ? '<b>För att gå vidare:</b> ' + m.map(esc).join(' ') : ''; }
  function refreshNext() { var b = app.querySelector('[data-act=next]'); if (b) b.disabled = !canNext(); var h = document.getElementById('missing'); if (h) h.innerHTML = missingHTML(); var na = document.getElementById('nastaact'); if (na) na.hidden = !canNext(); }

  /* ---------- händelser ---------- */
  function curForsok() { var st = view.step; return /^plan-/.test(st) ? firstForsok(st.slice(5)) : forsok(st.slice(2)); }
  app.addEventListener('click', function (e) {
    var t = e.target.closest('button'); if (!t) return;
    var act = t.getAttribute('data-act'), d = function (a) { return t.getAttribute(a); };
    if (act === 'next') { if (view.step === 'spel' && spel().status === 'ny') { spel().status = 'hoppat'; save(); } if (canNext()) nav(1); return; }
    if (act === 'back') { if (sideView(view.step)) go('oversikt'); else nav(-1); return; }
    if (act === 'new') { if (!load() || confirmReset()) { state = fresh(); save(); go('uppgifter'); } return; }
    if (act === 'resume') { state = load(); var sg = state.steg; go(sg && sg !== 'start' && (steps().indexOf(sg) >= 0 || (/^(f|a)-/.test(sg) && forsok(sg.slice(2))) || sg === 'period') ? sg : resumeStep()); return; }
    if (act === 'open') { document.getElementById('file-load').click(); return; }
    if (act === 'fromhandoff') { var ho = LCA.takeHandOff(); LCA.clearHandOff(); if (ho) { if (ho.modul === 'shift' || !load() || confirmReset()) useEnv(ho, true); } return; }
    if (act === 'dropho') { LCA.clearHandOff(); render(); return; }
    if (act === 'savefile') { var env = envelope(); LCA.download(env, LCA.fileName(env)); toast('Sparfilen är nedladdad.'); return; }
    if (act === 'pdf') { makePDF(); return; }
    if (act === 'tooversikt') { go('oversikt'); return; }
    if (act === 'toslut') { LCA.handOff(envelope()); window.location.href = '../slut/'; return; }
    if (act === 'restart') { if (confirmReset()) { state = fresh(); save(); go('start'); } return; }
    if (act === 'addbehov') { state.eget.behov.push({ id: nid('b'), text: '', axel: null, niva: null }); save(); rerender(); return; }
    if (act === 'addfraga') { var fs = forslagFragor(); addFraga(d('data-i') != null ? fs[+d('data-i')] : null); save(); rerender(); return; }
    if (act === 'delfraga') { var q = state.fragor[+d('data-i')]; if (forsokFor(q.id).length && !window.confirm('Lärandefrågan och dess försök tas bort. Fortsätta?')) return; state.fragor.splice(+d('data-i'), 1); state.forsok = state.forsok.filter(function (f) { return f.fraga !== q.id; }); save(); rerender(); return; }
    if (act === 'useex') { var f = curForsok(); if (f) { f.om = lc(d('data-ex')); if (!f.titel.trim()) f.titel = short(d('data-ex'), 50); save(); rerender(); } return; }
    if (act === 'openf') { go('f-' + d('data-id')); return; }
    if (act === 'opena') { go('a-' + d('data-id')); return; }
    if (act === 'nyttf') { var nf = newForsok(d('data-q')); save(); go('f-' + nf.id); return; }
    if (act === 'planeranasta') { var pf = newForsok(forsok(d('data-id')).fraga, d('data-id')); save(); go('f-' + pf.id); return; }
    if (act === 'period') { go('period'); return; }
    if (act === 'ics') { kalender(); return; }
    if (act === 'avsluta') { state.period.avslutad = !state.period.avslutad; save(); rerender(); return; }
    if (t.hasAttribute('data-spax')) { spel().axel = d('data-spax'); save(); rerender(); return; }
    if (act === 'spelstart') { var g0 = spel(); if (!spelAxel()) return; g0.axel = spelAxel(); g0.status = 'pagar'; g0.beslut = []; g0.val = { t: 0, gen: false, vid: false, kort: null }; save(); render(); window.scrollTo(0, 0); return; }
    if (t.hasAttribute('data-spt')) { spel().val.t = +d('data-spt'); save(); rerender(); return; }
    if (t.hasAttribute('data-spgen')) { spel().val.gen = d('data-spgen') === '1'; save(); rerender(); return; }
    if (t.hasAttribute('data-spvid')) { spel().val.vid = d('data-spvid') === '1'; save(); rerender(); return; }
    if (t.hasAttribute('data-spkort')) { spel().val.kort = d('data-spkort') || null; save(); rerender(); return; }
    if (act === 'spelkor') {
      var g1 = spel(), vv = g1.val; g1.beslut.push({ t: vv.t, gen: vv.gen, vid: vv.vid, kort: vv.kort });
      g1.val = { t: vv.t, gen: vv.gen, vid: vv.vid, kort: null };
      if (g1.beslut.length >= SIM.VECKOR) g1.status = 'klar';
      save(); render(); window.scrollTo(0, 0); return;
    }
    if (act === 'spelom') { var g2 = spel(); g2.status = 'pagar'; g2.beslut = []; g2.val = { t: 0, gen: false, vid: false, kort: null }; save(); render(); window.scrollTo(0, 0); return; }
    if (act === 'spelspela') { go('spel'); return; }
    if (act === 'spelhinder') { state.ram.hinder = spelHypotes().hinder; save(); rerender(); toast(C.spel.hypotes.inlagt); return; }
    if (act === 'spelforsok') { var fs0 = curForsok(), hy0 = spelHypotes(); if (fs0) { if (!fs0.om.trim()) fs0.om = hy0.om; if (!fs0.tror.trim()) fs0.tror = hy0.tror; if (!fs0.forutsagelse.trim()) fs0.forutsagelse = hy0.forutsagelse; save(); rerender(); refreshNext(); toast(C.spel.hypotes.inlagt); } return; }
    if (t.hasAttribute('data-bax')) { state.eget.behov[+d('data-i')].axel = d('data-bax'); save(); rerender(); return; }
    if (t.hasAttribute('data-bniva')) { state.eget.behov[+d('data-i')].niva = +d('data-bniva'); save(); rerender(); return; }
    if (t.hasAttribute('data-qkalla')) { var qq = state.fragor[+d('data-i')], b = behov(d('data-qkalla')); qq.kalla = b.id; qq.axel = b.axel; qq.fore = b.fore; save(); rerender(); return; }
    if (t.hasAttribute('data-qaxel')) { var q2 = state.fragor[+d('data-i')], b2 = behov(q2.kalla); q2.axel = d('data-qaxel'); q2.fore = b2 && b2.axlar && b2.axlar[q2.axel] != null ? Math.round(b2.axlar[q2.axel] * 10) / 10 : (b2 && b2.axel === q2.axel ? b2.fore : q2.fore); save(); rerender(); return; }
    if (t.hasAttribute('data-stod')) { var s = d('data-stod'), a = state.ram.stod; if (a.indexOf(s) >= 0) a.splice(a.indexOf(s), 1); else a.push(s); save(); rerender(); return; }
    if (t.hasAttribute('data-ftyp')) { curForsok().typ = d('data-ftyp'); save(); rerender(); return; }
    if (t.hasAttribute('data-flangd')) { curForsok().langd = +d('data-flangd'); save(); rerender(); return; }
    var av = /^a-/.test(view.step) ? forsok(view.step.slice(2)).av : null;
    if (av && t.hasAttribute('data-ajam')) { av.jamfort = +d('data-ajam'); save(); rerender(); return; }
    if (av && t.hasAttribute('data-eff')) { var ef = d('data-eff'); if (av.effekter.indexOf(ef) >= 0) av.effekter.splice(av.effekter.indexOf(ef), 1); else av.effekter.push(ef); save(); rerender(); return; }
    if (av && t.hasAttribute('data-avag')) { av.vag = +d('data-avag'); save(); rerender(); return; }
    if (av && t.hasAttribute('data-anu')) { av.axelNu = +d('data-anu'); av.datum = av.datum || today(); save(); rerender(); return; }
    if (av && t.hasAttribute('data-abes')) { av.beslut = d('data-abes'); save(); rerender(); return; }
    if (t.hasAttribute('data-pval')) { state.period.fragaVal[d('data-q')] = d('data-pval'); save(); rerender(); return; }
  });
  app.addEventListener('input', function (e) {
    var t = e.target;
    if (t.hasAttribute('data-path')) {
      var p = t.getAttribute('data-path');
      setPath(state, p, t.value);
      save(); refreshNext();
    }
  });
  app.addEventListener('change', function (e) {
    var t = e.target;
    if (t.hasAttribute('data-path') && t.type === 'date') { setPath(state, t.getAttribute('data-path'), t.value); save(); refreshNext(); }
  });
  app.addEventListener('toggle', function (e) { if (e.target.classList && e.target.classList.contains('parking')) view.parkOpen = e.target.open; }, true);
  document.getElementById('brand').addEventListener('click', function (e) { e.preventDefault(); go('start'); });
  function confirmReset() { return window.confirm('Den påbörjade körningen i den här webbläsaren ersätts. Spara en sparfil först om ni vill behålla den. Fortsätta?'); }
  function useEnv(env, nyKorning) {
    if (env.modul === 'shift') { state = env.data; state.kedja = env.kedja || state.kedja || {}; save(); go(resumeStep()); return; }
    if (nyKorning || view.step === 'start') state = fresh();
    state.kedja = LCA.chainFrom(env);
    if (env.aldreFormat) state.kedja._aldre = true;
    if (!state.meta.foretag) state.meta.foretag = env.organisation.namn || '';
    save(); toast('Underlaget från ' + LCA.NAMN[env.modul] + ' är inläst.'); go(view.step === 'start' || nyKorning ? 'uppgifter' : 'underlag');
  }
  document.getElementById('file-load').addEventListener('change', function (e) {
    var f = e.target.files[0]; e.target.value = ''; if (!f) return;
    LCA.readFile(f, function (env, err) {
      if (err) { toast(err); return; }
      if (env.modul === 'shift' && load() && load().fragor.length && !confirmReset()) return;
      useEnv(env, false);
    });
  });

  /* ---------- kalenderfil ---------- */
  function kalender() {
    var ev = [], org = state.meta.foretag || 'Shift';
    function d8(d) { return d.replace(/-/g, ''); }
    function esct(t) { return String(t).replace(/[\\;,]/g, function (c) { return '\\' + c; }).replace(/\n/g, ' '); }
    state.forsok.filter(forsokKlar).forEach(function (f) {
      if (!avKlar(f)) { ev.push([f.nar, 'Trimförsök startar: ' + f.titel, 'Om vi ' + f.om + ' så tror vi att ' + f.tror]); ev.push([addDays(f.nar, DAGAR[f.langd]), 'Kursavläsning: ' + f.titel, 'Förutsägelse: ' + f.forutsagelse]); }
    });
    if (state.ram.datum) ev.push([state.ram.datum, 'Lärperiodens slut: gemensam återkoppling', 'Pröva om lärandefrågorna fortfarande är rätt.']);
    if (!ev.length) { toast('Det finns inga datum att lägga in än.'); return; }
    var stamp = new Date().toISOString().replace(/[-:]/g, '').slice(0, 15) + 'Z';
    var ics = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Engstroms Mickla AB//Dialogverktyg LCA//SV', 'CALSCALE:GREGORIAN'];
    ev.forEach(function (e, i) { ics.push('BEGIN:VEVENT', 'UID:' + stamp + '-' + i + '@boost.mickla.se', 'DTSTAMP:' + stamp, 'DTSTART;VALUE=DATE:' + d8(e[0]), 'DTEND;VALUE=DATE:' + d8(addDays(e[0], 1)), 'SUMMARY:' + esct(org + ', ' + e[1]), 'DESCRIPTION:' + esct(e[2]), 'END:VEVENT'); });
    ics.push('END:VCALENDAR');
    var a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([ics.join('\r\n')], { type: 'text/calendar' })); a.download = 'lca-shift-' + LCA.slug(state.meta.foretag) + '.ics'; document.body.appendChild(a); a.click(); setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 500);
    toast('Kalenderfilen är nedladdad. Öppna den för att lägga in datumen.');
  }

  /* ---------- PDF ---------- */
  function makePDF() {
    if (!window.jspdf) { toast('PDF-funktionen kunde inte laddas.'); return; }
    var doc = new window.jspdf.jsPDF({ unit: 'mm', format: 'a4' }), L = 18, Wt = 174, PH = 297, y = 20, m = state.meta, A = C.avlasning;
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
    text('Shift: rapport', { size: 22, bold: true, after: 1 });
    text(C.verktyg + ' · ' + C.undertitel, { size: 9.5, color: MUT, after: 6 });
    text(m.foretag || 'Er organisation', { size: 15, bold: true, after: 1 });
    text('Start ' + m.datum + (m.namn ? ' · ' + m.namn : '') + (state.period.avslutad ? ' · Lärperioden avslutad' : ' · Lärperioden pågår'), { size: 10, color: MUT, after: 5 });
    LCA.reportPDF(rapportBlock(), text, label, L, Wt);
    rule(); label('Detaljer');
    var chain = Promise.resolve();
    if (avlasta().length) {
      ensure(100); label(C.oversikt.kurvaRubrik);
      var holder = document.createElement('div'); holder.style.cssText = 'position:absolute;left:-9999px;top:0;width:640px'; holder.innerHTML = kurvaSVG(); document.body.appendChild(holder);
      var el = holder.querySelector('svg'); el.setAttribute('width', '640'); el.setAttribute('height', '300');
      ensure(86); var y0 = y; y += 84;
      chain = doc.svg(el, { x: L, y: y0, width: Wt, height: 81 }).then(function () { holder.remove(); text('Grå streckad: lärdomar. Grön: delade med kollegor. Gul: införda i arbetssätt.', { size: 8.5, color: MUT }); });
    }
    chain.then(function () {
      label(C.oversikt.rorelseRubrik);
      state.fragor.forEach(function (q, i) { var r = rorelse(q); text((i + 1) + '. ' + axNamn(q.axel) + ': ' + fmt(r.fore) + ' före, ' + fmt(r.efter) + ' efter senaste kursavläsningen', { size: 9.5, after: 1 }); });
      rule(); label('Learning Direction Canvas');
      text(C.riktning.falt1, { bold: true, after: 0.5 }); kollisioner().forEach(function (k) { text('• ' + k.namn + (k.antagande ? '. Utmanar: ' + k.antagande : ''), { size: 9.5, after: 0.5 }); });
      y += 1.5; text(C.riktning.falt2, { bold: true, after: 0.5 }); behovLista().forEach(function (b) { text('• ' + b.namn + ', svagast: ' + lc(axNamn(b.axel)) + (b.fore != null ? ' (' + fmt(b.fore) + ' av 5)' : ''), { size: 9.5, after: 0.5 }); });
      y += 1.5; text(C.riktning.falt3, { bold: true, after: 0.5 }); state.fragor.forEach(function (q, i) { text((i + 1) + '. ' + q.text + (q.rubrik ? ' (' + q.rubrik + (q.vi ? ': ' + lc(viText(q.vi)) : '') + ')' : ''), { size: 9.5, after: 1 }); });
      if (state.ram.motto) text('Motto: ' + state.ram.motto, { size: 9.5, italic: true });
      if (state.ram.ansvarig || state.ram.datum) text((state.ram.ansvarig ? 'Ansvarig: ' + state.ram.ansvarig + '. ' : '') + (state.ram.datum ? 'Återkoppling: ' + state.ram.datum + '.' : ''), { size: 9.5 });
      if (state.ram.stod.length) text('Stöd från ledningen: ' + state.ram.stod.join(', ').toLowerCase() + '.', { size: 9.5 });
      var spr3 = spelRapport();
      if (spr3) { rule(); label(C.spel.namn); text(spr3.text, { size: 9.5 }); text(C.spel.hypotes.rubrik + ': ' + spr3.hypotes, { size: 9.5 }); C.spel.samtal.fragor.forEach(function (q, i) { var a = (spel().samtal[i] || '').trim(); if (a) { text(q, { size: 9.5, bold: true, after: 0.5 }); text(a, { size: 9.5, after: 1.5 }); } }); }
      rule(); label('Trimförsök och kursavläsningar');
      state.forsok.forEach(function (f) {
        var a = f.av, q = fraga(f.fraga); ensure(30);
        text(f.titel + ' (' + C.oversikt.status[status(f)].toLowerCase() + ')', { bold: true, after: 0.5 });
        text((q ? q.text + ' · ' : '') + (C.forsok.typer[f.typ] ? C.forsok.typer[f.typ].namn : '') + ' · start ' + (f.nar || ''), { size: 8.5, color: MUT, after: 1 });
        if (f.skaver) text('Det här skaver: ' + f.skaver, { size: 9.5, after: 0.5 });
        text('Om vi ' + f.om + ' så tror vi att ' + f.tror, { size: 9.5, after: 0.5 });
        text('Förutsägelse: ' + f.forutsagelse + (f.matt ? '. Tecken: ' + f.matt : ''), { size: 9.5, after: 1 });
        if (a && avKlar(f)) {
          text('Kursavläsning: ' + a.hande + ' (' + A.jamforelser[a.jamfort].toLowerCase() + ')', { size: 9.5, after: 0.5 });
          if (a.bast) text('Bäst: ' + a.bast, { size: 9.5, after: 0.5 });
          if (a.overraskade) text('Överraskade: ' + a.overraskade, { size: 9.5, after: 0.5 });
          text('Effekt: ' + (a.effekter.join(', ') || 'ingen angiven') + '. Lärdomens väg: ' + A.vagar[a.vag].toLowerCase() + '. Nu: ' + a.axelNu + ' av 5.', { size: 9.5, after: 0.5 });
          text('Beslut: ' + A.beslut[a.beslut] + '. Nästa lilla försök: ' + a.nasta, { size: 9.5, after: 3 });
        } else y += 2;
      });
      if (state.period.monster || state.period.skala || state.period.nasta) { rule(); label(C.period.rubrik); if (state.period.monster) text('Mönster: ' + state.period.monster, { size: 9.5 }); state.fragor.forEach(function (q) { var v = state.period.fragaVal[q.id]; if (v) text(C.period.fragaVal[v] + ': ' + q.text, { size: 9.5, after: 1 }); }); if (state.period.nasta) text('Nästa lärperiod: ' + state.period.nasta, { size: 9.5 }); }
      if (state.parkering.trim()) { rule(); label('Parkerade frågor'); text(state.parkering, { size: 9.5 }); }
      rule(); label('Vetenskaplig grund', MUT); text(LCA.TEORI.text + ': ' + LCA.TEORI.url, { size: 8.5, color: MUT });
      text(C.integritet, { size: 8, color: MUT });
      var n = doc.getNumberOfPages(), logo = document.querySelector('.footer img'); if (logo && !logo.complete) logo = null;
      for (var i = 1; i <= n; i++) { doc.setPage(i); doc.setFont('helvetica', 'normal'); doc.setFontSize(7.5); doc.setTextColor.apply(doc, MUT); doc.text(C.verktyg + ' · Shift · ' + C.version + ' · ' + C.upphov, L, PH - 10); doc.text('Sida ' + i + ' av ' + n, L + Wt, PH - 10, { align: 'right' }); if (logo) { try { doc.addImage(logo, 'PNG', L + Wt - 24, PH - 13.6, 4.5, 4.5); } catch (e) {} } }
      doc.save('lca-shift-rapport-' + LCA.slug(m.foretag) + '-' + (m.datum || today()) + '.pdf');
    }).catch(function (err) { console.error(err); toast('Rapporten kunde inte skapas. Försök igen.'); });
  }

  document.getElementById('footer').innerHTML = '<span class="maker"><img src="../img/mickla.png" alt="Mickla" width="22" height="22">' + esc(C.upphov) + '</span><span>' + esc(C.verktyg) + ' · Shift · ' + esc(C.version) + '</span>';
  render();
  window.__shift = { state: function () { return state; }, go: go, set: function (s) { state = s; save(); }, envelope: envelope };
})();
