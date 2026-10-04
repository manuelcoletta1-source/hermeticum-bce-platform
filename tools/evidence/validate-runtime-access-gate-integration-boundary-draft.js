#!/usr/bin/env node
"use strict";

const fs = require("fs");

const boundaryPath = "evidence/authorization/20261004_HBCE_RUNTIME_ACCESS_GATE_INTEGRATION_BOUNDARY_DRAFT_v001.json";

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

const boundary = parseJson(boundaryPath);

assertEqual(boundary.object_id, "HBCE-RUNTIME-ACCESS-GATE-INTEGRATION-BOUNDARY-DRAFT-V001", "object_id");
assertEqual(boundary.record_id, "HBCE-RUNTIME-ACCESS-GATE-INTEGRATION-BOUNDARY-DRAFT-V001", "record_id");
assertEqual(boundary.artifact_type, "HBCERuntimeAccessGateIntegrationBoundaryDraft", "artifact_type");
assertEqual(boundary.version, "v001", "version");
assertEqual(boundary.status, "ACTIVE_RUNTIME_ACCESS_GATE_INTEGRATION_BOUNDARY_DRAFT", "status");
assertEqual(boundary.classification, "R_AND_D_RUNTIME_ACCESS_GATE_INTEGRATION_BOUNDARY_DRAFT_ONLY", "classification");
assertEqual(boundary.basis_marker, "HBCE_ACCESS_AUTHORIZATION_RECORD_PUBLIC_INDEX_REFRESH_V002_FINAL_AUDIT=1", "basis_marker");
assertEqual(boundary.basis_main_commit, "fdf0b36d394168289474fdda30308f3347b456df", "basis_main_commit");
assertEqual(boundary.decision_scope, "ACCESS_AUTHORIZATION", "decision_scope");
assertEqual(boundary.authorization_level, "ACCESS_ONLY", "authorization_level");
assertEqual(boundary.integration_mode, "BOUNDARY_DRAFT_ONLY", "integration_mode");
assertEqual(boundary.runtime_integration_state, "NOT_IMPLEMENTED_NOT_ENABLED", "runtime_integration_state");
assertEqual(boundary.expected_cli_marker, "RUNTIME_ACCESS_GATE_INTEGRATION_BOUNDARY_DRAFT=PASS", "expected_cli_marker");
assertEqual(boundary.result, "PASS_RUNTIME_ACCESS_GATE_INTEGRATION_BOUNDARY_DRAFT_CREATED", "result");

assertArray(boundary.source_chain, "source_chain");
assertArray(boundary.integration_boundary_rules, "integration_boundary_rules");
assertArray(boundary.future_integration_prerequisites, "future_integration_prerequisites");
assertArray(boundary.boundary_precedence, "boundary_precedence");
assertArray(boundary.required_future_allow_inputs, "required_future_allow_inputs");

assertEqual(boundary.source_chain_entry_count, 6, "source_chain_entry_count");
assertEqual(boundary.source_chain.length, 6, "source_chain.length");
assertEqual(boundary.integration_boundary_rule_count, 10, "integration_boundary_rule_count");
assertEqual(boundary.integration_boundary_rules.length, 10, "integration_boundary_rules.length");
assertEqual(boundary.future_integration_prerequisite_count, 12, "future_integration_prerequisite_count");
assertEqual(boundary.future_integration_prerequisites.length, 12, "future_integration_prerequisites.length");
assertEqual(boundary.required_future_allow_inputs.length, 8, "required_future_allow_inputs.length");

assertEqual(JSON.stringify(boundary.source_chain.map((entry) => entry.sequence)), JSON.stringify([1, 2, 3, 4, 5, 6]), "source_chain sequence");
assertUnique(boundary.source_chain.map((entry) => entry.object_id), "source_chain object ids");
assertUnique(boundary.source_chain.map((entry) => entry.path), "source_chain paths");
assertUnique(boundary.integration_boundary_rules.map((entry) => entry.rule_id), "integration boundary rule ids");

