'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { sha256Digest } = require('../../../packages/hbce-core/canonical-json.js');
const {
  STATUS,
  SOURCE_REF,
  buildObservationRetryGatePayload,
  buildLevel1PublicSurfaceObservationRetryGate
} = require('../../../runtime/level1/build-prog-106-level1-public-surface-observation-retry-gate.js');

const root = path.resolve(__dirname, '../../..');
const read = (p) => fs.readFileSync(path.join(root, p), 'utf8');
const json = (p) => JSON.parse(read(p));
const exists = (p) => fs.existsSync(path.join(root, p));

const docPath = 'docs/launch/level1/prog-106-level1-public-surface-observation-retry-gate.json';
const mdPath = 'docs/launch/level1/prog-106-level1-public-surface-observation-retry-gate.md';
const runtimePath = 'runtime/level1/build-prog-106-level1-public-surface-observation-retry-gate.js';

for (const p of [docPath, mdPath, runtimePath, SOURCE_REF]) assert.equal(exists(p), true, `${p} must exist`);

const doc = json(docPath);
const md = read(mdPath);
const source = json(SOURCE_REF);

assert.equal(doc.proto, 'HBCE-L1-PROG-106-PUBLIC-SURFACE-OBSERVATION-RETRY-GATE-v1');
assert.equal(doc.kind, 'HBCE_LEVEL1_PUBLIC_SURFACE_OBSERVATION_RETRY_GATE');
assert.equal(doc.issue_id, 'PROG-106');
assert.equal(doc.level1_public_surface_observation_retry_gate_status, STATUS);
assert.equal(doc.source_public_surface_observation_input_verification_revision_hash, source.revision_hash);
assert.equal(doc.source_public_surface_observation_input_verification_revision_hash_valid, true);

const regenerated = buildLevel1PublicSurfaceObservationRetryGate({ rootDir: root, repositoryCommit: doc.repository_baseline_commit });
assert.deepEqual(regenerated, doc);

const body = { ...doc };
delete body.revision_hash;
assert.equal(doc.revision_hash, sha256Digest(body));

assert.equal(doc.inherited_public_surface_observation_input_verification.input_verification_status, 'LEVEL1_PUBLIC_SURFACE_OBSERVATION_INPUT_VERIFICATION_DEFINED_NOT_VERIFIED');
assert.equal(doc.inherited_public_surface_observation_input_verification.public_surface_observation_input_verification_artifact_ready, true);
assert.equal(doc.inherited_public_surface_observation_input_verification.public_surface_observation_inputs_collected, false);
assert.equal(doc.inherited_public_surface_observation_input_verification.public_surface_observation_inputs_verified, false);
assert.equal(doc.inherited_public_surface_observation_input_verification.public_surface_observation_input_verification_performed, false);
assert.equal(doc.inherited_public_surface_observation_input_verification.public_surface_observation_input_verification_passed, false);
assert.equal(doc.inherited_public_surface_observation_input_verification.public_surface_observation_gate_retry_ready, false);

const expectedPayload = buildObservationRetryGatePayload(source);
const gate = doc.public_surface_observation_retry_gate;

assert.equal(gate.public_surface_observation_retry_gate_payload_digest, sha256Digest(expectedPayload));
assert.equal(gate.public_surface_observation_retry_gate_id, 'PUBLIC-SURFACE-OBSERVATION-RETRY-GATE::HBCE-L1-DECISION-PROOF-0001');
assert.equal(gate.retry_gate_key, 'hbce.level1.public_surface.observation_retry_gate.controlled_information.0001');
assert.equal(gate.source_public_surface_observation_input_verification_ref, SOURCE_REF);
assert.equal(gate.source_public_surface_observation_input_verification_digest, source.public_surface_observation_input_verification.public_surface_observation_input_verification_payload_digest);
assert.equal(gate.retry_gate_scope, 'LEVEL1_DECISION_PROOF_PUBLIC_SURFACE_CONTROLLED_INFORMATION_ONLY');
assert.equal(gate.retry_gate_status, 'BLOCKED_UNVERIFIED_OBSERVATION_INPUTS');
assert.equal(gate.retry_gate_result, 'OBSERVATION_RETRY_NOT_READY');
assert.equal(gate.retry_gate_mode, 'PUBLIC_INFORMATION_SURFACE_OBSERVATION_RETRY_GATE');
assert.equal(gate.publication_authorization_scope, 'controlled_public_information_surface_only');

