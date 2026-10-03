#!/usr/bin/env node
"use strict";

const fs = require("fs");

const schemaPath = "schemas/evidence/hbce-access-authorization-record-hardened.schema.v001.json";
const manifestPath = "evidence/authorization/20261003_HBCE_ACCESS_AUTHORIZATION_RECORD_SCHEMA_HARDENING_v001.json";

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
  if (!Array.isArray(value)) fail(`${label} must be array`);
}

function assertIncludes(array, value, label) {
  if (!array.includes(value)) fail(`${label} missing ${value}`);
}

function assertUnique(array, label) {
  const seen = new Set();
  for (const item of array) {
    if (seen.has(item)) fail(`${label} duplicate value: ${item}`);
    seen.add(item);
  }
}

function verifySourceEntry(entry, index) {
  assertEqual(entry.sequence, index + 1, `source_chain[${index}].sequence`);
  if (!entry.object_id) fail(`source_chain[${index}].object_id missing`);
  if (!entry.source_type) fail(`source_chain[${index}].source_type missing`);
  if (!entry.json) fail(`source_chain[${index}].json missing`);
  if (!entry.expected_marker) fail(`source_chain[${index}].expected_marker missing`);

  const text = readText(entry.json);

  if (!text.includes(entry.object_id)) {
    fail(`source_chain[${index}] object_id not found in source JSON: ${entry.object_id}`);
  }

  if (!text.includes(entry.expected_marker)) {
    fail(`source_chain[${index}] expected marker not found in source JSON: ${entry.expected_marker}`);
  }
}

const schema = parseJson(schemaPath);
const manifest = parseJson(manifestPath);

assertEqual(schema.$schema, "https://json-schema.org/draft/2020-12/schema", "schema.$schema");
assertEqual(schema.$id, "hbce-access-authorization-record-hardened.schema.v001.json", "schema.$id");
assertEqual(schema.title, "HBCE Access Authorization Record Hardened Schema v001", "schema.title");
assertEqual(schema.type, "object", "schema.type");
assertFalse(schema.additionalProperties, "schema.additionalProperties");
assertArray(schema.required, "schema.required");
assertEqual(schema.required.length, 20, "schema.required.length");
assertEqual(schema.properties.expected_result.properties.required_field_count.const, 20, "schema expected_result required_field_count const");

const requiredFields = [
  "object_id",
  "record_id",
  "artifact_type",
  "version",
  "status",
  "classification",
  "basis_marker",
  "basis_main_commit",
  "decision_scope",
  "authorization_level",
  "record_mode",
  "decision_outcome",
  "allowed_decision_outcomes",
  "required_bindings",
  "record_boundary",
  "explicit_non_claims",
  "no_execution_boundary",
  "expected_cli_marker",
  "expected_result",
  "result"
];

for (const field of requiredFields) {
  assertIncludes(schema.required, field, "schema.required");
  if (!(field in manifest)) fail(`manifest missing hardened required field: ${field}`);
}

assertUnique(schema.required, "schema.required");

assertEqual(manifest.object_id, "HBCE-ACCESS-AUTHORIZATION-RECORD-SCHEMA-HARDENING-V001", "manifest.object_id");
assertEqual(manifest.record_id, "HBCE-ACCESS-AUTHORIZATION-RECORD-SCHEMA-HARDENING-V001", "manifest.record_id");
assertEqual(manifest.schema_hardening_id, "HBCE-ACCESS-AUTHORIZATION-RECORD-SCHEMA-HARDENING-V001", "manifest.schema_hardening_id");
assertEqual(manifest.artifact_type, "HBCEAccessAuthorizationRecordSchemaHardening", "manifest.artifact_type");
assertEqual(manifest.version, "v001", "manifest.version");
assertEqual(manifest.status, "ACTIVE_ACCESS_AUTHORIZATION_RECORD_SCHEMA_HARDENING", "manifest.status");
assertEqual(manifest.classification, "R_AND_D_ACCESS_AUTHORIZATION_RECORD_SCHEMA_HARDENING_ONLY", "manifest.classification");
assertEqual(manifest.basis_marker, "HBCE_RUNTIME_ACCESS_GATE_DRAFT_FINAL_AUDIT=1", "manifest.basis_marker");
assertEqual(manifest.basis_main_commit, "25f3d7b3d4c38661d71973dce4d77c9fea50052d", "manifest.basis_main_commit");
assertEqual(manifest.decision_scope, "ACCESS_AUTHORIZATION", "manifest.decision_scope");
assertEqual(manifest.authorization_level, "ACCESS_ONLY", "manifest.authorization_level");
assertEqual(manifest.record_mode, "CONTROLLED_SCHEMA_HARDENING_ONLY", "manifest.record_mode");
assertEqual(manifest.decision_outcome, "SCHEMA_HARDENING_RECORD_ONLY", "manifest.decision_outcome");
assertEqual(manifest.schema_file, schemaPath, "manifest.schema_file");
assertEqual(manifest.expected_cli_marker, "ACCESS_AUTHORIZATION_RECORD_SCHEMA_HARDENING=PASS", "manifest.expected_cli_marker");

