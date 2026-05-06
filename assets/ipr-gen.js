/* =========================================================
   HBCE IPR GENERATOR — v2 privacy-minimal / registry v3
   - Local-first generation
   - No upload
   - No public data custody
   - No name / nickname / territory / operator_sha256
   - Uses subject_label and payload_sha256
   - Generates:
     1) IPR_RELEASE.json
     2) ISSUER_CERTIFICATE.json
     3) REGISTRY_ENTRY.json
   ========================================================= */

(async function () {
  "use strict";

  const SEAL = "HERMETICUM - BLINDATA · COMPUTABILE · EVOLUTIVA";
  const ISSUER_LEGAL = "HERMETICUM B.C.E. S.r.l.";
  const ISSUER_LABEL = "HBCE_PUBLIC_ISSUER_001";

  const FORBIDDEN_TEXT = [
    "@",
    "codice fiscale",
    "tax code",
    "fiscal code",
    "passport",
    "identity card",
    "document number",
    "password",
    "private key",
    "api key",
    "token",
    "secret",
    "-----begin",
    "-----end"
  ];

  function nowUtc() {
    return new Date().toISOString();
  }

  function clean(value) {
    return String(value || "").trim();
  }

  function hasText(value) {
    return clean(value).length > 0;
  }

  function isSha256Lower(value) {
    return /^[a-f0-9]{64}$/.test(clean(value));
  }

  function isPublicLabel(value) {
    return /^[A-Z0-9_\-:.]{3,96}$/.test(clean(value));
  }

  function containsForbiddenText(value) {
    const v = clean(value).toLowerCase();
    if (!v) return false;
    return FORBIDDEN_TEXT.some((item) => v.includes(item));
  }

  function failClosed(reason) {
    const error = new Error("HBCE_IPR_GENERATOR_FAIL_CLOSED");
    error.detail = reason || "FAIL_CLOSED";
    throw error;
  }

  async function sha256Text(text) {
    const encoded = new TextEncoder().encode(text);
    const digest = await crypto.subtle.digest("SHA-256", encoded);

    return Array.from(new Uint8Array(digest))
      .map((byte) => byte.toString(16).padStart(2, "0"))
      .join("");
  }

  function stableStringify(value) {
    if (value === null || typeof value !== "object") {
      return JSON.stringify(value);
    }

    if (Array.isArray(value)) {
      return "[" + value.map((item) => stableStringify(item)).join(",") + "]";
    }

    const keys = Object.keys(value).sort();

    return "{" + keys
      .map((key) => JSON.stringify(key) + ":" + stableStringify(value[key]))
      .join(",") + "}";
  }

  function download(filename, content) {
    const blob = new Blob([content], { type: "application/json;charset=utf-8" });
    const anchor = document.createElement("a");

    anchor.href = URL.createObjectURL(blob);
    anchor.download = filename;

    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();

    URL.revokeObjectURL(anchor.href);
  }

  function normalizeSubjectLabel(opts) {
    const direct = clean(opts.subjectLabel || opts.subject_label || "");

    if (direct) {
      if (!isPublicLabel(direct)) {
        failClosed("INVALID_SUBJECT_LABEL");
      }

      if (containsForbiddenText(direct)) {
        failClosed("SUBJECT_LABEL_CONTAINS_FORBIDDEN_OR_SENSITIVE_TEXT");
      }

      return direct;
    }

    const legacy = clean(opts.nickname || "");

    if (legacy) {
      if (containsForbiddenText(legacy)) {
        failClosed("LEGACY_NICKNAME_CONTAINS_FORBIDDEN_OR_SENSITIVE_TEXT");
      }

      const label = legacy
        .toUpperCase()
        .replace(/[^A-Z0-9_\-:.]+/g, "_")
        .replace(/^_+|_+$/g, "")
        .slice(0, 96);

      if (!isPublicLabel(label)) {
        failClosed("LEGACY_NICKNAME_CANNOT_BE_MINIMIZED");
      }

      return label;
    }

    failClosed("MISSING_SUBJECT_LABEL");
  }

  function normalizeEntityType(opts) {
    const raw = clean(opts.entityType || opts.entity_type || "PUBLIC_IDENTITY_COMMITMENT").toUpperCase();

    const allowed = new Set([
      "PUBLIC_IDENTITY_COMMITMENT",
      "PUBLIC_OPERATOR_COMMITMENT",
      "PUBLIC_CONTINUITY_CERTIFICATE",
      "PUBLIC_NODE_COMMITMENT",
      "PUBLIC_EVENT_COMMITMENT",
      "HBCE_PUBLIC_PROOF"
    ]);

    if (!allowed.has(raw)) {
      failClosed("INVALID_ENTITY_TYPE");
    }

    return raw;
  }

  function normalizeLevel(opts) {
    const raw = clean(opts.level || "BASIC").toUpperCase();

    const allowed = new Set([
      "BASIC",
      "STRONG",
      "INSTITUTION",
      "OPERATOR",
      "NODE",
      "ENTERPRISE"
    ]);

    if (!allowed.has(raw)) {
      failClosed("INVALID_IPR_LEVEL");
    }

    return raw;
  }

  function normalizePurpose(opts) {
    const purpose = clean(opts.purpose || "Public proof commitment for operational identity research.");

    if (purpose.length < 3 || purpose.length > 240) {
      failClosed("INVALID_PURPOSE");
    }

    if (containsForbiddenText(purpose)) {
      failClosed("PURPOSE_CONTAINS_FORBIDDEN_OR_SENSITIVE_TEXT");
    }

    return purpose;
  }

  function normalizePackageCode(opts) {
    const pkg = clean(opts.pkg || opts.packageCode || opts.package_code || "HBCE_PUBLIC_PROOF_PACKAGE");

    if (pkg.length < 3 || pkg.length > 128) {
      failClosed("INVALID_PACKAGE_CODE");
    }

    if (containsForbiddenText(pkg)) {
      failClosed("PACKAGE_CODE_CONTAINS_FORBIDDEN_OR_SENSITIVE_TEXT");
    }

    return pkg.toUpperCase().replace(/[^A-Z0-9_\-:.]+/g, "_").slice(0, 128);
  }

  function normalizeAnnex(opts) {
    if (!opts.annex) return null;

    if (typeof opts.annex !== "object" || Array.isArray(opts.annex)) {
      failClosed("INVALID_ANNEX");
    }

    const text = JSON.stringify(opts.annex);

    if (containsForbiddenText(text)) {
      failClosed("ANNEX_CONTAINS_FORBIDDEN_OR_SENSITIVE_TEXT");
    }

    return opts.annex;
  }

  async function buildContextCommitment(subjectLabel, packageCode, timestamp) {
    const context = {
      subject_label: subjectLabel,
      package_code: packageCode,
      timestamp,
      context: "HBCE_PUBLIC_CONTEXT_COMMITMENT"
    };

    return sha256Text(stableStringify(context));
  }

  async function buildIprRelease(opts) {
    const timestamp = nowUtc();
    const entityType = normalizeEntityType(opts || {});
    const subjectLabel = normalizeSubjectLabel(opts || {});
    const level = normalizeLevel(opts || {});
    const purpose = normalizePurpose(opts || {});
    const packageCode = normalizePackageCode(opts || {});
    const annex = normalizeAnnex(opts || {});
    const contextSha256 = await buildContextCommitment(subjectLabel, packageCode, timestamp);

    const release = {
      proto: "HBCE-IPR-PACKAGE",
      kind: "IPR_PUBLIC_PROOF_PACKAGE",
      version: "v2",
      issuer_label: ISSUER_LABEL,
      seal: SEAL,
      issued_at: timestamp,
      level,
      subject_label: subjectLabel,
      purpose,
      policy: {
        EU_FIRST: true,
        GDPR_MIN: true,
        HASH_ONLY: true,
        FAIL_CLOSED: true,
        AUDIT_APPEND_ONLY: true,
        NO_PUBLIC_DATA_CUSTODY: true
      },
      consent: {
        scope: "PUBLIC_PROOF_COMMITMENT",
        duration_days: 3650,
        note: "Public proof commitment only; private evidence remains outside public registry.",
        acknowledged: true
      },
      context: {
        kind: "PUBLIC_CONTEXT_COMMITMENT",
        context_sha256: contextSha256,
        fields_present: [
          "public_label",
          "research_context"
        ]
      },
      package: {
        code: packageCode
      },
      annex_public: annex,
      notes: "Privacy-minimal IPR public proof package. No identity document, raw personal identifier, credential, private key, private evidence, or sensitive operational payload is included.",
      audit: [
        {
          evt: "IPR_PACKAGE_CREATED",
          at: timestamp,
          by_label: ISSUER_LABEL,
          hash_sha256: contextSha256
        }
      ]
    };

    const canonical = stableStringify(release);
    const payloadSha256 = await sha256Text(canonical);

    release.payload_sha256 = payloadSha256;

    release.registry = {
      proto: "HBCE-REGISTRY-v3",
      public_entry: {
        entity_type: entityType,
        subject_label: subjectLabel,
        record_scope: "IPR_PUBLIC_PROOF_PACKAGE",
        payload_sha256: payloadSha256,
        timestamp,
        status: "ACTIVE",
        note: "IPR public proof commitment; private evidence outside public registry"
      }
    };

    return release;
  }

  async function buildIssuerCertificate(iprRelease) {
    if (!iprRelease || typeof iprRelease !== "object") {
      failClosed("INVALID_IPR_RELEASE_FOR_CERTIFICATE");
    }

    if (!isSha256Lower(iprRelease.payload_sha256)) {
      failClosed("INVALID_IPR_RELEASE_PAYLOAD_SHA256");
    }

    const timestamp = iprRelease.issued_at || nowUtc();
    const subjectLabel = clean(iprRelease.subject_label);

    if (!isPublicLabel(subjectLabel)) {
      failClosed("INVALID_CERTIFICATE_SUBJECT_LABEL");
    }

    const certificate = {
      proto: "HBCE-RECEIPT",
      kind: "IPR_PUBLIC_PROOF_RECEIPT",
      version: "v2",
      issued_at: timestamp,
      payload_sha256: iprRelease.payload_sha256,
      payload: {
        subject_label: subjectLabel,
        record_scope: "IPR_PUBLIC_PROOF_PACKAGE",
        purpose: "Receipt for privacy-minimal IPR public proof package.",
        policy: {
          EU_FIRST: true,
          GDPR_MIN: true,
          HASH_ONLY: true,
          FAIL_CLOSED: true,
          AUDIT_APPEND_ONLY: true,
          NO_PUBLIC_DATA_CUSTODY: true
        },
        consent_scope: "PUBLIC_PROOF_COMMITMENT",
        issued_at: timestamp,
        proof_sha256: iprRelease.payload_sha256,
        context_sha256: iprRelease.context.context_sha256,
        note: "Public proof receipt. It does not replace private evidence review, legal authorization, institutional validation, or regulated certification."
      },
      signature: {
        scheme: "NONE",
        kid: null,
        value: null,
        public_key_jwk: null,
        note: "Unsigned browser-generated receipt; use controlled signing process if required."
      },
      anchors: []
    };

    const canonical = stableStringify(certificate);
    const receiptSha256 = await sha256Text(canonical);

    certificate.receipt_sha256 = receiptSha256;

    return certificate;
  }

  async function buildRegistryEntry(iprRelease) {
    if (!iprRelease || typeof iprRelease !== "object") {
      failClosed("INVALID_IPR_RELEASE_FOR_REGISTRY_ENTRY");
    }

    if (!iprRelease.registry || !iprRelease.registry.public_entry) {
      failClosed("MISSING_PUBLIC_REGISTRY_ENTRY");
    }

    const entry = iprRelease.registry.public_entry;

    if (!isSha256Lower(entry.payload_sha256)) {
      failClosed("INVALID_REGISTRY_ENTRY_PAYLOAD_SHA256");
    }

    if (!isPublicLabel(entry.subject_label)) {
      failClosed("INVALID_REGISTRY_ENTRY_SUBJECT_LABEL");
    }

    return {
      entity_type: entry.entity_type,
      subject_label: entry.subject_label,
      record_scope: entry.record_scope,
      payload_sha256: entry.payload_sha256,
      timestamp: entry.timestamp,
      status: entry.status,
      note: entry.note
    };
  }

  window.hbceIprGen = {
    async generate(opts) {
      const ipr = await buildIprRelease(opts || {});
      const cert = await buildIssuerCertificate(ipr);
      const entry = await buildRegistryEntry(ipr);

      return {
        ipr,
        cert,
        entry
      };
    },

    async generateAndDownload(opts) {
      const result = await this.generate(opts || {});

      download("IPR_RELEASE.json", JSON.stringify(result.ipr, null, 2));
      download("ISSUER_CERTIFICATE.json", JSON.stringify(result.cert, null, 2));
      download("REGISTRY_ENTRY.json", JSON.stringify(result.entry, null, 2));

      return result;
    },

    async hashText(text) {
      return sha256Text(String(text || ""));
    }
  };
})();
