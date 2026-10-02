"use strict";

const assert = require("assert/strict");
const fs = require("fs");
const path = require("path");

const runtime = require(path.join(process.cwd(), "runtime/matrix/hbce-matrix-eg-t34-blind-retry-forbidden.js"));

const artifactPath = "matrix/eg001/evidence/20261001_HBCE-MATRIX-EG-T34_BlindRetryForbidden_v001.json";
const evidencePath = "matrix/eg001/evidence/20261001_HBCE-MATRIX-EG-T34_PROG-253-evidence_v001.json";

{
  assert.equal(runtime.fileExists(artifactPath), true);
  const artifact = runtime.readJson(artifactPath);

  assert.equal(artifact.artifact_type, "MatrixEGT34BlindRetryForbiddenRuntimeEvidence");
  assert.equal(artifact.schema_version, runtime.RUNTIME_VERSION);
  assert.equal(artifact.program_id, runtime.PROGRAM_ID);
  assert.equal(artifact.test_id, runtime.TEST_ID);
  assert.equal(artifact.required_result, "BLOCK + BLIND_RETRY_FORBIDDEN; reconciliation required");
}

{
  const artifact = runtime.readJson(artifactPath);

  assert.equal(artifact.execution_unknown, true);
  assert.equal(artifact.duplicate_effect_possible, true);
  assert.equal(artifact.blind_retry_requested, true);
  assert.equal(artifact.reconciliation_performed, false);
  assert.equal(artifact.reconciliation_required, true);
  assert.equal(artifact.decision_result, "BLOCK");
  assert.equal(artifact.block_code, "BLIND_RETRY_FORBIDDEN");
  assert.equal(artifact.blind_retry_allowed, false);
  assert.equal(artifact.retry_dispatch_blocked, true);
  assert.equal(artifact.retry_dispatched, false);
  assert.equal(artifact.original_execution_state_preserved, true);
  assert.equal(artifact.previous_execution_state_hash, artifact.resulting_execution_state_hash);
  assert.equal(artifact.dispatch_performed, false);
  assert.equal(artifact.external_connector_called, false);
  assert.equal(artifact.effect_evidence_created, false);
}

{
  const artifact = runtime.readJson(artifactPath);

  assert.equal(artifact.execution_unknown_state.execution_status, "EXECUTION_UNKNOWN");
  assert.equal(artifact.execution_unknown_state.duplicate_effect_possible, true);
  assert.equal(artifact.execution_unknown_state.reconciliation_state, "REQUIRED");
  assert.equal(artifact.execution_unknown_state.blind_retry_safe, false);

  assert.equal(artifact.blind_retry_attempt.blind_retry_requested, true);
  assert.equal(artifact.blind_retry_attempt.reconciliation_performed, false);
  assert.equal(artifact.blind_retry_attempt.duplicate_effect_possible, true);

  assert.equal(artifact.block_event.block_code, "BLIND_RETRY_FORBIDDEN");
  assert.equal(artifact.block_event.reconciliation_required, true);
  assert.equal(artifact.block_event.blind_retry_allowed, false);
  assert.equal(artifact.block_event.retry_dispatched, false);
  assert.equal(artifact.block_event.dispatch_performed, false);
  assert.equal(artifact.block_event.external_connector_called, false);
  assert.equal(artifact.block_event.effect_evidence_created, false);
}

{
  const artifact = runtime.readJson(artifactPath);

  for (const key of [
    "require_reconciliation_for_execution_unknown",
    "require_block_blind_retry_when_duplicate_effect_possible",
    "require_no_retry_dispatch_without_reconciliation",
    "require_execution_state_preserved_on_block",
    "require_no_second_effect"
  ]) {
    assert.equal(artifact.blind_retry_gate[key], true, key);
  }

  for (const key of [
    "allow_blind_retry_without_reconciliation",
    "allow_retry_dispatch_when_duplicate_effect_possible",
    "allow_external_connector_call_on_blind_retry",
    "allow_target_receipt_creation_on_blind_retry",
    "allow_effect_evidence_creation_on_blind_retry"
  ]) {
    assert.equal(artifact.blind_retry_gate[key], false, key);
  }
}

{
  const verification = runtime.verifyEGT34BlindRetryForbidden(artifactPath);

  assert.equal(verification.record_type, "MatrixEGT34BlindRetryForbiddenVerificationRecord");
  assert.equal(verification.verified, true);
  assert.equal(verification.error_count, 0);
  assert.deepEqual(verification.errors, []);
  assert.equal(verification.execution_unknown, true);
  assert.equal(verification.duplicate_effect_possible, true);
  assert.equal(verification.block_code, "BLIND_RETRY_FORBIDDEN");
  assert.equal(verification.reconciliation_required, true);
  assert.equal(verification.retry_dispatch_blocked, true);
  assert.equal(verification.retry_dispatched, false);
}

