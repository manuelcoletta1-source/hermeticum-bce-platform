/* =========================================================
   HBCE COUNTERS — PUBLIC REGISTRY v3 STATUS COUNTERS
   - Defensive public status display
   - Source: /registry/nodes.json
   - Registry v3 / privacy-minimal compatible
   - No private endpoints
   - No private topology
   - No node_hash legacy dependency
   - No operator / region / territory public dependency
   - Fail-closed on malformed source
   ========================================================= */

(function () {
  "use strict";

  const SOURCE = "/hermeticum-bce-platform/registry/nodes.json";
  const EXPECTED_PROTO = "HBCE-REGISTRY-v3";
  const EXPECTED_KIND = "HBCE_PUBLIC_NODE_REGISTRY";

  const ALLOWED_STATUS = new Set([
    "ACTIVE",
    "INACTIVE",
    "SUSPENDED",
    "EXPERIMENTAL",
    "PLANNED"
  ]);

  const FORBIDDEN_FIELDS = [
    "private_ip",
    "internal_hostname",
    "secret",
    "api_key",
    "token",
    "password",
    "private_key",
    "credential",
    "ssh_key",
    "database_url",
    "admin_url",
    "internal_endpoint",
    "production_log",
    "sensitive_topology",
    "operator_sha256",
    "node_hash",
    "name",
    "nickname",
    "territory",
    "raw_identifier",
    "identity_document",
    "private_evidence",
    "personal_payload"
  ];

  const elementById = (id) => document.getElementById(id);

  function setText(id, value) {
    const element = elementById(id);
    if (element) element.textContent = String(value);
  }

  function setHtml(id, value) {
    const element = elementById(id);
    if (element) element.innerHTML = String(value);
  }

  function clean(value) {
    return String(value || "").trim();
  }

  function upper(value) {
    return clean(value).toUpperCase();
  }

  function isPublicLabel(value) {
    return /^[A-Za-z0-9_\-:.]{3,128}$/.test(clean(value));
  }

  function isIsoLikeTimestamp(value) {
    const raw = clean(value);
    if (!raw) return false;
    return Number.isFinite(Date.parse(raw));
  }

  function hasForbiddenField(object, path) {
    if (!object || typeof object !== "object") return null;

    if (Array.isArray(object)) {
      for (let index = 0; index < object.length; index += 1) {
        const found = hasForbiddenField(object[index], `${path}[${index}]`);
        if (found) return found;
      }

      return null;
    }

    for (const [key, value] of Object.entries(object)) {
      const currentPath = path ? `${path}.${key}` : key;

      if (FORBIDDEN_FIELDS.includes(key)) {
        return currentPath;
      }

      const found = hasForbiddenField(value, currentPath);
      if (found) return found;
    }

    return null;
  }

  function resetCounters() {
    const ids = [
      "hbce_nodes_active",
      "hbce_nodes_pilot",
      "hbce_nodes_planned",
      "hbce_countries",
      "hbce_regions_it",
      "hbce_nodes_status"
    ];

    ids.forEach((id) => setText(id, "—"));
  }

  function failClosed(reason) {
    resetCounters();

    setHtml(
      "hbce_nodes_status",
      "<strong>NON-OPERATIONAL</strong> — " +
        clean(reason || "public node registry unavailable or invalid.")
    );
  }

  function okStatus(message) {
    setHtml("hbce_nodes_status", message);
  }

  function validateNode(node, index) {
    if (!node || typeof node !== "object" || Array.isArray(node)) {
      return `nodes[${index}] invalid object`;
    }

    const forbidden = hasForbiddenField(node, `nodes[${index}]`);
    if (forbidden) return `forbidden field detected: ${forbidden}`;

    if (!isPublicLabel(node.node_label)) return `nodes[${index}] invalid node_label`;
    if (!clean(node.environment)) return `nodes[${index}] missing environment`;
    if (!clean(node.identity_layer)) return `nodes[${index}] missing identity_layer`;
    if (!clean(node.coordination_engine)) return `nodes[${index}] missing coordination_engine`;
    if (!clean(node.description)) return `nodes[${index}] missing description`;

    const status = upper(node.status);
    if (!ALLOWED_STATUS.has(status)) return `nodes[${index}] invalid status: ${clean(node.status)}`;

    if (node.timestamp && !isIsoLikeTimestamp(node.timestamp)) {
      return `nodes[${index}] invalid timestamp`;
    }

    return "";
  }

  function validatePayload(data) {
    if (!data || typeof data !== "object" || Array.isArray(data)) {
      return "registry source is not a JSON object";
    }

    if (data.proto !== EXPECTED_PROTO) {
      return "proto mismatch";
    }

    if (data.kind !== EXPECTED_KIND) {
      return "kind mismatch";
    }

    if (!data.rules || typeof data.rules !== "object" || Array.isArray(data.rules)) {
      return "rules object missing";
    }

    if (data.rules.failure_mode !== "FAIL_CLOSED") {
      return "failure_mode mismatch";
    }

    if (!Array.isArray(data.nodes)) {
      return "nodes[] missing or invalid";
    }

    const forbidden = hasForbiddenField(data, "");
    if (forbidden) return `forbidden field detected: ${forbidden}`;

    for (let index = 0; index < data.nodes.length; index += 1) {
      const error = validateNode(data.nodes[index], index);
      if (error) return error;
    }

    return "";
  }

  function countByStatus(nodes, status) {
    return nodes.filter((node) => upper(node.status) === status).length;
  }

  function countDistinct(values) {
    return Array.from(new Set(values.map((value) => clean(value)).filter(Boolean))).length;
  }

  async function boot() {
    try {
      const response = await fetch(SOURCE, { cache: "no-store" });

      if (!response.ok) {
        return failClosed("HTTP " + response.status + " on public node registry.");
      }

      const data = await response.json();
      const validationError = validatePayload(data);

      if (validationError) {
        return failClosed(validationError);
      }

      const nodes = data.nodes;

      const active = countByStatus(nodes, "ACTIVE");
      const experimental = countByStatus(nodes, "EXPERIMENTAL");
      const planned = countByStatus(nodes, "PLANNED");

      const environments = countDistinct(nodes.map((node) => node.environment));
      const publicContexts = countDistinct(
        nodes.map((node) => node.record_scope || node.environment || "PUBLIC_NODE_CONTEXT")
      );

      setText("hbce_nodes_active", active);
      setText("hbce_nodes_pilot", experimental);
      setText("hbce_nodes_planned", planned);
      setText("hbce_countries", environments);
      setText("hbce_regions_it", publicContexts);

      okStatus(
        "Status: <strong>OK</strong> — public node registry v3 loaded. " +
          "Counters are based on minimized public metadata only. Source: <code>registry/nodes.json</code>."
      );
    } catch (error) {
      failClosed(error && error.message ? error.message : "node registry read/parse error");
    }
  }

  boot();
})();
