# HBCE Platform Core Data Model v1

Status: SPECIFICATION
Program: HBCE PLATFORM
Layer: PLATFORM CORE SEMANTIC MODEL
Version: 1.0-draft
Implementation state: NOT IMPLEMENTED
Validation state: NOT YET TESTED

## 1. Purpose

This specification defines the minimum canonical semantic model required by HBCE Platform to reconstruct why an operational action could occur, who or what acted, on whose behalf, under which mandate, with which capability, authority and authorization, inside which operational space, with which execution evidence, and with which resulting consequence and state transition.

This specification does not replace the existing IPR, EVT, OPC or public registry schemas.

It defines the semantic layer that connects identity and operational authority to execution, evidence and subsequent state.

The core sequence is:

SUBJECT
→ IDENTITY
→ PRINCIPAL
→ MANDATE
→ CAPABILITY
→ AUTHORITY
→ AUTHORIZATION
→ IOSPACE
→ EXCHANGE
→ EXECUTION
→ EVT
→ OPC
→ OUTCOME
→ CONSEQUENCE
→ MATRIX STATE UPDATE
→ FEEDBACK

The corresponding HBCE operational grammar is:

IPR
→ MANDATE
→ CAPABILITY
→ AUTHORITY
→ AUTHORIZATION
→ IOSPACE
→ METAEXCHANGE
→ EXECUTION
→ EVT
→ OPC
→ MATRIX(t1)
→ NEUROLOOP

The operational grammar names HBCE framework components and is not a one-to-one list of canonical Core objects. OUTCOME and CONSEQUENCE remain explicit Core semantic objects even where they do not correspond to separately named framework modules in this grammar.

## 2. Architectural boundary

HBCE Platform uses one semantic core with domain adapters.

The core must not encode banking, enterprise, robotics, space, energy or public-sector assumptions directly.

Domain-specific semantics belong in adapters that map domain concepts onto the canonical core.

Examples:

Banking:

CUSTOMER
→ MANDATE
→ AGENT
→ PAYMENT CAPABILITY
→ AUTHORITY LIMIT
→ AUTHORIZATION
→ EXECUTION
→ EVT
→ OPC
→ OUTCOME

Enterprise:

EMPLOYEE / ORGANIZATION
→ DELEGATION
→ AGENT
→ WORKFLOW CAPABILITY
→ AUTHORITY
→ APPROVAL / AUTHORIZATION
→ EXECUTION
→ AUDITABLE CONSEQUENCE

Physical systems:

ORGANIZATION
→ SITE
→ FLEET
→ UNIT
→ MODEL / POLICY VERSION
→ TASK CAPABILITY
→ AUTHORITY
→ AUTHORIZATION
→ PHYSICAL EXECUTION
→ CONSEQUENCE

## 3. Mandatory semantic separations

The following distinctions are invariants of the Platform Core Data Model:

IDENTITY != PRINCIPAL

PRINCIPAL != ACTOR

MANDATE != CAPABILITY

CAPABILITY != AUTHORITY

AUTHORITY != AUTHORIZATION

MANDATE != AUTHORIZATION

DECISION != AUTHORIZATION

AUTHORIZATION != EXECUTION

EXECUTION != SUCCESS

EXECUTION != OUTCOME

OUTCOME != CONSEQUENCE

TRACE != TRUTH

OBSERVATION != INFERENCE

TECHNICAL VALIDATION != CERTIFICATION

CONTACT != BUYER INTENT

COMMERCIAL ACCEPTANCE != PAYMENT

Existing EVT `decision`, `human_review` and `policy_state` fields must not be reinterpreted as canonical AUTHORIZATION or AUTHORITY objects.

Existing OPC `decision_state`, `human_review`, `policy_state` and `verification_state` fields must not be reinterpreted as canonical AUTHORIZATION or AUTHORITY objects.

## 4. Fail-closed semantic rule

UNKNOWN must never be silently converted into TRUE, FALSE, ALLOW, DENY, AUTHORIZED or UNAUTHORIZED.

When an operation requires a semantic prerequisite and that prerequisite cannot be proven, the system must return one of the following classes of result:

STOP

DENY

REQUIRE_AUTHORIZATION

REVIEW_REQUIRED

ESCALATE

UNKNOWN

The exact runtime representation is implementation-specific and is not defined by this specification.

## 5. Canonical entities

### 5.1 SUBJECT

SUBJECT represents the entity associated with an identity or operational record.

A SUBJECT may represent, depending on the applicable profile:

- a human;
- an organization;
- an AI system;
- an operational agent;
- a device;
- a vehicle;
- a robot;
- a node;
- a workflow;
- another explicitly modelled entity.

SUBJECT does not by itself establish operational authority.

### 5.2 IDENTITY

IDENTITY establishes an operational identity reference for a SUBJECT.

Within the existing HBCE architecture, IPR is the primary identity mechanism.

IDENTITY answers:

WHO OR WHAT IS THIS?

IDENTITY does not answer:

WHAT MAY IT DO?

