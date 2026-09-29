const fs = require("fs");
const path = require("path");
const assert = require("assert/strict");

const root = process.cwd();
const { validateTraceabilityIndex } = require(path.join(root, "runtime/traceability/validate-v1-2-traceability-index.js"));

const indexPath = path.join(root, "docs/launch/traceability/index.json");
const base = JSON.parse(fs.readFileSync(indexPath, "utf8"));

const valid = validateTraceabilityIndex(indexPath);
assert.equal(valid.ok, true);
assert.deepEqual(valid.reason_codes, ["TRACEABILITY_INDEX_VALID"]);

const tmpDir = fs.mkdtempSync(path.join("/tmp", "hbce-trace-index-"));
const tmpTraceDir = path.join(tmpDir, "docs/launch/traceability");
fs.mkdirSync(tmpTraceDir, { recursive: true });

const sourceRecord = JSON.parse(fs.readFileSync(path.join(root, base.records[0].source_file), "utf8"));
const sourceName = path.basename(base.records[0].source_file);
fs.writeFileSync(path.join(tmpTraceDir, sourceName), JSON.stringify(sourceRecord, null, 2) + "\n");

const clone = JSON.parse(JSON.stringify(base));
clone.records = [clone.records[0]];
clone.record_count = 1;
clone.records[0].source_file = `docs/launch/traceability/${sourceName}`;
clone.records[0].source_sha256 = require("crypto").createHash("sha256").update(fs.readFileSync(path.join(tmpTraceDir, sourceName), "utf8")).digest("hex");

fs.writeFileSync(path.join(tmpTraceDir, "index.json"), JSON.stringify(clone, null, 2) + "\n");

const cwd = process.cwd();
process.chdir(tmpDir);

const tmpValid = validateTraceabilityIndex("docs/launch/traceability/index.json");
assert.equal(tmpValid.ok, true);

const brokenCount = JSON.parse(JSON.stringify(clone));
brokenCount.record_count = 99;
fs.writeFileSync(path.join(tmpTraceDir, "index.json"), JSON.stringify(brokenCount, null, 2) + "\n");
const brokenCountResult = validateTraceabilityIndex("docs/launch/traceability/index.json");
assert.equal(brokenCountResult.ok, false);
assert.ok(brokenCountResult.errors.some((e) => e.includes("record_count")));

const brokenSha = JSON.parse(JSON.stringify(clone));
brokenSha.records[0].source_sha256 = "0".repeat(64);
fs.writeFileSync(path.join(tmpTraceDir, "index.json"), JSON.stringify(brokenSha, null, 2) + "\n");
const brokenShaResult = validateTraceabilityIndex("docs/launch/traceability/index.json");
assert.equal(brokenShaResult.ok, false);
assert.ok(brokenShaResult.errors.some((e) => e.includes("source_sha256")));

const brokenClaim = JSON.parse(JSON.stringify(clone));
brokenClaim.claim_ceiling.not_execution_evidence = false;
fs.writeFileSync(path.join(tmpTraceDir, "index.json"), JSON.stringify(brokenClaim, null, 2) + "\n");
const brokenClaimResult = validateTraceabilityIndex("docs/launch/traceability/index.json");
assert.equal(brokenClaimResult.ok, false);
assert.ok(brokenClaimResult.errors.some((e) => e.includes("claim_ceiling.not_execution_evidence")));

const brokenOverclaim = JSON.parse(JSON.stringify(clone));
brokenOverclaim.records[0].overclaim_check.result_does_not_exceed_evidence_class = false;
fs.writeFileSync(path.join(tmpTraceDir, "index.json"), JSON.stringify(brokenOverclaim, null, 2) + "\n");
const brokenOverclaimResult = validateTraceabilityIndex("docs/launch/traceability/index.json");
assert.equal(brokenOverclaimResult.ok, false);
assert.ok(brokenOverclaimResult.errors.some((e) => e.includes("overclaim_check.result_does_not_exceed_evidence_class")));

process.chdir(cwd);

console.log("TRACEABILITY_V1_2_INDEX_VALIDATOR_TEST=PASS");
