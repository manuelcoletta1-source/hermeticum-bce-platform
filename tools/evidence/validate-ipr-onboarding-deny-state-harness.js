#!/usr/bin/env node
"use strict";

const fs = require("fs");

const manifestPath = "evidence/ipr/20261003_HBCE_IPR_ONBOARDING_DENY_STATE_HARNESS_v001.json";
const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));

function fail(message) {
  throw new Error(message);
}

function sameSet(actual, expected, label) {
  const a = new Set(actual);
  const e = new Set(expected);
  if (a.size !== e.size) fail(`${label} size mismatch`);
  for (const item of e) {
    if (!a.has(item)) fail(`${label} missing ${item}`);
  }
}

if (manifest.object_id !== "HBCE-IPR-ONBOARDING-DENY-STATE-HARNESS-V001") fail("object_id invalid");
if (manifest.status !== "ACTIVE_IPR_ONBOARDING_DENY_STATE_HARNESS") fail("status invalid");
if (manifest.basis_marker !== "HBCE_EVIDENCE_SCHEMA_CONFORMANCE_HARNESS_FINAL_AUDIT=1") fail("basis_marker invalid");
if (manifest.expected_cli_marker !== "IPR_ONBOARDING_DENY_STATE_HARNESS=PASS") fail("expected_cli_marker invalid");

sameSet(manifest.deny_state_models.ipr_status.deny_values, ["pending", "rejected", "revoked", "suspended", "expired"], "ipr_status.deny_values");
sameSet(manifest.deny_state_models.ipr_card_status.deny_values, ["pending", "not_issued", "revoked", "expired"], "ipr_card_status.deny_values");
sameSet(manifest.deny_state_models.certificate_status.deny_values, ["pending", "not_created", "revoked", "expired"], "certificate_status.deny_values");

const boundary = manifest.positive_authorization_boundary;
if (boundary.identity_state_alone_authorizes_access !== false) fail("identity_state_alone_authorizes_access must be false");
if (boundary.ipr_card_state_alone_authorizes_access !== false) fail("ipr_card_state_alone_authorizes_access must be false");
if (boundary.certificate_state_alone_authorizes_access !== false) fail("certificate_state_alone_authorizes_access must be false");
if (boundary.verified_issued_active_combination_authorizes_dispatch !== false) fail("verified_issued_active_combination_authorizes_dispatch must be false");
if (boundary.dispatch_requires_separate_positive_authorization_contract !== true) fail("dispatch contract requirement invalid");

for (const [key, value] of Object.entries(manifest.explicit_non_claims)) {
  if (value !== true) fail(`explicit_non_claims.${key} must be true`);
}

for (const [key, value] of Object.entries(manifest.no_execution_boundary)) {
  if (value !== false) fail(`no_execution_boundary.${key} must be false`);
}

console.log(JSON.stringify({
  marker: "IPR_ONBOARDING_DENY_STATE_HARNESS=PASS",
  harness_id: manifest.harness_id,
  ipr_status_deny_values: manifest.deny_state_models.ipr_status.deny_values,
  ipr_card_status_deny_values: manifest.deny_state_models.ipr_card_status.deny_values,
  certificate_status_deny_values: manifest.deny_state_models.certificate_status.deny_values,
  result: "PASS_DENY_STATES_FAIL_CLOSED"
}, null, 2));
console.log("IPR_ONBOARDING_DENY_STATE_HARNESS=PASS");
