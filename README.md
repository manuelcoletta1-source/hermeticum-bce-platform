# HERMETICUM B.C.E. Platform — Enterprise Infrastructure (EU-first)

Public gateway for **European Sovereign Responsibility Infrastructure**: identity, ex-ante authorization and public verification for AI, robotics and critical systems.

**Live portal:** https://manuelcoletta1-source.github.io/hermeticum-bce-platform/

---

## What this is

A public, modular infrastructure that provides:

- **IPR (Identity Primary Record)** as an operational identity reference
- **Hash-only** public proofs (no personal-data custody)
- **Append-only registry** for receipts and hashes
- **Public verification** with **fail-closed** logic (if not verifiable → INVALID)
- EU-first positioning for institutional and enterprise adoption (B2B/B2G)

---

## What this is not

- Not a data vault
- Not a “KYC database”
- Not a marketing landing page
- Not a redirect-based system

**Rule:** Missing or unverifiable paths are treated as **INVALID**.

---

## Customer flow (minimum)

**CREATE → RECEIPT → REGISTRY → VERIFY**

1) **CREATE** generates a canonical payload and **SHA-256 hash** locally (no custody)  
2) **RECEIPT** generates a **registry entry** (JSON)  
3) **REGISTRY** appends the entry in `registry/registry.json` (append-only)  
4) **VERIFY** performs a live lookup and returns **PASS/INVALID**

---

## Quickstart (operators)

### 1) Create a new IPR hash
Open: `/create/`  
Generate **payload_sha256**.

### 2) Generate receipt entry
Open: `/create/receipt/`  
Paste nickname + payload_sha256 → copy JSON entry.

### 3) Append to registry
Open: `/registry/registry.json` in the repo and append the JSON entry into `entries`.

### 4) Verify
Open: `/verify/`  
Paste payload_sha256 → get PASS/INVALID.

---

## Policies (baseline)

- **UE-first**
- **Audit-first**
- **Fail-closed**
- **Hash-only**
- **No data custody**
- **Append-only**
- **Non-retroactive** consistency (time-derived)

---

## Core routes

- `/enterprise/` — enterprise positioning
- `/infrastructure/` — stack overview
- `/bruxelles/` — institutional EU context
- `/ipr/` — IPR hub (base + UE base)
- `/create/` — create IPR hash (client-side)
- `/create/receipt/` — generate registry entry
- `/registry/` — registry viewer
- `/registry/registry.json` — registry data (append-only)
- `/verify/` — public verification
- `/repos/` — ecosystem directory

---

## Company

**HERMETICUM - BLINDATA · COMPUTABILE · EVOLUTIVA**  
**HERMETICUM B.C.E. S.r.l.**
