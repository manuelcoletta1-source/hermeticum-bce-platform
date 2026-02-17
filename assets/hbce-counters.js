/* HBCE COUNTERS — CATTIVA MODE
 * Used by index pages to show network counters from deployment/nodes.json
 * Fails closed if ANY ACTIVE node is incomplete:
 *  - operator empty/PENDING
 *  - node_hash empty/PENDING
 *  - (IT) region empty
 */

(function () {
  "use strict";

  const SOURCE = "/hermeticum-bce-platform/deployment/nodes.json";

  const el = (id) => document.getElementById(id);
  const set = (id, v) => { const x = el(id); if (x) x.textContent = String(v); };

  function s(x) { return String(x || "").trim(); }
  function upper(x) { return s(x).toUpperCase(); }

  function isISO2(x) {
    const v = s(x);
    return v.length === 2 && /^[A-Z]{2}$/i.test(v);
  }

  function validate(data) {
    if (!data || typeof data !== "object") return "JSON non valido (non object).";
    if (!Array.isArray(data.nodes)) return "Campo nodes[] mancante o non array.";

    for (const n of data.nodes) {
      if (!n || typeof n !== "object") return "Nodo non valido (non object).";

      const req = ["country", "status", "node_hash", "timestamp"];
      for (const k of req) {
        if (!(k in n)) return "Campo obbligatorio mancante: " + k;
        if (typeof n[k] !== "string") return "Campo non string: " + k;
        if (!s(n[k])) return "Campo vuoto: " + k;
      }
      if (!isISO2(n.country)) return "country non ISO-2 valido.";
    }
    return null;
  }

  function detectDirtyActive(nodes) {
    for (const n of nodes) {
      if (!n || n.status !== "ACTIVE") continue;

      const op = upper(n.operator);
      const nh = upper(n.node_hash);
      const rg = s(n.region);

      const badOp = (!op || op === "PENDING");
      const badNh = (!nh || nh === "PENDING");
      const badItRegion = (upper(n.country) === "IT" && !rg);

      if (badOp || badNh || badItRegion) return n;
    }
    return null;
  }

  function uniq(arr) {
    return Array.from(new Set(arr.filter(Boolean)));
  }

  function failClosed(reason) {
    // IDs used in your index variants
    const ids = [
      "hbce_nodes_active",
      "hbce_nodes_pilot",
      "hbce_nodes_planned",
      "hbce_countries",
      "hbce_regions_it",
      "hbce_nodes_status"
    ];
    ids.forEach((id) => set(id, "—"));

    const st = el("hbce_nodes_status");
    if (st) {
      st.innerHTML =
        "<strong>FAIL-CLOSED</strong> — " +
        (reason ? s(reason) : "nodes.json non verificabile / incoerente (CATTIVA).");
    }
  }

  function okStatus(msg) {
    const st = el("hbce_nodes_status");
    if (st) st.innerHTML = msg;
  }

  async function boot() {
    try {
      const res = await fetch(SOURCE, { cache: "no-store" });
      if (!res.ok) return failClosed("HTTP " + res.status + " su nodes.json");

      const data = await res.json();
      const err = validate(data);
      if (err) return failClosed(err);

      const dirty = detectDirtyActive(data.nodes);
      if (dirty) {
        const msg =
          "ACTIVE incoerente trovato: " +
          (dirty.country || "—") + " / " + (dirty.region || "—") + " / " + (dirty.city || "—") +
          " · operator=" + (dirty.operator || "") + " · node_hash=" + (dirty.node_hash || "");
        return failClosed(msg);
      }

      // OK — ledger pulito in senso CATTIVO
      const active = data.nodes.filter(n => n.status === "ACTIVE").length;
      const pilot = data.nodes.filter(n => n.status === "PILOT").length;
      const planned = data.nodes.filter(n => n.status === "PLANNED").length;

      const countries = uniq(data.nodes.map(n => upper(n.country))).length;

      const itNodes = data.nodes.filter(n => upper(n.country) === "IT");
      const itRegions = uniq(itNodes.map(n => s(n.region))).filter(Boolean).length;

      set("hbce_nodes_active", active);
      set("hbce_nodes_pilot", pilot);
      set("hbce_nodes_planned", planned);
      set("hbce_countries", countries);
      set("hbce_regions_it", itRegions);

      okStatus(
        "Stato: <strong>OK</strong> (CATTIVA) — nessun ACTIVE sporco. Fonte: <code>deployment/nodes.json</code>."
      );

    } catch (e) {
      failClosed("Errore parsing/lettura nodes.json");
    }
  }

  boot();
})();
