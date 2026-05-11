#!/usr/bin/env node
/**
 * HBCE Reference Verifier — R&D fail-closed verifier for IPR AI Audit Trail
 *
 * Scope:
 * - Verifies append-only ledger structure.
 * - Rebuilds record hashes from canonical JSON.
 * - Verifies entity records, operator records, derived records, and event records.
 * - Verifies ED25519 signatures when real keys/signatures are provided.
 * - Rejects placeholder signatures by default.
 * - Rejects RND_ONLY records as production-valid by default.
 *
 * Public boundary:
 * - R&D reference implementation only.
 * - Not a regulated certification engine.
 * - Not an eIDAS qualified trust service.
 * - Not a public authority verifier.
 * - Not a production compliance framework by itself.
 *
 * Product hierarchy:
 * - IPR is the first operational product.
 * - IPR AI Audit Trail is the first MVP.
 * - HBCE is the governance ecosystem.
 * - JOKER-C2 is the runtime demonstrator.
 * - MATRIX is the wider architectural framework.
 *
 * Recommended IPR audit workflow:
 *   node protocol/hbce-verify.reference.js protocol/hbce-registry-ledger.example.json --check-chain
 *   node protocol/hbce-verify.reference.js protocol/hbce-registry-ledger.example.json --rebuild > protocol/hbce-registry-ledger.rebuilt.json
 *   node protocol/hbce-verify.reference.js protocol/hbce-registry-ledger.rebuilt.json --check-chain
 *   node protocol/hbce-verify.reference.js protocol/hbce-registry-ledger.rebuilt.json --verify-entity IPR-AI-AUDIT-0001 --allow-rnd-status --allow-placeholder-signatures
 *   node protocol/hbce-verify.reference.js protocol/hbce-registry-ledger.rebuilt.json --verify-event EVT-IPR-HUMAN-VALIDATION-0001 --allow-rnd-status --allow-placeholder-signatures
 *
 * Production rule:
 * - Do not use --allow-placeholder-signatures in production.
 * - Do not use --allow-rnd-status to claim production validity.
 */

const fs = require("fs");
const crypto = require("crypto");

// -----------------------------------------------------------------------------
// CLI parsing
// -----------------------------------------------------------------------------

const argv = process.argv.slice(2);

if (argv.length < 2) {
  console.error("Usage: node hbce-verify.reference.js <ledger.json> <command> [arg] [flags]");
  console.error("");
  console.error("Commands:");
  console.error("  --check-chain");
  console.error("  --rebuild");
  console.error("  --verify-entity <entity_id>");
  console.error("  --verify-event <event_id>");
  console.error("");
  console.error("Flags:");
  console.error("  --non-strict                     Check pointer chain without requiring stored hashes to match rebuilt hashes.");
  console.error("  --skip-chain                     Skip chain verification before entity/event verification.");
  console.error("  --allow-rnd-status               Treat RND_ONLY records as acceptable for R&D/demo verification.");
  console.error("  --allow-placeholder-signatures   Treat placeholder signatures as acceptable for R&D/demo verification.");
  process.exit(2);
}

const ledgerPath = argv[0];
const command = argv[1];
const arg = argv[2];

const flags = new Set(argv.filter((item) => item.startsWith("--")));

const ALLOW_PLACEHOLDER_SIGNATURES = flags.has("--allow-placeholder-signatures");
const ALLOW_RND_STATUS = flags.has("--allow-rnd-status");

// -----------------------------------------------------------------------------
// Helpers
// -----------------------------------------------------------------------------

function die(message, code = 1) {
  console.error(message);
  process.exit(code);
}

function isHex64(value) {
  return typeof value === "string" && /^[0-9a-fA-F]{64}$/.test(value);
}

function isNonEmptyString(value) {
  return typeof value === "string" && value.trim().length > 0;
}

function isPlaceholder(value) {
  return typeof value === "string" && value.toUpperCase().includes("PLACEHOLDER");
}

function isAcceptableRecordStatus(status) {
  if (status === "VALID") return true;
  if (status === "RND_ONLY" && ALLOW_RND_STATUS) return true;
  return false;
}

