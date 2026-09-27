'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { sha256Digest } = require('../../../packages/hbce-core/canonical-json.js');
const {
  STATUS,
  SOURCE_REF,
  REQUIRED_EVIDENCE_REFS,
  buildPublicSurfaceEvidenceIndexPayload,
  buildLevel1PublicSurfaceEvidenceIndex
} = require('../../../runtime/level1/build-prog-096-level1-public-surface-evidence-index.js');

const root = path.resolve(__dirname, '../../..');
const read = (p) => fs.readFileSync(path.join(root, p), 'utf8');
const json = (p) => JSON.parse(read(p));
const exists = (p) => fs.existsSync(path.join(root, p));

const docPath = 'docs/launch/level1/prog-096-level1-public-surface-evidence-index.json';
const mdPath = 'docs/launch/level1/prog-096-level1-public-surface-evidence-index.md';
const runtimePath = 'runtime/level1/build-prog-096-level1-public-surface-evidence-index.js';

for (const p of [docPath, mdPath, runtimePath, SOURCE_REF, ...REQUIRED_EVIDENCE_REFS]) assert.equal(exists(p), true, `${p} must exist`);

const doc = json(docPath);
const md = read(mdPath);
const source = json(SOURCE_REF);

assert.equal(doc.proto, 'HBCE-L1-PROG-096-PUBLIC-SURFACE-EVIDENCE-INDEX-v1');
assert.equal(doc.kind, 'HBCE_LEVEL1_PUBLIC_SURFACE_EVIDENCE_INDEX');
assert.equal(doc.issue_id, 'PROG-096');
assert.equal(doc.level1_public_surface_evidence_index_status, STATUS);
assert.equal(doc.source_public_surface_copy_pack_revision_hash, source.revision_hash);
assert.equal(doc.source_public_surface_copy_pack_revision_hash_valid, true);

const regenerated = buildLevel1PublicSurfaceEvidenceIndex({ rootDir: root, repositoryCommit: doc.repository_baseline_commit });
assert.deepEqual(regenerated, doc);

const body = { ...doc };
delete body.revision_hash;
assert.equal(doc.revision_hash, sha256Digest(body));

assert.equal(doc.inherited_public_surface_copy_pack.copy_pack_status, 'LEVEL1_PUBLIC_SURFACE_COPY_PACK_DEFINED_NOT_PUBLIC_READY');
assert.equal(doc.inherited_public_surface_copy_pack.public_surface_copy_ready, true);
assert.equal(doc.inherited_public_surface_copy_pack.public_surface_content_model_ready, true);
assert.equal(doc.inherited_public_surface_copy_pack.public_surface_scope_locked, true);
assert.equal(doc.inherited_public_surface_copy_pack.controlled_synthetic_client_demo_pack_ready, true);
assert.equal(doc.inherited_public_surface_copy_pack.prior_public_surface_evidence_index_ready, false);
assert.equal(doc.inherited_public_surface_copy_pack.prior_public_surface_readiness_gate_passed, false);
assert.equal(doc.inherited_public_surface_copy_pack.prior_public_surface_ready, false);
assert.equal(doc.inherited_public_surface_copy_pack.prior_external_customer_ready, false);
assert.equal(doc.inherited_public_surface_copy_pack.prior_banking_pack_ready, false);
assert.equal(doc.inherited_public_surface_copy_pack.prior_level1_launch_ready, false);
assert.equal(doc.inherited_public_surface_copy_pack.prior_production_ready, false);

const expectedPayload = buildPublicSurfaceEvidenceIndexPayload(source, root);
const index = doc.public_surface_evidence_index;

