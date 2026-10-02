"use strict";

const assert = require("assert/strict");
const fs = require("fs");

const pagePath = "evidence-object-schema-draft.html";
const jsonPath = "evidence/schema/20261002_HBCE_EVIDENCE_OBJECT_SCHEMA_DRAFT_v001.json";
const schemaPath = "schemas/evidence/hbce-evidence-object-record-v001.schema.json";
const docPath = "docs/evidence/hbce-evidence-object-schema-draft-v001.md";
const bridgePath = "ipr-onboarding-evidence-bridge.html";
const viewerPath = "evidence-viewer.html";
const designPath = "evidence-viewer-design.html";
const buyerPath = "buyer-evidence-one-pager.html";
const executivePath = "executive-evidence-pack.html";
const indexPath = "index.html";
const docsIndexPath = "docs/index.html";
const bridgeJsonPath = "evidence/ipr/20261002_HBCE_IPR_ONBOARDING_EVIDENCE_BRIDGE_v001.json";

for (const path of [pagePath, jsonPath, schemaPath, docPath, bridgePath, viewerPath, designPath, buyerPath, executivePath, indexPath, docsIndexPath, bridgeJsonPath]) {
  assert.equal(fs.existsSync(path), true, path);
}

const page = fs.readFileSync(pagePath, "utf8");
const doc = fs.readFileSync(docPath, "utf8");
const bridgePage = fs.readFileSync(bridgePath, "utf8");
const viewerPage = fs.readFileSync(viewerPath, "utf8");
const designPage = fs.readFileSync(designPath, "utf8");
const buyerPage = fs.readFileSync(buyerPath, "utf8");
const executivePage = fs.readFileSync(executivePath, "utf8");
const index = fs.readFileSync(indexPath, "utf8");
const docsIndex = fs.readFileSync(docsIndexPath, "utf8");
const schemaDraft = JSON.parse(fs.readFileSync(jsonPath, "utf8"));
const schemaDef = JSON.parse(fs.readFileSync(schemaPath, "utf8"));
const bridge = JSON.parse(fs.readFileSync(bridgeJsonPath, "utf8"));

assert.equal(schemaDraft.schema_draft_id, "HBCE-EVIDENCE-OBJECT-SCHEMA-DRAFT-V001");
assert.equal(schemaDraft.artifact_type, "HBCEEvidenceObjectSchemaDraft");
assert.equal(schemaDraft.status, "ACTIVE_EVIDENCE_OBJECT_SCHEMA_DRAFT");
assert.equal(schemaDraft.classification, "R_AND_D_SCHEMA_DRAFT_BASELINE");
assert.equal(schemaDraft.basis_marker, "HBCE_IPR_ONBOARDING_EVIDENCE_BRIDGE_FINAL_AUDIT=1");
assert.equal(schemaDraft.basis_main_commit, "e0de5e4b9d966d74841fcf52ce4511f56c1179d8");
assert.equal(schemaDraft.required_evidence_object_fields.length, 14);
assert.equal(schemaDraft.status_taxonomy.length, 9);
assert.equal(schemaDraft.reused_public_evidence_objects.length, 8);
assert.equal(schemaDraft.recommended_next_steps[0].step, "PROG-267");
assert.equal(schemaDraft.recommended_next_steps[1].step, "PROG-268");
assert.equal(schemaDraft.result, "PASS_EVIDENCE_OBJECT_SCHEMA_DRAFT_CREATED");
assert.equal(bridge.status, "ACTIVE_IPR_ONBOARDING_EVIDENCE_BRIDGE_BASELINE");

assert.equal(schemaDef.$schema, "https://json-schema.org/draft/2020-12/schema");
assert.equal(schemaDef.title, "HBCE Evidence Object Record v001");
assert.equal(schemaDef.required.includes("object_id"), true);
assert.equal(schemaDef.required.includes("explicit_non_claims"), true);
assert.equal(schemaDef.required.includes("no_execution_boundary"), true);

for (const expected of [
  "HBCE Evidence Object Schema Draft",
  "R&amp;D SCHEMA DRAFT BASELINE",
  "HBCE_IPR_ONBOARDING_EVIDENCE_BRIDGE_FINAL_AUDIT=1",
  "Required Evidence Object Fields",
  "object_id",
  "artifact_type",
  "basis_marker",
  "basis_main_commit",
  "public_surfaces",
  "release_anchor",
  "explicit_non_claims",
  "no_execution_boundary",
  "Status Taxonomy",
  "ACTIVE_EVIDENCE_OBJECT_SCHEMA_DRAFT",
  "Public Surface Model",
  "Anchor Model",
  "Boundary Model",
  "Reused Public Evidence Objects",
  "HBCE IPR Onboarding Evidence Bridge v001",
  "Minimum Schema Requirements",
  "Every evidence object must declare what it is",
  "Every evidence object must declare what it is not",
  "Every released baseline must expose tag and release anchors",
  "Every access-related record must separate evidence visibility from access authorization",
  "Every dispatch-related record must preserve no-dispatch and no-effect boundaries",
  "does not claim production schema registry",
  "does not enforce a schema registry",
  "does not create effect evidence",
  "PROG-267",
  "PROG-268"
]) {
  assert.ok(page.includes(expected), expected);
}

for (const key of [
  "does_not_claim_production_schema_registry",
  "does_not_claim_schema_certification",
  "does_not_claim_legal_evidence_standard",
  "does_not_claim_dynamic_verifier",
  "does_not_claim_access_authorization_service",
  "does_not_claim_onboarding_implementation",
  "does_not_claim_certificate_issuance",
  "does_not_claim_legal_certification",
  "does_not_claim_full_matrix_implementation",
  "does_not_claim_level1_pilot_ready",
  "does_not_claim_commercial_release_authorization",
  "does_not_claim_dispatch_execution",
  "does_not_claim_target_receipt",
  "does_not_claim_execution_trace",
  "does_not_claim_effect_evidence"
]) {
  assert.equal(schemaDraft.explicit_non_claims[key], true, key);
}

for (const key of [
  "schema_registry_enforced",
  "production_validation_performed",
  "access_authorization_granted",
  "certificate_issued",
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
  assert.equal(schemaDraft.no_execution_boundary[key], false, key);
}

assert.ok(doc.includes("HBCE Evidence Object Schema Draft v001"));
assert.ok(doc.includes("HBCE_IPR_ONBOARDING_EVIDENCE_BRIDGE_FINAL_AUDIT=1"));
assert.ok(doc.includes("Required Evidence Object Fields"));
assert.ok(doc.includes("Anchor Model"));
assert.ok(doc.includes("Boundary Model"));
assert.ok(doc.includes("PROG-267 IPR Onboarding Evidence Record Draft"));
assert.ok(doc.includes("PROG-268 Evidence Schema Conformance Harness"));

assert.ok(index.includes("evidence-object-schema-draft.html"));
assert.ok(index.includes("HBCE Evidence Object Schema Draft"));
assert.ok(docsIndex.includes("evidence-object-schema-draft.html"));
assert.ok(docsIndex.includes("HBCE Evidence Object Schema Draft"));
assert.ok(bridgePage.includes("evidence-object-schema-draft.html"));
assert.ok(viewerPage.includes("evidence-object-schema-draft.html"));
assert.ok(designPage.includes("evidence-object-schema-draft.html"));
assert.ok(buyerPage.includes("evidence-object-schema-draft.html"));
assert.ok(executivePage.includes("evidence-object-schema-draft.html"));

console.log("PROG_266_EVIDENCE_OBJECT_SCHEMA_DRAFT_TEST=PASS");
