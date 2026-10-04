#!/usr/bin/env node
"use strict";

const fs = require("fs");

const indexPath = "evidence/registry/20261004_HBCE_ACCESS_AUTHORIZATION_RECORD_PUBLIC_INDEX_v002.json";
const refreshPath = "evidence/registry/20261004_HBCE_ACCESS_AUTHORIZATION_RECORD_PUBLIC_INDEX_REFRESH_v002.json";
const oldIndexPath = "evidence/registry/20261003_HBCE_ACCESS_AUTHORIZATION_RECORD_PUBLIC_INDEX_v001.json";
const oldRefreshPath = "evidence/registry/20261003_HBCE_ACCESS_AUTHORIZATION_RECORD_PUBLIC_INDEX_REFRESH_v001.json";

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

const index = parseJson(indexPath);
const refresh = parseJson(refreshPath);
const oldIndex = parseJson(oldIndexPath);
const oldRefresh = parseJson(oldRefreshPath);

assertEqual(index.object_id, "HBCE-ACCESS-AUTHORIZATION-RECORD-PUBLIC-INDEX-V002", "index.object_id");
assertEqual(index.record_id, "HBCE-ACCESS-AUTHORIZATION-RECORD-PUBLIC-INDEX-V002", "index.record_id");
assertEqual(index.artifact_type, "HBCEAccessAuthorizationRecordPublicIndex", "index.artifact_type");
assertEqual(index.version, "v002", "index.version");
assertEqual(index.status, "ACTIVE_ACCESS_AUTHORIZATION_RECORD_PUBLIC_INDEX_V002", "index.status");
assertEqual(index.classification, "R_AND_D_ACCESS_AUTHORIZATION_RECORD_PUBLIC_INDEX_ONLY", "index.classification");
assertEqual(index.basis_marker, "HBCE_RUNTIME_ACCESS_GATE_EVALUATION_HARNESS_FINAL_AUDIT=1", "index.basis_marker");
assertEqual(index.basis_main_commit, "7c4e257d89ae4e463e85ac5e2ac84ab5dcb6ce9c", "index.basis_main_commit");
assertEqual(index.decision_scope, "ACCESS_AUTHORIZATION", "index.decision_scope");
assertEqual(index.authorization_level, "ACCESS_ONLY", "index.authorization_level");
assertEqual(index.index_scope, "PUBLIC_ACCESS_AUTHORIZATION_RECORD_CHAIN_INDEX_ONLY", "index.index_scope");
assertEqual(index.expected_cli_marker, "ACCESS_AUTHORIZATION_RECORD_PUBLIC_INDEX_V002=PASS", "index.expected_cli_marker");
assertEqual(index.result, "PASS_ACCESS_AUTHORIZATION_RECORD_PUBLIC_INDEX_V002_CREATED", "index.result");

