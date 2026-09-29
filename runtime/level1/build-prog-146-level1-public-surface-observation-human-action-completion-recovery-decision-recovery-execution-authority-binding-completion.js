const fs=require("fs"),crypto=require("crypto"),assert=require("assert/strict");
const SRC="docs/launch/level1/prog-145-level1-public-surface-observation-human-action-completion-recovery-decision-recovery-execution-authority-binding-validation.json";
const JSON_OUT="docs/launch/level1/prog-146-level1-public-surface-observation-human-action-completion-recovery-decision-recovery-execution-authority-binding-completion.json";
const MD_OUT="docs/launch/level1/prog-146-level1-public-surface-observation-human-action-completion-recovery-decision-recovery-execution-authority-binding-completion.md";
const ID="PROG-146-HBCE-LEVEL1-PUBLIC-SURFACE-OBSERVATION-HUMAN-ACTION-COMPLETION-RECOVERY-DECISION-RECOVERY-EXECUTION-AUTHORITY-BINDING-COMPLETION";
const STATUS="LEVEL1_PUBLIC_SURFACE_OBSERVATION_HUMAN_ACTION_COMPLETION_RECOVERY_DECISION_RECOVERY_EXECUTION_AUTHORITY_BINDING_COMPLETED_PENDING_RECOVERY_EXECUTION_PRECOMMIT_GATE";
const NEXT="PROG-147-HBCE-LEVEL1-PUBLIC-SURFACE-OBSERVATION-HUMAN-ACTION-COMPLETION-RECOVERY-DECISION-RECOVERY-EXECUTION-PRECOMMIT-GATE";
const sha=p=>crypto.createHash("sha256").update(fs.readFileSync(p)).digest("hex");
const stable=v=>Array.isArray(v)?v.map(stable):v&&typeof v==="object"?Object.fromEntries(Object.keys(v).sort().map(k=>[k,stable(v[k])])):v;

const src=JSON.parse(fs.readFileSync(SRC,"utf8"));
assert.equal(src.program_number,145);
assert.equal(src.recovery_execution_authority_binding_validation.performed,true);
assert.equal(src.recovery_execution_authority_binding.validated,true);
assert.equal(src.recovery_execution_authority_binding.bound,false);
assert.equal(src.recovery_execution_authority_binding.completed,false);
assert.equal(src.recovery_execution.allowed,false);
assert.equal(src.fail_closed.fail_closed_remains_active,true);
assert.equal(src.authority.ai_authority_allowed,false);

const a={
  program_id:ID,
  program_number:146,
  title:"Level 1 Public Surface Observation Human Action Completion Recovery Decision Recovery Execution Authority Binding Completion",
  status:STATUS,
  level3_axis:{
    principle:"completed_authority_binding_is_not_recovery_execution",
    completed_binding_does_not_execute_recovery:true,
    completed_binding_requires_precommit_gate:true,
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
    selected_recovery_decision_option:"RECOVERY_DECISION_VALIDATED_WITH_COMPLETED_EXECUTION_AUTHORITY_BINDING_PENDING_PRECOMMIT"
  },
  recovery_execution_authority_binding_gate:{
    required:true,
    defined:true,
    evaluated:true,
    passed:true,
    blocked:false,
    pass_reason:"RECOVERY_EXECUTION_AUTHORITY_BINDING_COMPLETED"
  },
  recovery_execution_authority_binding_validation:{
    performed:true,
    validation_scope:"policy_target_scope_human_authority_binding_consistency",
    policy_binding_validated:true,
    target_binding_validated:true,
    scope_binding_validated:true,
    human_authority_binding_validated:true,
    validation_effect:"NO_EXECUTION_AUTHORIZATION"
  },
  recovery_execution_authority_binding_completion:{
    performed:true,
    completion_scope:"policy_target_scope_human_authority_binding_completion",
    policy_binding_completed:true,
    target_binding_completed:true,
    scope_binding_completed:true,
    human_authority_binding_completed:true,
    completion_effect:"AUTHORITY_BINDING_COMPLETED_NO_EXECUTION_AUTHORIZATION",
    does_not_execute_recovery:true,
    does_not_unlock_readiness:true
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
    defined:false,
    evaluated:false,
    passed:false,
    blocked:true,
    block_reason:"RECOVERY_EXECUTION_PRECOMMIT_GATE_NOT_EVALUATED"
  },
  recovery_execution:{
    allowed:false,
    performed:false,
    blocked_by:"RECOVERY_EXECUTION_PRECOMMIT_GATE_NOT_EVALUATED"
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
  previous_program:"PROG-145",
  next_required_program:NEXT
};

assert.equal(a.recovery_execution_authority_binding.completed,true);
assert.equal(a.recovery_execution_authority_binding.bound,true);
assert.equal(a.recovery_execution_precommit_gate.evaluated,false);
assert.equal(a.recovery_execution.allowed,false);
assert.equal(a.fail_closed.fail_closed_remains_active,true);
assert.equal(a.authority.ai_authority_allowed,false);

fs.writeFileSync(JSON_OUT,JSON.stringify(stable(a),null,2)+"\n");
fs.writeFileSync(MD_OUT,`# ${a.title}

Program: \`${ID}\`

Status: \`${STATUS}\`

Source: \`${SRC}\`

PROG-146 completes the recovery execution authority binding.

Completed binding is not recovery execution authorization. Recovery execution still requires the precommit gate and remains blocked. Fail-closed remains active.

Next required program: \`${NEXT}\`
`);
console.log("PROG_146_BUILDER_RUN=PASS");
