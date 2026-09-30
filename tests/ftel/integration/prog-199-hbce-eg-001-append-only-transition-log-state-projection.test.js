"use strict";

const assert = require("assert/strict");
const path = require("path");

const storeRuntime = require(path.join(process.cwd(), "runtime/shared-core/hbce-eg-001-append-only-transition-log.js"));

function context(overrides = {}) {
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

function intent(overrides = {}) {
  return {
    request_id: overrides.request_id || "store-tr-001",
    subject_ref: overrides.subject_ref || "release:HBCE-L1",
    target_state: overrides.target_state || "PASS",
    actor_ref: overrides.actor_ref || "manuel:IPR-3",
    actor_class: overrides.actor_class || "HUMAN_AUTHORITY",
    policy_ref: overrides.policy_ref || { id: "HBCE-EG-001", version: "V1.4-R1" },
    evidence_refs: overrides.evidence_refs === undefined ? ["evidence:valid-runtime-artifact"] : overrides.evidence_refs,
    created_at: overrides.created_at || "2026-09-30T18:35:00+02:00"
  };
}

// STORE-T01 empty store starts from initial projection.
{
  const store = storeRuntime.createEmptyStore({
    subject_ref: "release:HBCE-L1",
    initial_state: "PENDING",
    initial_state_version: 1
  });

  assert.equal(store.append_only, true);
  assert.equal(store.events.length, 0);
  assert.equal(store.rejected_events.length, 0);
  assert.equal(store.projection_cache.state, "PENDING");
}

// STORE-T02 governed transition appends TransitionEvent and updates projection from replay.
{
  const s0 = storeRuntime.createEmptyStore({ subject_ref: "release:HBCE-L1" });
  const r = storeRuntime.appendGovernedTransition(s0, intent({ request_id: "store-t02" }), context());

  assert.equal(r.appended, true);
  assert.equal(r.rejected, false);
  assert.equal(r.store.events.length, 1);
  assert.equal(r.store.rejected_events.length, 0);
  assert.equal(r.store.projection_cache.state, "PASS");

  const replay = storeRuntime.replayStore(r.store);
  assert.equal(replay.projection.state, "PASS");
  assert.equal(replay.cache_matches_replay, true);
}

// STORE-T03 missing evidence creates rejected evidence, not authoritative transition.
{
  const s0 = storeRuntime.createEmptyStore({ subject_ref: "release:HBCE-L1" });
  const r = storeRuntime.appendGovernedTransition(s0, intent({ request_id: "store-t03", evidence_refs: [] }), context());

  assert.equal(r.appended, false);
  assert.equal(r.rejected, true);
  assert.equal(r.store.events.length, 0);
  assert.equal(r.store.rejected_events.length, 1);
  assert.equal(r.store.projection_cache.state, "PENDING");
  assert.ok(r.reason_codes.includes("MISSING_REQUIRED_EVIDENCE"));
}

// STORE-T04 direct projection mutation is rejected and previous valid state preserved.
{
  const s0 = storeRuntime.createEmptyStore({ subject_ref: "release:HBCE-L1" });
  const r = storeRuntime.attemptDirectProjectionMutation(s0, {
    attempted_state: "LEVEL_4_ELIGIBLE",
    actor_ref: "admin:manual-projection-edit",
    policy_ref: { id: "HBCE-EG-001", version: "V1.4-R1" },
    created_at: "2026-09-30T18:35:00+02:00"
  });

  assert.equal(r.mutation_applied, false);
  assert.equal(r.rejected, true);
  assert.equal(r.store.events.length, 0);
  assert.equal(r.store.rejected_events.length, 1);
  assert.equal(r.store.projection_cache.state, "PENDING");
  assert.ok(r.reason_codes.includes("DIRECT_PROTECTED_STATE_MUTATION"));
  assert.equal(r.result.event.previous_valid_state_preserved, true);
}

// STORE-T05 projection cache is not authoritative; replay detects mutation and restores.
{
  const s0 = storeRuntime.createEmptyStore({ subject_ref: "release:HBCE-L1" });
  const r = storeRuntime.appendGovernedTransition(s0, intent({ request_id: "store-t05" }), context());

  const corrupted = {
    ...r.store,
    projection_cache: {
      ...r.store.projection_cache,
      state: "LEVEL_4_ELIGIBLE"
    }
  };

  const reconciliation = storeRuntime.reconcileProjectionCache(corrupted);

  assert.equal(reconciliation.anomaly_detected, true);
  assert.ok(reconciliation.reason_codes.includes("REPLAY_MISMATCH"));
  assert.equal(reconciliation.store.projection_cache.state, "PASS");
}

// STORE-T06 AI model transition is rejected and no TransitionEvent is appended.
{
  const s0 = storeRuntime.createEmptyStore({ subject_ref: "release:HBCE-L1" });
  const r = storeRuntime.appendGovernedTransition(
    s0,
    intent({ request_id: "store-t06", actor_ref: "joker-c2", actor_class: "AI_MODEL" }),
    context()
  );

  assert.equal(r.appended, false);
  assert.equal(r.rejected, true);
  assert.equal(r.store.events.length, 0);
  assert.equal(r.store.rejected_events.length, 1);
  assert.ok(r.reason_codes.includes("AUTHORITY_NOT_AUTHORIZED"));
}

// STORE-T07 subject mismatch is rejected before mutation.
{
  const s0 = storeRuntime.createEmptyStore({ subject_ref: "release:HBCE-L1" });
  const r = storeRuntime.appendGovernedTransition(s0, intent({ request_id: "store-t07", subject_ref: "release:OTHER" }), context());

  assert.equal(r.appended, false);
  assert.equal(r.rejected, true);
  assert.ok(r.reason_codes.includes("SUBJECT_REF_MISMATCH"));
  assert.equal(r.store.events.length, 0);
}

// STORE-T08 C16 missing blocks EXTERNALLY_VALIDATED.
{
  const s0 = storeRuntime.createEmptyStore({
    subject_ref: "release:HBCE-L1",
    initial_state: "RELEASE_CLEAN_ELIGIBLE",
    initial_state_version: 3
  });

  const r = storeRuntime.appendGovernedTransition(
    s0,
    intent({ request_id: "store-t08", target_state: "EXTERNALLY_VALIDATED" }),
    context({ c16_pass: false })
  );

  assert.equal(r.appended, false);
  assert.equal(r.rejected, true);
  assert.ok(r.reason_codes.includes("EXTERNAL_VALIDATION_MISSING"));
  assert.equal(r.store.projection_cache.state, "RELEASE_CLEAN_ELIGIBLE");
}

// STORE-T09 boundary record refuses authority inflation.
{
  const boundary = storeRuntime.storeBoundaryRecord();

  assert.equal(boundary.projection_cache_authoritative, false);
  assert.equal(boundary.direct_projection_mutation_allowed, false);
  assert.equal(boundary.rejected_transition_is_evidence, true);
  assert.equal(boundary.creates_external_validation, false);
  assert.equal(boundary.creates_legal_validity, false);
  assert.equal(boundary.creates_certification, false);
  assert.equal(boundary.creates_procurement_eligibility, false);
  assert.equal(boundary.creates_level4, false);
}

// STORE-T10 replay tracks rejected events separately from authoritative TransitionEvents.
{
  const s0 = storeRuntime.createEmptyStore({ subject_ref: "release:HBCE-L1" });
  const r1 = storeRuntime.appendGovernedTransition(s0, intent({ request_id: "store-t10-a", evidence_refs: [] }), context());
  const r2 = storeRuntime.appendGovernedTransition(r1.store, intent({ request_id: "store-t10-b" }), context());

  const replay = storeRuntime.replayStore(r2.store);

  assert.equal(r2.store.events.length, 1);
  assert.equal(r2.store.rejected_events.length, 1);
  assert.equal(replay.event_count, 1);
  assert.equal(replay.rejected_event_count, 1);
  assert.equal(replay.projection.state, "PASS");
  assert.equal(replay.cache_matches_replay, true);
}

console.log("PROG_199_HBCE_EG_001_APPEND_ONLY_TRANSITION_LOG_STATE_PROJECTION_TEST=PASS");