assert.equal(gate.retry_target_count, 4);
assert.equal(gate.retry_targets.length, 4);
for (const target of gate.retry_targets) {
  assert.match(target.retry_target_id, /^PUBLIC-SURFACE-OBSERVATION-RETRY::HBCE-L1::/);
  assert.match(target.verification_item_id, /^PUBLIC-SURFACE-OBSERVATION-VERIFICATION::HBCE-L1::/);
  assert.equal(target.retry_status, 'BLOCKED_INPUT_VERIFICATION_NOT_PASSED');
  assert.equal(target.input_values_available, false);
  assert.equal(target.verification_complete, false);
  assert.equal(target.verification_passed, false);
  assert.equal(target.public_url_present, false);
  assert.equal(target.observer_ref_present, false);
  assert.equal(target.observed_content_digest_present, false);
  assert.equal(target.ready_for_observation_retry, false);
  assert.equal(target.retry_allowed, false);
  assert.equal(target.retry_performed, false);
}

assert.equal(gate.gate_criteria.source_public_surface_observation_input_verification_hash_valid, true);
assert.equal(gate.gate_criteria.source_public_surface_observation_input_verification_artifact_ready, true);
assert.equal(gate.gate_criteria.source_public_surface_ready, true);
assert.equal(gate.gate_criteria.source_publication_authorized, true);
assert.equal(gate.gate_criteria.source_publication_authorization_scope_limited, true);
assert.equal(gate.gate_criteria.observation_inputs_collected, false);
assert.equal(gate.gate_criteria.observation_inputs_verified, false);
assert.equal(gate.gate_criteria.input_verification_performed, false);
assert.equal(gate.gate_criteria.input_verification_passed, false);
assert.equal(gate.gate_criteria.prior_observation_gate_retry_ready, false);
assert.equal(gate.gate_criteria.all_verification_items_available, true);
assert.equal(gate.gate_criteria.all_retry_targets_defined, true);
assert.equal(gate.gate_criteria.all_retry_targets_blocked_unverified, true);
assert.equal(gate.gate_criteria.all_retry_targets_not_allowed, true);
assert.equal(gate.gate_criteria.all_retry_targets_not_performed, true);
assert.equal(gate.gate_criteria.all_retry_targets_not_ready, true);
assert.equal(gate.gate_criteria.ai_authority_excluded, true);

for (const key of [
  'observation_inputs_collected',
  'observation_inputs_verified',
  'input_verification_performed',
  'input_verification_passed',
  'prior_observation_gate_retry_ready'
]) assert.equal(gate.blocking_criteria.includes(key), true, `${key} must block`);

assert.equal(gate.all_gate_criteria_passed, false);
assert.equal(gate.public_surface_observation_retry_gate_evaluated, true);
assert.equal(gate.public_surface_observation_retry_gate_passed, false);
assert.equal(gate.observation_retry_allowed, false);
assert.equal(gate.observation_retry_performed, false);
assert.equal(gate.observation_retry_ready, false);
assert.equal(gate.public_surface_observed, false);
assert.equal(gate.public_surface_observation_ready, false);
assert.equal(gate.public_surface_ready, true);
assert.equal(gate.publication_authorized, true);
assert.equal(gate.publication_authorization_scope_limited, true);
assert.equal(gate.external_customer_ready, false);
assert.equal(gate.banking_pack_ready, false);
assert.equal(gate.level1_launch_ready, false);
assert.equal(gate.production_ready, false);

