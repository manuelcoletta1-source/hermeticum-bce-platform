#!/usr/bin/env node
/**
 * HBCE Reference Verifier — "hard mode"
 * - Verifies append-only chain integrity (prev_record_sha256 -> record_sha256)
 * - Rebuilds record hashes deterministically (canonical JSON)
 * - Verifies entity status + derivation (parent must be VALID)
 * - Optional signature verification hook (ED25519) — stubbed for now
 *
 * Why rebuild mode exists:
 * The example ledger includes illustrative record_sha256 values.
 * Use `--rebuild` to generate a fully self-consistent chain.
 *
 * Usage:
 *   node protocol/hbce-verify.reference.js protocol/hbce-registry-ledger.example.json --verify-entity IPR-DEV-ROBOT-0001
 *   node protocol/hbce-verify.reference.js protocol/hbce-registry-ledger.example.json --verify-event EVT-EXAMPLE-0002
 *   node protocol/hbce-verify.reference.js protocol/hbce-registry-ledger.example.json --check-chain
 *   node protocol/hbce-verify.reference.js protocol/hbce-registry-ledger.example.json --rebuild > protocol/hbce-registry-ledger.rebuilt.json
 *
 * Notes:
 * - Fail-closed is enforced for structural rules and derivation rules.
 * - Signature verification is implemented as a strict hook:
 *   by default it FAILS if signature is placeholder (fail-closed).
 *   You can enable demo bypass with: --allow-placeholder-signatures
 */

const fs = require("fs");
const crypto = require("crypto");

// ----------------------------- CLI parsing -----------------------------

const argv = process.argv.slice(2);
if (argv.length < 2) {
  console.error("Usage: node hbce-verify.reference.js <ledger.json> <command> [arg] [flags]");
  process.exit(2);
}

const ledgerPath = argv[0];
const command = argv[1];
const arg = argv[2];

const flags = new Set(argv.filter((a) => a.startsWith("--")));
const ALLOW_PLACEHOLDER_SIGNATURES = flags.has("--allow-placeholder-signatures");

// ----------------------------- Helpers -----------------------------

function die(msg, code = 1) {
  console.error(msg);
  process.exit(code);
}

function isHex64(s) {
  return typeof s === "string" && /^[0-9a-fA-F]{64}$/.test(s);
}

/**
 * Canonicalize JSON:
 * - Sort object keys lexicographically
 * - Arrays keep order
 * - No whitespace (JSON.stringify)
 */
function canonicalize(value) {
  if (value === null) return null;
  if (Array.isArray(value)) return value.map(canonicalize);
  if (typeof value === "object") {
    const out = {};
    for (const k of Object.keys(value).sort()) {
      out[k] = canonicalize(value[k]);
    }
    return out;
  }
  return value;
}

function sha256HexFromBytes(buf) {
  return crypto.createHash("sha256").update(buf).digest("hex");
}

function sha256HexFromCanonicalJson(obj) {
  const canon = canonicalize(obj);
  const json = JSON.stringify(canon);
  return sha256HexFromBytes(Buffer.from(json, "utf8"));
}

/**
 * Build a "hash material" view of a record.
 * We exclude:
 * - record_sha256 / prev_record_sha256 (ledger linkage fields)
 * - signature fields (issuer.signature, operator.signature)
 * Because signatures are computed over canonical record bytes without signature itself.
 */
function stripForHash(record) {
  const r = JSON.parse(JSON.stringify(record));

  // Remove ledger linkage fields
  delete r.prev_record_sha256;
  delete r.record_sha256;

  // Remove known signature fields
  if (r.issuer && typeof r.issuer === "object") {
    delete r.issuer.signature;
  }
  if (r.operator && typeof r.operator === "object") {
    delete r.operator.signature;
  }

  return r;
}

/**
 * Signature verification hook.
 * For v1 reference: we enforce that signature must not be placeholder unless demo flag is provided.
 * Implement ED25519 verify when you start producing real signatures.
 */
function verifySignatureBlock(sigBlock, canonicalBytes) {
  if (!sigBlock || typeof sigBlock !== "object") return { ok: false, reason: "MISSING_SIGNATURE_BLOCK" };
  const { sign_alg, pubkey, signature } = sigBlock;

  if (!sign_alg || !pubkey || !signature) return { ok: false, reason: "INCOMPLETE_SIGNATURE_FIELDS" };

  const looksPlaceholder =
    String(pubkey).includes("PLACEHOLDER") || String(signature).includes("PLACEHOLDER");

  if (looksPlaceholder) {
    if (ALLOW_PLACEHOLDER_SIGNATURES) return { ok: true, reason: "PLACEHOLDER_SIGNATURE_ALLOWED" };
    return { ok: false, reason: "PLACEHOLDER_SIGNATURE_FAIL_CLOSED" };
  }

  // Real ED25519 verification (expects pubkey/signature in base64 or hex) can be implemented here.
  // Node supports ed25519 via crypto.verify with KeyObject. This requires strict encoding + key format decisions.
  return { ok: false, reason: "SIGNATURE_VERIFY_NOT_IMPLEMENTED_WITH_REAL_KEYS_YET" };
}

