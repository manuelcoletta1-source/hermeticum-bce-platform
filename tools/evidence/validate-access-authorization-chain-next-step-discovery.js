#!/usr/bin/env node
"use strict";

const fs = require("fs");

const DISCOVERY_PATH = "evidence/authorization/20261004_HBCE_ACCESS_AUTHORIZATION_CHAIN_NEXT_STEP_DISCOVERY_v001.json";

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
  try {
    return JSON.parse(readText(path));
  } catch (error) {
    fail(`invalid JSON at ${path}: ${error.message}`);
  }
}

function assertEqual(actual, expected, label) {
  if (actual !== expected) {
    fail(`${label}: expected ${expected}, got ${actual}`);
  }
}

function assertArray(value, label) {
  if (!Array.isArray(value)) {
    fail(`${label}: expected array`);
  }
}

function assertBooleanMap(record, expectedValue, expectedCount, label) {
  if (!record || typeof record !== "object" || Array.isArray(record)) {
    fail(`${label}: expected object`);
  }

  const keys = Object.keys(record);
  assertEqual(keys.length, expectedCount, `${label}.count`);

  for (const key of keys) {
    if (record[key] !== expectedValue) {
      fail(`${label}.${key}: expected ${expectedValue}, got ${record[key]}`);
    }
  }
}

function assertFileContains(path, tokens, label) {
  const text = readText(path);
  for (const token of tokens) {
    if (!text.includes(token)) {
      fail(`${label}: ${path} missing ${token}`);
    }
  }
}

const record = readJson(DISCOVERY_PATH);

assertEqual(record.object_id, "HBCE-ACCESS-AUTHORIZATION-CHAIN-NEXT-STEP-DISCOVERY-V001", "object_id");
assertEqual(record.record_id, "HBCE-ACCESS-AUTHORIZATION-CHAIN-NEXT-STEP-DISCOVERY-V001", "record_id");
assertEqual(record.artifact_type, "HBCEAccessAuthorizationChainNextStepDiscovery", "artifact_type");
assertEqual(record.version, "v001", "version");
assertEqual(record.status, "ACTIVE_ACCESS_AUTHORIZATION_CHAIN_NEXT_STEP_DISCOVERY", "status");
assertEqual(record.classification, "R_AND_D_CHAIN_DISCOVERY_ONLY", "classification");
assertEqual(record.basis_marker, "HBCE_ACCESS_AUTHORIZATION_RECORD_PUBLIC_INDEX_REFRESH_V003_FINAL_AUDIT=1", "basis_marker");
assertEqual(record.basis_main_commit, "4fdea0ef183df25fc6b1f8048b8e208e45897ff3", "basis_main_commit");
assertEqual(record.basis_public_index, "HBCE-ACCESS-AUTHORIZATION-RECORD-PUBLIC-INDEX-V003", "basis_public_index");
assertEqual(record.basis_public_index_refresh, "HBCE-ACCESS-AUTHORIZATION-RECORD-PUBLIC-INDEX-REFRESH-V003", "basis_public_index_refresh");
assertEqual(record.decision_scope, "ACCESS_AUTHORIZATION", "decision_scope");
assertEqual(record.authorization_level, "ACCESS_ONLY", "authorization_level");
assertEqual(record.discovery_scope, "ACCESS_AUTHORIZATION_CHAIN_NEXT_STEP_DISCOVERY", "discovery_scope");

assertEqual(record.chain_tip.object_id, "HBCE-ACCESS-AUTHORIZATION-RECORD-PUBLIC-INDEX-REFRESH-V003", "chain_tip.object_id");
assertEqual(record.chain_tip.indexed_object_count, 11, "chain_tip.indexed_object_count");
assertEqual(record.chain_tip.added_object_count, 3, "chain_tip.added_object_count");
assertEqual(record.chain_tip.expected_marker, "ACCESS_AUTHORIZATION_RECORD_PUBLIC_INDEX_REFRESH_V003=PASS", "chain_tip.expected_marker");

