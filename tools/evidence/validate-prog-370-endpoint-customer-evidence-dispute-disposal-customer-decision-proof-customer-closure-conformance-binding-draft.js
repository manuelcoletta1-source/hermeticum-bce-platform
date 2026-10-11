#!/usr/bin/env node
"use strict";

const fs = require("fs");
const assert = require("assert");

const manifestPath =
  "evidence/authorization/20261011_HBCE_ENDPOINT_CUSTOMER_EVIDENCE_DISPUTE_DISPOSAL_CUSTOMER_DECISION_PROOF_CUSTOMER_CLOSURE_CONFORMANCE_BINDING_DRAFT_v001.json";

const stem =
  "ENDPOINT_CUSTOMER_EVIDENCE_DISPUTE_DISPOSAL_CUSTOMER_DECISION_PROOF_CUSTOMER_CLOSURE_CONFORMANCE_BINDING_DRAFT";

const finalAuditMarker =
  "HBCE_ENDPOINT_CUSTOMER_EVIDENCE_DISPUTE_DISPOSAL_CUSTOMER_DECISION_PROOF_CUSTOMER_CLOSURE_CONFORMANCE_BINDING_DRAFT_FINAL_AUDIT=1";

const d = JSON.parse(fs.readFileSync(manifestPath, "utf8"));

assert.strictEqual(
  d.object_id,
  "HBCE-ENDPOINT-CUSTOMER-EVIDENCE-DISPUTE-DISPOSAL-CUSTOMER-DECISION-PROOF-CUSTOMER-CLOSURE-CONFORMANCE-BINDING-DRAFT-V001"
);
assert.strictEqual(d.program, "PROG-370");
assert.strictEqual(d.artifact_type, "HBCEEndpointCustomerEvidenceDisputeDisposalCustomerDecisionProofCustomerClosureConformanceBindingDraft");
assert.strictEqual(d.classification, "R_AND_D_CUSTOMER_CLOSURE_CONFORMANCE_BINDING_DRAFT_ONLY");
assert.strictEqual(d.status, "ACTIVE_ENDPOINT_CUSTOMER_EVIDENCE_DISPUTE_DISPOSAL_CUSTOMER_DECISION_PROOF_CUSTOMER_CLOSURE_CONFORMANCE_BINDING_DRAFT");
assert.strictEqual(d.marker, stem + "=PASS");
assert.strictEqual(d.result, "PASS_ENDPOINT_CUSTOMER_EVIDENCE_DISPUTE_DISPOSAL_CUSTOMER_DECISION_PROOF_CUSTOMER_CLOSURE_CONFORMANCE_BINDING_DRAFT");
assert.strictEqual(d.final_audit_marker, finalAuditMarker);

assert.strictEqual(d.parent_program, "PROG-369");
assert.strictEqual(
  d.parent_object_id,
  "HBCE-ENDPOINT-CUSTOMER-EVIDENCE-DISPUTE-DISPOSAL-CUSTOMER-DECISION-PROOF-CUSTOMER-ACCEPTANCE-CONFORMANCE-BINDING-DRAFT-V001"
);
assert.strictEqual(d.parent_commit, "114f396a546bd0b5cd731ec24f1cbd12678f7819");
assert.strictEqual(d.basis_main_commit, "114f396a546bd0b5cd731ec24f1cbd12678f7819");

assert.strictEqual(d.source_chain_model, "COUNT_ONLY_PARENT_CHAIN_REFERENCE_PLUS_PROG_370_CUSTOMER_CLOSURE_ENTRY");
assert.strictEqual(d.source_chain_storage, "COUNT_ONLY_NO_EMBEDDED_PARENT_SOURCE_CHAIN_ARRAY");
assert.strictEqual(Array.isArray(d.source_chain), false);
assert.strictEqual(d.parent_source_chain_entry_count, 87);
assert.strictEqual(d.source_chain_entry_count, 88);

assert.strictEqual(
  d.source_chain_append_entry.object_id,
  "HBCE-ENDPOINT-CUSTOMER-EVIDENCE-DISPUTE-DISPOSAL-CUSTOMER-DECISION-PROOF-CUSTOMER-CLOSURE-CONFORMANCE-BINDING-DRAFT-V001"
);
assert.strictEqual(d.source_chain_append_entry.program, "PROG-370");
assert.strictEqual(d.source_chain_append_entry.parent_program, "PROG-369");

assert.strictEqual(
  d.reference_customer_closure_object_id,
  "HBCE-ENDPOINT-CUSTOMER-EVIDENCE-DISPUTE-DISPOSAL-CUSTOMER-DECISION-PROOF-CUSTOMER-CLOSURE-CONFORMANCE-BINDING-DRAFT-V001"
);
assert.strictEqual(
  d.reference_closure_object_id,
  "HBCE-ENDPOINT-CUSTOMER-EVIDENCE-DISPUTE-DISPOSAL-CUSTOMER-DECISION-PROOF-CLOSURE-CONFORMANCE-BINDING-DRAFT-V001"
);