FOR WHOM MAY IT ACT?

WHO AUTHORIZED THE ACTION?

### 5.3 PRINCIPAL

PRINCIPAL is the entity on whose behalf an ACTOR performs an operation.

A PRINCIPAL may be identical to the ACTOR, but the model must never assume this implicitly.

Examples include:

- a person acting for themselves;
- an AI agent acting for a customer;
- an employee acting for an organization;
- a robot acting for an operator;
- a service acting for another system.

PRINCIPAL must be explicitly reconstructible when delegation exists.

### 5.4 MANDATE

MANDATE represents the relationship that permits an ACTOR to act for a PRINCIPAL within declared boundaries.

MANDATE must support at least:

- mandate reference;
- principal reference;
- actor reference;
- scope;
- constraints;
- validity interval;
- issuing source;
- current state;
- version;
- revocation reference where applicable.

MANDATE establishes delegated relationship.

MANDATE does not itself authorize every individual action.

### 5.5 CAPABILITY

CAPABILITY represents an operation class that an ACTOR or component is technically or logically able to perform.

Examples:

- submit a payment request;
- analyze a document;
- generate a draft;
- approve a workflow;
- operate a robotic unit;
- update a registry;
- invoke an external service.

CAPABILITY answers:

WHAT OPERATION CLASS CAN THIS ENTITY PERFORM?

CAPABILITY does not establish that the entity is currently authorized to perform it.

### 5.6 AUTHORITY

AUTHORITY represents the bounded power under which an action may be authorized.

AUTHORITY must be derived from an identifiable source.

AUTHORITY must support at least:

- authority reference;
- authority source;
- principal reference;
- mandate reference where applicable;
- capability reference;
- scope;
- target constraints;
- temporal constraints;
- quantitative or policy limits where applicable;
- version;
- state;
- revocation reference.

AUTHORITY must be versioned.

A stale or revoked authority must not support a new AUTHORIZATION.

#### Authority revision and genealogy runtime semantics

Canonical AUTHORITY revision semantics are relational runtime invariants
in addition to JSON Schema validity.

For every canonical AUTHORITY revision:

`state = genealogy.new_state`

must hold exactly.

For `authority_version = 1`, the revision is the genesis revision of that
`authority_id` and:

`genealogy.derived_from = null`

`genealogy.previous_state = null`

must hold.

A production genesis AUTHORITY intended to provide durable operational
authority MUST bind its identifiable controlled authority source through
a non-null `authority_source.source_sha256`.

For that production genesis revision:

`genealogy.hash = authority_source.source_sha256`

must hold exactly.

The source commitment remains a commitment to the controlled authority
source artifact. It is not a public-authority claim and MUST NOT be
substituted by an unrelated IPR, EVT, OPC, registry or domain hash.

For every `authority_version > 1`, the exact immediately preceding
canonical AUTHORITY revision is required and:

`authority_id = predecessor.authority_id`

`authority_version = predecessor.authority_version + 1`

`genealogy.derived_from = predecessor.authority_id`

`genealogy.previous_state = predecessor.state`

`genealogy.new_state = state`

`genealogy.hash = predecessor.payload_sha256`

must hold exactly.

The exact predecessor of a non-genesis AUTHORITY revision is identified
by the conjunction of:

`authority_id`

`authority_version - 1`

and:

`genealogy.hash`

`genealogy.derived_from` by itself MUST NOT be interpreted as a complete
version locator.

The optional `supersedes` member is not the version-genealogy predecessor
locator and MUST NOT replace the predecessor identity, version or payload
commitment rules above.

Authority construction and production backing resolution remain separate
concerns.

A canonical AUTHORITY builder MAY remain a pure deterministic constructor
that enforces canonical Authority object, revision, genealogy and payload
hash invariants without database access.

Before an AUTHORITY revision is treated by a production runtime as valid
operational authority for new AUTHORIZATION, its required outbound
dependencies MUST resolve through appropriate server-side durable backing.

At minimum, the runtime MUST establish exact Mandate identity and version
for:

`mandate_ref`

`mandate_version`

and exact Capability identity and version for:

`capability_ref`

`capability_version`.

Cross-object bundle equality or identifier syntax alone is not sufficient
production durable resolution.

The controlled `authority_source.source_ref` MUST refer to an identifiable
source appropriate to its declared `source_type`.

Where `authority_source.source_sha256` is present, the production source
resolver MUST verify exact commitment correspondence with the controlled
source material.

For a production genesis AUTHORITY, `authority_source.source_sha256` is
required by the runtime rule above.

An unavailable, malformed, ambiguous or mismatched Authority source,
Mandate or Capability dependency MUST fail closed for production use.

The existing revocation-propagation rule remains authoritative: a Mandate
that is revoked, expired or superseded MUST NOT allow dependent AUTHORITY
to be silently treated as valid for new authorization.

This amendment does not define additional Capability lifecycle propagation.
No Capability lifecycle rule may be inferred merely from the existence of
`capability_ref` or `capability_version`.

