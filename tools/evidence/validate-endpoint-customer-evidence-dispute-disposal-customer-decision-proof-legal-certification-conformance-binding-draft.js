#!/usr/bin/env node

const fs = require("fs");

const parentFile = "evidence/authorization/20261009_HBCE_ENDPOINT_CUSTOMER_EVIDENCE_DISPUTE_DISPOSAL_CUSTOMER_DECISION_PROOF_LEGAL_VALIDITY_CONFORMANCE_BINDING_DRAFT_v001.json";
const file = "evidence/authorization/20261009_HBCE_ENDPOINT_CUSTOMER_EVIDENCE_DISPUTE_DISPOSAL_CUSTOMER_DECISION_PROOF_LEGAL_CERTIFICATION_CONFORMANCE_BINDING_DRAFT_v001.json";

const parent = JSON.parse(fs.readFileSync(parentFile, "utf8"));
const d = JSON.parse(fs.readFileSync(file, "utf8"));
const validatorText = fs.readFileSync(__filename, "utf8");

let ok = true;

function check(name, actual, expected) {
  if (actual !== expected) {
    console.log(`LEGAL_CERTIFICATION_VALIDATOR_MISMATCH ${name}: expected=${expected} actual=${actual}`);
    ok = false;
  }
}

function unique(items) {
  return Array.from(new Set(items));
}

function requireArray(name, expectedLength) {
  if (!Array.isArray(d[name])) {
    console.log(`LEGAL_CERTIFICATION_VALIDATOR_ARRAY_MISSING ${name}`);
    ok = false;
    return [];
  }

  if (d[name].length !== expectedLength) {
    console.log(`LEGAL_CERTIFICATION_VALIDATOR_ARRAY_LENGTH_MISMATCH ${name}: expected=${expectedLength} actual=${d[name].length}`);
    ok = false;
  }

  return d[name];
}

function requireIncludes(source, text, fragment) {
  if (!String(text || "").includes(fragment)) {
    console.log(`LEGAL_CERTIFICATION_VALIDATOR_FRAGMENT_MISSING ${source}: ${fragment}`);
    ok = false;
  }
}

check("parent.object_id", parent.object_id, "HBCE-ENDPOINT-CUSTOMER-EVIDENCE-DISPUTE-DISPOSAL-CUSTOMER-DECISION-PROOF-LEGAL-VALIDITY-CONFORMANCE-BINDING-DRAFT-V001");
check("parent.marker", parent.marker, "ENDPOINT_CUSTOMER_EVIDENCE_DISPUTE_DISPOSAL_CUSTOMER_DECISION_PROOF_LEGAL_VALIDITY_CONFORMANCE_BINDING_DRAFT=PASS");
check("parent.result", parent.result, "PASS_ENDPOINT_CUSTOMER_EVIDENCE_DISPUTE_DISPOSAL_CUSTOMER_DECISION_PROOF_LEGAL_VALIDITY_CONFORMANCE_BINDING_DRAFT");
check("parent.source_chain_entry_count", parent.source_chain_entry_count, 80);
check("parent.required_non_claim_count", parent.required_non_claim_count, 7869);
check("parent.required_no_execution_boundary_count", parent.required_no_execution_boundary_count, 7869);
check("parent.false_claim_property_count", parent.false_claim_property_count, 7679);
check("parent.recommended_next_program", parent.recommended_next_program, "PROG-363");
check("parent.recommended_next_object_id", parent.recommended_next_object_id, "HBCE-ENDPOINT-CUSTOMER-EVIDENCE-DISPUTE-DISPOSAL-CUSTOMER-DECISION-PROOF-LEGAL-CERTIFICATION-CONFORMANCE-BINDING-DRAFT-V001");

