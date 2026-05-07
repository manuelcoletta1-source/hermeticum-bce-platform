/* =========================================================
   HBCE SPACEFIELD — LOCAL VISUAL ENHANCER
   - Canvas-only visual effect
   - No fetch
   - No tracking
   - No upload
   - No data custody
   - Respects prefers-reduced-motion
   - Auto-degrades on low FPS
   ========================================================= */

(function () {
  "use strict";

  if (document.documentElement.getAttribute("data-hbce-spacefield") === "1") return;
  document.documentElement.setAttribute("data-hbce-spacefield", "1");

  const prefersReduced =
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (prefersReduced) {
    document.documentElement.setAttribute("data-hbce-spacefield-mode", "reduced-motion");
    return;
  }

  const canvas = document.getElementById("hbceSpaceCanvas");
  if (!canvas) return;

  const ctx = canvas.getContext("2d", { alpha: true });
  if (!ctx) return;

  document.documentElement.setAttribute("data-hbce-spacefield-mode", "local-visual-only");

  let seed = 0xC0FFEE ^ 0xBADC0DE;

  function rnd() {
    seed ^= seed << 13;
    seed |= 0;
    seed ^= seed >>> 17;
    seed |= 0;
    seed ^= seed << 5;
    seed |= 0;

    return (seed >>> 0) / 4294967296;
  }

  function randomRange(min, max) {
    return min + rnd() * (max - min);
  }

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function lerp(a, b, t) {
    return a + (b - a) * t;
  }

  let width = 0;
  let height = 0;
  let dpr = 1;

  function resize() {
    dpr = Math.min(2, window.devicePixelRatio || 1);
    width = Math.floor(window.innerWidth);
    height = Math.floor(window.innerHeight);

    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    canvas.style.width = width + "px";
    canvas.style.height = height + "px";

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  resize();
  window.addEventListener("resize", resize, { passive: true });

  let baseVelocityX = -10;
  let baseVelocityY = 2;

  let lastScrollY = window.scrollY || 0;
  let warp = 0;
  let warpTarget = 0;

  function onScroll() {
    const currentY = window.scrollY || 0;
    const deltaY = currentY - lastScrollY;

    lastScrollY = currentY;
    warpTarget = clamp(Math.abs(deltaY) / 220, 0, 1);
  }

  window.addEventListener("scroll", onScroll, { passive: true });

  const bootStart = performance.now();
  let boot = 1.0;

  const LAYERS = [
    { count: 150, speed: 6, size: [0.6, 1.2], alpha: [0.10, 0.22] },
    { count: 95, speed: 14, size: [0.9, 1.9], alpha: [0.14, 0.30] },
    { count: 60, speed: 28, size: [1.2, 2.8], alpha: [0.18, 0.36] }
  ];

  const stars = LAYERS.map((layer) => {
    const list = [];

    for (let index = 0; index < layer.count; index += 1) {
      const hueBias = rnd();

      list.push({
        x: randomRange(0, width),
        y: randomRange(0, height),
        size: randomRange(layer.size[0], layer.size[1]),
        alpha: randomRange(layer.alpha[0], layer.alpha[1]),
        twinkle: randomRange(0.2, 1.0),
        twinkleSpeed: randomRange(0.15, 0.5),
        tint: hueBias < 0.84 ? "white" : (hueBias < 0.92 ? "cool" : "warm")
      });
    }

    return list;
  });

  const planets = [];

  for (let index = 0; index < 3; index += 1) {
    planets.push({
      x: randomRange(-0.15 * width, 1.15 * width),
      y: randomRange(-0.15 * height, 1.15 * height),
      radius: randomRange(80, 220),
      velocityX: randomRange(-1.2, -0.3),
      velocityY: randomRange(-0.15, 0.15),
      alpha: randomRange(0.030, 0.085),
      tint: rnd() < 0.55 ? "cool" : "warm"
    });
  }

  let constellation = null;

  function spawnConstellation() {
    const pointCount = Math.floor(randomRange(5, 9));
    const points = [];
    const centerX = randomRange(0.22 * width, 0.78 * width);
    const centerY = randomRange(0.22 * height, 0.78 * height);
    const spread = randomRange(90, 210);

    for (let index = 0; index < pointCount; index += 1) {
      points.push({
        x: centerX + randomRange(-spread, spread),
        y: centerY + randomRange(-spread, spread)
      });
    }

    const links = [];

    for (let index = 0; index < pointCount - 1; index += 1) {
      if (rnd() < 0.82) links.push([index, index + 1]);
      if (rnd() < 0.18 && index + 2 < pointCount) links.push([index, index + 2]);
    }

    constellation = {
      points,
      links,
      t: 0,
      life: randomRange(9, 16),
      alpha: 0
    };
  }

  const rings = [];
  const RINGS_COUNT = 22;

  for (let index = 0; index < RINGS_COUNT; index += 1) {
    rings.push({
      z: randomRange(0, 1),
      phase: randomRange(0, Math.PI * 2),
      weight: randomRange(0.8, 1.4)
    });
  }

  let degraded = false;
  let frames = 0;
  let perfLast = performance.now();

  function clear() {
    ctx.clearRect(0, 0, width, height);
  }

  function starColor(tint) {
    if (tint === "cool") return "rgba(219,231,255,1)";
    if (tint === "warm") return "rgba(255,220,235,1)";
    return "rgba(232,238,246,1)";
  }

  function drawPlanets(deltaTime) {
    if (degraded) return;

    for (const planet of planets) {
      planet.x += planet.velocityX * deltaTime;
      planet.y += planet.velocityY * deltaTime;

      if (planet.x < -0.30 * width) planet.x = 1.30 * width;
      if (planet.y < -0.30 * height) planet.y = 1.30 * height;
      if (planet.y > 1.30 * height) planet.y = -0.30 * height;

      const gradient = ctx.createRadialGradient(
        planet.x - planet.radius * 0.25,
        planet.y - planet.radius * 0.25,
        planet.radius * 0.15,
        planet.x,
        planet.y,
        planet.radius
      );

      if (planet.tint === "cool") {
        gradient.addColorStop(0, `rgba(219,231,255,${planet.alpha})`);
        gradient.addColorStop(0.55, `rgba(120,160,255,${planet.alpha * 0.55})`);
        gradient.addColorStop(1, "rgba(0,0,0,0)");
      } else {
        gradient.addColorStop(0, `rgba(255,200,220,${planet.alpha})`);
        gradient.addColorStop(0.55, `rgba(255,60,120,${planet.alpha * 0.45})`);
        gradient.addColorStop(1, "rgba(0,0,0,0)");
      }

      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(planet.x, planet.y, planet.radius, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  function applyLens(warpBoost) {
    if (degraded) return;

    const strength = warpBoost * 0.035;
    if (strength <= 0) return;

    const centerX = width * 0.5;
    const centerY = height * 0.5;

    const gradient = ctx.createRadialGradient(
      centerX,
      centerY,
      0,
      centerX,
      centerY,
      Math.max(width, height) * 0.55
    );

    gradient.addColorStop(0, `rgba(219,231,255,${0.10 * strength / 0.035})`);
    gradient.addColorStop(0.45, "rgba(0,0,0,0)");
    gradient.addColorStop(1, "rgba(0,0,0,0)");

    ctx.globalCompositeOperation = "screen";
    ctx.globalAlpha = 1;
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
    ctx.globalCompositeOperation = "source-over";
  }

  function drawTunnel(time, deltaTime, warpBoost) {
    if (warpBoost < 0.12) return;
    if (degraded) return;

    const centerX = width * 0.5;
    const centerY = height * 0.5;

    const angle = Math.atan2(baseVelocityY, baseVelocityX) + Math.PI;
    const alphaBase = 0.10 + warpBoost * 0.18;

    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate(angle * 0.15);
    ctx.translate(-centerX, -centerY);

    for (let index = 0; index < RINGS_COUNT; index += 1) {
      const ring = rings[index];

      ring.z -= deltaTime * (0.35 + warpBoost * 1.8) * ring.weight;
      if (ring.z < 0) ring.z += 1;

      const z = 1 - ring.z;
      const radius = lerp(40, Math.max(width, height) * 0.72, z);
      const wobble = Math.sin(time * 1.2 + ring.phase) * (2 + 10 * warpBoost);
      const currentRadius = radius + wobble;
      const alpha = alphaBase * (1 - z) * (0.35 + 0.65 * warpBoost);

      ctx.globalAlpha = alpha;
      ctx.strokeStyle = "rgba(219,231,255,1)";
      ctx.lineWidth = 1;

      ctx.beginPath();
      ctx.ellipse(
        centerX,
        centerY,
        currentRadius,
        currentRadius * (0.86 + 0.08 * Math.sin(ring.phase + time)),
        0,
        0,
        Math.PI * 2
      );
      ctx.stroke();
    }

    ctx.restore();
    ctx.globalAlpha = 1;
  }

  function drawStars(time, deltaTime) {
    const bootT = clamp((performance.now() - bootStart) / 1800, 0, 1);
    boot = 1 - bootT;

    warp += (warpTarget - warp) * 0.08;
    warpTarget *= 0.92;

    const warpBoost = clamp(warp + boot * 0.85, 0, 1);

    const velocityX = baseVelocityX;
    const velocityY = baseVelocityY;
    const directionLength = Math.sqrt(velocityX * velocityX + velocityY * velocityY) || 1;
    const normalX = -velocityX / directionLength;
    const normalY = -velocityY / directionLength;

    for (let layerIndex = 0; layerIndex < LAYERS.length; layerIndex += 1) {
      const layer = LAYERS[layerIndex];
      const list = stars[layerIndex];

      const parallaxX = velocityX * (layer.speed / 10);
      const parallaxY = velocityY * (layer.speed / 10);
      const speedMultiplier = 1 + warpBoost * (degraded ? 1.15 : 2.05);

      for (const star of list) {
        star.x += parallaxX * deltaTime * speedMultiplier;
        star.y += parallaxY * deltaTime * speedMultiplier;

        if (star.x < -30) star.x = width + 30;
        if (star.x > width + 30) star.x = -30;
        if (star.y < -30) star.y = height + 30;
        if (star.y > height + 30) star.y = -30;

        const twinkle = 0.55 + 0.45 * Math.sin(time * star.twinkleSpeed + star.twinkle * 6.283);
        const alpha = star.alpha * (0.35 + 0.65 * twinkle) * (1 - warpBoost * 0.25);

        ctx.globalAlpha = alpha;

        const color = starColor(star.tint);
        const streak = warpBoost > 0.10 && !degraded;

        if (!streak) {
          ctx.fillStyle = color;
          ctx.beginPath();
          ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
          ctx.fill();
        } else {
          const layerFactor = layer.speed / 28;
          const length = (10 + warpBoost * 150) * layerFactor;
          const lineWidth = Math.max(1, star.size * 0.75);

          ctx.strokeStyle = color;
          ctx.lineWidth = lineWidth;

          ctx.beginPath();
          ctx.moveTo(star.x, star.y);
          ctx.lineTo(star.x + normalX * length, star.y + normalY * length);
          ctx.stroke();
        }
      }
    }

    ctx.globalAlpha = 1;

    if (!degraded && warpBoost > 0.45) {
      const flash = (warpBoost - 0.45) / 0.55;

      ctx.globalCompositeOperation = "screen";
      ctx.globalAlpha = 0.05 * flash;
      ctx.fillStyle = "rgba(219,231,255,1)";
      ctx.fillRect(0, 0, width, height);
      ctx.globalAlpha = 1;
      ctx.globalCompositeOperation = "source-over";
    }

    drawTunnel(time, deltaTime, warpBoost);
    applyLens(warpBoost);

    return warpBoost;
  }

  function drawConstellation(deltaTime) {
    if (!constellation && !degraded && rnd() < 0.0016) spawnConstellation();
    if (!constellation) return;

    constellation.t += deltaTime;

    const fadeIn = Math.min(1, constellation.t / 2.0);
    const fadeOut = Math.max(0, (constellation.life - constellation.t) / 2.6);
    constellation.alpha = Math.min(fadeIn, fadeOut) * 0.16;

    if (constellation.t >= constellation.life) {
      constellation = null;
      return;
    }

    ctx.globalAlpha = constellation.alpha;

    ctx.fillStyle = "rgba(232,238,246,1)";
    for (const point of constellation.points) {
      ctx.beginPath();
      ctx.arc(point.x, point.y, 1.6, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.strokeStyle = "rgba(219,231,255,1)";
    ctx.lineWidth = 1;
    ctx.beginPath();

    for (const [a, b] of constellation.links) {
      const pointA = constellation.points[a];
      const pointB = constellation.points[b];

      ctx.moveTo(pointA.x, pointA.y);
      ctx.lineTo(pointB.x, pointB.y);
    }

    ctx.stroke();
    ctx.globalAlpha = 1;
  }

  function drawGrain() {
    if (degraded) return;

    const n = 80;
    ctx.globalAlpha = 0.035;
    ctx.fillStyle = "rgba(255,255,255,1)";

    for (let i = 0; i < n; i += 1) {
      ctx.fillRect(rnd() * width, rnd() * height, 1, 1);
    }

    ctx.globalAlpha = 1;
  }

  let last = performance.now();
  let time = 0;

  function loop(now) {
    const deltaTime = Math.min(0.04, (now - last) / 1000);

    last = now;
    time += deltaTime;

    frames += 1;
    const perfDelta = now - perfLast;

    if (perfDelta >= 1200) {
      const fps = (frames * 1000) / perfDelta;

      frames = 0;
      perfLast = now;

      if (fps < 45) {
        degraded = true;
        document.documentElement.setAttribute("data-hbce-spacefield-performance", "degraded");
      }
    }

    clear();
    drawPlanets(deltaTime);
    drawStars(time, deltaTime);
    drawConstellation(deltaTime);
    drawGrain();

    requestAnimationFrame(loop);
  }

  requestAnimationFrame(loop);
})();
