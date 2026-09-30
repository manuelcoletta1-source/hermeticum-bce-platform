const fs = require("fs");
const assert = require("assert/strict");

const html = fs.readFileSync("index.html", "utf8");
const asset = fs.readFileSync("assets/level1-traceability-status.js", "utf8");
const index = JSON.parse(fs.readFileSync("docs/launch/traceability/index.json", "utf8"));
const latest = JSON.parse(fs.readFileSync("docs/launch/level1/prog-196-level1-public-surface-observation-human-action-completion-recovery-decision-recovery-execution-external-validation-acceptance-decision.json", "utf8"));

assert.ok(html.includes('id="level1-traceability-status"'));
assert.ok(html.includes('./docs/launch/level1/prog-196-level1-public-surface-observation-human-action-completion-recovery-decision-recovery-execution-external-validation-acceptance-decision.json'));
assert.ok(html.includes("PROG-196"));
assert.ok(html.includes("STRUCTURALLY_VALIDATED_EXTERNAL_VALIDATION_ACCEPTANCE_DECISION_RECORDED_ACCEPTED_STATE"));
assert.ok(html.includes("EXTERNAL_VALIDATION_ACCEPTANCE_DECISION_RECORDED_ACCEPTED_PENDING_EXTERNAL_VALIDATION_CLAIM_RECORD"));

assert.ok(html.includes("external_validation_accepted: <span data-level1-external-validation-accepted>true</span>"));
assert.ok(html.includes("external_validation_acceptance_decision_recorded: <span data-level1-external-validation-acceptance-decision-recorded>true</span>"));
assert.ok(html.includes("external_validation_claim_recorded: <span data-level1-external-validation-claim-recorded>false</span>"));
assert.ok(html.includes("external_validation_claimed: <span data-level1-external-validation-claimed>false</span>"));

assert.ok(asset.includes("hbceBindExternalValidationAcceptanceDecisionRecordedState"));
assert.ok(asset.includes("hbceBindExternalValidationAcceptedState"));
assert.ok(asset.includes("hbceBindExternalValidationClaimRecordedState"));
assert.ok(asset.includes("hbceBindExternalValidationClaimedState"));

assert.equal(index.index_semantics, "navigation_index_not_gate_pass_not_execution_evidence");
assert.equal(index.record_count, 23);
assert.deepEqual(index.records.map((record) => record.program_number), [174, 175, 176, 177, 178, 179, 180, 181, 182, 183, 184, 185, 186, 187, 188, 189, 190, 191, 192, 193, 194, 195, 196]);

const r196 = index.records.find((record) => record.program_number === 196);
assert.ok(r196);
assert.equal(r196.gate_semantics, "structural_validation");
assert.equal(r196.evidence_class, "STRUCTURALLY_VALIDATED");
assert.equal(r196.execution_claimed, false);
assert.equal(r196.execution_trace_ref, null);
assert.equal(r196.claim_ceiling.maximum_claim, "STRUCTURALLY_VALIDATED_EXTERNAL_VALIDATION_ACCEPTANCE_DECISION_RECORDED_ACCEPTED_STATE");
assert.equal(r196.claim_ceiling.not_external_validation_claim_record, true);
assert.equal(r196.claim_ceiling.not_certification, true);

assert.equal(latest.program_number, 196);
assert.equal(latest.readiness_remediation_execution.external_validation_acceptance_decision_recorded, true);
assert.equal(latest.readiness_remediation_execution.external_validation_accepted, true);
assert.equal(latest.readiness_remediation_execution.external_validation_claim_recorded, false);
assert.equal(latest.external_validation_acceptance_decision.recorded, true);
assert.equal(latest.external_validation_acceptance_decision.accepted, true);
assert.equal(latest.external_validation_acceptance_decision.external_validation_claim_recorded, false);
assert.equal(latest.authority.external_validation_claimed, false);
assert.equal(latest.authority.certification_claimed, false);
assert.equal(latest.authority.legal_validity_claimed, false);
assert.equal(latest.authority.procurement_eligibility_claimed, false);

console.log("PLATFORM_LEVEL1_V1_2_TRACEABILITY_STATUS_SURFACE_TEST=PASS");
