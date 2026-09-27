'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { sha256Digest } = require('../../../packages/hbce-core/canonical-json.js');
const {
  STATUS,
  SOURCE_REF,
  buildPublicSurfaceReadinessGatePayload,
  buildLevel1PublicSurfaceReadinessGate
} = require('../../../runtime/level1/build-prog-097-level1-public-surface-readiness-gate.js');

const root = path.resolve(__dirname, '../../..');
const read = (p) => fs.readFileSync(path.join(root, p), 'utf8');
const json = (p) => JSON.parse(read(p));
const exists = (p) => fs.existsSync(path.join(root, p));

const docPath = 'docs/launch/level1/prog-097-level1-public-surface-readiness-gate.json';
const mdPath = 'docs/launch/level1/prog-097-level1-public-surface-readiness-gate.md';
const runtimePath = 'runtime/level1/build-prog-097-level1-public-surface-readiness-gate.js';

for (const p of [docPath, mdPath, runtimePath, SOURCE_REF]) assert.equal(exists(p), true, `${p} must exist`);

const doc = json(docPath);
const md = read(mdPath);
const source = json(SOURCE_REF);

assert.equal(doc.proto, 'HBCE-L1-PROG-097-PUBLIC-SURFACE-READINESS-GATE-v1');
assert.equal(doc.kind, 'HBCE_LEVEL1_PUBLIC_SURFACE_READINESS_GATE');
assert.equal(doc.issue_id, 'PROG-097');
assert.equal(doc.level1_public_surface_readiness_gate_status, STATUS);
assert.equal(doc.source_public_surface_evidence_index_revision_hash, source.revision_hash);
assert.equal(doc.source_public_surface_evidence_index_revision_hash_valid, true);

const regenerated = buildLevel1PublicSurfaceReadinessGate({ rootDir: root, repositoryCommit: doc.repository_baseline_commit });
assert.deepEqual(regenerated, doc);

const body = { ...doc };
delete body.revision_hash;
assert.equal(doc.revision_hash, sha256Digest(body));

assert.equal(doc.inherited_public_surface_evidence_index.evidence_index_status, 'LEVEL1_PUBLIC_SURFACE_EVIDENCE_INDEX_DEFINED_NOT_PUBLIC_READY');
assert.equal(doc.inherited_public_surface_evidence_index.public_surface_evidence_index_ready, true);
assert.equal(doc.inherited_public_surface_evidence_index.public_surface_copy_ready, true);
assert.equal(doc.inherited_public_surface_evidence_index.public_surface_content_model_ready, true);
assert.equal(doc.inherited_public_surface_evidence_index.public_surface_scope_locked, true);
assert.equal(doc.inherited_public_surface_evidence_index.controlled_synthetic_client_demo_pack_ready, true);
assert.equal(doc.inherited_public_surface_evidence_index.prior_public_surface_readiness_gate_passed, false);
assert.equal(doc.inherited_public_surface_evidence_index.prior_public_surface_ready, false);
assert.equal(doc.inherited_public_surface_evidence_index.prior_publication_authorized, false);
assert.equal(doc.inherited_public_surface_evidence_index.prior_external_customer_ready, false);
assert.equal(doc.inherited_public_surface_evidence_index.prior_banking_pack_ready, false);
assert.equal(doc.inherited_public_surface_evidence_index.prior_level1_launch_ready, false);
assert.equal(doc.inherited_public_surface_evidence_index.prior_production_ready, false);

const expectedPayload = buildPublicSurfaceReadinessGatePayload(source);
const gate = doc.public_surface_readiness_gate;

assert.equal(gate.public_surface_readiness_gate_payload_digest, sha256Digest(expectedPayload));
assert.equal(gate.public_surface_readiness_gate_id, 'PUBLIC-SURFACE-READINESS-GATE::HBCE-L1-DECISION-PROOF-0001');
assert.equal(gate.source_public_surface_evidence_index_ref, SOURCE_REF);
assert.equal(gate.source_public_surface_evidence_index_digest, source.public_surface_evidence_index.public_surface_evidence_index_payload_digest);
assert.equal(gate.gate_scope, 'LEVEL1_DECISION_PROOF_PUBLIC_SURFACE_CONTROLLED_INFORMATION_ONLY');
assert.equal(gate.gate_status, 'PASS_CONTROLLED_PUBLIC_INFORMATION_SURFACE_READY');
assert.equal(gate.gate_result, 'PUBLIC_SURFACE_READY_CONTROLLED_INFORMATION_ONLY');
assert.equal(gate.all_gate_criteria_passed, true);

