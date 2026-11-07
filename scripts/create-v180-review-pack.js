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
const REPORT_VERSION = '1.1.0';
const CANDIDATE_VERSION = '1.8.0-alpha';
const WORKSHEET_FILENAME = 'ChoiceTrain_V1.8.0-alpha_ExternalValidationWorksheet.md';
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
    review_materials: {
      external_validation_worksheet: WORKSHEET_FILENAME,
      worksheet_state: 'blank-template',
      contains_review_evidence: false
    },
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

function renderValidationWorksheet(pack){
  const gateRows = pack.promotion_record.gates
    .map(gate => `| ${gate.id} | pending |  |  |  |  |`)
    .join('\n');
  return [
    '# ChoiceTrain V1.8 External Validation Worksheet',
    '',
    `Generated from candidate: \`${pack.source_state.candidate_commit}\``,
    '',
    `Branch: \`${pack.source_state.branch}\``,
    '',
    `Engineering snapshot: **${pack.source_state.pack_state}**`,
    '',
    `Worksheet generated: ${pack.generated_at_iso}`,
    '',
    '> Complete this worksheet only in the approved external evidence location. Do not commit a completed copy. Do not record pupil names, aliases, photographs, session exports, consent records, safeguarding observations, free-text pupil notes, EEG recordings, or other personal data here.',
    '',
    'Use non-identifying evidence references and reviewer roles. A device or staff-review gate remains pending until the named review has actually been completed against the exact candidate above.',
    '',
    '## Candidate Freeze',
    '',
    '- [ ] The candidate SHA above matches the deployed review build.',
    '- [ ] The tracked worktree and remote feature branch match that SHA.',
    '- [ ] All required engineering commands passed against that SHA.',
    '- [ ] The successful branch CI URL and conclusion are recorded below.',
    '- [ ] The protected V1.7 stable entry remains unchanged.',
    '',
    '| Engineering evidence | Value |',
    '|---|---|',
    `| Exact candidate SHA | \`${pack.source_state.candidate_commit}\` |`,
    `| Runtime source commit | \`${pack.runtime_build.based_on_commit}\` |`,
    `| Feature branch | \`${pack.source_state.branch}\` |`,
    '| Branch CI URL |  |',
    '| CI conclusion and date |  |',
    '| Local command record reference |  |',
    '| Review-pack copy reference |  |',
    '',
    '## Gate Summary',
    '',
    'Allowed outcomes are `pending`, `passed`, `passed-with-limitations`, or `failed`. A limitation-qualified result needs an explicit accepted limitation.',
    '',
    '| Gate | Outcome | Evidence reference | Reviewer role/group | Review date | Accepted limitations |',
    '|---|---|---|---|---|---|',
    gateRows,
    '',
    '## Staff Usability',
    '',
    'Record aggregate staff-task evidence only. Do not identify individual staff members.',
    '',
    '| Measure | Result | Acceptance check | Evidence reference |',
    '|---|---|---|---|',
    '| Participants by role |  | Teachers/TAs and SEND or accessibility lead represented |  |',
    '| Daily route completion without developer intervention |  | Every participant completes |  |',
    '| First-attempt task completion |  | At least 80% |  |',
    '| Median completion time |  | Reviewed for classroom practicality |  |',
    '| Wrong turns or accidental starts/exits |  | No unresolved blocker or high finding |  |',
    '| Confidence rating summary |  | 1-5 aggregate recorded |  |',
    '| Local storage and export boundary understood |  | Staff can explain it in plain language |  |',
    '| Non-diagnostic and non-autonomous boundary understood |  | No diagnostic or autonomous interpretation |  |',
    '',
    '## Safeguarding, Governance, and Ethics',
    '',
    'Record references and release limitations only. Keep underlying records in the approved school or research system.',
    '',
    '| Review | Evidence reference | Responsible role/group | Date | Outcome | Release limitation |',
    '|---|---|---|---|---|---|',
    '| Learner safeguarding and stopping process |  |  |  | pending |  |',
    '| Information governance, retention, access, export, and DPIA |  |  |  | pending |  |',
    '| Legal and research-ethics decision |  |  |  | pending |  |',
    '| Model-development purpose and authority boundary |  |  |  | pending |  |',
    '',
    '## Physical Device Matrix',
    '',
    'Use real intended hardware. Emulation does not pass a physical-device gate.',
    '',
    '| Gate | Device / OS / browser | Input and access method | Portrait | Landscape | Zoom or text size | Keyboard | Speech | Persistence and export | Outcome | Evidence reference |',
    '|---|---|---|---|---|---|---|---|---|---|---|',
    '| windows_touchscreen |  |  |  |  |  |  |  |  | pending |  |',
    '| ipad_safari |  |  |  |  |  |  |  |  | pending |  |',
    '| android_chrome |  |  |  |  |  |  |  |  | pending |  |',
    '| kindle_silk |  |  |  |  |  |  |  |  | pending |  |',
    '',
    'For every applicable row, verify Teacher/Admin navigation, four-choice and maximum-choice learner tasks, question-to-answer blank timing, rotation during an unanswered question, Help/Break/Stop, deliberate teacher return, speech fallback, local persistence, and synthetic export metadata.',
    '',
    '## Assistive Access',
    '',
    '| Intended method | Hardware/software | Focus and order | Controls and labels | Non-colour cues | Safe return | Outcome | Evidence reference |',
    '|---|---|---|---|---|---|---|---|',
    '| Keyboard |  |  |  |  |  | pending |  |',
    '| Switch or switch-emulated input |  |  |  |  |  | pending |  |',
    '| AAC-supported prompting |  |  |  |  |  | pending |  |',
    '| Browser zoom or enlarged text |  |  |  |  |  | pending |  |',
    '| Screen reader for staff/research controls |  |  |  |  |  | pending |  |',
    '| Other intended access method |  |  |  |  |  | pending |  |',
    '',
    '## EEG Hardware Timing',
    '',
    'Do not attach raw EEG data. Record a non-identifying laboratory evidence reference and aggregate timing results from the approved protocol.',
    '',
    '| Field | Result |',
    '|---|---|',
    '| Acquisition system, sampling rate, and acquisition software version |  |',
    '| Browser/device, display, and audio hardware |  |',
    '| Bridge version and marker transport |  |',
    '| Measurement method and reference sensor |  |',
    '| Warm-up and trial count |  |',
    '| Pre-specified latency and jitter thresholds |  |',
    '| Observed latency distribution |  |',
    '| Observed jitter distribution |  |',
    '| Dropped, duplicated, or out-of-order markers |  |',
    '| Clock alignment and observed drift |  |',
    '| Condition-specific limitations |  |',
    '| Overall outcome and evidence reference | pending |',
    '',
    '## Findings and Retests',
    '',
    '| Finding ID | Severity | Affected gate/route | Non-identifying finding summary | Fix commit | Retest reference | Retest outcome |',
    '|---|---|---|---|---|---|---|',
    '|  |  |  |  |  |  |  |',
    '',
    'Blocker and high findings must be fixed and affected gates retested against the new candidate commit. Do not carry an approval forward silently after code changes.',
    '',
    '## Product-owner Decision',
    '',
    '- [ ] Every required gate has acceptable evidence for the same exact candidate commit.',
    '- [ ] Every `passed-with-limitations` result has an explicit accepted limitation.',
    '- [ ] No blocker or unresolved high-severity finding remains.',
    '- [ ] The product owner has explicitly authorised or declined promotion.',
    '',
    '| Decision field | Value |',
    '|---|---|',
    '| Decision (`authorise` or `decline`) |  |',
    '| Evidence reference |  |',
    '| Product-owner role |  |',
    '| Decision date |  |',
    '| Accepted release limitations |  |',
    '',
    'Only after this external process is complete should the repository promotion record be updated with non-identifying references and the fail-closed promotion guard be run.',
    ''
  ].join('\n');
}

function writeReviewPack(pack, outputDir){
  const targetDir = resolveOutputDir(outputDir);
  fs.mkdirSync(targetDir, { recursive: true });
  const baseName = 'ChoiceTrain_V1.8.0-alpha_ReviewPack';
  const jsonPath = path.join(targetDir, `${baseName}.json`);
  const markdownPath = path.join(targetDir, `${baseName}.md`);
  const worksheetPath = path.join(targetDir, WORKSHEET_FILENAME);
  fs.writeFileSync(jsonPath, `${JSON.stringify(pack, null, 2)}\n`, 'utf8');
  fs.writeFileSync(markdownPath, renderMarkdown(pack), 'utf8');
  fs.writeFileSync(worksheetPath, renderValidationWorksheet(pack), 'utf8');
  return { jsonPath, markdownPath, worksheetPath };
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
  process.stdout.write(`Wrote ${path.relative(ROOT, files.worksheetPath)}\n`);
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
  renderValidationWorksheet,
  resolveOutputDir,
  usage,
  writeReviewPack
};
