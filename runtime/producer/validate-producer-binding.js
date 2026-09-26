'use strict';

const fs = require('node:fs');

const RESULTS = Object.freeze({
  ALLOWED: 'PRODUCER_BINDING_ALLOWED',
  REGISTRY_MISSING: 'PRODUCER_REGISTRY_MISSING',
  REGISTRY_INVALID: 'PRODUCER_REGISTRY_INVALID',
  PRODUCER_ID_REQUIRED: 'PRODUCER_ID_REQUIRED',
  NAMESPACE_REQUIRED: 'NAMESPACE_REQUIRED',
  PRODUCER_NOT_REGISTERED: 'PRODUCER_NOT_REGISTERED',
  TRANSITION_DENIED: 'TRANSITION_DENIED'
});

function asArray(value) {
  if (Array.isArray(value)) return value;
  if (typeof value === 'string' && value.length > 0) return [value];
  return [];
}

function wildcardMatches(pattern, value) {
  if (typeof pattern !== 'string' || typeof value !== 'string') return false;
  if (pattern === value) return true;

  if (pattern.endsWith('::*')) {
    return value.startsWith(pattern.slice(0, -1));
  }

  return false;
}

function listMatches(list, value) {
  return asArray(list).some((item) => wildcardMatches(item, value));
}

function getRegisteredProducers(registry) {
  if (!registry || typeof registry !== 'object') return null;
  if (!Array.isArray(registry.registered_producers)) return null;
  return registry.registered_producers;
}

function loadProducerRegistryFromPath(registryPath) {
  return JSON.parse(fs.readFileSync(registryPath, 'utf8'));
}

function validateProducerBinding(input) {
  const registry = input && input.registry;
  const producerId = input && input.producer_id;
  const namespace = input && input.namespace;
  const mutation = input && input.mutation;

  const registeredProducers = getRegisteredProducers(registry);

  if (!registeredProducers) {
    return {
      allowed: false,
      result: RESULTS.REGISTRY_MISSING,
      reason: 'Producer registry is missing or does not contain registered_producers.'
    };
  }

  if (!registry.producer_registry_version) {
    return {
      allowed: false,
      result: RESULTS.REGISTRY_INVALID,
      reason: 'Producer registry version is required.'
    };
  }

  if (typeof producerId !== 'string' || producerId.length === 0) {
    return {
      allowed: false,
      result: RESULTS.PRODUCER_ID_REQUIRED,
      reason: 'producer_id is required.'
    };
  }

  if (typeof namespace !== 'string' || namespace.length === 0) {
    return {
      allowed: false,
      result: RESULTS.NAMESPACE_REQUIRED,
      reason: 'namespace is required.'
    };
  }

  const producer = registeredProducers.find((candidate) => candidate.producer_id === producerId);

  if (!producer) {
    return {
      allowed: false,
      result: RESULTS.PRODUCER_NOT_REGISTERED,
      reason: 'producer_id is not registered in the referenced Producer Registry version.',
      producer_id: producerId,
      namespace,
      mutation: mutation || null
    };
  }

  if (!asArray(producer.namespace_domain).includes(namespace)) {
    return {
      allowed: false,
      result: RESULTS.TRANSITION_DENIED,
      reason: 'producer_id is not authorized for the target namespace.',
      producer_id: producerId,
      namespace,
      mutation: mutation || null
    };
  }

  if (mutation && listMatches(producer.hard_prohibitions, mutation)) {
    return {
      allowed: false,
      result: RESULTS.TRANSITION_DENIED,
      reason: 'mutation is explicitly prohibited for producer_id.',
      producer_id: producerId,
      namespace,
      mutation
    };
  }

  if (mutation && !listMatches(producer.allowed_mutations, mutation)) {
    return {
      allowed: false,
      result: RESULTS.TRANSITION_DENIED,
      reason: 'mutation is not listed in allowed_mutations for producer_id.',
      producer_id: producerId,
      namespace,
      mutation
    };
  }

  return {
    allowed: true,
    result: RESULTS.ALLOWED,
    reason: 'producer_id is registered and authorized for namespace/mutation.',
    producer_id: producerId,
    namespace,
    mutation: mutation || null,
    producer_registry_version: registry.producer_registry_version
  };
}

module.exports = {
  RESULTS,
  loadProducerRegistryFromPath,
  validateProducerBinding
};
