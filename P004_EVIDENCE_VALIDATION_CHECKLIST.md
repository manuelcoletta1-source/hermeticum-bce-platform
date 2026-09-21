# P004 EVIDENCE VALIDATION CHECKLIST

## Status

This document defines the P004 documentary validation checklist for future evidence records.

Baseline:

MAIN_HEAD=dd90e8d docs(main): record post P004 evidence record example checkpoint
P004_TEMPLATE=P004_EVIDENCE_RECORD_TEMPLATE.md
P004_EXAMPLE=P004_EVIDENCE_RECORD_EXAMPLE.md
P004_SCHEMA=P004_RUNTIME_EVIDENCE_SCHEMA.md
P004_REGISTRY=P004_EVIDENCE_REGISTRY_INDEX.md
P004_LIFECYCLE=P004_EVIDENCE_LIFECYCLE_STATE_MAP.md
P004_RUNTIME_ALIGNMENT=P004_RUNTIME_TO_EVIDENCE_ALIGNMENT.md

## Purpose

The Evidence Validation Checklist defines how a P004 evidence record may be reviewed before it can be classified as documentary evidence.

The checklist supports review consistency.

The checklist supports repeatable validation.

The checklist supports fail-closed documentary handling.

The checklist does not create runtime authorization.

The checklist does not certify production readiness.

The checklist does not authorize deployment, L3, PostgreSQL runtime readiness, PostgreSQL runtime execution, P04/P05 concurrency execution, OPC ALLOW, legal certification, eIDAS qualification or regulated KYC/AML provider status.

## Validation principle

A P004 evidence record may be considered reviewable only when required fields are present, explicit and consistent with the P004 documentary boundary.

Missing fields must not be interpreted as approval.

Ambiguous fields must not be interpreted as approval.

Inherited fields must not expand scope.

Prepared records must not be treated as verified records.

Verified records must not be treated as runtime authorization.

## Validation outcomes

Allowed validation outcomes:

- PASS
- FAIL
- BLOCKED
- NOT_APPLICABLE
- REVIEW_REQUIRED

Outcome meaning:

- PASS means the checked item satisfies the documentary requirement.
- FAIL means the checked item violates the documentary requirement.
- BLOCKED means the checked item cannot proceed without explicit resolution.
- NOT_APPLICABLE means the checked item is explicitly outside the record scope.
- REVIEW_REQUIRED means the checked item requires human review before classification.

No validation outcome authorizes runtime execution.

No validation outcome authorizes production deployment.

No validation outcome authorizes OPC ALLOW.

## Required source chain

A validation review should consider the current P004 source chain:

1. P004_OPERATIONAL_EVIDENCE_LAYER_PLAN.md
2. P004_OPERATIONAL_EVIDENCE_MAP.md
3. P004_EVIDENCE_LIFECYCLE_STATE_MAP.md
4. P004_RUNTIME_TO_EVIDENCE_ALIGNMENT.md
5. P004_EVIDENCE_REGISTRY_INDEX.md
6. P004_RUNTIME_EVIDENCE_SCHEMA.md
7. P004_EVIDENCE_RECORD_TEMPLATE.md
8. P004_EVIDENCE_RECORD_EXAMPLE.md

## Checklist 1 - Record identity

Validate that the record contains:

- evidence_id
- evidence_version
- evidence_scope
- record_title
- record_summary
- created_at
- created_by_ref

Validation rules:

- evidence_id must be present.
- evidence_id must be stable.
- evidence_version must be present.
- evidence_scope must be explicit.
- record_title must describe the record.
- record_summary must describe documentary purpose.
- created_at must be present.
- created_by_ref must be present or explicitly null.

Fail conditions:

- evidence_id missing
- evidence_scope missing
- evidence_scope implies production or runtime authorization
- record summary contains approval language not supported by decision fields

Boundary:

- record identity does not authorize runtime execution
- versioning does not expand scope
- title and summary are documentary only

## Checklist 2 - Source document consistency

Validate that source_documents are listed.

Expected source documents:

