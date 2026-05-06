# Repository Baseline Review

Date: 2026-05-06  
Repository: hermeticum-bce-platform  
Maintainer: Manuel Coletta  
Organization / R&D initiative: HBCE Research / HERMETICUM B.C.E.  
Audit cycle: Audit Cycle 001 — Repository baseline review  
Canonical audit issue: #1  

---

## 1. Purpose

This document records the first repository-structure baseline review for the MATRIX / HBCE public platform.

The review is based on the visible repository tree and is intended to guide the next defensive security and governance audit steps.

This is not yet a full source-code review. File-level conclusions will be updated after reviewing the content of each high-priority area.

---

## 2. Repository scale observation

The repository is not a minimal static website.

It contains a broad public platform structure with multiple documentation areas, public gateway pages, registry-related files, verification-related files, protocol/schema materials, audit documents, identity records, receipts, manifests, GitHub workflow references, and public deployment assets.

This increases the need for a structured audit because public-facing documentation, registry files, identity artifacts, and verification logic must remain aligned with the declared governance posture:

- EU-first;
- audit-first;
- fail-closed;
- hash-only public verification;
- no public custody of sensitive personal data;
- defensive cybersecurity only;
- human validation;
- responsibility ownership.

---

## 3. High-priority audit areas

The following areas require priority review.

### 3.1 Registry layer

Relevant visible paths:

- `registry/`
- `registry/index.html`
- registry-related pages and references

Reason for priority:

The registry layer is central to public verification. It must not become a public data-custody layer and must not treat missing, malformed, or unverifiable records as valid.

Required review:

- determine whether registry entries are static, generated, or manually maintained;
- confirm that registry content is hash-only or minimal metadata;
- confirm that no personal documents, secrets, credentials, private keys, or sensitive payloads are exposed;
- confirm that invalid or missing registry data is described as invalid or blocked;
- confirm that documentation does not overstate live operational registry guarantees.

Fail-closed relevance:

High.

---

### 3.2 Verification layer

Relevant visible paths:

- `verify/`
- `verify-pack/`
- `ip-verification/`
- `receipt.json`
- `ipr.json`
- `ipr.canon.json`
- `ipr-ai-joker-c2.receipt.json`
- `ipr-ai-joker-c2.canon.json`
- `PACK_MANIFEST.json`
- `ANCHOR_RECEIPT.json`

Reason for priority:

Verification is one of the most sensitive claims of the platform. Public verification must be reproducible, minimal, and clear about what is actually verified.

Required review:

- confirm which files are used as canonical verification inputs;
- confirm whether hash algorithms are documented consistently;
- confirm whether verification records contain only non-sensitive data;
- confirm whether public verification proves integrity, timestamping, authorship, continuity, or only record presence;
- confirm that public documentation distinguishes cryptographic proof from legal certification.

Fail-closed relevance:

High.

---

### 3.3 GitHub workflow and deployment layer

Relevant visible paths:

- `github/workflows`
- GitHub Pages deployment assumptions
- `404.html`
- `index.html`
- static page directories

Reason for priority:

The repository appears to rely on static public deployment. Static deployment cannot enforce private authorization, secret custody, or server-side validation.

Required review:

- confirm whether workflow path is `.github/workflows` or `github/workflows`;
- inspect workflow files for token handling;
- confirm no secrets are exposed in workflow files;
- confirm no private evidence is published during deployment;
- confirm that GitHub Pages is described as a public gateway, not a secure backend.

Fail-closed relevance:

Medium to high.

---

### 3.4 Schema and protocol layer

Relevant visible paths:

- `schemas/`
- `protocol/`
- `protocols/`
- `spec/`
- `specs/`
- `STANDARD.md`
- `STANDARD-IPR-EU.md`
- `SPEC.md`
- `ARCHITECTURE.md`

Reason for priority:

Schemas and protocols define the rules that should make the platform auditable. They need to be consistent with fail-closed behavior and public/private data separation.

Required review:

- inspect schema files;
- identify required fields;
- confirm whether missing required fields produce invalid records;
- confirm whether sensitive data is excluded from public schemas;
- confirm whether protocol documentation is conceptual, prototype, or implemented.

Fail-closed relevance:

High.

---

### 3.5 Identity and receipt artifacts

Relevant visible files:

- `FOUNDING-AI-IPR.md`
- `FOUNDING-GENESIS-NODE.json`
- `FOUNDING-NODE.md`
- `IPR_RELEASE.json`
- `ISSUER_CERTIFICATE.json`
- `ECOSYSTEM_ROOT.json`
- `FOUNDING-AI-IPR.md`
- `ipr-ai-joker-c2.md`
- `ipr-ai-joker-c2.canon.json`
- `ipr-ai-joker-c2.receipt.json`
- `ipr.canon.json`
- `ipr.json`
- `receipt.json`
- `ed25519_pub.pem`

Reason for priority:

Identity and receipt files may contain personally identifying information, cryptographic metadata, public keys, anchors, signatures, hashes, or institutional claims.

Required review:

- confirm no private key is present;
- confirm `ed25519_pub.pem` is only a public key;
- confirm receipts contain no unnecessary personal data;
- confirm identity records are intentionally public;
- confirm public identity material does not include private documents or sensitive payloads;
- confirm documentation separates public identity claim, cryptographic receipt, and legal identity proof.

Fail-closed relevance:

High.

---

### 3.6 Public institutional pages

Relevant visible paths include:

- `about/`
- `company/`
- `enterprise/`
- `b2g/`
- `governance/`
- `legal/`
- `privacy/`
- `terms/`
- `compliance/`
- `security/`
- `claims/`
- `openapi/`
- `joker-c2/`
- `ai-joker-c2/`
- `ipr/`
- `matrix`-related pages if present

