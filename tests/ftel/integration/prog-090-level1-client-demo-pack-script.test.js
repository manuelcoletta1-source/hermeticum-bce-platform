'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { sha256Digest } = require('../../../packages/hbce-core/canonical-json.js');
const {
  STATUS,
  SOURCE_REF,
  SCRIPT_PHASES,
  SCRIPT_STOP_LINES,
  PHASE_SCRIPT_LINES,
  buildScriptPayload,
  buildLevel1ClientDemoPackScript
} = require('../../../runtime/level1/build-prog-090-level1-client-demo-pack-script.js');

const root = path.resolve(__dirname, '../../..');
const read = (p) => fs.readFileSync(path.join(root, p), 'utf8');
const json = (p) => JSON.parse(read(p));
const exists = (p) => fs.existsSync(path.join(root, p));

const docPath = 'docs/launch/level1/prog-090-level1-client-demo-pack-script.json';
const mdPath = 'docs/launch/level1/prog-090-level1-client-demo-pack-script.md';
const runtimePath = 'runtime/level1/build-prog-090-level1-client-demo-pack-script.js';

for (const p of [docPath, mdPath, runtimePath, SOURCE_REF]) assert.equal(exists(p), true, `${p} must exist`);

const doc = json(docPath);
const md = read(mdPath);
const source = json(SOURCE_REF);

assert.equal(doc.proto, 'HBCE-L1-PROG-090-CLIENT-DEMO-PACK-SCRIPT-v1');
assert.equal(doc.kind, 'HBCE_LEVEL1_CLIENT_DEMO_PACK_SCRIPT');
assert.equal(doc.issue_id, 'PROG-090');
assert.equal(doc.level1_client_demo_pack_script_status, STATUS);
assert.equal(doc.source_client_demo_pack_runbook_revision_hash, source.revision_hash);
assert.equal(doc.source_client_demo_pack_runbook_revision_hash_valid, true);

const regenerated = buildLevel1ClientDemoPackScript({ rootDir: root, repositoryCommit: doc.repository_baseline_commit });
assert.deepEqual(regenerated, doc);

const body = { ...doc };
delete body.revision_hash;
assert.equal(doc.revision_hash, sha256Digest(body));

assert.equal(doc.inherited_client_demo_runbook_boundary.runbook_status, 'LEVEL1_CLIENT_DEMO_PACK_RUNBOOK_DEFINED_NOT_CLIENT_READY');
assert.equal(doc.inherited_client_demo_runbook_boundary.pack_scope, 'LEVEL1_DECISION_PROOF_CLIENT_DEMO_PACK');
assert.equal(doc.inherited_client_demo_runbook_boundary.pack_status, 'RUNBOOK_DEFINED_NOT_CLIENT_READY');
assert.equal(doc.inherited_client_demo_runbook_boundary.runbook_scope, 'LEVEL1_DECISION_PROOF_CLIENT_DEMO_PACK_SYNTHETIC_ONLY');
assert.equal(doc.inherited_client_demo_runbook_boundary.runbook_mode, 'CONTROLLED_CLIENT_DEMO_RUNBOOK');
assert.equal(doc.inherited_client_demo_runbook_boundary.runbook_ready, true);
assert.equal(doc.inherited_client_demo_runbook_boundary.all_runbook_phases_defined, true);
assert.equal(doc.inherited_client_demo_runbook_boundary.all_step_evidence_refs_bound, true);
assert.equal(doc.inherited_client_demo_runbook_boundary.prior_script_ready, false);
assert.equal(doc.inherited_client_demo_runbook_boundary.prior_q_and_a_boundary_ready, false);
assert.equal(doc.inherited_client_demo_runbook_boundary.prior_readiness_gate_passed, false);
assert.equal(doc.inherited_client_demo_runbook_boundary.prior_public_surface_ready, false);
assert.equal(doc.inherited_client_demo_runbook_boundary.prior_external_customer_ready, false);
assert.equal(doc.inherited_client_demo_runbook_boundary.prior_banking_pack_ready, false);
assert.equal(doc.inherited_client_demo_runbook_boundary.prior_level1_client_pack_ready, false);
assert.equal(doc.inherited_client_demo_runbook_boundary.prior_level1_launch_ready, false);
assert.equal(doc.inherited_client_demo_runbook_boundary.prior_production_ready, false);

const expectedPayload = buildScriptPayload(source);
const script = doc.client_demo_pack_script;

