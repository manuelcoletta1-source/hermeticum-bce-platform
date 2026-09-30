(function () {
  "use strict";

  const root = document.querySelector("[data-hbce-traceability-status]");
  if (!root) return;

  const indexUrl = root.getAttribute("data-traceability-index-url");
  const latestUrl = root.getAttribute("data-level1-latest-url");

  const setText = (selector, value) => {
    const node = root.querySelector(selector);
    if (node) node.textContent = String(value);
  };

  const setState = (value) => {
    root.setAttribute("data-load-state", value);
    setText("[data-traceability-load-state]", value);
  };

  const formatBool = (value) => value === true ? "true" : value === false ? "false" : "unknown";

  const latestRecord = (records) => {
    if (!Array.isArray(records) || records.length === 0) return null;
    return records.slice().sort((a, b) => Number(b.program_number || 0) - Number(a.program_number || 0))[0];
  };

  const renderRecords = (records) => {
    const list = root.querySelector("[data-traceability-records]");
    if (!list) return;

    list.innerHTML = "";

    records
      .slice()
      .sort((a, b) => Number(a.program_number || 0) - Number(b.program_number || 0))
      .forEach((record) => {
        const item = document.createElement("li");
        item.innerHTML = [
          "<strong>PROG-" + String(record.program_number) + "</strong>",
          " · gate: <code>" + String(record.gate_semantics || "unknown") + "</code>",
          " · evidence: <code>" + String(record.evidence_class || "unknown") + "</code>",
          " · execution claimed: <code>" + formatBool(record.execution_claimed) + "</code>",
          " · trace: <code>" + String(record.execution_trace_ref === null ? "null" : record.execution_trace_ref || "unknown") + "</code>"
        ].join("");
        list.appendChild(item);
      });
  };

  const render = (index, latestProgramState) => {
    const latest = latestRecord(index.records);

    setText("[data-traceability-record-count]", index.record_count);
    setText("[data-traceability-programs]", Array.isArray(index.records) ? index.records.map((r) => "PROG-" + String(r.program_number)).join(", ") : "unavailable");

    if (latest) {
      setText("[data-traceability-latest-program]", "PROG-" + String(latest.program_number));
      setText("[data-traceability-latest-gate]", latest.gate_semantics || "unknown");
      setText("[data-traceability-latest-evidence]", latest.evidence_class || "unknown");
      setText("[data-traceability-execution-claimed]", formatBool(latest.execution_claimed));
      setText("[data-traceability-execution-trace]", latest.execution_trace_ref === null ? "null" : latest.execution_trace_ref || "unknown");
      setText("[data-traceability-claim-ceiling]", latest.claim_ceiling && latest.claim_ceiling.maximum_claim ? latest.claim_ceiling.maximum_claim : "unknown");
    }

    if (latestProgramState) {
      setText("[data-level1-latest-status]", latestProgramState.status || "unknown");
      setText("[data-level1-production-ready]", formatBool(latestProgramState.readiness && latestProgramState.readiness.production_ready));
      setText("[data-level1-external-effect-evidence-received]", formatBool(latestProgramState.readiness_remediation_execution_external_effect_evidence && latestProgramState.readiness_remediation_execution_external_effect_evidence.received));
      setText("[data-level1-external-effect-evidence-validated]", formatBool(latestProgramState.readiness_remediation_execution_external_effect_evidence && latestProgramState.readiness_remediation_execution_external_effect_evidence.validated));
      setText("[data-level1-external-effect-proven]", formatBool(latestProgramState.readiness_remediation_execution && latestProgramState.readiness_remediation_execution.external_effect_proven));
      setText("[data-level1-physical-effect-proven]", formatBool(latestProgramState.readiness_remediation_execution && latestProgramState.readiness_remediation_execution.physical_effect_proven));
    }

    renderRecords(index.records || []);
    setState("LIVE_INDEX_LOADED");
  };

  Promise
    .all([
      fetch(indexUrl, { cache: "no-store" }).then((response) => {
        if (!response.ok) throw new Error("traceability index unavailable");
        return response.json();
      }),
      fetch(latestUrl, { cache: "no-store" }).then((response) => {
        if (!response.ok) throw new Error("latest Level 1 state unavailable");
        return response.json();
      })
    ])
    .then(([index, latestProgramState]) => render(index, latestProgramState))
    .catch(() => {
      setState("FAIL_CLOSED_STATIC_FALLBACK");
    });
}());


