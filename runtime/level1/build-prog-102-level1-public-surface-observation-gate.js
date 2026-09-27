'use strict';

const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');
const { sha256Digest } = require('../../packages/hbce-core/canonical-json.js');

const STATUS = 'LEVEL1_PUBLIC_SURFACE_OBSERVATION_GATE_BLOCKED_MISSING_OBSERVATION_INPUTS';
const SOURCE_REF = 'docs/launch/level1/prog-101-level1-public-surface-observation-record.json';

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

function buildObservationGateCriteria(source) {
  const record = source.public_surface_observation_record;

  return {
    source_public_surface_observation_record_hash_valid: validHash(source),
    source_public_surface_observation_record_ready: source.readiness_state.public_surface_observation_record_ready === true,
    source_public_surface_release_manifest_ready: source.readiness_state.public_surface_release_manifest_ready === true,
    source_public_surface_ready: source.readiness_state.public_surface_ready === true,
    source_publication_authorized: source.readiness_state.publication_authorized === true,
    source_publication_authorization_scope_limited: source.readiness_state.publication_authorization_scope_limited === true,
    all_release_surfaces_have_observation_targets: source.readiness_state.all_release_surfaces_have_observation_targets === true,
    public_observation_inputs_present: record.public_observation_inputs_present === true,
    all_targets_have_public_url: record.observation_targets.every((target) => typeof target.public_url === 'string' && target.public_url.length > 0),
    all_targets_have_observer_ref: record.observation_targets.every((target) => typeof target.observer_ref === 'string' && target.observer_ref.length > 0),
    all_targets_have_observed_content_digest: record.observation_targets.every((target) => typeof target.observed_content_digest === 'string' && target.observed_content_digest.startsWith('sha256:')),
    all_targets_scope_matches_manifest: record.observation_targets.every((target) => target.observed_scope_matches_manifest === true),
    all_targets_non_claims_present: record.observation_targets.every((target) => target.observed_non_claims_present === true),
    all_targets_evidence_references_present: record.observation_targets.every((target) => target.observed_evidence_references_present === true),
    all_forbidden_claims_absent_from_record: record.all_forbidden_claims_absent_from_record === true,
    external_customer_readiness_excluded: record.external_customer_ready === false,
    banking_pack_readiness_excluded: record.banking_pack_ready === false,
    launch_readiness_excluded: record.level1_launch_ready === false,
    production_readiness_excluded: record.production_ready === false,
    ai_authority_excluded: record.ai_observation_record_authority_allowed === false
  };
}

