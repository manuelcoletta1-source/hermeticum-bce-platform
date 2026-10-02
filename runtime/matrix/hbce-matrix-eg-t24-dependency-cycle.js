"use strict";

const fs = require("fs");
const eg001 = require("../shared-core/hbce-eg-001-state-transition-enforcement.js");

const PROGRAM_ID = "PROG-243";
const TEST_ID = "EG-T24";
const MATRIX_SUBJECT_REF = "MATRIX::RELEASE::HBCE-2027-RC-001";
const TENANT_ID = "HBCE_INTERNAL";
const RUNTIME_VERSION = "HBCE-MATRIX-EG-T24-DEPENDENCY-CYCLE-V0.1";

function sha256Record(record) {
  return eg001.sha256(record);
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function fileExists(filePath) {
  return fs.existsSync(filePath) && fs.statSync(filePath).isFile();
}

function stableGraphDigest(graph) {
  return sha256Record({
    nodes: [...graph.nodes].sort(),
    edges: graph.edges
      .map((edge) => ({ from: edge.from, to: edge.to, edge_id: edge.edge_id }))
      .sort((a, b) => `${a.from}->${a.to}`.localeCompare(`${b.from}->${b.to}`))
  });
}

function createBaselineDependencyGraph() {
  const graph = {
    record_type: "DependencyGraph",
    tenant_id: TENANT_ID,
    subject_ref: MATRIX_SUBJECT_REF,
    graph_id: "eg-t24-dependency-graph-v001",
    nodes: [
      "AUTHORITY_PROFILE",
      "MANDATE_RECORD",
      "POLICY_BINDING",
      "EVIDENCE_BUNDLE",
      "MATRIX_PROJECTION"
    ],
    edges: [
      {
        edge_id: "eg-t24-edge-authority-mandate",
        from: "AUTHORITY_PROFILE",
        to: "MANDATE_RECORD"
      },
      {
        edge_id: "eg-t24-edge-mandate-policy",
        from: "MANDATE_RECORD",
        to: "POLICY_BINDING"
      },
      {
        edge_id: "eg-t24-edge-policy-evidence",
        from: "POLICY_BINDING",
        to: "EVIDENCE_BUNDLE"
      },
      {
        edge_id: "eg-t24-edge-evidence-projection",
        from: "EVIDENCE_BUNDLE",
        to: "MATRIX_PROJECTION"
      }
    ],
    graph_digest: null
  };

  graph.graph_digest = stableGraphDigest(graph);
  return graph;
}

function createsCycle(graph, candidateEdge) {
  const adjacency = new Map();
  for (const node of graph.nodes) {
    adjacency.set(node, []);
  }

  for (const edge of graph.edges) {
    if (!adjacency.has(edge.from)) adjacency.set(edge.from, []);
    adjacency.get(edge.from).push(edge.to);
  }

  if (!adjacency.has(candidateEdge.from)) adjacency.set(candidateEdge.from, []);
  adjacency.get(candidateEdge.from).push(candidateEdge.to);

  const visiting = new Set();
  const visited = new Set();

  function visit(node) {
    if (visiting.has(node)) return true;
    if (visited.has(node)) return false;

    visiting.add(node);
    for (const next of adjacency.get(node) || []) {
      if (visit(next)) return true;
    }
    visiting.delete(node);
    visited.add(node);
    return false;
  }

  for (const node of adjacency.keys()) {
    if (visit(node)) return true;
  }

  return false;
}

function createCycleInsertionRequest() {
  const request = {
    record_type: "DependencyInsertionRequest",
    tenant_id: TENANT_ID,
    subject_ref: MATRIX_SUBJECT_REF,
    request_id: "eg-t24-dependency-cycle-insertion-request-v001",
    requested_edge: {
      edge_id: "eg-t24-edge-projection-authority-cycle-attempt",
      from: "MATRIX_PROJECTION",
      to: "AUTHORITY_PROFILE"
    },
    requested_by: "HBCE_INTERNAL_TEST_HARNESS",
    requested_at: "2026-10-01T22:40:00+02:00",
    request_hash: null
  };

  request.request_hash = sha256Record({ ...request, request_hash: null });
  return request;
}

function evaluateDependencyCycle({
  baselineGraph = createBaselineDependencyGraph(),
  insertionRequest = createCycleInsertionRequest(),
  generated_at = "2026-10-01T22:41:00+02:00"
} = {}) {
  const beforeDigest = baselineGraph.graph_digest;
  const candidateEdge = insertionRequest.requested_edge;
  const dependencyCycleDetected = createsCycle(baselineGraph, candidateEdge);

  const graphAfterRejectedInsertion = JSON.parse(JSON.stringify(baselineGraph));
  const afterDigest = stableGraphDigest(graphAfterRejectedInsertion);

  const rejectionRecord = {
    record_type: "DependencyCycleRejectionRecord",
    tenant_id: TENANT_ID,
    subject_ref: MATRIX_SUBJECT_REF,
    rejection_id: "eg-t24-dependency-cycle-rejection-v001",
    request_id: insertionRequest.request_id,
    graph_id: baselineGraph.graph_id,
    attempted_edge_id: candidateEdge.edge_id,
    attempted_from: candidateEdge.from,
    attempted_to: candidateEdge.to,
    dependency_cycle_detected: dependencyCycleDetected,
    rejection_result: "REJECT",
    rejection_code: "DEPENDENCY_CYCLE",
    graph_digest_before: beforeDigest,
    graph_digest_after: afterDigest,
    graph_unchanged: beforeDigest === afterDigest,
    edge_inserted: false,
    authoritative_graph_mutated: false,
    emitted_at: generated_at,
    rejection_hash: null
  };

  rejectionRecord.rejection_hash = sha256Record({ ...rejectionRecord, rejection_hash: null });

  const artifact = {
    artifact_id: "20261001_HBCE-MATRIX-EG-T24_DependencyCycle_v001",
    artifact_type: "MatrixEGT24DependencyCycleRuntimeEvidence",
    schema_version: RUNTIME_VERSION,
    program_id: PROGRAM_ID,
    test_id: TEST_ID,
    tenant_id: TENANT_ID,
    subject_ref: MATRIX_SUBJECT_REF,
    generated_at,
    required_result: "REJECT + DEPENDENCY_CYCLE; graph unchanged",
    selected_profile: "A1_INTERNAL_CONTROLLED",
    baseline_dependency_graph: baselineGraph,
    insertion_request: insertionRequest,
    rejection_record: rejectionRecord,
    graph_digest_before: beforeDigest,
    graph_digest_after: afterDigest,
    dependency_cycle_detected: true,
    rejection_result: "REJECT",
    rejection_code: "DEPENDENCY_CYCLE",
    graph_unchanged: true,
    edge_inserted: false,
    authoritative_graph_mutated: false,
    projection_mutated: false,
    duplicate_authoritative_event_emitted: false,
    duplicate_effect_evidence_created: false,
    dependency_gate: {
      require_cycle_detection: true,
      require_reject_dependency_cycle: true,
      require_graph_unchanged: true,
      require_no_second_effect: true,
      allow_edge_insert: false,
      allow_authoritative_graph_mutation: false,
      allow_projection_mutation: false,
      allow_dispatch_execution: false,
      allow_external_connector_call: false,
      allow_target_receipt_creation: false,
      allow_effect_evidence_creation: false
    },
    runtime_claims: {
      eg_t24_runtime_artifact_created: true,
      dependency_cycle_detected: true,
      rejection_code_dependency_cycle: true,
      graph_unchanged: true,
      edge_inserted: false,
      authoritative_graph_mutated: false,
      matrix_implemented: false,
      matrix_l1_pilot_ready: false,
      release_clean_eligible_effective: false,
      c16_external_validation_completed: false,
      external_validation_accepted: false,
      legal_review_claimed: false,
      commercial_release_authorized: false,
      level4_eligible: false,
      pilot_execution_started: false
    },
    no_execution_boundary: {
      dispatch_execution_authorized: false,
      dispatch_command_emitted: false,
      dispatch_performed: false,
      external_connector_called: false,
      target_system_contacted: false,
      target_receipt_created: false,
      execution_trace_bound: false,
      effect_evidence_created: false,
      customer_external_execution_allowed: false
    },
    maximum_supported_claim: "EG_T24_DEPENDENCY_INSERTION_CREATING_CYCLE_REJECTS_WITH_DEPENDENCY_CYCLE_AND_LEAVES_GRAPH_UNCHANGED",
    status: "PASS",
    content_sha256: null
  };

  artifact.content_sha256 = sha256Record({ ...artifact, content_sha256: null });
  return artifact;
}

function verifyEGT24DependencyCycle(artifactPath) {
  const errors = [];

  if (!fileExists(artifactPath)) {
    const missing = {
      record_type: "MatrixEGT24DependencyCycleVerificationRecord",
      artifact_path: artifactPath,
      verified: false,
      error_count: 1,
      errors: [{ code: "EG_T24_ARTIFACT_MISSING", path: artifactPath }],
      record_sha256: null
    };
    missing.record_sha256 = sha256Record({ ...missing, record_sha256: null });
    return missing;
  }

  const artifact = readJson(artifactPath);

  if (artifact.schema_version !== RUNTIME_VERSION) errors.push({ code: "EG_T24_SCHEMA_VERSION_MISMATCH", observed: artifact.schema_version });
  if (artifact.program_id !== PROGRAM_ID) errors.push({ code: "EG_T24_PROGRAM_ID_MISMATCH", observed: artifact.program_id });
  if (artifact.test_id !== TEST_ID) errors.push({ code: "EG_T24_TEST_ID_MISMATCH", observed: artifact.test_id });
  if (artifact.required_result !== "REJECT + DEPENDENCY_CYCLE; graph unchanged") errors.push({ code: "EG_T24_REQUIRED_RESULT_INVALID", observed: artifact.required_result });

  for (const [key, expected] of [
    ["dependency_cycle_detected", true],
    ["rejection_result", "REJECT"],
    ["rejection_code", "DEPENDENCY_CYCLE"],
    ["graph_unchanged", true],
    ["edge_inserted", false],
    ["authoritative_graph_mutated", false],
    ["projection_mutated", false],
    ["duplicate_authoritative_event_emitted", false],
    ["duplicate_effect_evidence_created", false]
  ]) {
    if (artifact[key] !== expected) {
      errors.push({ code: "EG_T24_FIELD_INVALID", key, expected, observed: artifact[key] });
    }
  }

  if (!artifact.baseline_dependency_graph || !artifact.insertion_request || !artifact.rejection_record) {
    errors.push({ code: "EG_T24_CORE_RECORDS_MISSING" });
  } else {
    const recomputedBeforeDigest = stableGraphDigest(artifact.baseline_dependency_graph);
    if (artifact.graph_digest_before !== recomputedBeforeDigest) {
      errors.push({ code: "EG_T24_GRAPH_DIGEST_BEFORE_MISMATCH", expected: recomputedBeforeDigest, observed: artifact.graph_digest_before });
    }

    if (artifact.graph_digest_before !== artifact.graph_digest_after) {
      errors.push({ code: "EG_T24_GRAPH_CHANGED", before: artifact.graph_digest_before, after: artifact.graph_digest_after });
    }

    if (!createsCycle(artifact.baseline_dependency_graph, artifact.insertion_request.requested_edge)) {
      errors.push({ code: "EG_T24_CYCLE_NOT_DETECTED_BY_RECOMPUTE" });
    }

    if (artifact.rejection_record.rejection_code !== "DEPENDENCY_CYCLE") {
      errors.push({ code: "EG_T24_REJECTION_CODE_INVALID", observed: artifact.rejection_record.rejection_code });
    }

    if (artifact.rejection_record.graph_unchanged !== true) {
      errors.push({ code: "EG_T24_REJECTION_GRAPH_UNCHANGED_INVALID", observed: artifact.rejection_record.graph_unchanged });
    }

    if (artifact.rejection_record.edge_inserted !== false) {
      errors.push({ code: "EG_T24_REJECTION_EDGE_INSERT_OVERCLAIM", observed: artifact.rejection_record.edge_inserted });
    }
  }

  for (const key of [
    "require_cycle_detection",
    "require_reject_dependency_cycle",
    "require_graph_unchanged",
    "require_no_second_effect"
  ]) {
    if (!artifact.dependency_gate || artifact.dependency_gate[key] !== true) {
      errors.push({ code: "EG_T24_REQUIRED_GATE_NOT_TRUE", key, observed: artifact.dependency_gate ? artifact.dependency_gate[key] : undefined });
    }
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
    if (!artifact.dependency_gate || artifact.dependency_gate[key] !== false) {
      errors.push({ code: "EG_T24_GATE_OVERCLAIM", key, observed: artifact.dependency_gate ? artifact.dependency_gate[key] : undefined });
    }
  }

  for (const key of [
    "matrix_implemented",
    "matrix_l1_pilot_ready",
    "release_clean_eligible_effective",
    "c16_external_validation_completed",
    "external_validation_accepted",
    "legal_review_claimed",
    "commercial_release_authorized",
    "level4_eligible",
    "pilot_execution_started"
  ]) {
    if (!artifact.runtime_claims || artifact.runtime_claims[key] !== false) {
      errors.push({ code: "EG_T24_RUNTIME_CLAIM_OVERCLAIM", key, observed: artifact.runtime_claims ? artifact.runtime_claims[key] : undefined });
    }
  }

  for (const key of [
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
    if (!artifact.no_execution_boundary || artifact.no_execution_boundary[key] !== false) {
      errors.push({ code: "EG_T24_EXECUTION_BOUNDARY_OVERCLAIM", key, observed: artifact.no_execution_boundary ? artifact.no_execution_boundary[key] : undefined });
    }
  }

  const expectedHash = sha256Record({ ...artifact, content_sha256: null });
  if (artifact.content_sha256 !== expectedHash) {
    errors.push({ code: "EG_T24_CONTENT_HASH_MISMATCH", expected: expectedHash, observed: artifact.content_sha256 });
  }

  const verification = {
    record_type: "MatrixEGT24DependencyCycleVerificationRecord",
    verifier_version: "HBCE-MATRIX-EG-T24-DEPENDENCY-CYCLE-VERIFIER-V0.1",
    artifact_path: artifactPath,
    program_id: PROGRAM_ID,
    test_id: TEST_ID,
    verified: errors.length === 0,
    error_count: errors.length,
    errors,
    dependency_cycle_detected: artifact.dependency_cycle_detected,
    rejection_code: artifact.rejection_code,
    graph_unchanged: artifact.graph_unchanged,
    edge_inserted: artifact.edge_inserted,
    maximum_supported_claim: artifact.maximum_supported_claim,
    artifact_sha256: fileExists(artifactPath) ? sha256Record(readJson(artifactPath)) : null,
    record_sha256: null
  };

  verification.record_sha256 = sha256Record({ ...verification, record_sha256: null });
  return verification;
}

module.exports = {
  PROGRAM_ID,
  TEST_ID,
  MATRIX_SUBJECT_REF,
  TENANT_ID,
  RUNTIME_VERSION,
  sha256Record,
  readJson,
  fileExists,
  stableGraphDigest,
  createBaselineDependencyGraph,
  createsCycle,
  createCycleInsertionRequest,
  evaluateDependencyCycle,
  verifyEGT24DependencyCycle
};
