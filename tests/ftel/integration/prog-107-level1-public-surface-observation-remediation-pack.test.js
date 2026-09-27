'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { sha256Digest } = require('../../../packages/hbce-core/canonical-json.js');
const {
  STATUS,
  SOURCE_REF,
  buildObservationRemediationPackPayload,
  buildLevel1PublicSurfaceObservationRemediationPack
} = require('../../../runtime/level1/build-prog-107-level1-public-surface-observation-remediation-pack.js');

const root = path.resolve(__dirname, '../../..');
const read = (p) => fs.readFileSync(path.join(root, p), 'utf8');
const json = (p) => JSON.parse(read(p));
const exists = (p) => fs.existsSync(path.join(root, p));

const docPath = 'docs/launch/level1/prog-107-level1-public-surface-observation-remediation-pack.json';
const mdPath = 'docs/launch/level1/prog-107-level1-public-surface-observation-remediation-pack.md';
const runtimePath = 'runtime/level1/build-prog-107-level1-public-surface-observation-remediation-pack.js';

for (const p of [docPath, mdPath, runtimePath, SOURCE_REF]) assert.equal(exists(p), true, `${p} must exist`);

const doc = json(docPath);
const md = read(mdPath);
const source = json(SOURCE_REF);

assert.equal(doc.proto, 'HBCE-L1-PROG-107-PUBLIC-SURFACE-OBSERVATION-REMEDIATION-PACK-v1');
assert.equal(doc.kind, 'HBCE_LEVEL1_PUBLIC_SURFACE_OBSERVATION_REMEDIATION_PACK');
assert.equal(doc.issue_id, 'PROG-107');
assert.equal(doc.level1_public_surface_observation_remediation_pack_status, STATUS);
assert.equal(doc.source_public_surface_observation_retry_gate_revision_hash, source.revision_hash);
assert.equal(doc.source_public_surface_observation_retry_gate_revision_hash_valid, true);

const regenerated = buildLevel1PublicSurfaceObservationRemediationPack({ rootDir: root, repositoryCommit: doc.repository_baseline_commit });
assert.deepEqual(regenerated, doc);

const body = { ...doc };
delete body.revision_hash;
assert.equal(doc.revision_hash, sha256Digest(body));

assert.equal(doc.inherited_public_surface_observation_retry_gate.retry_gate_status, 'LEVEL1_PUBLIC_SURFACE_OBSERVATION_RETRY_GATE_BLOCKED_UNVERIFIED_INPUTS');
assert.equal(doc.inherited_public_surface_observation_retry_gate.public_surface_observation_retry_gate_evaluated, true);
assert.equal(doc.inherited_public_surface_observation_retry_gate.public_surface_observation_retry_gate_passed, false);
assert.equal(doc.inherited_public_surface_observation_retry_gate.retry_gate_blocked_unverified_inputs, true);
assert.equal(doc.inherited_public_surface_observation_retry_gate.observation_inputs_collected, false);
assert.equal(doc.inherited_public_surface_observation_retry_gate.observation_inputs_verified, false);
assert.equal(doc.inherited_public_surface_observation_retry_gate.input_verification_performed, false);
assert.equal(doc.inherited_public_surface_observation_retry_gate.input_verification_passed, false);
assert.equal(doc.inherited_public_surface_observation_retry_gate.observation_retry_allowed, false);
assert.equal(doc.inherited_public_surface_observation_retry_gate.observation_retry_performed, false);
assert.equal(doc.inherited_public_surface_observation_retry_gate.observation_retry_ready, false);
assert.equal(doc.inherited_public_surface_observation_retry_gate.public_surface_ready, true);
assert.equal(doc.inherited_public_surface_observation_retry_gate.publication_authorized, true);
assert.equal(doc.inherited_public_surface_observation_retry_gate.publication_authorization_scope, 'controlled_public_information_surface_only');