function normalizeStatusForResult(status) {
  if (status === "RND_ONLY" && ALLOW_RND_STATUS) return "VALID_RND_ONLY";
  return status;
}

/**
 * Canonicalize JSON:
 * - Sort object keys lexicographically.
 * - Keep array order.
 * - Preserve JSON primitive values.
 * - Output is later serialized with JSON.stringify without extra whitespace.
 */
function canonicalize(value) {
  if (value === null) return null;

  if (Array.isArray(value)) {
    return value.map(canonicalize);
  }

  if (typeof value === "object") {
    const output = {};
    for (const key of Object.keys(value).sort()) {
      output[key] = canonicalize(value[key]);
    }
    return output;
  }

  return value;
}

function canonicalBytes(value) {
  return Buffer.from(JSON.stringify(canonicalize(value)), "utf8");
}

function sha256HexFromBytes(bytes) {
  return crypto.createHash("sha256").update(bytes).digest("hex");
}

function sha256HexFromCanonicalJson(value) {
  return sha256HexFromBytes(canonicalBytes(value));
}

/**
 * Build hash/signature material.
 *
 * Excludes:
 * - prev_record_sha256
 * - record_sha256
 * - issuer.signature
 * - operator.signature
 * - record_signature.signature
 */
function stripForHashAndSignature(record) {
  const output = JSON.parse(JSON.stringify(record));

  delete output.prev_record_sha256;
  delete output.record_sha256;

  if (output.issuer && typeof output.issuer === "object") {
    delete output.issuer.signature;
  }

  if (output.operator && typeof output.operator === "object") {
    delete output.operator.signature;
  }

  if (output.record_signature && typeof output.record_signature === "object") {
    delete output.record_signature.signature;
  }

  return output;
}

function parseSignature(signature) {
  if (!isNonEmptyString(signature)) return null;

  const trimmed = signature.trim();

  if (/^[0-9a-fA-F]+$/.test(trimmed) && trimmed.length % 2 === 0) {
    return Buffer.from(trimmed, "hex");
  }

  try {
    return Buffer.from(trimmed, "base64");
  } catch {
    return null;
  }
}

function parseEd25519PublicKey(pubkey) {
  if (!isNonEmptyString(pubkey)) return null;

  const trimmed = pubkey.trim();

  try {
    if (trimmed.includes("-----BEGIN PUBLIC KEY-----")) {
      return crypto.createPublicKey(trimmed);
    }
  } catch {
    return null;
  }

  let bytes = null;

  if (/^[0-9a-fA-F]+$/.test(trimmed) && trimmed.length % 2 === 0) {
    bytes = Buffer.from(trimmed, "hex");
  } else {
    try {
      bytes = Buffer.from(trimmed, "base64");
    } catch {
      bytes = null;
    }
  }

  if (!bytes || bytes.length === 0) return null;

  try {
    return crypto.createPublicKey({
      key: bytes,
      format: "der",
      type: "spki"
    });
  } catch {
    // Continue below.
  }

  if (bytes.length === 32) {
    try {
      const ed25519SpkiPrefix = Buffer.from("302a300506032b6570032100", "hex");
      return crypto.createPublicKey({
        key: Buffer.concat([ed25519SpkiPrefix, bytes]),
        format: "der",
        type: "spki"
      });
    } catch {
      return null;
    }
  }

  return null;
}

