'use strict';

const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const assert = require('node:assert/strict');
const {
  REQUIRED_GATES,
  evaluateManifest,
  validateManifestShape,
  validatePendingTemplate
} = require('./check-v180-promotion.js');

const ROOT = path.resolve(__dirname, '..');
const TEMPLATE = JSON.parse(fs.readFileSync(
  path.join(ROOT, 'docs', 'V1.8.0_PROMOTION_EVIDENCE.json'),
  'utf8'
));
const COMMIT = '0123456789abcdef0123456789abcdef01234567';

function completedManifest(){
  const manifest = JSON.parse(JSON.stringify(TEMPLATE));
  manifest.candidate_commit = COMMIT;
  manifest.last_reviewed_date = '2026-11-07';
  manifest.promotion_authorised = true;
  REQUIRED_GATES.forEach(key => {
    manifest.gates[key] = {
      status: 'passed',
      evidence_reference: `EVIDENCE-${key}`,
      reviewed_by: 'Authorised review role',
      reviewed_date: '2026-11-07',
      limitations: ''
    };
  });
  return manifest;
}

function pendingManifest(){
  const manifest = completedManifest();
  manifest.candidate_commit = null;
  manifest.last_reviewed_date = null;
  manifest.promotion_authorised = false;
  REQUIRED_GATES.forEach(key => {
    manifest.gates[key] = {
      status: 'pending',
      evidence_reference: '',
      reviewed_by: '',
      reviewed_date: null,
      limitations: ''
    };
  });
  return manifest;
}

test('committed promotion evidence has the complete pupil-data-free structure', () => {
  const errors = validateManifestShape(TEMPLATE);
  assert.deepEqual(errors, []);
  assert.equal(TEMPLATE.privacy.declared_no_pupil_data, true);
  assert.equal(TEMPLATE.privacy.external_evidence_stored_outside_repository, true);
});

test('a pending record cannot authorise release', () => {
  const manifest = pendingManifest();
  const result = validatePendingTemplate(manifest);
  assert.equal(result.passed, true, result.errors.join('\n'));
  const promotion = evaluateManifest(manifest, COMMIT);
  assert.equal(promotion.passed, false);
  assert.ok(promotion.errors.some(error => error.includes('promotion_authorised')));
  assert.equal(promotion.rows.filter(row => !row.accepted).length, REQUIRED_GATES.length);
});

test('complete evidence for the exact frozen commit passes the manual guard', () => {
  const result = evaluateManifest(completedManifest(), COMMIT);
  assert.equal(result.passed, true, result.errors.join('\n'));
  assert.equal(result.rows.length, REQUIRED_GATES.length);
});

test('stale commits and failed gates cannot pass', () => {
  const manifest = completedManifest();
  manifest.gates.staff_usability.status = 'failed';
  const result = evaluateManifest(manifest, 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa');
  assert.equal(result.passed, false);
  assert.ok(result.errors.some(error => error.includes('does not match expected commit')));
  assert.ok(result.errors.some(error => error.includes('staff_usability is failed')));
});

test('limitations, reviewer, evidence, and valid dates are mandatory', () => {
  const manifest = completedManifest();
  manifest.gates.ipad_safari.status = 'passed-with-limitations';
  manifest.gates.ipad_safari.limitations = '';
  manifest.gates.android_chrome.evidence_reference = '';
  manifest.gates.kindle_silk.reviewed_by = '';
  manifest.gates.eeg_hardware_timing.reviewed_date = '2026-02-30';
  const result = evaluateManifest(manifest, COMMIT);
  assert.equal(result.passed, false);
  assert.ok(result.errors.some(error => error.includes('ipad_safari.limitations')));
  assert.ok(result.errors.some(error => error.includes('android_chrome.evidence_reference')));
  assert.ok(result.errors.some(error => error.includes('kindle_silk.reviewed_by')));
  assert.ok(result.errors.some(error => error.includes('eeg_hardware_timing.reviewed_date')));
});

test('malformed root data fails safely rather than throwing', () => {
  const result = evaluateManifest(null, COMMIT);
  assert.equal(result.passed, false);
  assert.deepEqual(result.rows, []);
  assert.ok(result.errors.includes('manifest must be an object'));
});
