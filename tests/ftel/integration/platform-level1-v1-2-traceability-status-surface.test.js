const fs = require("fs");
const assert = require("assert/strict");

const html = fs.readFileSync("index.html", "utf8");
const asset = fs.readFileSync("assets/level1-traceability-status.js", "utf8");
const index = JSON.parse(fs.readFileSync("docs/launch/traceability/index.json", "utf8"));
const latest = JSON.parse(fs.readFileSync("docs/launch/level1/prog-187-level1-public-surface-observation-human-action-completion-recovery-decision-recovery-execution-launch-readiness-record.json", "utf8"));

assert.ok(html.includes('id="level1-traceability-status"'));
assert.ok(html.includes('./docs/launch/level1/prog-187-level1-public-surface-observation-human-action-completion-recovery-decision-recovery-execution-launch-readiness-record.json'));
assert.ok(html.includes("PROG-187"));
assert.ok(html.includes("STRUCTURALLY_VALIDATED_LAUNCH_READINESS_RECORDED_STATE"));
assert.ok(html.includes("LAUNCH_READINESS_RECORDED_PENDING_EXTERNAL_CUSTOMER_READINESS"));

assert.ok(html.includes("readiness_gate_passed: <span data-level1-readiness-gate-passed>true</span>"));
assert.ok(html.includes("production_ready: <span data-level1-production-ready>true</span>"));
assert.ok(html.includes("level1_launch_ready: <span data-level1-launch-ready>true</span>"));
assert.ok(html.includes("external_customer_ready: <span data-level1-external-customer-ready>false</span>"));

assert.ok(html.includes("not execution evidence"));
assert.ok(html.includes("not launch readiness"));
assert.ok(html.includes("not certification"));
assert.ok(html.includes("not legal validity"));
assert.ok(html.includes("not procurement eligibility"));

assert.ok(asset.includes("data-level1-launch-ready"));
assert.ok(asset.includes("level1_launch_ready"));
assert.ok(asset.includes("hbceBindLevel1LaunchReadyState"));
assert.ok(asset.includes("data-level1-external-customer-ready"));
assert.ok(asset.includes("external_customer_ready"));
assert.ok(asset.includes("hbceBindExternalCustomerReadyState"));

assert.equal(index.index_semantics, "navigation_index_not_gate_pass_not_execution_evidence");
assert.equal(index.record_count, 14);
assert.deepEqual(index.records.map((record) => record.program_number), [174, 175, 176, 177, 178, 179, 180, 181, 182, 183, 184, 185, 186, 187]);

const r187 = index.records.find((record) => record.program_number === 187);
assert.ok(r187);
assert.equal(r187.gate_semantics, "structural_validation");
assert.equal(r187.evidence_class, "STRUCTURALLY_VALIDATED");
assert.equal(r187.execution_claimed, false);
assert.equal(r187.execution_trace_ref, null);
assert.equal(r187.claim_ceiling.maximum_claim, "STRUCTURALLY_VALIDATED_LAUNCH_READINESS_RECORDED_STATE");
assert.equal(r187.claim_ceiling.not_readiness_gate_pass, true);
assert.equal(r187.claim_ceiling.not_product_readiness, true);
assert.equal(r187.claim_ceiling.not_certification, true);

assert.equal(latest.program_number, 187);
assert.equal(latest.readiness_remediation_execution.production_readiness_recorded, true);
assert.equal(latest.readiness_remediation_execution.launch_readiness_recorded, true);
assert.equal(latest.readiness_remediation_execution.external_customer_readiness_recorded, false);

assert.equal(latest.recovery_execution.production_readiness_recorded, true);
assert.equal(latest.recovery_execution.launch_readiness_recorded, true);
assert.equal(latest.recovery_execution.external_customer_readiness_recorded, false);
assert.equal(latest.recovery_execution.pending, "EXTERNAL_CUSTOMER_READINESS_RECORD");

assert.equal(latest.readiness.production_ready, true);
assert.equal(latest.readiness.level1_launch_ready, true);
assert.equal(latest.readiness.external_customer_ready, false);
assert.equal(latest.readiness.banking_pack_ready, false);

assert.equal(latest.authority.ai_authority_allowed, false);
assert.equal(latest.authority.legal_validity_claimed, false);
assert.equal(latest.authority.accreditation_claimed, false);
assert.equal(latest.authority.procurement_eligibility_claimed, false);
assert.equal(latest.authority.certification_claimed, false);

console.log("PLATFORM_LEVEL1_V1_2_TRACEABILITY_STATUS_SURFACE_TEST=PASS");
