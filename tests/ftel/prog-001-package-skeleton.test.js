const assert = require('node:assert/strict');
const fs = require('node:fs');

const requiredDirs = [
  'apps/hbce-api',
  'apps/hbce-demo',
  'apps/hbce-verifier-cli',

  'packages/hbce-core',
  'packages/hbce-schemas',
  'packages/hbce-api-contract',
  'packages/hbce-identity',
  'packages/hbce-policy',
  'packages/hbce-ftel',
  'packages/hbce-events',
  'packages/hbce-anchor',
  'packages/hbce-targets',
  'packages/hbce-evidence',
  'packages/hbce-trust',

  'tests/ftel/unit',
  'tests/ftel/state-machine',
  'tests/ftel/adversarial',
  'tests/ftel/integration',

  'docs/programming',
  'docs/legal-boundary',
  'docs/demo-scenarios'
];

for (const dir of requiredDirs) {
  assert.equal(fs.existsSync(dir), true, `missing directory: ${dir}`);
}

const doc = fs.readFileSync('docs/programming/P0_PACKAGE_SKELETON_R2_PROG_0_1.md', 'utf8');

assert.match(doc, /AI Agent Tool Access Evidence Layer/);
assert.match(doc, /no dashboard before verifier/);
assert.match(doc, /This commit does not claim/);
assert.match(doc, /runtime implementation/);
assert.match(doc, /regulatory certification/);

console.log('PASS PROG-001-P0-PACKAGE-SKELETON-DIRS');
console.log('PASS PROG-001-P0-PACKAGE-SKELETON-BOUNDARY');