for (const [key, value] of Object.entries(gate.gate_criteria)) {
  assert.equal(value, true, `${key} must pass`);
}

assert.equal(gate.approved_public_surface_claims.public_surface_ready_controlled_information_only, true);
assert.equal(gate.approved_public_surface_claims.publication_authorized_for_controlled_public_information_surface, true);
assert.equal(gate.approved_public_surface_claims.controlled_synthetic_client_demo_pack_ready, true);
assert.equal(gate.approved_public_surface_claims.public_surface_scope_locked, true);
assert.equal(gate.approved_public_surface_claims.public_surface_content_model_ready, true);
assert.equal(gate.approved_public_surface_claims.public_surface_copy_ready, true);
assert.equal(gate.approved_public_surface_claims.public_surface_evidence_index_ready, true);

assert.equal(gate.blocked_claims_preserved_after_gate.external_customer_delivery_ready, true);
assert.equal(gate.blocked_claims_preserved_after_gate.banking_pack_ready, true);
assert.equal(gate.blocked_claims_preserved_after_gate.level1_launch_ready, true);
assert.equal(gate.blocked_claims_preserved_after_gate.production_ready, true);
assert.equal(gate.blocked_claims_preserved_after_gate.legal_validity, true);
assert.equal(gate.blocked_claims_preserved_after_gate.security_certification, true);
assert.equal(gate.blocked_claims_preserved_after_gate.ai_authority, true);
assert.equal(gate.blocked_claims_preserved_after_gate.autonomous_execution, true);

assert.equal(gate.publication_authorization.authorized, true);
assert.equal(gate.publication_authorization.authorization_scope, 'controlled_public_information_surface_only');
assert.deepEqual(gate.publication_authorization.authorized_surface_types, ['public_website', 'public_one_pager', 'public_intro_deck', 'public_contact_or_intake_page']);
assert.equal(gate.publication_authorization.customer_data_allowed, false);
assert.equal(gate.publication_authorization.customer_logo_allowed_without_authorization, false);
assert.equal(gate.publication_authorization.legal_validity_claim_allowed, false);
assert.equal(gate.publication_authorization.public_accreditation_claim_allowed, false);
assert.equal(gate.publication_authorization.procurement_eligibility_claim_allowed, false);
assert.equal(gate.publication_authorization.security_certification_claim_allowed, false);
assert.equal(gate.publication_authorization.ai_authority_claim_allowed, false);

for (const control of [
  'publish_only_controlled_public_information_surface',
  'keep_non_claims_visible_near_positive_claims',
  'preserve_evidence_index_references',
  'do_not_add_customer_data',
  'do_not_add_customer_logos_without_authorization',
  'do_not_claim_external_customer_delivery_readiness',
  'do_not_claim_banking_pack_readiness',
  'do_not_claim_level1_launch_readiness',
  'do_not_claim_production_readiness',
  'do_not_claim_legal_validity',
  'do_not_claim_public_accreditation',
  'do_not_claim_procurement_eligibility',
  'do_not_claim_security_certification',
  'do_not_authorize_ai_authority',
  'fail_closed_on_unindexed_public_claim'
]) {
  assert.equal(gate.required_public_surface_controls.includes(control), true, `${control} must be present`);
}

assert.equal(gate.public_surface_boundary_after_gate.controlled_information_surface_only, true);
assert.equal(gate.public_surface_boundary_after_gate.synthetic_demo_boundary_preserved, true);
assert.equal(gate.public_surface_boundary_after_gate.evidence_index_required, true);
assert.equal(gate.public_surface_boundary_after_gate.no_customer_data, true);
assert.equal(gate.public_surface_boundary_after_gate.no_live_system_control, true);
assert.equal(gate.public_surface_boundary_after_gate.no_production_integration, true);
assert.equal(gate.public_surface_boundary_after_gate.no_legal_validity_claim, true);
assert.equal(gate.public_surface_boundary_after_gate.no_public_accreditation_claim, true);
assert.equal(gate.public_surface_boundary_after_gate.no_procurement_eligibility_claim, true);
assert.equal(gate.public_surface_boundary_after_gate.no_external_effect_claim, true);
assert.equal(gate.public_surface_boundary_after_gate.no_business_success_claim, true);
assert.equal(gate.public_surface_boundary_after_gate.no_ai_authority_claim, true);
assert.equal(gate.public_surface_boundary_after_gate.no_pricing_commitment, true);
assert.equal(gate.public_surface_boundary_after_gate.no_sla_commitment, true);
assert.equal(gate.public_surface_boundary_after_gate.no_security_certification_claim, true);
assert.equal(gate.public_surface_boundary_after_gate.no_customer_logo_without_authorization, true);

