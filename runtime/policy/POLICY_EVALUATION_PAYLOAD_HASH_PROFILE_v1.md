# HBCE Policy Evaluation Payload Hash Profile v1

Status: SF-072A local contract; human acceptance of this revision pending.
Scope: `runtime/policy/verify-policy-evaluation-payload.js`.

## Purpose and compatibility

This profile defines the payload commitment for a Policy Evaluation.
It is a restricted HBCE canonical JSON profile, NOT RFC 8785/JCS.
Do not substitute another JSON canonicalizer without a versioned
compatibility decision and new test vectors.

## Commitment procedure

1. Require a plain top-level JavaScript object with its own
   `payload_sha256` property.
2. Reject top-level symbol keys, non-enumerable own properties and
   accessor own properties.
3. Construct the payload from all enumerable own top-level properties,
   excluding ONLY the top-level `payload_sha256` field.
4. Canonicalize that payload using the rules below.
5. SHA-256 hash the UTF-8 bytes of the resulting canonical JSON text.
   There is no prefix, delimiter or domain-separation string.
6. Encode the digest as 64 lowercase hexadecimal characters.

All other fields remain bound, including `genealogy.hash` and any
nested field named `payload_sha256`. Excluding the top-level field
avoids a self-referential commitment; it does not remove genealogy.

## Canonical JSON rules

- `null`, booleans and strings use JSON text representation.
- Strings must be well-formed UTF-16; lone surrogates are rejected.
- Numbers must be safe integers; negative zero, fractional numbers,
  non-finite numbers and unsafe integers are rejected.
- Arrays preserve index order. Sparse arrays, symbol keys and
  additional own properties are rejected.
- Plain objects must have `Object.prototype`; their own keys must be
  enumerable string data properties. Symbol keys, non-enumerable
  properties and accessor properties are rejected.
- Object keys are sorted with JavaScript `Object.keys(...).sort()`,
  i.e. UTF-16 code-unit order. Keys and string values are encoded
  with `JSON.stringify`.
- Unsupported JavaScript values, including `undefined`, functions,
  BigInt and non-plain objects, are rejected. Cycles cannot produce
  a valid commitment.

This contract is for ordinary JSON data represented as plain objects
and arrays, not arbitrary executable JavaScript objects. It does not
claim general protection against Proxy traps or concurrent mutation.

## Verification result and boundaries

`verifyPolicyEvaluationPayload` requires a declared lowercase
64-character SHA-256 hex digest, recomputes the payload commitment
and compares the two. Its `VALID` result means ONLY that this
payload digest was verified under this profile.

This step does NOT validate the complete Policy Evaluation schema,
resolve `genealogy.hash` against a predecessor, establish a genesis
anchor, verify authority/policy/action/request referenced bytes,
evaluate policy, integrate the digest gate into OPC, or permit ALLOW.
OPC remains UNEVALUATED where its other gates are deferred.

## Independent reference vector

Canonical text: `{"a":1,"z":2}`
SHA-256 hex:
`99168216144c7fed5d4c54916cf98d9c66096280c04a499822a99b6658bd177a`

## Change control

Changes to accepted values, key ordering, field exclusion, byte
encoding or digest computation require explicit profile versioning,
new vectors, regression and human acceptance. No commit, push,
anchoring or authorization transition is implied by this document.
