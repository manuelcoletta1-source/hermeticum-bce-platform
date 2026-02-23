(function () {
  "use strict";

  const prefersReduced =
    window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (prefersReduced) return;

  const canvas = document.getElementById("hbceSpaceCanvas");
  if (!canvas) return;

  const ctx = canvas.getContext("2d", { alpha: true });
  if (!ctx) return;

  // deterministic-ish RNG
  let seed = 0xC0FFEE ^ 0xBADC0DE;
  function rnd() {
    seed ^= seed << 13; seed |= 0;
    seed ^= seed >>> 17; seed |= 0;
    seed ^= seed << 5; seed |= 0;
    return ((seed >>> 0) / 4294967296);
  }
  function r(min, max){ return min + rnd() * (max - min); }

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

  const LAYERS = [
    { count: 140, speed: 6,  size: [0.6, 1.2], alpha: [0.10, 0.22] },
    { count: 90,  speed: 14, size: [0.9, 1.8], alpha: [0.14, 0.28] },
    { count: 55,  speed: 26, size: [1.2, 2.6], alpha: [0.18, 0.34] }
  ];

  const stars = LAYERS.map(L => {
    const arr = [];
    for (let i=0; i<L.count; i++){
      arr.push({
        x: r(0, w),
        y: r(0, h),
        s: r(L.size[0], L.size[1]),
        a: r(L.alpha[0], L.alpha[1]),
        tw: r(0.2, 1.0),
        tws: r(0.15, 0.45)
      });
    }
    return arr;
  });

  const planets = [];
  for (let i=0; i<3; i++){
    planets.push({
      x: r(-0.15*w, 1.15*w),
      y: r(-0.15*h, 1.15*h),
      r: r(70, 190),
      vx: r(-1.6, -0.4),
      vy: r(-0.2, 0.2),
      a: r(0.04, 0.10),
      tint: rnd() < 0.5 ? "cool" : "warm"
    });
  }

  let constel = null;
  function spawnConstellation(){
    const pointsN = Math.floor(r(5, 9));
    const points = [];
    const cx = r(0.2*w, 0.8*w);
    const cy = r(0.2*h, 0.8*h);
    const spread = r(80, 190);

    for (let i=0; i<pointsN; i++){
      points.push({ x: cx + r(-spread, spread), y: cy + r(-spread, spread) });
    }

    const links = [];
    for (let i=0; i<pointsN-1; i++){
      if (rnd() < 0.85) links.push([i, i+1]);
      if (rnd() < 0.20 && i+2 < pointsN) links.push([i, i+2]);
    }

    constel = { points, links, t: 0, life: r(8, 14), a: 0.0 };
  }

  let baseVX = -12;
  let baseVY =  3;

  let degraded = false;
  let frames = 0;
  let perfLast = performance.now();

  function clear(){ ctx.clearRect(0, 0, w, h); }

  function drawPlanets(dt){
    if (degraded) return;
    for (const p of planets){
      p.x += p.vx * dt;
      p.y += p.vy * dt;

      if (p.x < -0.25*w) p.x = 1.25*w;
      if (p.y < -0.25*h) p.y = 1.25*h;
      if (p.y > 1.25*h) p.y = -0.25*h;

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

  function drawStars(t, dt){
    for (let li=0; li<LAYERS.length; li++){
      const L = LAYERS[li];
      const arr = stars[li];
      const vx = baseVX * (L.speed / 10);
      const vy = baseVY * (L.speed / 10);

      for (const s of arr){
        s.x += vx * dt;
        s.y += vy * dt;

        if (s.x < -10) s.x = w + 10;
        if (s.x > w + 10) s.x = -10;
        if (s.y < -10) s.y = h + 10;
        if (s.y > h + 10) s.y = -10;

        const tw = 0.55 + 0.45 * Math.sin((t * s.tws) + s.tw * 6.283);
        ctx.globalAlpha = s.a * tw;
        ctx.fillStyle = "rgba(232,238,246,1)";
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.s, 0, Math.PI*2);
        ctx.fill();
      }
    }
    ctx.globalAlpha = 1;
  }

  function drawConstellation(dt){
    if (!constel && !degraded && rnd() < 0.0025) spawnConstellation();
    if (!constel) return;

    constel.t += dt;

    const inT = Math.min(1, constel.t / 1.8);
    const outT = Math.max(0, (constel.life - constel.t) / 2.4);
    constel.a = Math.min(inT, outT) * 0.18;

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

  let last = performance.now();
  let time = 0;

  function loop(now){
    const dt = Math.min(0.04, (now - last) / 1000);
    last = now;
    time += dt;

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

    requestAnimationFrame(loop);
  }

  requestAnimationFrame(loop);
})();
