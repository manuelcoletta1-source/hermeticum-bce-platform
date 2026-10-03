"use strict";

const assert = require("assert/strict");
const fs = require("fs");
const cp = require("child_process");

const manifestPath = "evidence/ipr/20261003_HBCE_IPR_ONBOARDING_DENY_STATE_HARNESS_v001.json";
const pagePath = "ipr-onboarding-deny-state-harness.html";
const docPath = "docs/evidence/hbce-ipr-onboarding-deny-state-harness-v001.md";
const toolPath = "tools/evidence/validate-ipr-onboarding-deny-state-harness.js";

for (const path of [manifestPath, pagePath, docPath, toolPath]) {
  assert.equal(fs.existsSync(path), true, path);
}

const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
const page = fs.readFileSync(pagePath, "utf8");
const doc = fs.readFileSync(docPath, "utf8");
const output = cp.execFileSync(process.execPath, [toolPath], { encoding: "utf8" });

assert.equal(manifest.object_id, "HBCE-IPR-ONBOARDING-DENY-STATE-HARNESS-V001");
assert.equal(manifest.status, "ACTIVE_IPR_ONBOARDING_DENY_STATE_HARNESS");
assert.equal(manifest.basis_marker, "HBCE_EVIDENCE_SCHEMA_CONFORMANCE_HARNESS_FINAL_AUDIT=1");
assert.equal(manifest.expected_cli_marker, "IPR_ONBOARDING_DENY_STATE_HARNESS=PASS");
assert.equal(manifest.result, "PASS_IPR_ONBOARDING_DENY_STATE_HARNESS_MANIFEST_CREATED");

assert.ok(output.includes("IPR_ONBOARDING_DENY_STATE_HARNESS=PASS"));
assert.ok(output.includes("PASS_DENY_STATES_FAIL_CLOSED"));

for (const text of [
  "HBCE IPR Onboarding Deny-State Harness",
  "R&amp;D FAIL-CLOSED IDENTITY STATE HARNESS",
  "HBCE_EVIDENCE_SCHEMA_CONFORMANCE_HARNESS_FINAL_AUDIT=1",
  "ACTIVE_IPR_ONBOARDING_DENY_STATE_HARNESS",
  "HBCE-IPR-ONBOARDING-DENY-STATE-HARNESS-V001",
  "IPR_ONBOARDING_DENY_STATE_HARNESS=PASS",
  "pending",
  "rejected",
  "revoked",
  "suspended",
  "expired",
  "not_issued",
  "not_created",
  "Identity state alone does not authorize access",
  "Dispatch requires a separate positive authorization contract",
  "does not claim onboarding implementation",
  "does not create effect evidence",
  "PROG-270",
  "PROG-271"
]) {
  assert.ok(page.includes(text), text);
}

assert.ok(doc.includes("HBCE IPR Onboarding Deny-State Harness v001"));
assert.ok(doc.includes("IPR_ONBOARDING_DENY_STATE_HARNESS=PASS"));
assert.ok(doc.includes("does not create effect evidence"));

console.log("PROG_269_IPR_ONBOARDING_DENY_STATE_HARNESS_TEST=PASS");
