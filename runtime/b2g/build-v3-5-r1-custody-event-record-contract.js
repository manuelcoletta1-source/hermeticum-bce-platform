'use strict';

const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');
const { sha256Digest } = require('../../packages/hbce-core/canonical-json.js');

const EVENT_TYPES = Object.freeze(['ACQUIRE', 'TRANSFORM', 'ACCESS', 'TRANSFER', 'EXPORT', 'HOLD', 'DELETE', 'SEAL']);
const TIME_ASSURANCE = Object.freeze(['UNVERIFIED', 'SYSTEM_RECORDED', 'SIGNED_SOURCE', 'EXTERNAL_TIMESTAMP_REFERENCED']);
const VERIFICATION_STATUS = Object.freeze(['VALID', 'INCOMPLETE', 'BROKEN', 'UNVERIFIED_TIME', 'INVALID_SEAL']);

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

function hashEventBody(event) {
  const body = { ...event };
  delete body.event_hash;
  return sha256Digest(body);
}

function sampleCustodyEvent(overrides = {}) {
  const base = {
    custody_event_id: 'CUSTODY-EVENT::DEMO-001',
    evidence_id: 'EVIDENCE::CHAINED-RUNTIME-ARTIFACT-001',
    source_ref: 'SOURCE::DEMO-CONTROLLER-LOG',
    custodian_ref: 'PRODUCER::EVIDENCE_CUSTODY',
    event_type: 'SEAL',
    event_time: '2026-09-26T00:00:00.000Z',
    time_source_ref: 'TIME_SOURCE::SYSTEM_CLOCK::DEMO',
    time_assurance: 'SYSTEM_RECORDED',
    previous_event_hash: 'sha256:0000000000000000000000000000000000000000000000000000000000000000',
    signature_ref_optional: null,
    seal_ref_optional: 'SEAL::DEMO-001',
    claims_signed_or_sealed_evidence: true,
    verification_status: 'VALID',
    limitations: ['demo custody event; no legal timestamp claim']
  };

  const event = { ...base, ...overrides };
  event.event_hash = hashEventBody(event);
  return event;
}

function blocked(code) {
  return {
    valid: false,
    code,
    custody_claim_permitted: false,
    evidentiary_promotion_permitted: false,
    proves_identity: false,
    proves_trusted_time: false,
    proves_legal_authenticity: false
  };
}

function validateCustodyEventRecord(event, options = {}) {
  const previousRequired = options.previous_event_hash_required !== false;

  if (!event || typeof event !== 'object') return blocked('CUSTODY_EVENT_INVALID');
  if (!hasText(event.custody_event_id) || !hasText(event.evidence_id) || !hasText(event.custodian_ref)) return blocked('CUSTODY_EVENT_ID_INVALID');
  if (!EVENT_TYPES.includes(event.event_type)) return blocked('CUSTODY_EVENT_TYPE_INVALID');
  if (!hasText(event.event_time) || !hasText(event.time_source_ref)) return blocked('TIME_PROVENANCE_INCOMPLETE');
  if (!TIME_ASSURANCE.includes(event.time_assurance)) return blocked('TIME_ASSURANCE_INVALID');
  if (previousRequired && !hasText(event.previous_event_hash)) return blocked('CHAIN_OF_CUSTODY_BROKEN');
  if (!VERIFICATION_STATUS.includes(event.verification_status)) return blocked('CUSTODY_VERIFICATION_STATUS_INVALID');

  if (!hasText(event.event_hash) || event.event_hash !== hashEventBody(event)) return blocked('EVIDENCE_INTEGRITY_INVALID');
  if (event.verification_status === 'INVALID_SEAL') return blocked('EVIDENCE_SEAL_INVALID');
  if (event.verification_status === 'VALID' && event.time_assurance === 'UNVERIFIED') return blocked('UNVERIFIED_TIME');

  const hasSignatureOrSeal = hasText(event.signature_ref_optional) || hasText(event.seal_ref_optional);
  if (event.claims_signed_or_sealed_evidence === true && !hasSignatureOrSeal) return blocked('SIGNATURE_OR_SEAL_CLAIM_UNSUPPORTED');

  return {
    valid: true,
    code: 'CUSTODY_EVENT_VALID',
    custody_claim_permitted: true,
    evidentiary_promotion_permitted: false,
    proves_identity: false,
    proves_trusted_time: false,
    proves_legal_authenticity: false
  };
}

