const fs = require("fs");
const assert = require("assert/strict");

const html = fs.readFileSync("index.html", "utf8");
const asset = fs.readFileSync("assets/level1-traceability-status.js", "utf8");
const index = JSON.parse(fs.readFileSync("docs/launch/traceability/index.json", "utf8"));
const latest = JSON.parse(fs.readFileSync("docs/launch/level1/prog-182-level1-public-surface-observation-human-action-completion-recovery-decision-recovery-execution-readiness-gate-request-validation.json", "utf8"));

assert.ok(html.includes('id="level1-traceability-status"'));
assert.ok(html.includes('./docs/launch/level1/prog-182-level1-public-surface-observation-human-action-completion-recovery-decision-recovery-execution-readiness-gate-request-validation.json'));
assert.ok(html.includes("PROG-182"));
assert.ok(html.includes("STRUCTURALLY_VALIDATED_READINESS_GATE_REQUEST_VALIDATED_STATE"));
assert.ok(html.includes("READINESS_GATE_REQUEST_VALIDATED_PENDING_DECISION"));

assert.ok(html.includes("readiness_gate_requested: <span data-level1-readiness-gate-requested>true</span>"));
assert.ok(html.includes("readiness_gate_request_validated: <span data-level1-readiness-gate-request-validated>true</span>"));
assert.ok(html.includes("readiness_gate_passed: <span data-level1-readiness-gate-passed>false</span>"));

assert.ok(html.includes("not execution evidence"));
assert.ok(html.includes("not launch readiness"));
assert.ok(html.includes("not certification"));
assert.ok(html.includes("not legal validity"));
assert.ok(html.includes("not procurement eligibility"));

assert.ok(asset.includes("data-level1-readiness-gate-requested"));
assert.ok(asset.includes("readiness_gate_requested"));
assert.ok(asset.includes("data-level1-readiness-gate-request-validated"));
assert.ok(asset.includes("readiness_gate_request_validated"));
assert.ok(asset.includes("hbceBindReadinessGateRequestValidatedState"));

assert.equal(index.record_count, 9);
assert.deepEqual(index.records.map((record) => record.program_number), [174, 175, 176, 177, 178, 179, 180, 181, 182]);

const r182 = index.records.find((record) => record.program_number === 182);
assert.ok(r182);
assert.equal(r182.gate_semantics, "structural_validation");
assert.equal(r182.evidence_class, "STRUCTURALLY_VALIDATED");
assert.equal(r182.execution_claimed, false);
assert.equal(r182.execution_trace_ref, null);
assert.equal(r182.claim_ceiling.maximum_claim, "STRUCTURALLY_VALIDATED_READINESS_GATE_REQUEST_VALIDATED_STATE");
assert.equal(r182.claim_ceiling.not_readiness_gate_pass, true);
assert.equal(r182.claim_ceiling.not_product_readiness, true);

assert.equal(latest.program_number, 182);
assert.equal(latest.readiness.production_ready, false);
assert.equal(latest.readiness_remediation_execution.readiness_gate_requested, true);
assert.equal(latest.readiness_remediation_execution.readiness_gate_request_validated, true);
assert.equal(latest.readiness_remediation_execution.readiness_gate_decision_recorded, false);
assert.equal(latest.readiness_remediation_execution.readiness_gate_passed, false);
assert.equal(latest.readiness_gate_request.requested, true);
assert.equal(latest.readiness_gate_request.validated, true);
assert.equal(latest.readiness_gate_request.passed, false);
assert.equal(latest.readiness_gate_decision.recorded, false);
assert.equal(latest.readiness_gate_decision.passed, false);
assert.equal(latest.recovery_execution.readiness_gate_request_validated, true);
assert.equal(latest.recovery_execution.readiness_gate_passed, false);

console.log("PLATFORM_LEVEL1_V1_2_TRACEABILITY_STATUS_SURFACE_TEST=PASS");
