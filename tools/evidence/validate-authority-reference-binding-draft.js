#!/usr/bin/env node
"use strict";

const fs = require("fs");

const RECORD_PATH = "evidence/authorization/20261005_HBCE_AUTHORITY_REFERENCE_BINDING_DRAFT_v001.json";

function fail(message) {
  throw new Error(message);
}

function readText(path) {
  if (!fs.existsSync(path)) {
    fail(`missing file: ${path}`);
  }
  return fs.readFileSync(path, "utf8");
}

function readJson(path) {
  try {
    return JSON.parse(readText(path));
  } catch (error) {
    fail(`invalid JSON at ${path}: ${error.message}`);
  }
}

function assertEqual(actual, expected, label) {
  if (actual !== expected) {
    fail(`${label}: expected ${expected}, got ${actual}`);
  }
}

function assertArray(value, label) {
  if (!Array.isArray(value)) {
    fail(`${label}: expected array`);
  }
}

function assertBooleanMap(record, expectedValue, expectedCount, label) {
  if (!record || typeof record !== "object" || Array.isArray(record)) {
    fail(`${label}: expected object`);
  }

  const keys = Object.keys(record);
  assertEqual(keys.length, expectedCount, `${label}.count`);

  for (const key of keys) {
    if (record[key] !== expectedValue) {
      fail(`${label}.${key}: expected ${expectedValue}, got ${record[key]}`);
    }
  }
}

function assertFileContains(path, tokens, label) {
  const text = readText(path);
  for (const token of tokens) {
    if (!text.includes(token)) {
      fail(`${label}: ${path} missing ${token}`);
    }
  }
}

const record = readJson(RECORD_PATH);

assertEqual(record.object_id, "HBCE-AUTHORITY-REFERENCE-BINDING-DRAFT-V001", "object_id");
assertEqual(record.record_id, "HBCE-AUTHORITY-REFERENCE-BINDING-DRAFT-V001", "record_id");
assertEqual(record.artifact_type, "HBCEAuthorityReferenceBindingDraft", "artifact_type");
assertEqual(record.version, "v001", "version");
assertEqual(record.status, "ACTIVE_AUTHORITY_REFERENCE_BINDING_DRAFT", "status");
assertEqual(record.classification, "R_AND_D_AUTHORITY_REFERENCE_BINDING_DRAFT_ONLY", "classification");
assertEqual(record.basis_marker, "HBCE_ACCESS_AUTHORIZATION_REQUEST_BINDING_DRAFT_FINAL_AUDIT=1", "basis_marker");
assertEqual(record.basis_main_commit, "5b7f430c1f4e2103e013ee6d9ec78b8843cb6ab6", "basis_main_commit");
assertEqual(record.basis_request_binding, "HBCE-ACCESS-AUTHORIZATION-REQUEST-BINDING-DRAFT-V001", "basis_request_binding");
assertEqual(record.decision_scope, "ACCESS_AUTHORIZATION", "decision_scope");
assertEqual(record.authorization_level, "ACCESS_ONLY", "authorization_level");
assertEqual(record.binding_scope, "AUTHORITY_REFERENCE_BINDING", "binding_scope");
assertEqual(record.binding_mode, "RECORD_ONLY_NOT_EXECUTABLE", "binding_mode");
assertEqual(record.authority_binding_state, "NOT_IMPLEMENTED_NOT_EXECUTABLE_NOT_BOUND_TO_RUNTIME", "authority_binding_state");

assertEqual(record.source_chain_entry_count, 7, "source_chain_entry_count");
assertArray(record.source_chain, "source_chain");
assertEqual(record.source_chain.length, 7, "source_chain.length");