{
  const artifact = runtime.readJson(artifactPath);

  const tmpBlindRetryOverclaim = "/tmp/hbce-matrix-eg-t34-blind-retry-overclaim.json";
  const blindRetryOverclaim = {
    ...artifact,
    reconciliation_performed: true,
    reconciliation_required: false,
    decision_result: "ALLOW",
    block_code: null,
    blind_retry_allowed: true,
    retry_dispatch_blocked: false,
    retry_dispatched: true,
    dispatch_allowed: true,
    dispatch_performed: true,
    external_connector_called: true,
    target_system_contacted: true,
    target_receipt_created: true,
    effect_evidence_created: true,
    execution_unknown_state: {
      ...artifact.execution_unknown_state,
      execution_status: "RETRIED",
      duplicate_effect_possible: false,
      reconciliation_state: "NOT_REQUIRED",
      blind_retry_safe: true
    },
    blind_retry_attempt: {
      ...artifact.blind_retry_attempt,
      reconciliation_performed: true
    },
    block_event: {
      ...artifact.block_event,
      block_code: null,
      reconciliation_required: false,
      blind_retry_allowed: true,
      retry_dispatched: true,
      dispatch_performed: true,
      external_connector_called: true,
      target_system_contacted: true,
      target_receipt_created: true,
      effect_evidence_created: true
    },
    blind_retry_gate: {
      ...artifact.blind_retry_gate,
      allow_blind_retry_without_reconciliation: true,
      allow_retry_dispatch_when_duplicate_effect_possible: true,
      allow_external_connector_call_on_blind_retry: true,
      allow_target_receipt_creation_on_blind_retry: true,
      allow_effect_evidence_creation_on_blind_retry: true
    }
  };
  blindRetryOverclaim.execution_unknown_state.state_hash = runtime.sha256Record({ ...blindRetryOverclaim.execution_unknown_state, state_hash: null });
  blindRetryOverclaim.content_sha256 = runtime.sha256Record({ ...blindRetryOverclaim, content_sha256: null });
  fs.writeFileSync(tmpBlindRetryOverclaim, JSON.stringify(blindRetryOverclaim, null, 2));

  const blindRetryVerification = runtime.verifyEGT34BlindRetryForbidden(tmpBlindRetryOverclaim);
  assert.equal(blindRetryVerification.verified, false);
  assert.ok(blindRetryVerification.errors.some((error) => [
    "EG_T34_FIELD_INVALID",
    "EG_T34_EXECUTION_STATUS_INVALID",
    "EG_T34_DUPLICATE_EFFECT_NOT_MARKED_POSSIBLE",
    "EG_T34_RETRY_ATTEMPT_RECONCILIATION_OVERCLAIM",
    "EG_T34_BLOCK_EVENT_CODE_INVALID",
    "EG_T34_BLOCK_EVENT_RECONCILIATION_NOT_REQUIRED",
    "EG_T34_BLOCK_EVENT_OVERCLAIM",
    "EG_T34_GATE_OVERCLAIM"
  ].includes(error.code)));

  const tmpBoundaryOverclaim = "/tmp/hbce-matrix-eg-t34-boundary-overclaim.json";
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

  const boundaryVerification = runtime.verifyEGT34BlindRetryForbidden(tmpBoundaryOverclaim);
  assert.equal(boundaryVerification.verified, false);
  assert.ok(boundaryVerification.errors.some((error) => error.code === "EG_T34_EXECUTION_BOUNDARY_OVERCLAIM"));
}

{
  const artifact = runtime.readJson(artifactPath);
  const evidence = runtime.readJson(evidencePath);

  assert.equal(evidence.program, runtime.PROGRAM_ID);
  assert.equal(evidence.test_id, runtime.TEST_ID);
  assert.equal(evidence.execution_unknown, true);
  assert.equal(evidence.duplicate_effect_possible, true);
  assert.equal(evidence.blind_retry_requested, true);
  assert.equal(evidence.reconciliation_performed, false);
  assert.equal(evidence.reconciliation_required, true);
  assert.equal(evidence.decision_result, "BLOCK");
  assert.equal(evidence.block_code, "BLIND_RETRY_FORBIDDEN");
  assert.equal(evidence.blind_retry_allowed, false);
  assert.equal(evidence.retry_dispatch_blocked, true);
  assert.equal(evidence.retry_dispatched, false);
  assert.equal(evidence.dispatch_performed, false);
  assert.equal(evidence.external_connector_called, false);
  assert.equal(evidence.effect_evidence_created, false);
  assert.equal(evidence.eg_t34_runtime_artifact_created, true);

  for (const key of [
    "matrix_implemented",
    "matrix_l1_pilot_ready",
    "release_clean_eligible_effective",
    "c16_external_validation_completed",
    "external_validation_accepted",
    "legal_review_claimed",
    "commercial_release_authorized",
    "level4_eligible",
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

console.log("PROG_253_MATRIX_EG_T34_BLIND_RETRY_FORBIDDEN_TEST=PASS");
