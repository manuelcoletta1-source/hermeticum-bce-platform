'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { execFileSync } = require('node:child_process');

const {
  runLevel1Demos
} = require('../../../apps/hbce-demo/run-level1-demos.js');
const {
  verifyEvidenceBundle
} = require('../../../packages/hbce-evidence/p0-evidence-bundle.js');

const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'hbce-prog-017-'));
const result = runLevel1Demos({ outputDir: tmpDir });

assert.equal(fs.existsSync(result.manifest_path), true);
assert.equal(fs.existsSync(result.readme_path), true);

const manifest = JSON.parse(fs.readFileSync(result.manifest_path, 'utf8'));
const readme = fs.readFileSync(result.readme_path, 'utf8');

assert.equal(manifest.proto, 'HBCE-P0-LEVEL1-DEMO-RUNNER-v1');
assert.equal(manifest.kind, 'HBCE_P0_LEVEL1_DEMO_EXPORT_MANIFEST');
assert.equal(manifest.demo_count, 2);
assert.equal(manifest.pass_count, 2);
assert.equal(manifest.fail_count, 0);
assert.match(manifest.manifest_hash, /^sha256:[a-f0-9]{64}$/);

assert.equal(manifest.boundary.demo_only, true);
assert.equal(manifest.boundary.dispatch_created, false);
assert.equal(manifest.boundary.physical_execution_performed, false);
assert.equal(manifest.boundary.certifies_compliance, false);
assert.equal(manifest.boundary.proves_legal_liability, false);
assert.equal(manifest.boundary.proves_physical_truth, false);
assert.equal(manifest.boundary.production_ready, false);
assert.equal(manifest.boundary.contains_pricing_logic, false);
assert.equal(manifest.boundary.contains_procurement_offer, false);

const demoNames = manifest.artifacts.map((entry) => entry.demo_name).sort();
assert.deepEqual(demoNames, ['ai-tool-access', 'bank-cyber-critical-action']);

for (const artifact of manifest.artifacts) {
  assert.equal(artifact.result, 'PASS');
  assert.equal(artifact.reason, 'EVIDENCE_BUNDLE_VALID');
  assert.equal(artifact.dispatch_created, false);
  assert.equal(artifact.physical_execution_performed, false);
  assert.equal(artifact.certifies_compliance, false);
  assert.equal(artifact.proves_legal_liability, false);
  assert.equal(artifact.proves_physical_truth, false);
  assert.equal(artifact.production_ready, false);

  const transcriptPath = path.join(tmpDir, artifact.transcript_file);
  const bundlePath = path.join(tmpDir, artifact.evidence_bundle_file);
  const reportPath = path.join(tmpDir, artifact.verification_report_file);

  assert.equal(fs.existsSync(transcriptPath), true);
  assert.equal(fs.existsSync(bundlePath), true);
  assert.equal(fs.existsSync(reportPath), true);

  const transcript = JSON.parse(fs.readFileSync(transcriptPath, 'utf8'));
  const bundle = JSON.parse(fs.readFileSync(bundlePath, 'utf8'));
  const report = JSON.parse(fs.readFileSync(reportPath, 'utf8'));

  assert.equal(transcript.proto, 'HBCE-P0-DEMO-TRANSCRIPT-v1');
  assert.equal(report.proto, 'HBCE-P0-DEMO-VERIFICATION-REPORT-v1');
  assert.equal(report.result, 'PASS');
  assert.equal(report.reason, 'EVIDENCE_BUNDLE_VALID');
  assert.equal(report.evidence_bundle_hash, bundle.evidence_bundle_hash);
  assert.equal(artifact.evidence_bundle_hash, bundle.evidence_bundle_hash);

  const verified = verifyEvidenceBundle(bundle);
  assert.equal(verified.result, 'PASS');
  assert.equal(verified.reason, 'EVIDENCE_BUNDLE_VALID');

  const steps = transcript.transcript.map((entry) => entry.step);
  assert.equal(steps.includes('REQUEST_ENVELOPE_CREATED'), true);
  assert.equal(steps.includes('POLICY_DECISION_CREATED'), true);
  assert.equal(steps.includes('PRECOMMIT_CREATED'), true);
  assert.equal(steps.includes('EVIDENCE_BUNDLE_EXPORTED'), true);
  assert.equal(steps.includes('VERIFIER_RESULT'), true);
}

const aiTranscript = JSON.parse(fs.readFileSync(path.join(tmpDir, 'ai-tool-access.transcript.json'), 'utf8'));
assert.equal(
  aiTranscript.transcript.map((entry) => entry.step).includes('MOCK_TARGET_RECEIPT_RECORDED'),
  true
);

const bankTranscript = JSON.parse(fs.readFileSync(path.join(tmpDir, 'bank-cyber-critical-action.transcript.json'), 'utf8'));
assert.equal(
  bankTranscript.transcript.map((entry) => entry.step).includes('DUAL_CONTROL_RECORDED'),
  true
);
assert.equal(
  bankTranscript.transcript.map((entry) => entry.step).includes('MOCK_BANK_CYBER_RECEIPT_RECORDED'),
  true
);

assert.match(readme, /HBCE Level 1 Demo Export Pack/);
assert.match(readme, /AI Tool Access demo/);
assert.match(readme, /Bank\/Cyber critical action demo/);
assert.match(readme, /no real AI tool dispatch/);
assert.match(readme, /no real bank system dispatch/);
assert.match(readme, /no real cyber system dispatch/);
assert.match(readme, /no compliance certification/);
assert.match(readme, /no legal liability proof/);
assert.match(readme, /no physical truth proof/);
assert.match(readme, /no pricing logic/);
assert.match(readme, /no procurement offer/);

const cliDir = fs.mkdtempSync(path.join(os.tmpdir(), 'hbce-prog-017-cli-'));
const cliOutput = execFileSync(
  process.execPath,
  ['apps/hbce-demo/run-level1-demos.js', '--out', cliDir],
  {
    cwd: path.resolve(__dirname, '../../..'),
    encoding: 'utf8'
  }
);

const cliReport = JSON.parse(cliOutput);
assert.equal(cliReport.proto, 'HBCE-P0-LEVEL1-DEMO-RUNNER-v1');
assert.equal(cliReport.result, 'PASS');
assert.equal(cliReport.demo_count, 2);
assert.equal(cliReport.pass_count, 2);
assert.equal(cliReport.fail_count, 0);
assert.equal(fs.existsSync(cliReport.manifest_path), true);

console.log('PASS PROG-017-DEMO-RUNNER-EXPORTS-MANIFEST');
console.log('PASS PROG-017-DEMO-RUNNER-EXPORTS-TRANSCRIPTS');
console.log('PASS PROG-017-DEMO-RUNNER-EXPORTS-EVIDENCE-BUNDLES');
console.log('PASS PROG-017-DEMO-RUNNER-EXPORTS-VERIFICATION-REPORTS');
console.log('PASS PROG-017-DEMO-RUNNER-BOUNDARY-IS-EXPLICIT');
console.log('PASS PROG-017-DEMO-RUNNER-CLI-WORKS');
