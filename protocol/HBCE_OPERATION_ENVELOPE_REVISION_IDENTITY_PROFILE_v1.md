# HBCE OperationEnvelope Revision Identity Profile v1

Status: DOCUMENTARY REFERENCE ACCEPTED / NOT VERIFIED / NOT IMPLEMENTED

## Purpose

Define the revision identity and commitment boundary required to resolve the exact canonical OperationEnvelope predecessor referenced by StateTransition.

This profile does not modify OperationEnvelope v1, StateTransition v1, or the Platform Core payload hash profile for its ten declared object kinds.

## Revision identity

An OperationEnvelope revision has the exact uniqueness key:

- `operation_id`
- `operation_revision`

`envelope_payload_sha256` is the payload commitment bound to that key, not an additional uniqueness-key component.

`operation_id` is the stable canonical operation identity.

`operation_revision` is a positive integer. It is not the OperationEnvelope schema field `version`, whose value remains `v1`.

`envelope_payload_sha256` is the commitment stored in the durable revision record. It MUST equal the independently recomputed `OperationEnvelope.payload_sha256`; copying the declared digest into the record without recomputation does not establish verification.

## OperationEnvelope payload commitment proposal

This draft specifies a dedicated, versioned OperationEnvelope v1 commitment procedure. It reuses the restricted HBCE `canonicalJson` rules documented in `runtime/policy/POLICY_EVALUATION_PAYLOAD_HASH_PROFILE_v1.md`; it is NOT RFC 8785/JCS and does not reuse the Policy Evaluation-specific `computePayloadSha256` function.

1. Require an OperationEnvelope v1 payload conforming to its frozen schema.
2. Before constructing the commitment input, inspect the original top-level payload object and reject unsupported own properties, including symbols, non-enumerable properties and accessors; do not use an enumerable-only copy to bypass these checks. Then construct the commitment input from every enumerable own top-level payload property, excluding ONLY the top-level `payload_sha256`.
3. Preserve every other property, including the complete `genealogy` object and any nested property named `payload_sha256`.
4. Canonicalize the input using the referenced restricted HBCE `canonicalJson` rules. Unsupported values MUST fail closed.
5. Compute SHA-256 over the UTF-8 bytes of the canonical JSON text, without prefix, delimiter or domain-separation string; encode as 64 lowercase hexadecimal characters.
6. Require equality between the computed digest, the declared `OperationEnvelope.payload_sha256` and the durable record `envelope_payload_sha256`. Any mismatch MUST fail closed.

`operation_revision` remains outside the frozen OperationEnvelope v1 payload. The payload digest alone therefore does NOT commit to the revision number. The durable record MUST bind the digest to the unique `operation_id` and `operation_revision` key.

This procedure is a controlled draft, not an implemented or independently verified runtime hash gate.

## Preliminary synthetic canonicalization checks

Local STEP 55 and STEP 56 checks used the exported `canonicalJson` implementation with a deliberately incomplete synthetic object, NOT a schema-valid OperationEnvelope fixture.

- STEP 55: repeated input produced the same digest; changing `genealogy.supersedes` changed the digest.
- Synthetic digest: `bf940378a221f9d165b831406be5955a77549471ac7d07bcb5805fea4f3d42ff`.
- STEP 56: changing only the top-level `payload_sha256` did not change the computed digest; adding a nested `payload_sha256` changed it; an unsafe integer was rejected.
- `SCHEMA_VALIDATION=NOT_EXECUTED`. No schema-validated complete-Envelope vector, durable-record verification, predecessor resolution or runtime hash gate was established.

These preliminary checks MUST NOT be represented as SF-009 conformance, independent verification of the complete OperationEnvelope commitment procedure, human acceptance or production authorization.

## Original-object property guard: preliminary negative check

STEP 88 demonstrated that the existing PolicyEvaluation hash function rejects an original object containing a non-enumerable own property, while an `Object.entries()` / `Object.fromEntries()` copy silently loses that property before `canonicalJson` receives it. Earlier synthetic preimage construction using that copy is therefore not evidence that original-object property guards are enforced.

STEP 92 separately confirmed that the existing PolicyEvaluation hash function rejects an original object containing a symbol-keyed own property and an original object containing an enumerable accessor. Together, STEPs 88 and 92 exercise the three stated original-object property categories against the existing PolicyEvaluation function, not against an OperationEnvelope verifier.