const expectedPayload = buildObservationRemediationPackPayload(source);
const pack = doc.public_surface_observation_remediation_pack;

assert.equal(pack.public_surface_observation_remediation_pack_payload_digest, sha256Digest(expectedPayload));
assert.equal(pack.public_surface_observation_remediation_pack_id, 'PUBLIC-SURFACE-OBSERVATION-REMEDIATION-PACK::HBCE-L1-DECISION-PROOF-0001');
assert.equal(pack.remediation_pack_key, 'hbce.level1.public_surface.observation_remediation_pack.controlled_information.0001');
assert.equal(pack.source_public_surface_observation_retry_gate_ref, SOURCE_REF);
assert.equal(pack.source_public_surface_observation_retry_gate_digest, source.public_surface_observation_retry_gate.public_surface_observation_retry_gate_payload_digest);
assert.equal(pack.remediation_pack_scope, 'LEVEL1_DECISION_PROOF_PUBLIC_SURFACE_CONTROLLED_INFORMATION_ONLY');
assert.equal(pack.remediation_pack_status, 'DEFINED_PENDING_REMEDIATION');
assert.equal(pack.remediation_pack_mode, 'PUBLIC_INFORMATION_SURFACE_OBSERVATION_REMEDIATION_PACK');
assert.equal(pack.publication_authorization_scope, 'controlled_public_information_surface_only');

assert.deepEqual(pack.imported_retry_gate_blocking_criteria, [
  'observation_inputs_collected',
  'observation_inputs_verified',
  'input_verification_performed',
  'input_verification_passed',
  'prior_observation_gate_retry_ready'
]);
assert.equal(pack.imported_retry_gate_status, 'BLOCKED_UNVERIFIED_OBSERVATION_INPUTS');
assert.equal(pack.imported_retry_gate_result, 'OBSERVATION_RETRY_NOT_READY');

assert.equal(pack.remediation_item_count, 4);
assert.equal(pack.remediation_items.length, 4);
assert.equal(pack.all_retry_targets_have_remediation_items, true);
assert.equal(pack.all_remediation_items_pending, true);
assert.equal(pack.all_remediation_items_require_public_url_collection, true);
assert.equal(pack.all_remediation_items_require_observer_ref_collection, true);
assert.equal(pack.all_remediation_items_require_observed_content_digest_collection, true);
assert.equal(pack.all_remediation_items_require_scope_match_result_collection, true);
assert.equal(pack.all_remediation_items_require_non_claims_result_collection, true);
assert.equal(pack.all_remediation_items_require_evidence_reference_result_collection, true);
assert.equal(pack.all_remediation_items_require_input_verification, true);
assert.equal(pack.all_remediation_items_require_retry_gate_rerun, true);
assert.equal(pack.all_remediation_items_not_complete, true);
assert.equal(pack.all_remediation_items_not_ready_for_input_verification, true);
assert.equal(pack.all_remediation_items_not_ready_for_retry_gate_rerun, true);

for (const item of pack.remediation_items) {
  assert.match(item.remediation_item_id, /^PUBLIC-SURFACE-OBSERVATION-REMEDIATION::HBCE-L1::/);
  assert.match(item.retry_target_id, /^PUBLIC-SURFACE-OBSERVATION-RETRY::HBCE-L1::/);
  assert.equal(item.remediation_status, 'PENDING_REMEDIATION');
  assert.equal(item.remediation_required, true);
  assert.equal(item.remediation_actions.includes('collect_public_url'), true);
  assert.equal(item.remediation_actions.includes('collect_observer_ref'), true);
  assert.equal(item.remediation_actions.includes('collect_observed_content_digest'), true);
  assert.equal(item.remediation_actions.includes('verify_collected_inputs'), true);
  assert.equal(item.remediation_actions.includes('rerun_observation_retry_gate'), true);
  assert.equal(item.public_url_collection_required, true);
  assert.equal(item.observer_ref_collection_required, true);
  assert.equal(item.observed_content_digest_collection_required, true);
  assert.equal(item.input_verification_required, true);
  assert.equal(item.retry_gate_rerun_required, true);
  assert.equal(item.public_url_collected, false);
  assert.equal(item.observer_ref_collected, false);
  assert.equal(item.observed_content_digest_collected, false);
  assert.equal(item.input_verification_completed, false);
  assert.equal(item.input_verification_passed, false);
  assert.equal(item.retry_gate_rerun_completed, false);
  assert.equal(item.retry_gate_rerun_passed, false);
  assert.equal(item.remediation_complete, false);
  assert.equal(item.ready_for_input_collection, true);
  assert.equal(item.ready_for_input_verification, false);
  assert.equal(item.ready_for_retry_gate_rerun, false);
}

