#!/usr/bin/env node
"use strict";

const PROG_348_TEST_MARKER = "PROG_348_ENDPOINT_CUSTOMER_EVIDENCE_DISPUTE_DISPOSAL_CUSTOMER_DECISION_PROOF_RETENTION_CONFORMANCE_BINDING_DRAFT_TEST=PASS";

const fs = require("fs");

const parentFile = "evidence/authorization/20261008_HBCE_ENDPOINT_CUSTOMER_EVIDENCE_DISPUTE_DISPOSAL_CUSTOMER_DECISION_PROOF_CLOSURE_CONFORMANCE_BINDING_DRAFT_v001.json";
const file = "evidence/authorization/20261008_HBCE_ENDPOINT_CUSTOMER_EVIDENCE_DISPUTE_DISPOSAL_CUSTOMER_DECISION_PROOF_RETENTION_CONFORMANCE_BINDING_DRAFT_v001.json";

const parent = JSON.parse(fs.readFileSync(parentFile, "utf8"));
const d = JSON.parse(fs.readFileSync(file, "utf8"));

let ok = true;

function check(name, actual, expected) {
  if (actual !== expected) {
    console.log(`VALIDATOR_MISMATCH ${name}: expected=${expected} actual=${actual}`);
    ok = false;
  }
}

function requireArrayFromDoc(doc, name, expectedLength) {
  if (!Array.isArray(doc[name])) {
    console.log(`VALIDATOR_ARRAY_MISSING ${name}`);
    ok = false;
    return [];
  }

  if (doc[name].length !== expectedLength) {
    console.log(`VALIDATOR_ARRAY_LENGTH_MISMATCH ${name}: expected=${expectedLength} actual=${doc[name].length}`);
    ok = false;
  }

  return doc[name];
}

function unique(items) {
  return Array.from(new Set(items));
}

function requireIncludes(name, text, fragment) {
  if (!String(text || "").includes(fragment)) {
    console.log(`VALIDATOR_FRAGMENT_MISSING ${name}: ${fragment}`);
    ok = false;
  }
}

check("parent_object_id_source", parent.object_id, "HBCE-ENDPOINT-CUSTOMER-EVIDENCE-DISPUTE-DISPOSAL-CUSTOMER-DECISION-PROOF-CLOSURE-CONFORMANCE-BINDING-DRAFT-V001");
check("parent_marker_source", parent.marker, "ENDPOINT_CUSTOMER_EVIDENCE_DISPUTE_DISPOSAL_CUSTOMER_DECISION_PROOF_CLOSURE_CONFORMANCE_BINDING_DRAFT=PASS");
check("parent_result_source", parent.result, "PASS_ENDPOINT_CUSTOMER_EVIDENCE_DISPUTE_DISPOSAL_CUSTOMER_DECISION_PROOF_CLOSURE_CONFORMANCE_BINDING_DRAFT");
check("parent_program_source", parent.program, "PROG-347");
check("parent_source_chain_entry_count_source", parent.source_chain_entry_count, 65);
check("parent_required_non_claim_count_source", parent.required_non_claim_count, 5195);
check("parent_required_no_execution_boundary_count_source", parent.required_no_execution_boundary_count, 5195);
check("parent_false_claim_property_count_source", parent.false_claim_property_count, 5304);
check("parent_recommended_next_program_source", parent.recommended_next_program, "PROG-348");

const parentNonClaims = requireArrayFromDoc(parent, "explicit_non_claims", 5195);
const parentNoExecutionBoundary = requireArrayFromDoc(parent, "no_execution_boundary", 5195);
const parentNonClaimUniqueCount = unique(parentNonClaims).length;
const parentNoExecutionBoundaryUniqueCount = unique(parentNoExecutionBoundary).length;

check("computed_parent_non_claim_unique_count", parentNonClaimUniqueCount, 5184);
check("computed_parent_non_claim_internal_duplicate_count", parentNonClaims.length - parentNonClaimUniqueCount, 11);
check("computed_parent_no_execution_boundary_unique_count", parentNoExecutionBoundaryUniqueCount, 5184);
check("computed_parent_no_execution_boundary_internal_duplicate_count", parentNoExecutionBoundary.length - parentNoExecutionBoundaryUniqueCount, 11);

