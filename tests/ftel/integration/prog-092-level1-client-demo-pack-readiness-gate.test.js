'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { sha256Digest } = require('../../../packages/hbce-core/canonical-json.js');
const {
  STATUS,
  SOURCE_REF,
  REQUIRED_GATE_CRITERIA,
  buildGateCriteria,
  buildReadinessGatePayload,
  buildLevel1ClientDemoPackReadinessGate
} = require('../../../runtime/level1/build-prog-092-level1-client-demo-pack-readiness-gate.js');

const root = path.resolve(__dirname, '../../..');
const read = (p) => fs.readFileSync(path.join(root, p), 'utf8');
const json = (p) => JSON.parse(read(p));
const exists = (p) => fs.existsSync(path.join(root, p));

const docPath = 'docs/launch/level1/prog-092-level1-client-demo-pack-readiness-gate.json';
const mdPath = 'docs/launch/level1/prog-092-level1-client-demo-pack-readiness-gate.md';
const runtimePath = 'runtime/level1/build-prog-092-level1-client-demo-pack-readiness-gate.js';

for (const p of [docPath, mdPath, runtimePath, SOURCE_REF]) assert.equal(exists(p), true, `${p} must exist`);

const doc = json(docPath);
const md = read(mdPath);
const source = json(SOURCE_REF);

assert.equal(doc.proto, 'HBCE-L1-PROG-092-CLIENT-DEMO-PACK-READINESS-GATE-v1');
assert.equal(doc.kind, 'HBCE_LEVEL1_CLIENT_DEMO_PACK_READINESS_GATE');
assert.equal(doc.issue_id, 'PROG-092');
assert.equal(doc.level1_client_demo_pack_readiness_gate_status, STATUS);
assert.equal(doc.source_client_demo_pack_qa_boundary_revision_hash, source.revision_hash);
assert.equal(doc.source_client_demo_pack_qa_boundary_revision_hash_valid, true);

const regenerated = buildLevel1ClientDemoPackReadinessGate({ rootDir: root, repositoryCommit: doc.repository_baseline_commit });
assert.deepEqual(regenerated, doc);

const body = { ...doc };
delete body.revision_hash;
assert.equal(doc.revision_hash, sha256Digest(body));

assert.equal(doc.inherited_client_demo_qa_boundary.qa_boundary_status, 'LEVEL1_CLIENT_DEMO_PACK_QA_BOUNDARY_DEFINED_NOT_CLIENT_READY');
assert.equal(doc.inherited_client_demo_qa_boundary.pack_scope, 'LEVEL1_DECISION_PROOF_CLIENT_DEMO_PACK');
assert.equal(doc.inherited_client_demo_qa_boundary.pack_status, 'QA_BOUNDARY_DEFINED_NOT_CLIENT_READY');
assert.equal(doc.inherited_client_demo_qa_boundary.qa_scope, 'LEVEL1_DECISION_PROOF_CLIENT_DEMO_PACK_SYNTHETIC_ONLY');
assert.equal(doc.inherited_client_demo_qa_boundary.qa_mode, 'CONTROLLED_CLIENT_DEMO_QA_BOUNDARY');
assert.equal(doc.inherited_client_demo_qa_boundary.qa_boundary_ready, true);
assert.equal(doc.inherited_client_demo_qa_boundary.script_ready, true);
assert.equal(doc.inherited_client_demo_qa_boundary.runbook_ready, true);
assert.equal(doc.inherited_client_demo_qa_boundary.evidence_index_ready, true);
assert.equal(doc.inherited_client_demo_qa_boundary.scope_locked, true);
assert.equal(doc.inherited_client_demo_qa_boundary.decision_proof_demo_ready, true);
assert.equal(doc.inherited_client_demo_qa_boundary.prior_readiness_gate_passed, false);
assert.equal(doc.inherited_client_demo_qa_boundary.prior_public_surface_ready, false);
assert.equal(doc.inherited_client_demo_qa_boundary.prior_external_customer_ready, false);
assert.equal(doc.inherited_client_demo_qa_boundary.prior_banking_pack_ready, false);
assert.equal(doc.inherited_client_demo_qa_boundary.prior_level1_client_pack_ready, false);
assert.equal(doc.inherited_client_demo_qa_boundary.prior_level1_launch_ready, false);
assert.equal(doc.inherited_client_demo_qa_boundary.prior_production_ready, false);

