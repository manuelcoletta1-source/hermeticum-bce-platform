#!/usr/bin/env node
"use strict";

const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const assert = require("assert");

const repoRoot = path.resolve(__dirname, "../..");

const manifestPath = path.join(
  repoRoot,
  "evidence/authorization/20261012_HBCE_ENDPOINT_CUSTOMER_EVIDENCE_DISPUTE_DISPOSAL_CUSTOMER_DECISION_PROOF_CUSTOMER_ACCEPTANCE_CONFORMANCE_BINDING_DRAFT_v001.json"
);

const parentManifestPath = path.join(
  repoRoot,
  "evidence/authorization/20261012_HBCE_ENDPOINT_CUSTOMER_EVIDENCE_DISPUTE_DISPOSAL_CUSTOMER_DECISION_PROOF_LEGAL_CERTIFICATION_CONFORMANCE_BINDING_DRAFT_v001.json"
);

const parentValidatorPath = path.join(
  repoRoot,
  "tools/evidence/validate-prog-380-endpoint-customer-evidence-dispute-disposal-customer-decision-proof-legal-certification-conformance-binding-draft.js"
);

const sha256 = (filePath) => crypto.createHash("sha256").update(fs.readFileSync(filePath)).digest("hex");
const readJson = (filePath) => JSON.parse(fs.readFileSync(filePath, "utf8"));

const d = readJson(manifestPath);
const p = readJson(parentManifestPath);

assert.strictEqual(sha256(parentManifestPath), "578316aacb0907d4a4a40a6368bef0adc0bc7f0d05a3273299cc1512bf074c86");
assert.strictEqual(sha256(parentValidatorPath), "f5868d3cb5239e8315321c1f4d3a071bfeb8dcfa7a263d388d637b509364fedb");

assert.strictEqual(p.schema, "HBCE_AUTHORIZATION_EVIDENCE_MANIFEST_V1");
assert.strictEqual(p.program, "PROG-380");
assert.strictEqual(
  p.object_id,
  "HBCE-ENDPOINT-CUSTOMER-EVIDENCE-DISPUTE-DISPOSAL-CUSTOMER-DECISION-PROOF-LEGAL-CERTIFICATION-CONFORMANCE-BINDING-DRAFT-V001"
);
assert.strictEqual(p.source_chain_entry_count, 98);
assert.strictEqual(p.required_non_claim_count, 21040);
assert.strictEqual(p.required_no_execution_boundary_count, 20257);
assert.strictEqual(p.false_claim_property_count, 9502);
assert.strictEqual(p.future_resolution_requirement_count, 871);
assert.strictEqual(p.future_customer_decision_proof_legal_certification_false_key_count, 195);
assert.strictEqual(p.legal_certification_ready, false);
assert.strictEqual(p.legal_certification_created, false);
assert.strictEqual(p.legal_certification_final, false);
assert.strictEqual(p.customer_ready, false);
assert.strictEqual(p.customer_accepted, false);
assert.strictEqual(p.customer_acceptance_ready, false);
assert.strictEqual(p.customer_acceptance_created, false);
assert.strictEqual(p.customer_acceptance_final, false);
assert.strictEqual(p.production_ready, false);
assert.strictEqual(p.operational_ready, false);
assert.strictEqual(p.opc_allow, false);
assert.strictEqual(p.matrix_effective_state_updated, false);

assert.strictEqual(d.schema, "HBCE_AUTHORIZATION_EVIDENCE_MANIFEST_V1");
assert.strictEqual(d.program, "PROG-381");
assert.strictEqual(
  d.object_id,
  "HBCE-ENDPOINT-CUSTOMER-EVIDENCE-DISPUTE-DISPOSAL-CUSTOMER-DECISION-PROOF-CUSTOMER-ACCEPTANCE-CONFORMANCE-BINDING-DRAFT-V001"
);

const allowedStatuses = new Set([
  "DRAFT_PENDING_VALIDATION",
  "ACTIVE_ENDPOINT_CUSTOMER_EVIDENCE_DISPUTE_DISPOSAL_CUSTOMER_DECISION_PROOF_CUSTOMER_ACCEPTANCE_CONFORMANCE_BINDING_DRAFT"
]);

