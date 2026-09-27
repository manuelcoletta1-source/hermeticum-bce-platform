'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { sha256Digest } = require('../../../packages/hbce-core/canonical-json.js');
const {
  STATUS,
  SOURCE_REF,
  ALLOWED_PUBLIC_CONTENT,
  EXCLUDED_PUBLIC_CONTENT,
  buildPublicSurfaceScopePayload,
  buildLevel1PublicSurfaceScopeLock
} = require('../../../runtime/level1/build-prog-093-level1-public-surface-scope-lock.js');

const root = path.resolve(__dirname, '../../..');
const read = (p) => fs.readFileSync(path.join(root, p), 'utf8');
const json = (p) => JSON.parse(read(p));
const exists = (p) => fs.existsSync(path.join(root, p));

const docPath = 'docs/launch/level1/prog-093-level1-public-surface-scope-lock.json';
const mdPath = 'docs/launch/level1/prog-093-level1-public-surface-scope-lock.md';
const runtimePath = 'runtime/level1/build-prog-093-level1-public-surface-scope-lock.js';

for (const p of [docPath, mdPath, runtimePath, SOURCE_REF]) assert.equal(exists(p), true, `${p} must exist`);

const doc = json(docPath);
const md = read(mdPath);
const source = json(SOURCE_REF);

assert.equal(doc.proto, 'HBCE-L1-PROG-093-PUBLIC-SURFACE-SCOPE-LOCK-v1');
assert.equal(doc.kind, 'HBCE_LEVEL1_PUBLIC_SURFACE_SCOPE_LOCK');
assert.equal(doc.issue_id, 'PROG-093');
assert.equal(doc.level1_public_surface_scope_lock_status, STATUS);
assert.equal(doc.source_client_demo_pack_readiness_gate_revision_hash, source.revision_hash);
assert.equal(doc.source_client_demo_pack_readiness_gate_revision_hash_valid, true);

const regenerated = buildLevel1PublicSurfaceScopeLock({ rootDir: root, repositoryCommit: doc.repository_baseline_commit });
assert.deepEqual(regenerated, doc);

const body = { ...doc };
delete body.revision_hash;
assert.equal(doc.revision_hash, sha256Digest(body));

assert.equal(doc.inherited_client_demo_pack_readiness_gate.readiness_gate_status, 'LEVEL1_CLIENT_DEMO_PACK_READINESS_GATE_PASSED_CONTROLLED_SYNTHETIC_ONLY');
assert.equal(doc.inherited_client_demo_pack_readiness_gate.gate_result, 'PASS_CONTROLLED_SYNTHETIC_CLIENT_DEMO_PACK_READY');
assert.equal(doc.inherited_client_demo_pack_readiness_gate.gate_passed, true);
assert.equal(doc.inherited_client_demo_pack_readiness_gate.controlled_synthetic_client_demo_pack_ready, true);
assert.equal(doc.inherited_client_demo_pack_readiness_gate.prior_public_surface_ready, false);
assert.equal(doc.inherited_client_demo_pack_readiness_gate.prior_external_customer_ready, false);
assert.equal(doc.inherited_client_demo_pack_readiness_gate.prior_banking_pack_ready, false);
assert.equal(doc.inherited_client_demo_pack_readiness_gate.prior_level1_launch_ready, false);
assert.equal(doc.inherited_client_demo_pack_readiness_gate.prior_production_ready, false);

const expectedPayload = buildPublicSurfaceScopePayload(source);
const scope = doc.public_surface_scope_lock;

