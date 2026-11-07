#!/usr/bin/env node
'use strict';

const crypto = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');
const { validateManifest: validateCoverageManifest } = require('./check-v180-coverage.js');
const { validateManifestShape: validatePromotionManifestShape } = require('./check-v180-promotion.js');

const ROOT = path.resolve(__dirname, '..');
const DEFAULT_OUTPUT_DIR = 'test-results/v180-review-pack';
const REPORT_VERSION = '1.0.0';
const CANDIDATE_VERSION = '1.8.0-alpha';
const PROTECTED_STABLE_SHA256 = '77b4033411d9b20caafaaa6739f7c5317eef1efb010cf88c92a1571ed58e16aa';
const REQUIRED_COMMANDS = Object.freeze([
  'node --check choice_train_V1.8.0-alpha.js',
  'npm run test:release',
  'npm run test:promotion',
  'npm run test:schema',
  'npm run test:coverage',
  'npm run test:review-pack',
  'npm run check:candidate:v180',
  'npm run test:browser',
  'npm run test:browser:compat'
]);

function parseArgs(argv){
  const options = { outputDir: DEFAULT_OUTPUT_DIR, allowDirty: false, dryRun: false };
  for(let index = 0; index < argv.length; index += 1){
    const arg = argv[index];
    if(arg === '--allow-dirty') options.allowDirty = true;
    else if(arg === '--dry-run') options.dryRun = true;
    else if(arg === '--output-dir'){
      if(!argv[index + 1]) throw new Error('--output-dir requires a value');
      options.outputDir = argv[index + 1];
      index += 1;
    } else if(arg === '--help' || arg === '-h') options.help = true;
    else throw new Error(`Unknown option: ${arg}`);
  }
  return options;
}

function usage(){
  return [
    'Usage: node scripts/create-v180-review-pack.js [options]',
    '',
    'Options:',
    `  --output-dir <path>  Ignored output below test-results/ (default: ${DEFAULT_OUTPUT_DIR})`,
    '  --allow-dirty        Create a clearly labelled draft from a dirty tracked worktree',
    '  --dry-run            Validate and print a summary without writing files',
    '  --help               Show this help'
  ].join('\n');
}

function resolveRepositoryFile(relativePath){
  const resolved = path.resolve(ROOT, relativePath);
  const relative = path.relative(ROOT, resolved);
  if(relative.startsWith('..') || path.isAbsolute(relative)) throw new Error(`Path must stay inside the repository: ${relativePath}`);
  return resolved;
}

function resolveOutputDir(outputDir){
  const resolved = resolveRepositoryFile(outputDir);
  const ignoredRoot = path.join(ROOT, 'test-results');
  const relative = path.relative(ignoredRoot, resolved);
  if(relative.startsWith('..') || path.isAbsolute(relative)){
    throw new Error('Review-pack output must stay below the ignored test-results/ directory');
  }
  return resolved;
}

function read(relativePath){
  return fs.readFileSync(resolveRepositoryFile(relativePath), 'utf8');
}

function readJson(relativePath){
  return JSON.parse(read(relativePath));
}

function sha256(relativePath){
  return crypto.createHash('sha256').update(fs.readFileSync(resolveRepositoryFile(relativePath))).digest('hex');
}

function normaliseGitOutput(output){
  return String(output).trim();
}

function git(args, fallback='unknown'){
  try {
    return normaliseGitOutput(execFileSync('git', ['-C', ROOT, ...args], {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore']
    }));
  } catch(_error){
    return fallback;
  }
}

function runtimeBuildMetadata(){
  const source = read('choice_train_V1.8.0-alpha.js');
  const block = source.match(/const APP_BUILD = Object\.freeze\(\{([\s\S]*?)\n\s*\}\);/);
  if(!block) throw new Error('V1.8 APP_BUILD block was not found');
  const field = name => {
    const match = block[1].match(new RegExp(`${name}:\\s*['\"]([^'\"]*)['\"]`));
    if(!match) throw new Error(`APP_BUILD.${name} is missing`);
    return match[1];
  };
  return {
    version: field('version'),
    release_label: field('release_label'),
    channel: field('channel'),
    source_file: field('source_file'),
    source_script: field('source_script'),
    based_on_branch: field('based_on_branch'),
    based_on_commit: field('based_on_commit'),
    build_date: field('build_date'),
    published_entry: field('published_entry')
  };
}

