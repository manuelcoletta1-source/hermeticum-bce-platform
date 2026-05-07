/* =========================================================
   HBCE LAB STATUS — LOCAL-ONLY STATUS HELPER
   - CSP-safe: no inline script dependency
   - Local browser state only
   - No upload
   - No tracking
   - No public data custody
   - Does not imply legal, institutional, identity, or registry validation
   ========================================================= */

(function () {
  "use strict";

  const KEY_ID = "HBCE_JOKER_ID_V1";
  const KEY_LEDGER = "HBCE_LOCAL_LEDGER_V1";
  const KEY_LAST_ROOT = "HBCE_LAST_PACK_ROOT";
  const KEY_LAST_ROOT_TS = "HBCE_LAST_PACK_ROOT_TS";

  const $ = (id) => document.getElementById(id);

  function clean(value) {
    return String(value || "").trim();
  }

  function safeJsonParse(value) {
    try {
      return JSON.parse(value);
    } catch {
      return null;
    }
  }

  function isHex64Plus(value) {
    return /^[0-9a-fA-F]{64,}$/.test(clean(value));
  }

  function isPublicLabel(value) {
    return /^[A-Za-z0-9_\-:.]{3,128}$/.test(clean(value));
  }

  function shortHash(value) {
    const raw = clean(value);

    if (!raw) return "—";
    if (raw === "GENESIS") return "GENESIS";

    return raw.length > 18 ? raw.slice(0, 10) + "…" + raw.slice(-6) : raw;
  }

  function setText(id, value) {
    const element = $(id);
    if (element) element.textContent = String(value);
  }

  function setStatusBox(kind, statusText, rootText) {
    const sysBox = $("sysBox");
    const sysStatus = $("sysStatus");
    const sysRoot = $("sysRoot");

    if (!sysBox || !sysStatus || !sysRoot) return;

    sysBox.classList.remove("hbce-status--ok", "hbce-status--warn", "hbce-status--fail");
    sysStatus.classList.remove("ok", "warn", "fail");

    if (kind === "ok") {
      sysBox.classList.add("hbce-status--ok");
      sysStatus.classList.add("ok");
    } else if (kind === "fail") {
      sysBox.classList.add("hbce-status--fail");
      sysStatus.classList.add("fail");
    } else {
      sysBox.classList.add("hbce-status--warn");
      sysStatus.classList.add("warn");
    }

    sysStatus.textContent = statusText;
    sysRoot.textContent = rootText;
  }

  function readLocalIdentity() {
    const idObject = safeJsonParse(localStorage.getItem(KEY_ID) || "");

    if (!idObject || typeof idObject !== "object") {
      return {
        kid: "—",
        status: "NO_LOCAL_IDENTITY"
      };
    }

    const kid = clean(idObject.kid);

    if (!kid || (!isPublicLabel(kid) && !isHex64Plus(kid))) {
      return {
        kid: "—",
        status: "LOCAL_IDENTITY_INVALID"
      };
    }

    return {
      kid,
      status: "LOCAL_IDENTITY_PRESENT"
    };
  }

  function readLocalLedger() {
    const ledgerObject = safeJsonParse(localStorage.getItem(KEY_LEDGER) || "");
    const chain = Array.isArray(ledgerObject && ledgerObject.chain) ? ledgerObject.chain : [];

    const tip = chain.length && chain[chain.length - 1] && chain[chain.length - 1].chain_hash
      ? clean(chain[chain.length - 1].chain_hash)
      : "GENESIS";

    return {
      length: chain.length,
      tip
    };
  }

  function readLocalPackRoot() {
    const root = clean(localStorage.getItem(KEY_LAST_ROOT) || "").toLowerCase();
    const timestamp = clean(localStorage.getItem(KEY_LAST_ROOT_TS) || "");

    if (!root) {
      return {
        root: "",
        timestamp,
        status: "NO_LOCAL_PROOF"
      };
    }

    if (!isHex64Plus(root)) {
      return {
        root: "",
        timestamp,
        status: "LOCAL_PROOF_INVALID"
      };
    }

    return {
      root,
      timestamp,
      status: "LOCAL_PROOF_PRESENT"
    };
  }

  function render() {
    const localIdentity = readLocalIdentity();
    const localLedger = readLocalLedger();
    const localRoot = readLocalPackRoot();

    setText("mKid", localIdentity.kid);
    setText("mLedger", localLedger.length);
    setText("mTip", shortHash(localLedger.tip));
    setText("mPackRoot", shortHash(localRoot.root));

    if (localRoot.status === "LOCAL_PROOF_PRESENT") {
      setStatusBox(
        "ok",
        "LOCAL PROOF PRESENT",
        localRoot.root.slice(0, 32) + "..."
      );
      return;
    }

    if (localRoot.status === "LOCAL_PROOF_INVALID") {
      setStatusBox(
        "fail",
        "LOCAL PROOF INVALID",
        "invalid local hash"
      );
      return;
    }

    setStatusBox(
      "warn",
      "NO LOCAL PROOF",
      "none"
    );
  }

  function main() {
    document.documentElement.setAttribute("data-hbce-lab-status", "local-only");
    document.documentElement.setAttribute("data-hbce-data-custody", "local-browser-only");

    render();

    window.addEventListener("storage", (event) => {
      if (
        event.key === KEY_LAST_ROOT ||
        event.key === KEY_LAST_ROOT_TS ||
        event.key === KEY_ID ||
        event.key === KEY_LEDGER
      ) {
        render();
      }
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", main, { once: true });
  } else {
    main();
  }
})();