assert.equal(index.public_surface_evidence_index_payload_digest, sha256Digest(expectedPayload));
assert.equal(index.public_surface_evidence_index_id, 'PUBLIC-SURFACE-EVIDENCE-INDEX::HBCE-L1-DECISION-PROOF-0001');
assert.equal(index.source_public_surface_copy_pack_ref, SOURCE_REF);
assert.equal(index.source_public_surface_copy_pack_digest, source.public_surface_copy_pack.public_surface_copy_pack_payload_digest);
assert.equal(index.surface_scope, 'LEVEL1_DECISION_PROOF_PUBLIC_SURFACE_SYNTHETIC_ONLY');
assert.equal(index.surface_status, 'EVIDENCE_INDEX_DEFINED_NOT_PUBLIC_READY');
assert.equal(index.evidence_index_scope, 'LEVEL1_DECISION_PROOF_PUBLIC_SURFACE_SYNTHETIC_ONLY');
assert.equal(index.evidence_index_mode, 'PUBLIC_INFORMATION_SURFACE_EVIDENCE_INDEX');

assert.deepEqual(index.required_evidence_refs, REQUIRED_EVIDENCE_REFS);
assert.equal(index.evidence_item_count, REQUIRED_EVIDENCE_REFS.length);
assert.equal(index.evidence_items.length, REQUIRED_EVIDENCE_REFS.length);
assert.equal(index.all_required_evidence_refs_indexed, true);
assert.equal(index.all_evidence_hashes_valid, true);
assert.equal(index.all_evidence_items_public_surface_safe, true);
assert.equal(index.all_evidence_items_synthetic_only, true);
assert.equal(index.all_evidence_items_customer_data_free, true);
assert.equal(index.all_evidence_items_publication_authorization_free, true);

for (const ref of REQUIRED_EVIDENCE_REFS) {
  const item = index.evidence_items.find((entry) => entry.evidence_ref === ref);
  assert.ok(item, `${ref} must be indexed`);
  assert.equal(item.revision_hash_valid, true);
  assert.equal(item.public_surface_safe, true);
  assert.equal(item.synthetic_only, true);
  assert.equal(item.customer_data_included, false);
  assert.equal(item.live_system_control_included, false);
  assert.equal(item.production_integration_included, false);
  assert.equal(item.legal_validity_claim_included, false);
  assert.equal(item.security_certification_claim_included, false);
  assert.equal(item.ai_authority_claim_included, false);
  assert.equal(item.publication_authorization_included, false);
  assert.equal(item.supports_public_surface_claims.length > 0, true);
}

for (const binding of index.positive_public_claim_bindings) {
  assert.equal(binding.claim_allowed, true);
  assert.equal(REQUIRED_EVIDENCE_REFS.includes(binding.evidence_ref), true);
  assert.equal(typeof binding.claim_boundary, 'string');
  assert.equal(binding.claim_boundary.length > 0, true);
}

assert.equal(index.blocked_public_claim_bindings.public_surface_ready, true);
assert.equal(index.blocked_public_claim_bindings.publication_authorized, true);
assert.equal(index.blocked_public_claim_bindings.external_customer_delivery_ready, true);
assert.equal(index.blocked_public_claim_bindings.banking_pack_ready, true);
assert.equal(index.blocked_public_claim_bindings.level1_launch_ready, true);
assert.equal(index.blocked_public_claim_bindings.production_ready, true);
assert.equal(index.blocked_public_claim_bindings.legal_validity, true);
assert.equal(index.blocked_public_claim_bindings.security_certification, true);
assert.equal(index.blocked_public_claim_bindings.ai_authority, true);