assert.equal(pack.remediation_actions_defined, true);
assert.equal(pack.remediation_actions_completed, false);
assert.equal(pack.input_collection_remediation_ready, true);
assert.equal(pack.input_verification_remediation_ready, false);
assert.equal(pack.retry_gate_rerun_ready, false);
assert.equal(pack.public_surface_observation_remediation_completed, false);
assert.equal(pack.observation_inputs_collected, false);
assert.equal(pack.observation_inputs_verified, false);
assert.equal(pack.input_verification_passed, false);
assert.equal(pack.observation_retry_allowed, false);
assert.equal(pack.observation_retry_performed, false);
assert.equal(pack.observation_retry_ready, false);
assert.equal(pack.public_surface_observed, false);
assert.equal(pack.public_surface_observation_ready, false);
assert.equal(pack.public_surface_ready, true);
assert.equal(pack.publication_authorized, true);
assert.equal(pack.publication_authorization_scope_limited, true);
assert.equal(pack.external_customer_ready, false);
assert.equal(pack.banking_pack_ready, false);
assert.equal(pack.level1_launch_ready, false);
assert.equal(pack.production_ready, false);

for (const control of [
  'define_remediation_items_for_each_retry_target',
  'require_public_url_collection',
  'require_observer_ref_collection',
  'require_observed_content_digest_collection',
  'require_input_verification_after_collection',
  'require_retry_gate_rerun_after_verification_pass',
  'do_not_mark_remediation_complete_without_collected_inputs',
  'do_not_mark_verification_ready_without_collection',
  'do_not_rerun_retry_gate_without_verification_pass',
  'do_not_infer_public_observation_from_remediation_pack',
  'do_not_claim_external_customer_delivery_readiness',
  'do_not_claim_banking_pack_readiness',
  'do_not_claim_level1_launch_readiness',
  'do_not_claim_production_readiness',
  'do_not_claim_legal_validity',
  'do_not_claim_security_certification',
  'do_not_authorize_ai_authority',
  'fail_closed_on_incomplete_remediation'
]) assert.equal(pack.remediation_controls.includes(control), true, `${control} must be present`);

assert.equal(pack.remediation_boundary.controlled_information_surface_only, true);
assert.equal(pack.remediation_boundary.remediation_pack_definition_only, true);
assert.equal(pack.remediation_boundary.remediation_pending, true);
assert.equal(pack.remediation_boundary.no_public_observation_recorded, true);
assert.equal(pack.remediation_boundary.no_observation_retry_performed, true);
assert.equal(pack.remediation_boundary.no_remediation_execution_recorded, true);
assert.equal(pack.remediation_boundary.source_retry_gate_required, true);
assert.equal(pack.remediation_boundary.source_input_verification_required, true);
assert.equal(pack.remediation_boundary.no_customer_data, true);
assert.equal(pack.remediation_boundary.no_live_system_control, true);
assert.equal(pack.remediation_boundary.no_production_integration, true);
assert.equal(pack.remediation_boundary.no_legal_validity_claim, true);
assert.equal(pack.remediation_boundary.no_security_certification_claim, true);
assert.equal(pack.remediation_boundary.no_ai_authority_claim, true);

