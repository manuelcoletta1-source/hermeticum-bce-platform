#!/usr/bin/env node
'use strict';

const fs = require('node:fs');
const path = require('node:path');

const {
  VERIFICATION_RESULT,
  verifyEvidenceBundle
} = require('../../packages/hbce-evidence/p0-evidence-bundle.js');

const REPORT_PROTO = 'HBCE-P0-VERIFICATION-REPORT-v1';

function usage() {
  return [
    'HBCE Verifier CLI P0',
    '',
    'Usage:',
    '  node apps/hbce-verifier-cli/hbce-verifier-cli.js verify BUNDLE_JSON --format json',
    '  node apps/hbce-verifier-cli/hbce-verifier-cli.js verify BUNDLE_JSON --format text',
    '',
    'Options:',
    '  --format json   Emit machine-readable JSON report. Default.',
    '  --format text   Emit human-readable report.',
    '  --json          Alias for --format json.',
    '  --text          Alias for --format text.'
  ].join('\n');
}

function parseArgs(argv) {
  const args = argv.slice(2);

  if (args.length === 0 || args.includes('--help') || args.includes('-h')) {
    return {
      command: 'help',
      format: 'text'
    };
  }

  const command = args.shift();

  if (command !== 'verify') {
    const error = new Error(`Unsupported command: ${command}`);
    error.code = 'HBCE_VERIFIER_UNSUPPORTED_COMMAND';
    throw error;
  }

  let bundlePath = null;
  let format = 'json';

  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];

    if (arg === '--json') {
      format = 'json';
      continue;
    }

    if (arg === '--text') {
      format = 'text';
      continue;
    }

    if (arg === '--format') {
      const value = args[index + 1];
      index += 1;

      if (!['json', 'text'].includes(value)) {
        const error = new Error('Unsupported format. Use json or text.');
        error.code = 'HBCE_VERIFIER_FORMAT_INVALID';
        throw error;
      }

      format = value;
      continue;
    }

    if (arg.startsWith('--')) {
      const error = new Error(`Unsupported option: ${arg}`);
      error.code = 'HBCE_VERIFIER_OPTION_INVALID';
      throw error;
    }

    if (bundlePath !== null) {
      const error = new Error('Only one bundle path is supported.');
      error.code = 'HBCE_VERIFIER_TOO_MANY_PATHS';
      throw error;
    }

    bundlePath = arg;
  }

  if (!bundlePath) {
    const error = new Error('Missing bundle path.');
    error.code = 'HBCE_VERIFIER_BUNDLE_PATH_MISSING';
    throw error;
  }

  return {
    command,
    bundlePath,
    format
  };
}

function normalizeError(error) {
  if (error && typeof error === 'object') {
    return {
      code: error.code || error.reason || error.name || 'HBCE_VERIFICATION_ERROR',
      message: error.message || String(error),
      details: error.details || error.data || null
    };
  }

  return {
    code: 'HBCE_VERIFICATION_ERROR',
    message: String(error),
    details: null
  };
}

function loadBundle(bundlePath) {
  const resolved = path.resolve(bundlePath);
  let raw;

  try {
    raw = fs.readFileSync(resolved, 'utf8');
  } catch (error) {
    const enriched = new Error(`Unable to read bundle file: ${resolved}`);
    enriched.code = 'HBCE_VERIFIER_BUNDLE_READ_FAILED';
    enriched.details = {
      path: resolved,
      cause: error.message
    };
    throw enriched;
  }

  try {
    return {
      resolved_path: resolved,
      bundle: JSON.parse(raw)
    };
  } catch (error) {
    const enriched = new Error(`Bundle file is not valid JSON: ${resolved}`);
    enriched.code = 'HBCE_VERIFIER_BUNDLE_JSON_INVALID';
    enriched.details = {
      path: resolved,
      cause: error.message
    };
    throw enriched;
  }
}

