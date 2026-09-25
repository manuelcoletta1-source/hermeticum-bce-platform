'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { sha256Digest } = require('../../../packages/hbce-core/canonical-json.js');

const root = path.resolve(__dirname, '../../..');
const read = (p) => fs.readFileSync(path.join(root, p), 'utf8');
const json = (p) => JSON.parse(read(p));

const registryPath = 'docs/launch/level1/market/v2-066-github-lead-registry.json';
const guardPath = 'docs/launch/level1/market/v2-067-qualification-guards.json';
const mdPath = 'docs/launch/level1/market/v2-067-qualification-guards.md';

assert.equal(fs.existsSync(path.join(root, registryPath)), true);
assert.equal(fs.existsSync(path.join(root, guardPath)), true);
assert.equal(fs.existsSync(path.join(root, mdPath)), true);

const registry = json(registryPath);
const guards = json(guardPath);
const md = read(mdPath);

assert.equal(guards.proto, 'HBCE-P0-MARKET-V2-067-QUALIFICATION-GUARDS-v1');
assert.equal(guards.kind, 'HBCE_P0_MARKET_V2_067_QUALIFICATION_GUARDS');
assert.equal(guards.issue_id, 'V2-067');
assert.equal(guards.priority, 'P0-MARKET');
assert.equal(guards.depends_on.includes('V2-066'), true);
assert.equal(guards.source_github_lead_registry_revision_hash, registry.revision_hash);
assert.equal(guards.market_gate, 'G3C_LEAD_REGISTRY_READY');

const body = { ...guards };
delete body.revision_hash;
assert.equal(guards.revision_hash, sha256Digest(body));

assert.equal(guards.status, 'INITIALIZED_NOT_READY');
assert.equal(guards.readiness_status, 'BLOCKED');
assert.equal(guards.g3c_ready, false);
assert.equal(guards.qualification_guards_initialized, true);
assert.equal(guards.qualified_leads_allowed, false);
assert.equal(guards.outreach_ready_allowed, false);

assert.deepEqual(guards.transition_model.TECHNICALLY_RELEVANT, ['ORG_VERIFIED', 'PARKED', 'CLOSED']);
assert.deepEqual(guards.transition_model.QUALIFIED, ['OUTREACH_READY', 'PARKED', 'CLOSED']);

const req = new Map(guards.guard_requirements.map(g => [g.target_state, g]));
assert.equal(req.has('QUALIFIED'), true);
assert.equal(req.has('OUTREACH_READY'), true);
assert.equal(req.get('QUALIFIED').requires.includes('buyer_problem_evidence'), true);
assert.equal(req.get('OUTREACH_READY').requires.includes('Manuel human approval'), true);
assert.equal(req.get('OUTREACH_READY').requires.includes('target role'), true);

const shortcuts = new Map(guards.forbidden_shortcuts.map(s => [s.shortcut, s.result]));
assert.equal(shortcuts.get('TECHNICALLY_RELEVANT_TO_OUTREACH_READY'), 'PIPELINE_BLOCKED');
assert.equal(shortcuts.get('REPOSITORY_FOUND_TO_ORG_VERIFIED'), 'QUALIFICATION_DENIED');
assert.equal(shortcuts.get('USER_OWNER_TO_ORG_VERIFIED'), 'QUALIFICATION_DENIED');
assert.equal(shortcuts.get('TECHNICAL_SIMILARITY_TO_BUYER_FIT'), 'QUALIFICATION_DENIED');
assert.equal(shortcuts.get('QUALIFIED_WITHOUT_BUYER_PROBLEM_EVIDENCE'), 'QUALIFICATION_DENIED');
assert.equal(shortcuts.get('OUTREACH_READY_WITHOUT_TARGET_ROLE'), 'PIPELINE_BLOCKED');
assert.equal(shortcuts.get('COMMIT_EMAIL_TO_CONTACT_ROUTE'), 'PRIVACY_POLICY_BLOCK');

assert.equal(guards.evaluation_of_existing_registry.length, registry.lead_records.length);
for (const evaluation of guards.evaluation_of_existing_registry) {
  assert.equal(evaluation.qualification_result, 'QUALIFICATION_DENIED');
  assert.equal(evaluation.outreach_result, 'PIPELINE_BLOCKED');
  assert.equal(evaluation.buyer_problem_evidence_present, false);
  assert.equal(evaluation.reason_codes.includes('ORG_NOT_VERIFIED'), true);
  assert.equal(evaluation.reason_codes.includes('ROLE_NOT_IDENTIFIED'), true);
  assert.equal(evaluation.reason_codes.includes('BUYER_PROBLEM_EVIDENCE_MISSING'), true);
  assert.equal(evaluation.reason_codes.includes('HUMAN_APPROVAL_MISSING'), true);
}

const controls = new Map(guards.t146_t150_controls.map(c => [c.test_id, c.expected_result]));
assert.equal(controls.get('T146'), 'QUALIFICATION_DENIED');
assert.equal(controls.get('T147'), 'QUALIFICATION_DENIED');
assert.equal(controls.get('T148'), 'QUALIFICATION_DENIED');
assert.equal(controls.get('T149'), 'PIPELINE_BLOCKED');
assert.equal(controls.get('T150'), 'PRIVACY_POLICY_BLOCK');

assert.equal(guards.non_claims.g3c_lead_registry_ready, false);
assert.equal(guards.non_claims.qualified_lead, false);
assert.equal(guards.non_claims.outreach_ready, false);
assert.equal(guards.non_claims.customer_or_client_existence, false);
assert.equal(guards.non_claims.pilot_readiness, false);

assert.match(md, /shortcut promotion/);
assert.match(md, /No lead in the current registry is qualified/);
assert.match(md, /TECHNICALLY_RELEVANT_TO_OUTREACH_READY/);
assert.match(md, /QUALIFIED_WITHOUT_BUYER_PROBLEM_EVIDENCE/);
assert.match(md, /OUTREACH_WITHOUT_HUMAN_APPROVAL/);

console.log('PASS PROG-025-V2-067-DOCS-EXIST');
console.log('PASS PROG-025-V2-067-HASH-STABLE');
console.log('PASS PROG-025-V2-067-DEPENDS-ON-V2-066');
console.log('PASS PROG-025-V2-067-TRANSITION-MODEL-RECORDED');
console.log('PASS PROG-025-V2-067-QUALIFIED-REQUIRES-BUYER-EVIDENCE');
console.log('PASS PROG-025-V2-067-OUTREACH-REQUIRES-ROLE-AND-APPROVAL');
console.log('PASS PROG-025-V2-067-FORBIDDEN-SHORTCUTS-RECORDED');
console.log('PASS PROG-025-V2-067-REGISTRY-EVALUATION-BLOCKED');
console.log('PASS PROG-025-V2-067-T146-T150-CONTROLS-RECORDED');
console.log('PASS PROG-025-V2-067-NO-QUALIFIED-OR-OUTREACH-CLAIM');
