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

const jsonPath = 'docs/launch/level1/market/v2-063-public-surface-profile.json';
const mdPath = 'docs/launch/level1/market/v2-063-public-surface-profile.md';

assertPathExists(jsonPath);
assertPathExists(mdPath);

const profile = readJson(jsonPath);
const md = readText(mdPath);

assert.equal(profile.proto, 'HBCE-P0-MARKET-V2-063-PUBLIC-SURFACE-PROFILE-v1');
assert.equal(profile.kind, 'HBCE_P0_MARKET_V2_063_PUBLIC_SURFACE_PROFILE');
assert.equal(profile.document_code, 'HBCE-B2B-L1-MATRIX-PROG-2027-0001');
assert.equal(profile.specification_baseline, 'V2.9 - 25 September 2026');
assert.equal(profile.issue_id, 'V2-063');
assert.equal(profile.priority, 'P0-MARKET');
assert.equal(profile.market_gate, 'G3A_PUBLIC_SURFACE_READY');
assert.equal(profile.status, 'INITIALIZED_NOT_READY');
assert.equal(profile.readiness_status, 'BLOCKED');

const bodyForHash = { ...profile };
delete bodyForHash.revision_hash;
assert.equal(profile.revision_hash, sha256Digest(bodyForHash));

for (const field of [
  'profile_id',
  'version',
  'legal_name_state',
  'product_description',
  'allowed_claim_ids',
  'forbidden_claim_patterns',
  'source_evidence_refs'
]) {
  assert.equal(Object.prototype.hasOwnProperty.call(profile, field), true, `${field} must exist`);
}

assert.equal(profile.gate_claimed, false);
assert.equal(profile.g3a_ready, false);
assert.equal(profile.publish_ready, false);
assert.equal(profile.publication_permitted, false);

assert.equal(profile.product_framing.hbce_is_model_ai, false);
assert.equal(profile.product_framing.hbce_is_governed_infrastructure, true);
assert.equal(profile.product_framing.joker_c2_is_authority, false);
assert.equal(profile.product_framing.joker_c2_is_policy_engine, false);
assert.equal(profile.product_framing.joker_c2_is_proof, false);
assert.equal(profile.product_framing.core_retains.includes('authority'), true);
assert.equal(profile.product_framing.core_retains.includes('verification'), true);

assert.equal(profile.tagline, 'Governed operational infrastructure for human-authorized AI execution.');
assert.match(profile.product_description, /AI may interpret and propose/);
assert.match(profile.product_description, /authority, policy, approval, dispatch control and evidence remain governed outside the model/);

assert.equal(profile.claim_policy.required_for_public_technical_claim.includes('claim_id'), true);
assert.equal(profile.claim_policy.required_for_public_technical_claim.includes('matrix_status'), true);
assert.equal(profile.claim_policy.required_for_public_technical_claim.includes('evidence_reference_or_label'), true);
assert.equal(profile.claim_policy.allowed_labels.includes('PROVEN'), true);
assert.equal(profile.claim_policy.allowed_labels.includes('UNDER_VALIDATION'), true);
assert.equal(profile.claim_policy.allowed_labels.includes('PROPOSED'), true);
assert.equal(profile.claim_policy.unsupported_claim_result, 'PUBLISH_DENIED');

assert.equal(Array.isArray(profile.allowed_claim_ids), true);
assert.equal(profile.allowed_claim_ids.length >= 5, true);
assert.equal(Array.isArray(profile.allowed_claims), true);
assert.equal(profile.allowed_claims.length, profile.allowed_claim_ids.length);

for (const claim of profile.allowed_claims) {
  assert.equal(profile.allowed_claim_ids.includes(claim.claim_id), true);
  assert.equal(typeof claim.text, 'string');
  assert.equal(typeof claim.matrix_status, 'string');
  assert.equal(Array.isArray(claim.evidence_refs), true);
  assert.equal(claim.evidence_refs.length > 0, true);
  assert.equal(profile.claim_policy.allowed_labels.includes(claim.publication_label), true);
}

