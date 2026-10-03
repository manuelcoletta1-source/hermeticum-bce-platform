"use strict";

const assert = require("assert/strict");
const fs = require("fs");
const cp = require("child_process");

const manifestPath = "evidence/registry/20261003_HBCE_EVIDENCE_REGISTRY_CONSISTENCY_HARNESS_v001.json";
const pagePath = "evidence-registry-consistency-harness.html";
const docPath = "docs/evidence/hbce-evidence-registry-consistency-harness-v001.md";
const toolPath = "tools/evidence/validate-evidence-registry-consistency-harness.js";

for (const path of [manifestPath, pagePath, docPath, toolPath]) {
  assert.equal(fs.existsSync(path), true, path);
}

const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
const page = fs.readFileSync(pagePath, "utf8");
const doc = fs.readFileSync(docPath, "utf8");
const output = cp.execFileSync(process.execPath, [toolPath], { encoding: "utf8" });

assert.equal(manifest.object_id, "HBCE-EVIDENCE-REGISTRY-CONSISTENCY-HARNESS-V001");
assert.equal(manifest.status, "ACTIVE_EVIDENCE_REGISTRY_CONSISTENCY_HARNESS");
assert.equal(manifest.basis_marker, "HBCE_ACCESS_AUTHORIZATION_PREDICATE_DRAFT_FINAL_AUDIT=1");
assert.equal(manifest.expected_cli_marker, "EVIDENCE_REGISTRY_CONSISTENCY_HARNESS=PASS");
assert.equal(manifest.expected_result.controlled_input_count, 6);
assert.equal(manifest.controlled_inputs.length, 6);
assert.equal(manifest.result, "PASS_EVIDENCE_REGISTRY_CONSISTENCY_HARNESS_MANIFEST_CREATED");

assert.equal(manifest.registry_consistency_scope.registry_mode, "CONSISTENCY_HARNESS_ONLY");
assert.equal(manifest.registry_consistency_scope.production_registry, false);
assert.equal(manifest.registry_consistency_scope.rewrite_existing_registry, false);
assert.equal(manifest.registry_consistency_scope.rewrite_history, false);
assert.equal(manifest.registry_consistency_scope.change_existing_urls, false);
assert.equal(manifest.registry_consistency_scope.grant_access, false);
assert.equal(manifest.registry_consistency_scope.authorize_dispatch, false);
assert.equal(manifest.registry_consistency_scope.create_effect_evidence, false);

assert.equal(manifest.marker_embedding_policy.registry_declared_expected_markers, true);
assert.equal(manifest.marker_embedding_policy.historical_artifact_marker_embedding_required, false);
assert.equal(manifest.marker_embedding_policy.embedded_marker_presence_reported, true);
assert.equal(manifest.marker_embedding_policy.legacy_artifact_rewrite_required, false);

assert.ok(output.includes("EVIDENCE_REGISTRY_CONSISTENCY_HARNESS=PASS"));
assert.ok(output.includes('"controlled_input_count": 6'));
assert.ok(output.includes('"unique_object_id_count": 6'));
assert.ok(output.includes('"registry_mode": "CONSISTENCY_HARNESS_ONLY"'));
assert.ok(output.includes('"historical_artifact_marker_embedding_required": false'));
assert.ok(output.includes('"legacy_artifact_rewrite_required": false'));
assert.ok(output.includes('"production_registry_enabled": false'));
assert.ok(output.includes('"registry_rewritten": false'));
assert.ok(output.includes('"history_rewritten": false'));
assert.ok(output.includes('"existing_urls_changed": false'));
assert.ok(output.includes('"access_granted": false'));
assert.ok(output.includes('"dispatch_authorized": false'));
assert.ok(output.includes('"execution_trace_created": false'));
assert.ok(output.includes('"effect_evidence_created": false'));

for (const text of [
  "HBCE Evidence Registry Consistency Harness",
  "R&amp;D EVIDENCE REGISTRY CONSISTENCY HARNESS ONLY",
  "HBCE_ACCESS_AUTHORIZATION_PREDICATE_DRAFT_FINAL_AUDIT=1",
  "ACTIVE_EVIDENCE_REGISTRY_CONSISTENCY_HARNESS",
  "HBCE-EVIDENCE-REGISTRY-CONSISTENCY-HARNESS-V001",
  "EVIDENCE_REGISTRY_CONSISTENCY_HARNESS=PASS",
  "Registry mode: CONSISTENCY_HARNESS_ONLY",
  "Controlled input count: 6",
  "Registry-declared expected markers are required",
  "Historical artifact marker embedding is not required",
  "Embedded marker presence is reported",
  "Legacy artifact rewrite is not required",
  "does not enable a production registry",
  "does not rewrite the registry",
  "does not rewrite history",
  "does not change existing URLs",
  "does not grant access",
  "does not authorize dispatch",
  "does not create execution traces",
  "does not create effect evidence",
  "HBCE-ACCESS-AUTHORIZATION-PREDICATE-DRAFT-V001",
  "PROG-273",
  "PROG-274"
]) {
  assert.ok(page.includes(text), text);
}

assert.ok(doc.includes("HBCE Evidence Registry Consistency Harness v001"));
assert.ok(doc.includes("EVIDENCE_REGISTRY_CONSISTENCY_HARNESS=PASS"));
assert.ok(doc.includes("historical artifact marker embedding is not required"));
assert.ok(doc.includes("does not grant access"));
assert.ok(doc.includes("does not create effect evidence"));

console.log("PROG_272_EVIDENCE_REGISTRY_CONSISTENCY_HARNESS_TEST=PASS");
