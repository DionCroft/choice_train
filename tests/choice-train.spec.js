const fs = require('fs');
const { test, expect } = require('@playwright/test');
const APP_PATH = '/choice_train_V1.3.2.html';

async function gotoApp(page) {
  await page.goto(APP_PATH);
  await expect(page.locator('#beginFlow')).toBeVisible();
}

async function setCheckbox(page, id, checked) {
  const locator = page.locator(`#${id}`);
  if (checked) {
    await locator.check();
  } else {
    await locator.uncheck();
  }
}

async function setNumber(page, id, value) {
  await page.locator(`#${id}`).fill(String(value));
}

async function setSelect(page, id, value) {
  await page.locator(`#${id}`).selectOption(String(value));
}

async function waitForChoiceScreen(page) {
  await expect(page.locator('#screenChoice.active')).toBeVisible();
}

async function waitForSummaryScreen(page) {
  await expect(page.locator('#screenSummary.active')).toBeVisible();
}

async function waitForBreakScreen(page) {
  await expect(page.locator('#screenBreak.active')).toBeVisible();
}

async function clickCorrectChoice(page) {
  await waitForChoiceScreen(page);
  await page.locator('#choiceGrid [data-role="correct-target"]').first().click();
}

async function clickFirstChoice(page) {
  await waitForChoiceScreen(page);
  await page.locator('#choiceGrid button.choice').first().click();
}

