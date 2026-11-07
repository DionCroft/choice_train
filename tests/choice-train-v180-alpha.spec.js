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
    consent_or_other_authority_status: 'not-recorded-in-this-export',
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
  expect(payload.sessions[0].trials[0].correct).toBe(true);
  expect(exportedText).not.toContain('Pupil A');
  expect(exportedText).not.toContain('Secret Learner Alias');
  expect(exportedText).not.toContain('SECRET-CONTEXT');
  expect(exportedText).not.toContain('SECRET-CLOCK');
  expect(exportedText).not.toContain('CT-PRIVATE-PILOT');
  expect(exportedText).not.toContain('private-visit-label');
  expect(exportedText).not.toContain('Private device serial');
  expect(exportedKeys).not.toContain('prompt_wording');
  expect(exportedKeys).not.toContain('photo_labels_used');
  expect(exportedKeys).not.toContain('pointer_play_x');
  expect(exportedKeys).not.toContain('t_wall_ms');
  expect(exportedKeys).not.toContain('t_perf_ms');
  expect(exportedKeys).not.toContain('context_notes');
});