function verifySignatureBlock(signatureBlock, bytes) {
  if (!signatureBlock || typeof signatureBlock !== "object") {
    return { ok: false, reason: "MISSING_SIGNATURE_BLOCK" };
  }

  const { sign_alg, pubkey, signature } = signatureBlock;

  if (!isNonEmptyString(sign_alg) || !isNonEmptyString(pubkey) || !isNonEmptyString(signature)) {
    return { ok: false, reason: "INCOMPLETE_SIGNATURE_FIELDS" };
  }

  if (sign_alg !== "ED25519") {
    return { ok: false, reason: "UNSUPPORTED_SIGNATURE_ALGORITHM" };
  }

  if (isPlaceholder(pubkey) || isPlaceholder(signature)) {
    if (ALLOW_PLACEHOLDER_SIGNATURES) {
      return { ok: true, reason: "PLACEHOLDER_SIGNATURE_ALLOWED_RND_ONLY" };
    }

    return { ok: false, reason: "PLACEHOLDER_SIGNATURE_FAIL_CLOSED" };
  }

  const keyObject = parseEd25519PublicKey(pubkey);
  if (!keyObject) {
    return { ok: false, reason: "PUBLIC_KEY_PARSE_FAIL" };
  }

  const signatureBytes = parseSignature(signature);
  if (!signatureBytes) {
    return { ok: false, reason: "SIGNATURE_PARSE_FAIL" };
  }

  try {
    const ok = crypto.verify(null, bytes, keyObject, signatureBytes);
    return ok ? { ok: true, reason: "SIGNATURE_OK" } : { ok: false, reason: "SIGNATURE_INVALID" };
  } catch {
    return { ok: false, reason: "SIGNATURE_VERIFY_EXCEPTION" };
  }
}

// -----------------------------------------------------------------------------
// Ledger loading
// -----------------------------------------------------------------------------

let ledgerRaw;

try {
  ledgerRaw = fs.readFileSync(ledgerPath, "utf8");
} catch {
  die(`Cannot read ledger file: ${ledgerPath}`);
}

let ledger;

try {
  ledger = JSON.parse(ledgerRaw);
} catch {
  die("Ledger is not valid JSON.");
}

if (!ledger || ledger.proto !== "HBCE-LEDGER-v1" || !Array.isArray(ledger.records)) {
  die("Ledger format invalid: expected proto=HBCE-LEDGER-v1 and records array.");
}

// -----------------------------------------------------------------------------
// Core ledger logic
// -----------------------------------------------------------------------------

function rebuildLedgerHashes(inputLedger) {
  const output = JSON.parse(JSON.stringify(inputLedger));
  let previousHash = null;

  for (const record of output.records) {
    record.prev_record_sha256 = previousHash;

    const hashMaterial = stripForHashAndSignature(record);
    const recordHash = sha256HexFromCanonicalJson(hashMaterial);

    record.record_sha256 = recordHash;
    previousHash = recordHash;
  }

  output.head_record_sha256 = previousHash;
  output.cryptographic_status = "REBUILT_REFERENCE_HASHES";
  output.integrity_note = "Record hashes were rebuilt from canonical JSON by hbce-verify.reference.js. Signature validity still depends on real non-placeholder ED25519 signatures unless demo flags are used.";

  return output;
}

function checkChainIntegrity(ledgerObject, options = {}) {
  const strictMatch = options.strictMatch !== false;
  const errors = [];
  let previousHash = null;

  for (let index = 0; index < ledgerObject.records.length; index += 1) {
    const record = ledgerObject.records[index];

    if (record.prev_record_sha256 !== previousHash) {
      errors.push({
        index,
        code: "PREV_POINTER_MISMATCH",
        expected_prev: previousHash,
        got_prev: record.prev_record_sha256
      });
    }

    const hashMaterial = stripForHashAndSignature(record);
    const computedHash = sha256HexFromCanonicalJson(hashMaterial);

    if (strictMatch) {
      if (!isHex64(record.record_sha256)) {
        errors.push({
          index,
          code: "RECORD_SHA256_INVALID_FORMAT",
          got: record.record_sha256
        });
      } else if (record.record_sha256.toLowerCase() !== computedHash.toLowerCase()) {
        errors.push({
          index,
          code: "RECORD_SHA256_MISMATCH",
          expected_record_sha256: computedHash,
          got_record_sha256: record.record_sha256
        });
      }
    }

    previousHash = record.record_sha256 || computedHash;
  }

  if (strictMatch) {
    if (!isHex64(ledgerObject.head_record_sha256)) {
      errors.push({
        code: "HEAD_SHA256_INVALID_FORMAT",
        got: ledgerObject.head_record_sha256
      });
    } else if (ledgerObject.head_record_sha256.toLowerCase() !== String(previousHash || "").toLowerCase()) {
      errors.push({
        code: "HEAD_POINTER_MISMATCH",
        expected_head: previousHash,
        got_head: ledgerObject.head_record_sha256
      });
    }
  }

  return {
    ok: errors.length === 0,
    strict: strictMatch,
    errors
  };
}