assert.equal(gate.approved_claims_after_retry_gate.public_surface_ready_controlled_information_only, true);
assert.equal(gate.approved_claims_after_retry_gate.publication_authorized_for_controlled_public_information_surface, true);
assert.equal(gate.approved_claims_after_retry_gate.input_verification_artifact_defined, true);
assert.equal(gate.approved_claims_after_retry_gate.public_surface_observation_retry_gate_evaluated, true);
assert.equal(gate.approved_claims_after_retry_gate.public_surface_observation_retry_gate_passed, false);
assert.equal(gate.approved_claims_after_retry_gate.observation_retry_allowed, false);
assert.equal(gate.approved_claims_after_retry_gate.observation_retry_performed, false);
assert.equal(gate.approved_claims_after_retry_gate.public_surface_observed, false);
assert.equal(gate.approved_claims_after_retry_gate.public_surface_observation_ready, false);

assert.equal(gate.blocked_claims_after_retry_gate.public_surface_observation_retry_gate_passed, true);
assert.equal(gate.blocked_claims_after_retry_gate.observation_retry_allowed, true);
assert.equal(gate.blocked_claims_after_retry_gate.observation_retry_performed, true);
assert.equal(gate.blocked_claims_after_retry_gate.public_surface_observed, true);
assert.equal(gate.blocked_claims_after_retry_gate.public_surface_observation_ready, true);
assert.equal(gate.blocked_claims_after_retry_gate.external_customer_delivery_ready, true);
assert.equal(gate.blocked_claims_after_retry_gate.banking_pack_ready, true);
assert.equal(gate.blocked_claims_after_retry_gate.level1_launch_ready, true);
assert.equal(gate.blocked_claims_after_retry_gate.production_ready, true);
assert.equal(gate.blocked_claims_after_retry_gate.ai_authority, true);

for (const control of [
  'require_verified_inputs_before_retry',
  'require_input_verification_passed_before_retry',
  'require_public_url_present_before_retry',
  'require_observer_ref_present_before_retry',
  'require_observed_content_digest_present_before_retry',
  'require_scope_match_result_before_retry',
  'require_non_claims_result_before_retry',
  'require_evidence_reference_result_before_retry',
  'do_not_retry_observation_with_unverified_inputs',
  'do_not_infer_observation_from_retry_gate_definition',
  'do_not_claim_external_customer_delivery_readiness',
  'do_not_claim_banking_pack_readiness',
  'do_not_claim_level1_launch_readiness',
  'do_not_claim_production_readiness',
  'do_not_claim_legal_validity',
  'do_not_claim_security_certification',
  'do_not_authorize_ai_authority',
  'fail_closed_on_unverified_inputs'
]) assert.equal(gate.retry_gate_controls.includes(control), true, `${control} must be present`);

assert.equal(gate.retry_gate_boundary.controlled_information_surface_only, true);
assert.equal(gate.retry_gate_boundary.retry_gate_evaluation_only, true);
assert.equal(gate.retry_gate_boundary.retry_gate_blocked, true);
assert.equal(gate.retry_gate_boundary.no_public_observation_recorded, true);
assert.equal(gate.retry_gate_boundary.no_observation_retry_performed, true);
assert.equal(gate.retry_gate_boundary.source_input_verification_required, true);
assert.equal(gate.retry_gate_boundary.no_customer_data, true);
assert.equal(gate.retry_gate_boundary.no_live_system_control, true);
assert.equal(gate.retry_gate_boundary.no_production_integration, true);
assert.equal(gate.retry_gate_boundary.no_legal_validity_claim, true);
assert.equal(gate.retry_gate_boundary.no_security_certification_claim, true);
assert.equal(gate.retry_gate_boundary.no_ai_authority_claim, true);