const allowedMarkers = new Set([
  "ENDPOINT_CUSTOMER_EVIDENCE_DISPUTE_DISPOSAL_CUSTOMER_DECISION_PROOF_CUSTOMER_ACCEPTANCE_CONFORMANCE_BINDING_DRAFT=PENDING_VALIDATION",
  "ENDPOINT_CUSTOMER_EVIDENCE_DISPUTE_DISPOSAL_CUSTOMER_DECISION_PROOF_CUSTOMER_ACCEPTANCE_CONFORMANCE_BINDING_DRAFT=PASS"
]);

const allowedResults = new Set([
  "PENDING_VALIDATION",
  "PASS_ENDPOINT_CUSTOMER_EVIDENCE_DISPUTE_DISPOSAL_CUSTOMER_DECISION_PROOF_CUSTOMER_ACCEPTANCE_CONFORMANCE_BINDING_DRAFT"
]);

assert(allowedStatuses.has(d.status), `INVALID_STATUS: ${d.status}`);
assert(allowedMarkers.has(d.marker), `INVALID_MARKER: ${d.marker}`);
assert(allowedResults.has(d.result), `INVALID_RESULT: ${d.result}`);

if (d.status === "DRAFT_PENDING_VALIDATION") {
  assert.strictEqual(d.marker, "ENDPOINT_CUSTOMER_EVIDENCE_DISPUTE_DISPOSAL_CUSTOMER_DECISION_PROOF_CUSTOMER_ACCEPTANCE_CONFORMANCE_BINDING_DRAFT=PENDING_VALIDATION");
  assert.strictEqual(d.result, "PENDING_VALIDATION");
}

if (d.status === "ACTIVE_ENDPOINT_CUSTOMER_EVIDENCE_DISPUTE_DISPOSAL_CUSTOMER_DECISION_PROOF_CUSTOMER_ACCEPTANCE_CONFORMANCE_BINDING_DRAFT") {
  assert.strictEqual(d.marker, "ENDPOINT_CUSTOMER_EVIDENCE_DISPUTE_DISPOSAL_CUSTOMER_DECISION_PROOF_CUSTOMER_ACCEPTANCE_CONFORMANCE_BINDING_DRAFT=PASS");
  assert.strictEqual(d.result, "PASS_ENDPOINT_CUSTOMER_EVIDENCE_DISPUTE_DISPOSAL_CUSTOMER_DECISION_PROOF_CUSTOMER_ACCEPTANCE_CONFORMANCE_BINDING_DRAFT");
  assert.strictEqual(
    d.final_audit_marker,
    "HBCE_ENDPOINT_CUSTOMER_EVIDENCE_DISPUTE_DISPOSAL_CUSTOMER_DECISION_PROOF_CUSTOMER_ACCEPTANCE_CONFORMANCE_BINDING_DRAFT_FINAL_AUDIT=1"
  );
}

assert.strictEqual(d.parent_program, "PROG-380");
assert.strictEqual(d.parent_object_id, p.object_id);
assert.strictEqual(d.parent_commit, "4f71795f31680365b46f501a7f6e84a02bfa921d");
assert.strictEqual(d.basis_main_commit, "4f71795f31680365b46f501a7f6e84a02bfa921d");
assert.strictEqual(d.parent_manifest_sha256, "578316aacb0907d4a4a40a6368bef0adc0bc7f0d05a3273299cc1512bf074c86");
assert.strictEqual(d.parent_validator_sha256, "f5868d3cb5239e8315321c1f4d3a071bfeb8dcfa7a263d388d637b509364fedb");

assert.strictEqual(d.parent_source_chain_entry_count, 98);
assert.strictEqual(d.source_chain_entry_count, 99);
assert.strictEqual(d.source_chain_model, "COUNT_ONLY_PARENT_CHAIN_REFERENCE_PLUS_PROG_381_CUSTOMER_ACCEPTANCE_ENTRY");
assert.strictEqual(d.source_chain_storage, "COUNT_ONLY_NO_EMBEDDED_PARENT_SOURCE_CHAIN_ARRAY");
assert.strictEqual(Array.isArray(d.source_chain), false);

