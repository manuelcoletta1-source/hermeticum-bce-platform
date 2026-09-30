"use strict";

const eg001 = require("./hbce-eg-001-state-transition-enforcement.js");

const ADAPTER_VERSION = "HBCE-EG-001-PROTECTED-STATE-MUTATION-ADAPTER-V0.1";

function protectedStateWriteAttempt({
  subject_ref,
  current_state,
  current_state_version,
  parent_state_hash = null,
  attempted_state,
  actor_ref,
  actor_class,
  policy_ref,
  created_at
}) {
  const previousProjection = {
    subject_ref,
    state: current_state,
    state_version: current_state_version,
    parent_state_hash
  };

  if (!eg001.isProtectedState(attempted_state)) {
    return {
      adapter_version: ADAPTER_VERSION,
      accepted_by_adapter: true,
      protected_state: false,
      reason_codes: [],
      previous_projection: previousProjection,
      direct_mutation_rejected: false,
      event: null
    };
  }

  const event = eg001.directMutationAttempt({
    subject_ref,
    attempted_state,
    previousProjection,
    actor_ref,
    policy_ref,
    created_at
  });

  return {
    adapter_version: ADAPTER_VERSION,
    accepted_by_adapter: false,
    protected_state: true,
    reason_codes: event.reason_codes,
    previous_projection: previousProjection,
    direct_mutation_rejected: true,
    event
  };
}

function transitionRequestFromMutationIntent({
  request_id,
  subject_ref,
  current_state,
  current_state_version,
  parent_state_hash = null,
  target_state,
  actor_ref,
  actor_class = "HUMAN_AUTHORITY",
  policy_ref,
  evidence_refs,
  created_at
}) {
  const previousProjection = {
    subject_ref,
    state: current_state,
    state_version: current_state_version,
    parent_state_hash
  };

  return {
    previousProjection,
    request: {
      request_id,
      subject_ref,
      from: current_state,
      to: target_state,
      requested_by: {
        actor_ref,
        class: actor_class
      },
      policy_ref,
      evidence_refs,
      expected_parent_state_hash: eg001.stateHash(previousProjection),
      state_version: current_state_version,
      created_at
    }
  };
}

function governedProtectedTransition(intent, context = {}) {
  const { previousProjection, request } = transitionRequestFromMutationIntent(intent);

  return eg001.applyTransition(request, {
    ...context,
    previousProjection
  });
}

function guardedStateWriter(intent, context = {}) {
  if (eg001.isProtectedState(intent.target_state) && intent.mode === "DIRECT_WRITE") {
    const rejected = protectedStateWriteAttempt({
      subject_ref: intent.subject_ref,
      current_state: intent.current_state,
      current_state_version: intent.current_state_version,
      parent_state_hash: intent.parent_state_hash || null,
      attempted_state: intent.target_state,
      actor_ref: intent.actor_ref,
      actor_class: intent.actor_class,
      policy_ref: intent.policy_ref,
      created_at: intent.created_at
    });

    return {
      write_applied: false,
      route: "DIRECT_WRITE_REJECTED",
      protected_state: true,
      result: rejected
    };
  }

  if (intent.mode === "GOVERNED_TRANSITION") {
    const result = governedProtectedTransition(intent, context);

    return {
      write_applied: Boolean(result.transition_event),
      route: "GOVERNED_TRANSITION",
      protected_state: eg001.isProtectedState(intent.target_state),
      result
    };
  }

  if (!eg001.isProtectedState(intent.target_state)) {
    return {
      write_applied: true,
      route: "NON_PROTECTED_DIRECT_WRITE_ALLOWED",
      protected_state: false,
      result: {
        state: intent.target_state
      }
    };
  }

  const rejected = protectedStateWriteAttempt({
    subject_ref: intent.subject_ref,
    current_state: intent.current_state,
    current_state_version: intent.current_state_version,
    parent_state_hash: intent.parent_state_hash || null,
    attempted_state: intent.target_state,
    actor_ref: intent.actor_ref,
    actor_class: intent.actor_class,
    policy_ref: intent.policy_ref,
    created_at: intent.created_at
  });

  return {
    write_applied: false,
    route: "PROTECTED_STATE_REQUIRES_GOVERNED_TRANSITION",
    protected_state: true,
    result: rejected
  };
}

function adapterBoundaryRecord() {
  return {
    adapter_version: ADAPTER_VERSION,
    purpose: "Prevent direct protected-state mutation and route valid protected-state changes through HBCE-EG-001 governed transition enforcement.",
    protected_states: eg001.PROTECTED_STATES.slice(),
    direct_protected_state_write_allowed: false,
    governed_transition_required: true,
    creates_external_validation: false,
    creates_legal_validity: false,
    creates_certification: false,
    creates_procurement_eligibility: false,
    creates_level4: false
  };
}

module.exports = {
  ADAPTER_VERSION,
  protectedStateWriteAttempt,
  transitionRequestFromMutationIntent,
  governedProtectedTransition,
  guardedStateWriter,
  adapterBoundaryRecord
};
