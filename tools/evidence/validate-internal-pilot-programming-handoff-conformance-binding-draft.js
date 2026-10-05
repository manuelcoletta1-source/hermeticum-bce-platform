#!/usr/bin/env node

const fs = require("fs");

const file = "evidence/authorization/20261005_HBCE_INTERNAL_PILOT_PROGRAMMING_HANDOFF_CONFORMANCE_BINDING_DRAFT_v001.json";

let ok = true;
let d = null;

function fail(message) {
  console.log(message);
  ok = false;
}

try {
  d = JSON.parse(fs.readFileSync(file, "utf8"));
} catch (err) {
  fail(`JSON_READ_OR_PARSE_FAIL ${err.message}`);
  d = {};
}

const exact = {
  object_id: "HBCE-INTERNAL-PILOT-PROGRAMMING-HANDOFF-CONFORMANCE-BINDING-DRAFT-V001",
  artifact_type: "HBCEInternalPilotProgrammingHandoffConformanceBindingDraft",
  classification: "R_AND_D_INTERNAL_PILOT_PROGRAMMING_HANDOFF_CONFORMANCE_BINDING_DRAFT_ONLY",
  status: "ACTIVE_INTERNAL_PILOT_PROGRAMMING_HANDOFF_CONFORMANCE_BINDING_DRAFT",
  binding_scope: "INTERNAL_PILOT_PROGRAMMING_HANDOFF_CONFORMANCE_BINDING",
  binding_mode: "RECORD_ONLY_NOT_EXECUTABLE",
  state: "NOT_IMPLEMENTED_NOT_EXECUTABLE_NOT_BOUND_TO_RUNTIME",
  marker: "INTERNAL_PILOT_PROGRAMMING_HANDOFF_CONFORMANCE_BINDING_DRAFT=PASS",
  basis_marker: "HBCE_PRODUCT_REALIGNMENT_CONFORMANCE_BINDING_DRAFT_FINAL_AUDIT=1",
  basis_main_commit: "cde578fcf7dc06216a5cb5a81259d67b6248c3b0",
  recommended_next_program: "PROG-304",
  recommended_next_object_id: "HBCE-MATRIX-OPERATING-PROGRAMMING-MASTER-CONFORMANCE-BINDING-DRAFT-V001",
  result: "PASS_INTERNAL_PILOT_PROGRAMMING_HANDOFF_CONFORMANCE_BINDING_DRAFT"
};

for (const [key, expected] of Object.entries(exact)) {
  if (d[key] !== expected) {
    fail(`MISMATCH ${key}: expected=${expected} actual=${d[key]}`);
  }
}

const counts = {
  source_chain_entry_count: 21,
  required_internal_pilot_programming_handoff_conformance_field_count: 38,
  binding_rule_count: 38,
  future_resolution_requirement_count: 36,
  required_non_claim_count: 134,
  required_no_execution_boundary_count: 134
};

for (const [key, expected] of Object.entries(counts)) {
  if (d[key] !== expected) {
    fail(`COUNT_MISMATCH ${key}: expected=${expected} actual=${d[key]}`);
  }
}

const arrays = {
  basis: 15,
  required_internal_pilot_programming_handoff_conformance_fields: 38,
  binding_rules: 38,
  future_resolution_requirements: 36,
  explicit_non_claims: 134,
  no_execution_boundary: 134
};

for (const [key, expectedLength] of Object.entries(arrays)) {
  if (!Array.isArray(d[key])) {
    fail(`ARRAY_MISSING ${key}`);
    continue;
  }

  if (d[key].length !== expectedLength) {
    fail(`ARRAY_LENGTH_MISMATCH ${key}: expected=${expectedLength} actual=${d[key].length}`);
  }
}

const requiredBasis = [
  "HBCE-PRODUCT-REALIGNMENT-CONFORMANCE-BINDING-DRAFT-V001",
  "HBCE-GLOBAL-TARGET-MAP-CONFORMANCE-BINDING-DRAFT-V001",
  "HBCE-GOLDEN-FLOW-CONFORMANCE-BINDING-DRAFT-V001",
  "HBCE-MATRIX-EFFECTIVE-STATE-BINDING-DRAFT-V001",
  "HBCE-INDEPENDENT-RECONSTRUCTION-QUALIFIED-VERIFICATION-BINDING-DRAFT-V001",
  "HBCE-EVIDENCE-PROVENANCE-CUSTODY-BINDING-DRAFT-V001",
  "HBCE-CONSEQUENCE-TARGET-OUTCOME-BINDING-DRAFT-V001",
  "HBCE-EXECUTION-TRACE-BINDING-DRAFT-V001",
  "HBCE-CONTROLLED-DISPATCH-BINDING-DRAFT-V001",
  "HBCE-DECISION-APPROVAL-OVERRIDE-BINDING-DRAFT-V001",
  "HBCE-POINT-OF-USE-AUTHORIZATION-BINDING-DRAFT-V001",
  "HBCE-AUTHORIZATION-SCOPE-BINDING-DRAFT-V001",
  "HBCE-POLICY-EVALUATION-BINDING-DRAFT-V001",
  "HBCE-AUTHORITY-REFERENCE-BINDING-DRAFT-V001",
  "HBCE-ACCESS-AUTHORIZATION-REQUEST-BINDING-DRAFT-V001"
];

