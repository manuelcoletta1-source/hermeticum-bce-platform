#!/usr/bin/env node

const fs = require("fs");

const file = "evidence/authorization/20261005_HBCE_B2B_LEVEL1_JOKER_C2_LAYER_MATRIX_CONFORMANCE_BINDING_DRAFT_v001.json";

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
  object_id: "HBCE-B2B-LEVEL1-JOKER-C2-LAYER-MATRIX-CONFORMANCE-BINDING-DRAFT-V001",
  artifact_type: "HBCEB2BLevel1JokerC2LayerMatrixConformanceBindingDraft",
  classification: "R_AND_D_B2B_LEVEL1_JOKER_C2_LAYER_MATRIX_CONFORMANCE_BINDING_DRAFT_ONLY",
  status: "ACTIVE_B2B_LEVEL1_JOKER_C2_LAYER_MATRIX_CONFORMANCE_BINDING_DRAFT",
  binding_scope: "B2B_LEVEL1_JOKER_C2_LAYER_MATRIX_CONFORMANCE_BINDING",
  binding_mode: "RECORD_ONLY_NOT_EXECUTABLE",
  state: "NOT_IMPLEMENTED_NOT_EXECUTABLE_NOT_BOUND_TO_RUNTIME",
  marker: "B2B_LEVEL1_JOKER_C2_LAYER_MATRIX_CONFORMANCE_BINDING_DRAFT=PASS",
  basis_marker: "HBCE_B2G_LEVEL2_FORENSIC_EVIDENCE_VERIFIER_QUALIFICATION_HARDENING_CONFORMANCE_BINDING_DRAFT_FINAL_AUDIT=1",
  basis_main_commit: "cb495e650f13ea4716cb667f8adbd286568d452b",
  recommended_next_program: "PROG-310",
  recommended_next_object_id: "HBCE-IPR-DOCUMENTO-INQUADRAMENTO-TECNICO-IMPRENDITORIALE-CONFORMANCE-BINDING-DRAFT-V001",
  result: "PASS_B2B_LEVEL1_JOKER_C2_LAYER_MATRIX_CONFORMANCE_BINDING_DRAFT"
};

for (const [key, expected] of Object.entries(exact)) {
  if (d[key] !== expected) {
    fail(`MISMATCH ${key}: expected=${expected} actual=${d[key]}`);
  }
}

const counts = {
  source_chain_entry_count: 27,
  required_b2b_level1_joker_c2_layer_matrix_conformance_field_count: 58,
  binding_rule_count: 58,
  future_resolution_requirement_count: 52,
  required_non_claim_count: 320,
  required_no_execution_boundary_count: 320
};

for (const [key, expected] of Object.entries(counts)) {
  if (d[key] !== expected) {
    fail(`COUNT_MISMATCH ${key}: expected=${expected} actual=${d[key]}`);
  }
}

