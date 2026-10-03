#!/usr/bin/env node
"use strict";

const fs = require("fs");

const manifestPath = "evidence/registry/20261003_HBCE_ACCESS_AUTHORIZATION_RECORD_PUBLIC_INDEX_REFRESH_v001.json";
const indexPath = "evidence/registry/20261003_HBCE_ACCESS_AUTHORIZATION_RECORD_PUBLIC_INDEX_v001.json";

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
  if (!entry.entry_type) fail(`${label}.entry_type missing`);
  if (!entry.json) fail(`${label}.json missing`);
  if (!entry.page) fail(`${label}.page missing`);
  if (!entry.expected_marker) fail(`${label}.expected_marker missing`);

  const jsonText = readText(entry.json);
  const pageText = readText(entry.page);
  const combined = `${jsonText}\n${pageText}`;

  if (!combined.includes(entry.object_id)) {
    fail(`${label}: object_id not found in source artifacts: ${entry.object_id}`);
  }

  if (!combined.includes(entry.expected_marker)) {
    fail(`${label}: expected marker not found in source artifacts: ${entry.expected_marker}`);
  }
}

const manifest = parseJson(manifestPath);
const index = parseJson(indexPath);

assertEqual(manifest.object_id, "HBCE-ACCESS-AUTHORIZATION-RECORD-PUBLIC-INDEX-REFRESH-V001", "manifest.object_id");
assertEqual(manifest.refresh_id, "HBCE-ACCESS-AUTHORIZATION-RECORD-PUBLIC-INDEX-REFRESH-V001", "manifest.refresh_id");
assertEqual(manifest.artifact_type, "HBCEAccessAuthorizationRecordPublicIndexRefresh", "manifest.artifact_type");
assertEqual(manifest.version, "v001", "manifest.version");
assertEqual(manifest.status, "ACTIVE_ACCESS_AUTHORIZATION_RECORD_PUBLIC_INDEX_REFRESH", "manifest.status");
assertEqual(manifest.classification, "R_AND_D_ACCESS_AUTHORIZATION_RECORD_PUBLIC_INDEX_REFRESH_ONLY", "manifest.classification");
assertEqual(manifest.basis_marker, "HBCE_AUTHORIZATION_DECISION_RECORD_EVALUATION_HARNESS_FINAL_AUDIT=1", "manifest.basis_marker");
assertEqual(manifest.basis_main_commit, "ccc9a33e314d53372f82ec21fdaa4f91676712b3", "manifest.basis_main_commit");

assertEqual(manifest.public_surfaces.page, "access-authorization-record-public-index-refresh.html", "manifest.public_surfaces.page");
assertEqual(manifest.public_surfaces.json, manifestPath, "manifest.public_surfaces.json");
assertEqual(manifest.public_surfaces.index_json, indexPath, "manifest.public_surfaces.index_json");
assertEqual(manifest.public_surfaces.documentation, "docs/evidence/hbce-access-authorization-record-public-index-refresh-v001.md", "manifest.public_surfaces.documentation");
assertEqual(manifest.public_surfaces.tool, "tools/evidence/validate-access-authorization-record-public-index-refresh.js", "manifest.public_surfaces.tool");

assertEqual(manifest.refresh_scope.index_id, "HBCE-ACCESS-AUTHORIZATION-RECORD-PUBLIC-INDEX-V001", "manifest.refresh_scope.index_id");
assertEqual(manifest.refresh_scope.index_version, "v001", "manifest.refresh_scope.index_version");
assertEqual(manifest.refresh_scope.scope_id, "ACCESS_AUTHORIZATION_RECORD_CHAIN", "manifest.refresh_scope.scope_id");
assertEqual(manifest.refresh_scope.refresh_mode, "CONTROLLED_PUBLIC_INDEX_REFRESH_ONLY", "manifest.refresh_scope.refresh_mode");
assertFalse(manifest.refresh_scope.production_registry, "manifest.refresh_scope.production_registry");
assertFalse(manifest.refresh_scope.grant_access, "manifest.refresh_scope.grant_access");
assertFalse(manifest.refresh_scope.authorize_dispatch, "manifest.refresh_scope.authorize_dispatch");
assertFalse(manifest.refresh_scope.authorize_execution, "manifest.refresh_scope.authorize_execution");
assertFalse(manifest.refresh_scope.create_execution_trace, "manifest.refresh_scope.create_execution_trace");
assertFalse(manifest.refresh_scope.create_effect_evidence, "manifest.refresh_scope.create_effect_evidence");
assertFalse(manifest.refresh_scope.create_legal_certification, "manifest.refresh_scope.create_legal_certification");

