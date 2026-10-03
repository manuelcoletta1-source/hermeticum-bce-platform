"use strict";

const assert = require("assert/strict");
const fs = require("fs");
const cp = require("child_process");

const jsonPath = "evidence/authorization/20261003_HBCE_ACCESS_AUTHORIZATION_DECISION_RECORD_DRAFT_v001.json";
const pagePath = "access-authorization-decision-record-draft.html";
const docPath = "docs/evidence/hbce-access-authorization-decision-record-draft-v001.md";
const toolPath = "tools/evidence/validate-access-authorization-decision-record-draft.js";

for (const path of [jsonPath, pagePath, docPath, toolPath]) {
  assert.equal(fs.existsSync(path), true, path);
}

const record = JSON.parse(fs.readFileSync(jsonPath, "utf8"));
const page = fs.readFileSync(pagePath, "utf8");
const doc = fs.readFileSync(docPath, "utf8");
const output = cp.execFileSync(process.execPath, [toolPath], { encoding: "utf8" });

assert.equal(record.object_id, "HBCE-ACCESS-AUTHORIZATION-DECISION-RECORD-DRAFT-V001");
assert.equal(record.status, "ACTIVE_ACCESS_AUTHORIZATION_DECISION_RECORD_DRAFT");
assert.equal(record.classification, "R_AND_D_ACCESS_AUTHORIZATION_DECISION_RECORD_DRAFT_ONLY");
assert.equal(record.basis_marker, "HBCE_EVIDENCE_REGISTRY_PUBLIC_INDEX_REFRESH_FINAL_AUDIT=1");
assert.equal(record.expected_cli_marker, "ACCESS_AUTHORIZATION_DECISION_RECORD_DRAFT=PASS");
assert.equal(record.decision_scope.decision_scope, "ACCESS_AUTHORIZATION");
assert.equal(record.decision_scope.authorization_level, "ACCESS_ONLY");
assert.equal(record.decision_scope.dispatch_scope, "EXCLUDED");
assert.equal(record.decision_scope.execution_scope, "EXCLUDED");
assert.equal(record.decision_scope.effect_scope, "EXCLUDED");
assert.equal(record.decision_scope.decision_record_mode, "CONTROLLED_R_AND_D_DRAFT_ONLY");
assert.equal(record.source_predicate.predicate_id, "HBCE-ACCESS-AUTHORIZATION-PREDICATE-DRAFT-V001");
assert.equal(record.source_predicate_evaluation.evaluation_harness_id, "HBCE-ACCESS-AUTHORIZATION-PREDICATE-EVALUATION-HARNESS-V001");
assert.equal(record.source_predicate_evaluation.eligible_case_count, 1);
assert.equal(record.source_predicate_evaluation.deny_case_count, 6);
assert.equal(record.source_predicate_evaluation.unknown_fail_closed_case_count, 2);
assert.equal(record.expected_result.decision_record_field_count, 26);
assert.equal(record.expected_result.allowed_decision_outcome_count, 3);
assert.equal(record.expected_result.fail_closed_condition_count, 12);
assert.equal(Object.keys(record.required_record_fields).length, 26);
assert.equal(record.allowed_decision_outcomes.length, 3);
assert.equal(record.fail_closed_conditions.length, 12);
assert.equal(record.result, "PASS_ACCESS_AUTHORIZATION_DECISION_RECORD_DRAFT_MANIFEST_CREATED");

