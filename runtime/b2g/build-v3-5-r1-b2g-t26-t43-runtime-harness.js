'use strict';

const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');
const { sha256Digest } = require('../../packages/hbce-core/canonical-json.js');

const {
  sampleRecord,
  validateVerifierQualificationRecord
} = require('./build-v3-5-r1-verifier-qualification-record-contract.js');

const {
  sampleCustodyEvent,
  validateCustodyEventRecord
} = require('./build-v3-5-r1-custody-event-record-contract.js');

const {
  sampleProfile,
  sampleDecision,
  validateHumanDecisionRecord
} = require('./build-v3-5-r1-human-decision-profile-contract.js');

const {
  sampleAdapterProfile,
  sampleAdapterEvent,
  validateAdapterTransformation
} = require('./build-v3-5-r1-adapter-provenance-profile-contract.js');

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

function expectedHumanDecisionBinding() {
  return {
    action_digest: 'sha256:aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
    authority_ref: 'AUTHORITY::DEMO',
    mandate_ref: 'MANDATE::DEMO',
    policy_version: 'POLICY::B2G-V3-5-R1',
    scope_ref: 'SCOPE::DEMO',
    target_ref: 'TARGET::DEMO'
  };
}

function buildRuntimeVectors() {
  const verifierRequest = {
    property: 'ASSURANCE::TECHNICAL_PROPERTY',
    evidence_class: 'EVIDENCE::CHAINED_RUNTIME_ARTIFACT',
    ruleset_family: 'HBCE_B2G_V3_5_R1',
    environment: 'NON_CLASSIFIED_DEMONSTRATOR',
    independence_required: true,
    now: '2026-09-26T00:00:00.000Z'
  };

  const decisionExpected = expectedHumanDecisionBinding();

  const vectors = [
    {
      vector_id: 'B2G-T26',
      domain: 'VERIFIER_QUALIFICATION',
      stimulus: 'missing qualification record',
      result: validateVerifierQualificationRecord(null, verifierRequest),
      expected_code: 'VERIFIER_NOT_QUALIFIED'
    },
    {
      vector_id: 'B2G-T27',
      domain: 'VERIFIER_QUALIFICATION',
      stimulus: 'qualification scope mismatch',
      result: validateVerifierQualificationRecord(sampleRecord({
        qualification_scope: { ...sampleRecord().qualification_scope, property: 'ASSURANCE::OTHER' }
      }), verifierRequest),
      expected_code: 'QUALIFICATION_SCOPE_MISMATCH'
    },
    {
      vector_id: 'B2G-T28',
      domain: 'VERIFIER_QUALIFICATION',
      stimulus: 'qualification expired',
      result: validateVerifierQualificationRecord(sampleRecord({ valid_until: '2026-01-02T00:00:00.000Z' }), verifierRequest),
      expected_code: 'QUALIFICATION_EXPIRED'
    },
    {
      vector_id: 'B2G-T29',
      domain: 'VERIFIER_QUALIFICATION',
      stimulus: 'qualification revoked',
      result: validateVerifierQualificationRecord(sampleRecord({ revocation_status: 'REVOKED', revocation_ref: 'revocation::demo' }), verifierRequest),
      expected_code: 'QUALIFICATION_REVOKED'
    },
    {
      vector_id: 'B2G-T30',
      domain: 'VERIFIER_QUALIFICATION',
      stimulus: 'independence conflict',
      result: validateVerifierQualificationRecord(sampleRecord({
        independence_status: 'CONFLICTED',
        conflict_of_interest_status: 'CONFLICT_DECLARED'
      }), verifierRequest),
      expected_code: 'QUALIFICATION_INDEPENDENCE_INVALID'
    },
    {
      vector_id: 'B2G-T31',
      domain: 'VERIFIER_QUALIFICATION',
      stimulus: 'unsupported public accreditation claim',
      result: validateVerifierQualificationRecord(sampleRecord({ public_accreditation_claimed: true }), verifierRequest),
      expected_code: 'ACCREDITATION_CLAIM_UNSUPPORTED'
    },
    {
      vector_id: 'B2G-T32',
      domain: 'CUSTODY',
      stimulus: 'custody event lacks previous_event_hash',
      result: validateCustodyEventRecord(sampleCustodyEvent({ previous_event_hash: '' })),
      expected_code: 'CHAIN_OF_CUSTODY_BROKEN'
    },
    {
      vector_id: 'B2G-T33',
      domain: 'CUSTODY',
      stimulus: 'material timestamp lacks time_source_ref',
      result: validateCustodyEventRecord(sampleCustodyEvent({ time_source_ref: '' })),
      expected_code: 'TIME_PROVENANCE_INCOMPLETE'
    },
    {
      vector_id: 'B2G-T34',
      domain: 'CUSTODY',
      stimulus: 'signed or sealed evidence claimed without actual reference',
      result: validateCustodyEventRecord(sampleCustodyEvent({
        signature_ref_optional: null,
        seal_ref_optional: null
      })),
      expected_code: 'SIGNATURE_OR_SEAL_CLAIM_UNSUPPORTED'
    },
    {
      vector_id: 'B2G-T35',
      domain: 'CUSTODY',
      stimulus: 'custody seal/hash verification fails',
      result: validateCustodyEventRecord(sampleCustodyEvent({ verification_status: 'INVALID_SEAL' })),
      expected_code: 'EVIDENCE_SEAL_INVALID'
    },
    {
      vector_id: 'B2G-T36',
      domain: 'HUMAN_DECISION',
      stimulus: 'required human decision missing',
      result: validateHumanDecisionRecord(sampleProfile(), null, decisionExpected),
      expected_code: 'HUMAN_DECISION_MISSING'
    },
    {
      vector_id: 'B2G-T37',
      domain: 'HUMAN_DECISION',
      stimulus: 'required approval timeout or expired decision',
      result: validateHumanDecisionRecord(sampleProfile(), sampleDecision({
        freshness_status: 'EXPIRED',
        decision_status: 'EXPIRED'
      }), decisionExpected),
      expected_code: 'HUMAN_DECISION_NOT_APPROVED'
    },
    {
      vector_id: 'B2G-T38',
      domain: 'HUMAN_DECISION',
      stimulus: 'decision replayed after material action change',
      result: validateHumanDecisionRecord(sampleProfile(), sampleDecision({
        replay_of_decision_id_optional: 'DECISION::OLD',
        material_change_after_decision: true
      }), decisionExpected),
      expected_code: 'MATERIAL_CHANGE_REQUIRES_NEW_DECISION'
    },
    {
      vector_id: 'B2G-T39',
      domain: 'HUMAN_DECISION',
      stimulus: 'decision action digest differs from expected action',
      result: validateHumanDecisionRecord(sampleProfile(), sampleDecision({
        action_digest: 'sha256:bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb'
      }), decisionExpected),
      expected_code: 'ACTION_BINDING_INVALID'
    },
    {
      vector_id: 'B2G-T40',
      domain: 'ADAPTER_PROVENANCE',
      stimulus: 'adapter profile missing source system',
      result: validateAdapterTransformation(sampleAdapterProfile({ source_system_ref: '' }), sampleAdapterEvent()),
      expected_code: 'ADAPTER_SOURCE_TARGET_INVALID'
    },
    {
      vector_id: 'B2G-T41',
      domain: 'ADAPTER_PROVENANCE',
      stimulus: 'adapter provenance incomplete',
      result: validateAdapterTransformation(sampleAdapterProfile({ provenance_status: 'INCOMPLETE' }), sampleAdapterEvent()),
      expected_code: 'ADAPTER_PROVENANCE_INCOMPLETE'
    },
    {
      vector_id: 'B2G-T42',
      domain: 'ADAPTER_PROVENANCE',
      stimulus: 'adapter attempts unallowed transformation',
      result: validateAdapterTransformation(sampleAdapterProfile(), sampleAdapterEvent({ transformation_class: 'AGGREGATE' })),
      expected_code: 'ADAPTER_TRANSFORMATION_NOT_ALLOWED'
    },
    {
      vector_id: 'B2G-T43',
      domain: 'ADAPTER_PROVENANCE',
      stimulus: 'adapter claims source-of-truth replacement or public authority',
      result: validateAdapterTransformation(sampleAdapterProfile(), sampleAdapterEvent({
        claims_source_of_truth_replacement: true,
        claims_public_authority: true
      })),
      expected_code: 'SOURCE_OF_TRUTH_REPLACEMENT_DENIED'
    }
  ];

  return vectors.map((v) => ({
    ...v,
    passed: v.result && v.result.valid === false && v.result.code === v.expected_code
  }));
}