check("object_id", d.object_id, "HBCE-ENDPOINT-CUSTOMER-EVIDENCE-DISPUTE-DISPOSAL-CUSTOMER-DECISION-PROOF-RETENTION-CONFORMANCE-BINDING-DRAFT-V001");
check("artifact_type", d.artifact_type, "HBCEEndpointCustomerEvidenceDisputeDisposalCustomerDecisionProofRetentionConformanceBindingDraft");
check("classification", d.classification, "R_AND_D_ENDPOINT_CUSTOMER_EVIDENCE_DISPUTE_DISPOSAL_CUSTOMER_DECISION_PROOF_RETENTION_CONFORMANCE_BINDING_DRAFT_ONLY");
check("status", d.status, "ACTIVE_ENDPOINT_CUSTOMER_EVIDENCE_DISPUTE_DISPOSAL_CUSTOMER_DECISION_PROOF_RETENTION_CONFORMANCE_BINDING_DRAFT");
check("version", d.version, "v001");
check("program", d.program, "PROG-348");

check("binding_scope", d.binding_scope, "ENDPOINT_CUSTOMER_EVIDENCE_DISPUTE_DISPOSAL_CUSTOMER_DECISION_PROOF_RETENTION_CONFORMANCE_BINDING");
check("binding_mode", d.binding_mode, "RECORD_ONLY_NOT_EXECUTABLE");
check("state", d.state, "NOT_IMPLEMENTED_NOT_EXECUTABLE_NOT_BOUND_TO_RUNTIME");

check("marker", d.marker, "ENDPOINT_CUSTOMER_EVIDENCE_DISPUTE_DISPOSAL_CUSTOMER_DECISION_PROOF_RETENTION_CONFORMANCE_BINDING_DRAFT=PASS");
check("basis_marker", d.basis_marker, "HBCE_ENDPOINT_CUSTOMER_EVIDENCE_DISPUTE_DISPOSAL_CUSTOMER_DECISION_PROOF_CLOSURE_CONFORMANCE_BINDING_DRAFT_FINAL_AUDIT=1");
check("basis_main_commit", d.basis_main_commit, "8ac9da3b26e82ae740aae5b02c1ddf3253392752");

check("parent_object_id", d.parent_object_id, parent.object_id);
check("parent_marker", d.parent_marker, parent.marker);
check("parent_commit", d.parent_commit, "8ac9da3b26e82ae740aae5b02c1ddf3253392752");
check("parent_file", d.parent_file, parentFile);
check("parent_tag", d.parent_tag, "hbce-endpoint-customer-evidence-dispute-disposal-customer-decision-proof-closure-conformance-binding-draft-v001");
check("parent_release_title", d.parent_release_title, "PROG-347 Endpoint Customer Evidence Dispute Disposal Customer Decision Proof Closure Conformance Binding Draft v001");

check("source_chain_model", d.source_chain_model, "COMPRESSED_PARENT_COUNT_PLUS_CURRENT_ENTRY");
check("parent_source_chain_entry_count", d.parent_source_chain_entry_count, 65);
check("source_chain_entry_count", d.source_chain_entry_count, 66);

if (!d.source_chain_current_entry || typeof d.source_chain_current_entry !== "object") {
  console.log("VALIDATOR_SOURCE_CHAIN_CURRENT_ENTRY_MISSING");
  ok = false;
} else {
  check("source_chain_current_entry_program", d.source_chain_current_entry.program, "PROG-348");
  check("source_chain_current_entry_object_id", d.source_chain_current_entry.object_id, d.object_id);
  check("source_chain_current_entry_marker", d.source_chain_current_entry.marker, d.marker);
  check("source_chain_current_entry_parent_object_id", d.source_chain_current_entry.parent_object_id, parent.object_id);
  check("source_chain_current_entry_parent_marker", d.source_chain_current_entry.parent_marker, parent.marker);
  check("source_chain_current_entry_parent_commit", d.source_chain_current_entry.parent_commit, "8ac9da3b26e82ae740aae5b02c1ddf3253392752");
}

check("retention_scope", d.retention_scope, "CUSTOMER_DECISION_PROOF_RETENTION_CONFORMANCE_ONLY");
check("retention_conformance_scope", d.retention_conformance_scope, "DEFINE_RETENTION_BOUNDARIES_WITHOUT_RETENTION_EXECUTION_OR_ARCHIVAL_COMPLETION");
check("retention_record_class", d.retention_record_class, "CUSTOMER_DECISION_PROOF_RETENTION_DRAFT_RECORD");

