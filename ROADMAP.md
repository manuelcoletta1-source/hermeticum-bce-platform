# HBCE Development Roadmap

**HERMETICUM - BLINDATA · COMPUTABILE · EVOLUTIVA**  
**HERMETICUM B.C.E. S.r.l.**

---

## 0. Purpose

This document outlines the development roadmap of the HBCE Platform.

The roadmap describes the progressive evolution from an R&D public gateway into a controlled IPR-first pilot platform.

The current product hierarchy is:

```text
IPR = base operational product
IPR Base = technical R&D record, not verified identity
IPR Verified = private verification with tax code + valid identity document
IPR Professional = business / audit profile based on IPR Verified
IPR AI Audit Trail = first MVP use case
HBCE = operational ecosystem
JOKER-C2 = runtime demonstrator
MATRIX = architectural framework
```

This roadmap is an R&D planning document. It does not claim production readiness, legal certification, eIDAS qualification, regulated KYC / AML provider status, public authority approval or public-sector adoption.

---

## 1. Phase 1 — IPR-first public platform spine

The first phase establishes the public R&D foundation of the platform.

Key elements:

- IPR product positioning;
- IPR Base model;
- IPR Verified private verification boundary;
- IPR AI Audit Trail MVP positioning;
- HBCE ecosystem framing;
- JOKER-C2 runtime demonstrator framing;
- MATRIX as architectural framework;
- public route consistency;
- public claims and non-claims;
- legal, privacy, security, compliance and governance pages;
- link audit and route audit.

Current target state:

```text
IPR
→ public product page
→ explainer
→ create / activate
→ registry / verify
→ IPR AI Audit Trail
→ legal / claims / security / governance
```

This phase defines the public meaning of the system.

It does not create legal identity, eIDAS qualification, regulated certification or production authorization.

---

## 2. Phase 2 — IPR Base and public proof foundation

The second phase establishes the technical R&D foundation of the platform.

Key elements:

- IPR Base model;
- IPR event protocol;
- EVT event structure;
- OPC proof model;
- registry v3 public proof references;
- verification surfaces;
- verify-pack flow;
- public proof minimization;
- fail-closed validation;
- root policy files;
- public route audit.

Target state:

```text
IPR Base
→ technical R&D record
→ public proof reference
→ registry / verify
→ no verified identity claim
```

This phase defines the minimal operational proof structure of the system.

It does not create legal identity, eIDAS qualification, regulated certification or production authorization.

---

## 3. Phase 3 — IPR AI Audit Trail internal self-pilot

The third phase focuses on the first MVP.

The core MVP is:

```text
IPR AI Audit Trail
```

The MVP converts AI-assisted document work into an audit-ready sequence.

Minimal flow:

```text
IPR operational reference
→ document upload
→ document SHA-256
→ AI-assisted analysis
→ governance decision
→ human validation
→ EVT event
→ OPC proof
→ audit-ready report
```

Internal self-pilot objectives:

- test one controlled AI-assisted document workflow;
- use synthetic, public, owned or expressly authorized non-sensitive documents;
- generate audit-ready reports;
- generate EVT / OPC references;
- inspect registry and verification consistency;
- document first successful internal runs;
- identify production-readiness gaps.

Current internal pilot client:

```text
HERMETICUM B.C.E. S.r.l.
```

This phase proves that the architecture can be reduced to one concrete, testable and commercially understandable workflow.

---

## 4. Phase 4 — IPR Verified private verification model

The fourth phase introduces the IPR Verified model.

IPR Verified is the private-verification profile of the platform.

The target private verification model is:

```text
tax code
→ valid identity document
→ private evidence package
→ IPR Verified record
→ minimized public proof reference
```

Accepted document categories:

- identity card / CIE;
- passport;
- driving license.

Key objectives:

- define private verification boundary;
- separate private evidence from public proof;
- prevent public tax-code custody;
- prevent public document-number custody;
- prevent public identity-document custody;
- add `verification_level` to registry and schemas;
- support `IPR_VERIFIED_PRIVATE_CHECK`;
- maintain fail-closed verification.

Public proof may contain:

- `subject_label`;
- `verification_level`;
- `payload_sha256`;
- `timestamp`;
- `status`;
- `evt_id`;
- `opc_id`.

Public proof must not contain:

- tax code;
- fiscal code;
- codice fiscale;
- document number;
- identity document;
- identity scan;
- passport number;
- driving license number;
- private evidence;
- personal data;
- biometric material.

This phase strengthens the professional startup-grade model while remaining non-custodial and non-certifying at the public layer.

---

## 5. Phase 5 — 30-day external pilot

The fifth phase is the first external pilot path.

The recommended external pilot should remain narrow and controlled.

Suggested pilot format:

```text
duration: 30 days
users: 1–3 authorized operators
documents: 10–20 approved test documents
scope: one AI-assisted document workflow
output: audit-ready report package
final deliverable: pilot evaluation and productization roadmap
```

Pilot objectives:

- test one controlled AI-assisted document workflow;
- use synthetic, public, owned or expressly authorized non-sensitive documents;
- generate audit-ready reports;
- generate EVT / OPC references;
- inspect registry and verification consistency;
- evaluate human validation;
- evaluate report clarity;
- evaluate risk classification usefulness;
- define production-readiness gaps.

