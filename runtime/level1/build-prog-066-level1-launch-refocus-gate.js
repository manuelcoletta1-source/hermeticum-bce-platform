'use strict';

const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');
const { sha256Digest } = require('../../packages/hbce-core/canonical-json.js');

const GATE_RESULT = 'LEVEL1_LAUNCH_REFOCUS_GATE_OPEN';
const LEVEL1_STATUS = 'LEVEL1_PRIMARY_LAUNCH_TRACK_REFOCUSED_NOT_LAUNCH_READY';

const SOURCE_REFS = Object.freeze({
  tri_level_map: 'docs/launch/portfolio/prog-057-tri-level-launch-readiness-map.json',
  level2_freeze: 'docs/launch/level2/v3-5-r1/v3-5-r1-level2-status-freeze.json',
  level3_c1_snapshot: 'docs/launch/level3/v0-1-c1/prog-065-level3-c1-readiness-snapshot.json'
});

const REQUIRED_LEVEL1_WORKSTREAMS = Object.freeze([
  'LEVEL1_LAUNCH_PACK_SCOPE_LOCK',
  'LEVEL1_DECISION_PROOF_DEMO_PATH',
  'LEVEL1_EVIDENCE_API_SURFACE_REVIEW',
  'LEVEL1_CLIENT_FACING_NARRATIVE',
  'LEVEL1_TEST_COVERAGE_CONSOLIDATION',
  'LEVEL1_RELEASE_BLOCKER_REGISTER'
]);

