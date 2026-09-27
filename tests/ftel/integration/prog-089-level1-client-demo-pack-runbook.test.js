'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { sha256Digest } = require('../../../packages/hbce-core/canonical-json.js');
const {
  STATUS,
  SOURCE_REF,
  RUNBOOK_PHASES,
  RUNBOOK_STOP_CONDITIONS,
  buildRunbookPayload,
  buildLevel1ClientDemoPackRunbook
} = require('../../../runtime/level1/build-prog-089-level1-client-demo-pack-runbook.js');

const root = path.resolve(__dirname, '../../..');
const read = (p) => fs.readFileSync(path.join(root, p), 'utf8');
const json = (p) => JSON.parse(read(p));
const exists = (p) => fs.existsSync(path.join(root, p));

const docPath = 'docs/launch/level1/prog-089-level1-client-demo-pack-runbook.json';
const mdPath = 'docs/launch/level1/prog-089-level1-client-demo-pack-runbook.md';
const runtimePath = 'runtime/level1/build-prog-089-level1-client-demo-pack-runbook.js';

for (const p of [docPath, mdPath, runtimePath, SOURCE_REF]) assert.equal(exists(p), true, `${p} must exist`);

const doc = json(docPath);
const md = read(mdPath);
const source = json(SOURCE_REF);

assert.equal(doc.proto, 'HBCE-L1-PROG-089-CLIENT-DEMO-PACK-RUNBOOK-v1');
assert.equal(doc.kind, 'HBCE_LEVEL1_CLIENT_DEMO_PACK_RUNBOOK');
assert.equal(doc.issue_id, 'PROG-089');
assert.equal(doc.level1_client_demo_pack_runbook_status, STATUS);
assert.equal(doc.source_client_demo_pack_evidence_index_revision_hash, source.revision_hash);
assert.equal(doc.source_client_demo_pack_evidence_index_revision_hash_valid, true);

const regenerated = buildLevel1ClientDemoPackRunbook({ rootDir: root, repositoryCommit: doc.repository_baseline_commit });
assert.deepEqual(regenerated, doc);

const body = { ...doc };
delete body.revision_hash;
assert.equal(doc.revision_hash, sha256Digest(body));

assert.equal(doc.inherited_client_demo_evidence_index_boundary.evidence_index_status, 'LEVEL1_CLIENT_DEMO_PACK_EVIDENCE_INDEX_DEFINED_NOT_CLIENT_READY');
assert.equal(doc.inherited_client_demo_evidence_index_boundary.pack_scope, 'LEVEL1_DECISION_PROOF_CLIENT_DEMO_PACK');
assert.equal(doc.inherited_client_demo_evidence_index_boundary.pack_status, 'EVIDENCE_INDEX_DEFINED_NOT_CLIENT_READY');
assert.equal(doc.inherited_client_demo_evidence_index_boundary.index_scope, 'LEVEL1_DECISION_PROOF_CLIENT_DEMO_PACK_SYNTHETIC_ONLY');
assert.equal(doc.inherited_client_demo_evidence_index_boundary.evidence_index_ready, true);
assert.equal(doc.inherited_client_demo_evidence_index_boundary.all_required_issues_indexed, true);
assert.equal(doc.inherited_client_demo_evidence_index_boundary.all_indexed_hashes_valid, true);
assert.equal(doc.inherited_client_demo_evidence_index_boundary.prior_runbook_ready, false);
assert.equal(doc.inherited_client_demo_evidence_index_boundary.prior_script_ready, false);
assert.equal(doc.inherited_client_demo_evidence_index_boundary.prior_q_and_a_boundary_ready, false);
assert.equal(doc.inherited_client_demo_evidence_index_boundary.prior_readiness_gate_passed, false);
assert.equal(doc.inherited_client_demo_evidence_index_boundary.prior_public_surface_ready, false);
assert.equal(doc.inherited_client_demo_evidence_index_boundary.prior_external_customer_ready, false);
assert.equal(doc.inherited_client_demo_evidence_index_boundary.prior_banking_pack_ready, false);
assert.equal(doc.inherited_client_demo_evidence_index_boundary.prior_level1_client_pack_ready, false);
assert.equal(doc.inherited_client_demo_evidence_index_boundary.prior_level1_launch_ready, false);
assert.equal(doc.inherited_client_demo_evidence_index_boundary.prior_production_ready, false);

const expectedPayload = buildRunbookPayload(source);
const runbook = doc.client_demo_pack_runbook;

