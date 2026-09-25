'use strict';

const fs = require('node:fs');
const path = require('node:path');
const { spawnSync } = require('node:child_process');

const { sha256Digest } = require('../../packages/hbce-core/canonical-json.js');
const {
  REQUEST_ENVELOPE_SCHEMA_VERSION,
  enrichRequestEnvelope
} = require('../../packages/hbce-api-contract/request-envelope.js');
const {
  POLICY_DECISION,
  REQUIRED_CONTROL,
  createPolicyDecision
} = require('../../packages/hbce-policy/p0-policy-decision.js');
const {
  TARGET_RECEIPT_STATUS,
  createTargetReceipt
} = require('../../packages/hbce-targets/p0-target-receipt.js');
const {
  createEvidenceBundle
} = require('../../packages/hbce-evidence/p0-evidence-bundle.js');

const repoRoot = path.resolve(__dirname, '../..');
const samplesDir = path.join(repoRoot, 'evidence/samples/level1');
const reportsDir = path.join(repoRoot, 'evidence/reports/level1');
const verifierCli = path.join(repoRoot, 'apps/hbce-verifier-cli/hbce-verifier-cli.js');

function ensureDirs() {
  fs.mkdirSync(samplesDir, { recursive: true });
  fs.mkdirSync(reportsDir, { recursive: true });
}

