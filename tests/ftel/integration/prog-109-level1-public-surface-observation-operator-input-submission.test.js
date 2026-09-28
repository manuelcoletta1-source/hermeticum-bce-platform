'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { sha256Digest } = require('../../../packages/hbce-core/canonical-json.js');
const {
  STATUS,
  SOURCE_REF,
  buildObservationOperatorInputSubmissionPayload,
  buildLevel1PublicSurfaceObservationOperatorInputSubmission
} = require('../../../runtime/level1/build-prog-109-level1-public-surface-observation-operator-input-submission.js');

const root = path.resolve(__dirname, '../../..');
const read = (p) => fs.readFileSync(path.join(root, p), 'utf8');
const json = (p) => JSON.parse(read(p));
const exists = (p) => fs.existsSync(path.join(root, p));

const docPath = 'docs/launch/level1/prog-109-level1-public-surface-observation-operator-input-submission.json';
const mdPath = 'docs/launch/level1/prog-109-level1-public-surface-observation-operator-input-submission.md';
const runtimePath = 'runtime/level1/build-prog-109-level1-public-surface-observation-operator-input-submission.js';

for (const p of [docPath, mdPath, runtimePath, SOURCE_REF]) assert.equal(exists(p), true, `${p} must exist`);

const doc = json(docPath);
const md = read(mdPath);
const source = json(SOURCE_REF);

assert.equal(doc.proto, 'HBCE-L1-PROG-109-PUBLIC-SURFACE-OBSERVATION-OPERATOR-INPUT-SUBMISSION-v1');
assert.equal(doc.kind, 'HBCE_LEVEL1_PUBLIC_SURFACE_OBSERVATION_OPERATOR_INPUT_SUBMISSION');
assert.equal(doc.issue_id, 'PROG-109');
assert.equal(doc.level1_public_surface_observation_operator_input_submission_status, STATUS);
assert.equal(doc.source_public_surface_observation_remediation_execution_revision_hash, source.revision_hash);
assert.equal(doc.source_public_surface_observation_remediation_execution_revision_hash_valid, true);

const regenerated = buildLevel1PublicSurfaceObservationOperatorInputSubmission({ rootDir: root, repositoryCommit: doc.repository_baseline_commit });
assert.deepEqual(regenerated, doc);

const body = { ...doc };
delete body.revision_hash;
assert.equal(doc.revision_hash, sha256Digest(body));

assert.equal(doc.inherited_public_surface_observation_remediation_execution.remediation_execution_status, 'LEVEL1_PUBLIC_SURFACE_OBSERVATION_REMEDIATION_EXECUTION_BLOCKED_MISSING_OPERATOR_INPUTS');
assert.equal(doc.inherited_public_surface_observation_remediation_execution.public_surface_observation_remediation_execution_ready, true);
assert.equal(doc.inherited_public_surface_observation_remediation_execution.public_surface_observation_remediation_execution_evaluated, true);
assert.equal(doc.inherited_public_surface_observation_remediation_execution.public_surface_observation_remediation_execution_completed, false);
assert.equal(doc.inherited_public_surface_observation_remediation_execution.remediation_execution_blocked_missing_operator_inputs, true);
assert.equal(doc.inherited_public_surface_observation_remediation_execution.operator_inputs_collected, false);

const expectedPayload = buildObservationOperatorInputSubmissionPayload(source);
const submission = doc.public_surface_observation_operator_input_submission;

assert.equal(submission.operator_input_submission_payload_digest, sha256Digest(expectedPayload));
assert.equal(submission.operator_input_submission_status, 'DEFINED_PENDING_OPERATOR_INPUTS');
assert.equal(submission.operator_input_submission_result, 'OPERATOR_INPUTS_NOT_SUBMITTED');
assert.equal(submission.imported_remediation_execution_status, 'BLOCKED_MISSING_OPERATOR_INPUTS');
assert.equal(submission.imported_remediation_execution_result, 'REMEDIATION_EXECUTION_NOT_COMPLETED');
assert.equal(submission.imported_remediation_execution_evaluated, true);
assert.equal(submission.imported_remediation_execution_attempted, false);
assert.equal(submission.imported_remediation_execution_completed, false);
assert.equal(submission.imported_operator_inputs_collected, false);

assert.equal(submission.submission_item_count, 4);
assert.equal(submission.submission_items.length, 4);
assert.equal(submission.all_execution_items_have_submission_items, true);
assert.equal(submission.all_submission_items_pending, true);
assert.equal(submission.all_submission_items_without_submitter_ref, true);
assert.equal(submission.all_submission_items_without_submitted_at, true);
assert.equal(submission.all_submission_items_without_public_url, true);
assert.equal(submission.all_submission_items_without_observer_ref, true);
assert.equal(submission.all_submission_items_without_observed_content_digest, true);
assert.equal(submission.all_submission_items_without_scope_match_result, true);
assert.equal(submission.all_submission_items_without_non_claims_result, true);
assert.equal(submission.all_submission_items_without_evidence_reference_result, true);
assert.equal(submission.all_submission_items_without_customer_data_absence_declaration, true);
assert.equal(submission.all_submission_items_without_forbidden_claims_absence_declaration, true);
assert.equal(submission.all_submission_items_not_complete, true);
assert.equal(submission.all_submission_items_not_ready_for_remediation_execution_update, true);
assert.equal(submission.all_submission_items_not_ready_for_input_collection_execution, true);
assert.equal(submission.all_submission_items_not_ready_for_input_verification, true);
assert.equal(submission.all_submission_items_not_ready_for_retry_gate_rerun, true);