assert.strictEqual(d.required_endpoint_customer_evidence_dispute_disposal_customer_decision_proof_customer_acceptance_conformance_field_count, 152);
assert.strictEqual(d.binding_rule_count, 152);
assert.strictEqual(d.future_resolution_requirement_count, 900);
assert.strictEqual(d.required_non_claim_count, 21558);
assert.strictEqual(d.required_no_execution_boundary_count, 20613);
assert.strictEqual(d.false_claim_property_count, 9568);
assert.strictEqual(d.future_customer_decision_proof_customer_acceptance_false_key_count, 228);
assert.strictEqual(d.all_customer_decision_proof_customer_acceptance_false_key_count, 228);

assert.strictEqual(Array.isArray(d.required_customer_acceptance_fields), true);
assert.strictEqual(Array.isArray(d.required_non_claim_properties), true);
assert.strictEqual(Array.isArray(d.required_no_execution_boundary_properties), true);
assert.strictEqual(Array.isArray(d.false_claim_properties), true);
assert.strictEqual(Array.isArray(d.future_resolution_requirements), true);
assert.strictEqual(Array.isArray(d.future_customer_decision_proof_customer_acceptance_false_keys), true);

assert.strictEqual(d.required_customer_acceptance_fields.length, 24);
assert.strictEqual(d.required_non_claim_properties.length, 21558);
assert.strictEqual(d.required_no_execution_boundary_properties.length, 20613);
assert.strictEqual(d.false_claim_properties.length, 9568);
assert.strictEqual(d.future_resolution_requirements.length, 900);
assert.strictEqual(d.future_customer_decision_proof_customer_acceptance_false_keys.length, 228);

for (const key of [
  "legal_certification_ready",
  "legal_certification_created",
  "legal_certification_final",
  "customer_ready",
  "customer_readiness_ready",
  "customer_readiness_created",
  "customer_readiness_final",
  "customer_accepted",
  "customer_acceptance_ready",
  "customer_acceptance_created",
  "customer_acceptance_executed",
  "customer_acceptance_registered",
  "customer_acceptance_signed",
  "customer_acceptance_approved",
  "customer_acceptance_completed",
  "customer_acceptance_final",
  "customer_acceptance_legally_effective",
  "customer_decision_proof_customer_accepted",
  "customer_decision_proof_customer_acceptance_ready",
  "customer_decision_proof_customer_acceptance_created",
  "customer_decision_proof_customer_acceptance_executed",
  "customer_decision_proof_customer_acceptance_completed",
  "customer_decision_proof_customer_acceptance_final",
  "customer_decision_proof_final",
  "customer_decision_proof_closed",
  "customer_decision_proof_production_ready",
  "customer_decision_proof_operational_ready",
  "production_ready",
  "production_readiness_ready",
  "production_readiness_created",
  "production_readiness_executed",
  "production_readiness_final",
  "operational_ready",
  "operational_readiness_ready",
  "operational_readiness_created",
  "operational_readiness_executed",
  "runtime_ready",
  "deployment_ready",
  "deployment_authorized",
  "deployment_executed",
  "deployment_completed",
  "deployment_success",
  "public_registry_mutated",
  "external_trust_registry_mutated",
  "legal_registry_mutated",
  "court_registry_mutated",
  "notarial_registry_mutated",
  "regulator_registry_mutated",
  "matrix_effective_state_updated",
  "matrix_customer_acceptance_created",
  "matrix_production_readiness_created",
  "matrix_operational_readiness_created",
  "opc_allow",
  "opc_execution_allow",
  "opc_deployment_allow",
  "opc_customer_acceptance_allow",
  "opc_production_readiness_allow",
  "opc_operational_readiness_allow",
  "runtime_customer_acceptance_executed",
  "runtime_production_readiness_executed",
  "runtime_operational_readiness_executed",
  "runtime_deletion_executed",
  "runtime_destruction_executed",
  "data_destruction_executed",
  "data_destruction_execution",
  "data_erasure_executed",
  "data_erasure_execution"
]) {
  assert.strictEqual(d[key], false, `BOUNDARY_FLAG_NOT_FALSE: ${key}`);
}

