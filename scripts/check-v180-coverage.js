'use strict';

const fs = require('node:fs');
const path = require('node:path');

const ROOT = path.resolve(__dirname, '..');
const DEFAULT_MANIFEST = 'docs/V1.8.0_IMPLEMENTATION_COVERAGE.json';
const MANIFEST_VERSION = '1.0.0';
const CANDIDATE_VERSION = '1.8.0-alpha';
const IMPLEMENTED_STATUS = 'implemented-and-verified';
const EXTERNAL_AUTHORITY_STATUS = 'managed-by-promotion-record';
const PROMOTION_GATE_STATUSES = new Set(['pending', 'passed', 'passed-with-limitations', 'failed']);
const REQUIRED_REQUIREMENTS = Object.freeze([
  'stable_v170_release',
  'versioned_skill_trial_quality',
  'deterministic_procedural_lessons',
  'learner_state_retention_support_transfer',
  'teacher_review_and_override',
  'eeg_protocol_sync_active_control_fixed_condition',
  'privacy_safe_ai_export',
  'research_attention_and_performance',
  'research_touch_support_transfer',
  'research_content_fidelity_artifacts_history',
  'local_first_no_pupil_llm',
  'preserve_existing_workflows',
  'automated_regression_accessibility',
  'documentation_evidence_boundaries',
  'fail_closed_promotion',
  'adaptive_browser_layout'
]);
const REQUIRED_EXTERNAL_GATES = Object.freeze([
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
  const options = { file: DEFAULT_MANIFEST, json: false };
  for(let index = 0; index < argv.length; index += 1){
    const arg = argv[index];
    if(arg === '--json') options.json = true;
    else if(arg === '--file'){
      if(!argv[index + 1]) throw new Error('--file requires a value');
      options.file = argv[index + 1];
      index += 1;
    } else if(arg === '--help' || arg === '-h') options.help = true;
    else throw new Error(`Unknown option: ${arg}`);
  }
  return options;
}

function usage(){
  return [
    'Usage: node scripts/check-v180-coverage.js [options]',
    '',
    'Options:',
    `  --file <path>  Coverage manifest (default: ${DEFAULT_MANIFEST})`,
    '  --json         Print the result as JSON',
    '  --help         Show this help'
  ].join('\n');
}

function resolveRepositoryFile(relativePath){
  if(typeof relativePath !== 'string' || !relativePath.trim()) throw new Error('evidence path must be a non-empty string');
  const resolved = path.resolve(ROOT, relativePath);
  const relative = path.relative(ROOT, resolved);
  if(relative.startsWith('..') || path.isAbsolute(relative)) throw new Error(`evidence path leaves the repository: ${relativePath}`);
  return resolved;
}

function readJson(relativePath){
  return JSON.parse(fs.readFileSync(resolveRepositoryFile(relativePath), 'utf8'));
}

function unique(values){
  return Array.from(new Set(values));
}

function validateEvidence(requirementId, kind, entries){
  const errors = [];
  if(!Array.isArray(entries) || entries.length === 0) return [`${requirementId}.${kind} must contain at least one evidence anchor`];
  entries.forEach((entry, index) => {
    const prefix = `${requirementId}.${kind}[${index}]`;
    if(!entry || typeof entry !== 'object' || Array.isArray(entry)){
      errors.push(`${prefix} must be an object`);
      return;
    }
    if(typeof entry.path !== 'string' || !entry.path.trim()) errors.push(`${prefix}.path must be a non-empty string`);
    if(typeof entry.contains !== 'string' || !entry.contains.trim()) errors.push(`${prefix}.contains must be a non-empty string`);
    if(errors.some(error => error.startsWith(prefix))) return;
    try {
      const resolved = resolveRepositoryFile(entry.path);
      if(!fs.existsSync(resolved) || !fs.statSync(resolved).isFile()){
        errors.push(`${prefix} references missing file ${entry.path}`);
        return;
      }
      const source = fs.readFileSync(resolved, 'utf8');
      if(!source.includes(entry.contains)) errors.push(`${prefix} anchor was not found in ${entry.path}: ${entry.contains}`);
    } catch(error){
      errors.push(`${prefix}: ${error.message}`);
    }
  });
  return errors;
}

function validateManifest(manifest){
  const errors = [];
  if(!manifest || typeof manifest !== 'object' || Array.isArray(manifest)) return ['manifest must be an object'];
  if(manifest.manifest_version !== MANIFEST_VERSION) errors.push(`manifest_version must be ${MANIFEST_VERSION}`);
  if(manifest.candidate_version !== CANDIDATE_VERSION) errors.push(`candidate_version must be ${CANDIDATE_VERSION}`);
  if(manifest.contains_pupil_data !== false) errors.push('contains_pupil_data must be false');
  ['candidate_commit', 'candidate_frozen', 'promotion_authorised'].forEach(field => {
    if(Object.prototype.hasOwnProperty.call(manifest, field)) errors.push(`${field} is controlled only by the promotion evidence record and must not appear here`);
  });
  if(manifest.external_evidence_record !== 'docs/V1.8.0_PROMOTION_EVIDENCE.json'){
    errors.push('external_evidence_record must reference docs/V1.8.0_PROMOTION_EVIDENCE.json');
  }

  if(!Array.isArray(manifest.requirements)){
    errors.push('requirements must be an array');
  } else {
    const ids = manifest.requirements.map(item => item && item.id).filter(Boolean);
    if(new Set(ids).size !== ids.length) errors.push('requirement IDs must be unique');
    REQUIRED_REQUIREMENTS.forEach(id => {
      if(!ids.includes(id)) errors.push(`required implementation objective is missing: ${id}`);
    });
    ids.filter(id => !REQUIRED_REQUIREMENTS.includes(id)).forEach(id => errors.push(`unknown implementation objective: ${id}`));
    manifest.requirements.forEach((requirement, index) => {
      const id = requirement && requirement.id ? requirement.id : `requirements[${index}]`;
      if(!requirement || typeof requirement !== 'object' || Array.isArray(requirement)){
        errors.push(`${id} must be an object`);
        return;
      }
      if(requirement.status !== IMPLEMENTED_STATUS) errors.push(`${id}.status must be ${IMPLEMENTED_STATUS}`);
      if(typeof requirement.summary !== 'string' || !requirement.summary.trim()) errors.push(`${id}.summary must be a non-empty string`);
      if(!Array.isArray(requirement.limitations) || requirement.limitations.length === 0
        || requirement.limitations.some(item => typeof item !== 'string' || !item.trim())){
        errors.push(`${id}.limitations must contain at least one non-empty boundary`);
      }
      errors.push(...validateEvidence(id, 'implementation_evidence', requirement.implementation_evidence));
      errors.push(...validateEvidence(id, 'automated_evidence', requirement.automated_evidence));
    });
  }

  if(!Array.isArray(manifest.external_gates)){
    errors.push('external_gates must be an array');
  } else {
    const ids = manifest.external_gates.map(item => item && item.id).filter(Boolean);
    if(new Set(ids).size !== ids.length) errors.push('external gate IDs must be unique');
    REQUIRED_EXTERNAL_GATES.forEach(id => {
      if(!ids.includes(id)) errors.push(`required external gate is missing: ${id}`);
    });
    ids.filter(id => !REQUIRED_EXTERNAL_GATES.includes(id)).forEach(id => errors.push(`unknown external gate: ${id}`));
    manifest.external_gates.forEach((gate, index) => {
      const id = gate && gate.id ? gate.id : `external_gates[${index}]`;
      if(!gate || typeof gate !== 'object' || Array.isArray(gate)){
        errors.push(`${id} must be an object`);
        return;
      }
      if(gate.status !== EXTERNAL_AUTHORITY_STATUS) errors.push(`${id}.status must be ${EXTERNAL_AUTHORITY_STATUS}`);
    });
  }

  try {
    const promotion = readJson(manifest.external_evidence_record || 'docs/V1.8.0_PROMOTION_EVIDENCE.json');
    if(typeof promotion.promotion_authorised !== 'boolean') errors.push('promotion evidence promotion_authorised must be Boolean');
    if(promotion.candidate_commit !== null && !/^[0-9a-f]{40}$/i.test(String(promotion.candidate_commit))){
      errors.push('promotion evidence candidate_commit must be null or a full 40-character Git SHA');
    }
    REQUIRED_EXTERNAL_GATES.forEach(id => {
      if(!promotion.gates || !promotion.gates[id]) errors.push(`promotion evidence is missing gate ${id}`);
      else if(!PROMOTION_GATE_STATUSES.has(promotion.gates[id].status)) errors.push(`promotion evidence gate ${id} has an invalid status`);
    });
  } catch(error){
    errors.push(`external promotion evidence could not be read: ${error.message}`);
  }

  return unique(errors);
}

function readManifest(file){
  return readJson(file);
}

function printResult(result, options){
  if(options.json){
    process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
    return;
  }
  if(result.passed){
    process.stdout.write(`V1.8 implementation coverage passed: ${result.requirement_count} internal requirements traced; ${result.external_gate_count} external gates delegated to the promotion record.\n`);
    process.stdout.write('This validates repository evidence only and does not authorise promotion.\n');
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
  const errors = validateManifest(manifest);
  const result = {
    passed: errors.length === 0,
    requirement_count: Array.isArray(manifest.requirements) ? manifest.requirements.length : 0,
    external_gate_count: Array.isArray(manifest.external_gates) ? manifest.external_gates.length : 0,
    errors
  };
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
  CANDIDATE_VERSION,
  EXTERNAL_AUTHORITY_STATUS,
  IMPLEMENTED_STATUS,
  MANIFEST_VERSION,
  REQUIRED_EXTERNAL_GATES,
  REQUIRED_REQUIREMENTS,
  parseArgs,
  validateManifest
};
