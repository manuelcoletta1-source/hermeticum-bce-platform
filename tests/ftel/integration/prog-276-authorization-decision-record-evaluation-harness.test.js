"use strict";

const assert = require("assert/strict");
const fs = require("fs");
const cp = require("child_process");

const jsonPath = "evidence/authorization/20261003_HBCE_AUTHORIZATION_DECISION_RECORD_EVALUATION_HARNESS_v001.json";
const pagePath = "authorization-decision-record-evaluation-harness.html";
const docPath = "docs/evidence/hbce-authorization-decision-record-evaluation-harness-v001.md";
const toolPath = "tools/evidence/validate-authorization-decision-record-evaluation-harness.js";

for (const path of [jsonPath, pagePath, docPath, toolPath]) {
  assert.equal(fs.existsSync(path), true, path);
}

const harness = JSON.parse(fs.readFileSync(jsonPath, "utf8"));
const page = fs.readFileSync(pagePath, "utf8");
const doc = fs.readFileSync(docPath, "utf8");
const output = cp.execFileSync(process.execPath, [toolPath], { encoding: "utf8" });

assert.equal(harness.object_id, "HBCE-AUTHORIZATION-DECISION-RECORD-EVALUATION-HARNESS-V001");
assert.equal(harness.harness_id, "HBCE-AUTHORIZATION-DECISION-RECORD-EVALUATION-HARNESS-V001");
assert.equal(harness.status, "ACTIVE_AUTHORIZATION_DECISION_RECORD_EVALUATION_HARNESS");
assert.equal(harness.classification, "R_AND_D_AUTHORIZATION_DECISION_RECORD_EVALUATION_HARNESS_ONLY");
assert.equal(harness.basis_marker, "HBCE_ACCESS_AUTHORIZATION_DECISION_RECORD_DRAFT_FINAL_AUDIT=1");
assert.equal(harness.expected_cli_marker, "AUTHORIZATION_DECISION_RECORD_EVALUATION_HARNESS=PASS");
assert.equal(harness.decision_record_under_evaluation.decision_record_id, "HBCE-ACCESS-AUTHORIZATION-DECISION-RECORD-DRAFT-V001");
assert.equal(harness.decision_record_under_evaluation.expected_marker, "ACCESS_AUTHORIZATION_DECISION_RECORD_DRAFT=PASS");
assert.equal(harness.evaluation_scope.decision_scope, "ACCESS_AUTHORIZATION");
assert.equal(harness.evaluation_scope.authorization_level, "ACCESS_ONLY");
assert.equal(harness.evaluation_scope.evaluation_mode, "CONTROLLED_LOCAL_HARNESS_ONLY");
assert.equal(harness.evaluation_scope.production_authorization_service, false);
assert.equal(harness.evaluation_scope.grant_access, false);
assert.equal(harness.evaluation_scope.authorize_dispatch, false);
assert.equal(harness.evaluation_scope.authorize_execution, false);
assert.equal(harness.evaluation_scope.create_effect_evidence, false);
assert.equal(harness.evaluation_scope.create_legal_certification, false);
assert.equal(harness.evaluation_cases.length, 9);
assert.equal(harness.expected_result.evaluation_case_count, 9);
assert.equal(harness.expected_result.approved_record_only_case_count, 1);
assert.equal(harness.expected_result.denied_record_only_case_count, 6);
assert.equal(harness.expected_result.unknown_fail_closed_record_only_case_count, 2);
assert.equal(harness.result, "PASS_AUTHORIZATION_DECISION_RECORD_EVALUATION_HARNESS_MANIFEST_CREATED");

