(function () {
  const SRC = "/hermeticum-bce-platform/deployment/nodes.json";

  const IT_REGIONS = [
    "Piemonte","Valle d'Aosta","Lombardia","Trentino-Alto Adige","Veneto","Friuli-Venezia Giulia","Liguria",
    "Emilia-Romagna","Toscana","Umbria","Marche","Lazio","Abruzzo","Molise","Campania","Puglia","Basilicata",
    "Calabria","Sicilia","Sardegna"
  ];

  const EU_COUNTRIES = [
    "AT","BE","BG","HR","CY","CZ","DK","EE","FI","FR","DE","GR","HU","IE","IT","LV","LT","LU","MT","NL","PL","PT","RO","SK","SI","ES","SE"
  ];

  const $ = (id) => document.getElementById(id);

  function set(id, v) { const el = $(id); if (el) el.textContent = String(v); }
  function setStatus(html) { const el = $("eu_map_status"); if (el) el.innerHTML = html; }

  function normNode(n) {
    const o = (n && typeof n === "object") ? n : {};
    return {
      region: String(o.region || ""),
      country: String(o.country || "").toUpperCase(),
      city: String(o.city || ""),
      status: String(o.status || "").toUpperCase(),
      node_hash: String(o.node_hash || ""),
      operator: String(o.operator || ""),
      timestamp: String(o.timestamp || ""),
      note: String(o.note || "")
    };
  }

  function isIso2(x) { return /^[A-Z]{2}$/.test(String(x||"").toUpperCase()); }

  async function loadRegistry() {
    const res = await fetch(SRC, { cache: "no-store" });
    if (!res.ok) throw new Error("fetch_failed");
    const json = await res.json();
    if (!json || json.proto !== "HBCE-NODE-REGISTRY-v1") throw new Error("proto_mismatch");
    if (!Array.isArray(json.nodes)) throw new Error("nodes_invalid");

    return {
      meta: {
        proto: json.proto,
        mode: String(json.mode || ""),
        origin: (json.origin && typeof json.origin === "object") ? json.origin : null
      },
      nodes: json.nodes.map(normNode)
    };
  }

  function rankStatus(s) {
    if (s === "ACTIVE") return 0;
    if (s === "PILOT") return 1;
    if (s === "PLANNED") return 2;
    if (s === "SUSPENDED") return 3;
    return 9;
  }

  function stats(nodes) {
    const by = { ACTIVE:0, PILOT:0, PLANNED:0, SUSPENDED:0 };
    const countries = new Set();
    const itRegions = new Set();

    for (const n of nodes) {
      if (by[n.status] !== undefined) by[n.status] += 1;
      if (isIso2(n.country)) countries.add(n.country);
      if (n.country === "IT" && n.region) itRegions.add(n.region);
    }

    return {
      total: nodes.length,
      active: by.ACTIVE,
      pilot: by.PILOT,
      planned: by.PLANNED,
      suspended: by.SUSPENDED,
      countries: countries.size,
      itRegions: itRegions.size
    };
  }

  function badge(status) {
    const s = String(status || "").toUpperCase();
    const label =
      (s==="ACTIVE") ? "ACTIVE" :
      (s==="PILOT") ? "PILOT" :
      (s==="PLANNED") ? "PLANNED" :
      (s==="SUSPENDED") ? "SUSPENDED" :
      "NOT IN REGISTRY";
    return `<span class="hbce-badge">${label}</span>`;
  }

  function row(title, status, sub) {
    return `
      <div class="hbce-card hbce-card--subtle" style="margin:10px 0;">
        <div class="hbce-meta" style="justify-content:space-between; align-items:center;">
          <div style="font-weight:800;">${title}</div>
          ${badge(status)}
        </div>
        <div class="hbce-card__text" style="margin-top:6px;">${sub}</div>
      </div>
    `;
  }

  function subline(n) {
    if (!n) return "NOT IN REGISTRY";
    const parts = [];
    if (n.city) parts.push(n.city);
    if (n.node_hash) parts.push(`hash: ${n.node_hash}`);
    if (n.operator) parts.push(`operator: ${n.operator}`);
    return parts.join(" · ") || "—";
  }

  function pickBestIT(nodes) {
    const it = new Map(); // region -> node
    for (const n of nodes) {
      if (n.country !== "IT" || !n.region) continue;
      const prev = it.get(n.region);
      if (!prev || rankStatus(n.status) < rankStatus(prev.status)) it.set(n.region, n);
    }
    return it;
  }

  function groupEUByCountry(nodes) {
    // country -> (region -> best node)
    const m = new Map();
    for (const n of nodes) {
      if (!isIso2(n.country) || n.country === "IT") continue;
      const country = n.country;
      const region = n.region || "EU-REGION";
      if (!m.has(country)) m.set(country, new Map());
      const byRegion = m.get(country);
      const prev = byRegion.get(region);
      if (!prev || rankStatus(n.status) < rankStatus(prev.status)) byRegion.set(region, n);
    }
    return m;
  }

  function render(meta, nodes) {
    const s = stats(nodes);
    set("eu_active", s.active);
    set("eu_pilot", s.pilot);
    set("eu_planned", s.planned);
    set("eu_suspended", s.suspended);
    set("eu_countries", s.countries);
    set("eu_it_regions", s.itRegions);
    set("eu_total", s.total);

    if (meta.origin) {
      const o = meta.origin;
      setStatus(`Stato: <strong>OK</strong> — <code>${meta.proto}</code> · origin: <strong>${o.city || "—"}</strong> (${String(o.country||"").toUpperCase() || "—"}) · mode: <strong>${meta.mode || "—"}</strong>`);
    } else {
      setStatus(`Stato: <strong>OK</strong> — <code>${meta.proto}</code> · mode: <strong>${meta.mode || "—"}</strong>`);
    }

    // IT
    const itMap = pickBestIT(nodes);
    const itEl = $("it_list");
    if (itEl) {
      itEl.innerHTML = IT_REGIONS.map(r => {
        const n = itMap.get(r);
        if (!n) return row(r, "NOT_IN_REGISTRY", "NOT IN REGISTRY");
        return row(r, n.status, subline(n));
      }).join("");
    }

    // EU grouped
    const euGroups = groupEUByCountry(nodes);
    const euEl = $("eu_list");
    if (euEl) {
      euEl.innerHTML = EU_COUNTRIES
        .filter(c => c !== "IT")
        .map(country => {
          const byRegion = euGroups.get(country);

          // If no entries for this country
          if (!byRegion || byRegion.size === 0) {
            return row(country, "NOT_IN_REGISTRY", "NOT IN REGISTRY");
          }

          // Build region rows under each country
          const regions = Array.from(byRegion.keys()).sort((a,b)=>a.localeCompare(b));
          const inner = regions.map(region => {
            const n = byRegion.get(region);
            const title = `${country} — ${region}`;
            return row(title, n.status, subline(n));
          }).join("");

          // Country header wrapper
          return `
            <div class="hbce-card" style="margin:12px 0;">
              <div style="font-weight:900; margin-bottom:8px;">${country}</div>
              ${inner}
            </div>
          `;
        })
        .join("");
    }
  }

  async function boot() {
    set("eu_active","—"); set("eu_pilot","—"); set("eu_planned","—"); set("eu_suspended","—");
    set("eu_countries","—"); set("eu_it_regions","—"); set("eu_total","—");
    setStatus("Stato: <strong>verifica in corso…</strong>");

    try {
      const reg = await loadRegistry();
      render(reg.meta, reg.nodes);
    } catch (e) {
      setStatus(`Stato: <strong>FAIL-CLOSED</strong> — impossibile leggere/validare <code>deployment/nodes.json</code>.`);
      const itEl = $("it_list");
      const euEl = $("eu_list");
      if (itEl) itEl.innerHTML = row("Italia", "SUSPENDED", "FAIL-CLOSED");
      if (euEl) euEl.innerHTML = row("UE", "SUSPENDED", "FAIL-CLOSED");
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