function buildContract(options = {}) {
  const rootDir = options.rootDir || process.cwd();
  const repositoryCommit = options.repositoryCommit || gitHead(rootDir);
  const sourcePath = 'docs/launch/level2/v3-5-r1/v3-5-r1-verifier-qualification-record-contract.json';
  const source = readJson(rootDir, sourcePath);

  const vectors = [
    ['B2G-T32', 'custody event lacks previous_event_hash', sampleCustodyEvent({ previous_event_hash: '' })],
    ['B2G-T33', 'material timestamp lacks time_source_ref', sampleCustodyEvent({ time_source_ref: '' })],
    ['B2G-T34', 'signed/sealed evidence claimed without signature or seal ref', sampleCustodyEvent({ signature_ref_optional: null, seal_ref_optional: null })],
    ['B2G-T35', 'custody seal/hash verification fails', sampleCustodyEvent({ verification_status: 'INVALID_SEAL' })],
    ['B2G-POS-002', 'valid custody event record', sampleCustodyEvent()]
  ].map(([id, stimulus, event]) => ({
    vector_id: id,
    stimulus,
    result: validateCustodyEventRecord(event)
  }));

  const doc = {
    proto: 'HBCE-B2G-L2-JC2-V3-5-R1-CUSTODY-EVENT-RECORD-CONTRACT-v1',
    kind: 'HBCE_B2G_LEVEL2_JOKER_C2_V3_5_R1_CUSTODY_EVENT_RECORD_CONTRACT',
    document_code: 'HBCE-B2G-L2-JC2-PROG-2027-0001',
    specification_baseline: 'V3.5-R1 - Forensic Evidence & Verifier Qualification Hardening - 26 September 2026',
    issue_id: 'PROG-045',
    priority: 'V3.5-R1-CUSTODY-EVENT-RECORD-CONTRACT',
    repository_baseline_commit: repositoryCommit,

    source_verifier_qualification_contract_ref: sourcePath,
    source_verifier_qualification_contract_revision_hash: source.revision_hash,
    source_verifier_qualification_contract_revision_hash_valid: validHash(source),

    governing_producer: 'PRODUCER::EVIDENCE_CUSTODY',

    invariant: {
      event_hash_binds_event_body: true,
      previous_event_hash_binds_append_only_sequence: true,
      hash_does_not_prove_identity: true,
      hash_does_not_prove_trusted_time: true,
      hash_does_not_prove_legal_authenticity: true,
      time_source_is_distinct_from_digest: true,
      signature_or_seal_claim_requires_actual_reference: true,
      broken_custody_limits_claims_without_erasing_artifact: true,
      custody_event_does_not_emit_evidentiary_status: true
    },

    contract_fields: [
      'custody_event_id',
      'evidence_id',
      'source_ref',
      'custodian_ref',
      'event_type',
      'event_time',
      'time_source_ref',
      'time_assurance',
      'previous_event_hash',
      'event_hash',
      'signature_ref_optional',
      'seal_ref_optional',
      'verification_status',
      'limitations'
    ],

    allowed_event_types: EVENT_TYPES,
    allowed_time_assurance: TIME_ASSURANCE,
    allowed_verification_status: VERIFICATION_STATUS,

    fail_closed_codes: [
      'CUSTODY_EVENT_INVALID',
      'CUSTODY_EVENT_ID_INVALID',
      'CUSTODY_EVENT_TYPE_INVALID',
      'TIME_PROVENANCE_INCOMPLETE',
      'TIME_ASSURANCE_INVALID',
      'CHAIN_OF_CUSTODY_BROKEN',
      'CUSTODY_VERIFICATION_STATUS_INVALID',
      'EVIDENCE_INTEGRITY_INVALID',
      'EVIDENCE_SEAL_INVALID',
      'UNVERIFIED_TIME',
      'SIGNATURE_OR_SEAL_CLAIM_UNSUPPORTED'
    ],

    runtime_guard_vectors: vectors,

    closed_gap: {
      gap_id: 'L2-GAP-003',
      title: 'CustodyEventRecord and trusted-time boundary runtime contract missing',
      closed_by: 'PROG-045',
      status: 'CLOSED_CONTRACT_AND_VALIDATOR_BASELINE',
      custody_runtime_integration_complete: false
    },

    remaining_open_gaps: ['L2-GAP-004', 'L2-GAP-005', 'L2-GAP-006'],

    readiness_state: {
      custody_event_contract_created: true,
      custody_event_validator_created: true,
      custody_runtime_integration_complete: false,
      human_decision_runtime_complete: false,
      adapter_provenance_runtime_complete: false,
      b2g_t26_t43_harness_complete: false,
      b2g_candidate_ready: false,
      public_sector_production_ready: false
    },

    next_required_program: 'PROG-046-V3-5-R1-HUMAN-DECISION-PROFILE-CONTRACT',

    non_claims: {
      production_ready: false,
      b2g_candidate_ready: false,
      public_accreditation: false,
      procurement_eligibility: false,
      legal_validity: false,
      government_endorsement: false,
      trusted_time_certification: false,
      legal_chain_of_custody: false,
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
  const targetPath = process.argv[2] || 'docs/launch/level2/v3-5-r1/v3-5-r1-custody-event-record-contract.json';
  const doc = writeContract(targetPath, { rootDir: process.cwd() });
  console.log(`PROG_045_V3_5_R1_CUSTODY_EVENT_WRITTEN=${doc.revision_hash}`);
}

module.exports = {
  EVENT_TYPES,
  TIME_ASSURANCE,
  VERIFICATION_STATUS,
  sampleCustodyEvent,
  validateCustodyEventRecord,
  buildContract,
  writeContract
};
