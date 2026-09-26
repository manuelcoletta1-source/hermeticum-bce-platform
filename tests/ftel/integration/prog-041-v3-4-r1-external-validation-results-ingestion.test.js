'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { sha256Digest } = require('../../../packages/hbce-core/canonical-json.js');
const {
  ALLOWED_EXTERNAL_RESULTS,
  buildExternalValidationIngestion
} = require('../../../runtime/review/build-v3-4-r1-external-validation-ingestion.js');

const root = path.resolve(__dirname, '../../..');
const read = (p) => fs.readFileSync(path.join(root, p), 'utf8');
const json = (p) => JSON.parse(read(p));
const exists = (p) => fs.existsSync(path.join(root, p));

const docPath = 'docs/launch/level1/v3-4-r1/v3-4-r1-external-validation-results-ingestion.json';
const mdPath = 'docs/launch/level1/v3-4-r1/v3-4-r1-external-validation-results-ingestion.md';
const runtimePath = 'runtime/review/build-v3-4-r1-external-validation-ingestion.js';
const reviewControlPath = 'docs/launch/level1/v3-4-r1/v3-4-r1-evidence-review-external-validation-control.json';

for (const p of [docPath, mdPath, runtimePath, reviewControlPath]) {
  assert.equal(exists(p), true, `${p} must exist`);
}

const doc = json(docPath);
const md = read(mdPath);
const reviewControl = json(reviewControlPath);

assert.equal(doc.proto, 'HBCE-B2B-L1-V3-4-R1-EXTERNAL-VALIDATION-RESULTS-INGESTION-v1');
assert.equal(doc.kind, 'HBCE_B2B_L1_V3_4_R1_EXTERNAL_VALIDATION_RESULTS_INGESTION');
assert.equal(doc.issue_id, 'PROG-041');
assert.equal(doc.status, 'EXTERNAL_VALIDATION_RESULT_AWAITING_INPUT');

assert.equal(doc.source_review_control_revision_hash, reviewControl.revision_hash);
assert.equal(doc.source_review_control_revision_hash_valid, true);

const regenerated = buildExternalValidationIngestion({
  rootDir: root,
  repositoryCommit: doc.repository_baseline_commit
});
assert.deepEqual(regenerated, doc);

const body = { ...doc };
delete body.revision_hash;
assert.equal(doc.revision_hash, sha256Digest(body));

assert.deepEqual(doc.ingestion_input.allowed_results, ALLOWED_EXTERNAL_RESULTS);
assert.equal(doc.ingestion_input.external_validation_result, null);
assert.equal(doc.ingestion_input.external_validation_evidence_ref, null);

assert.equal(doc.external_validation_state.result_provided, false);
assert.equal(doc.external_validation_state.result_allowed, false);
assert.equal(doc.external_validation_state.evidence_ref_provided, false);
assert.equal(doc.external_validation_state.external_validation_complete, false);
assert.equal(doc.external_validation_state.external_validation_accepted, false);
assert.equal(doc.external_validation_state.external_validation_accepted_with_findings, false);
assert.equal(doc.external_validation_state.external_validation_rejected, false);

assert.equal(doc.blocking_reasons.includes('EXTERNAL_VALIDATION_RESULT_MISSING'), true);
assert.equal(doc.rc_effect.rc_gate_re_evaluation_required, false);
assert.equal(doc.rc_effect.release_candidate_ready, false);
assert.equal(doc.rc_effect.production_ready, false);
assert.equal(doc.rc_effect.pilot_access_available, false);
assert.equal(doc.rc_effect.customer_acceptance_available, false);
assert.equal(doc.rc_effect.automatic_release_authorization, false);

assert.equal(doc.next_required_program, 'PROG-041-EXTERNAL-VALIDATION-RESULTS-INGESTION-WAITING-INPUT');

assert.equal(doc.non_claims.production_ready, false);
assert.equal(doc.non_claims.release_candidate_ready, false);
assert.equal(doc.non_claims.pilot_access_available, false);
assert.equal(doc.non_claims.customer_acceptance, false);
assert.equal(doc.non_claims.external_validation_complete_without_result, false);
assert.equal(doc.non_claims.automatic_release_authorization, false);
assert.equal(doc.non_claims.commercial_claim_complete, false);

const accepted = buildExternalValidationIngestion({
  rootDir: root,
  repositoryCommit: doc.repository_baseline_commit,
  externalValidationResult: 'EXTERNAL_VALIDATION_ACCEPTED',
  externalValidationEvidenceRef: 'external-validation-report::demo-001'
});
assert.equal(accepted.status, 'EXTERNAL_VALIDATION_RESULT_INGESTED_REVIEW_REQUIRED');
assert.equal(accepted.external_validation_state.external_validation_complete, true);
assert.equal(accepted.rc_effect.rc_gate_re_evaluation_required, true);
assert.equal(accepted.rc_effect.release_candidate_ready, false);
assert.equal(accepted.next_required_program, 'PROG-042-RC-GATE-RE-EVALUATION');

const invalid = buildExternalValidationIngestion({
  rootDir: root,
  repositoryCommit: doc.repository_baseline_commit,
  externalValidationResult: 'TRUST_ME_BRO',
  externalValidationEvidenceRef: 'external-validation-report::invalid'
});
assert.equal(invalid.status, 'EXTERNAL_VALIDATION_RESULT_AWAITING_INPUT');
assert.equal(invalid.blocking_reasons.includes('EXTERNAL_VALIDATION_RESULT_UNSUPPORTED'), true);
assert.equal(invalid.external_validation_state.external_validation_complete, false);

assert.match(md, /does not invent an external validation result/);
assert.match(md, /External validation complete: false/);
assert.match(md, /does not claim release candidate readiness/);

console.log('PASS PROG-041-V3-4-R1-EXTERNAL-VALIDATION-INGESTION-DOCS-EXIST');
console.log('PASS PROG-041-V3-4-R1-EXTERNAL-VALIDATION-INGESTION-HASH-STABLE');
console.log('PASS PROG-041-V3-4-R1-BUILDER-STABLE');
console.log('PASS PROG-041-V3-4-R1-SOURCE-INTEGRITY-VALID');
console.log('PASS PROG-041-V3-4-R1-AWAITS-EXTERNAL-VALIDATION-INPUT');
console.log('PASS PROG-041-V3-4-R1-VALID-RESULT-REQUIRES-EVIDENCE-REF');
console.log('PASS PROG-041-V3-4-R1-UNSUPPORTED-RESULT-BLOCKED');
console.log('PASS PROG-041-V3-4-R1-RC-RE-EVALUATION-NOT-TRIGGERED-WITHOUT-RESULT');
console.log('PASS PROG-041-V3-4-R1-NO-RC-OR-PRODUCTION-CLAIM');
