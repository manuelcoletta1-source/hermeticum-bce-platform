#!/usr/bin/env node
/**
 * HBCE Sign Reference — ED25519
 * - Generates ED25519 keypairs
 * - Signs HBCE records deterministically (canonical JSON v1)
 * - Produces real signatures so hbce-verify.reference.js can go fully fail-closed
 *
 * Usage:
 *   node protocol/hbce-sign.reference.js --keygen issuer > protocol/keys/issuer.ed25519.json
 *   node protocol/hbce-sign.reference.js --keygen operator > protocol/keys/operator.ed25519.json
 *
 *   node protocol/hbce-sign.reference.js --sign-ledger \
 *     protocol/hbce-registry-ledger.rebuilt.json \
 *     protocol/keys/issuer.ed25519.json \
 *     protocol/keys/operator.ed25519.json \
 *     > protocol/hbce-registry-ledger.signed.json
 *
 *   node protocol/hbce-sign.reference.js --sign-record \
 *     protocol/sample-record.json \
 *     protocol/keys/issuer.ed25519.json \
 *     --as issuer \
 *     > protocol/sample-record.signed.json
 *
 * Notes:
 * - Pubkey/signature are base64 by default.
 * - Signature is over canonical JSON bytes of the record WITH:
 *   - record_sha256/prev_record_sha256 removed
 *   - issuer.signature removed (if signing issuer)
 *   - operator.signature removed (if signing operator)
 */

const fs = require("fs");
const crypto = require("crypto");

// ----------------------------- CLI parsing -----------------------------

const argv = process.argv.slice(2);

function has(flag) {
  return argv.includes(flag);
}
function idx(flag) {
  return argv.indexOf(flag);
}
function argAfter(flag) {
  const i = idx(flag);
  if (i === -1) return null;
  return argv[i + 1] ?? null;
}
function die(msg, code = 1) {
  console.error(msg);
  process.exit(code);
}

// ----------------------------- Canonical JSON -----------------------------

function canonicalize(value) {
  if (value === null) return null;
  if (Array.isArray(value)) return value.map(canonicalize);
  if (typeof value === "object") {
    const out = {};
    for (const k of Object.keys(value).sort()) out[k] = canonicalize(value[k]);
    return out;
  }
  return value;
}

/**
 * Strip fields excluded from signature preimage:
 * - ledger linkage: prev_record_sha256, record_sha256
 * - signature field(s) depending on who signs
 */
function stripForSignature(record, who /* "issuer" | "operator" */) {
  const r = JSON.parse(JSON.stringify(record));

  delete r.prev_record_sha256;
  delete r.record_sha256;

  if (who === "issuer") {
    if (r.issuer && typeof r.issuer === "object") delete r.issuer.signature;
  } else if (who === "operator") {
    if (r.operator && typeof r.operator === "object") delete r.operator.signature;
  } else {
    // if unknown, strip both (safer for preimage reproducibility checks)
    if (r.issuer && typeof r.issuer === "object") delete r.issuer.signature;
    if (r.operator && typeof r.operator === "object") delete r.operator.signature;
  }

  return r;
}

function canonicalBytes(obj) {
  const canon = canonicalize(obj);
  const json = JSON.stringify(canon);
  return Buffer.from(json, "utf8");
}

// ----------------------------- Key format -----------------------------

/**
 * We store keys in a JSON envelope so you can commit public keys and keep private keys local.
 *
 * Envelope:
 * {
 *   "proto":"HBCE-KEY-v1",
 *   "kind":"ED25519_KEYPAIR",
 *   "name":"issuer",
 *   "encoding":"base64",
 *   "public_key":"...",
 *   "private_key_pkcs8":"..."
 * }
 *
 * We use PKCS8 for private keys and SPKI for public keys (Node-friendly).
 */

function keygen(name) {
  const { publicKey, privateKey } = crypto.generateKeyPairSync("ed25519");
  const pubSpkiDer = publicKey.export({ type: "spki", format: "der" });
  const privPkcs8Der = privateKey.export({ type: "pkcs8", format: "der" });

  return {
    proto: "HBCE-KEY-v1",
    kind: "ED25519_KEYPAIR",
    name,
    encoding: "base64",
    public_key: pubSpkiDer.toString("base64"),
    private_key_pkcs8: privPkcs8Der.toString("base64"),
    created_at: new Date().toISOString()
  };
}

