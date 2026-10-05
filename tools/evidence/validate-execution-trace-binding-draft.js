#!/usr/bin/env node

const fs = require("fs");

const file = "evidence/authorization/20261005_HBCE_EXECUTION_TRACE_BINDING_DRAFT_v001.json";

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
  object_id: "HBCE-EXECUTION-TRACE-BINDING-DRAFT-V001",
  artifact_type: "HBCEExecutionTraceBindingDraft",
  classification: "R_AND_D_EXECUTION_TRACE_BINDING_DRAFT_ONLY",
  status: "ACTIVE_EXECUTION_TRACE_BINDING_DRAFT",
  binding_scope: "EXECUTION_TRACE_BINDING",
  binding_mode: "RECORD_ONLY_NOT_EXECUTABLE",
  state: "NOT_IMPLEMENTED_NOT_EXECUTABLE_NOT_BOUND_TO_RUNTIME",
  marker: "EXECUTION_TRACE_BINDING_DRAFT=PASS",
  basis_marker: "HBCE_CONTROLLED_DISPATCH_BINDING_DRAFT_FINAL_AUDIT=1",
  basis_main_commit: "84621c255d8a9223d848c5cf5f3479a6b7758439",
  recommended_next_program: "PROG-296",
  recommended_next_object_id: "HBCE-CONSEQUENCE-TARGET-OUTCOME-BINDING-DRAFT-V001",
  result: "PASS_EXECUTION_TRACE_BINDING_DRAFT"
};

for (const [key, expected] of Object.entries(exact)) {
  if (d[key] !== expected) {
    fail(`MISMATCH ${key}: expected=${expected} actual=${d[key]}`);
  }
}

const counts = {
  source_chain_entry_count: 13,
  required_execution_trace_field_count: 19,
  binding_rule_count: 16,
  future_resolution_requirement_count: 18,
  required_non_claim_count: 37,
  required_no_execution_boundary_count: 37
};

for (const [key, expected] of Object.entries(counts)) {
  if (d[key] !== expected) {
    fail(`COUNT_MISMATCH ${key}: expected=${expected} actual=${d[key]}`);
  }
}

const arrays = {
  basis: 7,
  required_execution_trace_fields: 19,
  binding_rules: 16,
  future_resolution_requirements: 18,
  explicit_non_claims: 37,
  no_execution_boundary: 37
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
  required_execution_trace_field_count: d.required_execution_trace_field_count,
  binding_rule_count: d.binding_rule_count,
  future_resolution_requirement_count: d.future_resolution_requirement_count,
  required_non_claim_count: d.required_non_claim_count,
  required_no_execution_boundary_count: d.required_no_execution_boundary_count,
  runtime_gate_implemented: d.runtime_gate_implemented,
  runtime_gate_enabled: d.runtime_gate_enabled,
  dispatch_authorized: d.dispatch_authorized,
  controlled_dispatch_created: d.controlled_dispatch_created,
  controlled_dispatch_sent: d.controlled_dispatch_sent,
  controlled_dispatch_effective: d.controlled_dispatch_effective,
  execution_precondition_evaluated: d.execution_precondition_evaluated,
  execution_authorized: d.execution_authorized,
  execution_trace_created: d.execution_trace_created,
  execution_trace_validated: d.execution_trace_validated,
  execution_started: d.execution_started,
  execution_completed: d.execution_completed,
  target_receipt_created: d.target_receipt_created,
  effect_evidence_created: d.effect_evidence_created,
  legal_certification_created: d.legal_certification_created,
  result: ok ? "PASS_EXECUTION_TRACE_BINDING_DRAFT" : "FAIL_EXECUTION_TRACE_BINDING_DRAFT"
}, null, 2));

if (ok) {
  console.log("EXECUTION_TRACE_BINDING_DRAFT=PASS");
  console.log("PROG_295_EXECUTION_TRACE_BINDING_DRAFT_TEST=PASS");
} else {
  process.exitCode = 1;
}
