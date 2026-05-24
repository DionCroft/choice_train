(() => {
  const APP_BUILD = Object.freeze({
    app: 'ChoiceTrain Prototype',
    version: '1.3.0',
    release_label: 'V1.3.0',
    channel: 'experimental',
    source_file: 'choice_train_V1.3.0.html',
    source_script: 'choice_train_V1.3.0.js',
    based_on_branch: 'main',
    based_on_commit: 'e803566',
    build_date: '2026-05-24',
    published_entry: 'index.html',
    live_url: 'https://dioncroft.github.io/choice_train/',
    repo_url: 'https://github.com/DionCroft/choice_train'
  });

  const SETTINGS_KEY = 'choice_train_settings_v130';
  const LEARNERS_KEY = 'choice_train_learners_v130';
  const LEGACY_SETTINGS_KEY = 'choice_train_profile_v1';
  const LEGACY_LEARNERS_KEY = 'ct_profiles';
  const IDB_NAME = 'choice_train_runtime_v2';
  const IDB_VERSION = 2;
  const IDB_SESSIONS_STORE = 'sessions';
  const IDB_ASSETS_STORE = 'assets';
  const IDB_META_STORE = 'meta';
  const FAMILIAR_FACE_ASSET_KEY = 'profile:familiarFace';
  const CUSTOM_IMAGES_ASSET_KEY = 'profile:customImages';
  const SESSION_ARCHIVE_LIMIT = 60;

  const PROMPT_LADDER = [
    { level: 0, id: 'independent', label: 'Independent', supportCode: 'none', independence: 'independent' },
    { level: 1, id: 'cue-only', label: 'Cue only', supportCode: 'verbal', independence: 'prompted' },
    { level: 2, id: 'verbal-repeat', label: 'Verbal repeat', supportCode: 'verbal', independence: 'prompted' },
    { level: 3, id: 'visual-highlight', label: 'Visual highlight', supportCode: 'visual', independence: 'prompted' },
    { level: 4, id: 'model-prompt', label: 'Model prompt', supportCode: 'model', independence: 'assisted' },
    { level: 5, id: 'full-support', label: 'Full support', supportCode: 'physical', independence: 'assisted' }
  ];

  const TASK_META = {
    'touch-screen': { label: 'Touch screen', family: 'foundation', domain: 'motor-initiation' },
    'touch-object': { label: 'Touch object', family: 'foundation', domain: 'targeting' },
    'moving-target': { label: 'Moving target', family: 'foundation', domain: 'tracking' },
    'find-object': { label: 'Find object', family: 'foundation', domain: 'recognition' },
    'discriminate-object': { label: 'Discriminate object', family: 'foundation', domain: 'discrimination' },
    'find-category': { label: 'Find category', family: 'foundation', domain: 'reasoning' },
    'choice-preference': { label: 'Choice preference', family: 'foundation', domain: 'choice' },
    'cpat-suite': { label: 'CPAT suite', family: 'cpat', domain: 'mixed' },
    'cpat-sustained': { label: 'CPAT sustained attention', family: 'cpat', domain: 'sustained' },
    'cpat-selective': { label: 'CPAT selective-spatial', family: 'cpat', domain: 'selective-spatial' },
    'cpat-orienting': { label: 'CPAT orienting', family: 'cpat', domain: 'orienting' },
    'cpat-executive': { label: 'CPAT executive control', family: 'cpat', domain: 'executive' }
  };

  const CPAT_TASK_ORDER = ['cpat-sustained', 'cpat-selective', 'cpat-orienting', 'cpat-executive'];

  const SHAPE_SYMBOLS = {
    star: '★',
    circle: '●',
    square: '■',
    triangle: '▲',
    diamond: '◆',
    left: '←',
    right: '→',
    up: '↑',
    down: '↓'
  };

  Object.assign(SHAPE_SYMBOLS, {
    star: '\u2605',
    circle: '\u25CF',
    square: '\u25A0',
    triangle: '\u25B2',
    diamond: '\u25C6',
    left: '\u2190',
    right: '\u2192',
    up: '\u2191',
    down: '\u2193'
  });

  const COLOR_STYLES = {
    blue: '#71d4ff',
    green: '#8ef0b1',
    amber: '#ffd27d',
    red: '#ffb39b',
    pink: '#ff98d1',
    violet: '#b99cff'
  };

  const SESSION_CONTEXT_DEFAULTS = {
    communicationMode: 'spoken',
    motorAccessMode: 'direct-touch',
    adaptiveFunctioningBand: 'not-set',
    teacherAttentionRating: 3,
    teacherIndependenceRating: 3,
    eegParticipation: 'not-enrolled',
    staffMember: '',
    fatigueLevel: 'ready',
    sensoryState: 'regulated',
    breakCount: 0,
    maintenanceStatus: 'not-run',
    generalisationStatus: 'not-run',
    classroomTransferNotes: ''
  };

  const ui = {};
  document.querySelectorAll('[id]').forEach(node => {
    ui[node.id] = node;
  });

  const state = {
    viewMode: 'desktop',
    phase: 'idle',
    sessionId: '',
    sessionStartMs: 0,
    questionIndex: 0,
    attemptIndex: 0,
    totalQuestions: 8,
    currentLevel: 1,
    currentQuestion: null,
    currentTrial: null,
    currentPupil: null,
    currentPupilName: 'Unknown',
    learners: {},
    logs: [],
    trials: [],
    archivedSessions: [],
    importedDashboard: null,
    sessionTarget: null,
    questionLayouts: {},
    customImages: [],
    familiarFace: null,
    sessionTaskType: null,
    singleTargetRepetitions: 3,
    lastPointerType: 'mouse',
    isTouchDevice: false,
    promptState: {
      currentLevel: 0,
      highestLevel: 0,
      supportCode: 'none',
      independenceStatus: 'independent'
    },
    timers: {
      preview: null,
      response: null,
      reward: null,
      session: null,
      dashboard: null,
      profileSave: null,
      persist: null
    },
    runtime: {
      lastMoveSampleAt: 0,
      dashboardLastRenderAt: 0,
      dashboardDirty: false,
      trailFrame: 0,
      currentTouchPoint: null
    },
    storage: {
      db: null,
      dbPromise: null,
      ready: false,
      useIndexedDb: false
    },
    history: {
      sessions: [],
      revision: 0,
      storageMode: 'Starting...'
    },
    cache: {
      summaryKey: '',
      summaryValue: null,
      dashboardKey: '',
      dashboardValue: null,
      heatmapKey: '',
      heatmapValue: null,
      historyKey: '',
      historyValue: null
    }
  };

  function nowMs(){
    return typeof performance !== 'undefined' && performance.now ? performance.now() : Date.now();
  }

  function wallMs(){
    return Date.now();
  }

  function clamp(v, min, max){
    return Math.min(max, Math.max(min, v));
  }

  function uuid4(){
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : ((r & 0x3) | 0x8);
      return v.toString(16);
    });
  }

  function rand(max){
    return Math.floor(Math.random() * max);
  }

  function shuffle(items){
    const copy = items.slice();
    for(let i = copy.length - 1; i > 0; i--){
      const j = rand(i + 1);
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  }

  function pickDistinct(items, count, excludeIds=[]){
    return shuffle(items.filter(item => !excludeIds.includes(item.id))).slice(0, count);
  }

  function safeNumber(value, fallback=0){
    const num = Number(value);
    return Number.isFinite(num) ? num : fallback;
  }

  function mean(values){
    return values.length ? values.reduce((sum, value) => sum + value, 0) / values.length : 0;
  }

  function standardDeviation(values){
    if(values.length <= 1) return 0;
    const avg = mean(values);
    const variance = mean(values.map(value => Math.pow(value - avg, 2)));
    return Math.sqrt(variance);
  }

  function coefficientOfVariation(values){
    const avg = mean(values);
    if(!avg) return 0;
    return standardDeviation(values) / avg;
  }

  function localTimestampForFile(){
    const d = new Date();
    const parts = [
      d.getFullYear(),
      String(d.getMonth() + 1).padStart(2, '0'),
      String(d.getDate()).padStart(2, '0'),
      String(d.getHours()).padStart(2, '0'),
      String(d.getMinutes()).padStart(2, '0'),
      String(d.getSeconds()).padStart(2, '0')
    ];
    return `${parts[0]}-${parts[1]}-${parts[2]}_${parts[3]}-${parts[4]}-${parts[5]}`;
  }

  function safeFilenamePart(value){
    return String(value || 'unknown').trim().replace(/[^a-z0-9_-]+/gi, '-').replace(/^-+|-+$/g, '') || 'unknown';
  }

  function setFooter(text, pillText){
    if(ui.footerHint) ui.footerHint.textContent = text;
    if(ui.touchInfo) ui.touchInfo.textContent = pillText;
  }

  function flash(kind, text){
    const pulse = kind === 'good' ? ui.pulseGood : ui.pulseTry;
    if(pulse){
      pulse.style.animation = 'none';
      pulse.offsetHeight;
      pulse.style.animation = '';
    }
    if(ui.badge){
      ui.badge.textContent = text || '';
      ui.badge.classList.remove('badgeShow');
      ui.badge.offsetHeight;
      ui.badge.classList.add('badgeShow');
    }
  }

  function clearNode(node){
    while(node && node.firstChild) node.removeChild(node.firstChild);
  }

  function setNodeChildren(node, ...children){
    clearNode(node);
    children.forEach(child => {
      if(child) node.appendChild(child);
    });
  }

  function triggerBlobDownload(blob, filename){
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  function promptMeta(level){
    return PROMPT_LADDER.find(item => item.level === level) || PROMPT_LADDER[0];
  }

  function taskMeta(kind){
    return TASK_META[kind] || { label: kind, family: 'other', domain: 'unknown' };
  }

  function taskLabel(kind){
    return taskMeta(kind).label;
  }

  function buildVersionLabel(build=APP_BUILD){
    return String(build.release_label || build.version || 'Unversioned');
  }

  function buildExportMeta(build=APP_BUILD){
    return {
      app: build.app,
      version: build.version,
      release_label: buildVersionLabel(build),
      channel: build.channel,
      source_file: build.source_file,
      source_script: build.source_script || '',
      based_on_branch: build.based_on_branch,
      based_on_commit: build.based_on_commit,
      build_date: build.build_date,
      published_entry: build.published_entry,
      live_url: build.live_url,
      repo_url: build.repo_url
    };
  }

  function buildInfoClipboardText(build=APP_BUILD){
    const meta = buildExportMeta(build);
    return [
      meta.app,
      `Release: ${meta.release_label}`,
      `Status: ${meta.channel}`,
      `Build date: ${meta.build_date}`,
      `Source file: ${meta.source_file}`,
      `Source script: ${meta.source_script}`,
      `Base branch: ${meta.based_on_branch}`,
      `Base commit: ${meta.based_on_commit}`,
      `Published entry: ${meta.published_entry}`,
      `Live URL: ${meta.live_url}`,
      `Repository: ${meta.repo_url}`
    ].join('\n');
  }

  async function copyText(text){
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch(_err){
      const area = document.createElement('textarea');
      area.value = text;
      area.style.position = 'fixed';
      area.style.left = '-9999px';
      document.body.appendChild(area);
      area.select();
      try {
        document.execCommand('copy');
        area.remove();
        return true;
      } catch(_err2){
        area.remove();
      }
    }
    return false;
  }

  function isFullscreenSupported(){
    const root = document.documentElement;
    return !!(root.requestFullscreen || root.webkitRequestFullscreen);
  }

  function getFullscreenElement(){
    return document.fullscreenElement || document.webkitFullscreenElement || null;
  }

  function requestAppFullscreen(){
    const root = document.documentElement;
    const fn = root.requestFullscreen || root.webkitRequestFullscreen;
    return fn ? fn.call(root) : Promise.resolve();
  }

  function exitAppFullscreen(){
    const fn = document.exitFullscreen || document.webkitExitFullscreen;
    return fn ? fn.call(document) : Promise.resolve();
  }

  function updateFullscreenButton(){
    if(!ui.fullscreenBtn) return;
    const supported = isFullscreenSupported();
    ui.fullscreenBtn.disabled = !supported;
    ui.fullscreenBtn.textContent = supported ? 'Fullscreen' : 'Fullscreen unavailable';
  }

  function currentPupilName(){
    return state.currentPupil && state.currentPupil.name
      ? state.currentPupil.name
      : (ui.pupilAlias && ui.pupilAlias.value.trim()) || 'Unknown';
  }

  function getAdaptiveTouchScale(){
    const manual = clamp(safeNumber(ui.targetScale && ui.targetScale.value, 100), 80, 220) / 100;
    if(!(ui.autoTouchScale && ui.autoTouchScale.checked)) return manual;
    const width = Math.max(window.innerWidth || 0, 320);
    const auto = width < 520 ? 1.35 : width < 820 ? 1.15 : 1;
    return Number((manual * auto).toFixed(2));
  }

  function getAdaptiveHitRadius(){
    const scale = getAdaptiveTouchScale();
    return Math.round(34 * scale);
  }

  function performanceModeEnabled(){
    return !(ui.performanceMode && !ui.performanceMode.checked);
  }

  function moveSampleIntervalMs(){
    return clamp(safeNumber(ui.moveSampleMs && ui.moveSampleMs.value, 64), 16, 250);
  }

  function dashboardRefreshIntervalMs(){
    return clamp(safeNumber(ui.dashboardRefreshMs && ui.dashboardRefreshMs.value, 250), 80, 2000);
  }

  function responseWindowMs(){
    return Math.max(1000, safeNumber(ui.responseWindowSec && ui.responseWindowSec.value, 6) * 1000);
  }

  function interTrialDelayMs(){
    return Math.max(0, safeNumber(ui.itiSec && ui.itiSec.value, 0.75) * 1000);
  }

  function rewardAdvanceDelayMs(){
    return Math.max(1400, interTrialDelayMs() + 900);
  }

  function applyBuildInfo(){
    const label = `${buildVersionLabel(APP_BUILD)} | ${APP_BUILD.channel}`;
    document.title = `${APP_BUILD.app} ${buildVersionLabel(APP_BUILD)} (Offline)`;
    if(ui.versionInfo) ui.versionInfo.textContent = `Active build: ${label}`;
    if(ui.versionChip) ui.versionChip.textContent = buildVersionLabel(APP_BUILD);
    if(ui.aboutRelease) ui.aboutRelease.textContent = buildVersionLabel(APP_BUILD);
    if(ui.aboutChannel) ui.aboutChannel.textContent = APP_BUILD.channel;
    if(ui.aboutCommit) ui.aboutCommit.textContent = APP_BUILD.based_on_commit;
    if(ui.aboutBuildDate) ui.aboutBuildDate.textContent = APP_BUILD.build_date;
    if(ui.aboutSourceFile) ui.aboutSourceFile.textContent = APP_BUILD.source_file;
    if(ui.aboutPublishedEntry) ui.aboutPublishedEntry.textContent = APP_BUILD.published_entry;
    if(ui.aboutLiveUrl) ui.aboutLiveUrl.textContent = APP_BUILD.live_url;
    if(ui.aboutRepoUrl) ui.aboutRepoUrl.textContent = APP_BUILD.repo_url;
    if(ui.aboutBuildSummary){
      ui.aboutBuildSummary.textContent = `Running ${buildVersionLabel(APP_BUILD)} from ${APP_BUILD.source_file}. This experimental build separates the developmental ChoiceTrain pathway from the later CPAT attention suite and records structured trial data for SEND practice and EEG-aligned research work.`;
    }
  }

  function persistJson(key, value){
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch(_err){
      return false;
    }
  }

  function readJson(key){
    try {
      return JSON.parse(localStorage.getItem(key) || 'null');
    } catch(_err){
      return null;
    }
  }

  function buildDefaultLearner(name=''){
    return {
      name,
      lastLevel: 1,
      sessions: [],
      baseline: { ...SESSION_CONTEXT_DEFAULTS },
      reviews: []
    };
  }

  function normalizeLearner(name, learner={}){
    return {
      name: learner.name || name,
      lastLevel: clamp(safeNumber(learner.lastLevel, 1), 1, 10),
      sessions: Array.isArray(learner.sessions) ? learner.sessions : [],
      baseline: { ...SESSION_CONTEXT_DEFAULTS, ...(learner.baseline || {}) },
      reviews: Array.isArray(learner.reviews) ? learner.reviews : []
    };
  }

  function getLearners(){
    const current = readJson(LEARNERS_KEY);
    if(current && typeof current === 'object') return current;
    const legacy = readJson(LEGACY_LEARNERS_KEY);
    if(legacy && typeof legacy === 'object'){
      const migrated = {};
      Object.keys(legacy).forEach(name => {
        migrated[name] = normalizeLearner(name, legacy[name]);
      });
      persistJson(LEARNERS_KEY, migrated);
      return migrated;
    }
    return {};
  }

  function saveLearners(){
    persistJson(LEARNERS_KEY, state.learners);
  }

  function settingsSnapshot(){
    return {
      pupilAlias: ui.pupilAlias.value,
      selectedPupil: ui.pupilSelect.value,
      sessionMax: ui.sessionMax.value,
      maxObjects: ui.maxObjects.value,
      delaySec: ui.delaySec.value,
      sessionMinutes: ui.sessionMinutes.value,
      targetScale: ui.targetScale.value,
      startLevel: ui.startLevel.value,
      autoTouchScale: ui.autoTouchScale.checked,
      showTouchDebug: ui.showTouchDebug.checked,
      useTwoStage: ui.useTwoStage.checked,
      useReward: ui.useReward.checked,
      useTextPrompt: ui.useTextPrompt.checked,
      useImagePrompt: ui.useImagePrompt.checked,
      useFace: ui.useFace.checked,
      ttsToggle: ui.ttsToggle.checked,
      ttsLabelsToggle: ui.ttsLabelsToggle.checked,
      autoAdvance: ui.autoAdvance.checked,
      trackTrail: ui.trackTrail.checked,
      performanceMode: ui.performanceMode.checked,
      liveDashboardDuringLearner: ui.liveDashboardDuringLearner.checked,
      singleTargetStart: ui.singleTargetStart.checked,
      autoLevelPath: ui.autoLevelPath.checked,
      singleTargetReps: ui.singleTargetReps.value,
      sessionTaskType: ui.sessionTaskType.value,
      moveSampleMs: ui.moveSampleMs.value,
      dashboardRefreshMs: ui.dashboardRefreshMs.value,
      responseWindowSec: ui.responseWindowSec.value,
      itiSec: ui.itiSec.value,
      faceName: ui.faceName.value,
      notes: ui.notes.value,
      viewMode: state.viewMode
    };
  }

  function loadSettings(){
    const settings = readJson(SETTINGS_KEY) || readJson(LEGACY_SETTINGS_KEY);
    if(!settings) return;
    if(ui.pupilAlias) ui.pupilAlias.value = settings.pupilAlias || '';
    if(ui.sessionMax) ui.sessionMax.value = settings.sessionMax || 8;
    if(ui.maxObjects) ui.maxObjects.value = settings.maxObjects || 4;
    if(ui.delaySec) ui.delaySec.value = settings.delaySec || 1;
    if(ui.sessionMinutes) ui.sessionMinutes.value = settings.sessionMinutes || 3;
    if(ui.targetScale) ui.targetScale.value = settings.targetScale || 100;
    if(ui.startLevel) ui.startLevel.value = settings.startLevel || 1;
    if(ui.autoTouchScale) ui.autoTouchScale.checked = settings.autoTouchScale !== false;
    if(ui.showTouchDebug) ui.showTouchDebug.checked = !!settings.showTouchDebug;
    if(ui.useTwoStage) ui.useTwoStage.checked = !!settings.useTwoStage;
    if(ui.useReward) ui.useReward.checked = settings.useReward !== false;
    if(ui.useTextPrompt) ui.useTextPrompt.checked = settings.useTextPrompt !== false;
    if(ui.useImagePrompt) ui.useImagePrompt.checked = settings.useImagePrompt !== false;
    if(ui.useFace) ui.useFace.checked = settings.useFace !== false;
    if(ui.ttsToggle) ui.ttsToggle.checked = settings.ttsToggle !== false;
    if(ui.ttsLabelsToggle) ui.ttsLabelsToggle.checked = !!settings.ttsLabelsToggle;
    if(ui.autoAdvance) ui.autoAdvance.checked = settings.autoAdvance !== false;
    if(ui.trackTrail) ui.trackTrail.checked = settings.trackTrail !== false;
    if(ui.performanceMode) ui.performanceMode.checked = settings.performanceMode !== false;
    if(ui.liveDashboardDuringLearner) ui.liveDashboardDuringLearner.checked = !!settings.liveDashboardDuringLearner;
    if(ui.singleTargetStart) ui.singleTargetStart.checked = settings.singleTargetStart !== false;
    if(ui.autoLevelPath) ui.autoLevelPath.checked = settings.autoLevelPath !== false;
    if(ui.singleTargetReps) ui.singleTargetReps.value = settings.singleTargetReps || 3;
    if(ui.sessionTaskType) ui.sessionTaskType.value = settings.sessionTaskType || 'auto';
    if(ui.moveSampleMs) ui.moveSampleMs.value = settings.moveSampleMs || 64;
    if(ui.dashboardRefreshMs) ui.dashboardRefreshMs.value = settings.dashboardRefreshMs || 250;
    if(ui.responseWindowSec) ui.responseWindowSec.value = settings.responseWindowSec || 6;
    if(ui.itiSec) ui.itiSec.value = settings.itiSec || 0.75;
    if(ui.faceName) ui.faceName.value = settings.faceName || 'Mum';
    if(ui.notes) ui.notes.value = settings.notes || '';
    state.viewMode = settings.viewMode === 'learner' ? 'learner' : 'desktop';
  }

  function saveSettingsSoon(){
    clearTimeout(state.timers.profileSave);
    state.timers.profileSave = window.setTimeout(() => {
      persistJson(SETTINGS_KEY, settingsSnapshot());
    }, performanceModeEnabled() ? 180 : 0);
  }

  async function txComplete(tx){
    return new Promise((resolve, reject) => {
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error || new Error('IndexedDB transaction failed'));
      tx.onabort = () => reject(tx.error || new Error('IndexedDB transaction aborted'));
    });
  }

  function requestResult(request){
    return new Promise((resolve, reject) => {
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error || new Error('IndexedDB request failed'));
    });
  }

  function openDb(){
    if(state.storage.dbPromise) return state.storage.dbPromise;
    state.storage.dbPromise = new Promise((resolve, reject) => {
      const request = indexedDB.open(IDB_NAME, IDB_VERSION);
      request.onupgradeneeded = () => {
        const db = request.result;
        if(!db.objectStoreNames.contains(IDB_SESSIONS_STORE)){
          db.createObjectStore(IDB_SESSIONS_STORE, { keyPath: 'session_id' });
        }
        if(!db.objectStoreNames.contains(IDB_ASSETS_STORE)){
          db.createObjectStore(IDB_ASSETS_STORE, { keyPath: 'key' });
        }
        if(!db.objectStoreNames.contains(IDB_META_STORE)){
          db.createObjectStore(IDB_META_STORE, { keyPath: 'key' });
        }
      };
      request.onsuccess = () => {
        state.storage.db = request.result;
        state.storage.useIndexedDb = true;
        state.storage.ready = true;
        resolve(request.result);
      };
      request.onerror = () => reject(request.error || new Error('IndexedDB open failed'));
    }).catch(() => {
      state.storage.ready = true;
      state.storage.useIndexedDb = false;
      return null;
    });
    return state.storage.dbPromise;
  }

  async function idbGetAll(storeName){
    const db = await openDb();
    if(!db) return [];
    const tx = db.transaction(storeName, 'readonly');
    const store = tx.objectStore(storeName);
    const result = await requestResult(store.getAll());
    await txComplete(tx);
    return result || [];
  }

  async function idbGet(storeName, key){
    const db = await openDb();
    if(!db) return null;
    const tx = db.transaction(storeName, 'readonly');
    const store = tx.objectStore(storeName);
    const result = await requestResult(store.get(key));
    await txComplete(tx);
    return result || null;
  }

  async function idbPut(storeName, value){
    const db = await openDb();
    if(!db) return false;
    const tx = db.transaction(storeName, 'readwrite');
    tx.objectStore(storeName).put(value);
    await txComplete(tx);
    return true;
  }

  async function idbDelete(storeName, key){
    const db = await openDb();
    if(!db) return false;
    const tx = db.transaction(storeName, 'readwrite');
    tx.objectStore(storeName).delete(key);
    await txComplete(tx);
    return true;
  }

  async function readFileAsDataUrl(file){
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result || ''));
      reader.onerror = () => reject(reader.error || new Error('File read failed'));
      reader.readAsDataURL(file);
    });
  }

  async function loadImageFromUrl(url){
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error('Image load failed'));
      img.src = url;
    });
  }

  async function compressImageDataUrl(dataUrl, options={}){
    const maxEdge = options.maxEdge || 960;
    const quality = options.quality || 0.82;
    const img = await loadImageFromUrl(dataUrl);
    const ratio = Math.min(1, maxEdge / Math.max(img.naturalWidth, img.naturalHeight));
    const width = Math.max(1, Math.round(img.naturalWidth * ratio));
    const height = Math.max(1, Math.round(img.naturalHeight * ratio));
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0, width, height);
    return canvas.toDataURL('image/jpeg', quality);
  }

  async function hydrateAssets(){
    const face = await idbGet(IDB_ASSETS_STORE, FAMILIAR_FACE_ASSET_KEY);
    const custom = await idbGet(IDB_ASSETS_STORE, CUSTOM_IMAGES_ASSET_KEY);
    if(face && face.value) state.familiarFace = face.value;
    if(custom && Array.isArray(custom.value)) state.customImages = custom.value;
  }

  async function persistAssets(){
    if(state.storage.useIndexedDb){
      await idbPut(IDB_ASSETS_STORE, { key: FAMILIAR_FACE_ASSET_KEY, value: state.familiarFace || null, updated_at_wall_ms: wallMs() });
      await idbPut(IDB_ASSETS_STORE, { key: CUSTOM_IMAGES_ASSET_KEY, value: state.customImages || [], updated_at_wall_ms: wallMs() });
    }
  }

  async function loadAndStoreFamiliarFace(file){
    try {
      const dataUrl = await readFileAsDataUrl(file);
      state.familiarFace = await compressImageDataUrl(dataUrl, { maxEdge: 960, quality: 0.82 });
      await persistAssets();
      flash('good', 'Face added');
      saveSettingsSoon();
      refreshDashboard(true);
    } catch(_err){
      flash('try', 'Image failed');
    }
  }

  async function loadAndStoreCustomImages(files){
    const list = Array.from(files || []);
    if(!list.length) return;
    try {
      const newItems = [];
      for(let i = 0; i < list.length; i++){
        const file = list[i];
        const dataUrl = await readFileAsDataUrl(file);
        const compressed = await compressImageDataUrl(dataUrl, { maxEdge: 900, quality: 0.8 });
        newItems.push({
          id: `custom-${Date.now()}-${i}`,
          label: file.name.replace(/\.[^.]+$/, ''),
          src: compressed,
          category: 'custom'
        });
      }
      state.customImages = state.customImages.concat(newItems);
      await persistAssets();
      flash('good', `${newItems.length} images added`);
      refreshDashboard(true);
    } catch(_err){
      flash('try', 'Images failed');
    }
  }

  function objectPool(){
    const base = [
      { id: 'fruit-apple', label: 'Apple', emoji: '🍎', category: 'fruit' },
      { id: 'fruit-banana', label: 'Banana', emoji: '🍌', category: 'fruit' },
      { id: 'fruit-orange', label: 'Orange', emoji: '🍊', category: 'fruit' },
      { id: 'animal-cat', label: 'Cat', emoji: '🐱', category: 'animals' },
      { id: 'animal-dog', label: 'Dog', emoji: '🐶', category: 'animals' },
      { id: 'animal-fish', label: 'Fish', emoji: '🐟', category: 'animals' },
      { id: 'transport-bus', label: 'Bus', emoji: '🚌', category: 'transport' },
      { id: 'transport-car', label: 'Car', emoji: '🚗', category: 'transport' },
      { id: 'transport-train', label: 'Train', emoji: '🚆', category: 'transport' }
    ];
    return base.concat(state.customImages || []);
  }

  function getFaceObject(){
    return state.familiarFace
      ? { id: 'familiar-face', label: ui.faceName.value || 'Mum', src: state.familiarFace, category: 'people' }
      : { id: 'familiar-face', label: ui.faceName.value || 'Mum', emoji: '🙂', category: 'people' };
  }

  function shapeOption(id, shape, color, label){
    return {
      id,
      shape,
      color,
      symbol: SHAPE_SYMBOLS[shape] || '●',
      label
    };
  }

  function arrowOption(id, direction, label){
    return {
      id,
      shape: direction,
      color: 'blue',
      symbol: SHAPE_SYMBOLS[direction],
      label
    };
  }

  function buildChoiceMediaElement(option, className='choiceMedia'){
    const media = document.createElement('div');
    media.className = className;
    if(option.src){
      const img = document.createElement('img');
      img.src = option.src;
      img.alt = option.label;
      media.appendChild(img);
      return media;
    }
    if(option.emoji){
      media.textContent = option.emoji;
      return media;
    }
    if(option.symbol){
      media.textContent = option.symbol;
      const color = COLOR_STYLES[option.color] || '#71d4ff';
      media.style.color = color;
      media.style.background = `linear-gradient(180deg, rgba(255,255,255,.08), rgba(255,255,255,.02)), ${color}22`;
      media.style.border = `1px solid ${color}55`;
      return media;
    }
    media.textContent = option.label || '?';
    return media;
  }

  function levelSpec(level){
    const scale = getAdaptiveTouchScale();
    const specs = {
      1: { kind: 'touch-screen', size: 250 * scale, movable: false, subtitle: 'Level 1: build touchscreen confidence. Any touch in the panel counts.' },
      2: { kind: 'touch-object', size: 240 * scale, movable: false, subtitle: 'Level 2: touch the pictured target itself.' },
      3: { kind: 'moving-target', size: 175 * scale, movable: true, subtitle: 'Level 3: track and touch the moving target.' },
      4: { kind: 'find-object', size: 150 * scale, movable: false, subtitle: 'Level 4: choose the named object from a small set.' },
      5: { kind: 'discriminate-object', size: 145 * scale, movable: false, subtitle: 'Level 5: tell apart similar-looking options.' },
      6: { kind: 'find-category', size: 140 * scale, movable: false, subtitle: 'Level 6: use reasoning to pick the correct category item.' },
      7: { kind: 'cpat-sustained', size: 170 * scale, movable: false, subtitle: 'Level 7: sustained attention. Tap only when the target appears.' },
      8: { kind: 'cpat-selective', size: 160 * scale, movable: false, subtitle: 'Level 8: selective-spatial attention. Find the correct target among distractors.' },
      9: { kind: 'cpat-orienting', size: 160 * scale, movable: false, subtitle: 'Level 9: orienting attention. Use the cue, then reorient when needed.' },
      10: { kind: 'cpat-executive', size: 160 * scale, movable: false, subtitle: 'Level 10: executive attention. Ignore conflict and follow the rule.' }
    };
    return specs[clamp(level || 1, 1, 10)];
  }

  function getSingleTargetLayout(index, movable){
    const key = `q-${index}-${movable ? 'move' : 'still'}`;
    if(!state.questionLayouts[key]){
      state.questionLayouts[key] = {
        left: movable ? 16 + Math.random() * 68 : 50,
        top: movable ? 24 + Math.random() * 42 : 56
      };
    }
    return state.questionLayouts[key];
  }

  function selectedSessionTaskMode(){
    return state.sessionTaskType || ui.sessionTaskType.value || 'auto';
  }

  function chooseSessionTaskKind(index){
    const selected = selectedSessionTaskMode();
    if(selected !== 'auto') return selected;
    if(ui.autoLevelPath.checked) return levelSpec(state.currentLevel).kind;
    if(index <= state.singleTargetRepetitions && ui.singleTargetStart.checked) return index === 1 ? 'touch-screen' : 'touch-object';
    const cycle = ['moving-target', 'find-object', 'discriminate-object', 'find-category', 'choice-preference'];
    const cycleStart = ui.singleTargetStart.checked ? state.singleTargetRepetitions + 1 : 1;
    return cycle[Math.max(0, index - cycleStart) % cycle.length];
  }

  function currentQuestionResponseWindow(){
    return responseWindowMs();
  }

  function buildFoundationTarget(){
    if(!state.sessionTarget){
      state.sessionTarget = ui.useFace.checked ? getFaceObject() : shuffle(objectPool())[0];
    }
    return state.sessionTarget;
  }

  function buildSelectiveStimuli(){
    const combos = shuffle([
      shapeOption('selective-blue-star', 'star', 'blue', 'Blue star'),
      shapeOption('selective-green-star', 'star', 'green', 'Green star'),
      shapeOption('selective-blue-circle', 'circle', 'blue', 'Blue circle'),
      shapeOption('selective-green-circle', 'circle', 'green', 'Green circle'),
      shapeOption('selective-amber-square', 'square', 'amber', 'Amber square'),
      shapeOption('selective-red-triangle', 'triangle', 'red', 'Red triangle')
    ]);
    return combos;
  }

  function buildQuestion(index){
    const pool = objectPool();
    const face = getFaceObject();
    const spec = levelSpec(state.currentLevel);
    const currentKind = chooseSessionTaskKind(index);
    const meta = taskMeta(currentKind);
    const optionCount = clamp(safeNumber(ui.maxObjects.value, 4), 2, 6);
    const baseQuestion = {
      kind: currentKind,
      family: meta.family,
      attentionDomain: meta.domain,
      level: state.currentLevel,
      questionIndex: index,
      responseWindowMs: currentQuestionResponseWindow(),
      subtitle: spec.subtitle,
      cueSummary: '',
      distractorCount: 0
    };

    if(currentKind === 'touch-screen'){
      const target = buildFoundationTarget();
      return {
        ...baseQuestion,
        prompt: `Touch ${target.label}`,
        cueSummary: `Any touch in the panel counts while ${target.label} is shown as the visual cue.`,
        target,
        options: [target],
        correctId: target.id,
        layout: { size: spec.size, left: 50, top: 56 },
        renderMode: 'touch-screen',
        touchAnywhereAccepted: true,
        expectedResponseType: 'hit'
      };
    }

    if(currentKind === 'touch-object' || currentKind === 'moving-target'){
      const target = buildFoundationTarget();
      const layout = getSingleTargetLayout(index, currentKind === 'moving-target');
      return {
        ...baseQuestion,
        prompt: `Touch ${target.label}`,
        cueSummary: currentKind === 'moving-target' ? 'Touch the moving target.' : 'Touch the pictured target.',
        target,
        options: [target],
        correctId: target.id,
        layout: { size: spec.size, left: layout.left, top: layout.top },
        renderMode: 'single-target',
        touchAnywhereAccepted: false,
        expectedResponseType: 'hit'
      };
    }

    if(currentKind === 'find-object'){
      const target = shuffle(pool)[0];
      const others = pickDistinct(pool, Math.max(1, optionCount - 1), [target.id]);
      return {
        ...baseQuestion,
        prompt: `Find ${target.label}`,
        cueSummary: 'Choose the named object from the set.',
        target,
        options: shuffle([target].concat(others)),
        correctId: target.id,
        renderMode: 'grid',
        distractorCount: others.length,
        expectedResponseType: 'hit'
      };
    }

    if(currentKind === 'discriminate-object'){
      const grouped = shuffle(pool.filter(item => item.category === 'fruit' || item.category === 'animals'));
      const target = grouped[0] || pool[0];
      const distractor = grouped.find(item => item.id !== target.id) || pickDistinct(pool, 1, [target.id])[0];
      return {
        ...baseQuestion,
        prompt: `Which is ${target.label}?`,
        cueSummary: 'Tell apart similar-looking options.',
        target,
        options: shuffle([target, distractor]),
        correctId: target.id,
        renderMode: 'grid',
        distractorCount: 1,
        expectedResponseType: 'hit'
      };
    }

    if(currentKind === 'find-category'){
      const categories = ['fruit', 'animals', 'transport'];
      const category = categories[rand(categories.length)];
      const label = category === 'animals' ? 'animal' : category === 'transport' ? 'vehicle' : category;
      const target = shuffle(pool.filter(item => item.category === category))[0] || pool[0];
      const distractors = pickDistinct(pool.filter(item => item.category !== category), Math.max(1, optionCount - 1), [target.id]);
      return {
        ...baseQuestion,
        prompt: `Which is a ${label}?`,
        cueSummary: 'Use category knowledge to pick the correct item.',
        target,
        options: shuffle([target].concat(distractors)),
        correctId: target.id,
        renderMode: 'grid',
        distractorCount: distractors.length,
        expectedResponseType: 'hit'
      };
    }

    if(currentKind === 'choice-preference'){
      const choices = shuffle([
        { id: 'choice-music', label: 'Music', emoji: '🎵', category: 'choice' },
        { id: 'choice-bubbles', label: 'Bubbles', emoji: '🫧', category: 'choice' },
        { id: 'choice-train', label: 'Train', emoji: '🚂', category: 'choice' },
        { id: 'choice-stars', label: 'Stars', emoji: '✨', category: 'choice' }
      ]);
      const target = choices[0];
      return {
        ...baseQuestion,
        prompt: `Choose ${target.label}`,
        cueSummary: 'Open-ended choice style selection.',
        target,
        options: choices.slice(0, clamp(optionCount, 2, 4)),
        correctId: target.id,
        renderMode: 'grid',
        distractorCount: Math.max(0, clamp(optionCount, 2, 4) - 1),
        expectedResponseType: 'hit'
      };
    }

    if(currentKind === 'cpat-suite'){
      return buildQuestionFromKind(CPAT_TASK_ORDER[(index - 1) % CPAT_TASK_ORDER.length], index);
    }

    return buildQuestionFromKind(currentKind, index);
  }

  function buildQuestionFromKind(kind, index){
    const spec = levelSpec(state.currentLevel);
    const baseQuestion = {
      kind,
      family: taskMeta(kind).family,
      attentionDomain: taskMeta(kind).domain,
      level: state.currentLevel,
      questionIndex: index,
      responseWindowMs: currentQuestionResponseWindow(),
      subtitle: spec.subtitle,
      distractorCount: 0
    };

    if(kind === 'cpat-sustained'){
      const targetPresent = (index + state.attemptIndex) % 3 !== 0;
      const target = shapeOption('cpat-sustained-star', 'star', 'amber', 'Star');
      const nonTargets = [
        shapeOption('cpat-sustained-circle', 'circle', 'blue', 'Circle'),
        shapeOption('cpat-sustained-square', 'square', 'green', 'Square'),
        shapeOption('cpat-sustained-triangle', 'triangle', 'red', 'Triangle')
      ];
      const stimulus = targetPresent ? target : nonTargets[rand(nonTargets.length)];
      return {
        ...baseQuestion,
        prompt: 'Tap only when you see the star.',
        cueSummary: targetPresent ? 'Target present: respond to the star.' : 'Target absent: wait without tapping.',
        target,
        stimulus,
        targetPresent,
        options: [stimulus],
        correctId: target.id,
        renderMode: 'cpat-sustained',
        requiresResponse: targetPresent,
        expectedResponseType: targetPresent ? 'hit' : 'correct-rejection'
      };
    }

    if(kind === 'cpat-selective'){
      const stimuli = buildSelectiveStimuli();
      const target = stimuli.find(item => item.id === 'selective-blue-star') || stimuli[0];
      const distractors = shuffle(stimuli.filter(item => item.id !== target.id)).slice(0, 3);
      const options = shuffle([target, ...distractors]);
      return {
        ...baseQuestion,
        prompt: 'Find the blue star.',
        cueSummary: 'Ignore other shapes and colours and select the blue star.',
        target,
        options,
        correctId: target.id,
        renderMode: 'grid',
        distractorCount: options.length - 1,
        expectedResponseType: 'hit'
      };
    }

    if(kind === 'cpat-orienting'){
      const cueSide = rand(2) === 0 ? 'left' : 'right';
      const cueValidity = rand(100) < 75;
      const targetSide = cueValidity ? cueSide : (cueSide === 'left' ? 'right' : 'left');
      const target = shapeOption('orienting-target-star', 'star', 'green', 'Star');
      const distractor = shapeOption('orienting-distractor-circle', 'circle', 'blue', 'Circle');
      const left = targetSide === 'left' ? target : distractor;
      const right = targetSide === 'right' ? target : distractor;
      return {
        ...baseQuestion,
        prompt: 'Use the cue, then tap the star.',
        cueSummary: cueValidity ? `Valid cue: look ${cueSide} first.` : `Invalid cue: the cue points ${cueSide}, but the star will appear on the other side.`,
        cueSide,
        cueValidity,
        targetSide,
        target,
        options: [
          { ...left, side: 'left', slotId: 'left-target' },
          { ...right, side: 'right', slotId: 'right-target' }
        ],
        correctId: target.id,
        renderMode: 'orienting',
        distractorCount: 1,
        expectedResponseType: 'hit'
      };
    }

    if(kind === 'cpat-executive'){
      const congruent = rand(2) === 0;
      const centerDirection = rand(2) === 0 ? 'left' : 'right';
      const flankerDirection = congruent ? centerDirection : (centerDirection === 'left' ? 'right' : 'left');
      const target = arrowOption(`executive-${centerDirection}`, centerDirection, centerDirection === 'left' ? 'Left' : 'Right');
      return {
        ...baseQuestion,
        prompt: 'Tap the direction of the middle arrow.',
        cueSummary: congruent ? 'Congruent trial.' : 'Incongruent trial. Ignore the side arrows and follow the middle one.',
        target,
        options: [
          arrowOption('executive-left', 'left', 'Left'),
          arrowOption('executive-right', 'right', 'Right')
        ],
        flankerPattern: `${SHAPE_SYMBOLS[flankerDirection]} ${SHAPE_SYMBOLS[centerDirection]} ${SHAPE_SYMBOLS[flankerDirection]}`,
        congruency: congruent ? 'congruent' : 'incongruent',
        correctId: target.id,
        renderMode: 'executive',
        distractorCount: 1,
        expectedResponseType: 'hit'
      };
    }

    return buildQuestion(index);
  }

  function currentQuestionFamily(){
    return state.currentQuestion ? state.currentQuestion.family : 'none';
  }

  function showScreen(id){
    ['screenWelcome', 'screenPrompt', 'screenChoice', 'screenReward', 'screenSummary'].forEach(screenId => {
      if(ui[screenId]) ui[screenId].classList.toggle('active', screenId === id);
    });
  }

  function applyViewMode(mode, persist=true){
    state.viewMode = mode === 'learner' ? 'learner' : 'desktop';
    const wrap = document.querySelector('.wrap');
    if(wrap) wrap.classList.toggle('learner', state.viewMode === 'learner');
    if(ui.dashMode) ui.dashMode.textContent = state.viewMode === 'learner' ? 'Learner' : 'Desktop';
    if(ui.modeInfo) ui.modeInfo.textContent = state.viewMode === 'learner' ? 'Learner' : 'Practitioner';
    if(ui.learnerBanner){
      ui.learnerBanner.innerHTML = state.viewMode === 'learner'
        ? '<b>Learner mode</b><span class="tiny">Calmer full-screen view for pupils</span>'
        : '<b>Practitioner mode</b><span class="tiny">Analytics, controls, and history remain available</span>';
    }
    if(persist) saveSettingsSoon();
    refreshDashboard(true);
  }

  function resizeCanvas(){
    if(!ui.trailCanvas || !ui.playArea) return;
    const rect = ui.playArea.getBoundingClientRect();
    ui.trailCanvas.width = Math.max(1, Math.round(rect.width * window.devicePixelRatio));
    ui.trailCanvas.height = Math.max(1, Math.round(rect.height * window.devicePixelRatio));
    ui.trailCanvas.style.width = `${Math.round(rect.width)}px`;
    ui.trailCanvas.style.height = `${Math.round(rect.height)}px`;
    const ctx = ui.trailCanvas.getContext('2d');
    ctx.setTransform(window.devicePixelRatio, 0, 0, window.devicePixelRatio, 0, 0);
    drawTrail();
  }

  function getPlayAreaPoint(clientX, clientY){
    const rect = ui.playArea.getBoundingClientRect();
    return {
      x: clamp(clientX - rect.left, 0, rect.width),
      y: clamp(clientY - rect.top, 0, rect.height)
    };
  }

  function clearTrail(){
    state.runtime.currentTouchPoint = null;
    const ctx = ui.trailCanvas.getContext('2d');
    ctx.clearRect(0, 0, ui.trailCanvas.width, ui.trailCanvas.height);
  }

  function drawTrail(){
    if(!ui.trailCanvas) return;
    const ctx = ui.trailCanvas.getContext('2d');
    ctx.clearRect(0, 0, ui.trailCanvas.width, ui.trailCanvas.height);
    if(!(ui.trackTrail && ui.trackTrail.checked)) return;
    if(state.phase !== 'choice' && state.phase !== 'prompt') return;
    const points = state.logs.filter(event => event.type.startsWith('pointer_') && event.session_id === state.sessionId).slice(-60);
    if(!points.length) return;
    ctx.strokeStyle = 'rgba(113,212,255,0.8)';
    ctx.lineWidth = 4;
    ctx.lineCap = 'round';
    ctx.beginPath();
    points.forEach((event, index) => {
      const x = event.pointer_play_x;
      const y = event.pointer_play_y;
      if(index === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.stroke();
    if(ui.showTouchDebug && ui.showTouchDebug.checked && state.currentQuestion){
      const targetButton = getCurrentTargetButton();
      if(targetButton){
        const rect = targetButton.getBoundingClientRect();
        const canvasRect = ui.trailCanvas.getBoundingClientRect();
        const cx = rect.left - canvasRect.left + rect.width / 2;
        const cy = rect.top - canvasRect.top + rect.height / 2;
        ctx.strokeStyle = 'rgba(255,210,125,0.95)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(cx, cy, getAdaptiveHitRadius(), 0, Math.PI * 2);
        ctx.stroke();
      }
    }
  }

  function scheduleTrailDraw(){
    if(state.runtime.trailFrame) return;
    state.runtime.trailFrame = window.requestAnimationFrame(() => {
      state.runtime.trailFrame = 0;
      drawTrail();
    });
  }

  function showRipple(x, y, color='#71d4ff'){
    if(performanceModeEnabled() && state.lastPointerType === 'touch') return;
    const ripple = document.createElement('div');
    ripple.className = 'ripple';
    ripple.style.left = `${x}px`;
    ripple.style.top = `${y}px`;
    ripple.style.borderColor = `${color}`;
    ripple.style.background = `${color}22`;
    ui.fx.appendChild(ripple);
    window.setTimeout(() => ripple.remove(), 620);
  }

  function logEvent(type, data={}){
    const event = {
      id: uuid4(),
      type,
      session_id: state.sessionId,
      pupil_alias: currentPupilName(),
      level: state.currentLevel,
      t_wall_ms: wallMs(),
      t_perf_ms: Math.round(nowMs()),
      ...data
    };
    state.logs.push(event);
    if(ui.evCount) ui.evCount.textContent = String(state.logs.length);
    scheduleCurrentSessionPersist();
    return event;
  }

  function getCurrentTargetButton(){
    if(!state.currentQuestion) return null;
    if(state.currentQuestion.kind === 'touch-screen'){
      return ui.choiceGrid.querySelector('[data-cue-target="true"]');
    }
    return ui.choiceGrid.querySelector(`[data-role="correct-target"]`) || ui.choiceGrid.querySelector(`[data-id="${state.currentQuestion.correctId}"]`);
  }

  function getElementCentre(node){
    const rect = node.getBoundingClientRect();
    return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2, rect };
  }

  function computeDistanceToNode(clientX, clientY, node){
    if(!node) return null;
    const playPoint = getPlayAreaPoint(clientX, clientY);
    const rect = node.getBoundingClientRect();
    const playRect = ui.playArea.getBoundingClientRect();
    const cx = rect.left - playRect.left + rect.width / 2;
    const cy = rect.top - playRect.top + rect.height / 2;
    return Math.hypot(playPoint.x - cx, playPoint.y - cy);
  }

  function createTrial(question, attemptIndex){
    return {
      trial_id: uuid4(),
      session_id: state.sessionId,
      learner: currentPupilName(),
      level: state.currentLevel,
      question_index: question.questionIndex,
      attempt_index: attemptIndex,
      repeat_count: Math.max(0, attemptIndex - 1),
      task_family: question.family,
      task_kind: question.kind,
      attention_domain: question.attentionDomain || '',
      cue_onset_wall_ms: null,
      stimulus_onset_wall_ms: null,
      response_wall_ms: null,
      feedback_onset_wall_ms: null,
      response_time_ms: null,
      timeout_after_ms: question.responseWindowMs,
      response_type: null,
      correct: false,
      omission: false,
      commission: false,
      correct_rejection: false,
      timed_out: false,
      prompt_level: state.promptState.currentLevel,
      highest_prompt_level: state.promptState.highestLevel,
      support_code: state.promptState.supportCode,
      independence_status: state.promptState.independenceStatus,
      target_id: question.correctId || (question.target && question.target.id) || '',
      target_label: (question.target && question.target.label) || '',
      selected_id: '',
      selected_label: '',
      distractor_count: question.distractorCount || 0,
      touch_anywhere_accepted: !!question.touchAnywhereAccepted,
      cue_summary: question.cueSummary || '',
      cue_validity: question.cueValidity == null ? null : question.cueValidity,
      cue_side: question.cueSide || '',
      target_side: question.targetSide || '',
      congruency: question.congruency || '',
      flanker_pattern: question.flankerPattern || '',
      notes: ui.notes.value || '',
      session_context: learnerContextSnapshot(),
      learner_baseline: learnerBaselineSnapshot()
    };
  }

  function learnerBaselineSnapshot(){
    return {
      communication_mode: ui.communicationMode.value,
      motor_access_mode: ui.motorAccessMode.value,
      adaptive_functioning_band: ui.adaptiveFunctioningBand.value,
      teacher_attention_rating: safeNumber(ui.teacherAttentionRating.value, 3),
      teacher_independence_rating: safeNumber(ui.teacherIndependenceRating.value, 3),
      eeg_participation: ui.eegParticipation.value
    };
  }

  function learnerContextSnapshot(){
    return {
      staff_member: ui.staffMember.value.trim(),
      fatigue_level: ui.fatigueLevel.value,
      sensory_state: ui.sensoryState.value,
      breaks_used: safeNumber(ui.breakCount.value, 0),
      maintenance_status: ui.maintenanceStatus.value,
      generalisation_status: ui.generalisationStatus.value,
      classroom_transfer_notes: ui.classroomTransferNotes.value.trim()
    };
  }

  function logCueShown(question){
    if(!state.currentTrial) return;
    state.currentTrial.cue_onset_wall_ms = wallMs();
    state.currentTrial.prompt_level = state.promptState.currentLevel;
    state.currentTrial.highest_prompt_level = Math.max(state.currentTrial.highest_prompt_level || 0, state.promptState.highestLevel);
    logEvent('cue_onset', {
      trial_id: state.currentTrial.trial_id,
      question_index: question.questionIndex,
      attempt_index: state.currentTrial.attempt_index,
      task_kind: question.kind,
      attention_domain: question.attentionDomain || '',
      cue_validity: question.cueValidity == null ? null : question.cueValidity,
      cue_side: question.cueSide || '',
      cue_summary: question.cueSummary || '',
      highest_prompt_level: state.promptState.highestLevel
    });
  }

  function logStimulusShown(question){
    if(!state.currentTrial) return;
    state.currentTrial.stimulus_onset_wall_ms = wallMs();
    logEvent('stimulus_onset', {
      trial_id: state.currentTrial.trial_id,
      question_index: question.questionIndex,
      attempt_index: state.currentTrial.attempt_index,
      task_kind: question.kind,
      attention_domain: question.attentionDomain || '',
      target_id: state.currentTrial.target_id,
      distractor_count: state.currentTrial.distractor_count,
      response_window_ms: question.responseWindowMs
    });
  }

  function markPromptLevel(level, supportCode){
    const meta = promptMeta(level);
    state.promptState.currentLevel = meta.level;
    state.promptState.highestLevel = Math.max(state.promptState.highestLevel, meta.level);
    state.promptState.supportCode = supportCode || meta.supportCode;
    state.promptState.independenceStatus = meta.independence;
    if(ui.supportCodeSelect) ui.supportCodeSelect.value = state.promptState.supportCode;
    if(ui.supportIntensitySelect) ui.supportIntensitySelect.value = state.promptState.independenceStatus;
    if(ui.currentPromptLabel) ui.currentPromptLabel.textContent = meta.label;
    if(ui.currentSupportLabel) ui.currentSupportLabel.textContent = state.promptState.supportCode.replace(/-/g, ' ');
    if(state.currentTrial){
      state.currentTrial.highest_prompt_level = Math.max(state.currentTrial.highest_prompt_level || 0, meta.level);
      state.currentTrial.support_code = state.promptState.supportCode;
      state.currentTrial.independence_status = state.promptState.independenceStatus;
      logEvent('prompt_applied', {
        trial_id: state.currentTrial.trial_id,
        question_index: state.currentQuestion ? state.currentQuestion.questionIndex : 0,
        task_kind: state.currentQuestion ? state.currentQuestion.kind : '',
        prompt_level: meta.level,
        prompt_label: meta.label,
        support_code: state.promptState.supportCode,
        independence_status: state.promptState.independenceStatus
      });
      applyPromptEffect(meta.level);
    }
  }

  function resetPromptState(){
    state.promptState.currentLevel = 0;
    state.promptState.highestLevel = 0;
    state.promptState.supportCode = ui.supportCodeSelect ? ui.supportCodeSelect.value : 'none';
    state.promptState.independenceStatus = ui.supportIntensitySelect ? ui.supportIntensitySelect.value : 'independent';
    if(ui.currentPromptLabel) ui.currentPromptLabel.textContent = promptMeta(0).label;
    if(ui.currentSupportLabel) ui.currentSupportLabel.textContent = state.promptState.supportCode.replace(/-/g, ' ');
  }

  function highlightTarget(targetNode){
    if(!targetNode) return;
    const original = targetNode.style.boxShadow;
    const originalBorder = targetNode.style.borderColor;
    targetNode.style.boxShadow = '0 0 0 10px rgba(113,212,255,0.18), 0 0 28px rgba(113,212,255,0.35)';
    targetNode.style.borderColor = 'rgba(113,212,255,0.95)';
    window.setTimeout(() => {
      targetNode.style.boxShadow = original;
      targetNode.style.borderColor = originalBorder;
    }, 1100);
  }

  function applyPromptEffect(level){
    if(!state.currentQuestion) return;
    const targetNode = getCurrentTargetButton();
    const question = state.currentQuestion;
    if(level === 1 || level === 2){
      speak(question.prompt);
      flash('try', 'Prompt');
      return;
    }
    if(level === 3){
      highlightTarget(targetNode);
      flash('good', 'Highlight');
      return;
    }
    if(level === 4){
      highlightTarget(targetNode);
      speak(`This one. ${question.target ? question.target.label : question.prompt}`);
      flash('good', 'Model');
      return;
    }
    if(level === 5){
      highlightTarget(targetNode);
      flash('good', 'Support');
      window.setTimeout(() => {
        if(state.phase !== 'choice' || !state.currentQuestion) return;
        const node = getCurrentTargetButton();
        if(node){
          const fakeEvent = {
            clientX: node.getBoundingClientRect().left + node.getBoundingClientRect().width / 2,
            clientY: node.getBoundingClientRect().top + node.getBoundingClientRect().height / 2,
            supportAutoSelect: true
          };
          const option = state.currentQuestion.options.find(item => item.id === state.currentQuestion.correctId) || state.currentQuestion.target;
          handleChoice(option, node, fakeEvent, { assisted: true });
        }
      }, 600);
    }
  }

  function makePromptPreview(question){
    clearNode(ui.promptPreviewRow);
    const cards = [];
    if(question.renderMode === 'cpat-sustained'){
      const card = document.createElement('div');
      card.className = 'bigCard';
      card.appendChild(buildChoiceMediaElement(question.target, 'faceCircle'));
      const text = document.createElement('div');
      text.textContent = 'Tap only for the star';
      card.appendChild(text);
      cards.push(card);
    } else if(question.renderMode === 'executive'){
      const card = document.createElement('div');
      card.className = 'bigCard';
      const pattern = document.createElement('div');
      pattern.style.fontSize = '52px';
      pattern.textContent = question.flankerPattern;
      const sub = document.createElement('div');
      sub.textContent = 'Follow the middle arrow';
      card.append(pattern, sub);
      cards.push(card);
    } else if(question.renderMode === 'orienting'){
      const card = document.createElement('div');
      card.className = 'bigCard';
      const arrow = document.createElement('div');
      arrow.style.fontSize = '56px';
      arrow.textContent = question.cueSide === 'left' ? '←' : '→';
      const sub = document.createElement('div');
      sub.textContent = question.cueValidity ? 'Cue may help' : 'Cue may mislead';
      card.append(arrow, sub);
      arrow.textContent = question.cueSide === 'left' ? '\u2190' : '\u2192';
      cards.push(card);
    } else if(question.target){
      const card = document.createElement('div');
      card.className = 'bigCard';
      card.appendChild(buildChoiceMediaElement(question.target, question.target.src ? 'imgCircle' : 'faceCircle'));
      const label = document.createElement('div');
      label.textContent = question.target.label;
      card.appendChild(label);
      cards.push(card);
    }
    cards.forEach(card => ui.promptPreviewRow.appendChild(card));
  }

  function renderQuestionText(question){
    if(question.renderMode === 'cpat-sustained') return 'Tap only when you see the star';
    return ui.useTextPrompt.checked ? question.prompt : taskLabel(question.kind);
  }

  function createChoiceButton(option, question){
    const btn = document.createElement('button');
    btn.className = 'choice';
    btn.dataset.id = option.id;
    if(option.id === question.correctId && question.kind !== 'touch-screen') btn.dataset.role = 'correct-target';
    btn.addEventListener('click', event => handleChoice(option, btn, event));
    btn.addEventListener('touchstart', () => {
      state.isTouchDevice = true;
      state.lastPointerType = 'touch';
      btn.classList.add('pressed');
    }, { passive: true });
    btn.addEventListener('touchend', event => {
      event.preventDefault();
      btn.classList.remove('pressed');
      if(!(event.changedTouches && event.changedTouches[0])) return;
      handleChoice(option, btn, event.changedTouches[0]);
    }, { passive: false });
    btn.addEventListener('touchcancel', () => btn.classList.remove('pressed'));
    return btn;
  }

  function renderChoiceScreen(question){
    clearNode(ui.choiceGrid);
    ui.questionText.textContent = renderQuestionText(question);
    ui.choiceGrid.style.position = question.renderMode === 'single-target' || question.renderMode === 'touch-screen' || question.renderMode === 'cpat-sustained' ? 'relative' : '';
    ui.choiceGrid.style.width = (question.renderMode === 'single-target' || question.renderMode === 'touch-screen' || question.renderMode === 'cpat-sustained') ? '100%' : '';
    ui.choiceGrid.style.maxWidth = (question.renderMode === 'single-target' || question.renderMode === 'touch-screen' || question.renderMode === 'cpat-sustained') ? '100%' : '';
    ui.choiceGrid.style.minHeight = (question.renderMode === 'single-target' || question.renderMode === 'touch-screen' || question.renderMode === 'cpat-sustained') ? '420px' : '';

    if(question.renderMode === 'touch-screen'){
      const overlay = createChoiceButton(question.options[0], question);
      overlay.style.position = 'absolute';
      overlay.style.inset = '0';
      overlay.style.width = '100%';
      overlay.style.minHeight = '420px';
      overlay.style.background = 'transparent';
      overlay.style.borderColor = 'transparent';
      overlay.style.boxShadow = 'none';
      overlay.style.padding = '0';
      const helper = document.createElement('div');
      helper.className = 'choiceSmall';
      helper.textContent = 'Any touch in this panel counts.';
      helper.style.position = 'absolute';
      helper.style.left = '50%';
      helper.style.bottom = '16px';
      helper.style.transform = 'translateX(-50%)';
      helper.style.pointerEvents = 'none';
      overlay.appendChild(helper);

      const cue = document.createElement('div');
      cue.className = 'choice';
      cue.dataset.cueTarget = 'true';
      cue.style.position = 'absolute';
      cue.style.left = `${question.layout.left}%`;
      cue.style.top = `${question.layout.top}%`;
      cue.style.width = `${Math.round(question.layout.size)}px`;
      cue.style.minHeight = `${Math.round(question.layout.size)}px`;
      cue.style.transform = 'translate(-50%, -50%)';
      cue.style.pointerEvents = 'none';
      const label = document.createElement('div');
      label.className = 'choiceLabel';
      label.textContent = question.target.label;
      setNodeChildren(cue, buildChoiceMediaElement(question.target, 'choiceMedia'), label);
      ui.choiceGrid.append(overlay, cue);
      return;
    }

    if(question.renderMode === 'single-target'){
      const target = question.options[0];
      const btn = createChoiceButton(target, question);
      btn.style.position = 'absolute';
      btn.style.left = `${question.layout.left}%`;
      btn.style.top = `${question.layout.top}%`;
      btn.style.width = `${Math.round(question.layout.size)}px`;
      btn.style.minHeight = `${Math.round(question.layout.size)}px`;
      btn.style.transform = 'translate(-50%, -50%)';
      const label = document.createElement('div');
      label.className = 'choiceLabel';
      label.textContent = target.label;
      const hint = document.createElement('div');
      hint.className = 'choiceSmall';
      hint.textContent = 'Touch the target';
      setNodeChildren(btn, buildChoiceMediaElement(target, 'choiceMedia'), label, hint);
      ui.choiceGrid.appendChild(btn);
      return;
    }

    if(question.renderMode === 'cpat-sustained'){
      const stimulus = question.options[0];
      const btn = createChoiceButton(stimulus, question);
      btn.style.position = 'absolute';
      btn.style.left = '50%';
      btn.style.top = '56%';
      btn.style.width = `${Math.round(levelSpec(state.currentLevel).size)}px`;
      btn.style.minHeight = `${Math.round(levelSpec(state.currentLevel).size)}px`;
      btn.style.transform = 'translate(-50%, -50%)';
      const label = document.createElement('div');
      label.className = 'choiceLabel';
      label.textContent = stimulus.label;
      const hint = document.createElement('div');
      hint.className = 'choiceSmall';
      hint.textContent = question.targetPresent ? 'Target present: respond.' : 'Target absent: wait.';
      setNodeChildren(btn, buildChoiceMediaElement(stimulus, 'choiceMedia'), label, hint);
      if(question.targetPresent) btn.dataset.role = 'correct-target';
      ui.choiceGrid.appendChild(btn);
      return;
    }

    if(question.renderMode === 'orienting'){
      ui.choiceGrid.style.gridTemplateColumns = '1fr 1fr';
      question.options.forEach(option => {
        const btn = createChoiceButton(option, question);
        btn.style.minHeight = `${Math.round(180 * getAdaptiveTouchScale())}px`;
        const label = document.createElement('div');
        label.className = 'choiceLabel';
        label.textContent = option.label;
        const hint = document.createElement('div');
        hint.className = 'choiceSmall';
        hint.textContent = option.side === 'left' ? 'Left side' : 'Right side';
        setNodeChildren(btn, buildChoiceMediaElement(option, 'choiceMedia'), label, hint);
        ui.choiceGrid.appendChild(btn);
      });
      return;
    }

    if(question.renderMode === 'executive'){
      ui.choiceGrid.style.gridTemplateColumns = '1fr 1fr';
      const display = document.createElement('div');
      display.className = 'choice';
      display.style.gridColumn = '1 / -1';
      display.style.minHeight = '140px';
      display.style.pointerEvents = 'none';
      const pattern = document.createElement('div');
      pattern.className = 'choiceLabel';
      pattern.style.fontSize = '42px';
      pattern.textContent = question.flankerPattern;
      const hint = document.createElement('div');
      hint.className = 'choiceSmall';
      hint.textContent = `${question.congruency === 'congruent' ? 'Congruent' : 'Incongruent'} trial`;
      setNodeChildren(display, pattern, hint);
      ui.choiceGrid.appendChild(display);
      question.options.forEach(option => {
        const btn = createChoiceButton(option, question);
        btn.style.minHeight = `${Math.round(160 * getAdaptiveTouchScale())}px`;
        const label = document.createElement('div');
        label.className = 'choiceLabel';
        label.textContent = option.label;
        setNodeChildren(btn, buildChoiceMediaElement(option, 'choiceMedia'), label);
        ui.choiceGrid.appendChild(btn);
      });
      return;
    }

    question.options.forEach((option, idx) => {
      const btn = createChoiceButton(option, question);
      btn.style.minHeight = `${Math.round(148 * getAdaptiveTouchScale())}px`;
      const label = document.createElement('div');
      label.className = 'choiceLabel';
      label.textContent = option.label;
      const hint = document.createElement('div');
      hint.className = 'choiceSmall';
      hint.textContent = `Choice ${idx + 1}`;
      setNodeChildren(btn, buildChoiceMediaElement(option, 'choiceMedia'), label, hint);
      ui.choiceGrid.appendChild(btn);
    });
  }

  function speak(text){
    if(!(ui.ttsToggle && ui.ttsToggle.checked) || !('speechSynthesis' in window) || !text) return;
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.95;
      utterance.pitch = 1;
      window.speechSynthesis.speak(utterance);
    } catch(_err){}
  }

  function speakFeedback(correct, label){
    if(!(ui.ttsToggle && ui.ttsToggle.checked)) return;
    if(correct){
      speak(ui.ttsLabelsToggle && ui.ttsLabelsToggle.checked ? `${label}. Well done.` : 'Well done.');
    } else {
      speak(ui.ttsLabelsToggle && ui.ttsLabelsToggle.checked ? `${label}. Try again.` : 'Try again.');
    }
  }

  function startResponseTimer(question){
    clearTimeout(state.timers.response);
    state.timers.response = window.setTimeout(() => {
      finalizeTimeoutTrial(question);
    }, question.responseWindowMs);
  }

  function finalizeTimeoutTrial(question){
    if(state.phase !== 'choice' || !state.currentTrial || !state.currentQuestion) return;
    const correctRejection = question.kind === 'cpat-sustained' && question.targetPresent === false;
    const result = {
      selected: null,
      correct: correctRejection,
      omission: !correctRejection,
      commission: false,
      correctRejection,
      timedOut: true,
      responseType: correctRejection ? 'correct-rejection' : 'omission',
      rtMs: null,
      pointerData: null
    };
    completeTrial(result);
  }

  function completeTrial(result){
    clearTimeout(state.timers.response);
    clearTimeout(state.timers.preview);
    const trial = state.currentTrial;
    const question = state.currentQuestion;
    if(!trial || !question) return;
    trial.response_wall_ms = wallMs();
    trial.feedback_onset_wall_ms = wallMs();
    trial.response_time_ms = result.rtMs == null ? null : Math.round(result.rtMs);
    trial.correct = !!result.correct;
    trial.omission = !!result.omission;
    trial.commission = !!result.commission;
    trial.correct_rejection = !!result.correctRejection;
    trial.timed_out = !!result.timedOut;
    trial.response_type = result.responseType;
    if(result.selected){
      trial.selected_id = result.selected.id || '';
      trial.selected_label = result.selected.label || '';
    }
    if(result.pointerData){
      Object.assign(trial, result.pointerData);
    }
    trial.highest_prompt_level = Math.max(trial.highest_prompt_level || 0, state.promptState.highestLevel);
    trial.support_code = state.promptState.supportCode;
    trial.independence_status = state.promptState.independenceStatus;
    state.trials.push(trial);
    logEvent('trial_completed', {
      trial_id: trial.trial_id,
      question_index: trial.question_index,
      attempt_index: trial.attempt_index,
      task_kind: trial.task_kind,
      attention_domain: trial.attention_domain,
      response_type: trial.response_type,
      correct: trial.correct,
      omission: trial.omission,
      commission: trial.commission,
      correct_rejection: trial.correct_rejection,
      response_time_ms: trial.response_time_ms,
      prompt_level: trial.highest_prompt_level,
      support_code: trial.support_code,
      independence_status: trial.independence_status
    });

    if(question.kind === 'touch-screen' || question.kind === 'touch-object' || question.kind === 'moving-target' || trial.correct){
      flash('good', trial.correct_rejection ? 'Waited' : 'Nice');
    } else {
      flash('try', trial.response_type === 'omission' ? 'No response' : 'Try');
    }

    updateReward(trial.correct);
    updateStats();
    scheduleCurrentSessionPersist();
    state.phase = 'feedback';

    if(ui.useReward.checked){
      ui.rewardTitle.textContent = trial.correct ? 'Well Done!' : (trial.correct_rejection ? 'Good waiting!' : 'Good Try!');
      ui.rewardSub.textContent = trial.correct
        ? (ui.autoAdvance.checked ? 'Moving to the next question automatically.' : 'Next or repeat.')
        : trial.response_type === 'omission'
          ? (ui.autoAdvance.checked ? 'No response recorded. Repeat if more support is needed.' : 'No response recorded. Repeat or move on with support.')
          : (ui.autoAdvance.checked ? 'Moving on automatically. Repeat if more practice is needed.' : 'Repeat or move on with support.');
      state.phase = 'reward';
      showScreen('screenReward');
    } else {
      showScreen('screenChoice');
    }

    if(ui.autoAdvance.checked){
      const delayMs = ui.useReward.checked ? rewardAdvanceDelayMs() : interTrialDelayMs();
      state.timers.reward = window.setTimeout(() => advanceAfterFeedback(), delayMs);
    }
  }

  function handleChoice(option, button, event, options={}){
    if(state.phase !== 'choice' || !state.currentQuestion || !state.currentTrial) return;
    const question = state.currentQuestion;
    const trial = state.currentTrial;
    const rtMs = wallMs() - (trial.stimulus_onset_wall_ms || wallMs());
    const targetNode = getCurrentTargetButton();
    const hitRadius = getAdaptiveHitRadius();
    const rawDistance = targetNode ? computeDistanceToNode(event.clientX, event.clientY, targetNode) : null;
    const distance = rawDistance == null ? null : Math.max(0, rawDistance - hitRadius);
    const withinTargetHitRadius = rawDistance != null ? rawDistance <= hitRadius : false;
    const selectedCentre = button ? getElementCentre(button) : null;
    const targetCentre = targetNode ? getElementCentre(targetNode) : null;
    const selectedToTargetDistance = selectedCentre && targetCentre
      ? Math.hypot(selectedCentre.x - targetCentre.x, selectedCentre.y - targetCentre.y)
      : null;
    const playPoint = getPlayAreaPoint(event.clientX, event.clientY);

    let correct = option.id === question.correctId;
    let commission = !correct;
    let omission = false;
    let responseType = correct ? 'hit' : 'incorrect-selection';

    if(question.kind === 'touch-screen'){
      correct = true;
      commission = false;
      responseType = 'panel-touch';
    }
    if(question.kind === 'cpat-sustained' && question.targetPresent === false){
      correct = false;
      commission = true;
      responseType = 'false-alarm';
    }
    if(options.assisted){
      responseType = 'assisted-correct';
      correct = true;
      commission = false;
      state.promptState.independenceStatus = 'assisted';
      state.promptState.supportCode = 'physical';
      trial.independence_status = 'assisted';
      trial.support_code = 'physical';
      trial.highest_prompt_level = Math.max(trial.highest_prompt_level || 0, 5);
    }

    const result = {
      selected: option,
      correct,
      omission,
      commission,
      correctRejection: false,
      timedOut: false,
      responseType,
      rtMs,
      pointerData: {
        pointer_client_x: Math.round(event.clientX),
        pointer_client_y: Math.round(event.clientY),
        pointer_play_x: Number(playPoint.x.toFixed(2)),
        pointer_play_y: Number(playPoint.y.toFixed(2)),
        raw_distance_to_target_px: rawDistance == null ? null : Number(rawDistance.toFixed(2)),
        distance_to_target_px: distance == null ? null : Number(distance.toFixed(2)),
        within_target_hit_radius: withinTargetHitRadius,
        selected_to_target_distance_px: selectedToTargetDistance == null ? null : Number(selectedToTargetDistance.toFixed(2)),
        adaptive_hit_radius_px: hitRadius,
        adaptive_touch_scale: getAdaptiveTouchScale(),
        touch_anywhere_accepted: !!question.touchAnywhereAccepted
      }
    };

    if(button){
      button.classList.add(correct ? 'correct' : 'incorrect');
    }
    if(question.kind === 'cpat-selective' && correct === false){
      result.pointerData.selective_interference = true;
    }
    if(question.kind === 'cpat-orienting'){
      result.pointerData.cue_validity = question.cueValidity;
      result.pointerData.cue_side = question.cueSide;
      result.pointerData.target_side = question.targetSide;
      if(result.rtMs != null){
        result.pointerData.orienting_cost_ms = question.cueValidity ? 0 : Math.round(result.rtMs);
      }
    }
    if(question.kind === 'cpat-executive'){
      result.pointerData.congruency = question.congruency;
      result.pointerData.flanker_pattern = question.flankerPattern;
    }

    speakFeedback(correct, option.label);
    completeTrial(result);
  }

  function createProgressTrack(){
    clearNode(ui.progressTrack);
    const total = clamp(state.totalQuestions, 1, 20);
    for(let i = 1; i <= total; i++){
      const station = document.createElement('div');
      station.className = 'station';
      if(i < state.questionIndex) station.classList.add('done');
      if(i === state.questionIndex && state.phase !== 'idle' && state.phase !== 'complete') station.classList.add('current');
      station.textContent = String(i);
      ui.progressTrack.appendChild(station);
      if(i < total){
        const line = document.createElement('div');
        line.className = 'trackLine';
        const fill = document.createElement('div');
        fill.className = 'trackFill';
        fill.style.width = i < state.questionIndex ? '100%' : '0%';
        line.appendChild(fill);
        ui.progressTrack.appendChild(line);
      }
    }
  }

  function updateReward(correct){
    const summary = analyticsSummary();
    const answered = Math.max(1, summary.questions_answered);
    const accuracy = Math.round((summary.correct / answered) * 100);
    const stars = accuracy >= 80 ? 3 : accuracy >= 40 ? 2 : 1;
    state.stars = stars;
    Array.from(ui.rewardStars.children).forEach((star, index) => {
      star.classList.toggle('on', index < stars);
    });
  }

  function beginQuestion(question, attemptIndex){
    clearTimeout(state.timers.preview);
    clearTimeout(state.timers.response);
    clearTimeout(state.timers.reward);
    state.currentQuestion = question;
    state.attemptIndex = attemptIndex;
    resetPromptState();
    state.currentTrial = createTrial(question, attemptIndex);
    ui.stageLabel.textContent = taskLabel(question.kind);
    setFooter(question.subtitle, taskLabel(question.kind));
    createProgressTrack();

    const revealChoice = () => {
      renderChoiceScreen(question);
      showScreen('screenChoice');
      state.phase = 'choice';
      logStimulusShown(question);
      startResponseTimer(question);
      updateStats();
    };

    makePromptPreview(question);
    logCueShown(question);
    if(ui.useTwoStage.checked){
      ui.promptTitle.textContent = ui.useTextPrompt.checked ? question.prompt : taskLabel(question.kind);
      ui.promptSubtitle.textContent = question.cueSummary || question.subtitle;
      showScreen('screenPrompt');
      state.phase = 'prompt';
      speak(question.prompt);
      state.timers.preview = window.setTimeout(revealChoice, safeNumber(ui.delaySec.value, 1) * 1000);
    } else {
      speak(question.prompt);
      revealChoice();
    }
  }

  function startQuestion(){
    const question = buildQuestion(state.questionIndex);
    beginQuestion(question, 1);
  }

  function repeatQuestion(){
    if(!state.currentQuestion || !state.questionIndex) return;
    clearTimeout(state.timers.preview);
    clearTimeout(state.timers.response);
    clearTimeout(state.timers.reward);
    logEvent('question_repeat', {
      question_index: state.currentQuestion.questionIndex,
      attempt_index: state.attemptIndex,
      task_kind: state.currentQuestion.kind
    });
    beginQuestion(state.currentQuestion, state.attemptIndex + 1);
  }

  function advanceAfterFeedback(){
    clearTimeout(state.timers.reward);
    if(state.questionIndex >= state.totalQuestions || sessionTimedOut()){
      endSession();
      return;
    }
    state.questionIndex += 1;
    startQuestion();
  }

  function sessionTimedOut(){
    if(!state.sessionStartMs) return false;
    const maxMs = safeNumber(ui.sessionMinutes.value, 3) * 60 * 1000;
    return wallMs() - state.sessionStartMs >= maxMs;
  }

  function attentionMetricsFromTrials(trials){
    const responseTrials = trials.filter(trial => trial.response_time_ms != null && trial.correct_rejection !== true);
    const hitTrials = trials.filter(trial => trial.correct && trial.response_time_ms != null);
    const rtValues = responseTrials.map(trial => Number(trial.response_time_ms)).filter(Number.isFinite);
    const hitRtValues = hitTrials.map(trial => Number(trial.response_time_ms)).filter(Number.isFinite);
    const touchDistances = trials.map(trial => Number(trial.distance_to_target_px)).filter(Number.isFinite);
    const meanRt = hitRtValues.length ? Math.round(mean(hitRtValues)) : (rtValues.length ? Math.round(mean(rtValues)) : 0);
    const rtSd = hitRtValues.length ? Math.round(standardDeviation(hitRtValues)) : Math.round(standardDeviation(rtValues));
    const rtCv = hitRtValues.length ? Number(coefficientOfVariation(hitRtValues).toFixed(3)) : Number(coefficientOfVariation(rtValues).toFixed(3));
    const precision = touchDistances.length ? Math.max(0, 100 - Math.round(mean(touchDistances))) : 0;
    const hitRate = trials.length ? Math.round((trials.filter(trial => trial.correct).length / trials.length) * 100) : 0;
    const engagement = Math.round(clamp((hitRate * 0.55) + (Math.max(0, 100 - rtCv * 100) * 0.25) + (precision * 0.2), 0, 100));
    return {
      mean_rt_ms: meanRt,
      rt_sd_ms: rtSd,
      rt_cv: rtCv,
      mean_touch_distance_px: touchDistances.length ? Number(mean(touchDistances).toFixed(2)) : null,
      exploratory_engagement_index: engagement
    };
  }

  function latestTrialsByQuestion(trials){
    const byQuestion = new Map();
    trials.forEach(trial => {
      const existing = byQuestion.get(trial.question_index);
      if(!existing || (trial.attempt_index || 1) >= (existing.attempt_index || 1)){
        byQuestion.set(trial.question_index, trial);
      }
    });
    return Array.from(byQuestion.values()).sort((a, b) => a.question_index - b.question_index);
  }

  function analyticsSummary(){
    const cacheKey = `${state.sessionId}|${state.trials.length}|${state.currentLevel}|${state.questionIndex}|${state.history.revision}`;
    if(state.cache.summaryKey === cacheKey && state.cache.summaryValue) return state.cache.summaryValue;
    const finalTrials = latestTrialsByQuestion(state.trials);
    const metrics = attentionMetricsFromTrials(finalTrials);
    const correct = finalTrials.filter(trial => trial.correct).length;
    const omissions = finalTrials.filter(trial => trial.omission).length;
    const commissions = state.trials.filter(trial => trial.commission).length;
    const prompted = finalTrials.filter(trial => trial.highest_prompt_level > 0).length;
    const independent = finalTrials.filter(trial => trial.highest_prompt_level === 0 && trial.correct).length;
    const byDomain = {};
    finalTrials.forEach(trial => {
      const key = trial.attention_domain || taskMeta(trial.task_kind).domain || 'general';
      if(!byDomain[key]) byDomain[key] = { total: 0, correct: 0, omissions: 0, commissions: 0, rt: [] };
      byDomain[key].total += 1;
      if(trial.correct) byDomain[key].correct += 1;
      if(trial.omission) byDomain[key].omissions += 1;
      if(trial.commission) byDomain[key].commissions += 1;
      if(Number.isFinite(trial.response_time_ms)) byDomain[key].rt.push(trial.response_time_ms);
    });
    const domainSummaries = Object.keys(byDomain).map(key => ({
      domain: key,
      total: byDomain[key].total,
      accuracy_pct: byDomain[key].total ? Math.round((byDomain[key].correct / byDomain[key].total) * 100) : 0,
      omissions: byDomain[key].omissions,
      commissions: byDomain[key].commissions,
      mean_rt_ms: byDomain[key].rt.length ? Math.round(mean(byDomain[key].rt)) : 0
    }));
    const summary = {
      learner: currentPupilName(),
      task_kind: selectedSessionTaskMode(),
      task_label: taskLabel(selectedSessionTaskMode()),
      questions_answered: finalTrials.length,
      total_attempts: state.trials.length,
      repeated_attempts: Math.max(0, state.trials.length - finalTrials.length),
      correct,
      incorrect: finalTrials.length - correct,
      accuracy_pct: finalTrials.length ? Math.round((correct / finalTrials.length) * 100) : 0,
      omission_count: omissions,
      commission_count: commissions,
      independent_success_count: independent,
      prompted_success_count: prompted,
      current_level: state.currentLevel,
      single_target_repetitions: state.singleTargetRepetitions,
      domain_summaries: domainSummaries,
      ...metrics
    };
    state.cache.summaryKey = cacheKey;
    state.cache.summaryValue = summary;
    return summary;
  }

  function recommendationItems(summary){
    const items = [];
    if(!summary.questions_answered){
      items.push('Run a short session to generate baseline data.');
      items.push('Keep the first stage simple and meaningful, for example "Touch Mum" with any panel touch accepted.');
      return items;
    }
    if(summary.omission_count > 0) items.push('Omissions were recorded, so consider increasing the response window or adding an earlier prompt step.');
    if(summary.commission_count > 0) items.push('Commission-style errors were recorded, so reduce distractor pressure or strengthen the rule cue before progressing.');
    if(summary.rt_cv > 0.35) items.push('Reaction time variability is high, which may indicate unstable attention or regulation across trials.');
    if(summary.prompted_success_count > summary.independent_success_count) items.push('Prompted success currently outweighs independent success, so hold the current level and reduce prompt demands gradually.');
    if(summary.accuracy_pct >= 80 && summary.omission_count === 0) items.push('Accuracy is stable enough to consider moving to the next level or attention family.');
    if(summary.current_level >= 7) items.push('Later CPAT stages should be interpreted using omission, commission, and RT-variability data rather than a generic attention label.');
    return items;
  }

  function trialRowFromTrial(trial){
    return {
      q: trial.question_index,
      attempt: trial.attempt_index,
      task: taskLabel(trial.task_kind),
      selected: trial.selected_label || (trial.omission ? 'Omission' : trial.correct_rejection ? 'Correct rejection' : '—'),
      correct: trial.correct,
      rt: trial.response_time_ms,
      distance: trial.distance_to_target_px,
      targetDistance: trial.selected_to_target_distance_px,
      promptLevel: trial.highest_prompt_level || 0,
      independence: trial.independence_status || 'independent',
      omission: trial.omission,
      commission: trial.commission,
      domain: trial.attention_domain || '',
      session_id: trial.session_id
    };
  }

  function dashboardDataFromTrials(trials, sourceLabel){
    const finalTrials = latestTrialsByQuestion(trials);
    return {
      source: sourceLabel,
      summary: analyticsSummaryForTrials(trials),
      rows: trials.map(trialRowFromTrial),
      finalRows: finalTrials.map(trialRowFromTrial),
      trials
    };
  }

  function analyticsSummaryForTrials(trials){
    const finalTrials = latestTrialsByQuestion(trials);
    const metrics = attentionMetricsFromTrials(finalTrials);
    const correct = finalTrials.filter(trial => trial.correct).length;
    const omissions = finalTrials.filter(trial => trial.omission).length;
    const commissions = trials.filter(trial => trial.commission).length;
    return {
      learner: trials[0] ? trials[0].learner : currentPupilName(),
      questions_answered: finalTrials.length,
      total_attempts: trials.length,
      repeated_attempts: Math.max(0, trials.length - finalTrials.length),
      correct,
      incorrect: finalTrials.length - correct,
      accuracy_pct: finalTrials.length ? Math.round((correct / finalTrials.length) * 100) : 0,
      omission_count: omissions,
      commission_count: commissions,
      ...metrics
    };
  }

  function getKnownSessionRecords(includeCurrent=true){
    const sessions = state.history.sessions.slice();
    if(includeCurrent && state.trials.length){
      const current = buildSessionRecord();
      const index = sessions.findIndex(item => item.session_id === current.session_id);
      if(index >= 0) sessions[index] = current;
      else sessions.unshift(current);
    }
    return sessions.sort((a, b) => Number(b.updated_at_wall_ms || 0) - Number(a.updated_at_wall_ms || 0));
  }

  function getFilteredHistorySessions(){
    const filter = ui.historyLearnerFilter ? ui.historyLearnerFilter.value : 'all';
    const cacheKey = `${filter}|${currentPupilName()}|${state.history.revision}|${state.trials.length}|${state.sessionId}`;
    if(state.cache.historyKey === cacheKey && Array.isArray(state.cache.historyValue)) return state.cache.historyValue;
    const sessions = getKnownSessionRecords(true).filter(session => {
      if(filter === 'current') return session.learner === currentPupilName();
      if(filter === 'archived') return !!session.archived;
      return true;
    });
    state.cache.historyKey = cacheKey;
    state.cache.historyValue = sessions;
    return sessions;
  }

  function refreshHistoryManager(){
    const sessions = getFilteredHistorySessions();
    const all = getKnownSessionRecords(true);
    if(ui.historyActiveCount) ui.historyActiveCount.textContent = String(all.filter(session => !session.archived).length);
    if(ui.historyArchivedCount) ui.historyArchivedCount.textContent = String(all.filter(session => session.archived).length);
    if(ui.historyEventCount) ui.historyEventCount.textContent = String(all.reduce((sum, session) => sum + (session.events ? session.events.length : 0), 0));
    if(ui.historyStorageMode) ui.historyStorageMode.textContent = state.history.storageMode;
    if(ui.historyStatus) ui.historyStatus.textContent = `${sessions.length} session record(s) visible from ${state.history.storageMode}.`;
    clearNode(ui.historyTableBody);
    if(!sessions.length){
      const tr = document.createElement('tr');
      tr.innerHTML = '<td colspan="6" class="tiny">No stored history for this filter yet.</td>';
      ui.historyTableBody.appendChild(tr);
      return;
    }
    sessions.slice(0, 18).forEach(session => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${String(session.session_id).slice(0, 8)}</td>
        <td>${session.learner}</td>
        <td>${new Date(session.updated_at_wall_ms).toLocaleString()}</td>
        <td>${session.summary.accuracy_pct}%</td>
        <td>${session.events.length}</td>
        <td>${session.archived ? 'Archived' : session.session_id === state.sessionId ? 'Current' : 'Active'}</td>
      `;
      ui.historyTableBody.appendChild(tr);
    });
  }

  function buildSessionRecord(){
    return {
      session_id: state.sessionId,
      learner: currentPupilName(),
      build: buildExportMeta(),
      settings: settingsSnapshot(),
      learner_snapshot: currentLearnerRecord(),
      summary: analyticsSummary(),
      events: state.logs.slice(),
      trials: state.trials.slice(),
      notes: ui.notes.value || '',
      classroom_transfer_notes: ui.classroomTransferNotes.value || '',
      archived: false,
      updated_at_wall_ms: wallMs()
    };
  }

  async function persistCurrentSession(){
    if(!state.trials.length) return;
    const record = buildSessionRecord();
    if(state.storage.useIndexedDb){
      await idbPut(IDB_SESSIONS_STORE, record);
      const index = state.history.sessions.findIndex(item => item.session_id === record.session_id);
      if(index >= 0) state.history.sessions[index] = record;
      else state.history.sessions.unshift(record);
      state.history.revision += 1;
      state.history.storageMode = 'IndexedDB';
    } else {
      const existing = readJson('choice_train_sessions_fallback_v130') || [];
      const filtered = existing.filter(item => item.session_id !== record.session_id);
      filtered.unshift(record);
      persistJson('choice_train_sessions_fallback_v130', filtered.slice(0, SESSION_ARCHIVE_LIMIT));
      state.history.sessions = filtered.slice(0, SESSION_ARCHIVE_LIMIT);
      state.history.revision += 1;
      state.history.storageMode = 'Local storage fallback';
    }
    refreshHistoryManager();
  }

  function scheduleCurrentSessionPersist(){
    clearTimeout(state.timers.persist);
    state.timers.persist = window.setTimeout(() => {
      persistCurrentSession().catch(() => {});
    }, performanceModeEnabled() ? 260 : 0);
  }

  async function refreshStoredHistory(){
    if(state.storage.useIndexedDb){
      state.history.sessions = await idbGetAll(IDB_SESSIONS_STORE);
      state.history.storageMode = 'IndexedDB';
    } else {
      state.history.sessions = readJson('choice_train_sessions_fallback_v130') || [];
      state.history.storageMode = 'Local storage fallback';
    }
    state.history.revision += 1;
    refreshHistoryManager();
  }

  async function exportStoredHistory(){
    await persistCurrentSession();
    const payload = {
      app: APP_BUILD.app,
      build: buildExportMeta(),
      exported_at_wall_ms: wallMs(),
      filter: ui.historyLearnerFilter.value,
      sessions: getFilteredHistorySessions()
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    triggerBlobDownload(blob, `choice_train_history_${APP_BUILD.version}_${localTimestampForFile()}.json`);
  }

  async function archiveCurrentLearnerHistory(){
    const learner = currentPupilName();
    const sessions = getKnownSessionRecords(false).filter(session => session.learner === learner);
    for(let i = 0; i < sessions.length; i++){
      sessions[i].archived = true;
      if(state.storage.useIndexedDb) await idbPut(IDB_SESSIONS_STORE, sessions[i]);
    }
    await refreshStoredHistory();
    flash('good', 'History archived');
  }

  async function pruneArchivedHistory(){
    const archived = getKnownSessionRecords(false).filter(session => session.archived);
    for(let i = 0; i < archived.length; i++){
      if(state.storage.useIndexedDb) await idbDelete(IDB_SESSIONS_STORE, archived[i].session_id);
    }
    await refreshStoredHistory();
    flash('good', 'Archived pruned');
  }

  function currentLearnerRecord(){
    const name = currentPupilName();
    const learner = normalizeLearner(name, state.learners[name] || buildDefaultLearner(name));
    learner.baseline = {
      ...learner.baseline,
      ...learnerBaselineSnapshot(),
      staffMember: ui.staffMember.value.trim(),
      fatigueLevel: ui.fatigueLevel.value,
      sensoryState: ui.sensoryState.value,
      breakCount: safeNumber(ui.breakCount.value, 0),
      maintenanceStatus: ui.maintenanceStatus.value,
      generalisationStatus: ui.generalisationStatus.value,
      classroomTransferNotes: ui.classroomTransferNotes.value.trim()
    };
    return learner;
  }

  function saveCurrentLearnerProfile(){
    const name = currentPupilName();
    if(!name || name === 'Unknown') return;
    state.learners[name] = currentLearnerRecord();
    saveLearners();
  }

  function savePupilProgress(summary, progressedLevel){
    const name = currentPupilName();
    if(!name || name === 'Unknown') return;
    const learner = currentLearnerRecord();
    learner.lastLevel = state.currentLevel;
    learner.sessions = Array.isArray(learner.sessions) ? learner.sessions.slice(-29) : [];
    learner.sessions.push({
      timestamp: new Date().toISOString(),
      session_id: state.sessionId,
      progressed_level: !!progressedLevel,
      next_level: state.currentLevel,
      summary: {
        correct: summary.correct,
        incorrect: summary.incorrect,
        accuracy_pct: summary.accuracy_pct,
        questions_answered: summary.questions_answered,
        omission_count: summary.omission_count,
        commission_count: summary.commission_count,
        mean_rt_ms: summary.mean_rt_ms,
        rt_sd_ms: summary.rt_sd_ms,
        rt_cv: summary.rt_cv
      },
      learner_context: learnerContextSnapshot()
    });
    state.learners[name] = learner;
    saveLearners();
  }

  function loadPupilList(preferred=''){
    state.learners = getLearners();
    const names = Object.keys(state.learners).sort((a, b) => a.localeCompare(b));
    if(!names.length){
      const fallback = ui.pupilAlias.value.trim() || 'Pupil A';
      state.learners[fallback] = buildDefaultLearner(fallback);
      saveLearners();
    }
    const list = Object.keys(state.learners).sort((a, b) => a.localeCompare(b));
    clearNode(ui.pupilSelect);
    list.forEach(name => {
      const option = document.createElement('option');
      option.value = name;
      option.textContent = name;
      ui.pupilSelect.appendChild(option);
    });
    const chosen = list.includes(preferred) ? preferred : list[0];
    selectPupil(chosen, { speakGreeting: false });
  }

  function applyLearnerFields(learner){
    const baseline = learner.baseline || SESSION_CONTEXT_DEFAULTS;
    ui.communicationMode.value = baseline.communicationMode || SESSION_CONTEXT_DEFAULTS.communicationMode;
    ui.motorAccessMode.value = baseline.motorAccessMode || SESSION_CONTEXT_DEFAULTS.motorAccessMode;
    ui.adaptiveFunctioningBand.value = baseline.adaptiveFunctioningBand || SESSION_CONTEXT_DEFAULTS.adaptiveFunctioningBand;
    ui.teacherAttentionRating.value = baseline.teacherAttentionRating || SESSION_CONTEXT_DEFAULTS.teacherAttentionRating;
    ui.teacherIndependenceRating.value = baseline.teacherIndependenceRating || SESSION_CONTEXT_DEFAULTS.teacherIndependenceRating;
    ui.eegParticipation.value = baseline.eegParticipation || SESSION_CONTEXT_DEFAULTS.eegParticipation;
    ui.staffMember.value = baseline.staffMember || '';
    ui.fatigueLevel.value = baseline.fatigueLevel || SESSION_CONTEXT_DEFAULTS.fatigueLevel;
    ui.sensoryState.value = baseline.sensoryState || SESSION_CONTEXT_DEFAULTS.sensoryState;
    ui.breakCount.value = baseline.breakCount || 0;
    ui.maintenanceStatus.value = baseline.maintenanceStatus || SESSION_CONTEXT_DEFAULTS.maintenanceStatus;
    ui.generalisationStatus.value = baseline.generalisationStatus || SESSION_CONTEXT_DEFAULTS.generalisationStatus;
    ui.classroomTransferNotes.value = baseline.classroomTransferNotes || '';
  }

  function selectPupil(name, options={}){
    const learner = normalizeLearner(name, state.learners[name] || buildDefaultLearner(name));
    state.learners[name] = learner;
    state.currentPupil = learner;
    state.currentPupilName = learner.name;
    ui.pupilSelect.value = learner.name;
    ui.pupilAlias.value = learner.name;
    applyLearnerFields(learner);
    saveLearners();
    saveSettingsSoon();
    if(options.speakGreeting) speak(`Hello ${learner.name}`);
    refreshDashboard(true);
  }

  function dashboardShouldPause(){
    return performanceModeEnabled() && state.viewMode === 'learner' && !ui.liveDashboardDuringLearner.checked;
  }

  function updateStats(){
    const summary = analyticsSummary();
    if(ui.status) ui.status.textContent = state.phase;
    if(ui.qIndex) ui.qIndex.textContent = `${state.questionIndex} / ${state.totalQuestions}`;
    if(ui.acc) ui.acc.textContent = `${summary.accuracy_pct}%`;
    if(ui.qType) ui.qType.textContent = state.currentQuestion ? taskLabel(state.currentQuestion.kind) : '—';
    if(ui.sid) ui.sid.textContent = state.sessionId ? state.sessionId.slice(0, 8) : '—';
    if(ui.starBadge) ui.starBadge.textContent = `\u2605 ${state.stars}`;
    if(ui.levelBadge) ui.levelBadge.textContent = `Level ${state.currentLevel}`;
    refreshDashboard();
  }

  function refreshDashboard(force=false){
    if(!force && dashboardShouldPause()){
      state.runtime.dashboardDirty = true;
      return;
    }
    const now = wallMs();
    if(!force && performanceModeEnabled() && now - state.runtime.dashboardLastRenderAt < dashboardRefreshIntervalMs()){
      clearTimeout(state.timers.dashboard);
      state.timers.dashboard = window.setTimeout(() => refreshDashboard(true), dashboardRefreshIntervalMs());
      return;
    }
    state.runtime.dashboardLastRenderAt = now;
    state.runtime.dashboardDirty = false;
    renderDashboard();
  }

  function getHeatmapSourceData(){
    const scope = ui.heatmapScopeSelect.value;
    if(scope === 'learner-history'){
      const learner = currentPupilName();
      const trials = getKnownSessionRecords(true).flatMap(session => session.trials || []).filter(trial => trial.learner === learner);
      return { source: learner === 'Unknown' ? 'Current learner history' : `Current learner history (${learner})`, trials };
    }
    if(scope === 'all-history'){
      return { source: 'All stored history', trials: getKnownSessionRecords(true).flatMap(session => session.trials || []) };
    }
    return { source: 'Current session', trials: state.trials.slice() };
  }

  function buildHeatmapGroups(trials){
    const grouped = new Map();
    trials.forEach(trial => {
      const key = `${trial.task_kind}|${trial.question_index}`;
      if(!grouped.has(key)){
        grouped.set(key, {
          key,
          label: `Q${trial.question_index}: ${taskLabel(trial.task_kind)}`,
          trials: []
        });
      }
      grouped.get(key).trials.push(trial);
    });
    return Array.from(grouped.values());
  }

  function populateHeatmapSelector(){
    const data = getHeatmapSourceData();
    const groups = buildHeatmapGroups(data.trials);
    clearNode(ui.heatmapQuestionSelect);
    if(!groups.length){
      const option = document.createElement('option');
      option.value = '';
      option.textContent = 'No tasks yet';
      ui.heatmapQuestionSelect.appendChild(option);
      renderHeatmap();
      return;
    }
    groups.forEach(group => {
      const option = document.createElement('option');
      option.value = group.key;
      option.textContent = group.label;
      ui.heatmapQuestionSelect.appendChild(option);
    });
    renderHeatmap();
  }

  function renderHeatmap(){
    const data = getHeatmapSourceData();
    const groups = buildHeatmapGroups(data.trials);
    const selected = ui.heatmapQuestionSelect.value;
    const group = groups.find(item => item.key === selected) || groups[0];
    const canvas = ui.heatmapCanvas;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#0e1726';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    if(!group){
      ui.heatmapMeta.textContent = 'No heat map data available yet.';
      return;
    }
    group.trials.forEach(trial => {
      if(!Number.isFinite(trial.pointer_play_x) || !Number.isFinite(trial.pointer_play_y)) return;
      const x = clamp(trial.pointer_play_x / Math.max(ui.playArea.clientWidth || 1, 1) * canvas.width, 0, canvas.width);
      const y = clamp(trial.pointer_play_y / Math.max(ui.playArea.clientHeight || 1, 1) * canvas.height, 0, canvas.height);
      const color = trial.correct ? 'rgba(142,240,177,0.55)' : trial.omission ? 'rgba(255,210,125,0.35)' : 'rgba(255,179,155,0.55)';
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(x, y, 10, 0, Math.PI * 2);
      ctx.fill();
    });
    ui.heatmapMeta.textContent = `${data.source}. ${group.trials.length} trial(s). Correct ${group.trials.filter(trial => trial.correct).length}, omissions ${group.trials.filter(trial => trial.omission).length}, commissions ${group.trials.filter(trial => trial.commission).length}.`;
  }

  function drawMiniChart(canvas, values, color){
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'rgba(255,255,255,0.02)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    if(!values.length){
      ctx.fillStyle = 'rgba(255,255,255,0.45)';
      ctx.font = '12px sans-serif';
      ctx.fillText('No data yet', 22, canvas.height / 2);
      return;
    }
    const min = Math.min(...values);
    const max = Math.max(...values);
    const range = Math.max(1, max - min);
    ctx.strokeStyle = color;
    ctx.lineWidth = 3;
    ctx.beginPath();
    values.forEach((value, index) => {
      const x = 24 + ((canvas.width - 48) * (values.length === 1 ? 0 : index / (values.length - 1)));
      const y = 16 + ((canvas.height - 32) * (1 - ((value - min) / range)));
      if(index === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.stroke();
  }

  function renderDashboard(){
    const summary = analyticsSummary();
    const finalTrials = latestTrialsByQuestion(state.trials);
    const rows = finalTrials.map(trialRowFromTrial);
    if(ui.dashLearner) ui.dashLearner.textContent = currentPupilName() === 'Unknown' ? 'Not set' : currentPupilName();
    if(ui.dashQuestions) ui.dashQuestions.textContent = String(state.totalQuestions);
    if(ui.dashPrompt) ui.dashPrompt.textContent = ui.useTwoStage.checked ? '2-stage' : '1-stage';
    if(ui.dashTaskLock) ui.dashTaskLock.textContent = selectedSessionTaskMode() === 'auto' ? 'Auto' : taskLabel(selectedSessionTaskMode());
    if(ui.dashSingleTarget) ui.dashSingleTarget.textContent = String(state.singleTargetRepetitions);
    if(ui.dashAvgRt) ui.dashAvgRt.textContent = summary.mean_rt_ms ? `${summary.mean_rt_ms} ms` : '--';
    if(ui.dashAvgDistance) ui.dashAvgDistance.textContent = summary.mean_touch_distance_px == null ? '--' : `${summary.mean_touch_distance_px.toFixed(1)} px`;
    if(ui.dashTouchScale) ui.dashTouchScale.textContent = `${Math.round(getAdaptiveTouchScale() * 100)}%`;
    if(ui.dashHitRadius) ui.dashHitRadius.textContent = `${getAdaptiveHitRadius()} px`;
    if(ui.dashCorrect) ui.dashCorrect.textContent = String(summary.correct);
    if(ui.dashIncorrect) ui.dashIncorrect.textContent = String(summary.incorrect);
    if(ui.dashAccuracyLarge) ui.dashAccuracyLarge.textContent = `${summary.accuracy_pct}%`;
    if(ui.dashAnswered) ui.dashAnswered.textContent = String(summary.questions_answered);
    if(ui.accuracyFill) ui.accuracyFill.style.width = `${summary.accuracy_pct}%`;
    if(ui.dashboardSource) ui.dashboardSource.textContent = `Showing: current session (${summary.total_attempts} attempts, ${summary.omission_count} omissions, ${summary.commission_count} commissions)`;
    if(ui.dashAttentionScore) ui.dashAttentionScore.textContent = String(summary.exploratory_engagement_index);
    if(ui.dashAttentionCall) ui.dashAttentionCall.textContent = 'Exploratory only';
    if(ui.dashCurrentLevel) ui.dashCurrentLevel.textContent = String(summary.current_level);
    if(ui.dashNextRule) ui.dashNextRule.textContent = 'Accuracy + omissions + commissions';

    clearNode(ui.questionTableBody);
    if(!rows.length){
      const tr = document.createElement('tr');
      tr.innerHTML = '<td colspan="7" class="tiny">No question results yet.</td>';
      ui.questionTableBody.appendChild(tr);
    } else {
      rows.forEach(row => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td>Q${row.q}</td>
          <td>${row.task}</td>
          <td>${row.selected || '--'}</td>
          <td class="${row.correct ? 'ok' : 'nope'}">${row.correct ? 'Yes' : row.omission ? 'Omission' : 'No'}</td>
          <td>${row.rt == null ? '--' : `${Math.round(row.rt)} ms`}</td>
          <td>${row.distance == null ? '--' : `${Number(row.distance).toFixed(1)} px`}</td>
          <td>P${row.promptLevel} / ${row.independence}</td>
        `;
        ui.questionTableBody.appendChild(tr);
      });
    }

    const rtValues = finalTrials.map(trial => trial.response_time_ms).filter(Number.isFinite);
    const distValues = finalTrials.map(trial => trial.distance_to_target_px).filter(Number.isFinite);
    drawMiniChart(ui.rtChart, rtValues, '#71d4ff');
    drawMiniChart(ui.distChart, distValues, '#ffd27d');

    clearNode(ui.recommendList);
    recommendationItems(summary).forEach(item => {
      const li = document.createElement('li');
      li.textContent = item;
      ui.recommendList.appendChild(li);
    });

    populateHeatmapSelector();
  }

  function describeLevelOutcome(summary, advanced, autoStarting){
    if(advanced){
      return autoStarting ? `Progressing to Level ${state.currentLevel}. Starting automatically.` : `Progressing to Level ${state.currentLevel}.`;
    }
    if(selectedSessionTaskMode() !== 'auto') return 'Manual task mode complete; the task family will stay fixed.';
    if(state.currentLevel >= 10 && summary.accuracy_pct >= 80) return 'Level 10 complete. The learner is already at the final CPAT stage.';
    if(summary.questions_answered < state.totalQuestions) return 'The session ended before all questions were completed, so the level will stay the same.';
    return 'Remain on this level until accuracy is stable and omissions or commissions are low enough to progress.';
  }

  function shouldAdvanceLevel(summary){
    if(!ui.autoLevelPath.checked || selectedSessionTaskMode() !== 'auto') return false;
    if(summary.questions_answered < state.totalQuestions) return false;
    if(summary.accuracy_pct < 80) return false;
    if(summary.current_level >= 7 && (summary.omission_count > 1 || summary.commission_count > 1)) return false;
    return state.currentLevel < 10;
  }

  function summaryRestartLabel(advanced){
    return advanced ? `Start Level ${state.currentLevel}` : 'Start Again';
  }

  function endSession(){
    clearTimeout(state.timers.session);
    clearTimeout(state.timers.response);
    clearTimeout(state.timers.preview);
    state.phase = 'complete';
    const summary = analyticsSummary();
    const advanced = shouldAdvanceLevel(summary);
    if(advanced){
      state.currentLevel = Math.min(10, state.currentLevel + 1);
      ui.startLevel.value = state.currentLevel;
    }
    savePupilProgress(summary, advanced);
    saveCurrentLearnerProfile();
    persistCurrentSession().catch(() => {});
    if(ui.summaryRestart) ui.summaryRestart.textContent = summaryRestartLabel(advanced);
    ui.summaryText.textContent = `${summary.correct} correct, ${summary.incorrect} incorrect, ${summary.accuracy_pct}% accuracy, ${summary.omission_count} omissions, ${summary.commission_count} commissions, mean RT ${summary.mean_rt_ms || 0} ms, RT variability ${summary.rt_sd_ms || 0} ms. ${describeLevelOutcome(summary, advanced, false)}`;
    showScreen('screenSummary');
    setFooter(advanced ? `Session complete. Ready for Level ${state.currentLevel}.` : 'Session complete. Export or start again.', advanced ? 'Next level' : 'Complete');
    logEvent('session_complete', { summary, next_level: state.currentLevel, progressed_level: advanced });
    refreshDashboard(true);
  }

  function resetSession(){
    clearTimeout(state.timers.preview);
    clearTimeout(state.timers.response);
    clearTimeout(state.timers.reward);
    clearTimeout(state.timers.session);
    state.sessionId = uuid4();
    state.sessionStartMs = 0;
    state.questionIndex = 0;
    state.attemptIndex = 0;
    state.currentQuestion = null;
    state.currentTrial = null;
    state.phase = 'idle';
    state.logs = [];
    state.trials = [];
    state.sessionTarget = null;
    state.questionLayouts = {};
    state.stars = 0;
    state.importedDashboard = null;
    state.currentLevel = clamp(safeNumber(ui.startLevel.value, 1), 1, 10);
    state.totalQuestions = clamp(safeNumber(ui.sessionMax.value, 8), 1, 20);
    state.sessionTaskType = ui.sessionTaskType.value === 'auto' ? 'auto' : ui.sessionTaskType.value;
    state.singleTargetRepetitions = clamp(safeNumber(ui.singleTargetReps.value, 3), 1, 10);
    if(ui.sid) ui.sid.textContent = state.sessionId.slice(0, 8);
    if(ui.evCount) ui.evCount.textContent = '0';
    if(ui.summaryRestart) ui.summaryRestart.textContent = 'Start Again';
    createProgressTrack();
    clearTrail();
    showScreen('screenWelcome');
    setFooter('Tap Play to begin.', 'Touch ready');
    updateStats();
    refreshHistoryManager();
  }

  function startSession(){
    clearTimeout(state.timers.preview);
    clearTimeout(state.timers.response);
    clearTimeout(state.timers.reward);
    clearTimeout(state.timers.session);
    state.sessionId = uuid4();
    state.logs = [];
    state.trials = [];
    state.sessionTarget = null;
    state.questionLayouts = {};
    state.questionIndex = 1;
    state.attemptIndex = 0;
    state.phase = 'running';
    state.sessionStartMs = wallMs();
    state.totalQuestions = clamp(safeNumber(ui.sessionMax.value, 8), 1, 20);
    state.currentLevel = clamp(safeNumber(ui.startLevel.value, 1), 1, 10);
    state.sessionTaskType = ui.sessionTaskType.value === 'auto' ? 'auto' : ui.sessionTaskType.value;
    state.singleTargetRepetitions = clamp(safeNumber(ui.singleTargetReps.value, 3), 1, 10);
    if(ui.pupilSelect.value) selectPupil(ui.pupilSelect.value, { speakGreeting: false });
    saveCurrentLearnerProfile();
    if(ui.sid) ui.sid.textContent = state.sessionId.slice(0, 8);
    createProgressTrack();
    logEvent('session_start', {
      total_questions: state.totalQuestions,
      task_type: state.sessionTaskType,
      current_level: state.currentLevel,
      response_window_ms: responseWindowMs(),
      inter_trial_interval_ms: interTrialDelayMs(),
      learner_context: learnerContextSnapshot(),
      learner_baseline: learnerBaselineSnapshot()
    });
    state.timers.session = window.setTimeout(() => {
      flash('try', 'Session time reached');
      endSession();
    }, safeNumber(ui.sessionMinutes.value, 3) * 60 * 1000);
    startQuestion();
    updateStats();
  }

  async function exportLogs(){
    await persistCurrentSession();
    const payload = {
      app: APP_BUILD.app,
      build: buildExportMeta(),
      exported_at_wall_ms: wallMs(),
      session_id: state.sessionId,
      pupil: currentPupilName(),
      learner_profile: currentLearnerRecord(),
      summary: analyticsSummary(),
      trials: state.trials.slice(),
      events: state.logs.slice()
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    triggerBlobDownload(blob, `${safeFilenamePart(currentPupilName())}_${APP_BUILD.version}_${localTimestampForFile()}.json`);
    logEvent('logs_exported', { export_bytes: JSON.stringify(payload).length });
  }

  function handlePointerPosition(clientX, clientY, type, pointerType='mouse'){
    if(state.phase !== 'choice' && state.phase !== 'prompt') return;
    const sampleNow = nowMs();
    if(type === 'move' && performanceModeEnabled() && sampleNow - state.runtime.lastMoveSampleAt < moveSampleIntervalMs()){
      return;
    }
    if(type === 'move') state.runtime.lastMoveSampleAt = sampleNow;
    state.lastPointerType = pointerType;
    const playPoint = getPlayAreaPoint(clientX, clientY);
    logEvent(`pointer_${type}`, {
      phase: state.phase,
      pointer_type: pointerType,
      pointer_play_x: Number(playPoint.x.toFixed(2)),
      pointer_play_y: Number(playPoint.y.toFixed(2))
    });
    if(type === 'down'){
      showRipple(playPoint.x, playPoint.y, pointerType === 'touch' ? '#8ef0b1' : '#71d4ff');
      if(state.phase === 'prompt' && state.currentTrial){
        logEvent('premature_response', {
          trial_id: state.currentTrial.trial_id,
          task_kind: state.currentQuestion ? state.currentQuestion.kind : '',
          counts_as_commission: currentQuestionFamily() === 'cpat'
        });
      }
    }
    scheduleTrailDraw();
  }

  function bindAction(node, handler){
    if(!node) return;
    node.addEventListener('click', event => {
      event.preventDefault();
      handler(event);
    });
  }

  function attachEventHandlers(){
    bindAction(ui.startBtn, startSession);
    bindAction(ui.beginFlow, startSession);
    bindAction(ui.resetBtn, resetSession);
    bindAction(ui.exportBtn, exportLogs);
    bindAction(ui.summaryExport, exportLogs);
    bindAction(ui.summaryRestart, startSession);
    bindAction(ui.repeatBtn, repeatQuestion);
    bindAction(ui.rewardRepeat, repeatQuestion);
    bindAction(ui.rewardNext, advanceAfterFeedback);
    bindAction(ui.nextBtn, () => {
      if(state.phase === 'reward' || state.phase === 'feedback') advanceAfterFeedback();
      else if(state.phase === 'choice') finalizeTimeoutTrial(state.currentQuestion);
    });
    bindAction(ui.fullscreenBtn, async () => {
      if(getFullscreenElement()) await exitAppFullscreen();
      else await requestAppFullscreen();
      updateFullscreenButton();
    });
    bindAction(ui.learnerModeBtn, () => applyViewMode('learner'));
    bindAction(ui.practitionerModeBtn, () => applyViewMode('desktop'));
    bindAction(ui.adminModeFab, () => applyViewMode('desktop'));
    bindAction(ui.addPupil, () => {
      const name = ui.newPupilName.value.trim();
      if(!name) return;
      state.learners[name] = buildDefaultLearner(name);
      saveLearners();
      ui.newPupilName.value = '';
      loadPupilList(name);
      flash('good', `${name} added`);
    });
    bindAction(ui.refreshDashboardBtn, () => refreshDashboard(true));
    bindAction(ui.loadCurrentDashboardBtn, () => refreshDashboard(true));
    bindAction(ui.copyBuildInfoBtn, async () => {
      if(await copyText(buildInfoClipboardText())){
        flash('good', 'Build copied');
      }
    });
    bindAction(ui.copyLiveUrlBtn, async () => {
      if(await copyText(APP_BUILD.live_url)){
        flash('good', 'URL copied');
      }
    });
    bindAction(ui.refreshHistoryBtn, () => refreshStoredHistory());
    bindAction(ui.exportHistoryBtn, exportStoredHistory);
    bindAction(ui.archiveLearnerHistoryBtn, archiveCurrentLearnerHistory);
    bindAction(ui.pruneArchivedHistoryBtn, pruneArchivedHistory);

    bindAction(ui.promptIndependentBtn, () => markPromptLevel(0, 'none'));
    bindAction(ui.promptCueBtn, () => markPromptLevel(1, 'verbal'));
    bindAction(ui.promptVerbalBtn, () => markPromptLevel(2, 'verbal'));
    bindAction(ui.promptVisualBtn, () => markPromptLevel(3, 'visual'));
    bindAction(ui.promptModelBtn, () => markPromptLevel(4, 'model'));
    bindAction(ui.promptFullSupportBtn, () => markPromptLevel(5, 'physical'));

    if(ui.pupilSelect){
      ui.pupilSelect.addEventListener('change', () => selectPupil(ui.pupilSelect.value, { speakGreeting: true }));
    }
    if(ui.faceUpload){
      ui.faceUpload.addEventListener('change', event => {
        const file = event.target.files && event.target.files[0];
        if(file) loadAndStoreFamiliarFace(file);
      });
    }
    if(ui.customUpload){
      ui.customUpload.addEventListener('change', event => {
        loadAndStoreCustomImages(event.target.files);
      });
    }
    if(ui.heatmapScopeSelect){
      ui.heatmapScopeSelect.addEventListener('change', populateHeatmapSelector);
    }
    if(ui.heatmapQuestionSelect){
      ui.heatmapQuestionSelect.addEventListener('change', renderHeatmap);
    }
    if(ui.historyLearnerFilter){
      ui.historyLearnerFilter.addEventListener('change', refreshHistoryManager);
    }
    if(ui.supportCodeSelect){
      ui.supportCodeSelect.addEventListener('change', () => {
        state.promptState.supportCode = ui.supportCodeSelect.value;
        if(ui.currentSupportLabel) ui.currentSupportLabel.textContent = ui.supportCodeSelect.value.replace(/-/g, ' ');
        if(state.currentTrial) state.currentTrial.support_code = ui.supportCodeSelect.value;
        saveCurrentLearnerProfile();
      });
    }
    if(ui.supportIntensitySelect){
      ui.supportIntensitySelect.addEventListener('change', () => {
        state.promptState.independenceStatus = ui.supportIntensitySelect.value;
        if(state.currentTrial) state.currentTrial.independence_status = ui.supportIntensitySelect.value;
      });
    }

    const settingsInputs = [
      'pupilAlias', 'sessionMax', 'maxObjects', 'delaySec', 'sessionMinutes', 'targetScale', 'startLevel',
      'autoTouchScale', 'showTouchDebug', 'useTwoStage', 'useReward', 'useTextPrompt', 'useImagePrompt',
      'useFace', 'ttsToggle', 'ttsLabelsToggle', 'autoAdvance', 'trackTrail', 'performanceMode',
      'liveDashboardDuringLearner', 'singleTargetStart', 'autoLevelPath', 'singleTargetReps', 'sessionTaskType',
      'moveSampleMs', 'dashboardRefreshMs', 'responseWindowSec', 'itiSec', 'faceName', 'notes',
      'communicationMode', 'motorAccessMode', 'adaptiveFunctioningBand', 'teacherAttentionRating',
      'teacherIndependenceRating', 'eegParticipation', 'staffMember', 'fatigueLevel', 'sensoryState',
      'breakCount', 'maintenanceStatus', 'generalisationStatus', 'classroomTransferNotes'
    ];
    settingsInputs.forEach(id => {
      if(!ui[id]) return;
      const handler = () => {
        saveSettingsSoon();
        saveCurrentLearnerProfile();
        updateStats();
      };
      ui[id].addEventListener('change', handler);
      ui[id].addEventListener('input', handler);
    });

    ui.playArea.addEventListener('pointerdown', event => {
      state.lastPointerType = event.pointerType || 'mouse';
      handlePointerPosition(event.clientX, event.clientY, 'down', state.lastPointerType);
    });
    ui.playArea.addEventListener('pointermove', event => {
      handlePointerPosition(event.clientX, event.clientY, 'move', event.pointerType || state.lastPointerType);
    });
    ui.playArea.addEventListener('pointerup', event => {
      handlePointerPosition(event.clientX, event.clientY, 'up', event.pointerType || state.lastPointerType);
    });
    ui.playArea.addEventListener('touchstart', event => {
      state.isTouchDevice = true;
      state.lastPointerType = 'touch';
      if(event.touches && event.touches[0]){
        handlePointerPosition(event.touches[0].clientX, event.touches[0].clientY, 'down', 'touch');
      }
    }, { passive: true });
    ui.playArea.addEventListener('touchmove', event => {
      if(event.touches && event.touches[0]){
        handlePointerPosition(event.touches[0].clientX, event.touches[0].clientY, 'move', 'touch');
      }
    }, { passive: true });
    ui.playArea.addEventListener('touchend', event => {
      if(event.changedTouches && event.changedTouches[0]){
        handlePointerPosition(event.changedTouches[0].clientX, event.changedTouches[0].clientY, 'up', 'touch');
      }
    }, { passive: true });
    window.addEventListener('resize', resizeCanvas);
    document.addEventListener('fullscreenchange', updateFullscreenButton);
  }

  function initialiseImportedDashboardHandling(){
    if(!ui.dashboardImport) return;
    ui.dashboardImport.addEventListener('change', event => {
      const file = event.target.files && event.target.files[0];
      if(!file) return;
      const reader = new FileReader();
      reader.onload = () => {
        try {
          const raw = String(reader.result || '').trim();
          const parsed = JSON.parse(raw);
          const trials = Array.isArray(parsed.trials) ? parsed.trials : [];
          const summary = parsed.summary || analyticsSummaryForTrials(trials);
          state.importedDashboard = {
            source: `Imported file: ${file.name}`,
            summary,
            trials
          };
          flash('good', 'Dashboard imported');
        } catch(_err){
          flash('try', 'Import failed');
        }
      };
      reader.readAsText(file);
    });
  }

  async function initialiseStorage(){
    await openDb();
    await hydrateAssets();
    await refreshStoredHistory();
  }

  function initialSetup(){
    applyBuildInfo();
    loadSettings();
    loadPupilList(readJson(SETTINGS_KEY)?.selectedPupil || '');
    applyViewMode(state.viewMode || 'desktop', false);
    updateFullscreenButton();
    attachEventHandlers();
    initialiseImportedDashboardHandling();
    resizeCanvas();
    resetSession();
    updateStats();
    refreshDashboard(true);
    initialiseStorage().then(() => {
      refreshDashboard(true);
      logEvent('app_loaded', {
        build: buildExportMeta(),
        storage_mode: state.history.storageMode
      });
    }).catch(() => {
      logEvent('app_loaded', {
        build: buildExportMeta(),
        storage_mode: 'Local storage fallback'
      });
    });
  }

  initialSetup();
})();
