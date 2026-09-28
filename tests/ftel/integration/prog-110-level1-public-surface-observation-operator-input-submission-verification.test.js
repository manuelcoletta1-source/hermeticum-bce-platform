'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { sha256Digest } = require('../../../packages/hbce-core/canonical-json.js');
const {
  STATUS,
  SOURCE_REF,
  buildObservationOperatorInputSubmissionVerificationPayload,
  buildLevel1PublicSurfaceObservationOperatorInputSubmissionVerification
} = require('../../../runtime/level1/build-prog-110-level1-public-surface-observation-operator-input-submission-verification.js');

const root = path.resolve(__dirname, '../../..');
const read = (p) => fs.readFileSync(path.join(root, p), 'utf8');
const json = (p) => JSON.parse(read(p));
const exists = (p) => fs.existsSync(path.join(root, p));

const docPath = 'docs/launch/level1/prog-110-level1-public-surface-observation-operator-input-submission-verification.json';
const mdPath = 'docs/launch/level1/prog-110-level1-public-surface-observation-operator-input-submission-verification.md';
const runtimePath = 'runtime/level1/build-prog-110-level1-public-surface-observation-operator-input-submission-verification.js';

for (const p of [docPath, mdPath, runtimePath, SOURCE_REF]) assert.equal(exists(p), true, `${p} must exist`);

const doc = json(docPath);
const md = read(mdPath);
const source = json(SOURCE_REF);

assert.equal(doc.proto, 'HBCE-L1-PROG-110-PUBLIC-SURFACE-OBSERVATION-OPERATOR-INPUT-SUBMISSION-VERIFICATION-v1');
assert.equal(doc.kind, 'HBCE_LEVEL1_PUBLIC_SURFACE_OBSERVATION_OPERATOR_INPUT_SUBMISSION_VERIFICATION');
assert.equal(doc.issue_id, 'PROG-110');
assert.equal(doc.level1_public_surface_observation_operator_input_submission_verification_status, STATUS);
assert.equal(doc.source_public_surface_observation_operator_input_submission_revision_hash, source.revision_hash);
assert.equal(doc.source_public_surface_observation_operator_input_submission_revision_hash_valid, true);

const regenerated = buildLevel1PublicSurfaceObservationOperatorInputSubmissionVerification({ rootDir: root, repositoryCommit: doc.repository_baseline_commit });
assert.deepEqual(regenerated, doc);

const body = { ...doc };
delete body.revision_hash;
assert.equal(doc.revision_hash, sha256Digest(body));

assert.equal(doc.inherited_public_surface_observation_operator_input_submission.operator_input_submission_status, 'LEVEL1_PUBLIC_SURFACE_OBSERVATION_OPERATOR_INPUT_SUBMISSION_DEFINED_PENDING_INPUTS');
assert.equal(doc.inherited_public_surface_observation_operator_input_submission.public_surface_observation_operator_input_submission_ready, true);
assert.equal(doc.inherited_public_surface_observation_operator_input_submission.public_surface_observation_operator_input_submission_completed, false);
assert.equal(doc.inherited_public_surface_observation_operator_input_submission.operator_inputs_submitted, false);
assert.equal(doc.inherited_public_surface_observation_operator_input_submission.operator_inputs_collected, false);

const expectedPayload = buildObservationOperatorInputSubmissionVerificationPayload(source);
const verification = doc.public_surface_observation_operator_input_submission_verification;

assert.equal(verification.operator_input_submission_verification_payload_digest, sha256Digest(expectedPayload));
assert.equal(verification.operator_input_submission_verification_status, 'BLOCKED_INCOMPLETE_OPERATOR_INPUT_SUBMISSION');
assert.equal(verification.operator_input_submission_verification_result, 'OPERATOR_INPUT_SUBMISSION_NOT_VERIFIED');
assert.equal(verification.imported_operator_input_submission_status, 'DEFINED_PENDING_OPERATOR_INPUTS');
assert.equal(verification.imported_operator_input_submission_result, 'OPERATOR_INPUTS_NOT_SUBMITTED');
assert.equal(verification.imported_operator_input_submission_defined, true);
assert.equal(verification.imported_operator_input_submission_completed, false);
assert.equal(verification.imported_operator_inputs_submitted, false);

