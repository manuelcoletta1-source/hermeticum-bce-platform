# HBCE — EU Distributed Node Deployment
## Registro nodi territoriali IPR / JOKER-C2

Questo directory definisce la mappa ufficiale dei nodi europei HBCE.
Fonte unica: `deployment/nodes.json`.

Modalità operativa: **APPEND-ONLY**  
Policy: **UE-FIRST · AUDIT-FIRST · FAIL-CLOSED · HASH-ONLY**

Se i dati non sono coerenti → stato rete non valido.

---

# 1. COSA È UN NODO

Un nodo HBCE è un punto territoriale operativo abilitato a:

- operare con identità IPR VALID
- emettere IPR derivati
- usare moduli software HBCE
- partecipare alla rete JOKER-C2
- coordinare attività locali

Un nodo può essere:

- regionale (Italia)
- nazionale (UE)
- infrastrutturale (hub)

Nodo origine: **Torino (IT)**

---

# 2. REQUISITI MINIMI

Per attivare un nodo servono:

- 1 operatore con IPR VALID
- licenza operativa attiva
- manifest nodo compilato
- hash nodo valido
- append manuale nel registry

Se uno di questi manca → FAIL-CLOSED.

---

# 3. FLUSSO ATTIVAZIONE NODO

## STEP 1 — Operatore
L’operatore deve avere:

- IPR attivo
- stato VERIFY: VALID
- licenza operativa HBCE

## STEP 2 — Manifest nodo
Compilare:

`deployment/node-manifest.template.json`

Campi obbligatori:

- country (ISO-2)
- region (obbligatoria per IT)
- city
- node_hash
- operator
- timestamp ISO-8601

## STEP 3 — Append registry
Inserire snippet in:

`deployment/nodes.json → nodes[]`

Modalità: manual append-only  
Nessuna sovrascrittura.

## STEP 4 — Attivazione
Quando operatore verificato:

- status → ACTIVE
- operator → nome operatore
- node_hash definitivo

---

# 4. REGOLE FORMALI (CATTIVA++)

## STATUS CONSENTITI

ACTIVE PILOT PLANNED

Qualsiasi altro valore → INVALID.

## COUNTRY
Formato ISO-2 maiuscolo.

Esempio:

IT FR DE

## TIMESTAMP
Formato ISO-8601:

YYYY-MM-DDTHH:MM:SSZ

Esempio:

2026-02-17T00:00:00Z

## NODE_HASH
Obbligatorio sempre (anche PLANNED).

Vincoli:
- 10–80 caratteri
- A–Z 0–9 _ -
- mai "PENDING"

Prefissi consentiti:

HBCE- ORIGIN-

Esempio valido:

HBCE-IT-LOMBARDIA-MILANO-PLANNED-0001

Per ACTIVE:

HBCE-IT-LOMBARDIA-MILANO-0001

## OPERATOR
Per ACTIVE:
- non può essere PENDING
- deve essere operatore VALID

---

# 5. FAIL-CLOSED (REGOLA ASSOLUTA)

La rete entra in stato FAIL-CLOSED se:

- hash nodo non valido
- status fuori schema
- operator ACTIVE non valido
- country non ISO
- timestamp errato
- JSON non leggibile

FAIL-CLOSED significa:

- badge rete non valido
- contatori non validi
- stato non operativo

---

# 6. STRUTTURA FILE

deployment/ ├── nodes.json ├── nodes.schema.json ├── node-manifest.template.json └── README.md

`nodes.json` = registro ufficiale  
`schema` = enforcement tecnico  
`manifest` = onboarding operatori  

---

# 7. GOVERNANCE

Gestione:
**HERMETICUM B.C.E. S.r.l.**

Giurisdizione:
Unione Europea

Modalità:
infrastruttura operativa distribuita

Nodo origine:
Torino (Italia)

---

# 8. PRINCIPIO BASE

1 operatore valido  
= 1 nodo attivabile  
= 1 territorio operativo

Espansione:
Italia → UE → Globale


