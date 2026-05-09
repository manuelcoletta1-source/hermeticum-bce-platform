# HERMETICUM B.C.E. Platform — Status

**Issuer:** HERMETICUM B.C.E. S.r.l.  
**Primary public product:** IPR — Identity Primary Record  
**Primary verified profile:** IPR Verified  
**Primary public MVP:** IPR AI Audit Trail  
**Operational ecosystem:** HBCE  
**Runtime demonstrator:** JOKER-C2  
**Architectural framework:** MATRiX  
**Current status date:** 2026-05-09  
**Status class:** R&D reference platform / internal self-pilot / verified IPR gateway design  
**Public route audit:** PASS  
**Reference audit file:** `PUBLIC_ROUTE_AUDIT_PASS_2026-05-08.md`

---

## 1. Current platform state

The public HBCE platform is now aligned around an IPR-first product hierarchy and an IPR Verified private-verification model.

IPR is the first operational product. IPR Verified is the private-verification profile. IPR AI Audit Trail is the first MVP use case. JOKER-C2 is the runtime demonstrator. HBCE is the operational ecosystem. MATRiX is the broader architectural framework.

Current state:

```text
PUBLIC_ROUTE_LAYER_CLEAN
IPR_PRODUCT_FIRST
IPR_VERIFIED_PRIVATE_VERIFICATION_MODEL_ACTIVE
IPR_AI_AUDIT_TRAIL_MVP_ACTIVE
HBCE_ECOSYSTEM_ALIGNED
JOKER_C2_RUNTIME_DEMONSTRATOR_ALIGNED
MATRIX_ARCHITECTURAL_FRAMEWORK_ALIGNED
REGISTRY_V3_ALIGNED
REGISTRY_VERIFICATION_LEVELS_ACTIVE
PUBLIC_IDENTITY_GUARDRAILS_ACTIVE
SCHEMA_PUBLIC_IDENTITY_MINIMIZATION_ACTIVE
PROTOCOL_RND_ALIGNED
VERIFY_SURFACE_ALIGNED
VERIFY_PACK_SURFACE_ALIGNED
TOOLS_GUARDRAIL_ALIGNED
OPERATOR_REGISTRY_SURFACE_CLEAN
ROOT_REFERENCE_ALIGNED
CREATE_BASE_RND_ALIGNED
CLAIMS_NON_CLAIMS_ALIGNED
NO_BROKEN_INTERNAL_ROUTES
NO_DECLASSED_ROUTE_REFERENCES
NO_ACTIONABLE_LEGACY_TERMS
PUBLIC_ROUTE_AUDIT_PASS_2026-05-08
```

---

## 2. Primary public spine

The current public spine is:

```text
IPR
→ IPR Verified
→ IPR AI Audit Trail
→ JOKER-C2 runtime demonstrator
→ Registry v3
→ Verify
→ Verify Pack
→ Tools / Link Audit
→ Claims / Legal / Privacy / Terms / Security / Compliance / Governance
→ MATRiX as architectural framework
```

The public platform is presented as an R&D reference surface and internal self-pilot boundary.

It is not presented as a public authority service, regulated certification system, eIDAS qualified trust service, regulated KYC / AML provider, custodial identity service, financial service, automated compliance framework or production-grade enterprise SaaS platform by itself.

---

## 3. IPR product state

IPR, or Identity Primary Record, is the base operational product of the current platform.

The current IPR positioning is:

```text
IPR = base operational product
IPR Base = technical R&D record, not verified identity
IPR Verified = private verification with tax code + valid identity document
IPR Professional = business / audit profile based on IPR Verified
IPR AI Audit Trail = first MVP use case
HBCE = operational ecosystem
JOKER-C2 = runtime demonstrator
MATRiX = architectural framework
HERMETICUM B.C.E. S.r.l. = R&D / operating vehicle
```

IPR is designed to connect:

```text
operational identity reference
→ event context
→ responsibility layer
→ proof material
→ continuity
→ verification
```

IPR does not claim to replace SPID, CIE, EUDI Wallet, eIDAS schemes, civil registries, public identity documents, digital signatures or qualified trust services.

---

## 4. IPR Verified state

