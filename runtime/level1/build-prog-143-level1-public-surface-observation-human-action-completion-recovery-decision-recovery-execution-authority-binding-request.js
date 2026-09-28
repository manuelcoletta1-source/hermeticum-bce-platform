const fs=require("fs"),crypto=require("crypto"),assert=require("assert/strict");
const SRC="docs/launch/level1/prog-142-level1-public-surface-observation-human-action-completion-recovery-decision-recovery-execution-authority-binding-gate.json";
const JSON_OUT="docs/launch/level1/prog-143-level1-public-surface-observation-human-action-completion-recovery-decision-recovery-execution-authority-binding-request.json";
const MD_OUT="docs/launch/level1/prog-143-level1-public-surface-observation-human-action-completion-recovery-decision-recovery-execution-authority-binding-request.md";
const ID="PROG-143-HBCE-LEVEL1-PUBLIC-SURFACE-OBSERVATION-HUMAN-ACTION-COMPLETION-RECOVERY-DECISION-RECOVERY-EXECUTION-AUTHORITY-BINDING-REQUEST";
const STATUS="LEVEL1_PUBLIC_SURFACE_OBSERVATION_HUMAN_ACTION_COMPLETION_RECOVERY_DECISION_RECOVERY_EXECUTION_AUTHORITY_BINDING_REQUESTED_PENDING_BINDING_RECEIPT";
const NEXT="PROG-144-HBCE-LEVEL1-PUBLIC-SURFACE-OBSERVATION-HUMAN-ACTION-COMPLETION-RECOVERY-DECISION-RECOVERY-EXECUTION-AUTHORITY-BINDING-RECEIPT";
const sha=p=>crypto.createHash("sha256").update(fs.readFileSync(p)).digest("hex");
const stable=v=>Array.isArray(v)?v.map(stable):v&&typeof v==="object"?Object.fromEntries(Object.keys(v).sort().map(k=>[k,stable(v[k])])):v;

const src=JSON.parse(fs.readFileSync(SRC,"utf8"));
assert.equal(src.program_number,142);
assert.equal(src.human_decision.recorded,true);
assert.equal(src.human_decision.validated,true);
assert.equal(src.recovery_execution_authority_binding_gate.blocked,true);
assert.equal(src.recovery_execution_authority_binding.bound,false);
assert.equal(src.recovery_execution.allowed,false);
assert.equal(src.fail_closed.fail_closed_remains_active,true);
assert.equal(src.authority.ai_authority_allowed,false);

const a={
  program_id:ID,
  program_number:143,
  title:"Level 1 Public Surface Observation Human Action Completion Recovery Decision Recovery Execution Authority Binding Request",
  status:STATUS,
  level3_axis:{
    principle:"authority_binding_request_is_not_authority_binding",
    request_does_not_create_binding:true,
    request_does_not_authorize_recovery_execution:true,
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
    block_reason:"RECOVERY_EXECUTION_AUTHORITY_BINDING_MISSING"
  },
  recovery_execution_authority_binding_request:{
    issued:true,
    requested_for:"policy_target_scope_human_authority_binding",
    request_status:"REQUESTED_PENDING_BINDING_RECEIPT",
    request_effect:"NO_EXECUTION_AUTHORIZATION",
    does_not_create_binding:true,
    does_not_validate_binding:true,
    does_not_unlock_recovery_execution:true
  },
  recovery_execution_authority_binding:{
    required:true,
    requested:true,
    received:false,
    defined:false,
    validated:false,
    bound:false,
    policy_binding_present:false,
    target_binding_present:false,
    scope_binding_present:false,
    human_authority_binding_present:false
  },
  recovery_execution:{
    allowed:false,
    performed:false,
    blocked_by:"RECOVERY_EXECUTION_AUTHORITY_BINDING_MISSING"
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
  previous_program:"PROG-142",
  next_required_program:NEXT
};

assert.equal(a.recovery_execution_authority_binding_request.issued,true);
assert.equal(a.recovery_execution_authority_binding.received,false);
assert.equal(a.recovery_execution_authority_binding.bound,false);
assert.equal(a.recovery_execution.allowed,false);
assert.equal(a.fail_closed.fail_closed_remains_active,true);
assert.equal(a.authority.ai_authority_allowed,false);

fs.writeFileSync(JSON_OUT,JSON.stringify(stable(a),null,2)+"\n");
fs.writeFileSync(MD_OUT,`# ${a.title}

Program: \`${ID}\`

Status: \`${STATUS}\`

Source: \`${SRC}\`

PROG-143 issues the recovery execution authority binding request.

The request is not authority binding, not validation, and not recovery execution authorization. Recovery execution remains blocked and fail-closed remains active.

Next required program: \`${NEXT}\`
`);
console.log("PROG_143_BUILDER_RUN=PASS");