// ----------------------------- Load ledger -----------------------------

let ledgerRaw;
try {
  ledgerRaw = fs.readFileSync(ledgerPath, "utf8");
} catch (e) {
  die(`Cannot read ledger file: ${ledgerPath}`);
}

let ledger;
try {
  ledger = JSON.parse(ledgerRaw);
} catch (e) {
  die("Ledger is not valid JSON.");
}

if (!ledger || ledger.proto !== "HBCE-LEDGER-v1" || !Array.isArray(ledger.records)) {
  die("Ledger format invalid: expected proto=HBCE-LEDGER-v1 and records array.");
}

// ----------------------------- Core logic -----------------------------

function rebuildLedgerHashes(inputLedger) {
  const out = JSON.parse(JSON.stringify(inputLedger));
  let prev = null;

  for (const rec of out.records) {
    rec.prev_record_sha256 = prev;

    const hashMaterial = stripForHash(rec);
    const recHash = sha256HexFromCanonicalJson(hashMaterial);

    rec.record_sha256 = recHash;
    prev = recHash;
  }

  out.head_record_sha256 = prev;
  return out;
}

function checkChainIntegrity(ledgerObj, { strictMatch = true } = {}) {
  const errors = [];
  let prev = null;

  for (let i = 0; i < ledgerObj.records.length; i++) {
    const rec = ledgerObj.records[i];

    if (rec.prev_record_sha256 !== prev) {
      errors.push({
        index: i,
        code: "PREV_POINTER_MISMATCH",
        expected_prev: prev,
        got_prev: rec.prev_record_sha256
      });
    }

    // Recompute record_sha256 deterministically
    const hashMaterial = stripForHash(rec);
    const computed = sha256HexFromCanonicalJson(hashMaterial);

    if (strictMatch) {
      if (!isHex64(rec.record_sha256)) {
        errors.push({ index: i, code: "RECORD_SHA256_INVALID_FORMAT", got: rec.record_sha256 });
      } else if (rec.record_sha256.toLowerCase() !== computed.toLowerCase()) {
        errors.push({
          index: i,
          code: "RECORD_SHA256_MISMATCH",
          expected_record_sha256: computed,
          got_record_sha256: rec.record_sha256
        });
      }
    }

    prev = rec.record_sha256 || computed;
  }

  // head pointer check
  if (strictMatch) {
    if (!isHex64(ledgerObj.head_record_sha256)) {
      errors.push({ code: "HEAD_SHA256_INVALID_FORMAT", got: ledgerObj.head_record_sha256 });
    } else if (ledgerObj.head_record_sha256.toLowerCase() !== (prev || "").toLowerCase()) {
      errors.push({
        code: "HEAD_POINTER_MISMATCH",
        expected_head: prev,
        got_head: ledgerObj.head_record_sha256
      });
    }
  }

  return { ok: errors.length === 0, errors };
}

function indexRecords(ledgerObj) {
  const byEntity = new Map();
  const byEvent = new Map();

  for (const rec of ledgerObj.records) {
    if (rec.kind === "IPR_EVENT_RECORD" && rec.event_id) {
      byEvent.set(rec.event_id, rec);
    }

    // Root / Derived records have entity_id
    if ((rec.kind === "IPR_ROOT_RECORD" || rec.kind === "IPR_DERIVED_RECORD") && rec.entity_id) {
      if (!byEntity.has(rec.entity_id)) byEntity.set(rec.entity_id, []);
      byEntity.get(rec.entity_id).push(rec);
    }

    // Operator record uses operator_id (treat as entity-like)
    if (rec.kind === "IPR_OPERATOR_RECORD" && rec.operator_id) {
      if (!byEntity.has(rec.operator_id)) byEntity.set(rec.operator_id, []);
      byEntity.get(rec.operator_id).push(rec);
    }
  }

  // Sort timelines by timestamp
  for (const [id, arr] of byEntity.entries()) {
    arr.sort((a, b) => String(a.timestamp).localeCompare(String(b.timestamp)));
    byEntity.set(id, arr);
  }

  return { byEntity, byEvent };
}

function currentStatusForEntity(timeline) {
  // Fail-closed: no timeline -> INVALID
  if (!timeline || timeline.length === 0) return { status: "INVALID", reason: "NO_RECORDS" };

  // Use last record's status as authoritative baseline
  const last = timeline[timeline.length - 1];
  const st = last.status;
  if (st === "VALID" || st === "INVALID" || st === "REVOKED") return { status: st, reason: "LAST_RECORD_STATUS" };
  return { status: "INVALID", reason: "UNKNOWN_STATUS" };
}

