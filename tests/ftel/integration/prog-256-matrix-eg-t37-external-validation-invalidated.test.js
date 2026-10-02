"use strict";

const assert = require("assert/strict");
const fs = require("fs");
const path = require("path");

const runtime = require(path.join(process.cwd(), "runtime/matrix/hbce-matrix-eg-t37-external-validation-invalidated.js"));

const artifactPath = "matrix/eg001/evidence/20261001_HBCE-MATRIX-EG-T37_ExternalValidationInvalidated_v001.json";
const evidencePath = "matrix/eg001/evidence/20261001_HBCE-MATRIX-EG-T37_PROG-256-evidence_v001.json";

{
  assert.equal(runtime.fileExists(artifactPath), true);
  const artifact = runtime.readJson(artifactPath);

  assert.equal(artifact.artifact_type, "MatrixEGT37ExternalValidationInvalidatedRuntimeEvidence");
  assert.equal(artifact.schema_version, runtime.RUNTIME_VERSION);
  assert.equal(artifact.program_id, runtime.PROGRAM_ID);
  assert.equal(artifact.test_id, runtime.TEST_ID);
  assert.equal(artifact.required_result, "VALIDATION_STATE -> INVALIDATED and LEVEL_STATE -> LEVEL_4_SUSPENDED/L3PLUS according to trigger; history preserved");
}

{
  const artifact = runtime.readJson(artifactPath);

  assert.equal(artifact.external_validation_invalidated, true);
  assert.equal(artifact.level4_was_eligible_or_accepted, true);
  assert.equal(artifact.validation_state_before, "EXTERNALLY_ACCEPTED");
  assert.equal(artifact.validation_state_after, "INVALIDATED");
  assert.equal(artifact.level_state_before, "LEVEL_4_ELIGIBLE");
  assert.equal(artifact.level_state_after, "LEVEL_4_SUSPENDED");
  assert.equal(artifact.level_state_matches_trigger, true);
  assert.equal(artifact.level4_eligible_after, false);
  assert.equal(artifact.level4_accepted_after, false);
  assert.equal(artifact.history_preserved, true);
  assert.equal(artifact.history_append_only, true);
  assert.equal(artifact.resulting_history_length, artifact.previous_history_length + 1);
  assert.equal(artifact.decision_result, "INVALIDATE_AND_SUSPEND");
  assert.equal(artifact.authoritative_transition_emitted, true);
  assert.equal(artifact.projection_changed, true);
  assert.equal(artifact.dispatch_performed, false);
  assert.equal(artifact.external_connector_called, false);
  assert.equal(artifact.effect_evidence_created, false);
}

{
  const artifact = runtime.readJson(artifactPath);

  assert.equal(artifact.current_state_before_trigger.validation_state, "EXTERNALLY_ACCEPTED");
  assert.equal(artifact.current_state_before_trigger.level_state, "LEVEL_4_ELIGIBLE");
  assert.equal(artifact.current_state_before_trigger.level4_eligible, true);
  assert.equal(artifact.current_state_before_trigger.level4_accepted, true);
  assert.equal(artifact.current_state_before_trigger.state_hash, runtime.sha256Record({ ...artifact.current_state_before_trigger, state_hash: null }));

  assert.equal(artifact.invalidation_trigger.trigger_class, "EXTERNAL_VALIDATION_INVALIDATED");
  assert.equal(artifact.invalidation_trigger.required_validation_state_after, "INVALIDATED");
  assert.equal(artifact.invalidation_trigger.required_level_state_after, "LEVEL_4_SUSPENDED");
  assert.equal(artifact.invalidation_trigger.preserve_history_required, true);
  assert.equal(artifact.invalidation_trigger.trigger_hash, runtime.sha256Record({ ...artifact.invalidation_trigger, trigger_hash: null }));

  assert.equal(artifact.invalidation_event.validation_state_after, "INVALIDATED");
  assert.equal(artifact.invalidation_event.level_state_after, "LEVEL_4_SUSPENDED");
  assert.equal(artifact.invalidation_event.history_preserved, true);
  assert.equal(artifact.invalidation_event.dispatch_performed, false);

  assert.equal(artifact.resulting_state.validation_state, "INVALIDATED");
  assert.equal(artifact.resulting_state.level_state, "LEVEL_4_SUSPENDED");
  assert.equal(artifact.resulting_state.level4_eligible, false);
  assert.equal(artifact.resulting_state.level4_accepted, false);
  assert.equal(artifact.resulting_state.validation_history.length, artifact.resulting_history_length);
  assert.equal(artifact.resulting_state.state_hash, runtime.sha256Record({ ...artifact.resulting_state, state_hash: null }));
}

