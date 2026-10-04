#!/usr/bin/env node
"use strict";

const fs = require("fs");

const harnessPath = "evidence/authorization/20261003_HBCE_RUNTIME_ACCESS_GATE_EVALUATION_HARNESS_v001.json";
const runtimeGatePath = "evidence/authorization/20261003_HBCE_RUNTIME_ACCESS_GATE_DRAFT_v001.json";
const schemaConformancePath = "evidence/authorization/20261003_HBCE_ACCESS_AUTHORIZATION_RECORD_SCHEMA_CONFORMANCE_HARNESS_v001.json";
const schemaHardeningPath = "evidence/authorization/20261003_HBCE_ACCESS_AUTHORIZATION_RECORD_SCHEMA_HARDENING_v001.json";
const decisionEvalPath = "evidence/authorization/20261003_HBCE_AUTHORIZATION_DECISION_RECORD_EVALUATION_HARNESS_v001.json";

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

function assertUnique(values, label) {
  const seen = new Set();
  for (const value of values) {
    if (seen.has(value)) fail(`${label} duplicate value: ${value}`);
    seen.add(value);
  }
}

const harness = parseJson(harnessPath);
const runtimeGate = parseJson(runtimeGatePath);
const schemaConformance = parseJson(schemaConformancePath);
const schemaHardening = parseJson(schemaHardeningPath);
const decisionEval = parseJson(decisionEvalPath);

assertEqual(harness.object_id, "HBCE-RUNTIME-ACCESS-GATE-EVALUATION-HARNESS-V001", "harness.object_id");
assertEqual(harness.record_id, "HBCE-RUNTIME-ACCESS-GATE-EVALUATION-HARNESS-V001", "harness.record_id");
assertEqual(harness.harness_id, "HBCE-RUNTIME-ACCESS-GATE-EVALUATION-HARNESS-V001", "harness.harness_id");
assertEqual(harness.artifact_type, "HBCERuntimeAccessGateEvaluationHarness", "harness.artifact_type");
assertEqual(harness.version, "v001", "harness.version");
assertEqual(harness.status, "ACTIVE_RUNTIME_ACCESS_GATE_EVALUATION_HARNESS", "harness.status");
assertEqual(harness.classification, "R_AND_D_RUNTIME_ACCESS_GATE_EVALUATION_HARNESS_ONLY", "harness.classification");
assertEqual(harness.basis_marker, "HBCE_ACCESS_AUTHORIZATION_RECORD_SCHEMA_CONFORMANCE_HARNESS_FINAL_AUDIT=1", "harness.basis_marker");
assertEqual(harness.basis_main_commit, "e7b3f87481051a003635366ca117f25ae40de3bb", "harness.basis_main_commit");
assertEqual(harness.decision_scope, "ACCESS_AUTHORIZATION", "harness.decision_scope");
assertEqual(harness.authorization_level, "ACCESS_ONLY", "harness.authorization_level");
assertEqual(harness.harness_mode, "CONTROLLED_RUNTIME_ACCESS_GATE_EVALUATION_HARNESS_ONLY", "harness.harness_mode");
assertEqual(harness.runtime_gate_draft, runtimeGatePath, "harness.runtime_gate_draft");
assertEqual(harness.schema_conformance_harness, schemaConformancePath, "harness.schema_conformance_harness");
assertEqual(harness.expected_cli_marker, "RUNTIME_ACCESS_GATE_EVALUATION_HARNESS=PASS", "harness.expected_cli_marker");

assertEqual(runtimeGate.object_id, "HBCE-RUNTIME-ACCESS-GATE-DRAFT-V001", "runtimeGate.object_id");
assertEqual(schemaConformance.object_id, "HBCE-ACCESS-AUTHORIZATION-RECORD-SCHEMA-CONFORMANCE-HARNESS-V001", "schemaConformance.object_id");
assertEqual(schemaHardening.object_id, "HBCE-ACCESS-AUTHORIZATION-RECORD-SCHEMA-HARDENING-V001", "schemaHardening.object_id");
assertEqual(decisionEval.object_id, "HBCE-AUTHORIZATION-DECISION-RECORD-EVALUATION-HARNESS-V001", "decisionEval.object_id");

assertArray(harness.gate_inputs_required, "harness.gate_inputs_required");
assertEqual(harness.gate_inputs_required.length, 8, "harness.gate_inputs_required.length");
assertUnique(harness.gate_inputs_required, "harness.gate_inputs_required");
assertTrue(harness.gate_inputs_required.includes("scope_binding"), "gate_inputs_required includes scope_binding");

