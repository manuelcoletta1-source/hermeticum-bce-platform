#!/usr/bin/env node
"use strict";

const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const assert = require("assert");

const repoRoot = path.resolve(__dirname, "../..");

const manifestPath = path.join(
  repoRoot,
  "evidence/authorization/20261012_HBCE_ENDPOINT_CUSTOMER_EVIDENCE_DISPUTE_DISPOSAL_CUSTOMER_DECISION_PROOF_LEGAL_CERTIFICATION_CONFORMANCE_BINDING_DRAFT_v001.json"
);

const parentManifestPath = path.join(
  repoRoot,
  "evidence/authorization/20261011_HBCE_ENDPOINT_CUSTOMER_EVIDENCE_DISPUTE_DISPOSAL_CUSTOMER_DECISION_PROOF_LEGAL_VALIDITY_CONFORMANCE_BINDING_DRAFT_v001.json"
);

const parentValidatorPath = path.join(
  repoRoot,
  "tools/evidence/validate-prog-379-endpoint-customer-evidence-dispute-disposal-customer-decision-proof-legal-validity-conformance-binding-draft.js"
);

const sha256 = (filePath) => crypto.createHash("sha256").update(fs.readFileSync(filePath)).digest("hex");
const readJson = (filePath) => JSON.parse(fs.readFileSync(filePath, "utf8"));

const d = readJson(manifestPath);
const p = readJson(parentManifestPath);

assert.strictEqual(sha256(parentManifestPath), "e0c0d5e6e523f460c7f184fe3613c73fe3327e9f4159ff8c3b7746a282323f7d");
assert.strictEqual(sha256(parentValidatorPath), "a9321d1a0d5a98ffa1949a171eefc6bc418ab48f94fa1748cdc54daab296d4b2");

assert.strictEqual(p.schema, "HBCE_AUTHORIZATION_EVIDENCE_MANIFEST_V1");
assert.strictEqual(p.program, "PROG-379");
assert.strictEqual(
  p.object_id,
  "HBCE-ENDPOINT-CUSTOMER-EVIDENCE-DISPUTE-DISPOSAL-CUSTOMER-DECISION-PROOF-LEGAL-VALIDITY-CONFORMANCE-BINDING-DRAFT-V001"
);
assert.strictEqual(p.source_chain_entry_count, 97);
assert.strictEqual(p.required_non_claim_count, 20426);
assert.strictEqual(p.required_no_execution_boundary_count, 20009);
assert.strictEqual(p.false_claim_property_count, 9486);
assert.strictEqual(p.future_resolution_requirement_count, 842);
assert.strictEqual(p.future_customer_decision_proof_legal_validity_false_key_count, 187);
assert.strictEqual(p.legal_validity_ready, false);
assert.strictEqual(p.legal_validity_created, false);
assert.strictEqual(p.legal_validity_final, false);
assert.strictEqual(p.legal_certification_ready, false);
assert.strictEqual(p.legal_certification_created, false);
assert.strictEqual(p.legal_certification_final, false);
assert.strictEqual(p.customer_ready, false);
assert.strictEqual(p.customer_accepted, false);
assert.strictEqual(p.production_ready, false);
assert.strictEqual(p.opc_allow, false);
assert.strictEqual(p.matrix_effective_state_updated, false);

assert.strictEqual(d.schema, "HBCE_AUTHORIZATION_EVIDENCE_MANIFEST_V1");
assert.strictEqual(d.program, "PROG-380");
assert.strictEqual(
  d.object_id,
  "HBCE-ENDPOINT-CUSTOMER-EVIDENCE-DISPUTE-DISPOSAL-CUSTOMER-DECISION-PROOF-LEGAL-CERTIFICATION-CONFORMANCE-BINDING-DRAFT-V001"
);

