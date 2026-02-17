(function () {
  const SRC = "/hermeticum-bce-platform/deployment/nodes.json";

  const IDS = {
    active: "hbce_nodes_active",
    pilot: "hbce_nodes_pilot",
    planned: "hbce_nodes_planned",
    countries: "hbce_countries",
    regionsIt: "hbce_regions_it",
    status: "hbce_nodes_status"
  };

  const $ = (id) => document.getElementById(id);

  function set(id, v) {
    const el = $(id);
    if (el) el.textContent = String(v);
  }

  function setStatus(html) {
    const el = $(IDS.status);
    if (el) el.innerHTML = html;
  }

  function isIso2(x) {
    return /^[A-Z]{2}$/.test(String(x || "").toUpperCase());
  }

  function normNode(n) {
    const o = (n && typeof n === "object") ? n : {};
    return {
      status: String(o.status || "").toUpperCase(),
      country: String(o.country || "").toUpperCase(),
      region: String(o.region || ""),
      city: String(o.city || ""),
      node_hash: String(o.node_hash || ""),
      operator: String(o.operator || "")
    };
  }

  function compute(nodes) {
    const by = { ACTIVE: 0, PILOT: 0, PLANNED: 0, SUSPENDED: 0 };
    const countries = new Set();
    const itRegions = new Set();

    for (const raw of nodes) {
      const n = normNode(raw);

      if (by[n.status] !== undefined) by[n.status] += 1;
      if (isIso2(n.country)) countries.add(n.country);
      if (n.country === "IT" && n.region) itRegions.add(n.region);
    }

    return {
      active: by.ACTIVE,
      pilot: by.PILOT,
      planned: by.PLANNED,
      suspended: by.SUSPENDED,
      countries: countries.size,
      itRegions: itRegions.size,
      total: nodes.length
    };
  }

  async function loadRegistry() {
    const res = await fetch(SRC, { cache: "no-store" });
    if (!res.ok) throw new Error("fetch_failed");

    const json = await res.json();

    // STRICT: match proto + nodes[]
    if (!json || json.proto !== "HBCE-NODE-REGISTRY-v1") throw new Error("proto_mismatch");
    if (!Array.isArray(json.nodes)) throw new Error("nodes_invalid");

    return json;
  }

  function failClosed(msg) {
    set(IDS.active, "—");
    set(IDS.pilot, "—");
    set(IDS.planned, "—");
    set(IDS.countries, "—");
    set(IDS.regionsIt, "—");
    setStatus(`Stato: <strong>FAIL-CLOSED</strong> — ${msg}`);
  }

  async function boot() {
    // defaults
    set(IDS.active, "—");
    set(IDS.pilot, "—");
    set(IDS.planned, "—");
    set(IDS.countries, "—");
    set(IDS.regionsIt, "—");
    setStatus("Stato: —");

    try {
      const reg = await loadRegistry();
      const s = compute(reg.nodes);

      set(IDS.active, s.active);
      set(IDS.pilot, s.pilot);
      set(IDS.planned, s.planned);
      set(IDS.countries, s.countries);
      set(IDS.regionsIt, s.itRegions);

      const origin = (reg.origin && typeof reg.origin === "object") ? reg.origin : null;
      const originTxt = origin
        ? `origin: <strong>${origin.city || "—"}</strong> (${String(origin.country || "").toUpperCase() || "—"})`
        : "origin: —";

      setStatus(
        `Stato: <strong>OK</strong> — <code>${reg.proto}</code> · ${originTxt} · nodes: <strong>${s.total}</strong>`
      );
    } catch (e) {
      const reason =
        (e && e.message === "proto_mismatch") ? "proto mismatch (expected HBCE-NODE-REGISTRY-v1)" :
        (e && e.message === "nodes_invalid") ? "invalid nodes[] format" :
        "cannot read/validate deployment/nodes.json";
      failClosed(reason);
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
