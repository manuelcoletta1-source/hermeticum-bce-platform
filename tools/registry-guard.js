#!/usr/bin/env node
/**
 * HBCE Registry Guard — v3 privacy-minimal fail-closed guard
 *
 * Defensive CI guard for the public HBCE registry index.
 *
 * Current boundary:
 * - IPR-first public proof model.
 * - IPR AI Audit Trail MVP.
 * - R&D reference surface.
 * - Hash-only or minimized public proof records.
 * - No public data custody.
 * - No private identity-document custody.
 * - No regulated certification claim.
 * - No public authority claim.
 * - Fail-closed validation posture.
 *
 * Product hierarchy:
 * - IPR is the first operational product.
 * - IPR AI Audit Trail is the first MVP.
 * - HBCE is the operational governance ecosystem.
 * - JOKER-C2 is the runtime demonstrator.
 * - MATRIX is the wider architectural framework.
 *
 * Enforces:
 * - registry/registry.json must be valid HBCE-REGISTRY-v3.
 * - entries[] must remain append-only on pull requests.
 * - entries[] must use payload_sha256, not operator_sha256.
 * - entries[] must use subject_label, not name / nickname / territory.
 * - timestamps must be ISO 8601 / RFC3339 parseable.
 * - timestamps must be non-decreasing.
 * - entries must not contain forbidden public fields.
 * - duplicate payload_sha256 values are blocked.
 * - future drift is blocked.
 * - new pull-request entries must use IPR-first entity types.
 *
 * Note:
 * - This guard validates the public registry index only.
 * - It does not validate private identity evidence.
 * - It does not validate private evidence packages.
 * - It does not create legal validity, public authority approval, regulated compliance, operator qualification, or production authorization.
 * - Public registry entries are public hash references only.
 */

"use strict";

const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const REG_PATH = "registry/registry.json";

const EXPECTED_PROTO = "HBCE-REGISTRY-v3";
const EXPECTED_FAILURE_MODE = "FAIL_CLOSED";

const ACCEPTED_PUBLIC_DATA = new Set([
  "HASH_ONLY",
  "MINIMIZED_PUBLIC_METADATA"
]);

const ACCEPTED_MODES = new Set([
  "APPEND_ONLY_PUBLIC_REGISTRY",
  "APPEND_ONLY_PUBLIC_RND_REGISTRY"
]);

const FUTURE_DRIFT_MS = 10 * 60 * 1000;

const IPR_FIRST_ENTITY_TYPES = new Set([
  "PUBLIC_IDENTITY_COMMITMENT",
  "PUBLIC_OPERATOR_COMMITMENT",
  "PUBLIC_CONTINUITY_REFERENCE",
  "PUBLIC_CONTINUITY_CERTIFICATE",
  "PUBLIC_NODE_COMMITMENT",
  "PUBLIC_EVENT_COMMITMENT",
  "HBCE_PUBLIC_PROOF",

  "IPR_PUBLIC_PROOF",
  "IPR_BASE_REFERENCE",
  "IPR_VERIFIED_REFERENCE",
  "IPR_PROFESSIONAL_REFERENCE",
  "IPR_VERIFICATION_REFERENCE",
  "IPR_PRIVATE_VERIFICATION_REFERENCE",
  "IPR_PUBLIC_PROOF_REFERENCE",
  "IPR_EVIDENCE_PACK_REFERENCE",
  "IPR_VERIFICATION_RESULT_REFERENCE",

  "IPR_AI_AUDIT_REFERENCE",
  "IPR_AI_AUDIT_TRAIL_REFERENCE",
  "IPR_POLICY_CHECK_REFERENCE",
  "IPR_HUMAN_VALIDATION_REFERENCE",
  "IPR_DOCUMENT_HASH_REFERENCE",
  "IPR_GOVERNANCE_DECISION_REFERENCE",
  "IPR_EVT_REFERENCE",
  "IPR_OPC_REFERENCE",

  "JOKER_C2_RUNTIME_REFERENCE",
  "HBCE_GOVERNANCE_REFERENCE",
  "HBCE_REGISTRY_REFERENCE",
  "HBCE_VERIFY_REFERENCE"
]);

