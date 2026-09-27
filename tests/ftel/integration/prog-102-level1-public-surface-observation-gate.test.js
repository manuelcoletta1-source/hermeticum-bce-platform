'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { sha256Digest } = require('../../../packages/hbce-core/canonical-json.js');
const {
  STATUS,
  SOURCE_REF,
  buildObservationGatePayload,
  buildLevel1PublicSurfaceObservationGate
} = require('../../../runtime/level1/build-prog-102-level1-public-surface-observation-gate.js');

const root = path.resolve(__dirname, '../../..');
const read = (p) => fs.readFileSync(path.join(root, p), 'utf8');
const json = (p) => JSON.parse(read(p));
const exists = (p) => fs.existsSync(path.join(root, p));

const docPath = 'docs/launch/level1/prog-102-level1-public-surface-observation-gate.json';
const mdPath = 'docs/launch/level1/prog-102-level1-public-surface-observation-gate.md';
const runtimePath = 'runtime/level1/build-prog-102-level1-public-surface-observation-gate.js';

for (const p of [docPath, mdPath, runtimePath, SOURCE_REF]) assert.equal(exists(p), true, `${p} must exist`);

const doc = json(docPath);
const md = read(mdPath);
const source = json(SOURCE_REF);

assert.equal(doc.proto, 'HBCE-L1-PROG-102-PUBLIC-SURFACE-OBSERVATION-GATE-v1');
assert.equal(doc.kind, 'HBCE_LEVEL1_PUBLIC_SURFACE_OBSERVATION_GATE');
assert.equal(doc.issue_id, 'PROG-102');
assert.equal(doc.level1_public_surface_observation_gate_status, STATUS);
assert.equal(doc.source_public_surface_observation_record_revision_hash, source.revision_hash);
assert.equal(doc.source_public_surface_observation_record_revision_hash_valid, true);

const regenerated = buildLevel1PublicSurfaceObservationGate({ rootDir: root, repositoryCommit: doc.repository_baseline_commit });
assert.deepEqual(regenerated, doc);

const body = { ...doc };
delete body.revision_hash;
assert.equal(doc.revision_hash, sha256Digest(body));

assert.equal(doc.inherited_public_surface_observation_record.observation_record_status, 'LEVEL1_PUBLIC_SURFACE_OBSERVATION_RECORD_DEFINED_NOT_OBSERVED');
assert.equal(doc.inherited_public_surface_observation_record.public_surface_observation_record_ready, true);
assert.equal(doc.inherited_public_surface_observation_record.public_surface_ready, true);
assert.equal(doc.inherited_public_surface_observation_record.publication_authorized, true);
assert.equal(doc.inherited_public_surface_observation_record.publication_authorization_scope, 'controlled_public_information_surface_only');
assert.equal(doc.inherited_public_surface_observation_record.prior_public_surface_observed, false);
assert.equal(doc.inherited_public_surface_observation_record.prior_public_surface_observation_ready, false);

const expectedPayload = buildObservationGatePayload(source);
const gate = doc.public_surface_observation_gate;

assert.equal(gate.public_surface_observation_gate_payload_digest, sha256Digest(expectedPayload));
assert.equal(gate.public_surface_observation_gate_id, 'PUBLIC-SURFACE-OBSERVATION-GATE::HBCE-L1-DECISION-PROOF-0001');
assert.equal(gate.source_public_surface_observation_record_ref, SOURCE_REF);
assert.equal(gate.source_public_surface_observation_record_digest, source.public_surface_observation_record.public_surface_observation_record_payload_digest);
assert.equal(gate.gate_scope, 'LEVEL1_DECISION_PROOF_PUBLIC_SURFACE_CONTROLLED_INFORMATION_ONLY');
assert.equal(gate.gate_status, 'BLOCKED_MISSING_PUBLIC_OBSERVATION_INPUTS');
assert.equal(gate.gate_result, 'PUBLIC_SURFACE_OBSERVATION_NOT_READY');
assert.equal(gate.all_gate_criteria_passed, false);
assert.equal(gate.public_surface_observation_gate_evaluated, true);
assert.equal(gate.public_surface_observation_gate_passed, false);
assert.equal(gate.public_surface_observed, false);
assert.equal(gate.public_surface_observation_ready, false);

for (const key of [
  'public_observation_inputs_present',
  'all_targets_have_public_url',
  'all_targets_have_observer_ref',
  'all_targets_have_observed_content_digest',
  'all_targets_scope_matches_manifest',
  'all_targets_non_claims_present',
  'all_targets_evidence_references_present'
]) {
  assert.equal(gate.gate_criteria[key], false, `${key} must block`);
  assert.equal(gate.blocking_criteria.includes(key), true, `${key} must be blocking`);
}

