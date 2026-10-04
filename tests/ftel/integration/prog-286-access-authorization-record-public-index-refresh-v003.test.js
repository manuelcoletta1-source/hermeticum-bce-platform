"use strict";

const assert = require("assert/strict");
const fs = require("fs");
const cp = require("child_process");

const indexPath = "evidence/registry/20261004_HBCE_ACCESS_AUTHORIZATION_RECORD_PUBLIC_INDEX_v003.json";
const refreshPath = "evidence/registry/20261004_HBCE_ACCESS_AUTHORIZATION_RECORD_PUBLIC_INDEX_REFRESH_v003.json";
const toolPath = "tools/evidence/validate-access-authorization-record-public-index-refresh-v003.js";
const pagePath = "access-authorization-record-public-index-refresh-v003.html";
const docPath = "docs/evidence/hbce-access-authorization-record-public-index-refresh-v003.md";

for (const path of [indexPath, refreshPath, toolPath, pagePath, docPath]) {
  assert.equal(fs.existsSync(path), true, path);
}

const index = JSON.parse(fs.readFileSync(indexPath, "utf8"));
const refresh = JSON.parse(fs.readFileSync(refreshPath, "utf8"));
const output = cp.execFileSync(process.execPath, [toolPath], { encoding: "utf8" });
const page = fs.readFileSync(pagePath, "utf8");
const doc = fs.readFileSync(docPath, "utf8");

assert.equal(index.object_id, "HBCE-ACCESS-AUTHORIZATION-RECORD-PUBLIC-INDEX-V003");
assert.equal(refresh.object_id, "HBCE-ACCESS-AUTHORIZATION-RECORD-PUBLIC-INDEX-REFRESH-V003");
assert.equal(index.basis_marker, "HBCE_POSITIVE_AUTHORIZATION_CONTRACT_EVALUATION_HARNESS_FINAL_AUDIT=1");
assert.equal(refresh.basis_marker, "HBCE_POSITIVE_AUTHORIZATION_CONTRACT_EVALUATION_HARNESS_FINAL_AUDIT=1");
assert.equal(index.basis_main_commit, "c778950decb4c37cdb225855d5eb32acaab02317");
assert.equal(refresh.basis_main_commit, "c778950decb4c37cdb225855d5eb32acaab02317");
assert.equal(index.previous_index, "HBCE-ACCESS-AUTHORIZATION-RECORD-PUBLIC-INDEX-V002");
assert.equal(refresh.previous_index, "HBCE-ACCESS-AUTHORIZATION-RECORD-PUBLIC-INDEX-V002");
assert.equal(refresh.new_index, "HBCE-ACCESS-AUTHORIZATION-RECORD-PUBLIC-INDEX-V003");
assert.equal(index.decision_scope, "ACCESS_AUTHORIZATION");
assert.equal(refresh.decision_scope, "ACCESS_AUTHORIZATION");
assert.equal(index.authorization_level, "ACCESS_ONLY");
assert.equal(refresh.authorization_level, "ACCESS_ONLY");
assert.equal(index.indexed_object_count, 11);
assert.equal(refresh.indexed_object_count, 11);
assert.equal(index.added_object_count, 3);
assert.equal(refresh.added_object_count, 3);
assert.equal(index.expected_cli_marker, "ACCESS_AUTHORIZATION_RECORD_PUBLIC_INDEX_V003=PASS");
assert.equal(refresh.expected_cli_marker, "ACCESS_AUTHORIZATION_RECORD_PUBLIC_INDEX_REFRESH_V003=PASS");

assert.deepEqual(index.added_in_v003, [
  "HBCE-RUNTIME-ACCESS-GATE-INTEGRATION-BOUNDARY-DRAFT-V001",
  "HBCE-POSITIVE-AUTHORIZATION-CONTRACT-DRAFT-V001",
  "HBCE-POSITIVE-AUTHORIZATION-CONTRACT-EVALUATION-HARNESS-V001"
]);

assert.deepEqual(index.category_counts, {
  predicate_record: 2,
  decision_record: 2,
  runtime_gate_record: 3,
  schema_record: 2,
  positive_authorization_contract_record: 2
});

