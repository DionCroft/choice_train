const fs = require('fs');
const { test, expect } = require('@playwright/test');

const APP_PATH = '/choice_train_V1.7.0-alpha.html';

function trackErrors(page) {
  const errors = [];
  page.on('pageerror', error => errors.push(`pageerror: ${error.message}`));
  page.on('console', message => {
    if (message.type() === 'error') errors.push(`console: ${message.text()}`);
  });
  return errors;
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

async function exportJson(page) {
  const downloadPromise = page.waitForEvent('download');
  await page.locator('#exportBtn').click();
  const download = await downloadPromise;
  return JSON.parse(fs.readFileSync(await download.path(), 'utf8'));
}

test('V1.7.0 alpha loads its isolated product shell without browser errors', async ({ page }) => {
  const errors = trackErrors(page);
  await gotoAlpha(page);
  await expect(page).toHaveTitle(/V1\.7\.0-alpha/);
  await expect(page.locator('#versionInfo')).toContainText('V1.7.0-alpha');
  await expect(page.locator('.alphaRibbon')).toContainText('V1.7.0 alpha');
  await expect(page.locator('#aboutSourceFile')).toHaveText('choice_train_V1.7.0-alpha.html');
  await expect(page.locator('body')).toHaveClass(/panel-view-teacher/);
  expect(errors, errors.join('\n')).toEqual([]);
});

test('alpha loads without making external runtime requests', async ({ page }) => {
  const requests = [];
  page.on('request', request => requests.push(request.url()));
  await gotoAlpha(page);
  await page.locator('#soundPreviewBtn').click();
  const appOrigin = new URL(page.url()).origin;
  const external = requests.filter(url => {
    const protocol = new URL(url).protocol;
    return !['data:', 'blob:'].includes(protocol) && new URL(url).origin !== appOrigin;
  });
  expect(external).toEqual([]);
});

test('teacher shell uses the bundled high-legibility font and accessible contrast', async ({ page }) => {
  await gotoAlpha(page);
  const result = await page.locator('.panel').evaluate(node => {
    const luminance = colour => {
      const values = colour.match(/[\d.]+/g).slice(0, 3).map(value => Number(value) / 255);
      const linear = values.map(value => value <= 0.03928 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4);
      return 0.2126 * linear[0] + 0.7152 * linear[1] + 0.0722 * linear[2];
    };
    const style = getComputedStyle(node);
    const text = luminance(style.color);
    const background = luminance(style.backgroundColor);
    const ratio = (Math.max(text, background) + 0.05) / (Math.min(text, background) + 0.05);
    return { font: style.fontFamily, ratio };
  });
  expect(result.font).toContain('Atkinson Hyperlegible Next');
  expect(result.ratio).toBeGreaterThanOrEqual(7);
});

test('admin and research workspace is separate and uses the full viewport', async ({ page }) => {
  await gotoAlpha(page);
  await page.locator('#adminPanelTab').click();
  await expect(page.locator('body')).toHaveClass(/panel-view-admin/);
  await expect(page.locator('#adminPanelDetails')).toBeVisible();
  await expect(page.locator('.main')).toBeHidden();
  await expect(page.locator('.modeBar')).toBeHidden();
  const panelWidth = await page.locator('.panel').evaluate(node => node.getBoundingClientRect().width);
  expect(panelWidth).toBeGreaterThan(900);
});

test('admin navigation opens the correct research and system destinations', async ({ page }) => {
  await gotoAlpha(page);
  await page.locator('#adminPanelTab').click();
  await expect(page.locator('#adminResearchWorkspace')).toHaveAttribute('open', '');
  await expect(page.locator('#adminNavOverview')).toHaveAttribute('aria-pressed', 'true');
  await page.locator('#adminNavSessions').click();
  await expect(page.locator('#adminNavSessions')).toHaveAttribute('aria-pressed', 'true');
  await expect(page.locator('#adminHistorySection')).toBeVisible();
  await page.locator('#adminNavLearners').click();
  await expect(page.locator('#adminLearnerProfileSection')).toBeVisible();
  await page.locator('#adminNavEeg').click();
  await expect(page.locator('#adminEegSection')).toBeVisible();
  await page.locator('#adminNavSystem').click();
  await expect(page.locator('#adminPanelDetails')).toHaveAttribute('open', '');
});

test('admin export centre provides a complete local session export', async ({ page }) => {
  await gotoAlpha(page);
  await page.locator('#adminPanelTab').click();
  const downloadPromise = page.waitForEvent('download');
  await page.locator('#adminExportSessionBtn').click();
  const download = await downloadPromise;
  expect(download.suggestedFilename()).toMatch(/^ChoiceTrain_.+_session\.json$/);
  const payload = JSON.parse(fs.readFileSync(await download.path(), 'utf8'));
  expect(payload.build.version).toBe('1.7.0-alpha');
  expect(payload).toHaveProperty('trials');
  expect(payload).toHaveProperty('eeg_markers');
  expect(payload).toHaveProperty('sensory_preferences');
});

test('teacher navigation shows one focused workflow at a time', async ({ page }) => {
  await gotoAlpha(page);
  await expect(page.locator('details[data-teacher-view="today"]').first()).toBeVisible();
  await expect(page.locator('details[data-teacher-view="personalise"]')).toBeHidden();
  await page.locator('#teacherNavPersonalise').click();
  await expect(page.locator('body')).toHaveClass(/teacher-page-personalise/);
  await expect(page.locator('details[data-teacher-view="personalise"]')).toBeVisible();
  await expect(page.locator('details[data-teacher-view="today"]').first()).toBeHidden();
  await page.locator('#teacherNavResults').click();
  await expect(page.locator('details[data-teacher-view="results"]')).toBeVisible();
  await expect(page.locator('#teacherNavResults')).toHaveAttribute('aria-pressed', 'true');
});

test('single teacher action starts a configured learner session', async ({ page }) => {
  await gotoAlpha(page);
  await setCheckbox(page, 'ttsToggle', false);
  await setCheckbox(page, 'useTwoStage', false);
  await setCheckbox(page, 'useReward', false);
  await setCheckbox(page, 'autoAdvance', false);
  await setValue(page, 'startLevel', 2);
  await setValue(page, 'sessionMax', 1);
  await page.locator('#quickStartSessionBtn').click();
  await expect(page.locator('.panel')).toBeHidden();
  await expect(page.locator('#screenChoice.active')).toBeVisible();
  await expect(page.locator('#choiceGrid [data-role="correct-target"]')).toBeVisible();
});

test('sensory and display preferences persist and apply immediately', async ({ page }) => {
  await gotoAlpha(page);
  await setValue(page, 'fontChoice', 'familiar');
  await setValue(page, 'textScale', '1.15');
  await setValue(page, 'motionPreference', 'reduced');
  await setValue(page, 'feedbackSoundMode', 'off');
  await setValue(page, 'celebrationIntensity', 'quiet');
  await expect(page.locator('body')).toHaveClass(/font-familiar/);
  await expect(page.locator('body')).toHaveClass(/motion-reduced/);
  await expect(page.locator('#preferencePreview')).toContainText('115% text');
  await page.waitForTimeout(350);
  await page.reload();
  await expect(page.locator('#fontChoice')).toHaveValue('familiar');
  await expect(page.locator('#textScale')).toHaveValue('1.15');
  await expect(page.locator('#motionPreference')).toHaveValue('reduced');
  await expect(page.locator('#feedbackSoundMode')).toHaveValue('off');
  await expect(page.locator('#celebrationIntensity')).toHaveValue('quiet');
});

test('reduced motion preference suppresses non-essential transitions', async ({ page }) => {
  await gotoAlpha(page);
  await setValue(page, 'motionPreference', 'reduced');
  const timing = await page.locator('#rewardTrain').evaluate(node => {
    const style = getComputedStyle(node);
    return {
      animation: parseFloat(style.animationDuration) || 0,
      transition: parseFloat(style.transitionDuration) || 0
    };
  });
  expect(timing.animation).toBeLessThanOrEqual(0.001);
  expect(timing.transition).toBeLessThanOrEqual(0.001);
});

test('learner view hides configuration and provides a deliberate teacher return', async ({ page }) => {
  await gotoAlpha(page);
  await page.locator('#learnerModeBtn').click();
  await expect(page.locator('.panel')).toBeHidden();
  await expect(page.locator('#adminModeFab')).toBeHidden();
  await expect(page.locator('#teacherExitHold')).toBeVisible();
  const viewportFit = await page.evaluate(() => ({ height: innerHeight, scrollHeight: document.documentElement.scrollHeight }));
  expect(viewportFit.scrollHeight).toBeLessThanOrEqual(viewportFit.height + 2);
  const footerContrast = await page.locator('.footerBar').evaluate(node => {
    const luminance = colour => {
      const values = colour.match(/[\d.]+/g).slice(0, 3).map(value => Number(value) / 255);
      const linear = values.map(value => value <= 0.03928 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4);
      return 0.2126 * linear[0] + 0.7152 * linear[1] + 0.0722 * linear[2];
    };
    const style = getComputedStyle(node);
    const foreground = luminance(style.color);
    const background = luminance(style.backgroundColor);
    return (Math.max(foreground, background) + 0.05) / (Math.min(foreground, background) + 0.05);
  });
  expect(footerContrast).toBeGreaterThanOrEqual(4.5);
  await page.locator('#teacherExitHold').dispatchEvent('pointerdown', { button: 0 });
  await page.waitForTimeout(1300);
  await expect(page.locator('.panel')).toBeVisible();
  await expect(page.locator('body')).toHaveClass(/panel-view-teacher/);
});

test('reward journey advances after a completed learner response', async ({ page }) => {
  await gotoAlpha(page);
  await setCheckbox(page, 'ttsToggle', false);
  await setCheckbox(page, 'useTwoStage', false);
  await setCheckbox(page, 'useReward', true);
  await setCheckbox(page, 'autoAdvance', false);
  await setValue(page, 'sessionMax', 1);
  await setValue(page, 'startLevel', 2);
  await page.locator('#beginFlow').click();
  await expect(page.locator('#screenChoice.active')).toBeVisible();
  await page.locator('#choiceGrid [data-role="correct-target"]').first().click();
  await expect(page.locator('#screenReward.active')).toBeVisible();
  await expect(page.locator('#rewardJourneyLabel')).toContainText('station');
  await expect(page.locator('#rewardRailFill')).toHaveCSS('width', /.+/);
  const progress = await page.locator('#rewardRailFill').evaluate(node => parseFloat(node.style.width));
  expect(progress).toBe(100);
});

test('alpha exports include sensory preferences and sound metadata', async ({ page }) => {
  await gotoAlpha(page);
  await setValue(page, 'themeChoice', 'calm-light');
  await setValue(page, 'fontChoice', 'high-legibility');
  await setValue(page, 'textScale', '1.3');
  await setValue(page, 'motionPreference', 'gentle');
  await setValue(page, 'feedbackSoundMode', 'low');
  await setValue(page, 'celebrationIntensity', 'lively');
  await page.locator('#soundPreviewBtn').click();
  const payload = await exportJson(page);
  expect(payload.build.version).toBe('1.7.0-alpha');
  expect(payload.schema_version).toBe(4);
  expect(payload.session_overview.theme_used).toBe('calm-light');
  expect(payload.session_overview.sensory_preferences).toEqual({
    font: 'high-legibility',
    text_scale: 1.3,
    motion: 'gentle',
    feedback_sound: 'low',
    celebration_intensity: 'lively'
  });
  expect(payload.eeg_markers.some(marker => marker.name === 'audio_onset' && marker.sound_id === 'preview')).toBe(true);
});

test('tablet learner layout keeps large controls and a two-column choice surface', async ({ page }) => {
  await page.setViewportSize({ width: 820, height: 1180 });
  await gotoAlpha(page);
  await setCheckbox(page, 'ttsToggle', false);
  await setCheckbox(page, 'useTwoStage', false);
  await setCheckbox(page, 'useReward', false);
  await setCheckbox(page, 'autoAdvance', false);
  await setValue(page, 'startLevel', 4);
  await setValue(page, 'sessionMax', 1);
  await page.locator('#learnerModeBtn').click();
  await page.locator('#beginFlow').click();
  await expect(page.locator('#screenChoice.active')).toBeVisible();
  const target = page.locator('#choiceGrid button.choice').first();
  const box = await target.boundingBox();
  expect(box.width).toBeGreaterThanOrEqual(150);
  expect(box.height).toBeGreaterThanOrEqual(180);
});

test('mobile learner layout stays within the viewport', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await gotoAlpha(page);
  await setCheckbox(page, 'ttsToggle', false);
  await setCheckbox(page, 'useTwoStage', false);
  await setCheckbox(page, 'useReward', false);
  await setCheckbox(page, 'autoAdvance', false);
  await setValue(page, 'startLevel', 2);
  await setValue(page, 'sessionMax', 1);
  await page.locator('#quickStartSessionBtn').click();
  await expect(page.locator('#screenChoice.active')).toBeVisible();
  const dimensions = await page.evaluate(() => ({
    width: innerWidth,
    scrollWidth: document.documentElement.scrollWidth,
    height: innerHeight,
    scrollHeight: document.documentElement.scrollHeight
  }));
  expect(dimensions.scrollWidth).toBeLessThanOrEqual(dimensions.width + 2);
  expect(dimensions.scrollHeight).toBeLessThanOrEqual(dimensions.height + 2);
  const returnBox = await page.locator('#teacherExitHold').boundingBox();
  expect(returnBox.width).toBeGreaterThanOrEqual(44);
  expect(returnBox.height).toBeGreaterThanOrEqual(44);
});
