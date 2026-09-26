'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { sha256Digest } = require('../../../packages/hbce-core/canonical-json.js');

const root = path.resolve(__dirname, '../../..');
const read = (p) => fs.readFileSync(path.join(root, p), 'utf8');
const json = (p) => JSON.parse(read(p));

const publicSurfacePath = 'docs/launch/level1/market/v2-063-public-surface-profile.json';
const qualificationPath = 'docs/launch/level1/market/v2-067-qualification-guards.json';
const outreachPath = 'docs/launch/level1/market/v2-069-outreach-claim-guard.json';
const pipelinePath = 'docs/launch/level1/market/v2-070-pipeline-state-machine.json';
const separationPath = 'docs/launch/level1/market/v2-071-market-technical-separation.json';
const mdPath = 'docs/launch/level1/market/v2-071-market-technical-separation.md';

for (const p of [publicSurfacePath, qualificationPath, outreachPath, pipelinePath, separationPath, mdPath]) {
  assert.equal(fs.existsSync(path.join(root, p)), true, `${p} must exist`);
}

const publicSurface = json(publicSurfacePath);
const qualification = json(qualificationPath);
const outreach = json(outreachPath);
const pipeline = json(pipelinePath);
const separation = json(separationPath);
const md = read(mdPath);

assert.equal(separation.proto, 'HBCE-P0-MARKET-V2-071-MARKET-TECHNICAL-SEPARATION-v1');
assert.equal(separation.kind, 'HBCE_P0_MARKET_V2_071_MARKET_TECHNICAL_SEPARATION');
assert.equal(separation.issue_id, 'V2-071');
assert.equal(separation.priority, 'P0-MARKET');
assert.equal(separation.depends_on.includes('V2-063'), true);
assert.equal(separation.depends_on.includes('V2-067'), true);
assert.equal(separation.depends_on.includes('V2-069'), true);
assert.equal(separation.depends_on.includes('V2-070'), true);
assert.equal(separation.market_gate, 'G9_MARKET_INGRESSION_OPERATIONAL');

assert.equal(separation.source_public_surface_revision_hash, publicSurface.revision_hash);
assert.equal(separation.source_qualification_guards_revision_hash, qualification.revision_hash);
assert.equal(separation.source_outreach_claim_guard_revision_hash, outreach.revision_hash);
assert.equal(separation.source_pipeline_state_machine_revision_hash, pipeline.revision_hash);

const body = { ...separation };
delete body.revision_hash;
assert.equal(separation.revision_hash, sha256Digest(body));

assert.equal(separation.status, 'INITIALIZED_NOT_READY');
assert.equal(separation.readiness_status, 'BLOCKED');
assert.equal(separation.g9_ready, false);
assert.equal(separation.separation_initialized, true);
assert.equal(separation.build_market_state_separation_required, true);
assert.equal(separation.market_signal_can_promote_technical_gate, false);
assert.equal(separation.market_signal_can_modify_profile_satisfied, false);
assert.equal(separation.market_signal_can_override_verifier, false);
assert.equal(separation.technical_failure_restricts_market_claims, true);
assert.equal(separation.commercial_interest_is_not_buyer_authority, true);
assert.equal(separation.contact_is_not_customer_acceptance, true);
assert.equal(separation.discovery_is_not_pilot_readiness, true);

assert.equal(separation.separated_state_domains.build_domain.market_input_effect, 'none on technical truth');
assert.equal(separation.separated_state_domains.market_domain.technical_input_effect, 'technical failure restricts allowed claims');

