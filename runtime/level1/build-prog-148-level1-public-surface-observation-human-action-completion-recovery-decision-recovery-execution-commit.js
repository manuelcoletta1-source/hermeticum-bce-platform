const fs=require("fs"),crypto=require("crypto"),assert=require("assert/strict");

const SRC="docs/launch/level1/prog-147-level1-public-surface-observation-human-action-completion-recovery-decision-recovery-execution-precommit-gate.json";
const JSON_OUT="docs/launch/level1/prog-148-level1-public-surface-observation-human-action-completion-recovery-decision-recovery-execution-commit.json";
const MD_OUT="docs/launch/level1/prog-148-level1-public-surface-observation-human-action-completion-recovery-decision-recovery-execution-commit.md";
const ID="PROG-148-HBCE-LEVEL1-PUBLIC-SURFACE-OBSERVATION-HUMAN-ACTION-COMPLETION-RECOVERY-DECISION-RECOVERY-EXECUTION-COMMIT";
const STATUS="LEVEL1_PUBLIC_SURFACE_OBSERVATION_HUMAN_ACTION_COMPLETION_RECOVERY_DECISION_RECOVERY_EXECUTION_COMMITTED_PENDING_EXECUTION_RECEIPT";
const NEXT="PROG-149-HBCE-LEVEL1-PUBLIC-SURFACE-OBSERVATION-HUMAN-ACTION-COMPLETION-RECOVERY-DECISION-RECOVERY-EXECUTION-RECEIPT";

const sha=p=>crypto.createHash("sha256").update(fs.readFileSync(p)).digest("hex");
const stable=v=>Array.isArray(v)?v.map(stable):v&&typeof v==="object"?Object.fromEntries(Object.keys(v).sort().map(k=>[k,stable(v[k])])):v;

const src=JSON.parse(fs.readFileSync(SRC,"utf8"));
assert.equal(src.program_number,147);
assert.equal(src.recovery_execution_authority_binding.completed,true);
assert.equal(src.recovery_execution_precommit_gate.passed,true);
assert.equal(src.recovery_execution_precommit.prepared,true);
assert.equal(src.recovery_execution_precommit.committed,false);
assert.equal(src.recovery_execution_commit.required,true);
assert.equal(src.recovery_execution_commit.committed,false);
assert.equal(src.recovery_execution.allowed,false);
assert.equal(src.recovery_execution.performed,false);
assert.equal(src.fail_closed.fail_closed_remains_active,true);
assert.equal(src.authority.ai_authority_allowed,false);

const a={
  program_id:ID,
  program_number:148,
  title:"Level 1 Public Surface Observation Human Action Completion Recovery Decision Recovery Execution Commit",
  status:STATUS,
  level3_axis:{
    principle:"recovery_execution_commit_is_not_execution_receipt_or_physical_effect_proof",
    execution_commit_requires_receipt:true,
    commit_does_not_prove_external_effect:true,
    external_action_effect_claimed:false
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
    record_effect:"NO_EXECUTION_AUTHORIZATION_WITHOUT_COMMIT_PATH"
  },
  human_decision:{
    recorded:true,
    validated:true,
    selected_recovery_decision_option:"RECOVERY_DECISION_VALIDATED_WITH_COMPLETED_EXECUTION_AUTHORITY_BINDING_PRECOMMIT_GATE_PASSED_EXECUTION_COMMITTED_PENDING_RECEIPT"
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
    gate_effect:"PRECOMMIT_READY_NO_EXTERNAL_EFFECT_PROOF"
  },
  recovery_execution_precommit:{
    prepared:true,
    committed:true,
    commit_required:true,
    precommit_effect:"COMMIT_PATH_READY",
    does_not_prove_external_effect:true,
    does_not_unlock_readiness:true
  },
  recovery_execution_commit:{
    required:true,
    defined:true,
    evaluated:true,
    committed:true,
    commit_status:"COMMITTED_PENDING_EXECUTION_RECEIPT",
    commit_effect:"CONTROLLED_RECOVERY_EXECUTION_COMMIT_NO_RECEIPT_YET",
    does_not_prove_external_effect:true,
    does_not_unlock_readiness:true
  },
  recovery_execution_receipt:{
    required:true,
    received:false,
    validated:false,
    receipt_effect:"NO_EXTERNAL_EFFECT_PROOF"
  },
  recovery_execution:{
    allowed:true,
    performed:true,
    performed_as:"CONTROLLED_COMMIT_ONLY",
    receipt_received:false,
    external_effect_proven:false,
    physical_effect_proven:false,
    pending:"RECOVERY_EXECUTION_RECEIPT"
  },
  fail_closed:{
    fail_closed_snapshot_active:true,
    fail_closed_remains_active:false,
    no_state_unlock:false,
    unlock_reason:"CONTROLLED_RECOVERY_EXECUTION_COMMIT_REACHED_AFTER_AUTHORITY_BINDING_AND_PRECOMMIT"
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
    no_physical_effect_claim:true
  },
  previous_program:"PROG-147",
  next_required_program:NEXT
};

assert.equal(a.recovery_execution_authority_binding.completed,true);
assert.equal(a.recovery_execution_precommit_gate.passed,true);
assert.equal(a.recovery_execution_commit.committed,true);
assert.equal(a.recovery_execution_receipt.received,false);
assert.equal(a.recovery_execution.allowed,true);
assert.equal(a.recovery_execution.performed,true);
assert.equal(a.recovery_execution.external_effect_proven,false);
assert.equal(a.recovery_execution.physical_effect_proven,false);
assert.equal(a.authority.ai_authority_allowed,false);
assert.equal(a.readiness.production_ready,false);

fs.writeFileSync(JSON_OUT,JSON.stringify(stable(a),null,2)+"\n");
fs.writeFileSync(MD_OUT,`# ${a.title}

Program: \`${ID}\`

Status: \`${STATUS}\`

Source: \`${SRC}\`

PROG-148 performs the controlled recovery execution commit.

The commit is not an execution receipt and does not prove external or physical effect. The system now requires the execution receipt step before any claim about observed outcome.

Next required program: \`${NEXT}\`
`);
console.log("PROG_148_BUILDER_RUN=PASS");
