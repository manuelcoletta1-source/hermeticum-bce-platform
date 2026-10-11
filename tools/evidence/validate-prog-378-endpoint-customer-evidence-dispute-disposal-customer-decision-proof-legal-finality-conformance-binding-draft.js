#!/usr/bin/env node
"use strict";

const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const assert = require("assert");

const repoRoot = path.resolve(__dirname, "../..");

const manifestPath = path.join(
  repoRoot,
  "evidence/authorization/20261011_HBCE_ENDPOINT_CUSTOMER_EVIDENCE_DISPUTE_DISPOSAL_CUSTOMER_DECISION_PROOF_LEGAL_FINALITY_CONFORMANCE_BINDING_DRAFT_v001.json"
);

const parentManifestPath = path.join(
  repoRoot,
  "evidence/authorization/20261011_HBCE_ENDPOINT_CUSTOMER_EVIDENCE_DISPUTE_DISPOSAL_CUSTOMER_DECISION_PROOF_CLOSURE_CONFORMANCE_BINDING_DRAFT_v001.json"
);

const parentValidatorPath = path.join(
  repoRoot,
  "tools/evidence/validate-prog-377-endpoint-customer-evidence-dispute-disposal-customer-decision-proof-closure-conformance-binding-draft.js"
);

const retentionManifestPath = path.join(
  repoRoot,
  "evidence/authorization/20261011_HBCE_ENDPOINT_CUSTOMER_EVIDENCE_DISPUTE_DISPOSAL_CUSTOMER_DECISION_PROOF_RETENTION_CONFORMANCE_BINDING_DRAFT_v001.json"
);

const sha256 = (filePath) => crypto.createHash("sha256").update(fs.readFileSync(filePath)).digest("hex");
const readJson = (filePath) => JSON.parse(fs.readFileSync(filePath, "utf8"));

const d = readJson(manifestPath);
const p = readJson(parentManifestPath);
const retention = readJson(retentionManifestPath);

assert.strictEqual(sha256(parentManifestPath), "834517ceb1e8eedb3695264804c9533f2d000b11a1219b8f450cb478b35f83de");
assert.strictEqual(sha256(parentValidatorPath), "a3663bd5e1d1c58f854a28f469aeb873450a5a4aa20621bf5b7cf48513d77ed7");
assert.strictEqual(sha256(retentionManifestPath), "849c8b458b4746fda4c2b5136e8bd428318ae14bd57cc018dde7182246f6ddf2");

assert.strictEqual(p.schema, "HBCE_AUTHORIZATION_EVIDENCE_MANIFEST_V1");
assert.strictEqual(p.program, "PROG-377");
assert.strictEqual(
  p.object_id,
  "HBCE-ENDPOINT-CUSTOMER-EVIDENCE-DISPUTE-DISPOSAL-CUSTOMER-DECISION-PROOF-CLOSURE-CONFORMANCE-BINDING-DRAFT-V001"
);
assert.strictEqual(p.source_chain_entry_count, 95);
assert.strictEqual(p.required_non_claim_count, 19277);
assert.strictEqual(p.required_no_execution_boundary_count, 19277);
assert.strictEqual(p.false_claim_property_count, 9370);
assert.strictEqual(p.future_customer_decision_proof_closure_false_key_count, 129);
assert.strictEqual(p.closure_ready, false);
assert.strictEqual(p.closure_final, false);
assert.strictEqual(p.closure_legally_final, false);
assert.strictEqual(p.legal_finality_ready, false);
assert.strictEqual(p.legal_validity_ready, false);
assert.strictEqual(p.legal_certification_ready, false);
assert.strictEqual(p.customer_ready, false);
assert.strictEqual(p.production_ready, false);
assert.strictEqual(p.opc_allow, false);
assert.strictEqual(p.matrix_effective_state_updated, false);

assert.strictEqual(retention.program, "PROG-371");
assert.strictEqual(
  retention.object_id,
  "HBCE-ENDPOINT-CUSTOMER-EVIDENCE-DISPUTE-DISPOSAL-CUSTOMER-DECISION-PROOF-RETENTION-CONFORMANCE-BINDING-DRAFT-V001"
);
assert.strictEqual(retention.source_chain_entry_count, 89);

