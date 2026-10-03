"use strict";

const assert = require("assert/strict");
const fs = require("fs");
const cp = require("child_process");

const gatePath = "evidence/authorization/20261003_HBCE_RUNTIME_ACCESS_GATE_DRAFT_v001.json";
const pagePath = "runtime-access-gate-draft.html";
const docPath = "docs/evidence/hbce-runtime-access-gate-draft-v001.md";
const toolPath = "tools/evidence/validate-runtime-access-gate-draft.js";

for (const path of [gatePath, pagePath, docPath, toolPath]) {
  assert.equal(fs.existsSync(path), true, path);
}

const gate = JSON.parse(fs.readFileSync(gatePath, "utf8"));
const page = fs.readFileSync(pagePath, "utf8");
const doc = fs.readFileSync(docPath, "utf8");
const output = cp.execFileSync(process.execPath, [toolPath], { encoding: "utf8" });

assert.equal(gate.object_id, "HBCE-RUNTIME-ACCESS-GATE-DRAFT-V001");
assert.equal(gate.gate_id, "HBCE-RUNTIME-ACCESS-GATE-DRAFT-V001");
assert.equal(gate.status, "ACTIVE_RUNTIME_ACCESS_GATE_DRAFT");
assert.equal(gate.classification, "R_AND_D_RUNTIME_ACCESS_GATE_DRAFT_ONLY");
assert.equal(gate.basis_marker, "HBCE_ACCESS_AUTHORIZATION_RECORD_PUBLIC_INDEX_REFRESH_FINAL_AUDIT=1");
assert.equal(gate.basis_main_commit, "b8caaa2892b6387244ae2eecf06bbd363d9b210a");
assert.equal(gate.decision_scope, "ACCESS_AUTHORIZATION");
assert.equal(gate.authorization_level, "ACCESS_ONLY");
assert.equal(gate.gate_mode, "CONTROLLED_DRAFT_RECORD_ONLY");
assert.equal(gate.expected_cli_marker, "RUNTIME_ACCESS_GATE_DRAFT=PASS");
assert.equal(gate.source_chain.length, 6);
assert.equal(gate.gate_rules.length, 8);
assert.equal(gate.gate_outcomes.length, 3);
assert.equal(gate.expected_result.source_chain_entry_count, 6);
assert.equal(gate.expected_result.gate_rule_count, 8);
assert.equal(gate.expected_result.gate_outcome_count, 3);
assert.equal(gate.result, "PASS_RUNTIME_ACCESS_GATE_DRAFT_CREATED");

assert.deepEqual(gate.gate_outcomes.map((entry) => entry.outcome), [
  "RUNTIME_ACCESS_GATE_ALLOW_RECORD_ONLY",
  "RUNTIME_ACCESS_GATE_DENY_RECORD_ONLY",
  "RUNTIME_ACCESS_GATE_UNKNOWN_FAIL_CLOSED_RECORD_ONLY"
]);

assert.deepEqual(gate.precedence, [
  "RUNTIME_ACCESS_GATE_UNKNOWN_FAIL_CLOSED_RECORD_ONLY",
  "RUNTIME_ACCESS_GATE_DENY_RECORD_ONLY",
  "RUNTIME_ACCESS_GATE_ALLOW_RECORD_ONLY"
]);

for (const value of Object.values(gate.runtime_activation)) {
  assert.equal(value, false);
}

for (const value of Object.values(gate.explicit_non_claims)) {
  assert.equal(value, true);
}

for (const value of Object.values(gate.no_execution_boundary)) {
  assert.equal(value, false);
}

assert.ok(output.includes("RUNTIME_ACCESS_GATE_DRAFT=PASS"));
assert.ok(output.includes('"gate_id": "HBCE-RUNTIME-ACCESS-GATE-DRAFT-V001"'));
assert.ok(output.includes('"decision_scope": "ACCESS_AUTHORIZATION"'));
assert.ok(output.includes('"authorization_level": "ACCESS_ONLY"'));
assert.ok(output.includes('"gate_mode": "CONTROLLED_DRAFT_RECORD_ONLY"'));
assert.ok(output.includes('"source_chain_entry_count": 6'));
assert.ok(output.includes('"gate_rule_count": 8'));
assert.ok(output.includes('"gate_outcome_count": 3'));
assert.ok(output.includes('"runtime_gate_implemented": false'));
assert.ok(output.includes('"runtime_gate_enabled": false'));
assert.ok(output.includes('"access_granted": false'));
assert.ok(output.includes('"dispatch_authorized": false'));
assert.ok(output.includes('"execution_authorized": false'));
assert.ok(output.includes('"production_authorization_service_enabled": false'));
assert.ok(output.includes('"effect_evidence_created": false'));
assert.ok(output.includes('"legal_certification_created": false'));

