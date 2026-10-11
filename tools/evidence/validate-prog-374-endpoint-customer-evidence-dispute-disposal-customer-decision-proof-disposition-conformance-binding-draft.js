#!/usr/bin/env node
"use strict";

const fs = require("fs");
const assert = require("assert");

const manifestPath = "evidence/authorization/20261011_HBCE_ENDPOINT_CUSTOMER_EVIDENCE_DISPUTE_DISPOSAL_CUSTOMER_DECISION_PROOF_DISPOSITION_CONFORMANCE_BINDING_DRAFT_v001.json";

const stem = "ENDPOINT_CUSTOMER_EVIDENCE_DISPUTE_DISPOSAL_CUSTOMER_DECISION_PROOF_DISPOSITION_CONFORMANCE_BINDING_DRAFT";
const objectId = "HBCE-ENDPOINT-CUSTOMER-EVIDENCE-DISPUTE-DISPOSAL-CUSTOMER-DECISION-PROOF-DISPOSITION-CONFORMANCE-BINDING-DRAFT-V001";
const activeStatus = "ACTIVE_ENDPOINT_CUSTOMER_EVIDENCE_DISPUTE_DISPOSAL_CUSTOMER_DECISION_PROOF_DISPOSITION_CONFORMANCE_BINDING_DRAFT";
const passResult = "PASS_ENDPOINT_CUSTOMER_EVIDENCE_DISPUTE_DISPOSAL_CUSTOMER_DECISION_PROOF_DISPOSITION_CONFORMANCE_BINDING_DRAFT";
const finalAuditMarker = "HBCE_ENDPOINT_CUSTOMER_EVIDENCE_DISPUTE_DISPOSAL_CUSTOMER_DECISION_PROOF_DISPOSITION_CONFORMANCE_BINDING_DRAFT_FINAL_AUDIT=1";

