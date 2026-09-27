'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { sha256Digest } = require('../../../packages/hbce-core/canonical-json.js');
const {
  STATUS,
  SOURCE_REF,
  RUNBOOK_PHASES,
  REQUIRED_INPUTS,
  REQUIRED_OUTPUTS,
  buildDecisionProofDemoRunbook
} = require('../../../runtime/level1/build-prog-078-decision-proof-demo-runbook.js');

const root = path.resolve(__dirname, '../../..');
const read = (p) => fs.readFileSync(path.join(root, p), 'utf8');
const json = (p) => JSON.parse(read(p));
const exists = (p) => fs.existsSync(path.join(root, p));

const docPath = 'docs/launch/level1/prog-078-decision-proof-demo-runbook.json';
const mdPath = 'docs/launch/level1/prog-078-decision-proof-demo-runbook.md';
const runtimePath = 'runtime/level1/build-prog-078-decision-proof-demo-runbook.js';

for (const p of [docPath, mdPath, runtimePath, SOURCE_REF]) assert.equal(exists(p), true, `${p} must exist`);

const doc = json(docPath);
const md = read(mdPath);
const source = json(SOURCE_REF);

assert.equal(doc.proto, 'HBCE-L1-PROG-078-DECISION-PROOF-DEMO-RUNBOOK-v1');
assert.equal(doc.kind, 'HBCE_LEVEL1_DECISION_PROOF_DEMO_RUNBOOK');
assert.equal(doc.issue_id, 'PROG-078');
assert.equal(doc.decision_proof_demo_runbook_status, STATUS);
assert.equal(doc.source_closure_gate_revision_hash, source.revision_hash);
assert.equal(doc.source_closure_gate_revision_hash_valid, true);

const regenerated = buildDecisionProofDemoRunbook({ rootDir: root, repositoryCommit: doc.repository_baseline_commit });
assert.deepEqual(regenerated, doc);

const body = { ...doc };
delete body.revision_hash;
assert.equal(doc.revision_hash, sha256Digest(body));

assert.equal(doc.inherited_closure_boundary.structural_chain_defined, true);
assert.equal(doc.inherited_closure_boundary.decision_proof_chain_closed, false);
assert.equal(doc.inherited_closure_boundary.concrete_demo_case_bound, false);
assert.equal(doc.inherited_closure_boundary.verifier_replay_executed, false);
assert.equal(doc.inherited_closure_boundary.verifier_replay_passed, false);
assert.equal(doc.inherited_closure_boundary.decision_proof_demo_ready, false);

assert.deepEqual(doc.demo_runbook.runbook_phases, RUNBOOK_PHASES);
assert.deepEqual(doc.demo_runbook.required_inputs, REQUIRED_INPUTS);
assert.deepEqual(doc.demo_runbook.required_outputs, REQUIRED_OUTPUTS);
assert.equal(doc.demo_runbook.demo_scope_required, true);
assert.equal(doc.demo_runbook.authority_binding_required, true);
assert.equal(doc.demo_runbook.policy_evaluation_required, true);
assert.equal(doc.demo_runbook.action_request_required, true);
assert.equal(doc.demo_runbook.action_receipt_required, true);
assert.equal(doc.demo_runbook.audit_event_required, true);
assert.equal(doc.demo_runbook.evidence_export_required, true);
assert.equal(doc.demo_runbook.verifier_replay_required, true);
assert.equal(doc.demo_runbook.closure_gate_reevaluation_required, true);
assert.equal(doc.demo_runbook.ordered_execution_required, true);
assert.equal(doc.demo_runbook.manual_human_acceptance_required, true);
assert.equal(doc.demo_runbook.runbook_is_not_demo_execution, true);
assert.equal(doc.demo_runbook.runbook_is_not_chain_closure, true);
assert.equal(doc.demo_runbook.runbook_is_not_effect_proof, true);
assert.equal(doc.demo_runbook.runbook_is_not_legal_validity, true);
assert.equal(doc.demo_runbook.ai_model_demo_authority_allowed, false);

assert.equal(doc.phase_gates.length, RUNBOOK_PHASES.length);
for (const phase of RUNBOOK_PHASES) {
  assert.equal(doc.phase_gates.some((gate) => gate.phase === phase), true, `${phase} gate must exist`);
}

