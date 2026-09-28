'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { sha256Digest } = require('../../../packages/hbce-core/canonical-json.js');
const {
  STATUS,
  SOURCE_REF,
  requiredInputs,
  buildObservationOperatorInputCollectionExecutionPayload,
  buildLevel1PublicSurfaceObservationOperatorInputCollectionExecution
} = require('../../../runtime/level1/build-prog-114-level1-public-surface-observation-operator-input-collection-execution.js');

const root = path.resolve(__dirname, '../../..');
const read = (p) => fs.readFileSync(path.join(root, p), 'utf8');
const json = (p) => JSON.parse(read(p));
const exists = (p) => fs.existsSync(path.join(root, p));

const docPath = 'docs/launch/level1/prog-114-level1-public-surface-observation-operator-input-collection-execution.json';
const mdPath = 'docs/launch/level1/prog-114-level1-public-surface-observation-operator-input-collection-execution.md';
const runtimePath = 'runtime/level1/build-prog-114-level1-public-surface-observation-operator-input-collection-execution.js';

for (const p of [docPath, mdPath, runtimePath, SOURCE_REF]) assert.equal(exists(p), true, `${p} must exist`);

const doc = json(docPath);
const md = read(mdPath);
const source = json(SOURCE_REF);

assert.equal(doc.proto, 'HBCE-L1-PROG-114-PUBLIC-SURFACE-OBSERVATION-OPERATOR-INPUT-COLLECTION-EXECUTION-v1');
assert.equal(doc.kind, 'HBCE_LEVEL1_PUBLIC_SURFACE_OBSERVATION_OPERATOR_INPUT_COLLECTION_EXECUTION');
assert.equal(doc.issue_id, 'PROG-114');
assert.equal(doc.level1_public_surface_observation_operator_input_collection_execution_status, STATUS);
assert.equal(doc.source_public_surface_observation_operator_input_collection_pack_revision_hash, source.revision_hash);
assert.equal(doc.source_public_surface_observation_operator_input_collection_pack_revision_hash_valid, true);

const regenerated = buildLevel1PublicSurfaceObservationOperatorInputCollectionExecution({ rootDir: root, repositoryCommit: doc.repository_baseline_commit });
assert.deepEqual(regenerated, doc);

const body = { ...doc };
delete body.revision_hash;
assert.equal(doc.revision_hash, sha256Digest(body));

const expectedPayload = buildObservationOperatorInputCollectionExecutionPayload(source);
const execution = doc.public_surface_observation_operator_input_collection_execution;

assert.equal(execution.operator_input_collection_execution_payload_digest, sha256Digest(expectedPayload));
assert.equal(execution.operator_input_collection_execution_status, 'BLOCKED_MISSING_OPERATOR_INPUTS');
assert.equal(execution.operator_input_collection_execution_result, 'OPERATOR_INPUT_COLLECTION_EXECUTION_NOT_COMPLETED');

assert.equal(execution.imported_operator_input_collection_pack_status, 'DEFINED_PENDING_OPERATOR_INPUTS');
assert.equal(execution.imported_operator_input_collection_pack_defined, true);
assert.equal(execution.imported_operator_input_collection_pack_ready, true);
assert.equal(execution.imported_operator_input_collection_pack_completed, false);
assert.equal(execution.imported_operator_input_collection_execution_ready, true);
assert.equal(execution.imported_operator_input_collection_attempted, false);
assert.equal(execution.imported_operator_input_collection_completed, false);
assert.equal(execution.imported_operator_inputs_collected, false);
assert.equal(execution.imported_operator_inputs_submitted, false);
assert.equal(execution.imported_operator_inputs_verified, false);

