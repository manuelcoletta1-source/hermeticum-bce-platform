# HBCE Network Architecture v1

This document describes the HBCE Network Architecture v1 as a historical and technical R&D reference for HERMETICUM B.C.E. S.r.l.

The architecture is retained as a conceptual model for verifiable operational environments, audit-trail experiments, identity-bound records, append-only event history, and fail-closed verification flows. It is currently aligned with the IPR-first public proof model and the IPR AI Audit Trail MVP. MATRIX remains the wider architectural framework. This document must be read within a non-custodial, hash-only, EU-first research boundary.

This document is not a legal standard, not a public authority registry, not a regulated certification framework, not an eIDAS qualified trust service, and not a production compliance system by itself.

## 1. Scope

The HBCE network is an experimental technological architecture designed to connect identity references, audit events, evidence records, registry entries, and verification logic.

Its primary current use is the IPR AI Audit Trail MVP, where the system records verifiable metadata around IPR attribution, AI-assisted activity, human validation, policy checks, governance decisions, evidence-pack creation, and verification results.

The network does not require public custody of personal data, confidential payloads, private keys, financial assets, regulated identity documents, or client-controlled content.

The public layer should expose only minimized records, hashes, timestamps, record kinds, status fields, and verification metadata when appropriate.

## 2. Architecture Overview

The HBCE network is composed of five primary layers:

1. Identity Reference Layer.
2. Event Layer.
3. Node Layer.
4. Registry Layer.
5. Verification and Coordination Layer.

Together, these layers define a research architecture for transforming operational activity into structured, attributable, hash-linked, and auditable records.

In the current MVP boundary, the architecture should be understood as an audit-trail infrastructure for IPR-based workflows, not as a claim of public authority, regulated certification, autonomous authorization, or institutional mandate.

## 3. Identity Reference Layer

The identity reference layer is based on the Identity Primary Record model, abbreviated as IPR.

In this R&D architecture, IPR provides a structured reference for associating records, events, operators, AI systems, audit cases, software services, documents, and evidence packs with identifiable operational references.

Entities may include:

- human reviewer references;
- AI system references;
- organization references;
- software service references;
- document references;
- audit case references;
- evidence-pack references;
- registry operator references.

The identity reference layer enables attribution and continuity within the audit model, while preserving the no-custody boundary. Public records should use payload hashes and minimized metadata rather than exposing confidential identity data or operational payloads.

## 4. Event Layer

Operational activity is represented through events.

Events are described by the IPR event protocol reference defined in:

`protocol/ipr-event-v1.md`

In the IPR AI Audit Trail MVP, events may represent:

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
- verification result.

Each event should link the following elements:

`ENTITY_REFERENCE → ACTION → TIMESTAMP → PAYLOAD_HASH → OPERATOR_REFERENCE → STATUS`

The event layer does not need to publish the full payload. The preferred public pattern is hash-only exposure through `payload_sha256` or `event_payload_sha256`.

## 5. Node Layer

The node layer is composed of HBCE node references.

The node specification is defined in:

`protocol/hbce-node-spec-v1.md`

Within the current R&D boundary, a node is a technical reference point for hosting, producing, testing, or verifying audit-trail records. A node may represent a local development environment, an internal R&D instance, a pilot environment, or a public static verification surface.

Nodes may support:

- local event generation;
- append-only ledger examples;
- hash computation;
- canonical JSON serialization;
- ED25519 signing experiments;
- verification scripts;
- evidence-pack assembly;
- registry integration.

A node does not imply public authority status, regulated certification status, custody of user data, or autonomous institutional authorization.

## 6. Registry Layer

The registry layer exposes the observable state of selected records.

The registry specification is defined in:

`protocol/hbce-registry-spec-v1.md`

The registry may publish:

- minimized identity reference records;
- operator reference records;
- audit case records;
- event records;
- evidence-pack records;
- verification metadata;
- hash-only references.

Registry files may include:

`registry/nodes.json`

`registry/events.json`

In the current public boundary, registry records should remain minimized and should avoid publishing confidential payloads, personal data, client documents, private keys, raw AI prompts, raw AI outputs, or internal audit material.

The registry is a technical R&D registry surface. It is not a public authority registry, not a regulated trust service, and not a substitute for independent legal, security, or compliance review.

## 7. Verification and Coordination Layer

The verification layer checks whether records and ledgers satisfy deterministic structural rules.

Reference tools include:

`protocol/hbce-verify.reference.js`

`protocol/hbce-sign.reference.js`

The verification layer may check:

- required fields;
- canonical JSON hash rebuilding;
- append-only chain continuity;
- parent-child derivation rules;
- event-to-entity consistency;
- operator presence;
- ED25519 signatures when real keys are provided;
- fail-closed invalidation when data is missing, malformed, placeholder-based, or unverifiable.

The coordination layer is conceptually associated with JOKER-C2 as a research coordination engine for identity-bound execution, audit continuity, runtime state, and event generation.

In the current public positioning, JOKER-C2 must be understood as an R&D runtime demonstrator for IPR-based audit workflows, not as an autonomous public authority system or unrestricted operational command system.

## 8. Network Flow

The operational flow of the HBCE network can be represented as:

`ENTITY_REFERENCE → ACTION → EVENT_RECORD → NODE_CONTEXT → REGISTRY_RECORD → VERIFICATION_RESULT → AUDIT_HISTORY`

For IPR AI Audit Trail, the preferred flow is:

`IPR_ATTRIBUTION → AI_OUTPUT → POLICY_CHECK → HUMAN_VALIDATION → EVIDENCE_PACK → HASH_ONLY_RECORD → FAIL_CLOSED_VERIFICATION`

This sequence makes the audit history inspectable without requiring public exposure of confidential content.

## 9. IPR AI Audit Trail Position

Within the current development roadmap, the HBCE network architecture supports the IPR AI Audit Trail MVP.

The MVP goal is to provide a verifiable audit layer for AI-assisted activity by recording structured metadata, responsibility references, policy checks, human validation, evidence-pack hashes, and verification outcomes.

This makes the architecture useful for internal R&D, pilot discussions, B2B/B2G technical evaluation, institutional review, and demonstrable audit-readiness.

The current first pilot boundary is HERMETICUM B.C.E. S.r.l. itself, using the system as an internal R&D and self-audit environment before any external client deployment.

## 10. Operational Boundaries

The HBCE network architecture follows these boundaries:

- EU-first reference framework;
- audit-first design;
- fail-closed verification;
- hash-only public exposure;
- append-only record structure;
- GDPR-minimized publication model;
- no public data custody;
- no private key custody;
- no financial custody;
- no regulated certification claim;
- no public authority claim;
- no offensive or military command function.

Any production use requires independent legal, cybersecurity, privacy, compliance, and operational review.

## 11. Architecture Position

Within the broader HERMETICUM B.C.E. research framework, the HBCE network operates as a technical infrastructure layer for verifiable operational continuity.

The conceptual position is:

`HERMETICUM B.C.E. R&D → IPR → IPR AI Audit Trail → HBCE Network → Nodes / Events / Registry / Verification → Audit-Ready Operational Evidence`

MATRIX remains the wider architectural framework around this technical sequence.

The architecture is therefore not presented as a completed public infrastructure, but as a disciplined technical model for building evidence, responsibility, verification, and continuity around AI-assisted and institutionally relevant operations.

## 12. Version

Architecture specification version: v1.2 R&D reference alignment.

Original v1 concept retained as historical basis.

Current alignment: IPR-first public proof model, IPR AI Audit Trail MVP, registry v3 boundary, no-custody model, hash-only public records, fail-closed verification.