const requiredInputs = [
  "request_binding",
  "authority_ref",
  "policy_evaluation",
  "access_authorization_predicate",
  "access_authorization_decision_record",
  "positive_authorization_contract_for_allow",
  "decision_actor",
  "scope_binding"
];

assertEqual(JSON.stringify([...harness.gate_inputs_required].sort()), JSON.stringify([...requiredInputs].sort()), "gate_inputs_required set");

const expectedOutcomes = [
  "RUNTIME_ACCESS_GATE_ALLOW_RECORD_ONLY",
  "RUNTIME_ACCESS_GATE_DENY_RECORD_ONLY",
  "RUNTIME_ACCESS_GATE_UNKNOWN_FAIL_CLOSED_RECORD_ONLY"
];

assertEqual(JSON.stringify(harness.allowed_gate_outcomes), JSON.stringify(expectedOutcomes), "allowed_gate_outcomes");

assertEqual(JSON.stringify(harness.gate_precedence), JSON.stringify([
  "RUNTIME_ACCESS_GATE_UNKNOWN_FAIL_CLOSED_RECORD_ONLY",
  "RUNTIME_ACCESS_GATE_DENY_RECORD_ONLY",
  "RUNTIME_ACCESS_GATE_ALLOW_RECORD_ONLY"
]), "gate_precedence");

assertArray(harness.source_chain, "harness.source_chain");
assertEqual(harness.source_chain.length, 4, "harness.source_chain.length");
assertEqual(harness.expected_result.source_chain_entry_count, 4, "expected_result.source_chain_entry_count");

for (let index = 0; index < harness.source_chain.length; index += 1) {
  const entry = harness.source_chain[index];
  assertEqual(entry.sequence, index + 1, `source_chain[${index}].sequence`);
  const text = readText(entry.path);
  if (!text.includes(entry.object_id)) fail(`source_chain[${index}] missing object_id: ${entry.object_id}`);
  if (!text.includes(entry.expected_marker)) fail(`source_chain[${index}] missing marker: ${entry.expected_marker}`);
}

assertArray(harness.evaluation_cases, "harness.evaluation_cases");
assertEqual(harness.evaluation_cases.length, 12, "harness.evaluation_cases.length");
assertEqual(harness.expected_result.evaluation_case_count, 12, "expected_result.evaluation_case_count");
assertEqual(harness.expected_result.allow_case_count, 1, "expected_result.allow_case_count");
assertEqual(harness.expected_result.deny_case_count, 8, "expected_result.deny_case_count");
assertEqual(harness.expected_result.unknown_fail_closed_case_count, 3, "expected_result.unknown_fail_closed_case_count");

assertUnique(harness.evaluation_cases.map((entry) => entry.case_id), "evaluation case ids");

function evaluateGate(inputState) {
  const values = Object.values(inputState);

  if (values.includes("UNKNOWN")) {
    return "RUNTIME_ACCESS_GATE_UNKNOWN_FAIL_CLOSED_RECORD_ONLY";
  }

  const denyValues = new Set(["FAIL", "DENY", "MISSING"]);
  for (const value of values) {
    if (denyValues.has(value)) {
      return "RUNTIME_ACCESS_GATE_DENY_RECORD_ONLY";
    }
  }

  const passLike = new Set(["PASS", "PRESENT"]);
  for (const value of values) {
    if (!passLike.has(value)) {
      return "RUNTIME_ACCESS_GATE_UNKNOWN_FAIL_CLOSED_RECORD_ONLY";
    }
  }

  return "RUNTIME_ACCESS_GATE_ALLOW_RECORD_ONLY";
}

const requiredInputSet = new Set(harness.gate_inputs_required);
const caseResults = [];