assert.equal(execution.collection_execution_item_count, 4);
assert.equal(execution.collection_execution_items.length, 4);
assert.equal(execution.all_collection_pack_items_have_execution_items, true);
assert.equal(execution.all_collection_execution_items_blocked_missing_operator_inputs, true);
assert.equal(execution.all_collection_execution_items_have_capture_contract, true);
assert.equal(execution.all_collection_execution_items_require_submitter_ref, true);
assert.equal(execution.all_collection_execution_items_require_submitted_at, true);
assert.equal(execution.all_collection_execution_items_require_submission_channel, true);
assert.equal(execution.all_collection_execution_items_require_public_url, true);
assert.equal(execution.all_collection_execution_items_require_observer_ref, true);
assert.equal(execution.all_collection_execution_items_require_observed_content_digest, true);
assert.equal(execution.all_collection_execution_items_require_scope_match_result, true);
assert.equal(execution.all_collection_execution_items_require_non_claims_presence_result, true);
assert.equal(execution.all_collection_execution_items_require_evidence_reference_presence_result, true);
assert.equal(execution.all_collection_execution_items_require_customer_data_absence_declaration, true);
assert.equal(execution.all_collection_execution_items_require_forbidden_claims_absence_declaration, true);
assert.equal(execution.all_collection_execution_items_without_submitter_ref, true);
assert.equal(execution.all_collection_execution_items_without_submitted_at, true);
assert.equal(execution.all_collection_execution_items_without_submission_channel, true);
assert.equal(execution.all_collection_execution_items_without_public_url, true);
assert.equal(execution.all_collection_execution_items_without_observer_ref, true);
assert.equal(execution.all_collection_execution_items_without_observed_content_digest, true);
assert.equal(execution.all_collection_execution_items_without_scope_match_result, true);
assert.equal(execution.all_collection_execution_items_without_non_claims_result, true);
assert.equal(execution.all_collection_execution_items_without_evidence_reference_result, true);
assert.equal(execution.all_collection_execution_items_without_customer_data_absence_declaration, true);
assert.equal(execution.all_collection_execution_items_without_forbidden_claims_absence_declaration, true);
assert.equal(execution.all_collection_execution_items_evaluated, true);
assert.equal(execution.all_collection_execution_items_not_attempted, true);
assert.equal(execution.all_collection_execution_items_not_completed, true);
assert.equal(execution.all_collection_execution_items_not_ready_for_operator_input_submission, true);
assert.equal(execution.all_collection_execution_items_not_ready_for_submission_verification_rerun, true);
assert.equal(execution.all_collection_execution_items_not_ready_for_remediation_execution_update, true);
assert.equal(execution.all_collection_execution_items_not_ready_for_input_collection_execution, true);
assert.equal(execution.all_collection_execution_items_not_ready_for_input_verification, true);
assert.equal(execution.all_collection_execution_items_not_ready_for_retry_gate_rerun, true);

for (const item of execution.collection_execution_items) {
  assert.match(item.operator_input_collection_execution_item_id, /^PUBLIC-SURFACE-OBSERVATION-OPERATOR-INPUT-COLLECTION-EXECUTION::HBCE-L1::/);
  assert.equal(item.collection_execution_status, 'BLOCKED_MISSING_OPERATOR_INPUTS');
  assert.equal(item.collection_execution_required, true);
  assert.equal(item.source_collection_status, 'PENDING_OPERATOR_INPUT_COLLECTION');
  assert.equal(item.input_capture_contract_present, true);

  for (const input of requiredInputs()) {
    assert.equal(item.required_operator_inputs.includes(input), true);
    assert.equal(item.missing_operator_inputs.includes(input), true);
  }

  assert.equal(item.submitter_ref, null);
  assert.equal(item.submitted_at, null);
  assert.equal(item.submission_channel, null);
  assert.equal(item.public_url, null);
  assert.equal(item.observer_ref, null);
  assert.equal(item.observed_content_digest, null);
  assert.equal(item.scope_match_result, null);
  assert.equal(item.non_claims_presence_result, null);
  assert.equal(item.evidence_reference_presence_result, null);
  assert.equal(item.customer_data_absence_declaration, null);
  assert.equal(item.forbidden_claims_absence_declaration, null);
  assert.equal(item.all_required_operator_inputs_collected, false);
  assert.equal(item.collection_execution_evaluated, true);
  assert.equal(item.collection_execution_attempted, false);
  assert.equal(item.collection_execution_completed, false);
  assert.equal(item.collection_execution_blocked_missing_operator_inputs, true);
  assert.equal(item.operator_inputs_collected, false);
  assert.equal(item.operator_inputs_submitted, false);
  assert.equal(item.operator_inputs_verified, false);
  assert.equal(item.ready_for_operator_input_submission, false);
  assert.equal(item.ready_for_submission_verification_rerun, false);
  assert.equal(item.ready_for_remediation_execution_update, false);
  assert.equal(item.ready_for_input_collection_execution, false);
  assert.equal(item.ready_for_input_verification, false);
  assert.equal(item.ready_for_retry_gate_rerun, false);
}

