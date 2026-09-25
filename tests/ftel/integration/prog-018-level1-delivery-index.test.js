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

function existsRelative(relativePath) {
  return fs.existsSync(path.join(repoRoot, relativePath));
}

function assertPathExists(relativePath) {
  assert.equal(existsRelative(relativePath), true, `${relativePath} must exist`);
}

function listJsonFilesRecursive(relativePath) {
  const root = path.join(repoRoot, relativePath);
  const results = [];

  function walk(current) {
    for (const entry of fs.readdirSync(current, { withFileTypes: true })) {
      const full = path.join(current, entry.name);
      if (entry.isDirectory()) {
        walk(full);
      } else if (entry.isFile() && entry.name.endsWith('.json')) {
        results.push(full);
      }
    }
  }

  walk(root);
  return results;
}

const deliveryMdPath = 'docs/launch/level1/delivery-index.md';
const deliveryJsonPath = 'docs/launch/level1/delivery-index.json';
const launchReadmePath = 'docs/launch/level1/README.md';

assertPathExists(deliveryMdPath);
assertPathExists(deliveryJsonPath);
assertPathExists(launchReadmePath);

const deliveryMd = readText(deliveryMdPath);
const launchReadme = readText(launchReadmePath);
const deliveryIndex = readJson(deliveryJsonPath);

assert.equal(deliveryIndex.proto, 'HBCE-P0-LEVEL1-DELIVERY-INDEX-v2_3');
assert.equal(deliveryIndex.kind, 'HBCE_P0_LEVEL1_DELIVERY_INDEX');
assert.equal(deliveryIndex.canonical_planning_reference, 'HBCE-B2B-L1-PROG-2027-0001');
assert.equal(deliveryIndex.specification_baseline, 'V2.3 - 25 September 2026');
assert.equal(deliveryIndex.launch_target, '19 January 2027');
assert.equal(deliveryIndex.scope, 'B2B_CONTROLLED_ONLY');

assert.equal(deliveryIndex.current_classification.evidence_profile, 'L1_DEMO');
assert.equal(deliveryIndex.current_classification.package_status, 'DEMO_ONLY_EXPORT_PACKAGE');
assert.equal(deliveryIndex.current_classification.technical_gate_status, 'NOT_ASSESSED');
assert.equal(deliveryIndex.current_classification.pilot_status, 'NOT_PILOT_READY');
assert.equal(deliveryIndex.current_classification.production_status, 'NOT_PRODUCTION_READY');
assert.equal(deliveryIndex.current_classification.real_dispatch_status, 'BLOCKED_UNTIL_G5');
assert.equal(deliveryIndex.current_classification.runtime_pricing_logic, 'ABSENT');
assert.equal(deliveryIndex.current_classification.procurement_offer, 'ABSENT');

const bodyForHash = { ...deliveryIndex };
delete bodyForHash.delivery_index_hash;
assert.equal(deliveryIndex.delivery_index_hash, sha256Digest(bodyForHash));

for (const item of deliveryIndex.review_order) {
  assertPathExists(item);
}

for (const artifact of deliveryIndex.artifacts) {
  assert.equal(typeof artifact.id, 'string');
  assert.equal(typeof artifact.category, 'string');
  assert.equal(typeof artifact.path, 'string');
  assert.equal(typeof artifact.purpose, 'string');
  assertPathExists(artifact.path);
}

const requiredPaths = [
  'docs/launch/level1/README.md',
  'docs/launch/level1/pricing-and-qualification.md',
  'docs/launch/level1/delivery-index.md',
  'docs/launch/level1/delivery-index.json',
  'evidence/demo/level1/README.md',
  'evidence/demo/level1/level1-demo-manifest.json',
  'evidence/demo/level1/ai-tool-access.transcript.json',
  'evidence/demo/level1/ai-tool-access.evidence-bundle.json',
  'evidence/demo/level1/ai-tool-access.verification-report.json',
  'evidence/demo/level1/bank-cyber-critical-action.transcript.json',
  'evidence/demo/level1/bank-cyber-critical-action.evidence-bundle.json',
  'evidence/demo/level1/bank-cyber-critical-action.verification-report.json',
  'evidence/samples/level1/',
  'evidence/reports/level1/',
  'apps/hbce-verifier-cli/README.md'
];

for (const requiredPath of requiredPaths) {
  assert.equal(
    deliveryIndex.artifacts.some((artifact) => artifact.path === requiredPath) ||
      deliveryIndex.review_order.includes(requiredPath),
    true,
    `${requiredPath} must be indexed`
  );
}

const demoManifest = readJson('evidence/demo/level1/level1-demo-manifest.json');
assert.equal(demoManifest.demo_count, deliveryIndex.expected_demo_results.demo_count);
assert.equal(demoManifest.pass_count, deliveryIndex.expected_demo_results.pass_count);
assert.equal(demoManifest.fail_count, deliveryIndex.expected_demo_results.fail_count);

const demoNames = demoManifest.artifacts.map((artifact) => artifact.demo_name).sort();
assert.deepEqual(demoNames, deliveryIndex.expected_demo_results.required_demo_names.sort());

