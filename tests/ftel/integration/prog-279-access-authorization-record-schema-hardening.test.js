"use strict";

const assert = require("assert/strict");
const fs = require("fs");
const cp = require("child_process");

const schemaPath = "schemas/evidence/hbce-access-authorization-record-hardened.schema.v001.json";
const manifestPath = "evidence/authorization/20261003_HBCE_ACCESS_AUTHORIZATION_RECORD_SCHEMA_HARDENING_v001.json";
const pagePath = "access-authorization-record-schema-hardening.html";
const docPath = "docs/evidence/hbce-access-authorization-record-schema-hardening-v001.md";
const toolPath = "tools/evidence/validate-access-authorization-record-schema-hardening.js";

for (const path of [schemaPath, manifestPath, pagePath, docPath, toolPath]) {
  assert.equal(fs.existsSync(path), true, path);
}

const schema = JSON.parse(fs.readFileSync(schemaPath, "utf8"));
const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
const page = fs.readFileSync(pagePath, "utf8");
const doc = fs.readFileSync(docPath, "utf8");
const output = cp.execFileSync(process.execPath, [toolPath], { encoding: "utf8" });

assert.equal(schema.title, "HBCE Access Authorization Record Hardened Schema v001");
assert.equal(schema.additionalProperties, false);
assert.equal(schema.required.length, 20);
assert.equal(schema.properties.expected_result.properties.required_field_count.const, 20);

assert.equal(manifest.object_id, "HBCE-ACCESS-AUTHORIZATION-RECORD-SCHEMA-HARDENING-V001");
assert.equal(manifest.record_id, "HBCE-ACCESS-AUTHORIZATION-RECORD-SCHEMA-HARDENING-V001");
assert.equal(manifest.schema_hardening_id, "HBCE-ACCESS-AUTHORIZATION-RECORD-SCHEMA-HARDENING-V001");
assert.equal(manifest.status, "ACTIVE_ACCESS_AUTHORIZATION_RECORD_SCHEMA_HARDENING");
assert.equal(manifest.classification, "R_AND_D_ACCESS_AUTHORIZATION_RECORD_SCHEMA_HARDENING_ONLY");
assert.equal(manifest.basis_marker, "HBCE_RUNTIME_ACCESS_GATE_DRAFT_FINAL_AUDIT=1");
assert.equal(manifest.basis_main_commit, "25f3d7b3d4c38661d71973dce4d77c9fea50052d");
assert.equal(manifest.decision_scope, "ACCESS_AUTHORIZATION");
assert.equal(manifest.authorization_level, "ACCESS_ONLY");
assert.equal(manifest.record_mode, "CONTROLLED_SCHEMA_HARDENING_ONLY");
assert.equal(manifest.decision_outcome, "SCHEMA_HARDENING_RECORD_ONLY");
assert.equal(manifest.expected_cli_marker, "ACCESS_AUTHORIZATION_RECORD_SCHEMA_HARDENING=PASS");
assert.equal(manifest.expected_result.required_field_count, 20);
assert.equal(manifest.expected_result.allowed_decision_outcome_count, 7);
assert.equal(manifest.expected_result.required_non_claim_count, 13);
assert.equal(manifest.expected_result.required_no_execution_boundary_count, 13);
assert.equal(manifest.expected_result.schema_hardening_control_count, 6);
assert.equal(manifest.expected_result.source_chain_entry_count, 4);
assert.equal(manifest.result, "PASS_ACCESS_AUTHORIZATION_RECORD_SCHEMA_HARDENING_CREATED");

assert.deepEqual(manifest.allowed_decision_outcomes, [
  "ACCESS_AUTHORIZATION_APPROVED_RECORD_ONLY",
  "ACCESS_AUTHORIZATION_DENIED_RECORD_ONLY",
  "ACCESS_AUTHORIZATION_UNKNOWN_FAIL_CLOSED_RECORD_ONLY",
  "RUNTIME_ACCESS_GATE_ALLOW_RECORD_ONLY",
  "RUNTIME_ACCESS_GATE_DENY_RECORD_ONLY",
  "RUNTIME_ACCESS_GATE_UNKNOWN_FAIL_CLOSED_RECORD_ONLY",
  "SCHEMA_HARDENING_RECORD_ONLY"
]);

assert.deepEqual(manifest.source_chain.map((entry) => entry.object_id), [
  "HBCE-ACCESS-AUTHORIZATION-DECISION-RECORD-DRAFT-V001",
  "HBCE-AUTHORIZATION-DECISION-RECORD-EVALUATION-HARNESS-V001",
  "HBCE-ACCESS-AUTHORIZATION-RECORD-PUBLIC-INDEX-V001",
  "HBCE-RUNTIME-ACCESS-GATE-DRAFT-V001"
]);

assert.equal(manifest.record_boundary.record_only, true);
for (const [key, value] of Object.entries(manifest.record_boundary)) {
  if (key !== "record_only") assert.equal(value, false, key);
}

for (const value of Object.values(manifest.explicit_non_claims)) {
  assert.equal(value, true);
}

for (const value of Object.values(manifest.no_execution_boundary)) {
  assert.equal(value, false);
}

