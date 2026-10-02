"use strict";

const assert = require("assert/strict");
const fs = require("fs");

const pagePath = "ipr-onboarding-evidence-bridge.html";
const jsonPath = "evidence/ipr/20261002_HBCE_IPR_ONBOARDING_EVIDENCE_BRIDGE_v001.json";
const docPath = "docs/evidence/hbce-ipr-onboarding-evidence-bridge-v001.md";
const viewerPath = "evidence-viewer.html";
const designPath = "evidence-viewer-design.html";
const buyerPath = "buyer-evidence-one-pager.html";
const executivePath = "executive-evidence-pack.html";
const indexPath = "index.html";
const docsIndexPath = "docs/index.html";
const prototypeJsonPath = "evidence/viewer/20261002_HBCE_EVIDENCE_VIEWER_STATIC_PROTOTYPE_v001.json";

for (const path of [pagePath, jsonPath, docPath, viewerPath, designPath, buyerPath, executivePath, indexPath, docsIndexPath, prototypeJsonPath]) {
  assert.equal(fs.existsSync(path), true, path);
}

const page = fs.readFileSync(pagePath, "utf8");
const doc = fs.readFileSync(docPath, "utf8");
const viewerPage = fs.readFileSync(viewerPath, "utf8");
const designPage = fs.readFileSync(designPath, "utf8");
const buyerPage = fs.readFileSync(buyerPath, "utf8");
const executivePage = fs.readFileSync(executivePath, "utf8");
const index = fs.readFileSync(indexPath, "utf8");
const docsIndex = fs.readFileSync(docsIndexPath, "utf8");
const bridge = JSON.parse(fs.readFileSync(jsonPath, "utf8"));
const prototype = JSON.parse(fs.readFileSync(prototypeJsonPath, "utf8"));

assert.equal(bridge.bridge_id, "HBCE-IPR-ONBOARDING-EVIDENCE-BRIDGE-V001");
assert.equal(bridge.artifact_type, "HBCEIPROnboardingEvidenceBridge");
assert.equal(bridge.status, "ACTIVE_IPR_ONBOARDING_EVIDENCE_BRIDGE_BASELINE");
assert.equal(bridge.classification, "R_AND_D_IDENTITY_EVIDENCE_BRIDGE_BASELINE");
assert.equal(bridge.basis_marker, "HBCE_EVIDENCE_VIEWER_STATIC_PROTOTYPE_FINAL_AUDIT=1");
assert.equal(bridge.basis_main_commit, "c00b775ada5ed0e9df30df13b1ca1c7e6f1e6873");
assert.equal(bridge.ipr_state_model.ipr_status_values.length, 6);
assert.equal(bridge.ipr_state_model.ipr_card_status_values.length, 5);
assert.equal(bridge.ipr_state_model.certificate_status_values.length, 5);
assert.equal(bridge.onboarding_surface_candidates.length, 9);
assert.equal(bridge.evidence_viewer_objects_reused.length, 7);
assert.equal(bridge.bridge_records_to_define_next.length, 6);
assert.equal(bridge.recommended_next_steps[0].step, "PROG-266");
assert.equal(bridge.recommended_next_steps[1].step, "PROG-267");
assert.equal(bridge.result, "PASS_IPR_ONBOARDING_EVIDENCE_BRIDGE_CREATED");
assert.equal(prototype.status, "ACTIVE_STATIC_VIEWER_PROTOTYPE");

for (const expected of [
  "HBCE IPR Onboarding Evidence Bridge",
  "R&amp;D IDENTITY EVIDENCE BRIDGE BASELINE",
  "HBCE_EVIDENCE_VIEWER_STATIC_PROTOTYPE_FINAL_AUDIT=1",
  "IPR State Model",
  "verified",
  "pending",
  "rejected",
  "revoked",
  "suspended",
  "expired",
  "issued",
  "not_issued",
  "active",
  "not_created",
  "Deny-state principle",
  "/api/onboarding/start",
  "/api/onboarding/review",
  "/api/ipr/verify",
  "/api/access/joker-c2",
  "/api/certificate/status",
  "/api/ipr-card/status",
  "/api/opc/proof",
  "/api/revocation",
  "/api/events",
  "HBCE Evidence Viewer Static Prototype v001",
  "IPRIdentityIngressEvidenceRecord",
  "IPROnboardingStateEvidenceRecord",
  "IPRAccessDenyEvidenceRecord",
  "IPRPositiveAuthorizationPredicateRecord",
  "IPRRevocationEvidenceRecord",
  "OPCProofEvidenceBridgeRecord",
  "Evidence visibility must not imply access authorization",
  "Verified identity state must not imply dispatch authorization",
  "OPC proof must remain a technical verification receipt",
  "does not claim onboarding implementation",
  "does not grant access authorization",
  "does not create effect evidence",
  "PROG-266",
  "PROG-267"
]) {
  assert.ok(page.includes(expected), expected);
}

for (const key of [
  "does_not_claim_onboarding_implementation",
  "does_not_claim_access_authorization_service",
  "does_not_claim_certificate_issuance",
  "does_not_claim_legal_certification",
  "does_not_claim_full_matrix_implementation",
  "does_not_claim_level1_pilot_ready",
  "does_not_claim_current_c16_validity",
  "does_not_claim_current_external_validation_acceptance",
  "does_not_claim_commercial_release_authorization",
  "does_not_claim_current_level4_eligibility",
  "does_not_claim_dispatch_execution",
  "does_not_claim_target_receipt",
  "does_not_claim_execution_trace",
  "does_not_claim_effect_evidence"
]) {
  assert.equal(bridge.explicit_non_claims[key], true, key);
}

for (const key of [
  "access_authorization_granted",
  "certificate_issued",
  "ipr_state_mutated",
  "dispatch_execution_authorized",
  "dispatch_command_emitted",
  "dispatch_performed",
  "external_connector_called",
  "target_system_contacted",
  "target_receipt_created",
  "execution_trace_bound",
  "effect_evidence_created",
  "customer_external_execution_allowed"
]) {
  assert.equal(bridge.no_execution_boundary[key], false, key);
}

assert.ok(doc.includes("HBCE IPR Onboarding Evidence Bridge v001"));
assert.ok(doc.includes("HBCE_EVIDENCE_VIEWER_STATIC_PROTOTYPE_FINAL_AUDIT=1"));
assert.ok(doc.includes("IPR State Model"));
assert.ok(doc.includes("Deny-state principle"));
assert.ok(doc.includes("PROG-266 Evidence Object Schema Draft"));
assert.ok(doc.includes("PROG-267 IPR Onboarding Evidence Record Draft"));

assert.ok(index.includes("ipr-onboarding-evidence-bridge.html"));
assert.ok(index.includes("HBCE IPR Onboarding Evidence Bridge"));
assert.ok(docsIndex.includes("ipr-onboarding-evidence-bridge.html"));
assert.ok(docsIndex.includes("HBCE IPR Onboarding Evidence Bridge"));
assert.ok(viewerPage.includes("ipr-onboarding-evidence-bridge.html"));
assert.ok(designPage.includes("ipr-onboarding-evidence-bridge.html"));
assert.ok(buyerPage.includes("ipr-onboarding-evidence-bridge.html"));
assert.ok(executivePage.includes("ipr-onboarding-evidence-bridge.html"));

console.log("PROG_265_IPR_ONBOARDING_EVIDENCE_BRIDGE_TEST=PASS");
