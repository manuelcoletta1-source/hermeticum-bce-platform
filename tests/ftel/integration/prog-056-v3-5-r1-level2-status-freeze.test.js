'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { sha256Digest } = require('../../../packages/hbce-core/canonical-json.js');
const {
  FREEZE_STATUS,
  deriveFreeze,
  buildStatusFreeze
} = require('../../../runtime/b2g/build-v3-5-r1-level2-status-freeze.js');

const root = path.resolve(__dirname, '../../..');
const read = (p) => fs.readFileSync(path.join(root, p), 'utf8');
const json = (p) => JSON.parse(read(p));
const exists = (p) => fs.existsSync(path.join(root, p));

const docPath = 'docs/launch/level2/v3-5-r1/v3-5-r1-level2-status-freeze.json';
const mdPath = 'docs/launch/level2/v3-5-r1/v3-5-r1-level2-status-freeze.md';
const runtimePath = 'runtime/b2g/build-v3-5-r1-level2-status-freeze.js';
const sourcePath = 'docs/launch/level2/v3-5-r1/v3-5-r1-level2-pilot-readiness-gate.json';

for (const p of [docPath, mdPath, runtimePath, sourcePath]) assert.equal(exists(p), true, `${p} must exist`);

const doc = json(docPath);
const md = read(mdPath);
const source = json(sourcePath);

assert.equal(doc.proto, 'HBCE-B2G-L2-JC2-V3-5-R1-LEVEL2-STATUS-FREEZE-v1');
assert.equal(doc.kind, 'HBCE_B2G_LEVEL2_JOKER_C2_V3_5_R1_LEVEL2_STATUS_FREEZE');
assert.equal(doc.issue_id, 'PROG-056');
assert.equal(doc.priority, 'V3.5-R1-LEVEL2-STATUS-FREEZE');
assert.equal(doc.source_level2_pilot_readiness_gate_revision_hash, source.revision_hash);
assert.equal(doc.source_level2_pilot_readiness_gate_revision_hash_valid, true);

const regenerated = buildStatusFreeze({ rootDir: root, repositoryCommit: doc.repository_baseline_commit });
assert.deepEqual(regenerated, doc);

const body = { ...doc };
delete body.revision_hash;
assert.equal(doc.revision_hash, sha256Digest(body));

const derived = deriveFreeze(source);
assert.deepEqual(derived, doc.freeze);

assert.equal(doc.freeze.freeze_status, FREEZE_STATUS);
assert.equal(doc.freeze.source_gate_result, 'LEVEL2_PILOT_READINESS_GATE_BLOCKED');
assert.equal(doc.freeze.source_gate_blocked, true);
assert.equal(doc.freeze.source_revision_hash_valid, true);
assert.equal(doc.freeze.source_issue_is_prog_055, true);
assert.equal(doc.freeze.closure.external_validation_complete, false);
assert.equal(doc.freeze.closure.b2g_candidate_ready, false);
assert.equal(doc.freeze.closure.public_sector_production_ready, false);
assert.equal(doc.freeze.closure.pilot_authorized, false);

assert.ok(doc.freeze.blocking_reasons_preserved.includes('PILOT_AUTHORIZATION_PENDING_PREREQUISITES'));
assert.ok(doc.freeze.blocking_reasons_preserved.includes('PILOT_AUTHORIZATION_NOT_PERMITTED'));
assert.ok(doc.freeze.blocking_reasons_preserved.includes('PILOT_PREREQUISITES_NOT_SATISFIED'));
assert.ok(doc.freeze.blocking_reasons_preserved.includes('EXTERNAL_VALIDATION_NOT_COMPLETE'));
assert.ok(doc.freeze.blocking_reasons_preserved.includes('B2G_CANDIDATE_NOT_READY'));
assert.ok(doc.freeze.blocking_reasons_preserved.includes('PILOT_NOT_AUTHORIZED'));

assert.equal(doc.frozen_scope.track, 'JOKER_C2_B2G_LEVEL2');
assert.equal(doc.frozen_scope.baseline, 'V3.5-R1');
assert.equal(doc.frozen_scope.frozen_status, FREEZE_STATUS);
assert.equal(doc.frozen_scope.frozen_reason, 'pilot_readiness_gate_blocked');
assert.ok(doc.frozen_scope.scope_includes.includes('pilot_readiness_gate'));

