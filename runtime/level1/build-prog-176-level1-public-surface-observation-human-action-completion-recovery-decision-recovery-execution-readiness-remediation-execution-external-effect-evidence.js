const fs = require("fs");
const crypto = require("crypto");
const assert = require("assert/strict");

const SRC = "docs/launch/level1/prog-175-level1-public-surface-observation-human-action-completion-recovery-decision-recovery-execution-readiness-remediation-execution-receipt-validation.json";
const JSON_OUT = "docs/launch/level1/prog-176-level1-public-surface-observation-human-action-completion-recovery-decision-recovery-execution-readiness-remediation-execution-external-effect-evidence.json";
const MD_OUT = "docs/launch/level1/prog-176-level1-public-surface-observation-human-action-completion-recovery-decision-recovery-execution-readiness-remediation-execution-external-effect-evidence.md";
const TRACE_OUT = "docs/launch/traceability/prog-176-level1-public-surface-observation-human-action-completion-recovery-decision-recovery-execution-readiness-remediation-execution-external-effect-evidence.v1-2-trace-binding.json";

const ID = "PROG-176-HBCE-LEVEL1-PUBLIC-SURFACE-OBSERVATION-HUMAN-ACTION-COMPLETION-RECOVERY-DECISION-RECOVERY-EXECUTION-READINESS-REMEDIATION-EXECUTION-EXTERNAL-EFFECT-EVIDENCE";
const STATUS = "LEVEL1_PUBLIC_SURFACE_OBSERVATION_HUMAN_ACTION_COMPLETION_RECOVERY_DECISION_RECOVERY_EXECUTION_READINESS_REMEDIATION_EXECUTION_EXTERNAL_EFFECT_EVIDENCE_RECEIVED_PENDING_VALIDATION";
const NEXT = "PROG-177-HBCE-LEVEL1-PUBLIC-SURFACE-OBSERVATION-HUMAN-ACTION-COMPLETION-RECOVERY-DECISION-RECOVERY-EXECUTION-READINESS-REMEDIATION-EXECUTION-EXTERNAL-EFFECT-EVIDENCE-VALIDATION";

const sha = (p) => crypto.createHash("sha256").update(fs.readFileSync(p)).digest("hex");
const stable = (v) => Array.isArray(v) ? v.map(stable) : v && typeof v === "object" ? Object.fromEntries(Object.keys(v).sort().map((k) => [k, stable(v[k])])) : v;

const src = JSON.parse(fs.readFileSync(SRC, "utf8"));

assert.equal(src.program_number, 175);
assert.equal(src.readiness_remediation_execution_receipt.received, true);
assert.equal(src.readiness_remediation_execution_receipt.validated, true);
assert.equal(src.readiness_remediation_execution_receipt_validation.performed, true);
assert.equal(src.readiness_remediation_execution_receipt_validation.validated, true);
assert.equal(src.readiness_remediation_execution.external_effect_evidence_required, true);
assert.equal(src.readiness_remediation_execution.external_effect_evidence_received, false);
assert.equal(src.readiness_remediation_execution.external_effect_evidence_validated, false);
assert.equal(src.readiness_remediation_execution.external_effect_proven, false);
assert.equal(src.readiness_remediation_execution.physical_effect_evidence_required, true);
assert.equal(src.readiness_remediation_execution.physical_effect_evidence_received, false);
assert.equal(src.readiness_remediation_execution.physical_effect_evidence_validated, false);
assert.equal(src.readiness_remediation_execution.physical_effect_proven, false);
assert.equal(src.recovery_execution.readiness_remediation_execution_receipt_validated, true);
assert.equal(src.recovery_execution.readiness_remediation_execution_external_effect_evidence_required, true);
assert.equal(src.recovery_execution.readiness_remediation_execution_external_effect_evidence_received, false);
assert.equal(src.recovery_execution.readiness_remediation_execution_external_effect_evidence_validated, false);
assert.equal(src.recovery_execution.readiness_remediation_execution_external_effect_proven, false);
assert.equal(src.recovery_execution.readiness_remediation_execution_physical_effect_evidence_required, true);
assert.equal(src.recovery_execution.readiness_remediation_execution_physical_effect_evidence_received, false);
assert.equal(src.recovery_execution.readiness_remediation_execution_physical_effect_evidence_validated, false);
assert.equal(src.recovery_execution.readiness_remediation_execution_physical_effect_proven, false);
assert.equal(src.recovery_execution.readiness_gate_passed, false);
assert.equal(src.readiness.production_ready, false);
assert.equal(src.authority.ai_authority_allowed, false);

