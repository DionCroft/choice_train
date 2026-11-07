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
  await expect(page.locator('#beginFlow')).toBeVisible();
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
  expect(runtimeErrors).toEqual([]);
  expect(externalRequests).toEqual([]);
});