assert.equal(doc.preserved_findings.gate_blocked, true);
assert.equal(doc.preserved_findings.external_validation_not_complete, true);
assert.equal(doc.preserved_findings.b2g_candidate_not_ready, true);
assert.equal(doc.preserved_findings.pilot_not_authorized, true);
assert.equal(doc.preserved_findings.production_not_ready, true);
assert.equal(doc.preserved_findings.public_accreditation_not_claimed, true);
assert.equal(doc.preserved_findings.procurement_eligibility_not_claimed, true);
assert.equal(doc.preserved_findings.legal_validity_not_claimed, true);
assert.equal(doc.preserved_findings.government_endorsement_not_claimed, true);

assert.equal(doc.freeze_semantics.status_freeze_is_not_completion, true);
assert.equal(doc.freeze_semantics.status_freeze_is_not_failure_of_research_track, true);
assert.equal(doc.freeze_semantics.status_freeze_is_not_b2g_candidate_readiness, true);
assert.equal(doc.freeze_semantics.status_freeze_is_not_pilot_authorization, true);
assert.equal(doc.freeze_semantics.status_freeze_is_not_production_readiness, true);
assert.equal(doc.freeze_semantics.status_freeze_prevents_untracked_promotion, true);
assert.equal(doc.freeze_semantics.reopening_requires_explicit_new_program_and_evidence_trigger, true);

assert.equal(doc.readiness_state.level2_status_freeze_created, true);
assert.equal(doc.readiness_state.level2_status_freeze_evaluated, true);
assert.equal(doc.readiness_state.level2_frozen_status, FREEZE_STATUS);
assert.equal(doc.readiness_state.level2_pilot_readiness_gate_blocked, true);
assert.equal(doc.readiness_state.external_validation_complete, false);
assert.equal(doc.readiness_state.b2g_candidate_ready, false);
assert.equal(doc.readiness_state.public_sector_production_ready, false);
assert.equal(doc.readiness_state.pilot_authorized, false);
assert.equal(doc.readiness_state.level2_track_closed_for_untracked_promotion, true);

assert.equal(doc.terminal_or_reopen_rule.terminal_for_current_v3_5_r1_sequence, true);
assert.equal(doc.terminal_or_reopen_rule.may_reopen_without_new_evidence, false);
assert.equal(doc.terminal_or_reopen_rule.may_reopen_without_explicit_program, false);
assert.equal(doc.terminal_or_reopen_rule.required_reopen_trigger, 'NEW_EVIDENCE_AND_EXPLICIT_PROGRAM_TRIGGER');
assert.equal(doc.terminal_or_reopen_rule.next_program, 'NO_NEW_LEVEL2_PROGRAM_WITHOUT_EVIDENCE_TRIGGER');

assert.equal(doc.non_claims.production_ready, false);
assert.equal(doc.non_claims.b2g_candidate_ready, false);
assert.equal(doc.non_claims.public_accreditation, false);
assert.equal(doc.non_claims.procurement_eligibility, false);
assert.equal(doc.non_claims.legal_validity, false);
assert.equal(doc.non_claims.government_endorsement, false);
assert.equal(doc.non_claims.external_validation_complete, false);
assert.equal(doc.non_claims.pilot_authorized, false);
assert.equal(doc.non_claims.level2_runtime_complete, false);
assert.equal(doc.non_claims.automatic_pilot_promotion, false);

assert.match(md, /LEVEL2_STATUS_FROZEN_BLOCKED_NOT_PILOT_READY/);
assert.match(md, /source pilot readiness gate remains BLOCKED/i);
assert.match(md, /not pilot authorization/i);
assert.match(md, /NO_NEW_LEVEL2_PROGRAM_WITHOUT_EVIDENCE_TRIGGER/);

console.log('PASS PROG-056-V3-5-R1-LEVEL2-STATUS-FREEZE-DOCS-EXIST');
console.log('PASS PROG-056-V3-5-R1-LEVEL2-STATUS-FREEZE-HASH-STABLE');
console.log('PASS PROG-056-V3-5-R1-BUILDER-STABLE');
console.log('PASS PROG-056-V3-5-R1-SOURCE-PILOT-GATE-INTEGRITY-VALID');
console.log('PASS PROG-056-V3-5-R1-FROZEN-BLOCKED-NOT-PILOT-READY');
console.log('PASS PROG-056-V3-5-R1-BLOCKING-REASONS-PRESERVED');
console.log('PASS PROG-056-V3-5-R1-NO-UNTRACKED-PROMOTION');
console.log('PASS PROG-056-V3-5-R1-REOPEN-REQUIRES-EVIDENCE-TRIGGER');
console.log('PASS PROG-056-V3-5-R1-NO-NEXT-LEVEL2-PROGRAM-WITHOUT-EVIDENCE');
console.log('PASS PROG-056-V3-5-R1-NO-B2G-CANDIDATE-OR-PRODUCTION-CLAIM');