const expectedCriteria = buildGateCriteria(source);
const expectedPayload = buildReadinessGatePayload(source);
const gate = doc.client_demo_pack_readiness_gate;

assert.equal(gate.readiness_gate_payload_digest, sha256Digest(expectedPayload));
assert.deepEqual(gate.gate_criteria, expectedCriteria);
assert.equal(gate.readiness_gate_id, 'CLIENT-DEMO-PACK-READINESS-GATE::HBCE-L1-DECISION-PROOF-0001');
assert.equal(gate.source_qa_boundary_ref, SOURCE_REF);
assert.equal(gate.source_qa_boundary_digest, source.client_demo_pack_qa_boundary.qa_boundary_payload_digest);
assert.equal(gate.pack_scope, 'LEVEL1_DECISION_PROOF_CLIENT_DEMO_PACK');
assert.equal(gate.pack_status, 'CONTROLLED_SYNTHETIC_CLIENT_DEMO_PACK_READY');
assert.equal(gate.gate_scope, 'LEVEL1_DECISION_PROOF_CLIENT_DEMO_PACK_SYNTHETIC_ONLY');
assert.equal(gate.gate_mode, 'CONTROLLED_CLIENT_DEMO_PACK_READINESS_GATE');
assert.deepEqual(gate.required_gate_criteria, REQUIRED_GATE_CRITERIA);
assert.deepEqual(gate.missing_gate_criteria, []);
assert.equal(gate.gate_result, 'PASS_CONTROLLED_SYNTHETIC_CLIENT_DEMO_PACK_READY');
assert.equal(gate.gate_passed, true);
assert.equal(gate.controlled_synthetic_client_demo_pack_ready, true);

for (const criterion of REQUIRED_GATE_CRITERIA) {
  assert.equal(gate.gate_criteria[criterion], true, `${criterion} must pass`);
}

assert.equal(gate.client_demo_pack_readiness_basis.includes('demo_readiness_snapshot_passed'), true);
assert.equal(gate.client_demo_pack_readiness_basis.includes('client_demo_pack_scope_locked'), true);
assert.equal(gate.client_demo_pack_readiness_basis.includes('client_demo_pack_evidence_index_ready'), true);
assert.equal(gate.client_demo_pack_readiness_basis.includes('client_demo_pack_runbook_ready'), true);
assert.equal(gate.client_demo_pack_readiness_basis.includes('client_demo_pack_script_ready'), true);
assert.equal(gate.client_demo_pack_readiness_basis.includes('client_demo_pack_q_and_a_boundary_ready'), true);

assert.equal(gate.gate_boundary.synthetic_demo_only, true);
assert.equal(gate.gate_boundary.qa_boundary_required, true);
assert.equal(gate.gate_boundary.script_required, true);
assert.equal(gate.gate_boundary.runbook_required, true);
assert.equal(gate.gate_boundary.evidence_index_required, true);
assert.equal(gate.gate_boundary.scope_lock_required, true);
assert.equal(gate.gate_boundary.no_customer_data, true);
assert.equal(gate.gate_boundary.no_live_system_control, true);
assert.equal(gate.gate_boundary.no_production_integration, true);
assert.equal(gate.gate_boundary.no_legal_validity_claim, true);
assert.equal(gate.gate_boundary.no_public_accreditation_claim, true);
assert.equal(gate.gate_boundary.no_procurement_eligibility_claim, true);
assert.equal(gate.gate_boundary.no_external_effect_claim, true);
assert.equal(gate.gate_boundary.no_business_success_claim, true);
assert.equal(gate.gate_boundary.no_ai_authority_claim, true);
assert.equal(gate.gate_boundary.no_pricing_commitment, true);
assert.equal(gate.gate_boundary.no_sla_commitment, true);
assert.equal(gate.gate_boundary.no_security_certification_claim, true);

