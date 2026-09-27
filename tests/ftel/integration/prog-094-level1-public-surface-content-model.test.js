'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { sha256Digest } = require('../../../packages/hbce-core/canonical-json.js');
const {
  STATUS,
  SOURCE_REF,
  PUBLIC_SURFACE_SECTIONS,
  REQUIRED_NON_CLAIM_ANCHORS,
  buildPublicSurfaceContentModelPayload,
  buildLevel1PublicSurfaceContentModel
} = require('../../../runtime/level1/build-prog-094-level1-public-surface-content-model.js');

const root = path.resolve(__dirname, '../../..');
const read = (p) => fs.readFileSync(path.join(root, p), 'utf8');
const json = (p) => JSON.parse(read(p));
const exists = (p) => fs.existsSync(path.join(root, p));

const docPath = 'docs/launch/level1/prog-094-level1-public-surface-content-model.json';
const mdPath = 'docs/launch/level1/prog-094-level1-public-surface-content-model.md';
const runtimePath = 'runtime/level1/build-prog-094-level1-public-surface-content-model.js';

for (const p of [docPath, mdPath, runtimePath, SOURCE_REF]) assert.equal(exists(p), true, `${p} must exist`);

const doc = json(docPath);
const md = read(mdPath);
const source = json(SOURCE_REF);

assert.equal(doc.proto, 'HBCE-L1-PROG-094-PUBLIC-SURFACE-CONTENT-MODEL-v1');
assert.equal(doc.kind, 'HBCE_LEVEL1_PUBLIC_SURFACE_CONTENT_MODEL');
assert.equal(doc.issue_id, 'PROG-094');
assert.equal(doc.level1_public_surface_content_model_status, STATUS);
assert.equal(doc.source_public_surface_scope_lock_revision_hash, source.revision_hash);
assert.equal(doc.source_public_surface_scope_lock_revision_hash_valid, true);

const regenerated = buildLevel1PublicSurfaceContentModel({ rootDir: root, repositoryCommit: doc.repository_baseline_commit });
assert.deepEqual(regenerated, doc);

const body = { ...doc };
delete body.revision_hash;
assert.equal(doc.revision_hash, sha256Digest(body));

assert.equal(doc.inherited_public_surface_scope_lock.scope_lock_status, 'LEVEL1_PUBLIC_SURFACE_SCOPE_LOCK_DEFINED_NOT_PUBLIC_READY');
assert.equal(doc.inherited_public_surface_scope_lock.surface_scope, 'LEVEL1_DECISION_PROOF_PUBLIC_SURFACE_SYNTHETIC_ONLY');
assert.equal(doc.inherited_public_surface_scope_lock.surface_status, 'SCOPE_LOCKED_NOT_PUBLIC_READY');
assert.equal(doc.inherited_public_surface_scope_lock.public_surface_scope_locked, true);
assert.equal(doc.inherited_public_surface_scope_lock.controlled_synthetic_client_demo_pack_ready, true);
assert.equal(doc.inherited_public_surface_scope_lock.prior_public_surface_content_model_ready, false);
assert.equal(doc.inherited_public_surface_scope_lock.prior_public_surface_copy_ready, false);
assert.equal(doc.inherited_public_surface_scope_lock.prior_public_surface_evidence_index_ready, false);
assert.equal(doc.inherited_public_surface_scope_lock.prior_public_surface_readiness_gate_passed, false);
assert.equal(doc.inherited_public_surface_scope_lock.prior_public_surface_ready, false);
assert.equal(doc.inherited_public_surface_scope_lock.prior_external_customer_ready, false);
assert.equal(doc.inherited_public_surface_scope_lock.prior_banking_pack_ready, false);
assert.equal(doc.inherited_public_surface_scope_lock.prior_level1_launch_ready, false);
assert.equal(doc.inherited_public_surface_scope_lock.prior_production_ready, false);

const expectedPayload = buildPublicSurfaceContentModelPayload(source);
const model = doc.public_surface_content_model;

