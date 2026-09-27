'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { sha256Digest } = require('../../../packages/hbce-core/canonical-json.js');
const {
  STATUS,
  SOURCE_REF,
  REQUIRED_INDEX_ISSUES,
  discoverEvidenceItems,
  buildEvidenceIndexPayload,
  buildLevel1ClientDemoPackEvidenceIndex
} = require('../../../runtime/level1/build-prog-088-level1-client-demo-pack-evidence-index.js');

const root = path.resolve(__dirname, '../../..');
const read = (p) => fs.readFileSync(path.join(root, p), 'utf8');
const json = (p) => JSON.parse(read(p));
const exists = (p) => fs.existsSync(path.join(root, p));

const docPath = 'docs/launch/level1/prog-088-level1-client-demo-pack-evidence-index.json';
const mdPath = 'docs/launch/level1/prog-088-level1-client-demo-pack-evidence-index.md';
const runtimePath = 'runtime/level1/build-prog-088-level1-client-demo-pack-evidence-index.js';

for (const p of [docPath, mdPath, runtimePath, SOURCE_REF]) assert.equal(exists(p), true, `${p} must exist`);

const doc = json(docPath);
const md = read(mdPath);
const source = json(SOURCE_REF);

assert.equal(doc.proto, 'HBCE-L1-PROG-088-CLIENT-DEMO-PACK-EVIDENCE-INDEX-v1');
assert.equal(doc.kind, 'HBCE_LEVEL1_CLIENT_DEMO_PACK_EVIDENCE_INDEX');
assert.equal(doc.issue_id, 'PROG-088');
assert.equal(doc.level1_client_demo_pack_evidence_index_status, STATUS);
assert.equal(doc.source_client_demo_pack_scope_lock_revision_hash, source.revision_hash);
assert.equal(doc.source_client_demo_pack_scope_lock_revision_hash_valid, true);

const regenerated = buildLevel1ClientDemoPackEvidenceIndex({ rootDir: root, repositoryCommit: doc.repository_baseline_commit });
assert.deepEqual(regenerated, doc);

const body = { ...doc };
delete body.revision_hash;
assert.equal(doc.revision_hash, sha256Digest(body));

assert.equal(doc.inherited_client_demo_scope_boundary.scope_lock_status, 'LEVEL1_CLIENT_DEMO_PACK_SCOPE_LOCK_DEFINED_NOT_CLIENT_READY');
assert.equal(doc.inherited_client_demo_scope_boundary.pack_scope, 'LEVEL1_DECISION_PROOF_CLIENT_DEMO_PACK');
assert.equal(doc.inherited_client_demo_scope_boundary.pack_status, 'SCOPE_LOCKED_NOT_CLIENT_READY');
assert.equal(doc.inherited_client_demo_scope_boundary.demo_mode, 'SYNTHETIC_DECISION_PROOF_DEMO_ONLY');
assert.equal(doc.inherited_client_demo_scope_boundary.decision_proof_demo_ready, true);
assert.equal(doc.inherited_client_demo_scope_boundary.client_demo_pack_scope_locked, true);
assert.equal(doc.inherited_client_demo_scope_boundary.prior_public_surface_ready, false);
assert.equal(doc.inherited_client_demo_scope_boundary.prior_external_customer_ready, false);
assert.equal(doc.inherited_client_demo_scope_boundary.prior_banking_pack_ready, false);
assert.equal(doc.inherited_client_demo_scope_boundary.prior_level1_client_pack_ready, false);
assert.equal(doc.inherited_client_demo_scope_boundary.prior_level1_launch_ready, false);
assert.equal(doc.inherited_client_demo_scope_boundary.prior_production_ready, false);

const expectedItems = discoverEvidenceItems(root);
const expectedPayload = buildEvidenceIndexPayload(source, expectedItems);
const index = doc.client_demo_pack_evidence_index;

assert.equal(index.evidence_index_payload_digest, sha256Digest(expectedPayload));
assert.equal(index.evidence_index_id, 'CLIENT-DEMO-PACK-EVIDENCE-INDEX::HBCE-L1-DECISION-PROOF-0001');
assert.equal(index.source_client_demo_pack_scope_lock_ref, SOURCE_REF);
assert.equal(index.source_client_demo_pack_scope_lock_digest, source.client_demo_pack_scope_lock.scope_lock_payload_digest);
assert.equal(index.pack_scope, 'LEVEL1_DECISION_PROOF_CLIENT_DEMO_PACK');
assert.equal(index.pack_status, 'EVIDENCE_INDEX_DEFINED_NOT_CLIENT_READY');
assert.equal(index.index_scope, 'LEVEL1_DECISION_PROOF_CLIENT_DEMO_PACK_SYNTHETIC_ONLY');
assert.equal(index.index_mode, 'SYNTHETIC_DECISION_PROOF_DEMO_ONLY');