function passReport(bundlePath, verification) {
  return {
    proto: REPORT_PROTO,
    kind: 'HBCE_P0_VERIFICATION_REPORT',
    version: 'v1',
    verifier: {
      name: 'hbce-verifier-cli',
      profile: 'P0_EVIDENCE_BUNDLE',
      completeness: 'SKELETON_P0',
      verifies: [
        'evidence_bundle_shape',
        'manifest_hash',
        'evidence_bundle_hash',
        'policy_decision_hash',
        'target_receipt_hash',
        'request_policy_receipt_binding'
      ],
      does_not_claim: [
        'legal_certification',
        'regulatory_compliance',
        'physical_truth',
        'production_readiness'
      ]
    },
    input: {
      bundle_path: path.resolve(bundlePath)
    },
    result: VERIFICATION_RESULT.PASS,
    reason: verification.reason,
    bundle_id: verification.bundle_id,
    action_id: verification.action_id,
    manifest_hash: verification.manifest_hash,
    evidence_bundle_hash: verification.evidence_bundle_hash,
    target_receipt_count: verification.target_receipt_count,
    checks: [
      {
        check_id: 'BUNDLE_INTEGRITY',
        result: VERIFICATION_RESULT.PASS,
        reason: 'EvidenceBundle hash and manifest hash verified.'
      },
      {
        check_id: 'POLICY_RECEIPT_BINDING',
        result: VERIFICATION_RESULT.PASS,
        reason: 'Request, policy decision and target receipt bindings verified.'
      },
      {
        check_id: 'BOUNDARY_NO_OVERCLAIM',
        result: VERIFICATION_RESULT.PASS,
        reason: 'Bundle does not certify compliance, legal liability or physical truth.'
      }
    ],
    boundary: {
      certifies_compliance: false,
      proves_legal_liability: false,
      proves_physical_truth: false,
      production_certified: false
    }
  };
}

function failReport(bundlePath, error) {
  const normalized = normalizeError(error);

  return {
    proto: REPORT_PROTO,
    kind: 'HBCE_P0_VERIFICATION_REPORT',
    version: 'v1',
    verifier: {
      name: 'hbce-verifier-cli',
      profile: 'P0_EVIDENCE_BUNDLE',
      completeness: 'SKELETON_P0'
    },
    input: {
      bundle_path: bundlePath ? path.resolve(bundlePath) : null
    },
    result: VERIFICATION_RESULT.FAIL,
    reason: normalized.code,
    error: {
      code: normalized.code,
      message: normalized.message,
      details: normalized.details
    },
    checks: [
      {
        check_id: 'BUNDLE_VERIFICATION',
        result: VERIFICATION_RESULT.FAIL,
        reason: normalized.code
      }
    ],
    boundary: {
      certifies_compliance: false,
      proves_legal_liability: false,
      proves_physical_truth: false,
      production_certified: false
    }
  };
}

function formatJson(report) {
  return `${JSON.stringify(report, null, 2)}\n`;
}

function formatText(report) {
  const lines = [
    'HBCE Verifier CLI P0',
    `result: ${report.result}`,
    `reason: ${report.reason}`
  ];

  if (report.bundle_id) {
    lines.push(`bundle_id: ${report.bundle_id}`);
  }

  if (report.action_id) {
    lines.push(`action_id: ${report.action_id}`);
  }

  if (report.manifest_hash) {
    lines.push(`manifest_hash: ${report.manifest_hash}`);
  }

  if (report.evidence_bundle_hash) {
    lines.push(`evidence_bundle_hash: ${report.evidence_bundle_hash}`);
  }

  if (report.error) {
    lines.push(`error_code: ${report.error.code}`);
    lines.push(`error_message: ${report.error.message}`);
  }

  lines.push('boundary: supports evidence verification; does not certify compliance, legal liability, physical truth or production readiness.');

  return `${lines.join('\n')}\n`;
}

function formatReport(report, format) {
  if (format === 'text') {
    return formatText(report);
  }

  return formatJson(report);
}

function run(argv, io = process) {
  let parsed;

  try {
    parsed = parseArgs(argv);

    if (parsed.command === 'help') {
      io.stdout.write(`${usage()}\n`);
      return 0;
    }

    const loaded = loadBundle(parsed.bundlePath);
    const verification = verifyEvidenceBundle(loaded.bundle);
    const report = passReport(loaded.resolved_path, verification);

    io.stdout.write(formatReport(report, parsed.format));
    return 0;
  } catch (error) {
    const format = parsed && parsed.format ? parsed.format : 'json';
    const bundlePath = parsed && parsed.bundlePath ? parsed.bundlePath : null;
    const report = failReport(bundlePath, error);

    io.stdout.write(formatReport(report, format));
    return 2;
  }
}

if (require.main === module) {
  process.exitCode = run(process.argv, process);
}

module.exports = Object.freeze({
  REPORT_PROTO,
  usage,
  parseArgs,
  loadBundle,
  passReport,
  failReport,
  formatJson,
  formatText,
  run
});
