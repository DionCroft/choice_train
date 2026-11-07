const fs = require('fs');
const { test, expect } = require('@playwright/test');

const APP_PATH = '/choice_train_V1.8.0-alpha.html';
const TRIAL_SCHEMA = JSON.parse(fs.readFileSync('schemas/choice-train-trial-v8.schema.json', 'utf8'));
const RESEARCH_SCHEMA = JSON.parse(fs.readFileSync('schemas/choice-train-research-summary-v1.7.schema.json', 'utf8'));
const DATA_QUALITY_SCHEMA = JSON.parse(fs.readFileSync('schemas/choice-train-data-quality-v1.schema.json', 'utf8'));
const MODEL_DATASET_SCHEMA = JSON.parse(fs.readFileSync('schemas/choice-train-model-dataset-v1.schema.json', 'utf8'));

function expectCoreSchema(value, schema, path='payload') {
  expect(value, `${path} must be an object`).toBeTruthy();
  expect(typeof value, `${path} must be an object`).toBe('object');
  (schema.required || []).forEach(field => expect(value, `${path}.${field} is required`).toHaveProperty(field));
  Object.entries(schema.properties || {}).forEach(([field, definition]) => {
    if(!Object.prototype.hasOwnProperty.call(value, field)) return;
    const observed = value[field];
    if(Object.prototype.hasOwnProperty.call(definition, 'const')) expect(observed, `${path}.${field}`).toEqual(definition.const);
    if(definition.enum) expect(definition.enum, `${path}.${field} enum`).toContain(observed);
    if(definition.type === 'object') {
      expectCoreSchema(observed, definition, `${path}.${field}`);
    } else if(definition.type === 'array') {
      expect(Array.isArray(observed), `${path}.${field} must be an array`).toBe(true);
    } else if(definition.type === 'integer') {
      expect(Number.isInteger(observed), `${path}.${field} must be an integer`).toBe(true);
    } else if(typeof definition.type === 'string') {
      expect(typeof observed, `${path}.${field} type`).toBe(definition.type);
    }
  });
}

function finalTrialRecords(trials) {
  const records = new Map();
  (trials || []).forEach(trial => {
    const key = `${trial.session_id || 'session'}|${trial.question_index}`;
    const current = records.get(key);
    if(!current || Number(trial.attempt_index || 1) >= Number(current.attempt_index || 1)) records.set(key, trial);
  });
  return Array.from(records.values()).sort((a, b) => Number(a.question_index) - Number(b.question_index));
}

function medianValue(values) {
  const sorted = values.slice().sort((a, b) => a - b);
  const middle = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? sorted[middle] : (sorted[middle - 1] + sorted[middle]) / 2;
}

function populationStandardDeviation(values) {
  if(values.length <= 1) return 0;
  const average = values.reduce((sum, value) => sum + value, 0) / values.length;
  return Math.sqrt(values.reduce((sum, value) => sum + Math.pow(value - average, 2), 0) / values.length);
}

function independentlyDerivedSessionRow(payload) {
  const trials = finalTrialRecords(payload.trials);
  const scored = trials.filter(trial => trial.scored_response !== false);
  const responded = trials.filter(trial => !trial.omission);
  const supportObserved = responded.filter(trial => ['independent', 'prompted', 'assisted'].includes(trial.independence_status));
  const responseTimes = trials.map(trial => trial.response_time_ms).filter(Number.isFinite);
  const touchDistances = trials.map(trial => trial.distance_to_target_px).filter(Number.isFinite);
  return {
    level: trials[0] ? trials[0].level : null,
    trials: trials.length,
    accuracy_pct: scored.length ? Math.round(scored.filter(trial => trial.correct).length / scored.length * 100) : null,
    independent_pct: supportObserved.length
      ? Math.round(supportObserved.filter(trial => trial.independence_status === 'independent').length / supportObserved.length * 100)
      : null,
    median_rt_ms: responseTimes.length ? Math.round(medianValue(responseTimes)) : null,
    rt_observed_count: responseTimes.length,
    rt_variability_ms: responseTimes.length > 1 ? Math.round(populationStandardDeviation(responseTimes)) : null,
    omissions: trials.filter(trial => trial.omission).length,
    commissions: trials.filter(trial => trial.commission).length,
    omission_pct: trials.length ? Math.round(trials.filter(trial => trial.omission).length / trials.length * 100) : null,
    commission_pct: trials.length ? Math.round(trials.filter(trial => trial.commission).length / trials.length * 100) : null,
    touch_observed_count: touchDistances.length,
    mean_touch_distance_px: touchDistances.length
      ? Number((touchDistances.reduce((sum, value) => sum + value, 0) / touchDistances.length).toFixed(1))
      : null
  };
}

function independentlyDerivedSkillRows(payloads) {
  const grouped = new Map();
  payloads.flatMap(payload => finalTrialRecords(payload.trials)).forEach(trial => {
    (trial.skill_ids || []).forEach(skillId => {
      if(!grouped.has(skillId)) grouped.set(skillId, {
        skill_id: skillId,
        opportunities: 0,
        scored_opportunities: 0,
        response_count: 0,
        correct: 0,
        incorrect: 0,
        omissions: 0,
        commissions: 0,
        correct_rejections: 0,
        independent_responses: 0,
        assisted_responses: 0,
        independent_correct: 0,
        assisted_correct: 0
      });
      const row = grouped.get(skillId);
      const scored = skillId !== 'choice.preference';
      const responded = !trial.omission && (trial.response_type != null || trial.selected_id || trial.correct_rejection);
      const assisted = trial.independence_status && trial.independence_status !== 'independent';
      row.opportunities += 1;
      if(scored) {
        row.scored_opportunities += 1;
        if(trial.correct) row.correct += 1;
        else row.incorrect += 1;
        if(trial.correct && assisted) row.assisted_correct += 1;
        if(trial.correct && !assisted) row.independent_correct += 1;
      }
      if(responded) {
        row.response_count += 1;
        if(assisted) row.assisted_responses += 1;
        else row.independent_responses += 1;
      }
      if(trial.omission) row.omissions += 1;
      if(trial.commission) row.commissions += 1;
      if(trial.correct_rejection) row.correct_rejections += 1;
    });
  });
  return Array.from(grouped.values()).sort((a, b) => a.skill_id.localeCompare(b.skill_id));
}

async function gotoAlpha(page) {
  await page.goto(APP_PATH);
  await expect(page.locator('#beginFlow')).toBeVisible();
}

async function setCheckbox(page, id, checked) {
  await page.locator(`#${id}`).evaluate((node, value) => {
    node.checked = value;
    node.dispatchEvent(new Event('input', { bubbles: true }));
    node.dispatchEvent(new Event('change', { bubbles: true }));
  }, checked);
}

async function setValue(page, id, value) {
  await page.locator(`#${id}`).evaluate((node, nextValue) => {
    node.value = String(nextValue);
    node.dispatchEvent(new Event('input', { bubbles: true }));
    node.dispatchEvent(new Event('change', { bubbles: true }));
  }, value);
}

async function downloadJsonAfter(page, action) {
  const downloadPromise = page.waitForEvent('download');
  await action();
  const download = await downloadPromise;
  return JSON.parse(fs.readFileSync(await download.path(), 'utf8'));
}

async function completeSessionAndExport(page, questionCount) {
  await page.locator('#quickStartSessionBtn').click();
  for(let index = 0; index < questionCount; index += 1) {
    const target = page.locator('#choiceGrid [data-role="correct-target"]').first();
    await expect(target).toBeVisible();
    await target.click();
    if(index < questionCount - 1) {
      await expect(page.locator('#qIndex')).toHaveText(`${index + 2} / ${questionCount}`);
    }
  }
  await expect(page.locator('#screenSummary.active')).toBeVisible();
  return downloadJsonAfter(page, () => page.locator('#summaryExport').click());
}

function trackErrors(page) {
  const errors = [];
  page.on('pageerror', error => errors.push(`pageerror: ${error.message}`));
  page.on('console', message => {
    if(message.type() === 'error') errors.push(`console: ${message.text()}`);
  });
  return errors;
}

test('V1.8 alpha is versioned without changing the stable entry point', async ({ page }) => {
  await gotoAlpha(page);
  await expect(page).toHaveTitle(/V1\.8\.0-alpha/);
  await expect(page.locator('#versionInfo')).toContainText('V1.8.0-alpha');
  await expect(page.locator('#aboutSourceFile')).toHaveText('choice_train_V1.8.0-alpha.html');

  const index = fs.readFileSync('index.html', 'utf8');
  expect(index).toContain('choice_train_V1.7.0.js');
  expect(index).not.toContain('choice_train_V1.8.0-alpha.js');
});

test('V1.8 alpha loads without making external runtime requests', async ({ page }) => {
  const externalRequests = [];
  page.on('request', request => {
    const url = new URL(request.url());
    if(!['127.0.0.1', 'localhost'].includes(url.hostname)) externalRequests.push(request.url());
  });
  await gotoAlpha(page);
  await page.waitForTimeout(150);
  expect(externalRequests).toEqual([]);
});

