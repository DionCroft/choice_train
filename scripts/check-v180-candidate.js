'use strict';

const crypto = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');
const { validateManifest: validateCoverageManifest } = require('./check-v180-coverage.js');

const ROOT = path.resolve(__dirname, '..');
const PROTECTED_STABLE_SHA256 = '77b4033411d9b20caafaaa6739f7c5317eef1efb010cf88c92a1571ed58e16aa';
const EXPECTED_CONTRACTS = Object.freeze({
  dataSchema: '8',
  localDataMigration: '7',
  photoSchema: '4',
  skillGraph: '1.4.0',
  generator: '1.7.0',
  researchWorkspaceExport: '2.2.0',
  categorySkillState: '1.0.0',
  humanObservationContext: '1.0.0',
  recommendation: '1.5.0',
  privacyExport: '1.3.0',
  dataQuality: '1.0.0',
  deviceReadinessReport: '1.0.0'
});

const failures = [];
let passed = 0;

function read(relativePath) {
  return fs.readFileSync(path.join(ROOT, relativePath), 'utf8');
}

function readBuffer(relativePath) {
  return fs.readFileSync(path.join(ROOT, relativePath));
}

function sha256(buffer) {
  return crypto.createHash('sha256').update(buffer).digest('hex');
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function check(label, callback) {
  try {
    callback();
    passed += 1;
    console.log(`PASS ${label}`);
  } catch (error) {
    failures.push({ label, message: error.message });
    console.error(`FAIL ${label}: ${error.message}`);
  }
}

function countMatches(source, pattern) {
  return Array.from(source.matchAll(pattern)).length;
}

check('protected V1.7 live entry is byte-identical to the stable snapshot', () => {
  const index = readBuffer('index.html');
  const stable = readBuffer('choice_train_V1.7.0.html');
  assert(index.equals(stable), 'index.html differs from choice_train_V1.7.0.html');
  assert(sha256(index) === PROTECTED_STABLE_SHA256, 'protected stable hash changed');
});

check('isolated V1.8 candidate files exist', () => {
  [
    'choice_train_V1.8.0-alpha.html',
    'choice_train_V1.8.0-alpha.js',
    'choice_train_V1.8.0-alpha.css'
  ].forEach((file) => assert(fs.existsSync(path.join(ROOT, file)), `${file} is missing`));
});

check('V1.8 HTML loads only its paired candidate assets', () => {
  const html = read('choice_train_V1.8.0-alpha.html');
  assert(countMatches(html, /<script\s+src=["']choice_train_V1\.8\.0-alpha\.js["']><\/script>/g) === 1,
    'expected exactly one V1.8 candidate script reference');
  assert(countMatches(html, /<link\s+rel=["']stylesheet["']\s+href=["']choice_train_V1\.8\.0-alpha\.css["']\s*\/?>/g) === 1,
    'expected exactly one V1.8 candidate stylesheet reference');
  assert(!/<(?:script|link|img)\b[^>]+(?:src|href)=["']https?:\/\//i.test(html),
    'candidate HTML loads a remote script, stylesheet, or image');
});

check('V1.8 build metadata remains experimental and unpublished', () => {
  const source = read('choice_train_V1.8.0-alpha.js');
  assert(/version:\s*["']1\.8\.0-alpha["']/.test(source), 'APP_BUILD version is not 1.8.0-alpha');
  assert(/channel:\s*["']experimental["']/.test(source), 'APP_BUILD channel is not experimental');
  assert(/source_file:\s*["']choice_train_V1\.8\.0-alpha\.html["']/.test(source), 'APP_BUILD source file is wrong');
  assert(/source_script:\s*["']choice_train_V1\.8\.0-alpha\.js["']/.test(source), 'APP_BUILD source script is wrong');
  assert(/published_entry:\s*["'][^"']*not published[^"']*["']/i.test(source), 'APP_BUILD does not preserve the unpublished boundary');
});

check('runtime contract versions match the reviewed V1.8 schemas', () => {
  const source = read('choice_train_V1.8.0-alpha.js');
  assert(new RegExp(`const DATA_SCHEMA_VERSION = ${EXPECTED_CONTRACTS.dataSchema};`).test(source), 'data schema version drifted');
  assert(new RegExp(`const LOCAL_DATA_MIGRATION_VERSION = ${EXPECTED_CONTRACTS.localDataMigration};`).test(source), 'local data migration version drifted');
  assert(new RegExp(`const PHOTO_SCHEMA_VERSION = ${EXPECTED_CONTRACTS.photoSchema};`).test(source), 'photo schema version drifted');
  assert(new RegExp(`const SKILL_GRAPH_VERSION = ['"]${EXPECTED_CONTRACTS.skillGraph.replaceAll('.', '\\.')}['"];`).test(source), 'skill graph version drifted');
  assert(new RegExp(`const GENERATOR_VERSION = ['"]${EXPECTED_CONTRACTS.generator.replaceAll('.', '\\.')}['"];`).test(source), 'generator version drifted');
  assert(new RegExp(`const RESEARCH_WORKSPACE_EXPORT_VERSION = ['"]${EXPECTED_CONTRACTS.researchWorkspaceExport.replaceAll('.', '\\.')}['"];`).test(source), 'research export version drifted');
  assert(new RegExp(`const CATEGORY_SKILL_STATE_VERSION = ['"]${EXPECTED_CONTRACTS.categorySkillState.replaceAll('.', '\\.')}['"];`).test(source), 'category-skill state version drifted');
  assert(new RegExp(`const HUMAN_OBSERVATION_CONTEXT_VERSION = ['"]${EXPECTED_CONTRACTS.humanObservationContext.replaceAll('.', '\\.')}['"];`).test(source), 'human-observation context version drifted');
  assert(new RegExp(`const RECOMMENDATION_VERSION = ['"]${EXPECTED_CONTRACTS.recommendation.replaceAll('.', '\\.')}['"];`).test(source), 'recommendation version drifted');
  assert(new RegExp(`const PRIVACY_EXPORT_VERSION = ['"]${EXPECTED_CONTRACTS.privacyExport.replaceAll('.', '\\.')}['"];`).test(source), 'privacy export version drifted');
  assert(new RegExp(`const DATA_QUALITY_SCHEMA_VERSION = ['"]${EXPECTED_CONTRACTS.dataQuality.replaceAll('.', '\\.')}['"];`).test(source), 'data-quality schema version drifted');
  assert(new RegExp(`const DEVICE_READINESS_REPORT_VERSION = ['"]${EXPECTED_CONTRACTS.deviceReadinessReport.replaceAll('.', '\\.')}['"];`).test(source), 'device-readiness report version drifted');
});

check('machine-readable candidate contracts are present and parseable', () => {
  [
    'schemas/choice-train-trial-v8.schema.json',
    'schemas/choice-train-research-summary-v2.2.schema.json',
    'schemas/choice-train-data-quality-v1.schema.json',
    'schemas/choice-train-model-dataset-v1.schema.json',
    'schemas/choice-train-device-readiness-v1.schema.json'
  ].forEach((file) => {
    const schema = JSON.parse(read(file));
    assert(schema.$schema === 'https://json-schema.org/draft/2020-12/schema', `${file} is not JSON Schema 2020-12`);
    assert(schema.type === 'object', `${file} does not define an object contract`);
  });
});

check('promotion evidence record has the complete pupil-data-free structure', () => {
  const evidence = JSON.parse(read('docs/V1.8.0_PROMOTION_EVIDENCE.json'));
  const requiredGates = [
    'automated_engineering', 'branch_ci', 'product_owner_approval', 'staff_usability',
    'learner_safeguarding', 'information_governance', 'legal_ethics',
    'windows_touchscreen', 'ipad_safari', 'android_chrome', 'kindle_silk',
    'assistive_access', 'eeg_hardware_timing'
  ];
  const validStatuses = ['pending', 'passed', 'passed-with-limitations', 'failed'];
  assert(evidence.manifest_version === '1.0.0', 'promotion evidence manifest version drifted');
  assert(evidence.candidate_commit === null || /^[0-9a-f]{40}$/i.test(evidence.candidate_commit),
    'promotion evidence candidate_commit must be null or a full Git SHA');
  assert(typeof evidence.promotion_authorised === 'boolean', 'promotion_authorised must be Boolean');
  assert(evidence.privacy && evidence.privacy.declared_no_pupil_data === true,
    'promotion record must declare that it contains no pupil data');
  requiredGates.forEach(gate => {
    assert(evidence.gates && evidence.gates[gate], `promotion evidence gate ${gate} is missing`);
    assert(validStatuses.includes(evidence.gates[gate].status), `promotion evidence gate ${gate} has an invalid status`);
  });
});

check('implementation coverage traces every internal objective without approving external gates', () => {
  const coverage = JSON.parse(read('docs/V1.8.0_IMPLEMENTATION_COVERAGE.json'));
  const errors = validateCoverageManifest(coverage);
  assert(errors.length === 0, errors.join('; '));
});

check('candidate runtime contains no external transport implementation', () => {
  const source = read('choice_train_V1.8.0-alpha.js');
  const networkPrimitive = /\b(?:fetch|XMLHttpRequest|WebSocket|EventSource|sendBeacon)\s*(?:\(|\.)/;
  assert(!networkPrimitive.test(source), 'found a browser network transport primitive in the candidate runtime');
});

check('CI validates release, promotion-guard, schema, coverage, candidate, and browser gates', () => {
  ['.github/workflows/ci.yml', '.github/workflows/pages.yml'].forEach((file) => {
    const workflow = read(file);
    ['npm run test:release', 'npm run test:promotion', 'npm run test:schema', 'npm run test:coverage', 'npm run check:candidate:v180', 'npm run test:browser', 'npm run test:browser:compat']
      .forEach((command) => assert(workflow.includes(command), `${file} does not run ${command}`));
    assert(/playwright install --with-deps chromium webkit/.test(workflow), `${file} does not install Chromium and WebKit`);
  });
  const packageJson = JSON.parse(read('package.json'));
  const defaultPlaywrightConfig = read('playwright.config.js');
  assert(packageJson.scripts && packageJson.scripts['test:browser:compat'], 'compatibility browser script is missing');
  assert(fs.existsSync(path.join(ROOT, 'playwright.compat.config.js')), 'compatibility Playwright config is missing');
  assert(fs.existsSync(path.join(ROOT, 'tests/choice-train-v180-compat.spec.js')), 'compatibility smoke test is missing');
  assert(/testIgnore:\s*['"]choice-train-v180-compat\.spec\.js['"]/.test(defaultPlaywrightConfig),
    'default browser matrix does not exclude the separately executed compatibility smoke test');
});

check('promotion and external validation boundaries remain documented', () => {
  const plan = read('docs/V1.8.0_RESEARCH_PERSONALISATION_PLAN.md');
  const validation = read('docs/V1.8.0_EXTERNAL_VALIDATION_PROTOCOL.md');
  const readiness = read('docs/V1.8.0_RELEASE_READINESS.md');
  assert(/product owner explicitly approves promotion/i.test(plan), 'explicit promotion approval gate is missing');
  assert(/true LSL or hardware-trigger integration/i.test(plan), 'hardware synchronisation boundary is missing');
  assert(/school\/legal\/ethics approval/i.test(plan), 'school, legal, and ethics boundary is missing');
  assert(/V1\.8\.0_PROMOTION_EVIDENCE\.json/.test(plan), 'machine-readable promotion evidence record is missing from the plan');
  assert(/automated WebKit\/Chromium compatibility smoke suite/i.test(validation), 'automated compatibility evidence boundary is missing');
  assert(/keep pupil information[\s\S]*out of this repository/i.test(validation), 'external validation pupil-data boundary is missing');
  assert(/V1\.8\.0_EXTERNAL_VALIDATION_PROTOCOL\.md/.test(readiness), 'release readiness does not link the external validation protocol');
});

console.log('');
console.log(`Automated V1.8 candidate checks: ${passed} passed, ${failures.length} failed.`);
console.log('Not automated: school usability, safeguarding, legal/ethics approval, physical-device testing, and measured EEG hardware latency.');
console.log('A passing result prepares a review candidate; it does not approve or perform promotion.');

if (failures.length) process.exitCode = 1;

