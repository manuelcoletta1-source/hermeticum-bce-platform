#!/usr/bin/env node

const fs = require("fs");

const file = "evidence/authorization/20261005_HBCE_PRODUCT_REALIGNMENT_CONFORMANCE_BINDING_DRAFT_v001.json";

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
  object_id: "HBCE-PRODUCT-REALIGNMENT-CONFORMANCE-BINDING-DRAFT-V001",
  artifact_type: "HBCEProductRealignmentConformanceBindingDraft",
  classification: "R_AND_D_PRODUCT_REALIGNMENT_CONFORMANCE_BINDING_DRAFT_ONLY",
  status: "ACTIVE_PRODUCT_REALIGNMENT_CONFORMANCE_BINDING_DRAFT",
  binding_scope: "PRODUCT_REALIGNMENT_CONFORMANCE_BINDING",
  binding_mode: "RECORD_ONLY_NOT_EXECUTABLE",
  state: "NOT_IMPLEMENTED_NOT_EXECUTABLE_NOT_BOUND_TO_RUNTIME",
  marker: "PRODUCT_REALIGNMENT_CONFORMANCE_BINDING_DRAFT=PASS",
  basis_marker: "HBCE_GLOBAL_TARGET_MAP_CONFORMANCE_BINDING_DRAFT_FINAL_AUDIT=1",
  basis_main_commit: "314e4e40c720cc122badede6269872a36b4a4ad7",
  recommended_next_program: "PROG-303",
  recommended_next_object_id: "HBCE-INTERNAL-PILOT-PROGRAMMING-HANDOFF-CONFORMANCE-BINDING-DRAFT-V001",
  result: "PASS_PRODUCT_REALIGNMENT_CONFORMANCE_BINDING_DRAFT"
};

for (const [key, expected] of Object.entries(exact)) {
  if (d[key] !== expected) {
    fail(`MISMATCH ${key}: expected=${expected} actual=${d[key]}`);
  }
}

const counts = {
  source_chain_entry_count: 20,
  required_product_realignment_conformance_field_count: 34,
  binding_rule_count: 32,
  future_resolution_requirement_count: 32,
  required_non_claim_count: 116,
  required_no_execution_boundary_count: 116
};

for (const [key, expected] of Object.entries(counts)) {
  if (d[key] !== expected) {
    fail(`COUNT_MISMATCH ${key}: expected=${expected} actual=${d[key]}`);
  }
}

