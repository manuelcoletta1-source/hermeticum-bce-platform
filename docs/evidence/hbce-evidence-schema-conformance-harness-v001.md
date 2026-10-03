# HBCE Evidence Schema Conformance Harness v001

Basis marker: `HBCE_IPR_ONBOARDING_EVIDENCE_RECORD_DRAFT_FINAL_AUDIT=1`

This document describes a local R&D conformance harness for checking HBCE evidence objects against `HBCE Evidence Object Record v001`.

Canonical target: `HBCE-IPR-ONBOARDING-EVIDENCE-RECORD-DRAFT-V001`.

Run:

```bash
node tools/evidence/validate-evidence-object-conformance.js
```

Expected marker: `EVIDENCE_SCHEMA_CONFORMANCE_HARNESS=PASS`.

Boundary: this harness does not claim production schema registry, legal evidence validation, certification authority, access authorization service, onboarding implementation, dispatch authorization, target receipt, execution trace or effect evidence.

It does not create effect evidence.

Recommended next steps: `PROG-269`, `PROG-270`.
