# HBCE RELEASE CANDIDATE SIGNOFF RECORD CONTRACT

## Document status

Program: HERMETICUM B.C.E. S.r.l. - HBCE Platform
Document type: Release Candidate Sign-off Record Contract
Version: 1.0 Candidate
Target release: 2027-01-19
Baseline main: 100e72e docs(main): record post HBCE release candidate review gate checkpoint
Parent contract: HBCE_PROGRAM_REALIGNMENT_V3_TECHNICAL_IMPLEMENTATION_CONTRACT.md
Parent matrix: HBCE_2027_REQUIREMENT_TO_TEST_EVIDENCE_MATRIX.md
Authority boundary: HBCE_AUTHORITY_PROFILE_CONTRACT.md
Adapter boundary: HBCE_BUSINESS_WALLET_ADAPTER_CONTRACT.md
Evidence model: HBCE_CANONICAL_EVIDENCE_MODEL_CONTRACT.md
Authorization decision boundary: HBCE_AUTHORIZATION_DECISION_CONTRACT.md
Execution boundary: HBCE_EXECUTION_BOUNDARY_CONTRACT.md
Consequence matrix boundary: HBCE_CONSEQUENCE_MATRIX_CONTRACT.md
Release Candidate completion boundary: HBCE_RELEASE_CANDIDATE_COMPLETION_CONTRACT.md
Release Candidate evidence pack boundary: HBCE_RELEASE_CANDIDATE_EVIDENCE_PACK_CONTRACT.md
Release Candidate review gate boundary: HBCE_RELEASE_CANDIDATE_REVIEW_GATE_CONTRACT.md
Runtime schema baseline: P004_RUNTIME_EVIDENCE_SCHEMA.md
Acceptance gate baseline: P004_EVIDENCE_ACCEPTANCE_GATE.md
Human acceptance required: true

## 1. Purpose

This document defines the HBCE Release Candidate Sign-off Record Contract.

The Sign-off Record defines how HBCE records human or organizational acknowledgement of a Release Candidate Review Gate outcome.

The Sign-off Record is a documentary acceptance record.

The Sign-off Record consumes a Review Gate result.

The Sign-off Record records signer identity.

The Sign-off Record records signer authority.

The Sign-off Record records sign-off scope.

The Sign-off Record records sign-off criteria.

The Sign-off Record records sign-off decision.

The Sign-off Record records objections.

The Sign-off Record records limitations.

The Sign-off Record records residual risks.

The Sign-off Record records boundary flags.

The Sign-off Record records human acceptance state.

The Sign-off Record does not create production deployment.

The Sign-off Record does not create production readiness.

The Sign-off Record does not create deployment readiness.

The Sign-off Record does not create L3 readiness.

The Sign-off Record does not create OPC ALLOW.

The Sign-off Record does not create legal certification.

The Sign-off Record does not create eIDAS qualification.

The Sign-off Record does not create regulated KYC or AML provider status.

This contract is documentary and technical.

This contract does not implement runtime behavior.

## 2. Position in the HBCE chain

The canonical HBCE chain is:

Identity -> Mandate -> Authority -> Authorization -> Decision -> Execution -> Evidence -> Consequence -> MATRIX -> Release Candidate Completion -> Release Candidate Evidence Pack -> Release Candidate Review Gate -> Release Candidate Sign-off Record

This contract governs the following segment:

Review Gate Outcome -> Signer Authority -> Sign-off Scope -> Sign-off Criteria -> Sign-off Decision -> Sign-off Record -> Sign-off Hash -> Sign-off Audit Summary

The upstream inputs are:

- program contract reference
- requirement matrix reference
- authority profile contract reference
- business wallet adapter contract reference
- canonical evidence model contract reference
- authorization decision contract reference
- execution boundary contract reference
- consequence matrix contract reference
- release candidate completion contract reference
- release candidate evidence pack contract reference
- release candidate review gate contract reference
- P004 runtime evidence schema reference
- P004 evidence acceptance gate reference
- release candidate completion reference
- evidence pack reference
- review gate reference
- review gate hash
- review outcome
- review findings reference
- review objections reference
- review gap register reference
- review limitation register reference
- signer authority record
- sign-off scope record
- sign-off criteria record
- human acceptance record

The downstream outputs are:

- signoff_record
- signoff_decision
- signoff_scope_record
- signoff_objection_register
- signoff_limitation_register
- signoff_residual_risk_register
- signoff_audit_summary
- signoff_hash
- signoff_human_acceptance_state
- signoff_lifecycle_state

This contract does not deploy.

This contract does not execute production operations.

This contract does not create legal certification.

This contract does not grant OPC ALLOW.

This contract does not mutate external legal, identity, banking, trust-list, public-register or regulated systems.

## 3. Source requirements

This contract derives from the following requirement matrix entries:

- HBCE-REQ-000 - Program contract traceability
- HBCE-REQ-001 - HBCE product role
- HBCE-REQ-002 - External system non-replacement
- HBCE-REQ-003 - Canonical chain enforcement
- HBCE-REQ-004 - Identity is not authorization
- HBCE-REQ-005 - No authority without mandate
- HBCE-REQ-006 - Authorization must be bounded
- HBCE-REQ-007 - Policy evaluation fail-closed
- HBCE-REQ-008 - No execution without authority
- HBCE-REQ-009 - Execution must produce evidence
- HBCE-REQ-010 - Evidence immutability
- HBCE-REQ-011 - MATRIX consequence requires evidence
- HBCE-REQ-012 - Human acceptance required
- HBCE-REQ-400 - WP-CONFORMANCE chain
- HBCE-REQ-401 - Evidence hash required
- HBCE-REQ-500 - WP-PRIVACY minimum disclosure
- HBCE-REQ-501 - Disclosure is not authorization
- HBCE-REQ-700 - /ipr API contract
- HBCE-REQ-710 - /authority API contract
- HBCE-REQ-720 - /authorization API contract
- HBCE-REQ-730 - /decision API contract
- HBCE-REQ-740 - /evidence API contract
- HBCE-REQ-750 - /audit API contract
- HBCE-REQ-760 - /events API contract
- HBCE-REQ-790 - /execution API contract
- HBCE-REQ-800 - /matrix API contract
- HBCE-REQ-900 - Golden Demo positive path
- HBCE-REQ-901 - Golden Demo negative path
- HBCE-REQ-902 - Release Candidate completion rule

## 4. Boundary preservation

This contract preserves the following boundary flags:

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

This contract does not authorize production deployment.

This contract does not authorize production readiness.

This contract does not authorize deployment readiness.

This contract does not authorize L3 readiness.

This contract does not authorize PostgreSQL runtime readiness or PostgreSQL execution.

This contract does not authorize P04/P05 concurrency execution.

This contract does not authorize OPC ALLOW.

This contract does not provide legal certification, eIDAS qualification or regulated KYC/AML provider status.

## 5. Definitions

### Sign-off Record

Sign-off Record is the documentary record that captures a bounded acceptance, rejection, block or acceptance-with-limitations decision after a Review Gate outcome.

Sign-off Record is not production deployment.

Sign-off Record is not production readiness.

Sign-off Record is not deployment readiness.

Sign-off Record is not legal certification.

Sign-off Record is not OPC ALLOW.

### Signer

