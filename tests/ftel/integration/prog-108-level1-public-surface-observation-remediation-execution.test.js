'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { sha256Digest } = require('../../../packages/hbce-core/canonical-json.js');
const {
  STATUS,
  SOURCE_REF,
  buildObservationRemediationExecutionPayload,
  buildLevel1PublicSurfaceObservationRemediationExecution
} = require('../../../runtime/level1/build-prog-108-level1-public-surface-observation-remediation-execution.js');

const root = path.resolve(__dirname, '../../..');
const read = (p) => fs.readFileSync(path.join(root, p), 'utf8');
const json = (p) => JSON.parse(read(p));
const exists = (p) => fs.existsSync(path.join(root, p));

const docPath = 'docs/launch/level1/prog-108-level1-public-surface-observation-remediation-execution.json';
const mdPath = 'docs/launch/level1/prog-108-level1-public-surface-observation-remediation-execution.md';
const runtimePath = 'runtime/level1/build-prog-108-level1-public-surface-observation-remediation-execution.js';

for (const p of [docPath, mdPath, runtimePath, SOURCE_REF]) assert.equal(exists(p), true, `${p} must exist`);

const doc = json(docPath);
const md = read(mdPath);
const source = json(SOURCE_REF);

assert.equal(doc.proto, 'HBCE-L1-PROG-108-PUBLIC-SURFACE-OBSERVATION-REMEDIATION-EXECUTION-v1');
assert.equal(doc.kind, 'HBCE_LEVEL1_PUBLIC_SURFACE_OBSERVATION_REMEDIATION_EXECUTION');
assert.equal(doc.issue_id, 'PROG-108');
assert.equal(doc.level1_public_surface_observation_remediation_execution_status, STATUS);
assert.equal(doc.source_public_surface_observation_remediation_pack_revision_hash, source.revision_hash);
assert.equal(doc.source_public_surface_observation_remediation_pack_revision_hash_valid, true);

const regenerated = buildLevel1PublicSurfaceObservationRemediationExecution({ rootDir: root, repositoryCommit: doc.repository_baseline_commit });
assert.deepEqual(regenerated, doc);

const body = { ...doc };
delete body.revision_hash;
assert.equal(doc.revision_hash, sha256Digest(body));

const expectedPayload = buildObservationRemediationExecutionPayload(source);
const execution = doc.public_surface_observation_remediation_execution;
assert.equal(execution.public_surface_observation_remediation_execution_payload_digest, sha256Digest(expectedPayload));

assert.equal(execution.remediation_execution_status, 'BLOCKED_MISSING_OPERATOR_INPUTS');
assert.equal(execution.remediation_execution_result, 'REMEDIATION_EXECUTION_NOT_COMPLETED');
assert.equal(execution.imported_remediation_pack_status, 'DEFINED_PENDING_REMEDIATION');
assert.equal(execution.imported_remediation_actions_defined, true);
assert.equal(execution.imported_remediation_actions_completed, false);
assert.equal(execution.imported_input_collection_remediation_ready, true);
assert.equal(execution.imported_input_verification_remediation_ready, false);
assert.equal(execution.imported_retry_gate_rerun_ready, false);

assert.equal(execution.execution_item_count, 4);
assert.equal(execution.execution_items.length, 4);
assert.equal(execution.all_remediation_items_have_execution_items, true);
assert.equal(execution.all_execution_items_blocked_missing_operator_inputs, true);
assert.equal(execution.all_execution_items_without_public_url, true);
assert.equal(execution.all_execution_items_without_observer_ref, true);
assert.equal(execution.all_execution_items_without_observed_content_digest, true);
assert.equal(execution.all_execution_items_not_attempted, true);
assert.equal(execution.all_execution_items_not_completed, true);
assert.equal(execution.all_execution_items_not_ready_for_input_verification, true);
assert.equal(execution.all_execution_items_not_ready_for_retry_gate_rerun, true);

