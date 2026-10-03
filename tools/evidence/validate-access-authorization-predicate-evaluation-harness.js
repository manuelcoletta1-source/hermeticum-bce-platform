#!/usr/bin/env node
"use strict";

const fs = require("fs");

const harnessPath = "evidence/authorization/20261003_HBCE_ACCESS_AUTHORIZATION_PREDICATE_EVALUATION_HARNESS_v001.json";
const predicatePath = "evidence/authorization/20261003_HBCE_ACCESS_AUTHORIZATION_PREDICATE_DRAFT_v001.json";

const harness = JSON.parse(fs.readFileSync(harnessPath, "utf8"));
const predicate = JSON.parse(fs.readFileSync(predicatePath, "utf8"));

function fail(message) {
  throw new Error(message);
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

assertEqual(harness.object_id, "HBCE-ACCESS-AUTHORIZATION-PREDICATE-EVALUATION-HARNESS-V001", "harness.object_id");
assertEqual(harness.harness_id, "HBCE-ACCESS-AUTHORIZATION-PREDICATE-EVALUATION-HARNESS-V001", "harness.harness_id");
assertEqual(harness.status, "ACTIVE_ACCESS_AUTHORIZATION_PREDICATE_EVALUATION_HARNESS", "harness.status");
assertEqual(harness.classification, "R_AND_D_ACCESS_AUTHORIZATION_PREDICATE_EVALUATION_HARNESS_ONLY", "harness.classification");
assertEqual(harness.basis_marker, "HBCE_EVIDENCE_REGISTRY_CONSISTENCY_HARNESS_FINAL_AUDIT=1", "harness.basis_marker");
assertEqual(harness.basis_main_commit, "9ffe0dc109e9fab420e1aa03ce48c578c918ae02", "harness.basis_main_commit");
assertEqual(harness.expected_cli_marker, "ACCESS_AUTHORIZATION_PREDICATE_EVALUATION_HARNESS=PASS", "harness.expected_cli_marker");
assertEqual(harness.result, "PASS_ACCESS_AUTHORIZATION_PREDICATE_EVALUATION_HARNESS_MANIFEST_CREATED", "harness.result");

assertEqual(predicate.object_id, "HBCE-ACCESS-AUTHORIZATION-PREDICATE-DRAFT-V001", "predicate.object_id");
assertEqual(predicate.expected_cli_marker, "ACCESS_AUTHORIZATION_PREDICATE_DRAFT=PASS", "predicate.expected_cli_marker");

assertEqual(harness.predicate_under_evaluation.object_id, predicate.object_id, "predicate link object_id");
assertEqual(harness.predicate_under_evaluation.json, predicatePath, "predicate link json");
assertEqual(harness.predicate_under_evaluation.expected_marker, "ACCESS_AUTHORIZATION_PREDICATE_DRAFT=PASS", "predicate link marker");

const scope = harness.evaluation_scope;
assertEqual(scope.decision_scope, "ACCESS_AUTHORIZATION", "evaluation_scope.decision_scope");
assertEqual(scope.authorization_level, "ACCESS_ONLY", "evaluation_scope.authorization_level");
assertEqual(scope.evaluation_mode, "CONTROLLED_LOCAL_HARNESS_ONLY", "evaluation_scope.evaluation_mode");
assertFalse(scope.production_authorization_service, "production_authorization_service");
assertFalse(scope.grant_access, "grant_access");
assertFalse(scope.authorize_dispatch, "authorize_dispatch");
assertFalse(scope.create_execution_trace, "create_execution_trace");
assertFalse(scope.create_effect_evidence, "create_effect_evidence");

const template = harness.required_positive_input_template;
const predicateRequired = predicate.required_inputs;

for (const [key, value] of Object.entries(predicateRequired)) {
  assertEqual(template[key], value, `template.${key}`);
}

assertEqual(harness.expected_result.evaluation_case_count, 9, "evaluation_case_count");
assertEqual(harness.expected_result.eligible_case_count, 1, "eligible_case_count");
assertEqual(harness.expected_result.deny_case_count, 6, "deny_case_count");
assertEqual(harness.expected_result.unknown_fail_closed_case_count, 2, "unknown_fail_closed_case_count");
assertEqual(harness.expected_result.result, "PASS_ACCESS_AUTHORIZATION_PREDICATE_EVALUATION_HARNESS_DRAFT", "expected_result.result");

if (!Array.isArray(harness.evaluation_cases)) fail("evaluation_cases must be an array");
assertEqual(harness.evaluation_cases.length, harness.expected_result.evaluation_case_count, "evaluation_cases.length");

for (const [key, value] of Object.entries(harness.explicit_non_claims)) {
  assertTrue(value, `explicit_non_claims.${key}`);
}

for (const [key, value] of Object.entries(harness.no_execution_boundary)) {
  assertFalse(value, `no_execution_boundary.${key}`);
}

function evaluate(input) {
  for (const key of Object.keys(predicateRequired)) {
    if (!(key in input)) return "ACCESS_AUTHORIZATION_PREDICATE_UNKNOWN_FAIL_CLOSED";
    if (input[key] === "UNKNOWN" || input[key] === null) return "ACCESS_AUTHORIZATION_PREDICATE_UNKNOWN_FAIL_CLOSED";
    if (input[key] !== predicateRequired[key]) return "ACCESS_AUTHORIZATION_PREDICATE_DENY";
  }
  return "ACCESS_AUTHORIZATION_PREDICATE_ELIGIBLE";
}

const results = [];
let eligibleCount = 0;
let denyCount = 0;
let unknownCount = 0;

const seenCaseIds = new Set();

for (const testCase of harness.evaluation_cases) {
  if (seenCaseIds.has(testCase.case_id)) fail(`duplicate case_id: ${testCase.case_id}`);
  seenCaseIds.add(testCase.case_id);

  const input = { ...template, ...testCase.input_patch };
  const actual = evaluate(input);

  assertEqual(actual, testCase.expected_result, `${testCase.case_id}.expected_result`);
  assertFalse(testCase.access_granted, `${testCase.case_id}.access_granted`);
  assertFalse(testCase.dispatch_authorized, `${testCase.case_id}.dispatch_authorized`);
  assertFalse(testCase.effect_evidence_created, `${testCase.case_id}.effect_evidence_created`);

  if (actual === "ACCESS_AUTHORIZATION_PREDICATE_ELIGIBLE") eligibleCount += 1;
  if (actual === "ACCESS_AUTHORIZATION_PREDICATE_DENY") denyCount += 1;
  if (actual === "ACCESS_AUTHORIZATION_PREDICATE_UNKNOWN_FAIL_CLOSED") unknownCount += 1;

  results.push({
    case_id: testCase.case_id,
    expected_result: testCase.expected_result,
    actual_result: actual,
    pass: true,
    access_granted: false,
    dispatch_authorized: false,
    execution_trace_created: false,
    effect_evidence_created: false
  });
}

assertEqual(eligibleCount, harness.expected_result.eligible_case_count, "actual eligible count");
assertEqual(denyCount, harness.expected_result.deny_case_count, "actual deny count");
assertEqual(unknownCount, harness.expected_result.unknown_fail_closed_case_count, "actual unknown count");

console.log(JSON.stringify({
  marker: "ACCESS_AUTHORIZATION_PREDICATE_EVALUATION_HARNESS=PASS",
  harness_id: harness.harness_id,
  predicate_id: predicate.object_id,
  evaluation_case_count: results.length,
  eligible_case_count: eligibleCount,
  deny_case_count: denyCount,
  unknown_fail_closed_case_count: unknownCount,
  production_authorization_service_enabled: false,
  access_granted: false,
  dispatch_authorized: false,
  execution_trace_created: false,
  effect_evidence_created: false,
  results,
  result: "PASS_ACCESS_AUTHORIZATION_PREDICATE_EVALUATION_HARNESS_DRAFT"
}, null, 2));
console.log("ACCESS_AUTHORIZATION_PREDICATE_EVALUATION_HARNESS=PASS");