assert.strictEqual(d.schema, "HBCE_AUTHORIZATION_EVIDENCE_MANIFEST_V1");
assert.strictEqual(d.program, "PROG-378");
assert.strictEqual(
  d.object_id,
  "HBCE-ENDPOINT-CUSTOMER-EVIDENCE-DISPUTE-DISPOSAL-CUSTOMER-DECISION-PROOF-LEGAL-FINALITY-CONFORMANCE-BINDING-DRAFT-V001"
);

const allowedStatuses = new Set([
  "DRAFT_PENDING_VALIDATION",
  "ACTIVE_ENDPOINT_CUSTOMER_EVIDENCE_DISPUTE_DISPOSAL_CUSTOMER_DECISION_PROOF_LEGAL_FINALITY_CONFORMANCE_BINDING_DRAFT"
]);

const allowedMarkers = new Set([
  "ENDPOINT_CUSTOMER_EVIDENCE_DISPUTE_DISPOSAL_CUSTOMER_DECISION_PROOF_LEGAL_FINALITY_CONFORMANCE_BINDING_DRAFT=PENDING_VALIDATION",
  "ENDPOINT_CUSTOMER_EVIDENCE_DISPUTE_DISPOSAL_CUSTOMER_DECISION_PROOF_LEGAL_FINALITY_CONFORMANCE_BINDING_DRAFT=PASS"
]);

const allowedResults = new Set([
  "PENDING_VALIDATION",
  "PASS_ENDPOINT_CUSTOMER_EVIDENCE_DISPUTE_DISPOSAL_CUSTOMER_DECISION_PROOF_LEGAL_FINALITY_CONFORMANCE_BINDING_DRAFT"
]);

assert(allowedStatuses.has(d.status), `INVALID_STATUS: ${d.status}`);
assert(allowedMarkers.has(d.marker), `INVALID_MARKER: ${d.marker}`);
assert(allowedResults.has(d.result), `INVALID_RESULT: ${d.result}`);

if (d.status === "DRAFT_PENDING_VALIDATION") {
  assert.strictEqual(d.marker, "ENDPOINT_CUSTOMER_EVIDENCE_DISPUTE_DISPOSAL_CUSTOMER_DECISION_PROOF_LEGAL_FINALITY_CONFORMANCE_BINDING_DRAFT=PENDING_VALIDATION");
  assert.strictEqual(d.result, "PENDING_VALIDATION");
}

if (d.status === "ACTIVE_ENDPOINT_CUSTOMER_EVIDENCE_DISPUTE_DISPOSAL_CUSTOMER_DECISION_PROOF_LEGAL_FINALITY_CONFORMANCE_BINDING_DRAFT") {
  assert.strictEqual(d.marker, "ENDPOINT_CUSTOMER_EVIDENCE_DISPUTE_DISPOSAL_CUSTOMER_DECISION_PROOF_LEGAL_FINALITY_CONFORMANCE_BINDING_DRAFT=PASS");
  assert.strictEqual(d.result, "PASS_ENDPOINT_CUSTOMER_EVIDENCE_DISPUTE_DISPOSAL_CUSTOMER_DECISION_PROOF_LEGAL_FINALITY_CONFORMANCE_BINDING_DRAFT");
  assert.strictEqual(
    d.final_audit_marker,
    "HBCE_ENDPOINT_CUSTOMER_EVIDENCE_DISPUTE_DISPOSAL_CUSTOMER_DECISION_PROOF_LEGAL_FINALITY_CONFORMANCE_BINDING_DRAFT_FINAL_AUDIT=1"
  );
}

assert.strictEqual(d.parent_program, "PROG-377");
assert.strictEqual(d.parent_object_id, p.object_id);
assert.strictEqual(d.parent_commit, "1ee02e5232220c43510d959568a63e397126250c");
assert.strictEqual(d.basis_main_commit, "1ee02e5232220c43510d959568a63e397126250c");
assert.strictEqual(d.parent_manifest_sha256, "834517ceb1e8eedb3695264804c9533f2d000b11a1219b8f450cb478b35f83de");
assert.strictEqual(d.parent_validator_sha256, "a3663bd5e1d1c58f854a28f469aeb873450a5a4aa20621bf5b7cf48513d77ed7");