for (const item of execution.execution_items) {
  assert.match(item.execution_item_id, /^PUBLIC-SURFACE-OBSERVATION-REMEDIATION-EXECUTION::HBCE-L1::/);
  assert.match(item.remediation_item_id, /^PUBLIC-SURFACE-OBSERVATION-REMEDIATION::HBCE-L1::/);
  assert.equal(item.execution_status, 'BLOCKED_MISSING_OPERATOR_INPUTS');
  assert.equal(item.public_url, null);
  assert.equal(item.observer_ref, null);
  assert.equal(item.observed_content_digest, null);
  assert.equal(item.operator_inputs_present, false);
  assert.equal(item.public_url_submitted, false);
  assert.equal(item.observer_ref_submitted, false);
  assert.equal(item.observed_content_digest_submitted, false);
  assert.equal(item.remediation_action_execution_attempted, false);
  assert.equal(item.remediation_action_execution_completed, false);
  assert.equal(item.input_collection_executed, false);
  assert.equal(item.input_verification_executed, false);
  assert.equal(item.input_verification_passed, false);
  assert.equal(item.retry_gate_rerun_executed, false);
  assert.equal(item.retry_gate_rerun_passed, false);
  assert.equal(item.remediation_execution_complete, false);
  assert.equal(item.ready_for_input_verification, false);
  assert.equal(item.ready_for_retry_gate_rerun, false);
}

assert.equal(execution.remediation_execution_evaluated, true);
assert.equal(execution.remediation_execution_attempted, false);
assert.equal(execution.remediation_execution_completed, false);
assert.equal(execution.remediation_actions_completed, false);
assert.equal(execution.operator_inputs_collected, false);
assert.equal(execution.input_collection_remediation_executed, false);
assert.equal(execution.input_verification_remediation_ready, false);
assert.equal(execution.input_verification_executed, false);
assert.equal(execution.input_verification_passed, false);
assert.equal(execution.retry_gate_rerun_ready, false);
assert.equal(execution.retry_gate_rerun_executed, false);
assert.equal(execution.retry_gate_rerun_passed, false);
assert.equal(execution.public_surface_observation_remediation_completed, false);
assert.equal(execution.public_surface_observed, false);
assert.equal(execution.public_surface_observation_ready, false);
assert.equal(execution.external_customer_ready, false);
assert.equal(execution.banking_pack_ready, false);
assert.equal(execution.level1_launch_ready, false);
assert.equal(execution.production_ready, false);
assert.equal(execution.ai_remediation_execution_authority_allowed, false);

for (const control of [
  'require_operator_supplied_public_url_before_execution',
  'require_operator_supplied_observer_ref_before_execution',
  'require_operator_supplied_observed_content_digest_before_execution',
  'do_not_execute_remediation_without_operator_inputs',
  'do_not_mark_remediation_actions_completed_without_execution',
  'do_not_mark_input_verification_ready_without_collection_execution',
  'do_not_rerun_retry_gate_without_input_verification_pass',
  'do_not_infer_public_observation_from_remediation_execution_record',
  'do_not_claim_external_customer_delivery_readiness',
  'do_not_claim_banking_pack_readiness',
  'do_not_claim_level1_launch_readiness',
  'do_not_claim_production_readiness',
  'do_not_claim_legal_validity',
  'do_not_claim_security_certification',
  'do_not_authorize_ai_authority',
  'fail_closed_on_missing_operator_inputs'
]) assert.equal(execution.remediation_execution_controls.includes(control), true, `${control} must be present`);

assert.equal(execution.remediation_execution_boundary.remediation_execution_blocked, true);
assert.equal(execution.remediation_execution_boundary.no_operator_inputs_recorded, true);
assert.equal(execution.remediation_execution_boundary.no_remediation_execution_recorded, true);
assert.equal(execution.remediation_execution_boundary.no_public_observation_recorded, true);
assert.equal(execution.remediation_execution_boundary.no_observation_retry_performed, true);
assert.equal(execution.remediation_execution_boundary.no_customer_data, true);
assert.equal(execution.remediation_execution_boundary.no_live_system_control, true);
assert.equal(execution.remediation_execution_boundary.no_ai_authority_claim, true);

