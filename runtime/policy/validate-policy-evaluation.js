'use strict';

const STATE = Object.freeze({
  VALID: 'VALID',
  INVALID: 'INVALID'
});

function result(state, reason) {
  return Object.freeze({
    state,
    reason
  });
}

function validatePolicyEvaluation(policyEvaluation) {
  if (policyEvaluation == null) {
    return result(STATE.INVALID, 'POLICY_EVALUATION_MISSING');
  }

  if (
    typeof policyEvaluation !== 'object' ||
    Array.isArray(policyEvaluation)
  ) {
    return result(STATE.INVALID, 'POLICY_EVALUATION_INVALID');
  }

  if (policyEvaluation.proto !== 'HBCE-POLICY-EVALUATION-v1') {
    return result(STATE.INVALID, 'POLICY_EVALUATION_PROTO_INVALID');
  }

  if (policyEvaluation.kind !== 'HBCE_CORE_POLICY_EVALUATION') {
    return result(STATE.INVALID, 'POLICY_EVALUATION_KIND_INVALID');
  }

  if (policyEvaluation.version !== 'v1') {
    return result(STATE.INVALID, 'POLICY_EVALUATION_VERSION_INVALID');
  }

  if (
    typeof policyEvaluation.policy_evaluation_id !== 'string' ||
    policyEvaluation.policy_evaluation_id.length < 5 ||
    policyEvaluation.policy_evaluation_id.length > 128 ||
    !/^PEV-[0-9A-Z_:.-]+$/.test(policyEvaluation.policy_evaluation_id)
  ) {
    return result(STATE.INVALID, 'POLICY_EVALUATION_ID_INVALID');
  }

  if (
    !Number.isInteger(policyEvaluation.policy_evaluation_version) ||
    policyEvaluation.policy_evaluation_version < 1
  ) {
    return result(
      STATE.INVALID,
      'POLICY_EVALUATION_VERSION_NUMBER_INVALID'
    );
  }

  if (
    typeof policyEvaluation.authority_ref !== 'string' ||
    policyEvaluation.authority_ref.length < 5 ||
    policyEvaluation.authority_ref.length > 128 ||
    !/^AUT-[0-9A-Z:\\-_.]+$/.test(policyEvaluation.authority_ref)
  ) {
    return result(STATE.INVALID, 'POLICY_EVALUATION_AUTHORITY_REF_INVALID');
  }

  if (
    !Number.isInteger(policyEvaluation.authority_version) ||
    policyEvaluation.authority_version < 1
  ) {
    return result(STATE.INVALID, 'POLICY_EVALUATION_AUTHORITY_VERSION_INVALID');
  }

  if (
    typeof policyEvaluation.authority_sha256 !== 'string' ||
    !/^[a-f0-9]{64}$/.test(policyEvaluation.authority_sha256)
  ) {
    return result(STATE.INVALID, 'POLICY_EVALUATION_AUTHORITY_SHA256_INVALID');
  }

  if (
    typeof policyEvaluation.policy_ref !== 'string' ||
    policyEvaluation.policy_ref.length < 3 ||
    policyEvaluation.policy_ref.length > 160
  ) {
    return result(STATE.INVALID, 'POLICY_EVALUATION_POLICY_REF_INVALID');
  }

  if (
    !Number.isInteger(policyEvaluation.policy_version) ||
    policyEvaluation.policy_version < 1
  ) {
    return result(STATE.INVALID, 'POLICY_EVALUATION_POLICY_VERSION_INVALID');
  }

  if (
    typeof policyEvaluation.policy_sha256 !== 'string' ||
    !/^[a-f0-9]{64}$/.test(policyEvaluation.policy_sha256)
  ) {
    return result(STATE.INVALID, 'POLICY_EVALUATION_POLICY_SHA256_INVALID');
  }

  const actionBinding = policyEvaluation.action_binding;

  if (
    !actionBinding ||
    typeof actionBinding !== 'object' ||
    Array.isArray(actionBinding)
  ) {
    return result(STATE.INVALID, 'POLICY_EVALUATION_ACTION_BINDING_INVALID');
  }

  const allowedActionBindingProperties = new Set([
    'action_class',
    'target_ref',
    'action_sha256',
    'request_sha256'
  ]);

  if (
    Object.keys(actionBinding).some(
      (key) => !allowedActionBindingProperties.has(key)
    )
  ) {
    return result(
      STATE.INVALID,
      'POLICY_EVALUATION_ACTION_BINDING_ADDITIONAL_PROPERTY'
    );
  }

  if (
    typeof actionBinding.action_class !== 'string' ||
    actionBinding.action_class.length < 3 ||
    actionBinding.action_class.length > 128 ||
    !/^[A-Z0-9_:.-]+$/.test(actionBinding.action_class)
  ) {
    return result(STATE.INVALID, 'POLICY_EVALUATION_ACTION_CLASS_INVALID');
  }

  if (
    typeof actionBinding.target_ref !== 'string' ||
    actionBinding.target_ref.length < 3 ||
    actionBinding.target_ref.length > 160 ||
    !/^[A-Z0-9_:.-]+$/.test(actionBinding.target_ref)
  ) {
    return result(STATE.INVALID, 'POLICY_EVALUATION_TARGET_REF_INVALID');
  }

  if (
    typeof actionBinding.action_sha256 !== 'string' ||
    !/^[a-f0-9]{64}$/.test(actionBinding.action_sha256)
  ) {
    return result(STATE.INVALID, 'POLICY_EVALUATION_ACTION_SHA256_INVALID');
  }

  if (
    typeof actionBinding.request_sha256 !== 'string' ||
    !/^[a-f0-9]{64}$/.test(actionBinding.request_sha256)
  ) {
    return result(STATE.INVALID, 'POLICY_EVALUATION_REQUEST_SHA256_INVALID');
  }

  if (
    ![
      'PASS',
      'FAIL',
      'REVIEW_REQUIRED',
      'NOT_APPLICABLE'
    ].includes(policyEvaluation.state)
  ) {
    return result(STATE.INVALID, 'POLICY_EVALUATION_STATE_INVALID');
  }

  if (typeof policyEvaluation.evaluated_at !== 'string' || policyEvaluation.evaluated_at.length === 0 || Number.isNaN(Date.parse(policyEvaluation.evaluated_at))) {
    return result(STATE.INVALID, 'POLICY_EVALUATION_EVALUATED_AT_INVALID');
  }

  if (!['PRESENT', 'MISSING', 'NOT_APPLICABLE', 'UNKNOWN'].includes(policyEvaluation.evidence_state)) {
    return result(STATE.INVALID, 'POLICY_EVALUATION_EVIDENCE_STATE_INVALID');
  }

  const evidenceReference = policyEvaluation.evidence_reference;
  if (evidenceReference !== null && (typeof evidenceReference !== 'string' || evidenceReference.length < 3 || evidenceReference.length > 160 || !/^[A-Z0-9_:.-]+$/.test(evidenceReference))) {
    return result(STATE.INVALID, 'POLICY_EVALUATION_EVIDENCE_REFERENCE_INVALID');
  }

  if (
    policyEvaluation.state === 'PASS' &&
    (
      policyEvaluation.evidence_state !== 'PRESENT' ||
      typeof evidenceReference !== 'string'
    )
  ) {
    return result(
      STATE.INVALID,
      'POLICY_EVALUATION_PASS_EVIDENCE_REQUIRED'
    );
  }

  if (
    typeof policyEvaluation.payload_sha256 !== 'string' ||
    !/^[a-f0-9]{64}$/.test(policyEvaluation.payload_sha256)
  ) {
    return result(
      STATE.INVALID,
      'POLICY_EVALUATION_PAYLOAD_SHA256_INVALID'
    );
  }

  if (policyEvaluation.append_only !== true) {
    return result(
      STATE.INVALID,
      'POLICY_EVALUATION_APPEND_ONLY_INVALID'
    );
  }

  if (
    policyEvaluation.genealogy === null ||
    typeof policyEvaluation.genealogy !== 'object' ||
    Array.isArray(policyEvaluation.genealogy)
  ) {
    return result(
      STATE.INVALID,
      'POLICY_EVALUATION_GENEALOGY_INVALID'
    );
  }

  const requiredGenealogyFields = [
    'derived_from',
    'previous_state',
    'new_state',
    'cause',
    'evidence_reference',
    'timestamp',
    'hash'
  ];

  if (
    requiredGenealogyFields.some(
      field => !Object.prototype.hasOwnProperty.call(
        policyEvaluation.genealogy,
        field
      )
    )
  ) {
    return result(
      STATE.INVALID,
      'POLICY_EVALUATION_GENEALOGY_REQUIRED_FIELDS_MISSING'
    );
  }

  if (
    Object.keys(policyEvaluation.genealogy).some(
      field => !requiredGenealogyFields.includes(field)
    )
  ) {
    return result(
      STATE.INVALID,
      'POLICY_EVALUATION_GENEALOGY_ADDITIONAL_PROPERTY'
    );
  }

  const derivedFrom = policyEvaluation.genealogy.derived_from;

  if (
    derivedFrom !== null &&
    (
      typeof derivedFrom !== 'string' ||
      derivedFrom.length < 5 ||
      derivedFrom.length > 128 ||
      !/^PEV-[0-9A-Z_:.-]+$/.test(derivedFrom)
    )
  ) {
    return result(
      STATE.INVALID,
      'POLICY_EVALUATION_GENEALOGY_DERIVED_FROM_INVALID'
    );
  }

  const previousState = policyEvaluation.genealogy.previous_state;

  if (
    previousState !== null &&
    ![
      'PASS',
      'FAIL',
      'REVIEW_REQUIRED',
      'NOT_APPLICABLE'
    ].includes(previousState)
  ) {
    return result(
      STATE.INVALID,
      'POLICY_EVALUATION_GENEALOGY_PREVIOUS_STATE_INVALID'
    );
  }

  if (
    ![
      'PASS',
      'FAIL',
      'REVIEW_REQUIRED',
      'NOT_APPLICABLE'
    ].includes(policyEvaluation.genealogy.new_state)
  ) {
    return result(
      STATE.INVALID,
      'POLICY_EVALUATION_GENEALOGY_NEW_STATE_INVALID'
    );
  }

  const genealogyCause = policyEvaluation.genealogy.cause;

  if (
    typeof genealogyCause !== 'string' ||
    genealogyCause.length < 3 ||
    genealogyCause.length > 240
  ) {
    return result(
      STATE.INVALID,
      'POLICY_EVALUATION_GENEALOGY_CAUSE_INVALID'
    );
  }

  const genealogyEvidenceReference =
    policyEvaluation.genealogy.evidence_reference;

  if (
    genealogyEvidenceReference !== null &&
    (
      typeof genealogyEvidenceReference !== 'string' ||
      genealogyEvidenceReference.length < 3 ||
      genealogyEvidenceReference.length > 160 ||
      !/^[A-Z0-9_:.-]+$/.test(genealogyEvidenceReference)
    )
  ) {
    return result(
      STATE.INVALID,
      'POLICY_EVALUATION_GENEALOGY_EVIDENCE_REFERENCE_INVALID'
    );
  }

  const genealogyTimestamp = policyEvaluation.genealogy.timestamp;
  if (typeof genealogyTimestamp !== 'string' || genealogyTimestamp.length === 0 || !Number.isFinite(Date.parse(genealogyTimestamp))) {
    return result(STATE.INVALID, 'POLICY_EVALUATION_GENEALOGY_TIMESTAMP_INVALID');
  }

  const genealogyHash = policyEvaluation.genealogy.hash;

  if (
    typeof genealogyHash !== 'string' ||
    !/^[0-9a-f]{64}$/.test(genealogyHash)
  ) {
    return result(
      STATE.INVALID,
      'POLICY_EVALUATION_GENEALOGY_HASH_INVALID'
    );
  }

  if (policyEvaluation.genealogy.new_state !== policyEvaluation.state) {
    return result(STATE.INVALID, 'POLICY_EVALUATION_GENEALOGY_STATE_MISMATCH');
  }

  if (
    policyEvaluation.policy_evaluation_version === 1 &&
    policyEvaluation.genealogy.derived_from !== null
  ) {
    return result(
      STATE.INVALID,
      'POLICY_EVALUATION_GENESIS_DERIVED_FROM_INVALID'
    );
  }

  if (
    policyEvaluation.policy_evaluation_version === 1 &&
    policyEvaluation.genealogy.previous_state !== null
  ) {
    return result(
      STATE.INVALID,
      'POLICY_EVALUATION_GENESIS_PREVIOUS_STATE_INVALID'
    );
  }

  if (
    policyEvaluation.policy_evaluation_version >= 2 &&
    policyEvaluation.genealogy.derived_from === null
  ) {
    return result(
      STATE.INVALID,
      'POLICY_EVALUATION_REVISION_DERIVED_FROM_REQUIRED'
    );
  }

  if (
    policyEvaluation.policy_evaluation_version >= 2 &&
    policyEvaluation.genealogy.previous_state === null
  ) {
    return result(
      STATE.INVALID,
      'POLICY_EVALUATION_REVISION_PREVIOUS_STATE_REQUIRED'
    );
  }

  if (
    policyEvaluation.genealogy.derived_from ===
    policyEvaluation.policy_evaluation_id
  ) {
    return result(
      STATE.INVALID,
      'POLICY_EVALUATION_GENEALOGY_SELF_REFERENCE'
    );
  }

  return result(
    STATE.INVALID,
    'POLICY_EVALUATION_CANONICAL_VALIDATION_DEFERRED'
  );
}

module.exports = Object.freeze({
  STATE,
  validatePolicyEvaluation
});
