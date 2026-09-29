const fs=require("fs"),crypto=require("crypto"),assert=require("assert/strict");

const SRC="docs/launch/level1/prog-172-level1-public-surface-observation-human-action-completion-recovery-decision-recovery-execution-readiness-remediation-execution-precommit.json";
const JSON_OUT="docs/launch/level1/prog-173-level1-public-surface-observation-human-action-completion-recovery-decision-recovery-execution-readiness-remediation-execution-commit.json";
const MD_OUT="docs/launch/level1/prog-173-level1-public-surface-observation-human-action-completion-recovery-decision-recovery-execution-readiness-remediation-execution-commit.md";

const ID="PROG-173-HBCE-LEVEL1-PUBLIC-SURFACE-OBSERVATION-HUMAN-ACTION-COMPLETION-RECOVERY-DECISION-RECOVERY-EXECUTION-READINESS-REMEDIATION-EXECUTION-COMMIT";
const STATUS="LEVEL1_PUBLIC_SURFACE_OBSERVATION_HUMAN_ACTION_COMPLETION_RECOVERY_DECISION_RECOVERY_EXECUTION_READINESS_REMEDIATION_EXECUTION_COMMITTED_PENDING_REMEDIATION_EXECUTION_RECEIPT";
const NEXT="PROG-174-HBCE-LEVEL1-PUBLIC-SURFACE-OBSERVATION-HUMAN-ACTION-COMPLETION-RECOVERY-DECISION-RECOVERY-EXECUTION-READINESS-REMEDIATION-EXECUTION-RECEIPT";

const sha=p=>crypto.createHash("sha256").update(fs.readFileSync(p)).digest("hex");
const stable=v=>Array.isArray(v)?v.map(stable):v&&typeof v==="object"?Object.fromEntries(Object.keys(v).sort().map(k=>[k,stable(v[k])])):v;

const src=JSON.parse(fs.readFileSync(SRC,"utf8"));
assert.equal(src.program_number,172);
assert.equal(src.recovery_execution.readiness_remediation_execution_precommit_committed,true);
assert.equal(src.recovery_execution.readiness_remediation_execution_commit_required,true);
assert.equal(src.recovery_execution.readiness_remediation_execution_commit_performed,false);
assert.equal(src.recovery_execution.readiness_remediation_execution_authorized,false);
assert.equal(src.recovery_execution.readiness_remediation_execution_performed,false);
assert.equal(src.recovery_execution.readiness_gate_passed,false);
assert.equal(src.readiness.production_ready,false);
assert.equal(src.authority.ai_authority_allowed,false);

