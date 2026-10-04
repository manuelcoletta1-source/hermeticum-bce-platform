"use strict";

const assert = require("assert/strict");
const fs = require("fs");
const cp = require("child_process");

const harnessPath = "evidence/authorization/20261004_HBCE_POSITIVE_AUTHORIZATION_CONTRACT_EVALUATION_HARNESS_v001.json";
const toolPath = "tools/evidence/validate-positive-authorization-contract-evaluation-harness.js";
const pagePath = "positive-authorization-contract-evaluation-harness.html";
const docPath = "docs/evidence/hbce-positive-authorization-contract-evaluation-harness-v001.md";

for (const path of [harnessPath, toolPath, pagePath, docPath]) {
  assert.equal(fs.existsSync(path), true, path);
}

const harness = JSON.parse(fs.readFileSync(harnessPath, "utf8"));
const output = cp.execFileSync(process.execPath, [toolPath], { encoding: "utf8" });
const page = fs.readFileSync(pagePath, "utf8");
const doc = fs.readFileSync(docPath, "utf8");

assert.equal(harness.object_id, "HBCE-POSITIVE-AUTHORIZATION-CONTRACT-EVALUATION-HARNESS-V001");
assert.equal(harness.basis_marker, "HBCE_POSITIVE_AUTHORIZATION_CONTRACT_DRAFT_FINAL_AUDIT=1");
assert.equal(harness.basis_main_commit, "84ee919143e83a08b147159cb108dd568bc20f89");
assert.equal(harness.decision_scope, "ACCESS_AUTHORIZATION");
assert.equal(harness.authorization_level, "ACCESS_ONLY");
assert.equal(harness.harness_mode, "POSITIVE_AUTHORIZATION_CONTRACT_EVALUATION_RECORD_ONLY");
assert.equal(harness.contract_under_test, "HBCE-POSITIVE-AUTHORIZATION-CONTRACT-DRAFT-V001");
assert.equal(harness.contract_state_under_test, "NOT_IMPLEMENTED_NOT_ISSUED_NOT_EXECUTABLE");
assert.equal(harness.source_chain_entry_count, 10);
assert.equal(harness.contract_binding_count, 12);
assert.equal(harness.positive_condition_count, 13);
assert.equal(harness.failure_precedence_count, 4);
assert.equal(harness.allowed_contract_outcome_count, 3);
assert.equal(harness.evaluation_case_count, 17);
assert.equal(harness.satisfied_case_count, 1);
assert.equal(harness.denied_case_count, 8);
assert.equal(harness.unknown_fail_closed_case_count, 8);
assert.equal(Object.keys(harness.explicit_non_claims).length, 14);
assert.equal(Object.keys(harness.no_execution_boundary).length, 14);
assert.equal(harness.expected_cli_marker, "POSITIVE_AUTHORIZATION_CONTRACT_EVALUATION_HARNESS=PASS");

assert.deepEqual(harness.failure_precedence, [
  "UNKNOWN_FAIL_CLOSED",
  "DENY",
  "NO_POSITIVE_CONTRACT",
  "ALLOW_RECORD_ONLY"
]);

assert.deepEqual(harness.allowed_contract_outcomes, [
  "POSITIVE_AUTHORIZATION_CONTRACT_SATISFIED_RECORD_ONLY",
  "POSITIVE_AUTHORIZATION_CONTRACT_DENIED_RECORD_ONLY",
  "POSITIVE_AUTHORIZATION_CONTRACT_UNKNOWN_FAIL_CLOSED_RECORD_ONLY"
]);

assert.deepEqual(harness.evaluation_cases.map((entry) => entry.case_id), [
  "PAC-EVAL-001-ALL-CONDITIONS-PASS",
  "PAC-EVAL-002-DECISION-SCOPE-MISSING",
  "PAC-EVAL-003-AUTHORIZATION-LEVEL-MISMATCH",
  "PAC-EVAL-004-REQUEST-BINDING-MISSING",
  "PAC-EVAL-005-AUTHORITY-REF-INVALID",
  "PAC-EVAL-006-POLICY-EVALUATION-DENIED",
  "PAC-EVAL-007-POLICY-EVALUATION-UNKNOWN",
  "PAC-EVAL-008-PREDICATE-DENIED",
  "PAC-EVAL-009-PREDICATE-UNKNOWN",
  "PAC-EVAL-010-DECISION-RECORD-DENIED",
  "PAC-EVAL-011-DECISION-RECORD-UNKNOWN",
  "PAC-EVAL-012-DECISION-ACTOR-MISSING",
  "PAC-EVAL-013-SCOPE-MISMATCH",
  "PAC-EVAL-014-BOUNDARY-RULES-VIOLATED",
  "PAC-EVAL-015-NO-EXECUTION-BOUNDARY-BROKEN",
  "PAC-EVAL-016-UNKNOWN-TAKES-PRECEDENCE-OVER-DENY",
  "PAC-EVAL-017-NO-POSITIVE-CONTRACT"
]);

for (const value of Object.values(harness.explicit_non_claims)) {
  assert.equal(value, true);
}

for (const value of Object.values(harness.no_execution_boundary)) {
  assert.equal(value, false);
}

