#!/usr/bin/env node

const fs = require("fs");

const file = "evidence/authorization/20261005_HBCE_POINT_OF_USE_AUTHORIZATION_BINDING_DRAFT_v001.json";

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
  object_id: "HBCE-POINT-OF-USE-AUTHORIZATION-BINDING-DRAFT-V001",
  artifact_type: "HBCEPointOfUseAuthorizationBindingDraft",
  classification: "R_AND_D_POINT_OF_USE_AUTHORIZATION_BINDING_DRAFT_ONLY",
  status: "ACTIVE_POINT_OF_USE_AUTHORIZATION_BINDING_DRAFT",
  binding_scope: "POINT_OF_USE_AUTHORIZATION_BINDING",
  binding_mode: "RECORD_ONLY_NOT_EXECUTABLE",
  state: "NOT_IMPLEMENTED_NOT_EXECUTABLE_NOT_BOUND_TO_RUNTIME",
  marker: "POINT_OF_USE_AUTHORIZATION_BINDING_DRAFT=PASS",
  basis_marker: "HBCE_AUTHORIZATION_SCOPE_BINDING_DRAFT_FINAL_AUDIT=1",
  basis_main_commit: "d43387fed84c9f6a0d7ca077b5e9cea636ac7701",
  recommended_next_program: "PROG-293",
  recommended_next_object_id: "HBCE-DECISION-APPROVAL-OVERRIDE-BINDING-DRAFT-V001",
  result: "PASS_POINT_OF_USE_AUTHORIZATION_BINDING_DRAFT"
};

for (const [key, expected] of Object.entries(exact)) {
  if (d[key] !== expected) {
    fail(`MISMATCH ${key}: expected=${expected} actual=${d[key]}`);
  }
}

const counts = {
  source_chain_entry_count: 10,
  required_point_of_use_authorization_field_count: 16,
  binding_rule_count: 13,
  future_resolution_requirement_count: 15,
  required_non_claim_count: 24,
  required_no_execution_boundary_count: 24
};

for (const [key, expected] of Object.entries(counts)) {
  if (d[key] !== expected) {
    fail(`COUNT_MISMATCH ${key}: expected=${expected} actual=${d[key]}`);
  }
}

const arrays = {
  basis: 4,
  required_point_of_use_authorization_fields: 16,
  binding_rules: 13,
  future_resolution_requirements: 15,
  explicit_non_claims: 24,
  no_execution_boundary: 24
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
  "authorization_decision_created",
  "request_approved",
  "access_granted",
  "dispatch_authorized",
  "execution_authorized",
  "production_authorization_service_created",
  "onboarding_created",
  "identity_verified",
  "certificate_issued",
  "target_receipt_created",
  "effect_evidence_created",
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
  required_point_of_use_authorization_field_count: d.required_point_of_use_authorization_field_count,
  binding_rule_count: d.binding_rule_count,
  future_resolution_requirement_count: d.future_resolution_requirement_count,
  required_non_claim_count: d.required_non_claim_count,
  required_no_execution_boundary_count: d.required_no_execution_boundary_count,
  runtime_gate_implemented: d.runtime_gate_implemented,
  runtime_gate_enabled: d.runtime_gate_enabled,
  policy_evaluated: d.policy_evaluated,
  scope_approved: d.scope_approved,
  scope_effective: d.scope_effective,
  point_of_use_authorization_evaluated: d.point_of_use_authorization_evaluated,
  point_of_use_authorization_effective: d.point_of_use_authorization_effective,
  authorization_decision_created: d.authorization_decision_created,
  request_approved: d.request_approved,
  access_granted: d.access_granted,
  dispatch_authorized: d.dispatch_authorized,
  execution_authorized: d.execution_authorized,
  legal_certification_created: d.legal_certification_created,
  result: ok ? "PASS_POINT_OF_USE_AUTHORIZATION_BINDING_DRAFT" : "FAIL_POINT_OF_USE_AUTHORIZATION_BINDING_DRAFT"
}, null, 2));

if (ok) {
  console.log("POINT_OF_USE_AUTHORIZATION_BINDING_DRAFT=PASS");
  console.log("PROG_292_POINT_OF_USE_AUTHORIZATION_BINDING_DRAFT_TEST=PASS");
} else {
  process.exitCode = 1;
}
