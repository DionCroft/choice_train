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

test('staff workspace uses one semantic product palette', async ({ page }) => {
  await gotoAlpha(page);
  const audit = await page.evaluate(() => {
    const root = getComputedStyle(document.documentElement);
    const normalise = value => {
      const probe = document.createElement('span');
      probe.style.color = value;
      document.body.appendChild(probe);
      const colour = getComputedStyle(probe).color;
      probe.remove();
      return colour;
    };
    const token = name => normalise(root.getPropertyValue(`--shell-${name}`).trim());
    const rgb = value => (value.match(/[\d.]+/g) || []).slice(0, 3).map(Number);
    const luminance = value => {
      const linear = rgb(value).map(channel => {
        const normal = channel / 255;
        return normal <= 0.04045 ? normal / 12.92 : ((normal + 0.055) / 1.055) ** 2.4;
      });
      return 0.2126 * linear[0] + 0.7152 * linear[1] + 0.0722 * linear[2];
    };
    const contrast = (a, b) => {
      const first = luminance(a);
      const second = luminance(b);
      return (Math.max(first, second) + 0.05) / (Math.min(first, second) + 0.05);
    };
    const background = selector => getComputedStyle(document.querySelector(selector)).backgroundColor;
    const border = selector => getComputedStyle(document.querySelector(selector)).borderTopColor;
    return {
      ratios: {
        text: contrast(token('text'), token('surface')),
        muted: contrast(token('muted'), token('surface')),
        primary: contrast(token('on-primary'), token('primary')),
        primarySoft: contrast(token('primary-text'), token('primary-soft')),
        secondarySoft: contrast(token('secondary-text'), token('secondary-soft')),
        warningSoft: contrast(token('warning-text'), token('warning-soft')),
        fieldBorder: contrast(token('border-strong'), token('field')),
        focus: contrast(token('focus'), token('surface'))
      },
      roles: {
        primaryButton: background('#quickStartSessionBtn'),
        neutralButton: background('#learnerModeBtn'),
        field: background('#pupilAlias'),
        fieldBorder: border('#pupilAlias'),
        teacherTab: background('#teacherPanelTab'),
        warning: background('.alphaRibbon')
      },
      expected: {
        primary: token('primary'),
        control: token('control'),
        field: token('field'),
        fieldBorder: token('border-strong'),
        primarySoft: token('primary-soft'),
        warningSoft: token('warning-soft')
      }
    };
  });
  expect(audit.ratios.text).toBeGreaterThanOrEqual(4.5);
  expect(audit.ratios.muted).toBeGreaterThanOrEqual(4.5);
  expect(audit.ratios.primary).toBeGreaterThanOrEqual(4.5);
  expect(audit.ratios.primarySoft).toBeGreaterThanOrEqual(4.5);
  expect(audit.ratios.secondarySoft).toBeGreaterThanOrEqual(4.5);
  expect(audit.ratios.warningSoft).toBeGreaterThanOrEqual(4.5);
  expect(audit.ratios.fieldBorder).toBeGreaterThanOrEqual(3);
  expect(audit.ratios.focus).toBeGreaterThanOrEqual(3);
  expect(audit.roles.primaryButton).toBe(audit.expected.primary);
  expect(audit.roles.neutralButton).toBe(audit.expected.control);
  expect(audit.roles.field).toBe(audit.expected.field);
  expect(audit.roles.fieldBorder).toBe(audit.expected.fieldBorder);
  expect(audit.roles.teacherTab).toBe(audit.expected.primarySoft);
  expect(audit.roles.warning).toBe(audit.expected.warningSoft);

  await page.locator('#adminPanelTab').click();
  const adminNav = await page.locator('#adminNavOverview').evaluate(node => {
    const probe = document.createElement('span');
    probe.style.color = getComputedStyle(document.documentElement).getPropertyValue('--shell-secondary-soft').trim();
    document.body.appendChild(probe);
    const expected = getComputedStyle(probe).color;
    probe.remove();
    return { actual: getComputedStyle(node).backgroundColor, expected };
  });
  expect(adminNav.actual).toBe(adminNav.expected);
});

