'use strict';

const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');
const { sha256Digest } = require('../../packages/hbce-core/canonical-json.js');

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

function evaluatePilotReadiness(source) {
  const scaffold = source?.authorization_scaffold || {};
  const state = source?.readiness_state || {};
  const evaluation = source?.evaluation || {};
  const prerequisites = Array.isArray(evaluation.prerequisites) ? evaluation.prerequisites : [];
  const allPrerequisitesSatisfied = prerequisites.length > 0 && prerequisites.every((p) => p.satisfied === true);

  const conditions = {
    source_revision_hash_valid: validHash(source),
    source_issue_is_prog_054: source?.issue_id === 'PROG-054',
    scaffold_created: state.pilot_readiness_authorization_scaffold_created === true,
    scaffold_status_pending_prerequisites: scaffold.status === 'PENDING_PREREQUISITES',
    authorization_permitted: scaffold.authorization_permitted === true,
    authorization_may_be_evaluated: scaffold.authorization_may_be_evaluated === true,
    all_prerequisites_satisfied: allPrerequisitesSatisfied,
    external_validation_complete: state.external_validation_complete === true,
    b2g_candidate_ready: state.b2g_candidate_ready === true,
    public_sector_production_ready: state.public_sector_production_ready === true,
    pilot_authorized: state.pilot_authorized === true,
    source_non_claims_block_pilot_authorized: source?.non_claims?.pilot_authorized === false,
    source_non_claims_block_b2g_candidate: source?.non_claims?.b2g_candidate_ready === false,
    source_non_claims_block_production: source?.non_claims?.production_ready === false
  };

  const blockingReasons = [];

  if (!conditions.source_revision_hash_valid) blockingReasons.push('SOURCE_AUTHORIZATION_SCAFFOLD_REVISION_HASH_INVALID');
  if (!conditions.source_issue_is_prog_054) blockingReasons.push('SOURCE_AUTHORIZATION_SCAFFOLD_ISSUE_MISMATCH');
  if (!conditions.scaffold_created) blockingReasons.push('PILOT_AUTHORIZATION_SCAFFOLD_MISSING');
  if (conditions.scaffold_status_pending_prerequisites) blockingReasons.push('PILOT_AUTHORIZATION_PENDING_PREREQUISITES');
  if (!conditions.authorization_permitted) blockingReasons.push('PILOT_AUTHORIZATION_NOT_PERMITTED');
  if (!conditions.authorization_may_be_evaluated) blockingReasons.push('PILOT_AUTHORIZATION_NOT_READY_FOR_DECISION');
  if (!conditions.all_prerequisites_satisfied) blockingReasons.push('PILOT_PREREQUISITES_NOT_SATISFIED');
  if (!conditions.external_validation_complete) blockingReasons.push('EXTERNAL_VALIDATION_NOT_COMPLETE');
  if (!conditions.b2g_candidate_ready) blockingReasons.push('B2G_CANDIDATE_NOT_READY');
  if (!conditions.pilot_authorized) blockingReasons.push('PILOT_NOT_AUTHORIZED');
  if (!conditions.public_sector_production_ready) blockingReasons.push('PUBLIC_SECTOR_PRODUCTION_NOT_READY');
  if (conditions.source_non_claims_block_pilot_authorized) blockingReasons.push('PILOT_AUTHORIZATION_CLAIM_BLOCKED_BY_SOURCE');
  if (conditions.source_non_claims_block_b2g_candidate) blockingReasons.push('B2G_CANDIDATE_CLAIM_BLOCKED_BY_SOURCE');
  if (conditions.source_non_claims_block_production) blockingReasons.push('PRODUCTION_CLAIM_BLOCKED_BY_SOURCE');

  return {
    gate_result: blockingReasons.length === 0 ? 'LEVEL2_PILOT_READINESS_GATE_PASSED' : 'LEVEL2_PILOT_READINESS_GATE_BLOCKED',
    conditions,
    blocking_reasons: blockingReasons,
    external_validation_complete: false,
    b2g_candidate_ready: false,
    public_sector_production_ready: false,
    pilot_authorized: false,
    automatic_pilot_promotion: false
  };
}