assert.equal(scope.public_surface_scope_payload_digest, sha256Digest(expectedPayload));
assert.equal(scope.public_surface_scope_id, 'PUBLIC-SURFACE-SCOPE::HBCE-L1-DECISION-PROOF-0001');
assert.equal(scope.source_client_demo_pack_readiness_gate_ref, SOURCE_REF);
assert.equal(scope.source_client_demo_pack_readiness_gate_digest, source.client_demo_pack_readiness_gate.readiness_gate_payload_digest);
assert.equal(scope.surface_scope, 'LEVEL1_DECISION_PROOF_PUBLIC_SURFACE_SYNTHETIC_ONLY');
assert.equal(scope.surface_status, 'SCOPE_LOCKED_NOT_PUBLIC_READY');
assert.equal(scope.surface_mode, 'PUBLIC_INFORMATION_SURFACE_SCOPE_LOCK');

assert.deepEqual(scope.allowed_public_content, ALLOWED_PUBLIC_CONTENT);
assert.deepEqual(scope.excluded_public_content, EXCLUDED_PUBLIC_CONTENT);

for (const item of ALLOWED_PUBLIC_CONTENT) {
  assert.equal(scope.allowed_public_content.includes(item), true, `${item} allowed`);
}

for (const item of EXCLUDED_PUBLIC_CONTENT) {
  assert.equal(scope.excluded_public_content.includes(item), true, `${item} excluded`);
}

assert.equal(scope.public_surface_claims_allowed.company_identity, true);
assert.equal(scope.public_surface_claims_allowed.level1_problem_statement, true);
assert.equal(scope.public_surface_claims_allowed.human_governed_decision_proof_description, true);
assert.equal(scope.public_surface_claims_allowed.controlled_synthetic_client_demo_pack_ready, true);
assert.equal(scope.public_surface_claims_allowed.level1_client_pack_ready_inside_synthetic_demo_boundary, true);
assert.equal(scope.public_surface_claims_allowed.public_surface_scope_locked, true);
assert.equal(scope.public_surface_claims_allowed.controlled_pilot_intake_available, true);

assert.equal(scope.public_surface_claims_blocked.public_surface_ready, true);
assert.equal(scope.public_surface_claims_blocked.external_customer_delivery_ready, true);
assert.equal(scope.public_surface_claims_blocked.banking_pack_ready, true);
assert.equal(scope.public_surface_claims_blocked.level1_launch_ready, true);
assert.equal(scope.public_surface_claims_blocked.production_ready, true);
assert.equal(scope.public_surface_claims_blocked.legal_validity, true);
assert.equal(scope.public_surface_claims_blocked.public_accreditation, true);
assert.equal(scope.public_surface_claims_blocked.procurement_eligibility, true);
assert.equal(scope.public_surface_claims_blocked.security_certification, true);
assert.equal(scope.public_surface_claims_blocked.pricing_commitment, true);
assert.equal(scope.public_surface_claims_blocked.sla_commitment, true);
assert.equal(scope.public_surface_claims_blocked.ai_authority, true);
assert.equal(scope.public_surface_claims_blocked.autonomous_execution, true);

for (const control of [
  'state_synthetic_only_boundary',
  'state_controlled_demo_pack_boundary',
  'bind_claims_to_prog_092_readiness_gate',
  'show_non_claims_near_positive_claims',
  'do_not_use_customer_data',
  'do_not_use_customer_logos_without_authorization',
  'do_not_claim_public_surface_readiness_until_public_surface_gate',
  'do_not_claim_external_customer_delivery_readiness',
  'do_not_claim_banking_pack_readiness',
  'do_not_claim_level1_launch_readiness',
  'do_not_claim_production_readiness',
  'do_not_claim_legal_validity',
  'do_not_claim_security_certification',
  'do_not_authorize_ai_authority'
]) {
  assert.equal(scope.required_surface_controls.includes(control), true, `${control} must be present`);
}

