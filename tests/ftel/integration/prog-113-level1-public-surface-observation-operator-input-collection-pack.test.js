'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { sha256Digest } = require('../../../packages/hbce-core/canonical-json.js');
const {
  STATUS,
  SOURCE_REF,
  requiredInputs,
  buildObservationOperatorInputCollectionPackPayload,
  buildLevel1PublicSurfaceObservationOperatorInputCollectionPack
} = require('../../../runtime/level1/build-prog-113-level1-public-surface-observation-operator-input-collection-pack.js');

const root = path.resolve(__dirname, '../../..');
const read = (p) => fs.readFileSync(path.join(root, p), 'utf8');
const json = (p) => JSON.parse(read(p));
const exists = (p) => fs.existsSync(path.join(root, p));

const docPath = 'docs/launch/level1/prog-113-level1-public-surface-observation-operator-input-collection-pack.json';
const mdPath = 'docs/launch/level1/prog-113-level1-public-surface-observation-operator-input-collection-pack.md';
const runtimePath = 'runtime/level1/build-prog-113-level1-public-surface-observation-operator-input-collection-pack.js';

for (const p of [docPath, mdPath, runtimePath, SOURCE_REF]) assert.equal(exists(p), true, `${p} must exist`);

const doc = json(docPath);
const md = read(mdPath);
const source = json(SOURCE_REF);

assert.equal(doc.proto, 'HBCE-L1-PROG-113-PUBLIC-SURFACE-OBSERVATION-OPERATOR-INPUT-COLLECTION-PACK-v1');
assert.equal(doc.kind, 'HBCE_LEVEL1_PUBLIC_SURFACE_OBSERVATION_OPERATOR_INPUT_COLLECTION_PACK');
assert.equal(doc.issue_id, 'PROG-113');
assert.equal(doc.level1_public_surface_observation_operator_input_collection_pack_status, STATUS);
assert.equal(doc.source_public_surface_observation_operator_input_submission_remediation_execution_revision_hash, source.revision_hash);
assert.equal(doc.source_public_surface_observation_operator_input_submission_remediation_execution_revision_hash_valid, true);

const regenerated = buildLevel1PublicSurfaceObservationOperatorInputCollectionPack({ rootDir: root, repositoryCommit: doc.repository_baseline_commit });
assert.deepEqual(regenerated, doc);

const body = { ...doc };
delete body.revision_hash;
assert.equal(doc.revision_hash, sha256Digest(body));

const expectedPayload = buildObservationOperatorInputCollectionPackPayload(source);
const pack = doc.public_surface_observation_operator_input_collection_pack;

assert.equal(pack.operator_input_collection_pack_payload_digest, sha256Digest(expectedPayload));
assert.equal(pack.operator_input_collection_pack_status, 'DEFINED_PENDING_OPERATOR_INPUTS');
assert.equal(pack.operator_input_collection_pack_result, 'OPERATOR_INPUT_COLLECTION_NOT_COMPLETED');

assert.equal(pack.imported_operator_input_submission_remediation_execution_status, 'BLOCKED_MISSING_OPERATOR_INPUTS');
assert.equal(pack.imported_operator_input_submission_remediation_execution_defined, true);
assert.equal(pack.imported_operator_input_submission_remediation_execution_evaluated, true);
assert.equal(pack.imported_operator_input_submission_remediation_execution_attempted, false);
assert.equal(pack.imported_operator_input_submission_remediation_execution_completed, false);
assert.equal(pack.imported_operator_input_submission_remediation_execution_blocked_missing_operator_inputs, true);
assert.equal(pack.imported_operator_input_collection_ready, true);
assert.equal(pack.imported_operator_inputs_collected, false);
assert.equal(pack.imported_operator_inputs_submitted, false);
assert.equal(pack.imported_operator_inputs_verified, false);