for (const item of submission.submission_items) {
  assert.match(item.operator_input_submission_item_id, /^PUBLIC-SURFACE-OBSERVATION-OPERATOR-INPUT-SUBMISSION::HBCE-L1::/);
  assert.equal(item.submission_status, 'PENDING_OPERATOR_INPUTS');
  assert.equal(item.submission_required, true);
  assert.equal(item.required_operator_inputs.includes('public_url'), true);
  assert.equal(item.required_operator_inputs.includes('observer_ref'), true);
  assert.equal(item.required_operator_inputs.includes('observed_content_digest'), true);
  assert.equal(item.submitter_ref, null);
  assert.equal(item.submitted_at, null);
  assert.equal(item.public_url, null);
  assert.equal(item.observer_ref, null);
  assert.equal(item.observed_content_digest, null);
  assert.equal(item.scope_match_result, null);
  assert.equal(item.non_claims_presence_result, null);
  assert.equal(item.evidence_reference_presence_result, null);
  assert.equal(item.customer_data_absence_declaration, null);
  assert.equal(item.forbidden_claims_absence_declaration, null);
  assert.equal(item.public_url_submitted, false);
  assert.equal(item.observer_ref_submitted, false);
  assert.equal(item.observed_content_digest_submitted, false);
  assert.equal(item.all_required_operator_inputs_submitted, false);
  assert.equal(item.operator_input_submission_complete, false);
  assert.equal(item.ready_for_remediation_execution_update, false);
  assert.equal(item.ready_for_input_collection_execution, false);
  assert.equal(item.ready_for_input_verification, false);
  assert.equal(item.ready_for_retry_gate_rerun, false);
}

assert.equal(submission.operator_input_submission_defined, true);
assert.equal(submission.operator_input_submission_artifact_ready, true);
assert.equal(submission.operator_inputs_submitted, false);
assert.equal(submission.operator_input_submission_completed, false);
assert.equal(submission.remediation_execution_update_ready, false);
assert.equal(submission.input_collection_execution_ready, false);
assert.equal(submission.input_verification_ready, false);
assert.equal(submission.retry_gate_rerun_ready, false);
assert.equal(submission.public_surface_observed, false);
assert.equal(submission.public_surface_observation_ready, false);
assert.equal(submission.external_customer_ready, false);
assert.equal(submission.banking_pack_ready, false);
assert.equal(submission.level1_launch_ready, false);
assert.equal(submission.production_ready, false);
assert.equal(submission.ai_operator_input_submission_authority_allowed, false);

assert.equal(submission.operator_input_submission_boundary.controlled_information_surface_only, true);
assert.equal(submission.operator_input_submission_boundary.submission_schema_definition_only, true);
assert.equal(submission.operator_input_submission_boundary.operator_inputs_pending, true);
assert.equal(submission.operator_input_submission_boundary.no_operator_inputs_recorded, true);
assert.equal(submission.operator_input_submission_boundary.no_remediation_execution_update_recorded, true);
assert.equal(submission.operator_input_submission_boundary.no_input_collection_execution_recorded, true);
assert.equal(submission.operator_input_submission_boundary.no_input_verification_recorded, true);
assert.equal(submission.operator_input_submission_boundary.no_retry_gate_rerun_recorded, true);
assert.equal(submission.operator_input_submission_boundary.no_public_observation_recorded, true);
assert.equal(submission.operator_input_submission_boundary.no_customer_data, true);
assert.equal(submission.operator_input_submission_boundary.no_live_system_control, true);
assert.equal(submission.operator_input_submission_boundary.no_ai_authority_claim, true);

assert.equal(submission.operator_input_submission_checklist.source_public_surface_observation_remediation_execution_hash_valid, true);
assert.equal(submission.operator_input_submission_checklist.source_public_surface_observation_remediation_execution_ready, true);
assert.equal(submission.operator_input_submission_checklist.source_public_surface_observation_remediation_execution_evaluated, true);
assert.equal(submission.operator_input_submission_checklist.source_remediation_execution_blocked_missing_operator_inputs, true);
assert.equal(submission.operator_input_submission_checklist.operator_input_submission_defined, true);
assert.equal(submission.operator_input_submission_checklist.operator_inputs_submitted, false);
assert.equal(submission.operator_input_submission_checklist.operator_input_submission_completed, false);
assert.equal(submission.operator_input_submission_checklist.all_execution_items_have_submission_items, true);
assert.equal(submission.operator_input_submission_checklist.all_submission_items_pending, true);
assert.equal(submission.operator_input_submission_checklist.all_submission_items_without_public_url, true);
assert.equal(submission.operator_input_submission_checklist.all_submission_items_without_observer_ref, true);
assert.equal(submission.operator_input_submission_checklist.all_submission_items_without_observed_content_digest, true);
assert.equal(submission.operator_input_submission_checklist.input_verification_ready, false);
assert.equal(submission.operator_input_submission_checklist.retry_gate_rerun_ready, false);
assert.equal(submission.operator_input_submission_checklist.public_surface_observed, false);
assert.equal(submission.operator_input_submission_checklist.public_observation_ready, false);
assert.equal(submission.operator_input_submission_checklist.ai_authority_absence_confirmed, true);

