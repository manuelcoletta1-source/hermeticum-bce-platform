#!/usr/bin/env node

const fs = require("fs");

const file = "evidence/authorization/20261005_HBCE_EVIDENCE_PROVENANCE_CUSTODY_BINDING_DRAFT_v001.json";

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
  object_id: "HBCE-EVIDENCE-PROVENANCE-CUSTODY-BINDING-DRAFT-V001",
  artifact_type: "HBCEEvidenceProvenanceCustodyBindingDraft",
  classification: "R_AND_D_EVIDENCE_PROVENANCE_CUSTODY_BINDING_DRAFT_ONLY",
  status: "ACTIVE_EVIDENCE_PROVENANCE_CUSTODY_BINDING_DRAFT",
  binding_scope: "EVIDENCE_PROVENANCE_CUSTODY_BINDING",
  binding_mode: "RECORD_ONLY_NOT_EXECUTABLE",
  state: "NOT_IMPLEMENTED_NOT_EXECUTABLE_NOT_BOUND_TO_RUNTIME",
  marker: "EVIDENCE_PROVENANCE_CUSTODY_BINDING_DRAFT=PASS",
  basis_marker: "HBCE_CONSEQUENCE_TARGET_OUTCOME_BINDING_DRAFT_FINAL_AUDIT=1",
  basis_main_commit: "7b3dc562dcd92dc4378a79d19eec2800e08990d9",
  recommended_next_program: "PROG-298",
  recommended_next_object_id: "HBCE-INDEPENDENT-RECONSTRUCTION-QUALIFIED-VERIFICATION-BINDING-DRAFT-V001",
  result: "PASS_EVIDENCE_PROVENANCE_CUSTODY_BINDING_DRAFT"
};

for (const [key, expected] of Object.entries(exact)) {
  if (d[key] !== expected) {
    fail(`MISMATCH ${key}: expected=${expected} actual=${d[key]}`);
  }
}

const counts = {
  source_chain_entry_count: 15,
  required_evidence_provenance_custody_field_count: 22,
  binding_rule_count: 18,
  future_resolution_requirement_count: 20,
  required_non_claim_count: 53,
  required_no_execution_boundary_count: 53
};

for (const [key, expected] of Object.entries(counts)) {
  if (d[key] !== expected) {
    fail(`COUNT_MISMATCH ${key}: expected=${expected} actual=${d[key]}`);
  }
}

const arrays = {
  basis: 9,
  required_evidence_provenance_custody_fields: 22,
  binding_rules: 18,
  future_resolution_requirements: 20,
  explicit_non_claims: 53,
  no_execution_boundary: 53
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
  "production_authorization_service_created",
  "onboarding_created",
  "identity_verified",
  "certificate_issued",
  "legal_certification_created"
];

for (const key of expectedFalse) {
  if (d[key] !== false) {
    fail(`BOUNDARY_MISMATCH ${key}: expected=false actual=${d[key]}`);
  }
}

console.log(JSON.stringify({
  marker: d.marker,
  object_id: d.object_id,
  basis_marker: d.basis_marker,
  source_chain_entry_count: d.source_chain_entry_count,
  required_evidence_provenance_custody_field_count: d.required_evidence_provenance_custody_field_count,
  binding_rule_count: d.binding_rule_count,
  future_resolution_requirement_count: d.future_resolution_requirement_count,
  required_non_claim_count: d.required_non_claim_count,
  required_no_execution_boundary_count: d.required_no_execution_boundary_count,
  evidence_record_created: d.evidence_record_created,
  evidence_record_validated: d.evidence_record_validated,
  provenance_record_created: d.provenance_record_created,
  provenance_record_validated: d.provenance_record_validated,
  custody_record_created: d.custody_record_created,
  custody_record_validated: d.custody_record_validated,
  chain_of_custody_complete: d.chain_of_custody_complete,
  evidence_integrity_validated: d.evidence_integrity_validated,
  evidence_admissibility_asserted: d.evidence_admissibility_asserted,
  legal_certification_created: d.legal_certification_created,
  result: ok ? "PASS_EVIDENCE_PROVENANCE_CUSTODY_BINDING_DRAFT" : "FAIL_EVIDENCE_PROVENANCE_CUSTODY_BINDING_DRAFT"
}, null, 2));

if (ok) {
  console.log("EVIDENCE_PROVENANCE_CUSTODY_BINDING_DRAFT=PASS");
  console.log("PROG_297_EVIDENCE_PROVENANCE_CUSTODY_BINDING_DRAFT_TEST=PASS");
} else {
  process.exitCode = 1;
}