const TRANSITIONAL_LEGACY_ENTITY_TYPES = new Set([
  "MATRIX_AI_AUDIT_REFERENCE",
  "MATRIX_POLICY_CHECK_REFERENCE",
  "MATRIX_HUMAN_VALIDATION_REFERENCE",
  "MATRIX_EVIDENCE_PACK_REFERENCE",
  "MATRIX_VERIFICATION_RESULT_REFERENCE"
]);

const ALLOWED_ENTITY_TYPES = new Set([
  ...IPR_FIRST_ENTITY_TYPES,
  ...TRANSITIONAL_LEGACY_ENTITY_TYPES
]);

const ALLOWED_STATUSES = new Set([
  "ACTIVE",
  "REVOKED",
  "SUSPENDED",
  "RND_ONLY",
  "RETAINED"
]);

const FORBIDDEN_FIELDS = new Set([
  "name",
  "nickname",
  "territory",
  "operator_sha256",
  "raw_identifier",
  "tax_code",
  "fiscal_code",
  "codice_fiscale",
  "identity_document",
  "identity_document_number",
  "document_number",
  "passport_number",
  "driving_license_number",
  "regulated_identity_document",
  "identity_document_scan",
  "portrait_image",
  "address",
  "date_of_birth",
  "private_evidence",
  "personal_payload",
  "personal_data",
  "api_key",
  "token",
  "password",
  "secret",
  "private_key",
  "credential",
  "production_log",
  "private_communication",
  "sensitive_operational_payload",
  "confidential_payload",
  "financial_asset",
  "private_ip",
  "internal_hostname",
  "internal_endpoint",
  "admin_url",
  "database_url",
  "ssh_key",
  "raw_prompt",
  "raw_output",
  "client_file"
]);

function die(message) {
  console.error("\n[REGISTRY-GUARD] BLOCKED");
  console.error(message);
  process.exit(1);
}

function ok(message) {
  console.log("\n[REGISTRY-GUARD] PASS");
  console.log(message);
}

function warn(message) {
  console.warn("\n[REGISTRY-GUARD] WARNING");
  console.warn(message);
}

function escapeShellArg(value) {
  const raw = String(value || "");

  if (!/^[A-Za-z0-9_./:@-]+$/.test(raw)) {
    die(`Unsafe git ref or path: ${raw}`);
  }

  return raw;
}

function readJsonAtRef(ref, filePath) {
  try {
    const output = execSync(`git show ${escapeShellArg(ref)}:${escapeShellArg(filePath)}`, {
      stdio: ["ignore", "pipe", "pipe"]
    }).toString("utf8");

    return JSON.parse(output);
  } catch (error) {
    die(`Cannot read ${filePath} at ref=${ref}. Details: ${String(error && error.message ? error.message : error)}`);
  }
}

function readWorkingJson(filePath) {
  const absolutePath = path.join(process.cwd(), filePath);

  if (!fs.existsSync(absolutePath)) {
    die(`Missing file: ${filePath}`);
  }

  try {
    return JSON.parse(fs.readFileSync(absolutePath, "utf8"));
  } catch (error) {
    die(`Invalid JSON: ${filePath}. Error: ${String(error && error.message ? error.message : error)}`);
  }
}

function clean(value) {
  return String(value || "").trim();
}

function isSha256Lower(value) {
  return /^[a-f0-9]{64}$/.test(clean(value));
}

function isIsoDateTime(value) {
  const raw = clean(value);

  if (!raw) {
    return false;
  }

  const parsed = Date.parse(raw);
  return Number.isFinite(parsed);
}

function parseTime(value) {
  const parsed = Date.parse(clean(value));
  return Number.isFinite(parsed) ? parsed : null;
}

function hasForbiddenField(object, pathLabel) {
  if (!object || typeof object !== "object") {
    return null;
  }

  if (Array.isArray(object)) {
    for (let index = 0; index < object.length; index += 1) {
      const found = hasForbiddenField(object[index], `${pathLabel}[${index}]`);

      if (found) {
        return found;
      }
    }

    return null;
  }

  for (const [key, value] of Object.entries(object)) {
    const currentPath = pathLabel ? `${pathLabel}.${key}` : key;

    if (FORBIDDEN_FIELDS.has(key)) {
      return currentPath;
    }

    const found = hasForbiddenField(value, currentPath);

    if (found) {
      return found;
    }
  }

  return null;
}

