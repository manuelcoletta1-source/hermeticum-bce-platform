"use strict";

const assert = require("assert/strict");
const fs = require("fs");
const cp = require("child_process");

const manifestPath = "evidence/registry/20261003_HBCE_ACCESS_AUTHORIZATION_RECORD_PUBLIC_INDEX_REFRESH_v001.json";
const indexPath = "evidence/registry/20261003_HBCE_ACCESS_AUTHORIZATION_RECORD_PUBLIC_INDEX_v001.json";
const pagePath = "access-authorization-record-public-index-refresh.html";
const docPath = "docs/evidence/hbce-access-authorization-record-public-index-refresh-v001.md";
const toolPath = "tools/evidence/validate-access-authorization-record-public-index-refresh.js";

for (const path of [manifestPath, indexPath, pagePath, docPath, toolPath]) {
  assert.equal(fs.existsSync(path), true, path);
}

const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
const index = JSON.parse(fs.readFileSync(indexPath, "utf8"));
const page = fs.readFileSync(pagePath, "utf8");
const doc = fs.readFileSync(docPath, "utf8");
const output = cp.execFileSync(process.execPath, [toolPath], { encoding: "utf8" });

assert.equal(manifest.object_id, "HBCE-ACCESS-AUTHORIZATION-RECORD-PUBLIC-INDEX-REFRESH-V001");
assert.equal(manifest.refresh_id, "HBCE-ACCESS-AUTHORIZATION-RECORD-PUBLIC-INDEX-REFRESH-V001");
assert.equal(manifest.status, "ACTIVE_ACCESS_AUTHORIZATION_RECORD_PUBLIC_INDEX_REFRESH");
assert.equal(manifest.classification, "R_AND_D_ACCESS_AUTHORIZATION_RECORD_PUBLIC_INDEX_REFRESH_ONLY");
assert.equal(manifest.basis_marker, "HBCE_AUTHORIZATION_DECISION_RECORD_EVALUATION_HARNESS_FINAL_AUDIT=1");
assert.equal(manifest.expected_cli_marker, "ACCESS_AUTHORIZATION_RECORD_PUBLIC_INDEX_REFRESH=PASS");
assert.equal(manifest.refresh_scope.index_id, "HBCE-ACCESS-AUTHORIZATION-RECORD-PUBLIC-INDEX-V001");
assert.equal(manifest.refresh_scope.scope_id, "ACCESS_AUTHORIZATION_RECORD_CHAIN");
assert.equal(manifest.refresh_scope.refresh_mode, "CONTROLLED_PUBLIC_INDEX_REFRESH_ONLY");
assert.equal(manifest.refresh_scope.production_registry, false);
assert.equal(manifest.refresh_scope.grant_access, false);
assert.equal(manifest.refresh_scope.authorize_dispatch, false);
assert.equal(manifest.refresh_scope.authorize_execution, false);
assert.equal(manifest.indexed_chain.length, 4);
assert.equal(manifest.expected_result.indexed_chain_entry_count, 4);
assert.equal(manifest.result, "PASS_ACCESS_AUTHORIZATION_RECORD_PUBLIC_INDEX_REFRESH_MANIFEST_CREATED");

assert.equal(index.object_id, "HBCE-ACCESS-AUTHORIZATION-RECORD-PUBLIC-INDEX-V001");
assert.equal(index.index_id, "HBCE-ACCESS-AUTHORIZATION-RECORD-PUBLIC-INDEX-V001");
assert.equal(index.status, "ACTIVE_ACCESS_AUTHORIZATION_RECORD_PUBLIC_INDEX");
assert.equal(index.classification, "R_AND_D_ACCESS_AUTHORIZATION_RECORD_PUBLIC_INDEX_ONLY");
assert.equal(index.expected_cli_marker, "ACCESS_AUTHORIZATION_RECORD_PUBLIC_INDEX=PASS");
assert.equal(index.index_scope.scope_id, "ACCESS_AUTHORIZATION_RECORD_CHAIN");
assert.equal(index.index_scope.scope_mode, "CONTROLLED_PUBLIC_INDEX_ONLY");
assert.equal(index.index_scope.production_registry, false);
assert.equal(index.index_scope.grant_access, false);
assert.equal(index.index_scope.authorize_dispatch, false);
assert.equal(index.index_scope.authorize_execution, false);
assert.equal(index.entries.length, 4);
assert.equal(index.expected_entry_count, 4);
assert.equal(index.result, "PASS_ACCESS_AUTHORIZATION_RECORD_PUBLIC_INDEX_CREATED");

const expectedIds = [
  "HBCE-ACCESS-AUTHORIZATION-PREDICATE-DRAFT-V001",
  "HBCE-ACCESS-AUTHORIZATION-PREDICATE-EVALUATION-HARNESS-V001",
  "HBCE-ACCESS-AUTHORIZATION-DECISION-RECORD-DRAFT-V001",
  "HBCE-AUTHORIZATION-DECISION-RECORD-EVALUATION-HARNESS-V001"
];

assert.deepEqual(index.entries.map((entry) => entry.object_id), expectedIds);
assert.deepEqual(manifest.indexed_chain.map((entry) => entry.object_id), expectedIds);
assert.deepEqual(index.entries.map((entry) => entry.sequence), [1, 2, 3, 4]);
assert.deepEqual(manifest.indexed_chain.map((entry) => entry.sequence), [1, 2, 3, 4]);

