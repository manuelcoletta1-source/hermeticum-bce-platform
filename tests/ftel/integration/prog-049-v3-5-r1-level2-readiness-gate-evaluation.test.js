'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { sha256Digest } = require('../../../packages/hbce-core/canonical-json.js');
const {
  evaluateReadiness,
  buildGateEvaluation
} = require('../../../runtime/b2g/evaluate-v3-5-r1-level2-readiness-gate.js');

const root = path.resolve(__dirname, '../../..');
const read = (p) => fs.readFileSync(path.join(root, p), 'utf8');
const json = (p) => JSON.parse(read(p));
const exists = (p) => fs.existsSync(path.join(root, p));

const docPath = 'docs/launch/level2/v3-5-r1/v3-5-r1-level2-readiness-gate-evaluation.json';
const mdPath = 'docs/launch/level2/v3-5-r1/v3-5-r1-level2-readiness-gate-evaluation.md';
const runtimePath = 'runtime/b2g/evaluate-v3-5-r1-level2-readiness-gate.js';
const sourcePath = 'docs/launch/level2/v3-5-r1/v3-5-r1-b2g-t26-t43-runtime-harness.json';

for (const p of [docPath, mdPath, runtimePath, sourcePath]) assert.equal(exists(p), true, `${p} must exist`);

const doc = json(docPath);
const md = read(mdPath);
const source = json(sourcePath);

assert.equal(doc.proto, 'HBCE-B2G-L2-JC2-V3-5-R1-LEVEL2-READINESS-GATE-EVALUATION-v1');
assert.equal(doc.kind, 'HBCE_B2G_LEVEL2_JOKER_C2_V3_5_R1_LEVEL2_READINESS_GATE_EVALUATION');
assert.equal(doc.issue_id, 'PROG-049');
assert.equal(doc.priority, 'V3.5-R1-LEVEL2-READINESS-GATE-EVALUATION');
assert.equal(doc.source_b2g_t26_t43_harness_revision_hash, source.revision_hash);
assert.equal(doc.source_b2g_t26_t43_harness_revision_hash_valid, true);

const regenerated = buildGateEvaluation({ rootDir: root, repositoryCommit: doc.repository_baseline_commit });
assert.deepEqual(regenerated, doc);

const body = { ...doc };
delete body.revision_hash;
assert.equal(doc.revision_hash, sha256Digest(body));

const directGate = evaluateReadiness(source);
assert.deepEqual(directGate, doc.gate);

assert.equal(doc.evaluated_inputs.harness_scope.first_vector, 'B2G-T26');
assert.equal(doc.evaluated_inputs.harness_scope.last_vector, 'B2G-T43');
assert.equal(doc.evaluated_inputs.harness_scope.vector_count, 18);
assert.equal(doc.evaluated_inputs.harness_scope.all_required_vectors_present, true);
assert.equal(doc.evaluated_inputs.harness_scope.all_required_vectors_passed, true);
assert.equal(doc.evaluated_inputs.closed_gap.gap_id, 'L2-GAP-006');
assert.equal(doc.evaluated_inputs.closed_gap.status, 'CLOSED_RUNTIME_HARNESS_BASELINE');
assert.deepEqual(doc.evaluated_inputs.remaining_open_gaps, []);

assert.equal(doc.gate.gate_result, 'LEVEL2_READINESS_GATE_BLOCKED');
assert.equal(doc.gate.conditions.b2g_t26_t43_harness_complete, true);
assert.equal(doc.gate.conditions.level2_contract_gap_set_closed, true);
assert.equal(doc.gate.conditions.remaining_open_gaps_empty, true);
assert.equal(doc.gate.conditions.all_required_vectors_present, true);
assert.equal(doc.gate.conditions.all_required_vectors_passed, true);
assert.equal(doc.gate.conditions.positive_integration_vector_passed, true);
assert.equal(doc.gate.conditions.external_validation_complete, false);
assert.equal(doc.gate.conditions.pilot_readiness_gate_complete, false);
assert.equal(doc.gate.conditions.source_claims_b2g_candidate_ready, false);
assert.equal(doc.gate.conditions.source_claims_public_sector_production_ready, false);
assert.equal(doc.gate.conditions.source_claims_level2_runtime_complete, false);

