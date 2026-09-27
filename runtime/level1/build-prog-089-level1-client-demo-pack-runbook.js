'use strict';

const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');
const { sha256Digest } = require('../../packages/hbce-core/canonical-json.js');

const STATUS = 'LEVEL1_CLIENT_DEMO_PACK_RUNBOOK_DEFINED_NOT_CLIENT_READY';
const SOURCE_REF = 'docs/launch/level1/prog-088-level1-client-demo-pack-evidence-index.json';

const RUNBOOK_PHASES = Object.freeze([
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

const RUNBOOK_STOP_CONDITIONS = Object.freeze([
  'customer_data_requested',
  'live_system_control_requested',
  'production_integration_requested',
  'legal_validity_claim_requested',
  'public_accreditation_claim_requested',
  'procurement_eligibility_claim_requested',
  'pricing_commitment_requested',
  'sla_commitment_requested',
  'security_certification_claim_requested',
  'ai_authority_claim_requested'
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

function indexByIssue(source) {
  const out = {};
  for (const item of source.client_demo_pack_evidence_index.evidence_items) {
    out[item.issue_id] = {
      artifact_ref: item.artifact_ref,
      artifact_kind: item.artifact_kind,
      artifact_revision_hash: item.artifact_revision_hash,
      artifact_revision_hash_valid: item.artifact_revision_hash_valid
    };
  }

  out[source.issue_id] = {
    artifact_ref: SOURCE_REF,
    artifact_kind: source.kind,
    artifact_revision_hash: source.revision_hash,
    artifact_revision_hash_valid: validHash(source)
  };

  return out;
}

function buildRunbookSteps(source) {
  const refs = indexByIssue(source);

  return [
    {
      phase: 'PRE_BRIEF_SCOPE_BOUNDARY',
      purpose: 'Declare synthetic-only client demo scope before showing any artifact.',
      evidence_issues: ['PROG-087', 'PROG-088'],
      required_statement: 'This is a synthetic Level 1 Decision Proof demo pack and is not client-pack-ready, launch-ready or production-ready.'
    },
    {
      phase: 'OPENING_PROBLEM_FRAME',
      purpose: 'Frame the client problem as decision evidence, authority boundary, replayability and human accountability.',
      evidence_issues: ['PROG-066', 'PROG-067', 'PROG-068'],
      required_statement: 'The demo shows how a digital decision can be bounded, recorded, replayed and accepted under human authority.'
    },
    {
      phase: 'SYNTHETIC_DEMO_CONTEXT',
      purpose: 'Explain deterministic synthetic fixture scope and absence of customer data or live control.',
      evidence_issues: ['PROG-078', 'PROG-079', 'PROG-080'],
      required_statement: 'The demo uses deterministic fixture evidence only and does not touch customer data or live systems.'
    },
    {
      phase: 'EVIDENCE_INDEX_WALKTHROUGH',
      purpose: 'Use the evidence index as the navigation layer for the client demo pack.',
      evidence_issues: ['PROG-088'],
      required_statement: 'The evidence index lists the controlled evidence chain and validates indexed hashes.'
    },
    {
      phase: 'AUTHORITY_BOUNDARY_WALKTHROUGH',
      purpose: 'Show that model interaction is not authority and that authority remains human/governance-bound.',
      evidence_issues: ['PROG-070'],
      required_statement: 'JOKER-C2 is not an authority source; it helps communicate and process evidence under bounded rules.'
    },
    {
      phase: 'POLICY_EVALUATION_WALKTHROUGH',
      purpose: 'Show the policy evaluation record as an evidence object, not as autonomous authorization.',
      evidence_issues: ['PROG-071'],
      required_statement: 'Policy evaluation is evidence-bound and does not create autonomous execution authority.'
    },
    {
      phase: 'ACTION_REQUEST_RECEIPT_AUDIT_WALKTHROUGH',
      purpose: 'Show request, receipt and audit event as separate evidence objects.',
      evidence_issues: ['PROG-072', 'PROG-073', 'PROG-074'],
      required_statement: 'Request, receipt and audit trail are distinct records; receipt is not proof of external effect.'
    },
    {
      phase: 'EVIDENCE_EXPORT_AND_VERIFIER_REPLAY_WALKTHROUGH',
      purpose: 'Show export manifest and verifier replay result.',
      evidence_issues: ['PROG-075', 'PROG-076', 'PROG-077'],
      required_statement: 'The verifier replay confirms synthetic evidence consistency and closure under the demo boundary.'
    },
    {
      phase: 'HUMAN_ACCEPTANCE_WALKTHROUGH',
      purpose: 'Show human acceptance record, decision and manual attestation.',
      evidence_issues: ['PROG-082', 'PROG-083', 'PROG-084'],
      required_statement: 'Human acceptance is explicitly recorded and attested; AI does not accept on behalf of the human authority.'
    },
    {
      phase: 'DEMO_READINESS_SNAPSHOT_WALKTHROUGH',
      purpose: 'Show demo readiness closure and snapshot.',
      evidence_issues: ['PROG-085', 'PROG-086'],
      required_statement: 'Decision Proof demo readiness is synthetic-only and does not imply launch, client-pack or production readiness.'
    },
    {
      phase: 'NON_CLAIMS_AND_BOUNDARY_RECAP',
      purpose: 'Recap excluded claims and fail-closed boundaries.',
      evidence_issues: ['PROG-087', 'PROG-088'],
      required_statement: 'No legal validity, public accreditation, procurement eligibility, pricing, SLA or security certification is claimed.'
    },
    {
      phase: 'CLIENT_QUESTIONS_BOUNDARY',
      purpose: 'Route client questions to allowed scope and stop on excluded claims.',
      evidence_issues: ['PROG-087'],
      required_statement: 'Questions outside the synthetic demo boundary require a separate future artifact and must not be answered as readiness.'
    }
  ].map((step, idx) => ({
    step_number: idx + 1,
    ...step,
    evidence_refs: step.evidence_issues.map((issue) => refs[issue]).filter(Boolean),
    all_evidence_refs_bound: step.evidence_issues.every((issue) => Boolean(refs[issue]))
  }));
}

function buildRunbookPayload(source) {
  const runbookSteps = buildRunbookSteps(source);

  return {
    runbook_id: 'CLIENT-DEMO-PACK-RUNBOOK::HBCE-L1-DECISION-PROOF-0001',
    source_evidence_index_ref: SOURCE_REF,
    source_evidence_index_digest: source.client_demo_pack_evidence_index.evidence_index_payload_digest,
    pack_scope: source.client_demo_pack_evidence_index.pack_scope,
    pack_status: 'RUNBOOK_DEFINED_NOT_CLIENT_READY',
    runbook_scope: 'LEVEL1_DECISION_PROOF_CLIENT_DEMO_PACK_SYNTHETIC_ONLY',
    runbook_mode: 'CONTROLLED_CLIENT_DEMO_RUNBOOK',
    defined_at: '2027-01-19T16:05:00Z',
    target_audience: source.client_demo_pack_evidence_index.target_audience,
    runbook_phases: RUNBOOK_PHASES,
    runbook_steps: runbookSteps,
    runbook_step_count: runbookSteps.length,
    all_runbook_phases_defined: RUNBOOK_PHASES.every((phase) => runbookSteps.some((step) => step.phase === phase)),
    all_step_evidence_refs_bound: runbookSteps.every((step) => step.all_evidence_refs_bound === true),
    required_presenter_controls: [
      'state_synthetic_only_before_demo',
      'show_evidence_index_before_narrative',
      'separate_demo_readiness_from_client_pack_readiness',
      'separate_receipt_from_external_effect',
      'separate_human_acceptance_from_legal_validity',
      'stop_on_excluded_claim_request',
      'record_unanswered_out_of_scope_questions'
    ],
    stop_conditions: RUNBOOK_STOP_CONDITIONS,
    runbook_boundary: {
      synthetic_demo_only: true,
      evidence_index_required: true,
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
    client_demo_pack_script_ready: false,
    client_demo_pack_q_and_a_boundary_ready: false,
    client_demo_pack_readiness_gate_passed: false,
    public_surface_ready: false,
    external_customer_ready: false,
    banking_pack_ready: false,
    level1_client_pack_ready: false,
    level1_launch_ready: false,
    production_ready: false,
    runbook_comment: 'The client demo pack runbook is defined for the synthetic Level 1 Decision Proof demo. It makes the demo sequence operable for controlled presentation, but does not make the client pack ready, public-surface-ready, launch-ready, banking-ready or production-ready.',
    ai_runbook_authority_allowed: false
  };
}

function buildLevel1ClientDemoPackRunbook(options = {}) {
  const rootDir = options.rootDir || process.cwd();
  const source = readJson(rootDir, SOURCE_REF);
  const runbookPayload = buildRunbookPayload(source);

  const runbookChecklist = {
    source_evidence_index_hash_valid: validHash(source),
    evidence_index_ready: source.readiness_state.client_demo_pack_evidence_index_ready === true,
    all_required_issues_indexed: source.readiness_state.all_required_issues_indexed === true,
    all_indexed_hashes_valid: source.readiness_state.all_indexed_hashes_valid === true,
    scope_locked: source.readiness_state.client_demo_pack_scope_locked === true,
    decision_proof_demo_ready_confirmed: source.readiness_state.decision_proof_demo_ready === true,
    all_runbook_phases_defined: runbookPayload.all_runbook_phases_defined,
    all_step_evidence_refs_bound: runbookPayload.all_step_evidence_refs_bound,
    stop_conditions_defined: runbookPayload.stop_conditions.length === RUNBOOK_STOP_CONDITIONS.length,
    launch_readiness_excluded: source.readiness_state.level1_launch_ready === false,
    client_pack_readiness_excluded: source.readiness_state.level1_client_pack_ready === false,
    production_readiness_excluded: source.readiness_state.production_ready === false,
    ai_authority_absence_confirmed: source.non_claims.ai_authority === false
  };

  const doc = {
    proto: 'HBCE-L1-PROG-089-CLIENT-DEMO-PACK-RUNBOOK-v1',
    kind: 'HBCE_LEVEL1_CLIENT_DEMO_PACK_RUNBOOK',
    document_code: 'HBCE-L1-CLIENT-DEMO-PACK-RUNBOOK-2027-PROG-089',
    issue_id: 'PROG-089',
    priority: 'LEVEL1-CLIENT-DEMO-PACK-RUNBOOK',
    repository_baseline_commit: options.repositoryCommit || gitHead(rootDir),

    source_client_demo_pack_evidence_index_ref: SOURCE_REF,
    source_client_demo_pack_evidence_index_revision_hash: source.revision_hash,
    source_client_demo_pack_evidence_index_revision_hash_valid: validHash(source),

    level1_client_demo_pack_runbook_status: STATUS,

    inherited_client_demo_evidence_index_boundary: {
      evidence_index_status: source.level1_client_demo_pack_evidence_index_status,
      pack_scope: source.client_demo_pack_evidence_index.pack_scope,
      pack_status: source.client_demo_pack_evidence_index.pack_status,
      index_scope: source.client_demo_pack_evidence_index.index_scope,
      index_mode: source.client_demo_pack_evidence_index.index_mode,
      evidence_index_ready: source.readiness_state.client_demo_pack_evidence_index_ready,
      all_required_issues_indexed: source.readiness_state.all_required_issues_indexed,
      all_indexed_hashes_valid: source.readiness_state.all_indexed_hashes_valid,
      prior_runbook_ready: source.readiness_state.client_demo_pack_runbook_ready,
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

    client_demo_pack_runbook: {
      ...runbookPayload,
      runbook_payload_digest: sha256Digest(runbookPayload),
      runbook_checklist: runbookChecklist,
      runbook_defined: true,
      runbook_is_not_client_pack_readiness: true,
      runbook_is_not_launch_readiness: true,
      runbook_is_not_public_surface_readiness: true,
      runbook_is_not_external_customer_readiness: true,
      runbook_is_not_banking_pack_readiness: true,
      runbook_is_not_production_readiness: true,
      runbook_is_not_legal_validity: true,
      runbook_is_not_security_certification: true
    },

    fail_closed_codes: [
      'CLIENT_DEMO_PACK_RUNBOOK_MISSING',
      'SOURCE_CLIENT_DEMO_PACK_EVIDENCE_INDEX_HASH_INVALID',
      'CLIENT_DEMO_PACK_EVIDENCE_INDEX_NOT_READY',
      'REQUIRED_RUNBOOK_PHASE_MISSING',
      'RUNBOOK_STEP_EVIDENCE_REF_MISSING',
      'STOP_CONDITION_MISSING',
      'CUSTOMER_DATA_CLAIM_BLOCKED',
      'LIVE_SYSTEM_CONTROL_CLAIM_BLOCKED',
      'UNSUPPORTED_READINESS_CLAIM',
      'AI_RUNBOOK_AUTHORITY_CLAIM_BLOCKED'
    ],

    readiness_state: {
      client_demo_pack_runbook_defined: true,
      client_demo_pack_runbook_ready: true,
      source_client_demo_pack_evidence_index_bound: true,
      client_demo_pack_evidence_index_ready: true,
      client_demo_pack_scope_locked: true,
      decision_proof_demo_ready: true,
      all_runbook_phases_defined: runbookPayload.all_runbook_phases_defined,
      all_step_evidence_refs_bound: runbookPayload.all_step_evidence_refs_bound,
      stop_conditions_defined: true,
      presenter_controls_defined: true,
      client_demo_pack_script_ready: false,
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

    next_required_program: 'PROG-090-HBCE-LEVEL1-CLIENT-DEMO-PACK-SCRIPT',

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

function writeLevel1ClientDemoPackRunbook(targetPath, options = {}) {
  const rootDir = options.rootDir || process.cwd();
  const doc = buildLevel1ClientDemoPackRunbook({ rootDir, repositoryCommit: options.repositoryCommit });
  fs.writeFileSync(path.join(rootDir, targetPath), `${JSON.stringify(doc, null, 2)}\n`);
  return doc;
}

if (require.main === module) {
  const targetPath = process.argv[2] || 'docs/launch/level1/prog-089-level1-client-demo-pack-runbook.json';
  const doc = writeLevel1ClientDemoPackRunbook(targetPath, { rootDir: process.cwd() });
  console.log(`PROG_089_LEVEL1_CLIENT_DEMO_PACK_RUNBOOK_WRITTEN=${doc.revision_hash}`);
}

module.exports = {
  STATUS,
  SOURCE_REF,
  RUNBOOK_PHASES,
  RUNBOOK_STOP_CONDITIONS,
  buildRunbookSteps,
  buildRunbookPayload,
  buildLevel1ClientDemoPackRunbook,
  writeLevel1ClientDemoPackRunbook
};
