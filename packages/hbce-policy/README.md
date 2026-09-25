# hbce-policy

Status: PROG-005 P0 Policy Binding Adapter.

This package does not replace the existing runtime authority, OPC policy or authorization modules.

It adapts the P0 RequestEnvelope chain to the existing runtime modules:

- `runtime/authority/resolve-authority.js`
- `runtime/opc/evaluate-policy.js`
- `runtime/authorization/resolve-authorization.js`

Implemented behavior:

- binds RequestEnvelope to Authority reference
- computes and checks Authority hash against the RequestEnvelope
- maps RequestEnvelope action and target into runtime authority resolution
- checks PolicyEvaluation binding against request, authority, action and target references
- preserves fail-closed behavior
- never converts valid login, permission claim or AI output into authority
- never emits execution permission

Boundary:

- no positive authorization implementation
- no execution dispatch
- no HTTP server implementation
- no IAM replacement
- no legal or regulatory certification claim
- no verifier completeness claim

P0 invariant:

`VALID_LOGIN != VALID_AUTHORITY`
`PERMISSION != MISSION`
`AI_OUTPUT != AUTHORITY`\n

## PROG-010 P0 PolicyDecision Level 1 model

Status: implemented as a deterministic Level 1 policy decision object.

Implemented behavior:

- supports ALLOW, DENY, SAFE_HOLD and DUAL_CONTROL_REQUIRED
- records policy_version, input_facts_hash, rule_ids, denial_reasons and required_controls
- hashes the policy decision deterministically
- verifies policy decision hash
- binds policy decision to request_hash
- preserves the boundary between policy decision and authorization
- never creates dispatch
- never performs physical execution

Boundary:

- PolicyDecision is not Authorization.
- PolicyDecision does not authorize execution by itself.
- PolicyDecision does not replace separate authority validation.
- PolicyDecision does not create dispatch.
- PolicyDecision does not prove legal compliance.
