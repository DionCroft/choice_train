'use strict';

const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const assert = require('node:assert/strict');
const {
  REQUIRED_COMMANDS,
  buildReviewPack,
  normaliseGitOutput,
  parseArgs,
  renderMarkdown,
  renderValidationWorksheet,
  resolveOutputDir
} = require('./create-v180-review-pack.js');

const ROOT = path.resolve(__dirname, '..');
const FIXED_COMMIT = '0123456789abcdef0123456789abcdef01234567';

function fixedPack(){
  return buildReviewPack({
    generatedAtIso: '2026-11-07T15:00:00.000Z',
    candidateCommit: FIXED_COMMIT,
    branch: 'feature/v1.8.0-research-personalisation',
    workingTreeClean: true
  });
}

function collectKeys(value, keys=[]){
  if(Array.isArray(value)) value.forEach(item => collectKeys(item, keys));
  else if(value && typeof value === 'object'){
    Object.entries(value).forEach(([key, child]) => {
      keys.push(key);
      collectKeys(child, keys);
    });
  }
  return keys;
}

test('review pack is pupil-data-free and excludes protected evidence fields', () => {
  const pack = fixedPack();
  assert.equal(pack.contains_pupil_data, false);
  assert.equal(pack.external_evidence_included, false);
  assert.equal(pack.source_state.candidate_commit, FIXED_COMMIT);
  assert.equal(pack.source_state.pack_state, 'clean-engineering-snapshot');
  const keys = collectKeys(pack);
  ['evidence_reference', 'reviewed_by', 'reviewed_date', 'learner', 'session', 'context_notes', 'photo_labels']
    .forEach(key => assert.equal(keys.includes(key), false, `${key} must not be copied`));
});

test('review pack protects stable V1.7 and traces all internal requirements', () => {
  const pack = fixedPack();
  assert.equal(pack.stable_release.byte_identical, true);
  assert.equal(pack.stable_release.protected_hash_matches, true);
  assert.equal(pack.internal_coverage.requirement_count, 16);
  assert.equal(pack.internal_coverage.requirement_ids.length, 16);
  assert.equal(pack.internal_coverage.all_evidence_anchors_valid, true);
});

test('review pack mirrors only promotion gate status codes', () => {
  const promotion = JSON.parse(fs.readFileSync(path.join(ROOT, 'docs', 'V1.8.0_PROMOTION_EVIDENCE.json'), 'utf8'));
  const pack = fixedPack();
  assert.equal(pack.promotion_record.gates.length, 13);
  pack.promotion_record.gates.forEach(gate => {
    assert.equal(gate.status, promotion.gates[gate.id].status);
    assert.deepEqual(Object.keys(gate).sort(), ['id', 'status']);
  });
});

test('review pack lists every required engineering command and explicit boundary', () => {
  const pack = fixedPack();
  assert.deepEqual(pack.required_engineering_commands, REQUIRED_COMMANDS);
  assert.match(pack.interpretation_boundary, /does not freeze a candidate/i);
  assert.match(pack.interpretation_boundary, /authorise promotion/i);
  const markdown = renderMarkdown(pack);
  assert.match(markdown, /Candidate commit: `0123456789abcdef/);
  assert.match(markdown, /External Gate Status/);
  assert.match(markdown, /Keep protected evidence outside the repository/);
});

test('review pack renders a blank external worksheet for every human and device gate', () => {
  const pack = fixedPack();
  const worksheet = renderValidationWorksheet(pack);
  assert.equal(pack.report_version, '1.1.0');
  assert.equal(pack.review_materials.external_validation_worksheet, 'ChoiceTrain_V1.8.0-alpha_ExternalValidationWorksheet.md');
  assert.match(worksheet, new RegExp(FIXED_COMMIT));
  assert.match(worksheet, /Do not commit a completed copy/i);
  assert.match(worksheet, /Do not record pupil names, aliases, photographs/i);
  assert.match(worksheet, /Staff Usability/);
  assert.match(worksheet, /Physical Device Matrix/);
  assert.match(worksheet, /Assistive Access/);
  assert.match(worksheet, /EEG Hardware Timing/);
  assert.match(worksheet, /Findings and Retests/);
  assert.match(worksheet, /Product-owner Decision/);
  pack.promotion_record.gates.forEach(gate => assert.match(worksheet, new RegExp(`\\| ${gate.id} \\| pending \\|`)));
  assert.equal(pack.review_materials.worksheet_state, 'blank-template');
  assert.equal(pack.review_materials.contains_review_evidence, false);
});

test('review pack output is restricted to ignored test-results', () => {
  const accepted = resolveOutputDir('test-results/review-pack-test');
  assert.equal(accepted, path.join(ROOT, 'test-results', 'review-pack-test'));
  assert.throws(() => resolveOutputDir('docs/review-pack'), /must stay below the ignored test-results/);
  assert.throws(() => resolveOutputDir('../outside'), /Path must stay inside the repository/);
});

test('review pack CLI parsing is explicit and safe', () => {
  assert.deepEqual(parseArgs([]), {
    outputDir: 'test-results/v180-review-pack',
    allowDirty: false,
    dryRun: false
  });
  assert.deepEqual(parseArgs(['--output-dir', 'test-results/custom', '--allow-dirty', '--dry-run']), {
    outputDir: 'test-results/custom',
    allowDirty: true,
    dryRun: true
  });
  assert.throws(() => parseArgs(['--output-dir']), /requires a value/);
  assert.throws(() => parseArgs(['--unknown']), /Unknown option/);
});

test('successful empty Git output remains empty for clean-worktree detection', () => {
  assert.equal(normaliseGitOutput(''), '');
  assert.equal(normaliseGitOutput('  \r\n'), '');
  assert.equal(normaliseGitOutput('feature/v1.8.0-research-personalisation\n'), 'feature/v1.8.0-research-personalisation');
});
