# HBCE PROG-070 - Level 1 Authority Boundary Statement

Status: LEVEL1_AUTHORITY_BOUNDARY_STATEMENT_DEFINED_NOT_READY

## Purpose

This artifact defines the authority boundary required before a governed digital action can enter the Level 1 Decision Proof evidence chain.

It does not bind a concrete authority yet.

It does not create legal validity.

It does not allow AI model authority.

## Authority Rule

A Level 1 governed action requires human or organizational authority.

AI model output is not authority.

Missing authority boundary fails closed.

Missing scope fails closed.

Missing policy reference fails closed.

Expired or revoked authority fails closed.

## Required Fields

- authority_boundary_id
- authority_type
- authority_ref
- organization_ref
- role_ref
- delegation_ref
- scope_ref
- policy_ref
- validity_window
- revocation_ref
- evidence_chain_ref
- non_claims

## Next Required Program

PROG-071-HBCE-LEVEL1-POLICY-EVALUATION-RECORD.