assert.equal(scope.public_surface_boundary.synthetic_demo_only, true);
assert.equal(scope.public_surface_boundary.client_demo_pack_readiness_gate_required, true);
assert.equal(scope.public_surface_boundary.public_surface_scope_only, true);
assert.equal(scope.public_surface_boundary.no_customer_data, true);
assert.equal(scope.public_surface_boundary.no_live_system_control, true);
assert.equal(scope.public_surface_boundary.no_production_integration, true);
assert.equal(scope.public_surface_boundary.no_legal_validity_claim, true);
assert.equal(scope.public_surface_boundary.no_public_accreditation_claim, true);
assert.equal(scope.public_surface_boundary.no_procurement_eligibility_claim, true);
assert.equal(scope.public_surface_boundary.no_external_effect_claim, true);
assert.equal(scope.public_surface_boundary.no_business_success_claim, true);
assert.equal(scope.public_surface_boundary.no_ai_authority_claim, true);
assert.equal(scope.public_surface_boundary.no_pricing_commitment, true);
assert.equal(scope.public_surface_boundary.no_sla_commitment, true);
assert.equal(scope.public_surface_boundary.no_security_certification_claim, true);
assert.equal(scope.public_surface_boundary.no_customer_logo_without_authorization, true);

assert.equal(scope.source_client_demo_pack_readiness_gate_passed, true);
assert.equal(scope.controlled_synthetic_client_demo_pack_ready, true);
assert.equal(scope.public_surface_scope_locked, true);
assert.equal(scope.public_surface_content_model_ready, false);
assert.equal(scope.public_surface_copy_ready, false);
assert.equal(scope.public_surface_evidence_index_ready, false);
assert.equal(scope.public_surface_readiness_gate_passed, false);
assert.equal(scope.public_surface_ready, false);
assert.equal(scope.external_customer_ready, false);
assert.equal(scope.banking_pack_ready, false);
assert.equal(scope.level1_launch_ready, false);
assert.equal(scope.production_ready, false);
assert.equal(scope.ai_public_surface_authority_allowed, false);

assert.equal(scope.scope_checklist.source_client_demo_pack_readiness_gate_hash_valid, true);
assert.equal(scope.scope_checklist.source_client_demo_pack_readiness_gate_passed, true);
assert.equal(scope.scope_checklist.controlled_synthetic_client_demo_pack_ready, true);
assert.equal(scope.scope_checklist.allowed_public_content_defined, true);
assert.equal(scope.scope_checklist.excluded_public_content_defined, true);
assert.equal(scope.scope_checklist.public_surface_controls_defined, true);
assert.equal(scope.scope_checklist.public_surface_positive_claims_bound_to_prog_092, true);
assert.equal(scope.scope_checklist.blocked_claims_preserved, true);
assert.equal(scope.scope_checklist.public_surface_readiness_excluded, true);
assert.equal(scope.scope_checklist.external_customer_readiness_excluded, true);
assert.equal(scope.scope_checklist.banking_pack_readiness_excluded, true);
assert.equal(scope.scope_checklist.launch_readiness_excluded, true);
assert.equal(scope.scope_checklist.production_readiness_excluded, true);
assert.equal(scope.scope_checklist.ai_authority_absence_confirmed, true);

assert.equal(scope.public_surface_scope_lock_defined, true);
assert.equal(scope.public_surface_scope_lock_is_not_public_surface_readiness, true);
assert.equal(scope.public_surface_scope_lock_is_not_external_customer_readiness, true);
assert.equal(scope.public_surface_scope_lock_is_not_banking_pack_readiness, true);
assert.equal(scope.public_surface_scope_lock_is_not_launch_readiness, true);
assert.equal(scope.public_surface_scope_lock_is_not_production_readiness, true);
assert.equal(scope.public_surface_scope_lock_is_not_legal_validity, true);
assert.equal(scope.public_surface_scope_lock_is_not_security_certification, true);

