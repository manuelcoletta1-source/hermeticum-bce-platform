#!/usr/bin/env node

const fs = require("fs");

const parentFile = "evidence/authorization/20261009_HBCE_ENDPOINT_CUSTOMER_EVIDENCE_DISPUTE_DISPOSAL_CUSTOMER_DECISION_PROOF_LEGAL_CERTIFICATION_CONFORMANCE_BINDING_DRAFT_v001.json";
const file = "evidence/authorization/20261009_HBCE_ENDPOINT_CUSTOMER_EVIDENCE_DISPUTE_DISPOSAL_CUSTOMER_DECISION_PROOF_PRODUCTION_READINESS_CONFORMANCE_BINDING_DRAFT_v001.json";

const parent = JSON.parse(fs.readFileSync(parentFile, "utf8"));
const d = JSON.parse(fs.readFileSync(file, "utf8"));

let ok = true;

function check(name, actual, expected) {
  if (actual !== expected) {
    console.log(`PRODUCTION_READINESS_CONFORMANCE_BINDING_DRAFT_MISMATCH ${name}: expected=${expected} actual=${actual}`);
    ok = false;
  }
}

function requireArray(name, expectedLength) {
  if (!Array.isArray(d[name])) {
    console.log(`PRODUCTION_READINESS_CONFORMANCE_BINDING_DRAFT_ARRAY_MISSING ${name}`);
    ok = false;
    return [];
  }

  if (d[name].length !== expectedLength) {
    console.log(`PRODUCTION_READINESS_CONFORMANCE_BINDING_DRAFT_ARRAY_LENGTH_MISMATCH ${name}: expected=${expectedLength} actual=${d[name].length}`);
    ok = false;
  }

  return d[name];
}

function unique(items) {
  return Array.from(new Set(items));
}

function requireIncludes(source, text, fragment) {
  if (!String(text || "").includes(fragment)) {
    console.log(`PRODUCTION_READINESS_CONFORMANCE_BINDING_DRAFT_FRAGMENT_MISSING ${source}: ${fragment}`);
    ok = false;
  }
}

check("parent.object_id", parent.object_id, "HBCE-ENDPOINT-CUSTOMER-EVIDENCE-DISPUTE-DISPOSAL-CUSTOMER-DECISION-PROOF-LEGAL-CERTIFICATION-CONFORMANCE-BINDING-DRAFT-V001");
check("parent.marker", parent.marker, "ENDPOINT_CUSTOMER_EVIDENCE_DISPUTE_DISPOSAL_CUSTOMER_DECISION_PROOF_LEGAL_CERTIFICATION_CONFORMANCE_BINDING_DRAFT=PASS");
check("parent.result", parent.result, "PASS_ENDPOINT_CUSTOMER_EVIDENCE_DISPUTE_DISPOSAL_CUSTOMER_DECISION_PROOF_LEGAL_CERTIFICATION_CONFORMANCE_BINDING_DRAFT");
check("parent.source_chain_entry_count", parent.source_chain_entry_count, 81);
check("parent.required_non_claim_count", parent.required_non_claim_count, 8048);
check("parent.required_no_execution_boundary_count", parent.required_no_execution_boundary_count, 8048);
check("parent.false_claim_property_count", parent.false_claim_property_count, 7682);
check("parent.recommended_next_program", parent.recommended_next_program, "PROG-364");

check("object_id", d.object_id, "HBCE-ENDPOINT-CUSTOMER-EVIDENCE-DISPUTE-DISPOSAL-CUSTOMER-DECISION-PROOF-PRODUCTION-READINESS-CONFORMANCE-BINDING-DRAFT-V001");
check("artifact_type", d.artifact_type, "HBCEEndpointCustomerEvidenceDisputeDisposalCustomerDecisionProofProductionReadinessConformanceBindingDraft");
check("classification", d.classification, "R_AND_D_ENDPOINT_CUSTOMER_EVIDENCE_DISPUTE_DISPOSAL_CUSTOMER_DECISION_PROOF_PRODUCTION_READINESS_CONFORMANCE_BINDING_DRAFT_ONLY");
check("status", d.status, "ACTIVE_ENDPOINT_CUSTOMER_EVIDENCE_DISPUTE_DISPOSAL_CUSTOMER_DECISION_PROOF_PRODUCTION_READINESS_CONFORMANCE_BINDING_DRAFT");
check("version", d.version, "v001");
check("program", d.program, "PROG-364");
check("marker", d.marker, "ENDPOINT_CUSTOMER_EVIDENCE_DISPUTE_DISPOSAL_CUSTOMER_DECISION_PROOF_PRODUCTION_READINESS_CONFORMANCE_BINDING_DRAFT=PASS");
check("basis_marker", d.basis_marker, "HBCE_ENDPOINT_CUSTOMER_EVIDENCE_DISPUTE_DISPOSAL_CUSTOMER_DECISION_PROOF_LEGAL_CERTIFICATION_CONFORMANCE_BINDING_DRAFT_FINAL_AUDIT=1");
check("basis_main_commit", d.basis_main_commit, "3daf9787dafeec40ea3cd25093c82b641a2304e4");
check("parent_object_id", d.parent_object_id, parent.object_id);
check("parent_marker", d.parent_marker, parent.marker);
check("parent_commit", d.parent_commit, "3daf9787dafeec40ea3cd25093c82b641a2304e4");

