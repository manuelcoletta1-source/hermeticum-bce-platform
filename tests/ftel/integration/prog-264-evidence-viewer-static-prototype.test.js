"use strict";

const assert = require("assert/strict");
const fs = require("fs");

const pagePath = "evidence-viewer.html";
const jsonPath = "evidence/viewer/20261002_HBCE_EVIDENCE_VIEWER_STATIC_PROTOTYPE_v001.json";
const docPath = "docs/evidence/hbce-evidence-viewer-static-prototype-v001.md";
const designPagePath = "evidence-viewer-design.html";
const buyerPath = "buyer-evidence-one-pager.html";
const executivePath = "executive-evidence-pack.html";
const indexPath = "index.html";
const docsIndexPath = "docs/index.html";
const designJsonPath = "evidence/viewer/20261002_HBCE_EVIDENCE_VIEWER_DESIGN_v001.json";

for (const path of [pagePath, jsonPath, docPath, designPagePath, buyerPath, executivePath, indexPath, docsIndexPath, designJsonPath]) {
  assert.equal(fs.existsSync(path), true, path);
}

const page = fs.readFileSync(pagePath, "utf8");
const doc = fs.readFileSync(docPath, "utf8");
const designPage = fs.readFileSync(designPagePath, "utf8");
const buyer = fs.readFileSync(buyerPath, "utf8");
const executive = fs.readFileSync(executivePath, "utf8");
const index = fs.readFileSync(indexPath, "utf8");
const docsIndex = fs.readFileSync(docsIndexPath, "utf8");
const prototype = JSON.parse(fs.readFileSync(jsonPath, "utf8"));
const design = JSON.parse(fs.readFileSync(designJsonPath, "utf8"));

assert.equal(prototype.prototype_id, "HBCE-EVIDENCE-VIEWER-STATIC-PROTOTYPE-V001");
assert.equal(prototype.artifact_type, "HBCEEvidenceViewerStaticPrototype");
assert.equal(prototype.status, "ACTIVE_STATIC_VIEWER_PROTOTYPE");
assert.equal(prototype.classification, "R_AND_D_STATIC_UI_PROTOTYPE");
assert.equal(prototype.basis_marker, "HBCE_EVIDENCE_VIEWER_DESIGN_FINAL_AUDIT=1");
assert.equal(prototype.basis_main_commit, "ae18af48d6a95c3bdcd51509e0d8275b915c745f");
assert.equal(prototype.evidence_objects.length, 6);
assert.equal(prototype.viewer_sections_implemented.length, 6);
assert.equal(prototype.recommended_next_steps[0].step, "PROG-265");
assert.equal(prototype.recommended_next_steps[1].step, "PROG-266");
assert.equal(prototype.result, "PASS_EVIDENCE_VIEWER_STATIC_PROTOTYPE_CREATED");
assert.equal(design.status, "ACTIVE_VIEWER_DESIGN_BASELINE");

for (const expected of [
  "HBCE Evidence Viewer",
  "STATIC R&amp;D VIEWER PROTOTYPE",
  "HBCE_EVIDENCE_VIEWER_DESIGN_FINAL_AUDIT=1",
  "Evidence Overview",
  "Evidence Detail Cards",
  "Machine-Readable Artifacts",
  "Release Anchors",
  "Boundary Panel",
  "Review Path",
  "HBCE MATRIX EG-001 T01-T37 Complete v001",
  "HBCE Public Evidence Registry v001",
  "HBCE Public Evidence Explainer v001",
  "HBCE Executive Evidence Pack v001",
  "HBCE Buyer-Facing Evidence One-Pager v001",
  "HBCE Evidence Viewer Design v001",
  "20261002_HBCE_EVIDENCE_VIEWER_STATIC_PROTOTYPE_v001.json",
  "hbce-evidence-viewer-static-prototype-v001.md",
  "hbce-evidence-viewer-design-v001",
  "hbce-buyer-evidence-one-pager-v001",
  "does not claim full MATRIX implementation",
  "does not authorize dispatch execution",
  "does not create effect evidence",
  "PROG-265",
  "PROG-266"
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
  assert.equal(prototype.explicit_non_claims[key], true, key);
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
  assert.equal(prototype.no_execution_boundary[key], false, key);
}

assert.ok(doc.includes("HBCE Evidence Viewer Static Prototype v001"));
assert.ok(doc.includes("HBCE_EVIDENCE_VIEWER_DESIGN_FINAL_AUDIT=1"));
assert.ok(doc.includes("ACTIVE_STATIC_VIEWER_PROTOTYPE") || doc.includes("static public HBCE Evidence Viewer prototype"));
assert.ok(doc.includes("PROG-265 IPR Onboarding Evidence Bridge"));
assert.ok(doc.includes("PROG-266 Evidence Object Schema Draft"));

assert.ok(index.includes("evidence-viewer.html"));
assert.ok(index.includes("HBCE Evidence Viewer"));
assert.ok(docsIndex.includes("evidence-viewer.html"));
assert.ok(docsIndex.includes("HBCE Evidence Viewer"));
assert.ok(designPage.includes("evidence-viewer.html"));
assert.ok(buyer.includes("evidence-viewer.html"));
assert.ok(executive.includes("evidence-viewer.html"));

console.log("PROG_264_EVIDENCE_VIEWER_STATIC_PROTOTYPE_TEST=PASS");
