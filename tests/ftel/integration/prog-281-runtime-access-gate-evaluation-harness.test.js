"use strict";

const assert = require("assert/strict");
const fs = require("fs");
const cp = require("child_process");

const harnessPath = "evidence/authorization/20261003_HBCE_RUNTIME_ACCESS_GATE_EVALUATION_HARNESS_v001.json";
const runtimeGatePath = "evidence/authorization/20261003_HBCE_RUNTIME_ACCESS_GATE_DRAFT_v001.json";
const schemaConformancePath = "evidence/authorization/20261003_HBCE_ACCESS_AUTHORIZATION_RECORD_SCHEMA_CONFORMANCE_HARNESS_v001.json";
const toolPath = "tools/evidence/validate-runtime-access-gate-evaluation-harness.js";
const pagePath = "runtime-access-gate-evaluation-harness.html";
const docPath = "docs/evidence/hbce-runtime-access-gate-evaluation-harness-v001.md";

for (const path of [harnessPath, runtimeGatePath, schemaConformancePath, toolPath, pagePath, docPath]) {
  assert.equal(fs.existsSync(path), true, path);
}

const harness = JSON.parse(fs.readFileSync(harnessPath, "utf8"));
const output = cp.execFileSync(process.execPath, [toolPath], { encoding: "utf8" });
const page = fs.readFileSync(pagePath, "utf8");
const doc = fs.readFileSync(docPath, "utf8");

assert.equal(harness.object_id, "HBCE-RUNTIME-ACCESS-GATE-EVALUATION-HARNESS-V001");
assert.equal(harness.record_id, "HBCE-RUNTIME-ACCESS-GATE-EVALUATION-HARNESS-V001");
assert.equal(harness.harness_id, "HBCE-RUNTIME-ACCESS-GATE-EVALUATION-HARNESS-V001");
assert.equal(harness.artifact_type, "HBCERuntimeAccessGateEvaluationHarness");
assert.equal(harness.version, "v001");
assert.equal(harness.status, "ACTIVE_RUNTIME_ACCESS_GATE_EVALUATION_HARNESS");
assert.equal(harness.classification, "R_AND_D_RUNTIME_ACCESS_GATE_EVALUATION_HARNESS_ONLY");
assert.equal(harness.basis_marker, "HBCE_ACCESS_AUTHORIZATION_RECORD_SCHEMA_CONFORMANCE_HARNESS_FINAL_AUDIT=1");
assert.equal(harness.basis_main_commit, "e7b3f87481051a003635366ca117f25ae40de3bb");
assert.equal(harness.decision_scope, "ACCESS_AUTHORIZATION");
assert.equal(harness.authorization_level, "ACCESS_ONLY");
assert.equal(harness.harness_mode, "CONTROLLED_RUNTIME_ACCESS_GATE_EVALUATION_HARNESS_ONLY");
assert.equal(harness.expected_cli_marker, "RUNTIME_ACCESS_GATE_EVALUATION_HARNESS=PASS");

assert.deepEqual(harness.allowed_gate_outcomes, [
  "RUNTIME_ACCESS_GATE_ALLOW_RECORD_ONLY",
  "RUNTIME_ACCESS_GATE_DENY_RECORD_ONLY",
  "RUNTIME_ACCESS_GATE_UNKNOWN_FAIL_CLOSED_RECORD_ONLY"
]);

assert.deepEqual(harness.gate_precedence, [
  "RUNTIME_ACCESS_GATE_UNKNOWN_FAIL_CLOSED_RECORD_ONLY",
  "RUNTIME_ACCESS_GATE_DENY_RECORD_ONLY",
  "RUNTIME_ACCESS_GATE_ALLOW_RECORD_ONLY"
]);