async function exportJsonAfter(page, action) {
  const downloadPromise = page.waitForEvent('download');
  await action();
  const download = await downloadPromise;
  const filePath = await download.path();
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function attachErrorTracking(page) {
  const errors = [];
  page.on('pageerror', error => {
    errors.push(`pageerror: ${error.message}`);
  });
  page.on('console', msg => {
    if (msg.type() === 'error') {
      errors.push(`console: ${msg.text()}`);
    }
  });
  return errors;
}

async function configureSession(page, overrides = {}) {
  const settings = {
    ttsToggle: false,
    useTwoStage: false,
    useReward: false,
    autoAdvance: false,
    autoLevelPath: true,
    singleTargetStart: false,
    sessionTaskType: 'auto',
    sessionMax: 1,
    startLevel: 1,
    itiSec: 0.2,
    responseWindowSec: 1,
    ...overrides
  };
  const selectFields = new Set(['sessionTaskType', 'researchCondition', 'eegExportFormat']);

  for (const [key, value] of Object.entries(settings)) {
    if (typeof value === 'boolean') {
      await setCheckbox(page, key, value);
    } else if (selectFields.has(key)) {
      await setSelect(page, key, value);
    } else {
      await setNumber(page, key, value);
    }
  }
}

async function startConfiguredSession(page, overrides = {}) {
  await configureSession(page, overrides);
  await page.locator('#beginFlow').click();
}

const levelExpectations = [
  { level: 1, stage: 'Touch screen', question: /Touch /, cueTarget: true },
  { level: 2, stage: 'Touch object', question: /Touch /, correctTarget: true },
  { level: 3, stage: 'Moving target', question: /Touch /, correctTarget: true },
  { level: 4, stage: 'Find object', question: /Find /, correctTarget: true },
  { level: 5, stage: 'Discriminate object', question: /Which is /, correctTarget: true },
  { level: 6, stage: 'Find category', question: /Which is /, correctTarget: true },
  { level: 7, stage: 'CPAT sustained attention', question: /Tap only when you see the star/ },
  { level: 8, stage: 'CPAT selective-spatial', question: /Find the blue star/ },
  { level: 9, stage: 'CPAT orienting', question: /Use the cue, then tap the star/ },
  { level: 10, stage: 'CPAT executive control', question: /Tap the direction of the middle arrow/ }
];

test.describe('auto path level coverage', () => {
  for (const item of levelExpectations) {
    test(`level ${item.level} shows the expected task surface`, async ({ page }) => {
      const errors = attachErrorTracking(page);
      await gotoApp(page);
      await startConfiguredSession(page, {
        startLevel: item.level,
        sessionMax: 1,
        autoLevelPath: true,
        sessionTaskType: 'auto'
      });

      await waitForChoiceScreen(page);
      await expect(page.locator('#levelBadge')).toHaveText(`Level ${item.level}`);
      await expect(page.locator('#stageLabel')).toHaveText(item.stage);
      await expect(page.locator('#questionText')).toContainText(item.question);

      if (item.cueTarget) {
        await expect(page.locator('#choiceGrid [data-cue-target="true"]')).toBeVisible();
      }
      if (item.correctTarget) {
        await expect(page.locator('#choiceGrid [data-role="correct-target"]')).toHaveCount(1);
      }

      expect(errors, errors.join('\n')).toEqual([]);
    });
  }
});

test('level 1 accepts a panel touch anywhere in the active area', async ({ page }) => {
  const errors = attachErrorTracking(page);
  await gotoApp(page);
  await startConfiguredSession(page, {
    startLevel: 1,
    sessionMax: 1,
    autoAdvance: true,
    autoLevelPath: true
  });

  await waitForChoiceScreen(page);
  await page.locator('#choiceGrid').click({ position: { x: 24, y: 24 } });
  await waitForSummaryScreen(page);
  await expect(page.locator('#summaryText')).toContainText('1 correct, 0 incorrect');

  expect(errors, errors.join('\n')).toEqual([]);
});

test('target-present timeout records an omission', async ({ page }) => {
  const errors = attachErrorTracking(page);
  await gotoApp(page);
  await startConfiguredSession(page, {
    startLevel: 2,
    sessionMax: 1,
    autoAdvance: true,
    responseWindowSec: 1
  });

  await waitForChoiceScreen(page);
  await waitForSummaryScreen(page);
  await expect(page.locator('#summaryText')).toContainText('1 omissions');
  await expect(page.locator('#questionTableBody')).toContainText('Omission');

  expect(errors, errors.join('\n')).toEqual([]);
});

test('auto advance moves from reward to the next question', async ({ page }) => {
  const errors = attachErrorTracking(page);
  await gotoApp(page);

  await configureSession(page, {
    startLevel: 2,
    sessionMax: 2,
    itiSec: 0.4,
    useReward: true,
    autoAdvance: true,
    autoLevelPath: false,
    sessionTaskType: 'touch-object'
  });

  await page.locator('#beginFlow').click();
  await clickCorrectChoice(page);

  await expect(page.locator('#screenReward.active')).toBeVisible();
  await expect(page.locator('#rewardSub')).toContainText('Moving to the next question automatically.');
  await expect(page.locator('#rewardStars')).toContainText(/\u2605/);
  await expect(page.locator('.station.current')).toHaveText('2', { timeout: 6_000 });
  await expect(page.locator('#screenChoice.active')).toBeVisible();

  expect(errors, errors.join('\n')).toEqual([]);
});

test('selective attention target is always present when prompted', async ({ page }) => {
  const errors = attachErrorTracking(page);
  await gotoApp(page);

  await startConfiguredSession(page, {
    startLevel: 8,
    sessionMax: 1,
    autoAdvance: false,
    autoLevelPath: true,
    sessionTaskType: 'auto'
  });
  await waitForChoiceScreen(page);

  await expect(page.locator('#questionText')).toContainText('Find the blue star');
  await expect(page.locator('#choiceGrid .choiceLabel').filter({ hasText: 'Blue star' })).toHaveCount(1);

  expect(errors, errors.join('\n')).toEqual([]);
});

test('sustained attention rotates to the Signal Station variant on question 2', async ({ page }) => {
  const errors = attachErrorTracking(page);
  await gotoApp(page);

  await startConfiguredSession(page, {
    startLevel: 7,
    sessionMax: 2,
    autoAdvance: true,
    autoLevelPath: false,
    sessionTaskType: 'cpat-sustained',
    responseWindowSec: 2
  });

  await waitForChoiceScreen(page);
  await expect(page.locator('#questionVariant')).toHaveText('Star Watch');
  await clickCorrectChoice(page);
  await expect(page.locator('.station.current')).toHaveText('2', { timeout: 5_000 });
  await expect(page.locator('#screenPrompt.active')).toBeVisible();
  await expect(page.locator('#promptTitle')).toContainText('Wait for green, then tap the signal.');
  await expect(page.locator('#promptSubtitle')).toContainText('Wait through red');
  await waitForChoiceScreen(page);
  await expect(page.locator('#questionVariant')).toHaveText('Signal Station');
  await expect(page.locator('#questionText')).toContainText('Wait for green, then tap the signal.');
  await expect(page.locator('#questionRule')).toContainText('Wait through red');

  expect(errors, errors.join('\n')).toEqual([]);
});

test('selective attention rotates to the Ticket Hunt variant on question 2', async ({ page }) => {
  const errors = attachErrorTracking(page);
  await gotoApp(page);

  await startConfiguredSession(page, {
    startLevel: 8,
    sessionMax: 2,
    autoAdvance: true,
    autoLevelPath: false,
    sessionTaskType: 'cpat-selective',
    responseWindowSec: 2
  });

  await clickCorrectChoice(page);
  await expect(page.locator('.station.current')).toHaveText('2', { timeout: 5_000 });
  await waitForChoiceScreen(page);
  await expect(page.locator('#questionVariant')).toHaveText('Ticket Hunt');
  await expect(page.locator('#questionText')).toContainText('gold ticket');
  await expect(page.locator('#choiceGrid .choiceLabel').filter({ hasText: 'Gold ticket' })).toHaveCount(1);

  expect(errors, errors.join('\n')).toEqual([]);
});

test('orienting attention rotates to the Platform Pointer variant on question 2', async ({ page }) => {
  const errors = attachErrorTracking(page);
  await gotoApp(page);

  await startConfiguredSession(page, {
    startLevel: 9,
    sessionMax: 2,
    autoAdvance: true,
    autoLevelPath: false,
    sessionTaskType: 'cpat-orienting',
    responseWindowSec: 2
  });

  await clickCorrectChoice(page);
  await expect(page.locator('.station.current')).toHaveText('2', { timeout: 5_000 });
  await waitForChoiceScreen(page);
  await expect(page.locator('#questionVariant')).toHaveText('Platform Pointer');
  await expect(page.locator('#questionText')).toContainText('tap the train');
  await expect(page.locator('#choiceGrid .choiceLabel').filter({ hasText: 'Train' })).toHaveCount(1);

  expect(errors, errors.join('\n')).toEqual([]);
});

test('executive attention rotates to the Traffic Lights variant on question 2', async ({ page }) => {
  const errors = attachErrorTracking(page);
  await gotoApp(page);

  await startConfiguredSession(page, {
    startLevel: 10,
    sessionMax: 2,
    autoAdvance: true,
    autoLevelPath: false,
    sessionTaskType: 'cpat-executive',
    responseWindowSec: 2
  });

  await clickCorrectChoice(page);
  await expect(page.locator('.station.current')).toHaveText('2', { timeout: 5_000 });
  await expect(page.locator('#screenPrompt.active')).toBeVisible();
  await expect(page.locator('#promptTitle')).toContainText('Wait for green, then tap Go.');
  await expect(page.locator('#promptSubtitle')).toContainText('Wait through red');
  await waitForChoiceScreen(page);
  await expect(page.locator('#questionVariant')).toHaveText('Traffic Lights');
  await expect(page.locator('#questionText')).toContainText('Wait for green, then tap Go.');
  await expect(page.locator('#questionRule')).toContainText('Tap when the light turns green');

  expect(errors, errors.join('\n')).toEqual([]);
});

test('CPAT sustained target-absent timeout becomes a correct rejection, not an omission', async ({ page }) => {
  const errors = attachErrorTracking(page);
  await gotoApp(page);

  await startConfiguredSession(page, {
    startLevel: 7,
    sessionMax: 3,
    autoAdvance: true,
    responseWindowSec: 1
  });

  await clickCorrectChoice(page);
  await expect(page.locator('.station.current')).toHaveText('2', { timeout: 5_000 });
  await expect(page.locator('#screenPrompt.active')).toBeVisible();
  await waitForChoiceScreen(page);
  await clickCorrectChoice(page);
  await expect(page.locator('.station.current')).toHaveText('3', { timeout: 5_000 });
  await waitForSummaryScreen(page);

  await expect(page.locator('#summaryText')).toContainText('0 omissions');
  await expect(page.locator('#summaryText')).toContainText('3 correct, 0 incorrect');
  await expect(page.locator('#questionTableBody')).toContainText('Correct rejection');

  expect(errors, errors.join('\n')).toEqual([]);
});

test('CPAT sustained target-absent tap becomes a commission', async ({ page }) => {
  const errors = attachErrorTracking(page);
  await gotoApp(page);

  await startConfiguredSession(page, {
    startLevel: 7,
    sessionMax: 3,
    autoAdvance: true,
    responseWindowSec: 2
  });

  await clickCorrectChoice(page);
  await expect(page.locator('.station.current')).toHaveText('2', { timeout: 5_000 });
  await expect(page.locator('#screenPrompt.active')).toBeVisible();
  await waitForChoiceScreen(page);
  await clickCorrectChoice(page);
  await expect(page.locator('.station.current')).toHaveText('3', { timeout: 5_000 });
  await clickFirstChoice(page);
  await waitForSummaryScreen(page);

  await expect(page.locator('#summaryText')).toContainText('1 commissions');
  await expect(page.locator('#summaryText')).toContainText('2 correct, 1 incorrect');
  await expect(page.locator('#questionTableBody')).toContainText('No');

  expect(errors, errors.join('\n')).toEqual([]);
});

test('full-support prompt is logged in exported trial data', async ({ page }) => {
  const errors = attachErrorTracking(page);
  await gotoApp(page);

  await startConfiguredSession(page, {
    startLevel: 2,
    sessionMax: 1,
    autoAdvance: true,
    responseWindowSec: 2
  });

  await waitForChoiceScreen(page);
  await page.locator('#promptFullSupportBtn').click();
  await waitForSummaryScreen(page);

  const payload = await exportJsonAfter(page, async () => {
    await page.locator('#summaryExport').click();
  });

  expect(payload.summary.questions_answered).toBe(1);
  expect(payload.trials).toHaveLength(1);
  expect(payload.trials[0].highest_prompt_level).toBe(5);
  expect(payload.trials[0].support_code).toBe('physical');
  expect(payload.trials[0].independence_status).toBe('assisted');
  expect(payload.trials[0].response_type).toBe('assisted-correct');
  expect(payload.events.some(event => event.type === 'prompt_applied')).toBeTruthy();

  expect(errors, errors.join('\n')).toEqual([]);
});

test('repeat flow keeps one answered question but records repeated attempts', async ({ page }) => {
  const errors = attachErrorTracking(page);
  await gotoApp(page);

  await startConfiguredSession(page, {
    startLevel: 2,
    sessionMax: 1,
    useReward: true,
    autoAdvance: false,
    autoLevelPath: false,
    sessionTaskType: 'touch-object'
  });

  await clickCorrectChoice(page);
  await expect(page.locator('#screenReward.active')).toBeVisible();
  await page.locator('#rewardRepeat').click();
  await waitForChoiceScreen(page);
  await clickCorrectChoice(page);
  await expect(page.locator('#screenReward.active')).toBeVisible();

  const payload = await exportJsonAfter(page, async () => {
    await page.locator('#rewardNext').click();
    await waitForSummaryScreen(page);
    await page.locator('#summaryExport').click();
  });

  expect(payload.trials).toHaveLength(2);
  expect(payload.summary.questions_answered).toBe(1);
  expect(payload.summary.repeated_attempts).toBe(1);
  expect(payload.trials.map(trial => trial.attempt_index)).toEqual([1, 2]);
  expect(payload.events.some(event => event.type === 'question_repeat')).toBeTruthy();

  expect(errors, errors.join('\n')).toEqual([]);
});

test('traffic lights waits through red, then records a hit on green and exports the variant metadata', async ({ page }) => {
  const errors = attachErrorTracking(page);
  await gotoApp(page);

  await startConfiguredSession(page, {
    startLevel: 10,
    sessionMax: 2,
    autoAdvance: true,
    autoLevelPath: false,
    sessionTaskType: 'cpat-executive',
    responseWindowSec: 1
  });

  await clickCorrectChoice(page);
  await expect(page.locator('.station.current')).toHaveText('2', { timeout: 5_000 });
  await expect(page.locator('#screenPrompt.active')).toBeVisible();
  await expect(page.locator('#promptSubtitle')).toContainText('Wait through red');
  await waitForChoiceScreen(page);
  await expect(page.locator('#questionVariant')).toHaveText('Traffic Lights');
  await expect(page.locator('#questionText')).toContainText('Wait for green, then tap Go.');
  await expect(page.locator('#questionRule')).toContainText('Tap when the light turns green');
  await clickCorrectChoice(page);
  await waitForSummaryScreen(page);
  await expect(page.locator('#summaryText')).toContainText('0 omissions');
  await expect(page.locator('#summaryText')).toContainText('2 correct, 0 incorrect');
  await expect(page.locator('#questionTableBody')).toContainText('Green light');

  const payload = await exportJsonAfter(page, async () => {
    await page.locator('#summaryExport').click();
  });

  const trafficTrials = payload.trials.filter(trial => trial.task_variant === 'traffic-lights');
  expect(trafficTrials.length).toBeGreaterThan(0);
  expect(trafficTrials.some(trial => trial.correct === true && trial.response_type === 'hit')).toBeTruthy();
  expect(trafficTrials.every(trial => trial.variant_label === 'Traffic Lights')).toBeTruthy();

  expect(errors, errors.join('\n')).toEqual([]);
});

test('summary CTA matches the next level and starts it directly', async ({ page }) => {
  const errors = attachErrorTracking(page);
  await gotoApp(page);

  await startConfiguredSession(page, {
    startLevel: 4,
    sessionMax: 3,
    itiSec: 0.2,
    autoAdvance: true,
    autoLevelPath: true
  });

  await clickCorrectChoice(page);
  await expect(page.locator('.station.current')).toHaveText('2', { timeout: 5_000 });
  await clickCorrectChoice(page);
  await expect(page.locator('.station.current')).toHaveText('3', { timeout: 5_000 });
  await clickCorrectChoice(page);

  await expect(page.locator('#screenSummary.active')).toBeVisible({ timeout: 5_000 });
  await expect(page.locator('#summaryRestart')).toHaveText('Start Level 5');
  await expect(page.locator('#summaryText')).toContainText('Progressing to Level 5.');

  await page.locator('#summaryRestart').click();
  await waitForChoiceScreen(page);
  await expect(page.locator('#levelBadge')).toHaveText('Level 5');
  await expect(page.locator('#stageLabel')).toHaveText('Discriminate object');

  expect(errors, errors.join('\n')).toEqual([]);
});

test('level 10 does not progress beyond the final CPAT stage', async ({ page }) => {
  const errors = attachErrorTracking(page);
  await gotoApp(page);

  await startConfiguredSession(page, {
    startLevel: 10,
    sessionMax: 1,
    autoAdvance: true,
    autoLevelPath: true
  });

  await clickCorrectChoice(page);
  await waitForSummaryScreen(page);

  await expect(page.locator('#summaryText')).toContainText('Level 10 complete. The learner is already at the final CPAT stage.');
  await expect(page.locator('#summaryRestart')).toHaveText('Start Again');
  await expect(page.locator('#levelBadge')).toHaveText('Level 10');

  expect(errors, errors.join('\n')).toEqual([]);
});

test('session history persists across reload and exports from the history manager', async ({ page }) => {
  const errors = attachErrorTracking(page);
  await gotoApp(page);

  await startConfiguredSession(page, {
    startLevel: 2,
    sessionMax: 1,
    autoAdvance: true,
    autoLevelPath: false,
    sessionTaskType: 'touch-object'
  });

  const sessionId = (await page.locator('#sid').textContent()).trim();
  await clickCorrectChoice(page);
  await waitForSummaryScreen(page);
  await expect(page.locator('#historyTableBody')).toContainText(sessionId);

  await gotoApp(page);
  await expect(page.locator('#historyTableBody')).toContainText(sessionId);

  const historyPayload = await exportJsonAfter(page, async () => {
    await page.locator('#exportHistoryBtn').click();
  });

  expect(Array.isArray(historyPayload.sessions)).toBeTruthy();
  expect(historyPayload.sessions.some(session => String(session.session_id).startsWith(sessionId))).toBeTruthy();

  expect(errors, errors.join('\n')).toEqual([]);
});

test('EEG research mode inserts an automatic block pause and then resumes the next question', async ({ page }) => {
  const errors = attachErrorTracking(page);
  await gotoApp(page);

  await startConfiguredSession(page, {
    startLevel: 2,
    sessionMax: 3,
    useReward: false,
    autoAdvance: true,
    autoLevelPath: false,
    sessionTaskType: 'touch-object',
    eegResearchMode: true,
    autoBlockPauses: true,
    eegBlockSize: 2,
    eegAutoPauseSec: 12,
    responseWindowSec: 2
  });

  await waitForChoiceScreen(page);
  await clickCorrectChoice(page);
  await expect(page.locator('.station.current')).toHaveText('2', { timeout: 5_000 });
  await waitForChoiceScreen(page);
  await clickCorrectChoice(page);
  await waitForBreakScreen(page);
  await expect(page.locator('#breakTitle')).toContainText('Block Pause');
  await expect(page.locator('#breakSubtitle')).toContainText('Block 1 complete');
  await page.locator('#continueFromBreak').click();
  await waitForChoiceScreen(page);
  await expect(page.locator('.station.current')).toHaveText('3');

  expect(errors, errors.join('\n')).toEqual([]);
});

test('EEG export includes markers, codes, and block summaries', async ({ page }) => {
  const errors = attachErrorTracking(page);
  await gotoApp(page);

  await configureSession(page, {
    startLevel: 7,
    sessionMax: 1,
    autoAdvance: true,
    autoLevelPath: false,
    sessionTaskType: 'cpat-sustained',
    eegResearchMode: true,
    eegExportFormat: 'json',
    responseWindowSec: 2
  });

  await page.locator('#eegExportFormat').selectOption('json');
  await page.locator('#beginFlow').click();
  await clickCorrectChoice(page);
  await waitForSummaryScreen(page);

  const payload = await exportJsonAfter(page, async () => {
    await page.locator('#exportEegBtn').click();
  });

  expect(payload.eeg_marker_code_map).toBeTruthy();
  expect(Array.isArray(payload.markers)).toBeTruthy();
  expect(payload.markers.some(marker => marker.name === 'session_start')).toBeTruthy();
  expect(payload.markers.some(marker => marker.name === 'cue_onset')).toBeTruthy();
  expect(payload.markers.some(marker => marker.name === 'stimulus_onset')).toBeTruthy();
  expect(Array.isArray(payload.blocks)).toBeTruthy();

  expect(errors, errors.join('\n')).toEqual([]);
});

test('learner help button escalates the prompt ladder during an active trial', async ({ page }) => {
  const errors = attachErrorTracking(page);
  await gotoApp(page);

  await startConfiguredSession(page, {
    startLevel: 2,
    sessionMax: 1,
    autoAdvance: false,
    responseWindowSec: 2
  });

  await waitForChoiceScreen(page);
  await expect(page.locator('#currentPromptLabel')).toHaveText('Independent');
  await page.locator('#learnerHelpBtn').click();
  await expect(page.locator('#currentPromptLabel')).toHaveText('Cue only');

  expect(errors, errors.join('\n')).toEqual([]);
});

test('active control condition keeps the Traffic Lights visuals but removes the wait-to-go rule', async ({ page }) => {
  const errors = attachErrorTracking(page);
  await gotoApp(page);

  await startConfiguredSession(page, {
    startLevel: 10,
    sessionMax: 2,
    autoAdvance: true,
    autoLevelPath: false,
    sessionTaskType: 'cpat-executive',
    activeControlEnabled: true,
    responseWindowSec: 2
  });

  await clickCorrectChoice(page);
  await expect(page.locator('.station.current')).toHaveText('2', { timeout: 5_000 });
  await waitForChoiceScreen(page);
  await expect(page.locator('#questionVariant')).toHaveText('Traffic Lights');
  await expect(page.locator('#questionText')).toContainText('Tap the green light.');
  await expect(page.locator('#questionRule')).toContainText('matched control');

  expect(errors, errors.join('\n')).toEqual([]);
});

test('documentation section is available for practitioners', async ({ page }) => {
  const errors = attachErrorTracking(page);
  await gotoApp(page);

  await expect(page.locator('text=Documentation and terminology')).toBeVisible();
  await page.locator('summary:has-text("CPAT and attention terms")').click();
  await expect(page.getByText('Exploratory engagement is an in-app practice metric', { exact: false })).toBeVisible();
  await page.locator('summary:has-text("V1.3.2 CPAT variants and research tools")').click();
  await expect(page.locator('text=Traffic Lights')).toBeVisible();

  expect(errors, errors.join('\n')).toEqual([]);
});
