#!/usr/bin/env node
"use strict";

const fs = require("fs");

const harnessPath = "evidence/authorization/20261003_HBCE_AUTHORIZATION_DECISION_RECORD_EVALUATION_HARNESS_v001.json";

function fail(message) {
  throw new Error(message);
}

function readText(path) {
  if (!fs.existsSync(path)) fail(`missing file: ${path}`);
  return fs.readFileSync(path, "utf8");
}

function parseJson(path) {
  const text = readText(path);
  try {
    return JSON.parse(text);
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

function assertArrayIncludes(array, value, label) {
  if (!Array.isArray(array)) fail(`${label} must be array`);
  if (!array.includes(value)) fail(`${label} missing ${value}`);
}

function applyPatch(template, patch) {
  return Object.assign({}, template, patch || {});
}

function hasUnknown(value) {
  return value === "UNKNOWN" || value === null || typeof value === "undefined";
}

function evaluateDecisionRecord(input) {
  for (const value of Object.values(input)) {
    if (hasUnknown(value)) {
      return "ACCESS_AUTHORIZATION_UNKNOWN_FAIL_CLOSED_RECORD_ONLY";
    }
  }

  const approvalChecks = [
    input.decision_record_id_present === true,
    input.decision_scope === "ACCESS_AUTHORIZATION",
    input.authorization_level === "ACCESS_ONLY",
    input.authority_ref_present === true,
    input.authority_version_present === true,
    input.authority_sha256_present === true,
    input.request_ref_present === true,
    input.request_sha256_present === true,
    input.subject_ref_present === true,
    input.ipr_status === "verified",
    input.ipr_card_status === "issued",
    input.certificate_status === "active",
    input.mandate_ref_present === true,
    input.mandate_valid === true,
    input.policy_evaluation_ref_present === true,
    input.policy_evaluation_result === "PASS",
    input.predicate_ref_present === true,
    input.predicate_result === "ACCESS_AUTHORIZATION_PREDICATE_ELIGIBLE",
    input.decision_timestamp_present === true,
    input.decision_actor_ref_present === true,
    input.decision_actor_role_present === true,
    input.positive_authorization_contract_ref_present === true,
    input.reason_codes_present === true,
    input.boundary_assertions_present === true,
    input.no_execution_boundary_present === true
  ];

  if (approvalChecks.every(Boolean)) {
    return "ACCESS_AUTHORIZATION_APPROVED_RECORD_ONLY";
  }

  return "ACCESS_AUTHORIZATION_DENIED_RECORD_ONLY";
}

const harness = parseJson(harnessPath);

assertEqual(harness.object_id, "HBCE-AUTHORIZATION-DECISION-RECORD-EVALUATION-HARNESS-V001", "object_id");
assertEqual(harness.harness_id, "HBCE-AUTHORIZATION-DECISION-RECORD-EVALUATION-HARNESS-V001", "harness_id");
assertEqual(harness.artifact_type, "HBCEAuthorizationDecisionRecordEvaluationHarness", "artifact_type");
assertEqual(harness.version, "v001", "version");
assertEqual(harness.status, "ACTIVE_AUTHORIZATION_DECISION_RECORD_EVALUATION_HARNESS", "status");
assertEqual(harness.classification, "R_AND_D_AUTHORIZATION_DECISION_RECORD_EVALUATION_HARNESS_ONLY", "classification");
assertEqual(harness.basis_marker, "HBCE_ACCESS_AUTHORIZATION_DECISION_RECORD_DRAFT_FINAL_AUDIT=1", "basis_marker");
assertEqual(harness.basis_main_commit, "7906ccdcb6a55cddd6dac38a3251997194da69bd", "basis_main_commit");

assertEqual(harness.public_surfaces.page, "authorization-decision-record-evaluation-harness.html", "public_surfaces.page");
assertEqual(harness.public_surfaces.json, harnessPath, "public_surfaces.json");
assertEqual(harness.public_surfaces.documentation, "docs/evidence/hbce-authorization-decision-record-evaluation-harness-v001.md", "public_surfaces.documentation");
assertEqual(harness.public_surfaces.tool, "tools/evidence/validate-authorization-decision-record-evaluation-harness.js", "public_surfaces.tool");

assertEqual(harness.decision_record_under_evaluation.decision_record_id, "HBCE-ACCESS-AUTHORIZATION-DECISION-RECORD-DRAFT-V001", "decision_record_under_evaluation.decision_record_id");
assertEqual(harness.decision_record_under_evaluation.decision_record_json, "evidence/authorization/20261003_HBCE_ACCESS_AUTHORIZATION_DECISION_RECORD_DRAFT_v001.json", "decision_record_under_evaluation.decision_record_json");
assertEqual(harness.decision_record_under_evaluation.decision_record_page, "access-authorization-decision-record-draft.html", "decision_record_under_evaluation.decision_record_page");
assertEqual(harness.decision_record_under_evaluation.expected_marker, "ACCESS_AUTHORIZATION_DECISION_RECORD_DRAFT=PASS", "decision_record_under_evaluation.expected_marker");

assertEqual(harness.source_predicate.predicate_id, "HBCE-ACCESS-AUTHORIZATION-PREDICATE-DRAFT-V001", "source_predicate.predicate_id");
assertEqual(harness.source_predicate.expected_marker, "ACCESS_AUTHORIZATION_PREDICATE_DRAFT=PASS", "source_predicate.expected_marker");
assertEqual(harness.source_predicate_evaluation.evaluation_harness_id, "HBCE-ACCESS-AUTHORIZATION-PREDICATE-EVALUATION-HARNESS-V001", "source_predicate_evaluation.evaluation_harness_id");
assertEqual(harness.source_predicate_evaluation.expected_marker, "ACCESS_AUTHORIZATION_PREDICATE_EVALUATION_HARNESS=PASS", "source_predicate_evaluation.expected_marker");

const recordText = readText(harness.decision_record_under_evaluation.decision_record_json);
const recordPageText = readText(harness.decision_record_under_evaluation.decision_record_page);
if (!recordText.includes(harness.decision_record_under_evaluation.decision_record_id) && !recordPageText.includes(harness.decision_record_under_evaluation.decision_record_id)) {
  fail("decision record id not found in source artifacts");
}
if (!recordText.includes(harness.decision_record_under_evaluation.expected_marker) && !recordPageText.includes(harness.decision_record_under_evaluation.expected_marker)) {
  fail("decision record marker not found in source artifacts");
}

const predicateText = readText(harness.source_predicate.predicate_json);
const predicatePageText = readText(harness.source_predicate.predicate_page);
if (!predicateText.includes(harness.source_predicate.predicate_id) && !predicatePageText.includes(harness.source_predicate.predicate_id)) {
  fail("predicate id not found in source artifacts");
}
if (!predicateText.includes(harness.source_predicate.expected_marker) && !predicatePageText.includes(harness.source_predicate.expected_marker)) {
  fail("predicate marker not found in source artifacts");
}

const evaluationText = readText(harness.source_predicate_evaluation.evaluation_harness_json);
const evaluationPageText = readText(harness.source_predicate_evaluation.evaluation_harness_page);
if (!evaluationText.includes(harness.source_predicate_evaluation.evaluation_harness_id) && !evaluationPageText.includes(harness.source_predicate_evaluation.evaluation_harness_id)) {
  fail("predicate evaluation id not found in source artifacts");
}
if (!evaluationText.includes(harness.source_predicate_evaluation.expected_marker) && !evaluationPageText.includes(harness.source_predicate_evaluation.expected_marker)) {
  fail("predicate evaluation marker not found in source artifacts");
}

assertEqual(harness.evaluation_scope.decision_scope, "ACCESS_AUTHORIZATION", "evaluation_scope.decision_scope");
assertEqual(harness.evaluation_scope.authorization_level, "ACCESS_ONLY", "evaluation_scope.authorization_level");
assertEqual(harness.evaluation_scope.evaluation_mode, "CONTROLLED_LOCAL_HARNESS_ONLY", "evaluation_scope.evaluation_mode");
assertFalse(harness.evaluation_scope.production_authorization_service, "evaluation_scope.production_authorization_service");
assertFalse(harness.evaluation_scope.grant_access, "evaluation_scope.grant_access");
assertFalse(harness.evaluation_scope.authorize_dispatch, "evaluation_scope.authorize_dispatch");
assertFalse(harness.evaluation_scope.authorize_execution, "evaluation_scope.authorize_execution");
assertFalse(harness.evaluation_scope.create_execution_trace, "evaluation_scope.create_execution_trace");
assertFalse(harness.evaluation_scope.create_effect_evidence, "evaluation_scope.create_effect_evidence");
assertFalse(harness.evaluation_scope.create_legal_certification, "evaluation_scope.create_legal_certification");

const positive = harness.positive_input_template;
for (const requiredKey of [
  "decision_record_id_present",
  "decision_scope",
  "authorization_level",
  "authority_ref_present",
  "authority_version_present",
  "authority_sha256_present",
  "request_ref_present",
  "request_sha256_present",
  "subject_ref_present",
  "ipr_status",
  "ipr_card_status",
  "certificate_status",
  "mandate_ref_present",
  "mandate_valid",
  "policy_evaluation_ref_present",
  "policy_evaluation_result",
  "predicate_ref_present",
  "predicate_result",
  "decision_timestamp_present",
  "decision_actor_ref_present",
  "decision_actor_role_present",
  "positive_authorization_contract_ref_present",
  "reason_codes_present",
  "boundary_assertions_present",
  "no_execution_boundary_present"
]) {
  if (!Object.prototype.hasOwnProperty.call(positive, requiredKey)) {
    fail(`positive_input_template missing ${requiredKey}`);
  }
}

assertEqual(harness.expected_cli_marker, "AUTHORIZATION_DECISION_RECORD_EVALUATION_HARNESS=PASS", "expected_cli_marker");
assertEqual(harness.expected_result.evaluation_case_count, 9, "expected_result.evaluation_case_count");
assertEqual(harness.expected_result.approved_record_only_case_count, 1, "expected_result.approved_record_only_case_count");
assertEqual(harness.expected_result.denied_record_only_case_count, 6, "expected_result.denied_record_only_case_count");
assertEqual(harness.expected_result.unknown_fail_closed_record_only_case_count, 2, "expected_result.unknown_fail_closed_record_only_case_count");
assertEqual(harness.expected_result.result, "PASS_AUTHORIZATION_DECISION_RECORD_EVALUATION_HARNESS_DRAFT", "expected_result.result");

const cases = harness.evaluation_cases;
if (!Array.isArray(cases)) fail("evaluation_cases must be array");
assertEqual(cases.length, 9, "evaluation_cases.length");

const seenCaseIds = new Set();
const results = [];

for (const testCase of cases) {
  if (seenCaseIds.has(testCase.case_id)) fail(`duplicate case_id: ${testCase.case_id}`);
  seenCaseIds.add(testCase.case_id);

  const input = applyPatch(positive, testCase.input_patch);
  const actual = evaluateDecisionRecord(input);
  const pass = actual === testCase.expected_decision_outcome;

  if (!pass) {
    fail(`${testCase.case_id}: expected ${testCase.expected_decision_outcome}, got ${actual}`);
  }

  results.push({
    case_id: testCase.case_id,
    expected_decision_outcome: testCase.expected_decision_outcome,
    actual_decision_outcome: actual,
    pass,
    access_granted: false,
    dispatch_authorized: false,
    execution_authorized: false,
    production_authorization_service_enabled: false,
    execution_trace_created: false,
    effect_evidence_created: false,
    legal_certification_created: false
  });
}

assertArrayIncludes(Array.from(seenCaseIds), "CASE-001-ALL-APPROVAL-PRECONDITIONS-SATISFIED", "case_ids");
assertArrayIncludes(Array.from(seenCaseIds), "CASE-009-PREDICATE-RESULT-UNKNOWN", "case_ids");

const approvedCount = results.filter((r) => r.actual_decision_outcome === "ACCESS_AUTHORIZATION_APPROVED_RECORD_ONLY").length;
const deniedCount = results.filter((r) => r.actual_decision_outcome === "ACCESS_AUTHORIZATION_DENIED_RECORD_ONLY").length;
const unknownCount = results.filter((r) => r.actual_decision_outcome === "ACCESS_AUTHORIZATION_UNKNOWN_FAIL_CLOSED_RECORD_ONLY").length;

assertEqual(approvedCount, harness.expected_result.approved_record_only_case_count, "approvedCount");
assertEqual(deniedCount, harness.expected_result.denied_record_only_case_count, "deniedCount");
assertEqual(unknownCount, harness.expected_result.unknown_fail_closed_record_only_case_count, "unknownCount");

for (const [key, value] of Object.entries(harness.explicit_non_claims)) {
  assertTrue(value, `explicit_non_claims.${key}`);
}

for (const [key, value] of Object.entries(harness.no_execution_boundary)) {
  assertFalse(value, `no_execution_boundary.${key}`);
}

assertEqual(harness.result, "PASS_AUTHORIZATION_DECISION_RECORD_EVALUATION_HARNESS_MANIFEST_CREATED", "result");

console.log(JSON.stringify({
  marker: "AUTHORIZATION_DECISION_RECORD_EVALUATION_HARNESS=PASS",
  harness_id: harness.harness_id,
  decision_record_id: harness.decision_record_under_evaluation.decision_record_id,
  decision_scope: harness.evaluation_scope.decision_scope,
  authorization_level: harness.evaluation_scope.authorization_level,
  evaluation_mode: harness.evaluation_scope.evaluation_mode,
  evaluation_case_count: cases.length,
  approved_record_only_case_count: approvedCount,
  denied_record_only_case_count: deniedCount,
  unknown_fail_closed_record_only_case_count: unknownCount,
  production_authorization_service_enabled: false,
  access_granted: false,
  dispatch_authorized: false,
  execution_authorized: false,
  execution_trace_created: false,
  effect_evidence_created: false,
  legal_certification_created: false,
  results,
  result: "PASS_AUTHORIZATION_DECISION_RECORD_EVALUATION_HARNESS_DRAFT"
}, null, 2));
console.log("AUTHORIZATION_DECISION_RECORD_EVALUATION_HARNESS=PASS");
