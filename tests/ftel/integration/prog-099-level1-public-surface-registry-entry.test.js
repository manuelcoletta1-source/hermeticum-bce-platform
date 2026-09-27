'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { sha256Digest } = require('../../../packages/hbce-core/canonical-json.js');
const {
  STATUS,
  SOURCE_REF,
  registrySurfaceId,
  buildPublicSurfaceRegistryEntryPayload,
  buildLevel1PublicSurfaceRegistryEntry
} = require('../../../runtime/level1/build-prog-099-level1-public-surface-registry-entry.js');

const root = path.resolve(__dirname, '../../..');
const read = (p) => fs.readFileSync(path.join(root, p), 'utf8');
const json = (p) => JSON.parse(read(p));
const exists = (p) => fs.existsSync(path.join(root, p));

const docPath = 'docs/launch/level1/prog-099-level1-public-surface-registry-entry.json';
const mdPath = 'docs/launch/level1/prog-099-level1-public-surface-registry-entry.md';
const runtimePath = 'runtime/level1/build-prog-099-level1-public-surface-registry-entry.js';

for (const p of [docPath, mdPath, runtimePath, SOURCE_REF]) assert.equal(exists(p), true, `${p} must exist`);

const doc = json(docPath);
const md = read(mdPath);
const source = json(SOURCE_REF);

assert.equal(doc.proto, 'HBCE-L1-PROG-099-PUBLIC-SURFACE-REGISTRY-ENTRY-v1');
assert.equal(doc.kind, 'HBCE_LEVEL1_PUBLIC_SURFACE_REGISTRY_ENTRY');
assert.equal(doc.issue_id, 'PROG-099');
assert.equal(doc.level1_public_surface_registry_entry_status, STATUS);
assert.equal(doc.source_public_surface_publication_snapshot_revision_hash, source.revision_hash);
assert.equal(doc.source_public_surface_publication_snapshot_revision_hash_valid, true);

const regenerated = buildLevel1PublicSurfaceRegistryEntry({ rootDir: root, repositoryCommit: doc.repository_baseline_commit });
assert.deepEqual(regenerated, doc);

const body = { ...doc };
delete body.revision_hash;
assert.equal(doc.revision_hash, sha256Digest(body));

assert.equal(doc.inherited_public_surface_publication_snapshot.publication_snapshot_status, 'LEVEL1_PUBLIC_SURFACE_PUBLICATION_SNAPSHOT_DEFINED_CONTROLLED_INFORMATION_ONLY');
assert.equal(doc.inherited_public_surface_publication_snapshot.public_surface_publication_snapshot_ready, true);
assert.equal(doc.inherited_public_surface_publication_snapshot.public_surface_ready, true);
assert.equal(doc.inherited_public_surface_publication_snapshot.publication_authorized, true);
assert.equal(doc.inherited_public_surface_publication_snapshot.publication_authorization_scope, 'controlled_public_information_surface_only');
assert.equal(doc.inherited_public_surface_publication_snapshot.prior_public_surface_registry_entry_ready, false);
assert.equal(doc.inherited_public_surface_publication_snapshot.prior_external_customer_ready, false);
assert.equal(doc.inherited_public_surface_publication_snapshot.prior_banking_pack_ready, false);
assert.equal(doc.inherited_public_surface_publication_snapshot.prior_level1_launch_ready, false);
assert.equal(doc.inherited_public_surface_publication_snapshot.prior_production_ready, false);

const expectedPayload = buildPublicSurfaceRegistryEntryPayload(source);
const entry = doc.public_surface_registry_entry;

assert.equal(entry.public_surface_registry_entry_payload_digest, sha256Digest(expectedPayload));
assert.equal(entry.public_surface_registry_entry_id, 'PUBLIC-SURFACE-REGISTRY-ENTRY::HBCE-L1-DECISION-PROOF-0001');
assert.equal(entry.registry_key, 'hbce.level1.public_surface.controlled_information.0001');
assert.equal(entry.source_public_surface_publication_snapshot_ref, SOURCE_REF);
assert.equal(entry.source_public_surface_publication_snapshot_digest, source.public_surface_publication_snapshot.public_surface_publication_snapshot_payload_digest);
assert.equal(entry.registry_scope, 'LEVEL1_DECISION_PROOF_PUBLIC_SURFACE_CONTROLLED_INFORMATION_ONLY');
assert.equal(entry.registry_status, 'REGISTRY_ENTRY_DEFINED_CONTROLLED_INFORMATION_ONLY');
assert.equal(entry.registry_mode, 'PUBLIC_INFORMATION_SURFACE_REGISTRY_ENTRY');
assert.equal(entry.publication_authorization_scope, 'controlled_public_information_surface_only');

