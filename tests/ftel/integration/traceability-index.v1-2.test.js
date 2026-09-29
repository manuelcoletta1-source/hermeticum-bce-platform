const fs = require("fs");
const assert = require("assert/strict");

const index = JSON.parse(fs.readFileSync("docs/launch/traceability/index.json", "utf8"));
const md = fs.readFileSync("docs/launch/traceability/INDEX.md", "utf8");

assert.equal(index.index_id, "HBCE-V1-2-LAUNCH-TRACEABILITY-INDEX");
assert.equal(index.directive_ref, "HBCE-RD-MASTER-2027-0003-V1.2-EXECUTION-TRACE-BINDING-PATCH");
assert.equal(index.index_semantics, "navigation_index_not_gate_pass_not_execution_evidence");
assert.ok(index.record_count >= 1);

const r174 = index.records.find((r) => r.program_number === 174);
assert.ok(r174, "PROG-174 traceability record missing from index");

assert.equal(r174.gate_semantics, "structural_validation");
assert.equal(r174.evidence_class, "STRUCTURALLY_VALIDATED");
assert.equal(r174.result, "PASS");
assert.equal(r174.execution_claimed, false);
assert.equal(r174.execution_trace_required, false);
assert.equal(r174.execution_trace_ref, null);
assert.equal(r174.consequence_claimed, false);
assert.equal(r174.consequence_trace_required, false);
assert.equal(r174.consequence_trace_ref, null);

assert.equal(r174.overclaim_check.required, true);
assert.equal(r174.overclaim_check.performed, true);
assert.equal(r174.overclaim_check.result_does_not_exceed_evidence_class, true);
assert.equal(r174.overclaim_check.non_execution_gate_not_promoted_to_execution_evidence, true);
assert.equal(r174.overclaim_check.semantic_overclaim_rejected, true);

assert.equal(r174.claim_ceiling.not_execution_evidence, true);
assert.equal(r174.claim_ceiling.not_receipt_validation, true);
assert.equal(r174.claim_ceiling.not_external_effect_evidence, true);
assert.equal(r174.claim_ceiling.not_physical_effect_evidence, true);
assert.equal(r174.claim_ceiling.not_readiness_gate_pass, true);
assert.equal(r174.claim_ceiling.not_product_readiness, true);

assert.equal(index.claim_ceiling.not_execution_evidence, true);
assert.equal(index.claim_ceiling.not_certification, true);
assert.equal(index.claim_ceiling.not_legal_validity, true);
assert.equal(index.claim_ceiling.not_procurement_eligibility, true);

assert.ok(md.includes("# H.B.C.E. V1.2 Launch Traceability Index"));
assert.ok(md.includes("PROG-174"));
assert.ok(md.includes("structural_validation"));
assert.ok(md.includes("STRUCTURALLY_VALIDATED"));
assert.ok(md.includes("A PASS does not become execution evidence"));

console.log("TRACEABILITY_INDEX_V1_2_TEST=PASS");
