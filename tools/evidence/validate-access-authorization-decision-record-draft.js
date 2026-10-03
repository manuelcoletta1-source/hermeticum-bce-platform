#!/usr/bin/env node
"use strict";

const fs = require("fs");

const decisionRecordPath = "evidence/authorization/20261003_HBCE_ACCESS_AUTHORIZATION_DECISION_RECORD_DRAFT_v001.json";

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
  if (!Array.isArray(array)) fail(`${label} must be an array`);
  if (!array.includes(value)) fail(`${label} missing ${value}`);
}

const record = parseJson(decisionRecordPath);

assertEqual(record.object_id, "HBCE-ACCESS-AUTHORIZATION-DECISION-RECORD-DRAFT-V001", "object_id");
assertEqual(record.decision_record_id, "HBCE-ACCESS-AUTHORIZATION-DECISION-RECORD-DRAFT-V001", "decision_record_id");
assertEqual(record.artifact_type, "HBCEAccessAuthorizationDecisionRecordDraft", "artifact_type");
assertEqual(record.version, "v001", "version");
assertEqual(record.status, "ACTIVE_ACCESS_AUTHORIZATION_DECISION_RECORD_DRAFT", "status");
assertEqual(record.classification, "R_AND_D_ACCESS_AUTHORIZATION_DECISION_RECORD_DRAFT_ONLY", "classification");
assertEqual(record.basis_marker, "HBCE_EVIDENCE_REGISTRY_PUBLIC_INDEX_REFRESH_FINAL_AUDIT=1", "basis_marker");
assertEqual(record.basis_main_commit, "39fe9955a6630397a3e381285d19431acca4fb29", "basis_main_commit");

assertEqual(record.public_surfaces.page, "access-authorization-decision-record-draft.html", "public_surfaces.page");
assertEqual(record.public_surfaces.json, decisionRecordPath, "public_surfaces.json");
assertEqual(record.public_surfaces.documentation, "docs/evidence/hbce-access-authorization-decision-record-draft-v001.md", "public_surfaces.documentation");
assertEqual(record.public_surfaces.tool, "tools/evidence/validate-access-authorization-decision-record-draft.js", "public_surfaces.tool");

assertEqual(record.decision_scope.decision_scope, "ACCESS_AUTHORIZATION", "decision_scope.decision_scope");
assertEqual(record.decision_scope.authorization_level, "ACCESS_ONLY", "decision_scope.authorization_level");
assertEqual(record.decision_scope.dispatch_scope, "EXCLUDED", "decision_scope.dispatch_scope");
assertEqual(record.decision_scope.execution_scope, "EXCLUDED", "decision_scope.execution_scope");
assertEqual(record.decision_scope.effect_scope, "EXCLUDED", "decision_scope.effect_scope");
assertEqual(record.decision_scope.decision_record_mode, "CONTROLLED_R_AND_D_DRAFT_ONLY", "decision_scope.decision_record_mode");

assertEqual(record.source_predicate.predicate_id, "HBCE-ACCESS-AUTHORIZATION-PREDICATE-DRAFT-V001", "source_predicate.predicate_id");
assertEqual(record.source_predicate.predicate_json, "evidence/authorization/20261003_HBCE_ACCESS_AUTHORIZATION_PREDICATE_DRAFT_v001.json", "source_predicate.predicate_json");
assertEqual(record.source_predicate.predicate_page, "access-authorization-predicate-draft.html", "source_predicate.predicate_page");
assertEqual(record.source_predicate.expected_marker, "ACCESS_AUTHORIZATION_PREDICATE_DRAFT=PASS", "source_predicate.expected_marker");

assertEqual(record.source_predicate_evaluation.evaluation_harness_id, "HBCE-ACCESS-AUTHORIZATION-PREDICATE-EVALUATION-HARNESS-V001", "source_predicate_evaluation.evaluation_harness_id");
assertEqual(record.source_predicate_evaluation.evaluation_harness_json, "evidence/authorization/20261003_HBCE_ACCESS_AUTHORIZATION_PREDICATE_EVALUATION_HARNESS_v001.json", "source_predicate_evaluation.evaluation_harness_json");
assertEqual(record.source_predicate_evaluation.evaluation_harness_page, "access-authorization-predicate-evaluation-harness.html", "source_predicate_evaluation.evaluation_harness_page");
assertEqual(record.source_predicate_evaluation.expected_marker, "ACCESS_AUTHORIZATION_PREDICATE_EVALUATION_HARNESS=PASS", "source_predicate_evaluation.expected_marker");
assertEqual(record.source_predicate_evaluation.eligible_case_count, 1, "source_predicate_evaluation.eligible_case_count");
assertEqual(record.source_predicate_evaluation.deny_case_count, 6, "source_predicate_evaluation.deny_case_count");
assertEqual(record.source_predicate_evaluation.unknown_fail_closed_case_count, 2, "source_predicate_evaluation.unknown_fail_closed_case_count");

