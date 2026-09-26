'use strict';

const { validateProducerBinding } = require('../producer/validate-producer-binding.js');

const RESULTS = Object.freeze({
  SCHEMA_CLASSIFICATION_VALID: 'SCHEMA_CLASSIFICATION_VALID',
  SCHEMA_CLASSIFICATION_INVALID: 'SCHEMA_CLASSIFICATION_INVALID',
  TYPE_MISMATCH: 'TYPE_MISMATCH',
  TOKEN_SHAPE_VALID: 'TOKEN_SHAPE_VALID',
  TOKEN_SHAPE_INVALID: 'TOKEN_SHAPE_INVALID',
  CONTRACT_TRANSITION_ALLOWED: 'CONTRACT_TRANSITION_ALLOWED',
  CONTRACT_PRODUCER_INVALID: 'CONTRACT_PRODUCER_INVALID',
  TRANSITION_DENIED: 'TRANSITION_DENIED',
  PRODUCER_BINDING_DENIED: 'PRODUCER_BINDING_DENIED',
  REGISTRY_MISSING: 'REGISTRY_MISSING'
});

function asArray(value) {
  if (Array.isArray(value)) return value;
  if (typeof value === 'string' && value.length > 0) return [value];
  return [];
}

function registeredCombinationValues(registry) {
  if (!registry || !Array.isArray(registry.registered_producers)) return [];
  const schemaRegistry = registry.registered_producers.find((p) => p.producer_id === 'PRODUCER::SCHEMA_REGISTRY');
  return asArray(schemaRegistry && schemaRegistry.allowed_mutations).filter((value) => value.startsWith('COMBINATION::'));
}

function deny(result, reason, extra) {
  return Object.assign({ allowed: false, result, reason }, extra || {});
}

function allow(result, extra) {
  return Object.assign({ allowed: true, result }, extra || {});
}

function validateCombinationClassification(input) {
  const registry = input && input.registry;
  const classification = input && input.classification;
  const producerId = input && input.producer_id;

  const registered = registeredCombinationValues(registry);
  if (registered.length === 0) {
    return deny(RESULTS.REGISTRY_MISSING, 'Producer Registry does not expose COMBINATION::* classifications.');
  }

  if (typeof classification !== 'string' || !classification.startsWith('COMBINATION::')) {
    return deny(RESULTS.SCHEMA_CLASSIFICATION_INVALID, 'Combination classification must use COMBINATION::* namespace.', {
      classification: classification || null
    });
  }

  if (!registered.includes(classification)) {
    return deny(RESULTS.TYPE_MISMATCH, 'Combination classification is not registered in the referenced Producer Registry version.', {
      classification
    });
  }

  if (producerId) {
    const producerVerdict = validateProducerBinding({
      registry,
      producer_id: producerId,
      namespace: 'COMBINATION',
      mutation: classification
    });

    if (!producerVerdict.allowed) {
      return deny(RESULTS.PRODUCER_BINDING_DENIED, producerVerdict.result, {
        producer_verdict: producerVerdict
      });
    }
  }

  return allow(RESULTS.SCHEMA_CLASSIFICATION_VALID, {
    classification,
    registered_classification_count: registered.length
  });
}

function validateCanonicalStateTokenShape(input) {
  const token = input && input.token;
  const evaluationId = input && input.evaluation_id;
  const priorEvaluationRef = input && input.prior_evaluation_ref;

  if (typeof token !== 'string' || token.length === 0) {
    return deny(RESULTS.TOKEN_SHAPE_INVALID, 'Canonical token is required.');
  }

  const parts = token.split('::');

  if (parts.length !== 2) {
    return deny(RESULTS.TOKEN_SHAPE_INVALID, 'Canonical state token must have exactly one namespace separator.', {
      token
    });
  }

  if (parts[0] === 'NEW_EVALUATION') {
    return deny(RESULTS.TOKEN_SHAPE_INVALID, 'Evaluation identity must live in record fields, not inside the state token.', {
      token
    });
  }

  if (token === 'OPERATIONAL::ALLOWED' && priorEvaluationRef && !evaluationId) {
    return deny(RESULTS.TOKEN_SHAPE_INVALID, 'Recovered ALLOWED token requires explicit evaluation_id when prior_evaluation_ref is present.', {
      token
    });
  }

  return allow(RESULTS.TOKEN_SHAPE_VALID, {
    token,
    evaluation_id: evaluationId || null,
    prior_evaluation_ref: priorEvaluationRef || null
  });
}

function validateContractProducer(input) {
  const registry = input && input.registry;
  const producerId = input && input.producer_id;
  const mutation = input && input.mutation;

  if (producerId !== 'PRODUCER::CONTRACT_CONTROL') {
    return deny(RESULTS.CONTRACT_PRODUCER_INVALID, 'CONTRACT::* transition must be produced by PRODUCER::CONTRACT_CONTROL.', {
      producer_id: producerId || null,
      mutation: mutation || null
    });
  }

  const producerVerdict = validateProducerBinding({
    registry,
    producer_id: producerId,
    namespace: 'CONTRACT',
    mutation
  });

  if (!producerVerdict.allowed) {
    return deny(RESULTS.TRANSITION_DENIED, producerVerdict.result, {
      producer_verdict: producerVerdict
    });
  }

  return allow(RESULTS.CONTRACT_TRANSITION_ALLOWED, {
    producer_id: producerId,
    mutation,
    producer_registry_version: producerVerdict.producer_registry_version
  });
}

module.exports = {
  RESULTS,
  validateCombinationClassification,
  validateCanonicalStateTokenShape,
  validateContractProducer
};
