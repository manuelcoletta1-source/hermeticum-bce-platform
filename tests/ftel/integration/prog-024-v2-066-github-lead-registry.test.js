'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const { sha256Digest } = require('../../../packages/hbce-core/canonical-json.js');

const repoRoot = path.resolve(__dirname, '../../..');

function readText(relativePath) {
  return fs.readFileSync(path.join(repoRoot, relativePath), 'utf8');
}

function readJson(relativePath) {
  return JSON.parse(readText(relativePath));
}

function assertPathExists(relativePath) {
  assert.equal(fs.existsSync(path.join(repoRoot, relativePath)), true, `${relativePath} must exist`);
}

const observationPath = 'docs/launch/level1/market/v2-065-market-observation-record.json';
const registryPath = 'docs/launch/level1/market/v2-066-github-lead-registry.json';
const mdPath = 'docs/launch/level1/market/v2-066-github-lead-registry.md';

assertPathExists(observationPath);
assertPathExists(registryPath);
assertPathExists(mdPath);

const observation = readJson(observationPath);
const registry = readJson(registryPath);
const md = readText(mdPath);

assert.equal(registry.proto, 'HBCE-P0-MARKET-V2-066-GITHUB-LEAD-REGISTRY-v1');
assert.equal(registry.kind, 'HBCE_P0_MARKET_V2_066_GITHUB_LEAD_REGISTRY');
assert.equal(registry.document_code, 'HBCE-B2B-L1-MATRIX-PROG-2027-0001');
assert.equal(registry.specification_baseline, 'V2.9 - 25 September 2026');
assert.equal(registry.issue_id, 'V2-066');
assert.equal(registry.priority, 'P0-MARKET');
assert.equal(registry.depends_on.includes('V2-065'), true);
assert.equal(registry.market_gate, 'G3C_LEAD_REGISTRY_READY');
assert.equal(registry.source_market_observation_record_ref, observationPath);
assert.equal(registry.source_market_observation_revision_hash, observation.revision_hash);

const bodyForHash = { ...registry };
delete bodyForHash.revision_hash;
assert.equal(registry.revision_hash, sha256Digest(bodyForHash));

const snapshotHash = sha256Digest({
  lead_records: registry.lead_records,
  lead_count: registry.lead_count,
  source_market_observation_revision_hash: registry.source_market_observation_revision_hash
});
assert.equal(registry.registry_snapshot_hash, snapshotHash);

assert.equal(registry.status, 'INITIALIZED_NOT_READY');
assert.equal(registry.readiness_status, 'BLOCKED');
assert.equal(registry.gate_claimed, false);
assert.equal(registry.g3c_ready, false);
assert.equal(registry.registry_initialized, true);
assert.equal(registry.registry_snapshot_versioned, true);
assert.equal(registry.valid_lead_registry_ready, false);

assert.deepEqual(registry.pipeline_states, [
  'DISCOVERED',
  'TECHNICALLY_RELEVANT',
  'ORG_VERIFIED',
  'ROLE_IDENTIFIED',
  'QUALIFIED',
  'OUTREACH_READY',
  'CONTACTED',
  'DISCOVERY',
  'PILOT_CANDIDATE',
  'PARKED',
  'CLOSED'
]);

for (const field of [
  'lead_id',
  'source_ref',
  'organization_state',
  'relationship_hypothesis',
  'technical_fit',
  'buyer_problem_evidence',
  'contact_role_state',
  'pipeline_state',
  'do_not_contact',
  'last_reviewed'
]) {
  assert.equal(
    Object.prototype.hasOwnProperty.call(registry.lead_record_schema, field),
    true,
    `${field} must be in GitHub Lead Registry schema`
  );
}

assert.equal(Array.isArray(registry.lead_records), true);
assert.equal(registry.lead_records.length, observation.seed_observation_records.length);
assert.equal(registry.lead_count, registry.lead_records.length);
assert.equal(registry.qualified_lead_count, 0);
assert.equal(registry.outreach_ready_count, 0);
assert.equal(registry.contactable_lead_count, 0);

const seenLeadIds = new Set();
const seenSourceRefs = new Set();

