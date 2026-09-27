'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { sha256Digest } = require('../../../packages/hbce-core/canonical-json.js');
const {
  STATUS,
  SOURCE_REF,
  buildObservationInputVerificationPayload,
  buildLevel1PublicSurfaceObservationInputVerification
} = require('../../../runtime/level1/build-prog-105-level1-public-surface-observation-input-verification.js');

const root = path.resolve(__dirname, '../../..');
const read = (p) => fs.readFileSync(path.join(root, p), 'utf8');
const json = (p) => JSON.parse(read(p));
const exists = (p) => fs.existsSync(path.join(root, p));

const docPath = 'docs/launch/level1/prog-105-level1-public-surface-observation-input-verification.json';
const mdPath = 'docs/launch/level1/prog-105-level1-public-surface-observation-input-verification.md';
const runtimePath = 'runtime/level1/build-prog-105-level1-public-surface-observation-input-verification.js';

for (const p of [docPath, mdPath, runtimePath, SOURCE_REF]) assert.equal(exists(p), true, `${p} must exist`);

const doc = json(docPath);
const md = read(mdPath);
const source = json(SOURCE_REF);

assert.equal(doc.proto, 'HBCE-L1-PROG-105-PUBLIC-SURFACE-OBSERVATION-INPUT-VERIFICATION-v1');
assert.equal(doc.kind, 'HBCE_LEVEL1_PUBLIC_SURFACE_OBSERVATION_INPUT_VERIFICATION');
assert.equal(doc.issue_id, 'PROG-105');
assert.equal(doc.level1_public_surface_observation_input_verification_status, STATUS);
assert.equal(doc.source_public_surface_observation_input_collection_revision_hash, source.revision_hash);
assert.equal(doc.source_public_surface_observation_input_collection_revision_hash_valid, true);

const regenerated = buildLevel1PublicSurfaceObservationInputVerification({ rootDir: root, repositoryCommit: doc.repository_baseline_commit });
assert.deepEqual(regenerated, doc);

const body = { ...doc };
delete body.revision_hash;
assert.equal(doc.revision_hash, sha256Digest(body));

assert.equal(doc.inherited_public_surface_observation_input_collection.input_collection_status, 'LEVEL1_PUBLIC_SURFACE_OBSERVATION_INPUT_COLLECTION_DEFINED_NOT_COLLECTED');
assert.equal(doc.inherited_public_surface_observation_input_collection.public_surface_observation_input_collection_ready, true);
assert.equal(doc.inherited_public_surface_observation_input_collection.public_surface_observation_inputs_collected, false);
assert.equal(doc.inherited_public_surface_observation_input_collection.public_surface_observation_inputs_verified, false);
assert.equal(doc.inherited_public_surface_observation_input_collection.public_surface_observation_input_verification_ready, false);
assert.equal(doc.inherited_public_surface_observation_input_collection.public_surface_observation_gate_retry_ready, false);
assert.equal(doc.inherited_public_surface_observation_input_collection.public_surface_ready, true);
assert.equal(doc.inherited_public_surface_observation_input_collection.publication_authorized, true);
assert.equal(doc.inherited_public_surface_observation_input_collection.publication_authorization_scope, 'controlled_public_information_surface_only');

const expectedPayload = buildObservationInputVerificationPayload(source);
const verification = doc.public_surface_observation_input_verification;

assert.equal(verification.public_surface_observation_input_verification_payload_digest, sha256Digest(expectedPayload));
assert.equal(verification.public_surface_observation_input_verification_id, 'PUBLIC-SURFACE-OBSERVATION-INPUT-VERIFICATION::HBCE-L1-DECISION-PROOF-0001');
assert.equal(verification.input_verification_key, 'hbce.level1.public_surface.observation_input_verification.controlled_information.0001');
assert.equal(verification.source_public_surface_observation_input_collection_ref, SOURCE_REF);
assert.equal(verification.source_public_surface_observation_input_collection_digest, source.public_surface_observation_input_collection.public_surface_observation_input_collection_payload_digest);
assert.equal(verification.input_verification_scope, 'LEVEL1_DECISION_PROOF_PUBLIC_SURFACE_CONTROLLED_INFORMATION_ONLY');
assert.equal(verification.input_verification_status, 'DEFINED_NOT_VERIFIED');
assert.equal(verification.input_verification_mode, 'PUBLIC_INFORMATION_SURFACE_OBSERVATION_INPUT_VERIFICATION');
assert.equal(verification.publication_authorization_scope, 'controlled_public_information_surface_only');