assert.deepEqual(doc.gate.blocking_reasons, [
  'EXTERNAL_VALIDATION_NOT_COMPLETE',
  'PILOT_READINESS_GATE_NOT_COMPLETE',
  'B2G_CANDIDATE_CLAIM_NOT_PRESENT_IN_SOURCE',
  'PUBLIC_SECTOR_PRODUCTION_NOT_READY',
  'LEVEL2_RUNTIME_COMPLETE_CLAIM_NOT_SUPPORTED'
]);

assert.equal(doc.gate.b2g_candidate_ready, false);
assert.equal(doc.gate.public_sector_production_ready, false);
assert.equal(doc.gate.automatic_pilot_promotion, false);

assert.equal(doc.gate_semantics.contract_gap_closure_is_necessary_not_sufficient, true);
assert.equal(doc.gate_semantics.local_validator_pass_is_not_external_validation, true);
assert.equal(doc.gate_semantics.positive_integration_vector_is_not_candidate_readiness, true);
assert.equal(doc.gate_semantics.no_automatic_pilot_promotion_from_harness, true);
assert.equal(doc.gate_semantics.no_legal_or_procurement_claim_from_internal_gate, true);

assert.equal(doc.readiness_state.level2_contract_gap_set_closed, true);
assert.equal(doc.readiness_state.b2g_t26_t43_harness_complete, true);
assert.equal(doc.readiness_state.level2_readiness_gate_evaluated, true);
assert.equal(doc.readiness_state.level2_readiness_gate_result, 'LEVEL2_READINESS_GATE_BLOCKED');
assert.equal(doc.readiness_state.b2g_candidate_ready, false);
assert.equal(doc.readiness_state.public_sector_production_ready, false);
assert.equal(doc.readiness_state.external_validation_complete, false);
assert.equal(doc.readiness_state.pilot_readiness_gate_complete, false);

assert.equal(doc.next_required_program, 'PROG-050-V3-5-R1-LEVEL2-EXTERNAL-VALIDATION-CONTROL');

assert.equal(doc.non_claims.production_ready, false);
assert.equal(doc.non_claims.b2g_candidate_ready, false);
assert.equal(doc.non_claims.public_accreditation, false);
assert.equal(doc.non_claims.procurement_eligibility, false);
assert.equal(doc.non_claims.legal_validity, false);
assert.equal(doc.non_claims.government_endorsement, false);
assert.equal(doc.non_claims.external_validation_complete, false);
assert.equal(doc.non_claims.level2_runtime_complete, false);
assert.equal(doc.non_claims.automatic_pilot_promotion, false);

assert.match(md, /gate remains BLOCKED/);
assert.match(md, /Contract gap closure is necessary, not sufficient/);
assert.match(md, /Local validator pass is not external validation/);
assert.match(md, /PROG-050-V3-5-R1-LEVEL2-EXTERNAL-VALIDATION-CONTROL/);

console.log('PASS PROG-049-V3-5-R1-LEVEL2-READINESS-GATE-DOCS-EXIST');
console.log('PASS PROG-049-V3-5-R1-LEVEL2-READINESS-GATE-HASH-STABLE');
console.log('PASS PROG-049-V3-5-R1-BUILDER-STABLE');
console.log('PASS PROG-049-V3-5-R1-SOURCE-HARNESS-INTEGRITY-VALID');
console.log('PASS PROG-049-V3-5-R1-CONTRACT-GAP-SET-CLOSED');
console.log('PASS PROG-049-V3-5-R1-GATE-BLOCKED-AS-EXPECTED');
console.log('PASS PROG-049-V3-5-R1-BLOCKING-REASONS-RECORDED');
console.log('PASS PROG-049-V3-5-R1-GAP-CLOSURE-NOT-CANDIDATE-READINESS');
console.log('PASS PROG-049-V3-5-R1-NEXT-PROG-050-RECORDED');
console.log('PASS PROG-049-V3-5-R1-NO-B2G-CANDIDATE-OR-PRODUCTION-CLAIM');