function writeJson(filePath, value) {
  fs.writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`, 'utf8');
}

function schemaSet() {
  return [
    {
      schema_id: 'hbce.request_envelope',
      schema_version: 'v1',
      schema_hash: sha256Digest({ schema: 'request_envelope', version: 'v1' })
    },
    {
      schema_id: 'hbce.policy_decision',
      schema_version: 'v1',
      schema_hash: sha256Digest({ schema: 'policy_decision', version: 'v1' })
    },
    {
      schema_id: 'hbce.target_receipt',
      schema_version: 'v1',
      schema_hash: sha256Digest({ schema: 'target_receipt', version: 'v1' })
    },
    {
      schema_id: 'hbce.evidence_bundle',
      schema_version: 'v1',
      schema_hash: sha256Digest({ schema: 'evidence_bundle', version: 'v1' })
    }
  ];
}

function verificationProfile(profileId) {
  return {
    profile_id: profileId,
    profile_version: 'v1',
    result_policy: 'PASS_FAIL_WARN',
    requires_verifier_cli: true
  };
}

function redactionProfile() {
  return {
    profile_id: 'DEMO-MINIMAL',
    profile_version: 'v1',
    mode: 'hashes_and_operational_identifiers_only'
  };
}

function makeBundle(config) {
  const actionBinding = {
    action_id: config.action_id,
    action_class: config.action_class,
    action_version: 'v1'
  };

  const requestEnvelope = enrichRequestEnvelope({
    schema_version: REQUEST_ENVELOPE_SCHEMA_VERSION,
    request_id: config.request_id,
    idempotency_key: config.idempotency_key,
    created_at: config.request_created_at,
    actor_ref: {
      actor_id: config.actor_id,
      actor_type: 'human',
      session_id: config.session_id
    },
    authority_ref: {
      authority_id: config.authority_id,
      authority_version: '1',
      authority_hash: sha256Digest({
        authority_id: config.authority_id,
        authority_version: 1,
        state: 'ACTIVE'
      })
    },
    action_binding: {
      ...actionBinding,
      action_hash: sha256Digest(actionBinding)
    },
    target_ref: {
      target_id: config.target_id,
      target_type: config.target_type
    },
    request_payload_hash: sha256Digest(config.request_payload)
  });

  const policyDecision = createPolicyDecision({
    decision_id: config.decision_id,
    action_id: config.action_id,
    policy_version: config.policy_version,
    evaluated_at: config.policy_evaluated_at,
    request_hash: requestEnvelope.request_hash,
    input_facts: {
      action_class: config.action_class,
      target_id: config.target_id,
      risk_class: config.risk_class
    },
    decision: config.decision,
    rule_ids: config.rule_ids,
    denial_reasons: config.denial_reasons,
    required_controls: config.required_controls
  });

  const precommitPayload = {
    action_id: config.action_id,
    request_hash: requestEnvelope.request_hash,
    policy_decision_hash: policyDecision.policy_decision_hash,
    scope_hash: sha256Digest({
      allowed_targets: [config.target_id],
      allowed_actions: [config.action_name]
    })
  };

  const precommitHash = sha256Digest(precommitPayload);

  const criticalActionBody = {
    proto: 'HBCE-P0-CRITICAL-ACTION-v1',
    kind: 'HBCE_P0_CRITICAL_ACTION',
    action_id: config.action_id,
    state: 'PRECOMMITTED',
    request_hash: requestEnvelope.request_hash,
    policy_decision_hash: policyDecision.policy_decision_hash,
    precommit_hash: precommitHash,
    dispatch_created: false,
    physical_execution_performed: false
  };

  const criticalAction = {
    ...criticalActionBody,
    critical_action_hash: sha256Digest(criticalActionBody)
  };

  const eventOneBody = {
    event_id: `${config.event_prefix}-0001`,
    event_type: 'REQUEST_RECORDED',
    sequence_number: 1,
    previous_event_hash: null,
    payload_hash: requestEnvelope.request_hash,
    emitted_at: config.event_one_at
  };

  const eventOne = {
    ...eventOneBody,
    event_hash: sha256Digest(eventOneBody)
  };

  const eventTwoBody = {
    event_id: `${config.event_prefix}-0002`,
    event_type: 'PRECOMMIT_RECORDED',
    sequence_number: 2,
    previous_event_hash: eventOne.event_hash,
    payload_hash: precommitHash,
    emitted_at: config.event_two_at
  };

  const eventTwo = {
    ...eventTwoBody,
    event_hash: sha256Digest(eventTwoBody)
  };

  const eventChainBody = {
    proto: 'HBCE-P0-EVENT-CHAIN-v1',
    kind: 'HBCE_P0_EVENT_CHAIN',
    chain_id: config.chain_id,
    action_id: config.action_id,
    events: [eventOne, eventTwo],
    event_head_hash: eventTwo.event_hash
  };

  const eventChain = {
    ...eventChainBody,
    event_chain_hash: sha256Digest(eventChainBody)
  };

  const targetReceipt = createTargetReceipt({
    receipt_id: config.receipt_id,
    received_at: config.receipt_received_at,
    request_hash: requestEnvelope.request_hash,
    critical_action_hash: criticalAction.critical_action_hash,
    precommit_hash: criticalAction.precommit_hash,
    event_chain_hash: eventChain.event_chain_hash,
    event_head_hash: eventChain.event_head_hash,
    target_observation_hash: sha256Digest({
      target_id: config.target_id,
      observed_state: config.observed_state
    }),
    raw_receipt_hash: sha256Digest({
      target_transaction_id: config.target_transaction_id,
      status: config.observed_state
    }),
    target_ref: {
      target_id: config.target_id,
      target_type: config.target_type
    },
    target_status: TARGET_RECEIPT_STATUS.ACKNOWLEDGED
  });

  return createEvidenceBundle({
    bundle_id: config.bundle_id,
    action_id: config.action_id,
    created_at: config.bundle_created_at,
    request_envelope: requestEnvelope,
    policy_decision: policyDecision,
    critical_action: criticalAction,
    event_chain: eventChain,
    target_receipts: [targetReceipt],
    schema_set: schemaSet(),
    verification_profile: verificationProfile(config.verification_profile_id),
    redaction_profile: redactionProfile()
  });
}

function baseConfigs() {
  return [
    {
      name: 'pass-ai-tool-access',
      bundle_id: 'BUNDLE-L1-PASS-AI-TOOL-001',
      action_id: 'ACTION-L1-AI-TOOL-001',
      action_class: 'AI_TOOL_ACCESS',
      action_name: 'repo.read',
      request_id: 'REQ-L1-AI-TOOL-001',
      idempotency_key: 'IDEM-L1-AI-TOOL-001',
      request_created_at: '2026-09-25T14:00:00.000Z',
      actor_id: 'ACTOR-L1-AI-REVIEWER-001',
      session_id: 'SESSION-L1-AI-001',
      authority_id: 'AUT-L1-AI-001',
      target_id: 'TARGET-L1-MOCK-REPO-001',
      target_type: 'mock_repository',
      request_payload: { tool: 'repo.read', path: 'README.md' },
      decision_id: 'POLDEC-L1-AI-001',
      policy_version: 'POLICY-L1-AI-2026-09-25',
      policy_evaluated_at: '2026-09-25T14:01:00.000Z',
      risk_class: 'MEDIUM',
      decision: POLICY_DECISION.ALLOW,
      rule_ids: ['AI_TOOL_SCOPE_MATCH', 'TARGET_ALLOWED', 'RISK_CLASS_ACCEPTED'],
      denial_reasons: [],
      required_controls: [
        REQUIRED_CONTROL.HUMAN_APPROVAL,
        REQUIRED_CONTROL.PRECOMMIT,
        REQUIRED_CONTROL.TARGET_RECEIPT,
        REQUIRED_CONTROL.REVOCATION_CHECK
      ],
      event_prefix: 'EVT-L1-AI',
      event_one_at: '2026-09-25T14:01:10.000Z',
      event_two_at: '2026-09-25T14:01:20.000Z',
      chain_id: 'CHAIN-L1-AI-001',
      receipt_id: 'RCPT-L1-AI-001',
      receipt_received_at: '2026-09-25T14:02:00.000Z',
      observed_state: 'completed',
      target_transaction_id: 'TXN-L1-AI-001',
      bundle_created_at: '2026-09-25T14:03:00.000Z',
      verification_profile_id: 'LEVEL1-B2B-AI-TOOL-DEMO'
    },
    {
      name: 'pass-bank-cyber-dual-control',
      bundle_id: 'BUNDLE-L1-PASS-BANK-001',
      action_id: 'ACTION-L1-BANK-CRITICAL-001',
      action_class: 'BANK_CRITICAL_ACTION',
      action_name: 'risk.threshold.update',
      request_id: 'REQ-L1-BANK-001',
      idempotency_key: 'IDEM-L1-BANK-001',
      request_created_at: '2026-09-25T14:10:00.000Z',
      actor_id: 'ACTOR-L1-RISK-OPERATOR-001',
      session_id: 'SESSION-L1-BANK-001',
      authority_id: 'AUT-L1-BANK-001',
      target_id: 'TARGET-L1-MOCK-RISK-ENGINE-001',
      target_type: 'mock_bank_risk_engine',
      request_payload: { operation: 'risk.threshold.update', threshold: 'demo_only' },
      decision_id: 'POLDEC-L1-BANK-001',
      policy_version: 'POLICY-L1-BANK-2026-09-25',
      policy_evaluated_at: '2026-09-25T14:11:00.000Z',
      risk_class: 'HIGH',
      decision: POLICY_DECISION.DUAL_CONTROL_REQUIRED,
      rule_ids: ['HIGH_RISK_REQUIRES_DUAL_CONTROL', 'TARGET_ALLOWED', 'REVOCATION_CHECK_REQUIRED'],
      denial_reasons: [],
      required_controls: [
        REQUIRED_CONTROL.DUAL_CONTROL,
        REQUIRED_CONTROL.PRECOMMIT,
        REQUIRED_CONTROL.TARGET_RECEIPT,
        REQUIRED_CONTROL.REVOCATION_CHECK
      ],
      event_prefix: 'EVT-L1-BANK',
      event_one_at: '2026-09-25T14:11:10.000Z',
      event_two_at: '2026-09-25T14:11:20.000Z',
      chain_id: 'CHAIN-L1-BANK-001',
      receipt_id: 'RCPT-L1-BANK-001',
      receipt_received_at: '2026-09-25T14:12:00.000Z',
      observed_state: 'completed',
      target_transaction_id: 'TXN-L1-BANK-001',
      bundle_created_at: '2026-09-25T14:13:00.000Z',
      verification_profile_id: 'LEVEL1-B2B-BANK-CYBER-DEMO'
    },
    {
      name: 'pass-cloud-guarded-change',
      bundle_id: 'BUNDLE-L1-PASS-CLOUD-001',
      action_id: 'ACTION-L1-CLOUD-GUARD-001',
      action_class: 'P0_TEST_ACTION',
      action_name: 'policy.patch',
      request_id: 'REQ-L1-CLOUD-001',
      idempotency_key: 'IDEM-L1-CLOUD-001',
      request_created_at: '2026-09-25T14:20:00.000Z',
      actor_id: 'ACTOR-L1-PLATFORM-001',
      session_id: 'SESSION-L1-CLOUD-001',
      authority_id: 'AUT-L1-CLOUD-001',
      target_id: 'TARGET-L1-MOCK-CLOUD-POLICY-001',
      target_type: 'mock_cloud_policy',
      request_payload: { operation: 'policy.patch', environment: 'demo' },
      decision_id: 'POLDEC-L1-CLOUD-001',
      policy_version: 'POLICY-L1-CLOUD-2026-09-25',
      policy_evaluated_at: '2026-09-25T14:21:00.000Z',
      risk_class: 'MEDIUM',
      decision: POLICY_DECISION.ALLOW,
      rule_ids: ['CLOUD_SCOPE_MATCH', 'TARGET_ALLOWED', 'CHANGE_WINDOW_ACTIVE'],
      denial_reasons: [],
      required_controls: [
        REQUIRED_CONTROL.HUMAN_APPROVAL,
        REQUIRED_CONTROL.PRECOMMIT,
        REQUIRED_CONTROL.TARGET_RECEIPT
      ],
      event_prefix: 'EVT-L1-CLOUD',
      event_one_at: '2026-09-25T14:21:10.000Z',
      event_two_at: '2026-09-25T14:21:20.000Z',
      chain_id: 'CHAIN-L1-CLOUD-001',
      receipt_id: 'RCPT-L1-CLOUD-001',
      receipt_received_at: '2026-09-25T14:22:00.000Z',
      observed_state: 'completed',
      target_transaction_id: 'TXN-L1-CLOUD-001',
      bundle_created_at: '2026-09-25T14:23:00.000Z',
      verification_profile_id: 'LEVEL1-B2B-CLOUD-DEMO'
    }
  ];
}

function deepClone(value) {
  return JSON.parse(JSON.stringify(value));
}

function makeFailFixtures(validBundle) {
  const fixtures = [];

  const manifestMismatch = deepClone(validBundle);
  manifestMismatch.manifest_hash = `sha256:${'0'.repeat(64)}`;
  fixtures.push({
    name: 'fail-manifest-hash-mismatch',
    bundle: manifestMismatch
  });

  const bundleHashMismatch = deepClone(validBundle);
  bundleHashMismatch.evidence_bundle_hash = `sha256:${'1'.repeat(64)}`;
  fixtures.push({
    name: 'fail-evidence-bundle-hash-mismatch',
    bundle: bundleHashMismatch
  });

  const policyTampered = deepClone(validBundle);
  policyTampered.policy_decision.required_controls = ['HUMAN_APPROVAL', 'PRECOMMIT'];
  fixtures.push({
    name: 'fail-policy-decision-tampered',
    bundle: policyTampered
  });

  const receiptRequestMismatch = deepClone(validBundle);
  receiptRequestMismatch.target_receipts[0].request_hash = sha256Digest({ forged: 'request_hash' });
  fixtures.push({
    name: 'fail-receipt-request-hash-mismatch',
    bundle: receiptRequestMismatch
  });

  const missingReceipts = deepClone(validBundle);
  missingReceipts.target_receipts = [];
  fixtures.push({
    name: 'fail-missing-target-receipt',
    bundle: missingReceipts
  });

  return fixtures;
}

function runVerifier(sampleName, samplePath) {
  const reportPath = path.join(reportsDir, `${sampleName}.verification-report.json`);

  const result = spawnSync(
    process.execPath,
    [verifierCli, 'verify', samplePath, '--format', 'json'],
    {
      cwd: repoRoot,
      encoding: 'utf8'
    }
  );

  fs.writeFileSync(reportPath, result.stdout, 'utf8');

  if (result.error) {
    throw result.error;
  }

  const report = JSON.parse(result.stdout);

  return {
    status: result.status,
    report_path: reportPath,
    result: report.result,
    reason: report.reason
  };
}

function main() {
  ensureDirs();

  const passBundles = baseConfigs().map((config) => ({
    name: config.name,
    bundle: makeBundle(config)
  }));

  const failBundles = makeFailFixtures(passBundles[0].bundle);

  const manifest = {
    proto: 'HBCE-P0-SAMPLE-EVIDENCE-BUNDLE-MANIFEST-v1',
    generated_at: '2026-09-25T14:30:00.000Z',
    pass_count: passBundles.length,
    fail_count: failBundles.length,
    samples: []
  };

  for (const entry of passBundles) {
    const samplePath = path.join(samplesDir, `${entry.name}.json`);
    writeJson(samplePath, entry.bundle);

    const verification = runVerifier(entry.name, samplePath);

    if (verification.status !== 0 || verification.result !== 'PASS') {
      throw new Error(`PASS fixture did not verify as PASS: ${entry.name}`);
    }

    manifest.samples.push({
      name: entry.name,
      expected_result: 'PASS',
      sample_path: path.relative(repoRoot, samplePath),
      report_path: path.relative(repoRoot, verification.report_path),
      reason: verification.reason
    });
  }

  for (const entry of failBundles) {
    const samplePath = path.join(samplesDir, `${entry.name}.json`);
    writeJson(samplePath, entry.bundle);

    const verification = runVerifier(entry.name, samplePath);

    if (verification.status !== 2 || verification.result !== 'FAIL') {
      throw new Error(`FAIL fixture did not verify as FAIL: ${entry.name}`);
    }

    manifest.samples.push({
      name: entry.name,
      expected_result: 'FAIL',
      sample_path: path.relative(repoRoot, samplePath),
      report_path: path.relative(repoRoot, verification.report_path),
      reason: verification.reason
    });
  }

  manifest.manifest_hash = sha256Digest({
    generated_at: manifest.generated_at,
    pass_count: manifest.pass_count,
    fail_count: manifest.fail_count,
    samples: manifest.samples
  });

  writeJson(path.join(samplesDir, 'sample-manifest.json'), manifest);

  fs.writeFileSync(
    path.join(samplesDir, 'README.md'),
    [
      '# HBCE Level 1 sample EvidenceBundle fixtures',
      '',
      'Generated by scripts/ftel/generate-prog-013-sample-bundles.js.',
      '',
      'Contents:',
      '',
      '- 3 PASS EvidenceBundle fixtures',
      '- 5 FAIL EvidenceBundle fixtures',
      '- verifier JSON reports under evidence/reports/level1',
      '',
      'Boundary:',
      '',
      '- fixtures support technical verification demos',
      '- fixtures do not certify compliance',
      '- fixtures do not prove legal liability',
      '- fixtures do not prove physical truth',
      '- fixtures contain no pricing logic or procurement offer',
      ''
    ].join('\n'),
    'utf8'
  );

  console.log('PROG_013_SAMPLE_BUNDLES_GENERATED=PASS');
  console.log(`PROG_013_PASS_FIXTURES=${passBundles.length}`);
  console.log(`PROG_013_FAIL_FIXTURES=${failBundles.length}`);
}

main();
