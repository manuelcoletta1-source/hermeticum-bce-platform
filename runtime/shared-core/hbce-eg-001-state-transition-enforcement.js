"use strict";

const crypto = require("crypto");

const PROTECTED_STATES = Object.freeze([
  "PASS",
  "CLOSED",
  "RELEASE_CLEAN_ELIGIBLE",
  "EXTERNALLY_VALIDATED",
  "LEVEL_4_ELIGIBLE"
]);

const REASON = Object.freeze({
  DIRECT_PROTECTED_STATE_MUTATION: "DIRECT_PROTECTED_STATE_MUTATION",
  MISSING_REQUIRED_EVIDENCE: "MISSING_REQUIRED_EVIDENCE",
  INVALID_EVIDENCE: "INVALID_EVIDENCE",
  EVIDENCE_HASH_MISMATCH: "EVIDENCE_HASH_MISMATCH",
  EVIDENCE_REVOKED: "EVIDENCE_REVOKED",
  INVALID_PREDECESSOR_STATE: "INVALID_PREDECESSOR_STATE",
  STALE_PREDECESSOR: "STALE_PREDECESSOR",
  POLICY_NOT_SATISFIED: "POLICY_NOT_SATISFIED",
  AUTHORITY_NOT_AUTHORIZED: "AUTHORITY_NOT_AUTHORIZED",
  HUMAN_ACCEPTANCE_MISSING: "HUMAN_ACCEPTANCE_MISSING",
  EXTERNAL_VALIDATION_MISSING: "EXTERNAL_VALIDATION_MISSING",
  VALIDATOR_INDEPENDENCE_INSUFFICIENT: "VALIDATOR_INDEPENDENCE_INSUFFICIENT",
  BASELINE_MISMATCH: "BASELINE_MISMATCH",
  DUPLICATE_TRANSITION: "DUPLICATE_TRANSITION",
  REPLAY_MISMATCH: "REPLAY_MISMATCH"
});

function stable(value) {
  if (Array.isArray(value)) return value.map(stable);
  if (value && typeof value === "object") {
    return Object.fromEntries(Object.keys(value).sort().map((key) => [key, stable(value[key])]));
  }
  return value;
}

function canonicalJson(value) {
  return JSON.stringify(stable(value));
}

function sha256(value) {
  return crypto.createHash("sha256").update(typeof value === "string" ? value : canonicalJson(value)).digest("hex");
}

function isProtectedState(state) {
  return PROTECTED_STATES.includes(state);
}

function stateHash(stateProjection) {
  return sha256({
    subject_ref: stateProjection.subject_ref,
    state: stateProjection.state,
    state_version: stateProjection.state_version,
    parent_state_hash: stateProjection.parent_state_hash || null
  });
}

function requireTransitionRequestShape(request) {
  const missing = [];
  for (const key of ["request_id", "subject_ref", "from", "to", "requested_by", "policy_ref", "evidence_refs", "created_at"]) {
    if (request[key] === undefined || request[key] === null || request[key] === "") missing.push(key);
  }
  if (request.expected_parent_state_hash === undefined && request.state_version === undefined) {
    missing.push("expected_parent_state_hash_or_state_version");
  }
  return missing;
}

function rejectionEvent({ request, previousProjection, reason_codes, policy_ref, created_at }) {
  const event = {
    event_type: "REJECTED_TRANSITION",
    request_id: request && request.request_id ? request.request_id : "UNKNOWN_REQUEST",
    subject_ref: request && request.subject_ref ? request.subject_ref : previousProjection.subject_ref,
    attempted_from: request && request.from ? request.from : previousProjection.state,
    attempted_to: request && request.to ? request.to : "UNKNOWN_STATE",
    reason_codes: Array.from(new Set(reason_codes)),
    policy_ref: policy_ref || (request && request.policy_ref) || null,
    previous_valid_state: previousProjection.state,
    previous_valid_state_hash: stateHash(previousProjection),
    previous_valid_state_preserved: true,
    timestamp: created_at || new Date(0).toISOString(),
    event_sha256: null
  };
  event.event_sha256 = sha256({ ...event, event_sha256: null });
  return event;
}

function directMutationAttempt({ subject_ref, attempted_state, previousProjection, actor_ref, policy_ref, created_at }) {
  return rejectionEvent({
    request: {
      request_id: `direct-mutation:${subject_ref}:${attempted_state}`,
      subject_ref,
      from: previousProjection.state,
      to: attempted_state,
      requested_by: { actor_ref, class: "DIRECT_MUTATION" },
      policy_ref,
      evidence_refs: [],
      created_at
    },
    previousProjection,
    reason_codes: [REASON.DIRECT_PROTECTED_STATE_MUTATION],
    policy_ref,
    created_at
  });
}

