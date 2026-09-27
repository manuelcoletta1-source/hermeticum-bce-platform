'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { sha256Digest } = require('../../../packages/hbce-core/canonical-json.js');
const {
  STATUS,
  SOURCE_REF,
  buildObservationInputCollectionPayload,
  buildLevel1PublicSurfaceObservationInputCollection
} = require('../../../runtime/level1/build-prog-104-level1-public-surface-observation-input-collection.js');

const root = path.resolve(__dirname, '../../..');
const read = (p) => fs.readFileSync(path.join(root, p), 'utf8');
const json = (p) => JSON.parse(read(p));
const exists = (p) => fs.existsSync(path.join(root, p));

const docPath = 'docs/launch/level1/prog-104-level1-public-surface-observation-input-collection.json';
const mdPath = 'docs/launch/level1/prog-104-level1-public-surface-observation-input-collection.md';
const runtimePath = 'runtime/level1/build-prog-104-level1-public-surface-observation-input-collection.js';

for (const p of [docPath, mdPath, runtimePath, SOURCE_REF]) assert.equal(exists(p), true, `${p} must exist`);

const doc = json(docPath);
const md = read(mdPath);
const source = json(SOURCE_REF);

assert.equal(doc.proto, 'HBCE-L1-PROG-104-PUBLIC-SURFACE-OBSERVATION-INPUT-COLLECTION-v1');
assert.equal(doc.kind, 'HBCE_LEVEL1_PUBLIC_SURFACE_OBSERVATION_INPUT_COLLECTION');
assert.equal(doc.issue_id, 'PROG-104');
assert.equal(doc.level1_public_surface_observation_input_collection_status, STATUS);
assert.equal(doc.source_public_surface_observation_input_pack_revision_hash, source.revision_hash);
assert.equal(doc.source_public_surface_observation_input_pack_revision_hash_valid, true);

const regenerated = buildLevel1PublicSurfaceObservationInputCollection({ rootDir: root, repositoryCommit: doc.repository_baseline_commit });
assert.deepEqual(regenerated, doc);

const body = { ...doc };
delete body.revision_hash;
assert.equal(doc.revision_hash, sha256Digest(body));

assert.equal(doc.inherited_public_surface_observation_input_pack.input_pack_status, 'LEVEL1_PUBLIC_SURFACE_OBSERVATION_INPUT_PACK_DEFINED_PENDING_INPUTS');
assert.equal(doc.inherited_public_surface_observation_input_pack.public_surface_observation_input_pack_ready, true);
assert.equal(doc.inherited_public_surface_observation_input_pack.public_surface_observation_inputs_collected, false);
assert.equal(doc.inherited_public_surface_observation_input_pack.public_surface_observation_inputs_verified, false);
assert.equal(doc.inherited_public_surface_observation_input_pack.public_surface_observation_gate_retry_ready, false);
assert.equal(doc.inherited_public_surface_observation_input_pack.public_surface_ready, true);
assert.equal(doc.inherited_public_surface_observation_input_pack.publication_authorized, true);
assert.equal(doc.inherited_public_surface_observation_input_pack.publication_authorization_scope, 'controlled_public_information_surface_only');

const expectedPayload = buildObservationInputCollectionPayload(source);
const collection = doc.public_surface_observation_input_collection;

assert.equal(collection.public_surface_observation_input_collection_payload_digest, sha256Digest(expectedPayload));
assert.equal(collection.public_surface_observation_input_collection_id, 'PUBLIC-SURFACE-OBSERVATION-INPUT-COLLECTION::HBCE-L1-DECISION-PROOF-0001');
assert.equal(collection.input_collection_key, 'hbce.level1.public_surface.observation_input_collection.controlled_information.0001');
assert.equal(collection.source_public_surface_observation_input_pack_ref, SOURCE_REF);
assert.equal(collection.source_public_surface_observation_input_pack_digest, source.public_surface_observation_input_pack.public_surface_observation_input_pack_payload_digest);
assert.equal(collection.input_collection_scope, 'LEVEL1_DECISION_PROOF_PUBLIC_SURFACE_CONTROLLED_INFORMATION_ONLY');
assert.equal(collection.input_collection_status, 'DEFINED_NOT_COLLECTED');
assert.equal(collection.input_collection_mode, 'PUBLIC_INFORMATION_SURFACE_OBSERVATION_INPUT_COLLECTION');
assert.equal(collection.publication_authorization_scope, 'controlled_public_information_surface_only');

assert.deepEqual(collection.required_inputs, [
  'public_url',
  'observed_at',
  'observer_ref',
  'observation_method',
  'observed_content_digest',
  'observed_scope_match_result',
  'observed_non_claims_presence_result',
  'observed_evidence_reference_presence_result'
]);

