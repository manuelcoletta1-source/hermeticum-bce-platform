"use strict";

const assert = require("assert/strict");
const fs = require("fs");
const cp = require("child_process");

const contractPath = "evidence/authorization/20261004_HBCE_POSITIVE_AUTHORIZATION_CONTRACT_DRAFT_v001.json";
const toolPath = "tools/evidence/validate-positive-authorization-contract-draft.js";
const pagePath = "positive-authorization-contract-draft.html";
const docPath = "docs/evidence/hbce-positive-authorization-contract-draft-v001.md";

for (const path of [contractPath, toolPath, pagePath, docPath]) {
  assert.equal(fs.existsSync(path), true, path);
}

const contract = JSON.parse(fs.readFileSync(contractPath, "utf8"));
const output = cp.execFileSync(process.execPath, [toolPath], { encoding: "utf8" });
const page = fs.readFileSync(pagePath, "utf8");
const doc = fs.readFileSync(docPath, "utf8");

assert.equal(contract.object_id, "HBCE-POSITIVE-AUTHORIZATION-CONTRACT-DRAFT-V001");
assert.equal(contract.basis_marker, "HBCE_RUNTIME_ACCESS_GATE_INTEGRATION_BOUNDARY_DRAFT_FINAL_AUDIT=1");
assert.equal(contract.basis_main_commit, "30ed533484318d80c26b708958b56fd23b86f30c");
assert.equal(contract.decision_scope, "ACCESS_AUTHORIZATION");
assert.equal(contract.authorization_level, "ACCESS_ONLY");
assert.equal(contract.contract_mode, "DRAFT_RECORD_ONLY");
assert.equal(contract.contract_state, "NOT_IMPLEMENTED_NOT_ISSUED_NOT_EXECUTABLE");
assert.equal(contract.source_chain_entry_count, 10);
assert.equal(contract.contract_binding_count, 12);
assert.equal(contract.positive_condition_count, 13);
assert.equal(contract.allowed_contract_outcome_count, 3);
assert.equal(contract.future_runtime_export_field_count, 14);
assert.equal(Object.keys(contract.explicit_non_claims).length, 13);
assert.equal(Object.keys(contract.no_execution_boundary).length, 14);
assert.equal(contract.expected_cli_marker, "POSITIVE_AUTHORIZATION_CONTRACT_DRAFT=PASS");

assert.deepEqual(contract.source_chain.map((entry) => entry.object_id), [
  "HBCE-RUNTIME-ACCESS-GATE-INTEGRATION-BOUNDARY-DRAFT-V001",
  "HBCE-ACCESS-AUTHORIZATION-RECORD-PUBLIC-INDEX-V002",
  "HBCE-RUNTIME-ACCESS-GATE-EVALUATION-HARNESS-V001",
  "HBCE-RUNTIME-ACCESS-GATE-DRAFT-V001",
  "HBCE-ACCESS-AUTHORIZATION-DECISION-RECORD-DRAFT-V001",
  "HBCE-AUTHORIZATION-DECISION-RECORD-EVALUATION-HARNESS-V001",
  "HBCE-ACCESS-AUTHORIZATION-PREDICATE-DRAFT-V001",
  "HBCE-ACCESS-AUTHORIZATION-PREDICATE-EVALUATION-HARNESS-V001",
  "HBCE-ACCESS-AUTHORIZATION-RECORD-SCHEMA-HARDENING-V001",
  "HBCE-ACCESS-AUTHORIZATION-RECORD-SCHEMA-CONFORMANCE-HARNESS-V001"
]);

assert.deepEqual(contract.contract_bindings, [
  "decision_scope_binding",
  "authorization_level_binding",
  "request_binding",
  "authority_ref_binding",
  "policy_evaluation_binding",
  "access_authorization_predicate_binding",
  "access_authorization_decision_record_binding",
  "decision_actor_binding",
  "scope_binding",
  "boundary_state_binding",
  "unknown_fail_closed_binding",
  "no_execution_boundary_binding"
]);

assert.deepEqual(contract.positive_conditions.map((entry) => entry.condition_id), [
  "PAC-001-DECISION-SCOPE-ACCESS-AUTHORIZATION",
  "PAC-002-AUTHORIZATION-LEVEL-ACCESS-ONLY",
  "PAC-003-REQUEST-BINDING-VALID",
  "PAC-004-AUTHORITY-REF-VALID",
  "PAC-005-POLICY-EVALUATION-APPROVES",
  "PAC-006-PREDICATE-SATISFIED",
  "PAC-007-DECISION-RECORD-APPROVED-RECORD-ONLY",
  "PAC-008-DECISION-ACTOR-BOUND",
  "PAC-009-SCOPE-BINDING-VALID",
  "PAC-010-NO-UNKNOWN",
  "PAC-011-NO-DENY",
  "PAC-012-BOUNDARY-RULES-SATISFIED",
  "PAC-013-NO-EXECUTION-BOUNDARY-PRESERVED"
]);

