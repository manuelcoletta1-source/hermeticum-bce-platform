'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { sha256Digest } = require('../../../packages/hbce-core/canonical-json.js');
const {
  STATUS,
  SOURCE_REF,
  buildObservationOperatorInputSubmissionRemediationPayload,
  buildLevel1PublicSurfaceObservationOperatorInputSubmissionRemediation
} = require('../../../runtime/level1/build-prog-111-level1-public-surface-observation-operator-input-submission-remediation.js');

const root = path.resolve(__dirname, '../../..');
const read = (p) => fs.readFileSync(path.join(root, p), 'utf8');
const json = (p) => JSON.parse(read(p));
const exists = (p) => fs.existsSync(path.join(root, p));

const docPath = 'docs/launch/level1/prog-111-level1-public-surface-observation-operator-input-submission-remediation.json';
const mdPath = 'docs/launch/level1/prog-111-level1-public-surface-observation-operator-input-submission-remediation.md';
const runtimePath = 'runtime/level1/build-prog-111-level1-public-surface-observation-operator-input-submission-remediation.js';

for (const p of [docPath, mdPath, runtimePath, SOURCE_REF]) assert.equal(exists(p), true, `${p} must exist`);

const doc = json(docPath);
const md = read(mdPath);
const source = json(SOURCE_REF);

assert.equal(doc.proto, 'HBCE-L1-PROG-111-PUBLIC-SURFACE-OBSERVATION-OPERATOR-INPUT-SUBMISSION-REMEDIATION-v1');
assert.equal(doc.kind, 'HBCE_LEVEL1_PUBLIC_SURFACE_OBSERVATION_OPERATOR_INPUT_SUBMISSION_REMEDIATION');
assert.equal(doc.issue_id, 'PROG-111');
assert.equal(doc.level1_public_surface_observation_operator_input_submission_remediation_status, STATUS);
assert.equal(doc.source_public_surface_observation_operator_input_submission_verification_revision_hash, source.revision_hash);
assert.equal(doc.source_public_surface_observation_operator_input_submission_verification_revision_hash_valid, true);

const regenerated = buildLevel1PublicSurfaceObservationOperatorInputSubmissionRemediation({ rootDir: root, repositoryCommit: doc.repository_baseline_commit });
assert.deepEqual(regenerated, doc);

const body = { ...doc };
delete body.revision_hash;
assert.equal(doc.revision_hash, sha256Digest(body));

assert.equal(doc.inherited_public_surface_observation_operator_input_submission_verification.operator_input_submission_verification_status, 'LEVEL1_PUBLIC_SURFACE_OBSERVATION_OPERATOR_INPUT_SUBMISSION_VERIFICATION_BLOCKED_INCOMPLETE_SUBMISSION');
assert.equal(doc.inherited_public_surface_observation_operator_input_submission_verification.public_surface_observation_operator_input_submission_verification_ready, true);
assert.equal(doc.inherited_public_surface_observation_operator_input_submission_verification.public_surface_observation_operator_input_submission_verification_evaluated, true);
assert.equal(doc.inherited_public_surface_observation_operator_input_submission_verification.public_surface_observation_operator_input_submission_verification_passed, false);
assert.equal(doc.inherited_public_surface_observation_operator_input_submission_verification.public_surface_observation_operator_input_submission_verification_blocked, true);
assert.equal(doc.inherited_public_surface_observation_operator_input_submission_verification.operator_input_submission_incomplete, true);
assert.equal(doc.inherited_public_surface_observation_operator_input_submission_verification.operator_inputs_verified, false);

const expectedPayload = buildObservationOperatorInputSubmissionRemediationPayload(source);
const remediation = doc.public_surface_observation_operator_input_submission_remediation;

assert.equal(remediation.operator_input_submission_remediation_payload_digest, sha256Digest(expectedPayload));
assert.equal(remediation.operator_input_submission_remediation_status, 'DEFINED_PENDING_OPERATOR_INPUT_REMEDIATION');
assert.equal(remediation.operator_input_submission_remediation_result, 'OPERATOR_INPUT_REMEDIATION_NOT_COMPLETED');
assert.equal(remediation.imported_operator_input_submission_verification_status, 'BLOCKED_INCOMPLETE_OPERATOR_INPUT_SUBMISSION');
assert.equal(remediation.imported_operator_input_submission_verification_result, 'OPERATOR_INPUT_SUBMISSION_NOT_VERIFIED');
assert.equal(remediation.imported_operator_input_submission_verification_evaluated, true);
assert.equal(remediation.imported_operator_input_submission_verification_performed, false);
assert.equal(remediation.imported_operator_input_submission_verification_passed, false);
assert.equal(remediation.imported_operator_input_submission_verification_blocked, true);
assert.equal(remediation.imported_operator_input_submission_incomplete, true);
assert.equal(remediation.imported_operator_inputs_verified, false);

