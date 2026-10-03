#!/usr/bin/env node
"use strict";

const fs = require("fs");

const gatePath = "evidence/authorization/20261003_HBCE_RUNTIME_ACCESS_GATE_DRAFT_v001.json";

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

function assertArray(value, label) {
  if (!Array.isArray(value)) fail(`${label} must be an array`);
}

function assertSequential(entries, label) {
  assertArray(entries, label);
  const seen = new Set();
  entries.forEach((entry, index) => {
    assertEqual(entry.sequence, index + 1, `${label}[${index}].sequence`);
    if (seen.has(entry.object_id)) fail(`${label} duplicate object_id: ${entry.object_id}`);
    seen.add(entry.object_id);
  });
}

function verifySourceEntry(entry, label) {
  if (!entry.object_id) fail(`${label}.object_id missing`);
  if (!entry.source_type) fail(`${label}.source_type missing`);
  if (!entry.json) fail(`${label}.json missing`);
  if (!entry.expected_marker) fail(`${label}.expected_marker missing`);

  const text = readText(entry.json);

  if (!text.includes(entry.object_id)) {
    fail(`${label}: object_id not found in source JSON: ${entry.object_id}`);
  }

  if (!text.includes(entry.expected_marker)) {
    fail(`${label}: expected marker not found in source JSON: ${entry.expected_marker}`);
  }
}

const gate = parseJson(gatePath);

assertEqual(gate.object_id, "HBCE-RUNTIME-ACCESS-GATE-DRAFT-V001", "gate.object_id");
assertEqual(gate.gate_id, "HBCE-RUNTIME-ACCESS-GATE-DRAFT-V001", "gate.gate_id");
assertEqual(gate.artifact_type, "HBCERuntimeAccessGateDraft", "gate.artifact_type");
assertEqual(gate.version, "v001", "gate.version");
assertEqual(gate.status, "ACTIVE_RUNTIME_ACCESS_GATE_DRAFT", "gate.status");
assertEqual(gate.classification, "R_AND_D_RUNTIME_ACCESS_GATE_DRAFT_ONLY", "gate.classification");
assertEqual(gate.basis_marker, "HBCE_ACCESS_AUTHORIZATION_RECORD_PUBLIC_INDEX_REFRESH_FINAL_AUDIT=1", "gate.basis_marker");
assertEqual(gate.basis_main_commit, "b8caaa2892b6387244ae2eecf06bbd363d9b210a", "gate.basis_main_commit");
assertEqual(gate.decision_scope, "ACCESS_AUTHORIZATION", "gate.decision_scope");
assertEqual(gate.authorization_level, "ACCESS_ONLY", "gate.authorization_level");
assertEqual(gate.gate_mode, "CONTROLLED_DRAFT_RECORD_ONLY", "gate.gate_mode");
assertEqual(gate.expected_cli_marker, "RUNTIME_ACCESS_GATE_DRAFT=PASS", "gate.expected_cli_marker");

assertArray(gate.source_chain, "gate.source_chain");
assertArray(gate.gate_outcomes, "gate.gate_outcomes");
assertArray(gate.gate_rules, "gate.gate_rules");
assertArray(gate.precedence, "gate.precedence");

assertEqual(gate.source_chain.length, 6, "gate.source_chain.length");
assertEqual(gate.gate_rules.length, 8, "gate.gate_rules.length");
assertEqual(gate.gate_outcomes.length, 3, "gate.gate_outcomes.length");
assertEqual(gate.expected_result.source_chain_entry_count, 6, "gate.expected_result.source_chain_entry_count");
assertEqual(gate.expected_result.gate_rule_count, 8, "gate.expected_result.gate_rule_count");
assertEqual(gate.expected_result.gate_outcome_count, 3, "gate.expected_result.gate_outcome_count");
assertEqual(gate.expected_result.result, "PASS_RUNTIME_ACCESS_GATE_DRAFT", "gate.expected_result.result");

assertSequential(gate.source_chain, "gate.source_chain");

const expectedSourceIds = [
  "HBCE-ACCESS-AUTHORIZATION-PREDICATE-DRAFT-V001",
  "HBCE-ACCESS-AUTHORIZATION-PREDICATE-EVALUATION-HARNESS-V001",
  "HBCE-ACCESS-AUTHORIZATION-DECISION-RECORD-DRAFT-V001",
  "HBCE-AUTHORIZATION-DECISION-RECORD-EVALUATION-HARNESS-V001",
  "HBCE-ACCESS-AUTHORIZATION-RECORD-PUBLIC-INDEX-V001",
  "HBCE-ACCESS-AUTHORIZATION-RECORD-PUBLIC-INDEX-REFRESH-V001"
];

assertEqual(JSON.stringify(gate.source_chain.map((entry) => entry.object_id)), JSON.stringify(expectedSourceIds), "gate.source_chain ids");

for (let index = 0; index < gate.source_chain.length; index += 1) {
  verifySourceEntry(gate.source_chain[index], `gate.source_chain[${index}]`);
}