Historical canonical Authority revisions remain historical records and
MUST NOT be deleted merely because a prerequisite or later Authority state
changes.

### 5.7 AUTHORIZATION

AUTHORIZATION represents the specific approval permitting a defined action under a valid AUTHORITY.

AUTHORIZATION must bind at least:

- authorization reference;
- authority reference;
- authority version;
- mandate reference where applicable;
- actor reference;
- principal reference;
- IOSPACE reference;
- action;
- target;
- constraints;
- validity;
- decision time;
- authorizer reference or policy reference;
- authorization digest;
- state.

AUTHORIZATION is action-specific or explicitly scope-specific.

An AUTHORIZATION must not remain valid when a prerequisite authority or mandate has been revoked, superseded, expired or otherwise rendered invalid.

### 5.8 IOSPACE

IOSPACE represents the bounded operational environment in which an authorized action may occur.

IOSPACE may describe:

- logical environment;
- organizational environment;
- territorial environment;
- infrastructure boundary;
- device or fleet boundary;
- application boundary;
- transaction environment;
- physical operational space.

IOSPACE must not be interpreted merely as a UI route or product module.

The canonical IOSPACE object defines an operational boundary.

### 5.9 EXCHANGE

EXCHANGE represents a controlled interaction between operational entities, systems or domains.

MetaExchange may implement or support EXCHANGE semantics, but the canonical semantic object is EXCHANGE.

EXCHANGE may bind:

- sender;
- receiver;
- exchanged capability;
- action reference;
- data or proof reference;
- protocol;
- authorization reference;
- IOSPACE reference;
- timestamp;
- execution reference.

### 5.10 EXECUTION

EXECUTION represents the attempted or completed performance of an authorized action.

EXECUTION must be distinguishable from AUTHORIZATION.

An authorization may exist without execution.

An execution may fail.

An execution may complete technically without achieving the intended outcome.

EXECUTION must support at least:

- execution reference;
- authorization reference;
- actor reference;
- action;
- target;
- start time;
- completion time where applicable;
- execution state;
- output reference where applicable;
- evidence reference;
- error reference where applicable.

Execution without a valid required AUTHORIZATION must fail closed.

### 5.11 EVT

EVT remains the HBCE operational event representation.

The existing EVT schema is not replaced by this specification.

EVT records what happened or what operational state was observed.

Future integration may add references from EVT to Platform Core objects, but existing historical EVT records must remain valid under their original schema and interpretation.

### 5.12 OPC

OPC remains the HBCE operational proof layer.

The existing OPC receipt schema is not replaced by this specification.

OPC provides evidence-oriented operational proof references linked to events and workflows.

OPC does not create authority or authorization.

### 5.13 OUTCOME

OUTCOME represents the direct result of an EXECUTION.

Examples:

- request accepted;
- request rejected;
- document generated;
- transaction submitted;
- transaction failed;
- robotic task completed;
- robotic task interrupted.

OUTCOME does not necessarily represent the wider consequence of the action.

### 5.14 CONSEQUENCE

CONSEQUENCE represents the observed or attributable effect following an execution or outcome.

CONSEQUENCE must remain distinguishable from prediction and intention.

A consequence may be:

- immediate;
- delayed;
- technical;
- operational;
- financial;
- organizational;
- physical;
- regulatory;
- human-observed;
- machine-observed.

Where consequence cannot yet be established, its state must remain UNKNOWN rather than inferred as true.

### 5.15 MATRIX STATE

MATRIX represents a declared operational state model.

MATRIX(t0) is the relevant state before the governed action.

MATRIX(t1) is the relevant state after the governed action and consequence processing.

MATRIX is not identical to reality.

MATRIX(t0) != MATRIX(t1)

A state update must preserve the relationship between prior state, action, evidence, consequence and new state.

### 5.16 FEEDBACK

FEEDBACK represents information derived from observed outcome, consequence or state transition that may influence subsequent policy, capability, authority, authorization, prediction or execution.

NeuroLoop may implement or support feedback processing.

FEEDBACK must never retroactively alter historical events or evidence.

### 5.17 EVIDENCE SET

EVIDENCE SET represents a bounded canonical aggregation of references and control-verification state required to reconstruct an evidence case without collapsing evidence, authority, result, external confirmation and interpretation into one semantic field.

EVIDENCE SET must support at least:

- evidence set reference;
- evidence set version;
- case reference;
- domain classification;
- target representation;
- owner subject reference;
- exact authority reference;
- exact authority version;
- authority payload digest;
- lifecycle state;
- evidence state and evidence reference;
- control references;
- observation references;
- result reference;
- artifact references;
- external confirmation references;
- event references;
- EVT and OPC references where applicable;
- creation and finalization timestamps;
- append-only genealogy;
- canonical payload digest.

The canonical lifecycle vocabulary for EVIDENCE SET is:

`OPEN`

`CLOSED`

EVIDENCE SET lifecycle state is distinct from the assessment result referenced by the Evidence Set. A `CLOSED` Evidence Set does not itself mean `PASS`, and an assessment result must not be reinterpreted as the Evidence Set lifecycle state.

