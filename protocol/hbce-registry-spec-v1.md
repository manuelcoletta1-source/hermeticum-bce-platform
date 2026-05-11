# HBCE Registry Specification v1

This document defines the HBCE Registry Specification v1 as a historical and technical R&D reference for HERMETICUM B.C.E. S.r.l.

The registry layer exposes minimized, structured, and verifiable metadata related to nodes, events, audit cases, evidence packs, verification results, and operational status references.

In the current public boundary, the HBCE registry must be understood as an R&D and pilot-oriented public proof registry. It is not a public authority registry, not a regulated certification register, not an eIDAS qualified trust service, not a custodial identity service, and not a production compliance framework by itself.

## 1. Registry Purpose

The registry enables controlled visibility of selected technical records.

Its purpose is to support:

- hash-only public references;
- append-only audit history;
- node visibility;
- event visibility;
- audit-case traceability;
- evidence-pack continuity;
- verification results;
- fail-closed review;
- IPR AI Audit Trail MVP demonstrations.

The registry does not need to expose confidential payloads. Its preferred public function is to publish minimized records that allow verification without disclosing the underlying private material.

## 2. Current Scope

The current scope of the HBCE registry is aligned with the IPR-first public proof model and the IPR AI Audit Trail MVP.

Within this scope, the registry may represent records connected to:

- IPR attribution;
- AI output recording;
- AI output review;
- human validation;
- policy checks;
- governance decisions;
- risk assessments;
- audit notes;
- evidence-pack creation;
- verification requests;
- verification results;
- registry status updates.

MATRIX remains the wider architectural framework. The registry specification defines the public proof surface inside the HBCE operating layer.

The registry should use `payload_sha256` or `event_payload_sha256` as the public reference to private or confidential payloads.

## 3. Registry Boundary

The registry follows a no-custody and minimization model.

Public registry records should not contain:

- personal data unless strictly necessary and lawfully reviewed;
- confidential client files;
- raw AI prompts;
- raw AI outputs;
- internal audit payloads;
- private keys;
- financial assets;
- regulated identity documents;
- security-sensitive operational secrets.

The registry may expose:

- record identifiers;
- node identifiers;
- event identifiers;
- entity references;
- operator references;
- timestamps;
- record kinds;
- event types;
- status fields;
- hash references;
- append-only linkage;
- verification metadata.

## 4. Registry Components

The registry is composed of two primary structures:

- node registry;
- event registry.

Additional structures may be used for future R&D or pilot work, including:

- audit-case registry;
- evidence-pack registry;
- operator-reference registry;
- verification-result registry;
- public proof registry.

The current repository paths are:

`registry/nodes.json`

`registry/events.json`

These files represent observable technical metadata and should not be interpreted as a public legal registry or regulated certification list.

## 5. Node Registry

Node registry file:

`registry/nodes.json`

The node registry lists node references currently defined or historically documented in the infrastructure.

Minimal node structure:

- `node_id`;
- `environment`;
- `node_type`;
- `identity_layer`;
- `coordination_engine`;
- `registry_integration`;
- `verification_mode`;
- `custody_boundary`;
- `status`;
- `description`.

Example:

