/* ============================================================
   HBCE UI INJECTOR — header/footer (EU-first)
   Deterministic injection (no external deps)
   ============================================================ */

(function () {
  "use strict";

  const BASE = "/hermeticum-bce-platform/";

  // Canonical navigation (single source of truth)
  const nav = [
    { href: BASE, label: "Home" },
    { href: BASE + "activate/", label: "Activate" },
    { href: BASE + "create/base/", label: "Create IPR" },
    { href: BASE + "verify/", label: "Verify" },
    { href: BASE + "registry/", label: "Registry" },
    { href: BASE + "registry/publish/", label: "Publish" },
    { href: BASE + "protocol/", label: "Protocol" },
    { href: BASE + "compliance/", label: "Compliance" },
    { href: BASE + "pricing/", label: "Pricing" },
    { href: BASE + "horizon/", label: "Horizon" }
  ];

  const headerHTML = `
    <header class="hbce-header">
      <div class="hbce-container hbce-header__inner">
        <a class="hbce-brand" href="${BASE}" aria-label="HBCE Home">
          <span class="hbce-brand__mark">🜏</span>
          <span class="hbce-brand__text">
            <span class="hbce-brand__name">HERMETICUM</span>
            <span class="hbce-brand__tag">BLINDATA · COMPUTABILE · EVOLUTIVA</span>
          </span>
        </a>

        <nav class="hbce-nav" aria-label="Primary navigation">
          ${nav.map(i => `<a class="hbce-nav__link" href="${i.href}">${i.label}</a>`).join("")}
        </nav>

        <div class="hbce-header__right">
          <span class="hbce-badge">EU REGULATORY RESEARCH · AUTONOMY · AI GOVERNANCE</span>
        </div>

        <button class="hbce-burger" type="button" aria-label="Open menu" aria-expanded="false">
          <span></span><span></span><span></span>
        </button>
      </div>

      <div class="hbce-container hbce-navmobile" hidden>
        ${nav.map(i => `<a class="hbce-navmobile__link" href="${i.href}">${i.label}</a>`).join("")}
      </div>
    </header>
  `;

  const footerHTML = `
    <footer class="hbce-footer">
      <div class="hbce-container hbce-footer__inner">
        <div class="hbce-footer__col">
          <div class="hbce-footer__brand">
            <span class="hbce-footer__mark">🜏</span>
            <div>
              <div class="hbce-footer__title">HERMETICUM - BLINDATA · COMPUTABILE · EVOLUTIVA</div>
              <div class="hbce-footer__sub">HERMETICUM B.C.E. S.r.l.</div>
            </div>
          </div>

          <p class="hbce-footer__p">
            EU-first operational identity & cyber-physical governance infrastructure.
            Public surface is hash-only. Validation is deterministic. Missing proof ⇒ INVALID.
          </p>
        </div>

        <div class="hbce-footer__col">
          <div class="hbce-footer__h">Core</div>
          <a class="hbce-footer__a" href="${BASE}activate/">Activate</a>
          <a class="hbce-footer__a" href="${BASE}create/base/">Create IPR</a>
          <a class="hbce-footer__a" href="${BASE}verify/">Verify</a>
          <a class="hbce-footer__a" href="${BASE}registry/">Registry</a>
          <a class="hbce-footer__a" href="${BASE}registry/publish/">Publish</a>
        </div>

        <div class="hbce-footer__col">
          <div class="hbce-footer__h">Governance</div>
          <a class="hbce-footer__a" href="${BASE}protocol/">Protocol</a>
          <a class="hbce-footer__a" href="${BASE}compliance/">Compliance</a>
          <a class="hbce-footer__a" href="${BASE}infrastructure/eu-autonomy-framework.html">EU Autonomy Framework</a>
          <a class="hbce-footer__a" href="${BASE}horizon/">Horizon</a>
        </div>

        <div class="hbce-footer__col">
          <div class="hbce-footer__h">Posture</div>
          <div class="hbce-footer__pill">UE_FIRST</div>
          <div class="hbce-footer__pill">AUDIT_FIRST</div>
          <div class="hbce-footer__pill">FAIL_CLOSED</div>
          <div class="hbce-footer__pill">HASH_ONLY</div>
          <div class="hbce-footer__pill">APPEND_ONLY</div>
        </div>
      </div>

      <div class="hbce-container hbce-footer__bottom">
        <div class="hbce-footer__small">© ${new Date().getFullYear()} HERMETICUM B.C.E. S.r.l. · EU-first operational R&D</div>
      </div>
    </footer>
  `;

  function setActiveLinks(root) {
    const path = window.location.pathname;
    const links = root.querySelectorAll("a.hbce-nav__link, a.hbce-navmobile__link");

    links.forEach(a => {
      const href = a.getAttribute("href") || "";
      const isActive = href !== "#" && (href === path || (href !== BASE && path.startsWith(href)));
      if (isActive) a.classList.add("is-active");
    });
  }

  function initBurger(headerRoot) {
    const burger = headerRoot.querySelector(".hbce-burger");
    const mobile = headerRoot.querySelector(".hbce-navmobile");
    if (!burger || !mobile) return;

    burger.addEventListener("click", () => {
      const expanded = burger.getAttribute("aria-expanded") === "true";
      burger.setAttribute("aria-expanded", String(!expanded));
      mobile.hidden = expanded;
    });

    mobile.addEventListener("click", (e) => {
      const t = e.target;
      if (t && t.tagName === "A") {
        burger.setAttribute("aria-expanded", "false");
        mobile.hidden = true;
      }
    });
  }

  function inject() {
    const headerHost = document.querySelector('[data-hbce="header"]');
    const footerHost = document.querySelector('[data-hbce="footer"]');

    if (headerHost) headerHost.innerHTML = headerHTML;
    if (footerHost) footerHost.innerHTML = footerHTML;

    const headerRoot = document.querySelector(".hbce-header");
    if (headerRoot) {
      setActiveLinks(headerRoot);
      initBurger(headerRoot);
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", inject, { once: true });
  } else {
    inject();
  }
})();
