# HBCE-EG-001 Evidence Invalidation Propagation

Program: `PROG-200-HBCE-EG-001-EVIDENCE-INVALIDATION-PROPAGATION`

This module implements evidence invalidation propagation for the HBCE-EG-001 protected-state lineage.

## Rule

History is immutable.

A historical `PASS` remains preserved as a historical fact. If evidence used to derive that state is later invalidated, the effective state is recomputed without rewriting the original `TransitionEvent` lineage.

## Runtime artifacts

- `EvidenceInvalidationEvent`
- `InvalidationPropagationRecord`
- `effective_projection`

## Boundary

This module supports effective-state recomputation. It does not create external validation, legal validity, certification, procurement eligibility or Level 4 eligibility.