function indexRecords(ledgerObject) {
  const byEntity = new Map();
  const byOperator = new Map();
  const byEvent = new Map();

  for (const record of ledgerObject.records) {
    if ((record.kind === "IPR_ROOT_RECORD" || record.kind === "IPR_DERIVED_RECORD") && record.entity_id) {
      if (!byEntity.has(record.entity_id)) byEntity.set(record.entity_id, []);
      byEntity.get(record.entity_id).push(record);
    }

    if (record.kind === "IPR_OPERATOR_RECORD" && record.operator_id) {
      if (!byOperator.has(record.operator_id)) byOperator.set(record.operator_id, []);
      byOperator.get(record.operator_id).push(record);
    }

    if (record.kind === "IPR_EVENT_RECORD" && record.event_id) {
      byEvent.set(record.event_id, record);
    }
  }

  for (const [entityId, timeline] of byEntity.entries()) {
    timeline.sort((a, b) => String(a.timestamp).localeCompare(String(b.timestamp)));
    byEntity.set(entityId, timeline);
  }

  for (const [operatorId, timeline] of byOperator.entries()) {
    timeline.sort((a, b) => String(a.timestamp).localeCompare(String(b.timestamp)));
    byOperator.set(operatorId, timeline);
  }

  return {
    byEntity,
    byOperator,
    byEvent
  };
}

function validateBaseRecordFields(record) {
  if (!record || typeof record !== "object") {
    return { ok: false, reason: "RECORD_NOT_OBJECT" };
  }

  if (!isNonEmptyString(record.proto) || record.proto !== "HBCE-REGISTRY-v1") {
    return { ok: false, reason: "INVALID_PROTO" };
  }

  if (!isNonEmptyString(record.kind)) {
    return { ok: false, reason: "MISSING_KIND" };
  }

  if (!isNonEmptyString(record.timestamp)) {
    return { ok: false, reason: "MISSING_TIMESTAMP" };
  }

  if (!isNonEmptyString(record.status)) {
    return { ok: false, reason: "MISSING_STATUS" };
  }

  return { ok: true, reason: "BASE_FIELDS_OK" };
}

function verifyIssuerSignature(record) {
  const material = stripForHashAndSignature(record);
  const bytes = canonicalBytes(material);
  const signatureResult = verifySignatureBlock(record.issuer, bytes);

  if (!signatureResult.ok) {
    return {
      ok: false,
      reason: `ISSUER_SIGNATURE_${signatureResult.reason}`
    };
  }

  return {
    ok: true,
    reason: signatureResult.reason
  };
}

function verifyOperatorSignature(eventRecord) {
  const material = stripForHashAndSignature(eventRecord);
  const bytes = canonicalBytes(material);
  const signatureResult = verifySignatureBlock(eventRecord.operator, bytes);

  if (!signatureResult.ok) {
    return {
      ok: false,
      reason: `OPERATOR_SIGNATURE_${signatureResult.reason}`
    };
  }

  return {
    ok: true,
    reason: signatureResult.reason
  };
}

