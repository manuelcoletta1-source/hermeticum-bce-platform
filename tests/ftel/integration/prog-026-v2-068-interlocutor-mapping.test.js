'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { sha256Digest } = require('../../../packages/hbce-core/canonical-json.js');

const root = path.resolve(__dirname, '../../..');
const read = (p) => fs.readFileSync(path.join(root, p), 'utf8');
const json = (p) => JSON.parse(read(p));

const registryPath = 'docs/launch/level1/market/v2-066-github-lead-registry.json';
const qualificationPath = 'docs/launch/level1/market/v2-067-qualification-guards.json';
const mappingPath = 'docs/launch/level1/market/v2-068-interlocutor-mapping.json';
const mdPath = 'docs/launch/level1/market/v2-068-interlocutor-mapping.md';

for (const p of [registryPath, qualificationPath, mappingPath, mdPath]) {
  assert.equal(fs.existsSync(path.join(root, p)), true, `${p} must exist`);
}

const registry = json(registryPath);
const qualification = json(qualificationPath);
const mapping = json(mappingPath);
const md = read(mdPath);

assert.equal(mapping.proto, 'HBCE-P0-MARKET-V2-068-INTERLOCUTOR-MAPPING-v1');
assert.equal(mapping.kind, 'HBCE_P0_MARKET_V2_068_INTERLOCUTOR_MAPPING');
assert.equal(mapping.issue_id, 'V2-068');
assert.equal(mapping.priority, 'P0-MARKET');
assert.equal(mapping.depends_on.includes('V2-066'), true);
assert.equal(mapping.depends_on.includes('V2-067'), true);
assert.equal(mapping.source_github_lead_registry_revision_hash, registry.revision_hash);
assert.equal(mapping.source_qualification_guards_revision_hash, qualification.revision_hash);
assert.equal(mapping.market_gate, 'G3C_LEAD_REGISTRY_READY');

const body = { ...mapping };
delete body.revision_hash;
assert.equal(mapping.revision_hash, sha256Digest(body));

assert.equal(mapping.status, 'INITIALIZED_NOT_READY');
assert.equal(mapping.readiness_status, 'BLOCKED');
assert.equal(mapping.g3c_ready, false);
assert.equal(mapping.interlocutor_mapping_initialized, true);
assert.equal(mapping.role_first_policy, true);
assert.equal(mapping.name_secondary_to_role, true);
assert.equal(mapping.github_contributor_is_not_buyer_contact, true);
assert.equal(mapping.personal_email_from_commit_metadata_allowed, false);
assert.equal(mapping.contact_permitted, false);
assert.equal(mapping.outreach_ready_allowed, false);

const roleIds = mapping.role_classes.map((r) => r.role_class_id);
for (const role of [
  'AI_PLATFORM_ENGINEERING',
  'SECURITY_IAM',
  'RISK_COMPLIANCE',
  'INTERNAL_AUDIT',
  'INNOVATION_PROCUREMENT',
  'REGULATED_WORKFLOW_OWNER'
]) {
  assert.equal(roleIds.includes(role), true, `${role} must be mapped`);
}

const guards = new Map(mapping.mapping_guards.map((g) => [g.guard_id, g.result]));
assert.equal(guards.get('NO_PERSON_BEFORE_ROLE'), 'ROLE_IDENTIFICATION_REQUIRED');
assert.equal(guards.get('NO_GITHUB_CONTRIBUTOR_AS_BUYER_CONTACT'), 'CONTACT_ROLE_DENIED');
assert.equal(guards.get('NO_CONTACT_WITHOUT_ORG_VERIFICATION'), 'PIPELINE_BLOCKED');
assert.equal(guards.get('NO_CONTACT_WITHOUT_ROLE_RELATION'), 'PIPELINE_BLOCKED');
assert.equal(guards.get('NO_COMMIT_EMAIL_CONTACT_ROUTE'), 'PRIVACY_POLICY_BLOCK');
assert.equal(guards.get('NO_OUTREACH_WITHOUT_HUMAN_APPROVAL'), 'PIPELINE_BLOCKED');

assert.equal(mapping.lead_interlocutor_mappings.length, registry.lead_records.length);
for (const lead of mapping.lead_interlocutor_mappings) {
  assert.equal(Array.isArray(lead.recommended_role_classes), true);
  assert.equal(lead.recommended_role_classes.length, 0);
  assert.equal(lead.role_identification_state, 'NOT_IDENTIFIED');
  assert.equal(lead.person_identification_state, 'NOT_REQUIRED_AT_THIS_STAGE');
  assert.equal(lead.contact_permitted, false);
  assert.equal(lead.outreach_ready, false);
  assert.equal(lead.reason_codes.includes('ORG_NOT_VERIFIED'), true);
  assert.equal(lead.reason_codes.includes('ROLE_NOT_IDENTIFIED'), true);
  assert.equal(lead.reason_codes.includes('PERSON_NOT_VERIFIED'), true);
  assert.equal(lead.reason_codes.includes('HUMAN_APPROVAL_MISSING'), true);
}

const controls = new Map(mapping.t149_t150_controls.map((c) => [c.test_id, c.expected_result]));
assert.equal(controls.get('T149'), 'PIPELINE_BLOCKED');
assert.equal(controls.get('T150'), 'PRIVACY_POLICY_BLOCK');

assert.equal(mapping.non_claims.g3c_lead_registry_ready, false);
assert.equal(mapping.non_claims.role_identified, false);
assert.equal(mapping.non_claims.person_verified, false);
assert.equal(mapping.non_claims.contact_permitted, false);
assert.equal(mapping.non_claims.outreach_ready, false);
assert.equal(mapping.non_claims.customer_or_client_existence, false);
assert.equal(mapping.non_claims.pilot_readiness, false);

assert.match(md, /role-first interlocutor mapping/);
assert.match(md, /GitHub contributor is not buyer contact/);
assert.match(md, /Commit metadata is not a contact route/);
assert.match(md, /AI_PLATFORM_ENGINEERING/);
assert.match(md, /REGULATED_WORKFLOW_OWNER/);

console.log('PASS PROG-026-V2-068-DOCS-EXIST');
console.log('PASS PROG-026-V2-068-HASH-STABLE');
console.log('PASS PROG-026-V2-068-DEPENDS-ON-V2-066-V2-067');
console.log('PASS PROG-026-V2-068-ROLE-CLASSES-RECORDED');
console.log('PASS PROG-026-V2-068-ROLE-FIRST-POLICY-RECORDED');
console.log('PASS PROG-026-V2-068-GITHUB-CONTRIBUTOR-NOT-BUYER-CONTACT');
console.log('PASS PROG-026-V2-068-COMMIT-EMAIL-BLOCKED');
console.log('PASS PROG-026-V2-068-LEAD-MAPPINGS-BLOCKED');
console.log('PASS PROG-026-V2-068-T149-T150-CONTROLS-RECORDED');
console.log('PASS PROG-026-V2-068-NO-CONTACT-OR-OUTREACH-CLAIM');
