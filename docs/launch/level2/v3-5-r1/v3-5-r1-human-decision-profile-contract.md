# HBCE B2G Level 2 - V3.5-R1 HumanDecisionProfile Contract

Document ID: HBCE-L2-V3-5-R1-HUMAN-DECISION-PROFILE-CONTRACT

This artifact establishes the HumanDecisionProfile contract and validator baseline for V3.5-R1.

Human-grounded authority does not mean a click is authority. The decision must be profile-bound, actor-bound, action-digest-bound, fresh and evidence-bound.

Timeout never creates auto-approval.

A stale decision never creates auto-approval.

A material change to action digest, authority path, mandate, policy, scope or target requires a new decision.

A replayed decision cannot authorize a materially different action.

Emergency profile configuration does not create public authority.

This contract closes L2-GAP-004 as contract and validator baseline only.

This contract does not claim full Level 2 runtime completion, B2G_CANDIDATE readiness, production readiness, public accreditation, procurement eligibility, legal validity, government endorsement or external validation completion.

Next required program: PROG-047-V3-5-R1-ADAPTER-PROVENANCE-PROFILE-CONTRACT.
