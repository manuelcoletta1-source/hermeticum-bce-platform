# HBCE Evidence Core v1 — Banking Demo Pack Index

Date: 2026-09-24

## Pack status

HBCE_BANKING_DEMO_PACK_INDEX_STATUS=READY

This index is the single reviewer entrypoint for the HBCE Evidence Core v1 banking demo pack.

It links the committed demo JSON artifact, the banking demo manifest, the future API adapter contract, deterministic hashes, validation tests and operational boundaries.

## Source checkpoint

- PR134 checkpoint main: `bde30ad90ec4f006c6e44bfa99136e0eaf1ede9e`
- PR134 checkpoint document SHA-256: `aa8575ce57f7a761e001928a703391d717481c91e6e063db8441c86dfd628bc9`

## Pack artifacts

### 1. Demo JSON artifact

- Path: `artifacts/product/hbce-evidence-core-v1-demo-payload-export-2026-09-24.json`
- File SHA-256: `fb688399b1fbabe7060a9c74f3a88aeb03c60d0069ae6c4ed40a330697ba710f`
- Demo payload export SHA-256: `a6c90405c01f96079dc3f1883b81b22340fac7df60c5bd0a6c6b897d43f27cfd`
- Demo payload core SHA-256: `a62615e28a2a0514a4c88025d6dcb8d90d45824960337e88e9aef8797b0ffee5`
- Validation test: `tests/product/validate-hbce-evidence-core-v1-demo-json-artifact.test.js`
- Validation test SHA-256: `b9dfe9c84524f78aff856f26dfcd6cf6c6276b0259d6c5df61fb9fcbfb7dd515`

### 2. Banking demo manifest

- Path: `artifacts/product/hbce-evidence-core-v1-banking-demo-manifest-2026-09-24.md`
- File SHA-256: `d8d839c54e676f46f5e3f8b43d9a1e0b9503f9e6e1f387036962e093249c040c`
- Validation test: `tests/product/validate-hbce-evidence-core-v1-banking-demo-manifest.test.js`
- Validation test SHA-256: `1db3c724a450053adee9de011792bf4505946a35fc6d79ae2aa25704054d09da`

### 3. API adapter contract

- Path: `artifacts/product/hbce-evidence-core-v1-api-adapter-contract-2026-09-24.md`
- File SHA-256: `79233f7f37c0afca1dff0fc604f425d094d54e968a7bb864b88c3805ac87a963`
- Validation test: `tests/product/validate-hbce-evidence-core-v1-api-adapter-contract.test.js`
- Validation test SHA-256: `e9ea6782c0903b46451ea7ae34b50e99e49a30db47828e4952ec233646cc52d2`

## Reviewer entrypoint

A reviewer should start with this file, then inspect the banking demo manifest, then inspect the demo JSON artifact, then inspect the API adapter contract.

Recommended order:

1. Read this pack index.
2. Read the banking demo manifest.
3. Inspect the demo JSON artifact.
4. Read the API adapter contract.
5. Run the validation tests.
6. Compare all SHA-256 hashes.

## What the pack demonstrates

The pack demonstrates that HBCE Evidence Core v1 has a controlled banking demo package composed of:

- a static JSON evidence artifact
- a human-readable banking demo manifest
- a future API adapter contract
- deterministic SHA-256 verification
- explicit allowed claims
- explicit prohibited claims
- explicit non-production boundary
- explicit non-authorization boundary
- explicit non-regulatory boundary

## Allowed claims

The pack supports the following claims:

- deterministic internal evidence chain
- fail-closed access decision behavior
- observe-only review package generation
- static JSON artifact available for inspection
- banking-review-ready demo manifest
- future API adapter contract defined
- SHA-256 reproducible verification path
- controlled reviewer handoff package

## Prohibited claims

The pack does not support the following claims:

- production deployment proof
- live API availability
- legal certification
- eIDAS qualification
- external review completion
- regulatory approval
- OPC ALLOW creation
- autonomous banking authorization
- live transaction approval
- customer-facing production approval
- financial transaction approval

## Boundary summary

The banking demo pack remains:

- internal
- deterministic
- read-only
- observe-only
- fail-closed
- non-authorizing
- non-executing
- non-mutating
- non-production
- non-regulatory

The pack does not grant authorization, does not create authorization artifacts, does not grant access, does not execute runtime actions, does not create dispatch, does not mutate runtime state, does not create legal certification, does not create eIDAS qualification, does not create OPC ALLOW, does not prove production deployment, does not complete external review, does not claim regulatory approval, does not authorize banking operations, and does not approve live financial transactions.

## Repository constraint

The current repository still does not provide a live application route scaffold.

The API adapter contract is a specification artifact only and must not be interpreted as proof that a live API route exists.

## Verification chain

Minimum verification chain:

1. Validate this pack index.
2. Validate the API adapter contract.
3. Validate the banking demo manifest.
4. Validate the committed demo JSON artifact.
5. Validate the demo payload export.
6. Validate the readable product surface.
7. Validate the PR128 source review package.

Expected verification results:

- PR135 banking demo pack index validation: `16/16 PASS`
- PR134 API adapter contract validation: `15/15 PASS`
- PR133 banking demo manifest validation: `13/13 PASS`
- PR132 JSON artifact validation: `13/13 PASS`
- PR131 demo payload export: `18/18 PASS`
- PR130 readable surface: `19/19 PASS`
- PR128 source review package: `21/21 PASS`

## Controlled handoff meaning

This index prepares controlled handoff to banking, compliance, audit, security, innovation or procurement reviewers.

The correct interpretation is:

`HBCE Evidence Core v1 has a deterministic internal banking demo evidence pack ready for controlled review.`

The incorrect interpretation is:

`HBCE has production authorization, regulatory approval, live banking execution or an active API endpoint.`

## Next step

After this index, the next safe product step is external-facing dossier packaging or implementation of the adapter only inside a repository with a real application route scaffold.