assert.deepEqual(verification.required_inputs, [
  'public_url',
  'observed_at',
  'observer_ref',
  'observation_method',
  'observed_content_digest',
  'observed_scope_match_result',
  'observed_non_claims_presence_result',
  'observed_evidence_reference_presence_result'
]);

assert.equal(verification.required_input_count, 8);
assert.equal(verification.verification_item_count, 4);
assert.equal(verification.verification_items.length, 4);
assert.equal(verification.all_collection_items_have_verification_items, true);
assert.equal(verification.all_verification_items_blocked_not_collected, true);
assert.equal(verification.all_verification_items_without_public_url, true);
assert.equal(verification.all_verification_items_without_observer_ref, true);
assert.equal(verification.all_verification_items_without_observed_content_digest, true);
assert.equal(verification.all_verification_items_without_scope_match_result, true);
assert.equal(verification.all_verification_items_without_non_claims_result, true);
assert.equal(verification.all_verification_items_without_evidence_reference_result, true);
assert.equal(verification.all_verification_items_incomplete, true);
assert.equal(verification.all_verification_items_not_passed, true);
assert.equal(verification.all_verification_items_not_ready_for_gate_retry, true);
assert.equal(verification.observation_inputs_collected, false);
assert.equal(verification.observation_inputs_verified, false);
assert.equal(verification.input_verification_performed, false);
assert.equal(verification.input_verification_passed, false);
assert.equal(verification.observation_gate_retry_ready, false);

for (const item of verification.verification_items) {
  assert.match(item.verification_item_id, /^PUBLIC-SURFACE-OBSERVATION-VERIFICATION::HBCE-L1::/);
  assert.match(item.collection_item_id, /^PUBLIC-SURFACE-OBSERVATION-COLLECTION::HBCE-L1::/);
  assert.match(item.input_target_id, /^PUBLIC-SURFACE-OBSERVATION-INPUT::HBCE-L1::/);
  assert.match(item.observation_target_id, /^PUBLIC-SURFACE-OBSERVATION-TARGET::HBCE-L1::/);
  assert.equal(item.verification_status, 'BLOCKED_NOT_COLLECTED');
  assert.equal(item.verification_required, true);
  assert.equal(item.required_checks.includes('collection_complete'), true);
  assert.equal(item.required_checks.includes('public_url_present'), true);
  assert.equal(item.required_checks.includes('observer_ref_present'), true);
  assert.equal(item.required_checks.includes('observed_content_digest_present'), true);
  assert.equal(item.required_checks.includes('observed_scope_match_result_present'), true);
  assert.equal(item.required_checks.includes('observed_non_claims_presence_result_present'), true);
  assert.equal(item.required_checks.includes('observed_evidence_reference_presence_result_present'), true);
  assert.equal(item.collection_complete, false);
  assert.equal(item.collection_verified, false);
  assert.equal(item.public_url_present, false);
  assert.equal(item.observer_ref_present, false);
  assert.equal(item.observed_content_digest_present, false);
  assert.equal(item.observed_scope_match_result_present, false);
  assert.equal(item.observed_non_claims_presence_result_present, false);
  assert.equal(item.observed_evidence_reference_presence_result_present, false);
  assert.equal(item.customer_data_absence_declared, false);
  assert.equal(item.forbidden_claims_absence_declared, false);
  assert.equal(item.input_values_available, false);
  assert.equal(item.verification_complete, false);
  assert.equal(item.verification_passed, false);
  assert.equal(item.ready_for_observation_gate_retry, false);
}