assert.equal(model.public_surface_content_model_payload_digest, sha256Digest(expectedPayload));
assert.equal(model.public_surface_content_model_id, 'PUBLIC-SURFACE-CONTENT-MODEL::HBCE-L1-DECISION-PROOF-0001');
assert.equal(model.source_public_surface_scope_lock_ref, SOURCE_REF);
assert.equal(model.source_public_surface_scope_lock_digest, source.public_surface_scope_lock.public_surface_scope_payload_digest);
assert.equal(model.surface_scope, 'LEVEL1_DECISION_PROOF_PUBLIC_SURFACE_SYNTHETIC_ONLY');
assert.equal(model.surface_status, 'CONTENT_MODEL_DEFINED_NOT_PUBLIC_READY');
assert.equal(model.content_model_scope, 'LEVEL1_DECISION_PROOF_PUBLIC_SURFACE_SYNTHETIC_ONLY');
assert.equal(model.content_model_mode, 'PUBLIC_INFORMATION_SURFACE_CONTENT_MODEL');

assert.deepEqual(model.required_sections, PUBLIC_SURFACE_SECTIONS);
assert.deepEqual(model.required_non_claim_anchors, REQUIRED_NON_CLAIM_ANCHORS);
assert.equal(model.section_count, PUBLIC_SURFACE_SECTIONS.length);
assert.equal(model.content_sections.length, PUBLIC_SURFACE_SECTIONS.length);
assert.equal(model.all_required_sections_defined, true);
assert.equal(model.all_sections_use_scope_allowed_content, true);
assert.equal(model.all_excluded_content_absent_from_sections, true);
assert.equal(model.positive_claims_bound_to_prog_092, true);
assert.equal(model.required_non_claim_anchors_covered, true);

for (const sectionId of PUBLIC_SURFACE_SECTIONS) {
  const section = model.content_sections.find((entry) => entry.section_id === sectionId);
  assert.ok(section, `${sectionId} must exist`);
  assert.equal(typeof section.content_role, 'string');
  assert.equal(section.content_role.length > 0, true);
  assert.equal(section.allowed_content_refs.length > 0, true);
  assert.equal(section.allowed_content_refs_are_scope_allowed, true);
  assert.equal(section.excluded_content_refs_are_empty, true);
  assert.equal(section.publication_ready, false);
}

for (const anchor of REQUIRED_NON_CLAIM_ANCHORS) {
  assert.equal(
    model.content_sections.some((section) => section.required_non_claim_refs.includes(anchor)),
    true,
    `${anchor} must be covered`
  );
}

for (const control of [
  'use_only_scope_allowed_public_content',
  'exclude_all_scope_excluded_public_content',
  'bind_positive_readiness_claims_to_prog_092',
  'place_non_claims_near_positive_claims',
  'mark_all_sections_publication_ready_false_until_copy_pack',
  'do_not_use_customer_data',
  'do_not_use_customer_logos_without_authorization',
  'do_not_claim_public_surface_readiness',
  'do_not_claim_external_customer_delivery_readiness',
  'do_not_claim_banking_pack_readiness',
  'do_not_claim_level1_launch_readiness',
  'do_not_claim_production_readiness',
  'do_not_claim_legal_validity',
  'do_not_claim_security_certification',
  'do_not_authorize_ai_authority'
]) {
  assert.equal(model.content_model_controls.includes(control), true, `${control} must be present`);
}

assert.equal(model.content_model_boundary.synthetic_demo_only, true);
assert.equal(model.content_model_boundary.source_scope_lock_required, true);
assert.equal(model.content_model_boundary.source_client_demo_pack_readiness_gate_required, true);
assert.equal(model.content_model_boundary.content_model_only, true);
assert.equal(model.content_model_boundary.no_final_copy, true);
assert.equal(model.content_model_boundary.no_customer_data, true);
assert.equal(model.content_model_boundary.no_live_system_control, true);
assert.equal(model.content_model_boundary.no_production_integration, true);
assert.equal(model.content_model_boundary.no_legal_validity_claim, true);
assert.equal(model.content_model_boundary.no_public_accreditation_claim, true);
assert.equal(model.content_model_boundary.no_procurement_eligibility_claim, true);
assert.equal(model.content_model_boundary.no_external_effect_claim, true);
assert.equal(model.content_model_boundary.no_business_success_claim, true);
assert.equal(model.content_model_boundary.no_ai_authority_claim, true);
assert.equal(model.content_model_boundary.no_pricing_commitment, true);
assert.equal(model.content_model_boundary.no_sla_commitment, true);
assert.equal(model.content_model_boundary.no_security_certification_claim, true);
assert.equal(model.content_model_boundary.no_customer_logo_without_authorization, true);

