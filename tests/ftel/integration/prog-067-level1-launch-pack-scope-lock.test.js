'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { sha256Digest } = require('../../../packages/hbce-core/canonical-json.js');
const {
  SCOPE_LOCK_STATUS,
  SOURCE_REF,
  LOCKED_IN_SCOPE,
  LOCKED_OUT_OF_SCOPE,
  LAUNCH_PACK_ARTIFACTS_REQUIRED,
  buildLevel1LaunchPackScopeLock
} = require('../../../runtime/level1/build-prog-067-level1-launch-pack-scope-lock.js');

const root = path.resolve(__dirname, '../../..');
const read = (p) => fs.readFileSync(path.join(root, p), 'utf8');
const json = (p) => JSON.parse(read(p));
const exists = (p) => fs.existsSync(path.join(root, p));

const docPath = 'docs/launch/level1/prog-067-level1-launch-pack-scope-lock.json';
const mdPath = 'docs/launch/level1/prog-067-level1-launch-pack-scope-lock.md';
const runtimePath = 'runtime/level1/build-prog-067-level1-launch-pack-scope-lock.js';

for (const p of [docPath, mdPath, runtimePath, SOURCE_REF]) assert.equal(exists(p), true, `${p} must exist`);

const doc = json(docPath);
const md = read(mdPath);
const source = json(SOURCE_REF);

assert.equal(doc.proto, 'HBCE-L1-PROG-067-LAUNCH-PACK-SCOPE-LOCK-v1');
assert.equal(doc.kind, 'HBCE_LEVEL1_LAUNCH_PACK_SCOPE_LOCK');
assert.equal(doc.issue_id, 'PROG-067');
assert.equal(doc.priority, 'LEVEL1-LAUNCH-PACK-SCOPE-LOCK');
assert.equal(doc.scope_lock_status, SCOPE_LOCK_STATUS);
assert.equal(doc.source_level1_refocus_gate_revision_hash, source.revision_hash);
assert.equal(doc.source_level1_refocus_gate_revision_hash_valid, true);

const regenerated = buildLevel1LaunchPackScopeLock({ rootDir: root, repositoryCommit: doc.repository_baseline_commit });
assert.deepEqual(regenerated, doc);

const body = { ...doc };
delete body.revision_hash;
assert.equal(doc.revision_hash, sha256Digest(body));

assert.equal(doc.inherited_refocus_boundary.gate_result, 'LEVEL1_LAUNCH_REFOCUS_GATE_OPEN');
assert.equal(doc.inherited_refocus_boundary.level1_is_primary_execution_track, true);
assert.equal(doc.inherited_refocus_boundary.level2_reopened, false);
assert.equal(doc.inherited_refocus_boundary.level3_promoted_to_pilot_ready, false);
assert.equal(doc.inherited_refocus_boundary.new_scope_expansion_allowed, false);

assert.equal(doc.product_identity_lock.hbce_level1_is_governance_evidence_infrastructure, true);
assert.equal(doc.product_identity_lock.hbce_level1_is_not_an_ai_system, true);
assert.equal(doc.product_identity_lock.ai_models_are_human_interface_layer, true);
assert.equal(doc.product_identity_lock.ai_models_do_not_create_authority, true);
assert.equal(doc.product_identity_lock.human_or_organizational_authority_required, true);

assert.deepEqual(doc.locked_in_scope, LOCKED_IN_SCOPE);
assert.deepEqual(doc.locked_out_of_scope, LOCKED_OUT_OF_SCOPE);
assert.deepEqual(doc.launch_pack_artifacts_required, LAUNCH_PACK_ARTIFACTS_REQUIRED);

assert.equal(doc.launch_pack_scope_statement.primary_launch_object, 'LEVEL1_DECISION_PROOF_PACK');
assert.match(doc.launch_pack_scope_statement.primary_question, /governed digital decision or action/);
assert.equal(doc.launch_pack_scope_statement.launch_target_date, '2027-01-19');
assert.equal(doc.launch_pack_scope_statement.market_posture, 'PRE_LAUNCH_SCOPE_LOCK');
assert.equal(doc.launch_pack_scope_statement.release_posture, 'NOT_RELEASE_CANDIDATE');