assert.equal(verification.verification_item_count, 4);
assert.equal(verification.verification_items.length, 4);
assert.equal(verification.all_submission_items_have_verification_items, true);
assert.equal(verification.all_verification_items_blocked_incomplete_submission, true);
assert.equal(verification.all_verification_items_without_submitter_ref, true);
assert.equal(verification.all_verification_items_without_submitted_at, true);
assert.equal(verification.all_verification_items_without_submission_channel, true);
assert.equal(verification.all_verification_items_without_public_url, true);
assert.equal(verification.all_verification_items_without_observer_ref, true);
assert.equal(verification.all_verification_items_without_observed_content_digest, true);
assert.equal(verification.all_verification_items_without_scope_match_result, true);
assert.equal(verification.all_verification_items_without_non_claims_result, true);
assert.equal(verification.all_verification_items_without_evidence_reference_result, true);
assert.equal(verification.all_verification_items_without_customer_data_absence_declaration, true);
assert.equal(verification.all_verification_items_without_forbidden_claims_absence_declaration, true);
assert.equal(verification.all_verification_items_not_performed, true);
assert.equal(verification.all_verification_items_not_passed, true);
assert.equal(verification.all_verification_items_blocked, true);

for (const item of verification.verification_items) {
  assert.match(item.operator_input_submission_verification_item_id, /^PUBLIC-SURFACE-OBSERVATION-OPERATOR-INPUT-SUBMISSION-VERIFICATION::HBCE-L1::/);
  assert.equal(item.verification_status, 'BLOCKED_INCOMPLETE_SUBMISSION');
  assert.equal(item.source_submission_status, 'PENDING_OPERATOR_INPUTS');
  assert.equal(item.submitter_ref_present, false);
  assert.equal(item.submitted_at_present, false);
  assert.equal(item.submission_channel_present, false);
  assert.equal(item.public_url_present, false);
  assert.equal(item.observer_ref_present, false);
  assert.equal(item.observed_content_digest_present, false);
  assert.equal(item.scope_match_result_present, false);
  assert.equal(item.non_claims_presence_result_present, false);
  assert.equal(item.evidence_reference_presence_result_present, false);
  assert.equal(item.customer_data_absence_declaration_present, false);
  assert.equal(item.forbidden_claims_absence_declaration_present, false);
  assert.equal(item.all_required_operator_inputs_submitted, false);
  assert.equal(item.source_operator_input_submission_complete, false);
  assert.equal(item.verification_performed, false);
  assert.equal(item.verification_passed, false);
  assert.equal(item.verification_blocked, true);
  assert.equal(item.remediation_execution_update_ready, false);
  assert.equal(item.input_collection_execution_ready, false);
  assert.equal(item.input_verification_ready, false);
  assert.equal(item.retry_gate_rerun_ready, false);
}

assert.equal(verification.operator_input_submission_verification_defined, true);
assert.equal(verification.operator_input_submission_verification_evaluated, true);
assert.equal(verification.operator_input_submission_verification_performed, false);
assert.equal(verification.operator_input_submission_verification_passed, false);
assert.equal(verification.operator_input_submission_verification_blocked, true);
assert.equal(verification.operator_input_submission_incomplete, true);
assert.equal(verification.operator_inputs_submitted, false);
assert.equal(verification.operator_inputs_verified, false);
assert.equal(verification.remediation_execution_update_ready, false);
assert.equal(verification.input_collection_execution_ready, false);
assert.equal(verification.input_verification_ready, false);
assert.equal(verification.retry_gate_rerun_ready, false);
assert.equal(verification.public_surface_observed, false);
assert.equal(verification.public_surface_observation_ready, false);
assert.equal(verification.external_customer_ready, false);
assert.equal(verification.banking_pack_ready, false);
assert.equal(verification.level1_launch_ready, false);
assert.equal(verification.production_ready, false);
assert.equal(verification.ai_operator_input_submission_verification_authority_allowed, false);