check("source_chain_model", d.source_chain_model, "COMPRESSED_PARENT_COUNT_PLUS_CURRENT_ENTRY");
check("parent_source_chain_entry_count", d.parent_source_chain_entry_count, 81);
check("source_chain_entry_count", d.source_chain_entry_count, 82);

check("binding_scope", d.binding_scope, "ENDPOINT_CUSTOMER_EVIDENCE_DISPUTE_DISPOSAL_CUSTOMER_DECISION_PROOF_PRODUCTION_READINESS_CONFORMANCE_BINDING");
check("binding_mode", d.binding_mode, "RECORD_ONLY_NOT_EXECUTABLE");
check("state", d.state, "NOT_IMPLEMENTED_NOT_EXECUTABLE_NOT_BOUND_TO_RUNTIME");
check("production_readiness_scope", d.production_readiness_scope, "CUSTOMER_DECISION_PROOF_PRODUCTION_READINESS_CONFORMANCE_ONLY");
check("production_readiness_conformance_scope", d.production_readiness_conformance_scope, "DEFINE_PRODUCTION_READINESS_BOUNDARIES_WITHOUT_PRODUCTION_READINESS_EXECUTION_CUSTOMER_READINESS_DEPLOYMENT_READINESS_RUNTIME_READINESS_OPERATIONAL_READINESS_OR_EXTERNAL_RELIANCE");
check("production_readiness_record_class", d.production_readiness_record_class, "CUSTOMER_DECISION_PROOF_PRODUCTION_READINESS_DRAFT_RECORD");

check("parent_non_claim_input_count", d.parent_non_claim_input_count, 8048);
check("parent_non_claim_unique_count", d.parent_non_claim_unique_count, 8048);
check("parent_no_execution_boundary_input_count", d.parent_no_execution_boundary_input_count, 8048);
check("parent_no_execution_boundary_unique_count", d.parent_no_execution_boundary_unique_count, 8048);

check("field_count", d.required_endpoint_customer_evidence_dispute_disposal_customer_decision_proof_production_readiness_conformance_field_count, 111);
check("binding_rule_count", d.binding_rule_count, 111);
check("future_resolution_requirement_count", d.future_resolution_requirement_count, 179);
check("required_non_claim_count", d.required_non_claim_count, 8227);
check("required_no_execution_boundary_count", d.required_no_execution_boundary_count, 8227);
check("false_claim_property_count", d.false_claim_property_count, 7685);
check("future_customer_decision_proof_production_readiness_false_key_count", d.future_customer_decision_proof_production_readiness_false_key_count, 179);
check("all_customer_decision_proof_production_readiness_false_key_count", d.all_customer_decision_proof_production_readiness_false_key_count, 179);
check("inherited_customer_decision_proof_production_readiness_false_key_count", d.inherited_customer_decision_proof_production_readiness_false_key_count, 0);
check("missing_future_customer_decision_proof_production_readiness_false_key_count", d.missing_future_customer_decision_proof_production_readiness_false_key_count, 0);
check("overlap_non_claim_count", d.overlap_non_claim_count, 0);
check("overlap_no_execution_boundary_count", d.overlap_no_execution_boundary_count, 0);

check("recommended_next_program", d.recommended_next_program, "PROG-365");
check("recommended_next_object_id", d.recommended_next_object_id, "HBCE-ENDPOINT-CUSTOMER-EVIDENCE-DISPUTE-DISPOSAL-CUSTOMER-DECISION-PROOF-CUSTOMER-READINESS-CONFORMANCE-BINDING-DRAFT-V001");
check("result", d.result, "PASS_ENDPOINT_CUSTOMER_EVIDENCE_DISPUTE_DISPOSAL_CUSTOMER_DECISION_PROOF_PRODUCTION_READINESS_CONFORMANCE_BINDING_DRAFT");

