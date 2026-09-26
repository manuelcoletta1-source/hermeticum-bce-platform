'use strict';

const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');
const { sha256Digest } = require('../../packages/hbce-core/canonical-json.js');
const { validateProducerBinding } = require('../producer/validate-producer-binding.js');
const { validateRecoveryLineage } = require('../recovery/validate-recovery-lineage.js');
const {
  validateCombinationClassification,
  validateCanonicalStateTokenShape,
  validateContractProducer
} = require('../schema/validate-meta-type-consistency.js');

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

function buildEvidencePack(options) {
  const rootDir = options && options.rootDir ? options.rootDir : process.cwd();
  const repositoryCommit = options && options.repositoryCommit ? options.repositoryCommit : gitHead(rootDir);

  const registryPath = 'docs/launch/level1/v3-4-r1/v3-4-r1-producer-registry-baseline.json';
  const closurePath = 'docs/launch/level1/v3-4-r1/v3-4-r1-build-assurance-closure-snapshot.json';
  const gapRegisterPath = 'docs/launch/level1/v3-4-r1/v3-4-r1-e2e-evidence-gap-register.json';

  const registry = readJson(rootDir, registryPath);
  const closure = readJson(rootDir, closurePath);
  const gapRegister = readJson(rootDir, gapRegisterPath);

  const governedOperationVerdict = validateProducerBinding({
    registry,
    producer_id: 'PRODUCER::HBCE_CORE',
    namespace: 'OPERATIONAL',
    mutation: 'new_authorization_evaluation'
  });

  const failClosedVerdict = validateProducerBinding({
    registry,
    producer_id: 'PRODUCER::UNREGISTERED',
    namespace: 'OPERATIONAL',
    mutation: 'new_authorization_evaluation'
  });

  const recoveryVerdict = validateRecoveryLineage({
    registry,
    recovery_type: 'T218_OPERATIONAL_FAILED_NEW_RUN',
    producer_id: 'PRODUCER::HBCE_CORE',
    prior_record: {
      id: 'e2e-prior-operational-failed-001',
      namespace: 'OPERATIONAL',
      original_state: 'OPERATIONAL::FAILED',
      current_state: 'OPERATIONAL::FAILED'
    },
    new_record: {
      prior_ref: 'e2e-prior-operational-failed-001',
      run_id: 'e2e-run-new-001',
      authorization_evaluation_id: 'e2e-eval-new-001'
    }
  });

  const contractVerdict = validateContractProducer({
    registry,
    producer_id: 'PRODUCER::CONTRACT_CONTROL',
    mutation: 'CONTRACT::RELEASED'
  });

  const combinationVerdict = validateCombinationClassification({
    registry,
    producer_id: 'PRODUCER::SCHEMA_REGISTRY',
    classification: 'COMBINATION::VALID'
  });

  const nestedTokenVerdict = validateCanonicalStateTokenShape({
    token: 'NEW_EVALUATION::OPERATIONAL::ALLOWED'
  });

  const canonicalTokenVerdict = validateCanonicalStateTokenShape({
    token: 'OPERATIONAL::ALLOWED',
    evaluation_id: 'e2e-eval-new-001',
    prior_evaluation_ref: 'e2e-eval-old-001'
  });

  const traces = [
    {
      gap_id: 'E2E-GAP-001',
      trace_id: 'E2E-TRACE-GOVERNED-OPERATION-001',
      title: 'End-to-end governed operation trace',
      request_ref: 'request-envelope::e2e-governed-operation-001',
      policy_evaluation_ref: 'policy-evaluation::e2e-governed-operation-001',
      producer_binding_result: governedOperationVerdict.result,
      allowed: governedOperationVerdict.allowed === true,
      evidence_result: governedOperationVerdict.allowed === true ? 'EVIDENCE_ATTACHED' : 'EVIDENCE_REJECTED'
    },
    {
      gap_id: 'E2E-GAP-002',
      trace_id: 'E2E-TRACE-FAIL-CLOSED-NEGATIVE-001',
      title: 'Fail-closed negative trace',
      request_ref: 'request-envelope::e2e-negative-unregistered-producer-001',
      policy_evaluation_ref: 'policy-evaluation::e2e-negative-unregistered-producer-001',
      producer_binding_result: failClosedVerdict.result,
      allowed: failClosedVerdict.allowed === true,
      evidence_result: failClosedVerdict.allowed === false ? 'FAIL_CLOSED_EVIDENCE_ATTACHED' : 'FAIL_CLOSED_EVIDENCE_REJECTED'
    },
    {
      gap_id: 'E2E-GAP-003',
      trace_id: 'E2E-TRACE-RECOVERY-CONTINUATION-001',
      title: 'Recovery continuation trace',
      recovery_result: recoveryVerdict.result,
      recovery_invariant: recoveryVerdict.invariant,
      allowed: recoveryVerdict.allowed === true,
      evidence_result: recoveryVerdict.allowed === true ? 'EVIDENCE_ATTACHED' : 'EVIDENCE_REJECTED'
    },
    {
      gap_id: 'E2E-GAP-004',
      trace_id: 'E2E-TRACE-CONTRACT-CONTROL-001',
      title: 'Contract-control lifecycle trace',
      contract_result: contractVerdict.result,
      allowed: contractVerdict.allowed === true,
      evidence_result: contractVerdict.allowed === true ? 'EVIDENCE_ATTACHED' : 'EVIDENCE_REJECTED'
    }
  ];

  const schemaEvidence = {
    gap_id: 'E2E-GAP-004',
    trace_id: 'E2E-TRACE-SCHEMA-CONSISTENCY-001',
    combination_result: combinationVerdict.result,
    nested_token_result: nestedTokenVerdict.result,
    canonical_token_result: canonicalTokenVerdict.result,
    combination_allowed: combinationVerdict.allowed === true,
    nested_token_allowed: nestedTokenVerdict.allowed === true,
    canonical_token_allowed: canonicalTokenVerdict.allowed === true
  };

  const gapCoverage = [
    {
      gap_id: 'E2E-GAP-001',
      coverage_status: traces[0].evidence_result,
      blocking_status_after_pack: 'EVIDENCE_PRESENT_REVIEW_REQUIRED'
    },
    {
      gap_id: 'E2E-GAP-002',
      coverage_status: traces[1].evidence_result,
      blocking_status_after_pack: 'EVIDENCE_PRESENT_REVIEW_REQUIRED'
    },
    {
      gap_id: 'E2E-GAP-003',
      coverage_status: traces[2].evidence_result,
      blocking_status_after_pack: 'EVIDENCE_PRESENT_REVIEW_REQUIRED'
    },
    {
      gap_id: 'E2E-GAP-004',
      coverage_status: traces[3].evidence_result,
      blocking_status_after_pack: 'EVIDENCE_PRESENT_REVIEW_REQUIRED'
    },
    {
      gap_id: 'E2E-GAP-005',
      coverage_status: 'INTEGRITY_SNAPSHOT_ATTACHED',
      blocking_status_after_pack: 'EVIDENCE_PRESENT_REVIEW_REQUIRED'
    },
    {
      gap_id: 'E2E-GAP-006',
      coverage_status: 'BOUNDARY_RECORDED_EXTERNAL_VALIDATION_NOT_COMPLETE',
      blocking_status_after_pack: 'BLOCKING_OPEN'
    },
    {
      gap_id: 'E2E-GAP-007',
      coverage_status: 'BOUNDARY_RECORDED_PILOT_ACCESS_BLOCKED',
      blocking_status_after_pack: 'BLOCKING_OPEN'
    }
  ];

  const pack = {
    proto: 'HBCE-B2B-L1-V3-4-R1-E2E-EVIDENCE-PACK-v1',
    kind: 'HBCE_B2B_L1_V3_4_R1_E2E_EVIDENCE_PACK',
    document_code: 'HBCE-B2B-L1-MATRIX-PROG-2027-0001',
    specification_baseline: 'V3.4-R1 - Controlled Corrective Revision - 26 September 2026',
    issue_id: 'PROG-038',
    priority: 'V3.4-R1-E2E-READINESS',
    repository_baseline_commit: repositoryCommit,

    source_producer_registry_ref: registryPath,
    source_producer_registry_revision_hash: registry.revision_hash,
    source_closure_snapshot_ref: closurePath,
    source_closure_snapshot_revision_hash: closure.revision_hash,
    source_e2e_gap_register_ref: gapRegisterPath,
    source_e2e_gap_register_revision_hash: gapRegister.revision_hash,

    status: 'E2E_EVIDENCE_PACK_CREATED_REVIEW_REQUIRED',
    gate_claimed: false,

    evidence_traces: traces,
    schema_consistency_evidence: schemaEvidence,
    gap_coverage: gapCoverage,

    integrity_snapshot: {
      source_artifact_count: 3,
      trace_count: traces.length,
      gap_coverage_count: gapCoverage.length,
      hash_algorithm: 'sha256-canonical-json',
      revision_hash_computed_without_revision_hash_field: true
    },

    readiness_interpretation: {
      evidence_pack_created: true,
      build_assurance_block_closed: true,
      e2e_evidence_review_required: true,
      external_validation_complete: false,
      pilot_access_available: false,
      release_candidate_ready: false,
      production_ready: false,
      customer_acceptance_available: false,
      next_required_program: 'PROG-039-RC-GATE-EVALUATION'
    },

    non_claims: {
      production_ready: false,
      release_candidate_ready: false,
      pilot_access_available: false,
      customer_acceptance: false,
      external_validation_complete: false,
      commercial_claim_complete: false,
      automatic_release_authorization: false
    }
  };

  pack.revision_hash = sha256Digest(pack);
  return pack;
}

function writeEvidencePack(targetPath, options) {
  const rootDir = options && options.rootDir ? options.rootDir : process.cwd();
  const pack = buildEvidencePack({ rootDir, repositoryCommit: options && options.repositoryCommit });
  fs.writeFileSync(path.join(rootDir, targetPath), `${JSON.stringify(pack, null, 2)}\n`, 'utf8');
  return pack;
}

if (require.main === module) {
  const targetPath = process.argv[2] || 'docs/launch/level1/v3-4-r1/v3-4-r1-e2e-evidence-pack.json';
  const pack = writeEvidencePack(targetPath, { rootDir: process.cwd() });
  console.log(`PROG_038_E2E_EVIDENCE_PACK_WRITTEN=${pack.revision_hash}`);
}

module.exports = {
  buildEvidencePack,
  writeEvidencePack
};