assert.equal(verification.operator_input_submission_verification_boundary.controlled_information_surface_only, true);
assert.equal(verification.operator_input_submission_verification_boundary.verification_evaluation_only, true);
assert.equal(verification.operator_input_submission_verification_boundary.verification_blocked, true);
assert.equal(verification.operator_input_submission_verification_boundary.incomplete_submission, true);
assert.equal(verification.operator_input_submission_verification_boundary.no_operator_inputs_verified, true);
assert.equal(verification.operator_input_submission_verification_boundary.no_remediation_execution_update_recorded, true);
assert.equal(verification.operator_input_submission_verification_boundary.no_input_collection_execution_recorded, true);
assert.equal(verification.operator_input_submission_verification_boundary.no_input_verification_recorded, true);
assert.equal(verification.operator_input_submission_verification_boundary.no_retry_gate_rerun_recorded, true);
assert.equal(verification.operator_input_submission_verification_boundary.no_public_observation_recorded, true);
assert.equal(verification.operator_input_submission_verification_boundary.no_customer_data, true);
assert.equal(verification.operator_input_submission_verification_boundary.no_live_system_control, true);
assert.equal(verification.operator_input_submission_verification_boundary.no_ai_authority_claim, true);

assert.equal(verification.operator_input_submission_verification_checklist.source_public_surface_observation_operator_input_submission_hash_valid, true);
assert.equal(verification.operator_input_submission_verification_checklist.source_operator_input_submission_ready, true);
assert.equal(verification.operator_input_submission_verification_checklist.source_operator_input_submission_completed, false);
assert.equal(verification.operator_input_submission_verification_checklist.source_operator_inputs_submitted, false);
assert.equal(verification.operator_input_submission_verification_checklist.operator_input_submission_verification_defined, true);
assert.equal(verification.operator_input_submission_verification_checklist.operator_input_submission_verification_evaluated, true);
assert.equal(verification.operator_input_submission_verification_checklist.operator_input_submission_verification_performed, false);
assert.equal(verification.operator_input_submission_verification_checklist.operator_input_submission_verification_passed, false);
assert.equal(verification.operator_input_submission_verification_checklist.operator_input_submission_verification_blocked, true);
assert.equal(verification.operator_input_submission_verification_checklist.all_submission_items_have_verification_items, true);
assert.equal(verification.operator_input_submission_verification_checklist.all_verification_items_blocked_incomplete_submission, true);
assert.equal(verification.operator_input_submission_verification_checklist.operator_inputs_verified, false);
assert.equal(verification.operator_input_submission_verification_checklist.public_surface_observed, false);
assert.equal(verification.operator_input_submission_verification_checklist.public_observation_ready, false);
assert.equal(verification.operator_input_submission_verification_checklist.ai_authority_absence_confirmed, true);

assert.equal(verification.operator_input_submission_verification_is_defined, true);
assert.equal(verification.operator_input_submission_verification_is_evaluated, true);
assert.equal(verification.operator_input_submission_verification_is_blocked_incomplete_submission, true);
assert.equal(verification.operator_input_submission_verification_is_not_performed, true);
assert.equal(verification.operator_input_submission_verification_is_not_passed, true);
assert.equal(verification.operator_input_submission_verification_is_not_operator_inputs_verified, true);
assert.equal(verification.operator_input_submission_verification_is_not_public_observation_ready, true);
assert.equal(verification.operator_input_submission_verification_is_not_external_customer_readiness, true);
assert.equal(verification.operator_input_submission_verification_is_not_banking_pack_readiness, true);
assert.equal(verification.operator_input_submission_verification_is_not_launch_readiness, true);
assert.equal(verification.operator_input_submission_verification_is_not_production_readiness, true);
assert.equal(verification.operator_input_submission_verification_does_not_authorize_ai_authority, true);