function lastStatusFromTimeline(timeline) {
  if (!timeline || timeline.length === 0) {
    return {
      status: "INVALID",
      reason: "NO_RECORDS"
    };
  }

  const last = timeline[timeline.length - 1];

  if (last.status === "VALID") {
    return {
      status: "VALID",
      reason: "LAST_RECORD_VALID",
      last_record_kind: last.kind,
      timestamp: last.timestamp
    };
  }

  if (last.status === "RND_ONLY") {
    if (ALLOW_RND_STATUS) {
      return {
        status: "VALID_RND_ONLY",
        reason: "LAST_RECORD_RND_ONLY_ALLOWED",
        last_record_kind: last.kind,
        timestamp: last.timestamp
      };
    }

    return {
      status: "INVALID",
      reason: "RND_ONLY_NOT_PRODUCTION_VALID",
      last_record_kind: last.kind,
      timestamp: last.timestamp
    };
  }

  return {
    status: "INVALID",
    reason: `ENTITY_STATUS_${last.status || "UNKNOWN"}`,
    last_record_kind: last.kind,
    timestamp: last.timestamp
  };
}

function verifyOperator(ledgerObject, operatorId) {
  const { byOperator } = indexRecords(ledgerObject);
  const timeline = byOperator.get(operatorId);

  if (!timeline || timeline.length === 0) {
    return {
      status: "INVALID",
      reason: "OPERATOR_NOT_FOUND"
    };
  }

  for (const record of timeline) {
    const base = validateBaseRecordFields(record);
    if (!base.ok) {
      return {
        status: "INVALID",
        reason: base.reason,
        at: record.timestamp
      };
    }

    if (record.kind !== "IPR_OPERATOR_RECORD") {
      return {
        status: "INVALID",
        reason: "INVALID_OPERATOR_RECORD_KIND",
        at: record.timestamp
      };
    }

    if (!isHex64(record.payload_sha256)) {
      return {
        status: "INVALID",
        reason: "OPERATOR_PAYLOAD_SHA256_INVALID",
        at: record.timestamp
      };
    }

    const sig = verifyIssuerSignature(record);
    if (!sig.ok) {
      return {
        status: "INVALID",
        reason: sig.reason,
        at: record.timestamp
      };
    }
  }

  const status = lastStatusFromTimeline(timeline);

  if (status.status !== "VALID" && status.status !== "VALID_RND_ONLY") {
    return status;
  }

  return {
    status: normalizeStatusForResult(timeline[timeline.length - 1].status),
    reason: "OPERATOR_OK",
    operator_id: operatorId
  };
}

function verifyEntity(ledgerObject, entityId, seen = new Set()) {
  const { byEntity } = indexRecords(ledgerObject);
  const timeline = byEntity.get(entityId);

  if (!timeline || timeline.length === 0) {
    return {
      status: "INVALID",
      reason: "ENTITY_NOT_FOUND"
    };
  }

  if (seen.has(entityId)) {
    return {
      status: "INVALID",
      reason: "DERIVATION_CYCLE_DETECTED"
    };
  }

  seen.add(entityId);

  for (const record of timeline) {
    const base = validateBaseRecordFields(record);
    if (!base.ok) {
      return {
        status: "INVALID",
        reason: base.reason,
        at: record.timestamp
      };
    }

    if (record.kind !== "IPR_ROOT_RECORD" && record.kind !== "IPR_DERIVED_RECORD") {
      return {
        status: "INVALID",
        reason: "INVALID_ENTITY_RECORD_KIND",
        at: record.timestamp
      };
    }

    if (!isNonEmptyString(record.entity_id)) {
      return {
        status: "INVALID",
        reason: "MISSING_ENTITY_ID",
        at: record.timestamp
      };
    }

    if (!isNonEmptyString(record.entity_type)) {
      return {
        status: "INVALID",
        reason: "MISSING_ENTITY_TYPE",
        at: record.timestamp
      };
    }

    if (!isHex64(record.payload_sha256)) {
      return {
        status: "INVALID",
        reason: "PAYLOAD_SHA256_INVALID",
        at: record.timestamp
      };
    }

    if (record.kind === "IPR_DERIVED_RECORD") {
      if (!isNonEmptyString(record.parent_entity_id)) {
        return {
          status: "INVALID",
          reason: "MISSING_PARENT_ENTITY_ID",
          at: record.timestamp
        };
      }

      if (!record.rules || record.rules.fail_closed !== true || record.rules.inherit_invalidity !== true || record.rules.append_only !== true) {
        return {
          status: "INVALID",
          reason: "DERIVATION_RULES_INVALID",
          at: record.timestamp
        };
      }
    }

    const sig = verifyIssuerSignature(record);
    if (!sig.ok) {
      return {
        status: "INVALID",
        reason: sig.reason,
        at: record.timestamp
      };
    }
  }

  const status = lastStatusFromTimeline(timeline);

  if (status.status !== "VALID" && status.status !== "VALID_RND_ONLY") {
    return status;
  }

  const last = timeline[timeline.length - 1];

  if (last.kind === "IPR_DERIVED_RECORD") {
    const parentResult = verifyEntity(ledgerObject, last.parent_entity_id, seen);

    if (parentResult.status !== "VALID" && parentResult.status !== "VALID_RND_ONLY") {
      return {
        status: "INVALID",
        reason: "PARENT_INVALID",
        parent_entity_id: last.parent_entity_id,
        parent: parentResult
      };
    }
  }

  return {
    status: normalizeStatusForResult(last.status),
    reason: "ENTITY_OK",
    entity_id: entityId,
    entity_type: last.entity_type
  };
}

