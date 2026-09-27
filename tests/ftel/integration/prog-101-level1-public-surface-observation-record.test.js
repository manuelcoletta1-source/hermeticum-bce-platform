'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { sha256Digest } = require('../../../packages/hbce-core/canonical-json.js');
const {
  STATUS,
  SOURCE_REF,
  buildObservationRecordPayload,
  buildLevel1PublicSurfaceObservationRecord
} = require('../../../runtime/level1/build-prog-101-level1-public-surface-observation-record.js');

const root = path.resolve(__dirname, '../../..');
const read = (p) => fs.readFileSync(path.join(root, p), 'utf8');
const json = (p) => JSON.parse(read(p));
const exists = (p) => fs.existsSync(path.join(root, p));

const docPath = 'docs/launch/level1/prog-101-level1-public-surface-observation-record.json';
const mdPath = 'docs/launch/level1/prog-101-level1-public-surface-observation-record.md';
const runtimePath = 'runtime/level1/build-prog-101-level1-public-surface-observation-record.js';

for (const p of [docPath, mdPath, runtimePath, SOURCE_REF]) assert.equal(exists(p), true, `${p} must exist`);

const doc = json(docPath);
const md = read(mdPath);
const source = json(SOURCE_REF);

assert.equal(doc.proto, 'HBCE-L1-PROG-101-PUBLIC-SURFACE-OBSERVATION-RECORD-v1');
assert.equal(doc.kind, 'HBCE_LEVEL1_PUBLIC_SURFACE_OBSERVATION_RECORD');
assert.equal(doc.issue_id, 'PROG-101');
assert.equal(doc.level1_public_surface_observation_record_status, STATUS);
assert.equal(doc.source_public_surface_release_manifest_revision_hash, source.revision_hash);
assert.equal(doc.source_public_surface_release_manifest_revision_hash_valid, true);

const regenerated = buildLevel1PublicSurfaceObservationRecord({ rootDir: root, repositoryCommit: doc.repository_baseline_commit });
assert.deepEqual(regenerated, doc);

const body = { ...doc };
delete body.revision_hash;
assert.equal(doc.revision_hash, sha256Digest(body));

assert.equal(doc.inherited_public_surface_release_manifest.release_manifest_status, 'LEVEL1_PUBLIC_SURFACE_RELEASE_MANIFEST_DEFINED_CONTROLLED_INFORMATION_ONLY');
assert.equal(doc.inherited_public_surface_release_manifest.public_surface_release_manifest_ready, true);
assert.equal(doc.inherited_public_surface_release_manifest.public_surface_ready, true);
assert.equal(doc.inherited_public_surface_release_manifest.publication_authorized, true);
assert.equal(doc.inherited_public_surface_release_manifest.publication_authorization_scope, 'controlled_public_information_surface_only');
assert.equal(doc.inherited_public_surface_release_manifest.prior_public_surface_observation_ready, false);
assert.equal(doc.inherited_public_surface_release_manifest.prior_external_customer_ready, false);
assert.equal(doc.inherited_public_surface_release_manifest.prior_banking_pack_ready, false);
assert.equal(doc.inherited_public_surface_release_manifest.prior_level1_launch_ready, false);
assert.equal(doc.inherited_public_surface_release_manifest.prior_production_ready, false);

const expectedPayload = buildObservationRecordPayload(source);
const record = doc.public_surface_observation_record;

assert.equal(record.public_surface_observation_record_payload_digest, sha256Digest(expectedPayload));
assert.equal(record.public_surface_observation_record_id, 'PUBLIC-SURFACE-OBSERVATION-RECORD::HBCE-L1-DECISION-PROOF-0001');
assert.equal(record.observation_record_key, 'hbce.level1.public_surface.observation_record.controlled_information.0001');
assert.equal(record.source_public_surface_release_manifest_ref, SOURCE_REF);
assert.equal(record.source_public_surface_release_manifest_digest, source.public_surface_release_manifest.public_surface_release_manifest_payload_digest);
assert.equal(record.observation_scope, 'LEVEL1_DECISION_PROOF_PUBLIC_SURFACE_CONTROLLED_INFORMATION_ONLY');
assert.equal(record.observation_status, 'DEFINED_NOT_OBSERVED');
assert.equal(record.observation_mode, 'PUBLIC_INFORMATION_SURFACE_OBSERVATION_RECORD');
assert.equal(record.publication_authorization_scope, 'controlled_public_information_surface_only');