assert.equal(submission.operator_input_submission_is_defined, true);
assert.equal(submission.operator_input_submission_is_pending_inputs, true);
assert.equal(submission.operator_input_submission_is_not_completed, true);
assert.equal(submission.operator_input_submission_is_not_public_observation_ready, true);
assert.equal(submission.operator_input_submission_is_not_external_customer_readiness, true);
assert.equal(submission.operator_input_submission_is_not_banking_pack_readiness, true);
assert.equal(submission.operator_input_submission_is_not_launch_readiness, true);
assert.equal(submission.operator_input_submission_is_not_production_readiness, true);
assert.equal(submission.operator_input_submission_does_not_authorize_ai_authority, true);

assert.equal(doc.readiness_state.public_surface_observation_operator_input_submission_defined, true);
assert.equal(doc.readiness_state.public_surface_observation_operator_input_submission_ready, true);
assert.equal(doc.readiness_state.public_surface_observation_operator_input_submission_completed, false);
assert.equal(doc.readiness_state.operator_inputs_submitted, false);
assert.equal(doc.readiness_state.operator_inputs_collected, false);
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

assert.equal(doc.next_required_program, 'PROG-110-HBCE-LEVEL1-PUBLIC-SURFACE-OBSERVATION-OPERATOR-INPUT-SUBMISSION-VERIFICATION');

assert.equal(doc.non_claims.legal_validity, false);
assert.equal(doc.non_claims.public_accreditation, false);
assert.equal(doc.non_claims.procurement_eligibility, false);
assert.equal(doc.non_claims.external_effect_proven, false);
assert.equal(doc.non_claims.business_success, false);
assert.equal(doc.non_claims.ai_authority, false);
assert.equal(doc.non_claims.operator_inputs_submitted, false);
assert.equal(doc.non_claims.public_surface_observed, false);
assert.equal(doc.non_claims.public_surface_observation_ready, false);
assert.equal(doc.non_claims.external_customer_ready, false);
assert.equal(doc.non_claims.banking_pack_ready, false);
assert.equal(doc.non_claims.level1_launch_ready, false);
assert.equal(doc.non_claims.production_ready, false);

assert.match(md, /LEVEL1_PUBLIC_SURFACE_OBSERVATION_OPERATOR_INPUT_SUBMISSION_DEFINED_PENDING_INPUTS/);
assert.match(md, /Operator inputs are pending/);
assert.match(md, /No public URL is submitted/);
assert.match(md, /No observer reference is submitted/);
assert.match(md, /No observed content digest is submitted/);
assert.match(md, /The submission is not completed/);
assert.match(md, /PROG-110-HBCE-LEVEL1-PUBLIC-SURFACE-OBSERVATION-OPERATOR-INPUT-SUBMISSION-VERIFICATION/);

console.log('PASS PROG-109-PUBLIC-SURFACE-OBSERVATION-OPERATOR-INPUT-SUBMISSION-DOCS-EXIST');
console.log('PASS PROG-109-PUBLIC-SURFACE-OBSERVATION-OPERATOR-INPUT-SUBMISSION-HASH-STABLE');
console.log('PASS PROG-109-BUILDER-STABLE');
console.log('PASS PROG-109-SOURCE-PROG-108-INTEGRITY-VALID');
console.log('PASS PROG-109-SUBMISSION-ITEMS-DEFINED');
console.log('PASS PROG-109-OPERATOR-INPUTS-PENDING');
console.log('PASS PROG-109-NO-PLACEHOLDER-OPERATOR-INPUTS');
console.log('PASS PROG-109-SUBMISSION-NOT-COMPLETED');
console.log('PASS PROG-109-INPUT-COLLECTION-EXECUTION-NOT-READY');
console.log('PASS PROG-109-INPUT-VERIFICATION-NOT-READY');
console.log('PASS PROG-109-RETRY-GATE-RERUN-NOT-READY');
console.log('PASS PROG-109-AI-OPERATOR-INPUT-SUBMISSION-AUTHORITY-DISALLOWED');
console.log('PASS PROG-109-NEXT-PROG-110-RECORDED');
console.log('PASS PROG-109-NO-UNSUPPORTED-READINESS-CLAIMS');
