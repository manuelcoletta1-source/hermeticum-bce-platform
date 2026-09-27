'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { sha256Digest } = require('../../../packages/hbce-core/canonical-json.js');
const {
  STATUS,
  SOURCE_REF,
  ALLOWED_QUESTION_CLASSES,
  DEFERRED_QUESTION_CLASSES,
  APPROVED_QA,
  DEFERRED_ANSWERS,
  buildQaBoundaryPayload,
  buildLevel1ClientDemoPackQaBoundary
} = require('../../../runtime/level1/build-prog-091-level1-client-demo-pack-qa-boundary.js');

const root = path.resolve(__dirname, '../../..');
const read = (p) => fs.readFileSync(path.join(root, p), 'utf8');
const json = (p) => JSON.parse(read(p));
const exists = (p) => fs.existsSync(path.join(root, p));

const docPath = 'docs/launch/level1/prog-091-level1-client-demo-pack-qa-boundary.json';
const mdPath = 'docs/launch/level1/prog-091-level1-client-demo-pack-qa-boundary.md';
const runtimePath = 'runtime/level1/build-prog-091-level1-client-demo-pack-qa-boundary.js';

for (const p of [docPath, mdPath, runtimePath, SOURCE_REF]) assert.equal(exists(p), true, `${p} must exist`);

const doc = json(docPath);
const md = read(mdPath);
const source = json(SOURCE_REF);

assert.equal(doc.proto, 'HBCE-L1-PROG-091-CLIENT-DEMO-PACK-QA-BOUNDARY-v1');
assert.equal(doc.kind, 'HBCE_LEVEL1_CLIENT_DEMO_PACK_QA_BOUNDARY');
assert.equal(doc.issue_id, 'PROG-091');
assert.equal(doc.level1_client_demo_pack_qa_boundary_status, STATUS);
assert.equal(doc.source_client_demo_pack_script_revision_hash, source.revision_hash);
assert.equal(doc.source_client_demo_pack_script_revision_hash_valid, true);

const regenerated = buildLevel1ClientDemoPackQaBoundary({ rootDir: root, repositoryCommit: doc.repository_baseline_commit });
assert.deepEqual(regenerated, doc);

const body = { ...doc };
delete body.revision_hash;
assert.equal(doc.revision_hash, sha256Digest(body));

assert.equal(doc.inherited_client_demo_script_boundary.script_status, 'LEVEL1_CLIENT_DEMO_PACK_SCRIPT_DEFINED_NOT_CLIENT_READY');
assert.equal(doc.inherited_client_demo_script_boundary.pack_scope, 'LEVEL1_DECISION_PROOF_CLIENT_DEMO_PACK');
assert.equal(doc.inherited_client_demo_script_boundary.pack_status, 'SCRIPT_DEFINED_NOT_CLIENT_READY');
assert.equal(doc.inherited_client_demo_script_boundary.script_scope, 'LEVEL1_DECISION_PROOF_CLIENT_DEMO_PACK_SYNTHETIC_ONLY');
assert.equal(doc.inherited_client_demo_script_boundary.script_mode, 'CONTROLLED_CLIENT_DEMO_SCRIPT');
assert.equal(doc.inherited_client_demo_script_boundary.script_ready, true);
assert.equal(doc.inherited_client_demo_script_boundary.all_script_phases_defined, true);
assert.equal(doc.inherited_client_demo_script_boundary.all_script_sections_evidence_bound, true);
assert.equal(doc.inherited_client_demo_script_boundary.prior_q_and_a_boundary_ready, false);
assert.equal(doc.inherited_client_demo_script_boundary.prior_readiness_gate_passed, false);
assert.equal(doc.inherited_client_demo_script_boundary.prior_public_surface_ready, false);
assert.equal(doc.inherited_client_demo_script_boundary.prior_external_customer_ready, false);
assert.equal(doc.inherited_client_demo_script_boundary.prior_banking_pack_ready, false);
assert.equal(doc.inherited_client_demo_script_boundary.prior_level1_client_pack_ready, false);
assert.equal(doc.inherited_client_demo_script_boundary.prior_level1_launch_ready, false);
assert.equal(doc.inherited_client_demo_script_boundary.prior_production_ready, false);

const expectedPayload = buildQaBoundaryPayload(source);
const qa = doc.client_demo_pack_qa_boundary;

assert.equal(qa.qa_boundary_payload_digest, sha256Digest(expectedPayload));
assert.equal(qa.qa_boundary_id, 'CLIENT-DEMO-PACK-QA-BOUNDARY::HBCE-L1-DECISION-PROOF-0001');
assert.equal(qa.source_script_ref, SOURCE_REF);
assert.equal(qa.source_script_digest, source.client_demo_pack_script.script_payload_digest);
assert.equal(qa.pack_scope, 'LEVEL1_DECISION_PROOF_CLIENT_DEMO_PACK');
assert.equal(qa.pack_status, 'QA_BOUNDARY_DEFINED_NOT_CLIENT_READY');
assert.equal(qa.qa_scope, 'LEVEL1_DECISION_PROOF_CLIENT_DEMO_PACK_SYNTHETIC_ONLY');
assert.equal(qa.qa_mode, 'CONTROLLED_CLIENT_DEMO_QA_BOUNDARY');
assert.deepEqual(qa.allowed_question_classes, ALLOWED_QUESTION_CLASSES);
assert.deepEqual(qa.deferred_question_classes, DEFERRED_QUESTION_CLASSES);
assert.equal(qa.approved_answer_count, APPROVED_QA.length);
assert.equal(qa.deferred_answer_count, DEFERRED_ANSWERS.length);
assert.equal(qa.all_allowed_question_classes_have_answers, true);
assert.equal(qa.all_deferred_question_classes_have_responses, true);
assert.equal(qa.all_approved_answers_evidence_bound, true);

