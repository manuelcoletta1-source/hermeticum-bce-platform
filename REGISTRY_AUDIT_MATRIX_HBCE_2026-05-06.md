# MATRIX / HBCE Registry Audit

Audit date: 2026-05-06  
Repository: hermeticum-bce-platform  
Maintainer: Manuel Coletta  
Organization / R&D initiative: HBCE Research / HERMETICUM B.C.E.  
Audit cycle: Audit Cycle 001 — Repository baseline review  
Canonical audit issue: #1  

---

## 1. Purpose

This document records the first defensive audit of the `registry/` layer of the MATRIX / HBCE public platform.

The registry layer is one of the most sensitive components of the public gateway because it supports public proof, hash-only verification, append-only evidence logic, and fail-closed governance.

This audit is defensive, authorized, non-offensive, and limited to repository-owned public files.

---

## 2. Reviewed registry area

Reviewed paths:

- `registry/`
- `registry/index.html`
- `registry/registry.json`
- `registry/ledger.json`
- `registry/ipr_registry.json`
- `registry/events.json`
- `registry/nodes.json`
- `registry/operators.json`
- `registry/REGISTRY_ENTRY_OPERATOR__1de300e4d826719c9a8708c8dfb2a8e943f19c3d324816b220f149f008ba481b.json`
- `registry/append/`
- `registry/publish/`
- `registry/operators/`

This file records the first baseline assessment. A deeper code-level review of `append/`, `publish/`, and `operators/` should follow separately.

---

## 3. Registry governance posture

The registry layer is expected to follow these principles:

- public proof only;
- hash-only or minimal public metadata;
- append-only record logic;
- deterministic verification;
- fail-closed behavior;
- no public custody of sensitive personal data;
- no public exposure of private keys, credentials, API keys, identity documents, production logs, or private evidence;
- clear distinction between public proof and private evidence.

The registry must not become a public data-custody layer.

---

## 4. Positive baseline observations

### 4.1 Public registry page declares fail-closed posture

Status: OBSERVED  
Severity: INFORMATIONAL  

The public registry page states that the registry is a public proof layer, based on append-only and hash-only evidence, and that invalid, unreachable, or non-deterministic registry state should result in a non-operational posture.

Audit interpretation:

This is aligned with the declared MATRIX / HBCE governance model.

Fail-closed relevance:

High. Registry failure must not produce ambiguous success.

---

### 4.2 `registry.json` declares hash-only, append-only, fail-closed rules

Status: OBSERVED  
Severity: INFORMATIONAL  

`registry.json` declares a public registry model with policy values including:

- `HASH_ONLY`
- `APPEND_ONLY`
- `FAIL_CLOSED`
- `UE_FIRST`
- `AUDIT_FIRST`
- `GDPR_MIN`
- `NO_PUBLIC_DATA_CUSTODY`

It also defines rules for deterministic SHA-256 match verification and fail-closed behavior.

Audit interpretation:

This is consistent with the declared governance posture.

Fail-closed relevance:

High. The verification rule should reject missing, malformed, or mismatched hashes.

---

### 4.3 `ipr_registry.json` is currently minimal

Status: OBSERVED  
Severity: INFORMATIONAL  

`ipr_registry.json` declares a public IPR EU registry with empty entries and policies including `UE_FIRST`, `AUDIT_FIRST`, `HASH_ONLY`, `FAIL_CLOSED`, and `NO_DATA_CUSTODY`.

Audit interpretation:

The empty entries list reduces exposure risk at this stage.

Fail-closed relevance:

Medium. Empty registry state should be treated as no public proof available, not as implicit validity.

---

### 4.4 `operators.json` is currently empty

Status: OBSERVED  
Severity: INFORMATIONAL  

`operators.json` declares a certified operators registry with an empty entries list and policy values including `HASH_ONLY`, `APPEND_ONLY`, `FAIL_CLOSED`, and `NO_PUBLIC_DATA_CUSTODY`.

Audit interpretation:

No operator data exposure is visible in this file.

Fail-closed relevance:

Medium. Absence of operator entries should not be interpreted as active certification unless another valid registry entry exists.

---

### 4.5 `events.json` and `nodes.json` contain simple public operational metadata

Status: OBSERVED  
Severity: INFORMATIONAL  