assert.equal(harness.gate_inputs_required.length, 8);
assert.equal(harness.allowed_gate_outcomes.length, 3);
assert.equal(harness.evaluation_cases.length, 12);
assert.equal(harness.expected_result.evaluation_case_count, 12);
assert.equal(harness.expected_result.allow_case_count, 1);
assert.equal(harness.expected_result.deny_case_count, 8);
assert.equal(harness.expected_result.unknown_fail_closed_case_count, 3);
assert.equal(harness.expected_result.required_non_claim_count, 13);
assert.equal(harness.expected_result.required_no_execution_boundary_count, 13);
assert.equal(harness.expected_result.source_chain_entry_count, 4);
assert.equal(harness.expected_result.result, "PASS_RUNTIME_ACCESS_GATE_EVALUATION_HARNESS");
assert.equal(harness.result, "PASS_RUNTIME_ACCESS_GATE_EVALUATION_HARNESS_CREATED");

assert.deepEqual(harness.evaluation_cases.map((entry) => entry.case_id), [
  "CASE-001-ALL-GATE-PRECONDITIONS-SATISFIED",
  "CASE-002-SCOPE-BINDING-INVALID",
  "CASE-003-REQUEST-BINDING-MISSING",
  "CASE-004-AUTHORITY-REF-INVALID",
  "CASE-005-POLICY-EVALUATION-DENY",
  "CASE-006-PREDICATE-DENY",
  "CASE-007-DECISION-RECORD-DENY",
  "CASE-008-POSITIVE-AUTHORIZATION-CONTRACT-MISSING",
  "CASE-009-DECISION-ACTOR-MISSING",
  "CASE-010-AUTHORITY-REF-UNKNOWN",
  "CASE-011-PREDICATE-UNKNOWN",
  "CASE-012-UNKNOWN-PRECEDENCE-OVER-DENY"
]);

assert.equal(harness.evaluation_cases.filter((entry) => entry.expected_gate_outcome === "RUNTIME_ACCESS_GATE_ALLOW_RECORD_ONLY").length, 1);
assert.equal(harness.evaluation_cases.filter((entry) => entry.expected_gate_outcome === "RUNTIME_ACCESS_GATE_DENY_RECORD_ONLY").length, 8);
assert.equal(harness.evaluation_cases.filter((entry) => entry.expected_gate_outcome === "RUNTIME_ACCESS_GATE_UNKNOWN_FAIL_CLOSED_RECORD_ONLY").length, 3);

assert.equal(harness.record_boundary.record_only, true);
for (const [key, value] of Object.entries(harness.record_boundary)) {
  if (key !== "record_only") assert.equal(value, false, key);
}

for (const value of Object.values(harness.explicit_non_claims)) {
  assert.equal(value, true);
}

for (const value of Object.values(harness.no_execution_boundary)) {
  assert.equal(value, false);
}

for (const text of [
  "RUNTIME_ACCESS_GATE_EVALUATION_HARNESS=PASS",
  "\"harness_id\": \"HBCE-RUNTIME-ACCESS-GATE-EVALUATION-HARNESS-V001\"",
  "\"decision_scope\": \"ACCESS_AUTHORIZATION\"",
  "\"authorization_level\": \"ACCESS_ONLY\"",
  "\"harness_mode\": \"CONTROLLED_RUNTIME_ACCESS_GATE_EVALUATION_HARNESS_ONLY\"",
  "\"gate_input_count\": 8",
  "\"allowed_gate_outcome_count\": 3",
  "\"evaluation_case_count\": 12",
  "\"allow_case_count\": 1",
  "\"deny_case_count\": 8",
  "\"unknown_fail_closed_case_count\": 3",
  "\"case_id\": \"CASE-001-ALL-GATE-PRECONDITIONS-SATISFIED\"",
  "\"case_id\": \"CASE-012-UNKNOWN-PRECEDENCE-OVER-DENY\"",
  "\"actual_gate_outcome\": \"RUNTIME_ACCESS_GATE_ALLOW_RECORD_ONLY\"",
  "\"actual_gate_outcome\": \"RUNTIME_ACCESS_GATE_DENY_RECORD_ONLY\"",
  "\"actual_gate_outcome\": \"RUNTIME_ACCESS_GATE_UNKNOWN_FAIL_CLOSED_RECORD_ONLY\"",
  "\"access_granted\": false",
  "\"dispatch_authorized\": false",
  "\"execution_authorized\": false",
  "\"effect_evidence_created\": false",
  "\"legal_certification_created\": false"
]) {
  assert.ok(output.includes(text), text);
}