function evaluateTransitionRequest(request, context = {}) {
  const previousProjection = context.previousProjection || {
    subject_ref: request.subject_ref || "UNKNOWN_SUBJECT",
    state: request.from || "UNKNOWN",
    state_version: Number.isFinite(request.state_version) ? request.state_version : 0,
    parent_state_hash: null
  };

  const shapeMissing = requireTransitionRequestShape(request);
  const reason_codes = [];

  if (shapeMissing.length) reason_codes.push(REASON.MISSING_REQUIRED_EVIDENCE);

  if (request.from !== previousProjection.state) reason_codes.push(REASON.INVALID_PREDECESSOR_STATE);

  if (
    request.expected_parent_state_hash &&
    request.expected_parent_state_hash !== stateHash(previousProjection)
  ) {
    reason_codes.push(REASON.STALE_PREDECESSOR);
  }

  if (
    request.state_version !== undefined &&
    Number(request.state_version) !== Number(previousProjection.state_version)
  ) {
    reason_codes.push(REASON.STALE_PREDECESSOR);
  }

  if (request.requested_by && request.requested_by.class === "AI_MODEL") {
    reason_codes.push(REASON.AUTHORITY_NOT_AUTHORIZED);
  }

  if (context.authority_authorized === false) reason_codes.push(REASON.AUTHORITY_NOT_AUTHORIZED);
  if (context.policy_satisfied === false) reason_codes.push(REASON.POLICY_NOT_SATISFIED);
  if (context.evidence_integrity_valid === false) reason_codes.push(REASON.INVALID_EVIDENCE, REASON.EVIDENCE_HASH_MISMATCH);
  if (context.required_evidence_invalidated === true) reason_codes.push(REASON.EVIDENCE_REVOKED);

  if (isProtectedState(request.to) && (!Array.isArray(request.evidence_refs) || request.evidence_refs.length === 0)) {
    reason_codes.push(REASON.MISSING_REQUIRED_EVIDENCE);
  }

  if (request.to === "CLOSED" && context.required_controls_complete === false) {
    reason_codes.push(REASON.MISSING_REQUIRED_EVIDENCE);
  }

  if (request.to === "RELEASE_CLEAN_ELIGIBLE" && context.internal_evidence_closure_closed !== true) {
    reason_codes.push(REASON.POLICY_NOT_SATISFIED);
  }

  if (request.to === "EXTERNALLY_VALIDATED") {
    if (context.c16_pass !== true) reason_codes.push(REASON.EXTERNAL_VALIDATION_MISSING);
    if (context.validator_independence_satisfied === false) reason_codes.push(REASON.VALIDATOR_INDEPENDENCE_INSUFFICIENT);
    if (context.baseline_digest_matches === false) reason_codes.push(REASON.BASELINE_MISMATCH);
  }

  if (request.to === "LEVEL_4_ELIGIBLE") {
    if (context.release_clean_eligible !== true) reason_codes.push(REASON.POLICY_NOT_SATISFIED);
    if (context.externally_validated !== true) reason_codes.push(REASON.EXTERNAL_VALIDATION_MISSING);
    if (context.explicit_human_acceptance !== true) reason_codes.push(REASON.HUMAN_ACCEPTANCE_MISSING);
  }

  const uniqueReasons = Array.from(new Set(reason_codes));

  if (uniqueReasons.length) {
    const decision =
      uniqueReasons.includes(REASON.MISSING_REQUIRED_EVIDENCE) ? "UNVERIFIED" :
      uniqueReasons.includes(REASON.POLICY_NOT_SATISFIED) ? "BLOCK" :
      "REJECT";

    return {
      ok: false,
      decision,
      reason_codes: uniqueReasons,
      derived_state: previousProjection.state,
      previous_state_preserved: true
    };
  }

  return {
    ok: true,
    decision: "ALLOW",
    reason_codes: [],
    derived_state: request.to,
    previous_state_preserved: false
  };
}

function decisionRecord({ request, evaluation, previousProjection, created_at }) {
  const record = {
    record_type: "DecisionRecord",
    decision_id: `decision:${request.request_id}`,
    request_id: request.request_id,
    previous_state: previousProjection.state,
    requested_state: request.to,
    evidence_refs: request.evidence_refs,
    policy_ref: request.policy_ref,
    evaluation: {
      completeness: evaluation.reason_codes.includes(REASON.MISSING_REQUIRED_EVIDENCE) ? "INCOMPLETE" : "COMPLETE",
      integrity: evaluation.reason_codes.includes(REASON.INVALID_EVIDENCE) ? "INVALID" : "VALID",
      authority: evaluation.reason_codes.includes(REASON.AUTHORITY_NOT_AUTHORIZED) ? "UNAUTHORIZED" : "AUTHORIZED",
      predecessor: evaluation.reason_codes.includes(REASON.STALE_PREDECESSOR) || evaluation.reason_codes.includes(REASON.INVALID_PREDECESSOR_STATE) ? "INVALID" : "VALID",
      gate: evaluation.decision
    },
    decision: evaluation.decision,
    reason_codes: evaluation.reason_codes,
    derived_state: evaluation.derived_state,
    previous_state_hash: stateHash(previousProjection),
    timestamp: created_at || request.created_at,
    decision_sha256: null
  };
  record.decision_sha256 = sha256({ ...record, decision_sha256: null });
  return record;
}

