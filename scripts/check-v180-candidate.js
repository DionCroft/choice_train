'use strict';

const crypto = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');

const ROOT = path.resolve(__dirname, '..');
const PROTECTED_STABLE_SHA256 = '77b4033411d9b20caafaaa6739f7c5317eef1efb010cf88c92a1571ed58e16aa';
const EXPECTED_CONTRACTS = Object.freeze({
  dataSchema: '8',
  skillGraph: '1.4.0',
  generator: '1.6.0',
  researchWorkspaceExport: '1.6.0'
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
  assert(new RegExp(`const SKILL_GRAPH_VERSION = ['"]${EXPECTED_CONTRACTS.skillGraph.replaceAll('.', '\\.')}['"];`).test(source), 'skill graph version drifted');
  assert(new RegExp(`const GENERATOR_VERSION = ['"]${EXPECTED_CONTRACTS.generator.replaceAll('.', '\\.')}['"];`).test(source), 'generator version drifted');
  assert(new RegExp(`const RESEARCH_WORKSPACE_EXPORT_VERSION = ['"]${EXPECTED_CONTRACTS.researchWorkspaceExport.replaceAll('.', '\\.')}['"];`).test(source), 'research export version drifted');
});

check('machine-readable research contracts are present and parseable', () => {
  [
    'schemas/choice-train-trial-v8.schema.json',
    'schemas/choice-train-research-summary-v1.6.schema.json',
    'schemas/choice-train-model-dataset-v1.schema.json'
  ].forEach((file) => {
    const schema = JSON.parse(read(file));
    assert(schema.$schema === 'https://json-schema.org/draft/2020-12/schema', `${file} is not JSON Schema 2020-12`);
    assert(schema.type === 'object', `${file} does not define an object contract`);
  });
});

check('candidate runtime contains no external transport implementation', () => {
  const source = read('choice_train_V1.8.0-alpha.js');
  const networkPrimitive = /\b(?:fetch|XMLHttpRequest|WebSocket|EventSource|sendBeacon)\s*(?:\(|\.)/;
  assert(!networkPrimitive.test(source), 'found a browser network transport primitive in the candidate runtime');
});

check('CI validates release, schema, candidate, and browser gates', () => {
  ['.github/workflows/ci.yml', '.github/workflows/pages.yml'].forEach((file) => {
    const workflow = read(file);
    ['npm run test:release', 'npm run test:schema', 'npm run check:candidate:v180', 'npm run test:browser']
      .forEach((command) => assert(workflow.includes(command), `${file} does not run ${command}`));
  });
});

check('promotion and external validation boundaries remain documented', () => {
  const plan = read('docs/V1.8.0_RESEARCH_PERSONALISATION_PLAN.md');
  assert(/product owner explicitly approves promotion/i.test(plan), 'explicit promotion approval gate is missing');
  assert(/true LSL or hardware-trigger integration/i.test(plan), 'hardware synchronisation boundary is missing');
  assert(/school\/legal\/ethics approval/i.test(plan), 'school, legal, and ethics boundary is missing');
});

console.log('');
console.log(`Automated V1.8 candidate checks: ${passed} passed, ${failures.length} failed.`);
console.log('Not automated: school usability, safeguarding, legal/ethics approval, physical-device testing, and measured EEG hardware latency.');
console.log('A passing result prepares a review candidate; it does not approve or perform promotion.');

if (failures.length) process.exitCode = 1;