const expectedSourceChain = [
  ["HBCE-ACCESS-AUTHORIZATION-REQUEST-BINDING-DRAFT-V001", "evidence/authorization/20261004_HBCE_ACCESS_AUTHORIZATION_REQUEST_BINDING_DRAFT_v001.json", "ACCESS_AUTHORIZATION_REQUEST_BINDING_DRAFT=PASS", "request_binding_basis"],
  ["HBCE-ACCESS-AUTHORIZATION-CHAIN-NEXT-STEP-DISCOVERY-V001", "evidence/authorization/20261004_HBCE_ACCESS_AUTHORIZATION_CHAIN_NEXT_STEP_DISCOVERY_v001.json", "ACCESS_AUTHORIZATION_CHAIN_NEXT_STEP_DISCOVERY=PASS", "programmatic_next_step_basis"],
  ["HBCE-ACCESS-AUTHORIZATION-RECORD-PUBLIC-INDEX-V003", "evidence/registry/20261004_HBCE_ACCESS_AUTHORIZATION_RECORD_PUBLIC_INDEX_v003.json", "ACCESS_AUTHORIZATION_RECORD_PUBLIC_INDEX_V003=PASS", "public_index_basis"],
  ["HBCE-ACCESS-AUTHORIZATION-RECORD-PUBLIC-INDEX-REFRESH-V003", "evidence/registry/20261004_HBCE_ACCESS_AUTHORIZATION_RECORD_PUBLIC_INDEX_REFRESH_v003.json", "ACCESS_AUTHORIZATION_RECORD_PUBLIC_INDEX_REFRESH_V003=PASS", "public_index_refresh_basis"],
  ["HBCE-RUNTIME-ACCESS-GATE-INTEGRATION-BOUNDARY-DRAFT-V001", "evidence/authorization/20261004_HBCE_RUNTIME_ACCESS_GATE_INTEGRATION_BOUNDARY_DRAFT_v001.json", "RUNTIME_ACCESS_GATE_INTEGRATION_BOUNDARY_DRAFT=PASS", "runtime_boundary_basis"],
  ["HBCE-POSITIVE-AUTHORIZATION-CONTRACT-DRAFT-V001", "evidence/authorization/20261004_HBCE_POSITIVE_AUTHORIZATION_CONTRACT_DRAFT_v001.json", "POSITIVE_AUTHORIZATION_CONTRACT_DRAFT=PASS", "positive_contract_basis"],
  ["HBCE-POSITIVE-AUTHORIZATION-CONTRACT-EVALUATION-HARNESS-V001", "evidence/authorization/20261004_HBCE_POSITIVE_AUTHORIZATION_CONTRACT_EVALUATION_HARNESS_v001.json", "POSITIVE_AUTHORIZATION_CONTRACT_EVALUATION_HARNESS=PASS", "positive_contract_evaluation_basis"]
];

record.source_chain.forEach((entry, index) => {
  const [objectId, path, marker, role] = expectedSourceChain[index];

  assertEqual(entry.sequence, index + 1, `source_chain[${index}].sequence`);
  assertEqual(entry.object_id, objectId, `source_chain[${index}].object_id`);
  assertEqual(entry.path, path, `source_chain[${index}].path`);
  assertEqual(entry.expected_marker, marker, `source_chain[${index}].expected_marker`);
  assertEqual(entry.role, role, `source_chain[${index}].role`);
  assertFileContains(path, [objectId, marker], `source_chain[${index}]`);
});

assertEqual(record.required_authority_field_count, 14, "required_authority_field_count");
assertArray(record.required_authority_fields, "required_authority_fields");
assertEqual(record.required_authority_fields.length, 14, "required_authority_fields.length");

const expectedFields = [
  ["authority_ref", "MUST_BE_PRESENT_NON_EMPTY_REFERENCE"],
  ["authority_type", "MUST_BE_PRESENT_ENUM_CANDIDATE"],
  ["authority_issuer_ref", "MUST_BE_PRESENT_REFERENCE_ONLY"],
  ["authority_subject_ref", "MUST_BE_PRESENT_REFERENCE_ONLY"],
  ["authority_scope", "MUST_BE_PRESENT_SCOPE_OBJECT"],
  ["authority_validity", "MUST_BE_PRESENT_VALIDITY_OBJECT"],
  ["authority_source_ref", "MUST_BE_PRESENT_REFERENCE_ONLY"],
  ["authority_evidence_ref", "MUST_BE_PRESENT_REFERENCE_ONLY"],
  ["authority_policy_binding_ref", "MUST_BE_PRESENT_REFERENCE_ONLY"],
  ["request_binding_ref", "MUST_EQUAL_HBCE_ACCESS_AUTHORIZATION_REQUEST_BINDING_DRAFT_V001_OR_SUCCESSOR"],
  ["request_id", "MUST_MATCH_REQUEST_BINDING_REQUEST_ID"],
  ["decision_scope", "MUST_EQUAL_ACCESS_AUTHORIZATION"],
  ["authorization_level", "MUST_EQUAL_ACCESS_ONLY"],
  ["authority_resolution_state", "MUST_BE_DECLARED_AS_FUTURE_RESOLUTION_STATE"]
];

