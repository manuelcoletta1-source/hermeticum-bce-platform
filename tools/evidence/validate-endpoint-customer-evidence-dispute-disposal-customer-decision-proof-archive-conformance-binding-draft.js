#!/usr/bin/env node
"use strict";

const PROG_349_TEST_MARKER = "PROG_349_ENDPOINT_CUSTOMER_EVIDENCE_DISPUTE_DISPOSAL_CUSTOMER_DECISION_PROOF_ARCHIVE_CONFORMANCE_BINDING_DRAFT_TEST=PASS";

const fs = require("fs");

const parentFile = "evidence/authorization/20261008_HBCE_ENDPOINT_CUSTOMER_EVIDENCE_DISPUTE_DISPOSAL_CUSTOMER_DECISION_PROOF_RETENTION_CONFORMANCE_BINDING_DRAFT_v001.json";
const file = "evidence/authorization/20261008_HBCE_ENDPOINT_CUSTOMER_EVIDENCE_DISPUTE_DISPOSAL_CUSTOMER_DECISION_PROOF_ARCHIVE_CONFORMANCE_BINDING_DRAFT_v001.json";

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

check("parent_object_id_source", parent.object_id, "HBCE-ENDPOINT-CUSTOMER-EVIDENCE-DISPUTE-DISPOSAL-CUSTOMER-DECISION-PROOF-RETENTION-CONFORMANCE-BINDING-DRAFT-V001");
check("parent_marker_source", parent.marker, "ENDPOINT_CUSTOMER_EVIDENCE_DISPUTE_DISPOSAL_CUSTOMER_DECISION_PROOF_RETENTION_CONFORMANCE_BINDING_DRAFT=PASS");
check("parent_result_source", parent.result, "PASS_ENDPOINT_CUSTOMER_EVIDENCE_DISPUTE_DISPOSAL_CUSTOMER_DECISION_PROOF_RETENTION_CONFORMANCE_BINDING_DRAFT");
check("parent_program_source", parent.program, "PROG-348");
check("parent_source_chain_entry_count_source", parent.source_chain_entry_count, 66);
check("parent_required_non_claim_count_source", parent.required_non_claim_count, 5363);
check("parent_required_no_execution_boundary_count_source", parent.required_no_execution_boundary_count, 5363);
check("parent_false_claim_property_count_source", parent.false_claim_property_count, 5539);
check("parent_recommended_next_program_source", parent.recommended_next_program, "PROG-349");

const parentNonClaims = requireArrayFromDoc(parent, "explicit_non_claims", 5363);
const parentNoExecutionBoundary = requireArrayFromDoc(parent, "no_execution_boundary", 5363);
const parentNonClaimUniqueCount = unique(parentNonClaims).length;
const parentNoExecutionBoundaryUniqueCount = unique(parentNoExecutionBoundary).length;

check("computed_parent_non_claim_unique_count", parentNonClaimUniqueCount, 5363);
check("computed_parent_non_claim_internal_duplicate_count", parentNonClaims.length - parentNonClaimUniqueCount, 0);
check("computed_parent_no_execution_boundary_unique_count", parentNoExecutionBoundaryUniqueCount, 5363);
check("computed_parent_no_execution_boundary_internal_duplicate_count", parentNoExecutionBoundary.length - parentNoExecutionBoundaryUniqueCount, 0);

check("object_id", d.object_id, "HBCE-ENDPOINT-CUSTOMER-EVIDENCE-DISPUTE-DISPOSAL-CUSTOMER-DECISION-PROOF-ARCHIVE-CONFORMANCE-BINDING-DRAFT-V001");
check("artifact_type", d.artifact_type, "HBCEEndpointCustomerEvidenceDisputeDisposalCustomerDecisionProofArchiveConformanceBindingDraft");
check("classification", d.classification, "R_AND_D_ENDPOINT_CUSTOMER_EVIDENCE_DISPUTE_DISPOSAL_CUSTOMER_DECISION_PROOF_ARCHIVE_CONFORMANCE_BINDING_DRAFT_ONLY");
check("status", d.status, "ACTIVE_ENDPOINT_CUSTOMER_EVIDENCE_DISPUTE_DISPOSAL_CUSTOMER_DECISION_PROOF_ARCHIVE_CONFORMANCE_BINDING_DRAFT");
check("version", d.version, "v001");
check("program", d.program, "PROG-349");

