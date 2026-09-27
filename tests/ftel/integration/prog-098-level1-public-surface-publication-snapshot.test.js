'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { sha256Digest } = require('../../../packages/hbce-core/canonical-json.js');
const {
  STATUS,
  SOURCE_REF,
  REQUIRED_PUBLICATION_SOURCE_REFS,
  buildPublicationSnapshotPayload,
  buildLevel1PublicSurfacePublicationSnapshot
} = require('../../../runtime/level1/build-prog-098-level1-public-surface-publication-snapshot.js');

const root = path.resolve(__dirname, '../../..');
const read = (p) => fs.readFileSync(path.join(root, p), 'utf8');
const json = (p) => JSON.parse(read(p));
const exists = (p) => fs.existsSync(path.join(root, p));

const docPath = 'docs/launch/level1/prog-098-level1-public-surface-publication-snapshot.json';
const mdPath = 'docs/launch/level1/prog-098-level1-public-surface-publication-snapshot.md';
const runtimePath = 'runtime/level1/build-prog-098-level1-public-surface-publication-snapshot.js';

for (const p of [docPath, mdPath, runtimePath, SOURCE_REF, ...REQUIRED_PUBLICATION_SOURCE_REFS]) assert.equal(exists(p), true, `${p} must exist`);

const doc = json(docPath);
const md = read(mdPath);
const source = json(SOURCE_REF);

assert.equal(doc.proto, 'HBCE-L1-PROG-098-PUBLIC-SURFACE-PUBLICATION-SNAPSHOT-v1');
assert.equal(doc.kind, 'HBCE_LEVEL1_PUBLIC_SURFACE_PUBLICATION_SNAPSHOT');
assert.equal(doc.issue_id, 'PROG-098');
assert.equal(doc.level1_public_surface_publication_snapshot_status, STATUS);
assert.equal(doc.source_public_surface_readiness_gate_revision_hash, source.revision_hash);
assert.equal(doc.source_public_surface_readiness_gate_revision_hash_valid, true);

const regenerated = buildLevel1PublicSurfacePublicationSnapshot({ rootDir: root, repositoryCommit: doc.repository_baseline_commit });
assert.deepEqual(regenerated, doc);

const body = { ...doc };
delete body.revision_hash;
assert.equal(doc.revision_hash, sha256Digest(body));

assert.equal(doc.inherited_public_surface_readiness_gate.readiness_gate_status, 'LEVEL1_PUBLIC_SURFACE_READINESS_GATE_PASSED_CONTROLLED_INFORMATION_ONLY');
assert.equal(doc.inherited_public_surface_readiness_gate.public_surface_readiness_gate_passed, true);
assert.equal(doc.inherited_public_surface_readiness_gate.public_surface_ready, true);
assert.equal(doc.inherited_public_surface_readiness_gate.publication_authorized, true);
assert.equal(doc.inherited_public_surface_readiness_gate.publication_authorization_scope, 'controlled_public_information_surface_only');
assert.equal(doc.inherited_public_surface_readiness_gate.external_customer_ready, false);
assert.equal(doc.inherited_public_surface_readiness_gate.banking_pack_ready, false);
assert.equal(doc.inherited_public_surface_readiness_gate.level1_launch_ready, false);
assert.equal(doc.inherited_public_surface_readiness_gate.production_ready, false);

const expectedPayload = buildPublicationSnapshotPayload(source, root);
const snapshot = doc.public_surface_publication_snapshot;

assert.equal(snapshot.public_surface_publication_snapshot_payload_digest, sha256Digest(expectedPayload));
assert.equal(snapshot.public_surface_publication_snapshot_id, 'PUBLIC-SURFACE-PUBLICATION-SNAPSHOT::HBCE-L1-DECISION-PROOF-0001');
assert.equal(snapshot.source_public_surface_readiness_gate_ref, SOURCE_REF);
assert.equal(snapshot.source_public_surface_readiness_gate_digest, source.public_surface_readiness_gate.public_surface_readiness_gate_payload_digest);
assert.equal(snapshot.snapshot_scope, 'LEVEL1_DECISION_PROOF_PUBLIC_SURFACE_CONTROLLED_INFORMATION_ONLY');
assert.equal(snapshot.snapshot_status, 'PUBLICATION_SNAPSHOT_DEFINED_CONTROLLED_INFORMATION_ONLY');
assert.equal(snapshot.snapshot_mode, 'PUBLIC_INFORMATION_SURFACE_PUBLICATION_SNAPSHOT');
assert.equal(snapshot.publication_authorization_scope, 'controlled_public_information_surface_only');

