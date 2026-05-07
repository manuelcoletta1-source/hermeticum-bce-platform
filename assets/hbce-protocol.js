/* ============================================================
   HBCE — PROTOCOL UI JS
   - copy-to-clipboard for public hashes and visible evidence references
   - PASS / FAIL / WARN / NON-OPERATIONAL badge wiring
   - No eval
   - No external dependencies
   - No tracking
   - No upload
   - No public data custody
   ============================================================ */

(function () {
  "use strict";

  if (document.documentElement.getAttribute("data-hbce-protocol") === "1") return;
  document.documentElement.setAttribute("data-hbce-protocol", "1");

  function toast(button, text) {
    const previous = button.textContent;

    button.textContent = text;
    button.classList.add("is-done");

    window.setTimeout(() => {
      button.textContent = previous;
      button.classList.remove("is-done");
    }, 900);
  }

  async function copyText(text) {
    const value = String(text || "");

    if (!value.trim()) return false;

    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(value);
      return true;
    }

    const textarea = document.createElement("textarea");

    textarea.value = value;
    textarea.setAttribute("readonly", "true");
    textarea.style.position = "absolute";
    textarea.style.left = "-9999px";

    document.body.appendChild(textarea);
    textarea.select();

    const ok = document.execCommand("copy");

    document.body.removeChild(textarea);

    return ok;
  }

  function normalizeStatus(value) {
    const v = String(value || "").trim().toLowerCase();

    if (
      v === "pass" ||
      v === "valid" ||
      v === "ok" ||
      v === "public_record_present" ||
      v === "hash_match" ||
      v === "local_proof_present"
    ) {
      return "pass";
    }

    if (
      v === "fail" ||
      v === "invalid" ||
      v === "deny" ||
      v === "blocked" ||
      v === "hash_mismatch"
    ) {
      return "fail";
    }

    if (
      v === "non_operational" ||
      v === "non-operational" ||
      v === "fail_closed" ||
      v === "fail-closed"
    ) {
      return "fail";
    }

    if (
      v === "no_public_record" ||
      v === "missing" ||
      v === "pending" ||
      v === "warn" ||
      v === "warning" ||
      v === "no_local_proof"
    ) {
      return "warn";
    }

    return "warn";
  }

  function labelForStatus(status) {
    if (status === "pass") return "PASS";
    if (status === "fail") return "FAIL";
    return "WARN";
  }

  function wireCopyButtons() {
    const buttons = Array.from(document.querySelectorAll("[data-hbce-copy]"));

    buttons.forEach((button) => {
      if (button.getAttribute("data-hbce-copy-bound") === "1") return;
      button.setAttribute("data-hbce-copy-bound", "1");

      button.addEventListener("click", async () => {
        const selector = button.getAttribute("data-hbce-copy") || "";
        const target = document.querySelector(selector);

        if (!target) {
          toast(button, "NOT FOUND");
          return;
        }

        const text = (target.textContent || "").trim();

        if (!text) {
          toast(button, "EMPTY");
          return;
        }

        try {
          const ok = await copyText(text);
          toast(button, ok ? "COPIED" : "FAILED");
        } catch {
          toast(button, "FAILED");
        }
      });
    });
  }

  function wireTerminalStatus() {
    const terminals = Array.from(document.querySelectorAll(".hbce-terminal[data-status]"));

    terminals.forEach((terminal) => {
      const status = normalizeStatus(terminal.getAttribute("data-status"));
      const badge = terminal.querySelector(".hbce-terminal__status");

      if (!badge) return;

      badge.classList.remove("is-pass", "is-fail", "is-warn");
      badge.classList.add(status === "pass" ? "is-pass" : status === "fail" ? "is-fail" : "is-warn");
      badge.textContent = labelForStatus(status);
    });
  }

  function wireDynamicStatusUpdates() {
    const terminals = Array.from(document.querySelectorAll(".hbce-terminal[data-status]"));
    if (!terminals.length || !("MutationObserver" in window)) return;

    const observer = new MutationObserver((records) => {
      let shouldRefresh = false;

      records.forEach((record) => {
        if (record.type === "attributes" && record.attributeName === "data-status") {
          shouldRefresh = true;
        }
      });

      if (shouldRefresh) {
        wireTerminalStatus();
      }
    });

    terminals.forEach((terminal) => {
      observer.observe(terminal, {
        attributes: true,
        attributeFilter: ["data-status"]
      });
    });
  }

  function annotatePolicy() {
    document.documentElement.setAttribute("data-hbce-protocol-policy", "hash-only-fail-closed-no-custody");
  }

  function init() {
    annotatePolicy();
    wireCopyButtons();
    wireTerminalStatus();
    wireDynamicStatusUpdates();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})();