check("binding_scope", d.binding_scope, "ENDPOINT_CUSTOMER_EVIDENCE_DISPUTE_DISPOSAL_CUSTOMER_DECISION_PROOF_ARCHIVE_CONFORMANCE_BINDING");
check("binding_mode", d.binding_mode, "RECORD_ONLY_NOT_EXECUTABLE");
check("state", d.state, "NOT_IMPLEMENTED_NOT_EXECUTABLE_NOT_BOUND_TO_RUNTIME");

check("marker", d.marker, "ENDPOINT_CUSTOMER_EVIDENCE_DISPUTE_DISPOSAL_CUSTOMER_DECISION_PROOF_ARCHIVE_CONFORMANCE_BINDING_DRAFT=PASS");
check("basis_marker", d.basis_marker, "HBCE_ENDPOINT_CUSTOMER_EVIDENCE_DISPUTE_DISPOSAL_CUSTOMER_DECISION_PROOF_RETENTION_CONFORMANCE_BINDING_DRAFT_FINAL_AUDIT=1");
check("basis_main_commit", d.basis_main_commit, "94f8179d32d0062064b175e7235143ec6378698e");

check("parent_object_id", d.parent_object_id, parent.object_id);
check("parent_marker", d.parent_marker, parent.marker);
check("parent_commit", d.parent_commit, "94f8179d32d0062064b175e7235143ec6378698e");
check("parent_file", d.parent_file, parentFile);
check("parent_tag", d.parent_tag, "hbce-endpoint-customer-evidence-dispute-disposal-customer-decision-proof-retention-conformance-binding-draft-v001");
check("parent_release_title", d.parent_release_title, "PROG-348 Endpoint Customer Evidence Dispute Disposal Customer Decision Proof Retention Conformance Binding Draft v001");

check("source_chain_model", d.source_chain_model, "COMPRESSED_PARENT_COUNT_PLUS_CURRENT_ENTRY");
check("parent_source_chain_entry_count", d.parent_source_chain_entry_count, 66);
check("source_chain_entry_count", d.source_chain_entry_count, 67);

if (!d.source_chain_current_entry || typeof d.source_chain_current_entry !== "object") {
  console.log("VALIDATOR_SOURCE_CHAIN_CURRENT_ENTRY_MISSING");
  ok = false;
} else {
  check("source_chain_current_entry_program", d.source_chain_current_entry.program, "PROG-349");
  check("source_chain_current_entry_object_id", d.source_chain_current_entry.object_id, d.object_id);
  check("source_chain_current_entry_marker", d.source_chain_current_entry.marker, d.marker);
  check("source_chain_current_entry_parent_object_id", d.source_chain_current_entry.parent_object_id, parent.object_id);
  check("source_chain_current_entry_parent_marker", d.source_chain_current_entry.parent_marker, parent.marker);
  check("source_chain_current_entry_parent_commit", d.source_chain_current_entry.parent_commit, "94f8179d32d0062064b175e7235143ec6378698e");
}

check("archive_scope", d.archive_scope, "CUSTOMER_DECISION_PROOF_ARCHIVE_CONFORMANCE_ONLY");
check("archive_conformance_scope", d.archive_conformance_scope, "DEFINE_ARCHIVE_BOUNDARIES_WITHOUT_ARCHIVE_EXECUTION_STORAGE_OR_PRESERVATION_COMPLETION");
check("archive_record_class", d.archive_record_class, "CUSTOMER_DECISION_PROOF_ARCHIVE_DRAFT_RECORD");

check("parent_non_claim_input_count", d.parent_non_claim_input_count, 5363);
check("parent_non_claim_unique_count", d.parent_non_claim_unique_count, 5363);
check("parent_non_claim_internal_duplicate_count", d.parent_non_claim_internal_duplicate_count, 0);
check("parent_no_execution_boundary_input_count", d.parent_no_execution_boundary_input_count, 5363);
check("parent_no_execution_boundary_unique_count", d.parent_no_execution_boundary_unique_count, 5363);
check("parent_no_execution_boundary_internal_duplicate_count", d.parent_no_execution_boundary_internal_duplicate_count, 0);

