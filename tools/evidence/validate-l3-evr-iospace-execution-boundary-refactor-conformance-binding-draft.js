#!/usr/bin/env node

const fs = require("fs");

const file = "evidence/authorization/20261005_HBCE_L3_EVR_IOSPACE_EXECUTION_BOUNDARY_REFACTOR_CONFORMANCE_BINDING_DRAFT_v001.json";

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
  object_id: "HBCE-L3-EVR-IOSPACE-EXECUTION-BOUNDARY-REFACTOR-CONFORMANCE-BINDING-DRAFT-V001",
  artifact_type: "HBCEL3EVRIOSPACEExecutionBoundaryRefactorConformanceBindingDraft",
  classification: "R_AND_D_L3_EVR_IOSPACE_EXECUTION_BOUNDARY_REFACTOR_CONFORMANCE_BINDING_DRAFT_ONLY",
  status: "ACTIVE_L3_EVR_IOSPACE_EXECUTION_BOUNDARY_REFACTOR_CONFORMANCE_BINDING_DRAFT",
  binding_scope: "L3_EVR_IOSPACE_EXECUTION_BOUNDARY_REFACTOR_CONFORMANCE_BINDING",
  binding_mode: "RECORD_ONLY_NOT_EXECUTABLE",
  state: "NOT_IMPLEMENTED_NOT_EXECUTABLE_NOT_BOUND_TO_RUNTIME",
  marker: "L3_EVR_IOSPACE_EXECUTION_BOUNDARY_REFACTOR_CONFORMANCE_BINDING_DRAFT=PASS",
  basis_marker: "HBCE_RD_MASTER_THREE_LEVEL_GOVERNANCE_CONFORMANCE_BINDING_DRAFT_FINAL_AUDIT=1",
  basis_main_commit: "3988bcbe982f224bce62e9185b4f38f8cb3f13a6",
  recommended_next_program: "PROG-308",
  recommended_next_object_id: "HBCE-B2G-LEVEL2-FORENSIC-EVIDENCE-VERIFIER-QUALIFICATION-HARDENING-CONFORMANCE-BINDING-DRAFT-V001",
  result: "PASS_L3_EVR_IOSPACE_EXECUTION_BOUNDARY_REFACTOR_CONFORMANCE_BINDING_DRAFT"
};

for (const [key, expected] of Object.entries(exact)) {
  if (d[key] !== expected) {
    fail(`MISMATCH ${key}: expected=${expected} actual=${d[key]}`);
  }
}

const counts = {
  source_chain_entry_count: 25,
  required_l3_evr_iospace_execution_boundary_refactor_conformance_field_count: 52,
  binding_rule_count: 52,
  future_resolution_requirement_count: 46,
  required_non_claim_count: 248,
  required_no_execution_boundary_count: 248
};

for (const [key, expected] of Object.entries(counts)) {
  if (d[key] !== expected) {
    fail(`COUNT_MISMATCH ${key}: expected=${expected} actual=${d[key]}`);
  }
}

