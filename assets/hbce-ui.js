/* =========================================================
   HBCE UI SYSTEM — LIGHT ENHANCER (CANONICAL)
   - No DOM shell injection
   - No automatic header/footer generation
   - No route assumptions beyond current public path
   - Progressive enhancement only
   - Supports active nav fallback, external link hygiene,
     button normalization, reduced-motion-safe reveal behavior,
     and small UX helpers
   - Registry v3 / no-public-data-custody compatible
   ========================================================= */

(function () {
  "use strict";

  if (document.documentElement.getAttribute("data-hbce-ui") === "1") return;
  document.documentElement.setAttribute("data-hbce-ui", "1");

  function normPath(path) {
    try {
      const url = new URL(path, window.location.origin);
      return url.pathname.replace(/\/+$/, "") || "/";
    } catch {
      return String(path || "/").replace(/\/+$/, "") || "/";
    }
  }

  function getCurrentPath() {
    return normPath(window.location.pathname);
  }

  function isSameOriginAbsolute(href) {
    try {
      const url = new URL(href, window.location.href);
      return url.origin === window.location.origin;
    } catch {
      return false;
    }
  }

  function isActiveHref(href) {
    if (!href) return false;

    const currentPath = getCurrentPath();
    let targetPath;

    try {
      const targetUrl = new URL(href, window.location.href);

      if (targetUrl.origin !== window.location.origin) return false;

      targetPath = normPath(targetUrl.pathname);
    } catch {
      targetPath = normPath(href);
    }

    if (targetPath === "/") return currentPath === "/";
    return currentPath === targetPath || currentPath.startsWith(targetPath + "/");
  }

  function enhanceNav() {
    const navs = Array.from(document.querySelectorAll(".hbce-nav"));
    if (!navs.length) return;

    navs.forEach((nav) => {
      if (!nav.getAttribute("aria-label")) {
        nav.setAttribute("aria-label", "HBCE navigation");
      }

      const links = Array.from(nav.querySelectorAll("a[href]"));

      links.forEach((link) => {
        const href = link.getAttribute("href");
        if (!href) return;

        if (link.classList.contains("is-active")) {
          link.setAttribute("aria-current", "page");
          return;
        }

        if (isActiveHref(href)) {
          link.classList.add("is-active");
          link.setAttribute("aria-current", "page");
        }
      });
    });
  }

  function enhanceExternalLinks() {
    const links = Array.from(document.querySelectorAll("a[href]"));

    links.forEach((link) => {
      const href = link.getAttribute("href");
      if (!href) return;

      const isHttp = href.startsWith("http://") || href.startsWith("https://");
      if (!isHttp) return;

      if (isSameOriginAbsolute(href)) return;

      const rel = (link.getAttribute("rel") || "").trim();
      const relTokens = new Set(rel.split(/\s+/).filter(Boolean));

      relTokens.add("noopener");
      relTokens.add("noreferrer");

      link.setAttribute("rel", Array.from(relTokens).join(" "));

      if (!link.getAttribute("target")) {
        link.setAttribute("target", "_blank");
      }
    });
  }

  function enhanceButtons() {
    const buttons = Array.from(document.querySelectorAll(".hbce-btn"));

    buttons.forEach((button) => {
      if (button.tagName === "BUTTON" && !button.getAttribute("type")) {
        button.setAttribute("type", "button");
      }
    });
  }

  function enhanceReveal() {
    const reduceMotion =
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduceMotion) return;

    const sections = Array.from(document.querySelectorAll(".hbce-section"));
    if (!sections.length || !("IntersectionObserver" in window)) return;

    sections.forEach((section) => {
      if (!section.hasAttribute("data-hbce-reveal")) {
        section.setAttribute("data-hbce-reveal", "pending");
      }
    });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          entry.target.setAttribute("data-hbce-reveal", "visible");
          observer.unobserve(entry.target);
        });
      },
      {
        root: null,
        rootMargin: "0px 0px -8% 0px",
        threshold: 0.08
      }
    );

    sections.forEach((section) => observer.observe(section));
  }

  function enhanceCopyables() {
    const copyNodes = Array.from(document.querySelectorAll("[data-copy-text]"));

    copyNodes.forEach((node) => {
      if (node.getAttribute("data-hbce-copy-bound") === "1") return;
      node.setAttribute("data-hbce-copy-bound", "1");

      if (!node.getAttribute("role")) {
        node.setAttribute("role", "button");
      }

      if (!node.getAttribute("tabindex")) {
        node.setAttribute("tabindex", "0");
      }

      async function copy() {
        const text = node.getAttribute("data-copy-text");
        if (!text) return;

        try {
          await navigator.clipboard.writeText(text);
          node.setAttribute("data-copy-status", "copied");
        } catch {
          node.setAttribute("data-copy-status", "copy-unavailable");
        }
      }

      node.addEventListener("click", copy);

      node.addEventListener("keydown", (event) => {
        if (event.key !== "Enter" && event.key !== " ") return;
        event.preventDefault();
        copy();
      });
    });
  }

  function enhanceCodeBlocks() {
    const codeBlocks = Array.from(document.querySelectorAll("pre code"));

    codeBlocks.forEach((code) => {
      if (!code.getAttribute("dir")) {
        code.setAttribute("dir", "ltr");
      }
    });
  }

  function init() {
    enhanceNav();
    enhanceExternalLinks();
    enhanceButtons();
    enhanceReveal();
    enhanceCopyables();
    enhanceCodeBlocks();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})();