function loadKeyEnvelope(path) {
  const raw = fs.readFileSync(path, "utf8");
  const env = JSON.parse(raw);

  if (!env || env.proto !== "HBCE-KEY-v1" || env.kind !== "ED25519_KEYPAIR") {
    die(`Invalid key envelope: ${path}`);
  }
  if (env.encoding !== "base64") die(`Unsupported key encoding (expected base64): ${path}`);
  if (!env.public_key || !env.private_key_pkcs8) die(`Missing key material: ${path}`);

  const pubDer = Buffer.from(env.public_key, "base64");
  const privDer = Buffer.from(env.private_key_pkcs8, "base64");

  const publicKey = crypto.createPublicKey({ key: pubDer, format: "der", type: "spki" });
  const privateKey = crypto.createPrivateKey({ key: privDer, format: "der", type: "pkcs8" });

  return { env, publicKey, privateKey };
}

// ----------------------------- Signing -----------------------------

function signBytesEd25519(privateKey, bytes) {
  // For ed25519 in Node, algorithm is null.
  const sig = crypto.sign(null, bytes, privateKey);
  return sig;
}

function signRecord(record, keyEnvPath, who /* issuer|operator */) {
  const { env, privateKey } = loadKeyEnvelope(keyEnvPath);

  const material = stripForSignature(record, who);
  const bytes = canonicalBytes(material);
  const sig = signBytesEd25519(privateKey, bytes);

  const signature_b64 = sig.toString("base64");

  const out = JSON.parse(JSON.stringify(record));

  if (who === "issuer") {
    if (!out.issuer || typeof out.issuer !== "object") out.issuer = {};
    // Keep existing name/sign_alg if present; force ed25519 + pubkey for correctness.
    out.issuer.sign_alg = "ED25519";
    out.issuer.pubkey = env.public_key;
    out.issuer.signature = signature_b64;
  } else if (who === "operator") {
    if (!out.operator || typeof out.operator !== "object") out.operator = {};
    out.operator.sign_alg = "ED25519";
    out.operator.pubkey = env.public_key;
    out.operator.signature = signature_b64;
  } else {
    die(`Unknown signer role: ${who}`);
  }

  return out;
}

function signLedger(ledgerPath, issuerKeyPath, operatorKeyPath) {
  const ledger = JSON.parse(fs.readFileSync(ledgerPath, "utf8"));
  if (!ledger || ledger.proto !== "HBCE-LEDGER-v1" || !Array.isArray(ledger.records)) {
    die("Ledger format invalid: expected proto=HBCE-LEDGER-v1 and records array.");
  }

  const out = JSON.parse(JSON.stringify(ledger));

  for (let i = 0; i < out.records.length; i++) {
    const rec = out.records[i];

    // Decide who signs what:
    // - Root / Derived / Operator records: issuer signs
    // - Event records: operator signs
    if (rec.kind === "IPR_EVENT_RECORD") {
      out.records[i] = signRecord(rec, operatorKeyPath, "operator");
    } else {
      out.records[i] = signRecord(rec, issuerKeyPath, "issuer");
    }
  }

  return out;
}

// ----------------------------- Main -----------------------------

if (has("--keygen")) {
  const name = argAfter("--keygen");
  if (!name) die("Missing name after --keygen (e.g. issuer/operator)");
  const env = keygen(name);
  process.stdout.write(JSON.stringify(env, null, 2) + "\n");
  process.exit(0);
}

if (has("--sign-ledger")) {
  const ledgerPath = argv[idx("--sign-ledger") + 1];
  const issuerKeyPath = argv[idx("--sign-ledger") + 2];
  const operatorKeyPath = argv[idx("--sign-ledger") + 3];

  if (!ledgerPath || !issuerKeyPath || !operatorKeyPath) {
    die("Usage: --sign-ledger <ledger.json> <issuer.key.json> <operator.key.json>");
  }

  const signed = signLedger(ledgerPath, issuerKeyPath, operatorKeyPath);
  process.stdout.write(JSON.stringify(signed, null, 2) + "\n");
  process.exit(0);
}

if (has("--sign-record")) {
  const recordPath = argv[idx("--sign-record") + 1];
  const keyPath = argv[idx("--sign-record") + 2];

  const who = argAfter("--as");
  if (!recordPath || !keyPath || !who) {
    die("Usage: --sign-record <record.json> <key.json> --as issuer|operator");
  }

  const rec = JSON.parse(fs.readFileSync(recordPath, "utf8"));
  const signed = signRecord(rec, keyPath, who);
  process.stdout.write(JSON.stringify(signed, null, 2) + "\n");
  process.exit(0);
}

die(
  [
    "Unknown / missing command.",
    "Commands:",
    "  --keygen <name>",
    "  --sign-ledger <ledger.json> <issuer.key.json> <operator.key.json>",
    "  --sign-record <record.json> <key.json> --as issuer|operator"
  ].join("\n")
);
