/* ============================================================
   HBCE — PROTOCOL UI JS
   - copy-to-clipboard for evidence hashes
   - PASS/FAIL badge wiring (data-status)
   Safe: no eval, no external deps
   ============================================================ */
(function () {
  "use strict";

  function toast(button, text) {
    const prev = button.textContent;
    button.textContent = text;
    button.classList.add("is-done");
    window.setTimeout(() => {
      button.textContent = prev;
      button.classList.remove("is-done");
    }, 900);
  }

  async function copyText(txt) {
    // prefer secure clipboard when available
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(txt);
      return true;
    }
    // fallback for non-secure contexts
    const ta = document.createElement("textarea");
    ta.value = txt;
    ta.setAttribute("readonly", "true");
    ta.style.position = "absolute";
    ta.style.left = "-9999px";
    document.body.appendChild(ta);
    ta.select();
    const ok = document.execCommand("copy");
    document.body.removeChild(ta);
    return ok;
  }

  function normalizeStatus(s) {
    const v = String(s || "").trim().toLowerCase();
    if (v === "pass" || v === "valid" || v === "ok") return "pass";
    if (v === "fail" || v === "invalid" || v === "deny") return "fail";
    return "warn";
  }

  function wireCopyButtons() {
    const buttons = document.querySelectorAll("[data-hbce-copy]");
    buttons.forEach(btn => {
      btn.addEventListener("click", async () => {
        const sel = btn.getAttribute("data-hbce-copy") || "";
        const target = document.querySelector(sel);
        if (!target) return toast(btn, "NOT FOUND");

        const txt = (target.textContent || "").trim();
        if (!txt) return toast(btn, "EMPTY");

        try {
          const ok = await copyText(txt);
          toast(btn, ok ? "COPIED" : "FAILED");
        } catch {
          toast(btn, "FAILED");
        }
      });
    });
  }

  function wireTerminalStatus() {
    const terms = document.querySelectorAll(".hbce-terminal[data-status]");
    terms.forEach(t => {
      const s = normalizeStatus(t.getAttribute("data-status"));
      const badge = t.querySelector(".hbce-terminal__status");
      if (!badge) return;

      badge.classList.remove("is-pass", "is-fail", "is-warn");
      badge.classList.add(s === "pass" ? "is-pass" : s === "fail" ? "is-fail" : "is-warn");
      badge.textContent = s === "pass" ? "PASS" : s === "fail" ? "FAIL" : "WARN";
    });
  }

  function init() {
    wireCopyButtons();
    wireTerminalStatus();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})();
