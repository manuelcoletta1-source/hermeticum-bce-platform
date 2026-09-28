const fs=require("fs"),crypto=require("crypto"),assert=require("assert/strict");
const SRC="docs/launch/level1/prog-139-level1-public-surface-observation-human-action-completion-recovery-decision-human-decision-response-validation.json";
const JSON_OUT="docs/launch/level1/prog-140-level1-public-surface-observation-human-action-completion-recovery-decision-human-decision-record.json";
const MD_OUT="docs/launch/level1/prog-140-level1-public-surface-observation-human-action-completion-recovery-decision-human-decision-record.md";
const ID="PROG-140-HBCE-LEVEL1-PUBLIC-SURFACE-OBSERVATION-HUMAN-ACTION-COMPLETION-RECOVERY-DECISION-HUMAN-DECISION-RECORD";
const STATUS="LEVEL1_PUBLIC_SURFACE_OBSERVATION_HUMAN_ACTION_COMPLETION_RECOVERY_DECISION_HUMAN_DECISION_RECORDED_PENDING_DECISION_RECORD_VALIDATION";
const NEXT="PROG-141-HBCE-LEVEL1-PUBLIC-SURFACE-OBSERVATION-HUMAN-ACTION-COMPLETION-RECOVERY-DECISION-HUMAN-DECISION-RECORD-VALIDATION";
const sha=p=>crypto.createHash("sha256").update(fs.readFileSync(p)).digest("hex");
const stable=v=>Array.isArray(v)?v.map(stable):v&&typeof v==="object"?Object.fromEntries(Object.keys(v).sort().map(k=>[k,stable(v[k])])):v;
const src=JSON.parse(fs.readFileSync(SRC,"utf8"));
assert.equal(src.program_number,139);
assert.equal(src.human_decision_response.received,true);
assert.equal(src.human_decision_response.validated,true);
assert.equal(src.human_decision.recorded,false);
assert.equal(src.recovery_execution.allowed,false);
assert.equal(src.fail_closed.fail_closed_remains_active,true);
assert.equal(src.authority.ai_authority_allowed,false);
const a={program_id:ID,program_number:140,title:"Level 1 Public Surface Observation Human Action Completion Recovery Decision Human Decision Record",status:STATUS,level3_axis:{principle:"decision_record_is_not_execution_authorization",recorded_decision_still_requires_record_validation:true,recorded_decision_has_no_recovery_execution_effect:true,external_action_effect_allowed:false},inherits_from:{program_id:src.program_id,source_path:SRC,source_raw_sha256:sha(SRC),source_canonical_sha256:crypto.createHash("sha256").update(JSON.stringify(stable(src))).digest("hex")},human_decision_response:{required:true,requested:true,received:true,validated:true,validation_scope:"response_structure_and_presence_only",authorization_effect:false},human_decision_record:{created:true,recorded:true,validated:false,record_scope:"decision_record_presence_only",record_effect:"NO_EXECUTION_AUTHORIZATION"},human_decision:{recorded:true,validated:false,selected_recovery_decision_option:"RECOVERY_DECISION_RECORDED_PENDING_VALIDATION"},recovery_execution:{allowed:false,performed:false},fail_closed:{fail_closed_snapshot_active:true,fail_closed_remains_active:true,no_state_unlock:true},readiness:{external_customer_ready:false,banking_pack_ready:false,level1_launch_ready:false,production_ready:false},authority:{ai_authority_allowed:false,human_authority_required:true,legal_validity_claimed:false,accreditation_claimed:false,procurement_eligibility_claimed:false},constraints:{no_readiness_unlock:true,no_ai_authority:true,no_legal_validity:true,no_accreditation:true,no_procurement_eligibility:true},previous_program:"PROG-139",next_required_program:NEXT};
assert.equal(a.human_decision_record.recorded,true);
assert.equal(a.human_decision_record.validated,false);
assert.equal(a.human_decision.recorded,true);
assert.equal(a.human_decision.validated,false);
assert.equal(a.recovery_execution.allowed,false);
assert.equal(a.fail_closed.fail_closed_remains_active,true);
assert.equal(a.authority.ai_authority_allowed,false);
fs.writeFileSync(JSON_OUT,JSON.stringify(stable(a),null,2)+"\n");
fs.writeFileSync(MD_OUT,`# ${a.title}

Program: \`${ID}\`

Status: \`${STATUS}\`

Source: \`${SRC}\`

PROG-140 records the human decision as a decision record pending validation.

Decision record is not execution authorization, not recovery execution, and not readiness unlock. Fail-closed remains active.

Next required program: \`${NEXT}\`
`);
console.log("PROG_140_BUILDER_RUN=PASS");