const arrays = {
  basis: 21,
  required_b2b_level1_joker_c2_layer_matrix_conformance_fields: 58,
  binding_rules: 58,
  future_resolution_requirements: 52,
  explicit_non_claims: 320,
  no_execution_boundary: 320
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
  "HBCE-B2G-LEVEL2-FORENSIC-EVIDENCE-VERIFIER-QUALIFICATION-HARDENING-CONFORMANCE-BINDING-DRAFT-V001",
  "HBCE-L3-EVR-IOSPACE-EXECUTION-BOUNDARY-REFACTOR-CONFORMANCE-BINDING-DRAFT-V001",
  "HBCE-RD-MASTER-THREE-LEVEL-GOVERNANCE-CONFORMANCE-BINDING-DRAFT-V001",
  "HBCE-CORPORATE-LEGAL-TECHNICAL-MASTER-CONFORMANCE-BINDING-DRAFT-V001",
  "HBCE-MATRIX-OPERATING-PROGRAMMING-MASTER-CONFORMANCE-BINDING-DRAFT-V001",
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

for (const item of requiredBasis) {
  if (!Array.isArray(d.basis) || !d.basis.includes(item)) {
    fail(`BASIS_MISSING ${item}`);
  }
}

const requiredFields = [
  "b2b_level1_joker_c2_layer_matrix_conformance_id",
  "b2b_level1_joker_c2_layer_matrix_conformance_version",
  "request_ref",
  "authority_ref",
  "policy_evaluation_ref",
  "authorization_scope_ref",
  "point_of_use_authorization_ref",
  "decision_approval_override_ref",
  "controlled_dispatch_ref",
  "execution_trace_ref",
  "consequence_target_outcome_ref",
  "evidence_provenance_custody_ref",
  "independent_reconstruction_qualified_verification_ref",
  "matrix_effective_state_ref",
  "golden_flow_conformance_ref",
  "global_target_map_conformance_ref",
  "product_realignment_conformance_ref",
  "internal_pilot_programming_handoff_conformance_ref",
  "matrix_operating_programming_master_conformance_ref",
  "corporate_legal_technical_master_conformance_ref",
  "rd_master_three_level_governance_conformance_ref",
  "l3_evr_iospace_execution_boundary_refactor_conformance_ref",
  "b2g_level2_forensic_evidence_verifier_qualification_hardening_conformance_ref",
  "b2b_ref",
  "level1_ref",
  "joker_c2_ref",
  "layer_matrix_ref",
  "b2b_layer_matrix_ref",
  "demo_profile_ref",
  "signed_profile_ref",
  "observed_profile_ref",
  "target_profile_ref",
  "adapter_profile_ref",
  "receipt_profile_ref",
  "checkpoint_profile_ref",
  "custody_plan_ref",
  "chainlink_ref",
  "succession_model_ref",
  "unknown_state_model_ref",
  "fail_closed_model_ref",
  "non_inference_model_ref",
  "customer_boundary_ref",
  "pilot_boundary_ref",
  "commercial_decision_boundary_ref",
  "technical_validation_boundary_ref",
  "pricing_boundary_ref",
  "cost_model_boundary_ref",
  "threat_model_ref",
  "gate_model_ref",
  "test_matrix_ref",
  "acceptance_gate_ref",
  "review_model_ref",
  "risk_register_ref",
  "dependency_model_ref",
  "publication_ref",
  "implementation_boundary_ref",
  "certification_boundary_ref",
  "b2b_level1_joker_c2_layer_matrix_boundary_statement"
];

for (const item of requiredFields) {
  if (!Array.isArray(d.required_b2b_level1_joker_c2_layer_matrix_conformance_fields) || !d.required_b2b_level1_joker_c2_layer_matrix_conformance_fields.includes(item)) {
    fail(`REQUIRED_FIELD_MISSING ${item}`);
  }
}

const b2bFalseClaims = [
  "b2b_level1_joker_c2_layer_matrix_created",
  "b2b_level1_joker_c2_layer_matrix_validated",
  "b2b_level1_finalized",
  "b2b_level1_governance_validated",
  "b2b_level1_joker_c2_layer_validated",
  "b2b_level1_matrix_layer_validated",
  "b2b_level1_demo_profile_validated",
  "b2b_level1_signed_profile_validated",
  "b2b_level1_observed_profile_validated",
  "b2b_level1_target_profile_validated",
  "b2b_level1_adapter_profile_validated",
  "b2b_level1_receipt_profile_validated",
  "b2b_level1_checkpoint_profile_validated",
  "b2b_level1_custody_plan_validated",
  "b2b_level1_chainlink_validated",
  "b2b_level1_succession_model_validated",
  "b2b_level1_unknown_state_model_validated",
  "b2b_level1_fail_closed_model_validated",
  "b2b_level1_non_inference_model_validated",
  "b2b_level1_customer_boundary_validated",
  "b2b_level1_pilot_boundary_validated",
  "b2b_level1_commercial_decision_boundary_validated",
  "b2b_level1_technical_validation_boundary_validated",
  "b2b_level1_pricing_boundary_validated",
  "b2b_level1_cost_model_boundary_validated",
  "b2b_level1_threat_model_validated",
  "b2b_level1_gate_model_validated",
  "b2b_level1_test_matrix_completed",
  "b2b_level1_acceptance_gate_passed",
  "b2b_level1_review_completed",
  "b2b_level1_risk_register_resolved",
  "b2b_level1_dependency_model_validated",
  "b2b_level1_ready",
  "b2b_level1_success",
  "b2b_level1_production_ready",
  "b2b_level1_customer_ready"
];

for (const key of b2bFalseClaims) {
  if (d[key] !== false) {
    fail(`B2B_BOUNDARY_MISMATCH ${key}: expected=false actual=${d[key]}`);
  }
}

const inheritedCriticalFalseClaims = [
  "b2g_level2_success",
  "b2g_level2_finalized",
  "b2g_level2_production_ready",
  "verifier_qualification_validated",
  "verifier_independence_validated",
  "forensic_evidence_package_validated",
  "evidence_admissibility_validated",
  "evidence_integrity_validated",
  "l3_evr_iospace_success",
  "l3_evr_finalized",
  "iospace_execution_boundary_validated",
  "rd_master_three_level_governance_success",
  "rd_master_finalized",
  "corporate_legal_technical_master_success",
  "corporate_legal_technical_master_ready",
  "legal_certification_created",
  "matrix_operating_programming_master_success",
  "internal_pilot_ready",
  "programming_handoff_success",
  "product_ready_for_market",
  "product_release_candidate_created",
  "global_target_map_success",
  "golden_flow_success",
  "matrix_state_success",
  "qualified_verification_success",
  "target_outcome_success",
  "access_granted",
  "execution_completed"
];

for (const key of inheritedCriticalFalseClaims) {
  if (d[key] !== false) {
    fail(`INHERITED_BOUNDARY_MISMATCH ${key}: expected=false actual=${d[key]}`);
  }
}

const requiredNonClaimEntries = [
  "no_b2b_level1_joker_c2_layer_matrix_created_claim",
  "no_b2b_level1_joker_c2_layer_matrix_validated_claim",
  "no_b2b_level1_finalized_claim",
  "no_b2b_level1_demo_profile_validated_claim",
  "no_b2b_level1_signed_profile_validated_claim",
  "no_b2b_level1_observed_profile_validated_claim",
  "no_b2b_level1_target_profile_validated_claim",
  "no_b2b_level1_receipt_profile_validated_claim",
  "no_b2b_level1_checkpoint_profile_validated_claim",
  "no_b2b_level1_custody_plan_validated_claim",
  "no_b2b_level1_chainlink_validated_claim",
  "no_b2b_level1_acceptance_gate_passed_claim",
  "no_b2b_level1_success_claim",
  "no_b2b_level1_production_ready_claim",
  "no_b2b_level1_customer_ready_claim"
];

for (const item of requiredNonClaimEntries) {
  if (!Array.isArray(d.explicit_non_claims) || !d.explicit_non_claims.includes(item)) {
    fail(`NON_CLAIM_ENTRY_MISSING ${item}`);
  }
}

const requiredBoundaryEntries = [
  "b2b_level1_joker_c2_layer_matrix_created_false",
  "b2b_level1_joker_c2_layer_matrix_validated_false",
  "b2b_level1_finalized_false",
  "b2b_level1_demo_profile_validated_false",
  "b2b_level1_signed_profile_validated_false",
  "b2b_level1_observed_profile_validated_false",
  "b2b_level1_target_profile_validated_false",
  "b2b_level1_receipt_profile_validated_false",
  "b2b_level1_checkpoint_profile_validated_false",
  "b2b_level1_custody_plan_validated_false",
  "b2b_level1_chainlink_validated_false",
  "b2b_level1_acceptance_gate_passed_false",
  "b2b_level1_success_false",
  "b2b_level1_production_ready_false",
  "b2b_level1_customer_ready_false"
];

for (const item of requiredBoundaryEntries) {
  if (!Array.isArray(d.no_execution_boundary) || !d.no_execution_boundary.includes(item)) {
    fail(`NO_EXECUTION_BOUNDARY_ENTRY_MISSING ${item}`);
  }
}

const falseClaimCount = Object.keys(d).filter((key) => d[key] === false).length;
if (falseClaimCount !== 320) {
  fail(`FALSE_CLAIM_COUNT_MISMATCH expected=320 actual=${falseClaimCount}`);
}

console.log(JSON.stringify({
  marker: d.marker,
  object_id: d.object_id,
  basis_marker: d.basis_marker,
  source_chain_entry_count: d.source_chain_entry_count,
  required_b2b_level1_joker_c2_layer_matrix_conformance_field_count: d.required_b2b_level1_joker_c2_layer_matrix_conformance_field_count,
  binding_rule_count: d.binding_rule_count,
  future_resolution_requirement_count: d.future_resolution_requirement_count,
  required_non_claim_count: d.required_non_claim_count,
  required_no_execution_boundary_count: d.required_no_execution_boundary_count,
  b2b_level1_joker_c2_layer_matrix_created: d.b2b_level1_joker_c2_layer_matrix_created,
  b2b_level1_joker_c2_layer_matrix_validated: d.b2b_level1_joker_c2_layer_matrix_validated,
  b2b_level1_finalized: d.b2b_level1_finalized,
  b2b_level1_governance_validated: d.b2b_level1_governance_validated,
  b2b_level1_demo_profile_validated: d.b2b_level1_demo_profile_validated,
  b2b_level1_signed_profile_validated: d.b2b_level1_signed_profile_validated,
  b2b_level1_observed_profile_validated: d.b2b_level1_observed_profile_validated,
  b2b_level1_target_profile_validated: d.b2b_level1_target_profile_validated,
  b2b_level1_adapter_profile_validated: d.b2b_level1_adapter_profile_validated,
  b2b_level1_receipt_profile_validated: d.b2b_level1_receipt_profile_validated,
  b2b_level1_checkpoint_profile_validated: d.b2b_level1_checkpoint_profile_validated,
  b2b_level1_custody_plan_validated: d.b2b_level1_custody_plan_validated,
  b2b_level1_chainlink_validated: d.b2b_level1_chainlink_validated,
  b2b_level1_acceptance_gate_passed: d.b2b_level1_acceptance_gate_passed,
  b2b_level1_ready: d.b2b_level1_ready,
  b2b_level1_success: d.b2b_level1_success,
  b2b_level1_production_ready: d.b2b_level1_production_ready,
  b2b_level1_customer_ready: d.b2b_level1_customer_ready,
  b2g_level2_success: d.b2g_level2_success,
  verifier_qualification_validated: d.verifier_qualification_validated,
  product_ready_for_market: d.product_ready_for_market,
  legal_certification_created: d.legal_certification_created,
  false_claim_property_count: falseClaimCount,
  result: ok ? "PASS_B2B_LEVEL1_JOKER_C2_LAYER_MATRIX_CONFORMANCE_BINDING_DRAFT" : "FAIL_B2B_LEVEL1_JOKER_C2_LAYER_MATRIX_CONFORMANCE_BINDING_DRAFT"
}, null, 2));

if (ok) {
  console.log("B2B_LEVEL1_JOKER_C2_LAYER_MATRIX_CONFORMANCE_BINDING_DRAFT=PASS");
  console.log("PROG_309_B2B_LEVEL1_JOKER_C2_LAYER_MATRIX_CONFORMANCE_BINDING_DRAFT_TEST=PASS");
} else {
  process.exitCode = 1;
}