function trackedWorktreeClean(){
  return git(['status', '--porcelain', '--untracked-files=no'], '__git_status_failed__') === '';
}

function buildReviewPack(options={}){
  const coverage = readJson('docs/V1.8.0_IMPLEMENTATION_COVERAGE.json');
  const promotion = readJson('docs/V1.8.0_PROMOTION_EVIDENCE.json');
  const coverageErrors = validateCoverageManifest(coverage);
  const promotionErrors = validatePromotionManifestShape(promotion);
  if(coverageErrors.length) throw new Error(`Implementation coverage is invalid: ${coverageErrors.join('; ')}`);
  if(promotionErrors.length) throw new Error(`Promotion evidence structure is invalid: ${promotionErrors.join('; ')}`);

  const indexHash = sha256('index.html');
  const stableHash = sha256('choice_train_V1.7.0.html');
  const workingTreeClean = options.workingTreeClean == null ? trackedWorktreeClean() : !!options.workingTreeClean;
  const candidateCommit = options.candidateCommit || git(['rev-parse', 'HEAD']);
  const branch = options.branch || git(['rev-parse', '--abbrev-ref', 'HEAD']);
  const generatedAtIso = options.generatedAtIso || new Date().toISOString();
  const runtimeBuild = runtimeBuildMetadata();
  if(runtimeBuild.version !== CANDIDATE_VERSION) throw new Error(`Runtime version must be ${CANDIDATE_VERSION}`);

  const gateRows = Object.entries(promotion.gates).map(([id, gate]) => ({
    id,
    status: gate.status
  }));
  const gateCounts = gateRows.reduce((counts, gate) => {
    counts[gate.status] = (counts[gate.status] || 0) + 1;
    return counts;
  }, {});

  return {
    report_version: REPORT_VERSION,
    generated_at_iso: generatedAtIso,
    purpose: 'Pupil-data-free engineering hand-off for external V1.8 review. This pack contains no review evidence and makes no promotion decision.',
    contains_pupil_data: false,
    external_evidence_included: false,
    source_state: {
      candidate_version: CANDIDATE_VERSION,
      candidate_commit: candidateCommit,
      branch,
      tracked_worktree_clean: workingTreeClean,
      pack_state: workingTreeClean ? 'clean-engineering-snapshot' : 'dirty-draft'
    },
    runtime_build: runtimeBuild,
    stable_release: {
      version: '1.7.0',
      index_sha256: indexHash,
      versioned_sha256: stableHash,
      byte_identical: fs.readFileSync(resolveRepositoryFile('index.html')).equals(fs.readFileSync(resolveRepositoryFile('choice_train_V1.7.0.html'))),
      protected_hash_matches: indexHash === PROTECTED_STABLE_SHA256 && stableHash === PROTECTED_STABLE_SHA256
    },
    internal_coverage: {
      manifest_version: coverage.manifest_version,
      requirement_count: coverage.requirements.length,
      requirement_ids: coverage.requirements.map(requirement => requirement.id),
      all_evidence_anchors_valid: true
    },
    promotion_record: {
      manifest_version: promotion.manifest_version,
      candidate_commit_recorded: promotion.candidate_commit !== null,
      promotion_authorised: promotion.promotion_authorised,
      gate_counts: gateCounts,
      gates: gateRows
    },
    required_engineering_commands: REQUIRED_COMMANDS.slice(),
    external_review_protocol: 'docs/V1.8.0_EXTERNAL_VALIDATION_PROTOCOL.md',
    privacy_boundary: {
      copied_fields: ['build and Git provenance', 'stable hashes', 'coverage requirement IDs', 'promotion gate status codes', 'required command names'],
      excluded_fields: ['pupil or learner records', 'session data', 'photographs', 'context notes', 'responses', 'touch coordinates', 'reviewer identities', 'evidence references', 'consent or authority records', 'EEG recordings']
    },
    interpretation_boundary: 'This pack supports an engineering hand-off only. It does not freeze a candidate, prove effectiveness or neural change, validate accessibility or hardware timing, supply external evidence, or authorise promotion.'
  };
}

