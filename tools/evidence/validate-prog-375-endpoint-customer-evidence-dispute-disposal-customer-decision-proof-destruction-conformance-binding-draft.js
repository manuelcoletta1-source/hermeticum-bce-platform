#!/usr/bin/env node
"use strict";

const fs = require("fs");
const path = require("path");
const assert = require("assert");

const manifestPath = path.join(
  process.cwd(),
  "evidence/authorization/20261011_HBCE_ENDPOINT_CUSTOMER_EVIDENCE_DISPUTE_DISPOSAL_CUSTOMER_DECISION_PROOF_DESTRUCTION_CONFORMANCE_BINDING_DRAFT_v001.json"
);

const d = JSON.parse(fs.readFileSync(manifestPath, "utf8"));

const STEM = "ENDPOINT_CUSTOMER_EVIDENCE_DISPUTE_DISPOSAL_CUSTOMER_DECISION_PROOF_DESTRUCTION_CONFORMANCE_BINDING_DRAFT";
const ACTIVE_STATUS = "ACTIVE_ENDPOINT_CUSTOMER_EVIDENCE_DISPUTE_DISPOSAL_CUSTOMER_DECISION_PROOF_DESTRUCTION_CONFORMANCE_BINDING_DRAFT";
const PASS_RESULT = "PASS_ENDPOINT_CUSTOMER_EVIDENCE_DISPUTE_DISPOSAL_CUSTOMER_DECISION_PROOF_DESTRUCTION_CONFORMANCE_BINDING_DRAFT";
const FINAL_AUDIT_MARKER = "HBCE_ENDPOINT_CUSTOMER_EVIDENCE_DISPUTE_DISPOSAL_CUSTOMER_DECISION_PROOF_DESTRUCTION_CONFORMANCE_BINDING_DRAFT_FINAL_AUDIT=1";