IPR Verified is the private-verification profile of the platform.

Target private verification model:

```text
tax code
→ valid identity document
→ private evidence package
→ IPR Verified record
→ hash-oriented public proof reference
→ verification / audit / EVT / OPC
```

Accepted valid identity-document categories:

```text
identity card / CIE
passport
driving license
```

Private verification material belongs only in the private layer.

The public layer must not contain:

```text
tax code
fiscal code
codice fiscale
document number
identity document number
identity card / CIE number
passport number
driving license number
identity document
identity document scan
portrait image
biometric payload
address
birth date
personal payload
private evidence
```

Public proof may contain only minimized references such as:

```text
subject_label
verification_level
payload_sha256
timestamp
status
evt_id
opc_id
audit_state
```

---

## 5. IPR AI Audit Trail MVP

IPR AI Audit Trail is the first MVP use case built around IPR.

It demonstrates a controlled AI-assisted document workflow where the following elements are connected:

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

The first pilot client is HERMETICUM B.C.E. S.r.l. itself, using the system as an internal R&D self-audit pilot before any external customer pilot.

The previous wording “MATRIX AI Audit Trail” may remain in some filenames for continuity, but the updated conceptual perimeter is IPR-first: MATRiX is the architectural framework, not the primary product.

---

## 6. Public route audit result

The latest curated public route audit returned:

```text
BAD ROUTE REFERENCES: OK
ACTIONABLE LEGACY TEXT REFERENCES: OK
BROKEN OR UNREACHABLE INTERNAL ROUTES: OK
AUDIT INTERPRETATION: PASS
```

Final interpretation:

```text
PASS
→ public route layer clean for configured actionable findings

PASS_SCOPE
→ broken routes, deprecated routes and actionable legacy terms were not detected

EXPECTED_REFERENCES
→ legacy strings may remain only in archival audits, schema / forbidden-field lists, guardrail tools or historical filenames
```

Reference:

```text
PUBLIC_ROUTE_AUDIT_PASS_2026-05-08.md
```

---

## 7. Registry v3 state

Registry v3 is aligned to the current R&D public proof boundary.

Current registry model:

```text
hash-oriented public proof references
manual append-only discipline
privacy-minimal metadata
verification_level support
fail-closed verification
no public data custody
no public tax-code custody
no public document-number custody
no public identity-document custody
no private key custody
no financial custody
no regulated certification claim
no public authority claim
no eIDAS qualification claim
no KYC / AML provider claim
```

Supported public verification levels:

```text
IPR_BASE_NOT_VERIFIED
IPR_VERIFIED_PRIVATE_CHECK
IPR_PROFESSIONAL_PILOT
RND_ONLY
NOT_APPLICABLE
```

Cleaned registry surfaces:

```text
registry/
registry/registry.json
registry/ledger.json
registry/ipr_registry.json
registry/operators.json
registry/nodes.json
registry/events.json
registry/append/
registry/publish/
registry/operators/
registry/operators/append/
registry/operators/receipt/
registry/operators/pack/
registry/operators/status/
```

The registry is a technical R&D evidence surface. It does not create legal certification, regulated evidentiary status, eIDAS qualification, regulated KYC / AML compliance, public authority validation or production authorization by itself.

---

## 8. Schema state

The schema layer is aligned to IPR Verified, public identity minimization and verification-level semantics.

Current aligned schemas:

```text
schemas/ipr.schema.json
schemas/hbce-evt.schema.json
schemas/hbce-registry-entry.schema.json
```

The schemas now support or enforce:

```text
IPR_BASE_NOT_VERIFIED
IPR_VERIFIED_PRIVATE_CHECK
IPR_PROFESSIONAL_PILOT
PRIVATE_VERIFICATION_SEPARATION
PUBLIC_PROOF_MINIMIZATION
NO_PUBLIC_TAX_CODE_CUSTODY
NO_PUBLIC_DOCUMENT_NUMBER_CUSTODY
NO_PUBLIC_IDENTITY_DOCUMENT_CUSTODY
NO_KYC_AML_PROVIDER_CLAIM
```

Forbidden public fields include:

