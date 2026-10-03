#!/usr/bin/env node
"use strict";

const fs = require("fs");

const manifestPath = "evidence/registry/20261003_HBCE_EVIDENCE_REGISTRY_CONSISTENCY_HARNESS_v001.json";
const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));

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

assertEqual(manifest.object_id, "HBCE-EVIDENCE-REGISTRY-CONSISTENCY-HARNESS-V001", "object_id");
assertEqual(manifest.harness_id, "HBCE-EVIDENCE-REGISTRY-CONSISTENCY-HARNESS-V001", "harness_id");
assertEqual(manifest.status, "ACTIVE_EVIDENCE_REGISTRY_CONSISTENCY_HARNESS", "status");
assertEqual(manifest.classification, "R_AND_D_EVIDENCE_REGISTRY_CONSISTENCY_HARNESS_ONLY", "classification");
assertEqual(manifest.basis_marker, "HBCE_ACCESS_AUTHORIZATION_PREDICATE_DRAFT_FINAL_AUDIT=1", "basis_marker");
assertEqual(manifest.basis_main_commit, "1fb9eeb77fc6a5c21c8924df7017cffa566321be", "basis_main_commit");
assertEqual(manifest.expected_cli_marker, "EVIDENCE_REGISTRY_CONSISTENCY_HARNESS=PASS", "expected_cli_marker");
assertEqual(manifest.expected_result.controlled_input_count, 6, "controlled_input_count");
assertEqual(manifest.expected_result.result, "PASS_EVIDENCE_REGISTRY_CONSISTENCY_HARNESS_DRAFT", "expected_result.result");
assertEqual(manifest.result, "PASS_EVIDENCE_REGISTRY_CONSISTENCY_HARNESS_MANIFEST_CREATED", "result");

const scope = manifest.registry_consistency_scope;
assertEqual(scope.registry_mode, "CONSISTENCY_HARNESS_ONLY", "registry_mode");
assertFalse(scope.production_registry, "production_registry");
assertFalse(scope.rewrite_existing_registry, "rewrite_existing_registry");
assertFalse(scope.rewrite_history, "rewrite_history");
assertFalse(scope.change_existing_urls, "change_existing_urls");
assertFalse(scope.grant_access, "grant_access");
assertFalse(scope.authorize_dispatch, "authorize_dispatch");
assertFalse(scope.create_effect_evidence, "create_effect_evidence");

const markerPolicy = manifest.marker_embedding_policy;
assertTrue(markerPolicy.registry_declared_expected_markers, "registry_declared_expected_markers");
assertFalse(markerPolicy.historical_artifact_marker_embedding_required, "historical_artifact_marker_embedding_required");
assertTrue(markerPolicy.embedded_marker_presence_reported, "embedded_marker_presence_reported");
assertFalse(markerPolicy.legacy_artifact_rewrite_required, "legacy_artifact_rewrite_required");

for (const [key, value] of Object.entries(manifest.explicit_non_claims)) {
  assertTrue(value, `explicit_non_claims.${key}`);
}

for (const [key, value] of Object.entries(manifest.no_execution_boundary)) {
  assertFalse(value, `no_execution_boundary.${key}`);
}

if (!Array.isArray(manifest.controlled_inputs)) fail("controlled_inputs must be an array");
assertEqual(manifest.controlled_inputs.length, manifest.expected_result.controlled_input_count, "controlled_inputs.length");

const seenIds = new Set();
const checked = [];

for (const input of manifest.controlled_inputs) {
  if (seenIds.has(input.object_id)) fail(`duplicate object_id: ${input.object_id}`);
  seenIds.add(input.object_id);

  for (const key of ["object_id", "json", "page", "documentation", "expected_marker", "bucket"]) {
    if (!input[key]) fail(`controlled input missing ${key}`);
  }

  const jsonText = parseJson(input.json);
  const pageText = readText(input.page);
  const docText = readText(input.documentation);
  const combined = `${jsonText}\n${pageText}\n${docText}`;

  checked.push({
    object_id: input.object_id,
    json: input.json,
    page: input.page,
    documentation: input.documentation,
    expected_marker: input.expected_marker,
    bucket: input.bucket,
    exists: true,
    json_parseable: true,
    object_id_present_in_artifact_set: combined.includes(input.object_id),
    marker_present_in_artifact_set: combined.includes(input.expected_marker),
    historical_marker_embedding_required: false
  });
}

for (const requiredId of [
  "HBCE-EVIDENCE-OBJECT-SCHEMA-DRAFT-V001",
  "HBCE-IPR-ONBOARDING-EVIDENCE-RECORD-DRAFT-V001",
  "HBCE-EVIDENCE-SCHEMA-CONFORMANCE-HARNESS-V001",
  "HBCE-IPR-ONBOARDING-DENY-STATE-HARNESS-V001",
  "HBCE-EVIDENCE-OBJECT-MIGRATION-MAP-V001",
  "HBCE-ACCESS-AUTHORIZATION-PREDICATE-DRAFT-V001"
]) {
  if (!seenIds.has(requiredId)) fail(`missing required controlled input: ${requiredId}`);
}

console.log(JSON.stringify({
  marker: "EVIDENCE_REGISTRY_CONSISTENCY_HARNESS=PASS",
  harness_id: manifest.harness_id,
  controlled_input_count: checked.length,
  unique_object_id_count: seenIds.size,
  registry_mode: manifest.registry_consistency_scope.registry_mode,
  registry_declared_expected_markers: true,
  historical_artifact_marker_embedding_required: false,
  embedded_marker_presence_reported: true,
  legacy_artifact_rewrite_required: false,
  production_registry_enabled: false,
  registry_rewritten: false,
  history_rewritten: false,
  existing_urls_changed: false,
  access_granted: false,
  dispatch_authorized: false,
  execution_trace_created: false,
  effect_evidence_created: false,
  checked,
  result: "PASS_EVIDENCE_REGISTRY_CONSISTENCY_HARNESS_DRAFT"
}, null, 2));
console.log("EVIDENCE_REGISTRY_CONSISTENCY_HARNESS=PASS");