assert.equal(remediation.remediation_item_count, 4);
assert.equal(remediation.remediation_items.length, 4);
assert.equal(remediation.all_verification_items_have_remediation_items, true);
assert.equal(remediation.all_remediation_items_pending, true);
assert.equal(remediation.all_remediation_items_require_submitter_ref, true);
assert.equal(remediation.all_remediation_items_require_submitted_at, true);
assert.equal(remediation.all_remediation_items_require_submission_channel, true);
assert.equal(remediation.all_remediation_items_require_public_url, true);
assert.equal(remediation.all_remediation_items_require_observer_ref, true);
assert.equal(remediation.all_remediation_items_require_observed_content_digest, true);
assert.equal(remediation.all_remediation_items_require_scope_match_result, true);
assert.equal(remediation.all_remediation_items_require_non_claims_presence_result, true);
assert.equal(remediation.all_remediation_items_require_evidence_reference_presence_result, true);
assert.equal(remediation.all_remediation_items_require_customer_data_absence_declaration, true);
assert.equal(remediation.all_remediation_items_require_forbidden_claims_absence_declaration, true);
assert.equal(remediation.all_remediation_items_require_verification_rerun, true);
assert.equal(remediation.all_remediation_items_not_complete, true);
assert.equal(remediation.all_remediation_items_ready_for_operator_input_collection, true);
assert.equal(remediation.all_remediation_items_not_ready_for_submission_verification_rerun, true);
assert.equal(remediation.all_remediation_items_not_ready_for_remediation_execution_update, true);
assert.equal(remediation.all_remediation_items_not_ready_for_input_collection_execution, true);
assert.equal(remediation.all_remediation_items_not_ready_for_retry_gate_rerun, true);

for (const item of remediation.remediation_items) {
  assert.match(item.operator_input_submission_remediation_item_id, /^PUBLIC-SURFACE-OBSERVATION-OPERATOR-INPUT-SUBMISSION-REMEDIATION::HBCE-L1::/);
  assert.equal(item.remediation_status, 'PENDING_OPERATOR_INPUT_REMEDIATION');
  assert.equal(item.remediation_required, true);
  assert.equal(item.source_verification_status, 'BLOCKED_INCOMPLETE_SUBMISSION');
  assert.equal(item.missing_operator_inputs.includes('public_url'), true);
  assert.equal(item.missing_operator_inputs.includes('observer_ref'), true);
  assert.equal(item.missing_operator_inputs.includes('observed_content_digest'), true);
  assert.equal(item.remediation_actions.includes('collect_public_url'), true);
  assert.equal(item.remediation_actions.includes('collect_observer_ref'), true);
  assert.equal(item.remediation_actions.includes('collect_observed_content_digest'), true);
  assert.equal(item.remediation_actions.includes('rerun_operator_input_submission_verification'), true);
  assert.equal(item.submitter_ref_collected, false);
  assert.equal(item.submitted_at_collected, false);
  assert.equal(item.submission_channel_collected, false);
  assert.equal(item.public_url_collected, false);
  assert.equal(item.observer_ref_collected, false);
  assert.equal(item.observed_content_digest_collected, false);
  assert.equal(item.scope_match_result_collected, false);
  assert.equal(item.non_claims_presence_result_collected, false);
  assert.equal(item.evidence_reference_presence_result_collected, false);
  assert.equal(item.customer_data_absence_declaration_collected, false);
  assert.equal(item.forbidden_claims_absence_declaration_collected, false);
  assert.equal(item.verification_rerun_completed, false);
  assert.equal(item.verification_rerun_passed, false);
  assert.equal(item.remediation_complete, false);
  assert.equal(item.ready_for_operator_input_collection, true);
  assert.equal(item.ready_for_submission_verification_rerun, false);
  assert.equal(item.ready_for_remediation_execution_update, false);
  assert.equal(item.ready_for_input_collection_execution, false);
  assert.equal(item.ready_for_retry_gate_rerun, false);
}

