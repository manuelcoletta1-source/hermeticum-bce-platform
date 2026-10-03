#!/usr/bin/env node
"use strict";

const fs = require("fs");

const manifestPath = "evidence/migration/20261003_HBCE_EVIDENCE_OBJECT_MIGRATION_MAP_v001.json";
const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));

function fail(message) {
  throw new Error(message);
}

function assertTrue(value, label) {
  if (value !== true) fail(`${label} must be true`);
}

function assertFalse(value, label) {
  if (value !== false) fail(`${label} must be false`);
}

function assertFile(path, label) {
  if (!path || typeof path !== "string") fail(`${label} path invalid`);
  if (!fs.existsSync(path)) fail(`${label} missing: ${path}`);
}

if (manifest.object_id !== "HBCE-EVIDENCE-OBJECT-MIGRATION-MAP-V001") fail("object_id invalid");
if (manifest.status !== "ACTIVE_EVIDENCE_OBJECT_MIGRATION_MAP") fail("status invalid");
if (manifest.basis_marker !== "HBCE_IPR_ONBOARDING_DENY_STATE_HARNESS_FINAL_AUDIT=1") fail("basis_marker invalid");
if (manifest.basis_main_commit !== "50565489e4fc5aeee34918606f69bc627f863bc2") fail("basis_main_commit invalid");
if (manifest.expected_cli_marker !== "EVIDENCE_OBJECT_MIGRATION_MAP=PASS") fail("expected_cli_marker invalid");
if (manifest.result !== "PASS_EVIDENCE_OBJECT_MIGRATION_MAP_MANIFEST_CREATED") fail("result invalid");

if (!Array.isArray(manifest.mapped_objects)) fail("mapped_objects must be an array");
if (manifest.mapped_objects.length !== 4) fail("mapped_objects length must be 4");

const expectedIds = new Set([
  "HBCE-EVIDENCE-OBJECT-SCHEMA-DRAFT-V001",
  "HBCE-IPR-ONBOARDING-EVIDENCE-RECORD-DRAFT-V001",
  "HBCE-EVIDENCE-SCHEMA-CONFORMANCE-HARNESS-V001",
  "HBCE-IPR-ONBOARDING-DENY-STATE-HARNESS-V001"
]);

const seenIds = new Set();

manifest.mapped_objects.forEach((item, index) => {
  if (item.sequence !== index + 1) fail(`sequence invalid at index ${index}`);
  if (!expectedIds.has(item.object_id)) fail(`unexpected object_id ${item.object_id}`);
  if (seenIds.has(item.object_id)) fail(`duplicate object_id ${item.object_id}`);
  seenIds.add(item.object_id);

  if (item.migration_action !== "MAP_ONLY_NO_MOVE") fail(`${item.object_id} migration_action invalid`);
  if (!["evidence/schema", "evidence/ipr"].includes(item.canonical_bucket)) fail(`${item.object_id} canonical_bucket invalid`);

  assertFile(item.current_json_path, `${item.object_id}.current_json_path`);
  assertFile(item.current_public_page, `${item.object_id}.current_public_page`);
  assertFile(item.current_documentation, `${item.object_id}.current_documentation`);
});

for (const id of expectedIds) {
  if (!seenIds.has(id)) fail(`missing mapped object ${id}`);
}

const policy = manifest.migration_policy;
if (policy.mode !== "MAP_ONLY") fail("migration_policy.mode invalid");
assertFalse(policy.move_files, "migration_policy.move_files");
assertFalse(policy.rewrite_history, "migration_policy.rewrite_history");
assertFalse(policy.change_existing_urls, "migration_policy.change_existing_urls");
assertFalse(policy.change_authorization_semantics, "migration_policy.change_authorization_semantics");
assertTrue(policy.preserve_public_surfaces, "migration_policy.preserve_public_surfaces");
assertTrue(policy.preserve_release_tags, "migration_policy.preserve_release_tags");
assertTrue(policy.preserve_evidence_boundaries, "migration_policy.preserve_evidence_boundaries");

for (const [key, value] of Object.entries(manifest.explicit_non_claims)) {
  assertTrue(value, `explicit_non_claims.${key}`);
}

for (const [key, value] of Object.entries(manifest.no_execution_boundary)) {
  assertFalse(value, `no_execution_boundary.${key}`);
}

console.log(JSON.stringify({
  marker: "EVIDENCE_OBJECT_MIGRATION_MAP=PASS",
  map_id: manifest.map_id,
  mapped_object_count: manifest.mapped_objects.length,
  mode: manifest.migration_policy.mode,
  result: "PASS_MAP_ONLY_NO_MOVE"
}, null, 2));
console.log("EVIDENCE_OBJECT_MIGRATION_MAP=PASS");
