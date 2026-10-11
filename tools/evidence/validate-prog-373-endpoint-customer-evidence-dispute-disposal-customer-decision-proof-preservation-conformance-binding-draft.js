#!/usr/bin/env node
"use strict";

const fs = require("fs");
const assert = require("assert");

const MANIFEST =
  "evidence/authorization/20261011_HBCE_ENDPOINT_CUSTOMER_EVIDENCE_DISPUTE_DISPOSAL_CUSTOMER_DECISION_PROOF_PRESERVATION_CONFORMANCE_BINDING_DRAFT_v001.json";

const EXPECTED_OBJECT_ID =
  "HBCE-ENDPOINT-CUSTOMER-EVIDENCE-DISPUTE-DISPOSAL-CUSTOMER-DECISION-PROOF-PRESERVATION-CONFORMANCE-BINDING-DRAFT-V001";

const STEM =
  "ENDPOINT_CUSTOMER_EVIDENCE_DISPUTE_DISPOSAL_CUSTOMER_DECISION_PROOF_PRESERVATION_CONFORMANCE_BINDING_DRAFT";

const ACTIVE_STATUS =
  "ACTIVE_ENDPOINT_CUSTOMER_EVIDENCE_DISPUTE_DISPOSAL_CUSTOMER_DECISION_PROOF_PRESERVATION_CONFORMANCE_BINDING_DRAFT";

const PASS_RESULT =
  "PASS_ENDPOINT_CUSTOMER_EVIDENCE_DISPUTE_DISPOSAL_CUSTOMER_DECISION_PROOF_PRESERVATION_CONFORMANCE_BINDING_DRAFT";

const FINAL_AUDIT_MARKER =
  "HBCE_ENDPOINT_CUSTOMER_EVIDENCE_DISPUTE_DISPOSAL_CUSTOMER_DECISION_PROOF_PRESERVATION_CONFORMANCE_BINDING_DRAFT_FINAL_AUDIT=1";

const FIELD_ARRAY =
  "required_endpoint_customer_evidence_dispute_disposal_customer_decision_proof_preservation_conformance_fields";

function readJson(path) {
  return JSON.parse(fs.readFileSync(path, "utf8"));
}

function expectFalse(d, key) {
  assert.strictEqual(d[key], false, `${key} must remain false`);
}

function expectBoundaryIncludes(boundary, fragment) {
  assert(
    boundary.includes(fragment),
    `BOUNDARY_FRAGMENT_MISSING: ${fragment}`
  );
}

