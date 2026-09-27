'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { sha256Digest } = require('../../../packages/hbce-core/canonical-json.js');
const {
  STATUS,
  SOURCE_REF,
  buildObservationInputPackPayload,
  buildLevel1PublicSurfaceObservationInputPack
} = require('../../../runtime/level1/build-prog-103-level1-public-surface-observation-input-pack.js');

const root = path.resolve(__dirname, '../../..');
const read = (p) => fs.readFileSync(path.join(root, p), 'utf8');
const json = (p) => JSON.parse(read(p));
const exists = (p) => fs.existsSync(path.join(root, p));

const docPath = 'docs/launch/level1/prog-103-level1-public-surface-observation-input-pack.json';
const mdPath = 'docs/launch/level1/prog-103-level1-public-surface-observation-input-pack.md';
const runtimePath = 'runtime/level1/build-prog-103-level1-public-surface-observation-input-pack.js';

for (const p of [docPath, mdPath, runtimePath, SOURCE_REF]) assert.equal(exists(p), true, `${p} must exist`);

const doc = json(docPath);
const md = read(mdPath);
const source = json(SOURCE_REF);

assert.equal(doc.proto, 'HBCE-L1-PROG-103-PUBLIC-SURFACE-OBSERVATION-INPUT-PACK-v1');
assert.equal(doc.kind, 'HBCE_LEVEL1_PUBLIC_SURFACE_OBSERVATION_INPUT_PACK');
assert.equal(doc.issue_id, 'PROG-103');
assert.equal(doc.level1_public_surface_observation_input_pack_status, STATUS);
assert.equal(doc.source_public_surface_observation_gate_revision_hash, source.revision_hash);
assert.equal(doc.source_public_surface_observation_gate_revision_hash_valid, true);

const regenerated = buildLevel1PublicSurfaceObservationInputPack({ rootDir: root, repositoryCommit: doc.repository_baseline_commit });
assert.deepEqual(regenerated, doc);

const body = { ...doc };
delete body.revision_hash;
assert.equal(doc.revision_hash, sha256Digest(body));

assert.equal(doc.inherited_public_surface_observation_gate.observation_gate_status, 'LEVEL1_PUBLIC_SURFACE_OBSERVATION_GATE_BLOCKED_MISSING_OBSERVATION_INPUTS');
assert.equal(doc.inherited_public_surface_observation_gate.public_surface_observation_gate_evaluated, true);
assert.equal(doc.inherited_public_surface_observation_gate.public_surface_observation_gate_passed, false);
assert.equal(doc.inherited_public_surface_observation_gate.observation_gate_blocked_missing_inputs, true);
assert.equal(doc.inherited_public_surface_observation_gate.public_surface_ready, true);
assert.equal(doc.inherited_public_surface_observation_gate.publication_authorized, true);
assert.equal(doc.inherited_public_surface_observation_gate.publication_authorization_scope, 'controlled_public_information_surface_only');

const expectedPayload = buildObservationInputPackPayload(source);
const pack = doc.public_surface_observation_input_pack;

assert.equal(pack.public_surface_observation_input_pack_payload_digest, sha256Digest(expectedPayload));
assert.equal(pack.public_surface_observation_input_pack_id, 'PUBLIC-SURFACE-OBSERVATION-INPUT-PACK::HBCE-L1-DECISION-PROOF-0001');
assert.equal(pack.input_pack_key, 'hbce.level1.public_surface.observation_input_pack.controlled_information.0001');
assert.equal(pack.source_public_surface_observation_gate_ref, SOURCE_REF);
assert.equal(pack.source_public_surface_observation_gate_digest, source.public_surface_observation_gate.public_surface_observation_gate_payload_digest);
assert.equal(pack.input_pack_scope, 'LEVEL1_DECISION_PROOF_PUBLIC_SURFACE_CONTROLLED_INFORMATION_ONLY');
assert.equal(pack.input_pack_status, 'DEFINED_PENDING_INPUTS');
assert.equal(pack.input_pack_mode, 'PUBLIC_INFORMATION_SURFACE_OBSERVATION_INPUT_PACK');
assert.equal(pack.publication_authorization_scope, 'controlled_public_information_surface_only');