assert.equal(gate.gate_criteria.source_public_surface_observation_record_hash_valid, true);
assert.equal(gate.gate_criteria.source_public_surface_observation_record_ready, true);
assert.equal(gate.gate_criteria.source_public_surface_release_manifest_ready, true);
assert.equal(gate.gate_criteria.source_public_surface_ready, true);
assert.equal(gate.gate_criteria.source_publication_authorized, true);
assert.equal(gate.gate_criteria.source_publication_authorization_scope_limited, true);
assert.equal(gate.gate_criteria.all_release_surfaces_have_observation_targets, true);
assert.equal(gate.gate_criteria.all_forbidden_claims_absent_from_record, true);
assert.equal(gate.gate_criteria.external_customer_readiness_excluded, true);
assert.equal(gate.gate_criteria.banking_pack_readiness_excluded, true);
assert.equal(gate.gate_criteria.launch_readiness_excluded, true);
assert.equal(gate.gate_criteria.production_readiness_excluded, true);
assert.equal(gate.gate_criteria.ai_authority_excluded, true);

assert.deepEqual(gate.observation_inputs_required, [
  'public_url',
  'observed_at',
  'observer_ref',
  'observation_method',
  'observed_content_digest',
  'observed_scope_match_result',
  'observed_non_claims_presence_result',
  'observed_evidence_reference_presence_result'
]);
assert.equal(gate.observation_inputs_present, false);
assert.equal(gate.observation_targets_evaluated.length, 4);

for (const target of gate.observation_targets_evaluated) {
  assert.equal(target.observation_status, 'NOT_OBSERVED');
  assert.equal(target.public_url_present, false);
  assert.equal(target.observer_ref_present, false);
  assert.equal(target.observed_content_digest_present, false);
  assert.equal(target.observed_scope_matches_manifest, false);
  assert.equal(target.observed_non_claims_present, false);
  assert.equal(target.observed_evidence_references_present, false);
  assert.equal(target.observation_ready, false);
}

assert.equal(gate.approved_public_surface_claims_after_gate.public_surface_ready_controlled_information_only, true);
assert.equal(gate.approved_public_surface_claims_after_gate.publication_authorized_for_controlled_public_information_surface, true);
assert.equal(gate.approved_public_surface_claims_after_gate.public_surface_observation_record_defined, true);
assert.equal(gate.approved_public_surface_claims_after_gate.public_surface_observation_gate_evaluated, true);
assert.equal(gate.approved_public_surface_claims_after_gate.public_surface_observed, false);
assert.equal(gate.approved_public_surface_claims_after_gate.public_surface_observation_ready, false);

assert.equal(gate.blocked_claims_after_gate.public_surface_observed, true);
assert.equal(gate.blocked_claims_after_gate.public_surface_observation_ready, true);
assert.equal(gate.blocked_claims_after_gate.external_customer_delivery_ready, true);
assert.equal(gate.blocked_claims_after_gate.banking_pack_ready, true);
assert.equal(gate.blocked_claims_after_gate.level1_launch_ready, true);
assert.equal(gate.blocked_claims_after_gate.production_ready, true);
assert.equal(gate.blocked_claims_after_gate.legal_validity, true);
assert.equal(gate.blocked_claims_after_gate.security_certification, true);
assert.equal(gate.blocked_claims_after_gate.ai_authority, true);

for (const control of [
  'block_until_public_url_present',
  'block_until_observer_ref_present',
  'block_until_observed_content_digest_present',
  'block_until_scope_match_true',
  'block_until_non_claims_present_true',
  'block_until_evidence_references_present_true',
  'do_not_infer_public_observation_from_release_manifest',
  'do_not_infer_public_observation_from_observation_record',
  'do_not_claim_external_customer_delivery_readiness',
  'do_not_claim_banking_pack_readiness',
  'do_not_claim_level1_launch_readiness',
  'do_not_claim_production_readiness',
  'do_not_claim_legal_validity',
  'do_not_claim_security_certification',
  'do_not_authorize_ai_authority',
  'fail_closed_on_missing_observation_input'
]) {
  assert.equal(gate.observation_gate_controls.includes(control), true, `${control} must be present`);
}