assert.strictEqual(d.known_existing_retention_program, "PROG-371");
assert.strictEqual(d.known_existing_retention_object_id, retention.object_id);
assert.strictEqual(d.known_existing_retention_manifest_sha256, "849c8b458b4746fda4c2b5136e8bd428318ae14bd57cc018dde7182246f6ddf2");
assert.strictEqual(d.known_existing_retention_source_chain_entry_count, 89);
assert.strictEqual(d.known_existing_retention_not_recreated_by_prog_378, true);

assert.strictEqual(d.parent_source_chain_entry_count, 95);
assert.strictEqual(d.source_chain_entry_count, 96);
assert.strictEqual(d.source_chain_model, "COUNT_ONLY_PARENT_CHAIN_REFERENCE_PLUS_PROG_378_LEGAL_FINALITY_ENTRY");
assert.strictEqual(d.source_chain_storage, "COUNT_ONLY_NO_EMBEDDED_PARENT_SOURCE_CHAIN_ARRAY");
assert.strictEqual(Array.isArray(d.source_chain), false);

assert.strictEqual(d.required_endpoint_customer_evidence_dispute_disposal_customer_decision_proof_legal_finality_conformance_field_count, 152);
assert.strictEqual(d.binding_rule_count, 152);
assert.strictEqual(d.future_resolution_requirement_count, 809);
assert.strictEqual(d.required_non_claim_count, 19832);
assert.strictEqual(d.required_no_execution_boundary_count, 19747);
assert.strictEqual(d.false_claim_property_count, 9458);
assert.strictEqual(d.future_customer_decision_proof_legal_finality_false_key_count, 173);
assert.strictEqual(d.all_customer_decision_proof_legal_finality_false_key_count, 173);

assert.strictEqual(Array.isArray(d.required_legal_finality_fields), true);
assert.strictEqual(Array.isArray(d.required_non_claim_properties), true);
assert.strictEqual(Array.isArray(d.required_no_execution_boundary_properties), true);
assert.strictEqual(Array.isArray(d.false_claim_properties), true);
assert.strictEqual(Array.isArray(d.future_resolution_requirements), true);
assert.strictEqual(Array.isArray(d.future_customer_decision_proof_legal_finality_false_keys), true);

assert.strictEqual(d.required_legal_finality_fields.length, 24);
assert.strictEqual(d.required_non_claim_properties.length, 19832);
assert.strictEqual(d.required_no_execution_boundary_properties.length, 19747);
assert.strictEqual(d.false_claim_properties.length, 9458);
assert.strictEqual(d.future_resolution_requirements.length, 809);
assert.strictEqual(d.future_customer_decision_proof_legal_finality_false_keys.length, 173);

