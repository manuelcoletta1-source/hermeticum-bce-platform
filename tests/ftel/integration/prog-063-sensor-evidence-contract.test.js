'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { sha256Digest } = require('../../../packages/hbce-core/canonical-json.js');
const {
  CONTRACT_STATUS,
  SENSOR_SOURCE_MODES,
  REQUIRED_FIELDS,
  VALIDATOR_CODES,
  buildSensorEvidenceContract
} = require('../../../runtime/level3/build-prog-063-sensor-evidence-contract.js');

const root = path.resolve(__dirname, '../../..');
const read = (p) => fs.readFileSync(path.join(root, p), 'utf8');
const json = (p) => JSON.parse(read(p));
const exists = (p) => fs.existsSync(path.join(root, p));

const docPath = 'docs/launch/level3/v0-1-c1/prog-063-sensor-evidence-contract.json';
const mdPath = 'docs/launch/level3/v0-1-c1/prog-063-sensor-evidence-contract.md';
const runtimePath = 'runtime/level3/build-prog-063-sensor-evidence-contract.js';
const sourcePath = 'docs/launch/level3/v0-1-c1/prog-062-controller-receipt-contract.json';

for (const p of [docPath, mdPath, runtimePath, sourcePath]) assert.equal(exists(p), true, `${p} must exist`);

const doc = json(docPath);
const md = read(mdPath);
const source = json(sourcePath);

assert.equal(doc.proto, 'HBCE-L3-PROG-063-SENSOR-EVIDENCE-CONTRACT-v1');
assert.equal(doc.kind, 'HBCE_LEVEL3_SENSOR_EVIDENCE_CONTRACT');
assert.equal(doc.issue_id, 'PROG-063');
assert.equal(doc.priority, 'LEVEL3-SENSOR-EVIDENCE-CONTRACT');
assert.equal(doc.source_controller_receipt_contract_revision_hash, source.revision_hash);
assert.equal(doc.source_controller_receipt_contract_revision_hash_valid, true);

const regenerated = buildSensorEvidenceContract({ rootDir: root, repositoryCommit: doc.repository_baseline_commit });
assert.deepEqual(regenerated, doc);

const body = { ...doc };
delete body.revision_hash;
assert.equal(doc.revision_hash, sha256Digest(body));

assert.equal(doc.contract_status, CONTRACT_STATUS);
assert.deepEqual(doc.sensor_source_modes, SENSOR_SOURCE_MODES);
assert.deepEqual(doc.required_fields, REQUIRED_FIELDS);
assert.deepEqual(doc.validator_codes, VALIDATOR_CODES);

assert.equal(doc.inherited_controller_boundary.receipt_is_not_effect_proof, true);
assert.equal(doc.inherited_controller_boundary.receipt_is_not_live_control_authorization, true);
assert.equal(doc.inherited_controller_boundary.live_effect_claim_allowed_by_source, false);
assert.equal(doc.inherited_controller_boundary.physical_actuation_permitted_by_source, false);

assert.equal(doc.sensor_evidence_contract.sensor_evidence_is_observation_not_effect_proof, true);
assert.equal(doc.sensor_evidence_contract.sensor_evidence_requires_controller_receipt_ref, true);
assert.equal(doc.sensor_evidence_contract.sensor_evidence_requires_action_and_safety_refs, true);
assert.equal(doc.sensor_evidence_contract.observation_window_required, true);
assert.equal(doc.sensor_evidence_contract.measurement_digest_required, true);
assert.equal(doc.sensor_evidence_contract.provenance_required, true);
assert.equal(doc.sensor_evidence_contract.calibration_ref_required, true);
assert.equal(doc.sensor_evidence_contract.limitations_required, true);
assert.equal(doc.sensor_evidence_contract.live_sensor_requires_new_evidence, true);
assert.equal(doc.sensor_evidence_contract.missing_sensor_evidence_blocks_effect_claim, true);

