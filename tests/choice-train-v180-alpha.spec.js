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
  expect(payload.generator_version).toBe('1.0.0');
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

test('Research is a separate admin destination with accessible visual equivalents', async ({ page }) => {
  await gotoAlpha(page);
  await page.locator('#adminPanelTab').click();
  await expect(page.locator('#adminNavOverview')).toHaveAttribute('aria-pressed', 'true');
  await expect(page.locator('#adminAnalyticsSection')).toBeHidden();

  await page.locator('#adminNavResearch').click();
  await expect(page.locator('body')).toHaveClass(/admin-page-research/);
  await expect(page.locator('#adminNavResearch')).toHaveAttribute('aria-pressed', 'true');
  await expect(page.locator('#adminAnalyticsSection')).toBeVisible();
  await expect(page.locator('#researchAccuracyChart')).toHaveAttribute('role', 'img');
  await expect(page.locator('#researchSessionTrendBody')).toContainText('No data');
  await expect(page.locator('#researchSourceNote')).toContainText('Missing values stay missing');
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