assert.equal(pack.source_retry_gate_evaluated, true);
assert.equal(pack.source_retry_gate_passed, false);
assert.equal(pack.source_retry_gate_blocked_unverified_inputs, true);
assert.equal(pack.source_observation_inputs_collected, false);
assert.equal(pack.source_observation_inputs_verified, false);
assert.equal(pack.source_input_verification_performed, false);
assert.equal(pack.source_input_verification_passed, false);
assert.equal(pack.source_observation_retry_allowed, false);
assert.equal(pack.source_observation_retry_performed, false);
assert.equal(pack.source_observation_retry_ready, false);
assert.equal(pack.source_public_surface_ready, true);
assert.equal(pack.source_publication_authorized, true);
assert.equal(pack.source_publication_authorization_scope_limited, true);

assert.equal(pack.public_surface_observation_remediation_pack_defined, true);
assert.equal(pack.public_surface_observation_remediation_pack_ready, true);
assert.equal(pack.ai_remediation_authority_allowed, false);

assert.equal(pack.observation_remediation_pack_checklist.source_public_surface_observation_retry_gate_hash_valid, true);
assert.equal(pack.observation_remediation_pack_checklist.source_public_surface_observation_retry_gate_evaluated, true);
assert.equal(pack.observation_remediation_pack_checklist.source_public_surface_observation_retry_gate_blocked, true);
assert.equal(pack.observation_remediation_pack_checklist.remediation_actions_defined, true);
assert.equal(pack.observation_remediation_pack_checklist.remediation_actions_completed, false);
assert.equal(pack.observation_remediation_pack_checklist.all_retry_targets_have_remediation_items, true);
assert.equal(pack.observation_remediation_pack_checklist.all_remediation_items_pending, true);
assert.equal(pack.observation_remediation_pack_checklist.all_remediation_items_not_complete, true);
assert.equal(pack.observation_remediation_pack_checklist.input_collection_remediation_ready, true);
assert.equal(pack.observation_remediation_pack_checklist.input_verification_remediation_ready, false);
assert.equal(pack.observation_remediation_pack_checklist.retry_gate_rerun_ready, false);
assert.equal(pack.observation_remediation_pack_checklist.observation_inputs_collected, false);
assert.equal(pack.observation_remediation_pack_checklist.observation_inputs_verified, false);
assert.equal(pack.observation_remediation_pack_checklist.input_verification_passed, false);
assert.equal(pack.observation_remediation_pack_checklist.observation_retry_allowed, false);
assert.equal(pack.observation_remediation_pack_checklist.observation_retry_performed, false);
assert.equal(pack.observation_remediation_pack_checklist.observation_retry_ready, false);
assert.equal(pack.observation_remediation_pack_checklist.public_surface_observed, false);
assert.equal(pack.observation_remediation_pack_checklist.public_observation_ready, false);
assert.equal(pack.observation_remediation_pack_checklist.external_customer_readiness_excluded, true);
assert.equal(pack.observation_remediation_pack_checklist.banking_pack_readiness_excluded, true);
assert.equal(pack.observation_remediation_pack_checklist.launch_readiness_excluded, true);
assert.equal(pack.observation_remediation_pack_checklist.production_readiness_excluded, true);
assert.equal(pack.observation_remediation_pack_checklist.ai_authority_absence_confirmed, true);

