const fs = require('fs');
const crypto = require('crypto');
const assert = require('assert');

const checklistPath = 'artifacts/product/hbce-evidence-core-v1-banking-reviewer-checklist-2026-09-24.md';

const files = {
  dossier: 'artifacts/product/hbce-evidence-core-v1-external-facing-dossier-2026-09-24.md',
  dossierTest: 'tests/product/validate-hbce-evidence-core-v1-external-facing-dossier.test.js',
  packIndex: 'artifacts/product/hbce-evidence-core-v1-banking-demo-pack-index-2026-09-24.md',
  packIndexTest: 'tests/product/validate-hbce-evidence-core-v1-banking-demo-pack-index.test.js',
  contract: 'artifacts/product/hbce-evidence-core-v1-api-adapter-contract-2026-09-24.md',
  contractTest: 'tests/product/validate-hbce-evidence-core-v1-api-adapter-contract.test.js',
  manifest: 'artifacts/product/hbce-evidence-core-v1-banking-demo-manifest-2026-09-24.md',
  manifestTest: 'tests/product/validate-hbce-evidence-core-v1-banking-demo-manifest.test.js',
  artifact: 'artifacts/product/hbce-evidence-core-v1-demo-payload-export-2026-09-24.json',
  artifactTest: 'tests/product/validate-hbce-evidence-core-v1-demo-json-artifact.test.js',
  checkpoint: 'MAIN_POST_HBCE_EVIDENCE_CORE_V1_EXTERNAL_FACING_DOSSIER_CHECKPOINT_2026_09_24.md',
};

const expectedHashes = {
  dossier: '4988decb5d81c4fea8760e032747d505207b91c5c68c9489112e998af5f8de9d',
  dossierTest: '6228b06521f09b6c88b6399f590c4251b09cd7cdc2496820cae8ff4de79739b9',
  packIndex: '261131010e24687c1fe9f5be486cee9145ac8c8a931c67077b5c7fc4daab93c3',
  packIndexTest: '6172a61017d0de5665f17eb440abaa89a526af0fe6ccc8968a801ab982a66f6f',
  contract: '79233f7f37c0afca1dff0fc604f425d094d54e968a7bb864b88c3805ac87a963',
  contractTest: 'e9ea6782c0903b46451ea7ae34b50e99e49a30db47828e4952ec233646cc52d2',
  manifest: 'd8d839c54e676f46f5e3f8b43d9a1e0b9503f9e6e1f387036962e093249c040c',
  manifestTest: '1db3c724a450053adee9de011792bf4505946a35fc6d79ae2aa25704054d09da',
  artifact: 'fb688399b1fbabe7060a9c74f3a88aeb03c60d0069ae6c4ed40a330697ba710f',
  artifactTest: 'b9dfe9c84524f78aff856f26dfcd6cf6c6276b0259d6c5df61fb9fcbfb7dd515',
  checkpoint: '0c40cea4d5bb6a8be3110060d3eac4b60373d2af68559e1e3d69bacac6674dab',
};

function pass(name) {
  console.log(`PASS ${name}`);
}

function sha256File(path) {
  return crypto.createHash('sha256').update(fs.readFileSync(path)).digest('hex');
}

assert.ok(fs.existsSync(checklistPath));
const doc = fs.readFileSync(checklistPath, 'utf8');
pass('HBCE_BANKING_REVIEWER_CHECKLIST_EXISTS');

