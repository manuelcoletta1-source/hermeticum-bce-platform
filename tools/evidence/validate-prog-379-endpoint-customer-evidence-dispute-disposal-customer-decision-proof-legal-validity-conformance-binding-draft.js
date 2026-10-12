#!/usr/bin/env node
"use strict";

const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const assert = require("assert");

const repoRoot = path.resolve(__dirname, "../..");

const manifestPath = path.join(
  repoRoot,
  "evidence/authorization/20261011_HBCE_ENDPOINT_CUSTOMER_EVIDENCE_DISPUTE_DISPOSAL_CUSTOMER_DECISION_PROOF_LEGAL_VALIDITY_CONFORMANCE_BINDING_DRAFT_v001.json"
);

const parentManifestPath = path.join(
  repoRoot,
  "evidence/authorization/20261011_HBCE_ENDPOINT_CUSTOMER_EVIDENCE_DISPUTE_DISPOSAL_CUSTOMER_DECISION_PROOF_LEGAL_FINALITY_CONFORMANCE_BINDING_DRAFT_v001.json"
);

const parentValidatorPath = path.join(
  repoRoot,
  "tools/evidence/validate-prog-378-endpoint-customer-evidence-dispute-disposal-customer-decision-proof-legal-finality-conformance-binding-draft.js"
);

const sha256 = (filePath) => crypto.createHash("sha256").update(fs.readFileSync(filePath)).digest("hex");
const readJson = (filePath) => JSON.parse(fs.readFileSync(filePath, "utf8"));

const d = readJson(manifestPath);
const p = readJson(parentManifestPath);

assert.strictEqual(sha256(parentManifestPath), "902bb07a55b30521dc5a32f952e94f69cfa414c841f49c5782fcc1c6579bf2d8");
assert.strictEqual(sha256(parentValidatorPath), "98f03b46f36f7351af3e2f852449d719fc37650444fc30eeb58b5f02a7c61d5e");

assert.strictEqual(p.schema, "HBCE_AUTHORIZATION_EVIDENCE_MANIFEST_V1");
assert.strictEqual(p.program, "PROG-378");
assert.strictEqual(
  p.object_id,
  "HBCE-ENDPOINT-CUSTOMER-EVIDENCE-DISPUTE-DISPOSAL-CUSTOMER-DECISION-PROOF-LEGAL-FINALITY-CONFORMANCE-BINDING-DRAFT-V001"
);
assert.strictEqual(p.source_chain_entry_count, 96);
assert.strictEqual(p.required_non_claim_count, 19832);
assert.strictEqual(p.required_no_execution_boundary_count, 19747);
assert.strictEqual(p.false_claim_property_count, 9458);
assert.strictEqual(p.future_resolution_requirement_count, 809);
assert.strictEqual(p.future_customer_decision_proof_legal_finality_false_key_count, 173);
assert.strictEqual(p.legal_finality_ready, false);
assert.strictEqual(p.legal_finality_created, false);
assert.strictEqual(p.legal_finality_final, false);
assert.strictEqual(p.legal_validity_ready, false);
assert.strictEqual(p.legal_validity_created, false);
assert.strictEqual(p.legal_certification_ready, false);
assert.strictEqual(p.customer_ready, false);
assert.strictEqual(p.production_ready, false);
assert.strictEqual(p.opc_allow, false);
assert.strictEqual(p.matrix_effective_state_updated, false);

assert.strictEqual(d.schema, "HBCE_AUTHORIZATION_EVIDENCE_MANIFEST_V1");
assert.strictEqual(d.program, "PROG-379");
assert.strictEqual(
  d.object_id,
  "HBCE-ENDPOINT-CUSTOMER-EVIDENCE-DISPUTE-DISPOSAL-CUSTOMER-DECISION-PROOF-LEGAL-VALIDITY-CONFORMANCE-BINDING-DRAFT-V001"
);

const allowedStatuses = new Set([
  "DRAFT_PENDING_VALIDATION",
  "ACTIVE_ENDPOINT_CUSTOMER_EVIDENCE_DISPUTE_DISPOSAL_CUSTOMER_DECISION_PROOF_LEGAL_VALIDITY_CONFORMANCE_BINDING_DRAFT"
]);

const allowedMarkers = new Set([
  "ENDPOINT_CUSTOMER_EVIDENCE_DISPUTE_DISPOSAL_CUSTOMER_DECISION_PROOF_LEGAL_VALIDITY_CONFORMANCE_BINDING_DRAFT=PENDING_VALIDATION",
  "ENDPOINT_CUSTOMER_EVIDENCE_DISPUTE_DISPOSAL_CUSTOMER_DECISION_PROOF_LEGAL_VALIDITY_CONFORMANCE_BINDING_DRAFT=PASS"
]);

const allowedResults = new Set([
  "PENDING_VALIDATION",
  "PASS_ENDPOINT_CUSTOMER_EVIDENCE_DISPUTE_DISPOSAL_CUSTOMER_DECISION_PROOF_LEGAL_VALIDITY_CONFORMANCE_BINDING_DRAFT"
]);

