#!/usr/bin/env node
"use strict";

const fs = require("fs");

const RECORD_PATH = "evidence/authorization/20261004_HBCE_ACCESS_AUTHORIZATION_REQUEST_BINDING_DRAFT_v001.json";

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

assertEqual(record.object_id, "HBCE-ACCESS-AUTHORIZATION-REQUEST-BINDING-DRAFT-V001", "object_id");
assertEqual(record.record_id, "HBCE-ACCESS-AUTHORIZATION-REQUEST-BINDING-DRAFT-V001", "record_id");
assertEqual(record.artifact_type, "HBCEAccessAuthorizationRequestBindingDraft", "artifact_type");
assertEqual(record.version, "v001", "version");
assertEqual(record.status, "ACTIVE_ACCESS_AUTHORIZATION_REQUEST_BINDING_DRAFT", "status");
assertEqual(record.classification, "R_AND_D_REQUEST_BINDING_DRAFT_ONLY", "classification");
assertEqual(record.basis_marker, "HBCE_ACCESS_AUTHORIZATION_CHAIN_NEXT_STEP_DISCOVERY_FINAL_AUDIT=1", "basis_marker");
assertEqual(record.basis_main_commit, "a8719a28378b84d88189f2696443f40ea8345f91", "basis_main_commit");
assertEqual(record.basis_discovery, "HBCE-ACCESS-AUTHORIZATION-CHAIN-NEXT-STEP-DISCOVERY-V001", "basis_discovery");
assertEqual(record.decision_scope, "ACCESS_AUTHORIZATION", "decision_scope");
assertEqual(record.authorization_level, "ACCESS_ONLY", "authorization_level");
assertEqual(record.binding_scope, "ACCESS_AUTHORIZATION_REQUEST_BINDING", "binding_scope");
assertEqual(record.binding_mode, "RECORD_ONLY_NOT_EXECUTABLE", "binding_mode");
assertEqual(record.request_binding_state, "NOT_IMPLEMENTED_NOT_EXECUTABLE_NOT_BOUND_TO_RUNTIME", "request_binding_state");

assertEqual(record.source_chain_entry_count, 6, "source_chain_entry_count");
assertArray(record.source_chain, "source_chain");
assertEqual(record.source_chain.length, 6, "source_chain.length");