assert.equal(doc.readiness_state.public_surface_observation_operator_input_submission_verification_defined, true);
assert.equal(doc.readiness_state.public_surface_observation_operator_input_submission_verification_ready, true);
assert.equal(doc.readiness_state.public_surface_observation_operator_input_submission_verification_evaluated, true);
assert.equal(doc.readiness_state.public_surface_observation_operator_input_submission_verification_performed, false);
assert.equal(doc.readiness_state.public_surface_observation_operator_input_submission_verification_passed, false);
assert.equal(doc.readiness_state.public_surface_observation_operator_input_submission_verification_blocked, true);
assert.equal(doc.readiness_state.operator_input_submission_incomplete, true);
assert.equal(doc.readiness_state.operator_inputs_submitted, false);
assert.equal(doc.readiness_state.operator_inputs_verified, false);
assert.equal(doc.readiness_state.remediation_execution_update_ready, false);
assert.equal(doc.readiness_state.input_collection_execution_ready, false);
assert.equal(doc.readiness_state.input_verification_ready, false);
assert.equal(doc.readiness_state.retry_gate_rerun_ready, false);
assert.equal(doc.readiness_state.public_surface_observed, false);
assert.equal(doc.readiness_state.public_surface_observation_ready, false);
assert.equal(doc.readiness_state.external_customer_ready, false);
assert.equal(doc.readiness_state.banking_pack_ready, false);
assert.equal(doc.readiness_state.level1_launch_ready, false);
assert.equal(doc.readiness_state.production_ready, false);

assert.equal(doc.next_required_program, 'PROG-111-HBCE-LEVEL1-PUBLIC-SURFACE-OBSERVATION-OPERATOR-INPUT-SUBMISSION-REMEDIATION');

assert.equal(doc.non_claims.legal_validity, false);
assert.equal(doc.non_claims.public_accreditation, false);
assert.equal(doc.non_claims.procurement_eligibility, false);
assert.equal(doc.non_claims.external_effect_proven, false);
assert.equal(doc.non_claims.business_success, false);
assert.equal(doc.non_claims.ai_authority, false);
assert.equal(doc.non_claims.operator_inputs_submitted, false);
assert.equal(doc.non_claims.operator_inputs_verified, false);
assert.equal(doc.non_claims.public_surface_observed, false);
assert.equal(doc.non_claims.public_surface_observation_ready, false);
assert.equal(doc.non_claims.external_customer_ready, false);
assert.equal(doc.non_claims.banking_pack_ready, false);
assert.equal(doc.non_claims.level1_launch_ready, false);
assert.equal(doc.non_claims.production_ready, false);

assert.match(md, /LEVEL1_PUBLIC_SURFACE_OBSERVATION_OPERATOR_INPUT_SUBMISSION_VERIFICATION_BLOCKED_INCOMPLETE_SUBMISSION/);
assert.match(md, /verification is blocked because the operator input submission is incomplete/);
assert.match(md, /No public URL is present/);
assert.match(md, /No observer reference is present/);
assert.match(md, /No observed content digest is present/);
assert.match(md, /The verification is not passed/);
assert.match(md, /PROG-111-HBCE-LEVEL1-PUBLIC-SURFACE-OBSERVATION-OPERATOR-INPUT-SUBMISSION-REMEDIATION/);

console.log('PASS PROG-110-PUBLIC-SURFACE-OBSERVATION-OPERATOR-INPUT-SUBMISSION-VERIFICATION-DOCS-EXIST');
console.log('PASS PROG-110-PUBLIC-SURFACE-OBSERVATION-OPERATOR-INPUT-SUBMISSION-VERIFICATION-HASH-STABLE');
console.log('PASS PROG-110-BUILDER-STABLE');
console.log('PASS PROG-110-SOURCE-PROG-109-INTEGRITY-VALID');
console.log('PASS PROG-110-VERIFICATION-ITEMS-DEFINED');
console.log('PASS PROG-110-VERIFICATION-BLOCKED-INCOMPLETE-SUBMISSION');
console.log('PASS PROG-110-VERIFICATION-NOT-PERFORMED');
console.log('PASS PROG-110-VERIFICATION-NOT-PASSED');
console.log('PASS PROG-110-OPERATOR-INPUTS-NOT-VERIFIED');
console.log('PASS PROG-110-NO-PLACEHOLDER-VERIFICATION-VALUES');
console.log('PASS PROG-110-REMEDIATION-EXECUTION-UPDATE-NOT-READY');
console.log('PASS PROG-110-INPUT-COLLECTION-EXECUTION-NOT-READY');
console.log('PASS PROG-110-RETRY-GATE-RERUN-NOT-READY');
console.log('PASS PROG-110-AI-OPERATOR-INPUT-SUBMISSION-VERIFICATION-AUTHORITY-DISALLOWED');
console.log('PASS PROG-110-NEXT-PROG-111-RECORDED');
console.log('PASS PROG-110-NO-UNSUPPORTED-READINESS-CLAIMS');