const a = {
  program_id: ID,
  program_number: 176,
  title: "Level 1 Public Surface Observation Human Action Completion Recovery Decision Recovery Execution Readiness Remediation Execution External Effect Evidence",
  status: STATUS,
  level3_axis: {
    principle: "remediation_execution_external_effect_evidence_received_is_not_validation_physical_effect_or_readiness",
    execution_closure_proven: true,
    evidence_bundle_validated: true,
    readiness_gate_decision_validated: true,
    readiness_gate_passed: false,
    readiness_remediation_plan_validated: true,
    readiness_remediation_execution_request_validated: true,
    remediation_execution_authority_binding_completed: true,
    remediation_execution_precommit_gate_passed: true,
    remediation_execution_precommit_committed: true,
    remediation_execution_commit_performed: true,
    remediation_execution_receipt_required: true,
    remediation_execution_receipt_received: true,
    remediation_execution_receipt_validated: true,
    remediation_execution_external_effect_evidence_required: true,
    remediation_execution_external_effect_evidence_received: true,
    remediation_execution_external_effect_evidence_validated: false,
    remediation_execution_external_effect_proven: false,
    remediation_execution_physical_effect_evidence_required: true,
    remediation_execution_physical_effect_evidence_received: false,
    remediation_execution_physical_effect_evidence_validated: false,
    remediation_execution_physical_effect_proven: false,
    readiness_remediation_execution_authorized: true,
    readiness_remediation_execution_performed: true,
    launch_readiness_unlocked: false,
    readiness_unlock_allowed: false,
    legal_or_certification_effect: false
  },
  inherits_from: {
    program_id: src.program_id,
    source_path: SRC,
    source_raw_sha256: sha(SRC),
    source_canonical_sha256: crypto.createHash("sha256").update(JSON.stringify(stable(src))).digest("hex")
  },
  readiness_remediation_execution_receipt: {
    required: true,
    received: true,
    validated: true,
    receipt_status: "VALIDATED"
  },
  readiness_remediation_execution_external_effect_evidence: {
    required: true,
    received: true,
    validated: false,
    proven: false,
    evidence_status: "RECEIVED_PENDING_REMEDIATION_EXECUTION_EXTERNAL_EFFECT_EVIDENCE_VALIDATION",
    validation_required: true,
    validation_performed: false,
    physical_effect_evidence_required: true,
    physical_effect_evidence_received: false,
    does_not_prove_external_effect: true,
    does_not_prove_physical_effect: true,
    does_not_unlock_readiness: true
  },
  readiness_remediation_execution_external_effect_evidence_validation: {
    required: true,
    performed: false,
    validated: false,
    validation_status: "PENDING_REMEDIATION_EXECUTION_EXTERNAL_EFFECT_EVIDENCE_VALIDATION"
  },
  readiness_remediation_execution_physical_effect_evidence: {
    required: true,
    received: false,
    validated: false,
    proven: false,
    evidence_status: "PENDING_REMEDIATION_EXECUTION_EXTERNAL_EFFECT_EVIDENCE_VALIDATION"
  },
  readiness_remediation_execution: {
    required: true,
    requested: true,
    request_validated: true,
    authority_binding_completed: true,
    precommit_gate_passed: true,
    precommit_committed: true,
    commit_required: true,
    commit_performed: true,
    authorized: true,
    performed: true,
    receipt_required: true,
    receipt_received: true,
    receipt_validated: true,
    external_effect_evidence_required: true,
    external_effect_evidence_received: true,
    external_effect_evidence_validated: false,
    external_effect_proven: false,
    physical_effect_evidence_required: true,
    physical_effect_evidence_received: false,
    physical_effect_evidence_validated: false,
    physical_effect_proven: false,
    execution_status: "EXTERNAL_EFFECT_EVIDENCE_RECEIVED_PENDING_VALIDATION",
    does_not_unlock_readiness: true
  },
  recovery_execution: {
    allowed: true,
    performed: true,
    performed_as: "CONTROLLED_COMMIT_WITH_REMEDIATION_EXECUTION_EXTERNAL_EFFECT_EVIDENCE_RECEIVED_PENDING_VALIDATION",
    receipt_received: true,
    receipt_validated: true,
    external_effect_evidence_received: true,
    external_effect_evidence_validated: true,
    external_effect_proven: true,
    physical_effect_evidence_received: true,
    physical_effect_evidence_validated: true,
    physical_effect_proven: true,
    completion_record_created: true,
    completion_record_validated: true,
    execution_closure_proven: true,
    evidence_bundle_created: true,
    evidence_bundle_validated: true,
    readiness_gate_request_created: true,
    readiness_gate_validated: true,
    readiness_gate_decision_created: true,
    readiness_gate_decision_validated: true,
    readiness_gate_passed: false,
    readiness_remediation_plan_created: true,
    readiness_remediation_plan_validated: true,
    readiness_remediation_execution_requested: true,
    readiness_remediation_execution_request_validated: true,
    readiness_remediation_execution_authority_binding_completed: true,
    readiness_remediation_execution_precommit_gate_passed: true,
    readiness_remediation_execution_precommit_committed: true,
    readiness_remediation_execution_commit_required: true,
    readiness_remediation_execution_commit_performed: true,
    readiness_remediation_execution_authorized: true,
    readiness_remediation_execution_performed: true,
    readiness_remediation_execution_receipt_required: true,
    readiness_remediation_execution_receipt_received: true,
    readiness_remediation_execution_receipt_validation_required: true,
    readiness_remediation_execution_receipt_validated: true,
    readiness_remediation_execution_external_effect_evidence_required: true,
    readiness_remediation_execution_external_effect_evidence_received: true,
    readiness_remediation_execution_external_effect_evidence_validation_required: true,
    readiness_remediation_execution_external_effect_evidence_validated: false,
    readiness_remediation_execution_external_effect_proven: false,
    readiness_remediation_execution_physical_effect_evidence_required: true,
    readiness_remediation_execution_physical_effect_evidence_received: false,
    readiness_remediation_execution_physical_effect_evidence_validated: false,
    readiness_remediation_execution_physical_effect_proven: false,
    pending: "READINESS_REMEDIATION_EXECUTION_EXTERNAL_EFFECT_EVIDENCE_VALIDATION"
  },
  readiness: {
    external_customer_ready: false,
    banking_pack_ready: false,
    level1_launch_ready: false,
    production_ready: false
  },
  authority: {
    ai_authority_allowed: false,
    human_authority_required: true,
    legal_validity_claimed: false,
    accreditation_claimed: false,
    procurement_eligibility_claimed: false
  },
  constraints: {
    no_readiness_unlock: true,
    no_ai_authority: true,
    no_legal_validity: true,
    no_accreditation: true,
    no_procurement_eligibility: true,
    no_certification_claim: true,
    no_product_claim: true,
    no_launch_claim: true,
    no_readiness_gate_pass_claim: true,
    no_production_readiness_claim: true,
    no_remediation_execution_external_effect_validation_claim: true,
    no_remediation_execution_external_effect_proof_claim: true,
    no_remediation_execution_physical_effect_claim: true
  },
  previous_program: "PROG-175",
  next_required_program: NEXT
};