const forbidden = new Map(separation.forbidden_promotions.map((r) => [`${r.signal}->${r.forbidden_target}`, r.result]));
assert.equal(forbidden.get('qualified_lead->PROFILE_SATISFIED'), 'MARKET_TECHNICAL_BOUNDARY_VIOLATION');
assert.equal(forbidden.get('outreach_ready->G2_TECHNICAL_GATE'), 'MARKET_TECHNICAL_BOUNDARY_VIOLATION');
assert.equal(forbidden.get('contacted->CUSTOMER_ACCEPTANCE'), 'CUSTOMER_CLAIM_BLOCKED');
assert.equal(forbidden.get('discovery_call->PILOT_READINESS'), 'PILOT_READY_CLAIM_BLOCKED');
assert.equal(forbidden.get('commercial_interest->BUYER_AUTHORITY_CONFIRMED'), 'BUYER_AUTHORITY_UNPROVEN');

const effects = new Map(separation.allowed_cross_domain_effects.map((r) => [`${r.from}->${r.to}:${r.result}`, r]));
assert.equal(effects.has('BUILD->MARKET:CLAIM_SET_RESTRICTED'), true);
assert.equal(effects.has('BUILD->MARKET:CLAIM_SET_LIMITED_TO_EVIDENCE'), true);
assert.equal(effects.has('MARKET->BUILD:FEEDBACK_RECORDED_NO_TECHNICAL_PROMOTION'), true);
assert.equal(effects.has('MARKET->BUILD:REQUIREMENT_CANDIDATE_NOT_GATE'), true);

const fixtures = new Map(separation.boundary_verdict_fixtures.map((f) => [f.fixture_id, f.expected_result]));
assert.equal(fixtures.get('LEAD-QUALIFIED-TO-PROFILE'), 'MARKET_TECHNICAL_BOUNDARY_VIOLATION');
assert.equal(fixtures.get('CONTACTED-TO-CUSTOMER'), 'CUSTOMER_CLAIM_BLOCKED');
assert.equal(fixtures.get('DISCOVERY-TO-PILOT'), 'PILOT_READY_CLAIM_BLOCKED');
assert.equal(fixtures.get('TECH-FAIL-TO-CLAIMS'), 'CLAIM_SET_RESTRICTED');
assert.equal(fixtures.get('BUYER-PROBLEM-TO-FEEDBACK'), 'FEEDBACK_RECORDED_NO_TECHNICAL_PROMOTION');

const controls = new Map(separation.t158_t159_t160_controls.map((c) => [c.test_id, c.expected_result]));
assert.equal(controls.get('T158'), 'MARKET_TECHNICAL_BOUNDARY_VIOLATION');
assert.equal(controls.get('T159'), 'CLAIM_SET_RESTRICTED');
assert.equal(controls.get('T160'), 'SNAPSHOT_INVALID');

assert.equal(separation.non_claims.g9_market_ingression_operational, false);
assert.equal(separation.non_claims.technical_gate_satisfied, false);
assert.equal(separation.non_claims.profile_satisfied, false);
assert.equal(separation.non_claims.customer_or_client_existence, false);
assert.equal(separation.non_claims.buyer_authority_confirmed, false);
assert.equal(separation.non_claims.pilot_readiness, false);

assert.match(md, /separation boundary between BUILD truth and MARKET signals/);
assert.match(md, /MARKET cannot set technical gates/);
assert.match(md, /Forbidden Promotions/);
assert.match(md, /does not claim G9 readiness/);

console.log('PASS PROG-029-V2-071-DOCS-EXIST');
console.log('PASS PROG-029-V2-071-HASH-STABLE');
console.log('PASS PROG-029-V2-071-DEPENDS-ON-V2-063-V2-067-V2-069-V2-070');
console.log('PASS PROG-029-V2-071-SEPARATION-FLAGS-RECORDED');
console.log('PASS PROG-029-V2-071-FORBIDDEN-PROMOTIONS-BLOCKED');
console.log('PASS PROG-029-V2-071-CROSS-DOMAIN-EFFECTS-LIMITED');
console.log('PASS PROG-029-V2-071-BOUNDARY-FIXTURES-RECORDED');
console.log('PASS PROG-029-V2-071-T158-T159-T160-CONTROLS-RECORDED');
console.log('PASS PROG-029-V2-071-NO-G9-OR-TECHNICAL-PROMOTION-CLAIM');
