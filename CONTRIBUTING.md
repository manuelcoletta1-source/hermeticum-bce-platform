# Contributing to HBCE Platform

Thank you for your interest in contributing to the HBCE Platform.

HBCE Platform is an experimental R&D repository for verifiable technological systems, operational identity, IPR Verified private verification, audit-ready event records, fail-closed governance, and responsibility-preserving AI workflows.

Contributions should improve the clarity, safety, auditability, documentation quality, public/private evidence separation, or governance consistency of the project.

---

## 1. Project status

HBCE Platform is currently an experimental research infrastructure.

Some materials may describe conceptual architecture, planned components, or prototype-level governance models. Unless a feature is explicitly implemented and documented as active, it should be treated as experimental, planned, or documentary rather than production-ready.

Contributors should avoid language that overstates the operational maturity of the repository.

The repository now uses the following product hierarchy:

```text
IPR = base operational product
IPR Base = technical R&D record, not verified identity
IPR Verified = private verification with tax code + valid identity document
IPR Professional = business / audit profile based on IPR Verified
IPR AI Audit Trail = first MVP use case
HBCE = operational ecosystem
JOKER-C2 = runtime demonstrator
MATRiX = architectural framework
```

---

## 2. Types of contributions

Contributions may include:

- documentation improvements;
- protocol refinements;
- governance model clarifications;
- registry structure improvements;
- schema hardening;
- verification logic proposals;
- fail-closed behavior clarifications;
- security policy improvements;
- audit documentation;
- bug reports;
- typo and formatting corrections;
- architectural discussions.

All contributions must remain defensive, lawful, authorized, and compatible with the repository’s governance posture.

---

## 3. Repository structure

The repository may include the following areas:

- `docs/` — conceptual and framework documentation;
- `docs/ipr/` — Identity Primary Record documentation;
- `docs/joker-c2/` — JOKER-C2 documentation;
- `docs/hbce/` — HBCE infrastructure documentation;
- `docs/matrix/` — MATRiX governance and architecture documentation;
- `docs/glossary/` — terminology and conceptual references;
- `registry/` — public registry or verification structures, if present;
- `protocol/` — protocol specifications, if present;
- `schemas/` — JSON schemas for public proof, EVT, IPR and registry structures;
- audit files — defensive audit traces and governance review records.

Root documents describe the public architecture, security posture, contribution rules, privacy posture and governance context of the project.

---

## 4. Governance principles for contributions

Contributions should preserve the following principles:

- **EU-first** governance orientation;
- **audit-first** documentation;
- **fail-closed** workflow assumptions;
- **hash-oriented public verification** where possible;
- **minimal public data exposure**;
- **no public custody of sensitive personal data**;
- **no public custody of tax codes, document numbers or identity documents**;
- **clear separation between public verification and private evidence**;
- **clear separation between IPR Base and IPR Verified**;
- **responsibility-preserving AI governance**;
- **human validation for regulated or sensitive workflows**.

If a proposed change weakens these principles, it should be clearly justified and reviewed before merging.

---

## 5. Security and privacy requirements

Do not commit or submit:

- API keys;
- private keys;
- passwords;
- authentication tokens;
- wallet private keys;
- signing keys;
- production secrets;
- tax codes;
- fiscal codes;
- codice fiscale values;
- document numbers;
- identity document numbers;
- identity card / CIE numbers;
- passport numbers;
- driving license numbers;
- identity documents;
- identity document scans or photos;
- biometric material;
- private identity evidence;
- confidential customer data;
- private communications;
- private prompts;
- private AI outputs;
- production logs containing personal data;
- sensitive operational payloads.

Use placeholders in examples.

Recommended placeholder format:

```text
OPENAI_API_KEY=your_openai_api_key_here
PRIVATE_KEY=your_private_key_here
REGISTRY_SECRET=your_registry_secret_here
IPR_PUBLIC_LABEL=IPR_PUBLIC_REFERENCE_001
DOCUMENT_HASH=sha256:<64-hex>
VERIFICATION_LEVEL=IPR_BASE_NOT_VERIFIED
```

For IPR Verified examples, use category labels only:

```text
PRIVATE_VERIFICATION_CATEGORY=TAX_CODE
PRIVATE_VERIFICATION_CATEGORY=IDENTITY_CARD_OR_CIE
PRIVATE_VERIFICATION_CATEGORY=PASSPORT
PRIVATE_VERIFICATION_CATEGORY=DRIVING_LICENSE
```

Do not include actual tax codes, document numbers, document scans, identity documents or private evidence.

