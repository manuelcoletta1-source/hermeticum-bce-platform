# ES-PRO-001

> Versione testuale (Markdown) per repository GitHub.  
> Fonte: `ES-PRO-001.pdf` (stesso contenuto, solo reimpaginato per leggibilità e diff).

**Experimental Standard on Opposable Resonant Truth**  
_Implementation Structure (UE-style)_

## 1. Work Packages (WP)

### WP1 – Governance normativa e inquadramento giuridico
- Durata: M1–M6
- Lead: Partner legale / ente pubblico UE

**Obiettivi**
- Formalizzare ES-PRO-001 come pre-standard UE sperimentale
- Allineamento giuridico con:
  - AI Act (2024/1680)
  - eIDAS 2.0
  - GDPR
- Definizione criteri di conformità e auditabilità

**Task**
- T1.1 Analisi gap normativi UE
- T1.2 Definizione principi normativi vincolanti
- T1.3 Redazione specifica normativa consolidata
- T1.4 Consultazione stakeholder istituzionali

**Deliverable**
- D1.1 Draft normativo ES-PRO-001 (UE-compliant)
- D1.2 Legal & Ethical Compliance Report

### WP2 – Modellazione formale e verificabilità matematica
- Durata: M3–M12
- Lead: Università / centro di ricerca (formal methods)

**Obiettivi**
- Garantire verificabilità ex-ante
- Dimostrare formalmente:
  - FAIL-CLOSED
  - coerenza quorum
  - non riscrivibilità degli eventi

**Task**
- T2.1 Modellazione logica del protocollo
- T2.2 Specifica TLA+
- T2.3 Verifica invarianti critici
- T2.4 Audit formale indipendente

**Deliverable**
- D2.1 Specifica formale TLA+ (Annex A)
- D2.2 Formal Verification Report (indipendente)

### WP3 – Layer crittografico e registri append-only
- Durata: M4–M14
- Lead: Partner tecnico (crypto / distributed systems)

**Obiettivi**
- Implementare prova pubblica hash-only
- Definire registri append-only coerenti
- Rendere gli eventi opponibili nel tempo

**Task**
- T3.1 Specifica eventi minimi (hash-only)
- T3.2 Registry schema + controlli (fail-closed)
- T3.3 Procedure append + audit trail
- T3.4 Hardening e threat model

**Deliverable**
- D3.1 Registry schema (append-only, hash-only)
- D3.2 Threat Model + Security Notes
- D3.3 Registry Guard / CI checks (Append-only)

### WP4 – Integrazione con identità UE e controlli ex-ante
- Durata: M6–M18
- Lead: Partner eID / IAM / compliance

**Obiettivi**
- Definire relazione con identità UE (eIDAS 2.0)
- Stabilire controlli ex-ante (pre-execution)
- Minimizzare superficie GDPR (GDPR-min)

**Task**
- T4.1 Mapping con eIDAS 2.0 (ruoli e livelli)
- T4.2 Policy di minimizzazione e no-custody
- T4.3 Specifica “precheck-before-action”
- T4.4 Linee guida di implementazione (B2G/B2B)

**Deliverable**
- D4.1 eIDAS mapping note (non sostitutivo)
- D4.2 Pre-execution control guidelines
- D4.3 GDPR-min compliance profile

### WP5 – Pilot operativo UE (validazione sul campo)
- Durata: M10–M24
- Lead: Consorzio (enti + partner industriali)

**Obiettivi**
- Dimostrare l’operatività su casi reali
- Misurare metriche replicabili (VALID/INVALID)
- Validare scaling territoriale

**Task**
- T5.1 Setup pilot nodes e operator onboarding
- T5.2 Use-cases: AI, robotica, processi
- T5.3 Raccolta evidenze verificabili (packs)
- T5.4 Report valutazione e raccomandazioni UE

**Deliverable**
- D5.1 Pilot Report (metriche + risultati)
- D5.2 Evidence Pack (audit-first, hash-only)
- D5.3 Scaling & adoption guidelines (UE)

