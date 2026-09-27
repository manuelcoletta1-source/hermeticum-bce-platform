'use strict';

const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');
const { sha256Digest } = require('../../packages/hbce-core/canonical-json.js');

const STATUS = 'LEVEL1_CLIENT_DEMO_PACK_SCRIPT_DEFINED_NOT_CLIENT_READY';
const SOURCE_REF = 'docs/launch/level1/prog-089-level1-client-demo-pack-runbook.json';

const SCRIPT_PHASES = Object.freeze([
  'PRE_BRIEF_SCOPE_BOUNDARY',
  'OPENING_PROBLEM_FRAME',
  'SYNTHETIC_DEMO_CONTEXT',
  'EVIDENCE_INDEX_WALKTHROUGH',
  'AUTHORITY_BOUNDARY_WALKTHROUGH',
  'POLICY_EVALUATION_WALKTHROUGH',
  'ACTION_REQUEST_RECEIPT_AUDIT_WALKTHROUGH',
  'EVIDENCE_EXPORT_AND_VERIFIER_REPLAY_WALKTHROUGH',
  'HUMAN_ACCEPTANCE_WALKTHROUGH',
  'DEMO_READINESS_SNAPSHOT_WALKTHROUGH',
  'NON_CLAIMS_AND_BOUNDARY_RECAP',
  'CLIENT_QUESTIONS_BOUNDARY'
]);

const SCRIPT_STOP_LINES = Object.freeze([
  'This request is outside the synthetic demo boundary and must be deferred to a future controlled artifact.',
  'This demo does not use customer data and cannot be presented as customer-data validation.',
  'This demo does not control a live system and cannot be presented as production operation.',
  'This demo does not create legal validity, public accreditation or procurement eligibility.',
  'This demo does not create pricing, SLA or security certification commitments.',
  'This demo does not authorize AI authority or autonomous execution authority.'
]);

const PHASE_SCRIPT_LINES = Object.freeze({
  PRE_BRIEF_SCOPE_BOUNDARY: 'Before we begin, this is a synthetic Level 1 Decision Proof demo. It is demo-ready inside its boundary, but it is not a client-ready pack, launch-ready product or production system.',
  OPENING_PROBLEM_FRAME: 'The problem we are demonstrating is not generic automation. The problem is proving who authorized a digital decision, under which boundary, with which evidence, and with which human accountability.',
  SYNTHETIC_DEMO_CONTEXT: 'The demonstration uses a deterministic synthetic fixture. It uses no customer data, controls no live system and does not claim external operational effect.',
  EVIDENCE_INDEX_WALKTHROUGH: 'We start from the evidence index. The index is the navigation layer that lists the controlled evidence chain and validates the indexed artifact hashes.',
  AUTHORITY_BOUNDARY_WALKTHROUGH: 'The authority boundary is explicit. JOKER-C2 is not a public authority, legal authority or autonomous execution authority.',
  POLICY_EVALUATION_WALKTHROUGH: 'The policy evaluation record is evidence-bound. It shows how a decision can be evaluated under a declared rule boundary without turning model output into authorization.',
  ACTION_REQUEST_RECEIPT_AUDIT_WALKTHROUGH: 'The request, receipt and audit event are separate records. A receipt proves capture of the action evidence, not external effect in a live target system.',
  EVIDENCE_EXPORT_AND_VERIFIER_REPLAY_WALKTHROUGH: 'The evidence export and verifier replay demonstrate replayable consistency of the synthetic chain. They do not prove customer deployment or production effect.',
  HUMAN_ACCEPTANCE_WALKTHROUGH: 'Human acceptance is explicit. The human authority records and attests the synthetic demo acceptance; AI does not accept or sign on behalf of the human.',
  DEMO_READINESS_SNAPSHOT_WALKTHROUGH: 'The demo readiness snapshot confirms synthetic Decision Proof demo readiness. It does not convert the system into client-pack-ready, launch-ready or production-ready status.',
  NON_CLAIMS_AND_BOUNDARY_RECAP: 'The non-claims are part of the evidence. No legal validity, public accreditation, procurement eligibility, pricing, SLA or security certification is claimed here.',
  CLIENT_QUESTIONS_BOUNDARY: 'Client questions are answered only inside the synthetic demo boundary. Out-of-bound requests are recorded and deferred instead of being improvised as readiness claims.'
});

