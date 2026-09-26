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
const pipelinePath = 'docs/launch/level1/market/v2-070-pipeline-state-machine.json';
const separationPath = 'docs/launch/level1/market/v2-071-market-technical-separation.json';
const bridgePath = 'docs/launch/level1/market/v2-072-buyer-feedback-bridge.json';
const mdPath = 'docs/launch/level1/market/v2-072-buyer-feedback-bridge.md';

for (const p of [registryPath, qualificationPath, pipelinePath, separationPath, bridgePath, mdPath]) {
  assert.equal(fs.existsSync(path.join(root, p)), true, `${p} must exist`);
}

const registry = json(registryPath);
const qualification = json(qualificationPath);
const pipeline = json(pipelinePath);
const separation = json(separationPath);
const bridge = json(bridgePath);
const md = read(mdPath);

assert.equal(bridge.proto, 'HBCE-P0-MARKET-V2-072-BUYER-FEEDBACK-BRIDGE-v1');
assert.equal(bridge.kind, 'HBCE_P0_MARKET_V2_072_BUYER_FEEDBACK_BRIDGE');
assert.equal(bridge.issue_id, 'V2-072');
assert.equal(bridge.priority, 'P0-MARKET');
assert.equal(bridge.depends_on.includes('V2-066'), true);
assert.equal(bridge.depends_on.includes('V2-067'), true);
assert.equal(bridge.depends_on.includes('V2-070'), true);
assert.equal(bridge.depends_on.includes('V2-071'), true);
assert.equal(bridge.market_gate, 'G9_MARKET_INGRESSION_OPERATIONAL');

assert.equal(bridge.source_github_lead_registry_revision_hash, registry.revision_hash);
assert.equal(bridge.source_qualification_guards_revision_hash, qualification.revision_hash);
assert.equal(bridge.source_pipeline_state_machine_revision_hash, pipeline.revision_hash);
assert.equal(bridge.source_market_technical_separation_revision_hash, separation.revision_hash);

const body = { ...bridge };
delete body.revision_hash;
assert.equal(bridge.revision_hash, sha256Digest(body));

assert.equal(bridge.status, 'INITIALIZED_NOT_READY');
assert.equal(bridge.readiness_status, 'BLOCKED');
assert.equal(bridge.g9_ready, false);
assert.equal(bridge.buyer_feedback_bridge_initialized, true);
assert.equal(bridge.feedback_recording_enabled, true);
assert.equal(bridge.automatic_product_change_allowed, false);
assert.equal(bridge.automatic_technical_gate_promotion_allowed, false);
assert.equal(bridge.automatic_profile_satisfied_mutation_allowed, false);
assert.equal(bridge.automatic_public_claim_change_allowed, false);
assert.equal(bridge.human_triage_required, true);
assert.equal(bridge.change_control_required, true);
assert.equal(bridge.market_technical_boundary_preserved, true);

assert.equal(bridge.feedback_record_contract.feedback_id, 'required stable id');
assert.equal(bridge.feedback_record_contract.source_lead_id, 'required');
assert.equal(bridge.feedback_record_contract.source_event_ref, 'required');
assert.equal(bridge.feedback_record_contract.buyer_problem_statement, 'required');
assert.equal(bridge.feedback_record_contract.triage_status, 'OBSERVED');

for (const state of [
  'OBSERVED',
  'TRIAGED',
  'BACKLOG_CANDIDATE',
  'CHANGE_REQUEST_CANDIDATE',
  'MATRIX_IMPACT_CANDIDATE',
  'CLAIM_SET_REVIEW_CANDIDATE',
  'ACCEPTED_FOR_BUILD_REVIEW',
  'REJECTED',
  'PARKED'
]) {
  assert.equal(bridge.allowed_feedback_states.includes(state), true, `${state} must exist`);
}

