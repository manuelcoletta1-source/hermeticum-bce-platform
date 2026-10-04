#!/usr/bin/env node
"use strict";

const fs = require("fs");

const indexPath = "evidence/registry/20261004_HBCE_ACCESS_AUTHORIZATION_RECORD_PUBLIC_INDEX_v003.json";
const refreshPath = "evidence/registry/20261004_HBCE_ACCESS_AUTHORIZATION_RECORD_PUBLIC_INDEX_REFRESH_v003.json";

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

const index = parseJson(indexPath);
const refresh = parseJson(refreshPath);

assertEqual(index.object_id, "HBCE-ACCESS-AUTHORIZATION-RECORD-PUBLIC-INDEX-V003", "index.object_id");
assertEqual(index.record_id, "HBCE-ACCESS-AUTHORIZATION-RECORD-PUBLIC-INDEX-V003", "index.record_id");
assertEqual(index.artifact_type, "HBCEAccessAuthorizationRecordPublicIndex", "index.artifact_type");
assertEqual(index.version, "v003", "index.version");
assertEqual(index.status, "ACTIVE_ACCESS_AUTHORIZATION_RECORD_PUBLIC_INDEX", "index.status");
assertEqual(index.classification, "R_AND_D_PUBLIC_EVIDENCE_INDEX_ONLY", "index.classification");

assertEqual(refresh.object_id, "HBCE-ACCESS-AUTHORIZATION-RECORD-PUBLIC-INDEX-REFRESH-V003", "refresh.object_id");
assertEqual(refresh.record_id, "HBCE-ACCESS-AUTHORIZATION-RECORD-PUBLIC-INDEX-REFRESH-V003", "refresh.record_id");
assertEqual(refresh.artifact_type, "HBCEAccessAuthorizationRecordPublicIndexRefresh", "refresh.artifact_type");
assertEqual(refresh.version, "v003", "refresh.version");
assertEqual(refresh.status, "ACTIVE_ACCESS_AUTHORIZATION_RECORD_PUBLIC_INDEX_REFRESH", "refresh.status");
assertEqual(refresh.classification, "R_AND_D_PUBLIC_EVIDENCE_INDEX_REFRESH_ONLY", "refresh.classification");

for (const [label, record] of [["index", index], ["refresh", refresh]]) {
  assertEqual(record.basis_marker, "HBCE_POSITIVE_AUTHORIZATION_CONTRACT_EVALUATION_HARNESS_FINAL_AUDIT=1", `${label}.basis_marker`);
  assertEqual(record.basis_main_commit, "c778950decb4c37cdb225855d5eb32acaab02317", `${label}.basis_main_commit`);
  assertEqual(record.previous_index, "HBCE-ACCESS-AUTHORIZATION-RECORD-PUBLIC-INDEX-V002", `${label}.previous_index`);
  assertEqual(record.previous_index_path, "evidence/registry/20261004_HBCE_ACCESS_AUTHORIZATION_RECORD_PUBLIC_INDEX_v002.json", `${label}.previous_index_path`);
  assertEqual(record.decision_scope, "ACCESS_AUTHORIZATION", `${label}.decision_scope`);
  assertEqual(record.authorization_level, "ACCESS_ONLY", `${label}.authorization_level`);
  assertEqual(record.indexed_object_count, 11, `${label}.indexed_object_count`);
  assertEqual(record.added_object_count, 3, `${label}.added_object_count`);
  assertDeepEqual(record.added_in_v003, [
    "HBCE-RUNTIME-ACCESS-GATE-INTEGRATION-BOUNDARY-DRAFT-V001",
    "HBCE-POSITIVE-AUTHORIZATION-CONTRACT-DRAFT-V001",
    "HBCE-POSITIVE-AUTHORIZATION-CONTRACT-EVALUATION-HARNESS-V001"
  ], `${label}.added_in_v003`);
  assertDeepEqual(record.category_counts, {
    predicate_record: 2,
    decision_record: 2,
    runtime_gate_record: 3,
    schema_record: 2,
    positive_authorization_contract_record: 2
  }, `${label}.category_counts`);
}