test('alpha component styles do not bypass semantic colour tokens', () => {
  const css = fs.readFileSync('choice_train_V1.7.0-alpha.css', 'utf8');
  const componentCss = css.slice(css.indexOf('html {'));
  expect(componentCss).not.toMatch(/#[0-9a-f]{3,8}\b|rgba?\(/i);
});

test('every learner theme supplies a complete accessible semantic palette', async ({ page }) => {
  await gotoAlpha(page);
  const themes = await page.locator('#themeChoice option').evaluateAll(options => options.map(option => option.value));
  const required = [
    'canvas', 'surface', 'surface-subtle', 'surface-raised', 'text', 'text-muted',
    'border', 'border-strong', 'control', 'control-hover', 'primary', 'primary-hover',
    'primary-soft', 'on-primary', 'success', 'success-soft', 'warning', 'warning-soft',
    'danger', 'danger-soft', 'reward', 'reward-soft', 'inverse', 'on-inverse', 'focus',
    'focus-soft', 'scrim', 'shadow', 'stimulus-blue', 'stimulus-green', 'stimulus-amber',
    'stimulus-red', 'stimulus-pink', 'stimulus-violet'
  ];

  for(const theme of themes){
    await setValue(page, 'themeChoice', theme);
    const audit = await page.evaluate(tokens => {
      const style = getComputedStyle(document.documentElement);
      const values = Object.fromEntries(tokens.map(token => [token, style.getPropertyValue(`--${token}`).trim()]));
      const rgb = value => {
        if(value.startsWith('#')){
          const hex = value.slice(1);
          return [0, 2, 4].map(index => parseInt(hex.slice(index, index + 2), 16));
        }
        return (value.match(/[\d.]+/g) || []).slice(0, 3).map(Number);
      };
      const luminance = value => {
        const linear = rgb(value).map(channel => {
          const normal = channel / 255;
          return normal <= 0.04045 ? normal / 12.92 : ((normal + 0.055) / 1.055) ** 2.4;
        });
        return 0.2126 * linear[0] + 0.7152 * linear[1] + 0.0722 * linear[2];
      };
      const contrast = (a, b) => {
        const first = luminance(a);
        const second = luminance(b);
        return (Math.max(first, second) + 0.05) / (Math.min(first, second) + 0.05);
      };
      return {
        missing: tokens.filter(token => !values[token]),
        theme: document.body.dataset.learnerTheme,
        ratios: {
          text: contrast(values.text, values.surface),
          muted: contrast(values['text-muted'], values.surface),
          primary: contrast(values['on-primary'], values.primary),
          inverse: contrast(values['on-inverse'], values.inverse),
          success: contrast(values.success, values.surface),
          warning: contrast(values.warning, values.surface),
          danger: contrast(values.danger, values.surface),
          border: contrast(values.border, values.surface),
          focus: contrast(values.focus, values.surface)
        }
      };
    }, required);
    expect(audit.theme).toBe(theme);
    expect(audit.missing).toEqual([]);
    expect(audit.ratios.text).toBeGreaterThanOrEqual(4.5);
    expect(audit.ratios.muted).toBeGreaterThanOrEqual(4.5);
    expect(audit.ratios.primary).toBeGreaterThanOrEqual(4.5);
    expect(audit.ratios.inverse).toBeGreaterThanOrEqual(4.5);
    expect(audit.ratios.success).toBeGreaterThanOrEqual(4.5);
    expect(audit.ratios.warning).toBeGreaterThanOrEqual(4.5);
    expect(audit.ratios.danger).toBeGreaterThanOrEqual(4.5);
    expect(audit.ratios.border).toBeGreaterThanOrEqual(3);
    expect(audit.ratios.focus).toBeGreaterThanOrEqual(3);
  }
});

test('every learner theme controls the complete active-task surface', async ({ page }) => {
  await gotoAlpha(page);
  await setCheckbox(page, 'ttsToggle', false);
  await setCheckbox(page, 'useTwoStage', false);
  await setCheckbox(page, 'useReward', false);
  await setCheckbox(page, 'autoAdvance', false);
  await setValue(page, 'startLevel', 2);
  await setValue(page, 'sessionMax', 1);
  await page.locator('#quickStartSessionBtn').click();
  await expect(page.locator('#screenChoice.active')).toBeVisible();
  const themes = await page.locator('#themeChoice option').evaluateAll(options => options.map(option => option.value));

  for(const theme of themes){
    await setValue(page, 'themeChoice', theme);
    await page.waitForTimeout(160);
    const audit = await page.evaluate(() => {
      const root = getComputedStyle(document.documentElement);
      const normalise = value => {
        const probe = document.createElement('span');
        probe.style.color = value;
        document.body.appendChild(probe);
        const colour = getComputedStyle(probe).color;
        probe.remove();
        return colour;
      };
      const token = name => normalise(root.getPropertyValue(`--${name}`).trim());
      const background = selector => getComputedStyle(document.querySelector(selector)).backgroundColor;
      const foreground = selector => getComputedStyle(document.querySelector(selector)).color;
      const rgb = value => (value.match(/[\d.]+/g) || []).slice(0, 3).map(Number);
      const luminance = value => {
        const linear = rgb(value).map(channel => {
          const normal = channel / 255;
          return normal <= 0.04045 ? normal / 12.92 : ((normal + 0.055) / 1.055) ** 2.4;
        });
        return 0.2126 * linear[0] + 0.7152 * linear[1] + 0.0722 * linear[2];
      };
      const contrast = (a, b) => {
        const first = luminance(a);
        const second = luminance(b);
        return (Math.max(first, second) + 0.05) / (Math.min(first, second) + 0.05);
      };
      const pairs = ['.promptBox', '.choice', '.footerBar', '.trackWrap'].map(selector => ({
        selector,
        ratio: contrast(foreground(selector), background(selector))
      }));
      return {
        expected: {
          raised: token('surface-raised'),
          subtle: token('surface-subtle')
        },
        actual: {
          prompt: background('.promptBox'),
          choice: background('.choice'),
          media: background('.choiceMedia'),
          footer: background('.footerBar'),
          track: background('.trackWrap'),
          playArea: background('.playArea')
        },
        pairs
      };
    });
    expect(audit.actual.prompt).toBe(audit.expected.raised);
    expect(audit.actual.choice).toBe(audit.expected.raised);
    expect(audit.actual.media).toBe(audit.expected.subtle);
    expect(audit.actual.footer).toBe(audit.expected.raised);
    expect(audit.actual.track).toBe(audit.expected.raised);
    expect(audit.actual.playArea).toBe(audit.expected.subtle);
    audit.pairs.forEach(pair => expect(pair.ratio, `${theme} ${pair.selector}`).toBeGreaterThanOrEqual(4.5));
  }
});

test('runtime-drawn learner colours follow the active semantic theme', async ({ page }) => {
  await gotoAlpha(page);
  await setCheckbox(page, 'ttsToggle', false);
  await setCheckbox(page, 'useTwoStage', false);
  await setCheckbox(page, 'useReward', false);
  await setCheckbox(page, 'autoAdvance', false);
  await setCheckbox(page, 'performanceMode', false);
  await setValue(page, 'themeChoice', 'calm-light');
  await setValue(page, 'startLevel', 8);
  await setValue(page, 'sessionMax', 1);
  await page.locator('#quickStartSessionBtn').click();
  await expect(page.locator('#screenChoice.active')).toBeVisible();
  await expect(page.locator('#screenChoice.active [data-stimulus-color]').first()).toBeVisible();

  const captureThemeColours = () => page.evaluate(() => {
    const root = getComputedStyle(document.documentElement);
    const normalise = value => {
      const probe = document.createElement('span');
      probe.style.color = value;
      document.body.appendChild(probe);
      const colour = getComputedStyle(probe).color;
      probe.remove();
      return colour;
    };
    const rgb = value => (value.match(/[\d.]+/g) || []).slice(0, 3).map(Number);
    const canvasRgb = id => Array.from(document.querySelector(id).getContext('2d').getImageData(1, 1, 1, 1).data).slice(0, 3);
    const stimulus = document.querySelector('#screenChoice.active [data-stimulus-color]');
    const stimulusName = stimulus.dataset.stimulusColor;
    return {
      theme: document.body.dataset.learnerTheme,
      stimulus: getComputedStyle(stimulus).color,
      expectedStimulus: normalise(root.getPropertyValue(`--stimulus-${stimulusName}`).trim()),
      heatmap: canvasRgb('#heatmapCanvas'),
      reactionChart: canvasRgb('#rtChart'),
      expectedCanvas: rgb(normalise(root.getPropertyValue('--surface-raised').trim()))
    };
  });

  const light = await captureThemeColours();
  expect(light.theme).toBe('calm-light');
  expect(light.stimulus).toBe(light.expectedStimulus);
  expect(light.heatmap).toEqual(light.expectedCanvas);
  expect(light.reactionChart).toEqual(light.expectedCanvas);

  await setValue(page, 'themeChoice', 'low-stimulation-dark');
  await page.waitForTimeout(80);
  const dark = await captureThemeColours();
  expect(dark.theme).toBe('low-stimulation-dark');
  expect(dark.stimulus).toBe(dark.expectedStimulus);
  expect(dark.stimulus).not.toBe(light.stimulus);
  expect(dark.heatmap).toEqual(dark.expectedCanvas);
  expect(dark.reactionChart).toEqual(dark.expectedCanvas);
  expect(dark.expectedCanvas).not.toEqual(light.expectedCanvas);

  await page.locator('#playArea').dispatchEvent('pointerdown', {
    clientX: 240,
    clientY: 260,
    pointerType: 'mouse',
    button: 0
  });
  const ripple = page.locator('.ripple').last();
  await expect(ripple).toBeVisible();
  const rippleColours = await ripple.evaluate(node => {
    const root = getComputedStyle(document.documentElement);
    const probe = document.createElement('span');
    probe.style.color = root.getPropertyValue('--focus').trim();
    document.body.appendChild(probe);
    const expected = getComputedStyle(probe).color;
    probe.remove();
    return { actual: getComputedStyle(node).borderTopColor, expected };
  });
  expect(rippleColours.actual).toBe(rippleColours.expected);
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
