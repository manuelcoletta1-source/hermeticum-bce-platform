'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { sha256Digest } = require('../../../packages/hbce-core/canonical-json.js');
const {
  STATUS,
  SOURCE_REF,
  COPY_BY_SECTION,
  NON_CLAIM_COPY,
  buildPublicSurfaceCopyPackPayload,
  buildLevel1PublicSurfaceCopyPack
} = require('../../../runtime/level1/build-prog-095-level1-public-surface-copy-pack.js');

const root = path.resolve(__dirname, '../../..');
const read = (p) => fs.readFileSync(path.join(root, p), 'utf8');
const json = (p) => JSON.parse(read(p));
const exists = (p) => fs.existsSync(path.join(root, p));

const docPath = 'docs/launch/level1/prog-095-level1-public-surface-copy-pack.json';
const mdPath = 'docs/launch/level1/prog-095-level1-public-surface-copy-pack.md';
const runtimePath = 'runtime/level1/build-prog-095-level1-public-surface-copy-pack.js';

for (const p of [docPath, mdPath, runtimePath, SOURCE_REF]) assert.equal(exists(p), true, `${p} must exist`);

const doc = json(docPath);
const md = read(mdPath);
const source = json(SOURCE_REF);

assert.equal(doc.proto, 'HBCE-L1-PROG-095-PUBLIC-SURFACE-COPY-PACK-v1');
assert.equal(doc.kind, 'HBCE_LEVEL1_PUBLIC_SURFACE_COPY_PACK');
assert.equal(doc.issue_id, 'PROG-095');
assert.equal(doc.level1_public_surface_copy_pack_status, STATUS);
assert.equal(doc.source_public_surface_content_model_revision_hash, source.revision_hash);
assert.equal(doc.source_public_surface_content_model_revision_hash_valid, true);

const regenerated = buildLevel1PublicSurfaceCopyPack({ rootDir: root, repositoryCommit: doc.repository_baseline_commit });
assert.deepEqual(regenerated, doc);

const body = { ...doc };
delete body.revision_hash;
assert.equal(doc.revision_hash, sha256Digest(body));

assert.equal(doc.inherited_public_surface_content_model.content_model_status, 'LEVEL1_PUBLIC_SURFACE_CONTENT_MODEL_DEFINED_NOT_PUBLIC_READY');
assert.equal(doc.inherited_public_surface_content_model.surface_scope, 'LEVEL1_DECISION_PROOF_PUBLIC_SURFACE_SYNTHETIC_ONLY');
assert.equal(doc.inherited_public_surface_content_model.surface_status, 'CONTENT_MODEL_DEFINED_NOT_PUBLIC_READY');
assert.equal(doc.inherited_public_surface_content_model.public_surface_content_model_ready, true);
assert.equal(doc.inherited_public_surface_content_model.public_surface_scope_locked, true);
assert.equal(doc.inherited_public_surface_content_model.controlled_synthetic_client_demo_pack_ready, true);
assert.equal(doc.inherited_public_surface_content_model.prior_public_surface_copy_ready, false);
assert.equal(doc.inherited_public_surface_content_model.prior_public_surface_evidence_index_ready, false);
assert.equal(doc.inherited_public_surface_content_model.prior_public_surface_readiness_gate_passed, false);
assert.equal(doc.inherited_public_surface_content_model.prior_public_surface_ready, false);
assert.equal(doc.inherited_public_surface_content_model.prior_external_customer_ready, false);
assert.equal(doc.inherited_public_surface_content_model.prior_banking_pack_ready, false);
assert.equal(doc.inherited_public_surface_content_model.prior_level1_launch_ready, false);
assert.equal(doc.inherited_public_surface_content_model.prior_production_ready, false);

const expectedPayload = buildPublicSurfaceCopyPackPayload(source);
const pack = doc.public_surface_copy_pack;

assert.equal(pack.public_surface_copy_pack_payload_digest, sha256Digest(expectedPayload));
assert.equal(pack.public_surface_copy_pack_id, 'PUBLIC-SURFACE-COPY-PACK::HBCE-L1-DECISION-PROOF-0001');
assert.equal(pack.source_public_surface_content_model_ref, SOURCE_REF);
assert.equal(pack.source_public_surface_content_model_digest, source.public_surface_content_model.public_surface_content_model_payload_digest);
assert.equal(pack.surface_scope, 'LEVEL1_DECISION_PROOF_PUBLIC_SURFACE_SYNTHETIC_ONLY');
assert.equal(pack.surface_status, 'COPY_PACK_DEFINED_NOT_PUBLIC_READY');
assert.equal(pack.copy_pack_scope, 'LEVEL1_DECISION_PROOF_PUBLIC_SURFACE_SYNTHETIC_ONLY');
assert.equal(pack.copy_pack_mode, 'PUBLIC_INFORMATION_SURFACE_COPY_PACK');