for (const text of [
  "POSITIVE_AUTHORIZATION_CONTRACT_EVALUATION_HARNESS=PASS",
  "\"harness_id\": \"HBCE-POSITIVE-AUTHORIZATION-CONTRACT-EVALUATION-HARNESS-V001\"",
  "\"basis_marker\": \"HBCE_POSITIVE_AUTHORIZATION_CONTRACT_DRAFT_FINAL_AUDIT=1\"",
  "\"decision_scope\": \"ACCESS_AUTHORIZATION\"",
  "\"authorization_level\": \"ACCESS_ONLY\"",
  "\"harness_mode\": \"POSITIVE_AUTHORIZATION_CONTRACT_EVALUATION_RECORD_ONLY\"",
  "\"contract_under_test\": \"HBCE-POSITIVE-AUTHORIZATION-CONTRACT-DRAFT-V001\"",
  "\"contract_state_under_test\": \"NOT_IMPLEMENTED_NOT_ISSUED_NOT_EXECUTABLE\"",
  "\"source_chain_entry_count\": 10",
  "\"contract_binding_count\": 12",
  "\"positive_condition_count\": 13",
  "\"failure_precedence_count\": 4",
  "\"allowed_contract_outcome_count\": 3",
  "\"evaluation_case_count\": 17",
  "\"satisfied_case_count\": 1",
  "\"denied_case_count\": 8",
  "\"unknown_fail_closed_case_count\": 8",
  "\"required_non_claim_count\": 14",
  "\"required_no_execution_boundary_count\": 14",
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
  "HBCE Positive Authorization Contract Evaluation Harness v001",
  "R&amp;D POSITIVE AUTHORIZATION CONTRACT EVALUATION HARNESS ONLY",
  "HBCE_POSITIVE_AUTHORIZATION_CONTRACT_DRAFT_FINAL_AUDIT=1",
  "ACTIVE_POSITIVE_AUTHORIZATION_CONTRACT_EVALUATION_HARNESS",
  "HBCE-POSITIVE-AUTHORIZATION-CONTRACT-EVALUATION-HARNESS-V001",
  "POSITIVE_AUTHORIZATION_CONTRACT_EVALUATION_HARNESS=PASS",
  "Decision scope: ACCESS_AUTHORIZATION",
  "Authorization level: ACCESS_ONLY",
  "Harness mode: POSITIVE_AUTHORIZATION_CONTRACT_EVALUATION_RECORD_ONLY",
  "Contract under test: HBCE-POSITIVE-AUTHORIZATION-CONTRACT-DRAFT-V001",
  "Contract state under test: NOT_IMPLEMENTED_NOT_ISSUED_NOT_EXECUTABLE",
  "Source chain entry count: 10",
  "Contract binding count: 12",
  "Positive condition count: 13",
  "Failure precedence count: 4",
  "Allowed contract outcome count: 3",
  "Evaluation case count: 17",
  "Satisfied case count: 1",
  "Denied case count: 8",
  "Unknown fail-closed case count: 8",
  "Required explicit non-claim count: 14",
  "Required no-execution boundary count: 14",
  "HBCE-POSITIVE-AUTHORIZATION-CONTRACT-DRAFT-V001",
  "HBCE-RUNTIME-ACCESS-GATE-INTEGRATION-BOUNDARY-DRAFT-V001",
  "HBCE-ACCESS-AUTHORIZATION-RECORD-PUBLIC-INDEX-V002",
  "decision_scope_binding",
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
  "PAC-EVAL-001-ALL-CONDITIONS-PASS",
  "PAC-EVAL-016-UNKNOWN-TAKES-PRECEDENCE-OVER-DENY",
  "PAC-EVAL-017-NO-POSITIVE-CONTRACT",
  "does not implement a runtime gate",
  "does not enable a runtime gate",
  "does not issue a positive authorization contract",
  "does not grant access",
  "does not authorize dispatch",
  "does not authorize execution",
  "does not create effect evidence",
  "does not create legal certification"
]) {
  assert.ok(page.includes(text), text);
}

for (const text of [
  "HBCE Positive Authorization Contract Evaluation Harness v001",
  "HBCE_POSITIVE_AUTHORIZATION_CONTRACT_DRAFT_FINAL_AUDIT=1",
  "HBCE-POSITIVE-AUTHORIZATION-CONTRACT-EVALUATION-HARNESS-V001",
  "POSITIVE_AUTHORIZATION_CONTRACT_EVALUATION_HARNESS=PASS",
  "ACCESS_AUTHORIZATION",
  "ACCESS_ONLY",
  "POSITIVE_AUTHORIZATION_CONTRACT_EVALUATION_RECORD_ONLY",
  "HBCE-POSITIVE-AUTHORIZATION-CONTRACT-DRAFT-V001",
  "NOT_IMPLEMENTED_NOT_ISSUED_NOT_EXECUTABLE",
  "Source chain entry count: `10`",
  "Contract binding count: `12`",
  "Positive condition count: `13`",
  "Failure precedence count: `4`",
  "Allowed contract outcome count: `3`",
  "Evaluation case count: `17`",
  "Satisfied case count: `1`",
  "Denied case count: `8`",
  "Unknown fail-closed case count: `8`",
  "Required explicit non-claim count: `14`",
  "Required no-execution boundary count: `14`",
  "PAC-EVAL-001-ALL-CONDITIONS-PASS",
  "PAC-EVAL-016-UNKNOWN-TAKES-PRECEDENCE-OVER-DENY",
  "PAC-EVAL-017-NO-POSITIVE-CONTRACT",
  "UNKNOWN_FAIL_CLOSED",
  "NO_POSITIVE_CONTRACT",
  "POSITIVE_AUTHORIZATION_CONTRACT_SATISFIED_RECORD_ONLY",
  "POSITIVE_AUTHORIZATION_CONTRACT_UNKNOWN_FAIL_CLOSED_RECORD_ONLY",
  "does not issue a positive authorization contract",
  "does not grant access",
  "does not authorize dispatch",
  "does not create effect evidence",
  "does not create legal certification"
]) {
  assert.ok(doc.includes(text), text);
}

console.log("PROG_285_POSITIVE_AUTHORIZATION_CONTRACT_EVALUATION_HARNESS_TEST=PASS");
