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
  expect(trial.lesson_seed).toBeNull();
  expect(trial.generator_mode).toBe('legacy-stochastic');
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