record.required_authority_fields.forEach((field, index) => {
  const [name, rule] = expectedFields[index];

  assertEqual(field.field, name, `required_authority_fields[${index}].field`);
  assertEqual(field.required, true, `required_authority_fields[${index}].required`);
  assertEqual(field.binding_rule, rule, `required_authority_fields[${index}].binding_rule`);

  if (!field.purpose) {
    fail(`required_authority_fields[${index}].purpose missing`);
  }
});

assertEqual(record.binding_rule_count, 10, "binding_rule_count");
assertArray(record.binding_rules, "binding_rules");
assertEqual(record.binding_rules.length, 10, "binding_rules.length");

const expectedRuleIds = [
  "AB-001-RECORD-ONLY",
  "AB-002-NO-AUTHORITY-ASSERTION",
  "AB-003-NO-AUTHORIZATION-DECISION",
  "AB-004-NO-RUNTIME-GATE",
  "AB-005-NO-ACCESS-GRANT",
  "AB-006-NO-DISPATCH",
  "AB-007-NO-EXECUTION",
  "AB-008-NO-LEGAL-CERTIFICATION",
  "AB-009-FUTURE-VALIDATION-ONLY",
  "AB-010-UNKNOWN-FAIL-CLOSED"
];

record.binding_rules.forEach((rule, index) => {
  assertEqual(rule.rule_id, expectedRuleIds[index], `binding_rules[${index}].rule_id`);

  if (!rule.rule) {
    fail(`binding_rules[${index}].rule missing`);
  }

  if (!rule.required_state) {
    fail(`binding_rules[${index}].required_state missing`);
  }
});

assertEqual(record.future_resolution_requirement_count, 14, "future_resolution_requirement_count");
assertArray(record.future_resolution_requirements, "future_resolution_requirements");
assertEqual(record.future_resolution_requirements.length, 14, "future_resolution_requirements.length");

const expectedResolution = [
  "canonical_authority_ref",
  "canonical_authority_type",
  "canonical_authority_issuer_ref",
  "canonical_authority_subject_ref",
  "canonical_authority_scope",
  "canonical_authority_validity",
  "canonical_authority_source_ref",
  "canonical_authority_evidence_ref",
  "canonical_authority_policy_binding_ref",
  "canonical_request_binding_ref",
  "canonical_request_id",
  "canonical_decision_scope",
  "canonical_authorization_level",
  "canonical_authority_resolution_state"
];

record.future_resolution_requirements.forEach((item, index) => {
  assertEqual(item, expectedResolution[index], `future_resolution_requirements[${index}]`);
});

assertArray(record.future_evaluation_precedence, "future_evaluation_precedence");
assertEqual(record.future_evaluation_precedence.length, 5, "future_evaluation_precedence.length");
assertEqual(record.future_evaluation_precedence[0], "MISSING_OR_MALFORMED_AUTHORITY_REFERENCE_FAIL_CLOSED", "future_evaluation_precedence[0]");
assertEqual(record.future_evaluation_precedence[1], "AUTHORITY_REFERENCE_EXPIRED_OR_UNTRUSTED_FAIL_CLOSED", "future_evaluation_precedence[1]");
assertEqual(record.future_evaluation_precedence[2], "AUTHORITY_SCOPE_MISMATCH_FAIL_CLOSED", "future_evaluation_precedence[2]");
assertEqual(record.future_evaluation_precedence[3], "AUTHORITY_REFERENCE_VALID_BUT_NOT_AUTHORIZING", "future_evaluation_precedence[3]");
assertEqual(record.future_evaluation_precedence[4], "FUTURE_POLICY_SCOPE_ACTOR_AND_DECISION_EVALUATION_REQUIRED", "future_evaluation_precedence[4]");

assertEqual(record.recommended_next_step.program, "PROG-290", "recommended_next_step.program");
assertEqual(record.recommended_next_step.title, "HBCE Policy Evaluation Binding Draft v001", "recommended_next_step.title");
assertEqual(record.recommended_next_step.object_id, "HBCE-POLICY-EVALUATION-BINDING-DRAFT-V001", "recommended_next_step.object_id");

