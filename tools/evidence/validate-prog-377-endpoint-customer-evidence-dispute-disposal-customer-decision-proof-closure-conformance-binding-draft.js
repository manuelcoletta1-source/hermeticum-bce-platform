#!/usr/bin/env node
"use strict";

const fs = require("fs");
const assert = require("assert");

const manifestPath = "evidence/authorization/20261011_HBCE_ENDPOINT_CUSTOMER_EVIDENCE_DISPUTE_DISPOSAL_CUSTOMER_DECISION_PROOF_CLOSURE_CONFORMANCE_BINDING_DRAFT_v001.json";

const d = JSON.parse(fs.readFileSync(manifestPath, "utf8"));

const STEM = "ENDPOINT_CUSTOMER_EVIDENCE_DISPUTE_DISPOSAL_CUSTOMER_DECISION_PROOF_CLOSURE_CONFORMANCE_BINDING_DRAFT";
const OBJECT_ID = "HBCE-ENDPOINT-CUSTOMER-EVIDENCE-DISPUTE-DISPOSAL-CUSTOMER-DECISION-PROOF-CLOSURE-CONFORMANCE-BINDING-DRAFT-V001";
const ACTIVE_STATUS = "ACTIVE_ENDPOINT_CUSTOMER_EVIDENCE_DISPUTE_DISPOSAL_CUSTOMER_DECISION_PROOF_CLOSURE_CONFORMANCE_BINDING_DRAFT";
const PASS_RESULT = "PASS_ENDPOINT_CUSTOMER_EVIDENCE_DISPUTE_DISPOSAL_CUSTOMER_DECISION_PROOF_CLOSURE_CONFORMANCE_BINDING_DRAFT";
const FINAL_AUDIT_MARKER = "HBCE_ENDPOINT_CUSTOMER_EVIDENCE_DISPUTE_DISPOSAL_CUSTOMER_DECISION_PROOF_CLOSURE_CONFORMANCE_BINDING_DRAFT_FINAL_AUDIT=1";

assert.strictEqual(d.schema, "HBCE_AUTHORIZATION_EVIDENCE_MANIFEST_V1");
assert.strictEqual(d.program, "PROG-377");
assert.strictEqual(d.object_id, OBJECT_ID);

const isPending = d.status === "DRAFT_PENDING_VALIDATION";
const isActive = d.status === ACTIVE_STATUS;
assert.ok(isPending || isActive, `INVALID_STATUS: ${d.status}`);

if (isPending) {
  assert.strictEqual(d.marker, `${STEM}=PENDING_VALIDATION`);
  assert.strictEqual(d.result, "PENDING_VALIDATION");
  assert.strictEqual(Object.prototype.hasOwnProperty.call(d, "final_audit_marker"), false);
}

if (isActive) {
  assert.strictEqual(d.marker, `${STEM}=PASS`);
  assert.strictEqual(d.result, PASS_RESULT);
  assert.strictEqual(d.final_audit_marker, FINAL_AUDIT_MARKER);
}

assert.strictEqual(d.created_at, "2026-10-11T00:00:00+02:00");
assert.strictEqual(d.authority, "Hermeticum B.C.E. S.r.l.");
assert.strictEqual(d.evidence_class, "AUTHORIZATION_EVIDENCE_MANIFEST");
assert.strictEqual(d.conformance_level, "CLOSURE_CONFORMANCE_BINDING_DRAFT");
assert.strictEqual(d.legalCertification, false);
assert.strictEqual(d.draft_not_execution, true);
assert.strictEqual(d.closure_conformance_only, true);

assert.strictEqual(d.parent_program, "PROG-376");
assert.strictEqual(
  d.parent_object_id,
  "HBCE-ENDPOINT-CUSTOMER-EVIDENCE-DISPUTE-DISPOSAL-CUSTOMER-DECISION-PROOF-FINALIZATION-CONFORMANCE-BINDING-DRAFT-V001"
);
assert.strictEqual(d.parent_commit, "56be6bb16aef1af98ae7680fd7dcf1537e321bf0");
assert.strictEqual(d.basis_main_commit, "56be6bb16aef1af98ae7680fd7dcf1537e321bf0");
assert.strictEqual(d.parent_manifest_sha256, "6bd9bd53afaebe8c03d8931c93e1175a63db33f2e7da9679b33e998b02ac0b70");
assert.strictEqual(d.parent_validator_sha256, "71ac7302eb6219c698f0a3136b9258dacae965d358cd48206a525d6394b22ea6");