function buildObservationGatePayload(source) {
  const record = source.public_surface_observation_record;
  const criteria = buildObservationGateCriteria(source);
  const blockingCriteria = Object.entries(criteria)
    .filter(([_key, value]) => value !== true)
    .map(([key]) => key);

  const gatePassed = blockingCriteria.length === 0;

  return {
    public_surface_observation_gate_id: 'PUBLIC-SURFACE-OBSERVATION-GATE::HBCE-L1-DECISION-PROOF-0001',
    source_public_surface_observation_record_ref: SOURCE_REF,
    source_public_surface_observation_record_digest: record.public_surface_observation_record_payload_digest,
    gate_scope: 'LEVEL1_DECISION_PROOF_PUBLIC_SURFACE_CONTROLLED_INFORMATION_ONLY',
    gate_status: gatePassed ? 'PASS_PUBLIC_SURFACE_OBSERVATION_READY' : 'BLOCKED_MISSING_PUBLIC_OBSERVATION_INPUTS',
    gate_result: gatePassed ? 'PUBLIC_SURFACE_OBSERVED_AND_READY' : 'PUBLIC_SURFACE_OBSERVATION_NOT_READY',
    evaluated_at: '2027-01-19T17:10:00Z',
    gate_criteria: criteria,
    blocking_criteria: blockingCriteria,
    all_gate_criteria_passed: gatePassed,
    observation_inputs_required: record.public_observation_inputs_required,
    observation_inputs_present: record.public_observation_inputs_present,
    observation_targets_evaluated: record.observation_targets.map((target) => ({
      observation_target_id: target.observation_target_id,
      surface_type: target.surface_type,
      observation_status: target.observation_status,
      public_url_present: typeof target.public_url === 'string' && target.public_url.length > 0,
      observer_ref_present: typeof target.observer_ref === 'string' && target.observer_ref.length > 0,
      observed_content_digest_present: typeof target.observed_content_digest === 'string' && target.observed_content_digest.startsWith('sha256:'),
      observed_scope_matches_manifest: target.observed_scope_matches_manifest === true,
      observed_non_claims_present: target.observed_non_claims_present === true,
      observed_evidence_references_present: target.observed_evidence_references_present === true,
      observation_ready: false
    })),
    approved_public_surface_claims_after_gate: {
      public_surface_ready_controlled_information_only: true,
      publication_authorized_for_controlled_public_information_surface: true,
      public_surface_observation_record_defined: true,
      public_surface_observation_gate_evaluated: true,
      public_surface_observed: false,
      public_surface_observation_ready: false
    },
    blocked_claims_after_gate: {
      public_surface_observed: true,
      public_surface_observation_ready: true,
      external_customer_delivery_ready: true,
      banking_pack_ready: true,
      level1_launch_ready: true,
      production_ready: true,
      legal_validity: true,
      public_accreditation: true,
      procurement_eligibility: true,
      security_certification: true,
      pricing_commitment: true,
      sla_commitment: true,
      ai_authority: true,
      autonomous_execution: true,
      external_effect_proven: true,
      business_success: true
    },
    observation_gate_controls: [
      'block_until_public_url_present',
      'block_until_observer_ref_present',
      'block_until_observed_content_digest_present',
      'block_until_scope_match_true',
      'block_until_non_claims_present_true',
      'block_until_evidence_references_present_true',
      'do_not_infer_public_observation_from_release_manifest',
      'do_not_infer_public_observation_from_observation_record',
      'do_not_claim_external_customer_delivery_readiness',
      'do_not_claim_banking_pack_readiness',
      'do_not_claim_level1_launch_readiness',
      'do_not_claim_production_readiness',
      'do_not_claim_legal_validity',
      'do_not_claim_security_certification',
      'do_not_authorize_ai_authority',
      'fail_closed_on_missing_observation_input'
    ],
    observation_gate_boundary: {
      controlled_information_surface_only: true,
      observation_gate_only: true,
      no_public_observation_recorded: true,
      source_observation_record_required: true,
      source_release_manifest_required: true,
      source_registry_entry_required: true,
      source_publication_snapshot_required: true,
      source_readiness_gate_required: true,
      source_evidence_index_required: true,
      source_copy_pack_required: true,
      source_content_model_required: true,
      source_scope_lock_required: true,
      no_customer_data: true,
      no_live_system_control: true,
      no_production_integration: true,
      no_legal_validity_claim: true,
      no_public_accreditation_claim: true,
      no_procurement_eligibility_claim: true,
      no_external_effect_claim: true,
      no_business_success_claim: true,
      no_ai_authority_claim: true,
      no_pricing_commitment: true,
      no_sla_commitment: true,
      no_security_certification_claim: true,
      no_customer_logo_without_authorization: true
    },
    source_public_surface_observation_record_ready: source.readiness_state.public_surface_observation_record_ready === true,
    source_public_surface_ready: source.readiness_state.public_surface_ready === true,
    source_publication_authorized: source.readiness_state.publication_authorized === true,
    source_publication_authorization_scope_limited: source.readiness_state.publication_authorization_scope_limited === true,
    public_surface_observation_gate_evaluated: true,
    public_surface_observation_gate_passed: gatePassed,
    public_surface_observed: false,
    public_surface_observation_ready: false,
    public_surface_ready: true,
    publication_authorized: true,
    publication_authorization_scope_limited: true,
    external_customer_ready: false,
    banking_pack_ready: false,
    level1_launch_ready: false,
    production_ready: false,
    observation_gate_comment: 'The observation gate is evaluated and blocked because public observation inputs are missing. Public observation readiness remains false until public URLs, observer references, observed content digests, scope match, non-claims presence and evidence-reference presence are supplied and verified.',
    ai_observation_gate_authority_allowed: false
  };
}