check("parent_non_claim_input_count", d.parent_non_claim_input_count, 5195);
check("parent_non_claim_unique_count", d.parent_non_claim_unique_count, 5184);
check("parent_non_claim_internal_duplicate_count", d.parent_non_claim_internal_duplicate_count, 11);
check("parent_no_execution_boundary_input_count", d.parent_no_execution_boundary_input_count, 5195);
check("parent_no_execution_boundary_unique_count", d.parent_no_execution_boundary_unique_count, 5184);
check("parent_no_execution_boundary_internal_duplicate_count", d.parent_no_execution_boundary_internal_duplicate_count, 11);

check("field_count", d.required_endpoint_customer_evidence_dispute_disposal_customer_decision_proof_retention_conformance_field_count, 111);
check("binding_rule_count", d.binding_rule_count, 111);
check("future_resolution_requirement_count", d.future_resolution_requirement_count, 179);
check("required_non_claim_count", d.required_non_claim_count, 5363);
check("required_no_execution_boundary_count", d.required_no_execution_boundary_count, 5363);
check("false_claim_property_count", d.false_claim_property_count, 5539);
check("future_customer_decision_proof_retention_false_key_count", d.future_customer_decision_proof_retention_false_key_count, 179);
check("all_customer_decision_proof_retention_false_key_count", d.all_customer_decision_proof_retention_false_key_count, 179);
check("inherited_customer_decision_proof_retention_false_key_count", d.inherited_customer_decision_proof_retention_false_key_count, 0);
check("missing_future_customer_decision_proof_retention_false_key_count", d.missing_future_customer_decision_proof_retention_false_key_count, 0);
check("overlap_non_claim_count", d.overlap_non_claim_count, 0);
check("overlap_no_execution_boundary_count", d.overlap_no_execution_boundary_count, 0);

check("recommended_next_program", d.recommended_next_program, "PROG-349");
check("recommended_next_object_id", d.recommended_next_object_id, "HBCE-ENDPOINT-CUSTOMER-EVIDENCE-DISPUTE-DISPOSAL-CUSTOMER-DECISION-PROOF-ARCHIVE-CONFORMANCE-BINDING-DRAFT-V001");
check("result", d.result, "PASS_ENDPOINT_CUSTOMER_EVIDENCE_DISPUTE_DISPOSAL_CUSTOMER_DECISION_PROOF_RETENTION_CONFORMANCE_BINDING_DRAFT");

const fields = requireArrayFromDoc(d, "required_endpoint_customer_evidence_dispute_disposal_customer_decision_proof_retention_conformance_fields", 111);
const bindingRules = requireArrayFromDoc(d, "binding_rules", 111);
const futureRequirements = requireArrayFromDoc(d, "future_resolution_requirements", 179);
const nonClaims = requireArrayFromDoc(d, "explicit_non_claims", 5363);
const noExecutionBoundary = requireArrayFromDoc(d, "no_execution_boundary", 5363);

check("non_claim_unique_count_matches_array", unique(nonClaims).length, 5363);
check("no_execution_boundary_unique_count_matches_array", unique(noExecutionBoundary).length, 5363);

for (const field of fields) {
  const expectedRule = `bind_${field}_within_endpoint_customer_evidence_dispute_disposal_customer_decision_proof_retention_conformance_only`;

  if (!bindingRules.includes(expectedRule)) {
    console.log(`VALIDATOR_BINDING_RULE_MISSING ${expectedRule}`);
    ok = false;
  }
}

const prefix = "endpoint_customer_evidence_dispute_disposal_customer_decision_proof_retention_";

const futureFalseKeys = futureRequirements
  .filter((item) => item.startsWith(`define_future_resolution_for_${prefix}`))
  .map((item) => item.replace("define_future_resolution_for_", ""))
  .sort();

const allRetentionFalseKeys = Object.keys(d)
  .filter((key) => key.startsWith(prefix) && d[key] === false)
  .sort();

const futureFalseKeySet = new Set(futureFalseKeys);

const inheritedRetentionFalseKeys = allRetentionFalseKeys
  .filter((key) => !futureFalseKeySet.has(key) && parent[key] === false)
  .sort();