assert.deepEqual(record.required_observation_surface_types, ['public_website', 'public_one_pager', 'public_intro_deck', 'public_contact_or_intake_page']);
assert.equal(record.required_observation_surface_count, 4);
assert.equal(record.observation_target_count, 4);
assert.equal(record.observation_targets.length, 4);
assert.equal(record.public_observation_inputs_present, false);
assert.equal(record.all_release_surfaces_have_observation_targets, true);
assert.equal(record.all_observation_targets_unobserved, true);
assert.equal(record.all_observation_targets_without_public_url, true);
assert.equal(record.all_observation_targets_without_content_digest, true);
assert.equal(record.all_observation_claims_absent, true);
assert.equal(record.all_forbidden_claims_absent_from_record, true);

for (const input of [
  'public_url',
  'observed_at',
  'observer_ref',
  'observation_method',
  'observed_content_digest',
  'observed_scope_match_result',
  'observed_non_claims_presence_result',
  'observed_evidence_reference_presence_result'
]) {
  assert.equal(record.public_observation_inputs_required.includes(input), true, `${input} must be required`);
}

for (const target of record.observation_targets) {
  assert.match(target.observation_target_id, /^PUBLIC-SURFACE-OBSERVATION-TARGET::HBCE-L1::/);
  assert.equal(target.observation_required, true);
  assert.equal(target.observation_status, 'NOT_OBSERVED');
  assert.equal(target.public_url, null);
  assert.equal(target.observed_at, null);
  assert.equal(target.observer_ref, null);
  assert.equal(target.observation_method, null);
  assert.equal(target.observed_content_digest, null);
  assert.equal(target.observed_surface_available, false);
  assert.equal(target.observed_scope_matches_manifest, false);
  assert.equal(target.observed_non_claims_present, false);
  assert.equal(target.observed_evidence_references_present, false);
  assert.equal(target.customer_data_observed, false);
  assert.equal(target.customer_logo_observed_without_authorization, false);
  assert.equal(target.legal_validity_claim_observed, false);
  assert.equal(target.public_accreditation_claim_observed, false);
  assert.equal(target.procurement_eligibility_claim_observed, false);
  assert.equal(target.security_certification_claim_observed, false);
  assert.equal(target.ai_authority_claim_observed, false);
  assert.equal(target.external_customer_delivery_claim_observed, false);
  assert.equal(target.banking_pack_claim_observed, false);
  assert.equal(target.level1_launch_claim_observed, false);
  assert.equal(target.production_claim_observed, false);
}

for (const control of [
  'define_observation_targets_only',
  'require_public_url_before_observation',
  'require_observer_ref_before_observation',
  'require_observed_content_digest_before_observation',
  'require_scope_match_before_public_observation_ready',
  'require_non_claims_presence_before_public_observation_ready',
  'require_evidence_references_before_public_observation_ready',
  'do_not_infer_public_observation_from_release_manifest',
  'do_not_claim_external_customer_delivery_readiness',
  'do_not_claim_banking_pack_readiness',
  'do_not_claim_level1_launch_readiness',
  'do_not_claim_production_readiness',
  'do_not_claim_legal_validity',
  'do_not_claim_security_certification',
  'do_not_authorize_ai_authority',
  'fail_closed_on_missing_observation_input'
]) {
  assert.equal(record.observation_record_controls.includes(control), true, `${control} must be present`);
}

assert.equal(record.observation_record_boundary.controlled_information_surface_only, true);
assert.equal(record.observation_record_boundary.observation_record_definition_only, true);
assert.equal(record.observation_record_boundary.no_public_observation_recorded, true);
assert.equal(record.observation_record_boundary.source_release_manifest_required, true);
assert.equal(record.observation_record_boundary.no_customer_data, true);
assert.equal(record.observation_record_boundary.no_live_system_control, true);
assert.equal(record.observation_record_boundary.no_production_integration, true);
assert.equal(record.observation_record_boundary.no_legal_validity_claim, true);
assert.equal(record.observation_record_boundary.no_security_certification_claim, true);
assert.equal(record.observation_record_boundary.no_ai_authority_claim, true);
assert.equal(record.observation_record_boundary.no_customer_logo_without_authorization, true);