assert.equal(script.script_payload_digest, sha256Digest(expectedPayload));
assert.equal(script.script_id, 'CLIENT-DEMO-PACK-SCRIPT::HBCE-L1-DECISION-PROOF-0001');
assert.equal(script.source_runbook_ref, SOURCE_REF);
assert.equal(script.source_runbook_digest, source.client_demo_pack_runbook.runbook_payload_digest);
assert.equal(script.pack_scope, 'LEVEL1_DECISION_PROOF_CLIENT_DEMO_PACK');
assert.equal(script.pack_status, 'SCRIPT_DEFINED_NOT_CLIENT_READY');
assert.equal(script.script_scope, 'LEVEL1_DECISION_PROOF_CLIENT_DEMO_PACK_SYNTHETIC_ONLY');
assert.equal(script.script_mode, 'CONTROLLED_CLIENT_DEMO_SCRIPT');
assert.deepEqual(script.script_phases, SCRIPT_PHASES);
assert.equal(script.script_section_count, SCRIPT_PHASES.length);
assert.equal(script.script_sections.length, SCRIPT_PHASES.length);
assert.equal(script.all_script_phases_defined, true);
assert.equal(script.all_script_sections_have_presenter_lines, true);
assert.equal(script.all_script_sections_evidence_bound, true);

for (const phase of SCRIPT_PHASES) {
  const section = script.script_sections.find((entry) => entry.phase === phase);
  assert.ok(section, `${phase} must be present`);
  assert.equal(section.presenter_line, PHASE_SCRIPT_LINES[phase]);
  assert.equal(section.evidence_issues.length > 0, true);
  assert.equal(section.evidence_refs.length > 0, true);
  assert.equal(section.all_evidence_refs_bound, true);
  assert.equal(section.allowed_to_improvise, false);
  assert.equal(section.must_preserve_boundary_language, true);
}

for (const stop of SCRIPT_STOP_LINES) {
  assert.equal(script.stop_lines.includes(stop), true, `${stop} must be present`);
}

assert.equal(script.required_script_controls.includes('read_scope_boundary_before_demo'), true);
assert.equal(script.required_script_controls.includes('show_evidence_index_before_explanation'), true);
assert.equal(script.required_script_controls.includes('use_scripted_boundary_language'), true);
assert.equal(script.required_script_controls.includes('do_not_claim_client_pack_readiness'), true);
assert.equal(script.required_script_controls.includes('do_not_claim_launch_readiness'), true);
assert.equal(script.required_script_controls.includes('do_not_claim_production_readiness'), true);
assert.equal(script.required_script_controls.includes('do_not_claim_legal_validity'), true);
assert.equal(script.required_script_controls.includes('do_not_claim_security_certification'), true);
assert.equal(script.required_script_controls.includes('stop_on_excluded_claim_request'), true);

assert.equal(script.script_boundary.synthetic_demo_only, true);
assert.equal(script.script_boundary.evidence_index_required, true);
assert.equal(script.script_boundary.runbook_required, true);
assert.equal(script.script_boundary.no_customer_data, true);
assert.equal(script.script_boundary.no_live_system_control, true);
assert.equal(script.script_boundary.no_production_integration, true);
assert.equal(script.script_boundary.no_legal_validity_claim, true);
assert.equal(script.script_boundary.no_public_accreditation_claim, true);
assert.equal(script.script_boundary.no_procurement_eligibility_claim, true);
assert.equal(script.script_boundary.no_external_effect_claim, true);
assert.equal(script.script_boundary.no_business_success_claim, true);
assert.equal(script.script_boundary.no_ai_authority_claim, true);
assert.equal(script.script_boundary.no_pricing_commitment, true);
assert.equal(script.script_boundary.no_sla_commitment, true);
assert.equal(script.script_boundary.no_security_certification_claim, true);

assert.equal(script.client_demo_pack_runbook_ready, true);
assert.equal(script.client_demo_pack_script_ready, true);
assert.equal(script.client_demo_pack_q_and_a_boundary_ready, false);
assert.equal(script.client_demo_pack_readiness_gate_passed, false);
assert.equal(script.public_surface_ready, false);
assert.equal(script.external_customer_ready, false);
assert.equal(script.banking_pack_ready, false);
assert.equal(script.level1_client_pack_ready, false);
assert.equal(script.level1_launch_ready, false);
assert.equal(script.production_ready, false);
assert.equal(script.ai_script_authority_allowed, false);

assert.equal(script.script_checklist.source_runbook_hash_valid, true);
assert.equal(script.script_checklist.runbook_ready, true);
assert.equal(script.script_checklist.evidence_index_ready, true);
assert.equal(script.script_checklist.scope_locked, true);
assert.equal(script.script_checklist.decision_proof_demo_ready_confirmed, true);
assert.equal(script.script_checklist.all_script_phases_defined, true);
assert.equal(script.script_checklist.all_script_sections_have_presenter_lines, true);
assert.equal(script.script_checklist.all_script_sections_evidence_bound, true);
assert.equal(script.script_checklist.stop_lines_defined, true);
assert.equal(script.script_checklist.launch_readiness_excluded, true);
assert.equal(script.script_checklist.client_pack_readiness_excluded, true);
assert.equal(script.script_checklist.production_readiness_excluded, true);
assert.equal(script.script_checklist.ai_authority_absence_confirmed, true);

