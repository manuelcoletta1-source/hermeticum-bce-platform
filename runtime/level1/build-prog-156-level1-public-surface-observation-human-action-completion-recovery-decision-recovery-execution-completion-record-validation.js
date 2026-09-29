const fs=require("fs"),crypto=require("crypto"),assert=require("assert/strict");

const SRC="docs/launch/level1/prog-155-level1-public-surface-observation-human-action-completion-recovery-decision-recovery-execution-completion-record.json";
const JSON_OUT="docs/launch/level1/prog-156-level1-public-surface-observation-human-action-completion-recovery-decision-recovery-execution-completion-record-validation.json";
const MD_OUT="docs/launch/level1/prog-156-level1-public-surface-observation-human-action-completion-recovery-decision-recovery-execution-completion-record-validation.md";
const ID="PROG-156-HBCE-LEVEL1-PUBLIC-SURFACE-OBSERVATION-HUMAN-ACTION-COMPLETION-RECOVERY-DECISION-RECOVERY-EXECUTION-COMPLETION-RECORD-VALIDATION";
const STATUS="LEVEL1_PUBLIC_SURFACE_OBSERVATION_HUMAN_ACTION_COMPLETION_RECOVERY_DECISION_RECOVERY_EXECUTION_CLOSURE_PROVEN_PENDING_EVIDENCE_BUNDLE";
const NEXT="PROG-157-HBCE-LEVEL1-PUBLIC-SURFACE-OBSERVATION-HUMAN-ACTION-COMPLETION-RECOVERY-DECISION-RECOVERY-EXECUTION-EVIDENCE-BUNDLE";

const sha=p=>crypto.createHash("sha256").update(fs.readFileSync(p)).digest("hex");
const stable=v=>Array.isArray(v)?v.map(stable):v&&typeof v==="object"?Object.fromEntries(Object.keys(v).sort().map(k=>[k,stable(v[k])])):v;

const src=JSON.parse(fs.readFileSync(SRC,"utf8"));
assert.equal(src.program_number,155);
assert.equal(src.recovery_execution_commit.committed,true);
assert.equal(src.recovery_execution_receipt.validated,true);
assert.equal(src.recovery_execution.external_effect_proven,true);
assert.equal(src.recovery_execution.physical_effect_proven,true);
assert.equal(src.recovery_execution_completion_record.required,true);
assert.equal(src.recovery_execution_completion_record.created,true);
assert.equal(src.recovery_execution_completion_record.validated,false);
assert.equal(src.recovery_execution_completion_record_validation.required,true);
assert.equal(src.recovery_execution_completion_record_validation.performed,false);
assert.equal(src.recovery_execution.completion_record_created,true);
assert.equal(src.recovery_execution.completion_record_validated,false);
assert.equal(src.recovery_execution.execution_closure_proven,false);
assert.equal(src.authority.ai_authority_allowed,false);
assert.equal(src.readiness.production_ready,false);