assertEqual(index.object_id, "HBCE-ACCESS-AUTHORIZATION-RECORD-PUBLIC-INDEX-V001", "index.object_id");
assertEqual(index.index_id, "HBCE-ACCESS-AUTHORIZATION-RECORD-PUBLIC-INDEX-V001", "index.index_id");
assertEqual(index.artifact_type, "HBCEAccessAuthorizationRecordPublicIndex", "index.artifact_type");
assertEqual(index.version, "v001", "index.version");
assertEqual(index.status, "ACTIVE_ACCESS_AUTHORIZATION_RECORD_PUBLIC_INDEX", "index.status");
assertEqual(index.classification, "R_AND_D_ACCESS_AUTHORIZATION_RECORD_PUBLIC_INDEX_ONLY", "index.classification");
assertEqual(index.basis_marker, manifest.basis_marker, "index.basis_marker");
assertEqual(index.basis_main_commit, manifest.basis_main_commit, "index.basis_main_commit");

assertEqual(index.index_scope.scope_id, "ACCESS_AUTHORIZATION_RECORD_CHAIN", "index.index_scope.scope_id");
assertEqual(index.index_scope.scope_mode, "CONTROLLED_PUBLIC_INDEX_ONLY", "index.index_scope.scope_mode");
assertFalse(index.index_scope.production_registry, "index.index_scope.production_registry");
assertFalse(index.index_scope.grant_access, "index.index_scope.grant_access");
assertFalse(index.index_scope.authorize_dispatch, "index.index_scope.authorize_dispatch");
assertFalse(index.index_scope.authorize_execution, "index.index_scope.authorize_execution");
assertFalse(index.index_scope.create_execution_trace, "index.index_scope.create_execution_trace");
assertFalse(index.index_scope.create_effect_evidence, "index.index_scope.create_effect_evidence");
assertFalse(index.index_scope.create_legal_certification, "index.index_scope.create_legal_certification");

assertArray(manifest.indexed_chain, "manifest.indexed_chain");
assertArray(index.entries, "index.entries");
assertEqual(manifest.indexed_chain.length, 4, "manifest.indexed_chain.length");
assertEqual(index.entries.length, 4, "index.entries.length");
assertEqual(index.expected_entry_count, 4, "index.expected_entry_count");

assertSequential(manifest.indexed_chain, "manifest.indexed_chain");
assertSequential(index.entries, "index.entries");

const expectedIds = [
  "HBCE-ACCESS-AUTHORIZATION-PREDICATE-DRAFT-V001",
  "HBCE-ACCESS-AUTHORIZATION-PREDICATE-EVALUATION-HARNESS-V001",
  "HBCE-ACCESS-AUTHORIZATION-DECISION-RECORD-DRAFT-V001",
  "HBCE-AUTHORIZATION-DECISION-RECORD-EVALUATION-HARNESS-V001"
];

const manifestIds = manifest.indexed_chain.map((entry) => entry.object_id);
const indexIds = index.entries.map((entry) => entry.object_id);

assertEqual(JSON.stringify(manifestIds), JSON.stringify(expectedIds), "manifest indexed ids");
assertEqual(JSON.stringify(indexIds), JSON.stringify(expectedIds), "index entry ids");

