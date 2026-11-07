'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const { parseArgs, stampContent } = require('./stamp-build');

const metadata = {
  app: 'ChoiceTrain for ShowMe',
  version: '1.8.0-alpha',
  release_label: 'V1.8.0-alpha',
  channel: 'experimental',
  source_file: 'choice_train_V1.8.0-alpha.html',
  source_script: 'choice_train_V1.8.0-alpha.js',
  based_on_branch: 'feature/research',
  based_on_commit: 'abc1234',
  build_date: '2026-11-07',
  published_entry: 'not published',
  live_url: 'https://example.test/',
  repo_url: 'https://example.test/repo'
};

test('stampContent replaces one build block and preserves surrounding code', () => {
  const source = [
    '(() => {',
    '  const APP_BUILD = Object.freeze({',
    "    version: 'old'",
    '  });',
    '  const preserved = true;',
    '})();',
    ''
  ].join('\r\n');
  const stamped = stampContent(source, metadata);
  assert.match(stamped, /version: "1\.8\.0-alpha"/);
  assert.match(stamped, /based_on_commit: "abc1234"/);
  assert.match(stamped, /const preserved = true;/);
  assert.ok(stamped.includes('\r\n'));
});

test('stampContent rejects missing and duplicate build blocks', () => {
  assert.throws(() => stampContent('const value = 1;\n', metadata), /found 0/);
  const block = 'const APP_BUILD = Object.freeze({\n  version: "old"\n});\n';
  assert.throws(() => stampContent(block + block, metadata), /found 2/);
});

test('parseArgs requires explicit files and supports dry-run metadata', () => {
  const options = parseArgs([
    '--version', '1.8.0-alpha',
    '--file', 'choice_train_V1.8.0-alpha.js',
    '--channel', 'experimental',
    '--commit', 'abc1234',
    '--dry-run'
  ]);
  assert.equal(options.version, '1.8.0-alpha');
  assert.deepEqual(options.files, ['choice_train_V1.8.0-alpha.js']);
  assert.equal(options.channel, 'experimental');
  assert.equal(options.commit, 'abc1234');
  assert.equal(options.dryRun, true);
});