assertEqual(record.current_chain_summary.public_index_object_count, 11, "current_chain_summary.public_index_object_count");
assertEqual(record.current_chain_summary.public_index_added_object_count, 3, "current_chain_summary.public_index_added_object_count");
assertEqual(record.current_chain_summary.predicate_record_count, 2, "current_chain_summary.predicate_record_count");
assertEqual(record.current_chain_summary.decision_record_count, 2, "current_chain_summary.decision_record_count");
assertEqual(record.current_chain_summary.runtime_gate_record_count, 3, "current_chain_summary.runtime_gate_record_count");
assertEqual(record.current_chain_summary.schema_record_count, 2, "current_chain_summary.schema_record_count");
assertEqual(record.current_chain_summary.positive_authorization_contract_record_count, 2, "current_chain_summary.positive_authorization_contract_record_count");
assertEqual(record.current_chain_summary.positive_authorization_contract_evaluation_case_count, 17, "current_chain_summary.positive_authorization_contract_evaluation_case_count");
assertEqual(record.current_chain_summary.positive_authorization_contract_satisfied_case_count, 1, "current_chain_summary.positive_authorization_contract_satisfied_case_count");
assertEqual(record.current_chain_summary.positive_authorization_contract_denied_case_count, 8, "current_chain_summary.positive_authorization_contract_denied_case_count");
assertEqual(record.current_chain_summary.positive_authorization_contract_unknown_fail_closed_case_count, 8, "current_chain_summary.positive_authorization_contract_unknown_fail_closed_case_count");

assertEqual(record.discovery_source_chain_entry_count, 5, "discovery_source_chain_entry_count");
assertArray(record.discovery_source_chain, "discovery_source_chain");
assertEqual(record.discovery_source_chain.length, 5, "discovery_source_chain.length");

const expectedSourceChain = [
  ["HBCE-ACCESS-AUTHORIZATION-RECORD-PUBLIC-INDEX-V003", "evidence/registry/20261004_HBCE_ACCESS_AUTHORIZATION_RECORD_PUBLIC_INDEX_v003.json", "ACCESS_AUTHORIZATION_RECORD_PUBLIC_INDEX_V003=PASS", "current_public_index_basis"],
  ["HBCE-ACCESS-AUTHORIZATION-RECORD-PUBLIC-INDEX-REFRESH-V003", "evidence/registry/20261004_HBCE_ACCESS_AUTHORIZATION_RECORD_PUBLIC_INDEX_REFRESH_v003.json", "ACCESS_AUTHORIZATION_RECORD_PUBLIC_INDEX_REFRESH_V003=PASS", "current_chain_tip"],
  ["HBCE-RUNTIME-ACCESS-GATE-INTEGRATION-BOUNDARY-DRAFT-V001", "evidence/authorization/20261004_HBCE_RUNTIME_ACCESS_GATE_INTEGRATION_BOUNDARY_DRAFT_v001.json", "RUNTIME_ACCESS_GATE_INTEGRATION_BOUNDARY_DRAFT=PASS", "runtime_boundary_basis"],
  ["HBCE-POSITIVE-AUTHORIZATION-CONTRACT-DRAFT-V001", "evidence/authorization/20261004_HBCE_POSITIVE_AUTHORIZATION_CONTRACT_DRAFT_v001.json", "POSITIVE_AUTHORIZATION_CONTRACT_DRAFT=PASS", "positive_contract_basis"],
  ["HBCE-POSITIVE-AUTHORIZATION-CONTRACT-EVALUATION-HARNESS-V001", "evidence/authorization/20261004_HBCE_POSITIVE_AUTHORIZATION_CONTRACT_EVALUATION_HARNESS_v001.json", "POSITIVE_AUTHORIZATION_CONTRACT_EVALUATION_HARNESS=PASS", "positive_contract_evaluation_basis"]
];

