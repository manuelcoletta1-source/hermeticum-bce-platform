'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { sha256Digest } = require('../../../packages/hbce-core/canonical-json.js');
const {
  STATUS,
  SOURCE_REF,
  buildReleaseManifestPayload,
  buildLevel1PublicSurfaceReleaseManifest
} = require('../../../runtime/level1/build-prog-100-level1-public-surface-release-manifest.js');

const root = path.resolve(__dirname, '../../..');
const read = (p) => fs.readFileSync(path.join(root, p), 'utf8');
const json = (p) => JSON.parse(read(p));
const exists = (p) => fs.existsSync(path.join(root, p));

const docPath = 'docs/launch/level1/prog-100-level1-public-surface-release-manifest.json';
const mdPath = 'docs/launch/level1/prog-100-level1-public-surface-release-manifest.md';
const runtimePath = 'runtime/level1/build-prog-100-level1-public-surface-release-manifest.js';

for (const p of [docPath, mdPath, runtimePath, SOURCE_REF]) assert.equal(exists(p), true, `${p} must exist`);

const doc = json(docPath);
const md = read(mdPath);
const source = json(SOURCE_REF);

assert.equal(doc.proto, 'HBCE-L1-PROG-100-PUBLIC-SURFACE-RELEASE-MANIFEST-v1');
assert.equal(doc.kind, 'HBCE_LEVEL1_PUBLIC_SURFACE_RELEASE_MANIFEST');
assert.equal(doc.issue_id, 'PROG-100');
assert.equal(doc.level1_public_surface_release_manifest_status, STATUS);
assert.equal(doc.source_public_surface_registry_entry_revision_hash, source.revision_hash);
assert.equal(doc.source_public_surface_registry_entry_revision_hash_valid, true);

const regenerated = buildLevel1PublicSurfaceReleaseManifest({ rootDir: root, repositoryCommit: doc.repository_baseline_commit });
assert.deepEqual(regenerated, doc);

const body = { ...doc };
delete body.revision_hash;
assert.equal(doc.revision_hash, sha256Digest(body));

assert.equal(doc.inherited_public_surface_registry_entry.registry_entry_status, 'LEVEL1_PUBLIC_SURFACE_REGISTRY_ENTRY_DEFINED_CONTROLLED_INFORMATION_ONLY');
assert.equal(doc.inherited_public_surface_registry_entry.public_surface_registry_entry_ready, true);
assert.equal(doc.inherited_public_surface_registry_entry.public_surface_ready, true);
assert.equal(doc.inherited_public_surface_registry_entry.publication_authorized, true);
assert.equal(doc.inherited_public_surface_registry_entry.publication_authorization_scope, 'controlled_public_information_surface_only');
assert.equal(doc.inherited_public_surface_registry_entry.prior_public_surface_release_manifest_ready, false);
assert.equal(doc.inherited_public_surface_registry_entry.prior_external_customer_ready, false);
assert.equal(doc.inherited_public_surface_registry_entry.prior_banking_pack_ready, false);
assert.equal(doc.inherited_public_surface_registry_entry.prior_level1_launch_ready, false);
assert.equal(doc.inherited_public_surface_registry_entry.prior_production_ready, false);

const expectedPayload = buildReleaseManifestPayload(source);
const manifest = doc.public_surface_release_manifest;

assert.equal(manifest.public_surface_release_manifest_payload_digest, sha256Digest(expectedPayload));
assert.equal(manifest.public_surface_release_manifest_id, 'PUBLIC-SURFACE-RELEASE-MANIFEST::HBCE-L1-DECISION-PROOF-0001');
assert.equal(manifest.release_manifest_key, 'hbce.level1.public_surface.release_manifest.controlled_information.0001');
assert.equal(manifest.source_public_surface_registry_entry_ref, SOURCE_REF);
assert.equal(manifest.source_public_surface_registry_entry_digest, source.public_surface_registry_entry.public_surface_registry_entry_payload_digest);
assert.equal(manifest.release_scope, 'LEVEL1_DECISION_PROOF_PUBLIC_SURFACE_CONTROLLED_INFORMATION_ONLY');
assert.equal(manifest.release_status, 'RELEASE_MANIFEST_DEFINED_CONTROLLED_INFORMATION_ONLY');
assert.equal(manifest.release_mode, 'PUBLIC_INFORMATION_SURFACE_RELEASE_MANIFEST');
assert.equal(manifest.publication_authorization_scope, 'controlled_public_information_surface_only');

