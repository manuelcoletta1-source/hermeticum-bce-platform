'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { sha256Digest } = require('../../../packages/hbce-core/canonical-json.js');
const {
  AUTHORIZATION_STATUSES,
  REQUIRED_PREREQUISITES,
  derivePrerequisites,
  evaluateAuthorization,
  buildPilotReadinessAuthorizationScaffold
} = require('../../../runtime/b2g/build-v3-5-r1-level2-pilot-readiness-authorization-scaffold.js');

const root = path.resolve(__dirname, '../../..');
const read = (p) => fs.readFileSync(path.join(root, p), 'utf8');
const json = (p) => JSON.parse(read(p));
const exists = (p) => fs.existsSync(path.join(root, p));

const docPath = 'docs/launch/level2/v3-5-r1/v3-5-r1-level2-pilot-readiness-authorization-scaffold.json';
const mdPath = 'docs/launch/level2/v3-5-r1/v3-5-r1-level2-pilot-readiness-authorization-scaffold.md';
const runtimePath = 'runtime/b2g/build-v3-5-r1-level2-pilot-readiness-authorization-scaffold.js';
const sourcePath = 'docs/launch/level2/v3-5-r1/v3-5-r1-level2-validation-followup-plan.json';

for (const p of [docPath, mdPath, runtimePath, sourcePath]) assert.equal(exists(p), true, `${p} must exist`);

const doc = json(docPath);
const md = read(mdPath);
const source = json(sourcePath);

assert.equal(doc.proto, 'HBCE-B2G-L2-JC2-V3-5-R1-LEVEL2-PILOT-READINESS-AUTHORIZATION-SCAFFOLD-v1');
assert.equal(doc.kind, 'HBCE_B2G_LEVEL2_JOKER_C2_V3_5_R1_LEVEL2_PILOT_READINESS_AUTHORIZATION_SCAFFOLD');
assert.equal(doc.issue_id, 'PROG-054');
assert.equal(doc.priority, 'V3.5-R1-LEVEL2-PILOT-READINESS-AUTHORIZATION-SCAFFOLD');
assert.equal(doc.source_validation_followup_plan_revision_hash, source.revision_hash);
assert.equal(doc.source_validation_followup_plan_revision_hash_valid, true);

const regenerated = buildPilotReadinessAuthorizationScaffold({ rootDir: root, repositoryCommit: doc.repository_baseline_commit });
assert.deepEqual(regenerated, doc);

const body = { ...doc };
delete body.revision_hash;
assert.equal(doc.revision_hash, sha256Digest(body));

assert.deepEqual(doc.allowed_authorization_statuses, AUTHORIZATION_STATUSES);
assert.deepEqual(doc.required_prerequisites, REQUIRED_PREREQUISITES);

const derived = derivePrerequisites(source);
assert.deepEqual(derived, doc.evaluation.prerequisites);
assert.equal(derived.length, 5);
assert.equal(derived.every((p) => p.satisfied === false), true);

const evaluation = evaluateAuthorization(source);
assert.deepEqual(evaluation, doc.evaluation);

assert.equal(doc.authorization_scaffold.status, 'PENDING_PREREQUISITES');
assert.equal(doc.authorization_scaffold.authorization_permitted, false);
assert.equal(doc.authorization_scaffold.authorization_may_be_evaluated, false);
assert.equal(doc.authorization_scaffold.required_authority_record, 'pilot_authority_decision_record');
assert.equal(doc.authorization_scaffold.required_scope_binding, 'B2G_LEVEL2_JOKER_C2_V3_5_R1_CONTROLLED_PILOT');
assert.equal(doc.authorization_scaffold.required_evidence_refs.length, 5);

assert.equal(doc.evaluation.authorization_status, 'PENDING_PREREQUISITES');
assert.equal(doc.evaluation.authorization_permitted, false);
assert.equal(doc.evaluation.authorization_may_be_evaluated, false);
assert.equal(doc.evaluation.external_validation_complete, false);
assert.equal(doc.evaluation.b2g_candidate_ready, false);
assert.equal(doc.evaluation.public_sector_production_ready, false);
assert.equal(doc.evaluation.pilot_authorized, false);

