# HBCE Platform — Route Deduplication Review

Review date: 2026-05-07  
Repository: hermeticum-bce-platform  
Maintainer: Manuel Coletta  
Status: IN_REVIEW  
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
/i3p/	KEEP_CANONICAL	I3P-oriented MVP review page for MATRIX AI Audit Trail.
/i3p/demo-node/	KEEP_SUPPORTING_DEMO	Static technical support demo for fail-closed local execution logic.



---

3. AI / Joker route decisions

The following AI / Joker routes have now been classified.

Route	Status	Decision

/joker-c2/	KEEP_CANONICAL	Canonical platform page for AI JOKER-C2.
/matrix-audit-trail/	KEEP_CANONICAL	Canonical public bridge to MATRIX AI Audit Trail MVP.
/ai-joker-c2/	DECLASS_LEGACY_COMPATIBILITY	Rebuilt as legacy compatibility route pointing to /joker-c2/ and runtime demo.
/ai-joker-c2/anchor.json	KEEP_HISTORICAL_ARTIFACT	Public historical anchor artifact updated to HBCE-ANCHOR-v2 / no-public-data-custody model.
/ai-joker-c2/hash.html	DECLASS_LEGACY_TOOL	Retained as noindex legacy SHA-256 helper for anchor artifact; canonical verification is /verify/.
/ai/	DECLASS_LEGACY_COMPATIBILITY	Rebuilt as legacy compatibility route pointing to /joker-c2/ and runtime demo.
/ai/ai-operational-unit.json	KEEP_HISTORICAL_ARTIFACT	Historical public AI operational unit reference updated to v2 no-custody model.
/joker/	DECLASS_LEGACY_LOCAL_TOOL	Rebuilt as noindex legacy local timeline tool pointing to /joker-c2/ and MATRIX AI Audit Trail.



---

4. Routes still requiring review

These routes may be historical pages, older entrypoints, commercial surfaces, operator pages, or pages requiring overclaim review.

Route	Proposed status	Review reason

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

5. Deletion policy

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


Deletion is permitted only after:

1. canonical replacement exists;


2. links have been updated;


3. audit record has been updated;


4. historical artifact value has been evaluated;


5. no active demo or outreach dependency remains.




---

6. Canonical decision for AI JOKER-C2 routes

The canonical platform route is:

/joker-c2/

The current operational runtime remains external:

https://hbce-ai-joker-c2.vercel.app/interface

The current operational MVP demo remains external:

https://hbce-ai-joker-c2.vercel.app/matrix-audit-trail

The platform bridge for the MVP is:

/matrix-audit-trail/

Legacy routes:

/ai-joker-c2/
/ai/
/joker/

are now classified as non-canonical and retained only for compatibility or historical continuity.


---

7. Files updated in this review cycle

Updated files:

ai-joker-c2/index.html

ai-joker-c2/anchor.json

ai-joker-c2/hash.html

ai/index.html

ai/ai-operational-unit.json

joker/index.html

joker-c2/index.html

joker-c2/deployment-roadmap.html

joker-c2/integration-example.html

i3p/index.html

i3p/demo-node/index.html

i3p/demo-node/node.js



---

8. Current route hierarchy

Current hierarchy:

CANONICAL PLATFORM GATEWAY
/

CANONICAL AI JOKER-C2 PLATFORM ROUTE
/joker-c2/

CANONICAL MATRIX AI AUDIT TRAIL PLATFORM BRIDGE
/matrix-audit-trail/

OPERATIONAL AI JOKER-C2 RUNTIME
https://hbce-ai-joker-c2.vercel.app/interface

OPERATIONAL MATRIX AI AUDIT TRAIL MVP
https://hbce-ai-joker-c2.vercel.app/matrix-audit-trail

I3P REVIEW PAGE
/i3p/

STATIC SUPPORT DEMO
/i3p/demo-node/

LEGACY / COMPATIBILITY ROUTES
/ai-joker-c2/
/ai/
/joker/


---

9. Next review order

Next recommended review order:

1. /gate/


2. /entry/


3. /phase-1/


4. /operator/


5. /operator-console/


6. /operator-license/


7. /operator-playbook/


8. /join-operator/


9. /approve-operator/


10. /b2g/


11. /enterprise/


12. /defense/


13. /io-space/


14. /banca-cibernetica-europea/




---

10. Current decision

Deletion is not approved yet.

Current status:

IN_REVIEW — AI / JOKER ROUTES CLASSIFIED; OPERATOR / B2B / B2G / DEFENSE ROUTES STILL REQUIRE REVIEW

The AI / Joker duplication issue is partially remediated because the canonical route has been established and legacy routes have been declassed instead of deleted.


