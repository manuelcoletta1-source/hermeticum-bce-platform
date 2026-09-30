const fs = require("fs");
const assert = require("assert/strict");

const html = fs.readFileSync("index.html", "utf8");
const asset = fs.readFileSync("assets/level1-traceability-status.js", "utf8");
const index = JSON.parse(fs.readFileSync("docs/launch/traceability/index.json", "utf8"));
const latest = JSON.parse(fs.readFileSync("docs/launch/level1/prog-179-level1-public-surface-observation-human-action-completion-recovery-decision-recovery-execution-readiness-remediation-execution-physical-effect-evidence-validation.json", "utf8"));

assert.ok(html.includes('id="level1-traceability-status"'));
assert.ok(html.includes('./docs/launch/level1/prog-179-level1-public-surface-observation-human-action-completion-recovery-decision-recovery-execution-readiness-remediation-execution-physical-effect-evidence-validation.json'));
assert.ok(html.includes("PROG-179"));
assert.ok(html.includes("STRUCTURALLY_VALIDATED_PHYSICAL_EFFECT_EVIDENCE_VALIDATED_STATE"));
assert.ok(html.includes("PHYSICAL_EFFECT_EVIDENCE_VALIDATED_PENDING_PHYSICAL_EFFECT_PROOF"));

assert.ok(html.includes("physical_effect_evidence_received: <span data-level1-physical-effect-evidence-received>true</span>"));
assert.ok(html.includes("physical_effect_evidence_validated: <span data-level1-physical-effect-evidence-validated>true</span>"));
assert.ok(html.includes("physical_effect_proven: <span data-level1-physical-effect-proven>false</span>"));

assert.ok(html.includes("not execution evidence"));
assert.ok(html.includes("not physical-effect proof"));
assert.ok(html.includes("not launch readiness"));
assert.ok(html.includes("not certification"));
assert.ok(html.includes("not legal validity"));
assert.ok(html.includes("not procurement eligibility"));

assert.ok(asset.includes("data-level1-physical-effect-evidence-received"));
assert.ok(asset.includes("physical_effect_evidence_received"));
assert.ok(asset.includes("data-level1-physical-effect-evidence-validated"));
assert.ok(asset.includes("physical_effect_evidence_validated"));

assert.equal(index.record_count, 6);
assert.deepEqual(index.records.map((record) => record.program_number), [174, 175, 176, 177, 178, 179]);

const r179 = index.records.find((record) => record.program_number === 179);
assert.ok(r179);
assert.equal(r179.gate_semantics, "structural_validation");
assert.equal(r179.evidence_class, "STRUCTURALLY_VALIDATED");
assert.equal(r179.execution_claimed, false);
assert.equal(r179.execution_trace_ref, null);
assert.equal(r179.claim_ceiling.maximum_claim, "STRUCTURALLY_VALIDATED_PHYSICAL_EFFECT_EVIDENCE_VALIDATED_STATE");
assert.equal(r179.claim_ceiling.not_physical_effect_evidence, false);
assert.equal(r179.claim_ceiling.not_readiness_gate_pass, true);

assert.equal(latest.program_number, 179);
assert.equal(latest.readiness.production_ready, false);
assert.equal(latest.readiness_remediation_execution_physical_effect_evidence.received, true);
assert.equal(latest.readiness_remediation_execution_physical_effect_evidence.validated, true);
assert.equal(latest.readiness_remediation_execution_physical_effect_evidence.proven, false);
assert.equal(latest.readiness_remediation_execution.physical_effect_evidence_validated, true);
assert.equal(latest.readiness_remediation_execution.physical_effect_proven, false);

console.log("PLATFORM_LEVEL1_V1_2_TRACEABILITY_STATUS_SURFACE_TEST=PASS");