for (const control of [
  'define_verification_items_for_each_collection_item',
  'require_collection_complete_before_verification',
  'require_public_url_present_before_verification',
  'require_observer_ref_present_before_verification',
  'require_observed_content_digest_present_before_verification',
  'require_scope_match_result_present_before_verification',
  'require_non_claims_presence_result_present_before_verification',
  'require_evidence_reference_presence_result_present_before_verification',
  'require_customer_data_absence_declaration_before_verification',
  'require_forbidden_claims_absence_declaration_before_verification',
  'do_not_verify_missing_collection_values',
  'do_not_infer_public_observation_from_verification_definition',
  'do_not_claim_external_customer_delivery_readiness',
  'do_not_claim_banking_pack_readiness',
  'do_not_claim_level1_launch_readiness',
  'do_not_claim_production_readiness',
  'do_not_claim_legal_validity',
  'do_not_claim_security_certification',
  'do_not_authorize_ai_authority',
  'fail_closed_on_unverified_inputs'
]) {
  assert.equal(verification.input_verification_controls.includes(control), true, `${control} must be present`);
}

assert.equal(verification.input_verification_boundary.controlled_information_surface_only, true);
assert.equal(verification.input_verification_boundary.input_verification_definition_only, true);
assert.equal(verification.input_verification_boundary.no_public_observation_recorded, true);
assert.equal(verification.input_verification_boundary.no_observation_input_values_verified, true);
assert.equal(verification.input_verification_boundary.source_input_collection_required, true);
assert.equal(verification.input_verification_boundary.source_input_pack_required, true);
assert.equal(verification.input_verification_boundary.source_observation_gate_required, true);
assert.equal(verification.input_verification_boundary.no_customer_data, true);
assert.equal(verification.input_verification_boundary.no_live_system_control, true);
assert.equal(verification.input_verification_boundary.no_production_integration, true);
assert.equal(verification.input_verification_boundary.no_legal_validity_claim, true);
assert.equal(verification.input_verification_boundary.no_security_certification_claim, true);
assert.equal(verification.input_verification_boundary.no_ai_authority_claim, true);
assert.equal(verification.input_verification_boundary.no_customer_logo_without_authorization, true);

assert.equal(verification.source_public_surface_observation_input_collection_ready, true);
assert.equal(verification.source_observation_inputs_collected, false);
assert.equal(verification.source_observation_inputs_verified, false);
assert.equal(verification.source_input_verification_ready, false);
assert.equal(verification.source_observation_gate_retry_ready, false);
assert.equal(verification.source_public_surface_ready, true);
assert.equal(verification.source_publication_authorized, true);
assert.equal(verification.source_publication_authorization_scope_limited, true);
assert.equal(verification.public_surface_observation_input_verification_defined, true);
assert.equal(verification.public_surface_observation_input_verification_artifact_ready, true);
assert.equal(verification.public_surface_observation_inputs_collected, false);
assert.equal(verification.public_surface_observation_inputs_verified, false);
assert.equal(verification.public_surface_observation_input_verification_performed, false);
assert.equal(verification.public_surface_observation_input_verification_passed, false);
assert.equal(verification.public_surface_observation_gate_retry_ready, false);
assert.equal(verification.public_surface_observed, false);
assert.equal(verification.public_surface_observation_ready, false);
assert.equal(verification.public_surface_ready, true);
assert.equal(verification.publication_authorized, true);
assert.equal(verification.publication_authorization_scope_limited, true);
assert.equal(verification.external_customer_ready, false);
assert.equal(verification.banking_pack_ready, false);
assert.equal(verification.level1_launch_ready, false);
assert.equal(verification.production_ready, false);
assert.equal(verification.ai_input_verification_authority_allowed, false);