assert.deepEqual(contract.failure_precedence, [
  "UNKNOWN_FAIL_CLOSED",
  "DENY",
  "NO_POSITIVE_CONTRACT",
  "ALLOW_RECORD_ONLY"
]);

assert.deepEqual(contract.allowed_contract_outcomes, [
  "POSITIVE_AUTHORIZATION_CONTRACT_SATISFIED_RECORD_ONLY",
  "POSITIVE_AUTHORIZATION_CONTRACT_DENIED_RECORD_ONLY",
  "POSITIVE_AUTHORIZATION_CONTRACT_UNKNOWN_FAIL_CLOSED_RECORD_ONLY"
]);

assert.deepEqual(contract.future_runtime_export_fields, [
  "contract_id",
  "contract_version",
  "decision_scope",
  "authorization_level",
  "request_binding_sha256",
  "authority_ref_sha256",
  "policy_evaluation_sha256",
  "access_authorization_predicate_sha256",
  "access_authorization_decision_record_sha256",
  "decision_actor_ref",
  "scope_binding_sha256",
  "contract_outcome",
  "created_at",
  "created_by"
]);

for (const value of Object.values(contract.explicit_non_claims)) {
  assert.equal(value, true);
}

for (const value of Object.values(contract.no_execution_boundary)) {
  assert.equal(value, false);
}

for (const text of [
  "POSITIVE_AUTHORIZATION_CONTRACT_DRAFT=PASS",
  "\"contract_id\": \"HBCE-POSITIVE-AUTHORIZATION-CONTRACT-DRAFT-V001\"",
  "\"basis_marker\": \"HBCE_RUNTIME_ACCESS_GATE_INTEGRATION_BOUNDARY_DRAFT_FINAL_AUDIT=1\"",
  "\"decision_scope\": \"ACCESS_AUTHORIZATION\"",
  "\"authorization_level\": \"ACCESS_ONLY\"",
  "\"contract_mode\": \"DRAFT_RECORD_ONLY\"",
  "\"contract_state\": \"NOT_IMPLEMENTED_NOT_ISSUED_NOT_EXECUTABLE\"",
  "\"source_chain_entry_count\": 10",
  "\"contract_binding_count\": 12",
  "\"positive_condition_count\": 13",
  "\"allowed_contract_outcome_count\": 3",
  "\"future_runtime_export_field_count\": 14",
  "\"required_non_claim_count\": 13",
  "\"required_no_execution_boundary_count\": 14",
  "\"runtime_gate_implemented\": false",
  "\"runtime_gate_enabled\": false",
  "\"positive_authorization_contract_issued\": false",
  "\"access_granted\": false",
  "\"dispatch_authorized\": false",
  "\"execution_authorized\": false",
  "\"effect_evidence_created\": false",
  "\"legal_certification_created\": false"
]) {
  assert.ok(output.includes(text), text);
}