assert.equal(execution.operator_input_collection_execution_defined, true);
assert.equal(execution.operator_input_collection_execution_ready, true);
assert.equal(execution.operator_input_collection_execution_evaluated, true);
assert.equal(execution.operator_input_collection_execution_attempted, false);
assert.equal(execution.operator_input_collection_execution_completed, false);
assert.equal(execution.operator_input_collection_execution_blocked_missing_operator_inputs, true);
assert.equal(execution.operator_input_submission_ready, false);
assert.equal(execution.operator_input_submission_completed, false);
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
assert.equal(execution.ai_operator_input_collection_execution_authority_allowed, false);

assert.equal(execution.operator_input_collection_execution_boundary.controlled_information_surface_only, true);
assert.equal(execution.operator_input_collection_execution_boundary.collection_execution_evaluation_only, true);
assert.equal(execution.operator_input_collection_execution_boundary.collection_execution_blocked_missing_operator_inputs, true);
assert.equal(execution.operator_input_collection_execution_boundary.no_operator_inputs_recorded, true);
assert.equal(execution.operator_input_collection_execution_boundary.no_operator_inputs_collected, true);
assert.equal(execution.operator_input_collection_execution_boundary.no_operator_inputs_submitted, true);
assert.equal(execution.operator_input_collection_execution_boundary.no_operator_inputs_verified, true);
assert.equal(execution.operator_input_collection_execution_boundary.no_public_observation_recorded, true);
assert.equal(execution.operator_input_collection_execution_boundary.no_customer_data, true);
assert.equal(execution.operator_input_collection_execution_boundary.no_live_system_control, true);
assert.equal(execution.operator_input_collection_execution_boundary.no_ai_authority_claim, true);

assert.equal(execution.operator_input_collection_execution_checklist.source_public_surface_observation_operator_input_collection_pack_hash_valid, true);
assert.equal(execution.operator_input_collection_execution_checklist.source_operator_input_collection_pack_ready, true);
assert.equal(execution.operator_input_collection_execution_checklist.source_operator_input_collection_pack_completed, false);
assert.equal(execution.operator_input_collection_execution_checklist.source_operator_input_collection_execution_ready, true);
assert.equal(execution.operator_input_collection_execution_checklist.source_operator_inputs_collected, false);
assert.equal(execution.operator_input_collection_execution_checklist.operator_input_collection_execution_defined, true);
assert.equal(execution.operator_input_collection_execution_checklist.operator_input_collection_execution_ready, true);
assert.equal(execution.operator_input_collection_execution_checklist.operator_input_collection_execution_evaluated, true);
assert.equal(execution.operator_input_collection_execution_checklist.operator_input_collection_execution_attempted, false);
assert.equal(execution.operator_input_collection_execution_checklist.operator_input_collection_execution_completed, false);
assert.equal(execution.operator_input_collection_execution_checklist.operator_input_collection_execution_blocked_missing_operator_inputs, true);
assert.equal(execution.operator_input_collection_execution_checklist.operator_inputs_collected, false);
assert.equal(execution.operator_input_collection_execution_checklist.operator_inputs_submitted, false);
assert.equal(execution.operator_input_collection_execution_checklist.operator_inputs_verified, false);
assert.equal(execution.operator_input_collection_execution_checklist.public_surface_observed, false);
assert.equal(execution.operator_input_collection_execution_checklist.public_observation_ready, false);
assert.equal(execution.operator_input_collection_execution_checklist.ai_authority_absence_confirmed, true);

assert.equal(execution.operator_input_collection_execution_is_defined, true);
assert.equal(execution.operator_input_collection_execution_is_ready, true);
assert.equal(execution.operator_input_collection_execution_is_evaluated, true);
assert.equal(execution.operator_input_collection_execution_is_blocked_missing_operator_inputs, true);
assert.equal(execution.operator_input_collection_execution_is_not_attempted, true);
assert.equal(execution.operator_input_collection_execution_is_not_completed, true);
assert.equal(execution.operator_input_collection_execution_is_not_operator_inputs_collected, true);
assert.equal(execution.operator_input_collection_execution_is_not_operator_inputs_submitted, true);
assert.equal(execution.operator_input_collection_execution_is_not_operator_inputs_verified, true);
assert.equal(execution.operator_input_collection_execution_is_not_public_observation_ready, true);
assert.equal(execution.operator_input_collection_execution_is_not_external_customer_readiness, true);
assert.equal(execution.operator_input_collection_execution_is_not_banking_pack_readiness, true);
assert.equal(execution.operator_input_collection_execution_is_not_launch_readiness, true);
assert.equal(execution.operator_input_collection_execution_is_not_production_readiness, true);
assert.equal(execution.operator_input_collection_execution_does_not_authorize_ai_authority, true);

