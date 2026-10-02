"use strict";

const assert = require("assert/strict");
const fs = require("fs");

const pagePath = "evidence-viewer-design.html";
const jsonPath = "evidence/viewer/20261002_HBCE_EVIDENCE_VIEWER_DESIGN_v001.json";
const docPath = "docs/evidence/hbce-evidence-viewer-design-v001.md";
const buyerPath = "buyer-evidence-one-pager.html";
const executivePath = "executive-evidence-pack.html";
const indexPath = "index.html";
const docsIndexPath = "docs/index.html";
const buyerJsonPath = "evidence/buyer/20261002_HBCE_BUYER_EVIDENCE_ONE_PAGER_v001.json";

for (const path of [pagePath, jsonPath, docPath, buyerPath, executivePath, indexPath, docsIndexPath, buyerJsonPath]) {
  assert.equal(fs.existsSync(path), true, path);
}

const page = fs.readFileSync(pagePath, "utf8");
const doc = fs.readFileSync(docPath, "utf8");
const buyer = fs.readFileSync(buyerPath, "utf8");
const executive = fs.readFileSync(executivePath, "utf8");
const index = fs.readFileSync(indexPath, "utf8");
const docsIndex = fs.readFileSync(docsIndexPath, "utf8");
const viewer = JSON.parse(fs.readFileSync(jsonPath, "utf8"));
const buyerJson = JSON.parse(fs.readFileSync(buyerJsonPath, "utf8"));

assert.equal(viewer.viewer_design_id, "HBCE-EVIDENCE-VIEWER-DESIGN-V001");
assert.equal(viewer.artifact_type, "HBCEEvidenceViewerDesign");
assert.equal(viewer.status, "ACTIVE_VIEWER_DESIGN_BASELINE");
assert.equal(viewer.classification, "R_AND_D_UI_DESIGN_BASELINE");
assert.equal(viewer.basis_marker, "HBCE_BUYER_EVIDENCE_ONE_PAGER_FINAL_AUDIT=1");
assert.equal(viewer.basis_main_commit, "21a35d12f7ae511aacca8ea65854ccc65b5d5c8b");
assert.equal(viewer.evidence_objects.length, 5);
assert.equal(viewer.recommended_next_steps[0].step, "PROG-264");
assert.equal(viewer.recommended_next_steps[1].step, "PROG-265");
assert.equal(viewer.result, "PASS_EVIDENCE_VIEWER_DESIGN_CREATED");
assert.equal(buyerJson.status, "ACTIVE_BUYER_READABLE_BASELINE");

for (const expected of [
  "HBCE Evidence Viewer Design",
  "R&amp;D UI DESIGN BASELINE",
  "HBCE_BUYER_EVIDENCE_ONE_PAGER_FINAL_AUDIT=1",
  "HBCE MATRIX EG-001 T01-T37 Complete v001",
  "HBCE Public Evidence Registry v001",
  "HBCE Public Evidence Explainer v001",
  "HBCE Executive Evidence Pack v001",
  "HBCE Buyer-Facing Evidence One-Pager v001",
  "20261002_HBCE_EVIDENCE_VIEWER_DESIGN_v001.json",
  "hbce-evidence-viewer-design-v001.md",
  "Evidence Overview",
  "Evidence Detail",
  "Boundary Panel",
  "Review Path",
  "does not claim full MATRIX implementation",
  "does not authorize dispatch execution",
  "does not create effect evidence",
  "PROG-264",
  "PROG-265"
]) {
  assert.ok(page.includes(expected), expected);
}

for (const key of [
  "does_not_claim_full_matrix_implementation",
  "does_not_claim_level1_pilot_ready",
  "does_not_claim_current_c16_validity",
  "does_not_claim_current_external_validation_acceptance",
  "does_not_claim_legal_review",
  "does_not_claim_certification",
  "does_not_claim_commercial_release_authorization",
  "does_not_claim_current_level4_eligibility",
  "does_not_claim_dispatch_execution",
  "does_not_claim_target_receipt",
  "does_not_claim_execution_trace",
  "does_not_claim_effect_evidence"
]) {
  assert.equal(viewer.explicit_non_claims[key], true, key);
}

for (const key of [
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
  assert.equal(viewer.no_execution_boundary[key], false, key);
}

assert.ok(doc.includes("HBCE Evidence Viewer Design v001"));
assert.ok(doc.includes("HBCE_BUYER_EVIDENCE_ONE_PAGER_FINAL_AUDIT=1"));
assert.ok(doc.includes("Viewer Is Not"));
assert.ok(doc.includes("PROG-264 Evidence Viewer Static Prototype"));
assert.ok(doc.includes("PROG-265 IPR Onboarding Evidence Bridge"));

assert.ok(index.includes("evidence-viewer-design.html"));
assert.ok(index.includes("HBCE Evidence Viewer Design"));
assert.ok(docsIndex.includes("evidence-viewer-design.html"));
assert.ok(docsIndex.includes("HBCE Evidence Viewer Design"));
assert.ok(buyer.includes("evidence-viewer-design.html"));
assert.ok(executive.includes("evidence-viewer-design.html"));

console.log("PROG_263_EVIDENCE_VIEWER_DESIGN_TEST=PASS");
