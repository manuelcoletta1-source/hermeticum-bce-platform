'use strict';

const { sha256Digest } = require('../hbce-core/canonical-json.js');
const { failClosed } = require('../hbce-api-contract/errors.js');
const { verifyPolicyDecision } = require('../hbce-policy/p0-policy-decision.js');
const { verifyTargetReceipt } = require('../hbce-targets/p0-target-receipt.js');

const EVIDENCE_BUNDLE_STATE = Object.freeze({
  VALID: 'VALID',
  INVALID: 'INVALID'
});

const VERIFICATION_RESULT = Object.freeze({
  PASS: 'PASS',
  FAIL: 'FAIL',
  WARN: 'WARN',
  UNVERIFIED_EXPORT: 'UNVERIFIED_EXPORT'
});

const DIGEST_RE = /^sha256:[a-f0-9]{64}$/;
const ID_RE = /^[A-Za-z0-9][A-Za-z0-9._:-]{2,159}$/;
const TOKEN_RE = /^[A-Za-z0-9][A-Za-z0-9._:-]{1,159}$/;
const ISO_UTC_RE = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{3})?Z$/;

function isPlainObject(value) {
  if (value === null || typeof value !== 'object' || Array.isArray(value)) {
    return false;
  }

  const proto = Object.getPrototypeOf(value);
  return proto === Object.prototype || proto === null;
}

function deepCloneJson(value) {
  return JSON.parse(JSON.stringify(value));
}

function deepFreeze(value) {
  if (value && typeof value === 'object') {
    Object.freeze(value);

    for (const key of Object.keys(value)) {
      deepFreeze(value[key]);
    }
  }

  return value;
}

function assertPlainObject(value, path) {
  if (!isPlainObject(value)) {
    failClosed('EVIDENCE_BUNDLE_OBJECT_INVALID', `${path} must be a plain object`, { path });
  }
}

function assertPattern(value, pattern, code, path) {
  if (typeof value !== 'string' || !pattern.test(value)) {
    failClosed(code, `${path} has invalid format`, { path });
  }
}

function assertId(value, path) {
  assertPattern(value, ID_RE, 'EVIDENCE_BUNDLE_ID_INVALID', path);
}

function assertToken(value, path) {
  assertPattern(value, TOKEN_RE, 'EVIDENCE_BUNDLE_TOKEN_INVALID', path);
}

function assertDigest(value, path) {
  assertPattern(value, DIGEST_RE, 'EVIDENCE_BUNDLE_DIGEST_INVALID', path);
}

function assertTimestamp(value, path) {
  assertPattern(value, ISO_UTC_RE, 'EVIDENCE_BUNDLE_TIMESTAMP_INVALID', path);

  if (Number.isNaN(Date.parse(value))) {
    failClosed('EVIDENCE_BUNDLE_TIMESTAMP_INVALID', `${path} is not parseable`, { path });
  }
}

function getDigestField(object, fieldNames, path) {
  assertPlainObject(object, path);

  for (const fieldName of fieldNames) {
    if (typeof object[fieldName] === 'string') {
      assertDigest(object[fieldName], `${path}.${fieldName}`);
      return object[fieldName];
    }
  }

  failClosed('EVIDENCE_BUNDLE_DIGEST_FIELD_MISSING', `${path} digest field is missing`, {
    path,
    field_names: fieldNames
  });
}

function normalizeSchemaSet(schemaSet) {
  if (!Array.isArray(schemaSet) || schemaSet.length === 0) {
    failClosed('EVIDENCE_BUNDLE_SCHEMA_SET_INVALID', 'schema_set must be a non-empty array');
  }

  const seen = new Set();

  return schemaSet.map((entry, index) => {
    assertPlainObject(entry, `schema_set[${index}]`);
    assertToken(entry.schema_id, `schema_set[${index}].schema_id`);
    assertToken(entry.schema_version, `schema_set[${index}].schema_version`);
    assertDigest(entry.schema_hash, `schema_set[${index}].schema_hash`);

    const key = `${entry.schema_id}@${entry.schema_version}`;

    if (seen.has(key)) {
      failClosed('EVIDENCE_BUNDLE_SCHEMA_SET_DUPLICATE', 'schema_set contains duplicate schema', {
        schema: key
      });
    }

    seen.add(key);

    return {
      schema_id: entry.schema_id,
      schema_version: entry.schema_version,
      schema_hash: entry.schema_hash
    };
  });
}

function normalizeProfile(profile, path) {
  assertPlainObject(profile, path);
  assertToken(profile.profile_id, `${path}.profile_id`);
  assertToken(profile.profile_version, `${path}.profile_version`);

  return deepCloneJson(profile);
}

