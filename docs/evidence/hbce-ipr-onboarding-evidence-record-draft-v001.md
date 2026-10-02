# HBCE IPR Onboarding Evidence Record Draft v001

Program: `PROG-267-HBCE-IPR-ONBOARDING-EVIDENCE-RECORD-DRAFT`

## Purpose

This document defines the first reusable machine-readable draft record for IPR onboarding evidence.

It uses the HBCE Evidence Object Schema Draft as its basis.

It does not implement onboarding.

It does not verify identity.

It does not issue cards or certificates.

It does not grant access authorization.

It does not authorize dispatch.

## Basis

Final schema draft audit marker:

`HBCE_EVIDENCE_OBJECT_SCHEMA_DRAFT_FINAL_AUDIT=1`

Current schema draft baseline commit:

`ada427b608f5f13ab3ac150f356a09ad0f92dc52`

Schema basis:

`schemas/evidence/hbce-evidence-object-record-v001.schema.json`

## Record Is

- A public R&D evidence record draft
- A machine-readable onboarding state evidence model
- A reusable template for future onboarding state records
- A non-authorizing record structure

## Record Is Not

- An onboarding implementation
- An identity provider
- An access authorization service
- A certificate issuer
- A legal certification mechanism
- A dispatch authorization record
- A production customer portal
- A Level 1 pilot readiness claim

## IPR Status Model

Allowed IPR status values:

- `verified`
- `pending`
- `rejected`
- `revoked`
- `suspended`
- `expired`

Authorizing values:

- none

Deny-state values:

- `pending`
- `rejected`
- `revoked`
- `suspended`
- `expired`

Important boundary:

`verified` is an identity/onboarding state and must not be treated as dispatch authorization by itself.

## IPR Card Status Model

Allowed IPR card status values:

- `issued`
- `pending`
- `not_issued`
- `revoked`
- `expired`

Authorizing values:

- none

## Certificate Status Model

Allowed certificate status values:

- `active`
- `pending`
- `not_created`
- `revoked`
- `expired`

Authorizing values:

- none

Important boundary:

`active` is a certificate status and does not independently grant dispatch authorization.

## Future Evidence Fields To Capture

- `request_id`
- `subject_ref`
- `tenant_ref`
- `identity_ref`
- `ipr_status`
- `ipr_card_status`
- `certificate_status`
- `reviewer_authority_ref`
- `policy_ref`
- `decision_ref`
- `basis_marker`
- `basis_main_commit`
- `created_at`
- `observed_at`
- `state_reason`
- `deny_reason`
- `review_path`
- `explicit_non_claims`
- `no_execution_boundary`

## Minimum Record Requirements

- The record must expose onboarding state without granting access authorization.
- The record must separate identity verification from dispatch authorization.
- The record must preserve fail-closed handling for pending, rejected, revoked, suspended and expired states.
- The record must preserve certificate status as non-authorizing by itself.
- The record must preserve OPC proof as a technical verification receipt, not legal certification.
- The record must preserve no-dispatch and no-effect boundaries.
- The record must remain compatible with the HBCE Evidence Object Record v001 schema draft.

## Boundary

This record draft does not claim onboarding implementation, identity provider, access authorization service, certificate issuance, legal certification, dispatch authorization, full MATRIX implementation, Level 1 pilot readiness, commercial release authorization, target receipt, execution trace or effect evidence.

It does not start onboarding, review onboarding, verify identity, issue an IPR card, issue a certificate, activate a certificate, grant access authorization, mutate an IPR state, authorize dispatch execution, emit a dispatch command, perform dispatch, call an external connector, contact a target system, create a target receipt, bind an execution trace or create effect evidence.

It does not create effect evidence.

## Recommended Next Steps

1. `PROG-268 Evidence Schema Conformance Harness`
2. `PROG-269 IPR Onboarding Deny-State Harness`
