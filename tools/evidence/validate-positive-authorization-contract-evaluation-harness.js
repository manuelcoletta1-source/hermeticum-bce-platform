#!/usr/bin/env node
"use strict";

const fs = require("fs");

const harnessPath = "evidence/authorization/20261004_HBCE_POSITIVE_AUTHORIZATION_CONTRACT_EVALUATION_HARNESS_v001.json";

function fail(message) {
  throw new Error(message);
}

function readText(path) {
  if (!fs.existsSync(path)) fail(`missing file: ${path}`);
  return fs.readFileSync(path, "utf8");
}

function parseJson(path) {
  try {
    return JSON.parse(readText(path));
  } catch (error) {
    fail(`invalid JSON at ${path}: ${error.message}`);
  }
}

function assertEqual(actual, expected, label) {
  if (actual !== expected) fail(`${label}: expected ${expected}, got ${actual}`);
}

function assertTrue(value, label) {
  if (value !== true) fail(`${label} must be true`);
}

function assertFalse(value, label) {
  if (value !== false) fail(`${label} must be false`);
}

function assertArray(value, label) {
  if (!Array.isArray(value)) fail(`${label} must be array`);
}

function assertDeepEqual(actual, expected, label) {
  const actualJson = JSON.stringify(actual);
  const expectedJson = JSON.stringify(expected);
  if (actualJson !== expectedJson) fail(`${label}: expected ${expectedJson}, got ${actualJson}`);
}

function assertUnique(values, label) {
  const seen = new Set();
  for (const value of values) {
    if (seen.has(value)) fail(`${label} duplicate value: ${value}`);
    seen.add(value);
  }
}

const harness = parseJson(harnessPath);

assertEqual(harness.object_id, "HBCE-POSITIVE-AUTHORIZATION-CONTRACT-EVALUATION-HARNESS-V001", "object_id");
assertEqual(harness.record_id, "HBCE-POSITIVE-AUTHORIZATION-CONTRACT-EVALUATION-HARNESS-V001", "record_id");
assertEqual(harness.artifact_type, "HBCEPositiveAuthorizationContractEvaluationHarness", "artifact_type");
assertEqual(harness.version, "v001", "version");
assertEqual(harness.status, "ACTIVE_POSITIVE_AUTHORIZATION_CONTRACT_EVALUATION_HARNESS", "status");
assertEqual(harness.classification, "R_AND_D_POSITIVE_AUTHORIZATION_CONTRACT_EVALUATION_HARNESS_ONLY", "classification");
assertEqual(harness.basis_marker, "HBCE_POSITIVE_AUTHORIZATION_CONTRACT_DRAFT_FINAL_AUDIT=1", "basis_marker");
assertEqual(harness.basis_main_commit, "84ee919143e83a08b147159cb108dd568bc20f89", "basis_main_commit");
assertEqual(harness.decision_scope, "ACCESS_AUTHORIZATION", "decision_scope");
assertEqual(harness.authorization_level, "ACCESS_ONLY", "authorization_level");
assertEqual(harness.harness_mode, "POSITIVE_AUTHORIZATION_CONTRACT_EVALUATION_RECORD_ONLY", "harness_mode");
assertEqual(harness.contract_under_test, "HBCE-POSITIVE-AUTHORIZATION-CONTRACT-DRAFT-V001", "contract_under_test");
assertEqual(harness.contract_state_under_test, "NOT_IMPLEMENTED_NOT_ISSUED_NOT_EXECUTABLE", "contract_state_under_test");
assertEqual(harness.expected_cli_marker, "POSITIVE_AUTHORIZATION_CONTRACT_EVALUATION_HARNESS=PASS", "expected_cli_marker");
assertEqual(harness.result, "PASS_POSITIVE_AUTHORIZATION_CONTRACT_EVALUATION_HARNESS_CREATED", "result");

assertArray(harness.source_chain, "source_chain");
assertArray(harness.contract_bindings, "contract_bindings");
assertArray(harness.positive_conditions, "positive_conditions");
assertArray(harness.failure_precedence, "failure_precedence");
assertArray(harness.allowed_contract_outcomes, "allowed_contract_outcomes");
assertArray(harness.evaluation_cases, "evaluation_cases");

