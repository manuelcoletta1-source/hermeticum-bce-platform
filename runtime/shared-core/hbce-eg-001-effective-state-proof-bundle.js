"use strict";

const eg001 = require("./hbce-eg-001-state-transition-enforcement.js");
const storeRuntime = require("./hbce-eg-001-append-only-transition-log.js");

const PROOF_VERSION = "HBCE-EG-001-EFFECTIVE-STATE-PROOF-BUNDLE-V0.1";

function hashRecord(record) {
  if (!record) return null;
  if (typeof record.event_sha256 === "string") return record.event_sha256;
  if (typeof record.projection_sha256 === "string") return record.projection_sha256;
  if (typeof record.record_sha256 === "string") return record.record_sha256;
  if (typeof record.decision_sha256 === "string") return record.decision_sha256;
  return eg001.sha256(record);
}

function proofBoundaryRecord() {
  return {
    proof_version: PROOF_VERSION,
    purpose: "Export a digest-bound proof bundle for HBCE-EG-001 effective protected-state reconstruction.",
    authoritative_state_source: "TransitionEvent lineage replay plus invalidation propagation",
    projection_cache_authoritative: false,
    history_rewrite_allowed: false,
    rejected_transition_is_evidence: true,
    creates_external_validation: false,
    creates_legal_validity: false,
    creates_certification: false,
    creates_procurement_eligibility: false,
    creates_level4: false
  };
}

function effectiveProjectionFromStore(store, replay) {
  if (store.effective_projection) {
    return {
      subject_ref: store.effective_projection.subject_ref || store.subject_ref,
      historical_state: store.effective_projection.historical_state,
      effective_state: store.effective_projection.effective_state,
      history_preserved: store.effective_projection.history_preserved,
      invalidation_id: store.effective_projection.invalidation_id || null,
      evidence_ref: store.effective_projection.evidence_ref || null,
      projection_sha256: store.effective_projection.projection_sha256 || null
    };
  }

  return {
    subject_ref: store.subject_ref,
    historical_state: replay.projection.state,
    effective_state: replay.projection.state,
    history_preserved: true,
    invalidation_id: null,
    evidence_ref: null,
    projection_sha256: eg001.sha256({
      subject_ref: store.subject_ref,
      historical_state: replay.projection.state,
      effective_state: replay.projection.state,
      history_preserved: true
    })
  };
}

function createEffectiveStateProofBundle({
  proof_id,
  store,
  decision_records = [],
  created_at,
  source_ref = "HBCE-EG-001"
}) {
  const replay = storeRuntime.replayStore(store);
  const invalidationEvents = Array.isArray(store.invalidation_events) ? store.invalidation_events.slice() : [];
  const propagationRecords = Array.isArray(store.invalidation_propagation_records) ? store.invalidation_propagation_records.slice() : [];
  const effectiveProjection = effectiveProjectionFromStore(store, replay);
  const boundary = proofBoundaryRecord();

  const bundle = {
    record_type: "EffectiveStateProofBundle",
    proof_id,
    proof_version: PROOF_VERSION,
    source_ref,
    created_at,
    store_id: store.store_id,
    subject_ref: store.subject_ref,
    transition_event_count: store.events.length,
    rejected_event_count: store.rejected_events.length,
    invalidation_event_count: invalidationEvents.length,
    invalidation_propagation_record_count: propagationRecords.length,
    transition_event_hashes: store.events.map(hashRecord),
    rejected_event_hashes: store.rejected_events.map(hashRecord),
    decision_record_hashes: decision_records.map(hashRecord),
    invalidation_event_hashes: invalidationEvents.map(hashRecord),
    invalidation_propagation_record_hashes: propagationRecords.map(hashRecord),
    historical_projection: replay.projection,
    effective_projection: effectiveProjection,
    replay_record_sha256: replay.record_sha256,
    cache_matches_replay: replay.cache_matches_replay,
    append_only: replay.append_only,
    boundary,
    external_validation_claimed: false,
    legal_validity_claimed: false,
    certification_claimed: false,
    procurement_eligibility_claimed: false,
    level4_claimed: false,
    proof_sha256: null
  };

  bundle.proof_sha256 = eg001.sha256(bundle);
  return bundle;
}

function verifyEffectiveStateProofBundle(bundle, store, decision_records = []) {
  const rebuilt = createEffectiveStateProofBundle({
    proof_id: bundle.proof_id,
    store,
    decision_records,
    created_at: bundle.created_at,
    source_ref: bundle.source_ref
  });

  const verified = eg001.canonicalJson(rebuilt) === eg001.canonicalJson(bundle);

  return {
    record_type: "EffectiveStateProofBundleVerification",
    proof_id: bundle.proof_id,
    verified,
    reason_codes: verified ? [] : ["PROOF_BUNDLE_MISMATCH"],
    expected_sha256: rebuilt.proof_sha256,
    observed_sha256: bundle.proof_sha256,
    subject_ref: bundle.subject_ref
  };
}

module.exports = {
  PROOF_VERSION,
  hashRecord,
  proofBoundaryRecord,
  effectiveProjectionFromStore,
  createEffectiveStateProofBundle,
  verifyEffectiveStateProofBundle
};
