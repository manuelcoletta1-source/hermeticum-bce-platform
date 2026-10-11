#!/usr/bin/env node

const fs = require("fs");

const parentFile = "evidence/authorization/20261009_HBCE_ENDPOINT_CUSTOMER_EVIDENCE_DISPUTE_DISPOSAL_CUSTOMER_DECISION_PROOF_PRODUCTION_READINESS_CONFORMANCE_BINDING_DRAFT_v001.json";
const file = "evidence/authorization/20261009_HBCE_ENDPOINT_CUSTOMER_EVIDENCE_DISPUTE_DISPOSAL_CUSTOMER_DECISION_PROOF_CUSTOMER_READINESS_CONFORMANCE_BINDING_DRAFT_v001.json";

const parent = JSON.parse(fs.readFileSync(parentFile, "utf8"));
const d = JSON.parse(fs.readFileSync(file, "utf8"));

let ok = true;

function check(name, actual, expected) {
  if (actual !== expected) {
    console.log(`CUSTOMER_READINESS_CONFORMANCE_BINDING_DRAFT_MISMATCH ${name}: expected=${expected} actual=${actual}`);
    ok = false;
  }
}

function requireArray(name, expectedLength) {
  if (!Array.isArray(d[name])) {
    console.log(`CUSTOMER_READINESS_CONFORMANCE_BINDING_DRAFT_ARRAY_MISSING ${name}`);
    ok = false;
    return [];
  }

  if (d[name].length !== expectedLength) {
    console.log(`CUSTOMER_READINESS_CONFORMANCE_BINDING_DRAFT_ARRAY_LENGTH_MISMATCH ${name}: expected=${expectedLength} actual=${d[name].length}`);
    ok = false;
  }

  return d[name];
}

function unique(items) {
  return Array.from(new Set(items));
}

function requireIncludes(source, text, fragment) {
  if (!String(text || "").includes(fragment)) {
    console.log(`CUSTOMER_READINESS_CONFORMANCE_BINDING_DRAFT_FRAGMENT_MISSING ${source}: ${fragment}`);
    ok = false;
  }
}

check("parent.object_id", parent.object_id, "HBCE-ENDPOINT-CUSTOMER-EVIDENCE-DISPUTE-DISPOSAL-CUSTOMER-DECISION-PROOF-PRODUCTION-READINESS-CONFORMANCE-BINDING-DRAFT-V001");
check("parent.marker", parent.marker, "ENDPOINT_CUSTOMER_EVIDENCE_DISPUTE_DISPOSAL_CUSTOMER_DECISION_PROOF_PRODUCTION_READINESS_CONFORMANCE_BINDING_DRAFT=PASS");
check("parent.result", parent.result, "PASS_ENDPOINT_CUSTOMER_EVIDENCE_DISPUTE_DISPOSAL_CUSTOMER_DECISION_PROOF_PRODUCTION_READINESS_CONFORMANCE_BINDING_DRAFT");
check("parent.source_chain_entry_count", parent.source_chain_entry_count, 82);
check("parent.required_non_claim_count", parent.required_non_claim_count, 8227);
check("parent.required_no_execution_boundary_count", parent.required_no_execution_boundary_count, 8227);
check("parent.false_claim_property_count", parent.false_claim_property_count, 7685);
check("parent.customer_ready", parent.customer_ready, false);
check("parent.production_ready", parent.production_ready, false);
check("parent.recommended_next_program", parent.recommended_next_program, "PROG-365");