assert.equal(remediation.operator_input_submission_remediation_defined, true);
assert.equal(remediation.operator_input_submission_remediation_artifact_ready, true);
assert.equal(remediation.operator_input_submission_remediation_completed, false);
assert.equal(remediation.operator_input_collection_ready, true);
assert.equal(remediation.operator_inputs_collected, false);
assert.equal(remediation.operator_inputs_submitted, false);
assert.equal(remediation.operator_inputs_verified, false);
assert.equal(remediation.submission_verification_rerun_ready, false);
assert.equal(remediation.remediation_execution_update_ready, false);
assert.equal(remediation.input_collection_execution_ready, false);
assert.equal(remediation.input_verification_ready, false);
assert.equal(remediation.retry_gate_rerun_ready, false);
assert.equal(remediation.public_surface_observed, false);
assert.equal(remediation.public_surface_observation_ready, false);
assert.equal(remediation.external_customer_ready, false);
assert.equal(remediation.banking_pack_ready, false);
assert.equal(remediation.level1_launch_ready, false);
assert.equal(remediation.production_ready, false);
assert.equal(remediation.ai_operator_input_submission_remediation_authority_allowed, false);

assert.equal(remediation.operator_input_submission_remediation_boundary.controlled_information_surface_only, true);
assert.equal(remediation.operator_input_submission_remediation_boundary.remediation_definition_only, true);
assert.equal(remediation.operator_input_submission_remediation_boundary.operator_input_remediation_pending, true);
assert.equal(remediation.operator_input_submission_remediation_boundary.no_operator_inputs_recorded, true);
assert.equal(remediation.operator_input_submission_remediation_boundary.no_operator_inputs_verified, true);
assert.equal(remediation.operator_input_submission_remediation_boundary.no_remediation_execution_update_recorded, true);
assert.equal(remediation.operator_input_submission_remediation_boundary.no_input_collection_execution_recorded, true);
assert.equal(remediation.operator_input_submission_remediation_boundary.no_input_verification_recorded, true);
assert.equal(remediation.operator_input_submission_remediation_boundary.no_retry_gate_rerun_recorded, true);
assert.equal(remediation.operator_input_submission_remediation_boundary.no_public_observation_recorded, true);
assert.equal(remediation.operator_input_submission_remediation_boundary.no_customer_data, true);
assert.equal(remediation.operator_input_submission_remediation_boundary.no_live_system_control, true);
assert.equal(remediation.operator_input_submission_remediation_boundary.no_ai_authority_claim, true);

assert.equal(remediation.operator_input_submission_remediation_checklist.source_public_surface_observation_operator_input_submission_verification_hash_valid, true);
assert.equal(remediation.operator_input_submission_remediation_checklist.source_operator_input_submission_verification_ready, true);
assert.equal(remediation.operator_input_submission_remediation_checklist.source_operator_input_submission_verification_passed, false);
assert.equal(remediation.operator_input_submission_remediation_checklist.source_operator_input_submission_verification_blocked, true);
assert.equal(remediation.operator_input_submission_remediation_checklist.source_operator_input_submission_incomplete, true);
assert.equal(remediation.operator_input_submission_remediation_checklist.operator_input_submission_remediation_defined, true);
assert.equal(remediation.operator_input_submission_remediation_checklist.operator_input_submission_remediation_completed, false);
assert.equal(remediation.operator_input_submission_remediation_checklist.all_verification_items_have_remediation_items, true);
assert.equal(remediation.operator_input_submission_remediation_checklist.all_remediation_items_pending, true);
assert.equal(remediation.operator_input_submission_remediation_checklist.all_remediation_items_ready_for_operator_input_collection, true);
assert.equal(remediation.operator_input_submission_remediation_checklist.operator_inputs_collected, false);
assert.equal(remediation.operator_input_submission_remediation_checklist.operator_inputs_verified, false);
assert.equal(remediation.operator_input_submission_remediation_checklist.submission_verification_rerun_ready, false);
assert.equal(remediation.operator_input_submission_remediation_checklist.public_surface_observed, false);
assert.equal(remediation.operator_input_submission_remediation_checklist.public_observation_ready, false);
assert.equal(remediation.operator_input_submission_remediation_checklist.ai_authority_absence_confirmed, true);

assert.equal(remediation.operator_input_submission_remediation_is_defined, true);
assert.equal(remediation.operator_input_submission_remediation_is_pending_inputs, true);
assert.equal(remediation.operator_input_submission_remediation_is_not_completed, true);
assert.equal(remediation.operator_input_submission_remediation_is_not_operator_inputs_collected, true);
assert.equal(remediation.operator_input_submission_remediation_is_not_operator_inputs_verified, true);
assert.equal(remediation.operator_input_submission_remediation_is_not_public_observation_ready, true);
assert.equal(remediation.operator_input_submission_remediation_is_not_external_customer_readiness, true);
assert.equal(remediation.operator_input_submission_remediation_is_not_banking_pack_readiness, true);
assert.equal(remediation.operator_input_submission_remediation_is_not_launch_readiness, true);
assert.equal(remediation.operator_input_submission_remediation_is_not_production_readiness, true);
assert.equal(remediation.operator_input_submission_remediation_does_not_authorize_ai_authority, true);

