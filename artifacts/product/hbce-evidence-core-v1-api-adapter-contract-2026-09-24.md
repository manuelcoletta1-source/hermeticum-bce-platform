# HBCE Evidence Core v1 — API Adapter Contract

Date: 2026-09-24

## Contract status

HBCE_API_ADAPTER_CONTRACT_STATUS=READY

This document defines the future API adapter contract for serving the HBCE Evidence Core v1 demo JSON artifact.

This is a contract only. It is not an implemented API route.

## Current repository constraint

The current repository does not provide an application route scaffold.

The current repository has no committed `package.json`, no `app` route tree, no `pages` route tree and no `src` route tree for exposing a real HTTP endpoint.

Therefore this contract must not be interpreted as proof that a live API route exists.

## Source artifacts

- Demo JSON artifact path: `artifacts/product/hbce-evidence-core-v1-demo-payload-export-2026-09-24.json`
- Demo JSON artifact file SHA-256: `fb688399b1fbabe7060a9c74f3a88aeb03c60d0069ae6c4ed40a330697ba710f`
- Demo payload export SHA-256: `a6c90405c01f96079dc3f1883b81b22340fac7df60c5bd0a6c6b897d43f27cfd`
- Demo payload core SHA-256: `a62615e28a2a0514a4c88025d6dcb8d90d45824960337e88e9aef8797b0ffee5`
- Banking demo manifest path: `artifacts/product/hbce-evidence-core-v1-banking-demo-manifest-2026-09-24.md`
- Banking demo manifest SHA-256: `d8d839c54e676f46f5e3f8b43d9a1e0b9503f9e6e1f387036962e093249c040c`

## Source checkpoint

- PR133 checkpoint main: `6945912d22fc91c2fa6c78425c3d1d8ed942497e`
- PR133 checkpoint document SHA-256: `451cf28174d7fe58ad0965d112cfad2b63a6dc116c5c0d1f80ada1a46ac4b442`
- Manifest validation test SHA-256: `1db3c724a450053adee9de011792bf4505946a35fc6d79ae2aa25704054d09da`
- Artifact validation test SHA-256: `b9dfe9c84524f78aff856f26dfcd6cf6c6276b0259d6c5df61fb9fcbfb7dd515`

## Future adapter purpose

The future adapter exists only to serve already materialized HBCE Evidence Core v1 product artifacts.

The future adapter must expose the JSON artifact and optional manifest metadata without recomputing authorization, without granting access and without executing runtime actions.

## Proposed endpoint

Future endpoint:

`GET /api/hbce/evidence-core/v1/demo-payload`

The endpoint name is reserved for future implementation in a repository that contains a real application route scaffold.

## Request contract

Method:

`GET`

Required behavior:

- accept read-only retrieval requests
- reject unsupported HTTP methods
- optionally accept a client-provided expected artifact SHA-256
- never accept a request that attempts to mutate runtime state
- never accept a request that asks for authorization execution
- never accept a request that asks for dispatch creation
- never accept a request that asks for live banking operation approval

Optional query parameter:

`expected_artifact_file_sha256=fb688399b1fbabe7060a9c74f3a88aeb03c60d0069ae6c4ed40a330697ba710f`

## Successful response contract

Expected successful response status:

`200 OK`

Expected response content type:

`application/json`

Expected response body shape:

```json
{
  "status": "EXPORTED",
  "kind": "HBCE_EVIDENCE_CORE_V1_DEMO_PAYLOAD_EXPORT",
  "artifact_file_sha256": "fb688399b1fbabe7060a9c74f3a88aeb03c60d0069ae6c4ed40a330697ba710f",
  "evidence_core_v1_demo_payload_export_sha256": "a6c90405c01f96079dc3f1883b81b22340fac7df60c5bd0a6c6b897d43f27cfd",
  "demo_payload_core_sha256": "a62615e28a2a0514a4c88025d6dcb8d90d45824960337e88e9aef8797b0ffee5",
  "payload": "<contents of the committed demo JSON artifact>",
  "boundary": {
    "read_only": true,
    "observe_only": true,
    "fail_closed": true,
    "grants_authorization": false,
    "executes_runtime_action": false,
    "creates_dispatch": false,
    "mutates_runtime_state": false,
    "authorizes_banking_operations": false
  }
}
```

## Error response contract

The future adapter must fail closed.

Expected error cases:

- `405 METHOD_NOT_ALLOWED` for unsupported methods
- `404 ARTIFACT_NOT_FOUND` when the committed artifact cannot be loaded
- `409 ARTIFACT_HASH_MISMATCH` when the file hash does not match the expected hash
- `412 EXPECTED_HASH_MISMATCH` when the client-provided expected hash does not match the artifact hash
- `412 SOURCE_VERIFICATION_FAILED` when source artifact validation fails
- `500 ADAPTER_INTERNAL_ERROR_FAIL_CLOSED` for unexpected adapter errors

All error responses must preserve `access_granted=false`.

## Adapter responsibilities

The future adapter must:

- load the committed JSON artifact
- verify the JSON artifact file SHA-256
- verify the demo payload export SHA-256
- verify the demo payload core SHA-256
- expose explicit boundary metadata
- preserve deterministic response semantics
- preserve read-only behavior
- preserve observe-only behavior
- preserve fail-closed behavior
- preserve non-authorizing behavior
- preserve non-executing behavior
- preserve non-mutating behavior

## Adapter non-responsibilities

The future adapter must not:

- grant authorization
- create authorization artifacts
- grant access
- execute runtime actions
- create dispatch
- mutate runtime state
- create legal certification
- create eIDAS qualification
- create OPC ALLOW
- prove production deployment
- complete external review
- claim regulatory approval
- authorize banking operations
- approve live financial transactions

## Verification chain

Minimum verification chain before exposing the adapter:

1. Validate the committed JSON artifact file hash.
2. Validate the demo payload export hash.
3. Validate the demo payload core hash.
4. Run the PR132 JSON artifact validation test.
5. Run the PR133 banking demo manifest validation test.
6. Run the PR131 demo payload export test.
7. Run the PR130 readable surface test.
8. Run the PR128 source review package test.

Expected verification results:

- PR134 API adapter contract validation: `15/15 PASS`
- PR133 banking demo manifest validation: `13/13 PASS`
- PR132 JSON artifact validation: `13/13 PASS`
- PR131 demo payload export: `18/18 PASS`
- PR130 readable surface: `19/19 PASS`
- PR128 source review package: `21/21 PASS`

## Security and compliance boundary

This contract is suitable for future integration planning.

This contract is not a production deployment proof.

This contract is not a live API implementation.

This contract is not a legal certificate.

This contract is not an eIDAS qualification.

This contract is not an OPC ALLOW.

This contract is not an external review completion.

This contract is not regulatory approval.

This contract does not authorize banking operations.

## Integration gate

A future implementation may only happen in a repository or application state that provides a real route scaffold.

Until then, this contract remains a specification artifact only.

## Reviewer conclusion

The API adapter contract defines how HBCE Evidence Core v1 demo artifacts should be served in the future without breaking the current evidence boundary.

It preserves the existing product chain while preventing false claims about live API availability, production deployment, authorization, regulatory approval or banking execution.
