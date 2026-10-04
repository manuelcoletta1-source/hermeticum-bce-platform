"use strict";

const assert = require("assert/strict");
const fs = require("fs");
const cp = require("child_process");

const indexPath = "evidence/registry/20261004_HBCE_ACCESS_AUTHORIZATION_RECORD_PUBLIC_INDEX_v002.json";
const refreshPath = "evidence/registry/20261004_HBCE_ACCESS_AUTHORIZATION_RECORD_PUBLIC_INDEX_REFRESH_v002.json";
const toolPath = "tools/evidence/validate-access-authorization-record-public-index-refresh-v002.js";
const pagePath = "access-authorization-record-public-index-refresh-v002.html";
const docPath = "docs/evidence/hbce-access-authorization-record-public-index-refresh-v002.md";

for (const path of [indexPath, refreshPath, toolPath, pagePath, docPath]) {
  assert.equal(fs.existsSync(path), true, path);
}

const index = JSON.parse(fs.readFileSync(indexPath, "utf8"));
const refresh = JSON.parse(fs.readFileSync(refreshPath, "utf8"));
const output = cp.execFileSync(process.execPath, [toolPath], { encoding: "utf8" });
const page = fs.readFileSync(pagePath, "utf8");
const doc = fs.readFileSync(docPath, "utf8");

assert.equal(index.object_id, "HBCE-ACCESS-AUTHORIZATION-RECORD-PUBLIC-INDEX-V002");
assert.equal(refresh.object_id, "HBCE-ACCESS-AUTHORIZATION-RECORD-PUBLIC-INDEX-REFRESH-V002");
assert.equal(index.basis_marker, "HBCE_RUNTIME_ACCESS_GATE_EVALUATION_HARNESS_FINAL_AUDIT=1");
assert.equal(refresh.basis_marker, "HBCE_RUNTIME_ACCESS_GATE_EVALUATION_HARNESS_FINAL_AUDIT=1");
assert.equal(index.basis_main_commit, "7c4e257d89ae4e463e85ac5e2ac84ab5dcb6ce9c");
assert.equal(refresh.basis_main_commit, "7c4e257d89ae4e463e85ac5e2ac84ab5dcb6ce9c");
assert.equal(index.decision_scope, "ACCESS_AUTHORIZATION");
assert.equal(refresh.decision_scope, "ACCESS_AUTHORIZATION");
assert.equal(index.authorization_level, "ACCESS_ONLY");
assert.equal(refresh.authorization_level, "ACCESS_ONLY");
assert.equal(index.expected_cli_marker, "ACCESS_AUTHORIZATION_RECORD_PUBLIC_INDEX_V002=PASS");
assert.equal(refresh.expected_cli_marker, "ACCESS_AUTHORIZATION_RECORD_PUBLIC_INDEX_REFRESH_V002=PASS");
assert.equal(index.indexed_object_count, 8);
assert.equal(index.indexed_objects.length, 8);
assert.equal(refresh.added_object_count, 4);
assert.equal(refresh.total_indexed_object_count, 8);
assert.equal(refresh.added_objects.length, 4);

assert.equal(index.chain_summary.predicate_record_count, 2);
assert.equal(index.chain_summary.decision_record_count, 2);
assert.equal(index.chain_summary.runtime_gate_record_count, 2);
assert.equal(index.chain_summary.schema_record_count, 2);
assert.equal(index.chain_summary.total_record_count, 8);
assert.equal(index.chain_summary.latest_indexed_object, "HBCE-RUNTIME-ACCESS-GATE-EVALUATION-HARNESS-V001");