function validateEnvelope(registry, label) {
  if (!registry || typeof registry !== "object" || Array.isArray(registry)) {
    die(`[${label}] registry.json must be a JSON object.`);
  }

  if (registry.proto !== EXPECTED_PROTO) {
    die(`[${label}] proto mismatch. Expected ${EXPECTED_PROTO}.`);
  }

  if (!ACCEPTED_MODES.has(clean(registry.mode))) {
    die(`[${label}] mode mismatch. Expected one of: ${Array.from(ACCEPTED_MODES).join(", ")}.`);
  }

  if (!Array.isArray(registry.entries)) {
    die(`[${label}] registry.json must contain entries[].`);
  }

  if (!registry.rules || typeof registry.rules !== "object" || Array.isArray(registry.rules)) {
    die(`[${label}] registry.rules must be an object.`);
  }

  if (registry.rules.failure_mode !== EXPECTED_FAILURE_MODE) {
    die(`[${label}] registry.rules.failure_mode must be ${EXPECTED_FAILURE_MODE}.`);
  }

  if (!ACCEPTED_PUBLIC_DATA.has(clean(registry.rules.public_data))) {
    die(`[${label}] registry.rules.public_data must be one of: ${Array.from(ACCEPTED_PUBLIC_DATA).join(", ")}.`);
  }

  const forbidden = hasForbiddenField(registry, "");

  if (forbidden) {
    die(`[${label}] forbidden public field detected: ${forbidden}`);
  }

  return true;
}

function validatePublicLabel(value, label, index, fieldName) {
  const normalized = clean(value);

  if (!normalized || normalized.length < 3) {
    die(`[${label}] entries[${index}] ${fieldName} missing or too short.`);
  }

  if (!/^[A-Z0-9_\-:.]+$/.test(normalized)) {
    die(`[${label}] entries[${index}] ${fieldName} must use A-Z, 0-9, _, -, :, or . only.`);
  }

  return normalized;
}

function validateOptionalPublicLabel(value, label, index, fieldName) {
  const normalized = clean(value);

  if (!normalized) {
    return "";
  }

  if (!/^[A-Z0-9_\-:.]+$/.test(normalized)) {
    die(`[${label}] entries[${index}] ${fieldName} must be a minimized public scope label.`);
  }

  return normalized;
}

function validateSafePublicText(value, label, index, fieldName) {
  const normalized = clean(value);

  if (!normalized) {
    return "";
  }

  if (normalized.length > 280) {
    die(`[${label}] entries[${index}] ${fieldName} is too long for a minimized public registry field.`);
  }

  const lower = normalized.toLowerCase();

  for (const forbidden of FORBIDDEN_FIELDS) {
    if (lower.includes(forbidden.toLowerCase())) {
      die(`[${label}] entries[${index}] ${fieldName} appears to contain forbidden public-data terminology: ${forbidden}`);
    }
  }

  return normalized;
}

function normalizeEntry(entry, index, label) {
  if (!entry || typeof entry !== "object" || Array.isArray(entry)) {
    die(`[${label}] entries[${index}] must be an object.`);
  }

  const forbidden = hasForbiddenField(entry, `entries[${index}]`);

  if (forbidden) {
    die(`[${label}] forbidden public field detected: ${forbidden}`);
  }

  const normalized = {
    entity_type: clean(entry.entity_type),
    subject_label: validatePublicLabel(entry.subject_label, label, index, "subject_label"),
    record_scope: validateOptionalPublicLabel(entry.record_scope, label, index, "record_scope"),
    payload_sha256: clean(entry.payload_sha256).toLowerCase(),
    timestamp: clean(entry.timestamp),
    status: clean(entry.status),
    public_payload_policy: clean(entry.public_payload_policy),
    source_hint: clean(entry.source_hint),
    note: validateSafePublicText(entry.note, label, index, "note")
  };

  if (!ALLOWED_ENTITY_TYPES.has(normalized.entity_type)) {
    die(`[${label}] entries[${index}] invalid entity_type: ${normalized.entity_type || "(missing)"}`);
  }

  if (!isSha256Lower(normalized.payload_sha256)) {
    die(`[${label}] entries[${index}] invalid payload_sha256. Expected 64 lowercase hexadecimal characters.`);
  }

  if (!isIsoDateTime(normalized.timestamp)) {
    die(`[${label}] entries[${index}] invalid timestamp. Expected ISO 8601 / RFC3339 parseable timestamp.`);
  }

  if (!ALLOWED_STATUSES.has(normalized.status)) {
    die(`[${label}] entries[${index}] invalid status: ${normalized.status || "(missing)"}`);
  }

  if (normalized.public_payload_policy && normalized.public_payload_policy !== "HASH_ONLY") {
    die(`[${label}] entries[${index}] public_payload_policy must be HASH_ONLY when present.`);
  }

  if (normalized.source_hint && !/^[A-Za-z0-9_./:-]+$/.test(normalized.source_hint)) {
    die(`[${label}] entries[${index}] source_hint contains unsafe characters.`);
  }

  return normalized;
}