Target early reviewers may include:

- compliance consultants;
- AI governance advisors;
- cybersecurity reviewers;
- legal operations teams;
- internal audit teams;
- technical due-diligence reviewers;
- institutional innovation units.

Any pilot involving real sensitive data, regulated data, private evidence or identity verification requires prior legal, privacy, cybersecurity, compliance and operational review.

---

## 6. Phase 6 — Hardening and production-readiness review

The sixth phase assesses whether the R&D MVP can transition toward enterprise-grade readiness.

Key review areas:

- authentication;
- access control;
- storage model;
- private evidence custody model;
- retention model;
- deployment model;
- audit export;
- report verification;
- customer onboarding;
- legal review;
- privacy review;
- cybersecurity review;
- compliance review;
- incident response;
- support process;
- contractual framework.

This phase is a readiness review, not an automatic production launch.

Enterprise readiness requires independent validation and a separate operational framework.

No production SaaS claim should be made until this phase has been scoped, tested and reviewed.

---

## 7. Phase 7 — IPR Professional and B2B packaging

The seventh phase introduces IPR Professional as a pilot / business / audit workflow profile based on IPR Verified.

IPR Professional is not a regulated certification tier.

It is a business packaging layer for controlled pilots and repeatable workflows.

Key objectives:

- define IPR Professional profile;
- define B2B pilot packages;
- define legal, privacy and security boundary documents;
- define repeatable demo flow;
- define pilot pricing model;
- define report export model;
- define partner-facing documentation;
- define customer discovery process.

Potential package areas:

- AI governance audit trail;
- compliance document review;
- cybersecurity policy review;
- internal audit support;
- legal-operations document triage;
- public-sector innovation review;
- vendor / procurement documentation review.

This phase should not claim production-grade SaaS readiness without separate legal, security, privacy, operational and commercial review.

---

## 8. Phase 8 — Institutional / B2G exploration

The eighth phase is a possible later-stage exploration for institutional or B2G contexts.

This phase must not begin from claims of public authority adoption.

It must begin from:

- controlled R&D pilot evidence;
- public/private evidence separation;
- legal basis review;
- procurement review;
- cybersecurity review;
- privacy review;
- human responsibility model;
- auditability requirements;
- data minimization requirements;
- operational resilience requirements.

Potential contexts:

- public-sector innovation units;
- regional digital transformation pilots;
- institutional auditability research;
- EU-oriented governance research;
- critical-infrastructure documentation review.

This phase does not imply public-sector adoption, public authority mandate, procurement award or regulated certification.

---

## 9. Phase 9 — Advanced infrastructure research

In later phases, the infrastructure may evolve into a broader research ecosystem.

Possible directions:

- AI governance infrastructure;
- autonomous system auditability;
- robotic workflow traceability;
- multi-node proof continuity;
- evidence-pack standardization;
- enterprise audit integrations;
- public-sector documentation workflows;
- operational resilience modeling.

All advanced infrastructure research must preserve:

- human responsibility;
- private/public evidence separation;
- fail-closed behavior;
- audit-first documentation;
- public data minimization;
- no public identity custody;
- no unauthorized automation.

Advanced infrastructure research must not be presented as operational deployment, critical-infrastructure authorization, robotics authorization, public-sector adoption or production-grade industrial integration without a separate lawful framework.

---

## 10. Long-term vision

The long-term objective of HBCE Platform is to support technological environments where actions remain attributable, observable and reconstructible over time.

Within the Reality Engineering framework, this enables the development of verifiable technological systems.

The immediate operational path is:

```text
IPR Base
→ IPR Verified
→ IPR AI Audit Trail self-pilot
→ 30-day external pilot
→ hardening and production-readiness review
→ IPR Professional packaging
→ possible institutional exploration
```

The platform remains an R&D system until a pilot, letter of intent, procurement process, partnership or commercial agreement defines the operational and fiscal activation path.

---

## 11. Measurable deliverables

Each phase should produce reviewable deliverables.

Examples:

- working public route;
- updated README / architecture / specification;
- link-audit PASS;
- registry v3 consistency;
- verified `payload_sha256` example;
- internal audit-ready report;
- EVT / OPC reference example;
- pilot intake template;
- privacy / security boundary statement;
- production-readiness gap list;
- external pilot report.

Deliverables should be versioned, reviewable and consistent with public/private evidence separation.

---

## 12. Non-claims

This roadmap does not claim:

- legal certification;
- regulatory approval;
- eIDAS qualification;
- qualified trust-service status;
- regulated KYC / AML provider status;
- public authority approval;
- public-sector adoption;
- external audit certification;
- automated compliance;
- legally binding evidence status by itself;
- financial or banking authorization;
- production-grade enterprise SaaS readiness;
- cybersecurity certification;
- critical-infrastructure authorization;
- robotics or autonomous-system authorization.

Any production deployment, external customer pilot, public-sector use, regulated compliance positioning, real identity-verification operation or institutional integration requires independent legal, cybersecurity, privacy, compliance and operational review.
