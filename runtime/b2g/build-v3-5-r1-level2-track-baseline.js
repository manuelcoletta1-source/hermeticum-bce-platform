'use strict';

const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');
const { sha256Digest } = require('../../packages/hbce-core/canonical-json.js');

function gitHead(rootDir) {
  try {
    return execFileSync('git', ['rev-parse', 'HEAD'], { cwd: rootDir, encoding: 'utf8' }).trim();
  } catch (_error) {
    return 'UNKNOWN';
  }
}

function buildLevel2TrackBaseline(options) {
  const rootDir = options && options.rootDir ? options.rootDir : process.cwd();
  const repositoryCommit = options && options.repositoryCommit ? options.repositoryCommit : gitHead(rootDir);

  const doc = {
    proto: 'HBCE-B2G-L2-JC2-V3-5-R1-TRACK-BASELINE-v1',
    kind: 'HBCE_B2G_LEVEL2_JOKER_C2_V3_5_R1_TRACK_BASELINE',
    document_code: 'HBCE-B2G-L2-JC2-PROG-2027-0001',
    specification_baseline: 'V3.5-R1 - Forensic Evidence & Verifier Qualification Hardening - 26 September 2026',
    issue_id: 'PROG-042',
    priority: 'V3.5-R1-LEVEL2-B2G-TRACK-BASELINE',
    repository_baseline_commit: repositoryCommit,

    source_document: {
      title: 'HBCE B2G Level 2 / JOKER-C2 / V3.5-R1 / Forensic Evidence & Verifier Qualification Hardening',
      product_level: 'JOKER-C2 LAYER MATRIX / HBCE B2G Level 2',
      status: 'CONTROLLED_CORRECTIVE_REVISION_INTERNAL_LEVEL_2_ARCHITECTURE_PRE_MARKET',
      source_type: 'uploaded_pdf',
      source_scope: 'technical architecture baseline, not implementation proof'
    },

    level1_relationship: {
      level1_b2b_remains_core_operational_target: true,
      level1_target_date: '2027-01-19',
      level2_is_distinct_b2g_readiness_track: true,
      level2_does_not_replace_level1: true,
      level2_does_not_modify_level1_release_target: true
    },

    canonical_level2_claim: {
      purpose: 'Govern the action, then make demonstrable how, why and under which configured authority it occurred while preserving what the evidence does not establish.',
      context: 'non-classified institutional contexts',
      product_class: 'human-governed evidence-bound forensically reviewable AI-assisted critical action infrastructure',
      joker_c2_role: 'human interaction and forensic inquiry layer',
      joker_c2_public_authority: false
    },

    inherited_level1_invariants: [
      'human_grounded_authority',
      'producer_binding',
      'positive_authorization',
      'qualified_assurance',
      'append_only_recovery',
      'typed_namespaces',
      'no_model_authority'
    ],

    level2_programming_priorities: [
      'VerifierQualificationRecord',
      'CustodyEventRecord',
      'HumanDecisionProfile',
      'AdapterProvenanceProfile',
      'B2G_T26_T43_runtime_harness'
    ],

    initial_gap_register: [
      {
        gap_id: 'L2-GAP-001',
        title: 'Level 2 producer registry baseline missing',
        status: 'OPEN',
        blocking_effect: 'No Level 2 evidentiary, qualification, custody or export-state mutation can be claimed.'
      },
      {
        gap_id: 'L2-GAP-002',
        title: 'VerifierQualificationRecord runtime contract missing',
        status: 'OPEN',
        blocking_effect: 'No QUALIFIED claim and no ASSURANCE::PROVEN path can be claimed for Level 2.'
      },
      {
        gap_id: 'L2-GAP-003',
        title: 'CustodyEventRecord and trusted-time boundary runtime contract missing',
        status: 'OPEN',
        blocking_effect: 'No custody sealing, time-source assurance or seal/signature limitation enforcement can be claimed.'
      },
      {
        gap_id: 'L2-GAP-004',
        title: 'HumanDecisionProfile runtime contract missing',
        status: 'OPEN',
        blocking_effect: 'No deterministic Level 2 required/not-required human decision workflow can be claimed.'
      },
      {
        gap_id: 'L2-GAP-005',
        title: 'AdapterProvenanceProfile runtime contract missing',
        status: 'OPEN',
        blocking_effect: 'No legacy adapter provenance, loss disclosure or source-status non-promotion enforcement can be claimed.'
      },
      {
        gap_id: 'L2-GAP-006',
        title: 'B2G-T26-T43 runtime harness missing',
        status: 'OPEN',
        blocking_effect: 'No V3.5-R1 qualification/custody/human-decision/adapter acceptance coverage can be claimed.'
      }
    ],

    readiness_state: {
      level2_track_created: true,
      level2_runtime_implemented: false,
      b2g_candidate_ready: false,
      public_sector_production_ready: false,
      public_accreditation_available: false,
      procurement_eligibility_claimed: false,
      external_public_endorsement_claimed: false,
      classified_defence_scope_included: false
    },

    next_required_program: 'PROG-043-V3-5-R1-LEVEL2-PRODUCER-REGISTRY-BASELINE',

    non_claims: {
      production_ready: false,
      release_candidate_ready: false,
      b2g_candidate_ready: false,
      public_accreditation: false,
      procurement_eligibility: false,
      legal_validity: false,
      government_endorsement: false,
      classified_defence_readiness: false,
      external_validation_complete: false
    }
  };

  doc.revision_hash = sha256Digest(doc);
  return doc;
}

function writeLevel2TrackBaseline(targetPath, options) {
  const rootDir = options && options.rootDir ? options.rootDir : process.cwd();
  const doc = buildLevel2TrackBaseline({ rootDir, repositoryCommit: options && options.repositoryCommit });
  fs.writeFileSync(path.join(rootDir, targetPath), `${JSON.stringify(doc, null, 2)}\n`, 'utf8');
  return doc;
}

if (require.main === module) {
  const targetPath = process.argv[2] || 'docs/launch/level2/v3-5-r1/v3-5-r1-level2-track-baseline.json';
  const doc = writeLevel2TrackBaseline(targetPath, { rootDir: process.cwd() });
  console.log(`PROG_042_V3_5_R1_LEVEL2_TRACK_BASELINE_WRITTEN=${doc.revision_hash}`);
}

module.exports = {
  buildLevel2TrackBaseline,
  writeLevel2TrackBaseline
};