for (const requiredClaim of [
  'PUBLIC-CLAIM-HBCE-GOVERNED-INFRASTRUCTURE',
  'PUBLIC-CLAIM-JOKER-C2-CONVERSATIONAL-INTERFACE',
  'PUBLIC-CLAIM-AI-PROPOSES-HUMAN-AUTHORIZES',
  'PUBLIC-CLAIM-MATRIX-CLAIM-TRACEABILITY',
  'PUBLIC-CLAIM-EVIDENCE-BOUND-DEMO-PACKAGE'
]) {
  assert.equal(profile.allowed_claim_ids.includes(requiredClaim), true, `${requiredClaim} must be allowed`);
}

for (const forbidden of [
  'pilot-ready',
  'production-ready',
  'certified',
  'client',
  'customer',
  'autonomous authority',
  'AI decides',
  'LinkedIn engagement as technical evidence',
  'repository as customer'
]) {
  assert.equal(
    profile.forbidden_claim_patterns.includes(forbidden),
    true,
    `${forbidden} must be forbidden`
  );
}

assert.equal(profile.approval_workflow.publication_owner, 'Manuel Coletta');
assert.equal(profile.approval_workflow.approval_state, 'DRAFT_NOT_APPROVED');
assert.equal(profile.approval_workflow.human_approval_required, true);
assert.equal(profile.approval_workflow.published_at, null);
assert.equal(profile.approval_workflow.effect_allowed_without_approval, false);

const controlMap = new Map(profile.t141_t143_controls.map((control) => [control.test_id, control.expected_result]));
assert.equal(controlMap.get('T141'), 'PUBLIC_SURFACE_BLOCKED');
assert.equal(controlMap.get('T142'), 'PUBLISH_DENIED');
assert.equal(controlMap.get('T143'), 'PUBLISH_DENIED_CLAIM_REWRITTEN');

assert.equal(profile.launch_set.linked_in_profile_complete, false);
assert.equal(profile.launch_set.claims_of_existing_clients_or_pilots_allowed, false);

assert.equal(profile.non_claims.g3a_public_surface_ready, false);
assert.equal(profile.non_claims.profile_published, false);
assert.equal(profile.non_claims.legal_identity_verified_for_publication, false);
assert.equal(profile.non_claims.pilot_ready, false);
assert.equal(profile.non_claims.production_ready, false);
assert.equal(profile.non_claims.customer_or_client_claim, false);
assert.equal(profile.non_claims.commercial_qualification, false);

assert.match(md, /V2-063 PublicSurfaceProfile/);
assert.match(md, /LinkedIn is treated as a versioned program artifact/);
assert.match(md, /Every technical public claim requires claim_id, MATRIX status and evidence reference or publication label/);
assert.match(md, /HBCE is not positioned as another AI model/);
assert.match(md, /JOKER-C2 is visible as the conversational AI interface/);
assert.match(md, /G3A PUBLIC_SURFACE_READY/);
assert.match(md, /pilot readiness/);
assert.match(md, /customer\/client existence/);

console.log('PASS PROG-021-V2-063-DOCS-EXIST');
console.log('PASS PROG-021-V2-063-HASH-STABLE');
console.log('PASS PROG-021-V2-063-REQUIRED-FIELDS-RECORDED');
console.log('PASS PROG-021-V2-063-HBCE-NOT-AI-MODEL-FRAMING');
console.log('PASS PROG-021-V2-063-CLAIM-POLICY-RECORDED');
console.log('PASS PROG-021-V2-063-FORBIDDEN-CLAIMS-RECORDED');
console.log('PASS PROG-021-V2-063-T141-T143-CONTROLS-RECORDED');
console.log('PASS PROG-021-V2-063-NO-PUBLICATION-CLAIM');
