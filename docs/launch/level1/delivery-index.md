# HBCE Level 1 - Delivery Index

Document ID: HBCE-L1-DELIVERY-INDEX-P0
Canonical planning reference: HBCE-B2B-L1-PROG-2027-0001
Specification baseline: V2.3 - 25 September 2026
Launch target: 19 January 2027
Product: Critical Action Evidence Layer for AI-Assisted Enterprise Operations
Status: Internal R&D / L1_DEMO export package
Scope: B2B controlled perimeter only

## 1. Purpose

This document is the entry point for reviewing the HBCE Level 1 demo delivery package.

It links the launch documentation, pricing and qualification pack, demo exports, sample EvidenceBundle fixtures, verifier output and review order.

This index is aligned to V2.3.

This index is not a quotation, not a procurement offer, not a compliance certification, not a legal opinion and not a production service-level agreement.

V2.3 is treated as the current proposed specification baseline for the Level 1 programming path. It does not certify implementation, compliance, source-data truth, legal enforceability or gate completion.

The repository, commits, generated evidence and tests remain the operational source for what has actually been implemented or locally verified.

## 2. Current Package Classification

| Field | Current value |
| --- | --- |
| Evidence profile | L1_DEMO |
| Package status | DEMO_ONLY export package |
| Technical gate status | NOT_ASSESSED unless separately proven by gate record |
| Pilot status | NOT_PILOT_READY |
| Production status | NOT_PRODUCTION_READY |
| Real dispatch status | BLOCKED_UNTIL_G5 |
| Commercial status | Internal pricing hypothesis and qualification material only |
| Runtime pricing logic | ABSENT |
| Procurement offer | ABSENT |

This delivery package can support a demonstrative review of the Level 1 evidence chain. It must not be presented as G2 PILOT_CANDIDATE, G5 PILOT_START_READY, production-ready, legally conclusive, compliance-certified or physically truth-proving.

## 3. Reviewer Start Here

A reviewer should read the package in this order:

1. `docs/launch/level1/README.md`
2. `docs/launch/level1/pricing-and-qualification.md`
3. `docs/launch/level1/delivery-index.md`
4. `docs/launch/level1/delivery-index.json`
5. `evidence/demo/level1/README.md`
6. `evidence/demo/level1/level1-demo-manifest.json`
7. Demo transcript JSON files
8. Demo EvidenceBundle JSON files
9. Demo verification report JSON files
10. `evidence/samples/level1/`
11. `evidence/reports/level1/`
12. `apps/hbce-verifier-cli/README.md`

## 4. Delivery Artifacts

| Category | Path | Purpose |
| --- | --- | --- |
| Launch pack overview | `docs/launch/level1/README.md` | Identifies Level 1 launch-pack documentation and boundaries. |
| Pricing and qualification | `docs/launch/level1/pricing-and-qualification.md` | Defines B2B pilot pricing bands, qualification gate, included/excluded scope and prohibited claims. |
| Human delivery index | `docs/launch/level1/delivery-index.md` | Human-readable delivery index for the Level 1 review package. |
| Machine delivery index | `docs/launch/level1/delivery-index.json` | Machine-readable delivery map for the Level 1 review package. |
| Demo export README | `evidence/demo/level1/README.md` | Explains generated demo artifacts and explicit demo boundaries. |
| Demo export manifest | `evidence/demo/level1/level1-demo-manifest.json` | Lists generated demo artifacts, hashes, PASS/FAIL counts and boundary flags. |
| AI Tool Access transcript | `evidence/demo/level1/ai-tool-access.transcript.json` | Human-readable execution trace for the AI tool access demo. |
| AI Tool Access EvidenceBundle | `evidence/demo/level1/ai-tool-access.evidence-bundle.json` | Portable evidence object for the AI tool access demo. |
| AI Tool Access verification report | `evidence/demo/level1/ai-tool-access.verification-report.json` | Verification result for the AI tool access EvidenceBundle. |
| Bank/Cyber transcript | `evidence/demo/level1/bank-cyber-critical-action.transcript.json` | Human-readable execution trace for the bank/cyber critical action demo. |
| Bank/Cyber EvidenceBundle | `evidence/demo/level1/bank-cyber-critical-action.evidence-bundle.json` | Portable evidence object for the bank/cyber critical action demo. |
| Bank/Cyber verification report | `evidence/demo/level1/bank-cyber-critical-action.verification-report.json` | Verification result for the bank/cyber EvidenceBundle. |
| Sample EvidenceBundle fixtures | `evidence/samples/level1/` | PASS and FAIL sample fixtures used to demonstrate verifier behavior. |
| Sample verification reports | `evidence/reports/level1/` | Stored verifier reports for sample PASS and FAIL fixtures. |
| Verifier CLI | `apps/hbce-verifier-cli/README.md` | Describes how to verify an EvidenceBundle from the command line. |

## 5. Minimum Review Checklist

A reviewer should confirm that:

- both demo exports report `PASS`
- the demo manifest reports `demo_count = 2`
- the demo manifest reports `pass_count = 2`
- the demo manifest reports `fail_count = 0`
- both demo verification reports contain `result = PASS`
- sample fixtures include PASS and FAIL cases
- verifier reports include failure reasons for invalid bundles
- the package is labelled L1_DEMO / DEMO_ONLY
- no G2, G5, G6 or G7 gate is claimed as satisfied by this index
- pricing is documented only in launch-pack documentation
- runtime components do not compute prices
- demo adapters do not perform real dispatch
- receipts do not prove physical truth by themselves
- documents do not claim compliance certification
- documents do not claim legal liability proof
- documents do not claim production readiness

## 6. V2.3 Alignment Notes

V2.3 separates demo evidence from pilot evidence.

For this repository package:

- current exported demo artifacts are L1_DEMO
- mock target receipts remain demo-only
- pilot profiles require additional signed receipt, trust, key, checkpoint, custody and review controls
- real pilot dispatch remains blocked until G5
- commercial interest or budget does not satisfy a technical gate
- repository evidence must be tied to commits, tests, artifact hashes and gate records

## 7. Boundary

The Level 1 delivery package is:

- B2B only
- pilot-candidate preparation material
- technical demonstration material
- evidence and verification material
- demo-only for exported demo artifacts

The Level 1 delivery package is not:

- a defence offer
- a classified-systems offer
- a direct B2G procurement offer
- a compliance certification
- a legal liability proof
- a physical truth proof
- a production readiness claim
- a runtime pricing engine
- a quotation generator
- a procurement-offer generator
- a G2 validation record
- a G5 pilot-start authorization

## 8. Buyer-Facing Summary

HBCE Level 1 currently demonstrates a controlled demo evidence chain for AI-assisted enterprise critical actions: request, authority, scope, policy decision, precommit, receipt, EvidenceBundle and verification.

The exported demo package allows a reviewer to inspect both a normal AI tool access workflow and a bank/cyber critical action workflow with dual-control evidence, without requiring access to real bank, cyber or production systems.
