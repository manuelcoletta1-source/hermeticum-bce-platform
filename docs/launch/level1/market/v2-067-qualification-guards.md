# HBCE Level 1 - V2-067 Qualification Guards

Document ID: HBCE-L1-V2-067-QUALIFICATION-GUARDS
Specification baseline: V2.9 - 25 September 2026
Repository baseline commit: `c00aac2fcd9b8b60eb3cf9a55683b92c46bd7191`
Status: INITIALIZED_NOT_READY / BLOCKED
Market gate: G3C_LEAD_REGISTRY_READY
Gate impact: Does not satisfy G3C by itself.

## 1. Purpose

This record initializes qualification guards for the V2.9 market pipeline.

The purpose is to prevent shortcut promotion from technical signal to commercial status.

No lead in the current registry is qualified. No lead is outreach-ready. No buyer interest, customer state, pilot candidate state or pilot readiness is claimed.

## 2. Guard Requirements

| Target state | Requires | Denies |
| --- | --- | --- |
| TECHNICALLY_RELEVANT | source_ref; observed_at_or_last_reviewed; technical_fit.rationale | missing source lineage; technical label without evidence |
| ORG_VERIFIED | organization_state == ORG_VERIFIED; verified organization evidence | repository found only; GitHub owner type User; unverified org relation |
| ROLE_IDENTIFIED | target role class; role-to-organization relation evidence | contributor treated as buyer; person without verified role |
| QUALIFIED | buyer_problem_evidence; relationship_hypothesis == BUYER_CANDIDATE or PARTNER_CANDIDATE; freshness current or revalidated | technical relevance only; competitor/peer only; use-case signal only; stale record |
| OUTREACH_READY | QUALIFIED state; target role; allowed claim set; message draft; Manuel human approval; legal channel; do_not_contact == false | missing target role; unsupported public claim; no human approval; do_not_contact true |
| CONTACTED | OUTREACH_READY state; message_ref_or_hash; recipient_role; sent_at; channel; approval_ref | contact before approval; personal email from commit metadata |

## 3. Existing Registry Evaluation

| Lead | Current state | Qualification result | Outreach result | Reason codes |
| --- | --- | --- | --- | --- |
| GH-0001 | TECHNICALLY_RELEVANT | QUALIFICATION_DENIED | PIPELINE_BLOCKED | ORG_NOT_VERIFIED, ROLE_NOT_IDENTIFIED, BUYER_PROBLEM_EVIDENCE_MISSING, HUMAN_APPROVAL_MISSING |
| GH-0002 | TECHNICALLY_RELEVANT | QUALIFICATION_DENIED | PIPELINE_BLOCKED | ORG_NOT_VERIFIED, ROLE_NOT_IDENTIFIED, BUYER_PROBLEM_EVIDENCE_MISSING, HUMAN_APPROVAL_MISSING |
| GH-0003 | TECHNICALLY_RELEVANT | QUALIFICATION_DENIED | PIPELINE_BLOCKED | ORG_NOT_VERIFIED, ROLE_NOT_IDENTIFIED, BUYER_PROBLEM_EVIDENCE_MISSING, HUMAN_APPROVAL_MISSING |

## 4. Forbidden Shortcuts

- TECHNICALLY_RELEVANT_TO_OUTREACH_READY -> PIPELINE_BLOCKED
- REPOSITORY_FOUND_TO_ORG_VERIFIED -> QUALIFICATION_DENIED
- USER_OWNER_TO_ORG_VERIFIED -> QUALIFICATION_DENIED
- TECHNICAL_SIMILARITY_TO_BUYER_FIT -> QUALIFICATION_DENIED
- QUALIFIED_WITHOUT_BUYER_PROBLEM_EVIDENCE -> QUALIFICATION_DENIED
- OUTREACH_READY_WITHOUT_TARGET_ROLE -> PIPELINE_BLOCKED
- OUTREACH_WITHOUT_HUMAN_APPROVAL -> PIPELINE_BLOCKED
- COMMIT_EMAIL_TO_CONTACT_ROUTE -> PRIVACY_POLICY_BLOCK

## 5. Explicit Non-Claims

This V2-067 initialization does not claim G3C readiness, qualified leads, outreach readiness, contacted state, buyer interest, customer/client existence, pilot candidate state or pilot readiness.
