#!/usr/bin/env node
"use strict";

const fs = require("fs");
const cp = require("child_process");

const discoveryPath = "evidence/authorization/20261004_HBCE_ACCESS_AUTHORIZATION_CHAIN_NEXT_STEP_DISCOVERY_v001.json";
const validatorPath = "tools/evidence/validate-access-authorization-chain-next-step-discovery.js";
const pagePath = "access-authorization-chain-next-step-discovery.html";
const docPath = "docs/evidence/hbce-access-authorization-chain-next-step-discovery-v001.md";

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

const record = readJson(discoveryPath);

if (record.object_id !== "HBCE-ACCESS-AUTHORIZATION-CHAIN-NEXT-STEP-DISCOVERY-V001") {
  fail("unexpected object_id");
}

if (record.expected_cli_marker !== "ACCESS_AUTHORIZATION_CHAIN_NEXT_STEP_DISCOVERY=PASS") {
  fail("unexpected expected_cli_marker");
}

if (record.discovery_source_chain_entry_count !== 5) {
  fail("unexpected discovery_source_chain_entry_count");
}

if (record.discovered_gap_count !== 6) {
  fail("unexpected discovered_gap_count");
}

if (record.candidate_next_step_count !== 5) {
  fail("unexpected candidate_next_step_count");
}

if (record.recommended_next_step.program !== "PROG-288") {
  fail("unexpected recommended next program");
}

if (record.recommended_next_step.object_id !== "HBCE-ACCESS-AUTHORIZATION-REQUEST-BINDING-DRAFT-V001") {
  fail("unexpected recommended next object id");
}

if (Object.keys(record.explicit_non_claims).length !== 14) {
  fail("unexpected explicit non-claim count");
}

if (Object.keys(record.no_execution_boundary).length !== 14) {
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

if (!validatorOutput.includes("ACCESS_AUTHORIZATION_CHAIN_NEXT_STEP_DISCOVERY=PASS")) {
  fail("validator output missing canonical marker");
}

mustContain(pagePath, [
  "HBCE Access Authorization Chain Next Step Discovery v001",
  "R&amp;D CHAIN DISCOVERY ONLY",
  "ACCESS_AUTHORIZATION_CHAIN_NEXT_STEP_DISCOVERY=PASS",
  "HBCE-ACCESS-AUTHORIZATION-CHAIN-NEXT-STEP-DISCOVERY-V001",
  "HBCE_ACCESS_AUTHORIZATION_RECORD_PUBLIC_INDEX_REFRESH_V003_FINAL_AUDIT=1",
  "HBCE-ACCESS-AUTHORIZATION-RECORD-PUBLIC-INDEX-V003",
  "HBCE-ACCESS-AUTHORIZATION-RECORD-PUBLIC-INDEX-REFRESH-V003",
  "HBCE-RUNTIME-ACCESS-GATE-INTEGRATION-BOUNDARY-DRAFT-V001",
  "HBCE-POSITIVE-AUTHORIZATION-CONTRACT-DRAFT-V001",
  "HBCE-POSITIVE-AUTHORIZATION-CONTRACT-EVALUATION-HARNESS-V001",
  "GAP-001-REQUEST-BINDING-NOT-YET-RECORDED",
  "PROG-288",
  "HBCE-ACCESS-AUTHORIZATION-REQUEST-BINDING-DRAFT-V001",
  "does not grant access",
  "does not authorize execution",
  "does not create legal certification"
]);

mustContain(docPath, [
  "HBCE Access Authorization Chain Next Step Discovery v001",
  "R_AND_D_CHAIN_DISCOVERY_ONLY",
  "ACCESS_AUTHORIZATION_CHAIN_NEXT_STEP_DISCOVERY=PASS",
  "HBCE-ACCESS-AUTHORIZATION-CHAIN-NEXT-STEP-DISCOVERY-V001",
  "HBCE_ACCESS_AUTHORIZATION_RECORD_PUBLIC_INDEX_REFRESH_V003_FINAL_AUDIT=1",
  "HBCE-ACCESS-AUTHORIZATION-RECORD-PUBLIC-INDEX-V003",
  "HBCE-ACCESS-AUTHORIZATION-RECORD-PUBLIC-INDEX-REFRESH-V003",
  "HBCE-RUNTIME-ACCESS-GATE-INTEGRATION-BOUNDARY-DRAFT-V001",
  "HBCE-POSITIVE-AUTHORIZATION-CONTRACT-DRAFT-V001",
  "HBCE-POSITIVE-AUTHORIZATION-CONTRACT-EVALUATION-HARNESS-V001",
  "Discovered gap count: `6`",
  "Candidate next step count: `5`",
  "PROG-288",
  "HBCE-ACCESS-AUTHORIZATION-REQUEST-BINDING-DRAFT-V001",
  "Required explicit non-claim count: `14`",
  "Required no-execution boundary count: `14`",
  "does not grant access",
  "does not authorize execution",
  "does not create legal certification"
]);

const linkedSurfacePaths = [
  "index.html",
  "docs/index.html",
  "evidence-registry.html",
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
    "HBCE Access Authorization Chain Next Step Discovery v001",
    "ACCESS_AUTHORIZATION_CHAIN_NEXT_STEP_DISCOVERY=PASS",
    "PROG-288",
    "HBCE-ACCESS-AUTHORIZATION-REQUEST-BINDING-DRAFT-V001",
    "does not grant access",
    "does not authorize execution",
    "does not create legal certification"
  ]);
}

console.log("PROG_287_ACCESS_AUTHORIZATION_CHAIN_NEXT_STEP_DISCOVERY_TEST=PASS");
