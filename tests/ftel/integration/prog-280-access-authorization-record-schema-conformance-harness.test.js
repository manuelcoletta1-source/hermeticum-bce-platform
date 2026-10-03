"use strict";

const assert = require("assert/strict");
const fs = require("fs");
const cp = require("child_process");

const harnessPath = "evidence/authorization/20261003_HBCE_ACCESS_AUTHORIZATION_RECORD_SCHEMA_CONFORMANCE_HARNESS_v001.json";
const schemaPath = "schemas/evidence/hbce-access-authorization-record-hardened.schema.v001.json";
const hardeningPath = "evidence/authorization/20261003_HBCE_ACCESS_AUTHORIZATION_RECORD_SCHEMA_HARDENING_v001.json";
const toolPath = "tools/evidence/validate-access-authorization-record-schema-conformance-harness.js";
const pagePath = "access-authorization-record-schema-conformance-harness.html";
const docPath = "docs/evidence/hbce-access-authorization-record-schema-conformance-harness-v001.md";

for (const path of [harnessPath, schemaPath, hardeningPath, toolPath, pagePath, docPath]) {
  assert.equal(fs.existsSync(path), true, path);
}

const harness = JSON.parse(fs.readFileSync(harnessPath, "utf8"));
const schema = JSON.parse(fs.readFileSync(schemaPath, "utf8"));
const hardening = JSON.parse(fs.readFileSync(hardeningPath, "utf8"));
const output = cp.execFileSync(process.execPath, [toolPath], { encoding: "utf8" });
const page = fs.readFileSync(pagePath, "utf8");
const doc = fs.readFileSync(docPath, "utf8");

assert.equal(harness.object_id, "HBCE-ACCESS-AUTHORIZATION-RECORD-SCHEMA-CONFORMANCE-HARNESS-V001");
assert.equal(harness.record_id, "HBCE-ACCESS-AUTHORIZATION-RECORD-SCHEMA-CONFORMANCE-HARNESS-V001");
assert.equal(harness.harness_id, "HBCE-ACCESS-AUTHORIZATION-RECORD-SCHEMA-CONFORMANCE-HARNESS-V001");
assert.equal(harness.artifact_type, "HBCEAccessAuthorizationRecordSchemaConformanceHarness");
assert.equal(harness.version, "v001");
assert.equal(harness.status, "ACTIVE_ACCESS_AUTHORIZATION_RECORD_SCHEMA_CONFORMANCE_HARNESS");
assert.equal(harness.classification, "R_AND_D_ACCESS_AUTHORIZATION_RECORD_SCHEMA_CONFORMANCE_HARNESS_ONLY");
assert.equal(harness.basis_marker, "HBCE_ACCESS_AUTHORIZATION_RECORD_SCHEMA_HARDENING_FINAL_AUDIT=1");
assert.equal(harness.basis_main_commit, "d0597a5ef1564612b3fb03346e4a2b889a732240");
assert.equal(harness.decision_scope, "ACCESS_AUTHORIZATION");
assert.equal(harness.authorization_level, "ACCESS_ONLY");
assert.equal(harness.harness_mode, "CONTROLLED_SCHEMA_CONFORMANCE_HARNESS_ONLY");
assert.equal(harness.expected_cli_marker, "ACCESS_AUTHORIZATION_RECORD_SCHEMA_CONFORMANCE_HARNESS=PASS");

assert.equal(schema.required.length, 20);
assert.equal(hardening.expected_result.required_field_count, 20);
assert.deepEqual(harness.allowed_decision_outcomes, hardening.allowed_decision_outcomes);
assert.deepEqual(harness.allowed_decision_outcomes, schema.properties.decision_outcome.enum);

assert.equal(harness.conformance_cases.length, 12);
assert.equal(harness.expected_result.conformance_case_count, 12);
assert.equal(harness.expected_result.positive_case_count, 2);
assert.equal(harness.expected_result.negative_case_count, 10);
assert.equal(harness.expected_result.required_non_claim_count, 13);
assert.equal(harness.expected_result.required_no_execution_boundary_count, 13);
assert.equal(harness.expected_result.source_chain_entry_count, 4);
assert.equal(harness.expected_result.result, "PASS_ACCESS_AUTHORIZATION_RECORD_SCHEMA_CONFORMANCE_HARNESS");
assert.equal(harness.result, "PASS_ACCESS_AUTHORIZATION_RECORD_SCHEMA_CONFORMANCE_HARNESS_CREATED");

assert.deepEqual(harness.conformance_cases.map((entry) => entry.case_id), [
  "CASE-001-VALID-SCHEMA-HARDENING-RECORD",
  "CASE-002-VALID-UNKNOWN-FAIL-CLOSED-RECORD",
  "CASE-003-MISSING-REQUIRED-FIELD",
  "CASE-004-ADDITIONAL-PROPERTY",
  "CASE-005-INVALID-DECISION-SCOPE",
  "CASE-006-INVALID-AUTHORIZATION-LEVEL",
  "CASE-007-ILLEGAL-DECISION-OUTCOME",
  "CASE-008-ACCESS-GRANTED-TRUE",
  "CASE-009-DISPATCH-AUTHORIZED-TRUE",
  "CASE-010-EXECUTION-AUTHORIZED-TRUE",
  "CASE-011-NON-CLAIM-FALSE",
  "CASE-012-NO-EXECUTION-BOUNDARY-TRUE"
]);