assert.equal(pack.collection_item_count, 4);
assert.equal(pack.collection_items.length, 4);
assert.equal(pack.all_execution_items_have_collection_items, true);
assert.equal(pack.all_collection_items_pending, true);
assert.equal(pack.all_collection_items_source_blocked_missing_operator_inputs, true);
assert.equal(pack.all_collection_items_have_capture_contract, true);
assert.equal(pack.all_collection_items_require_submitter_ref, true);
assert.equal(pack.all_collection_items_require_submitted_at, true);
assert.equal(pack.all_collection_items_require_submission_channel, true);
assert.equal(pack.all_collection_items_require_public_url, true);
assert.equal(pack.all_collection_items_require_observer_ref, true);
assert.equal(pack.all_collection_items_require_observed_content_digest, true);
assert.equal(pack.all_collection_items_require_scope_match_result, true);
assert.equal(pack.all_collection_items_require_non_claims_presence_result, true);
assert.equal(pack.all_collection_items_require_evidence_reference_presence_result, true);
assert.equal(pack.all_collection_items_require_customer_data_absence_declaration, true);
assert.equal(pack.all_collection_items_require_forbidden_claims_absence_declaration, true);
assert.equal(pack.all_collection_items_without_submitter_ref, true);
assert.equal(pack.all_collection_items_without_submitted_at, true);
assert.equal(pack.all_collection_items_without_submission_channel, true);
assert.equal(pack.all_collection_items_without_public_url, true);
assert.equal(pack.all_collection_items_without_observer_ref, true);
assert.equal(pack.all_collection_items_without_observed_content_digest, true);
assert.equal(pack.all_collection_items_without_scope_match_result, true);
assert.equal(pack.all_collection_items_without_non_claims_result, true);
assert.equal(pack.all_collection_items_without_evidence_reference_result, true);
assert.equal(pack.all_collection_items_without_customer_data_absence_declaration, true);
assert.equal(pack.all_collection_items_without_forbidden_claims_absence_declaration, true);
assert.equal(pack.all_collection_items_not_attempted, true);
assert.equal(pack.all_collection_items_not_completed, true);
assert.equal(pack.all_collection_items_not_ready_for_submission_verification_rerun, true);
assert.equal(pack.all_collection_items_not_ready_for_remediation_execution_update, true);
assert.equal(pack.all_collection_items_not_ready_for_input_collection_execution, true);
assert.equal(pack.all_collection_items_not_ready_for_input_verification, true);
assert.equal(pack.all_collection_items_not_ready_for_retry_gate_rerun, true);