function buildLevel1PublicSurfaceObservationGate(options = {}) {
  const rootDir = options.rootDir || process.cwd();
  const source = readJson(rootDir, SOURCE_REF);
  const payload = buildObservationGatePayload(source);

  const checklist = {
    source_public_surface_observation_record_hash_valid: validHash(source),
    source_public_surface_observation_record_ready: source.readiness_state.public_surface_observation_record_ready === true,
    source_public_surface_ready: source.readiness_state.public_surface_ready === true,
    source_publication_authorized: source.readiness_state.publication_authorized === true,
    source_publication_authorization_scope_limited: source.readiness_state.publication_authorization_scope_limited === true,
    observation_gate_evaluated: payload.public_surface_observation_gate_evaluated,
    observation_gate_blocked_missing_inputs: payload.public_surface_observation_gate_passed === false,
    public_observation_inputs_present: payload.observation_inputs_present,
    blocking_criteria_present: payload.blocking_criteria.length > 0,
    public_surface_observed: payload.public_surface_observed,
    public_surface_observation_ready: payload.public_surface_observation_ready,
    public_observation_ready: payload.public_surface_observation_ready,
    external_customer_readiness_excluded: payload.external_customer_ready === false,
    banking_pack_readiness_excluded: payload.banking_pack_ready === false,
    launch_readiness_excluded: payload.level1_launch_ready === false,
    production_readiness_excluded: payload.production_ready === false,
    ai_authority_absence_confirmed: payload.ai_observation_gate_authority_allowed === false
  };

  const doc = {
    proto: 'HBCE-L1-PROG-102-PUBLIC-SURFACE-OBSERVATION-GATE-v1',
    kind: 'HBCE_LEVEL1_PUBLIC_SURFACE_OBSERVATION_GATE',
    document_code: 'HBCE-L1-PUBLIC-SURFACE-OBSERVATION-GATE-2027-PROG-102',
    issue_id: 'PROG-102',
    priority: 'LEVEL1-PUBLIC-SURFACE-OBSERVATION-GATE',
    repository_baseline_commit: options.repositoryCommit || gitHead(rootDir),

    source_public_surface_observation_record_ref: SOURCE_REF,
    source_public_surface_observation_record_revision_hash: source.revision_hash,
    source_public_surface_observation_record_revision_hash_valid: validHash(source),

    level1_public_surface_observation_gate_status: STATUS,

    inherited_public_surface_observation_record: {
      observation_record_status: source.level1_public_surface_observation_record_status,
      observation_scope: source.public_surface_observation_record.observation_scope,
      observation_status: source.public_surface_observation_record.observation_status,
      public_surface_observation_record_ready: source.readiness_state.public_surface_observation_record_ready,
      public_surface_ready: source.readiness_state.public_surface_ready,
      publication_authorized: source.readiness_state.publication_authorized,
      publication_authorization_scope: source.readiness_state.publication_authorization_scope,
      prior_public_surface_observed: source.readiness_state.public_surface_observed,
      prior_public_surface_observation_ready: source.readiness_state.public_surface_observation_ready,
      prior_external_customer_ready: source.readiness_state.external_customer_ready,
      prior_banking_pack_ready: source.readiness_state.banking_pack_ready,
      prior_level1_launch_ready: source.readiness_state.level1_launch_ready,
      prior_production_ready: source.readiness_state.production_ready
    },

    public_surface_observation_gate: {
      ...payload,
      public_surface_observation_gate_payload_digest: sha256Digest(payload),
      observation_gate_checklist: checklist,
      public_surface_observation_gate_defined: true,
      public_surface_observation_gate_is_blocked_missing_inputs: true,
      public_surface_observation_gate_is_not_observation_evidence: true,
      public_surface_observation_gate_is_not_public_observation_ready: true,
      public_surface_observation_gate_is_not_external_customer_readiness: true,
      public_surface_observation_gate_is_not_banking_pack_readiness: true,
      public_surface_observation_gate_is_not_launch_readiness: true,
      public_surface_observation_gate_is_not_production_readiness: true,
      public_surface_observation_gate_is_not_legal_validity: true,
      public_surface_observation_gate_is_not_security_certification: true,
      public_surface_observation_gate_does_not_authorize_ai_authority: true
    },

    fail_closed_codes: [
      'PUBLIC_SURFACE_OBSERVATION_GATE_MISSING',
      'SOURCE_PUBLIC_SURFACE_OBSERVATION_RECORD_HASH_INVALID',
      'PUBLIC_SURFACE_OBSERVATION_RECORD_NOT_READY',
      'PUBLIC_URL_MISSING',
      'OBSERVER_REF_MISSING',
      'OBSERVED_CONTENT_DIGEST_MISSING',
      'OBSERVED_SCOPE_MATCH_MISSING',
      'OBSERVED_NON_CLAIMS_PRESENCE_MISSING',
      'OBSERVED_EVIDENCE_REFERENCES_MISSING',
      'PUBLIC_OBSERVATION_GATE_BLOCKED_MISSING_INPUTS',
      'UNSUPPORTED_PUBLIC_OBSERVATION_READY_CLAIM',
      'UNSUPPORTED_EXTERNAL_CUSTOMER_READINESS_CLAIM',
      'UNSUPPORTED_BANKING_READINESS_CLAIM',
      'UNSUPPORTED_LAUNCH_READINESS_CLAIM',
      'UNSUPPORTED_PRODUCTION_READINESS_CLAIM',
      'AI_OBSERVATION_GATE_AUTHORITY_CLAIM_BLOCKED'
    ],

    readiness_state: {
      public_surface_observation_gate_defined: true,
      public_surface_observation_gate_evaluated: true,
      public_surface_observation_gate_passed: false,
      source_public_surface_observation_record_bound: true,
      public_surface_observation_record_ready: true,
      public_surface_ready: true,
      publication_authorized: true,
      publication_authorization_scope: 'controlled_public_information_surface_only',
      publication_authorization_scope_limited: true,
      observation_gate_blocked_missing_inputs: true,
      public_observation_inputs_present: false,
      public_surface_observed: false,
      public_surface_observation_ready: false,
      external_customer_ready: false,
      banking_pack_ready: false,
      level1_launch_ready: false,
      production_ready: false
    },

    next_required_program: 'PROG-103-HBCE-LEVEL1-PUBLIC-SURFACE-OBSERVATION-INPUT-PACK',

    non_claims: {
      legal_validity: false,
      public_accreditation: false,
      procurement_eligibility: false,
      external_effect_proven: false,
      business_success: false,
      ai_authority: false,
      autonomous_authority: false,
      public_surface_observed: false,
      public_surface_observation_ready: false,
      external_customer_ready: false,
      banking_pack_ready: false,
      level1_launch_ready: false,
      production_ready: false
    }
  };

  doc.revision_hash = sha256Digest(doc);
  return doc;
}

function writeLevel1PublicSurfaceObservationGate(targetPath, options = {}) {
  const rootDir = options.rootDir || process.cwd();
  const doc = buildLevel1PublicSurfaceObservationGate({ rootDir, repositoryCommit: options.repositoryCommit });
  fs.writeFileSync(path.join(rootDir, targetPath), `${JSON.stringify(doc, null, 2)}\n`);
  return doc;
}

if (require.main === module) {
  const targetPath = process.argv[2] || 'docs/launch/level1/prog-102-level1-public-surface-observation-gate.json';
  const doc = writeLevel1PublicSurfaceObservationGate(targetPath, { rootDir: process.cwd() });
  console.log(`PROG_102_LEVEL1_PUBLIC_SURFACE_OBSERVATION_GATE_WRITTEN=${doc.revision_hash}`);
}

module.exports = {
  STATUS,
  SOURCE_REF,
  buildObservationGateCriteria,
  buildObservationGatePayload,
  buildLevel1PublicSurfaceObservationGate,
  writeLevel1PublicSurfaceObservationGate
};
