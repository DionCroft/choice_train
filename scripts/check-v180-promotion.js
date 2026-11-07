'use strict';

const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');

const ROOT = path.resolve(__dirname, '..');
const DEFAULT_MANIFEST = 'docs/V1.8.0_PROMOTION_EVIDENCE.json';
const MANIFEST_VERSION = '1.0.0';
const CANDIDATE_VERSION = '1.8.0-alpha';
const PROMOTION_TARGET = '1.8.0';
const VALID_STATUSES = new Set(['pending', 'passed', 'passed-with-limitations', 'failed']);
const ACCEPTED_STATUSES = new Set(['passed', 'passed-with-limitations']);
const REQUIRED_GATES = Object.freeze([
  'automated_engineering',
  'branch_ci',
  'product_owner_approval',
  'staff_usability',
  'learner_safeguarding',
  'information_governance',
  'legal_ethics',
  'windows_touchscreen',
  'ipad_safari',
  'android_chrome',
  'kindle_silk',
  'assistive_access',
  'eeg_hardware_timing'
]);

function parseArgs(argv){
  const options = { file: DEFAULT_MANIFEST, templateCheck: false, structureCheck: false, json: false, commit: '' };
  for(let index = 0; index < argv.length; index += 1){
    const arg = argv[index];
    if(arg === '--template-check') options.templateCheck = true;
    else if(arg === '--structure-check') options.structureCheck = true;
    else if(arg === '--json') options.json = true;
    else if(arg === '--file' || arg === '--commit'){
      if(!argv[index + 1]) throw new Error(`${arg} requires a value`);
      options[arg === '--file' ? 'file' : 'commit'] = argv[index + 1];
      index += 1;
    } else if(arg === '--help' || arg === '-h') options.help = true;
    else throw new Error(`Unknown option: ${arg}`);
  }
  return options;
}

function usage(){
  return [
    'Usage: node scripts/check-v180-promotion.js [options]',
    '',
    'Options:',
    `  --file <path>       Evidence manifest (default: ${DEFAULT_MANIFEST})`,
    '  --commit <sha>      Expected full candidate commit (default: current HEAD)',
    '  --structure-check   Validate record structure without making a promotion decision',
    '  --template-check    Validate the pending record structure without approving promotion',
    '  --json              Print the result as JSON',
    '  --help              Show this help'
  ].join('\n');
}

function readManifest(file){
  const resolved = path.resolve(ROOT, file);
  const relative = path.relative(ROOT, resolved);
  if(relative.startsWith('..') || path.isAbsolute(relative)) throw new Error('Manifest must stay inside the repository');
  return JSON.parse(fs.readFileSync(resolved, 'utf8'));
}

function currentCommit(){
  return execFileSync('git', ['-C', ROOT, 'rev-parse', 'HEAD'], {
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'ignore']
  }).trim();
}

function validDate(value){
  if(!/^\d{4}-\d{2}-\d{2}$/.test(String(value || ''))) return false;
  const date = new Date(`${value}T00:00:00Z`);
  return Number.isFinite(date.getTime()) && date.toISOString().slice(0, 10) === value;
}

function validateManifestShape(manifest){
  const errors = [];
  if(!manifest || typeof manifest !== 'object' || Array.isArray(manifest)) return ['manifest must be an object'];
  if(manifest.manifest_version !== MANIFEST_VERSION) errors.push(`manifest_version must be ${MANIFEST_VERSION}`);
  if(manifest.candidate_version !== CANDIDATE_VERSION) errors.push(`candidate_version must be ${CANDIDATE_VERSION}`);
  if(manifest.promotion_target !== PROMOTION_TARGET) errors.push(`promotion_target must be ${PROMOTION_TARGET}`);
  if(typeof manifest.promotion_authorised !== 'boolean') errors.push('promotion_authorised must be a Boolean');
  if(!manifest.privacy || manifest.privacy.declared_no_pupil_data !== true){
    errors.push('privacy.declared_no_pupil_data must be true');
  }
  if(!manifest.privacy || manifest.privacy.external_evidence_stored_outside_repository !== true){
    errors.push('privacy.external_evidence_stored_outside_repository must be true');
  }
  if(!manifest.gates || typeof manifest.gates !== 'object' || Array.isArray(manifest.gates)){
    errors.push('gates must be an object');
    return errors;
  }
  REQUIRED_GATES.forEach(key => {
    const gate = manifest.gates[key];
    if(!gate || typeof gate !== 'object' || Array.isArray(gate)){
      errors.push(`${key} gate is required`);
      return;
    }
    if(!VALID_STATUSES.has(gate.status)) errors.push(`${key}.status is invalid`);
    ['evidence_reference', 'reviewed_by', 'limitations'].forEach(field => {
      if(typeof gate[field] !== 'string') errors.push(`${key}.${field} must be a string`);
    });
    if(gate.reviewed_date !== null && !validDate(gate.reviewed_date)){
      errors.push(`${key}.reviewed_date must be null or YYYY-MM-DD`);
    }
  });
  Object.keys(manifest.gates).filter(key => !REQUIRED_GATES.includes(key)).forEach(key => {
    errors.push(`unknown gate: ${key}`);
  });
  return errors;
}

