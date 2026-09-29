const fs=require("fs"),crypto=require("crypto"),assert=require("assert/strict");
const SRC="docs/launch/level1/prog-144-level1-public-surface-observation-human-action-completion-recovery-decision-recovery-execution-authority-binding-receipt.json";
const JSON_OUT="docs/launch/level1/prog-145-level1-public-surface-observation-human-action-completion-recovery-decision-recovery-execution-authority-binding-validation.json";
const MD_OUT="docs/launch/level1/prog-145-level1-public-surface-observation-human-action-completion-recovery-decision-recovery-execution-authority-binding-validation.md";
const ID="PROG-145-HBCE-LEVEL1-PUBLIC-SURFACE-OBSERVATION-HUMAN-ACTION-COMPLETION-RECOVERY-DECISION-RECOVERY-EXECUTION-AUTHORITY-BINDING-VALIDATION";
const STATUS="LEVEL1_PUBLIC_SURFACE_OBSERVATION_HUMAN_ACTION_COMPLETION_RECOVERY_DECISION_RECOVERY_EXECUTION_AUTHORITY_BINDING_VALIDATED_PENDING_BINDING_COMPLETION";
const NEXT="PROG-146-HBCE-LEVEL1-PUBLIC-SURFACE-OBSERVATION-HUMAN-ACTION-COMPLETION-RECOVERY-DECISION-RECOVERY-EXECUTION-AUTHORITY-BINDING-COMPLETION";
const sha=p=>crypto.createHash("sha256").update(fs.readFileSync(p)).digest("hex");
const stable=v=>Array.isArray(v)?v.map(stable):v&&typeof v==="object"?Object.fromEntries(Object.keys(v).sort().map(k=>[k,stable(v[k])])):v;

const src=JSON.parse(fs.readFileSync(SRC,"utf8"));
assert.equal(src.program_number,144);
assert.equal(src.recovery_execution_authority_binding_receipt.received,true);
assert.equal(src.recovery_execution_authority_binding.received,true);
assert.equal(src.recovery_execution_authority_binding.defined,true);
assert.equal(src.recovery_execution_authority_binding.validated,false);
assert.equal(src.recovery_execution_authority_binding.bound,false);
assert.equal(src.recovery_execution.allowed,false);
assert.equal(src.fail_closed.fail_closed_remains_active,true);
assert.equal(src.authority.ai_authority_allowed,false);

const a={
  program_id:ID,
  program_number:145,
  title:"Level 1 Public Surface Observation Human Action Completion Recovery Decision Recovery Execution Authority Binding Validation",
  status:STATUS,
  level3_axis:{
    principle:"validated_authority_binding_material_is_not_completed_binding",
    validation_does_not_complete_binding:true,
    validated_binding_material_does_not_authorize_recovery_execution:true,
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
    selected_recovery_decision_option:"RECOVERY_DECISION_VALIDATED_PENDING_EXECUTION_AUTHORITY_BINDING"
  },
  recovery_execution_authority_binding_gate:{
    required:true,
    defined:true,
    evaluated:true,
    passed:false,
    blocked:true,
    block_reason:"RECOVERY_EXECUTION_AUTHORITY_BINDING_VALIDATED_NOT_COMPLETED"
  },
  recovery_execution_authority_binding_request:{
    issued:true,
    requested_for:"policy_target_scope_human_authority_binding",
    request_status:"REQUESTED_BINDING_RECEIVED_VALIDATED_PENDING_COMPLETION",
    request_effect:"NO_EXECUTION_AUTHORIZATION"
  },
  recovery_execution_authority_binding_receipt:{
    received:true,
    receipt_scope:"binding_material_presence_only",
    receipt_effect:"NO_EXECUTION_AUTHORIZATION"
  },
  recovery_execution_authority_binding_validation:{
    performed:true,
    validation_scope:"policy_target_scope_human_authority_binding_consistency",
    policy_binding_validated:true,
    target_binding_validated:true,
    scope_binding_validated:true,
    human_authority_binding_validated:true,
    validation_effect:"NO_EXECUTION_AUTHORIZATION",
    does_not_complete_binding:true,
    does_not_unlock_recovery_execution:true
  },
  recovery_execution_authority_binding:{
    required:true,
    requested:true,
    received:true,
    defined:true,
    validated:true,
    bound:false,
    completed:false,
    policy_binding_present:true,
    policy_binding_validated:true,
    target_binding_present:true,
    target_binding_validated:true,
    scope_binding_present:true,
    scope_binding_validated:true,
    human_authority_binding_present:true,
    human_authority_binding_validated:true,
    binding_effect:"NO_EXECUTION_AUTHORIZATION"
  },
  recovery_execution:{
    allowed:false,
    performed:false,
    blocked_by:"RECOVERY_EXECUTION_AUTHORITY_BINDING_NOT_COMPLETED"
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
  previous_program:"PROG-144",
  next_required_program:NEXT
};

assert.equal(a.recovery_execution_authority_binding_validation.performed,true);
assert.equal(a.recovery_execution_authority_binding.validated,true);
assert.equal(a.recovery_execution_authority_binding.bound,false);
assert.equal(a.recovery_execution_authority_binding.completed,false);
assert.equal(a.recovery_execution.allowed,false);
assert.equal(a.fail_closed.fail_closed_remains_active,true);
assert.equal(a.authority.ai_authority_allowed,false);

fs.writeFileSync(JSON_OUT,JSON.stringify(stable(a),null,2)+"\n");
fs.writeFileSync(MD_OUT,`# ${a.title}

Program: \`${ID}\`

Status: \`${STATUS}\`

Source: \`${SRC}\`

PROG-145 validates recovery execution authority binding material.

Validation is not completed binding, not recovery execution authorization, and not readiness unlock. Recovery execution remains blocked and fail-closed remains active.

Next required program: \`${NEXT}\`
`);
console.log("PROG_145_BUILDER_RUN=PASS");
