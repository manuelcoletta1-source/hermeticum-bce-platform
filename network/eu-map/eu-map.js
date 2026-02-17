(function () {
  "use strict";

  const SOURCE = "/hermeticum-bce-platform/deployment/nodes.json";
  const ALLOWED_STATUS = new Set(["ACTIVE", "PILOT", "PLANNED"]);

  const $ = (id) => document.getElementById(id);
  const setHTML = (id, v) => { const el = $(id); if (el) el.innerHTML = String(v); };

  function s(x) { return String(x || "").trim(); }
  function up(x) { return s(x).toUpperCase(); }

  function isISO2(x) { return /^[A-Z]{2}$/.test(up(x)); }
  function isIsoTs(x) {
    return /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?(Z|[+\-]\d{2}:\d{2})$/.test(s(x));
  }
  function isValidNodeHash(x) {
    const v = up(x);
    if (!v || v === "PENDING") return false;
    if (v.length < 10 || v.length > 80) return false;
    return /^[A-Z0-9_-]+$/.test(v);
  }
  function isValidActivePrefix(x) {
    const v = up(x);
    return v.startsWith("HBCE-") || v.startsWith("ORIGIN-");
  }

  function failClosed(reason) {
    setHTML("eu_state", "<strong>FAIL-CLOSED</strong> — " + s(reason || "Fonte non verificabile / incoerente."));
    const tb = $("eu_tbody");
    if (tb) tb.innerHTML = "";
  }

  function ok(msg) {
    setHTML("eu_state", "<strong>OK</strong> — " + s(msg));
  }

  function validate(data) {
    if (!data || typeof data !== "object") return "JSON non valido (non object).";
    if (!Array.isArray(data.nodes)) return "Campo nodes[] mancante o non array.";

    for (const n of data.nodes) {
      if (!n || typeof n !== "object") return "Nodo non valido (non object).";

      const req = ["country", "status", "node_hash", "operator", "timestamp", "city"];
      for (const k of req) {
        if (!(k in n)) return "Campo obbligatorio mancante: " + k;
        if (typeof n[k] !== "string") return "Campo non string: " + k;
        if (!s(n[k])) return "Campo vuoto: " + k;
      }

      if (!ALLOWED_STATUS.has(up(n.status))) return "status fuori enum: " + s(n.status);
      if (!isISO2(n.country)) return "country non ISO-2: " + s(n.country);
      if (!isIsoTs(n.timestamp)) return "timestamp non ISO-8601: " + s(n.timestamp);
      if (!isValidNodeHash(n.node_hash)) return "node_hash invalido: " + s(n.node_hash);

      if (up(n.status) === "ACTIVE") {
        if (up(n.operator) === "PENDING") return "ACTIVE con operator PENDING: " + s(n.node_hash);
        if (!isValidActivePrefix(n.node_hash)) return "ACTIVE node_hash senza prefisso HBCE/ORIGIN: " + s(n.node_hash);
        if (up(n.country) === "IT" && !s(n.region)) return "IT ACTIVE senza region: " + s(n.city);
      }
    }

    return null;
  }

  function render(rows) {
    const tb = $("eu_tbody");
    if (!tb) return;
    tb.innerHTML = "";

    for (const r of rows) {
      const tr = document.createElement("tr");
      tr.style.borderBottom = "1px solid rgba(255,255,255,.06)";

      const cells = [r.country, r.active, r.pilot, r.planned, r.last];
      for (const c of cells) {
        const td = document.createElement("td");
        td.style.padding = "10px";
        td.textContent = String(c);
        tr.appendChild(td);
      }
      tb.appendChild(tr);
    }
  }

  function aggregate(nodes) {
    const map = new Map();

    for (const n of nodes) {
      const c = up(n.country);
      if (!map.has(c)) map.set(c, { country: c, active: 0, pilot: 0, planned: 0, last: "" });
      const row = map.get(c);

      const st = up(n.status);
      if (st === "ACTIVE") row.active++;
      else if (st === "PILOT") row.pilot++;
      else if (st === "PLANNED") row.planned++;

      if (!row.last || s(n.timestamp) > row.last) row.last = s(n.timestamp);
    }

    return Array.from(map.values()).sort((a, b) => a.country.localeCompare(b.country));
  }

  async function boot() {
    try {
      const res = await fetch(SOURCE, { cache: "no-store" });
      if (!res.ok) return failClosed("HTTP " + res.status + " su nodes.json");

      const data = await res.json();
      const err = validate(data);
      if (err) return failClosed(err);

      ok("nodes.json valido (CATTIVA++). Aggregazione per country pronta.");
      render(aggregate(data.nodes));

    } catch (e) {
      failClosed("Errore parsing/lettura nodes.json");
    }
  }

  boot();
})();
