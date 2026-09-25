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

const publicSurfacePath = 'docs/launch/level1/market/v2-063-public-surface-profile.json';
const linkedinAssetsPath = 'docs/launch/level1/market/v2-064-linkedin-baseline-assets.json';
const observationPath = 'docs/launch/level1/market/v2-065-market-observation-record.json';
const mdPath = 'docs/launch/level1/market/v2-065-market-observation-record.md';

assertPathExists(publicSurfacePath);
assertPathExists(linkedinAssetsPath);
assertPathExists(observationPath);
assertPathExists(mdPath);

const publicSurface = readJson(publicSurfacePath);
const linkedinAssets = readJson(linkedinAssetsPath);
const observation = readJson(observationPath);
const md = readText(mdPath);

assert.equal(observation.proto, 'HBCE-P0-MARKET-V2-065-MARKET-OBSERVATION-RECORD-v1');
assert.equal(observation.kind, 'HBCE_P0_MARKET_V2_065_MARKET_OBSERVATION_RECORD');
assert.equal(observation.document_code, 'HBCE-B2B-L1-MATRIX-PROG-2027-0001');
assert.equal(observation.specification_baseline, 'V2.9 - 25 September 2026');
assert.equal(observation.issue_id, 'V2-065');
assert.equal(observation.priority, 'P0-MARKET');
assert.equal(observation.depends_on.includes('V2-063'), true);
assert.equal(observation.depends_on.includes('V2-064'), true);
assert.equal(observation.market_gate, 'G3B_MARKET_OBSERVED');
assert.equal(observation.source_public_surface_profile_ref, publicSurfacePath);
assert.equal(observation.source_public_surface_revision_hash, publicSurface.revision_hash);
assert.equal(observation.source_linkedin_assets_ref, linkedinAssetsPath);
assert.equal(observation.source_linkedin_assets_revision_hash, linkedinAssets.revision_hash);

const bodyForHash = { ...observation };
delete bodyForHash.revision_hash;
assert.equal(observation.revision_hash, sha256Digest(bodyForHash));

assert.equal(observation.status, 'INITIALIZED_NOT_READY');
assert.equal(observation.readiness_status, 'BLOCKED');
assert.equal(observation.gate_claimed, false);
assert.equal(observation.g3b_ready, false);
assert.equal(observation.corpus_versioned, false);
assert.equal(observation.observation_corpus_ready, false);

assert.equal(observation.source_policy.public_source_only_by_default, true);
assert.equal(observation.source_policy.covert_enrichment_allowed, false);
assert.equal(observation.source_policy.commit_email_harvesting_allowed, false);
assert.equal(observation.source_policy.personal_data_minimization_required, true);
assert.equal(observation.source_policy.source_url_required, true);
assert.equal(observation.source_policy.observed_at_required, true);
assert.equal(observation.source_policy.query_or_method_required, true);
assert.equal(observation.source_policy.evidence_snippet_or_metadata_required, true);
assert.equal(observation.source_policy.analyst_decision_required, true);

for (const sourceClass of [
  'GITHUB_REPOSITORY_METADATA',
  'OFFICIAL_COMPANY_PAGE',
  'TECHNICAL_DOCUMENTATION',
  'PUBLIC_PROCUREMENT_OR_INNOVATION_PAGE',
  'PUBLIC_JOB_OR_ENGINEERING_SIGNAL'
]) {
  assert.equal(observation.allowed_source_classes.includes(sourceClass), true, `${sourceClass} must be allowed`);
}

for (const field of [
  'observation_id',
  'source',
  'source_url',
  'observed_at',
  'query_or_method',
  'organization_or_repository',
  'owner_type',
  'signal_type',
  'evidence_snippet',
  'evidence_metadata',
  'relationship_hypothesis',
  'analyst_decision',
  'status',
  'freshness_state',
  'do_not_contact',
  'privacy_review'
]) {
  assert.equal(
    Object.prototype.hasOwnProperty.call(observation.market_observation_record_schema, field),
    true,
    `${field} must be in MarketObservationRecord schema`
  );
}

assert.equal(Array.isArray(observation.seed_observation_records), true);
assert.equal(observation.seed_observation_records.length >= 3, true);

const seenIds = new Set();
const seenUrls = new Set();