assertBooleanMap(record.explicit_non_claims, true, 18, "explicit_non_claims");
assertBooleanMap(record.no_execution_boundary, false, 18, "no_execution_boundary");

assertEqual(record.expected_cli_marker, "AUTHORITY_REFERENCE_BINDING_DRAFT=PASS", "expected_cli_marker");
assertEqual(record.expected_result.source_chain_entry_count, 7, "expected_result.source_chain_entry_count");
assertEqual(record.expected_result.required_authority_field_count, 14, "expected_result.required_authority_field_count");
assertEqual(record.expected_result.binding_rule_count, 10, "expected_result.binding_rule_count");
assertEqual(record.expected_result.future_resolution_requirement_count, 14, "expected_result.future_resolution_requirement_count");
assertEqual(record.expected_result.recommended_next_program, "PROG-290", "expected_result.recommended_next_program");
assertEqual(record.expected_result.recommended_next_object_id, "HBCE-POLICY-EVALUATION-BINDING-DRAFT-V001", "expected_result.recommended_next_object_id");
assertEqual(record.expected_result.required_non_claim_count, 18, "expected_result.required_non_claim_count");
assertEqual(record.expected_result.required_no_execution_boundary_count, 18, "expected_result.required_no_execution_boundary_count");
assertEqual(record.expected_result.runtime_gate_implemented, false, "expected_result.runtime_gate_implemented");
assertEqual(record.expected_result.runtime_gate_enabled, false, "expected_result.runtime_gate_enabled");
assertEqual(record.expected_result.positive_authorization_contract_issued, false, "expected_result.positive_authorization_contract_issued");
assertEqual(record.expected_result.authority_validated, false, "expected_result.authority_validated");
assertEqual(record.expected_result.authority_effective, false, "expected_result.authority_effective");
assertEqual(record.expected_result.authorization_decision_created, false, "expected_result.authorization_decision_created");
assertEqual(record.expected_result.request_approved, false, "expected_result.request_approved");
assertEqual(record.expected_result.access_granted, false, "expected_result.access_granted");
assertEqual(record.expected_result.dispatch_authorized, false, "expected_result.dispatch_authorized");
assertEqual(record.expected_result.execution_authorized, false, "expected_result.execution_authorized");
assertEqual(record.expected_result.effect_evidence_created, false, "expected_result.effect_evidence_created");
assertEqual(record.expected_result.legal_certification_created, false, "expected_result.legal_certification_created");
assertEqual(record.expected_result.result, "PASS_AUTHORITY_REFERENCE_BINDING_DRAFT", "expected_result.result");
assertEqual(record.result, "PASS_AUTHORITY_REFERENCE_BINDING_DRAFT_CREATED", "result");

const summary = {
  marker: "AUTHORITY_REFERENCE_BINDING_DRAFT=PASS",
  object_id: record.object_id,
  basis_marker: record.basis_marker,
  basis_main_commit: record.basis_main_commit,
  basis_request_binding: record.basis_request_binding,
  source_chain_entry_count: record.source_chain_entry_count,
  required_authority_field_count: record.required_authority_field_count,
  binding_rule_count: record.binding_rule_count,
  future_resolution_requirement_count: record.future_resolution_requirement_count,
  recommended_next_program: record.recommended_next_step.program,
  recommended_next_object_id: record.recommended_next_step.object_id,
  required_non_claim_count: Object.keys(record.explicit_non_claims).length,
  required_no_execution_boundary_count: Object.keys(record.no_execution_boundary).length,
  runtime_gate_implemented: false,
  runtime_gate_enabled: false,
  positive_authorization_contract_issued: false,
  authority_validated: false,
  authority_effective: false,
  authorization_decision_created: false,
  request_approved: false,
  access_granted: false,
  dispatch_authorized: false,
  execution_authorized: false,
  effect_evidence_created: false,
  legal_certification_created: false,
  result: "PASS_AUTHORITY_REFERENCE_BINDING_DRAFT"
};

console.log(JSON.stringify(summary, null, 2));
console.log("AUTHORITY_REFERENCE_BINDING_DRAFT=PASS");