assert.equal(gate.approved_claims.controlled_synthetic_client_demo_pack_ready, true);
assert.equal(gate.approved_claims.level1_client_pack_ready_inside_synthetic_demo_boundary, true);
assert.equal(gate.approved_claims.demo_ready, true);
assert.equal(gate.approved_claims.evidence_index_ready, true);
assert.equal(gate.approved_claims.runbook_ready, true);
assert.equal(gate.approved_claims.script_ready, true);
assert.equal(gate.approved_claims.qa_boundary_ready, true);

assert.equal(gate.blocked_claims.unrestricted_client_pack_ready, true);
assert.equal(gate.blocked_claims.external_customer_delivery_ready, true);
assert.equal(gate.blocked_claims.public_surface_ready, true);
assert.equal(gate.blocked_claims.banking_pack_ready, true);
assert.equal(gate.blocked_claims.level1_launch_ready, true);
assert.equal(gate.blocked_claims.production_ready, true);
assert.equal(gate.blocked_claims.legal_validity, true);
assert.equal(gate.blocked_claims.public_accreditation, true);
assert.equal(gate.blocked_claims.procurement_eligibility, true);
assert.equal(gate.blocked_claims.security_certification, true);
assert.equal(gate.blocked_claims.ai_authority, true);

assert.equal(gate.public_surface_ready, false);
assert.equal(gate.external_customer_ready, false);
assert.equal(gate.banking_pack_ready, false);
assert.equal(gate.level1_launch_ready, false);
assert.equal(gate.production_ready, false);
assert.equal(gate.ai_gate_authority_allowed, false);

assert.equal(gate.gate_checklist.source_qa_boundary_hash_valid, true);
assert.equal(gate.gate_checklist.qa_boundary_ready, true);
assert.equal(gate.gate_checklist.script_ready, true);
assert.equal(gate.gate_checklist.runbook_ready, true);
assert.equal(gate.gate_checklist.evidence_index_ready, true);
assert.equal(gate.gate_checklist.scope_locked, true);
assert.equal(gate.gate_checklist.decision_proof_demo_ready_confirmed, true);
assert.equal(gate.gate_checklist.all_gate_criteria_passed, true);
assert.equal(gate.gate_checklist.no_missing_gate_criteria, true);
assert.equal(gate.gate_checklist.public_surface_readiness_excluded, true);
assert.equal(gate.gate_checklist.external_customer_readiness_excluded, true);
assert.equal(gate.gate_checklist.banking_pack_readiness_excluded, true);
assert.equal(gate.gate_checklist.launch_readiness_excluded, true);
assert.equal(gate.gate_checklist.production_readiness_excluded, true);
assert.equal(gate.gate_checklist.ai_authority_absence_confirmed, true);

assert.equal(gate.readiness_gate_defined, true);
assert.equal(gate.readiness_gate_is_controlled_synthetic_client_demo_pack_readiness, true);
assert.equal(gate.readiness_gate_is_not_public_surface_readiness, true);
assert.equal(gate.readiness_gate_is_not_external_customer_readiness, true);
assert.equal(gate.readiness_gate_is_not_banking_pack_readiness, true);
assert.equal(gate.readiness_gate_is_not_launch_readiness, true);
assert.equal(gate.readiness_gate_is_not_production_readiness, true);
assert.equal(gate.readiness_gate_is_not_legal_validity, true);
assert.equal(gate.readiness_gate_is_not_security_certification, true);

for (const code of ['CLIENT_DEMO_PACK_READINESS_GATE_MISSING', 'SOURCE_CLIENT_DEMO_PACK_QA_BOUNDARY_HASH_INVALID', 'CLIENT_DEMO_PACK_QA_BOUNDARY_NOT_READY', 'CLIENT_DEMO_PACK_SCRIPT_NOT_READY', 'CLIENT_DEMO_PACK_RUNBOOK_NOT_READY', 'CLIENT_DEMO_PACK_EVIDENCE_INDEX_NOT_READY', 'CLIENT_DEMO_PACK_SCOPE_NOT_LOCKED', 'REQUIRED_GATE_CRITERION_MISSING', 'UNSUPPORTED_READINESS_CLAIM', 'AI_GATE_AUTHORITY_CLAIM_BLOCKED']) {
  assert.equal(doc.fail_closed_codes.includes(code), true, `${code} must be present`);
}

