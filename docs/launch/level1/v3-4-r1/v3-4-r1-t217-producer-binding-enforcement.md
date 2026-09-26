# HBCE B2B Level 1 - V3.4-R1 T217 Producer Binding Enforcement

Document ID: HBCE-L1-V3-4-R1-T217-PRODUCER-BINDING-ENFORCEMENT
Specification baseline: V3.4-R1 - Controlled Corrective Revision - 26 September 2026
Repository baseline commit: `bbec4a985b30f6f3e2da02c276d394bfb3502d52`
Status: IMPLEMENTED_TESTED_NOT_RELEASE_READY
Gate impact: Does not claim production readiness, release candidate readiness, full runtime authorization completion or recovery harness completion.

## 1. Purpose

This artifact implements T217 producer binding enforcement.

A controlled mutation is allowed only when the producer identifier exists in the referenced Producer Registry version and is authorized for the target namespace and mutation.

Requesting recovery or requesting an action is not the same as producing a state mutation.

## 2. Runtime Module

Runtime module: `runtime/producer/validate-producer-binding.js`

## 3. T217 Vectors

| Vector | Producer | Namespace | Mutation | Expected result |
| --- | --- | --- | --- | --- |
| T217-POS-001 | PRODUCER::HBCE_CORE | OPERATIONAL | OPERATIONAL::ALLOWED | PRODUCER_BINDING_ALLOWED |
| T217-POS-002 | PRODUCER::QUALIFIED_VERIFIER | ASSURANCE | ASSURANCE::PROVEN | PRODUCER_BINDING_ALLOWED |
| T217-POS-003 | PRODUCER::SCHEMA_REGISTRY | COMBINATION | COMBINATION::VALID | PRODUCER_BINDING_ALLOWED |
| T217-NEG-001 | PRODUCER::UNREGISTERED | OPERATIONAL | OPERATIONAL::ALLOWED | PRODUCER_NOT_REGISTERED |
| T217-NEG-002 | PRODUCER::GATE_EVALUATOR | OPERATIONAL | OPERATIONAL::ALLOWED | TRANSITION_DENIED |
| T217-NEG-003 | PRODUCER::HBCE_CORE | ASSURANCE | ASSURANCE::PROVEN | TRANSITION_DENIED |
| T217-NEG-004 | PRODUCER::CONTRACT_CONTROL | IMPLEMENTATION | IMPLEMENTATION::IMPLEMENTED | TRANSITION_DENIED |
| T217-NEG-005 | ACTOR::RECOVERY_REQUESTER | OPERATIONAL | OPERATIONAL::NOT_EVALUATED | PRODUCER_NOT_REGISTERED |
| T217-NEG-006 | PRODUCER::TARGET_OUTCOME_LOGIC | OPERATIONAL | OPERATIONAL::ALLOWED | TRANSITION_DENIED |

## 4. Explicit Non-Claims

This implementation does not claim production readiness, release candidate readiness, full runtime authorization completion, recovery harness completion, Pilot Access or customer acceptance.