assert.deepEqual(snapshot.publication_source_refs, REQUIRED_PUBLICATION_SOURCE_REFS);
assert.equal(snapshot.publication_source_items.length, REQUIRED_PUBLICATION_SOURCE_REFS.length);
assert.equal(snapshot.all_required_publication_sources_indexed, true);
assert.equal(snapshot.all_publication_source_hashes_valid, true);

for (const ref of REQUIRED_PUBLICATION_SOURCE_REFS) {
  const item = snapshot.publication_source_items.find((entry) => entry.source_ref === ref);
  assert.ok(item, `${ref} must be indexed`);
  assert.equal(item.revision_hash_valid, true);
  assert.equal(item.required_for_publication_snapshot, true);
  assert.equal(item.public_surface_safe, true);
  assert.equal(item.customer_data_included, false);
  assert.equal(item.publication_authorization_expands_scope, false);
}

assert.deepEqual(snapshot.authorized_surface_types, ['public_website', 'public_one_pager', 'public_intro_deck', 'public_contact_or_intake_page']);
assert.equal(snapshot.authorized_surface_count, 4);
assert.equal(snapshot.surface_snapshot_count, 4);
assert.equal(snapshot.surface_snapshots.length, 4);
assert.equal(snapshot.all_authorized_surfaces_snapshotted, true);
assert.equal(snapshot.all_surfaces_ready_for_controlled_publication, true);
assert.equal(snapshot.all_surface_boundaries_preserved, true);

for (const surface of snapshot.surface_snapshots) {
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
}

assert.equal(snapshot.approved_public_surface_claims_snapshot.public_surface_ready_controlled_information_only, true);
assert.equal(snapshot.approved_public_surface_claims_snapshot.publication_authorized_for_controlled_public_information_surface, true);
assert.equal(snapshot.blocked_claims_snapshot.external_customer_delivery_ready, true);
assert.equal(snapshot.blocked_claims_snapshot.banking_pack_ready, true);
assert.equal(snapshot.blocked_claims_snapshot.level1_launch_ready, true);
assert.equal(snapshot.blocked_claims_snapshot.production_ready, true);
assert.equal(snapshot.blocked_claims_snapshot.legal_validity, true);
assert.equal(snapshot.blocked_claims_snapshot.security_certification, true);
assert.equal(snapshot.blocked_claims_snapshot.ai_authority, true);

for (const control of [
  'publish_only_authorized_surface_types',
  'preserve_controlled_public_information_scope',
  'preserve_readiness_gate_authorization_scope',
  'preserve_evidence_index_references',
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
  'fail_closed_on_public_surface_delta'
]) {
  assert.equal(snapshot.publication_snapshot_controls.includes(control), true, `${control} must be present`);
}

assert.equal(snapshot.publication_snapshot_boundary.controlled_information_surface_only, true);
assert.equal(snapshot.publication_snapshot_boundary.publication_snapshot_only, true);
assert.equal(snapshot.publication_snapshot_boundary.source_readiness_gate_required, true);
assert.equal(snapshot.publication_snapshot_boundary.source_evidence_index_required, true);
assert.equal(snapshot.publication_snapshot_boundary.source_copy_pack_required, true);
assert.equal(snapshot.publication_snapshot_boundary.source_content_model_required, true);
assert.equal(snapshot.publication_snapshot_boundary.source_scope_lock_required, true);
assert.equal(snapshot.publication_snapshot_boundary.synthetic_demo_boundary_preserved, true);
assert.equal(snapshot.publication_snapshot_boundary.no_customer_data, true);
assert.equal(snapshot.publication_snapshot_boundary.no_live_system_control, true);
assert.equal(snapshot.publication_snapshot_boundary.no_production_integration, true);
assert.equal(snapshot.publication_snapshot_boundary.no_legal_validity_claim, true);
assert.equal(snapshot.publication_snapshot_boundary.no_security_certification_claim, true);
assert.equal(snapshot.publication_snapshot_boundary.no_ai_authority_claim, true);
assert.equal(snapshot.publication_snapshot_boundary.no_customer_logo_without_authorization, true);

