/* =========================================================
   HBCE UI Loader — header/footer partials (EU-first)
   - Loads /partials/header.html into [data-hbce="header"]
   - Loads /partials/footer.html into [data-hbce="footer"]
   - Soft fail-closed: if partial missing, inject minimal fallback
   - No tracking, no cookies, no external deps
   ========================================================= */

(function () {
  const BASE = "/hermeticum-bce-platform";
  const PARTIAL_HEADER = BASE + "/partials/header.html";
  const PARTIAL_FOOTER = BASE + "/partials/footer.html";

  function qs(sel) { return document.querySelector(sel); }

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, (m) => ({
      "&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#039;"
    }[m]));
  }

  function injectFallbackHeader(target, reason) {
    target.innerHTML =
      '<header class="hbce-header">' +
        '<div class="hbce-container hbce-header__inner">' +
          '<a class="hbce-brand" href="' + BASE + '/">' +
            '<span class="hbce-brand__name">HERMETICUM</span>' +
            '<span class="hbce-brand__tag">IPR · EU Operational Identity</span>' +
          '</a>' +
          '<nav class="hbce-nav" aria-label="Primary navigation">' +
            '<a class="hbce-nav__link" href="' + BASE + '/eu/">EU</a>' +
            '<a class="hbce-nav__link" href="' + BASE + '/create/">Citizen</a>' +
            '<a class="hbce-nav__link" href="' + BASE + '/lavora-con-noi/">Operator</a>' +
            '<a class="hbce-nav__link" href="' + BASE + '/bruxelles/">Institution</a>' +
            '<a class="hbce-nav__link" href="' + BASE + '/enterprise/">Industry</a>' +
            '<span class="hbce-nav__sep" aria-hidden="true">|</span>' +
            '<a class="hbce-nav__link" href="' + BASE + '/verify/">Verify</a>' +
            '<a class="hbce-nav__link" href="' + BASE + '/status/">Status</a>' +
          '</nav>' +
        '</div>' +
      '</header>' +
      '<div class="hbce-container" style="padding:.45rem 1rem 0;">' +
        '<p class="hbce-note" style="margin:0;">UI loader: header fallback (' + escapeHtml(reason) + ')</p>' +
      '</div>';
  }

  function injectFallbackFooter(target, reason) {
    target.innerHTML =
      '<footer class="hbce-footer">' +
        '<div class="hbce-container hbce-footer__inner">' +
          '<div class="hbce-footnote">' +
            '<p><strong>HERMETICUM - BLINDATA · COMPUTABILE · EVOLUTIVA</strong></p>' +
            '<p><strong>HERMETICUM B.C.E. S.r.l.</strong> — Turin, European Union</p>' +
            '<p class="hbce-note">UE-first · audit-first · fail-closed · hash-only · append-only · GDPR-min</p>' +
            '<p class="hbce-note">UI loader: footer fallback (' + escapeHtml(reason) + ')</p>' +
          '</div>' +
        '</div>' +
      '</footer>';
  }

  function sanitizeRelativeLinks(container) {
    // Ensure relative links inside partials behave correctly when embedded.
    // Only touches href/src that are relative and not starting with http(s), mailto, tel, or "#".
    const isSafeRelative = (v) => {
      if (!v) return false;
      const s = String(v).trim();
      if (!s) return false;
      if (s.startsWith("#")) return false;
      if (/^(https?:)?\/\//i.test(s)) return false;
      if (/^(mailto:|tel:)/i.test(s)) return false;
      // allow absolute paths (/hermeticum-bce-platform/...) already fine
      return !s.startsWith("/");
    };

    const nodes = container.querySelectorAll("[href],[src]");
    nodes.forEach((el) => {
      if (el.hasAttribute("href")) {
        const v = el.getAttribute("href");
        if (isSafeRelative(v)) el.setAttribute("href", BASE + "/" + v.replace(/^\.\//, ""));
      }
      if (el.hasAttribute("src")) {
        const v = el.getAttribute("src");
        if (isSafeRelative(v)) el.setAttribute("src", BASE + "/" + v.replace(/^\.\//, ""));
      }
    });
  }

  async function fetchText(url) {
    const r = await fetch(url, { cache: "no-store" });
    if (!r.ok) throw new Error("HTTP " + r.status);
    return await r.text();
  }

  async function loadInto(selector, url, fallbackFn) {
    const target = qs(selector);
    if (!target) return;

    try {
      const html = await fetchText(url);
      target.innerHTML = html;
      sanitizeRelativeLinks(target);
    } catch (e) {
      fallbackFn(target, e && e.message ? e.message : "load error");
    }
  }

  // Kick
  loadInto('[data-hbce="header"]', PARTIAL_HEADER, injectFallbackHeader);
  loadInto('[data-hbce="footer"]', PARTIAL_FOOTER, injectFallbackFooter);
})();
