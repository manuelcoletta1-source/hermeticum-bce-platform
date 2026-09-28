'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { sha256Digest } = require('../../../packages/hbce-core/canonical-json.js');
const {
  STATUS,
  SOURCE_REF,
  buildObservationOperatorInputSubmissionRemediationExecutionPayload,
  buildLevel1PublicSurfaceObservationOperatorInputSubmissionRemediationExecution
} = require('../../../runtime/level1/build-prog-112-level1-public-surface-observation-operator-input-submission-remediation-execution.js');

const root = path.resolve(__dirname, '../../..');
const read = (p) => fs.readFileSync(path.join(root, p), 'utf8');
const json = (p) => JSON.parse(read(p));
const exists = (p) => fs.existsSync(path.join(root, p));

const docPath = 'docs/launch/level1/prog-112-level1-public-surface-observation-operator-input-submission-remediation-execution.json';
const mdPath = 'docs/launch/level1/prog-112-level1-public-surface-observation-operator-input-submission-remediation-execution.md';
const runtimePath = 'runtime/level1/build-prog-112-level1-public-surface-observation-operator-input-submission-remediation-execution.js';

for (const p of [docPath, mdPath, runtimePath, SOURCE_REF]) assert.equal(exists(p), true, `${p} must exist`);

const doc = json(docPath);
const md = read(mdPath);
const source = json(SOURCE_REF);

assert.equal(doc.proto, 'HBCE-L1-PROG-112-PUBLIC-SURFACE-OBSERVATION-OPERATOR-INPUT-SUBMISSION-REMEDIATION-EXECUTION-v1');
assert.equal(doc.kind, 'HBCE_LEVEL1_PUBLIC_SURFACE_OBSERVATION_OPERATOR_INPUT_SUBMISSION_REMEDIATION_EXECUTION');
assert.equal(doc.issue_id, 'PROG-112');
assert.equal(doc.level1_public_surface_observation_operator_input_submission_remediation_execution_status, STATUS);
assert.equal(doc.source_public_surface_observation_operator_input_submission_remediation_revision_hash, source.revision_hash);
assert.equal(doc.source_public_surface_observation_operator_input_submission_remediation_revision_hash_valid, true);

const regenerated = buildLevel1PublicSurfaceObservationOperatorInputSubmissionRemediationExecution({ rootDir: root, repositoryCommit: doc.repository_baseline_commit });
assert.deepEqual(regenerated, doc);

const body = { ...doc };
delete body.revision_hash;
assert.equal(doc.revision_hash, sha256Digest(body));

const expectedPayload = buildObservationOperatorInputSubmissionRemediationExecutionPayload(source);
const execution = doc.public_surface_observation_operator_input_submission_remediation_execution;

assert.equal(execution.operator_input_submission_remediation_execution_payload_digest, sha256Digest(expectedPayload));
assert.equal(execution.operator_input_submission_remediation_execution_status, 'BLOCKED_MISSING_OPERATOR_INPUTS');
assert.equal(execution.operator_input_submission_remediation_execution_result, 'OPERATOR_INPUT_REMEDIATION_EXECUTION_NOT_COMPLETED');

assert.equal(execution.imported_operator_input_submission_remediation_status, 'DEFINED_PENDING_OPERATOR_INPUT_REMEDIATION');
assert.equal(execution.imported_operator_input_submission_remediation_completed, false);
assert.equal(execution.imported_operator_input_collection_ready, true);
assert.equal(execution.imported_operator_inputs_collected, false);
assert.equal(execution.imported_operator_inputs_submitted, false);
assert.equal(execution.imported_operator_inputs_verified, false);

assert.equal(execution.execution_item_count, 4);
assert.equal(execution.execution_items.length, 4);
assert.equal(execution.all_remediation_items_have_execution_items, true);
assert.equal(execution.all_execution_items_blocked_missing_operator_inputs, true);
assert.equal(execution.all_execution_items_without_submitter_ref, true);
assert.equal(execution.all_execution_items_without_submitted_at, true);
assert.equal(execution.all_execution_items_without_submission_channel, true);
assert.equal(execution.all_execution_items_without_public_url, true);
assert.equal(execution.all_execution_items_without_observer_ref, true);
assert.equal(execution.all_execution_items_without_observed_content_digest, true);
assert.equal(execution.all_execution_items_without_scope_match_result, true);
assert.equal(execution.all_execution_items_without_non_claims_result, true);
assert.equal(execution.all_execution_items_without_evidence_reference_result, true);
assert.equal(execution.all_execution_items_without_customer_data_absence_declaration, true);
assert.equal(execution.all_execution_items_without_forbidden_claims_absence_declaration, true);
assert.equal(execution.all_execution_items_not_attempted, true);
assert.equal(execution.all_execution_items_not_completed, true);
assert.equal(execution.all_execution_items_not_ready_for_submission_verification_rerun, true);
assert.equal(execution.all_execution_items_not_ready_for_remediation_execution_update, true);
assert.equal(execution.all_execution_items_not_ready_for_input_collection_execution, true);
assert.equal(execution.all_execution_items_not_ready_for_input_verification, true);
assert.equal(execution.all_execution_items_not_ready_for_retry_gate_rerun, true);

