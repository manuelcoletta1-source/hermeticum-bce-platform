/* =========================================================
   HBCE NAV — COMPATIBILITY ENHANCER
   - No DOM shell injection
   - No automatic header/footer generation
   - No legacy route injection
   - Progressive enhancement only
   - Compatible with registry v3 / no-public-data-custody model
   ========================================================= */

(function () {
  "use strict";

  if (document.documentElement.getAttribute("data-hbce-nav") === "1") return;
  document.documentElement.setAttribute("data-hbce-nav", "1");

  function normPath(path) {
    try {
      const url = new URL(path, window.location.origin);
      return url.pathname.replace(/\/+$/, "") || "/";
    } catch {
      return String(path || "/").replace(/\/+$/, "") || "/";
    }
  }

  function isSameOrigin(href) {
    try {
      const url = new URL(href, window.location.href);
      return url.origin === window.location.origin;
    } catch {
      return false;
    }
  }

  function isActive(href) {
    if (!href) return false;

    const current = normPath(window.location.pathname);

    let target;

    try {
      const url = new URL(href, window.location.href);
      if (url.origin !== window.location.origin) return false;
      target = normPath(url.pathname);
    } catch {
      target = normPath(href);
    }

    if (target === "/") return current === "/";
    return current === target || current.startsWith(target + "/");
  }

  function enhanceNavs() {
    const navs = Array.from(document.querySelectorAll(".hbce-nav"));

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

        if (isActive(href)) {
          link.classList.add("is-active");
          link.setAttribute("aria-current", "page");
        }
      });
    });
  }

  function hardenExternalLinks() {
    const links = Array.from(document.querySelectorAll("a[href]"));

    links.forEach((link) => {
      const href = link.getAttribute("href");
      if (!href) return;

      const isHttp = href.startsWith("http://") || href.startsWith("https://");
      if (!isHttp) return;
      if (isSameOrigin(href)) return;

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

  function markLegacyNavScript() {
    document.documentElement.setAttribute("data-hbce-nav-mode", "compatibility-no-injection");
  }

  function init() {
    markLegacyNavScript();
    enhanceNavs();
    hardenExternalLinks();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})();
