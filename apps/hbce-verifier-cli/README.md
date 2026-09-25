# hbce-verifier-cli

P0 command-line verifier skeleton for HBCE B2B Level 1 evidence bundles.

Command examples:

- node apps/hbce-verifier-cli/hbce-verifier-cli.js verify BUNDLE_JSON --format json
- node apps/hbce-verifier-cli/hbce-verifier-cli.js verify BUNDLE_JSON --format text

P0 scope:

- EvidenceBundle shape
- manifest_hash
- evidence_bundle_hash
- PolicyDecision hash
- TargetReceipt hash
- request/policy/receipt binding
- no compliance, legal-liability, physical-truth or production-certification claim

Boundary:

This CLI is a P0 verifier skeleton. It does not claim full verifier completeness, regulatory certification, legal attribution, physical truth, production readiness or external audit acceptance.
