// /assets/hbce-ui.js
(async function () {
  const base = "/hermeticum-bce-platform";

  async function inject(selector, url) {
    const el = document.querySelector(selector);
    if (!el) return;
    const r = await fetch(url, { cache: "no-store" });
    if (!r.ok) return;
    el.innerHTML = await r.text();
  }

  await inject('[data-hbce="header"]', `${base}/partials/header.html`);
  await inject('[data-hbce="footer"]', `${base}/partials/footer.html`);
})();
