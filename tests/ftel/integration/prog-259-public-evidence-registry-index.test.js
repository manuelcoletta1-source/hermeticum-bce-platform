"use strict";

const assert = require("assert/strict");
const fs = require("fs");

const pagePath = "evidence-registry.html";
const jsonPath = "evidence/registry/20261002_HBCE_PUBLIC_EVIDENCE_REGISTRY_v001.json";
const docPath = "docs/evidence/hbce-public-evidence-registry-v001.md";
const indexPath = "index.html";
const docsIndexPath = "docs/index.html";

assert.equal(fs.existsSync(pagePath), true);
assert.equal(fs.existsSync(jsonPath), true);
assert.equal(fs.existsSync(docPath), true);
assert.equal(fs.existsSync(indexPath), true);
assert.equal(fs.existsSync(docsIndexPath), true);

const page = fs.readFileSync(pagePath, "utf8");
const registry = JSON.parse(fs.readFileSync(jsonPath, "utf8"));
const doc = fs.readFileSync(docPath, "utf8");
const index = fs.readFileSync(indexPath, "utf8");
const docsIndex = fs.readFileSync(docsIndexPath, "utf8");

assert.equal(registry.registry_id, "HBCE-PUBLIC-EVIDENCE-REGISTRY-V001");
assert.equal(registry.artifact_type, "HBCEPublicEvidenceRegistry");
assert.equal(registry.registry_status, "ACTIVE_BASELINE_INDEX");
assert.equal(registry.entries.length, 1);
assert.equal(registry.status, "PASS_PUBLIC_EVIDENCE_REGISTRY_CREATED");

const entry = registry.entries[0];
assert.equal(entry.entry_id, "HBCE-MATRIX-EG001-T01-T37-COMPLETE-V001");
assert.equal(entry.status, "COMPLETE_ON_MAIN");
assert.equal(entry.classification, "R_AND_D_BASELINE");
assert.equal(entry.evidence_family, "MATRIX");
assert.equal(entry.evidence_range, "EG-T01..EG-T37");
assert.equal(entry.program_range, "PROG-218..PROG-257");
assert.equal(entry.public_page, "matrix-eg001-completion.html");
assert.equal(entry.git_tag, "hbce-matrix-eg001-t01-t37-complete-v001");
assert.equal(entry.canonical_commit, "a1f6b9b12c3a91551a8f237c34164010a100d2fc");
assert.equal(entry.public_surface_commit, "2470e3da2d2c8953ca9b81f5dc99c670980367f9");
assert.equal(entry.final_seal, "MATRIX_EG001_COMPLETION_MANIFEST_MAIN_FINAL_SEAL=1");
assert.equal(entry.observed_markers, 38);
assert.deepEqual(entry.missing_markers, []);

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
  assert.equal(entry.explicit_non_claims[key], true, key);
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
  assert.equal(entry.no_execution_boundary[key], false, key);
}

assert.ok(page.includes("HBCE Public Evidence Registry"));
assert.ok(page.includes("ACTIVE_BASELINE_INDEX") || page.includes("Registered baseline"));
assert.ok(page.includes("HBCE MATRIX EG-001 T01-T37 Complete v001"));
assert.ok(page.includes("COMPLETE_ON_MAIN"));
assert.ok(page.includes("matrix-eg001-completion.html"));
assert.ok(page.includes("20261002_HBCE_PUBLIC_EVIDENCE_REGISTRY_v001.json"));
assert.ok(page.includes("does not claim full MATRIX implementation"));
assert.ok(page.includes("does not authorize dispatch execution"));
assert.ok(page.includes("does not create effect evidence"));

assert.ok(doc.includes("HBCE Public Evidence Registry v001"));
assert.ok(doc.includes("HBCE MATRIX EG-001 T01-T37 Complete v001"));
assert.ok(doc.includes("MATRIX_EG001_COMPLETION_MANIFEST_MAIN_FINAL_SEAL=1"));
assert.ok(doc.includes("does not claim full MATRIX implementation"));

assert.ok(index.includes("evidence-registry.html"));
assert.ok(index.includes("HBCE Public Evidence Registry"));
assert.ok(docsIndex.includes("evidence-registry.html"));
assert.ok(docsIndex.includes("HBCE Public Evidence Registry"));

console.log("PROG_259_PUBLIC_EVIDENCE_REGISTRY_INDEX_TEST=PASS");