assert.deepEqual(manifest.released_surface_types, ['public_website', 'public_one_pager', 'public_intro_deck', 'public_contact_or_intake_page']);
assert.equal(manifest.released_surface_count, 4);
assert.equal(manifest.release_surfaces.length, 4);
assert.equal(manifest.required_release_source_count, 7);
assert.equal(manifest.registry_entry_ready, true);
assert.equal(manifest.public_surface_ready_at_source, true);
assert.equal(manifest.publication_authorized_at_source, true);
assert.equal(manifest.publication_authorization_scope_limited_at_source, true);
assert.equal(manifest.all_registered_surfaces_in_manifest, true);
assert.equal(manifest.all_manifest_surfaces_authorized, true);
assert.equal(manifest.all_manifest_surfaces_ready_for_controlled_publication, true);
assert.equal(manifest.all_manifest_surface_boundaries_preserved, true);

for (const surface of manifest.release_surfaces) {
  assert.match(surface.release_surface_id, /^PUBLIC-SURFACE-RELEASE::HBCE-L1::/);
  assert.match(surface.registry_surface_id, /^PUBLIC-SURFACE::HBCE-L1::/);
  assert.equal(surface.publication_authorized, true);
  assert.equal(surface.authorization_scope, 'controlled_public_information_surface_only');
  assert.equal(surface.ready_for_controlled_publication, true);
  assert.equal(surface.included_in_release_manifest, true);
  assert.equal(surface.release_manifest_expands_scope, false);
  assert.equal(surface.customer_data_allowed, false);
  assert.equal(surface.customer_logo_allowed_without_authorization, false);
  assert.equal(surface.legal_validity_claim_allowed, false);
  assert.equal(surface.public_accreditation_claim_allowed, false);
  assert.equal(surface.procurement_eligibility_claim_allowed, false);
  assert.equal(surface.security_certification_claim_allowed, false);
  assert.equal(surface.ai_authority_claim_allowed, false);
  assert.equal(surface.external_customer_delivery_claim_allowed, false);
  assert.equal(surface.banking_pack_claim_allowed, false);
  assert.equal(surface.level1_launch_claim_allowed, false);
  assert.equal(surface.production_claim_allowed, false);
}

assert.equal(manifest.approved_public_surface_claims_release_manifest.public_surface_ready_controlled_information_only, true);
assert.equal(manifest.approved_public_surface_claims_release_manifest.publication_authorized_for_controlled_public_information_surface, true);
assert.equal(manifest.blocked_claims_release_manifest.external_customer_delivery_ready, true);
assert.equal(manifest.blocked_claims_release_manifest.banking_pack_ready, true);
assert.equal(manifest.blocked_claims_release_manifest.level1_launch_ready, true);
assert.equal(manifest.blocked_claims_release_manifest.production_ready, true);
assert.equal(manifest.blocked_claims_release_manifest.legal_validity, true);
assert.equal(manifest.blocked_claims_release_manifest.security_certification, true);
assert.equal(manifest.blocked_claims_release_manifest.ai_authority, true);

for (const control of [
  'release_only_registered_surface_types',
  'preserve_controlled_public_information_scope',
  'preserve_registry_entry_hash',
  'preserve_publication_snapshot_hash',
  'preserve_publication_source_references',
  'preserve_non_claims_near_positive_claims',
  'do_not_add_customer_data',
  'do_not_add_customer_logos_without_authorization',
  'do_not_claim_external_customer_delivery_readiness',
  'do_not_claim_banking_pack_readiness',
  'do_not_claim_level1_launch_readiness',
  'do_not_claim_production_readiness',
  'do_not_claim_legal_validity',
  'do_not_claim_security_certification',
  'do_not_authorize_ai_authority',
  'fail_closed_on_release_manifest_delta'
]) {
  assert.equal(manifest.release_manifest_controls.includes(control), true, `${control} must be present`);
}

assert.equal(manifest.release_manifest_boundary.controlled_information_surface_only, true);
assert.equal(manifest.release_manifest_boundary.release_manifest_only, true);
assert.equal(manifest.release_manifest_boundary.source_registry_entry_required, true);
assert.equal(manifest.release_manifest_boundary.source_publication_snapshot_required, true);
assert.equal(manifest.release_manifest_boundary.source_readiness_gate_required, true);
assert.equal(manifest.release_manifest_boundary.source_evidence_index_required, true);
assert.equal(manifest.release_manifest_boundary.source_copy_pack_required, true);
assert.equal(manifest.release_manifest_boundary.source_content_model_required, true);
assert.equal(manifest.release_manifest_boundary.source_scope_lock_required, true);
assert.equal(manifest.release_manifest_boundary.public_observation_not_recorded, true);
assert.equal(manifest.release_manifest_boundary.synthetic_demo_boundary_preserved, true);
assert.equal(manifest.release_manifest_boundary.no_customer_data, true);
assert.equal(manifest.release_manifest_boundary.no_live_system_control, true);
assert.equal(manifest.release_manifest_boundary.no_production_integration, true);
assert.equal(manifest.release_manifest_boundary.no_legal_validity_claim, true);
assert.equal(manifest.release_manifest_boundary.no_security_certification_claim, true);
assert.equal(manifest.release_manifest_boundary.no_ai_authority_claim, true);
assert.equal(manifest.release_manifest_boundary.no_customer_logo_without_authorization, true);

