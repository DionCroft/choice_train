const fs = require('fs');
const { test, expect } = require('@playwright/test');

const APP_PATH = '/choice_train_V1.8.0-alpha.html';

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

test('V1.8 export declares the versioned research contract and preserves missing values', async ({ page }) => {
  await gotoAlpha(page);
  const payload = await downloadJsonAfter(page, () => page.locator('#exportBtn').click());

  expect(payload.build.version).toBe('1.8.0-alpha');
  expect(payload.schema_version).toBe(5);
  expect(payload.skill_graph_version).toBe('1.0.0');
  expect(payload.generator_version).toBe('1.2.0');
  expect(payload.research_summary_version).toBe('1.0.0');
  expect(payload.skill_graph).toEqual(expect.arrayContaining([
    expect.objectContaining({ skill_id: 'access.touch_screen' }),
    expect.objectContaining({ skill_id: 'attention.executive' })
  ]));
  expect(payload.research_summary.final_trial_count).toBe(0);
  expect(payload.research_summary.skill_summaries).toEqual([]);
  expect(payload.research_summary.data_quality.response_time_observed_count).toBe(0);
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
  expect(trial.schema_version).toBe(5);
  expect(trial.skill_graph_version).toBe('1.0.0');
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
    expect(payload.generator_version).toBe('1.2.0');
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
  expect(payload.generator_version).toBe('1.2.0');
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

  expect(payload.generator_version).toBe('1.2.0');
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
  await expect(page.locator('#researchSectionNav a')).toHaveCount(8);
  await expect(page.locator('#researchCoverageChart')).toHaveAttribute('role', 'img');
  await expect(page.locator('#researchCoverageBody')).toContainText('No sessions');
  await expect(page.locator('#researchAccuracyChart')).toHaveAttribute('role', 'img');
  await expect(page.locator('#researchSessionTrendBody')).toContainText('No data');
  await expect(page.locator('#researchSourceNote')).toContainText('Missing values stay missing');
  await page.locator('#researchSectionNav a[href="#researchDataQualitySection"]').click();
  await expect(page.locator('#researchDataQualitySection')).toBeVisible();
  expect(await page.evaluate(() => location.hash)).toBe('#researchDataQualitySection');
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
  expect(researchPayload.export_schema_version).toBe('1.0.0');
  expect(researchPayload.scope).toBe('current-learner');
  expect(researchPayload.session_count).toBe(1);
  expect(researchPayload.final_trial_count).toBe(3);
  expect(researchPayload.session_timing).toHaveLength(1);
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
    protocol_schema_version: '1.0.0',
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
  expect(exportedText).not.toContain('Pupil A');
  expect(exportedText).not.toContain('Secret Learner Alias');
  expect(exportedText).not.toContain('SECRET-CONTEXT');
  expect(exportedText).not.toContain('SECRET-CLOCK');
  expect(exportedText).not.toContain('CT-PRIVATE-PILOT');
  expect(exportedText).not.toContain('private-visit-label');
  expect(exportedText).not.toContain('Private device serial');
  expect(exportedText).not.toContain('SECRET-GOVERNANCE-REFERENCE');
  expect(exportedText).not.toContain('2027-06-01');
  expect(exportedKeys).not.toContain('prompt_wording');
  expect(exportedKeys).not.toContain('photo_labels_used');
  expect(exportedKeys).not.toContain('pointer_play_x');
  expect(exportedKeys).not.toContain('t_wall_ms');
  expect(exportedKeys).not.toContain('t_perf_ms');
  expect(exportedKeys).not.toContain('context_notes');
});
