/* HBCE HEADER BADGE — CATTIVA++ MODE (schema + node_hash policy)
 * Source-of-truth: /deployment/nodes.json
 *
 * FAIL-CLOSED if:
 *  1) Any status not in {ACTIVE, PILOT, PLANNED}
 *  2) Any country not ISO-2
 *  3) timestamp not ISO-8601 (light sanity)
 *  4) node_hash invalid for ANY node:
 *       - empty or "PENDING"
 *       - invalid charset/length
 *  5) Any ACTIVE node is dirty:
 *       - operator empty or "PENDING"
 *       - (IT) region empty
 *       - ACTIVE node_hash must start with HBCE- or ORIGIN-
 */

(function () {
  "use strict";

  const SOURCE = "/hermeticum-bce-platform/deployment/nodes.json";
  const ALLOWED_STATUS = new Set(["ACTIVE", "PILOT", "PLANNED"]);

  const el = (id) => document.getElementById(id);
  const setText = (id, v) => { const x = el(id); if (x) x.textContent = String(v); };

  function s(x) { return String(x || "").trim(); }
  function up(x) { return s(x).toUpperCase(); }

  function isISO2Country(x) {
    const v = up(x);
    return v.length === 2 && /^[A-Z]{2}$/.test(v);
  }

  function isIsoTimestamp(x) {
    const v = s(x);
    return /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?(Z|[+\-]\d{2}:\d{2})$/.test(v);
  }

  // node_hash: A–Z 0–9 _ - ; len 10..80 ; not PENDING
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
    setText("hbce_badge_state", "FAIL-CLOSED");
    setText("hbce_badge_nodes", "—");
    setText("hbce_badge_countries", "—");

    const badge = el("hbce_net_badge");
    if (badge) badge.setAttribute("title", "FAIL-CLOSED: " + (reason || "Fonte non verificabile / incoerente."));
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
        if (!s(n[k])) return "Campo vuoto: " + k;
      }

      const st = up(n.status);
      if (!ALLOWED_STATUS.has(st)) return "status fuori enum: " + s(n.status);

      if (!isISO2Country(n.country)) return "country non ISO-2: " + s(n.country);
      if (!isIsoTimestamp(n.timestamp)) return "timestamp non ISO-8601: " + s(n.timestamp);

      // node_hash policy: applies to ALL nodes
      if (!isValidNodeHash(n.node_hash)) return "node_hash invalido: " + s(n.node_hash);
    }

    return null;
  }

  // CATTIVA++: basta 1 ACTIVE sporco → FAIL-CLOSED
  function detectDirtyActive(nodes) {
    for (const n of nodes) {
      if (!n || up(n.status) !== "ACTIVE") continue;

      const op = up(n.operator);
      const rg = s(n.region);
      const nh = up(n.node_hash);

      const badOp = (!op || op === "PENDING");
      const badItRegion = (up(n.country) === "IT" && !rg);
      const badPrefix = (!isValidActiveHashPrefix(nh)); // ACTIVE must have HBCE-/ORIGIN-

      if (badOp || badItRegion || badPrefix) return n;
    }
    return null;
  }

  async function boot() {
    try {
      const res = await fetch(SOURCE, { cache: "no-store" });
      if (!res.ok) return failClosed("HTTP " + res.status);

      const data = await res.json();

      const err = validateNodesPayload(data);
      if (err) return failClosed(err);

      const dirty = detectDirtyActive(data.nodes);
      if (dirty) {
        const msg =
          "ACTIVE incoerente: " +
          up(dirty.country) + " / " + s(dirty.region || "—") + " / " + s(dirty.city || "—") +
          " · operator=" + s(dirty.operator || "") + " · node_hash=" + s(dirty.node_hash || "");
        return failClosed(msg);
      }

      const total = data.nodes.length;
      const countries = uniq(data.nodes.map(n => up(n.country))).length;

      const badge = el("hbce_net_badge");
      if (badge) badge.setAttribute("title", "OK (CATTIVA++): schema ok + node_hash policy ok + ACTIVE puliti.");

      setText("hbce_badge_state", "OK");
      setText("hbce_badge_nodes", total);
      setText("hbce_badge_countries", countries);

    } catch (e) {
      failClosed("Errore parsing/lettura nodes.json");
    }
  }

  boot();
})();