const rules = new Map(bridge.bridge_rules.map((r) => [r.rule_id, r.failure_result]));
assert.equal(rules.get('FEEDBACK_REQUIRES_BUYER_PROBLEM_EVIDENCE'), 'FEEDBACK_REJECTED');
assert.equal(rules.get('NO_FEEDBACK_TO_TECHNICAL_GATE'), 'MARKET_TECHNICAL_BOUNDARY_VIOLATION');
assert.equal(rules.get('NO_FEEDBACK_TO_PROFILE_SATISFIED'), 'MARKET_TECHNICAL_BOUNDARY_VIOLATION');
assert.equal(rules.get('NO_PRODUCT_CHANGE_WITHOUT_CHANGE_CONTROL'), 'CHANGE_CONTROL_REQUIRED');
assert.equal(rules.get('NO_PUBLIC_CLAIM_CHANGE_WITHOUT_REVIEW'), 'CLAIM_SET_REVIEW_REQUIRED');
assert.equal(rules.get('NO_REQUIREMENT_ACCEPTANCE_WITHOUT_HUMAN_TRIAGE'), 'HUMAN_TRIAGE_REQUIRED');
assert.equal(rules.get('DO_NOT_CONTACT_LIMITS_FEEDBACK_USE'), 'DO_NOT_CONTACT_BLOCK');
assert.equal(rules.get('UNTRACEABLE_FEEDBACK_IS_INVALID'), 'SNAPSHOT_INVALID');

const effects = new Map(bridge.allowed_cross_domain_effects.map((e) => [`${e.from}->${e.to}:${e.result}`, e]));
assert.equal(effects.has('MARKET_FEEDBACK->PRODUCT_BACKLOG:BACKLOG_CANDIDATE_CREATED'), true);
assert.equal(effects.has('MARKET_FEEDBACK->CHANGE_CONTROL:CHANGE_REQUEST_CANDIDATE_CREATED'), true);
assert.equal(effects.has('MARKET_FEEDBACK->MATRIX:MATRIX_IMPACT_CANDIDATE_CREATED_NO_GATE_CHANGE'), true);
assert.equal(effects.has('MARKET_FEEDBACK->PUBLIC_SURFACE:CLAIM_SET_REVIEW_REQUIRED'), true);

const fixtures = new Map(bridge.blocked_feedback_fixtures.map((f) => [f.fixture_id, f.expected_result]));
assert.equal(fixtures.get('FB-001'), 'MARKET_TECHNICAL_BOUNDARY_VIOLATION');
assert.equal(fixtures.get('FB-002'), 'MARKET_TECHNICAL_BOUNDARY_VIOLATION');
assert.equal(fixtures.get('FB-003'), 'CLAIM_SET_REVIEW_REQUIRED');
assert.equal(fixtures.get('FB-004'), 'CHANGE_CONTROL_REQUIRED');
assert.equal(fixtures.get('FB-005'), 'SNAPSHOT_INVALID');
assert.equal(fixtures.get('FB-006'), 'DO_NOT_CONTACT_BLOCK');

assert.equal(bridge.current_feedback_queue.initialized, true);
assert.equal(bridge.current_feedback_queue.total_feedback_records, 0);
assert.equal(bridge.current_feedback_queue.backlog_candidates, 0);
assert.equal(bridge.current_feedback_queue.change_request_candidates, 0);
assert.equal(bridge.current_feedback_queue.matrix_impact_candidates, 0);

assert.equal(bridge.non_claims.g9_market_ingression_operational, false);
assert.equal(bridge.non_claims.buyer_feedback_bridge_operational, false);
assert.equal(bridge.non_claims.product_backlog_updated, false);
assert.equal(bridge.non_claims.change_request_opened, false);
assert.equal(bridge.non_claims.matrix_row_changed, false);
assert.equal(bridge.non_claims.public_claim_changed, false);
assert.equal(bridge.non_claims.technical_gate_satisfied, false);
assert.equal(bridge.non_claims.profile_satisfied, false);
assert.equal(bridge.non_claims.pilot_readiness, false);

assert.match(md, /buyer feedback bridge/);
assert.match(md, /cannot mutate product scope/);
assert.match(md, /change-control/);
assert.match(md, /does not claim G9 readiness/);

console.log('PASS PROG-030-V2-072-DOCS-EXIST');
console.log('PASS PROG-030-V2-072-HASH-STABLE');
console.log('PASS PROG-030-V2-072-DEPENDS-ON-V2-066-V2-067-V2-070-V2-071');
console.log('PASS PROG-030-V2-072-FEEDBACK-CONTRACT-RECORDED');
console.log('PASS PROG-030-V2-072-BRIDGE-RULES-RECORDED');
console.log('PASS PROG-030-V2-072-CROSS-DOMAIN-EFFECTS-LIMITED');
console.log('PASS PROG-030-V2-072-BLOCKED-FIXTURES-RECORDED');
console.log('PASS PROG-030-V2-072-CHANGE-CONTROL-REQUIRED');
console.log('PASS PROG-030-V2-072-NO-AUTOMATIC-PRODUCT-CHANGE');
console.log('PASS PROG-030-V2-072-NO-G9-OR-PRODUCT-CHANGE-CLAIM');