const allowedStatuses = new Set([
  "DRAFT_PENDING_VALIDATION",
  "ACTIVE_ENDPOINT_CUSTOMER_EVIDENCE_DISPUTE_DISPOSAL_CUSTOMER_DECISION_PROOF_LEGAL_CERTIFICATION_CONFORMANCE_BINDING_DRAFT"
]);

const allowedMarkers = new Set([
  "ENDPOINT_CUSTOMER_EVIDENCE_DISPUTE_DISPOSAL_CUSTOMER_DECISION_PROOF_LEGAL_CERTIFICATION_CONFORMANCE_BINDING_DRAFT=PENDING_VALIDATION",
  "ENDPOINT_CUSTOMER_EVIDENCE_DISPUTE_DISPOSAL_CUSTOMER_DECISION_PROOF_LEGAL_CERTIFICATION_CONFORMANCE_BINDING_DRAFT=PASS"
]);

const allowedResults = new Set([
  "PENDING_VALIDATION",
  "PASS_ENDPOINT_CUSTOMER_EVIDENCE_DISPUTE_DISPOSAL_CUSTOMER_DECISION_PROOF_LEGAL_CERTIFICATION_CONFORMANCE_BINDING_DRAFT"
]);

assert(allowedStatuses.has(d.status), `INVALID_STATUS: ${d.status}`);
assert(allowedMarkers.has(d.marker), `INVALID_MARKER: ${d.marker}`);
assert(allowedResults.has(d.result), `INVALID_RESULT: ${d.result}`);

if (d.status === "DRAFT_PENDING_VALIDATION") {
  assert.strictEqual(d.marker, "ENDPOINT_CUSTOMER_EVIDENCE_DISPUTE_DISPOSAL_CUSTOMER_DECISION_PROOF_LEGAL_CERTIFICATION_CONFORMANCE_BINDING_DRAFT=PENDING_VALIDATION");
  assert.strictEqual(d.result, "PENDING_VALIDATION");
}

if (d.status === "ACTIVE_ENDPOINT_CUSTOMER_EVIDENCE_DISPUTE_DISPOSAL_CUSTOMER_DECISION_PROOF_LEGAL_CERTIFICATION_CONFORMANCE_BINDING_DRAFT") {
  assert.strictEqual(d.marker, "ENDPOINT_CUSTOMER_EVIDENCE_DISPUTE_DISPOSAL_CUSTOMER_DECISION_PROOF_LEGAL_CERTIFICATION_CONFORMANCE_BINDING_DRAFT=PASS");
  assert.strictEqual(d.result, "PASS_ENDPOINT_CUSTOMER_EVIDENCE_DISPUTE_DISPOSAL_CUSTOMER_DECISION_PROOF_LEGAL_CERTIFICATION_CONFORMANCE_BINDING_DRAFT");
  assert.strictEqual(
    d.final_audit_marker,
    "HBCE_ENDPOINT_CUSTOMER_EVIDENCE_DISPUTE_DISPOSAL_CUSTOMER_DECISION_PROOF_LEGAL_CERTIFICATION_CONFORMANCE_BINDING_DRAFT_FINAL_AUDIT=1"
  );
}

assert.strictEqual(d.parent_program, "PROG-379");
assert.strictEqual(d.parent_object_id, p.object_id);
assert.strictEqual(d.parent_commit, "30c36b6e22addda374bde852ec9ef11df2880367");
assert.strictEqual(d.basis_main_commit, "30c36b6e22addda374bde852ec9ef11df2880367");
assert.strictEqual(d.parent_manifest_sha256, "e0c0d5e6e523f460c7f184fe3613c73fe3327e9f4159ff8c3b7746a282323f7d");
assert.strictEqual(d.parent_validator_sha256, "a9321d1a0d5a98ffa1949a171eefc6bc418ab48f94fa1748cdc54daab296d4b2");