check("object_id", d.object_id, "HBCE-ENDPOINT-CUSTOMER-EVIDENCE-DISPUTE-DISPOSAL-CUSTOMER-DECISION-PROOF-CUSTOMER-READINESS-CONFORMANCE-BINDING-DRAFT-V001");
check("artifact_type", d.artifact_type, "HBCEEndpointCustomerEvidenceDisputeDisposalCustomerDecisionProofCustomerReadinessConformanceBindingDraft");
check("classification", d.classification, "R_AND_D_ENDPOINT_CUSTOMER_EVIDENCE_DISPUTE_DISPOSAL_CUSTOMER_DECISION_PROOF_CUSTOMER_READINESS_CONFORMANCE_BINDING_DRAFT_ONLY");
check("status", d.status, "ACTIVE_ENDPOINT_CUSTOMER_EVIDENCE_DISPUTE_DISPOSAL_CUSTOMER_DECISION_PROOF_CUSTOMER_READINESS_CONFORMANCE_BINDING_DRAFT");
check("version", d.version, "v001");
check("program", d.program, "PROG-365");
check("marker", d.marker, "ENDPOINT_CUSTOMER_EVIDENCE_DISPUTE_DISPOSAL_CUSTOMER_DECISION_PROOF_CUSTOMER_READINESS_CONFORMANCE_BINDING_DRAFT=PASS");
check("basis_marker", d.basis_marker, "HBCE_ENDPOINT_CUSTOMER_EVIDENCE_DISPUTE_DISPOSAL_CUSTOMER_DECISION_PROOF_PRODUCTION_READINESS_CONFORMANCE_BINDING_DRAFT_FINAL_AUDIT=1");
check("basis_main_commit", d.basis_main_commit, "9806e7517a5609e2bc4d7f63b7e36da03e05797c");
check("parent_object_id", d.parent_object_id, parent.object_id);
check("parent_marker", d.parent_marker, parent.marker);
check("parent_commit", d.parent_commit, "9806e7517a5609e2bc4d7f63b7e36da03e05797c");

check("source_chain_model", d.source_chain_model, "COMPRESSED_PARENT_COUNT_PLUS_CURRENT_ENTRY");
check("parent_source_chain_entry_count", d.parent_source_chain_entry_count, 82);
check("source_chain_entry_count", d.source_chain_entry_count, 83);

check("binding_scope", d.binding_scope, "ENDPOINT_CUSTOMER_EVIDENCE_DISPUTE_DISPOSAL_CUSTOMER_DECISION_PROOF_CUSTOMER_READINESS_CONFORMANCE_BINDING");
check("binding_mode", d.binding_mode, "RECORD_ONLY_NOT_EXECUTABLE");
check("state", d.state, "NOT_IMPLEMENTED_NOT_EXECUTABLE_NOT_BOUND_TO_RUNTIME");
check("customer_readiness_scope", d.customer_readiness_scope, "CUSTOMER_DECISION_PROOF_CUSTOMER_READINESS_CONFORMANCE_ONLY");
check("customer_readiness_conformance_scope", d.customer_readiness_conformance_scope, "DEFINE_CUSTOMER_READINESS_BOUNDARIES_WITHOUT_CUSTOMER_USE_CUSTOMER_ACCESS_CUSTOMER_DELIVERY_CUSTOMER_ACCEPTANCE_CUSTOMER_RELIANCE_COMMERCIAL_RELIANCE_LEGAL_RELIANCE_OR_EXTERNAL_RELIANCE");
check("customer_readiness_record_class", d.customer_readiness_record_class, "CUSTOMER_DECISION_PROOF_CUSTOMER_READINESS_DRAFT_RECORD");

check("parent_non_claim_input_count", d.parent_non_claim_input_count, 8227);
check("parent_non_claim_unique_count", d.parent_non_claim_unique_count, 8227);
check("parent_no_execution_boundary_input_count", d.parent_no_execution_boundary_input_count, 8227);
check("parent_no_execution_boundary_unique_count", d.parent_no_execution_boundary_unique_count, 8227);

check("field_count", d.required_endpoint_customer_evidence_dispute_disposal_customer_decision_proof_customer_readiness_conformance_field_count, 111);
check("binding_rule_count", d.binding_rule_count, 111);
check("future_resolution_requirement_count", d.future_resolution_requirement_count, 179);
check("required_non_claim_count", d.required_non_claim_count, 8406);
check("required_no_execution_boundary_count", d.required_no_execution_boundary_count, 8406);
check("false_claim_property_count", d.false_claim_property_count, 7886);
check("future_customer_decision_proof_customer_readiness_false_key_count", d.future_customer_decision_proof_customer_readiness_false_key_count, 179);
check("all_customer_decision_proof_customer_readiness_false_key_count", d.all_customer_decision_proof_customer_readiness_false_key_count, 179);
check("inherited_customer_decision_proof_customer_readiness_false_key_count", d.inherited_customer_decision_proof_customer_readiness_false_key_count, 0);
check("inherited_customer_decision_proof_customer_readiness_false_keys_length", d.inherited_customer_decision_proof_customer_readiness_false_keys_length, 0);
check("missing_future_customer_decision_proof_customer_readiness_false_key_count", d.missing_future_customer_decision_proof_customer_readiness_false_key_count, 0);
check("overlap_non_claim_count", d.overlap_non_claim_count, 0);
check("overlap_no_execution_boundary_count", d.overlap_no_execution_boundary_count, 0);

