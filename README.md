# HERMETICUM B.C.E.
## Infrastruttura di responsabilità digitale — UE-first

**Regime:** audit-first · fail-closed · hash-only · no data custody  
**Nodo:** hermeticum-bce-platform  
**Stato:** pilot tecnico pubblico  
**Società:** HERMETICUM B.C.E. S.r.l.  

**Sigillo:**  
HERMETICUM - BLINDATA · COMPUTABILE · EVOLUTIVA  

---

# Sintesi esecutiva

HERMETICUM è un’infrastruttura tecnica progettata per migliorare:

- attribuzione di responsabilità,
- tracciabilità opponibile,
- verificabilità pubblica dei processi digitali.

Introduce un livello operativo chiamato **IPR (Identity Primary Record)**  
che consente verifica deterministica e auditabile senza custodia di dati personali.

Domanda centrale:

> Chi è responsabile di cosa e quando — in modo verificabile da terzi?

---

# Principi fondamentali

## Fail-Closed
Se la verifica non è possibile, il risultato è invalido.

## Audit-First
Ogni output è progettato per essere ispezionabile e comparabile.

## Hash-Only Verification
La verifica usa riferimenti crittografici, non dati personali.

## No Data Custody
Nessuna custodia dati personali per design.

---

# Che cos’è HERMETICUM

Un layer tecnico sopra sistemi esistenti che permette:

- attribuzione verificabile,
- riduzione ambiguità,
- audit ripetibile,
- integrazione B2B e B2G.

Non richiede database centrali di identità.  
Non richiede custodia obbligatoria di dati personali.

---

# Cosa NON è

❌ Non è un identity provider  
❌ Non è un social o database utenti  
❌ Non custodisce dati personali  
❌ Non è sistema di sorveglianza  
❌ Non sostituisce istituzioni legali  

È un’infrastruttura di verifica tecnica.

---

# Architettura (alto livello)

Modello a 5 layer:

1. Identity anchor (identità esterna o sovrana)
2. Attribuzione di responsabilità
3. Traccia append-only
4. Verifica pubblica pass/fail
5. Interoperabilità B2B/B2G

System map:
- `/system.html`
- `/architecture/`

---

# Ingressi principali

Gateway:
- Home → `/`
- Directory → `/NAV.html`
- System map → `/system.html`

Core:
- IPR → `/ipr/`
- Verify → `/verify/`
- Architecture → `/architecture/`
- EU Pilot → `/eu/pilot/`
- Use cases → `/use-cases/`

Contesto:
- Governance → `/governance/`
- Privacy → `/privacy/`
- Security → `/security/`

---

# Modello di verifica

La verifica è:

- deterministica,
- ripetibile pubblicamente,
- comparabile nel tempo,
- con esito PASS | FAIL | INVALID.

INVALID se:
- non esiste riferimento verificabile,
- hash incoerente,
- catena rotta,
- policy non soddisfatta.

Vedi:
`/verify/`

---

# Stato pilot UE

Questo repository è progettato come:

**EU audit-first infrastructure prototype**

Include:
- manifest firmati,
- evidence pack,
- registry append-only,
- mapping eIDAS2/EUDI,
- dossier tecnici.

Non stabilisce autorità legale.  
Non è sistema normativo.

---

# Casi d’uso principali

- Supply chain accountability  
- AI e robotica (responsabilità decisionale)  
- Infrastrutture critiche  
- Governance digitale  
- Sistemi B2B/B2G  

Vedi: `/use-cases/`

---

# Verificabilità pubblica

Questo nodo supporta:

- verifica riproducibile,
- audit comparabile,
- evidenze append-only,
- manifest pubblici.

Vedi:
- `/registry/`
- `/evidence/`
- `/network/`

---

# Governance e limiti

HERMETICUM:

- non sostituisce sistemi legali,
- non crea identità legali,
- non custodisce dati,
- non esercita autorità.

Fornisce chiarezza tecnica verificabile.

---

# Disclaimer

Questo repository documenta un’infrastruttura tecnica in fase pilot.

Non stabilisce:
- identità legali,
- autorità giuridica,
- obblighi di custodia,
- riconoscimento normativo automatico.

Audit-first.  
Fail-closed.  
Hash-only.  
Nessuna custodia dati.

---

# Sigillo

HERMETICUM - BLINDATA · COMPUTABILE · EVOLUTIVA  
HERMETICUM B.C.E. S.r.l.