const expectedSourceObjects = [
  "HBCE-ACCESS-AUTHORIZATION-RECORD-PUBLIC-INDEX-REFRESH-V002",
  "HBCE-ACCESS-AUTHORIZATION-RECORD-PUBLIC-INDEX-V002",
  "HBCE-RUNTIME-ACCESS-GATE-DRAFT-V001",
  "HBCE-RUNTIME-ACCESS-GATE-EVALUATION-HARNESS-V001",
  "HBCE-ACCESS-AUTHORIZATION-RECORD-SCHEMA-HARDENING-V001",
  "HBCE-ACCESS-AUTHORIZATION-RECORD-SCHEMA-CONFORMANCE-HARNESS-V001"
];

assertEqual(JSON.stringify(boundary.source_chain.map((entry) => entry.object_id)), JSON.stringify(expectedSourceObjects), "source_chain object order");

for (const entry of boundary.source_chain) {
  const text = readText(entry.path);
  if (!text.includes(entry.object_id)) fail(`${entry.path} missing object_id ${entry.object_id}`);
  if (!text.includes(entry.expected_marker)) fail(`${entry.path} missing marker ${entry.expected_marker}`);
}

const expectedRules = [
  "IB-001-RECORD-ONLY",
  "IB-002-NO-GATE-IMPLEMENTATION",
  "IB-003-NO-GATE-ENABLEMENT",
  "IB-004-NO-ACCESS-GRANT",
  "IB-005-NO-DISPATCH",
  "IB-006-NO-EXECUTION",
  "IB-007-NO-PRODUCTION-AUTH-SERVICE",
  "IB-008-POSITIVE-CONTRACT-REQUIRED-FOR-FUTURE-ALLOW",
  "IB-009-UNKNOWN-FAIL-CLOSED",
  "IB-010-BOUNDARY-PRECEDENCE"
];

assertEqual(JSON.stringify(boundary.integration_boundary_rules.map((entry) => entry.rule_id)), JSON.stringify(expectedRules), "integration boundary rule order");

for (const rule of boundary.integration_boundary_rules) {
  if (!rule.rule) fail(`${rule.rule_id} missing rule text`);
  if (!rule.required_state) fail(`${rule.rule_id} missing required_state`);
}

const expectedPrerequisites = [
  "explicit_runtime_gate_implementation_plan",
  "positive_authorization_contract_schema",
  "request_binding_adapter",
  "authority_ref_resolver",
  "policy_evaluation_resolver",
  "access_authorization_predicate_resolver",
  "access_authorization_decision_record_resolver",
  "decision_actor_resolver",
  "scope_binding_resolver",
  "unknown_fail_closed_handler",
  "no_execution_dry_run_mode",
  "human_go_record_for_runtime_integration"
];

assertEqual(JSON.stringify(boundary.future_integration_prerequisites), JSON.stringify(expectedPrerequisites), "future_integration_prerequisites");

assertEqual(JSON.stringify(boundary.boundary_precedence), JSON.stringify([
  "RUNTIME_ACCESS_GATE_UNKNOWN_FAIL_CLOSED_RECORD_ONLY",
  "RUNTIME_ACCESS_GATE_DENY_RECORD_ONLY",
  "RUNTIME_ACCESS_GATE_ALLOW_RECORD_ONLY"
]), "boundary_precedence");

assertEqual(JSON.stringify(boundary.required_future_allow_inputs), JSON.stringify([
  "request_binding",
  "authority_ref",
  "policy_evaluation",
  "access_authorization_predicate",
  "access_authorization_decision_record",
  "positive_authorization_contract_for_allow",
  "decision_actor",
  "scope_binding"
]), "required_future_allow_inputs");

