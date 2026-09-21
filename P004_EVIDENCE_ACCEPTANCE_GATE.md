# P004 EVIDENCE ACCEPTANCE GATE

## Status

This document defines the P004 documentary acceptance gate for evidence records.

Baseline:

MAIN_HEAD=89bf565 docs(main): record post P004 evidence validation checklist checkpoint
P004_VALIDATION_CHECKLIST=P004_EVIDENCE_VALIDATION_CHECKLIST.md
P004_TEMPLATE=P004_EVIDENCE_RECORD_TEMPLATE.md
P004_EXAMPLE=P004_EVIDENCE_RECORD_EXAMPLE.md
P004_SCHEMA=P004_RUNTIME_EVIDENCE_SCHEMA.md
P004_REGISTRY=P004_EVIDENCE_REGISTRY_INDEX.md
P004_LIFECYCLE=P004_EVIDENCE_LIFECYCLE_STATE_MAP.md
P004_RUNTIME_ALIGNMENT=P004_RUNTIME_TO_EVIDENCE_ALIGNMENT.md

## Purpose

The Evidence Acceptance Gate defines how a P004 evidence record may be accepted, blocked, rejected, revoked, archived or held for review after documentary validation.

The gate exists after the validation checklist.

The validation checklist checks the record.

The acceptance gate decides the documentary acceptance state.

The acceptance gate does not create runtime authorization.

The acceptance gate does not authorize production deployment.

The acceptance gate does not authorize deployment readiness.

The acceptance gate does not authorize L3 readiness.

The acceptance gate does not authorize PostgreSQL runtime readiness or PostgreSQL runtime execution.

The acceptance gate does not authorize P04/P05 concurrency execution.

The acceptance gate does not authorize OPC ALLOW.

The acceptance gate does not create legal certification, eIDAS qualification or regulated KYC/AML provider status.

## Position in P004 chain

The P004 documentary chain after this document is:

1. P004_OPERATIONAL_EVIDENCE_LAYER_PLAN.md
2. P004_OPERATIONAL_EVIDENCE_MAP.md
3. P004_EVIDENCE_LIFECYCLE_STATE_MAP.md
4. P004_RUNTIME_TO_EVIDENCE_ALIGNMENT.md
5. P004_EVIDENCE_REGISTRY_INDEX.md
6. P004_RUNTIME_EVIDENCE_SCHEMA.md
7. P004_EVIDENCE_RECORD_TEMPLATE.md
8. P004_EVIDENCE_RECORD_EXAMPLE.md
9. P004_EVIDENCE_VALIDATION_CHECKLIST.md
10. P004_EVIDENCE_ACCEPTANCE_GATE.md

## Gate principle

An evidence record may pass the acceptance gate only when the validation result is explicit, the lifecycle state is consistent, the boundary flags are preserved and no blocked, denied, revoked or unsupported authorization claim is present.

Absence of failure is not acceptance.

Presence of a record is not acceptance.

Presence of a validation result is not acceptance.

Acceptance is a documentary classification only.

Acceptance does not authorize execution.

Acceptance does not authorize deployment.

Acceptance does not authorize OPC ALLOW.

Acceptance does not create legal or regulated status.

## Gate input requirements

The acceptance gate requires the following inputs:

- evidence record reference
- validation result reference
- validation timestamp
- validation status
- final lifecycle recommendation
- boundary flags
- human acceptance state
- runtime boundary state
- authority resolution state
- authorization resolution state
- OPC boundary state
- review metadata
- source document list

If a required input is missing, the gate result must be BLOCKED.

## Allowed gate results

Allowed gate results:

- ACCEPTED_DOCUMENTARY
- ACCEPTED_WITH_LIMITATIONS
- REVIEW_REQUIRED
- BLOCKED
- REJECTED
- REVOKED
- ARCHIVED

Gate result meaning:

- ACCEPTED_DOCUMENTARY means the record is accepted as documentary evidence within P004 scope.
- ACCEPTED_WITH_LIMITATIONS means the record is accepted only with explicit limitations.
- REVIEW_REQUIRED means human review is required before acceptance.
- BLOCKED means progression is prevented until required issues are resolved.
- REJECTED means the record cannot be accepted in its current form.
- REVOKED means previous acceptance is no longer valid.
- ARCHIVED means the record is preserved but not active.

No gate result authorizes runtime execution.

No gate result authorizes production deployment.

No gate result authorizes OPC ALLOW.

## Gate result hierarchy