assert.deepEqual(pack.required_inputs, [
  'public_url',
  'observed_at',
  'observer_ref',
  'observation_method',
  'observed_content_digest',
  'observed_scope_match_result',
  'observed_non_claims_presence_result',
  'observed_evidence_reference_presence_result'
]);
assert.equal(pack.required_input_count, 8);
assert.equal(pack.input_target_count, 4);
assert.equal(pack.input_targets.length, 4);
assert.equal(pack.all_gate_blocking_criteria_imported, true);
assert.equal(pack.all_input_targets_pending, true);
assert.equal(pack.all_input_targets_without_public_url, true);
assert.equal(pack.all_input_targets_without_observer_ref, true);
assert.equal(pack.all_input_targets_without_observed_content_digest, true);
assert.equal(pack.all_input_targets_incomplete, true);
assert.equal(pack.all_input_targets_unverified, true);
assert.equal(pack.all_input_targets_not_ready_for_gate_retry, true);
assert.equal(pack.observation_inputs_collected, false);
assert.equal(pack.observation_inputs_verified, false);
assert.equal(pack.ready_for_observation_gate_retry, false);

for (const target of pack.input_targets) {
  assert.match(target.input_target_id, /^PUBLIC-SURFACE-OBSERVATION-INPUT::HBCE-L1::/);
  assert.match(target.observation_target_id, /^PUBLIC-SURFACE-OBSERVATION-TARGET::HBCE-L1::/);
  assert.equal(target.input_status, 'PENDING_INPUTS');
  assert.equal(target.public_url, null);
  assert.equal(target.observed_at, null);
  assert.equal(target.observer_ref, null);
  assert.equal(target.observation_method, null);
  assert.equal(target.observed_content_digest, null);
  assert.equal(target.observed_headers_digest, null);
  assert.equal(target.observed_status_code, null);
  assert.equal(target.observed_scope_match_result, null);
  assert.equal(target.observed_non_claims_presence_result, null);
  assert.equal(target.observed_evidence_reference_presence_result, null);
  assert.equal(target.input_complete, false);
  assert.equal(target.input_verified, false);
  assert.equal(target.ready_for_observation_gate_retry, false);
  assert.equal(target.customer_data_declared_absent, null);
  assert.equal(target.customer_logo_authorization_declared, null);
  assert.equal(target.forbidden_claims_declared_absent, null);
}

for (const control of [
  'define_required_observation_inputs',
  'bind_inputs_to_observation_targets',
  'do_not_supply_placeholder_public_url',
  'do_not_supply_placeholder_observer_ref',
  'do_not_supply_placeholder_content_digest',
  'require_human_or_operator_input_submission',
  'require_content_digest_before_gate_retry',
  'require_scope_match_result_before_gate_retry',
  'require_non_claims_result_before_gate_retry',
  'require_evidence_reference_result_before_gate_retry',
  'do_not_infer_observation_from_input_pack_definition',
  'do_not_claim_external_customer_delivery_readiness',
  'do_not_claim_banking_pack_readiness',
  'do_not_claim_level1_launch_readiness',
  'do_not_claim_production_readiness',
  'do_not_claim_legal_validity',
  'do_not_claim_security_certification',
  'do_not_authorize_ai_authority',
  'fail_closed_on_missing_input_pack_values'
]) {
  assert.equal(pack.input_pack_controls.includes(control), true, `${control} must be present`);
}

assert.equal(pack.input_pack_boundary.controlled_information_surface_only, true);
assert.equal(pack.input_pack_boundary.input_pack_definition_only, true);
assert.equal(pack.input_pack_boundary.no_public_observation_recorded, true);
assert.equal(pack.input_pack_boundary.no_observation_input_values_supplied, true);
assert.equal(pack.input_pack_boundary.source_observation_gate_required, true);
assert.equal(pack.input_pack_boundary.source_observation_record_required, true);
assert.equal(pack.input_pack_boundary.source_release_manifest_required, true);
assert.equal(pack.input_pack_boundary.no_customer_data, true);
assert.equal(pack.input_pack_boundary.no_live_system_control, true);
assert.equal(pack.input_pack_boundary.no_production_integration, true);
assert.equal(pack.input_pack_boundary.no_legal_validity_claim, true);
assert.equal(pack.input_pack_boundary.no_security_certification_claim, true);
assert.equal(pack.input_pack_boundary.no_ai_authority_claim, true);
assert.equal(pack.input_pack_boundary.no_customer_logo_without_authorization, true);