for (const text of [
  "HBCE Runtime Access Gate Evaluation Harness",
  "R&amp;D RUNTIME ACCESS GATE EVALUATION HARNESS ONLY",
  "HBCE_ACCESS_AUTHORIZATION_RECORD_SCHEMA_CONFORMANCE_HARNESS_FINAL_AUDIT=1",
  "ACTIVE_RUNTIME_ACCESS_GATE_EVALUATION_HARNESS",
  "HBCE-RUNTIME-ACCESS-GATE-EVALUATION-HARNESS-V001",
  "RUNTIME_ACCESS_GATE_EVALUATION_HARNESS=PASS",
  "Decision scope: ACCESS_AUTHORIZATION",
  "Authorization level: ACCESS_ONLY",
  "Harness mode: CONTROLLED_RUNTIME_ACCESS_GATE_EVALUATION_HARNESS_ONLY",
  "Gate input count: 8",
  "Allowed gate outcome count: 3",
  "Evaluation case count: 12",
  "Allow case count: 1",
  "Deny case count: 8",
  "Unknown fail-closed case count: 3",
  "RUNTIME_ACCESS_GATE_UNKNOWN_FAIL_CLOSED_RECORD_ONLY",
  "RUNTIME_ACCESS_GATE_DENY_RECORD_ONLY",
  "RUNTIME_ACCESS_GATE_ALLOW_RECORD_ONLY",
  "CASE-001-ALL-GATE-PRECONDITIONS-SATISFIED expected RUNTIME_ACCESS_GATE_ALLOW_RECORD_ONLY",
  "CASE-012-UNKNOWN-PRECEDENCE-OVER-DENY expected RUNTIME_ACCESS_GATE_UNKNOWN_FAIL_CLOSED_RECORD_ONLY",
  "HBCE-RUNTIME-ACCESS-GATE-DRAFT-V001",
  "HBCE-ACCESS-AUTHORIZATION-RECORD-SCHEMA-CONFORMANCE-HARNESS-V001",
  "HBCE-ACCESS-AUTHORIZATION-RECORD-SCHEMA-HARDENING-V001",
  "HBCE-AUTHORIZATION-DECISION-RECORD-EVALUATION-HARNESS-V001",
  "does not implement a runtime gate",
  "does not enable a runtime gate",
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
  "HBCE Runtime Access Gate Evaluation Harness v001",
  "HBCE_ACCESS_AUTHORIZATION_RECORD_SCHEMA_CONFORMANCE_HARNESS_FINAL_AUDIT=1",
  "HBCE-RUNTIME-ACCESS-GATE-EVALUATION-HARNESS-V001",
  "RUNTIME_ACCESS_GATE_EVALUATION_HARNESS=PASS",
  "ACCESS_AUTHORIZATION",
  "ACCESS_ONLY",
  "CONTROLLED_RUNTIME_ACCESS_GATE_EVALUATION_HARNESS_ONLY",
  "Gate input count: `8`",
  "Allowed gate outcome count: `3`",
  "Evaluation case count: `12`",
  "Allow case count: `1`",
  "Deny case count: `8`",
  "Unknown fail-closed case count: `3`",
  "RUNTIME_ACCESS_GATE_UNKNOWN_FAIL_CLOSED_RECORD_ONLY",
  "RUNTIME_ACCESS_GATE_DENY_RECORD_ONLY",
  "RUNTIME_ACCESS_GATE_ALLOW_RECORD_ONLY",
  "CASE-001-ALL-GATE-PRECONDITIONS-SATISFIED",
  "CASE-012-UNKNOWN-PRECEDENCE-OVER-DENY",
  "does not implement a runtime gate",
  "does not enable a runtime gate",
  "does not grant access",
  "does not authorize dispatch",
  "does not create effect evidence",
  "does not create legal certification"
]) {
  assert.ok(doc.includes(text), text);
}

console.log("PROG_281_RUNTIME_ACCESS_GATE_EVALUATION_HARNESS_TEST=PASS");