The most restrictive active condition must prevail.

Priority order:

1. REVOKED
2. REJECTED
3. BLOCKED
4. REVIEW_REQUIRED
5. ACCEPTED_WITH_LIMITATIONS
6. ACCEPTED_DOCUMENTARY
7. ARCHIVED

If two or more conditions apply, select the more restrictive state.

If uncertainty exists, select REVIEW_REQUIRED or BLOCKED.

If boundary violation exists, select BLOCKED, REJECTED or REVOKED.

## Required boundary flags

Every acceptance-gate evaluation must preserve the canonical boundary flags:

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

Required values for documentation-only P004 acceptance:

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

If any required boundary flag is missing, the gate result must be BLOCKED.

If any required boundary flag is true within documentation-only scope, the gate result must be REJECTED.

If a previously accepted record later contains a true boundary flag without approved scope, the gate result must become REVOKED.

## Gate 1 - Evidence record identity

Input fields:

- evidence_id
- evidence_version
- evidence_scope
- record_title
- record_summary

Acceptance criteria:

- evidence_id is present
- evidence_version is present
- evidence_scope is explicit
- record_title is present
- record_summary is present
- scope remains documentary

Accepted result:

- ACCEPTED_DOCUMENTARY when all identity fields are valid and no limitation applies
- ACCEPTED_WITH_LIMITATIONS when identity is valid but limited by explicit scope constraints

Blocked result:

- BLOCKED when evidence_id is missing
- BLOCKED when evidence_version is missing
- BLOCKED when evidence_scope is missing

Rejected result:

- REJECTED when scope claims runtime authorization
- REJECTED when scope claims production readiness
- REJECTED when scope claims regulated provider status

Boundary:

- identity acceptance is documentary only
- identity acceptance does not authorize execution

## Gate 2 - Validation result

Input fields:

- validation_id
- validation_status
- validation_result
- final_lifecycle_recommendation
- validation_notes

Acceptance criteria:

- validation_id is present
- validation_status is explicit
- all checklist sections have explicit outcomes
- final_lifecycle_recommendation is explicit
- validation_result has no active FAIL, BLOCKED or unresolved REVIEW_REQUIRED items unless limitations are explicit

Allowed validation_status values:

- PASS
- FAIL
- BLOCKED
- REVIEW_REQUIRED
- PARTIAL_PASS
- NOT_APPLICABLE

Accepted result:

- ACCEPTED_DOCUMENTARY when validation_status is PASS and all applicable checks pass
- ACCEPTED_WITH_LIMITATIONS when validation_status is PARTIAL_PASS and limitations are explicit

Review result:

- REVIEW_REQUIRED when validation_status is REVIEW_REQUIRED
- REVIEW_REQUIRED when human review is pending and required

Blocked result:

- BLOCKED when validation_status is BLOCKED
- BLOCKED when required validation sections are missing

Rejected result:

- REJECTED when validation_status is FAIL
- REJECTED when validation contains unsupported authorization claims

Boundary:

- validation pass is not runtime authorization
- validation pass is not legal certification
- partial pass must not expand scope

## Gate 3 - Lifecycle recommendation

Input fields:

- lifecycle_state
- lifecycle_reason
- lifecycle_previous_state
- lifecycle_next_expected_state
- final_lifecycle_recommendation

Allowed lifecycle states:

- DRAFT
- PREPARED
- VERIFIED
- INHERITED
- SUPERSEDED
- BLOCKED
- REVOKED
- ARCHIVED

Acceptance criteria:

- lifecycle_state is explicit
- lifecycle_reason is present
- final_lifecycle_recommendation is compatible with lifecycle_state
- blocked, revoked or archived states are not treated as active acceptance

Accepted result:

- ACCEPTED_DOCUMENTARY when lifecycle_state is VERIFIED and final_lifecycle_recommendation supports documentary acceptance
- ACCEPTED_WITH_LIMITATIONS when lifecycle_state is VERIFIED but limitations are explicit
- ACCEPTED_WITH_LIMITATIONS when lifecycle_state is INHERITED and the source record is identified

Review result:

- REVIEW_REQUIRED when lifecycle_state is PREPARED but not verified
- REVIEW_REQUIRED when lifecycle_next_expected_state requires human review

Blocked result:

- BLOCKED when lifecycle_state is BLOCKED
- BLOCKED when final_lifecycle_recommendation is BLOCKED

Rejected or revoked result:

- REJECTED when lifecycle_state contradicts record contents
- REVOKED when lifecycle_state is REVOKED
- ARCHIVED when lifecycle_state is ARCHIVED

Boundary:

- lifecycle acceptance is not deployment readiness
- VERIFIED does not mean production-ready
- INHERITED does not expand authority

## Gate 4 - Boundary preservation

Input fields:

- boundary flags
- decision_limitations
- runtime_boundary_state

Acceptance criteria:

- all canonical boundary flags are present
- all canonical boundary flags remain false
- runtime_boundary_state is documentation_only or review_only
- decision_limitations explicitly preserve restricted scope

Accepted result:

- ACCEPTED_DOCUMENTARY when all boundary flags are present and false
- ACCEPTED_WITH_LIMITATIONS when additional explicit documentary limitations exist

Review result:

- REVIEW_REQUIRED when boundary language is incomplete but not contradictory

Blocked result:

- BLOCKED when any canonical boundary flag is missing
- BLOCKED when runtime boundary state is ambiguous

Rejected result:

- REJECTED when any canonical boundary flag is true without approved separate scope
- REJECTED when decision limitations are absent and record language implies authorization

Revoked result:

- REVOKED when a previously accepted record later violates canonical boundary flags

Boundary:

- boundary preservation is mandatory
- absence of boundary preservation prevents acceptance
- false boundary flags are not pending approvals

## Gate 5 - Runtime boundary

Input fields:

- runtime_boundary_state
- event_type
- event_ref
- operation_status
- authorization_state

Allowed runtime_boundary_state values:

- documentation_only
- review_only
- blocked
- denied
- not_applicable

Acceptance criteria:

- runtime_boundary_state is explicit
- runtime_boundary_state remains documentation_only or review_only for accepted documentary records
- event and operation references do not imply runtime execution
- authorization_state does not imply execution approval

Accepted result:

- ACCEPTED_DOCUMENTARY when runtime boundary is documentation_only and no execution claim exists
- ACCEPTED_WITH_LIMITATIONS when runtime boundary is review_only and review limitations are explicit

Review result:

- REVIEW_REQUIRED when runtime boundary needs human interpretation

Blocked result:

- BLOCKED when runtime boundary is blocked
- BLOCKED when operation status is blocked
- BLOCKED when authorization state is blocked

Rejected result:

- REJECTED when runtime execution is claimed without approved scope
- REJECTED when documentation_only is contradicted by record content

Boundary:

- no runtime execution
- no production execution
- no PostgreSQL execution
- no P04/P05 concurrency execution

## Gate 6 - Authority resolution

Input fields:

- authority_ref
- authority_type
- authority_resolution_state
- authority_basis
- human_acceptance_state

Allowed authority_resolution_state values:

- resolved
- unresolved
- blocked
- denied
- not_applicable

Acceptance criteria:

- authority resolution state is explicit
- authority basis is present when authority is resolved
- human acceptance state is explicit
- unresolved authority does not progress as accepted

Accepted result:

- ACCEPTED_DOCUMENTARY when authority is resolved or not_applicable within documentary scope
- ACCEPTED_WITH_LIMITATIONS when authority is resolved with explicit limitations

Review result:

- REVIEW_REQUIRED when authority requires human review
- REVIEW_REQUIRED when human_acceptance_state is PENDING and acceptance requires human review

Blocked result:

- BLOCKED when authority is unresolved and required
- BLOCKED when authority state is blocked

Rejected result:

- REJECTED when authority is denied
- REJECTED when AI-system output is treated as human authority
- REJECTED when authority is invented from context

Boundary:

- no AI-as-human substitution
- no implicit authority promotion
- no regulated authority claim

## Gate 7 - Authorization resolution

Input fields:

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

Acceptance criteria:

- authorization_state is explicit
- not_requested is acceptable for documentation-only evidence
- review_only remains non-executive
- prepared does not mean approved
- denied and blocked prevent acceptance unless record is being accepted only as evidence of denial or blockage

Accepted result:

- ACCEPTED_DOCUMENTARY when authorization_state is not_requested and record scope is documentation-only
- ACCEPTED_WITH_LIMITATIONS when authorization_state is review_only and limitations are explicit

Review result:

- REVIEW_REQUIRED when authorization_state is prepared and human review is required

Blocked result:

- BLOCKED when authorization_state is blocked

Rejected result:

- REJECTED when authorization_state is denied and record attempts to claim acceptance as approved authorization
- REJECTED when production authorization is claimed
- REJECTED when OPC ALLOW is claimed

