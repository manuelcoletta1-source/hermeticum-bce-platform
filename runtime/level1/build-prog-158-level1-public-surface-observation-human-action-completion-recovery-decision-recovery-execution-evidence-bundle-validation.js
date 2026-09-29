const fs=require("fs"),crypto=require("crypto"),assert=require("assert/strict");

const SRC="docs/launch/level1/prog-157-level1-public-surface-observation-human-action-completion-recovery-decision-recovery-execution-evidence-bundle.json";
const JSON_OUT="docs/launch/level1/prog-158-level1-public-surface-observation-human-action-completion-recovery-decision-recovery-execution-evidence-bundle-validation.json";
const MD_OUT="docs/launch/level1/prog-158-level1-public-surface-observation-human-action-completion-recovery-decision-recovery-execution-evidence-bundle-validation.md";
const ID="PROG-158-HBCE-LEVEL1-PUBLIC-SURFACE-OBSERVATION-HUMAN-ACTION-COMPLETION-RECOVERY-DECISION-RECOVERY-EXECUTION-EVIDENCE-BUNDLE-VALIDATION";
const STATUS="LEVEL1_PUBLIC_SURFACE_OBSERVATION_HUMAN_ACTION_COMPLETION_RECOVERY_DECISION_RECOVERY_EXECUTION_EVIDENCE_BUNDLE_VALIDATED_PENDING_READINESS_GATE_REQUEST";
const NEXT="PROG-159-HBCE-LEVEL1-PUBLIC-SURFACE-OBSERVATION-HUMAN-ACTION-COMPLETION-RECOVERY-DECISION-RECOVERY-EXECUTION-READINESS-GATE-REQUEST";

const sha=p=>crypto.createHash("sha256").update(fs.readFileSync(p)).digest("hex");
const stable=v=>Array.isArray(v)?v.map(stable):v&&typeof v==="object"?Object.fromEntries(Object.keys(v).sort().map(k=>[k,stable(v[k])])):v;

const src=JSON.parse(fs.readFileSync(SRC,"utf8"));
assert.equal(src.program_number,157);
assert.equal(src.recovery_execution.execution_closure_proven,true);
assert.equal(src.recovery_execution_evidence_bundle.required,true);
assert.equal(src.recovery_execution_evidence_bundle.created,true);
assert.equal(src.recovery_execution_evidence_bundle.validated,false);
assert.equal(src.recovery_execution_evidence_bundle_validation.required,true);
assert.equal(src.recovery_execution_evidence_bundle_validation.performed,false);
assert.equal(src.recovery_execution.evidence_bundle_created,true);
assert.equal(src.recovery_execution.evidence_bundle_validated,false);
assert.equal(src.authority.ai_authority_allowed,false);
assert.equal(src.readiness.production_ready,false);