assertEqual(harness.source_chain_entry_count, 10, "source_chain_entry_count");
assertEqual(harness.source_chain.length, 10, "source_chain.length");
assertEqual(harness.contract_binding_count, 12, "contract_binding_count");
assertEqual(harness.contract_bindings.length, 12, "contract_bindings.length");
assertEqual(harness.positive_condition_count, 13, "positive_condition_count");
assertEqual(harness.positive_conditions.length, 13, "positive_conditions.length");
assertEqual(harness.failure_precedence_count, 4, "failure_precedence_count");
assertEqual(harness.failure_precedence.length, 4, "failure_precedence.length");
assertEqual(harness.allowed_contract_outcome_count, 3, "allowed_contract_outcome_count");
assertEqual(harness.allowed_contract_outcomes.length, 3, "allowed_contract_outcomes.length");
assertEqual(harness.evaluation_case_count, 17, "evaluation_case_count");
assertEqual(harness.evaluation_cases.length, 17, "evaluation_cases.length");
assertEqual(harness.satisfied_case_count, 1, "satisfied_case_count");
assertEqual(harness.denied_case_count, 8, "denied_case_count");
assertEqual(harness.unknown_fail_closed_case_count, 8, "unknown_fail_closed_case_count");

assertDeepEqual(harness.source_chain.map((entry) => entry.sequence), [1,2,3,4,5,6,7,8,9,10], "source_chain sequence");

const expectedSourceObjects = [
  "HBCE-POSITIVE-AUTHORIZATION-CONTRACT-DRAFT-V001",
  "HBCE-RUNTIME-ACCESS-GATE-INTEGRATION-BOUNDARY-DRAFT-V001",
  "HBCE-ACCESS-AUTHORIZATION-RECORD-PUBLIC-INDEX-V002",
  "HBCE-RUNTIME-ACCESS-GATE-EVALUATION-HARNESS-V001",
  "HBCE-RUNTIME-ACCESS-GATE-DRAFT-V001",
  "HBCE-ACCESS-AUTHORIZATION-DECISION-RECORD-DRAFT-V001",
  "HBCE-AUTHORIZATION-DECISION-RECORD-EVALUATION-HARNESS-V001",
  "HBCE-ACCESS-AUTHORIZATION-PREDICATE-DRAFT-V001",
  "HBCE-ACCESS-AUTHORIZATION-PREDICATE-EVALUATION-HARNESS-V001",
  "HBCE-ACCESS-AUTHORIZATION-RECORD-SCHEMA-CONFORMANCE-HARNESS-V001"
];

assertDeepEqual(harness.source_chain.map((entry) => entry.object_id), expectedSourceObjects, "source_chain object order");
assertUnique(harness.source_chain.map((entry) => entry.object_id), "source_chain object ids");
assertUnique(harness.source_chain.map((entry) => entry.path), "source_chain paths");

for (const entry of harness.source_chain) {
  const text = readText(entry.path);
  if (!text.includes(entry.object_id)) fail(`${entry.path} missing object_id ${entry.object_id}`);
  if (!text.includes(entry.expected_marker)) fail(`${entry.path} missing expected marker ${entry.expected_marker}`);
}

assertDeepEqual(harness.contract_bindings, [
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
], "contract_bindings");

assertUnique(harness.contract_bindings, "contract_bindings");

assertDeepEqual(harness.positive_conditions, [
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
], "positive_conditions");

assertDeepEqual(harness.failure_precedence, [
  "UNKNOWN_FAIL_CLOSED",
  "DENY",
  "NO_POSITIVE_CONTRACT",
  "ALLOW_RECORD_ONLY"
], "failure_precedence");

assertDeepEqual(harness.allowed_contract_outcomes, [
  "POSITIVE_AUTHORIZATION_CONTRACT_SATISFIED_RECORD_ONLY",
  "POSITIVE_AUTHORIZATION_CONTRACT_DENIED_RECORD_ONLY",
  "POSITIVE_AUTHORIZATION_CONTRACT_UNKNOWN_FAIL_CLOSED_RECORD_ONLY"
], "allowed_contract_outcomes");

