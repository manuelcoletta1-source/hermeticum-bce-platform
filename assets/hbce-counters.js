/* HBCE Counters — reads deployment/nodes.json
   EU-first, audit-first, fail-closed in UI: if cannot load -> show fail-closed status.
*/
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

  function setText(id, v) {
    const el = $(id);
    if (el) el.textContent = String(v);
  }

  function setStatus(html) {
    const el = $(IDS.status);
    if (el) el.innerHTML = html;
  }

  async function loadNodes() {
    const url = "/hermeticum-bce-platform/deployment/nodes.json";
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) throw new Error("nodes_fetch_failed");
    const json = await res.json();
    if (!json || !Array.isArray(json.nodes)) throw new Error("nodes_invalid");
    return json;
  }

  function computeStats(nodes) {
    const byStatus = { ACTIVE: 0, PILOT: 0, PLANNED: 0, SUSPENDED: 0 };
    const countries = new Set();
    const regionsIT = new Set();

    for (const n of nodes) {
      if (!n || typeof n !== "object") continue;

      const st = String(n.status || "").toUpperCase();
      if (byStatus[st] !== undefined) byStatus[st] += 1;

      const c = String(n.country || "").toUpperCase();
      if (/^[A-Z]{2}$/.test(c)) countries.add(c);

      if (c === "IT" && n.region) regionsIT.add(String(n.region));
    }

    return {
      active: byStatus.ACTIVE,
      pilot: byStatus.PILOT,
      planned: byStatus.PLANNED,
      countries: countries.size,
      regionsIT: regionsIT.size
    };
  }

  async function run() {
    // default placeholders
    setText(IDS.active, "—");
    setText(IDS.pilot, "—");
    setText(IDS.planned, "—");
    setText(IDS.countries, "—");
    setText(IDS.regions_it, "—");
    setStatus("Stato: <strong>verifica in corso…</strong>");

    try {
      const data = await loadNodes();
      const stats = computeStats(data.nodes);

      setText(IDS.active, stats.active);
      setText(IDS.pilot, stats.pilot);
      setText(IDS.planned, stats.planned);
      setText(IDS.countries, stats.countries);
      setText(IDS.regions_it, stats.regionsIT);

      setStatus('Stato: <strong>OK</strong> — valori derivati da <code>deployment/nodes.json</code> (public, append-only).');
    } catch (e) {
      // Fail-closed in UI: if cannot verify the public registry -> show closed.
      setStatus('Stato: <strong>FAIL-CLOSED</strong> — impossibile leggere/validare <code>deployment/nodes.json</code>.');
    }
  }

  // run after DOM ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", run);
  } else {
    run();
  }
})();