A future OperationEnvelope commitment verifier MUST inspect the original object before omitting only its top-level `payload_sha256`. These negative checks do not implement that verifier or establish SF-009 schema conformance. `OPERATION_ENVELOPE_HASH_GATE=NOT_IMPLEMENTED`; `SCHEMA_VALIDATION=NOT_EXECUTED`.

## Complete genesis candidate: preliminary digest cross-check

STEP 62 constructed an in-memory candidate containing all required top-level SF-009 fields, with `state=CREATED`, identity `PENDING`, authority and authorization `UNRESOLVED`, policy `UNEVALUATED`, execution `NOT_DISPATCHED`, evidence `NONE`, null genesis genealogy and all five boundary flags set to `true`. Its top-level shape checks passed and neither conditional `allOf` branch was triggered.

- Candidate `operation_id`: `HBCE-TEST-GENESIS-001`.
- Candidate commitment: `fae4c98b58b5573a8253b221ea6e09d0cad110b0d259e3d4b7d9910910253fda`.
- STEP 63: independent Python SHA-256 calculation reproduced that digest for this specific ASCII-only candidate.
- This cross-check does NOT establish general equivalence between Python JSON serialization and restricted HBCE `canonicalJson`.
- `FORMAL_SCHEMA_VALIDATION=NOT_EXECUTED`; `RUNTIME_GATE=NOT_IMPLEMENTED`. The candidate MUST NOT be represented as SF-009-conformant or as a production fixture.

## Durable backing

A production resolver MUST obtain the exact revision from independently queryable, server-side durable backing.

The backing MUST be append-only. For the same `operation_id` and `operation_revision`, an exact duplicate MAY be treated as an idempotent replay; a different payload or commitment MUST fail closed. A successor revision MUST increment `operation_revision` by exactly one.

A fixture, identifier syntax, public REGISTRY match, or occurrence inside an Evidence Set MUST NOT independently establish production resolution.

### Minimum durable domain revision record proposal

The minimum independently queryable server-side domain record contains:

- `operation_id`: the exact canonical OperationEnvelope operation identity.
- `operation_revision`: the exact positive safe-integer revision.
- `envelope_payload_sha256`: the independently verified commitment bound to that identity and revision.
- `envelope_payload`: the complete OperationEnvelope v1 payload required for independent schema and commitment verification.

The unique persistence key MUST be the exact pair (`operation_id`, `operation_revision`). The digest MUST NOT become an additional key component. The record is domain persistence infrastructure, not a new canonical Platform Core object kind or a generic typed reference registration.

A production resolver MUST retrieve the exact durable record, verify that its key matches the requested identity and revision, validate the stored Envelope against the frozen v1 schema, independently recompute its payload commitment, and require equality with both the Envelope-declared `payload_sha256` and the record `envelope_payload_sha256`. It MUST then enforce the applicable predecessor and genealogy checks. Record existence or a copied digest alone MUST NOT establish successful resolution.

Persistence MUST be append-only. An idempotent replay MAY be accepted only when the existing record and incoming record have the same exact key, the same independently verified commitment and the same complete canonical Envelope payload. A conflicting duplicate under the same key MUST fail closed; equality of stored or declared digest strings alone MUST NOT establish an exact duplicate. Missing, unavailable, ambiguous, malformed or mismatched material MUST remain unresolved. Persistence does not by itself authorize execution, OPC ALLOW or dispatch.

The durable repository MUST enforce uniqueness of (`operation_id`, `operation_revision`) atomically at the persistence boundary. A separate application-level read followed by an insert MUST NOT be treated as sufficient concurrency protection. Concurrent attempts for the same key MUST NOT produce multiple durable revisions or silently overwrite an existing revision. Following an insertion conflict, an implementation MAY classify the incoming request as idempotent replay only after retrieving the actual durable record and independently verifying the exact key, both commitments and complete canonical Envelope payload. Otherwise it MUST fail closed. The choice of storage engine and transaction mechanism remains an implementation decision.