Signer is the human or organizational actor who records the sign-off decision.

Signer identity alone is not signer authority.

Signer must have bounded authority.

Signer authority must be traceable.

### Signer Authority

Signer Authority is the bounded authority allowing a signer to sign off a specific review outcome for a defined scope.

Signer Authority is not production authority.

Signer Authority is not deploy authority.

Signer Authority is not OPC ALLOW.

Signer Authority is not legal certification authority.

Signer Authority must preserve limitations.

### Sign-off Scope

Sign-off Scope is the bounded set of Release Candidate material covered by the sign-off.

Sign-off Scope must reference Review Gate scope.

Sign-off Scope must preserve included artifacts.

Sign-off Scope must preserve excluded artifacts.

Sign-off Scope must preserve exclusion reasons.

Sign-off Scope must preserve limitations.

Sign-off Scope must not silently expand to production deployment.

### Sign-off Criteria

Sign-off Criteria are the explicit conditions under which the Sign-off Record may be accepted, accepted with limitations, rejected, blocked or non-completed.

Criteria satisfaction is not production readiness.

Criteria satisfaction is not legal certification.

Criteria satisfaction is not OPC ALLOW.

### Sign-off Decision

Sign-off Decision is the recorded outcome of the sign-off process.

Allowed decision families are acceptance, acceptance with limitations, rejection, block and non-completion.

Sign-off Decision is not production deployment.

Sign-off Decision is not legal certification.

### Sign-off Objection

Sign-off Objection is a documented objection raised at the sign-off level.

Sign-off objections must be preserved.

Sign-off objections cannot be erased by summary acceptance.

Sign-off objections cannot be erased by signer authority.

### Residual Risk

Residual Risk is a known risk, limitation, uncertainty or unresolved condition explicitly preserved in the Sign-off Record.

Residual Risk is not production readiness.

Residual Risk must be traceable.

Residual Risk must be preserved when sign-off is accepted with limitations.

### Sign-off Hash

Sign-off Hash is a deterministic hash of the Sign-off Record or sign-off package.

Sign-off Hash is not truth.

Sign-off Hash is not approval.

Sign-off Hash is not legal certification.

### Sign-off Lifecycle State

Sign-off Lifecycle State is the lifecycle state of the Sign-off Record.

Lifecycle state must preserve draft, pending, accepted, accepted with limitations, rejected, blocked, archived and revoked states.

Lifecycle state is not production state.

## 6. Non-equivalence rules

The following equivalence shortcuts are forbidden:

Sign-off Record = Production

Sign-off Record = Production Readiness

Sign-off Record = Deployment Readiness

Sign-off Record = L3 Readiness

Sign-off Record = OPC ALLOW

Sign-off Record = Legal Certification

Sign-off Record = eIDAS Qualification

Sign-off Record = Regulated KYC or AML Provider Status

Sign-off Recorded = Production Deployment

Sign-off Recorded = Production Readiness

Sign-off Recorded = Deployment Readiness

Sign-off Recorded = L3 Readiness

Sign-off Recorded = OPC ALLOW

Sign-off Recorded = Legal Certification

Sign-off Accepted = Production Deployment

Sign-off Accepted = Production Readiness

Sign-off Accepted = Deployment Readiness

Sign-off Accepted = L3 Readiness

Sign-off Accepted = OPC ALLOW

Sign-off Accepted = Legal Certification

Sign-off Accepted With Limitations = Production Ready

Sign-off Accepted With Limitations = Deployment Ready

Sign-off Rejected = Production Rejected

Sign-off Blocked = Production Blocked

Signer Identity = Signer Authority

Signer Authority = Production Authority

Signer Authority = Deploy Authority

Signer Authority = OPC ALLOW

Signer Authority = Legal Certification Authority

Signer Authority PASS = Production Authority

Review Gate Accepted = Sign-off Accepted

Review Gate Accepted = Production Deployment

Review Gate Accepted = Legal Certification

Review Gate Accepted With Limitations = Sign-off Accepted

Review Gate Rejected = Sign-off Rejected

Review Gate Blocked = Sign-off Blocked

Sign-off Scope = Deployment Scope

Sign-off Criteria PASS = Production Readiness

Sign-off Audit Summary = Approval

Sign-off Hash = Truth

Sign-off Hash = Approval

Sign-off Hash = Certification

No Sign-off Objection = Sign-off Accepted

Missing Sign-off Objection Register = No Objection

Missing Residual Risk Register = No Residual Risk

Residual Risk Accepted = Risk Removed

Human Acceptance = Production Deployment

Human Acceptance = OPC ALLOW

Human Acceptance = Legal Certification

Checklist Complete = Sign-off Accepted

Documentation Complete = Sign-off Accepted

## 7. Sign-off Record responsibilities

The Sign-off Record layer is responsible for:

- receiving sign-off record requests
- assigning signoff_record_id
- verifying source contract references
- verifying release candidate completion reference
- verifying evidence pack reference
- verifying review gate reference
- verifying review gate hash
- verifying review outcome
- verifying signer identity reference
- verifying signer authority reference
- verifying sign-off scope
- verifying sign-off criteria
- verifying sign-off decision
- generating sign-off objection register
- generating sign-off limitation register
- generating residual risk register
- generating sign-off audit summary
- computing sign-off hash
- preserving review gate findings
- preserving review gate objections
- preserving review gate gaps
- preserving review gate limitations
- preserving residual risks
- preserving boundary flags
- preserving human acceptance state
- failing closed on unknown mandatory states

The Sign-off Record layer is not responsible for:

- deploying production
- executing runtime
- promoting L3
- granting OPC ALLOW
- creating legal certification
- creating eIDAS qualification
- replacing regulated KYC or AML systems
- replacing external trust registers
- overriding Review Gate failure
- overriding Evidence Pack failure
- overriding Release Candidate completion failure
- overriding missing signer authority
- overriding human rejection

## 8. Sign-off Record chain

The required sign-off chain is:

1. Receive Sign-off Record request.
2. Assign signoff_record_id.
3. Verify program_contract_ref.
4. Verify requirement_matrix_ref.
5. Verify all boundary_contract_refs.
6. Verify release_candidate_completion_ref.
7. Verify evidence_pack_ref.
8. Verify review_gate_ref.
9. Verify review_gate_hash.
10. Verify review_gate_result.
11. Verify signer_ref.
12. Verify signer_authority_ref.
13. Verify signoff_scope_ref.
14. Verify signoff_criteria_ref.
15. Verify signoff_decision.
16. Build signoff_objection_register.
17. Build signoff_limitation_register.
18. Build residual_risk_register.
19. Verify boundary_flags.
20. Verify human_acceptance_state.
21. Compute signoff_hash.
22. Build signoff_audit_summary.
23. Classify signoff_result.
24. Record signoff_lifecycle_state.

No step may be skipped silently.

Unknown mandatory state fails closed.

Missing mandatory field produces SIGNOFF_NON_COMPLETED.

Boundary violation produces SIGNOFF_BLOCK_BOUNDARY_VIOLATION.

Missing signer authority produces SIGNOFF_DENY_SIGNER_AUTHORITY_MISSING.

Review Gate failure produces SIGNOFF_BLOCK_REVIEW_GATE_NOT_ACCEPTED unless the sign-off explicitly records rejection or block.

