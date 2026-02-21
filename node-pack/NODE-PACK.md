# NODE-PACK — Canonical Autonomous IPR Node Deployment Specification
Issuer: HERMETICUM B.C.E. S.r.l.
Policy: UE-first · audit-first · fail-closed · hash-only · append-only · GDPR-min · no public data custody

Version: 1.0
Status: CANONICAL
Scope: Autonomous IPR Node (Citizen → Operator → Industrial / B2G)

---

## 1. Purpose

NODE-PACK defines the minimum deterministic specification required to deploy an autonomous IPR node within the HBCE ecosystem.

A node is considered VALID only if:

- canonical SHA256 matches registry entry
- schema integrity passes
- append-only rule respected
- no public personal data stored

Missing one requirement → INVALID (fail-closed).

---

## 2. Node Identity Layer

Each autonomous node MUST generate:

- ED25519 keypair (local-only private key)
- Canonicalized JSON identity file
- Deterministic SHA256 digest

Public registry stores:
- payload_sha256
- timestamp
- optional anchors (BTC / ETH / IPFS)

Private keys NEVER leave local environment.

---

## 3. Required Artifacts

### 3.1 Identity Release (local-only)
HBCE_IPR_RELEASE__*.json  
Contains operational identity data.

Not public. Not uploaded.

---

### 3.2 Receipt (local + public hash)
HBCE_RECEIPT__*.json  

Contains:
- canonical digest
- issuer signature
- integrity metadata

---

### 3.3 Registry Entry (public, hash-only)
Format:

Manual append into:

/registry/registry.json → entries[]

Append-only. No overwrite.

---

## 4. Deterministic Verification Flow

### Step 1 — Canonicalize
Normalize JSON (stable ordering, UTF-8, no whitespace variance).

### Step 2 — Hash
Compute SHA256(canonical_file).

### Step 3 — Match
Check presence in registry.

IF match → VALID  
IF no match → INVALID (fail-closed)

---

## 5. Fail-Closed Rules

Abort issuance if:

- SHA mismatch
- Schema invalid
- Missing registry match
- Signature invalid
- Integrity check fails

System must produce no partial state.
No “almost valid”.
Binary outcome only.

---

## 6. Operator Node Extension

Additional requirements:

- Confirm valid IPR Base
- Manual payment confirmation (traceable order)
- Issuer signature after confirmation
- Public hash entry appended

No backend auto-approval allowed.

---

## 7. Industrial / OEM Deployment Profile

For robotic / AI / infrastructure nodes:

Mandatory:

- Local append-only ledger
- Deterministic receipt generation
- Health check endpoint (read-only)
- External audit reproducibility

Optional:

- Multi-anchor cryptographic timestamping
- Quantum-safe signature layer

---

## 8. Audit Requirements

An external auditor must be able to:

- Recompute SHA256 from canonical file
- Verify signature (ED25519)
- Confirm registry presence
- Validate append-only history
- Confirm no personal data in public layer

Audit must be reproducible without private keys.

---

## 9. Deployment States

| State      | Description                      |
|------------|----------------------------------|
| DRAFT      | Local-only test node             |
| VERIFIED   | Hash present in registry         |
| ACTIVE     | Operational and health-checked   |
| SUSPENDED  | Registry status changed          |

---

## 10. Health Check Model

A valid node must expose:

- registry_match: true/false
- schema_valid: true/false
- integrity_ok: true/false
- signature_valid: true/false

All must be TRUE to be considered ACTIVE.

---

## 11. Append-Only Doctrine

- Registry is immutable except append.
- Historical entries never removed.
- Corrections require new entry.
- Integrity snapshots recommended (sha256 freeze file).

---

## 12. Legal Positioning (UE Context)

This infrastructure:

- does NOT replace eIDAS or EUDI Wallet
- does NOT custody personal data publicly
- operates as deterministic verification layer
- designed for auditability and minimization

---

## 13. Golden Rule

If verification cannot be reproduced deterministically,
the node is INVALID.

No exceptions.
