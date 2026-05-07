/* =========================================================
   HBCE OPERATOR JS — R&D BOUNDARY CHECK
   - Registry v3 public proof lookup
   - payload_sha256 only
   - no operator authorization
   - no legal license validation
   - no public authority approval
   - fail-closed on invalid registry state
   ========================================================= */

(function () {
  "use strict";

  const REGISTRY_URL = "/hermeticum-bce-platform/registry/registry.json";
  const EXPECTED_PROTO = "HBCE-REGISTRY-v3";
  const EXPECTED_FAILURE_MODE = "FAIL_CLOSED";
  const EXPECTED_PUBLIC_DATA = "HASH_ONLY";

  const $ = (id) => document.getElementById(id);

  function clean(value) {
    return String(value || "").trim();
  }

  function stripShaPrefix(value) {
    return clean(value).toLowerCase().replace(/^sha256:/, "");
  }

  function isHex64(value) {
    return /^[a-f0-9]{64}$/.test(stripShaPrefix(value));
  }

  function normalizeSha256(value) {
    const stripped = stripShaPrefix(value);
    return stripped ? "sha256:" + stripped : "";
  }

  function setStatus(html) {
    const status = $("status");
    if (status) status.innerHTML = html;
  }

  function setPanelVisible(visible) {
    const panel = $("operator_panel");
    if (panel) panel.style.display = visible ? "block" : "none";
  }

  function validateRegistry(registry) {
    if (!registry || typeof registry !== "object" || Array.isArray(registry)) {
      return "REGISTRY_INVALID_OBJECT";
    }

    if (registry.proto !== EXPECTED_PROTO) {
      return "REGISTRY_PROTO_MISMATCH";
    }

    if (!registry.rules || typeof registry.rules !== "object" || Array.isArray(registry.rules)) {
      return "REGISTRY_RULES_MISSING";
    }

    if (registry.rules.failure_mode !== EXPECTED_FAILURE_MODE) {
      return "REGISTRY_FAILURE_MODE_MISMATCH";
    }

    if (registry.rules.public_data !== EXPECTED_PUBLIC_DATA) {
      return "REGISTRY_PUBLIC_DATA_MISMATCH";
    }

    if (!Array.isArray(registry.entries)) {
      return "REGISTRY_ENTRIES_MISSING";
    }

    for (let index = 0; index < registry.entries.length; index += 1) {
      const entry = registry.entries[index];

      if (!entry || typeof entry !== "object" || Array.isArray(entry)) {
        return "REGISTRY_ENTRY_INVALID_OBJECT_" + index;
      }

      if (!isHex64(entry.payload_sha256)) {
        return "REGISTRY_ENTRY_INVALID_PAYLOAD_SHA256_" + index;
      }

      if ("name" in entry || "nickname" in entry || "territory" in entry || "operator_sha256" in entry) {
        return "REGISTRY_ENTRY_LEGACY_PUBLIC_FIELD_" + index;
      }
    }

    return "";
  }

  async function loadRegistry() {
    const response = await fetch(REGISTRY_URL, { cache: "no-store" });

    if (!response.ok) {
      throw new Error("REGISTRY_FETCH_FAILED_HTTP_" + response.status);
    }

    const registry = await response.json();
    const validationError = validateRegistry(registry);

    if (validationError) {
      throw new Error(validationError);
    }

    return registry;
  }

  function matchEntry(registry, hash) {
    const normalized = normalizeSha256(hash);

    return registry.entries.find((entry) => {
      return normalizeSha256(entry.payload_sha256) === normalized;
    }) || null;
  }

  async function check() {
    const input = $("ipr_hash");
    const rawHash = input ? input.value : "";
    const payloadSha256 = normalizeSha256(rawHash);

    setPanelVisible(false);

    if (!isHex64(payloadSha256)) {
      setStatus(
        'Status: <strong>INVALID</strong> — payload_sha256 must be a 64-character SHA-256 value.'
      );
      return;
    }

    setStatus("Status: checking public registry…");

    try {
      const registry = await loadRegistry();
      const match = matchEntry(registry, payloadSha256);

      if (!match) {
        setStatus(
          'Status: <strong>NO_PUBLIC_RECORD</strong> — no public registry match was found. Fail-closed.'
        );
        return;
      }

      setStatus(
        'Status: <strong>PUBLIC_RECORD_PRESENT</strong> — public proof commitment found. This does not create operator authorization.'
      );

      setPanelVisible(true);
    } catch (error) {
      setStatus(
        'Status: <strong>NON_OPERATIONAL</strong> — registry unavailable or invalid. Fail-closed.'
      );
    }
  }

  function init() {
    const button = $("btn_check");
    if (!button) return;

    button.addEventListener("click", check);
    setPanelVisible(false);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})();