for (const item of execution.execution_items) {
  assert.match(item.operator_input_submission_remediation_execution_item_id, /^PUBLIC-SURFACE-OBSERVATION-OPERATOR-INPUT-SUBMISSION-REMEDIATION-EXECUTION::HBCE-L1::/);
  assert.equal(item.execution_status, 'BLOCKED_MISSING_OPERATOR_INPUTS');
  assert.equal(item.execution_required, true);
  assert.equal(item.source_remediation_status, 'PENDING_OPERATOR_INPUT_REMEDIATION');
  assert.equal(item.operator_inputs_required, true);
  assert.equal(item.operator_inputs_present, false);
  assert.equal(item.public_url, null);
  assert.equal(item.observer_ref, null);
  assert.equal(item.observed_content_digest, null);
  assert.equal(item.scope_match_result, null);
  assert.equal(item.non_claims_presence_result, null);
  assert.equal(item.evidence_reference_presence_result, null);
  assert.equal(item.customer_data_absence_declaration, null);
  assert.equal(item.forbidden_claims_absence_declaration, null);
  assert.equal(item.remediation_execution_attempted, false);
  assert.equal(item.remediation_execution_completed, false);
  assert.equal(item.operator_inputs_collected, false);
  assert.equal(item.operator_inputs_submitted, false);
  assert.equal(item.operator_inputs_verified, false);
  assert.equal(item.submission_verification_rerun_ready, false);
  assert.equal(item.ready_for_remediation_execution_update, false);
  assert.equal(item.ready_for_input_collection_execution, false);
  assert.equal(item.ready_for_input_verification, false);
  assert.equal(item.ready_for_retry_gate_rerun, false);
}

assert.equal(execution.operator_input_submission_remediation_execution_defined, true);
assert.equal(execution.operator_input_submission_remediation_execution_evaluated, true);
assert.equal(execution.operator_input_submission_remediation_execution_attempted, false);
assert.equal(execution.operator_input_submission_remediation_execution_completed, false);
assert.equal(execution.operator_input_submission_remediation_execution_blocked_missing_operator_inputs, true);
assert.equal(execution.operator_input_collection_ready, true);
assert.equal(execution.operator_inputs_collected, false);
assert.equal(execution.operator_inputs_submitted, false);
assert.equal(execution.operator_inputs_verified, false);
assert.equal(execution.submission_verification_rerun_ready, false);
assert.equal(execution.remediation_execution_update_ready, false);
assert.equal(execution.input_collection_execution_ready, false);
assert.equal(execution.input_verification_ready, false);
assert.equal(execution.retry_gate_rerun_ready, false);
assert.equal(execution.public_surface_observed, false);
assert.equal(execution.public_surface_observation_ready, false);
assert.equal(execution.external_customer_ready, false);
assert.equal(execution.banking_pack_ready, false);
assert.equal(execution.level1_launch_ready, false);
assert.equal(execution.production_ready, false);
assert.equal(execution.ai_operator_input_submission_remediation_execution_authority_allowed, false);

assert.equal(execution.operator_input_submission_remediation_execution_boundary.controlled_information_surface_only, true);
assert.equal(execution.operator_input_submission_remediation_execution_boundary.remediation_execution_evaluation_only, true);
assert.equal(execution.operator_input_submission_remediation_execution_boundary.remediation_execution_blocked_missing_operator_inputs, true);
assert.equal(execution.operator_input_submission_remediation_execution_boundary.no_operator_inputs_recorded, true);
assert.equal(execution.operator_input_submission_remediation_execution_boundary.no_operator_inputs_collected, true);
assert.equal(execution.operator_input_submission_remediation_execution_boundary.no_operator_inputs_verified, true);
assert.equal(execution.operator_input_submission_remediation_execution_boundary.no_public_observation_recorded, true);
assert.equal(execution.operator_input_submission_remediation_execution_boundary.no_customer_data, true);
assert.equal(execution.operator_input_submission_remediation_execution_boundary.no_live_system_control, true);
assert.equal(execution.operator_input_submission_remediation_execution_boundary.no_ai_authority_claim, true);