for (const text of [
  "HBCE Positive Authorization Contract Draft v001",
  "R&amp;D POSITIVE AUTHORIZATION CONTRACT DRAFT ONLY",
  "HBCE_RUNTIME_ACCESS_GATE_INTEGRATION_BOUNDARY_DRAFT_FINAL_AUDIT=1",
  "ACTIVE_POSITIVE_AUTHORIZATION_CONTRACT_DRAFT",
  "HBCE-POSITIVE-AUTHORIZATION-CONTRACT-DRAFT-V001",
  "POSITIVE_AUTHORIZATION_CONTRACT_DRAFT=PASS",
  "Decision scope: ACCESS_AUTHORIZATION",
  "Authorization level: ACCESS_ONLY",
  "Contract mode: DRAFT_RECORD_ONLY",
  "Contract state: NOT_IMPLEMENTED_NOT_ISSUED_NOT_EXECUTABLE",
  "Source chain entry count: 10",
  "Contract binding count: 12",
  "Positive condition count: 13",
  "Allowed contract outcome count: 3",
  "Future runtime export field count: 14",
  "Required explicit non-claim count: 13",
  "Required no-execution boundary count: 14",
  "HBCE-RUNTIME-ACCESS-GATE-INTEGRATION-BOUNDARY-DRAFT-V001",
  "HBCE-ACCESS-AUTHORIZATION-RECORD-PUBLIC-INDEX-V002",
  "HBCE-RUNTIME-ACCESS-GATE-EVALUATION-HARNESS-V001",
  "HBCE-RUNTIME-ACCESS-GATE-DRAFT-V001",
  "HBCE-ACCESS-AUTHORIZATION-DECISION-RECORD-DRAFT-V001",
  "HBCE-AUTHORIZATION-DECISION-RECORD-EVALUATION-HARNESS-V001",
  "HBCE-ACCESS-AUTHORIZATION-PREDICATE-DRAFT-V001",
  "HBCE-ACCESS-AUTHORIZATION-PREDICATE-EVALUATION-HARNESS-V001",
  "HBCE-ACCESS-AUTHORIZATION-RECORD-SCHEMA-HARDENING-V001",
  "HBCE-ACCESS-AUTHORIZATION-RECORD-SCHEMA-CONFORMANCE-HARNESS-V001",
  "decision_scope_binding",
  "authorization_level_binding",
  "request_binding",
  "authority_ref_binding",
  "policy_evaluation_binding",
  "access_authorization_predicate_binding",
  "access_authorization_decision_record_binding",
  "decision_actor_binding",
  "scope_binding",
  "boundary_state_binding",
  "unknown_fail_closed_binding",
  "no_execution_boundary_binding",
  "PAC-001-DECISION-SCOPE-ACCESS-AUTHORIZATION",
  "PAC-013-NO-EXECUTION-BOUNDARY-PRESERVED",
  "UNKNOWN_FAIL_CLOSED",
  "DENY",
  "NO_POSITIVE_CONTRACT",
  "ALLOW_RECORD_ONLY",
  "POSITIVE_AUTHORIZATION_CONTRACT_SATISFIED_RECORD_ONLY",
  "POSITIVE_AUTHORIZATION_CONTRACT_DENIED_RECORD_ONLY",
  "POSITIVE_AUTHORIZATION_CONTRACT_UNKNOWN_FAIL_CLOSED_RECORD_ONLY",
  "request_binding_sha256",
  "authority_ref_sha256",
  "policy_evaluation_sha256",
  "access_authorization_predicate_sha256",
  "access_authorization_decision_record_sha256",
  "decision_actor_ref",
  "scope_binding_sha256",
  "contract_outcome",
  "does not implement a runtime gate",
  "does not enable a runtime gate",
  "does not issue a positive authorization contract",
  "does not grant access",
  "does not authorize dispatch",
  "does not authorize execution",
  "does not create execution traces",
  "does not create effect evidence",
  "does not create legal certification"
]) {
  assert.ok(page.includes(text), text);
}

for (const text of [
  "HBCE Positive Authorization Contract Draft v001",
  "HBCE_RUNTIME_ACCESS_GATE_INTEGRATION_BOUNDARY_DRAFT_FINAL_AUDIT=1",
  "HBCE-POSITIVE-AUTHORIZATION-CONTRACT-DRAFT-V001",
  "POSITIVE_AUTHORIZATION_CONTRACT_DRAFT=PASS",
  "ACCESS_AUTHORIZATION",
  "ACCESS_ONLY",
  "DRAFT_RECORD_ONLY",
  "NOT_IMPLEMENTED_NOT_ISSUED_NOT_EXECUTABLE",
  "Source chain entry count: `10`",
  "Contract binding count: `12`",
  "Positive condition count: `13`",
  "Allowed contract outcome count: `3`",
  "Future runtime export field count: `14`",
  "Required explicit non-claim count: `13`",
  "Required no-execution boundary count: `14`",
  "HBCE-RUNTIME-ACCESS-GATE-INTEGRATION-BOUNDARY-DRAFT-V001",
  "HBCE-ACCESS-AUTHORIZATION-DECISION-RECORD-DRAFT-V001",
  "HBCE-ACCESS-AUTHORIZATION-PREDICATE-DRAFT-V001",
  "decision_scope_binding",
  "unknown_fail_closed_binding",
  "no_execution_boundary_binding",
  "PAC-001-DECISION-SCOPE-ACCESS-AUTHORIZATION",
  "PAC-013-NO-EXECUTION-BOUNDARY-PRESERVED",
  "UNKNOWN_FAIL_CLOSED",
  "NO_POSITIVE_CONTRACT",
  "POSITIVE_AUTHORIZATION_CONTRACT_SATISFIED_RECORD_ONLY",
  "POSITIVE_AUTHORIZATION_CONTRACT_UNKNOWN_FAIL_CLOSED_RECORD_ONLY",
  "request_binding_sha256",
  "contract_outcome",
  "does not implement a runtime gate",
  "does not enable a runtime gate",
  "does not issue a positive authorization contract",
  "does not grant access",
  "does not authorize dispatch",
  "does not create effect evidence",
  "does not create legal certification"
]) {
  assert.ok(doc.includes(text), text);
}

console.log("PROG_284_POSITIVE_AUTHORIZATION_CONTRACT_DRAFT_TEST=PASS");
