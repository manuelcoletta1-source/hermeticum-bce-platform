#!/usr/bin/env node
"use strict";

const fs = require("fs");

const manifestPath = "evidence/authorization/20261003_HBCE_ACCESS_AUTHORIZATION_PREDICATE_DRAFT_v001.json";
const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));

function fail(message) {
  throw new Error(message);
}

function assertTrue(value, label) {
  if (value !== true) fail(`${label} must be true`);
}

function assertFalse(value, label) {
  if (value !== false) fail(`${label} must be false`);
}

if (manifest.object_id !== "HBCE-ACCESS-AUTHORIZATION-PREDICATE-DRAFT-V001") fail("object_id invalid");
if (manifest.status !== "ACTIVE_ACCESS_AUTHORIZATION_PREDICATE_DRAFT") fail("status invalid");
if (manifest.basis_marker !== "HBCE_EVIDENCE_OBJECT_MIGRATION_MAP_FINAL_AUDIT=1") fail("basis_marker invalid");
if (manifest.basis_main_commit !== "cbcf8b22a21e3f2e6b89d2b6f726f7ed093498e5") fail("basis_main_commit invalid");
if (manifest.expected_cli_marker !== "ACCESS_AUTHORIZATION_PREDICATE_DRAFT=PASS") fail("expected_cli_marker invalid");
if (manifest.result !== "PASS_ACCESS_AUTHORIZATION_PREDICATE_DRAFT_MANIFEST_CREATED") fail("result invalid");

const scope = manifest.predicate_scope;
if (scope.decision_scope !== "ACCESS_AUTHORIZATION") fail("decision_scope invalid");
if (scope.authorization_level !== "ACCESS_ONLY") fail("authorization_level invalid");
if (scope.dispatch_scope !== "EXCLUDED") fail("dispatch_scope invalid");
if (scope.execution_scope !== "EXCLUDED") fail("execution_scope invalid");
if (scope.effect_evidence_scope !== "EXCLUDED") fail("effect_evidence_scope invalid");

const required = manifest.required_inputs;
const expectedRequired = {
  ipr_status: "verified",
  ipr_card_status: "issued",
  certificate_status: "active",
  deny_state_absent: true,
  mandate_present: true,
  mandate_valid: true,
  policy_evaluation_result: "PASS",
  authorization_record_present: true,
  authority_ref_present: true,
  request_binding_present: true,
  decision_scope_explicit: true,
  positive_authorization_contract_present: true
};

for (const [key, value] of Object.entries(expectedRequired)) {
  if (required[key] !== value) fail(`required_inputs.${key} invalid`);
}

const semantics = manifest.predicate_result_semantics;
if (semantics.all_required_inputs_satisfied !== "ACCESS_AUTHORIZATION_PREDICATE_ELIGIBLE") fail("eligible semantic invalid");
if (semantics.any_required_input_failed !== "ACCESS_AUTHORIZATION_PREDICATE_DENY") fail("deny semantic invalid");
if (semantics.any_required_input_unknown !== "ACCESS_AUTHORIZATION_PREDICATE_UNKNOWN_FAIL_CLOSED") fail("unknown semantic invalid");
assertTrue(semantics.eligible_does_not_mean_access_granted, "eligible_does_not_mean_access_granted");
assertTrue(semantics.eligible_does_not_mean_dispatch_authorized, "eligible_does_not_mean_dispatch_authorized");
assertTrue(semantics.eligible_requires_separate_recorded_authorization_decision, "eligible_requires_separate_recorded_authorization_decision");

for (const [key, value] of Object.entries(manifest.explicit_non_claims)) {
  assertTrue(value, `explicit_non_claims.${key}`);
}

for (const [key, value] of Object.entries(manifest.no_execution_boundary)) {
  assertFalse(value, `no_execution_boundary.${key}`);
}

function evaluate(input) {
  for (const key of Object.keys(expectedRequired)) {
    if (!(key in input)) return "ACCESS_AUTHORIZATION_PREDICATE_UNKNOWN_FAIL_CLOSED";
    if (input[key] === "UNKNOWN" || input[key] === null) return "ACCESS_AUTHORIZATION_PREDICATE_UNKNOWN_FAIL_CLOSED";
    if (input[key] !== expectedRequired[key]) return "ACCESS_AUTHORIZATION_PREDICATE_DENY";
  }
  return "ACCESS_AUTHORIZATION_PREDICATE_ELIGIBLE";
}

const eligibleInput = { ...expectedRequired };
const denyInput = { ...expectedRequired, ipr_status: "revoked" };
const unknownInput = { ...expectedRequired, mandate_valid: "UNKNOWN" };

if (evaluate(eligibleInput) !== "ACCESS_AUTHORIZATION_PREDICATE_ELIGIBLE") fail("eligible evaluation failed");
if (evaluate(denyInput) !== "ACCESS_AUTHORIZATION_PREDICATE_DENY") fail("deny evaluation failed");
if (evaluate(unknownInput) !== "ACCESS_AUTHORIZATION_PREDICATE_UNKNOWN_FAIL_CLOSED") fail("unknown evaluation failed");

console.log(JSON.stringify({
  marker: "ACCESS_AUTHORIZATION_PREDICATE_DRAFT=PASS",
  predicate_id: manifest.predicate_id,
  eligible_result: evaluate(eligibleInput),
  deny_result: evaluate(denyInput),
  unknown_result: evaluate(unknownInput),
  access_granted: false,
  dispatch_authorized: false,
  effect_evidence_created: false,
  result: "PASS_ACCESS_AUTHORIZATION_PREDICATE_DRAFT_FAIL_CLOSED"
}, null, 2));
console.log("ACCESS_AUTHORIZATION_PREDICATE_DRAFT=PASS");