assertTrue(gate.gate_inputs.request_binding_required, "gate.gate_inputs.request_binding_required");
assertTrue(gate.gate_inputs.authority_ref_required, "gate.gate_inputs.authority_ref_required");
assertTrue(gate.gate_inputs.policy_evaluation_required, "gate.gate_inputs.policy_evaluation_required");
assertTrue(gate.gate_inputs.access_authorization_predicate_required, "gate.gate_inputs.access_authorization_predicate_required");
assertTrue(gate.gate_inputs.access_authorization_decision_record_required, "gate.gate_inputs.access_authorization_decision_record_required");
assertTrue(gate.gate_inputs.positive_authorization_contract_required_for_allow, "gate.gate_inputs.positive_authorization_contract_required_for_allow");
assertTrue(gate.gate_inputs.decision_actor_required, "gate.gate_inputs.decision_actor_required");
assertEqual(gate.gate_inputs.decision_scope_required, "ACCESS_AUTHORIZATION", "gate.gate_inputs.decision_scope_required");
assertEqual(gate.gate_inputs.authorization_level_required, "ACCESS_ONLY", "gate.gate_inputs.authorization_level_required");

const expectedOutcomes = [
  "RUNTIME_ACCESS_GATE_ALLOW_RECORD_ONLY",
  "RUNTIME_ACCESS_GATE_DENY_RECORD_ONLY",
  "RUNTIME_ACCESS_GATE_UNKNOWN_FAIL_CLOSED_RECORD_ONLY"
];

assertEqual(JSON.stringify(gate.gate_outcomes.map((entry) => entry.outcome)), JSON.stringify(expectedOutcomes), "gate.gate_outcomes");

for (const outcome of gate.gate_outcomes) {
  assertFalse(outcome.access_granted, `${outcome.outcome}.access_granted`);
  assertFalse(outcome.dispatch_authorized, `${outcome.outcome}.dispatch_authorized`);
  assertFalse(outcome.execution_authorized, `${outcome.outcome}.execution_authorized`);
  assertFalse(outcome.production_authorization_service_enabled, `${outcome.outcome}.production_authorization_service_enabled`);
}

const expectedRules = [
  "RAG-001",
  "RAG-002",
  "RAG-003",
  "RAG-004",
  "RAG-005",
  "RAG-006",
  "RAG-007",
  "RAG-008"
];

assertEqual(JSON.stringify(gate.gate_rules.map((entry) => entry.rule_id)), JSON.stringify(expectedRules), "gate.gate_rules ids");

for (const rule of gate.gate_rules) {
  if (!rule.name) fail(`${rule.rule_id}.name missing`);
  if (!rule.condition) fail(`${rule.rule_id}.condition missing`);
  if (!expectedOutcomes.includes(rule.on_failure)) fail(`${rule.rule_id}.on_failure invalid: ${rule.on_failure}`);
}

assertEqual(JSON.stringify(gate.precedence), JSON.stringify([
  "RUNTIME_ACCESS_GATE_UNKNOWN_FAIL_CLOSED_RECORD_ONLY",
  "RUNTIME_ACCESS_GATE_DENY_RECORD_ONLY",
  "RUNTIME_ACCESS_GATE_ALLOW_RECORD_ONLY"
]), "gate.precedence");

for (const [key, value] of Object.entries(gate.runtime_activation)) {
  assertFalse(value, `gate.runtime_activation.${key}`);
}

for (const [key, value] of Object.entries(gate.explicit_non_claims)) {
  assertTrue(value, `gate.explicit_non_claims.${key}`);
}

for (const [key, value] of Object.entries(gate.no_execution_boundary)) {
  assertFalse(value, `gate.no_execution_boundary.${key}`);
}

assertFalse(gate.runtime_activation.runtime_gate_implemented, "gate.runtime_activation.runtime_gate_implemented");
assertFalse(gate.runtime_activation.runtime_gate_enabled, "gate.runtime_activation.runtime_gate_enabled");
assertFalse(gate.runtime_activation.production_authorization_service_enabled, "gate.runtime_activation.production_authorization_service_enabled");
assertFalse(gate.runtime_activation.access_grant_capability_enabled, "gate.runtime_activation.access_grant_capability_enabled");
assertFalse(gate.runtime_activation.dispatch_capability_enabled, "gate.runtime_activation.dispatch_capability_enabled");
assertFalse(gate.runtime_activation.execution_capability_enabled, "gate.runtime_activation.execution_capability_enabled");
assertFalse(gate.runtime_activation.target_system_integration_enabled, "gate.runtime_activation.target_system_integration_enabled");
assertFalse(gate.runtime_activation.customer_environment_enabled, "gate.runtime_activation.customer_environment_enabled");

assertEqual(gate.result, "PASS_RUNTIME_ACCESS_GATE_DRAFT_CREATED", "gate.result");

console.log(JSON.stringify({
  marker: "RUNTIME_ACCESS_GATE_DRAFT=PASS",
  gate_id: gate.gate_id,
  decision_scope: gate.decision_scope,
  authorization_level: gate.authorization_level,
  gate_mode: gate.gate_mode,
  source_chain_entry_count: gate.source_chain.length,
  gate_rule_count: gate.gate_rules.length,
  gate_outcome_count: gate.gate_outcomes.length,
  outcomes: gate.gate_outcomes.map((entry) => entry.outcome),
  runtime_gate_implemented: false,
  runtime_gate_enabled: false,
  access_granted: false,
  dispatch_authorized: false,
  execution_authorized: false,
  production_authorization_service_enabled: false,
  execution_trace_created: false,
  effect_evidence_created: false,
  legal_certification_created: false,
  result: "PASS_RUNTIME_ACCESS_GATE_DRAFT"
}, null, 2));
console.log("RUNTIME_ACCESS_GATE_DRAFT=PASS");