const predicateText = readText(record.source_predicate.predicate_json);
const predicatePageText = readText(record.source_predicate.predicate_page);
if (!predicateText.includes(record.source_predicate.predicate_id) && !predicatePageText.includes(record.source_predicate.predicate_id)) {
  fail("source predicate id not found in source artifacts");
}
if (!predicateText.includes(record.source_predicate.expected_marker) && !predicatePageText.includes(record.source_predicate.expected_marker)) {
  fail("source predicate marker not found in source artifacts");
}

const evaluationText = readText(record.source_predicate_evaluation.evaluation_harness_json);
const evaluationPageText = readText(record.source_predicate_evaluation.evaluation_harness_page);
if (!evaluationText.includes(record.source_predicate_evaluation.evaluation_harness_id) && !evaluationPageText.includes(record.source_predicate_evaluation.evaluation_harness_id)) {
  fail("source predicate evaluation id not found in source artifacts");
}
if (!evaluationText.includes(record.source_predicate_evaluation.expected_marker) && !evaluationPageText.includes(record.source_predicate_evaluation.expected_marker)) {
  fail("source predicate evaluation marker not found in source artifacts");
}

const requiredFields = record.required_record_fields;
const requiredFieldNames = Object.keys(requiredFields);
const requiredFieldSet = new Set(requiredFieldNames);

for (const required of [
  "decision_record_id",
  "decision_scope",
  "authorization_level",
  "authority_ref",
  "authority_version",
  "authority_sha256",
  "request_ref",
  "request_sha256",
  "subject_ref",
  "ipr_status",
  "ipr_card_status",
  "certificate_status",
  "mandate_ref",
  "mandate_valid",
  "policy_evaluation_ref",
  "policy_evaluation_result",
  "predicate_ref",
  "predicate_result",
  "decision_outcome",
  "decision_timestamp",
  "decision_actor_ref",
  "decision_actor_role",
  "positive_authorization_contract_ref",
  "reason_codes",
  "boundary_assertions",
  "no_execution_boundary"
]) {
  if (!requiredFieldSet.has(required)) fail(`missing required field definition: ${required}`);
}

assertEqual(requiredFields.decision_scope, "ACCESS_AUTHORIZATION_REQUIRED", "required_record_fields.decision_scope");
assertEqual(requiredFields.authorization_level, "ACCESS_ONLY_REQUIRED", "required_record_fields.authorization_level");
assertEqual(requiredFields.policy_evaluation_result, "REQUIRED_PASS_FOR_APPROVAL", "required_record_fields.policy_evaluation_result");
assertEqual(requiredFields.positive_authorization_contract_ref, "REQUIRED_FOR_APPROVAL", "required_record_fields.positive_authorization_contract_ref");

assertArrayIncludes(record.allowed_decision_outcomes, "ACCESS_AUTHORIZATION_APPROVED_RECORD_ONLY", "allowed_decision_outcomes");
assertArrayIncludes(record.allowed_decision_outcomes, "ACCESS_AUTHORIZATION_DENIED_RECORD_ONLY", "allowed_decision_outcomes");
assertArrayIncludes(record.allowed_decision_outcomes, "ACCESS_AUTHORIZATION_UNKNOWN_FAIL_CLOSED_RECORD_ONLY", "allowed_decision_outcomes");

