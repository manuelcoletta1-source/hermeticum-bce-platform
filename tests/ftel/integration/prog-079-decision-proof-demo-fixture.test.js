'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { sha256Digest } = require('../../../packages/hbce-core/canonical-json.js');
const {
  STATUS,
  SOURCE_REF,
  FIXTURE_INPUTS,
  FIXTURE_OUTPUT_TARGETS,
  buildDecisionProofDemoFixture
} = require('../../../runtime/level1/build-prog-079-decision-proof-demo-fixture.js');

const root = path.resolve(__dirname, '../../..');
const read = (p) => fs.readFileSync(path.join(root, p), 'utf8');
const json = (p) => JSON.parse(read(p));
const exists = (p) => fs.existsSync(path.join(root, p));

const docPath = 'docs/launch/level1/prog-079-decision-proof-demo-fixture.json';
const mdPath = 'docs/launch/level1/prog-079-decision-proof-demo-fixture.md';
const runtimePath = 'runtime/level1/build-prog-079-decision-proof-demo-fixture.js';

for (const p of [docPath, mdPath, runtimePath, SOURCE_REF]) assert.equal(exists(p), true, `${p} must exist`);

const doc = json(docPath);
const md = read(mdPath);
const source = json(SOURCE_REF);

assert.equal(doc.proto, 'HBCE-L1-PROG-079-DECISION-PROOF-DEMO-FIXTURE-v1');
assert.equal(doc.kind, 'HBCE_LEVEL1_DECISION_PROOF_DEMO_FIXTURE');
assert.equal(doc.issue_id, 'PROG-079');
assert.equal(doc.decision_proof_demo_fixture_status, STATUS);
assert.equal(doc.source_demo_runbook_revision_hash, source.revision_hash);
assert.equal(doc.source_demo_runbook_revision_hash_valid, true);

const regenerated = buildDecisionProofDemoFixture({ rootDir: root, repositoryCommit: doc.repository_baseline_commit });
assert.deepEqual(regenerated, doc);

const body = { ...doc };
delete body.revision_hash;
assert.equal(doc.revision_hash, sha256Digest(body));

assert.equal(doc.inherited_runbook_boundary.runbook_executed, false);
assert.equal(doc.inherited_runbook_boundary.concrete_demo_case_bound, false);
assert.equal(doc.inherited_runbook_boundary.decision_proof_chain_closed, false);
assert.equal(doc.inherited_runbook_boundary.decision_proof_demo_ready, false);
assert.equal(doc.inherited_runbook_boundary.ai_model_demo_authority_allowed, false);

assert.deepEqual(doc.demo_fixture.fixture_inputs, FIXTURE_INPUTS);
assert.deepEqual(doc.demo_fixture.fixture_output_targets, FIXTURE_OUTPUT_TARGETS);
assert.equal(doc.demo_fixture.deterministic_fixture_required, true);
assert.equal(doc.demo_fixture.synthetic_demo_only, true);
assert.equal(doc.demo_fixture.real_customer_data_allowed, false);
assert.equal(doc.demo_fixture.external_side_effects_allowed, false);
assert.equal(doc.demo_fixture.production_target_allowed, false);
assert.equal(doc.demo_fixture.live_authority_allowed, false);
assert.equal(doc.demo_fixture.demo_fixture_is_not_runbook_execution, true);
assert.equal(doc.demo_fixture.demo_fixture_is_not_verifier_replay, true);
assert.equal(doc.demo_fixture.demo_fixture_is_not_chain_closure, true);
assert.equal(doc.demo_fixture.demo_fixture_is_not_effect_proof, true);
assert.equal(doc.demo_fixture.demo_fixture_is_not_legal_validity, true);
assert.equal(doc.demo_fixture.ai_model_demo_authority_allowed, false);

assert.equal(doc.demo_fixture.fixture_payload.demo_case_id, 'HBCE-L1-DEMO-FIXTURE-0001');
assert.equal(doc.demo_fixture.fixture_payload.demo_scope, 'DEMO_ONLY_DIGITAL_ACTION');
assert.equal(doc.demo_fixture.fixture_payload.action_payload_fixture.action_class, 'DEMO_ONLY_DIGITAL_ACTION');
assert.equal(doc.demo_fixture.fixture_payload.target_fixture.target_effect_claim_allowed, false);
assert.equal(doc.demo_fixture.fixture_payload.audit_actor_fixture.actor_is_ai_authority, false);
assert.equal(doc.demo_fixture.fixture_payload.verifier_profile_fixture.expected_replay_result_after_execution, 'PASS');
assert.equal(doc.demo_fixture.fixture_payload_digest, sha256Digest(doc.demo_fixture.fixture_payload));

