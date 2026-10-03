#!/usr/bin/env node
"use strict";

const fs = require("fs");

const harnessPath = "evidence/authorization/20261003_HBCE_ACCESS_AUTHORIZATION_RECORD_SCHEMA_CONFORMANCE_HARNESS_v001.json";
const schemaPath = "schemas/evidence/hbce-access-authorization-record-hardened.schema.v001.json";
const hardeningPath = "evidence/authorization/20261003_HBCE_ACCESS_AUTHORIZATION_RECORD_SCHEMA_HARDENING_v001.json";

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

function assertObject(value, label) {
  if (!value || typeof value !== "object" || Array.isArray(value)) fail(`${label} must be object`);
}

function assertUnique(values, label) {
  const seen = new Set();
  for (const value of values) {
    if (seen.has(value)) fail(`${label} duplicate value: ${value}`);
    seen.add(value);
  }
}

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

const harness = parseJson(harnessPath);
const schema = parseJson(schemaPath);
const hardening = parseJson(hardeningPath);

assertEqual(harness.object_id, "HBCE-ACCESS-AUTHORIZATION-RECORD-SCHEMA-CONFORMANCE-HARNESS-V001", "harness.object_id");
assertEqual(harness.record_id, "HBCE-ACCESS-AUTHORIZATION-RECORD-SCHEMA-CONFORMANCE-HARNESS-V001", "harness.record_id");
assertEqual(harness.harness_id, "HBCE-ACCESS-AUTHORIZATION-RECORD-SCHEMA-CONFORMANCE-HARNESS-V001", "harness.harness_id");
assertEqual(harness.artifact_type, "HBCEAccessAuthorizationRecordSchemaConformanceHarness", "harness.artifact_type");
assertEqual(harness.version, "v001", "harness.version");
assertEqual(harness.status, "ACTIVE_ACCESS_AUTHORIZATION_RECORD_SCHEMA_CONFORMANCE_HARNESS", "harness.status");
assertEqual(harness.classification, "R_AND_D_ACCESS_AUTHORIZATION_RECORD_SCHEMA_CONFORMANCE_HARNESS_ONLY", "harness.classification");
assertEqual(harness.basis_marker, "HBCE_ACCESS_AUTHORIZATION_RECORD_SCHEMA_HARDENING_FINAL_AUDIT=1", "harness.basis_marker");
assertEqual(harness.basis_main_commit, "d0597a5ef1564612b3fb03346e4a2b889a732240", "harness.basis_main_commit");
assertEqual(harness.decision_scope, "ACCESS_AUTHORIZATION", "harness.decision_scope");
assertEqual(harness.authorization_level, "ACCESS_ONLY", "harness.authorization_level");
assertEqual(harness.harness_mode, "CONTROLLED_SCHEMA_CONFORMANCE_HARNESS_ONLY", "harness.harness_mode");
assertEqual(harness.schema_file, schemaPath, "harness.schema_file");
assertEqual(harness.schema_hardening_manifest, hardeningPath, "harness.schema_hardening_manifest");
assertEqual(harness.expected_cli_marker, "ACCESS_AUTHORIZATION_RECORD_SCHEMA_CONFORMANCE_HARNESS=PASS", "harness.expected_cli_marker");

assertEqual(schema.title, "HBCE Access Authorization Record Hardened Schema v001", "schema.title");
assertEqual(schema.type, "object", "schema.type");
assertFalse(schema.additionalProperties, "schema.additionalProperties");
assertArray(schema.required, "schema.required");
assertEqual(schema.required.length, 20, "schema.required.length");
assertUnique(schema.required, "schema.required");

assertArray(harness.allowed_decision_outcomes, "harness.allowed_decision_outcomes");
assertEqual(JSON.stringify(harness.allowed_decision_outcomes), JSON.stringify(hardening.allowed_decision_outcomes), "harness.allowed_decision_outcomes vs hardening");
assertEqual(JSON.stringify(harness.allowed_decision_outcomes), JSON.stringify(schema.properties.decision_outcome.enum), "harness.allowed_decision_outcomes vs schema enum");
assertEqual(harness.allowed_decision_outcomes.length, 7, "harness.allowed_decision_outcomes.length");

