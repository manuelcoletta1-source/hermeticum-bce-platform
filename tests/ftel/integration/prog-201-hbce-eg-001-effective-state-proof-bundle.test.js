"use strict";

const assert = require("assert/strict");
const path = require("path");

const storeRuntime = require(path.join(process.cwd(), "runtime/shared-core/hbce-eg-001-append-only-transition-log.js"));
const invalidation = require(path.join(process.cwd(), "runtime/shared-core/hbce-eg-001-evidence-invalidation-propagation.js"));
const proof = require(path.join(process.cwd(), "runtime/shared-core/hbce-eg-001-effective-state-proof-bundle.js"));

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
    request_id: overrides.request_id || "proof-tr-001",
    subject_ref: "release:HBCE-L1",
    target_state: overrides.target_state || "PASS",
    actor_ref: "manuel:IPR-3",
    actor_class: "HUMAN_AUTHORITY",
    policy_ref: { id: "HBCE-EG-001", version: "V1.4-R1" },
    evidence_refs: overrides.evidence_refs === undefined ? ["evidence:valid-runtime-artifact"] : overrides.evidence_refs,
    created_at: "2026-09-30T19:30:00+02:00"
  };
}

function acceptedStore() {
  const s0 = storeRuntime.createEmptyStore({ store_id: "proof-store", subject_ref: "release:HBCE-L1" });
  const accepted = storeRuntime.appendGovernedTransition(s0, intent({ request_id: "proof-pass" }), context());
  return {
    store: accepted.store,
    decision: accepted.result.result.decision_record
  };
}

// PROOF-T01 valid PASS produces effective PASS proof bundle.
{
  const { store, decision } = acceptedStore();

  const bundle = proof.createEffectiveStateProofBundle({
    proof_id: "proof-t01",
    store,
    decision_records: [decision],
    created_at: "2026-09-30T19:30:00+02:00"
  });

  assert.equal(bundle.record_type, "EffectiveStateProofBundle");
  assert.equal(bundle.transition_event_count, 1);
  assert.equal(bundle.rejected_event_count, 0);
  assert.equal(bundle.historical_projection.state, "PASS");
  assert.equal(bundle.effective_projection.effective_state, "PASS");
  assert.equal(bundle.cache_matches_replay, true);
  assert.ok(bundle.proof_sha256);
}

// PROOF-T02 invalidated evidence preserves historical PASS and proves effective UNVERIFIED.
{
  const { store, decision } = acceptedStore();
  const boundStore = invalidation.bindStoreEventsWithDecisionRecords(store, [decision]);

  const invalidationEvent = invalidation.createEvidenceInvalidationEvent({
    invalidation_id: "proof-t02-invalidation",
    evidence_ref: "evidence:valid-runtime-artifact",
    source_ref: "review:manual",
    reason_code: "EVIDENCE_REVOKED",
    created_at: "2026-09-30T19:30:00+02:00"
  });

  const invalidated = invalidation.invalidateEvidenceAndRecompute({
    store: boundStore,
    invalidation_event: invalidationEvent,
    decision_records: [decision]
  });

  const bundle = proof.createEffectiveStateProofBundle({
    proof_id: "proof-t02",
    store: invalidated.store,
    decision_records: [decision],
    created_at: "2026-09-30T19:30:00+02:00"
  });

  assert.equal(bundle.historical_projection.state, "PASS");
  assert.equal(bundle.effective_projection.historical_state, "PASS");
  assert.equal(bundle.effective_projection.effective_state, "UNVERIFIED");
  assert.equal(bundle.effective_projection.history_preserved, true);
  assert.equal(bundle.invalidation_event_count, 1);
  assert.equal(bundle.invalidation_propagation_record_count, 1);
}

// PROOF-T03 direct projection mutation rejection is included as evidence, not authoritative transition.
{
  const s0 = storeRuntime.createEmptyStore({ store_id: "proof-rejected-store", subject_ref: "release:HBCE-L1" });

  const rejected = storeRuntime.attemptDirectProjectionMutation(s0, {
    attempted_state: "LEVEL_4_ELIGIBLE",
    actor_ref: "admin:projection-edit",
    policy_ref: { id: "HBCE-EG-001", version: "V1.4-R1" },
    created_at: "2026-09-30T19:30:00+02:00"
  });

  const bundle = proof.createEffectiveStateProofBundle({
    proof_id: "proof-t03",
    store: rejected.store,
    decision_records: [],
    created_at: "2026-09-30T19:30:00+02:00"
  });

  assert.equal(bundle.transition_event_count, 0);
  assert.equal(bundle.rejected_event_count, 1);
  assert.equal(bundle.historical_projection.state, "PENDING");
  assert.equal(bundle.effective_projection.effective_state, "PENDING");
}

// PROOF-T04 projection cache mismatch is exposed in proof.
{
  const { store, decision } = acceptedStore();

  const corrupted = {
    ...store,
    projection_cache: {
      ...store.projection_cache,
      state: "LEVEL_4_ELIGIBLE"
    }
  };

  const bundle = proof.createEffectiveStateProofBundle({
    proof_id: "proof-t04",
    store: corrupted,
    decision_records: [decision],
    created_at: "2026-09-30T19:30:00+02:00"
  });

  assert.equal(bundle.cache_matches_replay, false);
  assert.equal(bundle.historical_projection.state, "PASS");
  assert.equal(bundle.effective_projection.effective_state, "PASS");
}