const a={
  program_id:ID,
  program_number:173,
  title:"Level 1 Public Surface Observation Human Action Completion Recovery Decision Recovery Execution Readiness Remediation Execution Commit",
  status:STATUS,
  level3_axis:{
    principle:"remediation_execution_commit_is_not_receipt_external_effect_physical_effect_or_readiness",
    execution_closure_proven:true,
    evidence_bundle_validated:true,
    readiness_gate_decision_validated:true,
    readiness_gate_passed:false,
    readiness_remediation_plan_validated:true,
    readiness_remediation_execution_request_validated:true,
    remediation_execution_authority_binding_completed:true,
    remediation_execution_precommit_gate_passed:true,
    remediation_execution_precommit_committed:true,
    remediation_execution_commit_required:true,
    remediation_execution_commit_performed:true,
    remediation_execution_receipt_required:true,
    remediation_execution_receipt_received:false,
    remediation_execution_receipt_validated:false,
    remediation_execution_external_effect_evidence_received:false,
    remediation_execution_external_effect_evidence_validated:false,
    remediation_execution_external_effect_proven:false,
    remediation_execution_physical_effect_evidence_received:false,
    remediation_execution_physical_effect_evidence_validated:false,
    remediation_execution_physical_effect_proven:false,
    readiness_remediation_execution_authorized:true,
    readiness_remediation_execution_performed:true,
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
    record_effect:"REMEDIATION_EXECUTION_COMMITTED_PENDING_EXECUTION_RECEIPT"
  },
  readiness_remediation_execution_request:{
    required:true,
    created:true,
    validated:true,
    authorized:true,
    request_status:"VALIDATED_AUTHORITY_BINDING_COMPLETED_PRECOMMITTED_EXECUTION_COMMITTED_PENDING_RECEIPT",
    request_effect:"REMEDIATION_EXECUTION_COMMITTED_NO_RECEIPT_NO_EXTERNAL_EFFECT_PROOF_NO_PHYSICAL_EFFECT_PROOF_NO_READINESS_UNLOCK",
    requires_execution_receipt:true,
    requires_external_effect_evidence:true,
    requires_physical_effect_evidence:true,
    does_not_prove_receipt:true,
    does_not_prove_external_effect:true,
    does_not_prove_physical_effect:true,
    does_not_unlock_readiness:true
  },
  readiness_remediation_execution_authority_binding:{
    required:true,
    requested:true,
    received:true,
    receipt_received:true,
    receipt_validated:true,
    validated:true,
    completed:true,
    binding_status:"COMPLETED_REMEDIATION_EXECUTION_COMMITTED_PENDING_EXECUTION_RECEIPT",
    precommit_gate_passed:true,
    precommit_committed:true,
    execution_commit_performed:true,
    requires_execution_receipt:true,
    does_not_supply_receipt:true,
    does_not_prove_external_effect:true,
    does_not_prove_physical_effect:true,
    does_not_unlock_readiness:true
  },
  readiness_remediation_execution_precommit_gate:{
    required:true,
    defined:true,
    evaluated:true,
    passed:true,
    blocked:false,
    gate_status:"PASSED"
  },
  readiness_remediation_execution_precommit:{
    required:true,
    prepared:true,
    committed:true,
    precommit_status:"COMMITTED",
    execution_commit_performed:true,
    requires_execution_receipt:true,
    does_not_supply_receipt:true,
    does_not_prove_external_effect:true,
    does_not_prove_physical_effect:true,
    does_not_unlock_readiness:true
  },
  readiness_remediation_execution_commit:{
    required:true,
    committed:true,
    commit_status:"COMMITTED_PENDING_REMEDIATION_EXECUTION_RECEIPT",
    commit_effect:"REMEDIATION_EXECUTION_COMMITTED_NO_RECEIPT_NO_EXTERNAL_EFFECT_PROOF_NO_PHYSICAL_EFFECT_PROOF_NO_READINESS_UNLOCK",
    receipt_required:true,
    receipt_received:false,
    receipt_validated:false,
    external_effect_evidence_received:false,
    external_effect_evidence_validated:false,
    external_effect_proven:false,
    physical_effect_evidence_received:false,
    physical_effect_evidence_validated:false,
    physical_effect_proven:false,
    does_not_prove_receipt:true,
    does_not_prove_external_effect:true,
    does_not_prove_physical_effect:true,
    does_not_unlock_readiness:true
  },
  readiness_remediation_execution_receipt:{
    required:true,
    received:false,
    validated:false,
    receipt_status:"PENDING_REMEDIATION_EXECUTION_RECEIPT"
  },
  readiness_remediation_execution_external_effect_evidence:{
    required:true,
    received:false,
    validated:false,
    proven:false,
    evidence_status:"PENDING_REMEDIATION_EXECUTION_RECEIPT"
  },
  readiness_remediation_execution_physical_effect_evidence:{
    required:true,
    received:false,
    validated:false,
    proven:false,
    evidence_status:"PENDING_REMEDIATION_EXECUTION_RECEIPT"
  },
  readiness_remediation_execution:{
    required:true,
    requested:true,
    request_validated:true,
    authority_binding_completed:true,
    precommit_gate_passed:true,
    precommit_prepared:true,
    precommit_committed:true,
    commit_required:true,
    commit_performed:true,
    authorized:true,
    performed:true,
    receipt_required:true,
    receipt_received:false,
    receipt_validated:false,
    external_effect_evidence_received:false,
    external_effect_evidence_validated:false,
    external_effect_proven:false,
    physical_effect_evidence_received:false,
    physical_effect_evidence_validated:false,
    physical_effect_proven:false,
    execution_status:"COMMITTED_PENDING_REMEDIATION_EXECUTION_RECEIPT",
    does_not_unlock_readiness:true
  },
  recovery_execution:{
    allowed:true,
    performed:true,
    performed_as:"CONTROLLED_COMMIT_WITH_REMEDIATION_EXECUTION_COMMITTED_PENDING_EXECUTION_RECEIPT",
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
    readiness_gate_decision_created:true,
    readiness_gate_decision_validated:true,
    readiness_gate_passed:false,
    readiness_remediation_plan_created:true,
    readiness_remediation_plan_validated:true,
    readiness_remediation_execution_requested:true,
    readiness_remediation_execution_request_validated:true,
    readiness_remediation_execution_authority_binding_completed:true,
    readiness_remediation_execution_precommit_gate_passed:true,
    readiness_remediation_execution_precommit_committed:true,
    readiness_remediation_execution_commit_required:true,
    readiness_remediation_execution_commit_performed:true,
    readiness_remediation_execution_authorized:true,
    readiness_remediation_execution_performed:true,
    readiness_remediation_execution_receipt_required:true,
    readiness_remediation_execution_receipt_received:false,
    readiness_remediation_execution_receipt_validated:false,
    readiness_remediation_execution_external_effect_evidence_received:false,
    readiness_remediation_execution_external_effect_evidence_validated:false,
    readiness_remediation_execution_external_effect_proven:false,
    readiness_remediation_execution_physical_effect_evidence_received:false,
    readiness_remediation_execution_physical_effect_evidence_validated:false,
    readiness_remediation_execution_physical_effect_proven:false,
    pending:"READINESS_REMEDIATION_EXECUTION_RECEIPT"
  },
  fail_closed:{
    fail_closed_snapshot_active:true,
    fail_closed_remains_active:false,
    no_state_unlock:false,
    unlock_reason:"CONTROLLED_RECOVERY_EXECUTION_REMEDIATION_EXECUTION_COMMITTED_WITH_RECEIPT_PENDING"
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
    no_readiness_gate_pass_claim:true,
    no_production_readiness_claim:true,
    no_remediation_execution_receipt_claim:true,
    no_remediation_execution_external_effect_claim:true,
    no_remediation_execution_physical_effect_claim:true
  },
  previous_program:"PROG-172",
  next_required_program:NEXT
};

