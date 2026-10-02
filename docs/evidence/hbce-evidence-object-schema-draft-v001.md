# HBCE Evidence Object Schema Draft v001

Program: `PROG-266-HBCE-EVIDENCE-OBJECT-SCHEMA-DRAFT`

## Purpose

This document defines a reusable draft structure for HBCE public evidence objects, viewer records and IPR bridge records.

It standardizes how HBCE evidence records describe identity, status, provenance, anchors, boundaries, non-claims and review paths.

It does not create a production schema registry.

It does not certify evidence.

It does not grant access authorization.

It does not authorize dispatch.

## Basis

Final IPR bridge audit marker:

`HBCE_IPR_ONBOARDING_EVIDENCE_BRIDGE_FINAL_AUDIT=1`

Current IPR bridge baseline commit:

`e0de5e4b9d966d74841fcf52ce4511f56c1179d8`

## Schema Is

- A public R&D schema draft baseline
- A reusable evidence object field model
- A read-only documentation and planning artifact
- A preparation layer for future machine-readable evidence records

## Schema Is Not

- A production schema registry
- A certification schema
- A legal evidence standard
- A dynamic verifier
- A dispatch authorization contract
- A customer onboarding implementation
- A Level 1 pilot readiness claim

## Required Evidence Object Fields

- `object_id`
- `artifact_type`
- `version`
- `status`
- `classification`
- `basis_marker`
- `basis_main_commit`
- `purpose`
- `public_surfaces`
- `release_anchor`
- `explicit_non_claims`
- `no_execution_boundary`
- `recommended_review_path`
- `result`

## Anchor Model

- `basis_marker` is required.
- `basis_main_commit` is required.
- Tag anchors are required for released baselines.
- GitHub Release anchors are required for released baselines.
- Pages readback is required for public surfaces.

## Boundary Model

- Explicit non-claims are required.
- No-execution boundary is required.
- Effect evidence separation is required.
- Access authorization separation is required.
- Legal certification separation is required.

## Minimum Schema Requirements

- Every evidence object must declare what it is.
- Every evidence object must declare what it is not.
- Every evidence object must expose status and classification.
- Every evidence object must bind to a basis marker and basis commit.
- Every released baseline must expose tag and release anchors.
- Every public surface must preserve explicit non-claims.
- Every access-related record must separate evidence visibility from access authorization.
- Every dispatch-related record must preserve no-dispatch and no-effect boundaries.

## Boundary

This schema draft does not claim production schema registry, schema certification, legal evidence standard, dynamic verifier, access authorization service, onboarding implementation, certificate issuance, legal certification, full MATRIX implementation, Level 1 pilot readiness, commercial release authorization, dispatch, target receipt, execution trace or effect evidence.

It does not enforce a schema registry, perform production validation, grant access authorization, issue a certificate, mutate an IPR state, authorize dispatch execution, emit a dispatch command, perform dispatch, call an external connector, contact a target system, create a target receipt, bind an execution trace or create effect evidence.

## Recommended Next Steps

1. `PROG-267 IPR Onboarding Evidence Record Draft`
2. `PROG-268 Evidence Schema Conformance Harness`
