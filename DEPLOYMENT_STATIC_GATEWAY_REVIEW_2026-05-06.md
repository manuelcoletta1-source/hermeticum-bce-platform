# HBCE Platform — Static Gateway Deployment Review

Review date: 2026-05-06  
Repository: hermeticum-bce-platform  
Maintainer: Manuel Coletta  
Organization / R&D initiative: HBCE Research / HERMETICUM B.C.E.  
Audit cycle: Audit Cycle 001 — Repository baseline review  
Canonical audit issue: #1  

---

## 1. Purpose

This document records the first deployment and GitHub Pages assumptions review for the HBCE Platform public gateway.

The objective is to clarify the operational boundary of the repository as a static public gateway and to prevent overclaiming about backend security, private authorization, secret custody, identity custody, or regulated operational enforcement.

This review is defensive, authorized, non-offensive, and limited to repository-owned public materials.

---

## 2. Deployment model

HBCE Platform is currently treated as a public static gateway.

Expected deployment model:

- static HTML;
- public JSON files;
- public Markdown files;
- public CSS and browser-side JavaScript;
- GitHub Pages or equivalent static hosting;
- no trusted server-side execution in the public layer;
- no backend secret custody in the public layer;
- no private authorization enforcement in the public layer.

The public gateway can document, display, compute local hashes, perform public registry lookups, and support public proof verification.

It must not be treated as a secure backend.

---

## 3. Static gateway limitations

A static public gateway cannot reliably provide:

- private authorization enforcement;
- server-side secret protection;
- privileged access control;
- confidential evidence processing;
- secure private identity verification;
- private document custody;
- regulated certification;
- institutional approval;
- production-grade backend validation;
- secure enterprise workflow execution by itself.

Any operation requiring private evidence, confidential records, credentials, private keys, regulated identity checks, institutional approval, or privileged authorization must occur outside the static public layer.

---

## 4. No public secret custody

The public repository and deployed gateway must not contain:

- API keys;
- OpenAI API keys;
- private keys;
- wallet private keys;
- passwords;
- authentication tokens;
- bearer tokens;
- signing secrets;
- credentials;
- `.env` files with real values;
- private identity documents;
- private evidence;
- confidential customer data;
- private communications;
- production logs containing personal data;
- private endpoints;
- database URLs;
- admin URLs;
- sensitive operational payloads.

The repository now includes `.gitignore` and `.env.example` safeguards to reduce accidental exposure.

---

## 5. Public verification boundary

The public gateway may support:

- hash-only proof lookup;
- `payload_sha256` matching;
- registry v3 public record display;
- local browser-side SHA-256 computation;
- receipt verification by local file hashing;
- evidence pack hash consistency checks;
- public audit trace display;
- public schema documentation.

The public gateway must not claim that a public match automatically creates:

- legal identity certification;
- private identity verification;
- institutional authorization;
- regulated certification;
- tax or accounting validity;
- contractual qualification;
- public authority approval;
- production-grade security certification.

A public proof match means only that the public proof commitment is present or that a local hash comparison succeeded within the declared technical perimeter.

---

## 6. Fail-closed deployment interpretation

The deployment model must preserve fail-closed behavior.

Expected fail-closed states:

- missing input → `INVALID`;
- malformed hash → `INVALID`;
- unavailable registry → `NON_OPERATIONAL`;
- malformed registry → `NON_OPERATIONAL`;
- schema mismatch → `NON_OPERATIONAL`;
- no public match → `NO_PUBLIC_RECORD`;
- hash mismatch → `HASH_MISMATCH` or `INVALID`;
- forbidden public field detected → block, review, or remediation required;
- sensitive data exposed → remove, rotate if applicable, and document remediation.

The public gateway should not produce soft validity, implied authorization, or ambiguous success states.

---

## 7. GitHub Pages assumptions

When deployed through GitHub Pages or equivalent static hosting, the following assumptions apply:

