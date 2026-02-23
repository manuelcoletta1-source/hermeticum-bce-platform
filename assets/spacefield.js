/* =========================================================
   HBCE SPACEFIELD — CINEMATIC HYPERSPACE (TUNNEL + LENS)
   - scroll-reactive warp
   - star streaks + tunnel rings + subtle lens distortion
   - rare constellations + faint planets
   - auto-degrade on low FPS
   - respects prefers-reduced-motion
   ========================================================= */
(function () {
  "use strict";

  const prefersReduced =
    window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (prefersReduced) return;

  const canvas = document.getElementById("hbceSpaceCanvas");
  if (!canvas) return;

  const ctx = canvas.getContext("2d", { alpha: true });
  if (!ctx) return;

  // ----- Seeded RNG
  let seed = 0xC0FFEE ^ 0xBADC0DE;
  function rnd() {
    seed ^= seed << 13; seed |= 0;
    seed ^= seed >>> 17; seed |= 0;
    seed ^= seed << 5; seed |= 0;
    return ((seed >>> 0) / 4294967296);
  }
  function r(min, max){ return min + rnd() * (max - min); }
  function clamp(v, a, b){ return Math.max(a, Math.min(b, v)); }
  function lerp(a, b, t){ return a + (b - a) * t; }

  // ----- Resize
  let w = 0, h = 0, dpr = 1;
  function resize() {
    dpr = Math.min(2, window.devicePixelRatio || 1);
    w = Math.floor(window.innerWidth);
    h = Math.floor(window.innerHeight);
    canvas.width  = Math.floor(w * dpr);
    canvas.height = Math.floor(h * dpr);
    canvas.style.width = w + "px";
    canvas.style.height = h + "px";
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  resize();
  window.addEventListener("resize", resize, { passive: true });

  // ----- Travel vector (cruise)
  let baseVX = -10; // px/sec
  let baseVY =  2;  // px/sec

  // ----- Warp control
  let lastScrollY = window.scrollY || 0;
  let warp = 0;
  let warpTarget = 0;

  function onScroll(){
    const y = window.scrollY || 0;
    const dy = y - lastScrollY;
    lastScrollY = y;
    warpTarget = clamp(Math.abs(dy) / 220, 0, 1);
  }
  window.addEventListener("scroll", onScroll, { passive: true });

  // boot jump
  const bootStart = performance.now();
  let boot = 1.0;

  // ----- Layers
  const LAYERS = [
    { count: 150, speed: 6,  size: [0.6, 1.2], alpha: [0.10, 0.22] },
    { count: 95,  speed: 14, size: [0.9, 1.9], alpha: [0.14, 0.30] },
    { count: 60,  speed: 28, size: [1.2, 2.8], alpha: [0.18, 0.36] }
  ];

  const stars = LAYERS.map(L => {
    const arr = [];
    for (let i=0; i<L.count; i++){
      const hueBias = rnd();
      arr.push({
        x: r(0, w),
        y: r(0, h),
        s: r(L.size[0], L.size[1]),
        a: r(L.alpha[0], L.alpha[1]),
        tw: r(0.2, 1.0),
        tws: r(0.15, 0.5),
        tint: hueBias < 0.84 ? "white" : (hueBias < 0.92 ? "cool" : "warm")
      });
    }
    return arr;
  });

  // ----- Planets (faint)
  const planets = [];
  for (let i=0; i<3; i++){
    planets.push({
      x: r(-0.15*w, 1.15*w),
      y: r(-0.15*h, 1.15*h),
      r: r(80, 220),
      vx: r(-1.2, -0.3),
      vy: r(-0.15, 0.15),
      a: r(0.030, 0.085),
      tint: rnd() < 0.55 ? "cool" : "warm"
    });
  }

  // ----- Constellations (rare)
  let constel = null;
  function spawnConstellation(){
    const pointsN = Math.floor(r(5, 9));
    const points = [];
    const cx = r(0.22*w, 0.78*w);
    const cy = r(0.22*h, 0.78*h);
    const spread = r(90, 210);

    for (let i=0; i<pointsN; i++){
      points.push({ x: cx + r(-spread, spread), y: cy + r(-spread, spread) });
    }

    const links = [];
    for (let i=0; i<pointsN-1; i++){
      if (rnd() < 0.82) links.push([i, i+1]);
      if (rnd() < 0.18 && i+2 < pointsN) links.push([i, i+2]);
    }

    constel = { points, links, t: 0, life: r(9, 16), a: 0.0 };
  }

  // ----- Tunnel rings (warp-only)
  // Create rings once; they move along "depth"
  const rings = [];
  const RINGS_N = 22;
  for (let i=0; i<RINGS_N; i++){
    rings.push({
      z: r(0, 1),            // 0 close -> 1 far (we'll invert while drawing)
      phase: r(0, Math.PI*2),
      w: r(0.8, 1.4)
    });
  }

  // ----- Perf guard / degrade
  let degraded = false;
  let frames = 0;
  let perfLast = performance.now();

  function clear(){
    ctx.clearRect(0, 0, w, h);
  }

  function starColor(tint){
    if (tint === "cool") return "rgba(219,231,255,1)";
    if (tint === "warm") return "rgba(255,220,235,1)";
    return "rgba(232,238,246,1)";
  }

  function drawPlanets(dt){
    if (degraded) return;
    for (const p of planets){
      p.x += p.vx * dt;
      p.y += p.vy * dt;

      if (p.x < -0.30*w) p.x = 1.30*w;
      if (p.y < -0.30*h) p.y = 1.30*h;
      if (p.y > 1.30*h) p.y = -0.30*h;

      const g = ctx.createRadialGradient(
        p.x - p.r*0.25, p.y - p.r*0.25, p.r*0.15,
        p.x, p.y, p.r
      );

      if (p.tint === "cool"){
        g.addColorStop(0, `rgba(219,231,255,${p.a})`);
        g.addColorStop(0.55, `rgba(120,160,255,${p.a*0.55})`);
        g.addColorStop(1, `rgba(0,0,0,0)`);
      } else {
        g.addColorStop(0, `rgba(255,200,220,${p.a})`);
        g.addColorStop(0.55, `rgba(255,60,120,${p.a*0.45})`);
        g.addColorStop(1, `rgba(0,0,0,0)`);
      }

      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI*2);
      ctx.fill();
    }
  }

  // Lens distortion (subtle): we simulate by scaling/offset based on warp
  function applyLens(warpBoost){
    if (degraded) return;
    const k = warpBoost * 0.035; // subtle
    if (k <= 0) return;

    // Slight “pull” towards center like a lens
    // Achieved by drawing on top using composite and soft radial gradient.
    const cx = w * 0.5;
    const cy = h * 0.5;

    const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.max(w,h) * 0.55);
    g.addColorStop(0, `rgba(219,231,255,${0.10 * k / 0.035})`);
    g.addColorStop(0.45, `rgba(0,0,0,0)`);
    g.addColorStop(1, `rgba(0,0,0,0)`);

    ctx.globalCompositeOperation = "screen";
    ctx.globalAlpha = 1;
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);
    ctx.globalCompositeOperation = "source-over";
  }

  // Tunnel rings: appear only with warp
  function drawTunnel(time, dt, warpBoost){
    if (warpBoost < 0.12) return;
    if (degraded) return;

    const cx = w * 0.5;
    const cy = h * 0.5;

    // direction: align tunnel slightly with travel vector
    const tvx = baseVX, tvy = baseVY;
    const ang = Math.atan2(tvy, tvx) + Math.PI; // invert for "ahead"

    // ring strength
    const aBase = 0.10 + warpBoost * 0.18;
    const ringCount = degraded ? 10 : RINGS_N;

    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(ang * 0.15); // keep it subtle
    ctx.translate(-cx, -cy);

    for (let i=0; i<ringCount; i++){
      const rg = rings[i];
      // move "towards viewer" when warping
      rg.z -= dt * (0.35 + warpBoost * 1.8) * rg.w;
      if (rg.z < 0) rg.z += 1;

      // invert for drawing: far->small, near->big
      const z = 1 - rg.z;

      const radius = lerp(40, Math.max(w,h) * 0.72, z);
      const wobble = Math.sin(time * 1.2 + rg.phase) * (2 + 10 * warpBoost);
      const rr = radius + wobble;

      const alpha = aBase * (1 - z) * (0.35 + 0.65 * warpBoost);

      ctx.globalAlpha = alpha;
      ctx.strokeStyle = "rgba(219,231,255,1)";
      ctx.lineWidth = 1;

      ctx.beginPath();
      ctx.ellipse(cx, cy, rr, rr * (0.86 + 0.08*Math.sin(rg.phase + time)), 0, 0, Math.PI*2);
      ctx.stroke();
    }

    ctx.restore();
    ctx.globalAlpha = 1;
  }

  function drawStars(time, dt){
    const bootT = clamp((performance.now() - bootStart) / 1800, 0, 1);
    boot = 1 - bootT;

    // smooth warp
    warp += (warpTarget - warp) * 0.08;
    warpTarget *= 0.92;

    const warpBoost = clamp(warp + boot * 0.85, 0, 1);

    // travel direction
    const tvx = baseVX, tvy = baseVY;
    const lenDir = Math.sqrt(tvx*tvx + tvy*tvy) || 1;
    const nx = -tvx / lenDir;
    const ny = -tvy / lenDir;

    for (let li=0; li<LAYERS.length; li++){
      const L = LAYERS[li];
      const arr = stars[li];

      const pvx = tvx * (L.speed / 10);
      const pvy = tvy * (L.speed / 10);

      const speedMul = 1 + warpBoost * (degraded ? 1.15 : 2.05);

      for (const s of arr){
        s.x += pvx * dt * speedMul;
        s.y += pvy * dt * speedMul;

        if (s.x < -30) s.x = w + 30;
        if (s.x > w + 30) s.x = -30;
        if (s.y < -30) s.y = h + 30;
        if (s.y > h + 30) s.y = -30;

        const tw = 0.55 + 0.45 * Math.sin((time * s.tws) + s.tw * 6.283);
        const alpha = s.a * (0.35 + 0.65 * tw) * (1 - warpBoost * 0.25);
        ctx.globalAlpha = alpha;

        const color = starColor(s.tint);

        const streak = warpBoost > 0.10 && !degraded;
        if (!streak){
          ctx.fillStyle = color;
          ctx.beginPath();
          ctx.arc(s.x, s.y, s.s, 0, Math.PI*2);
          ctx.fill();
        } else {
          const Lk = (L.speed / 28);
          const len = (10 + warpBoost * 150) * Lk;
          const lw  = Math.max(1, s.s * 0.75);

          ctx.strokeStyle = color;
          ctx.lineWidth = lw;

          ctx.beginPath();
          ctx.moveTo(s.x, s.y);
          ctx.lineTo(s.x + nx * len, s.y + ny * len);
          ctx.stroke();
        }
      }
    }

    ctx.globalAlpha = 1;

    // A tiny “flash” when warp climbs quickly (cinema punch)
    // Implemented as a faint screen blend.
    if (!degraded && warpBoost > 0.45){
      const flash = (warpBoost - 0.45) / 0.55; // 0..1
      ctx.globalCompositeOperation = "screen";
      ctx.globalAlpha = 0.05 * flash;
      ctx.fillStyle = "rgba(219,231,255,1)";
      ctx.fillRect(0, 0, w, h);
      ctx.globalAlpha = 1;
      ctx.globalCompositeOperation = "source-over";
    }

    // Draw tunnel rings + lens on top (only during warp)
    drawTunnel(time, dt, warpBoost);
    applyLens(warpBoost);

    return warpBoost;
  }

  function drawConstellation(dt){
    if (!constel && !degraded && rnd() < 0.0016) spawnConstellation();
    if (!constel) return;

    constel.t += dt;

    const inT = Math.min(1, constel.t / 2.0);
    const outT = Math.max(0, (constel.life - constel.t) / 2.6);
    constel.a = Math.min(inT, outT) * 0.16;

    if (constel.t >= constel.life){
      constel = null;
      return;
    }

    ctx.globalAlpha = constel.a;

    ctx.fillStyle = "rgba(232,238,246,1)";
    for (const p of constel.points){
      ctx.beginPath();
      ctx.arc(p.x, p.y, 1.6, 0, Math.PI*2);
      ctx.fill();
    }

    ctx.strokeStyle = "rgba(219,231,255,1)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    for (const [a,b] of constel.links){
      const pa = constel.points[a], pb = constel.points[b];
      ctx.moveTo(pa.x, pa.y);
      ctx.lineTo(pb.x, pb.y);
    }
    ctx.stroke();

    ctx.globalAlpha = 1;
  }

  function drawGrain(){
    if (degraded) return;
    const n = 80;
    ctx.globalAlpha = 0.035;
    ctx.fillStyle = "rgba(255,255,255,1)";
    for (let i=0; i<n; i++){
      ctx.fillRect(rnd() * w, rnd() * h, 1, 1);
    }
    ctx.globalAlpha = 1;
  }

  // ----- Loop
  let last = performance.now();
  let time = 0;

  function loop(now){
    const dt = Math.min(0.04, (now - last) / 1000);
    last = now;
    time += dt;

    // perf monitor
    frames++;
    const perfDt = now - perfLast;
    if (perfDt >= 1200){
      const fps = (frames * 1000) / perfDt;
      frames = 0;
      perfLast = now;
      if (fps < 45) degraded = true;
    }

    clear();
    drawPlanets(dt);
    drawStars(time, dt);
    drawConstellation(dt);
    drawGrain();

    requestAnimationFrame(loop);
  }

  requestAnimationFrame(loop);
})();
