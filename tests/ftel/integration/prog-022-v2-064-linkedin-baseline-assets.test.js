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

const profilePath = 'docs/launch/level1/market/v2-063-public-surface-profile.json';
const assetsPath = 'docs/launch/level1/market/v2-064-linkedin-baseline-assets.json';
const mdPath = 'docs/launch/level1/market/v2-064-linkedin-baseline-assets.md';

assertPathExists(profilePath);
assertPathExists(assetsPath);
assertPathExists(mdPath);

const profile = readJson(profilePath);
const assets = readJson(assetsPath);
const md = readText(mdPath);

assert.equal(assets.proto, 'HBCE-P0-MARKET-V2-064-LINKEDIN-BASELINE-ASSETS-v1');
assert.equal(assets.kind, 'HBCE_P0_MARKET_V2_064_LINKEDIN_BASELINE_ASSETS');
assert.equal(assets.document_code, 'HBCE-B2B-L1-MATRIX-PROG-2027-0001');
assert.equal(assets.specification_baseline, 'V2.9 - 25 September 2026');
assert.equal(assets.issue_id, 'V2-064');
assert.equal(assets.priority, 'P0-MARKET');
assert.equal(assets.depends_on.includes('V2-063'), true);
assert.equal(assets.market_gate, 'G3A_PUBLIC_SURFACE_READY');
assert.equal(assets.source_public_surface_profile_ref, profilePath);
assert.equal(assets.source_public_surface_revision_hash, profile.revision_hash);

const bodyForHash = { ...assets };
delete bodyForHash.revision_hash;
assert.equal(assets.revision_hash, sha256Digest(bodyForHash));

assert.equal(assets.status, 'INITIALIZED_NOT_READY');
assert.equal(assets.readiness_status, 'BLOCKED');
assert.equal(assets.gate_claimed, false);
assert.equal(assets.g3a_ready, false);
assert.equal(assets.profile_complete, false);
assert.equal(assets.baseline_assets_complete, true);
assert.equal(assets.approval_state, 'DRAFT_NOT_APPROVED');
assert.equal(assets.publication_permitted, false);
assert.equal(assets.published_at, null);
assert.equal(assets.human_approval_required, true);
assert.equal(assets.legal_identity_verification_required, true);

assert.equal(assets.company_profile_asset.company_name, 'HERMETICUM B.C.E.');
assert.equal(assets.company_profile_asset.legal_name_state, 'TO_VERIFY_BEFORE_PUBLICATION');
assert.equal(assets.company_profile_asset.tagline, profile.tagline);
assert.match(assets.company_profile_asset.headline, /Governed operational infrastructure/);
assert.equal(assets.company_profile_asset.about.length >= 5, true);
assert.equal(assets.company_profile_asset.about.some((line) => /JOKER-C2/.test(line)), true);
assert.equal(assets.company_profile_asset.about.some((line) => /MATRIX/.test(line)), true);

assert.deepEqual(assets.allowed_claim_ids, profile.allowed_claim_ids);
assert.equal(Array.isArray(assets.initial_content_set), true);
assert.equal(assets.initial_content_set.length >= 3, true);

for (const post of assets.initial_content_set) {
  assert.equal(post.asset_type, 'LINKEDIN_POST_DRAFT');
  assert.equal(post.publication_label, 'UNDER_VALIDATION');
  assert.equal(post.status, 'DRAFT_NOT_APPROVED');
  assert.equal(post.publish_allowed, false);
  assert.equal(Array.isArray(post.claim_ids), true);
  assert.equal(post.claim_ids.length > 0, true);
  assert.equal(Array.isArray(post.evidence_refs), true);
  assert.equal(post.evidence_refs.length > 0, true);
  assert.match(post.draft_text, /UNDER_VALIDATION/);

  for (const claimId of post.claim_ids) {
    assert.equal(profile.allowed_claim_ids.includes(claimId), true, `${claimId} must be allowed by V2-063`);
  }
}

const externalText = [
  assets.company_profile_asset.tagline,
  assets.company_profile_asset.headline,
  ...assets.company_profile_asset.about,
  ...assets.initial_content_set.map((post) => post.title),
  ...assets.initial_content_set.map((post) => post.draft_text)
].join(' ').toLowerCase();

for (const forbidden of profile.forbidden_claim_patterns) {
  assert.equal(
    externalText.includes(forbidden.toLowerCase()),
    false,
    `external text must not include forbidden pattern: ${forbidden}`
  );
}

assert.equal(assets.publication_controls.t141_profile_identity_fields_present, false);
assert.equal(assets.publication_controls.t142_all_claims_have_claim_id_and_label, true);
assert.equal(assets.publication_controls.t143_no_pilot_ready_claim_when_g2_g5_false, true);
assert.equal(assets.publication_controls.unsupported_claim_result, 'PUBLISH_DENIED');
assert.equal(assets.publication_controls.g2_ready_required_for_pilot_ready_language, true);
assert.equal(assets.publication_controls.g5_ready_required_for_pilot_start_language, true);

assert.equal(assets.non_claims.public_surface_ready, false);
assert.equal(assets.non_claims.assets_published, false);
assert.equal(assets.non_claims.legal_identity_verified_for_publication, false);
assert.equal(assets.non_claims.external_publication_approved, false);
assert.equal(assets.non_claims.buyer_interest, false);
assert.equal(assets.non_claims.customer_or_client_existence, false);
assert.equal(assets.non_claims.pilot_readiness, false);
assert.equal(assets.non_claims.production_readiness, false);

assert.match(md, /V2-064 LinkedIn Baseline Assets/);
assert.match(md, /governed drafts/);
assert.match(md, /not published assets/);
assert.match(md, /not approved outreach/);
assert.match(md, /not evidence of market readiness/);
assert.match(md, /T141 remains blocked/);
assert.match(md, /T142 is guarded/);
assert.match(md, /T143 is guarded/);
assert.match(md, /Human approval remains mandatory/);
assert.match(md, /G3A PUBLIC_SURFACE_READY/);
assert.match(md, /customer\/client existence/);

console.log('PASS PROG-022-V2-064-DOCS-EXIST');
console.log('PASS PROG-022-V2-064-HASH-STABLE');
console.log('PASS PROG-022-V2-064-DEPENDS-ON-V2-063');
console.log('PASS PROG-022-V2-064-PROFILE-ASSET-RECORDED');
console.log('PASS PROG-022-V2-064-CONTENT-DRAFTS-RECORDED');
console.log('PASS PROG-022-V2-064-ONLY-ALLOWED-CLAIMS-USED');
console.log('PASS PROG-022-V2-064-FORBIDDEN-PATTERNS-BLOCKED');
console.log('PASS PROG-022-V2-064-T141-T143-GUARDED');
console.log('PASS PROG-022-V2-064-NO-PUBLICATION-CLAIM');
