# DECLASS-M1 — UE Audit Readability Refactor (Hermeticum Platform)

Obiettivo: rendere il portale leggibile e valutabile in contesto UE (istituzioni/enterprise) con:
- percorso canonico unico
- navigazione coerente
- contenuti non-canonici declassati (senza cancellazione)
- riduzione ambiguità entry/flow

Policy: UE-first · audit-first · fail-closed · hash-only · append-only · GDPR-min · no public data custody

---

## 1) Percorso canonico (NON negoziabile)
CREATE → RECEIPT → REGISTRY(APPEND) → VERIFY

Core routes:
- /create/
- /create/receipt/
- /registry/
- /registry/append/
- /verify/
- /status/

Regola: percorsi alternativi o duplicati che imitano onboarding/entry devono essere declassati.

---

## 2) IA UE (ordine di lettura istituzionale)
Livello 0 — Gateway
- / (Home istituzionale)
- /eu/ (EU Gateway)
- /eu-pilot/ (Pilot)

Livello 1 — Core deterministic
- /create/ /registry/ /verify/ /status/

Livello 2 — Adozione B2B/B2G
- /enterprise/ /control/ /infrastructure/ /positioning/

Livello 3 — Ricerca e standard
- /research/ /horizon/ /standard/ipr/ /normative/

Livello 4 — Rete operatori
- /lavora-con-noi/ /operator/ /registry/operators/

Livello 5 — Declass (Labs)
- /labs/ (demo, events, inside, corridors, alternative entry)

---

## 3) KEEP / MOVE / MERGE (M1)
### KEEP (core operativo)
KEEP:
- create/
- verify/
- registry/
- status/
- security/
- privacy/
- terms/
- governance/
- schemas/
- github/workflows/
Motivo: sono percorsi deterministici, auditabili e coerenti con fail-closed.

### KEEP (istituzionale/adozione)
KEEP:
- eu/
- eu-pilot/
- horizon/
- enterprise/
- control/
- infrastructure/
- positioning/
- research/
- standard/ipr/
- normative/
Motivo: sono le pagine “UE story”: contesto, adozione, standardizzazione.

### MOVE → /labs/ (declass: non-canonico o alternativo)
MOVE:
- demo/ai-inference → labs/demo/ai-inference
- events → labs/events
- inside → labs/inside
- corridors → labs/corridors
- node → labs/node
Motivo: contenuti demo/narrativi o non essenziali al percorso canonico.

### REVIEW (decidere: merge o declass)
REVIEW:
- entry/  (se compete con /create/ come ingresso)
- register/ (se introduce onboarding alternativo)
- phase-1/ (se non è percorso canonico corrente)
- gate/ (tenere se è solo “metrologia PASS/FAIL” e non entry alternativa)
Decisione: se è un “secondo ingresso” → MOVE in /labs/.

---

## 4) Deliverable M1 (cosa deve risultare visibile)
- Home corta e istituzionale (no lingue, no beta)
- Header canonico con 8 route core UE
- Footer canonico (policy + legal + contatti)
- Sitemap UE ordinata
- Labs presente e referenziato solo dalla sitemap (non dalla home)

---

## 5) Sequenza commit consigliata
1) refactor(home): rebuild index from scratch as UE-grade institutional gateway (no language toggles)
2) refactor(nav): enforce UE-first canonical header (remove language UI, keep 8 core routes)
3) refactor(footer): add UE-grade canonical footer (policy, core routes, legal, contacts)
4) feat(sitemap): add UE-ordered sitemap page (gateway, core, adoption, standards, operator network)
5) feat(labs): add declass area for non-canonical demos and alternative paths (UE audit readability)
6) chore(declass): move demo/events/inside/corridors/node into labs (no deletion)
7) chore(linkcheck): update internal links to reflect labs moves (no 404)

---

## 6) Test di accettazione (manuale, 60 secondi)
- Home: 4 CTA funzionanti (EU, Pilot, Verify, Status)
- Verify: PASS/INVALID deterministico
- Registry: viewer + registry.json leggibile
- Status: check registry OK o FAIL-CLOSED chiaro
- Sitemap: nessun link 404
- Labs: accessibile, ma non confonde il core
