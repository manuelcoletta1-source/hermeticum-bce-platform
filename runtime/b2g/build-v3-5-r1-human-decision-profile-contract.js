'use strict';

const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');
const { sha256Digest } = require('../../packages/hbce-core/canonical-json.js');

const APPROVAL_REQUIREMENTS = Object.freeze(['NOT_REQUIRED', 'REQUIRED_SINGLE', 'REQUIRED_MULTI', 'REQUIRED_THRESHOLD']);
const DECISION_STATUSES = Object.freeze(['PENDING', 'APPROVED', 'DENIED', 'EXPIRED', 'REVOKED']);
const FRESHNESS_STATUS = Object.freeze(['FRESH', 'STALE', 'EXPIRED']);
const MATERIAL_BINDINGS = Object.freeze([
  'action_digest',
  'authority_ref',
  'mandate_ref',
  'policy_version',
  'scope_ref',
  'target_ref'
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

function uniqueTexts(values) {
  return Array.isArray(values) && values.length > 0 && values.every(hasText) && new Set(values).size === values.length;
}

function sampleProfile(overrides = {}) {
  return {
    human_decision_profile_id: 'HDP::DEMO-001',
    profile_version: '1.0.0',
    approval_requirement: 'REQUIRED_SINGLE',
    required_actor_refs: ['HUMAN::AUTHORIZED-OPERATOR-001'],
    threshold_n: null,
    threshold_m: null,
    delegation_ref_optional: null,
    freshness_ttl_seconds: 900,
    material_binding_requirements: MATERIAL_BINDINGS,
    emergency_profile_ref_optional: null,
    reuse_policy: 'NO_REUSE_AFTER_MATERIAL_CHANGE',
    ...overrides
  };
}

function sampleDecision(overrides = {}) {
  return {
    decision_id: 'DECISION::DEMO-001',
    human_decision_profile_id: 'HDP::DEMO-001',
    decision_status: 'APPROVED',
    actor_refs: ['HUMAN::AUTHORIZED-OPERATOR-001'],
    decision_time: '2026-09-26T00:00:00.000Z',
    freshness_status: 'FRESH',
    action_digest: 'sha256:aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
    authority_ref: 'AUTHORITY::DEMO',
    mandate_ref: 'MANDATE::DEMO',
    policy_version: 'POLICY::B2G-V3-5-R1',
    scope_ref: 'SCOPE::DEMO',
    target_ref: 'TARGET::DEMO',
    decision_evidence_ref: 'evidence::human-decision::demo-001',
    replay_of_decision_id_optional: null,
    material_change_after_decision: false,
    ...overrides
  };
}

function blocked(code) {
  return {
    valid: false,
    code,
    human_decision_satisfied: false,
    operational_allow_permitted: false,
    creates_authority: false,
    creates_mandate: false,
    permits_decision_replay: false
  };
}

function validateHumanDecisionProfile(profile) {
  if (!profile || typeof profile !== 'object') return blocked('HUMAN_DECISION_PROFILE_INVALID');
  if (!hasText(profile.human_decision_profile_id) || !hasText(profile.profile_version)) return blocked('HUMAN_DECISION_PROFILE_ID_INVALID');
  if (!APPROVAL_REQUIREMENTS.includes(profile.approval_requirement)) return blocked('APPROVAL_REQUIREMENT_INVALID');

  if (profile.approval_requirement === 'NOT_REQUIRED') {
    return {
      valid: true,
      code: 'HUMAN_DECISION_PROFILE_VALID_NOT_REQUIRED',
      human_decision_satisfied: true,
      operational_allow_permitted: false,
      creates_authority: false,
      creates_mandate: false,
      permits_decision_replay: false
    };
  }

  if (!uniqueTexts(profile.required_actor_refs)) return blocked('REQUIRED_ACTORS_INVALID');

  if (profile.approval_requirement === 'REQUIRED_THRESHOLD') {
    const n = Number(profile.threshold_n);
    const m = Number(profile.threshold_m);
    if (!Number.isInteger(n) || !Number.isInteger(m) || n < 1 || m < n || profile.required_actor_refs.length !== m) {
      return blocked('THRESHOLD_INVALID');
    }
  }

  if (!Array.isArray(profile.material_binding_requirements) || profile.material_binding_requirements.some((f) => !MATERIAL_BINDINGS.includes(f))) {
    return blocked('MATERIAL_BINDING_PROFILE_INVALID');
  }

  return {
    valid: true,
    code: 'HUMAN_DECISION_PROFILE_VALID',
    human_decision_satisfied: false,
    operational_allow_permitted: false,
    creates_authority: false,
    creates_mandate: false,
    permits_decision_replay: false
  };
}

function validateHumanDecisionRecord(profile, decision, expected = {}) {
  const profileResult = validateHumanDecisionProfile(profile);
  if (!profileResult.valid) return profileResult;

  if (profile.approval_requirement === 'NOT_REQUIRED') return profileResult;

  if (!decision || typeof decision !== 'object') return blocked('HUMAN_DECISION_MISSING');
  if (!hasText(decision.decision_id) || decision.human_decision_profile_id !== profile.human_decision_profile_id) return blocked('HUMAN_DECISION_ID_INVALID');
  if (!DECISION_STATUSES.includes(decision.decision_status)) return blocked('HUMAN_DECISION_STATUS_INVALID');
  if (decision.decision_status !== 'APPROVED') return blocked('HUMAN_DECISION_NOT_APPROVED');
  if (!FRESHNESS_STATUS.includes(decision.freshness_status)) return blocked('HUMAN_DECISION_FRESHNESS_INVALID');
  if (decision.freshness_status !== 'FRESH') return blocked('HUMAN_DECISION_EXPIRED');
  if (!hasText(decision.decision_evidence_ref)) return blocked('HUMAN_DECISION_EVIDENCE_MISSING');
  if (decision.material_change_after_decision === true) return blocked('MATERIAL_CHANGE_REQUIRES_NEW_DECISION');
  if (hasText(decision.replay_of_decision_id_optional)) return blocked('DECISION_REPLAY_DENIED');

  for (const field of profile.material_binding_requirements) {
    if (!hasText(decision[field])) return blocked('HUMAN_DECISION_BINDING_INCOMPLETE');
    if (hasText(expected[field]) && decision[field] !== expected[field]) return blocked('ACTION_BINDING_INVALID');
  }

  const actors = Array.isArray(decision.actor_refs) ? decision.actor_refs : [];
  const approvedRequiredActors = profile.required_actor_refs.filter((actor) => actors.includes(actor));

  if (profile.approval_requirement === 'REQUIRED_SINGLE' && approvedRequiredActors.length < 1) {
    return blocked('HUMAN_DECISION_ACTOR_INVALID');
  }

  if (profile.approval_requirement === 'REQUIRED_MULTI' && approvedRequiredActors.length !== profile.required_actor_refs.length) {
    return blocked('HUMAN_DECISION_MULTI_APPROVAL_INCOMPLETE');
  }

  if (profile.approval_requirement === 'REQUIRED_THRESHOLD' && approvedRequiredActors.length < profile.threshold_n) {
    return blocked('HUMAN_DECISION_THRESHOLD_NOT_MET');
  }

  return {
    valid: true,
    code: 'HUMAN_DECISION_SATISFIED',
    human_decision_satisfied: true,
    operational_allow_permitted: false,
    creates_authority: false,
    creates_mandate: false,
    permits_decision_replay: false
  };
}

function buildContract(options = {}) {
  const rootDir = options.rootDir || process.cwd();
  const repositoryCommit = options.repositoryCommit || gitHead(rootDir);
  const sourcePath = 'docs/launch/level2/v3-5-r1/v3-5-r1-custody-event-record-contract.json';
  const source = readJson(rootDir, sourcePath);

  const expected = {
    action_digest: 'sha256:aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
    authority_ref: 'AUTHORITY::DEMO',
    mandate_ref: 'MANDATE::DEMO',
    policy_version: 'POLICY::B2G-V3-5-R1',
    scope_ref: 'SCOPE::DEMO',
    target_ref: 'TARGET::DEMO'
  };

  const vectors = [
    ['B2G-T36', 'required human decision missing', sampleProfile(), null],
    ['B2G-T37', 'required approval timeout / expired freshness', sampleProfile(), sampleDecision({ freshness_status: 'EXPIRED', decision_status: 'EXPIRED' })],
    ['B2G-T38', 'decision replayed after material action change', sampleProfile(), sampleDecision({ replay_of_decision_id_optional: 'DECISION::OLD', material_change_after_decision: true })],
    ['B2G-T39', 'decision action digest differs from expected action', sampleProfile(), sampleDecision({ action_digest: 'sha256:bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb' })],
    ['B2G-POS-003', 'valid single human approval bound to action digest', sampleProfile(), sampleDecision()]
  ].map(([id, stimulus, profile, decision]) => ({
    vector_id: id,
    stimulus,
    result: validateHumanDecisionRecord(profile, decision, expected)
  }));

  const doc = {
    proto: 'HBCE-B2G-L2-JC2-V3-5-R1-HUMAN-DECISION-PROFILE-CONTRACT-v1',
    kind: 'HBCE_B2G_LEVEL2_JOKER_C2_V3_5_R1_HUMAN_DECISION_PROFILE_CONTRACT',
    document_code: 'HBCE-B2G-L2-JC2-PROG-2027-0001',
    specification_baseline: 'V3.5-R1 - Forensic Evidence & Verifier Qualification Hardening - 26 September 2026',
    issue_id: 'PROG-046',
    priority: 'V3.5-R1-HUMAN-DECISION-PROFILE-CONTRACT',
    repository_baseline_commit: repositoryCommit,

    source_custody_event_contract_ref: sourcePath,
    source_custody_event_contract_revision_hash: source.revision_hash,
    source_custody_event_contract_revision_hash_valid: validHash(source),

    governing_producer: 'PRODUCER::HBCE_CORE',

    invariant: {
      human_decision_profile_does_not_create_authority: true,
      human_decision_record_does_not_create_mandate: true,
      approval_requires_action_digest_binding: true,
      timeout_never_auto_approves: true,
      stale_decision_never_auto_approves: true,
      material_action_change_requires_new_decision: true,
      decision_replay_for_changed_action_denied: true,
      emergency_profile_does_not_create_public_authority: true,
      human_decision_satisfied_is_not_production_readiness: true
    },

    contract_fields: [
      'human_decision_profile_id',
      'profile_version',
      'approval_requirement',
      'required_actor_refs',
      'threshold_n',
      'threshold_m',
      'delegation_ref_optional',
      'freshness_ttl_seconds',
      'material_binding_requirements',
      'emergency_profile_ref_optional',
      'reuse_policy'
    ],

    decision_record_fields: [
      'decision_id',
      'human_decision_profile_id',
      'decision_status',
      'actor_refs',
      'decision_time',
      'freshness_status',
      'action_digest',
      'authority_ref',
      'mandate_ref',
      'policy_version',
      'scope_ref',
      'target_ref',
      'decision_evidence_ref',
      'replay_of_decision_id_optional',
      'material_change_after_decision'
    ],

    allowed_approval_requirements: APPROVAL_REQUIREMENTS,
    allowed_decision_statuses: DECISION_STATUSES,
    allowed_freshness_statuses: FRESHNESS_STATUS,
    required_material_bindings: MATERIAL_BINDINGS,

    fail_closed_codes: [
      'HUMAN_DECISION_PROFILE_INVALID',
      'HUMAN_DECISION_PROFILE_ID_INVALID',
      'APPROVAL_REQUIREMENT_INVALID',
      'REQUIRED_ACTORS_INVALID',
      'THRESHOLD_INVALID',
      'MATERIAL_BINDING_PROFILE_INVALID',
      'HUMAN_DECISION_MISSING',
      'HUMAN_DECISION_ID_INVALID',
      'HUMAN_DECISION_STATUS_INVALID',
      'HUMAN_DECISION_NOT_APPROVED',
      'HUMAN_DECISION_FRESHNESS_INVALID',
      'HUMAN_DECISION_EXPIRED',
      'HUMAN_DECISION_EVIDENCE_MISSING',
      'MATERIAL_CHANGE_REQUIRES_NEW_DECISION',
      'DECISION_REPLAY_DENIED',
      'HUMAN_DECISION_BINDING_INCOMPLETE',
      'ACTION_BINDING_INVALID',
      'HUMAN_DECISION_ACTOR_INVALID',
      'HUMAN_DECISION_MULTI_APPROVAL_INCOMPLETE',
      'HUMAN_DECISION_THRESHOLD_NOT_MET'
    ],

    runtime_guard_vectors: vectors,

    closed_gap: {
      gap_id: 'L2-GAP-004',
      title: 'HumanDecisionProfile runtime contract missing',
      closed_by: 'PROG-046',
      status: 'CLOSED_CONTRACT_AND_VALIDATOR_BASELINE',
      human_decision_runtime_integration_complete: false
    },

    remaining_open_gaps: ['L2-GAP-005', 'L2-GAP-006'],

    readiness_state: {
      human_decision_profile_contract_created: true,
      human_decision_validator_created: true,
      human_decision_runtime_integration_complete: false,
      adapter_provenance_runtime_complete: false,
      b2g_t26_t43_harness_complete: false,
      b2g_candidate_ready: false,
      public_sector_production_ready: false
    },

    next_required_program: 'PROG-047-V3-5-R1-ADAPTER-PROVENANCE-PROFILE-CONTRACT',

    non_claims: {
      production_ready: false,
      b2g_candidate_ready: false,
      public_accreditation: false,
      procurement_eligibility: false,
      legal_validity: false,
      government_endorsement: false,
      public_authority_created: false,
      mandate_created_by_decision_record: false,
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
  const targetPath = process.argv[2] || 'docs/launch/level2/v3-5-r1/v3-5-r1-human-decision-profile-contract.json';
  const doc = writeContract(targetPath, { rootDir: process.cwd() });
  console.log(`PROG_046_V3_5_R1_HUMAN_DECISION_WRITTEN=${doc.revision_hash}`);
}

module.exports = {
  APPROVAL_REQUIREMENTS,
  DECISION_STATUSES,
  FRESHNESS_STATUS,
  MATERIAL_BINDINGS,
  sampleProfile,
  sampleDecision,
  validateHumanDecisionProfile,
  validateHumanDecisionRecord,
  buildContract,
  writeContract
};