{
  const trigger = {
    ...runtime.createInvalidationTrigger(),
    severity: "DEMOTE_TO_L3PLUS",
    required_level_state_after: "L3PLUS",
    trigger_hash: null
  };
  trigger.trigger_hash = runtime.sha256Record({ ...trigger, trigger_hash: null });
  const demoted = runtime.evaluateExternalValidationInvalidated({ invalidationTrigger: trigger });

  assert.equal(demoted.validation_state_after, "INVALIDATED");
  assert.equal(demoted.level_state_after, "L3PLUS");
  assert.equal(demoted.level_state_matches_trigger, true);
  assert.equal(demoted.level4_eligible_after, false);
  assert.equal(demoted.history_preserved, true);
}

{
  const artifact = runtime.readJson(artifactPath);

  for (const key of [
    "require_validation_state_invalidated_on_external_invalidation",
    "require_level_state_suspended_or_l3plus_according_to_trigger",
    "require_level4_eligibility_revoked_after_invalidation",
    "require_history_preserved",
    "require_append_only_history",
    "require_no_dispatch_effect"
  ]) {
    assert.equal(artifact.external_validation_invalidation_gate[key], true, key);
  }

  for (const key of [
    "allow_level4_eligible_after_external_invalidation",
    "allow_validation_state_to_remain_accepted",
    "allow_history_rewrite",
    "allow_external_connector_call",
    "allow_effect_evidence_creation"
  ]) {
    assert.equal(artifact.external_validation_invalidation_gate[key], false, key);
  }
}

{
  const verification = runtime.verifyEGT37ExternalValidationInvalidated(artifactPath);

  assert.equal(verification.record_type, "MatrixEGT37ExternalValidationInvalidatedVerificationRecord");
  assert.equal(verification.verified, true);
  assert.equal(verification.error_count, 0);
  assert.deepEqual(verification.errors, []);
  assert.equal(verification.validation_state_after, "INVALIDATED");
  assert.equal(verification.level_state_after, "LEVEL_4_SUSPENDED");
  assert.equal(verification.level_state_matches_trigger, true);
  assert.equal(verification.history_preserved, true);
  assert.equal(verification.history_append_only, true);
  assert.equal(verification.level4_eligible_after, false);
  assert.equal(verification.level4_accepted_after, false);
}

