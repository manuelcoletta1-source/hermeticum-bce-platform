#!/usr/bin/env node

const fs = require("fs");

const file = "evidence/authorization/20261005_HBCE_RD_MASTER_THREE_LEVEL_GOVERNANCE_CONFORMANCE_BINDING_DRAFT_v001.json";

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
  object_id: "HBCE-RD-MASTER-THREE-LEVEL-GOVERNANCE-CONFORMANCE-BINDING-DRAFT-V001",
  artifact_type: "HBCERDMasterThreeLevelGovernanceConformanceBindingDraft",
  classification: "R_AND_D_RD_MASTER_THREE_LEVEL_GOVERNANCE_CONFORMANCE_BINDING_DRAFT_ONLY",
  status: "ACTIVE_RD_MASTER_THREE_LEVEL_GOVERNANCE_CONFORMANCE_BINDING_DRAFT",
  binding_scope: "RD_MASTER_THREE_LEVEL_GOVERNANCE_CONFORMANCE_BINDING",
  binding_mode: "RECORD_ONLY_NOT_EXECUTABLE",
  state: "NOT_IMPLEMENTED_NOT_EXECUTABLE_NOT_BOUND_TO_RUNTIME",
  marker: "RD_MASTER_THREE_LEVEL_GOVERNANCE_CONFORMANCE_BINDING_DRAFT=PASS",
  basis_marker: "HBCE_CORPORATE_LEGAL_TECHNICAL_MASTER_CONFORMANCE_BINDING_DRAFT_FINAL_AUDIT=1",
  basis_main_commit: "c3e06821391ab699c1715a3b12e51e737c0579fd",
  recommended_next_program: "PROG-307",
  recommended_next_object_id: "HBCE-L3-EVR-IOSPACE-EXECUTION-BOUNDARY-REFACTOR-CONFORMANCE-BINDING-DRAFT-V001",
  result: "PASS_RD_MASTER_THREE_LEVEL_GOVERNANCE_CONFORMANCE_BINDING_DRAFT"
};

for (const [key, expected] of Object.entries(exact)) {
  if (d[key] !== expected) {
    fail(`MISMATCH ${key}: expected=${expected} actual=${d[key]}`);
  }
}

const counts = {
  source_chain_entry_count: 24,
  required_rd_master_three_level_governance_conformance_field_count: 48,
  binding_rule_count: 48,
  future_resolution_requirement_count: 42,
  required_non_claim_count: 214,
  required_no_execution_boundary_count: 214
};

for (const [key, expected] of Object.entries(counts)) {
  if (d[key] !== expected) {
    fail(`COUNT_MISMATCH ${key}: expected=${expected} actual=${d[key]}`);
  }
}