assert.equal(pack.copy_section_count, Object.keys(COPY_BY_SECTION).length);
assert.equal(pack.copy_sections.length, Object.keys(COPY_BY_SECTION).length);
assert.equal(pack.all_content_model_sections_have_copy, true);
assert.equal(pack.all_copy_sections_bound_to_content_model, true);
assert.equal(pack.all_copy_sections_use_scope_allowed_content, true);
assert.equal(pack.all_excluded_content_absent_from_copy, true);
assert.equal(pack.all_positive_claims_bound_to_prog_092, true);
assert.equal(pack.all_required_non_claims_have_copy, true);
assert.equal(pack.all_non_claims_adjacent_to_positive_claims, true);
assert.equal(pack.all_sections_publication_ready_false, true);

for (const [sectionId, copy] of Object.entries(COPY_BY_SECTION)) {
  const section = pack.copy_sections.find((entry) => entry.section_id === sectionId);
  assert.ok(section, `${sectionId} must exist`);
  assert.equal(section.source_content_model_section_bound, true);
  assert.deepEqual(section.positive_claim_refs, copy.positive_claim_refs);
  assert.equal(section.copy_title, copy.copy_title);
  assert.equal(section.copy_body, copy.copy_body);
  assert.equal(section.copy_approved_for_pack, true);
  assert.equal(section.publication_ready, false);
  assert.equal(section.uses_only_scope_allowed_content, true);
  assert.equal(section.excluded_content_absent, true);
  assert.equal(section.positive_claims_bound_to_prog_092, true);
  assert.equal(section.all_required_non_claims_have_copy, true);
  for (const nonClaim of section.non_claim_copy) {
    assert.equal(typeof nonClaim.copy_line, 'string');
    assert.equal(nonClaim.copy_line.length > 0, true);
    assert.equal(nonClaim.adjacent_to_positive_claim, true);
  }
}

for (const [anchor, copyLine] of Object.entries(NON_CLAIM_COPY)) {
  const present = pack.copy_sections.some((section) =>
    section.non_claim_copy.some((entry) => entry.non_claim_ref === anchor && entry.copy_line === copyLine)
  );
  if (source.public_surface_content_model.required_non_claim_anchors.includes(anchor)) {
    assert.equal(present, true, `${anchor} must be present`);
  }
}

