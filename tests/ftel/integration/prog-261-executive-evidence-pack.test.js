"use strict";

const assert = require("assert/strict");
const fs = require("fs");

const pagePath = "executive-evidence-pack.html";
const jsonPath = "evidence/executive/20261002_HBCE_EXECUTIVE_EVIDENCE_PACK_v001.json";
const docPath = "docs/evidence/hbce-executive-evidence-pack-v001.md";
const indexPath = "index.html";
const docsIndexPath = "docs/index.html";
const registryPath = "evidence/registry/20261002_HBCE_PUBLIC_EVIDENCE_REGISTRY_v001.json";
const matrixManifestPath = "matrix/eg001/evidence/20261002_HBCE-MATRIX-EG001_T01-T37_COMPLETION_MANIFEST_v001.json";

for (const path of [pagePath, jsonPath, docPath, indexPath, docsIndexPath, registryPath, matrixManifestPath]) {
  assert.equal(fs.existsSync(path), true, path);
}

const page = fs.readFileSync(pagePath, "utf8");
const doc = fs.readFileSync(docPath, "utf8");
const index = fs.readFileSync(indexPath, "utf8");
const docsIndex = fs.readFileSync(docsIndexPath, "utf8");
const pack = JSON.parse(fs.readFileSync(jsonPath, "utf8"));
const registry = JSON.parse(fs.readFileSync(registryPath, "utf8"));
const matrixManifest = JSON.parse(fs.readFileSync(matrixManifestPath, "utf8"));

assert.equal(pack.pack_id, "HBCE-EXECUTIVE-EVIDENCE-PACK-V001");
assert.equal(pack.artifact_type, "HBCEExecutiveEvidencePack");
assert.equal(pack.pack_status, "ACTIVE_EXECUTIVE_BASELINE");
assert.equal(pack.classification, "EXTERNAL_READABLE_R_AND_D_EXECUTIVE_PACK");
assert.equal(pack.current_position.status, "PUBLIC_EVIDENCE_SURFACE_BASELINE_VERIFIED");
assert.equal(pack.current_position.final_audit_marker, "HBCE_PUBLIC_EVIDENCE_SURFACE_FINAL_AUDIT=1");
assert.equal(pack.current_position.main_commit, "d41c4f2c55cdfd41ae5bdbf0d03b8f84a5540e82");
assert.equal(pack.public_evidence_surfaces.length, 3);
assert.equal(pack.status, "PASS_EXECUTIVE_EVIDENCE_PACK_CREATED");

assert.equal(registry.registry_status, "ACTIVE_BASELINE_INDEX");
assert.equal(registry.entries[0].entry_id, "HBCE-MATRIX-EG001-T01-T37-COMPLETE-V001");
assert.equal(registry.entries[0].status, "COMPLETE_ON_MAIN");
assert.equal(matrixManifest.matrix_eg001_t01_t37_status, "COMPLETE_ON_MAIN");

for (const expected of [
  "HBCE MATRIX EG-001 T01-T37 Complete v001",
  "HBCE Public Evidence Registry v001",
  "HBCE Public Evidence Explainer v001"
]) {
  assert.ok(pack.public_evidence_surfaces.some((surface) => surface.title === expected), expected);
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
  assert.equal(pack.explicit_non_claims[key], true, key);
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
  assert.equal(pack.no_execution_boundary[key], false, key);
}

assert.ok(page.includes("HBCE Executive Evidence Pack"));
assert.ok(page.includes("EXECUTIVE R&amp;D BASELINE PACK"));
assert.ok(page.includes("HBCE_PUBLIC_EVIDENCE_SURFACE_FINAL_AUDIT=1"));
assert.ok(page.includes("executive-evidence-pack.html") || page.includes("Executive Evidence Pack"));
assert.ok(page.includes("evidence/executive/20261002_HBCE_EXECUTIVE_EVIDENCE_PACK_v001.json"));
assert.ok(page.includes("docs/evidence/hbce-executive-evidence-pack-v001.md"));
assert.ok(page.includes("does not claim full MATRIX implementation"));
assert.ok(page.includes("does not authorize dispatch execution"));
assert.ok(page.includes("does not create effect evidence"));
assert.ok(page.includes("PROG-262"));
assert.ok(page.includes("PROG-263"));
assert.ok(page.includes("PROG-264"));

assert.ok(doc.includes("HBCE Executive Evidence Pack v001"));
assert.ok(doc.includes("HBCE_PUBLIC_EVIDENCE_SURFACE_FINAL_AUDIT=1"));
assert.ok(doc.includes("d41c4f2c55cdfd41ae5bdbf0d03b8f84a5540e82"));
assert.ok(doc.includes("does not claim full MATRIX implementation"));

assert.ok(index.includes("executive-evidence-pack.html"));
assert.ok(index.includes("HBCE Executive Evidence Pack"));
assert.ok(docsIndex.includes("executive-evidence-pack.html"));
assert.ok(docsIndex.includes("HBCE Executive Evidence Pack"));

console.log("PROG_261_EXECUTIVE_EVIDENCE_PACK_TEST=PASS");