for (const code of ['PUBLIC_SURFACE_SCOPE_LOCK_MISSING', 'SOURCE_CLIENT_DEMO_PACK_READINESS_GATE_HASH_INVALID', 'CLIENT_DEMO_PACK_READINESS_GATE_NOT_PASSED', 'ALLOWED_PUBLIC_CONTENT_MISSING', 'EXCLUDED_PUBLIC_CONTENT_MISSING', 'PUBLIC_SURFACE_CONTROL_MISSING', 'PUBLIC_SURFACE_POSITIVE_CLAIM_NOT_BOUND_TO_PROG_092', 'UNSUPPORTED_PUBLIC_READINESS_CLAIM', 'UNSUPPORTED_BANKING_READINESS_CLAIM', 'UNSUPPORTED_PRODUCTION_READINESS_CLAIM', 'AI_PUBLIC_SURFACE_AUTHORITY_CLAIM_BLOCKED']) {
  assert.equal(doc.fail_closed_codes.includes(code), true, `${code} must be present`);
}

assert.equal(doc.readiness_state.public_surface_scope_lock_defined, true);
assert.equal(doc.readiness_state.public_surface_scope_locked, true);
assert.equal(doc.readiness_state.source_client_demo_pack_readiness_gate_bound, true);
assert.equal(doc.readiness_state.client_demo_pack_readiness_gate_passed, true);
assert.equal(doc.readiness_state.controlled_synthetic_client_demo_pack_ready, true);
assert.equal(doc.readiness_state.allowed_public_content_defined, true);
assert.equal(doc.readiness_state.excluded_public_content_defined, true);
assert.equal(doc.readiness_state.public_surface_controls_defined, true);
assert.equal(doc.readiness_state.public_surface_content_model_ready, false);
assert.equal(doc.readiness_state.public_surface_copy_ready, false);
assert.equal(doc.readiness_state.public_surface_evidence_index_ready, false);
assert.equal(doc.readiness_state.public_surface_readiness_gate_passed, false);
assert.equal(doc.readiness_state.public_surface_ready, false);
assert.equal(doc.readiness_state.external_customer_ready, false);
assert.equal(doc.readiness_state.banking_pack_ready, false);
assert.equal(doc.readiness_state.level1_launch_ready, false);
assert.equal(doc.readiness_state.production_ready, false);

assert.equal(doc.next_required_program, 'PROG-094-HBCE-LEVEL1-PUBLIC-SURFACE-CONTENT-MODEL');

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

assert.match(md, /LEVEL1_PUBLIC_SURFACE_SCOPE_LOCK_DEFINED_NOT_PUBLIC_READY/);
assert.match(md, /The public surface scope lock is defined/);
assert.match(md, /The public surface scope is locked/);
assert.match(md, /The public surface is not ready/);
assert.match(md, /controlled_synthetic_client_demo_pack_ready_statement/);
assert.match(md, /customer_logo_without_authorization/);
assert.match(md, /The public surface must bind positive claims to PROG-092/);
assert.match(md, /The public surface must not claim production readiness/);
assert.match(md, /PROG-094-HBCE-LEVEL1-PUBLIC-SURFACE-CONTENT-MODEL/);

console.log('PASS PROG-093-PUBLIC-SURFACE-SCOPE-LOCK-DOCS-EXIST');
console.log('PASS PROG-093-PUBLIC-SURFACE-SCOPE-LOCK-HASH-STABLE');
console.log('PASS PROG-093-BUILDER-STABLE');
console.log('PASS PROG-093-SOURCE-PROG-092-INTEGRITY-VALID');
console.log('PASS PROG-093-ALLOWED-PUBLIC-CONTENT-DEFINED');
console.log('PASS PROG-093-EXCLUDED-PUBLIC-CONTENT-DEFINED');
console.log('PASS PROG-093-POSITIVE-CLAIMS-BOUND-TO-PROG-092');
console.log('PASS PROG-093-SCOPE-LOCKED-NOT-PUBLIC-READY');
console.log('PASS PROG-093-AI-PUBLIC-SURFACE-AUTHORITY-DISALLOWED');
console.log('PASS PROG-093-NEXT-PROG-094-RECORDED');
console.log('PASS PROG-093-NO-UNSUPPORTED-READINESS-CLAIMS');
