(function () {
  const $ = (id) => document.getElementById(id);

  const IDS = {
    wrap: "hbce_net_badge",
    state: "hbce_badge_state",
    nodes: "hbce_badge_nodes",
    countries: "hbce_badge_countries"
  };

  const SRC = "/hermeticum-bce-platform/deployment/nodes.json";

  function set(id, v) {
    const el = $(id);
    if (el) el.textContent = String(v);
  }

  function isIso2(x) {
    return /^[A-Z]{2}$/.test(String(x || "").toUpperCase());
  }

  async function loadNodes() {
    const res = await fetch(SRC, { cache: "no-store" });
    if (!res.ok) throw new Error("nodes_fetch_failed");
    const json = await res.json();
    if (!json || !Array.isArray(json.nodes)) throw new Error("nodes_invalid");
    return json.nodes;
  }

  function compute(nodes) {
    let active = 0;
    const countries = new Set();
    for (const n of nodes) {
      if (!n || typeof n !== "object") continue;
      if (String(n.status || "").toUpperCase() === "ACTIVE") active += 1;
      const c = String(n.country || "").toUpperCase();
      if (isIso2(c)) countries.add(c);
    }
    return { total: nodes.length, active, countries: countries.size };
  }

  async function run() {
    if (!$(IDS.wrap)) return;

    set(IDS.state, "—");
    set(IDS.nodes, "—");
    set(IDS.countries, "—");

    try {
      const nodes = await loadNodes();
      const s = compute(nodes);
      set(IDS.state, s.active > 0 ? "ACTIVE" : "PILOT");
      set(IDS.nodes, s.total);
      set(IDS.countries, s.countries);

      const wrap = $(IDS.wrap);
      if (wrap) wrap.title = `Derived from ${SRC} (public). Active: ${s.active}. Total: ${s.total}. Countries: ${s.countries}.`;
    } catch (e) {
      set(IDS.state, "FAIL-CLOSED");
      set(IDS.nodes, "—");
      set(IDS.countries, "—");
      const wrap = $(IDS.wrap);
      if (wrap) wrap.title = `FAIL-CLOSED: cannot read/validate ${SRC}.`;
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", run);
  } else {
    run();
  }
})();
