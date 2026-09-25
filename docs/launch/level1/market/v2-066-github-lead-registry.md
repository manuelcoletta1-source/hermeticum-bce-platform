# HBCE Level 1 - V2-066 GitHub Lead Registry

Document ID: HBCE-L1-V2-066-GITHUB-LEAD-REGISTRY
Specification baseline: V2.9 - 25 September 2026
Repository baseline commit: `3edad62764c79e90636af42e8325bfdcd216e8e8`
Status: INITIALIZED_NOT_READY / BLOCKED
Market gate: G3C_LEAD_REGISTRY_READY
Gate impact: Does not satisfy G3C by itself.

## 1. Purpose

This record initializes the GitHub Lead Registry from V2-065 MarketObservationRecord.

The registry converts reproducible observations into lead records without promoting them into buyers, contacts, qualified leads, outreach targets or pilot candidates.

Repository found is not organization verified. Technical relevance is not buyer fit. Contributor is not procurement owner. A schema had to say this out loud because apparently humans keep inventing shortcuts and then calling them strategy.

## 2. Registry Snapshot

Registry initialized: true
Snapshot versioned: true
Valid lead registry ready: false
Lead count: 3
Qualified lead count: 0
Outreach-ready count: 0
Contactable lead count: 0

Snapshot hash: `sha256:22ab8f9eee7669315e8a972d236f48162d987ffcaef64ad46dd5973e6ee32113`

## 3. Lead Records

| Lead | Source | Organization state | Relationship hypothesis | Pipeline state | Contact role | Outreach ready |
| --- | --- | --- | --- | --- | --- | --- |
| GH-0001 | frumu-ai/tandem | UNKNOWN | COMPETITOR_OR_PEER | TECHNICALLY_RELEVANT | NOT_IDENTIFIED | false |
| GH-0002 | preloop/preloop | UNKNOWN | COMPETITOR_OR_PEER | TECHNICALLY_RELEVANT | NOT_IDENTIFIED | false |
| GH-0003 | banlang/ai-assisted-credit-underwriting-governance | USER_ONLY | USE_CASE_SIGNAL | TECHNICALLY_RELEVANT | NOT_IDENTIFIED | false |

## 4. Registry Guards

| Guard | Rule | Result |
| --- | --- | --- |
| REPOSITORY_FOUND_NOT_ORG_VERIFIED | Repository presence is not organization verification. | ORG_VERIFIED_DENIED |
| TECHNICAL_RELEVANCE_NOT_BUYER_FIT | Technical similarity cannot promote a record to BUYER_CANDIDATE, QUALIFIED or OUTREACH_READY. | QUALIFICATION_DENIED |
| CONTRIBUTOR_NOT_PROCUREMENT_OWNER | Contributor, user owner or repository maintainer is not treated as procurement owner. | ROLE_IDENTIFICATION_REQUIRED |
| NO_QUALIFIED_WITHOUT_BUYER_PROBLEM_EVIDENCE | QUALIFIED requires buyer problem evidence. | QUALIFICATION_DENIED |
| NO_OUTREACH_WITHOUT_ROLE_AND_APPROVAL | OUTREACH_READY requires target role, allowed claims, message draft and human approval. | PIPELINE_BLOCKED |
| DO_NOT_CONTACT_OVERRIDES_PIPELINE | do_not_contact=true blocks outreach regardless of technical relevance. | DO_NOT_CONTACT_BLOCK |

## 5. Explicit Non-Claims

This V2-066 initialization does not claim:

- G3C LEAD_REGISTRY_READY
- organization verification
- role identification
- qualified lead state
- outreach readiness
- contacted state
- discovery started
- buyer interest
- customer/client existence
- pilot candidate state
- pilot readiness

## 6. Next Step

V2-067 must implement qualification guards so transitions toward QUALIFIED and OUTREACH_READY remain blocked without buyer problem evidence, target role and human-approved claim-safe outreach.
