const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const assert = require("assert/strict");

const SRC = "docs/launch/level1/prog-183-level1-public-surface-observation-human-action-completion-recovery-decision-recovery-execution-readiness-gate-decision.json";
const JSON_OUT = "docs/launch/level1/prog-184-level1-public-surface-observation-human-action-completion-recovery-decision-recovery-execution-readiness-gate-decision-validation.json";
const MD_OUT = "docs/launch/level1/prog-184-level1-public-surface-observation-human-action-completion-recovery-decision-recovery-execution-readiness-gate-decision-validation.md";
const TRACE_OUT = "docs/launch/traceability/prog-184-level1-public-surface-observation-human-action-completion-recovery-decision-recovery-execution-readiness-gate-decision-validation.v1-2-trace-binding.json";
const INDEX_JSON = "docs/launch/traceability/index.json";
const INDEX_MD = "docs/launch/traceability/INDEX.md";

const ID = "PROG-184-HBCE-LEVEL1-PUBLIC-SURFACE-OBSERVATION-HUMAN-ACTION-COMPLETION-RECOVERY-DECISION-RECOVERY-EXECUTION-READINESS-GATE-DECISION-VALIDATION";
const STATUS = "LEVEL1_PUBLIC_SURFACE_OBSERVATION_HUMAN_ACTION_COMPLETION_RECOVERY_DECISION_RECOVERY_EXECUTION_READINESS_GATE_DECISION_VALIDATED_PENDING_GATE_PASS";
const NEXT = "PROG-185-HBCE-LEVEL1-PUBLIC-SURFACE-OBSERVATION-HUMAN-ACTION-COMPLETION-RECOVERY-DECISION-RECOVERY-EXECUTION-READINESS-GATE-PASS";