assert.equal(doc.readiness_state.public_surface_observation_operator_input_submission_remediation_defined, true);
assert.equal(doc.readiness_state.public_surface_observation_operator_input_submission_remediation_ready, true);
assert.equal(doc.readiness_state.public_surface_observation_operator_input_submission_remediation_completed, false);
assert.equal(doc.readiness_state.operator_input_collection_ready, true);
assert.equal(doc.readiness_state.operator_inputs_collected, false);
assert.equal(doc.readiness_state.operator_inputs_submitted, false);
assert.equal(doc.readiness_state.operator_inputs_verified, false);
assert.equal(doc.readiness_state.submission_verification_rerun_ready, false);
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

assert.equal(doc.next_required_program, 'PROG-112-HBCE-LEVEL1-PUBLIC-SURFACE-OBSERVATION-OPERATOR-INPUT-SUBMISSION-REMEDIATION-EXECUTION');

assert.equal(doc.non_claims.legal_validity, false);
assert.equal(doc.non_claims.public_accreditation, false);
assert.equal(doc.non_claims.procurement_eligibility, false);
assert.equal(doc.non_claims.external_effect_proven, false);
assert.equal(doc.non_claims.business_success, false);
assert.equal(doc.non_claims.ai_authority, false);
assert.equal(doc.non_claims.operator_inputs_collected, false);
assert.equal(doc.non_claims.operator_inputs_submitted, false);
assert.equal(doc.non_claims.operator_inputs_verified, false);
assert.equal(doc.non_claims.public_surface_observed, false);
assert.equal(doc.non_claims.public_surface_observation_ready, false);
assert.equal(doc.non_claims.external_customer_ready, false);
assert.equal(doc.non_claims.banking_pack_ready, false);
assert.equal(doc.non_claims.level1_launch_ready, false);
assert.equal(doc.non_claims.production_ready, false);

assert.match(md, /LEVEL1_PUBLIC_SURFACE_OBSERVATION_OPERATOR_INPUT_SUBMISSION_REMEDIATION_DEFINED_PENDING_INPUTS/);
assert.match(md, /Operator input remediation is pending/);
assert.match(md, /Public URL must be collected/);
assert.match(md, /Observer reference must be collected/);
assert.match(md, /Observed content digest must be collected/);
assert.match(md, /Operator inputs are not verified/);
assert.match(md, /PROG-112-HBCE-LEVEL1-PUBLIC-SURFACE-OBSERVATION-OPERATOR-INPUT-SUBMISSION-REMEDIATION-EXECUTION/);

console.log('PASS PROG-111-PUBLIC-SURFACE-OBSERVATION-OPERATOR-INPUT-SUBMISSION-REMEDIATION-DOCS-EXIST');
console.log('PASS PROG-111-PUBLIC-SURFACE-OBSERVATION-OPERATOR-INPUT-SUBMISSION-REMEDIATION-HASH-STABLE');
console.log('PASS PROG-111-BUILDER-STABLE');
console.log('PASS PROG-111-SOURCE-PROG-110-INTEGRITY-VALID');
console.log('PASS PROG-111-REMEDIATION-ITEMS-DEFINED');
console.log('PASS PROG-111-OPERATOR-INPUT-REMEDIATION-PENDING');
console.log('PASS PROG-111-REQUIRED-INPUT-COLLECTION-ACTIONS-DEFINED');
console.log('PASS PROG-111-OPERATOR-INPUT-COLLECTION-READY');
console.log('PASS PROG-111-OPERATOR-INPUTS-NOT-COLLECTED');
console.log('PASS PROG-111-OPERATOR-INPUTS-NOT-VERIFIED');
console.log('PASS PROG-111-VERIFICATION-RERUN-NOT-READY');
console.log('PASS PROG-111-RETRY-GATE-RERUN-NOT-READY');
console.log('PASS PROG-111-AI-OPERATOR-INPUT-SUBMISSION-REMEDIATION-AUTHORITY-DISALLOWED');
console.log('PASS PROG-111-NEXT-PROG-112-RECORDED');
console.log('PASS PROG-111-NO-UNSUPPORTED-READINESS-CLAIMS');
