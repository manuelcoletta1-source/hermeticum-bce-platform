'use strict';

const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');
const { sha256Digest } = require('../../packages/hbce-core/canonical-json.js');

const STATUS = 'LEVEL1_VERIFIER_REPLAY_RESULT_DEFINED_NOT_READY';
const SOURCE_REF = 'docs/launch/level1/prog-075-evidence-export-manifest.json';

const REPLAY_RESULTS = Object.freeze([
  'PASS',
  'FAIL',
  'UNKNOWN',
  'NOT_RUN'
]);

const REQUIRED_FIELDS = Object.freeze([
  'verifier_replay_id',
  'verifier_ref',
  'verifier_version',
  'replay_input_ref',
  'replay_input_digest',
  'evidence_export_manifest_ref',
  'evidence_export_manifest_digest',
  'canonicalization_profile',
  'digest_algorithm',
  'replay_started_at',
  'replay_completed_at',
  'replay_result',
  'replay_codes',
  'replayed_chain_nodes',
  'recomputed_digests',
  'mismatch_report',
  'evidence_chain_ref',
  'non_claims'
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

function buildVerifierReplayResult(options = {}) {
  const rootDir = options.rootDir || process.cwd();
  const source = readJson(rootDir, SOURCE_REF);

  const doc = {
    proto: 'HBCE-L1-PROG-076-VERIFIER-REPLAY-RESULT-v1',
    kind: 'HBCE_LEVEL1_VERIFIER_REPLAY_RESULT',
    document_code: 'HBCE-L1-VERIFIER-REPLAY-RESULT-2027-PROG-076',
    issue_id: 'PROG-076',
    priority: 'LEVEL1-VERIFIER-REPLAY-RESULT',
    repository_baseline_commit: options.repositoryCommit || gitHead(rootDir),

    source_evidence_export_manifest_ref: SOURCE_REF,
    source_evidence_export_manifest_revision_hash: source.revision_hash,
    source_evidence_export_manifest_revision_hash_valid: validHash(source),

    verifier_replay_result_status: STATUS,

    inherited_export_boundary: {
      evidence_export_manifest_status: source.evidence_export_manifest_status,
      evidence_export_manifest_ready: source.readiness_state.evidence_export_manifest_ready,
      export_manifest_is_not_verifier_replay_result: source.evidence_export_manifest.export_manifest_is_not_verifier_replay_result,
      export_manifest_is_not_effect_proof: source.evidence_export_manifest.export_manifest_is_not_effect_proof,
      export_manifest_is_not_legal_validity: source.evidence_export_manifest.export_manifest_is_not_legal_validity,
      ai_model_export_authority_allowed: source.evidence_export_manifest.ai_model_export_authority_allowed
    },

    verifier_replay_result: {
      purpose: 'Define the Level 1 verifier replay result required after evidence export to evaluate whether the exported Decision Proof chain can be recomputed.',
      required_fields: REQUIRED_FIELDS,
      replay_results_allowed: REPLAY_RESULTS,
      replay_input_ref_required: true,
      replay_input_digest_required: true,
      evidence_export_manifest_ref_required: true,
      evidence_export_manifest_digest_required: true,
      canonicalization_profile_required: true,
      digest_algorithm_required: true,
      replayed_chain_nodes_required: true,
      recomputed_digests_required: true,
      mismatch_report_required: true,
      pass_requires_all_chain_nodes_present: true,
      pass_requires_all_digest_matches: true,
      pass_requires_ordered_chain_replay: true,
      fail_dominates_unknown_and_pass: true,
      unknown_dominates_pass: true,
      not_run_blocks_pass_claim: true,
      verifier_replay_result_is_not_effect_proof: true,
      verifier_replay_result_is_not_business_success: true,
      verifier_replay_result_is_not_legal_validity: true,
      verifier_replay_result_is_not_production_readiness: true,
      ai_model_verifier_authority_allowed: false,
      missing_replay_input_fails_closed: true,
      missing_export_manifest_fails_closed: true,
      missing_recomputed_digest_fails_closed: true,
      digest_mismatch_fails_closed: true,
      chain_order_mismatch_fails_closed: true,
      broken_replay_fails_closed: true
    },

    minimal_record_template: {
      verifier_replay_id: 'VERIFIER-REPLAY-TEMPLATE-0001',
      verifier_ref: 'VERIFIER::TO_BE_BOUND',
      verifier_version: 'TO_BE_BOUND',
      replay_input_ref: 'VERIFIER-REPLAY-INPUT::TO_BE_BOUND',
      replay_input_digest: 'sha256:TO_BE_BOUND',
      evidence_export_manifest_ref: 'PROG-075-HBCE-LEVEL1-EVIDENCE-EXPORT-MANIFEST',
      evidence_export_manifest_digest: 'sha256:TO_BE_BOUND',
      canonicalization_profile: 'RFC8785-JCS',
      digest_algorithm: 'SHA-256',
      replay_started_at: 'TO_BE_BOUND',
      replay_completed_at: 'TO_BE_BOUND',
      replay_result: 'NOT_RUN',
      replay_codes: ['VERIFIER_REPLAY_NOT_EXECUTED'],
      replayed_chain_nodes: [],
      recomputed_digests: [],
      mismatch_report: {
        mismatch_detected: 'UNKNOWN',
        mismatch_count: 'TO_BE_BOUND',
        mismatch_refs: []
      },
      evidence_chain_ref: 'PROG-069-HBCE-LEVEL1-EVIDENCE-CHAIN-MANIFEST',
      non_claims: {
        replay_passed: false,
        effect_proven: false,
        business_success: false,
        legal_validity: false,
        ai_authority: false,
        autonomous_authority: false,
        production_ready: false
      }
    },

    fail_closed_codes: [
      'VERIFIER_REPLAY_RESULT_MISSING',
      'REPLAY_INPUT_REF_MISSING',
      'REPLAY_INPUT_DIGEST_MISSING',
      'EVIDENCE_EXPORT_MANIFEST_REF_MISSING',
      'EVIDENCE_EXPORT_MANIFEST_DIGEST_MISSING',
      'CANONICALIZATION_PROFILE_MISSING',
      'DIGEST_ALGORITHM_MISSING',
      'REPLAYED_CHAIN_NODES_MISSING',
      'RECOMPUTED_DIGESTS_MISSING',
      'DIGEST_MISMATCH',
      'CHAIN_ORDER_MISMATCH',
      'REPLAY_RESULT_NOT_RUN',
      'REPLAY_RESULT_UNKNOWN',
      'BROKEN_VERIFIER_REPLAY',
      'AI_VERIFIER_AUTHORITY_CLAIM_BLOCKED'
    ],

    readiness_state: {
      verifier_replay_result_defined: true,
      verifier_replay_result_ready: false,
      verifier_replay_executed: false,
      verifier_replay_passed: false,
      replay_input_digest_bound: false,
      evidence_export_manifest_digest_bound: false,
      recomputed_digests_bound: false,
      mismatch_report_bound: false,
      evidence_chain_node_complete: false,
      decision_proof_demo_ready: false,
      decision_proof_chain_complete: false,
      level1_launch_ready: false,
      level1_client_pack_ready: false,
      production_ready: false
    },

    next_required_program: 'PROG-077-HBCE-LEVEL1-DECISION-PROOF-CHAIN-CLOSURE-GATE',

    non_claims: {
      verifier_replay_completed: false,
      verifier_replay_passed: false,
      decision_proof_chain_complete: false,
      decision_proof_demo_ready: false,
      effect_proven: false,
      business_success: false,
      legal_validity: false,
      public_accreditation: false,
      procurement_eligibility: false,
      ai_authority: false,
      autonomous_authority: false,
      level1_launch_ready: false,
      level1_client_pack_ready: false,
      production_ready: false
    }
  };

  doc.revision_hash = sha256Digest(doc);
  return doc;
}

function writeVerifierReplayResult(targetPath, options = {}) {
  const rootDir = options.rootDir || process.cwd();
  const doc = buildVerifierReplayResult({ rootDir, repositoryCommit: options.repositoryCommit });
  fs.writeFileSync(path.join(rootDir, targetPath), `${JSON.stringify(doc, null, 2)}\n`);
  return doc;
}

if (require.main === module) {
  const targetPath = process.argv[2] || 'docs/launch/level1/prog-076-verifier-replay-result.json';
  const doc = writeVerifierReplayResult(targetPath, { rootDir: process.cwd() });
  console.log(`PROG_076_VERIFIER_REPLAY_RESULT_WRITTEN=${doc.revision_hash}`);
}

module.exports = { STATUS, SOURCE_REF, REQUIRED_FIELDS, REPLAY_RESULTS, buildVerifierReplayResult, writeVerifierReplayResult };