const expectedOutcomes = [
  "ACCESS_AUTHORIZATION_APPROVED_RECORD_ONLY",
  "ACCESS_AUTHORIZATION_DENIED_RECORD_ONLY",
  "ACCESS_AUTHORIZATION_UNKNOWN_FAIL_CLOSED_RECORD_ONLY",
  "RUNTIME_ACCESS_GATE_ALLOW_RECORD_ONLY",
  "RUNTIME_ACCESS_GATE_DENY_RECORD_ONLY",
  "RUNTIME_ACCESS_GATE_UNKNOWN_FAIL_CLOSED_RECORD_ONLY",
  "SCHEMA_HARDENING_RECORD_ONLY"
];

assertArray(manifest.allowed_decision_outcomes, "manifest.allowed_decision_outcomes");
assertEqual(JSON.stringify(manifest.allowed_decision_outcomes), JSON.stringify(expectedOutcomes), "manifest.allowed_decision_outcomes");
assertUnique(manifest.allowed_decision_outcomes, "manifest.allowed_decision_outcomes");
assertIncludes(manifest.allowed_decision_outcomes, manifest.decision_outcome, "manifest.allowed_decision_outcomes");

const schemaOutcomeEnum = schema.properties.decision_outcome.enum;
assertEqual(JSON.stringify(schemaOutcomeEnum), JSON.stringify(expectedOutcomes), "schema decision_outcome enum");
assertEqual(JSON.stringify(schema.properties.allowed_decision_outcomes.items.enum), JSON.stringify(expectedOutcomes), "schema allowed_decision_outcomes enum");

assertArray(manifest.source_chain, "manifest.source_chain");
assertEqual(manifest.source_chain.length, 4, "manifest.source_chain.length");
assertEqual(manifest.expected_result.source_chain_entry_count, 4, "manifest.expected_result.source_chain_entry_count");

const expectedSourceIds = [
  "HBCE-ACCESS-AUTHORIZATION-DECISION-RECORD-DRAFT-V001",
  "HBCE-AUTHORIZATION-DECISION-RECORD-EVALUATION-HARNESS-V001",
  "HBCE-ACCESS-AUTHORIZATION-RECORD-PUBLIC-INDEX-V001",
  "HBCE-RUNTIME-ACCESS-GATE-DRAFT-V001"
];

assertEqual(JSON.stringify(manifest.source_chain.map((entry) => entry.object_id)), JSON.stringify(expectedSourceIds), "manifest.source_chain object ids");

manifest.source_chain.forEach((entry, index) => verifySourceEntry(entry, index));

assertTrue(manifest.required_bindings.request_binding_required, "required_bindings.request_binding_required");
assertTrue(manifest.required_bindings.authority_ref_required, "required_bindings.authority_ref_required");
assertTrue(manifest.required_bindings.policy_evaluation_required, "required_bindings.policy_evaluation_required");
assertTrue(manifest.required_bindings.access_authorization_predicate_required, "required_bindings.access_authorization_predicate_required");
assertTrue(manifest.required_bindings.access_authorization_decision_record_required, "required_bindings.access_authorization_decision_record_required");
assertTrue(manifest.required_bindings.positive_authorization_contract_required_for_allow, "required_bindings.positive_authorization_contract_required_for_allow");
assertTrue(manifest.required_bindings.runtime_gate_required_for_runtime_record, "required_bindings.runtime_gate_required_for_runtime_record");
assertTrue(manifest.required_bindings.decision_actor_required, "required_bindings.decision_actor_required");
assertEqual(manifest.required_bindings.decision_scope_required, "ACCESS_AUTHORIZATION", "required_bindings.decision_scope_required");
assertEqual(manifest.required_bindings.authorization_level_required, "ACCESS_ONLY", "required_bindings.authorization_level_required");

assertTrue(manifest.record_boundary.record_only, "record_boundary.record_only");
for (const [key, value] of Object.entries(manifest.record_boundary)) {
  if (key !== "record_only") assertFalse(value, `record_boundary.${key}`);
}

