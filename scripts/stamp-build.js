#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const BUILD_PATTERN = /^[\t ]*const APP_BUILD = (?:Object\.freeze\()?\{[\s\S]*?^[\t ]*\}(?:\))?;/gm;
const REPO_ROOT = path.resolve(__dirname, '..');

function usage(){
  return [
    'Usage: node scripts/stamp-build.js --version <version> --file <runtime.js> [options]',
    '',
    'Required:',
    '  --version <value>          Build version, for example 1.8.0-alpha',
    '  --file <path>              Runtime containing exactly one APP_BUILD block; repeatable',
    '',
    'Options:',
    '  --release-label <value>    Display label (default: V<version>)',
    '  --channel <value>          Release channel (default: experimental)',
    '  --date <YYYY-MM-DD>        UTC build date (default: current UTC date)',
    '  --commit <value>           Source commit (default: git short HEAD)',
    '  --branch <value>           Source branch (default: current git branch)',
    '  --source-file <value>      Paired HTML source shown in build information',
    '  --source-script <value>    Runtime source shown in build information',
    '  --published-entry <value>  Publication status or entry point',
    '  --app <value>              Product name (default: ChoiceTrain for ShowMe)',
    '  --live-url <value>         Public URL',
    '  --repo-url <value>         Repository URL',
    '  --dry-run                  Print the proposed stamp without writing files',
    '  --help                     Show this help'
  ].join('\n');
}

function parseArgs(argv){
  const options = { files: [], dryRun: false };
  const valueOptions = new Map([
    ['--version', 'version'],
    ['--release-label', 'releaseLabel'],
    ['--channel', 'channel'],
    ['--date', 'date'],
    ['--commit', 'commit'],
    ['--branch', 'branch'],
    ['--source-file', 'sourceFile'],
    ['--source-script', 'sourceScript'],
    ['--published-entry', 'publishedEntry'],
    ['--app', 'app'],
    ['--live-url', 'liveUrl'],
    ['--repo-url', 'repoUrl']
  ]);
  for(let index = 0; index < argv.length; index += 1){
    const arg = argv[index];
    if(arg === '--help' || arg === '-h') options.help = true;
    else if(arg === '--dry-run') options.dryRun = true;
    else if(arg === '--file'){
      if(!argv[index + 1]) throw new Error('--file requires a value');
      options.files.push(argv[index + 1]);
      index += 1;
    } else if(valueOptions.has(arg)){
      if(!argv[index + 1]) throw new Error(`${arg} requires a value`);
      options[valueOptions.get(arg)] = argv[index + 1];
      index += 1;
    } else {
      throw new Error(`Unknown option: ${arg}`);
    }
  }
  return options;
}