function readJson(rootDir, rel) {
  return JSON.parse(fs.readFileSync(path.join(rootDir, rel), 'utf8'));
}

function gitHead(rootDir) {
  try {
    return execFileSync('git', ['rev-parse', 'HEAD'], { cwd: rootDir, encoding: 'utf8' }).trim();
  } catch (_err) {
    return 'UNKNOWN';
  }
}

function validHash(doc) {
  if (!doc || !doc.revision_hash) return false;
  const body = { ...doc };
  delete body.revision_hash;
  return doc.revision_hash === sha256Digest(body);
}

function buildScriptSections(source) {
  const steps = source.client_demo_pack_runbook.runbook_steps;

  return SCRIPT_PHASES.map((phase, index) => {
    const step = steps.find((entry) => entry.phase === phase);
    return {
      section_number: index + 1,
      phase,
      source_runbook_step_number: step ? step.step_number : null,
      source_runbook_purpose: step ? step.purpose : null,
      presenter_line: PHASE_SCRIPT_LINES[phase],
      required_statement: step ? step.required_statement : null,
      evidence_issues: step ? step.evidence_issues : [],
      evidence_refs: step ? step.evidence_refs : [],
      all_evidence_refs_bound: step ? step.all_evidence_refs_bound === true : false,
      allowed_to_improvise: false,
      must_preserve_boundary_language: true
    };
  });
}

function buildScriptPayload(source) {
  const scriptSections = buildScriptSections(source);

  return {
    script_id: 'CLIENT-DEMO-PACK-SCRIPT::HBCE-L1-DECISION-PROOF-0001',
    source_runbook_ref: SOURCE_REF,
    source_runbook_digest: source.client_demo_pack_runbook.runbook_payload_digest,
    pack_scope: source.client_demo_pack_runbook.pack_scope,
    pack_status: 'SCRIPT_DEFINED_NOT_CLIENT_READY',
    script_scope: 'LEVEL1_DECISION_PROOF_CLIENT_DEMO_PACK_SYNTHETIC_ONLY',
    script_mode: 'CONTROLLED_CLIENT_DEMO_SCRIPT',
    defined_at: '2027-01-19T16:10:00Z',
    target_audience: source.client_demo_pack_runbook.target_audience,
    script_phases: SCRIPT_PHASES,
    script_sections: scriptSections,
    script_section_count: scriptSections.length,
    all_script_phases_defined: SCRIPT_PHASES.every((phase) => scriptSections.some((section) => section.phase === phase)),
    all_script_sections_have_presenter_lines: scriptSections.every((section) => typeof section.presenter_line === 'string' && section.presenter_line.length > 0),
    all_script_sections_evidence_bound: scriptSections.every((section) => section.all_evidence_refs_bound === true),
    required_script_controls: [
      'read_scope_boundary_before_demo',
      'show_evidence_index_before_explanation',
      'use_scripted_boundary_language',
      'do_not_claim_client_pack_readiness',
      'do_not_claim_launch_readiness',
      'do_not_claim_production_readiness',
      'do_not_claim_legal_validity',
      'do_not_claim_security_certification',
      'stop_on_excluded_claim_request'
    ],
    stop_lines: SCRIPT_STOP_LINES,
    script_boundary: {
      synthetic_demo_only: true,
      evidence_index_required: true,
      runbook_required: true,
      no_customer_data: true,
      no_live_system_control: true,
      no_production_integration: true,
      no_legal_validity_claim: true,
      no_public_accreditation_claim: true,
      no_procurement_eligibility_claim: true,
      no_external_effect_claim: true,
      no_business_success_claim: true,
      no_ai_authority_claim: true,
      no_pricing_commitment: true,
      no_sla_commitment: true,
      no_security_certification_claim: true
    },
    client_demo_pack_runbook_ready: true,
    client_demo_pack_script_ready: true,
    client_demo_pack_q_and_a_boundary_ready: false,
    client_demo_pack_readiness_gate_passed: false,
    public_surface_ready: false,
    external_customer_ready: false,
    banking_pack_ready: false,
    level1_client_pack_ready: false,
    level1_launch_ready: false,
    production_ready: false,
    script_comment: 'The client demo pack script is defined for controlled presentation of the synthetic Level 1 Decision Proof demo. It makes presenter language repeatable and boundary-safe, but does not make the client demo pack ready, public-surface-ready, launch-ready, banking-ready or production-ready.',
    ai_script_authority_allowed: false
  };
}