For a successor insertion, the durable repository MUST establish, within a concurrency-safe atomic operation, that the exact verified immediate predecessor exists and that the incoming revision is the next revision for the same `operation_id`. Predecessor verification performed only before a separate, unguarded insertion MUST NOT establish safe chain advancement. Concurrent successor attempts MUST resolve through the atomic uniqueness and conflict rules above; no competing payload may be silently accepted as an alternative successor under the same revision key. Genesis insertion MUST likewise establish atomically that revision 1 is the first revision for that `operation_id`. This requirement does not prescribe a storage engine, transaction API or implementation strategy.

This is a proposed record contract only. No storage schema, repository, resolver or runtime verification is implemented by this document.

## Preliminary replay and conflict checks

STEP 74 used incomplete synthetic payloads and in-memory records to exercise the proposed replay comparison. An exact duplicate was accepted as idempotent replay; a modified payload carrying a copied digest was rejected; a different revision key was not treated as replay.

STEP 75 used the same key with two different synthetic payloads whose commitments were independently recomputed and internally consistent. The comparison returned `CONFLICT`, not idempotent replay.

These checks establish neither SF-009 payload conformance nor durable persistence, concurrency safety, atomic uniqueness enforcement or production resolver behavior. `SCHEMA_VALIDATION=NOT_EXECUTED`; `DURABLE_PERSISTENCE=NOT_EXECUTED`.

## Predecessor binding

`StateTransition.predecessor_operation_version` identifies the exact numeric predecessor revision.

`StateTransition.predecessor_payload_sha256` identifies the exact predecessor payload commitment.

`StateTransition.genealogy.hash` MUST equal `StateTransition.predecessor_payload_sha256` when runtime cross-field validation is implemented.

## Canonical predecessor locator proposal

The canonical representation of a non-null `OperationEnvelope.genealogy.previous_operation_version_ref` is:

`HBCE-OER-v1:<operation_id>:<operation_revision>`

The prefix is literal. The parser MUST split at the final `:` because `operation_id` itself may contain `:`. The extracted `operation_id` MUST satisfy the frozen OperationEnvelope v1 identifier constraints and MUST equal the current Envelope `operation_id`.

The revision component MUST be canonical decimal notation without leading zeros and MUST represent an exact positive JavaScript safe integer, from 1 through `Number.MAX_SAFE_INTEGER`. Negative, zero, fractional, non-decimal, unsafe or ambiguously encoded revisions MUST fail closed. An increment that exceeds the safe-integer range MUST fail closed.

For genesis, `operation_revision` MUST equal 1 and `previous_operation_version_ref` MUST be null. For every successor revision `n > 1`, `previous_operation_version_ref` MUST identify exactly the same `operation_id` at revision `n - 1`. The durable resolver MUST independently obtain that predecessor and verify its payload commitment; a syntactically valid locator alone is not evidence of predecessor existence.

`genealogy.supersedes` is a distinct historical reference. It MUST NOT replace the canonical immediate-predecessor locator, revision check or payload commitment verification. This draft does not prescribe an additional operational meaning or canonical encoding for `supersedes`.

`StateTransition.predecessor_operation_version` identifies the Envelope revision from which that transition proceeds. It MUST NOT be confused with the predecessor locator contained inside that Envelope, which may identify an earlier revision.

These rules are proposed contract requirements only. No parser, durable resolver, genesis verifier or cross-revision runtime enforcement is implemented by this document.

## Preliminary revision and locator checks

STEP 68 exercised an in-memory synthetic locator parser against the proposed `HBCE-OER-v1:<operation_id>:<operation_revision>` representation. It preserved colons within `operation_id` by splitting at the final colon, accepted the immediate predecessor for a revision-2 example, and rejected 8/8 negative locator cases covering non-canonical revision notation, zero, invalid or unsafe numbers, identity mismatch, wrong predecessor revision and wrong prefix version.

STEP 69 exercised separate in-memory synthetic revision invariants. Genesis revision 1 with a null predecessor, revision 2 with its immediate predecessor, and the maximum safe revision reached from `Number.MAX_SAFE_INTEGER - 1` passed. Five invalid revision/predecessor cases were rejected, and increment beyond `Number.MAX_SAFE_INTEGER` was rejected.

These checks do NOT establish durable predecessor existence, predecessor commitment verification, SF-009/SF-028 compatibility, a production locator parser or runtime enforcement. `DURABLE_PREDECESSOR_RESOLUTION=NOT_EXECUTED`; `RUNTIME_ENFORCEMENT=NOT_IMPLEMENTED`.