assert.strictEqual(d.parent_source_chain_entry_count, 97);
assert.strictEqual(d.source_chain_entry_count, 98);
assert.strictEqual(d.source_chain_model, "COUNT_ONLY_PARENT_CHAIN_REFERENCE_PLUS_PROG_380_LEGAL_CERTIFICATION_ENTRY");
assert.strictEqual(d.source_chain_storage, "COUNT_ONLY_NO_EMBEDDED_PARENT_SOURCE_CHAIN_ARRAY");
assert.strictEqual(Array.isArray(d.source_chain), false);

assert.strictEqual(d.required_endpoint_customer_evidence_dispute_disposal_customer_decision_proof_legal_certification_conformance_field_count, 152);
assert.strictEqual(d.binding_rule_count, 152);
assert.strictEqual(d.future_resolution_requirement_count, 871);
assert.strictEqual(d.required_non_claim_count, 21040);
assert.strictEqual(d.required_no_execution_boundary_count, 20257);
assert.strictEqual(d.false_claim_property_count, 9502);
assert.strictEqual(d.future_customer_decision_proof_legal_certification_false_key_count, 195);
assert.strictEqual(d.all_customer_decision_proof_legal_certification_false_key_count, 195);

assert.strictEqual(Array.isArray(d.required_legal_certification_fields), true);
assert.strictEqual(Array.isArray(d.required_non_claim_properties), true);
assert.strictEqual(Array.isArray(d.required_no_execution_boundary_properties), true);
assert.strictEqual(Array.isArray(d.false_claim_properties), true);
assert.strictEqual(Array.isArray(d.future_resolution_requirements), true);
assert.strictEqual(Array.isArray(d.future_customer_decision_proof_legal_certification_false_keys), true);

assert.strictEqual(d.required_legal_certification_fields.length, 24);
assert.strictEqual(d.required_non_claim_properties.length, 21040);
assert.strictEqual(d.required_no_execution_boundary_properties.length, 20257);
assert.strictEqual(d.false_claim_properties.length, 9502);
assert.strictEqual(d.future_resolution_requirements.length, 871);
assert.strictEqual(d.future_customer_decision_proof_legal_certification_false_keys.length, 195);

for (const key of [
  "legal_validity_ready",
  "legal_validity_created",
  "legal_validity_final",
  "legal_validity_legally_certified",
  "actual_legal_certification_created",
  "actual_legal_certification_executed",
  "actual_legal_certification_registered",
  "actual_legal_certification_issued",
  "legal_certification_ready",
  "legal_certification_created",
  "legal_certification_executed",
  "legal_certification_execution",
  "legal_certification_registered",
  "legal_certification_registration",
  "legal_certification_issued",
  "legal_certification_issuance",
  "legal_certification_completed",
  "legal_certification_completion",
  "legal_certification_final",
  "legal_certification_legally_effective",
  "certification_ready",
  "certification_created",
  "certification_executed",
  "certification_registered",
  "certification_issued",
  "certification_completed",
  "certification_final",
  "customer_ready",
  "customer_accepted",
  "customer_acceptance_ready",
  "customer_acceptance_created",
  "customer_acceptance_executed",
  "customer_acceptance_completed",
  "customer_acceptance_final",
  "production_ready",
  "production_readiness_ready",
  "production_readiness_created",
  "production_readiness_executed",
  "operational_ready",
  "runtime_ready",
  "deployment_ready",
  "deployment_authorized",
  "deployment_executed",
  "deployment_completed",
  "deployment_success",
  "customer_decision_proof_final",
  "customer_decision_proof_closed",
  "customer_decision_proof_customer_accepted",
  "customer_decision_proof_production_ready",
  "public_registry_mutated",
  "external_trust_registry_mutated",
  "legal_registry_mutated",
  "court_registry_mutated",
  "notarial_registry_mutated",
  "regulator_registry_mutated",
  "matrix_effective_state_updated",
  "matrix_legal_certification_created",
  "matrix_customer_acceptance_created",
  "matrix_production_readiness_created",
  "opc_allow",
  "opc_execution_allow",
  "opc_deployment_allow",
  "opc_legal_certification_allow",
  "opc_customer_acceptance_allow",
  "opc_production_readiness_allow",
  "runtime_legal_certification_executed",
  "runtime_customer_acceptance_executed",
  "runtime_deletion_executed",
  "runtime_destruction_executed",
  "data_destruction_executed",
  "data_destruction_execution",
  "data_erasure_executed",
  "data_erasure_execution"
]) {
  assert.strictEqual(d[key], false, `BOUNDARY_FLAG_NOT_FALSE: ${key}`);
}

