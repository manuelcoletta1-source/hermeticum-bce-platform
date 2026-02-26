/* =========================================================
   HBCE NAV INJECTOR — CANONICAL
   - Uniform header/footer across all pages
   - Active link highlight
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
    if(target==="/") return here==="/";
    return here===target || here.startsWith(target + "/");
  }

  const links = [
    { href: "/", label: "Home" },
    { href: "/about/", label: "About" },
    { href: "/pricing/", label: "Pricing" },
    { href: "/contact/", label: "Intake" }
  ];

  const header = document.createElement("header");
  header.className = "hbce-header";
  header.innerHTML = `
    <div class="hbce-header__row">
      <a class="hbce-brand" href="/">
        <strong>HBCE</strong>
        <span>Operational Identity Infrastructure</span>
      </a>
      <nav class="hbce-nav">
        ${links.map(l => `<a href="${l.href}" data-href="${l.href}">${l.label}</a>`).join("")}
      </nav>
    </div>
  `;

  const footer = document.createElement("footer");
  footer.className = "hbce-footer";
  footer.innerHTML = `
    <div class="hbce-footer__row hbce-container" style="padding-top:0;padding-bottom:0">
      <div>HERMETICUM - BLINDATA · COMPUTABILE · EVOLUTIVA<br><span class="hbce-muted">HERMETICUM B.C.E. S.r.l.</span></div>
      <div class="hbce-footer__links">
        <a href="/about/">About</a>
        <a href="/pricing/">Pricing</a>
        <a href="/contact/">Intake</a>
      </div>
    </div>
  `;

  document.body.prepend(header);
  document.body.append(footer);

  // active link
  Array.from(header.querySelectorAll("a[data-href]")).forEach(a=>{
    if(isActive(a.getAttribute("data-href"))){
      a.classList.add("is-active");
    }
  });
})();