## Fail-closed boundary

Missing, unavailable, ambiguous, malformed or mismatched predecessor material MUST remain unresolved.

This draft does not implement reference resolution, genealogy verification, authorization, dispatch, execution, EVT/OPC issuance, lock or anchor.

## Preliminary Envelope-to-transition binding check

STEP 80 exercised a synthetic two-revision chain using in-memory records. The revision-2 Envelope identified revision 1 through its immediate-predecessor locator. A synthetic StateTransition proceeding from revision 2 bound `predecessor_operation_version=2`, `predecessor_payload_sha256` to the verified revision-2 payload commitment, and `genealogy.hash` to that same commitment. Substituting the revision-1 digest for the revision-2 digest was rejected.

This check distinguishes the predecessor of the current Envelope from the Envelope from which a StateTransition proceeds. It does NOT establish SF-009 or SF-028 schema conformance, durable predecessor resolution, production runtime enforcement or human acceptance. `SCHEMA_VALIDATION=NOT_EXECUTED`; `DURABLE_PREDECESSOR_RESOLUTION=NOT_EXECUTED`; `RUNTIME_ENFORCEMENT=NOT_IMPLEMENTED`.

## Open contract decisions

1. Independently verify the proposed OperationEnvelope payload commitment algorithm with reference vectors, negative cases and compatibility checks before runtime use.
2. Implement and independently verify the proposed locator parser, genesis rules and immediate-predecessor resolution.
3. Implement and independently verify the proposed durable domain revision record, uniqueness, replay and conflict rules.
4. Independently verify the proposed genesis and successor revision invariants, including safe-integer overflow and exact predecessor binding.
5. Establish compatibility with the frozen SF-009 and SF-028 contracts before runtime enforcement.

Human acceptance: ACCEPTED FOR DOCUMENTARY REFERENCE ONLY. No commit, push, runtime implementation, OPC ALLOW, dispatch or L3 promotion authorized.

## Subsequent temporary SF-009 validation and experimental genesis checks

The following results were obtained after the preliminary checks recorded above. Historical `NOT_EXECUTED` statements describe the state of those earlier checks and are not retroactively rewritten. These subsequent results do not modify frozen SF-009/SF-028 evidence, implement runtime behavior or expand human acceptance beyond documentary reference.

- STEP 132: the frozen `schemas/hbce-operation-envelope.schema.json` was uniquely selected, successfully meta-validated and compiled using temporary AJV 8.20.0 in Draft 2020-12 mode, initially without format assertions.
- STEPs 133–134: offline `ajv-formats` 3.0.1 was added to the temporary validator. SF-009 meta-validation and compilation passed with formats enabled; a valid `date-time` was accepted and an invalid `date-time` was rejected.
- STEPs 135–136: the historical `HBCE-TEST-GENESIS-001` complete payload was not recovered from the accepted profile, tracked repository references or local Git history. Its historical commitment `fae4c98b58b5573a8253b221ea6e09d0cad110b0d259e3d4b7d9910910253fda` remains a preliminary digest cross-check, NOT a retrospectively schema-validated fixture.
- STEP 137: a distinct, complete, in-memory experimental genesis `HBCE-TEST-GENESIS-SCHEMA-001` passed SF-009 schema validation with formats enabled, both before and after commitment assignment. Its experimental commitment is `7943b37932982762e7f36d3a320bb421f90b95401fb59b8a973ac177412c3fa3`.
- STEP 138: the experimental genesis baseline passed schema validation and 5/5 negative schema cases were rejected: malformed digest, additional top-level property, invalid `date-time`, `DENY` with incompatible `CREATED` state, and `REVOKED` authority with incompatible `DISPATCHED` execution.
- STEP 139: 3/3 experimental commitment checks passed: matching baseline, modified payload with copied digest rejected, and modified declared digest rejected. The digest helper used in that step did NOT establish original-object property guarding.
- STEP 140: 6/6 experimental guard checks passed: matching baseline; top-level symbol, non-enumerable property and accessor rejected; nested accessor rejected; changed payload with copied digest rejected. Accessor getters were not executed.
- STEP 141: 3/3 isolated experimental checks passed for the excluded top-level `payload_sha256` field: baseline exclusion, accessor rejected without getter execution, and non-enumerable property rejected. The minimal object used for this isolated check was NOT claimed to conform to SF-009.
- STEP 142: the accepted profile and frozen SF-009/SF-028 schema digests remained unchanged before this documentary update; the profile was the only untracked worktree file, `git diff --check` reported no issues, and the temporary validator remained AJV 8.20.0 with `ajv-formats` 3.0.1.

