'use strict';

const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');
const { sha256Digest } = require('../../packages/hbce-core/canonical-json.js');

const SCOPE_LOCK_STATUS = 'LEVEL1_LAUNCH_PACK_SCOPE_LOCKED_NOT_LAUNCH_READY';

const SOURCE_REF = 'docs/launch/level1/prog-066-level1-launch-refocus-gate.json';

const LOCKED_IN_SCOPE = Object.freeze([
  'LEVEL1_DECISION_PROOF_PACK',
  'DIGITAL_ACTION_EVIDENCE_CHAIN',
  'HUMAN_AUTHORITY_BINDING',
  'POLICY_EVALUATION_BINDING',
  'ACTION_REQUEST_AND_RECEIPT_TRACE',
  'AUDIT_EVENT_EXPORT',
  'CLIENT_FACING_TECHNICAL_NARRATIVE',
  'DEMO_SIGNED_OBSERVED_BOUNDARY',
  'RELEASE_BLOCKER_REGISTER'
]);

const LOCKED_OUT_OF_SCOPE = Object.freeze([
  'LEVEL2_B2G_PILOT_READY_CLAIM',
  'LEVEL2_LEGAL_VALIDITY_CLAIM',
  'LEVEL2_PROCUREMENT_ELIGIBILITY_CLAIM',
  'LEVEL3_PHYSICAL_EFFECT_CLAIM',
  'LEVEL3_LIVE_CONTROL_CLAIM',
  'LEVEL3_PILOT_READY_CLAIM',
  'SAFETY_CERTIFICATION_CLAIM',
  'PUBLIC_ACCREDITATION_CLAIM',
  'PRODUCTION_DEPLOYMENT_CLAIM',
  'AUTONOMOUS_DECISION_AUTHORITY_CLAIM'
]);

const LAUNCH_PACK_ARTIFACTS_REQUIRED = Object.freeze([
  'scope_statement',
  'decision_proof_demo_path',
  'evidence_chain_manifest',
  'authority_boundary_statement',
  'api_surface_summary',
  'test_coverage_summary',
  'release_blocker_register',
  'client_narrative',
  'non_claims_statement'
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

function buildLevel1LaunchPackScopeLock(options = {}) {
  const rootDir = options.rootDir || process.cwd();
  const repositoryCommit = options.repositoryCommit || gitHead(rootDir);
  const source = readJson(rootDir, SOURCE_REF);

  const doc = {
    proto: 'HBCE-L1-PROG-067-LAUNCH-PACK-SCOPE-LOCK-v1',
    kind: 'HBCE_LEVEL1_LAUNCH_PACK_SCOPE_LOCK',
    document_code: 'HBCE-L1-LAUNCH-PACK-SCOPE-LOCK-2027-PROG-067',
    issue_id: 'PROG-067',
    priority: 'LEVEL1-LAUNCH-PACK-SCOPE-LOCK',
    repository_baseline_commit: repositoryCommit,

    source_level1_refocus_gate_ref: SOURCE_REF,
    source_level1_refocus_gate_revision_hash: source.revision_hash,
    source_level1_refocus_gate_revision_hash_valid: validHash(source),

    scope_lock_status: SCOPE_LOCK_STATUS,

    inherited_refocus_boundary: {
      gate_result: source.gate_result,
      level1_track_status: source.level1_track_status,
      level1_is_primary_execution_track: source.refocus_decision.level1_is_primary_execution_track,
      level2_reopened: source.readiness_state.level2_reopened,
      level3_promoted_to_pilot_ready: source.readiness_state.level3_promoted_to_pilot_ready,
      new_scope_expansion_allowed: source.refocus_decision.new_scope_expansion_allowed
    },

    product_identity_lock: {
      hbce_level1_is_governance_evidence_infrastructure: true,
      hbce_level1_is_not_an_ai_system: true,
      ai_models_are_human_interface_layer: true,
      ai_models_do_not_create_authority: true,
      human_or_organizational_authority_required: true
    },

    locked_in_scope: LOCKED_IN_SCOPE,
    locked_out_of_scope: LOCKED_OUT_OF_SCOPE,
    launch_pack_artifacts_required: LAUNCH_PACK_ARTIFACTS_REQUIRED,

    launch_pack_scope_statement: {
      primary_launch_object: 'LEVEL1_DECISION_PROOF_PACK',
      primary_question: 'How can a governed digital decision or action be evidenced, bounded, attributed and audited?',
      launch_target_date: '2027-01-19',
      market_posture: 'PRE_LAUNCH_SCOPE_LOCK',
      commercial_posture: 'CLIENT_PACK_PREPARATION_NOT_COMMERCIAL_ACCEPTANCE',
      technical_posture: 'EVIDENCE_BOUND_DEMO_AND_RUNTIME_SURFACE_PREPARATION',
      release_posture: 'NOT_RELEASE_CANDIDATE'
    },

    gate_rules: {
      scope_expansion_requires_new_program: true,
      level2_reopen_requires_new_evidence_and_explicit_program: true,
      level3_pilot_promotion_requires_new_positive_gate: true,
      legal_or_certification_claim_requires_external_authority: true,
      production_claim_requires_release_candidate_gate: true,
      client_pack_claim_requires_completed_artifact_pack: true
    },

    readiness_state: {
      level1_scope_lock_created: true,
      level1_scope_lock_evaluated: true,
      level1_launch_pack_scope_locked: true,
      level1_launch_pack_artifacts_complete: false,
      decision_proof_demo_path_ready: false,
      evidence_chain_manifest_ready: false,
      api_surface_summary_ready: false,
      client_narrative_ready: false,
      release_blocker_register_ready: false,
      level1_launch_ready: false,
      level1_release_candidate_ready: false,
      level1_client_pack_ready: false,
      production_ready: false
    },

    next_required_program: 'PROG-068-HBCE-LEVEL1-DECISION-PROOF-DEMO-PATH',

    non_claims: {
      level1_launch_ready: false,
      level1_release_candidate_ready: false,
      level1_client_pack_ready: false,
      commercial_acceptance_ready: false,
      production_ready: false,
      legal_validity: false,
      public_accreditation: false,
      procurement_eligibility: false,
      government_endorsement: false,
      level2_pilot_ready: false,
      level3_pilot_ready: false,
      physical_effect_proven: false,
      live_control_ready: false,
      autonomous_authority: false
    }
  };

  doc.revision_hash = sha256Digest(doc);
  return doc;
}

function writeLevel1LaunchPackScopeLock(targetPath, options = {}) {
  const rootDir = options.rootDir || process.cwd();
  const doc = buildLevel1LaunchPackScopeLock({ rootDir, repositoryCommit: options.repositoryCommit });
  fs.writeFileSync(path.join(rootDir, targetPath), `${JSON.stringify(doc, null, 2)}\n`, 'utf8');
  return doc;
}

if (require.main === module) {
  const targetPath = process.argv[2] || 'docs/launch/level1/prog-067-level1-launch-pack-scope-lock.json';
  const doc = writeLevel1LaunchPackScopeLock(targetPath, { rootDir: process.cwd() });
  console.log(`PROG_067_LEVEL1_LAUNCH_PACK_SCOPE_LOCK_WRITTEN=${doc.revision_hash}`);
}

module.exports = {
  SCOPE_LOCK_STATUS,
  SOURCE_REF,
  LOCKED_IN_SCOPE,
  LOCKED_OUT_OF_SCOPE,
  LAUNCH_PACK_ARTIFACTS_REQUIRED,
  buildLevel1LaunchPackScopeLock,
  writeLevel1LaunchPackScopeLock
};
