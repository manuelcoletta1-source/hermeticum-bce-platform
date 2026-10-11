#!/usr/bin/env node
"use strict";

const fs = require("fs");
const path = require("path");
const assert = require("assert");

const manifestPath = path.join(
  process.cwd(),
  "evidence/authorization/20261011_HBCE_ENDPOINT_CUSTOMER_EVIDENCE_DISPUTE_DISPOSAL_CUSTOMER_DECISION_PROOF_FINALIZATION_CONFORMANCE_BINDING_DRAFT_v001.json"
);

const d = JSON.parse(fs.readFileSync(manifestPath, "utf8"));

const STEM = "ENDPOINT_CUSTOMER_EVIDENCE_DISPUTE_DISPOSAL_CUSTOMER_DECISION_PROOF_FINALIZATION_CONFORMANCE_BINDING_DRAFT";
const ACTIVE_STATUS = "ACTIVE_ENDPOINT_CUSTOMER_EVIDENCE_DISPUTE_DISPOSAL_CUSTOMER_DECISION_PROOF_FINALIZATION_CONFORMANCE_BINDING_DRAFT";
const PASS_RESULT = "PASS_ENDPOINT_CUSTOMER_EVIDENCE_DISPUTE_DISPOSAL_CUSTOMER_DECISION_PROOF_FINALIZATION_CONFORMANCE_BINDING_DRAFT";
const FINAL_AUDIT_MARKER = "HBCE_ENDPOINT_CUSTOMER_EVIDENCE_DISPUTE_DISPOSAL_CUSTOMER_DECISION_PROOF_FINALIZATION_CONFORMANCE_BINDING_DRAFT_FINAL_AUDIT=1";

assert.strictEqual(d.schema, "HBCE_AUTHORIZATION_EVIDENCE_MANIFEST_V1");
assert.strictEqual(d.program, "PROG-376");
assert.strictEqual(
  d.object_id,
  "HBCE-ENDPOINT-CUSTOMER-EVIDENCE-DISPUTE-DISPOSAL-CUSTOMER-DECISION-PROOF-FINALIZATION-CONFORMANCE-BINDING-DRAFT-V001"
);

const pending = d.status === "DRAFT_PENDING_VALIDATION";
const active = d.status === ACTIVE_STATUS;

assert.strictEqual(pending || active, true, `INVALID_STATUS: ${d.status}`);

if (pending) {
  assert.strictEqual(d.marker, `${STEM}=PENDING_VALIDATION`);
  assert.strictEqual(d.result, "PENDING_VALIDATION");
  assert.strictEqual(Object.prototype.hasOwnProperty.call(d, "final_audit_marker"), false);
}

if (active) {
  assert.strictEqual(d.marker, `${STEM}=PASS`);
  assert.strictEqual(d.result, PASS_RESULT);
  assert.strictEqual(d.final_audit_marker, FINAL_AUDIT_MARKER);
}

assert.strictEqual(d.created_at, "2026-10-11T19:21:00+02:00");
assert.strictEqual(d.authoring_mode, "CONTROLLED_CORRECTIVE_REVISION");
assert.strictEqual(d.conformance_scope, "ENDPOINT_CUSTOMER_EVIDENCE_DISPUTE_DISPOSAL_CUSTOMER_DECISION_PROOF_FINALIZATION_CONFORMANCE_BINDING_DRAFT");
assert.strictEqual(d.conformance_level, "CUSTOMER_DECISION_PROOF_FINALIZATION_CONFORMANCE_DRAFT");
assert.strictEqual(d.draft_type, "BINDING_DRAFT");
assert.strictEqual(d.source_boundary, "DESTRUCTION_CONFORMANCE_TO_FINALIZATION_CONFORMANCE");

