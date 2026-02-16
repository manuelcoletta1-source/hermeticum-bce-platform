/* HBCE VERIFY — client-side deterministic verification (EU-grade)
   - Computes SHA-256 of canonicalized `payload` inside the uploaded IPR release JSON
   - Fetches public registry and checks for match (fail-closed)
   - Exposes: window.hbceVerifyFile(file)
*/

(function () {
  "use strict";

  const BASE = "/hermeticum-bce-platform";
  const REGISTRY_URL = `${BASE}/registry/registry.json`;

  function isObject(v) {
    return v !== null && typeof v === "object" && !Array.isArray(v);
  }

  // Deterministic JSON canonicalization (sorted keys, recursive)
  function canonicalize(value) {
    if (Array.isArray(value)) {
      return value.map(canonicalize);
    }
    if (isObject(value)) {
      const out = {};
      Object.keys(value).sort().forEach((k) => {
        out[k] = canonicalize(value[k]);
      });
      return out;
    }
    return value;
  }

  function utf8Bytes(str) {
    return new TextEncoder().encode(str);
  }

  function hex(buf) {
    const b = new Uint8Array(buf);
    let s = "";
    for (let i = 0; i < b.length; i++) {
      s += b[i].toString(16).padStart(2, "0");
    }
    return s;
  }

  async function sha256HexFromString(str) {
    const digest = await crypto.subtle.digest("SHA-256", utf8Bytes(str));
    return hex(digest);
  }

  async function readJsonFile(file) {
    const text = await file.text();
    let obj;
    try {
      obj = JSON.parse(text);
    } catch (e) {
      const err = new Error("INVALID_JSON");
      err.detail = "Il file non è un JSON valido.";
      throw err;
    }
    return { text, obj };
  }

  function extractName(obj) {
    // Prefer `name`, fallback to `nickname` (legacy)
    if (typeof obj?.name === "string" && obj.name.trim()) return obj.name.trim();
    if (typeof obj?.nickname === "string" && obj.nickname.trim()) return obj.nickname.trim();
    if (typeof obj?.payload?.name === "string" && obj.payload.name.trim()) return obj.payload.name.trim();
    if (typeof obj?.payload?.nickname === "string" && obj.payload.nickname.trim()) return obj.payload.nickname.trim();
    return "—";
  }

  function extractTimestamp(obj) {
    if (typeof obj?.timestamp === "string" && obj.timestamp.trim()) return obj.timestamp.trim();
    if (typeof obj?.payload?.timestamp === "string" && obj.payload.timestamp.trim()) return obj.payload.timestamp.trim();
    return "—";
  }

  function extractPayload(obj) {
    // Canonical assumption: release contains `payload` object
    if (isObject(obj?.payload)) return obj.payload;

    // Some variants may store payload under `data` or `ipr`
    if (isObject(obj?.data)) return obj.data;
    if (isObject(obj?.ipr)) return obj.ipr;

    const err = new Error("MISSING_PAYLOAD");
    err.detail = "Il file non contiene un campo `payload` (o equivalente).";
    throw err;
  }

  async function fetchRegistry() {
    let res;
    try {
      res = await fetch(REGISTRY_URL, { cache: "no-store" });
    } catch (e) {
      const err = new Error("REGISTRY_FETCH_FAILED");
      err.detail = "Impossibile raggiungere il registry pubblico.";
      throw err;
    }

    if (!res.ok) {
      const err = new Error("REGISTRY_HTTP_ERROR");
      err.detail = `Registry non disponibile (HTTP ${res.status}).`;
      throw err;
    }

    const text = await res.text();
    let json;
    try {
      json = JSON.parse(text);
    } catch (e) {
      const err = new Error("REGISTRY_INVALID_JSON");
      err.detail = "Registry non valido (JSON non parsabile).";
      throw err;
    }

    // Minimal schema check (fail-closed)
    const entries = json?.entries;
    if (!Array.isArray(entries)) {
      const err = new Error("REGISTRY_SCHEMA_INVALID");
      err.detail = "Registry non valido (manca `entries[]`).";
      throw err;
    }

    const registry_sha256 = await sha256HexFromString(text);
    return { json, entries, registry_sha256, url: REGISTRY_URL };
  }

  function matchInRegistry(entries, payloadSha) {
    // Accept {payload_sha256} field; keep future compatibility
    for (const e of entries) {
      if (!e) continue;
      const v = typeof e.payload_sha256 === "string" ? e.payload_sha256 : "";
      if (v && v.toLowerCase() === payloadSha.toLowerCase()) return true;
    }
    return false;
  }

  // Public API: verify file against registry
  async function hbceVerifyFile(file) {
    const startedAt = new Date().toISOString();

    const { obj: releaseObj } = await readJsonFile(file);

    const name = extractName(releaseObj);
    const timestamp = extractTimestamp(releaseObj);

    // Compute payload SHA-256 (canonical)
    const payload = extractPayload(releaseObj);
    const canonicalPayload = canonicalize(payload);
    const payloadStr = JSON.stringify(canonicalPayload);
    const computed_payload_sha256 = await sha256HexFromString(payloadStr);

    // If file declares payload_sha256, we can compare (integrity hint)
    const declared_payload_sha256 =
      (typeof releaseObj?.payload_sha256 === "string" && releaseObj.payload_sha256) ||
      (typeof releaseObj?.payload?.payload_sha256 === "string" && releaseObj.payload.payload_sha256) ||
      "";

    const integrity_ok = declared_payload_sha256
      ? declared_payload_sha256.toLowerCase() === computed_payload_sha256.toLowerCase()
      : true; // no declared hash → cannot compare, but still proceed

    // Fetch + validate registry (fail-closed)
    const { entries, registry_sha256, url } = await fetchRegistry();
    const registry_match = matchInRegistry(entries, computed_payload_sha256);

    return {
      ok: true,
      started_at: startedAt,
      name,
      timestamp,
      registry: {
        url,
        entries: entries.length,
        registry_sha256
      },
      payload_sha256: {
        declared: declared_payload_sha256 || "—",
        computed: computed_payload_sha256,
        integrity_ok
      },
      registry_match
    };
  }

  window.hbceVerifyFile = hbceVerifyFile;
})();