assert.equal(verification.observation_input_verification_checklist.source_public_surface_observation_input_collection_hash_valid, true);
assert.equal(verification.observation_input_verification_checklist.source_public_surface_observation_input_collection_ready, true);
assert.equal(verification.observation_input_verification_checklist.all_collection_items_have_verification_items, true);
assert.equal(verification.observation_input_verification_checklist.all_verification_items_blocked_not_collected, true);
assert.equal(verification.observation_input_verification_checklist.all_verification_items_without_public_url, true);
assert.equal(verification.observation_input_verification_checklist.all_verification_items_without_observer_ref, true);
assert.equal(verification.observation_input_verification_checklist.all_verification_items_without_observed_content_digest, true);
assert.equal(verification.observation_input_verification_checklist.all_verification_items_without_scope_match_result, true);
assert.equal(verification.observation_input_verification_checklist.all_verification_items_without_non_claims_result, true);
assert.equal(verification.observation_input_verification_checklist.all_verification_items_without_evidence_reference_result, true);
assert.equal(verification.observation_input_verification_checklist.all_verification_items_incomplete, true);
assert.equal(verification.observation_input_verification_checklist.all_verification_items_not_passed, true);
assert.equal(verification.observation_input_verification_checklist.all_verification_items_not_ready_for_gate_retry, true);
assert.equal(verification.observation_input_verification_checklist.observation_inputs_collected, false);
assert.equal(verification.observation_input_verification_checklist.observation_inputs_verified, false);
assert.equal(verification.observation_input_verification_checklist.input_verification_performed, false);
assert.equal(verification.observation_input_verification_checklist.input_verification_passed, false);
assert.equal(verification.observation_input_verification_checklist.observation_gate_retry_ready, false);
assert.equal(verification.observation_input_verification_checklist.public_surface_observed, false);
assert.equal(verification.observation_input_verification_checklist.public_observation_ready, false);
assert.equal(verification.observation_input_verification_checklist.external_customer_readiness_excluded, true);
assert.equal(verification.observation_input_verification_checklist.banking_pack_readiness_excluded, true);
assert.equal(verification.observation_input_verification_checklist.launch_readiness_excluded, true);
assert.equal(verification.observation_input_verification_checklist.production_readiness_excluded, true);
assert.equal(verification.observation_input_verification_checklist.ai_authority_absence_confirmed, true);

assert.equal(verification.public_surface_observation_input_verification_is_defined, true);
assert.equal(verification.public_surface_observation_input_verification_is_not_performed, true);
assert.equal(verification.public_surface_observation_input_verification_is_not_passed, true);
assert.equal(verification.public_surface_observation_input_verification_is_not_observation_evidence, true);
assert.equal(verification.public_surface_observation_input_verification_is_not_public_observation_ready, true);
assert.equal(verification.public_surface_observation_input_verification_is_not_external_customer_readiness, true);
assert.equal(verification.public_surface_observation_input_verification_is_not_banking_pack_readiness, true);
assert.equal(verification.public_surface_observation_input_verification_is_not_launch_readiness, true);
assert.equal(verification.public_surface_observation_input_verification_is_not_production_readiness, true);
assert.equal(verification.public_surface_observation_input_verification_is_not_legal_validity, true);
assert.equal(verification.public_surface_observation_input_verification_is_not_security_certification, true);
assert.equal(verification.public_surface_observation_input_verification_does_not_authorize_ai_authority, true);

for (const code of [
  'PUBLIC_SURFACE_OBSERVATION_INPUT_VERIFICATION_MISSING',
  'SOURCE_PUBLIC_SURFACE_OBSERVATION_INPUT_COLLECTION_HASH_INVALID',
  'PUBLIC_SURFACE_OBSERVATION_INPUT_COLLECTION_NOT_READY',
  'OBSERVATION_VERIFICATION_ITEM_MISSING',
  'OBSERVATION_COLLECTION_NOT_COMPLETE',
  'PUBLIC_URL_NOT_PRESENT',
  'OBSERVER_REF_NOT_PRESENT',
  'OBSERVED_CONTENT_DIGEST_NOT_PRESENT',
  'OBSERVED_SCOPE_MATCH_RESULT_NOT_PRESENT',
  'OBSERVED_NON_CLAIMS_RESULT_NOT_PRESENT',
  'OBSERVED_EVIDENCE_REFERENCE_RESULT_NOT_PRESENT',
  'OBSERVATION_INPUTS_NOT_VERIFIED',
  'OBSERVATION_GATE_RETRY_NOT_READY',
  'UNSUPPORTED_PUBLIC_OBSERVATION_READY_CLAIM',
  'UNSUPPORTED_EXTERNAL_CUSTOMER_READINESS_CLAIM',
  'UNSUPPORTED_BANKING_READINESS_CLAIM',
  'UNSUPPORTED_LAUNCH_READINESS_CLAIM',
  'UNSUPPORTED_PRODUCTION_READINESS_CLAIM',
  'AI_INPUT_VERIFICATION_AUTHORITY_CLAIM_BLOCKED'
]) {
  assert.equal(doc.fail_closed_codes.includes(code), true, `${code} must be present`);
}

