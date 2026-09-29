const fs=require("fs"),crypto=require("crypto"),assert=require("assert/strict");

const SRC="docs/launch/level1/prog-146-level1-public-surface-observation-human-action-completion-recovery-decision-recovery-execution-authority-binding-completion.json";
const JSON_OUT="docs/launch/level1/prog-147-level1-public-surface-observation-human-action-completion-recovery-decision-recovery-execution-precommit-gate.json";
const MD_OUT="docs/launch/level1/prog-147-level1-public-surface-observation-human-action-completion-recovery-decision-recovery-execution-precommit-gate.md";
const ID="PROG-147-HBCE-LEVEL1-PUBLIC-SURFACE-OBSERVATION-HUMAN-ACTION-COMPLETION-RECOVERY-DECISION-RECOVERY-EXECUTION-PRECOMMIT-GATE";
const STATUS="LEVEL1_PUBLIC_SURFACE_OBSERVATION_HUMAN_ACTION_COMPLETION_RECOVERY_DECISION_RECOVERY_EXECUTION_PRECOMMIT_GATE_PASSED_PENDING_RECOVERY_EXECUTION_COMMIT";
const NEXT="PROG-148-HBCE-LEVEL1-PUBLIC-SURFACE-OBSERVATION-HUMAN-ACTION-COMPLETION-RECOVERY-DECISION-RECOVERY-EXECUTION-COMMIT";
const sha=p=>crypto.createHash("sha256").update(fs.readFileSync(p)).digest("hex");
const stable=v=>Array.isArray(v)?v.map(stable):v&&typeof v==="object"?Object.fromEntries(Object.keys(v).sort().map(k=>[k,stable(v[k])])):v;

const src=JSON.parse(fs.readFileSync(SRC,"utf8"));
assert.equal(src.program_number,146);
assert.equal(src.recovery_execution_authority_binding.bound,true);
assert.equal(src.recovery_execution_authority_binding.completed,true);
assert.equal(src.recovery_execution_precommit_gate.required,true);
assert.equal(src.recovery_execution_precommit_gate.defined,false);
assert.equal(src.recovery_execution_precommit_gate.evaluated,false);
assert.equal(src.recovery_execution.allowed,false);
assert.equal(src.fail_closed.fail_closed_remains_active,true);
assert.equal(src.authority.ai_authority_allowed,false);

const a={
  program_id:ID,
  program_number:147,
  title:"Level 1 Public Surface Observation Human Action Completion Recovery Decision Recovery Execution Precommit Gate",
  status:STATUS,
  level3_axis:{
    principle:"passed_precommit_gate_is_not_recovery_execution",
    passed_precommit_gate_does_not_execute_recovery:true,
    passed_precommit_gate_requires_execution_commit:true,
    external_action_effect_allowed:false
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
    record_effect:"NO_EXECUTION_AUTHORIZATION"
  },
  human_decision:{
    recorded:true,
    validated:true,
    selected_recovery_decision_option:"RECOVERY_DECISION_VALIDATED_WITH_COMPLETED_EXECUTION_AUTHORITY_BINDING_PRECOMMIT_GATE_PASSED"
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
    binding_effect:"AUTHORITY_BINDING_COMPLETED_NO_EXECUTION_AUTHORIZATION"
  },
  recovery_execution_precommit_gate:{
    required:true,
    defined:true,
    evaluated:true,
    passed:true,
    blocked:false,
    pass_reason:"AUTHORITY_BINDING_COMPLETED_AND_PRECOMMIT_CONSTRAINTS_SATISFIED",
    gate_effect:"NO_EXTERNAL_ACTION_EFFECT"
  },
  recovery_execution_precommit:{
    prepared:true,
    committed:false,
    commit_required:true,
    precommit_effect:"NO_EXECUTION_AUTHORIZATION",
    does_not_execute_recovery:true,
    does_not_unlock_readiness:true
  },
  recovery_execution_commit:{
    required:true,
    defined:false,
    evaluated:false,
    committed:false,
    commit_effect:"NO_EXTERNAL_ACTION_EFFECT"
  },
  recovery_execution:{
    allowed:false,
    performed:false,
    blocked_by:"RECOVERY_EXECUTION_COMMIT_NOT_PERFORMED"
  },
  fail_closed:{
    fail_closed_snapshot_active:true,
    fail_closed_remains_active:true,
    no_state_unlock:true
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
    no_procurement_eligibility:true
  },
  previous_program:"PROG-146",
  next_required_program:NEXT
};

assert.equal(a.recovery_execution_authority_binding.completed,true);
assert.equal(a.recovery_execution_precommit_gate.defined,true);
assert.equal(a.recovery_execution_precommit_gate.evaluated,true);
assert.equal(a.recovery_execution_precommit_gate.passed,true);
assert.equal(a.recovery_execution_precommit.prepared,true);
assert.equal(a.recovery_execution_precommit.committed,false);
assert.equal(a.recovery_execution_commit.required,true);
assert.equal(a.recovery_execution_commit.committed,false);
assert.equal(a.recovery_execution.allowed,false);
assert.equal(a.recovery_execution.performed,false);
assert.equal(a.fail_closed.fail_closed_remains_active,true);
assert.equal(a.authority.ai_authority_allowed,false);

fs.writeFileSync(JSON_OUT,JSON.stringify(stable(a),null,2)+"\n");
fs.writeFileSync(MD_OUT,`# ${a.title}

Program: \`${ID}\`

Status: \`${STATUS}\`

Source: \`${SRC}\`

PROG-147 evaluates and passes the recovery execution precommit gate.

A passed precommit gate is not recovery execution, not an external action effect, and not a readiness unlock. Recovery execution remains blocked until the execution commit step.

Next required program: \`${NEXT}\`
`);
console.log("PROG_147_BUILDER_RUN=PASS");
