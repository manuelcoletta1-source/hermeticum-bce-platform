const fs=require("fs"),crypto=require("crypto"),assert=require("assert/strict");
const SRC="docs/launch/level1/prog-134-level1-public-surface-observation-human-action-completion-recovery-decision-human-decision-completion-gate.json";
const JSON_OUT="docs/launch/level1/prog-135-level1-public-surface-observation-human-action-completion-recovery-decision-human-decision-acknowledgment-retry-request.json";
const MD_OUT="docs/launch/level1/prog-135-level1-public-surface-observation-human-action-completion-recovery-decision-human-decision-acknowledgment-retry-request.md";
const ID="PROG-135-HBCE-LEVEL1-PUBLIC-SURFACE-OBSERVATION-HUMAN-ACTION-COMPLETION-RECOVERY-DECISION-HUMAN-DECISION-ACKNOWLEDGMENT-RETRY-REQUEST";
const STATUS="LEVEL1_PUBLIC_SURFACE_OBSERVATION_HUMAN_ACTION_COMPLETION_RECOVERY_DECISION_HUMAN_DECISION_ACKNOWLEDGMENT_RETRY_REQUEST_ISSUED_PENDING_ACKNOWLEDGMENT";
const NEXT="PROG-136-HBCE-LEVEL1-PUBLIC-SURFACE-OBSERVATION-HUMAN-ACTION-COMPLETION-RECOVERY-DECISION-HUMAN-DECISION-ACKNOWLEDGMENT-RETRY-ACKNOWLEDGMENT";
const sha=p=>crypto.createHash("sha256").update(fs.readFileSync(p)).digest("hex");
const stable=v=>Array.isArray(v)?v.map(stable):v&&typeof v==="object"?Object.fromEntries(Object.keys(v).sort().map(k=>[k,stable(v[k])])):v;
const src=JSON.parse(fs.readFileSync(SRC,"utf8"));
const srcId=src.program_id||src.programId||src.id||src.program||"PROG-134-SOURCE-BOUND-BY-PATH-AND-HASH";
assert.ok(fs.existsSync(SRC));
const a={program_id:ID,program_number:135,title:"Level 1 Public Surface Observation Human Action Completion Recovery Decision Human Decision Acknowledgment Retry Request",status:STATUS,inherits_from:{program_id:String(srcId),expected_source_program:"PROG-134",source_path:SRC,source_raw_sha256:sha(SRC),source_canonical_sha256:crypto.createHash("sha256").update(JSON.stringify(stable(src))).digest("hex")},retry_request:{issued:true,issued_for:"human_decision_acknowledgment",status:"ISSUED_PENDING_ACKNOWLEDGMENT",does_not_unlock_state:true,does_not_authorize_recovery_execution:true,does_not_create_human_decision:true,does_not_validate_human_decision:true},human_decision_acknowledgment:{required:true,retry_requested:true,received:false,validated:false},human_decision_response:{received:false,validated:false},human_decision:{recorded:false,validated:false,selected_recovery_decision_option:null},recovery_execution:{allowed:false,performed:false},fail_closed:{fail_closed_snapshot_active:true,fail_closed_remains_active:true,no_state_unlock:true},readiness:{external_customer_ready:false,banking_pack_ready:false,level1_launch_ready:false,production_ready:false},authority:{ai_authority_allowed:false,human_authority_required:true,legal_validity_claimed:false,accreditation_claimed:false,procurement_eligibility_claimed:false},constraints:{no_readiness_unlock:true,no_ai_authority:true,no_legal_validity:true,no_accreditation:true,no_procurement_eligibility:true},previous_program:"PROG-134",next_required_program:NEXT};
assert.equal(a.retry_request.issued,true);assert.equal(a.human_decision_acknowledgment.received,false);assert.equal(a.human_decision.recorded,false);assert.equal(a.recovery_execution.allowed,false);assert.equal(a.fail_closed.fail_closed_remains_active,true);assert.equal(a.readiness.level1_launch_ready,false);assert.equal(a.authority.ai_authority_allowed,false);
fs.writeFileSync(JSON_OUT,JSON.stringify(stable(a),null,2)+"\n");
fs.writeFileSync(MD_OUT,`# ${a.title}

Program: \`${ID}\`

Status: \`${STATUS}\`

Source: \`${SRC}\`

Source raw SHA-256: \`${a.inherits_from.source_raw_sha256}\`

Source canonical SHA-256: \`${a.inherits_from.source_canonical_sha256}\`

PROG-135 issues a retry request for the missing human decision acknowledgment inherited from PROG-134.

The retry request does not unlock state, does not authorize recovery execution, does not create or validate a human decision, and keeps fail-closed active.

Next required program: \`${NEXT}\`
`);
console.log("PROG_135_BUILDER_RUN=PASS");