assert.equal(collection.required_input_count, 8);
assert.equal(collection.collection_item_count, 4);
assert.equal(collection.collection_items.length, 4);
assert.equal(collection.all_input_targets_have_collection_items, true);
assert.equal(collection.all_collection_items_not_collected, true);
assert.equal(collection.all_collection_items_without_public_url, true);
assert.equal(collection.all_collection_items_without_observer_ref, true);
assert.equal(collection.all_collection_items_without_observed_content_digest, true);
assert.equal(collection.all_collection_items_incomplete, true);
assert.equal(collection.all_collection_items_unverified, true);
assert.equal(collection.all_collection_items_not_ready_for_input_verification, true);
assert.equal(collection.all_collection_items_not_ready_for_gate_retry, true);
assert.equal(collection.observation_inputs_collected, false);
assert.equal(collection.observation_inputs_verified, false);
assert.equal(collection.input_verification_ready, false);
assert.equal(collection.observation_gate_retry_ready, false);

for (const item of collection.collection_items) {
  assert.match(item.collection_item_id, /^PUBLIC-SURFACE-OBSERVATION-COLLECTION::HBCE-L1::/);
  assert.match(item.input_target_id, /^PUBLIC-SURFACE-OBSERVATION-INPUT::HBCE-L1::/);
  assert.match(item.observation_target_id, /^PUBLIC-SURFACE-OBSERVATION-TARGET::HBCE-L1::/);
  assert.equal(item.collection_status, 'NOT_COLLECTED');
  assert.equal(item.collection_required, true);
  assert.equal(item.collection_channel_required, true);
  assert.equal(item.collected_by, null);
  assert.equal(item.collected_at, null);
  assert.equal(item.collection_method, null);
  assert.equal(item.public_url, null);
  assert.equal(item.observed_at, null);
  assert.equal(item.observer_ref, null);
  assert.equal(item.observation_method, null);
  assert.equal(item.observed_content_digest, null);
  assert.equal(item.observed_headers_digest, null);
  assert.equal(item.observed_status_code, null);
  assert.equal(item.observed_scope_match_result, null);
  assert.equal(item.observed_non_claims_presence_result, null);
  assert.equal(item.observed_evidence_reference_presence_result, null);
  assert.equal(item.customer_data_declared_absent, null);
  assert.equal(item.customer_logo_authorization_declared, null);
  assert.equal(item.forbidden_claims_declared_absent, null);
  assert.equal(item.collection_complete, false);
  assert.equal(item.collection_verified, false);
  assert.equal(item.ready_for_input_verification, false);
  assert.equal(item.ready_for_observation_gate_retry, false);
}

for (const control of [
  'define_collection_items_for_each_input_target',
  'require_operator_submission_for_collection',
  'require_public_url_value_before_collection_complete',
  'require_observer_ref_value_before_collection_complete',
  'require_observed_content_digest_before_collection_complete',
  'require_scope_match_result_before_collection_complete',
  'require_non_claims_presence_result_before_collection_complete',
  'require_evidence_reference_presence_result_before_collection_complete',
  'do_not_supply_placeholder_public_url',
  'do_not_supply_placeholder_observer_ref',
  'do_not_supply_placeholder_content_digest',
  'do_not_infer_collection_from_input_pack_definition',
  'do_not_infer_public_observation_from_collection_definition',
  'do_not_claim_external_customer_delivery_readiness',
  'do_not_claim_banking_pack_readiness',
  'do_not_claim_level1_launch_readiness',
  'do_not_claim_production_readiness',
  'do_not_claim_legal_validity',
  'do_not_claim_security_certification',
  'do_not_authorize_ai_authority',
  'fail_closed_on_missing_collection_values'
]) {
  assert.equal(collection.input_collection_controls.includes(control), true, `${control} must be present`);
}

assert.equal(collection.input_collection_boundary.controlled_information_surface_only, true);
assert.equal(collection.input_collection_boundary.input_collection_definition_only, true);
assert.equal(collection.input_collection_boundary.no_public_observation_recorded, true);
assert.equal(collection.input_collection_boundary.no_observation_input_values_collected, true);
assert.equal(collection.input_collection_boundary.source_input_pack_required, true);
assert.equal(collection.input_collection_boundary.source_observation_gate_required, true);
assert.equal(collection.input_collection_boundary.no_customer_data, true);
assert.equal(collection.input_collection_boundary.no_live_system_control, true);
assert.equal(collection.input_collection_boundary.no_production_integration, true);
assert.equal(collection.input_collection_boundary.no_legal_validity_claim, true);
assert.equal(collection.input_collection_boundary.no_security_certification_claim, true);
assert.equal(collection.input_collection_boundary.no_ai_authority_claim, true);
assert.equal(collection.input_collection_boundary.no_customer_logo_without_authorization, true);