check("customer_readiness_created", d.customer_readiness_created, false);
check("customer_readiness_started", d.customer_readiness_started, false);
check("customer_readiness_completed", d.customer_readiness_completed, false);
check("customer_readiness_effective", d.customer_readiness_effective, false);
check("customer_readiness_verified", d.customer_readiness_verified, false);
check("customer_readiness_approved", d.customer_readiness_approved, false);
check("customer_readiness_binding", d.customer_readiness_binding, false);
check("customer_readiness_ready", d.customer_readiness_ready, false);
check("customer_ready", d.customer_ready, false);
check("customer_use_ready", d.customer_use_ready, false);
check("customer_access_ready", d.customer_access_ready, false);
check("customer_delivery_ready", d.customer_delivery_ready, false);
check("customer_acceptance_ready", d.customer_acceptance_ready, false);
check("customer_reliance_ready", d.customer_reliance_ready, false);
check("customer_support_ready", d.customer_support_ready, false);
check("customer_onboarding_ready", d.customer_onboarding_ready, false);
check("customer_contract_ready", d.customer_contract_ready, false);
check("customer_sla_ready", d.customer_sla_ready, false);
check("customer_security_ready", d.customer_security_ready, false);
check("customer_privacy_ready", d.customer_privacy_ready, false);
check("customer_legal_ready", d.customer_legal_ready, false);
check("customer_commercial_ready", d.customer_commercial_ready, false);
check("commercial_ready", d.commercial_ready, false);
check("production_ready", d.production_ready, false);
check("deployment_ready", d.deployment_ready, false);
check("runtime_ready", d.runtime_ready, false);
check("operational_ready", d.operational_ready, false);
check("external_reliance_allowed", d.external_reliance_allowed, false);
check("commercial_reliance_allowed", d.commercial_reliance_allowed, false);
check("customer_reliance_allowed", d.customer_reliance_allowed, false);
check("legal_reliance_allowed", d.legal_reliance_allowed, false);

check("recommended_next_program", d.recommended_next_program, "PROG-366");
check("recommended_next_object_id", d.recommended_next_object_id, "HBCE-ENDPOINT-CUSTOMER-EVIDENCE-DISPUTE-DISPOSAL-CUSTOMER-DECISION-PROOF-CUSTOMER-DELIVERY-CONFORMANCE-BINDING-DRAFT-V001");
check("result", d.result, "PASS_ENDPOINT_CUSTOMER_EVIDENCE_DISPUTE_DISPOSAL_CUSTOMER_DECISION_PROOF_CUSTOMER_READINESS_CONFORMANCE_BINDING_DRAFT");

const fields = requireArray("required_endpoint_customer_evidence_dispute_disposal_customer_decision_proof_customer_readiness_conformance_fields", 111);
const bindingRules = requireArray("binding_rules", 111);
const futureRequirements = requireArray("future_resolution_requirements", 179);
const explicitNonClaims = requireArray("explicit_non_claims", 8406);
const noExecutionBoundary = requireArray("no_execution_boundary", 8406);
const allCustomerReadinessFalseKeys = requireArray("all_customer_decision_proof_customer_readiness_false_keys", 179);
const inheritedFalseKeys = requireArray("inherited_customer_decision_proof_customer_readiness_false_keys", 0);
const missingFutureFalseKeysRecorded = requireArray("missing_future_customer_decision_proof_customer_readiness_false_keys", 0);

