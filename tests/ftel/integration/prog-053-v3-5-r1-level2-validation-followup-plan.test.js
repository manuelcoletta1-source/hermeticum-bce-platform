'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { sha256Digest } = require('../../../packages/hbce-core/canonical-json.js');
const {
  REQUIRED_FOLLOWUP_ACTIONS,
  FOLLOWUP_STATUSES,
  buildActionsFromClosureGate,
  buildFollowupPlan
} = require('../../../runtime/b2g/build-v3-5-r1-level2-validation-followup-plan.js');

const root = path.resolve(__dirname, '../../..');
const read = (p) => fs.readFileSync(path.join(root, p), 'utf8');
const json = (p) => JSON.parse(read(p));
const exists = (p) => fs.existsSync(path.join(root, p));

const docPath = 'docs/launch/level2/v3-5-r1/v3-5-r1-level2-validation-followup-plan.json';
const mdPath = 'docs/launch/level2/v3-5-r1/v3-5-r1-level2-validation-followup-plan.md';
const runtimePath = 'runtime/b2g/build-v3-5-r1-level2-validation-followup-plan.js';
const sourcePath = 'docs/launch/level2/v3-5-r1/v3-5-r1-level2-external-validation-closure-gate.json';

for (const p of [docPath, mdPath, runtimePath, sourcePath]) assert.equal(exists(p), true, `${p} must exist`);

const doc = json(docPath);
const md = read(mdPath);
const source = json(sourcePath);

assert.equal(doc.proto, 'HBCE-B2G-L2-JC2-V3-5-R1-LEVEL2-VALIDATION-FOLLOWUP-PLAN-v1');
assert.equal(doc.kind, 'HBCE_B2G_LEVEL2_JOKER_C2_V3_5_R1_LEVEL2_VALIDATION_FOLLOWUP_PLAN');
assert.equal(doc.issue_id, 'PROG-053');
assert.equal(doc.priority, 'V3.5-R1-LEVEL2-VALIDATION-FOLLOWUP-PLAN');
assert.equal(doc.source_external_validation_closure_gate_revision_hash, source.revision_hash);
assert.equal(doc.source_external_validation_closure_gate_revision_hash_valid, true);
assert.equal(doc.source_gate_result, 'EXTERNAL_VALIDATION_CLOSURE_GATE_BLOCKED');

const regenerated = buildFollowupPlan({ rootDir: root, repositoryCommit: doc.repository_baseline_commit });
assert.deepEqual(regenerated, doc);

const body = { ...doc };
delete body.revision_hash;
assert.equal(doc.revision_hash, sha256Digest(body));

assert.deepEqual(doc.required_followup_actions, REQUIRED_FOLLOWUP_ACTIONS);
assert.deepEqual(doc.allowed_followup_statuses, FOLLOWUP_STATUSES);

const rebuiltActions = buildActionsFromClosureGate(source);
assert.deepEqual(rebuiltActions, doc.followup_actions);
assert.equal(doc.followup_actions.length, 5);
assert.equal(doc.followup_actions.every((a) => a.source_blocking_reason_present === true), true);

const byId = Object.fromEntries(doc.followup_actions.map((a) => [a.action_id, a]));
assert.equal(byId['L2-FOLLOWUP-001'].action_type, 'INDEPENDENT_CLOSURE_DECISION_RECORD');
assert.equal(byId['L2-FOLLOWUP-002'].action_type, 'LIMITATIONS_RESOLUTION_RECORD');
assert.equal(byId['L2-FOLLOWUP-003'].action_type, 'EXTERNAL_VALIDATION_COMPLETION_RECORD');
assert.equal(byId['L2-FOLLOWUP-004'].action_type, 'PILOT_READINESS_AUTHORIZATION_RECORD');
assert.equal(byId['L2-FOLLOWUP-005'].action_type, 'LEVEL2_READINESS_REEVALUATION');