for (const item of pack.collection_items) {
  assert.match(item.operator_input_collection_item_id, /^PUBLIC-SURFACE-OBSERVATION-OPERATOR-INPUT-COLLECTION::HBCE-L1::/);
  assert.equal(item.collection_status, 'PENDING_OPERATOR_INPUT_COLLECTION');
  assert.equal(item.collection_required, true);
  assert.equal(item.source_execution_status, 'BLOCKED_MISSING_OPERATOR_INPUTS');
  assert.equal(item.source_execution_blocked_missing_operator_inputs, true);

  for (const input of requiredInputs()) {
    assert.equal(item.required_operator_inputs.includes(input), true);
    assert.equal(item.input_capture_contract[input].required, true);
    assert.equal(item.input_capture_contract[input].submitted, false);
    assert.equal(item.input_capture_contract[input].value, null);
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
  assert.equal(item.operator_input_collection_attempted, false);
  assert.equal(item.operator_input_collection_completed, false);
  assert.equal(item.operator_inputs_submitted, false);
  assert.equal(item.operator_inputs_verified, false);
  assert.equal(item.ready_for_submission_verification_rerun, false);
  assert.equal(item.ready_for_remediation_execution_update, false);
  assert.equal(item.ready_for_input_collection_execution, false);
  assert.equal(item.ready_for_input_verification, false);
  assert.equal(item.ready_for_retry_gate_rerun, false);
}

assert.equal(pack.operator_input_collection_pack_defined, true);
assert.equal(pack.operator_input_collection_pack_ready, true);
assert.equal(pack.operator_input_collection_pack_completed, false);
assert.equal(pack.operator_input_collection_execution_ready, true);
assert.equal(pack.operator_input_collection_attempted, false);
assert.equal(pack.operator_input_collection_completed, false);
assert.equal(pack.operator_inputs_collected, false);
assert.equal(pack.operator_inputs_submitted, false);
assert.equal(pack.operator_inputs_verified, false);
assert.equal(pack.submission_verification_rerun_ready, false);
assert.equal(pack.remediation_execution_update_ready, false);
assert.equal(pack.input_collection_execution_ready, false);
assert.equal(pack.input_verification_ready, false);
assert.equal(pack.retry_gate_rerun_ready, false);
assert.equal(pack.public_surface_observed, false);
assert.equal(pack.public_surface_observation_ready, false);
assert.equal(pack.external_customer_ready, false);
assert.equal(pack.banking_pack_ready, false);
assert.equal(pack.level1_launch_ready, false);
assert.equal(pack.production_ready, false);
assert.equal(pack.ai_operator_input_collection_pack_authority_allowed, false);

assert.equal(pack.operator_input_collection_pack_boundary.controlled_information_surface_only, true);
assert.equal(pack.operator_input_collection_pack_boundary.collection_pack_definition_only, true);
assert.equal(pack.operator_input_collection_pack_boundary.no_operator_inputs_recorded, true);
assert.equal(pack.operator_input_collection_pack_boundary.no_operator_inputs_collected, true);
assert.equal(pack.operator_input_collection_pack_boundary.no_operator_inputs_submitted, true);
assert.equal(pack.operator_input_collection_pack_boundary.no_operator_inputs_verified, true);
assert.equal(pack.operator_input_collection_pack_boundary.no_public_observation_recorded, true);
assert.equal(pack.operator_input_collection_pack_boundary.no_customer_data, true);
assert.equal(pack.operator_input_collection_pack_boundary.no_live_system_control, true);
assert.equal(pack.operator_input_collection_pack_boundary.no_ai_authority_claim, true);

assert.equal(pack.operator_input_collection_pack_checklist.source_public_surface_observation_operator_input_submission_remediation_execution_hash_valid, true);
assert.equal(pack.operator_input_collection_pack_checklist.source_operator_input_submission_remediation_execution_ready, true);
assert.equal(pack.operator_input_collection_pack_checklist.source_operator_input_submission_remediation_execution_blocked_missing_operator_inputs, true);
assert.equal(pack.operator_input_collection_pack_checklist.source_operator_input_collection_ready, true);
assert.equal(pack.operator_input_collection_pack_checklist.source_operator_inputs_collected, false);
assert.equal(pack.operator_input_collection_pack_checklist.operator_input_collection_pack_defined, true);
assert.equal(pack.operator_input_collection_pack_checklist.operator_input_collection_pack_ready, true);
assert.equal(pack.operator_input_collection_pack_checklist.operator_input_collection_pack_completed, false);
assert.equal(pack.operator_input_collection_pack_checklist.operator_input_collection_execution_ready, true);
assert.equal(pack.operator_input_collection_pack_checklist.all_execution_items_have_collection_items, true);
assert.equal(pack.operator_input_collection_pack_checklist.all_collection_items_pending, true);
assert.equal(pack.operator_input_collection_pack_checklist.all_collection_items_have_capture_contract, true);
assert.equal(pack.operator_input_collection_pack_checklist.operator_inputs_collected, false);
assert.equal(pack.operator_input_collection_pack_checklist.operator_inputs_submitted, false);
assert.equal(pack.operator_input_collection_pack_checklist.operator_inputs_verified, false);
assert.equal(pack.operator_input_collection_pack_checklist.public_surface_observed, false);
assert.equal(pack.operator_input_collection_pack_checklist.public_observation_ready, false);
assert.equal(pack.operator_input_collection_pack_checklist.ai_authority_absence_confirmed, true);

assert.equal(pack.operator_input_collection_pack_is_defined, true);
assert.equal(pack.operator_input_collection_pack_is_ready, true);
assert.equal(pack.operator_input_collection_pack_is_pending_inputs, true);
assert.equal(pack.operator_input_collection_pack_is_not_completed, true);
assert.equal(pack.operator_input_collection_pack_is_not_operator_inputs_collected, true);
assert.equal(pack.operator_input_collection_pack_is_not_operator_inputs_submitted, true);
assert.equal(pack.operator_input_collection_pack_is_not_operator_inputs_verified, true);
assert.equal(pack.operator_input_collection_pack_is_not_public_observation_ready, true);
assert.equal(pack.operator_input_collection_pack_is_not_external_customer_readiness, true);
assert.equal(pack.operator_input_collection_pack_is_not_banking_pack_readiness, true);
assert.equal(pack.operator_input_collection_pack_is_not_launch_readiness, true);
assert.equal(pack.operator_input_collection_pack_is_not_production_readiness, true);
assert.equal(pack.operator_input_collection_pack_does_not_authorize_ai_authority, true);

assert.equal(doc.readiness_state.public_surface_observation_operator_input_collection_pack_defined, true);
assert.equal(doc.readiness_state.public_surface_observation_operator_input_collection_pack_ready, true);
assert.equal(doc.readiness_state.public_surface_observation_operator_input_collection_pack_completed, false);
assert.equal(doc.readiness_state.operator_input_collection_pack_ready, true);
assert.equal(doc.readiness_state.operator_input_collection_execution_ready, true);
assert.equal(doc.readiness_state.operator_input_collection_attempted, false);
assert.equal(doc.readiness_state.operator_input_collection_completed, false);
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

assert.equal(doc.next_required_program, 'PROG-114-HBCE-LEVEL1-PUBLIC-SURFACE-OBSERVATION-OPERATOR-INPUT-COLLECTION-EXECUTION');

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

assert.match(md, /LEVEL1_PUBLIC_SURFACE_OBSERVATION_OPERATOR_INPUT_COLLECTION_PACK_DEFINED_PENDING_OPERATOR_INPUTS/);
assert.match(md, /The input capture contract is defined/);
assert.match(md, /Operator input collection execution is ready/);
assert.match(md, /Public URL is not collected/);
assert.match(md, /Observer reference is not collected/);
assert.match(md, /Observed content digest is not collected/);
assert.match(md, /Operator inputs are not verified/);
assert.match(md, /PROG-114-HBCE-LEVEL1-PUBLIC-SURFACE-OBSERVATION-OPERATOR-INPUT-COLLECTION-EXECUTION/);

console.log('PASS PROG-113-PUBLIC-SURFACE-OBSERVATION-OPERATOR-INPUT-COLLECTION-PACK-DOCS-EXIST');
console.log('PASS PROG-113-PUBLIC-SURFACE-OBSERVATION-OPERATOR-INPUT-COLLECTION-PACK-HASH-STABLE');
console.log('PASS PROG-113-BUILDER-STABLE');
console.log('PASS PROG-113-SOURCE-PROG-112-INTEGRITY-VALID');
console.log('PASS PROG-113-COLLECTION-ITEMS-DEFINED');
console.log('PASS PROG-113-INPUT-CAPTURE-CONTRACT-DEFINED');
console.log('PASS PROG-113-OPERATOR-INPUT-COLLECTION-EXECUTION-READY');
console.log('PASS PROG-113-OPERATOR-INPUTS-NOT-COLLECTED');
console.log('PASS PROG-113-OPERATOR-INPUTS-NOT-SUBMITTED');
console.log('PASS PROG-113-OPERATOR-INPUTS-NOT-VERIFIED');
console.log('PASS PROG-113-SUBMISSION-VERIFICATION-RERUN-NOT-READY');
console.log('PASS PROG-113-RETRY-GATE-RERUN-NOT-READY');
console.log('PASS PROG-113-AI-OPERATOR-INPUT-COLLECTION-PACK-AUTHORITY-DISALLOWED');
console.log('PASS PROG-113-NEXT-PROG-114-RECORDED');
console.log('PASS PROG-113-NO-UNSUPPORTED-READINESS-CLAIMS');
