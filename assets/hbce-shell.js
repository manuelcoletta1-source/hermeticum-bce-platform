/* =========================================================
   HBCE GLOBAL UI — SHELL COMPATIBILITY ENHANCER
   - No automatic header/footer injection
   - No legacy route injection
   - No B2B/robotics/contact assumptions
   - Progressive enhancement only
   - Compatible with registry v3 / payload_sha256 / no-public-data-custody model
   ========================================================= */

(function () {
  "use strict";

  if (document.documentElement.getAttribute("data-hbce-shell") === "1") return;
  document.documentElement.setAttribute("data-hbce-shell", "1");
  document.documentElement.setAttribute("data-hbce-shell-mode", "compatibility-no-injection");

  function normPath(path) {
    try {
      const url = new URL(path, window.location.origin);
      return url.pathname.replace(/\/+$/, "") || "/";
    } catch {
      return String(path || "/").replace(/\/+$/, "") || "/";
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

  function enhanceExistingNavigation() {
    const navs = Array.from(document.querySelectorAll(".hbce-nav, nav[aria-label='Primary'], nav[aria-label='Primary navigation']"));

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

      let sameOrigin = false;

      try {
        const url = new URL(href, window.location.href);
        sameOrigin = url.origin === window.location.origin;
      } catch {
        sameOrigin = false;
      }

      if (sameOrigin) return;

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

  function annotateStaticGateway() {
    const body = document.body;
    if (!body) return;

    body.setAttribute("data-hbce-static-gateway", "1");
    body.setAttribute("data-hbce-public-proof", "hash-only");
    body.setAttribute("data-hbce-data-custody", "no-public-data-custody");
  }

  function init() {
    annotateStaticGateway();
    enhanceExistingNavigation();
    hardenExternalLinks();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})();