for (const record of observation.seed_observation_records) {
  assert.equal(typeof record.observation_id, 'string');
  assert.equal(seenIds.has(record.observation_id), false, 'observation_id must be unique');
  seenIds.add(record.observation_id);

  assert.equal(typeof record.source_url, 'string');
  assert.match(record.source_url, /^https:\/\/github\.com\//);
  assert.equal(seenUrls.has(record.source_url), false, 'source_url must be deduped');
  seenUrls.add(record.source_url);

  assert.match(record.observed_at, /^\d{4}-\d{2}-\d{2}T/);
  assert.equal(typeof record.query_or_method, 'string');
  assert.equal(record.query_or_method.length > 20, true);
  assert.equal(typeof record.organization_or_repository, 'string');
  assert.equal(['ORG', 'USER', 'UNKNOWN'].includes(record.owner_type), true);
  assert.equal(typeof record.evidence_snippet, 'string');
  assert.equal(record.evidence_snippet.length > 20, true);
  assert.equal(typeof record.analyst_decision, 'string');
  assert.equal(record.analyst_decision.length > 20, true);
  assert.equal(record.evidence_metadata.external_revalidation_required_before_outreach, true);
  assert.equal(record.status, 'TECHNICALLY_RELEVANT');
  assert.equal(record.freshness_state, 'REVALIDATION_REQUIRED');
  assert.equal(record.privacy_review, 'PUBLIC_METADATA_ONLY');
}

const userOwnedRecords = observation.seed_observation_records.filter((record) => record.owner_type === 'USER');
assert.equal(userOwnedRecords.length >= 1, true);
for (const record of userOwnedRecords) {
  assert.notEqual(record.relationship_hypothesis, 'BUYER_CANDIDATE');
  assert.match(record.analyst_decision, /cannot be promoted to ORG_VERIFIED|not a verified buyer/i);
}

const controlMap = new Map(observation.t144_t147_controls.map((control) => [control.test_id, control.expected_result]));
assert.equal(controlMap.get('T144'), 'OBSERVATION_INVALID');
assert.equal(controlMap.get('T145'), 'DEDUPE_LINEAGE_PRESERVED');
assert.equal(controlMap.get('T146'), 'QUALIFICATION_DENIED');
assert.equal(controlMap.get('T147'), 'QUALIFICATION_DENIED');

for (const guard of [
  'NO_OBSERVATION_WITHOUT_SOURCE',
  'NO_OBSERVATION_WITHOUT_OBSERVED_AT',
  'NO_USER_OWNER_TO_ORG_VERIFIED',
  'NO_TECHNICAL_RELEVANCE_TO_BUYER_FIT',
  'NO_OBSERVATION_TO_OUTREACH'
]) {
  assert.equal(
    observation.invalid_transition_guards.some((entry) => entry.guard_id === guard),
    true,
    `${guard} must be recorded`
  );
}

assert.equal(observation.non_claims.g3b_market_observed, false);
assert.equal(observation.non_claims.corpus_complete, false);
assert.equal(observation.non_claims.lead_registry_ready, false);
assert.equal(observation.non_claims.organization_verified, false);
assert.equal(observation.non_claims.role_identified, false);
assert.equal(observation.non_claims.qualified_lead, false);
assert.equal(observation.non_claims.outreach_ready, false);
assert.equal(observation.non_claims.buyer_interest, false);
assert.equal(observation.non_claims.customer_or_client_existence, false);
assert.equal(observation.non_claims.pilot_readiness, false);

assert.match(md, /V2-065 MarketObservationRecord/);
assert.match(md, /public-source discovery/);
assert.match(md, /A repository is a signal, not a contract/);
assert.match(md, /Technical relevance is not buyer fit/);
assert.match(md, /No commit-email harvesting/);
assert.match(md, /T144/);
assert.match(md, /T147/);
assert.match(md, /G3B MARKET_OBSERVED/);
assert.match(md, /customer\/client existence/);

console.log('PASS PROG-023-V2-065-DOCS-EXIST');
console.log('PASS PROG-023-V2-065-HASH-STABLE');
console.log('PASS PROG-023-V2-065-DEPENDS-ON-V2-063-V2-064');
console.log('PASS PROG-023-V2-065-SCHEMA-RECORDED');
console.log('PASS PROG-023-V2-065-SEED-OBSERVATIONS-RECORDED');
console.log('PASS PROG-023-V2-065-SOURCE-REPRODUCIBILITY-GUARDED');
console.log('PASS PROG-023-V2-065-USER-OWNER-NOT-ORG-VERIFIED');
console.log('PASS PROG-023-V2-065-T144-T147-CONTROLS-RECORDED');
console.log('PASS PROG-023-V2-065-NO-MARKET-OBSERVED-CLAIM');
