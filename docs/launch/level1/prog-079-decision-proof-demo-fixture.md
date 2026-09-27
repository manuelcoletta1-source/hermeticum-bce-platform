# HBCE PROG-079 - Level 1 Decision Proof Demo Fixture

Status: LEVEL1_DECISION_PROOF_DEMO_FIXTURE_DEFINED_NOT_EXECUTED

## Purpose

This artifact defines the deterministic Level 1 Decision Proof demo fixture used as controlled input for the demo runbook.

The fixture is defined.

The fixture is synthetic demo-only.

The runbook is not executed.

The verifier replay is not executed.

The Decision Proof chain is not closed.

The Decision Proof demo is not ready.

Level 1 launch is not ready.

Production is not ready.

## Fixture Inputs

- demo_case_id
- demo_scope
- authority_fixture
- policy_fixture
- target_fixture
- action_payload_fixture
- receipt_source_fixture
- audit_actor_fixture
- export_profile_fixture
- verifier_profile_fixture

## Fixture Output Targets

- authority_boundary_record
- policy_evaluation_record
- action_request_record
- action_receipt_record
- audit_event_record
- evidence_export_manifest
- verifier_replay_result
- closure_gate_result

## Fixture Rule

The fixture requires deterministic demo-only input.

Real customer data is not allowed.

External side effects are not allowed.

Production targets are not allowed.

Live authority is not allowed.

The fixture payload digest is required.

The fixture is not runbook execution.

The fixture is not verifier replay.

The fixture is not chain closure.

The fixture is not effect proof.

The fixture does not create legal validity.

AI demo authority claims fail closed.

## Next Required Program

PROG-080-HBCE-LEVEL1-DECISION-PROOF-DEMO-EXECUTION-HARNESS.
