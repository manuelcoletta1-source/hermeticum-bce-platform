(function () {
  const $ = (id) => document.getElementById(id);

  const UI = {
    status: "net_status",
    total: "net_total",
    active: "net_active",
    pilot: "net_pilot",
    planned: "net_planned",
    suspended: "net_suspended",
    countries: "net_countries",
    regionsIT: "net_regions_it",

    q: "q",
    statusFilter: "status_filter",
    countryFilter: "country_filter",
    sort: "sort",
    btnReload: "btn_reload",
    btnExport: "btn_export",

    tbody: "net_tbody"
  };

  const SRC = "/hermeticum-bce-platform/deployment/nodes.json";

  let rawNodes = [];
  let filteredNodes = [];

  function setText(id, v) {
    const el = $(id);
    if (el) el.textContent = String(v);
  }

  function setStatus(html) {
    const el = $(UI.status);
    if (el) el.innerHTML = html;
  }

  function safeStr(x) {
    return (x === null || x === undefined) ? "" : String(x);
  }

  function isIso2(x) {
    return /^[A-Z]{2}$/.test(String(x || "").toUpperCase());
  }

  function isHex64(x) {
    return /^[a-f0-9]{64}$/i.test(String(x || ""));
  }

  function normalizeNode(n) {
    const o = (n && typeof n === "object") ? n : {};
    const country = safeStr(o.country).toUpperCase();
    const status = safeStr(o.status).toUpperCase();
    return {
      status,
      country,
      region: safeStr(o.region),
      city: safeStr(o.city),
      node_hash: safeStr(o.node_hash),
      operator: safeStr(o.operator),
      timestamp: safeStr(o.timestamp),
      note: safeStr(o.note)
    };
  }

  async function load() {
    setStatus("Stato: <strong>verifica in corso…</strong>");
    const res = await fetch(SRC, { cache: "no-store" });
    if (!res.ok) throw new Error("fetch_failed");
    const json = await res.json();
    if (!json || !Array.isArray(json.nodes)) throw new Error("invalid_format");
    return json.nodes.map(normalizeNode);
  }

  function computeStats(nodes) {
    const by = { ACTIVE: 0, PILOT: 0, PLANNED: 0, SUSPENDED: 0 };
    const countries = new Set();
    const regionsIT = new Set();

    for (const n of nodes) {
      if (by[n.status] !== undefined) by[n.status] += 1;
      if (isIso2(n.country)) countries.add(n.country);
      if (n.country === "IT" && n.region) regionsIT.add(n.region);
    }

    return {
      total: nodes.length,
      active: by.ACTIVE,
      pilot: by.PILOT,
      planned: by.PLANNED,
      suspended: by.SUSPENDED,
      countries: countries.size,
      regionsIT: regionsIT.size
    };
  }

  function fillCountryOptions(nodes) {
    const sel = $(UI.countryFilter);
    if (!sel) return;
    const current = sel.value || "ALL";

    const set = new Set();
    for (const n of nodes) if (isIso2(n.country)) set.add(n.country);

    const list = Array.from(set).sort();
    sel.innerHTML = `<option value="ALL">Tutte</option>` + list.map(c => `<option value="${c}">${c}</option>`).join("");

    // restore
    sel.value = list.includes(current) ? current : "ALL";
  }

  function matchesQuery(n, q) {
    if (!q) return true;
    const s = q.toLowerCase();
    return [
      n.status, n.country, n.region, n.city, n.node_hash, n.operator, n.timestamp, n.note
    ].some(v => safeStr(v).toLowerCase().includes(s));
  }

  function applyFilters() {
    const q = safeStr($(UI.q)?.value).trim();
    const st = safeStr($(UI.statusFilter)?.value).toUpperCase() || "ALL";
    const c = safeStr($(UI.countryFilter)?.value).toUpperCase() || "ALL";

    filteredNodes = rawNodes.filter(n => {
      if (st !== "ALL" && n.status !== st) return false;
      if (c !== "ALL" && n.country !== c) return false;
      if (!matchesQuery(n, q)) return false;
      return true;
    });

    applySort();
    renderTable();
  }

  function parseTime(t) {
    const ms = Date.parse(t);
    return Number.isFinite(ms) ? ms : 0;
  }

  function applySort() {
    const mode = safeStr($(UI.sort)?.value) || "COUNTRY_REGION";

    const rankStatus = (s) => {
      if (s === "ACTIVE") return 0;
      if (s === "PILOT") return 1;
      if (s === "PLANNED") return 2;
      if (s === "SUSPENDED") return 3;
      return 9;
    };

    filteredNodes.sort((a, b) => {
      if (mode === "STATUS") {
        const ra = rankStatus(a.status), rb = rankStatus(b.status);
        if (ra !== rb) return ra - rb;
      }
      if (mode === "TIMESTAMP_DESC") return parseTime(b.timestamp) - parseTime(a.timestamp);
      if (mode === "TIMESTAMP_ASC") return parseTime(a.timestamp) - parseTime(b.timestamp);

      // default COUNTRY_REGION
      const cc = a.country.localeCompare(b.country);
      if (cc !== 0) return cc;
      const rr = a.region.localeCompare(b.region);
      if (rr !== 0) return rr;
      return a.city.localeCompare(b.city);
    });
  }

  function cell(text) {
    const td = document.createElement("td");
    td.textContent = safeStr(text) || "—";
    return td;
  }

  function cellHash(text, allowOrigin) {
    const td = document.createElement("td");
    const v = safeStr(text);

    // mark invalid but show
    const ok = isHex64(v) || (allowOrigin && v === "ORIGIN-HBCE-TORINO") || v === "PENDING";
    td.textContent = v || "—";
    if (!ok) td.style.opacity = "0.7";
    return td;
  }

  function renderTable() {
    const tb = $(UI.tbody);
    if (!tb) return;

    tb.innerHTML = "";
    if (!filteredNodes.length) {
      const tr = document.createElement("tr");
      const td = document.createElement("td");
      td.colSpan = 8;
      td.textContent = "Nessun nodo trovato con i filtri correnti.";
      tr.appendChild(td);
      tb.appendChild(tr);
      return;
    }

    for (const n of filteredNodes) {
      const tr = document.createElement("tr");
      tr.appendChild(cell(n.status));
      tr.appendChild(cell(n.country));
      tr.appendChild(cell(n.region));
      tr.appendChild(cell(n.city));
      tr.appendChild(cellHash(n.node_hash, true));
      tr.appendChild(cellHash(n.operator, false));
      tr.appendChild(cell(n.timestamp));
      tr.appendChild(cell(n.note));
      tb.appendChild(tr);
    }
  }

  function exportFiltered() {
    const payload = {
      source: SRC,
      exported_at: new Date().toISOString(),
      count: filteredNodes.length,
      nodes: filteredNodes
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "hbce-network-export.json";
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 500);
  }

  async function boot() {
    // default placeholders
    setText(UI.total, "—");
    setText(UI.active, "—");
    setText(UI.pilot, "—");
    setText(UI.planned, "—");
    setText(UI.suspended, "—");
    setText(UI.countries, "—");
    setText(UI.regionsIT, "—");

    try {
      rawNodes = await load();

      const st = computeStats(rawNodes);
      setText(UI.total, st.total);
      setText(UI.active, st.active);
      setText(UI.pilot, st.pilot);
      setText(UI.planned, st.planned);
      setText(UI.suspended, st.suspended);
      setText(UI.countries, st.countries);
      setText(UI.regionsIT, st.regionsIT);

      fillCountryOptions(rawNodes);
      setStatus('Stato: <strong>OK</strong> — dati derivati da <code>deployment/nodes.json</code> (append-only).');

      applyFilters();
    } catch (e) {
      rawNodes = [];
      filteredNodes = [];
      renderTable();
      setStatus('Stato: <strong>FAIL-CLOSED</strong> — impossibile leggere/validare <code>deployment/nodes.json</code>.');
    }
  }

  function wire() {
    $(UI.btnReload)?.addEventListener("click", boot);
    $(UI.btnExport)?.addEventListener("click", exportFiltered);

    $(UI.q)?.addEventListener("input", applyFilters);
    $(UI.statusFilter)?.addEventListener("change", applyFilters);
    $(UI.countryFilter)?.addEventListener("change", applyFilters);
    $(UI.sort)?.addEventListener("change", () => { applySort(); renderTable(); });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => { wire(); boot(); });
  } else {
    wire(); boot();
  }
})();
