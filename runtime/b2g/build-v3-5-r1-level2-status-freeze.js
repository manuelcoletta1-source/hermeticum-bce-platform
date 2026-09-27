'use strict';

const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');
const { sha256Digest } = require('../../packages/hbce-core/canonical-json.js');

const FREEZE_STATUS = 'LEVEL2_STATUS_FROZEN_BLOCKED_NOT_PILOT_READY';

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

function deriveFreeze(source) {
  const gate = source?.gate || {};
  const readiness = source?.readiness_state || {};
  const blockingReasons = Array.isArray(gate.blocking_reasons) ? gate.blocking_reasons : [];

  return {
    freeze_status: FREEZE_STATUS,
    source_gate_result: gate.gate_result || 'UNKNOWN',
    source_gate_blocked: gate.gate_result === 'LEVEL2_PILOT_READINESS_GATE_BLOCKED',
    source_revision_hash_valid: validHash(source),
    source_issue_is_prog_055: source?.issue_id === 'PROG-055',
    blocking_reasons_preserved: blockingReasons,
    closure: {
      external_validation_complete: readiness.external_validation_complete === true,
      b2g_candidate_ready: readiness.b2g_candidate_ready === true,
      public_sector_production_ready: readiness.public_sector_production_ready === true,
      pilot_authorized: readiness.pilot_authorized === true,
      pilot_readiness_gate_result: readiness.level2_pilot_readiness_gate_result || 'UNKNOWN'
    },
    may_resume_only_with: [
      'completed_followup_artifacts',
      'external_validation_completion_record',
      'pilot_authority_decision_record',
      'level2_readiness_reevaluation',
      'new_explicit_program_trigger'
    ]
  };
}

function buildStatusFreeze(options = {}) {
  const rootDir = options.rootDir || process.cwd();
  const repositoryCommit = options.repositoryCommit || gitHead(rootDir);
  const sourcePath = 'docs/launch/level2/v3-5-r1/v3-5-r1-level2-pilot-readiness-gate.json';
  const source = readJson(rootDir, sourcePath);
  const freeze = deriveFreeze(source);

  const doc = {
    proto: 'HBCE-B2G-L2-JC2-V3-5-R1-LEVEL2-STATUS-FREEZE-v1',
    kind: 'HBCE_B2G_LEVEL2_JOKER_C2_V3_5_R1_LEVEL2_STATUS_FREEZE',
    document_code: 'HBCE-B2G-L2-JC2-PROG-2027-0001',
    specification_baseline: 'V3.5-R1 - Forensic Evidence & Verifier Qualification Hardening - 26 September 2026',
    issue_id: 'PROG-056',
    priority: 'V3.5-R1-LEVEL2-STATUS-FREEZE',
    repository_baseline_commit: repositoryCommit,

    source_level2_pilot_readiness_gate_ref: sourcePath,
    source_level2_pilot_readiness_gate_revision_hash: source.revision_hash,
    source_level2_pilot_readiness_gate_revision_hash_valid: validHash(source),

    freeze,

    frozen_scope: {
      track: 'JOKER_C2_B2G_LEVEL2',
      baseline: 'V3.5-R1',
      frozen_status: FREEZE_STATUS,
      frozen_from_gate: 'PROG-055-V3-5-R1-LEVEL2-PILOT-READINESS-GATE',
      frozen_reason: 'pilot_readiness_gate_blocked',
      scope_includes: [
        'external_validation_results_ingestion',
        'external_validation_closure_gate',
        'validation_followup_plan',
        'pilot_readiness_authorization_scaffold',
        'pilot_readiness_gate'
      ]
    },

    preserved_findings: {
      gate_blocked: true,
      external_validation_not_complete: true,
      b2g_candidate_not_ready: true,
      pilot_not_authorized: true,
      production_not_ready: true,
      public_accreditation_not_claimed: true,
      procurement_eligibility_not_claimed: true,
      legal_validity_not_claimed: true,
      government_endorsement_not_claimed: true
    },

    freeze_semantics: {
      status_freeze_is_not_completion: true,
      status_freeze_is_not_failure_of_research_track: true,
      status_freeze_is_not_b2g_candidate_readiness: true,
      status_freeze_is_not_pilot_authorization: true,
      status_freeze_is_not_production_readiness: true,
      status_freeze_prevents_untracked_promotion: true,
      reopening_requires_explicit_new_program_and_evidence_trigger: true
    },

    readiness_state: {
      level2_status_freeze_created: true,
      level2_status_freeze_evaluated: true,
      level2_frozen_status: FREEZE_STATUS,
      level2_pilot_readiness_gate_blocked: true,
      external_validation_complete: false,
      b2g_candidate_ready: false,
      public_sector_production_ready: false,
      pilot_authorized: false,
      level2_track_closed_for_untracked_promotion: true
    },

    terminal_or_reopen_rule: {
      terminal_for_current_v3_5_r1_sequence: true,
      may_reopen_without_new_evidence: false,
      may_reopen_without_explicit_program: false,
      required_reopen_trigger: 'NEW_EVIDENCE_AND_EXPLICIT_PROGRAM_TRIGGER',
      next_program: 'NO_NEW_LEVEL2_PROGRAM_WITHOUT_EVIDENCE_TRIGGER'
    },

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

function writeStatusFreeze(targetPath, options = {}) {
  const rootDir = options.rootDir || process.cwd();
  const doc = buildStatusFreeze({ rootDir, repositoryCommit: options.repositoryCommit });
  fs.writeFileSync(path.join(rootDir, targetPath), `${JSON.stringify(doc, null, 2)}\n`, 'utf8');
  return doc;
}

if (require.main === module) {
  const targetPath = process.argv[2] || 'docs/launch/level2/v3-5-r1/v3-5-r1-level2-status-freeze.json';
  const doc = writeStatusFreeze(targetPath, { rootDir: process.cwd() });
  console.log(`PROG_056_V3_5_R1_LEVEL2_STATUS_FREEZE_WRITTEN=${doc.revision_hash}`);
}

module.exports = {
  FREEZE_STATUS,
  deriveFreeze,
  buildStatusFreeze,
  writeStatusFreeze
};