check("fields.unique", unique(fields).length, 111);
check("binding_rules.unique", unique(bindingRules).length, 111);
check("future_requirements.unique", unique(futureRequirements).length, 179);
check("explicit_non_claims.unique", unique(explicitNonClaims).length, 8406);
check("no_execution_boundary.unique", unique(noExecutionBoundary).length, 8406);
check("all_customer_readiness_false_keys.unique", unique(allCustomerReadinessFalseKeys).length, 179);
check("inherited_false_keys.length", inheritedFalseKeys.length, 0);
check("missing_future_false_keys_recorded.length", missingFutureFalseKeysRecorded.length, 0);

for (const field of fields) {
  const expectedRule = `bind_${field}_within_endpoint_customer_evidence_dispute_disposal_customer_decision_proof_customer_readiness_conformance_only`;

  if (!bindingRules.includes(expectedRule)) {
    console.log(`CUSTOMER_READINESS_CONFORMANCE_BINDING_DRAFT_BINDING_RULE_MISSING ${expectedRule}`);
    ok = false;
  }
}

const customerPrefix = "endpoint_customer_evidence_dispute_disposal_customer_decision_proof_customer_readiness_";

const futureFalseKeys = futureRequirements
  .filter((item) => item.startsWith(`define_future_resolution_for_${customerPrefix}`))
  .map((item) => item.replace("define_future_resolution_for_", ""))
  .sort();

const futureFalseKeySet = new Set(futureFalseKeys);

const allCustomerReadinessFalseKeysDynamic = Object.keys(d)
  .filter((key) => key.startsWith(customerPrefix) && d[key] === false)
  .sort();

const inheritedCustomerReadinessFalseKeysDynamic = allCustomerReadinessFalseKeysDynamic
  .filter((key) => !futureFalseKeySet.has(key) && parent[key] === false)
  .sort();

const missingFutureFalseKeys = futureFalseKeys
  .filter((key) => d[key] !== false)
  .sort();

const falseClaimCount = Object.keys(d).filter((key) => d[key] === false).length;

check("false_claim_property_count_dynamic", falseClaimCount, 7886);
check("future_false_key_count_dynamic", futureFalseKeys.length, 179);
check("all_customer_readiness_false_key_count_dynamic", allCustomerReadinessFalseKeysDynamic.length, 179);
check("inherited_customer_readiness_false_key_count_dynamic", inheritedCustomerReadinessFalseKeysDynamic.length, 0);
check("missing_future_false_key_count_dynamic", missingFutureFalseKeys.length, 0);

if (d.required_non_claim_count !== d.parent_non_claim_unique_count + 179 - d.overlap_non_claim_count) {
  console.log("CUSTOMER_READINESS_CONFORMANCE_BINDING_DRAFT_NON_CLAIM_ARITHMETIC_INVALID");
  ok = false;
}

if (d.required_no_execution_boundary_count !== d.parent_no_execution_boundary_unique_count + 179 - d.overlap_no_execution_boundary_count) {
  console.log("CUSTOMER_READINESS_CONFORMANCE_BINDING_DRAFT_NO_EXECUTION_BOUNDARY_ARITHMETIC_INVALID");
  ok = false;
}

for (const key of allCustomerReadinessFalseKeys) {
  check(key, d[key], false);
}

const boundaryText = [
  d.source_document_boundary_statement || "",
  d.endpoint_customer_evidence_dispute_disposal_customer_decision_proof_customer_readiness_boundary_statement || "",
  d.non_inference_rule || "",
  d.unknown_precedence_rule || ""
].join("\n");

for (const fragment of [
  "Production Readiness Conformance draft does not imply Customer Readiness",
  "Production Readiness Conformance draft does not imply customer ready evidence",
  "Customer Readiness Conformance draft does not imply customer ready evidence",
  "Customer Readiness Conformance draft does not imply customer use",
  "Customer Readiness Conformance draft does not imply customer access",
  "Customer Readiness Conformance draft does not imply customer delivery",
  "Customer Readiness Conformance draft does not imply customer acceptance",
  "Customer Readiness Conformance draft does not imply customer reliance",
  "Customer Readiness Conformance draft does not imply commercial reliance",
  "Customer Readiness Conformance draft does not imply legal reliance",
  "Customer Readiness Conformance draft does not imply external reliance",
  "Customer Readiness Conformance draft != customer ready",
  "Customer Readiness Conformance draft != customer use ready",
  "Customer Readiness Conformance draft != customer access ready",
  "Customer Readiness Conformance draft != customer delivery ready",
  "Customer Readiness Conformance draft != customer acceptance ready",
  "Customer Readiness Conformance draft != customer reliance ready",
  "does not create customer readiness execution",
  "does not create customer readiness",
  "does not create customer use readiness",
  "does not create customer access readiness",
  "does not create customer delivery readiness",
  "does not create customer acceptance readiness",
  "does not create customer reliance",
  "does not create commercial reliance",
  "does not create legal reliance",
  "does not create external reliance",
  "UNKNOWN or INSUFFICIENT_EVIDENCE"
]) {
  requireIncludes("manifest_boundary", boundaryText, fragment);
}

