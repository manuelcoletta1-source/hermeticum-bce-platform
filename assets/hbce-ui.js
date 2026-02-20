/* =========================================================
   HBCE UI Injectors — header/footer (refactor, full file)
   - EU-first, audit-first navigation
   - Adds ΦΩ Industrial Pilot section link
   - Safe: no external deps, deterministic DOM inject
   ========================================================= */

(function () {
  "use strict";

  // -------- helpers ----------
  function esc(s) {
    return String(s)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#39;");
  }

  function normPath(p) {
    try {
      const u = new URL(p, window.location.origin);
      return u.pathname.replace(/\/+$/, "") || "/";
    } catch {
      return (p || "/").replace(/\/+$/, "") || "/";
    }
  }

  function isActive(href) {
    const here = normPath(window.location.pathname);
    const target = normPath(href);

    if (target === "/") return here === "/";
    // active for exact or subtree (e.g. /verify and /verify/...)
    return here === target || here.startsWith(target + "/");
  }

  function buildNavItem(item) {
    const active = isActive(item.href) ? " aria-current=\"page\"" : "";
    const cls = isActive(item.href) ? " hbce-nav__link is-active" : " hbce-nav__link";
    const label = esc(item.label);
    const href = esc(item.href);
    return `<a class="${cls}" href="${href}"${active}>${label}</a>`;
  }

  // -------- config ----------
  // Keep it tight: CORE first, then specs, then governance tools.
  const NAV = [
    { label: "Home", href: "/hermeticum-bce-platform/" },

    // CORE flows
    { label: "Activate", href: "/hermeticum-bce-platform/activate/" },
    { label: "Create IPR", href: "/hermeticum-bce-platform/create/base/" },
    { label: "Verify", href: "/hermeticum-bce-platform/verify/" },
    { label: "Registry", href: "/hermeticum-bce-platform/registry/" },
    { label: "Publish", href: "/hermeticum-bce-platform/publish/" },

    // Industrial bridge
    { label: "ΦΩ Pilot", href: "/hermeticum-bce-platform/phiomega/" },

    // Commercial / catalogue
    { label: "Pricing", href: "/hermeticum-bce-platform/pricing/" }
  ];

  const BRAND = {
    mark: "HERMETICUM - BLINDATA · COMPUTABILE · EVOLUTIVA",
    entity: "HERMETICUM B.C.E. S.r.l."
  };

  // -------- templates ----------
  function headerHTML() {
    const navLinks = NAV.map(buildNavItem).join("");

    return `
<header class="hbce-header">
  <div class="hbce-header__inner hbce-container">
    <a class="hbce-brand" href="/hermeticum-bce-platform/">
      <span class="hbce-brand__mark">${esc(BRAND.mark)}</span>
      <span class="hbce-brand__entity">${esc(BRAND.entity)}</span>
    </a>

    <nav class="hbce-nav" aria-label="HBCE primary navigation">
      ${navLinks}
    </nav>

    <button class="hbce-nav__toggle" type="button" aria-label="Toggle navigation" aria-expanded="false">
      <span class="hbce-nav__toggleBar"></span>
      <span class="hbce-nav__toggleBar"></span>
      <span class="hbce-nav__toggleBar"></span>
    </button>
  </div>
</header>
`;
  }

  function footerHTML() {
    const year = new Date().getFullYear();
    return `
<footer class="hbce-footer">
  <div class="hbce-footer__inner hbce-container">
    <div class="hbce-footer__cols">
      <div class="hbce-footer__col">
        <div class="hbce-footer__mark">${esc(BRAND.mark)}</div>
        <div class="hbce-footer__entity">${esc(BRAND.entity)}</div>
        <div class="hbce-footer__meta">EU-first · Audit-first · Fail-closed · Hash-only · Append-only</div>
      </div>

      <div class="hbce-footer__col">
        <div class="hbce-footer__title">Core</div>
        <a class="hbce-footer__link" href="/hermeticum-bce-platform/activate/">Activate</a>
        <a class="hbce-footer__link" href="/hermeticum-bce-platform/create/base/">Create IPR</a>
        <a class="hbce-footer__link" href="/hermeticum-bce-platform/verify/">Verify</a>
        <a class="hbce-footer__link" href="/hermeticum-bce-platform/registry/">Registry</a>
      </div>

      <div class="hbce-footer__col">
        <div class="hbce-footer__title">Industrial</div>
        <a class="hbce-footer__link" href="/hermeticum-bce-platform/phiomega/">ΦΩ Industrial Pilot</a>
        <a class="hbce-footer__link" href="/hermeticum-bce-platform/pricing/">Pricing & Catalogue</a>
      </div>
    </div>

    <div class="hbce-footer__bottom">
      <div>© ${year} ${esc(BRAND.entity)} — All rights reserved.</div>
      <div class="hbce-footer__small">This site publishes technical information and public proofs only (hash-only). No public custody of personal data.</div>
    </div>
  </div>
</footer>
`;
  }

  // -------- injectors ----------
  function inject() {
    const headerSlot = document.querySelector('[data-hbce="header"]');
    if (headerSlot) headerSlot.innerHTML = headerHTML();

    const footerSlot = document.querySelector('[data-hbce="footer"]');
    if (footerSlot) footerSlot.innerHTML = footerHTML();

    wireNavToggle();
  }

  function wireNavToggle() {
    const toggle = document.querySelector(".hbce-nav__toggle");
    const nav = document.querySelector(".hbce-nav");
    if (!toggle || !nav) return;

    toggle.addEventListener("click", () => {
      const expanded = toggle.getAttribute("aria-expanded") === "true";
      toggle.setAttribute("aria-expanded", expanded ? "false" : "true");
      nav.classList.toggle("is-open", !expanded);
    });

    // Close nav when clicking outside (mobile sanity)
    document.addEventListener("click", (e) => {
      if (!nav.classList.contains("is-open")) return;
      if (nav.contains(e.target) || toggle.contains(e.target)) return;
      nav.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
    });
  }

  // -------- run ----------
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", inject);
  } else {
    inject();
  }
})();
