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

4. Gate / Entry / Phase-1 route decisions

The following legacy gateway routes have now been classified.

Route	Status	Decision

/gate/	DECLASS_LEGACY_STATIC_DEMO	Rebuilt as noindex legacy fail-closed static demo. Canonical routes are /verify/, /registry/, /joker-c2/, and /matrix-audit-trail/.
/entry/	DECLASS_LEGACY_ENTRY	Rebuilt as noindex legacy entry route. Current workflow uses /create/, /registry/, /verify/, and /matrix-audit-trail/.
/phase-1/	ARCHIVE_HISTORICAL_ROUTE	Rebuilt as noindex historical archive. Not an operational gateway.
/phase-1/onboarding/light.html	ARCHIVE_HISTORICAL_ONBOARDING	Active form removed. Preserved as historical LIGHT onboarding context only.
/phase-1/onboarding/strong.html	ARCHIVE_HISTORICAL_ONBOARDING	Active form removed. Preserved as historical STRONG onboarding context only.



---

5. Operator route decisions

The following operator routes have now been classified or reframed.

Route	Status	Decision

/operator/	KEEP_R_AND_D_BOUNDARY	Rebuilt as R&D operator framework boundary. Not a license, certification, KYC or authority route.
/operator/apply/	R_AND_D_PILOT_INTEREST	Rebuilt as R&D / future pilot expression-of-interest page. Not an active application or onboarding route.
/operator/license/	R_AND_D_LICENSE_CONCEPT	Reframed as operator-license concept only. Not legal license, regulated certification or operator authorization.
/operator/pricing/	R_AND_D_PRICING_CONCEPT	Reframed as future pricing / package concept only. Not an active license sale or commercial offer.
/operator/queue/	R_AND_D_LOCAL_QUEUE_CONCEPT	Reframed as local browser-only queue concept. Not active ticketing, onboarding or support system.
/operator/queue/queue.json	ARCHIVAL_EMPTY_QUEUE_REFERENCE	Updated as archival empty queue / no active onboarding / no license issuance.
/operator/network/	R_AND_D_TOPOLOGY_CONCEPT	Reframed as future topology concept only. Not active operator network or territorial coverage claim.
/operator/pack/	R_AND_D_LOCAL_EVIDENCE_PACK_CONCEPT	Reframed as local evidence-pack concept. Not operator license issuance.
/operator/pack-verify/	R_AND_D_LOCAL_VERIFICATION_TOOL	Reframed as local evidence-pack verifier. Not certification or license validation.
/operator/pack-verify-nuclear/	R_AND_D_HIGH_STRICTNESS_LOCAL_VERIFIER	Reframed as high-strictness local verifier. Not related to nuclear systems or critical-infrastructure authorization.
/operator/operator.js	REGISTRY_V3_PUBLIC_PROOF_CHECK	Aligned with registry v3 public proof semantics; no operator authorization.



---

6. Routes still requiring review

These routes may be historical pages, older entrypoints, commercial surfaces, operator pages, or pages requiring overclaim review.

Route	Proposed status	Review reason

/operator-console/	REVIEW	Console route may imply active authority.
/operator-license/	REVIEW	Separate legacy route may imply commercial/operator certification.
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

7. Deletion policy

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

8. Canonical decision for AI JOKER-C2 routes

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

9. Canonical public proof workflow

The current public proof workflow is:

Private or controlled evidence
→ canonical hash commitment
→ payload_sha256
→ registry v3 public record
→ deterministic verify
→ PUBLIC_RECORD_PRESENT / NO_PUBLIC_RECORD / INVALID / NON_OPERATIONAL

Legacy routes such as /entry/, /gate/, /phase-1/, and legacy operator routes must not be interpreted as current operational, identity, onboarding, licensing, execution, or verification entrypoints.


---

10. Files updated in this review cycle

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

gate/index.html

entry/index.html

phase-1/index.html

phase-1/onboarding/light.html

phase-1/onboarding/strong.html

operator/index.html

operator/apply/index.html

operator/license/index.html

operator/pricing/index.html

operator/queue/index.html

operator/queue/queue.json

operator/network/index.html

operator/pack/index.html

operator/pack-verify/index.html

operator/pack-verify-nuclear/index.html

operator/operator.js



---

11. Current route hierarchy

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

OPERATOR R&D BOUNDARY
/operator/

LEGACY / COMPATIBILITY ROUTES
/ai-joker-c2/
/ai/
/joker/
/gate/
/entry/

HISTORICAL ARCHIVE ROUTES
/phase-1/
/phase-1/onboarding/light.html
/phase-1/onboarding/strong.html

OPERATOR R&D CONCEPT ROUTES
/operator/apply/
/operator/license/
/operator/pricing/
/operator/queue/
/operator/network/
/operator/pack/
/operator/pack-verify/
/operator/pack-verify-nuclear/


---

12. Next review order

Next recommended review order:

1. /operator-console/


2. /operator-license/


3. /operator-playbook/


4. /join-operator/


5. /approve-operator/


6. /b2g/


7. /enterprise/


8. /defense/


9. /io-space/


10. /banca-cibernetica-europea/


11. /eu-pilot/


12. /industry/


13. /horizon/




---

13. Current decision

Deletion is not approved yet.

Current status:

IN_REVIEW — AI / JOKER / GATE / ENTRY / PHASE-1 / OPERATOR ROUTES CLASSIFIED; SEPARATE OPERATOR-LEGACY / B2B / B2G / DEFENSE ROUTES STILL REQUIRE REVIEW

The AI / Joker duplication issue is partially remediated because the canonical route has been established and legacy routes have been declassed instead of deleted.

The Gate / Entry / Phase-1 issue is partially remediated because old operational-looking routes have been declassed or archived instead of deleted.

The operator route issue is partially remediated because the /operator/ subtree has been reframed as R&D, local tooling, concept material, or future pilot interest, without deleting historical artifacts.