assert.equal(record.source_public_surface_release_manifest_ready, true);
assert.equal(record.source_public_surface_ready, true);
assert.equal(record.source_publication_authorized, true);
assert.equal(record.source_publication_authorization_scope_limited, true);
assert.equal(record.public_surface_observation_record_defined, true);
assert.equal(record.public_surface_observation_record_ready, true);
assert.equal(record.public_surface_observed, false);
assert.equal(record.public_surface_observation_ready, false);
assert.equal(record.public_surface_ready, true);
assert.equal(record.publication_authorized, true);
assert.equal(record.publication_authorization_scope_limited, true);
assert.equal(record.external_customer_ready, false);
assert.equal(record.banking_pack_ready, false);
assert.equal(record.level1_launch_ready, false);
assert.equal(record.production_ready, false);
assert.equal(record.ai_observation_record_authority_allowed, false);

assert.equal(record.observation_record_checklist.source_public_surface_release_manifest_hash_valid, true);
assert.equal(record.observation_record_checklist.source_public_surface_release_manifest_ready, true);
assert.equal(record.observation_record_checklist.source_public_surface_ready, true);
assert.equal(record.observation_record_checklist.source_publication_authorized, true);
assert.equal(record.observation_record_checklist.source_publication_authorization_scope_limited, true);
assert.equal(record.observation_record_checklist.all_release_surfaces_have_observation_targets, true);
assert.equal(record.observation_record_checklist.all_observation_targets_unobserved, true);
assert.equal(record.observation_record_checklist.all_observation_targets_without_public_url, true);
assert.equal(record.observation_record_checklist.all_observation_targets_without_content_digest, true);
assert.equal(record.observation_record_checklist.all_observation_claims_absent, true);
assert.equal(record.observation_record_checklist.all_forbidden_claims_absent_from_record, true);
assert.equal(record.observation_record_checklist.public_observation_inputs_required, true);
assert.equal(record.observation_record_checklist.public_observation_inputs_present, false);
assert.equal(record.observation_record_checklist.public_surface_observed, false);
assert.equal(record.observation_record_checklist.public_observation_ready, false);
assert.equal(record.observation_record_checklist.external_customer_readiness_excluded, true);
assert.equal(record.observation_record_checklist.banking_pack_readiness_excluded, true);
assert.equal(record.observation_record_checklist.launch_readiness_excluded, true);
assert.equal(record.observation_record_checklist.production_readiness_excluded, true);
assert.equal(record.observation_record_checklist.ai_authority_absence_confirmed, true);

assert.equal(record.public_surface_observation_record_is_defined, true);
assert.equal(record.public_surface_observation_record_is_not_observation_evidence, true);
assert.equal(record.public_surface_observation_record_is_not_public_observation_ready, true);
assert.equal(record.public_surface_observation_record_is_not_external_customer_readiness, true);
assert.equal(record.public_surface_observation_record_is_not_banking_pack_readiness, true);
assert.equal(record.public_surface_observation_record_is_not_launch_readiness, true);
assert.equal(record.public_surface_observation_record_is_not_production_readiness, true);
assert.equal(record.public_surface_observation_record_is_not_legal_validity, true);
assert.equal(record.public_surface_observation_record_is_not_security_certification, true);
assert.equal(record.public_surface_observation_record_does_not_authorize_ai_authority, true);