These are local, temporary, in-memory validation and experimental checks. No complete historical-genesis schema validation, persistent production fixture, independently verified durable record, atomic revision uniqueness, predecessor resolution, production OperationEnvelope verifier, runtime hash gate, OPC ALLOW, dispatch or L3 promotion is established.

`HISTORICAL_GENESIS_SCHEMA_VALIDATION=NOT_EXECUTED`; `EXPERIMENTAL_NEW_GENESIS_SCHEMA_VALIDATION=PASS`; `EXPERIMENTAL_COMMITMENT_AND_GUARD_CHECKS=PASS`; `RUNTIME_ENVELOPE_VERIFIER=NOT_IMPLEMENTED`; `DURABLE_PERSISTENCE=NOT_EXECUTED`; `HUMAN_ACCEPTANCE=DOCUMENTARY_REFERENCE_ONLY`.

No commit, push, runtime implementation, OPC ALLOW, dispatch or L3 promotion is authorized by this update.

## Experimental Envelope verification and JavaScript input boundary

**Status:** DOCUMENTARY REFERENCE ONLY / NOT IMPLEMENTED / NOT VERIFIED AS PRODUCTION RUNTIME.

The temporary offline AJV Draft 2020-12 validator, with `ajv-formats` and `strict: false`, successfully compiled the frozen SF-009 OperationEnvelope schema. The `strict: false` setting addresses an AJV strict-types compilation objection in a conditional schema branch; it does not amend the frozen schema or waive its validation rules.

An in-memory, complete experimental genesis vector, `HBCE-TEST-GENESIS-SCHEMA-001`, passed SF-009 validation and reproduced its declared `payload_sha256` using the restricted HBCE `canonicalJson` function and SHA-256 over the UTF-8 canonical preimage with only the top-level `payload_sha256` omitted. The integrated experiment passed 11/11 checks, including rejection of modified payloads with copied digests, modified declared digests, schema-invalid values, non-enumerable properties, symbols, and top-level or nested accessors without executing their getters.

The experiment does **not** retroactively establish SF-009 conformance for the historical `HBCE-TEST-GENESIS-001` candidate, whose complete original JSON was not recovered.

### Required verification order

For a supported, ordinary JavaScript object at the verification boundary, the proposed order is:

1. Inspect the **original** top-level object for unsupported own-property descriptors before copying it, reading its values, or invoking AJV.
2. Reject symbols, non-enumerable own properties and accessors. Reject unsupported nested values and descriptors during restricted HBCE canonicalization.
3. Validate the complete Envelope against the frozen SF-009 schema, including formats.
4. Construct the canonical hash preimage by omitting **only** the top-level `payload_sha256`; retain all other Envelope fields, including genealogy and nested hashes.
5. Recompute SHA-256 over the UTF-8 HBCE canonical representation and compare it with the declared Envelope digest. A future durable record must independently bind and verify the same digest.

The original-object inspection must precede AJV. A separate in-memory experiment demonstrated that invoking AJV first can execute a hostile accessor: the getter was called once. An isolated guard-first experiment rejected an accessor with zero getter executions. These experiments establish the need for the specified order; they do not establish a production implementation.

### Proxy and deserialization boundary

A JavaScript `Proxy` can execute user-defined traps during `Object.getPrototypeOf`, `Reflect.ownKeys`, or `Object.getOwnPropertyDescriptor`. An isolated experiment reproduced execution of a `getPrototypeOf` trap. Consequently, the proposed synchronous object guard **must not claim zero execution of hostile code for arbitrary JavaScript objects**.

The preferred future ingress contract is an explicitly defined JSON-data boundary, with parsing and admissible input types specified before Envelope verification. This is a **design requirement**, not evidence that a trusted deserialization boundary already exists. If an API accepts arbitrary JavaScript objects, its contract must disclose the Proxy limitation rather than describing the guard as universally side-effect-free.

### Evidence and authorization boundary

