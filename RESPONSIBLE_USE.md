# Responsible Use Policy

This document defines the responsible use policy for the HBCE Platform repository.

HBCE Platform is an experimental R&D repository for verifiable technological systems, operational identity, IPR Verified private verification, audit-ready event records, fail-closed governance, and responsibility-preserving AI workflows.

This policy does not modify the repository license. The license defines the legal permissions for use, copying, modification, and distribution. This document defines the intended ethical, defensive, privacy-preserving and governance-oriented use of the project.

---

## 1. Intended use

The materials in this repository are intended for:

- defensive security research;
- AI governance research;
- audit-ready documentation;
- public verification design;
- operational identity research;
- IPR Verified private-verification modeling;
- event-continuity modeling;
- fail-closed governance design;
- compliance-oriented architecture;
- public-sector and institutional decision-support research;
- critical-infrastructure governance research;
- educational and documentation purposes.

The project is designed to support systems where actions, records, identities and governance states remain attributable, reconstructible and verifiable over time.

---

## 2. IPR Verified responsible-use boundary

IPR Verified is the private-verification profile of the IPR model.

IPR Verified may use private identity verification based on:

- tax code / fiscal code;
- identity card / CIE;
- passport;
- driving license;
- private evidence package.

This evidence belongs only in the private verification layer.

It must not be placed in:

- the public repository;
- public registry files;
- public GitHub issues;
- public commits;
- public pages;
- public demos;
- public proof records.

The public layer may contain only minimized proof references such as:

- `subject_label`;
- `verification_level`;
- `payload_sha256`;
- `timestamp`;
- `status`;
- `evt_id`;
- `opc_id`.

Supported public verification levels include:

```text
IPR_BASE_NOT_VERIFIED
IPR_VERIFIED_PRIVATE_CHECK
IPR_PROFESSIONAL_PILOT
RND_ONLY
NOT_APPLICABLE

These labels are technical status indicators. They do not create legal identity, regulated KYC / AML compliance, eIDAS qualification, public authority approval or production authorization by themselves.


---

3. Responsible AI posture

HBCE Platform treats AI as a support layer, not as an autonomous replacement for human or institutional responsibility.

Responsible use requires that AI-assisted workflows remain connected to:

human validation;

responsibility ownership;

policy constraints;

audit metadata;

event continuity;

traceable decision-support records;

public/private data separation;

private verification boundaries where IPR Verified is in scope;

fail-closed escalation when required conditions are missing.


If an AI-assisted workflow cannot preserve accountability, validation, evidence continuity or auditability, it should block, escalate or require human review.


---

4. Defensive cybersecurity use

Security-related use of this repository must remain defensive, authorized and lawful.

Permitted defensive activities include:

reviewing repository-owned code and documentation;

identifying unsafe patterns;

improving security documentation;

strengthening fail-closed logic;

improving audit trails;

reviewing registry and verification assumptions;

reviewing public/private evidence separation;

documenting defensive incident-review workflows;

creating synthetic cybersecurity governance scenarios;

improving responsible disclosure processes.


All security work must be limited to systems, code, data and environments owned by the user or explicitly authorized for analysis.


---

5. Prohibited use

The materials in this repository must not be used to support:

unauthorized access;

exploitation of third-party systems;

malware development;

credential theft;

phishing;

evasion techniques;

persistence mechanisms;

destructive testing;

data exfiltration;

denial-of-service activity;

surveillance without lawful authority;

bypassing authentication or authorization;

misuse of AI systems;

unlawful processing of personal data;

public exposure of private identity evidence;

public exposure of tax codes, document numbers or identity documents;

exposure of confidential or sensitive information;

automation of harmful or unauthorized actions.


The project must not be used to weaken public safety, privacy, institutional accountability or cybersecurity resilience.


---

6. Public data and privacy

The public layer of the project must follow a minimal-data posture.

The repository must not contain:

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


Public verification should use hash-oriented references, minimal metadata and documentation-level examples wherever possible.

If sensitive evidence is required, it must remain outside the public repository and be handled through private, lawful, authorized and security-reviewed channels.


---

7. Private verification and public proof

Responsible use requires a strict distinction between private verification and public proof.

Private verification may involve controlled evidence such as:

tax code
identity card / CIE
passport
driving license
private evidence package

Public proof may involve only minimized references such as:

subject_label
verification_level
payload_sha256
timestamp
status
evt_id
opc_id

A public proof reference means that a public hash-oriented reference exists. It does not certify legal identity, regulated KYC / AML compliance, eIDAS qualification, public authority approval, cybersecurity assurance or production authorization.


---

8. Fail-closed principle

The fail-closed principle is central to the HBCE / IPR / IPR Verified / JOKER-C2 / MATRiX governance model.

A workflow should block, escalate or require human review when:

identity cannot be verified;

private verification evidence is missing where required;

responsibility ownership is missing;

human validation is missing;

registry data is missing or malformed;

evidence continuity cannot be reconstructed;

policy constraints are not satisfied;

audit metadata is incomplete;

sensitive data would be exposed publicly;

tax codes, document numbers or identity documents would be placed in the public layer;

required security controls are unavailable;

the system cannot distinguish between authorized and unauthorized use.


An uncertain success state should not be treated as valid.


---

9. Registry and verification use

Registry and verification materials should be used for public verification, not public custody of sensitive evidence.

Responsible use requires that:

public registry entries remain minimal;

public registry entries may include verification_level;

hash references are preferred over raw sensitive payloads;

verification records are structured and reviewable;

invalid or malformed records are not treated as valid;

sensitive evidence is not placed in public files;

documentation clearly distinguishes between public proof and private evidence;

IPR Verified private evidence remains outside the public registry.


The registry and verifier may indicate public proof presence, but they must not be interpreted as legal identity certification, regulated KYC / AML compliance or eIDAS qualification.


---

10. Documentation integrity

Documentation should distinguish clearly between:

implemented behavior;

prototype behavior;

planned behavior;

conceptual architecture;

R&D reference material;

private verification model;

public proof model;

research hypotheses.


The repository should not overstate operational guarantees that are not implemented.

When a feature is experimental, planned or conceptual, it should be described as such.


---

11. Human responsibility

No use of HBCE Platform should remove responsibility from the human, institution, operator, maintainer or authorized decision-maker.

AI-assisted outputs should be treated as decision-support materials unless a separate lawful, validated and accountable process establishes otherwise.

For regulated, institutional, public-sector, compliance, cybersecurity or critical-infrastructure contexts, human review and responsibility ownership should remain explicit.


---

12. Use in regulated contexts

Use in regulated contexts should consider, where applicable:

privacy and data protection requirements;

cybersecurity obligations;

auditability requirements;

public-sector accountability;

procurement governance;

operational resilience;

human oversight;

records retention;

incident review;

lawful authorization;

jurisdictional limits;

private verification requirements;

public/private evidence separation.


The European regulatory environment is treated as the default reference context for governance analysis.

This does not mean that the platform is certified, approved, endorsed, eIDAS-qualified, regulated as a KYC / AML provider or adopted by any public authority.


---

13. Reporting misuse or unsafe material

If you identify misuse, unsafe material, exposed secrets, sensitive data, public identity-data exposure or a governance weakness in this repository, report it responsibly according to SECURITY.md.

Do not copy, redistribute, exploit, index or amplify sensitive material.


---

14. Research status

HBCE Platform is an experimental research repository.

The materials are provided for documentation, governance experimentation and responsible technical exploration.

They should not be interpreted as:

production-grade security controls;

legal advice;

regulatory certification;

eIDAS qualification;

regulated KYC / AML provider status;

public authority approval;

authorization to perform cybersecurity testing on third-party systems.



---

15. Maintainer statement

This repository is maintained as part of the HBCE Research / HERMETICUM B.C.E. R&D initiative.

The intended direction of the project is defensive, audit-oriented, responsibility-preserving and aligned with verifiable AI governance for regulated technological environments.

IPR Verified strengthens the professional identity-verification model of the platform, but public proof remains minimized, hash-oriented, non-custodial and non-certifying.