for (const control of [
  'use_only_content_model_sections',
  'use_only_scope_allowed_public_content',
  'exclude_all_scope_excluded_public_content',
  'bind_positive_readiness_claims_to_prog_092',
  'place_non_claim_copy_near_positive_claims',
  'keep_publication_ready_false_until_evidence_index_and_readiness_gate',
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
  assert.equal(pack.copy_pack_controls.includes(control), true, `${control} must be present`);
}

assert.equal(pack.copy_pack_boundary.synthetic_demo_only, true);
assert.equal(pack.copy_pack_boundary.source_content_model_required, true);
assert.equal(pack.copy_pack_boundary.source_scope_lock_required, true);
assert.equal(pack.copy_pack_boundary.source_client_demo_pack_readiness_gate_required, true);
assert.equal(pack.copy_pack_boundary.copy_pack_only, true);
assert.equal(pack.copy_pack_boundary.no_publication_authorization, true);
assert.equal(pack.copy_pack_boundary.no_customer_data, true);
assert.equal(pack.copy_pack_boundary.no_live_system_control, true);
assert.equal(pack.copy_pack_boundary.no_production_integration, true);
assert.equal(pack.copy_pack_boundary.no_legal_validity_claim, true);
assert.equal(pack.copy_pack_boundary.no_public_accreditation_claim, true);
assert.equal(pack.copy_pack_boundary.no_procurement_eligibility_claim, true);
assert.equal(pack.copy_pack_boundary.no_external_effect_claim, true);
assert.equal(pack.copy_pack_boundary.no_business_success_claim, true);
assert.equal(pack.copy_pack_boundary.no_ai_authority_claim, true);
assert.equal(pack.copy_pack_boundary.no_pricing_commitment, true);
assert.equal(pack.copy_pack_boundary.no_sla_commitment, true);
assert.equal(pack.copy_pack_boundary.no_security_certification_claim, true);
assert.equal(pack.copy_pack_boundary.no_customer_logo_without_authorization, true);

assert.equal(pack.source_public_surface_content_model_ready, true);
assert.equal(pack.source_public_surface_scope_locked, true);
assert.equal(pack.source_controlled_synthetic_client_demo_pack_ready, true);
assert.equal(pack.public_surface_copy_ready, true);
assert.equal(pack.public_surface_evidence_index_ready, false);
assert.equal(pack.public_surface_readiness_gate_passed, false);
assert.equal(pack.public_surface_ready, false);
assert.equal(pack.external_customer_ready, false);
assert.equal(pack.banking_pack_ready, false);
assert.equal(pack.level1_launch_ready, false);
assert.equal(pack.production_ready, false);
assert.equal(pack.ai_copy_authority_allowed, false);

assert.equal(pack.copy_pack_checklist.source_public_surface_content_model_hash_valid, true);
assert.equal(pack.copy_pack_checklist.source_public_surface_content_model_ready, true);
assert.equal(pack.copy_pack_checklist.source_public_surface_scope_locked, true);
assert.equal(pack.copy_pack_checklist.source_controlled_synthetic_client_demo_pack_ready, true);
assert.equal(pack.copy_pack_checklist.all_content_model_sections_have_copy, true);
assert.equal(pack.copy_pack_checklist.all_copy_sections_bound_to_content_model, true);
assert.equal(pack.copy_pack_checklist.all_copy_sections_use_scope_allowed_content, true);
assert.equal(pack.copy_pack_checklist.all_excluded_content_absent_from_copy, true);
assert.equal(pack.copy_pack_checklist.all_positive_claims_bound_to_prog_092, true);
assert.equal(pack.copy_pack_checklist.all_required_non_claims_have_copy, true);
assert.equal(pack.copy_pack_checklist.all_non_claims_adjacent_to_positive_claims, true);
assert.equal(pack.copy_pack_checklist.all_sections_publication_ready_false, true);
assert.equal(pack.copy_pack_checklist.public_surface_readiness_excluded, true);
assert.equal(pack.copy_pack_checklist.external_customer_readiness_excluded, true);
assert.equal(pack.copy_pack_checklist.banking_pack_readiness_excluded, true);
assert.equal(pack.copy_pack_checklist.launch_readiness_excluded, true);
assert.equal(pack.copy_pack_checklist.production_readiness_excluded, true);
assert.equal(pack.copy_pack_checklist.ai_authority_absence_confirmed, true);

assert.equal(pack.public_surface_copy_pack_defined, true);
assert.equal(pack.public_surface_copy_pack_is_not_public_surface_readiness, true);
assert.equal(pack.public_surface_copy_pack_is_not_external_customer_readiness, true);
assert.equal(pack.public_surface_copy_pack_is_not_banking_pack_readiness, true);
assert.equal(pack.public_surface_copy_pack_is_not_launch_readiness, true);
assert.equal(pack.public_surface_copy_pack_is_not_production_readiness, true);
assert.equal(pack.public_surface_copy_pack_is_not_legal_validity, true);
assert.equal(pack.public_surface_copy_pack_is_not_security_certification, true);

for (const code of ['PUBLIC_SURFACE_COPY_PACK_MISSING', 'SOURCE_PUBLIC_SURFACE_CONTENT_MODEL_HASH_INVALID', 'PUBLIC_SURFACE_CONTENT_MODEL_NOT_READY', 'CONTENT_MODEL_SECTION_WITHOUT_COPY', 'COPY_SECTION_NOT_BOUND_TO_CONTENT_MODEL', 'COPY_USES_SCOPE_EXCLUDED_CONTENT', 'COPY_USES_NON_ALLOWED_PUBLIC_CONTENT', 'POSITIVE_CLAIM_NOT_BOUND_TO_PROG_092', 'REQUIRED_NON_CLAIM_COPY_MISSING', 'PUBLICATION_READY_BEFORE_PUBLIC_SURFACE_GATE', 'UNSUPPORTED_PUBLIC_READINESS_CLAIM', 'UNSUPPORTED_PRODUCTION_READINESS_CLAIM', 'AI_COPY_AUTHORITY_CLAIM_BLOCKED']) {
  assert.equal(doc.fail_closed_codes.includes(code), true, `${code} must be present`);
}

assert.equal(doc.readiness_state.public_surface_copy_pack_defined, true);
assert.equal(doc.readiness_state.public_surface_copy_ready, true);
assert.equal(doc.readiness_state.source_public_surface_content_model_bound, true);
assert.equal(doc.readiness_state.public_surface_content_model_ready, true);
assert.equal(doc.readiness_state.public_surface_scope_locked, true);
assert.equal(doc.readiness_state.controlled_synthetic_client_demo_pack_ready, true);
assert.equal(doc.readiness_state.all_content_model_sections_have_copy, true);
assert.equal(doc.readiness_state.all_copy_sections_bound_to_content_model, true);
assert.equal(doc.readiness_state.all_copy_sections_use_scope_allowed_content, true);
assert.equal(doc.readiness_state.all_excluded_content_absent_from_copy, true);
assert.equal(doc.readiness_state.all_positive_claims_bound_to_prog_092, true);
assert.equal(doc.readiness_state.all_required_non_claims_have_copy, true);
assert.equal(doc.readiness_state.all_non_claims_adjacent_to_positive_claims, true);
assert.equal(doc.readiness_state.all_sections_publication_ready_false, true);
assert.equal(doc.readiness_state.public_surface_evidence_index_ready, false);
assert.equal(doc.readiness_state.public_surface_readiness_gate_passed, false);
assert.equal(doc.readiness_state.public_surface_ready, false);
assert.equal(doc.readiness_state.external_customer_ready, false);
assert.equal(doc.readiness_state.banking_pack_ready, false);
assert.equal(doc.readiness_state.level1_launch_ready, false);
assert.equal(doc.readiness_state.production_ready, false);

assert.equal(doc.next_required_program, 'PROG-096-HBCE-LEVEL1-PUBLIC-SURFACE-EVIDENCE-INDEX');

assert.equal(doc.non_claims.legal_validity, false);
assert.equal(doc.non_claims.public_accreditation, false);
assert.equal(doc.non_claims.procurement_eligibility, false);
assert.equal(doc.non_claims.external_effect_proven, false);
assert.equal(doc.non_claims.business_success, false);
assert.equal(doc.non_claims.ai_authority, false);
assert.equal(doc.non_claims.autonomous_authority, false);
assert.equal(doc.non_claims.public_surface_ready, false);
assert.equal(doc.non_claims.publication_authorized, false);
assert.equal(doc.non_claims.external_customer_ready, false);
assert.equal(doc.non_claims.banking_pack_ready, false);
assert.equal(doc.non_claims.level1_launch_ready, false);
assert.equal(doc.non_claims.production_ready, false);

assert.match(md, /LEVEL1_PUBLIC_SURFACE_COPY_PACK_DEFINED_NOT_PUBLIC_READY/);
assert.match(md, /The public surface copy pack is defined/);
assert.match(md, /The public surface copy is ready/);
assert.match(md, /The public surface evidence index is not ready/);
assert.match(md, /The copy pack does not authorize publication/);
assert.match(md, /CONTROLLED_SYNTHETIC_CLIENT_DEMO_PACK/);
assert.match(md, /PROG-096-HBCE-LEVEL1-PUBLIC-SURFACE-EVIDENCE-INDEX/);

console.log('PASS PROG-095-PUBLIC-SURFACE-COPY-PACK-DOCS-EXIST');
console.log('PASS PROG-095-PUBLIC-SURFACE-COPY-PACK-HASH-STABLE');
console.log('PASS PROG-095-BUILDER-STABLE');
console.log('PASS PROG-095-SOURCE-PROG-094-INTEGRITY-VALID');
console.log('PASS PROG-095-CONTENT-MODEL-SECTIONS-HAVE-COPY');
console.log('PASS PROG-095-COPY-SECTIONS-BOUND-TO-CONTENT-MODEL');
console.log('PASS PROG-095-POSITIVE-CLAIMS-BOUND-TO-PROG-092');
console.log('PASS PROG-095-NON-CLAIM-COPY-ADJACENT');
console.log('PASS PROG-095-COPY-READY-NOT-PUBLIC-READY');
console.log('PASS PROG-095-PUBLICATION-NOT-AUTHORIZED');
console.log('PASS PROG-095-AI-COPY-AUTHORITY-DISALLOWED');
console.log('PASS PROG-095-NEXT-PROG-096-RECORDED');
console.log('PASS PROG-095-NO-UNSUPPORTED-READINESS-CLAIMS');
