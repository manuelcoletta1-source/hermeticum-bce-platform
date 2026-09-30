const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const assert = require("assert/strict");

const SRC = "docs/launch/level1/prog-192-level1-public-surface-observation-human-action-completion-recovery-decision-recovery-execution-independent-external-validation-outcome.json";
const JSON_OUT = "docs/launch/level1/prog-193-level1-public-surface-observation-human-action-completion-recovery-decision-recovery-execution-reviewer-identity-independence-evidence-binding.json";
const MD_OUT = "docs/launch/level1/prog-193-level1-public-surface-observation-human-action-completion-recovery-decision-recovery-execution-reviewer-identity-independence-evidence-binding.md";
const TRACE_OUT = "docs/launch/traceability/prog-193-level1-public-surface-observation-human-action-completion-recovery-decision-recovery-execution-reviewer-identity-independence-evidence-binding.v1-2-trace-binding.json";
const INDEX_JSON = "docs/launch/traceability/index.json";
const INDEX_MD = "docs/launch/traceability/INDEX.md";

const ID = "PROG-193-HBCE-LEVEL1-PUBLIC-SURFACE-OBSERVATION-HUMAN-ACTION-COMPLETION-RECOVERY-DECISION-RECOVERY-EXECUTION-REVIEWER-IDENTITY-INDEPENDENCE-EVIDENCE-BINDING";
const STATUS = "LEVEL1_PUBLIC_SURFACE_OBSERVATION_HUMAN_ACTION_COMPLETION_RECOVERY_DECISION_RECOVERY_EXECUTION_REVIEWER_IDENTITY_INDEPENDENCE_EVIDENCE_BOUND_PENDING_EVIDENCE_VERIFICATION";
const NEXT = "PROG-194-HBCE-LEVEL1-PUBLIC-SURFACE-OBSERVATION-HUMAN-ACTION-COMPLETION-RECOVERY-DECISION-RECOVERY-EXECUTION-REVIEWER-IDENTITY-INDEPENDENCE-EVIDENCE-VERIFICATION";

function stable(value) {
  if (Array.isArray(value)) return value.map(stable);
  if (value && typeof value === "object") return Object.fromEntries(Object.keys(value).sort().map((key) => [key, stable(value[key])]));
  return value;
}

function sha256Raw(file) {
  return crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex");
}

function writeJson(file, value) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, JSON.stringify(stable(value), null, 2) + "\n");
}

const src = JSON.parse(fs.readFileSync(SRC, "utf8"));

assert.equal(src.program_number, 192);
assert.equal(src.readiness_remediation_execution.external_validation_review_outcome_recorded, true);
assert.equal(src.readiness_remediation_execution.external_validation_accepted, false);
assert.equal(src.independent_external_validation_review.reviewer_identity_confirmed, false);
assert.equal(src.independent_external_validation_review.reviewer_independence_verified, false);
assert.equal(src.authority.external_validation_claimed, false);
assert.equal(src.authority.certification_claimed, false);
assert.equal(src.authority.legal_validity_claimed, false);
assert.equal(src.authority.procurement_eligibility_claimed, false);

