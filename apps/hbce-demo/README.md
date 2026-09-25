# hbce-demo

P0 demo adapters for HBCE B2B Level 1 workflows.

## PROG-014 AI Tool Access demo adapter

The AI Tool Access demo adapter builds a deterministic Level 1 flow:

1. RequestEnvelope
2. PolicyDecision
3. CriticalAction precommit
4. append-only demo event chain
5. mock TargetReceipt
6. EvidenceBundle
7. EvidenceBundle verification result

Boundary:

- demo only
- no real AI tool dispatch
- no physical execution
- no compliance certification
- no legal liability proof
- no physical truth proof
- no production readiness claim