function buildPilotReadinessGate(options = {}) {
  const rootDir = options.rootDir || process.cwd();
  const repositoryCommit = options.repositoryCommit || gitHead(rootDir);
  const sourcePath = 'docs/launch/level2/v3-5-r1/v3-5-r1-level2-pilot-readiness-authorization-scaffold.json';
  const source = readJson(rootDir, sourcePath);
  const gate = evaluatePilotReadiness(source);

  const doc = {
    proto: 'HBCE-B2G-L2-JC2-V3-5-R1-LEVEL2-PILOT-READINESS-GATE-v1',
    kind: 'HBCE_B2G_LEVEL2_JOKER_C2_V3_5_R1_LEVEL2_PILOT_READINESS_GATE',
    document_code: 'HBCE-B2G-L2-JC2-PROG-2027-0001',
    specification_baseline: 'V3.5-R1 - Forensic Evidence & Verifier Qualification Hardening - 26 September 2026',
    issue_id: 'PROG-055',
    priority: 'V3.5-R1-LEVEL2-PILOT-READINESS-GATE',
    repository_baseline_commit: repositoryCommit,

    source_pilot_readiness_authorization_scaffold_ref: sourcePath,
    source_pilot_readiness_authorization_scaffold_revision_hash: source.revision_hash,
    source_pilot_readiness_authorization_scaffold_revision_hash_valid: validHash(source),

    evaluated_source_state: {
      source_issue_id: source.issue_id,
      source_priority: source.priority,
      source_authorization_status: source?.authorization_scaffold?.status || 'UNKNOWN',
      source_authorization_permitted: source?.authorization_scaffold?.authorization_permitted === true,
      source_authorization_may_be_evaluated: source?.authorization_scaffold?.authorization_may_be_evaluated === true,
      source_readiness_state: source.readiness_state,
      source_non_claims: source.non_claims
    },

    gate,

    gate_semantics: {
      pilot_readiness_gate_requires_authorization_permitted: true,
      pilot_readiness_gate_requires_all_prerequisites_satisfied: true,
      pilot_readiness_gate_requires_external_validation_complete: true,
      pilot_readiness_gate_requires_b2g_candidate_ready: true,
      pilot_readiness_gate_requires_pilot_authorized: true,
      pilot_readiness_gate_does_not_create_public_accreditation: true,
      pilot_readiness_gate_does_not_create_procurement_eligibility: true,
      pilot_readiness_gate_does_not_create_legal_validity: true,
      pilot_readiness_gate_does_not_create_government_endorsement: true,
      production_readiness_requires_separate_gate: true
    },

    readiness_state: {
      level2_pilot_readiness_gate_created: true,
      level2_pilot_readiness_gate_evaluated: true,
      level2_pilot_readiness_gate_result: gate.gate_result,
      pilot_readiness_authorization_scaffold_present: gate.conditions.scaffold_created === true,
      pilot_readiness_authorization_status: source?.authorization_scaffold?.status || 'UNKNOWN',
      pilot_readiness_authorization_permitted: false,
      external_validation_complete: false,
      b2g_candidate_ready: false,
      public_sector_production_ready: false,
      pilot_authorized: false
    },

    next_required_program: 'PROG-056-V3-5-R1-LEVEL2-STATUS-FREEZE',

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

function writePilotReadinessGate(targetPath, options = {}) {
  const rootDir = options.rootDir || process.cwd();
  const doc = buildPilotReadinessGate({ rootDir, repositoryCommit: options.repositoryCommit });
  fs.writeFileSync(path.join(rootDir, targetPath), `${JSON.stringify(doc, null, 2)}\n`, 'utf8');
  return doc;
}

if (require.main === module) {
  const targetPath = process.argv[2] || 'docs/launch/level2/v3-5-r1/v3-5-r1-level2-pilot-readiness-gate.json';
  const doc = writePilotReadinessGate(targetPath, { rootDir: process.cwd() });
  console.log(`PROG_055_V3_5_R1_LEVEL2_PILOT_READINESS_GATE_WRITTEN=${doc.revision_hash}`);
}

module.exports = {
  evaluatePilotReadiness,
  buildPilotReadinessGate,
  writePilotReadinessGate
};
