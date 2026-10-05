#!/usr/bin/env node

const fs = require("fs");

const file = "evidence/authorization/20261005_HBCE_AUTHORIZATION_SCOPE_BINDING_DRAFT_v001.json";

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
  object_id: "HBCE-AUTHORIZATION-SCOPE-BINDING-DRAFT-V001",
  artifact_type: "HBCEAuthorizationScopeBindingDraft",
  classification: "R_AND_D_AUTHORIZATION_SCOPE_BINDING_DRAFT_ONLY",
  status: "ACTIVE_AUTHORIZATION_SCOPE_BINDING_DRAFT",
  binding_scope: "AUTHORIZATION_SCOPE_BINDING",
  binding_mode: "RECORD_ONLY_NOT_EXECUTABLE",
  state: "NOT_IMPLEMENTED_NOT_EXECUTABLE_NOT_BOUND_TO_RUNTIME",
  marker: "AUTHORIZATION_SCOPE_BINDING_DRAFT=PASS",
  basis_marker: "HBCE_POLICY_EVALUATION_BINDING_DRAFT_FINAL_AUDIT=1",
  basis_main_commit: "93215d14aba7ffb6cb9d3a771726beb876da2291",
  recommended_next_program: "PROG-292",
  recommended_next_object_id: "HBCE-POINT-OF-USE-AUTHORIZATION-BINDING-DRAFT-V001",
  result: "PASS_AUTHORIZATION_SCOPE_BINDING_DRAFT"
};

for (const [key, expected] of Object.entries(exact)) {
  if (d[key] !== expected) {
    fail(`MISMATCH ${key}: expected=${expected} actual=${d[key]}`);
  }
}

const counts = {
  source_chain_entry_count: 9,
  required_authorization_scope_field_count: 14,
  binding_rule_count: 12,
  future_resolution_requirement_count: 14,
  required_non_claim_count: 22,
  required_no_execution_boundary_count: 22
};

for (const [key, expected] of Object.entries(counts)) {
  if (d[key] !== expected) {
    fail(`COUNT_MISMATCH ${key}: expected=${expected} actual=${d[key]}`);
  }
}

const arrays = {
  basis: 3,
  required_authorization_scope_fields: 14,
  binding_rules: 12,
  future_resolution_requirements: 14,
  explicit_non_claims: 22,
  no_execution_boundary: 22
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
  required_authorization_scope_field_count: d.required_authorization_scope_field_count,
  binding_rule_count: d.binding_rule_count,
  future_resolution_requirement_count: d.future_resolution_requirement_count,
  required_non_claim_count: d.required_non_claim_count,
  required_no_execution_boundary_count: d.required_no_execution_boundary_count,
  runtime_gate_implemented: d.runtime_gate_implemented,
  runtime_gate_enabled: d.runtime_gate_enabled,
  policy_evaluated: d.policy_evaluated,
  scope_approved: d.scope_approved,
  scope_effective: d.scope_effective,
  authorization_decision_created: d.authorization_decision_created,
  request_approved: d.request_approved,
  access_granted: d.access_granted,
  dispatch_authorized: d.dispatch_authorized,
  execution_authorized: d.execution_authorized,
  legal_certification_created: d.legal_certification_created,
  result: ok ? "PASS_AUTHORIZATION_SCOPE_BINDING_DRAFT" : "FAIL_AUTHORIZATION_SCOPE_BINDING_DRAFT"
}, null, 2));

if (ok) {
  console.log("AUTHORIZATION_SCOPE_BINDING_DRAFT=PASS");
  console.log("PROG_291_AUTHORIZATION_SCOPE_BINDING_DRAFT_TEST=PASS");
} else {
  process.exitCode = 1;
}