const expectedSourceChain = [
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

assertEqual(record.required_request_field_count, 14, "required_request_field_count");
assertArray(record.required_request_fields, "required_request_fields");
assertEqual(record.required_request_fields.length, 14, "required_request_fields.length");

const expectedFields = [
  ["request_id", "MUST_BE_PRESENT_NON_EMPTY_STRING"],
  ["request_timestamp_utc", "MUST_BE_PRESENT_UTC_TIMESTAMP"],
  ["requester_ref", "MUST_BE_PRESENT_REFERENCE_ONLY"],
  ["subject_ref", "MUST_BE_PRESENT_REFERENCE_ONLY"],
  ["target_ref", "MUST_BE_PRESENT_REFERENCE_ONLY"],
  ["action_ref", "MUST_BE_PRESENT_REFERENCE_ONLY"],
  ["action_class", "MUST_BE_PRESENT_ENUM_CANDIDATE"],
  ["requested_scope", "MUST_BE_PRESENT_SCOPE_OBJECT"],
  ["authority_ref", "MUST_BE_PRESENT_REFERENCE_ONLY"],
  ["policy_ref", "MUST_BE_PRESENT_REFERENCE_ONLY"],
  ["evidence_context_ref", "MUST_BE_PRESENT_REFERENCE_ONLY"],
  ["decision_scope", "MUST_EQUAL_ACCESS_AUTHORIZATION"],
  ["authorization_level", "MUST_EQUAL_ACCESS_ONLY"],
  ["idempotency_key", "MUST_BE_PRESENT_NON_EMPTY_STRING"]
];

record.required_request_fields.forEach((field, index) => {
  const [name, rule] = expectedFields[index];

  assertEqual(field.field, name, `required_request_fields[${index}].field`);
  assertEqual(field.required, true, `required_request_fields[${index}].required`);
  assertEqual(field.binding_rule, rule, `required_request_fields[${index}].binding_rule`);

  if (!field.purpose) {
    fail(`required_request_fields[${index}].purpose missing`);
  }
});

assertEqual(record.binding_rule_count, 9, "binding_rule_count");
assertArray(record.binding_rules, "binding_rules");
assertEqual(record.binding_rules.length, 9, "binding_rules.length");

const expectedRuleIds = [
  "RB-001-RECORD-ONLY",
  "RB-002-NO-AUTHORIZATION-DECISION",
  "RB-003-NO-RUNTIME-GATE",
  "RB-004-NO-ACCESS-GRANT",
  "RB-005-NO-DISPATCH",
  "RB-006-NO-EXECUTION",
  "RB-007-NO-LEGAL-CERTIFICATION",
  "RB-008-FUTURE-VALIDATION-ONLY",
  "RB-009-UNKNOWN-FAIL-CLOSED"
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

assertEqual(record.future_normalization_requirement_count, 14, "future_normalization_requirement_count");
assertArray(record.future_normalization_requirements, "future_normalization_requirements");
assertEqual(record.future_normalization_requirements.length, 14, "future_normalization_requirements.length");

const expectedNormalization = [
  "canonical_request_id",
  "canonical_request_timestamp_utc",
  "canonical_requester_ref",
  "canonical_subject_ref",
  "canonical_target_ref",
  "canonical_action_ref",
  "canonical_action_class",
  "canonical_requested_scope",
  "canonical_authority_ref",
  "canonical_policy_ref",
  "canonical_evidence_context_ref",
  "canonical_decision_scope",
  "canonical_authorization_level",
  "canonical_idempotency_key"
];

record.future_normalization_requirements.forEach((item, index) => {
  assertEqual(item, expectedNormalization[index], `future_normalization_requirements[${index}]`);
});

assertArray(record.future_evaluation_precedence, "future_evaluation_precedence");
assertEqual(record.future_evaluation_precedence.length, 4, "future_evaluation_precedence.length");
assertEqual(record.future_evaluation_precedence[0], "MISSING_OR_MALFORMED_REQUEST_FAIL_CLOSED", "future_evaluation_precedence[0]");
assertEqual(record.future_evaluation_precedence[1], "REQUEST_SCOPE_MISMATCH_FAIL_CLOSED", "future_evaluation_precedence[1]");
assertEqual(record.future_evaluation_precedence[2], "REQUEST_BINDING_VALID_BUT_NOT_AUTHORIZING", "future_evaluation_precedence[2]");
assertEqual(record.future_evaluation_precedence[3], "FUTURE_POLICY_AND_AUTHORITY_EVALUATION_REQUIRED", "future_evaluation_precedence[3]");

assertEqual(record.recommended_next_step.program, "PROG-289", "recommended_next_step.program");
assertEqual(record.recommended_next_step.title, "HBCE Authority Reference Binding Draft v001", "recommended_next_step.title");
assertEqual(record.recommended_next_step.object_id, "HBCE-AUTHORITY-REFERENCE-BINDING-DRAFT-V001", "recommended_next_step.object_id");

assertBooleanMap(record.explicit_non_claims, true, 16, "explicit_non_claims");
assertBooleanMap(record.no_execution_boundary, false, 16, "no_execution_boundary");

assertEqual(record.expected_cli_marker, "ACCESS_AUTHORIZATION_REQUEST_BINDING_DRAFT=PASS", "expected_cli_marker");
assertEqual(record.expected_result.source_chain_entry_count, 6, "expected_result.source_chain_entry_count");
assertEqual(record.expected_result.required_request_field_count, 14, "expected_result.required_request_field_count");
assertEqual(record.expected_result.binding_rule_count, 9, "expected_result.binding_rule_count");
assertEqual(record.expected_result.future_normalization_requirement_count, 14, "expected_result.future_normalization_requirement_count");
assertEqual(record.expected_result.recommended_next_program, "PROG-289", "expected_result.recommended_next_program");
assertEqual(record.expected_result.recommended_next_object_id, "HBCE-AUTHORITY-REFERENCE-BINDING-DRAFT-V001", "expected_result.recommended_next_object_id");
assertEqual(record.expected_result.required_non_claim_count, 16, "expected_result.required_non_claim_count");
assertEqual(record.expected_result.required_no_execution_boundary_count, 16, "expected_result.required_no_execution_boundary_count");
assertEqual(record.expected_result.runtime_gate_implemented, false, "expected_result.runtime_gate_implemented");
assertEqual(record.expected_result.runtime_gate_enabled, false, "expected_result.runtime_gate_enabled");
assertEqual(record.expected_result.positive_authorization_contract_issued, false, "expected_result.positive_authorization_contract_issued");
assertEqual(record.expected_result.authorization_decision_created, false, "expected_result.authorization_decision_created");
assertEqual(record.expected_result.request_approved, false, "expected_result.request_approved");
assertEqual(record.expected_result.access_granted, false, "expected_result.access_granted");
assertEqual(record.expected_result.dispatch_authorized, false, "expected_result.dispatch_authorized");
assertEqual(record.expected_result.execution_authorized, false, "expected_result.execution_authorized");
assertEqual(record.expected_result.effect_evidence_created, false, "expected_result.effect_evidence_created");
assertEqual(record.expected_result.legal_certification_created, false, "expected_result.legal_certification_created");
assertEqual(record.expected_result.result, "PASS_ACCESS_AUTHORIZATION_REQUEST_BINDING_DRAFT", "expected_result.result");
assertEqual(record.result, "PASS_ACCESS_AUTHORIZATION_REQUEST_BINDING_DRAFT_CREATED", "result");

const summary = {
  marker: "ACCESS_AUTHORIZATION_REQUEST_BINDING_DRAFT=PASS",
  object_id: record.object_id,
  basis_marker: record.basis_marker,
  basis_main_commit: record.basis_main_commit,
  basis_discovery: record.basis_discovery,
  source_chain_entry_count: record.source_chain_entry_count,
  required_request_field_count: record.required_request_field_count,
  binding_rule_count: record.binding_rule_count,
  future_normalization_requirement_count: record.future_normalization_requirement_count,
  recommended_next_program: record.recommended_next_step.program,
  recommended_next_object_id: record.recommended_next_step.object_id,
  required_non_claim_count: Object.keys(record.explicit_non_claims).length,
  required_no_execution_boundary_count: Object.keys(record.no_execution_boundary).length,
  runtime_gate_implemented: false,
  runtime_gate_enabled: false,
  positive_authorization_contract_issued: false,
  authorization_decision_created: false,
  request_approved: false,
  access_granted: false,
  dispatch_authorized: false,
  execution_authorized: false,
  effect_evidence_created: false,
  legal_certification_created: false,
  result: "PASS_ACCESS_AUTHORIZATION_REQUEST_BINDING_DRAFT"
};

console.log(JSON.stringify(summary, null, 2));
console.log("ACCESS_AUTHORIZATION_REQUEST_BINDING_DRAFT=PASS");