assert.deepEqual(refresh.category_counts, index.category_counts);
assert.equal(index.indexed_objects.length, 11);
assert.equal(refresh.refresh_source_chain.length, 4);
assert.deepEqual(index.indexed_objects.map((entry) => entry.sequence), [1,2,3,4,5,6,7,8,9,10,11]);
assert.deepEqual(refresh.refresh_source_chain.map((entry) => entry.sequence), [1,2,3,4]);

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
  "ACCESS_AUTHORIZATION_RECORD_PUBLIC_INDEX_V003=PASS",
  "ACCESS_AUTHORIZATION_RECORD_PUBLIC_INDEX_REFRESH_V003=PASS",
  "\"index_id\": \"HBCE-ACCESS-AUTHORIZATION-RECORD-PUBLIC-INDEX-V003\"",
  "\"refresh_id\": \"HBCE-ACCESS-AUTHORIZATION-RECORD-PUBLIC-INDEX-REFRESH-V003\"",
  "\"basis_marker\": \"HBCE_POSITIVE_AUTHORIZATION_CONTRACT_EVALUATION_HARNESS_FINAL_AUDIT=1\"",
  "\"basis_main_commit\": \"c778950decb4c37cdb225855d5eb32acaab02317\"",
  "\"previous_index\": \"HBCE-ACCESS-AUTHORIZATION-RECORD-PUBLIC-INDEX-V002\"",
  "\"indexed_object_count\": 11",
  "\"added_object_count\": 3",
  "\"predicate_record_count\": 2",
  "\"decision_record_count\": 2",
  "\"runtime_gate_record_count\": 3",
  "\"schema_record_count\": 2",
  "\"positive_authorization_contract_record_count\": 2",
  "\"required_non_claim_count\": 14",
  "\"required_no_execution_boundary_count\": 14",
  "\"positive_authorization_contract_issued\": false",
  "\"access_granted\": false",
  "\"dispatch_authorized\": false",
  "\"execution_authorized\": false",
  "\"effect_evidence_created\": false",
  "\"legal_certification_created\": false"
]) {
  assert.ok(output.includes(text), text);
}

for (const text of [
  "HBCE Access Authorization Record Public Index Refresh v003",
  "R&amp;D PUBLIC EVIDENCE INDEX REFRESH ONLY",
  "HBCE_POSITIVE_AUTHORIZATION_CONTRACT_EVALUATION_HARNESS_FINAL_AUDIT=1",
  "HBCE-ACCESS-AUTHORIZATION-RECORD-PUBLIC-INDEX-V003",
  "HBCE-ACCESS-AUTHORIZATION-RECORD-PUBLIC-INDEX-REFRESH-V003",
  "ACCESS_AUTHORIZATION_RECORD_PUBLIC_INDEX_V003=PASS",
  "ACCESS_AUTHORIZATION_RECORD_PUBLIC_INDEX_REFRESH_V003=PASS",
  "Previous index: HBCE-ACCESS-AUTHORIZATION-RECORD-PUBLIC-INDEX-V002",
  "Decision scope: ACCESS_AUTHORIZATION",
  "Authorization level: ACCESS_ONLY",
  "Indexed object count: 11",
  "Added object count: 3",
  "Predicate record count: 2",
  "Decision record count: 2",
  "Runtime gate record count: 3",
  "Schema record count: 2",
  "Positive authorization contract record count: 2",
  "Required explicit non-claim count: 14",
  "Required no-execution boundary count: 14",
  "HBCE-RUNTIME-ACCESS-GATE-INTEGRATION-BOUNDARY-DRAFT-V001",
  "HBCE-POSITIVE-AUTHORIZATION-CONTRACT-DRAFT-V001",
  "HBCE-POSITIVE-AUTHORIZATION-CONTRACT-EVALUATION-HARNESS-V001",
  "HBCE-ACCESS-AUTHORIZATION-PREDICATE-DRAFT-V001",
  "HBCE-RUNTIME-ACCESS-GATE-EVALUATION-HARNESS-V001",
  "does not implement a runtime gate",
  "does not enable a runtime gate",
  "does not issue a positive authorization contract",
  "does not grant access",
  "does not authorize dispatch",
  "does not authorize execution",
  "does not create effect evidence",
  "does not create legal certification"
]) {
  assert.ok(page.includes(text), text);
}

for (const text of [
  "HBCE Access Authorization Record Public Index Refresh v003",
  "HBCE_POSITIVE_AUTHORIZATION_CONTRACT_EVALUATION_HARNESS_FINAL_AUDIT=1",
  "HBCE-ACCESS-AUTHORIZATION-RECORD-PUBLIC-INDEX-V003",
  "HBCE-ACCESS-AUTHORIZATION-RECORD-PUBLIC-INDEX-REFRESH-V003",
  "ACCESS_AUTHORIZATION_RECORD_PUBLIC_INDEX_V003=PASS",
  "ACCESS_AUTHORIZATION_RECORD_PUBLIC_INDEX_REFRESH_V003=PASS",
  "Indexed object count: `11`",
  "Added object count: `3`",
  "Predicate record count: `2`",
  "Decision record count: `2`",
  "Runtime gate record count: `3`",
  "Schema record count: `2`",
  "Positive authorization contract record count: `2`",
  "Required explicit non-claim count: `14`",
  "Required no-execution boundary count: `14`",
  "HBCE-RUNTIME-ACCESS-GATE-INTEGRATION-BOUNDARY-DRAFT-V001",
  "HBCE-POSITIVE-AUTHORIZATION-CONTRACT-DRAFT-V001",
  "HBCE-POSITIVE-AUTHORIZATION-CONTRACT-EVALUATION-HARNESS-V001",
  "HBCE-ACCESS-AUTHORIZATION-RECORD-PUBLIC-INDEX-V002",
  "does not issue a positive authorization contract",
  "does not grant access",
  "does not authorize dispatch",
  "does not create effect evidence",
  "does not create legal certification"
]) {
  assert.ok(doc.includes(text), text);
}

console.log("PROG_286_ACCESS_AUTHORIZATION_RECORD_PUBLIC_INDEX_REFRESH_V003_TEST=PASS");