check("field_count", d.required_endpoint_customer_evidence_dispute_disposal_customer_decision_proof_archive_conformance_field_count, 111);
check("binding_rule_count", d.binding_rule_count, 111);
check("future_resolution_requirement_count", d.future_resolution_requirement_count, 179);
check("required_non_claim_count", d.required_non_claim_count, 5542);
check("required_no_execution_boundary_count", d.required_no_execution_boundary_count, 5542);
check("false_claim_property_count", d.false_claim_property_count, 5758);
check("future_customer_decision_proof_archive_false_key_count", d.future_customer_decision_proof_archive_false_key_count, 179);
check("all_customer_decision_proof_archive_false_key_count", d.all_customer_decision_proof_archive_false_key_count, 179);
check("inherited_customer_decision_proof_archive_false_key_count", d.inherited_customer_decision_proof_archive_false_key_count, 0);
check("missing_future_customer_decision_proof_archive_false_key_count", d.missing_future_customer_decision_proof_archive_false_key_count, 0);
check("overlap_non_claim_count", d.overlap_non_claim_count, 0);
check("overlap_no_execution_boundary_count", d.overlap_no_execution_boundary_count, 0);

check("recommended_next_program", d.recommended_next_program, "PROG-350");
check("recommended_next_object_id", d.recommended_next_object_id, "HBCE-ENDPOINT-CUSTOMER-EVIDENCE-DISPUTE-DISPOSAL-CUSTOMER-DECISION-PROOF-PRESERVATION-CONFORMANCE-BINDING-DRAFT-V001");
check("result", d.result, "PASS_ENDPOINT_CUSTOMER_EVIDENCE_DISPUTE_DISPOSAL_CUSTOMER_DECISION_PROOF_ARCHIVE_CONFORMANCE_BINDING_DRAFT");

const fields = requireArrayFromDoc(d, "required_endpoint_customer_evidence_dispute_disposal_customer_decision_proof_archive_conformance_fields", 111);
const bindingRules = requireArrayFromDoc(d, "binding_rules", 111);
const futureRequirements = requireArrayFromDoc(d, "future_resolution_requirements", 179);
const nonClaims = requireArrayFromDoc(d, "explicit_non_claims", 5542);
const noExecutionBoundary = requireArrayFromDoc(d, "no_execution_boundary", 5542);

check("non_claim_unique_count_matches_array", unique(nonClaims).length, 5542);
check("no_execution_boundary_unique_count_matches_array", unique(noExecutionBoundary).length, 5542);

for (const field of fields) {
  const expectedRule = `bind_${field}_within_endpoint_customer_evidence_dispute_disposal_customer_decision_proof_archive_conformance_only`;

  if (!bindingRules.includes(expectedRule)) {
    console.log(`VALIDATOR_BINDING_RULE_MISSING ${expectedRule}`);
    ok = false;
  }
}

const prefix = "endpoint_customer_evidence_dispute_disposal_customer_decision_proof_archive_";

const futureFalseKeys = futureRequirements
  .filter((item) => item.startsWith(`define_future_resolution_for_${prefix}`))
  .map((item) => item.replace("define_future_resolution_for_", ""))
  .sort();

const allArchiveFalseKeys = Object.keys(d)
  .filter((key) => key.startsWith(prefix) && d[key] === false)
  .sort();

const futureFalseKeySet = new Set(futureFalseKeys);

const inheritedArchiveFalseKeys = allArchiveFalseKeys
  .filter((key) => !futureFalseKeySet.has(key) && parent[key] === false)
  .sort();

const missingFutureFalseKeys = futureFalseKeys
  .filter((key) => d[key] !== false)
  .sort();

const falseClaimCount = Object.keys(d).filter((key) => d[key] === false).length;

check("false_claim_property_count_dynamic", falseClaimCount, 5758);
check("future_archive_false_key_count_dynamic", futureFalseKeys.length, 179);
check("all_archive_false_key_count_dynamic", allArchiveFalseKeys.length, 179);
check("inherited_archive_false_key_count_dynamic", inheritedArchiveFalseKeys.length, 0);
check("missing_future_archive_false_key_count_dynamic", missingFutureFalseKeys.length, 0);