## 9. Canonical Sign-off Record fields

Every Sign-off Record must include:

- signoff_record_id
- signoff_record_version
- signoff_status
- signoff_result
- release_candidate_id
- release_candidate_version
- release_candidate_completion_ref
- evidence_pack_ref
- evidence_pack_hash
- review_gate_ref
- review_gate_hash
- review_gate_result
- review_finding_register_ref
- review_objection_register_ref
- review_gap_register_ref
- review_limitation_register_ref
- program_contract_ref
- requirement_matrix_ref
- authority_profile_contract_ref
- business_wallet_adapter_contract_ref
- canonical_evidence_model_contract_ref
- authorization_decision_contract_ref
- execution_boundary_contract_ref
- consequence_matrix_contract_ref
- release_candidate_completion_contract_ref
- release_candidate_evidence_pack_contract_ref
- release_candidate_review_gate_contract_ref
- p004_runtime_evidence_schema_ref
- p004_evidence_acceptance_gate_ref
- signer_ref
- signer_authority_ref
- signoff_scope_ref
- signoff_criteria_ref
- signoff_decision
- signoff_objection_register_ref
- signoff_limitation_register_ref
- residual_risk_register_ref
- signoff_audit_summary_ref
- signoff_hash
- human_acceptance_state
- boundary_flags
- created_at
- updated_at
- signed_at
- lifecycle_state

No Sign-off Record is valid without:

- signoff_record_id
- signoff_record_version
- signoff_status
- signoff_result
- release_candidate_id
- review_gate_ref
- review_gate_result
- signer_ref
- signer_authority_ref
- signoff_scope_ref
- signoff_criteria_ref
- signoff_decision
- signoff_objection_register_ref
- residual_risk_register_ref
- signoff_audit_summary_ref
- signoff_hash
- human_acceptance_state
- boundary_flags
- lifecycle_state

## 10. Canonical signer authority fields

Every signer authority record must include:

- signer_authority_id
- signer_authority_version
- signer_ref
- signer_type
- authority_scope
- authority_source_ref
- authority_start
- authority_end
- authority_status
- authority_limitations
- delegation_chain_ref
- audit_ref
- boundary_flags
- lifecycle_state

Allowed signer_type values:

- HUMAN
- ORGANIZATION
- COMMITTEE
- BOARD
- PROCESS_OWNER
- TECHNICAL_OWNER
- PRODUCT_OWNER
- SECURITY_OWNER
- COMPLIANCE_OWNER
- LEGAL_OWNER

Signer authority must be bounded.

Signer authority must preserve limitations.

Signer authority must not grant production deployment authority.

Signer authority must not grant OPC ALLOW.

Signer authority must not create legal certification.

## 11. Canonical sign-off scope fields

Every sign-off scope record must include:

- signoff_scope_id
- signoff_scope_version
- release_candidate_id
- review_gate_ref
- evidence_pack_ref
- included_requirement_refs
- included_test_refs
- included_evidence_refs
- included_audit_refs
- included_review_finding_refs
- included_review_objection_refs
- included_review_gap_refs
- included_review_limitation_refs
- excluded_refs
- exclusion_reason
- scope_limitations
- residual_risk_refs
- audit_ref
- boundary_flags
- lifecycle_state

Sign-off scope must preserve:

- included material
- excluded material
- exclusions
- exclusion reasons
- limitation scope
- residual risks
- known gaps
- known objections
- unknown mandatory states

A sign-off scope that excludes known mandatory objections without explanation is invalid.

A sign-off scope that excludes known residual risks without explanation is invalid.

## 12. Canonical sign-off criteria fields

Every sign-off criteria record must include:

- signoff_criteria_id
- signoff_criteria_version
- criteria_source_ref
- criteria_items
- mandatory_criteria
- optional_criteria
- criteria_accept_rules
- criteria_accept_with_limitations_rules
- criteria_reject_rules
- criteria_block_rules
- criteria_unknown_rules
- audit_ref
- boundary_flags
- lifecycle_state

Sign-off criteria must preserve:

- accepted criteria
- accepted-with-limitations criteria
- rejected criteria
- blocked criteria
- unknown criteria
- not evaluated criteria

Criteria acceptance does not imply production readiness.

Criteria acceptance does not imply deployment readiness.

Criteria acceptance does not imply legal certification.

## 13. Canonical sign-off decision fields

Every sign-off decision record must include:

- signoff_decision_id
- signoff_decision_version
- signoff_record_id
- decision_type
- decision_result
- decision_reason
- decision_basis_refs
- signer_ref
- signer_authority_ref
- limitation_scope
- residual_risk_refs
- objection_refs
- audit_ref
- boundary_flags
- lifecycle_state

Allowed decision_type values:

- ACCEPT
- ACCEPT_WITH_LIMITATIONS
- REJECT
- BLOCK
- NON_COMPLETED

Allowed decision_result values:

- SIGNOFF_ACCEPTED
- SIGNOFF_ACCEPTED_WITH_LIMITATIONS
- SIGNOFF_REJECTED
- SIGNOFF_BLOCKED
- SIGNOFF_NON_COMPLETED

Decision reason must be preserved.

Decision basis references must be preserved.

Decision does not authorize production deployment.

## 14. Canonical sign-off objection fields

Every sign-off objection record must include:

- signoff_objection_id
- signoff_objection_version
- signoff_record_id
- objection_type
- affected_artifact_ref
- affected_requirement_ref
- affected_test_ref
- affected_evidence_ref
- affected_audit_ref
- affected_review_finding_ref
- affected_review_objection_ref
- objection_reason
- objection_severity
- blocking_state
- remediation_required
- audit_ref
- boundary_flags
- lifecycle_state

Allowed objection_type values:

- REQUIREMENT_OBJECTION
- TEST_OBJECTION
- EVIDENCE_OBJECTION
- AUDIT_OBJECTION
- REVIEW_FINDING_OBJECTION
- REVIEW_OBJECTION_OBJECTION
- GAP_OBJECTION
- LIMITATION_OBJECTION
- RESIDUAL_RISK_OBJECTION
- AUTHORITY_OBJECTION
- HUMAN_ACCEPTANCE_OBJECTION
- BOUNDARY_OBJECTION
- UNKNOWN_STATE_OBJECTION

A blocking objection prevents unqualified sign-off acceptance.

A hidden objection invalidates sign-off acceptance.

An objection cannot be erased by signer authority.

An objection cannot be erased by human acceptance.

## 15. Canonical residual risk fields

Every residual risk record must include:

- residual_risk_id
- residual_risk_version
- signoff_record_id
- risk_type
- source_ref
- affected_artifact_ref
- affected_requirement_ref
- affected_test_ref
- affected_evidence_ref
- affected_audit_ref
- risk_reason
- risk_severity
- accepted_state
- limitation_scope
- mitigation_ref
- audit_ref
- boundary_flags
- lifecycle_state

Residual risks must preserve:

- source Evidence Pack limitations
- source Review Gate limitations
- known unresolved conditions
- accepted-with-limitations risks
- rejected risks
- blocked risks
- unknown state risks

Residual risk acceptance does not remove the risk.

Residual risk acceptance does not create production readiness.

## 16. Status values

Allowed signoff_status values:

- DRAFT
- RECEIVED
- EVALUATING
- SIGNER_AUTHORITY_CHECKED
- SIGNOFF_SCOPE_CHECKED
- SIGNOFF_CRITERIA_CHECKED
- REVIEW_GATE_CHECKED
- OBJECTIONS_CREATED
- LIMITATIONS_CREATED
- RESIDUAL_RISKS_CREATED
- HUMAN_ACCEPTANCE_PENDING
- SIGNOFF_ACCEPTED
- SIGNOFF_ACCEPTED_WITH_LIMITATIONS
- BLOCKED
- REJECTED
- NON_COMPLETED
- ARCHIVED
- REVOKED

Default signoff_status:

DRAFT

No signoff_status authorizes production deployment.

No signoff_status authorizes production readiness.

No signoff_status authorizes OPC ALLOW.

No signoff_status creates legal certification.

## 17. Result values

Allowed signoff_result values:

- NOT_EVALUATED
- SIGNOFF_ACCEPTED
- SIGNOFF_ACCEPTED_WITH_LIMITATIONS
- SIGNOFF_DENY_REVIEW_GATE_MISSING
- SIGNOFF_DENY_REVIEW_GATE_HASH_MISSING
- SIGNOFF_DENY_REVIEW_GATE_HASH_MISMATCH
- SIGNOFF_BLOCK_REVIEW_GATE_NOT_ACCEPTED
- SIGNOFF_DENY_SIGNER_MISSING
- SIGNOFF_DENY_SIGNER_AUTHORITY_MISSING
- SIGNOFF_DENY_SIGNER_AUTHORITY_INVALID
- SIGNOFF_DENY_SIGNOFF_SCOPE_MISSING
- SIGNOFF_DENY_SIGNOFF_CRITERIA_MISSING
- SIGNOFF_DENY_SIGNOFF_DECISION_MISSING
- SIGNOFF_DENY_OBJECTION_REGISTER_MISSING
- SIGNOFF_DENY_RESIDUAL_RISK_REGISTER_MISSING
- SIGNOFF_DENY_AUDIT_SUMMARY_MISSING
- SIGNOFF_DENY_HUMAN_ACCEPTANCE_PENDING
- SIGNOFF_REJECTED_BY_HUMAN
- SIGNOFF_BLOCK_BOUNDARY_VIOLATION
- SIGNOFF_BLOCK_BLOCKING_OBJECTION
- SIGNOFF_BLOCK_HIDDEN_RISK
- SIGNOFF_BLOCK_UNKNOWN_STATE
- SIGNOFF_NON_COMPLETED

Default signoff_result:

NOT_EVALUATED

Unknown review gate state fails closed.

Unknown signer authority state fails closed.

Unknown sign-off scope state fails closed.

Unknown sign-off criteria state fails closed.

Unknown decision state fails closed.

Unknown objection state fails closed.

Unknown residual risk state fails closed.

Unknown boundary state fails closed.

Unknown human acceptance state fails closed.

## 18. Sign-off item states

Allowed signoff_item_state values:

- NOT_EVALUATED
- SIGNED
- SIGNED_WITH_LIMITATIONS
- FAILED_SIGNOFF
- BLOCKED
- REJECTED
- NON_COMPLETED
- UNKNOWN

Only SIGNED can support unqualified sign-off acceptance.

SIGNED_WITH_LIMITATIONS can support limited sign-off acceptance.

FAILED_SIGNOFF blocks unqualified sign-off acceptance.

BLOCKED blocks sign-off acceptance.

REJECTED rejects sign-off acceptance.

NON_COMPLETED prevents sign-off acceptance.

UNKNOWN fails closed.

## 19. Human acceptance states

Allowed human_acceptance_state values:

- PENDING
- ACCEPTED
- ACCEPTED_WITH_LIMITATIONS
- REJECTED
- BLOCKED

Default human_acceptance_state:

PENDING

Sign-off Record with human_acceptance_state PENDING remains NON_COMPLETED.

Sign-off Record with human_acceptance_state REJECTED is REJECTED.

Human acceptance cannot override:

- missing Review Gate reference
- missing Review Gate hash
- Review Gate hash mismatch
- Review Gate not accepted
- missing signer identity
- missing signer authority
- invalid signer authority
- missing sign-off scope
- missing sign-off criteria
- missing sign-off decision
- missing objection register
- missing residual risk register
- missing audit summary
- blocking objection
- hidden risk
- unknown mandatory state
- boundary violations
- production deployment boundary
- OPC ALLOW boundary
- legal certification boundary

## 20. Mandatory boundary flags

Every Sign-off Record must include:

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

If any boundary flag is missing, the Sign-off Record is NON_COMPLETED.

If any boundary flag is true, the Sign-off Record is BLOCKED unless a future explicit contract permits it.

No such permission exists in this contract.

## 21. Minimum Sign-off Record schema

The minimum Sign-off Record structure is:

signoff_record_id:
  type: string
  required: true

signoff_record_version:
  type: string
  required: true

signoff_status:
  type: enum
  required: true

signoff_result:
  type: enum
  required: true

release_candidate_id:
  type: string
  required: true

release_candidate_version:
  type: string
  required: true

release_candidate_completion_ref:
  type: string
  required: true

evidence_pack_ref:
  type: string
  required: true

review_gate_ref:
  type: string
  required: true

review_gate_hash:
  type: string
  required: true

review_gate_result:
  type: enum
  required: true

program_contract_ref:
  type: string
  required: true

requirement_matrix_ref:
  type: string
  required: true

boundary_contract_refs:
  type: array
  required: true

p004_runtime_evidence_schema_ref:
  type: string
  required: true

p004_evidence_acceptance_gate_ref:
  type: string
  required: true

signer_ref:
  type: string
  required: true

signer_authority_ref:
  type: string
  required: true

signoff_scope_ref:
  type: string
  required: true

signoff_criteria_ref:
  type: string
  required: true

signoff_decision:
  type: object
  required: true

signoff_objection_register_ref:
  type: string
  required: true

residual_risk_register_ref:
  type: string
  required: true

signoff_audit_summary_ref:
  type: string
  required: true

signoff_hash:
  type: string
  required: true

human_acceptance_state:
  type: enum
  required: true

boundary_flags:
  type: object
  required: true

lifecycle_state:
  type: enum
  required: true

## 22. Sign-off Record prerequisites

Sign-off Record evaluation requires:

- Release Candidate completion reference
- Evidence Pack reference
- Review Gate reference
- Review Gate hash
- Review Gate result
- program contract reference
- requirement matrix reference
- boundary contract references
- P004 runtime evidence schema reference
- P004 evidence acceptance gate reference
- signer reference
- signer authority reference
- sign-off scope reference
- sign-off criteria reference
- sign-off decision
- sign-off objection register reference
- residual risk register reference
- sign-off audit summary reference
- sign-off hash
- boundary flags
- human acceptance state
- lifecycle state

If Review Gate reference is missing, result is SIGNOFF_DENY_REVIEW_GATE_MISSING.

If Review Gate hash is missing, result is SIGNOFF_DENY_REVIEW_GATE_HASH_MISSING.

If Review Gate hash mismatches, result is SIGNOFF_DENY_REVIEW_GATE_HASH_MISMATCH.

