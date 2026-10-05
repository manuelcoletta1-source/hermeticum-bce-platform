#!/usr/bin/env node

const fs = require("fs");

const file = "evidence/authorization/20261005_HBCE_CORPORATE_LEGAL_TECHNICAL_MASTER_CONFORMANCE_BINDING_DRAFT_v001.json";

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
  object_id: "HBCE-CORPORATE-LEGAL-TECHNICAL-MASTER-CONFORMANCE-BINDING-DRAFT-V001",
  artifact_type: "HBCECorporateLegalTechnicalMasterConformanceBindingDraft",
  classification: "R_AND_D_CORPORATE_LEGAL_TECHNICAL_MASTER_CONFORMANCE_BINDING_DRAFT_ONLY",
  status: "ACTIVE_CORPORATE_LEGAL_TECHNICAL_MASTER_CONFORMANCE_BINDING_DRAFT",
  binding_scope: "CORPORATE_LEGAL_TECHNICAL_MASTER_CONFORMANCE_BINDING",
  binding_mode: "RECORD_ONLY_NOT_EXECUTABLE",
  state: "NOT_IMPLEMENTED_NOT_EXECUTABLE_NOT_BOUND_TO_RUNTIME",
  marker: "CORPORATE_LEGAL_TECHNICAL_MASTER_CONFORMANCE_BINDING_DRAFT=PASS",
  basis_marker: "HBCE_MATRIX_OPERATING_PROGRAMMING_MASTER_CONFORMANCE_BINDING_DRAFT_FINAL_AUDIT=1",
  basis_main_commit: "e398214f445a83ef85d7943ae6c657ea3375414a",
  recommended_next_program: "PROG-306",
  recommended_next_object_id: "HBCE-RD-MASTER-THREE-LEVEL-GOVERNANCE-CONFORMANCE-BINDING-DRAFT-V001",
  result: "PASS_CORPORATE_LEGAL_TECHNICAL_MASTER_CONFORMANCE_BINDING_DRAFT"
};

for (const [key, expected] of Object.entries(exact)) {
  if (d[key] !== expected) {
    fail(`MISMATCH ${key}: expected=${expected} actual=${d[key]}`);
  }
}

const counts = {
  source_chain_entry_count: 23,
  required_corporate_legal_technical_master_conformance_field_count: 44,
  binding_rule_count: 44,
  future_resolution_requirement_count: 40,
  required_non_claim_count: 184,
  required_no_execution_boundary_count: 184
};

for (const [key, expected] of Object.entries(counts)) {
  if (d[key] !== expected) {
    fail(`COUNT_MISMATCH ${key}: expected=${expected} actual=${d[key]}`);
  }
}

const arrays = {
  basis: 17,
  required_corporate_legal_technical_master_conformance_fields: 44,
  binding_rules: 44,
  future_resolution_requirements: 40,
  explicit_non_claims: 184,
  no_execution_boundary: 184
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

const corporateFalseClaims = [
  "corporate_legal_technical_master_created",
  "corporate_legal_technical_master_validated",
  "corporate_master_finalized",
  "legal_master_finalized",
  "technical_master_finalized",
  "governance_model_validated",
  "responsibility_model_validated",
  "authority_model_validated",
  "contract_model_validated",
  "compliance_model_validated",
  "risk_model_validated",
  "privacy_model_validated",
  "security_model_validated",
  "audit_model_validated",
  "evidence_model_validated",
  "certification_boundary_validated",
  "legal_boundary_validated",
  "technical_boundary_validated",
  "corporate_boundary_validated",
  "decision_register_validated",
  "non_claim_register_validated",
  "legal_review_completed",
  "technical_review_completed",
  "corporate_acceptance_passed",
  "corporate_legal_technical_master_ready",
  "corporate_legal_technical_master_success"
];

for (const key of corporateFalseClaims) {
  if (d[key] !== false) {
    fail(`CORPORATE_BOUNDARY_MISMATCH ${key}: expected=false actual=${d[key]}`);
  }
}

const inheritedCriticalFalseClaims = [
  "matrix_operating_programming_master_success",
  "matrix_operating_programming_master_ready",
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
if (falseClaimCount !== 184) {
  fail(`FALSE_CLAIM_COUNT_MISMATCH expected=184 actual=${falseClaimCount}`);
}

console.log(JSON.stringify({
  marker: d.marker,
  object_id: d.object_id,
  basis_marker: d.basis_marker,
  source_chain_entry_count: d.source_chain_entry_count,
  required_corporate_legal_technical_master_conformance_field_count: d.required_corporate_legal_technical_master_conformance_field_count,
  binding_rule_count: d.binding_rule_count,
  future_resolution_requirement_count: d.future_resolution_requirement_count,
  required_non_claim_count: d.required_non_claim_count,
  required_no_execution_boundary_count: d.required_no_execution_boundary_count,
  corporate_legal_technical_master_created: d.corporate_legal_technical_master_created,
  corporate_legal_technical_master_validated: d.corporate_legal_technical_master_validated,
  corporate_master_finalized: d.corporate_master_finalized,
  legal_master_finalized: d.legal_master_finalized,
  technical_master_finalized: d.technical_master_finalized,
  governance_model_validated: d.governance_model_validated,
  responsibility_model_validated: d.responsibility_model_validated,
  authority_model_validated: d.authority_model_validated,
  contract_model_validated: d.contract_model_validated,
  compliance_model_validated: d.compliance_model_validated,
  risk_model_validated: d.risk_model_validated,
  privacy_model_validated: d.privacy_model_validated,
  security_model_validated: d.security_model_validated,
  audit_model_validated: d.audit_model_validated,
  evidence_model_validated: d.evidence_model_validated,
  certification_boundary_validated: d.certification_boundary_validated,
  legal_review_completed: d.legal_review_completed,
  technical_review_completed: d.technical_review_completed,
  corporate_acceptance_passed: d.corporate_acceptance_passed,
  corporate_legal_technical_master_ready: d.corporate_legal_technical_master_ready,
  corporate_legal_technical_master_success: d.corporate_legal_technical_master_success,
  legal_certification_created: d.legal_certification_created,
  false_claim_property_count: falseClaimCount,
  result: ok ? "PASS_CORPORATE_LEGAL_TECHNICAL_MASTER_CONFORMANCE_BINDING_DRAFT" : "FAIL_CORPORATE_LEGAL_TECHNICAL_MASTER_CONFORMANCE_BINDING_DRAFT"
}, null, 2));

if (ok) {
  console.log("CORPORATE_LEGAL_TECHNICAL_MASTER_CONFORMANCE_BINDING_DRAFT=PASS");
  console.log("PROG_305_CORPORATE_LEGAL_TECHNICAL_MASTER_CONFORMANCE_BINDING_DRAFT_TEST=PASS");
} else {
  process.exitCode = 1;
}
