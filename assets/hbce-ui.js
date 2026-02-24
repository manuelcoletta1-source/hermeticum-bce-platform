/* =========================================================
   HBCE UI SYSTEM — HEADER/FOOTER INJECTOR (FULL REFAC)
   + IPR LOCK (no-translate, anti DPI)
   + MINIMAL INFRA NAV (Activate=Entry, Create removed from top nav)
   ========================================================= */

(function () {
  "use strict";

  /* -------------------------------------------------------
     UTILS
  ------------------------------------------------------- */
  function esc(s){
    return String(s)
      .replaceAll("&","&amp;")
      .replaceAll("<","&lt;")
      .replaceAll(">","&gt;")
      .replaceAll('"',"&quot;")
      .replaceAll("'","&#39;");
  }

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
    if(target==="/") return here==="/";
    return here===target || here.startsWith(target+"/");
  }

  /* -------------------------------------------------------
     IPR LOCK — anti translation
  ------------------------------------------------------- */
  function IPR(){
    return `<span class="notranslate" translate="no"><code>IPR</code></span>`;
  }

  /* -------------------------------------------------------
     BRAND (CANONICAL)
  ------------------------------------------------------- */
  const BRAND = {
    mark: "HERMETICUM - BLINDATA · COMPUTABILE · EVOLUTIVA",
    entity: "HERMETICUM B.C.E. S.r.l."
  };

  /* -------------------------------------------------------
     NAV ITEMS (MINIMAL INFRASTRUCTURE)
     - Create is NOT top-level.
     - Create Release must be reached via /activate/ CTAs.
  ------------------------------------------------------- */
  const NAV = [
    {label:"Home", href:"/hermeticum-bce-platform/"},
    {label:`Activate ${IPR()} (Entry)`, href:"/hermeticum-bce-platform/activate/"},
    {label:"Verify", href:"/hermeticum-bce-platform/verify/"},
    {label:"Registry", href:"/hermeticum-bce-platform/registry/"},
    {label:"Pricing", href:"/hermeticum-bce-platform/pricing/"},
    {label:"About", href:"/hermeticum-bce-platform/about/"}
  ];

  /* -------------------------------------------------------
     BUILD NAV LINK
  ------------------------------------------------------- */
  function buildNavItem(item){
    const active = isActive(item.href);
    const cls = active ? "hbce-nav__link is-active" : "hbce-nav__link";
    const aria = active ? ' aria-current="page"' : "";
    return `<a class="${cls}" href="${esc(item.href)}"${aria}>${item.label}</a>`;
  }

  /* -------------------------------------------------------
     HEADER
  ------------------------------------------------------- */
  function headerHTML(){
    const nav = NAV.map(buildNavItem).join("");

    return `
<header class="hbce-header">
  <div class="hbce-header__inner hbce-container">

    <a class="hbce-brand" href="/hermeticum-bce-platform/">
      <span class="hbce-brand__mark">${esc(BRAND.mark)}</span>
      <span class="hbce-brand__entity">${esc(BRAND.entity)}</span>
    </a>

    <nav class="hbce-nav">${nav}</nav>

    <button class="hbce-nav__toggle" aria-label="menu" aria-expanded="false">
      <span></span><span></span><span></span>
    </button>

  </div>
</header>`;
  }

  /* -------------------------------------------------------
     FOOTER (NO CREATE LINK)
  ------------------------------------------------------- */
  function footerHTML(){
    const year = new Date().getFullYear();
    return `
<footer class="hbce-footer">
  <div class="hbce-footer__inner hbce-container">

    <div class="hbce-footer__cols">

      <div>
        <div class="hbce-footer__mark">${esc(BRAND.mark)}</div>
        <div class="hbce-footer__entity">${esc(BRAND.entity)}</div>
        <div class="hbce-footer__meta">
          EU-first · Audit-first · Fail-closed · Hash-only · Append-only
        </div>
      </div>

      <div>
        <strong>Core</strong><br>
        <a href="/hermeticum-bce-platform/activate/">Activate ${IPR()} (Entry)</a><br>
        <a href="/hermeticum-bce-platform/verify/">Verify</a><br>
        <a href="/hermeticum-bce-platform/registry/">Registry</a><br>
        <a href="/hermeticum-bce-platform/pricing/">Pricing</a>
      </div>

      <div>
        <strong>Company</strong><br>
        <a href="/hermeticum-bce-platform/about/">About</a><br>
        <a href="/hermeticum-bce-platform/">Home</a>
      </div>

    </div>

    <div class="hbce-footer__bottom">
      © ${year} ${esc(BRAND.entity)}
    </div>

  </div>
</footer>`;
  }

  /* -------------------------------------------------------
     MOBILE NAV
  ------------------------------------------------------- */
  function navToggle(){
    const btn = document.querySelector(".hbce-nav__toggle");
    const nav = document.querySelector(".hbce-nav");
    if(!btn || !nav) return;

    btn.onclick = ()=>{
      const open = nav.classList.toggle("open");
      btn.setAttribute("aria-expanded", open ? "true":"false");
    };
  }

  /* -------------------------------------------------------
     INJECT
  ------------------------------------------------------- */
  function inject(){
    const h = document.querySelector('[data-hbce="header"]');
    if(h) h.innerHTML = headerHTML();

    const f = document.querySelector('[data-hbce="footer"]');
    if(f) f.innerHTML = footerHTML();

    navToggle();
  }

  if(document.readyState==="loading"){
    document.addEventListener("DOMContentLoaded", inject);
  }else{
    inject();
  }

})();
