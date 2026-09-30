"use strict";

const eg001 = require("./hbce-eg-001-state-transition-enforcement.js");
const storeRuntime = require("./hbce-eg-001-append-only-transition-log.js");
const invalidation = require("./hbce-eg-001-evidence-invalidation-propagation.js");
const proof = require("./hbce-eg-001-effective-state-proof-bundle.js");
const verifier = require("./hbce-eg-001-integration-manifest-verifier.js");

const GOLDEN_FLOW_VERSION = "HBCE-EG-001-LEVEL1-GOLDEN-FLOW-HARNESS-V0.1";

function defaultContext(overrides = {}) {
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

function goldenBoundaryRecord() {
  return {
    golden_flow_version: GOLDEN_FLOW_VERSION,
    purpose: "Execute the HBCE-EG-001 Level 1 internal golden flow from governed request to proof bundle and manifest verification.",
    claim_ceiling: "IMPLEMENTED_AND_STRUCTURALLY_VALIDATED_INTERNAL_R_AND_D_ONLY",
    creates_external_validation: false,
    creates_legal_validity: false,
    creates_certification: false,
    creates_procurement_eligibility: false,
    creates_level4: false,
    ai_authority_allowed: false
  };
}

function runLevel1GoldenFlow({
  flow_id = "hbce-eg-001-level1-golden-flow",
  store_id = "hbce-eg-001-level1-golden-store",
  subject_ref = "release:HBCE-L1",
  target_state = "PASS",
  actor_ref = "manuel:IPR-3",
  actor_class = "HUMAN_AUTHORITY",
  evidence_refs = ["evidence:valid-runtime-artifact"],
  created_at = "2026-09-30T20:00:00+02:00",
  context = {},
  invalidate_evidence = false,
  invalidation_fallback_state = "UNVERIFIED",
  corrupt_projection_cache = false,
  tamper_proof = false,
  manifest_path = "docs/shared-core/hbce-eg-001-integration-manifest.json"
} = {}) {
  const initialStore = storeRuntime.createEmptyStore({
    store_id,
    subject_ref,
    initial_state: "PENDING",
    initial_state_version: 1
  });

  const transition = storeRuntime.appendGovernedTransition(initialStore, {
    request_id: `${flow_id}-transition`,
    subject_ref,
    target_state,
    actor_ref,
    actor_class,
    policy_ref: { id: "HBCE-EG-001", version: "V1.4-R1" },
    evidence_refs,
    created_at
  }, defaultContext(context));

  const decisionRecords = [];
  if (transition.result && transition.result.result && transition.result.result.decision_record) {
    decisionRecords.push(transition.result.result.decision_record);
  }

  let workingStore = transition.store;

  if (decisionRecords.length > 0) {
    workingStore = invalidation.bindStoreEventsWithDecisionRecords(workingStore, decisionRecords);
  }

  let invalidationResult = null;
  if (invalidate_evidence && decisionRecords.length > 0) {
    const evidenceRef = evidence_refs[0] || "evidence:valid-runtime-artifact";
    const invalidationEvent = invalidation.createEvidenceInvalidationEvent({
      invalidation_id: `${flow_id}-invalidation`,
      evidence_ref: evidenceRef,
      source_ref: "golden-flow:review",
      reason_code: "EVIDENCE_REVOKED",
      created_at
    });

    invalidationResult = invalidation.invalidateEvidenceAndRecompute({
      store: workingStore,
      invalidation_event: invalidationEvent,
      decision_records: decisionRecords,
      fallback_effective_state: invalidation_fallback_state
    });

    workingStore = invalidationResult.store;
  }

  if (corrupt_projection_cache) {
    workingStore = {
      ...workingStore,
      projection_cache: {
        ...workingStore.projection_cache,
        state: "LEVEL_4_ELIGIBLE"
      }
    };
  }

  const bundle = proof.createEffectiveStateProofBundle({
    proof_id: `${flow_id}-proof`,
    store: workingStore,
    decision_records: decisionRecords,
    created_at,
    source_ref: "HBCE-EG-001-LEVEL1-GOLDEN-FLOW"
  });

  const observedBundle = tamper_proof
    ? {
        ...bundle,
        effective_projection: {
          ...bundle.effective_projection,
          effective_state: "LEVEL_4_ELIGIBLE"
        }
      }
    : bundle;

  const proofVerification = proof.verifyEffectiveStateProofBundle(observedBundle, workingStore, decisionRecords);
  const manifestVerification = verifier.verifyIntegrationManifest(manifest_path);
  const boundary = goldenBoundaryRecord();

  const record = {
    record_type: "HBCEEG001Level1GoldenFlowRecord",
    golden_flow_version: GOLDEN_FLOW_VERSION,
    flow_id,
    subject_ref,
    target_state,
    actor_class,
    transition_appended: transition.appended,
    transition_rejected: transition.rejected,
    decision: transition.result && transition.result.result && transition.result.result.decision_record
      ? transition.result.result.decision_record.decision
      : null,
    transition_event_count: workingStore.events.length,
    rejected_event_count: workingStore.rejected_events.length,
    invalidation_event_count: Array.isArray(workingStore.invalidation_events) ? workingStore.invalidation_events.length : 0,
    invalidation_propagation_record_count: Array.isArray(workingStore.invalidation_propagation_records) ? workingStore.invalidation_propagation_records.length : 0,
    historical_state: observedBundle.historical_projection.state,
    effective_state: observedBundle.effective_projection.effective_state,
    history_preserved: observedBundle.effective_projection.history_preserved,
    cache_matches_replay: observedBundle.cache_matches_replay,
    proof_verified: proofVerification.verified,
    manifest_verified: manifestVerification.verified,
    structurally_verified: proofVerification.verified && manifestVerification.verified,
    golden_flow_pass: transition.appended && proofVerification.verified && manifestVerification.verified && observedBundle.effective_projection.effective_state === target_state,
    claim_ceiling: boundary.claim_ceiling,
    boundary,
    external_validation_claimed: false,
    legal_validity_claimed: false,
    certification_claimed: false,
    procurement_eligibility_claimed: false,
    level4_claimed: false,
    ai_authority_allowed: false,
    record_sha256: null
  };

  record.record_sha256 = eg001.sha256(record);

  return {
    record,
    store: workingStore,
    transition,
    decision_records: decisionRecords,
    proof_bundle: observedBundle,
    proof_verification: proofVerification,
    manifest_verification: manifestVerification,
    invalidation_result: invalidationResult
  };
}

function runDirectMutationGoldenNegative({
  flow_id = "hbce-eg-001-direct-mutation-negative",
  store_id = "hbce-eg-001-direct-mutation-store",
  subject_ref = "release:HBCE-L1",
  attempted_state = "LEVEL_4_ELIGIBLE",
  actor_ref = "admin:projection-edit",
  created_at = "2026-09-30T20:00:00+02:00"
} = {}) {
  const initialStore = storeRuntime.createEmptyStore({
    store_id,
    subject_ref,
    initial_state: "PENDING",
    initial_state_version: 1
  });

  const rejected = storeRuntime.attemptDirectProjectionMutation(initialStore, {
    attempted_state,
    actor_ref,
    policy_ref: { id: "HBCE-EG-001", version: "V1.4-R1" },
    created_at
  });

  const bundle = proof.createEffectiveStateProofBundle({
    proof_id: `${flow_id}-proof`,
    store: rejected.store,
    decision_records: [],
    created_at,
    source_ref: "HBCE-EG-001-LEVEL1-GOLDEN-FLOW-NEGATIVE"
  });

  const proofVerification = proof.verifyEffectiveStateProofBundle(bundle, rejected.store, []);
  const boundary = goldenBoundaryRecord();

  const record = {
    record_type: "HBCEEG001Level1GoldenFlowNegativeRecord",
    golden_flow_version: GOLDEN_FLOW_VERSION,
    flow_id,
    subject_ref,
    attempted_state,
    mutation_applied: rejected.mutation_applied,
    rejected: rejected.rejected,
    reason_codes: rejected.reason_codes,
    transition_event_count: rejected.store.events.length,
    rejected_event_count: rejected.store.rejected_events.length,
    effective_state: bundle.effective_projection.effective_state,
    proof_verified: proofVerification.verified,
    claim_ceiling: boundary.claim_ceiling,
    external_validation_claimed: false,
    legal_validity_claimed: false,
    certification_claimed: false,
    procurement_eligibility_claimed: false,
    level4_claimed: false,
    ai_authority_allowed: false,
    record_sha256: null
  };

  record.record_sha256 = eg001.sha256(record);

  return {
    record,
    store: rejected.store,
    rejected,
    proof_bundle: bundle,
    proof_verification: proofVerification
  };
}

module.exports = {
  GOLDEN_FLOW_VERSION,
  defaultContext,
  goldenBoundaryRecord,
  runLevel1GoldenFlow,
  runDirectMutationGoldenNegative
};