const aiReport = readJson('evidence/demo/level1/ai-tool-access.verification-report.json');
const bankReport = readJson('evidence/demo/level1/bank-cyber-critical-action.verification-report.json');
assert.equal(aiReport.result, 'PASS');
assert.equal(bankReport.result, 'PASS');

const sampleBundles = listJsonFilesRecursive('evidence/samples/level1');
const sampleReports = listJsonFilesRecursive('evidence/reports/level1');
assert.equal(sampleBundles.length >= 8, true);
assert.equal(sampleReports.length >= 8, true);

assert.equal(deliveryIndex.v2_3_alignment.spec_pdf_attests_gate, false);
assert.equal(deliveryIndex.v2_3_alignment.repository_commit_and_tests_required, true);
assert.equal(deliveryIndex.v2_3_alignment.l1_demo_can_be_shown_before_pilot, true);
assert.equal(deliveryIndex.v2_3_alignment.pilot_requires_g5_before_real_dispatch, true);
assert.equal(deliveryIndex.v2_3_alignment.g2_claimed_by_this_package, false);
assert.equal(deliveryIndex.v2_3_alignment.g5_claimed_by_this_package, false);
assert.equal(deliveryIndex.v2_3_alignment.g6_claimed_by_this_package, false);
assert.equal(deliveryIndex.v2_3_alignment.g7_claimed_by_this_package, false);

assert.equal(deliveryIndex.boundary.b2b_only, true);
assert.equal(deliveryIndex.boundary.pilot_candidate_preparation_material, true);
assert.equal(deliveryIndex.boundary.demo_only_for_demo_artifacts, true);
assert.equal(deliveryIndex.boundary.defence_offer, false);
assert.equal(deliveryIndex.boundary.classified_systems_offer, false);
assert.equal(deliveryIndex.boundary.direct_b2g_procurement_offer, false);
assert.equal(deliveryIndex.boundary.compliance_certification, false);
assert.equal(deliveryIndex.boundary.legal_liability_proof, false);
assert.equal(deliveryIndex.boundary.physical_truth_proof, false);
assert.equal(deliveryIndex.boundary.production_readiness_claim, false);
assert.equal(deliveryIndex.boundary.runtime_pricing_logic, false);
assert.equal(deliveryIndex.boundary.quotation_generator, false);
assert.equal(deliveryIndex.boundary.procurement_offer_generator, false);
assert.equal(deliveryIndex.boundary.g2_validation_record, false);
assert.equal(deliveryIndex.boundary.g5_pilot_start_authorization, false);

assert.match(deliveryMd, /Specification baseline: V2\.3 - 25 September 2026/);
assert.match(deliveryMd, /L1_DEMO/);
assert.match(deliveryMd, /DEMO_ONLY export package/);
assert.match(deliveryMd, /NOT_ASSESSED/);
assert.match(deliveryMd, /NOT_PILOT_READY/);
assert.match(deliveryMd, /BLOCKED_UNTIL_G5/);
assert.match(deliveryMd, /Reviewer Start Here/);
assert.match(deliveryMd, /Delivery Artifacts/);
assert.match(deliveryMd, /Minimum Review Checklist/);
assert.match(deliveryMd, /V2\.3 Alignment Notes/);
assert.match(deliveryMd, /not a procurement offer/);
assert.match(deliveryMd, /not a compliance certification/);
assert.match(deliveryMd, /not a legal opinion/);
assert.match(deliveryMd, /G2 validation record/);
assert.match(deliveryMd, /G5 pilot-start authorization/);

assert.match(launchReadme, /delivery-index\.md/);
assert.match(launchReadme, /delivery-index\.json/);
assert.match(launchReadme, /L1_DEMO \/ DEMO_ONLY/);
assert.match(launchReadme, /gate status NOT_ASSESSED/);
assert.match(launchReadme, /pilot status NOT_PILOT_READY/);
assert.match(launchReadme, /real dispatch blocked until G5/);

console.log('PASS PROG-018-V23-DELIVERY-INDEX-DOCS-EXIST');
console.log('PASS PROG-018-V23-DELIVERY-INDEX-HASH-IS-STABLE');
console.log('PASS PROG-018-V23-DELIVERY-INDEX-CLASSIFIES-L1-DEMO');
console.log('PASS PROG-018-V23-DELIVERY-INDEX-BLOCKS-PILOT-CLAIM');
console.log('PASS PROG-018-V23-DELIVERY-INDEX-LINKS-LAUNCH-DOCS');
console.log('PASS PROG-018-V23-DELIVERY-INDEX-LINKS-DEMO-EXPORTS');
console.log('PASS PROG-018-V23-DELIVERY-INDEX-LINKS-SAMPLE-BUNDLES');
console.log('PASS PROG-018-V23-DELIVERY-INDEX-LINKS-VERIFIER');
console.log('PASS PROG-018-V23-DELIVERY-INDEX-BOUNDARY-IS-EXPLICIT');