function assertRequestEnvelope(requestEnvelope) {
  assertPlainObject(requestEnvelope, 'request_envelope');
  assertId(requestEnvelope.request_id, 'request_envelope.request_id');
  assertDigest(requestEnvelope.request_hash, 'request_envelope.request_hash');

  return requestEnvelope.request_hash;
}

function assertCriticalAction(criticalAction) {
  assertPlainObject(criticalAction, 'critical_action');

  const criticalActionHash = getDigestField(
    criticalAction,
    ['critical_action_hash', 'action_hash'],
    'critical_action'
  );

  const precommitHash = getDigestField(
    criticalAction,
    ['precommit_hash'],
    'critical_action'
  );

  return {
    critical_action_hash: criticalActionHash,
    precommit_hash: precommitHash
  };
}

function assertEventChain(eventChain) {
  assertPlainObject(eventChain, 'event_chain');

  const eventChainHash = getDigestField(
    eventChain,
    ['event_chain_hash', 'chain_hash'],
    'event_chain'
  );

  const eventHeadHash = getDigestField(
    eventChain,
    ['event_head_hash', 'head_event_hash'],
    'event_chain'
  );

  if (!Array.isArray(eventChain.events)) {
    failClosed('EVIDENCE_BUNDLE_EVENT_CHAIN_EVENTS_INVALID', 'event_chain.events must be an array');
  }

  return {
    event_chain_hash: eventChainHash,
    event_head_hash: eventHeadHash,
    event_count: eventChain.events.length
  };
}

function normalizeTargetReceipts(targetReceipts) {
  if (!Array.isArray(targetReceipts) || targetReceipts.length === 0) {
    failClosed('EVIDENCE_BUNDLE_TARGET_RECEIPTS_EMPTY', 'target_receipts must be a non-empty array');
  }

  return targetReceipts.map((receipt, index) => {
    const verified = verifyTargetReceipt(receipt);

    return {
      index,
      receipt,
      receipt_hash: verified.target_receipt_hash
    };
  });
}

function assertBundleBindings(parts) {
  const {
    request_hash,
    policy_decision,
    critical_action_hash,
    precommit_hash,
    event_chain_hash,
    event_head_hash,
    receipt_entries
  } = parts;

  const verifiedPolicy = verifyPolicyDecision(policy_decision);

  if (verifiedPolicy.request_hash !== request_hash) {
    failClosed('EVIDENCE_BUNDLE_POLICY_REQUEST_HASH_MISMATCH', 'PolicyDecision request hash mismatch', {
      expected: request_hash,
      actual: verifiedPolicy.request_hash
    });
  }

  for (const entry of receipt_entries) {
    const receipt = entry.receipt;

    if (receipt.request_hash !== request_hash) {
      failClosed('EVIDENCE_BUNDLE_RECEIPT_REQUEST_HASH_MISMATCH', 'TargetReceipt request hash mismatch', {
        index: entry.index,
        expected: request_hash,
        actual: receipt.request_hash
      });
    }

    if (receipt.critical_action_hash !== critical_action_hash) {
      failClosed(
        'EVIDENCE_BUNDLE_RECEIPT_CRITICAL_ACTION_HASH_MISMATCH',
        'TargetReceipt critical action hash mismatch',
        {
          index: entry.index,
          expected: critical_action_hash,
          actual: receipt.critical_action_hash
        }
      );
    }

    if (receipt.precommit_hash !== precommit_hash) {
      failClosed('EVIDENCE_BUNDLE_RECEIPT_PRECOMMIT_HASH_MISMATCH', 'TargetReceipt precommit hash mismatch', {
        index: entry.index,
        expected: precommit_hash,
        actual: receipt.precommit_hash
      });
    }

    if (receipt.event_chain_hash !== event_chain_hash) {
      failClosed('EVIDENCE_BUNDLE_RECEIPT_EVENT_CHAIN_HASH_MISMATCH', 'TargetReceipt event chain hash mismatch', {
        index: entry.index,
        expected: event_chain_hash,
        actual: receipt.event_chain_hash
      });
    }

    if (receipt.event_head_hash !== event_head_hash) {
      failClosed('EVIDENCE_BUNDLE_RECEIPT_EVENT_HEAD_HASH_MISMATCH', 'TargetReceipt event head hash mismatch', {
        index: entry.index,
        expected: event_head_hash,
        actual: receipt.event_head_hash
      });
    }
  }

  return verifiedPolicy;
}