assert.equal(gate.observation_retry_gate_checklist.source_public_surface_observation_input_verification_hash_valid, true);
assert.equal(gate.observation_retry_gate_checklist.source_public_surface_observation_input_verification_artifact_ready, true);
assert.equal(gate.observation_retry_gate_checklist.retry_gate_evaluated, true);
assert.equal(gate.observation_retry_gate_checklist.retry_gate_passed, false);
assert.equal(gate.observation_retry_gate_checklist.retry_gate_blocked_unverified_inputs, true);
assert.equal(gate.observation_retry_gate_checklist.blocking_criteria_present, true);
assert.equal(gate.observation_retry_gate_checklist.observation_inputs_collected, false);
assert.equal(gate.observation_retry_gate_checklist.observation_inputs_verified, false);
assert.equal(gate.observation_retry_gate_checklist.input_verification_performed, false);
assert.equal(gate.observation_retry_gate_checklist.input_verification_passed, false);
assert.equal(gate.observation_retry_gate_checklist.observation_retry_allowed, false);
assert.equal(gate.observation_retry_gate_checklist.observation_retry_performed, false);
assert.equal(gate.observation_retry_gate_checklist.observation_retry_ready, false);
assert.equal(gate.observation_retry_gate_checklist.public_surface_observed, false);
assert.equal(gate.observation_retry_gate_checklist.public_observation_ready, false);
assert.equal(gate.observation_retry_gate_checklist.external_customer_readiness_excluded, true);
assert.equal(gate.observation_retry_gate_checklist.banking_pack_readiness_excluded, true);
assert.equal(gate.observation_retry_gate_checklist.launch_readiness_excluded, true);
assert.equal(gate.observation_retry_gate_checklist.production_readiness_excluded, true);
assert.equal(gate.observation_retry_gate_checklist.ai_authority_absence_confirmed, true);

assert.equal(gate.public_surface_observation_retry_gate_is_defined, true);
assert.equal(gate.public_surface_observation_retry_gate_is_evaluated, true);
assert.equal(gate.public_surface_observation_retry_gate_is_blocked_unverified_inputs, true);
assert.equal(gate.public_surface_observation_retry_gate_is_not_observation_evidence, true);
assert.equal(gate.public_surface_observation_retry_gate_is_not_public_observation_ready, true);
assert.equal(gate.public_surface_observation_retry_gate_is_not_external_customer_readiness, true);
assert.equal(gate.public_surface_observation_retry_gate_is_not_banking_pack_readiness, true);
assert.equal(gate.public_surface_observation_retry_gate_is_not_launch_readiness, true);
assert.equal(gate.public_surface_observation_retry_gate_is_not_production_readiness, true);
assert.equal(gate.public_surface_observation_retry_gate_is_not_legal_validity, true);
assert.equal(gate.public_surface_observation_retry_gate_is_not_security_certification, true);
assert.equal(gate.public_surface_observation_retry_gate_does_not_authorize_ai_authority, true);

for (const code of [
  'PUBLIC_SURFACE_OBSERVATION_RETRY_GATE_MISSING',
  'SOURCE_PUBLIC_SURFACE_OBSERVATION_INPUT_VERIFICATION_HASH_INVALID',
  'PUBLIC_SURFACE_OBSERVATION_INPUT_VERIFICATION_ARTIFACT_NOT_READY',
  'OBSERVATION_INPUTS_NOT_COLLECTED',
  'OBSERVATION_INPUTS_NOT_VERIFIED',
  'INPUT_VERIFICATION_NOT_PERFORMED',
  'INPUT_VERIFICATION_NOT_PASSED',
  'OBSERVATION_RETRY_NOT_ALLOWED',
  'OBSERVATION_RETRY_NOT_READY',
  'UNSUPPORTED_PUBLIC_OBSERVATION_READY_CLAIM',
  'UNSUPPORTED_EXTERNAL_CUSTOMER_READINESS_CLAIM',
  'UNSUPPORTED_BANKING_READINESS_CLAIM',
  'UNSUPPORTED_LAUNCH_READINESS_CLAIM',
  'UNSUPPORTED_PRODUCTION_READINESS_CLAIM',
  'AI_RETRY_GATE_AUTHORITY_CLAIM_BLOCKED'
]) assert.equal(doc.fail_closed_codes.includes(code), true, `${code} must be present`);

