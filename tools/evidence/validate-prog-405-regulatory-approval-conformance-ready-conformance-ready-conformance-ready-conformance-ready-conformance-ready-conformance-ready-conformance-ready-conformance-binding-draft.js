#!/usr/bin/env node
const fs = require("fs");
const crypto = require("crypto");

const manifestPath = process.argv[2];

const EXPECTED = {
  object_id: "HBCE-ENDPOINT-CUSTOMER-EVIDENCE-DISPUTE-DISPOSAL-CUSTOMER-DECISION-PROOF-DEPLOYMENT-INDEPENDENT-ATTESTATION-VERIFIED-REALIZED-BENEFIT-CUSTOMER-ACCEPTANCE-REGULATORY-ACCEPTANCE-REGULATORY-APPROVAL-CONFORMANCE-READY-CONFORMANCE-READY-CONFORMANCE-READY-CONFORMANCE-READY-CONFORMANCE-READY-CONFORMANCE-READY-CONFORMANCE-READY-CONFORMANCE-BINDING-DRAFT-V001",
  program: "PROG-405",
  status: "ACTIVE_ENDPOINT_CUSTOMER_EVIDENCE_DISPUTE_DISPOSAL_CUSTOMER_DECISION_PROOF_DEPLOYMENT_INDEPENDENT_ATTESTATION_VERIFIED_REALIZED_BENEFIT_CUSTOMER_ACCEPTANCE_REGULATORY_ACCEPTANCE_REGULATORY_APPROVAL_CONFORMANCE_READY_CONFORMANCE_READY_CONFORMANCE_READY_CONFORMANCE_READY_CONFORMANCE_READY_CONFORMANCE_READY_CONFORMANCE_READY_CONFORMANCE_BINDING_DRAFT",
  marker: "ENDPOINT_CUSTOMER_EVIDENCE_DISPUTE_DISPOSAL_CUSTOMER_DECISION_PROOF_DEPLOYMENT_INDEPENDENT_ATTESTATION_VERIFIED_REALIZED_BENEFIT_CUSTOMER_ACCEPTANCE_REGULATORY_ACCEPTANCE_REGULATORY_APPROVAL_CONFORMANCE_READY_CONFORMANCE_READY_CONFORMANCE_READY_CONFORMANCE_READY_CONFORMANCE_READY_CONFORMANCE_READY_CONFORMANCE_READY_CONFORMANCE_BINDING_DRAFT=PASS",
  result: "PASS_ENDPOINT_CUSTOMER_EVIDENCE_DISPUTE_DISPOSAL_CUSTOMER_DECISION_PROOF_DEPLOYMENT_INDEPENDENT_ATTESTATION_VERIFIED_REALIZED_BENEFIT_CUSTOMER_ACCEPTANCE_REGULATORY_ACCEPTANCE_REGULATORY_APPROVAL_CONFORMANCE_READY_CONFORMANCE_READY_CONFORMANCE_READY_CONFORMANCE_READY_CONFORMANCE_READY_CONFORMANCE_READY_CONFORMANCE_READY_CONFORMANCE_BINDING_DRAFT",
  parent_program: "PROG-404",
  parent_commit: "bd1fc2beaec6065d80c07a3ac9046f6f9673abe4",
  selected_axis: "REGULATORY_APPROVAL_CONFORMANCE_READY_CONFORMANCE_READY_CONFORMANCE_READY_CONFORMANCE_READY_CONFORMANCE_READY_CONFORMANCE_READY_CONFORMANCE_READY",
  selected_source_false_key: "deployment_independent_attestation_verified_realized_benefit_customer_acceptance_regulatory_acceptance_regulatory_approval_conformance_ready_conformance_ready_conformance_ready_conformance_ready_conformance_ready_conformance_ready_conformance_ready",
  selected_source_false_key_role: "NEW_FALSE_KEY_REQUIRED_IN_PROG405",
  selected_boundary: "REGULATORY_APPROVAL_CONFORMANCE_READY_CONFORMANCE_READY_CONFORMANCE_READY_CONFORMANCE_READY_CONFORMANCE_READY_CONFORMANCE_READY_CONFORMANCE_READY_CONFORMANCE_DRAFT != REGULATORY_APPROVAL_CONFORMANCE_READY_CONFORMANCE_READY_CONFORMANCE_READY_CONFORMANCE_READY_CONFORMANCE_READY_CONFORMANCE_READY_CONFORMANCE_READY.",
  source_chain_entry_count: 123,
  field_count: 152,
  binding_rule_count: 152,
  boundary_rule_count: 264,
  future_resolution_requirement_count: 1777,
  required_non_claim_count: 37081,
  required_no_execution_boundary_count: 25972,
  false_claim_property_count: 14615,
  false_key_count: 687,
  new_false_key_count: 18,
  required_regulatory_approval_conformance_ready_conformance_ready_conformance_ready_conformance_ready_conformance_ready_conformance_ready_conformance_ready_field_count: 24,
  regulatory_approval_conformance_ready_conformance_ready_conformance_ready_conformance_ready_conformance_ready_conformance_ready_conformance_ready: false,
  deployment_independent_attestation_verified_realized_benefit_customer_acceptance_regulatory_acceptance_regulatory_approval_conformance_ready_conformance_ready_conformance_ready_conformance_ready_conformance_ready_conformance_ready_conformance_ready: false,
  deployment_independent_attestation_verified_realized_benefit_customer_acceptance_regulatory_acceptance_regulatory_approval_conformance_ready_conformance_ready_conformance_ready_conformance_ready_conformance_ready_conformance_ready_conformance_ready_created: false,
  regulatory_approval_created: false,
  regulatory_clearance_created: false,
  customer_acceptance_created: false,
  customer_approval_created: false,
  opc_allow: false,
  matrix_effective_state_updated: false,
  runtime_deletion_executed: false,
  data_erasure_executed: false
};