assert.equal(runbook.runbook_payload_digest, sha256Digest(expectedPayload));
assert.equal(runbook.runbook_id, 'CLIENT-DEMO-PACK-RUNBOOK::HBCE-L1-DECISION-PROOF-0001');
assert.equal(runbook.source_evidence_index_ref, SOURCE_REF);
assert.equal(runbook.source_evidence_index_digest, source.client_demo_pack_evidence_index.evidence_index_payload_digest);
assert.equal(runbook.pack_scope, 'LEVEL1_DECISION_PROOF_CLIENT_DEMO_PACK');
assert.equal(runbook.pack_status, 'RUNBOOK_DEFINED_NOT_CLIENT_READY');
assert.equal(runbook.runbook_scope, 'LEVEL1_DECISION_PROOF_CLIENT_DEMO_PACK_SYNTHETIC_ONLY');
assert.equal(runbook.runbook_mode, 'CONTROLLED_CLIENT_DEMO_RUNBOOK');
assert.deepEqual(runbook.runbook_phases, RUNBOOK_PHASES);
assert.equal(runbook.runbook_step_count, RUNBOOK_PHASES.length);
assert.equal(runbook.runbook_steps.length, RUNBOOK_PHASES.length);
assert.equal(runbook.all_runbook_phases_defined, true);
assert.equal(runbook.all_step_evidence_refs_bound, true);

for (const phase of RUNBOOK_PHASES) {
  assert.equal(runbook.runbook_steps.some((step) => step.phase === phase), true, `${phase} must be present`);
}

for (const step of runbook.runbook_steps) {
  assert.equal(step.step_number > 0, true);
  assert.equal(typeof step.purpose, 'string');
  assert.equal(step.evidence_issues.length > 0, true);
  assert.equal(step.evidence_refs.length > 0, true);
  assert.equal(step.all_evidence_refs_bound, true);
  assert.equal(typeof step.required_statement, 'string');
}

for (const stop of RUNBOOK_STOP_CONDITIONS) {
  assert.equal(runbook.stop_conditions.includes(stop), true, `${stop} must be present`);
}

assert.equal(runbook.required_presenter_controls.includes('state_synthetic_only_before_demo'), true);
assert.equal(runbook.required_presenter_controls.includes('show_evidence_index_before_narrative'), true);
assert.equal(runbook.required_presenter_controls.includes('separate_demo_readiness_from_client_pack_readiness'), true);
assert.equal(runbook.required_presenter_controls.includes('stop_on_excluded_claim_request'), true);

assert.equal(runbook.runbook_boundary.synthetic_demo_only, true);
assert.equal(runbook.runbook_boundary.evidence_index_required, true);
assert.equal(runbook.runbook_boundary.no_customer_data, true);
assert.equal(runbook.runbook_boundary.no_live_system_control, true);
assert.equal(runbook.runbook_boundary.no_production_integration, true);
assert.equal(runbook.runbook_boundary.no_legal_validity_claim, true);
assert.equal(runbook.runbook_boundary.no_public_accreditation_claim, true);
assert.equal(runbook.runbook_boundary.no_procurement_eligibility_claim, true);
assert.equal(runbook.runbook_boundary.no_external_effect_claim, true);
assert.equal(runbook.runbook_boundary.no_business_success_claim, true);
assert.equal(runbook.runbook_boundary.no_ai_authority_claim, true);
assert.equal(runbook.runbook_boundary.no_pricing_commitment, true);
assert.equal(runbook.runbook_boundary.no_sla_commitment, true);
assert.equal(runbook.runbook_boundary.no_security_certification_claim, true);

assert.equal(runbook.client_demo_pack_runbook_ready, true);
assert.equal(runbook.client_demo_pack_script_ready, false);
assert.equal(runbook.client_demo_pack_q_and_a_boundary_ready, false);
assert.equal(runbook.client_demo_pack_readiness_gate_passed, false);
assert.equal(runbook.public_surface_ready, false);
assert.equal(runbook.external_customer_ready, false);
assert.equal(runbook.banking_pack_ready, false);
assert.equal(runbook.level1_client_pack_ready, false);
assert.equal(runbook.level1_launch_ready, false);
assert.equal(runbook.production_ready, false);
assert.equal(runbook.ai_runbook_authority_allowed, false);

assert.equal(runbook.runbook_checklist.source_evidence_index_hash_valid, true);
assert.equal(runbook.runbook_checklist.evidence_index_ready, true);
assert.equal(runbook.runbook_checklist.all_required_issues_indexed, true);
assert.equal(runbook.runbook_checklist.all_indexed_hashes_valid, true);
assert.equal(runbook.runbook_checklist.scope_locked, true);
assert.equal(runbook.runbook_checklist.decision_proof_demo_ready_confirmed, true);
assert.equal(runbook.runbook_checklist.all_runbook_phases_defined, true);
assert.equal(runbook.runbook_checklist.all_step_evidence_refs_bound, true);
assert.equal(runbook.runbook_checklist.stop_conditions_defined, true);
assert.equal(runbook.runbook_checklist.launch_readiness_excluded, true);
assert.equal(runbook.runbook_checklist.client_pack_readiness_excluded, true);
assert.equal(runbook.runbook_checklist.production_readiness_excluded, true);
assert.equal(runbook.runbook_checklist.ai_authority_absence_confirmed, true);

