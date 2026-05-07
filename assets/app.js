// HERMETICUM B.C.E. — shared client-side utilities
// Policy: local-first · hash-only · fail-closed · no public data custody

(function () {
  "use strict";

  const SEAL = "HERMETICUM - BLINDATA · COMPUTABILE · EVOLUTIVA";
  const ISSUER_LEGAL = "HERMETICUM B.C.E. S.r.l.";
  const ISSUER_LABEL = "HBCE_PUBLIC_ISSUER_001";

  function clean(value) {
    return String(value || "").trim();
  }

  function isSha256Lower(value) {
    return /^[a-f0-9]{64}$/.test(clean(value));
  }

  function nowISO() {
    return new Date().toISOString();
  }

  function sortKeys(value) {
    if (value === null || typeof value !== "object") return value;

    if (Array.isArray(value)) {
      return value.map(sortKeys);
    }

    const output = {};

    Object.keys(value)
      .sort()
      .forEach((key) => {
        if (value[key] !== undefined) {
          output[key] = sortKeys(value[key]);
        }
      });

    return output;
  }

  function canonicalStringify(value) {
    return JSON.stringify(sortKeys(value));
  }

  async function sha256Hex(text) {
    const encoded = new TextEncoder().encode(String(text || ""));
    const digest = await crypto.subtle.digest("SHA-256", encoded);

    return Array.from(new Uint8Array(digest))
      .map((byte) => byte.toString(16).padStart(2, "0"))
      .join("");
  }

  function downloadText(filename, text, mime) {
    const safeFilename = clean(filename) || "HBCE_DOWNLOAD.json";
    const blob = new Blob([String(text || "")], {
      type: mime || "application/json;charset=utf-8"
    });

    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");

    anchor.href = url;
    anchor.download = safeFilename;

    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();

    setTimeout(() => URL.revokeObjectURL(url), 1500);
  }

  function safeParseJson(text) {
    try {
      return {
        ok: true,
        value: JSON.parse(text)
      };
    } catch (error) {
      return {
        ok: false,
        error: String(error && error.message ? error.message : error)
      };
    }
  }

  function failClosed(reason) {
    const error = new Error("HBCE_APP_FAIL_CLOSED");
    error.detail = reason || "FAIL_CLOSED";
    throw error;
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

    Object.entries(value).forEach(([key, nested]) => {
      if (generatedHashFields.has(key)) return;
      output[key] = removeGeneratedHashFields(nested);
    });

    return output;
  }

  async function payloadSha256FromObject(object) {
    if (!object || typeof object !== "object" || Array.isArray(object)) {
      failClosed("INVALID_PAYLOAD_OBJECT");
    }

    if (isSha256Lower(object.payload_sha256)) {
      return clean(object.payload_sha256).toLowerCase();
    }

    const sanitized = removeGeneratedHashFields(JSON.parse(JSON.stringify(object)));
    return sha256Hex(canonicalStringify(sanitized));
  }

  function normalizePublicLabel(value, fallback) {
    const raw = clean(value || fallback || "HBCE_PUBLIC_LABEL");
    const label = raw
      .toUpperCase()
      .replace(/[^A-Z0-9_\-:.]+/g, "_")
      .replace(/^_+|_+$/g, "")
      .slice(0, 96);

    if (!/^[A-Z0-9_\-:.]{3,96}$/.test(label)) {
      failClosed("INVALID_PUBLIC_LABEL");
    }

    return label;
  }

  /**
   * HBCE public proof receipt.
   *
   * This function replaces legacy receipt shapes with a v2 privacy-minimal model.
   * It does not include name, nickname, territory, raw identifiers, or private evidence.
   *
   * receipt_sha256 = sha256(canonical_json(core_without_receipt_sha256))
   */
  async function buildStampedIpREuReceipt(options) {
    const opts = options || {};
    const timestamp = nowISO();

    const payloadSha256 = clean(opts.payloadSha256 || opts.payload_sha256 || "").toLowerCase();

    if (!isSha256Lower(payloadSha256)) {
      failClosed("INVALID_PAYLOAD_SHA256");
    }

    const subjectLabel = normalizePublicLabel(opts.subjectLabel || opts.subject_label, "HBCE_PUBLIC_IDENTITY_001");
    const recordScope = normalizePublicLabel(opts.recordScope || opts.record_scope, "IPR_PUBLIC_PROOF_PACKAGE");

    const core = {
      proto: "HBCE-RECEIPT",
      kind: "IPR_PUBLIC_PROOF_RECEIPT",
      version: "v2",
      issued_at: timestamp,
      payload_sha256: payloadSha256,
      payload: {
        subject_label: subjectLabel,
        record_scope: recordScope,
        purpose: clean(opts.purpose || "Receipt for privacy-minimal public proof commitment."),
        policy: {
          EU_FIRST: true,
          GDPR_MIN: true,
          HASH_ONLY: true,
          FAIL_CLOSED: true,
          AUDIT_APPEND_ONLY: true,
          NO_PUBLIC_DATA_CUSTODY: true
        },
        consent_scope: clean(opts.consentScope || opts.consent_scope || "PUBLIC_PROOF_COMMITMENT"),
        issued_at: timestamp,
        proof_sha256: payloadSha256,
        context_sha256: isSha256Lower(opts.contextSha256 || opts.context_sha256)
          ? clean(opts.contextSha256 || opts.context_sha256).toLowerCase()
          : payloadSha256,
        note: clean(opts.note || "Public proof receipt. Private evidence remains outside the public registry.")
      },
      signature: {
        scheme: "NONE",
        kid: null,
        value: null,
        public_key_jwk: null,
        note: "Unsigned browser-generated receipt; use a controlled signing process where required."
      },
      anchors: [],
      issuer: {
        issuer_label: ISSUER_LABEL,
        legal: ISSUER_LEGAL,
        hallmark: SEAL
      }
    };

    const receiptSha256 = await sha256Hex(canonicalStringify(core));

    return {
      ...core,
      receipt_sha256: receiptSha256
    };
  }

  /**
   * Deterministic verification for HBCE v2 public proof receipts.
   */
  async function verifyStampedReceipt(receiptObject, payloadObjectOrNull) {
    if (!receiptObject || typeof receiptObject !== "object" || Array.isArray(receiptObject)) {
      failClosed("INVALID_RECEIPT_OBJECT");
    }

    const declaredReceiptSha256 = clean(receiptObject.receipt_sha256).toLowerCase();

    if (!isSha256Lower(declaredReceiptSha256)) {
      return {
        pass: false,
        status: "INVALID",
        reason: "INVALID_DECLARED_RECEIPT_SHA256",
        expected_receipt_sha256: "—",
        declared_receipt_sha256: declaredReceiptSha256 || "—",
        payload_sha256: "—"
      };
    }

    let payloadSha256 = clean(receiptObject.payload_sha256).toLowerCase();

    if (payloadObjectOrNull !== null && payloadObjectOrNull !== undefined) {
      payloadSha256 = await payloadSha256FromObject(payloadObjectOrNull);
    }

    if (!isSha256Lower(payloadSha256)) {
      return {
        pass: false,
        status: "INVALID",
        reason: "INVALID_PAYLOAD_SHA256",
        expected_receipt_sha256: "—",
        declared_receipt_sha256: declaredReceiptSha256,
        payload_sha256: payloadSha256 || "—"
      };
    }

    const core = JSON.parse(JSON.stringify(receiptObject));
    delete core.receipt_sha256;
    core.payload_sha256 = payloadSha256;

    if (core.payload && typeof core.payload === "object") {
      core.payload.proof_sha256 = payloadSha256;
    }

    const expectedReceiptSha256 = await sha256Hex(canonicalStringify(core));
    const pass = expectedReceiptSha256 === declaredReceiptSha256;

    return {
      pass,
      status: pass ? "HASH_MATCH" : "HASH_MISMATCH",
      expected_receipt_sha256: expectedReceiptSha256,
      declared_receipt_sha256: declaredReceiptSha256,
      payload_sha256: payloadSha256,
      caution: "Hash match does not replace private evidence review, identity verification, contractual qualification, legal authorization, institutional validation, or regulated certification."
    };
  }

  window.HBCE_APP = Object.freeze({
    clean,
    isSha256Lower,
    nowISO,
    sortKeys,
    canonicalStringify,
    sha256Hex,
    downloadText,
    safeParseJson,
    removeGeneratedHashFields,
    payloadSha256FromObject,
    buildStampedIpREuReceipt,
    verifyStampedReceipt
  });

  window.sortKeys = sortKeys;
  window.canonicalStringify = canonicalStringify;
  window.sha256Hex = sha256Hex;
  window.nowISO = nowISO;
  window.downloadText = downloadText;
  window.safeParseJson = safeParseJson;
  window.buildStampedIpREuReceipt = buildStampedIpREuReceipt;
  window.verifyStampedReceipt = verifyStampedReceipt;
})();