function validateManifest(d) {
  assert.strictEqual(d.program, "PROG-373");
  assert.strictEqual(d.object_id, EXPECTED_OBJECT_ID);
  assert.strictEqual(
    d.artifact_type,
    "HBCEEndpointCustomerEvidenceDisputeDisposalCustomerDecisionProofPreservationConformanceBindingDraft"
  );
  assert.strictEqual(d.classification, "R_AND_D_PRESERVATION_CONFORMANCE_BINDING_DRAFT_ONLY");
  assert.strictEqual(d.version, "v001");

  assert.strictEqual(d.parent_program, "PROG-372");
  assert.strictEqual(
    d.parent_object_id,
    "HBCE-ENDPOINT-CUSTOMER-EVIDENCE-DISPUTE-DISPOSAL-CUSTOMER-DECISION-PROOF-ARCHIVE-CONFORMANCE-BINDING-DRAFT-V001"
  );
  assert.strictEqual(d.parent_commit, "c9e494150617dfe78b5104316794db90d3e1f427");
  assert.strictEqual(d.basis_main_commit, "c9e494150617dfe78b5104316794db90d3e1f427");

  const pending =
    d.status === "DRAFT_PENDING_VALIDATION" &&
    d.marker === `${STEM}=PENDING_VALIDATION` &&
    d.result === "PENDING_VALIDATION";

  const active =
    d.status === ACTIVE_STATUS &&
    d.marker === `${STEM}=PASS` &&
    d.result === PASS_RESULT &&
    d.final_audit_marker === FINAL_AUDIT_MARKER;

  assert(pending || active, "manifest must be pending validation or active pass");

  if (pending) {
    assert.strictEqual(Object.prototype.hasOwnProperty.call(d, "final_audit_marker"), false);
  }

  assert.strictEqual(d.binding_state, "CONTROLLED_DRAFT_PENDING_VALIDATION");
  assert.strictEqual(d.source_chain_model, "COUNT_ONLY_PARENT_CHAIN_REFERENCE_PLUS_PROG_373_PRESERVATION_ENTRY");
  assert.strictEqual(d.source_chain_storage, "COUNT_ONLY_NO_EMBEDDED_PARENT_SOURCE_CHAIN_ARRAY");
  assert.strictEqual(Array.isArray(d.source_chain), false);
  assert.strictEqual(d.parent_source_chain_entry_count, 90);
  assert.strictEqual(d.source_chain_entry_count, 91);

  assert.strictEqual(d.source_chain_append_entry.program, "PROG-373");
  assert.strictEqual(d.source_chain_append_entry.object_id, EXPECTED_OBJECT_ID);
  assert.strictEqual(d.source_chain_append_entry.parent_program, "PROG-372");
  assert.strictEqual(
    d.source_chain_append_entry.parent_object_id,
    "HBCE-ENDPOINT-CUSTOMER-EVIDENCE-DISPUTE-DISPOSAL-CUSTOMER-DECISION-PROOF-ARCHIVE-CONFORMANCE-BINDING-DRAFT-V001"
  );
  assert.strictEqual(d.source_chain_append_entry.parent_source_chain_entry_count, 90);
  assert.strictEqual(d.source_chain_append_entry.source_chain_entry_count, 91);

  assert.strictEqual(d.conformance_scope, "PRESERVATION_CONFORMANCE_BINDING_DRAFT_ONLY");
  assert.strictEqual(d.preservation_scope, "FUTURE_ADMISSIBLE_PRESERVATION_EVIDENCE_REQUIRED");
  assert.strictEqual(d.preservation_record_class, "CONTROLLED_R_AND_D_DRAFT_NO_ACTUAL_PRESERVATION");
  assert.strictEqual(d.binding_scope, "PRESERVATION_CONFORMANCE_ONLY");
  assert.strictEqual(d.binding_mode, "DRAFT_BINDING_NO_EXECUTION");

  assert(Array.isArray(d[FIELD_ARRAY]), "required preservation field array missing");
  assert.strictEqual(d[FIELD_ARRAY].length, 152);
  assert.strictEqual(
    d.required_endpoint_customer_evidence_dispute_disposal_customer_decision_proof_preservation_conformance_field_count,
    152
  );

  assert(Array.isArray(d.binding_rules), "binding_rules must be array");
  assert.strictEqual(d.binding_rules.length, 152);
  assert.strictEqual(d.binding_rule_count, 152);

  assert(Array.isArray(d.future_resolution_requirements), "future_resolution_requirements must be array");
  assert.strictEqual(d.future_resolution_requirements.length, 535);
  assert.strictEqual(d.future_resolution_requirement_count, 535);

  assert(Array.isArray(d.future_customer_decision_proof_preservation_false_keys), "false key array missing");
  assert.strictEqual(d.future_customer_decision_proof_preservation_false_keys.length, 330);
  assert.strictEqual(d.future_customer_decision_proof_preservation_false_key_count, 330);
  assert.strictEqual(d.all_customer_decision_proof_preservation_false_key_count, 330);
  assert.strictEqual(d.missing_future_customer_decision_proof_preservation_false_key_count, 0);

  assert(Array.isArray(d.explicit_non_claims), "explicit_non_claims must be array");
  assert.strictEqual(d.explicit_non_claims.length, 13738);
  assert.strictEqual(d.required_non_claim_count, 13738);

  assert(Array.isArray(d.no_execution_boundary), "no_execution_boundary must be array");
  assert.strictEqual(d.no_execution_boundary.length, 13738);
  assert.strictEqual(d.required_no_execution_boundary_count, 13738);

  assert.strictEqual(d.false_claim_property_count, 8951);

  for (const rule of d.binding_rules) {
    assert.strictEqual(rule.required, true);
    assert.strictEqual(rule.boundary, "PRESERVATION_CONFORMANCE_DRAFT_ONLY");
    assert.strictEqual(typeof rule.rule_id, "string");
    assert(rule.rule_id.startsWith("PROG-373-PRESERVATION-BINDING-RULE-"));
    assert.strictEqual(typeof rule.field, "string");
    assert(d[FIELD_ARRAY].includes(rule.field), `binding field not listed: ${rule.field}`);
    assert.strictEqual(typeof rule.failure_result, "string");
    assert(rule.failure_result.startsWith("PRESERVATION_CONFORMANCE_DENY_"));
  }

  for (const boundary of d.no_execution_boundary) {
    assert.strictEqual(boundary.execution_allowed, false);
    assert.strictEqual(boundary.readiness_allowed, false);
    assert.strictEqual(boundary.legal_reliance_allowed, false);
  }

  for (const key of d.future_customer_decision_proof_preservation_false_keys) {
    expectFalse(d, key);
  }

  for (const key of [
    "customer_acknowledgment_ready",
    "customer_acceptance_ready",
    "customer_closure_ready",
    "retention_ready",
    "customer_retention_ready",
    "archive_ready",
    "customer_archive_ready",
    "preservation_ready",
    "customer_preservation_ready",
    "disposition_ready",
    "destruction_ready",
    "finalization_ready",
    "customer_ready",
    "customer_use_ready",
    "customer_access_ready",
    "customer_reliance_ready",
    "commercial_ready",
    "production_ready",
    "deployment_ready",
    "runtime_ready",
    "operational_ready",
    "external_reliance_allowed",
    "commercial_reliance_allowed",
    "customer_reliance_allowed",
    "legal_reliance_allowed",
    "legal_finality_ready",
    "legal_validity_ready",
    "legal_certification_ready",
    "external_archive_storage_created",
    "external_preservation_storage_created",
    "deployment_retention",
    "deployment_archive",
    "deployment_preservation",
    "deployment_closure",
    "deployment_completion",
    "deployment_success",
    "deployment_authorization",
    "deployment_execution",
    "deployment_execution_gate_open",
    "opc_allow"
  ]) {
    expectFalse(d, key);
  }

  const boundaryText = [
    d.source_document_boundary_statement,
    d.endpoint_customer_evidence_dispute_disposal_customer_decision_proof_preservation_boundary_statement,
    d.non_inference_rule,
    d.unknown_precedence_rule
  ].filter(Boolean).join("\n");

  for (const fragment of [
    "Archive Conformance draft does not imply Preservation",
    "Archive Conformance draft does not imply actual preservation",
    "Preservation Conformance draft does not imply actual preservation",
    "Preservation Conformance draft does not create preservation",
    "Preservation Conformance draft does not create disposition",
    "Preservation Conformance draft does not create destruction",
    "Preservation Conformance draft does not create external preservation storage",
    "Preservation Conformance draft does not create legal finality",
    "Preservation Conformance draft does not create legal validity",
    "Preservation Conformance draft does not create legal certification",
    "Preservation Conformance draft != preserved",
    "Archive does not imply preservation",
    "Preservation does not imply disposition",
    "Preservation does not imply destruction",
    "Preservation does not imply legal finality",
    "Preservation does not imply verification",
    "Preservation does not imply deployment preservation",
    "DISPATCHED != EXECUTED",
    "EXECUTED != CONSEQUENCE",
    "Receipt does not imply verification",
    "Custody does not imply verification",
    "Missing evidence remains UNKNOWN or INSUFFICIENT_EVIDENCE",
    "UNKNOWN prevails over preservation claims",
    "UNKNOWN_OR_INSUFFICIENT_EVIDENCE_PRECEDES_PRESERVATION_CLAIMS"
  ]) {
    expectBoundaryIncludes(boundaryText, fragment);
  }

  assert(
    d.future_resolution_requirements.includes("FUTURE_UNKNOWN_OR_INSUFFICIENT_EVIDENCE_PRECEDES_PRESERVATION_CLAIMS"),
    "future UNKNOWN precedence requirement missing"
  );
  assert(
    d.future_resolution_requirements.includes("FUTURE_ARCHIVE_DOES_NOT_IMPLY_PRESERVATION_CONFIRMATION"),
    "archive-not-preservation future requirement missing"
  );
  assert(
    d.future_resolution_requirements.includes("FUTURE_PRESERVATION_DOES_NOT_CREATE_EXTERNAL_PRESERVATION_STORAGE_CONFIRMATION"),
    "external preservation storage future requirement missing"
  );

  return {
    object_id: d.object_id,
    program: d.program,
    status: d.status,
    marker: d.marker,
    result: d.result,
    final_audit_marker: d.final_audit_marker || null,
    parent_source_chain_entry_count: d.parent_source_chain_entry_count,
    source_chain_entry_count: d.source_chain_entry_count,
    field_count: d.required_endpoint_customer_evidence_dispute_disposal_customer_decision_proof_preservation_conformance_field_count,
    binding_rule_count: d.binding_rule_count,
    future_resolution_requirement_count: d.future_resolution_requirement_count,
    required_non_claim_count: d.required_non_claim_count,
    required_no_execution_boundary_count: d.required_no_execution_boundary_count,
    false_claim_property_count: d.false_claim_property_count,
    preservation_false_key_count: d.future_customer_decision_proof_preservation_false_key_count,
    archive_ready: d.archive_ready,
    customer_archive_ready: d.customer_archive_ready,
    preservation_ready: d.preservation_ready,
    customer_preservation_ready: d.customer_preservation_ready,
    customer_ready: d.customer_ready,
    production_ready: d.production_ready,
    external_archive_storage_created: d.external_archive_storage_created,
    external_preservation_storage_created: d.external_preservation_storage_created
  };
}

const manifest = readJson(MANIFEST);
const output = validateManifest(manifest);

console.log(JSON.stringify(output, null, 2));
if (manifest.status === "DRAFT_PENDING_VALIDATION") {
  console.log("PROG_373_ENDPOINT_CUSTOMER_EVIDENCE_DISPUTE_DISPOSAL_CUSTOMER_DECISION_PROOF_PRESERVATION_CONFORMANCE_BINDING_DRAFT_PENDING_VALIDATION=PASS");
} else {
  console.log("HBCE_ENDPOINT_CUSTOMER_EVIDENCE_DISPUTE_DISPOSAL_CUSTOMER_DECISION_PROOF_PRESERVATION_CONFORMANCE_BINDING_DRAFT_FINAL_AUDIT=1");
}
