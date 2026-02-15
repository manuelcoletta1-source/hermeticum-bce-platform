# hermeticum-bce-platform — EU Operational Identity Infrastructure

Issuer: **HERMETICUM B.C.E. S.r.l.**  
Hallmark: **HERMETICUM - BLINDATA · COMPUTABILE · EVOLUTIVA**

Policy: **UE-first · audit-first · fail-closed · hash-only · append-only · GDPR-min · no public data custody**

---

## Operational truth (fail-closed)

**VALID = SHA256(canonical file) present in `registry/registry.json` + integrity ok**  
Missing match → **INVALID** (fail-closed).

Public registry stores **hash-only** evidence (no personal data custody).

---

## Canonical entrypoints (BCE-style)

- Activate (start here): `/activate/`
- Create IPR Base (EU / Fiscal): `/create/base/`
- Create Operator License (EU): `/create/operator/`
- Registry viewer: `/registry/`
- Verify + Certificate: `/verify/`

Everything else is **documentation / institutional framing / labs** and must route users back to **Activate**.

---

## Flows (canonical)

### 1) Create IPR Base (EU / Fiscal, bank-grade)

Path: `/create/base/`

**Purpose**  
IPR Base is the **fiscal / primary** identity root. From it you can derive operational identities (operators, robots, autonomous units, critical infrastructure).

**Output**
- `HBCE_IPR_FISCAL_RELEASE__*.json`  
  **REAL FILE (client-side only)** — contains bank-grade identity data (CIE/Passport/Tax ID, residence, contacts).
- `HBCE_RECEIPT__*.json`
- `REGISTRY_ENTRY`  
  **PUBLIC HASH-ONLY** — paste into `registry/registry.json` → `entries[]`.

**Privacy**  
Public registry never stores personal data. Only `payload_sha256 + timestamp` (GDPR-min).

---

### 2) Create Operator (EU) — gated issuance (BCE-style)

Path: `/create/operator/`

**Flow**: **CONFIRM → PAY → ISSUE**

1) **CONFIRM (mandatory)**
   - Upload the real `HBCE_IPR_FISCAL_RELEASE__*.json`
   - Compute canonical SHA256
   - Require registry match  
   No match → **STOP** (fail-closed).

2) **PAY (traceable order)**
   - Generate `HBCE_ORDER_REQUEST__*.txt` (manual payment via PEC)
   - Payment confirmation is a manual operator step (GitHub Pages has no backend).

3) **ISSUE (only after payment confirmed)**
   - Generate operator license + receipt + public registry entry

**Output**
- `HBCE_OPERATOR_RELEASE__*.json`  
  **REAL FILE** — operator license (issued only after confirm + payment).
- `HBCE_OPERATOR_RECEIPT__*.json`
- `REGISTRY_ENTRY` (hash-only) to paste into the public registry.

---

### 3) Append to registry (manual)

GitHub Pages cannot write server-side.  
Open `registry/registry.json` in GitHub → paste the entry into `entries[]` → commit.

---

### 4) Verify (fail-closed) + Certificate

Path: `/verify/`

Upload an `IPR_FISCAL_RELEASE` or `OPERATOR_RELEASE` file:
- compute canonical SHA256
- match in registry
- if match → generate `HBCE_CERTIFICATE__*.json` + `.txt`

---

## Notes (EU-first)

- This platform is an **append-only, hash-only** operational verification layer.
- It does not claim to replace EU eIDAS / EUDI Wallet legal identity schemes.
- It is designed for **auditability, minimization, and deterministic verification**.

---
© 2026 HERMETICUM B.C.E. S.r.l.
