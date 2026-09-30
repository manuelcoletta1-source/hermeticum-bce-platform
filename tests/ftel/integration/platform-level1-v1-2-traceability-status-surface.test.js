const fs = require("fs");
const assert = require("assert/strict");

const html = fs.readFileSync("index.html", "utf8");
const asset = fs.readFileSync("assets/level1-traceability-status.js", "utf8");
const index = JSON.parse(fs.readFileSync("docs/launch/traceability/index.json", "utf8"));
const latest = JSON.parse(fs.readFileSync("docs/launch/level1/prog-195-level1-public-surface-observation-human-action-completion-recovery-decision-recovery-execution-independent-review-completion.json", "utf8"));

assert.ok(html.includes('id="level1-traceability-status"'));
assert.ok(html.includes('./docs/launch/level1/prog-195-level1-public-surface-observation-human-action-completion-recovery-decision-recovery-execution-independent-review-completion.json'));
assert.ok(html.includes("PROG-195"));
assert.ok(html.includes("STRUCTURALLY_VALIDATED_INDEPENDENT_REVIEW_COMPLETED_STATE"));
assert.ok(html.includes("INDEPENDENT_REVIEW_COMPLETED_PENDING_EXTERNAL_VALIDATION_ACCEPTANCE_DECISION"));

assert.ok(html.includes("independent_review_completed: <span data-level1-independent-review-completed>true</span>"));
assert.ok(html.includes("external_validation_acceptance_decision_recorded: <span data-level1-external-validation-acceptance-decision-recorded>false</span>"));
assert.ok(html.includes("external_validation_accepted: <span data-level1-external-validation-accepted>false</span>"));
assert.ok(html.includes("external_validation_claimed: <span data-level1-external-validation-claimed>false</span>"));

assert.ok(asset.includes("data-level1-independent-review-completed"));
assert.ok(asset.includes("independent_review_completed"));
assert.ok(asset.includes("hbceBindIndependentReviewCompletedState"));
assert.ok(asset.includes("data-level1-external-validation-acceptance-decision-recorded"));
assert.ok(asset.includes("external_validation_acceptance_decision_recorded"));
assert.ok(asset.includes("hbceBindExternalValidationAcceptanceDecisionRecordedState"));

assert.equal(index.index_semantics, "navigation_index_not_gate_pass_not_execution_evidence");
assert.equal(index.record_count, 22);
assert.deepEqual(index.records.map((record) => record.program_number), [174, 175, 176, 177, 178, 179, 180, 181, 182, 183, 184, 185, 186, 187, 188, 189, 190, 191, 192, 193, 194, 195]);

const r195 = index.records.find((record) => record.program_number === 195);
assert.ok(r195);
assert.equal(r195.gate_semantics, "structural_validation");
assert.equal(r195.evidence_class, "STRUCTURALLY_VALIDATED");
assert.equal(r195.execution_claimed, false);
assert.equal(r195.execution_trace_ref, null);
assert.equal(r195.claim_ceiling.maximum_claim, "STRUCTURALLY_VALIDATED_INDEPENDENT_REVIEW_COMPLETED_STATE");
assert.equal(r195.claim_ceiling.not_external_validation_acceptance, true);
assert.equal(r195.claim_ceiling.not_certification, true);

assert.equal(latest.program_number, 195);
assert.equal(latest.readiness_remediation_execution.independent_review_completed, true);
assert.equal(latest.readiness_remediation_execution.external_validation_acceptance_decision_recorded, false);
assert.equal(latest.readiness_remediation_execution.external_validation_accepted, false);
assert.equal(latest.independent_review_completion.completed, true);
assert.equal(latest.independent_review_completion.external_validation_acceptance_decision_recorded, false);
assert.equal(latest.independent_review_completion.external_validation_accepted, false);
assert.equal(latest.authority.external_validation_claimed, false);
assert.equal(latest.authority.certification_claimed, false);
assert.equal(latest.authority.legal_validity_claimed, false);
assert.equal(latest.authority.procurement_eligibility_claimed, false);

console.log("PLATFORM_LEVEL1_V1_2_TRACEABILITY_STATUS_SURFACE_TEST=PASS");