assertEqual(Object.keys(boundary.explicit_non_claims).length, 13, "explicit_non_claims count");
assertEqual(Object.keys(boundary.no_execution_boundary).length, 13, "no_execution_boundary count");

for (const [key, value] of Object.entries(boundary.explicit_non_claims)) {
  assertTrue(value, `explicit_non_claims.${key}`);
}

for (const [key, value] of Object.entries(boundary.no_execution_boundary)) {
  assertFalse(value, `no_execution_boundary.${key}`);
}

assertEqual(boundary.expected_result.source_chain_entry_count, 6, "expected_result.source_chain_entry_count");
assertEqual(boundary.expected_result.integration_boundary_rule_count, 10, "expected_result.integration_boundary_rule_count");
assertEqual(boundary.expected_result.future_integration_prerequisite_count, 12, "expected_result.future_integration_prerequisite_count");
assertEqual(boundary.expected_result.required_future_allow_input_count, 8, "expected_result.required_future_allow_input_count");
assertEqual(boundary.expected_result.required_non_claim_count, 13, "expected_result.required_non_claim_count");
assertEqual(boundary.expected_result.required_no_execution_boundary_count, 13, "expected_result.required_no_execution_boundary_count");
assertFalse(boundary.expected_result.runtime_gate_implemented, "expected_result.runtime_gate_implemented");
assertFalse(boundary.expected_result.runtime_gate_enabled, "expected_result.runtime_gate_enabled");
assertFalse(boundary.expected_result.access_granted, "expected_result.access_granted");
assertFalse(boundary.expected_result.dispatch_authorized, "expected_result.dispatch_authorized");
assertFalse(boundary.expected_result.execution_authorized, "expected_result.execution_authorized");
assertFalse(boundary.expected_result.effect_evidence_created, "expected_result.effect_evidence_created");
assertFalse(boundary.expected_result.legal_certification_created, "expected_result.legal_certification_created");
assertEqual(boundary.expected_result.result, "PASS_RUNTIME_ACCESS_GATE_INTEGRATION_BOUNDARY_DRAFT", "expected_result.result");

console.log(JSON.stringify({
  marker: "RUNTIME_ACCESS_GATE_INTEGRATION_BOUNDARY_DRAFT=PASS",
  boundary_id: boundary.object_id,
  basis_marker: boundary.basis_marker,
  basis_main_commit: boundary.basis_main_commit,
  decision_scope: boundary.decision_scope,
  authorization_level: boundary.authorization_level,
  integration_mode: boundary.integration_mode,
  runtime_integration_state: boundary.runtime_integration_state,
  source_chain_entry_count: boundary.source_chain_entry_count,
  integration_boundary_rule_count: boundary.integration_boundary_rule_count,
  future_integration_prerequisite_count: boundary.future_integration_prerequisite_count,
  required_future_allow_input_count: boundary.required_future_allow_inputs.length,
  required_non_claim_count: Object.keys(boundary.explicit_non_claims).length,
  required_no_execution_boundary_count: Object.keys(boundary.no_execution_boundary).length,
  runtime_gate_implemented: false,
  runtime_gate_enabled: false,
  access_granted: false,
  dispatch_authorized: false,
  execution_authorized: false,
  production_authorization_service_enabled: false,
  execution_trace_created: false,
  effect_evidence_created: false,
  legal_certification_created: false,
  source_chain: boundary.source_chain.map((entry) => ({
    sequence: entry.sequence,
    object_id: entry.object_id,
    expected_marker: entry.expected_marker
  })),
  integration_boundary_rules: boundary.integration_boundary_rules.map((entry) => ({
    rule_id: entry.rule_id,
    required_state: entry.required_state
  })),
  result: "PASS_RUNTIME_ACCESS_GATE_INTEGRATION_BOUNDARY_DRAFT"
}, null, 2));

console.log("RUNTIME_ACCESS_GATE_INTEGRATION_BOUNDARY_DRAFT=PASS");
