'use strict';

const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');
const { sha256Digest } = require('../../packages/hbce-core/canonical-json.js');

const REQUIRED_FOLLOWUP_ACTIONS = Object.freeze([
  'INDEPENDENT_CLOSURE_DECISION_RECORD',
  'LIMITATIONS_RESOLUTION_RECORD',
  'EXTERNAL_VALIDATION_COMPLETION_RECORD',
  'PILOT_READINESS_AUTHORIZATION_RECORD',
  'LEVEL2_READINESS_REEVALUATION'
]);

const FOLLOWUP_STATUSES = Object.freeze([
  'OPEN',
  'BLOCKED',
  'READY_FOR_REVIEW',
  'COMPLETE',
  'REJECTED'
]);

function readJson(rootDir, relativePath) {
  return JSON.parse(fs.readFileSync(path.join(rootDir, relativePath), 'utf8'));
}

function gitHead(rootDir) {
  try {
    return execFileSync('git', ['rev-parse', 'HEAD'], { cwd: rootDir, encoding: 'utf8' }).trim();
  } catch (_error) {
    return 'UNKNOWN';
  }
}

function validHash(doc) {
  if (!doc || typeof doc !== 'object' || !doc.revision_hash) return false;
  const body = { ...doc };
  delete body.revision_hash;
  return doc.revision_hash === sha256Digest(body);
}

function buildActionsFromClosureGate(source) {
  const blockingReasons = Array.isArray(source?.gate?.blocking_reasons) ? source.gate.blocking_reasons : [];

  return [
    {
      action_id: 'L2-FOLLOWUP-001',
      action_type: 'INDEPENDENT_CLOSURE_DECISION_RECORD',
      source_blocking_reason: 'INDEPENDENT_CLOSURE_DECISION_MISSING',
      status: 'OPEN',
      required_input: 'independent review decision on whether external validation may be closed',
      completion_artifact: 'independent_closure_decision_record',
      closes_candidate_readiness: false
    },
    {
      action_id: 'L2-FOLLOWUP-002',
      action_type: 'LIMITATIONS_RESOLUTION_RECORD',
      source_blocking_reason: 'LIMITATIONS_RESOLUTION_RECORD_MISSING',
      status: 'OPEN',
      required_input: 'resolution or explicit acceptance of external validation limitations',
      completion_artifact: 'limitations_resolution_record',
      closes_candidate_readiness: false
    },
    {
      action_id: 'L2-FOLLOWUP-003',
      action_type: 'EXTERNAL_VALIDATION_COMPLETION_RECORD',
      source_blocking_reason: 'EXTERNAL_VALIDATION_COMPLETION_NOT_SUPPORTED_BY_SOURCE',
      status: 'OPEN',
      required_input: 'explicit completion record bound to closure decision and limitations resolution',
      completion_artifact: 'external_validation_completion_record',
      closes_candidate_readiness: false
    },
    {
      action_id: 'L2-FOLLOWUP-004',
      action_type: 'PILOT_READINESS_AUTHORIZATION_RECORD',
      source_blocking_reason: 'PILOT_READINESS_AUTHORIZATION_MISSING',
      status: 'OPEN',
      required_input: 'separate pilot readiness authorization after external validation closure',
      completion_artifact: 'pilot_readiness_authorization_record',
      closes_candidate_readiness: false
    },
    {
      action_id: 'L2-FOLLOWUP-005',
      action_type: 'LEVEL2_READINESS_REEVALUATION',
      source_blocking_reason: 'B2G_CANDIDATE_PROMOTION_NOT_ALLOWED',
      status: 'BLOCKED',
      required_input: 'rerun readiness gate after closure artifacts are complete',
      completion_artifact: 'level2_readiness_reevaluation_record',
      closes_candidate_readiness: false
    }
  ].map((action) => ({
    ...action,
    source_blocking_reason_present: blockingReasons.includes(action.source_blocking_reason)
  }));
}

