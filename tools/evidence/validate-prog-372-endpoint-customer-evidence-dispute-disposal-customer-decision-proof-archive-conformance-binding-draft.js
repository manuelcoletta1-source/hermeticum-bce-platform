#!/usr/bin/env node
"use strict";

const fs = require("fs");
const assert = require("assert");

const manifestPath =
  "evidence/authorization/20261011_HBCE_ENDPOINT_CUSTOMER_EVIDENCE_DISPUTE_DISPOSAL_CUSTOMER_DECISION_PROOF_ARCHIVE_CONFORMANCE_BINDING_DRAFT_v001.json";

const stem =
  "ENDPOINT_CUSTOMER_EVIDENCE_DISPUTE_DISPOSAL_CUSTOMER_DECISION_PROOF_ARCHIVE_CONFORMANCE_BINDING_DRAFT";

const finalAuditMarker =
  "HBCE_ENDPOINT_CUSTOMER_EVIDENCE_DISPUTE_DISPOSAL_CUSTOMER_DECISION_PROOF_ARCHIVE_CONFORMANCE_BINDING_DRAFT_FINAL_AUDIT=1";

const d = JSON.parse(fs.readFileSync(manifestPath, "utf8"));

assert.strictEqual(
  d.object_id,
  "HBCE-ENDPOINT-CUSTOMER-EVIDENCE-DISPUTE-DISPOSAL-CUSTOMER-DECISION-PROOF-ARCHIVE-CONFORMANCE-BINDING-DRAFT-V001"
);
assert.strictEqual(d.program, "PROG-372");
assert.strictEqual(d.artifact_type, "HBCEEndpointCustomerEvidenceDisputeDisposalCustomerDecisionProofArchiveConformanceBindingDraft");
assert.strictEqual(d.classification, "R_AND_D_ARCHIVE_CONFORMANCE_BINDING_DRAFT_ONLY");
assert.strictEqual(d.version, "v001");

assert.strictEqual(d.status, "ACTIVE_ENDPOINT_CUSTOMER_EVIDENCE_DISPUTE_DISPOSAL_CUSTOMER_DECISION_PROOF_ARCHIVE_CONFORMANCE_BINDING_DRAFT");
assert.strictEqual(d.marker, stem + "=PASS");
assert.strictEqual(d.result, "PASS_ENDPOINT_CUSTOMER_EVIDENCE_DISPUTE_DISPOSAL_CUSTOMER_DECISION_PROOF_ARCHIVE_CONFORMANCE_BINDING_DRAFT");
assert.strictEqual(d.binding_state, "CONTROLLED_ACTIVE_VALIDATED");
assert.strictEqual(d.final_audit_marker, finalAuditMarker);

assert.strictEqual(d.parent_program, "PROG-371");
assert.strictEqual(
  d.parent_object_id,
  "HBCE-ENDPOINT-CUSTOMER-EVIDENCE-DISPUTE-DISPOSAL-CUSTOMER-DECISION-PROOF-RETENTION-CONFORMANCE-BINDING-DRAFT-V001"
);
assert.strictEqual(d.parent_commit, "93fb6e196d71a06e64482a3d0c1765769d2bbbcb");
assert.strictEqual(d.basis_main_commit, "93fb6e196d71a06e64482a3d0c1765769d2bbbcb");

assert.strictEqual(d.source_chain_model, "COUNT_ONLY_PARENT_CHAIN_REFERENCE_PLUS_PROG_372_ARCHIVE_ENTRY");
assert.strictEqual(d.source_chain_storage, "COUNT_ONLY_NO_EMBEDDED_PARENT_SOURCE_CHAIN_ARRAY");
assert.strictEqual(Array.isArray(d.source_chain), false);
assert.strictEqual(d.parent_source_chain_entry_count, 89);
assert.strictEqual(d.source_chain_entry_count, 90);

assert.strictEqual(d.source_chain_append_entry.program, "PROG-372");
assert.strictEqual(d.source_chain_append_entry.object_id, d.object_id);
assert.strictEqual(d.source_chain_append_entry.parent_program, "PROG-371");
assert.strictEqual(d.source_chain_append_entry.parent_source_chain_entry_count, 89);
assert.strictEqual(d.source_chain_append_entry.source_chain_entry_count, 90);

assert.strictEqual(d.conformance_scope, "ARCHIVE_CONFORMANCE_BINDING_DRAFT_ONLY");
assert.strictEqual(d.archive_scope, "FUTURE_ADMISSIBLE_ARCHIVE_EVIDENCE_REQUIRED");
assert.strictEqual(d.archive_record_class, "CONTROLLED_R_AND_D_DRAFT_NO_ACTUAL_ARCHIVE");
assert.strictEqual(d.binding_scope, "ARCHIVE_CONFORMANCE_ONLY");
assert.strictEqual(d.binding_mode, "DRAFT_BINDING_NO_EXECUTION");

