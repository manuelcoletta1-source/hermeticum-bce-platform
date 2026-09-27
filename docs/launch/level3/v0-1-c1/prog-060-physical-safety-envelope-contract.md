# HBCE PROG-060 - Level 3 Physical Safety Envelope Contract

Status: LEVEL3_PHYSICAL_SAFETY_ENVELOPE_CONTRACT_CREATED_NOT_SAFETY_CERTIFIED

## Purpose

This artifact defines the Physical Safety Envelope contract for Level 3.

It defines the minimum safety boundary required before a Level 3 physical action envelope can be simulated, observed or dry-run scoped.

It does not certify machine safety.

It does not authorize live control.

It does not permit physical actuation.

## Required Boundary

A physical safety envelope must bind:

- physical_safety_envelope_id
- target_system_ref
- controller_interface_ref
- operating_mode
- workspace_bounds
- prohibited_zones
- kinematic_bounds
- force_or_energy_bounds
- environment_assumptions
- sensor_monitoring_plan
- safe_hold_rule
- emergency_stop_rule
- human_supervision_rule
- hazard_register_ref
- fail_closed_rule

## Safety Rule

The safety envelope is a constraint boundary, not a safety certification.

Missing safe hold, missing emergency stop, missing sensor monitoring or missing human supervision fails closed.

## Allowed Without New Evidence

- simulation-only safety boundary
- observer-mode safety boundary
- dry-run-no-actuation safety boundary

## Blocked Without New Evidence

- live control safety certification
- controlled actuation safety clearance
- autonomous physical control

## Next Required Program

PROG-061-HBCE-LEVEL3-SAFE-HOLD-AND-ESTOP-CONTRACT.