assert.deepEqual(index.required_index_issues, REQUIRED_INDEX_ISSUES);
assert.equal(index.evidence_item_count, index.evidence_items.length);
assert.equal(index.evidence_item_count >= REQUIRED_INDEX_ISSUES.length, true);
assert.equal(index.all_required_issues_indexed, true);
assert.deepEqual(index.missing_required_issues, []);
assert.equal(index.all_indexed_artifacts_exist, true);
assert.equal(index.all_indexed_hashes_valid, true);

for (const issue of REQUIRED_INDEX_ISSUES) {
  assert.equal(index.indexed_issues.includes(issue), true, `${issue} must be indexed`);
  assert.equal(index.evidence_items.some((item) => item.issue_id === issue), true, `${issue} must have evidence item`);
}

for (const item of index.evidence_items) {
  assert.equal(exists(item.artifact_ref), true, `${item.artifact_ref} must exist`);
  assert.equal(item.artifact_revision_hash_valid, true, `${item.artifact_ref} hash must be valid`);
  assert.equal(item.client_demo_safe, true);
  assert.equal(item.synthetic_only, true);
  assert.equal(item.customer_data_allowed, false);
  assert.equal(item.live_system_control_allowed, false);
  assert.equal(item.legal_validity_claim_allowed, false);
  assert.equal(item.ai_authority_claim_allowed, false);
}

assert.equal(index.evidence_index_boundary.synthetic_demo_only, true);
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

assert.equal(index.public_surface_required, true);
assert.equal(index.public_surface_ready, false);
assert.equal(index.external_customer_ready, false);
assert.equal(index.banking_pack_ready, false);
assert.equal(index.level1_client_pack_ready, false);
assert.equal(index.level1_launch_ready, false);
assert.equal(index.production_ready, false);
assert.equal(index.ai_index_authority_allowed, false);

assert.equal(index.index_checklist.source_scope_lock_hash_valid, true);
assert.equal(index.index_checklist.scope_lock_defined, true);
assert.equal(index.index_checklist.scope_locked, true);
assert.equal(index.index_checklist.decision_proof_demo_ready_confirmed, true);
assert.equal(index.index_checklist.allowed_content_defined, true);
assert.equal(index.index_checklist.excluded_content_defined, true);
assert.equal(index.index_checklist.buyer_personas_defined, true);
assert.equal(index.index_checklist.all_required_issues_indexed, true);
assert.equal(index.index_checklist.all_indexed_hashes_valid, true);
assert.equal(index.index_checklist.launch_readiness_excluded, true);
assert.equal(index.index_checklist.client_pack_readiness_excluded, true);
assert.equal(index.index_checklist.production_readiness_excluded, true);
assert.equal(index.index_checklist.ai_authority_absence_confirmed, true);

assert.equal(index.evidence_index_defined, true);
assert.equal(index.evidence_index_is_not_client_pack_readiness, true);
assert.equal(index.evidence_index_is_not_launch_readiness, true);
assert.equal(index.evidence_index_is_not_public_surface_readiness, true);
assert.equal(index.evidence_index_is_not_external_customer_readiness, true);
assert.equal(index.evidence_index_is_not_banking_pack_readiness, true);
assert.equal(index.evidence_index_is_not_production_readiness, true);
assert.equal(index.evidence_index_is_not_legal_validity, true);
assert.equal(index.evidence_index_is_not_security_certification, true);

for (const code of ['CLIENT_DEMO_PACK_EVIDENCE_INDEX_MISSING', 'SOURCE_CLIENT_DEMO_PACK_SCOPE_LOCK_HASH_INVALID', 'CLIENT_DEMO_PACK_SCOPE_NOT_LOCKED', 'DEMO_NOT_READY', 'REQUIRED_EVIDENCE_ARTIFACT_MISSING', 'EVIDENCE_ARTIFACT_HASH_INVALID', 'CUSTOMER_DATA_CLAIM_BLOCKED', 'LIVE_SYSTEM_CONTROL_CLAIM_BLOCKED', 'UNSUPPORTED_READINESS_CLAIM', 'AI_INDEX_AUTHORITY_CLAIM_BLOCKED']) {
  assert.equal(doc.fail_closed_codes.includes(code), true, `${code} must be present`);
}

