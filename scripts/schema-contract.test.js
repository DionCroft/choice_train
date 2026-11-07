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
  assert.deepEqual(new Set(contract.properties.recommendation_review_decision.oneOf[0].enum), new Set(['approved', 'adjusted']));
  assert.equal(contract.properties.recommendation_application_status.oneOf[0].const, 'applied-as-reviewed');
});

test('Research summary schema matches its runtime export version and category/AI composition sections', () => {
  const contract = schema('choice-train-research-summary-v2.1.schema.json');
  const previousContract = schema('choice-train-research-summary-v2.0.schema.json');
  assert.equal(contract.properties.export_schema_version.const, runtimeConstant('RESEARCH_WORKSPACE_EXPORT_VERSION'));
  ['retention_planning', 'category_skill_states', 'category_matching', 'category_group_completion', 'category_exclusion', 'attribute_selection', 'category_lesson_coverage', 'data_quality', 'model_dataset_composition', 'recommendation_application_summary', 'teacher_decisions']
    .forEach(field => assert.ok(contract.required.includes(field), `${field} must be required`));
  assert.equal(contract.properties.data_quality.$ref, 'choice-train-data-quality-v1.schema.json');
  const profile = previousContract.properties.model_dataset_composition;
  assert.equal(profile.properties.profile_version.const, runtimeConstant('MODEL_DATASET_PROFILE_VERSION'));
  assert.equal(profile.properties.split_policy.properties.participant_separated_split_required.const, true);
  assert.equal(profile.properties.split_policy.properties.automatic_split_performed.const, false);
  assert.equal(profile.properties.split_policy.properties.random_trial_split_allowed.const, false);
  const retention = previousContract.properties.retention_planning;
  assert.equal(retention.properties.version.const, runtimeConstant('RETENTION_PLANNING_VERSION'));
  assert.equal(retention.properties.configured_gap_days.minimum, 1);
  assert.equal(retention.properties.configured_gap_days.maximum, 365);
  assert.equal(retention.properties.minimum_scored_opportunities_per_observation.const, 3);
  assert.deepEqual(new Set(retention.properties.rows.items.properties.retention_due_status.enum), new Set(['due', 'not-yet-due']));
  const datePattern = new RegExp(retention.properties.rows.items.properties.next_retention_check_date.pattern);
  assert.equal(datePattern.test('2026-11-07'), true);
  assert.equal(datePattern.test('07-11-2026'), false);
  const categoryStates = previousContract.properties.category_skill_states;
  assert.equal(categoryStates.properties.version.const, runtimeConstant('CATEGORY_SKILL_STATE_VERSION'));
  assert.deepEqual(new Set(categoryStates.properties.scope_mode.enum), new Set(['single-learner', 'pooled']));
  assert.deepEqual(new Set(categoryStates.properties.rows.items.properties.practice_status.enum), new Set([
    'not-scored',
    'pooled-coverage',
    'insufficient-sample',
    'needs-support',
    'developing',
    'consistent-current-sample'
  ]));
  assert.equal(categoryStates.properties.rows.items.properties.days_since_last_observation.minimum, 0);
  const categoryDatePattern = new RegExp(categoryStates.properties.rows.items.properties.last_observed_date.pattern);
  assert.equal(categoryDatePattern.test('2026-11-07'), true);
  assert.equal(categoryDatePattern.test('07-11-2026'), false);
  const observation = contract.$defs.privacySafeHumanObservationContext;
  assert.equal(observation.properties.version.const, runtimeConstant('HUMAN_OBSERVATION_CONTEXT_VERSION'));
  assert.equal(observation.properties.automatic_decision_influence.const, false);
  assert.equal(observation.additionalProperties, false);
  assert.equal(contract.properties.teacher_decisions.items.properties.human_observation_context.$ref, '#/$defs/privacySafeHumanObservationContext');
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
  assert.ok(contract.properties.sessions.items.required.includes('eeg_marker_diagnostics'));
  assert.ok(contract.properties.sessions.items.required.includes('retention_planning'));
  assert.ok(contract.properties.sessions.items.required.includes('human_observation_context'));
  assert.equal(contract.properties.sessions.items.properties.eeg_marker_diagnostics.$ref, '#/$defs/privacySafeMarkerDiagnostics');
  assert.equal(contract.properties.sessions.items.properties.retention_planning.oneOf[0].$ref, '#/$defs/privacySafeRetentionPlanning');
  assert.equal(contract.$defs.privacySafeRetentionPlanning.additionalProperties, false);
  assert.equal(contract.$defs.privacySafeRetentionPlanning.properties.configured_gap_days.maximum, 365);
  const diagnostics = contract.$defs.privacySafeMarkerDiagnostics;
  assert.equal(diagnostics.additionalProperties, false);
  assert.equal(diagnostics.properties.hardware_synchronization_verified.const, false);
  ['operator_notes', 'exact_wall_time_ms', 'source_session_id']
    .forEach(field => assert.equal(Object.prototype.hasOwnProperty.call(diagnostics.properties, field), false));
  assert.equal(contract.properties.teacher_decisions.items.$ref, '#/$defs/privacySafeTeacherDecision');
  const decision = contract.$defs.privacySafeTeacherDecision;
  assert.equal(decision.additionalProperties, false);
  assert.deepEqual(new Set(decision.properties.decision.oneOf[0].enum), new Set([
    'approved',
    'adjusted',
    'declined',
    'deferred'
  ]));
  assert.equal(decision.properties.final_plan.oneOf[1].type, 'null');
  assert.equal(decision.properties.applied_session_count.minimum, 0);
  assert.equal(contract.$defs.privacySafeFinalPlan.additionalProperties, false);
  assert.equal(contract.$defs.privacySafeCategoryFocus.additionalProperties, false);
  assert.deepEqual(new Set(contract.$defs.privacySafeCategoryFocus.properties.category_origin.enum), new Set(['built-in', 'teacher-created-or-legacy']));
  assert.equal(contract.$defs.privacySafeRecommendationProposal.properties.recommended_category_focus.oneOf[0].$ref, '#/$defs/privacySafeCategoryFocus');
  assert.equal(contract.$defs.privacySafeRecommendationProposal.properties.human_observation_context.$ref, '#/$defs/privacySafeHumanObservationContext');
  assert.equal(contract.$defs.privacySafeFinalPlan.properties.category_focus.oneOf[0].$ref, '#/$defs/privacySafeCategoryFocus');
  const application = contract.$defs.privacySafeRecommendationApplication;
  assert.equal(application.additionalProperties, false);
  assert.equal(application.properties.applied.const, true);
  assert.equal(application.properties.plan_matches_session_settings.const, true);
  assert.equal(application.properties.category_focus.oneOf[0].$ref, '#/$defs/privacySafeCategoryFocus');
  assert.deepEqual(new Set(application.properties.review_decision.oneOf[0].enum), new Set(['approved', 'adjusted']));
  assert.equal(contract.properties.sessions.items.properties.recommendation_application.oneOf[0].$ref, '#/$defs/privacySafeRecommendationApplication');
  assert.equal(contract.properties.sessions.items.properties.human_observation_context.$ref, '#/$defs/privacySafeHumanObservationContext');
  const observation = contract.$defs.privacySafeHumanObservationContext;
  assert.equal(observation.properties.version.const, runtimeConstant('HUMAN_OBSERVATION_CONTEXT_VERSION'));
  assert.equal(observation.properties.automatic_decision_influence.const, false);
  assert.equal(observation.additionalProperties, false);
  ['source_session_id', 'observed_date', 'classroom_transfer_notes', 'context_notes']
    .forEach(field => assert.equal(Object.prototype.hasOwnProperty.call(observation.properties, field), false));
});
