#!/usr/bin/env node

const fs = require("fs");

const file = "evidence/authorization/20261005_HBCE_IPR_DOCUMENTO_INQUADRAMENTO_TECNICO_IMPRENDITORIALE_CONFORMANCE_BINDING_DRAFT_v001.json";

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
  object_id: "HBCE-IPR-DOCUMENTO-INQUADRAMENTO-TECNICO-IMPRENDITORIALE-CONFORMANCE-BINDING-DRAFT-V001",
  artifact_type: "HBCEIPRDocumentoInquadramentoTecnicoImprenditorialeConformanceBindingDraft",
  classification: "R_AND_D_IPR_DOCUMENTO_INQUADRAMENTO_TECNICO_IMPRENDITORIALE_CONFORMANCE_BINDING_DRAFT_ONLY",
  status: "ACTIVE_IPR_DOCUMENTO_INQUADRAMENTO_TECNICO_IMPRENDITORIALE_CONFORMANCE_BINDING_DRAFT",
  binding_scope: "IPR_DOCUMENTO_INQUADRAMENTO_TECNICO_IMPRENDITORIALE_CONFORMANCE_BINDING",
  binding_mode: "RECORD_ONLY_NOT_EXECUTABLE",
  state: "NOT_IMPLEMENTED_NOT_EXECUTABLE_NOT_BOUND_TO_RUNTIME",
  marker: "IPR_DOCUMENTO_INQUADRAMENTO_TECNICO_IMPRENDITORIALE_CONFORMANCE_BINDING_DRAFT=PASS",
  basis_marker: "HBCE_B2B_LEVEL1_JOKER_C2_LAYER_MATRIX_CONFORMANCE_BINDING_DRAFT_FINAL_AUDIT=1",
  basis_main_commit: "6bc420bb1a1ea9cb3cefbd8b757f9ab581ec351e",
  recommended_next_program: "PROG-311",
  recommended_next_object_id: "HBCE-IPR-ONBOARDING-APP-CONFORMANCE-BINDING-DRAFT-V001",
  result: "PASS_IPR_DOCUMENTO_INQUADRAMENTO_TECNICO_IMPRENDITORIALE_CONFORMANCE_BINDING_DRAFT"
};

for (const [key, expected] of Object.entries(exact)) {
  if (d[key] !== expected) {
    fail(`MISMATCH ${key}: expected=${expected} actual=${d[key]}`);
  }
}

const counts = {
  source_chain_entry_count: 28,
  required_ipr_documento_inquadramento_tecnico_imprenditoriale_conformance_field_count: 61,
  binding_rule_count: 61,
  future_resolution_requirement_count: 55,
  required_non_claim_count: 362,
  required_no_execution_boundary_count: 362
};

for (const [key, expected] of Object.entries(counts)) {
  if (d[key] !== expected) {
    fail(`COUNT_MISMATCH ${key}: expected=${expected} actual=${d[key]}`);
  }
}

const arrays = {
  basis: 22,
  required_ipr_documento_inquadramento_tecnico_imprenditoriale_conformance_fields: 61,
  binding_rules: 61,
  future_resolution_requirements: 55,
  explicit_non_claims: 362,
  no_execution_boundary: 362
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
  "HBCE-B2B-LEVEL1-JOKER-C2-LAYER-MATRIX-CONFORMANCE-BINDING-DRAFT-V001",
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
  "ipr_documento_inquadramento_tecnico_imprenditoriale_conformance_id",
  "ipr_documento_inquadramento_tecnico_imprenditoriale_conformance_version",
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
  "b2b_level1_joker_c2_layer_matrix_conformance_ref",
  "ipr_document_ref",
  "technical_framing_ref",
  "entrepreneurial_framing_ref",
  "corporate_framing_ref",
  "rd_framing_ref",
  "ip_asset_boundary_ref",
  "ipr_identity_boundary_ref",
  "ipr_role_boundary_ref",
  "ipr_chain_boundary_ref",
  "ipr_claim_register_ref",
  "ipr_non_claim_register_ref",
  "technical_scope_ref",
  "business_scope_ref",
  "market_scope_ref",
  "customer_scope_ref",
  "governance_scope_ref",
  "legal_boundary_ref",
  "certification_boundary_ref",
  "evidence_boundary_ref",
  "runtime_boundary_ref",
  "product_boundary_ref",
  "financial_boundary_ref",
  "valuation_boundary_ref",
  "fundraising_boundary_ref",
  "partnership_boundary_ref",
  "public_communication_boundary_ref",
  "investor_communication_boundary_ref",
  "regulatory_communication_boundary_ref",
  "risk_register_ref",
  "dependency_register_ref",
  "review_register_ref",
  "approval_register_ref",
  "publication_register_ref",
  "versioning_register_ref",
  "hash_register_ref",
  "source_document_boundary_statement",
  "ipr_documento_inquadramento_tecnico_imprenditoriale_boundary_statement"
];

