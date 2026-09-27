'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { sha256Digest } = require('../../../packages/hbce-core/canonical-json.js');
const {
  evaluatePilotReadiness,
  buildPilotReadinessGate
} = require('../../../runtime/b2g/evaluate-v3-5-r1-level2-pilot-readiness-gate.js');

const root = path.resolve(__dirname, '../../..');
const read = (p) => fs.readFileSync(path.join(root, p), 'utf8');
const json = (p) => JSON.parse(read(p));
const exists = (p) => fs.existsSync(path.join(root, p));

const docPath = 'docs/launch/level2/v3-5-r1/v3-5-r1-level2-pilot-readiness-gate.json';
const mdPath = 'docs/launch/level2/v3-5-r1/v3-5-r1-level2-pilot-readiness-gate.md';
const runtimePath = 'runtime/b2g/evaluate-v3-5-r1-level2-pilot-readiness-gate.js';
const sourcePath = 'docs/launch/level2/v3-5-r1/v3-5-r1-level2-pilot-readiness-authorization-scaffold.json';

for (const p of [docPath, mdPath, runtimePath, sourcePath]) assert.equal(exists(p), true, `${p} must exist`);

const doc = json(docPath);
const md = read(mdPath);
const source = json(sourcePath);

assert.equal(doc.proto, 'HBCE-B2G-L2-JC2-V3-5-R1-LEVEL2-PILOT-READINESS-GATE-v1');
assert.equal(doc.kind, 'HBCE_B2G_LEVEL2_JOKER_C2_V3_5_R1_LEVEL2_PILOT_READINESS_GATE');
assert.equal(doc.issue_id, 'PROG-055');
assert.equal(doc.priority, 'V3.5-R1-LEVEL2-PILOT-READINESS-GATE');
assert.equal(doc.source_pilot_readiness_authorization_scaffold_revision_hash, source.revision_hash);
assert.equal(doc.source_pilot_readiness_authorization_scaffold_revision_hash_valid, true);

const regenerated = buildPilotReadinessGate({ rootDir: root, repositoryCommit: doc.repository_baseline_commit });
assert.deepEqual(regenerated, doc);

const body = { ...doc };
delete body.revision_hash;
assert.equal(doc.revision_hash, sha256Digest(body));

const directGate = evaluatePilotReadiness(source);
assert.deepEqual(directGate, doc.gate);

assert.equal(doc.evaluated_source_state.source_issue_id, 'PROG-054');
assert.equal(doc.evaluated_source_state.source_authorization_status, 'PENDING_PREREQUISITES');
assert.equal(doc.evaluated_source_state.source_authorization_permitted, false);
assert.equal(doc.evaluated_source_state.source_authorization_may_be_evaluated, false);

assert.equal(doc.gate.gate_result, 'LEVEL2_PILOT_READINESS_GATE_BLOCKED');
assert.equal(doc.gate.conditions.source_revision_hash_valid, true);
assert.equal(doc.gate.conditions.source_issue_is_prog_054, true);
assert.equal(doc.gate.conditions.scaffold_created, true);
assert.equal(doc.gate.conditions.scaffold_status_pending_prerequisites, true);
assert.equal(doc.gate.conditions.authorization_permitted, false);
assert.equal(doc.gate.conditions.authorization_may_be_evaluated, false);
assert.equal(doc.gate.conditions.all_prerequisites_satisfied, false);
assert.equal(doc.gate.conditions.external_validation_complete, false);
assert.equal(doc.gate.conditions.b2g_candidate_ready, false);
assert.equal(doc.gate.conditions.public_sector_production_ready, false);
assert.equal(doc.gate.conditions.pilot_authorized, false);

assert.ok(doc.gate.blocking_reasons.includes('PILOT_AUTHORIZATION_PENDING_PREREQUISITES'));
assert.ok(doc.gate.blocking_reasons.includes('PILOT_AUTHORIZATION_NOT_PERMITTED'));
assert.ok(doc.gate.blocking_reasons.includes('PILOT_AUTHORIZATION_NOT_READY_FOR_DECISION'));
assert.ok(doc.gate.blocking_reasons.includes('PILOT_PREREQUISITES_NOT_SATISFIED'));
assert.ok(doc.gate.blocking_reasons.includes('EXTERNAL_VALIDATION_NOT_COMPLETE'));
assert.ok(doc.gate.blocking_reasons.includes('B2G_CANDIDATE_NOT_READY'));
assert.ok(doc.gate.blocking_reasons.includes('PILOT_NOT_AUTHORIZED'));
assert.ok(doc.gate.blocking_reasons.includes('PUBLIC_SECTOR_PRODUCTION_NOT_READY'));
assert.ok(doc.gate.blocking_reasons.includes('PILOT_AUTHORIZATION_CLAIM_BLOCKED_BY_SOURCE'));
assert.ok(doc.gate.blocking_reasons.includes('B2G_CANDIDATE_CLAIM_BLOCKED_BY_SOURCE'));
assert.ok(doc.gate.blocking_reasons.includes('PRODUCTION_CLAIM_BLOCKED_BY_SOURCE'));

