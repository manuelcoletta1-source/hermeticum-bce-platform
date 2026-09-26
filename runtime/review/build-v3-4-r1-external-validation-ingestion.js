'use strict';

const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');
const { sha256Digest } = require('../../packages/hbce-core/canonical-json.js');

const ALLOWED_EXTERNAL_RESULTS = Object.freeze([
  'EXTERNAL_VALIDATION_ACCEPTED',
  'EXTERNAL_VALIDATION_ACCEPTED_WITH_FINDINGS',
  'EXTERNAL_VALIDATION_REJECTED'
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

function validateRevisionHash(doc) {
  if (!doc || typeof doc !== 'object' || !doc.revision_hash) return false;
  const body = { ...doc };
  delete body.revision_hash;
  return doc.revision_hash === sha256Digest(body);
}

function buildExternalValidationIngestion(options) {
  const rootDir = options && options.rootDir ? options.rootDir : process.cwd();
  const repositoryCommit = options && options.repositoryCommit ? options.repositoryCommit : gitHead(rootDir);

  const reviewControlPath = 'docs/launch/level1/v3-4-r1/v3-4-r1-evidence-review-external-validation-control.json';
  const reviewControl = readJson(rootDir, reviewControlPath);

  const suppliedResult = options && options.externalValidationResult ? options.externalValidationResult : null;
  const suppliedEvidenceRef = options && options.externalValidationEvidenceRef ? options.externalValidationEvidenceRef : null;

  const sourceIntegrityValid = validateRevisionHash(reviewControl);
  const resultProvided = typeof suppliedResult === 'string' && suppliedResult.length > 0;
  const resultAllowed = resultProvided && ALLOWED_EXTERNAL_RESULTS.includes(suppliedResult);
  const evidenceRefProvided = typeof suppliedEvidenceRef === 'string' && suppliedEvidenceRef.length > 0;

  const blockingReasons = [];

  if (!sourceIntegrityValid) {
    blockingReasons.push('SOURCE_REVIEW_CONTROL_REVISION_HASH_INVALID');
  }

  if (!resultProvided) {
    blockingReasons.push('EXTERNAL_VALIDATION_RESULT_MISSING');
  }

  if (resultProvided && !resultAllowed) {
    blockingReasons.push('EXTERNAL_VALIDATION_RESULT_UNSUPPORTED');
  }

  if (resultProvided && !evidenceRefProvided) {
    blockingReasons.push('EXTERNAL_VALIDATION_EVIDENCE_REF_MISSING');
  }

  const canCompleteExternalValidation = sourceIntegrityValid && resultAllowed && evidenceRefProvided;
  const accepted = suppliedResult === 'EXTERNAL_VALIDATION_ACCEPTED';
  const acceptedWithFindings = suppliedResult === 'EXTERNAL_VALIDATION_ACCEPTED_WITH_FINDINGS';
  const rejected = suppliedResult === 'EXTERNAL_VALIDATION_REJECTED';

  const ingestion = {
    proto: 'HBCE-B2B-L1-V3-4-R1-EXTERNAL-VALIDATION-RESULTS-INGESTION-v1',
    kind: 'HBCE_B2B_L1_V3_4_R1_EXTERNAL_VALIDATION_RESULTS_INGESTION',
    document_code: 'HBCE-B2B-L1-MATRIX-PROG-2027-0001',
    specification_baseline: 'V3.4-R1 - Controlled Corrective Revision - 26 September 2026',
    issue_id: 'PROG-041',
    priority: 'V3.4-R1-EXTERNAL-VALIDATION-RESULTS-INGESTION',
    repository_baseline_commit: repositoryCommit,

    source_review_control_ref: reviewControlPath,
    source_review_control_revision_hash: reviewControl.revision_hash,
    source_review_control_revision_hash_valid: sourceIntegrityValid,

    ingestion_input: {
      external_validation_result: suppliedResult,
      external_validation_evidence_ref: suppliedEvidenceRef,
      allowed_results: ALLOWED_EXTERNAL_RESULTS
    },

    status: canCompleteExternalValidation
      ? 'EXTERNAL_VALIDATION_RESULT_INGESTED_REVIEW_REQUIRED'
      : 'EXTERNAL_VALIDATION_RESULT_AWAITING_INPUT',

    external_validation_state: {
      result_provided: resultProvided,
      result_allowed: resultAllowed,
      evidence_ref_provided: evidenceRefProvided,
      external_validation_complete: canCompleteExternalValidation && (accepted || acceptedWithFindings || rejected),
      external_validation_accepted: accepted,
      external_validation_accepted_with_findings: acceptedWithFindings,
      external_validation_rejected: rejected
    },

    rc_effect: {
      rc_gate_re_evaluation_required: canCompleteExternalValidation,
      release_candidate_ready: false,
      production_ready: false,
      pilot_access_available: false,
      customer_acceptance_available: false,
      automatic_release_authorization: false
    },

    blocking_reasons: blockingReasons,

    next_required_program: canCompleteExternalValidation
      ? 'PROG-042-RC-GATE-RE-EVALUATION'
      : 'PROG-041-EXTERNAL-VALIDATION-RESULTS-INGESTION-WAITING-INPUT',

    non_claims: {
      production_ready: false,
      release_candidate_ready: false,
      pilot_access_available: false,
      customer_acceptance: false,
      external_validation_complete_without_result: false,
      automatic_release_authorization: false,
      commercial_claim_complete: false
    }
  };

  ingestion.revision_hash = sha256Digest(ingestion);
  return ingestion;
}

function writeExternalValidationIngestion(targetPath, options) {
  const rootDir = options && options.rootDir ? options.rootDir : process.cwd();
  const ingestion = buildExternalValidationIngestion({
    rootDir,
    repositoryCommit: options && options.repositoryCommit,
    externalValidationResult: options && options.externalValidationResult,
    externalValidationEvidenceRef: options && options.externalValidationEvidenceRef
  });
  fs.writeFileSync(path.join(rootDir, targetPath), `${JSON.stringify(ingestion, null, 2)}\n`, 'utf8');
  return ingestion;
}

if (require.main === module) {
  const targetPath = process.argv[2] || 'docs/launch/level1/v3-4-r1/v3-4-r1-external-validation-results-ingestion.json';
  const ingestion = writeExternalValidationIngestion(targetPath, { rootDir: process.cwd() });
  console.log(`PROG_041_EXTERNAL_VALIDATION_INGESTION_WRITTEN=${ingestion.status}`);
}

module.exports = {
  ALLOWED_EXTERNAL_RESULTS,
  buildExternalValidationIngestion,
  writeExternalValidationIngestion
};