assertEqual(index.index_scope, "ACCESS_AUTHORIZATION_RECORD_PUBLIC_INDEX", "index.index_scope");
assertEqual(refresh.refresh_scope, "ACCESS_AUTHORIZATION_RECORD_PUBLIC_INDEX_REFRESH", "refresh.refresh_scope");
assertEqual(refresh.new_index, "HBCE-ACCESS-AUTHORIZATION-RECORD-PUBLIC-INDEX-V003", "refresh.new_index");
assertEqual(refresh.new_index_path, indexPath, "refresh.new_index_path");

assertArray(index.indexed_objects, "index.indexed_objects");
assertArray(refresh.refresh_source_chain, "refresh.refresh_source_chain");
assertEqual(index.indexed_objects.length, 11, "index.indexed_objects.length");
assertEqual(refresh.refresh_source_chain.length, 4, "refresh.refresh_source_chain.length");

assertDeepEqual(index.indexed_objects.map((entry) => entry.sequence), [1,2,3,4,5,6,7,8,9,10,11], "index sequences");
assertDeepEqual(refresh.refresh_source_chain.map((entry) => entry.sequence), [1,2,3,4], "refresh source sequence");

const expectedIndexedObjects = [
  ["HBCE-ACCESS-AUTHORIZATION-PREDICATE-DRAFT-V001", "predicate_record", "ACCESS_AUTHORIZATION_PREDICATE_DRAFT=PASS"],
  ["HBCE-ACCESS-AUTHORIZATION-PREDICATE-EVALUATION-HARNESS-V001", "predicate_record", "ACCESS_AUTHORIZATION_PREDICATE_EVALUATION_HARNESS=PASS"],
  ["HBCE-ACCESS-AUTHORIZATION-DECISION-RECORD-DRAFT-V001", "decision_record", "ACCESS_AUTHORIZATION_DECISION_RECORD_DRAFT=PASS"],
  ["HBCE-AUTHORIZATION-DECISION-RECORD-EVALUATION-HARNESS-V001", "decision_record", "AUTHORIZATION_DECISION_RECORD_EVALUATION_HARNESS=PASS"],
  ["HBCE-RUNTIME-ACCESS-GATE-DRAFT-V001", "runtime_gate_record", "RUNTIME_ACCESS_GATE_DRAFT=PASS"],
  ["HBCE-ACCESS-AUTHORIZATION-RECORD-SCHEMA-HARDENING-V001", "schema_record", "ACCESS_AUTHORIZATION_RECORD_SCHEMA_HARDENING=PASS"],
  ["HBCE-ACCESS-AUTHORIZATION-RECORD-SCHEMA-CONFORMANCE-HARNESS-V001", "schema_record", "ACCESS_AUTHORIZATION_RECORD_SCHEMA_CONFORMANCE_HARNESS=PASS"],
  ["HBCE-RUNTIME-ACCESS-GATE-EVALUATION-HARNESS-V001", "runtime_gate_record", "RUNTIME_ACCESS_GATE_EVALUATION_HARNESS=PASS"],
  ["HBCE-RUNTIME-ACCESS-GATE-INTEGRATION-BOUNDARY-DRAFT-V001", "runtime_gate_record", "RUNTIME_ACCESS_GATE_INTEGRATION_BOUNDARY_DRAFT=PASS"],
  ["HBCE-POSITIVE-AUTHORIZATION-CONTRACT-DRAFT-V001", "positive_authorization_contract_record", "POSITIVE_AUTHORIZATION_CONTRACT_DRAFT=PASS"],
  ["HBCE-POSITIVE-AUTHORIZATION-CONTRACT-EVALUATION-HARNESS-V001", "positive_authorization_contract_record", "POSITIVE_AUTHORIZATION_CONTRACT_EVALUATION_HARNESS=PASS"]
];