function evaluateManifest(manifest, expectedCommit){
  const errors = validateManifestShape(manifest);
  const rows = [];
  if(!manifest || typeof manifest !== 'object' || Array.isArray(manifest)){
    return { passed: false, errors, rows };
  }
  const commit = String(expectedCommit || '').trim();
  if(!/^[0-9a-f]{40}$/i.test(String(manifest.candidate_commit || ''))){
    errors.push('candidate_commit must be the frozen full 40-character Git SHA');
  } else if(commit && manifest.candidate_commit.toLowerCase() !== commit.toLowerCase()){
    errors.push(`candidate_commit does not match expected commit ${commit}`);
  }
  if(!validDate(manifest.last_reviewed_date)) errors.push('last_reviewed_date must use YYYY-MM-DD');
  if(manifest.promotion_authorised !== true) errors.push('promotion_authorised must be true');

  REQUIRED_GATES.forEach(key => {
    const gate = manifest.gates && manifest.gates[key];
    if(!gate || typeof gate !== 'object') return;
    const accepted = ACCEPTED_STATUSES.has(gate.status);
    rows.push({ gate: key, status: gate.status, accepted });
    if(!accepted) errors.push(`${key} is ${gate.status || 'missing'}, not passed`);
    if(!String(gate.evidence_reference || '').trim()) errors.push(`${key}.evidence_reference is required`);
    if(!String(gate.reviewed_by || '').trim()) errors.push(`${key}.reviewed_by is required`);
    if(!validDate(gate.reviewed_date)) errors.push(`${key}.reviewed_date must use YYYY-MM-DD`);
    if(gate.status === 'passed-with-limitations' && !String(gate.limitations || '').trim()){
      errors.push(`${key}.limitations is required for passed-with-limitations`);
    }
  });
  return { passed: errors.length === 0, errors: Array.from(new Set(errors)), rows };
}

function validatePendingTemplate(manifest){
  const errors = validateManifestShape(manifest);
  if(!manifest || typeof manifest !== 'object' || Array.isArray(manifest)){
    return { passed: false, errors: Array.from(new Set(errors)) };
  }
  if(manifest.candidate_commit !== null) errors.push('pending evidence record candidate_commit must be null');
  if(manifest.last_reviewed_date !== null) errors.push('pending evidence record last_reviewed_date must be null');
  if(manifest.promotion_authorised !== false) errors.push('pending evidence record must not authorise promotion');
  REQUIRED_GATES.forEach(key => {
    const gate = manifest.gates && manifest.gates[key];
    if(gate && gate.status !== 'pending') errors.push(`${key} must remain pending in the initial record`);
  });
  return { passed: errors.length === 0, errors: Array.from(new Set(errors)) };
}

function printResult(result, options){
  if(options.json){
    process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
    return;
  }
  if(result.rows){
    result.rows.forEach(row => process.stdout.write(`${row.accepted ? 'PASS' : 'WAIT'} ${row.gate}: ${row.status}\n`));
  }
  if(result.passed){
    process.stdout.write(options.templateCheck
      ? 'V1.8 pending promotion-evidence record is structurally valid and does not authorise promotion.\n'
      : options.structureCheck
        ? 'V1.8 promotion-evidence record structure is valid; no promotion decision was made.\n'
        : 'V1.8 promotion evidence gate passed for the frozen commit. Final release procedure and explicit confirmation are still required.\n');
  } else {
    result.errors.forEach(error => process.stderr.write(`FAIL ${error}\n`));
  }
}

function main(argv=process.argv.slice(2)){
  const options = parseArgs(argv);
  if(options.help){
    process.stdout.write(`${usage()}\n`);
    return 0;
  }
  const manifest = readManifest(options.file);
  let result;
  if(options.templateCheck){
    result = validatePendingTemplate(manifest);
  } else if(options.structureCheck){
    const errors = validateManifestShape(manifest);
    result = { passed: errors.length === 0, errors };
  } else {
    result = evaluateManifest(manifest, options.commit || currentCommit());
  }
  printResult(result, options);
  return result.passed ? 0 : 1;
}

if(require.main === module){
  try {
    process.exitCode = main();
  } catch(error){
    process.stderr.write(`FAIL ${error.message}\n`);
    process.exitCode = 1;
  }
}

module.exports = {
  ACCEPTED_STATUSES,
  REQUIRED_GATES,
  evaluateManifest,
  parseArgs,
  validateManifestShape,
  validatePendingTemplate,
  validDate
};