const arrays = {
  basis: 18,
  required_rd_master_three_level_governance_conformance_fields: 48,
  binding_rules: 48,
  future_resolution_requirements: 42,
  explicit_non_claims: 214,
  no_execution_boundary: 214
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

const rdFalseClaims = [
  "rd_master_three_level_governance_created",
  "rd_master_three_level_governance_validated",
  "rd_master_finalized",
  "three_level_governance_finalized",
  "level_1_governance_validated",
  "level_2_governance_validated",
  "level_3_governance_validated",
  "b2b_governance_validated",
  "b2g_governance_validated",
  "evr_governance_validated",
  "governance_layer_validated",
  "corporate_layer_validated",
  "legal_layer_validated",
  "technical_layer_validated",
  "evidence_layer_validated",
  "runtime_layer_validated",
  "matrix_layer_validated",
  "responsibility_chain_validated",
  "control_chain_validated",
  "verification_chain_validated",
  "escalation_model_validated",
  "review_model_completed",
  "rd_review_model_completed",
  "acceptance_model_passed",
  "rd_acceptance_model_passed",
  "dependency_model_validated",
  "risk_model_resolved",
  "execution_boundary_validated",
  "certification_boundary_validated",
  "rd_certification_boundary_validated",
  "governance_review_completed",
  "rd_acceptance_passed",
  "rd_master_three_level_governance_success"
];

for (const key of rdFalseClaims) {
  if (d[key] !== false) {
    fail(`RD_BOUNDARY_MISMATCH ${key}: expected=false actual=${d[key]}`);
  }
}

const inheritedCriticalFalseClaims = [
  "corporate_legal_technical_master_success",
  "corporate_legal_technical_master_ready",
  "corporate_acceptance_passed",
  "legal_review_completed",
  "technical_review_completed",
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
  "no_rd_review_model_completed_claim",
  "no_rd_acceptance_model_passed_claim",
  "no_rd_certification_boundary_validated_claim"
];

for (const item of requiredNonClaimEntries) {
  if (!Array.isArray(d.explicit_non_claims) || !d.explicit_non_claims.includes(item)) {
    fail(`NON_CLAIM_ENTRY_MISSING ${item}`);
  }
}

const requiredBoundaryEntries = [
  "rd_review_model_completed_false",
  "rd_acceptance_model_passed_false",
  "rd_certification_boundary_validated_false"
];

for (const item of requiredBoundaryEntries) {
  if (!Array.isArray(d.no_execution_boundary) || !d.no_execution_boundary.includes(item)) {
    fail(`NO_EXECUTION_BOUNDARY_ENTRY_MISSING ${item}`);
  }
}

const falseClaimCount = Object.keys(d).filter((key) => d[key] === false).length;
if (falseClaimCount !== 214) {
  fail(`FALSE_CLAIM_COUNT_MISMATCH expected=214 actual=${falseClaimCount}`);
}

console.log(JSON.stringify({
  marker: d.marker,
  object_id: d.object_id,
  basis_marker: d.basis_marker,
  source_chain_entry_count: d.source_chain_entry_count,
  required_rd_master_three_level_governance_conformance_field_count: d.required_rd_master_three_level_governance_conformance_field_count,
  binding_rule_count: d.binding_rule_count,
  future_resolution_requirement_count: d.future_resolution_requirement_count,
  required_non_claim_count: d.required_non_claim_count,
  required_no_execution_boundary_count: d.required_no_execution_boundary_count,
  rd_master_three_level_governance_created: d.rd_master_three_level_governance_created,
  rd_master_three_level_governance_validated: d.rd_master_three_level_governance_validated,
  rd_master_finalized: d.rd_master_finalized,
  three_level_governance_finalized: d.three_level_governance_finalized,
  level_1_governance_validated: d.level_1_governance_validated,
  level_2_governance_validated: d.level_2_governance_validated,
  level_3_governance_validated: d.level_3_governance_validated,
  governance_layer_validated: d.governance_layer_validated,
  evidence_layer_validated: d.evidence_layer_validated,
  runtime_layer_validated: d.runtime_layer_validated,
  matrix_layer_validated: d.matrix_layer_validated,
  responsibility_chain_validated: d.responsibility_chain_validated,
  control_chain_validated: d.control_chain_validated,
  verification_chain_validated: d.verification_chain_validated,
  review_model_completed: d.review_model_completed,
  rd_review_model_completed: d.rd_review_model_completed,
  acceptance_model_passed: d.acceptance_model_passed,
  rd_acceptance_model_passed: d.rd_acceptance_model_passed,
  certification_boundary_validated: d.certification_boundary_validated,
  rd_certification_boundary_validated: d.rd_certification_boundary_validated,
  governance_review_completed: d.governance_review_completed,
  rd_acceptance_passed: d.rd_acceptance_passed,
  rd_master_three_level_governance_success: d.rd_master_three_level_governance_success,
  legal_certification_created: d.legal_certification_created,
  false_claim_property_count: falseClaimCount,
  result: ok ? "PASS_RD_MASTER_THREE_LEVEL_GOVERNANCE_CONFORMANCE_BINDING_DRAFT" : "FAIL_RD_MASTER_THREE_LEVEL_GOVERNANCE_CONFORMANCE_BINDING_DRAFT"
}, null, 2));

if (ok) {
  console.log("RD_MASTER_THREE_LEVEL_GOVERNANCE_CONFORMANCE_BINDING_DRAFT=PASS");
  console.log("PROG_306_RD_MASTER_THREE_LEVEL_GOVERNANCE_CONFORMANCE_BINDING_DRAFT_TEST=PASS");
} else {
  process.exitCode = 1;
}
