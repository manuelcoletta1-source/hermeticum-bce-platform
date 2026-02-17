/* HBCE VERIFY ENGINE — strict deterministic + fail-closed
   - Loads public registry: /registry/registry.json (HBCE-REGISTRY-v2)
   - Computes SHA-256 of canonical release file (without payload_sha256 field)
   - Requires integrity_ok AND registry_match => VALID
*/

(function () {
  const REGISTRY_URL = "/hermeticum-bce-platform/registry/registry.json";

  function normalize(s) {
    return (s || "").toString().trim();
  }

  function isHex64Lower(s) {
    return typeof s === "string" && /^[0-9a-f]{64}$/.test(s.trim());
  }

  async function sha256Hex(str) {
    const enc = new TextEncoder();
    const data = enc.encode(str);
    const digest = await crypto.subtle.digest("SHA-256", data);
    const bytes = new Uint8Array(digest);
    return Array.from(bytes).map(b => b.toString(16).padStart(2, "0")).join("");
  }

  function fail(detail) {
    const err = new Error("HBCE_VERIFY_FAIL");
    err.detail = detail || "FAIL-CLOSED";
    throw err;
  }

  function stripPayloadSha(obj) {
    // deterministic: hash of canonical release WITHOUT payload_sha256
    if (!obj || typeof obj !== "object") return obj;
    if (!Object.prototype.hasOwnProperty.call(obj, "payload_sha256")) return obj;

    const clone = Array.isArray(obj) ? obj.slice() : { ...obj };
    delete clone.payload_sha256;
    return clone;
  }

  function validateRegistryV2(reg) {
    if (!reg || typeof reg !== "object") return "Schema invalido: registry non è un oggetto JSON.";
    if (normalize(reg.proto) !== "HBCE-REGISTRY-v2") return "Schema invalido: proto != HBCE-REGISTRY-v2 (fail-closed).";
    if (normalize(reg.kind) !== "IPR_PUBLIC_REGISTRY") return "Schema invalido: kind != IPR_PUBLIC_REGISTRY (fail-closed).";
    if (!Array.isArray(reg.policy) || reg.policy.length === 0) return "Schema invalido: policy[] mancante (fail-closed).";
    if (!reg.meta || typeof reg.meta !== "object") return "Schema invalido: meta{} mancante (fail-closed).";
    if (!Array.isArray(reg.entries)) return "Schema invalido: entries[] mancante (fail-closed).";

    for (const e of reg.entries) {
      if (!e || typeof e !== "object") return "Schema invalido: entry non-oggetto (fail-closed).";
      const ts = normalize(e.timestamp);
      if (!ts) return "Schema invalido: entry senza timestamp (fail-closed).";
      const h = normalize(e.payload_sha256);
      if (!isHex64Lower(h)) return "Schema invalido: payload_sha256 non valido (richiesto 64-hex lowercase) (fail-closed).";
      const name = normalize(e.name);
      if (!name) return "Schema invalido: name mancante (public identity minimale) (fail-closed).";
    }

    return "";
  }

  async function loadRegistryV2() {
    let res, reg;
    try {
      res = await fetch(REGISTRY_URL, { cache: "no-store" });
      if (!res.ok) fail("BLOCK — registry non leggibile (HTTP " + res.status + ").");
      reg = await res.json();
    } catch (e) {
      fail("BLOCK — impossibile leggere registry.json (fail-closed).");
    }

    const schemaErr = validateRegistryV2(reg);
    if (schemaErr) fail("BLOCK — " + schemaErr);

    // optional: compute registry sha for transparency
    let registry_sha256 = "—";
    try {
      const canonical = JSON.stringify(reg);
      registry_sha256 = await sha256Hex(canonical);
    } catch (_) {}

    return { reg, registry_sha256 };
  }

  async function readFileText(file) {
    return await new Promise((resolve, reject) => {
      const fr = new FileReader();
      fr.onerror = () => reject(new Error("FILE_READ_ERROR"));
      fr.onload = () => resolve(String(fr.result || ""));
      fr.readAsText(file);
    });
  }

  function extractDisplayName(releaseObj) {
    // prefer subject first/last name
    const subj = releaseObj && releaseObj.subject && typeof releaseObj.subject === "object" ? releaseObj.subject : null;
    const fn = subj ? normalize(subj.first_name) : "";
    const ln = subj ? normalize(subj.last_name) : "";
    const directName = normalize(releaseObj && releaseObj.name);

    const name = (fn && ln) ? (fn + " " + ln) : (directName || "—");
    return name;
  }

  async function verifyReleaseObject(releaseObj, registryObj) {
    if (!releaseObj || typeof releaseObj !== "object") fail("FAIL-CLOSED — file release non valido (non JSON object).");

    const declared = normalize(releaseObj.payload_sha256);
    const stripped = stripPayloadSha(releaseObj);

    // deterministic canonicalization (client-side baseline): JSON.stringify of stripped object
    const canonical = JSON.stringify(stripped);
    const computed = await sha256Hex(canonical);

    const integrity_ok = !!(declared && isHex64Lower(declared) && declared === computed);

    // fail-closed: if declared exists but doesn't match -> integrity mismatch
    if (declared && isHex64Lower(declared) && !integrity_ok) {
      // still compute registry match ONLY on computed, but final status will be non-operativo
    }

    // registry match is based on computed hash (source of truth)
    const matchEntry = registryObj.entries.find(e => normalize(e.payload_sha256) === computed);
    const registry_match = !!matchEntry;

    const name = extractDisplayName(releaseObj);
    const ts = normalize(releaseObj.timestamp) || "—";

    return {
      name,
      timestamp: ts,
      payload_sha256: {
        computed,
        declared: declared || "—",
        integrity_ok
      },
      registry_match,
      matched_entry: matchEntry || null
    };
  }

  // PUBLIC API used by verify/index.html
  window.hbceVerifyFile = async function hbceVerifyFile(file) {
    if (!file) fail("FAIL-CLOSED — file mancante.");

    const text = await readFileText(file);
    let releaseObj;
    try {
      releaseObj = JSON.parse(text);
    } catch (e) {
      fail("FAIL-CLOSED — file non è JSON valido.");
    }

    const { reg, registry_sha256 } = await loadRegistryV2();
    const r = await verifyReleaseObject(releaseObj, reg);

    // FINAL: VALID only if integrity ok AND registry match
    const valid = !!(r.payload_sha256.integrity_ok && r.registry_match);

    return {
      valid,
      name: r.name,
      timestamp: r.timestamp,
      payload_sha256: r.payload_sha256,
      registry_match: r.registry_match,
      matched_entry: r.matched_entry ? {
        entity_type: normalize(r.matched_entry.entity_type) || "—",
        name: normalize(r.matched_entry.name) || "—",
        status: normalize(r.matched_entry.status) || "—",
        timestamp: normalize(r.matched_entry.timestamp) || "—"
      } : null,
      registry: {
        url: REGISTRY_URL,
        schema_version: normalize(reg.meta && reg.meta.schema_version) || "—",
        issuer: normalize(reg.issuer) || "—",
        entries: Array.isArray(reg.entries) ? reg.entries.length : 0,
        registry_sha256
      }
    };
  };
})();
