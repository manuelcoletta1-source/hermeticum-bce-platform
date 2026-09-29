const fs=require("fs"),crypto=require("crypto"),assert=require("assert/strict");

const SRC="docs/launch/level1/prog-154-level1-public-surface-observation-human-action-completion-recovery-decision-recovery-execution-physical-effect-evidence-validation.json";
const JSON_OUT="docs/launch/level1/prog-155-level1-public-surface-observation-human-action-completion-recovery-decision-recovery-execution-completion-record.json";
const MD_OUT="docs/launch/level1/prog-155-level1-public-surface-observation-human-action-completion-recovery-decision-recovery-execution-completion-record.md";
const ID="PROG-155-HBCE-LEVEL1-PUBLIC-SURFACE-OBSERVATION-HUMAN-ACTION-COMPLETION-RECOVERY-DECISION-RECOVERY-EXECUTION-COMPLETION-RECORD";
const STATUS="LEVEL1_PUBLIC_SURFACE_OBSERVATION_HUMAN_ACTION_COMPLETION_RECOVERY_DECISION_RECOVERY_EXECUTION_COMPLETION_RECORD_CREATED_PENDING_COMPLETION_RECORD_VALIDATION";
const NEXT="PROG-156-HBCE-LEVEL1-PUBLIC-SURFACE-OBSERVATION-HUMAN-ACTION-COMPLETION-RECOVERY-DECISION-RECOVERY-EXECUTION-COMPLETION-RECORD-VALIDATION";

const sha=p=>crypto.createHash("sha256").update(fs.readFileSync(p)).digest("hex");
const stable=v=>Array.isArray(v)?v.map(stable):v&&typeof v==="object"?Object.fromEntries(Object.keys(v).sort().map(k=>[k,stable(v[k])])):v;

const src=JSON.parse(fs.readFileSync(SRC,"utf8"));
assert.equal(src.program_number,154);
assert.equal(src.recovery_execution_commit.committed,true);
assert.equal(src.recovery_execution_receipt.validated,true);
assert.equal(src.recovery_execution.external_effect_proven,true);
assert.equal(src.recovery_execution.physical_effect_proven,true);
assert.equal(src.recovery_execution_completion_record.required,true);
assert.equal(src.recovery_execution_completion_record.created,false);
assert.equal(src.recovery_execution.completion_record_created,false);
assert.equal(src.authority.ai_authority_allowed,false);
assert.equal(src.readiness.production_ready,false);

