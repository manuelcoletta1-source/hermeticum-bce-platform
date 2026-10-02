"use strict";

const assert = require("assert/strict");
const fs = require("fs");

const pagePath = "matrix-eg001-completion.html";
const indexPath = "index.html";
const docsIndexPath = "docs/index.html";
const manifestPath = "matrix/eg001/evidence/20261002_HBCE-MATRIX-EG001_T01-T37_COMPLETION_MANIFEST_v001.json";
const manifestDocPath = "docs/matrix/hbce-matrix-eg001-t01-t37-completion-manifest.md";

assert.equal(fs.existsSync(pagePath), true);
assert.equal(fs.existsSync(indexPath), true);
assert.equal(fs.existsSync(manifestPath), true);
assert.equal(fs.existsSync(manifestDocPath), true);

const page = fs.readFileSync(pagePath, "utf8");
const index = fs.readFileSync(indexPath, "utf8");
const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));

assert.ok(page.includes("HBCE MATRIX EG-001 T01-T37 Complete v001"));
assert.ok(page.includes("COMPLETE_ON_MAIN"));
assert.ok(page.includes("a1f6b9b12c3a91551a8f237c34164010a100d2fc"));
assert.ok(page.includes("hbce-matrix-eg001-t01-t37-complete-v001"));
assert.ok(page.includes("MATRIX_EG001_COMPLETION_MANIFEST_MAIN_FINAL_SEAL=1"));
assert.ok(page.includes("FOUND_MATRIX_EG_AND_MANIFEST_MARKERS=38"));
assert.ok(page.includes("20261002_HBCE-MATRIX-EG001_T01-T37_COMPLETION_MANIFEST_v001.json"));
assert.ok(page.includes("docs/matrix/hbce-matrix-eg001-t01-t37-completion-manifest.md"));
assert.ok(page.includes("does not claim full MATRIX implementation"));
assert.ok(page.includes("does not authorize dispatch execution"));
assert.ok(page.includes("does not create effect evidence"));

assert.ok(index.includes("matrix-eg001-completion.html"));
assert.ok(index.includes("HBCE MATRIX EG-001 T01-T37 Complete v001"));

if (fs.existsSync(docsIndexPath)) {
  const docsIndex = fs.readFileSync(docsIndexPath, "utf8");
  assert.ok(docsIndex.includes("matrix-eg001-completion.html"));
  assert.ok(docsIndex.includes("HBCE MATRIX EG-001 T01-T37 Complete v001"));
}

assert.equal(manifest.program, "PROG-257");
assert.equal(manifest.matrix_eg001_t01_t37_status, "COMPLETE_ON_MAIN");
assert.equal(manifest.expected_matrix_eg_markers, 37);
assert.equal(manifest.found_matrix_eg_markers, 37);
assert.equal(manifest.markers.length, 37);
assert.equal(manifest.explicit_non_claims.does_not_claim_full_matrix_implementation, true);
assert.equal(manifest.no_execution_boundary.dispatch_performed, false);
assert.equal(manifest.no_execution_boundary.effect_evidence_created, false);

console.log("PROG_258_PAGES_MATRIX_EG001_COMPLETION_PUBLIC_SURFACE_TEST=PASS");
