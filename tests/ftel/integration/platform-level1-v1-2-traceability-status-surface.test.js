const fs = require("fs");
const assert = require("assert/strict");

const html = fs.readFileSync("index.html", "utf8");
const asset = fs.readFileSync("assets/level1-traceability-status.js", "utf8");
const index = JSON.parse(fs.readFileSync("docs/launch/traceability/index.json", "utf8"));
const latest = JSON.parse(fs.readFileSync("docs/launch/level1/prog-185-level1-public-surface-observation-human-action-completion-recovery-decision-recovery-execution-readiness-gate-pass.json", "utf8"));

assert.ok(html.includes('id="level1-traceability-status"'));
assert.ok(html.includes('./docs/launch/level1/prog-185-level1-public-surface-observation-human-action-completion-recovery-decision-recovery-execution-readiness-gate-pass.json'));
assert.ok(html.includes("PROG-185"));
assert.ok(html.includes("STRUCTURALLY_VALIDATED_READINESS_GATE_PASSED_STATE"));
assert.ok(html.includes("READINESS_GATE_PASSED_PENDING_PRODUCTION_READINESS_RECORD"));

assert.ok(html.includes("readiness_gate_requested: <span data-level1-readiness-gate-requested>true</span>"));
assert.ok(html.includes("readiness_gate_request_validated: <span data-level1-readiness-gate-request-validated>true</span>"));
assert.ok(html.includes("readiness_gate_decision_recorded: <span data-level1-readiness-gate-decision-recorded>true</span>"));
assert.ok(html.includes("readiness_gate_decision_validated: <span data-level1-readiness-gate-decision-validated>true</span>"));
assert.ok(html.includes("readiness_gate_passed: <span data-level1-readiness-gate-passed>true</span>"));
assert.ok(html.includes("production_ready: <span data-level1-production-ready>false</span>"));

assert.ok(html.includes("not execution evidence"));
assert.ok(html.includes("not launch readiness"));
assert.ok(html.includes("not certification"));
assert.ok(html.includes("not legal validity"));
assert.ok(html.includes("not procurement eligibility"));

assert.ok(asset.includes("data-level1-readiness-gate-passed"));
assert.ok(asset.includes("readiness_gate_passed"));
assert.ok(asset.includes("hbceBindReadinessGatePassedState"));
assert.ok(asset.includes("data-level1-production-ready"));
assert.ok(asset.includes("production_ready"));
assert.ok(asset.includes("hbceBindProductionReadyState"));

assert.equal(index.record_count, 12);
assert.deepEqual(index.records.map((record) => record.program_number), [174, 175, 176, 177, 178, 179, 180, 181, 182, 183, 184, 185]);

const r185 = index.records.find((record) => record.program_number === 185);
assert.ok(r185);
assert.equal(r185.gate_semantics, "structural_validation");
assert.equal(r185.evidence_class, "STRUCTURALLY_VALIDATED");
assert.equal(r185.execution_claimed, false);
assert.equal(r185.execution_trace_ref, null);
assert.equal(r185.claim_ceiling.maximum_claim, "STRUCTURALLY_VALIDATED_READINESS_GATE_PASSED_STATE");
assert.equal(r185.claim_ceiling.not_readiness_gate_pass, true);
assert.equal(r185.claim_ceiling.not_product_readiness, true);
assert.equal(r185.claim_ceiling.not_certification, true);

assert.equal(latest.program_number, 185);
assert.equal(latest.readiness_remediation_execution.readiness_gate_passed, true);
assert.equal(latest.readiness_gate_decision.passed, true);
assert.equal(latest.recovery_execution.readiness_gate_passed, true);
assert.equal(latest.recovery_execution.pending, "PRODUCTION_READINESS_RECORD");

assert.equal(latest.readiness.external_customer_ready, false);
assert.equal(latest.readiness.banking_pack_ready, false);
assert.equal(latest.readiness.level1_launch_ready, false);
assert.equal(latest.readiness.production_ready, false);

assert.equal(latest.authority.ai_authority_allowed, false);
assert.equal(latest.authority.legal_validity_claimed, false);
assert.equal(latest.authority.accreditation_claimed, false);
assert.equal(latest.authority.procurement_eligibility_claimed, false);
assert.equal(latest.authority.certification_claimed, false);

console.log("PLATFORM_LEVEL1_V1_2_TRACEABILITY_STATUS_SURFACE_TEST=PASS");
