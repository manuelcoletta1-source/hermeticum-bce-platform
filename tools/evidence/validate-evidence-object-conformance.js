#!/usr/bin/env node
"use strict";

const fs = require("fs");

function readJson(path) {
  return JSON.parse(fs.readFileSync(path, "utf8"));
}

function fail(message) {
  throw new Error(message);
}

function boolMap(value, label) {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    fail(`${label} invalid`);
  }
  for (const [key, item] of Object.entries(value)) {
    if (typeof item !== "boolean") {
      fail(`${label}.${key} invalid`);
    }
  }
}

const schema = readJson("schemas/evidence/hbce-evidence-object-record-v001.schema.json");
const harness = readJson("evidence/schema/20261002_HBCE_EVIDENCE_SCHEMA_CONFORMANCE_HARNESS_v001.json");

if (schema.title !== "HBCE Evidence Object Record v001") fail("schema title invalid");
if (harness.status !== "ACTIVE_EVIDENCE_SCHEMA_CONFORMANCE_HARNESS") fail("harness status invalid");
if (!Array.isArray(harness.conformance_targets)) fail("conformance_targets invalid");

const results = harness.conformance_targets.map((targetRef) => {
  const target = readJson(targetRef.path);

  for (const field of schema.required) {
    if (!Object.prototype.hasOwnProperty.call(target, field)) {
      fail(`missing ${field}`);
    }
  }

  if (!/^[0-9a-f]{40}$/.test(target.basis_main_commit)) fail("basis_main_commit invalid");
  if (!target.public_surfaces || typeof target.public_surfaces !== "object") fail("public_surfaces invalid");
  if (!target.release_anchor || typeof target.release_anchor !== "object") fail("release_anchor invalid");

  boolMap(target.explicit_non_claims, "explicit_non_claims");
  boolMap(target.no_execution_boundary, "no_execution_boundary");

  return {
    object_id: target.object_id,
    status: target.status,
    result: targetRef.expected_result || "PASS_SCHEMA_CONFORMANCE"
  };
});

console.log(JSON.stringify({
  marker: "EVIDENCE_SCHEMA_CONFORMANCE_HARNESS=PASS",
  harness_id: harness.harness_id,
  target_count: results.length,
  results
}, null, 2));
console.log("EVIDENCE_SCHEMA_CONFORMANCE_HARNESS=PASS");
