'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { sha256Digest } = require('../../../packages/hbce-core/canonical-json.js');

const root = path.resolve(__dirname, '../../..');
const read = (p) => fs.readFileSync(path.join(root, p), 'utf8');
const json = (p) => JSON.parse(read(p));

const publicSurfacePath = 'docs/launch/level1/market/v2-063-public-surface-profile.json';
const linkedinPath = 'docs/launch/level1/market/v2-064-linkedin-baseline-assets.json';
const qualificationPath = 'docs/launch/level1/market/v2-067-qualification-guards.json';
const interlocutorPath = 'docs/launch/level1/market/v2-068-interlocutor-mapping.json';
const guardPath = 'docs/launch/level1/market/v2-069-outreach-claim-guard.json';
const mdPath = 'docs/launch/level1/market/v2-069-outreach-claim-guard.md';

for (const p of [publicSurfacePath, linkedinPath, qualificationPath, interlocutorPath, guardPath, mdPath]) {
  assert.equal(fs.existsSync(path.join(root, p)), true, `${p} must exist`);
}

const publicSurface = json(publicSurfacePath);
const linkedin = json(linkedinPath);
const qualification = json(qualificationPath);
const interlocutor = json(interlocutorPath);
const guard = json(guardPath);
const md = read(mdPath);

assert.equal(guard.proto, 'HBCE-P0-MARKET-V2-069-OUTREACH-CLAIM-GUARD-v1');
assert.equal(guard.kind, 'HBCE_P0_MARKET_V2_069_OUTREACH_CLAIM_GUARD');
assert.equal(guard.issue_id, 'V2-069');
assert.equal(guard.priority, 'P0-MARKET');
assert.equal(guard.depends_on.includes('V2-063'), true);
assert.equal(guard.depends_on.includes('V2-064'), true);
assert.equal(guard.depends_on.includes('V2-067'), true);
assert.equal(guard.depends_on.includes('V2-068'), true);
assert.equal(guard.market_gate, 'G3D_OUTREACH_READY');

assert.equal(guard.source_public_surface_revision_hash, publicSurface.revision_hash);
assert.equal(guard.source_linkedin_assets_revision_hash, linkedin.revision_hash);
assert.equal(guard.source_qualification_guards_revision_hash, qualification.revision_hash);
assert.equal(guard.source_interlocutor_mapping_revision_hash, interlocutor.revision_hash);

const body = { ...guard };
delete body.revision_hash;
assert.equal(guard.revision_hash, sha256Digest(body));

assert.equal(guard.status, 'INITIALIZED_NOT_READY');
assert.equal(guard.readiness_status, 'BLOCKED');
assert.equal(guard.g3d_ready, false);
assert.equal(guard.outreach_claim_guard_initialized, true);
assert.equal(guard.internal_draft_preparation_allowed, true);
assert.equal(guard.external_contact_permitted, false);
assert.equal(guard.outreach_ready_allowed, false);
assert.equal(guard.contacted_allowed, false);

assert.equal(guard.allowed_claim_source.required, true);
assert.equal(Array.isArray(guard.allowed_claim_source.allowed_claim_ids), true);
assert.equal(guard.draft_contract.allowed_claim_ids_used, 'required subset of allowed_claim_source.allowed_claim_ids');
assert.equal(guard.draft_contract.human_approval_required_before_contact, true);
assert.equal(guard.draft_contract.manual_approval_authority, 'Manuel Coletta');
assert.equal(guard.draft_contract.send_operation_in_scope, false);

const rules = new Map(guard.guard_rules.map((r) => [r.guard_id, r.failure_result]));
assert.equal(rules.get('DRAFT_MUST_USE_ALLOWED_CLAIM_IDS'), 'OUTREACH_DRAFT_BLOCKED');
assert.equal(rules.get('NO_PILOT_READY_CLAIM_WHILE_G2_G5_FALSE'), 'PUBLISH_DENIED');
assert.equal(rules.get('NO_CUSTOMER_OR_CLIENT_CLAIM_WITHOUT_EVIDENCE'), 'CLAIM_NOT_ALLOWED');
assert.equal(rules.get('NO_OUTREACH_READY_WITHOUT_QUALIFIED_LEAD'), 'PIPELINE_BLOCKED');
assert.equal(rules.get('NO_CONTACT_WITHOUT_HUMAN_APPROVAL'), 'PIPELINE_BLOCKED');
assert.equal(rules.get('NO_PERSONAL_COMMIT_EMAIL_ROUTE'), 'PRIVACY_POLICY_BLOCK');
assert.equal(rules.get('DO_NOT_CONTACT_OVERRIDES_DRAFT'), 'DO_NOT_CONTACT_BLOCK');

const fixtures = new Map(guard.draft_evaluation_fixtures.map((f) => [f.draft_id, f.expected_result]));
assert.equal(fixtures.get('DRAFT-001'), 'OUTREACH_DRAFT_BLOCKED');
assert.equal(fixtures.get('DRAFT-002'), 'OUTREACH_DRAFT_BLOCKED');
assert.equal(fixtures.get('DRAFT-003'), 'PUBLISH_DENIED');
assert.equal(fixtures.get('DRAFT-004'), 'INTERNAL_DRAFT_ONLY_CONTACT_BLOCKED');
assert.equal(fixtures.get('DRAFT-005'), 'PIPELINE_BLOCKED');
assert.equal(fixtures.get('DRAFT-006'), 'PRIVACY_POLICY_BLOCK');

const controls = new Map(guard.t153_t154_controls.map((c) => [c.test_id, c.expected_result]));
assert.equal(controls.get('T153'), 'PIPELINE_BLOCKED');
assert.equal(controls.get('T154'), 'OUTREACH_DRAFT_BLOCKED');

assert.equal(guard.non_claims.g3d_outreach_ready, false);
assert.equal(guard.non_claims.qualified_lead, false);
assert.equal(guard.non_claims.outreach_ready, false);
assert.equal(guard.non_claims.contacted, false);
assert.equal(guard.non_claims.customer_or_client_existence, false);
assert.equal(guard.non_claims.pilot_readiness, false);

assert.match(md, /allowed claim identifiers/);
assert.match(md, /cannot send messages/);
assert.match(md, /DRAFT_MUST_USE_ALLOWED_CLAIM_IDS/);
assert.match(md, /NO_CONTACT_WITHOUT_HUMAN_APPROVAL/);

console.log('PASS PROG-027-V2-069-DOCS-EXIST');
console.log('PASS PROG-027-V2-069-HASH-STABLE');
console.log('PASS PROG-027-V2-069-DEPENDS-ON-V2-063-V2-064-V2-067-V2-068');
console.log('PASS PROG-027-V2-069-ALLOWED-CLAIM-SOURCE-RECORDED');
console.log('PASS PROG-027-V2-069-DRAFT-CONTRACT-RECORDED');
console.log('PASS PROG-027-V2-069-HUMAN-APPROVAL-REQUIRED');
console.log('PASS PROG-027-V2-069-UNSUPPORTED-CLAIMS-BLOCKED');
console.log('PASS PROG-027-V2-069-CONTACT-WITHOUT-APPROVAL-BLOCKED');
console.log('PASS PROG-027-V2-069-T153-T154-CONTROLS-RECORDED');
console.log('PASS PROG-027-V2-069-NO-OUTREACH-OR-CONTACT-CLAIM');