assert.equal(gate.source_public_surface_evidence_index_ready, true);
assert.equal(gate.source_public_surface_copy_ready, true);
assert.equal(gate.source_public_surface_content_model_ready, true);
assert.equal(gate.source_public_surface_scope_locked, true);
assert.equal(gate.source_controlled_synthetic_client_demo_pack_ready, true);
assert.equal(gate.public_surface_readiness_gate_passed, true);
assert.equal(gate.public_surface_ready, true);
assert.equal(gate.publication_authorized, true);
assert.equal(gate.external_customer_ready, false);
assert.equal(gate.banking_pack_ready, false);
assert.equal(gate.level1_launch_ready, false);
assert.equal(gate.production_ready, false);
assert.equal(gate.ai_readiness_gate_authority_allowed, false);

assert.equal(gate.readiness_gate_checklist.source_public_surface_evidence_index_hash_valid, true);
assert.equal(gate.readiness_gate_checklist.source_public_surface_evidence_index_ready, true);
assert.equal(gate.readiness_gate_checklist.source_public_surface_copy_ready, true);
assert.equal(gate.readiness_gate_checklist.source_public_surface_content_model_ready, true);
assert.equal(gate.readiness_gate_checklist.source_public_surface_scope_locked, true);
assert.equal(gate.readiness_gate_checklist.source_controlled_synthetic_client_demo_pack_ready, true);
assert.equal(gate.readiness_gate_checklist.all_required_evidence_refs_indexed, true);
assert.equal(gate.readiness_gate_checklist.all_evidence_hashes_valid, true);
assert.equal(gate.readiness_gate_checklist.positive_public_claims_bound_to_evidence, true);
assert.equal(gate.readiness_gate_checklist.blocked_public_claims_preserved, true);
assert.equal(gate.readiness_gate_checklist.publication_authorization_scope_limited, true);
assert.equal(gate.readiness_gate_checklist.external_customer_readiness_excluded, true);
assert.equal(gate.readiness_gate_checklist.banking_pack_readiness_excluded, true);
assert.equal(gate.readiness_gate_checklist.launch_readiness_excluded, true);
assert.equal(gate.readiness_gate_checklist.production_readiness_excluded, true);
assert.equal(gate.readiness_gate_checklist.ai_authority_absence_confirmed, true);

assert.equal(gate.public_surface_readiness_gate_defined, true);
assert.equal(gate.public_surface_readiness_gate_is_controlled_information_only, true);
assert.equal(gate.public_surface_readiness_gate_is_not_external_customer_readiness, true);
assert.equal(gate.public_surface_readiness_gate_is_not_banking_pack_readiness, true);
assert.equal(gate.public_surface_readiness_gate_is_not_launch_readiness, true);
assert.equal(gate.public_surface_readiness_gate_is_not_production_readiness, true);
assert.equal(gate.public_surface_readiness_gate_is_not_legal_validity, true);
assert.equal(gate.public_surface_readiness_gate_is_not_security_certification, true);
assert.equal(gate.public_surface_readiness_gate_does_not_authorize_ai_authority, true);

for (const code of ['PUBLIC_SURFACE_READINESS_GATE_MISSING', 'SOURCE_PUBLIC_SURFACE_EVIDENCE_INDEX_HASH_INVALID', 'PUBLIC_SURFACE_EVIDENCE_INDEX_NOT_READY', 'PUBLIC_SURFACE_COPY_NOT_READY', 'PUBLIC_SURFACE_CONTENT_MODEL_NOT_READY', 'PUBLIC_SURFACE_SCOPE_NOT_LOCKED', 'CONTROLLED_SYNTHETIC_CLIENT_DEMO_PACK_NOT_READY', 'REQUIRED_PUBLIC_SURFACE_EVIDENCE_REF_MISSING', 'PUBLIC_SURFACE_EVIDENCE_HASH_INVALID', 'POSITIVE_PUBLIC_CLAIM_WITHOUT_EVIDENCE_BINDING', 'BLOCKED_PUBLIC_CLAIM_NOT_PRESERVED', 'UNSUPPORTED_EXTERNAL_CUSTOMER_READINESS_CLAIM', 'UNSUPPORTED_BANKING_READINESS_CLAIM', 'UNSUPPORTED_LAUNCH_READINESS_CLAIM', 'UNSUPPORTED_PRODUCTION_READINESS_CLAIM', 'AI_READINESS_GATE_AUTHORITY_CLAIM_BLOCKED']) {
  assert.equal(doc.fail_closed_codes.includes(code), true, `${code} must be present`);
}

