#!/usr/bin/env node
"use strict";

const fs = require("fs");

const contractPath = "evidence/authorization/20261004_HBCE_POSITIVE_AUTHORIZATION_CONTRACT_DRAFT_v001.json";

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

const contract = parseJson(contractPath);

assertEqual(contract.object_id, "HBCE-POSITIVE-AUTHORIZATION-CONTRACT-DRAFT-V001", "object_id");
assertEqual(contract.record_id, "HBCE-POSITIVE-AUTHORIZATION-CONTRACT-DRAFT-V001", "record_id");
assertEqual(contract.artifact_type, "HBCEPositiveAuthorizationContractDraft", "artifact_type");
assertEqual(contract.version, "v001", "version");
assertEqual(contract.status, "ACTIVE_POSITIVE_AUTHORIZATION_CONTRACT_DRAFT", "status");
assertEqual(contract.classification, "R_AND_D_POSITIVE_AUTHORIZATION_CONTRACT_DRAFT_ONLY", "classification");
assertEqual(contract.basis_marker, "HBCE_RUNTIME_ACCESS_GATE_INTEGRATION_BOUNDARY_DRAFT_FINAL_AUDIT=1", "basis_marker");
assertEqual(contract.basis_main_commit, "30ed533484318d80c26b708958b56fd23b86f30c", "basis_main_commit");
assertEqual(contract.decision_scope, "ACCESS_AUTHORIZATION", "decision_scope");
assertEqual(contract.authorization_level, "ACCESS_ONLY", "authorization_level");
assertEqual(contract.contract_mode, "DRAFT_RECORD_ONLY", "contract_mode");
assertEqual(contract.contract_state, "NOT_IMPLEMENTED_NOT_ISSUED_NOT_EXECUTABLE", "contract_state");
assertEqual(contract.expected_cli_marker, "POSITIVE_AUTHORIZATION_CONTRACT_DRAFT=PASS", "expected_cli_marker");
assertEqual(contract.result, "PASS_POSITIVE_AUTHORIZATION_CONTRACT_DRAFT_CREATED", "result");

assertArray(contract.source_chain, "source_chain");
assertArray(contract.contract_bindings, "contract_bindings");
assertArray(contract.positive_conditions, "positive_conditions");
assertArray(contract.failure_precedence, "failure_precedence");
assertArray(contract.allowed_contract_outcomes, "allowed_contract_outcomes");
assertArray(contract.future_runtime_export_fields, "future_runtime_export_fields");

assertEqual(contract.source_chain_entry_count, 10, "source_chain_entry_count");
assertEqual(contract.source_chain.length, 10, "source_chain.length");
assertEqual(contract.contract_binding_count, 12, "contract_binding_count");
assertEqual(contract.contract_bindings.length, 12, "contract_bindings.length");
assertEqual(contract.positive_condition_count, 13, "positive_condition_count");
assertEqual(contract.positive_conditions.length, 13, "positive_conditions.length");
assertEqual(contract.allowed_contract_outcome_count, 3, "allowed_contract_outcome_count");
assertEqual(contract.allowed_contract_outcomes.length, 3, "allowed_contract_outcomes.length");
assertEqual(contract.future_runtime_export_field_count, 14, "future_runtime_export_field_count");
assertEqual(contract.future_runtime_export_fields.length, 14, "future_runtime_export_fields.length");

assertDeepEqual(contract.source_chain.map((entry) => entry.sequence), [1,2,3,4,5,6,7,8,9,10], "source_chain sequence");
assertUnique(contract.source_chain.map((entry) => entry.object_id), "source_chain object ids");
assertUnique(contract.source_chain.map((entry) => entry.path), "source_chain paths");

const expectedSourceObjects = [
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
];

assertDeepEqual(contract.source_chain.map((entry) => entry.object_id), expectedSourceObjects, "source_chain object order");

for (const entry of contract.source_chain) {
  const text = readText(entry.path);
  if (!text.includes(entry.object_id)) fail(`${entry.path} missing object_id ${entry.object_id}`);
  if (!text.includes(entry.expected_marker)) fail(`${entry.path} missing marker ${entry.expected_marker}`);
}

const expectedBindings = [
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
];

assertDeepEqual(contract.contract_bindings, expectedBindings, "contract_bindings");
assertUnique(contract.contract_bindings, "contract_bindings");

const expectedConditions = [
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
];

assertDeepEqual(contract.positive_conditions.map((entry) => entry.condition_id), expectedConditions, "positive condition order");
assertUnique(contract.positive_conditions.map((entry) => entry.condition_id), "positive condition ids");

for (const condition of contract.positive_conditions) {
  if (!condition.condition) fail(`${condition.condition_id} missing condition text`);
  assertEqual(condition.required_outcome, "MUST_PASS", `${condition.condition_id}.required_outcome`);
}