for (const key of d.future_customer_decision_proof_customer_acceptance_false_keys) {
  assert.strictEqual(d[key], false, `CUSTOMER_ACCEPTANCE_FALSE_KEY_NOT_FALSE: ${key}`);
}

const boundary = [
  d.source_document_boundary_statement,
  d.endpoint_customer_evidence_dispute_disposal_customer_decision_proof_customer_acceptance_boundary_statement,
  d.non_inference_rule,
  d.unknown_precedence_rule
].filter(Boolean).join("\n");

for (const fragment of [
  "Legal Certification Conformance draft does not imply Customer Acceptance Conformance",
  "Legal Certification does not imply customer acceptance",
  "Customer Acceptance Conformance draft does not imply customer readiness",
  "Customer Acceptance Conformance draft does not imply production readiness",
  "Customer Acceptance Conformance draft does not imply operational readiness",
  "Customer Acceptance Conformance draft does not authorize OPC ALLOW",
  "Customer Acceptance Conformance draft does not mutate Matrix effective state",
  "Customer Acceptance Conformance draft does not execute deployment",
  "Customer Acceptance Conformance draft does not execute runtime deletion",
  "Customer Acceptance Conformance draft does not execute runtime destruction",
  "Customer Acceptance Conformance draft does not execute data destruction",
  "Customer Acceptance Conformance draft does not execute data erasure",
  "Customer Acceptance does not imply production readiness",
  "Customer Acceptance does not imply operational readiness",
  "Customer Acceptance does not imply deployment authorization",
  "Customer Acceptance does not imply deployment execution",
  "Customer Acceptance does not imply runtime readiness",
  "Customer Acceptance does not imply OPC ALLOW",
  "Customer Acceptance does not imply Matrix effective state mutation",
  "Existing PROG-380 Legal Certification Conformance is not recreated by PROG-381",
  "Missing evidence remains UNKNOWN or INSUFFICIENT_EVIDENCE",
  "UNKNOWN prevails over customer acceptance claims",
  "UNKNOWN_OR_INSUFFICIENT_EVIDENCE_PRECEDES_CUSTOMER_ACCEPTANCE_CLAIMS"
]) {
  assert(boundary.includes(fragment), `CUSTOMER_ACCEPTANCE_BOUNDARY_FRAGMENT_MISSING: ${fragment}`);
}

console.log(JSON.stringify({
  object_id: d.object_id,
  program: d.program,
  status: d.status,
  marker: d.marker,
  result: d.result,
  parent_program: d.parent_program,
  parent_source_chain_entry_count: d.parent_source_chain_entry_count,
  source_chain_entry_count: d.source_chain_entry_count,
  field_count: d.required_endpoint_customer_evidence_dispute_disposal_customer_decision_proof_customer_acceptance_conformance_field_count,
  binding_rule_count: d.binding_rule_count,
  future_resolution_requirement_count: d.future_resolution_requirement_count,
  required_non_claim_count: d.required_non_claim_count,
  required_no_execution_boundary_count: d.required_no_execution_boundary_count,
  false_claim_property_count: d.false_claim_property_count,
  customer_acceptance_false_key_count: d.future_customer_decision_proof_customer_acceptance_false_key_count,
  legal_certification_ready: d.legal_certification_ready,
  customer_ready: d.customer_ready,
  customer_accepted: d.customer_accepted,
  customer_acceptance_ready: d.customer_acceptance_ready,
  customer_acceptance_created: d.customer_acceptance_created,
  customer_acceptance_final: d.customer_acceptance_final,
  production_ready: d.production_ready,
  operational_ready: d.operational_ready,
  opc_allow: d.opc_allow,
  matrix_effective_state_updated: d.matrix_effective_state_updated
}, null, 2));

if (d.final_audit_marker) {
  console.log(d.final_audit_marker);
}