External confirmation must remain distinguishable from the canonical HBCE assessment result. An external confirmation does not silently replace, create or modify that result.

EVIDENCE SET does not itself create AUTHORITY, AUTHORIZATION, EXECUTION, OUTCOME, legal truth, regulated certification or public authority approval.

Domain-specific semantics belong in adapters or referenced domain records. A canonical EVIDENCE SET must not acquire domain-specific Core fields merely because a particular case uses them.

## 6. Universal Act Model

A governed HBCE act must be reconstructible through the following minimum semantic dimensions:

ACTOR

PRINCIPAL

MANDATE

CAPABILITY

AUTHORITY

AUTHORIZATION

IOSPACE

ACTION

TARGET

TIME

EXECUTION

EVIDENCE

OUTCOME

CONSEQUENCE

STATE_BEFORE

STATE_AFTER

Not every field must contain a positive value.

When a field is not applicable, the implementation must represent that explicitly.

When a required field cannot be established, the result must remain UNKNOWN or fail closed according to policy.

## 7. Minimum lifecycle state vocabulary

The Platform Core Data Model defines the following generic state vocabulary:

DRAFT

PENDING

ACTIVE

LIMITED

AUTHORIZED

DENIED

EXECUTING

EXECUTED

FAILED

SUSPENDED

CONTESTED

COMPROMISED

EXPIRED

REVOKED

SUPERSEDED

UNKNOWN

Domain objects may use constrained subsets.

Existing IPR, EVT, OPC and registry status vocabularies remain valid and must not be rewritten retroactively merely to match this generic vocabulary.

## 8. Genealogy

Core objects must support append-only genealogy where applicable.

The minimum genealogy model is:

DERIVED_FROM

PREVIOUS_STATE

NEW_STATE

CAUSE

EVIDENCE

TIMESTAMP

HASH

Permitted evolution operations are:

APPEND

DERIVE

SUPERSEDE

REVOKE

Historical records must not be overwritten or retrodated.


### 8.1 EXECUTION identity, version and genealogy

For `HBCE_CORE_EXECUTION`, `execution_id` identifies one logical
execution attempt across its append-only lifecycle.

A lifecycle revision MUST NOT receive a new `execution_id` merely
because the execution state, evidence or downstream references changed.

`execution_version` identifies the canonical revision of that execution
attempt.

The first canonical revision MUST use:

`execution_version = 1`

Every subsequent canonical revision of the same execution attempt MUST
preserve the same `execution_id` and increment `execution_version`
by exactly one.

Therefore, for a successor revision:

`successor.execution_id = predecessor.execution_id`

and:

`successor.execution_version = predecessor.execution_version + 1`

A previously emitted canonical execution revision MUST NOT be mutated,
replaced in place, retrodated or silently re-hashed.

A new version is required whenever canonical execution content changes,
including lifecycle state, execution evidence or later references such
as EVT, OPC, OUTCOME or CONSEQUENCE.

A later revision MAY preserve the same lifecycle state as its immediate
predecessor when the revision only appends evidence or references.
Accordingly, `genealogy.previous_state` and `genealogy.new_state` MAY be
equal when no lifecycle state transition occurred.

For `execution_version = 1`:

`genealogy.derived_from = null`

`genealogy.previous_state = null`

`genealogy.new_state = state`

and:

`genealogy.hash = authorization_sha256`

For every `execution_version > 1`:

`genealogy.derived_from = execution_id`

`genealogy.previous_state = predecessor.state`

`genealogy.new_state = state`

and:

`genealogy.hash = predecessor.payload_sha256`

The exact predecessor of a non-genesis execution revision is therefore
identified by the conjunction of:

`execution_id`

`execution_version - 1`

and:

`genealogy.hash`

`genealogy.derived_from` by itself MUST NOT be interpreted as a complete
version locator.

For an execution genesis revision, `genealogy.hash` anchors the execution
lineage to the exact canonical authorization payload through
`authorization_sha256`.

For a non-genesis revision, `genealogy.hash` anchors the revision to the
exact immediately preceding canonical execution payload.

This execution-specific genealogy hash scope MUST NOT be silently
replaced by EVT, OPC, registry, legacy or domain-specific hashing
semantics.

`execution_id` MUST NOT be synthesized by renaming or reusing
`operation_id`, `mission_id`, ledger sequence identifiers or unrelated
runtime identifiers.

The permitted lifecycle transition graph is defined separately from
identity and version continuity. Identity/version rules in this section
therefore do not, by themselves, authorize a particular state transition.

### 8.2 EXECUTION lifecycle transition graph

The canonical `HBCE_CORE_EXECUTION` lifecycle uses a fail-closed
transition graph.

The permitted cross-state transitions are exactly:

`PENDING -> BLOCKED`

`PENDING -> EXECUTING`

`EXECUTING -> EXECUTED`

`EXECUTING -> FAILED`

