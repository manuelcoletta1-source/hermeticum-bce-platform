#!/usr/bin/env node
"use strict";

const fs = require("fs");

const manifestPath = "evidence/registry/20261003_HBCE_EVIDENCE_REGISTRY_PUBLIC_INDEX_REFRESH_v001.json";
const indexPath = "evidence/registry/20261003_HBCE_PUBLIC_EVIDENCE_REGISTRY_INDEX_v002.json";

const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
const index = JSON.parse(fs.readFileSync(indexPath, "utf8"));

function fail(message) {
  throw new Error(message);
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

function readText(path) {
  if (!fs.existsSync(path)) fail(`missing file: ${path}`);
  return fs.readFileSync(path, "utf8");
}

function parseJson(path) {
  const text = readText(path);
  try {
    JSON.parse(text);
  } catch (error) {
    fail(`invalid JSON: ${path}: ${error.message}`);
  }
  return text;
}

assertEqual(manifest.object_id, "HBCE-EVIDENCE-REGISTRY-PUBLIC-INDEX-REFRESH-V001", "manifest.object_id");
assertEqual(manifest.refresh_id, "HBCE-EVIDENCE-REGISTRY-PUBLIC-INDEX-REFRESH-V001", "manifest.refresh_id");
assertEqual(manifest.status, "ACTIVE_EVIDENCE_REGISTRY_PUBLIC_INDEX_REFRESH", "manifest.status");
assertEqual(manifest.classification, "R_AND_D_PUBLIC_INDEX_REFRESH_ONLY", "manifest.classification");
assertEqual(manifest.basis_marker, "HBCE_ACCESS_AUTHORIZATION_PREDICATE_EVALUATION_HARNESS_FINAL_AUDIT=1", "manifest.basis_marker");
assertEqual(manifest.basis_main_commit, "fb88ee1e263a8e5ab5b2e9489520fb02829925be", "manifest.basis_main_commit");
assertEqual(manifest.expected_cli_marker, "EVIDENCE_REGISTRY_PUBLIC_INDEX_REFRESH=PASS", "manifest.expected_cli_marker");
assertEqual(manifest.expected_result.registry_entry_count, 8, "manifest.registry_entry_count");
assertEqual(manifest.expected_result.index_version, "v002", "manifest.index_version");
assertEqual(manifest.expected_result.result, "PASS_EVIDENCE_REGISTRY_PUBLIC_INDEX_REFRESH_DRAFT", "manifest.expected_result.result");
assertEqual(manifest.result, "PASS_EVIDENCE_REGISTRY_PUBLIC_INDEX_REFRESH_MANIFEST_CREATED", "manifest.result");

const scope = manifest.refresh_scope;
assertEqual(scope.refresh_mode, "PUBLIC_INDEX_REFRESH_ONLY", "refresh_mode");
assertEqual(scope.index_version, "v002", "index_version");
assertEqual(scope.new_public_registry_index, indexPath, "new_public_registry_index");
assertFalse(scope.rewrite_history, "rewrite_history");
assertFalse(scope.change_existing_urls, "change_existing_urls");
assertFalse(scope.production_registry, "production_registry");
assertFalse(scope.grant_access, "grant_access");
assertFalse(scope.authorize_dispatch, "authorize_dispatch");
assertFalse(scope.create_execution_trace, "create_execution_trace");
assertFalse(scope.create_effect_evidence, "create_effect_evidence");

for (const [key, value] of Object.entries(manifest.explicit_non_claims)) {
  assertTrue(value, `manifest.explicit_non_claims.${key}`);
}

for (const [key, value] of Object.entries(manifest.no_execution_boundary)) {
  assertFalse(value, `manifest.no_execution_boundary.${key}`);
}

assertEqual(index.object_id, "HBCE-PUBLIC-EVIDENCE-REGISTRY-INDEX-V002", "index.object_id");
assertEqual(index.index_id, "HBCE-PUBLIC-EVIDENCE-REGISTRY-INDEX-V002", "index.index_id");
assertEqual(index.status, "ACTIVE_PUBLIC_EVIDENCE_REGISTRY_INDEX_REFRESHED", "index.status");
assertEqual(index.classification, "R_AND_D_PUBLIC_INDEX_ONLY", "index.classification");
assertEqual(index.basis_marker, manifest.basis_marker, "index.basis_marker");
assertEqual(index.basis_main_commit, manifest.basis_main_commit, "index.basis_main_commit");
assertEqual(index.source_refresh_id, manifest.refresh_id, "index.source_refresh_id");
assertEqual(index.source_refresh_manifest, manifestPath, "index.source_refresh_manifest");
assertEqual(index.previous_public_registry_index, scope.previous_public_registry_index, "index.previous_public_registry_index");
assertEqual(index.refresh_mode, "PUBLIC_INDEX_REFRESH_ONLY", "index.refresh_mode");
assertEqual(index.entry_count, 8, "index.entry_count");
assertEqual(index.expected_cli_marker, "EVIDENCE_REGISTRY_PUBLIC_INDEX_REFRESH=PASS", "index.expected_cli_marker");
assertEqual(index.result, "PASS_PUBLIC_EVIDENCE_REGISTRY_INDEX_V002_CREATED", "index.result");

parseJson(scope.previous_public_registry_index);

if (!Array.isArray(manifest.registry_entries)) fail("manifest.registry_entries must be array");
if (!Array.isArray(index.entries)) fail("index.entries must be array");
assertEqual(manifest.registry_entries.length, 8, "manifest.registry_entries.length");
assertEqual(index.entries.length, 8, "index.entries.length");

const seenEntryIds = new Set();
const seenObjectIds = new Set();
const checked = [];

for (let i = 0; i < manifest.registry_entries.length; i += 1) {
  const entry = manifest.registry_entries[i];
  const indexed = index.entries[i];

  assertEqual(indexed.entry_id, entry.entry_id, `${entry.entry_id}.entry_id`);
  assertEqual(indexed.object_id, entry.object_id, `${entry.entry_id}.object_id`);
  assertEqual(indexed.json, entry.json, `${entry.entry_id}.json`);
  assertEqual(indexed.page, entry.page, `${entry.entry_id}.page`);
  assertEqual(indexed.documentation, entry.documentation, `${entry.entry_id}.documentation`);
  assertEqual(indexed.expected_marker, entry.expected_marker, `${entry.entry_id}.expected_marker`);
  assertEqual(indexed.status, "PUBLIC_R_AND_D_ARTIFACT", `${entry.entry_id}.status`);

  if (seenEntryIds.has(entry.entry_id)) fail(`duplicate entry_id: ${entry.entry_id}`);
  if (seenObjectIds.has(entry.object_id)) fail(`duplicate object_id: ${entry.object_id}`);
  seenEntryIds.add(entry.entry_id);
  seenObjectIds.add(entry.object_id);

  for (const key of ["entry_id", "object_id", "category", "json", "page", "documentation", "expected_marker", "status"]) {
    if (!entry[key]) fail(`entry missing ${key}: ${entry.entry_id}`);
  }

  const jsonText = parseJson(entry.json);
  const pageText = readText(entry.page);
  const docText = readText(entry.documentation);
  const combined = `${jsonText}\n${pageText}\n${docText}`;

  checked.push({
    entry_id: entry.entry_id,
    object_id: entry.object_id,
    category: entry.category,
    json: entry.json,
    page: entry.page,
    documentation: entry.documentation,
    expected_marker: entry.expected_marker,
    files_exist: true,
    json_parseable: true,
    object_id_present_in_artifact_set: combined.includes(entry.object_id),
    marker_present_in_artifact_set: combined.includes(entry.expected_marker)
  });
}

for (const requiredId of [
  "HBCE-EVIDENCE-OBJECT-SCHEMA-DRAFT-V001",
  "HBCE-IPR-ONBOARDING-EVIDENCE-RECORD-DRAFT-V001",
  "HBCE-EVIDENCE-SCHEMA-CONFORMANCE-HARNESS-V001",
  "HBCE-IPR-ONBOARDING-DENY-STATE-HARNESS-V001",
  "HBCE-EVIDENCE-OBJECT-MIGRATION-MAP-V001",
  "HBCE-ACCESS-AUTHORIZATION-PREDICATE-DRAFT-V001",
  "HBCE-EVIDENCE-REGISTRY-CONSISTENCY-HARNESS-V001",
  "HBCE-ACCESS-AUTHORIZATION-PREDICATE-EVALUATION-HARNESS-V001"
]) {
  if (!seenObjectIds.has(requiredId)) fail(`missing required registry object: ${requiredId}`);
}

for (const [key, value] of Object.entries(index.boundary)) {
  assertFalse(value, `index.boundary.${key}`);
}

for (const [key, value] of Object.entries(index.explicit_non_claims)) {
  assertTrue(value, `index.explicit_non_claims.${key}`);
}

console.log(JSON.stringify({
  marker: "EVIDENCE_REGISTRY_PUBLIC_INDEX_REFRESH=PASS",
  refresh_id: manifest.refresh_id,
  index_id: index.index_id,
  index_version: index.version,
  registry_entry_count: index.entries.length,
  unique_entry_id_count: seenEntryIds.size,
  unique_object_id_count: seenObjectIds.size,
  previous_public_registry_index_present: true,
  new_public_registry_index: indexPath,
  production_registry_enabled: false,
  registry_rewritten: false,
  history_rewritten: false,
  existing_urls_changed: false,
  access_granted: false,
  dispatch_authorized: false,
  execution_trace_created: false,
  effect_evidence_created: false,
  checked,
  result: "PASS_EVIDENCE_REGISTRY_PUBLIC_INDEX_REFRESH_DRAFT"
}, null, 2));
console.log("EVIDENCE_REGISTRY_PUBLIC_INDEX_REFRESH=PASS");
