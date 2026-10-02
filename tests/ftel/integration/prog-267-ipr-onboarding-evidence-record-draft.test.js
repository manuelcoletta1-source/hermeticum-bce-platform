"use strict";

const assert = require("assert/strict");
const fs = require("fs");

const pagePath = "ipr-onboarding-evidence-record-draft.html";
const jsonPath = "evidence/ipr/20261002_HBCE_IPR_ONBOARDING_EVIDENCE_RECORD_DRAFT_v001.json";
const docPath = "docs/evidence/hbce-ipr-onboarding-evidence-record-draft-v001.md";
const schemaDraftPath = "evidence/schema/20261002_HBCE_EVIDENCE_OBJECT_SCHEMA_DRAFT_v001.json";
const schemaDefPath = "schemas/evidence/hbce-evidence-object-record-v001.schema.json";
const bridgePath = "ipr-onboarding-evidence-bridge.html";
const schemaPagePath = "evidence-object-schema-draft.html";
const viewerPath = "evidence-viewer.html";
const buyerPath = "buyer-evidence-one-pager.html";
const executivePath = "executive-evidence-pack.html";
const indexPath = "index.html";
const docsIndexPath = "docs/index.html";

for (const path of [pagePath, jsonPath, docPath, schemaDraftPath, schemaDefPath, bridgePath, schemaPagePath, viewerPath, buyerPath, executivePath, indexPath, docsIndexPath]) {
  assert.equal(fs.existsSync(path), true, path);
}

const page = fs.readFileSync(pagePath, "utf8");
const doc = fs.readFileSync(docPath, "utf8");
const schemaPage = fs.readFileSync(schemaPagePath, "utf8");
const bridgePage = fs.readFileSync(bridgePath, "utf8");
const viewerPage = fs.readFileSync(viewerPath, "utf8");
const buyerPage = fs.readFileSync(buyerPath, "utf8");
const executivePage = fs.readFileSync(executivePath, "utf8");
const index = fs.readFileSync(indexPath, "utf8");
const docsIndex = fs.readFileSync(docsIndexPath, "utf8");
const record = JSON.parse(fs.readFileSync(jsonPath, "utf8"));
const schemaDraft = JSON.parse(fs.readFileSync(schemaDraftPath, "utf8"));
const schemaDef = JSON.parse(fs.readFileSync(schemaDefPath, "utf8"));

assert.equal(record.object_id, "HBCE-IPR-ONBOARDING-EVIDENCE-RECORD-DRAFT-V001");
assert.equal(record.record_id, "HBCE-IPR-ONBOARDING-EVIDENCE-RECORD-DRAFT-V001");
assert.equal(record.artifact_type, "HBCEIPROnboardingEvidenceRecordDraft");
assert.equal(record.version, "v001");
assert.equal(record.status, "ACTIVE_IPR_ONBOARDING_EVIDENCE_RECORD_DRAFT");
assert.equal(record.classification, "R_AND_D_IDENTITY_EVIDENCE_RECORD_DRAFT");
assert.equal(record.basis_marker, "HBCE_EVIDENCE_OBJECT_SCHEMA_DRAFT_FINAL_AUDIT=1");
assert.equal(record.basis_main_commit, "ada427b608f5f13ab3ac150f356a09ad0f92dc52");
assert.equal(record.ipr_status_model.allowed_values.length, 6);
assert.equal(record.ipr_status_model.authorizing_values.length, 0);
assert.equal(record.ipr_status_model.deny_state_values.length, 5);
assert.equal(record.ipr_card_status_model.authorizing_values.length, 0);
assert.equal(record.certificate_status_model.authorizing_values.length, 0);
assert.equal(record.evidence_fields_to_capture_future.length, 18);
assert.equal(record.related_objects.length, 8);
assert.equal(record.recommended_next_steps[0].step, "PROG-268");
assert.equal(record.recommended_next_steps[1].step, "PROG-269");
assert.equal(record.result, "PASS_IPR_ONBOARDING_EVIDENCE_RECORD_DRAFT_CREATED");
assert.equal(schemaDraft.status, "ACTIVE_EVIDENCE_OBJECT_SCHEMA_DRAFT");
assert.equal(schemaDef.required.includes("object_id"), true);
assert.equal(schemaDef.required.includes("explicit_non_claims"), true);
assert.equal(schemaDef.required.includes("no_execution_boundary"), true);

for (const required of schemaDef.required) {
  assert.ok(Object.prototype.hasOwnProperty.call(record, required), `schema required field: ${required}`);
}

