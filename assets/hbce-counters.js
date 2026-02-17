/* HBCE COUNTERS — CATTIVA++ MODE (schema + node_hash policy)
 * Source-of-truth: /deployment/nodes.json
 *
 * FAIL-CLOSED if:
 *  1) status not in {ACTIVE,PILOT,PLANNED}
 *  2) country not ISO-2
 *  3) timestamp not ISO-8601 (light sanity)
 *  4) node_hash invalid for ANY node (empty/PENDING/charset/length)
 *  5) ACTIVE dirty:
 *       - operator empty/PENDING
 *       - (IT) region empty
 *       - ACTIVE node_hash must start with HBCE- or ORIGIN-
 */

(function () {
  "use strict";

  const SOURCE = "/hermeticum-bce-platform/deployment/nodes.json";
  const ALLOWED_STATUS = new Set(["ACTIVE", "PILOT", "PLANNED"]);

  const el = (id) => document.getElementById(id);
  const set = (id, v) => { const x = el(id); if (x) x.textContent = String(v); };

  function s(x) { return String(x || "").trim(); }
  function up(x) { return s(x).toUpperCase(); }

  function isISO2(x) {
    const v = up(x);
    return v.length === 2 && /^[A-Z]{2}$/.test(v);
  }

  function isIsoTimestamp(x) {
    const v = s(x);
    return /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?(Z|[+\-]\d{2}:\d{2})$/.test(v);
  }

  function isValidNodeHash(x) {
    const v = up(x);
    if (!v) return false;
    if (v === "PENDING") return false;
    if (v.length < 10 || v.length > 80) return false;
    if (!/^[A-Z0-9_-]+$/.test(v)) return false;
    return true;
  }

  function isValidActiveHashPrefix(x) {
    const v = up(x);
    return v.startsWith("HBCE-") || v.startsWith("ORIGIN-");
  }

  function uniq(arr) {
    return Array.from(new Set(arr.filter(Boolean)));
  }

  function failClosed(reason) {
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
        (reason ? s(reason) : "nodes.json non verificabile / incoerente (CATTIVA++).");
    }
  }

  function okStatus(msg) {
    const st = el("hbce_nodes_status");
    if (st) st.innerHTML = msg;
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

      if (!ALLOWED_STATUS.has(up(n.status))) return "status fuori enum: " + s(n.status);
      if (!isISO2(n.country)) return "country non ISO-2: " + s(n.country);
      if (!isIsoTimestamp(n.timestamp)) return "timestamp non ISO-8601: " + s(n.timestamp);

      // node_hash policy applies to ALL nodes
      if (!isValidNodeHash(n.node_hash)) return "node_hash invalido: " + s(n.node_hash);
    }

    return null;
  }

  function findDirtyActive(nodes) {
    for (const n of nodes) {
      if (!n || up(n.status) !== "ACTIVE") continue;

      const op = up(n.operator);
      const rg = s(n.region);
      const nh = up(n.node_hash);

      const badOp = (!op || op === "PENDING");
      const badItRegion = (up(n.country) === "IT" && !rg);
      const badPrefix = (!isValidActiveHashPrefix(nh));

      if (badOp || badItRegion || badPrefix) return n;
    }
    return null;
  }

  async function boot() {
    try {
      const res = await fetch(SOURCE, { cache: "no-store" });
      if (!res.ok) return failClosed("HTTP " + res.status + " su nodes.json");

      const data = await res.json();
      const err = validate(data);
      if (err) return failClosed(err);

      const dirty = findDirtyActive(data.nodes);
      if (dirty) {
        const msg =
          "ACTIVE incoerente: " +
          up(dirty.country) + " / " + s(dirty.region || "—") + " / " + s(dirty.city || "—") +
          " · operator=" + s(dirty.operator || "") + " · node_hash=" + s(dirty.node_hash || "");
        return failClosed(msg);
      }

      const nodes = data.nodes;

      const active = nodes.filter(n => up(n.status) === "ACTIVE").length;
      const pilot = nodes.filter(n => up(n.status) === "PILOT").length;
      const planned = nodes.filter(n => up(n.status) === "PLANNED").length;

      const countries = uniq(nodes.map(n => up(n.country))).length;

      const itNodes = nodes.filter(n => up(n.country) === "IT");
      const itRegions = uniq(itNodes.map(n => s(n.region))).filter(Boolean).length;

      set("hbce_nodes_active", active);
      set("hbce_nodes_pilot", pilot);
      set("hbce_nodes_planned", planned);
      set("hbce_countries", countries);
      set("hbce_regions_it", itRegions);

      okStatus(
        "Stato: <strong>OK</strong> (CATTIVA++) — schema ok + node_hash policy ok + ACTIVE puliti. Fonte: <code>deployment/nodes.json</code>."
      );

    } catch (e) {
      failClosed("Errore parsing/lettura nodes.json");
    }
  }

  boot();
})();