test('legacy local data migrates non-destructively and idempotently', async ({ page }) => {
  await gotoAlpha(page);

  const seeded = await page.evaluate(async () => {
    localStorage.clear();
    const legacySettings = {
      selectedPupil: 'Legacy Pupil',
      pupilAlias: 'Legacy Alias',
      startLevel: 4,
      sessionMax: 5,
      themeChoice: 'soft-green',
      studentFriendlyMode: true
    };
    const legacyLearners = {
      'Legacy Pupil': {
        name: 'Legacy Pupil',
        alias: 'Legacy Alias',
        lastLevel: 4,
        sessions: [{ session_id: 'profile-session-legacy' }],
        baseline: { medicationContext: 'Settled after lunch' },
        reviews: [{ decision: 'defer' }]
      }
    };
    localStorage.setItem('choice_train_settings_v130', JSON.stringify(legacySettings));
    localStorage.setItem('ct_profiles', JSON.stringify(legacyLearners));

    const db = await new Promise((resolve, reject) => {
      const request = indexedDB.open('choice_train_runtime_v2', 2);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
    const tx = db.transaction(['assets', 'meta', 'sessions'], 'readwrite');
    tx.objectStore('assets').clear();
    tx.objectStore('meta').clear();
    tx.objectStore('sessions').clear();
    tx.objectStore('assets').put({
      key: 'profile:customImages',
      value: [{
        id: 'legacy-photo-1',
        learner: 'Legacy Pupil',
        label: 'Blue bear',
        src: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="2" height="2"/%3E',
        category: 'animals',
        colour: 'blue',
        useInQuestions: true,
        addedAt: 1700000000000
      }],
      updated_at_wall_ms: 1700000000000
    });
    tx.objectStore('meta').put({
      key: 'schema:choice-train-data',
      version: 5,
      photo_schema_version: 2,
      migrated_at_wall_ms: 1700000000000
    });
    tx.objectStore('sessions').put({
      session_id: 'legacy-session-1',
      learner: 'Legacy Pupil',
      learner_alias: 'Legacy Alias',
      archived: false,
      trials: []
    });
    await new Promise((resolve, reject) => {
      tx.oncomplete = resolve;
      tx.onerror = () => reject(tx.error);
      tx.onabort = () => reject(tx.error);
    });
    db.close();
    return { legacySettings, legacyLearners };
  });

  await page.reload();
  await expect(page.locator('#beginFlow')).toBeVisible();
  await expect(page.locator('#pupilSelect')).toHaveValue('Legacy Pupil');
  await expect(page.locator('#startLevel')).toHaveValue('4');
  await expect(page.locator('#sessionMax')).toHaveValue('5');

  const readMigrationState = () => page.evaluate(async () => {
    const db = await new Promise((resolve, reject) => {
      const request = indexedDB.open('choice_train_runtime_v2', 2);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
    const read = (storeName, key) => new Promise((resolve, reject) => {
      const tx = db.transaction(storeName, 'readonly');
      const request = tx.objectStore(storeName).get(key);
      request.onsuccess = () => resolve(request.result || null);
      request.onerror = () => reject(request.error);
    });
    const [marker, assets, session] = await Promise.all([
      read('meta', 'schema:choice-train-data'),
      read('assets', 'profile:customImages'),
      read('sessions', 'legacy-session-1')
    ]);
    db.close();
    return {
      marker,
      assets,
      session,
      legacySettings: JSON.parse(localStorage.getItem('choice_train_settings_v130')),
      legacyLearners: JSON.parse(localStorage.getItem('ct_profiles')),
      currentLearners: JSON.parse(localStorage.getItem('choice_train_learners_v140'))
    };
  });

  await expect.poll(async () => {
    const snapshot = await readMigrationState();
    return snapshot.marker && snapshot.marker.version;
  }).toBe(6);

  const first = await readMigrationState();
  expect(first.legacySettings).toEqual(seeded.legacySettings);
  expect(first.legacyLearners).toEqual(seeded.legacyLearners);
  expect(first.currentLearners['Legacy Pupil']).toEqual(expect.objectContaining({
    alias: 'Legacy Alias',
    lastLevel: 4,
    sessions: [{ session_id: 'profile-session-legacy' }],
    reviews: [{ decision: 'defer' }]
  }));
  expect(first.currentLearners['Legacy Pupil'].baseline.contextNotes).toBe('Settled after lunch');
  expect(first.session).toEqual(expect.objectContaining({
    session_id: 'legacy-session-1',
    learner: 'Legacy Pupil'
  }));
  expect(first.assets.value).toHaveLength(1);
  expect(first.assets.value[0]).toEqual(expect.objectContaining({
    id: 'legacy-photo-1',
    label: 'Blue bear',
    category: 'animals',
    originalCategory: 'animals',
    categoryIds: expect.arrayContaining(['animals']),
    source: 'personalised',
    attributes: { colour: 'blue' },
    attributeSource: 'teacher',
    useInQuestions: true,
    schemaVersion: 3
  }));
  expect(first.assets.value[0].originalSrc).toBe(first.assets.value[0].src);
  expect(first.assets.value[0].edit).toEqual(expect.objectContaining({
    squareCrop: false,
    zoom: 1,
    focusX: 0.5,
    focusY: 0.5,
    rotation: 0
  }));

  await page.reload();
  await expect(page.locator('#beginFlow')).toBeVisible();
  await expect.poll(async () => {
    const snapshot = await readMigrationState();
    return snapshot.marker && snapshot.marker.version;
  }).toBe(6);
  const second = await readMigrationState();

  expect(second).toEqual(first);
});

test('V1.8 export declares the versioned research contract and preserves missing values', async ({ page }) => {
  await gotoAlpha(page);
  const payload = await downloadJsonAfter(page, () => page.locator('#exportBtn').click());

  expect(payload.build.version).toBe('1.8.0-alpha');
  expect(payload.schema_version).toBe(8);
  expect(payload.skill_graph_version).toBe('1.4.0');
  expect(payload.generator_version).toBe('1.6.0');
  expect(payload.research_summary_version).toBe('1.0.0');
  expect(payload.skill_graph).toEqual(expect.arrayContaining([
    expect.objectContaining({ skill_id: 'access.touch_screen' }),
    expect.objectContaining({ skill_id: 'categorisation.match_category' }),
    expect.objectContaining({ skill_id: 'categorisation.complete_group' }),
    expect.objectContaining({ skill_id: 'categorisation.category_exclusion' }),
    expect.objectContaining({ skill_id: 'attention.executive' })
  ]));
  expect(payload.research_summary.final_trial_count).toBe(0);
  expect(payload.research_summary.skill_summaries).toEqual([]);
  expectCoreSchema(payload.research_summary.data_quality, DATA_QUALITY_SCHEMA, 'research_summary.data_quality');
  expect(payload.research_summary.data_quality).toEqual(expect.objectContaining({
    schema_version: '1.0.0',
    source_trial_count: 0,
    final_trial_count: 0,
    repeated_attempt_count: 0,
    response_time_observed_count: 0
  }));
  expect(payload.research_summary.data_quality.recording_flags).toContain('NO_FINAL_TRIALS');
});

test('a learner trial exports skill, generator, and descriptive research metadata', async ({ page }) => {
  await gotoAlpha(page);
  await setCheckbox(page, 'ttsToggle', false);
  await setCheckbox(page, 'useTwoStage', false);
  await setCheckbox(page, 'useReward', false);
  await setCheckbox(page, 'autoAdvance', true);
  await setValue(page, 'startLevel', 4);
  await setValue(page, 'sessionMax', 1);

  await page.locator('#quickStartSessionBtn').click();
  const target = page.locator('#choiceGrid [data-role="correct-target"]').first();
  await expect(target).toBeVisible();
  await target.click();
  await expect(page.locator('#screenSummary.active')).toBeVisible();

  const payload = await downloadJsonAfter(page, () => page.locator('#summaryExport').click());
  const trial = payload.trials[0];
  expectCoreSchema(trial, TRIAL_SCHEMA, 'trial');
  expect(trial.schema_version).toBe(8);
  expect(trial.skill_graph_version).toBe('1.4.0');
  expect(trial.skill_ids).toEqual(['recognition.named_object']);
  expect(trial.lesson_plan_id).toBe(payload.lesson_plan_id);
  expect(trial.lesson_seed).toEqual(expect.any(Number));
  expect(trial.question_seed).toEqual(expect.any(Number));
  expect(trial.generator_mode).toBe('deterministic-seeded');
  expect(payload.lesson_plan).toEqual(expect.objectContaining({
    lesson_seed: trial.lesson_seed,
    generator_mode: 'deterministic-seeded'
  }));
  expect(payload.lesson_plan.constraints.level).toBe(4);
  expect(trial.generator_constraints).toEqual(expect.objectContaining({
    task_kind: 'find-object',
    level: 4
  }));
  expect(trial.target_play_x).toEqual(expect.any(Number));
  expect(trial.target_play_y).toEqual(expect.any(Number));
  expect(trial.touch_delta_x_px).toEqual(expect.any(Number));
  expect(trial.touch_delta_y_px).toEqual(expect.any(Number));
  expect(trial.play_area_width_px).toBeGreaterThan(0);
  expect(trial.play_area_height_px).toBeGreaterThan(0);
  expect(trial.distance_to_target_play_diagonal).toEqual(expect.any(Number));
  expect(payload.session_timing).toEqual(expect.objectContaining({
    planned_questions: 1,
    completed_questions: 1,
    completion_pct: 100,
    completion_status: 'completed',
    end_reason: 'planned-questions-complete'
  }));
  expect(payload.session_timing.duration_ms).toBeGreaterThanOrEqual(0);
  expect(payload.events.some(event => event.type === 'session_complete')).toBe(true);
  expect(payload.eeg_markers.some(marker => marker.name === 'session_complete')).toBe(true);

  const skill = payload.research_summary.skill_summaries.find(item => item.skill_id === 'recognition.named_object');
  expect(skill).toEqual(expect.objectContaining({
    opportunities: 1,
    scored_opportunities: 1,
    correct: 1,
    accuracy_pct: 100,
    omissions: 0,
    commissions: 0
  }));
  expect(skill.median_reaction_time_ms).not.toBeNull();
  expect(payload.research_summary.interpretation_boundary).toContain('not a diagnostic');
});

test('a fixed lesson seed reproduces target, options, and prompt wording', async ({ page }) => {
  await gotoAlpha(page);
  await setCheckbox(page, 'ttsToggle', false);
  await setCheckbox(page, 'useTwoStage', false);
  await setCheckbox(page, 'useReward', false);
  await setCheckbox(page, 'autoAdvance', true);
  await setCheckbox(page, 'autoLevelPath', false);
  await setValue(page, 'sessionTaskType', 'find-object');
  await setValue(page, 'startLevel', 4);
  await setValue(page, 'sessionMax', 1);
  await setValue(page, 'lessonSeedOverride', 246813579);

  async function completeAndExport(){
    await page.locator('#quickStartSessionBtn').click();
    const target = page.locator('#choiceGrid [data-role="correct-target"]').first();
    await expect(target).toBeVisible();
    await target.click();
    await expect(page.locator('#screenSummary.active')).toBeVisible();
    return downloadJsonAfter(page, () => page.locator('#summaryExport').click());
  }

  const first = await completeAndExport();
  await page.locator('#teacherExitHold').focus();
  await page.locator('#teacherExitHold').press('Enter');
  await setValue(page, 'startLevel', 4);
  const second = await completeAndExport();

  const firstTrial = first.trials[0];
  const secondTrial = second.trials[0];
  expect(first.lesson_plan.lesson_seed).toBe(246813579);
  expect(first.lesson_plan.lesson_seed_source).toBe('admin-override');
  expect(first.lesson_plan.constraints.level).toBe(4);
  expect(second.lesson_plan.constraints.level).toBe(4);
  expect(secondTrial.question_seed).toBe(firstTrial.question_seed);
  expect(secondTrial.target_id).toBe(firstTrial.target_id);
  expect(secondTrial.option_labels).toEqual(firstTrial.option_labels);
  expect(secondTrial.option_metadata.map(item => item.id)).toEqual(firstTrial.option_metadata.map(item => item.id));
  expect(secondTrial.prompt_wording).toBe(firstTrial.prompt_wording);
  expect(firstTrial.option_metadata.filter(item => item.id === firstTrial.target_id)).toHaveLength(1);
});

test('Find object balances configured categories before repeating and preserves invariants across seeds', async ({ page }) => {
  test.slow();
  await gotoAlpha(page);
  await setCheckbox(page, 'ttsToggle', false);
  await setCheckbox(page, 'useTwoStage', false);
  await setCheckbox(page, 'useReward', false);
  await setCheckbox(page, 'autoAdvance', true);
  await setCheckbox(page, 'autoLevelPath', false);
  await setValue(page, 'itiSec', 0);
  await setValue(page, 'sessionTaskType', 'find-object');
  await setValue(page, 'findObjectSourceMode', 'stock');
  await setValue(page, 'startLevel', 4);
  await setValue(page, 'sessionMax', 6);
  await setValue(page, 'maxObjects', 6);

  for(const seed of [17, 246813579, 4294967291]) {
    await setValue(page, 'lessonSeedOverride', seed);
    await setValue(page, 'startLevel', 4);
    const payload = await completeSessionAndExport(page, 6);
    expect(payload.generator_version).toBe('1.6.0');
    expect(payload.lesson_plan.constraints.coverage_strategy).toBe('balanced-before-repeat');
    expect(new Set(payload.trials.map(trial => trial.target_category)).size).toBe(6);
    expect(new Set(payload.trials.map(trial => trial.target_id)).size).toBe(6);
    payload.trials.forEach(trial => {
      const optionIds = trial.option_metadata.map(option => option.id);
      const optionLabels = trial.option_metadata.map(option => option.label.toLowerCase());
      expect(optionIds.filter(id => id === trial.target_id)).toHaveLength(1);
      expect(new Set(optionIds).size).toBe(optionIds.length);
      expect(new Set(optionLabels).size).toBe(optionLabels.length);
      expect(trial.option_metadata.length).toBeLessThanOrEqual(6);
      expect(trial.target_source).toBe('stock');
      expect(trial.prompt_wording.toLowerCase()).toContain(trial.target_label.toLowerCase());
      expect(trial.generator_constraints.coverage_strategy).toBe('balanced-before-repeat');
    });
    await page.locator('#teacherExitHold').focus();
    await page.locator('#teacherExitHold').press('Enter');
  }

  await page.locator('#adminPanelTab').click();
  await page.locator('#adminNavResearch').click();
  await setValue(page, 'researchScopeSelect', 'current-session');
  await expect(page.locator('#researchDistinctTargets')).toHaveText('6');
  await expect(page.locator('#researchRepeatTargets')).toHaveText('0');
  await expect(page.locator('#researchTargetBody tr')).toHaveCount(6);
  await expect(page.locator('#researchContentBreadthChart')).toBeVisible();
  const breadthCells = page.locator('#researchContentBreadthBody tr').first().locator('td');
  await expect(breadthCells.nth(2)).toHaveText('6');
  await expect(breadthCells.nth(4)).toHaveText('6');
  await expect(breadthCells.nth(5)).toHaveText('0');
  await expect(breadthCells.nth(7)).toHaveText('0');
});

test('Find category rotates fair categories and keeps exactly one correct option across seeds', async ({ page }) => {
  test.slow();
  await gotoAlpha(page);
  await setCheckbox(page, 'ttsToggle', false);
  await setCheckbox(page, 'useTwoStage', false);
  await setCheckbox(page, 'useReward', false);
  await setCheckbox(page, 'autoAdvance', true);
  await setCheckbox(page, 'autoLevelPath', false);
  await setValue(page, 'itiSec', 0);
  await setValue(page, 'sessionTaskType', 'find-category');
  await setValue(page, 'findCategorySourceMode', 'stock');
  await setValue(page, 'startLevel', 6);
  await setValue(page, 'sessionMax', 8);
  await setValue(page, 'maxObjects', 6);

  for(const seed of [31, 97531, 314159265]) {
    await setValue(page, 'lessonSeedOverride', seed);
    await setValue(page, 'startLevel', 6);
    const payload = await completeSessionAndExport(page, 8);
    const categoryCounts = payload.trials.reduce((counts, trial) => {
      counts[trial.target_category] = (counts[trial.target_category] || 0) + 1;
      return counts;
    }, {});
    expect(Object.keys(categoryCounts)).toHaveLength(4);
    expect(Object.values(categoryCounts).every(count => count === 2)).toBe(true);
    payload.trials.forEach(trial => {
      const matchingOptions = trial.option_metadata.filter(option => option.category_ids.includes(trial.target_category));
      const optionIds = trial.option_metadata.map(option => option.id);
      expect(matchingOptions).toHaveLength(1);
      expect(matchingOptions[0].id).toBe(trial.target_id);
      expect(optionIds.filter(id => id === trial.target_id)).toHaveLength(1);
      expect(new Set(optionIds).size).toBe(optionIds.length);
      expect(trial.option_metadata.length).toBeLessThanOrEqual(6);
      expect(trial.target_source).toBe('stock');
      expect(trial.prompt_wording).toMatch(/Find |Which one is |Can you find |Where is /);
    });
    await page.locator('#teacherExitHold').focus();
    await page.locator('#teacherExitHold').press('Enter');
  }
});

test('Match category uses a distinct cue and same-category target with reproducible fair distractors', async ({ page }) => {
  test.slow();
  await gotoAlpha(page);
  await setCheckbox(page, 'ttsToggle', false);
  await setCheckbox(page, 'useTwoStage', false);
  await setCheckbox(page, 'useReward', false);
  await setCheckbox(page, 'autoAdvance', true);
  await setCheckbox(page, 'autoLevelPath', false);
  await setValue(page, 'itiSec', 0);
  await setValue(page, 'sessionTaskType', 'match-category');
  await setValue(page, 'findCategorySourceMode', 'stock');
  await setValue(page, 'startLevel', 6);
  await setValue(page, 'sessionMax', 8);
  await setValue(page, 'maxObjects', 6);

  for(const seed of [41, 24681012, 4294967279]) {
    await setValue(page, 'lessonSeedOverride', seed);
    await setValue(page, 'startLevel', 6);
    await page.locator('#quickStartSessionBtn').click();
    for(let index = 0; index < 8; index += 1) {
      const cueCard = page.locator('#choiceGrid .matchCueCard');
      const target = page.locator('#choiceGrid [data-role="correct-target"]').first();
      await expect(cueCard).toBeVisible();
      await expect(target).toBeVisible();
      expect(await cueCard.getAttribute('data-cue-id')).not.toBe(await target.getAttribute('data-id'));
      await target.click();
      if(index < 7) await expect(page.locator('#qIndex')).toHaveText(`${index + 2} / 8`);
    }
    await expect(page.locator('#screenSummary.active')).toBeVisible();
    const payload = await downloadJsonAfter(page, () => page.locator('#summaryExport').click());
    expect(payload.schema_version).toBe(8);
    expect(payload.generator_version).toBe('1.6.0');
    expect(payload.skill_graph_version).toBe('1.4.0');
    expect(new Set(payload.trials.map(trial => trial.target_category)).size).toBe(4);

    payload.trials.forEach(trial => {
      const matchingOptions = trial.option_metadata.filter(option => option.category_ids.includes(trial.target_category));
      const optionIds = trial.option_metadata.map(option => option.id);
      expect(trial.task_kind).toBe('match-category');
      expect(trial.skill_ids).toEqual(['categorisation.match_category']);
      expect(trial.procedural_variant).toBe('category-exemplar-match');
      expect(trial.cue_id).toBeTruthy();
      expect(trial.cue_id).not.toBe(trial.target_id);
      expect(trial.cue_category).toBe(trial.target_category);
      expect(trial.cue_metadata.category_ids).toContain(trial.target_category);
      expect(optionIds).not.toContain(trial.cue_id);
      expect(matchingOptions).toHaveLength(1);
      expect(matchingOptions[0].id).toBe(trial.target_id);
      expect(new Set(optionIds).size).toBe(optionIds.length);
      expect(new Set(trial.option_metadata.map(option => option.label.toLowerCase())).size).toBe(trial.option_metadata.length);
      expect(trial.prompt_wording).toMatch(/Find |Which one |Can you find /);
      expect(trial.generator_constraints).toEqual(expect.objectContaining({
        cue_id: trial.cue_id,
        cue_category: trial.target_category,
        procedural_variant: 'category-exemplar-match'
      }));
    });

    await page.locator('#teacherExitHold').focus();
    await page.locator('#teacherExitHold').press('Enter');
  }

  await setValue(page, 'sessionTaskType', 'auto');
  await setCheckbox(page, 'autoLevelPath', true);
  await setValue(page, 'startLevel', 6);
  await setValue(page, 'sessionMax', 8);
  const autoPayload = await completeSessionAndExport(page, 8);
  expect(autoPayload.trials.map(trial => trial.task_kind)).toEqual([
    'find-category', 'match-category', 'complete-category-group', 'category-exclusion',
    'find-category', 'match-category', 'complete-category-group', 'category-exclusion'
  ]);

  await page.locator('#teacherExitHold').focus();
  await page.locator('#teacherExitHold').press('Enter');
  await page.locator('#adminPanelTab').click();
  await page.locator('#adminNavResearch').click();
  await setValue(page, 'researchScopeSelect', 'current-session');
  await expect(page.locator('#researchMatchTrials')).toHaveText('2');
  await expect(page.locator('#researchMatchCategories')).toHaveText('2');
  await expect(page.locator('#researchMatchPairs')).toHaveText('2');
  await expect(page.locator('#researchMatchIntegrity')).toHaveText('100%');
  await expect(page.locator('#researchMatchCategoryBody tr')).toHaveCount(2);
  await expect(page.locator('#researchMatchCategoryNote')).toContainText('engineering/data-quality');
  await expect(page.locator('#researchCategoryLessonTrials')).toHaveText('8');
  await expect(page.locator('#researchCategoryLessonTasks')).toHaveText('4');
  await expect(page.locator('#researchCategoryLessonBody tr')).not.toHaveCount(0);
  await expect(page.locator('#researchCategoryLessonNote')).toContainText('exposure');

  const researchPayload = await downloadJsonAfter(page, () => page.locator('#exportResearchSummaryBtn').click());
  expectCoreSchema(researchPayload, RESEARCH_SCHEMA, 'research_summary');
  expect(researchPayload.export_schema_version).toBe('1.7.0');
  expect(researchPayload.category_matching).toHaveLength(2);
  expect(researchPayload.category_matching.every(row => row.generator_integrity_pct === 100)).toBe(true);
  expect(researchPayload.category_lesson_coverage.reduce((sum, row) => sum + row.trials, 0)).toBe(8);
  expect(researchPayload.category_lesson_coverage.reduce((sum, row) => sum + row.complete_group_trials, 0)).toBe(2);
  expect(researchPayload.category_lesson_coverage.reduce((sum, row) => sum + row.category_exclusion_trials, 0)).toBe(2);
});

test('Complete the group uses two distinct cues and one same-category answer across seeds', async ({ page }) => {
  test.slow();
  await gotoAlpha(page);
  await setCheckbox(page, 'ttsToggle', false);
  await setCheckbox(page, 'useTwoStage', false);
  await setCheckbox(page, 'useReward', false);
  await setCheckbox(page, 'autoAdvance', true);
  await setCheckbox(page, 'autoLevelPath', false);
  await setValue(page, 'itiSec', 0);
  await setValue(page, 'sessionTaskType', 'complete-category-group');
  await setValue(page, 'findCategorySourceMode', 'stock');
  await setValue(page, 'startLevel', 6);
  await setValue(page, 'sessionMax', 8);
  await setValue(page, 'maxObjects', 4);

  for(const seed of [47, 11235813, 4294967267]) {
    await setValue(page, 'lessonSeedOverride', seed);
    await setValue(page, 'startLevel', 6);
    await page.locator('#quickStartSessionBtn').click();
    for(let index = 0; index < 8; index += 1) {
      await expect(page.locator('#choiceGrid .groupCueCard')).toBeVisible();
      await expect(page.locator('#choiceGrid .groupCueItem')).toHaveCount(2);
      await page.locator('#choiceGrid [data-role="correct-target"]').first().click();
      if(index < 7) await expect(page.locator('#qIndex')).toHaveText(`${index + 2} / 8`);
    }
    await expect(page.locator('#screenSummary.active')).toBeVisible();
    const payload = await downloadJsonAfter(page, () => page.locator('#summaryExport').click());
    expect(payload.schema_version).toBe(8);
    expect(payload.generator_version).toBe('1.6.0');
    expect(payload.skill_graph_version).toBe('1.4.0');
    expect(new Set(payload.trials.map(trial => trial.reference_category)).size).toBe(4);

    payload.trials.forEach(trial => {
      const optionIds = trial.option_metadata.map(option => option.id);
      const matchingOptions = trial.option_metadata.filter(option => option.category_ids.includes(trial.reference_category));
      expect(trial.task_kind).toBe('complete-category-group');
      expect(trial.skill_ids).toEqual(['categorisation.complete_group']);
      expect(trial.procedural_variant).toBe('category-group-completion');
      expect(trial.category_relation).toBe('same-as-reference-category');
      expect(trial.cue_ids).toHaveLength(2);
      expect(new Set(trial.cue_ids).size).toBe(2);
      expect(trial.cue_metadata_list).toHaveLength(2);
      expect(trial.cue_metadata_list.every(cue => cue.category_ids.includes(trial.reference_category))).toBe(true);
      expect(trial.cue_ids.some(id => optionIds.includes(id))).toBe(false);
      expect(matchingOptions).toHaveLength(1);
      expect(matchingOptions[0].id).toBe(trial.target_id);
      expect(new Set(optionIds).size).toBe(optionIds.length);
      expect(trial.prompt_wording).toMatch(/group/i);
      expect(trial.generator_constraints).toEqual(expect.objectContaining({
        cue_ids: trial.cue_ids,
        reference_category: trial.reference_category,
        category_relation: 'same-as-reference-category',
        procedural_variant: 'category-group-completion'
      }));
    });

    await page.locator('#teacherExitHold').focus();
    await page.locator('#teacherExitHold').press('Enter');
  }

  await page.locator('#adminPanelTab').click();
  await page.locator('#adminNavResearch').click();
  await setValue(page, 'researchScopeSelect', 'current-session');
  await expect(page.locator('#researchGroupTrials')).toHaveText('8');
  await expect(page.locator('#researchGroupCategories')).toHaveText('4');
  await expect(page.locator('#researchGroupIntegrity')).toHaveText('100%');
  await expect(page.locator('#researchGroupCategoryBody tr')).toHaveCount(4);
  await expect(page.locator('#researchGroupCategoryNote')).toContainText('multiple examples');

  const researchPayload = await downloadJsonAfter(page, () => page.locator('#exportResearchSummaryBtn').click());
  expect(researchPayload.export_schema_version).toBe('1.7.0');
  expect(researchPayload.category_group_completion).toHaveLength(4);
  expect(researchPayload.category_group_completion.every(row => row.generator_integrity_pct === 100)).toBe(true);
});

test('Find the different one keeps exactly one outside-category target and visualises integrity', async ({ page }) => {
  test.slow();
  await gotoAlpha(page);
  await setCheckbox(page, 'ttsToggle', false);
  await setCheckbox(page, 'useTwoStage', false);
  await setCheckbox(page, 'useReward', false);
  await setCheckbox(page, 'autoAdvance', true);
  await setCheckbox(page, 'autoLevelPath', false);
  await setValue(page, 'itiSec', 0);
  await setValue(page, 'sessionTaskType', 'category-exclusion');
  await setValue(page, 'findCategorySourceMode', 'stock');
  await setValue(page, 'startLevel', 6);
  await setValue(page, 'sessionMax', 8);
  await setValue(page, 'maxObjects', 4);

  for(const seed of [53, 1357911, 4294967271]) {
    await setValue(page, 'lessonSeedOverride', seed);
    await setValue(page, 'startLevel', 6);
    const payload = await completeSessionAndExport(page, 8);
    expect(payload.schema_version).toBe(8);
    expect(payload.generator_version).toBe('1.6.0');
    expect(payload.skill_graph_version).toBe('1.4.0');
    expect(new Set(payload.trials.map(trial => trial.reference_category)).size).toBe(4);

    payload.trials.forEach(trial => {
      const groupOptions = trial.option_metadata.filter(option => option.category_ids.includes(trial.reference_category));
      const outsideOptions = trial.option_metadata.filter(option => !option.category_ids.includes(trial.reference_category));
      const optionIds = trial.option_metadata.map(option => option.id);
      const optionLabels = trial.option_metadata.map(option => option.label.toLowerCase());
      expect(trial.task_kind).toBe('category-exclusion');
      expect(trial.skill_ids).toEqual(['categorisation.category_exclusion']);
      expect(trial.procedural_variant).toBe('category-exclusion');
      expect(trial.category_relation).toBe('outside-reference-category');
      expect(trial.reference_category).toBeTruthy();
      expect(groupOptions.length).toBeGreaterThanOrEqual(2);
      expect(outsideOptions).toHaveLength(1);
      expect(outsideOptions[0].id).toBe(trial.target_id);
      expect(new Set(optionIds).size).toBe(optionIds.length);
      expect(new Set(optionLabels).size).toBe(optionLabels.length);
      expect(trial.option_metadata.length).toBeGreaterThanOrEqual(3);
      expect(trial.option_metadata.length).toBeLessThanOrEqual(4);
      expect(trial.prompt_wording).toMatch(/different|does not belong/i);
      expect(trial.generator_constraints).toEqual(expect.objectContaining({
        reference_category: trial.reference_category,
        category_relation: 'outside-reference-category',
        procedural_variant: 'category-exclusion'
      }));
    });

    await page.locator('#teacherExitHold').focus();
    await page.locator('#teacherExitHold').press('Enter');
  }

  await page.locator('#adminPanelTab').click();
  await page.locator('#adminNavResearch').click();
  await setValue(page, 'researchScopeSelect', 'current-session');
  await expect(page.locator('#researchExclusionTrials')).toHaveText('8');
  await expect(page.locator('#researchExclusionCategories')).toHaveText('4');
  await expect(page.locator('#researchExclusionIntegrity')).toHaveText('100%');
  await expect(page.locator('#researchExclusionCategoryBody tr')).toHaveCount(4);
  await expect(page.locator('#researchExclusionCategoryNote')).toContainText('not a pupil outcome');

  const researchPayload = await downloadJsonAfter(page, () => page.locator('#exportResearchSummaryBtn').click());
  expect(researchPayload.export_schema_version).toBe('1.7.0');
  expect(researchPayload.category_exclusion).toHaveLength(4);
  expect(researchPayload.category_exclusion.every(row => row.generator_integrity_pct === 100)).toBe(true);
});

test('Find by colour uses teacher-declared metadata with deterministic one-answer constraints and Research coverage', async ({ page }) => {
  test.slow();
  await gotoAlpha(page);
  await setCheckbox(page, 'ttsToggle', false);
  await setCheckbox(page, 'useTwoStage', false);
  await setCheckbox(page, 'useReward', false);
  await setCheckbox(page, 'autoAdvance', true);
  await setCheckbox(page, 'autoLevelPath', false);
  await setValue(page, 'itiSec', 0);
  await page.locator('#teacherNavPersonalise').click();

  const photos = [
    { label: 'Red fruit', category: 'fruit', colour: 'red', fill: '#c93434' },
    { label: 'Blue fruit', category: 'fruit', colour: 'blue', fill: '#2c67c7' },
    { label: 'Green fruit', category: 'fruit', colour: 'green', fill: '#2d8b57' },
    { label: 'Red animal', category: 'animals', colour: 'red', fill: '#b52f2f' },
    { label: 'Blue animal', category: 'animals', colour: 'blue', fill: '#245db1' },
    { label: 'Green animal', category: 'animals', colour: 'green', fill: '#267849' }
  ];
  for(const photo of photos){
    await page.locator('#photoLabel').fill(photo.label);
    await page.locator('#photoCategory').selectOption(photo.category);
    await page.locator('#photoColour').selectOption(photo.colour);
    await page.locator('#photoUpload').setInputFiles({
      name: `${photo.colour}-blocks.svg`,
      mimeType: 'image/svg+xml',
      buffer: Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="80" height="80"><rect width="80" height="80" rx="12" fill="${photo.fill}"/></svg>`)
    });
    await page.locator('#addPhotoBtn').click();
  }
  await expect(page.locator('#photoLibraryList .photoCard')).toHaveCount(6);
  await expect(page.locator('#photoLibraryList')).toContainText('Teacher-labelled red');
  await expect(page.locator('#photoLibraryList')).toContainText('Teacher-labelled blue');
  await expect(page.locator('#photoLibraryList')).toContainText('Teacher-labelled green');

  await page.locator('#teacherNavToday').click();
  await setValue(page, 'sessionTaskType', 'find-attribute');
  await setValue(page, 'findCategorySourceMode', 'personalised');
  await setValue(page, 'startLevel', 6);
  await setValue(page, 'sessionMax', 6);
  await setValue(page, 'maxObjects', 3);
  await setValue(page, 'lessonSeedOverride', 1618033);

  const first = await completeSessionAndExport(page, 6);
  expect(first.generator_version).toBe('1.6.0');
  expect(first.skill_graph_version).toBe('1.4.0');
  expect(first.photo_library_metadata.every(item => item.attribute_source === 'teacher')).toBe(true);
  expect(first.photo_library_metadata.map(item => item.declared_attributes.colour).sort()).toEqual(['blue', 'blue', 'green', 'green', 'red', 'red']);
  const valueCounts = first.trials.reduce((counts, trial) => {
    counts[trial.target_attribute_value] = (counts[trial.target_attribute_value] || 0) + 1;
    return counts;
  }, {});
  expect(valueCounts).toEqual({ blue: 2, green: 2, red: 2 });
  expect(new Set(first.trials.map(trial => trial.target_category))).toEqual(new Set(['animals', 'fruit']));
  first.trials.forEach(trial => {
    const matching = trial.option_metadata.filter(option => (
      option.attribute_source === 'teacher'
      && option.attributes.colour === trial.target_attribute_value
    ));
    expectCoreSchema(trial, TRIAL_SCHEMA, 'trial');
    expect(trial.task_kind).toBe('find-attribute');
    expect(trial.skill_ids).toEqual(['categorisation.declared_colour']);
    expect(trial.procedural_variant).toBe('teacher-declared-colour-selection');
    expect(trial.attribute_source).toBe('teacher');
    expect(trial.attribute_relation).toBe('matches-teacher-declared-value');
    expect(trial.category_relation).toBe('same-category-declared-attribute-contrast');
    expect(trial.option_metadata).toHaveLength(3);
    expect(trial.option_metadata.every(option => option.category_ids.includes(trial.target_category))).toBe(true);
    expect(trial.option_metadata.every(option => option.attribute_source === 'teacher')).toBe(true);
    expect(trial.option_metadata.every(option => option.source === 'personalised')).toBe(true);
    expect(matching).toHaveLength(1);
    expect(matching[0].id).toBe(trial.target_id);
    expect(trial.prompt_wording.toLowerCase()).toContain(trial.target_attribute_value);
    expect(trial.generator_constraints).toEqual(expect.objectContaining({
      target_attribute_key: 'colour',
      target_attribute_value: trial.target_attribute_value,
      attribute_source: 'teacher',
      attribute_relation: 'matches-teacher-declared-value'
    }));
  });

  await page.locator('#teacherExitHold').focus();
  await page.locator('#teacherExitHold').press('Enter');
  await setValue(page, 'startLevel', 6);
  const second = await completeSessionAndExport(page, 6);
  expect(second.trials.map(trial => ({
    target: trial.target_id,
    options: trial.option_metadata.map(option => option.id),
    prompt: trial.prompt_wording
  }))).toEqual(first.trials.map(trial => ({
    target: trial.target_id,
    options: trial.option_metadata.map(option => option.id),
    prompt: trial.prompt_wording
  })));

  await page.locator('#teacherExitHold').focus();
  await page.locator('#teacherExitHold').press('Enter');
  await setValue(page, 'sessionTaskType', 'auto');
  await setCheckbox(page, 'autoLevelPath', true);
  await setValue(page, 'startLevel', 6);
  await setValue(page, 'sessionMax', 5);
  const autoPayload = await completeSessionAndExport(page, 5);
  expect(autoPayload.trials.map(trial => trial.task_kind)).toEqual([
    'find-category',
    'match-category',
    'complete-category-group',
    'category-exclusion',
    'find-attribute'
  ]);

  await page.locator('#teacherExitHold').focus();
  await page.locator('#teacherExitHold').press('Enter');
  await page.locator('#adminPanelTab').click();
  await page.locator('#adminNavResearch').click();
  await setValue(page, 'researchScopeSelect', 'current-session');
  await expect(page.locator('#researchAttributeTrials')).toHaveText('1');
  await expect(page.locator('#researchAttributeValues')).toHaveText('1');
  await expect(page.locator('#researchAttributeCategories')).toHaveText('1');
  await expect(page.locator('#researchAttributeIntegrity')).toHaveText('100%');
  await expect(page.locator('#researchAttributeBody tr')).toHaveCount(1);
  await expect(page.locator('#researchAttributeNote')).toContainText('practitioner-entered metadata');
  await expect(page.locator('#researchCategoryLessonTasks')).toHaveText('5');

  const researchPayload = await downloadJsonAfter(page, () => page.locator('#exportResearchSummaryBtn').click());
  expectCoreSchema(researchPayload, RESEARCH_SCHEMA, 'research_summary');
  expect(researchPayload.export_schema_version).toBe('1.7.0');
  expect(researchPayload.attribute_selection).toHaveLength(1);
  expect(researchPayload.attribute_selection.every(row => row.generator_integrity_pct === 100)).toBe(true);
  expect(researchPayload.category_lesson_coverage.reduce((sum, row) => sum + row.find_attribute_trials, 0)).toBe(1);
});

test('Discriminate object uses configured categories and a reproducible two-option contrast', async ({ page }) => {
  test.slow();
  await gotoAlpha(page);
  await setCheckbox(page, 'ttsToggle', false);
  await setCheckbox(page, 'useTwoStage', false);
  await setCheckbox(page, 'useReward', false);
  await setCheckbox(page, 'autoAdvance', true);
  await setCheckbox(page, 'autoLevelPath', false);
  await setValue(page, 'itiSec', 0);
  await setValue(page, 'sessionTaskType', 'discriminate-object');
  await setValue(page, 'findObjectSourceMode', 'stock');
  await setValue(page, 'startLevel', 5);
  await setValue(page, 'sessionMax', 6);
  await setValue(page, 'maxObjects', 2);
  await setValue(page, 'lessonSeedOverride', 86420);

  const payload = await completeSessionAndExport(page, 6);
  expect(payload.generator_version).toBe('1.6.0');
  expect(new Set(payload.trials.map(trial => trial.target_category)).size).toBe(6);
  expect(new Set(payload.trials.map(trial => trial.target_id)).size).toBe(6);
  payload.trials.forEach(trial => {
    const optionIds = trial.option_metadata.map(option => option.id);
    const optionLabels = trial.option_metadata.map(option => option.label.toLowerCase());
    expect(trial.procedural_variant).toBe('category-balanced-discrimination');
    expect(['within-category', 'cross-category']).toContain(trial.discrimination_contrast);
    expect(trial.open_ended_choice).toBe(false);
    expect(trial.scored_response).toBe(true);
    expect(trial.option_metadata).toHaveLength(2);
    expect(optionIds.filter(id => id === trial.target_id)).toHaveLength(1);
    expect(new Set(optionIds).size).toBe(2);
    expect(new Set(optionLabels).size).toBe(2);
    expect(trial.target_source).toBe('stock');
    expect(trial.generator_constraints.procedural_variant).toBe('category-balanced-discrimination');
  });
});

test('Choice preference accepts every configured option and exports an unscored preference response', async ({ page }) => {
  await gotoAlpha(page);
  await setCheckbox(page, 'ttsToggle', false);
  await setCheckbox(page, 'useTwoStage', false);
  await setCheckbox(page, 'useReward', false);
  await setCheckbox(page, 'autoAdvance', true);
  await setCheckbox(page, 'autoLevelPath', false);
  await setValue(page, 'itiSec', 0);
  await setValue(page, 'sessionTaskType', 'choice-preference');
  await setValue(page, 'findObjectSourceMode', 'stock');
  await setValue(page, 'startLevel', 6);
  await setValue(page, 'sessionMax', 4);
  await setValue(page, 'maxObjects', 4);
  await setValue(page, 'lessonSeedOverride', 13579);

  await page.locator('#quickStartSessionBtn').click();
  for(let index = 0; index < 4; index += 1) {
    const nonAnchor = page.locator('#choiceGrid .choice:not([data-role="correct-target"])').first();
    await expect(nonAnchor).toBeVisible();
    await nonAnchor.click();
    if(index < 3) await expect(page.locator('#qIndex')).toHaveText(`${index + 2} / 4`);
  }
  await expect(page.locator('#screenSummary.active')).toBeVisible();
  const payload = await downloadJsonAfter(page, () => page.locator('#summaryExport').click());

  expect(payload.generator_version).toBe('1.6.0');
  expect(new Set(payload.trials.map(trial => trial.target_category)).size).toBe(4);
  payload.trials.forEach(trial => {
    expect(trial.procedural_variant).toBe('category-balanced-preference');
    expect(trial.open_ended_choice).toBe(true);
    expect(trial.scored_response).toBe(false);
    expect(trial.response_type).toBe('preference-selection');
    expect(trial.correct).toBe(true);
    expect(trial.commission).toBe(false);
    expect(trial.distance_to_target_px).toBeNull();
    expect(trial.selected_to_target_distance_px).toBeNull();
    expect(trial.option_metadata.length).toBeGreaterThanOrEqual(2);
    expect(trial.option_metadata.length).toBeLessThanOrEqual(4);
    expect(trial.generator_constraints.open_ended_choice).toBe(true);
    expect(trial.generator_constraints.procedural_variant).toBe('category-balanced-preference');
  });

  await page.locator('#teacherExitHold').focus();
  await page.locator('#teacherExitHold').press('Enter');
  await page.locator('#adminPanelTab').click();
  await page.locator('#adminNavResearch').click();
  await setValue(page, 'researchScopeSelect', 'current-session');
  const selectedLabels = Array.from(new Set(payload.trials.map(trial => trial.selected_label)));
  await expect(page.locator('#researchPreferenceChart')).toBeVisible();
  await expect(page.locator('#researchPreferenceSelections')).toHaveText('4');
  await expect(page.locator('#researchPreferenceDistinct')).toHaveText(String(selectedLabels.length));
  await expect(page.locator('#researchPreferenceBody tr')).toHaveCount(selectedLabels.length);
  for(const label of selectedLabels) await expect(page.locator('#researchPreferenceBody')).toContainText(label);
  const breadthCells = page.locator('#researchContentBreadthBody tr').first().locator('td');
  await expect(breadthCells.nth(4)).toHaveText('0');
  await expect(breadthCells.nth(5)).toHaveText('0');
  await expect(breadthCells.nth(7)).toHaveText('4');
});

test('Research is a separate admin destination with accessible visual equivalents', async ({ page }) => {
  await gotoAlpha(page);
  await page.locator('#adminPanelTab').click();
  await expect(page.locator('#adminNavOverview')).toHaveAttribute('aria-pressed', 'true');
  await expect(page.locator('#adminAnalyticsSection')).toBeHidden();

  await page.locator('#adminNavResearch').click();
  await expect(page.locator('body')).toHaveClass(/admin-page-research/);
  await expect(page.locator('#adminNavResearch')).toHaveAttribute('aria-pressed', 'true');
  await expect(page.locator('#adminAnalyticsSection')).toBeVisible();
  await expect(page.locator('#researchSectionNav')).toBeVisible();
  await expect(page.locator('#researchSectionNav a')).toHaveCount(9);
  await expect(page.locator('#researchCoverageChart')).toHaveAttribute('role', 'img');
  await expect(page.locator('#researchCoverageBody')).toContainText('No sessions');
  await expect(page.locator('#researchTrialQualityChart')).toHaveAttribute('role', 'img');
  await expect(page.locator('#researchDataQualityFinalTrials')).toHaveText('0');
  await expect(page.locator('#researchTrialQualityBody tr')).toHaveCount(9);
  await expect(page.locator('#researchTrialQualityNote')).toContainText('no final trials');
  await expect(page.locator('#researchAccuracyChart')).toHaveAttribute('role', 'img');
  await expect(page.locator('#researchSessionTrendBody')).toContainText('No data');
  await expect(page.locator('#researchSourceNote')).toContainText('Missing values stay missing');
  const chartAudit = await page.locator('#adminAnalyticsSection .researchCanvas').evaluateAll(canvases => canvases.map(canvas => {
    const alternativeIds = String(canvas.getAttribute('aria-describedby') || '').split(/\s+/).filter(Boolean);
    return {
      id: canvas.id,
      role: canvas.getAttribute('role'),
      label: canvas.getAttribute('aria-label'),
      alternativeState: canvas.dataset.accessibleAlternative,
      alternativeIds,
      unresolvedIds: alternativeIds.filter(id => !document.getElementById(id)),
      hasReadableAlternative: alternativeIds.some(id => String(document.getElementById(id)?.textContent || '').trim().length > 0)
    };
  }));
  const researchCanvasCount = await page.locator('#adminAnalyticsSection canvas').count();
  expect(chartAudit.length).toBeGreaterThan(50);
  expect(chartAudit.length).toBe(researchCanvasCount);
  chartAudit.forEach(chart => {
    expect(chart.role, `${chart.id} must expose an image role`).toBe('img');
    expect(chart.label, `${chart.id} must have an accessible label`).toBeTruthy();
    expect(chart.alternativeState, `${chart.id} must link a non-canvas alternative`).toBe('linked');
    expect(chart.alternativeIds.length, `${chart.id} must describe its alternative`).toBeGreaterThan(0);
    expect(chart.unresolvedIds, `${chart.id} has unresolved alternative IDs`).toEqual([]);
    expect(chart.hasReadableAlternative, `${chart.id} alternative must contain readable text`).toBe(true);
  });
  await page.locator('#researchSectionNav a[href="#researchDataQualitySection"]').click();
  await expect(page.locator('#researchDataQualitySection')).toBeVisible();
  expect(await page.evaluate(() => location.hash)).toBe('#researchDataQualitySection');
});

test('Research visualises versioned trial recording completeness without treating repeats as errors', async ({ page }) => {
  await gotoAlpha(page);
  await setCheckbox(page, 'ttsToggle', false);
  await setCheckbox(page, 'useTwoStage', false);
  await setCheckbox(page, 'useReward', false);
  await setCheckbox(page, 'autoAdvance', true);
  await setCheckbox(page, 'autoLevelPath', false);
  await setValue(page, 'sessionTaskType', 'touch-object');
  await setValue(page, 'sessionMax', 1);

  const payload = await completeSessionAndExport(page, 1);
  const quality = payload.research_summary.data_quality;
  expectCoreSchema(quality, DATA_QUALITY_SCHEMA, 'research_summary.data_quality');
  expect(quality).toEqual(expect.objectContaining({
    schema_version: '1.0.0',
    source_trial_count: 1,
    final_trial_count: 1,
    repeated_attempt_count: 0,
    response_time_expected_count: 1,
    response_time_observed_when_expected_count: 1,
    support_status_observed_count: 1,
    generator_provenance_observed_count: 1
  }));

  await page.locator('#teacherExitHold').focus();
  await page.locator('#teacherExitHold').press('Enter');
  await page.locator('#adminPanelTab').click();
  await page.locator('#adminNavResearch').click();
  await setValue(page, 'researchScopeSelect', 'current-session');
  await expect(page.locator('#researchDataQualityFinalTrials')).toHaveText('1');
  await expect(page.locator('#researchDataQualityRepeatedAttempts')).toHaveText('0');
  await expect(page.locator('#researchDataQualityTiming')).toHaveText('100%');
  await expect(page.locator('#researchDataQualitySupport')).toHaveText('100%');
  await expect(page.locator('#researchDataQualityProvenance')).toHaveText('100%');
  await expect(page.locator('#researchTrialQualityBody tr')).toHaveCount(9);
  await expect(page.locator('#researchTrialQualityBody')).toContainText('Generator provenance');
  await expect(page.locator('#researchTrialQualityNote')).toContainText('not automatically treated as errors');
  await expect(page.locator('#heatmapCanvas')).toHaveAttribute('data-normalization', 'per-trial-play-area');
  await expect(page.locator('#heatmapCanvas')).toHaveAttribute('data-source-attempt-count', '1');
  await expect(page.locator('#heatmapCanvas')).toHaveAttribute('data-plotted-touch-count', '1');
  await expect(page.locator('#heatmapCanvas')).toHaveAttribute('data-target-geometry-count', '1');
  await expect(page.locator('#heatmapSummaryBody tr')).toHaveCount(1);
  await expect(page.locator('#heatmapSummaryBody')).toContainText('Touch object');
  await expect(page.locator('#heatmapMeta')).toContainText("each trial's recorded play-area dimensions");

  const researchPayload = await downloadJsonAfter(page, () => page.locator('#exportResearchSummaryBtn').click());
  expectCoreSchema(researchPayload, RESEARCH_SCHEMA, 'research_summary');
  expectCoreSchema(researchPayload.data_quality, DATA_QUALITY_SCHEMA, 'research_summary.data_quality');
  expect(researchPayload.data_quality.final_trial_count).toBe(1);
});

test('Research workspace contains wide data tables on a tablet viewport', async ({ page }) => {
  await page.setViewportSize({ width: 820, height: 1180 });
  await gotoAlpha(page);
  await page.locator('#adminPanelTab').click();
  await page.locator('#adminNavResearch').click();
  const layout = await page.evaluate(() => ({
    viewportWidth: innerWidth,
    documentWidth: document.documentElement.scrollWidth,
    panelWidth: document.querySelector('.panel').getBoundingClientRect().width,
    tableOverflow: getComputedStyle(document.querySelector('.researchTableWrap')).overflowX
  }));
  expect(layout.documentWidth).toBeLessThanOrEqual(layout.viewportWidth);
  expect(layout.panelWidth).toBeLessThanOrEqual(layout.viewportWidth);
  expect(['auto', 'scroll']).toContain(layout.tableOverflow);
});

test('Research visualises future AI dataset composition without performing a model split', async ({ page }) => {
  await gotoAlpha(page);
  await setCheckbox(page, 'ttsToggle', false);
  await setCheckbox(page, 'useTwoStage', false);
  await setCheckbox(page, 'useReward', false);
  await setCheckbox(page, 'autoAdvance', true);
  await setCheckbox(page, 'autoLevelPath', false);
  await setValue(page, 'sessionTaskType', 'touch-object');
  await setValue(page, 'sessionMax', 1);

  await completeSessionAndExport(page, 1);
  await page.locator('#teacherExitHold').focus();
  await page.locator('#teacherExitHold').press('Enter');
  await page.locator('#newPupilName').fill('Pupil B');
  await page.locator('#addPupil').click();
  await setValue(page, 'pupilSelect', 'Pupil B');
  await setValue(page, 'sessionTaskType', 'touch-object');
  await setValue(page, 'sessionMax', 1);
  await completeSessionAndExport(page, 1);

  await page.locator('#teacherExitHold').focus();
  await page.locator('#teacherExitHold').press('Enter');
  await page.locator('#newPupilName').fill('Pupil C');
  await page.locator('#addPupil').click();
  await setValue(page, 'pupilSelect', 'Pupil C');
  await page.locator('#adminPanelTab').click();
  await page.locator('#adminNavResearch').click();
  await page.locator('#saveRecommendationReviewBtn').click();
  await expect(page.locator('#recommendationReviewStatus')).toContainText('approved');
  await setValue(page, 'researchScopeSelect', 'all-learners');
  await page.locator('#refreshResearchBtn').click();

  await expect(page.locator('#researchAiDatasetSection')).toBeVisible();
  await expect(page.locator('#researchAiParticipantCount')).toHaveText('2');
  await expect(page.locator('#researchAiLongitudinalCount')).toHaveText('0');
  await expect(page.locator('#researchAiSkillCount')).toHaveText('1');
  await expect(page.locator('#researchAiConditionCount')).toHaveText('1');
  await expect(page.locator('#researchAiGovernanceCount')).toHaveText('0/2');
  await expect(page.locator('#researchAiParticipantBody tr')).toHaveCount(2);
  await expect(page.locator('#researchAiParticipantBody')).toContainText('Pupil A');
  await expect(page.locator('#researchAiParticipantBody')).toContainText('Pupil B');
  await expect(page.locator('#researchAiParticipantBody')).not.toContainText('Pupil C');
  await expect(page.locator('#researchAiReviewCount')).toHaveText('0');
  await expect(page.locator('#researchAiSkillBody')).toContainText('Select a pictured target');
  await expect(page.locator('#researchAiConditionBody')).toContainText('Training');
  await expect(page.locator('#researchAiDatasetNote')).toContainText('whole learners');
  await expect(page.locator('#researchAiDatasetNote')).toContainText('No model training');
  await expect(page.locator('#researchAiSessionDepthChart')).toHaveAttribute('role', 'img');
  await expect(page.locator('#researchAiSkillBalanceChart')).toHaveAttribute('role', 'img');
  await expect(page.locator('#researchAiOutcomeBalanceChart')).toHaveAttribute('role', 'img');
  await expect(page.locator('#researchAiSupportBalanceChart')).toHaveAttribute('role', 'img');

  const researchPayload = await downloadJsonAfter(page, () => page.locator('#exportResearchSummaryBtn').click());
  expectCoreSchema(researchPayload, RESEARCH_SCHEMA, 'research_summary');
  expect(researchPayload.export_schema_version).toBe('1.7.0');
  expect(researchPayload.model_dataset_composition).toEqual(expect.objectContaining({
    profile_version: '1.0.0',
    participant_count: 2,
    session_count: 2,
    final_trial_count: 2,
    participants_with_three_or_more_sessions: 0,
    governance_eligible_participant_count: 0,
    governance_blocked_participant_count: 2,
    participant_session_depth: {
      one_session: 2,
      two_sessions: 0,
      three_to_four_sessions: 0,
      five_or_more_sessions: 0
    },
    split_policy: {
      participant_separated_split_required: true,
      automatic_split_performed: false,
      random_trial_split_allowed: false
    }
  }));
  expect(researchPayload.model_dataset_composition.skill_rows).toEqual([
    expect.objectContaining({ skill_id: 'access.touch_target', opportunities: 2 })
  ]);
  expect(researchPayload.teacher_decisions).toEqual([]);
  expect(JSON.stringify(researchPayload.model_dataset_composition)).not.toContain('Pupil A');
  expect(JSON.stringify(researchPayload.model_dataset_composition)).not.toContain('Pupil B');
});

test('longitudinal Research session and skill rows reproduce independently from raw exports', async ({ page }) => {
  await gotoAlpha(page);
  await setCheckbox(page, 'ttsToggle', false);
  await setCheckbox(page, 'useTwoStage', false);
  await setCheckbox(page, 'useReward', false);
  await setCheckbox(page, 'autoAdvance', true);
  await setCheckbox(page, 'autoLevelPath', false);
  await setValue(page, 'sessionMax', 2);
  await setValue(page, 'sessionTaskType', 'touch-object');
  const touchPayload = await completeSessionAndExport(page, 2);

  await page.locator('#teacherExitHold').focus();
  await page.locator('#teacherExitHold').press('Enter');
  await setValue(page, 'startLevel', 4);
  await setValue(page, 'sessionTaskType', 'find-object');
  await setValue(page, 'sessionMax', 2);
  const recognitionPayload = await completeSessionAndExport(page, 2);

  await page.locator('#teacherExitHold').focus();
  await page.locator('#teacherExitHold').press('Enter');
  await page.locator('#adminPanelTab').click();
  await page.locator('#adminNavResearch').click();
  await setValue(page, 'researchScopeSelect', 'current-learner');
  await page.locator('#refreshResearchBtn').click();
  const researchPayload = await downloadJsonAfter(page, () => page.locator('#exportResearchSummaryBtn').click());

  const sourcePayloads = [touchPayload, recognitionPayload];
  const expectedSessions = sourcePayloads.map(independentlyDerivedSessionRow);
  expect(researchPayload.session_count).toBe(2);
  expect(researchPayload.final_trial_count).toBe(4);
  expect(researchPayload.session_performance).toHaveLength(2);
  researchPayload.session_performance.forEach((row, index) => {
    expect(row).toEqual(expect.objectContaining(expectedSessions[index]));
  });

  const expectedSkills = independentlyDerivedSkillRows(sourcePayloads);
  const observedSkills = researchPayload.skill_summaries.map(row => {
    const expected = expectedSkills.find(item => item.skill_id === row.skill_id);
    return Object.fromEntries(Object.keys(expected).map(field => [field, row[field]]));
  }).sort((a, b) => a.skill_id.localeCompare(b.skill_id));
  expect(observedSkills).toEqual(expectedSkills);
});

test('Research separates Attention Training families and avoids unsupported slope claims', async ({ page }) => {
  await gotoAlpha(page);
  await setCheckbox(page, 'ttsToggle', false);
  await setCheckbox(page, 'useTwoStage', false);
  await setCheckbox(page, 'useReward', false);
  await setCheckbox(page, 'autoAdvance', true);
  await setCheckbox(page, 'autoLevelPath', false);
  await setValue(page, 'sessionTaskType', 'cpat-selective');
  await setValue(page, 'startLevel', 8);
  await setValue(page, 'sessionMax', 1);

  await completeSessionAndExport(page, 1);
  await page.locator('#teacherExitHold').focus();
  await page.locator('#teacherExitHold').press('Enter');
  await page.locator('#adminPanelTab').click();
  await page.locator('#adminNavResearch').click();
  await setValue(page, 'researchScopeSelect', 'current-learner');

  await expect(page.locator('#researchAttentionFamilyChart')).toBeVisible();
  await expect(page.locator('#researchAttentionTrendChart')).toBeVisible();
  await expect(page.locator('#researchAttentionFamilyBody tr')).toHaveCount(1);
  await expect(page.locator('#researchAttentionFamilyBody')).toContainText('AT selective');
  await expect(page.locator('#researchAttentionFamilyBody')).toContainText('100%');
  await expect(page.locator('#researchAttentionFamilyBody')).toContainText('Need 3 sessions');
  await expect(page.locator('#researchAttentionFamilyNote')).toContainText('do not establish transfer');
  await expect(page.locator('#researchTaskVariantChart')).toBeVisible();
  await expect(page.locator('#researchTaskVariantBody tr')).toHaveCount(1);
  await expect(page.locator('#researchTaskVariantBody')).toContainText('AT selective');
  await expect(page.locator('#researchTaskVariantBody')).toContainText('Training condition');
  await expect(page.locator('#researchCoverageBody tr')).toHaveCount(1);
  await expect(page.locator('#researchCoverageBody')).toContainText('Not expected');
  await expect(page.locator('#researchCoverageNote')).toContainText('EEG/protocol is not expected');

  await setValue(page, 'researchScopeSelect', 'all-learners');
  await expect(page.locator('#researchAttentionFamilyBody')).toContainText('Use learner scope');
});

test('Research visualises error, timing-consistency, and touch trends with observed-value counts', async ({ page }) => {
  await gotoAlpha(page);
  await setCheckbox(page, 'ttsToggle', false);
  await setCheckbox(page, 'useTwoStage', false);
  await setCheckbox(page, 'useReward', false);
  await setCheckbox(page, 'autoAdvance', true);
  await setValue(page, 'startLevel', 4);
  await setValue(page, 'sessionMax', 3);

  await completeSessionAndExport(page, 3);
  await page.locator('#teacherExitHold').focus();
  await page.locator('#teacherExitHold').press('Enter');
  await page.locator('#adminPanelTab').click();
  await page.locator('#adminNavResearch').click();
  await setValue(page, 'researchScopeSelect', 'current-learner');

  await expect(page.locator('#researchErrorRateChart')).toBeVisible();
  await expect(page.locator('#researchRtVariabilityChart')).toBeVisible();
  await expect(page.locator('#researchTouchDistanceChart')).toBeVisible();
  await expect(page.locator('#researchBehaviourBody tr')).toHaveCount(1);
  await expect(page.locator('#researchBehaviourBody')).toContainText('3/3');
  await expect(page.locator('#researchBehaviourBody')).toContainText('0%');
  await expect(page.locator('#researchBehaviourBody')).toContainText('ms');
  await expect(page.locator('#researchBehaviourBody')).toContainText('px');
  await expect(page.locator('#researchBehaviourNote')).toContainText('device setup');
  await expect(page.locator('#researchCompletionChart')).toBeVisible();
  await expect(page.locator('#researchSessionDurationChart')).toBeVisible();
  await expect(page.locator('#researchCompletedSessions')).toHaveText('1');
  await expect(page.locator('#researchStoppedSessions')).toHaveText('0');
  await expect(page.locator('#researchTimeLimitSessions')).toHaveText('0');
  await expect(page.locator('#researchTimingCoverage')).toHaveText('1/1');
  await expect(page.locator('#researchSessionTimingBody tr')).toHaveCount(1);
  await expect(page.locator('#researchSessionTimingBody')).toContainText('completed');
  await expect(page.locator('#researchSessionTimingBody')).toContainText('planned questions complete');
  await expect(page.locator('#researchSessionTimingBody')).toContainText('3/3');
  await expect(page.locator('#researchSessionTimingBody')).toContainText('100%');
  await expect(page.locator('#researchSessionTimingNote')).toContainText('not a speed target');
  await expect(page.locator('#researchChoiceDemandChart')).toBeVisible();
  await expect(page.locator('#researchTargetDemandChart')).toBeVisible();
  await expect(page.locator('#researchDistractorExposure')).toHaveText('3');
  await expect(page.locator('#researchMovingExposure')).toHaveText('0');
  await expect(page.locator('#researchDemandCoverage')).toHaveText('1/1');
  await expect(page.locator('#researchDemandBody tr')).toHaveCount(1);
  await expect(page.locator('#researchDemandBody')).toContainText('px');
  await expect(page.locator('#researchDemandBody')).toContainText('6s');
  await expect(page.locator('#researchDemandNote')).toContainText('device and layout');
  await expect(page.locator('#researchTouchBandChart')).toBeVisible();
  await expect(page.locator('#researchTouchDirectionChart')).toBeVisible();
  await expect(page.locator('#researchTouchSpatialBody tr')).toHaveCount(1);
  const spatialCells = page.locator('#researchTouchSpatialBody tr').first().locator('td');
  await expect(spatialCells.nth(2)).toHaveText('3/3');
  await expect(spatialCells.nth(3)).toHaveText('3');
  await expect(spatialCells.nth(12)).toContainText('radii');
  await expect(page.locator('#researchTouchSpatialNote')).toContainText('not a motor');

  const researchDownloadPromise = page.waitForEvent('download');
  await page.locator('#exportResearchSummaryBtn').click();
  const researchDownload = await researchDownloadPromise;
  expect(researchDownload.suggestedFilename()).toMatch(/^ChoiceTrain_Research_.+_summary\.json$/);
  const researchPayload = JSON.parse(fs.readFileSync(await researchDownload.path(), 'utf8'));
  expect(researchPayload.export_schema_version).toBe('1.7.0');
  expect(researchPayload.scope).toBe('current-learner');
  expect(researchPayload.session_count).toBe(1);
  expect(researchPayload.final_trial_count).toBe(3);
  expect(researchPayload.session_timing).toHaveLength(1);
  expect(researchPayload.session_demands).toHaveLength(1);
  expect(researchPayload.session_demands[0]).toEqual(expect.objectContaining({
    trials: 3,
    distractor_trials: 3,
    moving_target_trials: 0,
    demand_observed: true
  }));
  expect(researchPayload.skill_summaries.length).toBeGreaterThan(0);
  expect(researchPayload.privacy_manifest).toEqual(expect.objectContaining({
    local_download_only: true,
    external_transmission: false,
    raw_trials_included: false,
    raw_events_included: false,
    raw_touch_coordinates_included: false,
    image_data_included: false,
    free_text_notes_included: false
  }));
  expect(researchPayload).not.toHaveProperty('trials');
  expect(researchPayload).not.toHaveProperty('events');

  await setValue(page, 'researchScopeSelect', 'all-learners');
  await expect(page.locator('#researchBehaviourNote')).toContainText('not connected');
  await expect(page.locator('#researchSessionTimingNote')).toContainText('not connected');
  await expect(page.locator('#researchDemandNote')).toContainText('not connected');

  await page.reload();
  await expect(page.locator('#beginFlow')).toBeVisible();
  await page.locator('#adminPanelTab').click();
  await page.locator('#adminNavResearch').click();
  await setValue(page, 'researchScopeSelect', 'current-learner');
  await expect(page.locator('#researchSessionTimingBody')).toContainText('planned questions complete');
  await expect(page.locator('#researchTimingCoverage')).toHaveText('1/1');
});

test('a learner stop before the first response persists as an incomplete session observation', async ({ page }) => {
  await gotoAlpha(page);
  await setCheckbox(page, 'ttsToggle', false);
  await setCheckbox(page, 'allowLearnerStop', true);
  await setValue(page, 'sessionMax', 3);

  await page.locator('#quickStartSessionBtn').click();
  await expect(page.locator('#choiceGrid')).toBeVisible();
  await expect(page.locator('#learnerStopBtn')).toBeVisible();
  await page.locator('#learnerStopBtn').click();
  await expect(page.locator('#screenSummary.active')).toBeVisible();
  await page.waitForTimeout(400);

  await page.reload();
  await expect(page.locator('#beginFlow')).toBeVisible();
  await page.locator('#teacherExitHold').focus();
  await page.locator('#teacherExitHold').press('Enter');
  await page.locator('#adminPanelTab').click();
  await page.locator('#adminNavResearch').click();
  await setValue(page, 'researchScopeSelect', 'current-learner');

  await expect(page.locator('#researchSessionCount')).toHaveText('1');
  await expect(page.locator('#researchTrialCount')).toHaveText('0');
  await expect(page.locator('#researchStoppedSessions')).toHaveText('1');
  await expect(page.locator('#researchSessionTimingBody')).toContainText('stopped early');
  await expect(page.locator('#researchSessionTimingBody')).toContainText('learner stop');
  await expect(page.locator('#researchSessionTimingBody')).toContainText('0/3');
  await expect(page.locator('#researchSessionTimingBody')).toContainText('0%');
});

test('Research visualises support fading, dosage, and teacher-rated transfer observations', async ({ page }) => {
  await gotoAlpha(page);
  await setCheckbox(page, 'ttsToggle', false);
  await setCheckbox(page, 'useTwoStage', false);
  await setCheckbox(page, 'useReward', false);
  await setCheckbox(page, 'autoAdvance', true);
  await setValue(page, 'startLevel', 4);
  await setValue(page, 'sessionMax', 2);
  await setValue(page, 'teacherAttentionRating', 4);
  await setValue(page, 'teacherIndependenceRating', 2);
  await setValue(page, 'maintenanceStatus', 'maintained');
  await setValue(page, 'generalisationStatus', 'generalised');
  await setValue(page, 'fatigueLevel', 'fatigued');
  await setValue(page, 'sensoryState', 'seeking');
  await setValue(page, 'sleepQuality', 'poor');
  await setValue(page, 'communicationMode', 'aac');
  await setValue(page, 'motorAccessMode', 'supported-touch');
  await setValue(page, 'aacPreference', 'low-tech');
  await setValue(page, 'communicationSupportChoice', 'image-first');
  await setValue(page, 'themeChoice', 'soft-green');
  await setValue(page, 'fontChoice', 'familiar');
  await setValue(page, 'textScale', 1.15);
  await setValue(page, 'motionPreference', 'reduced');
  await setValue(page, 'feedbackSoundMode', 'off');
  await setValue(page, 'maxObjects', 3);
  await setValue(page, 'responseWindowSec', 14);
  await setValue(page, 'breakCount', 2);
  await setValue(page, 'dosageMinutesTarget', 12);
  await setCheckbox(page, 'fidelityEnvironmentReady', true);
  await setCheckbox(page, 'fidelityRuleShown', true);
  await setCheckbox(page, 'fidelityPromptPlan', true);

  await completeSessionAndExport(page, 2);
  await page.locator('#teacherExitHold').focus();
  await page.locator('#teacherExitHold').press('Enter');
  await page.locator('#adminPanelTab').click();
  await page.locator('#adminNavResearch').click();
  await setValue(page, 'researchScopeSelect', 'current-learner');

  await expect(page.locator('#researchSupportTrendChart')).toBeVisible();
  await expect(page.locator('#researchDosageChart')).toBeVisible();
  await expect(page.locator('#researchCumulativeDoseChart')).toBeVisible();
  await expect(page.locator('#researchSessionGapChart')).toBeVisible();
  await expect(page.locator('#researchCadenceBody tr')).toHaveCount(1);
  await expect(page.locator('#researchActiveDays')).toHaveText('1');
  await expect(page.locator('#researchDoseCoverage')).toHaveText('1/1');
  await expect(page.locator('#researchCumulativeDose')).toContainText('min');
  await expect(page.locator('#researchTeacherRatingChart')).toBeVisible();
  await expect(page.locator('#researchTransferStatusChart')).toBeVisible();
  await expect(page.locator('#researchSupportTrendBody tr')).toHaveCount(1);
  await expect(page.locator('#researchSupportTrendBody')).toContainText('100%');
  await expect(page.locator('#researchSupportTrendBody')).toContainText('12 min');
  await expect(page.locator('#researchSupportTrendBody')).toContainText('50%');
  await expect(page.locator('#researchTransferBody tr')).toHaveCount(1);
  await expect(page.locator('#researchTransferBody')).toContainText('4/5');
  await expect(page.locator('#researchTransferBody')).toContainText('2/5');
  await expect(page.locator('#researchTransferBody')).toContainText('maintained');
  await expect(page.locator('#researchTransferBody')).toContainText('generalised');
  await expect(page.locator('#researchReadinessChart')).toBeVisible();
  await expect(page.locator('#researchSensoryStateChart')).toBeVisible();
  await expect(page.locator('#researchContextBody tr')).toHaveCount(1);
  await expect(page.locator('#researchContextBody')).toContainText('fatigued');
  await expect(page.locator('#researchContextBody')).toContainText('seeking');
  await expect(page.locator('#researchContextBody')).toContainText('poor');
  await expect(page.locator('#researchContextBody')).toContainText('2');
  await expect(page.locator('#researchAccessContextChart')).toBeVisible();
  await expect(page.locator('#researchPresentationContextChart')).toBeVisible();
  await expect(page.locator('#researchAccessContextBody tr')).toHaveCount(1);
  await expect(page.locator('#researchAccessContextBody')).toContainText('aac');
  await expect(page.locator('#researchAccessContextBody')).toContainText('supported touch');
  await expect(page.locator('#researchAccessContextBody')).toContainText('low tech');
  await expect(page.locator('#researchAccessContextBody')).toContainText('image first');
  await expect(page.locator('#researchAccessContextBody')).toContainText('Soft Green');
  await expect(page.locator('#researchAccessContextBody')).toContainText('115%');
  await expect(page.locator('#researchAccessContextBody')).toContainText('14s');
  await expect(page.locator('#researchAccessContextNote')).toContainText('do not explain');

  await setValue(page, 'researchScopeSelect', 'all-learners');
  await expect(page.locator('#researchSupportTrendNote')).toContainText('unconnected points');
  await expect(page.locator('#researchTransferNote')).toContainText('not connected');

  await page.reload();
  await expect(page.locator('#beginFlow')).toBeVisible();
  await expect(page.locator('#teacherAttentionRating')).toHaveValue('4');
  await expect(page.locator('#teacherIndependenceRating')).toHaveValue('2');
  await expect(page.locator('#communicationMode')).toHaveValue('aac');
  await expect(page.locator('#motorAccessMode')).toHaveValue('supported-touch');
  await expect(page.locator('#aacPreference')).toHaveValue('low-tech');
});

test('Research visualises prompt-ladder use and learner-agency events without deficit labels', async ({ page }) => {
  await gotoAlpha(page);
  await setCheckbox(page, 'ttsToggle', false);
  await setCheckbox(page, 'useTwoStage', false);
  await setCheckbox(page, 'useReward', true);
  await setCheckbox(page, 'autoAdvance', false);
  await setValue(page, 'startLevel', 4);
  await setValue(page, 'sessionMax', 1);

  await page.locator('#quickStartSessionBtn').click();
  await expect(page.locator('#choiceGrid [data-role="correct-target"]').first()).toBeVisible();
  await page.locator('#learnerHelpBtn').click();
  await page.locator('#learnerBreakBtn').click();
  await expect(page.locator('#screenBreak.active')).toBeVisible();
  await page.locator('#continueFromBreak').click();

  let target = page.locator('#choiceGrid [data-role="correct-target"]').first();
  await expect(target).toBeVisible();
  await page.locator('#learnerHelpBtn').click();
  await target.click();
  await expect(page.locator('#screenReward.active')).toBeVisible();
  await page.locator('#rewardRepeat').click();

  target = page.locator('#choiceGrid [data-role="correct-target"]').first();
  await expect(target).toBeVisible();
  await page.locator('#learnerHelpBtn').click();
  await target.click();
  await expect(page.locator('#screenReward.active')).toBeVisible();
  await page.locator('#rewardNext').click();
  await expect(page.locator('#screenSummary.active')).toBeVisible();

  const payload = await downloadJsonAfter(page, () => page.locator('#summaryExport').click());
  expect(payload.events.filter(event => event.type === 'help_requested')).toHaveLength(3);
  expect(payload.events.filter(event => event.type === 'question_repeat')).toHaveLength(1);
  expect(payload.events.filter(event => event.type === 'break_onset' && event.reason === 'learner-break')).toHaveLength(1);

  await page.locator('#teacherExitHold').focus();
  await page.locator('#teacherExitHold').press('Enter');
  await page.locator('#adminPanelTab').click();
  await page.locator('#adminNavResearch').click();

  await expect(page.locator('#researchPromptLevelChart')).toBeVisible();
  await expect(page.locator('#researchAgencyEventChart')).toBeVisible();
  await expect(page.locator('#researchPromptLevelBody')).toContainText('P1');
  await expect(page.locator('#researchPromptLevelBody')).toContainText('Cue only');
  const agencyCells = page.locator('#researchAgencyEventBody tr').first().locator('td');
  await expect(agencyCells.nth(2)).toHaveText('3');
  await expect(agencyCells.nth(3)).toHaveText('3');
  await expect(agencyCells.nth(4)).toHaveText('1');
  await expect(agencyCells.nth(5)).toHaveText('1');
  await expect(agencyCells.nth(8)).toHaveText('2');
  await expect(page.locator('#researchAgencyEventNote')).toContainText('communication and regulation observations');
});

test('teacher-reviewed recommendations persist locally and export an audit record', async ({ page }) => {
  await gotoAlpha(page);
  await setCheckbox(page, 'ttsToggle', false);
  await setCheckbox(page, 'useTwoStage', false);
  await setCheckbox(page, 'useReward', false);
  await setCheckbox(page, 'autoAdvance', true);
  await setValue(page, 'startLevel', 4);
  await setValue(page, 'sessionMax', 1);

  await page.locator('#quickStartSessionBtn').click();
  await page.locator('#choiceGrid [data-role="correct-target"]').first().click();
  await expect(page.locator('#screenSummary.active')).toBeVisible();
  await downloadJsonAfter(page, () => page.locator('#summaryExport').click());
  await page.locator('#teacherExitHold').focus();
  await page.locator('#teacherExitHold').press('Enter');
  await page.locator('#adminPanelTab').click();
  await page.locator('#adminNavResearch').click();

  await expect(page.locator('#researchPracticeBody')).toContainText('More observations needed');
  await expect(page.locator('#researchRecommendationSummary')).toContainText('Continue focused practice');
  await setValue(page, 'recommendationDecision', 'adjusted');
  await setValue(page, 'recommendationOverrideTask', 'find-category');
  await setValue(page, 'recommendationOverrideLevel', 5);
  await page.locator('#recommendationReviewNote').fill('Use familiar animal photos and review after two short sessions.');
  await page.locator('#saveRecommendationReviewBtn').click();

  await expect(page.locator('#recommendationReviewStatus')).toContainText('adjusted');
  await expect(page.locator('#researchRecommendationBody')).toContainText('Find category');
  await expect(page.locator('#researchRecommendationBody')).toContainText('Use familiar animal photos');

  await page.reload();
  await expect(page.locator('#beginFlow')).toBeVisible();
  await page.locator('#teacherExitHold').focus();
  await page.locator('#teacherExitHold').press('Enter');
  await page.locator('#adminPanelTab').click();
  await page.locator('#adminNavResearch').click();
  await page.locator('#refreshResearchBtn').click();
  await expect(page.locator('#researchRecommendationBody')).toContainText('Use familiar animal photos');

  const payload = await downloadJsonAfter(page, () => page.locator('#adminExportSessionBtn').evaluate(node => node.click()));
  const review = payload.learner_profile.reviews.at(-1);
  expect(review).toEqual(expect.objectContaining({
    decision: 'adjusted',
    note: 'Use familiar animal photos and review after two short sessions.'
  }));
  expect(review.final_plan).toEqual(expect.objectContaining({ task_kind: 'find-category', level: 5 }));
  expect(payload.practice_status_version).toBe('1.0.0');
  expect(payload.recommendation_version).toBe('1.0.0');
  expect(payload.local_recommendation_summary.external_transmission).toBe(false);
});

test('current-learner research does not merge pupils that share an export alias', async ({ page }) => {
  await gotoAlpha(page);
  await setCheckbox(page, 'ttsToggle', false);
  await setCheckbox(page, 'useTwoStage', false);
  await setCheckbox(page, 'useReward', false);
  await setCheckbox(page, 'autoAdvance', true);
  await setValue(page, 'startLevel', 4);
  await setValue(page, 'sessionMax', 1);
  await setValue(page, 'pupilAlias', 'Shared Alias');

  await page.locator('#quickStartSessionBtn').click();
  await page.locator('#choiceGrid [data-role="correct-target"]').first().click();
  await expect(page.locator('#screenSummary.active')).toBeVisible();
  await downloadJsonAfter(page, () => page.locator('#summaryExport').click());
  await page.locator('#teacherExitHold').focus();
  await page.locator('#teacherExitHold').press('Enter');

  await page.locator('#newPupilName').fill('Pupil B');
  await page.locator('#addPupil').click();
  await expect(page.locator('#pupilSelect')).toHaveValue('Pupil B');
  await setValue(page, 'pupilAlias', 'Shared Alias');
  await page.locator('#quickStartSessionBtn').click();
  await page.locator('#choiceGrid [data-role="correct-target"]').first().click();
  await expect(page.locator('#screenSummary.active')).toBeVisible();
  await downloadJsonAfter(page, () => page.locator('#summaryExport').click());
  await page.locator('#teacherExitHold').focus();
  await page.locator('#teacherExitHold').press('Enter');

  await setValue(page, 'pupilSelect', 'Pupil A');
  await page.locator('#adminPanelTab').click();
  await page.locator('#adminNavResearch').click();
  await page.locator('#refreshResearchBtn').click();
  await expect(page.locator('#researchSessionCount')).toHaveText('1');
  await expect(page.locator('#researchTrialCount')).toHaveText('1');

  const payload = await downloadJsonAfter(page, () => page.locator('#adminExportSessionBtn').evaluate(node => node.click()));
  expect(payload.pupil).toBe('Pupil B');
  expect(payload.learner_profile.name).toBe('Pupil B');
  expect(payload.trials.every(trial => trial.learner === 'Pupil B')).toBe(true);
});

test('Research labels a spaced follow-up as an observed retention comparison', async ({ page }) => {
  await gotoAlpha(page);
  await setCheckbox(page, 'ttsToggle', false);
  await setCheckbox(page, 'useTwoStage', false);
  await setCheckbox(page, 'useReward', false);
  await setCheckbox(page, 'autoAdvance', true);
  await setCheckbox(page, 'autoLevelPath', false);
  await setValue(page, 'sessionTaskType', 'find-object');
  await setValue(page, 'startLevel', 4);
  await setValue(page, 'sessionMax', 3);

  async function completeThreeQuestions(){
    for(let index = 0; index < 3; index += 1){
      const target = page.locator('#choiceGrid [data-role="correct-target"]').first();
      await expect(target).toBeVisible();
      await target.click();
      if(index < 2) await expect(page.locator('#qIndex')).toHaveText(`${index + 2} / 3`);
    }
    await expect(page.locator('#screenSummary.active')).toBeVisible();
  }

  await page.locator('#quickStartSessionBtn').click();
  await completeThreeQuestions();
  const first = await downloadJsonAfter(page, () => page.locator('#summaryExport').click());
  await page.evaluate(async sessionId => {
    const database = await new Promise((resolve, reject) => {
      const request = indexedDB.open('choice_train_runtime_v2');
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
    const record = await new Promise((resolve, reject) => {
      const transaction = database.transaction('sessions', 'readonly');
      const request = transaction.objectStore('sessions').get(sessionId);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
    const offset = 8 * 24 * 60 * 60 * 1000;
    record.updated_at_wall_ms -= offset;
    record.trials.forEach(trial => {
      ['cue_onset_wall_ms', 'stimulus_onset_wall_ms', 'response_wall_ms', 'feedback_onset_wall_ms'].forEach(field => {
        if(Number.isFinite(trial[field])) trial[field] -= offset;
      });
    });
    await new Promise((resolve, reject) => {
      const transaction = database.transaction('sessions', 'readwrite');
      transaction.objectStore('sessions').put(record);
      transaction.oncomplete = resolve;
      transaction.onerror = () => reject(transaction.error);
    });
    database.close();
  }, first.session_id);

  await page.locator('#summaryRestart').click();
  await completeThreeQuestions();
  await downloadJsonAfter(page, () => page.locator('#summaryExport').click());
  await page.locator('#teacherExitHold').focus();
  await page.locator('#teacherExitHold').press('Enter');
  await page.locator('#adminPanelTab').click();
  await page.locator('#adminNavResearch').click();
  await page.locator('#refreshResearchBtn').click();

  await expect(page.locator('#researchPracticeBody')).toContainText('Similar at spaced observation');
  await expect(page.locator('#researchPracticeBody')).toContainText('8d gap');
  await expect(page.locator('#researchPracticeBody')).not.toContainText('mastery');
  await expect(page.locator('#researchCadenceBody tr')).toHaveCount(2);
  await expect(page.locator('#researchMedianSessionGap')).toHaveText('8 days');
  await expect(page.locator('#researchCadenceBody')).toContainText('8 days');
});

test('Research view keeps same-numbered questions from separate sessions distinct', async ({ page }) => {
  const errors = trackErrors(page);
  await gotoAlpha(page);
  await setCheckbox(page, 'ttsToggle', false);
  await setCheckbox(page, 'useTwoStage', false);
  await setCheckbox(page, 'useReward', false);
  await setCheckbox(page, 'autoAdvance', true);
  await setCheckbox(page, 'studentFriendlyMode', false);
  await setValue(page, 'startLevel', 4);
  await setValue(page, 'sessionMax', 1);

  await page.locator('#quickStartSessionBtn').click();
  await page.locator('#choiceGrid [data-role="correct-target"]').first().click();
  await expect(page.locator('#screenSummary.active')).toBeVisible();
  await downloadJsonAfter(page, () => page.locator('#summaryExport').click());

  await page.locator('#summaryRestart').click();
  await page.locator('#choiceGrid [data-role="correct-target"]').first().click();
  await expect(page.locator('#screenSummary.active')).toBeVisible();
  await downloadJsonAfter(page, () => page.locator('#summaryExport').click());

  await page.locator('#teacherExitHold').focus();
  await page.locator('#teacherExitHold').press('Enter');
  await page.locator('#adminPanelTab').click();
  await page.locator('#adminNavResearch').click();
  await expect(page.locator('#researchSessionCount')).toHaveText('2');
  await expect(page.locator('#researchTrialCount')).toHaveText('2');
  await expect(page.locator('#researchSessionTrendBody tr')).toHaveCount(2);
  await expect(page.locator('#researchSkillBody')).toContainText('Find a named object');
  await expect(page.locator('#researchQualityBody tr')).toHaveCount(2);
  expect(errors, errors.join('\n')).toEqual([]);
});

test('EEG protocol metadata and browser timing diagnostics are exported and visualised', async ({ page }) => {
  await gotoAlpha(page);
  await setCheckbox(page, 'ttsToggle', false);
  await setCheckbox(page, 'useTwoStage', false);
  await setCheckbox(page, 'useReward', false);
  await setCheckbox(page, 'autoAdvance', true);
  await setCheckbox(page, 'eegResearchMode', true);
  await setValue(page, 'studyProtocolId', 'CT-PILOT-01');
  await setValue(page, 'studyVisitId', 'baseline');
  await setValue(page, 'studyRunNumber', 2);
  await setValue(page, 'eegAcquisitionSystem', 'Test amplifier');
  await setValue(page, 'eegSyncMethod', 'lsl-bridge');
  await setValue(page, 'startLevel', 4);
  await setValue(page, 'sessionMax', 1);

  await page.locator('#quickStartSessionBtn').click();
  await page.locator('#artifactMovementBtn').evaluate(node => node.click());
  await page.locator('#artifactSpeechBtn').evaluate(node => node.click());
  await page.locator('#choiceGrid [data-role="correct-target"]').first().click();
  await expect(page.locator('#screenSummary.active')).toBeVisible();
  const payload = await downloadJsonAfter(page, () => page.locator('#summaryExport').click());

  expect(payload.study_protocol).toEqual(expect.objectContaining({
    protocol_schema_version: '1.1.0',
    study_protocol_id: 'CT-PILOT-01',
    visit_id: 'baseline',
    run_number: 2,
    acquisition_system: 'Test amplifier',
    declared_sync_method: 'lsl-bridge',
    hardware_synchronization_verified: false
  }));
  expect(payload.study_protocol.participant_pseudonym).toMatch(/^ctp-/);
  expect(payload.eeg_markers.every(marker => marker.study_protocol_id === 'CT-PILOT-01')).toBe(true);
  expect(payload.eeg_marker_diagnostics).toEqual(expect.objectContaining({
    ordered_trials: 1,
    expected_order_trials: 1,
    ordering_pct: 100,
    timing_difference_count: 0,
    protocol_fields_complete: 5,
    protocol_fields_expected: 5,
    protocol_completeness_pct: 100,
    hardware_synchronization_verified: false
  }));
  expect(payload.block_summaries[0]).toEqual(expect.objectContaining({
    artifact_count: 2,
    artifact_counts: expect.objectContaining({ movement: 1, speech: 1 }),
    quality_score: 83
  }));

  await page.locator('#teacherExitHold').focus();
  await page.locator('#teacherExitHold').press('Enter');
  await page.locator('#adminPanelTab').click();
  await page.locator('#adminNavResearch').click();
  await page.locator('#refreshResearchBtn').click();
  await expect(page.locator('#researchMarkerOrdering')).toHaveText('100%');
  await expect(page.locator('#researchProtocolCompleteness')).toHaveText('100%');
  await expect(page.locator('#researchQualityBody')).toContainText('1/1');
  await expect(page.locator('#researchQualityBody')).toContainText('0/1');
  await expect(page.locator('#researchQualityBody')).toContainText('5/5');
  await expect(page.locator('#researchQualityBody')).toContainText('lsl-bridge');
  await expect(page.locator('#researchQualityBody')).toContainText('83%');
  await expect(page.locator('#researchEegQualityTrendChart')).toBeVisible();
  await expect(page.locator('#researchBlockQualityTrendChart')).toBeVisible();
  await expect(page.locator('#researchArtifactTypeChart')).toBeVisible();
  await expect(page.locator('#researchArtifactTypeBody tr')).toHaveCount(2);
  await expect(page.locator('#researchArtifactTypeBody')).toContainText('Movement');
  await expect(page.locator('#researchArtifactTypeBody')).toContainText('Speech');
  await expect(page.locator('#researchEegQualityNote')).toContainText('logging heuristic');
  await expect(page.locator('#researchCoverageBody tr').first().locator('td').nth(6)).toContainText('%');
  await expect(page.locator('#researchCoverageBody tr').first().locator('td').nth(6)).not.toContainText('Not expected');
  await expect(page.locator('#researchCoverageNote')).toContainText('EEG/protocol coverage applies to 1 session');

  await setValue(page, 'researchScopeSelect', 'all-learners');
  await expect(page.locator('#researchEegQualityNote')).toContainText('unconnected points');
});

test('fixed research conditions persist, block drift, reapply, export, and visualise adherence', async ({ page }) => {
  const errors = trackErrors(page);
  await gotoAlpha(page);
  await setCheckbox(page, 'ttsToggle', false);
  await setCheckbox(page, 'useTwoStage', false);
  await setCheckbox(page, 'useReward', false);
  await setCheckbox(page, 'autoAdvance', true);
  await setCheckbox(page, 'autoLevelPath', false);
  await setCheckbox(page, 'eegResearchMode', true);
  await setValue(page, 'sessionTaskType', 'find-object');
  await setValue(page, 'startLevel', 4);
  await setValue(page, 'sessionMax', 1);
  await setValue(page, 'maxObjects', 4);
  await setValue(page, 'lessonSeedOverride', 314159);
  await setValue(page, 'protocolConditionId', 'CT-PILOT-TRAIN-A');
  await setCheckbox(page, 'fixedConditionEnabled', true);
  await page.locator('#adminPanelTab').click();
  await page.locator('#adminNavEeg').click();
  await expect(page.locator('#saveFixedConditionBtn')).toBeVisible();
  await page.locator('#saveFixedConditionBtn').click();
  await expect(page.locator('#fixedConditionStatus')).toContainText('is ready');
  await page.waitForTimeout(250);

  await page.reload();
  await page.locator('#adminPanelTab').click();
  await page.locator('#adminNavEeg').click();
  await expect(page.locator('#fixedConditionEnabled')).toBeChecked();
  await expect(page.locator('#protocolConditionId')).toHaveValue('CT-PILOT-TRAIN-A');
  await expect(page.locator('#fixedConditionStatus')).toContainText('is ready');

  await setValue(page, 'maxObjects', 3);
  await expect(page.locator('#fixedConditionStatus')).toContainText('max_answer_options');
  await page.locator('#teacherPanelTab').click();
  await page.locator('#quickStartSessionBtn').click();
  await expect(page.locator('body')).toHaveClass(/panel-view-admin/);
  await expect(page.locator('#fixedConditionStatus')).toContainText('max_answer_options');

  await page.locator('#applyFixedConditionBtn').click();
  await expect(page.locator('#maxObjects')).toHaveValue('4');
  await expect(page.locator('#fixedConditionStatus')).toContainText('is ready');
  await page.locator('#teacherPanelTab').click();
  await page.locator('#quickStartSessionBtn').click();
  await page.locator('#choiceGrid [data-role="correct-target"]').first().click();
  await expect(page.locator('#screenSummary.active')).toBeVisible();
  const payload = await downloadJsonAfter(page, () => page.locator('#summaryExport').click());

  expect(payload.protocol_condition_id).toBe('CT-PILOT-TRAIN-A');
  expect(payload.fixed_condition).toEqual(expect.objectContaining({
    schema_version: '1.0.0',
    enabled: true,
    protocol_condition_id: 'CT-PILOT-TRAIN-A',
    adherence_status: 'adherent'
  }));
  expect(payload.fixed_condition.settings_fingerprint).toMatch(/^[0-9a-f]{8}$/);
  expect(payload.fixed_condition.manifest.settings).toEqual(expect.objectContaining({
    task_type: 'find-object',
    max_answer_options: 4,
    lesson_replay_seed: 314159,
    speech_prompts: false,
    target_scale_percent: 100,
    automatic_touch_scaling: true,
    student_friendly_mode: true
  }));
  expect(payload.lesson_seed).toBe(314159);
  expect(payload.eeg_markers.every(marker => marker.protocol_condition_id === 'CT-PILOT-TRAIN-A')).toBe(true);

  await page.locator('#teacherExitHold').focus();
  await page.locator('#teacherExitHold').press('Enter');
  await page.locator('#adminPanelTab').click();
  await page.locator('#adminNavResearch').click();
  await page.locator('#refreshResearchBtn').click();
  await expect(page.locator('#researchFixedConditionSessions')).toHaveText('1');
  await expect(page.locator('#researchFixedConditionAdherent')).toHaveText('1');
  await expect(page.locator('#researchFixedConditionExceptions')).toHaveText('0');
  await expect(page.locator('#researchFixedConditionBody')).toContainText('CT-PILOT-TRAIN-A');
  await expect(page.locator('#researchFixedConditionBody')).toContainText('adherent');
  expect(errors, errors.join('\n')).toEqual([]);
});

test('model-development export is denied by default without a recorded authority declaration', async ({ page }) => {
  await gotoAlpha(page);
  await setCheckbox(page, 'ttsToggle', false);
  await setCheckbox(page, 'useTwoStage', false);
  await setCheckbox(page, 'useReward', false);
  await setCheckbox(page, 'autoAdvance', true);
  await setValue(page, 'startLevel', 4);
  await setValue(page, 'sessionMax', 1);

  await completeSessionAndExport(page, 1);
  await page.locator('#teacherExitHold').focus();
  await page.locator('#teacherExitHold').press('Enter');
  await page.locator('#adminPanelTab').click();
  await page.locator('#adminNavResearch').click();

  let downloadCount = 0;
  page.on('download', () => { downloadCount += 1; });
  await page.locator('#adminExportAiDatasetBtn').evaluate(node => node.click());
  await page.waitForTimeout(250);
  expect(downloadCount).toBe(0);
  await expect(page.locator('#aiExportGovernanceStatus')).toContainText('blocked');
  await expect(page.locator('#aiExportGovernanceStatus')).toContainText('1 of 1');

  await setValue(page, 'dataUseStatus', 'withdrawn');
  await setCheckbox(page, 'modelDevelopmentApproved', true);
  await page.locator('#adminExportAiDatasetBtn').evaluate(node => node.click());
  await page.waitForTimeout(250);
  expect(downloadCount).toBe(0);
  await expect(page.locator('#aiExportGovernanceStatus')).toContainText('blocked');
});

test('pseudonymised AI research export excludes direct identifiers and free text', async ({ page }) => {
  await gotoAlpha(page);
  await setCheckbox(page, 'ttsToggle', false);
  await setCheckbox(page, 'useTwoStage', false);
  await setCheckbox(page, 'useReward', false);
  await setCheckbox(page, 'autoAdvance', true);
  await setValue(page, 'pupilAlias', 'Secret Learner Alias');
  await setValue(page, 'contextNotes', 'SECRET-CONTEXT tired after named appointment');
  await setValue(page, 'eegClockNotes', 'SECRET-CLOCK device operator detail');
  await setValue(page, 'studyProtocolId', 'CT-PRIVATE-PILOT');
  await setValue(page, 'studyVisitId', 'private-visit-label');
  await setValue(page, 'eegAcquisitionSystem', 'Private device serial');
  await setValue(page, 'dataUseStatus', 'recorded-separately');
  await setCheckbox(page, 'researchAnalysisApproved', true);
  await setCheckbox(page, 'modelDevelopmentApproved', true);
  await setValue(page, 'governanceReference', 'SECRET-GOVERNANCE-REFERENCE');
  await setValue(page, 'governanceReviewDate', '2027-06-01');
  await setValue(page, 'startLevel', 4);
  await setValue(page, 'sessionMax', 1);

  await page.locator('#quickStartSessionBtn').click();
  await page.locator('#choiceGrid [data-role="correct-target"]').first().click();
  await expect(page.locator('#screenSummary.active')).toBeVisible();
  const sessionPayload = await downloadJsonAfter(page, () => page.locator('#summaryExport').click());
  expect(sessionPayload.data_governance).toEqual(expect.objectContaining({
    governance_schema_version: '1.0.0',
    status: 'recorded-separately',
    governance_reference: 'SECRET-GOVERNANCE-REFERENCE',
    review_date: '2027-06-01',
    approved_uses: expect.objectContaining({
      research_analysis: true,
      model_development: true
    }),
    authority_evidence_stored_in_choice_train: false
  }));
  await page.locator('#teacherExitHold').focus();
  await page.locator('#teacherExitHold').press('Enter');
  await page.evaluate(async () => {
    const db = await new Promise((resolve, reject) => {
      const request = indexedDB.open('choice_train_runtime_v2', 2);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
    const tx = db.transaction('sessions', 'readwrite');
    const store = tx.objectStore('sessions');
    const sessions = await new Promise((resolve, reject) => {
      const request = store.getAll();
      request.onsuccess = () => resolve(request.result || []);
      request.onerror = () => reject(request.error);
    });
    sessions.forEach(session => {
      session.eeg_marker_diagnostics = {
        ...(session.eeg_marker_diagnostics || {}),
        operator_notes: 'SECRET-DIAGNOSTIC free text',
        exact_wall_time_ms: 1893456000000,
        source_session_id: session.session_id
      };
      store.put(session);
    });
    await new Promise((resolve, reject) => {
      tx.oncomplete = resolve;
      tx.onerror = () => reject(tx.error);
      tx.onabort = () => reject(tx.error);
    });
    db.close();
  });
  await page.reload();
  await expect(page.locator('#beginFlow')).toBeVisible();
  await page.locator('#teacherExitHold').focus();
  await page.locator('#teacherExitHold').press('Enter');
  await page.locator('#adminPanelTab').click();
  await page.locator('#adminNavResearch').click();
  await expect(page.locator('#dataUseStatus')).toHaveValue('recorded-separately');
  await expect(page.locator('#modelDevelopmentApproved')).toBeChecked();
  await expect(page.locator('#aiExportGovernanceStatus')).toContainText('marked ready');

  const downloadPromise = page.waitForEvent('download');
  await page.locator('#adminExportAiDatasetBtn').evaluate(node => node.click());
  const download = await downloadPromise;
  const payload = JSON.parse(fs.readFileSync(await download.path(), 'utf8'));
  expectCoreSchema(payload, MODEL_DATASET_SCHEMA, 'model_dataset');
  const exportedText = JSON.stringify(payload);
  const exportedKeys = [];
  const collectKeys = value => {
    if(!value || typeof value !== 'object') return;
    Object.keys(value).forEach(key => {
      exportedKeys.push(key);
      collectKeys(value[key]);
    });
  };
  collectKeys(payload);

  expect(download.suggestedFilename()).toMatch(/^ChoiceTrain_Pseudonymised_\d{4}-\d{2}-\d{2}_\d{4}_research-dataset\.json$/);
  expect(payload.privacy_status).toBe('pseudonymised-not-anonymous');
  expect(payload.governance).toEqual(expect.objectContaining({
    consent_or_other_authority_status: 'recorded-separately-local-declaration',
    participant_profiles_checked: 1,
    all_participants_model_development_use_approved: true,
    authority_evidence_included: false,
    human_review_required: true,
    automated_decision_making_enabled: false,
    model_training_performed_by_application: false
  }));
  expect(payload.privacy_manifest).toEqual(expect.objectContaining({
    names_included: false,
    aliases_included: false,
    free_text_included: false,
    image_data_included: false,
    photo_labels_included: false,
    exact_timestamps_included: false,
    raw_touch_coordinates_included: false,
    prompt_wording_included: false,
    source_session_ids_included: false,
    external_transmission: false
  }));
  expect(payload.participant_count).toBe(1);
  expect(payload.sessions).toHaveLength(1);
  expect(payload.sessions[0].participant_code).toMatch(/^ctp-/);
  expect(payload.sessions[0].starting_level).toBe(4);
  expect(payload.sessions[0].ending_level).toBe(5);
  expect(payload.sessions[0].session_task_mode).toBe('auto');
  expect(payload.sessions[0].trials[0].skill_ids).toContain('recognition.named_object');
  expect(payload.sessions[0].trials[0].coverage_strategy).toBe('balanced-before-repeat');
  expect(payload.sessions[0].trials[0].correct).toBe(true);
  expect(Object.keys(payload.sessions[0].eeg_marker_diagnostics).sort()).toEqual([
    'version',
    'ordered_trials',
    'expected_order_trials',
    'ordering_pct',
    'response_timing_comparisons',
    'timing_difference_count',
    'response_timing_tolerance_ms',
    'non_monotonic_marker_count',
    'duplicate_marker_id_count',
    'protocol_fields_complete',
    'protocol_fields_expected',
    'protocol_completeness_pct',
    'declared_sync_method',
    'hardware_synchronization_verified',
    'interpretation_boundary'
  ].sort());
  expect(exportedText).not.toContain('Pupil A');
  expect(exportedText).not.toContain('Secret Learner Alias');
  expect(exportedText).not.toContain('SECRET-CONTEXT');
  expect(exportedText).not.toContain('SECRET-CLOCK');
  expect(exportedText).not.toContain('CT-PRIVATE-PILOT');
  expect(exportedText).not.toContain('private-visit-label');
  expect(exportedText).not.toContain('Private device serial');
  expect(exportedText).not.toContain('SECRET-GOVERNANCE-REFERENCE');
  expect(exportedText).not.toContain('SECRET-DIAGNOSTIC');
  expect(exportedText).not.toContain('2027-06-01');
  expect(exportedKeys).not.toContain('prompt_wording');
  expect(exportedKeys).not.toContain('photo_labels_used');
  expect(exportedKeys).not.toContain('pointer_play_x');
  expect(exportedKeys).not.toContain('t_wall_ms');
  expect(exportedKeys).not.toContain('t_perf_ms');
  expect(exportedKeys).not.toContain('context_notes');
  expect(exportedKeys).not.toContain('operator_notes');
  expect(exportedKeys).not.toContain('exact_wall_time_ms');
  expect(exportedKeys).not.toContain('source_session_id');
});
