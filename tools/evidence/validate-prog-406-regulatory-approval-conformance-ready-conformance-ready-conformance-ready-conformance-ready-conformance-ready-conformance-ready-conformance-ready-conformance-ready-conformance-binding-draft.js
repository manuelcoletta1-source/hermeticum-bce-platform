#!/usr/bin/env node
const fs = require("fs");
const crypto = require("crypto");

const manifestPath = process.argv[2];

if (!manifestPath) {
  console.error("Usage: validate-prog-406-...js <manifest.json>");
  process.exit(2);
}

const ready = Array(8).fill("CONFORMANCE_READY");
const axis = ["REGULATORY_APPROVAL", ...ready].join("_");
const axisLower = axis.toLowerCase();
const statusCore = [
  "ENDPOINT_CUSTOMER_EVIDENCE_DISPUTE_DISPOSAL_CUSTOMER_DECISION_PROOF_DEPLOYMENT_INDEPENDENT_ATTESTATION_VERIFIED_REALIZED_BENEFIT_CUSTOMER_ACCEPTANCE_REGULATORY_ACCEPTANCE",
  axis,
  "CONFORMANCE_BINDING_DRAFT",
].join("_");
const sourcePrefix = "deployment_independent_attestation_verified_realized_benefit_customer_acceptance_regulatory_acceptance";
const sourceKey = `${sourcePrefix}_${axisLower}`;
const sourceKeyCreated = `${sourceKey}_created`;
const objectPrefix = "HBCE-ENDPOINT-CUSTOMER-EVIDENCE-DISPUTE-DISPOSAL-CUSTOMER-DECISION-PROOF-DEPLOYMENT-INDEPENDENT-ATTESTATION-VERIFIED-REALIZED-BENEFIT-CUSTOMER-ACCEPTANCE-REGULATORY-ACCEPTANCE";
const objectId = `${objectPrefix}-${axis.replace(/_/g, "-")}-CONFORMANCE-BINDING-DRAFT-V001`;

const expected = {
  schema_version: "HBCE_PROG_EVIDENCE_MANIFEST_V1",
  object_id: objectId,
  program: "PROG-406",
  status: `ACTIVE_${statusCore}`,
  marker: `${statusCore}=PASS`,
  result: `PASS_${statusCore}`,
  result_assertion: "PASS_PROG_406_VALIDATOR_ACTIVE_MANIFEST",
  parent_program: "PROG-405",
  parent_commit: "09da2d46f3a7418ab0d374fb1d7c98a35ebc8ad5",
  selected_axis: axis,
  selected_source_false_key: sourceKey,
  selected_source_false_key_created: sourceKeyCreated,
  selected_source_false_key_role: "NEW_FALSE_KEY_REQUIRED_IN_PROG406",
  selected_boundary: `${axis}_CONFORMANCE_DRAFT != ${axis}.`,
  source_chain_entry_count: 124,
  field_count: 152,
  binding_rule_count: 152,
  boundary_rule_count: 287,
  future_resolution_requirement_count: 1819,
  required_non_claim_count: 37145,
  required_no_execution_boundary_count: 25985,
  false_claim_property_count: 14679,
  false_key_count: 705,
  new_false_key_count: 18,
  [`required_${axisLower}_field_count`]: 24,
  [axisLower]: false,
  [sourceKey]: false,
  [sourceKeyCreated]: false,
  regulatory_approval_created: false,
  regulatory_clearance_created: false,
  customer_acceptance_created: false,
  customer_approval_created: false,
  opc_allow: false,
  matrix_effective_state_updated: false,
  runtime_deletion_executed: false,
  data_erasure_executed: false,
  runtime_legal_claim: "NONE_BEYOND_VALIDATOR_SCOPED_EVIDENCE",
};

const raw = fs.readFileSync(manifestPath);
const manifest = JSON.parse(raw.toString("utf8"));

function fail(code, detail) {
  console.error(`${code}: ${detail}`);
  process.exit(1);
}

for (const [key, value] of Object.entries(expected)) {
  if (!(key in manifest)) {
    fail("PROG_406_FIELD_MISSING", key);
  }
  if (manifest[key] !== value) {
    fail("PROG_406_FIELD_INVALID", `${key}: expected ${JSON.stringify(value)} got ${JSON.stringify(manifest[key])}`);
  }
}

for (const key of Object.keys(manifest)) {
  if (!(key in expected)) {
    fail("PROG_406_ADDITIONAL_PROPERTY", key);
  }
}

const sha256 = crypto.createHash("sha256").update(raw).digest("hex");

const report = {
  object_id: manifest.object_id,
  program: manifest.program,
  status: manifest.status,
  marker: manifest.marker,
  result: manifest.result,
  parent_program: manifest.parent_program,
  parent_commit: manifest.parent_commit,
  selected_axis: manifest.selected_axis,
  selected_source_false_key: manifest.selected_source_false_key,
  selected_source_false_key_role: manifest.selected_source_false_key_role,
  selected_boundary: manifest.selected_boundary,
  source_chain_entry_count: manifest.source_chain_entry_count,
  field_count: manifest.field_count,
  binding_rule_count: manifest.binding_rule_count,
  boundary_rule_count: manifest.boundary_rule_count,
  future_resolution_requirement_count: manifest.future_resolution_requirement_count,
  required_non_claim_count: manifest.required_non_claim_count,
  required_no_execution_boundary_count: manifest.required_no_execution_boundary_count,
  false_claim_property_count: manifest.false_claim_property_count,
  false_key_count: manifest.false_key_count,
  new_false_key_count: manifest.new_false_key_count,
  [`required_${axisLower}_field_count`]: manifest[`required_${axisLower}_field_count`],
  [axisLower]: manifest[axisLower],
  [sourceKey]: manifest[sourceKey],
  [sourceKeyCreated]: manifest[sourceKeyCreated],
  regulatory_approval_created: manifest.regulatory_approval_created,
  regulatory_clearance_created: manifest.regulatory_clearance_created,
  customer_acceptance_created: manifest.customer_acceptance_created,
  customer_approval_created: manifest.customer_approval_created,
  opc_allow: manifest.opc_allow,
  matrix_effective_state_updated: manifest.matrix_effective_state_updated,
  runtime_deletion_executed: manifest.runtime_deletion_executed,
  data_erasure_executed: manifest.data_erasure_executed,
  manifest_sha256: sha256,
  result_assertion: manifest.result_assertion,
};

console.log(JSON.stringify(report, null, 2));
console.log(`PROG_406_${axis}_CONFORMANCE_BINDING_DRAFT_VALIDATOR=PASS`);