assert.equal(doc.fixture_acceptance_rules.demo_scope_must_be_demo_only, true);
assert.equal(doc.fixture_acceptance_rules.all_fixture_inputs_required_before_runbook_execution, true);
assert.equal(doc.fixture_acceptance_rules.any_missing_fixture_input_blocks_runbook_execution, true);
assert.equal(doc.fixture_acceptance_rules.any_external_effect_claim_blocks_fixture, true);
assert.equal(doc.fixture_acceptance_rules.any_ai_authority_claim_blocks_fixture, true);

for (const code of ['DEMO_FIXTURE_MISSING', 'DEMO_CASE_ID_MISSING', 'DEMO_SCOPE_INVALID', 'FIXTURE_PAYLOAD_DIGEST_MISSING', 'EXTERNAL_EFFECT_CLAIM_BLOCKED', 'LIVE_AUTHORITY_CLAIM_BLOCKED', 'AI_DEMO_AUTHORITY_CLAIM_BLOCKED']) {
  assert.equal(doc.fail_closed_codes.includes(code), true, `${code} must be present`);
}

assert.equal(doc.readiness_state.decision_proof_demo_fixture_defined, true);
assert.equal(doc.readiness_state.decision_proof_demo_fixture_ready, false);
assert.equal(doc.readiness_state.deterministic_fixture_payload_defined, true);
assert.equal(doc.readiness_state.fixture_payload_digest_bound, true);
assert.equal(doc.readiness_state.runbook_executed, false);
assert.equal(doc.readiness_state.authority_boundary_record_created, false);
assert.equal(doc.readiness_state.policy_evaluation_record_created, false);
assert.equal(doc.readiness_state.action_request_record_created, false);
assert.equal(doc.readiness_state.action_receipt_record_created, false);
assert.equal(doc.readiness_state.audit_event_record_created, false);
assert.equal(doc.readiness_state.evidence_export_manifest_created, false);
assert.equal(doc.readiness_state.verifier_replay_executed, false);
assert.equal(doc.readiness_state.verifier_replay_passed, false);
assert.equal(doc.readiness_state.decision_proof_chain_closed, false);
assert.equal(doc.readiness_state.decision_proof_demo_ready, false);
assert.equal(doc.readiness_state.level1_launch_ready, false);
assert.equal(doc.readiness_state.production_ready, false);

assert.equal(doc.next_required_program, 'PROG-080-HBCE-LEVEL1-DECISION-PROOF-DEMO-EXECUTION-HARNESS');

assert.equal(doc.non_claims.runbook_executed, false);
assert.equal(doc.non_claims.concrete_demo_execution_completed, false);
assert.equal(doc.non_claims.verifier_replay_completed, false);
assert.equal(doc.non_claims.decision_proof_chain_closed, false);
assert.equal(doc.non_claims.decision_proof_demo_ready, false);
assert.equal(doc.non_claims.effect_proven, false);
assert.equal(doc.non_claims.legal_validity, false);
assert.equal(doc.non_claims.ai_authority, false);
assert.equal(doc.non_claims.level1_launch_ready, false);
assert.equal(doc.non_claims.production_ready, false);

assert.match(md, /LEVEL1_DECISION_PROOF_DEMO_FIXTURE_DEFINED_NOT_EXECUTED/);
assert.match(md, /The fixture is synthetic demo-only/);
assert.match(md, /The runbook is not executed/);
assert.match(md, /The verifier replay is not executed/);
assert.match(md, /The fixture is not effect proof/);
assert.match(md, /Real customer data is not allowed/);
assert.match(md, /AI demo authority claims fail closed/);
assert.match(md, /PROG-080-HBCE-LEVEL1-DECISION-PROOF-DEMO-EXECUTION-HARNESS/);

console.log('PASS PROG-079-DEMO-FIXTURE-DOCS-EXIST');
console.log('PASS PROG-079-DEMO-FIXTURE-HASH-STABLE');
console.log('PASS PROG-079-BUILDER-STABLE');
console.log('PASS PROG-079-SOURCE-PROG-078-INTEGRITY-VALID');
console.log('PASS PROG-079-FIXTURE-INPUTS-AND-OUTPUTS-DEFINED');
console.log('PASS PROG-079-DETERMINISTIC-FIXTURE-PAYLOAD-DIGEST-BOUND');
console.log('PASS PROG-079-SYNTHETIC-DEMO-ONLY-BOUNDARY');
console.log('PASS PROG-079-AI-DEMO-AUTHORITY-DISALLOWED');
console.log('PASS PROG-079-NEXT-PROG-080-RECORDED');
console.log('PASS PROG-079-NO-UNSUPPORTED-READINESS-CLAIMS');