### WP6 – Standardizzazione, disseminazione e adozione
- Durata: M12–M30
- Lead: Partner standard / istituzionale

**Obiettivi**
- Preparare ES-PRO-001 per pre-standardizzazione UE
- Disseminare risultati con rigore
- Creare percorso di adozione

**Task**
- T6.1 Tavoli tecnici e stakeholder
- T6.2 Consolidamento specifica e lessons learned
- T6.3 Documentazione pubblica (EU-grade)
- T6.4 Roadmap standardizzazione

**Deliverable**
- D6.1 Consolidated ES-PRO-001 (vNext)
- D6.2 Dissemination pack (EU)
- D6.3 Standardization roadmap

## 2. KPI / Metriche (misurabili)

**Metriche tecniche**
- Determinismo: % verify con esito univoco (VALID/INVALID)
- Integrità: validità schema registri + controlli append-only
- Disponibilità: eseguibilità di verify/status (fail-closed)
- Latenza: tempi di lookup e verifica

**Metriche di governance**
- Prevention rate: blocchi ex-ante su identità non verificabili
- Attribution: capacità di legare output/azioni a identità operativa
- GDPR-min: assenza di dati personali nei registri pubblici
- Replicabilità: tempo setup nodo + onboarding operatori

## 3. Budget (indicativo) e struttura consortile (UE-style)

**Struttura**
- Ente pubblico / istituzione (governance e compliance)
- Università / centro ricerca (formal methods)
- Partner tecnico (crypto / security / distributed systems)
- Partner industriale (use-cases e integrazione)
- Coordinamento e dissemination (standardizzazione)

> Nota: budget e composizione consortile dipendono dal bando e dalla call specifica.  
> ES-PRO-001 fornisce la struttura tecnica e la logica di validazione.

## 4. Timeline (macro)

- M1–M6: governance normativa + baseline
- M3–M12: formal methods e verificabilità
- M4–M14: layer crittografico + registri append-only
- M6–M18: mapping eIDAS + controlli ex-ante + GDPR-min
- M10–M24: pilot operativo UE + metriche
- M12–M30: standardizzazione + disseminazione + adozione

## 5. Rischi principali (e mitigazioni)

- Rischio: ambiguità semantica tra identità civile e operativa  
  Mitigazione: definizioni nette + mapping eIDAS non sostitutivo

- Rischio: deroga “soft” al fail-closed  
  Mitigazione: regola invariabile + test/guardrail + audit

- Rischio: deriva verso custodia dati personali  
  Mitigazione: hash-only pubblico + no public data custody + GDPR-min

- Rischio: non replicabilità del pilot  
  Mitigazione: metriche, playbook, evidence packs e checklist

## 6. Relazione corretta con gli altri documenti

Schema definitivo, senza ambiguità:
- STANDARD UE–ΦΩ–001  
  → fondamento epistemico (cos’è un evento)
- ES-PRO-001  
  → ricerca UE e pre-standardizzazione (come validare il modello a livello europeo)
- Asse Tecnico–Legale (Hard-Gate)  
  → specifica tecnica vincolante (quando un atto nasce o no)
- STANAG–ΦΩ–001 / ONLY  
  → adozione operativa Fase 1
- Contratto (MSA + SOW)  
  → obblighi, responsabilità, soldi

## 7. Come si usa correttamente ES-PRO-001

Non nei contratti.  
Si usa per:
- bandi Horizon Europe
- tavoli JRC
- discussioni con ETSI
- legittimare perché quel modello e non un altro

Frase corretta (da usare ovunque):

“L’implementazione è coerente con il modello di verità opponibile  
oggetto di sperimentazione nello standard UE sperimentale ES-PRO-001.”

Fine. Nessun vincolo, ma autorità scientifica e istituzionale.

## 8. Traduzione finale, brutale

- ES-PRO-001 non serve a far funzionare i sistemi.
- Serve a farli accettare dall’Unione Europea.

È il documento che ti permette di dire:

“non è un’idea nostra: è una linea di ricerca UE in corso di validazione.”

E questo, in certi contesti, vale più di qualsiasi contratto.