assert.ok(output.includes("ACCESS_AUTHORIZATION_RECORD_PUBLIC_INDEX_REFRESH=PASS"));
assert.ok(output.includes("ACCESS_AUTHORIZATION_RECORD_PUBLIC_INDEX=PASS"));
assert.ok(output.includes('"refresh_id": "HBCE-ACCESS-AUTHORIZATION-RECORD-PUBLIC-INDEX-REFRESH-V001"'));
assert.ok(output.includes('"index_id": "HBCE-ACCESS-AUTHORIZATION-RECORD-PUBLIC-INDEX-V001"'));
assert.ok(output.includes('"scope_id": "ACCESS_AUTHORIZATION_RECORD_CHAIN"'));
assert.ok(output.includes('"indexed_chain_entry_count": 4'));
assert.ok(output.includes('"index_entry_count": 4'));
assert.ok(output.includes('"HBCE-ACCESS-AUTHORIZATION-PREDICATE-DRAFT-V001"'));
assert.ok(output.includes('"HBCE-AUTHORIZATION-DECISION-RECORD-EVALUATION-HARNESS-V001"'));
assert.ok(output.includes('"production_registry": false'));
assert.ok(output.includes('"access_granted": false'));
assert.ok(output.includes('"dispatch_authorized": false'));
assert.ok(output.includes('"execution_authorized": false'));
assert.ok(output.includes('"effect_evidence_created": false'));
assert.ok(output.includes('"legal_certification_created": false'));

for (const text of [
  "HBCE Access Authorization Record Public Index Refresh",
  "R&amp;D ACCESS AUTHORIZATION RECORD PUBLIC INDEX REFRESH ONLY",
  "HBCE_AUTHORIZATION_DECISION_RECORD_EVALUATION_HARNESS_FINAL_AUDIT=1",
  "ACTIVE_ACCESS_AUTHORIZATION_RECORD_PUBLIC_INDEX_REFRESH",
  "HBCE-ACCESS-AUTHORIZATION-RECORD-PUBLIC-INDEX-REFRESH-V001",
  "HBCE-ACCESS-AUTHORIZATION-RECORD-PUBLIC-INDEX-V001",
  "ACCESS_AUTHORIZATION_RECORD_PUBLIC_INDEX_REFRESH=PASS",
  "ACCESS_AUTHORIZATION_RECORD_PUBLIC_INDEX=PASS",
  "Scope id: ACCESS_AUTHORIZATION_RECORD_CHAIN",
  "Refresh mode: CONTROLLED_PUBLIC_INDEX_REFRESH_ONLY",
  "Index mode: CONTROLLED_PUBLIC_INDEX_ONLY",
  "Production registry: false",
  "Indexed chain entry count: 4",
  "HBCE-ACCESS-AUTHORIZATION-PREDICATE-DRAFT-V001",
  "HBCE-ACCESS-AUTHORIZATION-PREDICATE-EVALUATION-HARNESS-V001",
  "HBCE-ACCESS-AUTHORIZATION-DECISION-RECORD-DRAFT-V001",
  "HBCE-AUTHORIZATION-DECISION-RECORD-EVALUATION-HARNESS-V001",
  "ACCESS_AUTHORIZATION_PREDICATE_DRAFT=PASS",
  "ACCESS_AUTHORIZATION_PREDICATE_EVALUATION_HARNESS=PASS",
  "ACCESS_AUTHORIZATION_DECISION_RECORD_DRAFT=PASS",
  "AUTHORIZATION_DECISION_RECORD_EVALUATION_HARNESS=PASS",
  "does not create a production registry",
  "does not grant access",
  "does not authorize dispatch",
  "does not authorize execution",
  "does not enable a production authorization service",
  "does not create execution traces",
  "does not create effect evidence",
  "does not create legal certification",
  "PROG-278",
  "PROG-279"
]) {
  assert.ok(page.includes(text), text);
}

assert.ok(doc.includes("HBCE Access Authorization Record Public Index Refresh v001"));
assert.ok(doc.includes("HBCE-ACCESS-AUTHORIZATION-RECORD-PUBLIC-INDEX-REFRESH-V001"));
assert.ok(doc.includes("HBCE-ACCESS-AUTHORIZATION-RECORD-PUBLIC-INDEX-V001"));
assert.ok(doc.includes("ACCESS_AUTHORIZATION_RECORD_PUBLIC_INDEX_REFRESH=PASS"));
assert.ok(doc.includes("ACCESS_AUTHORIZATION_RECORD_PUBLIC_INDEX=PASS"));
assert.ok(doc.includes("Indexed chain entry count: `4`"));
assert.ok(doc.includes("HBCE-ACCESS-AUTHORIZATION-PREDICATE-DRAFT-V001"));
assert.ok(doc.includes("HBCE-AUTHORIZATION-DECISION-RECORD-EVALUATION-HARNESS-V001"));
assert.ok(doc.includes("ACCESS_AUTHORIZATION_DECISION_RECORD_DRAFT=PASS"));
assert.ok(doc.includes("AUTHORIZATION_DECISION_RECORD_EVALUATION_HARNESS=PASS"));
assert.ok(doc.includes("does not create a production registry"));
assert.ok(doc.includes("does not grant access"));
assert.ok(doc.includes("does not authorize dispatch"));
assert.ok(doc.includes("does not create effect evidence"));
assert.ok(doc.includes("does not create legal certification"));

console.log("PROG_277_ACCESS_AUTHORIZATION_RECORD_PUBLIC_INDEX_REFRESH_TEST=PASS");