`EXECUTING -> ABORTED`

No other cross-state transition is authorized by this version of the
Platform Core Data Model.

A revision MAY preserve the same lifecycle state as its predecessor only
when the revision appends evidence, references or other canonical content
without changing the lifecycle state. Such a same-state revision is a
version update and MUST NOT be interpreted as an additional lifecycle
transition.

`PENDING -> BLOCKED` represents an execution attempt that is prevented
from starting. A `BLOCKED` revision MUST preserve
`authorization_consumption.state = NOT_CONSUMED`, MUST preserve
`started_at = null`, and MUST contain a precheck decision that blocks
execution. Once an execution attempt is `BLOCKED`, this version of the
canonical lifecycle does not permit that same execution attempt to later
enter `EXECUTING`. A later attempt requires a distinct `execution_id`.

`PENDING -> EXECUTING` is the only permitted transition that starts an
execution attempt. It is permitted only when all required prechecks and
bindings pass and the exact authorization has been atomically consumed.

The first canonical successor that represents successful authorization
consumption and execution start MUST therefore use:

`state = EXECUTING`

`authorization_consumption.state = CONSUMED`

`authorization_consumption.atomic = true`

a non-null `authorization_consumption.consumption_event_ref`

a positive `authorization_consumption.consumption_index`

a non-null `authorization_consumption.consumed_at`

and a non-null `started_at`.

Authorization consumption MUST occur before execution start. Therefore:

`authorization_consumption.consumed_at <= started_at`

The predecessor `PENDING` revision MUST remain immutable and MUST continue
to represent the historical pre-consumption state.

For the canonical successor created by `PENDING -> EXECUTING`,
genealogy MUST satisfy the rules in section 8.1, including:

`successor.execution_id = predecessor.execution_id`

`successor.execution_version = predecessor.execution_version + 1`

`successor.genealogy.derived_from = predecessor.execution_id`

`successor.genealogy.previous_state = PENDING`

`successor.genealogy.new_state = EXECUTING`

`successor.genealogy.hash = predecessor.payload_sha256`

The authorization-consumption evidence bound into the successor MUST refer
to the same `execution_id`, authorization identity, authorization version,
authorization payload hash, replay key, action digest, request digest and
IOSPACE binding already committed by the predecessor execution and its
canonical authorization.

A mismatch between consumption evidence and the predecessor execution MUST
fail closed and MUST NOT produce an `EXECUTING` successor.

Direct transitions from `PENDING` to `EXECUTED`, `FAILED` or `ABORTED`
are prohibited.

After an execution attempt enters `EXECUTING`, exactly the following
cross-state terminal transitions are permitted:

`EXECUTING -> EXECUTED`

`EXECUTING -> FAILED`

`EXECUTING -> ABORTED`

`EXECUTED`, `FAILED`, `ABORTED` and `BLOCKED` are terminal lifecycle
states for the same logical execution attempt under this version of the
model. They MAY receive same-state append-only revisions for later
evidence or references, but they MUST NOT transition to a different
lifecycle state.

`UNKNOWN` is fail-closed. `UNKNOWN` MUST NOT authorize execution start,
authorization consumption or a transition into `EXECUTING`. This version
defines no cross-state transition to or from `UNKNOWN`. Same-state
`UNKNOWN` revisions MAY append evidence that preserves the unresolved
state.

The lifecycle graph does not make execution equivalent to success,
OUTCOME or CONSEQUENCE. In particular, `EXECUTED` means only that the
execution attempt completed. OUTCOME and CONSEQUENCE remain separately
represented and evaluated objects.

The lifecycle transition contract does not authorize retroactive mutation,
state rewriting, authorization re-consumption, execution-id synthesis or
silent substitution of EVT, OPC, registry or legacy semantics.


### 8.3 EVIDENCE SET identity, version and genealogy

For `HBCE_CORE_EVIDENCE_SET`, `evidence_set_id` identifies one logical Evidence Set across its append-only lifecycle.

A canonical lifecycle revision MUST NOT receive a new `evidence_set_id` merely because evidence, references or lifecycle state changed.

`evidence_set_version` identifies the canonical revision of that Evidence Set.

The first canonical revision MUST use:

`evidence_set_version = 1`

Every subsequent canonical revision MUST preserve the same `evidence_set_id` and increment `evidence_set_version` by exactly one.

Therefore:

`successor.evidence_set_id = predecessor.evidence_set_id`

and:

`successor.evidence_set_version = predecessor.evidence_set_version + 1`

A previously emitted canonical Evidence Set revision MUST NOT be mutated, replaced in place, retrodated or silently re-hashed.

A later revision MAY preserve the same lifecycle state when it only appends evidence or references.

The permitted lifecycle relations are:

`OPEN -> OPEN`

`OPEN -> CLOSED`

`CLOSED -> CLOSED`

`CLOSED -> OPEN` is forbidden.

For every canonical revision:

`genealogy.new_state = state`

For `evidence_set_version = 1`:

`genealogy.derived_from = null`

`genealogy.previous_state = null`

