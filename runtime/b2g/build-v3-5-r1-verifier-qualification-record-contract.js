'use strict';

const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');
const { sha256Digest } = require('../../packages/hbce-core/canonical-json.js');

const QUALIFICATION_CLASSES = Object.freeze([
  'INTERNAL_TECHNICAL',
  'CUSTOMER_ACCEPTED',
  'EXTERNAL_ACCREDITATION_REFERENCED'
]);

const REVOCATION_STATUSES = Object.freeze(['ACTIVE', 'SUSPENDED', 'REVOKED']);
const INDEPENDENCE_STATUSES = Object.freeze(['INDEPENDENT', 'NOT_REQUIRED', 'UNRESOLVED', 'CONFLICTED']);
const CONFLICT_STATUSES = Object.freeze(['NO_CONFLICT_DECLARED', 'CONFLICT_DECLARED', 'UNRESOLVED']);

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

function validateVerifierQualificationRecord(record, request = {}) {
  if (!record || typeof record !== 'object') {
    return blocked('VERIFIER_NOT_QUALIFIED');
  }

  if (!hasText(record.verifier_id) || !hasText(record.record_version)) {
    return blocked('VERIFIER_IDENTITY_INVALID');
  }

  if (!QUALIFICATION_CLASSES.includes(record.qualification_class)) {
    return blocked('QUALIFICATION_CLASS_INVALID');
  }

  if (!record.qualification_scope || typeof record.qualification_scope !== 'object') {
    return blocked('QUALIFICATION_SCOPE_MISMATCH');
  }

  if (!record.qualification_basis || !hasText(record.qualification_basis.method_version) || !hasText(record.qualification_evidence_ref)) {
    return blocked('VERIFIER_NOT_QUALIFIED');
  }

  if (!REVOCATION_STATUSES.includes(record.revocation_status)) {
    return blocked('QUALIFICATION_REVOCATION_STATUS_INVALID');
  }

  if (record.revocation_status !== 'ACTIVE') {
    return blocked('QUALIFICATION_REVOKED');
  }

  const now = request.now || '2026-09-26T00:00:00.000Z';
  if (hasText(record.valid_from) && now < record.valid_from) {
    return blocked('QUALIFICATION_NOT_YET_VALID');
  }

  if (hasText(record.valid_until) && now > record.valid_until) {
    return blocked('QUALIFICATION_EXPIRED');
  }

  const requiredFields = ['property', 'evidence_class', 'ruleset_family', 'environment'];
  for (const field of requiredFields) {
    if (hasText(request[field]) && record.qualification_scope[field] !== request[field]) {
      return blocked('QUALIFICATION_SCOPE_MISMATCH');
    }
  }

  if (!INDEPENDENCE_STATUSES.includes(record.independence_status)) {
    return blocked('QUALIFICATION_INDEPENDENCE_INVALID');
  }

  if (!CONFLICT_STATUSES.includes(record.conflict_of_interest_status)) {
    return blocked('QUALIFICATION_INDEPENDENCE_INVALID');
  }

  if (request.independence_required === true) {
    const independent = record.independence_status === 'INDEPENDENT';
    const noConflict = record.conflict_of_interest_status === 'NO_CONFLICT_DECLARED';
    if (!independent || !noConflict) {
      return blocked('QUALIFICATION_INDEPENDENCE_INVALID');
    }
  }

  if (record.public_accreditation_claimed === true) {
    const hasExternalClass = record.qualification_class === 'EXTERNAL_ACCREDITATION_REFERENCED';
    const hasExternalRef = hasText(record.external_accreditation_ref_optional) && hasText(record.jurisdiction_ref_optional);
    if (!hasExternalClass || !hasExternalRef) {
      return blocked('ACCREDITATION_CLAIM_UNSUPPORTED');
    }
  }

  return {
    valid: true,
    code: 'QUALIFICATION_ACTIVE_SCOPE_MATCHED',
    assurance_verdict_permitted_within_scope: true,
    produces_assurance_verdict: false,
    creates_public_authority: false,
    creates_public_accreditation: false
  };
}