function buildPositiveIntegrationVector() {
  const verifierRequest = {
    property: 'ASSURANCE::TECHNICAL_PROPERTY',
    evidence_class: 'EVIDENCE::CHAINED_RUNTIME_ARTIFACT',
    ruleset_family: 'HBCE_B2G_V3_5_R1',
    environment: 'NON_CLASSIFIED_DEMONSTRATOR',
    independence_required: true,
    now: '2026-09-26T00:00:00.000Z'
  };

  const results = {
    verifier: validateVerifierQualificationRecord(sampleRecord(), verifierRequest),
    custody: validateCustodyEventRecord(sampleCustodyEvent()),
    human_decision: validateHumanDecisionRecord(sampleProfile(), sampleDecision(), expectedHumanDecisionBinding()),
    adapter: validateAdapterTransformation(sampleAdapterProfile(), sampleAdapterEvent())
  };

  return {
    vector_id: 'B2G-POS-E2E-001',
    domain: 'INTEGRATED_BASELINE',
    stimulus: 'valid qualification, custody, human decision and adapter provenance baseline records',
    results,
    passed: Object.values(results).every((r) => r && r.valid === true),
    creates_b2g_candidate_readiness: false,
    creates_public_authority: false,
    creates_legal_validity: false,
    creates_production_readiness: false
  };
}

