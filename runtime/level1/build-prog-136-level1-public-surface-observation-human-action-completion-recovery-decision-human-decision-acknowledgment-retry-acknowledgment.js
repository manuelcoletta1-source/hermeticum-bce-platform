const fs=require("fs"),crypto=require("crypto"),assert=require("assert/strict");
const SRC="docs/launch/level1/prog-135-level1-public-surface-observation-human-action-completion-recovery-decision-human-decision-acknowledgment-retry-request.json";
const JSON_OUT="docs/launch/level1/prog-136-level1-public-surface-observation-human-action-completion-recovery-decision-human-decision-acknowledgment-retry-acknowledgment.json";
const MD_OUT="docs/launch/level1/prog-136-level1-public-surface-observation-human-action-completion-recovery-decision-human-decision-acknowledgment-retry-acknowledgment.md";
const ID="PROG-136-HBCE-LEVEL1-PUBLIC-SURFACE-OBSERVATION-HUMAN-ACTION-COMPLETION-RECOVERY-DECISION-HUMAN-DECISION-ACKNOWLEDGMENT-RETRY-ACKNOWLEDGMENT";
const STATUS="LEVEL1_PUBLIC_SURFACE_OBSERVATION_HUMAN_ACTION_COMPLETION_RECOVERY_DECISION_HUMAN_DECISION_ACKNOWLEDGMENT_RETRY_ACKNOWLEDGED_PENDING_HUMAN_DECISION_RESPONSE";
const NEXT="PROG-137-HBCE-LEVEL1-PUBLIC-SURFACE-OBSERVATION-HUMAN-ACTION-COMPLETION-RECOVERY-DECISION-HUMAN-DECISION-RESPONSE-REQUEST";
const sha=p=>crypto.createHash("sha256").update(fs.readFileSync(p)).digest("hex");
const stable=v=>Array.isArray(v)?v.map(stable):v&&typeof v==="object"?Object.fromEntries(Object.keys(v).sort().map(k=>[k,stable(v[k])])):v;
const src=JSON.parse(fs.readFileSync(SRC,"utf8"));
assert.equal(src.program_number,135);
assert.equal(src.retry_request.issued,true);
assert.equal(src.human_decision_acknowledgment.received,false);
assert.equal(src.recovery_execution.allowed,false);
assert.equal(src.fail_closed.fail_closed_remains_active,true);
assert.equal(src.authority.ai_authority_allowed,false);
const a={program_id:ID,program_number:136,title:"Level 1 Public Surface Observation Human Action Completion Recovery Decision Human Decision Acknowledgment Retry Acknowledgment",status:STATUS,level3_axis:{principle:"acknowledgment_is_not_authorization",external_action_effect_allowed:false,technical_access_is_not_authority:true,human_visibility_is_not_human_decision:true},inherits_from:{program_id:src.program_id,source_path:SRC,source_raw_sha256:sha(SRC),source_canonical_sha256:crypto.createHash("sha256").update(JSON.stringify(stable(src))).digest("hex")},retry_request:{inherited_issued:true,acknowledged:true,acknowledgment_received:true,acknowledgment_validated:true,acknowledgment_scope:"retry_request_visibility_only",does_not_unlock_state:true,does_not_authorize_recovery_execution:true,does_not_create_human_decision:true,does_not_validate_human_decision:true},human_decision_acknowledgment:{required:true,retry_acknowledged:true,received:true,validated:true,authorization_effect:false},human_decision_response:{required:true,requested:false,received:false,validated:false},human_decision:{recorded:false,validated:false,selected_recovery_decision_option:null},recovery_execution:{allowed:false,performed:false},fail_closed:{fail_closed_snapshot_active:true,fail_closed_remains_active:true,no_state_unlock:true},readiness:{external_customer_ready:false,banking_pack_ready:false,level1_launch_ready:false,production_ready:false},authority:{ai_authority_allowed:false,human_authority_required:true,legal_validity_claimed:false,accreditation_claimed:false,procurement_eligibility_claimed:false},constraints:{no_readiness_unlock:true,no_ai_authority:true,no_legal_validity:true,no_accreditation:true,no_procurement_eligibility:true},previous_program:"PROG-135",next_required_program:NEXT};
assert.equal(a.retry_request.acknowledgment_received,true);
assert.equal(a.retry_request.acknowledgment_validated,true);
assert.equal(a.retry_request.does_not_authorize_recovery_execution,true);
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

Source raw SHA-256: \`${a.inherits_from.source_raw_sha256}\`

Source canonical SHA-256: \`${a.inherits_from.source_canonical_sha256}\`

## Level 3 axis

Acknowledgment is not authorization.

PROG-136 validates that the human acknowledgment of the retry request has been received, but this acknowledgment only confirms visibility of the retry request. It does not create a human decision, does not validate a human decision, does not authorize recovery execution, and does not allow any external action effect.

Fail-closed remains active.

Next required program: \`${NEXT}\`
`);
console.log("PROG_136_BUILDER_RUN=PASS");