assert.equal(doc.gate_rules.scope_expansion_requires_new_program, true);
assert.equal(doc.gate_rules.level2_reopen_requires_new_evidence_and_explicit_program, true);
assert.equal(doc.gate_rules.level3_pilot_promotion_requires_new_positive_gate, true);
assert.equal(doc.gate_rules.legal_or_certification_claim_requires_external_authority, true);
assert.equal(doc.gate_rules.production_claim_requires_release_candidate_gate, true);
assert.equal(doc.gate_rules.client_pack_claim_requires_completed_artifact_pack, true);

assert.equal(doc.readiness_state.level1_scope_lock_created, true);
assert.equal(doc.readiness_state.level1_scope_lock_evaluated, true);
assert.equal(doc.readiness_state.level1_launch_pack_scope_locked, true);
assert.equal(doc.readiness_state.level1_launch_pack_artifacts_complete, false);
assert.equal(doc.readiness_state.decision_proof_demo_path_ready, false);
assert.equal(doc.readiness_state.evidence_chain_manifest_ready, false);
assert.equal(doc.readiness_state.api_surface_summary_ready, false);
assert.equal(doc.readiness_state.client_narrative_ready, false);
assert.equal(doc.readiness_state.release_blocker_register_ready, false);
assert.equal(doc.readiness_state.level1_launch_ready, false);
assert.equal(doc.readiness_state.level1_release_candidate_ready, false);
assert.equal(doc.readiness_state.level1_client_pack_ready, false);
assert.equal(doc.readiness_state.production_ready, false);

assert.equal(doc.next_required_program, 'PROG-068-HBCE-LEVEL1-DECISION-PROOF-DEMO-PATH');

assert.equal(doc.non_claims.level1_launch_ready, false);
assert.equal(doc.non_claims.level1_release_candidate_ready, false);
assert.equal(doc.non_claims.level1_client_pack_ready, false);
assert.equal(doc.non_claims.commercial_acceptance_ready, false);
assert.equal(doc.non_claims.production_ready, false);
assert.equal(doc.non_claims.legal_validity, false);
assert.equal(doc.non_claims.public_accreditation, false);
assert.equal(doc.non_claims.procurement_eligibility, false);
assert.equal(doc.non_claims.level2_pilot_ready, false);
assert.equal(doc.non_claims.level3_pilot_ready, false);
assert.equal(doc.non_claims.physical_effect_proven, false);
assert.equal(doc.non_claims.live_control_ready, false);
assert.equal(doc.non_claims.autonomous_authority, false);

assert.match(md, /LEVEL1_LAUNCH_PACK_SCOPE_LOCKED_NOT_LAUNCH_READY/);
assert.match(md, /HBCE Level 1 is governance and evidence infrastructure/);
assert.match(md, /HBCE Level 1 is not an AI system/);
assert.match(md, /This scope lock does not certify launch readiness/);
assert.match(md, /PROG-068-HBCE-LEVEL1-DECISION-PROOF-DEMO-PATH/);

console.log('PASS PROG-067-LEVEL1-SCOPE-LOCK-DOCS-EXIST');
console.log('PASS PROG-067-LEVEL1-SCOPE-LOCK-HASH-STABLE');
console.log('PASS PROG-067-BUILDER-STABLE');
console.log('PASS PROG-067-SOURCE-PROG-066-INTEGRITY-VALID');
console.log('PASS PROG-067-PRODUCT-IDENTITY-LOCKED');
console.log('PASS PROG-067-IN-SCOPE-LOCKED');
console.log('PASS PROG-067-OUT-OF-SCOPE-LOCKED');
console.log('PASS PROG-067-NOT-LAUNCH-READY');
console.log('PASS PROG-067-NEXT-PROG-068-RECORDED');
console.log('PASS PROG-067-NO-UNSUPPORTED-READINESS-CLAIMS');
