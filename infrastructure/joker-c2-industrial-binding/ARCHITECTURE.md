# Joker-C2 — Industrial Binding Architecture (HBCE / IPR)

## Purpose
Joker-C2 is an industrial binding layer for robotics, automation and autonomous systems.
It enforces identity-gated execution, policy-bound control flows, and auditable evidence.

Joker-C2 does not replace functional safety, OEM firmware, or certified safety controllers.
It governs execution rights, accountability, and evidence proofs.

## Core invariants (non-negotiable)
- FAIL-CLOSED: missing proof or mismatch blocks execution
- HASH-ONLY (public): registry stores only minimized proofs
- APPEND-ONLY: audit proofs are append-only, never rewritten
- GDPR-MIN: no public custody of personal identity data
- Deterministic verification: PASS/FAIL only

## Primary objects
### IPR (Identity Primary Record)
Operational identity for:
- operators (humans / organizations)
- machines (robots, edge nodes, PLC gateways)
- services (software agents, orchestration services)

### Registry (public)
Append-only store for hash-only proofs:
- payload_sha256 for IPR releases
- evidence_pack_sha256 for execution evidence packs (recommended)

### Evidence Pack (private)
Owner-controlled bundle containing:
- execution request
- verification inputs
- decision output
- emitted events
- signatures (optional)
Publicly: only hash proof is published (hash-only).

## Control flow (strict)
1) Request
   - actor_ipr_id, target_ipr_id, command_intent, constraints
2) Verify
   - verify actor IPR validity (release vs registry proof)
   - verify target identity validity if required
3) Decide
   - policy engine resolves ALLOW / DENY deterministically
4) Execute
   - execution is emitted as an event (append-only)
   - evidence pack is produced and hashed
5) Audit
   - optional public proof: evidence_pack_sha256 appended to registry

## Interfaces (conceptual)
### Verifier interface
- input: release_text, expected_sha256
- output: PASS/FAIL + computed_sha256
- failure mode: FAIL

### Policy engine interface
- input: request + verified identities + policy set
- output: ALLOW/DENY + reason_code (deterministic)
- failure mode: DENY

### Event emitter interface
- input: decision + request + timestamps
- output: append-only event record
- failure mode: abort emission

## Deployment tiers (industrial reality)
- Edge Gateway: local verification + local policy + local event log
- Plant Node: aggregation of gateways, audit packs, operator governance
- Network Operator: issuance / validation / governance across sites

## Safety boundary (explicit)
Joker-C2 is not defined as an autonomous safety controller.
It must not bypass OEM safety constraints.
It can only gate and audit execution attempts.

## Files in this directory
- index.html: industrial landing and flow definition
- SPEC/JOKER-C2-EVENT-v1.json: minimal event schema for append-only logs