assert.strictEqual(d.parent_source_chain_entry_count, 94);
assert.strictEqual(d.source_chain_entry_count, 95);
assert.strictEqual(d.source_chain_model, "COUNT_ONLY_PARENT_CHAIN_REFERENCE_PLUS_PROG_377_CLOSURE_ENTRY");
assert.strictEqual(d.source_chain_storage, "COUNT_ONLY_NO_EMBEDDED_PARENT_SOURCE_CHAIN_ARRAY");
assert.strictEqual(Array.isArray(d.source_chain), false);

assert.strictEqual(d.required_endpoint_customer_evidence_dispute_disposal_customer_decision_proof_closure_conformance_field_count, 152);
assert.strictEqual(d.binding_rule_count, 152);
assert.strictEqual(d.future_resolution_requirement_count, 773);
assert.strictEqual(d.future_customer_decision_proof_closure_false_key_count, 129);
assert.strictEqual(d.all_customer_decision_proof_closure_false_key_count, 129);
assert.strictEqual(d.required_non_claim_count, 19277);
assert.strictEqual(d.required_no_execution_boundary_count, 19277);
assert.strictEqual(d.false_claim_property_count, 9370);

assert.strictEqual(Array.isArray(d.required_closure_fields), true);
assert.strictEqual(Array.isArray(d.required_non_claim_properties), true);
assert.strictEqual(Array.isArray(d.required_no_execution_boundary_properties), true);
assert.strictEqual(Array.isArray(d.false_claim_properties), true);
assert.strictEqual(Array.isArray(d.future_resolution_requirements), true);
assert.strictEqual(Array.isArray(d.future_customer_decision_proof_closure_false_keys), true);

assert.strictEqual(d.required_closure_fields.length, 24);
assert.strictEqual(d.required_non_claim_properties.length, 19277);
assert.strictEqual(d.required_no_execution_boundary_properties.length, 19277);
assert.strictEqual(d.false_claim_properties.length, 9370);
assert.strictEqual(d.future_resolution_requirements.length, 773);
assert.strictEqual(d.future_customer_decision_proof_closure_false_keys.length, 129);

for (const key of [
  "finalization_ready",
  "customer_finalization_ready",
  "actual_finalization_executed",
  "finalization_executed",
  "finalization_completed",
  "finalization_closed",
  "finalization_final",
  "finalization_legally_final",
  "finalization_legally_valid",
  "finalization_legally_certified",

  "closure_ready",
  "customer_closure_ready",
  "actual_closure_executed",
  "closure_authorized",
  "closure_executed",
  "closure_execution",
  "closure_completed",
  "closure_completion",
  "closure_closed",
  "closure_final",
  "closure_legally_final",
  "closure_legally_valid",
  "closure_legally_certified",

  "customer_ready",
  "customer_accepted",
  "customer_acceptance_ready",
  "production_ready",
  "production_readiness_ready",
  "operational_ready",
  "runtime_ready",
  "deployment_ready",
  "deployment_authorized",
  "deployment_executed",
  "deployment_completed",
  "deployment_success",
  "deployment_closure",

  "legal_finality_ready",
  "legal_finality_created",
  "legal_validity_ready",
  "legal_validity_created",
  "legal_certification_ready",
  "legal_certification_created",
  "certification_ready",
  "certification_created",

  "customer_decision_proof_final",
  "customer_decision_proof_closed",
  "customer_decision_proof_closure",
  "customer_decision_proof_customer_accepted",
  "customer_decision_proof_legal_finality",
  "customer_decision_proof_legal_validity",
  "customer_decision_proof_legal_certification",

  "public_registry_mutated",
  "external_trust_registry_mutated",
  "matrix_effective_state_updated",
  "matrix_closure_created",
  "matrix_finalization_created",
  "matrix_publication_created",
  "matrix_acceptance_created",

  "opc_allow",
  "opc_execution_allow",
  "opc_deployment_allow",
  "opc_closure_allow",

  "runtime_closure_executed",
  "runtime_deletion_executed",
  "runtime_destruction_executed",
  "data_destruction_executed",
  "data_destruction_execution",
  "data_erasure_executed",
  "data_erasure_execution"
]) {
  assert.strictEqual(d[key], false, `BOUNDARY_FLAG_NOT_FALSE: ${key}`);
}