assertDeepEqual(
  index.indexed_objects.map((entry) => [entry.object_id, entry.category, entry.expected_marker]),
  expectedIndexedObjects,
  "indexed object order"
);

assertUnique(index.indexed_objects.map((entry) => entry.object_id), "indexed object ids");
assertUnique(index.indexed_objects.map((entry) => entry.path), "indexed object paths");

for (const entry of index.indexed_objects) {
  if (!entry.title) fail(`${entry.object_id} missing title`);
  if (!entry.public_page) fail(`${entry.object_id} missing public_page`);
  const text = readText(entry.path);
  if (!text.includes(entry.object_id)) fail(`${entry.path} missing object_id ${entry.object_id}`);
  if (!text.includes(entry.expected_marker)) fail(`${entry.path} missing expected marker ${entry.expected_marker}`);
}

const expectedRefreshSource = [
  ["HBCE-ACCESS-AUTHORIZATION-RECORD-PUBLIC-INDEX-V002", "ACCESS_AUTHORIZATION_RECORD_PUBLIC_INDEX_V002=PASS"],
  ["HBCE-RUNTIME-ACCESS-GATE-INTEGRATION-BOUNDARY-DRAFT-V001", "RUNTIME_ACCESS_GATE_INTEGRATION_BOUNDARY_DRAFT=PASS"],
  ["HBCE-POSITIVE-AUTHORIZATION-CONTRACT-DRAFT-V001", "POSITIVE_AUTHORIZATION_CONTRACT_DRAFT=PASS"],
  ["HBCE-POSITIVE-AUTHORIZATION-CONTRACT-EVALUATION-HARNESS-V001", "POSITIVE_AUTHORIZATION_CONTRACT_EVALUATION_HARNESS=PASS"]
];

assertDeepEqual(
  refresh.refresh_source_chain.map((entry) => [entry.object_id, entry.expected_marker]),
  expectedRefreshSource,
  "refresh source chain"
);

for (const entry of refresh.refresh_source_chain) {
  const text = readText(entry.path);
  if (!text.includes(entry.object_id)) fail(`${entry.path} missing object_id ${entry.object_id}`);
  if (!text.includes(entry.expected_marker)) fail(`${entry.path} missing expected marker ${entry.expected_marker}`);
}

assertEqual(index.expected_cli_marker, "ACCESS_AUTHORIZATION_RECORD_PUBLIC_INDEX_V003=PASS", "index.expected_cli_marker");
assertEqual(refresh.expected_cli_marker, "ACCESS_AUTHORIZATION_RECORD_PUBLIC_INDEX_REFRESH_V003=PASS", "refresh.expected_cli_marker");

