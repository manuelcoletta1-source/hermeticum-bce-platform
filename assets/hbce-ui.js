async function hbceLoadPartial(targetId, url) {
  const el = document.getElementById(targetId);
  if (!el) return;
  try {
    const res = await fetch(url, { cache: "no-cache" });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    el.innerHTML = await res.text();
  } catch (e) {
    el.innerHTML = ""; // fail-closed UI: non inventare contenuti
  }
}

/**
 * basePath:
 * - root pages: "./"
 * - pages in subdir: "../"
 * - pages in nested subdir: "../../"
 */
function hbceBoot(basePath) {
  hbceLoadPartial("hbce-header", basePath + "partials/header.html");
  hbceLoadPartial("hbce-footer", basePath + "partials/footer.html");
}