assert.equal(pack.source_public_surface_observation_gate_evaluated, true);
assert.equal(pack.source_public_surface_observation_gate_passed, false);
assert.equal(pack.source_observation_gate_blocked_missing_inputs, true);
assert.equal(pack.source_public_surface_ready, true);
assert.equal(pack.source_publication_authorized, true);
assert.equal(pack.source_publication_authorization_scope_limited, true);
assert.equal(pack.public_surface_observation_input_pack_defined, true);
assert.equal(pack.public_surface_observation_input_pack_ready, true);
assert.equal(pack.public_surface_observation_inputs_collected, false);
assert.equal(pack.public_surface_observation_inputs_verified, false);
assert.equal(pack.public_surface_observation_gate_retry_ready, false);
assert.equal(pack.public_surface_observed, false);
assert.equal(pack.public_surface_observation_ready, false);
assert.equal(pack.public_surface_ready, true);
assert.equal(pack.publication_authorized, true);
assert.equal(pack.publication_authorization_scope_limited, true);
assert.equal(pack.external_customer_ready, false);
assert.equal(pack.banking_pack_ready, false);
assert.equal(pack.level1_launch_ready, false);
assert.equal(pack.production_ready, false);
assert.equal(pack.ai_input_pack_authority_allowed, false);

assert.equal(pack.observation_input_pack_checklist.source_public_surface_observation_gate_hash_valid, true);
assert.equal(pack.observation_input_pack_checklist.source_public_surface_observation_gate_evaluated, true);
assert.equal(pack.observation_input_pack_checklist.source_public_surface_observation_gate_blocked_missing_inputs, true);
assert.equal(pack.observation_input_pack_checklist.all_gate_blocking_criteria_imported, true);
assert.equal(pack.observation_input_pack_checklist.all_input_targets_pending, true);
assert.equal(pack.observation_input_pack_checklist.all_input_targets_without_public_url, true);
assert.equal(pack.observation_input_pack_checklist.all_input_targets_without_observer_ref, true);
assert.equal(pack.observation_input_pack_checklist.all_input_targets_without_observed_content_digest, true);
assert.equal(pack.observation_input_pack_checklist.all_input_targets_incomplete, true);
assert.equal(pack.observation_input_pack_checklist.all_input_targets_unverified, true);
assert.equal(pack.observation_input_pack_checklist.all_input_targets_not_ready_for_gate_retry, true);
assert.equal(pack.observation_input_pack_checklist.observation_inputs_collected, false);
assert.equal(pack.observation_input_pack_checklist.observation_inputs_verified, false);
assert.equal(pack.observation_input_pack_checklist.ready_for_observation_gate_retry, false);
assert.equal(pack.observation_input_pack_checklist.public_surface_observed, false);
assert.equal(pack.observation_input_pack_checklist.public_observation_ready, false);
assert.equal(pack.observation_input_pack_checklist.external_customer_readiness_excluded, true);
assert.equal(pack.observation_input_pack_checklist.banking_pack_readiness_excluded, true);
assert.equal(pack.observation_input_pack_checklist.launch_readiness_excluded, true);
assert.equal(pack.observation_input_pack_checklist.production_readiness_excluded, true);
assert.equal(pack.observation_input_pack_checklist.ai_authority_absence_confirmed, true);

assert.equal(pack.public_surface_observation_input_pack_is_defined, true);
assert.equal(pack.public_surface_observation_input_pack_is_pending_inputs, true);
assert.equal(pack.public_surface_observation_input_pack_is_not_observation_evidence, true);
assert.equal(pack.public_surface_observation_input_pack_is_not_public_observation_ready, true);
assert.equal(pack.public_surface_observation_input_pack_is_not_external_customer_readiness, true);
assert.equal(pack.public_surface_observation_input_pack_is_not_banking_pack_readiness, true);
assert.equal(pack.public_surface_observation_input_pack_is_not_launch_readiness, true);
assert.equal(pack.public_surface_observation_input_pack_is_not_production_readiness, true);
assert.equal(pack.public_surface_observation_input_pack_is_not_legal_validity, true);
assert.equal(pack.public_surface_observation_input_pack_is_not_security_certification, true);
assert.equal(pack.public_surface_observation_input_pack_does_not_authorize_ai_authority, true);

