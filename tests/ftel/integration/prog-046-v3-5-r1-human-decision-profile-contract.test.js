'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { sha256Digest } = require('../../../packages/hbce-core/canonical-json.js');
const {
  APPROVAL_REQUIREMENTS,
  DECISION_STATUSES,
  FRESHNESS_STATUS,
  MATERIAL_BINDINGS,
  sampleProfile,
  sampleDecision,
  validateHumanDecisionProfile,
  validateHumanDecisionRecord,
  buildContract
} = require('../../../runtime/b2g/build-v3-5-r1-human-decision-profile-contract.js');

const root = path.resolve(__dirname, '../../..');
const read = (p) => fs.readFileSync(path.join(root, p), 'utf8');
const json = (p) => JSON.parse(read(p));
const exists = (p) => fs.existsSync(path.join(root, p));

const docPath = 'docs/launch/level2/v3-5-r1/v3-5-r1-human-decision-profile-contract.json';
const mdPath = 'docs/launch/level2/v3-5-r1/v3-5-r1-human-decision-profile-contract.md';
const runtimePath = 'runtime/b2g/build-v3-5-r1-human-decision-profile-contract.js';
const sourcePath = 'docs/launch/level2/v3-5-r1/v3-5-r1-custody-event-record-contract.json';

for (const p of [docPath, mdPath, runtimePath, sourcePath]) assert.equal(exists(p), true, `${p} must exist`);

const doc = json(docPath);
const md = read(mdPath);
const source = json(sourcePath);

assert.equal(doc.proto, 'HBCE-B2G-L2-JC2-V3-5-R1-HUMAN-DECISION-PROFILE-CONTRACT-v1');
assert.equal(doc.kind, 'HBCE_B2G_LEVEL2_JOKER_C2_V3_5_R1_HUMAN_DECISION_PROFILE_CONTRACT');
assert.equal(doc.issue_id, 'PROG-046');
assert.equal(doc.priority, 'V3.5-R1-HUMAN-DECISION-PROFILE-CONTRACT');
assert.equal(doc.source_custody_event_contract_revision_hash, source.revision_hash);
assert.equal(doc.source_custody_event_contract_revision_hash_valid, true);

const regenerated = buildContract({ rootDir: root, repositoryCommit: doc.repository_baseline_commit });
assert.deepEqual(regenerated, doc);

const body = { ...doc };
delete body.revision_hash;
assert.equal(doc.revision_hash, sha256Digest(body));

assert.equal(doc.governing_producer, 'PRODUCER::HBCE_CORE');
assert.deepEqual(doc.allowed_approval_requirements, APPROVAL_REQUIREMENTS);
assert.deepEqual(doc.allowed_decision_statuses, DECISION_STATUSES);
assert.deepEqual(doc.allowed_freshness_statuses, FRESHNESS_STATUS);
assert.deepEqual(doc.required_material_bindings, MATERIAL_BINDINGS);

assert.equal(doc.invariant.human_decision_profile_does_not_create_authority, true);
assert.equal(doc.invariant.human_decision_record_does_not_create_mandate, true);
assert.equal(doc.invariant.approval_requires_action_digest_binding, true);
assert.equal(doc.invariant.timeout_never_auto_approves, true);
assert.equal(doc.invariant.stale_decision_never_auto_approves, true);
assert.equal(doc.invariant.material_action_change_requires_new_decision, true);
assert.equal(doc.invariant.decision_replay_for_changed_action_denied, true);

const byId = Object.fromEntries(doc.runtime_guard_vectors.map((v) => [v.vector_id, v]));
assert.equal(byId['B2G-T36'].result.code, 'HUMAN_DECISION_MISSING');
assert.equal(byId['B2G-T37'].result.code, 'HUMAN_DECISION_NOT_APPROVED');
assert.equal(byId['B2G-T38'].result.code, 'MATERIAL_CHANGE_REQUIRES_NEW_DECISION');
assert.equal(byId['B2G-T39'].result.code, 'ACTION_BINDING_INVALID');
assert.equal(byId['B2G-POS-003'].result.code, 'HUMAN_DECISION_SATISFIED');
assert.equal(byId['B2G-POS-003'].result.valid, true);
assert.equal(byId['B2G-POS-003'].result.operational_allow_permitted, false);
assert.equal(byId['B2G-POS-003'].result.creates_authority, false);
assert.equal(byId['B2G-POS-003'].result.creates_mandate, false);