assert.equal(doc.gate.external_validation_complete, false);
assert.equal(doc.gate.b2g_candidate_ready, false);
assert.equal(doc.gate.public_sector_production_ready, false);
assert.equal(doc.gate.pilot_authorized, false);
assert.equal(doc.gate.automatic_pilot_promotion, false);

assert.equal(doc.gate_semantics.pilot_readiness_gate_requires_authorization_permitted, true);
assert.equal(doc.gate_semantics.pilot_readiness_gate_requires_all_prerequisites_satisfied, true);
assert.equal(doc.gate_semantics.pilot_readiness_gate_requires_external_validation_complete, true);
assert.equal(doc.gate_semantics.pilot_readiness_gate_requires_b2g_candidate_ready, true);
assert.equal(doc.gate_semantics.pilot_readiness_gate_requires_pilot_authorized, true);
assert.equal(doc.gate_semantics.pilot_readiness_gate_does_not_create_public_accreditation, true);
assert.equal(doc.gate_semantics.pilot_readiness_gate_does_not_create_procurement_eligibility, true);
assert.equal(doc.gate_semantics.pilot_readiness_gate_does_not_create_legal_validity, true);
assert.equal(doc.gate_semantics.pilot_readiness_gate_does_not_create_government_endorsement, true);
assert.equal(doc.gate_semantics.production_readiness_requires_separate_gate, true);

assert.equal(doc.readiness_state.level2_pilot_readiness_gate_created, true);
assert.equal(doc.readiness_state.level2_pilot_readiness_gate_evaluated, true);
assert.equal(doc.readiness_state.level2_pilot_readiness_gate_result, 'LEVEL2_PILOT_READINESS_GATE_BLOCKED');
assert.equal(doc.readiness_state.pilot_readiness_authorization_scaffold_present, true);
assert.equal(doc.readiness_state.pilot_readiness_authorization_status, 'PENDING_PREREQUISITES');
assert.equal(doc.readiness_state.pilot_readiness_authorization_permitted, false);
assert.equal(doc.readiness_state.external_validation_complete, false);
assert.equal(doc.readiness_state.b2g_candidate_ready, false);
assert.equal(doc.readiness_state.public_sector_production_ready, false);
assert.equal(doc.readiness_state.pilot_authorized, false);

assert.equal(doc.next_required_program, 'PROG-056-V3-5-R1-LEVEL2-STATUS-FREEZE');

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

assert.match(md, /gate remains BLOCKED/);
assert.match(md, /PENDING_PREREQUISITES/);
assert.match(md, /does not authorize a pilot/);
assert.match(md, /PROG-056-V3-5-R1-LEVEL2-STATUS-FREEZE/);

console.log('PASS PROG-055-V3-5-R1-LEVEL2-PILOT-READINESS-GATE-DOCS-EXIST');
console.log('PASS PROG-055-V3-5-R1-LEVEL2-PILOT-READINESS-GATE-HASH-STABLE');
console.log('PASS PROG-055-V3-5-R1-BUILDER-STABLE');
console.log('PASS PROG-055-V3-5-R1-SOURCE-SCAFFOLD-INTEGRITY-VALID');
console.log('PASS PROG-055-V3-5-R1-GATE-BLOCKED-AS-EXPECTED');
console.log('PASS PROG-055-V3-5-R1-PENDING-PREREQUISITES-BLOCK-PILOT');
console.log('PASS PROG-055-V3-5-R1-NO-PILOT-AUTHORIZATION');
console.log('PASS PROG-055-V3-5-R1-NO-PUBLIC-ACCREDITATION-LEGAL-OR-PROCUREMENT-INFERENCE');
console.log('PASS PROG-055-V3-5-R1-NEXT-PROG-056-RECORDED');
console.log('PASS PROG-055-V3-5-R1-NO-B2G-CANDIDATE-OR-PRODUCTION-CLAIM');
