"use strict";

const assert = require("assert/strict");
const fs = require("fs");
const cp = require("child_process");

const manifestPath = "evidence/migration/20261003_HBCE_EVIDENCE_OBJECT_MIGRATION_MAP_v001.json";
const pagePath = "evidence-object-migration-map.html";
const docPath = "docs/evidence/hbce-evidence-object-migration-map-v001.md";
const toolPath = "tools/evidence/validate-evidence-object-migration-map.js";

for (const path of [manifestPath, pagePath, docPath, toolPath]) {
  assert.equal(fs.existsSync(path), true, path);
}

const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
const page = fs.readFileSync(pagePath, "utf8");
const doc = fs.readFileSync(docPath, "utf8");
const output = cp.execFileSync(process.execPath, [toolPath], { encoding: "utf8" });

assert.equal(manifest.object_id, "HBCE-EVIDENCE-OBJECT-MIGRATION-MAP-V001");
assert.equal(manifest.status, "ACTIVE_EVIDENCE_OBJECT_MIGRATION_MAP");
assert.equal(manifest.basis_marker, "HBCE_IPR_ONBOARDING_DENY_STATE_HARNESS_FINAL_AUDIT=1");
assert.equal(manifest.expected_cli_marker, "EVIDENCE_OBJECT_MIGRATION_MAP=PASS");
assert.equal(manifest.result, "PASS_EVIDENCE_OBJECT_MIGRATION_MAP_MANIFEST_CREATED");
assert.equal(manifest.mapped_objects.length, 4);
assert.equal(manifest.migration_policy.mode, "MAP_ONLY");
assert.equal(manifest.migration_policy.move_files, false);
assert.equal(manifest.migration_policy.rewrite_history, false);
assert.equal(manifest.migration_policy.change_existing_urls, false);
assert.equal(manifest.migration_policy.change_authorization_semantics, false);

assert.ok(output.includes("EVIDENCE_OBJECT_MIGRATION_MAP=PASS"));
assert.ok(output.includes("PASS_MAP_ONLY_NO_MOVE"));

for (const text of [
  "HBCE Evidence Object Migration Map",
  "R&amp;D EVIDENCE OBJECT MAPPING ONLY",
  "HBCE_IPR_ONBOARDING_DENY_STATE_HARNESS_FINAL_AUDIT=1",
  "ACTIVE_EVIDENCE_OBJECT_MIGRATION_MAP",
  "HBCE-EVIDENCE-OBJECT-MIGRATION-MAP-V001",
  "EVIDENCE_OBJECT_MIGRATION_MAP=PASS",
  "MAP_ONLY",
  "MAP_ONLY_NO_MOVE",
  "Mapped object count: 4",
  "HBCE-EVIDENCE-OBJECT-SCHEMA-DRAFT-V001",
  "HBCE-IPR-ONBOARDING-EVIDENCE-RECORD-DRAFT-V001",
  "HBCE-EVIDENCE-SCHEMA-CONFORMANCE-HARNESS-V001",
  "HBCE-IPR-ONBOARDING-DENY-STATE-HARNESS-V001",
  "does not move files",
  "does not rewrite history",
  "does not change existing URLs",
  "does not change authorization semantics",
  "does not create effect evidence",
  "PROG-271",
  "PROG-272"
]) {
  assert.ok(page.includes(text), text);
}

assert.ok(doc.includes("HBCE Evidence Object Migration Map v001"));
assert.ok(doc.includes("EVIDENCE_OBJECT_MIGRATION_MAP=PASS"));
assert.ok(doc.includes("does not create effect evidence"));

console.log("PROG_270_EVIDENCE_OBJECT_MIGRATION_MAP_TEST=PASS");
