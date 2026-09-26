'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { sha256Digest } = require('../../../packages/hbce-core/canonical-json.js');
const { buildEvidenceReviewControl } = require('../../../runtime/review/build-v3-4-r1-evidence-review-control.js');

const root = path.resolve(__dirname, '../../..');
const read = (p) => fs.readFileSync(path.join(root, p), 'utf8');
const json = (p) => JSON.parse(read(p));
const exists = (p) => fs.existsSync(path.join(root, p));

const docPath = 'docs/launch/level1/v3-4-r1/v3-4-r1-evidence-review-external-validation-control.json';
const mdPath = 'docs/launch/level1/v3-4-r1/v3-4-r1-evidence-review-external-validation-control.md';
const runtimePath = 'runtime/review/build-v3-4-r1-evidence-review-control.js';
const evidencePackPath = 'docs/launch/level1/v3-4-r1/v3-4-r1-e2e-evidence-pack.json';
const rcGatePath = 'docs/launch/level1/v3-4-r1/v3-4-r1-rc-gate-evaluation.json';

for (const p of [docPath, mdPath, runtimePath, evidencePackPath, rcGatePath]) {
  assert.equal(exists(p), true, `${p} must exist`);
}

const doc = json(docPath);
const md = read(mdPath);
const evidencePack = json(evidencePackPath);
const rcGate = json(rcGatePath);

assert.equal(doc.proto, 'HBCE-B2B-L1-V3-4-R1-EVIDENCE-REVIEW-EXTERNAL-VALIDATION-CONTROL-v1');
assert.equal(doc.kind, 'HBCE_B2B_L1_V3_4_R1_EVIDENCE_REVIEW_EXTERNAL_VALIDATION_CONTROL');
assert.equal(doc.issue_id, 'PROG-040');
assert.equal(doc.status, 'EVIDENCE_REVIEW_CONTROL_CREATED_EXTERNAL_VALIDATION_REQUIRED');

assert.equal(doc.source_e2e_evidence_pack_revision_hash, evidencePack.revision_hash);
assert.equal(doc.source_rc_gate_evaluation_revision_hash, rcGate.revision_hash);
assert.equal(doc.source_integrity.evidence_pack_revision_hash_valid, true);
assert.equal(doc.source_integrity.rc_gate_revision_hash_valid, true);

assert.equal(doc.rc_gate_input_state.result, 'RC_GATE_BLOCKED');
assert.equal(doc.rc_gate_input_state.rc_gate_blocked, true);
assert.equal(doc.rc_gate_input_state.rc_gate_passed, false);

const regenerated = buildEvidenceReviewControl({
  rootDir: root,
  repositoryCommit: doc.repository_baseline_commit
});
assert.deepEqual(regenerated, doc);

const body = { ...doc };
delete body.revision_hash;
assert.equal(doc.revision_hash, sha256Digest(body));

assert.equal(doc.evidence_review_items.length, 5);
for (const item of doc.evidence_review_items) {
  assert.equal(item.current_status, 'REVIEW_REQUIRED');
  assert.equal(item.required_result, 'REVIEW_ACCEPTED_OR_CORRECTIVE_ACTION_OPENED');
}

assert.equal(doc.external_validation_boundary.current_status, 'EXTERNAL_VALIDATION_REQUIRED');
assert.equal(doc.external_validation_boundary.external_validation_complete, false);
assert.match(doc.external_validation_boundary.fail_closed_rule, /RC promotion remains blocked/);

assert.equal(doc.pilot_customer_boundary.current_status, 'PILOT_CUSTOMER_ACCESS_BLOCKED');
assert.equal(doc.pilot_customer_boundary.pilot_access_available, false);
assert.equal(doc.pilot_customer_boundary.customer_acceptance_available, false);

assert.equal(doc.review_gate.evidence_review_started, true);
assert.equal(doc.review_gate.evidence_review_complete, false);
assert.equal(doc.review_gate.all_review_items_closed, false);
assert.equal(doc.review_gate.external_validation_complete, false);
assert.equal(doc.review_gate.pilot_customer_access_available, false);
assert.equal(doc.review_gate.release_candidate_ready, false);
assert.equal(doc.review_gate.production_ready, false);

assert.equal(doc.next_required_program, 'PROG-041-EXTERNAL-VALIDATION-RESULTS-INGESTION');

assert.equal(doc.non_claims.production_ready, false);
assert.equal(doc.non_claims.release_candidate_ready, false);
assert.equal(doc.non_claims.pilot_access_available, false);
assert.equal(doc.non_claims.customer_acceptance, false);
assert.equal(doc.non_claims.external_validation_complete, false);
assert.equal(doc.non_claims.automatic_release_authorization, false);
assert.equal(doc.non_claims.commercial_claim_complete, false);

assert.match(md, /does not complete external validation/);
assert.match(md, /does not claim release candidate readiness/);
assert.match(md, /PROG-041-EXTERNAL-VALIDATION-RESULTS-INGESTION/);

console.log('PASS PROG-040-V3-4-R1-EVIDENCE-REVIEW-DOCS-EXIST');
console.log('PASS PROG-040-V3-4-R1-EVIDENCE-REVIEW-HASH-STABLE');
console.log('PASS PROG-040-V3-4-R1-BUILDER-STABLE');
console.log('PASS PROG-040-V3-4-R1-SOURCE-INTEGRITY-VALID');
console.log('PASS PROG-040-V3-4-R1-RC-GATE-BLOCKED-INPUT');
console.log('PASS PROG-040-V3-4-R1-REVIEW-ITEMS-REQUIRED');
console.log('PASS PROG-040-V3-4-R1-EXTERNAL-VALIDATION-REQUIRED');
console.log('PASS PROG-040-V3-4-R1-PILOT-CUSTOMER-ACCESS-BLOCKED');
console.log('PASS PROG-040-V3-4-R1-NEXT-PROG-041-RECORDED');
console.log('PASS PROG-040-V3-4-R1-NO-RC-OR-PRODUCTION-CLAIM');
