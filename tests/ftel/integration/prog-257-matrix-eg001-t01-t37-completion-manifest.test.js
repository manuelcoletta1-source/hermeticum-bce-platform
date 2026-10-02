"use strict";

const assert = require("assert/strict");
const fs = require("fs");

const manifestPath = "matrix/eg001/evidence/20261002_HBCE-MATRIX-EG001_T01-T37_COMPLETION_MANIFEST_v001.json";
const docPath = "docs/matrix/hbce-matrix-eg001-t01-t37-completion-manifest.md";

const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
const doc = fs.readFileSync(docPath, "utf8");

assert.equal(manifest.program, "PROG-257");
assert.equal(manifest.artifact_type, "MatrixEG001T01T37CompletionManifest");
assert.equal(manifest.main_head, "db0c9a629b11763444588bf0b61dae68dc13b8c8");
assert.equal(manifest.origin_main, "db0c9a629b11763444588bf0b61dae68dc13b8c8");
assert.equal(manifest.main_origin_aligned, true);
assert.equal(manifest.audit_marker, "MATRIX_EG001_T01_T37_MAIN_FINAL_AUDIT=1");
assert.equal(manifest.final_gate_marker, "MATRIX_EG001_T37_FINAL_GATE=PASS");
assert.equal(manifest.expected_matrix_eg_markers, 37);
assert.equal(manifest.found_matrix_eg_markers, 37);
assert.deepEqual(manifest.missing_matrix_eg_markers, []);
assert.equal(manifest.matrix_eg001_t01_t37_status, "COMPLETE_ON_MAIN");
assert.equal(manifest.markers.length, 37);

for (const marker of manifest.markers) {
  assert.ok(marker.endsWith("=PASS"), marker);
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
  assert.equal(manifest.explicit_non_claims[key], true, key);
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
  assert.equal(manifest.no_execution_boundary[key], false, key);
}

assert.ok(doc.includes("MATRIX EG-001 `EG-T01..EG-T37` is complete on `main`"));
assert.ok(doc.includes("MATRIX_EG001_T01_T37_MAIN_FINAL_AUDIT=1"));
assert.ok(doc.includes("FOUND_MATRIX_EG_MARKERS=37"));
assert.ok(doc.includes("does not claim full MATRIX implementation"));
assert.ok(doc.includes("does not authorize dispatch execution"));
assert.ok(doc.includes("does not create effect evidence"));

console.log("PROG_257_MATRIX_EG001_T01_T37_COMPLETION_MANIFEST_TEST=PASS");
