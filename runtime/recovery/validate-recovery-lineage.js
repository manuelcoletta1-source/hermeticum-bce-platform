'use strict';

const { validateProducerBinding } = require('../producer/validate-producer-binding.js');

const RESULTS = Object.freeze({
  NEW_RUN_ACCEPTED: 'NEW_RUN_ACCEPTED',
  NEW_GATE_EVALUATION: 'NEW_GATE_EVALUATION',
  ASSURANCE_UNDER_VALIDATION_NEW_CONTEXT: 'ASSURANCE::UNDER_VALIDATION_ON_NEW_CONTEXT',
  NEW_EVALUATION_NOT_EVALUATED: 'NEW_EVALUATION::NOT_EVALUATED',
  NEW_CONTRACT_VERSION_DRAFT_OR_DEFINED: 'NEW_CONTRACT_VERSION::DRAFT_OR_DEFINED',

  PRIOR_FAILED_PRESERVED: 'PRIOR_FAILED_PRESERVED',
  PRIOR_GATE_BLOCKED_PRESERVED: 'PRIOR_GATE_BLOCKED_PRESERVED',
  PRIOR_VERDICT_PRESERVED: 'PRIOR_VERDICT_PRESERVED',
  NO_RETROACTIVE_AUTHORITY: 'NO_RETROACTIVE_AUTHORITY',
  PRIOR_RETIRED_PRESERVED: 'PRIOR_RETIRED_PRESERVED',

  RECOVERY_TYPE_UNSUPPORTED: 'RECOVERY_TYPE_UNSUPPORTED',
  PRIOR_RECORD_REQUIRED: 'PRIOR_RECORD_REQUIRED',
  PRIOR_STATE_INVALID: 'PRIOR_STATE_INVALID',
  NEW_OBJECT_REQUIRED: 'NEW_OBJECT_REQUIRED',
  LINEAGE_REF_REQUIRED: 'LINEAGE_REF_REQUIRED',
  PRIOR_REWRITE_DENIED: 'PRIOR_REWRITE_DENIED',
  PRODUCER_BINDING_DENIED: 'PRODUCER_BINDING_DENIED'
});

function requireObject(value) {
  return value && typeof value === 'object' && !Array.isArray(value);
}

function deny(result, reason, extra) {
  return Object.assign({ allowed: false, result, reason }, extra || {});
}

function allow(result, invariant, extra) {
  return Object.assign({ allowed: true, result, invariant }, extra || {});
}

function assertProducer(registry, producer_id, namespace, mutation) {
  const verdict = validateProducerBinding({ registry, producer_id, namespace, mutation });
  if (!verdict.allowed) {
    return deny(RESULTS.PRODUCER_BINDING_DENIED, verdict.result, { producer_verdict: verdict });
  }
  return null;
}

function validateCommon(input) {
  if (!requireObject(input && input.prior_record)) {
    return deny(RESULTS.PRIOR_RECORD_REQUIRED, 'prior_record is required.');
  }

  if (!requireObject(input.new_record)) {
    return deny(RESULTS.NEW_OBJECT_REQUIRED, 'new_record is required.');
  }

  if (!input.new_record.prior_ref || input.new_record.prior_ref !== input.prior_record.id) {
    return deny(RESULTS.LINEAGE_REF_REQUIRED, 'new_record.prior_ref must reference prior_record.id.');
  }

  if (input.prior_record.rewritten === true || input.prior_record.current_state !== input.prior_record.original_state) {
    return deny(RESULTS.PRIOR_REWRITE_DENIED, 'prior_record must remain immutable and preserve original_state.');
  }

  return null;
}

