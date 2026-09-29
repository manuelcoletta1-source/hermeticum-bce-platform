const fs = require("fs");
const path = require("path");
const assert = require("assert/strict");
const crypto = require("crypto");

const root = process.cwd();
const {
  validateTraceabilitySuite,
  listTraceabilityRecordFiles
} = require(path.join(root, "runtime/traceability/validate-v1-2-traceability-suite.js"));

const suite = validateTraceabilitySuite();
assert.equal(suite.ok, true);
assert.deepEqual(suite.reason_codes, ["TRACEABILITY_V1_2_SUITE_VALID"]);
assert.ok(suite.record_count >= 1);

const files = listTraceabilityRecordFiles("docs/launch/traceability");
assert.ok(files.some((file) => file.includes("prog-174")));

const tmpDir = fs.mkdtempSync(path.join("/tmp", "hbce-trace-suite-"));
const tmpTraceDir = path.join(tmpDir, "docs/launch/traceability");
fs.mkdirSync(tmpTraceDir, { recursive: true });

const sourceTrace = "docs/launch/traceability/prog-174-level1-public-surface-observation-human-action-completion-recovery-decision-recovery-execution-readiness-remediation-execution-receipt.v1-2-trace-binding.json";
const sourceIndex = "docs/launch/traceability/index.json";

const traceRaw = fs.readFileSync(path.join(root, sourceTrace), "utf8");
const trace = JSON.parse(traceRaw);
const traceName = path.basename(sourceTrace);
fs.writeFileSync(path.join(tmpTraceDir, traceName), traceRaw);

const index = JSON.parse(fs.readFileSync(path.join(root, sourceIndex), "utf8"));
index.records = [index.records.find((record) => record.program_number === 174)];
index.record_count = 1;
index.records[0].source_file = `docs/launch/traceability/${traceName}`;
index.records[0].source_sha256 = crypto.createHash("sha256").update(traceRaw).digest("hex");

fs.writeFileSync(path.join(tmpTraceDir, "index.json"), JSON.stringify(index, null, 2) + "\n");

const cwd = process.cwd();
process.chdir(tmpDir);

const tmpValid = validateTraceabilitySuite({
  indexPath: "docs/launch/traceability/index.json",
  traceabilityDir: "docs/launch/traceability"
});
assert.equal(tmpValid.ok, true);

const brokenTrace = {
  ...trace,
  execution_claimed: true,
  execution_trace_required: true,
  execution_trace_ref: null,
  gate_semantics: "execution_observed",
  evidence_class: "EXECUTION_OBSERVED"
};
fs.writeFileSync(path.join(tmpTraceDir, traceName), JSON.stringify(brokenTrace, null, 2) + "\n");

const brokenIndex = JSON.parse(JSON.stringify(index));
brokenIndex.records[0].execution_claimed = true;
brokenIndex.records[0].execution_trace_required = true;
brokenIndex.records[0].execution_trace_ref = null;
brokenIndex.records[0].gate_semantics = "execution_observed";
brokenIndex.records[0].evidence_class = "EXECUTION_OBSERVED";
brokenIndex.records[0].source_sha256 = crypto.createHash("sha256").update(fs.readFileSync(path.join(tmpTraceDir, traceName), "utf8")).digest("hex");
fs.writeFileSync(path.join(tmpTraceDir, "index.json"), JSON.stringify(brokenIndex, null, 2) + "\n");

const tmpBroken = validateTraceabilitySuite({
  indexPath: "docs/launch/traceability/index.json",
  traceabilityDir: "docs/launch/traceability"
});
assert.equal(tmpBroken.ok, false);
assert.ok(tmpBroken.errors.some((e) => e.includes("execution_trace_ref") || e.includes("execution PASS missing")));

process.chdir(cwd);

console.log("TRACEABILITY_V1_2_SUITE_TEST=PASS");
