/* =========================================================
   HBCE UI SYSTEM — GLOBAL INJECTOR (BASE-PATH AWARE)
   - Works on GitHub Pages project sites (/repo-name/...)
   - Injects header/nav/footer once
   ========================================================= */

(function(){
  "use strict";

  function isGithubProjectSite(){
    try{ return /\.github\.io$/i.test(window.location.hostname); }
    catch{ return false; }
  }

  function inferBasePath(){
    // Optional override:
    // <meta name="hbce-base" content="/hermeticum-bce-platform">
    const meta = document.querySelector('meta[name="hbce-base"]');
    if(meta && meta.content){
      const v = String(meta.content).trim();
      if(v === "/" || v === "") return "";
      return v.startsWith("/") ? v.replace(/\/+$/,"") : ("/"+v.replace(/\/+$/,""));
    }

    // Auto-infer on GitHub Pages project site: /<repo>/...
    if(!isGithubProjectSite()) return "";
    const parts = (window.location.pathname || "/").split("/").filter(Boolean);
    if(parts.length === 0) return "";
    return "/" + parts[0]; // "/hermeticum-bce-platform"
  }

  function join(base, path){
    const b = (base || "").replace(/\/+$/,"");
    const p = (path || "/").startsWith("/") ? path : ("/"+path);
    return (b + p).replace(/\/{2,}/g,"/");
  }

  function inject(){
    if(document.documentElement.getAttribute("data-hbce-ui") === "1") return;
    document.documentElement.setAttribute("data-hbce-ui","1");

    const base = inferBasePath();

    const navItems = [
      ["Home", "/"],
      ["About", "/about/"],
      ["Robotics & AI", "/robotics-ai/"],
      ["Joker-C2", "/joker-c2/"],
      ["Pricing", "/pricing/"],
      ["Operator", "/operator/"],
      ["EU / Horizon", "/eu/"],
      ["Contact", "/contact/"]
    ];

    const navHtml = navItems.map(([label, href]) =>
      `<a href="${join(base, href)}">${label}</a>`
    ).join("");

    const header = `
      <div class="hbce-topbar">
        <div class="hbce-brand">
          <div class="hbce-seal">HERMETICUM - BLINDATA · COMPUTABILE · EVOLUTIVA · HERMETICUM B.C.E. S.r.l.</div>
          <div class="hbce-subseal">EU-first · audit-first · fail-closed</div>
        </div>
        <nav class="hbce-nav" aria-label="Primary">${navHtml}</nav>
      </div>
    `;

    const footer = `
      <footer class="hbce-footer">
        <div><strong>HERMETICUM B.C.E. S.r.l.</strong></div>
        <div>HASH_ONLY · APPEND_ONLY · FAIL_CLOSED · UE_FIRST · AUDIT_FIRST · GDPR_MIN</div>
      </footer>
    `;

    const body = document.body;
    const existing = body.innerHTML;

    body.innerHTML = `
      ${header}
      <div class="hbce-wrap">
        <main class="hbce-main">
          ${existing}
        </main>
      </div>
      ${footer}
    `;
  }

  if(document.readyState === "loading"){
    document.addEventListener("DOMContentLoaded", inject);
  }else{
    inject();
  }
})();