function main() {
  const d = JSON.parse(fs.readFileSync(manifestPath, "utf8"));

  assert.strictEqual(d.schema, "HBCE_AUTHORIZATION_EVIDENCE_MANIFEST_V1");
  assert.strictEqual(d.program, "PROG-374");
  assert.strictEqual(d.object_id, objectId);
  assert.strictEqual(d.conformance_scope, "ENDPOINT_CUSTOMER_EVIDENCE_DISPUTE_DISPOSAL_CUSTOMER_DECISION_PROOF_DISPOSITION_CONFORMANCE_BINDING_DRAFT");
  assert.strictEqual(d.conformance_level, "CUSTOMER_DECISION_PROOF_DISPOSITION_CONFORMANCE_DRAFT");
  assert.strictEqual(d.draft_type, "BINDING_DRAFT");
  assert.strictEqual(d.source_boundary, "PRESERVATION_CONFORMANCE_TO_DISPOSITION_CONFORMANCE");

  assert.strictEqual(d.parent_program, "PROG-373");
  assert.strictEqual(d.parent_object_id, "HBCE-ENDPOINT-CUSTOMER-EVIDENCE-DISPUTE-DISPOSAL-CUSTOMER-DECISION-PROOF-PRESERVATION-CONFORMANCE-BINDING-DRAFT-V001");
  assert.strictEqual(d.parent_commit, "771c0fce0c2e0636df20b260c8ac34d7951015ff");
  assert.strictEqual(d.basis_main_commit, "771c0fce0c2e0636df20b260c8ac34d7951015ff");
  assert.strictEqual(d.parent_manifest_sha256, "4c90ea715011a7a686ef7277b7c4f6bed2914d39b3ce18db36cc148bfe9dbf9e");
  assert.strictEqual(d.parent_validator_sha256, "17d86d7d3a0da12f03ee6c1c81917c385666447aa9eaa7a150ce06ebfa90075b");
  assert.strictEqual(d.parent_final_audit_marker, "HBCE_ENDPOINT_CUSTOMER_EVIDENCE_DISPUTE_DISPOSAL_CUSTOMER_DECISION_PROOF_PRESERVATION_CONFORMANCE_BINDING_DRAFT_FINAL_AUDIT=1");

  if (d.status === "DRAFT_PENDING_VALIDATION") {
    assert.strictEqual(d.marker, `${stem}=PENDING_VALIDATION`);
    assert.strictEqual(d.result, "PENDING_VALIDATION");
    assert.strictEqual(Object.prototype.hasOwnProperty.call(d, "final_audit_marker"), false);
  } else {
    assert.strictEqual(d.status, activeStatus);
    assert.strictEqual(d.marker, `${stem}=PASS`);
    assert.strictEqual(d.result, passResult);
    assert.strictEqual(d.final_audit_marker, finalAuditMarker);
  }

  assert.strictEqual(d.parent_source_chain_entry_count, 91);
  assert.strictEqual(d.source_chain_entry_count, 92);
  assert.strictEqual(d.source_chain_model, "COUNT_ONLY_PARENT_CHAIN_REFERENCE_PLUS_PROG_374_DISPOSITION_ENTRY");
  assert.strictEqual(d.source_chain_storage, "COUNT_ONLY_NO_EMBEDDED_PARENT_SOURCE_CHAIN_ARRAY");
  assert.strictEqual(Array.isArray(d.source_chain), false);

  assert.strictEqual(d.required_endpoint_customer_evidence_dispute_disposal_customer_decision_proof_disposition_conformance_field_count, 152);
  assert.strictEqual(d.binding_rule_count, 152);
  assert.strictEqual(d.future_resolution_requirement_count, 601);
  assert.strictEqual(d.future_customer_decision_proof_disposition_false_key_count, 380);
  assert.strictEqual(d.all_customer_decision_proof_disposition_false_key_count, 380);
  assert.strictEqual(d.required_non_claim_count, 15314);
  assert.strictEqual(d.required_no_execution_boundary_count, 15314);
  assert.strictEqual(d.false_claim_property_count, 9003);

  assert.strictEqual(Array.isArray(d.required_disposition_fields), true);
  assert.strictEqual(Array.isArray(d.required_non_claim_properties), true);
  assert.strictEqual(Array.isArray(d.required_no_execution_boundary_properties), true);
  assert.strictEqual(Array.isArray(d.false_claim_properties), true);
  assert.strictEqual(Array.isArray(d.future_resolution_requirements), true);
  assert.strictEqual(Array.isArray(d.future_customer_decision_proof_disposition_false_keys), true);

  assert.strictEqual(d.required_disposition_fields.length, 22);
  assert.strictEqual(d.required_non_claim_properties.length, 15314);
  assert.strictEqual(d.required_no_execution_boundary_properties.length, 15314);
  assert.strictEqual(d.false_claim_properties.length, 9003);
  assert.strictEqual(d.future_resolution_requirements.length, 601);

  assert.strictEqual(d.archive_ready, false);
  assert.strictEqual(d.customer_archive_ready, false);
  assert.strictEqual(d.preservation_ready, false);
  assert.strictEqual(d.customer_preservation_ready, false);
  assert.strictEqual(d.disposition_ready, false);
  assert.strictEqual(d.customer_disposition_ready, false);
  assert.strictEqual(d.destruction_ready, false);
  assert.strictEqual(d.customer_destruction_ready, false);
  assert.strictEqual(d.customer_ready, false);
  assert.strictEqual(d.production_ready, false);
  assert.strictEqual(d.external_archive_storage_created, false);
  assert.strictEqual(d.external_preservation_storage_created, false);
  assert.strictEqual(d.external_disposition_storage_created, false);
  assert.strictEqual(d.external_disposition_register_created, false);
  assert.strictEqual(d.legal_finality_ready, false);
  assert.strictEqual(d.legal_validity_ready, false);
  assert.strictEqual(d.legal_certification_ready, false);
  assert.strictEqual(d.deployment_preservation, false);
  assert.strictEqual(d.deployment_disposition, false);
  assert.strictEqual(d.deployment_destruction, false);
  assert.strictEqual(d.runtime_disposition_executed, false);
  assert.strictEqual(d.runtime_deletion_executed, false);
  assert.strictEqual(d.data_destruction_executed, false);
  assert.strictEqual(d.opc_allow, false);

  for (const key of d.future_customer_decision_proof_disposition_false_keys) {
    assert.strictEqual(d[key], false, `FALSE_KEY_NOT_FALSE: ${key}`);
  }

  const requiredFields = [
    "endpoint_customer_evidence_dispute_disposal_customer_decision_proof_disposition_conformance_scope_ref",
    "endpoint_customer_evidence_dispute_disposal_customer_decision_proof_disposition_conformance_policy_ref",
    "endpoint_customer_evidence_dispute_disposal_customer_decision_proof_disposition_conformance_criteria_ref",
    "endpoint_customer_evidence_dispute_disposal_customer_decision_proof_disposition_conformance_authority_ref",
    "endpoint_customer_evidence_dispute_disposal_customer_decision_proof_disposition_conformance_material_ref",
    "endpoint_customer_evidence_dispute_disposal_customer_decision_proof_disposition_conformance_binding_ref",
    "endpoint_customer_evidence_dispute_disposal_customer_decision_proof_disposition_conformance_audit_ref",
    "endpoint_customer_evidence_dispute_disposal_customer_decision_proof_disposition_conformance_risk_ref",
    "endpoint_customer_evidence_dispute_disposal_customer_decision_proof_disposition_conformance_rollback_ref",
    "endpoint_customer_evidence_dispute_disposal_customer_decision_proof_disposition_conformance_delta_ref",
    "endpoint_customer_evidence_dispute_disposal_customer_decision_proof_disposition_conformance_plan_ref",
    "endpoint_customer_evidence_dispute_disposal_customer_decision_proof_disposition_conformance_register_ref",
    "endpoint_customer_evidence_dispute_disposal_customer_decision_proof_disposition_conformance_human_state",
    "endpoint_customer_evidence_dispute_disposal_customer_decision_proof_disposition_conformance_lifecycle_state"
  ];

  for (const field of requiredFields) {
    assert(d.required_disposition_fields.includes(field), `REQUIRED_DISPOSITION_FIELD_MISSING: ${field}`);
  }

  const boundary = [
    d.source_document_boundary_statement,
    d.endpoint_customer_evidence_dispute_disposal_customer_decision_proof_disposition_boundary_statement,
    d.non_inference_rule,
    d.unknown_precedence_rule
  ].filter(Boolean).join("\n");

  for (const fragment of [
    "Preservation Conformance draft does not imply Disposition Conformance",
    "Preservation does not imply disposition",
    "Disposition Conformance draft does not imply actual disposition",
    "Disposition Conformance draft does not create disposition",
    "Disposition Conformance draft does not create destruction",
    "Disposition Conformance draft does not create runtime deletion",
    "Disposition Conformance draft does not create data destruction",
    "Disposition Conformance draft does not create deployment disposition",
    "Disposition Conformance draft does not create legal finality",
    "Disposition Conformance draft does not create legal validity",
    "Disposition Conformance draft does not create legal certification",
    "Disposition Conformance draft != disposed",
    "Disposition does not imply destruction",
    "Disposition does not imply verification",
    "Disposition does not imply deployment disposition",
    "DISPATCHED != EXECUTED",
    "EXECUTED != CONSEQUENCE",
    "Receipt does not imply verification",
    "Custody does not imply verification",
    "Missing evidence remains UNKNOWN or INSUFFICIENT_EVIDENCE",
    "UNKNOWN prevails over disposition claims",
    "UNKNOWN_OR_INSUFFICIENT_EVIDENCE_PRECEDES_DISPOSITION_CLAIMS"
  ]) {
    assert(boundary.includes(fragment), `BOUNDARY_FRAGMENT_MISSING: ${fragment}`);
  }

  console.log(JSON.stringify({
    object_id: d.object_id,
    program: d.program,
    status: d.status,
    marker: d.marker,
    result: d.result,
    final_audit_marker: d.final_audit_marker || null,
    parent_source_chain_entry_count: d.parent_source_chain_entry_count,
    source_chain_entry_count: d.source_chain_entry_count,
    field_count: d.required_endpoint_customer_evidence_dispute_disposal_customer_decision_proof_disposition_conformance_field_count,
    binding_rule_count: d.binding_rule_count,
    future_resolution_requirement_count: d.future_resolution_requirement_count,
    required_non_claim_count: d.required_non_claim_count,
    required_no_execution_boundary_count: d.required_no_execution_boundary_count,
    false_claim_property_count: d.false_claim_property_count,
    disposition_false_key_count: d.future_customer_decision_proof_disposition_false_key_count,
    archive_ready: d.archive_ready,
    preservation_ready: d.preservation_ready,
    disposition_ready: d.disposition_ready,
    customer_disposition_ready: d.customer_disposition_ready,
    destruction_ready: d.destruction_ready,
    customer_ready: d.customer_ready,
    production_ready: d.production_ready,
    external_preservation_storage_created: d.external_preservation_storage_created,
    external_disposition_storage_created: d.external_disposition_storage_created,
    deployment_disposition: d.deployment_disposition,
    runtime_deletion_executed: d.runtime_deletion_executed,
    data_destruction_executed: d.data_destruction_executed
  }, null, 2));

  if (d.status === "DRAFT_PENDING_VALIDATION") {
    console.log("PROG_374_ENDPOINT_CUSTOMER_EVIDENCE_DISPUTE_DISPOSAL_CUSTOMER_DECISION_PROOF_DISPOSITION_CONFORMANCE_BINDING_DRAFT_PENDING_VALIDATION=PASS");
  } else {
    console.log(finalAuditMarker);
  }
}

main();