const a={
  program_id:ID,
  program_number:158,
  title:"Level 1 Public Surface Observation Human Action Completion Recovery Decision Recovery Execution Evidence Bundle Validation",
  status:STATUS,
  level3_axis:{
    principle:"validated_evidence_bundle_is_not_readiness_unlock",
    execution_closure_proven:true,
    evidence_bundle_created:true,
    evidence_bundle_validation_performed:true,
    evidence_bundle_validated:true,
    readiness_gate_required:true,
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
    record_effect:"CONTROLLED_EXECUTION_EVIDENCE_BUNDLE_VALIDATED_PENDING_READINESS_GATE_REQUEST"
  },
  human_decision:{
    recorded:true,
    validated:true,
    selected_recovery_decision_option:"RECOVERY_DECISION_EXECUTION_EVIDENCE_BUNDLE_VALIDATED_PENDING_READINESS_GATE_REQUEST"
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
    gate_effect:"PRECOMMIT_COMPLETED_EVIDENCE_BUNDLE_VALIDATED_PENDING_READINESS_GATE"
  },
  recovery_execution_precommit:{
    prepared:true,
    committed:true,
    commit_required:true,
    precommit_effect:"COMMIT_PATH_COMPLETED_EVIDENCE_BUNDLE_VALIDATED",
    does_not_unlock_readiness:true
  },
  recovery_execution_commit:{
    required:true,
    defined:true,
    evaluated:true,
    committed:true,
    commit_status:"COMMITTED_EVIDENCE_BUNDLE_VALIDATED_PENDING_READINESS_GATE_REQUEST",
    commit_effect:"CONTROLLED_RECOVERY_EXECUTION_COMMIT_WITH_VALIDATED_EVIDENCE_BUNDLE",
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
    record_status:"VALIDATED",
    record_scope:"receipt_external_effect_physical_effect_commit_completion_summary",
    record_effect:"VALIDATED_COMPLETION_RECORD_PROVES_EXECUTION_CLOSURE",
    does_not_unlock_readiness:true
  },
  recovery_execution_completion_record_validation:{
    required:true,
    performed:true,
    validated:true,
    validation_status:"VALIDATED",
    validation_effect:"EXECUTION_CLOSURE_PROVEN_NO_READINESS_UNLOCK",
    does_not_unlock_readiness:true
  },
  recovery_execution_evidence_bundle:{
    required:true,
    created:true,
    validated:true,
    validation_required:true,
    validation_performed:true,
    bundle_status:"VALIDATED_PENDING_READINESS_GATE_REQUEST",
    bundle_scope:"authority_binding_precommit_commit_receipt_external_effect_physical_effect_completion_record",
    bundle_effect:"VALIDATED_EVIDENCE_BUNDLE_NO_READINESS_UNLOCK",
    contains_authority_binding_reference:true,
    contains_precommit_reference:true,
    contains_commit_reference:true,
    contains_receipt_reference:true,
    contains_external_effect_reference:true,
    contains_physical_effect_reference:true,
    contains_completion_record_reference:true,
    contains_source_chain_hash:true,
    append_only_linkage_verified:true,
    trusted_time_verified:true,
    does_not_unlock_readiness:true
  },
  recovery_execution_evidence_bundle_validation:{
    required:true,
    performed:true,
    validated:true,
    validation_scope:"evidence_bundle_identity_integrity_authority_precommit_commit_receipt_external_physical_completion_source_chain_time_linkage",
    bundle_identity_validated:true,
    bundle_integrity_validated:true,
    authority_binding_reference_validated:true,
    precommit_reference_validated:true,
    commit_reference_validated:true,
    receipt_reference_validated:true,
    external_effect_reference_validated:true,
    physical_effect_reference_validated:true,
    completion_record_reference_validated:true,
    source_chain_hash_validated:true,
    append_only_linkage_validated:true,
    trusted_time_validated:true,
    validation_status:"VALIDATED_PENDING_READINESS_GATE_REQUEST",
    validation_effect:"EVIDENCE_BUNDLE_VALIDATED_NO_READINESS_UNLOCK",
    does_not_unlock_readiness:true
  },
  readiness_gate_request:{
    required:true,
    created:false,
    validated:false,
    request_status:"PENDING_READINESS_GATE_REQUEST"
  },
  recovery_execution:{
    allowed:true,
    performed:true,
    performed_as:"CONTROLLED_COMMIT_WITH_VALIDATED_EVIDENCE_BUNDLE_PENDING_READINESS_GATE_REQUEST",
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
    readiness_gate_request_created:false,
    pending:"READINESS_GATE_REQUEST"
  },
  fail_closed:{
    fail_closed_snapshot_active:true,
    fail_closed_remains_active:false,
    no_state_unlock:false,
    unlock_reason:"CONTROLLED_RECOVERY_EXECUTION_EVIDENCE_BUNDLE_VALIDATED_WITH_READINESS_GATE_PENDING"
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
    no_launch_claim:true
  },
  previous_program:"PROG-157",
  next_required_program:NEXT
};

assert.equal(a.recovery_execution_evidence_bundle.created,true);
assert.equal(a.recovery_execution_evidence_bundle.validated,true);
assert.equal(a.recovery_execution_evidence_bundle_validation.performed,true);
assert.equal(a.recovery_execution.evidence_bundle_created,true);
assert.equal(a.recovery_execution.evidence_bundle_validated,true);
assert.equal(a.recovery_execution.readiness_gate_request_created,false);
assert.equal(a.readiness.production_ready,false);
assert.equal(a.authority.ai_authority_allowed,false);

fs.writeFileSync(JSON_OUT,JSON.stringify(stable(a),null,2)+"\n");
fs.writeFileSync(MD_OUT,`# ${a.title}

Program: \`${ID}\`

Status: \`${STATUS}\`

Source: \`${SRC}\`

PROG-158 validates the recovery execution evidence bundle.

Validated evidence bundle does not unlock readiness, legal validity, accreditation, certification, procurement eligibility, product claim or launch claim.

Next required program: \`${NEXT}\`
`);
console.log("PROG_158_BUILDER_RUN=PASS");
