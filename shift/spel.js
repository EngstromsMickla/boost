/* Dialogverktyg — Learning Curve Approach: spelmotorn för Kapabilitetsfällan (Shift, steg 0).
   En förenklad modell efter Repenning & Sterman (2001; 2002): att jobba hårdare ger snabb effekt men
   eroderar förmågan, att jobba smartare ger en svacka först och ett lyft sedan. Förmågan syns sent.
   Vid sidan av (skunk works) efter Augsdorfer (2005), Criscuolo m.fl. (2014) och Mainemelis (2010):
   ger förmåga utan mandat, men lärdomen stannar hos dem som gjorde den tills den lyfts fram.
   Talen är inte mått på någon verksamhet. De är valda så att mönstren från forskningen syns inom åtta veckor.
   Reglerna redovisas i Spårbarhet (js/sparbarhet-data.js). © Engströms Mickla AB 2026 */
(function () {
  'use strict';
  var VECKOR = 8;
  var M = {
    start: { formaga: { F: 40, eff: 0.5, eng: 1 }, mandat: { F: 55, eff: 1, eng: 1 }, vilja: { F: 55, eff: 1, eng: 0.5 } },
    energi: 70,
    timmar: 40,
    skala: 108.7,                /* så att leveransen motsvarar efterfrågan första veckan utan förbättringstid */
    prodBas: 0.45,               /* produktivitet = prodBas + (1 - prodBas) * förmåga / startförmåga */
    forbattringsVinst: 9,     /* förmåga per vecka vid 12 timmar och full verkan; kommer en vecka senare */
    slitage: 1,                  /* förmågan förfaller utan underhåll */
    slitageGenvag: 3,            /* genvägar sliter extra: kontroller och dokumentation hoppas över */
    genvagFart: 1.12,            /* genvägar ger mer gjort just nu */
    genvagFel: 2,                /* och dubbelt så många fel som kommer tillbaka */
    felBas: 0.08,                /* andel av det som görs som kommer tillbaka som omarbete */
    vidSidanVinst: 4, vidSidanEnergi: 4, vidSidanForfall: 0.85, lyftAndel: 0.8,
    tillbakaVid: -8              /* svagt mandat: ledningen tar tillbaka halva förbättringstiden efter en vecka med eftersläpning */
  };

  function clamp(x, a, b) { return Math.max(a, Math.min(b, x)); }

  /* Händelser vecka för vecka. Samma för alla, så att grupper kan jämföra sina vägar. Vecka 6 beror på axeln. */
  function handelse(w, axel, H) {
    var e = H.veckor[w];
    if (w === 5 && H.vecka6 && H.vecka6[axel]) e = H.vecka6[axel];
    return e;
  }

  /* Spelar upp alla beslut från början. beslut[w] = { t: 0|4|8|12, gen: bool, vid: bool, kort: id|null } */
  function simulate(axel, beslut, H, opt) {
    opt = opt || {};
    var s0 = M.start[axel] || M.start.mandat;
    var Fref = s0.F, def0 = M.felBas * 100 / (1 - M.felBas);
    var s = { F: s0.F, E: M.energi, Rw: def0, S: 0, eff: s0.eff, eng: s0.eng, skyddad: false, defMult: 1, lastGap: 0, vinstVisad: false, lyft: 0, stoppat: 0 };
    var pend = [], skjut = [], rec = [];
    for (var w = 0; w < beslut.length && w < VECKOR; w++) {
      var d = beslut[w], e = handelse(w, axel, H) || {}, kort = d.kort, kost = 0;
      var D = 100 + (e.efterfragan || 0) + (opt.hogtTryck ? 4 : 0) + (skjut[w] || 0);
      var kap = 1 - (e.franvaro || 0);
      /* Handlingskort */
      if (kort === 'nej') { D -= 12; skjut[w + 2] = (skjut[w + 2] || 0) + 6; }
      if ((kort === 'lyft' || kort === 'ja') && s.S > 0) { s.lyft += s.S; s.F += M.lyftAndel * s.S; s.S = 0; if (kort === 'lyft') kost += 0.05; }
      if (kort === 'ja') s.E += 5;
      if (kort === 'lar') { s.eff += 0.4; kost += 0.08; }
      if (kort === 'stod') pend[w + 1] = (pend[w + 1] || 0) + 6;
      if (kort === 'check') { s.defMult *= 0.6; kost += 0.08; }
      if (kort === 'skydda') s.skyddad = true;
      if (kort === 'hinder') s.eff += 0.25;
      if (kort === 'vinst') { s.eng += 0.25; s.E += 6; s.vinstVisad = true; }
      if (kort === 'kollega') s.eng += 0.3;
      if (kort === 'fira') s.E += 10;
      s.eng = clamp(s.eng, 0.1, 1);
      /* Förbättringstiden: svagt mandat tar tillbaka, svag vilja använder den halvhjärtat. Det som inte används går till leverans. */
      var t = d.t || 0, tagen = false;
      if (axel === 'mandat' && !s.skyddad && s.lastGap < M.tillbakaVid && t > 0) { t = t / 2; tagen = true; }
      var tEff = t * s.eng;
      /* Leverans */
      var W = (M.timmar - tEff) / M.timmar * kap * (1 - kost);
      var p = M.prodBas + (1 - M.prodBas) * s.F / Fref + s.S / 300;
      if (d.gen) p *= M.genvagFart;
      var G = M.skala * W * p * (0.8 + 0.2 * s.E / M.energi);
      var drain = Math.min(s.Rw, 0.5 * s.Rw + 0.5 * def0);
      s.Rw -= drain;
      var lev = G - drain, gap = lev - D;
      s.Rw += G * M.felBas * (2 - s.F / Fref) * s.defMult * (d.gen ? M.genvagFel : 1);
      /* Förmågan: förbättring kommer en vecka senare, slitaget direkt */
      var ankom = pend[w] || 0;
      pend[w + 1] = (pend[w + 1] || 0) + s.eff * (tEff / 12) * M.forbattringsVinst * (e.verkan || 1);
      s.F += ankom - M.slitage - (d.gen ? M.slitageGenvag : 0);
      if (d.vid) { s.S += M.vidSidanVinst * (axel === 'formaga' ? 0.7 : 1); } else s.S *= M.vidSidanForfall;
      /* Vecka 6 */
      if (e.effekt === 'fragar' && s.S > 0) { s.stoppat += s.S / 2; s.S *= 0.5; }
      if (e.effekt === 'slutar') { s.F -= 6; s.S *= 0.6; }
      if (e.effekt === 'kampanj' && !s.vinstVisad) s.eng -= 0.15;
      /* Energi: eftersläpning tär, märkbara framsteg ger kraft (Amabile & Kramer 2011) */
      s.E += 2 - (gap < -8 ? 5 : 0) - (gap < -20 ? 4 : 0) - (d.vid ? M.vidSidanEnergi : 0) - (d.gen ? 2 : 0) + (ankom > 3 ? 4 : 0);
      s.E = clamp(s.E, 10, 100); s.F = clamp(s.F, 5, 100); s.eng = clamp(s.eng, 0.1, 1);
      s.lastGap = gap;
      rec.push({ w: w, D: D, lev: lev, gap: gap, F: s.F, E: s.E, Rw: s.Rw, S: s.S, t: d.t || 0, tEff: tEff, tagen: tagen, gen: !!d.gen, vid: !!d.vid, kort: kort || null, ankom: ankom });
    }
    return { rec: rec, slut: s, startF: s0.F };
  }

  /* Två referensvägar med samma motor och samma händelser. */
  function referens(axel, typ, H, opt) {
    var b = [], first = { formaga: 'lar', mandat: 'skydda', vilja: 'vinst' }[axel];
    if (typ === 'leverans') {
      /* Leverans först: ingen förbättringstid, genvägar när det släpar. */
      var gap = 0;
      for (var w = 0; w < VECKOR; w++) { b.push({ t: 0, gen: gap < -5, vid: false, kort: null }); gap = simulate(axel, b, H, opt).rec[w].gap; }
      return simulate(axel, b, H, opt);
    }
    for (var k = 0; k < VECKOR; k++) b.push({ t: 8, gen: false, vid: false, kort: k === 0 ? first : null });
    return simulate(axel, b, H, opt);
  }

  /* Kvalitativa nivåer för det som visas under spelet. */
  function leveransNiva(gap) { return gap >= 3 ? 0 : gap >= -5 ? 1 : gap >= -15 ? 2 : 3; }
  function energiNiva(E) { return E < 35 ? 0 : E < 65 ? 1 : 2; }
  /* Förmågan visas i förhållande till där gruppen började, eftersom startläget skiljer sig mellan axlarna. */
  function formagaNiva(F, start) { return F < start - 5 ? 0 : F > start + 5 ? 2 : 1; }

  /* Mönstret i spelarens väg. Flera kan gälla samtidigt; det första är huvudmönstret. */
  function monster(sim, beslut) {
    var r = sim.rec, n = r.length, out = [];
    if (!n) return out;
    var snittT = beslut.reduce(function (a, b) { return a + (b.t || 0); }, 0) / n;
    var gen = beslut.filter(function (b) { return b.gen; }).length, vid = beslut.filter(function (b) { return b.vid; }).length;
    var dF = r[n - 1].F - sim.startF;
    var svacka = r.some(function (x) { return x.t >= 8 && x.gap < -5; });
    var holl = svacka && beslut.slice(-3).every(function (b) { return (b.t || 0) >= 4; });
    if (dF <= -3 && snittT < 4) out.push('falla');
    else if (dF >= 8) out.push('uppfor');
    else out.push('mellan');
    if (gen >= 3) out.push('genvagar');
    if (vid >= 2) out.push(sim.slut.lyft > 0 ? 'vidLyft' : 'vidDolt');
    if (svacka) out.push(holl ? 'holl' : 'slappte');
    if (r.some(function (x) { return x.tagen; })) out.push('tagen');
    return out;
  }

  window.LCASpel = { VECKOR: VECKOR, M: M, simulate: simulate, referens: referens, monster: monster, leveransNiva: leveransNiva, energiNiva: energiNiva, formagaNiva: formagaNiva };
})();