function transitionEvent({ request, decision, previousProjection }) {
  const event = {
    event_type: "TransitionEvent",
    request_id: request.request_id,
    decision_id: decision.decision_id,
    subject_ref: request.subject_ref,
    from: previousProjection.state,
    to: decision.derived_state,
    previous_state_hash: decision.previous_state_hash,
    state_version: Number(previousProjection.state_version) + 1,
    timestamp: decision.timestamp,
    event_sha256: null
  };
  event.event_sha256 = sha256({ ...event, event_sha256: null });
  return event;
}

function stateProjectionFromTransition(event) {
  return {
    record_type: "StateProjectionRecord",
    subject_ref: event.subject_ref,
    state: event.to,
    state_version: event.state_version,
    parent_state_hash: event.previous_state_hash,
    last_event_sha256: event.event_sha256,
    projection_sha256: null
  };
}

function finalizeProjection(projection) {
  return { ...projection, projection_sha256: sha256({ ...projection, projection_sha256: null }) };
}

function projectState(initialProjection, events = []) {
  let projection = { ...initialProjection };
  for (const event of events) {
    if (event.event_type !== "TransitionEvent") continue;
    if (event.subject_ref !== projection.subject_ref) continue;
    projection = finalizeProjection(stateProjectionFromTransition(event));
  }
  return projection;
}

function applyTransition(request, context = {}) {
  const previousProjection = context.previousProjection || {
    subject_ref: request.subject_ref,
    state: request.from,
    state_version: Number(request.state_version || 0),
    parent_state_hash: null
  };

  const existingEvents = Array.isArray(context.existingEvents) ? context.existingEvents : [];
  const existingTransition = existingEvents.find((event) => event.event_type === "TransitionEvent" && event.request_id === request.request_id);
  if (existingTransition) {
    return {
      idempotent: true,
      decision_record: null,
      transition_event: null,
      rejected_transition_event: null,
      state_projection: projectState(previousProjection, existingEvents),
      replay_verification_record: replayVerification(previousProjection, existingEvents)
    };
  }

  const evaluation = evaluateTransitionRequest(request, { ...context, previousProjection });
  const decision_record = decisionRecord({ request, evaluation, previousProjection, created_at: request.created_at });

  if (!evaluation.ok) {
    return {
      idempotent: false,
      decision_record,
      transition_event: null,
      rejected_transition_event: rejectionEvent({
        request,
        previousProjection,
        reason_codes: evaluation.reason_codes,
        policy_ref: request.policy_ref,
        created_at: request.created_at
      }),
      state_projection: finalizeProjection(previousProjection),
      replay_verification_record: replayVerification(previousProjection, existingEvents)
    };
  }

  const event = transitionEvent({ request, decision: decision_record, previousProjection });
  const allEvents = existingEvents.concat(event);
  const projection = projectState(previousProjection, allEvents);

  return {
    idempotent: false,
    decision_record,
    transition_event: event,
    rejected_transition_event: null,
    state_projection: projection,
    replay_verification_record: replayVerification(previousProjection, allEvents)
  };
}

function replayVerification(initialProjection, events = [], expectedProjection = null) {
  const projection = projectState(initialProjection, events);
  const matches = expectedProjection ? canonicalJson(projection) === canonicalJson(expectedProjection) : true;
  return {
    record_type: "ReplayVerificationRecord",
    replayed: true,
    event_count: events.length,
    derived_state: projection.state,
    derived_state_hash: stateHash(projection),
    expected_projection_match: matches,
    reason_codes: matches ? [] : [REASON.REPLAY_MISMATCH],
    replay_sha256: sha256({ projection, matches })
  };
}

function recomputeAfterInvalidation({ previousProjection, invalidated_evidence_ref }) {
  return {
    record_type: "StateProjectionRecord",
    subject_ref: previousProjection.subject_ref,
    historical_state: previousProjection.state,
    effective_state: "UNVERIFIED",
    invalidated_evidence_ref,
    history_preserved: true,
    recomputation_reason: REASON.EVIDENCE_REVOKED,
    projection_sha256: sha256({ previousProjection, invalidated_evidence_ref, effective_state: "UNVERIFIED" })
  };
}

function reconcileProjection({ cachedProjection, authoritativeProjection }) {
  const match = canonicalJson(cachedProjection) === canonicalJson(authoritativeProjection);
  return {
    record_type: "ReplayVerificationRecord",
    replayed: true,
    anomaly_detected: !match,
    reason_codes: match ? [] : [REASON.REPLAY_MISMATCH],
    restored_projection: authoritativeProjection,
    replay_sha256: sha256({ cachedProjection, authoritativeProjection, match })
  };
}

module.exports = {
  PROTECTED_STATES,
  REASON,
  stable,
  canonicalJson,
  sha256,
  isProtectedState,
  stateHash,
  directMutationAttempt,
  evaluateTransitionRequest,
  applyTransition,
  projectState,
  replayVerification,
  recomputeAfterInvalidation,
  reconcileProjection
};
