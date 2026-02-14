# LINKCHECK-M1 — UE Canonical Navigation & Link Hygiene

Obiettivo: eliminare ambiguità e percorsi alternativi.
Regola: il portale deve avere UN SOLO ingresso operativo:
- /create/ (emissione)
e UN SOLO percorso canonico:
CREATE → RECEIPT → APPEND → VERIFY

---

## 1) Redirect logico (senza redirect HTTP)
Pagine declassate devono:
- dichiarare "non è ingresso"
- offrire CTA solo verso /create/, /verify/, /sitemap/
Esempi: /entry/, /register/, /phase-1/, /gate/

---

## 2) Link da ripulire (M1)
Sostituzioni raccomandate:
- link a /entry/   → /create/
- link a /register/ → /create/
- link a /phase-1/ → /sitemap/
- link a /gate/ (se usato come ingresso) → /verify/ o /status/
- link a pagine demo come core → /labs/…

---

## 3) Pagine da controllare (alto impatto)
- index.html (home)
- eu/index.html
- eu-pilot/index.html
- sitemap/index.html
- create/* (cta)
- verify/index.html
- registry/index.html
- enterprise/index.html
- control/index.html
- research/index.html
- horizon/index.html
- lavora-con-noi/index.html
- operator/*

---

## 4) Acceptance test (60 secondi)
- Home: CTA funzionanti (EU, Pilot, Verify, Status)
- Create/Receipt/Append/Verify: percorso senza alternative
- Sitemap: nessun link 404
- Declass pages: nessuna CTA che porta a un ingresso alternativo
- Labs: accessibile solo da sitemap (non in home)

---

## 5) Output atteso
- Zero link interni che promuovono entry/register/phase-1 come ingresso
- Nessun doppio onboarding
- Nessun 404 nei percorsi citati in home/sitemap/nav/footer