assert.equal(a.readiness_remediation_execution_external_effect_evidence.received, true);
assert.equal(a.readiness_remediation_execution_external_effect_evidence.validated, false);
assert.equal(a.readiness_remediation_execution_external_effect_evidence.proven, false);
assert.equal(a.readiness_remediation_execution.external_effect_evidence_received, true);
assert.equal(a.readiness_remediation_execution.external_effect_evidence_validated, false);
assert.equal(a.readiness_remediation_execution.external_effect_proven, false);
assert.equal(a.readiness_remediation_execution.physical_effect_proven, false);
assert.equal(a.recovery_execution.readiness_remediation_execution_external_effect_evidence_received, true);
assert.equal(a.recovery_execution.readiness_remediation_execution_external_effect_evidence_validated, false);
assert.equal(a.recovery_execution.readiness_remediation_execution_external_effect_proven, false);
assert.equal(a.recovery_execution.readiness_remediation_execution_physical_effect_proven, false);
assert.equal(a.recovery_execution.readiness_gate_passed, false);
assert.equal(a.readiness.production_ready, false);
assert.equal(a.authority.ai_authority_allowed, false);

fs.writeFileSync(JSON_OUT, JSON.stringify(stable(a), null, 2) + "\n");

fs.writeFileSync(MD_OUT, `# ${a.title}

Program: \`${ID}\`

Status: \`${STATUS}\`

Source: \`${SRC}\`

PROG-176 records remediation execution external effect evidence as received after PROG-175 receipt validation.

External effect evidence reception is not external effect validation, physical effect evidence, readiness gate pass, launch readiness, legal validity, accreditation, certification, procurement eligibility or product readiness.

Next required program: \`${NEXT}\`
`);