assert.strictEqual(d.parent_program, "PROG-375");
assert.strictEqual(
  d.parent_object_id,
  "HBCE-ENDPOINT-CUSTOMER-EVIDENCE-DISPUTE-DISPOSAL-CUSTOMER-DECISION-PROOF-DESTRUCTION-CONFORMANCE-BINDING-DRAFT-V001"
);
assert.strictEqual(d.parent_commit, "aac127dd79d7f5a4c4f03364fae1908d1d8e18bd");
assert.strictEqual(d.basis_main_commit, "aac127dd79d7f5a4c4f03364fae1908d1d8e18bd");
assert.strictEqual(
  d.parent_manifest_ref,
  "evidence/authorization/20261011_HBCE_ENDPOINT_CUSTOMER_EVIDENCE_DISPUTE_DISPOSAL_CUSTOMER_DECISION_PROOF_DESTRUCTION_CONFORMANCE_BINDING_DRAFT_v001.json"
);
assert.strictEqual(d.parent_manifest_sha256, "3e1ba55ebc85abcbfffa91205cadce9e305681295bacb3b83701a4ab969badc5");
assert.strictEqual(d.parent_validator_sha256, "d2058b91e3fa8f95ac7654439f754dedbd7e27daa0fd934180b329c91e23df6f");
assert.strictEqual(
  d.parent_final_audit_marker,
  "HBCE_ENDPOINT_CUSTOMER_EVIDENCE_DISPUTE_DISPOSAL_CUSTOMER_DECISION_PROOF_DESTRUCTION_CONFORMANCE_BINDING_DRAFT_FINAL_AUDIT=1"
);

assert.strictEqual(d.parent_source_chain_entry_count, 93);
assert.strictEqual(d.source_chain_entry_count, 94);
assert.strictEqual(d.source_chain_model, "COUNT_ONLY_PARENT_CHAIN_REFERENCE_PLUS_PROG_376_FINALIZATION_ENTRY");
assert.strictEqual(d.source_chain_storage, "COUNT_ONLY_NO_EMBEDDED_PARENT_SOURCE_CHAIN_ARRAY");
assert.strictEqual(Array.isArray(d.source_chain), false);

assert.strictEqual(d.required_endpoint_customer_evidence_dispute_disposal_customer_decision_proof_finalization_conformance_field_count, 152);
assert.strictEqual(d.binding_rule_count, 152);
assert.strictEqual(d.future_resolution_requirement_count, 739);
assert.strictEqual(d.future_customer_decision_proof_finalization_false_key_count, 486);
assert.strictEqual(d.all_customer_decision_proof_finalization_false_key_count, 486);
assert.strictEqual(d.required_non_claim_count, 18948);
assert.strictEqual(d.required_no_execution_boundary_count, 18948);
assert.strictEqual(d.false_claim_property_count, 9204);

assert.strictEqual(Array.isArray(d.required_finalization_fields), true);
assert.strictEqual(Array.isArray(d.required_non_claim_properties), true);
assert.strictEqual(Array.isArray(d.required_no_execution_boundary_properties), true);
assert.strictEqual(Array.isArray(d.false_claim_properties), true);
assert.strictEqual(Array.isArray(d.future_resolution_requirements), true);
assert.strictEqual(Array.isArray(d.future_customer_decision_proof_finalization_false_keys), true);

assert.strictEqual(d.required_finalization_fields.length, 24);
assert.strictEqual(d.required_non_claim_properties.length, 18948);
assert.strictEqual(d.required_no_execution_boundary_properties.length, 18948);
assert.strictEqual(d.false_claim_properties.length, 9204);
assert.strictEqual(d.future_resolution_requirements.length, 739);
assert(d.future_customer_decision_proof_finalization_false_keys.length > 0);