const a={
  program_id:ID,
  program_number:155,
  title:"Level 1 Public Surface Observation Human Action Completion Recovery Decision Recovery Execution Completion Record",
  status:STATUS,
  level3_axis:{
    principle:"completion_record_created_is_not_validated_execution_closure",
    completion_record_created:true,
    completion_record_validation_required:true,
    completion_record_validated:false,
    execution_closure_proven:false,
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
    record_effect:"CONTROLLED_EXECUTION_COMMIT_WITH_COMPLETION_RECORD_PENDING_VALIDATION"
  },
  human_decision:{
    recorded:true,
    validated:true,
    selected_recovery_decision_option:"RECOVERY_DECISION_EXECUTION_COMPLETION_RECORD_CREATED_PENDING_VALIDATION"
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
    gate_effect:"PRECOMMIT_READY_WITH_COMPLETION_RECORD_PENDING_VALIDATION"
  },
  recovery_execution_precommit:{
    prepared:true,
    committed:true,
    commit_required:true,
    precommit_effect:"COMMIT_PATH_COMPLETED_PENDING_COMPLETION_RECORD_VALIDATION",
    does_not_unlock_readiness:true
  },
  recovery_execution_commit:{
    required:true,
    defined:true,
    evaluated:true,
    committed:true,
    commit_status:"COMMITTED_COMPLETION_RECORD_CREATED_PENDING_VALIDATION",
    commit_effect:"CONTROLLED_RECOVERY_EXECUTION_COMMIT_WITH_COMPLETION_RECORD",
    does_not_unlock_readiness:true
  },
  recovery_execution_receipt:{
    required:true,
    received:true,
    validated:true,
    validation_required:true,
    validation_performed:true,
    receipt_status:"VALIDATED",
    receipt_scope:"execution_receipt_integrity_and_binding_validation",
    receipt_effect:"VALID_RECEIPT"
  },
  recovery_execution_receipt_validation:{
    performed:true,
    validation_scope:"receipt_identity_integrity_authority_binding_commit_correlation",
    receipt_identity_validated:true,
    receipt_integrity_validated:true,
    authority_binding_correlation_validated:true,
    commit_correlation_validated:true,
    validation_effect:"VALIDATED_RECEIPT"
  },
  recovery_execution_external_effect_evidence:{
    required:true,
    received:true,
    validated:true,
    validation_required:true,
    validation_performed:true,
    evidence_status:"VALIDATED",
    evidence_scope:"external_effect_evidence_integrity_and_commit_correlation",
    evidence_effect:"VALIDATED_EXTERNAL_EFFECT"
  },
  recovery_execution_external_effect_evidence_validation:{
    required:true,
    performed:true,
    validated:true,
    validation_status:"VALIDATED",
    validation_effect:"EXTERNAL_EFFECT_VALIDATED"
  },
  recovery_execution_physical_effect_evidence:{
    required:true,
    received:true,
    validated:true,
    validation_required:true,
    validation_performed:true,
    evidence_status:"VALIDATED",
    evidence_scope:"physical_effect_evidence_integrity_external_effect_receipt_commit_correlation",
    evidence_effect:"VALIDATED_PHYSICAL_EFFECT_PROOF",
    does_not_unlock_readiness:true
  },
  recovery_execution_physical_effect_evidence_validation:{
    required:true,
    performed:true,
    validated:true,
    validation_scope:"physical_effect_evidence_identity_integrity_external_effect_receipt_commit_correlation",
    evidence_identity_validated:true,
    evidence_integrity_validated:true,
    external_effect_correlation_validated:true,
    receipt_correlation_validated:true,
    commit_correlation_validated:true,
    validation_status:"VALIDATED",
    validation_effect:"PHYSICAL_EFFECT_VALIDATED_NO_READINESS_UNLOCK",
    does_not_unlock_readiness:true
  },
  recovery_execution_completion_record:{
    required:true,
    created:true,
    validated:false,
    validation_required:true,
    record_status:"CREATED_PENDING_VALIDATION",
    record_scope:"receipt_external_effect_physical_effect_commit_completion_summary",
    record_effect:"COMPLETION_RECORD_CREATED_NO_VALIDATED_EXECUTION_CLOSURE",
    contains_receipt_reference:true,
    contains_external_effect_reference:true,
    contains_physical_effect_reference:true,
    contains_commit_reference:true,
    contains_authority_binding_reference:true,
    does_not_unlock_readiness:true
  },
  recovery_execution_completion_record_validation:{
    required:true,
    performed:false,
    validated:false,
    validation_status:"PENDING_COMPLETION_RECORD_VALIDATION"
  },
  recovery_execution:{
    allowed:true,
    performed:true,
    performed_as:"CONTROLLED_COMMIT_WITH_COMPLETION_RECORD_PENDING_VALIDATION",
    receipt_received:true,
    receipt_validated:true,
    external_effect_evidence_received:true,
    external_effect_evidence_validated:true,
    external_effect_proven:true,
    physical_effect_evidence_received:true,
    physical_effect_evidence_validated:true,
    physical_effect_proven:true,
    completion_record_created:true,
    completion_record_validated:false,
    execution_closure_proven:false,
    pending:"RECOVERY_EXECUTION_COMPLETION_RECORD_VALIDATION"
  },
  fail_closed:{
    fail_closed_snapshot_active:true,
    fail_closed_remains_active:false,
    no_state_unlock:false,
    unlock_reason:"CONTROLLED_RECOVERY_EXECUTION_COMMIT_REACHED_WITH_VALIDATED_RECEIPT_EXTERNAL_EFFECT_PHYSICAL_EFFECT_AND_UNVALIDATED_COMPLETION_RECORD"
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
    no_validated_execution_closure_claim:true
  },
  previous_program:"PROG-154",
  next_required_program:NEXT
};

assert.equal(a.recovery_execution.physical_effect_proven,true);
assert.equal(a.recovery_execution_completion_record.created,true);
assert.equal(a.recovery_execution_completion_record.validated,false);
assert.equal(a.recovery_execution_completion_record_validation.performed,false);
assert.equal(a.recovery_execution.completion_record_created,true);
assert.equal(a.recovery_execution.completion_record_validated,false);
assert.equal(a.recovery_execution.execution_closure_proven,false);
assert.equal(a.authority.ai_authority_allowed,false);
assert.equal(a.readiness.production_ready,false);

fs.writeFileSync(JSON_OUT,JSON.stringify(stable(a),null,2)+"\n");
fs.writeFileSync(MD_OUT,`# ${a.title}

Program: \`${ID}\`

Status: \`${STATUS}\`

Source: \`${SRC}\`

PROG-155 creates the recovery execution completion record after validated receipt, external effect and physical effect evidence.

Completion record creation is not validated execution closure. The completion record must be validated before any execution-closure claim.

Next required program: \`${NEXT}\`
`);
console.log("PROG_155_BUILDER_RUN=PASS");