assert.equal(collection.source_public_surface_observation_input_pack_ready, true);
assert.equal(collection.source_observation_inputs_collected, false);
assert.equal(collection.source_observation_inputs_verified, false);
assert.equal(collection.source_observation_gate_retry_ready, false);
assert.equal(collection.source_public_surface_ready, true);
assert.equal(collection.source_publication_authorized, true);
assert.equal(collection.source_publication_authorization_scope_limited, true);
assert.equal(collection.public_surface_observation_input_collection_defined, true);
assert.equal(collection.public_surface_observation_input_collection_ready, true);
assert.equal(collection.public_surface_observation_inputs_collected, false);
assert.equal(collection.public_surface_observation_inputs_verified, false);
assert.equal(collection.public_surface_observation_input_verification_ready, false);
assert.equal(collection.public_surface_observation_gate_retry_ready, false);
assert.equal(collection.public_surface_observed, false);
assert.equal(collection.public_surface_observation_ready, false);
assert.equal(collection.public_surface_ready, true);
assert.equal(collection.publication_authorized, true);
assert.equal(collection.publication_authorization_scope_limited, true);
assert.equal(collection.external_customer_ready, false);
assert.equal(collection.banking_pack_ready, false);
assert.equal(collection.level1_launch_ready, false);
assert.equal(collection.production_ready, false);
assert.equal(collection.ai_input_collection_authority_allowed, false);

assert.equal(collection.observation_input_collection_checklist.source_public_surface_observation_input_pack_hash_valid, true);
assert.equal(collection.observation_input_collection_checklist.source_public_surface_observation_input_pack_ready, true);
assert.equal(collection.observation_input_collection_checklist.all_input_targets_have_collection_items, true);
assert.equal(collection.observation_input_collection_checklist.all_collection_items_not_collected, true);
assert.equal(collection.observation_input_collection_checklist.all_collection_items_without_public_url, true);
assert.equal(collection.observation_input_collection_checklist.all_collection_items_without_observer_ref, true);
assert.equal(collection.observation_input_collection_checklist.all_collection_items_without_observed_content_digest, true);
assert.equal(collection.observation_input_collection_checklist.all_collection_items_incomplete, true);
assert.equal(collection.observation_input_collection_checklist.all_collection_items_unverified, true);
assert.equal(collection.observation_input_collection_checklist.all_collection_items_not_ready_for_input_verification, true);
assert.equal(collection.observation_input_collection_checklist.all_collection_items_not_ready_for_gate_retry, true);
assert.equal(collection.observation_input_collection_checklist.observation_inputs_collected, false);
assert.equal(collection.observation_input_collection_checklist.observation_inputs_verified, false);
assert.equal(collection.observation_input_collection_checklist.input_verification_ready, false);
assert.equal(collection.observation_input_collection_checklist.observation_gate_retry_ready, false);
assert.equal(collection.observation_input_collection_checklist.public_surface_observed, false);
assert.equal(collection.observation_input_collection_checklist.public_observation_ready, false);
assert.equal(collection.observation_input_collection_checklist.external_customer_readiness_excluded, true);
assert.equal(collection.observation_input_collection_checklist.banking_pack_readiness_excluded, true);
assert.equal(collection.observation_input_collection_checklist.launch_readiness_excluded, true);
assert.equal(collection.observation_input_collection_checklist.production_readiness_excluded, true);
assert.equal(collection.observation_input_collection_checklist.ai_authority_absence_confirmed, true);

assert.equal(collection.public_surface_observation_input_collection_is_defined, true);
assert.equal(collection.public_surface_observation_input_collection_is_not_collected, true);
assert.equal(collection.public_surface_observation_input_collection_is_not_verified, true);
assert.equal(collection.public_surface_observation_input_collection_is_not_observation_evidence, true);
assert.equal(collection.public_surface_observation_input_collection_is_not_public_observation_ready, true);
assert.equal(collection.public_surface_observation_input_collection_is_not_external_customer_readiness, true);
assert.equal(collection.public_surface_observation_input_collection_is_not_banking_pack_readiness, true);
assert.equal(collection.public_surface_observation_input_collection_is_not_launch_readiness, true);
assert.equal(collection.public_surface_observation_input_collection_is_not_production_readiness, true);
assert.equal(collection.public_surface_observation_input_collection_is_not_legal_validity, true);
assert.equal(collection.public_surface_observation_input_collection_is_not_security_certification, true);
assert.equal(collection.public_surface_observation_input_collection_does_not_authorize_ai_authority, true);

