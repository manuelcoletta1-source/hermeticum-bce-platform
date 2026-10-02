"use strict";

const assert = require("assert/strict");
const fs = require("fs");

const pagePath = "evidence-explainer.html";
const docPath = "docs/evidence/hbce-public-evidence-explainer-v001.md";
const registryJsonPath = "evidence/registry/20261002_HBCE_PUBLIC_EVIDENCE_REGISTRY_v001.json";
const matrixManifestPath = "matrix/eg001/evidence/20261002_HBCE-MATRIX-EG001_T01-T37_COMPLETION_MANIFEST_v001.json";
const indexPath = "index.html";
const docsIndexPath = "docs/index.html";

assert.equal(fs.existsSync(pagePath), true);
assert.equal(fs.existsSync(docPath), true);
assert.equal(fs.existsSync(registryJsonPath), true);
assert.equal(fs.existsSync(matrixManifestPath), true);
assert.equal(fs.existsSync(indexPath), true);
assert.equal(fs.existsSync(docsIndexPath), true);

const page = fs.readFileSync(pagePath, "utf8");
const doc = fs.readFileSync(docPath, "utf8");
const registry = JSON.parse(fs.readFileSync(registryJsonPath, "utf8"));
const matrixManifest = JSON.parse(fs.readFileSync(matrixManifestPath, "utf8"));
const index = fs.readFileSync(indexPath, "utf8");
const docsIndex = fs.readFileSync(docsIndexPath, "utf8");

assert.equal(registry.registry_status, "ACTIVE_BASELINE_INDEX");
assert.equal(registry.entries[0].entry_id, "HBCE-MATRIX-EG001-T01-T37-COMPLETE-V001");
assert.equal(registry.entries[0].status, "COMPLETE_ON_MAIN");
assert.equal(matrixManifest.matrix_eg001_t01_t37_status, "COMPLETE_ON_MAIN");

assert.ok(page.includes("HBCE Public Evidence Explainer"));
assert.ok(page.includes("R&amp;D BASELINE EXPLAINER"));
assert.ok(page.includes("HBCE MATRIX EG-001 T01-T37 Complete v001"));
assert.ok(page.includes("COMPLETE_ON_MAIN"));
assert.ok(page.includes("hbce-public-evidence-registry-v001"));
assert.ok(page.includes("hbce-matrix-eg001-t01-t37-complete-v001"));
assert.ok(page.includes("evidence-registry.html"));
assert.ok(page.includes("matrix-eg001-completion.html"));
assert.ok(page.includes("20261002_HBCE_PUBLIC_EVIDENCE_REGISTRY_v001.json"));
assert.ok(page.includes("20261002_HBCE-MATRIX-EG001_T01-T37_COMPLETION_MANIFEST_v001.json"));
assert.ok(page.includes("does not claim full MATRIX implementation"));
assert.ok(page.includes("does not authorize dispatch execution"));
assert.ok(page.includes("does not create effect evidence"));

assert.ok(doc.includes("HBCE Public Evidence Explainer v001"));
assert.ok(doc.includes("ACTIVE_BASELINE_INDEX"));
assert.ok(doc.includes("HBCE-MATRIX-EG001-T01-T37-COMPLETE-V001"));
assert.ok(doc.includes("COMPLETE_ON_MAIN"));
assert.ok(doc.includes("does not claim full MATRIX implementation"));

assert.ok(index.includes("evidence-explainer.html"));
assert.ok(index.includes("HBCE Public Evidence Explainer"));
assert.ok(docsIndex.includes("evidence-explainer.html"));
assert.ok(docsIndex.includes("HBCE Public Evidence Explainer"));

console.log("PROG_260_PUBLIC_EVIDENCE_EXPLAINER_TEST=PASS");