(function hbceBindPhysicalEffectEvidenceReceivedState() {
  function run() {
    var root = document.querySelector("[data-hbce-traceability-status]");
    if (!root) return;

    var target = root.querySelector("[data-level1-physical-effect-evidence-received]");
    if (!target) return;

    var latestUrl = root.getAttribute("data-level1-latest-url");
    if (!latestUrl || typeof fetch !== "function") return;

    fetch(latestUrl, { cache: "no-store" })
      .then(function (response) {
        return response && response.ok ? response.json() : null;
      })
      .then(function (latest) {
        var execution = latest && latest.readiness_remediation_execution;
        if (!execution) return;
        target.textContent = String(Boolean(execution.physical_effect_evidence_received));
      })
      .catch(function () {});
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", run);
  } else {
    run();
  }
})();


(function hbceBindPhysicalEffectEvidenceValidatedState() {
  function run() {
    var root = document.querySelector("[data-hbce-traceability-status]");
    if (!root) return;

    var target = root.querySelector("[data-level1-physical-effect-evidence-validated]");
    if (!target) return;

    var latestUrl = root.getAttribute("data-level1-latest-url");
    if (!latestUrl || typeof fetch !== "function") return;

    fetch(latestUrl, { cache: "no-store" })
      .then(function (response) {
        return response && response.ok ? response.json() : null;
      })
      .then(function (latest) {
        var execution = latest && latest.readiness_remediation_execution;
        if (!execution) return;
        target.textContent = String(Boolean(execution.physical_effect_evidence_validated));
      })
      .catch(function () {});
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", run);
  } else {
    run();
  }
})();


(function hbceBindReadinessGateRequestedState() {
  function run() {
    var root = document.querySelector("[data-hbce-traceability-status]");
    if (!root) return;

    var target = root.querySelector("[data-level1-readiness-gate-requested]");
    if (!target) return;

    var latestUrl = root.getAttribute("data-level1-latest-url");
    if (!latestUrl || typeof fetch !== "function") return;

    fetch(latestUrl, { cache: "no-store" })
      .then(function (response) {
        return response && response.ok ? response.json() : null;
      })
      .then(function (latest) {
        var execution = latest && latest.readiness_remediation_execution;
        if (!execution) return;
        target.textContent = String(Boolean(execution.readiness_gate_requested));
      })
      .catch(function () {});
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", run);
  } else {
    run();
  }
})();


(function hbceBindReadinessGateRequestValidatedState() {
  function run() {
    var root = document.querySelector("[data-hbce-traceability-status]");
    if (!root) return;

    var target = root.querySelector("[data-level1-readiness-gate-request-validated]");
    if (!target) return;

    var latestUrl = root.getAttribute("data-level1-latest-url");
    if (!latestUrl || typeof fetch !== "function") return;

    fetch(latestUrl, { cache: "no-store" })
      .then(function (response) {
        return response && response.ok ? response.json() : null;
      })
      .then(function (latest) {
        var execution = latest && latest.readiness_remediation_execution;
        if (!execution) return;
        target.textContent = String(Boolean(execution.readiness_gate_request_validated));
      })
      .catch(function () {});
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", run);
  } else {
    run();
  }
})();


(function hbceBindReadinessGateDecisionRecordedState() {
  function run() {
    var root = document.querySelector("[data-hbce-traceability-status]");
    if (!root) return;

    var target = root.querySelector("[data-level1-readiness-gate-decision-recorded]");
    if (!target) return;

    var latestUrl = root.getAttribute("data-level1-latest-url");
    if (!latestUrl || typeof fetch !== "function") return;

    fetch(latestUrl, { cache: "no-store" })
      .then(function (response) {
        return response && response.ok ? response.json() : null;
      })
      .then(function (latest) {
        var execution = latest && latest.readiness_remediation_execution;
        if (!execution) return;
        target.textContent = String(Boolean(execution.readiness_gate_decision_recorded));
      })
      .catch(function () {});
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", run);
  } else {
    run();
  }
})();