function blocked(code) {
  return {
    valid: false,
    code,
    assurance_verdict_permitted_within_scope: false,
    produces_assurance_verdict: false,
    creates_public_authority: false,
    creates_public_accreditation: false
  };
}

function sampleRecord(overrides = {}) {
  return {
    verifier_id: 'VERIFIER::HBCE_INTERNAL_TECHNICAL_V1',
    record_version: '1.0.0',
    qualification_class: 'INTERNAL_TECHNICAL',
    qualification_scope: {
      property: 'ASSURANCE::TECHNICAL_PROPERTY',
      evidence_class: 'EVIDENCE::CHAINED_RUNTIME_ARTIFACT',
      ruleset_family: 'HBCE_B2G_V3_5_R1',
      environment: 'NON_CLASSIFIED_DEMONSTRATOR'
    },
    qualification_basis: {
      method_version: 'HBCE-B2G-QA-METHOD-v1',
      test_vector_set_ref: 'B2G-T26-T31',
      review_method_ref: 'QUALIFICATION_REVIEW_METHOD::V1',
      change_record_ref: 'PROG-044'
    },
    independence_status: 'INDEPENDENT',
    conflict_of_interest_status: 'NO_CONFLICT_DECLARED',
    valid_from: '2026-01-01T00:00:00.000Z',
    valid_until: '2027-12-31T23:59:59.000Z',
    revocation_status: 'ACTIVE',
    revocation_ref: null,
    qualification_evidence_ref: 'evidence::verifier-qualification::internal-technical-v1',
    external_accreditation_ref_optional: null,
    jurisdiction_ref_optional: null,
    public_accreditation_claimed: false,
    ...overrides
  };
}