assertEqual(refresh.object_id, "HBCE-ACCESS-AUTHORIZATION-RECORD-PUBLIC-INDEX-REFRESH-V002", "refresh.object_id");
assertEqual(refresh.record_id, "HBCE-ACCESS-AUTHORIZATION-RECORD-PUBLIC-INDEX-REFRESH-V002", "refresh.record_id");
assertEqual(refresh.artifact_type, "HBCEAccessAuthorizationRecordPublicIndexRefresh", "refresh.artifact_type");
assertEqual(refresh.version, "v002", "refresh.version");
assertEqual(refresh.status, "ACTIVE_ACCESS_AUTHORIZATION_RECORD_PUBLIC_INDEX_REFRESH_V002", "refresh.status");
assertEqual(refresh.classification, "R_AND_D_ACCESS_AUTHORIZATION_RECORD_PUBLIC_INDEX_REFRESH_ONLY", "refresh.classification");
assertEqual(refresh.basis_marker, "HBCE_RUNTIME_ACCESS_GATE_EVALUATION_HARNESS_FINAL_AUDIT=1", "refresh.basis_marker");
assertEqual(refresh.basis_main_commit, "7c4e257d89ae4e463e85ac5e2ac84ab5dcb6ce9c", "refresh.basis_main_commit");
assertEqual(refresh.refresh_scope, "PUBLIC_ACCESS_AUTHORIZATION_RECORD_CHAIN_REFRESH_ONLY", "refresh.refresh_scope");
assertEqual(refresh.decision_scope, "ACCESS_AUTHORIZATION", "refresh.decision_scope");
assertEqual(refresh.authorization_level, "ACCESS_ONLY", "refresh.authorization_level");
assertEqual(refresh.index_file, indexPath, "refresh.index_file");
assertEqual(refresh.refreshed_index_object_id, index.object_id, "refresh.refreshed_index_object_id");
assertEqual(refresh.previous_index_file, oldIndexPath, "refresh.previous_index_file");
assertEqual(refresh.previous_refresh_file, oldRefreshPath, "refresh.previous_refresh_file");
assertEqual(refresh.refreshed_index_marker, "ACCESS_AUTHORIZATION_RECORD_PUBLIC_INDEX_V002=PASS", "refresh.refreshed_index_marker");
assertEqual(refresh.expected_cli_marker, "ACCESS_AUTHORIZATION_RECORD_PUBLIC_INDEX_REFRESH_V002=PASS", "refresh.expected_cli_marker");
assertEqual(refresh.result, "PASS_ACCESS_AUTHORIZATION_RECORD_PUBLIC_INDEX_REFRESH_V002_CREATED", "refresh.result");

assertEqual(oldIndex.object_id, "HBCE-ACCESS-AUTHORIZATION-RECORD-PUBLIC-INDEX-V001", "oldIndex.object_id");
assertEqual(oldRefresh.object_id, "HBCE-ACCESS-AUTHORIZATION-RECORD-PUBLIC-INDEX-REFRESH-V001", "oldRefresh.object_id");

assertEqual(index.supersedes.object_id, "HBCE-ACCESS-AUTHORIZATION-RECORD-PUBLIC-INDEX-V001", "index.supersedes.object_id");
assertEqual(index.supersedes.path, oldIndexPath, "index.supersedes.path");
assertEqual(index.supersedes.expected_marker, "ACCESS_AUTHORIZATION_RECORD_PUBLIC_INDEX=PASS", "index.supersedes.expected_marker");

assertArray(index.indexed_objects, "index.indexed_objects");
assertArray(refresh.added_objects, "refresh.added_objects");
assertEqual(index.indexed_object_count, 8, "index.indexed_object_count");
assertEqual(index.indexed_objects.length, 8, "index.indexed_objects.length");
assertEqual(refresh.added_object_count, 4, "refresh.added_object_count");
assertEqual(refresh.total_indexed_object_count, 8, "refresh.total_indexed_object_count");
assertEqual(refresh.added_objects.length, 4, "refresh.added_objects.length");

assertEqual(index.chain_summary.predicate_record_count, 2, "chain_summary.predicate_record_count");
assertEqual(index.chain_summary.decision_record_count, 2, "chain_summary.decision_record_count");
assertEqual(index.chain_summary.runtime_gate_record_count, 2, "chain_summary.runtime_gate_record_count");
assertEqual(index.chain_summary.schema_record_count, 2, "chain_summary.schema_record_count");
assertEqual(index.chain_summary.total_record_count, 8, "chain_summary.total_record_count");
assertEqual(index.chain_summary.latest_indexed_object, "HBCE-RUNTIME-ACCESS-GATE-EVALUATION-HARNESS-V001", "chain_summary.latest_indexed_object");