assert.equal(doc.readiness_state.client_demo_pack_readiness_gate_defined, true);
assert.equal(doc.readiness_state.client_demo_pack_readiness_gate_passed, true);
assert.equal(doc.readiness_state.controlled_synthetic_client_demo_pack_ready, true);
assert.equal(doc.readiness_state.level1_client_pack_ready, true);
assert.equal(doc.readiness_state.source_client_demo_pack_qa_boundary_bound, true);
assert.equal(doc.readiness_state.client_demo_pack_q_and_a_boundary_ready, true);
assert.equal(doc.readiness_state.client_demo_pack_script_ready, true);
assert.equal(doc.readiness_state.client_demo_pack_runbook_ready, true);
assert.equal(doc.readiness_state.client_demo_pack_evidence_index_ready, true);
assert.equal(doc.readiness_state.client_demo_pack_scope_locked, true);
assert.equal(doc.readiness_state.decision_proof_demo_ready, true);
assert.equal(doc.readiness_state.all_gate_criteria_passed, true);
assert.equal(doc.readiness_state.public_surface_ready, false);
assert.equal(doc.readiness_state.external_customer_ready, false);
assert.equal(doc.readiness_state.banking_pack_ready, false);
assert.equal(doc.readiness_state.level1_launch_ready, false);
assert.equal(doc.readiness_state.production_ready, false);

assert.equal(doc.next_required_program, 'PROG-093-HBCE-LEVEL1-PUBLIC-SURFACE-SCOPE-LOCK');

assert.equal(doc.non_claims.legal_validity, false);
assert.equal(doc.non_claims.public_accreditation, false);
assert.equal(doc.non_claims.procurement_eligibility, false);
assert.equal(doc.non_claims.external_effect_proven, false);
assert.equal(doc.non_claims.business_success, false);
assert.equal(doc.non_claims.ai_authority, false);
assert.equal(doc.non_claims.unrestricted_client_pack_ready, false);
assert.equal(doc.non_claims.external_customer_ready, false);
assert.equal(doc.non_claims.public_surface_ready, false);
assert.equal(doc.non_claims.banking_pack_ready, false);
assert.equal(doc.non_claims.level1_launch_ready, false);
assert.equal(doc.non_claims.production_ready, false);

assert.match(md, /LEVEL1_CLIENT_DEMO_PACK_READINESS_GATE_PASSED_CONTROLLED_SYNTHETIC_ONLY/);
assert.match(md, /The readiness gate is passed/);
assert.match(md, /The controlled synthetic client demo pack is ready/);
assert.match(md, /PASS_CONTROLLED_SYNTHETIC_CLIENT_DEMO_PACK_READY/);
assert.match(md, /HBCE may claim that the controlled synthetic Level 1 client demo pack is ready/);
assert.match(md, /HBCE must not claim production readiness/);
assert.match(md, /The readiness gate does not create legal validity/);
assert.match(md, /PROG-093-HBCE-LEVEL1-PUBLIC-SURFACE-SCOPE-LOCK/);

console.log('PASS PROG-092-CLIENT-DEMO-PACK-READINESS-GATE-DOCS-EXIST');
console.log('PASS PROG-092-CLIENT-DEMO-PACK-READINESS-GATE-HASH-STABLE');
console.log('PASS PROG-092-BUILDER-STABLE');
console.log('PASS PROG-092-SOURCE-PROG-091-INTEGRITY-VALID');
console.log('PASS PROG-092-GATE-CRITERIA-PASSED');
console.log('PASS PROG-092-CONTROLLED-SYNTHETIC-CLIENT-DEMO-PACK-READY');
console.log('PASS PROG-092-BLOCKED-CLAIMS-PRESERVED');
console.log('PASS PROG-092-PUBLIC-SURFACE-NOT-READY');
console.log('PASS PROG-092-AI-GATE-AUTHORITY-DISALLOWED');
console.log('PASS PROG-092-NEXT-PROG-093-RECORDED');
console.log('PASS PROG-092-NO-UNSUPPORTED-READINESS-CLAIMS');
