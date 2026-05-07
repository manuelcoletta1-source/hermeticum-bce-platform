/* =========================================================
   HBCE DEMO NODE — STATIC FAIL-CLOSED EXECUTION GATE
   - Browser-only
   - Local state only
   - No backend
   - No upload
   - No tracking
   - No public data custody
   - Deterministic SHA-256 via WebCrypto
   - Append-only local ledger
   - Tamper test
   - Gated RUN execution
   ========================================================= */

(function () {
  "use strict";

  const $ = (id) => document.getElementById(id);

  const STATE = {
    proto: "HBCE-DEMO-NODE-v2",
    kind: "STATIC_FAIL_CLOSED_EXECUTION_GATE",
    issuer_label: "HBCE_PUBLIC_ISSUER_001",
    organization: "HERMETICUM B.C.E. S.r.l.",
    jurisdiction: "EU",
    policy: [
      "HASH_ONLY",
      "APPEND_ONLY",
      "FAIL_CLOSED",
      "EU_FIRST",
      "AUDIT_FIRST",
      "GDPR_MIN",
      "NO_PUBLIC_DATA_CUSTODY"
    ],
    ipr: null,
    ledger: [],
    head_hash: null,
    last_verification: null,
    tampered: false,
    gate: "DENIED"
  };

  function isObject(value) {
    return value && typeof value === "object" && !Array.isArray(value);
  }

  function canonicalize(value) {
    if (Array.isArray(value)) {
      return "[" + value.map(canonicalize).join(",") + "]";
    }

    if (isObject(value)) {
      const keys = Object.keys(value).sort();

      return "{" + keys
        .filter((key) => typeof value[key] !== "undefined")
        .map((key) => JSON.stringify(key) + ":" + canonicalize(value[key]))
        .join(",") + "}";
    }

    return JSON.stringify(value);
  }

  async function sha256Hex(text) {
    const encoded = new TextEncoder().encode(String(text || ""));
    const digest = await crypto.subtle.digest("SHA-256", encoded);
    const bytes = Array.from(new Uint8Array(digest));

    return bytes.map((byte) => byte.toString(16).padStart(2, "0")).join("");
  }

  function nowIso() {
    return new Date().toISOString();
  }

  function clean(value) {
    return String(value || "").trim();
  }

  function setText(id, value) {
    const element = $(id);
    if (element) element.textContent = String(value);
  }

  function setStatus(kind, text, note) {
    const dot = $("stDot");
    const status = $("stText");
    const statusNote = $("stNote");

    if (dot) {
      dot.className =
        "demo-dot" +
        (kind === "good" ? " good" : kind === "bad" ? " bad" : kind === "warn" ? " warn" : "");
    }

    if (status) status.textContent = text;
    if (statusNote) statusNote.textContent = note || "";
  }

  function shortHash(hash) {
    if (!hash) return "—";
    if (hash.length <= 18) return hash;
    return hash.slice(0, 12) + "…" + hash.slice(-6);
  }

  function escapeHtml(value) {
    return String(value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#39;");
  }

  function setGate(value) {
    STATE.gate = value;
    setText("gateState", value);
  }

  function updateUI() {
    setText("iprId", STATE.ipr?.id || "—");
    setText("headHash", STATE.head_hash || "—");
    setText("ledgerCount", String(STATE.ledger.length));
    setText("gateState", STATE.gate);

    const btnEmit = $("btnEmit");
    const btnVerify = $("btnVerify");
    const btnTamper = $("btnTamper");
    const btnExport = $("btnExport");
    const btnRun = $("btnRun");

    if (btnEmit) btnEmit.disabled = !STATE.ipr;
    if (btnVerify) btnVerify.disabled = !STATE.ipr;
    if (btnTamper) btnTamper.disabled = !(STATE.ipr && STATE.ledger.length >= 2 && !STATE.tampered);
    if (btnExport) {
      btnExport.disabled = !(
        STATE.ipr &&
        STATE.last_verification &&
        STATE.last_verification.status === "VALID"
      );
    }

    const isValid = Boolean(
      STATE.last_verification && STATE.last_verification.status === "VALID"
    );

    if (btnRun) btnRun.disabled = !(STATE.ipr && isValid);

    renderLedgerRows();
    setText("debug", JSON.stringify(STATE, null, 2));
  }

  function renderLedgerRows() {
    const body = $("ledgerRows");
    if (!body) return;

    body.innerHTML = "";

    if (STATE.ledger.length === 0) {
      const row = document.createElement("tr");
      const cell = document.createElement("td");

      cell.colSpan = 4;
      cell.className = "demo-small";
      cell.textContent = "No entries yet.";

      row.appendChild(cell);
      body.appendChild(row);
      return;
    }

    for (const entry of STATE.ledger) {
      const row = document.createElement("tr");

      const indexCell = document.createElement("td");
      indexCell.textContent = String(entry.i);

      const timestampCell = document.createElement("td");
      timestampCell.textContent = entry.ts;

      const eventCell = document.createElement("td");
      const tamperLabel = STATE.tampered && entry._tampered ? " · TAMPERED" : "";
      eventCell.innerHTML =
        `<code class="demo-code">${escapeHtml(entry.type)}</code>` +
        `<span class="demo-small"> · prev=${shortHash(entry.prev_hash)}${tamperLabel}</span>`;

      const hashCell = document.createElement("td");
      hashCell.innerHTML = `<code class="demo-code">${shortHash(entry.hash)}</code>`;

      row.appendChild(indexCell);
      row.appendChild(timestampCell);
      row.appendChild(eventCell);
      row.appendChild(hashCell);

      body.appendChild(row);
    }
  }

  async function appendEntry(type, payload) {
    if (!STATE.ipr) {
      setGate("DENIED");
      STATE.last_verification = {
        status: "INVALID",
        reason: "MISSING_IDENTITY",
        at_ts: nowIso()
      };
      setStatus("bad", "Status: DENIED", "Missing identity. Fail-closed.");
      updateUI();
      return;
    }

    const entryWithoutHash = {
      i: STATE.ledger.length + 1,
      ts: nowIso(),
      type,
      payload,
      prev_hash: STATE.head_hash || "GENESIS"
    };

    const canonical = canonicalize(entryWithoutHash);
    const hash = await sha256Hex(canonical);

    const entry = {
      ...entryWithoutHash,
      hash
    };

    STATE.ledger.push(entry);
    STATE.head_hash = hash;

    setStatus("", "Status: APPENDED", `Entry #${entry.i} added to local append-only ledger.`);
    updateUI();
  }

  async function verifyLedger() {
    setGate("DENIED");

    if (!STATE.ipr) {
      STATE.last_verification = {
        status: "INVALID",
        reason: "MISSING_IDENTITY",
        at_ts: nowIso()
      };
      setStatus("bad", "Status: DENIED", "Missing identity. Fail-closed.");
      updateUI();
      return STATE.last_verification;
    }

    if (STATE.ledger.length === 0) {
      STATE.last_verification = {
        status: "VALID",
        reason: "IDENTITY_PRESENT_EMPTY_LEDGER",
        at_ts: nowIso()
      };

      setGate("AUTHORIZED");
      setStatus("good", "Status: VERIFIED", "Identity present. Empty local ledger accepted for demo.");
      updateUI();
      return STATE.last_verification;
    }

    let previousHash = "GENESIS";

    for (const entry of STATE.ledger) {
      if (entry.prev_hash !== previousHash) {
        STATE.last_verification = {
          status: "INVALID",
          reason: "CHAIN_BREAK",
          at_ts: nowIso(),
          at_entry: entry.i
        };

        setGate("DENIED");
        setStatus("bad", "Status: DENIED", "Chain break detected. Fail-closed.");
        updateUI();
        return STATE.last_verification;
      }

      const entryWithoutHash = {
        i: entry.i,
        ts: entry.ts,
        type: entry.type,
        payload: entry.payload,
        prev_hash: entry.prev_hash
      };

      const recomputed = await sha256Hex(canonicalize(entryWithoutHash));

      if (recomputed !== entry.hash) {
        STATE.last_verification = {
          status: "INVALID",
          reason: "HASH_MISMATCH",
          at_ts: nowIso(),
          at_entry: entry.i
        };

        setGate("DENIED");
        setStatus("bad", "Status: DENIED", "Hash mismatch detected. Fail-closed.");
        updateUI();
        return STATE.last_verification;
      }

      previousHash = entry.hash;
    }

    const last = STATE.ledger[STATE.ledger.length - 1];

    if (STATE.head_hash !== last.hash) {
      STATE.last_verification = {
        status: "INVALID",
        reason: "HEAD_MISMATCH",
        at_ts: nowIso()
      };

      setGate("DENIED");
      setStatus("bad", "Status: DENIED", "Head mismatch detected. Fail-closed.");
      updateUI();
      return STATE.last_verification;
    }

    STATE.last_verification = {
      status: "VALID",
      reason: "LOCAL_LEDGER_OK",
      at_ts: nowIso(),
      head_hash: STATE.head_hash
    };

    setGate("AUTHORIZED");
    setStatus("good", "Status: VERIFIED", "Deterministic local integrity match.");
    updateUI();
    return STATE.last_verification;
  }

  function randomId(prefix) {
    const cryptoObject = typeof globalThis !== "undefined" ? globalThis.crypto : undefined;

    if (cryptoObject && typeof cryptoObject.randomUUID === "function") {
      return `${prefix}-${cryptoObject.randomUUID().replace(/-/g, "").slice(0, 16)}`.toUpperCase();
    }

    if (cryptoObject && typeof cryptoObject.getRandomValues === "function") {
      const bytes = new Uint8Array(8);
      cryptoObject.getRandomValues(bytes);

      const entropy = Array.from(bytes)
        .map((byte) => byte.toString(16).padStart(2, "0"))
        .join("");

      return `${prefix}-${entropy}`.toUpperCase();
    }

    const entropy = `${Math.random().toString(16).slice(2)}${Date.now().toString(16)}`.slice(0, 16);
    return `${prefix}-${entropy}`.toUpperCase();
  }

  async function initIdentity() {
    STATE.ipr = {
      id: randomId("IPR-DEMO"),
      created_ts: nowIso(),
      subject_label: "HBCE_DEMO_NODE_OPERATOR"
    };

    STATE.ledger = [];
    STATE.head_hash = null;
    STATE.last_verification = null;
    STATE.tampered = false;

    setGate("DENIED");
    setStatus("", "Status: IDENTITY INITIALIZED", "Demo identity created locally.");
    updateUI();

    await appendEntry("IDENTITY_INIT", {
      ipr_label: STATE.ipr.id,
      subject_label: STATE.ipr.subject_label,
      note: "Demo identity initialized locally. No public data custody."
    });

    await appendEntry("EXECUTION_EVENT", {
      op: "PRECHECK",
      gate: "IDENTITY_REQUIRED",
      details: "Initial local precheck event appended."
    });

    await verifyLedger();
  }

  async function emitEvent() {
    await appendEntry("EXECUTION_EVENT", {
      op: "PLAN",
      gate: "IDENTITY_REQUIRED",
      details: "Planning step appended to local demo ledger."
    });
  }

  async function verify() {
    await verifyLedger();
  }

  async function run() {
    const verification = await verifyLedger();

    if (!verification || verification.status !== "VALID") {
      setGate("DENIED");
      setStatus("bad", "Status: RUN DENIED", "Gate is fail-closed. Verification is not valid.");
      updateUI();
      return;
    }

    await appendEntry("EXECUTION_RUN", {
      op: "RUN_DEMO_ACTION",
      gate: "AUTHORIZED",
      decision: "ALLOW",
      note: "Local demo execution permitted after deterministic verification."
    });

    await verifyLedger();

    setStatus("good", "Status: RUN AUTHORIZED", "Execution event appended under valid local gate.");
    updateUI();
  }

  function tamper() {
    if (!STATE.ipr || STATE.ledger.length < 2 || STATE.tampered) return;

    const target = STATE.ledger[1];

    if (!target || !target.payload || typeof target.payload !== "object") return;

    target.payload.details = "TAMPERED_PAYLOAD_MODIFICATION";
    target._tampered = true;
    STATE.tampered = true;

    setGate("DENIED");
    setStatus("warn", "Status: TAMPER APPLIED", "Ledger mutated without hash recomputation. Verify/RUN must fail.");
    updateUI();
  }

  function exportReceipt() {
    if (!STATE.ipr || !STATE.last_verification || STATE.last_verification.status !== "VALID") {
      setStatus("bad", "Status: DENIED", "Cannot export receipt unless node is valid.");
      updateUI();
      return;
    }

    const receipt = {
      proto: "HBCE-DEMO-NODE-RECEIPT-v2",
      kind: "STATIC_DEMO_NODE_RECEIPT",
      issuer_label: STATE.issuer_label,
      organization: STATE.organization,
      jurisdiction: STATE.jurisdiction,
      policy: STATE.policy,
      generated_ts: nowIso(),
      ipr: {
        id: STATE.ipr.id,
        subject_label: STATE.ipr.subject_label,
        created_ts: STATE.ipr.created_ts
      },
      ledger: {
        entries: STATE.ledger.length,
        head_hash: STATE.head_hash
      },
      verification: STATE.last_verification,
      gate: STATE.gate,
      boundary:
        "Static local demo receipt. Not legal certification, not identity certification, not public authority approval."
    };

    const blob = new Blob([JSON.stringify(receipt, null, 2)], {
      type: "application/json"
    });

    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");

    anchor.href = url;
    anchor.download = `HBCE_DEMO_NODE_RECEIPT_${STATE.ipr.id}_${Date.now()}.json`;

    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();

    URL.revokeObjectURL(url);

    setStatus("good", "Status: RECEIPT EXPORTED", "Local JSON receipt downloaded.");
    updateUI();
  }

  function reset() {
    STATE.ipr = null;
    STATE.ledger = [];
    STATE.head_hash = null;
    STATE.last_verification = null;
    STATE.tampered = false;

    setGate("DENIED");
    setStatus("", "Status: IDENTITY NOT INITIALIZED", "");
    updateUI();
  }

  window.HBCE = {
    initIdentity,
    emitEvent,
    verify,
    run,
    exportReceipt,
    tamper,
    reset
  };

  setGate("DENIED");
  setStatus("", "Status: IDENTITY NOT INITIALIZED", "");
  updateUI();
})();
