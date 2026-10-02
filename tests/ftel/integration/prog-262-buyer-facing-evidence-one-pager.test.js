"use strict";

const assert = require("assert/strict");
const fs = require("fs");

const pagePath = "buyer-evidence-one-pager.html";
const jsonPath = "evidence/buyer/20261002_HBCE_BUYER_EVIDENCE_ONE_PAGER_v001.json";
const docPath = "docs/evidence/hbce-buyer-evidence-one-pager-v001.md";
const executivePath = "executive-evidence-pack.html";
const indexPath = "index.html";
const docsIndexPath = "docs/index.html";
const executiveJsonPath = "evidence/executive/20261002_HBCE_EXECUTIVE_EVIDENCE_PACK_v001.json";
const registryPath = "evidence/registry/20261002_HBCE_PUBLIC_EVIDENCE_REGISTRY_v001.json";
const matrixManifestPath = "matrix/eg001/evidence/20261002_HBCE-MATRIX-EG001_T01-T37_COMPLETION_MANIFEST_v001.json";

for (const path of [pagePath, jsonPath, docPath, executivePath, indexPath, docsIndexPath, executiveJsonPath, registryPath, matrixManifestPath]) {
  assert.equal(fs.existsSync(path), true, path);
}

const page = fs.readFileSync(pagePath, "utf8");
const doc = fs.readFileSync(docPath, "utf8");
const executive = fs.readFileSync(executivePath, "utf8");
const index = fs.readFileSync(indexPath, "utf8");
const docsIndex = fs.readFileSync(docsIndexPath, "utf8");
const onePager = JSON.parse(fs.readFileSync(jsonPath, "utf8"));
const executivePack = JSON.parse(fs.readFileSync(executiveJsonPath, "utf8"));
const registry = JSON.parse(fs.readFileSync(registryPath, "utf8"));
const matrixManifest = JSON.parse(fs.readFileSync(matrixManifestPath, "utf8"));

assert.equal(onePager.one_pager_id, "HBCE-BUYER-EVIDENCE-ONE-PAGER-V001");
assert.equal(onePager.artifact_type, "HBCEBuyerFacingEvidenceOnePager");
assert.equal(onePager.status, "ACTIVE_BUYER_READABLE_BASELINE");
assert.equal(onePager.classification, "BUYER_READABLE_R_AND_D_BASELINE");
assert.equal(onePager.current_public_evidence_surface.final_audit_marker, "HBCE_EXECUTIVE_EVIDENCE_PACK_FINAL_AUDIT=1");
assert.equal(onePager.current_public_evidence_surface.main_commit, "cd8749142c5678ae3ec9ce39c14b8968ac5b8025");
assert.equal(onePager.current_public_evidence_surface.surfaces.length, 4);
assert.equal(onePager.recommended_buyer_next_step.title, "Evidence Review Session");
assert.equal(onePager.next_internal_step, "PROG-263 Evidence Viewer Design");
assert.equal(onePager.result, "PASS_BUYER_EVIDENCE_ONE_PAGER_CREATED");

assert.equal(executivePack.pack_status, "ACTIVE_EXECUTIVE_BASELINE");
assert.equal(registry.registry_status, "ACTIVE_BASELINE_INDEX");
assert.equal(registry.entries[0].status, "COMPLETE_ON_MAIN");
assert.equal(matrixManifest.matrix_eg001_t01_t37_status, "COMPLETE_ON_MAIN");

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
  assert.equal(onePager.explicit_non_claims[key], true, key);
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
  assert.equal(onePager.no_execution_boundary[key], false, key);
}

for (const expected of [
  "HBCE Buyer-Facing Evidence One-Pager",
  "BUYER-READABLE R&amp;D BASELINE",
  "HBCE_EXECUTIVE_EVIDENCE_PACK_FINAL_AUDIT=1",
  "HBCE MATRIX EG-001 T01-T37 Complete v001",
  "HBCE Public Evidence Registry v001",
  "HBCE Public Evidence Explainer v001",
  "HBCE Executive Evidence Pack v001",
  "buyer-evidence-one-pager.html",
  "20261002_HBCE_BUYER_EVIDENCE_ONE_PAGER_v001.json",
  "hbce-buyer-evidence-one-pager-v001.md",
  "does not claim full MATRIX implementation",
  "does not authorize dispatch execution",
  "does not create effect evidence",
  "Evidence Review Session",
  "pilot evidence requirements outline"
]) {
  assert.ok(page.includes(expected), expected);
}

assert.ok(doc.includes("HBCE Buyer-Facing Evidence One-Pager v001"));
assert.ok(doc.includes("HBCE_EXECUTIVE_EVIDENCE_PACK_FINAL_AUDIT=1"));
assert.ok(doc.includes("cd8749142c5678ae3ec9ce39c14b8968ac5b8025"));
assert.ok(doc.includes("does not claim full MATRIX implementation"));
assert.ok(doc.includes("Evidence Review Session"));
assert.ok(doc.includes("PROG-263 Evidence Viewer Design"));

assert.ok(index.includes("buyer-evidence-one-pager.html"));
assert.ok(index.includes("HBCE Buyer-Facing Evidence One-Pager"));
assert.ok(docsIndex.includes("buyer-evidence-one-pager.html"));
assert.ok(docsIndex.includes("HBCE Buyer-Facing Evidence One-Pager"));
assert.ok(executive.includes("buyer-evidence-one-pager.html"));

console.log("PROG_262_BUYER_FACING_EVIDENCE_ONE_PAGER_TEST=PASS");