const fieldName =
  "required_endpoint_customer_evidence_dispute_disposal_customer_decision_proof_archive_conformance_fields";

assert(Array.isArray(d[fieldName]));
assert.strictEqual(d[fieldName].length, 152);
assert.strictEqual(new Set(d[fieldName]).size, 152);
assert.strictEqual(d.required_endpoint_customer_evidence_dispute_disposal_customer_decision_proof_archive_conformance_field_count, 152);

assert(Array.isArray(d.binding_rules));
assert.strictEqual(d.binding_rule_count, 152);
assert.strictEqual(d.binding_rules.length, 152);

assert(Array.isArray(d.future_resolution_requirements));
assert.strictEqual(d.future_resolution_requirement_count, 473);
assert.strictEqual(d.future_resolution_requirements.length, 473);

assert(Array.isArray(d.future_customer_decision_proof_archive_false_keys));
assert.strictEqual(d.future_customer_decision_proof_archive_false_key_count, 280);
assert.strictEqual(d.future_customer_decision_proof_archive_false_keys.length, 280);
assert.strictEqual(d.all_customer_decision_proof_archive_false_key_count, 280);
assert.strictEqual(d.missing_future_customer_decision_proof_archive_false_key_count, 0);

assert(Array.isArray(d.explicit_non_claims));
assert(Array.isArray(d.no_execution_boundary));
assert.strictEqual(d.required_non_claim_count, 12215);
assert.strictEqual(d.explicit_non_claims.length, 12215);
assert.strictEqual(d.required_no_execution_boundary_count, 12215);
assert.strictEqual(d.no_execution_boundary.length, 12215);
assert.strictEqual(d.false_claim_property_count, 8901);

for (const key of d.future_customer_decision_proof_archive_false_keys) {
  assert.strictEqual(d[key], false, `FALSE_KEY_NOT_FALSE: ${key}`);
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
  "deployment_retention",
  "deployment_archive",
  "deployment_closure",
  "deployment_completion",
  "deployment_success",
  "deployment_authorization",
  "deployment_execution",
  "deployment_execution_gate_open",
  "opc_allow"
]) {
  assert.strictEqual(d[key], false, `${key}_MUST_BE_FALSE`);
}

const boundary = [
  d.source_document_boundary_statement,
  d.endpoint_customer_evidence_dispute_disposal_customer_decision_proof_archive_boundary_statement,
  d.non_inference_rule,
  d.unknown_precedence_rule
].join("\n");

for (const fragment of [
  "Retention Conformance draft does not imply Archive",
  "Retention Conformance draft does not imply actual archive",
  "Archive Conformance draft does not imply actual archive",
  "Archive Conformance draft does not create archive",
  "Archive Conformance draft does not create preservation",
  "Archive Conformance draft does not create disposition",
  "Archive Conformance draft does not create destruction",
  "Archive Conformance draft does not create external archive storage",
  "Archive Conformance draft does not create legal finality",
  "Archive Conformance draft does not create legal validity",
  "Archive Conformance draft does not create legal certification",
  "Archive Conformance draft != archived",
  "Retention does not imply archive",
  "Archive does not imply preservation",
  "Archive does not imply disposition",
  "Archive does not imply destruction",
  "Archive does not imply legal finality",
  "Archive does not imply verification",
  "Archive does not imply deployment archive",
  "DISPATCHED != EXECUTED",
  "EXECUTED != CONSEQUENCE",
  "Missing evidence remains UNKNOWN or INSUFFICIENT_EVIDENCE",
  "UNKNOWN prevails over archive claims",
  "UNKNOWN_OR_INSUFFICIENT_EVIDENCE_PRECEDES_ARCHIVE_CLAIMS"
]) {
  assert(boundary.includes(fragment), `BOUNDARY_FRAGMENT_MISSING: ${fragment}`);
}

console.log(JSON.stringify({
  object_id: d.object_id,
  marker: d.marker,
  status: d.status,
  result: d.result,
  final_audit_marker: d.final_audit_marker,
  parent_source_chain_entry_count: d.parent_source_chain_entry_count,
  source_chain_entry_count: d.source_chain_entry_count,
  required_non_claim_count: d.required_non_claim_count,
  required_no_execution_boundary_count: d.required_no_execution_boundary_count,
  false_claim_property_count: d.false_claim_property_count,
  field_count: d[fieldName].length,
  binding_rule_count: d.binding_rule_count,
  future_resolution_requirement_count: d.future_resolution_requirement_count,
  archive_false_key_count: d.future_customer_decision_proof_archive_false_key_count,
  retention_ready: d.retention_ready,
  customer_retention_ready: d.customer_retention_ready,
  archive_ready: d.archive_ready,
  customer_archive_ready: d.customer_archive_ready,
  preservation_ready: d.preservation_ready,
  customer_ready: d.customer_ready,
  production_ready: d.production_ready,
  external_archive_storage_created: d.external_archive_storage_created
}, null, 2));

console.log(finalAuditMarker);
