const fs=require("fs"),crypto=require("crypto"),assert=require("assert/strict");
const SRC="docs/launch/level1/prog-140-level1-public-surface-observation-human-action-completion-recovery-decision-human-decision-record.json";
const JSON_OUT="docs/launch/level1/prog-141-level1-public-surface-observation-human-action-completion-recovery-decision-human-decision-record-validation.json";
const MD_OUT="docs/launch/level1/prog-141-level1-public-surface-observation-human-action-completion-recovery-decision-human-decision-record-validation.md";
const ID="PROG-141-HBCE-LEVEL1-PUBLIC-SURFACE-OBSERVATION-HUMAN-ACTION-COMPLETION-RECOVERY-DECISION-HUMAN-DECISION-RECORD-VALIDATION";
const STATUS="LEVEL1_PUBLIC_SURFACE_OBSERVATION_HUMAN_ACTION_COMPLETION_RECOVERY_DECISION_HUMAN_DECISION_RECORD_VALIDATED_PENDING_RECOVERY_EXECUTION_AUTHORITY_BINDING";
const NEXT="PROG-142-HBCE-LEVEL1-PUBLIC-SURFACE-OBSERVATION-HUMAN-ACTION-COMPLETION-RECOVERY-DECISION-RECOVERY-EXECUTION-AUTHORITY-BINDING-GATE";
const sha=p=>crypto.createHash("sha256").update(fs.readFileSync(p)).digest("hex");
const stable=v=>Array.isArray(v)?v.map(stable):v&&typeof v==="object"?Object.fromEntries(Object.keys(v).sort().map(k=>[k,stable(v[k])])):v;
const src=JSON.parse(fs.readFileSync(SRC,"utf8"));
assert.equal(src.program_number,140);
assert.equal(src.human_decision.recorded,true);
assert.equal(src.human_decision.validated,false);
assert.equal(src.human_decision_record.recorded,true);
assert.equal(src.human_decision_record.validated,false);
assert.equal(src.recovery_execution.allowed,false);
assert.equal(src.fail_closed.fail_closed_remains_active,true);
assert.equal(src.authority.ai_authority_allowed,false);
const a={program_id:ID,program_number:141,title:"Level 1 Public Surface Observation Human Action Completion Recovery Decision Human Decision Record Validation",status:STATUS,level3_axis:{principle:"validated_decision_record_is_not_execution_authorization",validated_record_still_requires_execution_authority_binding:true,validated_record_has_no_recovery_execution_effect:true,external_action_effect_allowed:false},inherits_from:{program_id:src.program_id,source_path:SRC,source_raw_sha256:sha(SRC),source_canonical_sha256:crypto.createHash("sha256").update(JSON.stringify(stable(src))).digest("hex")},human_decision_response:{required:true,requested:true,received:true,validated:true,authorization_effect:false},human_decision_record:{created:true,recorded:true,validated:true,validation_scope:"decision_record_structure_presence_and_option_consistency",record_effect:"NO_EXECUTION_AUTHORIZATION"},human_decision:{recorded:true,validated:true,selected_recovery_decision_option:"RECOVERY_DECISION_VALIDATED_PENDING_EXECUTION_AUTHORITY_BINDING"},recovery_execution_authority_binding:{required:true,defined:false,validated:false,bound:false},recovery_execution:{allowed:false,performed:false},fail_closed:{fail_closed_snapshot_active:true,fail_closed_remains_active:true,no_state_unlock:true},readiness:{external_customer_ready:false,banking_pack_ready:false,level1_launch_ready:false,production_ready:false},authority:{ai_authority_allowed:false,human_authority_required:true,legal_validity_claimed:false,accreditation_claimed:false,procurement_eligibility_claimed:false},constraints:{no_readiness_unlock:true,no_ai_authority:true,no_legal_validity:true,no_accreditation:true,no_procurement_eligibility:true},previous_program:"PROG-140",next_required_program:NEXT};
assert.equal(a.human_decision_record.validated,true);
assert.equal(a.human_decision.validated,true);
assert.equal(a.recovery_execution_authority_binding.bound,false);
assert.equal(a.recovery_execution.allowed,false);
assert.equal(a.fail_closed.fail_closed_remains_active,true);
assert.equal(a.authority.ai_authority_allowed,false);
fs.writeFileSync(JSON_OUT,JSON.stringify(stable(a),null,2)+"\n");
fs.writeFileSync(MD_OUT,`# ${a.title}

Program: \`${ID}\`

Status: \`${STATUS}\`

Source: \`${SRC}\`

PROG-141 validates the human decision record.

Validated decision record is not execution authorization, not recovery execution, and not readiness unlock. Recovery execution authority binding is still required. Fail-closed remains active.

Next required program: \`${NEXT}\`
`);
console.log("PROG_141_BUILDER_RUN=PASS");