for (const key of d.future_customer_decision_proof_closure_false_keys) {
  assert.strictEqual(d[key], false, `CLOSURE_FALSE_KEY_NOT_FALSE: ${key}`);
}

const boundary = [
  d.source_document_boundary_statement,
  d.endpoint_customer_evidence_dispute_disposal_customer_decision_proof_closure_boundary_statement,
  d.non_inference_rule,
  d.unknown_precedence_rule
].filter(Boolean).join("\n");

for (const fragment of [
  "Finalization Conformance draft does not imply Closure Conformance",
  "Finalization does not imply closure",
  "Closure Conformance draft does not imply legal finality",
  "Closure Conformance draft does not create legal finality",
  "Closure Conformance draft does not imply legal validity",
  "Closure Conformance draft does not create legal validity",
  "Closure Conformance draft does not imply legal certification",
  "Closure Conformance draft does not create legal certification",
  "Closure Conformance draft does not imply customer acceptance",
  "Closure Conformance draft does not create customer acceptance",
  "Closure Conformance draft does not imply customer readiness",
  "Closure Conformance draft does not imply production readiness",
  "Closure Conformance draft does not imply operational readiness",
  "Closure Conformance draft does not authorize OPC ALLOW",
  "Closure Conformance draft does not mutate Matrix effective state",
  "Closure Conformance draft does not execute deployment",
  "Closure Conformance draft does not execute runtime deletion",
  "Closure Conformance draft does not execute runtime destruction",
  "Closure Conformance draft does not execute data destruction",
  "Closure Conformance draft does not execute data erasure",
  "Closure Conformance draft != closed",
  "Closure does not imply legal finality",
  "Closure does not imply legal validity",
  "Closure does not imply legal certification",
  "Closure does not imply production readiness",
  "DISPATCHED != EXECUTED",
  "EXECUTED != CONSEQUENCE",
  "Receipt does not imply verification",
  "Custody does not imply verification",
  "Verification does not imply Matrix effective state",
  "Missing evidence remains UNKNOWN or INSUFFICIENT_EVIDENCE",
  "UNKNOWN prevails over closure claims",
  "UNKNOWN_OR_INSUFFICIENT_EVIDENCE_PRECEDES_CLOSURE_CLAIMS"
]) {
  assert(boundary.includes(fragment), `CLOSURE_BOUNDARY_FRAGMENT_MISSING: ${fragment}`);
}

console.log(JSON.stringify({
  object_id: d.object_id,
  program: d.program,
  status: d.status,
  marker: d.marker,
  result: d.result,
  final_audit_marker: d.final_audit_marker || null,
  parent_program: d.parent_program,
  parent_source_chain_entry_count: d.parent_source_chain_entry_count,
  source_chain_entry_count: d.source_chain_entry_count,
  field_count: d.required_endpoint_customer_evidence_dispute_disposal_customer_decision_proof_closure_conformance_field_count,
  binding_rule_count: d.binding_rule_count,
  future_resolution_requirement_count: d.future_resolution_requirement_count,
  required_non_claim_count: d.required_non_claim_count,
  required_no_execution_boundary_count: d.required_no_execution_boundary_count,
  false_claim_property_count: d.false_claim_property_count,
  closure_false_key_count: d.future_customer_decision_proof_closure_false_key_count,
  finalization_ready: d.finalization_ready,
  finalization_final: d.finalization_final,
  closure_ready: d.closure_ready,
  customer_closure_ready: d.customer_closure_ready,
  closure_executed: d.closure_executed,
  closure_completed: d.closure_completed,
  closure_final: d.closure_final,
  closure_legally_final: d.closure_legally_final,
  customer_ready: d.customer_ready,
  production_ready: d.production_ready,
  legal_finality_ready: d.legal_finality_ready,
  legal_validity_ready: d.legal_validity_ready,
  legal_certification_ready: d.legal_certification_ready,
  opc_allow: d.opc_allow,
  matrix_effective_state_updated: d.matrix_effective_state_updated
}, null, 2));

if (isPending) {
  console.log(`${STEM}_PENDING_VALIDATION=PASS`);
} else {
  console.log(FINAL_AUDIT_MARKER);
}