assert.deepEqual(entry.registered_surface_types, ['public_website', 'public_one_pager', 'public_intro_deck', 'public_contact_or_intake_page']);
assert.equal(entry.registered_surface_count, 4);
assert.equal(entry.registered_surfaces.length, 4);
assert.equal(entry.required_publication_source_count, 5);
assert.equal(entry.required_publication_source_hashes_valid, true);
assert.equal(entry.publication_snapshot_ready, true);
assert.equal(entry.public_surface_ready_at_source, true);
assert.equal(entry.publication_authorized_at_source, true);
assert.equal(entry.publication_authorization_scope_limited_at_source, true);
assert.equal(entry.all_authorized_surfaces_registered, true);
assert.equal(entry.all_registered_surfaces_authorized, true);
assert.equal(entry.all_registered_surfaces_ready_for_controlled_publication, true);
assert.equal(entry.all_registered_surface_boundaries_preserved, true);

for (const surfaceType of entry.registered_surface_types) {
  const surface = entry.registered_surfaces.find((item) => item.surface_type === surfaceType);
  assert.ok(surface, `${surfaceType} must be registered`);
  assert.equal(surface.registry_surface_id, registrySurfaceId(surfaceType));
  assert.equal(surface.publication_authorized, true);
  assert.equal(surface.authorization_scope, 'controlled_public_information_surface_only');
  assert.equal(surface.ready_for_controlled_publication, true);
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
  assert.equal(surface.registry_entry_expands_publication_scope, false);
}

assert.equal(entry.approved_public_surface_claims_registry.public_surface_ready_controlled_information_only, true);
assert.equal(entry.approved_public_surface_claims_registry.publication_authorized_for_controlled_public_information_surface, true);
assert.equal(entry.blocked_claims_registry.external_customer_delivery_ready, true);
assert.equal(entry.blocked_claims_registry.banking_pack_ready, true);
assert.equal(entry.blocked_claims_registry.level1_launch_ready, true);
assert.equal(entry.blocked_claims_registry.production_ready, true);
assert.equal(entry.blocked_claims_registry.legal_validity, true);
assert.equal(entry.blocked_claims_registry.security_certification, true);
assert.equal(entry.blocked_claims_registry.ai_authority, true);

for (const control of [
  'register_only_authorized_surface_types',
  'preserve_controlled_public_information_scope',
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
  'fail_closed_on_registry_delta'
]) {
  assert.equal(entry.registry_controls.includes(control), true, `${control} must be present`);
}

assert.equal(entry.registry_boundary.controlled_information_surface_only, true);
assert.equal(entry.registry_boundary.registry_entry_only, true);
assert.equal(entry.registry_boundary.source_publication_snapshot_required, true);
assert.equal(entry.registry_boundary.source_readiness_gate_required, true);
assert.equal(entry.registry_boundary.source_evidence_index_required, true);
assert.equal(entry.registry_boundary.source_copy_pack_required, true);
assert.equal(entry.registry_boundary.source_content_model_required, true);
assert.equal(entry.registry_boundary.source_scope_lock_required, true);
assert.equal(entry.registry_boundary.synthetic_demo_boundary_preserved, true);
assert.equal(entry.registry_boundary.no_customer_data, true);
assert.equal(entry.registry_boundary.no_live_system_control, true);
assert.equal(entry.registry_boundary.no_production_integration, true);
assert.equal(entry.registry_boundary.no_legal_validity_claim, true);
assert.equal(entry.registry_boundary.no_security_certification_claim, true);
assert.equal(entry.registry_boundary.no_ai_authority_claim, true);
assert.equal(entry.registry_boundary.no_customer_logo_without_authorization, true);

