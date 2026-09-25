'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { spawnSync } = require('node:child_process');

const { sha256Digest } = require('../../../packages/hbce-core/canonical-json.js');
const {
  REQUEST_ENVELOPE_SCHEMA_VERSION,
  enrichRequestEnvelope
} = require('../../../packages/hbce-api-contract/request-envelope.js');
const {
  POLICY_DECISION,
  REQUIRED_CONTROL,
  createPolicyDecision
} = require('../../../packages/hbce-policy/p0-policy-decision.js');
const {
  TARGET_RECEIPT_STATUS,
  createTargetReceipt
} = require('../../../packages/hbce-targets/p0-target-receipt.js');
const {
  createEvidenceBundle
} = require('../../../packages/hbce-evidence/p0-evidence-bundle.js');

const repoRoot = path.resolve(__dirname, '../../..');
const cliPath = path.join(repoRoot, 'apps/hbce-verifier-cli/hbce-verifier-cli.js');

function makeBundle() {
  const actionBinding = {
    action_id: 'ACTION-P0-CLI-AI-TOOL-ACCESS',
    action_class: 'AI_TOOL_ACCESS',
    action_version: 'v1'
  };

  const requestEnvelope = enrichRequestEnvelope({
    schema_version: REQUEST_ENVELOPE_SCHEMA_VERSION,
    request_id: 'REQ-P0-CLI-0001',
    idempotency_key: 'IDEM-P0-CLI-0001',
    created_at: '2026-09-25T13:00:00.000Z',
    actor_ref: {
      actor_id: 'ACTOR-P0-CLI-001',
      actor_type: 'human',
      session_id: 'SESSION-P0-CLI-001'
    },
    authority_ref: {
      authority_id: 'AUT-P0-CLI-001',
      authority_version: '1',
      authority_hash: sha256Digest({
        authority_id: 'AUT-P0-CLI-001',
        authority_version: 1,
        state: 'ACTIVE'
      })
    },
    action_binding: {
      ...actionBinding,
      action_hash: sha256Digest(actionBinding)
    },
    target_ref: {
      target_id: 'TARGET-P0-CLI-TOOL',
      target_type: 'mock_tool'
    },
    request_payload_hash: sha256Digest({
      tool: 'repo.read',
      path: 'README.md'
    })
  });

  const policyDecision = createPolicyDecision({
    decision_id: 'POLDEC-P0-CLI-0001',
    action_id: 'ACTION-P0-CLI-AI-TOOL-ACCESS',
    policy_version: 'POLICY-P0-CLI-2026-09-25',
    evaluated_at: '2026-09-25T13:01:00.000Z',
    request_hash: requestEnvelope.request_hash,
    input_facts: {
      action_class: 'AI_TOOL_ACCESS',
      target_id: 'TARGET-P0-CLI-TOOL',
      risk_class: 'MEDIUM'
    },
    decision: POLICY_DECISION.ALLOW,
    rule_ids: ['AI_TOOL_SCOPE_MATCH', 'TARGET_ALLOWED', 'RISK_CLASS_ACCEPTED'],
    denial_reasons: [],
    required_controls: [
      REQUIRED_CONTROL.HUMAN_APPROVAL,
      REQUIRED_CONTROL.PRECOMMIT,
      REQUIRED_CONTROL.TARGET_RECEIPT,
      REQUIRED_CONTROL.REVOCATION_CHECK
    ]
  });

  const precommitPayload = {
    action_id: 'ACTION-P0-CLI-AI-TOOL-ACCESS',
    request_hash: requestEnvelope.request_hash,
    policy_decision_hash: policyDecision.policy_decision_hash,
    scope_hash: sha256Digest({
      allowed_targets: ['TARGET-P0-CLI-TOOL'],
      allowed_actions: ['repo.read']
    })
  };

  const precommitHash = sha256Digest(precommitPayload);

  const criticalActionBody = {
    proto: 'HBCE-P0-CRITICAL-ACTION-v1',
    kind: 'HBCE_P0_CRITICAL_ACTION',
    action_id: 'ACTION-P0-CLI-AI-TOOL-ACCESS',
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
    event_id: 'EVT-P0-CLI-0001',
    event_type: 'REQUEST_RECORDED',
    sequence_number: 1,
    previous_event_hash: null,
    payload_hash: requestEnvelope.request_hash,
    emitted_at: '2026-09-25T13:01:10.000Z'
  };

  const eventOne = {
    ...eventOneBody,
    event_hash: sha256Digest(eventOneBody)
  };

  const eventTwoBody = {
    event_id: 'EVT-P0-CLI-0002',
    event_type: 'PRECOMMIT_RECORDED',
    sequence_number: 2,
    previous_event_hash: eventOne.event_hash,
    payload_hash: precommitHash,
    emitted_at: '2026-09-25T13:01:20.000Z'
  };

  const eventTwo = {
    ...eventTwoBody,
    event_hash: sha256Digest(eventTwoBody)
  };

  const eventChainBody = {
    proto: 'HBCE-P0-EVENT-CHAIN-v1',
    kind: 'HBCE_P0_EVENT_CHAIN',
    chain_id: 'CHAIN-P0-CLI-0001',
    action_id: 'ACTION-P0-CLI-AI-TOOL-ACCESS',
    events: [eventOne, eventTwo],
    event_head_hash: eventTwo.event_hash
  };

  const eventChain = {
    ...eventChainBody,
    event_chain_hash: sha256Digest(eventChainBody)
  };

  const targetReceipt = createTargetReceipt({
    receipt_id: 'RCPT-P0-CLI-0001',
    received_at: '2026-09-25T13:02:00.000Z',
    request_hash: requestEnvelope.request_hash,
    critical_action_hash: criticalAction.critical_action_hash,
    precommit_hash: criticalAction.precommit_hash,
    event_chain_hash: eventChain.event_chain_hash,
    event_head_hash: eventChain.event_head_hash,
    target_observation_hash: sha256Digest({
      target_id: 'TARGET-P0-CLI-TOOL',
      observed_state: 'completed'
    }),
    raw_receipt_hash: sha256Digest({
      target_transaction_id: 'TXN-P0-CLI-0001',
      status: 'completed'
    }),
    target_ref: {
      target_id: 'TARGET-P0-CLI-TOOL',
      target_type: 'mock_tool'
    },
    target_status: TARGET_RECEIPT_STATUS.ACKNOWLEDGED
  });

  return createEvidenceBundle({
    bundle_id: 'BUNDLE-P0-CLI-0001',
    action_id: 'ACTION-P0-CLI-AI-TOOL-ACCESS',
    created_at: '2026-09-25T13:03:00.000Z',
    request_envelope: requestEnvelope,
    policy_decision: policyDecision,
    critical_action: criticalAction,
    event_chain: eventChain,
    target_receipts: [targetReceipt],
    schema_set: [
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
    ],
    verification_profile: {
      profile_id: 'LEVEL1-B2B-DEMO',
      profile_version: 'v1',
      result_policy: 'PASS_FAIL_WARN',
      requires_verifier_cli: true
    },
    redaction_profile: {
      profile_id: 'DEMO-MINIMAL',
      profile_version: 'v1',
      mode: 'hashes_and_operational_identifiers_only'
    }
  });
}