const out = {
  ...src,
  program_id: ID,
  program_number: 193,
  title: "Level 1 Public Surface Observation Human Action Completion Recovery Decision Recovery Execution Reviewer Identity Independence Evidence Binding",
  status: STATUS,
  previous_program: "PROG-192",
  next_required_program: NEXT,
  principle: "reviewer_identity_and_independence_evidence_binding_is_not_evidence_verification_external_validation_acceptance_certification_legal_validity_or_procurement_eligibility",
  inherits_from: {
    program_id: src.program_id,
    source_path: SRC,
    source_raw_sha256: sha256Raw(SRC),
    source_canonical_sha256: crypto.createHash("sha256").update(JSON.stringify(stable(src))).digest("hex")
  },
  readiness_remediation_execution: {
    ...src.readiness_remediation_execution,
    external_validation_review_outcome_recorded: true,
    external_validation_accepted: false,
    reviewer_identity_evidence_required: true,
    reviewer_identity_evidence_bound: true,
    reviewer_independence_evidence_required: true,
    reviewer_independence_evidence_bound: true,
    reviewer_identity_confirmed: false,
    reviewer_independence_verified: false,
    reviewer_evidence_verification_required: true,
    reviewer_evidence_verification_completed: false,
    external_validation_outcome: "NOT_ACCEPTED_PENDING_REVIEWER_IDENTITY_AND_INDEPENDENCE_EVIDENCE_VERIFICATION",
    execution_status: "REVIEWER_IDENTITY_INDEPENDENCE_EVIDENCE_BOUND_PENDING_EVIDENCE_VERIFICATION",
    does_not_create_external_validation_acceptance: true,
    does_not_create_reviewer_identity_confirmation: true,
    does_not_create_reviewer_independence_verification: true,
    does_not_create_certification: true,
    does_not_create_legal_validity: true,
    does_not_create_procurement_eligibility: true
  },
  external_validation_package: {
    ...src.external_validation_package,
    review_outcome_recorded: true,
    reviewer_identity_evidence_bound: true,
    reviewer_independence_evidence_bound: true,
    independent_reviewer_identity_confirmed: false,
    independent_reviewer_independence_verified: false,
    independent_review_completed: false,
    external_validation_accepted: false,
    external_validation_rejected: false,
    certification_created: false,
    legal_validity_created: false,
    procurement_eligibility_created: false,
    status: "REVIEWER_IDENTITY_INDEPENDENCE_EVIDENCE_BOUND_PENDING_EVIDENCE_VERIFICATION"
  },
  independent_external_validation_review: {
    ...src.independent_external_validation_review,
    registered: true,
    review_outcome_recorded: true,
    reviewer_identity_evidence_bound: true,
    reviewer_independence_evidence_bound: true,
    reviewer_identity_confirmed: false,
    reviewer_independence_verified: false,
    reviewer_evidence_verification_completed: false,
    review_completed: false,
    external_validation_accepted: false,
    external_validation_rejected: false,
    status: "REVIEWER_IDENTITY_INDEPENDENCE_EVIDENCE_BOUND_PENDING_EVIDENCE_VERIFICATION"
  },
  reviewer_identity_independence_evidence: {
    required: true,
    binding_recorded: true,
    reviewer_identity_evidence_required: true,
    reviewer_identity_evidence_bound: true,
    reviewer_identity_confirmed: false,
    reviewer_independence_evidence_required: true,
    reviewer_independence_evidence_bound: true,
    reviewer_independence_verified: false,
    evidence_verification_required: true,
    evidence_verification_completed: false,
    external_validation_accepted: false,
    status: "BOUND_PENDING_EVIDENCE_VERIFICATION"
  },
  readiness_gate_decision: {
    ...src.readiness_gate_decision,
    does_not_create_external_validation_acceptance: true,
    does_not_create_reviewer_identity_confirmation: true,
    does_not_create_reviewer_independence_verification: true,
    does_not_create_certification: true,
    does_not_create_legal_validity: true,
    does_not_create_procurement_eligibility: true
  },
  recovery_execution: {
    ...src.recovery_execution,
    external_validation_review_outcome_recorded: true,
    external_validation_accepted: false,
    reviewer_identity_evidence_bound: true,
    reviewer_independence_evidence_bound: true,
    reviewer_identity_confirmed: false,
    reviewer_independence_verified: false,
    pending: "REVIEWER_IDENTITY_INDEPENDENCE_EVIDENCE_VERIFICATION"
  },
  readiness: {
    production_ready: true,
    level1_launch_ready: true,
    external_customer_ready: true,
    banking_pack_ready: true
  },
  authority: {
    ai_authority_allowed: false,
    human_authority_required: true,
    legal_validity_claimed: false,
    accreditation_claimed: false,
    procurement_eligibility_claimed: false,
    certification_claimed: false,
    external_validation_claimed: false
  },
  constraints: {
    no_ai_authority: true,
    no_legal_validity: true,
    no_accreditation: true,
    no_procurement_eligibility: true,
    no_certification_claim: true,
    no_external_validation_claim: true
  }
};

assert.equal(out.reviewer_identity_independence_evidence.binding_recorded, true);
assert.equal(out.reviewer_identity_independence_evidence.reviewer_identity_evidence_bound, true);
assert.equal(out.reviewer_identity_independence_evidence.reviewer_independence_evidence_bound, true);
assert.equal(out.reviewer_identity_independence_evidence.reviewer_identity_confirmed, false);
assert.equal(out.reviewer_identity_independence_evidence.reviewer_independence_verified, false);
assert.equal(out.reviewer_identity_independence_evidence.evidence_verification_completed, false);
assert.equal(out.readiness_remediation_execution.external_validation_accepted, false);
assert.equal(out.authority.external_validation_claimed, false);
assert.equal(out.authority.certification_claimed, false);
assert.equal(out.authority.legal_validity_claimed, false);
assert.equal(out.authority.procurement_eligibility_claimed, false);
assert.equal(out.recovery_execution.pending, "REVIEWER_IDENTITY_INDEPENDENCE_EVIDENCE_VERIFICATION");

writeJson(JSON_OUT, out);