function buildFollowupPlan(options = {}) {
  const rootDir = options.rootDir || process.cwd();
  const repositoryCommit = options.repositoryCommit || gitHead(rootDir);
  const sourcePath = 'docs/launch/level2/v3-5-r1/v3-5-r1-level2-external-validation-closure-gate.json';
  const source = readJson(rootDir, sourcePath);
  const actions = buildActionsFromClosureGate(source);

  const doc = {
    proto: 'HBCE-B2G-L2-JC2-V3-5-R1-LEVEL2-VALIDATION-FOLLOWUP-PLAN-v1',
    kind: 'HBCE_B2G_LEVEL2_JOKER_C2_V3_5_R1_LEVEL2_VALIDATION_FOLLOWUP_PLAN',
    document_code: 'HBCE-B2G-L2-JC2-PROG-2027-0001',
    specification_baseline: 'V3.5-R1 - Forensic Evidence & Verifier Qualification Hardening - 26 September 2026',
    issue_id: 'PROG-053',
    priority: 'V3.5-R1-LEVEL2-VALIDATION-FOLLOWUP-PLAN',
    repository_baseline_commit: repositoryCommit,

    source_external_validation_closure_gate_ref: sourcePath,
    source_external_validation_closure_gate_revision_hash: source.revision_hash,
    source_external_validation_closure_gate_revision_hash_valid: validHash(source),
    source_gate_result: source?.gate?.gate_result || 'UNKNOWN',

    required_followup_actions: REQUIRED_FOLLOWUP_ACTIONS,
    allowed_followup_statuses: FOLLOWUP_STATUSES,
    followup_actions: actions,

    followup_summary: {
      action_count: actions.length,
      open_action_count: actions.filter((a) => a.status === 'OPEN').length,
      blocked_action_count: actions.filter((a) => a.status === 'BLOCKED').length,
      complete_action_count: actions.filter((a) => a.status === 'COMPLETE').length,
      all_source_blocking_reasons_mapped: actions.every((a) => a.source_blocking_reason_present === true),
      candidate_readiness_unblocked: false
    },

    plan_semantics: {
      followup_plan_is_not_external_validation_closure: true,
      followup_plan_is_not_b2g_candidate_readiness: true,
      followup_plan_is_not_pilot_authorization: true,
      completion_artifacts_must_be_recorded_separately: true,
      readiness_reevaluation_must_be_rerun_after_artifacts: true,
      no_public_sector_production_claim_from_followup_plan: true
    },

    readiness_state: {
      validation_followup_plan_created: true,
      closure_blockers_mapped_to_actions: actions.every((a) => a.source_blocking_reason_present === true),
      external_validation_closure_gate_still_blocked: source?.gate?.gate_result === 'EXTERNAL_VALIDATION_CLOSURE_GATE_BLOCKED',
      external_validation_complete: false,
      b2g_candidate_ready: false,
      public_sector_production_ready: false,
      pilot_readiness_authorization_present: false
    },

    next_required_program: 'PROG-054-V3-5-R1-LEVEL2-PILOT-READINESS-AUTHORIZATION-SCAFFOLD',

    non_claims: {
      production_ready: false,
      b2g_candidate_ready: false,
      public_accreditation: false,
      procurement_eligibility: false,
      legal_validity: false,
      government_endorsement: false,
      public_authority_created: false,
      external_validation_complete: false,
      level2_runtime_complete: false,
      automatic_pilot_promotion: false
    }
  };

  doc.revision_hash = sha256Digest(doc);
  return doc;
}

function writeFollowupPlan(targetPath, options = {}) {
  const rootDir = options.rootDir || process.cwd();
  const doc = buildFollowupPlan({ rootDir, repositoryCommit: options.repositoryCommit });
  fs.writeFileSync(path.join(rootDir, targetPath), `${JSON.stringify(doc, null, 2)}\n`, 'utf8');
  return doc;
}

if (require.main === module) {
  const targetPath = process.argv[2] || 'docs/launch/level2/v3-5-r1/v3-5-r1-level2-validation-followup-plan.json';
  const doc = writeFollowupPlan(targetPath, { rootDir: process.cwd() });
  console.log(`PROG_053_V3_5_R1_LEVEL2_VALIDATION_FOLLOWUP_PLAN_WRITTEN=${doc.revision_hash}`);
}

module.exports = {
  REQUIRED_FOLLOWUP_ACTIONS,
  FOLLOWUP_STATUSES,
  buildActionsFromClosureGate,
  buildFollowupPlan,
  writeFollowupPlan
};