(function hbceBindReadinessGateDecisionValidatedState() {
  function run() {
    var root = document.querySelector("[data-hbce-traceability-status]");
    if (!root) return;

    var target = root.querySelector("[data-level1-readiness-gate-decision-validated]");
    if (!target) return;

    var latestUrl = root.getAttribute("data-level1-latest-url");
    if (!latestUrl || typeof fetch !== "function") return;

    fetch(latestUrl, { cache: "no-store" })
      .then(function (response) {
        return response && response.ok ? response.json() : null;
      })
      .then(function (latest) {
        var execution = latest && latest.readiness_remediation_execution;
        if (!execution) return;
        target.textContent = String(Boolean(execution.readiness_gate_decision_validated));
      })
      .catch(function () {});
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", run);
  } else {
    run();
  }
})();


(function hbceBindReadinessGatePassedState() {
  function run() {
    var root = document.querySelector("[data-hbce-traceability-status]");
    if (!root) return;

    var target = root.querySelector("[data-level1-readiness-gate-passed]");
    if (!target) return;

    var latestUrl = root.getAttribute("data-level1-latest-url");
    if (!latestUrl || typeof fetch !== "function") return;

    fetch(latestUrl, { cache: "no-store" })
      .then(function (response) {
        return response && response.ok ? response.json() : null;
      })
      .then(function (latest) {
        var execution = latest && latest.readiness_remediation_execution;
        if (!execution) return;
        target.textContent = String(Boolean(execution.readiness_gate_passed));
      })
      .catch(function () {});
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", run);
  } else {
    run();
  }
})();


(function hbceBindProductionReadyState() {
  function run() {
    var root = document.querySelector("[data-hbce-traceability-status]");
    if (!root) return;

    var target = root.querySelector("[data-level1-production-ready]");
    if (!target) return;

    var latestUrl = root.getAttribute("data-level1-latest-url");
    if (!latestUrl || typeof fetch !== "function") return;

    fetch(latestUrl, { cache: "no-store" })
      .then(function (response) {
        return response && response.ok ? response.json() : null;
      })
      .then(function (latest) {
        var readiness = latest && latest.readiness;
        if (!readiness) return;
        target.textContent = String(Boolean(readiness.production_ready));
      })
      .catch(function () {});
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", run);
  } else {
    run();
  }
})();


(function hbceBindLevel1LaunchReadyState() {
  function run() {
    var root = document.querySelector("[data-hbce-traceability-status]");
    if (!root) return;

    var target = root.querySelector("[data-level1-launch-ready]");
    if (!target) return;

    var latestUrl = root.getAttribute("data-level1-latest-url");
    if (!latestUrl || typeof fetch !== "function") return;

    fetch(latestUrl, { cache: "no-store" })
      .then(function (response) {
        return response && response.ok ? response.json() : null;
      })
      .then(function (latest) {
        var readiness = latest && latest.readiness;
        if (!readiness) return;
        target.textContent = String(Boolean(readiness.level1_launch_ready));
      })
      .catch(function () {});
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", run);
  } else {
    run();
  }
})();


(function hbceBindExternalCustomerReadyState() {
  function run() {
    var root = document.querySelector("[data-hbce-traceability-status]");
    if (!root) return;

    var target = root.querySelector("[data-level1-external-customer-ready]");
    if (!target) return;

    var latestUrl = root.getAttribute("data-level1-latest-url");
    if (!latestUrl || typeof fetch !== "function") return;

    fetch(latestUrl, { cache: "no-store" })
      .then(function (response) {
        return response && response.ok ? response.json() : null;
      })
      .then(function (latest) {
        var readiness = latest && latest.readiness;
        if (!readiness) return;
        target.textContent = String(Boolean(readiness.external_customer_ready));
      })
      .catch(function () {});
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", run);
  } else {
    run();
  }
})();