assert.equal(model.source_public_surface_scope_locked, true);
assert.equal(model.source_controlled_synthetic_client_demo_pack_ready, true);
assert.equal(model.public_surface_content_model_ready, true);
assert.equal(model.public_surface_copy_ready, false);
assert.equal(model.public_surface_evidence_index_ready, false);
assert.equal(model.public_surface_readiness_gate_passed, false);
assert.equal(model.public_surface_ready, false);
assert.equal(model.external_customer_ready, false);
assert.equal(model.banking_pack_ready, false);
assert.equal(model.level1_launch_ready, false);
assert.equal(model.production_ready, false);
assert.equal(model.ai_content_model_authority_allowed, false);

assert.equal(model.content_model_checklist.source_public_surface_scope_lock_hash_valid, true);
assert.equal(model.content_model_checklist.source_public_surface_scope_locked, true);
assert.equal(model.content_model_checklist.source_controlled_synthetic_client_demo_pack_ready, true);
assert.equal(model.content_model_checklist.all_required_sections_defined, true);
assert.equal(model.content_model_checklist.all_sections_use_scope_allowed_content, true);
assert.equal(model.content_model_checklist.all_excluded_content_absent_from_sections, true);
assert.equal(model.content_model_checklist.positive_claims_bound_to_prog_092, true);
assert.equal(model.content_model_checklist.required_non_claim_anchors_covered, true);
assert.equal(model.content_model_checklist.public_surface_readiness_excluded, true);
assert.equal(model.content_model_checklist.external_customer_readiness_excluded, true);
assert.equal(model.content_model_checklist.banking_pack_readiness_excluded, true);
assert.equal(model.content_model_checklist.launch_readiness_excluded, true);
assert.equal(model.content_model_checklist.production_readiness_excluded, true);
assert.equal(model.content_model_checklist.ai_authority_absence_confirmed, true);

assert.equal(model.public_surface_content_model_defined, true);
assert.equal(model.public_surface_content_model_is_not_public_surface_readiness, true);
assert.equal(model.public_surface_content_model_is_not_external_customer_readiness, true);
assert.equal(model.public_surface_content_model_is_not_banking_pack_readiness, true);
assert.equal(model.public_surface_content_model_is_not_launch_readiness, true);
assert.equal(model.public_surface_content_model_is_not_production_readiness, true);
assert.equal(model.public_surface_content_model_is_not_legal_validity, true);
assert.equal(model.public_surface_content_model_is_not_security_certification, true);

for (const code of ['PUBLIC_SURFACE_CONTENT_MODEL_MISSING', 'SOURCE_PUBLIC_SURFACE_SCOPE_LOCK_HASH_INVALID', 'PUBLIC_SURFACE_SCOPE_NOT_LOCKED', 'REQUIRED_PUBLIC_SURFACE_SECTION_MISSING', 'SECTION_USES_SCOPE_EXCLUDED_CONTENT', 'SECTION_USES_NON_ALLOWED_PUBLIC_CONTENT', 'POSITIVE_CLAIM_NOT_BOUND_TO_PROG_092', 'REQUIRED_NON_CLAIM_ANCHOR_MISSING', 'UNSUPPORTED_PUBLIC_READINESS_CLAIM', 'UNSUPPORTED_PRODUCTION_READINESS_CLAIM', 'AI_CONTENT_MODEL_AUTHORITY_CLAIM_BLOCKED']) {
  assert.equal(doc.fail_closed_codes.includes(code), true, `${code} must be present`);
}