If you discover sensitive material in the repository, do not copy or redistribute it. Report it immediately according to `SECURITY.md`.

---

## 6. Out-of-scope contributions

The following contributions are not accepted:

- offensive cybersecurity tooling;
- exploit instructions;
- malware development;
- credential theft techniques;
- evasion techniques;
- unauthorized access methods;
- destructive testing instructions;
- data exfiltration techniques;
- surveillance features;
- attempts to bypass authorization or privacy controls;
- changes that expose personal or sensitive data in the public layer;
- changes that introduce tax codes, document numbers, identity documents or private evidence into public files;
- changes that present IPR Verified as regulated KYC / AML compliance, eIDAS qualification or legal identity certification.

Security-related contributions must remain defensive, authorized, and limited to systems owned or explicitly authorized by the maintainer.

---

## 7. Documentation standards

Documentation contributions should be:

- clear;
- structured;
- consistent with existing terminology;
- explicit about experimental status;
- careful not to overstate implemented functionality;
- aligned with the repository’s audit-first and fail-closed posture;
- aligned with private/public evidence separation;
- aligned with the IPR Base / IPR Verified / IPR Professional profile model.

When describing a component, distinguish between:

- implemented behavior;
- prototype behavior;
- planned behavior;
- conceptual architecture;
- public proof reference;
- private verification model;
- R&D hypothesis.

This distinction is important for safety, credibility and auditability.

---

## 8. Proposing changes

To propose a change:

1. Fork the repository.
2. Create a new branch.
3. Implement the proposed modification.
4. Check that the change does not introduce secrets or sensitive data.
5. Check that the change does not introduce tax codes, document numbers, identity documents or private evidence in public files.
6. Check that the change remains consistent with the security policy.
7. Submit a pull request.
8. Explain the motivation and governance relevance of the change.

Pull request descriptions should include:

```text
Summary:
Affected files:
Reason for change:
Security impact:
Privacy impact:
IPR Verified boundary impact:
Public proof impact:
Fail-closed relevance:
Documentation status:
```

---

## 9. Issues and audit traces

Issues may be used for:

- bug reports;
- documentation improvements;
- security and governance review;
- audit cycles;
- registry or verification questions;
- conceptual clarification;
- planned implementation work.

For defensive audit work, use the following structure:

```text
Audit cycle:
Affected area:
Finding or question:
Potential impact:
Suggested remediation:
Fail-closed relevance:
Public data exposure relevance:
IPR Verified boundary relevance:
Status:
```

Do not include confidential information, private data, secrets, tax codes, document numbers, identity documents or sensitive operational details in public issues.

---

## 10. Infrastructure contributions

Future infrastructure contributions may include:

- node specifications;
- event protocol extensions;
- registry improvements;
- schema improvements;
- verification logic improvements;
- public gateway hardening;
- audit record templates;
- AI governance workflow examples;
- JOKER-C2 fail-closed mapping;
- defensive cybersecurity governance scenarios.

Infrastructure contributions must not introduce unsafe automation, unauthorized access paths, public custody of sensitive data or public custody of identity-verification evidence.

---

## 11. Review criteria

A contribution may be accepted if it:

- improves clarity, structure, safety or auditability;
- aligns with the repository’s governance posture;
- avoids unnecessary personal or sensitive data;
- does not introduce secrets;
- does not introduce tax codes, document numbers, identity documents or private evidence in public files;
- does not enable harmful or unauthorized activity;
- clearly distinguishes implemented features from planned or conceptual material;
- supports verifiable, responsibility-preserving and fail-closed workflows;
- preserves the distinction between private verification and public proof.

A contribution may be rejected or deferred if it:

- weakens security or privacy;
- introduces ambiguous operational claims;
- exposes sensitive data;
- exposes tax codes, document numbers, identity documents or private evidence;
- conflicts with the security policy;
- enables offensive misuse;
- creates unclear responsibility or validation assumptions;
- presents public proof as legal identity, regulated certification, eIDAS qualification, KYC / AML compliance or public authority approval.

---

## 12. Project philosophy

HBCE Platform does not aim to present a finished production system prematurely.

Its purpose is to explore and document technological environments where actions, records, identities and governance states remain attributable, reconstructible and verifiable over time.

The project treats AI as a support layer that must remain connected to human validation, responsibility ownership, policy constraints, auditability and evidence continuity.

IPR Verified strengthens the professional identity-verification model of the platform, but public proof remains minimized, hash-oriented, non-custodial and non-certifying.

The long-term objective is to make verifiable technological infrastructure clearer, safer and more usable for institutional, cybersecurity, compliance, public-sector and critical-infrastructure research contexts.