assert.ok(doc.evaluation.blocking_reasons.includes('FOLLOWUP_ACTIONS_NOT_COMPLETE'));
assert.ok(doc.evaluation.blocking_reasons.includes('EXTERNAL_VALIDATION_NOT_COMPLETE'));
assert.ok(doc.evaluation.blocking_reasons.includes('B2G_CANDIDATE_NOT_READY'));
assert.ok(doc.evaluation.blocking_reasons.includes('PILOT_READINESS_AUTHORIZATION_NOT_PRESENT_IN_SOURCE'));
assert.ok(doc.evaluation.blocking_reasons.includes('INDEPENDENT_CLOSURE_DECISION_RECORD_COMPLETE_MISSING'));
assert.ok(doc.evaluation.blocking_reasons.includes('LIMITATIONS_RESOLUTION_RECORD_COMPLETE_MISSING'));
assert.ok(doc.evaluation.blocking_reasons.includes('EXTERNAL_VALIDATION_COMPLETION_RECORD_COMPLETE_MISSING'));
assert.ok(doc.evaluation.blocking_reasons.includes('LEVEL2_READINESS_REEVALUATION_COMPLETE_MISSING'));
assert.ok(doc.evaluation.blocking_reasons.includes('PILOT_AUTHORITY_DECISION_RECORD_COMPLETE_MISSING'));

assert.equal(doc.authorization_semantics.scaffold_is_not_authorization, true);
assert.equal(doc.authorization_semantics.authorization_requires_all_prerequisites_satisfied, true);
assert.equal(doc.authorization_semantics.pilot_authorization_does_not_create_public_accreditation, true);
assert.equal(doc.authorization_semantics.pilot_authorization_does_not_create_procurement_eligibility, true);
assert.equal(doc.authorization_semantics.pilot_authorization_does_not_create_legal_validity, true);
assert.equal(doc.authorization_semantics.pilot_authorization_does_not_create_government_endorsement, true);
assert.equal(doc.authorization_semantics.production_readiness_requires_separate_gate, true);
assert.equal(doc.authorization_semantics.no_automatic_b2g_candidate_promotion, true);

assert.equal(doc.readiness_state.pilot_readiness_authorization_scaffold_created, true);
assert.equal(doc.readiness_state.pilot_readiness_authorization_evaluated, true);
assert.equal(doc.readiness_state.pilot_readiness_authorization_status, 'PENDING_PREREQUISITES');
assert.equal(doc.readiness_state.pilot_readiness_authorization_permitted, false);
assert.equal(doc.readiness_state.all_prerequisites_satisfied, false);
assert.equal(doc.readiness_state.external_validation_complete, false);
assert.equal(doc.readiness_state.b2g_candidate_ready, false);
assert.equal(doc.readiness_state.public_sector_production_ready, false);
assert.equal(doc.readiness_state.pilot_authorized, false);

assert.equal(doc.next_required_program, 'PROG-055-V3-5-R1-LEVEL2-PILOT-READINESS-GATE');

assert.equal(doc.non_claims.production_ready, false);
assert.equal(doc.non_claims.b2g_candidate_ready, false);
assert.equal(doc.non_claims.public_accreditation, false);
assert.equal(doc.non_claims.procurement_eligibility, false);
assert.equal(doc.non_claims.legal_validity, false);
assert.equal(doc.non_claims.government_endorsement, false);
assert.equal(doc.non_claims.external_validation_complete, false);
assert.equal(doc.non_claims.pilot_authorized, false);
assert.equal(doc.non_claims.level2_runtime_complete, false);
assert.equal(doc.non_claims.automatic_pilot_promotion, false);

assert.match(md, /scaffold is not authorization/i);
assert.match(md, /PENDING_PREREQUISITES/);
assert.match(md, /does not authorize a pilot/);
assert.match(md, /PROG-055-V3-5-R1-LEVEL2-PILOT-READINESS-GATE/);

console.log('PASS PROG-054-V3-5-R1-LEVEL2-PILOT-READINESS-AUTHORIZATION-SCAFFOLD-DOCS-EXIST');
console.log('PASS PROG-054-V3-5-R1-LEVEL2-PILOT-READINESS-AUTHORIZATION-SCAFFOLD-HASH-STABLE');
console.log('PASS PROG-054-V3-5-R1-BUILDER-STABLE');
console.log('PASS PROG-054-V3-5-R1-SOURCE-FOLLOWUP-PLAN-INTEGRITY-VALID');
console.log('PASS PROG-054-V3-5-R1-PREREQUISITES-DERIVED');
console.log('PASS PROG-054-V3-5-R1-AUTHORIZATION-PENDING-PREREQUISITES');
console.log('PASS PROG-054-V3-5-R1-SCAFFOLD-IS-NOT-AUTHORIZATION');
console.log('PASS PROG-054-V3-5-R1-NO-PILOT-AUTHORIZATION');
console.log('PASS PROG-054-V3-5-R1-NEXT-PROG-055-RECORDED');
console.log('PASS PROG-054-V3-5-R1-NO-B2G-CANDIDATE-OR-PRODUCTION-CLAIM');