```json
{
  "node_id": "hbce-node-rnd-0001",
  "environment": "hbce-platform-rnd",
  "node_type": "AUDIT_TRAIL_NODE",
  "identity_layer": "ipr-reference-layer",
  "coordination_engine": "joker-c2-rnd",
  "registry_integration": "hash-only",
  "verification_mode": "fail-closed",
  "custody_boundary": "no-public-data-custody",
  "status": "rnd-active",
  "description": "HBCE R&D node for IPR AI Audit Trail self-pilot and hash-only verification records."
}

A node registry entry does not imply public authority status, regulated approval, institutional mandate, or production compliance certification.

6. Event Registry

Event registry file:

registry/events.json

The event registry lists selected technical events recorded within the infrastructure.

Minimal event structure:

event_id;

entity_id;

event_type;

event_payload_sha256;

timestamp;

operator_reference;

status;

append_only;

description.


Example:

{
  "event_id": "EVT-IPR-HUMAN-VALIDATION-0001",
  "entity_id": "IPR-AI-AUDIT-0001",
  "event_type": "HUMAN_VALIDATION",
  "event_payload_sha256": "ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff",
  "timestamp": "2026-05-07T15:40:00+02:00",
  "operator_reference": "IPR-OP-RND-0001",
  "status": "RND_ONLY",
  "append_only": true,
  "description": "R&D example event representing human validation of an IPR AI Audit Trail record."
}

An event registry entry should expose the existence and verification reference of an event, not the confidential event payload itself.

7. Audit Case Registry Pattern

For IPR AI Audit Trail, the registry may include an audit-case reference.

An audit case can represent a bounded review sequence involving an IPR reference, an AI system, a human reviewer, a policy check, a validation action, and an evidence pack.

Example audit-case reference:

{
  "audit_case_id": "IPR-AUDIT-CASE-0001",
  "entity_id": "IPR-AUDIT-CASE-RND-0001",
  "scope": "IPR_AI_AUDIT_TRAIL_MVP",
  "payload_sha256": "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
  "created_at": "2026-05-07T15:30:00+02:00",
  "status": "RND_ONLY",
  "public_payload_policy": "HASH_ONLY",
  "description": "R&D audit case reference for IPR AI Audit Trail self-pilot."
}

This pattern allows the registry to represent audit continuity without publishing the underlying private case material.

8. Evidence Pack Registry Pattern

An evidence-pack record may reference a structured bundle of audit material.

Example evidence-pack reference:

{
  "evidence_pack_id": "EVIDENCE-PACK-IPR-AUDIT-0001",
  "audit_case_id": "IPR-AUDIT-CASE-0001",
  "payload_sha256": "1212121212121212121212121212121212121212121212121212121212121212",
  "created_at": "2026-05-07T15:45:00+02:00",
  "status": "RND_ONLY",
  "public_payload_policy": "HASH_ONLY",
  "description": "Hash-only reference to an R&D evidence pack. The underlying payload is not published in the public registry."
}

The evidence pack itself may remain private, local, client-controlled, or separately disclosed under appropriate legal and security conditions.

9. Verification Result Registry Pattern

A verification result may record whether a ledger, event, entity, node, or evidence pack passed structural verification.

Example verification result:

{
  "verification_id": "VERIFY-IPR-AUDIT-0001",
  "target_id": "EVT-IPR-HUMAN-VALIDATION-0001",
  "verifier": "hbce-verify.reference.js",
  "result": "VALID_RND_ONLY",
  "fail_closed": true,
  "timestamp": "2026-05-07T15:50:00+02:00",
  "description": "R&D verification result. VALID_RND_ONLY is not a production compliance certification."
}

A verification result does not replace legal, cybersecurity, privacy, or compliance review.

10. Registry Position in the Framework

Within the HERMETICUM B.C.E. technical framework, the registry layer operates as the minimized public visibility surface for selected audit records.

The registry position can be represented as:

HERMETICUM B.C.E. R&D → IPR → IPR AI Audit Trail → Registry Layer → Nodes / Events / Evidence Packs / Verification Results

MATRIX remains the wider architectural framework around this technical sequence.

The registry does not create legal validity by itself. It supports technical traceability, continuity, audit inspection, and deterministic verification.

11. Repository Location

Registry files are located in:

registry/

Primary files:

registry/nodes.json

registry/events.json

Additional future files may include:

registry/audit-cases.json

registry/evidence-packs.json

registry/verification-results.json

Any new registry file should follow the same boundary: minimized metadata, hash-only references, append-only continuity, fail-closed verification, and no public custody of confidential payloads.

12. Operational Boundaries

The HBCE registry specification follows these boundaries:

EU-first reference framework;

audit-first design;

fail-closed verification;

hash-only public exposure;

append-only record continuity;

GDPR-minimized publication model;

no public data custody;

no private key custody;

no financial custody;

no regulated certification claim;

no public authority claim;

no offensive or military command function.


Any production use requires independent legal, cybersecurity, privacy, compliance, and operational review.

13. Version

Specification version: v1.2 R&D reference alignment.

Original v1 concept retained as historical basis.

Current alignment: IPR-first public proof model, IPR AI Audit Trail MVP, registry v3 boundary, no-custody model, hash-only public records, fail-closed verification.

MATRIX remains the wider architectural framework.