assertEqual(index.expected_result.indexed_object_count, 8, "index.expected_result.indexed_object_count");
assertEqual(index.expected_result.predicate_record_count, 2, "index.expected_result.predicate_record_count");
assertEqual(index.expected_result.decision_record_count, 2, "index.expected_result.decision_record_count");
assertEqual(index.expected_result.runtime_gate_record_count, 2, "index.expected_result.runtime_gate_record_count");
assertEqual(index.expected_result.schema_record_count, 2, "index.expected_result.schema_record_count");
assertEqual(index.expected_result.required_non_claim_count, 13, "index.expected_result.required_non_claim_count");
assertEqual(index.expected_result.required_no_execution_boundary_count, 13, "index.expected_result.required_no_execution_boundary_count");
assertEqual(index.expected_result.result, "PASS_ACCESS_AUTHORIZATION_RECORD_PUBLIC_INDEX_V002", "index.expected_result.result");

assertEqual(refresh.expected_result.added_object_count, 4, "refresh.expected_result.added_object_count");
assertEqual(refresh.expected_result.total_indexed_object_count, 8, "refresh.expected_result.total_indexed_object_count");
assertEqual(refresh.expected_result.required_non_claim_count, 13, "refresh.expected_result.required_non_claim_count");
assertEqual(refresh.expected_result.required_no_execution_boundary_count, 13, "refresh.expected_result.required_no_execution_boundary_count");
assertEqual(refresh.expected_result.result, "PASS_ACCESS_AUTHORIZATION_RECORD_PUBLIC_INDEX_REFRESH_V002", "refresh.expected_result.result");

assertUnique(index.indexed_objects.map((entry) => entry.object_id), "indexed object ids");
assertUnique(index.indexed_objects.map((entry) => entry.path), "indexed object paths");
assertUnique(index.indexed_objects.map((entry) => entry.public_page), "indexed public pages");
assertEqual(JSON.stringify(index.indexed_objects.map((entry) => entry.sequence)), JSON.stringify([1, 2, 3, 4, 5, 6, 7, 8]), "indexed sequence");
assertEqual(JSON.stringify(refresh.added_objects.map((entry) => entry.sequence)), JSON.stringify([5, 6, 7, 8]), "added sequence");

const expectedObjects = [
  "HBCE-ACCESS-AUTHORIZATION-PREDICATE-DRAFT-V001",
  "HBCE-ACCESS-AUTHORIZATION-PREDICATE-EVALUATION-HARNESS-V001",
  "HBCE-ACCESS-AUTHORIZATION-DECISION-RECORD-DRAFT-V001",
  "HBCE-AUTHORIZATION-DECISION-RECORD-EVALUATION-HARNESS-V001",
  "HBCE-RUNTIME-ACCESS-GATE-DRAFT-V001",
  "HBCE-ACCESS-AUTHORIZATION-RECORD-SCHEMA-HARDENING-V001",
  "HBCE-ACCESS-AUTHORIZATION-RECORD-SCHEMA-CONFORMANCE-HARNESS-V001",
  "HBCE-RUNTIME-ACCESS-GATE-EVALUATION-HARNESS-V001"
];

assertEqual(JSON.stringify(index.indexed_objects.map((entry) => entry.object_id)), JSON.stringify(expectedObjects), "indexed object order");
assertEqual(JSON.stringify(refresh.added_objects.map((entry) => entry.object_id)), JSON.stringify(expectedObjects.slice(4)), "added object order");

for (const entry of index.indexed_objects) {
  const sourceText = readText(entry.path);
  const pageText = readText(entry.public_page);

  if (!sourceText.includes(entry.object_id)) fail(`${entry.path} missing ${entry.object_id}`);
  if (!sourceText.includes(entry.expected_marker)) fail(`${entry.path} missing ${entry.expected_marker}`);
  if (!pageText.includes(entry.object_id)) fail(`${entry.public_page} missing ${entry.object_id}`);
  if (!pageText.includes(entry.expected_marker)) fail(`${entry.public_page} missing ${entry.expected_marker}`);

  if (!entry.title) fail(`${entry.object_id} missing title`);
  if (!entry.artifact_type) fail(`${entry.object_id} missing artifact_type`);
  if (!entry.classification.startsWith("R_AND_D_")) fail(`${entry.object_id} classification invalid`);
}

