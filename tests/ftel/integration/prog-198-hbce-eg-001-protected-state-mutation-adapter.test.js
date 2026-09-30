"use strict";

const assert = require("assert/strict");
const path = require("path");

const adapter = require(path.join(process.cwd(), "runtime/shared-core/hbce-eg-001-protected-state-mutation-adapter.js"));
const eg001 = require(path.join(process.cwd(), "runtime/shared-core/hbce-eg-001-state-transition-enforcement.js"));

function baseIntent(overrides = {}) {
  return {
    request_id: overrides.request_id || "adapter-tr-001",
    subject_ref: "release:HBCE-L1",
    current_state: overrides.current_state || "PENDING",
    current_state_version: overrides.current_state_version || 1,
    parent_state_hash: overrides.parent_state_hash || null,
    target_state: overrides.target_state || "PASS",
    actor_ref: overrides.actor_ref || "manuel:IPR-3",
    actor_class: overrides.actor_class || "HUMAN_AUTHORITY",
    policy_ref: overrides.policy_ref || { id: "HBCE-EG-001", version: "V1.4-R1" },
    evidence_refs: overrides.evidence_refs === undefined ? ["evidence:valid-runtime-artifact"] : overrides.evidence_refs,
    created_at: overrides.created_at || "2026-09-30T18:10:00+02:00",
    mode: overrides.mode || "GOVERNED_TRANSITION"
  };
}

function validContext(overrides = {}) {
  return {
    authority_authorized: overrides.authority_authorized === undefined ? true : overrides.authority_authorized,
    policy_satisfied: overrides.policy_satisfied === undefined ? true : overrides.policy_satisfied,
    evidence_integrity_valid: overrides.evidence_integrity_valid === undefined ? true : overrides.evidence_integrity_valid,
    required_evidence_invalidated: overrides.required_evidence_invalidated === undefined ? false : overrides.required_evidence_invalidated,
    required_controls_complete: overrides.required_controls_complete === undefined ? true : overrides.required_controls_complete,
    internal_evidence_closure_closed: overrides.internal_evidence_closure_closed === undefined ? true : overrides.internal_evidence_closure_closed,
    c16_pass: overrides.c16_pass === undefined ? true : overrides.c16_pass,
    validator_independence_satisfied: overrides.validator_independence_satisfied === undefined ? true : overrides.validator_independence_satisfied,
    baseline_digest_matches: overrides.baseline_digest_matches === undefined ? true : overrides.baseline_digest_matches,
    release_clean_eligible: overrides.release_clean_eligible === undefined ? true : overrides.release_clean_eligible,
    externally_validated: overrides.externally_validated === undefined ? true : overrides.externally_validated,
    explicit_human_acceptance: overrides.explicit_human_acceptance === undefined ? true : overrides.explicit_human_acceptance
  };
}

// ADAPTER-T01 direct protected PASS write is rejected.
{
  const result = adapter.guardedStateWriter(baseIntent({ mode: "DIRECT_WRITE", target_state: "PASS" }), validContext());
  assert.equal(result.write_applied, false);
  assert.equal(result.route, "DIRECT_WRITE_REJECTED");
  assert.equal(result.protected_state, true);
  assert.equal(result.result.direct_mutation_rejected, true);
  assert.ok(result.result.reason_codes.includes("DIRECT_PROTECTED_STATE_MUTATION"));
}

// ADAPTER-T02 non-protected direct write is allowed.
{
  const result = adapter.guardedStateWriter(baseIntent({ mode: "DIRECT_WRITE", target_state: "DRAFT" }), validContext());
  assert.equal(result.write_applied, true);
  assert.equal(result.route, "NON_PROTECTED_DIRECT_WRITE_ALLOWED");
  assert.equal(result.protected_state, false);
}

