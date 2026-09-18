'use strict';

const RESULT = Object.freeze({
  VALID: 'VALID',
  INVALID: 'INVALID',
  EXPIRED: 'EXPIRED',
  REVOKED: 'REVOKED',
  OUT_OF_SCOPE: 'OUT_OF_SCOPE',
  MISSING: 'MISSING'
});

function resolution(state, reason) {
  return Object.freeze({
    state,
    reason
  });
}

function hasOwnArray(object, field) {
  return (
    object &&
    typeof object === 'object' &&
    Array.isArray(object[field])
  );
}

function hasUnresolvedAuthorityDependencies(authority) {
  const scope = authority.scope;
  const limits = authority.limits;

  if (!scope || !limits) {
    return true;
  }

  if (
    !hasOwnArray(scope, 'constraint_refs') ||
    !hasOwnArray(limits, 'policy_refs') ||
    !hasOwnArray(limits, 'quantitative_limit_refs') ||
    !hasOwnArray(limits, 'condition_refs')
  ) {
    return true;
  }

  return (
    scope.constraint_refs.length > 0 ||
    limits.policy_refs.length > 0 ||
    limits.quantitative_limit_refs.length > 0 ||
    limits.condition_refs.length > 0
  );
}

function resolveAuthority(input) {
  const context = input && typeof input === 'object' ? input : {};
  const authority = context.authority;
  const mandate = context.mandate;
  const capability = context.capability;
  const currentTime = context.currentTime;
  const request =
    context.request && typeof context.request === 'object'
      ? context.request
      : {};

  if (!authority || typeof authority !== 'object') {
    return resolution(RESULT.MISSING, 'AUTHORITY_MISSING');
  }

  if (authority.state === 'REVOKED') {
    return resolution(RESULT.REVOKED, 'AUTHORITY_REVOKED');
  }

  if (authority.state === 'EXPIRED') {
    return resolution(RESULT.EXPIRED, 'AUTHORITY_EXPIRED');
  }

  if (authority.state !== 'ACTIVE') {
    return resolution(RESULT.INVALID, 'AUTHORITY_STATE_NOT_USABLE');
  }

  if (typeof currentTime !== 'string' || currentTime.length === 0) {
    return resolution(RESULT.INVALID, 'CURRENT_TIME_REQUIRED');
  }

  if (Number.isNaN(Date.parse(currentTime))) {
    return resolution(RESULT.INVALID, 'CURRENT_TIME_INVALID');
  }

  if (typeof authority.valid_from !== 'string' || authority.valid_from.length === 0 || Number.isNaN(Date.parse(authority.valid_from))) {
    return resolution(RESULT.INVALID, 'AUTHORITY_VALID_FROM_INVALID');
  }

  if (authority.valid_until !== null && (typeof authority.valid_until !== 'string' || authority.valid_until.length === 0 || Number.isNaN(Date.parse(authority.valid_until)))) {
    return resolution(RESULT.INVALID, 'AUTHORITY_VALID_UNTIL_INVALID');
  }

  if (authority.valid_until !== null && Date.parse(authority.valid_until) <= Date.parse(authority.valid_from)) {
    return resolution(RESULT.INVALID, 'AUTHORITY_TEMPORAL_INCONSISTENCY');
  }

  if (
    typeof authority.valid_from === 'string' &&
    typeof currentTime === 'string' &&
    Date.parse(currentTime) < Date.parse(authority.valid_from)
  ) {
    return resolution(RESULT.INVALID, 'AUTHORITY_NOT_YET_VALID');
  }

  if (
    typeof authority.valid_until === 'string' &&
    typeof currentTime === 'string' &&
    Date.parse(currentTime) >= Date.parse(authority.valid_until)
  ) {
    return resolution(RESULT.EXPIRED, 'AUTHORITY_TEMPORALLY_EXPIRED');
  }

  if (
    authority.evidence_state === 'MISSING' ||
    authority.evidence_state === 'UNKNOWN' ||
    authority.evidence_state !== 'PRESENT' ||
    typeof authority.evidence_reference !== 'string' ||
    authority.evidence_reference.length === 0
  ) {
    return resolution(RESULT.INVALID, 'AUTHORITY_EVIDENCE_INVALID');
  }

  if (!mandate || typeof mandate !== 'object') {
    return resolution(RESULT.INVALID, 'MANDATE_MISSING');
  }

  if (
    mandate.mandate_id !== authority.mandate_ref ||
    mandate.mandate_version !== authority.mandate_version
  ) {
    return resolution(RESULT.INVALID, 'MANDATE_BINDING_MISMATCH');
  }

  if (
    mandate.state === 'REVOKED' ||
    mandate.state === 'EXPIRED' ||
    mandate.state === 'SUPERSEDED'
  ) {
    return resolution(RESULT.INVALID, 'MANDATE_NOT_USABLE');
  }

  if (mandate.state !== 'ACTIVE') {
    return resolution(RESULT.INVALID, 'MANDATE_STATE_NOT_USABLE');
  }

  if (typeof mandate.valid_from !== 'string' || mandate.valid_from.length === 0 || Number.isNaN(Date.parse(mandate.valid_from))) {
    return resolution(RESULT.INVALID, 'MANDATE_VALID_FROM_INVALID');
  }

  if (mandate.valid_until !== null && (typeof mandate.valid_until !== 'string' || mandate.valid_until.length === 0 || Number.isNaN(Date.parse(mandate.valid_until)))) {
    return resolution(RESULT.INVALID, 'MANDATE_VALID_UNTIL_INVALID');
  }

  if (mandate.valid_until !== null && Date.parse(mandate.valid_until) <= Date.parse(mandate.valid_from)) {
    return resolution(RESULT.INVALID, 'MANDATE_TEMPORAL_INCONSISTENCY');
  }

  if (typeof mandate.valid_from === 'string' && Date.parse(currentTime) < Date.parse(mandate.valid_from)) {
    return resolution(RESULT.INVALID, 'MANDATE_NOT_YET_VALID');
  }

  if (typeof mandate.valid_until === 'string' && Date.parse(currentTime) >= Date.parse(mandate.valid_until)) {
    return resolution(RESULT.INVALID, 'MANDATE_TEMPORALLY_EXPIRED');
  }

  if (
    mandate.actor_ref !== authority.actor_ref ||
    mandate.principal_ref !== authority.principal_ref
  ) {
    return resolution(RESULT.INVALID, 'ACTOR_PRINCIPAL_MISMATCH');
  }

  if (!capability || typeof capability !== 'object') {
    return resolution(RESULT.INVALID, 'CAPABILITY_MISSING');
  }

  if (
    capability.capability_id !== authority.capability_ref ||
    capability.capability_version !== authority.capability_version
  ) {
    return resolution(RESULT.INVALID, 'CAPABILITY_BINDING_MISMATCH');
  }

  /*
   * HBCE-SF-045 human-accepted Capability lifecycle propagation.
   *
   * ACTIVE means only that Capability may continue to subsequent
   * Authority checks. It never means Authority VALID, Authorization,
   * Execution or Dispatch.
   *
   * LIMITED remains fail-closed until its full semantics are frozen.
   * A Capability lifecycle failure classifies Authority resolution
   * as INVALID; it does not rewrite Authority lifecycle state.
   */
  if (capability.state !== 'ACTIVE') {
    return resolution(
      RESULT.INVALID,
      capability.state === 'LIMITED'
        ? 'CAPABILITY_LIMITED_SEMANTICS_DEFERRED'
        : 'CAPABILITY_STATE_INVALID'
    );
  }

  if (
    capability.evidence_state !== 'PRESENT' ||
    typeof capability.evidence_reference !== 'string' ||
    capability.evidence_reference.length === 0
  ) {
    return resolution(
      RESULT.INVALID,
      capability.evidence_state === 'NOT_APPLICABLE'
        ? 'CAPABILITY_EVIDENCE_NOT_APPLICABLE_REQUIRES_JUSTIFICATION'
        : 'CAPABILITY_EVIDENCE_INVALID'
    );
  }

  if (typeof capability.valid_from !== 'string' || capability.valid_from.length === 0 || Number.isNaN(Date.parse(capability.valid_from))) {
    return resolution(RESULT.INVALID, 'CAPABILITY_VALID_FROM_INVALID');
  }

  if (capability.valid_until !== null && (typeof capability.valid_until !== 'string' || capability.valid_until.length === 0 || Number.isNaN(Date.parse(capability.valid_until)))) {
    return resolution(RESULT.INVALID, 'CAPABILITY_VALID_UNTIL_INVALID');
  }

  if (capability.valid_until !== null && Date.parse(capability.valid_until) <= Date.parse(capability.valid_from)) {
    return resolution(RESULT.INVALID, 'CAPABILITY_TEMPORAL_INCONSISTENCY');
  }

  if (typeof capability.valid_from === 'string' && Date.parse(currentTime) < Date.parse(capability.valid_from)) {
    return resolution(RESULT.INVALID, 'CAPABILITY_NOT_YET_VALID');
  }

  if (typeof capability.valid_until === 'string' && Date.parse(currentTime) >= Date.parse(capability.valid_until)) {
    return resolution(RESULT.INVALID, 'CAPABILITY_TEMPORALLY_EXPIRED');
  }

  if (
    !authority.scope ||
    !Array.isArray(authority.scope.action_classes) ||
    authority.scope.action_classes.length === 0
  ) {
    return resolution(RESULT.INVALID, 'AUTHORITY_SCOPE_INVALID');
  }

  if (
    typeof request.action_class !== 'string' ||
    !authority.scope.action_classes.includes(request.action_class)
  ) {
    return resolution(RESULT.OUT_OF_SCOPE, 'ACTION_CLASS_OUT_OF_SCOPE');
  }

  if (
    Array.isArray(authority.scope.target_refs) &&
    authority.scope.target_refs.length > 0 &&
    (
      typeof request.target_ref !== 'string' ||
      !authority.scope.target_refs.includes(request.target_ref)
    )
  ) {
    return resolution(RESULT.OUT_OF_SCOPE, 'TARGET_OUT_OF_SCOPE');
  }

  if (
    Array.isArray(authority.scope.iospace_refs) &&
    authority.scope.iospace_refs.length > 0 &&
    (
      typeof request.iospace_ref !== 'string' ||
      !authority.scope.iospace_refs.includes(request.iospace_ref)
    )
  ) {
    return resolution(RESULT.OUT_OF_SCOPE, 'IOSPACE_OUT_OF_SCOPE');
  }

  if (hasUnresolvedAuthorityDependencies(authority)) {
    return resolution(
      RESULT.INVALID,
      'UNRESOLVED_REQUIRED_AUTHORITY_DEPENDENCY'
    );
  }

  /*
   * Positive authority resolution remains intentionally fail-closed.
   *
   * Deferred semantics:
   * - capability lifecycle propagation
   * - canonical purpose representation
   * - temporal boundary inclusivity
   * - domain constraint evaluation
   * - quantitative limit evaluation
   * - policy limit evaluation
   * - condition evaluation
   *
   * Therefore this kernel MUST NOT emit VALID yet.
   */
  return resolution(
    RESULT.INVALID,
    'POSITIVE_AUTHORITY_RESOLUTION_DEFERRED'
  );
}

module.exports = Object.freeze({
  RESULT,
  resolveAuthority
});
