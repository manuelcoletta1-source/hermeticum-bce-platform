# HBCE Platform — Route Deduplication Review

Review date: 2026-05-07  
Repository: hermeticum-bce-platform  
Maintainer: Manuel Coletta  
Status: OPEN  
Purpose: classify duplicate, legacy, canonical, declassed and redirect-worthy public routes before deletion.

---

## 1. Purpose

This document records the route deduplication review for the HBCE Platform repository.

The repository contains multiple public folders created across different development phases. Some folders are canonical, some are legacy, some are historical, and some may duplicate newer public gateway pages.

No route should be deleted before classification.

The correct sequence is:

```text
classify → declass/redirect → update navigation → update audit → delete only if safe


---

2. Canonical routes

These routes should remain primary public entrypoints.

Route	Status	Reason

/	KEEP_CANONICAL	Public platform gateway.
/matrix-audit-trail/	KEEP_CANONICAL	Public bridge to MATRIX AI Audit Trail MVP.
/joker-c2/	KEEP_CANONICAL	Public AI JOKER-C2 gateway in the platform.
/verify/	KEEP_CANONICAL	Public proof verification gateway.
/registry/	KEEP_CANONICAL	Public proof registry v3 gateway.
/claims/	KEEP_CANONICAL	Claims and non-claims boundary page.
/compliance/	KEEP_CANONICAL	Compliance posture page.
/security/	KEEP_CANONICAL	Security model page.
/governance/	KEEP_CANONICAL	Governance model page.
/legal/	KEEP_CANONICAL	Legal and policy overview.
/privacy/	KEEP_CANONICAL	Privacy overview.
/terms/	KEEP_CANONICAL	Terms overview.
/schemas/	KEEP_CANONICAL	JSON schemas and registry v3 validation.
/docs/	KEEP_CANONICAL	Documentation hub.



---

3. Routes requiring review

These routes may be duplicates, historical pages, older entrypoints, or pages requiring overclaim review.

Route	Proposed status	Review reason

/ai-joker-c2/	REVIEW	Possible duplicate of /joker-c2/.
/ai/	REVIEW	May be an old AI unit page.
/joker/	REVIEW	May be a legacy Joker console/page.
/gate/	REVIEW_DECLASS	Legacy execution gate path.
/entry/	REVIEW_DECLASS	Already described as non-canonical in prior commits.
/phase-1/	REVIEW_ARCHIVE	Historical phase route.
/operator/	REVIEW	Operator route may contain legacy authority claims.
/operator-console/	REVIEW	Console route may imply active authority.
/operator-license/	REVIEW	License route may imply commercial/operator certification.
/operator-playbook/	REVIEW	Training/playbook content needs boundary review.
/join-operator/	REVIEW	Commercial/operator onboarding overclaim risk.
/approve-operator/	REVIEW	Approval console overclaim risk.
/b2g/	REVIEW	B2G claims need R&D/pilot boundary.
/enterprise/	REVIEW	Enterprise claims need R&D/pilot boundary.
/industry/	REVIEW	Industrial claims need R&D/pilot boundary.
/horizon/	REVIEW	Institutional claims need R&D/pilot boundary.
/eu-pilot/	REVIEW	Pilot language needs no-adoption boundary.
/defense/	REVIEW	Dual-use/security claims require defensive boundary.
/io-space/	REVIEW	Dual-use operational scope review.
/banca-cibernetica-europea/	REVIEW	Strong institutional wording likely needs boundary review.



---

4. Deletion policy

Do not delete a public route immediately if:

it is linked from another page;

it has been cited in outreach;

it has audit/history value;

it may be indexed;

it contains unique documentation;

it may be part of prior evidence.


Prefer one of these actions first:

add declass notice;

add redirect to canonical route;

archive as historical;

update navigation;

remove from homepage/sitemap only;

document deprecation in audit file.



---

5. Canonical decision for AI JOKER-C2 routes

The canonical platform route should be:

/joker-c2/

The operational runtime demo remains external:

https://hbce-ai-joker-c2.vercel.app/interface
https://hbce-ai-joker-c2.vercel.app/matrix-audit-trail

Possible duplicate routes:

/ai-joker-c2/
/ai/
/joker/

should be reviewed and either redirected or marked as historical/non-canonical.


---

6. Next review order

1. /joker-c2/


2. /ai-joker-c2/


3. /ai/


4. /joker/


5. /operator/


6. /operator-console/


7. /operator-license/


8. /b2g/


9. /enterprise/


10. /defense/




---

7. Current decision

No deletion approved yet.

Current status:

OPEN — ROUTE CLASSIFICATION STARTED; FILE-LEVEL REVIEW REQUIRED

