# Baseline — HBCE Platform v1.0

Baseline date: 2026-05-06  
Repository: hermeticum-bce-platform  
Maintainer: Manuel Coletta  
Organization / R&D initiative: HBCE Research / HERMETICUM B.C.E.  

---

## 1. Purpose

This document records the semantic baseline of the HBCE Platform public verification layer.

The baseline defines the meaning of the public gateway and verification posture. It does not claim production certification, legal certification, identity certification, or institutional authorization by itself.

The repository remains an experimental R&D platform for verifiable technological systems, operational identity, audit-ready event records, fail-closed governance, and responsibility-preserving AI workflows.

---

## 2. Baseline status

Baseline: `1.0`  
Mode: `EU_FIRST | AUDIT_FIRST | HASH_ONLY | FAIL_CLOSED | GDPR_MIN | NO_PUBLIC_DATA_CUSTODY`  
Change policy: `APPEND_ONLY`  
Operational status: `EXPERIMENTAL_R_AND_D_BASELINE`  
Verification posture: `PUBLIC_PROOF_COMMITMENT_ONLY`  

---

## 3. Frozen semantic scope

The following public areas are included in the v1.0 semantic baseline:

- `/`
- `/citizen`
- `/verify`
- `/verify/verify.html`
- `/verify/receipt`
- `/verify/schema`
- `/registry`
- `/registry/operators`
- `/create`
- `/terms`
- `/privacy`
- `/security`

This baseline fixes the public meaning of these areas as documentation, public proof, verification, and governance surfaces.

It does not freeze implementation forever. Future changes may occur, but they should be additive, documented, and traceable.

---

## 4. Verification semantics

The verification layer follows these rules:

- public verification uses minimized public proof commitments;
- `payload_sha256` is the primary public proof matching field;
- absence of match means `NO_PUBLIC_RECORD`;
- invalid input means `INVALID`;
- unreachable or malformed registry means `NON_OPERATIONAL`;
- registry or verification ambiguity must fail closed;
- public proof presence does not replace private evidence review;
- public proof presence does not certify legal authorization by itself;
- public proof presence does not replace identity verification, contractual qualification, or institutional validation.

---

## 5. Registry semantics

The registry layer follows these rules:

- public records should be hash-only or metadata-minimized;
- public records should not contain private evidence;
- public records should not contain raw personal identifiers;
- public records should not contain identity documents;
- public records should not contain credentials, secrets, private keys, production logs, or sensitive operational payloads;
- empty registry state means no public proof record is currently available in that file;
- empty registry state does not certify validity, authorization, or operational activation by itself.

---

## 6. Privacy and public data posture

The public platform follows a minimal public data posture.

The public layer must not store:

- API keys;
- private keys;
- passwords;
- authentication tokens;
- credentials;
- private identity documents;
- raw personal identifiers;
- confidential customer data;
- private communications;
- production logs containing personal data;
- sensitive operational payloads.

If private evidence is required, it must remain outside the public repository and be handled through lawful, authorized, and private channels.

---

## 7. Change policy

The baseline uses an append-only change model.

Future changes should be recorded through:

- commits;
- audit documents;
- issue traces;
- event records;
- changelog entries;
- updated manifests where appropriate.

Past public proof should not be silently rewritten in a way that changes meaning without trace.

If a record or page is superseded, the new state should be documented as an update, status transition, or replacement event.

---

## 8. Anchor reference

External origin reference:

```text
https://manuelcoletta1-source.github.io/ipr-3-origin/

This reference is treated as an external public anchor and should not be interpreted as public custody of private evidence inside this repository.


---

9. Notes

This baseline fixes meaning, not history.

Future changes must be additive, declared, and reviewable.

The platform remains experimental unless a specific component is separately documented as implemented, validated, and operationally active.

Public verification means public proof commitment review. It is not equivalent to legal certification, private identity verification, or institutional approval.


