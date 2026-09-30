const fs = require("fs");
const assert = require("assert/strict");

const html = fs.readFileSync("index.html", "utf8");
const asset = fs.readFileSync("assets/level1-traceability-status.js", "utf8");
const index = JSON.parse(fs.readFileSync("docs/launch/traceability/index.json", "utf8"));
const latest = JSON.parse(fs.readFileSync("docs/launch/level1/prog-189-level1-public-surface-observation-human-action-completion-recovery-decision-recovery-execution-banking-pack-readiness-record.json", "utf8"));

assert.ok(html.includes('id="level1-traceability-status"'));
assert.ok(html.includes('./docs/launch/level1/prog-189-level1-public-surface-observation-human-action-completion-recovery-decision-recovery-execution-banking-pack-readiness-record.json'));
assert.ok(html.includes("PROG-189"));
assert.ok(html.includes("STRUCTURALLY_VALIDATED_BANKING_PACK_READINESS_RECORDED_STATE"));
assert.ok(html.includes("BANKING_PACK_READINESS_RECORDED_PENDING_EXTERNAL_VALIDATION_PACKAGE"));

assert.ok(html.includes("production_ready: <span data-level1-production-ready>true</span>"));
assert.ok(html.includes("level1_launch_ready: <span data-level1-launch-ready>true</span>"));
assert.ok(html.includes("external_customer_ready: <span data-level1-external-customer-ready>true</span>"));
assert.ok(html.includes("banking_pack_ready: <span data-level1-banking-pack-ready>true</span>"));
assert.ok(html.includes("external_validation_claimed: <span data-level1-external-validation-claimed>false</span>"));

assert.ok(html.includes("not execution evidence"));
assert.ok(html.includes("not certification"));
assert.ok(html.includes("not legal validity"));
assert.ok(html.includes("not procurement eligibility"));

assert.ok(asset.includes("data-level1-banking-pack-ready"));
assert.ok(asset.includes("banking_pack_ready"));
assert.ok(asset.includes("hbceBindBankingPackReadyState"));
assert.ok(asset.includes("data-level1-external-validation-claimed"));
assert.ok(asset.includes("external_validation_claimed"));
assert.ok(asset.includes("hbceBindExternalValidationClaimedState"));

assert.equal(index.index_semantics, "navigation_index_not_gate_pass_not_execution_evidence");
assert.equal(index.record_count, 16);
assert.deepEqual(index.records.map((record) => record.program_number), [174, 175, 176, 177, 178, 179, 180, 181, 182, 183, 184, 185, 186, 187, 188, 189]);

const r189 = index.records.find((record) => record.program_number === 189);
assert.ok(r189);
assert.equal(r189.gate_semantics, "structural_validation");
assert.equal(r189.evidence_class, "STRUCTURALLY_VALIDATED");
assert.equal(r189.execution_claimed, false);
assert.equal(r189.execution_trace_ref, null);
assert.equal(r189.claim_ceiling.maximum_claim, "STRUCTURALLY_VALIDATED_BANKING_PACK_READINESS_RECORDED_STATE");
assert.equal(r189.claim_ceiling.not_readiness_gate_pass, true);
assert.equal(r189.claim_ceiling.not_product_readiness, true);
assert.equal(r189.claim_ceiling.not_external_validation, true);
assert.equal(r189.claim_ceiling.not_certification, true);

assert.equal(latest.program_number, 189);
assert.equal(latest.readiness.banking_pack_ready, true);
assert.equal(latest.authority.external_validation_claimed, false);
assert.equal(latest.authority.certification_claimed, false);
assert.equal(latest.authority.legal_validity_claimed, false);
assert.equal(latest.authority.procurement_eligibility_claimed, false);

console.log("PLATFORM_LEVEL1_V1_2_TRACEABILITY_STATUS_SURFACE_TEST=PASS");