for (const code of [
  'PUBLIC_SURFACE_OBSERVATION_INPUT_PACK_MISSING',
  'SOURCE_PUBLIC_SURFACE_OBSERVATION_GATE_HASH_INVALID',
  'PUBLIC_SURFACE_OBSERVATION_GATE_NOT_EVALUATED',
  'PUBLIC_SURFACE_OBSERVATION_GATE_NOT_BLOCKED_AS_EXPECTED',
  'OBSERVATION_INPUT_TARGET_MISSING',
  'PUBLIC_URL_PLACEHOLDER_NOT_ALLOWED',
  'OBSERVER_REF_PLACEHOLDER_NOT_ALLOWED',
  'OBSERVED_CONTENT_DIGEST_PLACEHOLDER_NOT_ALLOWED',
  'OBSERVATION_INPUTS_NOT_COLLECTED',
  'OBSERVATION_INPUTS_NOT_VERIFIED',
  'OBSERVATION_GATE_RETRY_NOT_READY',
  'UNSUPPORTED_PUBLIC_OBSERVATION_READY_CLAIM',
  'UNSUPPORTED_EXTERNAL_CUSTOMER_READINESS_CLAIM',
  'UNSUPPORTED_BANKING_READINESS_CLAIM',
  'UNSUPPORTED_LAUNCH_READINESS_CLAIM',
  'UNSUPPORTED_PRODUCTION_READINESS_CLAIM',
  'AI_INPUT_PACK_AUTHORITY_CLAIM_BLOCKED'
]) {
  assert.equal(doc.fail_closed_codes.includes(code), true, `${code} must be present`);
}

assert.equal(doc.readiness_state.public_surface_observation_input_pack_defined, true);
assert.equal(doc.readiness_state.public_surface_observation_input_pack_ready, true);
assert.equal(doc.readiness_state.source_public_surface_observation_gate_bound, true);
assert.equal(doc.readiness_state.public_surface_observation_gate_evaluated, true);
assert.equal(doc.readiness_state.public_surface_observation_gate_passed, false);
assert.equal(doc.readiness_state.observation_gate_blocked_missing_inputs, true);
assert.equal(doc.readiness_state.public_surface_ready, true);
assert.equal(doc.readiness_state.publication_authorized, true);
assert.equal(doc.readiness_state.publication_authorization_scope, 'controlled_public_information_surface_only');
assert.equal(doc.readiness_state.publication_authorization_scope_limited, true);
assert.equal(doc.readiness_state.all_gate_blocking_criteria_imported, true);
assert.equal(doc.readiness_state.all_input_targets_pending, true);
assert.equal(doc.readiness_state.all_input_targets_without_public_url, true);
assert.equal(doc.readiness_state.all_input_targets_without_observer_ref, true);
assert.equal(doc.readiness_state.all_input_targets_without_observed_content_digest, true);
assert.equal(doc.readiness_state.public_surface_observation_inputs_collected, false);
assert.equal(doc.readiness_state.public_surface_observation_inputs_verified, false);
assert.equal(doc.readiness_state.public_surface_observation_gate_retry_ready, false);
assert.equal(doc.readiness_state.public_surface_observed, false);
assert.equal(doc.readiness_state.public_surface_observation_ready, false);
assert.equal(doc.readiness_state.external_customer_ready, false);
assert.equal(doc.readiness_state.banking_pack_ready, false);
assert.equal(doc.readiness_state.level1_launch_ready, false);
assert.equal(doc.readiness_state.production_ready, false);

assert.equal(doc.next_required_program, 'PROG-104-HBCE-LEVEL1-PUBLIC-SURFACE-OBSERVATION-INPUT-COLLECTION');

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

assert.match(md, /LEVEL1_PUBLIC_SURFACE_OBSERVATION_INPUT_PACK_DEFINED_PENDING_INPUTS/);
assert.match(md, /The observation input pack is pending input values/);
assert.match(md, /No public URL is supplied/);
assert.match(md, /No observer reference is supplied/);
assert.match(md, /No observed content digest is supplied/);
assert.match(md, /The public surface observation is not ready/);
assert.match(md, /PROG-104-HBCE-LEVEL1-PUBLIC-SURFACE-OBSERVATION-INPUT-COLLECTION/);

console.log('PASS PROG-103-PUBLIC-SURFACE-OBSERVATION-INPUT-PACK-DOCS-EXIST');
console.log('PASS PROG-103-PUBLIC-SURFACE-OBSERVATION-INPUT-PACK-HASH-STABLE');
console.log('PASS PROG-103-BUILDER-STABLE');
console.log('PASS PROG-103-SOURCE-PROG-102-INTEGRITY-VALID');
console.log('PASS PROG-103-INPUT-TARGETS-DEFINED');
console.log('PASS PROG-103-INPUT-PACK-PENDING-INPUTS');
console.log('PASS PROG-103-NO-PLACEHOLDER-OBSERVATION-VALUES');
console.log('PASS PROG-103-GATE-RETRY-NOT-READY');
console.log('PASS PROG-103-AI-INPUT-PACK-AUTHORITY-DISALLOWED');
console.log('PASS PROG-103-NEXT-PROG-104-RECORDED');
console.log('PASS PROG-103-NO-UNSUPPORTED-READINESS-CLAIMS');