for (const item of requiredFields) {
  if (!Array.isArray(d.required_ipr_documento_inquadramento_tecnico_imprenditoriale_conformance_fields) || !d.required_ipr_documento_inquadramento_tecnico_imprenditoriale_conformance_fields.includes(item)) {
    fail(`REQUIRED_FIELD_MISSING ${item}`);
  }
}

const iprFalseClaims = [
  "ipr_documento_inquadramento_tecnico_imprenditoriale_created",
  "ipr_documento_inquadramento_tecnico_imprenditoriale_validated",
  "ipr_document_finalized",
  "ipr_document_technical_framing_validated",
  "ipr_document_entrepreneurial_framing_validated",
  "ipr_document_corporate_framing_validated",
  "ipr_document_rd_framing_validated",
  "ip_asset_validated",
  "ipr_identity_validated",
  "ipr_role_validated",
  "ipr_chain_validated",
  "ipr_claim_register_validated",
  "ipr_non_claim_register_validated",
  "technical_scope_validated",
  "business_scope_validated",
  "market_scope_validated",
  "customer_scope_validated",
  "governance_scope_validated",
  "legal_boundary_validated",
  "certification_boundary_validated",
  "evidence_boundary_validated",
  "runtime_boundary_validated",
  "product_boundary_validated",
  "financial_boundary_validated",
  "valuation_boundary_validated",
  "fundraising_boundary_validated",
  "partnership_boundary_validated",
  "public_communication_boundary_validated",
  "investor_communication_boundary_validated",
  "regulatory_communication_boundary_validated",
  "company_created",
  "legal_entity_active",
  "ipr_legal_validity",
  "patent_filing_completed",
  "trademark_filing_completed",
  "customer_commitment",
  "revenue",
  "funding_secured",
  "market_ready",
  "product_ready",
  "investor_ready",
  "partnership_ready",
  "ipr_specific_legal_boundary_validated",
  "ipr_specific_certification_boundary_validated",
  "ipr_specific_evidence_boundary_validated",
  "ipr_specific_runtime_boundary_validated",
  "ipr_specific_product_boundary_validated"
];

for (const key of iprFalseClaims) {
  if (d[key] !== false) {
    fail(`IPR_BOUNDARY_MISMATCH ${key}: expected=false actual=${d[key]}`);
  }
}

const inheritedCriticalFalseClaims = [
  "b2b_level1_success",
  "b2b_level1_customer_ready",
  "b2b_level1_production_ready",
  "b2b_level1_finalized",
  "b2b_level1_acceptance_gate_passed",
  "b2g_level2_success",
  "b2g_level2_finalized",
  "b2g_level2_production_ready",
  "verifier_qualification_validated",
  "forensic_evidence_package_validated",
  "evidence_admissibility_validated",
  "l3_evr_iospace_success",
  "rd_master_three_level_governance_success",
  "corporate_legal_technical_master_success",
  "matrix_operating_programming_master_success",
  "internal_pilot_ready",
  "product_ready_for_market",
  "golden_flow_success",
  "matrix_state_success",
  "qualified_verification_success",
  "access_granted",
  "execution_completed",
  "legal_certification_created"
];

for (const key of inheritedCriticalFalseClaims) {
  if (d[key] !== false) {
    fail(`INHERITED_BOUNDARY_MISMATCH ${key}: expected=false actual=${d[key]}`);
  }
}

const requiredNonClaimEntries = [
  "no_ipr_documento_inquadramento_tecnico_imprenditoriale_created_claim",
  "no_ipr_documento_inquadramento_tecnico_imprenditoriale_validated_claim",
  "no_ipr_document_finalized_claim",
  "no_ip_asset_validated_claim",
  "no_ipr_identity_validated_claim",
  "no_ipr_legal_validity_claim",
  "no_patent_filing_completed_claim",
  "no_trademark_filing_completed_claim",
  "no_customer_commitment_claim",
  "no_revenue_claim",
  "no_funding_secured_claim",
  "no_market_ready_claim",
  "no_product_ready_claim",
  "no_investor_ready_claim",
  "no_partnership_ready_claim"
];