function buildLevel1ClientDemoPackScript(options = {}) {
  const rootDir = options.rootDir || process.cwd();
  const source = readJson(rootDir, SOURCE_REF);
  const scriptPayload = buildScriptPayload(source);

  const scriptChecklist = {
    source_runbook_hash_valid: validHash(source),
    runbook_ready: source.readiness_state.client_demo_pack_runbook_ready === true,
    evidence_index_ready: source.readiness_state.client_demo_pack_evidence_index_ready === true,
    scope_locked: source.readiness_state.client_demo_pack_scope_locked === true,
    decision_proof_demo_ready_confirmed: source.readiness_state.decision_proof_demo_ready === true,
    all_script_phases_defined: scriptPayload.all_script_phases_defined,
    all_script_sections_have_presenter_lines: scriptPayload.all_script_sections_have_presenter_lines,
    all_script_sections_evidence_bound: scriptPayload.all_script_sections_evidence_bound,
    stop_lines_defined: scriptPayload.stop_lines.length === SCRIPT_STOP_LINES.length,
    launch_readiness_excluded: source.readiness_state.level1_launch_ready === false,
    client_pack_readiness_excluded: source.readiness_state.level1_client_pack_ready === false,
    production_readiness_excluded: source.readiness_state.production_ready === false,
    ai_authority_absence_confirmed: source.non_claims.ai_authority === false
  };

  const doc = {
    proto: 'HBCE-L1-PROG-090-CLIENT-DEMO-PACK-SCRIPT-v1',
    kind: 'HBCE_LEVEL1_CLIENT_DEMO_PACK_SCRIPT',
    document_code: 'HBCE-L1-CLIENT-DEMO-PACK-SCRIPT-2027-PROG-090',
    issue_id: 'PROG-090',
    priority: 'LEVEL1-CLIENT-DEMO-PACK-SCRIPT',
    repository_baseline_commit: options.repositoryCommit || gitHead(rootDir),

    source_client_demo_pack_runbook_ref: SOURCE_REF,
    source_client_demo_pack_runbook_revision_hash: source.revision_hash,
    source_client_demo_pack_runbook_revision_hash_valid: validHash(source),

    level1_client_demo_pack_script_status: STATUS,

    inherited_client_demo_runbook_boundary: {
      runbook_status: source.level1_client_demo_pack_runbook_status,
      pack_scope: source.client_demo_pack_runbook.pack_scope,
      pack_status: source.client_demo_pack_runbook.pack_status,
      runbook_scope: source.client_demo_pack_runbook.runbook_scope,
      runbook_mode: source.client_demo_pack_runbook.runbook_mode,
      runbook_ready: source.readiness_state.client_demo_pack_runbook_ready,
      all_runbook_phases_defined: source.readiness_state.all_runbook_phases_defined,
      all_step_evidence_refs_bound: source.readiness_state.all_step_evidence_refs_bound,
      prior_script_ready: source.readiness_state.client_demo_pack_script_ready,
      prior_q_and_a_boundary_ready: source.readiness_state.client_demo_pack_q_and_a_boundary_ready,
      prior_readiness_gate_passed: source.readiness_state.client_demo_pack_readiness_gate_passed,
      prior_public_surface_ready: source.readiness_state.public_surface_ready,
      prior_external_customer_ready: source.readiness_state.external_customer_ready,
      prior_banking_pack_ready: source.readiness_state.banking_pack_ready,
      prior_level1_client_pack_ready: source.readiness_state.level1_client_pack_ready,
      prior_level1_launch_ready: source.readiness_state.level1_launch_ready,
      prior_production_ready: source.readiness_state.production_ready
    },

    client_demo_pack_script: {
      ...scriptPayload,
      script_payload_digest: sha256Digest(scriptPayload),
      script_checklist: scriptChecklist,
      script_defined: true,
      script_is_not_client_pack_readiness: true,
      script_is_not_launch_readiness: true,
      script_is_not_public_surface_readiness: true,
      script_is_not_external_customer_readiness: true,
      script_is_not_banking_pack_readiness: true,
      script_is_not_production_readiness: true,
      script_is_not_legal_validity: true,
      script_is_not_security_certification: true
    },

    fail_closed_codes: [
      'CLIENT_DEMO_PACK_SCRIPT_MISSING',
      'SOURCE_CLIENT_DEMO_PACK_RUNBOOK_HASH_INVALID',
      'CLIENT_DEMO_PACK_RUNBOOK_NOT_READY',
      'REQUIRED_SCRIPT_PHASE_MISSING',
      'SCRIPT_SECTION_EVIDENCE_REF_MISSING',
      'SCRIPT_STOP_LINE_MISSING',
      'CUSTOMER_DATA_CLAIM_BLOCKED',
      'LIVE_SYSTEM_CONTROL_CLAIM_BLOCKED',
      'UNSUPPORTED_READINESS_CLAIM',
      'AI_SCRIPT_AUTHORITY_CLAIM_BLOCKED'
    ],

    readiness_state: {
      client_demo_pack_script_defined: true,
      client_demo_pack_script_ready: true,
      source_client_demo_pack_runbook_bound: true,
      client_demo_pack_runbook_ready: true,
      client_demo_pack_evidence_index_ready: true,
      client_demo_pack_scope_locked: true,
      decision_proof_demo_ready: true,
      all_script_phases_defined: scriptPayload.all_script_phases_defined,
      all_script_sections_have_presenter_lines: scriptPayload.all_script_sections_have_presenter_lines,
      all_script_sections_evidence_bound: scriptPayload.all_script_sections_evidence_bound,
      stop_lines_defined: true,
      script_controls_defined: true,
      client_demo_pack_q_and_a_boundary_ready: false,
      client_demo_pack_readiness_gate_passed: false,
      public_surface_required: true,
      public_surface_ready: false,
      external_customer_ready: false,
      banking_pack_ready: false,
      level1_client_pack_ready: false,
      level1_launch_ready: false,
      production_ready: false
    },

    next_required_program: 'PROG-091-HBCE-LEVEL1-CLIENT-DEMO-PACK-QA-BOUNDARY',

    non_claims: {
      legal_validity: false,
      public_accreditation: false,
      procurement_eligibility: false,
      external_effect_proven: false,
      business_success: false,
      ai_authority: false,
      autonomous_authority: false,
      client_pack_ready: false,
      public_surface_ready: false,
      external_customer_ready: false,
      banking_pack_ready: false,
      level1_launch_ready: false,
      production_ready: false
    }
  };

  doc.revision_hash = sha256Digest(doc);
  return doc;
}

function writeLevel1ClientDemoPackScript(targetPath, options = {}) {
  const rootDir = options.rootDir || process.cwd();
  const doc = buildLevel1ClientDemoPackScript({ rootDir, repositoryCommit: options.repositoryCommit });
  fs.writeFileSync(path.join(rootDir, targetPath), `${JSON.stringify(doc, null, 2)}\n`);
  return doc;
}

if (require.main === module) {
  const targetPath = process.argv[2] || 'docs/launch/level1/prog-090-level1-client-demo-pack-script.json';
  const doc = writeLevel1ClientDemoPackScript(targetPath, { rootDir: process.cwd() });
  console.log(`PROG_090_LEVEL1_CLIENT_DEMO_PACK_SCRIPT_WRITTEN=${doc.revision_hash}`);
}

module.exports = {
  STATUS,
  SOURCE_REF,
  SCRIPT_PHASES,
  SCRIPT_STOP_LINES,
  PHASE_SCRIPT_LINES,
  buildScriptSections,
  buildScriptPayload,
  buildLevel1ClientDemoPackScript,
  writeLevel1ClientDemoPackScript
};