const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'hbce-prog-012-'));
const validBundlePath = path.join(tmpDir, 'valid-bundle.json');
const invalidBundlePath = path.join(tmpDir, 'invalid-bundle.json');

const validBundle = makeBundle();
fs.writeFileSync(validBundlePath, JSON.stringify(validBundle, null, 2), 'utf8');

const invalidBundle = {
  ...validBundle,
  manifest_hash: `sha256:${'0'.repeat(64)}`
};
fs.writeFileSync(invalidBundlePath, JSON.stringify(invalidBundle, null, 2), 'utf8');

const jsonPass = spawnSync(
  process.execPath,
  [cliPath, 'verify', validBundlePath, '--format', 'json'],
  {
    cwd: repoRoot,
    encoding: 'utf8'
  }
);

assert.equal(jsonPass.status, 0, jsonPass.stderr || jsonPass.stdout);
const jsonPassReport = JSON.parse(jsonPass.stdout);
assert.equal(jsonPassReport.proto, 'HBCE-P0-VERIFICATION-REPORT-v1');
assert.equal(jsonPassReport.result, 'PASS');
assert.equal(jsonPassReport.reason, 'EVIDENCE_BUNDLE_VALID');
assert.equal(jsonPassReport.bundle_id, 'BUNDLE-P0-CLI-0001');
assert.equal(jsonPassReport.boundary.certifies_compliance, false);
assert.equal(jsonPassReport.boundary.proves_legal_liability, false);
assert.equal(jsonPassReport.boundary.proves_physical_truth, false);
assert.equal(jsonPassReport.boundary.production_certified, false);

