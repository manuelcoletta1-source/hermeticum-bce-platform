'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { sha256Digest } = require('../../../packages/hbce-core/canonical-json.js');
const { RESULTS, validateRecoveryLineage } = require('../../../runtime/recovery/validate-recovery-lineage.js');

const root = path.resolve(__dirname, '../../..');
const read = (p) => fs.readFileSync(path.join(root, p), 'utf8');
const json = (p) => JSON.parse(read(p));

const registryPath = 'docs/launch/level1/v3-4-r1/v3-4-r1-producer-registry-baseline.json';
const t217Path = 'docs/launch/level1/v3-4-r1/v3-4-r1-t217-producer-binding-enforcement.json';
const docPath = 'docs/launch/level1/v3-4-r1/v3-4-r1-t218-t222-recovery-coverage-harness.json';
const mdPath = 'docs/launch/level1/v3-4-r1/v3-4-r1-t218-t222-recovery-coverage-harness.md';
const runtimePath = 'runtime/recovery/validate-recovery-lineage.js';

for (const p of [registryPath, t217Path, docPath, mdPath, runtimePath]) {
  assert.equal(fs.existsSync(path.join(root, p)), true, `${p} must exist`);
}

const registry = json(registryPath);
const t217 = json(t217Path);
const doc = json(docPath);
const md = read(mdPath);

assert.equal(doc.proto, 'HBCE-B2B-L1-V3-4-R1-T218-T222-RECOVERY-COVERAGE-HARNESS-v1');
assert.equal(doc.kind, 'HBCE_B2B_L1_V3_4_R1_T218_T222_RECOVERY_COVERAGE_HARNESS');
assert.equal(doc.issue_id, 'PROG-034');
assert.deepEqual(doc.acceptance_tests, ['T218', 'T219', 'T220', 'T221', 'T222']);
assert.equal(doc.source_producer_registry_revision_hash, registry.revision_hash);
assert.equal(doc.source_t217_enforcement_revision_hash, t217.revision_hash);

const body = { ...doc };
delete body.revision_hash;
assert.equal(doc.revision_hash, sha256Digest(body));

function check(input, expectedResult, expectedInvariant) {
  const result = validateRecoveryLineage({ registry, ...input });
  assert.equal(result.result, expectedResult, `${input.recovery_type} expected ${expectedResult}, got ${result.result}`);
  if (expectedInvariant) {
    assert.equal(result.invariant, expectedInvariant, `${input.recovery_type} expected invariant ${expectedInvariant}`);
  }
  return result;
}

assert.equal(
  check({
    recovery_type: 'T218_OPERATIONAL_FAILED_NEW_RUN',
    producer_id: 'PRODUCER::HBCE_CORE',
    prior_record: {
      id: 'eval-old-failed-001',
      namespace: 'OPERATIONAL',
      original_state: 'OPERATIONAL::FAILED',
      current_state: 'OPERATIONAL::FAILED'
    },
    new_record: {
      prior_ref: 'eval-old-failed-001',
      run_id: 'run-new-001',
      authorization_evaluation_id: 'eval-new-001'
    }
  }, RESULTS.NEW_RUN_ACCEPTED, RESULTS.PRIOR_FAILED_PRESERVED).allowed,
  true
);

assert.equal(
  check({
    recovery_type: 'T219_GATE_BLOCKED_NEW_EVALUATION',
    producer_id: 'PRODUCER::GATE_EVALUATOR',
    prior_record: {
      id: 'gate-old-blocked-001',
      namespace: 'GATE',
      original_state: 'GATE::BLOCKED',
      current_state: 'GATE::BLOCKED'
    },
    new_record: {
      prior_ref: 'gate-old-blocked-001',
      gate_evaluation_ref: 'gate-new-001'
    }
  }, RESULTS.NEW_GATE_EVALUATION, RESULTS.PRIOR_GATE_BLOCKED_PRESERVED).allowed,
  true
);

assert.equal(
  check({
    recovery_type: 'T220_ASSURANCE_INVALIDATED_NEW_CONTEXT',
    producer_id: 'PRODUCER::QUALIFIED_VERIFIER',
    prior_record: {
      id: 'assurance-invalidated-001',
      namespace: 'ASSURANCE',
      original_state: 'ASSURANCE::INVALIDATED',
      current_state: 'ASSURANCE::INVALIDATED'
    },
    new_record: {
      prior_ref: 'assurance-invalidated-001',
      validation_context_id: 'validation-new-001',
      state: 'ASSURANCE::UNDER_VALIDATION'
    }
  }, RESULTS.ASSURANCE_UNDER_VALIDATION_NEW_CONTEXT, RESULTS.PRIOR_VERDICT_PRESERVED).allowed,
  true
);

assert.equal(
  check({
    recovery_type: 'T221_AUTHORITY_UNRESOLVED_NEW_EVALUATION',
    producer_id: 'PRODUCER::HBCE_CORE',
    prior_record: {
      id: 'authority-unresolved-001',
      namespace: 'OPERATIONAL',
      original_state: 'AUTHORITY_UNRESOLVED::REQUEST_BLOCKED',
      current_state: 'AUTHORITY_UNRESOLVED::REQUEST_BLOCKED'
    },
    new_record: {
      prior_ref: 'authority-unresolved-001',
      authorization_evaluation_id: 'eval-authority-new-001',
      state: 'OPERATIONAL::NOT_EVALUATED',
      authority_resolution: 'RESOLVED'
    }
  }, RESULTS.NEW_EVALUATION_NOT_EVALUATED, RESULTS.NO_RETROACTIVE_AUTHORITY).allowed,
  true
);

