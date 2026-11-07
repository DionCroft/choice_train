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

test('Research summary schema matches its runtime export version and category sections', () => {
  const contract = schema('choice-train-research-summary-v1.6.schema.json');
  assert.equal(contract.properties.export_schema_version.const, runtimeConstant('RESEARCH_WORKSPACE_EXPORT_VERSION'));
  ['category_matching', 'category_group_completion', 'category_exclusion', 'attribute_selection', 'category_lesson_coverage']
    .forEach(field => assert.ok(contract.required.includes(field), `${field} must be required`));
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
