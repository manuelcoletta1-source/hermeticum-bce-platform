'use strict';

const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');
const { sha256Digest } = require('../../packages/hbce-core/canonical-json.js');

const RESULTS = Object.freeze({
  RC_GATE_PASSED: 'RC_GATE_PASSED',
  RC_GATE_BLOCKED: 'RC_GATE_BLOCKED',
  RC_GATE_INPUT_MISSING: 'RC_GATE_INPUT_MISSING',
  RC_GATE_INTEGRITY_INVALID: 'RC_GATE_INTEGRITY_INVALID'
});

function readJson(rootDir, relativePath) {
  return JSON.parse(fs.readFileSync(path.join(rootDir, relativePath), 'utf8'));
}

function exists(rootDir, relativePath) {
  return fs.existsSync(path.join(rootDir, relativePath));
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

function blocking(reason, evidence) {
  return {
    reason,
    blocking: true,
    evidence: evidence || null
  };
}

function evaluateRcGate(options) {
  const rootDir = options && options.rootDir ? options.rootDir : process.cwd();
  const repositoryCommit = options && options.repositoryCommit ? options.repositoryCommit : gitHead(rootDir);

  const closurePath = 'docs/launch/level1/v3-4-r1/v3-4-r1-build-assurance-closure-snapshot.json';
  const gapRegisterPath = 'docs/launch/level1/v3-4-r1/v3-4-r1-e2e-evidence-gap-register.json';
  const evidencePackPath = 'docs/launch/level1/v3-4-r1/v3-4-r1-e2e-evidence-pack.json';

  const requiredInputs = [closurePath, gapRegisterPath, evidencePackPath];
  const missing = requiredInputs.filter((p) => !exists(rootDir, p));

  if (missing.length > 0) {
    return {
      proto: 'HBCE-B2B-L1-V3-4-R1-RC-GATE-EVALUATION-v1',
      kind: 'HBCE_B2B_L1_V3_4_R1_RC_GATE_EVALUATION',
      issue_id: 'PROG-039',
      repository_baseline_commit: repositoryCommit,
      result: RESULTS.RC_GATE_INPUT_MISSING,
      rc_gate_passed: false,
      blocking_reasons: missing.map((p) => blocking('REQUIRED_INPUT_MISSING', p))
    };
  }

  const closure = readJson(rootDir, closurePath);
  const gapRegister = readJson(rootDir, gapRegisterPath);
  const evidencePack = readJson(rootDir, evidencePackPath);

  const integrityChecks = [
    {
      artifact: 'closure_snapshot',
      path: closurePath,
      revision_hash_valid: validateRevisionHash(closure)
    },
    {
      artifact: 'e2e_gap_register',
      path: gapRegisterPath,
      revision_hash_valid: validateRevisionHash(gapRegister)
    },
    {
      artifact: 'e2e_evidence_pack',
      path: evidencePackPath,
      revision_hash_valid: validateRevisionHash(evidencePack)
    }
  ];

  const blockingReasons = [];

  if (!integrityChecks.every((c) => c.revision_hash_valid === true)) {
    blockingReasons.push(blocking('SOURCE_REVISION_HASH_INVALID', integrityChecks));
  }

  if (closure.closure_status.first_v3_4_r1_schema_hardening_block_closed !== true) {
    blockingReasons.push(blocking('BUILD_ASSURANCE_BLOCK_NOT_CLOSED', closurePath));
  }

  if (closure.closure_status.release_candidate_gate_still_required !== true) {
    blockingReasons.push(blocking('RC_GATE_REQUIREMENT_NOT_RECORDED', closurePath));
  }

  if (gapRegister.readiness_interpretation.e2e_evidence_complete !== false) {
    blockingReasons.push(blocking('GAP_REGISTER_E2E_COMPLETION_UNEXPECTED', gapRegisterPath));
  }

  if (gapRegister.readiness_interpretation.release_candidate_ready !== false) {
    blockingReasons.push(blocking('GAP_REGISTER_RC_READY_UNEXPECTED', gapRegisterPath));
  }

  if (evidencePack.status !== 'E2E_EVIDENCE_PACK_CREATED_REVIEW_REQUIRED') {
    blockingReasons.push(blocking('E2E_PACK_STATUS_INVALID', evidencePack.status));
  }

  if (evidencePack.readiness_interpretation.e2e_evidence_review_required !== true) {
    blockingReasons.push(blocking('E2E_REVIEW_REQUIREMENT_MISSING', evidencePackPath));
  }

  if (evidencePack.readiness_interpretation.external_validation_complete !== false) {
    blockingReasons.push(blocking('EXTERNAL_VALIDATION_STATE_UNEXPECTED', evidencePackPath));
  }

  if (evidencePack.readiness_interpretation.pilot_access_available !== false) {
    blockingReasons.push(blocking('PILOT_ACCESS_STATE_UNEXPECTED', evidencePackPath));
  }

  if (evidencePack.readiness_interpretation.release_candidate_ready !== false) {
    blockingReasons.push(blocking('E2E_PACK_RC_READY_UNEXPECTED', evidencePackPath));
  }

  if (evidencePack.readiness_interpretation.e2e_evidence_review_required === true) {
    blockingReasons.push(blocking('E2E_EVIDENCE_REVIEW_REQUIRED', evidencePackPath));
  }

  if (evidencePack.readiness_interpretation.external_validation_complete !== true) {
    blockingReasons.push(blocking('EXTERNAL_VALIDATION_NOT_COMPLETE', evidencePackPath));
  }

  if (evidencePack.readiness_interpretation.pilot_access_available !== true) {
    blockingReasons.push(blocking('PILOT_CUSTOMER_ACCESS_BLOCKED', evidencePackPath));
  }

  const expectedGapIds = ['E2E-GAP-001', 'E2E-GAP-002', 'E2E-GAP-003', 'E2E-GAP-004', 'E2E-GAP-005', 'E2E-GAP-006', 'E2E-GAP-007'];
  const presentGapIds = new Set((evidencePack.gap_coverage || []).map((g) => g.gap_id));
  const missingGapCoverage = expectedGapIds.filter((id) => !presentGapIds.has(id));

  if (missingGapCoverage.length > 0) {
    blockingReasons.push(blocking('E2E_GAP_COVERAGE_INCOMPLETE', missingGapCoverage));
  }

  const gapSix = (evidencePack.gap_coverage || []).find((g) => g.gap_id === 'E2E-GAP-006');
  const gapSeven = (evidencePack.gap_coverage || []).find((g) => g.gap_id === 'E2E-GAP-007');

  if (!gapSix || gapSix.blocking_status_after_pack !== 'BLOCKING_OPEN') {
    blockingReasons.push(blocking('EXTERNAL_VALIDATION_BOUNDARY_NOT_BLOCKING', gapSix || null));
  }

  if (!gapSeven || gapSeven.blocking_status_after_pack !== 'BLOCKING_OPEN') {
    blockingReasons.push(blocking('PILOT_CUSTOMER_BOUNDARY_NOT_BLOCKING', gapSeven || null));
  }

  const result = blockingReasons.length === 0 ? RESULTS.RC_GATE_PASSED : RESULTS.RC_GATE_BLOCKED;

  const evaluation = {
    proto: 'HBCE-B2B-L1-V3-4-R1-RC-GATE-EVALUATION-v1',
    kind: 'HBCE_B2B_L1_V3_4_R1_RC_GATE_EVALUATION',
    document_code: 'HBCE-B2B-L1-MATRIX-PROG-2027-0001',
    specification_baseline: 'V3.4-R1 - Controlled Corrective Revision - 26 September 2026',
    issue_id: 'PROG-039',
    priority: 'V3.4-R1-RC-GATE',
    repository_baseline_commit: repositoryCommit,

    source_closure_snapshot_ref: closurePath,
    source_closure_snapshot_revision_hash: closure.revision_hash,
    source_e2e_gap_register_ref: gapRegisterPath,
    source_e2e_gap_register_revision_hash: gapRegister.revision_hash,
    source_e2e_evidence_pack_ref: evidencePackPath,
    source_e2e_evidence_pack_revision_hash: evidencePack.revision_hash,

    result,
    rc_gate_passed: result === RESULTS.RC_GATE_PASSED,
    rc_gate_blocked: result !== RESULTS.RC_GATE_PASSED,
    blocking_reasons: blockingReasons,

    integrity_checks: integrityChecks,

    evaluated_conditions: {
      build_assurance_block_closed: closure.closure_status.first_v3_4_r1_schema_hardening_block_closed === true,
      t217_t225_chain_closed: gapRegister.current_closed_chain.t217_t225_chain_closed === true,
      e2e_evidence_pack_created: evidencePack.readiness_interpretation.evidence_pack_created === true,
      e2e_evidence_review_required: evidencePack.readiness_interpretation.e2e_evidence_review_required === true,
      external_validation_complete: evidencePack.readiness_interpretation.external_validation_complete === true,
      pilot_access_available: evidencePack.readiness_interpretation.pilot_access_available === true,
      release_candidate_ready: evidencePack.readiness_interpretation.release_candidate_ready === true,
      production_ready: evidencePack.readiness_interpretation.production_ready === true
    },

    next_required_program: result === RESULTS.RC_GATE_PASSED
      ? 'PROG-040-RC-SNAPSHOT'
      : 'PROG-040-EVIDENCE-REVIEW-AND-EXTERNAL-VALIDATION',

    non_claims: {
      production_ready: false,
      release_candidate_ready: result === RESULTS.RC_GATE_PASSED ? false : false,
      pilot_access_available: false,
      customer_acceptance: false,
      external_validation_complete: false,
      automatic_release_authorization: false
    }
  };

  evaluation.revision_hash = sha256Digest(evaluation);
  return evaluation;
}

function writeRcGateEvaluation(targetPath, options) {
  const rootDir = options && options.rootDir ? options.rootDir : process.cwd();
  const evaluation = evaluateRcGate({ rootDir, repositoryCommit: options && options.repositoryCommit });
  fs.writeFileSync(path.join(rootDir, targetPath), `${JSON.stringify(evaluation, null, 2)}\n`, 'utf8');
  return evaluation;
}

if (require.main === module) {
  const targetPath = process.argv[2] || 'docs/launch/level1/v3-4-r1/v3-4-r1-rc-gate-evaluation.json';
  const evaluation = writeRcGateEvaluation(targetPath, { rootDir: process.cwd() });
  console.log(`PROG_039_RC_GATE_EVALUATION_WRITTEN=${evaluation.result}`);
}

module.exports = {
  RESULTS,
  evaluateRcGate,
  writeRcGateEvaluation
};