assert.equal(doc.readiness_state.public_surface_observation_retry_gate_defined, true);
assert.equal(doc.readiness_state.public_surface_observation_retry_gate_evaluated, true);
assert.equal(doc.readiness_state.public_surface_observation_retry_gate_passed, false);
assert.equal(doc.readiness_state.source_public_surface_observation_input_verification_bound, true);
assert.equal(doc.readiness_state.public_surface_observation_input_verification_artifact_ready, true);
assert.equal(doc.readiness_state.public_surface_ready, true);
assert.equal(doc.readiness_state.publication_authorized, true);
assert.equal(doc.readiness_state.publication_authorization_scope, 'controlled_public_information_surface_only');
assert.equal(doc.readiness_state.publication_authorization_scope_limited, true);
assert.equal(doc.readiness_state.retry_gate_blocked_unverified_inputs, true);
assert.equal(doc.readiness_state.blocking_criteria_present, true);
assert.equal(doc.readiness_state.observation_inputs_collected, false);
assert.equal(doc.readiness_state.observation_inputs_verified, false);
assert.equal(doc.readiness_state.input_verification_performed, false);
assert.equal(doc.readiness_state.input_verification_passed, false);
assert.equal(doc.readiness_state.observation_retry_allowed, false);
assert.equal(doc.readiness_state.observation_retry_performed, false);
assert.equal(doc.readiness_state.observation_retry_ready, false);
assert.equal(doc.readiness_state.public_surface_observed, false);
assert.equal(doc.readiness_state.public_surface_observation_ready, false);
assert.equal(doc.readiness_state.external_customer_ready, false);
assert.equal(doc.readiness_state.banking_pack_ready, false);
assert.equal(doc.readiness_state.level1_launch_ready, false);
assert.equal(doc.readiness_state.production_ready, false);

assert.equal(doc.next_required_program, 'PROG-107-HBCE-LEVEL1-PUBLIC-SURFACE-OBSERVATION-REMEDIATION-PACK');

assert.equal(doc.non_claims.legal_validity, false);
assert.equal(doc.non_claims.public_accreditation, false);
assert.equal(doc.non_claims.procurement_eligibility, false);
assert.equal(doc.non_claims.external_effect_proven, false);
assert.equal(doc.non_claims.business_success, false);
assert.equal(doc.non_claims.ai_authority, false);
assert.equal(doc.non_claims.autonomous_authority, false);
assert.equal(doc.non_claims.public_surface_observed, false);
assert.equal(doc.non_claims.public_surface_observation_ready, false);
assert.equal(doc.non_claims.external_customer_ready, false);
assert.equal(doc.non_claims.banking_pack_ready, false);
assert.equal(doc.non_claims.level1_launch_ready, false);
assert.equal(doc.non_claims.production_ready, false);

assert.match(md, /LEVEL1_PUBLIC_SURFACE_OBSERVATION_RETRY_GATE_BLOCKED_UNVERIFIED_INPUTS/);
assert.match(md, /The retry gate is blocked because observation inputs are not collected and not verified/);
assert.match(md, /Input verification is not performed/);
assert.match(md, /Input verification is not passed/);
assert.match(md, /Observation retry is not allowed/);
assert.match(md, /The public surface observation is not ready/);
assert.match(md, /PROG-107-HBCE-LEVEL1-PUBLIC-SURFACE-OBSERVATION-REMEDIATION-PACK/);

console.log('PASS PROG-106-PUBLIC-SURFACE-OBSERVATION-RETRY-GATE-DOCS-EXIST');
console.log('PASS PROG-106-PUBLIC-SURFACE-OBSERVATION-RETRY-GATE-HASH-STABLE');
console.log('PASS PROG-106-BUILDER-STABLE');
console.log('PASS PROG-106-SOURCE-PROG-105-INTEGRITY-VALID');
console.log('PASS PROG-106-RETRY-TARGETS-DEFINED');
console.log('PASS PROG-106-RETRY-GATE-EVALUATED');
console.log('PASS PROG-106-RETRY-GATE-BLOCKED-UNVERIFIED-INPUTS');
console.log('PASS PROG-106-OBSERVATION-RETRY-NOT-ALLOWED');
console.log('PASS PROG-106-OBSERVATION-RETRY-NOT-PERFORMED');
console.log('PASS PROG-106-PUBLIC-OBSERVATION-NOT-READY');
console.log('PASS PROG-106-AI-RETRY-GATE-AUTHORITY-DISALLOWED');
console.log('PASS PROG-106-NEXT-PROG-107-RECORDED');
console.log('PASS PROG-106-NO-UNSUPPORTED-READINESS-CLAIMS');