for (let n = 0; n < expectedIds.length; n += 1) {
  const m = manifest.indexed_chain[n];
  const i = index.entries[n];

  assertEqual(m.object_id, i.object_id, `entry ${n + 1} object_id parity`);
  assertEqual(m.sequence, i.sequence, `entry ${n + 1} sequence parity`);
  assertEqual(m.entry_type, i.entry_type, `entry ${n + 1} entry_type parity`);
  assertEqual(m.json, i.json, `entry ${n + 1} json parity`);
  assertEqual(m.page, i.page, `entry ${n + 1} page parity`);
  assertEqual(m.expected_marker, i.expected_marker, `entry ${n + 1} marker parity`);

  verifySourceEntry(i, `index.entries[${n}]`);
}

assertEqual(index.entries[0].expected_marker, "ACCESS_AUTHORIZATION_PREDICATE_DRAFT=PASS", "entry 1 marker");
assertEqual(index.entries[1].expected_marker, "ACCESS_AUTHORIZATION_PREDICATE_EVALUATION_HARNESS=PASS", "entry 2 marker");
assertEqual(index.entries[2].expected_marker, "ACCESS_AUTHORIZATION_DECISION_RECORD_DRAFT=PASS", "entry 3 marker");
assertEqual(index.entries[3].expected_marker, "AUTHORIZATION_DECISION_RECORD_EVALUATION_HARNESS=PASS", "entry 4 marker");

assertEqual(manifest.expected_cli_marker, "ACCESS_AUTHORIZATION_RECORD_PUBLIC_INDEX_REFRESH=PASS", "manifest.expected_cli_marker");
assertEqual(index.expected_cli_marker, "ACCESS_AUTHORIZATION_RECORD_PUBLIC_INDEX=PASS", "index.expected_cli_marker");
assertEqual(manifest.expected_result.indexed_chain_entry_count, 4, "manifest expected entry count");
assertEqual(manifest.expected_result.index_id, index.index_id, "manifest expected index id");
assertEqual(manifest.expected_result.index_version, index.version, "manifest expected index version");
assertEqual(manifest.expected_result.result, "PASS_ACCESS_AUTHORIZATION_RECORD_PUBLIC_INDEX_REFRESH", "manifest expected result");

for (const [key, value] of Object.entries(manifest.explicit_non_claims)) {
  assertTrue(value, `manifest.explicit_non_claims.${key}`);
}

for (const [key, value] of Object.entries(index.explicit_non_claims)) {
  assertTrue(value, `index.explicit_non_claims.${key}`);
}

for (const [key, value] of Object.entries(manifest.no_execution_boundary)) {
  assertFalse(value, `manifest.no_execution_boundary.${key}`);
}

for (const [key, value] of Object.entries(index.no_execution_boundary)) {
  assertFalse(value, `index.no_execution_boundary.${key}`);
}

assertEqual(manifest.result, "PASS_ACCESS_AUTHORIZATION_RECORD_PUBLIC_INDEX_REFRESH_MANIFEST_CREATED", "manifest.result");
assertEqual(index.result, "PASS_ACCESS_AUTHORIZATION_RECORD_PUBLIC_INDEX_CREATED", "index.result");

console.log(JSON.stringify({
  marker: "ACCESS_AUTHORIZATION_RECORD_PUBLIC_INDEX_REFRESH=PASS",
  index_marker: "ACCESS_AUTHORIZATION_RECORD_PUBLIC_INDEX=PASS",
  refresh_id: manifest.refresh_id,
  index_id: index.index_id,
  scope_id: manifest.refresh_scope.scope_id,
  indexed_chain_entry_count: manifest.indexed_chain.length,
  index_entry_count: index.entries.length,
  indexed_object_ids: indexIds,
  production_registry: false,
  access_granted: false,
  dispatch_authorized: false,
  execution_authorized: false,
  production_authorization_service_enabled: false,
  execution_trace_created: false,
  effect_evidence_created: false,
  legal_certification_created: false,
  result: "PASS_ACCESS_AUTHORIZATION_RECORD_PUBLIC_INDEX_REFRESH"
}, null, 2));
console.log("ACCESS_AUTHORIZATION_RECORD_PUBLIC_INDEX_REFRESH=PASS");
console.log("ACCESS_AUTHORIZATION_RECORD_PUBLIC_INDEX=PASS");
