"use strict";

const assert = require("assert/strict");
const fs = require("fs");
const cp = require("child_process");

const manifestPath = "evidence/authorization/20261003_HBCE_ACCESS_AUTHORIZATION_PREDICATE_EVALUATION_HARNESS_v001.json";
const predicatePath = "evidence/authorization/20261003_HBCE_ACCESS_AUTHORIZATION_PREDICATE_DRAFT_v001.json";
const pagePath = "access-authorization-predicate-evaluation-harness.html";
const docPath = "docs/evidence/hbce-access-authorization-predicate-evaluation-harness-v001.md";
const toolPath = "tools/evidence/validate-access-authorization-predicate-evaluation-harness.js";

for (const path of [manifestPath, predicatePath, pagePath, docPath, toolPath]) {
  assert.equal(fs.existsSync(path), true, path);
}

const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
const page = fs.readFileSync(pagePath, "utf8");
const doc = fs.readFileSync(docPath, "utf8");
const output = cp.execFileSync(process.execPath, [toolPath], { encoding: "utf8" });

assert.equal(manifest.object_id, "HBCE-ACCESS-AUTHORIZATION-PREDICATE-EVALUATION-HARNESS-V001");
assert.equal(manifest.status, "ACTIVE_ACCESS_AUTHORIZATION_PREDICATE_EVALUATION_HARNESS");
assert.equal(manifest.basis_marker, "HBCE_EVIDENCE_REGISTRY_CONSISTENCY_HARNESS_FINAL_AUDIT=1");
assert.equal(manifest.expected_cli_marker, "ACCESS_AUTHORIZATION_PREDICATE_EVALUATION_HARNESS=PASS");
assert.equal(manifest.expected_result.evaluation_case_count, 9);
assert.equal(manifest.expected_result.eligible_case_count, 1);
assert.equal(manifest.expected_result.deny_case_count, 6);
assert.equal(manifest.expected_result.unknown_fail_closed_case_count, 2);
assert.equal(manifest.evaluation_cases.length, 9);
assert.equal(manifest.result, "PASS_ACCESS_AUTHORIZATION_PREDICATE_EVALUATION_HARNESS_MANIFEST_CREATED");

assert.equal(manifest.evaluation_scope.decision_scope, "ACCESS_AUTHORIZATION");
assert.equal(manifest.evaluation_scope.authorization_level, "ACCESS_ONLY");
assert.equal(manifest.evaluation_scope.evaluation_mode, "CONTROLLED_LOCAL_HARNESS_ONLY");
assert.equal(manifest.evaluation_scope.production_authorization_service, false);
assert.equal(manifest.evaluation_scope.grant_access, false);
assert.equal(manifest.evaluation_scope.authorize_dispatch, false);
assert.equal(manifest.evaluation_scope.create_execution_trace, false);
assert.equal(manifest.evaluation_scope.create_effect_evidence, false);

assert.ok(output.includes("ACCESS_AUTHORIZATION_PREDICATE_EVALUATION_HARNESS=PASS"));
assert.ok(output.includes('"evaluation_case_count": 9'));
assert.ok(output.includes('"eligible_case_count": 1'));
assert.ok(output.includes('"deny_case_count": 6'));
assert.ok(output.includes('"unknown_fail_closed_case_count": 2'));
assert.ok(output.includes('"production_authorization_service_enabled": false'));
assert.ok(output.includes('"access_granted": false'));
assert.ok(output.includes('"dispatch_authorized": false'));
assert.ok(output.includes('"execution_trace_created": false'));
assert.ok(output.includes('"effect_evidence_created": false'));
assert.ok(output.includes("CASE-001-ALL-REQUIRED-INPUTS-SATISFIED"));
assert.ok(output.includes("CASE-009-POSITIVE-AUTHORIZATION-CONTRACT-UNKNOWN"));

for (const text of [
  "HBCE Access Authorization Predicate Evaluation Harness",
  "R&amp;D ACCESS AUTHORIZATION PREDICATE EVALUATION HARNESS ONLY",
  "HBCE_EVIDENCE_REGISTRY_CONSISTENCY_HARNESS_FINAL_AUDIT=1",
  "ACTIVE_ACCESS_AUTHORIZATION_PREDICATE_EVALUATION_HARNESS",
  "HBCE-ACCESS-AUTHORIZATION-PREDICATE-EVALUATION-HARNESS-V001",
  "ACCESS_AUTHORIZATION_PREDICATE_EVALUATION_HARNESS=PASS",
  "Predicate under evaluation: HBCE-ACCESS-AUTHORIZATION-PREDICATE-DRAFT-V001",
  "Decision scope: ACCESS_AUTHORIZATION",
  "Authorization level: ACCESS_ONLY",
  "Evaluation mode: CONTROLLED_LOCAL_HARNESS_ONLY",
  "Evaluation case count: 9",
  "Eligible case count: 1",
  "Deny case count: 6",
  "Unknown fail-closed case count: 2",
  "CASE-001-ALL-REQUIRED-INPUTS-SATISFIED",
  "ACCESS_AUTHORIZATION_PREDICATE_ELIGIBLE",
  "CASE-002-IPR-STATUS-REVOKED",
  "ACCESS_AUTHORIZATION_PREDICATE_DENY",
  "CASE-008-MANDATE-VALID-UNKNOWN",
  "ACCESS_AUTHORIZATION_PREDICATE_UNKNOWN_FAIL_CLOSED",
  "does not grant access",
  "does not authorize dispatch",
  "does not enable a production authorization service",
  "does not create execution traces",
  "does not create effect evidence",
  "PROG-274",
  "PROG-275"
]) {
  assert.ok(page.includes(text), text);
}

assert.ok(doc.includes("HBCE Access Authorization Predicate Evaluation Harness v001"));
assert.ok(doc.includes("ACCESS_AUTHORIZATION_PREDICATE_EVALUATION_HARNESS=PASS"));
assert.ok(doc.includes("CASE-001-ALL-REQUIRED-INPUTS-SATISFIED"));
assert.ok(doc.includes("ACCESS_AUTHORIZATION_PREDICATE_UNKNOWN_FAIL_CLOSED"));
assert.ok(doc.includes("does not grant access"));
assert.ok(doc.includes("does not create effect evidence"));

console.log("PROG_273_ACCESS_AUTHORIZATION_PREDICATE_EVALUATION_HARNESS_TEST=PASS");