fs.writeFileSync(MD_OUT, `# ${out.title}

Program: \`${ID}\`

Status: \`${STATUS}\`

Source: \`${SRC}\`

PROG-193 records reviewer identity and independence evidence binding after PROG-192.

Evidence binding is not evidence verification, not reviewer identity confirmation, not reviewer independence verification, not external validation acceptance, not legal validity, not accreditation, not certification and not procurement eligibility.

Next required program: \`${NEXT}\`
`);

const trace = {
  record_id: "HBCE-V1-2-GATE-TRACE-BINDING-PROG-193",
  directive_ref: "HBCE-RD-MASTER-2027-0003-V1.2-EXECUTION-TRACE-BINDING-PATCH",
  program_id: ID,
  program_number: 193,
  profile: "L1-CRITICAL",
  launch_class_applicability: ["LC-C", "LC-B", "LC-A"],
  requirement_id: "L1-PROG-193-REVIEWER-IDENTITY-INDEPENDENCE-EVIDENCE-BOUND-STATE-STRUCTURAL",
  risk_id: "R-21-FALSE-GREEN-FROM-NON-EXECUTION-GATE",
  threat_id: "FALSE_GREEN_NON_EXECUTION_GATE",
  gate_id: "PROG-193-PREMERGE-GATE",
  gate_semantics: "structural_validation",
  evidence_class: "STRUCTURALLY_VALIDATED",
  result: "PASS",
  pass_criterion: "PROG-193 JSON state exists, records reviewer identity and independence evidence binding, and does not claim evidence verification, reviewer identity confirmation, reviewer independence verification, external validation acceptance, legal validity, certification or procurement eligibility.",
  changed_object_ref: [
    "runtime/level1/build-prog-193-level1-public-surface-observation-human-action-completion-recovery-decision-recovery-execution-reviewer-identity-independence-evidence-binding.js",
    JSON_OUT,
    MD_OUT,
    "tests/ftel/integration/prog-193-level1-public-surface-observation-human-action-completion-recovery-decision-recovery-execution-reviewer-identity-independence-evidence-binding.test.js",
    TRACE_OUT,
    "tests/ftel/integration/prog-193-level1-public-surface-observation-human-action-completion-recovery-decision-recovery-execution-reviewer-identity-independence-evidence-binding.v1-2-trace-binding.test.js",
    INDEX_JSON,
    INDEX_MD
  ],
  coverage_binding_ref: [
    "tests/ftel/integration/prog-193-level1-public-surface-observation-human-action-completion-recovery-decision-recovery-execution-reviewer-identity-independence-evidence-binding.test.js",
    "tests/ftel/integration/prog-193-level1-public-surface-observation-human-action-completion-recovery-decision-recovery-execution-reviewer-identity-independence-evidence-binding.v1-2-trace-binding.test.js",
    "runtime/traceability/validate-v1-2-traceability-record.js",
    "runtime/traceability/validate-v1-2-traceability-index.js",
    "runtime/traceability/validate-v1-2-traceability-suite.js"
  ],
  evidence_ref: [JSON_OUT, TRACE_OUT],
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
    maximum_claim: "STRUCTURALLY_VALIDATED_REVIEWER_IDENTITY_INDEPENDENCE_EVIDENCE_BOUND_STATE",
    not_execution_evidence: true,
    not_receipt_validation: true,
    not_external_effect_evidence: false,
    not_physical_effect_evidence: false,
    not_readiness_gate_pass: true,
    not_product_readiness: true,
    not_evidence_verification: true,
    not_reviewer_identity_confirmation: true,
    not_reviewer_independence_verification: true,
    not_external_validation_acceptance: true,
    not_certification: true,
    not_legal_validity: true,
    not_procurement_eligibility: true
  },
  owner: "TBD-M1-RESOURCE-CAPACITY-REGISTER",
  approver: "TBD-M1-RESOURCE-CAPACITY-REGISTER",
  residual_risk: "Until bound reviewer identity and independence evidence are verified and an accepted independent outcome exists, PROG-193 may only be treated as structural validation of evidence binding state, not reviewer confirmation, external validation acceptance, certification, legal validity or procurement eligibility.",
  status: "V1_2_TRACE_BINDING_PATCH_APPLIED_PENDING_PREMERGE"
};

writeJson(TRACE_OUT, trace);

