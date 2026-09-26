'use strict';

const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');
const { sha256Digest } = require('../../packages/hbce-core/canonical-json.js');

const ADAPTER_CLASSES = Object.freeze(['MODEL_CONNECTOR', 'DATA_CONNECTOR', 'EVIDENCE_IMPORTER', 'EVIDENCE_EXPORTER', 'SYSTEM_BRIDGE', 'CUSTOM']);
const TRANSFORMATION_CLASSES = Object.freeze(['NONE', 'CANONICALIZE', 'REDACT', 'FILTER', 'EXTRACT', 'TRANSLATE', 'AGGREGATE']);
const PROVENANCE_STATUSES = Object.freeze(['COMPLETE', 'INCOMPLETE', 'UNVERIFIED', 'CONFLICTING']);
const EXPORT_BOUNDARY = Object.freeze(['NO_EXPORT', 'PROFILE_BOUND_EXPORT', 'REDACTED_EXPORT', 'BLOCKED_EXPORT']);

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

function sampleAdapterProfile(overrides = {}) {
  return {
    adapter_id: 'ADAPTER::B2G-DEMO-IMPORTER-001',
    adapter_version: '1.0.0',
    adapter_class: 'EVIDENCE_IMPORTER',
    source_system_ref: 'SOURCE_SYSTEM::DEMO',
    target_namespace: 'EVIDENCE',
    allowed_transformation_classes: ['CANONICALIZE', 'REDACT'],
    transformation_method_ref: 'TRANSFORM::DEMO-CANONICALIZE-v1',
    input_schema_ref: 'SCHEMA::INPUT-DEMO-v1',
    output_schema_ref: 'SCHEMA::OUTPUT-DEMO-v1',
    runtime_build_ref: 'BUILD::ADAPTER-DEMO-001',
    operator_or_service_ref: 'SERVICE::HBCE-B2G-DEMO',
    minimization_profile_ref: 'MINIMIZATION::PROFILE-001',
    export_boundary: 'PROFILE_BOUND_EXPORT',
    provenance_status: 'COMPLETE',
    limitations: ['demo adapter provenance profile; no external certification claim'],
    ...overrides
  };
}

function sampleAdapterEvent(overrides = {}) {
  return {
    adapter_event_id: 'ADAPTER-EVENT::DEMO-001',
    adapter_id: 'ADAPTER::B2G-DEMO-IMPORTER-001',
    input_ref: 'RAW::SOURCE-EVENT-001',
    input_hash: 'sha256:1111111111111111111111111111111111111111111111111111111111111111',
    output_ref: 'CANONICAL::SOURCE-EVENT-001',
    output_hash: 'sha256:2222222222222222222222222222222222222222222222222222222222222222',
    transformation_class: 'CANONICALIZE',
    transformation_method_ref: 'TRANSFORM::DEMO-CANONICALIZE-v1',
    event_time: '2026-09-26T00:00:00.000Z',
    custody_event_ref: 'CUSTODY-EVENT::DEMO-001',
    redaction_profile_ref_optional: null,
    export_profile_ref_optional: null,
    claims_source_of_truth_replacement: false,
    claims_public_authority: false,
    ...overrides
  };
}

function blocked(code) {
  return {
    valid: false,
    code,
    adapter_provenance_accepted: false,
    canonical_mutation_permitted: false,
    source_of_truth_replacement_permitted: false,
    public_authority_created: false,
    export_permitted: false
  };
}

