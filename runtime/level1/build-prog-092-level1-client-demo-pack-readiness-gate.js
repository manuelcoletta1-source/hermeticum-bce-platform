'use strict';

const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');
const { sha256Digest } = require('../../packages/hbce-core/canonical-json.js');

const STATUS = 'LEVEL1_CLIENT_DEMO_PACK_READINESS_GATE_PASSED_CONTROLLED_SYNTHETIC_ONLY';
const SOURCE_REF = 'docs/launch/level1/prog-091-level1-client-demo-pack-qa-boundary.json';

const REQUIRED_GATE_CRITERIA = Object.freeze([
  'source_qa_boundary_hash_valid',
  'qa_boundary_ready',
  'script_ready',
  'runbook_ready',
  'evidence_index_ready',
  'scope_locked',
  'decision_proof_demo_ready',
  'allowed_questions_have_answers',
  'deferred_questions_have_responses',
  'approved_answers_evidence_bound',
  'synthetic_only_boundary_confirmed',
  'no_customer_data_confirmed',
  'no_live_system_control_confirmed',
  'no_production_integration_confirmed',
  'ai_authority_absence_confirmed'
]);

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

function buildGateCriteria(source) {
  const qa = source.client_demo_pack_qa_boundary;

  return {
    source_qa_boundary_hash_valid: validHash(source),
    qa_boundary_ready: source.readiness_state.client_demo_pack_q_and_a_boundary_ready === true,
    script_ready: source.readiness_state.client_demo_pack_script_ready === true,
    runbook_ready: source.readiness_state.client_demo_pack_runbook_ready === true,
    evidence_index_ready: source.readiness_state.client_demo_pack_evidence_index_ready === true,
    scope_locked: source.readiness_state.client_demo_pack_scope_locked === true,
    decision_proof_demo_ready: source.readiness_state.decision_proof_demo_ready === true,
    allowed_questions_have_answers: source.readiness_state.all_allowed_question_classes_have_answers === true,
    deferred_questions_have_responses: source.readiness_state.all_deferred_question_classes_have_responses === true,
    approved_answers_evidence_bound: source.readiness_state.all_approved_answers_evidence_bound === true,
    synthetic_only_boundary_confirmed: qa.qa_boundary.synthetic_demo_only === true,
    no_customer_data_confirmed: qa.qa_boundary.no_customer_data === true,
    no_live_system_control_confirmed: qa.qa_boundary.no_live_system_control === true,
    no_production_integration_confirmed: qa.qa_boundary.no_production_integration === true,
    ai_authority_absence_confirmed: source.non_claims.ai_authority === false && qa.ai_qa_authority_allowed === false
  };
}

