"use strict";

const assert = require("assert/strict");
const fs = require("fs");
const cp = require("child_process");

const manifestPath = "evidence/authorization/20261003_HBCE_ACCESS_AUTHORIZATION_PREDICATE_DRAFT_v001.json";
const pagePath = "access-authorization-predicate-draft.html";
const docPath = "docs/evidence/hbce-access-authorization-predicate-draft-v001.md";
const toolPath = "tools/evidence/validate-access-authorization-predicate-draft.js";

for (const path of [manifestPath, pagePath, docPath, toolPath]) {
  assert.equal(fs.existsSync(path), true, path);
}

const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
const page = fs.readFileSync(pagePath, "utf8");
const doc = fs.readFileSync(docPath, "utf8");
const output = cp.execFileSync(process.execPath, [toolPath], { encoding: "utf8" });

assert.equal(manifest.object_id, "HBCE-ACCESS-AUTHORIZATION-PREDICATE-DRAFT-V001");
assert.equal(manifest.status, "ACTIVE_ACCESS_AUTHORIZATION_PREDICATE_DRAFT");
assert.equal(manifest.basis_marker, "HBCE_EVIDENCE_OBJECT_MIGRATION_MAP_FINAL_AUDIT=1");
assert.equal(manifest.expected_cli_marker, "ACCESS_AUTHORIZATION_PREDICATE_DRAFT=PASS");
assert.equal(manifest.result, "PASS_ACCESS_AUTHORIZATION_PREDICATE_DRAFT_MANIFEST_CREATED");

assert.equal(manifest.predicate_scope.decision_scope, "ACCESS_AUTHORIZATION");
assert.equal(manifest.predicate_scope.authorization_level, "ACCESS_ONLY");
assert.equal(manifest.predicate_scope.dispatch_scope, "EXCLUDED");
assert.equal(manifest.predicate_scope.execution_scope, "EXCLUDED");
assert.equal(manifest.predicate_scope.effect_evidence_scope, "EXCLUDED");

assert.ok(output.includes("ACCESS_AUTHORIZATION_PREDICATE_DRAFT=PASS"));
assert.ok(output.includes("ACCESS_AUTHORIZATION_PREDICATE_ELIGIBLE"));
assert.ok(output.includes("ACCESS_AUTHORIZATION_PREDICATE_DENY"));
assert.ok(output.includes("ACCESS_AUTHORIZATION_PREDICATE_UNKNOWN_FAIL_CLOSED"));
assert.ok(output.includes('"access_granted": false'));
assert.ok(output.includes('"dispatch_authorized": false'));
assert.ok(output.includes('"effect_evidence_created": false'));

for (const text of [
  "HBCE Access Authorization Predicate Draft",
  "R&amp;D ACCESS AUTHORIZATION PREDICATE DRAFT ONLY",
  "HBCE_EVIDENCE_OBJECT_MIGRATION_MAP_FINAL_AUDIT=1",
  "ACTIVE_ACCESS_AUTHORIZATION_PREDICATE_DRAFT",
  "HBCE-ACCESS-AUTHORIZATION-PREDICATE-DRAFT-V001",
  "ACCESS_AUTHORIZATION_PREDICATE_DRAFT=PASS",
  "Decision scope: ACCESS_AUTHORIZATION",
  "Authorization level: ACCESS_ONLY",
  "Dispatch scope: EXCLUDED",
  "Execution scope: EXCLUDED",
  "Effect evidence scope: EXCLUDED",
  "ACCESS_AUTHORIZATION_PREDICATE_ELIGIBLE",
  "ACCESS_AUTHORIZATION_PREDICATE_DENY",
  "ACCESS_AUTHORIZATION_PREDICATE_UNKNOWN_FAIL_CLOSED",
  "Eligible does not mean access granted",
  "Eligible does not mean dispatch authorized",
  "Eligible requires a separate recorded authorization decision",
  "does not grant access",
  "does not authorize dispatch",
  "does not create effect evidence",
  "PROG-272",
  "PROG-273"
]) {
  assert.ok(page.includes(text), text);
}

assert.ok(doc.includes("HBCE Access Authorization Predicate Draft v001"));
assert.ok(doc.includes("ACCESS_AUTHORIZATION_PREDICATE_DRAFT=PASS"));
assert.ok(doc.includes("does not grant access"));
assert.ok(doc.includes("does not create effect evidence"));

console.log("PROG_271_ACCESS_AUTHORIZATION_PREDICATE_DRAFT_TEST=PASS");