for (const field of [
  "endpoint_customer_evidence_dispute_disposal_customer_decision_proof_finalization_conformance_scope_ref",
  "endpoint_customer_evidence_dispute_disposal_customer_decision_proof_finalization_conformance_scope_hash",
  "endpoint_customer_evidence_dispute_disposal_customer_decision_proof_finalization_conformance_policy_ref",
  "endpoint_customer_evidence_dispute_disposal_customer_decision_proof_finalization_conformance_policy_hash",
  "endpoint_customer_evidence_dispute_disposal_customer_decision_proof_finalization_conformance_criteria_ref",
  "endpoint_customer_evidence_dispute_disposal_customer_decision_proof_finalization_conformance_criteria_hash",
  "endpoint_customer_evidence_dispute_disposal_customer_decision_proof_finalization_conformance_authority_ref",
  "endpoint_customer_evidence_dispute_disposal_customer_decision_proof_finalization_conformance_authority_hash",
  "endpoint_customer_evidence_dispute_disposal_customer_decision_proof_finalization_conformance_material_ref",
  "endpoint_customer_evidence_dispute_disposal_customer_decision_proof_finalization_conformance_material_hash",
  "endpoint_customer_evidence_dispute_disposal_customer_decision_proof_finalization_conformance_binding_ref",
  "endpoint_customer_evidence_dispute_disposal_customer_decision_proof_finalization_conformance_audit_ref",
  "endpoint_customer_evidence_dispute_disposal_customer_decision_proof_finalization_conformance_risk_ref",
  "endpoint_customer_evidence_dispute_disposal_customer_decision_proof_finalization_conformance_rollback_ref",
  "endpoint_customer_evidence_dispute_disposal_customer_decision_proof_finalization_conformance_delta_ref",
  "endpoint_customer_evidence_dispute_disposal_customer_decision_proof_finalization_conformance_delta_hash",
  "endpoint_customer_evidence_dispute_disposal_customer_decision_proof_finalization_conformance_plan_ref",
  "endpoint_customer_evidence_dispute_disposal_customer_decision_proof_finalization_conformance_plan_hash",
  "endpoint_customer_evidence_dispute_disposal_customer_decision_proof_finalization_conformance_manifest_ref",
  "endpoint_customer_evidence_dispute_disposal_customer_decision_proof_finalization_conformance_manifest_hash",
  "endpoint_customer_evidence_dispute_disposal_customer_decision_proof_finalization_conformance_register_ref",
  "endpoint_customer_evidence_dispute_disposal_customer_decision_proof_finalization_conformance_register_hash",
  "endpoint_customer_evidence_dispute_disposal_customer_decision_proof_finalization_conformance_human_state",
  "endpoint_customer_evidence_dispute_disposal_customer_decision_proof_finalization_conformance_lifecycle_state"
]) {
  assert(d.required_finalization_fields.includes(field), `REQUIRED_FINALIZATION_FIELD_MISSING: ${field}`);
}

for (const key of [
  "archive_ready",
  "customer_archive_ready",
  "preservation_ready",
  "customer_preservation_ready",
  "disposition_ready",
  "customer_disposition_ready",
  "destruction_ready",
  "customer_destruction_ready",
  "finalization_ready",
  "customer_finalization_ready",
  "customer_ready",
  "production_ready",
  "external_archive_storage_created",
  "external_preservation_storage_created",
  "external_disposition_storage_created",
  "external_disposition_register_created",
  "external_destruction_storage_created",
  "external_destruction_register_created",
  "external_finalization_storage_created",
  "external_finalization_register_created",
  "legal_finality_ready",
  "legal_validity_ready",
  "legal_certification_ready",
  "deployment_preservation",
  "deployment_disposition",
  "deployment_destruction",
  "deployment_finalization",
  "runtime_disposition_executed",
  "runtime_deletion_executed",
  "runtime_destruction_executed",
  "runtime_finalization_executed",
  "data_destruction_executed",
  "data_destruction_execution",
  "data_erasure_executed",
  "data_erasure_execution",
  "opc_allow",
  "matrix_effective_state_updated"
]) {
  assert.strictEqual(d[key], false, `BOUNDARY_FLAG_NOT_FALSE: ${key}`);
}

for (const key of d.future_customer_decision_proof_finalization_false_keys) {
  assert.strictEqual(d[key], false, `FALSE_KEY_NOT_FALSE: ${key}`);
}