assert(allowedStatuses.has(d.status), `INVALID_STATUS: ${d.status}`);
assert(allowedMarkers.has(d.marker), `INVALID_MARKER: ${d.marker}`);
assert(allowedResults.has(d.result), `INVALID_RESULT: ${d.result}`);

if (d.status === "DRAFT_PENDING_VALIDATION") {
  assert.strictEqual(d.marker, "ENDPOINT_CUSTOMER_EVIDENCE_DISPUTE_DISPOSAL_CUSTOMER_DECISION_PROOF_LEGAL_VALIDITY_CONFORMANCE_BINDING_DRAFT=PENDING_VALIDATION");
  assert.strictEqual(d.result, "PENDING_VALIDATION");
}

if (d.status === "ACTIVE_ENDPOINT_CUSTOMER_EVIDENCE_DISPUTE_DISPOSAL_CUSTOMER_DECISION_PROOF_LEGAL_VALIDITY_CONFORMANCE_BINDING_DRAFT") {
  assert.strictEqual(d.marker, "ENDPOINT_CUSTOMER_EVIDENCE_DISPUTE_DISPOSAL_CUSTOMER_DECISION_PROOF_LEGAL_VALIDITY_CONFORMANCE_BINDING_DRAFT=PASS");
  assert.strictEqual(d.result, "PASS_ENDPOINT_CUSTOMER_EVIDENCE_DISPUTE_DISPOSAL_CUSTOMER_DECISION_PROOF_LEGAL_VALIDITY_CONFORMANCE_BINDING_DRAFT");
  assert.strictEqual(
    d.final_audit_marker,
    "HBCE_ENDPOINT_CUSTOMER_EVIDENCE_DISPUTE_DISPOSAL_CUSTOMER_DECISION_PROOF_LEGAL_VALIDITY_CONFORMANCE_BINDING_DRAFT_FINAL_AUDIT=1"
  );
}

assert.strictEqual(d.parent_program, "PROG-378");
assert.strictEqual(d.parent_object_id, p.object_id);
assert.strictEqual(d.parent_commit, "228567ef84093e9e565915988e383399f6e9715f");
assert.strictEqual(d.basis_main_commit, "228567ef84093e9e565915988e383399f6e9715f");
assert.strictEqual(d.parent_manifest_sha256, "902bb07a55b30521dc5a32f952e94f69cfa414c841f49c5782fcc1c6579bf2d8");
assert.strictEqual(d.parent_validator_sha256, "98f03b46f36f7351af3e2f852449d719fc37650444fc30eeb58b5f02a7c61d5e");

assert.strictEqual(d.parent_source_chain_entry_count, 96);
assert.strictEqual(d.source_chain_entry_count, 97);
assert.strictEqual(d.source_chain_model, "COUNT_ONLY_PARENT_CHAIN_REFERENCE_PLUS_PROG_379_LEGAL_VALIDITY_ENTRY");
assert.strictEqual(d.source_chain_storage, "COUNT_ONLY_NO_EMBEDDED_PARENT_SOURCE_CHAIN_ARRAY");
assert.strictEqual(Array.isArray(d.source_chain), false);

assert.strictEqual(d.required_endpoint_customer_evidence_dispute_disposal_customer_decision_proof_legal_validity_conformance_field_count, 152);
assert.strictEqual(d.binding_rule_count, 152);
assert.strictEqual(d.future_resolution_requirement_count, 842);
assert.strictEqual(d.required_non_claim_count, 20426);
assert.strictEqual(d.required_no_execution_boundary_count, 20009);
assert.strictEqual(d.false_claim_property_count, 9486);
assert.strictEqual(d.future_customer_decision_proof_legal_validity_false_key_count, 187);
assert.strictEqual(d.all_customer_decision_proof_legal_validity_false_key_count, 187);

assert.strictEqual(Array.isArray(d.required_legal_validity_fields), true);
assert.strictEqual(Array.isArray(d.required_non_claim_properties), true);
assert.strictEqual(Array.isArray(d.required_no_execution_boundary_properties), true);
assert.strictEqual(Array.isArray(d.false_claim_properties), true);
assert.strictEqual(Array.isArray(d.future_resolution_requirements), true);
assert.strictEqual(Array.isArray(d.future_customer_decision_proof_legal_validity_false_keys), true);

assert.strictEqual(d.required_legal_validity_fields.length, 24);
assert.strictEqual(d.required_non_claim_properties.length, 20426);
assert.strictEqual(d.required_no_execution_boundary_properties.length, 20009);
assert.strictEqual(d.false_claim_properties.length, 9486);
assert.strictEqual(d.future_resolution_requirements.length, 842);
assert.strictEqual(d.future_customer_decision_proof_legal_validity_false_keys.length, 187);