assert.equal(byId['L2-FOLLOWUP-001'].status, 'OPEN');
assert.equal(byId['L2-FOLLOWUP-002'].status, 'OPEN');
assert.equal(byId['L2-FOLLOWUP-003'].status, 'OPEN');
assert.equal(byId['L2-FOLLOWUP-004'].status, 'OPEN');
assert.equal(byId['L2-FOLLOWUP-005'].status, 'BLOCKED');

assert.equal(doc.followup_summary.action_count, 5);
assert.equal(doc.followup_summary.open_action_count, 4);
assert.equal(doc.followup_summary.blocked_action_count, 1);
assert.equal(doc.followup_summary.complete_action_count, 0);
assert.equal(doc.followup_summary.all_source_blocking_reasons_mapped, true);
assert.equal(doc.followup_summary.candidate_readiness_unblocked, false);

assert.equal(doc.plan_semantics.followup_plan_is_not_external_validation_closure, true);
assert.equal(doc.plan_semantics.followup_plan_is_not_b2g_candidate_readiness, true);
assert.equal(doc.plan_semantics.followup_plan_is_not_pilot_authorization, true);
assert.equal(doc.plan_semantics.completion_artifacts_must_be_recorded_separately, true);
assert.equal(doc.plan_semantics.readiness_reevaluation_must_be_rerun_after_artifacts, true);
assert.equal(doc.plan_semantics.no_public_sector_production_claim_from_followup_plan, true);

assert.equal(doc.readiness_state.validation_followup_plan_created, true);
assert.equal(doc.readiness_state.closure_blockers_mapped_to_actions, true);
assert.equal(doc.readiness_state.external_validation_closure_gate_still_blocked, true);
assert.equal(doc.readiness_state.external_validation_complete, false);
assert.equal(doc.readiness_state.b2g_candidate_ready, false);
assert.equal(doc.readiness_state.public_sector_production_ready, false);
assert.equal(doc.readiness_state.pilot_readiness_authorization_present, false);

assert.equal(doc.next_required_program, 'PROG-054-V3-5-R1-LEVEL2-PILOT-READINESS-AUTHORIZATION-SCAFFOLD');

assert.equal(doc.non_claims.production_ready, false);
assert.equal(doc.non_claims.b2g_candidate_ready, false);
assert.equal(doc.non_claims.public_accreditation, false);
assert.equal(doc.non_claims.procurement_eligibility, false);
assert.equal(doc.non_claims.legal_validity, false);
assert.equal(doc.non_claims.government_endorsement, false);
assert.equal(doc.non_claims.external_validation_complete, false);
assert.equal(doc.non_claims.level2_runtime_complete, false);
assert.equal(doc.non_claims.automatic_pilot_promotion, false);

assert.match(md, /source external validation closure gate remains BLOCKED/i);
assert.match(md, /independent closure decision/);
assert.match(md, /does not create B2G_CANDIDATE readiness/);
assert.match(md, /PROG-054-V3-5-R1-LEVEL2-PILOT-READINESS-AUTHORIZATION-SCAFFOLD/);

console.log('PASS PROG-053-V3-5-R1-LEVEL2-VALIDATION-FOLLOWUP-PLAN-DOCS-EXIST');
console.log('PASS PROG-053-V3-5-R1-LEVEL2-VALIDATION-FOLLOWUP-PLAN-HASH-STABLE');
console.log('PASS PROG-053-V3-5-R1-BUILDER-STABLE');
console.log('PASS PROG-053-V3-5-R1-SOURCE-CLOSURE-GATE-INTEGRITY-VALID');
console.log('PASS PROG-053-V3-5-R1-CLOSURE-BLOCKERS-MAPPED');
console.log('PASS PROG-053-V3-5-R1-FOLLOWUP-ACTIONS-OPEN-OR-BLOCKED');
console.log('PASS PROG-053-V3-5-R1-PLAN-DOES-NOT-CLOSE-VALIDATION');
console.log('PASS PROG-053-V3-5-R1-NO-PILOT-AUTHORIZATION-INFERENCE');
console.log('PASS PROG-053-V3-5-R1-NEXT-PROG-054-RECORDED');
console.log('PASS PROG-053-V3-5-R1-NO-B2G-CANDIDATE-OR-PRODUCTION-CLAIM');