assert.match(doc, /^# HBCE Evidence Core v1 — Banking Reviewer Checklist/m);
assert.match(doc, /Status: controlled review checklist, non-production, non-authorizing\./);
assert.match(doc, /Audience: banking reviewers, compliance reviewers, audit reviewers, security reviewers, innovation reviewers and procurement reviewers\./);
pass('HBCE_BANKING_REVIEWER_CHECKLIST_HEADER');

assert.match(doc, /controlled review checklist/);
assert.match(doc, /not a legal opinion, certification report, regulatory approval, production readiness declaration, external review completion statement or authorization decision/);
pass('HBCE_BANKING_REVIEWER_CHECKLIST_PURPOSE');

assert.match(doc, /Canonical repository: hermeticum-bce-platform/);
assert.match(doc, /Derived banking product repository: hermeticum-bce-bank/);
assert.match(doc, /Canonical checkpoint commit: df0f8b42fd7e1ee9d64ff7ea955aa00c1e8f870b/);
assert.match(doc, /PR136 merge commit: f5576f3f44eaa9b36067643760ec95b85c74e717/);
assert.match(doc, /PR136 feature commit: 6cf54bc6c86a30966e9cd92062eb48411f11b6a3/);
pass('HBCE_BANKING_REVIEWER_CHECKLIST_CANONICAL_SOURCE');

assert.match(doc, new RegExp(files.dossier.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
assert.match(doc, new RegExp(files.packIndex.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
assert.match(doc, new RegExp(files.contract.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
assert.match(doc, new RegExp(files.manifest.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
assert.match(doc, new RegExp(files.artifact.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
assert.match(doc, new RegExp(files.checkpoint.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
pass('HBCE_BANKING_REVIEWER_CHECKLIST_SOURCE_PACK');

for (const hash of Object.values(expectedHashes)) {
  assert.match(doc, new RegExp(hash));
}
assert.match(doc, /Demo payload export SHA-256: a6c90405c01f96079dc3f1883b81b22340fac7df60c5bd0a6c6b897d43f27cfd/);
assert.match(doc, /Demo payload core SHA-256: a62615e28a2a0514a4c88025d6dcb8d90d45824960337e88e9aef8797b0ffee5/);
pass('HBCE_BANKING_REVIEWER_CHECKLIST_SOURCE_HASHES');

assert.match(doc, /PR136 external-facing dossier validation: 19\/19 PASS/);
assert.match(doc, /PR135 banking demo pack index validation: 16\/16 PASS/);
assert.match(doc, /PR134 API adapter contract validation: 15\/15 PASS/);
assert.match(doc, /PR133 banking demo manifest validation: 13\/13 PASS/);
assert.match(doc, /PR132 JSON artifact validation: 13\/13 PASS/);
assert.match(doc, /PR131 demo payload export validation: 18\/18 PASS/);
assert.match(doc, /PR130 readable product surface validation: 19\/19 PASS/);
assert.match(doc, /PR128 source review package validation: 21\/21 PASS/);
pass('HBCE_BANKING_REVIEWER_CHECKLIST_VALIDATION_BASELINE');

assert.match(doc, /### 1\. Intake/);
assert.match(doc, /### 2\. Artifact presence/);
assert.match(doc, /### 3\. Hash verification/);
assert.match(doc, /### 4\. Test verification/);
assert.match(doc, /### 5\. Evidence interpretation/);
assert.match(doc, /### 6\. Boundary checks/);
assert.match(doc, /### 7\. Reviewer outcome/);
pass('HBCE_BANKING_REVIEWER_CHECKLIST_REVIEW_SECTIONS');

assert.match(doc, /Confirm that the reviewed repository is hermeticum-bce-platform\./);
assert.match(doc, /Confirm that the canonical checkpoint commit is df0f8b42fd7e1ee9d64ff7ea955aa00c1e8f870b\./);
assert.match(doc, /Confirm that the reviewed material refers to hermeticum-bce-bank only as a derived banking product repository\./);
assert.match(doc, /Confirm that the review scope is evidence inspection, not legal approval, regulatory approval or production approval\./);
pass('HBCE_BANKING_REVIEWER_CHECKLIST_INTAKE');

assert.match(doc, /Confirm that the external-facing banking review dossier exists\./);
assert.match(doc, /Confirm that the banking demo pack index exists\./);
assert.match(doc, /Confirm that the API adapter contract exists\./);
assert.match(doc, /Confirm that the banking demo manifest exists\./);
assert.match(doc, /Confirm that the demo JSON artifact exists\./);
assert.match(doc, /Confirm that the PR136 checkpoint exists\./);
pass('HBCE_BANKING_REVIEWER_CHECKLIST_ARTIFACT_PRESENCE');

assert.match(doc, /Compare the external-facing dossier file hash against the expected SHA-256\./);
assert.match(doc, /Compare the demo payload export hash inside the JSON artifact against the expected SHA-256\./);
assert.match(doc, /Compare the demo payload core hash inside the JSON artifact against the expected SHA-256\./);
assert.match(doc, /Compare the PR136 checkpoint document hash against the expected SHA-256\./);
pass('HBCE_BANKING_REVIEWER_CHECKLIST_HASH_VERIFICATION');

assert.match(doc, /Run the PR136 external-facing dossier validation test\./);
assert.match(doc, /Run the PR135 banking demo pack index validation test\./);
assert.match(doc, /Run the PR134 API adapter contract validation test\./);
assert.match(doc, /Run the PR128 source review package validation test\./);
pass('HBCE_BANKING_REVIEWER_CHECKLIST_TEST_VERIFICATION');

assert.match(doc, /may conclude that the pack demonstrates a deterministic evidence-review package/);
assert.match(doc, /may conclude that the pack contains a controlled banking demo narrative/);
assert.match(doc, /suitable for structured review discussion with banking, compliance, audit, security, innovation and procurement stakeholders/);
pass('HBCE_BANKING_REVIEWER_CHECKLIST_ALLOWED_INTERPRETATION');

assert.match(doc, /must not interpret the pack as production deployment/);
assert.match(doc, /must not interpret the pack as live API availability/);
assert.match(doc, /must not interpret the pack as legal certification/);
assert.match(doc, /must not interpret the pack as eIDAS qualification/);
assert.match(doc, /must not interpret the pack as regulatory approval/);
assert.match(doc, /must not interpret the pack as external review completion/);
assert.match(doc, /must not interpret the pack as OPC ALLOW creation/);
assert.match(doc, /must not interpret the pack as autonomous banking authorization/);
assert.match(doc, /must not interpret the pack as live transaction approval/);
assert.match(doc, /must not interpret the pack as financial transaction approval/);
pass('HBCE_BANKING_REVIEWER_CHECKLIST_PROHIBITED_INTERPRETATION');

assert.match(doc, /Confirm that the evidence pack remains read-only\./);
assert.match(doc, /Confirm that the evidence pack remains observe-only\./);
assert.match(doc, /Confirm that the evidence pack remains non-production\./);
assert.match(doc, /Confirm that the evidence pack remains non-authorizing\./);
assert.match(doc, /Confirm that the API adapter contract is a contract, not a live endpoint proof\./);
assert.match(doc, /Confirm that no customer-facing production approval is claimed\./);
assert.match(doc, /Confirm that no banking operation approval is claimed\./);
pass('HBCE_BANKING_REVIEWER_CHECKLIST_BOUNDARY_CHECKS');

assert.match(doc, /Outcome A: reviewable as controlled evidence\./);
assert.match(doc, /Outcome B: reviewable with clarification\./);
assert.match(doc, /Outcome C: not reviewable in current form\./);
assert.match(doc, /must not record a production approval outcome/);
assert.match(doc, /must not record a regulatory approval outcome/);
assert.match(doc, /must not record a legal certification outcome/);
pass('HBCE_BANKING_REVIEWER_CHECKLIST_OUTCOMES');

assert.match(doc, /Reviewer organization:/);
assert.match(doc, /Reviewer role:/);
assert.match(doc, /Review date:/);
assert.match(doc, /Commit inspected:/);
assert.match(doc, /Boundary exceptions observed:/);
pass('HBCE_BANKING_REVIEWER_CHECKLIST_NOTES_TEMPLATE');

assert.match(doc, /minimal controlled review can proceed only if/);
assert.match(doc, /the source hashes match/);
assert.match(doc, /the validation tests pass/);
assert.match(doc, /the reviewer accepts that the pack is non-production and non-authorizing/);
assert.match(doc, /separates evidence review from legal, regulatory, eIDAS, OPC and production approval/);
pass('HBCE_BANKING_REVIEWER_CHECKLIST_ACCEPTANCE_CONDITION');

assert.match(doc, /The hermeticum-bce-bank repository may consume this checklist after PR137 is merged and checkpointed in hermeticum-bce-platform\./);
assert.match(doc, /preserve upstream commit, upstream artifact paths, upstream hashes and upstream validation counts/);
assert.match(doc, /should not create a competing canonical evidence chain/);
pass('HBCE_BANKING_REVIEWER_CHECKLIST_BANK_REPO_HANDOFF');

assert.match(doc, /It does not approve, certify, authorize, deploy, regulate, qualify or operate any banking system\./);
pass('HBCE_BANKING_REVIEWER_CHECKLIST_FINAL_BOUNDARY');

for (const [name, path] of Object.entries(files)) {
  assert.strictEqual(sha256File(path), expectedHashes[name], `${name} hash mismatch`);
}
pass('HBCE_BANKING_REVIEWER_CHECKLIST_SOURCE_HASHES_MATCH_FILES');

const artifact = JSON.parse(fs.readFileSync(files.artifact, 'utf8'));
assert.strictEqual(
  artifact.evidence_core_v1_demo_payload_export_sha256,
  'a6c90405c01f96079dc3f1883b81b22340fac7df60c5bd0a6c6b897d43f27cfd'
);
assert.strictEqual(
  artifact.demo_payload_core_sha256,
  'a62615e28a2a0514a4c88025d6dcb8d90d45824960337e88e9aef8797b0ffee5'
);
pass('HBCE_BANKING_REVIEWER_CHECKLIST_JSON_INTERNAL_HASHES');

const checklistHash = sha256File(checklistPath);
assert.strictEqual(checklistHash.length, 64);
pass('HBCE_BANKING_REVIEWER_CHECKLIST_FILE_HASH_STABLE');
