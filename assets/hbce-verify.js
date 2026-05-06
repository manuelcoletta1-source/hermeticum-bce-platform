/* =========================================================
   HBCE VERIFY ENGINE — registry v3 / privacy-minimal
   - Loads public registry: /registry/registry.json
   - Requires HBCE-REGISTRY-v3
   - Uses payload_sha256 as public proof commitment
   - Does not use name, nickname, territory, or operator_sha256
   - Computes SHA-256 locally in the browser
   - Returns explicit fail-closed states
   - No upload, no public data custody, no private evidence custody
   ========================================================= */

(function () {
  "use strict";

  const REGISTRY_URL = "/hermeticum-bce-platform/registry/registry.json";
  const EXPECTED_PROTO = "HBCE-REGISTRY-v3";
  const EXPECTED_FAILURE_MODE = "FAIL_CLOSED";
  const EXPECTED_PUBLIC_DATA = "HASH_ONLY";

  const FORBIDDEN_PUBLIC_FIELDS = [
    "name",
    "nickname",
    "territory",
    "operator_sha256",
    "raw_identifier",
    "tax_code",
    "fiscal_code",
    "identity_document",
    "private_evidence",
    "personal_payload",
    "api_key",
    "token",
    "password",
    "secret",
    "private_key",
    "credential",
    "production_log",
    "private_communication",
    "sensitive_operational_payload",
    "private_ip",
    "internal_hostname",
    "internal_endpoint",
    "admin_url",
    "database_url",
    "ssh_key"
  ];

  function clean(value) {
    return String(value || "").trim();
  }

  function normalizeSha256(value) {
    return clean(value).toLowerCase();
  }

  function isSha256Lower(value) {
    return /^[a-f0-9]{64}$/.test(clean(value));
  }

  function isIsoLikeTimestamp(value) {
    const raw = clean(value);
    if (!raw) return false;

    const parsed = Date.parse(raw);
    return Number.isFinite(parsed);
  }

  function fail(reason) {
    const error = new Error("HBCE_VERIFY_FAIL_CLOSED");
    error.detail = reason || "FAIL_CLOSED";
    throw error;
  }

  function toHex(buffer) {
    const bytes = new Uint8Array(buffer);
    return Array.from(bytes)
      .map((byte) => byte.toString(16).padStart(2, "0"))
      .join("");
  }

  async function sha256HexFromText(text) {
    const encoder = new TextEncoder();
    const data = encoder.encode(text);
    const digest = await crypto.subtle.digest("SHA-256", data);
    return toHex(digest);
  }

  async function sha256HexFromBytes(bytes) {
    const digest = await crypto.subtle.digest("SHA-256", bytes);
    return toHex(digest);
  }

  function stableStringify(value) {
    if (value === null || typeof value !== "object") {
      return JSON.stringify(value);
    }

    if (Array.isArray(value)) {
      return "[" + value.map((item) => stableStringify(item)).join(",") + "]";
    }

    const keys = Object.keys(value).sort();
    return "{" + keys.map((key) => JSON.stringify(key) + ":" + stableStringify(value[key])).join(",") + "}";
  }

  function deepClone(value) {
    return JSON.parse(JSON.stringify(value));
  }

  function removeGeneratedHashFields(value) {
    if (!value || typeof value !== "object") return value;

    if (Array.isArray(value)) {
      return value.map(removeGeneratedHashFields);
    }

    const output = {};

    for (const [key, nestedValue] of Object.entries(value)) {
      if (
        key === "payload_sha256" ||
        key === "receipt_sha256" ||
        key === "pack_sha256" ||
        key === "entry_hash" ||
        key === "blob_sha256" ||
        key === "operator_sha256"
      ) {
        continue;
      }

      output[key] = removeGeneratedHashFields(nestedValue);
    }

    return output;
  }

  function hasForbiddenField(object, pathLabel) {
    if (!object || typeof object !== "object") return null;

    if (Array.isArray(object)) {
      for (let index = 0; index < object.length; index += 1) {
        const found = hasForbiddenField(object[index], `${pathLabel}[${index}]`);
        if (found) return found;
      }

      return null;
    }

    for (const [key, value] of Object.entries(object)) {
      const currentPath = pathLabel ? `${pathLabel}.${key}` : key;

      if (FORBIDDEN_PUBLIC_FIELDS.includes(key)) {
        return currentPath;
      }

      const found = hasForbiddenField(value, currentPath);
      if (found) return found;
    }

    return null;
  }

  function validateRegistryEntry(entry, index) {
    if (!entry || typeof entry !== "object" || Array.isArray(entry)) {
      return `ENTRY_${index}_INVALID_OBJECT`;
    }

    const forbidden = hasForbiddenField(entry, `entries[${index}]`);
    if (forbidden) return `ENTRY_FORBIDDEN_FIELD_${forbidden}`;

    if (!clean(entry.entity_type)) return `ENTRY_${index}_MISSING_ENTITY_TYPE`;
    if (!clean(entry.subject_label)) return `ENTRY_${index}_MISSING_SUBJECT_LABEL`;
    if (!isSha256Lower(entry.payload_sha256)) return `ENTRY_${index}_INVALID_PAYLOAD_SHA256`;
    if (!isIsoLikeTimestamp(entry.timestamp)) return `ENTRY_${index}_INVALID_TIMESTAMP`;
    if (!clean(entry.status)) return `ENTRY_${index}_MISSING_STATUS`;

    return "";
  }

  function validateRegistry(registry) {
    if (!registry || typeof registry !== "object" || Array.isArray(registry)) {
      return "REGISTRY_INVALID_OBJECT";
    }

    if (registry.proto !== EXPECTED_PROTO) {
      return "REGISTRY_PROTO_MISMATCH";
    }

    if (!Array.isArray(registry.entries)) {
      return "REGISTRY_ENTRIES_MISSING";
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

    const forbidden = hasForbiddenField(registry, "");
    if (forbidden) {
      return `REGISTRY_FORBIDDEN_FIELD_${forbidden}`;
    }

    for (let index = 0; index < registry.entries.length; index += 1) {
      const entryError = validateRegistryEntry(registry.entries[index], index);
      if (entryError) return entryError;
    }

    return "";
  }

  async function loadRegistryV3() {
    let response;
    let text;
    let registry;

    try {
      response = await fetch(REGISTRY_URL, { cache: "no-store" });
    } catch (_) {
      fail("NON_OPERATIONAL — registry fetch error");
    }

    if (!response || !response.ok) {
      fail("NON_OPERATIONAL — registry not readable HTTP " + (response ? response.status : "ERROR"));
    }

    try {
      text = await response.text();
    } catch (_) {
      fail("NON_OPERATIONAL — registry read error");
    }

    try {
      registry = JSON.parse(text);
    } catch (_) {
      fail("NON_OPERATIONAL — registry JSON invalid");
    }

    const validationError = validateRegistry(registry);
    if (validationError) {
      fail("NON_OPERATIONAL — " + validationError);
    }

    let registrySha256 = "—";

    try {
      registrySha256 = await sha256HexFromText(text);
    } catch (_) {}

    return {
      registry,
      registrySha256
    };
  }

  async function readFileText(file) {
    return await new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onerror = () => reject(new Error("FILE_READ_ERROR"));
      reader.onload = () => resolve(String(reader.result || ""));
      reader.readAsText(file);
    });
  }

  async function readFileBytes(file) {
    const buffer = await file.arrayBuffer();
    return new Uint8Array(buffer);
  }

  async function determinePayloadSha256FromObject(object) {
    if (!object || typeof object !== "object" || Array.isArray(object)) {
      fail("INVALID — release object is not a JSON object");
    }

    if (isSha256Lower(object.payload_sha256)) {
      return {
        payloadSha256: normalizeSha256(object.payload_sha256),
        source: "declared_payload_sha256"
      };
    }

    const clone = deepClone(object);
    const stripped = removeGeneratedHashFields(clone);
    const canonical = stableStringify(stripped);
    const computed = await sha256HexFromText(canonical);

    return {
      payloadSha256: computed,
      source: "computed_from_canonical_json_without_generated_hash_fields"
    };
  }

  function findRegistryMatch(entries, payloadSha256) {
    return entries.find((entry) => normalizeSha256(entry.payload_sha256) === payloadSha256) || null;
  }

  function safePublicMatch(entry) {
    if (!entry) return null;

    return {
      entity_type: clean(entry.entity_type) || "—",
      subject_label: clean(entry.subject_label) || "—",
      record_scope: clean(entry.record_scope) || "—",
      payload_sha256: normalizeSha256(entry.payload_sha256) || "—",
      status: clean(entry.status) || "—",
      timestamp: clean(entry.timestamp) || "—",
      note: clean(entry.note) || "—"
    };
  }

  function buildResult(status, payloadSha256, source, matchEntry, registryInfo, details) {
    return {
      valid: status === "PUBLIC_RECORD_PRESENT",
      status,
      payload_sha256: payloadSha256 || "—",
      input_source: source || "—",
      registry_match: !!matchEntry,
      matched_entry: safePublicMatch(matchEntry),
      registry: {
        url: REGISTRY_URL,
        proto: EXPECTED_PROTO,
        entries: registryInfo && registryInfo.registry && Array.isArray(registryInfo.registry.entries)
          ? registryInfo.registry.entries.length
          : 0,
        registry_sha256: registryInfo ? registryInfo.registrySha256 : "—"
      },
      details: details || "",
      caution: "Public proof presence does not replace private evidence review, identity verification, contractual qualification, legal authorization, institutional validation, or regulated certification."
    };
  }

  async function verifyObjectAgainstRegistry(object) {
    const target = await determinePayloadSha256FromObject(object);
    const registryInfo = await loadRegistryV3();
    const matchEntry = findRegistryMatch(registryInfo.registry.entries, target.payloadSha256);

    if (!matchEntry) {
      return buildResult(
        "NO_PUBLIC_RECORD",
        target.payloadSha256,
        target.source,
        null,
        registryInfo,
        "No matching registry.entries[].payload_sha256 record was found."
      );
    }

    return buildResult(
      "PUBLIC_RECORD_PRESENT",
      target.payloadSha256,
      target.source,
      matchEntry,
      registryInfo,
      "Deterministic public registry match found."
    );
  }

  async function verifyHashAgainstRegistry(payloadSha256) {
    const target = normalizeSha256(payloadSha256);

    if (!isSha256Lower(target)) {
      fail("INVALID — payload_sha256 must be 64 lowercase hex characters");
    }

    const registryInfo = await loadRegistryV3();
    const matchEntry = findRegistryMatch(registryInfo.registry.entries, target);

    if (!matchEntry) {
      return buildResult(
        "NO_PUBLIC_RECORD",
        target,
        "direct_payload_sha256",
        null,
        registryInfo,
        "No matching registry.entries[].payload_sha256 record was found."
      );
    }

    return buildResult(
      "PUBLIC_RECORD_PRESENT",
      target,
      "direct_payload_sha256",
      matchEntry,
      registryInfo,
      "Deterministic public registry match found."
    );
  }

  async function verifyFileBytes(file, expectedSha256) {
    if (!file) fail("INVALID — missing file");

    const expected = normalizeSha256(expectedSha256);

    if (!isSha256Lower(expected)) {
      fail("INVALID — expected SHA-256 must be 64 lowercase hex characters");
    }

    let bytes;

    try {
      bytes = await readFileBytes(file);
    } catch (_) {
      fail("NON_OPERATIONAL — file read error");
    }

    let computed;

    try {
      computed = await sha256HexFromBytes(bytes);
    } catch (_) {
      fail("NON_OPERATIONAL — SHA-256 compute error");
    }

    return {
      valid: computed === expected,
      status: computed === expected ? "HASH_MATCH" : "HASH_MISMATCH",
      expected_sha256: expected,
      computed_sha256: computed,
      file_name: file.name || "local_file",
      file_size_bytes: bytes.byteLength,
      verification_mode: "SHA256(EXACT_LOCAL_FILE_BYTES)",
      data_custody: "CLIENT_SIDE_ONLY",
      caution: "Hash match does not replace private evidence review, identity verification, contractual qualification, legal authorization, institutional validation, or regulated certification."
    };
  }

  window.hbceVerifyFile = async function hbceVerifyFile(file) {
    if (!file) fail("INVALID — missing file");

    const text = await readFileText(file);

    let object;

    try {
      object = JSON.parse(text);
    } catch (_) {
      fail("INVALID — file is not valid JSON");
    }

    return verifyObjectAgainstRegistry(object);
  };

  window.hbceVerifyObject = async function hbceVerifyObject(object) {
    return verifyObjectAgainstRegistry(object);
  };

  window.hbceVerifyPayloadSha256 = async function hbceVerifyPayloadSha256(payloadSha256) {
    return verifyHashAgainstRegistry(payloadSha256);
  };

  window.hbceVerifyLocalFileHash = async function hbceVerifyLocalFileHash(file, expectedSha256) {
    return verifyFileBytes(file, expectedSha256);
  };
})();
