/* HBCE NETWORK — CATTIVA++ runtime validator + renderer
 * Reads: /deployment/nodes.json
 * If anything fails validation -> FAIL-CLOSED (no table render).
 */

(function () {
  "use strict";

  const SOURCE = "/hermeticum-bce-platform/deployment/nodes.json";
  const ALLOWED_STATUS = new Set(["ACTIVE", "PILOT", "PLANNED"]);

  const $ = (id) => document.getElementById(id);
  const setText = (id, v) => { const el = $(id); if (el) el.textContent = String(v); };
  const setHTML = (id, v) => { const el = $(id); if (el) el.innerHTML = String(v); };

  function s(x) { return String(x || "").trim(); }
  function up(x) { return s(x).toUpperCase(); }

  function isISO2(x) { return /^[A-Z]{2}$/.test(up(x)); }
  function isIsoTs(x) {
    return /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?(Z|[+\-]\d{2}:\d{2})$/.test(s(x));
  }
  function isValidNodeHash(x) {
    const v = up(x);
    if (!v) return false;
    if (v === "PENDING") return false;
    if (v.length < 10 || v.length > 80) return false;
    return /^[A-Z0-9_-]+$/.test(v);
  }
  function isValidActivePrefix(x) {
    const v = up(x);
    return v.startsWith("HBCE-") || v.startsWith("ORIGIN-");
  }

  function uniq(arr) { return Array.from(new Set(arr.filter(Boolean))); }

  function failClosed(reason) {
    setHTML("hbce_net_state", "<strong>FAIL-CLOSED</strong> — " + s(reason || "Fonte non verificabile / incoerente."));
    const wrap = $("hbce_table_wrap");
    if (wrap) wrap.style.display = "none";
  }

  function okState(msg) {
    setHTML("hbce_net_state", "<strong>OK</strong> — " + s(msg));
    const wrap = $("hbce_table_wrap");
    if (wrap) wrap.style.display = "block";
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

  let RAW = [];
  let FILTER_STATUS = "ALL";

  function applyFilters() {
    const fCountry = up(($("filter_country")?.value || "").trim());
    const q = up(($("filter_q")?.value || "").trim());

    const filtered = RAW.filter(n => {
      if (FILTER_STATUS !== "ALL" && up(n.status) !== FILTER_STATUS) return false;
      if (fCountry && up(n.country) !== fCountry) return false;

      if (q) {
        const blob = up([
          n.country, n.region, n.city, n.status, n.node_hash, n.operator
        ].map(s).join(" "));
        if (!blob.includes(q)) return false;
      }
      return true;
    });

    renderTable(filtered);
  }

  function renderTable(list) {
    const tb = $("hbce_tbody");
    if (!tb) return;
    tb.innerHTML = "";

    for (const n of list) {
      const tr = document.createElement("tr");
      tr.style.borderBottom = "1px solid rgba(255,255,255,.06)";

      const cells = [
        up(n.status),
        up(n.country),
        s(n.region || "—"),
        s(n.city || "—"),
        s(n.node_hash),
        s(n.operator),
        s(n.timestamp)
      ];

      for (const c of cells) {
        const td = document.createElement("td");
        td.style.padding = "10px";
        td.textContent = c;
        tr.appendChild(td);
      }
      tb.appendChild(tr);
    }
  }

  function wireUI() {
    document.querySelectorAll("[data-filter-status]").forEach(btn => {
      btn.addEventListener("click", () => {
        FILTER_STATUS = s(btn.getAttribute("data-filter-status") || "ALL").toUpperCase();
        applyFilters();
      });
    });

    $("filter_country")?.addEventListener("input", applyFilters);
    $("filter_q")?.addEventListener("input", applyFilters);
  }

  async function boot() {
    try {
      const res = await fetch(SOURCE, { cache: "no-store" });
      if (!res.ok) return failClosed("HTTP " + res.status + " su nodes.json");

      const data = await res.json();
      const err = validate(data);
      if (err) return failClosed(err);

      RAW = data.nodes.slice();

      // metrics
      const total = RAW.length;
      const active = RAW.filter(n => up(n.status) === "ACTIVE").length;
      const pilot = RAW.filter(n => up(n.status) === "PILOT").length;
      const planned = RAW.filter(n => up(n.status) === "PLANNED").length;

      const countries = uniq(RAW.map(n => up(n.country))).length;
      const itRegions = uniq(RAW.filter(n => up(n.country) === "IT").map(n => s(n.region))).filter(Boolean).length;

      setText("k_total", total);
      setText("k_active", active);
      setText("k_pilot", pilot);
      setText("k_planned", planned);
      setText("k_countries", countries);
      setText("k_it_regions", itRegions);

      okState("nodes.json valido (CATTIVA++). Nessun ACTIVE sporco.");

      wireUI();
      applyFilters();

    } catch (e) {
      failClosed("Errore parsing/lettura nodes.json");
    }
  }

  boot();
})();
