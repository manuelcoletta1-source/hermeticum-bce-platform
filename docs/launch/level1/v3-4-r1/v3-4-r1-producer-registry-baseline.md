# HBCE B2B Level 1 - V3.4-R1 Producer Registry Baseline

Document ID: HBCE-L1-V3-4-R1-PRODUCER-REGISTRY-BASELINE
Specification baseline: V3.4-R1 - Controlled Corrective Revision - 26 September 2026
Repository baseline commit: `af883b7ac461dca04c784170a79b6024f8871178`
Status: INITIALIZED_NOT_OPERATIONAL / BLOCKED
Gate impact: Does not claim production, release candidate readiness, pilot access or runtime-complete producer enforcement.

## 1. Purpose

This artifact initializes the V3.4-R1 Producer Registry baseline for JOKER-C2 LAYER MATRIX / B2B Level 1.

It records the canonical producer identifiers, their namespace/domain ownership, their allowed mutation classes and their hard prohibitions.

## 2. Producer Binding Rule

A transition is valid only if `producer_id` is registered for the target namespace or transition in the referenced Producer Registry version.

No registered producer means no controlled mutation.

Requesting an action is not producing a state mutation.

## 3. Registered Producers

| Producer | Namespace domain | Allowed mutations | Hard prohibitions |
| --- | --- | --- | --- |
| PRODUCER::HBCE_CORE | OPERATIONAL | authorization_result; OPERATIONAL::APPROVAL_REQUIRED; OPERATIONAL::ALLOWED; OPERATIONAL::BLOCKED; new_authorization_evaluation; dispatch_governance | ASSURANCE::PROVEN; GATE::*; CONTRACT::* |
| PRODUCER::TARGET_OUTCOME_LOGIC | OPERATIONAL | OPERATIONAL::DISPATCHED_TO_EXECUTED; OPERATIONAL::DISPATCHED_TO_FAILED | runtime_authorization; recovery_approval; ASSURANCE::* |
| PRODUCER::QUALIFIED_VERIFIER | ASSURANCE | ASSURANCE::UNDER_VALIDATION; ASSURANCE::PROVEN; ASSURANCE::INVALIDATED; revalidation_new_context | runtime_authority; CONTRACT::* |
| PRODUCER::GATE_EVALUATOR | GATE | GATE::NOT_EVALUATED; GATE::PASS; GATE::FAIL; GATE::BLOCKED; new_gate_evaluation_after_remediation | OPERATIONAL::ALLOWED; ASSURANCE::* |
| PRODUCER::BUILD_CHANGE_CONTROL | IMPLEMENTATION | IMPLEMENTATION::PROPOSED; IMPLEMENTATION::IMPLEMENTED; IMPLEMENTATION::DEPRECATED | assurance_promotion; runtime_permission |
| PRODUCER::CONTRACT_CONTROL | CONTRACT | CONTRACT::DRAFT; CONTRACT::DEFINED; CONTRACT::BASELINED; CONTRACT::RELEASED; CONTRACT::RETIRED; new_contract_version_from_retired | implementation_implication; runtime_permission |
| PRODUCER::SCHEMA_REGISTRY | COMBINATION | COMBINATION::VALID; COMBINATION::CONDITIONAL; COMBINATION::INVALID; COMBINATION::N_A_BY_CONSTRUCTION; COMBINATION::VALID_HISTORICAL; COMBINATION::VALID_HISTORICAL_NO_ASSURANCE; schema_version_consistency | runtime_state_mutation |

## 4. T217 Negative Fixtures

| Fixture | Expected result | Stimulus |
| --- | --- | --- |
| T217-A | PRODUCER_NOT_REGISTERED | Unregistered producer attempts OPERATIONAL::ALLOWED |
| T217-B | TRANSITION_DENIED | PRODUCER::GATE_EVALUATOR attempts OPERATIONAL::ALLOWED |
| T217-C | TRANSITION_DENIED | PRODUCER::HBCE_CORE attempts ASSURANCE::PROVEN |
| T217-D | TRANSITION_DENIED | PRODUCER::CONTRACT_CONTROL attempts IMPLEMENTATION::IMPLEMENTED |
| T217-E | TRANSITION_DENIED | Actor requests recovery and is treated as mutation producer |

## 5. Explicit Non-Claims

This baseline does not claim production readiness, release candidate readiness, pilot access, customer acceptance, complete runtime producer enforcement or complete recovery harness.
