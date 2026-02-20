/* HBCE Lab Status — CSP-safe (no inline)
   Local-only signals:
   - HBCE_JOKER_ID_V1 (identity kid)
   - HBCE_LOCAL_LEDGER_V1 (ledger chain length + tip)
   - HBCE_LAST_PACK_ROOT (last verified root)
   - HBCE_LAST_PACK_ROOT_TS (broadcast trigger)
   Updates LAB status panel and listens for storage events.
*/
(function(){
  const KEY_ID = "HBCE_JOKER_ID_V1";
  const KEY_LEDGER = "HBCE_LOCAL_LEDGER_V1";
  const KEY_LAST_ROOT = "HBCE_LAST_PACK_ROOT";
  const KEY_LAST_ROOT_TS = "HBCE_LAST_PACK_ROOT_TS";

  const $ = (id)=>document.getElementById(id);

  function safeJsonParse(s){ try { return JSON.parse(s); } catch { return null; } }
  function shortHex(h){
    if(!h || typeof h !== "string") return "—";
    if(h === "GENESIS") return "GENESIS";
    return (h.length > 18) ? (h.slice(0,10) + "…" + h.slice(-6)) : h;
  }

  function render(){
    const elLedger = $("mLedger");
    const elKid = $("mKid");
    const elTip = $("mTip");
    const elPackRoot = $("mPackRoot");

    const sysBox = $("sysBox");
    const sysStatus = $("sysStatus");
    const sysRoot = $("sysRoot");

    // Identity
    const idObj = safeJsonParse(localStorage.getItem(KEY_ID) || "");
    if(elKid) elKid.textContent = idObj?.kid ? idObj.kid : "—";

    // Ledger
    const ledgerObj = safeJsonParse(localStorage.getItem(KEY_LEDGER) || "");
    const chain = Array.isArray(ledgerObj?.chain) ? ledgerObj.chain : [];
    if(elLedger) elLedger.textContent = String(chain.length);
    const tip = chain.length ? chain[chain.length - 1].chain_hash : "GENESIS";
    if(elTip) elTip.textContent = shortHex(tip);

    // Root
    const lastRoot = (localStorage.getItem(KEY_LAST_ROOT) || "").trim();
    if(elPackRoot) elPackRoot.textContent = shortHex(lastRoot);

    if(sysBox && sysStatus && sysRoot){
      if(lastRoot){
        sysBox.classList.remove("hbce-status--warn");
        sysBox.classList.add("hbce-status--ok");
        sysStatus.textContent = "VERIFIED";
        sysStatus.classList.remove("warn");
        sysStatus.classList.add("ok");
        sysRoot.textContent = lastRoot.slice(0,32) + "...";
      }else{
        sysBox.classList.remove("hbce-status--ok");
        sysBox.classList.add("hbce-status--warn");
        sysStatus.textContent = "NO LOCAL PROOF";
        sysStatus.classList.remove("ok");
        sysStatus.classList.add("warn");
        sysRoot.textContent = "none";
      }
    }
  }

  function main(){
    render();
    window.addEventListener("storage", (e)=>{
      if(e.key === KEY_LAST_ROOT || e.key === KEY_LAST_ROOT_TS){
        render();
      }
    });
  }

  if(document.readyState === "loading"){
    document.addEventListener("DOMContentLoaded", main);
  } else {
    main();
  }
})();