function buildManifest(input) {
  const request_hash = assertRequestEnvelope(input.request_envelope);
  const critical = assertCriticalAction(input.critical_action);
  const eventChain = assertEventChain(input.event_chain);
  const receiptEntries = normalizeTargetReceipts(input.target_receipts);

  const verifiedPolicy = assertBundleBindings({
    request_hash,
    policy_decision: input.policy_decision,
    critical_action_hash: critical.critical_action_hash,
    precommit_hash: critical.precommit_hash,
    event_chain_hash: eventChain.event_chain_hash,
    event_head_hash: eventChain.event_head_hash,
    receipt_entries: receiptEntries
  });

  return {
    bundle_id: input.bundle_id,
    action_id: input.action_id,
    created_at: input.created_at,
    request_hash,
    policy_decision_hash: verifiedPolicy.policy_decision_hash,
    critical_action_hash: critical.critical_action_hash,
    precommit_hash: critical.precommit_hash,
    event_chain_hash: eventChain.event_chain_hash,
    event_head_hash: eventChain.event_head_hash,
    target_receipt_hashes: receiptEntries.map((entry) => entry.receipt_hash),
    object_counts: {
      events: eventChain.event_count,
      receipts: receiptEntries.length
    },
    schema_set_hash: sha256Digest(input.schema_set),
    verification_profile_hash: sha256Digest(input.verification_profile),
    redaction_profile_hash: sha256Digest(input.redaction_profile)
  };
}

function attachBundleHashes(bundle) {
  const manifestWithoutHash = deepCloneJson(bundle.manifest);
  const manifest_hash = sha256Digest(manifestWithoutHash);

  const withManifestHash = {
    ...bundle,
    manifest_hash
  };

  const withoutBundleHash = deepCloneJson(withManifestHash);
  delete withoutBundleHash.evidence_bundle_hash;

  return deepFreeze({
    ...withManifestHash,
    evidence_bundle_hash: sha256Digest(withoutBundleHash)
  });
}

function createEvidenceBundle(input) {
  const context = input && typeof input === 'object' ? input : {};

  assertId(context.bundle_id, 'bundle_id');
  assertId(context.action_id, 'action_id');
  assertTimestamp(context.created_at, 'created_at');

  const schema_set = normalizeSchemaSet(context.schema_set);
  const verification_profile = normalizeProfile(context.verification_profile, 'verification_profile');
  const redaction_profile = normalizeProfile(context.redaction_profile, 'redaction_profile');

  const normalized = {
    bundle_id: context.bundle_id,
    action_id: context.action_id,
    created_at: context.created_at,
    request_envelope: deepCloneJson(context.request_envelope),
    policy_decision: deepCloneJson(context.policy_decision),
    critical_action: deepCloneJson(context.critical_action),
    event_chain: deepCloneJson(context.event_chain),
    target_receipts: deepCloneJson(context.target_receipts),
    schema_set,
    verification_profile,
    redaction_profile
  };

  const manifest = buildManifest(normalized);

  const bundle = {
    proto: 'HBCE-P0-EVIDENCE-BUNDLE-v1',
    kind: 'HBCE_P0_EVIDENCE_BUNDLE',
    version: 'v1',
    bundle_id: normalized.bundle_id,
    action_id: normalized.action_id,
    created_at: normalized.created_at,
    schema_set: normalized.schema_set,
    request_envelope: normalized.request_envelope,
    policy_decision: normalized.policy_decision,
    critical_action: normalized.critical_action,
    event_chain: normalized.event_chain,
    target_receipts: normalized.target_receipts,
    verification_profile: normalized.verification_profile,
    redaction_profile: normalized.redaction_profile,
    manifest,
    verification_summary: {
      result: VERIFICATION_RESULT.UNVERIFIED_EXPORT,
      reason: 'EXPORTED_NOT_YET_VERIFIED_BY_CLI',
      verifier_required: true
    },
    bundle_semantics: {
      evidence_bundle_is_portable: true,
      evidence_bundle_supports_verification: true,
      evidence_bundle_certifies_compliance: false,
      evidence_bundle_proves_legal_liability: false,
      evidence_bundle_proves_physical_truth: false
    },
    commercial_semantics: {
      contains_pricing_logic: false,
      contains_quotation: false,
      contains_procurement_offer: false
    }
  };

  return attachBundleHashes(bundle);
}

