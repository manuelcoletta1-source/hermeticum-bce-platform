# HBCE Main Checkpoint — Evidence Core v1 Demo Payload Export

Date: 2026-09-24

## Status

POST_PR_131_MAIN_CHECKPOINT=PASS

PR131 adds a compact product demo payload export for HBCE Evidence Core v1.

## Commits

- Previous product checkpoint baseline: `af4fb450a50cd2cec564eded19d155fe7d6b4e2a`
- PR131 feature commit: `94751d54078a3fd2b1b70f0f685765821a81422c`
- PR131 merge commit / current main: `fc82f231f618bbc85ba1f47c9b132052b3ea334f`
- Current main: `fc82f231f618bbc85ba1f47c9b132052b3ea334f`

## Artifacts

- Runtime: `runtime/product/create-hbce-evidence-core-v1-demo-payload-export.js`
- Test: `tests/product/create-hbce-evidence-core-v1-demo-payload-export.test.js`

## Deterministic hashes

- Demo payload export SHA-256: `a6c90405c01f96079dc3f1883b81b22340fac7df60c5bd0a6c6b897d43f27cfd`
- Demo payload core SHA-256: `a62615e28a2a0514a4c88025d6dcb8d90d45824960337e88e9aef8797b0ffee5`
- Runtime SHA-256: `6e444e81b244dc4472fa75f05a1d2f2587b1eec268cecfbfa101d2245aa696c0`
- Test SHA-256: `e6a2ebb93e37a345d5527d5b7b68d584233094e6d93f9bdf8d4ce8a0d3134fb3`

## Verification

- PR131 demo payload export: `18/18 PASS`
- PR130 readable surface: `19/19 PASS`
- PR128 source review package: `21/21 PASS`
- node --check runtime: PASS
- node --check test: PASS
- git diff --check: PASS

## Product result

The demo payload export turns HBCE Evidence Core v1 into a portable product-facing object.

It includes:

- compact decision snapshot
- proof hashes
- banking demo summary
- demo cards
- allowed claims
- prohibited claims
- API status
- explicit boundary summary
- export limitations

## Boundary

The demo payload remains internal, deterministic, read-only, observe-only and fail-closed.

It does not grant authorization, create authorization artifacts, grant access, execute runtime actions, create dispatch, mutate runtime state, create legal certification, create eIDAS qualification, create OPC ALLOW, prove production deployment, complete external review, claim regulatory approval, or authorize banking operations.

## Strategic state

HBCE now has:

- Evidence Core v1 baseline
- readable product surface
- compact demo payload export

The next useful step is to materialize a demo JSON artifact for banking/demo use while preserving deterministic hashes and non-authorizing boundaries.

## Next phase

Recommended next branch:

`hbce/product-evidence-core-v1-demo-json-artifact`

Purpose:

- materialize a compact demo JSON artifact
- make the payload inspectable without executing runtime code
- preserve SHA-256 verification
- keep all non-authorization and non-execution claims explicit
