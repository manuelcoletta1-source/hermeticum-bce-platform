"use strict";

const assert = require("assert/strict");
const {
  REASON,
  stateHash,
  directMutationAttempt,
  applyTransition,
  recomputeAfterInvalidation,
  reconcileProjection,
  replayVerification
} = require("../../runtime/shared-core/hbce-eg-001-state-transition-enforcement.js");

function baseProjection(state = "PENDING") {
  return {
    subject_ref: "release:HBCE-L1",
    state,
    state_version: 1,
    parent_state_hash: null
  };
}

function request(overrides = {}) {
  const previousProjection = overrides.previousProjection || baseProjection();
  return {
    request_id: overrides.request_id || "tr-001",
    subject_ref: previousProjection.subject_ref,
    from: overrides.from || previousProjection.state,
    to: overrides.to || "PASS",
    requested_by: overrides.requested_by || { actor_ref: "manuel:IPR-3", class: "HUMAN_AUTHORITY" },
    policy_ref: overrides.policy_ref || { id: "HBCE-EG-001", version: "V1.4-R1" },
    evidence_refs: overrides.evidence_refs === undefined ? ["evidence:valid-runtime-artifact"] : overrides.evidence_refs,
    expected_parent_state_hash: overrides.expected_parent_state_hash || stateHash(previousProjection),
    state_version: overrides.state_version === undefined ? previousProjection.state_version : overrides.state_version,
    created_at: overrides.created_at || "2026-09-30T17:56:00+02:00"
  };
}

function validContext(previousProjection = baseProjection()) {
  return {
    previousProjection,
    authority_authorized: true,
    policy_satisfied: true,
    evidence_integrity_valid: true,
    required_evidence_invalidated: false,
    required_controls_complete: true,
    internal_evidence_closure_closed: true,
    c16_pass: true,
    validator_independence_satisfied: true,
    baseline_digest_matches: true,
    release_clean_eligible: true,
    externally_validated: true,
    explicit_human_acceptance: true
  };
}

// EG-T01 Direct PENDING -> PASS write.
{
  const event = directMutationAttempt({
    subject_ref: "release:HBCE-L1",
    attempted_state: "PASS",
    previousProjection: baseProjection(),
    actor_ref: "admin:manual-edit",
    policy_ref: { id: "HBCE-EG-001", version: "V1.4-R1" },
    created_at: "2026-09-30T17:56:00+02:00"
  });

  assert.equal(event.event_type, "REJECTED_TRANSITION");
  assert.deepEqual(event.reason_codes, [REASON.DIRECT_PROTECTED_STATE_MUTATION]);
  assert.equal(event.previous_valid_state_preserved, true);
}

// EG-T02 PASS without evidence_ref.
{
  const previousProjection = baseProjection();
  const result = applyTransition(request({ previousProjection, evidence_refs: [] }), validContext(previousProjection));
  assert.equal(result.decision_record.decision, "UNVERIFIED");
  assert.ok(result.rejected_transition_event.reason_codes.includes(REASON.MISSING_REQUIRED_EVIDENCE));
  assert.equal(result.state_projection.state, "PENDING");
}

// EG-T03 Evidence hash mismatch.
{
  const previousProjection = baseProjection();
  const result = applyTransition(request({ previousProjection }), { ...validContext(previousProjection), evidence_integrity_valid: false });
  assert.equal(result.decision_record.decision, "REJECT");
  assert.ok(result.rejected_transition_event.reason_codes.includes(REASON.EVIDENCE_HASH_MISMATCH));
}

// EG-T04 CLOSED with mandatory C01-C15 missing.
{
  const previousProjection = baseProjection("PASS");
  const result = applyTransition(request({ previousProjection, to: "CLOSED" }), { ...validContext(previousProjection), required_controls_complete: false });
  assert.equal(result.decision_record.decision, "UNVERIFIED");
  assert.ok(result.rejected_transition_event.reason_codes.includes(REASON.MISSING_REQUIRED_EVIDENCE));
}

// EG-T05 RELEASE_CLEAN_ELIGIBLE without internal closure.
{
  const previousProjection = baseProjection("CLOSED");
  const result = applyTransition(request({ previousProjection, to: "RELEASE_CLEAN_ELIGIBLE" }), { ...validContext(previousProjection), internal_evidence_closure_closed: false });
  assert.equal(result.decision_record.decision, "BLOCK");
  assert.ok(result.rejected_transition_event.reason_codes.includes(REASON.POLICY_NOT_SATISFIED));
}

// EG-T06 EXTERNALLY_VALIDATED without C16.
{
  const previousProjection = baseProjection("RELEASE_CLEAN_ELIGIBLE");
  const result = applyTransition(request({ previousProjection, to: "EXTERNALLY_VALIDATED" }), { ...validContext(previousProjection), c16_pass: false });
  assert.equal(result.decision_record.decision, "REJECT");
  assert.ok(result.rejected_transition_event.reason_codes.includes(REASON.EXTERNAL_VALIDATION_MISSING));
}