assert.ok(output.includes("AUTHORIZATION_DECISION_RECORD_EVALUATION_HARNESS=PASS"));
assert.ok(output.includes('"harness_id": "HBCE-AUTHORIZATION-DECISION-RECORD-EVALUATION-HARNESS-V001"'));
assert.ok(output.includes('"decision_record_id": "HBCE-ACCESS-AUTHORIZATION-DECISION-RECORD-DRAFT-V001"'));
assert.ok(output.includes('"decision_scope": "ACCESS_AUTHORIZATION"'));
assert.ok(output.includes('"authorization_level": "ACCESS_ONLY"'));
assert.ok(output.includes('"evaluation_case_count": 9'));
assert.ok(output.includes('"approved_record_only_case_count": 1'));
assert.ok(output.includes('"denied_record_only_case_count": 6'));
assert.ok(output.includes('"unknown_fail_closed_record_only_case_count": 2'));
assert.ok(output.includes('"ACCESS_AUTHORIZATION_APPROVED_RECORD_ONLY"'));
assert.ok(output.includes('"ACCESS_AUTHORIZATION_DENIED_RECORD_ONLY"'));
assert.ok(output.includes('"ACCESS_AUTHORIZATION_UNKNOWN_FAIL_CLOSED_RECORD_ONLY"'));
assert.ok(output.includes('"access_granted": false'));
assert.ok(output.includes('"dispatch_authorized": false'));
assert.ok(output.includes('"execution_authorized": false'));
assert.ok(output.includes('"effect_evidence_created": false'));
assert.ok(output.includes('"legal_certification_created": false'));

for (const text of [
  "HBCE Authorization Decision Record Evaluation Harness",
  "R&amp;D AUTHORIZATION DECISION RECORD EVALUATION HARNESS ONLY",
  "HBCE_ACCESS_AUTHORIZATION_DECISION_RECORD_DRAFT_FINAL_AUDIT=1",
  "ACTIVE_AUTHORIZATION_DECISION_RECORD_EVALUATION_HARNESS",
  "HBCE-AUTHORIZATION-DECISION-RECORD-EVALUATION-HARNESS-V001",
  "AUTHORIZATION_DECISION_RECORD_EVALUATION_HARNESS=PASS",
  "Decision record under evaluation: HBCE-ACCESS-AUTHORIZATION-DECISION-RECORD-DRAFT-V001",
  "Decision record marker: ACCESS_AUTHORIZATION_DECISION_RECORD_DRAFT=PASS",
  "Source predicate: HBCE-ACCESS-AUTHORIZATION-PREDICATE-DRAFT-V001",
  "Source predicate marker: ACCESS_AUTHORIZATION_PREDICATE_DRAFT=PASS",
  "Source predicate evaluation harness: HBCE-ACCESS-AUTHORIZATION-PREDICATE-EVALUATION-HARNESS-V001",
  "Source predicate evaluation marker: ACCESS_AUTHORIZATION_PREDICATE_EVALUATION_HARNESS=PASS",
  "Decision scope: ACCESS_AUTHORIZATION",
  "Authorization level: ACCESS_ONLY",
  "Evaluation mode: CONTROLLED_LOCAL_HARNESS_ONLY",
  "Evaluation case count: 9",
  "Approved record-only case count: 1",
  "Denied record-only case count: 6",
  "Unknown fail-closed record-only case count: 2",
  "CASE-001-ALL-APPROVAL-PRECONDITIONS-SATISFIED",
  "CASE-009-PREDICATE-RESULT-UNKNOWN",
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
  "PROG-277",
  "PROG-278"
]) {
  assert.ok(page.includes(text), text);
}

assert.ok(doc.includes("HBCE Authorization Decision Record Evaluation Harness v001"));
assert.ok(doc.includes("HBCE-AUTHORIZATION-DECISION-RECORD-EVALUATION-HARNESS-V001"));
assert.ok(doc.includes("HBCE-ACCESS-AUTHORIZATION-DECISION-RECORD-DRAFT-V001"));
assert.ok(doc.includes("AUTHORIZATION_DECISION_RECORD_EVALUATION_HARNESS=PASS"));
assert.ok(doc.includes("evaluation case count: `9`"));
assert.ok(doc.includes("approved record-only case count: `1`"));
assert.ok(doc.includes("denied record-only case count: `6`"));
assert.ok(doc.includes("unknown fail-closed record-only case count: `2`"));
assert.ok(doc.includes("CASE-009-PREDICATE-RESULT-UNKNOWN"));
assert.ok(doc.includes("ACCESS_AUTHORIZATION_APPROVED_RECORD_ONLY"));
assert.ok(doc.includes("ACCESS_AUTHORIZATION_UNKNOWN_FAIL_CLOSED_RECORD_ONLY"));
assert.ok(doc.includes("does not grant access"));
assert.ok(doc.includes("does not authorize dispatch"));
assert.ok(doc.includes("does not create effect evidence"));
assert.ok(doc.includes("does not create legal certification"));

console.log("PROG_276_AUTHORIZATION_DECISION_RECORD_EVALUATION_HARNESS_TEST=PASS");