assertArray(harness.source_chain, "harness.source_chain");
assertEqual(harness.source_chain.length, 4, "harness.source_chain.length");
assertEqual(harness.expected_result.source_chain_entry_count, 4, "harness.expected_result.source_chain_entry_count");

for (let index = 0; index < harness.source_chain.length; index += 1) {
  const entry = harness.source_chain[index];
  assertEqual(entry.sequence, index + 1, `source_chain[${index}].sequence`);
  const text = readText(entry.path);
  if (!text.includes(entry.object_id)) fail(`source_chain[${index}] missing object_id in source: ${entry.object_id}`);
  if (entry.expected_marker && !text.includes(entry.expected_marker)) fail(`source_chain[${index}] missing marker: ${entry.expected_marker}`);
  if (entry.expected_text && !text.includes(entry.expected_text)) fail(`source_chain[${index}] missing expected text: ${entry.expected_text}`);
}

assertArray(harness.conformance_cases, "harness.conformance_cases");
assertEqual(harness.conformance_cases.length, 12, "harness.conformance_cases.length");
assertEqual(harness.expected_result.conformance_case_count, 12, "expected_result.conformance_case_count");
assertEqual(harness.expected_result.positive_case_count, 2, "expected_result.positive_case_count");
assertEqual(harness.expected_result.negative_case_count, 10, "expected_result.negative_case_count");

const caseIds = harness.conformance_cases.map((entry) => entry.case_id);
assertUnique(caseIds, "conformance case ids");

function buildCanonicalRecord() {
  const record = {};
  for (const field of schema.required) {
    if (!(field in hardening)) fail(`hardening manifest missing schema required field: ${field}`);
    record[field] = clone(hardening[field]);
  }
  return record;
}

function validateRecord(record) {
  const errors = [];

  assertObject(record, "record");

  const allowedTopLevel = new Set(Object.keys(schema.properties || {}));
  for (const key of Object.keys(record)) {
    if (!allowedTopLevel.has(key)) errors.push(`additional property: ${key}`);
  }

  for (const field of schema.required) {
    if (!(field in record)) errors.push(`missing required field: ${field}`);
  }

  if (record.decision_scope !== "ACCESS_AUTHORIZATION") errors.push("decision_scope must be ACCESS_AUTHORIZATION");
  if (record.authorization_level !== "ACCESS_ONLY") errors.push("authorization_level must be ACCESS_ONLY");

  if (!schema.properties.decision_outcome.enum.includes(record.decision_outcome)) errors.push("decision_outcome not allowed");

  if (!Array.isArray(record.allowed_decision_outcomes)) {
    errors.push("allowed_decision_outcomes must be array");
  } else {
    const expected = schema.properties.allowed_decision_outcomes.items.enum;
    if (JSON.stringify(record.allowed_decision_outcomes) !== JSON.stringify(expected)) {
      errors.push("allowed_decision_outcomes does not match hardened enum");
    }
  }

  if (record.expected_result) {
    if (record.expected_result.required_field_count !== 20) errors.push("expected_result.required_field_count must be 20");
    if (record.expected_result.allowed_decision_outcome_count !== 7) errors.push("expected_result.allowed_decision_outcome_count must be 7");
    if (record.expected_result.required_non_claim_count !== 13) errors.push("expected_result.required_non_claim_count must be 13");
    if (record.expected_result.required_no_execution_boundary_count !== 13) errors.push("expected_result.required_no_execution_boundary_count must be 13");
    if (record.expected_result.result !== "PASS_ACCESS_AUTHORIZATION_RECORD_SCHEMA_HARDENING") errors.push("expected_result.result invalid");
  }

  if (record.required_bindings) {
    const bindings = record.required_bindings;
    const requiredTrue = [
      "request_binding_required",
      "authority_ref_required",
      "policy_evaluation_required",
      "access_authorization_predicate_required",
      "access_authorization_decision_record_required",
      "positive_authorization_contract_required_for_allow",
      "decision_actor_required"
    ];

    for (const key of requiredTrue) {
      if (bindings[key] !== true) errors.push(`required_bindings.${key} must be true`);
    }

    if (bindings.decision_scope_required !== "ACCESS_AUTHORIZATION") errors.push("required_bindings.decision_scope_required invalid");
    if (bindings.authorization_level_required !== "ACCESS_ONLY") errors.push("required_bindings.authorization_level_required invalid");
  }

  if (record.record_boundary) {
    if (record.record_boundary.record_only !== true) errors.push("record_boundary.record_only must be true");
    for (const [key, value] of Object.entries(record.record_boundary)) {
      if (key !== "record_only" && value !== false) errors.push(`record_boundary.${key} must be false`);
    }
  }

  if (record.explicit_non_claims) {
    if (Object.keys(record.explicit_non_claims).length !== 13) errors.push("explicit_non_claims count must be 13");
    for (const [key, value] of Object.entries(record.explicit_non_claims)) {
      if (value !== true) errors.push(`explicit_non_claims.${key} must be true`);
    }
  }

  if (record.no_execution_boundary) {
    if (Object.keys(record.no_execution_boundary).length !== 13) errors.push("no_execution_boundary count must be 13");
    for (const [key, value] of Object.entries(record.no_execution_boundary)) {
      if (value !== false) errors.push(`no_execution_boundary.${key} must be false`);
    }
  }

  return {
    pass: errors.length === 0,
    errors
  };
}

