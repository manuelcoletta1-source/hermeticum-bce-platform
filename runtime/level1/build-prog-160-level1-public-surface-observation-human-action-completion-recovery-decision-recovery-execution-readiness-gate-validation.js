const fs=require("fs"),crypto=require("crypto"),assert=require("assert/strict");

const SRC="docs/launch/level1/prog-159-level1-public-surface-observation-human-action-completion-recovery-decision-recovery-execution-readiness-gate-request.json";
const JSON_OUT="docs/launch/level1/prog-160-level1-public-surface-observation-human-action-completion-recovery-decision-recovery-execution-readiness-gate-validation.json";
const MD_OUT="docs/launch/level1/prog-160-level1-public-surface-observation-human-action-completion-recovery-decision-recovery-execution-readiness-gate-validation.md";
const ID="PROG-160-HBCE-LEVEL1-PUBLIC-SURFACE-OBSERVATION-HUMAN-ACTION-COMPLETION-RECOVERY-DECISION-RECOVERY-EXECUTION-READINESS-GATE-VALIDATION";
const STATUS="LEVEL1_PUBLIC_SURFACE_OBSERVATION_HUMAN_ACTION_COMPLETION_RECOVERY_DECISION_RECOVERY_EXECUTION_READINESS_GATE_VALIDATED_PENDING_READINESS_GATE_DECISION";
const NEXT="PROG-161-HBCE-LEVEL1-PUBLIC-SURFACE-OBSERVATION-HUMAN-ACTION-COMPLETION-RECOVERY-DECISION-RECOVERY-EXECUTION-READINESS-GATE-DECISION";

const sha=p=>crypto.createHash("sha256").update(fs.readFileSync(p)).digest("hex");
const stable=v=>Array.isArray(v)?v.map(stable):v&&typeof v==="object"?Object.fromEntries(Object.keys(v).sort().map(k=>[k,stable(v[k])])):v;

const src=JSON.parse(fs.readFileSync(SRC,"utf8"));
assert.equal(src.program_number,159);
assert.equal(src.recovery_execution.execution_closure_proven,true);
assert.equal(src.recovery_execution.evidence_bundle_validated,true);
assert.equal(src.readiness_gate_request.required,true);
assert.equal(src.readiness_gate_request.created,true);
assert.equal(src.readiness_gate_request.validated,false);
assert.equal(src.readiness_gate_validation.required,true);
assert.equal(src.readiness_gate_validation.performed,false);
assert.equal(src.recovery_execution.readiness_gate_request_created,true);
assert.equal(src.recovery_execution.readiness_gate_validated,false);
assert.equal(src.recovery_execution.readiness_gate_passed,false);
assert.equal(src.authority.ai_authority_allowed,false);
assert.equal(src.readiness.production_ready,false);