`events.json` contains an initial infrastructure event record. `nodes.json` contains a public node record identifying the HBCE primary infrastructure node.

Audit interpretation:

These files appear to contain operational metadata rather than secrets or private payloads.

Fail-closed relevance:

Medium. These records should remain descriptive unless backed by deterministic verification logic.

---

## 5. Registry findings

---

### REGISTRY-FINDING-001 — Registry layer requires canonical schema validation

Severity: MEDIUM  
Status: OPEN  
Affected area: Registry schema and validation  
Affected files:

- `registry/registry.json`
- `registry/ledger.json`
- `registry/ipr_registry.json`
- `registry/events.json`
- `registry/nodes.json`
- `registry/operators.json`

Description:

The registry layer declares fail-closed behavior and required fields, but a dedicated canonical schema validation file is not yet confirmed in this audit step.

Why it matters:

A registry can claim fail-closed behavior in documentation, but the posture becomes stronger if registry entries can be validated against an explicit JSON Schema or equivalent deterministic validation rule.

Safe remediation:

Create or identify a canonical schema for registry entries.

Recommended file:

```text
schemas/hbce-registry-entry.schema.json

The schema should validate:

required fields;

allowed status values;

lowercase 64-character SHA-256 values;

ISO 8601 / RFC 3339 timestamps;

allowed record types;

allowed policy values;

absence of raw sensitive payload fields.


Fail-closed relevance:

High. Invalid schema must produce INVALID or NON_OPERATIONAL, never silent success.

Audit status:

OPEN


---

REGISTRY-FINDING-002 — Public name field requires explicit minimization note

Severity: LOW
Status: OPEN
Affected area: Public registry metadata
Affected files:

registry/registry.json

registry/REGISTRY_ENTRY_OPERATOR__1de300e4d826719c9a8708c8dfb2a8e943f19c3d324816b220f149f008ba481b.json


Description:

Some public registry entries include the field name, including a public operator identity.

Why it matters:

A name is personal data under European privacy logic when it identifies a natural person. The current exposure may be intentional and compatible with public operator attribution, but the registry should state this clearly.

Safe remediation:

Add a registry note explaining that:

public name fields are minimal public identity labels;

they are used only for public attribution and human-readable registry navigation;

sensitive identity evidence is not stored in the public registry;

private documents, credentials, and evidence remain outside the public layer.


Recommended wording:

Public identity labels may appear only when intentionally published for attribution and registry readability. Sensitive identity evidence, private documents, credentials, and non-public payloads must not be stored in the public registry.

Fail-closed relevance:

Medium. If a registry entry requires sensitive evidence to validate, public validation should fail closed and require private/manual review.

Audit status:

OPEN


---

REGISTRY-FINDING-003 — Empty registries require explicit interpretation rule

Severity: LOW
Status: OPEN
Affected area: Empty registry state
Affected files:

registry/ipr_registry.json

registry/operators.json


Description:

Some registry files declare valid registry structures but contain empty entries arrays.

Why it matters:

An empty registry should not be interpreted as proof of validity or absence of risk. It should mean that no public proof entries are currently available in that specific registry file.

Safe remediation:

Document empty registry interpretation:

An empty entries array means no public proof entries are currently available in this registry file. It does not certify validity, status, or authorization by itself.

Fail-closed relevance:

Medium. Empty registry state should produce NO_PUBLIC_RECORD or equivalent, not VALID.

Audit status:

OPEN


---

REGISTRY-FINDING-004 — ledger.json and registry.json should be reconciled

Severity: MEDIUM
Status: OPEN
Affected area: Registry consistency
Affected files:

registry/ledger.json

registry/registry.json


Description:

The repository contains both ledger.json and registry.json, each describing public proof / ledger logic. Their relationship should be explicitly documented.

Why it matters:

Multiple registry files can create ambiguity if users do not know which file is canonical, which file is legacy, and which file is used by verification workflows.

Safe remediation:

Add a short registry index note defining:

canonical registry file;

supporting ledger file;

legacy or transitional files, if any;

verification source of truth;

update/append discipline.


Recommended rule:

registry.json is the canonical public registry index unless otherwise stated. ledger.json is a supporting public proof ledger. Verification tools must declare which source they use.

Fail-closed relevance:

High. If the verification source is ambiguous, the system should block or require manual review.

Audit status:

OPEN


---

REGISTRY-FINDING-005 — Append and publish tools require separate review

Severity: MEDIUM
Status: PENDING_REVIEW
Affected area: Registry write/update workflow
Affected paths:

registry/append/

registry/publish/

registry/operators/


Description:

The repository contains registry append and publish areas. These areas may define how new records are generated, minimized, validated, or published.

Why it matters:

Append/publish tools are more sensitive than static records because they may affect registry integrity, deduplication, hash generation, and public proof creation.

Required review:

identify whether append/publish tools are static browser tools, scripts, or documentation pages;

confirm they do not expose secrets;

confirm they do not publish raw sensitive payloads;

confirm duplicate handling;

confirm malformed record handling;

confirm fail-closed behavior;

confirm that generated entries match the declared registry schema.


Safe remediation:

If append/publish behavior is only manual or browser-side, document that the public tool does not replace human review or canonical validation.

Fail-closed relevance:

High.

Audit status:

PENDING_REVIEW


---

REGISTRY-FINDING-006 — Public registry page should identify canonical data source

Severity: LOW
Status: OPEN
Affected area: Public registry page
Affected file:

registry/index.html


Description:

The registry page displays the public registry viewer and references ledger.json. The page should make the canonical data source explicit.

Why it matters:

Users should know whether the registry viewer is loading ledger.json, registry.json, or another source.

Safe remediation:

Add visible wording:

Canonical public registry source: registry.json.
Supporting public proof ledger: ledger.json.
If the selected source is unreachable, malformed, or inconsistent, the registry state is NON-OPERATIONAL.

Fail-closed relevance:

Medium.

Audit status:

OPEN


---

6. Current registry audit summary

Positive items:

public registry page declares append-only, hash-only, fail-closed posture;

registry.json declares deterministic SHA-256 match verification;

ipr_registry.json and operators.json are currently minimal and empty;

events.json and nodes.json appear to contain non-secret operational metadata;

no private key, API key, password, or token was identified in the reviewed registry list at this stage.


Open items:

create or identify canonical JSON schema;

clarify public name minimization rule;

document empty registry interpretation;

reconcile ledger.json and registry.json;

review append/publish/operator tools;

clarify canonical registry source in public viewer.



---

7. Recommended next actions

1. Review registry/index.html source behavior.


2. Review registry/append/.


3. Review registry/publish/.


4. Review registry/operators/.


5. Create schemas/hbce-registry-entry.schema.json if no canonical schema exists.


6. Add a registry README or registry policy note.


7. Update AUDIT_FINDINGS_MATRIX_HBCE_2026-05-06.md after registry findings are remediated.




---

8. Audit-ready event record draft

{
  "event_type": "MATRIX_HBCE_REGISTRY_AUDIT",
  "event_date": "2026-05-06",
  "repository": "hermeticum-bce-platform",
  "audit_cycle": "AUDIT_CYCLE_001",
  "canonical_issue": "#1",
  "maintainer": "Manuel Coletta",
  "organization": "HBCE Research / HERMETICUM B.C.E. R&D initiative",
  "reviewed_area": "registry/",
  "status": "OPEN",
  "positive_observations": [
    "Registry page declares public proof, append-only, hash-only, fail-closed posture",
    "registry.json declares deterministic SHA-256 match verification",
    "Empty operator and IPR registries reduce exposure risk",
    "No obvious secrets identified in the reviewed registry file list"
  ],
  "open_findings": [
    "REGISTRY-FINDING-001",
    "REGISTRY-FINDING-002",
    "REGISTRY-FINDING-003",
    "REGISTRY-FINDING-004",
    "REGISTRY-FINDING-005",
    "REGISTRY-FINDING-006"
  ],
  "governance_posture_under_review": [
    "HASH_ONLY_PUBLIC_VERIFICATION",
    "APPEND_ONLY",
    "FAIL_CLOSED",
    "NO_PUBLIC_DATA_CUSTODY",
    "GDPR_MIN",
    "AUDIT_FIRST"
  ],
  "next_action": "Review registry append/publish/operator tools and define canonical schema"
}


---

9. Maintainer statement

This registry audit is defensive, authorized, non-offensive, and limited to repository-owned public materials.

No unauthorized access, exploitation, malware development, credential theft, evasion, data exfiltration, destructive testing, or harmful automation is authorized by this audit.