for (const key of d.future_customer_decision_proof_legal_certification_false_keys) {
  assert.strictEqual(d[key], false, `LEGAL_CERTIFICATION_FALSE_KEY_NOT_FALSE: ${key}`);
}

const boundary = [
  d.source_document_boundary_statement,
  d.endpoint_customer_evidence_dispute_disposal_customer_decision_proof_legal_certification_boundary_statement,
  d.non_inference_rule,
  d.unknown_precedence_rule
].filter(Boolean).join("\n");

for (const fragment of [
  "Legal Validity Conformance draft does not imply Legal Certification Conformance",
  "Legal Validity does not imply legal certification",
  "Legal Certification Conformance draft does not imply customer acceptance",
  "Legal Certification Conformance draft does not create customer acceptance",
  "Legal Certification Conformance draft does not imply customer readiness",
  "Legal Certification Conformance draft does not imply production readiness",
  "Legal Certification Conformance draft does not imply operational readiness",
  "Legal Certification Conformance draft does not authorize OPC ALLOW",
  "Legal Certification Conformance draft does not mutate Matrix effective state",
  "Legal Certification Conformance draft does not execute deployment",
  "Legal Certification Conformance draft does not execute runtime deletion",
  "Legal Certification Conformance draft does not execute runtime destruction",
  "Legal Certification Conformance draft does not execute data destruction",
  "Legal Certification Conformance draft does not execute data erasure",
  "Legal Certification Conformance draft is not customer acceptance",
  "Legal Certification Conformance draft is not production readiness",
  "Legal Certification does not imply customer acceptance",
  "Legal Certification does not imply production readiness",
  "Legal Certification does not imply operational readiness",
  "Existing PROG-379 Legal Validity Conformance is not recreated by PROG-380",
  "Missing evidence remains UNKNOWN or INSUFFICIENT_EVIDENCE",
  "UNKNOWN prevails over legal certification claims",
  "UNKNOWN_OR_INSUFFICIENT_EVIDENCE_PRECEDES_LEGAL_CERTIFICATION_CLAIMS"
]) {
  assert(boundary.includes(fragment), `LEGAL_CERTIFICATION_BOUNDARY_FRAGMENT_MISSING: ${fragment}`);
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
  field_count: d.required_endpoint_customer_evidence_dispute_disposal_customer_decision_proof_legal_certification_conformance_field_count,
  binding_rule_count: d.binding_rule_count,
  future_resolution_requirement_count: d.future_resolution_requirement_count,
  required_non_claim_count: d.required_non_claim_count,
  required_no_execution_boundary_count: d.required_no_execution_boundary_count,
  false_claim_property_count: d.false_claim_property_count,
  legal_certification_false_key_count: d.future_customer_decision_proof_legal_certification_false_key_count,
  legal_validity_ready: d.legal_validity_ready,
  legal_certification_ready: d.legal_certification_ready,
  legal_certification_created: d.legal_certification_created,
  legal_certification_final: d.legal_certification_final,
  customer_ready: d.customer_ready,
  customer_accepted: d.customer_accepted,
  production_ready: d.production_ready,
  opc_allow: d.opc_allow,
  matrix_effective_state_updated: d.matrix_effective_state_updated
}, null, 2));

if (d.final_audit_marker) {
  console.log(d.final_audit_marker);
}