`genealogy.new_state = OPEN`

and:

`genealogy.hash = authority_sha256`

For every `evidence_set_version > 1`:

`genealogy.derived_from = evidence_set_id`

`genealogy.previous_state = predecessor.state`

`genealogy.new_state = state`

and:

`genealogy.hash = predecessor.payload_sha256`

The exact predecessor of a non-genesis Evidence Set revision is identified by the conjunction of:

`evidence_set_id`

`evidence_set_version - 1`

and:

`genealogy.hash`

`genealogy.derived_from` by itself MUST NOT be interpreted as a complete version locator.

For a genesis Evidence Set revision, `genealogy.hash` anchors the lineage to the exact canonical AUTHORITY revision identified by `authority_ref`, `authority_version` and `authority_sha256`.

For a non-genesis Evidence Set revision, `genealogy.hash` anchors the revision to the exact immediately preceding canonical Evidence Set payload.

This Evidence Set-specific genealogy hash scope MUST NOT be silently replaced by EVT, OPC, registry, legacy or domain-specific hashing semantics.

A `CLOSED -> CLOSED` revision may append evidence or references, but it MUST NOT silently rewrite the finalized assessment result. Exact cross-revision result immutability, predecessor resolution, version increment, authority binding and genealogy hash equality require runtime validation.

## 9. Revocation propagation

Revocation must be explicit and reconstructible.

If a MANDATE becomes revoked, expired or superseded, dependent AUTHORITY and AUTHORIZATION objects must not be silently treated as valid.

If an AUTHORITY becomes revoked, expired or superseded, dependent AUTHORIZATION objects must not authorize new execution.

If an AUTHORIZATION becomes revoked, expired or superseded before execution, the corresponding operation must fail closed.

Historical EXECUTION, EVT and OPC records remain historical facts and must not be deleted merely because their prerequisite authority later changes state.

## 10. Evidence model

The Platform Core must prefer references over unnecessary data custody.

Preferred representations include:

REFERENCE

DIGEST

CLAIM

ATTESTATION

SELECTIVE_DISCLOSURE

VERIFIABLE_RELATIONSHIP

Raw sensitive evidence should remain outside public proof layers unless a separate controlled architecture explicitly permits custody.

TRACE != TRUTH

A hash proves correspondence with a referenced payload when correctly verified.

A hash does not independently prove the truth, legality or correctness of the underlying claim.

### 10.1 Runtime reference resolution and durable backing boundary

A canonical reference is not self-proving merely because it is present
inside a canonical Platform Core object.

When a runtime operation requires an outbound reference to resolve, the
implementation MUST establish the existence of the exact referenced
identity through an appropriate server-side durable backing source.

Identifier syntax, prefix validity, fixture occurrence, presence inside
an EVIDENCE SET row, or presence in a public proof registry MUST NOT by
itself be treated as sufficient production reference resolution.

Canonical AUTHORITY remains a canonical Platform Core object and MUST
remain separate from generic reference-registry infrastructure.

The exact canonical AUTHORITY revision bound to an EVIDENCE SET is:

`authority_ref = authority.authority_id`

`authority_version = authority.authority_version`

`authority_sha256 = authority.payload_sha256`

A runtime that resolves this binding MUST resolve the exact durable
canonical AUTHORITY revision and MUST verify its canonical identity,
version and payload commitment. Missing, unavailable, malformed or
mismatched AUTHORITY material MUST fail closed.

A generic typed reference registry MAY be implemented as Platform Core
runtime trust and persistence infrastructure for outbound references
that do not have another independently queryable durable backing source
with an exactly compatible identity.

Such a generic runtime registry is not itself the referenced canonical
object and does not create an additional Platform Core canonical object
kind.

Its minimum lookup identity is the exact conjunction of:

`reference_type`

and:

`reference`

The generic reference types consumed by EVIDENCE SET are:

`EVIDENCE`

`CONTROL`

`OBSERVATION`

`RESULT`

`ARTIFACT`

`EXTERNAL_CONFIRMATION`

`EVENT`

`EVT`

`OPC`

A durable generic reference registration MUST carry a stable
content/provenance commitment sufficient to prevent unrelated material
from being accepted under the same typed reference.

Generic reference persistence MUST be append-only. An exact duplicate
MAY be treated as an idempotent replay. A conflicting duplicate MUST
fail closed. Existing registrations MUST NOT be silently updated or
deleted.

Reference resolution MUST require exact type and exact reference
identity. Unsupported, missing, ambiguous, conflicting or unavailable
references MUST remain unresolved and MUST fail closed wherever
resolution is required.

Where an existing canonical or domain-specific durable repository
already exposes an exactly compatible reference identity, a production
resolver MAY use that repository directly instead of duplicating the
record in the generic registry.

Reference types MUST NOT be silently aliased. In particular, EVIDENCE
is not RESULT, EVT is not EVENT, and OPC is not generic evidence merely
because those records may participate in the same evidence case.