assert.equal(
  check({
    recovery_type: 'T222_CONTRACT_RETIRED_NEW_VERSION',
    producer_id: 'PRODUCER::CONTRACT_CONTROL',
    prior_record: {
      id: 'contract-retired-001',
      namespace: 'CONTRACT',
      original_state: 'CONTRACT::RETIRED',
      current_state: 'CONTRACT::RETIRED'
    },
    new_record: {
      prior_ref: 'contract-retired-001',
      contract_version_id: 'contract-new-001',
      state: 'CONTRACT::DRAFT'
    }
  }, RESULTS.NEW_CONTRACT_VERSION_DRAFT_OR_DEFINED, RESULTS.PRIOR_RETIRED_PRESERVED).allowed,
  true
);

assert.equal(
  validateRecoveryLineage({
    registry,
    recovery_type: 'T218_OPERATIONAL_FAILED_NEW_RUN',
    producer_id: 'PRODUCER::UNREGISTERED',
    prior_record: {
      id: 'eval-old-failed-002',
      namespace: 'OPERATIONAL',
      original_state: 'OPERATIONAL::FAILED',
      current_state: 'OPERATIONAL::FAILED'
    },
    new_record: {
      prior_ref: 'eval-old-failed-002',
      run_id: 'run-new-002',
      authorization_evaluation_id: 'eval-new-002'
    }
  }).result,
  RESULTS.PRODUCER_BINDING_DENIED
);

assert.equal(
  validateRecoveryLineage({
    registry,
    recovery_type: 'T219_GATE_BLOCKED_NEW_EVALUATION',
    producer_id: 'PRODUCER::HBCE_CORE',
    prior_record: {
      id: 'gate-old-blocked-002',
      namespace: 'GATE',
      original_state: 'GATE::BLOCKED',
      current_state: 'GATE::BLOCKED'
    },
    new_record: {
      prior_ref: 'gate-old-blocked-002',
      gate_evaluation_ref: 'gate-new-002'
    }
  }).result,
  RESULTS.PRODUCER_BINDING_DENIED
);

assert.equal(
  validateRecoveryLineage({
    registry,
    recovery_type: 'T222_CONTRACT_RETIRED_NEW_VERSION',
    producer_id: 'PRODUCER::CONTRACT_CONTROL',
    prior_record: {
      id: 'contract-retired-002',
      namespace: 'CONTRACT',
      original_state: 'CONTRACT::RETIRED',
      current_state: 'CONTRACT::RELEASED',
      rewritten: true
    },
    new_record: {
      prior_ref: 'contract-retired-002',
      contract_version_id: 'contract-new-002',
      state: 'CONTRACT::DEFINED'
    }
  }).result,
  RESULTS.PRIOR_REWRITE_DENIED
);

assert.equal(
  validateRecoveryLineage({
    registry,
    recovery_type: 'T220_ASSURANCE_INVALIDATED_NEW_CONTEXT',
    producer_id: 'PRODUCER::QUALIFIED_VERIFIER',
    prior_record: {
      id: 'assurance-invalidated-002',
      namespace: 'ASSURANCE',
      original_state: 'ASSURANCE::INVALIDATED',
      current_state: 'ASSURANCE::INVALIDATED'
    },
    new_record: {
      prior_ref: 'wrong-prior',
      validation_context_id: 'validation-new-002',
      state: 'ASSURANCE::UNDER_VALIDATION'
    }
  }).result,
  RESULTS.LINEAGE_REF_REQUIRED
);

assert.equal(doc.recovery_coverage.length, 5);
assert.equal(doc.enforcement_scope.requires_prior_record, true);
assert.equal(doc.enforcement_scope.requires_new_object, true);
assert.equal(doc.enforcement_scope.requires_prior_ref, true);
assert.equal(doc.enforcement_scope.blocks_prior_rewrite, true);
assert.equal(doc.enforcement_scope.uses_t217_producer_binding, true);
assert.equal(doc.enforcement_scope.preserves_terminal_or_blocking_history, true);

assert.equal(doc.non_claims.production_ready, false);
assert.equal(doc.non_claims.release_candidate_ready, false);
assert.equal(doc.non_claims.full_runtime_authorization_complete, false);
assert.equal(doc.non_claims.full_recovery_program_complete, false);
assert.equal(doc.non_claims.t211_t212_continuation_complete, false);
assert.equal(doc.non_claims.t223_t225_meta_type_complete, false);
assert.equal(doc.non_claims.pilot_access_available, false);

assert.match(md, /Recovery creates new governed objects with explicit lineage/);
assert.match(md, /does not rewrite terminal or blocking history into success/);
assert.match(md, /covers T218-T222 only/);

console.log('PASS PROG-034-V3-4-R1-T218-T222-DOCS-EXIST');
console.log('PASS PROG-034-V3-4-R1-T218-T222-HASH-STABLE');
console.log('PASS PROG-034-V3-4-R1-RECOVERY-RUNTIME-MODULE-EXISTS');
console.log('PASS PROG-034-V3-4-R1-T218-FAILED-RECOVERY');
console.log('PASS PROG-034-V3-4-R1-T219-GATE-BLOCKED-RECOVERY');
console.log('PASS PROG-034-V3-4-R1-T220-ASSURANCE-INVALIDATED-RECOVERY');
console.log('PASS PROG-034-V3-4-R1-T221-AUTHORITY-UNRESOLVED-RECOVERY');
console.log('PASS PROG-034-V3-4-R1-T222-CONTRACT-RETIRED-RECOVERY');
console.log('PASS PROG-034-V3-4-R1-PRODUCER-BINDING-USED');
console.log('PASS PROG-034-V3-4-R1-PRIOR-HISTORY-PRESERVED');
console.log('PASS PROG-034-V3-4-R1-NO-FULL-RECOVERY-PROGRAM-CLAIM');