function stable(value) {
  if (Array.isArray(value)) return value.map(stable);
  if (value && typeof value === "object") {
    return Object.fromEntries(Object.keys(value).sort().map((key) => [key, stable(value[key])]));
  }
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

assert.equal(src.program_number, 183);
assert.equal(src.readiness_remediation_execution.readiness_gate_requested, true);
assert.equal(src.readiness_remediation_execution.readiness_gate_request_validated, true);
assert.equal(src.readiness_remediation_execution.readiness_gate_decision_recorded, true);
assert.equal(src.readiness_remediation_execution.readiness_gate_decision_validated, false);
assert.equal(src.readiness_remediation_execution.readiness_gate_passed, false);
assert.equal(src.recovery_execution.readiness_gate_decision_recorded, true);
assert.equal(src.recovery_execution.readiness_gate_decision_validated, false);
assert.equal(src.recovery_execution.readiness_gate_passed, false);
assert.equal(src.readiness.production_ready, false);
assert.equal(src.authority.ai_authority_allowed, false);

const out = {
  program_id: ID,
  program_number: 184,
  title: "Level 1 Public Surface Observation Human Action Completion Recovery Decision Recovery Execution Readiness Gate Decision Validation",
  status: STATUS,
  previous_program: "PROG-183",
  next_required_program: NEXT,
  principle: "validated_readiness_gate_decision_is_not_readiness_gate_pass_or_production_readiness",
  inherits_from: {
    program_id: src.program_id,
    source_path: SRC,
    source_raw_sha256: sha256Raw(SRC),
    source_canonical_sha256: crypto.createHash("sha256").update(JSON.stringify(stable(src))).digest("hex")
  },
  readiness_remediation_execution: {
    required: true,
    performed: true,
    receipt_received: true,
    receipt_validated: true,
    external_effect_evidence_received: true,
    external_effect_evidence_validated: true,
    external_effect_proven: true,
    physical_effect_evidence_received: true,
    physical_effect_evidence_validated: true,
    physical_effect_proven: true,
    readiness_gate_required: true,
    readiness_gate_requested: true,
    readiness_gate_request_validated: true,
    readiness_gate_decision_required: true,
    readiness_gate_decision_recorded: true,
    readiness_gate_decision_validated: true,
    readiness_gate_passed: false,
    execution_status: "READINESS_GATE_DECISION_VALIDATED_PENDING_GATE_PASS",
    does_not_unlock_production_readiness: true
  },
  readiness_gate_request: {
    required: true,
    requested: true,
    received: true,
    validated: true,
    validation_required: true,
    validation_performed: true,
    validation_status: "VALIDATED",
    decision_required: true,
    decision_recorded: true,
    decision_validated: true,
    passed: false,
    status: "DECISION_VALIDATED_PENDING_GATE_PASS",
    does_not_create_product_readiness: true
  },
  readiness_gate_decision: {
    required: true,
    recorded: true,
    validated: true,
    candidate_outcome: "PASS_CANDIDATE_VALIDATED_PENDING_GATE_PASS",
    final_outcome: null,
    passed: false,
    status: "VALIDATED_PENDING_GATE_PASS",
    validation_required: true,
    validation_performed: true,
    does_not_create_gate_pass: true,
    does_not_create_product_readiness: true
  },
  recovery_execution: {
    ...src.recovery_execution,
    readiness_gate_required: true,
    readiness_gate_requested: true,
    readiness_gate_request_received: true,
    readiness_gate_request_validation_required: true,
    readiness_gate_request_validated: true,
    readiness_gate_decision_required: true,
    readiness_gate_decision_recorded: true,
    readiness_gate_decision_validated: true,
    readiness_gate_passed: false,
    pending: "READINESS_GATE_PASS"
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
    procurement_eligibility_claimed: false,
    certification_claimed: false
  },
  constraints: {
    no_ai_authority: true,
    no_legal_validity: true,
    no_accreditation: true,
    no_procurement_eligibility: true,
    no_certification_claim: true,
    no_product_claim: true,
    no_launch_claim: true,
    no_readiness_gate_pass_claim: true,
    no_production_readiness_claim: true
  }
};

assert.equal(out.readiness_remediation_execution.readiness_gate_decision_recorded, true);
assert.equal(out.readiness_remediation_execution.readiness_gate_decision_validated, true);
assert.equal(out.readiness_remediation_execution.readiness_gate_passed, false);
assert.equal(out.readiness_gate_decision.recorded, true);
assert.equal(out.readiness_gate_decision.validated, true);
assert.equal(out.readiness_gate_decision.passed, false);
assert.equal(out.recovery_execution.readiness_gate_decision_validated, true);
assert.equal(out.recovery_execution.readiness_gate_passed, false);
assert.equal(out.readiness.production_ready, false);
assert.equal(out.authority.ai_authority_allowed, false);

writeJson(JSON_OUT, out);

fs.writeFileSync(MD_OUT, `# ${out.title}

Program: \`${ID}\`

Status: \`${STATUS}\`

Source: \`${SRC}\`

PROG-184 validates the readiness gate decision recorded in PROG-183.

A validated readiness gate decision is not readiness gate pass, not launch readiness, not product readiness, not legal validity, not accreditation, not certification and not procurement eligibility.

Next required program: \`${NEXT}\`
`);

const trace = {
  record_id: "HBCE-V1-2-GATE-TRACE-BINDING-PROG-184",
  directive_ref: "HBCE-RD-MASTER-2027-0003-V1.2-EXECUTION-TRACE-BINDING-PATCH",
  program_id: ID,
  program_number: 184,
  profile: "L1-CRITICAL",
  launch_class_applicability: ["LC-C", "LC-B", "LC-A"],
  requirement_id: "L1-PROG-184-READINESS-GATE-DECISION-VALIDATED-STATE-STRUCTURAL",
  risk_id: "R-21-FALSE-GREEN-FROM-NON-EXECUTION-GATE",
  threat_id: "FALSE_GREEN_NON_EXECUTION_GATE",
  gate_id: "PROG-184-PREMERGE-GATE",
  gate_semantics: "structural_validation",
  evidence_class: "STRUCTURALLY_VALIDATED",
  result: "PASS",
  pass_criterion: "PROG-184 JSON state exists, validates readiness gate decision state, and does not claim readiness gate pass, legal validity, certification, launch readiness or production readiness.",
  changed_object_ref: [
    "runtime/level1/build-prog-184-level1-public-surface-observation-human-action-completion-recovery-decision-recovery-execution-readiness-gate-decision-validation.js",
    JSON_OUT,
    MD_OUT,
    "tests/ftel/integration/prog-184-level1-public-surface-observation-human-action-completion-recovery-decision-recovery-execution-readiness-gate-decision-validation.test.js",
    TRACE_OUT,
    "tests/ftel/integration/prog-184-level1-public-surface-observation-human-action-completion-recovery-decision-recovery-execution-readiness-gate-decision-validation.v1-2-trace-binding.test.js",
    INDEX_JSON,
    INDEX_MD
  ],
  coverage_binding_ref: [
    "tests/ftel/integration/prog-184-level1-public-surface-observation-human-action-completion-recovery-decision-recovery-execution-readiness-gate-decision-validation.test.js",
    "tests/ftel/integration/prog-184-level1-public-surface-observation-human-action-completion-recovery-decision-recovery-execution-readiness-gate-decision-validation.v1-2-trace-binding.test.js",
    "runtime/traceability/validate-v1-2-traceability-record.js",
    "runtime/traceability/validate-v1-2-traceability-index.js",
    "runtime/traceability/validate-v1-2-traceability-suite.js"
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
    maximum_claim: "STRUCTURALLY_VALIDATED_READINESS_GATE_DECISION_VALIDATED_STATE",
    not_execution_evidence: true,
    not_receipt_validation: true,
    not_external_effect_evidence: false,
    not_physical_effect_evidence: false,
    not_readiness_gate_pass: true,
    not_product_readiness: true,
    not_certification: true,
    not_legal_validity: true,
    not_procurement_eligibility: true
  },
  owner: "TBD-M1-RESOURCE-CAPACITY-REGISTER",
  approver: "TBD-M1-RESOURCE-CAPACITY-REGISTER",
  residual_risk: "Until readiness gate pass is completed separately, PROG-184 may only be treated as structural validation of readiness gate decision validation state, not readiness gate pass or production readiness.",
  status: "V1_2_TRACE_BINDING_PATCH_APPLIED_PENDING_PREMERGE"
};

writeJson(TRACE_OUT, trace);

function rebuildTraceabilityIndex() {
  const traceDir = "docs/launch/traceability";
  const files = fs.readdirSync(traceDir)
    .filter((file) => file.endsWith(".json") && file !== "index.json")
    .sort();

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
    required_v1_2_fields: [
      "gate_semantics",
      "evidence_class",
      "changed_object_ref",
      "coverage_binding_ref",
      "evidence_ref",
      "execution_trace_ref",
      "consequence_trace_ref",
      "target_receipt_ref",
      "overclaim_check"
    ],
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
    "Claim ceiling: this index is navigation metadata. It is not execution evidence, not receipt validation, not external effect validation, not physical effect proof, not readiness gate pass, not launch readiness, not certification and not legal validity.",
    "",
    "## Records",
    "",
    "| Program | Requirement | Gate | Gate semantics | Evidence class | Result | Execution claimed | execution_trace_ref | Overclaim check | Source |",
    "|---|---|---|---|---|---|---|---|---|---|"
  ];

  for (const r of records) {
    const overclaim = r.overclaim_check &&
      r.overclaim_check.result_does_not_exceed_evidence_class &&
      r.overclaim_check.non_execution_gate_not_promoted_to_execution_evidence
      ? "PASS"
      : "CHECK";

    lines.push(`| PROG-${r.program_number} | \`${r.requirement_id || ""}\` | \`${r.gate_id || ""}\` | \`${r.gate_semantics || ""}\` | \`${r.evidence_class || ""}\` | \`${r.result || ""}\` | \`${String(r.execution_claimed)}\` | \`${r.execution_trace_ref === null ? "null" : r.execution_trace_ref || ""}\` | \`${overclaim}\` | \`${r.source_file}\` |`);
  }

  lines.push("");
  lines.push("## V1.2 rule");
  lines.push("");
  lines.push("A PASS does not become execution evidence unless the gate semantics declare execution and a valid observable `execution_trace_ref` binds the changed object, run, environment and trace artifact.");
  lines.push("");
  lines.push("## Current visible status");
  lines.push("");

  for (const r of records) {
    lines.push(`- PROG-${r.program_number}: \`${r.gate_semantics}\` / \`${r.evidence_class}\` / execution claimed: \`${String(r.execution_claimed)}\` / trace required: \`${String(r.execution_trace_required)}\`.`);
  }

  fs.writeFileSync(INDEX_MD, lines.join("\n") + "\n");
}

rebuildTraceabilityIndex();

console.log("PROG_184_BUILDER_RUN=PASS");
