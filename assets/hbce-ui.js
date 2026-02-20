/* =========================================================
   HBCE UI Injectors — header/footer (refactor, full file)
   - EU-first, audit-first navigation
   - Adds ΦΩ Industrial Pilot section link
   - Safe: no external deps, deterministic DOM inject
   - Injects minimal nav CSS to ensure mobile toggle works
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
    return here === target || here.startsWith(target + "/");
  }

  function buildNavItem(item) {
    const active = isActive(item.href) ? ' aria-current="page"' : "";
    const cls = isActive(item.href)
      ? "hbce-nav__link is-active"
      : "hbce-nav__link";
    return `<a class="${cls}" href="${esc(item.href)}"${active}>${esc(
      item.label
    )}</a>`;
  }

  // -------- config ----------
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

  // -------- minimal CSS injection (nav toggle safety) ----------
  function injectNavCSS() {
    const id = "hbce-nav-inline-css";
    if (document.getElementById(id)) return;

    const css = `
/* HBCE inline nav safety (minimal, non-invasive) */
.hbce-header { position: sticky; top: 0; z-index: 50; backdrop-filter: blur(10px); }
.hbce-header__inner { display:flex; align-items:center; justify-content:space-between; gap:16px; padding:14px 0; }
.hbce-brand { display:flex; flex-direction:column; text-decoration:none; }
.hbce-brand__mark { font-weight:700; letter-spacing:.4px; }
.hbce-brand__entity { opacity:.8; font-size:.92rem; }

.hbce-nav { display:flex; gap:12px; align-items:center; }
.hbce-nav__link { text-decoration:none; padding:8px 10px; border-radius:10px; }
.hbce-nav__link.is-active { outline:1px solid rgba(255,255,255,.22); }

.hbce-nav__toggle { display:none; background:transparent; border:0; padding:8px; border-radius:12px; cursor:pointer; }
.hbce-nav__toggleBar { display:block; width:22px; height:2px; margin:4px 0; background:currentColor; opacity:.85; }

/* Mobile behavior */
@media (max-width: 900px) {
  .hbce-nav__toggle { display:inline-flex; align-items:center; justify-content:center; }
  .hbce-nav {
    display:none;
    position:absolute;
    left:0; right:0;
    top:64px;
    padding:12px;
    margin:0 12px;
    border-radius:16px;
    background: rgba(15,18,24,.92);
    backdrop-filter: blur(12px);
    outline: 1px solid rgba(255,255,255,.10);
    flex-direction:column;
    align-items:stretch;
    gap:8px;
  }
  .hbce-nav.is-open { display:flex; }
  .hbce-nav__link { padding:10px 12px; }
}
`;

    const style = document.createElement("style");
    style.id = id;
    style.textContent = css;
    document.head.appendChild(style);
  }

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
    injectNavCSS();

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