assertDeepEqual(contract.failure_precedence, [
  "UNKNOWN_FAIL_CLOSED",
  "DENY",
  "NO_POSITIVE_CONTRACT",
  "ALLOW_RECORD_ONLY"
], "failure_precedence");

assertDeepEqual(contract.allowed_contract_outcomes, [
  "POSITIVE_AUTHORIZATION_CONTRACT_SATISFIED_RECORD_ONLY",
  "POSITIVE_AUTHORIZATION_CONTRACT_DENIED_RECORD_ONLY",
  "POSITIVE_AUTHORIZATION_CONTRACT_UNKNOWN_FAIL_CLOSED_RECORD_ONLY"
], "allowed_contract_outcomes");

assertDeepEqual(contract.future_runtime_export_fields, [
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
], "future_runtime_export_fields");

assertEqual(Object.keys(contract.explicit_non_claims).length, 13, "explicit_non_claims count");
assertEqual(Object.keys(contract.no_execution_boundary).length, 14, "no_execution_boundary count");

for (const [key, value] of Object.entries(contract.explicit_non_claims)) {
  assertTrue(value, `explicit_non_claims.${key}`);
}

for (const [key, value] of Object.entries(contract.no_execution_boundary)) {
  assertFalse(value, `no_execution_boundary.${key}`);
}

assertEqual(contract.expected_result.source_chain_entry_count, 10, "expected_result.source_chain_entry_count");
assertEqual(contract.expected_result.contract_binding_count, 12, "expected_result.contract_binding_count");
assertEqual(contract.expected_result.positive_condition_count, 13, "expected_result.positive_condition_count");
assertEqual(contract.expected_result.allowed_contract_outcome_count, 3, "expected_result.allowed_contract_outcome_count");
assertEqual(contract.expected_result.future_runtime_export_field_count, 14, "expected_result.future_runtime_export_field_count");
assertEqual(contract.expected_result.required_non_claim_count, 13, "expected_result.required_non_claim_count");
assertEqual(contract.expected_result.required_no_execution_boundary_count, 14, "expected_result.required_no_execution_boundary_count");
assertFalse(contract.expected_result.runtime_gate_implemented, "expected_result.runtime_gate_implemented");
assertFalse(contract.expected_result.runtime_gate_enabled, "expected_result.runtime_gate_enabled");
assertFalse(contract.expected_result.positive_authorization_contract_issued, "expected_result.positive_authorization_contract_issued");
assertFalse(contract.expected_result.access_granted, "expected_result.access_granted");
assertFalse(contract.expected_result.dispatch_authorized, "expected_result.dispatch_authorized");
assertFalse(contract.expected_result.execution_authorized, "expected_result.execution_authorized");
assertFalse(contract.expected_result.effect_evidence_created, "expected_result.effect_evidence_created");
assertFalse(contract.expected_result.legal_certification_created, "expected_result.legal_certification_created");
assertEqual(contract.expected_result.result, "PASS_POSITIVE_AUTHORIZATION_CONTRACT_DRAFT", "expected_result.result");

console.log(JSON.stringify({
  marker: "POSITIVE_AUTHORIZATION_CONTRACT_DRAFT=PASS",
  contract_id: contract.object_id,
  basis_marker: contract.basis_marker,
  basis_main_commit: contract.basis_main_commit,
  decision_scope: contract.decision_scope,
  authorization_level: contract.authorization_level,
  contract_mode: contract.contract_mode,
  contract_state: contract.contract_state,
  source_chain_entry_count: contract.source_chain_entry_count,
  contract_binding_count: contract.contract_binding_count,
  positive_condition_count: contract.positive_condition_count,
  allowed_contract_outcome_count: contract.allowed_contract_outcome_count,
  future_runtime_export_field_count: contract.future_runtime_export_field_count,
  required_non_claim_count: Object.keys(contract.explicit_non_claims).length,
  required_no_execution_boundary_count: Object.keys(contract.no_execution_boundary).length,
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
  source_chain: contract.source_chain.map((entry) => ({
    sequence: entry.sequence,
    object_id: entry.object_id,
    expected_marker: entry.expected_marker
  })),
  positive_conditions: contract.positive_conditions.map((entry) => ({
    condition_id: entry.condition_id,
    required_outcome: entry.required_outcome
  })),
  allowed_contract_outcomes: contract.allowed_contract_outcomes,
  failure_precedence: contract.failure_precedence,
  result: "PASS_POSITIVE_AUTHORIZATION_CONTRACT_DRAFT"
}, null, 2));

console.log("POSITIVE_AUTHORIZATION_CONTRACT_DRAFT=PASS");
