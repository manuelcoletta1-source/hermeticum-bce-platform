# hbce-evidence\n\n

## PROG-011 P0 EvidenceBundle exporter

Status: implemented as a deterministic Level 1 portable evidence bundle.

Implemented behavior:

- exports a portable EvidenceBundle for pilot and verifier workflows
- includes request envelope, policy decision, critical action, event chain and target receipts
- records schema_set, verification_profile and redaction_profile
- creates deterministic manifest_hash
- creates deterministic evidence_bundle_hash
- verifies bundle integrity and object bindings
- rejects missing target receipts
- rejects tampered policy decisions or target receipts
- rejects request/policy/receipt binding mismatches

Boundary:

- EvidenceBundle supports verification; it does not certify compliance.
- EvidenceBundle supports audit reconstruction; it does not prove legal liability.
- EvidenceBundle contains no commercial pricing logic.
- EvidenceBundle contains no procurement offer.
- EvidenceBundle does not prove physical truth of source data.