If Review Gate is not accepted or accepted with limitations, result is SIGNOFF_BLOCK_REVIEW_GATE_NOT_ACCEPTED unless the sign-off records rejection or block.

If signer is missing, result is SIGNOFF_DENY_SIGNER_MISSING.

If signer authority is missing, result is SIGNOFF_DENY_SIGNER_AUTHORITY_MISSING.

If signer authority is invalid, result is SIGNOFF_DENY_SIGNER_AUTHORITY_INVALID.

If sign-off scope is missing, result is SIGNOFF_DENY_SIGNOFF_SCOPE_MISSING.

If sign-off criteria are missing, result is SIGNOFF_DENY_SIGNOFF_CRITERIA_MISSING.

If sign-off decision is missing, result is SIGNOFF_DENY_SIGNOFF_DECISION_MISSING.

If objection register is missing, result is SIGNOFF_DENY_OBJECTION_REGISTER_MISSING.

If residual risk register is missing, result is SIGNOFF_DENY_RESIDUAL_RISK_REGISTER_MISSING.

If audit summary is missing, result is SIGNOFF_DENY_AUDIT_SUMMARY_MISSING.

If human acceptance is pending, result is SIGNOFF_DENY_HUMAN_ACCEPTANCE_PENDING.

If boundary flag is violated, result is SIGNOFF_BLOCK_BOUNDARY_VIOLATION.

## 23. Sign-off Record evaluation algorithm

Sign-off Record evaluation must follow this order:

1. Receive Sign-off Record request.
2. Assign signoff_record_id.
3. Verify release_candidate_completion_ref.
4. Verify evidence_pack_ref.
5. Verify review_gate_ref.
6. Verify review_gate_hash.
7. Verify review_gate_result.
8. Verify program_contract_ref.
9. Verify requirement_matrix_ref.
10. Verify boundary_contract_refs.
11. Verify p004_runtime_evidence_schema_ref.
12. Verify p004_evidence_acceptance_gate_ref.
13. Verify signer_ref.
14. Verify signer_authority_ref.
15. Evaluate signer authority.
16. Verify signoff_scope_ref.
17. Evaluate sign-off scope.
18. Verify signoff_criteria_ref.
19. Evaluate sign-off criteria.
20. Verify signoff_decision.
21. Build signoff_objection_register.
22. Validate signoff_objection_register.
23. Build signoff_limitation_register.
24. Build residual_risk_register.
25. Validate residual_risk_register.
26. Verify boundary_flags.
27. Verify human_acceptance_state.
28. Compute signoff_hash.
29. Verify signoff_hash.
30. Build signoff_audit_summary.
31. Classify signoff_result.
32. Record lifecycle_state.
33. Produce Sign-off Record.

No step may be skipped silently.

Unknown mandatory state fails closed.

Missing mandatory field produces SIGNOFF_NON_COMPLETED.

Boundary violation produces SIGNOFF_BLOCK_BOUNDARY_VIOLATION.

Blocking objection produces SIGNOFF_BLOCK_BLOCKING_OBJECTION.

Hidden risk produces SIGNOFF_BLOCK_HIDDEN_RISK.

## 24. Positive sign-off path

A positive Sign-off Record path requires:

- Release Candidate completion reference present
- Evidence Pack reference present
- Review Gate reference present
- Review Gate hash valid
- Review Gate result accepted or accepted with limitations
- program contract present
- requirement matrix present
- all required boundary contracts present
- P004 references present
- signer identity present
- signer authority valid
- sign-off scope present
- sign-off criteria present
- sign-off decision present
- objection register present
- residual risk register present
- audit summary present
- sign-off hash valid
- boundary flags false
- no blocking objections
- no hidden risks
- human acceptance ACCEPTED
- lifecycle state signed

Positive sign-off may produce:

SIGNOFF_ACCEPTED

or:

SIGNOFF_ACCEPTED_WITH_LIMITATIONS

Positive sign-off remains documentary.

Positive sign-off does not authorize production deployment.

Positive sign-off does not authorize production readiness.

Positive sign-off does not authorize deployment readiness.

Positive sign-off does not authorize OPC ALLOW.

Positive sign-off does not create legal certification.

## 25. Limited sign-off path

Sign-off Record may be accepted with limitations when:

- all mandatory sign-off structures are present
- signer authority is valid
- limitation refs are present
- residual risks are present
- limitation scope is documented
- no boundary violation exists
- no unacknowledged blocking objection exists
- limitations are preserved in the Sign-off Record
- residual risks are preserved in the Sign-off Record
- human acceptance explicitly accepts the limited sign-off state

Limited sign-off produces:

SIGNOFF_ACCEPTED_WITH_LIMITATIONS

Limited sign-off must preserve limitation_scope.

Limited sign-off must preserve residual_risk_register_ref.

Limited sign-off must preserve signoff_objection_register_ref.

Limited sign-off does not authorize production deployment.

Limited sign-off does not erase limitations.

Limited sign-off does not erase residual risks.

## 26. Negative sign-off paths

The following negative sign-off paths must be supported:

- missing Review Gate reference
- missing Review Gate hash
- Review Gate hash mismatch
- Review Gate not accepted
- missing Release Candidate completion reference
- missing Evidence Pack reference
- missing program contract reference
- missing requirement matrix reference
- missing boundary contract reference
- missing P004 reference
- missing signer identity
- missing signer authority
- invalid signer authority
- missing sign-off scope
- invalid sign-off scope
- missing sign-off criteria
- invalid sign-off criteria
- missing sign-off decision
- invalid sign-off decision
- missing objection register
- blocking objection
- missing residual risk register
- hidden residual risk
- missing sign-off hash
- sign-off hash mismatch
- missing audit summary
- human acceptance pending
- human acceptance rejected
- boundary flag violation
- unknown mandatory state
- lifecycle state missing

Each negative path must preserve the reason.

Each negative path must be auditable.

Each negative path must preserve source references when available.

Each negative path must preserve review references when available.

Each negative path must preserve objection references.

Each negative path must preserve residual risk references.

Each negative path must not authorize production deployment.

## 27. Evidence relationship

Sign-off Record must preserve Evidence Pack evidence relationships.

Sign-off Record must not alter source evidence.

Sign-off Record must not accept rejected evidence as accepted evidence.

Sign-off Record must not accept revoked evidence as accepted evidence.

Sign-off Record must not accept blocked evidence as accepted evidence.

Sign-off Record must not accept non-completed evidence as complete evidence.

Sign-off decision basis must reference evidence when evidence supports or challenges the sign-off.

Sign-off objections must reference evidence when evidence supports or challenges the objection.

Evidence absence must remain visible.

Evidence limitations must remain visible.

## 28. Audit relationship

Sign-off Record must be audit-bound.

Sign-off audit summary must preserve:

- signoff_record_id
- release_candidate_id
- release_candidate_completion reference
- evidence pack reference
- evidence pack hash
- review gate reference
- review gate hash
- review gate result
- signer reference
- signer authority reference
- sign-off scope reference
- sign-off criteria reference
- sign-off decision
- objection register reference
- residual risk register reference
- sign-off result
- sign-off hash
- human acceptance state
- boundary flags
- lifecycle state

Missing audit summary produces SIGNOFF_DENY_AUDIT_SUMMARY_MISSING.

