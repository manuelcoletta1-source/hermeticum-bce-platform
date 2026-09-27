'use strict';

const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');
const { sha256Digest } = require('../../packages/hbce-core/canonical-json.js');

const SNAPSHOT_STATUS = 'LEVEL3_C1_READINESS_SNAPSHOT_CREATED_NOT_PILOT_READY';

const SOURCE_REFS = Object.freeze([
  'docs/launch/level3/v0-1-c1/prog-058-level3-pilot-intake-pack.json',
  'docs/launch/level3/v0-1-c1/prog-059-physical-action-envelope-contract.json',
  'docs/launch/level3/v0-1-c1/prog-060-physical-safety-envelope-contract.json',
  'docs/launch/level3/v0-1-c1/prog-061-safe-hold-estop-contract.json',
  'docs/launch/level3/v0-1-c1/prog-062-controller-receipt-contract.json',
  'docs/launch/level3/v0-1-c1/prog-063-sensor-evidence-contract.json',
  'docs/launch/level3/v0-1-c1/prog-064-physical-effect-evaluation-gate.json'
]);

const ALLOWED_C1_SCOPE = Object.freeze([
  'INTAKE_ONLY',
  'SCOPE_SCREENING',
  'SIMULATION_ONLY',
  'OBSERVER_MODE',
  'DRY_RUN_NO_ACTUATION'
]);