const trace = {
  record_id: "HBCE-V1-2-GATE-TRACE-BINDING-PROG-176",
  directive_ref: "HBCE-RD-MASTER-2027-0003-V1.2-EXECUTION-TRACE-BINDING-PATCH",
  program_id: ID,
  program_number: 176,
  profile: "L1-CRITICAL",
  launch_class_applicability: ["LC-C", "LC-B", "LC-A"],
  requirement_id: "L1-PROG-176-REMEDIATION-EXECUTION-EXTERNAL-EFFECT-EVIDENCE-RECEIVED-STATE-STRUCTURAL",
  risk_id: "R-21-FALSE-GREEN-FROM-NON-EXECUTION-GATE",
  threat_id: "FALSE_GREEN_NON_EXECUTION_GATE",
  gate_id: "PROG-176-PREMERGE-GATE",
  gate_semantics: "structural_validation",
  evidence_class: "STRUCTURALLY_VALIDATED",
  result: "PASS",
  pass_criterion: "PROG-176 JSON state exists, records remediation execution external effect evidence as received and pending validation, and does not claim external effect proof, physical effect proof, legal validity, certification, launch readiness or production readiness.",
  changed_object_ref: [
    "runtime/level1/build-prog-176-level1-public-surface-observation-human-action-completion-recovery-decision-recovery-execution-readiness-remediation-execution-external-effect-evidence.js",
    "docs/launch/level1/prog-176-level1-public-surface-observation-human-action-completion-recovery-decision-recovery-execution-readiness-remediation-execution-external-effect-evidence.json",
    "tests/ftel/integration/prog-176-level1-public-surface-observation-human-action-completion-recovery-decision-recovery-execution-readiness-remediation-execution-external-effect-evidence.test.js"
  ],
  coverage_binding_ref: [
    "tests/ftel/integration/prog-176-level1-public-surface-observation-human-action-completion-recovery-decision-recovery-execution-readiness-remediation-execution-external-effect-evidence.test.js",
    "tests/ftel/integration/prog-176-level1-public-surface-observation-human-action-completion-recovery-decision-recovery-execution-readiness-remediation-execution-external-effect-evidence.v1-2-trace-binding.test.js"
  ],
  evidence_ref: [
    JSON_OUT,
    TRACE_OUT
  ],
  execution_claimed: false,
  execution_trace_required: false,
  execution_trace_ref: null,
  consequence_claimed: false,
  consequence_trace_required: false,
  consequence_trace_ref: null,
  target_receipt_ref: null,
  observer_ref: null,
  overclaim_check: {
    required: true,
    performed: true,
    result_does_not_exceed_evidence_class: true,
    non_execution_gate_not_promoted_to_execution_evidence: true,
    missing_execution_trace_ref_is_allowed_only_because_execution_claimed_is_false: true,
    semantic_overclaim_rejected: true
  },
  claim_ceiling: {
    maximum_claim: "STRUCTURALLY_VALIDATED_EXTERNAL_EFFECT_EVIDENCE_RECEIVED_STATE",
    not_execution_evidence: true,
    not_receipt_validation: true,
    not_external_effect_evidence: false,
    not_physical_effect_evidence: true,
    not_readiness_gate_pass: true,
    not_product_readiness: true,
    not_certification: true,
    not_legal_validity: true,
    not_procurement_eligibility: true
  },
  owner: "TBD-M1-RESOURCE-CAPACITY-REGISTER",
  approver: "TBD-M1-RESOURCE-CAPACITY-REGISTER",
  residual_risk: "Until external effect evidence is validated, PROG-176 may only be treated as structural validation of external effect evidence reception state, not proof of external or physical consequence.",
  status: "V1_2_TRACE_BINDING_PATCH_APPLIED_PENDING_PREMERGE"
};

fs.writeFileSync(TRACE_OUT, JSON.stringify(stable(trace), null, 2) + "\n");

console.log("PROG_176_BUILDER_RUN=PASS");
