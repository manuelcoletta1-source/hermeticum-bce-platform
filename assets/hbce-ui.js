(function(){
  async function inject(selector, url){
    const el = document.querySelector(selector);
    if(!el) return;
    try{
      const res = await fetch(url, {cache:"no-store"});
      if(!res.ok) throw new Error("HTTP "+res.status);
      el.innerHTML = await res.text();
    }catch(e){
      el.innerHTML = "";
      console.warn("HBCE UI load failed:", url, e);
    }
  }

  document.addEventListener("DOMContentLoaded", async ()=>{
    const base = document.querySelector("base")?.getAttribute("href") || "/";
    const p = (x)=> (base.endsWith("/") ? base.slice(0,-1) : base) + x;

    await inject('[data-hbce="header"]', p('/partials/header.html'));
    await inject('[data-hbce="footer"]', p('/partials/footer.html'));
  });
})();