const missingFutureFalseKeys = futureFalseKeys
  .filter((key) => d[key] !== false)
  .sort();

const falseClaimCount = Object.keys(d).filter((key) => d[key] === false).length;

check("false_claim_property_count_dynamic", falseClaimCount, 5539);
check("future_retention_false_key_count_dynamic", futureFalseKeys.length, 179);
check("all_retention_false_key_count_dynamic", allRetentionFalseKeys.length, 179);
check("inherited_retention_false_key_count_dynamic", inheritedRetentionFalseKeys.length, 0);
check("missing_future_retention_false_key_count_dynamic", missingFutureFalseKeys.length, 0);

if (Array.isArray(d.inherited_customer_decision_proof_retention_false_keys)) {
  check("declared_inherited_customer_decision_proof_retention_false_keys_json", JSON.stringify(d.inherited_customer_decision_proof_retention_false_keys), JSON.stringify([]));
} else {
  console.log("VALIDATOR_INHERITED_CUSTOMER_DECISION_PROOF_RETENTION_FALSE_KEYS_ARRAY_MISSING");
  ok = false;
}

if (d.required_non_claim_count !== d.parent_non_claim_unique_count + 179 - d.overlap_non_claim_count) {
  console.log(`VALIDATOR_NON_CLAIM_ARITHMETIC_INVALID actual=${d.required_non_claim_count} parentUnique=${d.parent_non_claim_unique_count} overlap=${d.overlap_non_claim_count}`);
  ok = false;
}

if (d.required_no_execution_boundary_count !== d.parent_no_execution_boundary_unique_count + 179 - d.overlap_no_execution_boundary_count) {
  console.log(`VALIDATOR_NO_EXECUTION_BOUNDARY_ARITHMETIC_INVALID actual=${d.required_no_execution_boundary_count} parentUnique=${d.parent_no_execution_boundary_unique_count} overlap=${d.overlap_no_execution_boundary_count}`);
  ok = false;
}

for (const key of futureFalseKeys) {
  const futureRequirement = `define_future_resolution_for_${key}`;
  const nonClaim = `no_${key}_claim`;
  const boundary = `${key}_false`;

  if (!futureRequirements.includes(futureRequirement)) {
    console.log(`VALIDATOR_FUTURE_REQUIREMENT_MISSING ${futureRequirement}`);
    ok = false;
  }

  if (!nonClaims.includes(nonClaim)) {
    console.log(`VALIDATOR_NON_CLAIM_ENTRY_MISSING ${nonClaim}`);
    ok = false;
  }

  if (!noExecutionBoundary.includes(boundary)) {
    console.log(`VALIDATOR_NO_EXECUTION_BOUNDARY_ENTRY_MISSING ${boundary}`);
    ok = false;
  }
}

const criticalFalseClaims = [
  "customer_decision_proof_retention_created",
  "customer_decision_proof_retention_completed",
  "customer_decision_proof_retention_effective",
  "customer_decision_proof_retained",
  "customer_decision_proof_archived",
  "customer_decision_proof_preserved",
  "customer_decision_proof_deleted",
  "customer_decision_proof_purged",
  "customer_retention_created",
  "customer_retention_completed",
  "customer_retention_effective",
  "retention_created",
  "retention_started",
  "retention_completed",
  "retention_effective",
  "retention_schedule_applied",
  "retention_period_started",
  "retention_period_completed",
  "retention_period_expired",
  "retention_legal_hold_created",
  "retention_legal_hold_effective",
  "legal_hold_created",
  "archive_created",
  "archive_completed",
  "archival_retention_completed",
  "evidence_preserved",
  "evidence_deleted",
  "evidence_purged",
  "deletion_completed",
  "purge_completed",
  "disposition_completed",
  "dispute_closed",
  "case_closed",
  "decision_proof_closed",
  "decision_proof_legally_final",
  "legal_truth_created",
  "legal_finality_created",
  "legal_validity_created",
  "legal_certification_created",
  "matrix_effective_state_created",
  "qualified_verification_completed",
  "independent_reconstruction_completed",
  "verification_completed",
  "execution_completed",
  "disposal_completed",
  "target_mutated",
  "customer_ready",
  "production_ready"
];

for (const key of criticalFalseClaims) {
  check(key, d[key], false);
}