for (const lead of registry.lead_records) {
  assert.match(lead.lead_id, /^GH-\d{4}$/);
  assert.equal(seenLeadIds.has(lead.lead_id), false, 'lead_id must be unique');
  seenLeadIds.add(lead.lead_id);

  assert.match(lead.source_ref, /^https:\/\/github\.com\//);
  assert.equal(seenSourceRefs.has(lead.source_ref), false, 'source_ref must be deduped');
  seenSourceRefs.add(lead.source_ref);

  assert.equal(['UNKNOWN', 'USER_ONLY', 'ORG_VERIFIED'].includes(lead.organization_state), true);
  assert.notEqual(lead.organization_state, 'ORG_VERIFIED');

  assert.equal([
    'BUYER_CANDIDATE',
    'PARTNER_CANDIDATE',
    'COMPETITOR_OR_PEER',
    'USE_CASE_SIGNAL',
    'UNKNOWN'
  ].includes(lead.relationship_hypothesis), true);

  assert.equal(lead.technical_fit.state, 'TECHNICALLY_RELEVANT');
  assert.equal(lead.buyer_problem_evidence, null);
  assert.equal(lead.contact_role_state, 'NOT_IDENTIFIED');
  assert.equal(lead.pipeline_state, 'TECHNICALLY_RELEVANT');
  assert.equal(lead.qualified_state, false);
  assert.equal(lead.outreach_ready, false);
  assert.equal(lead.external_revalidation_required_before_outreach, true);
  assert.equal(Array.isArray(lead.blocked_promotions), true);
  assert.equal(lead.blocked_promotions.includes('OUTREACH_READY'), true);
  assert.equal(lead.blocked_promotions.includes('PILOT_CANDIDATE'), true);
}

const userOwnerLeads = registry.lead_records.filter((lead) => lead.source_owner_type === 'USER');
assert.equal(userOwnerLeads.length >= 1, true);
for (const lead of userOwnerLeads) {
  assert.equal(lead.organization_state, 'USER_ONLY');
  assert.notEqual(lead.relationship_hypothesis, 'BUYER_CANDIDATE');
  assert.equal(lead.pipeline_state, 'TECHNICALLY_RELEVANT');
}

const guardMap = new Map(registry.registry_guards.map((guard) => [guard.guard_id, guard.result]));
assert.equal(guardMap.get('REPOSITORY_FOUND_NOT_ORG_VERIFIED'), 'ORG_VERIFIED_DENIED');
assert.equal(guardMap.get('TECHNICAL_RELEVANCE_NOT_BUYER_FIT'), 'QUALIFICATION_DENIED');
assert.equal(guardMap.get('CONTRIBUTOR_NOT_PROCUREMENT_OWNER'), 'ROLE_IDENTIFICATION_REQUIRED');
assert.equal(guardMap.get('NO_QUALIFIED_WITHOUT_BUYER_PROBLEM_EVIDENCE'), 'QUALIFICATION_DENIED');
assert.equal(guardMap.get('NO_OUTREACH_WITHOUT_ROLE_AND_APPROVAL'), 'PIPELINE_BLOCKED');
assert.equal(guardMap.get('DO_NOT_CONTACT_OVERRIDES_PIPELINE'), 'DO_NOT_CONTACT_BLOCK');

const controlMap = new Map(registry.t145_t150_controls.map((control) => [control.test_id, control.expected_result]));
assert.equal(controlMap.get('T145'), 'DEDUPE_LINEAGE_PRESERVED');
assert.equal(controlMap.get('T146'), 'QUALIFICATION_DENIED');
assert.equal(controlMap.get('T147'), 'QUALIFICATION_DENIED');
assert.equal(controlMap.get('T148'), 'QUALIFICATION_DENIED');
assert.equal(controlMap.get('T149'), 'PIPELINE_BLOCKED');
assert.equal(controlMap.get('T150'), 'PRIVACY_POLICY_BLOCK');

assert.equal(registry.non_claims.g3c_lead_registry_ready, false);
assert.equal(registry.non_claims.organization_verified, false);
assert.equal(registry.non_claims.role_identified, false);
assert.equal(registry.non_claims.qualified_lead, false);
assert.equal(registry.non_claims.outreach_ready, false);
assert.equal(registry.non_claims.contacted, false);
assert.equal(registry.non_claims.discovery_started, false);
assert.equal(registry.non_claims.buyer_interest, false);
assert.equal(registry.non_claims.customer_or_client_existence, false);
assert.equal(registry.non_claims.pilot_candidate, false);
assert.equal(registry.non_claims.pilot_readiness, false);

assert.match(md, /V2-066 GitHub Lead Registry/);
assert.match(md, /Repository found is not organization verified/);
assert.match(md, /Technical relevance is not buyer fit/);
assert.match(md, /Contributor is not procurement owner/);
assert.match(md, /Valid lead registry ready: false/);
assert.match(md, /G3C LEAD_REGISTRY_READY/);
assert.match(md, /customer\/client existence/);

console.log('PASS PROG-024-V2-066-DOCS-EXIST');
console.log('PASS PROG-024-V2-066-HASH-STABLE');
console.log('PASS PROG-024-V2-066-DEPENDS-ON-V2-065');
console.log('PASS PROG-024-V2-066-LEAD-SCHEMA-RECORDED');
console.log('PASS PROG-024-V2-066-REGISTRY-SNAPSHOT-STABLE');
console.log('PASS PROG-024-V2-066-SOURCE-DEDUPE-RECORDED');
console.log('PASS PROG-024-V2-066-USER-OWNER-STAYS-USER-ONLY');
console.log('PASS PROG-024-V2-066-TECHNICAL-RELEVANCE-NOT-BUYER-FIT');
console.log('PASS PROG-024-V2-066-T145-T150-CONTROLS-RECORDED');
console.log('PASS PROG-024-V2-066-NO-QUALIFIED-OR-OUTREACH-CLAIM');