for (const expected of [
  "HBCE IPR Onboarding Evidence Record Draft",
  "R&amp;D IDENTITY EVIDENCE RECORD DRAFT",
  "HBCE_EVIDENCE_OBJECT_SCHEMA_DRAFT_FINAL_AUDIT=1",
  "ACTIVE_IPR_ONBOARDING_EVIDENCE_RECORD_DRAFT",
  "Record Is",
  "Record Is Not",
  "IPR Status Model",
  "verified",
  "pending",
  "rejected",
  "revoked",
  "suspended",
  "expired",
  "Authorizing values: none",
  "Deny-state values",
  "IPR Card Status Model",
  "issued",
  "not_issued",
  "Certificate Status Model",
  "active",
  "not_created",
  "Future Evidence Fields To Capture",
  "request_id",
  "subject_ref",
  "tenant_ref",
  "identity_ref",
  "reviewer_authority_ref",
  "policy_ref",
  "decision_ref",
  "Minimum Record Requirements",
  "The record must expose onboarding state without granting access authorization",
  "The record must separate identity verification from dispatch authorization",
  "The record must preserve fail-closed handling",
  "The record must preserve no-dispatch and no-effect boundaries",
  "HBCE Evidence Object Schema Draft v001",
  "HBCE IPR Onboarding Evidence Bridge v001",
  "does not claim onboarding implementation",
  "does not start onboarding",
  "does not create effect evidence",
  "PROG-268",
  "PROG-269"
]) {
  assert.ok(page.includes(expected), expected);
}

for (const key of [
  "does_not_claim_onboarding_implementation",
  "does_not_claim_identity_provider",
  "does_not_claim_access_authorization_service",
  "does_not_claim_certificate_issuance",
  "does_not_claim_legal_certification",
  "does_not_claim_dispatch_authorization",
  "does_not_claim_full_matrix_implementation",
  "does_not_claim_level1_pilot_ready",
  "does_not_claim_commercial_release_authorization",
  "does_not_claim_target_receipt",
  "does_not_claim_execution_trace",
  "does_not_claim_effect_evidence"
]) {
  assert.equal(record.explicit_non_claims[key], true, key);
}

for (const key of [
  "onboarding_started",
  "onboarding_reviewed",
  "identity_verified",
  "ipr_card_issued",
  "certificate_issued",
  "certificate_activated",
  "access_authorization_granted",
  "ipr_state_mutated",
  "dispatch_execution_authorized",
  "dispatch_command_emitted",
  "dispatch_performed",
  "external_connector_called",
  "target_system_contacted",
  "target_receipt_created",
  "execution_trace_bound",
  "effect_evidence_created",
  "customer_external_execution_allowed"
]) {
  assert.equal(record.no_execution_boundary[key], false, key);
}

for (const key of [
  "state_mutation_performed",
  "state_mutation_authorized",
  "review_decision_recorded",
  "identity_verified",
  "card_issued",
  "certificate_activated",
  "access_authorized",
  "dispatch_authorized"
]) {
  assert.equal(record.state_transition_boundary[key], false, key);
}

assert.ok(doc.includes("HBCE IPR Onboarding Evidence Record Draft v001"));
assert.ok(doc.includes("HBCE_EVIDENCE_OBJECT_SCHEMA_DRAFT_FINAL_AUDIT=1"));
assert.ok(doc.includes("IPR Status Model"));
assert.ok(doc.includes("Authorizing values"));
assert.ok(doc.includes("The record must expose onboarding state without granting access authorization"));
assert.ok(doc.includes("PROG-268 Evidence Schema Conformance Harness"));
assert.ok(doc.includes("PROG-269 IPR Onboarding Deny-State Harness"));

assert.ok(index.includes("ipr-onboarding-evidence-record-draft.html"));
assert.ok(index.includes("HBCE IPR Onboarding Evidence Record Draft"));
assert.ok(docsIndex.includes("ipr-onboarding-evidence-record-draft.html"));
assert.ok(docsIndex.includes("HBCE IPR Onboarding Evidence Record Draft"));
assert.ok(schemaPage.includes("ipr-onboarding-evidence-record-draft.html"));
assert.ok(bridgePage.includes("ipr-onboarding-evidence-record-draft.html"));
assert.ok(viewerPage.includes("ipr-onboarding-evidence-record-draft.html"));
assert.ok(buyerPage.includes("ipr-onboarding-evidence-record-draft.html"));
assert.ok(executivePage.includes("ipr-onboarding-evidence-record-draft.html"));

console.log("PROG_267_IPR_ONBOARDING_EVIDENCE_RECORD_DRAFT_TEST=PASS");
