"use strict";

const assert = require("assert/strict");
const path = require("path");

const golden = require(path.join(process.cwd(), "runtime/shared-core/hbce-eg-001-level1-golden-flow-harness.js"));

// GF-T01 governed golden flow reaches PASS and verifies proof + manifest.
{
  const result = golden.runLevel1GoldenFlow({ flow_id: "gf-t01" });

  assert.equal(result.record.transition_appended, true);
  assert.equal(result.record.decision, "ALLOW");
  assert.equal(result.record.historical_state, "PASS");
  assert.equal(result.record.effective_state, "PASS");
  assert.equal(result.record.proof_verified, true);
  assert.equal(result.record.manifest_verified, true);
  assert.equal(result.record.structurally_verified, true);
  assert.equal(result.record.golden_flow_pass, true);
}

// GF-T02 direct protected projection mutation is rejected and preserved as evidence.
{
  const result = golden.runDirectMutationGoldenNegative({ flow_id: "gf-t02" });

  assert.equal(result.record.mutation_applied, false);
  assert.equal(result.record.rejected, true);
  assert.ok(result.record.reason_codes.includes("DIRECT_PROTECTED_STATE_MUTATION"));
  assert.equal(result.record.transition_event_count, 0);
  assert.equal(result.record.rejected_event_count, 1);
  assert.equal(result.record.effective_state, "PENDING");
  assert.equal(result.record.proof_verified, true);
}

// GF-T03 invalidated evidence preserves historical PASS and recomputes effective UNVERIFIED.
{
  const result = golden.runLevel1GoldenFlow({
    flow_id: "gf-t03",
    invalidate_evidence: true
  });

  assert.equal(result.record.transition_appended, true);
  assert.equal(result.record.historical_state, "PASS");
  assert.equal(result.record.effective_state, "UNVERIFIED");
  assert.equal(result.record.history_preserved, true);
  assert.equal(result.record.invalidation_event_count, 1);
  assert.equal(result.record.invalidation_propagation_record_count, 1);
  assert.equal(result.record.proof_verified, true);
  assert.equal(result.record.manifest_verified, true);
  assert.equal(result.record.golden_flow_pass, false);
}

// GF-T04 projection cache corruption is exposed by cache/replay mismatch.
{
  const result = golden.runLevel1GoldenFlow({
    flow_id: "gf-t04",
    corrupt_projection_cache: true
  });

  assert.equal(result.record.transition_appended, true);
  assert.equal(result.record.historical_state, "PASS");
  assert.equal(result.record.effective_state, "PASS");
  assert.equal(result.record.cache_matches_replay, false);
  assert.equal(result.record.proof_verified, true);
}

// GF-T05 missing evidence creates rejected event and no authoritative transition.
{
  const result = golden.runLevel1GoldenFlow({
    flow_id: "gf-t05",
    evidence_refs: []
  });

  assert.equal(result.record.transition_appended, false);
  assert.equal(result.record.transition_rejected, true);
  assert.equal(result.record.transition_event_count, 0);
  assert.equal(result.record.rejected_event_count, 1);
  assert.equal(result.record.effective_state, "PENDING");
  assert.equal(result.record.golden_flow_pass, false);
}

// GF-T06 tampered proof bundle fails verification.
{
  const result = golden.runLevel1GoldenFlow({
    flow_id: "gf-t06",
    tamper_proof: true
  });

  assert.equal(result.record.transition_appended, true);
  assert.equal(result.record.proof_verified, false);
  assert.equal(result.record.structurally_verified, false);
  assert.equal(result.proof_verification.verified, false);
  assert.ok(result.proof_verification.reason_codes.includes("PROOF_BUNDLE_MISMATCH"));
}

// GF-T07 AI model cannot authorize protected transition.
{
  const result = golden.runLevel1GoldenFlow({
    flow_id: "gf-t07",
    actor_ref: "joker-c2",
    actor_class: "AI_MODEL"
  });

  assert.equal(result.record.transition_appended, false);
  assert.equal(result.record.transition_rejected, true);
  assert.equal(result.record.decision, "REJECT");
  assert.equal(result.record.rejected_event_count, 1);
  assert.equal(result.record.ai_authority_allowed, false);
}

// GF-T08 boundary refuses authority inflation.
{
  const boundary = golden.goldenBoundaryRecord();

  assert.equal(boundary.claim_ceiling, "IMPLEMENTED_AND_STRUCTURALLY_VALIDATED_INTERNAL_R_AND_D_ONLY");
  assert.equal(boundary.creates_external_validation, false);
  assert.equal(boundary.creates_legal_validity, false);
  assert.equal(boundary.creates_certification, false);
  assert.equal(boundary.creates_procurement_eligibility, false);
  assert.equal(boundary.creates_level4, false);
  assert.equal(boundary.ai_authority_allowed, false);
}

// GF-T09 golden flow record is digest-bound and does not claim external/legal/cert/procurement/level4.
{
  const result = golden.runLevel1GoldenFlow({ flow_id: "gf-t09" });

  assert.equal(typeof result.record.record_sha256, "string");
  assert.equal(result.record.record_sha256.length, 64);
  assert.equal(result.record.external_validation_claimed, false);
  assert.equal(result.record.legal_validity_claimed, false);
  assert.equal(result.record.certification_claimed, false);
  assert.equal(result.record.procurement_eligibility_claimed, false);
  assert.equal(result.record.level4_claimed, false);
}

// GF-T10 custom invalidation fallback SUSPENDED is represented in golden flow.
{
  const result = golden.runLevel1GoldenFlow({
    flow_id: "gf-t10",
    invalidate_evidence: true,
    invalidation_fallback_state: "SUSPENDED"
  });

  assert.equal(result.record.historical_state, "PASS");
  assert.equal(result.record.effective_state, "SUSPENDED");
  assert.equal(result.record.history_preserved, true);
  assert.equal(result.record.proof_verified, true);
}

console.log("PROG_203_HBCE_EG_001_LEVEL1_GOLDEN_FLOW_HARNESS_TEST=PASS");
