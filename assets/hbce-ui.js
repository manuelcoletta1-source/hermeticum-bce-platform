/* HBCE UI Loader — header/footer partials (repo: /partials) */
(function () {
  const BASE = "/hermeticum-bce-platform";
  const PARTIALS = `${BASE}/partials`;

  async function injectPartial(selector, url) {
    const el = document.querySelector(selector);
    if (!el) return;

    try {
      const res = await fetch(url, { cache: "no-store" });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      el.innerHTML = await res.text();
    } catch (e) {
      // Fail-closed UI philosophy: keep page usable even if partials fail
      el.innerHTML = `
        <div class="hbce-container" style="padding:10px 0;">
          <a href="${BASE}/" style="text-decoration:none;"><strong>HERMETICUM</strong></a>
          <span style="opacity:.7;"> — Banca Cibernetica Europea</span>
          <span style="float:right;">
            <a class="hbce-btn hbce-btn--primary" href="${BASE}/activate/">Attiva IPR</a>
          </span>
        </div>
      `;
      console.warn("HBCE partial load failed:", url, e);
    }
  }

  injectPartial('[data-hbce="header"]', `${PARTIALS}/header.html`);
  injectPartial('[data-hbce="footer"]', `${PARTIALS}/footer.html`);
})();