function assertEvidenceBundleShape(bundle) {
  assertPlainObject(bundle, 'evidence_bundle');

  if (bundle.proto !== 'HBCE-P0-EVIDENCE-BUNDLE-v1') {
    failClosed('EVIDENCE_BUNDLE_PROTO_INVALID', 'evidence bundle proto is invalid');
  }

  if (bundle.kind !== 'HBCE_P0_EVIDENCE_BUNDLE') {
    failClosed('EVIDENCE_BUNDLE_KIND_INVALID', 'evidence bundle kind is invalid');
  }

  assertId(bundle.bundle_id, 'bundle_id');
  assertId(bundle.action_id, 'action_id');
  assertTimestamp(bundle.created_at, 'created_at');
  assertDigest(bundle.manifest_hash, 'manifest_hash');
  assertDigest(bundle.evidence_bundle_hash, 'evidence_bundle_hash');

  normalizeSchemaSet(bundle.schema_set);
  normalizeProfile(bundle.verification_profile, 'verification_profile');
  normalizeProfile(bundle.redaction_profile, 'redaction_profile');

  if (!isPlainObject(bundle.verification_summary)) {
    failClosed('EVIDENCE_BUNDLE_VERIFICATION_SUMMARY_INVALID', 'verification_summary must be an object');
  }

  if (!isPlainObject(bundle.bundle_semantics)) {
    failClosed('EVIDENCE_BUNDLE_SEMANTICS_INVALID', 'bundle_semantics must be an object');
  }

  if (
    bundle.bundle_semantics.evidence_bundle_is_portable !== true ||
    bundle.bundle_semantics.evidence_bundle_supports_verification !== true ||
    bundle.bundle_semantics.evidence_bundle_certifies_compliance !== false ||
    bundle.bundle_semantics.evidence_bundle_proves_legal_liability !== false ||
    bundle.bundle_semantics.evidence_bundle_proves_physical_truth !== false
  ) {
    failClosed('EVIDENCE_BUNDLE_SEMANTICS_INVALID', 'bundle semantics are invalid');
  }

  if (!isPlainObject(bundle.commercial_semantics)) {
    failClosed('EVIDENCE_BUNDLE_COMMERCIAL_SEMANTICS_INVALID', 'commercial_semantics must be an object');
  }

  if (
    bundle.commercial_semantics.contains_pricing_logic !== false ||
    bundle.commercial_semantics.contains_quotation !== false ||
    bundle.commercial_semantics.contains_procurement_offer !== false
  ) {
    failClosed(
      'EVIDENCE_BUNDLE_COMMERCIAL_SEMANTICS_INVALID',
      'evidence bundle must not contain pricing or procurement semantics'
    );
  }
}

function verifyEvidenceBundle(bundleInput) {
  assertEvidenceBundleShape(bundleInput);

  const normalized = {
    bundle_id: bundleInput.bundle_id,
    action_id: bundleInput.action_id,
    created_at: bundleInput.created_at,
    request_envelope: bundleInput.request_envelope,
    policy_decision: bundleInput.policy_decision,
    critical_action: bundleInput.critical_action,
    event_chain: bundleInput.event_chain,
    target_receipts: bundleInput.target_receipts,
    schema_set: bundleInput.schema_set,
    verification_profile: bundleInput.verification_profile,
    redaction_profile: bundleInput.redaction_profile
  };

  const expectedManifest = buildManifest(normalized);
  const expectedManifestHash = sha256Digest(expectedManifest);

  if (expectedManifestHash !== bundleInput.manifest_hash) {
    failClosed('EVIDENCE_BUNDLE_MANIFEST_HASH_MISMATCH', 'evidence bundle manifest hash mismatch', {
      expected: expectedManifestHash,
      actual: bundleInput.manifest_hash
    });
  }

  if (sha256Digest(bundleInput.manifest) !== bundleInput.manifest_hash) {
    failClosed('EVIDENCE_BUNDLE_MANIFEST_OBJECT_MISMATCH', 'evidence bundle manifest object mismatch');
  }

  const withoutBundleHash = deepCloneJson(bundleInput);
  delete withoutBundleHash.evidence_bundle_hash;

  const expectedBundleHash = sha256Digest(withoutBundleHash);

  if (expectedBundleHash !== bundleInput.evidence_bundle_hash) {
    failClosed('EVIDENCE_BUNDLE_HASH_MISMATCH', 'evidence bundle hash mismatch', {
      expected: expectedBundleHash,
      actual: bundleInput.evidence_bundle_hash
    });
  }

  return deepFreeze({
    state: EVIDENCE_BUNDLE_STATE.VALID,
    result: VERIFICATION_RESULT.PASS,
    reason: 'EVIDENCE_BUNDLE_VALID',
    bundle_id: bundleInput.bundle_id,
    action_id: bundleInput.action_id,
    manifest_hash: bundleInput.manifest_hash,
    evidence_bundle_hash: bundleInput.evidence_bundle_hash,
    target_receipt_count: bundleInput.target_receipts.length,
    evidence_bundle_certifies_compliance: false,
    evidence_bundle_proves_legal_liability: false,
    evidence_bundle_proves_physical_truth: false
  });
}

module.exports = Object.freeze({
  EVIDENCE_BUNDLE_STATE,
  VERIFICATION_RESULT,
  createEvidenceBundle,
  verifyEvidenceBundle
});
