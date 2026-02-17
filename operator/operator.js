(function () {
  const $ = (id) => document.getElementById(id);

  function isHex64(s) {
    return /^[a-f0-9]{64}$/i.test((s || "").trim());
  }

  async function loadRegistry() {
    // Fail-closed: se non riesce a caricare o il JSON è invalido → deny.
    const url = "/hermeticum-bce-platform/registry/registry.json";
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) throw new Error("registry_fetch_failed");
    const json = await res.json();
    if (!json || !Array.isArray(json.entries)) throw new Error("registry_invalid");
    return json;
  }

  function matchEntry(reg, hash) {
    const h = hash.toLowerCase();
    return reg.entries.some(e => (e && typeof e.payload_sha256 === "string" && e.payload_sha256.toLowerCase() === h));
  }

  async function check() {
    const iprHash = ($("ipr_hash").value || "").trim();
    $("operator_panel").style.display = "none";

    if (!isHex64(iprHash)) {
      $("status").innerHTML = 'Stato: <strong>INVALID</strong> — payload_sha256 non valido (serve 64-hex).';
      return;
    }

    $("status").innerHTML = "Stato: verifica in corso…";

    try {
      const reg = await loadRegistry();
      const ok = matchEntry(reg, iprHash);

      if (!ok) {
        $("status").innerHTML = 'Stato: <strong>ACCESS DENIED</strong> — hash non presente nel registry (fail-closed).';
        return;
      }

      $("status").innerHTML = 'Stato: <strong>VALID</strong> — accesso operatore abilitato.';
      $("operator_panel").style.display = "block";
    } catch (e) {
      $("status").innerHTML = 'Stato: <strong>FAIL-CLOSED</strong> — impossibile verificare il registry.';
    }
  }

  $("btn_check").addEventListener("click", check);
})();