- P004_OPERATIONAL_EVIDENCE_LAYER_PLAN.md
- P004_OPERATIONAL_EVIDENCE_MAP.md
- P004_EVIDENCE_LIFECYCLE_STATE_MAP.md
- P004_RUNTIME_TO_EVIDENCE_ALIGNMENT.md
- P004_EVIDENCE_REGISTRY_INDEX.md
- P004_RUNTIME_EVIDENCE_SCHEMA.md
- P004_EVIDENCE_RECORD_TEMPLATE.md

Validation rules:

- source_documents must not be empty.
- source_documents must include relevant P004 sources.
- source_documents must not imply inherited approval.
- source_documents must not silently expand scope.

Fail conditions:

- source documents absent
- referenced sources do not exist
- source chain is used to imply authorization
- source chain is used to imply legal or regulated status

Boundary:

- source documents support review
- source documents do not create runtime authority

## Checklist 3 - Runtime event reference

Validate:

- event_ref
- event_type
- event_timestamp
- event_source
- event_observation_basis

Allowed event_type values:

- observed_event
- declared_event
- simulated_event
- blocked_event
- denied_event
- prepared_event
- not_applicable

Validation rules:

- event_type must be explicit.
- event_ref may be null only when event_type is not_applicable.
- simulated events must not be treated as production events.
- observed events must have a reviewable basis.
- blocked and denied events must not progress as approved events.

Fail conditions:

- event_type missing
- event_type claims production authorization
- simulated event treated as production proof
- observed event lacks observation basis
- denied or blocked event treated as allowed

Boundary:

- event reference is not automatic proof
- event timestamp is not authorization
- runtime event documentation is not runtime execution

## Checklist 4 - Operation request reference

Validate:

- operation_ref
- operation_class
- operation_status
- operation_requested_by_ref
- operation_timestamp
- operation_summary

Allowed operation_class values:

- documentation
- review
- evidence_preparation
- evidence_verification
- policy_evaluation
- authority_resolution
- authorization_resolution
- blocked_runtime_request
- denied_runtime_request

Allowed operation_status values:

- draft
- prepared
- reviewed
- denied
- blocked
- archived

Validation rules:

- operation_class must describe the request.
- operation_status must describe documentary handling.
- prepared does not mean executed.
- reviewed does not mean authorized.
- blocked and denied statuses must prevent progression.

Fail conditions:

- operation_class implies production deployment
- operation_class implies PostgreSQL execution
- operation_class implies P04/P05 concurrency execution
- operation_status implies runtime approval
- blocked or denied request is treated as approved

Boundary:

- no production deployment
- no PostgreSQL runtime execution
- no P04/P05 concurrency execution
- no OPC ALLOW

## Checklist 5 - Policy evaluation reference

Validate:

- policy_eval_ref
- policy_eval_result
- policy_eval_scope
- policy_eval_basis
- policy_eval_timestamp

Allowed policy_eval_result values:

- prepared
- structurally_valid
- structurally_invalid
- denied
- blocked
- inherited
- not_applicable

Validation rules:

- policy_eval_result must be explicit.
- policy_eval_scope must be explicit.
- inherited policy evaluation must identify its source.
- structurally_valid does not mean operationally allowed.
- denied and blocked policy results must prevent progression.

Fail conditions:

- policy_eval_result missing
- inherited source missing
- structurally_valid treated as OPC ALLOW
- policy result treated as legal certification
- denied or blocked policy result treated as acceptable

Boundary:

- no implicit allow
- no production certification
- no legal certification

## Checklist 6 - OPC proof boundary

Validate:

- opc_boundary_ref
- opc_boundary_state
- opc_boundary_basis
- opc_review_required

Allowed opc_boundary_state values:

- not_applicable
- proof_not_present
- proof_prepared
- proof_reviewed
- proof_blocked
- proof_denied

Validation rules:

- opc_boundary_state must be explicit.
- proof_not_present must remain unresolved if proof is required.
- proof_prepared means documentary proof prepared only.
- proof_reviewed must not be interpreted as OPC ALLOW.
- proof_blocked and proof_denied must prevent progression.

Fail conditions:

- OPC ALLOW claimed
- implicit allow claimed
- proof reviewed treated as runtime authorization
- proof missing but record progresses as verified
- proof denied but record progresses as acceptable

Boundary:

- OPC proof boundary is not OPC ALLOW
- proof preparation is not runtime authorization
- proof review does not bypass human decision

## Checklist 7 - Authority resolution

Validate:

- authority_ref
- authority_type
- authority_resolution_state
- authority_basis
- authority_timestamp

Allowed authority_type values:

- human
- office
- system
- ai_system
- unresolved
- not_applicable

Allowed authority_resolution_state values:

- resolved
- unresolved
- blocked
- denied
- not_applicable

Validation rules:

- authority_type must be explicit.
- unresolved authority must remain blocked.
- AI-system output must not substitute human approval.
- authority must not be invented from context.
- authority basis must be reviewable when authority is resolved.

Fail conditions:

- authority missing but approval implied
- unresolved authority treated as resolved
- AI-system treated as human authority
- authority basis missing for resolved authority
- authority used to imply regulated provider status

Boundary:

- no silent authority promotion
- no AI-as-human authority substitution
- no implicit regulated authority

## Checklist 8 - Authorization resolution

Validate:

- authorization_ref
- authorization_state
- authorization_basis
- authorization_timestamp

Allowed authorization_state values:

- not_requested
- prepared
- denied
- blocked
- review_only

Validation rules:

- authorization_state must be explicit.
- review_only remains documentary.
- prepared does not mean approved.
- blocked and denied must prevent progression.
- authorization_basis must not exceed record scope.

Fail conditions:

- production authorization claimed
- deployment authorization claimed
- L3 authorization claimed
- OPC ALLOW claimed
- regulated provider authorization claimed

Boundary:

- no production authorization
- no deployment authorization
- no L3 authorization
- no OPC ALLOW
- no regulated provider authorization

## Checklist 9 - Evidence lifecycle state

Validate:

- lifecycle_state
- lifecycle_reason
- lifecycle_previous_state
- lifecycle_next_expected_state
- lifecycle_timestamp

Allowed lifecycle_state values:

- DRAFT
- PREPARED
- VERIFIED
- INHERITED
- SUPERSEDED
- BLOCKED
- REVOKED
- ARCHIVED

Validation rules:

- lifecycle_state must be explicit.
- lifecycle_reason must be present.
- VERIFIED requires all required checklist items to pass or be explicitly not applicable.
- INHERITED requires a source reference.
- SUPERSEDED should identify replacement record where available.
- BLOCKED and REVOKED must prevent active reliance.

Fail conditions:

- lifecycle_state missing
- lifecycle_reason missing
- VERIFIED assigned with unresolved required checks
- INHERITED assigned without source
- BLOCKED or REVOKED record treated as active

Boundary:

- lifecycle state is not runtime authorization
- verification is not deployment readiness
- inheritance is not scope expansion

## Checklist 10 - Boundary flags

Validate that all canonical boundary flags are present:

- production_deployment
- production_readiness
- deployment_readiness
- l3_promotion
- l3_readiness
- postgresql_runtime_readiness
- postgresql_runtime_execution
- p04_p05_concurrency_execution
- opc_allow
- legal_certification
- eidas_qualification
- regulated_kyc_aml_provider_status

Required values for P004 documentation-only evidence records:

```yaml
production_deployment: false
production_readiness: false
deployment_readiness: false
l3_promotion: false
l3_readiness: false
postgresql_runtime_readiness: false
postgresql_runtime_execution: false
p04_p05_concurrency_execution: false
opc_allow: false
legal_certification: false
eidas_qualification: false
regulated_kyc_aml_provider_status: false
```

Validation rules:

- all canonical boundary flags must be present.
- all canonical boundary flags must remain false unless an explicitly separate approved scope exists.
- this checklist does not authorize such a scope change.
- missing flags must be treated as blocked.

Fail conditions:

- any canonical flag missing
- any canonical flag silently omitted
- any canonical flag set true within documentation-only scope
- false interpreted as pending approval

Boundary:

- this checklist cannot authorize a boundary change
- false flags must not be interpreted as pending approval
- absent approval remains absent approval

## Checklist 11 - Review metadata

Validate:

- reviewer_ref
- review_timestamp
- review_status
- review_notes
- source_documents

Allowed review_status values:

- pending
- reviewed
- blocked
- rejected
- archived

Validation rules:

- review_status must be explicit.
- reviewer_ref does not imply approval.
- review_timestamp records timing only.
- review_notes must not create authorization.
- source_documents must be listed when used.

Fail conditions:

- review_status missing
- review notes contain unsupported authorization
- reviewer reference treated as automatic approval
- source documents missing
- review treated as legal certification

Boundary:

- review is not runtime execution
- review is not production approval
- review is not legal certification

## Checklist 12 - Decision boundary

Validate:

- human_acceptance_state
- runtime_boundary_state
- decision_summary
- decision_limitations

Allowed human_acceptance_state values:

- PENDING
- ACCEPTED
- REJECTED
- BLOCKED

Allowed runtime_boundary_state values:

- documentation_only
- review_only
- blocked
- denied
- not_applicable

Validation rules:

- human_acceptance_state must be explicit.
- runtime_boundary_state must be explicit.
- PENDING does not authorize execution.
- ACCEPTED must remain scoped.
- REJECTED and BLOCKED must prevent progression.
- documentation_only must remain non-executive.

Fail conditions:

- human acceptance missing
- runtime boundary missing
- PENDING treated as approval
- ACCEPTED treated as production authorization
- documentation_only treated as runtime execution

Boundary:

- no runtime authorization
- no production readiness
- no L3 readiness
- no OPC ALLOW

## Final validation matrix

A P004 evidence record may be classified as PREPARED when:

- required fields are present
- lifecycle_state is PREPARED
- human_acceptance_state is PENDING or ACCEPTED within scope
- runtime_boundary_state is documentation_only or review_only
- all boundary flags remain false

A P004 evidence record may be classified as VERIFIED only when:

- required fields are present
- all applicable checklist sections pass
- unresolved authority is not present
- denied or blocked states are not active
- source documents are listed
- boundary flags remain false
- human acceptance is explicit
- runtime boundary remains documentation_only or review_only

A P004 evidence record must be classified as BLOCKED when:

- required identity is missing
- required boundary flags are missing
- authority is unresolved where required
- OPC proof is required but not present
- blocked or denied states exist without supersession
- any field implies production authorization
- any field implies OPC ALLOW
- any field implies legal or regulated provider status

A P004 evidence record must be classified as REJECTED or REVOKED when:

- it contains unsupported authorization claims
- it contradicts canonical boundary flags
- it claims runtime execution without approved scope
- it claims production readiness without approved scope
- it claims legal certification, eIDAS qualification or regulated KYC/AML provider status

## Minimal validation result format

```yaml
validation_id: ""
validated_record_ref: ""
validation_timestamp: ""
validation_status: "REVIEW_REQUIRED"
validation_result:
  record_identity: "REVIEW_REQUIRED"
  source_documents: "REVIEW_REQUIRED"
  runtime_event_reference: "REVIEW_REQUIRED"
  operation_request_reference: "REVIEW_REQUIRED"
  policy_evaluation_reference: "REVIEW_REQUIRED"
  opc_proof_boundary: "REVIEW_REQUIRED"
  authority_resolution: "REVIEW_REQUIRED"
  authorization_resolution: "REVIEW_REQUIRED"
  evidence_lifecycle_state: "REVIEW_REQUIRED"
  boundary_flags: "REVIEW_REQUIRED"
  review_metadata: "REVIEW_REQUIRED"
  decision_boundary: "REVIEW_REQUIRED"
final_lifecycle_recommendation: "BLOCKED"
validation_notes: ""
```

## Completion checklist

Before accepting a validation result, verify:

- validation_id is present
- validated_record_ref is present
- validation_timestamp is present
- all checklist sections have explicit outcomes
- final_lifecycle_recommendation is explicit
- no unsupported runtime authorization is present
- no unsupported production readiness claim is present
- no unsupported OPC ALLOW claim is present
- no unsupported legal or regulated status claim is present

## Decision rule

This checklist may be used to validate P004 evidence records for documentary consistency.

It must not be used as runtime authorization, production approval, deployment readiness, L3 readiness, PostgreSQL runtime readiness, PostgreSQL execution, P04/P05 concurrency execution, OPC ALLOW, legal certification, eIDAS qualification or regulated KYC/AML provider status.