const boundaryText = [
  d.source_document_boundary_statement || "",
  d.endpoint_customer_evidence_dispute_disposal_customer_decision_proof_retention_boundary_statement || "",
  d.non_inference_rule || "",
  d.unknown_precedence_rule || ""
].join("\n");

const requiredBoundaryFragments = [
  "does not create retention",
  "does not start a retention period",
  "does not complete retention",
  "does not archive records",
  "does not preserve evidence",
  "does not delete or purge records",
  "does not create legal hold",
  "does not create legal finality",
  "does not create legal validity",
  "does not create production readiness",
  "does not create legal certification",
  "Customer Decision Proof Closure draft does not imply Customer Decision Proof Retention",
  "Customer Decision Proof Retention draft does not imply archive completion",
  "UNKNOWN or INSUFFICIENT_EVIDENCE"
];

for (const fragment of requiredBoundaryFragments) {
  requireIncludes("boundary", boundaryText, fragment);
}

console.log(JSON.stringify({
  marker: d.marker,
  object_id: d.object_id,
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
  parent_non_claim_internal_duplicate_count: d.parent_non_claim_internal_duplicate_count,
  parent_no_execution_boundary_input_count: d.parent_no_execution_boundary_input_count,
  parent_no_execution_boundary_unique_count: d.parent_no_execution_boundary_unique_count,
  parent_no_execution_boundary_internal_duplicate_count: d.parent_no_execution_boundary_internal_duplicate_count,
  required_endpoint_customer_evidence_dispute_disposal_customer_decision_proof_retention_conformance_field_count: d.required_endpoint_customer_evidence_dispute_disposal_customer_decision_proof_retention_conformance_field_count,
  binding_rule_count: d.binding_rule_count,
  future_resolution_requirement_count: d.future_resolution_requirement_count,
  required_non_claim_count: d.required_non_claim_count,
  required_no_execution_boundary_count: d.required_no_execution_boundary_count,
  false_claim_property_count: falseClaimCount,
  future_customer_decision_proof_retention_false_key_count: futureFalseKeys.length,
  all_customer_decision_proof_retention_false_key_count: allRetentionFalseKeys.length,
  inherited_customer_decision_proof_retention_false_key_count: inheritedRetentionFalseKeys.length,
  inherited_customer_decision_proof_retention_false_keys: inheritedRetentionFalseKeys,
  missing_future_customer_decision_proof_retention_false_key_count: missingFutureFalseKeys.length,
  overlap_non_claim_count: d.overlap_non_claim_count,
  overlap_no_execution_boundary_count: d.overlap_no_execution_boundary_count,
  customer_decision_proof_retention_created: d.customer_decision_proof_retention_created,
  customer_decision_proof_retention_completed: d.customer_decision_proof_retention_completed,
  customer_decision_proof_retention_effective: d.customer_decision_proof_retention_effective,
  customer_decision_proof_retained: d.customer_decision_proof_retained,
  customer_decision_proof_archived: d.customer_decision_proof_archived,
  customer_decision_proof_preserved: d.customer_decision_proof_preserved,
  retention_created: d.retention_created,
  retention_completed: d.retention_completed,
  retention_effective: d.retention_effective,
  archive_completed: d.archive_completed,
  archival_retention_completed: d.archival_retention_completed,
  evidence_preserved: d.evidence_preserved,
  legal_hold_created: d.legal_hold_created,
  legal_finality_created: d.legal_finality_created,
  legal_validity_created: d.legal_validity_created,
  legal_certification_created: d.legal_certification_created,
  customer_ready: d.customer_ready,
  production_ready: d.production_ready,
  recommended_next_program: d.recommended_next_program,
  recommended_next_object_id: d.recommended_next_object_id,
  result: ok ? "PASS_ENDPOINT_CUSTOMER_EVIDENCE_DISPUTE_DISPOSAL_CUSTOMER_DECISION_PROOF_RETENTION_CONFORMANCE_BINDING_DRAFT" : "FAIL_ENDPOINT_CUSTOMER_EVIDENCE_DISPUTE_DISPOSAL_CUSTOMER_DECISION_PROOF_RETENTION_CONFORMANCE_BINDING_DRAFT"
}, null, 2));

if (!ok) {
  process.exitCode = 1;
}