function validateEvent(event, index, label) {
  if (!event || typeof event !== "object" || Array.isArray(event)) {
    die(`[${label}] events[${index}] must be an object.`);
  }

  const forbidden = hasForbiddenField(event, `events[${index}]`);

  if (forbidden) {
    die(`[${label}] forbidden public field detected: ${forbidden}`);
  }

  const ref = clean(event.ref_payload_sha256).toLowerCase();

  if (!isSha256Lower(ref)) {
    die(`[${label}] events[${index}] invalid ref_payload_sha256.`);
  }

  if (!isIsoDateTime(event.timestamp)) {
    die(`[${label}] events[${index}] invalid timestamp.`);
  }

  if (!ALLOWED_STATUSES.has(clean(event.status))) {
    die(`[${label}] events[${index}] invalid status: ${clean(event.status) || "(missing)"}`);
  }

  if (event.source_hint && !/^[A-Za-z0-9_./:-]+$/.test(clean(event.source_hint))) {
    die(`[${label}] events[${index}] source_hint contains unsafe characters.`);
  }

  return {
    record_type: clean(event.record_type),
    ref_payload_sha256: ref,
    status: clean(event.status),
    timestamp: clean(event.timestamp),
    source_hint: clean(event.source_hint),
    note: clean(event.note)
  };
}

function validateRegistry(registry, label) {
  validateEnvelope(registry, label);

  const seenPayloads = new Set();
  let previousTime = null;

  const normalizedEntries = registry.entries.map((entry, index) => {
    const normalized = normalizeEntry(entry, index, label);
    const currentTime = parseTime(normalized.timestamp);

    if (currentTime === null) {
      die(`[${label}] entries[${index}] timestamp is not parseable.`);
    }

    if (previousTime !== null && currentTime < previousTime) {
      die(
        `[${label}] timestamp order violation at entries[${index}].\n` +
        `Current: ${normalized.timestamp}\n` +
        "Rule: timestamps must be non-decreasing."
      );
    }

    previousTime = currentTime;

    const now = Date.now();

    if (currentTime > now + FUTURE_DRIFT_MS) {
      die(
        `[${label}] timestamp too far in the future at entries[${index}]: ${normalized.timestamp}.\n` +
        `Maximum future drift: ${Math.floor(FUTURE_DRIFT_MS / 60000)} minutes.`
      );
    }

    if (seenPayloads.has(normalized.payload_sha256)) {
      die(`[${label}] duplicate payload_sha256 detected at entries[${index}].`);
    }

    seenPayloads.add(normalized.payload_sha256);

    return normalized;
  });

  if (Array.isArray(registry.events)) {
    registry.events.forEach((event, index) => {
      validateEvent(event, index, label);
    });
  }

  return normalizedEntries;
}

function entriesEqual(baseEntry, headEntry) {
  return (
    baseEntry.entity_type === headEntry.entity_type &&
    baseEntry.subject_label === headEntry.subject_label &&
    baseEntry.record_scope === headEntry.record_scope &&
    baseEntry.payload_sha256 === headEntry.payload_sha256 &&
    baseEntry.timestamp === headEntry.timestamp &&
    baseEntry.status === headEntry.status &&
    baseEntry.public_payload_policy === headEntry.public_payload_policy &&
    baseEntry.source_hint === headEntry.source_hint &&
    baseEntry.note === headEntry.note
  );
}