assert.deepEqual(index.indexed_objects.map((entry) => entry.object_id), [
  "HBCE-ACCESS-AUTHORIZATION-PREDICATE-DRAFT-V001",
  "HBCE-ACCESS-AUTHORIZATION-PREDICATE-EVALUATION-HARNESS-V001",
  "HBCE-ACCESS-AUTHORIZATION-DECISION-RECORD-DRAFT-V001",
  "HBCE-AUTHORIZATION-DECISION-RECORD-EVALUATION-HARNESS-V001",
  "HBCE-RUNTIME-ACCESS-GATE-DRAFT-V001",
  "HBCE-ACCESS-AUTHORIZATION-RECORD-SCHEMA-HARDENING-V001",
  "HBCE-ACCESS-AUTHORIZATION-RECORD-SCHEMA-CONFORMANCE-HARNESS-V001",
  "HBCE-RUNTIME-ACCESS-GATE-EVALUATION-HARNESS-V001"
]);

assert.deepEqual(refresh.added_objects.map((entry) => entry.object_id), [
  "HBCE-RUNTIME-ACCESS-GATE-DRAFT-V001",
  "HBCE-ACCESS-AUTHORIZATION-RECORD-SCHEMA-HARDENING-V001",
  "HBCE-ACCESS-AUTHORIZATION-RECORD-SCHEMA-CONFORMANCE-HARNESS-V001",
  "HBCE-RUNTIME-ACCESS-GATE-EVALUATION-HARNESS-V001"
]);

for (const value of Object.values(index.explicit_non_claims)) {
  assert.equal(value, true);
}
for (const value of Object.values(refresh.explicit_non_claims)) {
  assert.equal(value, true);
}
for (const value of Object.values(index.no_execution_boundary)) {
  assert.equal(value, false);
}
for (const value of Object.values(refresh.no_execution_boundary)) {
  assert.equal(value, false);
}

for (const text of [
  "ACCESS_AUTHORIZATION_RECORD_PUBLIC_INDEX_REFRESH_V002=PASS",
  "ACCESS_AUTHORIZATION_RECORD_PUBLIC_INDEX_V002=PASS",
  "\"index_object_id\": \"HBCE-ACCESS-AUTHORIZATION-RECORD-PUBLIC-INDEX-V002\"",
  "\"refresh_object_id\": \"HBCE-ACCESS-AUTHORIZATION-RECORD-PUBLIC-INDEX-REFRESH-V002\"",
  "\"basis_marker\": \"HBCE_RUNTIME_ACCESS_GATE_EVALUATION_HARNESS_FINAL_AUDIT=1\"",
  "\"decision_scope\": \"ACCESS_AUTHORIZATION\"",
  "\"authorization_level\": \"ACCESS_ONLY\"",
  "\"indexed_object_count\": 8",
  "\"added_object_count\": 4",
  "\"total_indexed_object_count\": 8",
  "\"predicate_record_count\": 2",
  "\"decision_record_count\": 2",
  "\"runtime_gate_record_count\": 2",
  "\"schema_record_count\": 2",
  "\"access_granted\": false",
  "\"dispatch_authorized\": false",
  "\"execution_authorized\": false",
  "\"effect_evidence_created\": false",
  "\"legal_certification_created\": false"
]) {
  assert.ok(output.includes(text), text);
}