for (const [label, record] of [["index", index], ["refresh", refresh]]) {
  assertEqual(Object.keys(record.explicit_non_claims).length, 14, `${label}.explicit_non_claims count`);
  assertEqual(Object.keys(record.no_execution_boundary).length, 14, `${label}.no_execution_boundary count`);

  for (const [key, value] of Object.entries(record.explicit_non_claims)) {
    assertTrue(value, `${label}.explicit_non_claims.${key}`);
  }

  for (const [key, value] of Object.entries(record.no_execution_boundary)) {
    assertFalse(value, `${label}.no_execution_boundary.${key}`);
  }

  assertEqual(record.expected_result.indexed_object_count, 11, `${label}.expected_result.indexed_object_count`);
  assertEqual(record.expected_result.added_object_count, 3, `${label}.expected_result.added_object_count`);
  assertEqual(record.expected_result.predicate_record_count, 2, `${label}.expected_result.predicate_record_count`);
  assertEqual(record.expected_result.decision_record_count, 2, `${label}.expected_result.decision_record_count`);
  assertEqual(record.expected_result.runtime_gate_record_count, 3, `${label}.expected_result.runtime_gate_record_count`);
  assertEqual(record.expected_result.schema_record_count, 2, `${label}.expected_result.schema_record_count`);
  assertEqual(record.expected_result.positive_authorization_contract_record_count, 2, `${label}.expected_result.positive_authorization_contract_record_count`);
  assertEqual(record.expected_result.required_non_claim_count, 14, `${label}.expected_result.required_non_claim_count`);
  assertEqual(record.expected_result.required_no_execution_boundary_count, 14, `${label}.expected_result.required_no_execution_boundary_count`);
  assertFalse(record.expected_result.runtime_gate_implemented, `${label}.expected_result.runtime_gate_implemented`);
  assertFalse(record.expected_result.runtime_gate_enabled, `${label}.expected_result.runtime_gate_enabled`);
  assertFalse(record.expected_result.positive_authorization_contract_issued, `${label}.expected_result.positive_authorization_contract_issued`);
  assertFalse(record.expected_result.access_granted, `${label}.expected_result.access_granted`);
  assertFalse(record.expected_result.dispatch_authorized, `${label}.expected_result.dispatch_authorized`);
  assertFalse(record.expected_result.execution_authorized, `${label}.expected_result.execution_authorized`);
  assertFalse(record.expected_result.effect_evidence_created, `${label}.expected_result.effect_evidence_created`);
  assertFalse(record.expected_result.legal_certification_created, `${label}.expected_result.legal_certification_created`);
}

assertEqual(index.expected_result.result, "PASS_ACCESS_AUTHORIZATION_RECORD_PUBLIC_INDEX_V003", "index.expected_result.result");
assertEqual(refresh.expected_result.result, "PASS_ACCESS_AUTHORIZATION_RECORD_PUBLIC_INDEX_REFRESH_V003", "refresh.expected_result.result");
assertEqual(index.result, "PASS_ACCESS_AUTHORIZATION_RECORD_PUBLIC_INDEX_V003_CREATED", "index.result");
assertEqual(refresh.result, "PASS_ACCESS_AUTHORIZATION_RECORD_PUBLIC_INDEX_REFRESH_V003_CREATED", "refresh.result");

console.log(JSON.stringify({
  marker: "ACCESS_AUTHORIZATION_RECORD_PUBLIC_INDEX_V003=PASS",
  refresh_marker: "ACCESS_AUTHORIZATION_RECORD_PUBLIC_INDEX_REFRESH_V003=PASS",
  index_id: index.object_id,
  refresh_id: refresh.object_id,
  basis_marker: index.basis_marker,
  basis_main_commit: index.basis_main_commit,
  previous_index: index.previous_index,
  indexed_object_count: index.indexed_object_count,
  added_object_count: index.added_object_count,
  predicate_record_count: index.category_counts.predicate_record,
  decision_record_count: index.category_counts.decision_record,
  runtime_gate_record_count: index.category_counts.runtime_gate_record,
  schema_record_count: index.category_counts.schema_record,
  positive_authorization_contract_record_count: index.category_counts.positive_authorization_contract_record,
  required_non_claim_count: Object.keys(index.explicit_non_claims).length,
  required_no_execution_boundary_count: Object.keys(index.no_execution_boundary).length,
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
  added_in_v003: index.added_in_v003,
  indexed_objects: index.indexed_objects.map((entry) => ({
    sequence: entry.sequence,
    object_id: entry.object_id,
    category: entry.category,
    expected_marker: entry.expected_marker
  })),
  refresh_source_chain: refresh.refresh_source_chain.map((entry) => ({
    sequence: entry.sequence,
    object_id: entry.object_id,
    expected_marker: entry.expected_marker
  })),
  result: "PASS_ACCESS_AUTHORIZATION_RECORD_PUBLIC_INDEX_REFRESH_V003"
}, null, 2));

console.log("ACCESS_AUTHORIZATION_RECORD_PUBLIC_INDEX_V003=PASS");
console.log("ACCESS_AUTHORIZATION_RECORD_PUBLIC_INDEX_REFRESH_V003=PASS");