```text
tax_code
fiscal_code
codice_fiscale
document_number
identity_document_number
identity_card_number
cie_number
passport_number
driving_license_number
identity_document
identity_document_scan
portrait_image
biometric_payload
private_evidence
personal_data
personal_payload
```

---

## 9. Protocol state

The protocol surface is aligned as an R&D reference bundle.

Current interpretation:

```text
RND_PROTOCOL_REFERENCE_BUNDLE
non-custodial R&D reference
IPR-first product hierarchy
IPR Verified private verification model
IPR AI Audit Trail MVP boundary
not a legal standard
not a regulated certification scheme
not an eIDAS qualified trust service
not a public authority registry
not a regulated KYC / AML provider
not a production compliance framework by itself
```

Protocol reference files:

```text
protocol/
protocol/hbce-protocol-v1.official.json
protocol/hbce-registry-ledger.example.json
protocol/hbce-sign.reference.js
protocol/hbce-verify.reference.js
protocol/hbce-network-architecture-v1.md
protocol/hbce-node-spec-v1.md
protocol/hbce-registry-spec-v1.md
protocol/ipr-event-v1.md
```

---

## 10. Verification state

The verification layer is aligned to IPR Base / IPR Verified / EVT / OPC evidence verification.

Current verification model:

```text
IPR-linked record verification
verification_level inspection
public hash reference lookup
local SHA-256 calculation
registry v3 source check
EVT / OPC evidence support
fail-closed validation
no public data custody
no public tax-code custody
no public document-number custody
no public identity-document custody
no regulated certification claim
no public authority claim
```

Verification result interpretation:

```text
PUBLIC_REFERENCE_PRESENT
→ a public proof reference exists

NO_PUBLIC_RECORD
→ no matching public proof reference was found

NON_OPERATIONAL
→ the registry or verifier state is invalid

INVALID
→ the input is missing, malformed, ambiguous, forbidden or rejected
```

A match does not certify legal validity, legal identity, KYC / AML compliance, cybersecurity assurance, institutional approval, regulated compliance, operator qualification or production authorization.

---

## 11. Tools state

The tools layer is aligned to R&D verification utilities.

Current tools:

```text
tools/
tools/link-audit/
tools/registry-guard.js
```

The link audit separates:

```text
ACTIONABLE LEGACY TEXT REFERENCES
EXPECTED LEGACY / GUARDRAIL REFERENCES
BROKEN OR UNREACHABLE INTERNAL ROUTES
BAD ROUTE REFERENCES
```

This prevents false audit failure when legacy terms appear only in:

```text
archival audit reports
schema forbidden-field lists
verification guardrails
registry guard code
link-audit pattern lists
historical filenames
```

---

## 12. Boundary and non-claims

The current public platform does not claim:

```text
legal certification
regulatory approval
eIDAS qualification
qualified trust-service status
regulated KYC / AML provider status
public-sector adoption
external audit certification
automated compliance
legally binding evidence status by itself
production-grade enterprise SaaS readiness
public authority approval
financial or banking authorization
replacement of SPID / CIE / EUDI Wallet / eIDAS / public registries / qualified trust services
```

Any production deployment, external customer pilot, public-sector use, regulated compliance positioning, real identity-verification operation or institutional integration requires independent legal, cybersecurity, privacy, compliance and operational review.

---

## 13. Next operational step

The next recommended step is to update partner-facing material around the IPR Verified gateway model.

Priority materials:

```text
MATRIX_AI_AUDIT_TRAIL_MVP_BRIEF.md
MATRIX_AI_AUDIT_TRAIL_MVP_ALIGNMENT_2026-05-08.md
I3P_MATRIX_AUDIT_TRAIL_PILOT_NOTE.md
i3p/index.html
contact/index.html
pricing/index.html
README.md
```

Partner-facing message:

```text
IPR is the base operational product.
IPR Base is a technical R&D record.
IPR Verified is the private-verification profile.
IPR AI Audit Trail is the first MVP use case.
JOKER-C2 is the runtime demonstrator.
HBCE is the operational ecosystem.
MATRiX is the architectural framework.
```

The platform is ready for a revised MVP brief, external pilot preparation and partner-facing documentation, while remaining inside the declared R&D/MVP boundary.
