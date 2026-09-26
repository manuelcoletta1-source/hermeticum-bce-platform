'use strict';

const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');
const { sha256Digest } = require('../../packages/hbce-core/canonical-json.js');
const {
  sampleExternalValidationPackage,
  validateExternalValidationPackage
} = require('./build-v3-5-r1-level2-external-validation-control.js');

const RESULT_STATUSES = Object.freeze([
  'RECEIVED',
  'INGESTED_FOR_ASSESSMENT',
  'REJECTED_INCOMPLETE',
  'REJECTED_SCOPE_MISMATCH',
  'REJECTED_UNSUPPORTED_CLAIM',
  'ASSESSMENT_REQUIRED'
]);

const REVIEW_OUTCOMES = Object.freeze([
  'NO_OPINION',
  'PASS_WITH_LIMITATIONS',
  'PASS',
  'FAIL',
  'INCONCLUSIVE'
]);

const REQUIRED_RESULT_SECTIONS = Object.freeze([
  'scope_statement',
  'method_statement',
  'evidence_reviewed',
  'findings',
  'limitations',
  'reviewer_attestation'
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

function hasText(value) {
  return typeof value === 'string' && value.length > 0;
}

function hasNonEmptyTextArray(value) {
  return Array.isArray(value) && value.length > 0 && value.every(hasText);
}

function sampleExternalValidationResult(overrides = {}) {
  return {
    result_id: 'EXTVAL-RESULT::L2-V3-5-R1-DEMO-001',
    result_version: '1.0.0',
    result_status: 'INGESTED_FOR_ASSESSMENT',
    package_id: 'EXTVAL::L2-V3-5-R1-DEMO-001',
    package_version: '1.0.0',
    reviewer_ref: 'VALIDATOR::DEMO-EXTERNAL-TECHNICAL-REVIEWER',
    review_outcome: 'PASS_WITH_LIMITATIONS',
    result_document_ref: 'EXTVAL-DOC::L2-V3-5-R1-DEMO-001',
    result_document_hash: 'sha256:9999999999999999999999999999999999999999999999999999999999999999',
    reviewed_scope: [
      'B2G_T26_T43_RUNTIME_HARNESS',
      'VERIFIER_QUALIFICATION_RECORD',
      'CUSTODY_EVENT_RECORD',
      'HUMAN_DECISION_PROFILE',
      'ADAPTER_PROVENANCE_PROFILE',
      'READINESS_GATE_EVALUATION'
    ],
    result_sections_present: [
      'scope_statement',
      'method_statement',
      'evidence_reviewed',
      'findings',
      'limitations',
      'reviewer_attestation'
    ],
    limitations: [
      'external technical review result ingested for assessment only',
      'no public accreditation or procurement eligibility claim'
    ],
    findings_ref: 'FINDINGS::EXTVAL-DEMO-001',
    reviewer_attestation_ref: 'ATTESTATION::EXTVAL-DEMO-001',
    ingested_at: '2026-09-26T00:00:00.000Z',
    claims_external_validation_complete: false,
    claims_b2g_candidate_ready: false,
    claims_public_sector_production_ready: false,
    claims_public_accreditation: false,
    claims_procurement_eligibility: false,
    claims_legal_validity: false,
    claims_government_endorsement: false,
    ...overrides
  };
}

function blocked(code) {
  return {
    valid: false,
    code,
    result_ingested_for_assessment: false,
    external_validation_complete: false,
    b2g_candidate_ready: false,
    public_sector_production_ready: false,
    public_accreditation_confirmed: false,
    legal_validity_confirmed: false,
    procurement_eligibility_confirmed: false
  };
}

function validateExternalValidationResult(pkg, result) {
  const packageValidation = validateExternalValidationPackage(pkg);
  if (!packageValidation.valid) return blocked(`PACKAGE_${packageValidation.code}`);

  if (!result || typeof result !== 'object') return blocked('EXTERNAL_VALIDATION_RESULT_MISSING');
  if (!hasText(result.result_id) || !hasText(result.result_version)) return blocked('EXTERNAL_VALIDATION_RESULT_ID_INVALID');
  if (!RESULT_STATUSES.includes(result.result_status)) return blocked('EXTERNAL_VALIDATION_RESULT_STATUS_INVALID');
  if (result.package_id !== pkg.package_id || result.package_version !== pkg.package_version) return blocked('RESULT_PACKAGE_BINDING_INVALID');
  if (result.reviewer_ref !== pkg.validator_ref) return blocked('RESULT_REVIEWER_BINDING_INVALID');
  if (!REVIEW_OUTCOMES.includes(result.review_outcome)) return blocked('REVIEW_OUTCOME_INVALID');
  if (!hasText(result.result_document_ref) || !hasText(result.result_document_hash)) return blocked('RESULT_DOCUMENT_BINDING_MISSING');
  if (!hasNonEmptyTextArray(result.reviewed_scope)) return blocked('RESULT_SCOPE_MISSING');
  if (!pkg.validation_scope.every((item) => result.reviewed_scope.includes(item))) return blocked('RESULT_SCOPE_INCOMPLETE');
  if (!hasNonEmptyTextArray(result.result_sections_present)) return blocked('RESULT_SECTIONS_MISSING');
  if (!REQUIRED_RESULT_SECTIONS.every((item) => result.result_sections_present.includes(item))) return blocked('RESULT_SECTIONS_INCOMPLETE');
  if (!hasText(result.findings_ref) || !hasText(result.reviewer_attestation_ref)) return blocked('RESULT_FINDINGS_OR_ATTESTATION_MISSING');
  if (!hasText(result.ingested_at)) return blocked('RESULT_INGESTION_TIME_MISSING');
  if (result.claims_external_validation_complete === true) return blocked('EXTERNAL_VALIDATION_COMPLETION_CLAIM_UNSUPPORTED');
  if (result.claims_b2g_candidate_ready === true) return blocked('B2G_CANDIDATE_CLAIM_UNSUPPORTED');
  if (result.claims_public_sector_production_ready === true) return blocked('PUBLIC_SECTOR_PRODUCTION_CLAIM_UNSUPPORTED');
  if (result.claims_public_accreditation === true) return blocked('PUBLIC_ACCREDITATION_CLAIM_UNSUPPORTED');
  if (result.claims_procurement_eligibility === true) return blocked('PROCUREMENT_ELIGIBILITY_CLAIM_UNSUPPORTED');
  if (result.claims_legal_validity === true) return blocked('LEGAL_VALIDITY_CLAIM_UNSUPPORTED');
  if (result.claims_government_endorsement === true) return blocked('GOVERNMENT_ENDORSEMENT_CLAIM_UNSUPPORTED');

  return {
    valid: true,
    code: 'EXTERNAL_VALIDATION_RESULT_INGESTED_FOR_ASSESSMENT',
    result_ingested_for_assessment: true,
    external_validation_complete: false,
    b2g_candidate_ready: false,
    public_sector_production_ready: false,
    public_accreditation_confirmed: false,
    legal_validity_confirmed: false,
    procurement_eligibility_confirmed: false
  };
}

function buildIngestion(options = {}) {
  const rootDir = options.rootDir || process.cwd();
  const repositoryCommit = options.repositoryCommit || gitHead(rootDir);
  const sourcePath = 'docs/launch/level2/v3-5-r1/v3-5-r1-level2-external-validation-control.json';
  const source = readJson(rootDir, sourcePath);

  const basePackage = sampleExternalValidationPackage();
  const vectors = [
    ['B2G-EXTVAL-RESULT-T01', 'result missing', basePackage, null],
    ['B2G-EXTVAL-RESULT-T02', 'result not bound to accepted package', basePackage, sampleExternalValidationResult({ package_id: 'EXTVAL::OTHER' })],
    ['B2G-EXTVAL-RESULT-T03', 'reviewer mismatch', basePackage, sampleExternalValidationResult({ reviewer_ref: 'VALIDATOR::OTHER' })],
    ['B2G-EXTVAL-RESULT-T04', 'result scope incomplete', basePackage, sampleExternalValidationResult({ reviewed_scope: ['B2G_T26_T43_RUNTIME_HARNESS'] })],
    ['B2G-EXTVAL-RESULT-T05', 'required result sections incomplete', basePackage, sampleExternalValidationResult({ result_sections_present: ['scope_statement'] })],
    ['B2G-EXTVAL-RESULT-T06', 'unsupported readiness or legal claims', basePackage, sampleExternalValidationResult({
      claims_external_validation_complete: true,
      claims_b2g_candidate_ready: true,
      claims_legal_validity: true
    })],
    ['B2G-EXTVAL-RESULT-POS-001', 'complete result ingested for assessment only', basePackage, sampleExternalValidationResult()]
  ].map(([id, stimulus, pkg, result]) => ({
    vector_id: id,
    stimulus,
    result: validateExternalValidationResult(pkg, result)
  }));

  const doc = {
    proto: 'HBCE-B2G-L2-JC2-V3-5-R1-LEVEL2-EXTERNAL-VALIDATION-RESULTS-INGESTION-v1',
    kind: 'HBCE_B2G_LEVEL2_JOKER_C2_V3_5_R1_LEVEL2_EXTERNAL_VALIDATION_RESULTS_INGESTION',
    document_code: 'HBCE-B2G-L2-JC2-PROG-2027-0001',
    specification_baseline: 'V3.5-R1 - Forensic Evidence & Verifier Qualification Hardening - 26 September 2026',
    issue_id: 'PROG-051',
    priority: 'V3.5-R1-LEVEL2-EXTERNAL-VALIDATION-RESULTS-INGESTION',
    repository_baseline_commit: repositoryCommit,

    source_external_validation_control_ref: sourcePath,
    source_external_validation_control_revision_hash: source.revision_hash,
    source_external_validation_control_revision_hash_valid: validHash(source),

    allowed_result_statuses: RESULT_STATUSES,
    allowed_review_outcomes: REVIEW_OUTCOMES,
    required_result_sections: REQUIRED_RESULT_SECTIONS,

    ingestion_semantics: {
      result_ingestion_is_not_external_validation_completion: true,
      result_ingestion_is_not_b2g_candidate_readiness: true,
      pass_with_limitations_requires_followup_gate: true,
      pass_result_does_not_create_public_accreditation: true,
      pass_result_does_not_create_procurement_eligibility: true,
      pass_result_does_not_create_legal_validity: true,
      government_endorsement_must_not_be_inferred: true
    },

    result_contract_fields: [
      'result_id',
      'result_version',
      'result_status',
      'package_id',
      'package_version',
      'reviewer_ref',
      'review_outcome',
      'result_document_ref',
      'result_document_hash',
      'reviewed_scope',
      'result_sections_present',
      'limitations',
      'findings_ref',
      'reviewer_attestation_ref',
      'ingested_at',
      'claims_external_validation_complete',
      'claims_b2g_candidate_ready',
      'claims_public_sector_production_ready',
      'claims_public_accreditation',
      'claims_procurement_eligibility',
      'claims_legal_validity',
      'claims_government_endorsement'
    ],

    fail_closed_codes: [
      'PACKAGE_EXTERNAL_VALIDATION_PACKAGE_MISSING',
      'PACKAGE_EXTERNAL_VALIDATION_PACKAGE_ID_INVALID',
      'EXTERNAL_VALIDATION_RESULT_MISSING',
      'EXTERNAL_VALIDATION_RESULT_ID_INVALID',
      'EXTERNAL_VALIDATION_RESULT_STATUS_INVALID',
      'RESULT_PACKAGE_BINDING_INVALID',
      'RESULT_REVIEWER_BINDING_INVALID',
      'REVIEW_OUTCOME_INVALID',
      'RESULT_DOCUMENT_BINDING_MISSING',
      'RESULT_SCOPE_MISSING',
      'RESULT_SCOPE_INCOMPLETE',
      'RESULT_SECTIONS_MISSING',
      'RESULT_SECTIONS_INCOMPLETE',
      'RESULT_FINDINGS_OR_ATTESTATION_MISSING',
      'RESULT_INGESTION_TIME_MISSING',
      'EXTERNAL_VALIDATION_COMPLETION_CLAIM_UNSUPPORTED',
      'B2G_CANDIDATE_CLAIM_UNSUPPORTED',
      'PUBLIC_SECTOR_PRODUCTION_CLAIM_UNSUPPORTED',
      'PUBLIC_ACCREDITATION_CLAIM_UNSUPPORTED',
      'PROCUREMENT_ELIGIBILITY_CLAIM_UNSUPPORTED',
      'LEGAL_VALIDITY_CLAIM_UNSUPPORTED',
      'GOVERNMENT_ENDORSEMENT_CLAIM_UNSUPPORTED'
    ],

    runtime_guard_vectors: vectors,

    readiness_state: {
      external_validation_results_ingestion_created: true,
      external_validation_result_contract_created: true,
      external_validation_result_validator_created: true,
      external_validation_result_ingested_for_assessment: true,
      external_validation_complete: false,
      b2g_candidate_ready: false,
      public_sector_production_ready: false,
      source_external_validation_control_present: source?.readiness_state?.external_validation_control_created === true
    },

    next_required_program: 'PROG-052-V3-5-R1-LEVEL2-EXTERNAL-VALIDATION-CLOSURE-GATE',

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

function writeIngestion(targetPath, options = {}) {
  const rootDir = options.rootDir || process.cwd();
  const doc = buildIngestion({ rootDir, repositoryCommit: options.repositoryCommit });
  fs.writeFileSync(path.join(rootDir, targetPath), `${JSON.stringify(doc, null, 2)}\n`, 'utf8');
  return doc;
}

if (require.main === module) {
  const targetPath = process.argv[2] || 'docs/launch/level2/v3-5-r1/v3-5-r1-level2-external-validation-results-ingestion.json';
  const doc = writeIngestion(targetPath, { rootDir: process.cwd() });
  console.log(`PROG_051_V3_5_R1_LEVEL2_EXTERNAL_VALIDATION_RESULTS_INGESTION_WRITTEN=${doc.revision_hash}`);
}

module.exports = {
  RESULT_STATUSES,
  REVIEW_OUTCOMES,
  REQUIRED_RESULT_SECTIONS,
  sampleExternalValidationResult,
  validateExternalValidationResult,
  buildIngestion,
  writeIngestion
};
