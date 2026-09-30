const fs = require("fs");
const assert = require("assert/strict");

const html = fs.readFileSync("index.html", "utf8");
const asset = fs.readFileSync("assets/level1-traceability-status.js", "utf8");
const index = JSON.parse(fs.readFileSync("docs/launch/traceability/index.json", "utf8"));
const latest = JSON.parse(fs.readFileSync("docs/launch/level1/prog-191-level1-public-surface-observation-human-action-completion-recovery-decision-recovery-execution-independent-external-validation-review.json", "utf8"));

assert.ok(html.includes('id="level1-traceability-status"'));
assert.ok(html.includes('./docs/launch/level1/prog-191-level1-public-surface-observation-human-action-completion-recovery-decision-recovery-execution-independent-external-validation-review.json'));
assert.ok(html.includes("PROG-191"));
assert.ok(html.includes("STRUCTURALLY_VALIDATED_INDEPENDENT_EXTERNAL_VALIDATION_REVIEW_REGISTERED_STATE"));
assert.ok(html.includes("INDEPENDENT_EXTERNAL_VALIDATION_REVIEW_REGISTERED_PENDING_REVIEW_OUTCOME"));

assert.ok(html.includes("production_ready: <span data-level1-production-ready>true</span>"));
assert.ok(html.includes("level1_launch_ready: <span data-level1-launch-ready>true</span>"));
assert.ok(html.includes("external_customer_ready: <span data-level1-external-customer-ready>true</span>"));
assert.ok(html.includes("banking_pack_ready: <span data-level1-banking-pack-ready>true</span>"));
assert.ok(html.includes("external_validation_package_requested: <span data-level1-external-validation-package-requested>true</span>"));
assert.ok(html.includes("external_validation_review_registered: <span data-level1-external-validation-review-registered>true</span>"));
assert.ok(html.includes("external_validation_claimed: <span data-level1-external-validation-claimed>false</span>"));

assert.ok(html.includes("not execution evidence"));
assert.ok(html.includes("not certification"));
assert.ok(html.includes("not legal validity"));
assert.ok(html.includes("not procurement eligibility"));

assert.ok(asset.includes("data-level1-external-validation-review-registered"));
assert.ok(asset.includes("external_validation_review_registered"));
assert.ok(asset.includes("hbceBindExternalValidationReviewRegisteredState"));

assert.equal(index.index_semantics, "navigation_index_not_gate_pass_not_execution_evidence");
assert.equal(index.record_count, 18);
assert.deepEqual(index.records.map((record) => record.program_number), [174, 175, 176, 177, 178, 179, 180, 181, 182, 183, 184, 185, 186, 187, 188, 189, 190, 191]);

const r191 = index.records.find((record) => record.program_number === 191);
assert.ok(r191);
assert.equal(r191.gate_semantics, "structural_validation");
assert.equal(r191.evidence_class, "STRUCTURALLY_VALIDATED");
assert.equal(r191.execution_claimed, false);
assert.equal(r191.execution_trace_ref, null);
assert.equal(r191.claim_ceiling.maximum_claim, "STRUCTURALLY_VALIDATED_INDEPENDENT_EXTERNAL_VALIDATION_REVIEW_REGISTERED_STATE");
assert.equal(r191.claim_ceiling.not_readiness_gate_pass, true);
assert.equal(r191.claim_ceiling.not_product_readiness, true);
assert.equal(r191.claim_ceiling.not_external_validation_acceptance, true);
assert.equal(r191.claim_ceiling.not_external_validation_outcome, true);
assert.equal(r191.claim_ceiling.not_certification, true);

assert.equal(latest.program_number, 191);
assert.equal(latest.readiness_remediation_execution.external_validation_review_registered, true);
assert.equal(latest.readiness_remediation_execution.external_validation_review_completed, false);
assert.equal(latest.readiness_remediation_execution.external_validation_review_outcome_recorded, false);
assert.equal(latest.external_validation_package.independent_review_registered, true);
assert.equal(latest.external_validation_package.independent_review_completed, false);
assert.equal(latest.external_validation_package.review_outcome_recorded, false);
assert.equal(latest.independent_external_validation_review.registered, true);
assert.equal(latest.independent_external_validation_review.review_completed, false);
assert.equal(latest.independent_external_validation_review.review_outcome_recorded, false);
assert.equal(latest.authority.external_validation_claimed, false);
assert.equal(latest.authority.certification_claimed, false);
assert.equal(latest.authority.legal_validity_claimed, false);
assert.equal(latest.authority.procurement_eligibility_claimed, false);

console.log("PLATFORM_LEVEL1_V1_2_TRACEABILITY_STATUS_SURFACE_TEST=PASS");
