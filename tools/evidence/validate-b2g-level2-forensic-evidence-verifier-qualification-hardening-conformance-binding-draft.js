#!/usr/bin/env node

const fs = require("fs");

const file = "evidence/authorization/20261005_HBCE_B2G_LEVEL2_FORENSIC_EVIDENCE_VERIFIER_QUALIFICATION_HARDENING_CONFORMANCE_BINDING_DRAFT_v001.json";

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
  object_id: "HBCE-B2G-LEVEL2-FORENSIC-EVIDENCE-VERIFIER-QUALIFICATION-HARDENING-CONFORMANCE-BINDING-DRAFT-V001",
  artifact_type: "HBCEB2GLevel2ForensicEvidenceVerifierQualificationHardeningConformanceBindingDraft",
  classification: "R_AND_D_B2G_LEVEL2_FORENSIC_EVIDENCE_VERIFIER_QUALIFICATION_HARDENING_CONFORMANCE_BINDING_DRAFT_ONLY",
  status: "ACTIVE_B2G_LEVEL2_FORENSIC_EVIDENCE_VERIFIER_QUALIFICATION_HARDENING_CONFORMANCE_BINDING_DRAFT",
  binding_scope: "B2G_LEVEL2_FORENSIC_EVIDENCE_VERIFIER_QUALIFICATION_HARDENING_CONFORMANCE_BINDING",
  binding_mode: "RECORD_ONLY_NOT_EXECUTABLE",
  state: "NOT_IMPLEMENTED_NOT_EXECUTABLE_NOT_BOUND_TO_RUNTIME",
  marker: "B2G_LEVEL2_FORENSIC_EVIDENCE_VERIFIER_QUALIFICATION_HARDENING_CONFORMANCE_BINDING_DRAFT=PASS",
  basis_marker: "HBCE_L3_EVR_IOSPACE_EXECUTION_BOUNDARY_REFACTOR_CONFORMANCE_BINDING_DRAFT_FINAL_AUDIT=1",
  basis_main_commit: "01328cc177a9e23a84df8f07e40d1d2197db3561",
  recommended_next_program: "PROG-309",
  recommended_next_object_id: "HBCE-B2B-LEVEL1-JOKER-C2-LAYER-MATRIX-CONFORMANCE-BINDING-DRAFT-V001",
  result: "PASS_B2G_LEVEL2_FORENSIC_EVIDENCE_VERIFIER_QUALIFICATION_HARDENING_CONFORMANCE_BINDING_DRAFT"
};

for (const [key, expected] of Object.entries(exact)) {
  if (d[key] !== expected) {
    fail(`MISMATCH ${key}: expected=${expected} actual=${d[key]}`);
  }
}

const counts = {
  source_chain_entry_count: 26,
  required_b2g_level2_forensic_evidence_verifier_qualification_hardening_conformance_field_count: 56,
  binding_rule_count: 56,
  future_resolution_requirement_count: 50,
  required_non_claim_count: 284,
  required_no_execution_boundary_count: 284
};

for (const [key, expected] of Object.entries(counts)) {
  if (d[key] !== expected) {
    fail(`COUNT_MISMATCH ${key}: expected=${expected} actual=${d[key]}`);
  }
}

