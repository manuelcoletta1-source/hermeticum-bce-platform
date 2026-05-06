/* =========================================================
   HBCE LINKS — CANONICAL PUBLIC LINK REGISTRY
   - Single public link map for HBCE Platform pages
   - Registry v3 / payload_sha256 / hash-only posture
   - No tracking
   - No external fetch
   - No secret handling
   - No public data custody
   ========================================================= */

(function () {
  "use strict";

  if (document.documentElement.getAttribute("data-hbce-links") === "1") return;
  document.documentElement.setAttribute("data-hbce-links", "1");

  const BASE = "/hermeticum-bce-platform";

  const LINKS = Object.freeze({
    home: `${BASE}/`,

    verify: `${BASE}/verify/`,
    verify_direct: `${BASE}/verify/verify.html`,
    verify_receipt: `${BASE}/verify/receipt/`,
    verify_pack: `${BASE}/verify-pack/`,

    registry: `${BASE}/registry/`,
    registry_json: `${BASE}/registry/registry.json`,
    registry_ledger: `${BASE}/registry/ledger.json`,
    registry_append: `${BASE}/registry/append/`,
    registry_publish: `${BASE}/registry/publish/`,
    registry_operators: `${BASE}/registry/operators/`,
    registry_operators_append: `${BASE}/registry/operators/append/`,
    registry_operators_receipt: `${BASE}/registry/operators/receipt/`,
    registry_operators_pack: `${BASE}/registry/operators/pack/`,
    registry_operators_status: `${BASE}/registry/operators/status/`,

    schema_registry_entry: `${BASE}/schemas/hbce-registry-entry.schema.json`,
    schema_evt: `${BASE}/schemas/hbce-evt.schema.json`,
    schema_ipr: `${BASE}/schemas/ipr.schema.json`,
    schema_receipt: `${BASE}/schemas/receipt.schema.json`,
    schema_evidence_bundle: `${BASE}/verify/schema/evidence-bundle.schema.json`,

    audit_findings: `${BASE}/AUDIT_FINDINGS_MATRIX_HBCE_2026-05-06.md`,
    audit_trace: `${BASE}/AUDIT_MATRIX_HBCE_2026-05-06.md`,
    openai_outreach_status: `${BASE}/OPENAI_OUTREACH_STATUS_2026-05-06.md`,
    deployment_review: `${BASE}/DEPLOYMENT_STATIC_GATEWAY_REVIEW_2026-05-06.md`,

    readme: `${BASE}/README.md`,
    security_policy: `${BASE}/SECURITY.md`,
    contributing: `${BASE}/CONTRIBUTING.md`,
    responsible_use: `${BASE}/RESPONSIBLE_USE.md`,
    license: `${BASE}/LICENSE`,

    privacy: `${BASE}/privacy/`,
    terms: `${BASE}/terms/`,
    legal: `${BASE}/legal/`,
    legal_privacy: `${BASE}/legal/privacy.html`,
    legal_terms: `${BASE}/legal/terms.html`,
    legal_notice: `${BASE}/legal/legal-notice.html`,
    legal_cookies: `${BASE}/legal/cookies.html`,
    legal_contact: `${BASE}/legal/contact.html`,
    compliance: `${BASE}/compliance/`,
    security: `${BASE}/security/`,
    governance: `${BASE}/governance/`,
    claims: `${BASE}/claims/`,

    activate: `${BASE}/activate/`,
    create: `${BASE}/create/`,
    create_base: `${BASE}/create/base/`,
    ipr: `${BASE}/ipr/`,
    joker_c2: `${BASE}/joker-c2/`,
    ai_joker_c2: `${BASE}/ai-joker-c2/`,
    protocol: `${BASE}/protocol/`,
    spec: `${BASE}/spec/`,
    docs: `${BASE}/docs/`,
    architecture: `${BASE}/ARCHITECTURE.md`,
    whitepaper: `${BASE}/WHITEPAPER.md`,
    roadmap: `${BASE}/ROADMAP.md`,
    status: `${BASE}/status/`,
    sitemap: `${BASE}/sitemap/`,
    tools: `${BASE}/tools/`,

    github_profile: "https://github.com/manuelcoletta1-source",
    github_repository: "https://github.com/manuelcoletta1-source/hermeticum-bce-platform",
    public_gateway: "https://manuelcoletta1-source.github.io/hermeticum-bce-platform/"
  });

  function isExternalUrl(url) {
    return /^https?:\/\//i.test(String(url || ""));
  }

  function hardenExternalAnchor(anchor) {
    if (!anchor || anchor.tagName !== "A") return;

    const href = anchor.getAttribute("href") || "";
    if (!isExternalUrl(href)) return;

    let sameOrigin = false;

    try {
      const parsed = new URL(href, window.location.href);
      sameOrigin = parsed.origin === window.location.origin;
    } catch {
      sameOrigin = false;
    }

    if (sameOrigin) return;

    const rel = (anchor.getAttribute("rel") || "").trim();
    const relTokens = new Set(rel.split(/\s+/).filter(Boolean));

    relTokens.add("noopener");
    relTokens.add("noreferrer");

    anchor.setAttribute("rel", Array.from(relTokens).join(" "));

    if (!anchor.getAttribute("target")) {
      anchor.setAttribute("target", "_blank");
    }
  }

  function applyLinks(root) {
    const scope = root || document;
    const nodes = Array.from(scope.querySelectorAll("[data-link]"));

    nodes.forEach((element) => {
      const key = element.getAttribute("data-link");
      const url = LINKS[key];

      if (!url) {
        element.setAttribute("data-hbce-link-status", "missing-key");
        return;
      }

      if (element.tagName === "A") {
        element.setAttribute("href", url);
        element.setAttribute("data-hbce-link-status", "resolved");
        hardenExternalAnchor(element);
      } else {
        element.textContent = url;
        element.setAttribute("data-hbce-link-status", "resolved");
      }
    });
  }

  function getLink(key) {
    return LINKS[key] || "";
  }

  window.HBCE_LINKS = LINKS;
  window.getHBCELink = getLink;
  window.applyHBCELinks = applyLinks;

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => applyLinks(document), { once: true });
  } else {
    applyLinks(document);
  }
})();
