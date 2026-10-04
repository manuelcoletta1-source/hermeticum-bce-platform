"use strict";

const assert = require("assert/strict");
const fs = require("fs");
const cp = require("child_process");

const boundaryPath = "evidence/authorization/20261004_HBCE_RUNTIME_ACCESS_GATE_INTEGRATION_BOUNDARY_DRAFT_v001.json";
const toolPath = "tools/evidence/validate-runtime-access-gate-integration-boundary-draft.js";
const pagePath = "runtime-access-gate-integration-boundary-draft.html";
const docPath = "docs/evidence/hbce-runtime-access-gate-integration-boundary-draft-v001.md";

for (const path of [boundaryPath, toolPath, pagePath, docPath]) {
  assert.equal(fs.existsSync(path), true, path);
}

const boundary = JSON.parse(fs.readFileSync(boundaryPath, "utf8"));
const output = cp.execFileSync(process.execPath, [toolPath], { encoding: "utf8" });
const page = fs.readFileSync(pagePath, "utf8");
const doc = fs.readFileSync(docPath, "utf8");

assert.equal(boundary.object_id, "HBCE-RUNTIME-ACCESS-GATE-INTEGRATION-BOUNDARY-DRAFT-V001");
assert.equal(boundary.basis_marker, "HBCE_ACCESS_AUTHORIZATION_RECORD_PUBLIC_INDEX_REFRESH_V002_FINAL_AUDIT=1");
assert.equal(boundary.basis_main_commit, "fdf0b36d394168289474fdda30308f3347b456df");
assert.equal(boundary.decision_scope, "ACCESS_AUTHORIZATION");
assert.equal(boundary.authorization_level, "ACCESS_ONLY");
assert.equal(boundary.integration_mode, "BOUNDARY_DRAFT_ONLY");
assert.equal(boundary.runtime_integration_state, "NOT_IMPLEMENTED_NOT_ENABLED");
assert.equal(boundary.source_chain_entry_count, 6);
assert.equal(boundary.integration_boundary_rule_count, 10);
assert.equal(boundary.future_integration_prerequisite_count, 12);
assert.equal(boundary.required_future_allow_inputs.length, 8);
assert.equal(Object.keys(boundary.explicit_non_claims).length, 13);
assert.equal(Object.keys(boundary.no_execution_boundary).length, 13);
assert.equal(boundary.expected_cli_marker, "RUNTIME_ACCESS_GATE_INTEGRATION_BOUNDARY_DRAFT=PASS");

assert.deepEqual(boundary.source_chain.map((entry) => entry.object_id), [
  "HBCE-ACCESS-AUTHORIZATION-RECORD-PUBLIC-INDEX-REFRESH-V002",
  "HBCE-ACCESS-AUTHORIZATION-RECORD-PUBLIC-INDEX-V002",
  "HBCE-RUNTIME-ACCESS-GATE-DRAFT-V001",
  "HBCE-RUNTIME-ACCESS-GATE-EVALUATION-HARNESS-V001",
  "HBCE-ACCESS-AUTHORIZATION-RECORD-SCHEMA-HARDENING-V001",
  "HBCE-ACCESS-AUTHORIZATION-RECORD-SCHEMA-CONFORMANCE-HARNESS-V001"
]);

assert.deepEqual(boundary.integration_boundary_rules.map((entry) => entry.rule_id), [
  "IB-001-RECORD-ONLY",
  "IB-002-NO-GATE-IMPLEMENTATION",
  "IB-003-NO-GATE-ENABLEMENT",
  "IB-004-NO-ACCESS-GRANT",
  "IB-005-NO-DISPATCH",
  "IB-006-NO-EXECUTION",
  "IB-007-NO-PRODUCTION-AUTH-SERVICE",
  "IB-008-POSITIVE-CONTRACT-REQUIRED-FOR-FUTURE-ALLOW",
  "IB-009-UNKNOWN-FAIL-CLOSED",
  "IB-010-BOUNDARY-PRECEDENCE"
]);

assert.deepEqual(boundary.future_integration_prerequisites, [
  "explicit_runtime_gate_implementation_plan",
  "positive_authorization_contract_schema",
  "request_binding_adapter",
  "authority_ref_resolver",
  "policy_evaluation_resolver",
  "access_authorization_predicate_resolver",
  "access_authorization_decision_record_resolver",
  "decision_actor_resolver",
  "scope_binding_resolver",
  "unknown_fail_closed_handler",
  "no_execution_dry_run_mode",
  "human_go_record_for_runtime_integration"
]);

assert.deepEqual(boundary.required_future_allow_inputs, [
  "request_binding",
  "authority_ref",
  "policy_evaluation",
  "access_authorization_predicate",
  "access_authorization_decision_record",
  "positive_authorization_contract_for_allow",
  "decision_actor",
  "scope_binding"
]);

for (const value of Object.values(boundary.explicit_non_claims)) {
  assert.equal(value, true);
}

for (const value of Object.values(boundary.no_execution_boundary)) {
  assert.equal(value, false);
}