for (const item of requiredNonClaimEntries) {
  if (!Array.isArray(d.explicit_non_claims) || !d.explicit_non_claims.includes(item)) {
    fail(`NON_CLAIM_ENTRY_MISSING ${item}`);
  }
}

const requiredBoundaryEntries = [
  "ipr_documento_inquadramento_tecnico_imprenditoriale_created_false",
  "ipr_documento_inquadramento_tecnico_imprenditoriale_validated_false",
  "ipr_document_finalized_false",
  "ip_asset_validated_false",
  "ipr_identity_validated_false",
  "ipr_legal_validity_false",
  "patent_filing_completed_false",
  "trademark_filing_completed_false",
  "customer_commitment_false",
  "revenue_false",
  "funding_secured_false",
  "market_ready_false",
  "product_ready_false",
  "investor_ready_false",
  "partnership_ready_false"
];

for (const item of requiredBoundaryEntries) {
  if (!Array.isArray(d.no_execution_boundary) || !d.no_execution_boundary.includes(item)) {
    fail(`NO_EXECUTION_BOUNDARY_ENTRY_MISSING ${item}`);
  }
}

const falseClaimCount = Object.keys(d).filter((key) => d[key] === false).length;
if (falseClaimCount !== 362) {
  fail(`FALSE_CLAIM_COUNT_MISMATCH expected=362 actual=${falseClaimCount}`);
}

console.log(JSON.stringify({
  marker: d.marker,
  object_id: d.object_id,
  basis_marker: d.basis_marker,
  source_chain_entry_count: d.source_chain_entry_count,
  required_ipr_documento_inquadramento_tecnico_imprenditoriale_conformance_field_count: d.required_ipr_documento_inquadramento_tecnico_imprenditoriale_conformance_field_count,
  binding_rule_count: d.binding_rule_count,
  future_resolution_requirement_count: d.future_resolution_requirement_count,
  required_non_claim_count: d.required_non_claim_count,
  required_no_execution_boundary_count: d.required_no_execution_boundary_count,
  ipr_documento_inquadramento_tecnico_imprenditoriale_created: d.ipr_documento_inquadramento_tecnico_imprenditoriale_created,
  ipr_documento_inquadramento_tecnico_imprenditoriale_validated: d.ipr_documento_inquadramento_tecnico_imprenditoriale_validated,
  ipr_document_finalized: d.ipr_document_finalized,
  ip_asset_validated: d.ip_asset_validated,
  ipr_identity_validated: d.ipr_identity_validated,
  ipr_legal_validity: d.ipr_legal_validity,
  company_created: d.company_created,
  legal_entity_active: d.legal_entity_active,
  patent_filing_completed: d.patent_filing_completed,
  trademark_filing_completed: d.trademark_filing_completed,
  customer_commitment: d.customer_commitment,
  revenue: d.revenue,
  funding_secured: d.funding_secured,
  market_ready: d.market_ready,
  product_ready: d.product_ready,
  investor_ready: d.investor_ready,
  partnership_ready: d.partnership_ready,
  ipr_specific_legal_boundary_validated: d.ipr_specific_legal_boundary_validated,
  ipr_specific_certification_boundary_validated: d.ipr_specific_certification_boundary_validated,
  ipr_specific_evidence_boundary_validated: d.ipr_specific_evidence_boundary_validated,
  ipr_specific_runtime_boundary_validated: d.ipr_specific_runtime_boundary_validated,
  ipr_specific_product_boundary_validated: d.ipr_specific_product_boundary_validated,
  b2b_level1_success: d.b2b_level1_success,
  product_ready_for_market: d.product_ready_for_market,
  legal_certification_created: d.legal_certification_created,
  false_claim_property_count: falseClaimCount,
  result: ok ? "PASS_IPR_DOCUMENTO_INQUADRAMENTO_TECNICO_IMPRENDITORIALE_CONFORMANCE_BINDING_DRAFT" : "FAIL_IPR_DOCUMENTO_INQUADRAMENTO_TECNICO_IMPRENDITORIALE_CONFORMANCE_BINDING_DRAFT"
}, null, 2));

if (ok) {
  console.log("IPR_DOCUMENTO_INQUADRAMENTO_TECNICO_IMPRENDITORIALE_CONFORMANCE_BINDING_DRAFT=PASS");
  console.log("PROG_310_IPR_DOCUMENTO_INQUADRAMENTO_TECNICO_IMPRENDITORIALE_CONFORMANCE_BINDING_DRAFT_TEST=PASS");
} else {
  process.exitCode = 1;
}
