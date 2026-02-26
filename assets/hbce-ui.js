/* =========================================================
   HBCE UI SYSTEM — GLOBAL INJECTOR (CANONICAL + BASE-PATH AWARE)
   - Safe DOM injection (no body.innerHTML rewrite)
   - GitHub Pages project site support (/repo-name/...)
   - Canonical classes only: hbce-header, hbce-header__row, hbce-brand, hbce-nav, hbce-container, hbce-main, hbce-footer
   - Active link highlight (.is-active)
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

  function ensureMainStructure(){
    // If the page already has hbce-container/hbce-main, do nothing.
    const existingMain = document.querySelector(".hbce-main");
    const existingContainer = document.querySelector(".hbce-container");

    if(existingMain && existingContainer) return;

    // Otherwise wrap all body children (except injected header/footer) into container/main.
    const container = document.createElement("div");
    container.className = "hbce-container";

    const main = document.createElement("main");
    main.className = "hbce-main";

    // Move nodes into main (preserve scripts, listeners attached to nodes remain)
    const body = document.body;
    const toMove = [];
    for(const node of Array.from(body.childNodes)){
      if(node.nodeType === 1){
        const el = /** @type {HTMLElement} */ (node);
        if(el.matches(".hbce-header, .hbce-footer")) continue;
      }
      toMove.push(node);
    }
    toMove.forEach(n => main.appendChild(n));
    container.appendChild(main);
    body.appendChild(container);
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

    // HEADER (canonical)
    const header = document.createElement("header");
    header.className = "hbce-header";
    header.innerHTML = `
      <div class="hbce-header__row">
        <a class="hbce-brand" href="${join(base, "/")}">
          <strong>HBCE</strong>
          <span>HERMETICUM - BLINDATA · COMPUTABILE · EVOLUTIVA</span>
        </a>
        <nav class="hbce-nav" aria-label="Primary">
          ${navItems.map(([label, href]) => {
            const full = join(base, href);
            return `<a href="${full}" data-href="${full}">${label}</a>`;
          }).join("")}
        </nav>
      </div>
    `;

    // FOOTER (canonical)
    const footer = document.createElement("footer");
    footer.className = "hbce-footer";
    footer.innerHTML = `
      <div class="hbce-footer__row">
        <div>
          HERMETICUM - BLINDATA · COMPUTABILE · EVOLUTIVA<br>
          <span class="hbce-muted">HERMETICUM B.C.E. S.r.l.</span>
        </div>
        <div class="hbce-footer__links">
          <a href="${join(base, "/about/")}">About</a>
          <a href="${join(base, "/pricing/")}">Pricing</a>
          <a href="${join(base, "/contact/")}">Contact</a>
        </div>
      </div>
    `;

    // Inject header at top of body (safe)
    document.body.insertAdjacentElement("afterbegin", header);

    // Ensure we have container/main structure (uniform layout)
    ensureMainStructure();

    // Inject footer at end of body (safe)
    document.body.insertAdjacentElement("beforeend", footer);

    // Active link highlight
    const links = Array.from(header.querySelectorAll("a[data-href]"));
    links.forEach(a => {
      const href = a.getAttribute("data-href") || a.getAttribute("href") || "/";
      if(isActive(href)) a.classList.add("is-active");
    });
  }

  if(document.readyState === "loading"){
    document.addEventListener("DOMContentLoaded", inject);
  }else{
    inject();
  }
})();