const fields = requireArray("required_endpoint_customer_evidence_dispute_disposal_customer_decision_proof_production_readiness_conformance_fields", 111);
const bindingRules = requireArray("binding_rules", 111);
const futureRequirements = requireArray("future_resolution_requirements", 179);
const explicitNonClaims = requireArray("explicit_non_claims", 8227);
const noExecutionBoundary = requireArray("no_execution_boundary", 8227);
const allProductionFalseKeys = requireArray("all_customer_decision_proof_production_readiness_false_keys", 179);
const inheritedProductionFalseKeys = requireArray("inherited_customer_decision_proof_production_readiness_false_keys", 0);
const missingFutureFalseKeysRecorded = requireArray("missing_future_customer_decision_proof_production_readiness_false_keys", 0);

check("fields.unique", unique(fields).length, 111);
check("binding_rules.unique", unique(bindingRules).length, 111);
check("future_requirements.unique", unique(futureRequirements).length, 179);
check("explicit_non_claims.unique", unique(explicitNonClaims).length, 8227);
check("no_execution_boundary.unique", unique(noExecutionBoundary).length, 8227);
check("all_production_false_keys.unique", unique(allProductionFalseKeys).length, 179);
check("inherited_false_keys.length", inheritedProductionFalseKeys.length, 0);
check("missing_future_false_keys_recorded.length", missingFutureFalseKeysRecorded.length, 0);

for (const field of fields) {
  const expectedRule = `bind_${field}_within_endpoint_customer_evidence_dispute_disposal_customer_decision_proof_production_readiness_conformance_only`;

  if (!bindingRules.includes(expectedRule)) {
    console.log(`PRODUCTION_READINESS_CONFORMANCE_BINDING_DRAFT_BINDING_RULE_MISSING ${expectedRule}`);
    ok = false;
  }
}

const productionPrefix = "endpoint_customer_evidence_dispute_disposal_customer_decision_proof_production_readiness_";

const futureFalseKeys = futureRequirements
  .filter((item) => item.startsWith(`define_future_resolution_for_${productionPrefix}`))
  .map((item) => item.replace("define_future_resolution_for_", ""))
  .sort();

const futureFalseKeySet = new Set(futureFalseKeys);

const allProductionFalseKeysDynamic = Object.keys(d)
  .filter((key) => key.startsWith(productionPrefix) && d[key] === false)
  .sort();

const inheritedProductionFalseKeysDynamic = allProductionFalseKeysDynamic
  .filter((key) => !futureFalseKeySet.has(key) && parent[key] === false)
  .sort();

const missingFutureFalseKeys = futureFalseKeys
  .filter((key) => d[key] !== false)
  .sort();

const falseClaimCount = Object.keys(d).filter((key) => d[key] === false).length;

check("false_claim_property_count_dynamic", falseClaimCount, 7685);
check("future_false_key_count_dynamic", futureFalseKeys.length, 179);
check("all_production_readiness_false_key_count_dynamic", allProductionFalseKeysDynamic.length, 179);
check("inherited_production_readiness_false_key_count_dynamic", inheritedProductionFalseKeysDynamic.length, 0);
check("missing_future_false_key_count_dynamic", missingFutureFalseKeys.length, 0);

if (d.required_non_claim_count !== d.parent_non_claim_unique_count + 179 - d.overlap_non_claim_count) {
  console.log("PRODUCTION_READINESS_CONFORMANCE_BINDING_DRAFT_NON_CLAIM_ARITHMETIC_INVALID");
  ok = false;
}

if (d.required_no_execution_boundary_count !== d.parent_no_execution_boundary_unique_count + 179 - d.overlap_no_execution_boundary_count) {
  console.log("PRODUCTION_READINESS_CONFORMANCE_BINDING_DRAFT_NO_EXECUTION_BOUNDARY_ARITHMETIC_INVALID");
  ok = false;
}