Reason for priority:

Public-facing pages may contain strong claims about operational status, compliance, governance, identity, cybersecurity, B2B/B2G readiness, or institutional deployment.

Required review:

- identify possible overclaims;
- distinguish implemented, prototype, planned, conceptual, and experimental features;
- verify that compliance language is not presented as formal certification unless actually certified;
- verify that B2B/B2G positioning remains accurate and not misleading;
- align all claims with R&D / pre-commercial activation status.

Fail-closed relevance:

Medium.

---

## 4. Immediate structural findings

### STRUCTURAL-FINDING-001 — Repository is broad and requires staged audit

Severity: INFORMATIONAL  
Status: OPEN  

The repository contains many public pages, documents, identity artifacts, receipts, registry files, protocol/specification areas, and audit materials. A single-pass review would be unreliable.

Action:

Proceed with staged audit:

1. registry;
2. verification;
3. workflows/deployment;
4. schemas/protocols;
5. identity/receipt artifacts;
6. legal/privacy/compliance pages;
7. public overclaim review.

---

### STRUCTURAL-FINDING-002 — Registry and verification require priority review

Severity: MEDIUM  
Status: PENDING_REVIEW  

The visible repository structure includes registry and verification-related files. These areas require immediate review because they support the public trust model of the platform.

Action:

Open and review `registry/`, `verify/`, `verify-pack/`, `receipt.json`, `ipr.json`, `ipr.canon.json`, `PACK_MANIFEST.json`, and `ANCHOR_RECEIPT.json`.

---

### STRUCTURAL-FINDING-003 — Identity and receipt files require public-data review

Severity: MEDIUM  
Status: PENDING_REVIEW  

The repository includes public identity, receipt, certificate, manifest, and key-related files.

Action:

Confirm that all public identity materials are intentional, non-sensitive, and do not expose private keys, private documents, personal identity documents, API keys, wallet private keys, passwords, or confidential operational records.

---

### STRUCTURAL-FINDING-004 — Deployment and workflow path requires verification

Severity: MEDIUM  
Status: PENDING_REVIEW  

The visible tree includes `github/workflows`. The audit must verify whether this is a real GitHub Actions path or a documentation/static path. Standard GitHub Actions normally use `.github/workflows`.

Action:

Inspect the workflow directory and confirm whether automation is active, documentary, or mislocated.

---

### STRUCTURAL-FINDING-005 — Public pages require overclaim review

Severity: LOW  
Status: PENDING_REVIEW  

The repository contains many public institutional, enterprise, compliance, security, governance, and B2G pages.

Action:

Review public pages for unclear claims, unsupported production-grade language, compliance overstatement, or ambiguity between concept, prototype, and implemented feature.

---

## 5. Recommended next-file order

The next files or directories should be reviewed in this order:

1. `registry/`
2. `verify/`
3. `verify-pack/`
4. `schemas/`
5. `github/workflows`
6. `PACK_MANIFEST.json`
7. `ANCHOR_RECEIPT.json`
8. `receipt.json`
9. `ipr.json`
10. `ipr.canon.json`
11. `ipr-ai-joker-c2.canon.json`
12. `ipr-ai-joker-c2.receipt.json`
13. `ARCHITECTURE.md`
14. `SPEC.md`
15. `STANDARD-IPR-EU.md`
16. `PRIVACY.md`
17. `GOVERNANCE.md`
18. `POLICY.md`
19. `index.html`
20. `verify/index.html`, if present

---

## 6. Current audit conclusion

The repository now has a strong governance-documentation baseline, but the real technical audit must continue at file level.

The most important unresolved question is whether registry, verification, identity, receipt, schema, and deployment files actually implement the same posture declared in the root documentation:

- fail closed on invalid or missing verification data;
- avoid public custody of sensitive data;
- use hash-only or minimal public records;
- avoid secret exposure;
- avoid production claims unsupported by implementation;
- preserve auditability and responsibility ownership.

Until file-level review is completed, the audit status remains:

```text
OPEN — BASELINE STRUCTURAL REVIEW COMPLETED; FILE-LEVEL REVIEW PENDING


---

7. Audit-ready event record draft

{
  "event_type": "REPOSITORY_BASELINE_STRUCTURAL_REVIEW",
  "event_date": "2026-05-06",
  "repository": "hermeticum-bce-platform",
  "audit_cycle": "AUDIT_CYCLE_001",
  "canonical_issue": "#1",
  "maintainer": "Manuel Coletta",
  "organization": "HBCE Research / HERMETICUM B.C.E. R&D initiative",
  "review_basis": "Visible repository tree",
  "status": "OPEN_FILE_LEVEL_REVIEW_PENDING",
  "priority_review_areas": [
    "registry",
    "verify",
    "verify-pack",
    "schemas",
    "github/workflows",
    "identity_and_receipt_artifacts",
    "public_institutional_pages"
  ],
  "governance_posture_under_review": [
    "EU_FIRST",
    "AUDIT_FIRST",
    "FAIL_CLOSED",
    "HASH_ONLY_PUBLIC_VERIFICATION",
    "NO_PUBLIC_PERSONAL_DATA_CUSTODY",
    "DEFENSIVE_CYBERSECURITY_ONLY",
    "HUMAN_VALIDATION",
    "RESPONSIBILITY_OWNERSHIP"
  ]
}


---

8. Maintainer statement

This baseline review is defensive, authorized, non-offensive, and limited to repository-owned public materials.

No unauthorized access, exploitation, malware development, credential theft, evasion, data exfiltration, destructive testing, or harmful automation is authorized by this review.