record.discovery_source_chain.forEach((entry, index) => {
  const [objectId, path, marker, role] = expectedSourceChain[index];

  assertEqual(entry.sequence, index + 1, `discovery_source_chain[${index}].sequence`);
  assertEqual(entry.object_id, objectId, `discovery_source_chain[${index}].object_id`);
  assertEqual(entry.path, path, `discovery_source_chain[${index}].path`);
  assertEqual(entry.expected_marker, marker, `discovery_source_chain[${index}].expected_marker`);
  assertEqual(entry.role, role, `discovery_source_chain[${index}].role`);

  assertFileContains(path, [objectId, marker], `source_chain[${index}]`);
});

assertEqual(record.discovered_gap_count, 6, "discovered_gap_count");
assertArray(record.discovered_gaps, "discovered_gaps");
assertEqual(record.discovered_gaps.length, 6, "discovered_gaps.length");

const expectedGaps = [
  "GAP-001-REQUEST-BINDING-NOT-YET-RECORDED",
  "GAP-002-AUTHORITY-REFERENCE-BINDING-NOT-YET-RECORDED",
  "GAP-003-POLICY-EVALUATION-BINDING-NOT-YET-RECORDED",
  "GAP-004-SCOPE-BINDING-NOT-YET-RECORDED",
  "GAP-005-DECISION-ACTOR-BINDING-NOT-YET-RECORDED",
  "GAP-006-RUNTIME-IMPLEMENTATION-REMAINS-OUT-OF-SCOPE"
];

record.discovered_gaps.forEach((gap, index) => {
  assertEqual(gap.gap_id, expectedGaps[index], `discovered_gaps[${index}].gap_id`);
  if (!gap.severity) {
    fail(`discovered_gaps[${index}].severity missing`);
  }
  if (!gap.description) {
    fail(`discovered_gaps[${index}].description missing`);
  }
});

assertEqual(record.candidate_next_step_count, 5, "candidate_next_step_count");
assertArray(record.candidate_next_steps, "candidate_next_steps");
assertEqual(record.candidate_next_steps.length, 5, "candidate_next_steps.length");

const expectedCandidates = [
  ["PROG-288-ACCESS-AUTHORIZATION-REQUEST-BINDING-DRAFT", "HBCE-ACCESS-AUTHORIZATION-REQUEST-BINDING-DRAFT-V001", "request_binding_record", 1, true],
  ["PROG-289-AUTHORITY-REFERENCE-BINDING-DRAFT", "HBCE-AUTHORITY-REFERENCE-BINDING-DRAFT-V001", "authority_reference_binding_record", 2, false],
  ["PROG-290-POLICY-EVALUATION-BINDING-DRAFT", "HBCE-POLICY-EVALUATION-BINDING-DRAFT-V001", "policy_evaluation_binding_record", 3, false],
  ["PROG-291-SCOPE-BINDING-DRAFT", "HBCE-AUTHORIZATION-SCOPE-BINDING-DRAFT-V001", "scope_binding_record", 4, false],
  ["PROG-292-DECISION-ACTOR-BINDING-DRAFT", "HBCE-DECISION-ACTOR-BINDING-DRAFT-V001", "decision_actor_binding_record", 5, false]
];

record.candidate_next_steps.forEach((candidate, index) => {
  const [candidateId, objectId, type, priority, recommended] = expectedCandidates[index];

  assertEqual(candidate.candidate_id, candidateId, `candidate_next_steps[${index}].candidate_id`);
  assertEqual(candidate.candidate_object_id, objectId, `candidate_next_steps[${index}].candidate_object_id`);
  assertEqual(candidate.candidate_type, type, `candidate_next_steps[${index}].candidate_type`);
  assertEqual(candidate.priority, priority, `candidate_next_steps[${index}].priority`);
  assertEqual(candidate.recommended, recommended, `candidate_next_steps[${index}].recommended`);
  assertEqual(candidate.allowed_scope, "R_AND_D_RECORD_ONLY", `candidate_next_steps[${index}].allowed_scope`);

  if (!candidate.reason) {
    fail(`candidate_next_steps[${index}].reason missing`);
  }
});

