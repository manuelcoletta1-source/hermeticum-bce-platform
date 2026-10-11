#!/usr/bin/env node
"use strict";

const fs = require("fs");
const assert = require("assert");

const manifestPath =
  "evidence/authorization/20261011_HBCE_ENDPOINT_CUSTOMER_EVIDENCE_DISPUTE_DISPOSAL_CUSTOMER_DECISION_PROOF_RETENTION_CONFORMANCE_BINDING_DRAFT_v001.json";

const stem =
  "ENDPOINT_CUSTOMER_EVIDENCE_DISPUTE_DISPOSAL_CUSTOMER_DECISION_PROOF_RETENTION_CONFORMANCE_BINDING_DRAFT";

const finalAuditMarker =
  "HBCE_ENDPOINT_CUSTOMER_EVIDENCE_DISPUTE_DISPOSAL_CUSTOMER_DECISION_PROOF_RETENTION_CONFORMANCE_BINDING_DRAFT_FINAL_AUDIT=1";

const d = JSON.parse(fs.readFileSync(manifestPath, "utf8"));

assert.strictEqual(
  d.object_id,
  "HBCE-ENDPOINT-CUSTOMER-EVIDENCE-DISPUTE-DISPOSAL-CUSTOMER-DECISION-PROOF-RETENTION-CONFORMANCE-BINDING-DRAFT-V001"
);
assert.strictEqual(d.program, "PROG-371");
assert.strictEqual(d.artifact_type, "HBCEEndpointCustomerEvidenceDisputeDisposalCustomerDecisionProofRetentionConformanceBindingDraft");
assert.strictEqual(d.classification, "R_AND_D_RETENTION_CONFORMANCE_BINDING_DRAFT_ONLY");
assert.strictEqual(d.version, "v001");

assert.strictEqual(d.status, "ACTIVE_ENDPOINT_CUSTOMER_EVIDENCE_DISPUTE_DISPOSAL_CUSTOMER_DECISION_PROOF_RETENTION_CONFORMANCE_BINDING_DRAFT");
assert.strictEqual(d.marker, stem + "=PASS");
assert.strictEqual(d.result, "PASS_ENDPOINT_CUSTOMER_EVIDENCE_DISPUTE_DISPOSAL_CUSTOMER_DECISION_PROOF_RETENTION_CONFORMANCE_BINDING_DRAFT");
assert.strictEqual(d.binding_state, "CONTROLLED_ACTIVE_VALIDATED");
assert.strictEqual(d.final_audit_marker, finalAuditMarker);

assert.strictEqual(d.parent_program, "PROG-370");
assert.strictEqual(
  d.parent_object_id,
  "HBCE-ENDPOINT-CUSTOMER-EVIDENCE-DISPUTE-DISPOSAL-CUSTOMER-DECISION-PROOF-CUSTOMER-CLOSURE-CONFORMANCE-BINDING-DRAFT-V001"
);
assert.strictEqual(d.parent_commit, "773066e7b704306036796d94f12d9b36a22edf3a");
assert.strictEqual(d.basis_main_commit, "773066e7b704306036796d94f12d9b36a22edf3a");

assert.strictEqual(d.source_chain_model, "COUNT_ONLY_PARENT_CHAIN_REFERENCE_PLUS_PROG_371_RETENTION_ENTRY");
assert.strictEqual(d.source_chain_storage, "COUNT_ONLY_NO_EMBEDDED_PARENT_SOURCE_CHAIN_ARRAY");
assert.strictEqual(Array.isArray(d.source_chain), false);
assert.strictEqual(d.parent_source_chain_entry_count, 88);
assert.strictEqual(d.source_chain_entry_count, 89);

assert.strictEqual(d.source_chain_append_entry.program, "PROG-371");
assert.strictEqual(d.source_chain_append_entry.object_id, d.object_id);
assert.strictEqual(d.source_chain_append_entry.parent_program, "PROG-370");
assert.strictEqual(d.source_chain_append_entry.parent_source_chain_entry_count, 88);
assert.strictEqual(d.source_chain_append_entry.source_chain_entry_count, 89);