function applyMutation(record, mutation) {
  const mutated = clone(record);

  switch (mutation) {
    case "NONE":
      return mutated;

    case "SET_DECISION_OUTCOME_TO_ACCESS_AUTHORIZATION_UNKNOWN_FAIL_CLOSED_RECORD_ONLY":
      mutated.decision_outcome = "ACCESS_AUTHORIZATION_UNKNOWN_FAIL_CLOSED_RECORD_ONLY";
      return mutated;

    case "REMOVE_BASIS_MARKER":
      delete mutated.basis_marker;
      return mutated;

    case "ADD_UNDECLARED_PROPERTY":
      mutated.undeclared_runtime_authorization = true;
      return mutated;

    case "SET_DECISION_SCOPE_TO_EXECUTION_AUTHORIZATION":
      mutated.decision_scope = "EXECUTION_AUTHORIZATION";
      return mutated;

    case "SET_AUTHORIZATION_LEVEL_TO_EXECUTION":
      mutated.authorization_level = "EXECUTION";
      return mutated;

    case "SET_DECISION_OUTCOME_TO_ACCESS_GRANTED":
      mutated.decision_outcome = "ACCESS_GRANTED";
      return mutated;

    case "SET_RECORD_BOUNDARY_ACCESS_GRANTED_TRUE":
      mutated.record_boundary.access_granted = true;
      return mutated;

    case "SET_RECORD_BOUNDARY_DISPATCH_AUTHORIZED_TRUE":
      mutated.record_boundary.dispatch_authorized = true;
      return mutated;

    case "SET_RECORD_BOUNDARY_EXECUTION_AUTHORIZED_TRUE":
      mutated.record_boundary.execution_authorized = true;
      return mutated;

    case "SET_DOES_NOT_CLAIM_ACCESS_GRANTED_FALSE":
      mutated.explicit_non_claims.does_not_claim_access_granted = false;
      return mutated;

    case "SET_NO_EXECUTION_BOUNDARY_EFFECT_EVIDENCE_CREATED_TRUE":
      mutated.no_execution_boundary.effect_evidence_created = true;
      return mutated;

    default:
      fail(`unsupported conformance mutation: ${mutation}`);
  }
}

const baseRecord = buildCanonicalRecord();
const caseResults = [];