function verifyEvent(ledgerObject, eventId) {
  const { byEvent } = indexRecords(ledgerObject);
  const eventRecord = byEvent.get(eventId);

  if (!eventRecord) {
    return {
      status: "INVALID",
      reason: "EVENT_NOT_FOUND"
    };
  }

  const base = validateBaseRecordFields(eventRecord);
  if (!base.ok) {
    return {
      status: "INVALID",
      reason: base.reason,
      event_id: eventId
    };
  }

  if (eventRecord.kind !== "IPR_EVENT_RECORD") {
    return {
      status: "INVALID",
      reason: "INVALID_EVENT_RECORD_KIND",
      event_id: eventId
    };
  }

  if (!isNonEmptyString(eventRecord.entity_id)) {
    return {
      status: "INVALID",
      reason: "EVENT_ENTITY_ID_MISSING",
      event_id: eventId
    };
  }

  if (!isNonEmptyString(eventRecord.event_type)) {
    return {
      status: "INVALID",
      reason: "EVENT_TYPE_MISSING",
      event_id: eventId
    };
  }

  if (!isHex64(eventRecord.event_payload_sha256)) {
    return {
      status: "INVALID",
      reason: "EVENT_PAYLOAD_SHA256_INVALID",
      event_id: eventId
    };
  }

  if (eventRecord.append_only !== true) {
    return {
      status: "INVALID",
      reason: "EVENT_APPEND_ONLY_NOT_TRUE",
      event_id: eventId
    };
  }

  const eventStatus = eventRecord.status;

  if (!isAcceptableRecordStatus(eventStatus)) {
    return {
      status: "INVALID",
      reason: `EVENT_STATUS_${eventStatus || "UNKNOWN"}_NOT_ACCEPTABLE`,
      event_id: eventId
    };
  }

  const operatorId = eventRecord.operator && eventRecord.operator.operator_id;

  if (!isNonEmptyString(operatorId)) {
    return {
      status: "INVALID",
      reason: "EVENT_OPERATOR_ID_MISSING",
      event_id: eventId
    };
  }

  const operatorSignature = verifyOperatorSignature(eventRecord);
  if (!operatorSignature.ok) {
    return {
      status: "INVALID",
      reason: operatorSignature.reason,
      event_id: eventId
    };
  }

  const operatorResult = verifyOperator(ledgerObject, operatorId);
  if (operatorResult.status !== "VALID" && operatorResult.status !== "VALID_RND_ONLY") {
    return {
      status: "INVALID",
      reason: "OPERATOR_INVALID_FOR_EVENT",
      event_id: eventId,
      operator: operatorResult
    };
  }

  const entityResult = verifyEntity(ledgerObject, eventRecord.entity_id);
  if (entityResult.status !== "VALID" && entityResult.status !== "VALID_RND_ONLY") {
    return {
      status: "INVALID",
      reason: "ENTITY_INVALID_FOR_EVENT",
      event_id: eventId,
      entity: entityResult
    };
  }

  return {
    status: normalizeStatusForResult(eventStatus),
    reason: "EVENT_OK",
    event: {
      event_id: eventRecord.event_id,
      entity_id: eventRecord.entity_id,
      event_type: eventRecord.event_type,
      timestamp: eventRecord.timestamp,
      public_payload_policy: "HASH_ONLY"
    }
  };
}