assert.equal(entry.source_public_surface_publication_snapshot_ready, true);
assert.equal(entry.source_public_surface_ready, true);
assert.equal(entry.source_publication_authorized, true);
assert.equal(entry.source_publication_authorization_scope_limited, true);
assert.equal(entry.public_surface_registry_entry_ready, true);
assert.equal(entry.public_surface_ready, true);
assert.equal(entry.publication_authorized, true);
assert.equal(entry.publication_authorization_scope_limited, true);
assert.equal(entry.public_surface_release_manifest_ready, false);
assert.equal(entry.external_customer_ready, false);
assert.equal(entry.banking_pack_ready, false);
assert.equal(entry.level1_launch_ready, false);
assert.equal(entry.production_ready, false);
assert.equal(entry.ai_registry_entry_authority_allowed, false);

assert.equal(entry.registry_entry_checklist.source_public_surface_publication_snapshot_hash_valid, true);
assert.equal(entry.registry_entry_checklist.source_public_surface_publication_snapshot_ready, true);
assert.equal(entry.registry_entry_checklist.source_public_surface_ready, true);
assert.equal(entry.registry_entry_checklist.source_publication_authorized, true);
assert.equal(entry.registry_entry_checklist.source_publication_authorization_scope_limited, true);
assert.equal(entry.registry_entry_checklist.all_authorized_surfaces_registered, true);
assert.equal(entry.registry_entry_checklist.all_registered_surfaces_authorized, true);
assert.equal(entry.registry_entry_checklist.all_registered_surfaces_ready_for_controlled_publication, true);
assert.equal(entry.registry_entry_checklist.all_registered_surface_boundaries_preserved, true);
assert.equal(entry.registry_entry_checklist.required_publication_source_hashes_valid, true);
assert.equal(entry.registry_entry_checklist.blocked_claims_preserved, true);
assert.equal(entry.registry_entry_checklist.release_manifest_not_ready, true);
assert.equal(entry.registry_entry_checklist.external_customer_readiness_excluded, true);
assert.equal(entry.registry_entry_checklist.banking_pack_readiness_excluded, true);
assert.equal(entry.registry_entry_checklist.launch_readiness_excluded, true);
assert.equal(entry.registry_entry_checklist.production_readiness_excluded, true);
assert.equal(entry.registry_entry_checklist.ai_authority_absence_confirmed, true);

assert.equal(entry.public_surface_registry_entry_defined, true);
assert.equal(entry.public_surface_registry_entry_is_controlled_information_only, true);
assert.equal(entry.public_surface_registry_entry_is_not_release_manifest, true);
assert.equal(entry.public_surface_registry_entry_is_not_external_customer_readiness, true);
assert.equal(entry.public_surface_registry_entry_is_not_banking_pack_readiness, true);
assert.equal(entry.public_surface_registry_entry_is_not_launch_readiness, true);
assert.equal(entry.public_surface_registry_entry_is_not_production_readiness, true);
assert.equal(entry.public_surface_registry_entry_is_not_legal_validity, true);
assert.equal(entry.public_surface_registry_entry_is_not_security_certification, true);
assert.equal(entry.public_surface_registry_entry_does_not_authorize_ai_authority, true);

for (const code of ['PUBLIC_SURFACE_REGISTRY_ENTRY_MISSING', 'SOURCE_PUBLIC_SURFACE_PUBLICATION_SNAPSHOT_HASH_INVALID', 'PUBLIC_SURFACE_PUBLICATION_SNAPSHOT_NOT_READY', 'PUBLICATION_NOT_AUTHORIZED', 'PUBLICATION_AUTHORIZATION_SCOPE_NOT_LIMITED', 'AUTHORIZED_SURFACE_NOT_REGISTERED', 'REGISTERED_SURFACE_NOT_AUTHORIZED', 'REGISTERED_SURFACE_BOUNDARY_NOT_PRESERVED', 'PUBLICATION_SOURCE_HASH_INVALID', 'UNSUPPORTED_EXTERNAL_CUSTOMER_READINESS_CLAIM', 'UNSUPPORTED_BANKING_READINESS_CLAIM', 'UNSUPPORTED_LAUNCH_READINESS_CLAIM', 'UNSUPPORTED_PRODUCTION_READINESS_CLAIM', 'AI_REGISTRY_ENTRY_AUTHORITY_CLAIM_BLOCKED']) {
  assert.equal(doc.fail_closed_codes.includes(code), true, `${code} must be present`);
}

