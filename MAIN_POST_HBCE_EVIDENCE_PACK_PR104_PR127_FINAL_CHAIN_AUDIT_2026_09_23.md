# MAIN POST HBCE Evidence Pack PR104–PR127 Final Chain Audit — 2026-09-23

## Status

PASS.

## Main state

- Previous final chain audit PR104–PR126 commit: `4c0532290efec9b081cce0f97b08dfdd3f931d66`
- PR127 feature commit: `4791b9cc796cf3570460f7e2af08872530608666`
- PR127 merge commit: `fa516944b045ec3916422bfed6eb0202659048ea`
- PR127 checkpoint commit / current main: `77637de6f9bd6e8969fd334257ffaaae8405d3cb`
- Current main: `77637de6f9bd6e8969fd334257ffaaae8405d3cb`
- Origin main: `77637de6f9bd6e8969fd334257ffaaae8405d3cb`

## PR104–PR127 chain verification

- PR104: 10 PASS
- PR105: 10 PASS
- PR106: 10 PASS
- PR107: 10 PASS
- PR108: 10 PASS
- PR109: 10 PASS
- PR110: 11 PASS
- PR111: 12 PASS
- PR112: 12 PASS
- PR113: 13 PASS
- PR114: 13 PASS
- PR115: 13 PASS
- PR116: 13 PASS
- PR117: 14 PASS
- PR118: 15 PASS
- PR119: 16 PASS
- PR120: 17 PASS
- PR121: 18 PASS
- PR122: 20 PASS
- PR123: 22 PASS
- PR124: 25 PASS
- PR125: 20 PASS
- PR126: 21 PASS
- PR127: 21 PASS

## Totals

- Chain total: 356 PASS
- Authorization resolver: 11 PASS
- Authority resolver: 67 PASS
- OPC authority gate: 17 PASS
- Governance total: 95 PASS
- Policy validator: 53 PASS
- Policy payload: 18 PASS
- Policy total: 71 PASS
- Total verified: 522 PASS

## PR127 hashes

- Audit index SHA-256: `6ed9890b47a6b94109ba4b657770e4f89cb2baa077bb22df535c168e8fb3e0e4`
- Audit index payload SHA-256: `e3b7b88886ff62ecaeac87e2c7c02341bc6e99c1d08123a7828cfba094e185ee`
- Runtime SHA-256: `055ac19a6aec3e07c96a69b4b774119a521d895b3744edf7f4684d2af8892c26`
- Test SHA-256: `e4e04532fa639a1565a9b56fdc4d3e33abb26d12379c36f4a54a304325806d7f`
- PR127 checkpoint document SHA-256: `dd97f1ecde32c6641c50c3f7c21de7e5baa57f4617aee3fbb1ea5d3b0362ff10`

## Governance boundary

The PR104–PR127 evidence chain remains internal, deterministic, read-only, observe-only and fail-closed.

PR127 adds the runtime read access decision review package export surface access decision audit index.

The audit index binds the PR126 audit manifest and preserves source audit event, access decision boundary and capability binding snapshots.

Authority resolution remains VALID only as authority resolution and does not grant authorization.

Policy decision remains UNEVALUATED.

Authorization remains UNRESOLVED.

The positive ALLOW probe remains non-authorizing.

Access remains `access_granted=false`.

No runtime action is executed.

No dispatch is created.

No runtime state is mutated.

No public registry or external trust registry is mutated.

No legal certification is created.

No eIDAS qualification is created.

No OPC ALLOW is created.

No deployment proof or production proof is created.

No external review execution, opinion, report, submission or publication is created.

## Result

PR104–PR127 final chain audit is complete.