function renderMarkdown(pack){
  const gates = pack.promotion_record.gates
    .map(gate => `| ${gate.id} | ${gate.status} |`)
    .join('\n');
  const commands = pack.required_engineering_commands.map(command => `- \`${command}\``).join('\n');
  return [
    '# ChoiceTrain V1.8 Review Pack',
    '',
    `Generated: ${pack.generated_at_iso}`,
    '',
    `Candidate commit: \`${pack.source_state.candidate_commit}\``,
    '',
    `Branch: \`${pack.source_state.branch}\``,
    '',
    `Source state: **${pack.source_state.pack_state}**`,
    '',
    '## Engineering Snapshot',
    '',
    `- Runtime: ${pack.runtime_build.release_label} (${pack.runtime_build.channel})`,
    `- Runtime source commit: \`${pack.runtime_build.based_on_commit}\``,
    `- Stable V1.7 entry protected: ${pack.stable_release.protected_hash_matches ? 'yes' : 'no'}`,
    `- Internal requirements traced: ${pack.internal_coverage.requirement_count}`,
    `- Promotion authorised: ${pack.promotion_record.promotion_authorised ? 'yes' : 'no'}`,
    '',
    '## Required Engineering Commands',
    '',
    commands,
    '',
    '## External Gate Status',
    '',
    '| Gate | Status |',
    '|---|---|',
    gates,
    '',
    'Run the pupil-data-free protocol in `docs/V1.8.0_EXTERNAL_VALIDATION_PROTOCOL.md`. Keep protected evidence outside the repository.',
    '',
    '## Boundary',
    '',
    pack.interpretation_boundary,
    ''
  ].join('\n');
}

function writeReviewPack(pack, outputDir){
  const targetDir = resolveOutputDir(outputDir);
  fs.mkdirSync(targetDir, { recursive: true });
  const baseName = 'ChoiceTrain_V1.8.0-alpha_ReviewPack';
  const jsonPath = path.join(targetDir, `${baseName}.json`);
  const markdownPath = path.join(targetDir, `${baseName}.md`);
  fs.writeFileSync(jsonPath, `${JSON.stringify(pack, null, 2)}\n`, 'utf8');
  fs.writeFileSync(markdownPath, renderMarkdown(pack), 'utf8');
  return { jsonPath, markdownPath };
}

function main(argv=process.argv.slice(2)){
  const options = parseArgs(argv);
  if(options.help){
    process.stdout.write(`${usage()}\n`);
    return 0;
  }
  const pack = buildReviewPack();
  if(!pack.source_state.tracked_worktree_clean && !options.allowDirty){
    throw new Error('Tracked worktree is dirty. Commit reviewed changes first or use --allow-dirty for a clearly labelled draft.');
  }
  if(options.dryRun){
    process.stdout.write(`Review pack valid for ${pack.source_state.candidate_commit} (${pack.source_state.pack_state}); no files written.\n`);
    return 0;
  }
  const files = writeReviewPack(pack, options.outputDir);
  process.stdout.write(`Wrote ${path.relative(ROOT, files.jsonPath)}\n`);
  process.stdout.write(`Wrote ${path.relative(ROOT, files.markdownPath)}\n`);
  process.stdout.write('No pupil, session, reviewer, or external evidence data was copied.\n');
  return 0;
}

if(require.main === module){
  try {
    process.exitCode = main();
  } catch(error){
    process.stderr.write(`Review pack failed: ${error.message}\n\n${usage()}\n`);
    process.exitCode = 1;
  }
}

module.exports = {
  CANDIDATE_VERSION,
  DEFAULT_OUTPUT_DIR,
  REPORT_VERSION,
  REQUIRED_COMMANDS,
  buildReviewPack,
  normaliseGitOutput,
  parseArgs,
  renderMarkdown,
  resolveOutputDir,
  usage,
  writeReviewPack
};
