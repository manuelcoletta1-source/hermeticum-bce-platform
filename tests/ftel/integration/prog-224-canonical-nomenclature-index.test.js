"use strict";

const assert = require("assert/strict");
const fs = require("fs");

const docPath = "docs/index/hbce-canonical-nomenclature-index.md";
const jsonPath = "matrix/index/hbce-canonical-nomenclature-index.json";

assert.equal(fs.existsSync(docPath), true);
assert.equal(fs.existsSync(jsonPath), true);

const doc = fs.readFileSync(docPath, "utf8");
const index = JSON.parse(fs.readFileSync(jsonPath, "utf8"));

assert.equal(index.index_id, "PROG-224-HBCE-CANONICAL-NOMENCLATURE-INDEX");
assert.equal(index.schema_version, "HBCE-CANONICAL-NOMENCLATURE-INDEX-V0.1");
assert.equal(index.status, "CANONICAL_NOMENCLATURE_INDEX_CREATED");

const company = index.canonical_terms.find((term) => term.term === "HERMETICUM B.C.E. S.r.l.");
const architecture = index.canonical_terms.find((term) => term.term === "H.B.C.E.");
const prefix = index.canonical_terms.find((term) => term.term === "HBCE-*");
const joker = index.canonical_terms.find((term) => term.term === "JOKER-C2");
const matrix = index.canonical_terms.find((term) => term.term === "MATRIX");
const opc = index.canonical_terms.find((term) => term.term === "OPC");

assert.ok(company);
assert.ok(architecture);
assert.ok(prefix);
assert.ok(joker);
assert.ok(matrix);
assert.ok(opc);

assert.equal(company.kind, "company_organizational_entity");
assert.equal(company.canonical_expansion, "Hermeticum Blindata, Computabile, Evolutiva");
assert.equal(company.english_operational_rendering, "Hermeticum Hardened, Computable, Evolutionary");
assert.ok(company.authority_boundary.includes("does not itself create"));

assert.equal(architecture.kind, "operational_trust_governance_architecture");
assert.equal(architecture.canonical_expansion, "Hermeticum Biological Cybernetic Evolution");
assert.deepEqual(architecture.binding_fields, [
  "identity",
  "mandate",
  "context",
  "policy",
  "action",
  "evidence"
]);
assert.ok(architecture.authority_boundary.includes("does not originate"));

assert.equal(prefix.kind, "stable_technical_prefix");
assert.ok(prefix.role.includes("repositories"));
assert.ok(prefix.role.includes("schemas"));
assert.ok(prefix.role.includes("APIs"));
assert.ok(prefix.role.includes("evidence records"));
assert.ok(prefix.authority_boundary.includes("not itself"));

assert.ok(doc.includes("HERMETICUM B.C.E. S.r.l."));
assert.ok(doc.includes("Hermeticum Blindata, Computabile, Evolutiva"));
assert.ok(doc.includes("H.B.C.E."));
assert.ok(doc.includes("Hermeticum Biological Cybernetic Evolution"));
assert.ok(doc.includes("HBCE-*"));
assert.ok(doc.includes("Stable technical prefix"));
assert.ok(doc.includes("HERMETICUM B.C.E. S.r.l. is the company"));
assert.ok(doc.includes("H.B.C.E. is the operational trust-governance architecture"));
assert.ok(doc.includes("HBCE-* remains the stable technical prefix"));
assert.ok(doc.includes("None of the following create authority by name alone"));

for (const key of [
  "corporate_identity_creates_authority",
  "architecture_label_creates_authority",
  "technical_prefix_creates_authority",
  "joker_c2_output_creates_authority",
  "matrix_representation_creates_authority",
  "opc_receipt_creates_authority"
]) {
  assert.equal(index.non_authority_rule[key], false, key);
}

for (const key of [
  "matrix_implemented",
  "matrix_l1_pilot_ready",
  "c16_external_validation_completed",
  "externally_validated",
  "legal_review_claimed",
  "commercial_release_authorized",
  "level4_eligible",
  "dispatch_execution_authorized",
  "target_receipt_created",
  "effect_evidence_created"
]) {
  assert.equal(index.implementation_boundary[key], false, key);
}

console.log("PROG_224_HBCE_CANONICAL_NOMENCLATURE_INDEX_TEST=PASS");
