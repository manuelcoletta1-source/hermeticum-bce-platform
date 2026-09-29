const fs=require("fs"),crypto=require("crypto"),assert=require("assert/strict");

const SRC="docs/launch/level1/prog-152-level1-public-surface-observation-human-action-completion-recovery-decision-recovery-execution-external-effect-evidence-validation.json";
const JSON_OUT="docs/launch/level1/prog-153-level1-public-surface-observation-human-action-completion-recovery-decision-recovery-execution-physical-effect-evidence.json";
const MD_OUT="docs/launch/level1/prog-153-level1-public-surface-observation-human-action-completion-recovery-decision-recovery-execution-physical-effect-evidence.md";
const ID="PROG-153-HBCE-LEVEL1-PUBLIC-SURFACE-OBSERVATION-HUMAN-ACTION-COMPLETION-RECOVERY-DECISION-RECOVERY-EXECUTION-PHYSICAL-EFFECT-EVIDENCE";
const STATUS="LEVEL1_PUBLIC_SURFACE_OBSERVATION_HUMAN_ACTION_COMPLETION_RECOVERY_DECISION_RECOVERY_EXECUTION_PHYSICAL_EFFECT_EVIDENCE_RECEIVED_PENDING_PHYSICAL_EFFECT_EVIDENCE_VALIDATION";
const NEXT="PROG-154-HBCE-LEVEL1-PUBLIC-SURFACE-OBSERVATION-HUMAN-ACTION-COMPLETION-RECOVERY-DECISION-RECOVERY-EXECUTION-PHYSICAL-EFFECT-EVIDENCE-VALIDATION";

const sha=p=>crypto.createHash("sha256").update(fs.readFileSync(p)).digest("hex");
const stable=v=>Array.isArray(v)?v.map(stable):v&&typeof v==="object"?Object.fromEntries(Object.keys(v).sort().map(k=>[k,stable(v[k])])):v;

const src=JSON.parse(fs.readFileSync(SRC,"utf8"));
assert.equal(src.program_number,152);
assert.equal(src.recovery_execution_commit.committed,true);
assert.equal(src.recovery_execution_receipt.validated,true);
assert.equal(src.recovery_execution_external_effect_evidence.validated,true);
assert.equal(src.recovery_execution_external_effect_evidence_validation.performed,true);
assert.equal(src.recovery_execution_physical_effect_evidence.required,true);
assert.equal(src.recovery_execution_physical_effect_evidence.received,false);
assert.equal(src.recovery_execution_physical_effect_evidence.validated,false);
assert.equal(src.recovery_execution.external_effect_evidence_validated,true);
assert.equal(src.recovery_execution.external_effect_proven,true);
assert.equal(src.recovery_execution.physical_effect_evidence_received,false);
assert.equal(src.recovery_execution.physical_effect_proven,false);
assert.equal(src.authority.ai_authority_allowed,false);
assert.equal(src.readiness.production_ready,false);

