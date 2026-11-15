/* Svansen v0.1. Huvudet lär sig av blå idéer, kunskapen vandrar som en puls genom kroppen.
   Delar som kan mer följer huvudets väg tätt; delar som inte kan svänger vida och kan slitas loss mot pelarna.
   Delar som redan har lärt sig tar emot nästa idé snabbare (Cohen & Levinthal 1990). Nya delar börjar på noll.
   Alla tal nedan är designval för känslan, inte mätningar. */
(function () {
  'use strict';

  /* ---------- Språk ---------- */
  var S = window.SVANSEN;
  var sprakKoder = Object.keys(S.sprak);
  function valtSprak() {
    var q = new URLSearchParams(location.search).get('lang');
    if (q && S.sprak[q]) return q;
    try { var s = localStorage.getItem('lca.svansen.sprak'); if (s && S.sprak[s]) return s; } catch (e) {}
    return S.standardSprak;
  }
  var sprak = valtSprak();
  var T = S.sprak[sprak];

  /* ---------- Modell (designval) ---------- */
  var M = {
    rundtid: 75,          // sekunder
    fart: 30,             // huvudets fart, enheter per sekund (100 enheter = kortaste sidan)
    sving: 4.6,           // huvudets svängfart, radianer per sekund
    avstand: 2.7,         // avstånd mellan leder längs vägen
    rHuvud: 2.5, rLed: 1.9,
    startLeder: 6,
    styvhet: [7, 16, 36, 80],   // per kunnandenivå 0..3+
    dampning: [0.32, 0.5, 0.75, 0.95],
    pulsTid: 0.42,        // sekunder per led för en led som inte kan något
    forkunskap: 0.9,      // varje nivå man redan har gör mottagandet snabbare
    maxMat: 5, matIntervall: 1.1,
    ideIntervall: 10, forstaIde: 4,
    pelare: 5, rPelare: [4.5, 7],
    skydd: 0.5            // sekunder utan ny lossning efter en lossning
  };

  /* ---------- Duk ---------- */
  var duk = document.getElementById('duk');
  var ctx = duk.getContext('2d');
  var scen = document.getElementById('scen');
  var W = 0, H = 0, U = 1, dpr = 1;
  var lugn = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function storlek() {
    var r = scen.getBoundingClientRect();
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    duk.width = Math.round(r.width * dpr); duk.height = Math.round(r.height * dpr);
    var min = Math.min(r.width, r.height);
    U = min / 100;
    W = r.width / U; H = r.height / U;   // världen i enheter
  }

  /* ---------- Ljud (syntetiserat, inget hämtas) ---------- */
  var ljud = { pa: true, ac: null };
  try { ljud.pa = localStorage.getItem('lca.svansen.ljud') !== 'av'; } catch (e) {}
  function ac() {
    if (!ljud.ac) { var A = window.AudioContext || window.webkitAudioContext; if (A) ljud.ac = new A(); }
    return ljud.ac;
  }
  function ton(f1, f2, tid, typ, vol) {
    if (!ljud.pa) return; var a = ac(); if (!a) return;
    var o = a.createOscillator(), g = a.createGain(), t = a.currentTime;
    o.type = typ || 'sine'; o.frequency.setValueAtTime(f1, t); o.frequency.exponentialRampToValueAtTime(f2, t + tid);
    g.gain.setValueAtTime(vol || 0.12, t); g.gain.exponentialRampToValueAtTime(0.0001, t + tid);
    o.connect(g); g.connect(a.destination); o.start(t); o.stop(t + tid + 0.02);
  }
  var LJ = {
    at: function () { ton(420, 760, 0.09, 'sine', 0.09); },
    ide: function () { ton(520, 1040, 0.12, 'triangle', 0.12); setTimeout(function () { ton(780, 1560, 0.16, 'triangle', 0.1); }, 90); },
    led: function (i) { ton(900 + i * 6, 920 + i * 6, 0.04, 'sine', 0.025); },
    framme: function () { [660, 830, 990, 1320].forEach(function (f, i) { setTimeout(function () { ton(f, f * 1.01, 0.22, 'triangle', 0.09); }, i * 70); }); },
    loss: function () { ton(220, 70, 0.22, 'square', 0.07); },
    stuts: function () { ton(160, 90, 0.08, 'sine', 0.12); }
  };

  /* ---------- Tillstånd ---------- */
  var G = null;
  var styr = { x: null, y: null, aktiv: false, vanster: false, hoger: false };

  function slump(a, b) { return a + Math.random() * (b - a); }
  function avst(ax, ay, bx, by) { var dx = ax - bx, dy = ay - by; return Math.sqrt(dx * dx + dy * dy); }
  function niva(l) { return Math.min(l, 3); }

  function nyttSpel() {
    var g = {
      t: 0, slut: false,
      huvud: { x: W * 0.25, y: H * 0.5, v: 0, skala: 1 },
      spar: [], leder: [], pulser: [], mat: [], ideer: [], pelare: [], losa: [], gnistor: [], texter: [],
      huvudKan: 0, tappade: 0, skak: 0, matKlocka: 0, ideKlocka: M.forstaIde, skydd: 0,
      logg: [], loggKlocka: 0, pulsTider: []
    };
    // Spåret fylls bakåt så att kroppen ligger rakt från start.
    for (var i = 0; i < 80; i++) g.spar.push({ x: g.huvud.x - i * 0.6, y: g.huvud.y });
    for (var j = 0; j < M.startLeder; j++) {
      var x = g.huvud.x - (j + 1) * M.avstand;
      g.leder.push({ x: x, y: g.huvud.y, vx: 0, vy: 0, kan: 0, blixt: 0, skala: 1 });
    }
    // Pelare, inte för nära start.
    var forsok = 0;
    while (g.pelare.length < M.pelare && forsok++ < 400) {
      var r = slump(M.rPelare[0], M.rPelare[1]);
      var p = { x: slump(r + 6, W - r - 6), y: slump(r + 10, H - r - 6), r: r };
      if (avst(p.x, p.y, g.huvud.x, g.huvud.y) < 22) continue;
      if (g.pelare.some(function (q) { return avst(p.x, p.y, q.x, q.y) < p.r + q.r + 14; })) continue;
      g.pelare.push(p);
    }
    return g;
  }

  function friPlats(marg) {
    for (var k = 0; k < 200; k++) {
      var x = slump(marg, W - marg), y = slump(marg + 6, H - marg);
      var ok = !G.pelare.some(function (p) { return avst(x, y, p.x, p.y) < p.r + marg; }) && avst(x, y, G.huvud.x, G.huvud.y) > 12;
      if (ok) return { x: x, y: y };
    }
    return { x: W / 2, y: H / 2 };
  }

  /* Punkt på spåret ett visst avstånd bakom huvudet. */
  function sparPunkt(d) {
    var s = G.spar, kvar = d;
    for (var i = 0; i < s.length - 1; i++) {
      var seg = avst(s[i].x, s[i].y, s[i + 1].x, s[i + 1].y);
      if (seg >= kvar) { var f = seg ? kvar / seg : 0; return { x: s[i].x + (s[i + 1].x - s[i].x) * f, y: s[i].y + (s[i + 1].y - s[i].y) * f }; }
      kvar -= seg;
    }
    return s[s.length - 1];
  }
  function trimmaSpar() {
    var behov = (G.leder.length + 3) * M.avstand + 10, sum = 0, s = G.spar;
    for (var i = 0; i < s.length - 1; i++) { sum += avst(s[i].x, s[i].y, s[i + 1].x, s[i + 1].y); if (sum > behov) { s.length = i + 2; return; } }
  }

  function text(x, y, t, farg, stor) { G.texter.push({ x: x, y: y, t: t, liv: 1.3, farg: farg || '#141414', stor: stor || 3.4 }); }
  function gnistor(x, y, farg, n) {
    for (var i = 0; i < n; i++) { var a = slump(0, Math.PI * 2), v = slump(8, 26); G.gnistor.push({ x: x, y: y, vx: Math.cos(a) * v, vy: Math.sin(a) * v, liv: slump(0.3, 0.6), farg: farg }); }
  }

  /* ---------- Uppdatering ---------- */
  function steg(dt) {
    var g = G; g.t += dt;
    var h = g.huvud;

    // Styrning: mot fingret/musen, eller med piltangenter.
    var mal = h.v;
    if (styr.aktiv && styr.x != null) {
      var dx = styr.x - h.x, dy = styr.y - h.y;
      if (dx * dx + dy * dy > 4) mal = Math.atan2(dy, dx);
    }
    var diff = Math.atan2(Math.sin(mal - h.v), Math.cos(mal - h.v));
    var maxV = M.sving * dt;
    h.v += Math.max(-maxV, Math.min(maxV, diff));
    if (styr.vanster) h.v -= M.sving * dt;
    if (styr.hoger) h.v += M.sving * dt;
    h.x += Math.cos(h.v) * M.fart * dt; h.y += Math.sin(h.v) * M.fart * dt;

    // Väggar: studsa mjukt.
    var r = M.rHuvud;
    if (h.x < r) { h.x = r; h.v = Math.PI - h.v; LJ.stuts(); }
    if (h.x > W - r) { h.x = W - r; h.v = Math.PI - h.v; LJ.stuts(); }
    if (h.y < r) { h.y = r; h.v = -h.v; LJ.stuts(); }
    if (h.y > H - r) { h.y = H - r; h.v = -h.v; LJ.stuts(); }
    // Pelare: huvudet studsar.
    g.pelare.forEach(function (p) {
      var d = avst(h.x, h.y, p.x, p.y);
      if (d < p.r + r) {
        var nx = (h.x - p.x) / d, ny = (h.y - p.y) / d;
        h.x = p.x + nx * (p.r + r); h.y = p.y + ny * (p.r + r);
        var vx = Math.cos(h.v), vy = Math.sin(h.v), dot = vx * nx + vy * ny;
        h.v = Math.atan2(vy - 2 * dot * ny, vx - 2 * dot * nx);
        h.skala = 0.8; g.skak = Math.max(g.skak, 1.2); LJ.stuts();
      }
    });
    h.skala += (1 - h.skala) * Math.min(1, dt * 10);

    g.spar.unshift({ x: h.x, y: h.y });
    trimmaSpar();

    // Kroppen: varje led dras mot sin plats på spåret. Styvheten beror på kunnandet.
    var fore = h;
    g.leder.forEach(function (l, i) {
      var p = sparPunkt((i + 1) * M.avstand);
      var n = niva(l.kan), k = M.styvhet[n], c = 2 * Math.sqrt(k) * M.dampning[n];
      l.vx += (k * (p.x - l.x) - c * l.vx) * dt;
      l.vy += (k * (p.y - l.y) - c * l.vy) * dt;
      l.x += l.vx * dt; l.y += l.vy * dt;
      // Rep till leden framför, så att svansen svänger i stället för att släpa efter.
      var d = avst(l.x, l.y, fore.x, fore.y), max = M.avstand * 1.9;
      if (d > max) { var f = (d - max) / d; l.x += (fore.x - l.x) * f; l.y += (fore.y - l.y) * f; }
      l.blixt = Math.max(0, l.blixt - dt * 2.5);
      l.skala += (1 - l.skala) * Math.min(1, dt * 8);
      fore = l;
    });

    // Leder som slår i en pelare slits loss.
    g.skydd = Math.max(0, g.skydd - dt);
    if (g.skydd === 0) {
      for (var i = 2; i < g.leder.length; i++) {
        var l = g.leder[i], traff = null;
        for (var q = 0; q < g.pelare.length; q++) { var p = g.pelare[q]; if (avst(l.x, l.y, p.x, p.y) < p.r + M.rLed * 0.85) { traff = p; break; } }
        if (traff) {
          g.leder.splice(i, 1);
          var a = Math.atan2(l.y - traff.y, l.x - traff.x);
          g.losa.push({ x: l.x, y: l.y, vx: Math.cos(a) * 30 + l.vx * 0.3, vy: Math.sin(a) * 30 + l.vy * 0.3, rot: 0, vr: slump(-9, 9), liv: 1.4, kan: l.kan });
          g.pulser.forEach(function (pu) { if (pu.i > i) pu.i -= 1; });
          g.tappade++; g.skydd = M.skydd; g.skak = Math.max(g.skak, 2.2);
          gnistor(l.x, l.y, '#d1431d', 10); LJ.loss();
          text(l.x, l.y - 4, T.oj[Math.floor(Math.random() * T.oj.length)], '#d1431d');
          break;
        }
      }
    }

    // Lösa delar flyger, studsar och blir mat igen (som nybörjare).
    g.losa = g.losa.filter(function (o) {
      o.liv -= dt; o.x += o.vx * dt; o.y += o.vy * dt; o.vx *= 0.96; o.vy *= 0.96; o.rot += o.vr * dt;
      if (o.x < 2 || o.x > W - 2) o.vx *= -1; if (o.y < 2 || o.y > H - 2) o.vy *= -1;
      if (o.liv <= 0) { g.mat.push({ x: Math.max(3, Math.min(W - 3, o.x)), y: Math.max(3, Math.min(H - 3, o.y)), puls: 0 }); return false; }
      return true;
    });

    // Pulser: kunskapen vandrar led för led. Den som redan kan tar emot snabbare.
    g.pulser = g.pulser.filter(function (pu) {
      var led = g.leder[Math.floor(pu.i)];
      if (!led) { avslutaPuls(pu); return false; }
      var tid = M.pulsTid / (1 + M.forkunskap * niva(led.kan));
      var fore = Math.floor(pu.i);
      pu.i += dt / tid;
      var efter = Math.floor(pu.i);
      for (var j = fore; j < efter && j < g.leder.length; j++) { g.leder[j].kan += 1; g.leder[j].blixt = 1; g.leder[j].skala = 1.35; LJ.led(j); }
      if (pu.i >= g.leder.length) { avslutaPuls(pu); return false; }
      return true;
    });

    // Mat och idéer.
    g.matKlocka -= dt;
    if (g.matKlocka <= 0 && g.mat.length < M.maxMat) { g.mat.push(Object.assign(friPlats(5), { puls: slump(0, 6) })); g.matKlocka = M.matIntervall; }
    g.ideKlocka -= dt;
    if (g.ideKlocka <= 0 && g.ideer.length === 0 && g.t < M.rundtid - 6) { g.ideer.push(Object.assign(friPlats(8), { puls: 0, fodd: g.t })); g.ideKlocka = M.ideIntervall; }

    g.mat = g.mat.filter(function (m) {
      m.puls += dt;
      if (avst(m.x, m.y, h.x, h.y) < M.rHuvud + 1.6) {
        var sist = g.leder[g.leder.length - 1] || h;
        g.leder.push({ x: sist.x, y: sist.y, vx: 0, vy: 0, kan: 0, blixt: 0, skala: 0.3 });
        h.skala = 1.3; gnistor(m.x, m.y, '#8a8a86', 5); LJ.at();
        return false;
      }
      return true;
    });
    g.ideer = g.ideer.filter(function (m) {
      m.puls += dt;
      if (avst(m.x, m.y, h.x, h.y) < M.rHuvud + 2.4) {
        g.huvudKan += 1; h.skala = 1.5;
        g.pulser.push({ i: 0, start: g.t, leder: g.leder.length });
        gnistor(m.x, m.y, '#1e5fcc', 16); LJ.ide();
        return false;
      }
      return true;
    });

    // Effekter.
    g.skak = Math.max(0, g.skak - dt * 8);
    g.gnistor = g.gnistor.filter(function (s) { s.liv -= dt; s.x += s.vx * dt; s.y += s.vy * dt; s.vx *= 0.92; s.vy *= 0.92; return s.liv > 0; });
    g.texter = g.texter.filter(function (t) { t.liv -= dt; t.y -= 6 * dt; return t.liv > 0; });

    // Logg för slutdiagrammet.
    g.loggKlocka -= dt;
    if (g.loggKlocka <= 0) { logga(); g.loggKlocka = 0.5; }

    if (g.t >= M.rundtid) { logga(); avsluta(); }
  }

  function avslutaPuls(pu) {
    var n = Math.max(1, pu.leder);
    G.pulsTider.push({ tid: G.t - pu.start, perLed: (G.t - pu.start) / n });
    var sist = G.leder[G.leder.length - 1] || G.huvud;
    var ring = { x: sist.x, y: sist.y, r: 1, liv: 0.7 };
    G.gnistor.push({ ring: ring, x: sist.x, y: sist.y, vx: 0, vy: 0, liv: 0.7, farg: '#1e5fcc' });
    text(sist.x, sist.y - 5, T.framme[Math.floor(Math.random() * T.framme.length)], '#1e5fcc', 3.8);
    LJ.framme();
  }

  function kroppsSnitt() {
    if (!G.leder.length) return 0;
    var s = 0; G.leder.forEach(function (l) { s += l.kan; }); return s / G.leder.length;
  }
  function logga() { G.logg.push({ t: Math.min(G.t, M.rundtid), huvud: G.huvudKan, kropp: kroppsSnitt(), langd: G.leder.length }); }

  /* ---------- Ritning ---------- */
  var FARG = ['#c9c9c4', '#8a8a86', '#4a4a48', '#141414'];
  function rita() {
    var g = G;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, duk.width, duk.height);
    var sk = (!lugn && g.skak > 0) ? g.skak : 0;
    ctx.setTransform(dpr * U, 0, 0, dpr * U, (slump(-sk, sk)) * U * dpr * 0.5, (slump(-sk, sk)) * U * dpr * 0.5);

    // Rutnät, lågmält.
    ctx.strokeStyle = '#f0f0ec'; ctx.lineWidth = 0.15;
    for (var x = 0; x < W; x += 10) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke(); }
    for (var y = 0; y < H; y += 10) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }

    g.pelare.forEach(function (p) {
      ctx.fillStyle = '#fbe3da'; cirkel(p.x, p.y, p.r + 0.8); ctx.fill();
      ctx.fillStyle = '#d1431d'; cirkel(p.x, p.y, p.r); ctx.fill();
    });
    g.mat.forEach(function (m) { ctx.fillStyle = '#8a8a86'; cirkel(m.x, m.y, 1.1 + Math.sin(m.puls * 5) * 0.15); ctx.fill(); });
    g.ideer.forEach(function (m) {
      var p = 1 + Math.sin(m.puls * 6) * 0.12;
      ctx.fillStyle = 'rgba(30,95,204,.15)'; cirkel(m.x, m.y, 3.6 * p); ctx.fill();
      ctx.fillStyle = '#1e5fcc'; cirkel(m.x, m.y, 2 * p); ctx.fill();
    });

    // Kroppen bakifrån, så att huvudet ligger överst.
    for (var i = g.leder.length - 1; i >= 0; i--) {
      var l = g.leder[i], n = niva(l.kan);
      var rr = M.rLed * l.skala * (1 - i / (g.leder.length + 30) * 0.5);
      ctx.fillStyle = FARG[n]; cirkel(l.x, l.y, rr); ctx.fill();
      if (l.blixt > 0) { ctx.strokeStyle = 'rgba(30,95,204,' + l.blixt + ')'; ctx.lineWidth = 0.5; cirkel(l.x, l.y, rr + 0.7 + (1 - l.blixt)); ctx.stroke(); }
    }
    // Pulser syns som en blå ring som vandrar.
    g.pulser.forEach(function (pu) {
      var l = g.leder[Math.min(g.leder.length - 1, Math.floor(pu.i))]; if (!l) return;
      ctx.strokeStyle = '#1e5fcc'; ctx.lineWidth = 0.6; cirkel(l.x, l.y, M.rLed + 1.2); ctx.stroke();
    });

    var h = g.huvud;
    ctx.fillStyle = '#141414'; cirkel(h.x, h.y, M.rHuvud * h.skala); ctx.fill();
    // Ögon tittar dit huvudet ska.
    var ox = Math.cos(h.v), oy = Math.sin(h.v), px = -oy, py = ox;
    [-1, 1].forEach(function (s) {
      var ex = h.x + ox * 0.9 + px * s * 1.05, ey = h.y + oy * 0.9 + py * s * 1.05;
      ctx.fillStyle = '#fff'; cirkel(ex, ey, 0.65); ctx.fill();
      ctx.fillStyle = '#141414'; cirkel(ex + ox * 0.25, ey + oy * 0.25, 0.3); ctx.fill();
    });
    // En blå prick i pannan per idé huvudet har (högst fem syns).
    for (var k = 0; k < Math.min(g.huvudKan, 5); k++) { var vk = h.v + Math.PI + (k - (Math.min(g.huvudKan, 5) - 1) / 2) * 0.5; ctx.fillStyle = '#1e5fcc'; cirkel(h.x + Math.cos(vk) * 1.5, h.y + Math.sin(vk) * 1.5, 0.32); ctx.fill(); }

    g.losa.forEach(function (o) {
      ctx.save(); ctx.translate(o.x, o.y); ctx.rotate(o.rot);
      ctx.globalAlpha = Math.min(1, o.liv * 1.5);
      ctx.fillStyle = FARG[niva(o.kan)]; cirkel(0, 0, M.rLed); ctx.fill();
      ctx.fillStyle = '#fff'; cirkel(0.6, -0.3, 0.45); ctx.fill(); cirkel(-0.5, 0.4, 0.45); ctx.fill();
      ctx.restore();
    });
    g.gnistor.forEach(function (s) {
      ctx.globalAlpha = Math.max(0, s.liv * 1.6);
      if (s.ring) { ctx.strokeStyle = s.farg; ctx.lineWidth = 0.5; cirkel(s.x, s.y, 2 + (0.7 - s.liv) * 18); ctx.stroke(); }
      else { ctx.fillStyle = s.farg; cirkel(s.x, s.y, 0.5); ctx.fill(); }
      ctx.globalAlpha = 1;
    });
    g.texter.forEach(function (t) {
      ctx.globalAlpha = Math.min(1, t.liv * 2);
      ctx.font = '600 ' + t.stor + 'px Poppins, sans-serif'; ctx.textAlign = 'center';
      ctx.lineWidth = 0.9; ctx.strokeStyle = '#fff'; ctx.strokeText(t.t, t.x, t.y);
      ctx.fillStyle = t.farg; ctx.fillText(t.t, t.x, t.y);
      ctx.globalAlpha = 1;
    });
  }
  function cirkel(x, y, r) { ctx.beginPath(); ctx.arc(x, y, Math.max(0.01, r), 0, Math.PI * 2); }

  /* ---------- HUD ---------- */
  var hud = document.getElementById('hud');
  function visaHud() {
    hud.innerHTML = '<span>' + T.hud.tid + '<b>' + Math.max(0, Math.ceil(M.rundtid - G.t)) + '</b></span><span>' + T.hud.langd + '<b>' + (G.leder.length + 1) + '</b></span><span>' + T.hud.ideer + '<b>' + G.huvudKan + '</b></span>';
  }
  var ljudKnapp = document.getElementById('ljud');
  function visaLjud() { ljudKnapp.textContent = ljud.pa ? T.hud.ljudPa : T.hud.ljudAv; }
  ljudKnapp.addEventListener('click', function () { ljud.pa = !ljud.pa; try { localStorage.setItem('lca.svansen.ljud', ljud.pa ? 'pa' : 'av'); } catch (e) {} visaLjud(); });

  /* ---------- Loop ---------- */
  var senast = 0, igang = false;
  function loop(ts) {
    if (!igang) return;
    var dt = Math.min(0.033, (ts - senast) / 1000 || 0.016); senast = ts;
    // Två delsteg per bildruta ger stabilare fjädrar.
    steg(dt / 2); if (igang) steg(dt / 2);
    rita(); if (igang) visaHud();
    if (igang) requestAnimationFrame(loop);
  }

  /* ---------- Styrning ---------- */
  function pekPos(e) { var r = duk.getBoundingClientRect(); return { x: (e.clientX - r.left) / (r.width / W), y: (e.clientY - r.top) / (r.height / H) }; }
  duk.addEventListener('pointerdown', function (e) { var p = pekPos(e); styr.x = p.x; styr.y = p.y; styr.aktiv = true; try { duk.setPointerCapture(e.pointerId); } catch (x) {} });
  duk.addEventListener('pointermove', function (e) {
    var p = pekPos(e); styr.x = p.x; styr.y = p.y;
    if (e.pointerType === 'mouse') styr.aktiv = true;
  });
  duk.addEventListener('pointerup', function (e) { if (e.pointerType !== 'mouse') styr.aktiv = false; });
  duk.addEventListener('pointercancel', function () { styr.aktiv = false; });
  window.addEventListener('keydown', function (e) {
    if (!igang) return;
    if (e.key === 'ArrowLeft' || e.key === 'a') { styr.vanster = true; styr.aktiv = false; e.preventDefault(); }
    if (e.key === 'ArrowRight' || e.key === 'd') { styr.hoger = true; styr.aktiv = false; e.preventDefault(); }
  });
  window.addEventListener('keyup', function (e) {
    if (e.key === 'ArrowLeft' || e.key === 'a') styr.vanster = false;
    if (e.key === 'ArrowRight' || e.key === 'd') styr.hoger = false;
  });

  /* ---------- Skärmar ---------- */
  var overlay = document.getElementById('overlay');
  var slutEl = document.getElementById('slut');
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }

  function visaStart() {
    storlek(); G = nyttSpel(); rita();
    overlay.hidden = false; hud.hidden = true; ljudKnapp.hidden = true;
    overlay.innerHTML = '<div class="spel-start"><h1>' + esc(T.start.rubrik) + '</h1><p class="lead">' + esc(T.start.ingress) + '</p><ul>' +
      T.start.hur.map(function (h) { return '<li>' + esc(h) + '</li>'; }).join('') +
      '</ul><button class="btn" id="starta" type="button">' + esc(T.start.knapp) + '</button><p class="small muted">' + esc(T.start.tid) + '</p></div>';
    document.getElementById('starta').addEventListener('click', starta);
  }

  function starta() {
    var a = ac(); if (a && a.state === 'suspended') a.resume();
    storlek(); G = nyttSpel(); styr = { x: null, y: null, aktiv: false, vanster: false, hoger: false };
    overlay.hidden = true; overlay.innerHTML = ''; hud.hidden = false; ljudKnapp.hidden = false; visaLjud();
    slutEl.innerHTML = '';
    igang = true; senast = performance.now(); requestAnimationFrame(loop);
    scen.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  function avsluta() {
    igang = false;
    hud.hidden = true; ljudKnapp.hidden = true;
    overlay.hidden = true;
    var res = resultat();
    try { localStorage.setItem('lca.svansen.senast', JSON.stringify(res)); } catch (e) {}
    visaSlut(res);
  }

  /* Mönstret styrs av kvoten mellan kroppens snittkunnande och huvudets. Gränserna är designval. */
  function resultat() {
    var sist = G.logg[G.logg.length - 1];
    var kvot = G.huvudKan ? sist.kropp / G.huvudKan : 0;
    var monster = !G.huvudKan ? 'ingaIdeer' : kvot >= 0.7 ? 'iTakt' : kvot >= 0.4 ? 'paVag' : 'vaxteIfran';
    var lal = null;
    if (G.pulsTider.length >= 2) {
      var f = G.pulsTider[0].perLed, s = G.pulsTider[G.pulsTider.length - 1].perLed;
      if (s > 0 && f / s >= 1.4) lal = f / s;
    }
    return { logg: G.logg, huvudKan: G.huvudKan, langd: G.leder.length + 1, tappade: G.tappade, monster: monster, kvot: kvot, lardeAttLara: lal, version: S.version, sprak: sprak, datum: new Date().toISOString() };
  }

  function diagram(res) {
    var smal = window.innerWidth < 640, w = smal ? 380 : 640, h = smal ? 240 : 280, ml = smal ? 12 : 34, mr = smal ? 78 : 92, mt = 16, mb = 34;
    var maxY = Math.max(1, res.huvudKan), iw = w - ml - mr, ih = h - mt - mb;
    function X(t) { return ml + (t / M.rundtid) * iw; }
    function Y(v) { return mt + ih - (v / maxY) * ih; }
    var huvud = '', kropp = '';
    res.logg.forEach(function (p, i) {
      if (i === 0) huvud += 'M' + X(p.t).toFixed(1) + ' ' + Y(p.huvud).toFixed(1);
      else { huvud += 'H' + X(p.t).toFixed(1) + 'V' + Y(p.huvud).toFixed(1); }
      kropp += (i ? 'L' : 'M') + X(p.t).toFixed(1) + ' ' + Y(p.kropp).toFixed(1);
    });
    var s = res.logg[res.logg.length - 1];
    var yH = Y(s.huvud), yK = Y(s.kropp);
    if (Math.abs(yH - yK) < 16) { if (yH <= yK) yK = yH + 16; else yH = yK + 16; }
    var g = '<svg class="slut-diagram" viewBox="0 0 ' + w + ' ' + h + '" role="img" aria-label="' + esc(T.slut.diagramHuvud + ' och ' + T.slut.diagramKropp) + '">';
    g += '<line x1="' + ml + '" y1="' + (mt + ih) + '" x2="' + (ml + iw) + '" y2="' + (mt + ih) + '" stroke="#dcdcd8"/>';
    g += '<line x1="' + ml + '" y1="' + mt + '" x2="' + ml + '" y2="' + (mt + ih) + '" stroke="#dcdcd8"/>';
    g += '<text x="' + (ml + iw) + '" y="' + (h - 10) + '" text-anchor="end" font-family="IBM Plex Mono, monospace" font-size="12" fill="#5c5c5c">' + esc(T.slut.diagramX) + ' →</text>';
    g += '<text x="' + (ml + 6) + '" y="' + (mt + 4) + '" font-family="IBM Plex Mono, monospace" font-size="12" fill="#5c5c5c">↑ ' + esc(T.slut.diagramY) + '</text>';
    g += '<path d="' + kropp + '" fill="none" stroke="#1e5fcc" stroke-width="4" stroke-linejoin="round" stroke-linecap="round"/>';
    g += '<path d="' + huvud + '" fill="none" stroke="#141414" stroke-width="2" stroke-linejoin="round"/>';
    g += '<text x="' + (ml + iw + 8) + '" y="' + (yH + 4) + '" font-family="Poppins, sans-serif" font-weight="600" font-size="14" fill="#141414">' + esc(T.slut.diagramHuvud) + '</text>';
    g += '<text x="' + (ml + iw + 8) + '" y="' + (yK + 4) + '" font-family="Poppins, sans-serif" font-weight="600" font-size="14" fill="#1e5fcc">' + esc(T.slut.diagramKropp) + '</text>';
    return g + '</svg>';
  }

  function visaSlut(res) {
    var t = T.slut;
    var html = '<section class="card slut-kort" id="slutkort"><h2>' + esc(t.rubrik) + '</h2>' + diagram(res) +
      '<p class="slut-monster">' + esc(t.monster[res.monster]) + '</p>' +
      (res.lardeAttLara ? '<p>' + esc(t.lardeAttLara.replace('{x}', res.lardeAttLara.toFixed(1).replace('.', ','))) + '</p>' : '') +
      '<div class="slut-stats"><span>' + esc(t.statLangd) + '<b>' + res.langd + '</b></span><span>' + esc(t.statIdeer) + '<b>' + res.huvudKan + '</b></span><span>' + esc(t.statTappade) + '<b>' + res.tappade + '</b></span></div>' +
      '<p class="note">' + esc(t.poang) + '</p>' +
      '<p><strong>' + esc(t.cta) + '</strong></p>' +
      '<div class="slut-knappar"><a class="btn" href="' + esc(t.ctaLank) + '">' + esc(t.ctaKnapp) + '</a><button class="btn ghost" type="button" id="igen">' + esc(t.igen) + '</button><a class="btn quiet" href="../">' + esc(t.hem) + '</a></div>' +
      '<details class="slut-grund"><summary>' + esc(t.grundRubrik) + '</summary>' + t.grund.map(function (p) { return '<p>' + esc(p) + '</p>'; }).join('') + '</details>' +
      '</section>';
    slutEl.innerHTML = html;
    document.getElementById('igen').addEventListener('click', starta);
    document.getElementById('slutkort').scrollIntoView({ behavior: lugn ? 'auto' : 'smooth', block: 'start' });
  }

  /* ---------- Språkval (visas först när det finns fler än ett språk) ---------- */
  function visaSprakval() {
    var el = document.getElementById('sprakval');
    if (sprakKoder.length < 2) { el.innerHTML = ''; return; }
    el.innerHTML = sprakKoder.map(function (k) { return '<button class="sprak-knapp" type="button" data-sprak="' + k + '" aria-pressed="' + (k === sprak) + '">' + esc(k.toUpperCase()) + '</button>'; }).join('');
    el.querySelectorAll('button').forEach(function (b) {
      b.addEventListener('click', function () { try { localStorage.setItem('lca.svansen.sprak', b.dataset.sprak); } catch (e) {} location.search = '?lang=' + b.dataset.sprak; });
    });
  }

  document.documentElement.lang = sprak;
  document.title = T.sidtitel;
  document.getElementById('footer').innerHTML = '<span class="maker"><img src="../img/mickla.png" alt="Mickla" width="22" height="22">' + esc(T.upphov) + '</span><span>' + esc(S.version) + '</span>';
  visaSprakval();
  window.addEventListener('resize', function () { if (!igang) { storlek(); if (G) rita(); } });
  visaStart();

  // För test: exponera modellen.
  window.__svansen = { M: M, G: function () { return G; }, steg: steg, starta: starta };
})();