const BLOCKED_C1_SCOPE = Object.freeze([
  'LIVE_CONTROL',
  'CONTROLLED_ACTUATION',
  'UNCONTROLLED_PHYSICAL_ACTUATION',
  'PHYSICAL_EFFECT_CLAIM',
  'PILOT_READY_PROMOTION',
  'PHYSICAL_DEPLOYMENT',
  'PRODUCTION_USE'
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

function buildSourceInventory(rootDir) {
  return SOURCE_REFS.map((ref) => {
    const source = readJson(rootDir, ref);
    return {
      ref,
      issue_id: source.issue_id,
      kind: source.kind,
      revision_hash: source.revision_hash,
      revision_hash_valid: validHash(source)
    };
  });
}

function buildLevel3C1ReadinessSnapshot(options = {}) {
  const rootDir = options.rootDir || process.cwd();
  const repositoryCommit = options.repositoryCommit || gitHead(rootDir);
  const sourceInventory = buildSourceInventory(rootDir);
  const physicalEffectGate = readJson(rootDir, 'docs/launch/level3/v0-1-c1/prog-064-physical-effect-evaluation-gate.json');

  const allSourcesValid = sourceInventory.every((entry) => entry.revision_hash_valid === true);
  const issueSet = new Set(sourceInventory.map((entry) => entry.issue_id));

  const doc = {
    proto: 'HBCE-L3-PROG-065-C1-READINESS-SNAPSHOT-v1',
    kind: 'HBCE_LEVEL3_C1_READINESS_SNAPSHOT',
    document_code: 'HBCE-L3-C1-READINESS-SNAPSHOT-2027-PROG-065',
    issue_id: 'PROG-065',
    priority: 'LEVEL3-C1-READINESS-SNAPSHOT',
    repository_baseline_commit: repositoryCommit,

    snapshot_status: SNAPSHOT_STATUS,
    source_inventory: sourceInventory,
    source_artifact_chain_complete: (
      issueSet.has('PROG-058') &&
      issueSet.has('PROG-059') &&
      issueSet.has('PROG-060') &&
      issueSet.has('PROG-061') &&
      issueSet.has('PROG-062') &&
      issueSet.has('PROG-063') &&
      issueSet.has('PROG-064')
    ),
    source_artifact_hashes_valid: allSourcesValid,

    inherited_physical_effect_gate: {
      ref: 'docs/launch/level3/v0-1-c1/prog-064-physical-effect-evaluation-gate.json',
      gate_result: physicalEffectGate.gate_result,
      physical_effect_proven: physicalEffectGate.readiness_state.physical_effect_proven,
      live_effect_claim_allowed: physicalEffectGate.readiness_state.live_effect_claim_allowed,
      physical_actuation_permitted: physicalEffectGate.readiness_state.physical_actuation_permitted,
      controlled_actuation_ready: physicalEffectGate.readiness_state.controlled_actuation_ready,
      level3_pilot_ready: physicalEffectGate.readiness_state.level3_pilot_ready,
      level3_physical_deployment_ready: physicalEffectGate.readiness_state.level3_physical_deployment_ready,
      production_ready: physicalEffectGate.readiness_state.production_ready
    },

    c1_scope_boundary: {
      allowed_without_new_evidence: ALLOWED_C1_SCOPE,
      blocked_without_new_evidence: BLOCKED_C1_SCOPE,
      maximum_current_operational_scope: 'DRY_RUN_NO_ACTUATION',
      controlled_actuation_requires_new_evidence: true,
      pilot_ready_promotion_requires_new_positive_gate: true,
      physical_effect_claim_requires_new_positive_gate: true
    },

    c1_evidence_chain_summary: {
      pilot_intake_pack_created: true,
      physical_action_envelope_created: true,
      physical_safety_envelope_created: true,
      safe_hold_estop_contract_created: true,
      controller_receipt_contract_created: true,
      sensor_evidence_contract_created: true,
      physical_effect_evaluation_gate_created: true,
      physical_effect_evaluation_gate_result: physicalEffectGate.gate_result
    },

    readiness_state: {
      level3_c1_snapshot_created: true,
      level3_c1_snapshot_evaluated: true,
      level3_c1_artifact_chain_complete: true,
      level3_c1_artifact_hashes_valid: allSourcesValid,
      intake_ready: true,
      simulation_boundary_representable: true,
      observer_mode_boundary_representable: true,
      dry_run_no_actuation_boundary_representable: true,
      physical_effect_proven: false,
      live_effect_claim_allowed: false,
      physical_actuation_permitted: false,
      controlled_actuation_ready: false,
      level3_pilot_ready: false,
      level3_physical_deployment_ready: false,
      production_ready: false
    },

    operational_conclusion: {
      conclusion: 'LEVEL3_C1_INTAKE_READY_NOT_PILOT_READY',
      can_be_presented_as_level3_intake_pack: true,
      can_be_presented_as_simulation_observer_dry_run_boundary: true,
      can_be_presented_as_live_control_ready: false,
      can_be_presented_as_physical_effect_proven: false,
      can_be_presented_as_pilot_ready: false,
      can_be_presented_as_deployment_ready: false
    },

    next_required_program: 'PROG-066-HBCE-LEVEL1-LAUNCH-REFOCUS-GATE',

    non_claims: {
      physical_effect_proven: false,
      live_effect_claim_allowed: false,
      physical_actuation_permitted: false,
      controlled_actuation_ready: false,
      level3_pilot_ready: false,
      level3_physical_deployment_ready: false,
      production_ready: false,
      autonomous_physical_control: false,
      public_accreditation: false,
      procurement_eligibility: false,
      legal_validity: false,
      government_endorsement: false,
      automatic_pilot_promotion: false
    }
  };

  doc.revision_hash = sha256Digest(doc);
  return doc;
}

function writeLevel3C1ReadinessSnapshot(targetPath, options = {}) {
  const rootDir = options.rootDir || process.cwd();
  const doc = buildLevel3C1ReadinessSnapshot({ rootDir, repositoryCommit: options.repositoryCommit });
  fs.writeFileSync(path.join(rootDir, targetPath), `${JSON.stringify(doc, null, 2)}\n`, 'utf8');
  return doc;
}

if (require.main === module) {
  const targetPath = process.argv[2] || 'docs/launch/level3/v0-1-c1/prog-065-level3-c1-readiness-snapshot.json';
  const doc = writeLevel3C1ReadinessSnapshot(targetPath, { rootDir: process.cwd() });
  console.log(`PROG_065_LEVEL3_C1_READINESS_SNAPSHOT_WRITTEN=${doc.revision_hash}`);
}

module.exports = {
  SNAPSHOT_STATUS,
  SOURCE_REFS,
  ALLOWED_C1_SCOPE,
  BLOCKED_C1_SCOPE,
  buildLevel3C1ReadinessSnapshot,
  writeLevel3C1ReadinessSnapshot
};