The existing HBCE public REGISTRY remains a distinct public
proof-reference scope. A public registry match proves only the meaning
defined by that registry's own specification and MUST NOT automatically
be treated as production resolution of a Platform Core typed reference.

Any future binding between public REGISTRY material and a production
Platform Core reference resolver requires an explicit compatibility
profile proving exact reference identity and commitment semantics.

An EVIDENCE SET MUST NOT use its own persisted row as proof that its
outbound references exist. The Evidence Set remains a consumer of
independently resolved AUTHORITY and typed reference backing.

This runtime reference-resolution infrastructure does not alter the ten
canonical Platform Core schema kinds and does not modify the canonical
payload hash profile.

### Platform Core canonical payload hash profile

The canonical Platform Core payload commitment profile is:

`HBCE-PLATFORM-CORE-PAYLOAD-SHA256-v1`

This profile applies to the canonical Platform Core objects that contain
the required top-level `payload_sha256` field:

- MANDATE;
- CAPABILITY;
- AUTHORITY;
- AUTHORIZATION;
- EXECUTION;
- OUTCOME;
- CONSEQUENCE;
- MATRIX STATE;
- FEEDBACK;
- EVIDENCE SET.

The profile defines the object commitment as follows.

1. The hash preimage is the complete canonical JSON object being committed,
   with only that object's own top-level `payload_sha256` member omitted.

2. No other field may be removed, synthesized, defaulted, inferred,
   trimmed, normalized or rewritten merely for hashing.

3. Object member names are recursively ordered lexicographically before
   serialization.

4. Array order is preserved exactly.

5. JSON scalar values are preserved according to their schema-valid JSON
   representation.

6. The canonical representation is serialized as compact deterministic
   JSON without insignificant whitespace.

7. The canonical JSON string is encoded as UTF-8 bytes.

8. SHA-256 is computed over those UTF-8 bytes.

9. The resulting digest is represented as exactly 64 lowercase hexadecimal
   characters.

10. The top-level `payload_sha256` field of the final object is populated
    with that 64-character lowercase hexadecimal digest. The field does
    not use a `sha256:` prefix.

11. Verification removes only the final object's own top-level
    `payload_sha256`, rebuilds the canonical preimage using this same
    profile, recomputes SHA-256 and requires exact digest equality.

12. A missing, malformed, ambiguous or non-reproducible preimage must fail
    closed.

The `payload_sha256` member is therefore not part of its own hash preimage.
This avoids a self-referential digest definition.

This profile does not automatically define the semantics of other hash
members contained inside a Platform Core object. In particular,
dependency commitments, action/request digests, replay keys,
genealogy hashes, evidence hashes and other referenced digests retain
their own declared scope.

Implementations must not silently substitute EVT, OPC, registry,
domain-adapter or legacy hashing semantics for this Platform Core
profile, even where those implementations currently produce equivalent
bytes for a particular JSON value.

The final object, including its computed `payload_sha256`, must still
pass its canonical Platform Core JSON Schema before it may be returned
or consumed as a canonical object.

The digest proves deterministic correspondence with the committed
canonical payload. It does not independently establish truth, legality,
authorization legitimacy, regulated certification or execution success.


## 11. Existing schema compatibility

The following existing schemas remain independently canonical within their current scopes:

schemas/ipr.schema.json

schemas/hbce-evt.schema.json

schemas/receipt.schema.json

schemas/hbce-registry-entry.schema.json

This specification must not introduce breaking reinterpretation of those schemas.

Future Platform Core schemas should reference existing objects where appropriate instead of duplicating them.

## 12. Implementation classification

Initial status at publication of this specification (historical baseline):

IPR: IMPLEMENTED / EXISTING SCOPE

EVT: IMPLEMENTED / EXISTING SCOPE

OPC: IMPLEMENTED / EXISTING SCOPE

REGISTRY: IMPLEMENTED / EXISTING PUBLIC PROOF SCOPE

PRINCIPAL: SPECIFIED / NOT IMPLEMENTED

MANDATE: SPECIFIED / NOT IMPLEMENTED

CAPABILITY: SPECIFIED / NOT IMPLEMENTED AS CORE OBJECT

AUTHORITY: SPECIFIED / NOT IMPLEMENTED AS CORE OBJECT

AUTHORIZATION: SPECIFIED / NOT IMPLEMENTED AS CORE OBJECT

IOSPACE: SPECIFIED / EXISTING MODULE, NOT IMPLEMENTED AS CORE OBJECT

EXCHANGE: SPECIFIED / EXISTING CONCEPT, NOT IMPLEMENTED AS CORE OBJECT

EXECUTION: SPECIFIED / PARTIAL EXISTING CONCEPT, NOT IMPLEMENTED AS CORE OBJECT

OUTCOME: SPECIFIED / PARTIAL EXISTING CONCEPT

CONSEQUENCE: SPECIFIED / NOT IMPLEMENTED AS CORE OBJECT

MATRIX STATE: SPECIFIED / FRAMEWORK EXISTS, CANONICAL STATE ENGINE NOT IMPLEMENTED

