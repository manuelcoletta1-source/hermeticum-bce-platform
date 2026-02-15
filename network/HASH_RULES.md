# HBCE — HASH RULES (deterministic)

Queste regole rendono **riproducibile** (auditabile) il calcolo di `operator_payload_sha256`
per i record del ledger `EU_OPERATOR_NETWORK_LEDGER`.

## Algorithm
- Hash: **SHA-256**
- Encoding: **UTF-8**
- Output: **hex lowercase** (64 caratteri)

## Canonical input string (v1)
Per ogni record `OPERATOR_ADDED` il digest si calcola sulla seguente stringa:

HBCE|OPERATOR|v1|{operator_name}|{country}|{region}|{city}|{role}|PARENT={parent_operator_sha256_or_-}

Dove:
- `operator_name` = esattamente quello scritto nel record
- `country`, `region`, `city`, `role` = esattamente quelli scritti nel record
- `parent_operator_sha256_or_-` =
  - `parent_operator_sha256` se presente
  - altrimenti `-`

## Notes
- La presenza del `PARENT=...` rende l’identità “derivata” e quindi **catena verificabile**.
- Il record ROOT (Manuel Coletta) può usare un digest già certificato da HBCE (es. licenza operatore),
  ma *tutti gli altri* nodi del ledger devono essere calcolabili con questa regola.