const expectedCases = [
  ["PAC-EVAL-001-ALL-CONDITIONS-PASS", "POSITIVE", "POSITIVE_AUTHORIZATION_CONTRACT_SATISFIED_RECORD_ONLY"],
  ["PAC-EVAL-002-DECISION-SCOPE-MISSING", "UNKNOWN_FAIL_CLOSED", "POSITIVE_AUTHORIZATION_CONTRACT_UNKNOWN_FAIL_CLOSED_RECORD_ONLY"],
  ["PAC-EVAL-003-AUTHORIZATION-LEVEL-MISMATCH", "DENIED", "POSITIVE_AUTHORIZATION_CONTRACT_DENIED_RECORD_ONLY"],
  ["PAC-EVAL-004-REQUEST-BINDING-MISSING", "UNKNOWN_FAIL_CLOSED", "POSITIVE_AUTHORIZATION_CONTRACT_UNKNOWN_FAIL_CLOSED_RECORD_ONLY"],
  ["PAC-EVAL-005-AUTHORITY-REF-INVALID", "DENIED", "POSITIVE_AUTHORIZATION_CONTRACT_DENIED_RECORD_ONLY"],
  ["PAC-EVAL-006-POLICY-EVALUATION-DENIED", "DENIED", "POSITIVE_AUTHORIZATION_CONTRACT_DENIED_RECORD_ONLY"],
  ["PAC-EVAL-007-POLICY-EVALUATION-UNKNOWN", "UNKNOWN_FAIL_CLOSED", "POSITIVE_AUTHORIZATION_CONTRACT_UNKNOWN_FAIL_CLOSED_RECORD_ONLY"],
  ["PAC-EVAL-008-PREDICATE-DENIED", "DENIED", "POSITIVE_AUTHORIZATION_CONTRACT_DENIED_RECORD_ONLY"],
  ["PAC-EVAL-009-PREDICATE-UNKNOWN", "UNKNOWN_FAIL_CLOSED", "POSITIVE_AUTHORIZATION_CONTRACT_UNKNOWN_FAIL_CLOSED_RECORD_ONLY"],
  ["PAC-EVAL-010-DECISION-RECORD-DENIED", "DENIED", "POSITIVE_AUTHORIZATION_CONTRACT_DENIED_RECORD_ONLY"],
  ["PAC-EVAL-011-DECISION-RECORD-UNKNOWN", "UNKNOWN_FAIL_CLOSED", "POSITIVE_AUTHORIZATION_CONTRACT_UNKNOWN_FAIL_CLOSED_RECORD_ONLY"],
  ["PAC-EVAL-012-DECISION-ACTOR-MISSING", "UNKNOWN_FAIL_CLOSED", "POSITIVE_AUTHORIZATION_CONTRACT_UNKNOWN_FAIL_CLOSED_RECORD_ONLY"],
  ["PAC-EVAL-013-SCOPE-MISMATCH", "DENIED", "POSITIVE_AUTHORIZATION_CONTRACT_DENIED_RECORD_ONLY"],
  ["PAC-EVAL-014-BOUNDARY-RULES-VIOLATED", "DENIED", "POSITIVE_AUTHORIZATION_CONTRACT_DENIED_RECORD_ONLY"],
  ["PAC-EVAL-015-NO-EXECUTION-BOUNDARY-BROKEN", "DENIED", "POSITIVE_AUTHORIZATION_CONTRACT_DENIED_RECORD_ONLY"],
  ["PAC-EVAL-016-UNKNOWN-TAKES-PRECEDENCE-OVER-DENY", "UNKNOWN_FAIL_CLOSED", "POSITIVE_AUTHORIZATION_CONTRACT_UNKNOWN_FAIL_CLOSED_RECORD_ONLY"],
  ["PAC-EVAL-017-NO-POSITIVE-CONTRACT", "UNKNOWN_FAIL_CLOSED", "POSITIVE_AUTHORIZATION_CONTRACT_UNKNOWN_FAIL_CLOSED_RECORD_ONLY"]
];

assertDeepEqual(
  harness.evaluation_cases.map((entry) => [entry.case_id, entry.case_type, entry.expected_outcome]),
  expectedCases,
  "evaluation_cases"
);

assertUnique(harness.evaluation_cases.map((entry) => entry.case_id), "evaluation case ids");

for (const entry of harness.evaluation_cases) {
  if (!entry.description) fail(`${entry.case_id} missing description`);
}

const satisfied = harness.evaluation_cases.filter((entry) => entry.expected_outcome === "POSITIVE_AUTHORIZATION_CONTRACT_SATISFIED_RECORD_ONLY").length;
const denied = harness.evaluation_cases.filter((entry) => entry.expected_outcome === "POSITIVE_AUTHORIZATION_CONTRACT_DENIED_RECORD_ONLY").length;
const unknown = harness.evaluation_cases.filter((entry) => entry.expected_outcome === "POSITIVE_AUTHORIZATION_CONTRACT_UNKNOWN_FAIL_CLOSED_RECORD_ONLY").length;

assertEqual(satisfied, harness.satisfied_case_count, "computed satisfied_case_count");
assertEqual(denied, harness.denied_case_count, "computed denied_case_count");
assertEqual(unknown, harness.unknown_fail_closed_case_count, "computed unknown_fail_closed_case_count");

assertEqual(Object.keys(harness.explicit_non_claims).length, 14, "explicit_non_claims count");
assertEqual(Object.keys(harness.no_execution_boundary).length, 14, "no_execution_boundary count");

for (const [key, value] of Object.entries(harness.explicit_non_claims)) {
  assertTrue(value, `explicit_non_claims.${key}`);
}