FEEDBACK: SPECIFIED / EXISTING CONCEPT, CANONICAL CORE OBJECT NOT IMPLEMENTED

The historical baseline above is retained to preserve the implementation state that existed when this specification was first published. It must not be interpreted as the current P001 implementation state.

Current P001 canonical-schema status:

IPR: IMPLEMENTED / EXISTING SCOPE

EVT: IMPLEMENTED / EXISTING SCOPE

OPC: IMPLEMENTED / EXISTING SCOPE

REGISTRY: IMPLEMENTED / EXISTING PUBLIC PROOF SCOPE

PRINCIPAL: SPECIFIED / CANONICAL CORE OBJECT NOT IMPLEMENTED

MANDATE: CANONICAL SCHEMA IMPLEMENTED / STRUCTURALLY VERIFIED / RUNTIME NOT IMPLEMENTED

CAPABILITY: CANONICAL SCHEMA IMPLEMENTED / STRUCTURALLY VERIFIED / RUNTIME NOT IMPLEMENTED

AUTHORITY: CANONICAL SCHEMA IMPLEMENTED / STRUCTURALLY VERIFIED / RUNTIME NOT IMPLEMENTED

AUTHORIZATION: CANONICAL SCHEMA IMPLEMENTED / STRUCTURALLY VERIFIED / ATOMIC CONSUMPTION AND CROSS-OBJECT RUNTIME ENFORCEMENT NOT IMPLEMENTED

IOSPACE: SPECIFIED / EXISTING MODULE / CANONICAL CORE OBJECT NOT IMPLEMENTED

EXCHANGE: SPECIFIED / EXISTING CONCEPT / CANONICAL CORE OBJECT NOT IMPLEMENTED

EXECUTION: CANONICAL SCHEMA IMPLEMENTED / STRUCTURALLY VERIFIED / RUNTIME ENFORCEMENT NOT IMPLEMENTED

OUTCOME: CANONICAL SCHEMA IMPLEMENTED / STRUCTURALLY VERIFIED / CROSS-OBJECT RUNTIME VALIDATION NOT IMPLEMENTED

CONSEQUENCE: CANONICAL SCHEMA IMPLEMENTED / STRUCTURALLY VERIFIED / CROSS-OBJECT AND TEMPORAL RUNTIME VALIDATION NOT IMPLEMENTED

MATRIX STATE: CANONICAL SCHEMA IMPLEMENTED / STRUCTURALLY VERIFIED / CANONICAL STATE ENGINE AND STATE-TRANSITION RUNTIME VALIDATION NOT IMPLEMENTED

FEEDBACK: CANONICAL SCHEMA IMPLEMENTED / STRUCTURALLY VERIFIED / FEEDBACK PROCESSING AND INFLUENCE RUNTIME NOT IMPLEMENTED

EVIDENCE SET: CANONICAL SCHEMA IMPLEMENTED / STRUCTURALLY VERIFIED / LIFECYCLE STATE MACHINE STRUCTURALLY ENFORCED / CROSS-REVISION AND PERSISTENCE RUNTIME NOT IMPLEMENTED

The canonical schemas above define representation and structural constraints. Their presence does not claim that the HBCE Platform Core runtime, cross-object validator, authorization-consumption engine, MATRIX state engine or FEEDBACK influence processor is implemented.

## 13. Golden Flow target

The first Platform Core implementation must be capable of representing the following governed action without semantic collapse:

MANUEL
→ IPR
→ MANDATE
→ JOKER-C2 PROPOSES ACTION
→ DRAFT
→ HASH
→ HUMAN AUTHORIZATION
→ EXECUTION
→ EVT
→ OPC
→ MATRIX STATE UPDATE

The model must prove at minimum:

who acted;

on whose behalf;

under which mandate;

with which capability;

under which authority;

under which authorization;

inside which operational boundary;

what action was executed;

when it was executed;

which evidence exists;

what outcome occurred;

what consequence was observed;

what state existed before;

what state exists after.

## 14. Security requirements

The Platform Core must explicitly account for:

privilege escalation;

confused deputy conditions;

delegation chains;

stale authorization;

revoked mandates;

cross-domain authority confusion;

identity / authority conflation;

authorization replay;

tampering;

execution without authorization;

authorization without matching execution;

race conditions;

compromised agents or devices;

human override;

emergency authority;

revocation propagation;

audit reconstruction.

Security implementation is outside the scope of this semantic specification, but future schemas and runtime controls must preserve these distinctions.

## 15. Non-claims

This specification is an R&D architecture specification.

It does not by itself constitute:

legal authorization;

legal identity certification;

regulated KYC / AML;

eIDAS qualification;

public authority approval;

banking authorization;

cybersecurity certification;

production readiness;

external market validation.

## 16. Next implementation step

The next implementation step after semantic verification of this document is to define JSON Schema objects for the minimum Platform Core primitives.

No runtime enforcement should be claimed until schemas, validators, tests and execution controls are separately implemented and verified.