const arrays = {
  basis: 19,
  required_l3_evr_iospace_execution_boundary_refactor_conformance_fields: 52,
  binding_rules: 52,
  future_resolution_requirements: 46,
  explicit_non_claims: 248,
  no_execution_boundary: 248
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

if (!Array.isArray(d.basis)) {
  fail("BASIS_ARRAY_MISSING basis");
} else {
  for (const item of requiredBasis) {
    if (!d.basis.includes(item)) {
      fail(`BASIS_MISSING ${item}`);
    }
  }
}

const l3FalseClaims = [
  "l3_evr_iospace_execution_boundary_refactor_created",
  "l3_evr_iospace_execution_boundary_refactor_validated",
  "l3_evr_finalized",
  "evr_model_validated",
  "iospace_model_validated",
  "iospace_execution_boundary_validated",
  "execution_boundary_refactor_validated",
  "adapter_boundary_validated",
  "l3_runtime_boundary_validated",
  "l3_evidence_boundary_validated",
  "reconstruction_boundary_validated",
  "dispatch_boundary_validated",
  "observation_boundary_validated",
  "target_boundary_validated",
  "consequence_boundary_validated",
  "non_inference_model_validated",
  "fail_closed_model_validated",
  "l3_custody_model_validated",
  "l3_verification_model_validated",
  "l3_dispute_model_validated",
  "l3_escalation_model_validated",
  "l3_review_model_completed",
  "l3_acceptance_model_passed",
  "l3_regression_model_completed",
  "l3_test_matrix_completed",
  "l3_dependency_model_validated",
  "l3_risk_model_resolved",
  "l3_change_control_active",
  "l3_publication_completed",
  "l3_implementation_boundary_validated",
  "l3_certification_boundary_validated",
  "l3_evr_iospace_ready",
  "l3_evr_iospace_success",
  "l3_evr_iospace_production_ready"
];

for (const key of l3FalseClaims) {
  if (d[key] !== false) {
    fail(`L3_BOUNDARY_MISMATCH ${key}: expected=false actual=${d[key]}`);
  }
}

const inheritedCriticalFalseClaims = [
  "rd_master_three_level_governance_success",
  "rd_master_finalized",
  "level_3_governance_validated",
  "corporate_legal_technical_master_success",
  "corporate_legal_technical_master_ready",
  "legal_certification_created",
  "matrix_operating_programming_master_success",
  "matrix_operating_programming_master_ready",
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
  "no_l3_evr_iospace_execution_boundary_refactor_created_claim",
  "no_l3_evr_iospace_execution_boundary_refactor_validated_claim",
  "no_l3_evr_finalized_claim",
  "no_iospace_execution_boundary_validated_claim",
  "no_execution_boundary_refactor_validated_claim",
  "no_non_inference_model_validated_claim",
  "no_fail_closed_model_validated_claim",
  "no_l3_acceptance_model_passed_claim",
  "no_l3_certification_boundary_validated_claim",
  "no_l3_evr_iospace_success_claim",
  "no_l3_evr_iospace_production_ready_claim"
];

for (const item of requiredNonClaimEntries) {
  if (!Array.isArray(d.explicit_non_claims) || !d.explicit_non_claims.includes(item)) {
    fail(`NON_CLAIM_ENTRY_MISSING ${item}`);
  }
}

const requiredBoundaryEntries = [
  "l3_evr_iospace_execution_boundary_refactor_created_false",
  "l3_evr_iospace_execution_boundary_refactor_validated_false",
  "l3_evr_finalized_false",
  "iospace_execution_boundary_validated_false",
  "execution_boundary_refactor_validated_false",
  "non_inference_model_validated_false",
  "fail_closed_model_validated_false",
  "l3_acceptance_model_passed_false",
  "l3_certification_boundary_validated_false",
  "l3_evr_iospace_success_false",
  "l3_evr_iospace_production_ready_false"
];

for (const item of requiredBoundaryEntries) {
  if (!Array.isArray(d.no_execution_boundary) || !d.no_execution_boundary.includes(item)) {
    fail(`NO_EXECUTION_BOUNDARY_ENTRY_MISSING ${item}`);
  }
}

const falseClaimCount = Object.keys(d).filter((key) => d[key] === false).length;
if (falseClaimCount !== 248) {
  fail(`FALSE_CLAIM_COUNT_MISMATCH expected=248 actual=${falseClaimCount}`);
}

console.log(JSON.stringify({
  marker: d.marker,
  object_id: d.object_id,
  basis_marker: d.basis_marker,
  source_chain_entry_count: d.source_chain_entry_count,
  required_l3_evr_iospace_execution_boundary_refactor_conformance_field_count: d.required_l3_evr_iospace_execution_boundary_refactor_conformance_field_count,
  binding_rule_count: d.binding_rule_count,
  future_resolution_requirement_count: d.future_resolution_requirement_count,
  required_non_claim_count: d.required_non_claim_count,
  required_no_execution_boundary_count: d.required_no_execution_boundary_count,
  l3_evr_iospace_execution_boundary_refactor_created: d.l3_evr_iospace_execution_boundary_refactor_created,
  l3_evr_iospace_execution_boundary_refactor_validated: d.l3_evr_iospace_execution_boundary_refactor_validated,
  l3_evr_finalized: d.l3_evr_finalized,
  evr_model_validated: d.evr_model_validated,
  iospace_model_validated: d.iospace_model_validated,
  iospace_execution_boundary_validated: d.iospace_execution_boundary_validated,
  execution_boundary_refactor_validated: d.execution_boundary_refactor_validated,
  adapter_boundary_validated: d.adapter_boundary_validated,
  l3_runtime_boundary_validated: d.l3_runtime_boundary_validated,
  l3_evidence_boundary_validated: d.l3_evidence_boundary_validated,
  reconstruction_boundary_validated: d.reconstruction_boundary_validated,
  dispatch_boundary_validated: d.dispatch_boundary_validated,
  observation_boundary_validated: d.observation_boundary_validated,
  target_boundary_validated: d.target_boundary_validated,
  consequence_boundary_validated: d.consequence_boundary_validated,
  non_inference_model_validated: d.non_inference_model_validated,
  fail_closed_model_validated: d.fail_closed_model_validated,
  l3_acceptance_model_passed: d.l3_acceptance_model_passed,
  l3_certification_boundary_validated: d.l3_certification_boundary_validated,
  l3_evr_iospace_ready: d.l3_evr_iospace_ready,
  l3_evr_iospace_success: d.l3_evr_iospace_success,
  l3_evr_iospace_production_ready: d.l3_evr_iospace_production_ready,
  legal_certification_created: d.legal_certification_created,
  false_claim_property_count: falseClaimCount,
  result: ok ? "PASS_L3_EVR_IOSPACE_EXECUTION_BOUNDARY_REFACTOR_CONFORMANCE_BINDING_DRAFT" : "FAIL_L3_EVR_IOSPACE_EXECUTION_BOUNDARY_REFACTOR_CONFORMANCE_BINDING_DRAFT"
}, null, 2));

if (ok) {
  console.log("L3_EVR_IOSPACE_EXECUTION_BOUNDARY_REFACTOR_CONFORMANCE_BINDING_DRAFT=PASS");
  console.log("PROG_307_L3_EVR_IOSPACE_EXECUTION_BOUNDARY_REFACTOR_CONFORMANCE_BINDING_DRAFT_TEST=PASS");
} else {
  process.exitCode = 1;
}