check("object_id", d.object_id, "HBCE-ENDPOINT-CUSTOMER-EVIDENCE-DISPUTE-DISPOSAL-CUSTOMER-DECISION-PROOF-LEGAL-CERTIFICATION-CONFORMANCE-BINDING-DRAFT-V001");
check("artifact_type", d.artifact_type, "HBCEEndpointCustomerEvidenceDisputeDisposalCustomerDecisionProofLegalCertificationConformanceBindingDraft");
check("classification", d.classification, "R_AND_D_ENDPOINT_CUSTOMER_EVIDENCE_DISPUTE_DISPOSAL_CUSTOMER_DECISION_PROOF_LEGAL_CERTIFICATION_CONFORMANCE_BINDING_DRAFT_ONLY");
check("status", d.status, "ACTIVE_ENDPOINT_CUSTOMER_EVIDENCE_DISPUTE_DISPOSAL_CUSTOMER_DECISION_PROOF_LEGAL_CERTIFICATION_CONFORMANCE_BINDING_DRAFT");
check("version", d.version, "v001");
check("program", d.program, "PROG-363");
check("marker", d.marker, "ENDPOINT_CUSTOMER_EVIDENCE_DISPUTE_DISPOSAL_CUSTOMER_DECISION_PROOF_LEGAL_CERTIFICATION_CONFORMANCE_BINDING_DRAFT=PASS");
check("basis_marker", d.basis_marker, "HBCE_ENDPOINT_CUSTOMER_EVIDENCE_DISPUTE_DISPOSAL_CUSTOMER_DECISION_PROOF_LEGAL_VALIDITY_CONFORMANCE_BINDING_DRAFT_FINAL_AUDIT=1");
check("basis_main_commit", d.basis_main_commit, "b084b35c0281f4397dd1c923b62b83c88c8ce752");
check("parent_object_id", d.parent_object_id, parent.object_id);
check("parent_marker", d.parent_marker, parent.marker);
check("parent_commit", d.parent_commit, "b084b35c0281f4397dd1c923b62b83c88c8ce752");

check("source_chain_model", d.source_chain_model, "COMPRESSED_PARENT_COUNT_PLUS_CURRENT_ENTRY");
check("parent_source_chain_entry_count", d.parent_source_chain_entry_count, 80);
check("source_chain_entry_count", d.source_chain_entry_count, 81);

check("binding_scope", d.binding_scope, "ENDPOINT_CUSTOMER_EVIDENCE_DISPUTE_DISPOSAL_CUSTOMER_DECISION_PROOF_LEGAL_CERTIFICATION_CONFORMANCE_BINDING");
check("binding_mode", d.binding_mode, "RECORD_ONLY_NOT_EXECUTABLE");
check("state", d.state, "NOT_IMPLEMENTED_NOT_EXECUTABLE_NOT_BOUND_TO_RUNTIME");
check("legal_certification_scope", d.legal_certification_scope, "CUSTOMER_DECISION_PROOF_LEGAL_CERTIFICATION_CONFORMANCE_ONLY");
check("legal_certification_conformance_scope", d.legal_certification_conformance_scope, "DEFINE_LEGAL_CERTIFICATION_BOUNDARIES_WITHOUT_LEGAL_CERTIFICATION_EXECUTION_CUSTOMER_READINESS_PRODUCTION_READINESS_OR_EXTERNAL_RELIANCE");
check("legal_certification_record_class", d.legal_certification_record_class, "CUSTOMER_DECISION_PROOF_LEGAL_CERTIFICATION_DRAFT_RECORD");

check("parent_non_claim_input_count", d.parent_non_claim_input_count, 7869);
check("parent_non_claim_unique_count", d.parent_non_claim_unique_count, 7869);
check("parent_non_claim_internal_duplicate_count", d.parent_non_claim_internal_duplicate_count, 0);
check("parent_no_execution_boundary_input_count", d.parent_no_execution_boundary_input_count, 7869);
check("parent_no_execution_boundary_unique_count", d.parent_no_execution_boundary_unique_count, 7869);
check("parent_no_execution_boundary_internal_duplicate_count", d.parent_no_execution_boundary_internal_duplicate_count, 0);

check("field_count", d.required_endpoint_customer_evidence_dispute_disposal_customer_decision_proof_legal_certification_conformance_field_count, 111);
check("binding_rule_count", d.binding_rule_count, 111);
check("future_resolution_requirement_count", d.future_resolution_requirement_count, 179);
check("required_non_claim_count", d.required_non_claim_count, 8048);
check("required_no_execution_boundary_count", d.required_no_execution_boundary_count, 8048);
check("false_claim_property_count", d.false_claim_property_count, 7682);
check("future_customer_decision_proof_legal_certification_false_key_count", d.future_customer_decision_proof_legal_certification_false_key_count, 179);
check("all_customer_decision_proof_legal_certification_false_key_count", d.all_customer_decision_proof_legal_certification_false_key_count, 179);
check("inherited_customer_decision_proof_legal_certification_false_key_count", d.inherited_customer_decision_proof_legal_certification_false_key_count, 0);
check("missing_future_customer_decision_proof_legal_certification_false_key_count", d.missing_future_customer_decision_proof_legal_certification_false_key_count, 0);
check("overlap_non_claim_count", d.overlap_non_claim_count, 0);
check("overlap_no_execution_boundary_count", d.overlap_no_execution_boundary_count, 0);

