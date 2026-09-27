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

function findPositiveIngestionVector(source) {
  if (!Array.isArray(source?.runtime_guard_vectors)) return null;
  return source.runtime_guard_vectors.find((v) => v.vector_id === 'B2G-EXTVAL-RESULT-POS-001') || null;
}

function evaluateClosure(source) {
  const positive = findPositiveIngestionVector(source);

  const conditions = {
    source_revision_hash_valid: validHash(source),
    source_issue_is_prog_051: source?.issue_id === 'PROG-051',
    external_validation_results_ingestion_created: source?.readiness_state?.external_validation_results_ingestion_created === true,
    external_validation_result_ingested_for_assessment: source?.readiness_state?.external_validation_result_ingested_for_assessment === true,
    positive_ingestion_vector_present: positive !== null,
    positive_ingestion_vector_valid: positive?.result?.valid === true,
    positive_ingestion_for_assessment_only: positive?.result?.code === 'EXTERNAL_VALIDATION_RESULT_INGESTED_FOR_ASSESSMENT',
    source_external_validation_complete: source?.readiness_state?.external_validation_complete === true,
    source_b2g_candidate_ready: source?.readiness_state?.b2g_candidate_ready === true,
    source_public_sector_production_ready: source?.readiness_state?.public_sector_production_ready === true,
    source_external_validation_completion_claim_allowed: source?.non_claims?.external_validation_complete !== false,
    source_b2g_candidate_claim_allowed: source?.non_claims?.b2g_candidate_ready !== false,
    independent_closure_decision_present: false,
    limitations_resolution_record_present: false,
    pilot_readiness_authorization_present: false
  };

  const blocking_reasons = [];

  if (!conditions.source_revision_hash_valid) blocking_reasons.push('SOURCE_RESULTS_INGESTION_REVISION_HASH_INVALID');
  if (!conditions.source_issue_is_prog_051) blocking_reasons.push('SOURCE_RESULTS_INGESTION_ISSUE_MISMATCH');
  if (!conditions.external_validation_results_ingestion_created) blocking_reasons.push('RESULTS_INGESTION_CONTROL_MISSING');
  if (!conditions.external_validation_result_ingested_for_assessment) blocking_reasons.push('RESULT_NOT_INGESTED_FOR_ASSESSMENT');
  if (!conditions.positive_ingestion_vector_present) blocking_reasons.push('POSITIVE_INGESTION_VECTOR_MISSING');
  if (!conditions.positive_ingestion_vector_valid) blocking_reasons.push('POSITIVE_INGESTION_VECTOR_INVALID');
  if (!conditions.positive_ingestion_for_assessment_only) blocking_reasons.push('POSITIVE_INGESTION_NOT_ASSESSMENT_ONLY');

  if (!conditions.source_external_validation_complete) blocking_reasons.push('EXTERNAL_VALIDATION_COMPLETION_NOT_SUPPORTED_BY_SOURCE');
  if (!conditions.source_external_validation_completion_claim_allowed) blocking_reasons.push('EXTERNAL_VALIDATION_COMPLETION_CLAIM_BLOCKED_BY_SOURCE');
  if (!conditions.independent_closure_decision_present) blocking_reasons.push('INDEPENDENT_CLOSURE_DECISION_MISSING');
  if (!conditions.limitations_resolution_record_present) blocking_reasons.push('LIMITATIONS_RESOLUTION_RECORD_MISSING');
  if (!conditions.pilot_readiness_authorization_present) blocking_reasons.push('PILOT_READINESS_AUTHORIZATION_MISSING');
  if (!conditions.source_b2g_candidate_ready || !conditions.source_b2g_candidate_claim_allowed) blocking_reasons.push('B2G_CANDIDATE_PROMOTION_NOT_ALLOWED');
  if (!conditions.source_public_sector_production_ready) blocking_reasons.push('PUBLIC_SECTOR_PRODUCTION_NOT_READY');

  return {
    gate_result: blocking_reasons.length === 0 ? 'EXTERNAL_VALIDATION_CLOSURE_GATE_PASSED' : 'EXTERNAL_VALIDATION_CLOSURE_GATE_BLOCKED',
    conditions,
    blocking_reasons,
    external_validation_complete: false,
    b2g_candidate_ready: false,
    public_sector_production_ready: false,
    automatic_pilot_promotion: false
  };
}

