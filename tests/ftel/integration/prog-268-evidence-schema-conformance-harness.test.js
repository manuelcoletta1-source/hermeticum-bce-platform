"use strict";
const assert = require("assert/strict");
const fs = require("fs");
const cp = require("child_process");

const jsonPath = "evidence/schema/20261002_HBCE_EVIDENCE_SCHEMA_CONFORMANCE_HARNESS_v001.json";
const pagePath = "evidence-schema-conformance-harness.html";
const toolPath = "tools/evidence/validate-evidence-object-conformance.js";
const docPath = "docs/evidence/hbce-evidence-schema-conformance-harness-v001.md";

for (const path of [jsonPath, pagePath, toolPath, docPath]) assert.equal(fs.existsSync(path), true, path);

const manifest = JSON.parse(fs.readFileSync(jsonPath, "utf8"));
const page = fs.readFileSync(pagePath, "utf8");
const doc = fs.readFileSync(docPath, "utf8");
const output = cp.execFileSync(process.execPath, [toolPath], { encoding: "utf8" });

assert.equal(manifest.object_id, "HBCE-EVIDENCE-SCHEMA-CONFORMANCE-HARNESS-V001");
assert.equal(manifest.status, "ACTIVE_EVIDENCE_SCHEMA_CONFORMANCE_HARNESS");
assert.equal(manifest.basis_marker, "HBCE_IPR_ONBOARDING_EVIDENCE_RECORD_DRAFT_FINAL_AUDIT=1");
assert.equal(manifest.expected_cli_marker, "EVIDENCE_SCHEMA_CONFORMANCE_HARNESS=PASS");
assert.equal(manifest.result, "PASS_EVIDENCE_SCHEMA_CONFORMANCE_HARNESS_CREATED");

assert.ok(output.includes("EVIDENCE_SCHEMA_CONFORMANCE_HARNESS=PASS"));
assert.ok(output.includes("PASS_SCHEMA_CONFORMANCE"));

for (const text of [
  "HBCE Evidence Schema Conformance Harness",
  "R&amp;D SCHEMA CONFORMANCE HARNESS BASELINE",
  "HBCE_IPR_ONBOARDING_EVIDENCE_RECORD_DRAFT_FINAL_AUDIT=1",
  "ACTIVE_EVIDENCE_SCHEMA_CONFORMANCE_HARNESS",
  "HBCE-IPR-ONBOARDING-EVIDENCE-RECORD-DRAFT-V001",
  "PASS_SCHEMA_CONFORMANCE",
  "explicit_non_claims",
  "no_execution_boundary",
  "basis_marker",
  "basis_main_commit",
  "public_surfaces",
  "release_anchor",
  "EVIDENCE_SCHEMA_CONFORMANCE_HARNESS=PASS",
  "does not create effect evidence",
  "PROG-269",
  "PROG-270"
]) assert.ok(page.includes(text), text);

assert.ok(doc.includes("HBCE Evidence Schema Conformance Harness v001"));
assert.ok(doc.includes("EVIDENCE_SCHEMA_CONFORMANCE_HARNESS=PASS"));

console.log("PROG_268_EVIDENCE_SCHEMA_CONFORMANCE_HARNESS_TEST=PASS");
