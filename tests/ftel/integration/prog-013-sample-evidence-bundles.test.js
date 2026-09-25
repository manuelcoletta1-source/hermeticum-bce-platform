'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { spawnSync } = require('node:child_process');

const repoRoot = path.resolve(__dirname, '../../..');
const samplesDir = path.join(repoRoot, 'evidence/samples/level1');
const reportsDir = path.join(repoRoot, 'evidence/reports/level1');
const verifierCli = path.join(repoRoot, 'apps/hbce-verifier-cli/hbce-verifier-cli.js');
const manifestPath = path.join(samplesDir, 'sample-manifest.json');

assert.equal(fs.existsSync(manifestPath), true, 'sample manifest must exist');

const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));

assert.equal(manifest.proto, 'HBCE-P0-SAMPLE-EVIDENCE-BUNDLE-MANIFEST-v1');
assert.equal(manifest.pass_count, 3);
assert.equal(manifest.fail_count, 5);
assert.match(manifest.manifest_hash, /^sha256:[a-f0-9]{64}$/);

const passSamples = manifest.samples.filter((entry) => entry.expected_result === 'PASS');
const failSamples = manifest.samples.filter((entry) => entry.expected_result === 'FAIL');

assert.equal(passSamples.length, 3);
assert.equal(failSamples.length, 5);

for (const entry of passSamples) {
  const samplePath = path.join(repoRoot, entry.sample_path);
  const reportPath = path.join(repoRoot, entry.report_path);

  assert.equal(fs.existsSync(samplePath), true, `${entry.name} sample must exist`);
  assert.equal(fs.existsSync(reportPath), true, `${entry.name} report must exist`);

  const cli = spawnSync(
    process.execPath,
    [verifierCli, 'verify', samplePath, '--format', 'json'],
    {
      cwd: repoRoot,
      encoding: 'utf8'
    }
  );

  assert.equal(cli.status, 0, cli.stderr || cli.stdout);

  const report = JSON.parse(cli.stdout);
  const storedReport = JSON.parse(fs.readFileSync(reportPath, 'utf8'));
  const bundle = JSON.parse(fs.readFileSync(samplePath, 'utf8'));

  assert.equal(report.result, 'PASS');
  assert.equal(storedReport.result, 'PASS');
  assert.equal(bundle.bundle_semantics.evidence_bundle_certifies_compliance, false);
  assert.equal(bundle.bundle_semantics.evidence_bundle_proves_legal_liability, false);
  assert.equal(bundle.bundle_semantics.evidence_bundle_proves_physical_truth, false);
  assert.equal(bundle.commercial_semantics.contains_pricing_logic, false);
  assert.equal(bundle.commercial_semantics.contains_procurement_offer, false);
  assert.equal(Object.hasOwn(bundle, 'price'), false);
  assert.equal(Object.hasOwn(bundle, 'quote'), false);
  assert.equal(Object.hasOwn(bundle, 'procurement_offer'), false);
}

for (const entry of failSamples) {
  const samplePath = path.join(repoRoot, entry.sample_path);
  const reportPath = path.join(repoRoot, entry.report_path);

  assert.equal(fs.existsSync(samplePath), true, `${entry.name} sample must exist`);
  assert.equal(fs.existsSync(reportPath), true, `${entry.name} report must exist`);

  const cli = spawnSync(
    process.execPath,
    [verifierCli, 'verify', samplePath, '--format', 'json'],
    {
      cwd: repoRoot,
      encoding: 'utf8'
    }
  );

  assert.equal(cli.status, 2, cli.stderr || cli.stdout);

  const report = JSON.parse(cli.stdout);
  const storedReport = JSON.parse(fs.readFileSync(reportPath, 'utf8'));

  assert.equal(report.result, 'FAIL');
  assert.equal(storedReport.result, 'FAIL');
  assert.equal(report.boundary.certifies_compliance, false);
  assert.equal(report.boundary.proves_legal_liability, false);
  assert.equal(report.boundary.proves_physical_truth, false);
}

const readme = fs.readFileSync(path.join(samplesDir, 'README.md'), 'utf8');
assert.match(readme, /3 PASS EvidenceBundle fixtures/);
assert.match(readme, /5 FAIL EvidenceBundle fixtures/);
assert.match(readme, /do not certify compliance/);
assert.match(readme, /contain no pricing logic or procurement offer/);

const reportFiles = fs
  .readdirSync(reportsDir)
  .filter((file) => file.endsWith('.verification-report.json'));

assert.equal(reportFiles.length, 8);

console.log('PASS PROG-013-SAMPLE-BUNDLES-HAVE-3-PASS-AND-5-FAIL');
console.log('PASS PROG-013-SAMPLE-BUNDLES-PASS-FIXTURES-VERIFY');
console.log('PASS PROG-013-SAMPLE-BUNDLES-FAIL-FIXTURES-FAIL-WITH-REASON');
console.log('PASS PROG-013-SAMPLE-BUNDLES-REPORTS-ARE-STORED');
console.log('PASS PROG-013-SAMPLE-BUNDLES-CONTAIN-NO-PRICING-OR-CERTIFICATION-CLAIM');
