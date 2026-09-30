const fs = require("fs");
const assert = require("assert/strict");

const html = fs.readFileSync("index.html", "utf8");
const asset = fs.readFileSync("assets/level1-traceability-status.js", "utf8");
const index = JSON.parse(fs.readFileSync("docs/launch/traceability/index.json", "utf8"));
const latest = JSON.parse(fs.readFileSync("docs/launch/level1/prog-193-level1-public-surface-observation-human-action-completion-recovery-decision-recovery-execution-reviewer-identity-independence-evidence-binding.json", "utf8"));

assert.ok(html.includes('id="level1-traceability-status"'));
assert.ok(html.includes('./docs/launch/level1/prog-193-level1-public-surface-observation-human-action-completion-recovery-decision-recovery-execution-reviewer-identity-independence-evidence-binding.json'));
assert.ok(html.includes("PROG-193"));
assert.ok(html.includes("STRUCTURALLY_VALIDATED_REVIEWER_IDENTITY_INDEPENDENCE_EVIDENCE_BOUND_STATE"));
assert.ok(html.includes("REVIEWER_IDENTITY_INDEPENDENCE_EVIDENCE_BOUND_PENDING_EVIDENCE_VERIFICATION"));

assert.ok(html.includes("reviewer_identity_evidence_bound: <span data-level1-reviewer-identity-evidence-bound>true</span>"));
assert.ok(html.includes("reviewer_independence_evidence_bound: <span data-level1-reviewer-independence-evidence-bound>true</span>"));
assert.ok(html.includes("external_validation_accepted: <span data-level1-external-validation-accepted>false</span>"));
assert.ok(html.includes("external_validation_claimed: <span data-level1-external-validation-claimed>false</span>"));

assert.ok(asset.includes("data-level1-reviewer-identity-evidence-bound"));
assert.ok(asset.includes("reviewer_identity_evidence_bound"));
assert.ok(asset.includes("hbceBindReviewerIdentityEvidenceBoundState"));
assert.ok(asset.includes("data-level1-reviewer-independence-evidence-bound"));
assert.ok(asset.includes("reviewer_independence_evidence_bound"));
assert.ok(asset.includes("hbceBindReviewerIndependenceEvidenceBoundState"));

assert.equal(index.index_semantics, "navigation_index_not_gate_pass_not_execution_evidence");
assert.equal(index.record_count, 20);
assert.deepEqual(index.records.map((record) => record.program_number), [174, 175, 176, 177, 178, 179, 180, 181, 182, 183, 184, 185, 186, 187, 188, 189, 190, 191, 192, 193]);

const r193 = index.records.find((record) => record.program_number === 193);
assert.ok(r193);
assert.equal(r193.gate_semantics, "structural_validation");
assert.equal(r193.evidence_class, "STRUCTURALLY_VALIDATED");
assert.equal(r193.execution_claimed, false);
assert.equal(r193.execution_trace_ref, null);
assert.equal(r193.claim_ceiling.maximum_claim, "STRUCTURALLY_VALIDATED_REVIEWER_IDENTITY_INDEPENDENCE_EVIDENCE_BOUND_STATE");
assert.equal(r193.claim_ceiling.not_evidence_verification, true);
assert.equal(r193.claim_ceiling.not_reviewer_identity_confirmation, true);
assert.equal(r193.claim_ceiling.not_reviewer_independence_verification, true);
assert.equal(r193.claim_ceiling.not_external_validation_acceptance, true);
assert.equal(r193.claim_ceiling.not_certification, true);

assert.equal(latest.program_number, 193);
assert.equal(latest.readiness_remediation_execution.reviewer_identity_evidence_bound, true);
assert.equal(latest.readiness_remediation_execution.reviewer_independence_evidence_bound, true);
assert.equal(latest.readiness_remediation_execution.reviewer_identity_confirmed, false);
assert.equal(latest.readiness_remediation_execution.reviewer_independence_verified, false);
assert.equal(latest.reviewer_identity_independence_evidence.binding_recorded, true);
assert.equal(latest.reviewer_identity_independence_evidence.evidence_verification_completed, false);
assert.equal(latest.authority.external_validation_claimed, false);
assert.equal(latest.authority.certification_claimed, false);
assert.equal(latest.authority.legal_validity_claimed, false);
assert.equal(latest.authority.procurement_eligibility_claimed, false);

console.log("PLATFORM_LEVEL1_V1_2_TRACEABILITY_STATUS_SURFACE_TEST=PASS");
