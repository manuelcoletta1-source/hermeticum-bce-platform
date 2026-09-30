const fs = require("fs");
const assert = require("assert/strict");

const html = fs.readFileSync("index.html", "utf8");
const asset = fs.readFileSync("assets/level1-traceability-status.js", "utf8");
const index = JSON.parse(fs.readFileSync("docs/launch/traceability/index.json", "utf8"));
const latest = JSON.parse(fs.readFileSync("docs/launch/level1/prog-184-level1-public-surface-observation-human-action-completion-recovery-decision-recovery-execution-readiness-gate-decision-validation.json", "utf8"));

assert.ok(html.includes('id="level1-traceability-status"'));
assert.ok(html.includes('./docs/launch/level1/prog-184-level1-public-surface-observation-human-action-completion-recovery-decision-recovery-execution-readiness-gate-decision-validation.json'));
assert.ok(html.includes("PROG-184"));
assert.ok(html.includes("STRUCTURALLY_VALIDATED_READINESS_GATE_DECISION_VALIDATED_STATE"));
assert.ok(html.includes("READINESS_GATE_DECISION_VALIDATED_PENDING_GATE_PASS"));

assert.ok(html.includes("readiness_gate_requested: <span data-level1-readiness-gate-requested>true</span>"));
assert.ok(html.includes("readiness_gate_request_validated: <span data-level1-readiness-gate-request-validated>true</span>"));
assert.ok(html.includes("readiness_gate_decision_recorded: <span data-level1-readiness-gate-decision-recorded>true</span>"));
assert.ok(html.includes("readiness_gate_decision_validated: <span data-level1-readiness-gate-decision-validated>true</span>"));
assert.ok(html.includes("readiness_gate_passed: <span data-level1-readiness-gate-passed>false</span>"));

assert.ok(html.includes("not execution evidence"));
assert.ok(html.includes("not launch readiness"));
assert.ok(html.includes("not certification"));
assert.ok(html.includes("not legal validity"));
assert.ok(html.includes("not procurement eligibility"));

assert.ok(asset.includes("data-level1-readiness-gate-decision-recorded"));
assert.ok(asset.includes("readiness_gate_decision_recorded"));
assert.ok(asset.includes("data-level1-readiness-gate-decision-validated"));
assert.ok(asset.includes("readiness_gate_decision_validated"));
assert.ok(asset.includes("hbceBindReadinessGateDecisionValidatedState"));

assert.equal(index.record_count, 11);
assert.deepEqual(index.records.map((record) => record.program_number), [174, 175, 176, 177, 178, 179, 180, 181, 182, 183, 184]);

const r184 = index.records.find((record) => record.program_number === 184);
assert.ok(r184);
assert.equal(r184.gate_semantics, "structural_validation");
assert.equal(r184.evidence_class, "STRUCTURALLY_VALIDATED");
assert.equal(r184.execution_claimed, false);
assert.equal(r184.execution_trace_ref, null);
assert.equal(r184.claim_ceiling.maximum_claim, "STRUCTURALLY_VALIDATED_READINESS_GATE_DECISION_VALIDATED_STATE");
assert.equal(r184.claim_ceiling.not_readiness_gate_pass, true);
assert.equal(r184.claim_ceiling.not_product_readiness, true);

assert.equal(latest.program_number, 184);
assert.equal(latest.readiness.production_ready, false);
assert.equal(latest.readiness_remediation_execution.readiness_gate_decision_recorded, true);
assert.equal(latest.readiness_remediation_execution.readiness_gate_decision_validated, true);
assert.equal(latest.readiness_remediation_execution.readiness_gate_passed, false);
assert.equal(latest.readiness_gate_decision.recorded, true);
assert.equal(latest.readiness_gate_decision.validated, true);
assert.equal(latest.readiness_gate_decision.passed, false);
assert.equal(latest.recovery_execution.readiness_gate_decision_validated, true);
assert.equal(latest.recovery_execution.readiness_gate_passed, false);

console.log("PLATFORM_LEVEL1_V1_2_TRACEABILITY_STATUS_SURFACE_TEST=PASS");