assert.equal(doc.readiness_state.public_surface_observation_operator_input_collection_execution_defined, true);
assert.equal(doc.readiness_state.public_surface_observation_operator_input_collection_execution_ready, true);
assert.equal(doc.readiness_state.public_surface_observation_operator_input_collection_execution_evaluated, true);
assert.equal(doc.readiness_state.public_surface_observation_operator_input_collection_execution_attempted, false);
assert.equal(doc.readiness_state.public_surface_observation_operator_input_collection_execution_completed, false);
assert.equal(doc.readiness_state.public_surface_observation_operator_input_collection_execution_blocked_missing_operator_inputs, true);
assert.equal(doc.readiness_state.operator_input_collection_execution_ready, true);
assert.equal(doc.readiness_state.operator_input_collection_attempted, false);
assert.equal(doc.readiness_state.operator_input_collection_completed, false);
assert.equal(doc.readiness_state.operator_input_submission_ready, false);
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

assert.equal(doc.next_required_program, 'PROG-115-HBCE-LEVEL1-PUBLIC-SURFACE-OBSERVATION-OPERATOR-INPUT-COLLECTION-RETRY-GATE');

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

assert.match(md, /LEVEL1_PUBLIC_SURFACE_OBSERVATION_OPERATOR_INPUT_COLLECTION_EXECUTION_BLOCKED_MISSING_OPERATOR_INPUTS/);
assert.match(md, /The input capture contract is present/);
assert.match(md, /The collection execution is blocked because required operator inputs are missing/);
assert.match(md, /Collection execution is not attempted/);
assert.match(md, /Public URL is not collected/);
assert.match(md, /Observer reference is not collected/);
assert.match(md, /Observed content digest is not collected/);
assert.match(md, /Operator inputs are not verified/);
assert.match(md, /PROG-115-HBCE-LEVEL1-PUBLIC-SURFACE-OBSERVATION-OPERATOR-INPUT-COLLECTION-RETRY-GATE/);

console.log('PASS PROG-114-PUBLIC-SURFACE-OBSERVATION-OPERATOR-INPUT-COLLECTION-EXECUTION-DOCS-EXIST');
console.log('PASS PROG-114-PUBLIC-SURFACE-OBSERVATION-OPERATOR-INPUT-COLLECTION-EXECUTION-HASH-STABLE');
console.log('PASS PROG-114-BUILDER-STABLE');
console.log('PASS PROG-114-SOURCE-PROG-113-INTEGRITY-VALID');
console.log('PASS PROG-114-COLLECTION-EXECUTION-ITEMS-DEFINED');
console.log('PASS PROG-114-INPUT-CAPTURE-CONTRACT-PRESENT');
console.log('PASS PROG-114-COLLECTION-EXECUTION-READY');
console.log('PASS PROG-114-COLLECTION-EXECUTION-EVALUATED');
console.log('PASS PROG-114-COLLECTION-EXECUTION-BLOCKED-MISSING-OPERATOR-INPUTS');
console.log('PASS PROG-114-COLLECTION-EXECUTION-NOT-ATTEMPTED');
console.log('PASS PROG-114-COLLECTION-EXECUTION-NOT-COMPLETED');
console.log('PASS PROG-114-OPERATOR-INPUTS-NOT-COLLECTED');
console.log('PASS PROG-114-OPERATOR-INPUTS-NOT-SUBMITTED');
console.log('PASS PROG-114-OPERATOR-INPUTS-NOT-VERIFIED');
console.log('PASS PROG-114-SUBMISSION-VERIFICATION-RERUN-NOT-READY');
console.log('PASS PROG-114-RETRY-GATE-RERUN-NOT-READY');
console.log('PASS PROG-114-AI-OPERATOR-INPUT-COLLECTION-EXECUTION-AUTHORITY-DISALLOWED');
console.log('PASS PROG-114-NEXT-PROG-115-RECORDED');
console.log('PASS PROG-114-NO-UNSUPPORTED-READINESS-CLAIMS');