for (const text of [
  "HBCE Runtime Access Gate Draft",
  "R&amp;D RUNTIME ACCESS GATE DRAFT ONLY",
  "HBCE_ACCESS_AUTHORIZATION_RECORD_PUBLIC_INDEX_REFRESH_FINAL_AUDIT=1",
  "ACTIVE_RUNTIME_ACCESS_GATE_DRAFT",
  "HBCE-RUNTIME-ACCESS-GATE-DRAFT-V001",
  "RUNTIME_ACCESS_GATE_DRAFT=PASS",
  "Decision scope: ACCESS_AUTHORIZATION",
  "Authorization level: ACCESS_ONLY",
  "Gate mode: CONTROLLED_DRAFT_RECORD_ONLY",
  "Source chain entry count: 6",
  "Gate rule count: 8",
  "Gate outcome count: 3",
  "HBCE-ACCESS-AUTHORIZATION-PREDICATE-DRAFT-V001",
  "HBCE-ACCESS-AUTHORIZATION-PREDICATE-EVALUATION-HARNESS-V001",
  "HBCE-ACCESS-AUTHORIZATION-DECISION-RECORD-DRAFT-V001",
  "HBCE-AUTHORIZATION-DECISION-RECORD-EVALUATION-HARNESS-V001",
  "HBCE-ACCESS-AUTHORIZATION-RECORD-PUBLIC-INDEX-V001",
  "HBCE-ACCESS-AUTHORIZATION-RECORD-PUBLIC-INDEX-REFRESH-V001",
  "RUNTIME_ACCESS_GATE_ALLOW_RECORD_ONLY",
  "RUNTIME_ACCESS_GATE_DENY_RECORD_ONLY",
  "RUNTIME_ACCESS_GATE_UNKNOWN_FAIL_CLOSED_RECORD_ONLY",
  "RAG-001 scope-binding-required",
  "RAG-006 positive-contract-required-for-allow",
  "RAG-007 unknown-fails-closed",
  "RAG-008 allow-is-record-only",
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

assert.ok(doc.includes("HBCE Runtime Access Gate Draft v001"));
assert.ok(doc.includes("HBCE_ACCESS_AUTHORIZATION_RECORD_PUBLIC_INDEX_REFRESH_FINAL_AUDIT=1"));
assert.ok(doc.includes("HBCE-RUNTIME-ACCESS-GATE-DRAFT-V001"));
assert.ok(doc.includes("RUNTIME_ACCESS_GATE_DRAFT=PASS"));
assert.ok(doc.includes("ACCESS_AUTHORIZATION"));
assert.ok(doc.includes("ACCESS_ONLY"));
assert.ok(doc.includes("CONTROLLED_DRAFT_RECORD_ONLY"));
assert.ok(doc.includes("Source chain entry count: `6`"));
assert.ok(doc.includes("RUNTIME_ACCESS_GATE_ALLOW_RECORD_ONLY"));
assert.ok(doc.includes("RUNTIME_ACCESS_GATE_DENY_RECORD_ONLY"));
assert.ok(doc.includes("RUNTIME_ACCESS_GATE_UNKNOWN_FAIL_CLOSED_RECORD_ONLY"));
assert.ok(doc.includes("RAG-001"));
assert.ok(doc.includes("RAG-008"));
assert.ok(doc.includes("does not implement a runtime gate"));
assert.ok(doc.includes("does not enable a runtime gate"));
assert.ok(doc.includes("does not grant access"));
assert.ok(doc.includes("does not authorize dispatch"));
assert.ok(doc.includes("does not create effect evidence"));
assert.ok(doc.includes("does not create legal certification"));

console.log("PROG_278_RUNTIME_ACCESS_GATE_DRAFT_TEST=PASS");