for (const key of [
  "legal_finality_ready",
  "legal_finality_created",
  "legal_finality_final",
  "legal_finality_legally_valid",
  "legal_finality_legally_certified",
  "actual_legal_validity_created",
  "legal_validity_ready",
  "legal_validity_created",
  "legal_validity_executed",
  "legal_validity_execution",
  "legal_validity_registered",
  "legal_validity_registration",
  "legal_validity_completed",
  "legal_validity_completion",
  "legal_validity_final",
  "legal_validity_legally_certified",
  "legal_validity_certified",
  "legal_certification_ready",
  "legal_certification_created",
  "legal_certification_executed",
  "legal_certification_registered",
  "legal_certification_completed",
  "legal_certification_final",
  "certification_ready",
  "certification_created",
  "certification_executed",
  "certification_registered",
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
  "customer_decision_proof_legal_validity",
  "customer_decision_proof_legal_certification",
  "customer_decision_proof_customer_accepted",
  "customer_decision_proof_production_ready",
  "public_registry_mutated",
  "external_trust_registry_mutated",
  "legal_registry_mutated",
  "court_registry_mutated",
  "notarial_registry_mutated",
  "regulator_registry_mutated",
  "matrix_effective_state_updated",
  "matrix_legal_validity_created",
  "matrix_legal_certification_created",
  "matrix_customer_acceptance_created",
  "matrix_production_readiness_created",
  "opc_allow",
  "opc_execution_allow",
  "opc_deployment_allow",
  "opc_legal_validity_allow",
  "opc_legal_certification_allow",
  "runtime_legal_validity_executed",
  "runtime_legal_certification_executed",
  "runtime_deletion_executed",
  "runtime_destruction_executed",
  "data_destruction_executed",
  "data_destruction_execution",
  "data_erasure_executed",
  "data_erasure_execution"
]) {
  assert.strictEqual(d[key], false, `BOUNDARY_FLAG_NOT_FALSE: ${key}`);
}

for (const key of d.future_customer_decision_proof_legal_validity_false_keys) {
  assert.strictEqual(d[key], false, `LEGAL_VALIDITY_FALSE_KEY_NOT_FALSE: ${key}`);
}

const boundary = [
  d.source_document_boundary_statement,
  d.endpoint_customer_evidence_dispute_disposal_customer_decision_proof_legal_validity_boundary_statement,
  d.non_inference_rule,
  d.unknown_precedence_rule
].filter(Boolean).join("\n");

for (const fragment of [
  "Legal Finality Conformance draft does not imply Legal Validity Conformance",
  "Legal Finality does not imply legal validity",
  "Legal Validity Conformance draft does not imply legal certification",
  "Legal Validity Conformance draft does not create legal certification",
  "Legal Validity Conformance draft does not imply customer acceptance",
  "Legal Validity Conformance draft does not create customer acceptance",
  "Legal Validity Conformance draft does not imply customer readiness",
  "Legal Validity Conformance draft does not imply production readiness",
  "Legal Validity Conformance draft does not imply operational readiness",
  "Legal Validity Conformance draft does not authorize OPC ALLOW",
  "Legal Validity Conformance draft does not mutate Matrix effective state",
  "Legal Validity Conformance draft does not execute deployment",
  "Legal Validity Conformance draft does not execute runtime deletion",
  "Legal Validity Conformance draft does not execute runtime destruction",
  "Legal Validity Conformance draft does not execute data destruction",
  "Legal Validity Conformance draft does not execute data erasure",
  "Legal Validity Conformance draft is not legal certification",
  "Legal Validity Conformance draft is not customer acceptance",
  "Legal Validity Conformance draft is not production readiness",
  "Legal Validity does not imply legal certification",
  "Legal Validity does not imply customer acceptance",
  "Legal Validity does not imply production readiness",
  "Existing PROG-378 Legal Finality Conformance is not recreated by PROG-379",
  "Missing evidence remains UNKNOWN or INSUFFICIENT_EVIDENCE",
  "UNKNOWN prevails over legal validity claims",
  "UNKNOWN_OR_INSUFFICIENT_EVIDENCE_PRECEDES_LEGAL_VALIDITY_CLAIMS"
]) {
  assert(boundary.includes(fragment), `LEGAL_VALIDITY_BOUNDARY_FRAGMENT_MISSING: ${fragment}`);
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
  field_count: d.required_endpoint_customer_evidence_dispute_disposal_customer_decision_proof_legal_validity_conformance_field_count,
  binding_rule_count: d.binding_rule_count,
  future_resolution_requirement_count: d.future_resolution_requirement_count,
  required_non_claim_count: d.required_non_claim_count,
  required_no_execution_boundary_count: d.required_no_execution_boundary_count,
  false_claim_property_count: d.false_claim_property_count,
  legal_validity_false_key_count: d.future_customer_decision_proof_legal_validity_false_key_count,
  legal_finality_ready: d.legal_finality_ready,
  legal_finality_final: d.legal_finality_final,
  legal_validity_ready: d.legal_validity_ready,
  legal_validity_created: d.legal_validity_created,
  legal_validity_final: d.legal_validity_final,
  legal_certification_ready: d.legal_certification_ready,
  customer_ready: d.customer_ready,
  production_ready: d.production_ready,
  opc_allow: d.opc_allow,
  matrix_effective_state_updated: d.matrix_effective_state_updated
}, null, 2));

if (d.final_audit_marker) {
  console.log(d.final_audit_marker);
}