function validateAdapterProvenanceProfile(profile) {
  if (!profile || typeof profile !== 'object') return blocked('ADAPTER_PROFILE_INVALID');
  if (!hasText(profile.adapter_id) || !hasText(profile.adapter_version)) return blocked('ADAPTER_ID_INVALID');
  if (!ADAPTER_CLASSES.includes(profile.adapter_class)) return blocked('ADAPTER_CLASS_INVALID');
  if (!hasText(profile.source_system_ref) || !hasText(profile.target_namespace)) return blocked('ADAPTER_SOURCE_TARGET_INVALID');
  if (!hasNonEmptyTextArray(profile.allowed_transformation_classes)) return blocked('ADAPTER_TRANSFORMATION_PROFILE_INVALID');
  if (profile.allowed_transformation_classes.some((c) => !TRANSFORMATION_CLASSES.includes(c))) return blocked('ADAPTER_TRANSFORMATION_PROFILE_INVALID');
  if (!hasText(profile.transformation_method_ref) || !hasText(profile.input_schema_ref) || !hasText(profile.output_schema_ref)) return blocked('ADAPTER_METHOD_OR_SCHEMA_MISSING');
  if (!hasText(profile.runtime_build_ref) || !hasText(profile.operator_or_service_ref)) return blocked('ADAPTER_RUNTIME_PROVENANCE_INCOMPLETE');
  if (!EXPORT_BOUNDARY.includes(profile.export_boundary)) return blocked('ADAPTER_EXPORT_BOUNDARY_INVALID');
  if (!PROVENANCE_STATUSES.includes(profile.provenance_status)) return blocked('ADAPTER_PROVENANCE_STATUS_INVALID');
  if (profile.provenance_status !== 'COMPLETE') return blocked('ADAPTER_PROVENANCE_INCOMPLETE');

  return {
    valid: true,
    code: 'ADAPTER_PROFILE_VALID',
    adapter_provenance_accepted: true,
    canonical_mutation_permitted: false,
    source_of_truth_replacement_permitted: false,
    public_authority_created: false,
    export_permitted: profile.export_boundary === 'PROFILE_BOUND_EXPORT' || profile.export_boundary === 'REDACTED_EXPORT'
  };
}

function validateAdapterTransformation(profile, event) {
  const profileResult = validateAdapterProvenanceProfile(profile);
  if (!profileResult.valid) return profileResult;

  if (!event || typeof event !== 'object') return blocked('ADAPTER_EVENT_INVALID');
  if (!hasText(event.adapter_event_id) || event.adapter_id !== profile.adapter_id) return blocked('ADAPTER_EVENT_ID_INVALID');
  if (!hasText(event.input_ref) || !hasText(event.input_hash) || !hasText(event.output_ref) || !hasText(event.output_hash)) return blocked('ADAPTER_EVENT_HASH_BINDING_INCOMPLETE');
  if (!TRANSFORMATION_CLASSES.includes(event.transformation_class)) return blocked('ADAPTER_TRANSFORMATION_CLASS_INVALID');
  if (!profile.allowed_transformation_classes.includes(event.transformation_class)) return blocked('ADAPTER_TRANSFORMATION_NOT_ALLOWED');
  if (event.transformation_method_ref !== profile.transformation_method_ref) return blocked('ADAPTER_TRANSFORMATION_METHOD_MISMATCH');
  if (!hasText(event.event_time) || !hasText(event.custody_event_ref)) return blocked('ADAPTER_EVENT_CUSTODY_INCOMPLETE');
  if (event.claims_source_of_truth_replacement === true) return blocked('SOURCE_OF_TRUTH_REPLACEMENT_DENIED');
  if (event.claims_public_authority === true) return blocked('PUBLIC_AUTHORITY_CLAIM_UNSUPPORTED');

  if (profile.export_boundary === 'NO_EXPORT' && hasText(event.export_profile_ref_optional)) return blocked('EXPORT_BOUNDARY_VIOLATION');
  if (profile.export_boundary === 'REDACTED_EXPORT' && !hasText(event.redaction_profile_ref_optional)) return blocked('REDACTION_REQUIRED');

  return {
    valid: true,
    code: 'ADAPTER_TRANSFORMATION_VALID',
    adapter_provenance_accepted: true,
    canonical_mutation_permitted: false,
    source_of_truth_replacement_permitted: false,
    public_authority_created: false,
    export_permitted: profile.export_boundary === 'PROFILE_BOUND_EXPORT' || profile.export_boundary === 'REDACTED_EXPORT'
  };
}