assert.strictEqual(d.schema, "HBCE_AUTHORIZATION_EVIDENCE_MANIFEST_V1");
assert.strictEqual(d.program, "PROG-375");
assert.strictEqual(
  d.object_id,
  "HBCE-ENDPOINT-CUSTOMER-EVIDENCE-DISPUTE-DISPOSAL-CUSTOMER-DECISION-PROOF-DESTRUCTION-CONFORMANCE-BINDING-DRAFT-V001"
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

assert.strictEqual(d.created_at, "2026-10-11T18:37:00+02:00");
assert.strictEqual(d.authoring_mode, "CONTROLLED_CORRECTIVE_REVISION");
assert.strictEqual(d.conformance_scope, "ENDPOINT_CUSTOMER_EVIDENCE_DISPUTE_DISPOSAL_CUSTOMER_DECISION_PROOF_DESTRUCTION_CONFORMANCE_BINDING_DRAFT");
assert.strictEqual(d.conformance_level, "CUSTOMER_DECISION_PROOF_DESTRUCTION_CONFORMANCE_DRAFT");
assert.strictEqual(d.draft_type, "BINDING_DRAFT");
assert.strictEqual(d.source_boundary, "DISPOSITION_CONFORMANCE_TO_DESTRUCTION_CONFORMANCE");

assert.strictEqual(d.parent_program, "PROG-374");
assert.strictEqual(
  d.parent_object_id,
  "HBCE-ENDPOINT-CUSTOMER-EVIDENCE-DISPUTE-DISPOSAL-CUSTOMER-DECISION-PROOF-DISPOSITION-CONFORMANCE-BINDING-DRAFT-V001"
);
assert.strictEqual(d.parent_commit, "7579183c9e1eeb7cde661ffda8565e01aa88d4f1");
assert.strictEqual(d.basis_main_commit, "7579183c9e1eeb7cde661ffda8565e01aa88d4f1");
assert.strictEqual(
  d.parent_manifest_ref,
  "evidence/authorization/20261011_HBCE_ENDPOINT_CUSTOMER_EVIDENCE_DISPUTE_DISPOSAL_CUSTOMER_DECISION_PROOF_DISPOSITION_CONFORMANCE_BINDING_DRAFT_v001.json"
);
assert.strictEqual(d.parent_manifest_sha256, "496e8294ef02c427933dfa36a8cd6124d0e1cc4323202cccf6717355e786af99");
assert.strictEqual(d.parent_validator_sha256, "49923346a06176c1e1c31b356c956efe21e7f817d5b3433ad460238ee78ed8cf");
assert.strictEqual(
  d.parent_final_audit_marker,
  "HBCE_ENDPOINT_CUSTOMER_EVIDENCE_DISPUTE_DISPOSAL_CUSTOMER_DECISION_PROOF_DISPOSITION_CONFORMANCE_BINDING_DRAFT_FINAL_AUDIT=1"
);

assert.strictEqual(d.parent_source_chain_entry_count, 92);
assert.strictEqual(d.source_chain_entry_count, 93);
assert.strictEqual(d.source_chain_model, "COUNT_ONLY_PARENT_CHAIN_REFERENCE_PLUS_PROG_375_DESTRUCTION_ENTRY");
assert.strictEqual(d.source_chain_storage, "COUNT_ONLY_NO_EMBEDDED_PARENT_SOURCE_CHAIN_ARRAY");
assert.strictEqual(Array.isArray(d.source_chain), false);

assert.strictEqual(d.required_endpoint_customer_evidence_dispute_disposal_customer_decision_proof_destruction_conformance_field_count, 152);
assert.strictEqual(d.binding_rule_count, 152);
assert.strictEqual(d.future_resolution_requirement_count, 669);
assert.strictEqual(d.future_customer_decision_proof_destruction_false_key_count, 432);
assert.strictEqual(d.all_customer_decision_proof_destruction_false_key_count, 432);
assert.strictEqual(d.required_non_claim_count, 17050);
assert.strictEqual(d.required_no_execution_boundary_count, 17050);
assert.strictEqual(d.false_claim_property_count, 9086);

assert.strictEqual(Array.isArray(d.required_destruction_fields), true);
assert.strictEqual(Array.isArray(d.required_non_claim_properties), true);
assert.strictEqual(Array.isArray(d.required_no_execution_boundary_properties), true);
assert.strictEqual(Array.isArray(d.false_claim_properties), true);
assert.strictEqual(Array.isArray(d.future_resolution_requirements), true);
assert.strictEqual(Array.isArray(d.future_customer_decision_proof_destruction_false_keys), true);

assert.strictEqual(d.required_destruction_fields.length, 24);
assert.strictEqual(d.required_non_claim_properties.length, 17050);
assert.strictEqual(d.required_no_execution_boundary_properties.length, 17050);
assert.strictEqual(d.false_claim_properties.length, 9086);
assert.strictEqual(d.future_resolution_requirements.length, 669);
assert(d.future_customer_decision_proof_destruction_false_keys.length > 0);

for (const field of [
  "endpoint_customer_evidence_dispute_disposal_customer_decision_proof_destruction_conformance_scope_ref",
  "endpoint_customer_evidence_dispute_disposal_customer_decision_proof_destruction_conformance_scope_hash",
  "endpoint_customer_evidence_dispute_disposal_customer_decision_proof_destruction_conformance_policy_ref",
  "endpoint_customer_evidence_dispute_disposal_customer_decision_proof_destruction_conformance_policy_hash",
  "endpoint_customer_evidence_dispute_disposal_customer_decision_proof_destruction_conformance_criteria_ref",
  "endpoint_customer_evidence_dispute_disposal_customer_decision_proof_destruction_conformance_criteria_hash",
  "endpoint_customer_evidence_dispute_disposal_customer_decision_proof_destruction_conformance_authority_ref",
  "endpoint_customer_evidence_dispute_disposal_customer_decision_proof_destruction_conformance_authority_hash",
  "endpoint_customer_evidence_dispute_disposal_customer_decision_proof_destruction_conformance_material_ref",
  "endpoint_customer_evidence_dispute_disposal_customer_decision_proof_destruction_conformance_material_hash",
  "endpoint_customer_evidence_dispute_disposal_customer_decision_proof_destruction_conformance_binding_ref",
  "endpoint_customer_evidence_dispute_disposal_customer_decision_proof_destruction_conformance_audit_ref",
  "endpoint_customer_evidence_dispute_disposal_customer_decision_proof_destruction_conformance_risk_ref",
  "endpoint_customer_evidence_dispute_disposal_customer_decision_proof_destruction_conformance_rollback_ref",
  "endpoint_customer_evidence_dispute_disposal_customer_decision_proof_destruction_conformance_delta_ref",
  "endpoint_customer_evidence_dispute_disposal_customer_decision_proof_destruction_conformance_delta_hash",
  "endpoint_customer_evidence_dispute_disposal_customer_decision_proof_destruction_conformance_plan_ref",
  "endpoint_customer_evidence_dispute_disposal_customer_decision_proof_destruction_conformance_plan_hash",
  "endpoint_customer_evidence_dispute_disposal_customer_decision_proof_destruction_conformance_manifest_ref",
  "endpoint_customer_evidence_dispute_disposal_customer_decision_proof_destruction_conformance_manifest_hash",
  "endpoint_customer_evidence_dispute_disposal_customer_decision_proof_destruction_conformance_register_ref",
  "endpoint_customer_evidence_dispute_disposal_customer_decision_proof_destruction_conformance_register_hash",
  "endpoint_customer_evidence_dispute_disposal_customer_decision_proof_destruction_conformance_human_state",
  "endpoint_customer_evidence_dispute_disposal_customer_decision_proof_destruction_conformance_lifecycle_state"
]) {
  assert(d.required_destruction_fields.includes(field), `REQUIRED_DESTRUCTION_FIELD_MISSING: ${field}`);
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
  "customer_ready",
  "production_ready",
  "external_archive_storage_created",
  "external_preservation_storage_created",
  "external_disposition_storage_created",
  "external_disposition_register_created",
  "external_destruction_storage_created",
  "external_destruction_register_created",
  "legal_finality_ready",
  "legal_validity_ready",
  "legal_certification_ready",
  "deployment_preservation",
  "deployment_disposition",
  "deployment_destruction",
  "runtime_disposition_executed",
  "runtime_deletion_executed",
  "runtime_destruction_executed",
  "data_destruction_executed",
  "data_destruction_execution",
  "data_erasure_executed",
  "data_erasure_execution",
  "opc_allow"
]) {
  assert.strictEqual(d[key], false, `BOUNDARY_FLAG_NOT_FALSE: ${key}`);
}

