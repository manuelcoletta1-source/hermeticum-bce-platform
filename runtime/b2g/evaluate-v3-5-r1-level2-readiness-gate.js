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

function evaluateReadiness(source) {
  const conditions = {
    source_revision_hash_valid: validHash(source),
    b2g_t26_t43_harness_complete: source?.readiness_state?.b2g_t26_t43_harness_complete === true,
    level2_contract_gap_set_closed: source?.readiness_state?.level2_contract_gap_set_closed === true,
    remaining_open_gaps_empty: Array.isArray(source?.remaining_open_gaps) && source.remaining_open_gaps.length === 0,
    all_required_vectors_present: source?.harness_scope?.all_required_vectors_present === true,
    all_required_vectors_passed: source?.harness_scope?.all_required_vectors_passed === true,
    positive_integration_vector_passed: source?.positive_integration_vector?.passed === true,
    external_validation_complete: source?.readiness_state?.external_validation_complete === true,
    pilot_readiness_gate_complete: source?.readiness_state?.pilot_readiness_gate_complete === true,
    source_claims_b2g_candidate_ready: source?.readiness_state?.b2g_candidate_ready === true,
    source_claims_public_sector_production_ready: source?.readiness_state?.public_sector_production_ready === true,
    source_claims_level2_runtime_complete: source?.non_claims?.level2_runtime_complete !== false
  };

  const blocking_reasons = [];

  if (!conditions.source_revision_hash_valid) blocking_reasons.push('SOURCE_HARNESS_REVISION_HASH_INVALID');
  if (!conditions.b2g_t26_t43_harness_complete) blocking_reasons.push('B2G_T26_T43_HARNESS_NOT_COMPLETE');
  if (!conditions.level2_contract_gap_set_closed) blocking_reasons.push('LEVEL2_CONTRACT_GAP_SET_NOT_CLOSED');
  if (!conditions.remaining_open_gaps_empty) blocking_reasons.push('LEVEL2_REMAINING_GAPS_NOT_EMPTY');
  if (!conditions.all_required_vectors_present) blocking_reasons.push('REQUIRED_B2G_VECTORS_MISSING');
  if (!conditions.all_required_vectors_passed) blocking_reasons.push('REQUIRED_B2G_VECTORS_NOT_PASSING');
  if (!conditions.positive_integration_vector_passed) blocking_reasons.push('POSITIVE_INTEGRATION_VECTOR_NOT_PASSING');

  if (!conditions.external_validation_complete) blocking_reasons.push('EXTERNAL_VALIDATION_NOT_COMPLETE');
  if (!conditions.pilot_readiness_gate_complete) blocking_reasons.push('PILOT_READINESS_GATE_NOT_COMPLETE');
  if (!conditions.source_claims_b2g_candidate_ready) blocking_reasons.push('B2G_CANDIDATE_CLAIM_NOT_PRESENT_IN_SOURCE');
  if (!conditions.source_claims_public_sector_production_ready) blocking_reasons.push('PUBLIC_SECTOR_PRODUCTION_NOT_READY');
  if (!conditions.source_claims_level2_runtime_complete) blocking_reasons.push('LEVEL2_RUNTIME_COMPLETE_CLAIM_NOT_SUPPORTED');

  return {
    gate_result: blocking_reasons.length === 0 ? 'LEVEL2_READINESS_GATE_PASSED' : 'LEVEL2_READINESS_GATE_BLOCKED',
    conditions,
    blocking_reasons,
    b2g_candidate_ready: false,
    public_sector_production_ready: false,
    external_validation_complete: conditions.external_validation_complete,
    automatic_pilot_promotion: false
  };
}

function buildGateEvaluation(options = {}) {
  const rootDir = options.rootDir || process.cwd();
  const repositoryCommit = options.repositoryCommit || gitHead(rootDir);
  const sourcePath = 'docs/launch/level2/v3-5-r1/v3-5-r1-b2g-t26-t43-runtime-harness.json';
  const source = readJson(rootDir, sourcePath);
  const gate = evaluateReadiness(source);

  const doc = {
    proto: 'HBCE-B2G-L2-JC2-V3-5-R1-LEVEL2-READINESS-GATE-EVALUATION-v1',
    kind: 'HBCE_B2G_LEVEL2_JOKER_C2_V3_5_R1_LEVEL2_READINESS_GATE_EVALUATION',
    document_code: 'HBCE-B2G-L2-JC2-PROG-2027-0001',
    specification_baseline: 'V3.5-R1 - Forensic Evidence & Verifier Qualification Hardening - 26 September 2026',
    issue_id: 'PROG-049',
    priority: 'V3.5-R1-LEVEL2-READINESS-GATE-EVALUATION',
    repository_baseline_commit: repositoryCommit,

    source_b2g_t26_t43_harness_ref: sourcePath,
    source_b2g_t26_t43_harness_revision_hash: source.revision_hash,
    source_b2g_t26_t43_harness_revision_hash_valid: validHash(source),

    evaluated_inputs: {
      integrated_contracts: source.integrated_contracts,
      harness_scope: source.harness_scope,
      closed_gap: source.closed_gap,
      remaining_open_gaps: source.remaining_open_gaps,
      source_readiness_state: source.readiness_state,
      source_non_claims: source.non_claims
    },

    gate,

    gate_semantics: {
      contract_gap_closure_is_necessary_not_sufficient: true,
      local_validator_pass_is_not_external_validation: true,
      positive_integration_vector_is_not_candidate_readiness: true,
      no_automatic_pilot_promotion_from_harness: true,
      no_public_sector_production_without_separate_gate: true,
      no_legal_or_procurement_claim_from_internal_gate: true
    },

    readiness_state: {
      level2_contract_gap_set_closed: gate.conditions.level2_contract_gap_set_closed === true,
      b2g_t26_t43_harness_complete: gate.conditions.b2g_t26_t43_harness_complete === true,
      level2_readiness_gate_evaluated: true,
      level2_readiness_gate_result: gate.gate_result,
      b2g_candidate_ready: false,
      public_sector_production_ready: false,
      external_validation_complete: gate.conditions.external_validation_complete === true,
      pilot_readiness_gate_complete: gate.conditions.pilot_readiness_gate_complete === true
    },

    next_required_program: 'PROG-050-V3-5-R1-LEVEL2-EXTERNAL-VALIDATION-CONTROL',

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

function writeGateEvaluation(targetPath, options = {}) {
  const rootDir = options.rootDir || process.cwd();
  const doc = buildGateEvaluation({ rootDir, repositoryCommit: options.repositoryCommit });
  fs.writeFileSync(path.join(rootDir, targetPath), `${JSON.stringify(doc, null, 2)}\n`, 'utf8');
  return doc;
}

if (require.main === module) {
  const targetPath = process.argv[2] || 'docs/launch/level2/v3-5-r1/v3-5-r1-level2-readiness-gate-evaluation.json';
  const doc = writeGateEvaluation(targetPath, { rootDir: process.cwd() });
  console.log(`PROG_049_V3_5_R1_LEVEL2_READINESS_GATE_WRITTEN=${doc.revision_hash}`);
}

module.exports = {
  evaluateReadiness,
  buildGateEvaluation,
  writeGateEvaluation
};
