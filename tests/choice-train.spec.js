const fs = require('fs');
const { test, expect } = require('@playwright/test');
const APP_PATH = '/choice_train_V1.7.1.html';

async function gotoApp(page) {
  await page.goto(APP_PATH);
  await expect(page.locator('#beginFlow')).toBeVisible();
}

async function setCheckbox(page, id, checked) {
  const locator = page.locator(`#${id}`);
  await locator.evaluate((node, nextValue) => {
    node.checked = nextValue;
    node.dispatchEvent(new Event('input', { bubbles: true }));
    node.dispatchEvent(new Event('change', { bubbles: true }));
  }, checked);
}

async function setNumber(page, id, value) {
  await page.locator(`#${id}`).evaluate((node, nextValue) => {
    node.value = String(nextValue);
    node.dispatchEvent(new Event('input', { bubbles: true }));
    node.dispatchEvent(new Event('change', { bubbles: true }));
  }, value);
}

async function setSelect(page, id, value) {
  await page.locator(`#${id}`).evaluate((node, nextValue) => {
    node.value = String(nextValue);
    node.dispatchEvent(new Event('input', { bubbles: true }));
    node.dispatchEvent(new Event('change', { bubbles: true }));
  }, value);
}

async function setCategorySelection(page, listId, selectedIds) {
  await page.locator(`#${listId} input[data-category-id]`).evaluateAll((nodes, ids) => {
    const selected = new Set(ids);
    nodes.forEach(node => {
      node.checked = selected.has(node.dataset.categoryId);
      node.dispatchEvent(new Event('change', { bubbles: true }));
    });
  }, selectedIds);
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

test('live index loads the V1.7.1 stable build', async ({ page }) => {
  const errors = attachErrorTracking(page);
  await page.goto('/');
  await expect(page.locator('#beginFlow')).toBeVisible();
  await expect(page.locator('#versionInfo')).toContainText('V1.7.1');
  await expect(page.locator('#aboutSourceFile')).toHaveText('choice_train_V1.7.1.html');
  expect(errors, errors.join('\n')).toEqual([]);
});

test('archived V1.5.0 release remains runnable from the releases folder', async ({ page }) => {
  const errors = attachErrorTracking(page);
  await page.goto('/releases/choice_train_V1.5.0.html');
  await expect(page.locator('#beginFlow')).toBeVisible();
  await expect(page.locator('#versionInfo')).toContainText('V1.5.0');
  await expect(page.locator('.brandLogo')).toHaveAttribute('src', 'assets/showme-logo.png');
  await expect(page.locator('.brandLogo')).toBeVisible();
  expect(errors, errors.join('\n')).toEqual([]);
});

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
    usePromptAnswerBlank: false,
    useBlankInterval: false,
    blankIntervalSec: 1,
    ...overrides
  };
  const selectFields = new Set(['sessionTaskType', 'researchCondition', 'eegExportFormat']);

  await page.locator('#studentFriendlyMode').uncheck();
  await page.locator('#adminPanelTab').click();
  await page.locator('#adminNavSystem').click();
  await expect(page.locator('#adminPanelDetails')).toBeVisible();
  const adminDetails = page.locator('#adminPanelDetails');
  if (!(await adminDetails.evaluate(node => node.hasAttribute('open')))) {
    await page.locator('summary:has-text("Advanced Admin Settings")').click();
  }
  const researchDetails = page.locator('details:has(> summary:has-text("Research / Debug Settings"))').first();
  if (!(await researchDetails.evaluate(node => node.hasAttribute('open')))) {
    await page.locator('summary:has-text("Research / Debug Settings")').click();
  }

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
  await page.locator('#teacherPanelTab').click();
  await page.locator('#learnerModeBtn').click();
  await page.locator('#beginFlow').click();
}

async function openAdminDestination(page, destination) {
  const navIds = {
    overview: 'adminNavOverview',
    sessions: 'adminNavSessions',
    learners: 'adminNavLearners',
    eeg: 'adminNavEeg',
    system: 'adminNavSystem'
  };
  await page.locator('#adminPanelTab').click();
  await page.locator(`#${navIds[destination]}`).click();
}

async function openTeacherDestination(page, destination) {
  const navIds = {
    today: 'teacherNavToday',
    personalise: 'teacherNavPersonalise',
    results: 'teacherNavResults'
  };
  await page.locator(`#${navIds[destination]}`).click();
}

async function returnToTeacherWorkspace(page) {
  await page.locator('#teacherExitHold').dispatchEvent('pointerdown', { button: 0 });
  await page.waitForTimeout(1_300);
  await expect(page.locator('.panel')).toBeVisible();
}

