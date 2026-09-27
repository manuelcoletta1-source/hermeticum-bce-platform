'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { sha256Digest } = require('../../../packages/hbce-core/canonical-json.js');
const {
  CONTRACT_STATUS,
  RECEIPT_STATUSES,
  REQUIRED_FIELDS,
  VALIDATOR_CODES,
  buildControllerReceiptContract
} = require('../../../runtime/level3/build-prog-062-controller-receipt-contract.js');

const root = path.resolve(__dirname, '../../..');
const read = (p) => fs.readFileSync(path.join(root, p), 'utf8');
const json = (p) => JSON.parse(read(p));
const exists = (p) => fs.existsSync(path.join(root, p));

const docPath = 'docs/launch/level3/v0-1-c1/prog-062-controller-receipt-contract.json';
const mdPath = 'docs/launch/level3/v0-1-c1/prog-062-controller-receipt-contract.md';
const runtimePath = 'runtime/level3/build-prog-062-controller-receipt-contract.js';
const sourcePath = 'docs/launch/level3/v0-1-c1/prog-061-safe-hold-estop-contract.json';

for (const p of [docPath, mdPath, runtimePath, sourcePath]) assert.equal(exists(p), true, `${p} must exist`);

const doc = json(docPath);
const md = read(mdPath);
const source = json(sourcePath);

assert.equal(doc.proto, 'HBCE-L3-PROG-062-CONTROLLER-RECEIPT-CONTRACT-v1');
assert.equal(doc.kind, 'HBCE_LEVEL3_CONTROLLER_RECEIPT_CONTRACT');
assert.equal(doc.issue_id, 'PROG-062');
assert.equal(doc.priority, 'LEVEL3-CONTROLLER-RECEIPT-CONTRACT');
assert.equal(doc.source_safe_hold_estop_contract_revision_hash, source.revision_hash);
assert.equal(doc.source_safe_hold_estop_contract_revision_hash_valid, true);

const regenerated = buildControllerReceiptContract({ rootDir: root, repositoryCommit: doc.repository_baseline_commit });
assert.deepEqual(regenerated, doc);

const body = { ...doc };
delete body.revision_hash;
assert.equal(doc.revision_hash, sha256Digest(body));

assert.equal(doc.contract_status, CONTRACT_STATUS);
assert.deepEqual(doc.receipt_statuses, RECEIPT_STATUSES);
assert.deepEqual(doc.required_fields, REQUIRED_FIELDS);
assert.deepEqual(doc.validator_codes, VALIDATOR_CODES);

assert.equal(doc.inherited_stop_boundary.estop_dominates_safe_hold, true);
assert.equal(doc.inherited_stop_boundary.reset_requires_human_authorization, true);
assert.equal(doc.inherited_stop_boundary.model_may_not_clear_safe_hold, true);
assert.equal(doc.inherited_stop_boundary.model_may_not_clear_estop, true);
assert.equal(doc.inherited_stop_boundary.live_control_ready_by_source, false);
assert.equal(doc.inherited_stop_boundary.physical_actuation_permitted_by_source, false);

assert.equal(doc.controller_receipt_contract.receipt_is_not_effect_proof, true);
assert.equal(doc.controller_receipt_contract.receipt_is_not_live_control_authorization, true);
assert.equal(doc.controller_receipt_contract.controller_may_accept_for_simulation, true);
assert.equal(doc.controller_receipt_contract.controller_may_accept_for_observer_mode, true);
assert.equal(doc.controller_receipt_contract.controller_may_accept_for_dry_run_no_actuation, true);
assert.equal(doc.controller_receipt_contract.controller_may_not_claim_live_effect_without_new_evidence, true);
assert.equal(doc.controller_receipt_contract.controller_receipt_required_before_any_effect_claim, true);
assert.equal(doc.controller_receipt_contract.safe_hold_or_estop_status_blocks_scope_return, true);
assert.equal(doc.controller_receipt_contract.missing_receipt_fails_closed, true);
assert.equal(doc.controller_receipt_contract.missing_digest_fails_closed, true);
assert.equal(doc.controller_receipt_contract.unsupported_effect_claim_fails_closed, true);

