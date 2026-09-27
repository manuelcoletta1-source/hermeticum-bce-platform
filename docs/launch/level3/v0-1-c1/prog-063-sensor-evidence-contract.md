# HBCE PROG-063 - Level 3 Sensor Evidence Contract

Status: LEVEL3_SENSOR_EVIDENCE_CONTRACT_CREATED_NOT_PHYSICAL_EFFECT_PROOF

## Purpose

This artifact defines the Sensor Evidence contract for Level 3.

It binds sensor-side observations to controller receipt, physical action envelope and physical safety envelope references.

It does not prove live physical effect by itself.

It does not authorize live control.

It does not permit physical actuation.

## Sensor Evidence Meaning

Sensor evidence may support simulated, recorded, observer-signed or controller-reported observation.

Sensor evidence is observation evidence, not standalone physical effect proof.

Live sensor effect proof requires new evidence and a separate evaluation gate.

## Required Boundary

Sensor evidence must bind:

- sensor_evidence_id
- sensor_source_ref
- sensor_source_mode
- controller_receipt_ref
- physical_action_envelope_ref
- physical_safety_envelope_ref
- observed_property
- observation_window
- measurement_digest
- calibration_ref
- provenance_ref
- limitations
- effect_assessment_boundary
- fail_closed_rule

## Next Required Program

PROG-064-HBCE-LEVEL3-PHYSICAL-EFFECT-EVALUATION-GATE.
