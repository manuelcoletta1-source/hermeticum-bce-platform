/* HBCE FX — cinematic but deterministic
   - reveal on scroll
   - controlled glitch pulse
   - micro-shake on interactions
   - auto-degrade on low FPS
*/
(function () {
  "use strict";

  const root = document.documentElement;
  const prefersReduced =
    window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (prefersReduced) {
    root.classList.add("fx-off");
    return;
  }

  // REVEAL ON SCROLL
  const revealEls = Array.from(document.querySelectorAll("[data-reveal]"));
  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (e.isIntersecting) {
          e.target.classList.add("is-revealed");
          io.unobserve(e.target);
        }
      }
    },
    { threshold: 0.12 }
  );
  revealEls.forEach((el) => io.observe(el));

  // GLITCH PULSE (sparse)
  function pulseGlitch() {
    if (root.classList.contains("fx-degraded")) return;
    root.classList.add("fx-glitch");
    window.setTimeout(() => root.classList.remove("fx-glitch"), 180);
  }

  function scheduleGlitch() {
    const t = 7000 + Math.random() * 9000;
    window.setTimeout(() => {
      pulseGlitch();
      scheduleGlitch();
    }, t);
  }
  scheduleGlitch();

  // MICRO SHAKE (only marked elements)
  document.addEventListener("click", (ev) => {
    const t = ev.target && ev.target.closest && ev.target.closest("[data-shake]");
    if (!t) return;
    t.classList.remove("fx-shake");
    void t.offsetWidth; // restart animation
    t.classList.add("fx-shake");
  });

  // PERF GUARD
  let frames = 0;
  let last = performance.now();

  function raf(now) {
    frames++;
    const dt = now - last;

    if (dt >= 1200) {
      const fps = (frames * 1000) / dt;
      frames = 0;
      last = now;

      if (fps < 45) root.classList.add("fx-degraded");
    }

    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);
})();