const a={
  program_id:ID,
  program_number:153,
  title:"Level 1 Public Surface Observation Human Action Completion Recovery Decision Recovery Execution Physical Effect Evidence",
  status:STATUS,
  level3_axis:{
    principle:"physical_effect_evidence_received_is_not_validated_physical_effect_proof",
    physical_effect_evidence_received_requires_validation:true,
    unvalidated_physical_effect_evidence_does_not_prove_physical_effect:true,
    physical_effect_claimed:false,
    readiness_unlock_allowed:false
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
    record_effect:"CONTROLLED_EXECUTION_COMMIT_WITH_VALIDATED_EXTERNAL_EFFECT_PHYSICAL_EFFECT_EVIDENCE_PENDING_VALIDATION"
  },
  human_decision:{
    recorded:true,
    validated:true,
    selected_recovery_decision_option:"RECOVERY_DECISION_EXECUTION_COMMITTED_PHYSICAL_EFFECT_EVIDENCE_RECEIVED_PENDING_VALIDATION"
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
    gate_effect:"PRECOMMIT_READY_NO_VALIDATED_PHYSICAL_EFFECT_PROOF"
  },
  recovery_execution_precommit:{
    prepared:true,
    committed:true,
    commit_required:true,
    precommit_effect:"COMMIT_PATH_READY",
    does_not_prove_validated_physical_effect:true,
    does_not_unlock_readiness:true
  },
  recovery_execution_commit:{
    required:true,
    defined:true,
    evaluated:true,
    committed:true,
    commit_status:"COMMITTED_PHYSICAL_EFFECT_EVIDENCE_RECEIVED_PENDING_VALIDATION",
    commit_effect:"CONTROLLED_RECOVERY_EXECUTION_COMMIT_WITH_UNVALIDATED_PHYSICAL_EFFECT_EVIDENCE",
    does_not_prove_validated_physical_effect:true,
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
    receipt_effect:"VALID_RECEIPT_NOT_PHYSICAL_EFFECT_PROOF",
    does_not_prove_physical_effect:true,
    does_not_unlock_readiness:true
  },
  recovery_execution_receipt_validation:{
    performed:true,
    validation_scope:"receipt_identity_integrity_authority_binding_commit_correlation",
    receipt_identity_validated:true,
    receipt_integrity_validated:true,
    authority_binding_correlation_validated:true,
    commit_correlation_validated:true,
    validation_effect:"VALIDATED_RECEIPT_NOT_PHYSICAL_EFFECT_PROOF",
    does_not_prove_physical_effect:true,
    does_not_unlock_readiness:true
  },
  recovery_execution_external_effect_evidence:{
    required:true,
    received:true,
    validated:true,
    validation_required:true,
    validation_performed:true,
    evidence_status:"VALIDATED",
    evidence_scope:"external_effect_evidence_integrity_and_commit_correlation",
    evidence_effect:"VALIDATED_EXTERNAL_EFFECT_NO_VALIDATED_PHYSICAL_EFFECT_PROOF",
    does_not_prove_validated_physical_effect:true,
    does_not_unlock_readiness:true
  },
  recovery_execution_external_effect_evidence_validation:{
    required:true,
    performed:true,
    validated:true,
    validation_scope:"external_effect_evidence_identity_integrity_receipt_commit_correlation",
    evidence_identity_validated:true,
    evidence_integrity_validated:true,
    receipt_correlation_validated:true,
    commit_correlation_validated:true,
    validation_status:"VALIDATED",
    validation_effect:"EXTERNAL_EFFECT_VALIDATED_NO_VALIDATED_PHYSICAL_EFFECT_PROOF",
    does_not_prove_validated_physical_effect:true,
    does_not_unlock_readiness:true
  },
  recovery_execution_physical_effect_evidence:{
    required:true,
    received:true,
    validated:false,
    validation_required:true,
    evidence_status:"RECEIVED_PENDING_VALIDATION",
    evidence_scope:"physical_effect_evidence_presence_only",
    evidence_effect:"NO_VALIDATED_PHYSICAL_EFFECT_PROOF",
    does_not_prove_validated_physical_effect:true,
    does_not_unlock_readiness:true
  },
  recovery_execution_physical_effect_evidence_validation:{
    required:true,
    performed:false,
    validated:false,
    validation_status:"PENDING_PHYSICAL_EFFECT_EVIDENCE_VALIDATION"
  },
  recovery_execution:{
    allowed:true,
    performed:true,
    performed_as:"CONTROLLED_COMMIT_WITH_VALIDATED_EXTERNAL_EFFECT_PHYSICAL_EFFECT_EVIDENCE_PENDING_VALIDATION",
    receipt_received:true,
    receipt_validated:true,
    external_effect_evidence_received:true,
    external_effect_evidence_validated:true,
    external_effect_proven:true,
    physical_effect_evidence_received:true,
    physical_effect_evidence_validated:false,
    physical_effect_proven:false,
    pending:"RECOVERY_EXECUTION_PHYSICAL_EFFECT_EVIDENCE_VALIDATION"
  },
  fail_closed:{
    fail_closed_snapshot_active:true,
    fail_closed_remains_active:false,
    no_state_unlock:false,
    unlock_reason:"CONTROLLED_RECOVERY_EXECUTION_COMMIT_REACHED_AFTER_AUTHORITY_BINDING_PRECOMMIT_RECEIPT_AND_EXTERNAL_EFFECT_VALIDATION"
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
    no_validated_physical_effect_claim:true
  },
  previous_program:"PROG-152",
  next_required_program:NEXT
};

assert.equal(a.recovery_execution_external_effect_evidence.validated,true);
assert.equal(a.recovery_execution.external_effect_proven,true);
assert.equal(a.recovery_execution_physical_effect_evidence.received,true);
assert.equal(a.recovery_execution_physical_effect_evidence.validated,false);
assert.equal(a.recovery_execution_physical_effect_evidence_validation.performed,false);
assert.equal(a.recovery_execution.physical_effect_evidence_received,true);
assert.equal(a.recovery_execution.physical_effect_evidence_validated,false);
assert.equal(a.recovery_execution.physical_effect_proven,false);
assert.equal(a.authority.ai_authority_allowed,false);
assert.equal(a.readiness.production_ready,false);

fs.writeFileSync(JSON_OUT,JSON.stringify(stable(a),null,2)+"\n");
fs.writeFileSync(MD_OUT,`# ${a.title}

Program: \`${ID}\`

Status: \`${STATUS}\`

Source: \`${SRC}\`

PROG-153 records physical effect evidence for the controlled recovery execution.

Physical effect evidence received is not validated physical effect proof. The system requires physical effect evidence validation before any validated physical-effect claim.

Next required program: \`${NEXT}\`
`);
console.log("PROG_153_BUILDER_RUN=PASS");
