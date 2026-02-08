# HERMETICUM B.C.E. — MANIFEST (v1)

**Regime:** UE-first · audit-first · fail-closed · hash-only · no data custody  
**Nodo:** `hermeticum-bce-platform` (gateway pubblico)  
**Società:** HERMETICUM B.C.E. S.r.l.  
**Sigillo:** HERMETICUM - BLINDATA · COMPUTABILE · EVOLUTIVA

---

## 1) Scopo

Questo repository documenta e pubblica un **prototipo infrastrutturale** per:

- attribuzione di responsabilità digitale,
- tracciabilità opponibile nel tempo,
- verifica pubblica deterministica (PASS/FAIL),

senza custodia di dati personali e senza sostituzione delle istituzioni esistenti.

La domanda a cui risponde è tecnica:

> **Chi è responsabile di cosa e quando — in modo verificabile da terzi?**

---

## 2) Principi non negoziabili (core)

### Fail-Closed
Se la verifica non è possibile, l’esito è **INVALID**.

### Audit-First
Ogni output è progettato per essere ispezionabile e confrontabile.

### Hash-Only Verification
La verifica usa riferimenti crittografici (hash / receipt / manifest), non dati grezzi.

### No Data Custody
Il sistema non custodisce dati personali. Minimizzazione per design.

---

## 3) Che cos’è HERMETICUM (in sintesi)

HERMETICUM è un **layer di attribuzione e verifica** sopra sistemi esistenti.

- Non richiede un database centrale di identità.
- Non richiede che i dati personali siano pubblicati.
- Produce condizioni verificabili (prove) e un esito deterministico.

---

## 4) Cosa NON è (limiti espliciti)

- ❌ Non è un identity provider
- ❌ Non è un database utenti
- ❌ Non è un sistema di sorveglianza o scoring
- ❌ Non prende decisioni al posto delle istituzioni
- ❌ Non crea automaticamente identità legali

Questo repository descrive un’infrastruttura tecnica **pilot-ready**, non una norma.

---

## 5) Modello operativo (alto livello)

HERMETICUM segue una struttura a 5 layer:

1. **Identity anchor** (identità esterna o sovrana; non custodita qui)
2. **Attribuzione di responsabilità** (chi risponde di cosa e quando)
3. **Traccia append-only** (opponibilità nel tempo)
4. **Verifica pubblica PASS/FAIL** (deterministica, ripetibile)
5. **Interoperabilità** (integrazione B2B/B2G, eIDAS/EUDI mapping)

---

## 6) Ingressi principali (UI)

- Home: `/index.html`
- Directory canonica: `/NAV.html`
- System map (vista dossier): `/system.html`

Ingressi core:
- IPR: `/ipr/`
- Verify: `/verify/`
- Architecture: `/architecture/`
- EU Pilot: `/eu/pilot/`
- Use cases: `/use-cases/`
- Governance: `/governance/`
- Privacy: `/privacy/`
- Security: `/security/`

---

## 7) Verifica e riproducibilità (PASS/FAIL)

La verifica pubblica deve essere:

- deterministica,
- ripetibile,
- comparabile nel tempo,
- con esito PASS/FAIL,
- e con esito **INVALID** se mancano condizioni verificabili.

Vedi:
- `/verify/`
- `/tech/` (checklist fail-closed)
- `LINKCHECK-M1.md` (controllo coerenza link/ingressi)

---

## 8) Evidence, registry, rete

Questo repository contiene strumenti e contenuti per:

- evidence pack dimostrativi,
- registri append-only,
- preparazione di “node pack” e percorsi di adozione.

Vedi:
- `/evidence/` e `/evidence-pack/`
- `/registry/` e `/network/`
- `/NODE-PACK/` (pack di deployment nodo autonomo)

---

## 9) Normative mapping (UE)

Il repository include una mappatura eIDAS2 / EUDI in logica **non-equivalente**:
non afferma “conformità legale automatica”, ma pubblica un posizionamento tecnico e i limiti.

Vedi:
- `/normative/`
- `/eu/`
- `STANDARD-IPR-EU.md`
- `PHIOMEGA-ONLY_EU-TECHNICAL-DOSSIER.md`

---

## 10) Stato e freeze

Questo nodo usa freeze e baseline per mantenere stabilità e auditabilità.

Vedi:
- `/baseline/`
- `/changelog/`
- `FREEZE*.md`
- `BASELINE-1.0.txt`
- `CORE-STATUS.md`

---

## 11) Disclaimer

Questo repository:

- documenta un prototipo infrastrutturale pubblico,
- non stabilisce identità legali,
- non impone obblighi di custodia dati,
- non attribuisce autorità giuridica.

Audit-first. Fail-closed. Hash-only. Nessuna custodia dati.

---

**Sigillo**
- HERMETICUM - BLINDATA · COMPUTABILE · EVOLUTIVA  
- HERMETICUM B.C.E. S.r.l.
