'use strict';

const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const assert = require('node:assert/strict');
const {
  REQUIRED_EXTERNAL_GATES,
  REQUIRED_REQUIREMENTS,
  validateManifest
} = require('./check-v180-coverage.js');

const ROOT = path.resolve(__dirname, '..');
const TEMPLATE = JSON.parse(fs.readFileSync(
  path.join(ROOT, 'docs', 'V1.8.0_IMPLEMENTATION_COVERAGE.json'),
  'utf8'
));

function clone(value){
  return JSON.parse(JSON.stringify(value));
}

test('committed V1.8 implementation coverage traces every required objective', () => {
  const errors = validateManifest(TEMPLATE);
  assert.deepEqual(errors, []);
  assert.equal(TEMPLATE.requirements.length, REQUIRED_REQUIREMENTS.length);
  assert.equal(TEMPLATE.external_gates.length, REQUIRED_EXTERNAL_GATES.length);
  assert.equal(TEMPLATE.contains_pupil_data, false);
  assert.equal(Object.prototype.hasOwnProperty.call(TEMPLATE, 'promotion_authorised'), false);
});

test('missing or unknown implementation objectives fail closed', () => {
  const manifest = clone(TEMPLATE);
  manifest.requirements.shift();
  manifest.requirements.push({
    id: 'unreviewed_extra',
    status: 'implemented-and-verified',
    summary: 'Unexpected requirement',
    implementation_evidence: [{ path: 'README.md', contains: 'ChoiceTrain' }],
    automated_evidence: [{ path: 'README.md', contains: 'ChoiceTrain' }],
    limitations: ['Not reviewed.']
  });
  const errors = validateManifest(manifest);
  assert.ok(errors.some(error => error.includes('required implementation objective is missing')));
  assert.ok(errors.some(error => error.includes('unknown implementation objective')));
});

test('missing files and stale evidence anchors fail closed', () => {
  const manifest = clone(TEMPLATE);
  manifest.requirements[0].implementation_evidence = [
    { path: 'missing-file.js', contains: 'anything' },
    { path: 'README.md', contains: 'ANCHOR-THAT-DOES-NOT-EXIST' }
  ];
  const errors = validateManifest(manifest);
  assert.ok(errors.some(error => error.includes('references missing file')));
  assert.ok(errors.some(error => error.includes('anchor was not found')));
});

test('coverage cannot freeze or authorise external gates', () => {
  const manifest = clone(TEMPLATE);
  manifest.candidate_frozen = true;
  manifest.promotion_authorised = true;
  manifest.external_gates[0].status = 'passed';
  const errors = validateManifest(manifest);
  assert.ok(errors.some(error => error.includes('candidate_frozen is controlled only by the promotion evidence record')));
  assert.ok(errors.some(error => error.includes('promotion_authorised is controlled only by the promotion evidence record')));
  assert.ok(errors.some(error => error.includes('must be managed-by-promotion-record')));
});

test('malformed root data fails safely', () => {
  assert.deepEqual(validateManifest(null), ['manifest must be an object']);
});
