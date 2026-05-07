/* =========================================================
   HBCE CRYPTO HELPERS — CLIENT-SIDE / HASH-ONLY
   - SHA-256 helpers
   - Stable JSON canonicalization
   - Safe local download helper
   - Same-origin JSON fetch helper
   - No tracking
   - No external calls by default
   - No secret handling
   - No public data custody
   ========================================================= */

const HBCE = (() => {
  "use strict";

  const textEncoder = new TextEncoder();

  function toHex(buffer) {
    const bytes = new Uint8Array(buffer);
    let output = "";

    for (const byte of bytes) {
      output += byte.toString(16).padStart(2, "0");
    }

    return output;
  }

  function clean(value) {
    return String(value || "").trim();
  }

  function isSha256Lower(value) {
    return /^[a-f0-9]{64}$/.test(clean(value));
  }

  function nowISO() {
    return new Date().toISOString();
  }

  function stableStringify(value) {
    if (value === null) return "null";

    const type = typeof value;

    if (type === "number") {
      if (!Number.isFinite(value)) {
        throw new Error("HBCE_STABLE_JSON_NON_FINITE_NUMBER");
      }

      return String(value);
    }

    if (type === "boolean") return String(value);
    if (type === "string") return JSON.stringify(value);

    if (Array.isArray(value)) {
      return "[" + value.map((item) => stableStringify(item)).join(",") + "]";
    }

    if (type === "object") {
      const keys = Object.keys(value).sort();

      return "{" + keys
        .filter((key) => value[key] !== undefined)
        .map((key) => JSON.stringify(key) + ":" + stableStringify(value[key]))
        .join(",") + "}";
    }

    return JSON.stringify(String(value));
  }

  async function sha256String(text) {
    const digest = await crypto.subtle.digest("SHA-256", textEncoder.encode(String(text || "")));
    return toHex(digest);
  }

  async function sha256Bytes(bytes) {
    if (!(bytes instanceof Uint8Array)) {
      throw new Error("HBCE_SHA256_BYTES_REQUIRES_UINT8ARRAY");
    }

    const digest = await crypto.subtle.digest("SHA-256", bytes);
    return toHex(digest);
  }

  async function sha256ArrayBuffer(buffer) {
    if (!(buffer instanceof ArrayBuffer)) {
      throw new Error("HBCE_SHA256_ARRAYBUFFER_REQUIRES_ARRAYBUFFER");
    }

    const digest = await crypto.subtle.digest("SHA-256", buffer);
    return toHex(digest);
  }

  async function sha256Json(object) {
    const canonical = stableStringify(object);
    return sha256String(canonical);
  }

  async function sha256File(file) {
    if (!file || typeof file.arrayBuffer !== "function") {
      throw new Error("HBCE_SHA256_FILE_REQUIRES_FILE");
    }

    const buffer = await file.arrayBuffer();
    return sha256ArrayBuffer(buffer);
  }

  function removeGeneratedHashFields(value) {
    const generatedHashFields = new Set([
      "payload_sha256",
      "receipt_sha256",
      "pack_sha256",
      "entry_hash",
      "blob_sha256",
      "operator_sha256"
    ]);

    if (!value || typeof value !== "object") return value;

    if (Array.isArray(value)) {
      return value.map(removeGeneratedHashFields);
    }

    const output = {};

    for (const [key, nestedValue] of Object.entries(value)) {
      if (generatedHashFields.has(key)) continue;
      output[key] = removeGeneratedHashFields(nestedValue);
    }

    return output;
  }

  async function payloadSha256FromObject(object) {
    if (!object || typeof object !== "object" || Array.isArray(object)) {
      throw new Error("HBCE_PAYLOAD_OBJECT_INVALID");
    }

    if (isSha256Lower(object.payload_sha256)) {
      return clean(object.payload_sha256).toLowerCase();
    }

    const sanitized = removeGeneratedHashFields(JSON.parse(JSON.stringify(object)));
    return sha256Json(sanitized);
  }

  function download(filename, content, mime = "application/json;charset=utf-8") {
    const safeFilename = clean(filename) || "HBCE_DOWNLOAD.json";
    const blob = new Blob([String(content || "")], { type: mime });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");

    anchor.href = url;
    anchor.download = safeFilename;

    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();

    setTimeout(() => URL.revokeObjectURL(url), 1500);
  }

  function downloadJson(filename, object) {
    const content = JSON.stringify(object, null, 2);
    download(filename, content, "application/json;charset=utf-8");
  }

  function isSameOriginUrl(url) {
    try {
      const parsed = new URL(url, window.location.href);
      return parsed.origin === window.location.origin;
    } catch {
      return false;
    }
  }

  async function fetchJson(url) {
    if (!isSameOriginUrl(url)) {
      throw new Error("HBCE_FETCH_BLOCKED_NON_SAME_ORIGIN");
    }

    const response = await fetch(url, {
      cache: "no-store",
      credentials: "same-origin"
    });

    if (!response.ok) {
      throw new Error("HBCE_FETCH_HTTP_" + response.status);
    }

    return response.json();
  }

  async function fetchText(url) {
    if (!isSameOriginUrl(url)) {
      throw new Error("HBCE_FETCH_BLOCKED_NON_SAME_ORIGIN");
    }

    const response = await fetch(url, {
      cache: "no-store",
      credentials: "same-origin"
    });

    if (!response.ok) {
      throw new Error("HBCE_FETCH_HTTP_" + response.status);
    }

    return response.text();
  }

  return Object.freeze({
    toHex,
    clean,
    isSha256Lower,
    nowISO,
    stableStringify,
    sha256String,
    sha256Bytes,
    sha256ArrayBuffer,
    sha256Json,
    sha256File,
    removeGeneratedHashFields,
    payloadSha256FromObject,
    download,
    downloadJson,
    fetchJson,
    fetchText
  });
})();

window.HBCE = HBCE;



