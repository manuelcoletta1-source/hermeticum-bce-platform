(function () {
  const $ = (id) => document.getElementById(id);

  const IDS = {
    active: "hbce_nodes_active",
    pilot: "hbce_nodes_pilot",
    planned: "hbce_nodes_planned",
    countries: "hbce_countries",
    regions_it: "hbce_regions_it",
    status: "hbce_nodes_status"
  };

  const SRC = "/hermeticum-bce-platform/deployment/nodes.json";

  function setText(id, v) {
    const el = $(id);
    if (el) el.textContent = String(v);
  }

  function setStatus(html) {
    const el = $(IDS.status);
    if (el) el.innerHTML = html;
  }

  async function loadRegistry() {
    const res = await fetch(SRC, { cache: "no-store" });
    if (!res.ok) throw new Error("fetch_failed");
    const json = await res.json();
    if (!json || !Array.isArray(json.nodes)) throw new Error("invalid");
    return json.nodes;
  }

  function isIso2(x) {
    return /^[A-Z]{2}$/.test(String(x || "").toUpperCase());
  }

  function compute(nodes) {
    const by = { ACTIVE: 0, PILOT: 0, PLANNED: 0, SUSPENDED: 0 };
    const countries = new Set();
    const regionsIT = new Set();

    for (const n of nodes) {
      if (!n || typeof n !== "object") continue;
      const st = String(n.status || "").toUpperCase();
      if (by[st] !== undefined) by[st] += 1;

      const c = String(n.country || "").toUpperCase();
      if (isIso2(c)) countries.add(c);

      if (c === "IT" && n.region) regionsIT.add(String(n.region));
    }

    return {
      active: by.ACTIVE,
      pilot: by.PILOT,
      planned: by.PLANNED,
      countries: countries.size,
      regionsIT: regionsIT.size
    };
  }

  async function run() {
    setText(IDS.active, "—");
    setText(IDS.pilot, "—");
    setText(IDS.planned, "—");
    setText(IDS.countries, "—");
    setText(IDS.regions_it, "—");
    setStatus("Stato: <strong>verifica in corso…</strong>");

    try {
      const nodes = await loadRegistry();
      const s = compute(nodes);

      setText(IDS.active, s.active);
      setText(IDS.pilot, s.pilot);
      setText(IDS.planned, s.planned);
      setText(IDS.countries, s.countries);
      setText(IDS.regions_it, s.regionsIT);

      setStatus('Stato: <strong>OK</strong> — valori derivati da <code>deployment/nodes.json</code> (public, append-only).');
    } catch (e) {
      setStatus('Stato: <strong>FAIL-CLOSED</strong> — impossibile leggere/validare <code>deployment/nodes.json</code>.');
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", run);
  } else {
    run();
  }
})();
