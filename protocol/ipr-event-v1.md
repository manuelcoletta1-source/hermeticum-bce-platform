# IPR Event Protocol v1

This document defines the IPR Event Protocol v1 as a historical and technical R&D reference for HERMETICUM B.C.E. S.r.l.

The protocol describes how identity-bound operational events may be structured, recorded, hashed, signed, and verified within the HBCE technical architecture.

In the current public boundary, this protocol is aligned with the IPR-first public proof model and the IPR AI Audit Trail MVP. MATRIX remains the wider architectural framework. This protocol must be understood as an R&D and pilot-oriented audit reference, not as a legal standard, not as a public authority event registry, not as a regulated certification framework, not as an eIDAS qualified trust service, and not as a production compliance system by itself.

## 1. Protocol Purpose

The purpose of the IPR Event Protocol is to provide a structured format for recording actions associated with identifiable operational references.

The protocol supports:

- identity-bound event attribution;
- IPR attribution;
- AI audit-trail recording;
- human validation tracking;
- policy-check recording;
- evidence-pack continuity;
- append-only event history;
- hash-only public proof;
- fail-closed verification;
- registry integration.

The event protocol does not require public disclosure of confidential payloads. Public records should expose minimized metadata and hash references rather than raw prompts, raw outputs, personal data, client documents, private keys, or internal audit material.

## 2. Current Scope

The current scope of the protocol is the IPR AI Audit Trail MVP.

Within this scope, events may represent:

- IPR attribution;
- AI output recorded;
- AI output reviewed;
- human validation;
- policy check;
- risk assessment;
- governance decision;
- audit note;
- evidence-pack creation;
- registry status update;
- verification request;
- verification result;
- access event;
- security notice.

The goal is to transform operational activity into a verifiable sequence without turning the public registry into a custodial data store.

## 3. Event Model

Each event represents a single recorded action.

The preferred event structure is:

`ENTITY_REFERENCE → ACTION → TIMESTAMP → PAYLOAD_HASH → OPERATOR_REFERENCE → STATUS`

In registry-compatible form, this becomes:

`event_id → entity_id → event_type → event_payload_sha256 → timestamp → operator → status → append_only`

The event identifies that an action occurred, when it occurred, which entity reference it concerns, which operator reference recorded or validated it, and which payload hash represents the underlying private material.

## 4. Required Event Fields

### event_id

Unique identifier of the event.

Example:

`EVT-IPR-HUMAN-VALIDATION-0001`

### entity_id

Identifier of the entity, audit case, AI system reference, software service reference, document reference, or evidence-pack reference affected by the event.

Example:

`IPR-AI-AUDIT-0001`

### event_type

Type of event recorded.

Recommended values for the IPR AI Audit Trail MVP:

- `IPR_ATTRIBUTION`;
- `AI_OUTPUT_RECORDED`;
- `AI_OUTPUT_REVIEWED`;
- `HUMAN_VALIDATION`;
- `GOVERNANCE_DECISION`;
- `POLICY_CHECK`;
- `RISK_ASSESSMENT`;
- `AUDIT_NOTE`;
- `EVIDENCE_PACK_CREATED`;
- `REGISTRY_STATUS_UPDATE`;
- `VERIFICATION_REQUEST`;
- `VERIFICATION_RESULT`;
- `ACCESS_EVENT`;
- `SECURITY_NOTICE`.

### event_payload_sha256

SHA-256 hash of the event payload.

The payload itself may remain private, local, client-controlled, or separately disclosed under appropriate legal and security conditions.

Example:

`ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff`

### timestamp

Time at which the event occurred or was recorded.

Recommended format:

`RFC3339`

Example:

`2026-05-07T15:40:00+02:00`

A timezone should always be included.

### operator

Reference to the operator or system responsible for recording, validating, or signing the event.

Minimal operator structure:

```json
{
  "operator_id": "IPR-OP-RND-0001",
  "sign_alg": "ED25519",
  "pubkey": "PUBKEY_PLACEHOLDER",
  "signature": "SIGNATURE_PLACEHOLDER"
}

Placeholder signatures are acceptable only inside R&D examples. A real fail-closed verifier must reject placeholder signatures unless an explicit demo flag is used.

status

Current event status.

Recommended values:

VALID;

INVALID;

REVOKED;

DRAFT;

RND_ONLY.


RND_ONLY must not be interpreted as production legal validity, regulated certification, or public authority approval.

append_only

Boolean field declaring that the event belongs to an append-only record sequence.

Required value:

true

5. Optional Event Fields

description

Human-readable description of the event.

Example:

R&D example event representing human validation of an IPR AI Audit Trail record.

context

Technical context in which the event occurred.

Example:

IPR_AI_AUDIT_TRAIL_MVP

policy

Policy flags associated with the event.

Example:

[
  "EU_FIRST",
  "AUDIT_FIRST",
  "FAIL_CLOSED",
  "HASH_ONLY",
  "GDPR_MIN",
  "NO_PUBLIC_DATA_CUSTODY"
]

verification_result

Optional reference to a verification outcome.

Example:

{
  "result": "VALID_RND_ONLY",
  "verifier": "hbce-verify.reference.js",
  "fail_closed": true
}

anchors

Optional external anchoring references.

Example:

{
  "ipfs_cid": "optional",
  "btc_txid": "optional",
  "evm_tx": "optional"
}

Anchors are optional and do not replace internal verification of record structure, hash integrity, signature validity, and append-only continuity.

6. Example Event Record

{
  "proto": "HBCE-REGISTRY-v1",
  "kind": "IPR_EVENT_RECORD",
  "event_id": "EVT-IPR-HUMAN-VALIDATION-0001",
  "entity_id": "IPR-AI-AUDIT-0001",
  "event_type": "HUMAN_VALIDATION",
  "event_payload_sha256": "ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff",
  "timestamp": "2026-05-07T15:40:00+02:00",
  "operator": {
    "operator_id": "IPR-OP-RND-0001",
    "sign_alg": "ED25519",
    "pubkey": "PUBKEY_PLACEHOLDER",
    "signature": "SIGNATURE_PLACEHOLDER"
  },
  "status": "RND_ONLY",
  "append_only": true,
  "description": "R&D example event representing human validation of an IPR AI Audit Trail record."
}

7. IPR AI Audit Trail Flow

For IPR AI Audit Trail, the event protocol supports the following sequence:

IPR_ATTRIBUTION → AI_OUTPUT_RECORDED → POLICY_CHECK → AI_OUTPUT_REVIEWED → HUMAN_VALIDATION → EVIDENCE_PACK_CREATED → VERIFICATION_RESULT

This sequence allows the system to show that an AI-assisted output was attributed, recorded, checked, reviewed, validated, packaged as evidence, and verified through a deterministic reference process.

The public layer should expose only the event metadata and payload hashes. The actual prompt, output, review notes, client file, or internal decision material should remain outside the public registry unless a separate lawful disclosure process exists.

8. Verification Rules

A verifier should apply fail-closed behavior.

An event should be treated as invalid when:

required fields are missing;

event_payload_sha256 is not a 64-character hexadecimal SHA-256 value;

timestamp is missing or malformed;

operator.operator_id is missing;

signature verification fails;

placeholder signatures are used outside explicit R&D demo mode;

the referenced entity does not exist;

the referenced entity is not valid under the active verification boundary;

append_only is not set to true;

the event is disconnected from the ledger chain;

the event status is REVOKED, INVALID, DRAFT, or RND_ONLY without explicit R&D allowance.


A production verifier must not treat RND_ONLY as production validity.

9. Registry Integration

Event records may be published in the event registry.

Registry path:

registry/events.json

The public registry should expose minimized event metadata only.

A public event registry entry should not expose:

personal data;

confidential payloads;

raw AI prompts;

raw AI outputs;

private keys;

client files;

regulated identity documents;

financial assets;

internal security-sensitive material.


The preferred public proof pattern is:

event_id → entity_id → event_type → event_payload_sha256 → timestamp → operator_reference → status

10. Event Position in the Framework

Within the HERMETICUM B.C.E. technical framework, the IPR event protocol operates between identity references and registry-visible audit history.

The position can be represented as:

IPR Reference → IPR Event → HBCE Node → Registry Record → Verification Result → Audit History

For the IPR AI Audit Trail MVP, the position can be represented as:

IPR Attribution → AI Output → Event Record → Human Validation → Evidence Pack → Hash-Only Registry → Fail-Closed Verification

MATRIX remains the wider architectural framework around this technical sequence.

The event protocol therefore provides structured traceability. It does not create legal validity by itself and does not replace legal, cybersecurity, privacy, or compliance review.

11. Operational Boundaries

The IPR Event Protocol follows these boundaries:

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

12. Version

Protocol version: v1.2 R&D reference alignment.

Original v1 concept retained as historical basis.

Current alignment: IPR-first public proof model, IPR AI Audit Trail MVP, registry v3 boundary, no-custody model, hash-only public records, append-only event history, fail-closed verification.

MATRIX remains the wider architectural framework.