assert.equal(doc.readiness_state.public_surface_registry_entry_defined, true);
assert.equal(doc.readiness_state.public_surface_registry_entry_ready, true);
assert.equal(doc.readiness_state.source_public_surface_publication_snapshot_bound, true);
assert.equal(doc.readiness_state.public_surface_publication_snapshot_ready, true);
assert.equal(doc.readiness_state.public_surface_ready, true);
assert.equal(doc.readiness_state.publication_authorized, true);
assert.equal(doc.readiness_state.publication_authorization_scope, 'controlled_public_information_surface_only');
assert.equal(doc.readiness_state.publication_authorization_scope_limited, true);
assert.equal(doc.readiness_state.all_authorized_surfaces_registered, true);
assert.equal(doc.readiness_state.all_registered_surfaces_authorized, true);
assert.equal(doc.readiness_state.all_registered_surfaces_ready_for_controlled_publication, true);
assert.equal(doc.readiness_state.all_registered_surface_boundaries_preserved, true);
assert.equal(doc.readiness_state.required_publication_source_hashes_valid, true);
assert.equal(doc.readiness_state.public_surface_release_manifest_ready, false);
assert.equal(doc.readiness_state.external_customer_ready, false);
assert.equal(doc.readiness_state.banking_pack_ready, false);
assert.equal(doc.readiness_state.level1_launch_ready, false);
assert.equal(doc.readiness_state.production_ready, false);

assert.equal(doc.next_required_program, 'PROG-100-HBCE-LEVEL1-PUBLIC-SURFACE-RELEASE-MANIFEST');

assert.equal(doc.non_claims.legal_validity, false);
assert.equal(doc.non_claims.public_accreditation, false);
assert.equal(doc.non_claims.procurement_eligibility, false);
assert.equal(doc.non_claims.external_effect_proven, false);
assert.equal(doc.non_claims.business_success, false);
assert.equal(doc.non_claims.ai_authority, false);
assert.equal(doc.non_claims.autonomous_authority, false);
assert.equal(doc.non_claims.public_surface_release_manifest_ready, false);
assert.equal(doc.non_claims.external_customer_ready, false);
assert.equal(doc.non_claims.banking_pack_ready, false);
assert.equal(doc.non_claims.level1_launch_ready, false);
assert.equal(doc.non_claims.production_ready, false);

assert.match(md, /LEVEL1_PUBLIC_SURFACE_REGISTRY_ENTRY_DEFINED_CONTROLLED_INFORMATION_ONLY/);
assert.match(md, /The public surface registry entry is defined/);
assert.match(md, /The public surface registry entry is ready/);
assert.match(md, /The public surface release manifest is not ready/);
assert.match(md, /The registry entry must register only authorized surface types/);
assert.match(md, /The registry entry must not create production readiness/);
assert.match(md, /PROG-100-HBCE-LEVEL1-PUBLIC-SURFACE-RELEASE-MANIFEST/);

console.log('PASS PROG-099-PUBLIC-SURFACE-REGISTRY-ENTRY-DOCS-EXIST');
console.log('PASS PROG-099-PUBLIC-SURFACE-REGISTRY-ENTRY-HASH-STABLE');
console.log('PASS PROG-099-BUILDER-STABLE');
console.log('PASS PROG-099-SOURCE-PROG-098-INTEGRITY-VALID');
console.log('PASS PROG-099-AUTHORIZED-SURFACES-REGISTERED');
console.log('PASS PROG-099-REGISTERED-SURFACES-BOUNDARY-PRESERVED');
console.log('PASS PROG-099-REGISTRY-ENTRY-READY');
console.log('PASS PROG-099-RELEASE-MANIFEST-NOT-READY');
console.log('PASS PROG-099-AI-REGISTRY-ENTRY-AUTHORITY-DISALLOWED');
console.log('PASS PROG-099-NEXT-PROG-100-RECORDED');
console.log('PASS PROG-099-NO-UNSUPPORTED-READINESS-CLAIMS');