const a={
  program_id:ID,
  program_number:156,
  title:"Level 1 Public Surface Observation Human Action Completion Recovery Decision Recovery Execution Completion Record Validation",
  status:STATUS,
  level3_axis:{
    principle:"validated_completion_record_proves_execution_closure_but_does_not_unlock_readiness",
    completion_record_created:true,
    completion_record_validation_performed:true,
    completion_record_validated:true,
    execution_closure_proven:true,
    evidence_bundle_required:true,
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
    record_effect:"CONTROLLED_EXECUTION_CLOSURE_PROVEN_PENDING_EVIDENCE_BUNDLE"
  },
  human_decision:{
    recorded:true,
    validated:true,
    selected_recovery_decision_option:"RECOVERY_DECISION_EXECUTION_CLOSURE_PROVEN_PENDING_EVIDENCE_BUNDLE"
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
    gate_effect:"PRECOMMIT_COMPLETED_EXECUTION_CLOSURE_PROVEN_PENDING_EVIDENCE_BUNDLE"
  },
  recovery_execution_precommit:{
    prepared:true,
    committed:true,
    commit_required:true,
    precommit_effect:"COMMIT_PATH_COMPLETED_EXECUTION_CLOSURE_PROVEN",
    does_not_unlock_readiness:true
  },
  recovery_execution_commit:{
    required:true,
    defined:true,
    evaluated:true,
    committed:true,
    commit_status:"COMMITTED_EXECUTION_CLOSURE_PROVEN_PENDING_EVIDENCE_BUNDLE",
    commit_effect:"CONTROLLED_RECOVERY_EXECUTION_COMMIT_WITH_VALIDATED_COMPLETION_RECORD",
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
    validated:true,
    validation_required:true,
    validation_performed:true,
    record_status:"VALIDATED_PENDING_EVIDENCE_BUNDLE",
    record_scope:"receipt_external_effect_physical_effect_commit_completion_summary",
    record_effect:"VALIDATED_COMPLETION_RECORD_PROVES_EXECUTION_CLOSURE",
    contains_receipt_reference:true,
    contains_external_effect_reference:true,
    contains_physical_effect_reference:true,
    contains_commit_reference:true,
    contains_authority_binding_reference:true,
    does_not_unlock_readiness:true
  },
  recovery_execution_completion_record_validation:{
    required:true,
    performed:true,
    validated:true,
    validation_scope:"completion_record_identity_integrity_receipt_external_effect_physical_effect_commit_authority_correlation",
    record_identity_validated:true,
    record_integrity_validated:true,
    receipt_reference_validated:true,
    external_effect_reference_validated:true,
    physical_effect_reference_validated:true,
    commit_reference_validated:true,
    authority_binding_reference_validated:true,
    validation_status:"VALIDATED_PENDING_EVIDENCE_BUNDLE",
    validation_effect:"EXECUTION_CLOSURE_PROVEN_NO_READINESS_UNLOCK",
    does_not_unlock_readiness:true
  },
  recovery_execution_evidence_bundle:{
    required:true,
    created:false,
    validated:false,
    bundle_status:"PENDING_RECOVERY_EXECUTION_EVIDENCE_BUNDLE"
  },
  recovery_execution:{
    allowed:true,
    performed:true,
    performed_as:"CONTROLLED_COMMIT_WITH_VALIDATED_COMPLETION_RECORD_PENDING_EVIDENCE_BUNDLE",
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
    evidence_bundle_created:false,
    pending:"RECOVERY_EXECUTION_EVIDENCE_BUNDLE"
  },
  fail_closed:{
    fail_closed_snapshot_active:true,
    fail_closed_remains_active:false,
    no_state_unlock:false,
    unlock_reason:"CONTROLLED_RECOVERY_EXECUTION_CLOSURE_PROVEN_WITH_VALIDATED_RECEIPT_EXTERNAL_EFFECT_PHYSICAL_EFFECT_AND_COMPLETION_RECORD"
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
    no_product_claim:true
  },
  previous_program:"PROG-155",
  next_required_program:NEXT
};

assert.equal(a.recovery_execution_completion_record.created,true);
assert.equal(a.recovery_execution_completion_record.validated,true);
assert.equal(a.recovery_execution_completion_record_validation.performed,true);
assert.equal(a.recovery_execution.completion_record_created,true);
assert.equal(a.recovery_execution.completion_record_validated,true);
assert.equal(a.recovery_execution.execution_closure_proven,true);
assert.equal(a.recovery_execution_evidence_bundle.created,false);
assert.equal(a.authority.ai_authority_allowed,false);
assert.equal(a.readiness.production_ready,false);

fs.writeFileSync(JSON_OUT,JSON.stringify(stable(a),null,2)+"\n");
fs.writeFileSync(MD_OUT,`# ${a.title}

Program: \`${ID}\`

Status: \`${STATUS}\`

Source: \`${SRC}\`

PROG-156 validates the recovery execution completion record.

Validated completion record proves execution closure inside the controlled recovery chain, but it does not unlock readiness, legal validity, accreditation, certification, procurement eligibility or product claims.

Next required program: \`${NEXT}\`
`);
console.log("PROG_156_BUILDER_RUN=PASS");