for (const control of [
  'index_only_required_public_surface_evidence',
  'validate_all_indexed_revision_hashes',
  'bind_positive_public_claims_to_evidence_refs',
  'preserve_non_claims_near_positive_claims',
  'do_not_authorize_publication',
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
  assert.equal(index.evidence_index_controls.includes(control), true, `${control} must be present`);
}

assert.equal(index.evidence_index_boundary.synthetic_demo_only, true);
assert.equal(index.evidence_index_boundary.source_copy_pack_required, true);
assert.equal(index.evidence_index_boundary.source_content_model_required, true);
assert.equal(index.evidence_index_boundary.source_scope_lock_required, true);
assert.equal(index.evidence_index_boundary.source_client_demo_pack_readiness_gate_required, true);
assert.equal(index.evidence_index_boundary.evidence_index_only, true);
assert.equal(index.evidence_index_boundary.no_publication_authorization, true);
assert.equal(index.evidence_index_boundary.no_customer_data, true);
assert.equal(index.evidence_index_boundary.no_live_system_control, true);
assert.equal(index.evidence_index_boundary.no_production_integration, true);
assert.equal(index.evidence_index_boundary.no_legal_validity_claim, true);
assert.equal(index.evidence_index_boundary.no_public_accreditation_claim, true);
assert.equal(index.evidence_index_boundary.no_procurement_eligibility_claim, true);
assert.equal(index.evidence_index_boundary.no_external_effect_claim, true);
assert.equal(index.evidence_index_boundary.no_business_success_claim, true);
assert.equal(index.evidence_index_boundary.no_ai_authority_claim, true);
assert.equal(index.evidence_index_boundary.no_pricing_commitment, true);
assert.equal(index.evidence_index_boundary.no_sla_commitment, true);
assert.equal(index.evidence_index_boundary.no_security_certification_claim, true);
assert.equal(index.evidence_index_boundary.no_customer_logo_without_authorization, true);

assert.equal(index.public_surface_evidence_index_ready, true);
assert.equal(index.public_surface_readiness_gate_passed, false);
assert.equal(index.public_surface_ready, false);
assert.equal(index.publication_authorized, false);
assert.equal(index.external_customer_ready, false);
assert.equal(index.banking_pack_ready, false);
assert.equal(index.level1_launch_ready, false);
assert.equal(index.production_ready, false);
assert.equal(index.ai_evidence_index_authority_allowed, false);

assert.equal(index.evidence_index_checklist.source_public_surface_copy_pack_hash_valid, true);
assert.equal(index.evidence_index_checklist.source_public_surface_copy_ready, true);
assert.equal(index.evidence_index_checklist.all_required_evidence_refs_indexed, true);
assert.equal(index.evidence_index_checklist.all_evidence_hashes_valid, true);
assert.equal(index.evidence_index_checklist.positive_public_claims_bound_to_evidence, true);
assert.equal(index.evidence_index_checklist.blocked_public_claims_preserved, true);
assert.equal(index.evidence_index_checklist.public_surface_readiness_excluded, true);
assert.equal(index.evidence_index_checklist.launch_readiness_excluded, true);
assert.equal(index.evidence_index_checklist.production_readiness_excluded, true);
assert.equal(index.evidence_index_checklist.ai_authority_absence_confirmed, true);

assert.equal(index.public_surface_evidence_index_defined, true);
assert.equal(index.public_surface_evidence_index_is_not_public_surface_readiness, true);
assert.equal(index.public_surface_evidence_index_is_not_publication_authorization, true);
assert.equal(index.public_surface_evidence_index_is_not_external_customer_readiness, true);
assert.equal(index.public_surface_evidence_index_is_not_banking_pack_readiness, true);
assert.equal(index.public_surface_evidence_index_is_not_launch_readiness, true);
assert.equal(index.public_surface_evidence_index_is_not_production_readiness, true);
assert.equal(index.public_surface_evidence_index_is_not_legal_validity, true);
assert.equal(index.public_surface_evidence_index_is_not_security_certification, true);

for (const code of ['PUBLIC_SURFACE_EVIDENCE_INDEX_MISSING', 'SOURCE_PUBLIC_SURFACE_COPY_PACK_HASH_INVALID', 'PUBLIC_SURFACE_COPY_PACK_NOT_READY', 'REQUIRED_PUBLIC_SURFACE_EVIDENCE_REF_MISSING', 'PUBLIC_SURFACE_EVIDENCE_HASH_INVALID', 'PUBLIC_SURFACE_EVIDENCE_NOT_SAFE', 'POSITIVE_PUBLIC_CLAIM_WITHOUT_EVIDENCE_BINDING', 'PUBLICATION_AUTHORIZED_BEFORE_READINESS_GATE', 'UNSUPPORTED_PUBLIC_READINESS_CLAIM', 'UNSUPPORTED_PRODUCTION_READINESS_CLAIM', 'AI_EVIDENCE_INDEX_AUTHORITY_CLAIM_BLOCKED']) {
  assert.equal(doc.fail_closed_codes.includes(code), true, `${code} must be present`);
}

assert.equal(doc.readiness_state.public_surface_evidence_index_defined, true);
assert.equal(doc.readiness_state.public_surface_evidence_index_ready, true);
assert.equal(doc.readiness_state.source_public_surface_copy_pack_bound, true);
assert.equal(doc.readiness_state.public_surface_copy_ready, true);
assert.equal(doc.readiness_state.public_surface_content_model_ready, true);
assert.equal(doc.readiness_state.public_surface_scope_locked, true);
assert.equal(doc.readiness_state.controlled_synthetic_client_demo_pack_ready, true);
assert.equal(doc.readiness_state.all_required_evidence_refs_indexed, true);
assert.equal(doc.readiness_state.all_evidence_hashes_valid, true);
assert.equal(doc.readiness_state.positive_public_claims_bound_to_evidence, true);
assert.equal(doc.readiness_state.blocked_public_claims_preserved, true);
assert.equal(doc.readiness_state.public_surface_readiness_gate_passed, false);
assert.equal(doc.readiness_state.public_surface_ready, false);
assert.equal(doc.readiness_state.publication_authorized, false);
assert.equal(doc.readiness_state.external_customer_ready, false);
assert.equal(doc.readiness_state.banking_pack_ready, false);
assert.equal(doc.readiness_state.level1_launch_ready, false);
assert.equal(doc.readiness_state.production_ready, false);

assert.equal(doc.next_required_program, 'PROG-097-HBCE-LEVEL1-PUBLIC-SURFACE-READINESS-GATE');

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

assert.match(md, /LEVEL1_PUBLIC_SURFACE_EVIDENCE_INDEX_DEFINED_NOT_PUBLIC_READY/);
assert.match(md, /The public surface evidence index is defined/);
assert.match(md, /The public surface evidence index is ready/);
assert.match(md, /Publication is not authorized/);
assert.match(md, /PROG-092 client demo pack readiness gate/);
assert.match(md, /The evidence index does not create public surface readiness/);
assert.match(md, /PROG-097-HBCE-LEVEL1-PUBLIC-SURFACE-READINESS-GATE/);

console.log('PASS PROG-096-PUBLIC-SURFACE-EVIDENCE-INDEX-DOCS-EXIST');
console.log('PASS PROG-096-PUBLIC-SURFACE-EVIDENCE-INDEX-HASH-STABLE');
console.log('PASS PROG-096-BUILDER-STABLE');
console.log('PASS PROG-096-SOURCE-PROG-095-INTEGRITY-VALID');
console.log('PASS PROG-096-REQUIRED-EVIDENCE-REFS-INDEXED');
console.log('PASS PROG-096-ALL-EVIDENCE-HASHES-VALID');
console.log('PASS PROG-096-POSITIVE-PUBLIC-CLAIMS-BOUND');
console.log('PASS PROG-096-BLOCKED-PUBLIC-CLAIMS-PRESERVED');
console.log('PASS PROG-096-EVIDENCE-INDEX-READY-NOT-PUBLIC-READY');
console.log('PASS PROG-096-PUBLICATION-NOT-AUTHORIZED');
console.log('PASS PROG-096-AI-EVIDENCE-INDEX-AUTHORITY-DISALLOWED');
console.log('PASS PROG-096-NEXT-PROG-097-RECORDED');
console.log('PASS PROG-096-NO-UNSUPPORTED-READINESS-CLAIMS');
