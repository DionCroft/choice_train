const { test, expect } = require('@playwright/test');

const APP_PATH = '/choice_train_V1.8.0-alpha.html';

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

test('V1.8 learner pacing and Q&A layout remain usable in the compatibility profile', async ({ page }, testInfo) => {
  const runtimeErrors = [];
  const externalRequests = [];
  page.on('pageerror', error => runtimeErrors.push(error.message));
  page.on('console', message => {
    if(message.type() === 'error') runtimeErrors.push(message.text());
  });
  page.on('request', request => {
    const url = new URL(request.url());
    if(!['127.0.0.1', 'localhost'].includes(url.hostname)) externalRequests.push(request.url());
  });

  await page.goto(APP_PATH);
  await expect(page.locator('#teacherPanelTab')).toBeVisible();
  await expect(page.locator('#beginFlow')).toBeAttached();
  await expect(page).toHaveTitle(/V1\.8\.0-alpha/);

  await setValue(page, 'sessionTaskType', 'find-object');
  await setValue(page, 'startLevel', 4);
  await setValue(page, 'sessionMax', 1);
  await setValue(page, 'maxObjects', 4);
  await setValue(page, 'delaySec', 0.5);
  await setValue(page, 'blankIntervalSec', 0.5);
  await setCheckbox(page, 'useTwoStage', false);
  await setCheckbox(page, 'useBlankInterval', true);
  await setCheckbox(page, 'useReward', false);
  await setCheckbox(page, 'ttsToggle', false);

  await page.locator('#quickStartSessionBtn').click();
  await expect(page.locator('#screenPrompt.active')).toBeVisible();
  await expect(page.locator('#screenBlank.active')).toBeVisible({ timeout: 2_000 });
  await expect(page.locator('#screenChoice.active')).toBeVisible({ timeout: 2_000 });

  const layout = await page.evaluate(() => {
    const bounds = selector => document.querySelector(selector).getBoundingClientRect();
    const stage = bounds('.stage');
    const playArea = bounds('#playArea');
    const footer = bounds('.footerBar');
    const choices = Array.from(document.querySelectorAll('#choiceGrid .choice')).map(node => {
      const rect = node.getBoundingClientRect();
      return { top: rect.top, right: rect.right, bottom: rect.bottom, left: rect.left };
    });
    return {
      viewportWidth: document.documentElement.clientWidth,
      viewportHeight: window.innerHeight,
      documentWidth: document.documentElement.scrollWidth,
      stageBottom: stage.bottom,
      footerBottom: footer.bottom,
      playArea: {
        top: playArea.top,
        right: playArea.right,
        bottom: playArea.bottom,
        left: playArea.left
      },
      choices
    };
  });

  expect(layout.choices, `${testInfo.project.name} should render four choices`).toHaveLength(4);
  expect(layout.documentWidth).toBeLessThanOrEqual(layout.viewportWidth + 1);
  expect(layout.stageBottom).toBeLessThanOrEqual(layout.viewportHeight + 1);
  expect(layout.footerBottom).toBeLessThanOrEqual(layout.viewportHeight + 1);
  layout.choices.forEach(rect => {
    expect(rect.left).toBeGreaterThanOrEqual(layout.playArea.left - 1);
    expect(rect.right).toBeLessThanOrEqual(layout.playArea.right + 1);
    expect(rect.top).toBeGreaterThanOrEqual(layout.playArea.top - 1);
    expect(rect.bottom).toBeLessThanOrEqual(layout.playArea.bottom + 1);
  });

  await page.locator('#choiceGrid [data-role="correct-target"]').first().click();
  await expect(page.locator('#screenSummary.active')).toBeVisible();
  await page.locator('#teacherExitHold').focus();
  await page.locator('#teacherExitHold').press('Enter');
  await page.locator('#adminPanelTab').click();
  await page.locator('#adminNavResearch').click();
  await expect(page.locator('#researchDeliveryCoverage')).toHaveText('1/1');
  await expect(page.locator('#researchDeliveryContextChart')).toBeVisible();
  await expect(page.locator('#researchDeliveryContextBody')).toContainText('CSS px');
  expect(runtimeErrors).toEqual([]);
  expect(externalRequests).toEqual([]);
});

test('V1.8 teacher and admin navigation remain reachable in the compatibility profile', async ({ page }, testInfo) => {
  const runtimeErrors = [];
  page.on('pageerror', error => runtimeErrors.push(error.message));
  page.on('console', message => {
    if(message.type() === 'error') runtimeErrors.push(message.text());
  });

  await page.goto(APP_PATH);
  await expect(page.locator('#teacherPanelTab')).toBeVisible();
  await setValue(page, 'textScale', 1.3);

  await page.locator('#adminPanelTab').click();
  await expect(page.locator('#adminNavOverview')).toBeVisible();
  await page.locator('#adminNavResearch').click();
  await expect(page.locator('#researchScopeSelect')).toBeVisible();
  await page.locator('#adminNavSystem').click();
  await expect(page.locator('#adminDeviceReadinessSection')).toBeVisible();
  await page.locator('#refreshDeviceReadinessBtn').click();
  await expect(page.locator('#deviceReadinessStatus')).toContainText('supporting evidence only');
  await expect(page.locator('#deviceReadinessTableBody tr')).toHaveCount(14);

  const layout = await page.evaluate(() => ({
    viewportWidth: document.documentElement.clientWidth,
    documentWidth: document.documentElement.scrollWidth,
    tabs: Array.from(document.querySelectorAll('#teacherPanelTab, #adminPanelTab')).map(node => {
      const rect = node.getBoundingClientRect();
      return { left: rect.left, right: rect.right };
    }),
    navigation: Array.from(document.querySelectorAll('.adminWorkspaceNav button')).map(node => {
      const rect = node.getBoundingClientRect();
      return { left: rect.left, right: rect.right, height: rect.height };
    })
  }));

  expect(layout.documentWidth, `${testInfo.project.name} should not overflow horizontally`).toBeLessThanOrEqual(layout.viewportWidth + 1);
  [...layout.tabs, ...layout.navigation].forEach(rect => {
    expect(rect.left).toBeGreaterThanOrEqual(0);
    expect(rect.right).toBeLessThanOrEqual(layout.viewportWidth + 1);
  });
  layout.navigation.forEach(rect => expect(rect.height).toBeGreaterThanOrEqual(44));
  expect(runtimeErrors).toEqual([]);
});