assert.equal(gate.observation_gate_boundary.controlled_information_surface_only, true);
assert.equal(gate.observation_gate_boundary.observation_gate_only, true);
assert.equal(gate.observation_gate_boundary.no_public_observation_recorded, true);
assert.equal(gate.observation_gate_boundary.source_observation_record_required, true);
assert.equal(gate.observation_gate_boundary.no_customer_data, true);
assert.equal(gate.observation_gate_boundary.no_live_system_control, true);
assert.equal(gate.observation_gate_boundary.no_production_integration, true);
assert.equal(gate.observation_gate_boundary.no_legal_validity_claim, true);
assert.equal(gate.observation_gate_boundary.no_security_certification_claim, true);
assert.equal(gate.observation_gate_boundary.no_ai_authority_claim, true);
assert.equal(gate.observation_gate_boundary.no_customer_logo_without_authorization, true);

assert.equal(gate.source_public_surface_observation_record_ready, true);
assert.equal(gate.source_public_surface_ready, true);
assert.equal(gate.source_publication_authorized, true);
assert.equal(gate.source_publication_authorization_scope_limited, true);
assert.equal(gate.public_surface_ready, true);
assert.equal(gate.publication_authorized, true);
assert.equal(gate.publication_authorization_scope_limited, true);
assert.equal(gate.external_customer_ready, false);
assert.equal(gate.banking_pack_ready, false);
assert.equal(gate.level1_launch_ready, false);
assert.equal(gate.production_ready, false);
assert.equal(gate.ai_observation_gate_authority_allowed, false);

assert.equal(gate.observation_gate_checklist.source_public_surface_observation_record_hash_valid, true);
assert.equal(gate.observation_gate_checklist.source_public_surface_observation_record_ready, true);
assert.equal(gate.observation_gate_checklist.source_public_surface_ready, true);
assert.equal(gate.observation_gate_checklist.source_publication_authorized, true);
assert.equal(gate.observation_gate_checklist.source_publication_authorization_scope_limited, true);
assert.equal(gate.observation_gate_checklist.observation_gate_evaluated, true);
assert.equal(gate.observation_gate_checklist.observation_gate_blocked_missing_inputs, true);
assert.equal(gate.observation_gate_checklist.public_observation_inputs_present, false);
assert.equal(gate.observation_gate_checklist.blocking_criteria_present, true);
assert.equal(gate.observation_gate_checklist.public_surface_observed, false);
assert.equal(gate.observation_gate_checklist.public_surface_observation_ready, false);
assert.equal(gate.observation_gate_checklist.public_observation_ready, false);
assert.equal(gate.observation_gate_checklist.external_customer_readiness_excluded, true);
assert.equal(gate.observation_gate_checklist.banking_pack_readiness_excluded, true);
assert.equal(gate.observation_gate_checklist.launch_readiness_excluded, true);
assert.equal(gate.observation_gate_checklist.production_readiness_excluded, true);
assert.equal(gate.observation_gate_checklist.ai_authority_absence_confirmed, true);

assert.equal(gate.public_surface_observation_gate_defined, true);
assert.equal(gate.public_surface_observation_gate_is_blocked_missing_inputs, true);
assert.equal(gate.public_surface_observation_gate_is_not_observation_evidence, true);
assert.equal(gate.public_surface_observation_gate_is_not_public_observation_ready, true);
assert.equal(gate.public_surface_observation_gate_is_not_external_customer_readiness, true);
assert.equal(gate.public_surface_observation_gate_is_not_banking_pack_readiness, true);
assert.equal(gate.public_surface_observation_gate_is_not_launch_readiness, true);
assert.equal(gate.public_surface_observation_gate_is_not_production_readiness, true);
assert.equal(gate.public_surface_observation_gate_is_not_legal_validity, true);
assert.equal(gate.public_surface_observation_gate_is_not_security_certification, true);
assert.equal(gate.public_surface_observation_gate_does_not_authorize_ai_authority, true);

for (const code of [
  'PUBLIC_SURFACE_OBSERVATION_GATE_MISSING',
  'SOURCE_PUBLIC_SURFACE_OBSERVATION_RECORD_HASH_INVALID',
  'PUBLIC_SURFACE_OBSERVATION_RECORD_NOT_READY',
  'PUBLIC_URL_MISSING',
  'OBSERVER_REF_MISSING',
  'OBSERVED_CONTENT_DIGEST_MISSING',
  'OBSERVED_SCOPE_MATCH_MISSING',
  'OBSERVED_NON_CLAIMS_PRESENCE_MISSING',
  'OBSERVED_EVIDENCE_REFERENCES_MISSING',
  'PUBLIC_OBSERVATION_GATE_BLOCKED_MISSING_INPUTS',
  'UNSUPPORTED_PUBLIC_OBSERVATION_READY_CLAIM',
  'UNSUPPORTED_EXTERNAL_CUSTOMER_READINESS_CLAIM',
  'UNSUPPORTED_BANKING_READINESS_CLAIM',
  'UNSUPPORTED_LAUNCH_READINESS_CLAIM',
  'UNSUPPORTED_PRODUCTION_READINESS_CLAIM',
  'AI_OBSERVATION_GATE_AUTHORITY_CLAIM_BLOCKED'
]) {
  assert.equal(doc.fail_closed_codes.includes(code), true, `${code} must be present`);
}