function enforceAppendOnly(baseRegistry, headRegistry) {
  const baseEntries = validateRegistry(baseRegistry, "BASE");
  const headEntries = validateRegistry(headRegistry, "HEAD");

  if (headEntries.length < baseEntries.length) {
    die(`Append-only violation: HEAD has fewer entries than BASE. base=${baseEntries.length}, head=${headEntries.length}`);
  }

  for (let index = 0; index < baseEntries.length; index += 1) {
    if (!entriesEqual(baseEntries[index], headEntries[index])) {
      die(
        `Append-only violation: entry modified or reordered at index=${index}.\n` +
        `BASE: ${JSON.stringify(baseEntries[index])}\n` +
        `HEAD: ${JSON.stringify(headEntries[index])}\n` +
        "Only appending new entries at the end is allowed."
      );
    }
  }

  return headEntries.slice(baseEntries.length);
}

function enforceAppendedTimeNotBeforeBaseLast(baseRegistry, appendedEntries) {
  const baseEntries = validateRegistry(baseRegistry, "BASE_TIME_REFERENCE");

  if (!baseEntries.length) {
    return;
  }

  const lastBase = baseEntries[baseEntries.length - 1];
  const lastBaseTime = parseTime(lastBase.timestamp);

  appendedEntries.forEach((entry, index) => {
    const currentTime = parseTime(entry.timestamp);

    if (currentTime === null) {
      die(`Appended timestamp is not parseable: ${entry.timestamp}`);
    }

    if (currentTime < lastBaseTime) {
      die(
        `Metrological append rule violation: appended[${index}] (${entry.timestamp}) is earlier than last BASE entry (${lastBase.timestamp}).\n` +
        "New entries cannot backdate the sequence."
      );
    }
  });
}

function enforceNoNewLegacyEntityTypes(appendedEntries) {
  appendedEntries.forEach((entry, index) => {
    if (TRANSITIONAL_LEGACY_ENTITY_TYPES.has(entry.entity_type)) {
      die(
        `Legacy entity_type blocked for new appended entry at appended[${index}]: ${entry.entity_type}.\n` +
        "Use an IPR-first entity_type such as IPR_AI_AUDIT_REFERENCE, IPR_POLICY_CHECK_REFERENCE, IPR_HUMAN_VALIDATION_REFERENCE, IPR_EVIDENCE_PACK_REFERENCE, or IPR_VERIFICATION_RESULT_REFERENCE."
      );
    }
  });
}

function warnExistingLegacyEntityTypes(entries) {
  const legacy = entries
    .filter((entry) => TRANSITIONAL_LEGACY_ENTITY_TYPES.has(entry.entity_type))
    .map((entry) => entry.entity_type);

  if (!legacy.length) {
    return;
  }

  warn(
    "Transitional legacy entity_type values are present in existing registry entries: " +
    Array.from(new Set(legacy)).join(", ") +
    ". Existing records are tolerated for append-only continuity, but new pull-request entries must use IPR-first entity types."
  );
}

function main() {
  const eventName = process.env.GITHUB_EVENT_NAME || "";
  const isPullRequest = eventName === "pull_request";

  const headWorking = readWorkingJson(REG_PATH);
  const headEntries = validateRegistry(headWorking, "HEAD");

  warnExistingLegacyEntityTypes(headEntries);

  if (isPullRequest) {
    const baseSha = process.env.PR_BASE_SHA;

    if (!baseSha) {
      die("PR_BASE_SHA missing.");
    }

    const baseRegistry = readJsonAtRef(baseSha, REG_PATH);
    const appended = enforceAppendOnly(baseRegistry, headWorking);

    enforceAppendedTimeNotBeforeBaseLast(baseRegistry, appended);
    enforceNoNewLegacyEntityTypes(appended);

    ok(`Append-only OK; registry v3 schema OK; IPR-first R&D privacy-minimal fields OK; appended=${appended.length}.`);
    return;
  }

  ok(`Registry v3 schema OK; IPR-first R&D privacy-minimal fields OK; entries=${headWorking.entries.length}.`);
}

main();