const expected = {
  action_digest: 'sha256:aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
  authority_ref: 'AUTHORITY::DEMO',
  mandate_ref: 'MANDATE::DEMO',
  policy_version: 'POLICY::B2G-V3-5-R1',
  scope_ref: 'SCOPE::DEMO',
  target_ref: 'TARGET::DEMO'
};

assert.equal(validateHumanDecisionProfile(sampleProfile()).valid, true);
assert.equal(validateHumanDecisionProfile(sampleProfile({ approval_requirement: 'MAGIC' })).code, 'APPROVAL_REQUIREMENT_INVALID');
assert.equal(validateHumanDecisionRecord(sampleProfile(), sampleDecision(), expected).code, 'HUMAN_DECISION_SATISFIED');
assert.equal(validateHumanDecisionRecord(sampleProfile(), sampleDecision({ decision_evidence_ref: '' }), expected).code, 'HUMAN_DECISION_EVIDENCE_MISSING');
assert.equal(validateHumanDecisionRecord(sampleProfile(), sampleDecision({ actor_refs: ['HUMAN::WRONG'] }), expected).code, 'HUMAN_DECISION_ACTOR_INVALID');

assert.equal(doc.closed_gap.gap_id, 'L2-GAP-004');
assert.equal(doc.closed_gap.status, 'CLOSED_CONTRACT_AND_VALIDATOR_BASELINE');
assert.equal(doc.closed_gap.human_decision_runtime_integration_complete, false);
assert.deepEqual(doc.remaining_open_gaps, ['L2-GAP-005', 'L2-GAP-006']);

assert.equal(doc.readiness_state.human_decision_profile_contract_created, true);
assert.equal(doc.readiness_state.human_decision_validator_created, true);
assert.equal(doc.readiness_state.human_decision_runtime_integration_complete, false);
assert.equal(doc.readiness_state.b2g_candidate_ready, false);
assert.equal(doc.readiness_state.public_sector_production_ready, false);
assert.equal(doc.next_required_program, 'PROG-047-V3-5-R1-ADAPTER-PROVENANCE-PROFILE-CONTRACT');

assert.equal(doc.non_claims.production_ready, false);
assert.equal(doc.non_claims.b2g_candidate_ready, false);
assert.equal(doc.non_claims.public_authority_created, false);
assert.equal(doc.non_claims.mandate_created_by_decision_record, false);
assert.equal(doc.non_claims.level2_runtime_complete, false);

assert.match(md, /Timeout never creates auto-approval/);
assert.match(md, /A replayed decision cannot authorize a materially different action/);
assert.match(md, /L2-GAP-004/);
assert.match(md, /PROG-047-V3-5-R1-ADAPTER-PROVENANCE-PROFILE-CONTRACT/);

console.log('PASS PROG-046-V3-5-R1-HUMAN-DECISION-DOCS-EXIST');
console.log('PASS PROG-046-V3-5-R1-HUMAN-DECISION-HASH-STABLE');
console.log('PASS PROG-046-V3-5-R1-BUILDER-STABLE');
console.log('PASS PROG-046-V3-5-R1-SOURCE-CUSTODY-INTEGRITY-VALID');
console.log('PASS PROG-046-V3-5-R1-B2G-T36-T39-GUARDS-RECORDED');
console.log('PASS PROG-046-V3-5-R1-VALIDATOR-FAILS-CLOSED');
console.log('PASS PROG-046-V3-5-R1-NO-AUTO-APPROVAL-OR-DECISION-REPLAY');
console.log('PASS PROG-046-V3-5-R1-L2-GAP-004-CLOSED-CONTRACT-ONLY');
console.log('PASS PROG-046-V3-5-R1-NEXT-PROG-047-RECORDED');
console.log('PASS PROG-046-V3-5-R1-NO-B2G-CANDIDATE-OR-PRODUCTION-CLAIM');