assert.equal(doc.allowed_receipt_meaning_without_new_evidence.received_request, true);
assert.equal(doc.allowed_receipt_meaning_without_new_evidence.rejected_request, true);
assert.equal(doc.allowed_receipt_meaning_without_new_evidence.accepted_for_simulation, true);
assert.equal(doc.allowed_receipt_meaning_without_new_evidence.accepted_for_observer_mode, true);
assert.equal(doc.allowed_receipt_meaning_without_new_evidence.accepted_for_dry_run_no_actuation, true);
assert.equal(doc.allowed_receipt_meaning_without_new_evidence.proof_of_live_effect, false);
assert.equal(doc.allowed_receipt_meaning_without_new_evidence.authorization_for_live_control, false);
assert.equal(doc.allowed_receipt_meaning_without_new_evidence.proof_of_physical_deployment, false);

assert.equal(doc.minimal_valid_controller_receipt_example.receipt_status, 'ACCEPTED_FOR_SIMULATION');
assert.equal(doc.minimal_valid_controller_receipt_example.effect_claim.live_effect_claimed, false);
assert.equal(doc.minimal_valid_controller_receipt_example.effect_claim.simulated_effect_claimed, false);
assert.equal(doc.minimal_valid_controller_receipt_example.effect_claim.effect_claim_requires_separate_evidence, true);

const vectorIds = new Set(doc.validation_vectors.map((v) => v.id));
assert.equal(vectorIds.has('L3-CR-T01'), true);
assert.equal(vectorIds.has('L3-CR-T02'), true);
assert.equal(vectorIds.has('L3-CR-T03'), true);
assert.equal(vectorIds.has('L3-CR-T04'), true);
assert.equal(vectorIds.has('L3-CR-POS-001'), true);

assert.equal(doc.readiness_state.controller_receipt_contract_created, true);
assert.equal(doc.readiness_state.controller_receipt_contract_evaluated, true);
assert.equal(doc.readiness_state.controller_receipt_representable, true);
assert.equal(doc.readiness_state.simulation_receipt_representable, true);
assert.equal(doc.readiness_state.observer_mode_receipt_representable, true);
assert.equal(doc.readiness_state.dry_run_no_actuation_receipt_representable, true);
assert.equal(doc.readiness_state.receipt_is_effect_proof, false);
assert.equal(doc.readiness_state.live_effect_claim_allowed, false);
assert.equal(doc.readiness_state.live_control_ready, false);
assert.equal(doc.readiness_state.physical_actuation_permitted, false);
assert.equal(doc.readiness_state.pilot_ready, false);
assert.equal(doc.readiness_state.physical_deployment_ready, false);
assert.equal(doc.readiness_state.production_ready, false);

assert.equal(doc.next_required_program, 'PROG-063-HBCE-LEVEL3-SENSOR-EVIDENCE-CONTRACT');

assert.equal(doc.non_claims.controller_receipt_as_effect_proof, false);
assert.equal(doc.non_claims.live_effect_claim_allowed, false);
assert.equal(doc.non_claims.live_control_ready, false);
assert.equal(doc.non_claims.physical_actuation_permitted, false);
assert.equal(doc.non_claims.level3_pilot_ready, false);
assert.equal(doc.non_claims.level3_physical_deployment_ready, false);
assert.equal(doc.non_claims.production_ready, false);
assert.equal(doc.non_claims.automatic_pilot_promotion, false);

assert.match(md, /LEVEL3_CONTROLLER_RECEIPT_CONTRACT_CREATED_NOT_EFFECT_PROOF/);
assert.match(md, /It does not prove physical effect/);
assert.match(md, /It does not authorize live control/);
assert.match(md, /A controller receipt does not clear Safe Hold or Emergency Stop/);
assert.match(md, /PROG-063-HBCE-LEVEL3-SENSOR-EVIDENCE-CONTRACT/);

console.log('PASS PROG-062-CONTROLLER-RECEIPT-DOCS-EXIST');
console.log('PASS PROG-062-CONTROLLER-RECEIPT-HASH-STABLE');
console.log('PASS PROG-062-BUILDER-STABLE');
console.log('PASS PROG-062-SOURCE-PROG-061-INTEGRITY-VALID');
console.log('PASS PROG-062-RECEIPT-IS-NOT-EFFECT-PROOF');
console.log('PASS PROG-062-RECEIPT-IS-NOT-LIVE-CONTROL-AUTHORIZATION');
console.log('PASS PROG-062-SAFE-HOLD-ESTOP-BLOCKS-SCOPE-RETURN');
console.log('PASS PROG-062-NO-LIVE-EFFECT-CLAIM');
console.log('PASS PROG-062-NEXT-PROG-063-RECORDED');
console.log('PASS PROG-062-NO-UNSUPPORTED-READINESS-CLAIMS');