for (const code of [
  'PUBLIC_SURFACE_OBSERVATION_INPUT_COLLECTION_MISSING',
  'SOURCE_PUBLIC_SURFACE_OBSERVATION_INPUT_PACK_HASH_INVALID',
  'PUBLIC_SURFACE_OBSERVATION_INPUT_PACK_NOT_READY',
  'OBSERVATION_COLLECTION_ITEM_MISSING',
  'PUBLIC_URL_NOT_COLLECTED',
  'OBSERVER_REF_NOT_COLLECTED',
  'OBSERVED_CONTENT_DIGEST_NOT_COLLECTED',
  'OBSERVATION_INPUTS_NOT_COLLECTED',
  'OBSERVATION_INPUTS_NOT_VERIFIED',
  'INPUT_VERIFICATION_NOT_READY',
  'OBSERVATION_GATE_RETRY_NOT_READY',
  'UNSUPPORTED_PUBLIC_OBSERVATION_READY_CLAIM',
  'UNSUPPORTED_EXTERNAL_CUSTOMER_READINESS_CLAIM',
  'UNSUPPORTED_BANKING_READINESS_CLAIM',
  'UNSUPPORTED_LAUNCH_READINESS_CLAIM',
  'UNSUPPORTED_PRODUCTION_READINESS_CLAIM',
  'AI_INPUT_COLLECTION_AUTHORITY_CLAIM_BLOCKED'
]) {
  assert.equal(doc.fail_closed_codes.includes(code), true, `${code} must be present`);
}

assert.equal(doc.readiness_state.public_surface_observation_input_collection_defined, true);
assert.equal(doc.readiness_state.public_surface_observation_input_collection_ready, true);
assert.equal(doc.readiness_state.source_public_surface_observation_input_pack_bound, true);
assert.equal(doc.readiness_state.public_surface_observation_input_pack_ready, true);
assert.equal(doc.readiness_state.public_surface_ready, true);
assert.equal(doc.readiness_state.publication_authorized, true);
assert.equal(doc.readiness_state.publication_authorization_scope, 'controlled_public_information_surface_only');
assert.equal(doc.readiness_state.publication_authorization_scope_limited, true);
assert.equal(doc.readiness_state.all_input_targets_have_collection_items, true);
assert.equal(doc.readiness_state.all_collection_items_not_collected, true);
assert.equal(doc.readiness_state.all_collection_items_without_public_url, true);
assert.equal(doc.readiness_state.all_collection_items_without_observer_ref, true);
assert.equal(doc.readiness_state.all_collection_items_without_observed_content_digest, true);
assert.equal(doc.readiness_state.public_surface_observation_inputs_collected, false);
assert.equal(doc.readiness_state.public_surface_observation_inputs_verified, false);
assert.equal(doc.readiness_state.public_surface_observation_input_verification_ready, false);
assert.equal(doc.readiness_state.public_surface_observation_gate_retry_ready, false);
assert.equal(doc.readiness_state.public_surface_observed, false);
assert.equal(doc.readiness_state.public_surface_observation_ready, false);
assert.equal(doc.readiness_state.external_customer_ready, false);
assert.equal(doc.readiness_state.banking_pack_ready, false);
assert.equal(doc.readiness_state.level1_launch_ready, false);
assert.equal(doc.readiness_state.production_ready, false);

assert.equal(doc.next_required_program, 'PROG-105-HBCE-LEVEL1-PUBLIC-SURFACE-OBSERVATION-INPUT-VERIFICATION');

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

assert.match(md, /LEVEL1_PUBLIC_SURFACE_OBSERVATION_INPUT_COLLECTION_DEFINED_NOT_COLLECTED/);
assert.match(md, /No observation input values are collected/);
assert.match(md, /No public URL is collected/);
assert.match(md, /No observer reference is collected/);
assert.match(md, /No observed content digest is collected/);
assert.match(md, /Input verification is not ready/);
assert.match(md, /PROG-105-HBCE-LEVEL1-PUBLIC-SURFACE-OBSERVATION-INPUT-VERIFICATION/);

console.log('PASS PROG-104-PUBLIC-SURFACE-OBSERVATION-INPUT-COLLECTION-DOCS-EXIST');
console.log('PASS PROG-104-PUBLIC-SURFACE-OBSERVATION-INPUT-COLLECTION-HASH-STABLE');
console.log('PASS PROG-104-BUILDER-STABLE');
console.log('PASS PROG-104-SOURCE-PROG-103-INTEGRITY-VALID');
console.log('PASS PROG-104-COLLECTION-ITEMS-DEFINED');
console.log('PASS PROG-104-INPUT-COLLECTION-NOT-COLLECTED');
console.log('PASS PROG-104-NO-PLACEHOLDER-COLLECTION-VALUES');
console.log('PASS PROG-104-INPUT-VERIFICATION-NOT-READY');
console.log('PASS PROG-104-AI-INPUT-COLLECTION-AUTHORITY-DISALLOWED');
console.log('PASS PROG-104-NEXT-PROG-105-RECORDED');
console.log('PASS PROG-104-NO-UNSUPPORTED-READINESS-CLAIMS');