for (const code of [
  'PUBLIC_SURFACE_OBSERVATION_RECORD_MISSING',
  'SOURCE_PUBLIC_SURFACE_RELEASE_MANIFEST_HASH_INVALID',
  'PUBLIC_SURFACE_RELEASE_MANIFEST_NOT_READY',
  'OBSERVATION_TARGET_MISSING',
  'PUBLIC_URL_MISSING',
  'OBSERVER_REF_MISSING',
  'OBSERVED_CONTENT_DIGEST_MISSING',
  'OBSERVED_SCOPE_MATCH_MISSING',
  'OBSERVED_NON_CLAIMS_PRESENCE_MISSING',
  'OBSERVED_EVIDENCE_REFERENCES_MISSING',
  'UNSUPPORTED_PUBLIC_OBSERVATION_READY_CLAIM',
  'UNSUPPORTED_EXTERNAL_CUSTOMER_READINESS_CLAIM',
  'UNSUPPORTED_BANKING_READINESS_CLAIM',
  'UNSUPPORTED_LAUNCH_READINESS_CLAIM',
  'UNSUPPORTED_PRODUCTION_READINESS_CLAIM',
  'AI_OBSERVATION_RECORD_AUTHORITY_CLAIM_BLOCKED'
]) {
  assert.equal(doc.fail_closed_codes.includes(code), true, `${code} must be present`);
}

assert.equal(doc.readiness_state.public_surface_observation_record_defined, true);
assert.equal(doc.readiness_state.public_surface_observation_record_ready, true);
assert.equal(doc.readiness_state.source_public_surface_release_manifest_bound, true);
assert.equal(doc.readiness_state.public_surface_release_manifest_ready, true);
assert.equal(doc.readiness_state.public_surface_ready, true);
assert.equal(doc.readiness_state.publication_authorized, true);
assert.equal(doc.readiness_state.publication_authorization_scope, 'controlled_public_information_surface_only');
assert.equal(doc.readiness_state.publication_authorization_scope_limited, true);
assert.equal(doc.readiness_state.all_release_surfaces_have_observation_targets, true);
assert.equal(doc.readiness_state.all_observation_targets_unobserved, true);
assert.equal(doc.readiness_state.all_observation_targets_without_public_url, true);
assert.equal(doc.readiness_state.all_observation_targets_without_content_digest, true);
assert.equal(doc.readiness_state.all_observation_claims_absent, true);
assert.equal(doc.readiness_state.all_forbidden_claims_absent_from_record, true);
assert.equal(doc.readiness_state.public_surface_observed, false);
assert.equal(doc.readiness_state.public_surface_observation_ready, false);
assert.equal(doc.readiness_state.external_customer_ready, false);
assert.equal(doc.readiness_state.banking_pack_ready, false);
assert.equal(doc.readiness_state.level1_launch_ready, false);
assert.equal(doc.readiness_state.production_ready, false);

assert.equal(doc.next_required_program, 'PROG-102-HBCE-LEVEL1-PUBLIC-SURFACE-OBSERVATION-GATE');

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

assert.match(md, /LEVEL1_PUBLIC_SURFACE_OBSERVATION_RECORD_DEFINED_NOT_OBSERVED/);
assert.match(md, /The public surface observation record is defined/);
assert.match(md, /The public surface is not observed/);
assert.match(md, /The public surface observation is not ready/);
assert.match(md, /public URL/);
assert.match(md, /observed content digest/);
assert.match(md, /The observation record must not infer public observation from the release manifest/);
assert.match(md, /PROG-102-HBCE-LEVEL1-PUBLIC-SURFACE-OBSERVATION-GATE/);

console.log('PASS PROG-101-PUBLIC-SURFACE-OBSERVATION-RECORD-DOCS-EXIST');
console.log('PASS PROG-101-PUBLIC-SURFACE-OBSERVATION-RECORD-HASH-STABLE');
console.log('PASS PROG-101-BUILDER-STABLE');
console.log('PASS PROG-101-SOURCE-PROG-100-INTEGRITY-VALID');
console.log('PASS PROG-101-OBSERVATION-TARGETS-DEFINED');
console.log('PASS PROG-101-PUBLIC-OBSERVATION-NOT-RECORDED');
console.log('PASS PROG-101-PUBLIC-OBSERVATION-NOT-READY');
console.log('PASS PROG-101-OBSERVATION-INPUTS-REQUIRED');
console.log('PASS PROG-101-AI-OBSERVATION-RECORD-AUTHORITY-DISALLOWED');
console.log('PASS PROG-101-NEXT-PROG-102-RECORDED');
console.log('PASS PROG-101-NO-UNSUPPORTED-READINESS-CLAIMS');