function buildReadinessGatePayload(source) {
  const gateCriteria = buildGateCriteria(source);
  const missingCriteria = REQUIRED_GATE_CRITERIA.filter((criterion) => gateCriteria[criterion] !== true);
  const gatePassed = missingCriteria.length === 0;

  return {
    readiness_gate_id: 'CLIENT-DEMO-PACK-READINESS-GATE::HBCE-L1-DECISION-PROOF-0001',
    source_qa_boundary_ref: SOURCE_REF,
    source_qa_boundary_digest: source.client_demo_pack_qa_boundary.qa_boundary_payload_digest,
    pack_scope: source.client_demo_pack_qa_boundary.pack_scope,
    pack_status: gatePassed ? 'CONTROLLED_SYNTHETIC_CLIENT_DEMO_PACK_READY' : 'CLIENT_DEMO_PACK_NOT_READY',
    gate_scope: 'LEVEL1_DECISION_PROOF_CLIENT_DEMO_PACK_SYNTHETIC_ONLY',
    gate_mode: 'CONTROLLED_CLIENT_DEMO_PACK_READINESS_GATE',
    evaluated_at: '2027-01-19T16:20:00Z',
    target_audience: source.client_demo_pack_qa_boundary.target_audience,
    required_gate_criteria: REQUIRED_GATE_CRITERIA,
    gate_criteria: gateCriteria,
    missing_gate_criteria: missingCriteria,
    gate_result: gatePassed ? 'PASS_CONTROLLED_SYNTHETIC_CLIENT_DEMO_PACK_READY' : 'FAIL_CLIENT_DEMO_PACK_NOT_READY',
    gate_passed: gatePassed,
    controlled_synthetic_client_demo_pack_ready: gatePassed,
    client_demo_pack_readiness_basis: [
      'demo_readiness_snapshot_passed',
      'client_demo_pack_scope_locked',
      'client_demo_pack_evidence_index_ready',
      'client_demo_pack_runbook_ready',
      'client_demo_pack_script_ready',
      'client_demo_pack_q_and_a_boundary_ready'
    ],
    gate_boundary: {
      synthetic_demo_only: true,
      qa_boundary_required: true,
      script_required: true,
      runbook_required: true,
      evidence_index_required: true,
      scope_lock_required: true,
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
    approved_claims: {
      controlled_synthetic_client_demo_pack_ready: gatePassed,
      level1_client_pack_ready_inside_synthetic_demo_boundary: gatePassed,
      demo_ready: true,
      evidence_index_ready: true,
      runbook_ready: true,
      script_ready: true,
      qa_boundary_ready: true
    },
    blocked_claims: {
      unrestricted_client_pack_ready: true,
      external_customer_delivery_ready: true,
      public_surface_ready: true,
      banking_pack_ready: true,
      level1_launch_ready: true,
      production_ready: true,
      legal_validity: true,
      public_accreditation: true,
      procurement_eligibility: true,
      security_certification: true,
      ai_authority: true
    },
    public_surface_ready: false,
    external_customer_ready: false,
    banking_pack_ready: false,
    level1_launch_ready: false,
    production_ready: false,
    readiness_gate_comment: 'The readiness gate passes only for the controlled synthetic Level 1 client demo pack. It authorizes the pack as internally ready for controlled synthetic client demonstration, but does not authorize public surface readiness, external customer delivery readiness, banking pack readiness, Level 1 launch readiness, production readiness, legal validity, security certification or AI authority.',
    ai_gate_authority_allowed: false
  };
}

function buildLevel1ClientDemoPackReadinessGate(options = {}) {
  const rootDir = options.rootDir || process.cwd();
  const source = readJson(rootDir, SOURCE_REF);
  const gatePayload = buildReadinessGatePayload(source);

  const gateChecklist = {
    source_qa_boundary_hash_valid: validHash(source),
    qa_boundary_ready: source.readiness_state.client_demo_pack_q_and_a_boundary_ready === true,
    script_ready: source.readiness_state.client_demo_pack_script_ready === true,
    runbook_ready: source.readiness_state.client_demo_pack_runbook_ready === true,
    evidence_index_ready: source.readiness_state.client_demo_pack_evidence_index_ready === true,
    scope_locked: source.readiness_state.client_demo_pack_scope_locked === true,
    decision_proof_demo_ready_confirmed: source.readiness_state.decision_proof_demo_ready === true,
    all_gate_criteria_passed: gatePayload.gate_passed === true,
    no_missing_gate_criteria: gatePayload.missing_gate_criteria.length === 0,
    public_surface_readiness_excluded: source.readiness_state.public_surface_ready === false,
    external_customer_readiness_excluded: source.readiness_state.external_customer_ready === false,
    banking_pack_readiness_excluded: source.readiness_state.banking_pack_ready === false,
    launch_readiness_excluded: source.readiness_state.level1_launch_ready === false,
    production_readiness_excluded: source.readiness_state.production_ready === false,
    ai_authority_absence_confirmed: source.non_claims.ai_authority === false
  };

  const doc = {
    proto: 'HBCE-L1-PROG-092-CLIENT-DEMO-PACK-READINESS-GATE-v1',
    kind: 'HBCE_LEVEL1_CLIENT_DEMO_PACK_READINESS_GATE',
    document_code: 'HBCE-L1-CLIENT-DEMO-PACK-READINESS-GATE-2027-PROG-092',
    issue_id: 'PROG-092',
    priority: 'LEVEL1-CLIENT-DEMO-PACK-READINESS-GATE',
    repository_baseline_commit: options.repositoryCommit || gitHead(rootDir),

    source_client_demo_pack_qa_boundary_ref: SOURCE_REF,
    source_client_demo_pack_qa_boundary_revision_hash: source.revision_hash,
    source_client_demo_pack_qa_boundary_revision_hash_valid: validHash(source),

    level1_client_demo_pack_readiness_gate_status: STATUS,

    inherited_client_demo_qa_boundary: {
      qa_boundary_status: source.level1_client_demo_pack_qa_boundary_status,
      pack_scope: source.client_demo_pack_qa_boundary.pack_scope,
      pack_status: source.client_demo_pack_qa_boundary.pack_status,
      qa_scope: source.client_demo_pack_qa_boundary.qa_scope,
      qa_mode: source.client_demo_pack_qa_boundary.qa_mode,
      qa_boundary_ready: source.readiness_state.client_demo_pack_q_and_a_boundary_ready,
      script_ready: source.readiness_state.client_demo_pack_script_ready,
      runbook_ready: source.readiness_state.client_demo_pack_runbook_ready,
      evidence_index_ready: source.readiness_state.client_demo_pack_evidence_index_ready,
      scope_locked: source.readiness_state.client_demo_pack_scope_locked,
      decision_proof_demo_ready: source.readiness_state.decision_proof_demo_ready,
      prior_readiness_gate_passed: source.readiness_state.client_demo_pack_readiness_gate_passed,
      prior_public_surface_ready: source.readiness_state.public_surface_ready,
      prior_external_customer_ready: source.readiness_state.external_customer_ready,
      prior_banking_pack_ready: source.readiness_state.banking_pack_ready,
      prior_level1_client_pack_ready: source.readiness_state.level1_client_pack_ready,
      prior_level1_launch_ready: source.readiness_state.level1_launch_ready,
      prior_production_ready: source.readiness_state.production_ready
    },

    client_demo_pack_readiness_gate: {
      ...gatePayload,
      readiness_gate_payload_digest: sha256Digest(gatePayload),
      gate_checklist: gateChecklist,
      readiness_gate_defined: true,
      readiness_gate_is_controlled_synthetic_client_demo_pack_readiness: true,
      readiness_gate_is_not_public_surface_readiness: true,
      readiness_gate_is_not_external_customer_readiness: true,
      readiness_gate_is_not_banking_pack_readiness: true,
      readiness_gate_is_not_launch_readiness: true,
      readiness_gate_is_not_production_readiness: true,
      readiness_gate_is_not_legal_validity: true,
      readiness_gate_is_not_security_certification: true
    },

    fail_closed_codes: [
      'CLIENT_DEMO_PACK_READINESS_GATE_MISSING',
      'SOURCE_CLIENT_DEMO_PACK_QA_BOUNDARY_HASH_INVALID',
      'CLIENT_DEMO_PACK_QA_BOUNDARY_NOT_READY',
      'CLIENT_DEMO_PACK_SCRIPT_NOT_READY',
      'CLIENT_DEMO_PACK_RUNBOOK_NOT_READY',
      'CLIENT_DEMO_PACK_EVIDENCE_INDEX_NOT_READY',
      'CLIENT_DEMO_PACK_SCOPE_NOT_LOCKED',
      'REQUIRED_GATE_CRITERION_MISSING',
      'UNSUPPORTED_READINESS_CLAIM',
      'AI_GATE_AUTHORITY_CLAIM_BLOCKED'
    ],

    readiness_state: {
      client_demo_pack_readiness_gate_defined: true,
      client_demo_pack_readiness_gate_passed: gatePayload.gate_passed,
      controlled_synthetic_client_demo_pack_ready: gatePayload.controlled_synthetic_client_demo_pack_ready,
      level1_client_pack_ready: gatePayload.controlled_synthetic_client_demo_pack_ready,
      source_client_demo_pack_qa_boundary_bound: true,
      client_demo_pack_q_and_a_boundary_ready: true,
      client_demo_pack_script_ready: true,
      client_demo_pack_runbook_ready: true,
      client_demo_pack_evidence_index_ready: true,
      client_demo_pack_scope_locked: true,
      decision_proof_demo_ready: true,
      all_gate_criteria_passed: gatePayload.gate_passed,
      public_surface_required: true,
      public_surface_ready: false,
      external_customer_ready: false,
      banking_pack_ready: false,
      level1_launch_ready: false,
      production_ready: false
    },

    next_required_program: 'PROG-093-HBCE-LEVEL1-PUBLIC-SURFACE-SCOPE-LOCK',

    non_claims: {
      legal_validity: false,
      public_accreditation: false,
      procurement_eligibility: false,
      external_effect_proven: false,
      business_success: false,
      ai_authority: false,
      autonomous_authority: false,
      unrestricted_client_pack_ready: false,
      external_customer_ready: false,
      public_surface_ready: false,
      banking_pack_ready: false,
      level1_launch_ready: false,
      production_ready: false
    }
  };

  doc.revision_hash = sha256Digest(doc);
  return doc;
}

function writeLevel1ClientDemoPackReadinessGate(targetPath, options = {}) {
  const rootDir = options.rootDir || process.cwd();
  const doc = buildLevel1ClientDemoPackReadinessGate({ rootDir, repositoryCommit: options.repositoryCommit });
  fs.writeFileSync(path.join(rootDir, targetPath), `${JSON.stringify(doc, null, 2)}\n`);
  return doc;
}

if (require.main === module) {
  const targetPath = process.argv[2] || 'docs/launch/level1/prog-092-level1-client-demo-pack-readiness-gate.json';
  const doc = writeLevel1ClientDemoPackReadinessGate(targetPath, { rootDir: process.cwd() });
  console.log(`PROG_092_LEVEL1_CLIENT_DEMO_PACK_READINESS_GATE_WRITTEN=${doc.revision_hash}`);
}

module.exports = {
  STATUS,
  SOURCE_REF,
  REQUIRED_GATE_CRITERIA,
  buildGateCriteria,
  buildReadinessGatePayload,
  buildLevel1ClientDemoPackReadinessGate,
  writeLevel1ClientDemoPackReadinessGate
};