// ADAPTER-T03 protected write without explicit governed mode is rejected.
{
  const intent = baseIntent({ target_state: "CLOSED" });
  delete intent.mode;
  const result = adapter.guardedStateWriter(intent, validContext());
  assert.equal(result.write_applied, false);
  assert.equal(result.route, "PROTECTED_STATE_REQUIRES_GOVERNED_TRANSITION");
  assert.ok(result.result.reason_codes.includes("DIRECT_PROTECTED_STATE_MUTATION"));
}

// ADAPTER-T04 valid governed transition to PASS succeeds.
{
  const result = adapter.guardedStateWriter(baseIntent({ mode: "GOVERNED_TRANSITION", target_state: "PASS" }), validContext());
  assert.equal(result.write_applied, true);
  assert.equal(result.route, "GOVERNED_TRANSITION");
  assert.equal(result.result.decision_record.decision, "ALLOW");
  assert.equal(result.result.state_projection.state, "PASS");
}

// ADAPTER-T05 governed transition with missing evidence is not applied.
{
  const result = adapter.guardedStateWriter(baseIntent({ mode: "GOVERNED_TRANSITION", target_state: "PASS", evidence_refs: [] }), validContext());
  assert.equal(result.write_applied, false);
  assert.equal(result.route, "GOVERNED_TRANSITION");
  assert.equal(result.result.decision_record.decision, "UNVERIFIED");
  assert.equal(result.result.state_projection.state, "PENDING");
}

// ADAPTER-T06 AI model cannot authorize protected transition.
{
  const result = adapter.guardedStateWriter(baseIntent({ mode: "GOVERNED_TRANSITION", actor_class: "AI_MODEL" }), validContext());
  assert.equal(result.write_applied, false);
  assert.equal(result.result.decision_record.decision, "REJECT");
  assert.ok(result.result.decision_record.reason_codes.includes("AUTHORITY_NOT_AUTHORIZED"));
}

// ADAPTER-T07 EXTERNALLY_VALIDATED requires C16.
{
  const result = adapter.guardedStateWriter(
    baseIntent({ mode: "GOVERNED_TRANSITION", current_state: "RELEASE_CLEAN_ELIGIBLE", target_state: "EXTERNALLY_VALIDATED" }),
    validContext({ c16_pass: false })
  );
  assert.equal(result.write_applied, false);
  assert.ok(result.result.decision_record.reason_codes.includes("EXTERNAL_VALIDATION_MISSING"));
}

// ADAPTER-T08 LEVEL_4_ELIGIBLE requires explicit human acceptance.
{
  const result = adapter.guardedStateWriter(
    baseIntent({ mode: "GOVERNED_TRANSITION", current_state: "EXTERNALLY_VALIDATED", target_state: "LEVEL_4_ELIGIBLE" }),
    validContext({ explicit_human_acceptance: false })
  );
  assert.equal(result.write_applied, false);
  assert.ok(result.result.decision_record.reason_codes.includes("HUMAN_ACCEPTANCE_MISSING"));
}

// ADAPTER-T09 transition request binds predecessor hash.
{
  const built = adapter.transitionRequestFromMutationIntent(baseIntent({ current_state: "PENDING", current_state_version: 3 }));
  assert.equal(built.request.expected_parent_state_hash, eg001.stateHash(built.previousProjection));
  assert.equal(built.request.state_version, 3);
}

// ADAPTER-T10 adapter boundary does not claim legal/commercial authority.
{
  const boundary = adapter.adapterBoundaryRecord();
  assert.equal(boundary.direct_protected_state_write_allowed, false);
  assert.equal(boundary.governed_transition_required, true);
  assert.equal(boundary.creates_external_validation, false);
  assert.equal(boundary.creates_legal_validity, false);
  assert.equal(boundary.creates_certification, false);
  assert.equal(boundary.creates_procurement_eligibility, false);
  assert.equal(boundary.creates_level4, false);
}

console.log("PROG_198_HBCE_EG_001_PROTECTED_STATE_MUTATION_ADAPTER_TEST=PASS");
