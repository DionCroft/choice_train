const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const assert = require('node:assert/strict');

const root = path.resolve(__dirname, '..');
const runtime = fs.readFileSync(path.join(root, 'choice_train_V1.8.0-alpha.js'), 'utf8');

function schema(name){
  return JSON.parse(fs.readFileSync(path.join(root, 'schemas', name), 'utf8'));
}

function runtimeConstant(name){
  const match = runtime.match(new RegExp(`const ${name} = (?:'([^']+)'|(\\d+));`));
  assert.ok(match, `Runtime constant ${name} must exist`);
  return match[1] || Number(match[2]);
}

function objectKeys(blockName){
  const match = runtime.match(new RegExp(`const ${blockName} = (?:Object\\.freeze\\()?\\{([\\s\\S]*?)\\n  \\}\\)?;`));
  assert.ok(match, `Runtime object ${blockName} must exist`);
  return Array.from(match[1].matchAll(/^\s+'([^']+)':/gm), item => item[1]);
}

test('trial schema versions and enums match the V1.8 runtime', () => {
  const contract = schema('choice-train-trial-v8.schema.json');
  assert.equal(contract.$schema, 'https://json-schema.org/draft/2020-12/schema');
  assert.equal(contract.properties.schema_version.const, runtimeConstant('DATA_SCHEMA_VERSION'));
  assert.equal(contract.properties.skill_graph_version.const, runtimeConstant('SKILL_GRAPH_VERSION'));
  assert.equal(contract.properties.generator_version.const, runtimeConstant('GENERATOR_VERSION'));
  assert.deepEqual(new Set(contract.properties.task_kind.enum), new Set(objectKeys('TASK_META')));
  assert.deepEqual(new Set(contract.properties.skill_ids.items.enum), new Set(objectKeys('SKILL_GRAPH')));
});

test('Research summary schema matches its runtime export version and category/AI composition sections', () => {
  const contract = schema('choice-train-research-summary-v1.7.schema.json');
  assert.equal(contract.properties.export_schema_version.const, runtimeConstant('RESEARCH_WORKSPACE_EXPORT_VERSION'));
  ['category_matching', 'category_group_completion', 'category_exclusion', 'attribute_selection', 'category_lesson_coverage', 'data_quality', 'model_dataset_composition']
    .forEach(field => assert.ok(contract.required.includes(field), `${field} must be required`));
  assert.equal(contract.properties.data_quality.$ref, 'choice-train-data-quality-v1.schema.json');
  const profile = contract.properties.model_dataset_composition;
  assert.equal(profile.properties.profile_version.const, runtimeConstant('MODEL_DATASET_PROFILE_VERSION'));
  assert.equal(profile.properties.split_policy.properties.participant_separated_split_required.const, true);
  assert.equal(profile.properties.split_policy.properties.automatic_split_performed.const, false);
  assert.equal(profile.properties.split_policy.properties.random_trial_split_allowed.const, false);
});

test('data-quality schema locks recording-completeness fields and flags', () => {
  const contract = schema('choice-train-data-quality-v1.schema.json');
  assert.equal(contract.properties.schema_version.const, runtimeConstant('DATA_QUALITY_SCHEMA_VERSION'));
  [
    'source_trial_count',
    'final_trial_count',
    'repeated_attempt_count',
    'response_time_expected_count',
    'response_time_observed_when_expected_count',
    'touch_distance_expected_count',
    'touch_distance_observed_when_expected_count',
    'support_status_observed_count',
    'generator_provenance_observed_count',
    'recording_flags',
    'interpretation_boundary'
  ].forEach(field => assert.ok(contract.required.includes(field), `${field} must be required`));
  assert.deepEqual(new Set(contract.properties.recording_flags.items.enum), new Set([
    'NO_FINAL_TRIALS',
    'MISSING_SKILL_ASSIGNMENT',
    'MISSING_EXPECTED_RESPONSE_TIMING',
    'MISSING_ELIGIBLE_TOUCH_DISTANCE',
    'UNKNOWN_SUPPORT_STATUS',
    'MISSING_PROMPT_LEVEL',
    'MISSING_GENERATOR_PROVENANCE',
    'MISSING_OPTION_METADATA',
    'MISSING_OUTCOME_FIELDS',
    'MISSING_SESSION_IDENTITY'
  ]));
});

test('model-development schema locks privacy and human-oversight invariants', () => {
  const contract = schema('choice-train-model-dataset-v1.schema.json');
  assert.equal(contract.properties.export_schema_version.const, runtimeConstant('PRIVACY_EXPORT_VERSION'));
  assert.equal(contract.properties.privacy_status.const, 'pseudonymised-not-anonymous');
  assert.equal(contract.properties.governance.properties.human_review_required.const, true);
  assert.equal(contract.properties.governance.properties.automated_decision_making_enabled.const, false);
  assert.equal(contract.properties.governance.properties.model_training_performed_by_application.const, false);
  Object.values(contract.properties.privacy_manifest.properties)
    .forEach(definition => assert.equal(definition.const, false));
});