assertEqual(record.recommended_next_step.program, "PROG-288", "recommended_next_step.program");
assertEqual(record.recommended_next_step.title, "HBCE Access Authorization Request Binding Draft v001", "recommended_next_step.title");
assertEqual(record.recommended_next_step.object_id, "HBCE-ACCESS-AUTHORIZATION-REQUEST-BINDING-DRAFT-V001", "recommended_next_step.object_id");

assertBooleanMap(record.explicit_non_claims, true, 14, "explicit_non_claims");
assertBooleanMap(record.no_execution_boundary, false, 14, "no_execution_boundary");

assertEqual(record.expected_cli_marker, "ACCESS_AUTHORIZATION_CHAIN_NEXT_STEP_DISCOVERY=PASS", "expected_cli_marker");
assertEqual(record.expected_result.candidate_next_step_count, 5, "expected_result.candidate_next_step_count");
assertEqual(record.expected_result.discovered_gap_count, 6, "expected_result.discovered_gap_count");
assertEqual(record.expected_result.discovery_source_chain_entry_count, 5, "expected_result.discovery_source_chain_entry_count");
assertEqual(record.expected_result.recommended_next_program, "PROG-288", "expected_result.recommended_next_program");
assertEqual(record.expected_result.recommended_next_object_id, "HBCE-ACCESS-AUTHORIZATION-REQUEST-BINDING-DRAFT-V001", "expected_result.recommended_next_object_id");
assertEqual(record.expected_result.required_non_claim_count, 14, "expected_result.required_non_claim_count");
assertEqual(record.expected_result.required_no_execution_boundary_count, 14, "expected_result.required_no_execution_boundary_count");
assertEqual(record.expected_result.runtime_gate_implemented, false, "expected_result.runtime_gate_implemented");
assertEqual(record.expected_result.runtime_gate_enabled, false, "expected_result.runtime_gate_enabled");
assertEqual(record.expected_result.positive_authorization_contract_issued, false, "expected_result.positive_authorization_contract_issued");
assertEqual(record.expected_result.access_granted, false, "expected_result.access_granted");
assertEqual(record.expected_result.dispatch_authorized, false, "expected_result.dispatch_authorized");
assertEqual(record.expected_result.execution_authorized, false, "expected_result.execution_authorized");
assertEqual(record.expected_result.effect_evidence_created, false, "expected_result.effect_evidence_created");
assertEqual(record.expected_result.legal_certification_created, false, "expected_result.legal_certification_created");
assertEqual(record.expected_result.result, "PASS_ACCESS_AUTHORIZATION_CHAIN_NEXT_STEP_DISCOVERY", "expected_result.result");
assertEqual(record.result, "PASS_ACCESS_AUTHORIZATION_CHAIN_NEXT_STEP_DISCOVERY_CREATED", "result");

const summary = {
  marker: "ACCESS_AUTHORIZATION_CHAIN_NEXT_STEP_DISCOVERY=PASS",
  object_id: record.object_id,
  basis_marker: record.basis_marker,
  basis_main_commit: record.basis_main_commit,
  basis_public_index: record.basis_public_index,
  basis_public_index_refresh: record.basis_public_index_refresh,
  discovery_source_chain_entry_count: record.discovery_source_chain_entry_count,
  discovered_gap_count: record.discovered_gap_count,
  candidate_next_step_count: record.candidate_next_step_count,
  recommended_next_program: record.recommended_next_step.program,
  recommended_next_object_id: record.recommended_next_step.object_id,
  required_non_claim_count: Object.keys(record.explicit_non_claims).length,
  required_no_execution_boundary_count: Object.keys(record.no_execution_boundary).length,
  runtime_gate_implemented: false,
  runtime_gate_enabled: false,
  positive_authorization_contract_issued: false,
  access_granted: false,
  dispatch_authorized: false,
  execution_authorized: false,
  effect_evidence_created: false,
  legal_certification_created: false,
  result: "PASS_ACCESS_AUTHORIZATION_CHAIN_NEXT_STEP_DISCOVERY"
};

console.log(JSON.stringify(summary, null, 2));
console.log("ACCESS_AUTHORIZATION_CHAIN_NEXT_STEP_DISCOVERY=PASS");