function validateRecoveryLineage(input) {
  const recoveryType = input && input.recovery_type;
  const registry = input && input.registry;
  const producer_id = input && input.producer_id;

  const common = validateCommon(input);
  if (common) return common;

  const prior = input.prior_record;
  const next = input.new_record;

  switch (recoveryType) {
    case 'T218_OPERATIONAL_FAILED_NEW_RUN': {
      if (prior.namespace !== 'OPERATIONAL' || prior.original_state !== 'OPERATIONAL::FAILED') {
        return deny(RESULTS.PRIOR_STATE_INVALID, 'T218 requires prior OPERATIONAL::FAILED.');
      }

      const producerDenied = assertProducer(registry, producer_id, 'OPERATIONAL', 'new_authorization_evaluation');
      if (producerDenied) return producerDenied;

      if (!next.run_id || !next.authorization_evaluation_id) {
        return deny(RESULTS.NEW_OBJECT_REQUIRED, 'T218 requires new run_id and authorization_evaluation_id.');
      }

      return allow(RESULTS.NEW_RUN_ACCEPTED, RESULTS.PRIOR_FAILED_PRESERVED, {
        recovery_test: 'T218'
      });
    }

    case 'T219_GATE_BLOCKED_NEW_EVALUATION': {
      if (prior.namespace !== 'GATE' || prior.original_state !== 'GATE::BLOCKED') {
        return deny(RESULTS.PRIOR_STATE_INVALID, 'T219 requires prior GATE::BLOCKED.');
      }

      const producerDenied = assertProducer(registry, producer_id, 'GATE', 'new_gate_evaluation_after_remediation');
      if (producerDenied) return producerDenied;

      if (!next.gate_evaluation_ref) {
        return deny(RESULTS.NEW_OBJECT_REQUIRED, 'T219 requires new gate_evaluation_ref.');
      }

      return allow(RESULTS.NEW_GATE_EVALUATION, RESULTS.PRIOR_GATE_BLOCKED_PRESERVED, {
        recovery_test: 'T219'
      });
    }

    case 'T220_ASSURANCE_INVALIDATED_NEW_CONTEXT': {
      if (prior.namespace !== 'ASSURANCE' || prior.original_state !== 'ASSURANCE::INVALIDATED') {
        return deny(RESULTS.PRIOR_STATE_INVALID, 'T220 requires prior ASSURANCE::INVALIDATED.');
      }

      const producerDenied = assertProducer(registry, producer_id, 'ASSURANCE', 'revalidation_new_context');
      if (producerDenied) return producerDenied;

      if (!next.validation_context_id || next.state !== 'ASSURANCE::UNDER_VALIDATION') {
        return deny(RESULTS.NEW_OBJECT_REQUIRED, 'T220 requires new validation_context_id and ASSURANCE::UNDER_VALIDATION.');
      }

      return allow(RESULTS.ASSURANCE_UNDER_VALIDATION_NEW_CONTEXT, RESULTS.PRIOR_VERDICT_PRESERVED, {
        recovery_test: 'T220'
      });
    }

    case 'T221_AUTHORITY_UNRESOLVED_NEW_EVALUATION': {
      if (prior.namespace !== 'OPERATIONAL' || prior.original_state !== 'AUTHORITY_UNRESOLVED::REQUEST_BLOCKED') {
        return deny(RESULTS.PRIOR_STATE_INVALID, 'T221 requires prior AUTHORITY_UNRESOLVED::REQUEST_BLOCKED.');
      }

      const producerDenied = assertProducer(registry, producer_id, 'OPERATIONAL', 'new_authorization_evaluation');
      if (producerDenied) return producerDenied;

      if (!next.authorization_evaluation_id || next.state !== 'OPERATIONAL::NOT_EVALUATED' || next.authority_resolution !== 'RESOLVED') {
        return deny(RESULTS.NEW_OBJECT_REQUIRED, 'T221 requires new evaluation, NOT_EVALUATED state and resolved authority.');
      }

      if (next.state === 'OPERATIONAL::ALLOWED') {
        return deny(RESULTS.PRIOR_REWRITE_DENIED, 'T221 cannot create retroactive authority or direct ALLOWED.');
      }

      return allow(RESULTS.NEW_EVALUATION_NOT_EVALUATED, RESULTS.NO_RETROACTIVE_AUTHORITY, {
        recovery_test: 'T221'
      });
    }

    case 'T222_CONTRACT_RETIRED_NEW_VERSION': {
      if (prior.namespace !== 'CONTRACT' || prior.original_state !== 'CONTRACT::RETIRED') {
        return deny(RESULTS.PRIOR_STATE_INVALID, 'T222 requires prior CONTRACT::RETIRED.');
      }

      const producerDenied = assertProducer(registry, producer_id, 'CONTRACT', 'new_contract_version_from_retired');
      if (producerDenied) return producerDenied;

      if (!next.contract_version_id || !['CONTRACT::DRAFT', 'CONTRACT::DEFINED'].includes(next.state)) {
        return deny(RESULTS.NEW_OBJECT_REQUIRED, 'T222 requires new contract_version_id in DRAFT or DEFINED.');
      }

      return allow(RESULTS.NEW_CONTRACT_VERSION_DRAFT_OR_DEFINED, RESULTS.PRIOR_RETIRED_PRESERVED, {
        recovery_test: 'T222'
      });
    }

    default:
      return deny(RESULTS.RECOVERY_TYPE_UNSUPPORTED, 'Unsupported recovery_type.');
  }
}

module.exports = {
  RESULTS,
  validateRecoveryLineage
};