{
  const artifact = runtime.readJson(artifactPath);

  const tmpInvalidationOverclaim = "/tmp/hbce-matrix-eg-t37-invalidation-overclaim.json";
  const invalidationOverclaim = {
    ...artifact,
    validation_state_after: "EXTERNALLY_ACCEPTED",
    level_state_after: "LEVEL_4_ELIGIBLE",
    level_state_matches_trigger: false,
    level4_eligible_after: true,
    level4_accepted_after: true,
    history_preserved: false,
    history_append_only: false,
    resulting_history_length: artifact.previous_history_length,
    resulting_state: {
      ...artifact.resulting_state,
      validation_state: "EXTERNALLY_ACCEPTED",
      level_state: "LEVEL_4_ELIGIBLE",
      level4_eligible: true,
      level4_accepted: true,
      validation_history: artifact.current_state_before_trigger.validation_history,
      state_hash: null
    },
    external_validation_invalidation_gate: {
      ...artifact.external_validation_invalidation_gate,
      allow_level4_eligible_after_external_invalidation: true,
      allow_validation_state_to_remain_accepted: true,
      allow_history_rewrite: true
    }
  };
  invalidationOverclaim.resulting_state.state_hash = runtime.sha256Record({ ...invalidationOverclaim.resulting_state, state_hash: null });
  invalidationOverclaim.content_sha256 = runtime.sha256Record({ ...invalidationOverclaim, content_sha256: null });
  fs.writeFileSync(tmpInvalidationOverclaim, JSON.stringify(invalidationOverclaim, null, 2));

  const invalidationVerification = runtime.verifyEGT37ExternalValidationInvalidated(tmpInvalidationOverclaim);
  assert.equal(invalidationVerification.verified, false);
  assert.ok(invalidationVerification.errors.some((error) => [
    "EG_T37_FIELD_INVALID",
    "EG_T37_LEVEL_STATE_DOES_NOT_MATCH_TRIGGER",
    "EG_T37_RESULTING_VALIDATION_STATE_NOT_INVALIDATED",
    "EG_T37_RESULTING_LEVEL4_FLAGS_OVERCLAIM",
    "EG_T37_HISTORY_NOT_APPEND_ONLY",
    "EG_T37_GATE_OVERCLAIM"
  ].includes(error.code)));

  const tmpBoundaryOverclaim = "/tmp/hbce-matrix-eg-t37-boundary-overclaim.json";
  const boundaryOverclaim = {
    ...artifact,
    no_execution_boundary: {
      ...artifact.no_execution_boundary,
      dispatch_performed: true,
      external_connector_called: true,
      effect_evidence_created: true
    }
  };
  boundaryOverclaim.content_sha256 = runtime.sha256Record({ ...boundaryOverclaim, content_sha256: null });
  fs.writeFileSync(tmpBoundaryOverclaim, JSON.stringify(boundaryOverclaim, null, 2));

  const boundaryVerification = runtime.verifyEGT37ExternalValidationInvalidated(tmpBoundaryOverclaim);
  assert.equal(boundaryVerification.verified, false);
  assert.ok(boundaryVerification.errors.some((error) => error.code === "EG_T37_EXECUTION_BOUNDARY_OVERCLAIM"));
}

{
  const artifact = runtime.readJson(artifactPath);
  const evidence = runtime.readJson(evidencePath);

  assert.equal(evidence.program, runtime.PROGRAM_ID);
  assert.equal(evidence.test_id, runtime.TEST_ID);
  assert.equal(evidence.external_validation_invalidated, true);
  assert.equal(evidence.level4_was_eligible_or_accepted, true);
  assert.equal(evidence.validation_state_after, "INVALIDATED");
  assert.equal(evidence.level_state_after, "LEVEL_4_SUSPENDED");
  assert.equal(evidence.level_state_matches_trigger, true);
  assert.equal(evidence.level4_eligible_after, false);
  assert.equal(evidence.level4_accepted_after, false);
  assert.equal(evidence.history_preserved, true);
  assert.equal(evidence.history_append_only, true);
  assert.equal(evidence.dispatch_performed, false);
  assert.equal(evidence.external_connector_called, false);
  assert.equal(evidence.effect_evidence_created, false);
  assert.equal(evidence.eg_t37_runtime_artifact_created, true);

  for (const key of [
    "matrix_implemented",
    "matrix_l1_pilot_ready",
    "release_clean_eligible_effective",
    "c16_external_validation_currently_valid",
    "external_validation_accepted_currently",
    "legal_review_claimed",
    "commercial_release_authorized",
    "level4_currently_eligible",
    "pilot_execution_started",
    "dispatch_execution_authorized",
    "dispatch_command_emitted",
    "execution_trace_bound",
    "customer_external_execution_allowed"
  ]) {
    assert.equal(evidence[key], false, key);
  }

  assert.equal(artifact.no_execution_boundary.dispatch_performed, false);
  assert.equal(artifact.no_execution_boundary.external_connector_called, false);
  assert.equal(artifact.no_execution_boundary.effect_evidence_created, false);
}

console.log("PROG_256_MATRIX_EG_T37_EXTERNAL_VALIDATION_INVALIDATED_TEST=PASS");