Audit summary does not imply approval beyond the Sign-off Record.

Audit summary does not imply production readiness.

Audit summary does not imply legal certification.

## 29. Release Candidate Review Gate relationship

Sign-off Record must consume:

HBCE_RELEASE_CANDIDATE_REVIEW_GATE_CONTRACT.md

Sign-off Record records acceptance, acceptance with limitations, rejection, block or non-completion after Review Gate evaluation.

Sign-off Record does not create Review Gate acceptance.

Sign-off Record does not override Review Gate failure.

Sign-off Record does not convert non-completed Review Gate state into completed state.

Review Gate reference missing blocks Sign-off Record evaluation.

Review Gate hash mismatch blocks Sign-off Record evaluation.

Review Gate boundary violation blocks Sign-off Record evaluation.

## 30. Release Candidate Evidence Pack relationship

Sign-off Record must preserve:

HBCE_RELEASE_CANDIDATE_EVIDENCE_PACK_CONTRACT.md

Sign-off Record does not create Evidence Pack.

Sign-off Record does not override Evidence Pack failure.

Sign-off Record does not convert non-completed Evidence Pack state into completed state.

Evidence Pack reference missing blocks Sign-off Record evaluation.

## 31. Boundary contract relationships

Sign-off Record must preserve the following boundary contracts:

- HBCE_AUTHORITY_PROFILE_CONTRACT.md
- HBCE_BUSINESS_WALLET_ADAPTER_CONTRACT.md
- HBCE_CANONICAL_EVIDENCE_MODEL_CONTRACT.md
- HBCE_AUTHORIZATION_DECISION_CONTRACT.md
- HBCE_EXECUTION_BOUNDARY_CONTRACT.md
- HBCE_CONSEQUENCE_MATRIX_CONTRACT.md
- HBCE_RELEASE_CANDIDATE_COMPLETION_CONTRACT.md
- HBCE_RELEASE_CANDIDATE_EVIDENCE_PACK_CONTRACT.md
- HBCE_RELEASE_CANDIDATE_REVIEW_GATE_CONTRACT.md

Sign-off Record must not collapse boundaries.

Authority Profile PASS is not Sign-off acceptance.

Business Wallet Adapter PASS is not Sign-off acceptance.

Evidence Acceptance is not Sign-off acceptance.

Authorization PASS is not Sign-off acceptance.

Decision PASS is not Sign-off acceptance.

Execution PASS is not Sign-off acceptance.

MATRIX update is not Sign-off acceptance.

Release Candidate completion is not Sign-off acceptance.

Evidence Pack packaging is not Sign-off acceptance.

Review Gate acceptance is not Sign-off acceptance by itself.

## 32. P004 relationship

P004 remains the evidence governance baseline.

Sign-off Record must preserve P004-compatible evidence references.

P004 acceptance gate is an input to Sign-off Record evaluation.

P004 acceptance gate is not Sign-off acceptance.

P004 non-completion blocks Sign-off acceptance when mandatory evidence depends on it.

P004 rejected evidence cannot support unqualified Sign-off acceptance.

## 33. Golden Demo relationship

Sign-off Record must include or reference Golden Demo records showing:

- positive chain path
- negative chain path
- evidence acceptance path
- evidence rejection path
- Evidence Pack review path
- Review Gate acceptance path
- signer authority handling
- sign-off scope handling
- sign-off criteria handling
- objection handling
- residual risk handling
- human acceptance handling
- non-completion handling
- no production deployment claim
- no OPC ALLOW claim
- no legal certification claim
- no L3 readiness claim

Golden Demo PASS does not create Sign-off acceptance by itself.

Golden Demo missing blocks Sign-off acceptance when required by scope.

Golden Demo limitations must be preserved.

## 34. /release-candidate/signoff-record API minimum contract

The /release-candidate/signoff-record API family must support the following conceptual operations:

- create Sign-off Record request
- evaluate Sign-off Record
- retrieve Sign-off Record
- retrieve signer authority record
- retrieve sign-off scope record
- retrieve sign-off criteria record
- retrieve sign-off decision
- retrieve sign-off objection register
- retrieve sign-off limitation register
- retrieve residual risk register
- retrieve sign-off audit summary
- retrieve sign-off hash
- classify accepted sign-off
- classify limited sign-off
- classify blocked sign-off
- classify rejected sign-off
- mark non-completed sign-off
- archive Sign-off Record
- revoke Sign-off Record when applicable

This document does not implement the API.

This document defines minimum API obligations for future implementation.

## 35. /release-candidate/signoff-record request minimum fields

A /release-candidate/signoff-record request must include:

- request_id
- release_candidate_id
- release_candidate_version
- release_candidate_completion_ref
- evidence_pack_ref
- evidence_pack_hash
- review_gate_ref
- review_gate_hash
- review_gate_result
- program_contract_ref
- requirement_matrix_ref
- boundary_contract_refs
- p004_runtime_evidence_schema_ref
- p004_evidence_acceptance_gate_ref
- signer_ref
- signer_authority_ref
- signoff_scope_ref
- signoff_criteria_ref
- signoff_decision
- boundary_flags
- human_acceptance_state
- lifecycle_state

Missing request_id blocks the request.

Missing review_gate_ref blocks the request.

Missing review_gate_hash blocks the request.

Missing signer_ref blocks the request.

Missing signer_authority_ref blocks the request.

Missing signoff_scope_ref blocks the request.

Missing signoff_criteria_ref blocks the request.

Missing signoff_decision blocks the request.

Missing boundary_flags blocks the request.

Missing human_acceptance_state blocks the request.

## 36. /release-candidate/signoff-record response minimum fields

A /release-candidate/signoff-record response must include:

- request_id
- signoff_record_id
- signoff_status
- signoff_result
- release_candidate_id
- evidence_pack_ref
- review_gate_ref
- review_gate_hash
- review_gate_result
- signer_ref
- signer_authority_ref
- signoff_scope_ref
- signoff_criteria_ref
- signoff_decision
- signoff_objection_register_ref
- residual_risk_register_ref
- signoff_audit_summary_ref
- signoff_hash
- human_acceptance_state
- boundary_flags
- lifecycle_state

A response without signoff_result is invalid.

A response without signoff_hash is NON_COMPLETED.

A response without signoff_objection_register_ref is NON_COMPLETED.

A response without residual_risk_register_ref is NON_COMPLETED.

A response with signoff_result SIGNOFF_ACCEPTED does not authorize production deployment.

## 37. Error model

Allowed Release Candidate Sign-off Record error classes:

- RCSR_REQUEST_INVALID
- RCSR_REVIEW_GATE_MISSING
- RCSR_REVIEW_GATE_HASH_MISSING
- RCSR_REVIEW_GATE_HASH_MISMATCH
- RCSR_REVIEW_GATE_NOT_ACCEPTED
- RCSR_COMPLETION_REF_MISSING
- RCSR_EVIDENCE_PACK_MISSING
- RCSR_PROGRAM_CONTRACT_MISSING
- RCSR_REQUIREMENT_MATRIX_MISSING
- RCSR_BOUNDARY_CONTRACT_MISSING
- RCSR_P004_REFERENCE_MISSING
- RCSR_SIGNER_MISSING
- RCSR_SIGNER_AUTHORITY_MISSING
- RCSR_SIGNER_AUTHORITY_INVALID
- RCSR_SIGNOFF_SCOPE_MISSING
- RCSR_SIGNOFF_SCOPE_INVALID
- RCSR_SIGNOFF_CRITERIA_MISSING
- RCSR_SIGNOFF_CRITERIA_INVALID
- RCSR_SIGNOFF_DECISION_MISSING
- RCSR_SIGNOFF_DECISION_INVALID
- RCSR_OBJECTION_REGISTER_MISSING
- RCSR_BLOCKING_OBJECTION
- RCSR_RESIDUAL_RISK_REGISTER_MISSING
- RCSR_HIDDEN_RESIDUAL_RISK
- RCSR_SIGNOFF_HASH_MISSING
- RCSR_SIGNOFF_HASH_MISMATCH
- RCSR_AUDIT_SUMMARY_MISSING
- RCSR_BOUNDARY_FLAGS_MISSING
- RCSR_BOUNDARY_BLOCKED
- RCSR_HUMAN_ACCEPTANCE_PENDING
- RCSR_HUMAN_ACCEPTANCE_REJECTED
- RCSR_LIFECYCLE_STATE_MISSING
- RCSR_UNKNOWN_STATE
- RCSR_NON_COMPLETED

Error responses must be evidence-linked when possible.

Error responses must be auditable.

Error responses must preserve source references.

Error responses must preserve review references.

Error responses must preserve objection references.

Error responses must preserve residual risk references.

Error responses must not authorize production deployment.

## 38. Required tests

### HBCE-RCSR-TST-001 - Valid Sign-off acceptance

Expected result:

Complete Review Gate reference, valid Review Gate hash, accepted Review Gate result, signer identity, signer authority, sign-off scope, criteria, decision, objections, residual risk register, audit summary, boundary flags and accepted human state produce SIGNOFF_ACCEPTED.

### HBCE-RCSR-TST-002 - Valid limited Sign-off acceptance

Expected result:

Documented limitations and residual risks with explicit limited human acceptance produce SIGNOFF_ACCEPTED_WITH_LIMITATIONS.

### HBCE-RCSR-TST-003 - Missing Review Gate reference

Expected result:

Sign-off returns SIGNOFF_DENY_REVIEW_GATE_MISSING.

### HBCE-RCSR-TST-004 - Missing Review Gate hash

Expected result:

Sign-off returns SIGNOFF_DENY_REVIEW_GATE_HASH_MISSING.

### HBCE-RCSR-TST-005 - Review Gate hash mismatch

Expected result:

Sign-off returns SIGNOFF_DENY_REVIEW_GATE_HASH_MISMATCH.

### HBCE-RCSR-TST-006 - Review Gate not accepted

Expected result:

Sign-off returns SIGNOFF_BLOCK_REVIEW_GATE_NOT_ACCEPTED unless the sign-off decision explicitly records rejection or block.

### HBCE-RCSR-TST-007 - Missing signer authority

Expected result:

Sign-off returns SIGNOFF_DENY_SIGNER_AUTHORITY_MISSING.

### HBCE-RCSR-TST-008 - Invalid signer authority

Expected result:

Sign-off returns SIGNOFF_DENY_SIGNER_AUTHORITY_INVALID.

### HBCE-RCSR-TST-009 - Missing sign-off scope

Expected result:

Sign-off returns SIGNOFF_DENY_SIGNOFF_SCOPE_MISSING.

### HBCE-RCSR-TST-010 - Missing sign-off criteria

Expected result:

Sign-off returns SIGNOFF_DENY_SIGNOFF_CRITERIA_MISSING.

### HBCE-RCSR-TST-011 - Missing sign-off decision

Expected result:

Sign-off returns SIGNOFF_DENY_SIGNOFF_DECISION_MISSING.

### HBCE-RCSR-TST-012 - Missing objections register

Expected result:

Sign-off returns SIGNOFF_DENY_OBJECTION_REGISTER_MISSING.

### HBCE-RCSR-TST-013 - Blocking objection

Expected result:

Sign-off returns SIGNOFF_BLOCK_BLOCKING_OBJECTION.

### HBCE-RCSR-TST-014 - Missing residual risk register

Expected result:

Sign-off returns SIGNOFF_DENY_RESIDUAL_RISK_REGISTER_MISSING.

### HBCE-RCSR-TST-015 - Hidden residual risk

Expected result:

Sign-off returns SIGNOFF_BLOCK_HIDDEN_RISK.

### HBCE-RCSR-TST-016 - Missing audit summary

Expected result:

Sign-off returns SIGNOFF_DENY_AUDIT_SUMMARY_MISSING.

### HBCE-RCSR-TST-017 - Boundary flag violation

Expected result:

Sign-off returns SIGNOFF_BLOCK_BOUNDARY_VIOLATION.

### HBCE-RCSR-TST-018 - Human acceptance pending

Expected result:

Sign-off remains SIGNOFF_NON_COMPLETED.

### HBCE-RCSR-TST-019 - Human acceptance rejected

Expected result:

Sign-off returns SIGNOFF_REJECTED_BY_HUMAN.

### HBCE-RCSR-TST-020 - Unknown mandatory state

Expected result:

Sign-off returns SIGNOFF_BLOCK_UNKNOWN_STATE.

### HBCE-RCSR-TST-021 - Sign-off acceptance does not authorize production deployment

Expected result:

production_deployment remains false.

### HBCE-RCSR-TST-022 - Sign-off acceptance does not authorize OPC ALLOW

Expected result:

opc_allow remains false.

### HBCE-RCSR-TST-023 - Sign-off acceptance does not create legal certification

Expected result:

legal_certification remains false.

### HBCE-RCSR-TST-024 - Sign-off acceptance does not imply L3 readiness

Expected result:

l3_readiness remains false.

## 39. Required evidence artifacts

The following evidence artifacts must be produced or planned:

- HBCE-EVD-RCSR-001-VALID-SIGNOFF-ACCEPTANCE
- HBCE-EVD-RCSR-002-VALID-LIMITED-SIGNOFF-ACCEPTANCE
- HBCE-EVD-RCSR-003-MISSING-REVIEW-GATE-REF
- HBCE-EVD-RCSR-004-MISSING-REVIEW-GATE-HASH
- HBCE-EVD-RCSR-005-REVIEW-GATE-HASH-MISMATCH
- HBCE-EVD-RCSR-006-REVIEW-GATE-NOT-ACCEPTED
- HBCE-EVD-RCSR-007-MISSING-SIGNER-AUTHORITY
- HBCE-EVD-RCSR-008-INVALID-SIGNER-AUTHORITY
- HBCE-EVD-RCSR-009-MISSING-SIGNOFF-SCOPE
- HBCE-EVD-RCSR-010-MISSING-SIGNOFF-CRITERIA
- HBCE-EVD-RCSR-011-MISSING-SIGNOFF-DECISION
- HBCE-EVD-RCSR-012-MISSING-OBJECTIONS
- HBCE-EVD-RCSR-013-BLOCKING-OBJECTION
- HBCE-EVD-RCSR-014-MISSING-RESIDUAL-RISK-REGISTER
- HBCE-EVD-RCSR-015-HIDDEN-RESIDUAL-RISK
- HBCE-EVD-RCSR-016-MISSING-AUDIT-SUMMARY
- HBCE-EVD-RCSR-017-BOUNDARY-FLAG-VIOLATION
- HBCE-EVD-RCSR-018-HUMAN-ACCEPTANCE-PENDING
- HBCE-EVD-RCSR-019-HUMAN-ACCEPTANCE-REJECTED
- HBCE-EVD-RCSR-020-UNKNOWN-MANDATORY-STATE
- HBCE-EVD-RCSR-021-NO-PRODUCTION-DEPLOYMENT
- HBCE-EVD-RCSR-022-NO-OPC-ALLOW
- HBCE-EVD-RCSR-023-NO-LEGAL-CERTIFICATION
- HBCE-EVD-RCSR-024-NO-L3-READINESS