The temporary validator and experimental vectors are not a deployable dependency, runtime verifier, durable repository, atomic revision-uniqueness mechanism, predecessor resolver, StateTransition verification, or complete L3 proof. They do not authorize `OPC ALLOW`, dispatch, commit, push, deployment, or L3 promotion.

**Human acceptance:** ACCEPTED FOR DOCUMENTARY UPDATE ONLY (STEP 155). No commit, push, runtime implementation, OPC ALLOW, dispatch or L3 promotion authorized.

## Proposed OperationEnvelope JSON ingress contract

**Status:** ACCEPTED FOR DOCUMENTARY REFERENCE ONLY / NOT IMPLEMENTED / NOT VERIFIED AS PRODUCTION RUNTIME.

### Accepted input and trust boundary

The preferred future OperationEnvelope ingress MUST accept bounded raw JSON text rather than arbitrary caller-supplied JavaScript objects. The transport, trust boundary, accepted encoding, maximum input size, nesting-depth limit and applicable resource limits MUST be explicitly defined before production implementation.

Receiving a string does not establish that its contents are valid or unambiguous JSON. Malformed or ambiguous input MUST be rejected before an OperationEnvelope is admitted.

The existing in-memory object-verification experiments do not establish a production JSON ingress or a universally side-effect-free guard for arbitrary JavaScript objects.

### Duplicate member names

The ingress MUST reject duplicate JSON object member names at every nesting level, including names that become identical after JSON escape decoding.

For example, `"operation_id"` and `"operation\u005fid"` represent the same decoded member name. If both occur in one JSON object, the input MUST be rejected.

The duplicate check MUST operate on the original JSON representation using a structurally correct parser or an equivalently verified mechanism. It MUST distinguish member names from string values and correctly handle nesting and escapes.

Ordinary `JSON.parse` alone is insufficient: duplicate member names can be overwritten before the resulting object becomes available for validation. Regular-expression searches and comparisons between raw JSON and reserialized JSON MUST NOT be treated as equivalent duplicate-detection mechanisms.

### Required admission sequence

1. Enforce the defined transport, encoding, input-size, nesting-depth and resource limits.
2. Check the original JSON structure and syntax, rejecting duplicate decoded member names at every object level.
3. Produce admissible JSON data without invoking caller-supplied JavaScript accessors or Proxy traps.
4. Apply the object and nested-value checks appropriate to the established data boundary.
5. Validate the complete OperationEnvelope against the frozen SF-009 schema, including formats.
6. Recompute its commitment using restricted HBCE canonicalization, omitting only the top-level `payload_sha256`.
7. Require equality between the recomputed SHA-256 digest and the Envelope-declared `payload_sha256`.

Successful admission of a single Envelope MUST NOT establish durable revision identity, atomic uniqueness, predecessor existence, genealogy or StateTransition validity, positive authorization, dispatch eligibility or L3 readiness. These remain separate gates.

### Parser selection and verification criteria

No duplicate-aware parser has been selected or approved. Before adoption, a candidate MUST be independently tested for:

- Duplicate member names at the top level and in nested objects, including objects inside arrays.
- Equivalent decoded member names expressed through JSON escapes.
- Correct distinction between member names and string values.
- Rejection of malformed JSON and input outside the defined encoding and resource limits.
- Defined maximum input size, nesting depth and applicable resource consumption.
- Compatibility with the frozen SF-009 schema and restricted HBCE canonicalization.

Returning a JavaScript object is not sufficient evidence of duplicate-aware parsing. Negative tests and failure handling MUST be independently verified.

### Experimental evidence and open decisions

STEP 156C reproduced overwriting of identically written duplicate `operation_id` members by `JSON.parse`.

STEP 157A reproduced overwriting when `operation_id` and `operation\u005fid` were distinct raw spellings of the same decoded member name.

STEP 157B did not identify an available duplicate-aware parser among seven packages checked in the repository's Node resolution environment. This limited search does not establish that no suitable parser exists elsewhere.

The parser implementation, transport, encoding policy, numeric limits, dependency strategy and production integration remain OPEN.

**Human acceptance:** ACCEPTED FOR STEP 158 DOCUMENTARY UPDATE ONLY. No dependency installation, runtime implementation, commit, push, OPC ALLOW, dispatch or L3 promotion authorized.