assert.equal(doc.readiness_state.public_surface_readiness_gate_defined, true);
assert.equal(doc.readiness_state.public_surface_readiness_gate_passed, true);
assert.equal(doc.readiness_state.public_surface_ready, true);
assert.equal(doc.readiness_state.publication_authorized, true);
assert.equal(doc.readiness_state.publication_authorization_scope, 'controlled_public_information_surface_only');
assert.equal(doc.readiness_state.source_public_surface_evidence_index_bound, true);
assert.equal(doc.readiness_state.public_surface_evidence_index_ready, true);
assert.equal(doc.readiness_state.public_surface_copy_ready, true);
assert.equal(doc.readiness_state.public_surface_content_model_ready, true);
assert.equal(doc.readiness_state.public_surface_scope_locked, true);
assert.equal(doc.readiness_state.controlled_synthetic_client_demo_pack_ready, true);
assert.equal(doc.readiness_state.all_gate_criteria_passed, true);
assert.equal(doc.readiness_state.publication_authorization_scope_limited, true);
assert.equal(doc.readiness_state.external_customer_ready, false);
assert.equal(doc.readiness_state.banking_pack_ready, false);
assert.equal(doc.readiness_state.level1_launch_ready, false);
assert.equal(doc.readiness_state.production_ready, false);

assert.equal(doc.next_required_program, 'PROG-098-HBCE-LEVEL1-PUBLIC-SURFACE-PUBLICATION-SNAPSHOT');

assert.equal(doc.non_claims.legal_validity, false);
assert.equal(doc.non_claims.public_accreditation, false);
assert.equal(doc.non_claims.procurement_eligibility, false);
assert.equal(doc.non_claims.external_effect_proven, false);
assert.equal(doc.non_claims.business_success, false);
assert.equal(doc.non_claims.ai_authority, false);
assert.equal(doc.non_claims.autonomous_authority, false);
assert.equal(doc.non_claims.external_customer_ready, false);
assert.equal(doc.non_claims.banking_pack_ready, false);
assert.equal(doc.non_claims.level1_launch_ready, false);
assert.equal(doc.non_claims.production_ready, false);

assert.match(md, /LEVEL1_PUBLIC_SURFACE_READINESS_GATE_PASSED_CONTROLLED_INFORMATION_ONLY/);
assert.match(md, /The public surface readiness gate is passed/);
assert.match(md, /The public surface is ready only as a controlled public information surface/);
assert.match(md, /Publication is authorized only for the controlled public information surface/);
assert.match(md, /The readiness gate does not create external customer delivery readiness/);
assert.match(md, /The readiness gate does not create production readiness/);
assert.match(md, /The readiness gate does not authorize AI authority/);
assert.match(md, /PROG-098-HBCE-LEVEL1-PUBLIC-SURFACE-PUBLICATION-SNAPSHOT/);

console.log('PASS PROG-097-PUBLIC-SURFACE-READINESS-GATE-DOCS-EXIST');
console.log('PASS PROG-097-PUBLIC-SURFACE-READINESS-GATE-HASH-STABLE');
console.log('PASS PROG-097-BUILDER-STABLE');
console.log('PASS PROG-097-SOURCE-PROG-096-INTEGRITY-VALID');
console.log('PASS PROG-097-ALL-GATE-CRITERIA-PASSED');
console.log('PASS PROG-097-CONTROLLED-PUBLIC-INFORMATION-SURFACE-READY');
console.log('PASS PROG-097-PUBLICATION-AUTHORIZED-CONTROLLED-ONLY');
console.log('PASS PROG-097-EXTERNAL-CUSTOMER-READINESS-BLOCKED');
console.log('PASS PROG-097-BANKING-LAUNCH-PRODUCTION-READINESS-BLOCKED');
console.log('PASS PROG-097-AI-READINESS-GATE-AUTHORITY-DISALLOWED');
console.log('PASS PROG-097-NEXT-PROG-098-RECORDED');
console.log('PASS PROG-097-NO-UNSUPPORTED-READINESS-CLAIMS');
