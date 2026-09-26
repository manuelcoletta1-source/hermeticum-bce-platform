# HBCE Level 1 - V2-070 Pipeline State Machine

Document ID: HBCE-L1-V2-070-PIPELINE-STATE-MACHINE
Specification baseline: V2.9 - 25 September 2026
Repository baseline commit: `28a2acfe2aaf5262a66ac151f9a43ce61e50691d`
Status: INITIALIZED_NOT_READY / BLOCKED
Market gate: G9_MARKET_INGRESSION_OPERATIONAL
Gate impact: Does not satisfy G9 by itself.

## 1. Purpose

This record initializes the governed market pipeline state machine for V2.9.

The state machine records allowed transitions, required evidence, reason codes, audit history and opt-out enforcement. It does not create outreach readiness, contacted state, discovery state, customer state or pilot readiness.

## 2. Allowed Transitions

| From | To | Requires | External effect |
| --- | --- | --- | --- |
| DISCOVERED | TECHNICALLY_RELEVANT | source_ref; public_source_registered; technical_signal_rationale | false |
| TECHNICALLY_RELEVANT | ORG_VERIFIED | verified_organization_evidence; owner_type_not_user_only | false |
| ORG_VERIFIED | ROLE_IDENTIFIED | target_role_class; role_to_organization_evidence | false |
| ROLE_IDENTIFIED | QUALIFIED | buyer_problem_evidence; fit_hypothesis; freshness_valid | false |
| QUALIFIED | OUTREACH_READY | LeadEvidenceRecord; allowed_claim_ids; message_draft; Manuel_approval; legal_channel | false |
| OUTREACH_READY | CONTACTED | MessageRef_or_hash; recipient_role; sent_at; channel; approval_ref | true |
| CONTACTED | DISCOVERY | real_interaction; dated_notes; provenance | true |
| DISCOVERY | PILOT_CANDIDATE | problem_statement; target_system; authority_model; evidence_need; constraints; sponsor_or_owner_state | false |
| PILOT_CANDIDATE | PARKED | reason_code; date | false |
| PILOT_CANDIDATE | CLOSED | reason_code; date | false |

## 3. Blocked Transition Fixtures

| From | To | Expected result | Rationale |
| --- | --- | --- | --- |
| TECHNICALLY_RELEVANT | OUTREACH_READY | PIPELINE_BLOCKED | No shortcut from technical signal to outreach readiness. |
| QUALIFIED | OUTREACH_READY | PIPELINE_BLOCKED | Missing LeadEvidenceRecord or Manuel approval. |
| OUTREACH_READY | CONTACTED | PIPELINE_BLOCKED | Missing approval_ref/message_ref/channel/recipient_role. |
| CONTACTED | DISCOVERY | PIPELINE_BLOCKED | Viewed or inferred interest is not real interaction. |
| ANY | DO_NOT_CONTACT | DO_NOT_CONTACT_BLOCK | Opt-out blocks all new outreach. |
| ANY | ANY | SNAPSHOT_INVALID | Untraceable manual state change without audit history. |

## 4. Audit History

Every transition requires an auditable event. External-effect states require human approval references and message references where applicable.

## 5. Opt-Out Rule

Any explicit opt-out or policy restriction creates DO_NOT_CONTACT and blocks new outreach attempts.

## 6. Explicit Non-Claims

This V2-070 initialization does not claim G9 readiness, G3D readiness, outreach readiness, contacted state, discovery, pilot candidate state, pilot readiness or customer/client existence.
