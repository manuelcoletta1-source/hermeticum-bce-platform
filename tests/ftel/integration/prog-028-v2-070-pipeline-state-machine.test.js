'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { sha256Digest } = require('../../../packages/hbce-core/canonical-json.js');

const root = path.resolve(__dirname, '../../..');
const read = (p) => fs.readFileSync(path.join(root, p), 'utf8');
const json = (p) => JSON.parse(read(p));

const registryPath = 'docs/launch/level1/market/v2-066-github-lead-registry.json';
const qualificationPath = 'docs/launch/level1/market/v2-067-qualification-guards.json';
const interlocutorPath = 'docs/launch/level1/market/v2-068-interlocutor-mapping.json';
const outreachPath = 'docs/launch/level1/market/v2-069-outreach-claim-guard.json';
const pipelinePath = 'docs/launch/level1/market/v2-070-pipeline-state-machine.json';
const mdPath = 'docs/launch/level1/market/v2-070-pipeline-state-machine.md';

for (const p of [registryPath, qualificationPath, interlocutorPath, outreachPath, pipelinePath, mdPath]) {
  assert.equal(fs.existsSync(path.join(root, p)), true, `${p} must exist`);
}

const registry = json(registryPath);
const qualification = json(qualificationPath);
const interlocutor = json(interlocutorPath);
const outreach = json(outreachPath);
const pipeline = json(pipelinePath);
const md = read(mdPath);

assert.equal(pipeline.proto, 'HBCE-P0-MARKET-V2-070-PIPELINE-STATE-MACHINE-v1');
assert.equal(pipeline.kind, 'HBCE_P0_MARKET_V2_070_PIPELINE_STATE_MACHINE');
assert.equal(pipeline.issue_id, 'V2-070');
assert.equal(pipeline.priority, 'P0-MARKET');
assert.equal(pipeline.depends_on.includes('V2-066'), true);
assert.equal(pipeline.depends_on.includes('V2-067'), true);
assert.equal(pipeline.depends_on.includes('V2-068'), true);
assert.equal(pipeline.depends_on.includes('V2-069'), true);
assert.equal(pipeline.market_gate, 'G9_MARKET_INGRESSION_OPERATIONAL');

assert.equal(pipeline.source_github_lead_registry_revision_hash, registry.revision_hash);
assert.equal(pipeline.source_qualification_guards_revision_hash, qualification.revision_hash);
assert.equal(pipeline.source_interlocutor_mapping_revision_hash, interlocutor.revision_hash);
assert.equal(pipeline.source_outreach_claim_guard_revision_hash, outreach.revision_hash);

const body = { ...pipeline };
delete body.revision_hash;
assert.equal(pipeline.revision_hash, sha256Digest(body));

assert.equal(pipeline.status, 'INITIALIZED_NOT_READY');
assert.equal(pipeline.readiness_status, 'BLOCKED');
assert.equal(pipeline.g9_ready, false);
assert.equal(pipeline.pipeline_state_machine_initialized, true);
assert.equal(pipeline.transition_guarding_enabled, true);
assert.equal(pipeline.audit_history_required, true);
assert.equal(pipeline.opt_out_enforced, true);
assert.equal(pipeline.external_effects_require_human_approval, true);
assert.equal(pipeline.market_metrics_modify_technical_verdicts, false);

for (const state of [
  'DISCOVERED',
  'TECHNICALLY_RELEVANT',
  'ORG_VERIFIED',
  'ROLE_IDENTIFIED',
  'QUALIFIED',
  'OUTREACH_READY',
  'CONTACTED',
  'DISCOVERY',
  'PILOT_CANDIDATE',
  'PARKED',
  'CLOSED',
  'DO_NOT_CONTACT'
]) {
  assert.equal(pipeline.states.includes(state), true, `${state} must exist`);
}

const transitionKey = (t) => `${t.from}->${t.to}`;
const transitions = new Map(pipeline.transitions.map((t) => [transitionKey(t), t]));
assert.equal(transitions.has('QUALIFIED->OUTREACH_READY'), true);
assert.equal(transitions.has('OUTREACH_READY->CONTACTED'), true);
assert.equal(transitions.has('CONTACTED->DISCOVERY'), true);
assert.equal(transitions.has('DISCOVERY->PILOT_CANDIDATE'), true);
assert.equal(transitions.get('OUTREACH_READY->CONTACTED').external_effect, true);
assert.equal(transitions.get('QUALIFIED->OUTREACH_READY').requires.includes('Manuel_approval'), true);
assert.equal(transitions.get('OUTREACH_READY->CONTACTED').requires.includes('approval_ref'), true);
assert.equal(transitions.get('CONTACTED->DISCOVERY').requires.includes('real_interaction'), true);