function buildHarness(options = {}) {
  const rootDir = options.rootDir || process.cwd();
  const repositoryCommit = options.repositoryCommit || gitHead(rootDir);
  const sourcePath = 'docs/launch/level2/v3-5-r1/v3-5-r1-adapter-provenance-profile-contract.json';
  const source = readJson(rootDir, sourcePath);

  const runtimeVectors = buildRuntimeVectors();
  const positiveVector = buildPositiveIntegrationVector();
  const allRuntimeVectorsPassed = runtimeVectors.every((v) => v.passed === true);
  const vectorIds = runtimeVectors.map((v) => v.vector_id);

  const doc = {
    proto: 'HBCE-B2G-L2-JC2-V3-5-R1-B2G-T26-T43-RUNTIME-HARNESS-v1',
    kind: 'HBCE_B2G_LEVEL2_JOKER_C2_V3_5_R1_B2G_T26_T43_RUNTIME_HARNESS',
    document_code: 'HBCE-B2G-L2-JC2-PROG-2027-0001',
    specification_baseline: 'V3.5-R1 - Forensic Evidence & Verifier Qualification Hardening - 26 September 2026',
    issue_id: 'PROG-048',
    priority: 'V3.5-R1-B2G-T26-T43-RUNTIME-HARNESS',
    repository_baseline_commit: repositoryCommit,

    source_adapter_provenance_contract_ref: sourcePath,
    source_adapter_provenance_contract_revision_hash: source.revision_hash,
    source_adapter_provenance_contract_revision_hash_valid: validHash(source),

    integrated_contracts: [
      'PROG-044-VERIFIER-QUALIFICATION-RECORD-CONTRACT',
      'PROG-045-CUSTODY-EVENT-RECORD-CONTRACT',
      'PROG-046-HUMAN-DECISION-PROFILE-CONTRACT',
      'PROG-047-ADAPTER-PROVENANCE-PROFILE-CONTRACT'
    ],

    harness_scope: {
      first_vector: 'B2G-T26',
      last_vector: 'B2G-T43',
      vector_count: runtimeVectors.length,
      expected_vector_count: 18,
      all_required_vectors_present: vectorIds[0] === 'B2G-T26' && vectorIds[17] === 'B2G-T43' && runtimeVectors.length === 18,
      all_required_vectors_passed: allRuntimeVectorsPassed
    },

    runtime_guard_vectors: runtimeVectors,
    positive_integration_vector: positiveVector,

    integrated_invariants: {
      verifier_not_qualified_blocks_assurance_transition: true,
      custody_break_limits_evidentiary_claim: true,
      stale_or_replayed_human_decision_blocks_authorization: true,
      adapter_without_provenance_cannot_mutate_or_export_claims: true,
      no_contract_can_create_public_authority_by_inference: true,
      no_contract_can_create_legal_validity_by_inference: true,
      no_contract_can_create_production_readiness_by_inference: true
    },

    closed_gap: {
      gap_id: 'L2-GAP-006',
      title: 'B2G-T26-T43 runtime harness missing',
      closed_by: 'PROG-048',
      status: 'CLOSED_RUNTIME_HARNESS_BASELINE',
      b2g_t26_t43_harness_complete: allRuntimeVectorsPassed
    },

    remaining_open_gaps: [],

    readiness_state: {
      verifier_qualification_contract_created: true,
      custody_event_contract_created: true,
      human_decision_profile_contract_created: true,
      adapter_provenance_profile_contract_created: true,
      b2g_t26_t43_harness_complete: allRuntimeVectorsPassed,
      level2_contract_gap_set_closed: allRuntimeVectorsPassed,
      b2g_candidate_ready: false,
      public_sector_production_ready: false,
      external_validation_complete: false,
      pilot_readiness_gate_complete: false
    },

    next_required_program: 'PROG-049-V3-5-R1-LEVEL2-READINESS-GATE-EVALUATION',

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

function writeHarness(targetPath, options = {}) {
  const rootDir = options.rootDir || process.cwd();
  const doc = buildHarness({ rootDir, repositoryCommit: options.repositoryCommit });
  fs.writeFileSync(path.join(rootDir, targetPath), `${JSON.stringify(doc, null, 2)}\n`, 'utf8');
  return doc;
}

if (require.main === module) {
  const targetPath = process.argv[2] || 'docs/launch/level2/v3-5-r1/v3-5-r1-b2g-t26-t43-runtime-harness.json';
  const doc = writeHarness(targetPath, { rootDir: process.cwd() });
  console.log(`PROG_048_V3_5_R1_B2G_T26_T43_HARNESS_WRITTEN=${doc.revision_hash}`);
}

module.exports = {
  buildRuntimeVectors,
  buildPositiveIntegrationVector,
  buildHarness,
  writeHarness
};