assert.equal(script.script_defined, true);
assert.equal(script.script_is_not_client_pack_readiness, true);
assert.equal(script.script_is_not_launch_readiness, true);
assert.equal(script.script_is_not_public_surface_readiness, true);
assert.equal(script.script_is_not_external_customer_readiness, true);
assert.equal(script.script_is_not_banking_pack_readiness, true);
assert.equal(script.script_is_not_production_readiness, true);
assert.equal(script.script_is_not_legal_validity, true);
assert.equal(script.script_is_not_security_certification, true);

for (const code of ['CLIENT_DEMO_PACK_SCRIPT_MISSING', 'SOURCE_CLIENT_DEMO_PACK_RUNBOOK_HASH_INVALID', 'CLIENT_DEMO_PACK_RUNBOOK_NOT_READY', 'REQUIRED_SCRIPT_PHASE_MISSING', 'SCRIPT_SECTION_EVIDENCE_REF_MISSING', 'SCRIPT_STOP_LINE_MISSING', 'CUSTOMER_DATA_CLAIM_BLOCKED', 'LIVE_SYSTEM_CONTROL_CLAIM_BLOCKED', 'UNSUPPORTED_READINESS_CLAIM', 'AI_SCRIPT_AUTHORITY_CLAIM_BLOCKED']) {
  assert.equal(doc.fail_closed_codes.includes(code), true, `${code} must be present`);
}

assert.equal(doc.readiness_state.client_demo_pack_script_defined, true);
assert.equal(doc.readiness_state.client_demo_pack_script_ready, true);
assert.equal(doc.readiness_state.source_client_demo_pack_runbook_bound, true);
assert.equal(doc.readiness_state.client_demo_pack_runbook_ready, true);
assert.equal(doc.readiness_state.client_demo_pack_evidence_index_ready, true);
assert.equal(doc.readiness_state.client_demo_pack_scope_locked, true);
assert.equal(doc.readiness_state.decision_proof_demo_ready, true);
assert.equal(doc.readiness_state.all_script_phases_defined, true);
assert.equal(doc.readiness_state.all_script_sections_have_presenter_lines, true);
assert.equal(doc.readiness_state.all_script_sections_evidence_bound, true);
assert.equal(doc.readiness_state.stop_lines_defined, true);
assert.equal(doc.readiness_state.script_controls_defined, true);
assert.equal(doc.readiness_state.client_demo_pack_q_and_a_boundary_ready, false);
assert.equal(doc.readiness_state.client_demo_pack_readiness_gate_passed, false);
assert.equal(doc.readiness_state.public_surface_ready, false);
assert.equal(doc.readiness_state.external_customer_ready, false);
assert.equal(doc.readiness_state.banking_pack_ready, false);
assert.equal(doc.readiness_state.level1_client_pack_ready, false);
assert.equal(doc.readiness_state.level1_launch_ready, false);
assert.equal(doc.readiness_state.production_ready, false);

assert.equal(doc.next_required_program, 'PROG-091-HBCE-LEVEL1-CLIENT-DEMO-PACK-QA-BOUNDARY');

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

assert.match(md, /LEVEL1_CLIENT_DEMO_PACK_SCRIPT_DEFINED_NOT_CLIENT_READY/);
assert.match(md, /The client demo pack script is defined/);
assert.match(md, /The client demo pack script is ready/);
assert.match(md, /The client demo Q&A boundary is not ready/);
assert.match(md, /The client demo pack readiness gate is not passed/);
assert.match(md, /The script must preserve the synthetic-only boundary/);
assert.match(md, /The script must not claim production readiness/);
assert.match(md, /CLIENT_QUESTIONS_BOUNDARY/);
assert.match(md, /The script does not make the client demo pack ready/);
assert.match(md, /PROG-091-HBCE-LEVEL1-CLIENT-DEMO-PACK-QA-BOUNDARY/);

console.log('PASS PROG-090-CLIENT-DEMO-PACK-SCRIPT-DOCS-EXIST');
console.log('PASS PROG-090-CLIENT-DEMO-PACK-SCRIPT-HASH-STABLE');
console.log('PASS PROG-090-BUILDER-STABLE');
console.log('PASS PROG-090-SOURCE-PROG-089-INTEGRITY-VALID');
console.log('PASS PROG-090-SCRIPT-PHASES-DEFINED');
console.log('PASS PROG-090-SCRIPT-SECTIONS-EVIDENCE-BOUND');
console.log('PASS PROG-090-SCRIPT-READY-NOT-CLIENT-PACK-READY');
console.log('PASS PROG-090-AI-SCRIPT-AUTHORITY-DISALLOWED');
console.log('PASS PROG-090-NEXT-PROG-091-RECORDED');
console.log('PASS PROG-090-NO-UNSUPPORTED-READINESS-CLAIMS');