assert.equal(snapshot.source_public_surface_readiness_gate_passed, true);
assert.equal(snapshot.source_public_surface_ready, true);
assert.equal(snapshot.source_publication_authorized, true);
assert.equal(snapshot.source_publication_authorization_scope_limited, true);
assert.equal(snapshot.public_surface_publication_snapshot_ready, true);
assert.equal(snapshot.public_surface_ready, true);
assert.equal(snapshot.publication_authorized, true);
assert.equal(snapshot.publication_authorization_scope_limited, true);
assert.equal(snapshot.public_surface_registry_entry_ready, false);
assert.equal(snapshot.external_customer_ready, false);
assert.equal(snapshot.banking_pack_ready, false);
assert.equal(snapshot.level1_launch_ready, false);
assert.equal(snapshot.production_ready, false);
assert.equal(snapshot.ai_publication_snapshot_authority_allowed, false);

assert.equal(snapshot.publication_snapshot_checklist.source_public_surface_readiness_gate_hash_valid, true);
assert.equal(snapshot.publication_snapshot_checklist.source_public_surface_readiness_gate_passed, true);
assert.equal(snapshot.publication_snapshot_checklist.source_public_surface_ready, true);
assert.equal(snapshot.publication_snapshot_checklist.source_publication_authorized, true);
assert.equal(snapshot.publication_snapshot_checklist.source_publication_authorization_scope_limited, true);
assert.equal(snapshot.publication_snapshot_checklist.all_required_publication_sources_indexed, true);
assert.equal(snapshot.publication_snapshot_checklist.all_publication_source_hashes_valid, true);
assert.equal(snapshot.publication_snapshot_checklist.all_authorized_surfaces_snapshotted, true);
assert.equal(snapshot.publication_snapshot_checklist.all_surfaces_ready_for_controlled_publication, true);
assert.equal(snapshot.publication_snapshot_checklist.all_surface_boundaries_preserved, true);
assert.equal(snapshot.publication_snapshot_checklist.blocked_claims_preserved, true);
assert.equal(snapshot.publication_snapshot_checklist.registry_entry_not_ready, true);
assert.equal(snapshot.publication_snapshot_checklist.external_customer_readiness_excluded, true);
assert.equal(snapshot.publication_snapshot_checklist.banking_pack_readiness_excluded, true);
assert.equal(snapshot.publication_snapshot_checklist.launch_readiness_excluded, true);
assert.equal(snapshot.publication_snapshot_checklist.production_readiness_excluded, true);
assert.equal(snapshot.publication_snapshot_checklist.ai_authority_absence_confirmed, true);

assert.equal(snapshot.public_surface_publication_snapshot_defined, true);
assert.equal(snapshot.public_surface_publication_snapshot_is_controlled_information_only, true);
assert.equal(snapshot.public_surface_publication_snapshot_is_not_registry_entry, true);
assert.equal(snapshot.public_surface_publication_snapshot_is_not_external_customer_readiness, true);
assert.equal(snapshot.public_surface_publication_snapshot_is_not_banking_pack_readiness, true);
assert.equal(snapshot.public_surface_publication_snapshot_is_not_launch_readiness, true);
assert.equal(snapshot.public_surface_publication_snapshot_is_not_production_readiness, true);
assert.equal(snapshot.public_surface_publication_snapshot_is_not_legal_validity, true);
assert.equal(snapshot.public_surface_publication_snapshot_is_not_security_certification, true);
assert.equal(snapshot.public_surface_publication_snapshot_does_not_authorize_ai_authority, true);

for (const code of ['PUBLIC_SURFACE_PUBLICATION_SNAPSHOT_MISSING', 'SOURCE_PUBLIC_SURFACE_READINESS_GATE_HASH_INVALID', 'PUBLIC_SURFACE_READINESS_GATE_NOT_PASSED', 'PUBLICATION_NOT_AUTHORIZED_BY_READINESS_GATE', 'PUBLICATION_AUTHORIZATION_SCOPE_NOT_LIMITED', 'REQUIRED_PUBLICATION_SOURCE_REF_MISSING', 'PUBLICATION_SOURCE_HASH_INVALID', 'AUTHORIZED_SURFACE_NOT_SNAPSHOTTED', 'PUBLIC_SURFACE_BOUNDARY_NOT_PRESERVED', 'UNSUPPORTED_EXTERNAL_CUSTOMER_READINESS_CLAIM', 'UNSUPPORTED_BANKING_READINESS_CLAIM', 'UNSUPPORTED_LAUNCH_READINESS_CLAIM', 'UNSUPPORTED_PRODUCTION_READINESS_CLAIM', 'AI_PUBLICATION_SNAPSHOT_AUTHORITY_CLAIM_BLOCKED']) {
  assert.equal(doc.fail_closed_codes.includes(code), true, `${code} must be present`);
}