function verifyEntity(ledgerObj, entityId) {
  const { byEntity } = indexRecords(ledgerObj);
  const timeline = byEntity.get(entityId);

  // Structural checks (fail-closed)
  if (!timeline || timeline.length === 0) {
    return { status: "INVALID", reason: "ENTITY_NOT_FOUND" };
  }

  // Verify signatures (strict)
  for (const rec of timeline) {
    const hashMaterial = stripForHash(rec);
    const canon = canonicalize(hashMaterial);
    const bytes = Buffer.from(JSON.stringify(canon), "utf8");

    if (rec.kind === "IPR_EVENT_RECORD") {
      const sig = verifySignatureBlock(rec.operator, bytes);
      if (!sig.ok) return { status: "INVALID", reason: `OPERATOR_SIGNATURE_${sig.reason}`, at: rec.timestamp };
    } else {
      const sig = verifySignatureBlock(rec.issuer, bytes);
      if (!sig.ok) return { status: "INVALID", reason: `ISSUER_SIGNATURE_${sig.reason}`, at: rec.timestamp };
    }
  }

  // Status evaluation (last record wins)
  const st = currentStatusForEntity(timeline);
  if (st.status !== "VALID") return { status: "INVALID", reason: `ENTITY_STATUS_${st.status}` };

  // Derivation rule: if derived -> parent must be VALID
  const last = timeline[timeline.length - 1];
  if (last.kind === "IPR_DERIVED_RECORD") {
    const parentId = last.parent_entity_id;
    if (!parentId) return { status: "INVALID", reason: "MISSING_PARENT_ENTITY_ID" };

    const parentRes = verifyEntity(ledgerObj, parentId);
    if (parentRes.status !== "VALID") return { status: "INVALID", reason: "PARENT_INVALID", parent: parentRes };
  }

  return { status: "VALID", reason: "ALL_CHECKS_PASSED" };
}

function verifyEvent(ledgerObj, eventId) {
  const { byEvent } = indexRecords(ledgerObj);
  const ev = byEvent.get(eventId);
  if (!ev) return { status: "INVALID", reason: "EVENT_NOT_FOUND" };

  // fail-closed field checks
  if (!ev.entity_id || !ev.event_payload_sha256 || !isHex64(ev.event_payload_sha256)) {
    return { status: "INVALID", reason: "EVENT_FIELDS_INVALID" };
  }

  // entity must be VALID
  const entRes = verifyEntity(ledgerObj, ev.entity_id);
  if (entRes.status !== "VALID") return { status: "INVALID", reason: "ENTITY_INVALID_FOR_EVENT", entity: entRes };

  return { status: "VALID", reason: "EVENT_OK", event: { event_id: ev.event_id, entity_id: ev.entity_id, event_type: ev.event_type } };
}

// ----------------------------- Commands -----------------------------

if (command === "--rebuild") {
  const rebuilt = rebuildLedgerHashes(ledger);
  process.stdout.write(JSON.stringify(rebuilt, null, 2) + "\n");
  process.exit(0);
}

if (command === "--check-chain") {
  const strictMatch = !flags.has("--non-strict");
  const res = checkChainIntegrity(ledger, { strictMatch });
  if (res.ok) {
    console.log("CHAIN_OK");
    process.exit(0);
  }
  console.log("CHAIN_FAIL");
  console.log(JSON.stringify(res, null, 2));
  process.exit(1);
}

if (command === "--verify-entity") {
  if (!arg) die("Missing entity_id argument for --verify-entity");
  const chainStrict = !flags.has("--skip-chain");
  if (chainStrict) {
    const chain = checkChainIntegrity(ledger, { strictMatch: true });
    if (!chain.ok) {
      console.log("INVALID");
      console.log(JSON.stringify({ status: "INVALID", reason: "CHAIN_INTEGRITY_FAIL", chain }, null, 2));
      process.exit(1);
    }
  }
  const res = verifyEntity(ledger, arg);
  console.log(JSON.stringify({ proto: "HBCE-VERIFY-v1", query: { entity_id: arg }, result: res }, null, 2));
  process.exit(res.status === "VALID" ? 0 : 1);
}

if (command === "--verify-event") {
  if (!arg) die("Missing event_id argument for --verify-event");
  const chainStrict = !flags.has("--skip-chain");
  if (chainStrict) {
    const chain = checkChainIntegrity(ledger, { strictMatch: true });
    if (!chain.ok) {
      console.log("INVALID");
      console.log(JSON.stringify({ status: "INVALID", reason: "CHAIN_INTEGRITY_FAIL", chain }, null, 2));
      process.exit(1);
    }
  }
  const res = verifyEvent(ledger, arg);
  console.log(JSON.stringify({ proto: "HBCE-VERIFY-v1", query: { event_id: arg }, result: res }, null, 2));
  process.exit(res.status === "VALID" ? 0 : 1);
}

die(`Unknown command: ${command}`);