assert.ok(output.includes("ACCESS_AUTHORIZATION_DECISION_RECORD_DRAFT=PASS"));
assert.ok(output.includes('"decision_record_id": "HBCE-ACCESS-AUTHORIZATION-DECISION-RECORD-DRAFT-V001"'));
assert.ok(output.includes('"decision_scope": "ACCESS_AUTHORIZATION"'));
assert.ok(output.includes('"authorization_level": "ACCESS_ONLY"'));
assert.ok(output.includes('"decision_record_field_count": 26'));
assert.ok(output.includes('"allowed_decision_outcome_count": 3'));
assert.ok(output.includes('"fail_closed_condition_count": 12'));
assert.ok(output.includes('"access_granted": false'));
assert.ok(output.includes('"dispatch_authorized": false'));
assert.ok(output.includes('"execution_authorized": false'));
assert.ok(output.includes('"production_authorization_service_enabled": false'));
assert.ok(output.includes('"effect_evidence_created": false'));
assert.ok(output.includes('"legal_certification_created": false'));

for (const text of [
  "HBCE Access Authorization Decision Record Draft",
  "R&amp;D ACCESS AUTHORIZATION DECISION RECORD DRAFT ONLY",
  "HBCE_EVIDENCE_REGISTRY_PUBLIC_INDEX_REFRESH_FINAL_AUDIT=1",
  "ACTIVE_ACCESS_AUTHORIZATION_DECISION_RECORD_DRAFT",
  "HBCE-ACCESS-AUTHORIZATION-DECISION-RECORD-DRAFT-V001",
  "ACCESS_AUTHORIZATION_DECISION_RECORD_DRAFT=PASS",
  "Decision scope: ACCESS_AUTHORIZATION",
  "Authorization level: ACCESS_ONLY",
  "Dispatch scope: EXCLUDED",
  "Execution scope: EXCLUDED",
  "Effect scope: EXCLUDED",
  "Decision record mode: CONTROLLED_R_AND_D_DRAFT_ONLY",
  "Source predicate: HBCE-ACCESS-AUTHORIZATION-PREDICATE-DRAFT-V001",
  "Source predicate marker: ACCESS_AUTHORIZATION_PREDICATE_DRAFT=PASS",
  "Source predicate evaluation harness: HBCE-ACCESS-AUTHORIZATION-PREDICATE-EVALUATION-HARNESS-V001",
  "Source predicate evaluation marker: ACCESS_AUTHORIZATION_PREDICATE_EVALUATION_HARNESS=PASS",
  "Eligible case count: 1",
  "Deny case count: 6",
  "Unknown fail-closed case count: 2",
  "Required record field count: 26",
  "Allowed decision outcome count: 3",
  "Fail-closed condition count: 12",
  "ACCESS_AUTHORIZATION_APPROVED_RECORD_ONLY",
  "ACCESS_AUTHORIZATION_DENIED_RECORD_ONLY",
  "ACCESS_AUTHORIZATION_UNKNOWN_FAIL_CLOSED_RECORD_ONLY",
  "does not grant access",
  "does not authorize dispatch",
  "does not authorize execution",
  "does not enable a production authorization service",
  "does not create execution traces",
  "does not create effect evidence",
  "does not create legal certification",
  "PROG-276",
  "PROG-277"
]) {
  assert.ok(page.includes(text), text);
}

assert.ok(doc.includes("HBCE Access Authorization Decision Record Draft v001"));
assert.ok(doc.includes("HBCE-ACCESS-AUTHORIZATION-DECISION-RECORD-DRAFT-V001"));
assert.ok(doc.includes("ACCESS_AUTHORIZATION_DECISION_RECORD_DRAFT=PASS"));
assert.ok(doc.includes("Required record field count: `26`"));
assert.ok(doc.includes("ACCESS_AUTHORIZATION_APPROVED_RECORD_ONLY"));
assert.ok(doc.includes("ACCESS_AUTHORIZATION_UNKNOWN_FAIL_CLOSED_RECORD_ONLY"));
assert.ok(doc.includes("does not grant access"));
assert.ok(doc.includes("does not authorize dispatch"));
assert.ok(doc.includes("does not create effect evidence"));
assert.ok(doc.includes("does not create legal certification"));

console.log("PROG_275_ACCESS_AUTHORIZATION_DECISION_RECORD_DRAFT_TEST=PASS");
