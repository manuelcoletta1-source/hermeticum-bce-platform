/* =========================================================
   HBCE HEADER BADGE — PUBLIC NODE STATUS BADGE
   - Defensive public status display
   - Source: /registry/nodes.json
   - Registry v3 / privacy-minimal compatible
   - No private endpoints
   - No private topology
   - No secrets
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
    "sensitive_topology"
  ];

  const elementById = (id) => document.getElementById(id);

  function setText(id, value) {
    const element = elementById(id);
    if (element) element.textContent = String(value);
  }

  function clean(value) {
    return String(value || "").trim();
  }

  function upper(value) {
    return clean(value).toUpperCase();
  }

  function setBadgeTitle(value) {
    const badge = elementById("hbce_net_badge");
    if (badge) badge.setAttribute("title", value);
  }

  function failClosed(reason) {
    setText("hbce_badge_state", "NON-OPERATIONAL");
    setText("hbce_badge_nodes", "—");
    setText("hbce_badge_countries", "—");
    setBadgeTitle("FAIL-CLOSED: " + (reason || "Public node registry unavailable or invalid."));
  }

  function okState(total, contexts) {
    setText("hbce_badge_state", "OK");
    setText("hbce_badge_nodes", total);
    setText("hbce_badge_countries", contexts);
    setBadgeTitle("OK: public node registry loaded. Public metadata only; no private endpoint or topology validation.");
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

  function isPublicLabel(value) {
    return /^[A-Za-z0-9_\-:.]{3,128}$/.test(clean(value));
  }

  function isIsoLikeTimestamp(value) {
    const raw = clean(value);
    if (!raw) return false;
    return Number.isFinite(Date.parse(raw));
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

    const status = upper(node.status);
    if (!ALLOWED_STATUS.has(status)) return `nodes[${index}] invalid status: ${clean(node.status)}`;

    if (!clean(node.description)) return `nodes[${index}] missing description`;

    if (node.timestamp && !isIsoLikeTimestamp(node.timestamp)) {
      return `nodes[${index}] invalid timestamp`;
    }

    return "";
  }

  function validateNodesPayload(data) {
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
      const err = validateNode(data.nodes[index], index);
      if (err) return err;
    }

    return "";
  }

  function countDistinctPublicContexts(nodes) {
    const values = new Set();

    nodes.forEach((node) => {
      const context = clean(node.environment) || clean(node.record_scope) || "PUBLIC_NODE_CONTEXT";
      values.add(context.toUpperCase());
    });

    return values.size;
  }

  async function boot() {
    try {
      const response = await fetch(SOURCE, { cache: "no-store" });
      if (!response.ok) {
        return failClosed("HTTP " + response.status);
      }

      const data = await response.json();
      const validationError = validateNodesPayload(data);

      if (validationError) {
        return failClosed(validationError);
      }

      const total = data.nodes.length;
      const contexts = countDistinctPublicContexts(data.nodes);

      return okState(total, contexts);
    } catch (error) {
      return failClosed(error && error.message ? error.message : "node registry read/parse error");
    }
  }

  boot();
})();