console.log(JSON.stringify({
  object_id: d.object_id,
  marker: d.marker,
  basis_marker: d.basis_marker,
  basis_main_commit: d.basis_main_commit,
  parent_object_id: d.parent_object_id,
  parent_marker: d.parent_marker,
  parent_commit: d.parent_commit,
  source_chain_model: d.source_chain_model,
  parent_source_chain_entry_count: d.parent_source_chain_entry_count,
  source_chain_entry_count: d.source_chain_entry_count,
  parent_non_claim_input_count: d.parent_non_claim_input_count,
  parent_non_claim_unique_count: d.parent_non_claim_unique_count,
  parent_no_execution_boundary_input_count: d.parent_no_execution_boundary_input_count,
  parent_no_execution_boundary_unique_count: d.parent_no_execution_boundary_unique_count,
  required_endpoint_customer_evidence_dispute_disposal_customer_decision_proof_customer_readiness_conformance_field_count: d.required_endpoint_customer_evidence_dispute_disposal_customer_decision_proof_customer_readiness_conformance_field_count,
  binding_rule_count: d.binding_rule_count,
  future_resolution_requirement_count: d.future_resolution_requirement_count,
  required_non_claim_count: d.required_non_claim_count,
  required_no_execution_boundary_count: d.required_no_execution_boundary_count,
  false_claim_property_count: d.false_claim_property_count,
  future_customer_decision_proof_customer_readiness_false_key_count: d.future_customer_decision_proof_customer_readiness_false_key_count,
  all_customer_decision_proof_customer_readiness_false_key_count: d.all_customer_decision_proof_customer_readiness_false_key_count,
  inherited_customer_decision_proof_customer_readiness_false_key_count: d.inherited_customer_decision_proof_customer_readiness_false_key_count,
  inherited_customer_decision_proof_customer_readiness_false_keys_length: d.inherited_customer_decision_proof_customer_readiness_false_keys_length,
  missing_future_customer_decision_proof_customer_readiness_false_key_count: d.missing_future_customer_decision_proof_customer_readiness_false_key_count,
  overlap_non_claim_count: d.overlap_non_claim_count,
  overlap_no_execution_boundary_count: d.overlap_no_execution_boundary_count,
  customer_readiness_created: d.customer_readiness_created,
  customer_readiness_completed: d.customer_readiness_completed,
  customer_readiness_effective: d.customer_readiness_effective,
  customer_readiness_ready: d.customer_readiness_ready,
  customer_ready: d.customer_ready,
  customer_use_ready: d.customer_use_ready,
  customer_access_ready: d.customer_access_ready,
  customer_delivery_ready: d.customer_delivery_ready,
  customer_acceptance_ready: d.customer_acceptance_ready,
  customer_reliance_ready: d.customer_reliance_ready,
  commercial_ready: d.commercial_ready,
  production_ready: d.production_ready,
  recommended_next_program: d.recommended_next_program,
  recommended_next_object_id: d.recommended_next_object_id,
  result: ok ? "PASS_ENDPOINT_CUSTOMER_EVIDENCE_DISPUTE_DISPOSAL_CUSTOMER_DECISION_PROOF_CUSTOMER_READINESS_CONFORMANCE_BINDING_DRAFT" : "FAIL_ENDPOINT_CUSTOMER_EVIDENCE_DISPUTE_DISPOSAL_CUSTOMER_DECISION_PROOF_CUSTOMER_READINESS_CONFORMANCE_BINDING_DRAFT"
}, null, 2));

if (!ok) {
  process.exitCode = 1;
}