assert.equal(a.readiness_remediation_execution_precommit.committed,true);
assert.equal(a.readiness_remediation_execution_commit.committed,true);
assert.equal(a.readiness_remediation_execution_commit.receipt_received,false);
assert.equal(a.readiness_remediation_execution.commit_performed,true);
assert.equal(a.readiness_remediation_execution.authorized,true);
assert.equal(a.readiness_remediation_execution.performed,true);
assert.equal(a.readiness_remediation_execution.receipt_received,false);
assert.equal(a.readiness_remediation_execution.external_effect_proven,false);
assert.equal(a.readiness_remediation_execution.physical_effect_proven,false);
assert.equal(a.recovery_execution.readiness_remediation_execution_commit_performed,true);
assert.equal(a.recovery_execution.readiness_remediation_execution_receipt_received,false);
assert.equal(a.recovery_execution.readiness_remediation_execution_external_effect_proven,false);
assert.equal(a.recovery_execution.readiness_remediation_execution_physical_effect_proven,false);
assert.equal(a.recovery_execution.readiness_gate_passed,false);
assert.equal(a.readiness.production_ready,false);
assert.equal(a.authority.ai_authority_allowed,false);

fs.writeFileSync(JSON_OUT,JSON.stringify(stable(a),null,2)+"\n");
fs.writeFileSync(MD_OUT,`# ${a.title}

Program: \`${ID}\`

Status: \`${STATUS}\`

Source: \`${SRC}\`

PROG-173 commits remediation execution after remediation execution precommit.

Remediation execution commit is not receipt, receipt validation, external effect evidence, physical effect evidence, readiness gate pass, launch readiness, legal validity, accreditation, certification, procurement eligibility or product readiness.

Next required program: \`${NEXT}\`
`);
console.log("PROG_173_BUILDER_RUN=PASS");