for (const testCase of harness.evaluation_cases) {
  if (!testCase.case_id.startsWith("CASE-")) fail(`${testCase.case_id}.case_id invalid`);
  if (!["POSITIVE_ALLOW", "NEGATIVE_DENY", "UNKNOWN_FAIL_CLOSED"].includes(testCase.case_type)) fail(`${testCase.case_id}.case_type invalid`);
  if (!harness.allowed_gate_outcomes.includes(testCase.expected_gate_outcome)) fail(`${testCase.case_id}.expected_gate_outcome invalid`);
  if (!testCase.expected_reason) fail(`${testCase.case_id}.expected_reason missing`);

  const keys = Object.keys(testCase.input_state);
  assertEqual(keys.length, requiredInputSet.size, `${testCase.case_id}.input_state key count`);
  for (const key of keys) {
    if (!requiredInputSet.has(key)) fail(`${testCase.case_id}.input_state unexpected key: ${key}`);
  }

  const actual = evaluateGate(testCase.input_state);
  if (actual !== testCase.expected_gate_outcome) {
    fail(`${testCase.case_id}: expected ${testCase.expected_gate_outcome}, got ${actual}`);
  }

  caseResults.push({
    case_id: testCase.case_id,
    expected_gate_outcome: testCase.expected_gate_outcome,
    actual_gate_outcome: actual,
    result: "PASS"
  });
}

assertEqual(caseResults.filter((entry) => entry.actual_gate_outcome === "RUNTIME_ACCESS_GATE_ALLOW_RECORD_ONLY").length, 1, "actual allow count");
assertEqual(caseResults.filter((entry) => entry.actual_gate_outcome === "RUNTIME_ACCESS_GATE_DENY_RECORD_ONLY").length, 8, "actual deny count");
assertEqual(caseResults.filter((entry) => entry.actual_gate_outcome === "RUNTIME_ACCESS_GATE_UNKNOWN_FAIL_CLOSED_RECORD_ONLY").length, 3, "actual unknown fail closed count");

assertTrue(harness.record_boundary.record_only, "record_boundary.record_only");
for (const [key, value] of Object.entries(harness.record_boundary)) {
  if (key !== "record_only") assertFalse(value, `record_boundary.${key}`);
}

assertEqual(Object.keys(harness.explicit_non_claims).length, 13, "explicit_non_claims count");
for (const [key, value] of Object.entries(harness.explicit_non_claims)) {
  assertTrue(value, `explicit_non_claims.${key}`);
}

assertEqual(Object.keys(harness.no_execution_boundary).length, 13, "no_execution_boundary count");
for (const [key, value] of Object.entries(harness.no_execution_boundary)) {
  assertFalse(value, `no_execution_boundary.${key}`);
}

assertEqual(harness.expected_result.gate_input_count, 8, "expected_result.gate_input_count");
assertEqual(harness.expected_result.allowed_gate_outcome_count, 3, "expected_result.allowed_gate_outcome_count");
assertEqual(harness.expected_result.required_non_claim_count, 13, "expected_result.required_non_claim_count");
assertEqual(harness.expected_result.required_no_execution_boundary_count, 13, "expected_result.required_no_execution_boundary_count");
assertEqual(harness.expected_result.result, "PASS_RUNTIME_ACCESS_GATE_EVALUATION_HARNESS", "expected_result.result");
assertEqual(harness.result, "PASS_RUNTIME_ACCESS_GATE_EVALUATION_HARNESS_CREATED", "harness.result");

console.log(JSON.stringify({
  marker: "RUNTIME_ACCESS_GATE_EVALUATION_HARNESS=PASS",
  harness_id: harness.harness_id,
  decision_scope: harness.decision_scope,
  authorization_level: harness.authorization_level,
  harness_mode: harness.harness_mode,
  gate_input_count: harness.gate_inputs_required.length,
  allowed_gate_outcome_count: harness.allowed_gate_outcomes.length,
  evaluation_case_count: harness.evaluation_cases.length,
  allow_case_count: harness.expected_result.allow_case_count,
  deny_case_count: harness.expected_result.deny_case_count,
  unknown_fail_closed_case_count: harness.expected_result.unknown_fail_closed_case_count,
  required_non_claim_count: Object.keys(harness.explicit_non_claims).length,
  required_no_execution_boundary_count: Object.keys(harness.no_execution_boundary).length,
  source_chain_entry_count: harness.source_chain.length,
  runtime_gate_implemented: false,
  runtime_gate_enabled: false,
  access_granted: false,
  dispatch_authorized: false,
  execution_authorized: false,
  production_authorization_service_enabled: false,
  execution_trace_created: false,
  effect_evidence_created: false,
  legal_certification_created: false,
  case_results: caseResults,
  result: "PASS_RUNTIME_ACCESS_GATE_EVALUATION_HARNESS"
}, null, 2));
console.log("RUNTIME_ACCESS_GATE_EVALUATION_HARNESS=PASS");