assert.equal(manifest.source_public_surface_registry_entry_ready, true);
assert.equal(manifest.source_public_surface_ready, true);
assert.equal(manifest.source_publication_authorized, true);
assert.equal(manifest.source_publication_authorization_scope_limited, true);
assert.equal(manifest.public_surface_release_manifest_ready, true);
assert.equal(manifest.public_surface_ready, true);
assert.equal(manifest.publication_authorized, true);
assert.equal(manifest.publication_authorization_scope_limited, true);
assert.equal(manifest.public_surface_observation_ready, false);
assert.equal(manifest.external_customer_ready, false);
assert.equal(manifest.banking_pack_ready, false);
assert.equal(manifest.level1_launch_ready, false);
assert.equal(manifest.production_ready, false);
assert.equal(manifest.ai_release_manifest_authority_allowed, false);

assert.equal(manifest.release_manifest_checklist.source_public_surface_registry_entry_hash_valid, true);
assert.equal(manifest.release_manifest_checklist.source_public_surface_registry_entry_ready, true);
assert.equal(manifest.release_manifest_checklist.source_public_surface_ready, true);
assert.equal(manifest.release_manifest_checklist.source_publication_authorized, true);
assert.equal(manifest.release_manifest_checklist.source_publication_authorization_scope_limited, true);
assert.equal(manifest.release_manifest_checklist.all_registered_surfaces_in_manifest, true);
assert.equal(manifest.release_manifest_checklist.all_manifest_surfaces_authorized, true);
assert.equal(manifest.release_manifest_checklist.all_manifest_surfaces_ready_for_controlled_publication, true);
assert.equal(manifest.release_manifest_checklist.all_manifest_surface_boundaries_preserved, true);
assert.equal(manifest.release_manifest_checklist.blocked_claims_preserved, true);
assert.equal(manifest.release_manifest_checklist.public_observation_not_recorded, true);
assert.equal(manifest.release_manifest_checklist.external_customer_readiness_excluded, true);
assert.equal(manifest.release_manifest_checklist.banking_pack_readiness_excluded, true);
assert.equal(manifest.release_manifest_checklist.launch_readiness_excluded, true);
assert.equal(manifest.release_manifest_checklist.production_readiness_excluded, true);
assert.equal(manifest.release_manifest_checklist.ai_authority_absence_confirmed, true);

assert.equal(manifest.public_surface_release_manifest_defined, true);
assert.equal(manifest.public_surface_release_manifest_is_controlled_information_only, true);
assert.equal(manifest.public_surface_release_manifest_is_not_public_observation, true);
assert.equal(manifest.public_surface_release_manifest_is_not_external_customer_readiness, true);
assert.equal(manifest.public_surface_release_manifest_is_not_banking_pack_readiness, true);
assert.equal(manifest.public_surface_release_manifest_is_not_launch_readiness, true);
assert.equal(manifest.public_surface_release_manifest_is_not_production_readiness, true);
assert.equal(manifest.public_surface_release_manifest_is_not_legal_validity, true);
assert.equal(manifest.public_surface_release_manifest_is_not_security_certification, true);
assert.equal(manifest.public_surface_release_manifest_does_not_authorize_ai_authority, true);