if (Array.isArray(d.inherited_customer_decision_proof_archive_false_keys)) {
  check("declared_inherited_customer_decision_proof_archive_false_keys_json", JSON.stringify(d.inherited_customer_decision_proof_archive_false_keys), JSON.stringify([]));
} else {
  console.log("VALIDATOR_INHERITED_CUSTOMER_DECISION_PROOF_ARCHIVE_FALSE_KEYS_ARRAY_MISSING");
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
  "customer_decision_proof_archive_created",
  "customer_decision_proof_archive_completed",
  "customer_decision_proof_archive_effective",
  "customer_decision_proof_archived",
  "customer_decision_proof_stored",
  "customer_decision_proof_indexed",
  "customer_decision_proof_preserved",
  "customer_decision_proof_exported",
  "customer_decision_proof_reconstructed",
  "customer_archive_created",
  "customer_archive_completed",
  "customer_archive_effective",
  "archive_created",
  "archive_started",
  "archive_completed",
  "archive_effective",
  "archive_storage_created",
  "archive_storage_completed",
  "archive_location_created",
  "archive_index_created",
  "archive_index_completed",
  "archive_integrity_proof_created",
  "archive_integrity_proof_completed",
  "archive_access_created",
  "archive_export_completed",
  "archive_reconstruction_completed",
  "archive_retention_link_created",
  "archive_preservation_link_created",
  "archive_custody_transferred",
  "custody_transferred",
  "storage_created",
  "storage_completed",
  "index_created",
  "index_completed",
  "record_archived",
  "record_stored",
  "record_preserved",
  "evidence_archived",
  "evidence_stored",
  "evidence_preserved",
  "retention_completed",
  "retention_effective",
  "legal_hold_created",
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
  d.endpoint_customer_evidence_dispute_disposal_customer_decision_proof_archive_boundary_statement || "",
  d.non_inference_rule || "",
  d.unknown_precedence_rule || ""
].join("\n");

const requiredBoundaryFragments = [
  "does not create archive execution",
  "does not archive records",
  "does not create storage",
  "does not index records",
  "does not preserve evidence",
  "does not transfer custody",
  "does not create retention",
  "does not delete or purge records",
  "does not create legal hold",
  "does not create legal finality",
  "does not create legal validity",
  "does not create production readiness",
  "does not create legal certification",
  "Customer Decision Proof Retention draft does not imply Customer Decision Proof Archive",
  "Customer Decision Proof Archive draft does not imply archive execution",
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
  required_endpoint_customer_evidence_dispute_disposal_customer_decision_proof_archive_conformance_field_count: d.required_endpoint_customer_evidence_dispute_disposal_customer_decision_proof_archive_conformance_field_count,
  binding_rule_count: d.binding_rule_count,
  future_resolution_requirement_count: d.future_resolution_requirement_count,
  required_non_claim_count: d.required_non_claim_count,
  required_no_execution_boundary_count: d.required_no_execution_boundary_count,
  false_claim_property_count: falseClaimCount,
  future_customer_decision_proof_archive_false_key_count: futureFalseKeys.length,
  all_customer_decision_proof_archive_false_key_count: allArchiveFalseKeys.length,
  inherited_customer_decision_proof_archive_false_key_count: inheritedArchiveFalseKeys.length,
  inherited_customer_decision_proof_archive_false_keys: inheritedArchiveFalseKeys,
  missing_future_customer_decision_proof_archive_false_key_count: missingFutureFalseKeys.length,
  overlap_non_claim_count: d.overlap_non_claim_count,
  overlap_no_execution_boundary_count: d.overlap_no_execution_boundary_count,
  customer_decision_proof_archive_created: d.customer_decision_proof_archive_created,
  customer_decision_proof_archive_completed: d.customer_decision_proof_archive_completed,
  customer_decision_proof_archive_effective: d.customer_decision_proof_archive_effective,
  customer_decision_proof_archived: d.customer_decision_proof_archived,
  customer_decision_proof_stored: d.customer_decision_proof_stored,
  customer_decision_proof_indexed: d.customer_decision_proof_indexed,
  customer_decision_proof_preserved: d.customer_decision_proof_preserved,
  archive_created: d.archive_created,
  archive_completed: d.archive_completed,
  archive_effective: d.archive_effective,
  storage_created: d.storage_created,
  storage_completed: d.storage_completed,
  index_created: d.index_created,
  index_completed: d.index_completed,
  custody_transferred: d.custody_transferred,
  evidence_preserved: d.evidence_preserved,
  legal_finality_created: d.legal_finality_created,
  legal_validity_created: d.legal_validity_created,
  legal_certification_created: d.legal_certification_created,
  customer_ready: d.customer_ready,
  production_ready: d.production_ready,
  recommended_next_program: d.recommended_next_program,
  recommended_next_object_id: d.recommended_next_object_id,
  result: ok ? "PASS_ENDPOINT_CUSTOMER_EVIDENCE_DISPUTE_DISPOSAL_CUSTOMER_DECISION_PROOF_ARCHIVE_CONFORMANCE_BINDING_DRAFT" : "FAIL_ENDPOINT_CUSTOMER_EVIDENCE_DISPUTE_DISPOSAL_CUSTOMER_DECISION_PROOF_ARCHIVE_CONFORMANCE_BINDING_DRAFT"
}, null, 2));

if (!ok) {
  process.exitCode = 1;
}