assert.strictEqual(d.conformance_scope, "CUSTOMER_CLOSURE_CONFORMANCE_BINDING_DRAFT_ONLY");
assert.strictEqual(d.customer_closure_scope, "FUTURE_ADMISSIBLE_CUSTOMER_CLOSURE_EVIDENCE_REQUIRED");
assert.strictEqual(d.customer_closure_record_class, "CONTROLLED_R_AND_D_DRAFT_NO_ACTUAL_CLOSURE");
assert.strictEqual(d.binding_scope, "CUSTOMER_CLOSURE_CONFORMANCE_ONLY");
assert.strictEqual(d.binding_mode, "DRAFT_BINDING_NO_EXECUTION");
assert.strictEqual(d.binding_state, "CONTROLLED_ACTIVE_VALIDATED");

const fieldName =
  "required_endpoint_customer_evidence_dispute_disposal_customer_decision_proof_customer_closure_conformance_fields";

assert(Array.isArray(d[fieldName]));
assert.strictEqual(d[fieldName].length, 111);
assert.strictEqual(new Set(d[fieldName]).size, 111);
assert.strictEqual(d.required_endpoint_customer_evidence_dispute_disposal_customer_decision_proof_customer_closure_conformance_field_count, 111);

assert(Array.isArray(d.binding_rules));
assert.strictEqual(d.binding_rule_count, 111);
assert.strictEqual(d.binding_rules.length, 111);

assert(Array.isArray(d.future_resolution_requirements));
assert.strictEqual(d.future_resolution_requirement_count, 313);
assert.strictEqual(d.future_resolution_requirements.length, 313);

assert(Array.isArray(d.future_customer_decision_proof_customer_closure_false_keys));
assert.strictEqual(d.future_customer_decision_proof_customer_closure_false_key_count, 202);
assert.strictEqual(d.future_customer_decision_proof_customer_closure_false_keys.length, 202);
assert.strictEqual(d.all_customer_decision_proof_customer_closure_false_key_count, 202);
assert.strictEqual(d.inherited_customer_decision_proof_customer_closure_false_key_count, 0);
assert.strictEqual(d.missing_future_customer_decision_proof_customer_closure_false_key_count, 0);

assert(Array.isArray(d.explicit_non_claims));
assert(Array.isArray(d.no_execution_boundary));
assert.strictEqual(d.required_non_claim_count, 9637);
assert.strictEqual(d.explicit_non_claims.length, 9637);
assert.strictEqual(d.required_no_execution_boundary_count, 9637);
assert.strictEqual(d.no_execution_boundary.length, 9637);
assert.strictEqual(d.false_claim_property_count, 8821);

for (const key of d.future_customer_decision_proof_customer_closure_false_keys) {
  assert.strictEqual(d[key], false, `FALSE_KEY_NOT_FALSE: ${key}`);
}

for (const key of [
  "customer_acknowledgment_ready",
  "customer_acceptance_ready",
  "customer_closure_ready",
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
  "legal_certification_ready"
]) {
  assert.strictEqual(d[key], false, `${key}_MUST_BE_FALSE`);
}

const boundary = [
  d.source_document_boundary_statement,
  d.endpoint_customer_evidence_dispute_disposal_customer_decision_proof_customer_closure_boundary_statement,
  d.non_inference_rule,
  d.unknown_precedence_rule
].join("\n");

for (const fragment of [
  "Customer Acceptance Conformance draft does not imply Customer Closure",
  "Customer Closure Conformance draft does not imply actual customer closure",
  "Customer Closure Conformance draft does not imply legal finality",
  "Customer Closure Conformance draft does not imply legal validity",
  "Customer Closure Conformance draft does not imply legal certification",
  "Customer Closure Conformance draft != closed",
  "Closure does not imply retention",
  "Closure does not imply archive",
  "Closure does not imply preservation",
  "Closure does not imply legal finality",
  "Closure does not imply verification",
  "Acceptance does not imply closure",
  "Acceptance does not imply verification",
  "Receipt does not imply verification",
  "Custody does not imply verification",
  "Verification does not imply Matrix effective state",
  "DISPATCHED != EXECUTED",
  "EXECUTED != CONSEQUENCE",
  "Missing evidence remains UNKNOWN or INSUFFICIENT_EVIDENCE",
  "UNKNOWN prevails over customer closure claims"
]) {
  assert(boundary.includes(fragment), `BOUNDARY_FRAGMENT_MISSING: ${fragment}`);
}

console.log(JSON.stringify({
  object_id: d.object_id,
  marker: d.marker,
  status: d.status,
  result: d.result,
  source_chain_entry_count: d.source_chain_entry_count,
  required_non_claim_count: d.required_non_claim_count,
  required_no_execution_boundary_count: d.required_no_execution_boundary_count,
  false_claim_property_count: d.false_claim_property_count,
  customer_acceptance_ready: d.customer_acceptance_ready,
  customer_closure_ready: d.customer_closure_ready,
  customer_ready: d.customer_ready,
  production_ready: d.production_ready
}, null, 2));

console.log(finalAuditMarker);
