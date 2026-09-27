'use strict';

const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');
const { sha256Digest } = require('../../packages/hbce-core/canonical-json.js');

const AUTHORIZATION_STATUSES = Object.freeze([
  'NOT_REQUESTED',
  'PENDING_PREREQUISITES',
  'READY_FOR_DECISION',
  'AUTHORIZED',
  'DENIED',
  'REVOKED'
]);

const REQUIRED_PREREQUISITES = Object.freeze([
  'INDEPENDENT_CLOSURE_DECISION_RECORD_COMPLETE',
  'LIMITATIONS_RESOLUTION_RECORD_COMPLETE',
  'EXTERNAL_VALIDATION_COMPLETION_RECORD_COMPLETE',
  'LEVEL2_READINESS_REEVALUATION_COMPLETE',
  'PILOT_AUTHORITY_DECISION_RECORD_COMPLETE'
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

function derivePrerequisites(source) {
  const actions = Array.isArray(source?.followup_actions) ? source.followup_actions : [];
  const byType = Object.fromEntries(actions.map((a) => [a.action_type, a]));

  return [
    {
      prerequisite_id: 'PILOT-PREQ-001',
      prerequisite_type: 'INDEPENDENT_CLOSURE_DECISION_RECORD_COMPLETE',
      source_action_id: byType.INDEPENDENT_CLOSURE_DECISION_RECORD?.action_id || null,
      source_status: byType.INDEPENDENT_CLOSURE_DECISION_RECORD?.status || 'MISSING',
      satisfied: byType.INDEPENDENT_CLOSURE_DECISION_RECORD?.status === 'COMPLETE'
    },
    {
      prerequisite_id: 'PILOT-PREQ-002',
      prerequisite_type: 'LIMITATIONS_RESOLUTION_RECORD_COMPLETE',
      source_action_id: byType.LIMITATIONS_RESOLUTION_RECORD?.action_id || null,
      source_status: byType.LIMITATIONS_RESOLUTION_RECORD?.status || 'MISSING',
      satisfied: byType.LIMITATIONS_RESOLUTION_RECORD?.status === 'COMPLETE'
    },
    {
      prerequisite_id: 'PILOT-PREQ-003',
      prerequisite_type: 'EXTERNAL_VALIDATION_COMPLETION_RECORD_COMPLETE',
      source_action_id: byType.EXTERNAL_VALIDATION_COMPLETION_RECORD?.action_id || null,
      source_status: byType.EXTERNAL_VALIDATION_COMPLETION_RECORD?.status || 'MISSING',
      satisfied: byType.EXTERNAL_VALIDATION_COMPLETION_RECORD?.status === 'COMPLETE'
    },
    {
      prerequisite_id: 'PILOT-PREQ-004',
      prerequisite_type: 'LEVEL2_READINESS_REEVALUATION_COMPLETE',
      source_action_id: byType.LEVEL2_READINESS_REEVALUATION?.action_id || null,
      source_status: byType.LEVEL2_READINESS_REEVALUATION?.status || 'MISSING',
      satisfied: byType.LEVEL2_READINESS_REEVALUATION?.status === 'COMPLETE'
    },
    {
      prerequisite_id: 'PILOT-PREQ-005',
      prerequisite_type: 'PILOT_AUTHORITY_DECISION_RECORD_COMPLETE',
      source_action_id: null,
      source_status: 'MISSING',
      satisfied: false
    }
  ];
}

function evaluateAuthorization(source) {
  const prerequisites = derivePrerequisites(source);
  const blockers = [];

  if (!validHash(source)) blockers.push('SOURCE_FOLLOWUP_PLAN_REVISION_HASH_INVALID');
  if (source?.issue_id !== 'PROG-053') blockers.push('SOURCE_FOLLOWUP_PLAN_ISSUE_MISMATCH');
  if (source?.readiness_state?.external_validation_closure_gate_still_blocked !== true) blockers.push('CLOSURE_GATE_BLOCKED_STATE_NOT_CONFIRMED');
  if (source?.followup_summary?.complete_action_count !== source?.followup_summary?.action_count) blockers.push('FOLLOWUP_ACTIONS_NOT_COMPLETE');
  if (source?.readiness_state?.external_validation_complete !== true) blockers.push('EXTERNAL_VALIDATION_NOT_COMPLETE');
  if (source?.readiness_state?.b2g_candidate_ready !== true) blockers.push('B2G_CANDIDATE_NOT_READY');
  if (source?.readiness_state?.pilot_readiness_authorization_present !== true) blockers.push('PILOT_READINESS_AUTHORIZATION_NOT_PRESENT_IN_SOURCE');

  for (const prerequisite of prerequisites) {
    if (prerequisite.satisfied !== true) blockers.push(`${prerequisite.prerequisite_type}_MISSING`);
  }

  return {
    authorization_status: blockers.length === 0 ? 'READY_FOR_DECISION' : 'PENDING_PREREQUISITES',
    authorization_permitted: false,
    authorization_may_be_evaluated: blockers.length === 0,
    prerequisites,
    blocking_reasons: blockers,
    external_validation_complete: false,
    b2g_candidate_ready: false,
    public_sector_production_ready: false,
    pilot_authorized: false
  };
}

function buildPilotReadinessAuthorizationScaffold(options = {}) {
  const rootDir = options.rootDir || process.cwd();
  const repositoryCommit = options.repositoryCommit || gitHead(rootDir);
  const sourcePath = 'docs/launch/level2/v3-5-r1/v3-5-r1-level2-validation-followup-plan.json';
  const source = readJson(rootDir, sourcePath);
  const evaluation = evaluateAuthorization(source);

  const doc = {
    proto: 'HBCE-B2G-L2-JC2-V3-5-R1-LEVEL2-PILOT-READINESS-AUTHORIZATION-SCAFFOLD-v1',
    kind: 'HBCE_B2G_LEVEL2_JOKER_C2_V3_5_R1_LEVEL2_PILOT_READINESS_AUTHORIZATION_SCAFFOLD',
    document_code: 'HBCE-B2G-L2-JC2-PROG-2027-0001',
    specification_baseline: 'V3.5-R1 - Forensic Evidence & Verifier Qualification Hardening - 26 September 2026',
    issue_id: 'PROG-054',
    priority: 'V3.5-R1-LEVEL2-PILOT-READINESS-AUTHORIZATION-SCAFFOLD',
    repository_baseline_commit: repositoryCommit,

    source_validation_followup_plan_ref: sourcePath,
    source_validation_followup_plan_revision_hash: source.revision_hash,
    source_validation_followup_plan_revision_hash_valid: validHash(source),

    allowed_authorization_statuses: AUTHORIZATION_STATUSES,
    required_prerequisites: REQUIRED_PREREQUISITES,

    authorization_scaffold: {
      subject: 'JOKER-C2 B2G Level 2 controlled pilot readiness authorization',
      status: evaluation.authorization_status,
      authorization_permitted: evaluation.authorization_permitted,
      authorization_may_be_evaluated: evaluation.authorization_may_be_evaluated,
      required_authority_record: 'pilot_authority_decision_record',
      required_scope_binding: 'B2G_LEVEL2_JOKER_C2_V3_5_R1_CONTROLLED_PILOT',
      required_evidence_refs: [
        'independent_closure_decision_record',
        'limitations_resolution_record',
        'external_validation_completion_record',
        'level2_readiness_reevaluation_record',
        'pilot_authority_decision_record'
      ]
    },

    evaluation,

    authorization_semantics: {
      scaffold_is_not_authorization: true,
      authorization_requires_all_prerequisites_satisfied: true,
      pilot_authorization_does_not_create_public_accreditation: true,
      pilot_authorization_does_not_create_procurement_eligibility: true,
      pilot_authorization_does_not_create_legal_validity: true,
      pilot_authorization_does_not_create_government_endorsement: true,
      production_readiness_requires_separate_gate: true,
      no_automatic_b2g_candidate_promotion: true
    },

    readiness_state: {
      pilot_readiness_authorization_scaffold_created: true,
      pilot_readiness_authorization_evaluated: true,
      pilot_readiness_authorization_status: evaluation.authorization_status,
      pilot_readiness_authorization_permitted: false,
      all_prerequisites_satisfied: evaluation.prerequisites.every((p) => p.satisfied === true),
      external_validation_complete: false,
      b2g_candidate_ready: false,
      public_sector_production_ready: false,
      pilot_authorized: false
    },

    next_required_program: 'PROG-055-V3-5-R1-LEVEL2-PILOT-READINESS-GATE',

    non_claims: {
      production_ready: false,
      b2g_candidate_ready: false,
      public_accreditation: false,
      procurement_eligibility: false,
      legal_validity: false,
      government_endorsement: false,
      public_authority_created: false,
      external_validation_complete: false,
      pilot_authorized: false,
      level2_runtime_complete: false,
      automatic_pilot_promotion: false
    }
  };

  doc.revision_hash = sha256Digest(doc);
  return doc;
}

function writePilotReadinessAuthorizationScaffold(targetPath, options = {}) {
  const rootDir = options.rootDir || process.cwd();
  const doc = buildPilotReadinessAuthorizationScaffold({ rootDir, repositoryCommit: options.repositoryCommit });
  fs.writeFileSync(path.join(rootDir, targetPath), `${JSON.stringify(doc, null, 2)}\n`, 'utf8');
  return doc;
}

if (require.main === module) {
  const targetPath = process.argv[2] || 'docs/launch/level2/v3-5-r1/v3-5-r1-level2-pilot-readiness-authorization-scaffold.json';
  const doc = writePilotReadinessAuthorizationScaffold(targetPath, { rootDir: process.cwd() });
  console.log(`PROG_054_V3_5_R1_LEVEL2_PILOT_READINESS_AUTHORIZATION_SCAFFOLD_WRITTEN=${doc.revision_hash}`);
}

module.exports = {
  AUTHORIZATION_STATUSES,
  REQUIRED_PREREQUISITES,
  derivePrerequisites,
  evaluateAuthorization,
  buildPilotReadinessAuthorizationScaffold,
  writePilotReadinessAuthorizationScaffold
};