const universal = new Map(pipeline.universal_transitions.map((t) => [t.to, t]));
assert.equal(universal.has('DO_NOT_CONTACT'), true);
assert.equal(universal.get('DO_NOT_CONTACT').terminal_contact_block, true);

for (const code of [
  'HUMAN_APPROVAL_REQUIRED',
  'DO_NOT_CONTACT',
  'LEAD_STALE',
  'SOURCE_UNAVAILABLE',
  'MARKET_TECHNICAL_BOUNDARY_VIOLATION',
  'SNAPSHOT_INVALID'
]) {
  assert.equal(pipeline.reason_codes.includes(code), true, `${code} reason code must exist`);
}

assert.equal(pipeline.audit_event_contract.event_id, 'required stable id');
assert.equal(pipeline.audit_event_contract.previous_event_hash, 'required except first event');
assert.equal(pipeline.audit_event_contract.approval_ref, 'required for states with external effects or outreach readiness');
assert.equal(pipeline.audit_event_contract.message_ref_or_hash, 'required for CONTACTED');

const blocked = new Map(pipeline.blocked_transition_fixtures.map((f) => [`${f.from}->${f.to}`, f.expected_result]));
assert.equal(blocked.get('TECHNICALLY_RELEVANT->OUTREACH_READY'), 'PIPELINE_BLOCKED');
assert.equal(blocked.get('OUTREACH_READY->CONTACTED'), 'PIPELINE_BLOCKED');
assert.equal(blocked.get('CONTACTED->DISCOVERY'), 'PIPELINE_BLOCKED');
assert.equal(blocked.get('ANY->DO_NOT_CONTACT'), 'DO_NOT_CONTACT_BLOCK');
assert.equal(blocked.get('ANY->ANY'), 'SNAPSHOT_INVALID');

const controls = new Map(pipeline.t153_t157_t160_controls.map((c) => [c.test_id, c.expected_result]));
assert.equal(controls.get('T153'), 'PIPELINE_BLOCKED');
assert.equal(controls.get('T155'), 'REVALIDATION_REQUIRED');
assert.equal(controls.get('T156'), 'DO_NOT_CONTACT_BLOCK');
assert.equal(controls.get('T157'), 'SOURCE_UNAVAILABLE_PRESERVE_PRIOR_OBSERVATION');
assert.equal(controls.get('T160'), 'SNAPSHOT_INVALID');

assert.equal(pipeline.current_registry_evaluation.length, registry.lead_records.length);
for (const item of pipeline.current_registry_evaluation) {
  assert.equal(item.transition_allowed_to_outreach_ready, false);
  assert.equal(item.transition_allowed_to_contacted, false);
  assert.equal(item.reason_codes.includes('HUMAN_APPROVAL_REQUIRED'), true);
}

assert.equal(pipeline.non_claims.g9_market_ingression_operational, false);
assert.equal(pipeline.non_claims.outreach_ready, false);
assert.equal(pipeline.non_claims.contacted, false);
assert.equal(pipeline.non_claims.pilot_readiness, false);
assert.equal(pipeline.non_claims.customer_or_client_existence, false);

assert.match(md, /governed market pipeline state machine/);
assert.match(md, /Every transition requires an auditable event/);
assert.match(md, /DO_NOT_CONTACT/);
assert.match(md, /does not claim G9 readiness/);

console.log('PASS PROG-028-V2-070-DOCS-EXIST');
console.log('PASS PROG-028-V2-070-HASH-STABLE');
console.log('PASS PROG-028-V2-070-DEPENDS-ON-V2-066-V2-067-V2-068-V2-069');
console.log('PASS PROG-028-V2-070-PIPELINE-STATES-RECORDED');
console.log('PASS PROG-028-V2-070-TRANSITIONS-RECORDED');
console.log('PASS PROG-028-V2-070-AUDIT-HISTORY-REQUIRED');
console.log('PASS PROG-028-V2-070-OPT-OUT-ENFORCED');
console.log('PASS PROG-028-V2-070-REASON-CODES-RECORDED');
console.log('PASS PROG-028-V2-070-T153-T157-T160-CONTROLS-RECORDED');
console.log('PASS PROG-028-V2-070-NO-G9-OR-CONTACT-CLAIM');
