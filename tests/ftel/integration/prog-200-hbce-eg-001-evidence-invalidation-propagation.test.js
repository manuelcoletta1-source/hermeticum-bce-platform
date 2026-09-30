"use strict";

const assert = require("assert/strict");
const path = require("path");

const storeRuntime = require(path.join(process.cwd(), "runtime/shared-core/hbce-eg-001-append-only-transition-log.js"));
const invalidation = require(path.join(process.cwd(), "runtime/shared-core/hbce-eg-001-evidence-invalidation-propagation.js"));

function context() {
  return {
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

function intent(overrides = {}) {
  return {
    request_id: overrides.request_id || "inv-tr-001",
    subject_ref: "release:HBCE-L1",
    target_state: overrides.target_state || "PASS",
    actor_ref: "manuel:IPR-3",
    actor_class: "HUMAN_AUTHORITY",
    policy_ref: { id: "HBCE-EG-001", version: "V1.4-R1" },
    evidence_refs: overrides.evidence_refs === undefined ? ["evidence:valid-runtime-artifact"] : overrides.evidence_refs,
    created_at: "2026-09-30T18:55:00+02:00"
  };
}

// INV-T01 creates content-bound EvidenceInvalidationEvent.
{
  const ev = invalidation.createEvidenceInvalidationEvent({
    invalidation_id: "inv-001",
    evidence_ref: "evidence:valid-runtime-artifact",
    source_ref: "review:manual",
    reason_code: "EVIDENCE_REVOKED",
    created_at: "2026-09-30T18:55:00+02:00"
  });

  assert.equal(ev.event_type, "EvidenceInvalidationEvent");
  assert.equal(ev.evidence_ref, "evidence:valid-runtime-artifact");
  assert.equal(ev.reason_code, "EVIDENCE_REVOKED");
  assert.ok(ev.event_sha256);
}

// INV-T02 affected transition is found through bound DecisionRecord evidence refs.
{
  const s0 = storeRuntime.createEmptyStore({ subject_ref: "release:HBCE-L1" });
  const accepted = storeRuntime.appendGovernedTransition(s0, intent({ request_id: "inv-t02" }), context());
  const decision = accepted.result.result.decision_record;
  const event = accepted.result.result.transition_event;
  const boundStore = invalidation.bindStoreEventsWithDecisionRecords(accepted.store, [decision]);

  assert.equal(boundStore.events[0].event_sha256, event.event_sha256);
  assert.deepEqual(boundStore.events[0].evidence_refs, ["evidence:valid-runtime-artifact"]);

  const ev = invalidation.createEvidenceInvalidationEvent({
    invalidation_id: "inv-t02",
    evidence_ref: "evidence:valid-runtime-artifact",
    source_ref: "review:manual",
    reason_code: "EVIDENCE_REVOKED",
    created_at: "2026-09-30T18:55:00+02:00"
  });

  const affected = invalidation.findAffectedTransitions(boundStore, ev, [decision]);

  assert.equal(affected.length, 1);
  assert.equal(affected[0].request_id, "inv-t02");
  assert.equal(affected[0].to, "PASS");
}

// INV-T03 invalidated evidence preserves historical PASS but recomputes effective state to UNVERIFIED.
{
  const s0 = storeRuntime.createEmptyStore({ subject_ref: "release:HBCE-L1" });
  const accepted = storeRuntime.appendGovernedTransition(s0, intent({ request_id: "inv-t03" }), context());
  const decision = accepted.result.result.decision_record;
  const boundStore = invalidation.bindStoreEventsWithDecisionRecords(accepted.store, [decision]);

  const ev = invalidation.createEvidenceInvalidationEvent({
    invalidation_id: "inv-t03",
    evidence_ref: "evidence:valid-runtime-artifact",
    source_ref: "review:manual",
    reason_code: "EVIDENCE_REVOKED",
    created_at: "2026-09-30T18:55:00+02:00"
  });

  const result = invalidation.invalidateEvidenceAndRecompute({
    store: boundStore,
    invalidation_event: ev,
    decision_records: [decision]
  });

  assert.equal(result.invalidated, true);
  assert.equal(result.propagation_record.historical_state, "PASS");
  assert.equal(result.propagation_record.effective_state, "UNVERIFIED");
  assert.equal(result.propagation_record.history_preserved, true);
  assert.equal(result.store.effective_projection.historical_state, "PASS");
  assert.equal(result.store.effective_projection.effective_state, "UNVERIFIED");
}

// INV-T04 unrelated evidence invalidation does not change effective state.
{
  const s0 = storeRuntime.createEmptyStore({ subject_ref: "release:HBCE-L1" });
  const accepted = storeRuntime.appendGovernedTransition(s0, intent({ request_id: "inv-t04" }), context());
  const decision = accepted.result.result.decision_record;
  const boundStore = invalidation.bindStoreEventsWithDecisionRecords(accepted.store, [decision]);

  const ev = invalidation.createEvidenceInvalidationEvent({
    invalidation_id: "inv-t04",
    evidence_ref: "evidence:other",
    source_ref: "review:manual",
    reason_code: "EVIDENCE_REVOKED",
    created_at: "2026-09-30T18:55:00+02:00"
  });

  const result = invalidation.invalidateEvidenceAndRecompute({
    store: boundStore,
    invalidation_event: ev,
    decision_records: [decision]
  });

  assert.equal(result.invalidated, false);
  assert.equal(result.propagation_record.affected_transition_count, 0);
  assert.equal(result.propagation_record.historical_state, "PASS");
  assert.equal(result.propagation_record.effective_state, "PASS");
  assert.equal(result.propagation_record.state_changed, false);
}

// INV-T05 multiple transitions using same evidence are all affected.
{
  const s0 = storeRuntime.createEmptyStore({ subject_ref: "release:HBCE-L1" });
  const pass = storeRuntime.appendGovernedTransition(s0, intent({ request_id: "inv-t05-pass", target_state: "PASS" }), context());
  const closed = storeRuntime.appendGovernedTransition(pass.store, intent({ request_id: "inv-t05-closed", target_state: "CLOSED" }), context());
  const decisions = [pass.result.result.decision_record, closed.result.result.decision_record];
  const boundStore = invalidation.bindStoreEventsWithDecisionRecords(closed.store, decisions);

  const ev = invalidation.createEvidenceInvalidationEvent({
    invalidation_id: "inv-t05",
    evidence_ref: "evidence:valid-runtime-artifact",
    source_ref: "review:manual",
    reason_code: "EVIDENCE_REVOKED",
    created_at: "2026-09-30T18:55:00+02:00"
  });

  const affected = invalidation.findAffectedTransitions(boundStore, ev, decisions);

  assert.equal(affected.length, 2);
  assert.deepEqual(affected.map((item) => item.request_id), ["inv-t05-pass", "inv-t05-closed"]);
}

// INV-T06 rejected transition evidence does not become authoritative TransitionEvent.
{
  const s0 = storeRuntime.createEmptyStore({ subject_ref: "release:HBCE-L1" });
  const rejected = storeRuntime.appendGovernedTransition(s0, intent({ request_id: "inv-t06", evidence_refs: [] }), context());

  const ev = invalidation.createEvidenceInvalidationEvent({
    invalidation_id: "inv-t06",
    evidence_ref: "evidence:valid-runtime-artifact",
    source_ref: "review:manual",
    reason_code: "EVIDENCE_REVOKED",
    created_at: "2026-09-30T18:55:00+02:00"
  });

  const affected = invalidation.findAffectedTransitions(rejected.store, ev, []);

  assert.equal(rejected.store.events.length, 0);
  assert.equal(rejected.store.rejected_events.length, 1);
  assert.equal(affected.length, 0);
}

// INV-T07 custom fallback effective state is supported.
{
  const s0 = storeRuntime.createEmptyStore({ subject_ref: "release:HBCE-L1" });
  const accepted = storeRuntime.appendGovernedTransition(s0, intent({ request_id: "inv-t07" }), context());
  const decision = accepted.result.result.decision_record;
  const boundStore = invalidation.bindStoreEventsWithDecisionRecords(accepted.store, [decision]);

  const ev = invalidation.createEvidenceInvalidationEvent({
    invalidation_id: "inv-t07",
    evidence_ref: "evidence:valid-runtime-artifact",
    source_ref: "review:manual",
    reason_code: "EVIDENCE_REVOKED",
    created_at: "2026-09-30T18:55:00+02:00"
  });

  const result = invalidation.invalidateEvidenceAndRecompute({
    store: boundStore,
    invalidation_event: ev,
    decision_records: [decision],
    fallback_effective_state: "SUSPENDED"
  });

  assert.equal(result.propagation_record.historical_state, "PASS");
  assert.equal(result.propagation_record.effective_state, "SUSPENDED");
  assert.equal(result.propagation_record.history_preserved, true);
}

// INV-T08 boundary forbids authority inflation.
{
  const boundary = invalidation.invalidationBoundaryRecord();

  assert.equal(boundary.history_rewrite_allowed, false);
  assert.equal(boundary.historical_pass_preserved_as_fact, true);
  assert.equal(boundary.effective_state_recomputable, true);
  assert.equal(boundary.default_invalidated_effective_state, "UNVERIFIED");
  assert.equal(boundary.creates_external_validation, false);
  assert.equal(boundary.creates_legal_validity, false);
  assert.equal(boundary.creates_certification, false);
  assert.equal(boundary.creates_procurement_eligibility, false);
  assert.equal(boundary.creates_level4, false);
}

// INV-T09 invalidation logs append without mutating TransitionEvent history.
{
  const s0 = storeRuntime.createEmptyStore({ subject_ref: "release:HBCE-L1" });
  const accepted = storeRuntime.appendGovernedTransition(s0, intent({ request_id: "inv-t09" }), context());
  const decision = accepted.result.result.decision_record;
  const boundStore = invalidation.bindStoreEventsWithDecisionRecords(accepted.store, [decision]);
  const beforeEventCount = boundStore.events.length;

  const ev = invalidation.createEvidenceInvalidationEvent({
    invalidation_id: "inv-t09",
    evidence_ref: "evidence:valid-runtime-artifact",
    source_ref: "review:manual",
    reason_code: "EVIDENCE_REVOKED",
    created_at: "2026-09-30T18:55:00+02:00"
  });

  const result = invalidation.invalidateEvidenceAndRecompute({
    store: boundStore,
    invalidation_event: ev,
    decision_records: [decision]
  });

  assert.equal(result.store.events.length, beforeEventCount);
  assert.equal(result.store.invalidation_events.length, 1);
  assert.equal(result.store.invalidation_propagation_records.length, 1);
}

// INV-T10 propagation record is digest-bound.
{
  const s0 = storeRuntime.createEmptyStore({ subject_ref: "release:HBCE-L1" });
  const accepted = storeRuntime.appendGovernedTransition(s0, intent({ request_id: "inv-t10" }), context());
  const decision = accepted.result.result.decision_record;
  const boundStore = invalidation.bindStoreEventsWithDecisionRecords(accepted.store, [decision]);

  const ev = invalidation.createEvidenceInvalidationEvent({
    invalidation_id: "inv-t10",
    evidence_ref: "evidence:valid-runtime-artifact",
    source_ref: "review:manual",
    reason_code: "EVIDENCE_REVOKED",
    created_at: "2026-09-30T18:55:00+02:00"
  });

  const result = invalidation.invalidateEvidenceAndRecompute({
    store: boundStore,
    invalidation_event: ev,
    decision_records: [decision]
  });

  assert.ok(result.propagation_record.projection_sha256);
  assert.equal(typeof result.propagation_record.projection_sha256, "string");
  assert.equal(result.propagation_record.projection_sha256.length, 64);
}

console.log("PROG_200_HBCE_EG_001_EVIDENCE_INVALIDATION_PROPAGATION_TEST=PASS");
