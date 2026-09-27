'use strict';

const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');
const { sha256Digest } = require('../../packages/hbce-core/canonical-json.js');

const STATUS = 'LEVEL1_AUTHORITY_BOUNDARY_STATEMENT_DEFINED_NOT_READY';
const SOURCE_REF = 'docs/launch/level1/prog-069-evidence-chain-manifest.json';

const REQUIRED_FIELDS = Object.freeze([
  'authority_boundary_id',
  'authority_type',
  'authority_ref',
  'organization_ref',
  'role_ref',
  'delegation_ref',
  'scope_ref',
  'policy_ref',
  'validity_window',
  'revocation_ref',
  'evidence_chain_ref',
  'non_claims'
]);

const AUTHORITY_TYPES = Object.freeze([
  'HUMAN',
  'ORGANIZATIONAL',
  'DELEGATED_HUMAN',
  'DELEGATED_ORGANIZATIONAL'
]);

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

function buildAuthorityBoundaryStatement(options = {}) {
  const rootDir = options.rootDir || process.cwd();
  const source = readJson(rootDir, SOURCE_REF);

  const doc = {
    proto: 'HBCE-L1-PROG-070-AUTHORITY-BOUNDARY-STATEMENT-v1',
    kind: 'HBCE_LEVEL1_AUTHORITY_BOUNDARY_STATEMENT',
    document_code: 'HBCE-L1-AUTHORITY-BOUNDARY-STATEMENT-2027-PROG-070',
    issue_id: 'PROG-070',
    priority: 'LEVEL1-AUTHORITY-BOUNDARY-STATEMENT',
    repository_baseline_commit: options.repositoryCommit || gitHead(rootDir),

    source_evidence_chain_manifest_ref: SOURCE_REF,
    source_evidence_chain_manifest_revision_hash: source.revision_hash,
    source_evidence_chain_manifest_revision_hash_valid: validHash(source),

    authority_boundary_status: STATUS,

    inherited_evidence_boundary: {
      evidence_chain_manifest_status: source.evidence_chain_manifest_status,
      evidence_chain_manifest_ready: source.readiness_state.evidence_chain_manifest_ready,
      ai_authority_claim_fails_closed: source.evidence_chain_manifest.ai_authority_claim_fails_closed,
      verifier_replay_ready: source.readiness_state.verifier_replay_ready
    },

    authority_boundary_statement: {
      purpose: 'Define the human or organizational authority boundary required before a governed digital action can enter the Level 1 Decision Proof evidence chain.',
      required_fields: REQUIRED_FIELDS,
      authority_types_allowed: AUTHORITY_TYPES,
      human_or_organizational_authority_required: true,
      ai_model_authority_allowed: false,
      model_output_is_not_authority: true,
      missing_authority_boundary_fails_closed: true,
      missing_scope_fails_closed: true,
      missing_policy_ref_fails_closed: true,
      expired_validity_window_fails_closed: true,
      revoked_authority_fails_closed: true
    },

    minimal_boundary_template: {
      authority_boundary_id: 'AUTH-BOUNDARY-TEMPLATE-0001',
      authority_type: 'HUMAN',
      authority_ref: 'AUTHORITY::HUMAN_OR_ORGANIZATION_REQUIRED',
      organization_ref: 'ORGANIZATION::OPTIONAL_OR_REQUIRED_BY_SCOPE',
      role_ref: 'ROLE::REQUIRED_FOR_ORGANIZATIONAL_SCOPE',
      delegation_ref: 'DELEGATION::NONE_OR_BOUND',
      scope_ref: 'SCOPE::LEVEL1_DECISION_PROOF_DEMO',
      policy_ref: 'POLICY::LEVEL1_POLICY_EVALUATION_REQUIRED',
      validity_window: {
        starts_at: 'TO_BE_BOUND',
        ends_at: 'TO_BE_BOUND'
      },
      revocation_ref: 'REVOCATION::CHECK_REQUIRED',
      evidence_chain_ref: 'PROG-069-HBCE-LEVEL1-EVIDENCE-CHAIN-MANIFEST',
      non_claims: {
        legal_validity: false,
        public_accreditation: false,
        autonomous_authority: false,
        ai_authority: false
      }
    },

    fail_closed_codes: [
      'AUTHORITY_BOUNDARY_MISSING',
      'AUTHORITY_TYPE_INVALID',
      'AUTHORITY_REF_MISSING',
      'ROLE_OR_ORGANIZATION_REF_REQUIRED',
      'SCOPE_REF_MISSING',
      'POLICY_REF_MISSING',
      'VALIDITY_WINDOW_MISSING',
      'AUTHORITY_EXPIRED',
      'AUTHORITY_REVOKED',
      'AI_AUTHORITY_CLAIM_BLOCKED'
    ],

    readiness_state: {
      authority_boundary_statement_defined: true,
      authority_boundary_statement_ready: false,
      authority_boundary_template_ready: true,
      concrete_authority_bound: false,
      policy_ref_bound: false,
      validity_window_bound: false,
      revocation_check_ready: false,
      evidence_chain_node_complete: false,
      decision_proof_demo_ready: false,
      level1_launch_ready: false,
      level1_client_pack_ready: false,
      production_ready: false
    },

    next_required_program: 'PROG-071-HBCE-LEVEL1-POLICY-EVALUATION-RECORD',

    non_claims: {
      concrete_authority_bound: false,
      legal_validity: false,
      public_accreditation: false,
      procurement_eligibility: false,
      ai_authority: false,
      autonomous_authority: false,
      decision_proof_demo_ready: false,
      level1_launch_ready: false,
      level1_client_pack_ready: false,
      production_ready: false
    }
  };

  doc.revision_hash = sha256Digest(doc);
  return doc;
}

function writeAuthorityBoundaryStatement(targetPath, options = {}) {
  const rootDir = options.rootDir || process.cwd();
  const doc = buildAuthorityBoundaryStatement({ rootDir, repositoryCommit: options.repositoryCommit });
  fs.writeFileSync(path.join(rootDir, targetPath), `${JSON.stringify(doc, null, 2)}\n`);
  return doc;
}

if (require.main === module) {
  const targetPath = process.argv[2] || 'docs/launch/level1/prog-070-authority-boundary-statement.json';
  const doc = writeAuthorityBoundaryStatement(targetPath, { rootDir: process.cwd() });
  console.log(`PROG_070_AUTHORITY_BOUNDARY_STATEMENT_WRITTEN=${doc.revision_hash}`);
}

module.exports = { STATUS, SOURCE_REF, REQUIRED_FIELDS, AUTHORITY_TYPES, buildAuthorityBoundaryStatement, writeAuthorityBoundaryStatement };
