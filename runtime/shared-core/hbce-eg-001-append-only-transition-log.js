"use strict";

const eg001 = require("./hbce-eg-001-state-transition-enforcement.js");
const adapter = require("./hbce-eg-001-protected-state-mutation-adapter.js");

const STORE_VERSION = "HBCE-EG-001-APPEND-ONLY-TRANSITION-LOG-V0.1";

function createEmptyStore({ store_id = "hbce-eg-001-store", subject_ref, initial_state = "PENDING", initial_state_version = 1, parent_state_hash = null }) {
  const initial_projection = {
    subject_ref,
    state: initial_state,
    state_version: initial_state_version,
    parent_state_hash
  };

  return {
    store_id,
    store_version: STORE_VERSION,
    subject_ref,
    initial_projection,
    events: [],
    rejected_events: [],
    projection_cache: eg001.projectState(initial_projection, []),
    append_only: true
  };
}

function assertSameSubject(store, subject_ref) {
  if (store.subject_ref !== subject_ref) {
    return {
      ok: false,
      reason_codes: ["SUBJECT_REF_MISMATCH"]
    };
  }

  return {
    ok: true,
    reason_codes: []
  };
}

function appendGovernedTransition(store, intent, context = {}) {
  const subjectCheck = assertSameSubject(store, intent.subject_ref);
  if (!subjectCheck.ok) {
    return {
      appended: false,
      rejected: true,
      reason_codes: subjectCheck.reason_codes,
      store,
      result: null
    };
  }

  const current = eg001.projectState(store.initial_projection, store.events);
  const normalizedIntent = {
    ...intent,
    current_state: current.state,
    current_state_version: current.state_version,
    parent_state_hash: current.parent_state_hash || null,
    mode: "GOVERNED_TRANSITION"
  };

  const result = adapter.guardedStateWriter(normalizedIntent, context);
  const nextStore = {
    ...store,
    events: store.events.slice(),
    rejected_events: store.rejected_events.slice()
  };

  if (result.result && result.result.transition_event) {
    nextStore.events.push(result.result.transition_event);
    nextStore.projection_cache = eg001.projectState(nextStore.initial_projection, nextStore.events);

    return {
      appended: true,
      rejected: false,
      reason_codes: [],
      store: nextStore,
      result
    };
  }

  if (result.result && result.result.rejected_transition_event) {
    nextStore.rejected_events.push(result.result.rejected_transition_event);
    nextStore.projection_cache = eg001.projectState(nextStore.initial_projection, nextStore.events);

    return {
      appended: false,
      rejected: true,
      reason_codes: result.result.rejected_transition_event.reason_codes,
      store: nextStore,
      result
    };
  }

  return {
    appended: false,
    rejected: true,
    reason_codes: ["NO_TRANSITION_OR_REJECTION_EVENT"],
    store: nextStore,
    result
  };
}

function attemptDirectProjectionMutation(store, { attempted_state, actor_ref, policy_ref, created_at }) {
  const current = eg001.projectState(store.initial_projection, store.events);

  const rejection = adapter.protectedStateWriteAttempt({
    subject_ref: store.subject_ref,
    current_state: current.state,
    current_state_version: current.state_version,
    parent_state_hash: current.parent_state_hash || null,
    attempted_state,
    actor_ref,
    actor_class: "DIRECT_MUTATION",
    policy_ref,
    created_at
  });

  const nextStore = {
    ...store,
    events: store.events.slice(),
    rejected_events: store.rejected_events.concat(rejection.event ? [rejection.event] : []),
    projection_cache: current
  };

  return {
    mutation_applied: false,
    rejected: true,
    reason_codes: rejection.reason_codes,
    store: nextStore,
    result: rejection
  };
}

function replayStore(store) {
  const projected = eg001.projectState(store.initial_projection, store.events);
  const replay = eg001.replayVerification(store.initial_projection, store.events, projected);

  return {
    record_type: "AppendOnlyReplayRecord",
    store_id: store.store_id,
    subject_ref: store.subject_ref,
    event_count: store.events.length,
    rejected_event_count: store.rejected_events.length,
    projection: projected,
    replay_verification_record: replay,
    cache_matches_replay: eg001.canonicalJson(projected) === eg001.canonicalJson(store.projection_cache),
    append_only: store.append_only,
    record_sha256: eg001.sha256({
      store_id: store.store_id,
      subject_ref: store.subject_ref,
      event_count: store.events.length,
      rejected_event_count: store.rejected_events.length,
      projection: projected,
      append_only: store.append_only
    })
  };
}

function reconcileProjectionCache(store) {
  const replay = replayStore(store);

  if (replay.cache_matches_replay) {
    return {
      anomaly_detected: false,
      reason_codes: [],
      store,
      replay
    };
  }

  const nextStore = {
    ...store,
    projection_cache: replay.projection
  };

  return {
    anomaly_detected: true,
    reason_codes: ["REPLAY_MISMATCH"],
    store: nextStore,
    replay
  };
}

function storeBoundaryRecord() {
  return {
    store_version: STORE_VERSION,
    purpose: "Append-only event lineage for HBCE-EG-001 protected state transitions and rejected mutation evidence.",
    authoritative_state_source: "TransitionEvent lineage replay",
    projection_cache_authoritative: false,
    direct_projection_mutation_allowed: false,
    rejected_transition_is_evidence: true,
    creates_external_validation: false,
    creates_legal_validity: false,
    creates_certification: false,
    creates_procurement_eligibility: false,
    creates_level4: false
  };
}

module.exports = {
  STORE_VERSION,
  createEmptyStore,
  appendGovernedTransition,
  attemptDirectProjectionMutation,
  replayStore,
  reconcileProjectionCache,
  storeBoundaryRecord
};