Evidence artifacts must be compatible with P004.

Evidence artifacts must comply with the Canonical Evidence Model.

Evidence artifacts must include hash references.

Evidence artifacts must include audit references.

Evidence artifacts must include boundary flags.

Evidence artifacts must include lifecycle state.

## 40. Golden Demo Sign-off Record obligations

Golden Demo must demonstrate:

- valid Sign-off acceptance
- valid limited Sign-off acceptance
- missing Review Gate reference denial
- missing Review Gate hash denial
- Review Gate hash mismatch denial
- Review Gate not accepted block
- missing signer authority denial
- invalid signer authority denial
- missing sign-off scope denial
- missing sign-off criteria denial
- missing sign-off decision denial
- missing objections denial
- blocking objection block
- missing residual risk register denial
- hidden residual risk block
- missing audit summary denial
- boundary violation block
- human acceptance pending non-completion
- human acceptance rejected
- unknown mandatory state block
- Sign-off acceptance does not authorize production deployment
- Sign-off acceptance does not authorize OPC ALLOW
- Sign-off acceptance does not create legal certification
- Sign-off acceptance does not imply L3 readiness

Golden Demo must preserve:

- Authority Profile boundary
- Business Wallet Adapter boundary
- Canonical Evidence Model boundary
- Authorization Decision boundary
- Execution Boundary separation
- Consequence Matrix separation
- Release Candidate Completion boundary
- Evidence Pack boundary
- Review Gate boundary
- Sign-off Record boundary
- P004 evidence governance boundary
- human acceptance boundary

## 41. Completion rule

The Release Candidate Sign-off Record Contract remains PREPARED_FOR_REVIEW until:

- human review is completed
- source contract references are confirmed
- requirement matrix reference is confirmed
- Review Gate relationship is confirmed
- Evidence Pack relationship is confirmed
- Release Candidate Completion relationship is confirmed
- P004 relationship is confirmed
- Canonical Evidence Model relationship is confirmed
- signer authority rules are confirmed
- sign-off scope rules are confirmed
- sign-off criteria rules are confirmed
- sign-off decision rules are confirmed
- objection register rules are confirmed
- residual risk rules are confirmed
- sign-off hash rules are confirmed
- audit summary rules are confirmed
- tests are derived
- evidence artifacts are planned
- API contract alignment is prepared
- human acceptance is recorded

A future implementation is complete only when:

- implementation exists
- Sign-off Record schema tests PASS
- signer authority tests PASS
- sign-off scope tests PASS
- sign-off criteria tests PASS
- sign-off decision tests PASS
- objection register tests PASS
- residual risk tests PASS
- sign-off hash tests PASS
- audit summary tests PASS
- Golden Demo Sign-off Record tests PASS
- negative control tests PASS
- boundary tests PASS
- human acceptance tests PASS
- evidence artifacts exist
- evidence hashes exist
- audit references exist
- documentation is updated
- integration is verified
- human acceptance is ACCEPTED

Until then:

NON_COMPLETED

## 42. Immediate next derivations

This document requires the following future derivations:

1. Sign-off Record JSON schema
2. Signer authority schema
3. Sign-off scope schema
4. Sign-off criteria schema
5. Sign-off decision schema
6. Sign-off objection register schema
7. Residual risk register schema
8. Sign-off audit summary schema
9. Sign-off Record evaluation tests
10. Sign-off Record Golden Demo fixtures
11. Sign-off Record negative control fixtures
12. Sign-off Record human acceptance fixtures
13. /release-candidate/signoff-record API contract section

Recommended next repository document:

HBCE_RELEASE_CANDIDATE_DEPLOYMENT_AUTHORIZATION_CONTRACT.md

Reason:

After the Sign-off Record is defined, the next missing program-level boundary is deployment authorization. Deployment authorization must remain separate from sign-off, review, Evidence Pack validity, Release Candidate completion, OPC ALLOW and legal certification.

## 43. Operational meaning

This document defines how HBCE records sign-off over Release Candidate review output.

It prevents Sign-off Record acceptance from being treated as production deployment.

It prevents Sign-off Record acceptance from being treated as production readiness.

It prevents Sign-off Record acceptance from being treated as deployment readiness.

It prevents Sign-off Record acceptance from being treated as L3 readiness.

It prevents Sign-off Record acceptance from being treated as OPC ALLOW.

It prevents Sign-off Record acceptance from being treated as legal certification.

It prevents signer authority from being treated as production authority.

It prevents signer identity from being treated as signer authority.

It prevents Review Gate acceptance from being treated as Sign-off acceptance.

It prevents Sign-off Audit Summary from being treated as approval beyond the sign-off record.

It prevents Sign-off Hash from being treated as truth.

It prevents no objection from being treated as accepted sign-off.

It prevents residual risk acceptance from being treated as risk removal.

It requires signer authority.

It requires sign-off scope.

It requires sign-off criteria.

It requires sign-off decision.

It requires objection register.

It requires residual risk register.

It requires audit binding.

It requires boundary flags.

It requires human acceptance.

It preserves negative outcomes.

It preserves objections.

It preserves residual risks.

It preserves hidden risks.

It preserves limitations.

It preserves P004 as the evidence governance baseline.

It preserves the V3 contract as the program-level contract.

It preserves the 2027 matrix as the requirement-to-test-to-evidence control layer.

It preserves the Authority Profile Contract as the authority evaluation boundary.

It preserves the Business Wallet Adapter Contract as the external material ingestion boundary.

It preserves the Canonical Evidence Model Contract as the cross-component evidence structure.

It preserves the Authorization Decision Contract as the authority-to-decision boundary.

It preserves the Execution Boundary Contract as the decision-to-execution boundary.

It preserves the Consequence Matrix Contract as the execution-evidence-to-MATRIX boundary.

It preserves the Release Candidate Completion Contract as the completion boundary.

It preserves the Release Candidate Evidence Pack Contract as the evidence pack boundary.

It preserves the Release Candidate Review Gate Contract as the review boundary.

It does not implement runtime behavior.

It does not authorize production deployment.

It does not authorize production readiness.

It does not authorize deployment readiness.

It does not authorize L3 readiness.

It does not authorize PostgreSQL runtime readiness or execution.

It does not authorize P04/P05 concurrency execution.

It does not authorize OPC ALLOW.

It does not provide legal certification, eIDAS qualification or regulated KYC/AML provider status.

## 44. Document state

Document state:

PREPARED_FOR_REVIEW

Human acceptance state:

PENDING