assert.equal(execution.operator_input_submission_remediation_execution_is_defined, true);
assert.equal(execution.operator_input_submission_remediation_execution_is_evaluated, true);
assert.equal(execution.operator_input_submission_remediation_execution_is_blocked_missing_operator_inputs, true);
assert.equal(execution.operator_input_submission_remediation_execution_is_not_attempted, true);
assert.equal(execution.operator_input_submission_remediation_execution_is_not_completed, true);
assert.equal(execution.operator_input_submission_remediation_execution_is_not_operator_inputs_collected, true);
assert.equal(execution.operator_input_submission_remediation_execution_is_not_operator_inputs_verified, true);
assert.equal(execution.operator_input_submission_remediation_execution_is_not_public_observation_ready, true);
assert.equal(execution.operator_input_submission_remediation_execution_is_not_external_customer_readiness, true);
assert.equal(execution.operator_input_submission_remediation_execution_is_not_banking_pack_readiness, true);
assert.equal(execution.operator_input_submission_remediation_execution_is_not_launch_readiness, true);
assert.equal(execution.operator_input_submission_remediation_execution_is_not_production_readiness, true);
assert.equal(execution.operator_input_submission_remediation_execution_does_not_authorize_ai_authority, true);

assert.equal(doc.readiness_state.public_surface_observation_operator_input_submission_remediation_execution_defined, true);
assert.equal(doc.readiness_state.public_surface_observation_operator_input_submission_remediation_execution_ready, true);
assert.equal(doc.readiness_state.public_surface_observation_operator_input_submission_remediation_execution_evaluated, true);
assert.equal(doc.readiness_state.public_surface_observation_operator_input_submission_remediation_execution_attempted, false);
assert.equal(doc.readiness_state.public_surface_observation_operator_input_submission_remediation_execution_completed, false);
assert.equal(doc.readiness_state.public_surface_observation_operator_input_submission_remediation_execution_blocked_missing_operator_inputs, true);
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

assert.equal(doc.next_required_program, 'PROG-113-HBCE-LEVEL1-PUBLIC-SURFACE-OBSERVATION-OPERATOR-INPUT-COLLECTION-PACK');

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

assert.match(md, /LEVEL1_PUBLIC_SURFACE_OBSERVATION_OPERATOR_INPUT_SUBMISSION_REMEDIATION_EXECUTION_BLOCKED_MISSING_OPERATOR_INPUTS/);
assert.match(md, /remediation execution is blocked because required operator inputs are missing/);
assert.match(md, /Public URL is not collected/);
assert.match(md, /Observer reference is not collected/);
assert.match(md, /Observed content digest is not collected/);
assert.match(md, /Operator inputs are not verified/);
assert.match(md, /PROG-113-HBCE-LEVEL1-PUBLIC-SURFACE-OBSERVATION-OPERATOR-INPUT-COLLECTION-PACK/);

console.log('PASS PROG-112-PUBLIC-SURFACE-OBSERVATION-OPERATOR-INPUT-SUBMISSION-REMEDIATION-EXECUTION-DOCS-EXIST');
console.log('PASS PROG-112-PUBLIC-SURFACE-OBSERVATION-OPERATOR-INPUT-SUBMISSION-REMEDIATION-EXECUTION-HASH-STABLE');
console.log('PASS PROG-112-BUILDER-STABLE');
console.log('PASS PROG-112-SOURCE-PROG-111-INTEGRITY-VALID');
console.log('PASS PROG-112-EXECUTION-ITEMS-DEFINED');
console.log('PASS PROG-112-EXECUTION-BLOCKED-MISSING-OPERATOR-INPUTS');
console.log('PASS PROG-112-EXECUTION-NOT-ATTEMPTED');
console.log('PASS PROG-112-EXECUTION-NOT-COMPLETED');
console.log('PASS PROG-112-OPERATOR-INPUTS-NOT-COLLECTED');
console.log('PASS PROG-112-OPERATOR-INPUTS-NOT-VERIFIED');
console.log('PASS PROG-112-SUBMISSION-VERIFICATION-RERUN-NOT-READY');
console.log('PASS PROG-112-RETRY-GATE-RERUN-NOT-READY');
console.log('PASS PROG-112-AI-OPERATOR-INPUT-REMEDIATION-EXECUTION-AUTHORITY-DISALLOWED');
console.log('PASS PROG-112-NEXT-PROG-113-RECORDED');
console.log('PASS PROG-112-NO-UNSUPPORTED-READINESS-CLAIMS');
