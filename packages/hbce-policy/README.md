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
`AI_OUTPUT != AUTHORITY`
