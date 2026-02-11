/* hbce ipr generator — local-first, hash-only public */
(async function () {
  function nowUtc() { return new Date().toISOString(); }

  async function sha256Text(text) {
    const enc = new TextEncoder().encode(text);
    const digest = await crypto.subtle.digest("SHA-256", enc);
    return Array.from(new Uint8Array(digest)).map(b => b.toString(16).padStart(2, "0")).join("");
  }

  function download(filename, content) {
    const blob = new Blob([content], { type: "application/json;charset=utf-8" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
  }

  // Create canonical release payload (minimal, UE-first)
  async function buildIprRelease({ entityType, nickname, pkg, annex }) {
    const ts = nowUtc();
    const base = {
      proto: "HBCE-IPR-v1",
      kind: "IDENTITY_PRIMARY_RECORD",
      jurisdiction: "EU",
      mode: "PERMISSIONLESS",
      issuer: {
        legal_name: "HERMETICUM B.C.E. S.r.l.",
        display: "🜏 HERMETICUM B.C.E. S.r.l.",
        seal: "🜏",
        role: "IPR_ISSUER_AUTHORITY"
      },
      policy: ["UE-FIRST", "AUDIT-FIRST", "FAIL-CLOSED", "HASH-ONLY", "APPEND-ONLY", "NO-IDENTITY-CUSTODY"],
      subject: { entity_type: entityType, nickname, operational_status: "ACTIVE" },
      package: { code: pkg },
      root_identity: { created_at_utc: ts, genesis_reference: "19-01-2026" },
      annex_ue: annex || null,
      // placeholder, filled later
      hash_integrity: { payload_sha256: "PENDING", hash_scope: "FULL_FILE_EXCLUDING_THIS_FIELD" }
    };

    // compute hash excluding payload_sha256
    const tmp = JSON.parse(JSON.stringify(base));
    tmp.hash_integrity.payload_sha256 = "PENDING";
    const canonical = JSON.stringify(tmp);
    const h = await sha256Text(canonical);

    base.hash_integrity.payload_sha256 = h;
    base.registry = {
      type: "PUBLIC_APPEND_ONLY",
      visibility: "HASH_ONLY",
      public_entry: { nickname, payload_sha256: h, timestamp: ts }
    };

    return base;
  }

  async function buildIssuerCertificate(iprRelease) {
    const ts = iprRelease.root_identity.created_at_utc;
    const h = iprRelease.hash_integrity.payload_sha256;

    const cert = {
      proto: "HBCE-CERT-v1",
      kind: "IPR_ISSUER_CERTIFICATE",
      jurisdiction: "EU",
      mode: "PERMISSIONLESS",
      issuer: {
        legal_name: "HERMETICUM B.C.E. S.r.l.",
        display: "🜏 HERMETICUM B.C.E. S.r.l.",
        seal: "🜏",
        hallmark: "HERMETICUM - BLINDATA · COMPUTABILE · EVOLUTIVA"
      },
      policy: ["UE-FIRST", "AUDIT-FIRST", "FAIL-CLOSED", "HASH-ONLY", "APPEND-ONLY", "NO-IDENTITY-CUSTODY"],
      subject: {
        entity_type: iprRelease.subject.entity_type,
        nickname: iprRelease.subject.nickname,
        subject_ref: { payload_sha256: h }
      },
      issuance: {
        issued_at_utc: ts,
        issuance_id: `HBCE-ISSUE-${ts.replace(/[-:.TZ]/g, "").slice(0, 14)}-000001`,
        registry: {
          type: "PUBLIC_APPEND_ONLY_REGISTRY",
          public_fields: ["nickname", "payload_sha256", "timestamp"],
          expected_entry: iprRelease.registry.public_entry
        }
      },
      verification: {
        verify_url: `/hermeticum-bce-platform/verify/?h=${h}`,
        fail_closed_rule: "IF NOT (FILE_INTEGRITY_OK AND REGISTRY_MATCH) THEN INVALID"
      },
      statement: {
        language: "it",
        text: "Il presente Identity Primary Record (IPR) è stato emesso e certificato da 🜏 HERMETICUM B.C.E. S.r.l. secondo policy UE-first, audit-first, fail-closed, hash-only e append-only. L'IPR costituisce identità operativa primaria opponibile nel tempo."
      },
      integrity: { certificate_sha256: "PENDING" }
    };

    const certHash = await sha256Text(JSON.stringify({ ...cert, integrity: { certificate_sha256: "PENDING" } }));
    cert.integrity.certificate_sha256 = certHash;
    return cert;
  }

  async function buildRegistryEntry(iprRelease) {
    return iprRelease.registry.public_entry;
  }

  // expose minimal API for wizard page
  window.hbceIprGen = {
    async generateAndDownload(opts) {
      const ipr = await buildIprRelease(opts);
      const cert = await buildIssuerCertificate(ipr);
      const entry = await buildRegistryEntry(ipr);

      download("IPR_RELEASE.json", JSON.stringify(ipr, null, 2));
      download("ISSUER_CERTIFICATE.json", JSON.stringify(cert, null, 2));
      download("REGISTRY_ENTRY.json", JSON.stringify(entry, null, 2));

      return { ipr, cert, entry };
    }
  };
})();