check("recommended_next_program", d.recommended_next_program, "PROG-364");
check("recommended_next_object_id", d.recommended_next_object_id, "HBCE-ENDPOINT-CUSTOMER-EVIDENCE-DISPUTE-DISPOSAL-CUSTOMER-DECISION-PROOF-PRODUCTION-READINESS-CONFORMANCE-BINDING-DRAFT-V001");
check("result", d.result, "PASS_ENDPOINT_CUSTOMER_EVIDENCE_DISPUTE_DISPOSAL_CUSTOMER_DECISION_PROOF_LEGAL_CERTIFICATION_CONFORMANCE_BINDING_DRAFT");

const fields = requireArray("required_endpoint_customer_evidence_dispute_disposal_customer_decision_proof_legal_certification_conformance_fields", 111);
const bindingRules = requireArray("binding_rules", 111);
const futureRequirements = requireArray("future_resolution_requirements", 179);
const explicitNonClaims = requireArray("explicit_non_claims", 8048);
const noExecutionBoundary = requireArray("no_execution_boundary", 8048);

check("fields.unique", unique(fields).length, 111);
check("binding_rules.unique", unique(bindingRules).length, 111);
check("future_requirements.unique", unique(futureRequirements).length, 179);
check("explicit_non_claims.unique", unique(explicitNonClaims).length, 8048);
check("no_execution_boundary.unique", unique(noExecutionBoundary).length, 8048);

for (const field of fields) {
  const expectedRule = `bind_${field}_within_endpoint_customer_evidence_dispute_disposal_customer_decision_proof_legal_certification_conformance_only`;

  if (!bindingRules.includes(expectedRule)) {
    console.log(`LEGAL_CERTIFICATION_VALIDATOR_BINDING_RULE_MISSING ${expectedRule}`);
    ok = false;
  }
}

const legalCertificationPrefix = "endpoint_customer_evidence_dispute_disposal_customer_decision_proof_legal_certification_";

const futureFalseKeys = futureRequirements
  .filter((item) => item.startsWith(`define_future_resolution_for_${legalCertificationPrefix}`))
  .map((item) => item.replace("define_future_resolution_for_", ""))
  .sort();

const futureFalseKeySet = new Set(futureFalseKeys);

const allLegalCertificationFalseKeys = Object.keys(d)
  .filter((key) => key.startsWith(legalCertificationPrefix) && d[key] === false)
  .sort();

const inheritedLegalCertificationFalseKeys = allLegalCertificationFalseKeys
  .filter((key) => !futureFalseKeySet.has(key) && parent[key] === false)
  .sort();

const missingFutureFalseKeys = futureFalseKeys
  .filter((key) => d[key] !== false)
  .sort();

const falseClaimCount = Object.keys(d).filter((key) => d[key] === false).length;

check("false_claim_property_count_dynamic", falseClaimCount, 7682);
check("future_false_key_count_dynamic", futureFalseKeys.length, 179);
check("all_legal_certification_false_key_count_dynamic", allLegalCertificationFalseKeys.length, 179);
check("inherited_legal_certification_false_key_count_dynamic", inheritedLegalCertificationFalseKeys.length, 0);
check("missing_future_false_key_count_dynamic", missingFutureFalseKeys.length, 0);

if (d.required_non_claim_count !== d.parent_non_claim_unique_count + 179 - d.overlap_non_claim_count) {
  console.log("LEGAL_CERTIFICATION_VALIDATOR_NON_CLAIM_ARITHMETIC_INVALID");
  ok = false;
}

if (d.required_no_execution_boundary_count !== d.parent_no_execution_boundary_unique_count + 179 - d.overlap_no_execution_boundary_count) {
  console.log("LEGAL_CERTIFICATION_VALIDATOR_NO_EXECUTION_BOUNDARY_ARITHMETIC_INVALID");
  ok = false;
}

