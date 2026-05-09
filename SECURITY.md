# Security Policy

This document defines the security policy for the HBCE Platform repository.

HBCE Platform is an experimental R&D repository for verifiable technological systems, operational identity, IPR Verified private verification, audit-ready event records, fail-closed governance, and responsibility-preserving AI workflows.

The project is defensive, audit-oriented, and research-focused. Responsible disclosure helps improve the security, clarity, and governance reliability of the system.

---

## 1. Security posture

The HBCE Platform follows these security principles:

- defensive security only;
- audit-first documentation;
- fail-closed governance;
- hash-oriented public verification where possible;
- minimal public data exposure;
- no public custody of sensitive personal data;
- no public custody of tax codes, fiscal codes, document numbers, identity documents, identity scans or biometric material;
- no committed secrets, tokens, private keys or credentials;
- clear distinction between IPR Base, IPR Verified and IPR Professional;
- clear distinction between implemented features, prototypes and conceptual architecture.

If a workflow cannot be verified safely, it should block, escalate or require manual review rather than return an uncertain success state.

---

## 2. IPR Verified security boundary

IPR Verified is the private-verification profile of the platform.

The target private verification model may use:

- tax code or fiscal code;
- identity card / CIE;
- passport;
- driving license;
- private evidence package.

This material belongs only in the private verification layer.

The public repository, public registry, public pages, public demos, public issues and public commits must not contain:

- tax codes or fiscal codes;
- document numbers;
- identity document numbers;
- identity card / CIE numbers;
- passport numbers;
- driving license numbers;
- identity documents;
- identity document scans or photos;
- portrait images;
- biometric material;
- private identity evidence;
- personal data or personal payloads.

The public layer may contain only minimized proof references such as:

- subject label;
- verification level;
- payload SHA-256;
- timestamp;
- status;
- EVT reference;
- OPC reference;
- audit state.

The following verification-level labels may appear as public minimized metadata:

```text
IPR_BASE_NOT_VERIFIED
IPR_VERIFIED_PRIVATE_CHECK
IPR_PROFESSIONAL_PILOT
RND_ONLY
NOT_APPLICABLE

These labels do not create legal identity, regulated KYC / AML compliance, eIDAS qualification, public authority approval, cybersecurity assurance or production authorization by themselves.


---

3. Scope

Security reports may concern:

protocol design issues;

registry integrity issues;

verification logic weaknesses;

event structure weaknesses;

fail-closed logic gaps;

documentation inconsistencies that could create unsafe assumptions;

public GitHub Pages deployment risks;

exposed secrets or unsafe environment variable handling;

dependency or configuration risks;

authentication or authorization assumptions, if applicable;

public data minimization failures;

accidental public exposure of tax codes, document numbers, identity documents or private evidence;

risks affecting IPR / IPR Verified / HBCE / EVT / OPC / JOKER-C2 governance behavior.


This repository is primarily a public documentation and gateway layer. Any finding should be limited to repository-owned code, documentation, configuration and public deployment assumptions.


---

4. Out of scope

The following activities are not authorized:

unauthorized access;

exploitation against third-party systems;

destructive testing;

denial-of-service testing;

malware development;

credential theft;

phishing;

evasion techniques;

data exfiltration;

attempts to access private accounts, private infrastructure or private data;

testing outside systems owned or explicitly authorized by the repository maintainer.


Do not submit real secrets, personal data, tax codes, fiscal codes, document numbers, private identity documents, identity scans, customer data, production logs or confidential information in a public issue.


---

5. Reporting a vulnerability

If you discover a potential vulnerability, governance weakness, documentation inconsistency, public identity-data exposure, or structural security issue, report it responsibly.

Preferred reporting method:

Open a GitHub issue if the report contains no sensitive information.

Use GitHub private vulnerability reporting or direct contact if the issue involves sensitive information.


Contact:

manuelcoletta1@gmail.com

Please include:

a clear description of the issue;

affected file, component or documentation area;

potential impact;

whether the issue affects fail-closed behavior;

whether the issue affects public data exposure;

whether the issue affects registry integrity or verification logic;

whether the issue affects IPR Verified private verification boundaries;

whether the issue exposes tax codes, document numbers, identity documents or private evidence;

safe remediation suggestions, if available.



---

6. Report format

Use the following structure when possible:

Title:
Affected component:
Affected file or area:
Issue type:
Severity:
Description:
Potential impact:
Fail-closed relevance:
Public data exposure relevance:
IPR Verified boundary relevance:
Registry / verification relevance:
Suggested mitigation:
Additional notes:

Severity levels:

Critical
High
Medium
Low
Informational


---

7. Responsible disclosure

Please avoid publicly disclosing sensitive vulnerabilities before they have been reviewed.

Responsible disclosure helps preserve the integrity of the repository and prevents avoidable harm.

Good-faith defensive reports are welcome when they remain within the authorized scope and avoid harmful activity.

Do not copy, redistribute, index, store, exploit or amplify exposed sensitive material.


---

8. Handling and response

Security reports will be reviewed according to their severity and relevance to the repository.

Possible outcomes include:

documentation correction;

configuration hardening;

removal of unsafe material;

registry or verification logic revision;

schema hardening;

dependency review;

fail-closed behavior clarification;

private verification boundary clarification;

accepted risk documentation;

issue closure if the report is out of scope or not reproducible.



---

9. Public data and secrets policy

This repository must not contain:

API keys;

private keys;

passwords;

authentication tokens;

wallet private keys;

signing keys;

production secrets;

tax codes;

fiscal codes;

codice fiscale values;

document numbers;

identity document numbers;

identity card / CIE numbers;

passport numbers;

driving license numbers;

identity documents;

identity document scans or photos;

biometric material;

confidential customer data;

private communications;

private identity evidence;

production logs containing personal data;

sensitive operational payloads.


If any such material is discovered, report it immediately and avoid copying, redistributing or exposing it further.


---

10. Public proof and registry policy

The public registry must remain a minimized proof-reference surface.

Allowed public registry material includes:

public minimized labels;

payload SHA-256 values;

verification-level labels;

timestamps;

status fields;

EVT references;

OPC references;

public-safe notes.


The public registry must not contain:

tax codes;

fiscal codes;

document numbers;

identity documents;

document scans;

biometric data;

private evidence;

private prompts;

private AI outputs;

customer files;

internal endpoints;

secrets or credentials.


A public registry match means only that a public proof reference exists.

It does not certify:

legal identity;

regulated KYC / AML compliance;

eIDAS qualification;

qualified trust-service status;

cybersecurity assurance;

institutional approval;

public authority validation;

production authorization.



---

11. MATRIX / HBCE governance relevance

Security reports should be mapped, when relevant, to the IPR / HBCE / JOKER-C2 / MATRiX governance model.

A finding may require fail-closed behavior when it affects:

IPR verification;

IPR Verified private verification;

public proof minimization;

registry verification;

event-chain integrity;

evidence continuity;

human validation;

responsibility ownership;

policy validation;

auditability;

public/private data separation;

secret handling;

deployment safety.


Fail-closed means that the affected workflow should block, escalate or require human review rather than continue with an ambiguous or unsafe state.


---

12. Experimental nature

HBCE Platform is an experimental R&D repository.

Some materials may describe conceptual architecture, prototype behavior or planned components. Unless explicitly implemented and documented as active, such materials should not be interpreted as production-grade security controls.

The platform does not claim:

legal certification;

regulatory approval;

eIDAS qualification;

qualified trust-service status;

regulated KYC / AML provider status;

public authority approval;

public-sector adoption;

external audit certification;

automated compliance;

production-grade enterprise SaaS readiness.


Security practices will evolve as the architecture, documentation, registry logic, private verification boundary and governance model mature.


