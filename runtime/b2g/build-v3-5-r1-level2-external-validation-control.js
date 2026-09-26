'use strict';

const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');
const { sha256Digest } = require('../../packages/hbce-core/canonical-json.js');

const VALIDATION_PACKAGE_STATUSES = Object.freeze([
  'REGISTERED',
  'UNDER_REVIEW',
  'ACCEPTED_FOR_REVIEW',
  'REJECTED_INCOMPLETE',
  'REJECTED_SCOPE_MISMATCH',
  'RESULTS_INGESTION_PENDING'
]);

const VALIDATOR_RELATIONSHIP_TYPES = Object.freeze([
  'INTERNAL_INDEPENDENT_REVIEW',
  'CUSTOMER_ACCEPTED_REVIEW',
  'EXTERNAL_TECHNICAL_REVIEW',
  'PUBLIC_ACCREDITATION_REFERENCED'
]);

const VALIDATION_SCOPE_ITEMS = Object.freeze([
  'B2G_T26_T43_RUNTIME_HARNESS',
  'VERIFIER_QUALIFICATION_RECORD',
  'CUSTODY_EVENT_RECORD',
  'HUMAN_DECISION_PROFILE',
  'ADAPTER_PROVENANCE_PROFILE',
  'READINESS_GATE_EVALUATION'
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

function sampleExternalValidationPackage(overrides = {}) {
  return {
    package_id: 'EXTVAL::L2-V3-5-R1-DEMO-001',
    package_version: '1.0.0',
    package_status: 'REGISTERED',
    validator_ref: 'VALIDATOR::DEMO-EXTERNAL-TECHNICAL-REVIEWER',
    validator_relationship_type: 'EXTERNAL_TECHNICAL_REVIEW',
    declared_independence: true,
    conflict_of_interest_statement_ref: 'COI::DEMO-001',
    validation_scope: [
      'B2G_T26_T43_RUNTIME_HARNESS',
      'VERIFIER_QUALIFICATION_RECORD',
      'CUSTODY_EVENT_RECORD',
      'HUMAN_DECISION_PROFILE',
      'ADAPTER_PROVENANCE_PROFILE',
      'READINESS_GATE_EVALUATION'
    ],
    source_artifact_refs: [
      'PROG-044',
      'PROG-045',
      'PROG-046',
      'PROG-047',
      'PROG-048',
      'PROG-049'
    ],
    evidence_package_ref: 'EVIDENCE-PACKAGE::EXTVAL-DEMO-001',
    evidence_package_hash: 'sha256:eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
    review_protocol_ref: 'REVIEW-PROTOCOL::B2G-L2-V3-5-R1-EXTVAL-001',
    review_protocol_version: '1.0.0',
    received_at: '2026-09-26T00:00:00.000Z',
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
    external_validation_package_accepted: false,
    external_validation_complete: false,
    b2g_candidate_ready: false,
    public_sector_production_ready: false,
    public_accreditation_confirmed: false,
    legal_validity_confirmed: false,
    procurement_eligibility_confirmed: false
  };
}

function validateExternalValidationPackage(pkg) {
  if (!pkg || typeof pkg !== 'object') return blocked('EXTERNAL_VALIDATION_PACKAGE_MISSING');
  if (!hasText(pkg.package_id) || !hasText(pkg.package_version)) return blocked('EXTERNAL_VALIDATION_PACKAGE_ID_INVALID');
  if (!VALIDATION_PACKAGE_STATUSES.includes(pkg.package_status)) return blocked('EXTERNAL_VALIDATION_PACKAGE_STATUS_INVALID');
  if (!hasText(pkg.validator_ref)) return blocked('VALIDATOR_REF_MISSING');
  if (!VALIDATOR_RELATIONSHIP_TYPES.includes(pkg.validator_relationship_type)) return blocked('VALIDATOR_RELATIONSHIP_TYPE_INVALID');
  if (pkg.validator_relationship_type === 'PUBLIC_ACCREDITATION_REFERENCED' && pkg.claims_public_accreditation !== true) return blocked('PUBLIC_ACCREDITATION_REFERENCE_INCOMPLETE');
  if (pkg.declared_independence !== true || !hasText(pkg.conflict_of_interest_statement_ref)) return blocked('INDEPENDENCE_DECLARATION_MISSING');
  if (!hasNonEmptyTextArray(pkg.validation_scope)) return blocked('VALIDATION_SCOPE_MISSING');
  if (pkg.validation_scope.some((item) => !VALIDATION_SCOPE_ITEMS.includes(item))) return blocked('VALIDATION_SCOPE_UNKNOWN');
  if (!VALIDATION_SCOPE_ITEMS.every((item) => pkg.validation_scope.includes(item))) return blocked('VALIDATION_SCOPE_INCOMPLETE');
  if (!hasNonEmptyTextArray(pkg.source_artifact_refs)) return blocked('SOURCE_ARTIFACT_REFS_MISSING');
  if (!['PROG-044', 'PROG-045', 'PROG-046', 'PROG-047', 'PROG-048', 'PROG-049'].every((item) => pkg.source_artifact_refs.includes(item))) return blocked('SOURCE_ARTIFACT_REFS_INCOMPLETE');
  if (!hasText(pkg.evidence_package_ref) || !hasText(pkg.evidence_package_hash)) return blocked('EVIDENCE_PACKAGE_BINDING_MISSING');
  if (!hasText(pkg.review_protocol_ref) || !hasText(pkg.review_protocol_version)) return blocked('REVIEW_PROTOCOL_MISSING');
  if (!hasText(pkg.received_at)) return blocked('EXTERNAL_VALIDATION_RECEIPT_TIME_MISSING');
  if (pkg.claims_procurement_eligibility === true) return blocked('PROCUREMENT_ELIGIBILITY_CLAIM_UNSUPPORTED');
  if (pkg.claims_legal_validity === true) return blocked('LEGAL_VALIDITY_CLAIM_UNSUPPORTED');
  if (pkg.claims_government_endorsement === true) return blocked('GOVERNMENT_ENDORSEMENT_CLAIM_UNSUPPORTED');

  return {
    valid: true,
    code: 'EXTERNAL_VALIDATION_PACKAGE_ACCEPTABLE_FOR_REVIEW',
    external_validation_package_accepted: true,
    external_validation_complete: false,
    b2g_candidate_ready: false,
    public_sector_production_ready: false,
    public_accreditation_confirmed: pkg.validator_relationship_type === 'PUBLIC_ACCREDITATION_REFERENCED' && pkg.claims_public_accreditation === true,
    legal_validity_confirmed: false,
    procurement_eligibility_confirmed: false
  };
}

function buildControl(options = {}) {
  const rootDir = options.rootDir || process.cwd();
  const repositoryCommit = options.repositoryCommit || gitHead(rootDir);
  const sourcePath = 'docs/launch/level2/v3-5-r1/v3-5-r1-level2-readiness-gate-evaluation.json';
  const source = readJson(rootDir, sourcePath);

  const vectors = [
    ['B2G-EXTVAL-T01', 'external validation package missing', null],
    ['B2G-EXTVAL-T02', 'validator independence declaration missing', sampleExternalValidationPackage({ declared_independence: false, conflict_of_interest_statement_ref: '' })],
    ['B2G-EXTVAL-T03', 'validation scope incomplete', sampleExternalValidationPackage({ validation_scope: ['B2G_T26_T43_RUNTIME_HARNESS'] })],
    ['B2G-EXTVAL-T04', 'source artifact refs incomplete', sampleExternalValidationPackage({ source_artifact_refs: ['PROG-049'] })],
    ['B2G-EXTVAL-T05', 'unsupported procurement or legal claim', sampleExternalValidationPackage({ claims_procurement_eligibility: true, claims_legal_validity: true })],
    ['B2G-EXTVAL-POS-001', 'complete package accepted for review only', sampleExternalValidationPackage()]
  ].map(([id, stimulus, pkg]) => ({
    vector_id: id,
    stimulus,
    result: validateExternalValidationPackage(pkg)
  }));

  const doc = {
    proto: 'HBCE-B2G-L2-JC2-V3-5-R1-LEVEL2-EXTERNAL-VALIDATION-CONTROL-v1',
    kind: 'HBCE_B2G_LEVEL2_JOKER_C2_V3_5_R1_LEVEL2_EXTERNAL_VALIDATION_CONTROL',
    document_code: 'HBCE-B2G-L2-JC2-PROG-2027-0001',
    specification_baseline: 'V3.5-R1 - Forensic Evidence & Verifier Qualification Hardening - 26 September 2026',
    issue_id: 'PROG-050',
    priority: 'V3.5-R1-LEVEL2-EXTERNAL-VALIDATION-CONTROL',
    repository_baseline_commit: repositoryCommit,

    source_level2_readiness_gate_ref: sourcePath,
    source_level2_readiness_gate_revision_hash: source.revision_hash,
    source_level2_readiness_gate_revision_hash_valid: validHash(source),
    source_gate_result: source?.gate?.gate_result || 'UNKNOWN',

    allowed_validation_package_statuses: VALIDATION_PACKAGE_STATUSES,
    allowed_validator_relationship_types: VALIDATOR_RELATIONSHIP_TYPES,
    required_validation_scope_items: VALIDATION_SCOPE_ITEMS,

    control_semantics: {
      external_validation_control_is_not_external_validation_completion: true,
      accepted_for_review_is_not_b2g_candidate_readiness: true,
      customer_accepted_review_is_not_public_accreditation: true,
      public_accreditation_reference_must_be_explicit_and_separate: true,
      procurement_eligibility_requires_separate_authority: true,
      legal_validity_requires_separate_authority: true,
      government_endorsement_must_not_be_inferred: true
    },

    package_contract_fields: [
      'package_id',
      'package_version',
      'package_status',
      'validator_ref',
      'validator_relationship_type',
      'declared_independence',
      'conflict_of_interest_statement_ref',
      'validation_scope',
      'source_artifact_refs',
      'evidence_package_ref',
      'evidence_package_hash',
      'review_protocol_ref',
      'review_protocol_version',
      'received_at',
      'claims_public_accreditation',
      'claims_procurement_eligibility',
      'claims_legal_validity',
      'claims_government_endorsement'
    ],

    fail_closed_codes: [
      'EXTERNAL_VALIDATION_PACKAGE_MISSING',
      'EXTERNAL_VALIDATION_PACKAGE_ID_INVALID',
      'EXTERNAL_VALIDATION_PACKAGE_STATUS_INVALID',
      'VALIDATOR_REF_MISSING',
      'VALIDATOR_RELATIONSHIP_TYPE_INVALID',
      'PUBLIC_ACCREDITATION_REFERENCE_INCOMPLETE',
      'INDEPENDENCE_DECLARATION_MISSING',
      'VALIDATION_SCOPE_MISSING',
      'VALIDATION_SCOPE_UNKNOWN',
      'VALIDATION_SCOPE_INCOMPLETE',
      'SOURCE_ARTIFACT_REFS_MISSING',
      'SOURCE_ARTIFACT_REFS_INCOMPLETE',
      'EVIDENCE_PACKAGE_BINDING_MISSING',
      'REVIEW_PROTOCOL_MISSING',
      'EXTERNAL_VALIDATION_RECEIPT_TIME_MISSING',
      'PROCUREMENT_ELIGIBILITY_CLAIM_UNSUPPORTED',
      'LEGAL_VALIDITY_CLAIM_UNSUPPORTED',
      'GOVERNMENT_ENDORSEMENT_CLAIM_UNSUPPORTED'
    ],

    runtime_guard_vectors: vectors,

    readiness_state: {
      external_validation_control_created: true,
      external_validation_package_contract_created: true,
      external_validation_package_validator_created: true,
      external_validation_results_ingestion_complete: false,
      external_validation_complete: false,
      b2g_candidate_ready: false,
      public_sector_production_ready: false,
      source_level2_readiness_gate_blocked: source?.gate?.gate_result === 'LEVEL2_READINESS_GATE_BLOCKED'
    },

    next_required_program: 'PROG-051-V3-5-R1-LEVEL2-EXTERNAL-VALIDATION-RESULTS-INGESTION',

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

function writeControl(targetPath, options = {}) {
  const rootDir = options.rootDir || process.cwd();
  const doc = buildControl({ rootDir, repositoryCommit: options.repositoryCommit });
  fs.writeFileSync(path.join(rootDir, targetPath), `${JSON.stringify(doc, null, 2)}\n`, 'utf8');
  return doc;
}

if (require.main === module) {
  const targetPath = process.argv[2] || 'docs/launch/level2/v3-5-r1/v3-5-r1-level2-external-validation-control.json';
  const doc = writeControl(targetPath, { rootDir: process.cwd() });
  console.log(`PROG_050_V3_5_R1_LEVEL2_EXTERNAL_VALIDATION_CONTROL_WRITTEN=${doc.revision_hash}`);
}

module.exports = {
  VALIDATION_PACKAGE_STATUSES,
  VALIDATOR_RELATIONSHIP_TYPES,
  VALIDATION_SCOPE_ITEMS,
  sampleExternalValidationPackage,
  validateExternalValidationPackage,
  buildControl,
  writeControl
};
