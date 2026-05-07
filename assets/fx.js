/* =========================================================
   HBCE FX — LOCAL VISUAL ENHANCER
   - Visual effects only
   - No fetch
   - No tracking
   - No upload
   - No data custody
   - Respects reduced motion
   - Auto-degrades on low FPS
   ========================================================= */

(function () {
  "use strict";

  if (document.documentElement.getAttribute("data-hbce-fx") === "1") return;
  document.documentElement.setAttribute("data-hbce-fx", "1");

  const root = document.documentElement;

  const prefersReduced =
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (prefersReduced) {
    root.classList.add("fx-off");
    root.setAttribute("data-hbce-fx-mode", "reduced-motion");
    return;
  }

  root.setAttribute("data-hbce-fx-mode", "local-visual-only");

  function setupReveal() {
    const revealElements = Array.from(document.querySelectorAll("[data-reveal]"));

    if (!revealElements.length || !("IntersectionObserver" in window)) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;

          entry.target.classList.add("is-revealed");
          observer.unobserve(entry.target);
        }
      },
      {
        threshold: 0.12
      }
    );

    revealElements.forEach((element) => observer.observe(element));
  }

  function pulseGlitch() {
    if (root.classList.contains("fx-degraded")) return;
    if (root.classList.contains("fx-off")) return;

    root.classList.add("fx-glitch");

    window.setTimeout(() => {
      root.classList.remove("fx-glitch");
    }, 180);
  }

  function scheduleGlitch() {
    if (root.classList.contains("fx-off")) return;

    const delay = 7000 + Math.random() * 9000;

    window.setTimeout(() => {
      pulseGlitch();
      scheduleGlitch();
    }, delay);
  }

  function setupMicroShake() {
    document.addEventListener("click", (event) => {
      const target =
        event.target &&
        event.target.closest &&
        event.target.closest("[data-shake]");

      if (!target) return;

      target.classList.remove("fx-shake");

      void target.offsetWidth;

      target.classList.add("fx-shake");
    });
  }

  function setupPerformanceGuard() {
    if (!("requestAnimationFrame" in window)) return;

    let frames = 0;
    let last = performance.now();

    function frame(now) {
      frames += 1;

      const delta = now - last;

      if (delta >= 1200) {
        const fps = (frames * 1000) / delta;

        frames = 0;
        last = now;

        if (fps < 45) {
          root.classList.add("fx-degraded");
          root.setAttribute("data-hbce-fx-performance", "degraded");
        }
      }

      requestAnimationFrame(frame);
    }

    requestAnimationFrame(frame);
  }

  function init() {
    setupReveal();
    setupMicroShake();
    scheduleGlitch();
    setupPerformanceGuard();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})();