const BLOCKED_DISTRACTIONS = Object.freeze([
  'LEVEL2_PILOT_PROMOTION_WITHOUT_NEW_EVIDENCE',
  'LEVEL3_PILOT_READY_PROMOTION_WITHOUT_POSITIVE_GATE',
  'PHYSICAL_EFFECT_CLAIM',
  'LIVE_CONTROL_CLAIM',
  'PUBLIC_ACCREDITATION_CLAIM',
  'LEGAL_VALIDITY_CLAIM',
  'PROCUREMENT_ELIGIBILITY_CLAIM'
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

function buildLevel1LaunchRefocusGate(options = {}) {
  const rootDir = options.rootDir || process.cwd();
  const repositoryCommit = options.repositoryCommit || gitHead(rootDir);

  const triLevel = readJson(rootDir, SOURCE_REFS.tri_level_map);
  const level2 = readJson(rootDir, SOURCE_REFS.level2_freeze);
  const level3 = readJson(rootDir, SOURCE_REFS.level3_c1_snapshot);

  const sources = [
    { name: 'tri_level_map', ref: SOURCE_REFS.tri_level_map, issue_id: triLevel.issue_id, revision_hash: triLevel.revision_hash, revision_hash_valid: validHash(triLevel) },
    { name: 'level2_freeze', ref: SOURCE_REFS.level2_freeze, issue_id: level2.issue_id, revision_hash: level2.revision_hash, revision_hash_valid: validHash(level2) },
    { name: 'level3_c1_snapshot', ref: SOURCE_REFS.level3_c1_snapshot, issue_id: level3.issue_id, revision_hash: level3.revision_hash, revision_hash_valid: validHash(level3) }
  ];

  const doc = {
    proto: 'HBCE-L1-PROG-066-LAUNCH-REFOCUS-GATE-v1',
    kind: 'HBCE_LEVEL1_LAUNCH_REFOCUS_GATE',
    document_code: 'HBCE-L1-LAUNCH-REFOCUS-GATE-2027-PROG-066',
    issue_id: 'PROG-066',
    priority: 'LEVEL1-LAUNCH-REFOCUS-GATE',
    repository_baseline_commit: repositoryCommit,

    gate_result: GATE_RESULT,
    level1_track_status: LEVEL1_STATUS,
    source_inventory: sources,
    source_artifact_hashes_valid: sources.every((source) => source.revision_hash_valid === true),

    inherited_portfolio_boundary: {
      level1_role: 'PRIMARY_LAUNCH_PRODUCT',
      level2_role: 'FROZEN_EVIDENCE_BOUND_TRACK',
      level3_role: 'PILOT_INTAKE_SHADOW_TRACK',
      ai_models_are_interfaces_not_authority: true,
      hbce_is_governance_evidence_infrastructure_not_ai_system: true
    },

    inherited_level2_boundary: {
      level2_frozen: true,
      level2_not_pilot_ready: true,
      level2_no_b2g_readiness_claim: true,
      level2_reopen_requires_new_evidence_and_explicit_program: true
    },

    inherited_level3_boundary: {
      level3_c1_conclusion: level3.operational_conclusion.conclusion,
      level3_intake_ready: level3.readiness_state.intake_ready,
      level3_maximum_scope: level3.c1_scope_boundary.maximum_current_operational_scope,
      level3_pilot_ready: level3.readiness_state.level3_pilot_ready,
      level3_physical_effect_proven: level3.readiness_state.physical_effect_proven,
      level3_live_control_ready: level3.readiness_state.live_effect_claim_allowed,
      level3_physical_actuation_permitted: level3.readiness_state.physical_actuation_permitted
    },

    refocus_decision: {
      decision: 'REFOCUS_ON_LEVEL1_LAUNCH_PACK',
      reason: 'Level 2 is frozen and Level 3 C1 is closed as intake-ready but not pilot-ready.',
      level1_is_primary_execution_track: true,
      level2_work_is_blocked_without_new_evidence_trigger: true,
      level3_work_is_blocked_from_pilot_promotion_without_new_positive_gate: true,
      new_scope_expansion_allowed: false
    },

    required_level1_workstreams: REQUIRED_LEVEL1_WORKSTREAMS,
    blocked_distractions: BLOCKED_DISTRACTIONS,

    readiness_state: {
      level1_refocus_gate_created: true,
      level1_refocus_gate_evaluated: true,
      level1_launch_track_refocused: true,
      level1_launch_ready: false,
      level1_release_candidate_ready: false,
      level1_client_pack_ready: false,
      level2_reopened: false,
      level3_promoted_to_pilot_ready: false,
      physical_effect_claim_allowed: false,
      live_control_claim_allowed: false,
      production_ready: false
    },

    next_required_program: 'PROG-067-HBCE-LEVEL1-LAUNCH-PACK-SCOPE-LOCK',

    non_claims: {
      level1_launch_ready: false,
      level1_release_candidate_ready: false,
      level1_client_pack_ready: false,
      level2_pilot_ready: false,
      level2_b2g_ready: false,
      level3_pilot_ready: false,
      level3_physical_deployment_ready: false,
      physical_effect_proven: false,
      live_control_ready: false,
      production_ready: false,
      public_accreditation: false,
      procurement_eligibility: false,
      legal_validity: false,
      government_endorsement: false
    }
  };

  doc.revision_hash = sha256Digest(doc);
  return doc;
}

function writeLevel1LaunchRefocusGate(targetPath, options = {}) {
  const rootDir = options.rootDir || process.cwd();
  const doc = buildLevel1LaunchRefocusGate({ rootDir, repositoryCommit: options.repositoryCommit });
  fs.writeFileSync(path.join(rootDir, targetPath), `${JSON.stringify(doc, null, 2)}\n`, 'utf8');
  return doc;
}

if (require.main === module) {
  const targetPath = process.argv[2] || 'docs/launch/level1/prog-066-level1-launch-refocus-gate.json';
  const doc = writeLevel1LaunchRefocusGate(targetPath, { rootDir: process.cwd() });
  console.log(`PROG_066_LEVEL1_LAUNCH_REFOCUS_GATE_WRITTEN=${doc.revision_hash}`);
}

module.exports = {
  GATE_RESULT,
  LEVEL1_STATUS,
  SOURCE_REFS,
  REQUIRED_LEVEL1_WORKSTREAMS,
  BLOCKED_DISTRACTIONS,
  buildLevel1LaunchRefocusGate,
  writeLevel1LaunchRefocusGate
};