for (const text of [
  "HBCE Access Authorization Record Public Index Refresh v002",
  "R&amp;D ACCESS AUTHORIZATION RECORD PUBLIC INDEX REFRESH ONLY",
  "HBCE_RUNTIME_ACCESS_GATE_EVALUATION_HARNESS_FINAL_AUDIT=1",
  "ACTIVE_ACCESS_AUTHORIZATION_RECORD_PUBLIC_INDEX_REFRESH_V002",
  "HBCE-ACCESS-AUTHORIZATION-RECORD-PUBLIC-INDEX-REFRESH-V002",
  "HBCE-ACCESS-AUTHORIZATION-RECORD-PUBLIC-INDEX-V002",
  "ACCESS_AUTHORIZATION_RECORD_PUBLIC_INDEX_REFRESH_V002=PASS",
  "ACCESS_AUTHORIZATION_RECORD_PUBLIC_INDEX_V002=PASS",
  "Decision scope: ACCESS_AUTHORIZATION",
  "Authorization level: ACCESS_ONLY",
  "Indexed object count: 8",
  "Added object count: 4",
  "Total indexed object count: 8",
  "Predicate record count: 2",
  "Decision record count: 2",
  "Runtime gate record count: 2",
  "Schema record count: 2",
  "HBCE-ACCESS-AUTHORIZATION-PREDICATE-DRAFT-V001",
  "HBCE-ACCESS-AUTHORIZATION-PREDICATE-EVALUATION-HARNESS-V001",
  "HBCE-ACCESS-AUTHORIZATION-DECISION-RECORD-DRAFT-V001",
  "HBCE-AUTHORIZATION-DECISION-RECORD-EVALUATION-HARNESS-V001",
  "HBCE-RUNTIME-ACCESS-GATE-DRAFT-V001",
  "HBCE-ACCESS-AUTHORIZATION-RECORD-SCHEMA-HARDENING-V001",
  "HBCE-ACCESS-AUTHORIZATION-RECORD-SCHEMA-CONFORMANCE-HARNESS-V001",
  "HBCE-RUNTIME-ACCESS-GATE-EVALUATION-HARNESS-V001",
  "ACCESS_AUTHORIZATION_PREDICATE_DRAFT=PASS",
  "ACCESS_AUTHORIZATION_PREDICATE_EVALUATION_HARNESS=PASS",
  "ACCESS_AUTHORIZATION_DECISION_RECORD_DRAFT=PASS",
  "AUTHORIZATION_DECISION_RECORD_EVALUATION_HARNESS=PASS",
  "RUNTIME_ACCESS_GATE_DRAFT=PASS",
  "ACCESS_AUTHORIZATION_RECORD_SCHEMA_HARDENING=PASS",
  "ACCESS_AUTHORIZATION_RECORD_SCHEMA_CONFORMANCE_HARNESS=PASS",
  "RUNTIME_ACCESS_GATE_EVALUATION_HARNESS=PASS",
  "does not implement a runtime gate",
  "does not enable a runtime gate",
  "does not grant access",
  "does not authorize dispatch",
  "does not authorize execution",
  "does not create execution traces",
  "does not create effect evidence",
  "does not create legal certification"
]) {
  assert.ok(page.includes(text), text);
}

for (const text of [
  "HBCE Access Authorization Record Public Index Refresh v002",
  "HBCE_RUNTIME_ACCESS_GATE_EVALUATION_HARNESS_FINAL_AUDIT=1",
  "HBCE-ACCESS-AUTHORIZATION-RECORD-PUBLIC-INDEX-REFRESH-V002",
  "HBCE-ACCESS-AUTHORIZATION-RECORD-PUBLIC-INDEX-V002",
  "ACCESS_AUTHORIZATION_RECORD_PUBLIC_INDEX_REFRESH_V002=PASS",
  "ACCESS_AUTHORIZATION_RECORD_PUBLIC_INDEX_V002=PASS",
  "ACCESS_AUTHORIZATION",
  "ACCESS_ONLY",
  "Indexed object count: `8`",
  "Added object count: `4`",
  "Total indexed object count: `8`",
  "Predicate record count: `2`",
  "Decision record count: `2`",
  "Runtime gate record count: `2`",
  "Schema record count: `2`",
  "HBCE-RUNTIME-ACCESS-GATE-DRAFT-V001",
  "HBCE-ACCESS-AUTHORIZATION-RECORD-SCHEMA-HARDENING-V001",
  "HBCE-ACCESS-AUTHORIZATION-RECORD-SCHEMA-CONFORMANCE-HARNESS-V001",
  "HBCE-RUNTIME-ACCESS-GATE-EVALUATION-HARNESS-V001",
  "does not implement a runtime gate",
  "does not enable a runtime gate",
  "does not grant access",
  "does not authorize dispatch",
  "does not create effect evidence",
  "does not create legal certification"
]) {
  assert.ok(doc.includes(text), text);
}

console.log("PROG_282_ACCESS_AUTHORIZATION_RECORD_PUBLIC_INDEX_REFRESH_V002_TEST=PASS");