assertEqual(record.approval_preconditions.predicate_result_must_equal, "ACCESS_AUTHORIZATION_PREDICATE_ELIGIBLE", "approval_preconditions.predicate_result_must_equal");
assertEqual(record.approval_preconditions.policy_evaluation_result_must_equal, "PASS", "approval_preconditions.policy_evaluation_result_must_equal");
assertEqual(record.approval_preconditions.decision_scope_must_equal, "ACCESS_AUTHORIZATION", "approval_preconditions.decision_scope_must_equal");
assertEqual(record.approval_preconditions.authorization_level_must_equal, "ACCESS_ONLY", "approval_preconditions.authorization_level_must_equal");
assertTrue(record.approval_preconditions.authority_ref_present, "approval_preconditions.authority_ref_present");
assertTrue(record.approval_preconditions.request_binding_present, "approval_preconditions.request_binding_present");
assertTrue(record.approval_preconditions.positive_authorization_contract_present, "approval_preconditions.positive_authorization_contract_present");
assertTrue(record.approval_preconditions.explicit_decision_actor_present, "approval_preconditions.explicit_decision_actor_present");
assertTrue(record.approval_preconditions.boundary_assertions_present, "approval_preconditions.boundary_assertions_present");

for (const requiredCondition of [
  "MISSING_DECISION_RECORD_ID",
  "MISSING_OR_NON_ACCESS_DECISION_SCOPE",
  "MISSING_AUTHORITY_REF",
  "MISSING_REQUEST_BINDING",
  "MISSING_SUBJECT_REF",
  "PREDICATE_RESULT_NOT_ELIGIBLE",
  "POLICY_EVALUATION_NOT_PASS",
  "MISSING_POSITIVE_AUTHORIZATION_CONTRACT_FOR_APPROVAL",
  "MISSING_DECISION_ACTOR",
  "UNKNOWN_INPUT_PRESENT",
  "BOUNDARY_ASSERTION_MISSING",
  "NO_EXECUTION_BOUNDARY_MISSING"
]) {
  assertArrayIncludes(record.fail_closed_conditions, requiredCondition, "fail_closed_conditions");
}

assertEqual(record.expected_cli_marker, "ACCESS_AUTHORIZATION_DECISION_RECORD_DRAFT=PASS", "expected_cli_marker");
assertEqual(record.expected_result.decision_record_field_count, requiredFieldNames.length, "expected_result.decision_record_field_count");
assertEqual(record.expected_result.allowed_decision_outcome_count, record.allowed_decision_outcomes.length, "expected_result.allowed_decision_outcome_count");
assertEqual(record.expected_result.fail_closed_condition_count, record.fail_closed_conditions.length, "expected_result.fail_closed_condition_count");
assertEqual(record.expected_result.result, "PASS_ACCESS_AUTHORIZATION_DECISION_RECORD_DRAFT", "expected_result.result");

for (const [key, value] of Object.entries(record.explicit_non_claims)) {
  assertTrue(value, `explicit_non_claims.${key}`);
}

for (const [key, value] of Object.entries(record.no_execution_boundary)) {
  assertFalse(value, `no_execution_boundary.${key}`);
}

assertEqual(record.result, "PASS_ACCESS_AUTHORIZATION_DECISION_RECORD_DRAFT_MANIFEST_CREATED", "result");

console.log(JSON.stringify({
  marker: "ACCESS_AUTHORIZATION_DECISION_RECORD_DRAFT=PASS",
  decision_record_id: record.decision_record_id,
  decision_scope: record.decision_scope.decision_scope,
  authorization_level: record.decision_scope.authorization_level,
  decision_record_mode: record.decision_scope.decision_record_mode,
  source_predicate_id: record.source_predicate.predicate_id,
  source_predicate_marker: record.source_predicate.expected_marker,
  source_predicate_evaluation_id: record.source_predicate_evaluation.evaluation_harness_id,
  source_predicate_evaluation_marker: record.source_predicate_evaluation.expected_marker,
  decision_record_field_count: requiredFieldNames.length,
  allowed_decision_outcome_count: record.allowed_decision_outcomes.length,
  fail_closed_condition_count: record.fail_closed_conditions.length,
  approval_precondition_count: Object.keys(record.approval_preconditions).length,
  access_granted: false,
  dispatch_authorized: false,
  execution_authorized: false,
  production_authorization_service_enabled: false,
  execution_trace_created: false,
  effect_evidence_created: false,
  legal_certification_created: false,
  result: "PASS_ACCESS_AUTHORIZATION_DECISION_RECORD_DRAFT"
}, null, 2));
console.log("ACCESS_AUTHORIZATION_DECISION_RECORD_DRAFT=PASS");