Boundary:

- no production authorization
- no deployment authorization
- no L3 authorization
- no OPC ALLOW

## Gate 8 - OPC proof boundary

Input fields:

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

Acceptance criteria:

- opc boundary state is explicit
- not_applicable is acceptable only when OPC proof is not required
- proof_prepared may support documentary review
- proof_reviewed may support documentary acceptance only if no OPC ALLOW is claimed
- proof_not_present blocks acceptance when proof is required

Accepted result:

- ACCEPTED_DOCUMENTARY when OPC state is not_applicable within scope
- ACCEPTED_WITH_LIMITATIONS when proof_prepared or proof_reviewed supports documentary limitation only

Review result:

- REVIEW_REQUIRED when opc_review_required is true

Blocked result:

- BLOCKED when proof is required but not present
- BLOCKED when proof_blocked is active

Rejected result:

- REJECTED when proof_denied is active and record claims acceptance
- REJECTED when OPC ALLOW is claimed

Boundary:

- proof review is not OPC ALLOW
- proof preparation is not runtime authorization
- proof absence cannot become acceptance by silence

## Gate 9 - Source document consistency

Input fields:

- source_documents
- source_document_versions
- source_document_scope
- inherited_record_ref

Acceptance criteria:

- source documents are listed
- required P004 sources are identifiable
- source scope does not expand record scope
- inherited records identify their source

Accepted result:

- ACCEPTED_DOCUMENTARY when source chain is present and consistent
- ACCEPTED_WITH_LIMITATIONS when source chain is partial but sufficient for limited documentary acceptance

Review result:

- REVIEW_REQUIRED when source chain requires human review

Blocked result:

- BLOCKED when required source documents are missing
- BLOCKED when inherited source is missing

Rejected result:

- REJECTED when source documents are used to claim authorization outside scope
- REJECTED when source documents are used to imply legal certification

Boundary:

- source consistency supports review only
- source inheritance does not expand authority

## Gate 10 - Review metadata

Input fields:

- reviewer_ref
- review_timestamp
- review_status
- review_notes

Allowed review_status values:

- pending
- reviewed
- blocked
- rejected
- archived

Acceptance criteria:

- review status is explicit
- review notes do not create unsupported authorization
- reviewer reference is present when review status is reviewed
- pending review does not become acceptance

Accepted result:

- ACCEPTED_DOCUMENTARY when review_status is reviewed and all required gates pass
- ACCEPTED_WITH_LIMITATIONS when review_status is reviewed with explicit limitations

Review result:

- REVIEW_REQUIRED when review_status is pending

Blocked result:

- BLOCKED when review_status is blocked

Rejected or archived result:

- REJECTED when review_status is rejected
- ARCHIVED when review_status is archived

Boundary:

- review is not production approval
- reviewer identity is not automatic authorization
- review notes cannot override boundary flags

## Gate 11 - Human acceptance

Input fields:

- human_acceptance_state
- human_acceptance_basis
- human_acceptance_timestamp

Allowed human_acceptance_state values:

- PENDING
- ACCEPTED
- REJECTED
- BLOCKED

Acceptance criteria:

- human_acceptance_state is explicit
- ACCEPTED remains scoped to documentary acceptance
- PENDING cannot produce accepted state when human acceptance is required
- REJECTED or BLOCKED prevents acceptance

Accepted result:

- ACCEPTED_DOCUMENTARY when human_acceptance_state is ACCEPTED within documentary scope
- ACCEPTED_WITH_LIMITATIONS when human acceptance is explicit but limited

Review result:

- REVIEW_REQUIRED when human_acceptance_state is PENDING and human acceptance is required

Blocked result:

- BLOCKED when human_acceptance_state is BLOCKED

Rejected result:

- REJECTED when human_acceptance_state is REJECTED

Boundary:

- human acceptance is scoped
- human acceptance does not create production authorization
- human acceptance does not create legal certification

## Gate 12 - Final acceptance decision

Input fields:

- evidence_id
- validation_id
- gate_result
- gate_reason
- gate_limitations
- gate_timestamp
- gate_decision_by_ref

Acceptance criteria:

- gate_result is explicit
- gate_reason is present
- gate_limitations preserve boundaries
- gate decision reference is present or explicitly not_applicable
- gate timestamp is present

Allowed final gate result mapping:

- validation PASS plus all gates pass maps to ACCEPTED_DOCUMENTARY
- validation PARTIAL_PASS plus explicit limitations maps to ACCEPTED_WITH_LIMITATIONS
- validation REVIEW_REQUIRED maps to REVIEW_REQUIRED
- validation BLOCKED maps to BLOCKED
- validation FAIL maps to REJECTED
- lifecycle REVOKED maps to REVOKED
- lifecycle ARCHIVED maps to ARCHIVED

The final gate result must not be more permissive than the most restrictive active gate condition.

## Acceptance matrix

ACCEPTED_DOCUMENTARY requires:

- evidence identity present
- validation status PASS
- lifecycle state VERIFIED
- boundary flags present and false
- runtime boundary documentation_only or review_only
- authority resolution resolved or not_applicable
- authorization state not_requested or review_only
- no OPC ALLOW claim
- source documents present
- review status reviewed or explicitly not_applicable
- human acceptance ACCEPTED or explicitly not required
- no active blocked, denied or revoked condition

ACCEPTED_WITH_LIMITATIONS requires:

- evidence identity present
- validation status PASS or PARTIAL_PASS
- lifecycle state VERIFIED or INHERITED
- limitations explicit
- boundary flags present and false
- runtime boundary documentation_only or review_only
- no production authorization
- no OPC ALLOW
- no legal or regulated status claim

REVIEW_REQUIRED requires one or more of:

- human acceptance pending where required
- authority review pending
- OPC review required
- validation status REVIEW_REQUIRED
- ambiguous but non-contradictory limitation
- incomplete review metadata

BLOCKED requires one or more of:

- missing required gate input
- missing boundary flag
- unresolved required authority
- blocked authorization state
- blocked OPC proof state
- blocked lifecycle state
- validation status BLOCKED
- runtime boundary blocked
- incomplete required source chain

REJECTED requires one or more of:

- validation status FAIL
- authorization denied and acceptance claimed as approval
- OPC proof denied and acceptance claimed as approval
- unsupported runtime execution claim
- unsupported production deployment claim
- unsupported L3 readiness claim
- unsupported PostgreSQL runtime claim
- unsupported P04/P05 concurrency execution claim
- unsupported OPC ALLOW claim
- unsupported legal certification claim
- unsupported eIDAS qualification claim
- unsupported regulated KYC/AML provider status claim

REVOKED requires one or more of:

- previously accepted record is superseded by contradictory evidence
- previously accepted record violates boundary flags
- previously accepted record contains unsupported authorization claims
- lifecycle state becomes REVOKED

ARCHIVED requires:

- lifecycle state ARCHIVED
- archive reason present
- active reliance disabled
- boundary flags preserved

## Minimal gate decision format

gate_decision_id: ""
evidence_record_ref: ""
validation_result_ref: ""
gate_timestamp: ""
gate_result: "REVIEW_REQUIRED"
gate_reason: ""
gate_limitations:
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
gate_inputs:
  evidence_identity: "REVIEW_REQUIRED"
  validation_result: "REVIEW_REQUIRED"
  lifecycle_recommendation: "REVIEW_REQUIRED"
  boundary_preservation: "REVIEW_REQUIRED"
  runtime_boundary: "REVIEW_REQUIRED"
  authority_resolution: "REVIEW_REQUIRED"
  authorization_resolution: "REVIEW_REQUIRED"
  opc_proof_boundary: "REVIEW_REQUIRED"
  source_document_consistency: "REVIEW_REQUIRED"
  review_metadata: "REVIEW_REQUIRED"
  human_acceptance: "REVIEW_REQUIRED"
gate_decision_by_ref: ""
human_acceptance_state: "PENDING"

## Fail-closed rule

When a gate input is missing, ambiguous, contradictory or unsupported, the acceptance gate must fail closed.

Fail-closed states:

- REVIEW_REQUIRED for ambiguity requiring human interpretation
- BLOCKED for missing required input
- REJECTED for unsupported authorization claims
- REVOKED for previously accepted records that later violate boundaries

Silence is not approval.

Incomplete evidence is not approval.

Validation without gate acceptance is not acceptance.

Acceptance without preserved boundaries is invalid.

## Decision rule

This gate may be used to classify P004 evidence records as documentary accepted, accepted with limitations, review required, blocked, rejected, revoked or archived.

It must not be used as runtime authorization, production approval, deployment readiness, L3 readiness, PostgreSQL runtime readiness, PostgreSQL execution, P04/P05 concurrency execution, OPC ALLOW, legal certification, eIDAS qualification or regulated KYC/AML provider status.
