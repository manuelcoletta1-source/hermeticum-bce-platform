# DEPLOYMENT — Italia + UE (Nodi operativi)

Questa cartella definisce la governance di deployment HBCE:
**1 nodo per regione italiana + 1 nodo per nazione UE**.

Obiettivo: rete federata, verificabile, scalabile con requisiti minimi.

---

## File ufficiali

- `deployment/nodes.json`
  - Registro pubblico dei nodi (APPEND-ONLY).
  - Pubblica solo prove minimizzate (HASH-ONLY).
- `deployment/nodes.schema.json`
  - JSON Schema ufficiale per validazione (FAIL-CLOSED).
- `deployment/node-manifest.template.json`
  - Template canonico per calcolare `node_hash` in modo deterministico.

---

## Principi (istituzionale)

- **UE-FIRST**: baseline normativa UE.
- **AUDIT-FIRST**: ogni nodo deve essere verificabile e ispezionabile.
- **FAIL-CLOSED**: se non verificabile → NON operativo.
- **HASH-ONLY**: nessuna custodia pubblica di dati personali; solo prove minimizzate.
- **APPEND-ONLY**: nessuna riscrittura; solo aggiunte in coda.
- **GDPR-MIN**: minimizzazione dei dati pubblici.
- **NO_PUBLIC_DATA_CUSTODY**: non pubblicare dati personali; usare hash.

---

## Cosa è un “Nodo”

Un nodo è un punto operativo territoriale che abilita:
- emissione IPR (derivati) tramite operatore licenziato
- verifica registry / identità
- certificazione eventi (IO-SPACE)
- accesso mercato software per livelli di responsabilità

Un nodo è valido solo se:
- operatore con IPR **VALID** (match nel registry IPR)
- licenza operativa attiva
- capability di verifica e registrazione
- rispetto delle policy (append-only, hash-only, fail-closed)

---

## Stato nodo

Valori ammessi (standard):
- `PLANNED` (previsto)
- `PILOT` (pilot attivo)
- `ACTIVE` (operativo)
- `SUSPENDED` (sospeso / non operativo)

Regola:
- se lo stato è `ACTIVE` ma non verificabile → considerare `SUSPENDED` (fail-closed).

---

## nodes.json (APPEND-ONLY)

Regola assoluta:
- **NON modificare** le entry esistenti.
- **NON riordinare** le entry.
- **SOLO aggiungere** nuove entry in coda.

Ogni entry rappresenta un nodo territoriale e deve includere:
- `country` (ISO 2 lettere, es. IT, FR, DE)
- `status`
- `node_hash`
- `operator` (ROOT o payload_sha256 dell’IPR operatore)

Consigliato:
- `region`
- `city`
- `timestamp` (ISO 8601 UTC)
- `note`

---

## Validazione (FAIL-CLOSED)

`nodes.json` è considerato valido solo se:
- rispetta `nodes.schema.json`.

Se lo schema non matcha:
- considerare il registry nodi **INVALID**
- trattare deployment come **FAIL-CLOSED**

---

## node_hash (deterministico)

`node_hash` deve essere calcolato da un manifest canonico:

1) Copiare `deployment/node-manifest.template.json`
2) Compilare i campi reali:
   - `node.country`, `node.region`, `node.city`, `node.status`, `node.deployment_scope`
   - `operator.ipr_payload_sha256`
   - `operator.license`
3) Canonicalizzare il JSON (chiavi ordinate, serializzazione deterministica)
4) Calcolare:
   - `node_hash = SHA-256(canonical_manifest)`

Il `node_hash` è la prova pubblica minimizzata del nodo.

---

## Procedura di attivazione territorio (passi)

1) Attivare IPR (release file)
2) Verificare IPR: deve risultare **VALID** nel registry IPR
3) Acquisire licenza operativa
4) Attivare il nodo (pilot o active)
5) Generare `node_hash` dal manifest canonico
6) Appendere una nuova entry in `deployment/nodes.json` (APPEND-ONLY)
7) Rendere il nodo operativo: verify + registry + operator zone + IO-SPACE

---

## Esempio entry (da aggiungere in coda)

```json
{
  "region": "Lombardia",
  "country": "IT",
  "city": "Milano",
  "status": "PILOT",
  "node_hash": "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
  "operator": "bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb",
  "timestamp": "2026-02-17T10:00:00Z",
  "note": "Pilot regionale"
}