assert.equal(doc.readiness_state.public_surface_observation_input_verification_defined, true);
assert.equal(doc.readiness_state.public_surface_observation_input_verification_artifact_ready, true);
assert.equal(doc.readiness_state.source_public_surface_observation_input_collection_bound, true);
assert.equal(doc.readiness_state.public_surface_observation_input_collection_ready, true);
assert.equal(doc.readiness_state.public_surface_ready, true);
assert.equal(doc.readiness_state.publication_authorized, true);
assert.equal(doc.readiness_state.publication_authorization_scope, 'controlled_public_information_surface_only');
assert.equal(doc.readiness_state.publication_authorization_scope_limited, true);
assert.equal(doc.readiness_state.all_collection_items_have_verification_items, true);
assert.equal(doc.readiness_state.all_verification_items_blocked_not_collected, true);
assert.equal(doc.readiness_state.all_verification_items_without_public_url, true);
assert.equal(doc.readiness_state.all_verification_items_without_observer_ref, true);
assert.equal(doc.readiness_state.all_verification_items_without_observed_content_digest, true);
assert.equal(doc.readiness_state.public_surface_observation_inputs_collected, false);
assert.equal(doc.readiness_state.public_surface_observation_inputs_verified, false);
assert.equal(doc.readiness_state.public_surface_observation_input_verification_performed, false);
assert.equal(doc.readiness_state.public_surface_observation_input_verification_passed, false);
assert.equal(doc.readiness_state.public_surface_observation_gate_retry_ready, false);
assert.equal(doc.readiness_state.public_surface_observed, false);
assert.equal(doc.readiness_state.public_surface_observation_ready, false);
assert.equal(doc.readiness_state.external_customer_ready, false);
assert.equal(doc.readiness_state.banking_pack_ready, false);
assert.equal(doc.readiness_state.level1_launch_ready, false);
assert.equal(doc.readiness_state.production_ready, false);

assert.equal(doc.next_required_program, 'PROG-106-HBCE-LEVEL1-PUBLIC-SURFACE-OBSERVATION-RETRY-GATE');

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

assert.match(md, /LEVEL1_PUBLIC_SURFACE_OBSERVATION_INPUT_VERIFICATION_DEFINED_NOT_VERIFIED/);
assert.match(md, /No observation input values are verified/);
assert.match(md, /Verification is blocked because collection values are missing/);
assert.match(md, /No public URL is present/);
assert.match(md, /No observer reference is present/);
assert.match(md, /No observed content digest is present/);
assert.match(md, /Input verification is not performed/);
assert.match(md, /PROG-106-HBCE-LEVEL1-PUBLIC-SURFACE-OBSERVATION-RETRY-GATE/);

console.log('PASS PROG-105-PUBLIC-SURFACE-OBSERVATION-INPUT-VERIFICATION-DOCS-EXIST');
console.log('PASS PROG-105-PUBLIC-SURFACE-OBSERVATION-INPUT-VERIFICATION-HASH-STABLE');
console.log('PASS PROG-105-BUILDER-STABLE');
console.log('PASS PROG-105-SOURCE-PROG-104-INTEGRITY-VALID');
console.log('PASS PROG-105-VERIFICATION-ITEMS-DEFINED');
console.log('PASS PROG-105-INPUT-VERIFICATION-NOT-PERFORMED');
console.log('PASS PROG-105-INPUT-VERIFICATION-NOT-PASSED');
console.log('PASS PROG-105-GATE-RETRY-NOT-READY');
console.log('PASS PROG-105-AI-INPUT-VERIFICATION-AUTHORITY-DISALLOWED');
console.log('PASS PROG-105-NEXT-PROG-106-RECORDED');
console.log('PASS PROG-105-NO-UNSUPPORTED-READINESS-CLAIMS');