function buildContract(options = {}) {
  const rootDir = options.rootDir || process.cwd();
  const repositoryCommit = options.repositoryCommit || gitHead(rootDir);
  const sourcePath = 'docs/launch/level2/v3-5-r1/v3-5-r1-human-decision-profile-contract.json';
  const source = readJson(rootDir, sourcePath);

  const vectors = [
    ['B2G-T40', 'adapter profile missing source system', sampleAdapterProfile({ source_system_ref: '' }), sampleAdapterEvent()],
    ['B2G-T41', 'adapter provenance incomplete', sampleAdapterProfile({ provenance_status: 'INCOMPLETE' }), sampleAdapterEvent()],
    ['B2G-T42', 'adapter attempts unallowed transformation', sampleAdapterProfile(), sampleAdapterEvent({ transformation_class: 'AGGREGATE' })],
    ['B2G-T43', 'adapter claims source-of-truth replacement or public authority', sampleAdapterProfile(), sampleAdapterEvent({ claims_source_of_truth_replacement: true, claims_public_authority: true })],
    ['B2G-POS-004', 'valid adapter provenance and transformation event', sampleAdapterProfile(), sampleAdapterEvent()]
  ].map(([id, stimulus, profile, event]) => ({
    vector_id: id,
    stimulus,
    result: validateAdapterTransformation(profile, event)
  }));

  const doc = {
    proto: 'HBCE-B2G-L2-JC2-V3-5-R1-ADAPTER-PROVENANCE-PROFILE-CONTRACT-v1',
    kind: 'HBCE_B2G_LEVEL2_JOKER_C2_V3_5_R1_ADAPTER_PROVENANCE_PROFILE_CONTRACT',
    document_code: 'HBCE-B2G-L2-JC2-PROG-2027-0001',
    specification_baseline: 'V3.5-R1 - Forensic Evidence & Verifier Qualification Hardening - 26 September 2026',
    issue_id: 'PROG-047',
    priority: 'V3.5-R1-ADAPTER-PROVENANCE-PROFILE-CONTRACT',
    repository_baseline_commit: repositoryCommit,

    source_human_decision_contract_ref: sourcePath,
    source_human_decision_contract_revision_hash: source.revision_hash,
    source_human_decision_contract_revision_hash_valid: validHash(source),

    governing_producer: 'PRODUCER::EXPORT_CONTROL',
    schema_producer: 'PRODUCER::SCHEMA_REGISTRY',

    invariant: {
      adapter_identity_and_version_are_required: true,
      source_system_and_target_namespace_are_required: true,
      transformation_method_and_schema_refs_are_required: true,
      runtime_build_and_service_refs_are_required: true,
      adapter_event_requires_input_and_output_hash_binding: true,
      adapter_event_requires_custody_event_ref: true,
      adapter_cannot_replace_source_of_truth: true,
      adapter_cannot_create_public_authority: true,
      adapter_cannot_emit_assurance_or_evidentiary_verdict: true,
      export_requires_profile_boundary: true,
      redacted_export_requires_redaction_profile: true
    },

    contract_fields: [
      'adapter_id',
      'adapter_version',
      'adapter_class',
      'source_system_ref',
      'target_namespace',
      'allowed_transformation_classes',
      'transformation_method_ref',
      'input_schema_ref',
      'output_schema_ref',
      'runtime_build_ref',
      'operator_or_service_ref',
      'minimization_profile_ref',
      'export_boundary',
      'provenance_status',
      'limitations'
    ],

    event_fields: [
      'adapter_event_id',
      'adapter_id',
      'input_ref',
      'input_hash',
      'output_ref',
      'output_hash',
      'transformation_class',
      'transformation_method_ref',
      'event_time',
      'custody_event_ref',
      'redaction_profile_ref_optional',
      'export_profile_ref_optional',
      'claims_source_of_truth_replacement',
      'claims_public_authority'
    ],

    allowed_adapter_classes: ADAPTER_CLASSES,
    allowed_transformation_classes: TRANSFORMATION_CLASSES,
    allowed_provenance_statuses: PROVENANCE_STATUSES,
    allowed_export_boundaries: EXPORT_BOUNDARY,

    fail_closed_codes: [
      'ADAPTER_PROFILE_INVALID',
      'ADAPTER_ID_INVALID',
      'ADAPTER_CLASS_INVALID',
      'ADAPTER_SOURCE_TARGET_INVALID',
      'ADAPTER_TRANSFORMATION_PROFILE_INVALID',
      'ADAPTER_METHOD_OR_SCHEMA_MISSING',
      'ADAPTER_RUNTIME_PROVENANCE_INCOMPLETE',
      'ADAPTER_EXPORT_BOUNDARY_INVALID',
      'ADAPTER_PROVENANCE_STATUS_INVALID',
      'ADAPTER_PROVENANCE_INCOMPLETE',
      'ADAPTER_EVENT_INVALID',
      'ADAPTER_EVENT_ID_INVALID',
      'ADAPTER_EVENT_HASH_BINDING_INCOMPLETE',
      'ADAPTER_TRANSFORMATION_CLASS_INVALID',
      'ADAPTER_TRANSFORMATION_NOT_ALLOWED',
      'ADAPTER_TRANSFORMATION_METHOD_MISMATCH',
      'ADAPTER_EVENT_CUSTODY_INCOMPLETE',
      'SOURCE_OF_TRUTH_REPLACEMENT_DENIED',
      'PUBLIC_AUTHORITY_CLAIM_UNSUPPORTED',
      'EXPORT_BOUNDARY_VIOLATION',
      'REDACTION_REQUIRED'
    ],

    runtime_guard_vectors: vectors,

    closed_gap: {
      gap_id: 'L2-GAP-005',
      title: 'AdapterProvenanceProfile runtime contract missing',
      closed_by: 'PROG-047',
      status: 'CLOSED_CONTRACT_AND_VALIDATOR_BASELINE',
      adapter_provenance_runtime_integration_complete: false
    },

    remaining_open_gaps: ['L2-GAP-006'],

    readiness_state: {
      adapter_provenance_profile_contract_created: true,
      adapter_provenance_validator_created: true,
      adapter_provenance_runtime_integration_complete: false,
      b2g_t26_t43_harness_complete: false,
      b2g_candidate_ready: false,
      public_sector_production_ready: false
    },

    next_required_program: 'PROG-048-V3-5-R1-B2G-T26-T43-RUNTIME-HARNESS',

    non_claims: {
      production_ready: false,
      b2g_candidate_ready: false,
      public_accreditation: false,
      procurement_eligibility: false,
      legal_validity: false,
      government_endorsement: false,
      public_authority_created: false,
      source_of_truth_replacement: false,
      assurance_verdict_created: false,
      evidentiary_verdict_created: false,
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
  const targetPath = process.argv[2] || 'docs/launch/level2/v3-5-r1/v3-5-r1-adapter-provenance-profile-contract.json';
  const doc = writeContract(targetPath, { rootDir: process.cwd() });
  console.log(`PROG_047_V3_5_R1_ADAPTER_PROVENANCE_WRITTEN=${doc.revision_hash}`);
}

module.exports = {
  ADAPTER_CLASSES,
  TRANSFORMATION_CLASSES,
  PROVENANCE_STATUSES,
  EXPORT_BOUNDARY,
  sampleAdapterProfile,
  sampleAdapterEvent,
  validateAdapterProvenanceProfile,
  validateAdapterTransformation,
  buildContract,
  writeContract
};
