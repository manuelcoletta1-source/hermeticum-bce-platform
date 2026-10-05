#!/usr/bin/env node

const fs = require("fs");

const file = "evidence/authorization/20261005_HBCE_MATRIX_OPERATING_PROGRAMMING_MASTER_CONFORMANCE_BINDING_DRAFT_v001.json";

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
  object_id: "HBCE-MATRIX-OPERATING-PROGRAMMING-MASTER-CONFORMANCE-BINDING-DRAFT-V001",
  artifact_type: "HBCEMatrixOperatingProgrammingMasterConformanceBindingDraft",
  classification: "R_AND_D_MATRIX_OPERATING_PROGRAMMING_MASTER_CONFORMANCE_BINDING_DRAFT_ONLY",
  status: "ACTIVE_MATRIX_OPERATING_PROGRAMMING_MASTER_CONFORMANCE_BINDING_DRAFT",
  binding_scope: "MATRIX_OPERATING_PROGRAMMING_MASTER_CONFORMANCE_BINDING",
  binding_mode: "RECORD_ONLY_NOT_EXECUTABLE",
  state: "NOT_IMPLEMENTED_NOT_EXECUTABLE_NOT_BOUND_TO_RUNTIME",
  marker: "MATRIX_OPERATING_PROGRAMMING_MASTER_CONFORMANCE_BINDING_DRAFT=PASS",
  basis_marker: "HBCE_INTERNAL_PILOT_PROGRAMMING_HANDOFF_CONFORMANCE_BINDING_DRAFT_FINAL_AUDIT=1",
  basis_main_commit: "621e6c5af91d716d0e0adecff102d55c9e5a06ca",
  recommended_next_program: "PROG-305",
  recommended_next_object_id: "HBCE-CORPORATE-LEGAL-TECHNICAL-MASTER-CONFORMANCE-BINDING-DRAFT-V001",
  result: "PASS_MATRIX_OPERATING_PROGRAMMING_MASTER_CONFORMANCE_BINDING_DRAFT"
};

for (const [key, expected] of Object.entries(exact)) {
  if (d[key] !== expected) {
    fail(`MISMATCH ${key}: expected=${expected} actual=${d[key]}`);
  }
}

const counts = {
  source_chain_entry_count: 22,
  required_matrix_operating_programming_master_conformance_field_count: 40,
  binding_rule_count: 40,
  future_resolution_requirement_count: 38,
  required_non_claim_count: 158,
  required_no_execution_boundary_count: 158
};

for (const [key, expected] of Object.entries(counts)) {
  if (d[key] !== expected) {
    fail(`COUNT_MISMATCH ${key}: expected=${expected} actual=${d[key]}`);
  }
}

const arrays = {
  basis: 16,
  required_matrix_operating_programming_master_conformance_fields: 40,
  binding_rules: 40,
  future_resolution_requirements: 38,
  explicit_non_claims: 158,
  no_execution_boundary: 158
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
  "HBCE-INTERNAL-PILOT-PROGRAMMING-HANDOFF-CONFORMANCE-BINDING-DRAFT-V001",
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

const masterFalseClaims = [
  "matrix_operating_programming_master_created",
  "matrix_operating_programming_master_validated",
  "operating_matrix_finalized",
  "programming_master_finalized",
  "programming_layer_finalized",
  "programming_cell_finalized",
  "work_package_completed",
  "dependency_graph_validated",
  "priority_model_validated",
  "owner_model_assigned",
  "review_model_completed",
  "test_matrix_completed",
  "regression_matrix_completed",
  "release_boundary_validated",
  "runtime_boundary_validated",
  "evidence_boundary_validated",
  "change_control_active",
  "blocker_register_resolved",
  "risk_register_resolved",
  "acceptance_model_passed",
  "handoff_trace_validated",
  "matrix_operating_programming_master_published",
  "matrix_operating_programming_master_ready",
  "matrix_operating_programming_master_success"
];

for (const key of masterFalseClaims) {
  if (d[key] !== false) {
    fail(`MASTER_BOUNDARY_MISMATCH ${key}: expected=false actual=${d[key]}`);
  }
}

const inheritedCriticalFalseClaims = [
  "internal_pilot_ready",
  "programming_handoff_success",
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
if (falseClaimCount !== 158) {
  fail(`FALSE_CLAIM_COUNT_MISMATCH expected=158 actual=${falseClaimCount}`);
}

console.log(JSON.stringify({
  marker: d.marker,
  object_id: d.object_id,
  basis_marker: d.basis_marker,
  source_chain_entry_count: d.source_chain_entry_count,
  required_matrix_operating_programming_master_conformance_field_count: d.required_matrix_operating_programming_master_conformance_field_count,
  binding_rule_count: d.binding_rule_count,
  future_resolution_requirement_count: d.future_resolution_requirement_count,
  required_non_claim_count: d.required_non_claim_count,
  required_no_execution_boundary_count: d.required_no_execution_boundary_count,
  matrix_operating_programming_master_created: d.matrix_operating_programming_master_created,
  matrix_operating_programming_master_validated: d.matrix_operating_programming_master_validated,
  operating_matrix_finalized: d.operating_matrix_finalized,
  programming_master_finalized: d.programming_master_finalized,
  programming_layer_finalized: d.programming_layer_finalized,
  programming_cell_finalized: d.programming_cell_finalized,
  work_package_completed: d.work_package_completed,
  dependency_graph_validated: d.dependency_graph_validated,
  priority_model_validated: d.priority_model_validated,
  owner_model_assigned: d.owner_model_assigned,
  review_model_completed: d.review_model_completed,
  test_matrix_completed: d.test_matrix_completed,
  regression_matrix_completed: d.regression_matrix_completed,
  release_boundary_validated: d.release_boundary_validated,
  runtime_boundary_validated: d.runtime_boundary_validated,
  evidence_boundary_validated: d.evidence_boundary_validated,
  change_control_active: d.change_control_active,
  blocker_register_resolved: d.blocker_register_resolved,
  risk_register_resolved: d.risk_register_resolved,
  acceptance_model_passed: d.acceptance_model_passed,
  handoff_trace_validated: d.handoff_trace_validated,
  matrix_operating_programming_master_published: d.matrix_operating_programming_master_published,
  matrix_operating_programming_master_ready: d.matrix_operating_programming_master_ready,
  matrix_operating_programming_master_success: d.matrix_operating_programming_master_success,
  internal_pilot_ready: d.internal_pilot_ready,
  product_ready_for_market: d.product_ready_for_market,
  legal_certification_created: d.legal_certification_created,
  false_claim_property_count: falseClaimCount,
  result: ok ? "PASS_MATRIX_OPERATING_PROGRAMMING_MASTER_CONFORMANCE_BINDING_DRAFT" : "FAIL_MATRIX_OPERATING_PROGRAMMING_MASTER_CONFORMANCE_BINDING_DRAFT"
}, null, 2));

if (ok) {
  console.log("MATRIX_OPERATING_PROGRAMMING_MASTER_CONFORMANCE_BINDING_DRAFT=PASS");
  console.log("PROG_304_MATRIX_OPERATING_PROGRAMMING_MASTER_CONFORMANCE_BINDING_DRAFT_TEST=PASS");
} else {
  process.exitCode = 1;
}