for (const entry of refresh.added_objects) {
  const match = index.indexed_objects.find((candidate) => candidate.object_id === entry.object_id);
  if (!match) fail(`refresh added object not present in index: ${entry.object_id}`);
  assertEqual(entry.path, match.path, `${entry.object_id}.path`);
  assertEqual(entry.public_page, match.public_page, `${entry.object_id}.public_page`);
  assertEqual(entry.expected_marker, match.expected_marker, `${entry.object_id}.expected_marker`);
}

assertEqual(Object.keys(index.explicit_non_claims).length, 13, "index.explicit_non_claims count");
assertEqual(Object.keys(refresh.explicit_non_claims).length, 13, "refresh.explicit_non_claims count");
assertEqual(Object.keys(index.no_execution_boundary).length, 13, "index.no_execution_boundary count");
assertEqual(Object.keys(refresh.no_execution_boundary).length, 13, "refresh.no_execution_boundary count");

for (const [key, value] of Object.entries(index.explicit_non_claims)) {
  assertTrue(value, `index.explicit_non_claims.${key}`);
}
for (const [key, value] of Object.entries(refresh.explicit_non_claims)) {
  assertTrue(value, `refresh.explicit_non_claims.${key}`);
}
for (const [key, value] of Object.entries(index.no_execution_boundary)) {
  assertFalse(value, `index.no_execution_boundary.${key}`);
}
for (const [key, value] of Object.entries(refresh.no_execution_boundary)) {
  assertFalse(value, `refresh.no_execution_boundary.${key}`);
}

console.log(JSON.stringify({
  marker: "ACCESS_AUTHORIZATION_RECORD_PUBLIC_INDEX_REFRESH_V002=PASS",
  index_marker: "ACCESS_AUTHORIZATION_RECORD_PUBLIC_INDEX_V002=PASS",
  index_object_id: index.object_id,
  refresh_object_id: refresh.object_id,
  basis_marker: refresh.basis_marker,
  basis_main_commit: refresh.basis_main_commit,
  decision_scope: refresh.decision_scope,
  authorization_level: refresh.authorization_level,
  indexed_object_count: index.indexed_object_count,
  added_object_count: refresh.added_object_count,
  total_indexed_object_count: refresh.total_indexed_object_count,
  predicate_record_count: index.chain_summary.predicate_record_count,
  decision_record_count: index.chain_summary.decision_record_count,
  runtime_gate_record_count: index.chain_summary.runtime_gate_record_count,
  schema_record_count: index.chain_summary.schema_record_count,
  required_non_claim_count: Object.keys(refresh.explicit_non_claims).length,
  required_no_execution_boundary_count: Object.keys(refresh.no_execution_boundary).length,
  runtime_gate_implemented: false,
  runtime_gate_enabled: false,
  access_granted: false,
  dispatch_authorized: false,
  execution_authorized: false,
  production_authorization_service_enabled: false,
  execution_trace_created: false,
  effect_evidence_created: false,
  legal_certification_created: false,
  indexed_objects: index.indexed_objects.map((entry) => ({
    sequence: entry.sequence,
    object_id: entry.object_id,
    expected_marker: entry.expected_marker,
    public_page: entry.public_page
  })),
  added_objects: refresh.added_objects.map((entry) => ({
    sequence: entry.sequence,
    object_id: entry.object_id,
    expected_marker: entry.expected_marker,
    public_page: entry.public_page
  })),
  result: "PASS_ACCESS_AUTHORIZATION_RECORD_PUBLIC_INDEX_REFRESH_V002"
}, null, 2));
console.log("ACCESS_AUTHORIZATION_RECORD_PUBLIC_INDEX_REFRESH_V002=PASS");
console.log("ACCESS_AUTHORIZATION_RECORD_PUBLIC_INDEX_V002=PASS");