const boundary = [
  d.source_document_boundary_statement,
  d.endpoint_customer_evidence_dispute_disposal_customer_decision_proof_finalization_boundary_statement,
  d.non_inference_rule,
  d.unknown_precedence_rule
].filter(Boolean).join("\n");

for (const fragment of [
  "Destruction Conformance draft does not imply Finalization Conformance",
  "Destruction does not imply finalization",
  "Finalization Conformance draft does not imply closure",
  "Finalization Conformance draft does not create closure",
  "Finalization Conformance draft does not imply legal finality",
  "Finalization Conformance draft does not create legal finality",
  "Finalization Conformance draft does not imply legal validity",
  "Finalization Conformance draft does not create legal validity",
  "Finalization Conformance draft does not imply legal certification",
  "Finalization Conformance draft does not create legal certification",
  "Finalization Conformance draft does not imply customer acceptance",
  "Finalization Conformance draft does not create customer acceptance",
  "Finalization Conformance draft does not imply customer readiness",
  "Finalization Conformance draft does not imply production readiness",
  "Finalization Conformance draft does not imply operational readiness",
  "Finalization Conformance draft does not authorize OPC ALLOW",
  "Finalization Conformance draft does not mutate Matrix effective state",
  "Finalization Conformance draft does not execute deployment",
  "Finalization Conformance draft does not execute runtime deletion",
  "Finalization Conformance draft does not execute runtime destruction",
  "Finalization Conformance draft does not execute data destruction",
  "Finalization Conformance draft does not execute data erasure",
  "Finalization Conformance draft != finalized",
  "Finalization does not imply legal finality",
  "Finalization does not imply legal validity",
  "Finalization does not imply legal certification",
  "Finalization does not imply production readiness",
  "DISPATCHED != EXECUTED",
  "EXECUTED != CONSEQUENCE",
  "Receipt does not imply verification",
  "Custody does not imply verification",
  "Missing evidence remains UNKNOWN or INSUFFICIENT_EVIDENCE",
  "UNKNOWN prevails over finalization claims",
  "UNKNOWN_OR_INSUFFICIENT_EVIDENCE_PRECEDES_FINALIZATION_CLAIMS"
]) {
  assert(boundary.includes(fragment), `BOUNDARY_FRAGMENT_MISSING: ${fragment}`);
}

console.log(JSON.stringify({
  object_id: d.object_id,
  program: d.program,
  status: d.status,
  marker: d.marker,
  result: d.result,
  final_audit_marker: d.final_audit_marker || null,
  parent_source_chain_entry_count: d.parent_source_chain_entry_count,
  source_chain_entry_count: d.source_chain_entry_count,
  field_count: d.required_endpoint_customer_evidence_dispute_disposal_customer_decision_proof_finalization_conformance_field_count,
  binding_rule_count: d.binding_rule_count,
  future_resolution_requirement_count: d.future_resolution_requirement_count,
  required_non_claim_count: d.required_non_claim_count,
  required_no_execution_boundary_count: d.required_no_execution_boundary_count,
  false_claim_property_count: d.false_claim_property_count,
  finalization_false_key_count: d.future_customer_decision_proof_finalization_false_key_count,
  destruction_ready: d.destruction_ready,
  destruction_final: d.destruction_final,
  finalization_ready: d.finalization_ready,
  customer_finalization_ready: d.customer_finalization_ready,
  finalization_final: d.finalization_final,
  finalization_legally_final: d.finalization_legally_final,
  customer_ready: d.customer_ready,
  production_ready: d.production_ready,
  legal_finality_ready: d.legal_finality_ready,
  legal_validity_ready: d.legal_validity_ready,
  legal_certification_ready: d.legal_certification_ready,
  opc_allow: d.opc_allow,
  matrix_effective_state_updated: d.matrix_effective_state_updated
}, null, 2));

if (pending) {
  console.log(`${STEM}_PENDING_VALIDATION=PASS`);
} else {
  console.log(FINAL_AUDIT_MARKER);
}