for (const code of [
  'PUBLIC_SURFACE_RELEASE_MANIFEST_MISSING',
  'SOURCE_PUBLIC_SURFACE_REGISTRY_ENTRY_HASH_INVALID',
  'PUBLIC_SURFACE_REGISTRY_ENTRY_NOT_READY',
  'PUBLICATION_NOT_AUTHORIZED',
  'PUBLICATION_AUTHORIZATION_SCOPE_NOT_LIMITED',
  'REGISTERED_SURFACE_NOT_IN_RELEASE_MANIFEST',
  'MANIFEST_SURFACE_NOT_AUTHORIZED',
  'MANIFEST_SURFACE_BOUNDARY_NOT_PRESERVED',
  'UNSUPPORTED_PUBLIC_OBSERVATION_CLAIM',
  'UNSUPPORTED_EXTERNAL_CUSTOMER_READINESS_CLAIM',
  'UNSUPPORTED_BANKING_READINESS_CLAIM',
  'UNSUPPORTED_LAUNCH_READINESS_CLAIM',
  'UNSUPPORTED_PRODUCTION_READINESS_CLAIM',
  'AI_RELEASE_MANIFEST_AUTHORITY_CLAIM_BLOCKED'
]) {
  assert.equal(doc.fail_closed_codes.includes(code), true, `${code} must be present`);
}

assert.equal(doc.readiness_state.public_surface_release_manifest_defined, true);
assert.equal(doc.readiness_state.public_surface_release_manifest_ready, true);
assert.equal(doc.readiness_state.source_public_surface_registry_entry_bound, true);
assert.equal(doc.readiness_state.public_surface_registry_entry_ready, true);
assert.equal(doc.readiness_state.public_surface_ready, true);
assert.equal(doc.readiness_state.publication_authorized, true);
assert.equal(doc.readiness_state.publication_authorization_scope, 'controlled_public_information_surface_only');
assert.equal(doc.readiness_state.publication_authorization_scope_limited, true);
assert.equal(doc.readiness_state.all_registered_surfaces_in_manifest, true);
assert.equal(doc.readiness_state.all_manifest_surfaces_authorized, true);
assert.equal(doc.readiness_state.all_manifest_surfaces_ready_for_controlled_publication, true);
assert.equal(doc.readiness_state.all_manifest_surface_boundaries_preserved, true);
assert.equal(doc.readiness_state.public_surface_observation_ready, false);
assert.equal(doc.readiness_state.external_customer_ready, false);
assert.equal(doc.readiness_state.banking_pack_ready, false);
assert.equal(doc.readiness_state.level1_launch_ready, false);
assert.equal(doc.readiness_state.production_ready, false);

assert.equal(doc.next_required_program, 'PROG-101-HBCE-LEVEL1-PUBLIC-SURFACE-OBSERVATION-RECORD');

assert.equal(doc.non_claims.legal_validity, false);
assert.equal(doc.non_claims.public_accreditation, false);
assert.equal(doc.non_claims.procurement_eligibility, false);
assert.equal(doc.non_claims.external_effect_proven, false);
assert.equal(doc.non_claims.business_success, false);
assert.equal(doc.non_claims.ai_authority, false);
assert.equal(doc.non_claims.autonomous_authority, false);
assert.equal(doc.non_claims.public_surface_observation_ready, false);
assert.equal(doc.non_claims.external_customer_ready, false);
assert.equal(doc.non_claims.banking_pack_ready, false);
assert.equal(doc.non_claims.level1_launch_ready, false);
assert.equal(doc.non_claims.production_ready, false);

assert.match(md, /LEVEL1_PUBLIC_SURFACE_RELEASE_MANIFEST_DEFINED_CONTROLLED_INFORMATION_ONLY/);
assert.match(md, /The public surface release manifest is defined/);
assert.match(md, /The public surface release manifest is ready/);
assert.match(md, /The public surface observation record is not ready/);
assert.match(md, /The release manifest must release only registered surface types/);
assert.match(md, /The release manifest must not create production readiness/);
assert.match(md, /PROG-101-HBCE-LEVEL1-PUBLIC-SURFACE-OBSERVATION-RECORD/);

console.log('PASS PROG-100-PUBLIC-SURFACE-RELEASE-MANIFEST-DOCS-EXIST');
console.log('PASS PROG-100-PUBLIC-SURFACE-RELEASE-MANIFEST-HASH-STABLE');
console.log('PASS PROG-100-BUILDER-STABLE');
console.log('PASS PROG-100-SOURCE-PROG-099-INTEGRITY-VALID');
console.log('PASS PROG-100-REGISTERED-SURFACES-IN-MANIFEST');
console.log('PASS PROG-100-MANIFEST-SURFACES-BOUNDARY-PRESERVED');
console.log('PASS PROG-100-RELEASE-MANIFEST-READY');
console.log('PASS PROG-100-PUBLIC-OBSERVATION-NOT-READY');
console.log('PASS PROG-100-AI-RELEASE-MANIFEST-AUTHORITY-DISALLOWED');
console.log('PASS PROG-100-NEXT-PROG-101-RECORDED');
console.log('PASS PROG-100-NO-UNSUPPORTED-READINESS-CLAIMS');