function fail(message) {
  console.error(message);
  process.exitCode = 1;
}

if (!manifestPath) {
  fail("PROG_405_VALIDATOR_ERROR=MANIFEST_PATH_REQUIRED");
} else {
  let raw;
  let data;
  try {
    raw = fs.readFileSync(manifestPath, "utf8");
    data = JSON.parse(raw);
  } catch (error) {
    fail(`PROG_405_VALIDATOR_ERROR=${error.message}`);
  }

  if (data) {
    const failures = [];
    for (const [key, expectedValue] of Object.entries(EXPECTED)) {
      if (data[key] !== expectedValue) {
        failures.push(`${key}: expected ${JSON.stringify(expectedValue)} got ${JSON.stringify(data[key])}`);
      }
    }

    if (failures.length > 0) {
      console.error("PROG_405_VALIDATOR_FAILURES_BEGIN");
      for (const failure of failures) console.error(failure);
      console.error("PROG_405_VALIDATOR_FAILURES_END");
      process.exitCode = 1;
    } else {
      const manifestSha256 = crypto.createHash("sha256").update(raw).digest("hex");
      const out = {
        object_id: data.object_id,
        program: data.program,
        status: data.status,
        marker: data.marker,
        result: data.result,
        parent_program: data.parent_program,
        parent_commit: data.parent_commit,
        selected_axis: data.selected_axis,
        selected_source_false_key: data.selected_source_false_key,
        selected_source_false_key_role: data.selected_source_false_key_role,
        selected_boundary: data.selected_boundary,
        source_chain_entry_count: data.source_chain_entry_count,
        field_count: data.field_count,
        binding_rule_count: data.binding_rule_count,
        boundary_rule_count: data.boundary_rule_count,
        future_resolution_requirement_count: data.future_resolution_requirement_count,
        required_non_claim_count: data.required_non_claim_count,
        required_no_execution_boundary_count: data.required_no_execution_boundary_count,
        false_claim_property_count: data.false_claim_property_count,
        false_key_count: data.false_key_count,
        new_false_key_count: data.new_false_key_count,
        required_regulatory_approval_conformance_ready_conformance_ready_conformance_ready_conformance_ready_conformance_ready_conformance_ready_conformance_ready_field_count: data.required_regulatory_approval_conformance_ready_conformance_ready_conformance_ready_conformance_ready_conformance_ready_conformance_ready_conformance_ready_field_count,
        regulatory_approval_conformance_ready_conformance_ready_conformance_ready_conformance_ready_conformance_ready_conformance_ready_conformance_ready: data.regulatory_approval_conformance_ready_conformance_ready_conformance_ready_conformance_ready_conformance_ready_conformance_ready_conformance_ready,
        deployment_independent_attestation_verified_realized_benefit_customer_acceptance_regulatory_acceptance_regulatory_approval_conformance_ready_conformance_ready_conformance_ready_conformance_ready_conformance_ready_conformance_ready_conformance_ready: data.deployment_independent_attestation_verified_realized_benefit_customer_acceptance_regulatory_acceptance_regulatory_approval_conformance_ready_conformance_ready_conformance_ready_conformance_ready_conformance_ready_conformance_ready_conformance_ready,
        deployment_independent_attestation_verified_realized_benefit_customer_acceptance_regulatory_acceptance_regulatory_approval_conformance_ready_conformance_ready_conformance_ready_conformance_ready_conformance_ready_conformance_ready_conformance_ready_created: data.deployment_independent_attestation_verified_realized_benefit_customer_acceptance_regulatory_acceptance_regulatory_approval_conformance_ready_conformance_ready_conformance_ready_conformance_ready_conformance_ready_conformance_ready_conformance_ready_created,
        regulatory_approval_created: data.regulatory_approval_created,
        regulatory_clearance_created: data.regulatory_clearance_created,
        customer_acceptance_created: data.customer_acceptance_created,
        customer_approval_created: data.customer_approval_created,
        opc_allow: data.opc_allow,
        matrix_effective_state_updated: data.matrix_effective_state_updated,
        runtime_deletion_executed: data.runtime_deletion_executed,
        data_erasure_executed: data.data_erasure_executed,
        manifest_sha256: manifestSha256,
        result_assertion: "PASS_PROG_405_VALIDATOR_ACTIVE_MANIFEST"
      };
      console.log(JSON.stringify(out, null, 2));
      console.log("PROG_405_REGULATORY_APPROVAL_CONFORMANCE_READY_CONFORMANCE_READY_CONFORMANCE_READY_CONFORMANCE_READY_CONFORMANCE_READY_CONFORMANCE_READY_CONFORMANCE_READY_CONFORMANCE_BINDING_DRAFT_VALIDATOR=PASS");
    }
  }
}