for (const key of [
  "customer_decision_proof_legal_certification_created",
  "customer_decision_proof_legal_certification_started",
  "customer_decision_proof_legal_certification_completed",
  "customer_decision_proof_legal_certification_effective",
  "customer_decision_proof_legal_certification_verified",
  "customer_decision_proof_legal_certification_certified",
  "customer_decision_proof_legal_certification_approved",
  "customer_decision_proof_legal_certification_binding",
  "customer_decision_proof_legally_certified",
  "legal_certification_created",
  "legal_certification_started",
  "legal_certification_completed",
  "legal_certification_effective",
  "legal_certification_verified",
  "legal_certification_certified",
  "legal_certification_approved",
  "legal_certification_binding",
  "legal_effect_created",
  "legal_effect_effective",
  "enforceability_created",
  "enforceability_effective",
  "production_readiness_created",
  "production_readiness_started",
  "production_readiness_completed",
  "production_readiness_effective",
  "production_readiness_verified",
  "production_readiness_ready",
  "customer_ready",
  "production_ready",
  "deployment_ready",
  "runtime_ready",
  "operational_ready",
  "external_reliance_allowed",
  "commercial_reliance_allowed",
  "customer_reliance_allowed"
]) {
  check(key, d[key], false);
}

const boundaryText = [
  d.source_document_boundary_statement || "",
  d.endpoint_customer_evidence_dispute_disposal_customer_decision_proof_legal_certification_boundary_statement || "",
  d.non_inference_rule || "",
  d.unknown_precedence_rule || ""
].join("\n");

for (const fragment of [
  "does not create legal certification execution",
  "does not create legal certification",
  "does not create customer readiness",
  "does not create production readiness",
  "Customer Decision Proof Legal Validity draft does not imply Legal Certification",
  "Legal Validity Conformance draft does not imply legally certified evidence",
  "Legal Certification Conformance draft does not imply legally certified evidence",
  "Legal Certification Conformance draft != legally certified",
  "Legal Certification Conformance draft != customer ready",
  "Legal Certification Conformance draft != production ready",
  "UNKNOWN or INSUFFICIENT_EVIDENCE"
]) {
  requireIncludes("manifest_boundary", boundaryText, fragment);
  requireIncludes("validator", validatorText, fragment);
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
  required_endpoint_customer_evidence_dispute_disposal_customer_decision_proof_legal_certification_conformance_field_count: d.required_endpoint_customer_evidence_dispute_disposal_customer_decision_proof_legal_certification_conformance_field_count,
  binding_rule_count: d.binding_rule_count,
  future_resolution_requirement_count: d.future_resolution_requirement_count,
  required_non_claim_count: d.required_non_claim_count,
  required_no_execution_boundary_count: d.required_no_execution_boundary_count,
  false_claim_property_count: d.false_claim_property_count,
  future_customer_decision_proof_legal_certification_false_key_count: d.future_customer_decision_proof_legal_certification_false_key_count,
  all_customer_decision_proof_legal_certification_false_key_count: d.all_customer_decision_proof_legal_certification_false_key_count,
  inherited_customer_decision_proof_legal_certification_false_key_count: d.inherited_customer_decision_proof_legal_certification_false_key_count,
  inherited_customer_decision_proof_legal_certification_false_keys_length: Array.isArray(d.inherited_customer_decision_proof_legal_certification_false_keys) ? d.inherited_customer_decision_proof_legal_certification_false_keys.length : "NOT_ARRAY",
  missing_future_customer_decision_proof_legal_certification_false_key_count: d.missing_future_customer_decision_proof_legal_certification_false_key_count,
  overlap_non_claim_count: d.overlap_non_claim_count,
  overlap_no_execution_boundary_count: d.overlap_no_execution_boundary_count,
  legal_certification_created: d.legal_certification_created,
  legal_certification_completed: d.legal_certification_completed,
  legal_certification_effective: d.legal_certification_effective,
  legal_certification_certified: d.legal_certification_certified,
  customer_ready: d.customer_ready,
  production_ready: d.production_ready,
  recommended_next_program: d.recommended_next_program,
  recommended_next_object_id: d.recommended_next_object_id,
  result: ok ? "PASS_ENDPOINT_CUSTOMER_EVIDENCE_DISPUTE_DISPOSAL_CUSTOMER_DECISION_PROOF_LEGAL_CERTIFICATION_CONFORMANCE_BINDING_DRAFT" : "FAIL_ENDPOINT_CUSTOMER_EVIDENCE_DISPUTE_DISPOSAL_CUSTOMER_DECISION_PROOF_LEGAL_CERTIFICATION_CONFORMANCE_BINDING_DRAFT"
}, null, 2));

if (!ok) {
  process.exitCode = 1;
}