for (const cls of ALLOWED_QUESTION_CLASSES) {
  const answer = qa.approved_answers.find((entry) => entry.question_class === cls);
  assert.ok(answer, `${cls} must have approved answer`);
  assert.equal(typeof answer.allowed_answer, 'string');
  assert.equal(answer.allowed_answer.length > 0, true);
  assert.equal(answer.evidence_bound, true);
  assert.equal(answer.evidence_binding.all_evidence_refs_bound, true);
  assert.equal(answer.may_expand_answer, false);
  assert.equal(answer.must_preserve_boundary_language, true);
}

for (const cls of DEFERRED_QUESTION_CLASSES) {
  const answer = qa.deferred_answers.find((entry) => entry.question_class === cls);
  assert.ok(answer, `${cls} must have deferred response`);
  assert.equal(typeof answer.required_response, 'string');
  assert.equal(answer.required_response.length > 0, true);
  assert.equal(answer.answer_policy, 'DEFER_TO_FUTURE_CONTROLLED_ARTIFACT');
  assert.equal(answer.may_improvise, false);
  assert.equal(answer.must_not_convert_to_readiness_claim, true);
}

for (const control of [
  'answer_only_allowed_question_classes',
  'use_approved_answer_language',
  'show_evidence_binding_when_answering',
  'defer_out_of_boundary_questions',
  'do_not_claim_client_pack_readiness',
  'do_not_claim_launch_readiness',
  'do_not_claim_production_readiness',
  'do_not_claim_legal_validity',
  'do_not_claim_security_certification',
  'do_not_authorize_ai_authority'
]) {
  assert.equal(qa.qa_controls.includes(control), true, `${control} must be present`);
}

assert.equal(qa.qa_boundary.synthetic_demo_only, true);
assert.equal(qa.qa_boundary.script_required, true);
assert.equal(qa.qa_boundary.runbook_required, true);
assert.equal(qa.qa_boundary.evidence_index_required, true);
assert.equal(qa.qa_boundary.no_customer_data, true);
assert.equal(qa.qa_boundary.no_live_system_control, true);
assert.equal(qa.qa_boundary.no_production_integration, true);
assert.equal(qa.qa_boundary.no_legal_validity_claim, true);
assert.equal(qa.qa_boundary.no_public_accreditation_claim, true);
assert.equal(qa.qa_boundary.no_procurement_eligibility_claim, true);
assert.equal(qa.qa_boundary.no_external_effect_claim, true);
assert.equal(qa.qa_boundary.no_business_success_claim, true);
assert.equal(qa.qa_boundary.no_ai_authority_claim, true);
assert.equal(qa.qa_boundary.no_pricing_commitment, true);
assert.equal(qa.qa_boundary.no_sla_commitment, true);
assert.equal(qa.qa_boundary.no_security_certification_claim, true);

assert.equal(qa.client_demo_pack_runbook_ready, true);
assert.equal(qa.client_demo_pack_script_ready, true);
assert.equal(qa.client_demo_pack_q_and_a_boundary_ready, true);
assert.equal(qa.client_demo_pack_readiness_gate_passed, false);
assert.equal(qa.public_surface_ready, false);
assert.equal(qa.external_customer_ready, false);
assert.equal(qa.banking_pack_ready, false);
assert.equal(qa.level1_client_pack_ready, false);
assert.equal(qa.level1_launch_ready, false);
assert.equal(qa.production_ready, false);
assert.equal(qa.ai_qa_authority_allowed, false);

assert.equal(qa.qa_checklist.source_script_hash_valid, true);
assert.equal(qa.qa_checklist.script_ready, true);
assert.equal(qa.qa_checklist.runbook_ready, true);
assert.equal(qa.qa_checklist.evidence_index_ready, true);
assert.equal(qa.qa_checklist.scope_locked, true);
assert.equal(qa.qa_checklist.decision_proof_demo_ready_confirmed, true);
assert.equal(qa.qa_checklist.all_allowed_question_classes_have_answers, true);
assert.equal(qa.qa_checklist.all_deferred_question_classes_have_responses, true);
assert.equal(qa.qa_checklist.all_approved_answers_evidence_bound, true);
assert.equal(qa.qa_checklist.launch_readiness_excluded, true);
assert.equal(qa.qa_checklist.client_pack_readiness_excluded, true);
assert.equal(qa.qa_checklist.production_readiness_excluded, true);
assert.equal(qa.qa_checklist.ai_authority_absence_confirmed, true);