assertEqual(manifest.explicit_non_claims.does_not_claim_runtime_gate_implemented, true, "explicit_non_claims.does_not_claim_runtime_gate_implemented");
assertEqual(manifest.explicit_non_claims.does_not_claim_runtime_gate_enabled, true, "explicit_non_claims.does_not_claim_runtime_gate_enabled");
assertEqual(manifest.explicit_non_claims.does_not_claim_access_granted, true, "explicit_non_claims.does_not_claim_access_granted");
assertEqual(manifest.explicit_non_claims.does_not_claim_dispatch_authorization, true, "explicit_non_claims.does_not_claim_dispatch_authorization");
assertEqual(manifest.explicit_non_claims.does_not_claim_execution_authorization, true, "explicit_non_claims.does_not_claim_execution_authorization");
assertEqual(manifest.explicit_non_claims.does_not_claim_production_authorization_service, true, "explicit_non_claims.does_not_claim_production_authorization_service");
assertEqual(manifest.explicit_non_claims.does_not_claim_onboarding_execution, true, "explicit_non_claims.does_not_claim_onboarding_execution");
assertEqual(manifest.explicit_non_claims.does_not_claim_identity_verification, true, "explicit_non_claims.does_not_claim_identity_verification");
assertEqual(manifest.explicit_non_claims.does_not_claim_certificate_issuance, true, "explicit_non_claims.does_not_claim_certificate_issuance");
assertEqual(manifest.explicit_non_claims.does_not_claim_target_receipt, true, "explicit_non_claims.does_not_claim_target_receipt");
assertEqual(manifest.explicit_non_claims.does_not_claim_execution_trace, true, "explicit_non_claims.does_not_claim_execution_trace");
assertEqual(manifest.explicit_non_claims.does_not_claim_effect_evidence, true, "explicit_non_claims.does_not_claim_effect_evidence");
assertEqual(manifest.explicit_non_claims.does_not_claim_legal_certification, true, "explicit_non_claims.does_not_claim_legal_certification");

for (const [key, value] of Object.entries(manifest.explicit_non_claims)) {
  assertTrue(value, `explicit_non_claims.${key}`);
}

for (const [key, value] of Object.entries(manifest.no_execution_boundary)) {
  assertFalse(value, `no_execution_boundary.${key}`);
}

assertEqual(Object.keys(manifest.explicit_non_claims).length, 13, "explicit_non_claims count");
assertEqual(Object.keys(manifest.no_execution_boundary).length, 13, "no_execution_boundary count");

assertArray(manifest.schema_hardening_controls, "manifest.schema_hardening_controls");
assertEqual(manifest.schema_hardening_controls.length, 6, "manifest.schema_hardening_controls.length");
assertEqual(JSON.stringify(manifest.schema_hardening_controls.map((entry) => entry.control_id)), JSON.stringify([
  "AAR-SH-001",
  "AAR-SH-002",
  "AAR-SH-003",
  "AAR-SH-004",
  "AAR-SH-005",
  "AAR-SH-006"
]), "schema_hardening_controls ids");

for (const control of manifest.schema_hardening_controls) {
  if (!control.name) fail(`${control.control_id}.name missing`);
  if (!control.requirement) fail(`${control.control_id}.requirement missing`);
}

assertEqual(manifest.expected_result.required_field_count, 20, "expected_result.required_field_count");
assertEqual(manifest.expected_result.allowed_decision_outcome_count, 7, "expected_result.allowed_decision_outcome_count");
assertEqual(manifest.expected_result.required_non_claim_count, 13, "expected_result.required_non_claim_count");
assertEqual(manifest.expected_result.required_no_execution_boundary_count, 13, "expected_result.required_no_execution_boundary_count");
assertEqual(manifest.expected_result.schema_hardening_control_count, 6, "expected_result.schema_hardening_control_count");
assertEqual(manifest.expected_result.source_chain_entry_count, 4, "expected_result.source_chain_entry_count");
assertEqual(manifest.expected_result.result, "PASS_ACCESS_AUTHORIZATION_RECORD_SCHEMA_HARDENING", "expected_result.result");
assertEqual(manifest.result, "PASS_ACCESS_AUTHORIZATION_RECORD_SCHEMA_HARDENING_CREATED", "manifest.result");

console.log(JSON.stringify({
  marker: "ACCESS_AUTHORIZATION_RECORD_SCHEMA_HARDENING=PASS",
  schema_hardening_id: manifest.schema_hardening_id,
  decision_scope: manifest.decision_scope,
  authorization_level: manifest.authorization_level,
  record_mode: manifest.record_mode,
  required_field_count: manifest.expected_result.required_field_count,
  allowed_decision_outcome_count: manifest.allowed_decision_outcomes.length,
  required_non_claim_count: Object.keys(manifest.explicit_non_claims).length,
  required_no_execution_boundary_count: Object.keys(manifest.no_execution_boundary).length,
  schema_hardening_control_count: manifest.schema_hardening_controls.length,
  source_chain_entry_count: manifest.source_chain.length,
  runtime_gate_implemented: false,
  runtime_gate_enabled: false,
  access_granted: false,
  dispatch_authorized: false,
  execution_authorized: false,
  production_authorization_service_enabled: false,
  execution_trace_created: false,
  effect_evidence_created: false,
  legal_certification_created: false,
  result: "PASS_ACCESS_AUTHORIZATION_RECORD_SCHEMA_HARDENING"
}, null, 2));
console.log("ACCESS_AUTHORIZATION_RECORD_SCHEMA_HARDENING=PASS");