assert.equal(doc.readiness_state.public_surface_observation_gate_defined, true);
assert.equal(doc.readiness_state.public_surface_observation_gate_evaluated, true);
assert.equal(doc.readiness_state.public_surface_observation_gate_passed, false);
assert.equal(doc.readiness_state.source_public_surface_observation_record_bound, true);
assert.equal(doc.readiness_state.public_surface_observation_record_ready, true);
assert.equal(doc.readiness_state.public_surface_ready, true);
assert.equal(doc.readiness_state.publication_authorized, true);
assert.equal(doc.readiness_state.publication_authorization_scope, 'controlled_public_information_surface_only');
assert.equal(doc.readiness_state.publication_authorization_scope_limited, true);
assert.equal(doc.readiness_state.observation_gate_blocked_missing_inputs, true);
assert.equal(doc.readiness_state.public_observation_inputs_present, false);
assert.equal(doc.readiness_state.public_surface_observed, false);
assert.equal(doc.readiness_state.public_surface_observation_ready, false);
assert.equal(doc.readiness_state.external_customer_ready, false);
assert.equal(doc.readiness_state.banking_pack_ready, false);
assert.equal(doc.readiness_state.level1_launch_ready, false);
assert.equal(doc.readiness_state.production_ready, false);

assert.equal(doc.next_required_program, 'PROG-103-HBCE-LEVEL1-PUBLIC-SURFACE-OBSERVATION-INPUT-PACK');

assert.equal(doc.non_claims.legal_validity, false);
assert.equal(doc.non_claims.public_accreditation, false);
assert.equal(doc.non_claims.procurement_eligibility, false);
assert.equal(doc.non_claims.external_effect_proven, false);
assert.equal(doc.non_claims.business_success, false);
assert.equal(doc.non_claims.ai_authority, false);
assert.equal(doc.non_claims.autonomous_authority, false);
assert.equal(doc.non_claims.public_surface_observed, false);
assert.equal(doc.non_claims.public_surface_observation_ready, false);
assert.equal(doc.non_claims.external_customer_ready, false);
assert.equal(doc.non_claims.banking_pack_ready, false);
assert.equal(doc.non_claims.level1_launch_ready, false);
assert.equal(doc.non_claims.production_ready, false);

assert.match(md, /LEVEL1_PUBLIC_SURFACE_OBSERVATION_GATE_BLOCKED_MISSING_OBSERVATION_INPUTS/);
assert.match(md, /The observation gate is blocked because observation inputs are missing/);
assert.match(md, /The public surface is not observed/);
assert.match(md, /The public surface observation is not ready/);
assert.match(md, /public URL/);
assert.match(md, /observed content digest/);
assert.match(md, /The observation gate must not infer public observation from the release manifest/);
assert.match(md, /PROG-103-HBCE-LEVEL1-PUBLIC-SURFACE-OBSERVATION-INPUT-PACK/);

console.log('PASS PROG-102-PUBLIC-SURFACE-OBSERVATION-GATE-DOCS-EXIST');
console.log('PASS PROG-102-PUBLIC-SURFACE-OBSERVATION-GATE-HASH-STABLE');
console.log('PASS PROG-102-BUILDER-STABLE');
console.log('PASS PROG-102-SOURCE-PROG-101-INTEGRITY-VALID');
console.log('PASS PROG-102-OBSERVATION-GATE-EVALUATED');
console.log('PASS PROG-102-OBSERVATION-GATE-BLOCKED-MISSING-INPUTS');
console.log('PASS PROG-102-PUBLIC-OBSERVATION-NOT-READY');
console.log('PASS PROG-102-BLOCKING-CRITERIA-RECORDED');
console.log('PASS PROG-102-AI-OBSERVATION-GATE-AUTHORITY-DISALLOWED');
console.log('PASS PROG-102-NEXT-PROG-103-RECORDED');
console.log('PASS PROG-102-NO-UNSUPPORTED-READINESS-CLAIMS');