for (const code of ['DEMO_RUNBOOK_MISSING', 'DEMO_CASE_ID_MISSING', 'AUTHORITY_BINDING_MISSING', 'POLICY_EVALUATION_NOT_ALLOW', 'VERIFIER_REPLAY_NOT_EXECUTED', 'VERIFIER_REPLAY_NOT_PASSED', 'CLOSURE_GATE_NOT_RERUN', 'AI_DEMO_AUTHORITY_CLAIM_BLOCKED']) {
  assert.equal(doc.fail_closed_codes.includes(code), true, `${code} must be present`);
}

assert.equal(doc.readiness_state.decision_proof_demo_runbook_defined, true);
assert.equal(doc.readiness_state.decision_proof_demo_runbook_ready, false);
assert.equal(doc.readiness_state.concrete_demo_case_bound, false);
assert.equal(doc.readiness_state.runbook_executed, false);
assert.equal(doc.readiness_state.authority_boundary_bound, false);
assert.equal(doc.readiness_state.policy_evaluation_executed, false);
assert.equal(doc.readiness_state.action_request_created, false);
assert.equal(doc.readiness_state.action_receipt_captured, false);
assert.equal(doc.readiness_state.audit_event_recorded, false);
assert.equal(doc.readiness_state.evidence_export_generated, false);
assert.equal(doc.readiness_state.verifier_replay_executed, false);
assert.equal(doc.readiness_state.verifier_replay_passed, false);
assert.equal(doc.readiness_state.closure_gate_rerun, false);
assert.equal(doc.readiness_state.decision_proof_chain_closed, false);
assert.equal(doc.readiness_state.decision_proof_demo_ready, false);
assert.equal(doc.readiness_state.level1_launch_ready, false);
assert.equal(doc.readiness_state.production_ready, false);

assert.equal(doc.next_required_program, 'PROG-079-HBCE-LEVEL1-DECISION-PROOF-DEMO-FIXTURE');

assert.equal(doc.non_claims.runbook_executed, false);
assert.equal(doc.non_claims.concrete_demo_case_bound, false);
assert.equal(doc.non_claims.verifier_replay_completed, false);
assert.equal(doc.non_claims.verifier_replay_passed, false);
assert.equal(doc.non_claims.decision_proof_chain_closed, false);
assert.equal(doc.non_claims.decision_proof_demo_ready, false);
assert.equal(doc.non_claims.effect_proven, false);
assert.equal(doc.non_claims.legal_validity, false);
assert.equal(doc.non_claims.ai_authority, false);
assert.equal(doc.non_claims.level1_launch_ready, false);
assert.equal(doc.non_claims.production_ready, false);

assert.match(md, /LEVEL1_DECISION_PROOF_DEMO_RUNBOOK_DEFINED_NOT_READY/);
assert.match(md, /The runbook is not executed/);
assert.match(md, /The concrete demo case is not bound/);
assert.match(md, /The Decision Proof chain is not closed/);
assert.match(md, /Manual human acceptance is required/);
assert.match(md, /The runbook is not effect proof/);
assert.match(md, /AI demo authority claims fail closed/);
assert.match(md, /PROG-079-HBCE-LEVEL1-DECISION-PROOF-DEMO-FIXTURE/);

console.log('PASS PROG-078-DEMO-RUNBOOK-DOCS-EXIST');
console.log('PASS PROG-078-DEMO-RUNBOOK-HASH-STABLE');
console.log('PASS PROG-078-BUILDER-STABLE');
console.log('PASS PROG-078-SOURCE-PROG-077-INTEGRITY-VALID');
console.log('PASS PROG-078-RUNBOOK-PHASES-DEFINED');
console.log('PASS PROG-078-REQUIRED-INPUTS-AND-OUTPUTS-DEFINED');
console.log('PASS PROG-078-PHASE-GATES-DEFINED');
console.log('PASS PROG-078-AI-DEMO-AUTHORITY-DISALLOWED');
console.log('PASS PROG-078-NEXT-PROG-079-RECORDED');
console.log('PASS PROG-078-NO-UNSUPPORTED-READINESS-CLAIMS');