assert.equal(doc.allowed_without_new_evidence.simulated_sensor_evidence, true);
assert.equal(doc.allowed_without_new_evidence.recorded_sensor_evidence, true);
assert.equal(doc.allowed_without_new_evidence.observer_signed_sensor_evidence, true);
assert.equal(doc.allowed_without_new_evidence.controller_reported_sensor_evidence, true);
assert.equal(doc.allowed_without_new_evidence.live_sensor_effect_proof, false);
assert.equal(doc.allowed_without_new_evidence.standalone_physical_effect_proof, false);
assert.equal(doc.allowed_without_new_evidence.physical_deployment_proof, false);

assert.equal(doc.minimal_valid_sensor_evidence_example.sensor_source_mode, 'SIMULATED_SENSOR');
assert.equal(doc.minimal_valid_sensor_evidence_example.effect_assessment_boundary.proves_live_physical_effect, false);
assert.equal(doc.minimal_valid_sensor_evidence_example.effect_assessment_boundary.requires_separate_effect_evaluation, true);
assert.ok(doc.minimal_valid_sensor_evidence_example.limitations.includes('not_live_physical_effect'));

const vectorIds = new Set(doc.validation_vectors.map((v) => v.id));
assert.equal(vectorIds.has('L3-SE-T01'), true);
assert.equal(vectorIds.has('L3-SE-T02'), true);
assert.equal(vectorIds.has('L3-SE-T03'), true);
assert.equal(vectorIds.has('L3-SE-T04'), true);
assert.equal(vectorIds.has('L3-SE-POS-001'), true);

assert.equal(doc.readiness_state.sensor_evidence_contract_created, true);
assert.equal(doc.readiness_state.sensor_evidence_contract_evaluated, true);
assert.equal(doc.readiness_state.sensor_evidence_representable, true);
assert.equal(doc.readiness_state.sensor_evidence_is_effect_proof, false);
assert.equal(doc.readiness_state.live_sensor_effect_proof_ready, false);
assert.equal(doc.readiness_state.live_effect_claim_allowed, false);
assert.equal(doc.readiness_state.physical_actuation_permitted, false);
assert.equal(doc.readiness_state.pilot_ready, false);
assert.equal(doc.readiness_state.physical_deployment_ready, false);
assert.equal(doc.readiness_state.production_ready, false);

assert.equal(doc.next_required_program, 'PROG-064-HBCE-LEVEL3-PHYSICAL-EFFECT-EVALUATION-GATE');

assert.equal(doc.non_claims.sensor_evidence_as_physical_effect_proof, false);
assert.equal(doc.non_claims.live_sensor_effect_proof_ready, false);
assert.equal(doc.non_claims.live_effect_claim_allowed, false);
assert.equal(doc.non_claims.physical_actuation_permitted, false);
assert.equal(doc.non_claims.level3_pilot_ready, false);
assert.equal(doc.non_claims.level3_physical_deployment_ready, false);
assert.equal(doc.non_claims.production_ready, false);
assert.equal(doc.non_claims.automatic_pilot_promotion, false);

assert.match(md, /LEVEL3_SENSOR_EVIDENCE_CONTRACT_CREATED_NOT_PHYSICAL_EFFECT_PROOF/);
assert.match(md, /does not prove live physical effect by itself/);
assert.match(md, /Sensor evidence is observation evidence, not standalone physical effect proof/);
assert.match(md, /PROG-064-HBCE-LEVEL3-PHYSICAL-EFFECT-EVALUATION-GATE/);

console.log('PASS PROG-063-SENSOR-EVIDENCE-DOCS-EXIST');
console.log('PASS PROG-063-SENSOR-EVIDENCE-HASH-STABLE');
console.log('PASS PROG-063-BUILDER-STABLE');
console.log('PASS PROG-063-SOURCE-PROG-062-INTEGRITY-VALID');
console.log('PASS PROG-063-SENSOR-EVIDENCE-IS-OBSERVATION-NOT-EFFECT-PROOF');
console.log('PASS PROG-063-LIVE-SENSOR-REQUIRES-NEW-EVIDENCE');
console.log('PASS PROG-063-MISSING-SENSOR-BLOCKS-EFFECT-CLAIM');
console.log('PASS PROG-063-NO-LIVE-EFFECT-CLAIM');
console.log('PASS PROG-063-NEXT-PROG-064-RECORDED');
console.log('PASS PROG-063-NO-UNSUPPORTED-READINESS-CLAIMS');
