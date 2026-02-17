/* HBCE HEADER BADGE — CATTIVA MODE
 * Source-of-truth: /deployment/nodes.json
 * Rule: FAIL-CLOSED if ANY node with status=ACTIVE is incomplete:
 *   - operator empty or "PENDING"
 *   - node_hash empty or "PENDING"
 *   - (IT) region empty
 */

(function () {
  "use strict";

  const SOURCE = "/hermeticum-bce-platform/deployment/nodes.json";

  const el = (id) => document.getElementById(id);
  const setText = (id, v) => { const x = el(id); if (x) x.textContent = String(v); };

  function normalizeStr(x) {
    return String(x || "").trim();
  }

  function isISO2Country(x) {
    const s = normalizeStr(x);
    return s.length === 2 && /^[A-Z]{2}$/i.test(s);
  }

  function validateNodesPayload(data) {
    if (!data || typeof data !== "object") return "JSON non valido (non object).";
    if (!Array.isArray(data.nodes)) return "Campo nodes[] mancante o non array.";

    for (const n of data.nodes) {
      if (!n || typeof n !== "object") return "Nodo non valido (non object).";

      const required = ["country", "status", "node_hash", "timestamp"];
      for (const k of required) {
        if (!(k in n)) return "Campo obbligatorio mancante: " + k;
        if (typeof n[k] !== "string") return "Campo non string: " + k;
        if (!normalizeStr(n[k])) return "Campo vuoto: " + k;
      }
      if (!isISO2Country(n.country)) return "country non ISO-2 valido.";
    }
    return null;
  }

  // CATTIVA: basta 1 ACTIVE sporco → FAIL-CLOSED
  function detectDirtyActive(nodes) {
    const dirty = [];
    for (const n of nodes) {
      if (!n || n.status !== "ACTIVE") continue;

      const op = normalizeStr(n.operator);
      const nh = normalizeStr(n.node_hash);
      const rg = normalizeStr(n.region);

      const badOp = (!op || op.toUpperCase() === "PENDING");
      const badNh = (!nh || nh.toUpperCase() === "PENDING");
      const badItRegion = (normalizeStr(n.country).toUpperCase() === "IT" && !rg);

      if (badOp || badNh || badItRegion) {
        dirty.push(n);
      }
    }
    return dirty;
  }

  function uniq(arr) {
    return Array.from(new Set(arr.filter(Boolean)));
  }

  function failClosed(reason) {
    setText("hbce_badge_state", "FAIL-CLOSED");
    setText("hbce_badge_nodes", "—");
    setText("hbce_badge_countries", "—");

    const badge = el("hbce_net_badge");
    if (badge) {
      badge.setAttribute("title", "FAIL-CLOSED: " + (reason || "Fonte non verificabile / incoerente."));
    }
  }

  async function boot() {
    try {
      const res = await fetch(SOURCE, { cache: "no-store" });
      if (!res.ok) return failClosed("HTTP " + res.status);

      const data = await res.json();
      const err = validateNodesPayload(data);
      if (err) return failClosed(err);

      const dirty = detectDirtyActive(data.nodes);
      if (dirty.length) {
        const d = dirty[0];
        const msg =
          "ACTIVE incoerente trovato: " +
          (d.country || "—") + " / " + (d.region || "—") + " / " + (d.city || "—") +
          " · operator=" + (d.operator || "") + " · node_hash=" + (d.node_hash || "");
        return failClosed(msg);
      }

      const total = data.nodes.length;
      const countries = uniq(data.nodes.map(n => normalizeStr(n.country).toUpperCase())).length;

      const badge = el("hbce_net_badge");
      if (badge) badge.setAttribute("title", "OK (CATTIVA): nodes.json valido + nessun ACTIVE sporco.");

      setText("hbce_badge_state", "OK");
      setText("hbce_badge_nodes", total);
      setText("hbce_badge_countries", countries);

    } catch (e) {
      failClosed("Errore parsing/lettura nodes.json");
    }
  }

  boot();
})();