assert.equal(doc.readiness_state.public_surface_observation_remediation_execution_defined, true);
assert.equal(doc.readiness_state.public_surface_observation_remediation_execution_ready, true);
assert.equal(doc.readiness_state.public_surface_observation_remediation_execution_evaluated, true);
assert.equal(doc.readiness_state.public_surface_observation_remediation_execution_attempted, false);
assert.equal(doc.readiness_state.public_surface_observation_remediation_execution_completed, false);
assert.equal(doc.readiness_state.remediation_execution_blocked_missing_operator_inputs, true);
assert.equal(doc.readiness_state.operator_inputs_collected, false);
assert.equal(doc.readiness_state.input_verification_remediation_ready, false);
assert.equal(doc.readiness_state.retry_gate_rerun_ready, false);
assert.equal(doc.readiness_state.public_surface_observed, false);
assert.equal(doc.readiness_state.public_surface_observation_ready, false);
assert.equal(doc.readiness_state.external_customer_ready, false);
assert.equal(doc.readiness_state.banking_pack_ready, false);
assert.equal(doc.readiness_state.level1_launch_ready, false);
assert.equal(doc.readiness_state.production_ready, false);

assert.equal(doc.next_required_program, 'PROG-109-HBCE-LEVEL1-PUBLIC-SURFACE-OBSERVATION-OPERATOR-INPUT-SUBMISSION');

assert.equal(doc.non_claims.legal_validity, false);
assert.equal(doc.non_claims.public_accreditation, false);
assert.equal(doc.non_claims.procurement_eligibility, false);
assert.equal(doc.non_claims.external_effect_proven, false);
assert.equal(doc.non_claims.business_success, false);
assert.equal(doc.non_claims.ai_authority, false);
assert.equal(doc.non_claims.public_surface_observed, false);
assert.equal(doc.non_claims.public_surface_observation_ready, false);
assert.equal(doc.non_claims.external_customer_ready, false);
assert.equal(doc.non_claims.banking_pack_ready, false);
assert.equal(doc.non_claims.level1_launch_ready, false);
assert.equal(doc.non_claims.production_ready, false);

assert.match(md, /LEVEL1_PUBLIC_SURFACE_OBSERVATION_REMEDIATION_EXECUTION_BLOCKED_MISSING_OPERATOR_INPUTS/);
assert.match(md, /No public URL is submitted/);
assert.match(md, /No observer reference is submitted/);
assert.match(md, /No observed content digest is submitted/);
assert.match(md, /Remediation execution is not completed/);
assert.match(md, /PROG-109-HBCE-LEVEL1-PUBLIC-SURFACE-OBSERVATION-OPERATOR-INPUT-SUBMISSION/);

console.log('PASS PROG-108-PUBLIC-SURFACE-OBSERVATION-REMEDIATION-EXECUTION-DOCS-EXIST');
console.log('PASS PROG-108-PUBLIC-SURFACE-OBSERVATION-REMEDIATION-EXECUTION-HASH-STABLE');
console.log('PASS PROG-108-BUILDER-STABLE');
console.log('PASS PROG-108-SOURCE-PROG-107-INTEGRITY-VALID');
console.log('PASS PROG-108-EXECUTION-ITEMS-DEFINED');
console.log('PASS PROG-108-EXECUTION-BLOCKED-MISSING-OPERATOR-INPUTS');
console.log('PASS PROG-108-REMEDIATION-EXECUTION-NOT-ATTEMPTED');
console.log('PASS PROG-108-REMEDIATION-EXECUTION-NOT-COMPLETED');
console.log('PASS PROG-108-INPUT-VERIFICATION-NOT-READY');
console.log('PASS PROG-108-RETRY-GATE-RERUN-NOT-READY');
console.log('PASS PROG-108-AI-REMEDIATION-EXECUTION-AUTHORITY-DISALLOWED');
console.log('PASS PROG-108-NEXT-PROG-109-RECORDED');
console.log('PASS PROG-108-NO-UNSUPPORTED-READINESS-CLAIMS');