assert.strictEqual(d.conformance_scope, "RETENTION_CONFORMANCE_BINDING_DRAFT_ONLY");
assert.strictEqual(d.retention_scope, "FUTURE_ADMISSIBLE_RETENTION_EVIDENCE_REQUIRED");
assert.strictEqual(d.retention_record_class, "CONTROLLED_R_AND_D_DRAFT_NO_ACTUAL_RETENTION");
assert.strictEqual(d.binding_scope, "RETENTION_CONFORMANCE_ONLY");
assert.strictEqual(d.binding_mode, "DRAFT_BINDING_NO_EXECUTION");

const fieldName =
  "required_endpoint_customer_evidence_dispute_disposal_customer_decision_proof_retention_conformance_fields";

assert(Array.isArray(d[fieldName]));
assert.strictEqual(d[fieldName].length, 152);
assert.strictEqual(new Set(d[fieldName]).size, 152);
assert.strictEqual(d.required_endpoint_customer_evidence_dispute_disposal_customer_decision_proof_retention_conformance_field_count, 152);

assert(Array.isArray(d.binding_rules));
assert.strictEqual(d.binding_rule_count, 152);
assert.strictEqual(d.binding_rules.length, 152);

assert(Array.isArray(d.future_resolution_requirements));
assert.strictEqual(d.future_resolution_requirement_count, 418);
assert.strictEqual(d.future_resolution_requirements.length, 418);

assert(Array.isArray(d.future_customer_decision_proof_retention_false_keys));
assert.strictEqual(d.future_customer_decision_proof_retention_false_key_count, 232);
assert.strictEqual(d.future_customer_decision_proof_retention_false_keys.length, 232);
assert.strictEqual(d.all_customer_decision_proof_retention_false_key_count, 232);
assert.strictEqual(d.missing_future_customer_decision_proof_retention_false_key_count, 0);

assert(Array.isArray(d.explicit_non_claims));
assert(Array.isArray(d.no_execution_boundary));
assert.strictEqual(d.required_non_claim_count, 10852);
assert.strictEqual(d.explicit_non_claims.length, 10852);
assert.strictEqual(d.required_no_execution_boundary_count, 10852);
assert.strictEqual(d.no_execution_boundary.length, 10852);
assert.strictEqual(d.false_claim_property_count, 8853);

for (const key of d.future_customer_decision_proof_retention_false_keys) {
  assert.strictEqual(d[key], false, `FALSE_KEY_NOT_FALSE: ${key}`);
}

for (const key of [
  "customer_acknowledgment_ready",
  "customer_acceptance_ready",
  "customer_closure_ready",
  "retention_ready",
  "customer_retention_ready",
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
  "archive_ready",
  "preservation_ready",
  "disposition_ready",
  "destruction_ready",
  "finalization_ready",
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
  d.endpoint_customer_evidence_dispute_disposal_customer_decision_proof_retention_boundary_statement,
  d.non_inference_rule,
  d.unknown_precedence_rule
].join("\n");

for (const fragment of [
  "Customer Closure Conformance draft does not imply Retention",
  "Customer Closure Conformance draft does not imply actual retention",
  "Retention Conformance draft does not imply actual retention",
  "Retention Conformance draft does not create retention",
  "Retention Conformance draft does not create archive",
  "Retention Conformance draft does not create preservation",
  "Retention Conformance draft does not create disposition",
  "Retention Conformance draft does not create destruction",
  "Retention Conformance draft does not create legal finality",
  "Retention Conformance draft does not create legal validity",
  "Retention Conformance draft does not create legal certification",
  "Retention Conformance draft != retained",
  "Closure does not imply retention",
  "Retention does not imply archive",
  "Retention does not imply preservation",
  "Retention does not imply disposition",
  "Retention does not imply destruction",
  "Retention does not imply legal finality",
  "Retention does not imply verification",
  "DISPATCHED != EXECUTED",
  "EXECUTED != CONSEQUENCE",
  "Missing evidence remains UNKNOWN or INSUFFICIENT_EVIDENCE",
  "UNKNOWN prevails over retention claims",
  "UNKNOWN_OR_INSUFFICIENT_EVIDENCE_PRECEDES_RETENTION_CLAIMS"
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
  retention_false_key_count: d.future_customer_decision_proof_retention_false_key_count,
  customer_closure_ready: d.customer_closure_ready,
  retention_ready: d.retention_ready,
  customer_retention_ready: d.customer_retention_ready,
  customer_ready: d.customer_ready,
  production_ready: d.production_ready
}, null, 2));

console.log(finalAuditMarker);