- all deployed files are public;
- public files may be indexed, mirrored, cached, forked, or archived;
- secrets committed to the repository must be considered compromised;
- public JSON and HTML files must be treated as public records;
- browser-side JavaScript cannot protect secrets;
- hidden frontend fields are not security controls;
- static pages cannot enforce privileged authorization;
- private evidence must remain outside the public layer.

Therefore, the correct posture is:

```text
PUBLIC_STATIC_GATEWAY = DOCUMENTATION + PUBLIC_PROOF + LOCAL_VERIFICATION
PUBLIC_STATIC_GATEWAY != SECURE_BACKEND
PUBLIC_STATIC_GATEWAY != PRIVATE_EVIDENCE_CUSTODY
PUBLIC_STATIC_GATEWAY != LEGAL_CERTIFICATION_LAYER


---

8. GitHub Actions and workflow assumptions

The repository includes a registry guard workflow and a registry guard script.

Relevant files:

.github/workflows/registry-guard.yml

tools/registry-guard.js


Current expected posture:

workflow permissions should remain minimal;

checkout should avoid credential persistence where possible;

workflow should validate registry v3 public records;

workflow should block forbidden public fields;

workflow should enforce append-only registry semantics;

workflow should reject malformed payload_sha256;

workflow should reject legacy operator_sha256;

workflow should reject direct public use of name, nickname, territory, raw identifiers, private evidence, secrets, credentials, private keys, and sensitive payloads.


The workflow is a defensive CI guard. It does not replace private security review or regulated compliance validation.


---

9. Browser-side tools

The repository includes browser-side tools for registry, verification, receipt checks, evidence pack checks, and link audit.

Browser-side tools must follow these rules:

no upload of private evidence unless explicitly documented and authorized;

no public custody of private evidence;

no reliance on frontend logic as a secret-protection mechanism;

no embedding of real credentials in JavaScript;

no use of browser-side checks as legal certification;

clear distinction between public proof presence and private validation;

fail-closed behavior when required fields are missing, invalid, or inconsistent.


Browser-side tools are useful for public verification and local computation, but they are not secure backend services.


---

10. Static asset review assumptions

Static assets should be reviewed for:

hardcoded secrets;

API keys;

tokens;

private endpoints;

test credentials;

private identity material;

internal infrastructure details;

legacy terminology inconsistent with registry v3;

unsupported production claims.


Relevant areas for later review:

assets/

partials/

NAV.html

index.html

public HTML route folders

public JSON files

public Markdown files



---

11. Deployment finding register

DEPLOYMENT-FINDING-001 — Public gateway is static

Severity: INFORMATIONAL
Status: DOCUMENTED
Affected area: Deployment model

Description:

The repository is treated as a static public gateway. It can publish documents, public records, registry files, and browser-side verification tools, but it should not be treated as a secure backend.

Remediation:

Documented static gateway limitations and public proof boundaries.

Fail-closed relevance:

Private authorization, private evidence processing, and privileged verification must fail closed outside the static public layer.


---

DEPLOYMENT-FINDING-002 — Secrets must never be committed

Severity: HIGH
Status: REMEDIATED
Affected files:

.gitignore

.env.example


Description:

Static public repositories expose committed files publicly. Secrets committed to the repository must be treated as compromised.

Remediation:

Added .gitignore safeguards and .env.example placeholder documentation.

Fail-closed relevance:

If secrets are required, they must remain outside the public repository. Missing secrets must not produce insecure defaults.


---

DEPLOYMENT-FINDING-003 — Browser-side JavaScript cannot enforce private authorization

Severity: MEDIUM
Status: DOCUMENTED
Affected area: Browser-side tools

Description:

Browser-side JavaScript can support local verification and public proof lookup, but it cannot enforce private authorization or protect server-side secrets.

Remediation:

Public pages and policies now clarify no-public-data-custody and public proof limitations.

Fail-closed relevance:

Any workflow requiring private authorization must be moved outside the static public layer or require manual/private review.


---

DEPLOYMENT-FINDING-004 — Registry guard workflow requires continued monitoring

Severity: MEDIUM
Status: IN_REVIEW
Affected files:

.github/workflows/registry-guard.yml

tools/registry-guard.js


Description:

The registry guard workflow has been hardened, but it should remain under review as registry semantics evolve.

Remediation completed:

registry v3 alignment;

payload_sha256 enforcement;

forbidden-field blocking;

append-only enforcement;

duplicate payload_sha256 blocking;

read-only workflow posture.


Remaining work:

confirm workflow path is active under .github/workflows/;

confirm workflow runs successfully on registry changes;

confirm GitHub Pages deployment does not bypass guard assumptions.



---

DEPLOYMENT-FINDING-005 — Public page link and UI review pending

Severity: LOW
Status: PENDING_REVIEW
Affected area: Public route layer

Description:

Many public pages have been modified. Link and UI review remains necessary.

Required review:

run tools/index.html link audit;

check modified registry pages;

check modified verify pages;

check legal and policy pages;

check schema links;

check GitHub Pages rendering;

check legacy links and terminology.



---

12. Current deployment review status

Current status:

PARTIALLY_REMEDIATED — STATIC GATEWAY ASSUMPTIONS DOCUMENTED; WORKFLOW AND LINK/UI REVIEW PENDING

Completed:

static gateway boundary documented;

no-public-data-custody boundary documented;

secret-handling safeguards added;

.env.example added;

registry guard workflow hardened;

registry guard script hardened;

public proof limitations clarified.


Pending:

GitHub Pages settings confirmation;

workflow run confirmation;

static asset scan;

link and UI review;

final source-of-truth decision for ledger.json vs registry.json;

protocol consistency review.



---

13. Recommended next actions

1. Confirm that GitHub Actions workflow exists at .github/workflows/registry-guard.yml.


2. Confirm that the workflow runs on changes to registry and schema files.


3. Confirm GitHub Pages source branch and deployment folder.


4. Run the public link audit tool.


5. Review assets/ for hardcoded secrets or legacy terminology.


6. Review public route pages for outdated nickname, operator_sha256, territory, or name (public) references.


7. Confirm that sensitive verification flows are documented as outside the static public layer.


8. Update AUDIT_FINDINGS_MATRIX_HBCE_2026-05-06.md after deployment review progresses.




---

14. Audit-ready event record draft

{
  "event_type": "STATIC_GATEWAY_DEPLOYMENT_REVIEW",
  "event_date": "2026-05-06",
  "repository": "hermeticum-bce-platform",
  "audit_cycle": "AUDIT_CYCLE_001",
  "canonical_issue": "#1",
  "maintainer": "Manuel Coletta",
  "organization": "HBCE Research / HERMETICUM B.C.E. R&D initiative",
  "deployment_model": "STATIC_PUBLIC_GATEWAY",
  "status": "PARTIALLY_REMEDIATED",
  "documented_boundaries": [
    "NO_SECURE_BACKEND_ASSUMPTION",
    "NO_PUBLIC_SECRET_CUSTODY",
    "NO_PUBLIC_PRIVATE_EVIDENCE_CUSTODY",
    "NO_FRONTEND_PRIVATE_AUTHORIZATION",
    "PUBLIC_PROOF_ONLY",
    "FAIL_CLOSED_ON_AMBIGUITY"
  ],
  "files_referenced": [
    ".gitignore",
    ".env.example",
    ".github/workflows/registry-guard.yml",
    "tools/registry-guard.js",
    "tools/index.html"
  ],
  "next_action": "Confirm GitHub Pages settings, workflow execution, static asset review, and link/UI review"
}


---

15. Maintainer statement

This deployment review is part of a defensive and authorized repository baseline review.

The public HBCE Platform should be treated as a static public documentation, registry, verification, and audit gateway.

No offensive cybersecurity activity, unauthorized access, exploitation, malware development, credential theft, evasion, data exfiltration, destructive testing, or harmful automation is authorized by this review.

