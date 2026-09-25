'use strict';

const fs = require('node:fs');
const path = require('node:path');

const { sha256Digest } = require('../../packages/hbce-core/canonical-json.js');
const { verifyEvidenceBundle } = require('../../packages/hbce-evidence/p0-evidence-bundle.js');
const {
  runAiToolAccessDemo
} = require('./ai-tool-access-demo-adapter.js');
const {
  runBankCyberCriticalActionDemo
} = require('./bank-cyber-critical-action-demo-adapter.js');

const RUNNER_PROTO = 'HBCE-P0-LEVEL1-DEMO-RUNNER-v1';

const DEFAULT_OUTPUT_DIR = path.resolve(__dirname, '../../evidence/demo/level1');

function ensureDir(dirPath) {
  fs.mkdirSync(dirPath, { recursive: true });
}

function writeJson(filePath, value) {
  fs.writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`, 'utf8');
}

function relativePosix(fromDir, targetPath) {
  return path.relative(fromDir, targetPath).split(path.sep).join('/');
}

function buildReport(demo) {
  const verification = verifyEvidenceBundle(demo.evidence_bundle);

  return {
    proto: 'HBCE-P0-DEMO-VERIFICATION-REPORT-v1',
    runner_proto: RUNNER_PROTO,
    demo_id: demo.demo_id,
    demo_kind: demo.kind,
    result: verification.result,
    reason: verification.reason,
    evidence_bundle_hash: demo.evidence_bundle.evidence_bundle_hash,
    manifest_hash: demo.evidence_bundle.manifest_hash,
    request_hash: demo.request_envelope.request_hash,
    policy_decision_hash: demo.policy_decision.policy_decision_hash,
    critical_action_hash: demo.critical_action.critical_action_hash,
    precommit_hash: demo.critical_action.precommit_hash,
    target_receipt_hash: demo.target_receipt.target_receipt_hash,
    boundary: {
      demo_only: demo.boundary.demo_only === true,
      dispatch_created: demo.boundary.dispatch_created === true,
      physical_execution_performed: demo.boundary.physical_execution_performed === true,
      certifies_compliance: demo.boundary.certifies_compliance === true,
      proves_legal_liability: demo.boundary.proves_legal_liability === true,
      proves_physical_truth: demo.boundary.proves_physical_truth === true,
      production_ready: demo.boundary.production_ready === true
    }
  };
}

function buildTranscript(demo) {
  return {
    proto: 'HBCE-P0-DEMO-TRANSCRIPT-v1',
    runner_proto: RUNNER_PROTO,
    demo_id: demo.demo_id,
    demo_kind: demo.kind,
    result: demo.result,
    reason: demo.reason,
    transcript: demo.transcript,
    boundary: demo.boundary
  };
}

function buildArtifactRecord(outputDir, demoName, demo, transcriptPath, bundlePath, reportPath) {
  const transcriptHash = sha256Digest(JSON.parse(fs.readFileSync(transcriptPath, 'utf8')));
  const bundleHash = sha256Digest(JSON.parse(fs.readFileSync(bundlePath, 'utf8')));
  const reportHash = sha256Digest(JSON.parse(fs.readFileSync(reportPath, 'utf8')));

  return {
    demo_name: demoName,
    demo_id: demo.demo_id,
    demo_kind: demo.kind,
    result: demo.result,
    reason: demo.reason,
    transcript_file: relativePosix(outputDir, transcriptPath),
    transcript_hash: transcriptHash,
    evidence_bundle_file: relativePosix(outputDir, bundlePath),
    evidence_bundle_hash: demo.evidence_bundle.evidence_bundle_hash,
    evidence_bundle_file_hash: bundleHash,
    verification_report_file: relativePosix(outputDir, reportPath),
    verification_report_hash: reportHash,
    dispatch_created: demo.boundary.dispatch_created === true,
    physical_execution_performed: demo.boundary.physical_execution_performed === true,
    certifies_compliance: demo.boundary.certifies_compliance === true,
    proves_legal_liability: demo.boundary.proves_legal_liability === true,
    proves_physical_truth: demo.boundary.proves_physical_truth === true,
    production_ready: demo.boundary.production_ready === true
  };
}

function runLevel1Demos(options = {}) {
  const outputDir = path.resolve(options.outputDir || DEFAULT_OUTPUT_DIR);
  ensureDir(outputDir);

  const demos = [
    {
      name: 'ai-tool-access',
      demo: runAiToolAccessDemo()
    },
    {
      name: 'bank-cyber-critical-action',
      demo: runBankCyberCriticalActionDemo()
    }
  ];

  const artifactRecords = [];

  for (const entry of demos) {
    const transcriptPath = path.join(outputDir, `${entry.name}.transcript.json`);
    const bundlePath = path.join(outputDir, `${entry.name}.evidence-bundle.json`);
    const reportPath = path.join(outputDir, `${entry.name}.verification-report.json`);

    const transcript = buildTranscript(entry.demo);
    const report = buildReport(entry.demo);

    writeJson(transcriptPath, transcript);
    writeJson(bundlePath, entry.demo.evidence_bundle);
    writeJson(reportPath, report);

    artifactRecords.push(
      buildArtifactRecord(outputDir, entry.name, entry.demo, transcriptPath, bundlePath, reportPath)
    );
  }

  const manifestBody = {
    proto: RUNNER_PROTO,
    kind: 'HBCE_P0_LEVEL1_DEMO_EXPORT_MANIFEST',
    version: 'v1',
    generated_at: '2026-09-25T15:30:00.000Z',
    demo_count: artifactRecords.length,
    pass_count: artifactRecords.filter((record) => record.result === 'PASS').length,
    fail_count: artifactRecords.filter((record) => record.result === 'FAIL').length,
    artifacts: artifactRecords,
    boundary: {
      demo_only: true,
      dispatch_created: false,
      physical_execution_performed: false,
      certifies_compliance: false,
      proves_legal_liability: false,
      proves_physical_truth: false,
      production_ready: false,
      contains_pricing_logic: false,
      contains_procurement_offer: false
    }
  };

  const manifest = {
    ...manifestBody,
    manifest_hash: sha256Digest(manifestBody)
  };

  const manifestPath = path.join(outputDir, 'level1-demo-manifest.json');
  writeJson(manifestPath, manifest);

  const readmePath = path.join(outputDir, 'README.md');
  fs.writeFileSync(
    readmePath,
    [
      '# HBCE Level 1 Demo Export Pack',
      '',
      'Generated deterministic demo artifacts for Level 1 pilot review.',
      '',
      'Included demos:',
      '',
      '- AI Tool Access demo',
      '- Bank/Cyber critical action demo',
      '',
      'Generated artifacts per demo:',
      '',
      '- transcript JSON',
      '- EvidenceBundle JSON',
      '- verification report JSON',
      '',
      'Boundary:',
      '',
      '- demo only',
      '- no real AI tool dispatch',
      '- no real bank system dispatch',
      '- no real cyber system dispatch',
      '- no physical execution',
      '- no compliance certification',
      '- no legal liability proof',
      '- no physical truth proof',
      '- no production readiness claim',
      '- no pricing logic',
      '- no procurement offer',
      ''
    ].join('\n'),
    'utf8'
  );

  return Object.freeze({
    output_dir: outputDir,
    manifest_path: manifestPath,
    readme_path: readmePath,
    manifest
  });
}

function parseOutputDir(argv) {
  const index = argv.indexOf('--out');
  if (index === -1) {
    return DEFAULT_OUTPUT_DIR;
  }

  const value = argv[index + 1];
  if (!value) {
    throw new Error('Missing value for --out');
  }

  return path.resolve(value);
}

if (require.main === module) {
  const outputDir = parseOutputDir(process.argv.slice(2));
  const result = runLevel1Demos({ outputDir });
  console.log(JSON.stringify({
    proto: RUNNER_PROTO,
    result: 'PASS',
    output_dir: result.output_dir,
    manifest_path: result.manifest_path,
    demo_count: result.manifest.demo_count,
    pass_count: result.manifest.pass_count,
    fail_count: result.manifest.fail_count,
    manifest_hash: result.manifest.manifest_hash
  }, null, 2));
}

module.exports = Object.freeze({
  RUNNER_PROTO,
  DEFAULT_OUTPUT_DIR,
  runLevel1Demos
});
