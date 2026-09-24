# HBCE P0 Package Skeleton

Status: PROG-001 skeleton only.  
Source alignment: HBCE Programming Execution Refactor R2-PROG-0.1.  
Product wedge: AI Agent Tool Access Evidence Layer.  
Secondary wedge: Bank Critical Action Evidence Pilot.

## Purpose

This skeleton prepares the platform repository for the P0 implementation path:

- one critical AI/tool action chain
- one evidence chain
- one verifier surface
- one export format
- no dashboard before verifier
- no broad HBCE universe before the P0 chain works

## Apps

- `apps/hbce-api`: future minimal HTTP API for pilot endpoints.
- `apps/hbce-demo`: future AI tool access and bank critical action demos.
- `apps/hbce-verifier-cli`: future offline verifier CLI.

## Packages

- `packages/hbce-core`: canonicalization, digests, identifiers.
- `packages/hbce-schemas`: schema registry, schema hashes, schema version enforcement.
- `packages/hbce-api-contract`: RequestEnvelope, responses, stable errors.
- `packages/hbce-identity`: ActorRef, AuthorityRef, session bindings.
- `packages/hbce-policy`: capability and policy decisions.
- `packages/hbce-ftel`: CriticalAction FSM and transitions.
- `packages/hbce-events`: append-only event chain and gap detection.
- `packages/hbce-anchor`: precommit and anchor state handling.
- `packages/hbce-targets`: TargetReceipt contract and adapters.
- `packages/hbce-evidence`: EvidenceBundle and export profile.
- `packages/hbce-trust`: key references, signatures and admin separation placeholders.

## Boundary

This commit does not claim:

- no runtime implementation
- no production readiness
- no regulatory certification
- no legal opinion
- no verifier completeness
- no AI agent safety claim
- no banking pilot readiness claim

It only creates the P0 implementation skeleton.
