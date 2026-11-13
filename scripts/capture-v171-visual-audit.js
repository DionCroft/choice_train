const fs = require('fs');
const http = require('http');
const path = require('path');
const { spawn } = require('child_process');
const { chromium } = require('@playwright/test');

const rootDir = path.resolve(__dirname, '..');
const baseUrl = 'http://127.0.0.1:4173/choice_train_V1.7.1.html';
const outputDir = path.join(rootDir, 'test-results', 'v171-visual-audit');
let serverProcess = null;

function wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function waitForServer(timeoutMs = 20_000) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    try {
      await new Promise((resolve, reject) => {
        const request = http.get(baseUrl, response => {
          response.resume();
          response.statusCode === 200 ? resolve() : reject(new Error(`HTTP ${response.statusCode}`));
        });
        request.on('error', reject);
      });
      return;
    } catch (_error) {
      await wait(200);
    }
  }
  throw new Error(`Timed out waiting for ${baseUrl}`);
}

async function setValue(page, id, value) {
  await page.locator(`#${id}`).evaluate((node, nextValue) => {
    node.value = String(nextValue);
    node.dispatchEvent(new Event('input', { bubbles: true }));
    node.dispatchEvent(new Event('change', { bubbles: true }));
  }, value);
}

async function setCheckbox(page, id, checked) {
  await page.locator(`#${id}`).evaluate((node, nextValue) => {
    node.checked = nextValue;
    node.dispatchEvent(new Event('input', { bubbles: true }));
    node.dispatchEvent(new Event('change', { bubbles: true }));
  }, checked);
}

async function configureLearner(page, options = {}) {
  await setCheckbox(page, 'ttsToggle', false);
  await setCheckbox(page, 'useTwoStage', false);
  await setCheckbox(page, 'useReward', options.reward !== false);
  await setCheckbox(page, 'autoAdvance', false);
  await setValue(page, 'themeChoice', options.theme || 'calm-light');
  await setValue(page, 'startLevel', options.level || 4);
  await setValue(page, 'sessionMax', options.questions || 2);
  if (options.task) await setValue(page, 'sessionTaskType', options.task);
  if (options.maxObjects) await setValue(page, 'maxObjects', options.maxObjects);
  await page.locator('#quickStartSessionBtn').click();
  await page.locator('#screenChoice.active').waitFor({ state: 'visible' });
}

async function capture(browser, manifest, name, viewport, setup) {
  const context = await browser.newContext({ viewport });
  const page = await context.newPage();
  await page.goto(baseUrl, { waitUntil: 'networkidle' });
  if (setup) await setup(page);
  await page.waitForTimeout(180);
  const filename = `${name}-${viewport.width}x${viewport.height}.png`;
  await page.screenshot({ path: path.join(outputDir, filename), fullPage: false });
  const layout = await page.evaluate(() => {
    const bounds = selector => {
      const node = document.querySelector(selector);
      if (!node) return null;
      const rect = node.getBoundingClientRect();
      return { top: Math.round(rect.top), left: Math.round(rect.left), width: Math.round(rect.width), height: Math.round(rect.height) };
    };
    return {
      scroll_x: Math.round(scrollX),
      scroll_y: Math.round(scrollY),
      document_width: document.documentElement.scrollWidth,
      document_height: document.documentElement.scrollHeight,
      panel: bounds('.panel'),
      panel_header: bounds('.panel > .section:first-child'),
      brand_row: bounds('.brandRow'),
      panel_switch: bounds('.panelSwitch'),
      admin_navigation: bounds('.adminWorkspaceNav'),
      admin_target: bounds('#adminAnalyticsSection'),
      main: bounds('.main'),
      play_area: bounds('#playArea')
    };
  });
  manifest.push({
    name,
    viewport,
    filename,
    theme: await page.locator('body').getAttribute('data-learner-theme'),
    layout
  });
  await context.close();
}

async function main() {
  fs.mkdirSync(outputDir, { recursive: true });
  serverProcess = spawn(process.execPath, [path.join(__dirname, 'static-server.js')], {
    cwd: rootDir,
    stdio: 'ignore'
  });
  await waitForServer();
  const browser = await chromium.launch({ headless: true });
  const manifest = [];
  const desktop = { width: 1440, height: 1000 };

  try {
    await capture(browser, manifest, 'teacher-workspace', desktop);
    await capture(browser, manifest, 'admin-overview', desktop, page => page.locator('#adminPanelTab').click());
    await capture(browser, manifest, 'learner-active-calm-light', { width: 1440, height: 900 }, page => configureLearner(page));
    await capture(browser, manifest, 'learner-active-low-stimulation-dark', { width: 1440, height: 900 }, page => configureLearner(page, { theme: 'low-stimulation-dark' }));
    await capture(browser, manifest, 'learner-reward', { width: 1440, height: 900 }, async page => {
      await configureLearner(page, { reward: true });
      await page.locator('#choiceGrid [data-role="correct-target"]').first().click();
      await page.locator('#screenReward.active').waitFor({ state: 'visible' });
    });
    await capture(browser, manifest, 'learner-feedback-no-reward', { width: 1440, height: 900 }, async page => {
      await configureLearner(page, { reward: false });
      await page.locator('#choiceGrid button.choice:not([data-role="correct-target"])').first().click();
      await page.locator('#screenReward.active.feedbackOnly').waitFor({ state: 'visible' });
    });
    await capture(browser, manifest, 'learner-break', { width: 1440, height: 900 }, async page => {
      await configureLearner(page);
      await page.locator('#learnerBreakBtn').click();
      await page.locator('#screenBreak.active').waitFor({ state: 'visible' });
    });
    await capture(browser, manifest, 'learner-tablet', { width: 820, height: 1180 }, page => configureLearner(page));
    await capture(browser, manifest, 'learner-mobile', { width: 390, height: 844 }, page => configureLearner(page, { level: 2 }));
    await capture(browser, manifest, 'six-choice-ipad', { width: 768, height: 1024 }, page => configureLearner(page, { level: 6, task: 'find-object', maxObjects: 6 }));
    await capture(browser, manifest, 'six-choice-kindle', { width: 600, height: 960 }, page => configureLearner(page, { level: 6, task: 'find-object', maxObjects: 6 }));
    await capture(browser, manifest, 'six-choice-short-laptop', { width: 1366, height: 768 }, page => configureLearner(page, { level: 6, task: 'find-object', maxObjects: 6 }));

    const themes = ['calm-light', 'calm-blue', 'soft-green', 'warm-neutral', 'high-contrast', 'low-stimulation-dark', 'light-classroom', 'plain-white'];
    for (const theme of themes) {
      await capture(browser, manifest, `theme-${theme}`, { width: 1280, height: 800 }, page => configureLearner(page, { theme, level: 8 }));
    }
  } finally {
    await browser.close();
    if (serverProcess && !serverProcess.killed) serverProcess.kill('SIGTERM');
  }

  fs.writeFileSync(
    path.join(outputDir, 'manifest.json'),
    `${JSON.stringify({ generated_at: new Date().toISOString(), captures: manifest }, null, 2)}\n`
  );
  process.stdout.write(`Captured ${manifest.length} V1.7.1 visual-audit views in ${outputDir}\n`);
}

main().catch(error => {
  if (serverProcess && !serverProcess.killed) serverProcess.kill('SIGTERM');
  process.stderr.write(`${error.stack || error}\n`);
  process.exit(1);
});