assert.equal(pack.public_surface_observation_remediation_pack_is_defined, true);
assert.equal(pack.public_surface_observation_remediation_pack_is_pending_remediation, true);
assert.equal(pack.public_surface_observation_remediation_pack_is_not_remediation_execution, true);
assert.equal(pack.public_surface_observation_remediation_pack_is_not_observation_evidence, true);
assert.equal(pack.public_surface_observation_remediation_pack_is_not_public_observation_ready, true);
assert.equal(pack.public_surface_observation_remediation_pack_is_not_external_customer_readiness, true);
assert.equal(pack.public_surface_observation_remediation_pack_is_not_banking_pack_readiness, true);
assert.equal(pack.public_surface_observation_remediation_pack_is_not_launch_readiness, true);
assert.equal(pack.public_surface_observation_remediation_pack_is_not_production_readiness, true);
assert.equal(pack.public_surface_observation_remediation_pack_is_not_legal_validity, true);
assert.equal(pack.public_surface_observation_remediation_pack_is_not_security_certification, true);
assert.equal(pack.public_surface_observation_remediation_pack_does_not_authorize_ai_authority, true);

assert.equal(doc.readiness_state.public_surface_observation_remediation_pack_defined, true);
assert.equal(doc.readiness_state.public_surface_observation_remediation_pack_ready, true);
assert.equal(doc.readiness_state.source_public_surface_observation_retry_gate_bound, true);
assert.equal(doc.readiness_state.public_surface_observation_retry_gate_evaluated, true);
assert.equal(doc.readiness_state.public_surface_observation_retry_gate_passed, false);
assert.equal(doc.readiness_state.retry_gate_blocked_unverified_inputs, true);
assert.equal(doc.readiness_state.remediation_actions_defined, true);
assert.equal(doc.readiness_state.remediation_actions_completed, false);
assert.equal(doc.readiness_state.input_collection_remediation_ready, true);
assert.equal(doc.readiness_state.input_verification_remediation_ready, false);
assert.equal(doc.readiness_state.retry_gate_rerun_ready, false);
assert.equal(doc.readiness_state.public_surface_observation_remediation_completed, false);
assert.equal(doc.readiness_state.observation_inputs_collected, false);
assert.equal(doc.readiness_state.observation_inputs_verified, false);
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

assert.equal(doc.next_required_program, 'PROG-108-HBCE-LEVEL1-PUBLIC-SURFACE-OBSERVATION-REMEDIATION-EXECUTION');

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

assert.match(md, /LEVEL1_PUBLIC_SURFACE_OBSERVATION_REMEDIATION_PACK_DEFINED_PENDING_REMEDIATION/);
assert.match(md, /The remediation pack is defined/);
assert.match(md, /Remediation actions are not completed/);
assert.match(md, /Input collection remediation is ready/);
assert.match(md, /Input verification remediation is not ready/);
assert.match(md, /Retry gate rerun is not ready/);
assert.match(md, /The public surface observation is not ready/);
assert.match(md, /PROG-108-HBCE-LEVEL1-PUBLIC-SURFACE-OBSERVATION-REMEDIATION-EXECUTION/);

console.log('PASS PROG-107-PUBLIC-SURFACE-OBSERVATION-REMEDIATION-PACK-DOCS-EXIST');
console.log('PASS PROG-107-PUBLIC-SURFACE-OBSERVATION-REMEDIATION-PACK-HASH-STABLE');
console.log('PASS PROG-107-BUILDER-STABLE');
console.log('PASS PROG-107-SOURCE-PROG-106-INTEGRITY-VALID');
console.log('PASS PROG-107-REMEDIATION-ITEMS-DEFINED');
console.log('PASS PROG-107-REMEDIATION-ACTIONS-DEFINED');
console.log('PASS PROG-107-REMEDIATION-ACTIONS-NOT-COMPLETED');
console.log('PASS PROG-107-INPUT-COLLECTION-REMEDIATION-READY');
console.log('PASS PROG-107-INPUT-VERIFICATION-REMEDIATION-NOT-READY');
console.log('PASS PROG-107-RETRY-GATE-RERUN-NOT-READY');
console.log('PASS PROG-107-AI-REMEDIATION-AUTHORITY-DISALLOWED');
console.log('PASS PROG-107-NEXT-PROG-108-RECORDED');
console.log('PASS PROG-107-NO-UNSUPPORTED-READINESS-CLAIMS');