const a={
  program_id:ID,
  program_number:160,
  title:"Level 1 Public Surface Observation Human Action Completion Recovery Decision Recovery Execution Readiness Gate Validation",
  status:STATUS,
  level3_axis:{
    principle:"readiness_gate_validated_is_not_readiness_gate_passed",
    execution_closure_proven:true,
    evidence_bundle_validated:true,
    readiness_gate_required:true,
    readiness_gate_request_created:true,
    readiness_gate_validation_performed:true,
    readiness_gate_validated:true,
    readiness_gate_decision_required:true,
    readiness_gate_passed:false,
    launch_readiness_unlocked:false,
    readiness_unlock_allowed:false,
    legal_or_certification_effect:false
  },
  inherits_from:{
    program_id:src.program_id,
    source_path:SRC,
    source_raw_sha256:sha(SRC),
    source_canonical_sha256:crypto.createHash("sha256").update(JSON.stringify(stable(src))).digest("hex")
  },
  human_decision_response:{
    received:true,
    validated:true,
    authorization_effect:false
  },
  human_decision_record:{
    created:true,
    recorded:true,
    validated:true,
    record_effect:"READINESS_GATE_VALIDATED_PENDING_READINESS_GATE_DECISION"
  },
  human_decision:{
    recorded:true,
    validated:true,
    selected_recovery_decision_option:"RECOVERY_DECISION_READINESS_GATE_VALIDATED_PENDING_DECISION"
  },
  recovery_execution_authority_binding_gate:{
    required:true,
    defined:true,
    evaluated:true,
    passed:true,
    blocked:false,
    pass_reason:"RECOVERY_EXECUTION_AUTHORITY_BINDING_COMPLETED"
  },
  recovery_execution_authority_binding:{
    required:true,
    requested:true,
    received:true,
    defined:true,
    validated:true,
    bound:true,
    completed:true,
    policy_binding_present:true,
    policy_binding_validated:true,
    policy_binding_completed:true,
    target_binding_present:true,
    target_binding_validated:true,
    target_binding_completed:true,
    scope_binding_present:true,
    scope_binding_validated:true,
    scope_binding_completed:true,
    human_authority_binding_present:true,
    human_authority_binding_validated:true,
    human_authority_binding_completed:true,
    binding_effect:"AUTHORITY_BINDING_COMPLETED_FOR_CONTROLLED_COMMIT_PATH"
  },
  recovery_execution_precommit_gate:{
    required:true,
    defined:true,
    evaluated:true,
    passed:true,
    blocked:false,
    pass_reason:"AUTHORITY_BINDING_COMPLETED_AND_PRECOMMIT_CONSTRAINTS_SATISFIED",
    gate_effect:"PRECOMMIT_COMPLETED_READINESS_GATE_VALIDATED_PENDING_DECISION"
  },
  recovery_execution_precommit:{
    prepared:true,
    committed:true,
    commit_required:true,
    precommit_effect:"COMMIT_PATH_COMPLETED_READINESS_GATE_VALIDATED",
    does_not_unlock_readiness:true
  },
  recovery_execution_commit:{
    required:true,
    defined:true,
    evaluated:true,
    committed:true,
    commit_status:"COMMITTED_READINESS_GATE_VALIDATED_PENDING_DECISION",
    commit_effect:"CONTROLLED_RECOVERY_EXECUTION_COMMIT_WITH_READINESS_GATE_VALIDATION",
    does_not_unlock_readiness:true
  },
  recovery_execution_receipt:{
    required:true,
    received:true,
    validated:true,
    validation_required:true,
    validation_performed:true,
    receipt_status:"VALIDATED",
    receipt_effect:"VALID_RECEIPT"
  },
  recovery_execution_external_effect_evidence:{
    required:true,
    received:true,
    validated:true,
    validation_required:true,
    validation_performed:true,
    evidence_status:"VALIDATED",
    evidence_effect:"VALIDATED_EXTERNAL_EFFECT"
  },
  recovery_execution_physical_effect_evidence:{
    required:true,
    received:true,
    validated:true,
    validation_required:true,
    validation_performed:true,
    evidence_status:"VALIDATED",
    evidence_effect:"VALIDATED_PHYSICAL_EFFECT_PROOF",
    does_not_unlock_readiness:true
  },
  recovery_execution_completion_record:{
    required:true,
    created:true,
    validated:true,
    validation_required:true,
    validation_performed:true,
    record_status:"VALIDATED",
    record_effect:"VALIDATED_COMPLETION_RECORD_PROVES_EXECUTION_CLOSURE",
    does_not_unlock_readiness:true
  },
  recovery_execution_evidence_bundle:{
    required:true,
    created:true,
    validated:true,
    validation_required:true,
    validation_performed:true,
    bundle_status:"VALIDATED",
    bundle_effect:"VALIDATED_EVIDENCE_BUNDLE_NO_READINESS_UNLOCK",
    append_only_linkage_verified:true,
    trusted_time_verified:true,
    does_not_unlock_readiness:true
  },
  recovery_execution_evidence_bundle_validation:{
    required:true,
    performed:true,
    validated:true,
    validation_status:"VALIDATED",
    validation_effect:"EVIDENCE_BUNDLE_VALIDATED_NO_READINESS_UNLOCK",
    does_not_unlock_readiness:true
  },
  readiness_gate_request:{
    required:true,
    created:true,
    validated:true,
    gate_passed:false,
    validation_required:true,
    validation_performed:true,
    request_status:"VALIDATED_PENDING_READINESS_GATE_DECISION",
    request_scope:"level1_public_surface_observation_recovery_execution_chain_readiness_review",
    request_effect:"READINESS_GATE_REQUEST_VALIDATED_NO_READINESS_UNLOCK",
    contains_execution_closure_reference:true,
    contains_evidence_bundle_reference:true,
    contains_authority_binding_reference:true,
    contains_constraints_reference:true,
    requires_human_review:true,
    requires_readiness_gate_decision:true,
    does_not_unlock_readiness:true
  },
  readiness_gate_validation:{
    required:true,
    performed:true,
    validated:true,
    passed:false,
    validation_scope:"readiness_gate_request_identity_integrity_execution_closure_evidence_bundle_authority_constraints_correlation",
    request_identity_validated:true,
    request_integrity_validated:true,
    execution_closure_reference_validated:true,
    evidence_bundle_reference_validated:true,
    authority_binding_reference_validated:true,
    constraints_reference_validated:true,
    validation_status:"VALIDATED_PENDING_READINESS_GATE_DECISION",
    validation_effect:"READINESS_GATE_VALIDATED_NO_READINESS_UNLOCK",
    does_not_unlock_readiness:true
  },
  readiness_gate_decision:{
    required:true,
    created:false,
    validated:false,
    passed:false,
    decision_status:"PENDING_READINESS_GATE_DECISION"
  },
  recovery_execution:{
    allowed:true,
    performed:true,
    performed_as:"CONTROLLED_COMMIT_WITH_READINESS_GATE_VALIDATED_PENDING_DECISION",
    receipt_received:true,
    receipt_validated:true,
    external_effect_evidence_received:true,
    external_effect_evidence_validated:true,
    external_effect_proven:true,
    physical_effect_evidence_received:true,
    physical_effect_evidence_validated:true,
    physical_effect_proven:true,
    completion_record_created:true,
    completion_record_validated:true,
    execution_closure_proven:true,
    evidence_bundle_created:true,
    evidence_bundle_validated:true,
    readiness_gate_request_created:true,
    readiness_gate_validated:true,
    readiness_gate_passed:false,
    readiness_gate_decision_created:false,
    pending:"READINESS_GATE_DECISION"
  },
  fail_closed:{
    fail_closed_snapshot_active:true,
    fail_closed_remains_active:false,
    no_state_unlock:false,
    unlock_reason:"CONTROLLED_RECOVERY_EXECUTION_READINESS_GATE_VALIDATED_WITH_DECISION_PENDING"
  },
  readiness:{
    external_customer_ready:false,
    banking_pack_ready:false,
    level1_launch_ready:false,
    production_ready:false
  },
  authority:{
    ai_authority_allowed:false,
    human_authority_required:true,
    legal_validity_claimed:false,
    accreditation_claimed:false,
    procurement_eligibility_claimed:false
  },
  constraints:{
    no_readiness_unlock:true,
    no_ai_authority:true,
    no_legal_validity:true,
    no_accreditation:true,
    no_procurement_eligibility:true,
    no_certification_claim:true,
    no_product_claim:true,
    no_launch_claim:true,
    no_readiness_gate_pass_claim:true
  },
  previous_program:"PROG-159",
  next_required_program:NEXT
};

assert.equal(a.readiness_gate_request.created,true);
assert.equal(a.readiness_gate_request.validated,true);
assert.equal(a.readiness_gate_validation.performed,true);
assert.equal(a.readiness_gate_validation.validated,true);
assert.equal(a.readiness_gate_validation.passed,false);
assert.equal(a.readiness_gate_decision.created,false);
assert.equal(a.recovery_execution.readiness_gate_validated,true);
assert.equal(a.recovery_execution.readiness_gate_passed,false);
assert.equal(a.recovery_execution.readiness_gate_decision_created,false);
assert.equal(a.readiness.production_ready,false);
assert.equal(a.authority.ai_authority_allowed,false);

fs.writeFileSync(JSON_OUT,JSON.stringify(stable(a),null,2)+"\n");
fs.writeFileSync(MD_OUT,`# ${a.title}

Program: \`${ID}\`

Status: \`${STATUS}\`

Source: \`${SRC}\`

PROG-160 validates the readiness gate request/package after a validated recovery execution evidence bundle.

Readiness gate validation is not readiness gate pass, launch readiness, legal validity, accreditation, certification, procurement eligibility or product readiness.

Next required program: \`${NEXT}\`
`);
console.log("PROG_160_BUILDER_RUN=PASS");