function rebuildTraceabilityIndex() {
  const traceDir = "docs/launch/traceability";
  const files = fs.readdirSync(traceDir).filter((file) => file.endsWith(".json") && file !== "index.json").sort();

  const records = files.map((file) => {
    const sourceFile = path.join(traceDir, file).replace(/\\/g, "/");
    const raw = fs.readFileSync(sourceFile, "utf8");
    const j = JSON.parse(raw);
    return {
      record_id: j.record_id,
      directive_ref: j.directive_ref,
      program_id: j.program_id,
      program_number: j.program_number,
      profile: j.profile,
      requirement_id: j.requirement_id,
      risk_id: j.risk_id,
      threat_id: j.threat_id,
      gate_id: j.gate_id,
      gate_semantics: j.gate_semantics,
      evidence_class: j.evidence_class,
      result: j.result,
      execution_claimed: j.execution_claimed,
      execution_trace_required: j.execution_trace_required,
      execution_trace_ref: j.execution_trace_ref,
      consequence_claimed: j.consequence_claimed,
      consequence_trace_required: j.consequence_trace_required,
      consequence_trace_ref: j.consequence_trace_ref,
      target_receipt_ref: j.target_receipt_ref,
      observer_ref: j.observer_ref,
      overclaim_check: j.overclaim_check,
      claim_ceiling: j.claim_ceiling,
      owner: j.owner,
      approver: j.approver,
      residual_risk: j.residual_risk,
      status: j.status,
      source_file: sourceFile,
      source_sha256: crypto.createHash("sha256").update(raw).digest("hex")
    };
  }).sort((a, b) => Number(a.program_number || 0) - Number(b.program_number || 0));

  const index = {
    index_id: "HBCE-V1-2-LAUNCH-TRACEABILITY-INDEX",
    directive_ref: "HBCE-RD-MASTER-2027-0003-V1.2-EXECUTION-TRACE-BINDING-PATCH",
    purpose: "Human-readable and machine-readable index for V1.2 traceability records. This index is navigation and claim-ceiling metadata, not execution evidence.",
    index_semantics: "navigation_index_not_gate_pass_not_execution_evidence",
    record_count: records.length,
    required_v1_2_fields: ["gate_semantics", "evidence_class", "changed_object_ref", "coverage_binding_ref", "evidence_ref", "execution_trace_ref", "consequence_trace_ref", "target_receipt_ref", "overclaim_check"],
    records,
    claim_ceiling: {
      not_execution_evidence: true,
      not_receipt_validation: true,
      not_external_effect_evidence: true,
      not_physical_effect_evidence: true,
      not_readiness_gate_pass: true,
      not_product_readiness: true,
      not_certification: true,
      not_legal_validity: true,
      not_procurement_eligibility: true
    }
  };

  writeJson(INDEX_JSON, index);

  const lines = [
    "# H.B.C.E. V1.2 Launch Traceability Index",
    "",
    "Directive: `HBCE-RD-MASTER-2027-0003-V1.2-EXECUTION-TRACE-BINDING-PATCH`",
    "",
    "Purpose: make V1.2 gate semantics, evidence class, execution-claim status, trace requirements and overclaim checks visible in one place.",
    "",
    "Claim ceiling: this index is navigation metadata. It is not execution evidence, not receipt validation, not external effect validation, not physical effect proof, not readiness gate pass, not launch readiness, not product readiness, not certification and not legal validity.",
    "",
    "## Records",
    "",
    "| Program | Requirement | Gate | Gate semantics | Evidence class | Result | Execution claimed | execution_trace_ref | Overclaim check | Source |",
    "|---|---|---|---|---|---|---|---|---|---|"
  ];

  for (const r of records) {
    const overclaim = r.overclaim_check && r.overclaim_check.result_does_not_exceed_evidence_class && r.overclaim_check.non_execution_gate_not_promoted_to_execution_evidence ? "PASS" : "CHECK";
    lines.push(`| PROG-${r.program_number} | \`${r.requirement_id || ""}\` | \`${r.gate_id || ""}\` | \`${r.gate_semantics || ""}\` | \`${r.evidence_class || ""}\` | \`${r.result || ""}\` | \`${String(r.execution_claimed)}\` | \`${r.execution_trace_ref === null ? "null" : r.execution_trace_ref || ""}\` | \`${overclaim}\` | \`${r.source_file}\` |`);
  }

  lines.push("");
  lines.push("## V1.2 rule");
  lines.push("");
  lines.push("A PASS does not become execution evidence unless the gate semantics declare execution and a valid observable `execution_trace_ref` binds the changed object, run, environment and trace artifact.");
  lines.push("");
  lines.push("## Current visible status");
  lines.push("");

  for (const r of records) lines.push(`- PROG-${r.program_number}: \`${r.gate_semantics}\` / \`${r.evidence_class}\` / execution claimed: \`${String(r.execution_claimed)}\` / trace required: \`${String(r.execution_trace_required)}\`.`);

  fs.writeFileSync(INDEX_MD, lines.join("\n") + "\n");
}

rebuildTraceabilityIndex();

console.log("PROG_193_BUILDER_RUN=PASS");
