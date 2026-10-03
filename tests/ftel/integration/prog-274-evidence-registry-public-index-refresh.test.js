"use strict";

const assert = require("assert/strict");
const fs = require("fs");
const cp = require("child_process");

const manifestPath = "evidence/registry/20261003_HBCE_EVIDENCE_REGISTRY_PUBLIC_INDEX_REFRESH_v001.json";
const indexPath = "evidence/registry/20261003_HBCE_PUBLIC_EVIDENCE_REGISTRY_INDEX_v002.json";
const pagePath = "evidence-registry-public-index-refresh.html";
const docPath = "docs/evidence/hbce-evidence-registry-public-index-refresh-v001.md";
const toolPath = "tools/evidence/validate-evidence-registry-public-index-refresh.js";

for (const path of [manifestPath, indexPath, pagePath, docPath, toolPath]) {
  assert.equal(fs.existsSync(path), true, path);
}

const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
const index = JSON.parse(fs.readFileSync(indexPath, "utf8"));
const page = fs.readFileSync(pagePath, "utf8");
const doc = fs.readFileSync(docPath, "utf8");
const output = cp.execFileSync(process.execPath, [toolPath], { encoding: "utf8" });

assert.equal(manifest.object_id, "HBCE-EVIDENCE-REGISTRY-PUBLIC-INDEX-REFRESH-V001");
assert.equal(manifest.status, "ACTIVE_EVIDENCE_REGISTRY_PUBLIC_INDEX_REFRESH");
assert.equal(manifest.basis_marker, "HBCE_ACCESS_AUTHORIZATION_PREDICATE_EVALUATION_HARNESS_FINAL_AUDIT=1");
assert.equal(manifest.expected_cli_marker, "EVIDENCE_REGISTRY_PUBLIC_INDEX_REFRESH=PASS");
assert.equal(manifest.expected_result.registry_entry_count, 8);
assert.equal(manifest.expected_result.index_version, "v002");
assert.equal(manifest.registry_entries.length, 8);
assert.equal(manifest.result, "PASS_EVIDENCE_REGISTRY_PUBLIC_INDEX_REFRESH_MANIFEST_CREATED");

assert.equal(index.object_id, "HBCE-PUBLIC-EVIDENCE-REGISTRY-INDEX-V002");
assert.equal(index.status, "ACTIVE_PUBLIC_EVIDENCE_REGISTRY_INDEX_REFRESHED");
assert.equal(index.source_refresh_id, "HBCE-EVIDENCE-REGISTRY-PUBLIC-INDEX-REFRESH-V001");
assert.equal(index.entry_count, 8);
assert.equal(index.entries.length, 8);
assert.equal(index.result, "PASS_PUBLIC_EVIDENCE_REGISTRY_INDEX_V002_CREATED");

assert.equal(manifest.refresh_scope.refresh_mode, "PUBLIC_INDEX_REFRESH_ONLY");
assert.equal(manifest.refresh_scope.index_version, "v002");
assert.equal(manifest.refresh_scope.rewrite_history, false);
assert.equal(manifest.refresh_scope.change_existing_urls, false);
assert.equal(manifest.refresh_scope.production_registry, false);
assert.equal(manifest.refresh_scope.grant_access, false);
assert.equal(manifest.refresh_scope.authorize_dispatch, false);
assert.equal(manifest.refresh_scope.create_execution_trace, false);
assert.equal(manifest.refresh_scope.create_effect_evidence, false);

assert.ok(output.includes("EVIDENCE_REGISTRY_PUBLIC_INDEX_REFRESH=PASS"));
assert.ok(output.includes('"index_id": "HBCE-PUBLIC-EVIDENCE-REGISTRY-INDEX-V002"'));
assert.ok(output.includes('"index_version": "v002"'));
assert.ok(output.includes('"registry_entry_count": 8'));
assert.ok(output.includes('"unique_entry_id_count": 8'));
assert.ok(output.includes('"unique_object_id_count": 8'));
assert.ok(output.includes('"previous_public_registry_index_present": true'));
assert.ok(output.includes('"production_registry_enabled": false'));
assert.ok(output.includes('"registry_rewritten": false'));
assert.ok(output.includes('"history_rewritten": false'));
assert.ok(output.includes('"existing_urls_changed": false'));
assert.ok(output.includes('"access_granted": false'));
assert.ok(output.includes('"dispatch_authorized": false'));
assert.ok(output.includes('"execution_trace_created": false'));
assert.ok(output.includes('"effect_evidence_created": false'));

for (const text of [
  "HBCE Evidence Registry Public Index Refresh",
  "R&amp;D PUBLIC INDEX REFRESH ONLY",
  "HBCE_ACCESS_AUTHORIZATION_PREDICATE_EVALUATION_HARNESS_FINAL_AUDIT=1",
  "ACTIVE_EVIDENCE_REGISTRY_PUBLIC_INDEX_REFRESH",
  "HBCE-EVIDENCE-REGISTRY-PUBLIC-INDEX-REFRESH-V001",
  "HBCE-PUBLIC-EVIDENCE-REGISTRY-INDEX-V002",
  "EVIDENCE_REGISTRY_PUBLIC_INDEX_REFRESH=PASS",
  "Refresh mode: PUBLIC_INDEX_REFRESH_ONLY",
  "Index version: v002",
  "Registry entry count: 8",
  "Previous public registry index",
  "New public registry index",
  "does not enable a production registry",
  "does not rewrite the registry",
  "does not rewrite history",
  "does not change existing URLs",
  "does not grant access",
  "does not authorize dispatch",
  "does not create execution traces",
  "does not create effect evidence",
  "REG-008-ACCESS-AUTHORIZATION-PREDICATE-EVALUATION-HARNESS",
  "PROG-275",
  "PROG-276"
]) {
  assert.ok(page.includes(text), text);
}

assert.ok(doc.includes("HBCE Evidence Registry Public Index Refresh v001"));
assert.ok(doc.includes("HBCE-PUBLIC-EVIDENCE-REGISTRY-INDEX-V002"));
assert.ok(doc.includes("EVIDENCE_REGISTRY_PUBLIC_INDEX_REFRESH=PASS"));
assert.ok(doc.includes("registry entry count: `8`"));
assert.ok(doc.includes("does not enable a production registry"));
assert.ok(doc.includes("does not grant access"));
assert.ok(doc.includes("does not create effect evidence"));

console.log("PROG_274_EVIDENCE_REGISTRY_PUBLIC_INDEX_REFRESH_TEST=PASS");
