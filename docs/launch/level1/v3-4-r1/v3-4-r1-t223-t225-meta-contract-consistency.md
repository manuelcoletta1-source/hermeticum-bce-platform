# HBCE B2B Level 1 - V3.4-R1 T223-T225 Meta-Type & Contract Producer Consistency

Document ID: HBCE-L1-V3-4-R1-T223-T225-META-CONTRACT-CONSISTENCY
Specification baseline: V3.4-R1 - Controlled Corrective Revision - 26 September 2026
Repository baseline commit: `47ddedf6e07f41ba6e06511bfe9d06de49c931cd`
Status: IMPLEMENTED_TESTED_NOT_RELEASE_READY
Gate impact: Does not claim production readiness, release candidate readiness or full recovery-program completion.

## 1. Purpose

This artifact implements T223-T225 meta-type and CONTRACT producer consistency.

It prevents untyped Combination classifications, nested state tokens and CONTRACT lifecycle mutations produced by the wrong producer.

## 2. Consistency Coverage

| Test | Stimulus | Required result | Invariant |
| --- | --- | --- | --- |
| T223 | Combination classification missing COMBINATION::* namespace or using unregistered value | SCHEMA_CLASSIFICATION_INVALID / TYPE_MISMATCH | COMBINATION classification remains namespace-bound and registry-bound |
| T224 | Nested token NEW_EVALUATION::OPERATIONAL::ALLOWED used as state | TOKEN_SHAPE_INVALID | Evaluation identity lives in fields, not nested state tokens |
| T225 | CONTRACT::* transition produced by producer other than PRODUCER::CONTRACT_CONTROL | CONTRACT_PRODUCER_INVALID / TRANSITION_DENIED | CONTRACT lifecycle remains producer-bound to CONTRACT_CONTROL |

## 3. Consistency Vectors

The controlled vector set includes:

- T223-POS-001: COMBINATION::VALID accepted only from PRODUCER::SCHEMA_REGISTRY.
- T223-NEG-001: VALID without COMBINATION::* namespace is rejected.
- T223-NEG-002: COMBINATION::MAGIC is rejected as an unregistered value.
- T224-NEG-001: NEW_EVALUATION::OPERATIONAL::ALLOWED is rejected as a nested token.
- T224-POS-001: OPERATIONAL::ALLOWED is valid when evaluation identity is held in fields.
- T225-POS-001: CONTRACT::RELEASED is allowed only from PRODUCER::CONTRACT_CONTROL.
- T225-NEG-001: PRODUCER::HBCE_CORE cannot produce CONTRACT::RELEASED.
- T225-NEG-002: CONTRACT::IMPLEMENTED is rejected as an invalid CONTRACT mutation.

## 4. Boundary

This artifact closes the first V3.4-R1 schema hardening block after Producer Registry baseline, T217 enforcement and T218-T222 recovery harness.

It does not claim production readiness, release candidate readiness, Pilot Access or customer acceptance.
