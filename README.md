# hermeticum-bce-platform — EU Operational Identity Infrastructure

Issuer: **HERMETICUM B.C.E. S.r.l.**  
Hallmark: **HERMETICUM - BLINDATA · COMPUTABILE · EVOLUTIVA**

Policy: UE-first · audit-first · fail-closed · hash-only · append-only · GDPR-min · no public data custody

## Operational truth
**VALID = SHA256(file canonico) presente in `registry/registry.json` + integrità ok**  
Se manca match → **INVALID** (fail-closed).

## Flows

### 1) Create IPR Base (EU)
Path: `/create/base/`
Output:
- `HBCE_IPR_RELEASE__*.json`
- `HBCE_RECEIPT__*.json`
- `REGISTRY_ENTRY` (da incollare nel registry)

### 2) Create Operator License (EU)
Path: `/create/operator/`
Output:
- `HBCE_OPERATOR_LICENSE__*.json`
- `REGISTRY_ENTRY` (da incollare nel registry)

### 3) Append to registry (manual)
GitHub Pages non scrive sul server.
Apri `registry/registry.json` in GitHub → incolla l’entry dentro `entries[]` → commit.

### 4) Verify (fail-closed)
Path: `/verify/`
Carica `IPR_RELEASE` o `OPERATOR_LICENSE`:
- calcolo SHA256 canonico
- match in registry
- se match → genera `HBCE_CERTIFICATE__*.json` e `.txt`