const arrays = {
  basis: 20,
  required_b2g_level2_forensic_evidence_verifier_qualification_hardening_conformance_fields: 56,
  binding_rules: 56,
  future_resolution_requirements: 50,
  explicit_non_claims: 284,
  no_execution_boundary: 284
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

if (!Array.isArray(d.basis)) {
  fail("BASIS_ARRAY_MISSING basis");
} else {
  for (const item of requiredBasis) {
    if (!d.basis.includes(item)) {
      fail(`BASIS_MISSING ${item}`);
    }
  }
}

const b2gFalseClaims = [
  "b2g_level2_forensic_evidence_verifier_qualification_hardening_created",
  "b2g_level2_forensic_evidence_verifier_qualification_hardening_validated",
  "b2g_level2_finalized",
  "b2g_governance_validated",
  "level2_governance_validated",
  "forensic_evidence_package_created",
  "forensic_evidence_package_validated",
  "evidence_admissibility_validated",
  "evidence_integrity_validated",
  "custody_independence_validated",
  "verifier_identity_validated",
  "verifier_qualification_validated",
  "verifier_competence_validated",
  "verifier_independence_validated",
  "verifier_conflict_of_interest_cleared",
  "qualified_verification_protocol_validated",
  "reconstruction_protocol_validated",
  "tamper_evidence_protocol_validated",
  "audit_trail_protocol_validated",
  "public_administration_context_validated",
  "public_procurement_context_validated",
  "regulated_workflow_context_validated",
  "legal_review_boundary_validated",
  "technical_review_boundary_validated",
  "governance_review_boundary_validated",
  "b2g_acceptance_gate_passed",
  "evidence_dispute_resolved",
  "escalation_model_validated",
  "revocation_model_validated",
  "retention_model_validated",
  "publication_completed",
  "implementation_boundary_validated",
  "b2g_certification_boundary_validated",
  "b2g_level2_ready",
  "b2g_level2_success",
  "b2g_level2_production_ready",
  "b2g_specific_governance_validated",
  "b2g_specific_level2_governance_validated",
  "b2g_specific_escalation_model_validated",
  "b2g_specific_publication_completed",
  "b2g_specific_implementation_boundary_validated"
];

for (const key of b2gFalseClaims) {
  if (d[key] !== false) {
    fail(`B2G_BOUNDARY_MISMATCH ${key}: expected=false actual=${d[key]}`);
  }
}

const inheritedCriticalFalseClaims = [
  "l3_evr_iospace_success",
  "l3_evr_finalized",
  "iospace_execution_boundary_validated",
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
  "no_b2g_level2_forensic_evidence_verifier_qualification_hardening_created_claim",
  "no_b2g_level2_forensic_evidence_verifier_qualification_hardening_validated_claim",
  "no_b2g_level2_finalized_claim",
  "no_forensic_evidence_package_validated_claim",
  "no_evidence_admissibility_validated_claim",
  "no_verifier_qualification_validated_claim",
  "no_verifier_independence_validated_claim",
  "no_qualified_verification_protocol_validated_claim",
  "no_b2g_acceptance_gate_passed_claim",
  "no_b2g_certification_boundary_validated_claim",
  "no_b2g_level2_success_claim",
  "no_b2g_level2_production_ready_claim"
];

for (const item of requiredNonClaimEntries) {
  if (!Array.isArray(d.explicit_non_claims) || !d.explicit_non_claims.includes(item)) {
    fail(`NON_CLAIM_ENTRY_MISSING ${item}`);
  }
}

const requiredBoundaryEntries = [
  "b2g_level2_forensic_evidence_verifier_qualification_hardening_created_false",
  "b2g_level2_forensic_evidence_verifier_qualification_hardening_validated_false",
  "b2g_level2_finalized_false",
  "forensic_evidence_package_validated_false",
  "evidence_admissibility_validated_false",
  "verifier_qualification_validated_false",
  "verifier_independence_validated_false",
  "qualified_verification_protocol_validated_false",
  "b2g_acceptance_gate_passed_false",
  "b2g_certification_boundary_validated_false",
  "b2g_level2_success_false",
  "b2g_level2_production_ready_false"
];

for (const item of requiredBoundaryEntries) {
  if (!Array.isArray(d.no_execution_boundary) || !d.no_execution_boundary.includes(item)) {
    fail(`NO_EXECUTION_BOUNDARY_ENTRY_MISSING ${item}`);
  }
}

const falseClaimCount = Object.keys(d).filter((key) => d[key] === false).length;
if (falseClaimCount !== 284) {
  fail(`FALSE_CLAIM_COUNT_MISMATCH expected=284 actual=${falseClaimCount}`);
}

console.log(JSON.stringify({
  marker: d.marker,
  object_id: d.object_id,
  basis_marker: d.basis_marker,
  source_chain_entry_count: d.source_chain_entry_count,
  required_b2g_level2_forensic_evidence_verifier_qualification_hardening_conformance_field_count: d.required_b2g_level2_forensic_evidence_verifier_qualification_hardening_conformance_field_count,
  binding_rule_count: d.binding_rule_count,
  future_resolution_requirement_count: d.future_resolution_requirement_count,
  required_non_claim_count: d.required_non_claim_count,
  required_no_execution_boundary_count: d.required_no_execution_boundary_count,
  b2g_level2_forensic_evidence_verifier_qualification_hardening_created: d.b2g_level2_forensic_evidence_verifier_qualification_hardening_created,
  b2g_level2_forensic_evidence_verifier_qualification_hardening_validated: d.b2g_level2_forensic_evidence_verifier_qualification_hardening_validated,
  b2g_level2_finalized: d.b2g_level2_finalized,
  b2g_governance_validated: d.b2g_governance_validated,
  level2_governance_validated: d.level2_governance_validated,
  forensic_evidence_package_created: d.forensic_evidence_package_created,
  forensic_evidence_package_validated: d.forensic_evidence_package_validated,
  evidence_admissibility_validated: d.evidence_admissibility_validated,
  evidence_integrity_validated: d.evidence_integrity_validated,
  custody_independence_validated: d.custody_independence_validated,
  verifier_identity_validated: d.verifier_identity_validated,
  verifier_qualification_validated: d.verifier_qualification_validated,
  verifier_competence_validated: d.verifier_competence_validated,
  verifier_independence_validated: d.verifier_independence_validated,
  verifier_conflict_of_interest_cleared: d.verifier_conflict_of_interest_cleared,
  qualified_verification_protocol_validated: d.qualified_verification_protocol_validated,
  b2g_acceptance_gate_passed: d.b2g_acceptance_gate_passed,
  b2g_certification_boundary_validated: d.b2g_certification_boundary_validated,
  b2g_specific_governance_validated: d.b2g_specific_governance_validated,
  b2g_specific_level2_governance_validated: d.b2g_specific_level2_governance_validated,
  b2g_specific_escalation_model_validated: d.b2g_specific_escalation_model_validated,
  b2g_specific_publication_completed: d.b2g_specific_publication_completed,
  b2g_specific_implementation_boundary_validated: d.b2g_specific_implementation_boundary_validated,
  b2g_level2_ready: d.b2g_level2_ready,
  b2g_level2_success: d.b2g_level2_success,
  b2g_level2_production_ready: d.b2g_level2_production_ready,
  legal_certification_created: d.legal_certification_created,
  false_claim_property_count: falseClaimCount,
  result: ok ? "PASS_B2G_LEVEL2_FORENSIC_EVIDENCE_VERIFIER_QUALIFICATION_HARDENING_CONFORMANCE_BINDING_DRAFT" : "FAIL_B2G_LEVEL2_FORENSIC_EVIDENCE_VERIFIER_QUALIFICATION_HARDENING_CONFORMANCE_BINDING_DRAFT"
}, null, 2));

if (ok) {
  console.log("B2G_LEVEL2_FORENSIC_EVIDENCE_VERIFIER_QUALIFICATION_HARDENING_CONFORMANCE_BINDING_DRAFT=PASS");
  console.log("PROG_308_B2G_LEVEL2_FORENSIC_EVIDENCE_VERIFIER_QUALIFICATION_HARDENING_CONFORMANCE_BINDING_DRAFT_TEST=PASS");
} else {
  process.exitCode = 1;
}