assert.equal(qa.qa_boundary_defined, true);
assert.equal(qa.qa_boundary_is_not_client_pack_readiness, true);
assert.equal(qa.qa_boundary_is_not_launch_readiness, true);
assert.equal(qa.qa_boundary_is_not_public_surface_readiness, true);
assert.equal(qa.qa_boundary_is_not_external_customer_readiness, true);
assert.equal(qa.qa_boundary_is_not_banking_pack_readiness, true);
assert.equal(qa.qa_boundary_is_not_production_readiness, true);
assert.equal(qa.qa_boundary_is_not_legal_validity, true);
assert.equal(qa.qa_boundary_is_not_security_certification, true);

for (const code of ['CLIENT_DEMO_PACK_QA_BOUNDARY_MISSING', 'SOURCE_CLIENT_DEMO_PACK_SCRIPT_HASH_INVALID', 'CLIENT_DEMO_PACK_SCRIPT_NOT_READY', 'ALLOWED_QUESTION_CLASS_WITHOUT_APPROVED_ANSWER', 'DEFERRED_QUESTION_CLASS_WITHOUT_RESPONSE', 'APPROVED_ANSWER_EVIDENCE_REF_MISSING', 'CUSTOMER_DATA_CLAIM_BLOCKED', 'LIVE_SYSTEM_CONTROL_CLAIM_BLOCKED', 'UNSUPPORTED_READINESS_CLAIM', 'AI_QA_AUTHORITY_CLAIM_BLOCKED']) {
  assert.equal(doc.fail_closed_codes.includes(code), true, `${code} must be present`);
}

assert.equal(doc.readiness_state.client_demo_pack_q_and_a_boundary_defined, true);
assert.equal(doc.readiness_state.client_demo_pack_q_and_a_boundary_ready, true);
assert.equal(doc.readiness_state.source_client_demo_pack_script_bound, true);
assert.equal(doc.readiness_state.client_demo_pack_script_ready, true);
assert.equal(doc.readiness_state.client_demo_pack_runbook_ready, true);
assert.equal(doc.readiness_state.client_demo_pack_evidence_index_ready, true);
assert.equal(doc.readiness_state.client_demo_pack_scope_locked, true);
assert.equal(doc.readiness_state.decision_proof_demo_ready, true);
assert.equal(doc.readiness_state.all_allowed_question_classes_have_answers, true);
assert.equal(doc.readiness_state.all_deferred_question_classes_have_responses, true);
assert.equal(doc.readiness_state.all_approved_answers_evidence_bound, true);
assert.equal(doc.readiness_state.qa_controls_defined, true);
assert.equal(doc.readiness_state.client_demo_pack_readiness_gate_passed, false);
assert.equal(doc.readiness_state.public_surface_ready, false);
assert.equal(doc.readiness_state.external_customer_ready, false);
assert.equal(doc.readiness_state.banking_pack_ready, false);
assert.equal(doc.readiness_state.level1_client_pack_ready, false);
assert.equal(doc.readiness_state.level1_launch_ready, false);
assert.equal(doc.readiness_state.production_ready, false);

assert.equal(doc.next_required_program, 'PROG-092-HBCE-LEVEL1-CLIENT-DEMO-PACK-READINESS-GATE');

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

assert.match(md, /LEVEL1_CLIENT_DEMO_PACK_QA_BOUNDARY_DEFINED_NOT_CLIENT_READY/);
assert.match(md, /The client demo pack Q&A boundary is defined/);
assert.match(md, /The client demo pack Q&A boundary is ready/);
assert.match(md, /The client demo pack readiness gate is not passed/);
assert.match(md, /customer_data_validation/);
assert.match(md, /banking_pack_readiness/);
assert.match(md, /The Q&A boundary does not make the client demo pack ready/);
assert.match(md, /PROG-092-HBCE-LEVEL1-CLIENT-DEMO-PACK-READINESS-GATE/);

console.log('PASS PROG-091-CLIENT-DEMO-PACK-QA-BOUNDARY-DOCS-EXIST');
console.log('PASS PROG-091-CLIENT-DEMO-PACK-QA-BOUNDARY-HASH-STABLE');
console.log('PASS PROG-091-BUILDER-STABLE');
console.log('PASS PROG-091-SOURCE-PROG-090-INTEGRITY-VALID');
console.log('PASS PROG-091-ALLOWED-QUESTIONS-HAVE-ANSWERS');
console.log('PASS PROG-091-DEFERRED-QUESTIONS-HAVE-RESPONSES');
console.log('PASS PROG-091-APPROVED-ANSWERS-EVIDENCE-BOUND');
console.log('PASS PROG-091-QA-BOUNDARY-READY-NOT-CLIENT-PACK-READY');
console.log('PASS PROG-091-AI-QA-AUTHORITY-DISALLOWED');
console.log('PASS PROG-091-NEXT-PROG-092-RECORDED');
console.log('PASS PROG-091-NO-UNSUPPORTED-READINESS-CLAIMS');