assert.equal(harness.conformance_cases.filter((entry) => entry.expected_conformance === "PASS").length, 2);
assert.equal(harness.conformance_cases.filter((entry) => entry.expected_conformance === "FAIL").length, 10);

assert.equal(harness.record_boundary.record_only, true);
for (const [key, value] of Object.entries(harness.record_boundary)) {
  if (key !== "record_only") assert.equal(value, false, key);
}

for (const value of Object.values(harness.explicit_non_claims)) {
  assert.equal(value, true);
}

for (const value of Object.values(harness.no_execution_boundary)) {
  assert.equal(value, false);
}

for (const text of [
  "ACCESS_AUTHORIZATION_RECORD_SCHEMA_CONFORMANCE_HARNESS=PASS",
  "\"harness_id\": \"HBCE-ACCESS-AUTHORIZATION-RECORD-SCHEMA-CONFORMANCE-HARNESS-V001\"",
  "\"decision_scope\": \"ACCESS_AUTHORIZATION\"",
  "\"authorization_level\": \"ACCESS_ONLY\"",
  "\"harness_mode\": \"CONTROLLED_SCHEMA_CONFORMANCE_HARNESS_ONLY\"",
  "\"required_field_count\": 20",
  "\"allowed_decision_outcome_count\": 7",
  "\"conformance_case_count\": 12",
  "\"positive_case_count\": 2",
  "\"negative_case_count\": 10",
  "\"required_non_claim_count\": 13",
  "\"required_no_execution_boundary_count\": 13",
  "\"source_chain_entry_count\": 4",
  "\"case_id\": \"CASE-001-VALID-SCHEMA-HARDENING-RECORD\"",
  "\"case_id\": \"CASE-012-NO-EXECUTION-BOUNDARY-TRUE\"",
  "\"access_granted\": false",
  "\"dispatch_authorized\": false",
  "\"execution_authorized\": false",
  "\"effect_evidence_created\": false",
  "\"legal_certification_created\": false"
]) {
  assert.ok(output.includes(text), text);
}

for (const text of [
  "HBCE Access Authorization Record Schema Conformance Harness",
  "R&amp;D ACCESS AUTHORIZATION RECORD SCHEMA CONFORMANCE HARNESS ONLY",
  "HBCE_ACCESS_AUTHORIZATION_RECORD_SCHEMA_HARDENING_FINAL_AUDIT=1",
  "ACTIVE_ACCESS_AUTHORIZATION_RECORD_SCHEMA_CONFORMANCE_HARNESS",
  "HBCE-ACCESS-AUTHORIZATION-RECORD-SCHEMA-CONFORMANCE-HARNESS-V001",
  "ACCESS_AUTHORIZATION_RECORD_SCHEMA_CONFORMANCE_HARNESS=PASS",
  "Decision scope: ACCESS_AUTHORIZATION",
  "Authorization level: ACCESS_ONLY",
  "Harness mode: CONTROLLED_SCHEMA_CONFORMANCE_HARNESS_ONLY",
  "Required field count: 20",
  "Allowed decision outcome count: 7",
  "Conformance case count: 12",
  "Positive case count: 2",
  "Negative case count: 10",
  "Required explicit non-claim count: 13",
  "Required no-execution boundary count: 13",
  "Source chain entry count: 4",
  "CASE-001-VALID-SCHEMA-HARDENING-RECORD expected PASS",
  "CASE-012-NO-EXECUTION-BOUNDARY-TRUE expected FAIL",
  "ACCESS_AUTHORIZATION_APPROVED_RECORD_ONLY",
  "RUNTIME_ACCESS_GATE_UNKNOWN_FAIL_CLOSED_RECORD_ONLY",
  "SCHEMA_HARDENING_RECORD_ONLY",
  "HBCE-ACCESS-AUTHORIZATION-RECORD-SCHEMA-HARDENING-V001",
  "hbce-access-authorization-record-hardened.schema.v001.json",
  "HBCE-RUNTIME-ACCESS-GATE-DRAFT-V001",
  "HBCE-ACCESS-AUTHORIZATION-DECISION-RECORD-DRAFT-V001",
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
  "HBCE Access Authorization Record Schema Conformance Harness v001",
  "HBCE_ACCESS_AUTHORIZATION_RECORD_SCHEMA_HARDENING_FINAL_AUDIT=1",
  "HBCE-ACCESS-AUTHORIZATION-RECORD-SCHEMA-CONFORMANCE-HARNESS-V001",
  "ACCESS_AUTHORIZATION_RECORD_SCHEMA_CONFORMANCE_HARNESS=PASS",
  "ACCESS_AUTHORIZATION",
  "ACCESS_ONLY",
  "CONTROLLED_SCHEMA_CONFORMANCE_HARNESS_ONLY",
  "Required field count: `20`",
  "Allowed decision outcome count: `7`",
  "Conformance case count: `12`",
  "Positive case count: `2`",
  "Negative case count: `10`",
  "CASE-001-VALID-SCHEMA-HARDENING-RECORD",
  "CASE-012-NO-EXECUTION-BOUNDARY-TRUE",
  "SCHEMA_HARDENING_RECORD_ONLY",
  "does not implement a runtime gate",
  "does not enable a runtime gate",
  "does not grant access",
  "does not authorize dispatch",
  "does not create effect evidence",
  "does not create legal certification"
]) {
  assert.ok(doc.includes(text), text);
}

console.log("PROG_280_ACCESS_AUTHORIZATION_RECORD_SCHEMA_CONFORMANCE_HARNESS_TEST=PASS");