assert.equal(doc.readiness_state.public_surface_publication_snapshot_defined, true);
assert.equal(doc.readiness_state.public_surface_publication_snapshot_ready, true);
assert.equal(doc.readiness_state.source_public_surface_readiness_gate_bound, true);
assert.equal(doc.readiness_state.public_surface_readiness_gate_passed, true);
assert.equal(doc.readiness_state.public_surface_ready, true);
assert.equal(doc.readiness_state.publication_authorized, true);
assert.equal(doc.readiness_state.publication_authorization_scope, 'controlled_public_information_surface_only');
assert.equal(doc.readiness_state.publication_authorization_scope_limited, true);
assert.equal(doc.readiness_state.all_required_publication_sources_indexed, true);
assert.equal(doc.readiness_state.all_publication_source_hashes_valid, true);
assert.equal(doc.readiness_state.all_authorized_surfaces_snapshotted, true);
assert.equal(doc.readiness_state.all_surfaces_ready_for_controlled_publication, true);
assert.equal(doc.readiness_state.all_surface_boundaries_preserved, true);
assert.equal(doc.readiness_state.public_surface_registry_entry_ready, false);
assert.equal(doc.readiness_state.external_customer_ready, false);
assert.equal(doc.readiness_state.banking_pack_ready, false);
assert.equal(doc.readiness_state.level1_launch_ready, false);
assert.equal(doc.readiness_state.production_ready, false);

assert.equal(doc.next_required_program, 'PROG-099-HBCE-LEVEL1-PUBLIC-SURFACE-REGISTRY-ENTRY');

assert.equal(doc.non_claims.legal_validity, false);
assert.equal(doc.non_claims.public_accreditation, false);
assert.equal(doc.non_claims.procurement_eligibility, false);
assert.equal(doc.non_claims.external_effect_proven, false);
assert.equal(doc.non_claims.business_success, false);
assert.equal(doc.non_claims.ai_authority, false);
assert.equal(doc.non_claims.autonomous_authority, false);
assert.equal(doc.non_claims.public_surface_registry_entry_ready, false);
assert.equal(doc.non_claims.external_customer_ready, false);
assert.equal(doc.non_claims.banking_pack_ready, false);
assert.equal(doc.non_claims.level1_launch_ready, false);
assert.equal(doc.non_claims.production_ready, false);

assert.match(md, /LEVEL1_PUBLIC_SURFACE_PUBLICATION_SNAPSHOT_DEFINED_CONTROLLED_INFORMATION_ONLY/);
assert.match(md, /The publication snapshot is defined/);
assert.match(md, /The publication snapshot is ready/);
assert.match(md, /The public surface registry entry is not ready/);
assert.match(md, /public website/);
assert.match(md, /The publication snapshot must preserve evidence index references/);
assert.match(md, /The publication snapshot must not create production readiness/);
assert.match(md, /PROG-099-HBCE-LEVEL1-PUBLIC-SURFACE-REGISTRY-ENTRY/);

console.log('PASS PROG-098-PUBLIC-SURFACE-PUBLICATION-SNAPSHOT-DOCS-EXIST');
console.log('PASS PROG-098-PUBLIC-SURFACE-PUBLICATION-SNAPSHOT-HASH-STABLE');
console.log('PASS PROG-098-BUILDER-STABLE');
console.log('PASS PROG-098-SOURCE-PROG-097-INTEGRITY-VALID');
console.log('PASS PROG-098-AUTHORIZED-SURFACES-SNAPSHOTTED');
console.log('PASS PROG-098-PUBLICATION-SOURCES-HASH-VALID');
console.log('PASS PROG-098-CONTROLLED-PUBLICATION-SNAPSHOT-READY');
console.log('PASS PROG-098-BOUNDARIES-PRESERVED');
console.log('PASS PROG-098-REGISTRY-ENTRY-NOT-READY');
console.log('PASS PROG-098-AI-PUBLICATION-SNAPSHOT-AUTHORITY-DISALLOWED');
console.log('PASS PROG-098-NEXT-PROG-099-RECORDED');
console.log('PASS PROG-098-NO-UNSUPPORTED-READINESS-CLAIMS');