// PROOF-T05 verification passes for unchanged bundle.
{
  const { store, decision } = acceptedStore();

  const bundle = proof.createEffectiveStateProofBundle({
    proof_id: "proof-t05",
    store,
    decision_records: [decision],
    created_at: "2026-09-30T19:30:00+02:00"
  });

  const verified = proof.verifyEffectiveStateProofBundle(bundle, store, [decision]);

  assert.equal(verified.record_type, "EffectiveStateProofBundleVerification");
  assert.equal(verified.verified, true);
  assert.deepEqual(verified.reason_codes, []);
}

// PROOF-T06 verification fails for tampered bundle.
{
  const { store, decision } = acceptedStore();

  const bundle = proof.createEffectiveStateProofBundle({
    proof_id: "proof-t06",
    store,
    decision_records: [decision],
    created_at: "2026-09-30T19:30:00+02:00"
  });

  const tampered = {
    ...bundle,
    effective_projection: {
      ...bundle.effective_projection,
      effective_state: "LEVEL_4_ELIGIBLE"
    }
  };

  const verified = proof.verifyEffectiveStateProofBundle(tampered, store, [decision]);

  assert.equal(verified.verified, false);
  assert.ok(verified.reason_codes.includes("PROOF_BUNDLE_MISMATCH"));
}

// PROOF-T07 rejected missing evidence remains non-authoritative.
{
  const s0 = storeRuntime.createEmptyStore({ store_id: "proof-missing-evidence-store", subject_ref: "release:HBCE-L1" });
  const rejected = storeRuntime.appendGovernedTransition(s0, intent({ request_id: "proof-t07", evidence_refs: [] }), context());

  const bundle = proof.createEffectiveStateProofBundle({
    proof_id: "proof-t07",
    store: rejected.store,
    decision_records: [],
    created_at: "2026-09-30T19:30:00+02:00"
  });

  assert.equal(bundle.transition_event_count, 0);
  assert.equal(bundle.rejected_event_count, 1);
  assert.equal(bundle.historical_projection.state, "PENDING");
  assert.equal(bundle.effective_projection.effective_state, "PENDING");
}

// PROOF-T08 boundary refuses authority inflation.
{
  const boundary = proof.proofBoundaryRecord();

  assert.equal(boundary.projection_cache_authoritative, false);
  assert.equal(boundary.history_rewrite_allowed, false);
  assert.equal(boundary.rejected_transition_is_evidence, true);
  assert.equal(boundary.creates_external_validation, false);
  assert.equal(boundary.creates_legal_validity, false);
  assert.equal(boundary.creates_certification, false);
  assert.equal(boundary.creates_procurement_eligibility, false);
  assert.equal(boundary.creates_level4, false);
}

// PROOF-T09 custom invalidated effective SUSPENDED is preserved in proof.
{
  const { store, decision } = acceptedStore();
  const boundStore = invalidation.bindStoreEventsWithDecisionRecords(store, [decision]);

  const invalidationEvent = invalidation.createEvidenceInvalidationEvent({
    invalidation_id: "proof-t09-invalidation",
    evidence_ref: "evidence:valid-runtime-artifact",
    source_ref: "review:manual",
    reason_code: "EVIDENCE_REVOKED",
    created_at: "2026-09-30T19:30:00+02:00"
  });

  const invalidated = invalidation.invalidateEvidenceAndRecompute({
    store: boundStore,
    invalidation_event: invalidationEvent,
    decision_records: [decision],
    fallback_effective_state: "SUSPENDED"
  });

  const bundle = proof.createEffectiveStateProofBundle({
    proof_id: "proof-t09",
    store: invalidated.store,
    decision_records: [decision],
    created_at: "2026-09-30T19:30:00+02:00"
  });

  assert.equal(bundle.effective_projection.historical_state, "PASS");
  assert.equal(bundle.effective_projection.effective_state, "SUSPENDED");
  assert.equal(bundle.effective_projection.history_preserved, true);
}

// PROOF-T10 proof digest is stable size and no external/legal/cert/procurement/level4 claim is made.
{
  const { store, decision } = acceptedStore();

  const bundle = proof.createEffectiveStateProofBundle({
    proof_id: "proof-t10",
    store,
    decision_records: [decision],
    created_at: "2026-09-30T19:30:00+02:00"
  });

  assert.equal(typeof bundle.proof_sha256, "string");
  assert.equal(bundle.proof_sha256.length, 64);
  assert.equal(bundle.external_validation_claimed, false);
  assert.equal(bundle.legal_validity_claimed, false);
  assert.equal(bundle.certification_claimed, false);
  assert.equal(bundle.procurement_eligibility_claimed, false);
  assert.equal(bundle.level4_claimed, false);
}

console.log("PROG_201_HBCE_EG_001_EFFECTIVE_STATE_PROOF_BUNDLE_TEST=PASS");
