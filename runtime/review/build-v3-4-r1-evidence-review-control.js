'use strict';

const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');
const { sha256Digest } = require('../../packages/hbce-core/canonical-json.js');

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

function validateRevisionHash(doc) {
  if (!doc || typeof doc !== 'object' || !doc.revision_hash) return false;
  const body = { ...doc };
  delete body.revision_hash;
  return doc.revision_hash === sha256Digest(body);
}

function buildEvidenceReviewControl(options) {
  const rootDir = options && options.rootDir ? options.rootDir : process.cwd();
  const repositoryCommit = options && options.repositoryCommit ? options.repositoryCommit : gitHead(rootDir);

  const evidencePackPath = 'docs/launch/level1/v3-4-r1/v3-4-r1-e2e-evidence-pack.json';
  const rcGatePath = 'docs/launch/level1/v3-4-r1/v3-4-r1-rc-gate-evaluation.json';

  const evidencePack = readJson(rootDir, evidencePackPath);
  const rcGate = readJson(rootDir, rcGatePath);

  const sourceIntegrity = {
    evidence_pack_revision_hash_valid: validateRevisionHash(evidencePack),
    rc_gate_revision_hash_valid: validateRevisionHash(rcGate)
  };

  const reviewItems = [
    {
      review_id: 'EVR-001',
      source_gap_id: 'E2E-GAP-001',
      title: 'Governed operation trace review',
      required_result: 'REVIEW_ACCEPTED_OR_CORRECTIVE_ACTION_OPENED',
      current_status: 'REVIEW_REQUIRED'
    },
    {
      review_id: 'EVR-002',
      source_gap_id: 'E2E-GAP-002',
      title: 'Fail-closed negative trace review',
      required_result: 'REVIEW_ACCEPTED_OR_CORRECTIVE_ACTION_OPENED',
      current_status: 'REVIEW_REQUIRED'
    },
    {
      review_id: 'EVR-003',
      source_gap_id: 'E2E-GAP-003',
      title: 'Recovery continuation trace review',
      required_result: 'REVIEW_ACCEPTED_OR_CORRECTIVE_ACTION_OPENED',
      current_status: 'REVIEW_REQUIRED'
    },
    {
      review_id: 'EVR-004',
      source_gap_id: 'E2E-GAP-004',
      title: 'Contract-control lifecycle trace review',
      required_result: 'REVIEW_ACCEPTED_OR_CORRECTIVE_ACTION_OPENED',
      current_status: 'REVIEW_REQUIRED'
    },
    {
      review_id: 'EVR-005',
      source_gap_id: 'E2E-GAP-005',
      title: 'EvidencePack integrity snapshot review',
      required_result: 'REVIEW_ACCEPTED_OR_CORRECTIVE_ACTION_OPENED',
      current_status: 'REVIEW_REQUIRED'
    }
  ];

  const externalValidationBoundary = {
    boundary_id: 'EXTVAL-BOUNDARY-001',
    scope: 'External validation of V3.4-R1 E2E EvidencePack and RC gate blocking decision',
    required_input: 'Independent reviewer or external validation channel result',
    current_status: 'EXTERNAL_VALIDATION_REQUIRED',
    external_validation_complete: false,
    acceptable_future_results: [
      'EXTERNAL_VALIDATION_ACCEPTED',
      'EXTERNAL_VALIDATION_ACCEPTED_WITH_FINDINGS',
      'EXTERNAL_VALIDATION_REJECTED'
    ],
    fail_closed_rule: 'Without an external validation result, RC promotion remains blocked.'
  };

  const pilotCustomerBoundary = {
    boundary_id: 'PILOT-CUSTOMER-BOUNDARY-001',
    scope: 'Pilot/customer access boundary after evidence review and external validation',
    current_status: 'PILOT_CUSTOMER_ACCESS_BLOCKED',
    pilot_access_available: false,
    customer_acceptance_available: false,
    fail_closed_rule: 'Pilot/customer access cannot be enabled by EvidencePack creation alone.'
  };

  const allSourceIntegrityValid = Object.values(sourceIntegrity).every((value) => value === true);
  const rcGateBlocked = rcGate.result === 'RC_GATE_BLOCKED' && rcGate.rc_gate_blocked === true;

  const control = {
    proto: 'HBCE-B2B-L1-V3-4-R1-EVIDENCE-REVIEW-EXTERNAL-VALIDATION-CONTROL-v1',
    kind: 'HBCE_B2B_L1_V3_4_R1_EVIDENCE_REVIEW_EXTERNAL_VALIDATION_CONTROL',
    document_code: 'HBCE-B2B-L1-MATRIX-PROG-2027-0001',
    specification_baseline: 'V3.4-R1 - Controlled Corrective Revision - 26 September 2026',
    issue_id: 'PROG-040',
    priority: 'V3.4-R1-EVIDENCE-REVIEW-AND-EXTERNAL-VALIDATION',
    repository_baseline_commit: repositoryCommit,

    source_e2e_evidence_pack_ref: evidencePackPath,
    source_e2e_evidence_pack_revision_hash: evidencePack.revision_hash,
    source_rc_gate_evaluation_ref: rcGatePath,
    source_rc_gate_evaluation_revision_hash: rcGate.revision_hash,

    source_integrity: sourceIntegrity,
    rc_gate_input_state: {
      result: rcGate.result,
      rc_gate_blocked: rcGate.rc_gate_blocked,
      rc_gate_passed: rcGate.rc_gate_passed
    },

    status: allSourceIntegrityValid && rcGateBlocked
      ? 'EVIDENCE_REVIEW_CONTROL_CREATED_EXTERNAL_VALIDATION_REQUIRED'
      : 'EVIDENCE_REVIEW_CONTROL_INPUT_INVALID',

    evidence_review_items: reviewItems,
    external_validation_boundary: externalValidationBoundary,
    pilot_customer_boundary: pilotCustomerBoundary,

    review_gate: {
      evidence_review_started: true,
      evidence_review_complete: false,
      all_review_items_closed: false,
      corrective_actions_open: false,
      external_validation_complete: false,
      pilot_customer_access_available: false,
      release_candidate_ready: false,
      production_ready: false
    },

    next_required_program: 'PROG-041-EXTERNAL-VALIDATION-RESULTS-INGESTION',

    non_claims: {
      production_ready: false,
      release_candidate_ready: false,
      pilot_access_available: false,
      customer_acceptance: false,
      external_validation_complete: false,
      automatic_release_authorization: false,
      commercial_claim_complete: false
    }
  };

  control.revision_hash = sha256Digest(control);
  return control;
}

function writeEvidenceReviewControl(targetPath, options) {
  const rootDir = options && options.rootDir ? options.rootDir : process.cwd();
  const control = buildEvidenceReviewControl({ rootDir, repositoryCommit: options && options.repositoryCommit });
  fs.writeFileSync(path.join(rootDir, targetPath), `${JSON.stringify(control, null, 2)}\n`, 'utf8');
  return control;
}

if (require.main === module) {
  const targetPath = process.argv[2] || 'docs/launch/level1/v3-4-r1/v3-4-r1-evidence-review-external-validation-control.json';
  const control = writeEvidenceReviewControl(targetPath, { rootDir: process.cwd() });
  console.log(`PROG_040_EVIDENCE_REVIEW_CONTROL_WRITTEN=${control.status}`);
}

module.exports = {
  buildEvidenceReviewControl,
  writeEvidenceReviewControl
};