assert.equal(doc.readiness_state.public_surface_content_model_defined, true);
assert.equal(doc.readiness_state.public_surface_content_model_ready, true);
assert.equal(doc.readiness_state.source_public_surface_scope_lock_bound, true);
assert.equal(doc.readiness_state.public_surface_scope_locked, true);
assert.equal(doc.readiness_state.controlled_synthetic_client_demo_pack_ready, true);
assert.equal(doc.readiness_state.all_required_sections_defined, true);
assert.equal(doc.readiness_state.all_sections_use_scope_allowed_content, true);
assert.equal(doc.readiness_state.all_excluded_content_absent_from_sections, true);
assert.equal(doc.readiness_state.positive_claims_bound_to_prog_092, true);
assert.equal(doc.readiness_state.required_non_claim_anchors_covered, true);
assert.equal(doc.readiness_state.public_surface_copy_ready, false);
assert.equal(doc.readiness_state.public_surface_evidence_index_ready, false);
assert.equal(doc.readiness_state.public_surface_readiness_gate_passed, false);
assert.equal(doc.readiness_state.public_surface_ready, false);
assert.equal(doc.readiness_state.external_customer_ready, false);
assert.equal(doc.readiness_state.banking_pack_ready, false);
assert.equal(doc.readiness_state.level1_launch_ready, false);
assert.equal(doc.readiness_state.production_ready, false);

assert.equal(doc.next_required_program, 'PROG-095-HBCE-LEVEL1-PUBLIC-SURFACE-COPY-PACK');

assert.equal(doc.non_claims.legal_validity, false);
assert.equal(doc.non_claims.public_accreditation, false);
assert.equal(doc.non_claims.procurement_eligibility, false);
assert.equal(doc.non_claims.external_effect_proven, false);
assert.equal(doc.non_claims.business_success, false);
assert.equal(doc.non_claims.ai_authority, false);
assert.equal(doc.non_claims.autonomous_authority, false);
assert.equal(doc.non_claims.public_surface_ready, false);
assert.equal(doc.non_claims.external_customer_ready, false);
assert.equal(doc.non_claims.banking_pack_ready, false);
assert.equal(doc.non_claims.level1_launch_ready, false);
assert.equal(doc.non_claims.production_ready, false);

assert.match(md, /LEVEL1_PUBLIC_SURFACE_CONTENT_MODEL_DEFINED_NOT_PUBLIC_READY/);
assert.match(md, /The public surface content model is defined/);
assert.match(md, /The public surface content model is ready/);
assert.match(md, /The public surface copy is not ready/);
assert.match(md, /CONTROLLED_SYNTHETIC_CLIENT_DEMO_PACK/);
assert.match(md, /Positive readiness claims must bind to PROG-092/);
assert.match(md, /The content model does not create public surface readiness/);
assert.match(md, /PROG-095-HBCE-LEVEL1-PUBLIC-SURFACE-COPY-PACK/);

console.log('PASS PROG-094-PUBLIC-SURFACE-CONTENT-MODEL-DOCS-EXIST');
console.log('PASS PROG-094-PUBLIC-SURFACE-CONTENT-MODEL-HASH-STABLE');
console.log('PASS PROG-094-BUILDER-STABLE');
console.log('PASS PROG-094-SOURCE-PROG-093-INTEGRITY-VALID');
console.log('PASS PROG-094-REQUIRED-SECTIONS-DEFINED');
console.log('PASS PROG-094-SECTIONS-USE-SCOPE-ALLOWED-CONTENT');
console.log('PASS PROG-094-POSITIVE-CLAIMS-BOUND-TO-PROG-092');
console.log('PASS PROG-094-NON-CLAIM-ANCHORS-COVERED');
console.log('PASS PROG-094-CONTENT-MODEL-READY-NOT-PUBLIC-READY');
console.log('PASS PROG-094-AI-CONTENT-MODEL-AUTHORITY-DISALLOWED');
console.log('PASS PROG-094-NEXT-PROG-095-RECORDED');
console.log('PASS PROG-094-NO-UNSUPPORTED-READINESS-CLAIMS');
