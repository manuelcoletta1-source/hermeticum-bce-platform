#!/usr/bin/env node
"use strict";

const fs = require("fs");
const cp = require("child_process");

const recordPath = "evidence/authorization/20261005_HBCE_AUTHORITY_REFERENCE_BINDING_DRAFT_v001.json";
const validatorPath = "tools/evidence/validate-authority-reference-binding-draft.js";
const pagePath = "authority-reference-binding-draft.html";
const docPath = "docs/evidence/hbce-authority-reference-binding-draft-v001.md";

function fail(message) {
  throw new Error(message);
}

function readText(path) {
  if (!fs.existsSync(path)) {
    fail(`missing file: ${path}`);
  }
  return fs.readFileSync(path, "utf8");
}

function readJson(path) {
  return JSON.parse(readText(path));
}

function mustContain(path, tokens) {
  const text = readText(path);
  for (const token of tokens) {
    if (!text.includes(token)) {
      fail(`${path} missing token: ${token}`);
    }
  }
}

const record = readJson(recordPath);

if (record.object_id !== "HBCE-AUTHORITY-REFERENCE-BINDING-DRAFT-V001") {
  fail("unexpected object_id");
}

if (record.expected_cli_marker !== "AUTHORITY_REFERENCE_BINDING_DRAFT=PASS") {
  fail("unexpected expected_cli_marker");
}

if (record.source_chain_entry_count !== 7) {
  fail("unexpected source_chain_entry_count");
}

if (record.required_authority_field_count !== 14) {
  fail("unexpected required_authority_field_count");
}

if (record.binding_rule_count !== 10) {
  fail("unexpected binding_rule_count");
}

if (record.future_resolution_requirement_count !== 14) {
  fail("unexpected future_resolution_requirement_count");
}

if (record.recommended_next_step.program !== "PROG-290") {
  fail("unexpected recommended next program");
}

if (record.recommended_next_step.object_id !== "HBCE-POLICY-EVALUATION-BINDING-DRAFT-V001") {
  fail("unexpected recommended next object id");
}

if (Object.keys(record.explicit_non_claims).length !== 18) {
  fail("unexpected explicit non-claim count");
}

if (Object.keys(record.no_execution_boundary).length !== 18) {
  fail("unexpected no-execution boundary count");
}

for (const value of Object.values(record.explicit_non_claims)) {
  if (value !== true) {
    fail("explicit non-claim must be true");
  }
}

for (const value of Object.values(record.no_execution_boundary)) {
  if (value !== false) {
    fail("no-execution boundary must be false");
  }
}

const validatorOutput = cp.execFileSync("node", [validatorPath], { encoding: "utf8" });

if (!validatorOutput.includes("AUTHORITY_REFERENCE_BINDING_DRAFT=PASS")) {
  fail("validator output missing canonical marker");
}

mustContain(pagePath, [
  "HBCE Authority Reference Binding Draft v001",
  "R&amp;D AUTHORITY REFERENCE BINDING DRAFT ONLY",
  "AUTHORITY_REFERENCE_BINDING_DRAFT=PASS",
  "HBCE-AUTHORITY-REFERENCE-BINDING-DRAFT-V001",
  "HBCE_ACCESS_AUTHORIZATION_REQUEST_BINDING_DRAFT_FINAL_AUDIT=1",
  "HBCE-ACCESS-AUTHORIZATION-REQUEST-BINDING-DRAFT-V001",
  "HBCE-POSITIVE-AUTHORIZATION-CONTRACT-DRAFT-V001",
  "HBCE-POSITIVE-AUTHORIZATION-CONTRACT-EVALUATION-HARNESS-V001",
  "authority_ref",
  "authority_type",
  "authority_scope",
  "authority_resolution_state",
  "AB-001-RECORD-ONLY",
  "AB-010-UNKNOWN-FAIL-CLOSED",
  "PROG-290",
  "HBCE-POLICY-EVALUATION-BINDING-DRAFT-V001",
  "does not validate authority",
  "does not grant access",
  "does not authorize execution",
  "does not create legal certification"
]);

mustContain(docPath, [
  "HBCE Authority Reference Binding Draft v001",
  "R_AND_D_AUTHORITY_REFERENCE_BINDING_DRAFT_ONLY",
  "AUTHORITY_REFERENCE_BINDING_DRAFT=PASS",
  "HBCE-AUTHORITY-REFERENCE-BINDING-DRAFT-V001",
  "HBCE_ACCESS_AUTHORIZATION_REQUEST_BINDING_DRAFT_FINAL_AUDIT=1",
  "HBCE-ACCESS-AUTHORIZATION-REQUEST-BINDING-DRAFT-V001",
  "HBCE-POSITIVE-AUTHORIZATION-CONTRACT-DRAFT-V001",
  "HBCE-POSITIVE-AUTHORIZATION-CONTRACT-EVALUATION-HARNESS-V001",
  "Required authority field count: `14`",
  "Binding rule count: `10`",
  "Future resolution requirement count: `14`",
  "authority_ref",
  "authority_type",
  "authority_scope",
  "authority_resolution_state",
  "AB-001-RECORD-ONLY",
  "AB-010-UNKNOWN-FAIL-CLOSED",
  "PROG-290",
  "HBCE-POLICY-EVALUATION-BINDING-DRAFT-V001",
  "Required explicit non-claim count: `18`",
  "Required no-execution boundary count: `18`",
  "does not validate authority",
  "does not grant access",
  "does not authorize execution",
  "does not create legal certification"
]);

// PROG_289_LINKED_SURFACES_CHECK
const linkedSurfacePaths = [
  "index.html",
  "docs/index.html",
  "evidence-registry.html",
  "access-authorization-request-binding-draft.html",
  "access-authorization-chain-next-step-discovery.html",
  "access-authorization-record-public-index-refresh-v003.html",
  "positive-authorization-contract-evaluation-harness.html",
  "positive-authorization-contract-draft.html",
  "runtime-access-gate-integration-boundary-draft.html",
  "runtime-access-gate-evaluation-harness.html",
  "access-authorization-record-public-index-refresh-v002.html",
  "access-authorization-record-public-index-refresh.html",
  "executive-evidence-pack.html",
  "buyer-evidence-one-pager.html",
  "evidence-viewer.html"
];

for (const linkedSurfacePath of linkedSurfacePaths) {
  mustContain(linkedSurfacePath, [
    "HBCE Authority Reference Binding Draft v001",
    "AUTHORITY_REFERENCE_BINDING_DRAFT=PASS",
    "Required authority field count",
    "PROG-290",
    "HBCE-POLICY-EVALUATION-BINDING-DRAFT-V001",
    "does not validate authority",
    "does not grant access",
    "does not authorize execution",
    "does not create legal certification"
  ]);
}

console.log("PROG_289_AUTHORITY_REFERENCE_BINDING_DRAFT_TEST=PASS");
