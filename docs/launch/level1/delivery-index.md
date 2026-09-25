# HBCE Level 1 - Delivery Index

Document ID: HBCE-L1-DELIVERY-INDEX-P0  
Canonical planning reference: HBCE-B2B-L1-PROG-2027-0001 R1.1  
Launch target: 19 January 2027  
Product: Critical Action Evidence Layer for AI-Assisted Enterprise Operations  
Status: Internal R&D / pilot-candidate delivery index  
Scope: B2B only

## 1. Purpose

This document is the entry point for reviewing the HBCE Level 1 pilot-candidate package.

It links the launch documentation, pricing and qualification pack, demo exports, sample EvidenceBundle fixtures, verifier output and review order.

This index is not a quotation, not a procurement offer, not a compliance certification, not a legal opinion and not a production service-level agreement.

## 2. Reviewer Start Here

A reviewer should read the package in this order:

1. `docs/launch/level1/README.md`
2. `docs/launch/level1/pricing-and-qualification.md`
3. `evidence/demo/level1/README.md`
4. `evidence/demo/level1/level1-demo-manifest.json`
5. Demo transcript JSON files
6. Demo EvidenceBundle JSON files
7. Demo verification report JSON files
8. `evidence/samples/level1/`
9. `evidence/reports/level1/`
10. `apps/hbce-verifier-cli/README.md`

## 3. Delivery Artifacts

| Category | Path | Purpose |
| --- | --- | --- |
| Launch pack overview | `docs/launch/level1/README.md` | Identifies Level 1 launch-pack documentation and boundaries. |
| Pricing and qualification | `docs/launch/level1/pricing-and-qualification.md` | Defines B2B pilot pricing bands, qualification gate, included/excluded scope and prohibited claims. |
| Delivery index JSON | `docs/launch/level1/delivery-index.json` | Machine-readable delivery map for the Level 1 review package. |
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

## 4. Minimum Review Checklist

A reviewer should confirm that:

- both demo exports report `PASS`
- the demo manifest reports `demo_count = 2`
- the demo manifest reports `pass_count = 2`
- the demo manifest reports `fail_count = 0`
- both demo verification reports contain `result = PASS`
- sample fixtures include PASS and FAIL cases
- verifier reports include failure reasons for invalid bundles
- pricing is documented only in launch-pack documentation
- runtime components do not compute prices
- demo adapters do not perform real dispatch
- receipts do not prove physical truth by themselves
- documents do not claim compliance certification
- documents do not claim legal liability proof
- documents do not claim production readiness

## 5. Boundary

The Level 1 delivery package is:

- B2B only
- pilot-candidate material
- technical validation material
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

## 6. Buyer-Facing Summary

HBCE Level 1 demonstrates a controlled evidence chain for AI-assisted enterprise critical actions: request, authority, scope, policy decision, precommit, receipt, EvidenceBundle and verification.

The exported demo package allows a reviewer to inspect both a normal AI tool access workflow and a bank/cyber critical action workflow with dual-control evidence, without requiring access to real bank, cyber or production systems.