assert.ok(output.includes("ACCESS_AUTHORIZATION_RECORD_SCHEMA_HARDENING=PASS"));
assert.ok(output.includes('"schema_hardening_id": "HBCE-ACCESS-AUTHORIZATION-RECORD-SCHEMA-HARDENING-V001"'));
assert.ok(output.includes('"decision_scope": "ACCESS_AUTHORIZATION"'));
assert.ok(output.includes('"authorization_level": "ACCESS_ONLY"'));
assert.ok(output.includes('"record_mode": "CONTROLLED_SCHEMA_HARDENING_ONLY"'));
assert.ok(output.includes('"required_field_count": 20'));
assert.ok(output.includes('"allowed_decision_outcome_count": 7'));
assert.ok(output.includes('"required_non_claim_count": 13'));
assert.ok(output.includes('"required_no_execution_boundary_count": 13'));
assert.ok(output.includes('"schema_hardening_control_count": 6'));
assert.ok(output.includes('"source_chain_entry_count": 4'));
assert.ok(output.includes('"access_granted": false'));
assert.ok(output.includes('"dispatch_authorized": false'));
assert.ok(output.includes('"execution_authorized": false'));
assert.ok(output.includes('"effect_evidence_created": false'));
assert.ok(output.includes('"legal_certification_created": false'));

for (const text of [
  "HBCE Access Authorization Record Schema Hardening",
  "R&amp;D ACCESS AUTHORIZATION RECORD SCHEMA HARDENING ONLY",
  "HBCE_RUNTIME_ACCESS_GATE_DRAFT_FINAL_AUDIT=1",
  "ACTIVE_ACCESS_AUTHORIZATION_RECORD_SCHEMA_HARDENING",
  "HBCE-ACCESS-AUTHORIZATION-RECORD-SCHEMA-HARDENING-V001",
  "ACCESS_AUTHORIZATION_RECORD_SCHEMA_HARDENING=PASS",
  "Decision scope: ACCESS_AUTHORIZATION",
  "Authorization level: ACCESS_ONLY",
  "Record mode: CONTROLLED_SCHEMA_HARDENING_ONLY",
  "Required field count: 20",
  "Allowed decision outcome count: 7",
  "Required explicit non-claim count: 13",
  "Required no-execution boundary count: 13",
  "Schema hardening control count: 6",
  "Source chain entry count: 4",
  "ACCESS_AUTHORIZATION_APPROVED_RECORD_ONLY",
  "ACCESS_AUTHORIZATION_DENIED_RECORD_ONLY",
  "ACCESS_AUTHORIZATION_UNKNOWN_FAIL_CLOSED_RECORD_ONLY",
  "RUNTIME_ACCESS_GATE_ALLOW_RECORD_ONLY",
  "RUNTIME_ACCESS_GATE_DENY_RECORD_ONLY",
  "RUNTIME_ACCESS_GATE_UNKNOWN_FAIL_CLOSED_RECORD_ONLY",
  "SCHEMA_HARDENING_RECORD_ONLY",
  "HBCE-ACCESS-AUTHORIZATION-DECISION-RECORD-DRAFT-V001",
  "HBCE-AUTHORIZATION-DECISION-RECORD-EVALUATION-HARNESS-V001",
  "HBCE-ACCESS-AUTHORIZATION-RECORD-PUBLIC-INDEX-V001",
  "HBCE-RUNTIME-ACCESS-GATE-DRAFT-V001",
  "AAR-SH-001 required-fields-fixed",
  "AAR-SH-006 unknown-fail-closed-preserved",
  "does not implement a runtime gate",
  "does not enable a runtime gate",
  "does not grant access",
  "does not authorize dispatch",
  "does not authorize execution",
  "does not enable a production authorization service",
  "does not create execution traces",
  "does not create effect evidence",
  "does not create legal certification"
]) {
  assert.ok(page.includes(text), text);
}

assert.ok(doc.includes("HBCE Access Authorization Record Schema Hardening v001"));
assert.ok(doc.includes("HBCE_RUNTIME_ACCESS_GATE_DRAFT_FINAL_AUDIT=1"));
assert.ok(doc.includes("HBCE-ACCESS-AUTHORIZATION-RECORD-SCHEMA-HARDENING-V001"));
assert.ok(doc.includes("ACCESS_AUTHORIZATION_RECORD_SCHEMA_HARDENING=PASS"));
assert.ok(doc.includes("ACCESS_AUTHORIZATION"));
assert.ok(doc.includes("ACCESS_ONLY"));
assert.ok(doc.includes("CONTROLLED_SCHEMA_HARDENING_ONLY"));
assert.ok(doc.includes("Hardened required field count: `20`"));
assert.ok(doc.includes("Allowed decision outcome count: `7`"));
assert.ok(doc.includes("Required explicit non-claim count: `13`"));
assert.ok(doc.includes("Required no-execution boundary count: `13`"));
assert.ok(doc.includes("SCHEMA_HARDENING_RECORD_ONLY"));
assert.ok(doc.includes("AAR-SH-001"));
assert.ok(doc.includes("AAR-SH-006"));
assert.ok(doc.includes("does not implement a runtime gate"));
assert.ok(doc.includes("does not enable a runtime gate"));
assert.ok(doc.includes("does not grant access"));
assert.ok(doc.includes("does not authorize dispatch"));
assert.ok(doc.includes("does not create effect evidence"));
assert.ok(doc.includes("does not create legal certification"));

console.log("PROG_279_ACCESS_AUTHORIZATION_RECORD_SCHEMA_HARDENING_TEST=PASS");