for (const key of [
  "closure_ready",
  "customer_closure_ready",
  "closure_executed",
  "closure_completed",
  "closure_final",
  "closure_legally_final",
  "actual_legal_finality_created",
  "legal_finality_ready",
  "legal_finality_created",
  "legal_finality_executed",
  "legal_finality_execution",
  "legal_finality_registered",
  "legal_finality_registration",
  "legal_finality_completed",
  "legal_finality_completion",
  "legal_finality_final",
  "legal_finality_legally_valid",
  "legal_finality_legally_certified",
  "legal_finality_certified",
  "legal_validity_ready",
  "legal_validity_created",
  "legal_validity_executed",
  "legal_validity_registered",
  "legal_validity_completed",
  "legal_validity_final",
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
  "production_ready",
  "production_readiness_ready",
  "production_readiness_created",
  "operational_ready",
  "operational_readiness_ready",
  "operational_readiness_created",
  "runtime_ready",
  "deployment_ready",
  "deployment_authorized",
  "deployment_executed",
  "deployment_completed",
  "deployment_success",
  "customer_decision_proof_final",
  "customer_decision_proof_closed",
  "customer_decision_proof_legal_finality",
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
  "matrix_legal_finality_created",
  "matrix_legal_validity_created",
  "matrix_legal_certification_created",
  "matrix_customer_acceptance_created",
  "matrix_production_readiness_created",
  "opc_allow",
  "opc_execution_allow",
  "opc_deployment_allow",
  "opc_legal_finality_allow",
  "opc_legal_validity_allow",
  "opc_legal_certification_allow",
  "runtime_legal_finality_executed",
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

for (const key of d.future_customer_decision_proof_legal_finality_false_keys) {
  assert.strictEqual(d[key], false, `LEGAL_FINALITY_FALSE_KEY_NOT_FALSE: ${key}`);
}

const boundary = [
  d.source_document_boundary_statement,
  d.endpoint_customer_evidence_dispute_disposal_customer_decision_proof_legal_finality_boundary_statement,
  d.non_inference_rule,
  d.unknown_precedence_rule
].filter(Boolean).join("\n");

for (const fragment of [
  "Closure Conformance draft does not imply Legal Finality Conformance",
  "Closure does not imply legal finality",
  "Legal Finality Conformance draft does not imply legal validity",
  "Legal Finality Conformance draft does not create legal validity",
  "Legal Finality Conformance draft does not imply legal certification",
  "Legal Finality Conformance draft does not create legal certification",
  "Legal Finality Conformance draft does not imply customer acceptance",
  "Legal Finality Conformance draft does not create customer acceptance",
  "Legal Finality Conformance draft does not imply customer readiness",
  "Legal Finality Conformance draft does not imply production readiness",
  "Legal Finality Conformance draft does not imply operational readiness",
  "Legal Finality Conformance draft does not authorize OPC ALLOW",
  "Legal Finality Conformance draft does not mutate Matrix effective state",
  "Legal Finality Conformance draft does not execute deployment",
  "Legal Finality Conformance draft does not execute runtime deletion",
  "Legal Finality Conformance draft does not execute runtime destruction",
  "Legal Finality Conformance draft does not execute data destruction",
  "Legal Finality Conformance draft does not execute data erasure",
  "Legal Finality Conformance draft is not legal validity",
  "Legal Finality Conformance draft is not legal certification",
  "Legal Finality Conformance draft is not production readiness",
  "Legal Finality does not imply legal validity",
  "Legal Finality does not imply legal certification",
  "Legal Finality does not imply customer acceptance",
  "Legal Finality does not imply production readiness",
  "Existing PROG-371 Retention Conformance is not recreated by PROG-378",
  "Retention Conformance does not imply Legal Finality Conformance",
  "DISPATCHED != EXECUTED",
  "EXECUTED != CONSEQUENCE",
  "Receipt does not imply verification",
  "Custody does not imply verification",
  "Verification does not imply Matrix effective state",
  "Missing evidence remains UNKNOWN or INSUFFICIENT_EVIDENCE",
  "UNKNOWN prevails over legal finality claims",
  "UNKNOWN_OR_INSUFFICIENT_EVIDENCE_PRECEDES_LEGAL_FINALITY_CLAIMS"
]) {
  assert(boundary.includes(fragment), `LEGAL_FINALITY_BOUNDARY_FRAGMENT_MISSING: ${fragment}`);
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
  known_existing_retention_program: d.known_existing_retention_program,
  field_count: d.required_endpoint_customer_evidence_dispute_disposal_customer_decision_proof_legal_finality_conformance_field_count,
  binding_rule_count: d.binding_rule_count,
  future_resolution_requirement_count: d.future_resolution_requirement_count,
  required_non_claim_count: d.required_non_claim_count,
  required_no_execution_boundary_count: d.required_no_execution_boundary_count,
  false_claim_property_count: d.false_claim_property_count,
  legal_finality_false_key_count: d.future_customer_decision_proof_legal_finality_false_key_count,
  closure_ready: d.closure_ready,
  closure_final: d.closure_final,
  closure_legally_final: d.closure_legally_final,
  legal_finality_ready: d.legal_finality_ready,
  legal_finality_created: d.legal_finality_created,
  legal_finality_final: d.legal_finality_final,
  legal_validity_ready: d.legal_validity_ready,
  legal_certification_ready: d.legal_certification_ready,
  customer_ready: d.customer_ready,
  production_ready: d.production_ready,
  opc_allow: d.opc_allow,
  matrix_effective_state_updated: d.matrix_effective_state_updated
}, null, 2));

if (d.final_audit_marker) {
  console.log(d.final_audit_marker);
}