for (const text of [
  "RUNTIME_ACCESS_GATE_INTEGRATION_BOUNDARY_DRAFT=PASS",
  "\"boundary_id\": \"HBCE-RUNTIME-ACCESS-GATE-INTEGRATION-BOUNDARY-DRAFT-V001\"",
  "\"basis_marker\": \"HBCE_ACCESS_AUTHORIZATION_RECORD_PUBLIC_INDEX_REFRESH_V002_FINAL_AUDIT=1\"",
  "\"decision_scope\": \"ACCESS_AUTHORIZATION\"",
  "\"authorization_level\": \"ACCESS_ONLY\"",
  "\"integration_mode\": \"BOUNDARY_DRAFT_ONLY\"",
  "\"runtime_integration_state\": \"NOT_IMPLEMENTED_NOT_ENABLED\"",
  "\"source_chain_entry_count\": 6",
  "\"integration_boundary_rule_count\": 10",
  "\"future_integration_prerequisite_count\": 12",
  "\"required_future_allow_input_count\": 8",
  "\"required_non_claim_count\": 13",
  "\"required_no_execution_boundary_count\": 13",
  "\"runtime_gate_implemented\": false",
  "\"runtime_gate_enabled\": false",
  "\"access_granted\": false",
  "\"dispatch_authorized\": false",
  "\"execution_authorized\": false",
  "\"effect_evidence_created\": false",
  "\"legal_certification_created\": false"
]) {
  assert.ok(output.includes(text), text);
}

for (const text of [
  "HBCE Runtime Access Gate Integration Boundary Draft v001",
  "R&amp;D RUNTIME ACCESS GATE INTEGRATION BOUNDARY DRAFT ONLY",
  "HBCE_ACCESS_AUTHORIZATION_RECORD_PUBLIC_INDEX_REFRESH_V002_FINAL_AUDIT=1",
  "ACTIVE_RUNTIME_ACCESS_GATE_INTEGRATION_BOUNDARY_DRAFT",
  "HBCE-RUNTIME-ACCESS-GATE-INTEGRATION-BOUNDARY-DRAFT-V001",
  "RUNTIME_ACCESS_GATE_INTEGRATION_BOUNDARY_DRAFT=PASS",
  "Decision scope: ACCESS_AUTHORIZATION",
  "Authorization level: ACCESS_ONLY",
  "Integration mode: BOUNDARY_DRAFT_ONLY",
  "Runtime integration state: NOT_IMPLEMENTED_NOT_ENABLED",
  "Source chain entry count: 6",
  "Integration boundary rule count: 10",
  "Future integration prerequisite count: 12",
  "Required future allow input count: 8",
  "Required explicit non-claim count: 13",
  "Required no-execution boundary count: 13",
  "HBCE-ACCESS-AUTHORIZATION-RECORD-PUBLIC-INDEX-REFRESH-V002",
  "HBCE-ACCESS-AUTHORIZATION-RECORD-PUBLIC-INDEX-V002",
  "HBCE-RUNTIME-ACCESS-GATE-DRAFT-V001",
  "HBCE-RUNTIME-ACCESS-GATE-EVALUATION-HARNESS-V001",
  "HBCE-ACCESS-AUTHORIZATION-RECORD-SCHEMA-HARDENING-V001",
  "HBCE-ACCESS-AUTHORIZATION-RECORD-SCHEMA-CONFORMANCE-HARNESS-V001",
  "IB-001-RECORD-ONLY",
  "IB-010-BOUNDARY-PRECEDENCE",
  "positive_authorization_contract_for_allow",
  "unknown_fail_closed_handler",
  "human_go_record_for_runtime_integration",
  "RUNTIME_ACCESS_GATE_UNKNOWN_FAIL_CLOSED_RECORD_ONLY",
  "RUNTIME_ACCESS_GATE_DENY_RECORD_ONLY",
  "RUNTIME_ACCESS_GATE_ALLOW_RECORD_ONLY",
  "does not implement a runtime gate",
  "does not enable a runtime gate",
  "does not grant access",
  "does not authorize dispatch",
  "does not authorize execution",
  "does not create execution traces",
  "does not create effect evidence",
  "does not create legal certification"
]) {
  assert.ok(page.includes(text), text);
}

for (const text of [
  "HBCE Runtime Access Gate Integration Boundary Draft v001",
  "HBCE_ACCESS_AUTHORIZATION_RECORD_PUBLIC_INDEX_REFRESH_V002_FINAL_AUDIT=1",
  "HBCE-RUNTIME-ACCESS-GATE-INTEGRATION-BOUNDARY-DRAFT-V001",
  "RUNTIME_ACCESS_GATE_INTEGRATION_BOUNDARY_DRAFT=PASS",
  "ACCESS_AUTHORIZATION",
  "ACCESS_ONLY",
  "BOUNDARY_DRAFT_ONLY",
  "NOT_IMPLEMENTED_NOT_ENABLED",
  "Source chain entry count: `6`",
  "Integration boundary rule count: `10`",
  "Future integration prerequisite count: `12`",
  "Required future allow input count: `8`",
  "Required explicit non-claim count: `13`",
  "Required no-execution boundary count: `13`",
  "HBCE-RUNTIME-ACCESS-GATE-DRAFT-V001",
  "HBCE-RUNTIME-ACCESS-GATE-EVALUATION-HARNESS-V001",
  "HBCE-ACCESS-AUTHORIZATION-RECORD-SCHEMA-HARDENING-V001",
  "HBCE-ACCESS-AUTHORIZATION-RECORD-SCHEMA-CONFORMANCE-HARNESS-V001",
  "IB-001-RECORD-ONLY",
  "IB-010-BOUNDARY-PRECEDENCE",
  "positive_authorization_contract_for_allow",
  "unknown_fail_closed_handler",
  "human_go_record_for_runtime_integration",
  "does not implement a runtime gate",
  "does not enable a runtime gate",
  "does not grant access",
  "does not authorize dispatch",
  "does not create effect evidence",
  "does not create legal certification"
]) {
  assert.ok(doc.includes(text), text);
}

console.log("PROG_283_RUNTIME_ACCESS_GATE_INTEGRATION_BOUNDARY_DRAFT_TEST=PASS");