function buildContract(options = {}) {
  const rootDir = options.rootDir || process.cwd();
  const repositoryCommit = options.repositoryCommit || gitHead(rootDir);
  const registryPath = 'docs/launch/level2/v3-5-r1/v3-5-r1-level2-producer-registry-baseline.json';
  const registry = readJson(rootDir, registryPath);

  const request = {
    property: 'ASSURANCE::TECHNICAL_PROPERTY',
    evidence_class: 'EVIDENCE::CHAINED_RUNTIME_ARTIFACT',
    ruleset_family: 'HBCE_B2G_V3_5_R1',
    environment: 'NON_CLASSIFIED_DEMONSTRATOR',
    independence_required: true,
    now: '2026-09-26T00:00:00.000Z'
  };

  const vectors = [
    ['B2G-T26', 'missing qualification record', null],
    ['B2G-T27', 'scope mismatch', sampleRecord({ qualification_scope: { ...sampleRecord().qualification_scope, property: 'ASSURANCE::OTHER' } })],
    ['B2G-T28', 'qualification expired', sampleRecord({ valid_until: '2026-01-02T00:00:00.000Z' })],
    ['B2G-T29', 'qualification revoked', sampleRecord({ revocation_status: 'REVOKED', revocation_ref: 'revocation::demo' })],
    ['B2G-T30', 'independence conflict', sampleRecord({ independence_status: 'CONFLICTED', conflict_of_interest_status: 'CONFLICT_DECLARED' })],
    ['B2G-T31', 'public accreditation unsupported', sampleRecord({ public_accreditation_claimed: true })],
    ['B2G-POS-001', 'valid internal technical qualification', sampleRecord()]
  ].map(([id, stimulus, record]) => ({
    vector_id: id,
    stimulus,
    result: validateVerifierQualificationRecord(record, request)
  }));

  const doc = {
    proto: 'HBCE-B2G-L2-JC2-V3-5-R1-VERIFIER-QUALIFICATION-RECORD-CONTRACT-v1',
    kind: 'HBCE_B2G_LEVEL2_JOKER_C2_V3_5_R1_VERIFIER_QUALIFICATION_RECORD_CONTRACT',
    document_code: 'HBCE-B2G-L2-JC2-PROG-2027-0001',
    specification_baseline: 'V3.5-R1 - Forensic Evidence & Verifier Qualification Hardening - 26 September 2026',
    issue_id: 'PROG-044',
    priority: 'V3.5-R1-VERIFIER-QUALIFICATION-RECORD-CONTRACT',
    repository_baseline_commit: repositoryCommit,
    source_level2_producer_registry_ref: registryPath,
    source_level2_producer_registry_revision_hash: registry.revision_hash,
    source_level2_producer_registry_revision_hash_valid: validHash(registry),
    governing_producer: 'PRODUCER::VERIFIER_QUALIFICATION_CONTROL',
    assurance_verdict_producer: 'PRODUCER::QUALIFIED_VERIFIER',
    invariant: {
      internal_qualification_is_not_public_accreditation: true,
      qualification_record_does_not_emit_assurance_verdict: true,
      assurance_proven_requires_active_scope_matched_qualification: true,
      no_active_scope_matched_qualification_no_proven: true,
      neither_producer_creates_public_authority: true
    },
    contract_fields: [
      'verifier_id',
      'record_version',
      'qualification_class',
      'qualification_scope',
      'qualification_basis',
      'independence_status',
      'conflict_of_interest_status',
      'valid_from',
      'valid_until',
      'revocation_status',
      'revocation_ref',
      'qualification_evidence_ref',
      'external_accreditation_ref_optional',
      'jurisdiction_ref_optional'
    ],
    allowed_qualification_classes: QUALIFICATION_CLASSES,
    fail_closed_codes: [
      'VERIFIER_IDENTITY_INVALID',
      'QUALIFICATION_CLASS_INVALID',
      'QUALIFICATION_SCOPE_MISMATCH',
      'VERIFIER_NOT_QUALIFIED',
      'QUALIFICATION_NOT_YET_VALID',
      'QUALIFICATION_EXPIRED',
      'QUALIFICATION_REVOKED',
      'QUALIFICATION_INDEPENDENCE_INVALID',
      'ACCREDITATION_CLAIM_UNSUPPORTED'
    ],
    runtime_guard_vectors: vectors,
    closed_gap: {
      gap_id: 'L2-GAP-002',
      title: 'VerifierQualificationRecord runtime contract missing',
      closed_by: 'PROG-044',
      status: 'CLOSED_CONTRACT_AND_VALIDATOR_BASELINE',
      assurance_transition_integration_complete: false
    },
    remaining_open_gaps: ['L2-GAP-003', 'L2-GAP-004', 'L2-GAP-005', 'L2-GAP-006'],
    readiness_state: {
      verifier_qualification_contract_created: true,
      verifier_qualification_validator_created: true,
      assurance_transition_integration_complete: false,
      custody_runtime_complete: false,
      human_decision_runtime_complete: false,
      adapter_provenance_runtime_complete: false,
      b2g_t26_t43_harness_complete: false,
      b2g_candidate_ready: false,
      public_sector_production_ready: false
    },
    next_required_program: 'PROG-045-V3-5-R1-CUSTODY-EVENT-RECORD-CONTRACT',
    non_claims: {
      production_ready: false,
      b2g_candidate_ready: false,
      public_accreditation: false,
      procurement_eligibility: false,
      legal_validity: false,
      government_endorsement: false,
      external_validation_complete: false,
      level2_runtime_complete: false
    }
  };

  doc.revision_hash = sha256Digest(doc);
  return doc;
}

function writeContract(targetPath, options = {}) {
  const rootDir = options.rootDir || process.cwd();
  const doc = buildContract({ rootDir, repositoryCommit: options.repositoryCommit });
  fs.writeFileSync(path.join(rootDir, targetPath), `${JSON.stringify(doc, null, 2)}\n`, 'utf8');
  return doc;
}

if (require.main === module) {
  const targetPath = process.argv[2] || 'docs/launch/level2/v3-5-r1/v3-5-r1-verifier-qualification-record-contract.json';
  const doc = writeContract(targetPath, { rootDir: process.cwd() });
  console.log(`PROG_044_V3_5_R1_VERIFIER_QUALIFICATION_WRITTEN=${doc.revision_hash}`);
}

module.exports = {
  QUALIFICATION_CLASSES,
  validateVerifierQualificationRecord,
  sampleRecord,
  buildContract,
  writeContract
};