for (const key of [
  "customer_decision_proof_production_readiness_created",
  "customer_decision_proof_production_readiness_started",
  "customer_decision_proof_production_readiness_completed",
  "customer_decision_proof_production_readiness_effective",
  "customer_decision_proof_production_readiness_verified",
  "customer_decision_proof_production_readiness_approved",
  "customer_decision_proof_production_readiness_binding",
  "customer_decision_proof_production_ready",
  "production_readiness_created",
  "production_readiness_started",
  "production_readiness_completed",
  "production_readiness_effective",
  "production_readiness_verified",
  "production_readiness_approved",
  "production_readiness_binding",
  "production_readiness_ready",
  "production_execution_created",
  "production_execution_started",
  "production_execution_completed",
  "production_gate_passed",
  "production_gate_approved",
  "production_deployment_authorized",
  "production_runtime_authorized",
  "production_customer_use_authorized",
  "deployment_ready",
  "runtime_ready",
  "operational_ready",
  "service_ready",
  "support_ready",
  "security_ready",
  "privacy_ready",
  "legal_ready",
  "business_ready",
  "go_live_ready",
  "customer_ready",
  "production_ready",
  "external_reliance_allowed",
  "commercial_reliance_allowed",
  "customer_reliance_allowed",
  "legal_reliance_allowed"
]) {
  check(key, d[key], false);
}

const boundaryText = [
  d.source_document_boundary_statement || "",
  d.endpoint_customer_evidence_dispute_disposal_customer_decision_proof_production_readiness_boundary_statement || "",
  d.non_inference_rule || "",
  d.unknown_precedence_rule || ""
].join("\n");

for (const fragment of [
  "Customer Decision Proof Legal Certification draft does not imply Production Readiness",
  "Legal Certification Conformance draft does not imply production readiness",
  "Production Readiness Conformance draft does not imply production ready evidence",
  "Production Readiness Conformance draft does not imply customer readiness",
  "Production Readiness Conformance draft does not imply deployment readiness",
  "Production Readiness Conformance draft does not imply runtime readiness",
  "Production Readiness Conformance draft does not imply operational readiness",
  "Production Readiness Conformance draft != production ready",
  "Production Readiness Conformance draft != customer ready",
  "Production Readiness Conformance draft != deployment ready",
  "Production Readiness Conformance draft != runtime ready",
  "Production Readiness Conformance draft != operational ready",
  "does not create production readiness execution",
  "does not create production readiness",
  "does not create customer readiness",
  "does not create deployment readiness",
  "does not create runtime readiness",
  "does not create operational readiness",
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
  required_endpoint_customer_evidence_dispute_disposal_customer_decision_proof_production_readiness_conformance_field_count: d.required_endpoint_customer_evidence_dispute_disposal_customer_decision_proof_production_readiness_conformance_field_count,
  binding_rule_count: d.binding_rule_count,
  future_resolution_requirement_count: d.future_resolution_requirement_count,
  required_non_claim_count: d.required_non_claim_count,
  required_no_execution_boundary_count: d.required_no_execution_boundary_count,
  false_claim_property_count: d.false_claim_property_count,
  future_customer_decision_proof_production_readiness_false_key_count: d.future_customer_decision_proof_production_readiness_false_key_count,
  all_customer_decision_proof_production_readiness_false_key_count: d.all_customer_decision_proof_production_readiness_false_key_count,
  inherited_customer_decision_proof_production_readiness_false_key_count: d.inherited_customer_decision_proof_production_readiness_false_key_count,
  inherited_customer_decision_proof_production_readiness_false_keys_length: inheritedProductionFalseKeys.length,
  missing_future_customer_decision_proof_production_readiness_false_key_count: d.missing_future_customer_decision_proof_production_readiness_false_key_count,
  overlap_non_claim_count: d.overlap_non_claim_count,
  overlap_no_execution_boundary_count: d.overlap_no_execution_boundary_count,
  production_readiness_created: d.production_readiness_created,
  production_readiness_completed: d.production_readiness_completed,
  production_readiness_effective: d.production_readiness_effective,
  production_readiness_ready: d.production_readiness_ready,
  customer_ready: d.customer_ready,
  production_ready: d.production_ready,
  deployment_ready: d.deployment_ready,
  runtime_ready: d.runtime_ready,
  operational_ready: d.operational_ready,
  recommended_next_program: d.recommended_next_program,
  recommended_next_object_id: d.recommended_next_object_id,
  result: ok ? "PASS_ENDPOINT_CUSTOMER_EVIDENCE_DISPUTE_DISPOSAL_CUSTOMER_DECISION_PROOF_PRODUCTION_READINESS_CONFORMANCE_BINDING_DRAFT" : "FAIL_ENDPOINT_CUSTOMER_EVIDENCE_DISPUTE_DISPOSAL_CUSTOMER_DECISION_PROOF_PRODUCTION_READINESS_CONFORMANCE_BINDING_DRAFT"
}, null, 2));

if (!ok) {
  process.exitCode = 1;
}