// EG-T07 LEVEL_4_ELIGIBLE without explicit human acceptance.
{
  const previousProjection = baseProjection("EXTERNALLY_VALIDATED");
  const result = applyTransition(request({ previousProjection, to: "LEVEL_4_ELIGIBLE" }), { ...validContext(previousProjection), explicit_human_acceptance: false });
  assert.equal(result.decision_record.decision, "REJECT");
  assert.ok(result.rejected_transition_event.reason_codes.includes(REASON.HUMAN_ACCEPTANCE_MISSING));
}

// EG-T08 C16 baseline digest differs from current baseline.
{
  const previousProjection = baseProjection("RELEASE_CLEAN_ELIGIBLE");
  const result = applyTransition(request({ previousProjection, to: "EXTERNALLY_VALIDATED" }), { ...validContext(previousProjection), baseline_digest_matches: false });
  assert.equal(result.decision_record.decision, "REJECT");
  assert.ok(result.rejected_transition_event.reason_codes.includes(REASON.BASELINE_MISMATCH));
}

// EG-T09 stale predecessor/state_version.
{
  const previousProjection = baseProjection();
  const result = applyTransition(request({ previousProjection, state_version: 0 }), validContext(previousProjection));
  assert.equal(result.decision_record.decision, "REJECT");
  assert.ok(result.rejected_transition_event.reason_codes.includes(REASON.STALE_PREDECESSOR));
}

// EG-T10 same transition request replayed.
{
  const previousProjection = baseProjection();
  const first = applyTransition(request({ previousProjection, request_id: "tr-010" }), validContext(previousProjection));
  const second = applyTransition(request({ previousProjection, request_id: "tr-010" }), { ...validContext(previousProjection), existingEvents: [first.transition_event] });
  assert.equal(first.transition_event.event_type, "TransitionEvent");
  assert.equal(second.idempotent, true);
  assert.equal(second.transition_event, null);
  assert.equal(second.state_projection.state, "PASS");
}

// EG-T11 valid transition with complete evidence.
{
  const previousProjection = baseProjection();
  const result = applyTransition(request({ previousProjection, request_id: "tr-011" }), validContext(previousProjection));
  assert.equal(result.decision_record.decision, "ALLOW");
  assert.equal(result.transition_event.event_type, "TransitionEvent");
  assert.equal(result.state_projection.state, "PASS");
  assert.equal(result.rejected_transition_event, null);
}

// EG-T12 required evidence invalidated after PASS.
{
  const passProjection = { ...baseProjection("PASS"), state_version: 2 };
  const recomputed = recomputeAfterInvalidation({
    previousProjection: passProjection,
    invalidated_evidence_ref: "evidence:valid-runtime-artifact"
  });
  assert.equal(recomputed.historical_state, "PASS");
  assert.equal(recomputed.effective_state, "UNVERIFIED");
  assert.equal(recomputed.history_preserved, true);
}

// EG-T13 replay authoritative event log.
{
  const previousProjection = baseProjection();
  const first = applyTransition(request({ previousProjection, request_id: "tr-013" }), validContext(previousProjection));
  const replay = replayVerification(previousProjection, [first.transition_event], first.state_projection);
  assert.equal(replay.expected_projection_match, true);
  assert.equal(replay.derived_state, "PASS");
}

// EG-T14 manual mutation of cached projection.
{
  const authoritative = { ...baseProjection("PASS"), state_version: 2 };
  const cached = { ...authoritative, state: "LEVEL_4_ELIGIBLE" };
  const reconciliation = reconcileProjection({ cachedProjection: cached, authoritativeProjection: authoritative });
  assert.equal(reconciliation.anomaly_detected, true);
  assert.ok(reconciliation.reason_codes.includes(REASON.REPLAY_MISMATCH));
  assert.equal(reconciliation.restored_projection.state, "PASS");
}

// EG-T15 rejected mutation attempt evidence event emitted.
{
  const previousProjection = baseProjection("CLOSED");
  const event = directMutationAttempt({
    subject_ref: "release:HBCE-L1",
    attempted_state: "LEVEL_4_ELIGIBLE",
    previousProjection,
    actor_ref: "sql:manual-update",
    policy_ref: { id: "HBCE-EG-001", version: "V1.4-R1" },
    created_at: "2026-09-30T17:56:00+02:00"
  });
  assert.equal(event.event_type, "REJECTED_TRANSITION");
  assert.equal(event.previous_valid_state, "CLOSED");
  assert.equal(event.previous_valid_state_preserved, true);
}

console.log("PROG_197_HBCE_EG_001_SHARED_CORE_GOVERNED_TRANSITION_PATH_TEST=PASS");
