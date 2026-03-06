/* =========================================================
   HBCE UI SYSTEM — LIGHT ENHANCER (CANONICAL)
   - No DOM shell injection
   - No automatic header/footer generation
   - No route assumptions
   - Progressive enhancement only
   - Supports active nav fallback, external link hygiene,
     reduced-motion-safe reveal behavior, and small UX helpers
   ========================================================= */

(function(){
  "use strict";

  if (document.documentElement.getAttribute("data-hbce-ui") === "1") return;
  document.documentElement.setAttribute("data-hbce-ui", "1");

  function normPath(path){
    try{
      const u = new URL(path, window.location.origin);
      return u.pathname.replace(/\/+$/, "") || "/";
    }catch{
      return (path || "/").replace(/\/+$/, "") || "/";
    }
  }

  function isActiveHref(href){
    const here = normPath(window.location.pathname);
    const target = normPath(href);

    if (target === "/") return here === "/";
    return here === target || here.startsWith(target + "/");
  }

  function enhanceNav(){
    const nav = document.querySelector(".hbce-nav");
    if (!nav) return;

    const links = Array.from(nav.querySelectorAll("a[href]"));
    links.forEach((link) => {
      const href = link.getAttribute("href");
      if (!href) return;

      // Respect manually assigned active states first.
      if (link.classList.contains("is-active")) return;

      if (isActiveHref(href)) {
        link.classList.add("is-active");
      }
    });
  }

  function enhanceExternalLinks(){
    const links = Array.from(document.querySelectorAll('a[href]'));
    links.forEach((link) => {
      const href = link.getAttribute("href");
      if (!href) return;

      const isExternal =
        href.startsWith("http://") ||
        href.startsWith("https://");

      if (!isExternal) return;

      // Do not overwrite explicit rel if already strong enough.
      const rel = (link.getAttribute("rel") || "").trim();
      const relTokens = new Set(rel.split(/\s+/).filter(Boolean));
      relTokens.add("noopener");
      link.setAttribute("rel", Array.from(relTokens).join(" "));
    });
  }

  function enhanceButtons(){
    const buttons = Array.from(document.querySelectorAll(".hbce-btn"));
    buttons.forEach((btn) => {
      if (btn.tagName === "BUTTON" && !btn.getAttribute("type")) {
        btn.setAttribute("type", "button");
      }
    });
  }

  function enhanceReveal(){
    const reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) return;

    const sections = Array.from(document.querySelectorAll(".hbce-section"));
    if (!sections.length || !("IntersectionObserver" in window)) return;

    sections.forEach((el) => {
      el.setAttribute("data-hbce-reveal", "pending");
    });

    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.setAttribute("data-hbce-reveal", "visible");
        io.unobserve(entry.target);
      });
    }, {
      root: null,
      rootMargin: "0px 0px -8% 0px",
      threshold: 0.08
    });

    sections.forEach((el) => io.observe(el));
  }

  function enhanceCopyables(){
    const copyNodes = Array.from(document.querySelectorAll("[data-copy-text]"));
    copyNodes.forEach((node) => {
      node.addEventListener("click", async () => {
        const text = node.getAttribute("data-copy-text");
        if (!text) return;
        try{
          await navigator.clipboard.writeText(text);
        }catch{
          // Silent fail by design.
        }
      });
    });
  }

  function init(){
    enhanceNav();
    enhanceExternalLinks();
    enhanceButtons();
    enhanceReveal();
    enhanceCopyables();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once:true });
  } else {
    init();
  }
})();