assert.equal(doc.readiness_state.client_demo_pack_evidence_index_defined, true);
assert.equal(doc.readiness_state.client_demo_pack_evidence_index_ready, true);
assert.equal(doc.readiness_state.source_client_demo_pack_scope_lock_bound, true);
assert.equal(doc.readiness_state.client_demo_pack_scope_locked, true);
assert.equal(doc.readiness_state.decision_proof_demo_ready, true);
assert.equal(doc.readiness_state.all_required_issues_indexed, true);
assert.equal(doc.readiness_state.all_indexed_hashes_valid, true);
assert.equal(doc.readiness_state.client_demo_allowed_content_defined, true);
assert.equal(doc.readiness_state.client_demo_excluded_content_defined, true);
assert.equal(doc.readiness_state.buyer_personas_defined, true);
assert.equal(doc.readiness_state.client_demo_pack_runbook_ready, false);
assert.equal(doc.readiness_state.client_demo_pack_script_ready, false);
assert.equal(doc.readiness_state.client_demo_pack_q_and_a_boundary_ready, false);
assert.equal(doc.readiness_state.client_demo_pack_readiness_gate_passed, false);
assert.equal(doc.readiness_state.public_surface_ready, false);
assert.equal(doc.readiness_state.external_customer_ready, false);
assert.equal(doc.readiness_state.banking_pack_ready, false);
assert.equal(doc.readiness_state.level1_client_pack_ready, false);
assert.equal(doc.readiness_state.level1_launch_ready, false);
assert.equal(doc.readiness_state.production_ready, false);

assert.equal(doc.next_required_program, 'PROG-089-HBCE-LEVEL1-CLIENT-DEMO-PACK-RUNBOOK');

assert.equal(doc.non_claims.legal_validity, false);
assert.equal(doc.non_claims.public_accreditation, false);
assert.equal(doc.non_claims.procurement_eligibility, false);
assert.equal(doc.non_claims.external_effect_proven, false);
assert.equal(doc.non_claims.business_success, false);
assert.equal(doc.non_claims.ai_authority, false);
assert.equal(doc.non_claims.client_pack_ready, false);
assert.equal(doc.non_claims.public_surface_ready, false);
assert.equal(doc.non_claims.external_customer_ready, false);
assert.equal(doc.non_claims.banking_pack_ready, false);
assert.equal(doc.non_claims.level1_launch_ready, false);
assert.equal(doc.non_claims.production_ready, false);

assert.match(md, /LEVEL1_CLIENT_DEMO_PACK_EVIDENCE_INDEX_DEFINED_NOT_CLIENT_READY/);
assert.match(md, /The evidence index is defined/);
assert.match(md, /The evidence index is ready/);
assert.match(md, /The client demo pack is not ready/);
assert.match(md, /The required index range is PROG-066 through PROG-087/);
assert.match(md, /The evidence index does not create legal validity/);
assert.match(md, /The evidence index does not create SLA commitment/);
assert.match(md, /PROG-089-HBCE-LEVEL1-CLIENT-DEMO-PACK-RUNBOOK/);

console.log('PASS PROG-088-CLIENT-DEMO-PACK-EVIDENCE-INDEX-DOCS-EXIST');
console.log('PASS PROG-088-CLIENT-DEMO-PACK-EVIDENCE-INDEX-HASH-STABLE');
console.log('PASS PROG-088-BUILDER-STABLE');
console.log('PASS PROG-088-SOURCE-PROG-087-INTEGRITY-VALID');
console.log('PASS PROG-088-REQUIRED-ISSUES-INDEXED');
console.log('PASS PROG-088-INDEXED-HASHES-VALID');
console.log('PASS PROG-088-EVIDENCE-INDEX-READY-NOT-CLIENT-PACK-READY');
console.log('PASS PROG-088-AI-INDEX-AUTHORITY-DISALLOWED');
console.log('PASS PROG-088-NEXT-PROG-089-RECORDED');
console.log('PASS PROG-088-NO-UNSUPPORTED-READINESS-CLAIMS');