function buildVerificationEnvelope(query, result) {
  return {
    proto: "HBCE-VERIFY-v1",
    verifier: {
      name: "hbce-verify.reference.js",
      scope: "RND_REFERENCE_FAIL_CLOSED",
      primary_use: "IPR_AI_AUDIT_TRAIL_MVP",
      product_hierarchy: {
        product: "IPR",
        mvp: "IPR_AI_AUDIT_TRAIL",
        ecosystem: "HBCE",
        runtime: "JOKER-C2",
        framework: "MATRIX"
      },
      allow_rnd_status: ALLOW_RND_STATUS,
      allow_placeholder_signatures: ALLOW_PLACEHOLDER_SIGNATURES
    },
    query,
    result
  };
}

// -----------------------------------------------------------------------------
// Commands
// -----------------------------------------------------------------------------

if (command === "--rebuild") {
  const rebuilt = rebuildLedgerHashes(ledger);
  process.stdout.write(`${JSON.stringify(rebuilt, null, 2)}\n`);
  process.exit(0);
}

if (command === "--check-chain") {
  const strictMatch = !flags.has("--non-strict");
  const result = checkChainIntegrity(ledger, { strictMatch });

  if (result.ok) {
    console.log("CHAIN_OK");
    console.log(JSON.stringify({
      proto: "HBCE-VERIFY-v1",
      result: {
        status: "VALID",
        reason: strictMatch ? "CHAIN_AND_HASHES_OK" : "CHAIN_POINTERS_OK_NON_STRICT",
        strict: strictMatch
      }
    }, null, 2));
    process.exit(0);
  }

  console.log("CHAIN_FAIL");
  console.log(JSON.stringify({
    proto: "HBCE-VERIFY-v1",
    result: {
      status: "INVALID",
      reason: "CHAIN_INTEGRITY_FAIL",
      strict: strictMatch,
      chain: result
    }
  }, null, 2));
  process.exit(1);
}

if (command === "--verify-entity") {
  if (!arg) die("Missing entity_id argument for --verify-entity");

  const chainStrict = !flags.has("--skip-chain");

  if (chainStrict) {
    const chain = checkChainIntegrity(ledger, { strictMatch: true });

    if (!chain.ok) {
      const envelope = buildVerificationEnvelope(
        { entity_id: arg },
        {
          status: "INVALID",
          reason: "CHAIN_INTEGRITY_FAIL",
          chain
        }
      );

      console.log(JSON.stringify(envelope, null, 2));
      process.exit(1);
    }
  }

  const result = verifyEntity(ledger, arg);
  console.log(JSON.stringify(buildVerificationEnvelope({ entity_id: arg }, result), null, 2));
  process.exit(result.status === "VALID" || result.status === "VALID_RND_ONLY" ? 0 : 1);
}

if (command === "--verify-event") {
  if (!arg) die("Missing event_id argument for --verify-event");

  const chainStrict = !flags.has("--skip-chain");

  if (chainStrict) {
    const chain = checkChainIntegrity(ledger, { strictMatch: true });

    if (!chain.ok) {
      const envelope = buildVerificationEnvelope(
        { event_id: arg },
        {
          status: "INVALID",
          reason: "CHAIN_INTEGRITY_FAIL",
          chain
        }
      );

      console.log(JSON.stringify(envelope, null, 2));
      process.exit(1);
    }
  }

  const result = verifyEvent(ledger, arg);
  console.log(JSON.stringify(buildVerificationEnvelope({ event_id: arg }, result), null, 2));
  process.exit(result.status === "VALID" || result.status === "VALID_RND_ONLY" ? 0 : 1);
}

die(`Unknown command: ${command}`);
