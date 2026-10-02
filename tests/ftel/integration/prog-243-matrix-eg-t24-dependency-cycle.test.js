"use strict";

const assert = require("assert/strict");
const fs = require("fs");
const path = require("path");

const runtime = require(path.join(process.cwd(), "runtime/matrix/hbce-matrix-eg-t24-dependency-cycle.js"));

const artifactPath = "matrix/eg001/evidence/20261001_HBCE-MATRIX-EG-T24_DependencyCycle_v001.json";
const evidencePath = "matrix/eg001/evidence/20261001_HBCE-MATRIX-EG-T24_PROG-243-evidence_v001.json";

{
  assert.equal(runtime.fileExists(artifactPath), true);
  const artifact = runtime.readJson(artifactPath);

  assert.equal(artifact.artifact_type, "MatrixEGT24DependencyCycleRuntimeEvidence");
  assert.equal(artifact.schema_version, runtime.RUNTIME_VERSION);
  assert.equal(artifact.program_id, runtime.PROGRAM_ID);
  assert.equal(artifact.test_id, runtime.TEST_ID);
  assert.equal(artifact.required_result, "REJECT + DEPENDENCY_CYCLE; graph unchanged");
}

{
  const artifact = runtime.readJson(artifactPath);

  assert.equal(artifact.dependency_cycle_detected, true);
  assert.equal(artifact.rejection_result, "REJECT");
  assert.equal(artifact.rejection_code, "DEPENDENCY_CYCLE");
  assert.equal(artifact.graph_unchanged, true);
  assert.equal(artifact.edge_inserted, false);
  assert.equal(artifact.authoritative_graph_mutated, false);
  assert.equal(artifact.projection_mutated, false);
  assert.equal(artifact.duplicate_authoritative_event_emitted, false);
  assert.equal(artifact.duplicate_effect_evidence_created, false);
}

{
  const artifact = runtime.readJson(artifactPath);

  assert.equal(runtime.createsCycle(artifact.baseline_dependency_graph, artifact.insertion_request.requested_edge), true);
  assert.equal(artifact.graph_digest_before, artifact.graph_digest_after);
  assert.equal(artifact.rejection_record.rejection_code, "DEPENDENCY_CYCLE");
  assert.equal(artifact.rejection_record.graph_unchanged, true);
  assert.equal(artifact.rejection_record.edge_inserted, false);
  assert.equal(artifact.rejection_record.authoritative_graph_mutated, false);
}

{
  const artifact = runtime.readJson(artifactPath);

  for (const key of [
    "require_cycle_detection",
    "require_reject_dependency_cycle",
    "require_graph_unchanged",
    "require_no_second_effect"
  ]) {
    assert.equal(artifact.dependency_gate[key], true, key);
  }

  for (const key of [
    "allow_edge_insert",
    "allow_authoritative_graph_mutation",
    "allow_projection_mutation",
    "allow_dispatch_execution",
    "allow_external_connector_call",
    "allow_target_receipt_creation",
    "allow_effect_evidence_creation"
  ]) {
    assert.equal(artifact.dependency_gate[key], false, key);
  }
}

{
  const verification = runtime.verifyEGT24DependencyCycle(artifactPath);

  assert.equal(verification.record_type, "MatrixEGT24DependencyCycleVerificationRecord");
  assert.equal(verification.verified, true);
  assert.equal(verification.error_count, 0);
  assert.deepEqual(verification.errors, []);
  assert.equal(verification.dependency_cycle_detected, true);
  assert.equal(verification.rejection_code, "DEPENDENCY_CYCLE");
  assert.equal(verification.graph_unchanged, true);
  assert.equal(verification.edge_inserted, false);
}

{
  const artifact = runtime.readJson(artifactPath);

  const tmpMutation = "/tmp/hbce-matrix-eg-t24-graph-mutation-overclaim.json";
  const mutated = {
    ...artifact,
    graph_unchanged: false,
    edge_inserted: true,
    authoritative_graph_mutated: true,
    graph_digest_after: runtime.sha256Record({ mutated: true }),
    dependency_gate: {
      ...artifact.dependency_gate,
      allow_edge_insert: true,
      allow_authoritative_graph_mutation: true
    },
    rejection_record: {
      ...artifact.rejection_record,
      graph_unchanged: false,
      edge_inserted: true,
      authoritative_graph_mutated: true
    }
  };
  mutated.content_sha256 = runtime.sha256Record({ ...mutated, content_sha256: null });
  fs.writeFileSync(tmpMutation, JSON.stringify(mutated, null, 2));

  const mutationVerification = runtime.verifyEGT24DependencyCycle(tmpMutation);
  assert.equal(mutationVerification.verified, false);
  assert.ok(mutationVerification.errors.some((error) => [
    "EG_T24_FIELD_INVALID",
    "EG_T24_GRAPH_CHANGED",
    "EG_T24_REJECTION_GRAPH_UNCHANGED_INVALID",
    "EG_T24_REJECTION_EDGE_INSERT_OVERCLAIM",
    "EG_T24_GATE_OVERCLAIM"
  ].includes(error.code)));

  const tmpExecution = "/tmp/hbce-matrix-eg-t24-execution-overclaim.json";
  const executionOverclaim = {
    ...artifact,
    no_execution_boundary: {
      ...artifact.no_execution_boundary,
      dispatch_performed: true,
      external_connector_called: true,
      effect_evidence_created: true
    }
  };
  executionOverclaim.content_sha256 = runtime.sha256Record({ ...executionOverclaim, content_sha256: null });
  fs.writeFileSync(tmpExecution, JSON.stringify(executionOverclaim, null, 2));

  const executionVerification = runtime.verifyEGT24DependencyCycle(tmpExecution);
  assert.equal(executionVerification.verified, false);
  assert.ok(executionVerification.errors.some((error) => error.code === "EG_T24_EXECUTION_BOUNDARY_OVERCLAIM"));
}

{
  const artifact = runtime.readJson(artifactPath);
  const evidence = runtime.readJson(evidencePath);

  assert.equal(evidence.program, runtime.PROGRAM_ID);
  assert.equal(evidence.test_id, runtime.TEST_ID);
  assert.equal(evidence.dependency_cycle_detected, true);
  assert.equal(evidence.rejection_code, "DEPENDENCY_CYCLE");
  assert.equal(evidence.graph_unchanged, true);
  assert.equal(evidence.edge_inserted, false);
  assert.equal(evidence.authoritative_graph_mutated, false);
  assert.equal(evidence.eg_t24_runtime_artifact_created, true);

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
    "dispatch_performed",
    "external_connector_called",
    "target_system_contacted",
    "target_receipt_created",
    "execution_trace_bound",
    "effect_evidence_created",
    "customer_external_execution_allowed"
  ]) {
    assert.equal(evidence[key], false, key);
  }

  assert.equal(artifact.no_execution_boundary.dispatch_performed, false);
  assert.equal(artifact.no_execution_boundary.external_connector_called, false);
  assert.equal(artifact.no_execution_boundary.effect_evidence_created, false);
}

console.log("PROG_243_MATRIX_EG_T24_DEPENDENCY_CYCLE_TEST=PASS");