for (const key of d.future_customer_decision_proof_destruction_false_keys) {
  assert.strictEqual(d[key], false, `FALSE_KEY_NOT_FALSE: ${key}`);
}

const boundary = [
  d.source_document_boundary_statement,
  d.endpoint_customer_evidence_dispute_disposal_customer_decision_proof_destruction_boundary_statement,
  d.non_inference_rule,
  d.unknown_precedence_rule
].filter(Boolean).join("\n");

for (const fragment of [
  "Disposition Conformance draft does not imply Destruction Conformance",
  "Disposition does not imply destruction",
  "Destruction Conformance draft does not imply actual destruction",
  "Destruction Conformance draft does not create destruction",
  "Destruction Conformance draft does not execute runtime deletion",
  "Destruction Conformance draft does not execute runtime destruction",
  "Destruction Conformance draft does not execute data destruction",
  "Destruction Conformance draft does not execute data erasure",
  "Destruction Conformance draft does not create deployment destruction",
  "Destruction Conformance draft does not create deployment disposition",
  "Destruction Conformance draft does not create legal finality",
  "Destruction Conformance draft does not create legal validity",
  "Destruction Conformance draft does not create legal certification",
  "Destruction Conformance draft != destroyed",
  "Destruction does not imply finalization",
  "Destruction does not imply verification",
  "Destruction does not imply deployment destruction",
  "DISPATCHED != EXECUTED",
  "EXECUTED != CONSEQUENCE",
  "Receipt does not imply verification",
  "Custody does not imply verification",
  "Missing evidence remains UNKNOWN or INSUFFICIENT_EVIDENCE",
  "UNKNOWN prevails over destruction claims",
  "UNKNOWN_OR_INSUFFICIENT_EVIDENCE_PRECEDES_DESTRUCTION_CLAIMS"
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
  field_count: d.required_endpoint_customer_evidence_dispute_disposal_customer_decision_proof_destruction_conformance_field_count,
  binding_rule_count: d.binding_rule_count,
  future_resolution_requirement_count: d.future_resolution_requirement_count,
  required_non_claim_count: d.required_non_claim_count,
  required_no_execution_boundary_count: d.required_no_execution_boundary_count,
  false_claim_property_count: d.false_claim_property_count,
  destruction_false_key_count: d.future_customer_decision_proof_destruction_false_key_count,
  disposition_ready: d.disposition_ready,
  customer_disposition_ready: d.customer_disposition_ready,
  destruction_ready: d.destruction_ready,
  customer_destruction_ready: d.customer_destruction_ready,
  customer_ready: d.customer_ready,
  production_ready: d.production_ready,
  external_disposition_storage_created: d.external_disposition_storage_created,
  external_destruction_storage_created: d.external_destruction_storage_created,
  deployment_destruction: d.deployment_destruction,
  runtime_deletion_executed: d.runtime_deletion_executed,
  runtime_destruction_executed: d.runtime_destruction_executed,
  data_destruction_executed: d.data_destruction_executed,
  data_destruction_execution: d.data_destruction_execution,
  data_erasure_executed: d.data_erasure_executed
}, null, 2));

if (pending) {
  console.log(`${STEM}_PENDING_VALIDATION=PASS`);
} else {
  console.log(FINAL_AUDIT_MARKER);
}
