# HBCE Level 1 - V2-069 Outreach Claim Guard

Document ID: HBCE-L1-V2-069-OUTREACH-CLAIM-GUARD
Specification baseline: V2.9 - 25 September 2026
Repository baseline commit: `6caac5bb158eadbebd5aecfed40012d4fd3cee43`
Status: INITIALIZED_NOT_READY / BLOCKED
Market gate: G3D_OUTREACH_READY
Gate impact: Does not satisfy G3D by itself.

## 1. Purpose

This record initializes the outreach claim guard for the V2.9 market pipeline.

A commercial draft may be prepared internally only when it derives from allowed claim identifiers and preserves the current technical truth. It cannot send messages, create contacted state, claim pilot readiness, claim customers or bypass human approval.

## 2. Allowed Claim Source

Source: `docs/launch/level1/market/v2-063-public-surface-profile.json`

Allowed claim IDs detected: 5

The allowed claim source is mandatory. An empty or missing allowed claim set blocks external outreach rather than expanding claims by interpretation.

## 3. Guard Rules

| Guard | Failure result | Rule |
| --- | --- | --- |
| DRAFT_MUST_USE_ALLOWED_CLAIM_IDS | OUTREACH_DRAFT_BLOCKED | Every outreach draft must derive from allowed_claim_ids. |
| DRAFT_MUST_LABEL_UNPROVEN_CAPABILITIES | PUBLISH_DENIED_OR_REWRITE_REQUIRED | Claims not PROVEN must be labelled UNDER_VALIDATION or PROPOSED. |
| NO_PILOT_READY_CLAIM_WHILE_G2_G5_FALSE | PUBLISH_DENIED | Pilot-ready language is blocked unless applicable technical and pilot gates are true. |
| NO_CUSTOMER_OR_CLIENT_CLAIM_WITHOUT_EVIDENCE | CLAIM_NOT_ALLOWED | Customer, client, buyer or pilot claims require explicit evidence and state. |
| NO_OUTREACH_READY_WITHOUT_QUALIFIED_LEAD | PIPELINE_BLOCKED | OUTREACH_READY requires a qualified lead and LeadEvidenceRecord. |
| NO_CONTACT_WITHOUT_HUMAN_APPROVAL | PIPELINE_BLOCKED | CONTACTED requires approval_ref, channel, recipient_role and message_ref_or_hash. |
| NO_PERSONAL_COMMIT_EMAIL_ROUTE | PRIVACY_POLICY_BLOCK | Commit metadata email cannot be used as contact route. |
| DO_NOT_CONTACT_OVERRIDES_DRAFT | DO_NOT_CONTACT_BLOCK | Opt-out or policy restriction blocks outreach even if draft is claim-safe. |

## 4. Draft Evaluation Fixtures

| Fixture | Expected result | Stimulus |
| --- | --- | --- |
| DRAFT-001 | OUTREACH_DRAFT_BLOCKED | Draft has no allowed_claim_ids_used. |
| DRAFT-002 | OUTREACH_DRAFT_BLOCKED | Draft includes claim outside current allowed set. |
| DRAFT-003 | PUBLISH_DENIED | Draft says pilot-ready while G2/G5 are false. |
| DRAFT-004 | INTERNAL_DRAFT_ONLY_CONTACT_BLOCKED | Draft uses only allowed claims but lead is not qualified and no approval exists. |
| DRAFT-005 | PIPELINE_BLOCKED | CONTACTED state attempted without approval_ref. |
| DRAFT-006 | PRIVACY_POLICY_BLOCK | Draft attempts to use personal commit email as contact route. |

## 5. Explicit Non-Claims

This V2-069 initialization does not claim G3D readiness, qualified lead, complete LeadEvidenceRecord, outreach readiness, contacted state, discovery, customer/client existence, pilot candidate state or pilot readiness.