for (const [key, value] of Object.entries(harness.no_execution_boundary)) {
  assertFalse(value, `no_execution_boundary.${key}`);
}

assertEqual(harness.expected_result.source_chain_entry_count, 10, "expected_result.source_chain_entry_count");
assertEqual(harness.expected_result.contract_binding_count, 12, "expected_result.contract_binding_count");
assertEqual(harness.expected_result.positive_condition_count, 13, "expected_result.positive_condition_count");
assertEqual(harness.expected_result.failure_precedence_count, 4, "expected_result.failure_precedence_count");
assertEqual(harness.expected_result.allowed_contract_outcome_count, 3, "expected_result.allowed_contract_outcome_count");
assertEqual(harness.expected_result.evaluation_case_count, 17, "expected_result.evaluation_case_count");
assertEqual(harness.expected_result.satisfied_case_count, 1, "expected_result.satisfied_case_count");
assertEqual(harness.expected_result.denied_case_count, 8, "expected_result.denied_case_count");
assertEqual(harness.expected_result.unknown_fail_closed_case_count, 8, "expected_result.unknown_fail_closed_case_count");
assertEqual(harness.expected_result.required_non_claim_count, 14, "expected_result.required_non_claim_count");
assertEqual(harness.expected_result.required_no_execution_boundary_count, 14, "expected_result.required_no_execution_boundary_count");
assertFalse(harness.expected_result.runtime_gate_implemented, "expected_result.runtime_gate_implemented");
assertFalse(harness.expected_result.runtime_gate_enabled, "expected_result.runtime_gate_enabled");
assertFalse(harness.expected_result.positive_authorization_contract_issued, "expected_result.positive_authorization_contract_issued");
assertFalse(harness.expected_result.access_granted, "expected_result.access_granted");
assertFalse(harness.expected_result.dispatch_authorized, "expected_result.dispatch_authorized");
assertFalse(harness.expected_result.execution_authorized, "expected_result.execution_authorized");
assertFalse(harness.expected_result.effect_evidence_created, "expected_result.effect_evidence_created");
assertFalse(harness.expected_result.legal_certification_created, "expected_result.legal_certification_created");
assertEqual(harness.expected_result.result, "PASS_POSITIVE_AUTHORIZATION_CONTRACT_EVALUATION_HARNESS", "expected_result.result");

console.log(JSON.stringify({
  marker: "POSITIVE_AUTHORIZATION_CONTRACT_EVALUATION_HARNESS=PASS",
  harness_id: harness.object_id,
  basis_marker: harness.basis_marker,
  basis_main_commit: harness.basis_main_commit,
  decision_scope: harness.decision_scope,
  authorization_level: harness.authorization_level,
  harness_mode: harness.harness_mode,
  contract_under_test: harness.contract_under_test,
  contract_state_under_test: harness.contract_state_under_test,
  source_chain_entry_count: harness.source_chain_entry_count,
  contract_binding_count: harness.contract_binding_count,
  positive_condition_count: harness.positive_condition_count,
  failure_precedence_count: harness.failure_precedence_count,
  allowed_contract_outcome_count: harness.allowed_contract_outcome_count,
  evaluation_case_count: harness.evaluation_case_count,
  satisfied_case_count: harness.satisfied_case_count,
  denied_case_count: harness.denied_case_count,
  unknown_fail_closed_case_count: harness.unknown_fail_closed_case_count,
  required_non_claim_count: Object.keys(harness.explicit_non_claims).length,
  required_no_execution_boundary_count: Object.keys(harness.no_execution_boundary).length,
  runtime_gate_implemented: false,
  runtime_gate_enabled: false,
  positive_authorization_contract_issued: false,
  access_granted: false,
  dispatch_authorized: false,
  execution_authorized: false,
  production_authorization_service_enabled: false,
  execution_trace_created: false,
  effect_evidence_created: false,
  legal_certification_created: false,
  source_chain: harness.source_chain.map((entry) => ({
    sequence: entry.sequence,
    object_id: entry.object_id,
    expected_marker: entry.expected_marker
  })),
  evaluation_cases: harness.evaluation_cases.map((entry) => ({
    case_id: entry.case_id,
    case_type: entry.case_type,
    expected_outcome: entry.expected_outcome
  })),
  allowed_contract_outcomes: harness.allowed_contract_outcomes,
  failure_precedence: harness.failure_precedence,
  result: "PASS_POSITIVE_AUTHORIZATION_CONTRACT_EVALUATION_HARNESS"
}, null, 2));

console.log("POSITIVE_AUTHORIZATION_CONTRACT_EVALUATION_HARNESS=PASS");
