'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const root = path.resolve(__dirname, '..');
const read = relativePath => fs.readFileSync(path.join(root, relativePath), 'utf8');
const inventory = JSON.parse(read('governance/data-inventory-v1.json'));
const runtime = read('choice_train_V1.8.0-alpha.js');

function runtimeConstant(name) {
  const match = runtime.match(new RegExp(`const ${name} = ['"]?([^'";]+)['"]?;`));
  assert.ok(match, `${name} is missing from the runtime`);
  return match[1];
}

test('data inventory locks local-only runtime and contract versions', () => {
  assert.equal(inventory.inventory_version, '1.0.0');
  assert.equal(inventory.application, 'ChoiceTrain for ShowMe');
  assert.equal(inventory.runtime_boundaries.local_first, true);
  assert.equal(inventory.runtime_boundaries.automatic_external_transmission, false);
  assert.equal(inventory.runtime_boundaries.cloud_llm_calls, false);
  assert.equal(inventory.runtime_boundaries.model_training_performed, false);
  assert.equal(inventory.runtime_boundaries.eeg_hardware_transport_implemented, false);
  assert.equal(inventory.runtime_boundaries.pupil_data_allowed_in_repository, false);
  assert.equal(String(inventory.contracts.data_schema), runtimeConstant('DATA_SCHEMA_VERSION'));
  assert.equal(inventory.contracts.governance_declaration, runtimeConstant('GOVERNANCE_SCHEMA_VERSION'));
  assert.equal(inventory.contracts.model_dataset, runtimeConstant('PRIVACY_EXPORT_VERSION'));
  assert.equal(inventory.contracts.research_summary, runtimeConstant('RESEARCH_WORKSPACE_EXPORT_VERSION'));
});

test('every declared browser store remains traceable to the runtime', () => {
  const expectedStores = new Set([
    'settings', 'learner_profiles', 'fixed_conditions', 'session_fallback', 'sessions', 'assets', 'runtime_meta'
  ]);
  assert.deepEqual(new Set(inventory.storage.map(item => item.id)), expectedStores);
  inventory.storage.forEach(item => {
    const segments = item.identifier.split('/');
    segments.forEach(segment => assert.ok(runtime.includes(segment), `${item.id} identifier ${segment} is missing from runtime`));
  });
});

test('data classes and user-initiated export boundaries are explicit', () => {
  const expectedClasses = new Set([
    'pupil_profile', 'personalised_photo', 'context_note', 'behavioural_trial',
    'timing_and_touch', 'teacher_observation', 'browser_event_marker', 'governance_declaration'
  ]);
  assert.deepEqual(new Set(inventory.data_classes.map(item => item.id)), expectedClasses);
  inventory.data_classes.forEach(item => {
    assert.ok(item.classification);
    assert.ok(item.purpose);
    assert.ok(item.minimisation);
  });
  inventory.exports.forEach(item => {
    assert.equal(item.user_initiated, true, `${item.id} must be user initiated`);
    assert.equal(item.automatic_transmission, false, `${item.id} must not transmit automatically`);
    assert.equal(item.image_bytes_included, false, `${item.id} must not include image bytes`);
    assert.ok(item.purpose_gate, `${item.id} needs a purpose gate`);
  });
  const modelExport = inventory.exports.find(item => item.id === 'model_development_json');
  assert.equal(modelExport.direct_identifiers_possible, false);
  assert.equal(modelExport.free_text_possible, false);
  assert.match(modelExport.purpose_gate, /current separately recorded model-development authority/i);
});

test('inventory records bounded local deletion and external-copy limitation', () => {
  assert.equal(inventory.local_deletion.selected_pupil_profile, true);
  assert.equal(inventory.local_deletion.selected_pupil_owned_photos, true);
  assert.equal(inventory.local_deletion.selected_pupil_matching_session_history, true);
  assert.equal(inventory.local_deletion.other_pupils_preserved, true);
  assert.equal(inventory.local_deletion.downloaded_or_external_copies_deleted, false);
  assert.match(runtime, /async function deleteCurrentPupilData\(\)/);
});

test('governance documentation preserves approval, EEG, and no-cloud boundaries', () => {
  const ethics = read('docs/ETHICS_AND_RESEARCH_SCOPE.md');
  const governance = read('docs/DATA_GOVERNANCE_PLAN.md');
  const flow = read('docs/DATA_FLOW_MAP.md');
  assert.match(ethics, /full ethics approval for the currently approved ChoiceTrain research/i);
  assert.match(ethics, /EEG acquisition or EEG-linked analysis[\s\S]*Not currently planned/i);
  assert.match(governance, /ChoiceTrain is local-first/i);
  assert.match(governance, /Pseudonymised data remains personal data/i);
  assert.match(flow, /No arrow from the browser runtime to a remote research service exists/i);
  assert.match(flow, /downloaded files[\s\S]*outside ChoiceTrain's control/i);
});
