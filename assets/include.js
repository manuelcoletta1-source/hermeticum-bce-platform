/**
 * HERMETICUM B.C.E. — UI include loader
 *
 * Purpose:
 * - Load canonical same-origin header/footer partials on static GitHub Pages.
 *
 * Policy:
 * - same-origin fetch only;
 * - no tracking;
 * - no external calls;
 * - no secret handling;
 * - no private evidence custody;
 * - fail-closed: if partial loading fails, render nothing instead of fallback legacy navigation.
 */

(function () {
  "use strict";

  const BASE = "/hermeticum-bce-platform";

  const ALLOWED_PARTIALS = new Map([
    ["header", `${BASE}/partials/header.html`],
    ["footer", `${BASE}/partials/footer.html`]
  ]);

  function isSameOrigin(url) {
    try {
      const parsed = new URL(url, window.location.origin);
      return parsed.origin === window.location.origin;
    } catch {
      return false;
    }
  }

  async function fetchPartial(url) {
    if (!isSameOrigin(url)) {
      throw new Error("PARTIAL_URL_NOT_SAME_ORIGIN");
    }

    const response = await fetch(url, {
      cache: "no-store",
      credentials: "same-origin"
    });

    if (!response.ok) {
      throw new Error("PARTIAL_FETCH_HTTP_" + response.status);
    }

    return response.text();
  }

  async function injectPartial(selector, partialName) {
    const element = document.querySelector(selector);
    if (!element) return;

    const url = ALLOWED_PARTIALS.get(partialName);

    if (!url) {
      element.innerHTML = "";
      element.setAttribute("data-hbce-include-status", "blocked");
      return;
    }

    try {
      const html = await fetchPartial(url);
      element.innerHTML = html;
      element.setAttribute("data-hbce-include-status", "loaded");
      element.setAttribute("data-hbce-include-source", partialName);
    } catch (error) {
      element.innerHTML = "";
      element.setAttribute("data-hbce-include-status", "fail-closed");
      element.setAttribute("data-hbce-include-error", error && error.message ? error.message : "INCLUDE_ERROR");
    }
  }

  async function init() {
    await injectPartial("[data-include='header']", "header");
    await injectPartial("[data-include='footer']", "footer");

    await injectPartial("[data-hbce='header']", "header");
    await injectPartial("[data-hbce='footer']", "footer");

    document.documentElement.setAttribute("data-hbce-include-loader", "1");
    document.documentElement.setAttribute("data-hbce-include-policy", "same-origin-fail-closed");
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})();
