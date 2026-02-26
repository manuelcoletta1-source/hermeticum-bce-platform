/* =========================================================
   HBCE DEMO NODE — APPEND ONLY + FAIL CLOSED (STATIC)
   + TAMPER TEST
   - Browser-only, no backend
   - Deterministic SHA-256 via WebCrypto
   ========================================================= */

(function(){
  "use strict";

  const $ = (id) => document.getElementById(id);

  const STATE = {
    proto: "HBCE-DEMO-NODE-v1",
    kind: "AUTONOMOUS_IDENTITY_EXECUTION_NODE",
    issuer: "HERMETICUM B.C.E. S.r.l.",
    jurisdiction: "EU",
    policy: ["HASH_ONLY","APPEND_ONLY","FAIL_CLOSED","UE_FIRST","AUDIT_FIRST","GDPR_MIN"],
    ipr: null,               // { id, created_ts }
    ledger: [],              // entries with {i, ts, type, payload, prev_hash, hash}
    head_hash: null,         // last hash
    last_verification: null, // {status, reason, at_ts, ...}
    tampered: false
  };

  /* -----------------------
     Canonical JSON (stable)
  ----------------------- */
  function isObj(x){ return x && typeof x === "object" && !Array.isArray(x); }

  function canonicalize(value){
    if(Array.isArray(value)){
      return "[" + value.map(canonicalize).join(",") + "]";
    }
    if(isObj(value)){
      const keys = Object.keys(value).sort();
      return "{" + keys.map(k => JSON.stringify(k)+":"+canonicalize(value[k])).join(",") + "}";
    }
    return JSON.stringify(value);
  }

  async function sha256Hex(str){
    const enc = new TextEncoder().encode(str);
    const buf = await crypto.subtle.digest("SHA-256", enc);
    const bytes = Array.from(new Uint8Array(buf));
    return bytes.map(b => b.toString(16).padStart(2,"0")).join("");
  }

  function nowIso(){
    return new Date().toISOString();
  }

  function setStatus(kind, text, note){
    const dot = $("stDot");
    const st = $("stText");
    const nt = $("stNote");
    dot.className = "dot" + (kind==="good" ? " good" : kind==="bad" ? " bad" : kind==="warn" ? " warn" : "");
    st.textContent = text;
    nt.textContent = note || "";
  }

  function short(h){
    if(!h) return "—";
    if(h.length <= 16) return h;
    return h.slice(0,12) + "…" + h.slice(-6);
  }

  function escapeHtml(s){
    return String(s)
      .replaceAll("&","&amp;")
      .replaceAll("<","&lt;")
      .replaceAll(">","&gt;")
      .replaceAll('"',"&quot;")
      .replaceAll("'","&#39;");
  }

  function updateUI(){
    $("iprId").textContent = STATE.ipr?.id || "—";
    $("headHash").textContent = STATE.head_hash || "—";
    $("ledgerCount").textContent = String(STATE.ledger.length);

    $("btnEmit").disabled = !STATE.ipr;
    $("btnVerify").disabled = !STATE.ipr;
    $("btnTamper").disabled = !(STATE.ipr && STATE.ledger.length >= 2 && !STATE.tampered);
    $("btnExport").disabled = !(STATE.ipr && STATE.last_verification && STATE.last_verification.status === "VALID");

    // Ledger table
    const body = $("ledgerRows");
    body.innerHTML = "";
    if(STATE.ledger.length === 0){
      const tr = document.createElement("tr");
      const td = document.createElement("td");
      td.colSpan = 4;
      td.className = "small";
      td.textContent = "No entries yet.";
      tr.appendChild(td);
      body.appendChild(tr);
    }else{
      for(const e of STATE.ledger){
        const tr = document.createElement("tr");

        const tdI = document.createElement("td"); tdI.textContent = String(e.i);
        const tdT = document.createElement("td"); tdT.textContent = e.ts;
        const tdE = document.createElement("td");
        const extra = (STATE.tampered && e._tampered) ? " · TAMPERED" : "";
        tdE.innerHTML = `<code>${escapeHtml(e.type)}</code><span class="small"> · prev=${short(e.prev_hash)}${extra}</span>`;
        const tdH = document.createElement("td"); tdH.innerHTML = `<code>${short(e.hash)}</code>`;

        tr.appendChild(tdI);
        tr.appendChild(tdT);
        tr.appendChild(tdE);
        tr.appendChild(tdH);
        body.appendChild(tr);
      }
    }

    $("debug").textContent = JSON.stringify(STATE, null, 2);
  }

  async function appendEntry(type, payload){
    if(!STATE.ipr){
      setStatus("bad","Status: DENIED","Missing identity (fail-closed).");
      STATE.last_verification = { status:"INVALID", reason:"MISSING_IDENTITY", at_ts: nowIso() };
      updateUI();
      return;
    }

    const entryNoHash = {
      i: STATE.ledger.length + 1,
      ts: nowIso(),
      type,
      payload,
      prev_hash: STATE.head_hash || "GENESIS"
    };

    const canon = canonicalize(entryNoHash);
    const hash = await sha256Hex(canon);

    const entry = { ...entryNoHash, hash };
    STATE.ledger.push(entry);
    STATE.head_hash = hash;

    setStatus("", "Status: APPENDED", `Entry #${entry.i} added (append-only).`);
    updateUI();
  }

  async function verifyLedger(){
    if(!STATE.ipr){
      STATE.last_verification = { status:"INVALID", reason:"MISSING_IDENTITY", at_ts: nowIso() };
      setStatus("bad","Status: DENIED","Missing identity (fail-closed).");
      updateUI();
      return STATE.last_verification;
    }

    if(STATE.ledger.length === 0){
      STATE.last_verification = { status:"VALID", reason:"EMPTY_LEDGER_OK", at_ts: nowIso() };
      setStatus("good","Status: VERIFIED (VALID)","Identity present. Ledger empty is acceptable.");
      updateUI();
      return STATE.last_verification;
    }

    let prev = "GENESIS";
    for(const e of STATE.ledger){
      if(e.prev_hash !== prev){
        STATE.last_verification = { status:"INVALID", reason:"CHAIN_BREAK", at_ts: nowIso(), at_entry: e.i };
        setStatus("bad","Status: DENIED","Chain break detected (fail-closed).");
        updateUI();
        return STATE.last_verification;
      }

      const noHash = { i:e.i, ts:e.ts, type:e.type, payload:e.payload, prev_hash:e.prev_hash };
      const canon = canonicalize(noHash);
      const recomputed = await sha256Hex(canon);
      if(recomputed !== e.hash){
        STATE.last_verification = { status:"INVALID", reason:"HASH_MISMATCH", at_ts: nowIso(), at_entry: e.i };
        setStatus("bad","Status: DENIED","Hash mismatch detected (fail-closed).");
        updateUI();
        return STATE.last_verification;
      }

      prev = e.hash;
    }

    const last = STATE.ledger[STATE.ledger.length - 1];
    if(STATE.head_hash !== last.hash){
      STATE.last_verification = { status:"INVALID", reason:"HEAD_MISMATCH", at_ts: nowIso() };
      setStatus("bad","Status: DENIED","Head mismatch (fail-closed).");
      updateUI();
      return STATE.last_verification;
    }

    STATE.last_verification = { status:"VALID", reason:"LEDGER_OK", at_ts: nowIso(), head: STATE.head_hash };
    setStatus("good","Status: VERIFIED (VALID)","Deterministic integrity match.");
    updateUI();
    return STATE.last_verification;
  }

  function randomId(prefix){
    const a = Math.random().toString(16).slice(2);
    const b = Math.random().toString(16).slice(2);
    return `${prefix}-${a.slice(0,8)}${b.slice(0,8)}`.toUpperCase();
  }

  async function initIdentity(){
    STATE.ipr = { id: randomId("IPR-DEMO"), created_ts: nowIso() };
    STATE.ledger = [];
    STATE.head_hash = null;
    STATE.last_verification = null;
    STATE.tampered = false;

    setStatus("", "Status: IDENTITY INITIALIZED", "IPR created (demo). Execution can now be gated.");
    updateUI();

    await appendEntry("IDENTITY_INIT", {
      ipr_id: STATE.ipr.id,
      note: "Demo identity initialized; node ready."
    });

    // Add one more event so tamper test can work immediately
    await appendEntry("EXECUTION_EVENT", {
      op: "RUN_AUTONOMOUS_ACTION",
      gate: "IDENTITY_REQUIRED",
      details: "Initial execution event appended."
    });
  }

  async function emitEvent(){
    await appendEntry("EXECUTION_EVENT", {
      op: "RUN_AUTONOMOUS_ACTION",
      gate: "IDENTITY_REQUIRED",
      details: "Demo event appended to ledger."
    });
  }

  async function verify(){
    await verifyLedger();
  }

  function tamper(){
    // Tamper entry #2 payload WITHOUT recomputing its hash.
    // Must cause HASH_MISMATCH on verify.
    if(!STATE.ipr || STATE.ledger.length < 2 || STATE.tampered) return;

    const target = STATE.ledger[1]; // entry i=2
    if(!target || !target.payload || typeof target.payload !== "object") return;

    target.payload.details = "TAMPERED_PAYLOAD_MODIFICATION";
    target._tampered = true;
    STATE.tampered = true;

    setStatus("warn","Status: TAMPER APPLIED","Ledger mutated without hash recomputation. Verify must fail.");
    updateUI();
  }

  function exportReceipt(){
    if(!STATE.ipr || !STATE.last_verification || STATE.last_verification.status !== "VALID"){
      setStatus("bad","Status: DENIED","Cannot export receipt unless node is VALID.");
      updateUI();
      return;
    }

    const receipt = {
      proto: "HBCE-RECEIPT-v1",
      kind: "DEMO_NODE_RECEIPT",
      issuer: STATE.issuer,
      jurisdiction: STATE.jurisdiction,
      policy: STATE.policy,
      generated_ts: nowIso(),
      ipr: STATE.ipr,
      ledger: {
        entries: STATE.ledger.length,
        head_hash: STATE.head_hash
      },
      verification: STATE.last_verification
    };

    const blob = new Blob([JSON.stringify(receipt, null, 2)], { type:"application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `HBCE_RECEIPT_${STATE.ipr.id}_${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);

    setStatus("good","Status: RECEIPT EXPORTED","JSON receipt downloaded.");
    updateUI();
  }

  function reset(){
    STATE.ipr = null;
    STATE.ledger = [];
    STATE.head_hash = null;
    STATE.last_verification = null;
    STATE.tampered = false;

    setStatus("", "Status: IDENTITY NOT INITIALIZED", "");
    updateUI();
  }

  window.HBCE = { initIdentity, emitEvent, verify, exportReceipt, tamper, reset };

  setStatus("", "Status: IDENTITY NOT INITIALIZED", "");
  updateUI();

})();