for (const testCase of harness.conformance_cases) {
  assertTrue(testCase.case_id.startsWith("CASE-"), `${testCase.case_id}.case_id prefix`);
  if (!["POSITIVE", "NEGATIVE"].includes(testCase.case_type)) fail(`${testCase.case_id}.case_type invalid`);
  if (!["PASS", "FAIL"].includes(testCase.expected_conformance)) fail(`${testCase.case_id}.expected_conformance invalid`);
  if (!testCase.mutation) fail(`${testCase.case_id}.mutation missing`);
  if (!testCase.expected_reason) fail(`${testCase.case_id}.expected_reason missing`);

  const candidate = applyMutation(baseRecord, testCase.mutation);
  const validation = validateRecord(candidate);
  const actual = validation.pass ? "PASS" : "FAIL";

  if (actual !== testCase.expected_conformance) {
    fail(`${testCase.case_id}: expected ${testCase.expected_conformance}, got ${actual}: ${validation.errors.join("; ")}`);
  }

  caseResults.push({
    case_id: testCase.case_id,
    expected_conformance: testCase.expected_conformance,
    actual_conformance: actual,
    result: "PASS"
  });
}

assertEqual(caseResults.filter((entry) => entry.actual_conformance === "PASS").length, 2, "positive actual pass count");
assertEqual(caseResults.filter((entry) => entry.actual_conformance === "FAIL").length, 10, "negative actual fail count");

assertTrue(harness.record_boundary.record_only, "harness.record_boundary.record_only");
for (const [key, value] of Object.entries(harness.record_boundary)) {
  if (key !== "record_only") assertFalse(value, `harness.record_boundary.${key}`);
}

assertEqual(Object.keys(harness.explicit_non_claims).length, 13, "harness.explicit_non_claims count");
for (const [key, value] of Object.entries(harness.explicit_non_claims)) {
  assertTrue(value, `harness.explicit_non_claims.${key}`);
}

assertEqual(Object.keys(harness.no_execution_boundary).length, 13, "harness.no_execution_boundary count");
for (const [key, value] of Object.entries(harness.no_execution_boundary)) {
  assertFalse(value, `harness.no_execution_boundary.${key}`);
}

assertEqual(harness.expected_result.required_field_count, 20, "expected_result.required_field_count");
assertEqual(harness.expected_result.allowed_decision_outcome_count, 7, "expected_result.allowed_decision_outcome_count");
assertEqual(harness.expected_result.required_non_claim_count, 13, "expected_result.required_non_claim_count");
assertEqual(harness.expected_result.required_no_execution_boundary_count, 13, "expected_result.required_no_execution_boundary_count");
assertEqual(harness.expected_result.result, "PASS_ACCESS_AUTHORIZATION_RECORD_SCHEMA_CONFORMANCE_HARNESS", "expected_result.result");
assertEqual(harness.result, "PASS_ACCESS_AUTHORIZATION_RECORD_SCHEMA_CONFORMANCE_HARNESS_CREATED", "harness.result");

console.log(JSON.stringify({
  marker: "ACCESS_AUTHORIZATION_RECORD_SCHEMA_CONFORMANCE_HARNESS=PASS",
  harness_id: harness.harness_id,
  decision_scope: harness.decision_scope,
  authorization_level: harness.authorization_level,
  harness_mode: harness.harness_mode,
  required_field_count: harness.expected_result.required_field_count,
  allowed_decision_outcome_count: harness.allowed_decision_outcomes.length,
  conformance_case_count: harness.conformance_cases.length,
  positive_case_count: harness.expected_result.positive_case_count,
  negative_case_count: harness.expected_result.negative_case_count,
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
  result: "PASS_ACCESS_AUTHORIZATION_RECORD_SCHEMA_CONFORMANCE_HARNESS"
}, null, 2));
console.log("ACCESS_AUTHORIZATION_RECORD_SCHEMA_CONFORMANCE_HARNESS=PASS");