if (!Array.isArray(d.basis)) {
  fail("BASIS_ARRAY_MISSING basis");
} else {
  for (const item of requiredBasis) {
    if (!d.basis.includes(item)) {
      fail(`BASIS_MISSING ${item}`);
    }
  }
}

const handoffFalseClaims = [
  "internal_pilot_handoff_created",
  "internal_pilot_handoff_validated",
  "pilot_scope_finalized",
  "pilot_operator_assigned",
  "programming_task_completed",
  "repository_ready",
  "branch_ready",
  "commit_ready",
  "validator_complete",
  "test_plan_complete",
  "evidence_pack_complete",
  "acceptance_gate_passed",
  "handoff_recipient_accepted",
  "handoff_instruction_validated",
  "handoff_feedback_loop_active",
  "handoff_release_candidate_created",
  "internal_pilot_ready",
  "programming_handoff_success"
];

for (const key of handoffFalseClaims) {
  if (d[key] !== false) {
    fail(`HANDOFF_BOUNDARY_MISMATCH ${key}: expected=false actual=${d[key]}`);
  }
}

const inheritedCriticalFalseClaims = [
  "product_ready_for_market",
  "product_release_candidate_created",
  "product_runtime_alignment_validated",
  "product_programming_alignment_validated",
  "global_target_map_success",
  "golden_flow_success",
  "matrix_state_success",
  "qualified_verification_success",
  "target_outcome_success",
  "access_granted",
  "execution_completed",
  "legal_certification_created"
];

for (const key of inheritedCriticalFalseClaims) {
  if (d[key] !== false) {
    fail(`INHERITED_BOUNDARY_MISMATCH ${key}: expected=false actual=${d[key]}`);
  }
}

const falseClaimCount = Object.keys(d).filter((key) => d[key] === false).length;
if (falseClaimCount !== 134) {
  fail(`FALSE_CLAIM_COUNT_MISMATCH expected=134 actual=${falseClaimCount}`);
}

console.log(JSON.stringify({
  marker: d.marker,
  object_id: d.object_id,
  basis_marker: d.basis_marker,
  source_chain_entry_count: d.source_chain_entry_count,
  required_internal_pilot_programming_handoff_conformance_field_count: d.required_internal_pilot_programming_handoff_conformance_field_count,
  binding_rule_count: d.binding_rule_count,
  future_resolution_requirement_count: d.future_resolution_requirement_count,
  required_non_claim_count: d.required_non_claim_count,
  required_no_execution_boundary_count: d.required_no_execution_boundary_count,
  internal_pilot_handoff_created: d.internal_pilot_handoff_created,
  internal_pilot_handoff_validated: d.internal_pilot_handoff_validated,
  pilot_scope_finalized: d.pilot_scope_finalized,
  pilot_operator_assigned: d.pilot_operator_assigned,
  programming_task_completed: d.programming_task_completed,
  repository_ready: d.repository_ready,
  branch_ready: d.branch_ready,
  commit_ready: d.commit_ready,
  validator_complete: d.validator_complete,
  test_plan_complete: d.test_plan_complete,
  evidence_pack_complete: d.evidence_pack_complete,
  acceptance_gate_passed: d.acceptance_gate_passed,
  handoff_recipient_accepted: d.handoff_recipient_accepted,
  handoff_instruction_validated: d.handoff_instruction_validated,
  handoff_feedback_loop_active: d.handoff_feedback_loop_active,
  handoff_release_candidate_created: d.handoff_release_candidate_created,
  internal_pilot_ready: d.internal_pilot_ready,
  programming_handoff_success: d.programming_handoff_success,
  product_ready_for_market: d.product_ready_for_market,
  legal_certification_created: d.legal_certification_created,
  false_claim_property_count: falseClaimCount,
  result: ok ? "PASS_INTERNAL_PILOT_PROGRAMMING_HANDOFF_CONFORMANCE_BINDING_DRAFT" : "FAIL_INTERNAL_PILOT_PROGRAMMING_HANDOFF_CONFORMANCE_BINDING_DRAFT"
}, null, 2));

if (ok) {
  console.log("INTERNAL_PILOT_PROGRAMMING_HANDOFF_CONFORMANCE_BINDING_DRAFT=PASS");
  console.log("PROG_303_INTERNAL_PILOT_PROGRAMMING_HANDOFF_CONFORMANCE_BINDING_DRAFT_TEST=PASS");
} else {
  process.exitCode = 1;
}
