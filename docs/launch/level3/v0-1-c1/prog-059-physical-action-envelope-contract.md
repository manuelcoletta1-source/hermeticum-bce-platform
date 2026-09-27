# HBCE PROG-059 - Level 3 Physical Action Envelope Contract

Status: LEVEL3_PHYSICAL_ACTION_ENVELOPE_CONTRACT_CREATED_NOT_ACTUATION_READY

## Purpose

This artifact defines the Physical Action Envelope contract for Level 3.

It represents a proposed cyber-physical action boundary before simulation, observation or dry-run execution.

It does not permit physical actuation.

It does not declare Level 3 pilot readiness.

It does not declare physical deployment readiness.

## Required Boundary

A physical action envelope must bind:

- physical_action_id
- action_class
- target_system_ref
- controller_interface_ref
- authority_ref
- human_authorization_ref
- physical_safety_envelope_ref
- requested_effect
- permitted_bounds
- forbidden_effects
- time_window
- environment_ref
- evidence_capture_plan
- fail_closed_rule

## Authority Rule

The action envelope is an instruction boundary, not an authority source.

AI models may describe an action.

AI models may not authorize an action.

Human and governed authority remain required.

## Allowed Without New Evidence

- simulated motion
- simulated state change
- observer mode request
- dry run with no actuation

## Blocked Without New Evidence

- controlled actuation
- uncontrolled physical actuation
- autonomous physical control
- safety-critical live control

## Next Required Program

PROG-060-HBCE-LEVEL3-PHYSICAL-SAFETY-ENVELOPE-CONTRACT.
