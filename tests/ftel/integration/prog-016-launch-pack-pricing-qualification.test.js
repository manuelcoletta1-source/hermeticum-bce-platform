'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const repoRoot = path.resolve(__dirname, '../../..');
const pricingPath = path.join(repoRoot, 'docs/launch/level1/pricing-and-qualification.md');
const readmePath = path.join(repoRoot, 'docs/launch/level1/README.md');

assert.equal(fs.existsSync(pricingPath), true, 'pricing and qualification document must exist');
assert.equal(fs.existsSync(readmePath), true, 'launch level1 README must exist');

const pricing = fs.readFileSync(pricingPath, 'utf8');
const readme = fs.readFileSync(readmePath, 'utf8');

assert.match(pricing, /HBCE Level 1 - B2B Pilot Pricing and Qualification Pack/);
assert.match(pricing, /HBCE-B2B-L1-PROG-2027-0001 R1\.1/);
assert.match(pricing, /Launch target: 19 January 2027/);
assert.match(pricing, /B2B only/);

assert.match(pricing, /HBCE B2B pilot pricing starts at EUR 150,000/);
assert.match(pricing, /EUR 250,000 for bank-grade, cybersecurity-critical or regulated environments/);

assert.match(pricing, /Technical Discovery/);
assert.match(pricing, /EUR 25,000 - 50,000/);
assert.match(pricing, /2-4 weeks/);

assert.match(pricing, /90-day Critical Action Evidence Pilot/);
assert.match(pricing, /EUR 150,000 - 350,000/);
assert.match(pricing, /90 days/);

assert.match(pricing, /Bank \/ Fintech \/ Regulated Pilot/);
assert.match(pricing, /EUR 250,000 - 750,000/);
assert.match(pricing, /90-180 days/);

assert.match(pricing, /Enterprise Multi-System Pilot/);
assert.match(pricing, /EUR 750,000 - 1,500,000/);
assert.match(pricing, /6-9 months/);

assert.match(pricing, /Annual Enterprise License after pilot/);
assert.match(pricing, /EUR 500,000 - 2,500,000\/year/);

assert.match(pricing, /Minimum pilot floor/);
assert.match(pricing, /Regulated \/ bank \/ cybersecurity floor/);
assert.match(pricing, /No free custom pilots/);
assert.match(pricing, /No unclear scope/);
assert.match(pricing, /No compliance guarantee/);

assert.match(pricing, /Does the organization run AI agents, automations, privileged actions or critical workflows\?/);
assert.match(pricing, /Can it identify who owns the risk\?/);
assert.match(pricing, /Can it provide a controlled demo environment or mock equivalent\?/);
assert.match(pricing, /Does it need evidence export, audit reconstruction or authorization traceability\?/);
assert.match(pricing, /Is there a budget path\?/);
assert.match(pricing, /Interest without owner, environment or budget is research feedback, not pipeline/);

assert.match(pricing, /AI company \/ AI lab/);
assert.match(pricing, /Bank \/ fintech \/ insurance/);
assert.match(pricing, /Cybersecurity \/ SOC vendor/);
assert.match(pricing, /Enterprise \/ multinational/);
assert.match(pricing, /Civil robotics \/ industrial automation/);

assert.match(pricing, /Controlled HBCE runtime for agreed workflows/);
assert.match(pricing, /Verifier CLI and human-readable verification report/);
assert.match(pricing, /Sample PASS\/FAIL evidence bundles and failure cases/);
assert.match(pricing, /Production deployment across the customer enterprise/);
assert.match(pricing, /Independent legal opinion, regulatory certification or external audit signature/);
assert.match(pricing, /Defence, classified, direct B2G or public procurement activity/);

assert.match(pricing, /guarantees compliance/);
assert.match(pricing, /proves legal responsibility/);
assert.match(pricing, /replaces audit/);
assert.match(pricing, /certifies AI Act, DORA, GDPR or eIDAS compliance/);
assert.match(pricing, /provides defence-grade capability/);
assert.match(pricing, /provides direct B2G procurement readiness/);
assert.match(pricing, /proves physical truth by receipt alone/);

assert.match(pricing, /Runtime modules, demo adapters, EvidenceBundle generation and verifier output must not compute prices/);
assert.match(pricing, /produce quotations/);
assert.match(pricing, /create procurement offers/);
assert.match(pricing, /identity, authority, scope, policy, precommit, receipt, bundle and verification/);

assert.match(readme, /HBCE Level 1 Launch Pack/);
assert.match(readme, /pricing-and-qualification\.md/);
assert.match(readme, /B2B only/);
assert.match(readme, /no defence offer/);
assert.match(readme, /no direct B2G procurement offer/);
assert.match(readme, /no compliance certification/);
assert.match(readme, /no legal liability proof/);
assert.match(readme, /no physical truth proof/);
assert.match(readme, /no runtime pricing logic/);

console.log('PASS PROG-016-LAUNCH-PACK-PRICING-DOC-EXISTS');
console.log('PASS PROG-016-LAUNCH-PACK-PRICING-BANDS-ARE-EXPLICIT');
console.log('PASS PROG-016-LAUNCH-PACK-MINIMUM-FLOORS-ARE-EXPLICIT');
console.log('PASS PROG-016-LAUNCH-PACK-QUALIFICATION-GATE-IS-EXPLICIT');
console.log('PASS PROG-016-LAUNCH-PACK-INCLUDES-EXCLUDES-BOUNDARY');
console.log('PASS PROG-016-LAUNCH-PACK-PROHIBITED-CLAIMS-ARE-EXPLICIT');
console.log('PASS PROG-016-LAUNCH-PACK-NO-RUNTIME-PRICING-LOGIC');