const friendlyFindPattern = /Find |Can you find |Where is |Show me |Let's find /;
const categoryPattern = /Find |Which one is |Can you find |Where is /;

const levelExpectations = [
  { level: 1, stage: 'Touch screen', question: friendlyFindPattern, cueTarget: true },
  { level: 2, stage: 'Touch object', question: friendlyFindPattern, correctTarget: true },
  { level: 3, stage: 'Moving target', question: friendlyFindPattern, correctTarget: true },
  { level: 4, stage: 'Find object', question: friendlyFindPattern, correctTarget: true },
  { level: 5, stage: 'Discriminate object', question: friendlyFindPattern, correctTarget: true },
  { level: 6, stage: 'Find category', question: categoryPattern, correctTarget: true },
  { level: 7, stage: 'AT sustained attention', question: /Tap only when you see the star/ },
  { level: 8, stage: 'AT selective-spatial', question: /Find the blue star/ },
  { level: 9, stage: 'AT orienting', question: /Use the cue, then tap the star/ },
  { level: 10, stage: 'AT executive control', question: /Tap the direction of the middle arrow/ }
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

  await startConfiguredSession(page, {
    startLevel: 2,
    sessionMax: 2,
    itiSec: 0.4,
    useReward: true,
    autoAdvance: true,
    autoLevelPath: false,
    sessionTaskType: 'touch-object'
  });

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
  for (let promptLevel = 1; promptLevel <= 5; promptLevel += 1) {
    await page.locator('#learnerHelpBtn').click();
  }
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

test('level 10 does not progress beyond the final Attention Training stage', async ({ page }) => {
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

  await expect(page.locator('#summaryText')).toContainText('Level 10 complete. The learner is already at the final Attention Training stage.');
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
  await returnToTeacherWorkspace(page);
  await page.locator('#studentFriendlyMode').uncheck();
  await openAdminDestination(page, 'sessions');
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

  await startConfiguredSession(page, {
    startLevel: 7,
    sessionMax: 1,
    autoAdvance: true,
    autoLevelPath: false,
    sessionTaskType: 'cpat-sustained',
    eegResearchMode: true,
    eegExportFormat: 'json',
    responseWindowSec: 2
  });

  await clickCorrectChoice(page);
  await waitForSummaryScreen(page);
  await returnToTeacherWorkspace(page);
  await openAdminDestination(page, 'eeg');

  const payload = await exportJsonAfter(page, async () => {
    await page.locator('#adminExportResearchBtn').click();
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

  await page.locator('#studentFriendlyMode').uncheck();
  await openAdminDestination(page, 'system');
  await expect(page.locator('text=Documentation and terminology')).toBeVisible();
  await page.locator('summary:has-text("Attention Training terms")').click();
  await expect(page.getByText('Exploratory engagement is an in-app practice metric', { exact: false })).toBeVisible();
  await page.locator('summary:has-text("V1.7.1 teacher, learner, and research guide")').click();
  await expect(page.locator('text=Traffic Lights')).toBeVisible();

  expect(errors, errors.join('\n')).toEqual([]);
});

test('teacher panel is simple on first load and admin settings are collapsed by default', async ({ page }) => {
  const errors = attachErrorTracking(page);
  await gotoApp(page);

  await expect(page.locator('summary:has-text("Daily Teacher Setup")')).toBeVisible();
  await expect(page.locator('summary:has-text("Pupil Personalisation")')).toBeHidden();
  await expect(page.locator('summary:has-text("Session Controls")')).toBeVisible();
  await expect(page.locator('summary:has-text("Sensory and Display Preferences")')).toBeVisible();
  await expect(page.locator('summary:has-text("Context Notes")')).toBeVisible();
  await expect(page.locator('summary:has-text("Basic Results")')).toBeHidden();
  await expect(page.locator('#teacherPanelTab')).toHaveAttribute('aria-pressed', 'true');
  await expect(page.locator('summary:has-text("Advanced Admin Settings")')).toBeHidden();

  expect(errors, errors.join('\n')).toEqual([]);
});

test('teacher panel exposes daily classroom controls and quick-start guidance', async ({ page }) => {
  const errors = attachErrorTracking(page);
  await gotoApp(page);

  await expect(page.getByText('Teacher quick start', { exact: true })).toBeVisible();
  await expect(page.locator('summary:has-text("First session with a pupil")')).toBeVisible();
  await expect(page.locator('#maxObjects')).toBeVisible();
  await expect(page.locator('#sessionTaskType')).toBeVisible();
  await expect(page.locator('#responseWindowSec')).toBeVisible();
  await expect(page.locator('#itiSec')).toBeVisible();
  await expect(page.locator('#useTwoStage')).toBeVisible();
  await expect(page.locator('#useReward')).toBeVisible();
  await expect(page.locator('#useTextPrompt')).toBeVisible();
  await expect(page.locator('#useImagePrompt')).toBeVisible();
  await expect(page.locator('#ttsLabelsToggle')).toBeVisible();
  await expect(page.locator('#autoAdvance')).toBeVisible();
  await expect(page.locator('#usePromptAnswerBlank')).toBeVisible();
  await expect(page.locator('#targetScale')).toBeHidden();
  await expect(page.locator('#practitionerModeBtn')).toHaveCount(0);

  expect(errors, errors.join('\n')).toEqual([]);
});

test('named Auto Advance level sits beside task selection and follows manual task changes', async ({ page }) => {
  const errors = attachErrorTracking(page);
  await gotoApp(page);

  await expect(page.locator('label[for="startLevel"]')).toHaveText('Current Level for Auto Advance');
  await expect(page.locator('#sessionTaskType option').first()).toHaveText('Auto advance');
  await expect(page.locator('#startLevel')).toHaveJSProperty('tagName', 'SELECT');
  await expect(page.locator('#startLevel option').first()).toHaveText('Touchscreen confidence');
  const positions = await page.locator('#sessionTaskType, #startLevel').evaluateAll(nodes => nodes.map(node => node.getBoundingClientRect().top));
  expect(Math.abs(positions[0] - positions[1])).toBeLessThan(8);
  await page.locator('#startLevel').selectOption('8');
  await expect(page.locator('#currentLevelDescription')).toContainText('Selective-spatial attention');
  await page.locator('#sessionTaskType').selectOption('touch-object');
  await expect(page.locator('#currentLevelDescription')).toContainText('Manual task selected: Touch object');
  await page.locator('#beginFlow').click();
  await waitForChoiceScreen(page);
  await expect(page.locator('#footerHint')).toContainText('Touch object is selected for this session');

  expect(errors, errors.join('\n')).toEqual([]);
});

test('sensory and display preferences follow Session Controls and contain Theme', async ({ page }) => {
  await gotoApp(page);
  const order = await page.locator('details[data-teacher-view="today"] > summary').evaluateAll(nodes => nodes.map(node => node.textContent.trim()));
  expect(order.indexOf('Sensory and Display Preferences')).toBe(order.indexOf('Session Controls') + 1);
  const sensorySection = page.locator('details:has(> summary:has-text("Sensory and Display Preferences"))');
  await expect(sensorySection.locator('#themeChoice')).toBeVisible();
  await expect(sensorySection.locator('#itemSizePreset')).toBeVisible();
});

test('saving pupil preferences clearly confirms the applied prompt style', async ({ page }) => {
  const errors = attachErrorTracking(page);
  await gotoApp(page);

  await openTeacherDestination(page, 'personalise');
  await page.locator('#communicationSupportChoice').selectOption('image-first');
  await page.locator('#applyPreferencesBtn').click();
  await expect(page.locator('#preferenceSaveStatus')).toContainText('saved on this device');
  await expect(page.locator('#useTextPrompt')).not.toBeChecked();
  await expect(page.locator('#useImagePrompt')).toBeChecked();

  expect(errors, errors.join('\n')).toEqual([]);
});

test('student-friendly mode can be switched off and remains off in learner mode', async ({ page }) => {
  const errors = attachErrorTracking(page);
  await gotoApp(page);

  await page.locator('#studentFriendlyMode').uncheck();
  await page.locator('#learnerModeBtn').click();
  await expect(page.locator('body')).not.toHaveClass(/student-friendly-on/);
  await returnToTeacherWorkspace(page);
  await expect(page.locator('#studentFriendlyMode')).not.toBeChecked();

  expect(errors, errors.join('\n')).toEqual([]);
});

test('optional blank interval appears between questions and is exported', async ({ page }) => {
  const errors = attachErrorTracking(page);
  await gotoApp(page);

  await startConfiguredSession(page, {
    startLevel: 2,
    sessionMax: 2,
    useReward: false,
    autoAdvance: true,
    autoLevelPath: false,
    sessionTaskType: 'touch-object',
    itiSec: 0.2,
    useBlankInterval: true,
    blankIntervalSec: 1
  });
  await clickCorrectChoice(page);
  await expect(page.locator('#screenBlank.active')).toBeVisible({ timeout: 3_000 });
  await waitForChoiceScreen(page);
  await clickCorrectChoice(page);
  await waitForSummaryScreen(page);

  const payload = await exportJsonAfter(page, async () => {
    await page.locator('#summaryExport').click();
  });
  expect(payload.blank_interval_enabled).toBe(true);
  expect(payload.blank_interval_ms).toBe(1000);
  expect(payload.events.some(event => event.type === 'inter_trial_blank_onset')).toBeTruthy();

  expect(errors, errors.join('\n')).toEqual([]);
});

test('optional Q&A blank appears after a two-stage prompt and exports separately', async ({ page }) => {
  const errors = attachErrorTracking(page);
  await gotoApp(page);

  await startConfiguredSession(page, {
    startLevel: 2,
    sessionMax: 1,
    useTwoStage: true,
    autoAdvance: true,
    delaySec: 0.25,
    usePromptAnswerBlank: true,
    useBlankInterval: false,
    blankIntervalSec: 0.5,
    sessionTaskType: 'touch-object'
  });
  await expect(page.locator('#screenPrompt.active')).toBeVisible();
  await expect(page.locator('#screenBlank.active')).toBeVisible({ timeout: 2_000 });
  await expect(page.locator('#blankIndicator')).toHaveText('Get ready');
  await waitForChoiceScreen(page);
  await clickCorrectChoice(page);
  await waitForSummaryScreen(page);

  const payload = await exportJsonAfter(page, async () => {
    await page.locator('#summaryExport').click();
  });
  expect(payload.prompt_answer_blank_enabled).toBe(true);
  expect(payload.prompt_answer_blank_ms).toBe(500);
  expect(payload.between_question_blank_enabled).toBe(false);
  expect(payload.events.some(event => event.type === 'prompt_answer_blank_onset')).toBeTruthy();
  expect(payload.events.some(event => event.type === 'prompt_answer_blank_offset')).toBeTruthy();

  expect(errors, errors.join('\n')).toEqual([]);
});

test('reset returns to welcome without changing saved session settings', async ({ page }) => {
  const errors = attachErrorTracking(page);
  await gotoApp(page);

  await startConfiguredSession(page, {
    startLevel: 4,
    sessionMax: 3,
    autoAdvance: false,
    autoLevelPath: false,
    sessionTaskType: 'find-object'
  });
  await waitForChoiceScreen(page);
  await returnToTeacherWorkspace(page);
  await page.locator('#resetBtn').click();
  await expect(page.locator('#screenWelcome.active')).toBeVisible();
  await expect(page.locator('#startLevel')).toHaveValue('4');
  await expect(page.locator('#sessionMax')).toHaveValue('3');
  await expect(page.locator('#sessionTaskType')).toHaveValue('find-object');
  await expect(page.locator('#status')).toHaveText('idle');

  expect(errors, errors.join('\n')).toEqual([]);
});

test('teacher and admin panel tabs switch between separate panel groups', async ({ page }) => {
  const errors = attachErrorTracking(page);
  await gotoApp(page);

  await page.locator('#adminPanelTab').click();
  await expect(page.locator('#adminPanelTab')).toHaveAttribute('aria-pressed', 'true');
  await expect(page.locator('#adminResearchWorkspace')).toBeVisible();
  await expect(page.locator('#adminAnalyticsSection')).toBeVisible();
  await expect(page.locator('#adminPanelDetails')).toBeHidden();
  await expect(page.locator('summary:has-text("Daily Teacher Setup")')).toBeHidden();

  await page.locator('#adminNavSystem').click();
  await expect(page.locator('#adminPanelDetails')).toBeVisible();
  expect(await page.locator('#adminPanelDetails').evaluate(node => node.open)).toBeTruthy();

  await page.locator('#teacherPanelTab').click();
  await expect(page.locator('#teacherPanelTab')).toHaveAttribute('aria-pressed', 'true');
  await expect(page.locator('summary:has-text("Daily Teacher Setup")')).toBeVisible();
  await expect(page.locator('summary:has-text("Advanced Admin Settings")')).toBeHidden();

  expect(errors, errors.join('\n')).toEqual([]);
});

test('deliberate teacher return restores access to the Admin workspace', async ({ page }) => {
  const errors = attachErrorTracking(page);
  await gotoApp(page);

  await page.locator('#learnerModeBtn').click();
  await expect(page.locator('aside.panel')).toBeHidden();
  await returnToTeacherWorkspace(page);
  await page.locator('#adminPanelTab').click();
  await expect(page.locator('aside.panel')).toBeVisible();
  await expect(page.locator('#adminResearchWorkspace')).toBeVisible();
  await expect(page.locator('#adminNavOverview')).toHaveAttribute('aria-pressed', 'true');

  expect(errors, errors.join('\n')).toEqual([]);
});

test('student-friendly mode hides technical learner labels and admin content', async ({ page }) => {
  const errors = attachErrorTracking(page);
  await gotoApp(page);

  await page.locator('#startLevel').selectOption('2');
  await page.locator('#sessionMax').fill('1');
  await page.locator('#learnerModeBtn').click();
  await page.locator('#beginFlow').click();
  await waitForChoiceScreen(page);
  await expect(page.locator('#questionVariant')).toBeHidden();
  await expect(page.locator('#questionRule')).toBeHidden();
  await expect(page.locator('#versionChip')).toBeHidden();
  await expect(page.locator('#adminPanelDetails')).toBeHidden();

  expect(errors, errors.join('\n')).toEqual([]);
});

test('context notes export in the session JSON payload', async ({ page }) => {
  const errors = attachErrorTracking(page);
  await gotoApp(page);

  await page.locator('#contextNotes').fill('Calm after lunch and needed one verbal cue.');
  await startConfiguredSession(page, {
    startLevel: 2,
    sessionMax: 1,
    autoAdvance: true
  });
  await clickCorrectChoice(page);
  await waitForSummaryScreen(page);

  const payload = await exportJsonAfter(page, async () => {
    await page.locator('#summaryExport').click();
  });

  expect(payload.context_notes).toContain('Calm after lunch');
  expect(payload.session_overview.context_notes).toContain('Calm after lunch');
  expect(payload.trials[0].context_notes).toContain('Calm after lunch');

  expect(errors, errors.join('\n')).toEqual([]);
});

test('theme selection persists after reload', async ({ page }) => {
  const errors = attachErrorTracking(page);
  await gotoApp(page);

  await page.locator('#studentFriendlyMode').uncheck();
  await page.locator('#themeChoice').selectOption('soft-green');
  await page.reload();
  await expect(page.locator('#themeChoice')).toHaveValue('soft-green');

  expect(errors, errors.join('\n')).toEqual([]);
});

test('session export uses the school-friendly filename format', async ({ page }) => {
  const errors = attachErrorTracking(page);
  await gotoApp(page);

  await page.locator('#pupilAlias').fill('Pupil A');
  await startConfiguredSession(page, {
    startLevel: 2,
    sessionMax: 1,
    autoAdvance: true
  });
  await clickCorrectChoice(page);
  await waitForSummaryScreen(page);

  const downloadPromise = page.waitForEvent('download');
  await page.locator('#summaryExport').click();
  const download = await downloadPromise;
  expect(download.suggestedFilename()).toMatch(/^ChoiceTrain_[A-Za-z0-9_-]+_\d{4}-\d{2}-\d{2}_\d{4}_session\.json$/);

  expect(errors, errors.join('\n')).toEqual([]);
});

test('photo upload adds a labelled personalised photo and records its metadata in exports', async ({ page }) => {
  const errors = attachErrorTracking(page);
  await gotoApp(page);

  await page.locator('#studentFriendlyMode').uncheck();
  await openTeacherDestination(page, 'personalise');
  await page.locator('#photoLabel').fill('Favourite toy');
  await page.locator('#photoCategory').selectOption('toy');
  await page.locator('#photoType').fill('Toy');
  await page.locator('#photoUpload').setInputFiles({
    name: 'toy.svg',
    mimeType: 'image/svg+xml',
    buffer: Buffer.from('<svg xmlns="http://www.w3.org/2000/svg" width="80" height="80"><rect width="80" height="80" rx="12" fill="#71d4ff"/><circle cx="40" cy="40" r="20" fill="#ffd27d"/></svg>')
  });
  await page.locator('#addPhotoBtn').click();
  await expect(page.locator('#photoLibraryList')).toContainText('Favourite toy');

  await startConfiguredSession(page, {
    startLevel: 2,
    sessionMax: 1,
    autoAdvance: true
  });
  await clickCorrectChoice(page);
  await waitForSummaryScreen(page);

  const payload = await exportJsonAfter(page, async () => {
    await page.locator('#summaryExport').click();
  });

  expect(payload.photo_library_metadata.some(item => item.label === 'Favourite toy')).toBeTruthy();

  expect(errors, errors.join('\n')).toEqual([]);
});

test('teacher-created categories reject duplicates and persist across reloads', async ({ page }) => {
  const errors = attachErrorTracking(page);
  await gotoApp(page);

  await openTeacherDestination(page, 'personalise');
  await page.locator('#createCategoryName').fill('Musical instruments');
  await page.locator('#createCategoryBtn').click();
  await expect(page.locator('#categoryCreateStatus')).toContainText('ready to use');
  await expect(page.locator('#photoCategory option[value="custom-musical-instruments"]')).toHaveText('Musical instruments');

  await page.locator('#createCategoryName').fill('  musical   instruments  ');
  await page.locator('#createCategoryBtn').click();
  await expect(page.locator('#categoryCreateStatus')).toContainText('already exists');
  await page.waitForTimeout(300);
  await page.reload();
  await openTeacherDestination(page, 'personalise');
  await expect(page.locator('#photoCategory option[value="custom-musical-instruments"]')).toHaveText('Musical instruments');

  expect(errors, errors.join('\n')).toEqual([]);
});

test('bulk import keeps its starting pupil and category while reporting per-file failures', async ({ page }) => {
  const errors = attachErrorTracking(page);
  await gotoApp(page);

  const originalPupil = await page.locator('#pupilSelect').inputValue();
  await openTeacherDestination(page, 'personalise');
  await page.locator('#bulkPhotoCategory').selectOption('animals');
  await page.locator('#customUpload').setInputFiles([
    {
      name: 'cat.svg',
      mimeType: 'image/svg+xml',
      buffer: Buffer.from('<svg xmlns="http://www.w3.org/2000/svg" width="120" height="80"><rect width="120" height="80" fill="#cde"/></svg>')
    },
    {
      name: 'dog.svg',
      mimeType: 'image/svg+xml',
      buffer: Buffer.from('<svg xmlns="http://www.w3.org/2000/svg" width="80" height="120"><rect width="80" height="120" fill="#dec"/></svg>')
    },
    {
      name: 'not-an-image.txt',
      mimeType: 'text/plain',
      buffer: Buffer.from('not an image')
    }
  ]);
  await openTeacherDestination(page, 'today');
  await page.locator('#newPupilName').fill('Pupil B');
  await page.locator('#addPupil').click();
  await expect(page.locator('#bulkUploadStatus')).toContainText('2 imported, 1 failed', { timeout: 15_000 });
  await openTeacherDestination(page, 'personalise');
  await expect(page.locator('#photoLibraryList .photoCard')).toHaveCount(0);

  await openTeacherDestination(page, 'today');
  await page.locator('#pupilSelect').selectOption(originalPupil);
  await openTeacherDestination(page, 'personalise');
  await expect(page.locator('#photoLibraryList .photoCard')).toHaveCount(2);
  await expect(page.locator('#photoLibraryList')).toContainText('Animals');
  await expect(page.locator('#photoLibraryList .sourceBadge.personalised')).toHaveCount(2);

  expect(errors, errors.join('\n')).toEqual([]);
});

test('selected photos can be reassigned without losing identity or source', async ({ page }) => {
  const errors = attachErrorTracking(page);
  await gotoApp(page);

  await openTeacherDestination(page, 'personalise');
  await page.locator('#bulkPhotoCategory').selectOption('toy');
  await page.locator('#customUpload').setInputFiles([
    {
      name: 'blocks.svg',
      mimeType: 'image/svg+xml',
      buffer: Buffer.from('<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100"><rect width="100" height="100" fill="#fd8"/></svg>')
    },
    {
      name: 'ball.svg',
      mimeType: 'image/svg+xml',
      buffer: Buffer.from('<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100"><circle cx="50" cy="50" r="45" fill="#8df"/></svg>')
    }
  ]);
  await expect(page.locator('#bulkUploadStatus')).toContainText('2 imported', { timeout: 15_000 });
  const originalIds = await page.locator('#photoLibraryList .photoCard').evaluateAll(cards => cards.map(card => card.dataset.photoId).sort());
  await page.locator('#selectAllPhotosBtn').click();
  await page.locator('#bulkMoveCategory').selectOption('classroom');
  await page.locator('#bulkMoveBtn').click();
  await expect(page.locator('#photoLibraryList')).toContainText('Classroom objects');
  const movedIds = await page.locator('#photoLibraryList .photoCard').evaluateAll(cards => cards.map(card => card.dataset.photoId).sort());
  expect(movedIds).toEqual(originalIds);
  await expect(page.locator('#photoLibraryList .sourceBadge.personalised')).toHaveCount(2);

  expect(errors, errors.join('\n')).toEqual([]);
});

test('photo crop and rotation are non-destructive and persist after reload', async ({ page }) => {
  const errors = attachErrorTracking(page);
  await gotoApp(page);

  await openTeacherDestination(page, 'personalise');
  await page.locator('#photoLabel').fill('Landscape scene');
  await page.locator('#photoCategory').selectOption('classroom');
  await page.locator('#photoUpload').setInputFiles({
    name: 'landscape.svg',
    mimeType: 'image/svg+xml',
    buffer: Buffer.from('<svg xmlns="http://www.w3.org/2000/svg" width="240" height="100"><rect width="240" height="100" fill="#def"/><circle cx="210" cy="50" r="30" fill="#f90"/></svg>')
  });
  await page.locator('#addPhotoBtn').click();
  await expect(page.locator('#photoLibraryList')).toContainText('Landscape scene');
  await expect(page.locator('#photoLibraryList .photoThumb img')).toHaveCSS('object-fit', 'contain');
  await page.locator('#photoLibraryList button:has-text("Crop / rotate")').click();
  await expect(page.locator('#imageEditor')).toBeVisible();
  await page.locator('#imageEditorSquare').check();
  await page.locator('#imageEditorRotation').selectOption('90');
  await page.locator('#imageEditorZoom').fill('1.5');
  await page.locator('#imageEditorApply').click();
  await expect(page.locator('#imageEditor')).toBeHidden({ timeout: 15_000 });
  await page.reload();
  await openTeacherDestination(page, 'personalise');
  await page.locator('#photoLibraryList button:has-text("Crop / rotate")').click();
  await expect(page.locator('#imageEditorSquare')).toBeChecked();
  await expect(page.locator('#imageEditorRotation')).toHaveValue('90');
  await expect(page.locator('#imageEditorZoom')).toHaveValue('1.5');
  await page.locator('#imageEditorReset').click();
  await expect(page.locator('#imageEditorSquare')).not.toBeChecked();
  await expect(page.locator('#imageEditorRotation')).toHaveValue('0');
  await page.locator('#imageEditorCancel').click();

  expect(errors, errors.join('\n')).toEqual([]);
});

test('Find object enforces category and source filters and records its snapshot', async ({ page }) => {
  const errors = attachErrorTracking(page);
  await gotoApp(page);
  await configureSession(page, {
    startLevel: 4,
    sessionMax: 1,
    autoAdvance: true,
    autoLevelPath: false,
    sessionTaskType: 'find-object'
  });
  await page.locator('#teacherPanelTab').click();
  await setCategorySelection(page, 'findObjectCategoryList', ['animals']);
  await page.locator('#findObjectSourceMode').selectOption('stock');
  await expect(page.locator('#findObjectConfigSummary')).toContainText('3 distinct usable items');
  await page.locator('#beginFlow').click();
  await waitForChoiceScreen(page);
  const optionIds = await page.locator('#choiceGrid .choice').evaluateAll(nodes => nodes.map(node => node.dataset.id));
  expect(optionIds.length).toBeGreaterThanOrEqual(2);
  expect(optionIds.every(id => id.startsWith('animal-'))).toBeTruthy();
  await clickCorrectChoice(page);
  await waitForSummaryScreen(page);
  const payload = await exportJsonAfter(page, async () => page.locator('#summaryExport').click());
  expect(payload.content_configuration.find_object.source_mode).toBe('stock');
  expect(payload.content_configuration.find_object.selected_categories.map(item => item.id)).toEqual(['animals']);
  expect(payload.trials[0].option_metadata.every(item => item.source === 'stock')).toBeTruthy();
  expect(JSON.stringify(payload)).not.toContain('data:image');

  expect(errors, errors.join('\n')).toEqual([]);
});

test('Find object blocks an empty personalised-only selection', async ({ page }) => {
  const errors = attachErrorTracking(page);
  await gotoApp(page);
  await page.locator('#sessionTaskType').selectOption('find-object');
  await setCategorySelection(page, 'findObjectCategoryList', ['animals']);
  await page.locator('#findObjectSourceMode').selectOption('personalised');
  await page.locator('#beginFlow').click();
  await expect(page.locator('#screenWelcome.active')).toBeVisible();
  await expect(page.locator('#sessionSetupStatus')).toContainText('at least two differently labelled usable items');

  expect(errors, errors.join('\n')).toEqual([]);
});

test('Find category requires two fair usable categories and generates a natural prompt', async ({ page }) => {
  const errors = attachErrorTracking(page);
  await gotoApp(page);
  await page.locator('#sessionTaskType').selectOption('find-category');
  await setCategorySelection(page, 'findCategoryCategoryList', ['animals']);
  await page.locator('#findCategorySourceMode').selectOption('stock');
  await page.locator('#beginFlow').click();
  await expect(page.locator('#sessionSetupStatus')).toContainText('at least two selected categories');

  await page.locator('#findCategoryCategoryList input[data-category-id="transport"]').check();
  await expect(page.locator('#findCategoryConfigSummary')).toContainText('2 can produce fair');
  await page.locator('#beginFlow').click();
  await waitForChoiceScreen(page);
  await expect(page.locator('#questionText')).toContainText(/animal|transport/i);
  const ids = await page.locator('#choiceGrid .choice').evaluateAll(nodes => nodes.map(node => node.dataset.id));
  expect(ids.every(id => id.startsWith('animal-') || id.startsWith('transport-'))).toBeTruthy();

  expect(errors, errors.join('\n')).toEqual([]);
});

test('Plain White is readable, persists, and is included in exports', async ({ page }) => {
  const errors = attachErrorTracking(page);
  await gotoApp(page);
  await page.locator('#themeChoice').selectOption('plain-white');
  await expect(page.locator('body')).toHaveClass(/theme-plain-white/);
  const stageSurface = await page.locator('.playArea').evaluate(node => {
    const token = getComputedStyle(document.body).getPropertyValue('--surface-subtle').trim();
    const probe = document.createElement('span');
    probe.style.backgroundColor = token;
    document.body.appendChild(probe);
    const expected = getComputedStyle(probe).backgroundColor;
    probe.remove();
    return { actual: getComputedStyle(node).backgroundColor, expected };
  });
  expect(stageSurface.actual).toBe(stageSurface.expected);
  await page.waitForTimeout(300);
  await page.reload();
  await expect(page.locator('#themeChoice')).toHaveValue('plain-white');
  await startConfiguredSession(page, { startLevel: 2, sessionMax: 1, autoAdvance: true });
  await clickCorrectChoice(page);
  await waitForSummaryScreen(page);
  const payload = await exportJsonAfter(page, async () => page.locator('#summaryExport').click());
  expect(payload.theme_used).toBe('plain-white');

  expect(errors, errors.join('\n')).toEqual([]);
});

test('visual review captures Plain White, mixed image framing, and tablet learner mode', async ({ page }) => {
  const errors = attachErrorTracking(page);
  const visualDir = 'test-results/visual-review';
  fs.mkdirSync(visualDir, { recursive: true });
  await page.setViewportSize({ width: 1440, height: 1000 });
  await gotoApp(page);
  await page.locator('#themeChoice').selectOption('plain-white');
  await page.screenshot({ path: `${visualDir}/plain-white-desktop.png`, fullPage: true });

  await openTeacherDestination(page, 'personalise');
  await page.locator('#bulkPhotoCategory').selectOption('people');
  await page.locator('#customUpload').setInputFiles([
    {
      name: 'portrait.svg',
      mimeType: 'image/svg+xml',
      buffer: Buffer.from('<svg xmlns="http://www.w3.org/2000/svg" width="100" height="240"><rect width="100" height="240" fill="#d9e9f5"/><circle cx="50" cy="45" r="35" fill="#f3a25f"/><rect x="30" y="90" width="40" height="130" fill="#2878a8"/></svg>')
    },
    {
      name: 'landscape.svg',
      mimeType: 'image/svg+xml',
      buffer: Buffer.from('<svg xmlns="http://www.w3.org/2000/svg" width="260" height="100"><rect width="260" height="100" fill="#e7efd9"/><circle cx="220" cy="50" r="34" fill="#e49a3a"/><rect x="10" y="72" width="240" height="18" fill="#477c4a"/></svg>')
    }
  ]);
  await expect(page.locator('#bulkUploadStatus')).toContainText('2 imported', { timeout: 15_000 });
  await page.locator('#photoLibraryList button:has-text("Crop / rotate")').first().click();
  await expect(page.locator('#imageEditor')).toBeVisible();
  await page.screenshot({ path: `${visualDir}/image-editor-desktop.png` });
  await page.locator('#imageEditorCancel').click();

  await page.setViewportSize({ width: 1024, height: 768 });
  await openTeacherDestination(page, 'today');
  await page.locator('#sessionTaskType').selectOption('find-object');
  await setCategorySelection(page, 'findObjectCategoryList', ['animals']);
  await page.locator('#findObjectSourceMode').selectOption('stock');
  await page.locator('#learnerModeBtn').click();
  await page.locator('#beginFlow').click();
  await waitForChoiceScreen(page);
  await page.screenshot({ path: `${visualDir}/tablet-learner-find-object.png` });

  expect(errors, errors.join('\n')).toEqual([]);
});
