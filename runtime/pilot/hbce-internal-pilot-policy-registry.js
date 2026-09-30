"use strict";

const fs = require("fs");
const eg001 = require("../shared-core/hbce-eg-001-state-transition-enforcement.js");
const baseline = require("./hbce-internal-pilot-baseline-manifest.js");

const PILOT_ID = "HBCE-PILOT-INTERNAL-2027-0001";
const POLICY_REGISTRY_VERSION = "HBCE-INTERNAL-PILOT-POLICY-REGISTRY-V0.1";

const REQUIRED_POLICY_IDS = [
  "HBCE-POLICY-AUTHORITY-RESOLUTION",
  "HBCE-POLICY-PROTECTED-STATE-TRANSITION",
  "HBCE-POLICY-EVIDENCE-COMPLETENESS",
  "HBCE-POLICY-CLAIM-CEILING",
  "HBCE-POLICY-CUSTOMER-EXECUTION-BLOCK",
  "HBCE-POLICY-OWNER-GATE",
  "HBCE-POLICY-EXTERNAL-VALIDATION-C16",
  "HBCE-POLICY-D0-LAUNCH-CLASS"
];

function sha256Record(record) {
  return eg001.sha256(record);
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function fileExists(filePath) {
  return fs.existsSync(filePath) && fs.statSync(filePath).isFile();
}

function createPolicyRecord(policy_id, overrides = {}) {
  const base = {
    record_type: "PolicyRecord",
    schema_version: POLICY_REGISTRY_VERSION,
    pilot_id: PILOT_ID,
    policy_id,
    policy_version: overrides.policy_version || "v001",
    policy_scope: overrides.policy_scope || "INTERNAL_PILOT_ONLY",
    producer_ref: "PROG-206",
    source_refs: overrides.source_refs || [
      "HBCE-PILOT-PROG-2027-0001",
      "PROG-204",
      "PROG-205"
    ],
    predicates: overrides.predicates || [],
    prohibited_inferences: overrides.prohibited_inferences || [
      "technical_pass_does_not_imply_legal_review",
      "owner_record_does_not_imply_corporate_signing_power",
      "internal_validation_does_not_imply_external_validation",
      "calendar_date_does_not_override_fail_unknown_incomplete_unverified",
      "joker_c2_output_does_not_create_authority",
      "gate_pass_does_not_create_execution_evidence"
    ],
    allowed_claims: overrides.allowed_claims || [
      "internal_policy_record_defined",
      "structural_validation_only"
    ],
    prohibited_claims: overrides.prohibited_claims || [
      "product_ready",
      "compliance_certified",
      "externally_validated",
      "commercially_authorized",
      "legal_reviewed",
      "level4_eligible"
    ],
    effective_state: overrides.effective_state || "ACTIVE_FOR_INTERNAL_PILOT",
    enforcement_mode: overrides.enforcement_mode || "FAIL_CLOSED",
    evidence_class: overrides.evidence_class || "STRUCTURALLY_VALIDATED",
    created_at: overrides.created_at || "2026-09-30T21:00:00+02:00",
    record_sha256: null
  };

  base.record_sha256 = sha256Record({ ...base, record_sha256: null });
  return base;
}

function createPolicyRegistry({
  created_at = "2026-09-30T21:00:00+02:00"
} = {}) {
  const policy_records = [
    createPolicyRecord("HBCE-POLICY-AUTHORITY-RESOLUTION", {
      created_at,
      predicates: [
        "identity_valid == TRUE",
        "authority_resolution == RESOLVED",
        "mandate_scope_match == TRUE",
        "owner_required_gate != BLOCKED"
      ],
      allowed_claims: [
        "authority_predicates_defined_for_internal_pilot",
        "policy_evaluation_can_block_unresolved_authority"
      ]
    }),
    createPolicyRecord("HBCE-POLICY-PROTECTED-STATE-TRANSITION", {
      created_at,
      predicates: [
        "protected_state_write_requires_transition_engine",
        "direct_mutation == REJECTED_TRANSITION",
        "decision_record_required == TRUE",
        "append_only_transition_event_required == TRUE"
      ],
      allowed_claims: [
        "protected_state_policy_defined",
        "direct_mutation_rejection_policy_defined"
      ]
    }),
    createPolicyRecord("HBCE-POLICY-EVIDENCE-COMPLETENESS", {
      created_at,
      predicates: [
        "mandatory_evidence_complete == TRUE_FOR_PASS",
        "missing_mandatory_evidence => BLOCK_OR_UNVERIFIED",
        "invalidated_required_evidence => RECOMPUTE_EFFECTIVE_STATE"
      ],
      allowed_claims: [
        "evidence_completeness_policy_defined",
        "missing_evidence_fail_closed_policy_defined"
      ]
    }),
    createPolicyRecord("HBCE-POLICY-CLAIM-CEILING", {
      created_at,
      predicates: [
        "claim <= evidence_class",
        "STRUCTURALLY_VALIDATED != EXECUTION_OBSERVED",
        "EXECUTION_OBSERVED requires execution_trace_ref",
        "CONSEQUENCE_OBSERVED requires target_receipt_or_observer_ref"
      ],
      allowed_claims: [
        "claim_ceiling_policy_defined",
        "overclaim_detection_policy_defined"
      ]
    }),
    createPolicyRecord("HBCE-POLICY-CUSTOMER-EXECUTION-BLOCK", {
      created_at,
      predicates: [
        "customer_external_execution == false until LC-B gate",
        "contract_gate_active_required_for_customer_environment",
        "legal_readiness_gate_required_for_LC_B_or_LC_A"
      ],
      allowed_claims: [
        "customer_execution_block_policy_defined",
        "external_execution_requires_future_gate"
      ]
    }),
    createPolicyRecord("HBCE-POLICY-OWNER-GATE", {
      created_at,
      predicates: [
        "required_owner_record_exists == TRUE",
        "owner_status == ASSIGNED",
        "authority_verified == TRUE",
        "unassigned_owner => M1_BLOCKED"
      ],
      allowed_claims: [
        "owner_gate_policy_defined",
        "unassigned_owner_blocks_gate"
      ]
    }),
    createPolicyRecord("HBCE-POLICY-EXTERNAL-VALIDATION-C16", {
      created_at,
      predicates: [
        "C16 requires distinct external validator",
        "self_pilot_cannot_close_C16",
        "external_validation_report_required_for_EXTERNALLY_VALIDATED"
      ],
      allowed_claims: [
        "c16_policy_defined",
        "self_validation_block_policy_defined"
      ]
    }),
    createPolicyRecord("HBCE-POLICY-D0-LAUNCH-CLASS", {
      created_at,
      predicates: [
        "approved_launch_class_exists == TRUE",
        "level1_applicable_gates == PASS",
        "mandatory_evidence_complete == TRUE",
        "runtime_evidence_supports_claims == TRUE",
        "no_non_deviable_blocker == TRUE",
        "operational_readiness == ACCEPTED",
        "launch_class_legal_readiness == SATISFIED",
        "explicit_human_GO == TRUE"
      ],
      allowed_claims: [
        "d0_policy_defined",
        "calendar_override_blocked_policy_defined"
      ]
    })
  ];

  const registry = {
    artifact_id: "20260930_HBCE-PILOT-INTERNAL-2027-0001_PolicyRegistry_v001",
    artifact_type: "PolicyRegistry",
    schema_version: POLICY_REGISTRY_VERSION,
    pilot_id: PILOT_ID,
    subject_ref: "HERMETICUM_INTERNAL_RELEASE_EVIDENCE_WORKFLOW",
    producer_ref: "PROG-206",
    source_refs: [
      "HBCE-PILOT-PROG-2027-0001/10",
      "HBCE-PILOT-PROG-2027-0001/13",
      "HBCE-PILOT-PROG-2027-0001/27",
      "HBCE-PILOT-PROG-2027-0001/31",
      "PROG-204",
      "PROG-205"
    ],
    created_at,
    policy_records,
    required_policy_count: REQUIRED_POLICY_IDS.length,
    policy_gate: "DEFINED_PENDING_RUNTIME_BINDING",
    customer_external_execution: false,
    c16_external_validation_performed: false,
    legal_review_claimed: false,
    certification_claimed: false,
    external_validation_claimed: false,
    commercial_release_authorization_claimed: false,
    level4_claimed: false,
    claim_boundary: {
      policies_defined: true,
      runtime_binding_required_before_execution_claim: true,
      legal_review_not_inferred: true,
      external_validation_not_inferred: true,
      customer_execution_not_enabled: true,
      level4_not_inferred: true
    },
    status: "POLICY_REGISTRY_CREATED_PENDING_RUNTIME_BINDING",
    content_sha256: null
  };

  registry.content_sha256 = sha256Record({ ...registry, content_sha256: null });
  return registry;
}

function verifyPolicyRegistry(registryPath) {
  const errors = [];

  if (!fileExists(registryPath)) {
    const missing = {
      record_type: "PolicyRegistryVerificationRecord",
      registry_path: registryPath,
      verified: false,
      error_count: 1,
      errors: [{ code: "POLICY_REGISTRY_MISSING", path: registryPath }],
      record_sha256: null
    };
    missing.record_sha256 = sha256Record({ ...missing, record_sha256: null });
    return missing;
  }

  const registry = readJson(registryPath);

  if (registry.pilot_id !== PILOT_ID) {
    errors.push({ code: "PILOT_ID_MISMATCH", observed: registry.pilot_id });
  }

  if (registry.schema_version !== POLICY_REGISTRY_VERSION) {
    errors.push({ code: "POLICY_REGISTRY_VERSION_MISMATCH", observed: registry.schema_version });
  }

  const policies = Array.isArray(registry.policy_records) ? registry.policy_records : [];
  const policyIds = policies.map((record) => record.policy_id);

  for (const policyId of REQUIRED_POLICY_IDS) {
    if (!policyIds.includes(policyId)) {
      errors.push({ code: "REQUIRED_POLICY_MISSING", policy_id: policyId });
    }
  }

  for (const record of policies) {
    const expectedPolicyHash = sha256Record({ ...record, record_sha256: null });
    if (record.record_sha256 !== expectedPolicyHash) {
      errors.push({ code: "POLICY_RECORD_HASH_MISMATCH", policy_id: record.policy_id });
    }

    if (record.enforcement_mode !== "FAIL_CLOSED") {
      errors.push({ code: "POLICY_NOT_FAIL_CLOSED", policy_id: record.policy_id });
    }

    if (record.evidence_class !== "STRUCTURALLY_VALIDATED") {
      errors.push({ code: "POLICY_EVIDENCE_CLASS_OVERCLAIM", policy_id: record.policy_id, observed: record.evidence_class });
    }

    for (const claim of record.prohibited_claims || []) {
      if ((record.allowed_claims || []).includes(claim)) {
        errors.push({ code: "POLICY_ALLOWED_PROHIBITED_CLAIM", policy_id: record.policy_id, claim });
      }
    }

    for (const requiredProhibition of [
      "product_ready",
      "compliance_certified",
      "externally_validated",
      "commercially_authorized",
      "legal_reviewed",
      "level4_eligible"
    ]) {
      if (!(record.prohibited_claims || []).includes(requiredProhibition)) {
        errors.push({ code: "POLICY_REQUIRED_PROHIBITION_MISSING", policy_id: record.policy_id, claim: requiredProhibition });
      }
    }
  }

  for (const key of [
    "customer_external_execution",
    "c16_external_validation_performed",
    "legal_review_claimed",
    "certification_claimed",
    "external_validation_claimed",
    "commercial_release_authorization_claimed",
    "level4_claimed"
  ]) {
    if (registry[key] !== false) {
      errors.push({ code: "POLICY_REGISTRY_OVERCLAIM", key, observed: registry[key] });
    }
  }

  const expectedRegistryHash = sha256Record({ ...registry, content_sha256: null });
  if (registry.content_sha256 !== expectedRegistryHash) {
    errors.push({
      code: "POLICY_REGISTRY_HASH_MISMATCH",
      expected: expectedRegistryHash,
      observed: registry.content_sha256
    });
  }

  const verification = {
    record_type: "PolicyRegistryVerificationRecord",
    verifier_version: "HBCE-INTERNAL-PILOT-POLICY-VERIFIER-V0.1",
    pilot_id: PILOT_ID,
    registry_path: registryPath,
    verified: errors.length === 0,
    error_count: errors.length,
    errors,
    required_policy_count: REQUIRED_POLICY_IDS.length,
    observed_policy_count: policies.length,
    policy_gate: registry.policy_gate,
    registry_sha256: baseline.contentSha256(registryPath),
    claim_boundary: {
      runtime_binding_required_before_execution_claim: true,
      legal_review_not_inferred: true,
      external_validation_not_inferred: true,
      customer_execution_not_enabled: true,
      level4_not_inferred: true
    },
    record_sha256: null
  };

  verification.record_sha256 = sha256Record({ ...verification, record_sha256: null });
  return verification;
}

module.exports = {
  PILOT_ID,
  POLICY_REGISTRY_VERSION,
  REQUIRED_POLICY_IDS,
  sha256Record,
  readJson,
  fileExists,
  createPolicyRecord,
  createPolicyRegistry,
  verifyPolicyRegistry
};
