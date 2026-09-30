const fs = require("fs");
const assert = require("assert/strict");

const html = fs.readFileSync("index.html", "utf8");
const asset = fs.readFileSync("assets/level1-traceability-status.js", "utf8");
const index = JSON.parse(fs.readFileSync("docs/launch/traceability/index.json", "utf8"));
const latest = JSON.parse(fs.readFileSync("docs/launch/level1/prog-194-level1-public-surface-observation-human-action-completion-recovery-decision-recovery-execution-reviewer-identity-independence-evidence-verification.json", "utf8"));

assert.ok(html.includes('id="level1-traceability-status"'));
assert.ok(html.includes('./docs/launch/level1/prog-194-level1-public-surface-observation-human-action-completion-recovery-decision-recovery-execution-reviewer-identity-independence-evidence-verification.json'));
assert.ok(html.includes("PROG-194"));
assert.ok(html.includes("STRUCTURALLY_VALIDATED_REVIEWER_IDENTITY_INDEPENDENCE_EVIDENCE_VERIFIED_STATE"));
assert.ok(html.includes("REVIEWER_IDENTITY_INDEPENDENCE_EVIDENCE_VERIFIED_PENDING_INDEPENDENT_REVIEW_COMPLETION"));

assert.ok(html.includes("reviewer_identity_confirmed: <span data-level1-reviewer-identity-confirmed>true</span>"));
assert.ok(html.includes("reviewer_independence_verified: <span data-level1-reviewer-independence-verified>true</span>"));
assert.ok(html.includes("reviewer_evidence_verification_completed: <span data-level1-reviewer-evidence-verification-completed>true</span>"));
assert.ok(html.includes("external_validation_accepted: <span data-level1-external-validation-accepted>false</span>"));
assert.ok(html.includes("external_validation_claimed: <span data-level1-external-validation-claimed>false</span>"));

assert.ok(asset.includes("data-level1-reviewer-identity-confirmed"));
assert.ok(asset.includes("reviewer_identity_confirmed"));
assert.ok(asset.includes("hbceBindReviewerIdentityConfirmedState"));
assert.ok(asset.includes("data-level1-reviewer-independence-verified"));
assert.ok(asset.includes("reviewer_independence_verified"));
assert.ok(asset.includes("hbceBindReviewerIndependenceVerifiedState"));
assert.ok(asset.includes("data-level1-reviewer-evidence-verification-completed"));
assert.ok(asset.includes("reviewer_evidence_verification_completed"));
assert.ok(asset.includes("hbceBindReviewerEvidenceVerificationCompletedState"));

assert.equal(index.index_semantics, "navigation_index_not_gate_pass_not_execution_evidence");
assert.equal(index.record_count, 21);
assert.deepEqual(index.records.map((record) => record.program_number), [174, 175, 176, 177, 178, 179, 180, 181, 182, 183, 184, 185, 186, 187, 188, 189, 190, 191, 192, 193, 194]);

const r194 = index.records.find((record) => record.program_number === 194);
assert.ok(r194);
assert.equal(r194.gate_semantics, "structural_validation");
assert.equal(r194.evidence_class, "STRUCTURALLY_VALIDATED");
assert.equal(r194.execution_claimed, false);
assert.equal(r194.execution_trace_ref, null);
assert.equal(r194.claim_ceiling.maximum_claim, "STRUCTURALLY_VALIDATED_REVIEWER_IDENTITY_INDEPENDENCE_EVIDENCE_VERIFIED_STATE");
assert.equal(r194.claim_ceiling.not_independent_review_completion, true);
assert.equal(r194.claim_ceiling.not_external_validation_acceptance, true);
assert.equal(r194.claim_ceiling.not_certification, true);

assert.equal(latest.program_number, 194);
assert.equal(latest.readiness_remediation_execution.reviewer_identity_confirmed, true);
assert.equal(latest.readiness_remediation_execution.reviewer_independence_verified, true);
assert.equal(latest.readiness_remediation_execution.reviewer_evidence_verification_completed, true);
assert.equal(latest.readiness_remediation_execution.external_validation_accepted, false);
assert.equal(latest.reviewer_identity_independence_evidence.evidence_verification_completed, true);
assert.equal(latest.reviewer_identity_independence_evidence.independent_review_completed, false);
assert.equal(latest.authority.external_validation_claimed, false);
assert.equal(latest.authority.certification_claimed, false);
assert.equal(latest.authority.legal_validity_claimed, false);
assert.equal(latest.authority.procurement_eligibility_claimed, false);

console.log("PLATFORM_LEVEL1_V1_2_TRACEABILITY_STATUS_SURFACE_TEST=PASS");
