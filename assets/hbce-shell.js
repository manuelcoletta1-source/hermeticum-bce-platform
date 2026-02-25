/* =========================================================
   HBCE GLOBAL UI — SHELL INJECTOR (EN)
   - Injects the same header/nav/footer on core pages
   - Sets active nav state
   ========================================================= */

(function(){
  "use strict";

  function normPath(p){
    try{
      const u = new URL(p, window.location.origin);
      return u.pathname.replace(/\/+$/,"") || "/";
    }catch{
      return (p||"/").replace(/\/+$/,"") || "/";
    }
  }

  function isActive(href){
    const here = normPath(window.location.pathname);
    const target = normPath(href);
    if(target === "/") return here === "/";
    return here === target || here.startsWith(target + "/");
  }

  function qs(sel, root=document){ return root.querySelector(sel); }

  // Project base path: when hosted on GitHub Pages under /hermeticum-bce-platform/
  const BASE = "/hermeticum-bce-platform";

  const NAV = [
    { label:"Home", href: BASE + "/" },
    { label:"Robotics & AI", href: BASE + "/robotics-ai/" },
    { label:"Joker-C2", href: BASE + "/joker-c2/" },
    { label:"Pricing", href: BASE + "/pricing/" },
    { label:"Operators", href: BASE + "/operators/" },
    { label:"EU / Horizon", href: BASE + "/eu/" }
  ];

  function headerHTML(){
    const links = NAV.map(x => {
      const active = isActive(x.href) ? " is-active" : "";
      return `<a class="${active.trim()}" href="${x.href}">${x.label}</a>`;
    }).join("");

    const contactHref = BASE + "/contact/";
    const contactActive = isActive(contactHref) ? " is-active" : "";

    return `
      <header class="top">
        <div>
          <div class="brand">HERMETICUM - BLINDATA · COMPUTABILE · EVOLUTIVA</div>
          <div class="tag">HERMETICUM B.C.E. S.r.l. — EU-first / Audit-first</div>
        </div>
        <nav class="nav" aria-label="Primary navigation">
          ${links}
          <a class="btn primary${contactActive ? " is-active" : ""}" href="${contactHref}" style="margin-left:6px">Contact</a>
        </nav>
      </header>
    `;
  }

  function footerHTML(){
    return `
      <footer>
        <div class="mono">Policy: HASH_ONLY · APPEND_ONLY · FAIL_CLOSED · UE_FIRST · AUDIT_FIRST · GDPR_MIN</div>
        <div>Issuer: <span class="mono">HERMETICUM B.C.E. S.r.l.</span> — Jurisdiction: <span class="mono">EU</span></div>
      </footer>
    `;
  }

  function mountShell(){
    const wrap = qs(".wrap");
    if(!wrap) return;

    // Avoid duplicate inject
    if(qs("[data-hbce-shell='1']")) return;

    const shell = document.createElement("div");
    shell.setAttribute("data-hbce-shell","1");
    shell.innerHTML = headerHTML();

    // Insert header at top of wrap
    wrap.insertBefore(shell, wrap.firstChild);

    // Append footer at end of wrap
    const foot = document.createElement("div");
    foot.innerHTML = footerHTML();
    wrap.appendChild(foot);
  }

  document.addEventListener("DOMContentLoaded", mountShell);
})();