assert.equal(runbook.runbook_defined, true);
assert.equal(runbook.runbook_is_not_client_pack_readiness, true);
assert.equal(runbook.runbook_is_not_launch_readiness, true);
assert.equal(runbook.runbook_is_not_public_surface_readiness, true);
assert.equal(runbook.runbook_is_not_external_customer_readiness, true);
assert.equal(runbook.runbook_is_not_banking_pack_readiness, true);
assert.equal(runbook.runbook_is_not_production_readiness, true);
assert.equal(runbook.runbook_is_not_legal_validity, true);
assert.equal(runbook.runbook_is_not_security_certification, true);

for (const code of ['CLIENT_DEMO_PACK_RUNBOOK_MISSING', 'SOURCE_CLIENT_DEMO_PACK_EVIDENCE_INDEX_HASH_INVALID', 'CLIENT_DEMO_PACK_EVIDENCE_INDEX_NOT_READY', 'REQUIRED_RUNBOOK_PHASE_MISSING', 'RUNBOOK_STEP_EVIDENCE_REF_MISSING', 'STOP_CONDITION_MISSING', 'CUSTOMER_DATA_CLAIM_BLOCKED', 'LIVE_SYSTEM_CONTROL_CLAIM_BLOCKED', 'UNSUPPORTED_READINESS_CLAIM', 'AI_RUNBOOK_AUTHORITY_CLAIM_BLOCKED']) {
  assert.equal(doc.fail_closed_codes.includes(code), true, `${code} must be present`);
}

assert.equal(doc.readiness_state.client_demo_pack_runbook_defined, true);
assert.equal(doc.readiness_state.client_demo_pack_runbook_ready, true);
assert.equal(doc.readiness_state.source_client_demo_pack_evidence_index_bound, true);
assert.equal(doc.readiness_state.client_demo_pack_evidence_index_ready, true);
assert.equal(doc.readiness_state.client_demo_pack_scope_locked, true);
assert.equal(doc.readiness_state.decision_proof_demo_ready, true);
assert.equal(doc.readiness_state.all_runbook_phases_defined, true);
assert.equal(doc.readiness_state.all_step_evidence_refs_bound, true);
assert.equal(doc.readiness_state.stop_conditions_defined, true);
assert.equal(doc.readiness_state.presenter_controls_defined, true);
assert.equal(doc.readiness_state.client_demo_pack_script_ready, false);
assert.equal(doc.readiness_state.client_demo_pack_q_and_a_boundary_ready, false);
assert.equal(doc.readiness_state.client_demo_pack_readiness_gate_passed, false);
assert.equal(doc.readiness_state.public_surface_ready, false);
assert.equal(doc.readiness_state.external_customer_ready, false);
assert.equal(doc.readiness_state.banking_pack_ready, false);
assert.equal(doc.readiness_state.level1_client_pack_ready, false);
assert.equal(doc.readiness_state.level1_launch_ready, false);
assert.equal(doc.readiness_state.production_ready, false);

assert.equal(doc.next_required_program, 'PROG-090-HBCE-LEVEL1-CLIENT-DEMO-PACK-SCRIPT');

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

assert.match(md, /LEVEL1_CLIENT_DEMO_PACK_RUNBOOK_DEFINED_NOT_CLIENT_READY/);
assert.match(md, /The client demo pack runbook is defined/);
assert.match(md, /The client demo pack runbook is ready/);
assert.match(md, /The client demo pack script is not ready/);
assert.match(md, /The client demo pack readiness gate is not passed/);
assert.match(md, /PRE_BRIEF_SCOPE_BOUNDARY/);
assert.match(md, /CLIENT_QUESTIONS_BOUNDARY/);
assert.match(md, /The runbook must stop or defer/);
assert.match(md, /The runbook does not make the client demo pack ready/);
assert.match(md, /PROG-090-HBCE-LEVEL1-CLIENT-DEMO-PACK-SCRIPT/);

console.log('PASS PROG-089-CLIENT-DEMO-PACK-RUNBOOK-DOCS-EXIST');
console.log('PASS PROG-089-CLIENT-DEMO-PACK-RUNBOOK-HASH-STABLE');
console.log('PASS PROG-089-BUILDER-STABLE');
console.log('PASS PROG-089-SOURCE-PROG-088-INTEGRITY-VALID');
console.log('PASS PROG-089-RUNBOOK-PHASES-DEFINED');
console.log('PASS PROG-089-RUNBOOK-STEPS-EVIDENCE-BOUND');
console.log('PASS PROG-089-RUNBOOK-READY-NOT-CLIENT-PACK-READY');
console.log('PASS PROG-089-AI-RUNBOOK-AUTHORITY-DISALLOWED');
console.log('PASS PROG-089-NEXT-PROG-090-RECORDED');
console.log('PASS PROG-089-NO-UNSUPPORTED-READINESS-CLAIMS');
