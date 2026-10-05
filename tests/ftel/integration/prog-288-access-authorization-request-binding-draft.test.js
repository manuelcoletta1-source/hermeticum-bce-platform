#!/usr/bin/env node
"use strict";

const fs = require("fs");
const cp = require("child_process");

const recordPath = "evidence/authorization/20261004_HBCE_ACCESS_AUTHORIZATION_REQUEST_BINDING_DRAFT_v001.json";
const validatorPath = "tools/evidence/validate-access-authorization-request-binding-draft.js";
const pagePath = "access-authorization-request-binding-draft.html";
const docPath = "docs/evidence/hbce-access-authorization-request-binding-draft-v001.md";

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

if (record.object_id !== "HBCE-ACCESS-AUTHORIZATION-REQUEST-BINDING-DRAFT-V001") {
  fail("unexpected object_id");
}

if (record.expected_cli_marker !== "ACCESS_AUTHORIZATION_REQUEST_BINDING_DRAFT=PASS") {
  fail("unexpected expected_cli_marker");
}

if (record.source_chain_entry_count !== 6) {
  fail("unexpected source_chain_entry_count");
}

if (record.required_request_field_count !== 14) {
  fail("unexpected required_request_field_count");
}

if (record.binding_rule_count !== 9) {
  fail("unexpected binding_rule_count");
}

if (record.future_normalization_requirement_count !== 14) {
  fail("unexpected future_normalization_requirement_count");
}

if (record.recommended_next_step.program !== "PROG-289") {
  fail("unexpected recommended next program");
}

if (record.recommended_next_step.object_id !== "HBCE-AUTHORITY-REFERENCE-BINDING-DRAFT-V001") {
  fail("unexpected recommended next object id");
}

if (Object.keys(record.explicit_non_claims).length !== 16) {
  fail("unexpected explicit non-claim count");
}

if (Object.keys(record.no_execution_boundary).length !== 16) {
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

if (!validatorOutput.includes("ACCESS_AUTHORIZATION_REQUEST_BINDING_DRAFT=PASS")) {
  fail("validator output missing canonical marker");
}

mustContain(pagePath, [
  "HBCE Access Authorization Request Binding Draft v001",
  "R&amp;D REQUEST BINDING DRAFT ONLY",
  "ACCESS_AUTHORIZATION_REQUEST_BINDING_DRAFT=PASS",
  "HBCE-ACCESS-AUTHORIZATION-REQUEST-BINDING-DRAFT-V001",
  "HBCE_ACCESS_AUTHORIZATION_CHAIN_NEXT_STEP_DISCOVERY_FINAL_AUDIT=1",
  "HBCE-ACCESS-AUTHORIZATION-CHAIN-NEXT-STEP-DISCOVERY-V001",
  "HBCE-POSITIVE-AUTHORIZATION-CONTRACT-DRAFT-V001",
  "HBCE-POSITIVE-AUTHORIZATION-CONTRACT-EVALUATION-HARNESS-V001",
  "request_id",
  "authority_ref",
  "policy_ref",
  "idempotency_key",
  "RB-001-RECORD-ONLY",
  "RB-009-UNKNOWN-FAIL-CLOSED",
  "PROG-289",
  "HBCE-AUTHORITY-REFERENCE-BINDING-DRAFT-V001",
  "does not grant access",
  "does not authorize execution",
  "does not create legal certification"
]);

mustContain(docPath, [
  "HBCE Access Authorization Request Binding Draft v001",
  "R_AND_D_REQUEST_BINDING_DRAFT_ONLY",
  "ACCESS_AUTHORIZATION_REQUEST_BINDING_DRAFT=PASS",
  "HBCE-ACCESS-AUTHORIZATION-REQUEST-BINDING-DRAFT-V001",
  "HBCE_ACCESS_AUTHORIZATION_CHAIN_NEXT_STEP_DISCOVERY_FINAL_AUDIT=1",
  "HBCE-ACCESS-AUTHORIZATION-CHAIN-NEXT-STEP-DISCOVERY-V001",
  "HBCE-POSITIVE-AUTHORIZATION-CONTRACT-DRAFT-V001",
  "HBCE-POSITIVE-AUTHORIZATION-CONTRACT-EVALUATION-HARNESS-V001",
  "Required request field count: `14`",
  "Binding rule count: `9`",
  "Future normalization requirement count: `14`",
  "request_id",
  "authority_ref",
  "policy_ref",
  "idempotency_key",
  "RB-001-RECORD-ONLY",
  "RB-009-UNKNOWN-FAIL-CLOSED",
  "PROG-289",
  "HBCE-AUTHORITY-REFERENCE-BINDING-DRAFT-V001",
  "Required explicit non-claim count: `16`",
  "Required no-execution boundary count: `16`",
  "does not grant access",
  "does not authorize execution",
  "does not create legal certification"
]);

// PROG_288_LINKED_SURFACES_CHECK
const linkedSurfacePaths = [
  "index.html",
  "docs/index.html",
  "evidence-registry.html",
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
    "HBCE Access Authorization Request Binding Draft v001",
    "ACCESS_AUTHORIZATION_REQUEST_BINDING_DRAFT=PASS",
    "Required request field count",
    "PROG-289",
    "HBCE-AUTHORITY-REFERENCE-BINDING-DRAFT-V001",
    "does not grant access",
    "does not authorize execution",
    "does not create legal certification"
  ]);
}

console.log("PROG_288_ACCESS_AUTHORIZATION_REQUEST_BINDING_DRAFT_TEST=PASS");
