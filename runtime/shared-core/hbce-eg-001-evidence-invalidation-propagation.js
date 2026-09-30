"use strict";

const eg001 = require("./hbce-eg-001-state-transition-enforcement.js");
const storeRuntime = require("./hbce-eg-001-append-only-transition-log.js");

const INVALIDATION_VERSION = "HBCE-EG-001-EVIDENCE-INVALIDATION-PROPAGATION-V0.1";

function createEvidenceInvalidationEvent({
  invalidation_id,
  evidence_ref,
  source_ref,
  reason_code,
  created_at,
  scope = "DECLARED_EVIDENCE_REF"
}) {
  const event = {
    event_type: "EvidenceInvalidationEvent",
    invalidation_id,
    evidence_ref,
    source_ref,
    reason_code,
    scope,
    created_at,
    event_sha256: null
  };

  event.event_sha256 = eg001.sha256({ ...event, event_sha256: null });
  return event;
}

function eventUsesEvidence(event, evidence_ref) {
  if (!event || event.event_type !== "TransitionEvent") return false;
  if (!event.request_id) return false;
  if (!event.decision_id) return false;

  return Array.isArray(event.evidence_refs)
    ? event.evidence_refs.includes(evidence_ref)
    : false;
}

function decisionUsesEvidence(decisionRecord, evidence_ref) {
  return Boolean(
    decisionRecord &&
    decisionRecord.record_type === "DecisionRecord" &&
    Array.isArray(decisionRecord.evidence_refs) &&
    decisionRecord.evidence_refs.includes(evidence_ref)
  );
}

function bindDecisionRecordToTransitionEvent(transition_event, decision_record) {
  return {
    ...transition_event,
    evidence_refs: Array.isArray(decision_record.evidence_refs) ? decision_record.evidence_refs.slice() : [],
    decision_sha256: decision_record.decision_sha256 || null
  };
}

function bindStoreEventsWithDecisionRecords(store, decision_records = []) {
  const byDecision = new Map(decision_records.map((record) => [record.decision_id, record]));

  return {
    ...store,
    events: store.events.map((event) => {
      const decision = byDecision.get(event.decision_id);
      return decision ? bindDecisionRecordToTransitionEvent(event, decision) : event;
    })
  };
}

function findAffectedTransitions(store, invalidation_event, decision_records = []) {
  const decisionById = new Map(decision_records.map((record) => [record.decision_id, record]));

  return store.events
    .filter((event) => event.event_type === "TransitionEvent")
    .filter((event) => {
      if (eventUsesEvidence(event, invalidation_event.evidence_ref)) return true;
      return decisionUsesEvidence(decisionById.get(event.decision_id), invalidation_event.evidence_ref);
    })
    .map((event) => ({
      event_sha256: event.event_sha256,
      request_id: event.request_id,
      decision_id: event.decision_id,
      subject_ref: event.subject_ref,
      from: event.from,
      to: event.to,
      state_version: event.state_version
    }));
}

function recomputeEffectiveProjectionAfterInvalidation({
  store,
  invalidation_event,
  decision_records = [],
  fallback_effective_state = "UNVERIFIED"
}) {
  const affected = findAffectedTransitions(store, invalidation_event, decision_records);
  const historicalProjection = storeRuntime.replayStore(store).projection;

  if (affected.length === 0) {
    return {
      record_type: "InvalidationPropagationRecord",
      invalidation_id: invalidation_event.invalidation_id,
      evidence_ref: invalidation_event.evidence_ref,
      affected_transition_count: 0,
      affected_transitions: [],
      historical_state: historicalProjection.state,
      effective_state: historicalProjection.state,
      history_preserved: true,
      state_changed: false,
      reason_codes: [],
      projection_sha256: eg001.sha256({
        invalidation_event,
        affected_transition_count: 0,
        historicalProjection
      })
    };
  }

  return {
    record_type: "InvalidationPropagationRecord",
    invalidation_id: invalidation_event.invalidation_id,
    evidence_ref: invalidation_event.evidence_ref,
    affected_transition_count: affected.length,
    affected_transitions: affected,
    historical_state: historicalProjection.state,
    effective_state: fallback_effective_state,
    history_preserved: true,
    state_changed: historicalProjection.state !== fallback_effective_state,
    reason_codes: ["EVIDENCE_REVOKED"],
    projection_sha256: eg001.sha256({
      invalidation_event,
      affected,
      historical_state: historicalProjection.state,
      effective_state: fallback_effective_state
    })
  };
}

function appendInvalidationEvidence(store, invalidation_event, propagation_record) {
  const invalidationLog = Array.isArray(store.invalidation_events) ? store.invalidation_events.slice() : [];
  const propagationLog = Array.isArray(store.invalidation_propagation_records) ? store.invalidation_propagation_records.slice() : [];

  return {
    ...store,
    invalidation_events: invalidationLog.concat(invalidation_event),
    invalidation_propagation_records: propagationLog.concat(propagation_record),
    effective_projection: {
      subject_ref: store.subject_ref,
      historical_state: propagation_record.historical_state,
      effective_state: propagation_record.effective_state,
      history_preserved: propagation_record.history_preserved,
      invalidation_id: propagation_record.invalidation_id,
      evidence_ref: propagation_record.evidence_ref,
      projection_sha256: propagation_record.projection_sha256
    }
  };
}

function invalidateEvidenceAndRecompute({
  store,
  invalidation_event,
  decision_records = [],
  fallback_effective_state = "UNVERIFIED"
}) {
  const propagation = recomputeEffectiveProjectionAfterInvalidation({
    store,
    invalidation_event,
    decision_records,
    fallback_effective_state
  });

  const nextStore = appendInvalidationEvidence(store, invalidation_event, propagation);

  return {
    invalidated: propagation.affected_transition_count > 0,
    propagation_record: propagation,
    store: nextStore
  };
}

function invalidationBoundaryRecord() {
  return {
    invalidation_version: INVALIDATION_VERSION,
    purpose: "Propagate evidence invalidation across HBCE-EG-001 append-only transition lineage while preserving historical state and recomputing effective state.",
    history_rewrite_allowed: false,
    historical_pass_preserved_as_fact: true,
    effective_state_recomputable: true,
    default_invalidated_effective_state: "UNVERIFIED",
    creates_external_validation: false,
    creates_legal_validity: false,
    creates_certification: false,
    creates_procurement_eligibility: false,
    creates_level4: false
  };
}

module.exports = {
  INVALIDATION_VERSION,
  createEvidenceInvalidationEvent,
  bindDecisionRecordToTransitionEvent,
  bindStoreEventsWithDecisionRecords,
  findAffectedTransitions,
  recomputeEffectiveProjectionAfterInvalidation,
  appendInvalidationEvidence,
  invalidateEvidenceAndRecompute,
  invalidationBoundaryRecord
};