function buildClosureGate(options = {}) {
  const rootDir = options.rootDir || process.cwd();
  const repositoryCommit = options.repositoryCommit || gitHead(rootDir);
  const sourcePath = 'docs/launch/level2/v3-5-r1/v3-5-r1-level2-external-validation-results-ingestion.json';
  const source = readJson(rootDir, sourcePath);
  const gate = evaluateClosure(source);

  const doc = {
    proto: 'HBCE-B2G-L2-JC2-V3-5-R1-LEVEL2-EXTERNAL-VALIDATION-CLOSURE-GATE-v1',
    kind: 'HBCE_B2G_LEVEL2_JOKER_C2_V3_5_R1_LEVEL2_EXTERNAL_VALIDATION_CLOSURE_GATE',
    document_code: 'HBCE-B2G-L2-JC2-PROG-2027-0001',
    specification_baseline: 'V3.5-R1 - Forensic Evidence & Verifier Qualification Hardening - 26 September 2026',
    issue_id: 'PROG-052',
    priority: 'V3.5-R1-LEVEL2-EXTERNAL-VALIDATION-CLOSURE-GATE',
    repository_baseline_commit: repositoryCommit,

    source_external_validation_results_ingestion_ref: sourcePath,
    source_external_validation_results_ingestion_revision_hash: source.revision_hash,
    source_external_validation_results_ingestion_revision_hash_valid: validHash(source),

    evaluated_inputs: {
      source_issue_id: source.issue_id,
      source_priority: source.priority,
      source_readiness_state: source.readiness_state,
      source_non_claims: source.non_claims,
      source_next_required_program: source.next_required_program
    },

    gate,

    closure_semantics: {
      ingestion_is_necessary_not_sufficient_for_external_validation_closure: true,
      result_ingested_for_assessment_is_not_external_validation_complete: true,
      pass_with_limitations_requires_resolution_record: true,
      closure_requires_independent_decision_record: true,
      closure_requires_pilot_readiness_authorization_before_candidate_promotion: true,
      public_accreditation_procurement_and_legal_validity_require_separate_authority: true,
      no_automatic_pilot_promotion_from_external_result: true
    },

    required_closure_artifacts: [
      'independent_closure_decision_record',
      'limitations_resolution_record',
      'external_validation_completion_record',
      'pilot_readiness_authorization_record'
    ],

    readiness_state: {
      external_validation_closure_gate_created: true,
      external_validation_closure_gate_evaluated: true,
      external_validation_closure_gate_result: gate.gate_result,
      external_validation_results_ingestion_present: gate.conditions.external_validation_results_ingestion_created === true,
      external_validation_complete: false,
      b2g_candidate_ready: false,
      public_sector_production_ready: false,
      pilot_readiness_authorization_present: false
    },

    next_required_program: 'PROG-053-V3-5-R1-LEVEL2-VALIDATION-FOLLOWUP-PLAN',

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

function writeClosureGate(targetPath, options = {}) {
  const rootDir = options.rootDir || process.cwd();
  const doc = buildClosureGate({ rootDir, repositoryCommit: options.repositoryCommit });
  fs.writeFileSync(path.join(rootDir, targetPath), `${JSON.stringify(doc, null, 2)}\n`, 'utf8');
  return doc;
}

if (require.main === module) {
  const targetPath = process.argv[2] || 'docs/launch/level2/v3-5-r1/v3-5-r1-level2-external-validation-closure-gate.json';
  const doc = writeClosureGate(targetPath, { rootDir: process.cwd() });
  console.log(`PROG_052_V3_5_R1_LEVEL2_EXTERNAL_VALIDATION_CLOSURE_GATE_WRITTEN=${doc.revision_hash}`);
}

module.exports = {
  findPositiveIngestionVector,
  evaluateClosure,
  buildClosureGate,
  writeClosureGate
};
