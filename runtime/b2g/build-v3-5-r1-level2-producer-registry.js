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

function validHash(doc) {
  if (!doc || typeof doc !== 'object' || !doc.revision_hash) return false;
  const body = { ...doc };
  delete body.revision_hash;
  return doc.revision_hash === sha256Digest(body);
}

const LEVEL2_PRODUCERS = Object.freeze([
  { producer_id: 'PRODUCER::HBCE_CORE', domain: 'OPERATIONAL', allowed: ['authorization', 'block_or_allow', 'new_evaluation', 'dispatch_governance'], forbidden: ['assurance_verdict', 'evidentiary_legal_conclusion', 'public_mandate_creation'] },
  { producer_id: 'PRODUCER::TARGET_OUTCOME_LOGIC', domain: 'OPERATIONAL', allowed: ['executed_or_failed_from_receipt', 'outcome_evidence_binding'], forbidden: ['authorization'] },
  { producer_id: 'PRODUCER::QUALIFIED_VERIFIER', domain: 'ASSURANCE', allowed: ['under_validation', 'proven', 'invalidated'], forbidden: ['public_authority_creation', 'evidentiary_legal_conclusion'] },
  { producer_id: 'PRODUCER::FORENSIC_REVIEW', domain: 'EVIDENTIARY', allowed: ['support_classification', 'contestation_record', 'limitation_record'], forbidden: ['guilt_liability_legality_decision', 'operational_allowed'] },
  { producer_id: 'PRODUCER::GATE_EVALUATOR', domain: 'GATE', allowed: ['b2g_readiness_gate_evaluation'], forbidden: ['public_authorization_by_gate_pass'] },
  { producer_id: 'PRODUCER::EXPORT_CONTROL', domain: 'EXPORT', allowed: ['profile_bound_export', 'minimization', 'redaction_constraint_application'], forbidden: ['source_of_truth_replacement'] },
  { producer_id: 'PRODUCER::SCHEMA_REGISTRY', domain: 'SCHEMA', allowed: ['level2_schema_versioning', 'level2_vocabulary_maintenance'], forbidden: ['runtime_mutation'] },
  { producer_id: 'PRODUCER::VERIFIER_QUALIFICATION_CONTROL', domain: 'QUALIFICATION', allowed: ['qualification_record_versioning', 'scope_validity_independence_conflict_status', 'revocation'], forbidden: ['assurance_verdict', 'external_public_accreditation_by_inference'] },
  { producer_id: 'PRODUCER::EVIDENCE_CUSTODY', domain: 'EVIDENCE_CUSTODY', allowed: ['custody_event_append', 'transformation_event_append', 'access_event_append', 'export_event_append', 'seal_time_source_verification_event_append'], forbidden: ['evidentiary_promotion', 'officiality_inference_from_hash', 'identity_inference_from_hash'] }
]);

function buildLevel2ProducerRegistry(options = {}) {
  const rootDir = options.rootDir || process.cwd();
  const repositoryCommit = options.repositoryCommit || gitHead(rootDir);
  const baselinePath = 'docs/launch/level2/v3-5-r1/v3-5-r1-level2-track-baseline.json';
  const baseline = readJson(rootDir, baselinePath);

  const doc = {
    proto: 'HBCE-B2G-L2-JC2-V3-5-R1-PRODUCER-REGISTRY-BASELINE-v1',
    kind: 'HBCE_B2G_LEVEL2_JOKER_C2_V3_5_R1_PRODUCER_REGISTRY_BASELINE',
    document_code: 'HBCE-B2G-L2-JC2-PROG-2027-0001',
    specification_baseline: 'V3.5-R1 - Forensic Evidence & Verifier Qualification Hardening - 26 September 2026',
    issue_id: 'PROG-043',
    priority: 'V3.5-R1-LEVEL2-PRODUCER-REGISTRY-BASELINE',
    repository_baseline_commit: repositoryCommit,
    source_level2_track_baseline_ref: baselinePath,
    source_level2_track_baseline_revision_hash: baseline.revision_hash,
    source_level2_track_baseline_revision_hash_valid: validHash(baseline),
    producer_binding_rule: {
      rule_id: 'V3_5_R1_LEVEL2_NO_REGISTERED_PRODUCER_NO_EVIDENTIARY_OR_EXPORT_STATE_MUTATION',
      no_registered_level2_producer_no_evidentiary_mutation: true,
      no_registered_level2_producer_no_export_state_mutation: true,
      b2g_table_cannot_bypass_level1_hbce_core: true,
      model_output_cannot_create_producer_authority: true
    },
    producers: LEVEL2_PRODUCERS,
    registry_summary: {
      registered_producer_count: LEVEL2_PRODUCERS.length,
      registered_domains: Array.from(new Set(LEVEL2_PRODUCERS.map((p) => p.domain))).sort(),
      inherited_level1_producers_preserved: true,
      level2_adds_b2g_specific_producers: true,
      level2_does_not_degrade_level1_producer_binding: true
    },
    closed_gap: {
      gap_id: 'L2-GAP-001',
      title: 'Level 2 producer registry baseline missing',
      closed_by: 'PROG-043',
      status: 'CLOSED_BASELINE_ONLY',
      runtime_enforcement_implemented: false
    },
    remaining_open_gaps: ['L2-GAP-002', 'L2-GAP-003', 'L2-GAP-004', 'L2-GAP-005', 'L2-GAP-006'],
    readiness_state: {
      level2_producer_registry_baseline_created: true,
      level2_producer_runtime_enforcement_complete: false,
      verifier_qualification_runtime_complete: false,
      custody_runtime_complete: false,
      human_decision_runtime_complete: false,
      adapter_provenance_runtime_complete: false,
      b2g_t26_t43_harness_complete: false,
      b2g_candidate_ready: false,
      public_sector_production_ready: false
    },
    next_required_program: 'PROG-044-V3-5-R1-VERIFIER-QUALIFICATION-RECORD-CONTRACT',
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

function writeLevel2ProducerRegistry(targetPath, options = {}) {
  const rootDir = options.rootDir || process.cwd();
  const doc = buildLevel2ProducerRegistry({ rootDir, repositoryCommit: options.repositoryCommit });
  fs.writeFileSync(path.join(rootDir, targetPath), `${JSON.stringify(doc, null, 2)}\n`, 'utf8');
  return doc;
}

if (require.main === module) {
  const targetPath = process.argv[2] || 'docs/launch/level2/v3-5-r1/v3-5-r1-level2-producer-registry-baseline.json';
  const doc = writeLevel2ProducerRegistry(targetPath, { rootDir: process.cwd() });
  console.log(`PROG_043_V3_5_R1_LEVEL2_PRODUCER_REGISTRY_WRITTEN=${doc.revision_hash}`);
}

module.exports = { LEVEL2_PRODUCERS, buildLevel2ProducerRegistry, writeLevel2ProducerRegistry };