const arrays = {
  basis: 14,
  required_product_realignment_conformance_fields: 34,
  binding_rules: 32,
  future_resolution_requirements: 32,
  explicit_non_claims: 116,
  no_execution_boundary: 116
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

const expectedFalse = [
  "runtime_gate_implemented",
  "runtime_gate_enabled",
  "positive_authorization_contract_issued",
  "authority_validated",
  "authority_effective",
  "policy_evaluated",
  "policy_passed",
  "policy_effective",
  "scope_approved",
  "scope_effective",
  "point_of_use_authorization_evaluated",
  "point_of_use_authorization_effective",
  "decision_evaluated",
  "decision_approved",
  "override_evaluated",
  "override_effective",
  "authorization_decision_created",
  "request_approved",
  "access_granted",
  "dispatch_authorized",
  "dispatch_precondition_evaluated",
  "controlled_dispatch_created",
  "controlled_dispatch_sent",
  "controlled_dispatch_effective",
  "execution_precondition_evaluated",
  "execution_authorized",
  "execution_trace_created",
  "execution_trace_validated",
  "execution_started",
  "execution_completed",
  "target_receipt_created",
  "target_receipt_validated",
  "effect_evidence_created",
  "effect_evidence_validated",
  "intended_outcome_achieved",
  "observed_outcome_validated",
  "outcome_comparison_validated",
  "consequence_asserted",
  "target_outcome_success",
  "evidence_record_created",
  "evidence_record_validated",
  "provenance_record_created",
  "provenance_record_validated",
  "custody_record_created",
  "custody_record_validated",
  "chain_of_custody_complete",
  "evidence_integrity_validated",
  "evidence_admissibility_asserted",
  "independent_reconstruction_started",
  "independent_reconstruction_completed",
  "reconstruction_result_created",
  "reconstruction_result_validated",
  "reconstruction_reproducibility_validated",
  "qualified_verifier_assigned",
  "verifier_independence_validated",
  "verifier_qualification_validated",
  "verification_report_created",
  "verification_report_validated",
  "qualified_verification_success",
  "production_authorization_service_created",
  "onboarding_created",
  "identity_verified",
  "certificate_issued",
  "legal_certification_created",
  "matrix_state_input_created",
  "matrix_state_vector_created",
  "matrix_state_transition_created",
  "matrix_effective_state_created",
  "matrix_effective_state_validated",
  "matrix_state_published",
  "matrix_state_effective",
  "matrix_state_confidence_validated",
  "matrix_state_dispute_resolved",
  "matrix_state_success",
  "golden_flow_input_created",
  "golden_flow_scenario_created",
  "golden_flow_trace_created",
  "golden_flow_expected_path_created",
  "golden_flow_observed_path_created",
  "golden_flow_conformance_rule_validated",
  "golden_flow_conformance_evaluated",
  "golden_flow_conformance_passed",
  "golden_flow_non_inference_validated",
  "golden_flow_fail_closed_validated",
  "golden_flow_report_created",
  "golden_flow_success",
  "global_target_map_input_created",
  "global_target_map_candidate_fixture_created",
  "global_target_map_target_profile_created",
  "global_target_map_constraint_created",
  "global_target_map_mapping_created",
  "global_target_map_conformance_rule_validated",
  "global_target_map_conformance_evaluated",
  "global_target_map_conformance_passed",
  "global_target_map_coverage_validated",
  "global_target_map_conflict_resolved",
  "global_target_map_report_created",
  "global_target_map_published",
  "global_target_map_effective",
  "global_target_map_success",
  "product_realignment_patch_validated",
  "product_scope_finalized",
  "product_surface_finalized",
  "product_module_finalized",
  "product_capability_validated",
  "product_boundary_validated",
  "product_claim_register_validated",
  "product_non_claim_register_validated",
  "product_runtime_alignment_validated",
  "product_programming_alignment_validated",
  "product_roadmap_alignment_validated",
  "product_customer_pack_alignment_validated",
  "product_risk_register_validated",
  "product_compliance_mapping_validated",
  "product_release_candidate_created",
  "product_ready_for_market"
];

for (const key of expectedFalse) {
  if (d[key] !== false) {
    fail(`BOUNDARY_MISMATCH ${key}: expected=false actual=${d[key]}`);
  }
}

const falseClaimCount = Object.keys(d).filter((key) => d[key] === false).length;
if (falseClaimCount !== 116) {
  fail(`FALSE_CLAIM_COUNT_MISMATCH expected=116 actual=${falseClaimCount}`);
}

console.log(JSON.stringify({
  marker: d.marker,
  object_id: d.object_id,
  basis_marker: d.basis_marker,
  source_chain_entry_count: d.source_chain_entry_count,
  required_product_realignment_conformance_field_count: d.required_product_realignment_conformance_field_count,
  binding_rule_count: d.binding_rule_count,
  future_resolution_requirement_count: d.future_resolution_requirement_count,
  required_non_claim_count: d.required_non_claim_count,
  required_no_execution_boundary_count: d.required_no_execution_boundary_count,
  product_realignment_patch_validated: d.product_realignment_patch_validated,
  product_scope_finalized: d.product_scope_finalized,
  product_surface_finalized: d.product_surface_finalized,
  product_module_finalized: d.product_module_finalized,
  product_capability_validated: d.product_capability_validated,
  product_boundary_validated: d.product_boundary_validated,
  product_claim_register_validated: d.product_claim_register_validated,
  product_non_claim_register_validated: d.product_non_claim_register_validated,
  product_runtime_alignment_validated: d.product_runtime_alignment_validated,
  product_programming_alignment_validated: d.product_programming_alignment_validated,
  product_roadmap_alignment_validated: d.product_roadmap_alignment_validated,
  product_customer_pack_alignment_validated: d.product_customer_pack_alignment_validated,
  product_risk_register_validated: d.product_risk_register_validated,
  product_compliance_mapping_validated: d.product_compliance_mapping_validated,
  product_release_candidate_created: d.product_release_candidate_created,
  product_ready_for_market: d.product_ready_for_market,
  legal_certification_created: d.legal_certification_created,
  result: ok ? "PASS_PRODUCT_REALIGNMENT_CONFORMANCE_BINDING_DRAFT" : "FAIL_PRODUCT_REALIGNMENT_CONFORMANCE_BINDING_DRAFT"
}, null, 2));

if (ok) {
  console.log("PRODUCT_REALIGNMENT_CONFORMANCE_BINDING_DRAFT=PASS");
  console.log("PROG_302_PRODUCT_REALIGNMENT_CONFORMANCE_BINDING_DRAFT_TEST=PASS");
} else {
  process.exitCode = 1;
}