const textPass = spawnSync(
  process.execPath,
  [cliPath, 'verify', validBundlePath, '--format', 'text'],
  {
    cwd: repoRoot,
    encoding: 'utf8'
  }
);

assert.equal(textPass.status, 0, textPass.stderr || textPass.stdout);
assert.match(textPass.stdout, /HBCE Verifier CLI P0/);
assert.match(textPass.stdout, /result: PASS/);
assert.match(textPass.stdout, /bundle_id: BUNDLE-P0-CLI-0001/);
assert.match(textPass.stdout, /does not certify compliance/);

const jsonFail = spawnSync(
  process.execPath,
  [cliPath, 'verify', invalidBundlePath, '--format', 'json'],
  {
    cwd: repoRoot,
    encoding: 'utf8'
  }
);

assert.equal(jsonFail.status, 2, jsonFail.stderr || jsonFail.stdout);
const jsonFailReport = JSON.parse(jsonFail.stdout);
assert.equal(jsonFailReport.result, 'FAIL');
assert.ok(
  [
    'EVIDENCE_BUNDLE_MANIFEST_HASH_MISMATCH',
    'EVIDENCE_BUNDLE_MANIFEST_OBJECT_MISMATCH',
    'EVIDENCE_BUNDLE_HASH_MISMATCH',
    'HBCE_VERIFICATION_ERROR'
  ].includes(jsonFailReport.reason),
  `unexpected fail reason: ${jsonFailReport.reason}`
);
assert.equal(jsonFailReport.boundary.certifies_compliance, false);
assert.equal(jsonFailReport.boundary.proves_legal_liability, false);
assert.equal(jsonFailReport.boundary.proves_physical_truth, false);

const missingPath = path.join(tmpDir, 'missing.json');
const missingFail = spawnSync(
  process.execPath,
  [cliPath, 'verify', missingPath, '--format', 'json'],
  {
    cwd: repoRoot,
    encoding: 'utf8'
  }
);

assert.equal(missingFail.status, 2, missingFail.stderr || missingFail.stdout);
const missingFailReport = JSON.parse(missingFail.stdout);
assert.equal(missingFailReport.result, 'FAIL');
assert.equal(missingFailReport.reason, 'HBCE_VERIFIER_BUNDLE_READ_FAILED');

const help = spawnSync(
  process.execPath,
  [cliPath, '--help'],
  {
    cwd: repoRoot,
    encoding: 'utf8'
  }
);

assert.equal(help.status, 0, help.stderr || help.stdout);
assert.match(help.stdout, /Usage:/);
assert.match(help.stdout, /verify BUNDLE_JSON/);

console.log('PASS PROG-012-VERIFIER-CLI-JSON-PASS');
console.log('PASS PROG-012-VERIFIER-CLI-TEXT-PASS');
console.log('PASS PROG-012-VERIFIER-CLI-JSON-FAIL-WITH-REASON');
console.log('PASS PROG-012-VERIFIER-CLI-MISSING-BUNDLE-FAILS');
console.log('PASS PROG-012-VERIFIER-CLI-DOES-NOT-CERTIFY-LEGAL-OR-COMPLIANCE');
