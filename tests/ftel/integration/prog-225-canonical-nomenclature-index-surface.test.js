"use strict";

const assert = require("assert/strict");
const fs = require("fs");

const readmePath = "README.md";
const docGatewayPath = "docs/index/README.md";
const canonicalDocPath = "docs/index/hbce-canonical-nomenclature-index.md";
const canonicalJsonPath = "matrix/index/hbce-canonical-nomenclature-index.json";

assert.equal(fs.existsSync(readmePath), true);
assert.equal(fs.existsSync(docGatewayPath), true);
assert.equal(fs.existsSync(canonicalDocPath), true);
assert.equal(fs.existsSync(canonicalJsonPath), true);

const readme = fs.readFileSync(readmePath, "utf8");
const gateway = fs.readFileSync(docGatewayPath, "utf8");
const canonicalDoc = fs.readFileSync(canonicalDocPath, "utf8");
const canonicalJson = JSON.parse(fs.readFileSync(canonicalJsonPath, "utf8"));

assert.ok(readme.includes("HBCE-CANONICAL-NOMENCLATURE-INDEX:START"));
assert.ok(readme.includes("HBCE-CANONICAL-NOMENCLATURE-INDEX:END"));
assert.ok(readme.includes("HERMETICUM B.C.E. S.r.l."));
assert.ok(readme.includes("Blindata, Computabile, Evolutiva"));
assert.ok(readme.includes("Hardened, Computable, Evolutionary"));
assert.ok(readme.includes("H.B.C.E."));
assert.ok(readme.includes("Hermeticum Biological Cybernetic Evolution"));
assert.ok(readme.includes("HBCE-*"));
assert.ok(readme.includes("docs/index/hbce-canonical-nomenclature-index.md"));
assert.ok(readme.includes("matrix/index/hbce-canonical-nomenclature-index.json"));
assert.ok(readme.includes("names do not create authority"));

assert.ok(gateway.includes("H.B.C.E. Index Gateway"));
assert.ok(gateway.includes("HERMETICUM B.C.E. S.r.l."));
assert.ok(gateway.includes("Blindata, Computabile, Evolutiva"));
assert.ok(gateway.includes("Hermeticum Biological Cybernetic Evolution"));
assert.ok(gateway.includes("HBCE-*"));
assert.ok(gateway.includes("hbce-canonical-nomenclature-index.md"));
assert.ok(gateway.includes("../../matrix/index/hbce-canonical-nomenclature-index.json"));
assert.ok(gateway.includes("visibility and documentation surface only"));
assert.ok(gateway.includes("does not prove full MATRIX implementation"));

assert.ok(canonicalDoc.includes("HERMETICUM B.C.E. S.r.l. is the company"));
assert.ok(canonicalDoc.includes("H.B.C.E. is the operational trust-governance architecture"));
assert.ok(canonicalDoc.includes("HBCE-* remains the stable technical prefix"));

const terms = Object.fromEntries(canonicalJson.canonical_terms.map((term) => [term.term, term]));

assert.equal(terms["HERMETICUM B.C.E. S.r.l."].canonical_expansion, "Hermeticum Blindata, Computabile, Evolutiva");
assert.equal(terms["H.B.C.E."].canonical_expansion, "Hermeticum Biological Cybernetic Evolution");
assert.equal(terms["HBCE-*"].canonical_expansion, "Stable technical compatibility prefix");

for (const key of [
  "corporate_identity_creates_authority",
  "architecture_label_creates_authority",
  "technical_prefix_creates_authority",
  "joker_c2_output_creates_authority",
  "matrix_representation_creates_authority",
  "opc_receipt_creates_authority"
]) {
  assert.equal(canonicalJson.non_authority_rule[key], false, key);
}

console.log("PROG_225_HBCE_CANONICAL_NOMENCLATURE_INDEX_SURFACE_TEST=PASS");
