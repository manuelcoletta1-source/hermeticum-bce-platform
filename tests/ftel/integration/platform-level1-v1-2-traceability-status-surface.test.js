const fs = require("fs");
const assert = require("assert/strict");

const html = fs.readFileSync("index.html", "utf8");
const asset = fs.readFileSync("assets/level1-traceability-status.js", "utf8");
const index = JSON.parse(fs.readFileSync("docs/launch/traceability/index.json", "utf8"));
const latest = JSON.parse(fs.readFileSync("docs/launch/level1/prog-178-level1-public-surface-observation-human-action-completion-recovery-decision-recovery-execution-readiness-remediation-execution-physical-effect-evidence.json", "utf8"));

assert.ok(html.includes('id="level1-traceability-status"'));
assert.ok(html.includes('data-hbce-traceability-status'));
assert.ok(html.includes('./assets/level1-traceability-status.js'));
assert.ok(html.includes('./docs/launch/traceability/index.json'));
assert.ok(html.includes('./docs/launch/traceability/INDEX.md'));
assert.ok(html.includes('./docs/launch/level1/prog-178-level1-public-surface-observation-human-action-completion-recovery-decision-recovery-execution-readiness-remediation-execution-physical-effect-evidence.json'));

assert.ok(html.includes("PROG-178"));
assert.ok(html.includes("STRUCTURALLY_VALIDATED_PHYSICAL_EFFECT_EVIDENCE_RECEIVED_STATE"));
assert.ok(html.includes("LEVEL1_PUBLIC_SURFACE_OBSERVATION_HUMAN_ACTION_COMPLETION_RECOVERY_DECISION_RECOVERY_EXECUTION_READINESS_REMEDIATION_EXECUTION_PHYSICAL_EFFECT_EVIDENCE_RECEIVED_PENDING_VALIDATION"));

assert.ok(html.includes("not execution evidence"));
assert.ok(html.includes("not physical-effect proof"));
assert.ok(html.includes("not launch readiness"));
assert.ok(html.includes("not certification"));
assert.ok(html.includes("not legal validity"));
assert.ok(html.includes("not procurement eligibility"));

assert.ok(asset.includes("fetch(indexUrl"));
assert.ok(asset.includes("fetch(latestUrl"));
assert.ok(asset.includes("LIVE_INDEX_LOADED"));
assert.ok(asset.includes("FAIL_CLOSED_STATIC_FALLBACK"));

assert.equal(index.record_count, 5);
assert.deepEqual(index.records.map((record) => record.program_number), [174, 175, 176, 177, 178]);

const r178 = index.records.find((record) => record.program_number === 178);
assert.ok(r178);
assert.equal(r178.gate_semantics, "structural_validation");
assert.equal(r178.evidence_class, "STRUCTURALLY_VALIDATED");
assert.equal(r178.execution_claimed, false);
assert.equal(r178.execution_trace_ref, null);
assert.equal(r178.claim_ceiling.maximum_claim, "STRUCTURALLY_VALIDATED_PHYSICAL_EFFECT_EVIDENCE_RECEIVED_STATE");
assert.equal(r178.claim_ceiling.not_physical_effect_evidence, false);
assert.equal(r178.claim_ceiling.not_readiness_gate_pass, true);
assert.equal(r178.claim_ceiling.not_product_readiness, true);
assert.equal(r178.claim_ceiling.not_certification, true);
assert.equal(r178.claim_ceiling.not_legal_validity, true);
assert.equal(r178.claim_ceiling.not_procurement_eligibility, true);

assert.equal(latest.program_number, 178);
assert.equal(latest.readiness.production_ready, false);
assert.equal(latest.readiness_remediation_execution_physical_effect_evidence.received, true);
assert.equal(latest.readiness_remediation_execution_physical_effect_evidence.validated, false);
assert.equal(latest.readiness_remediation_execution.physical_effect_proven, false);

console.log("PLATFORM_LEVEL1_V1_2_TRACEABILITY_STATUS_SURFACE_TEST=PASS");