function gitValue(args, fallback){
  try {
    return execFileSync('git', ['-C', REPO_ROOT, ...args], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim() || fallback;
  } catch {
    return fallback;
  }
}

function assertSafeText(value, label){
  const text = String(value || '').trim();
  if(!text) throw new Error(`${label} must not be empty`);
  if(/[\r\n]/.test(text)) throw new Error(`${label} must be one line`);
  return text;
}

function resolveRepoFile(file){
  const target = path.resolve(REPO_ROOT, file);
  const relative = path.relative(REPO_ROOT, target);
  if(relative.startsWith('..') || path.isAbsolute(relative)){
    throw new Error(`Target must stay inside the repository: ${file}`);
  }
  return target;
}

function metadataFor(options, targetPath){
  const version = assertSafeText(options.version, 'version');
  const channel = assertSafeText(options.channel || 'experimental', 'channel');
  const date = assertSafeText(options.date || new Date().toISOString().slice(0, 10), 'date');
  if(!/^\d{4}-\d{2}-\d{2}$/.test(date)) throw new Error('date must use YYYY-MM-DD');
  const runtimeName = path.basename(targetPath);
  const inferredHtml = runtimeName.toLowerCase().endsWith('.js') ? runtimeName.slice(0, -3) + '.html' : runtimeName;
  return {
    app: assertSafeText(options.app || 'ChoiceTrain for ShowMe', 'app'),
    version,
    release_label: assertSafeText(options.releaseLabel || `V${version}`, 'release label'),
    channel,
    source_file: assertSafeText(options.sourceFile || inferredHtml, 'source file'),
    source_script: assertSafeText(options.sourceScript || runtimeName, 'source script'),
    based_on_branch: assertSafeText(options.branch || gitValue(['rev-parse', '--abbrev-ref', 'HEAD'], 'unknown'), 'branch'),
    based_on_commit: assertSafeText(options.commit || gitValue(['rev-parse', '--short', 'HEAD'], 'unknown'), 'commit'),
    build_date: date,
    published_entry: assertSafeText(options.publishedEntry || (channel === 'stable' ? 'index.html' : 'not published; stable release remains live'), 'published entry'),
    live_url: assertSafeText(options.liveUrl || 'https://dioncroft.github.io/choice_train/', 'live URL'),
    repo_url: assertSafeText(options.repoUrl || 'https://github.com/DionCroft/choice_train', 'repository URL')
  };
}

function formatBuildBlock(metadata, newline='\n', indent='  '){
  const keys = [
    'app', 'version', 'release_label', 'channel', 'source_file', 'source_script',
    'based_on_branch', 'based_on_commit', 'build_date', 'published_entry', 'live_url', 'repo_url'
  ];
  const lines = [`${indent}const APP_BUILD = Object.freeze({`];
  keys.forEach((key, index) => {
    const suffix = index === keys.length - 1 ? '' : ',';
    lines.push(`${indent}  ${key}: ${JSON.stringify(metadata[key])}${suffix}`);
  });
  lines.push(`${indent}});`);
  return lines.join(newline);
}

function stampContent(content, metadata){
  BUILD_PATTERN.lastIndex = 0;
  const matches = Array.from(content.matchAll(BUILD_PATTERN));
  if(matches.length !== 1){
    throw new Error(`Expected exactly one APP_BUILD block, found ${matches.length}`);
  }
  const newline = content.includes('\r\n') ? '\r\n' : '\n';
  const indent = (matches[0][0].match(/^[\t ]*/) || [''])[0];
  BUILD_PATTERN.lastIndex = 0;
  return content.replace(BUILD_PATTERN, formatBuildBlock(metadata, newline, indent));
}

function stampFile(file, options){
  const targetPath = resolveRepoFile(file);
  if(!fs.existsSync(targetPath)) throw new Error(`Target file not found: ${file}`);
  const content = fs.readFileSync(targetPath, 'utf8');
  const metadata = metadataFor(options, targetPath);
  const updated = stampContent(content, metadata);
  if(options.dryRun){
    process.stdout.write(`[dry-run] ${path.relative(REPO_ROOT, targetPath)}\n${formatBuildBlock(metadata)}\n`);
  } else {
    fs.writeFileSync(targetPath, updated, 'utf8');
    process.stdout.write(`Stamped ${path.relative(REPO_ROOT, targetPath)} -> ${metadata.release_label} [${metadata.channel}] @ ${metadata.based_on_commit}\n`);
  }
  return metadata;
}

function main(argv=process.argv.slice(2)){
  const options = parseArgs(argv);
  if(options.help){
    process.stdout.write(`${usage()}\n`);
    return 0;
  }
  if(!options.version) throw new Error('--version is required');
  if(!options.files.length) throw new Error('At least one explicit --file is required');
  options.files.forEach(file => stampFile(file, options));
  return 0;
}

if(require.main === module){
  try {
    process.exitCode = main();
  } catch(error){
    process.stderr.write(`Build stamp failed: ${error.message}\n\n${usage()}\n`);
    process.exitCode = 1;
  }
}

module.exports = { formatBuildBlock, metadataFor, parseArgs, stampContent, usage };
