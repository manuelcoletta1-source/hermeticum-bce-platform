const fs=require("fs"),crypto=require("crypto"),assert=require("assert/strict");
const SRC="docs/launch/level1/prog-136-level1-public-surface-observation-human-action-completion-recovery-decision-human-decision-acknowledgment-retry-acknowledgment.json";
const JSON_OUT="docs/launch/level1/prog-137-level1-public-surface-observation-human-action-completion-recovery-decision-human-decision-response-request.json";
const MD_OUT="docs/launch/level1/prog-137-level1-public-surface-observation-human-action-completion-recovery-decision-human-decision-response-request.md";
const ID="PROG-137-HBCE-LEVEL1-PUBLIC-SURFACE-OBSERVATION-HUMAN-ACTION-COMPLETION-RECOVERY-DECISION-HUMAN-DECISION-RESPONSE-REQUEST";
const STATUS="LEVEL1_PUBLIC_SURFACE_OBSERVATION_HUMAN_ACTION_COMPLETION_RECOVERY_DECISION_HUMAN_DECISION_RESPONSE_REQUESTED_PENDING_HUMAN_DECISION_RESPONSE";
const NEXT="PROG-138-HBCE-LEVEL1-PUBLIC-SURFACE-OBSERVATION-HUMAN-ACTION-COMPLETION-RECOVERY-DECISION-HUMAN-DECISION-RESPONSE-RECEIPT";
const sha=p=>crypto.createHash("sha256").update(fs.readFileSync(p)).digest("hex");
const stable=v=>Array.isArray(v)?v.map(stable):v&&typeof v==="object"?Object.fromEntries(Object.keys(v).sort().map(k=>[k,stable(v[k])])):v;
const src=JSON.parse(fs.readFileSync(SRC,"utf8"));
assert.equal(src.program_number,136);
assert.equal(src.human_decision_acknowledgment.received,true);
assert.equal(src.human_decision_acknowledgment.validated,true);
assert.equal(src.human_decision_acknowledgment.authorization_effect,false);
assert.equal(src.human_decision_response.received,false);
assert.equal(src.recovery_execution.allowed,false);
assert.equal(src.fail_closed.fail_closed_remains_active,true);
assert.equal(src.authority.ai_authority_allowed,false);
const a={program_id:ID,program_number:137,title:"Level 1 Public Surface Observation Human Action Completion Recovery Decision Human Decision Response Request",status:STATUS,level3_axis:{principle:"decision_request_is_not_authorization",acknowledgment_is_not_authorization:true,response_request_is_not_response:true,external_action_effect_allowed:false},inherits_from:{program_id:src.program_id,source_path:SRC,source_raw_sha256:sha(SRC),source_canonical_sha256:crypto.createHash("sha256").update(JSON.stringify(stable(src))).digest("hex")},human_decision_response_request:{issued:true,requested_for:"human_recovery_decision_response",status:"REQUESTED_PENDING_RESPONSE",does_not_unlock_state:true,does_not_authorize_recovery_execution:true,does_not_create_human_decision:true,does_not_validate_human_decision:true},human_decision_acknowledgment:{received:true,validated:true,authorization_effect:false},human_decision_response:{required:true,requested:true,received:false,validated:false},human_decision:{recorded:false,validated:false,selected_recovery_decision_option:null},recovery_execution:{allowed:false,performed:false},fail_closed:{fail_closed_snapshot_active:true,fail_closed_remains_active:true,no_state_unlock:true},readiness:{external_customer_ready:false,banking_pack_ready:false,level1_launch_ready:false,production_ready:false},authority:{ai_authority_allowed:false,human_authority_required:true,legal_validity_claimed:false,accreditation_claimed:false,procurement_eligibility_claimed:false},constraints:{no_readiness_unlock:true,no_ai_authority:true,no_legal_validity:true,no_accreditation:true,no_procurement_eligibility:true},previous_program:"PROG-136",next_required_program:NEXT};
assert.equal(a.human_decision_response_request.issued,true);
assert.equal(a.human_decision_response.received,false);
assert.equal(a.human_decision.recorded,false);
assert.equal(a.recovery_execution.allowed,false);
assert.equal(a.fail_closed.fail_closed_remains_active,true);
assert.equal(a.readiness.level1_launch_ready,false);
assert.equal(a.authority.ai_authority_allowed,false);
fs.writeFileSync(JSON_OUT,JSON.stringify(stable(a),null,2)+"\n");
fs.writeFileSync(MD_OUT,`# ${a.title}

Program: \`${ID}\`

Status: \`${STATUS}\`

Source: \`${SRC}\`

PROG-137 requests the human decision response after PROG-136 acknowledged visibility only.

The response request is not a response, not a decision, and not authorization. Recovery execution remains blocked. Fail-closed remains active.

Next required program: \`${NEXT}\`
`);
console.log("PROG_137_BUILDER_RUN=PASS");
