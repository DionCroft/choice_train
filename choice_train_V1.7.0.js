(() => {
  const APP_BUILD = Object.freeze({
    app: 'ChoiceTrain for ShowMe',
    version: '1.7.0',
    release_label: 'V1.7.0',
    channel: 'stable',
    source_file: 'choice_train_V1.7.0.html',
    source_script: 'choice_train_V1.7.0.js',
    based_on_branch: 'main',
    based_on_commit: '185fdd2',
    build_date: '2026-11-07',
    published_entry: 'index.html',
    live_url: 'https://dioncroft.github.io/choice_train/',
    repo_url: 'https://github.com/DionCroft/choice_train'
  });

  const SETTINGS_KEY = 'choice_train_settings_v140';
  const LEARNERS_KEY = 'choice_train_learners_v140';
  const LEGACY_SETTINGS_KEYS = ['choice_train_settings_v130', 'choice_train_profile_v1'];
  const LEGACY_LEARNERS_KEYS = ['choice_train_learners_v130', 'ct_profiles'];
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
  const DATA_SCHEMA_VERSION = 4;
  const PHOTO_SCHEMA_VERSION = 2;
  const MAX_IMPORT_FILES = 100;
  const MAX_IMAGE_FILE_BYTES = 12 * 1024 * 1024;
  const MAX_DECODED_IMAGE_PIXELS = 40_000_000;
  const PREPARED_ORIGINAL_MAX_EDGE = 1600;
  const DISPLAY_IMAGE_MAX_EDGE = 960;
  const EEG_EVENT_CODES = Object.freeze({
    session_start: 1,
    prompt_onset: 10,
    cue_onset: 11,
    stimulus_onset: 12,
    target_present: 13,
    no_go: 14,
    response: 20,
    omission: 21,
    commission: 22,
    feedback_onset: 30,
    prompt_onset_support: 31,
    audio_onset: 32,
    reward_onset: 33,
    break_onset: 40,
    break_offset: 41,
    artifact: 50,
    session_complete: 90
  });
  const RESEARCH_CONDITION_LABELS = Object.freeze({
    training: 'Training condition',
    'active-control': 'Active control'
  });
  const REQUIRED_THEME_TOKENS = Object.freeze([
    'canvas', 'surface', 'surface-subtle', 'surface-raised', 'text', 'text-muted',
    'border', 'border-strong', 'control', 'control-hover', 'primary', 'primary-hover',
    'primary-soft', 'on-primary', 'success', 'success-soft', 'warning', 'warning-soft',
    'danger', 'danger-soft', 'reward', 'reward-soft', 'inverse', 'on-inverse', 'focus',
    'focus-soft', 'scrim', 'shadow', 'stimulus-blue', 'stimulus-green', 'stimulus-amber',
    'stimulus-red', 'stimulus-pink', 'stimulus-violet'
  ]);

  function defineTheme(label, values){
    const { background, main, ...semantic } = values;
    return Object.freeze({
      label,
      badge: label,
      root: Object.freeze({
        ...semantic,
        bg: semantic.canvas,
        panel: semantic.surface,
        panel2: semantic['surface-subtle'],
        muted: semantic['text-muted'],
        btn: semantic.control,
        btn2: semantic['control-hover'],
        accent: semantic.primary,
        good: semantic.success,
        warn: semantic.warning,
        bad: semantic.danger,
        card: semantic['surface-raised'],
        cardHi: semantic['primary-soft']
      }),
      background,
      main
    });
  }

  const THEME_META = Object.freeze({
    'calm-light': defineTheme('Calm Light', {
      canvas: '#f2f7f6', surface: '#ffffff', 'surface-subtle': '#e7f1f0', 'surface-raised': '#ffffff',
      text: '#172b35', 'text-muted': '#52656d', border: '#738c91', 'border-strong': '#526f75',
      control: '#e5efee', 'control-hover': '#d5e5e3', primary: '#0b6b68', 'primary-hover': '#075653',
      'primary-soft': '#d8eceb', 'on-primary': '#ffffff', success: '#267a4a', 'success-soft': '#dff2e6',
      warning: '#8a5a00', 'warning-soft': '#fff1cf', danger: '#a43b31', 'danger-soft': '#f9e7e4',
      reward: '#8a5a00', 'reward-soft': '#fff1cf', inverse: '#183347', 'on-inverse': '#ffffff',
      focus: '#1264a3', 'focus-soft': '#dceaf4', scrim: 'rgba(16,36,46,.72)',
      shadow: '0 16px 40px rgba(23,43,53,.14)', 'stimulus-blue': '#1264a3',
      'stimulus-green': '#267a4a', 'stimulus-amber': '#8a5a00', 'stimulus-red': '#a43b31',
      'stimulus-pink': '#a23b72', 'stimulus-violet': '#6549a8',
      background: 'linear-gradient(180deg,#e7f1f0,#f2f7f6)',
      main: 'radial-gradient(circle at top,rgba(11,107,104,.09),transparent 38%),linear-gradient(180deg,#f7faf9,#e7f1f0)'
    }),
    'calm-blue': defineTheme('Calm Blue', {
      canvas: '#0a1019', surface: '#121a27', 'surface-subtle': '#0f1724', 'surface-raised': '#172334',
      text: '#e8eefb', 'text-muted': '#b3c1d9', border: '#5f7190', 'border-strong': '#8ba9ca',
      control: '#1d2a40', 'control-hover': '#283a56', primary: '#71d4ff', 'primary-hover': '#9adfff',
      'primary-soft': '#193b50', 'on-primary': '#071521', success: '#8ef0b1', 'success-soft': '#173b30',
      warning: '#ffd27d', 'warning-soft': '#443518', danger: '#ffb39b', 'danger-soft': '#472b2b',
      reward: '#ffd24d', 'reward-soft': '#403514', inverse: '#e8eefb', 'on-inverse': '#0a1019',
      focus: '#71d4ff', 'focus-soft': '#193b50', scrim: 'rgba(0,0,0,.76)',
      shadow: '0 16px 40px rgba(0,0,0,.34)', 'stimulus-blue': '#71d4ff',
      'stimulus-green': '#8ef0b1', 'stimulus-amber': '#ffd27d', 'stimulus-red': '#ffb39b',
      'stimulus-pink': '#ff98d1', 'stimulus-violet': '#b99cff',
      background: 'linear-gradient(180deg,#2a4d7e,#070d15)',
      main: 'radial-gradient(circle at top,rgba(69,117,255,.12),transparent 35%),linear-gradient(180deg,#08111e,#040915)'
    }),
    'soft-green': defineTheme('Soft Green', {
      canvas: '#0c1511', surface: '#132019', 'surface-subtle': '#101a15', 'surface-raised': '#183024',
      text: '#edf8f1', 'text-muted': '#b7ccbe', border: '#5d7b68', 'border-strong': '#8eae99',
      control: '#213328', 'control-hover': '#2b4436', primary: '#92e2b8', 'primary-hover': '#b1ebca',
      'primary-soft': '#224232', 'on-primary': '#092016', success: '#9cf3b7', 'success-soft': '#1d462c',
      warning: '#ead68c', 'warning-soft': '#403819', danger: '#f1b4aa', 'danger-soft': '#482d29',
      reward: '#ead68c', 'reward-soft': '#403819', inverse: '#edf8f1', 'on-inverse': '#0c1511',
      focus: '#92e2b8', 'focus-soft': '#224232', scrim: 'rgba(3,10,6,.76)',
      shadow: '0 16px 40px rgba(0,0,0,.34)', 'stimulus-blue': '#7ec8ee',
      'stimulus-green': '#92e2b8', 'stimulus-amber': '#ead68c', 'stimulus-red': '#f1b4aa',
      'stimulus-pink': '#efa8d1', 'stimulus-violet': '#c7b4ed',
      background: 'linear-gradient(180deg,#456b5a,#08100b)',
      main: 'radial-gradient(circle at top,rgba(146,226,184,.14),transparent 35%),linear-gradient(180deg,#0b1510,#050906)'
    }),
    'warm-neutral': defineTheme('Warm Neutral', {
      canvas: '#151211', surface: '#211b19', 'surface-subtle': '#191514', 'surface-raised': '#2c221e',
      text: '#f6efe9', 'text-muted': '#d0c0b4', border: '#79685e', 'border-strong': '#ad9586',
      control: '#332824', 'control-hover': '#46362f', primary: '#f1c27d', 'primary-hover': '#f5d49f',
      'primary-soft': '#3b2f29', 'on-primary': '#281706', success: '#b8efc9', 'success-soft': '#24402e',
      warning: '#ffd79a', 'warning-soft': '#443318', danger: '#f2b4aa', 'danger-soft': '#4a2d28',
      reward: '#ffd79a', 'reward-soft': '#443318', inverse: '#f6efe9', 'on-inverse': '#151211',
      focus: '#f1c27d', 'focus-soft': '#3b2f29', scrim: 'rgba(11,7,5,.76)',
      shadow: '0 16px 40px rgba(0,0,0,.36)', 'stimulus-blue': '#8fc5ea',
      'stimulus-green': '#b8efc9', 'stimulus-amber': '#ffd79a', 'stimulus-red': '#f2b4aa',
      'stimulus-pink': '#efacd0', 'stimulus-violet': '#c9b5ef',
      background: 'linear-gradient(180deg,#6f5a48,#120c0a)',
      main: 'radial-gradient(circle at top,rgba(241,194,125,.12),transparent 35%),linear-gradient(180deg,#15100d,#080605)'
    }),
    'high-contrast': defineTheme('High Contrast', {
      canvas: '#000000', surface: '#0b0b0b', 'surface-subtle': '#151515', 'surface-raised': '#1a1a1a',
      text: '#ffffff', 'text-muted': '#ededed', border: '#8a8a8a', 'border-strong': '#ffffff',
      control: '#171717', 'control-hover': '#303030', primary: '#00d2ff', 'primary-hover': '#5fe4ff',
      'primary-soft': '#003d4a', 'on-primary': '#000000', success: '#8cff9b', 'success-soft': '#123d1a',
      warning: '#ffd84d', 'warning-soft': '#433600', danger: '#ff9f91', 'danger-soft': '#4a1f1a',
      reward: '#ffd84d', 'reward-soft': '#433600', inverse: '#ffffff', 'on-inverse': '#000000',
      focus: '#00d2ff', 'focus-soft': '#003d4a', scrim: 'rgba(0,0,0,.84)',
      shadow: '0 0 0 2px rgba(255,255,255,.34)', 'stimulus-blue': '#00d2ff',
      'stimulus-green': '#8cff9b', 'stimulus-amber': '#ffd84d', 'stimulus-red': '#ff9f91',
      'stimulus-pink': '#ff8fd2', 'stimulus-violet': '#c6a8ff',
      background: 'linear-gradient(180deg,#202020,#000000)',
      main: 'radial-gradient(circle at top,rgba(0,210,255,.14),transparent 35%),linear-gradient(180deg,#080808,#000000)'
    }),
    'low-stimulation-dark': defineTheme('Low Stimulation Dark', {
      canvas: '#090c10', surface: '#10151b', 'surface-subtle': '#0b1015', 'surface-raised': '#141c25',
      text: '#e6edf5', 'text-muted': '#aebccc', border: '#536578', 'border-strong': '#7990a5',
      control: '#1a222c', 'control-hover': '#263342', primary: '#82bad8', 'primary-hover': '#a3cce2',
      'primary-soft': '#1b3442', 'on-primary': '#08141b', success: '#8fd8af', 'success-soft': '#19382a',
      warning: '#d8c28e', 'warning-soft': '#3b321c', danger: '#d9a8a1', 'danger-soft': '#402a27',
      reward: '#d8c28e', 'reward-soft': '#3b321c', inverse: '#e6edf5', 'on-inverse': '#090c10',
      focus: '#82bad8', 'focus-soft': '#1b3442', scrim: 'rgba(0,0,0,.78)',
      shadow: '0 16px 40px rgba(0,0,0,.32)', 'stimulus-blue': '#82bad8',
      'stimulus-green': '#8fd8af', 'stimulus-amber': '#d8c28e', 'stimulus-red': '#d9a8a1',
      'stimulus-pink': '#d7a1c3', 'stimulus-violet': '#b7a9d9',
      background: 'linear-gradient(180deg,#1a2734,#05080b)',
      main: 'radial-gradient(circle at top,rgba(126,184,217,.10),transparent 35%),linear-gradient(180deg,#091019,#04070a)'
    }),
    'light-classroom': defineTheme('Light Classroom', {
      canvas: '#eef4fb', surface: '#ffffff', 'surface-subtle': '#e6eff8', 'surface-raised': '#ffffff',
      text: '#1d2a37', 'text-muted': '#53687b', border: '#6c8295', 'border-strong': '#4e6d88',
      control: '#dce8f6', 'control-hover': '#ccdbed', primary: '#236fae', 'primary-hover': '#1b598c',
      'primary-soft': '#d6e8f7', 'on-primary': '#ffffff', success: '#247a4b', 'success-soft': '#dff2e6',
      warning: '#875a08', 'warning-soft': '#fff1cf', danger: '#a43b31', 'danger-soft': '#f9e7e4',
      reward: '#875a08', 'reward-soft': '#fff1cf', inverse: '#1f3b54', 'on-inverse': '#ffffff',
      focus: '#236fae', 'focus-soft': '#d6e8f7', scrim: 'rgba(19,42,62,.72)',
      shadow: '0 16px 40px rgba(29,42,55,.14)', 'stimulus-blue': '#236fae',
      'stimulus-green': '#247a4b', 'stimulus-amber': '#875a08', 'stimulus-red': '#a43b31',
      'stimulus-pink': '#a23b72', 'stimulus-violet': '#6549a8',
      background: 'linear-gradient(180deg,#dbe8f7,#eef4fb)',
      main: 'radial-gradient(circle at top,rgba(35,111,174,.10),transparent 35%),linear-gradient(180deg,#f7faff,#e6eff8)'
    }),
    'plain-white': defineTheme('Plain White', {
      canvas: '#ffffff', surface: '#ffffff', 'surface-subtle': '#f5f6f7', 'surface-raised': '#ffffff',
      text: '#17202a', 'text-muted': '#53606d', border: '#6f7f8c', 'border-strong': '#506574',
      control: '#eef1f3', 'control-hover': '#e0e5e8', primary: '#1264a3', 'primary-hover': '#0d4f82',
      'primary-soft': '#d9e9f5', 'on-primary': '#ffffff', success: '#207a45', 'success-soft': '#e8f5ed',
      warning: '#8a5a00', 'warning-soft': '#f9efd8', danger: '#a2352a', 'danger-soft': '#faece9',
      reward: '#8a5a00', 'reward-soft': '#f9efd8', inverse: '#17202a', 'on-inverse': '#ffffff',
      focus: '#1264a3', 'focus-soft': '#d9e9f5', scrim: 'rgba(23,32,42,.72)',
      shadow: '0 12px 30px rgba(23,32,42,.12)', 'stimulus-blue': '#1264a3',
      'stimulus-green': '#207a45', 'stimulus-amber': '#8a5a00', 'stimulus-red': '#a2352a',
      'stimulus-pink': '#a23b72', 'stimulus-violet': '#6549a8',
      background: '#ffffff',
      main: '#ffffff'
    })
  });

  Object.entries(THEME_META).forEach(([themeId, theme]) => {
    const missing = REQUIRED_THEME_TOKENS.filter(token => !theme.root[token]);
    if(missing.length){
      throw new Error(`Theme "${themeId}" is missing semantic token(s): ${missing.join(', ')}`);
    }
  });
  const REWARD_META = Object.freeze({
    stars: { label: 'Stars', symbol: '\u2605' },
    bubbles: { label: 'Bubbles', symbol: '\u25EF' },
    music: { label: 'Music', symbol: '\u266B' },
    trains: { label: 'Trains', symbol: '\u{1F686}' }
  });
  const ARTIFACT_TYPES = Object.freeze({
    movement: { label: 'Movement', penalty: 8 },
    blink: { label: 'Blink', penalty: 4 },
    speech: { label: 'Speech', penalty: 9 },
    'cap-adjust': { label: 'Cap adjust', penalty: 12 },
    interruption: { label: 'Interruption', penalty: 15 }
  });
  const ATTENTION_FAMILY_LABELS = Object.freeze({
    'motor-initiation': 'Foundation: screen touch',
    targeting: 'Foundation: target touch',
    tracking: 'Foundation: moving target',
    recognition: 'Foundation: find object',
    discrimination: 'Foundation: discrimination',
    reasoning: 'Foundation: reasoning',
    choice: 'Foundation: choice',
    sustained: 'AT sustained',
    'selective-spatial': 'AT selective',
    orienting: 'AT orienting',
    executive: 'AT executive'
  });

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
    'cpat-suite': { label: 'AT suite', family: 'cpat', domain: 'mixed' },
    'cpat-sustained': { label: 'AT sustained attention', family: 'cpat', domain: 'sustained' },
    'cpat-selective': { label: 'AT selective-spatial', family: 'cpat', domain: 'selective-spatial' },
    'cpat-orienting': { label: 'AT orienting', family: 'cpat', domain: 'orienting' },
    'cpat-executive': { label: 'AT executive control', family: 'cpat', domain: 'executive' }
  };

  const CPAT_TASK_ORDER = ['cpat-sustained', 'cpat-selective', 'cpat-orienting', 'cpat-executive'];
  const CPAT_VARIANT_ORDER = {
    'cpat-sustained': ['star-watch', 'signal-station'],
    'cpat-selective': ['blue-star-search', 'ticket-hunt'],
    'cpat-orienting': ['star-pointer', 'platform-pointer'],
    'cpat-executive': ['middle-arrow', 'traffic-lights']
  };

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

  const STIMULUS_COLOR_FALLBACKS = Object.freeze({
    blue: '#71d4ff',
    green: '#8ef0b1',
    amber: '#ffd27d',
    red: '#ffb39b',
    pink: '#ff98d1',
    violet: '#b99cff'
  });

  const SESSION_CONTEXT_DEFAULTS = {
    communicationMode: 'spoken',
    motorAccessMode: 'direct-touch',
    adaptiveFunctioningBand: 'not-set',
    teacherAttentionRating: 3,
    teacherIndependenceRating: 3,
    eegParticipation: 'not-enrolled',
    aacPreference: 'not-applicable',
    staffMember: '',
    fatigueLevel: 'ready',
    sensoryState: 'regulated',
    sleepQuality: 'unknown',
    capTolerance: 'not-applicable',
    breakCount: 0,
    maintenanceStatus: 'not-run',
    generalisationStatus: 'not-run',
    classroomTransferNotes: '',
    contextNotes: '',
    rewardChoice: 'stars',
    themeChoice: 'calm-light',
    communicationSupportChoice: 'spoken',
    preSessionPreference: 'ready',
    fontChoice: 'high-legibility',
    textScale: 1,
    motionPreference: 'gentle',
    feedbackSoundMode: 'low',
    celebrationIntensity: 'gentle',
    researchCondition: 'training',
    coachingReviewNotes: '',
    studentFriendlyMode: true
  };

  const PROMPT_VARIANTS = Object.freeze({
    familiar: ['Find {label}', 'Can you find {label}?', 'Where is {label}?', 'Show me {label}', 'Let\'s find {label}'],
    category: ['Find {label}', 'Which one is {label}?', 'Can you find {label}?', 'Where is {label}?'],
    preference: ['Which one do you like?', 'Choose one', 'Pick your favourite', 'What would you like?'],
    moving: ['Can you find {label}?', 'Where is {label}?', 'Show me {label}', 'Let\'s find {label}']
  });

  const PHOTO_CATEGORY_META = Object.freeze({
    family: { label: 'Family', objectCategory: 'family', promptFind: 'a family member', promptPredicate: 'family' },
    people: { label: 'People', objectCategory: 'people', promptFind: 'a person', promptPredicate: 'a person' },
    animals: { label: 'Animals', objectCategory: 'animals', promptFind: 'an animal', promptPredicate: 'an animal' },
    transport: { label: 'Transport', objectCategory: 'transport', promptFind: 'transport', promptPredicate: 'transport' },
    food: { label: 'Food', objectCategory: 'food', promptFind: 'food', promptPredicate: 'food' },
    fruit: { label: 'Fruit', objectCategory: 'fruit', promptFind: 'fruit', promptPredicate: 'fruit' },
    'symbols-shapes': { label: 'Symbols / Shapes', objectCategory: 'symbols-shapes', promptFind: 'a symbol or shape', promptPredicate: 'a symbol or shape' },
    toy: { label: 'Toys', objectCategory: 'toy', promptFind: 'a toy', promptPredicate: 'a toy' },
    classroom: { label: 'Classroom objects', objectCategory: 'classroom', promptFind: 'a classroom object', promptPredicate: 'a classroom object' },
    activity: { label: 'Activities', objectCategory: 'activity', promptFind: 'an activity', promptPredicate: 'an activity' },
    custom: { label: 'Legacy Custom', objectCategory: 'custom', promptFind: 'a custom item', promptPredicate: 'a custom item' }
  });
  const CATEGORY_COMPATIBILITY = Object.freeze({
    animal: 'animals',
    animals: 'animals',
    vehicle: 'transport',
    vehicles: 'transport',
    transport: 'transport',
    symbol: 'symbols-shapes',
    symbols: 'symbols-shapes',
    shape: 'symbols-shapes',
    shapes: 'symbols-shapes',
    'symbols/shapes': 'symbols-shapes'
  });
  const DEFAULT_FIND_OBJECT_CATEGORIES = ['family', 'people', 'animals', 'transport', 'food', 'fruit'];
  const DEFAULT_FIND_CATEGORY_CATEGORIES = ['animals', 'transport', 'food', 'fruit'];

  const ui = {};
  document.querySelectorAll('[id]').forEach(node => {
    ui[node.id] = node;
  });

  const state = {
    viewMode: 'desktop',
    panelView: 'teacher',
    teacherPage: 'today',
    adminPage: 'overview',
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
    customCategories: [],
    selectedPhotoIds: new Set(),
    sessionContentConfig: null,
    imageEditor: null,
    familiarFace: null,
    sessionTaskType: null,
    singleTargetRepetitions: 3,
    lastPointerType: 'mouse',
    isTouchDevice: false,
    sessionEndedEarly: false,
    blockPause: null,
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
      blank: null,
      session: null,
      dashboard: null,
      profileSave: null,
      persist: null,
      breakCountdown: null,
      teacherExit: null
    },
    runtime: {
      lastMoveSampleAt: 0,
      dashboardLastRenderAt: 0,
      dashboardDirty: false,
      trailFrame: 0,
      currentTouchPoint: null
    },
    eeg: {
      markers: []
    },
    sound: {
      context: null,
      activeNodes: [],
      unlocked: false
    },
    storage: {
      db: null,
      dbPromise: null,
      ready: false,
      useIndexedDb: false,
      assetMigrationNeeded: false
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

  function eegModeEnabled(){
    return !!(ui.eegResearchMode && ui.eegResearchMode.checked);
  }

  function autoBlockPausesEnabled(){
    return !!(ui.autoBlockPauses && ui.autoBlockPauses.checked);
  }

  function eegBlockSize(){
    return clamp(safeNumber(ui.eegBlockSize && ui.eegBlockSize.value, 4), 2, 12);
  }

  function eegAutoPauseMs(){
    return clamp(safeNumber(ui.eegAutoPauseSec && ui.eegAutoPauseSec.value, 6), 2, 30) * 1000;
  }

  function researchCondition(){
    if(ui.activeControlEnabled && ui.activeControlEnabled.checked) return 'active-control';
    return ui.researchCondition ? ui.researchCondition.value : 'training';
  }

  function normalizeThemeChoice(value){
    if(value === 'classic') return 'calm-blue';
    if(value === 'trains') return 'warm-neutral';
    if(value === 'space') return 'low-stimulation-dark';
    if(value === 'animals') return 'soft-green';
    return value && THEME_META[value] ? value : 'calm-light';
  }

  function currentThemeChoice(){
    return normalizeThemeChoice(ui.themeChoice ? ui.themeChoice.value : 'calm-light');
  }

  function themeToken(name, fallback=''){
    const value = window.getComputedStyle(document.documentElement)
      .getPropertyValue(`--${name}`)
      .trim();
    return value || fallback;
  }

  function colourWithAlpha(value, alpha){
    const safeAlpha = clamp(Number(alpha), 0, 1);
    const colour = String(value || '').trim();
    const shortHex = colour.match(/^#([0-9a-f]{3})$/i);
    const longHex = colour.match(/^#([0-9a-f]{6})$/i);
    if(shortHex){
      const channels = shortHex[1].split('').map(channel => parseInt(`${channel}${channel}`, 16));
      return `rgba(${channels[0]}, ${channels[1]}, ${channels[2]}, ${safeAlpha})`;
    }
    if(longHex){
      const channels = [0, 2, 4].map(index => parseInt(longHex[1].slice(index, index + 2), 16));
      return `rgba(${channels[0]}, ${channels[1]}, ${channels[2]}, ${safeAlpha})`;
    }
    const rgb = colour.match(/^rgba?\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)/i);
    if(rgb) return `rgba(${rgb[1]}, ${rgb[2]}, ${rgb[3]}, ${safeAlpha})`;
    return colour || `rgba(113, 212, 255, ${safeAlpha})`;
  }

  function currentRewardChoice(){
    return ui.rewardChoice ? ui.rewardChoice.value : 'stars';
  }

  function studentFriendlyModeEnabled(){
    return !!(ui.studentFriendlyMode && ui.studentFriendlyMode.checked);
  }

  function currentPupilAlias(){
    return (ui.pupilAlias && ui.pupilAlias.value.trim()) || currentPupilName();
  }

  function blockIndexForQuestion(questionIndex){
    return Math.floor((Math.max(1, questionIndex) - 1) / eegBlockSize()) + 1;
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

  function schoolTimestampParts(){
    const d = new Date();
    return {
      date: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`,
      time: `${String(d.getHours()).padStart(2, '0')}${String(d.getMinutes()).padStart(2, '0')}`
    };
  }

  function safeFilenamePart(value){
    return String(value || 'unknown').trim().replace(/[^a-z0-9_-]+/gi, '-').replace(/^-+|-+$/g, '') || 'unknown';
  }

  function articleFor(word){
    return /^[aeiou]/i.test(String(word || '').trim()) ? 'an' : 'a';
  }

  function currentContextNotes(){
    return ui.contextNotes ? ui.contextNotes.value.trim() : '';
  }

  function choosePromptVariant(type, replacements={}, index=1){
    const templates = PROMPT_VARIANTS[type] || PROMPT_VARIANTS.familiar;
    const template = templates[Math.max(0, index - 1) % templates.length];
    return Object.keys(replacements).reduce((text, key) => text.replace(new RegExp(`\\{${key}\\}`, 'g'), replacements[key]), template);
  }

  function buildFindPrompt(label, index, variantType='familiar'){
    return choosePromptVariant(variantType, { label }, index);
  }

  function buildCategoryPrompt(label, index){
    const meta = categoryMeta(label);
    const prompts = [
      `Find ${meta.promptFind}`,
      `Which one is ${meta.promptPredicate}?`,
      `Can you find ${meta.promptFind}?`,
      `Where is ${meta.promptFind}?`
    ];
    return prompts[Math.max(0, index - 1) % prompts.length];
  }

  function setFooter(text, pillText){
    if(ui.footerHint) ui.footerHint.textContent = text;
    if(ui.touchInfo) ui.touchInfo.textContent = pillText;
  }

  function flash(kind, text){
    if(ui.fx) ui.fx.querySelectorAll('.ripple').forEach(ripple => ripple.remove());
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

  function clearTransientFeedback(){
    if(ui.pulseGood) ui.pulseGood.style.animation = 'none';
    if(ui.pulseTry) ui.pulseTry.style.animation = 'none';
    if(ui.badge){
      ui.badge.classList.remove('badgeShow');
      ui.badge.textContent = '';
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

  function normalizeCategoryLabel(value){
    return String(value || '').trim().replace(/\s+/g, ' ');
  }

  function categorySlug(value){
    return normalizeCategoryLabel(value)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 48);
  }

  function canonicalCategoryId(value){
    const raw = normalizeCategoryLabel(value || 'custom').toLowerCase();
    const compatible = CATEGORY_COMPATIBILITY[raw] || raw;
    if(PHOTO_CATEGORY_META[compatible]) return compatible;
    const custom = (state.customCategories || []).find(item => item.id === compatible || item.label.toLowerCase() === raw);
    return custom ? custom.id : compatible || 'custom';
  }

  function categoryMeta(categoryId){
    const id = canonicalCategoryId(categoryId);
    if(PHOTO_CATEGORY_META[id]) return { id, ...PHOTO_CATEGORY_META[id], custom: false };
    const custom = (state.customCategories || []).find(item => item.id === id);
    if(custom){
      return {
        id: custom.id,
        label: custom.label,
        objectCategory: custom.id,
        promptFind: `something from ${custom.label}`,
        promptPredicate: `in ${custom.label}`,
        custom: true
      };
    }
    return { id: 'custom', ...PHOTO_CATEGORY_META.custom, custom: false };
  }

  function availableCategories(){
    const builtIns = Object.keys(PHOTO_CATEGORY_META).map(id => categoryMeta(id));
    const customs = (state.customCategories || []).map(item => categoryMeta(item.id));
    return builtIns.concat(customs).filter((item, index, all) => all.findIndex(candidate => candidate.id === item.id) === index);
  }

  function categoryMemberships(categoryId){
    const id = canonicalCategoryId(categoryId);
    const memberships = [id];
    if(id === 'family') memberships.push('people');
    if(id === 'fruit') memberships.push('food');
    return Array.from(new Set(memberships));
  }

  function optionCategoryMemberships(option={}){
    const explicit = Array.isArray(option.categoryIds) ? option.categoryIds : [];
    const ids = explicit.length ? explicit : categoryMemberships(option.category || option.objectCategory || 'custom');
    return Array.from(new Set(ids.map(canonicalCategoryId)));
  }

  function optionMatchesCategory(option, categoryId){
    return optionCategoryMemberships(option).includes(canonicalCategoryId(categoryId));
  }

  function normalizeImageSource(value){
    return String(value || '').toLowerCase() === 'stock' ? 'stock' : 'personalised';
  }

  function sourceLabel(value){
    return normalizeImageSource(value) === 'stock' ? 'Stock' : 'Personalised';
  }

  function sourceModeLabel(value){
    const mode = normalizeSourceMode(value);
    if(mode === 'both') return 'Stock and Personalised';
    return `${sourceLabel(mode)} only`;
  }

  function normalizePhotoEdit(edit={}){
    return {
      squareCrop: !!edit.squareCrop,
      zoom: clamp(safeNumber(edit.zoom, 1), 1, 3),
      focusX: clamp(safeNumber(edit.focusX, 0.5), 0, 1),
      focusY: clamp(safeNumber(edit.focusY, 0.5), 0, 1),
      rotation: [0, 90, 180, 270].includes(Number(edit.rotation)) ? Number(edit.rotation) : 0
    };
  }

  function normalizeCategorySelection(value, fallback){
    const list = Array.isArray(value) ? value : fallback;
    return Array.from(new Set((list || []).map(canonicalCategoryId).filter(Boolean)));
  }

  function normalizeSourceMode(value){
    return ['personalised', 'stock', 'both'].includes(value) ? value : 'both';
  }

  function normalizeContentFilters(value={}){
    return {
      findObjectCategories: normalizeCategorySelection(value.findObjectCategories, DEFAULT_FIND_OBJECT_CATEGORIES),
      findObjectSource: normalizeSourceMode(value.findObjectSource),
      findCategoryCategories: normalizeCategorySelection(value.findCategoryCategories, DEFAULT_FIND_CATEGORY_CATEGORIES),
      findCategorySource: normalizeSourceMode(value.findCategorySource)
    };
  }

  function normalizeCustomCategories(items){
    const seen = new Set(Object.keys(PHOTO_CATEGORY_META));
    const result = [];
    (Array.isArray(items) ? items : []).forEach(item => {
      const label = normalizeCategoryLabel(typeof item === 'string' ? item : item && item.label);
      const requestedId = categorySlug(typeof item === 'object' && item ? item.id : label);
      if(!label || !requestedId) return;
      const id = requestedId.startsWith('custom-') ? requestedId : `custom-${requestedId}`;
      const key = label.toLowerCase();
      if(seen.has(id) || seen.has(key)) return;
      seen.add(id);
      seen.add(key);
      result.push({ id, label, createdAt: safeNumber(item && item.createdAt, wallMs()) });
    });
    return result;
  }

  function selectedCategoryIds(container){
    if(!container) return [];
    return Array.from(container.querySelectorAll('input[type="checkbox"][data-category-id]:checked'))
      .map(node => canonicalCategoryId(node.dataset.categoryId));
  }

  function contentFiltersFromUi(){
    const current = state.currentPupil && state.currentPupil.contentFilters
      ? normalizeContentFilters(state.currentPupil.contentFilters)
      : normalizeContentFilters();
    const objectCategories = selectedCategoryIds(ui.findObjectCategoryList);
    const categoryCategories = selectedCategoryIds(ui.findCategoryCategoryList);
    return normalizeContentFilters({
      findObjectCategories: objectCategories.length || (ui.findObjectCategoryList && ui.findObjectCategoryList.childElementCount) ? objectCategories : current.findObjectCategories,
      findObjectSource: ui.findObjectSourceMode ? ui.findObjectSourceMode.value : 'both',
      findCategoryCategories: categoryCategories.length || (ui.findCategoryCategoryList && ui.findCategoryCategoryList.childElementCount) ? categoryCategories : current.findCategoryCategories,
      findCategorySource: ui.findCategorySourceMode ? ui.findCategorySourceMode.value : 'both'
    });
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

  function photoLibraryMetadata(){
    return currentPupilPhotos().map(item => ({
      id: item.id,
      learner: item.learner,
      label: item.label,
      category: item.category,
      category_label: categoryMeta(item.category).label,
      original_category: item.originalCategory || item.category,
      category_memberships: optionCategoryMemberships(item),
      source: normalizeImageSource(item.source),
      relationship_type: item.relationshipType || '',
      use_in_questions: item.useInQuestions !== false,
      edit: normalizePhotoEdit(item.edit),
      has_prepared_original: !!item.originalSrc,
      schema_version: item.schemaVersion || PHOTO_SCHEMA_VERSION
    }));
  }

  function schoolExportFilename(suffix='session', extension='json'){
    const stamp = schoolTimestampParts();
    return `ChoiceTrain_${safeFilenamePart(currentPupilAlias())}_${stamp.date}_${stamp.time}_${suffix}.${extension}`;
  }

  // Local-only structured summary reserved for future LLM-assisted recommendations.
  // No session data is currently sent externally from this static build.
  function buildLocalRecommendationSummary(summary=analyticsSummary()){
    return {
      local_only: true,
      external_transmission: false,
      learner_level: state.currentLevel,
      recent_accuracy_pct: summary.accuracy_pct,
      recent_reaction_time_ms: summary.mean_rt_ms || null,
      prompt_support_used: summary.prompted_success_count,
      preferred_content: photoLibraryMetadata().slice(0, 6).map(item => item.label),
      recent_theme: currentThemeChoice(),
      recent_context_notes: currentContextNotes(),
      suggested_next_session: summary.accuracy_pct >= 80 && summary.omission_count === 0
        ? 'Continue to the next level with the same theme and personalised content.'
        : 'Repeat the current level with familiar content, generous support, and a short session.'
    };
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

  function blankIntervalEnabled(){
    return !!(ui.useBlankInterval && ui.useBlankInterval.checked);
  }

  function blankIntervalMs(){
    return clamp(safeNumber(ui.blankIntervalSec && ui.blankIntervalSec.value, 1), 0.25, 10) * 1000;
  }

  function rewardAdvanceDelayMs(){
    return Math.max(1400, interTrialDelayMs() + 900);
  }

  function rewardSymbol(){
    const meta = REWARD_META[currentRewardChoice()] || REWARD_META.stars;
    return meta.symbol;
  }

  function applyTheme(){
    const root = document.documentElement;
    const main = document.querySelector('.main');
    const themeId = currentThemeChoice();
    const theme = THEME_META[themeId] || THEME_META['calm-light'];
    if(document.body){
      Object.keys(THEME_META).forEach(id => document.body.classList.toggle(`theme-${id}`, id === themeId));
      document.body.dataset.learnerTheme = themeId;
    }
    if(root && theme.root){
      Object.entries(theme.root).forEach(([key, value]) => {
        root.style.setProperty(`--${key}`, value);
      });
      root.style.background = theme.background;
    }
    if(document.body) document.body.style.background = theme.background;
    if(main) main.style.background = theme.main;
    if(ui.touchInfo){
      const reward = REWARD_META[currentRewardChoice()] || REWARD_META.stars;
      ui.touchInfo.textContent = `${theme.label} | ${reward.label}`;
    }
    redrawThemeVisuals();
  }

  function currentFontChoice(){
    return ui.fontChoice && ui.fontChoice.value === 'familiar' ? 'familiar' : 'high-legibility';
  }

  function currentTextScale(){
    return clamp(safeNumber(ui.textScale && ui.textScale.value, 1), 0.9, 1.3);
  }

  function currentMotionPreference(){
    const value = ui.motionPreference ? ui.motionPreference.value : 'gentle';
    return ['reduced', 'gentle', 'full'].includes(value) ? value : 'gentle';
  }

  function currentFeedbackSoundMode(){
    const value = ui.feedbackSoundMode ? ui.feedbackSoundMode.value : 'low';
    return ['off', 'low', 'standard'].includes(value) ? value : 'low';
  }

  function currentCelebrationIntensity(){
    const value = ui.celebrationIntensity ? ui.celebrationIntensity.value : 'gentle';
    return ['quiet', 'gentle', 'lively'].includes(value) ? value : 'gentle';
  }

  function sensoryPreferenceSnapshot(){
    return {
      font: currentFontChoice(),
      text_scale: currentTextScale(),
      motion: currentMotionPreference(),
      feedback_sound: currentFeedbackSoundMode(),
      celebration_intensity: currentCelebrationIntensity()
    };
  }

  function applySensoryPreferences(){
    const font = currentFontChoice();
    const motion = currentMotionPreference();
    const celebration = currentCelebrationIntensity();
    document.documentElement.style.setProperty('--text-scale', String(currentTextScale()));
    document.body.classList.toggle('font-familiar', font === 'familiar');
    document.body.classList.toggle('font-high-legibility', font !== 'familiar');
    ['reduced', 'gentle', 'full'].forEach(value => document.body.classList.toggle(`motion-${value}`, motion === value));
    ['quiet', 'gentle', 'lively'].forEach(value => document.body.classList.toggle(`celebration-${value}`, celebration === value));
    if(ui.preferencePreview){
      const fontLabel = font === 'familiar' ? 'Familiar font' : 'High-legibility font';
      const soundLabel = currentFeedbackSoundMode() === 'off' ? 'sound off' : `${currentFeedbackSoundMode()} sound`;
      ui.preferencePreview.querySelector('strong').textContent = `${fontLabel}, ${Math.round(currentTextScale() * 100)}% text`;
      const detail = ui.preferencePreview.querySelector('span');
      if(detail) detail.textContent = `${motion} motion, ${soundLabel}, and ${celebration} celebrations.`;
    }
  }

  function updateSessionReadiness(){
    const learner = currentPupilName();
    const selectedTask = ui.sessionTaskType && ui.sessionTaskType.value !== 'auto'
      ? taskLabel(ui.sessionTaskType.value)
      : `Level ${clamp(safeNumber(ui.startLevel && ui.startLevel.value, 1), 1, 10)}`;
    if(ui.readinessPupil) ui.readinessPupil.textContent = learner === 'Unknown' ? 'Select a pupil' : currentPupilAlias();
    if(ui.readinessTask) ui.readinessTask.textContent = selectedTask;
    if(ui.readinessLength) ui.readinessLength.textContent = `${safeNumber(ui.sessionMinutes && ui.sessionMinutes.value, 3)} minutes`;
    if(ui.readinessQuestions) ui.readinessQuestions.textContent = String(safeNumber(ui.sessionMax && ui.sessionMax.value, 8));
    if(ui.sessionReadinessState){
      const ready = learner !== 'Unknown';
      ui.sessionReadinessState.textContent = ready ? 'Ready' : 'Needs pupil';
      ui.sessionReadinessState.classList.toggle('warnText', !ready);
    }
  }

  function audioContextConstructor(){
    return window.AudioContext || window.webkitAudioContext || null;
  }

  function ensureAudioContext(){
    const AudioContextType = audioContextConstructor();
    if(!AudioContextType || currentFeedbackSoundMode() === 'off') return null;
    if(!state.sound.context){
      try {
        state.sound.context = new AudioContextType();
      } catch(_err){
        return null;
      }
    }
    if(state.sound.context.state === 'suspended'){
      state.sound.context.resume().catch(() => {});
    }
    state.sound.unlocked = true;
    return state.sound.context;
  }

  function stopActiveSounds(){
    state.sound.activeNodes.forEach(node => {
      try { node.stop(); } catch(_err){}
      try { node.disconnect(); } catch(_err){}
    });
    state.sound.activeNodes = [];
  }

  function soundPattern(kind){
    if(kind === 'correct') return [[523.25, 0, 0.11], [659.25, 0.11, 0.13]];
    if(kind === 'complete') return currentCelebrationIntensity() === 'quiet'
      ? [[523.25, 0, 0.12]]
      : [[523.25, 0, 0.11], [659.25, 0.1, 0.12], [783.99, 0.22, 0.18]];
    if(kind === 'preview') return [[440, 0, 0.1], [587.33, 0.1, 0.14]];
    if(kind === 'wait') return [[392, 0, 0.14]];
    return [[329.63, 0, 0.12]];
  }

  function playSoundCue(kind, markerContext={}){
    if(currentFeedbackSoundMode() === 'off') return false;
    if(kind !== 'preview' && 'speechSynthesis' in window && window.speechSynthesis.speaking) return false;
    const context = ensureAudioContext();
    if(!context) return false;
    stopActiveSounds();
    const level = currentFeedbackSoundMode() === 'standard' ? 0.075 : 0.035;
    const startAt = context.currentTime + 0.015;
    soundPattern(kind).forEach(([frequency, offset, duration]) => {
      const oscillator = context.createOscillator();
      const gain = context.createGain();
      oscillator.type = kind === 'retry' ? 'sine' : 'triangle';
      oscillator.frequency.setValueAtTime(frequency, startAt + offset);
      gain.gain.setValueAtTime(0.0001, startAt + offset);
      gain.gain.exponentialRampToValueAtTime(level, startAt + offset + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.0001, startAt + offset + duration);
      oscillator.connect(gain);
      gain.connect(context.destination);
      oscillator.start(startAt + offset);
      oscillator.stop(startAt + offset + duration + 0.02);
      state.sound.activeNodes.push(oscillator);
    });
    pushEegMarker('audio_onset', { sound_id: kind, ...markerContext });
    logEvent('audio_feedback', { sound_id: kind, mode: currentFeedbackSoundMode(), ...markerContext });
    return true;
  }

  function currentPromptModeLabel(){
    const value = ui.communicationSupportChoice ? ui.communicationSupportChoice.value : 'spoken';
    if(value === 'spoken-plus-image') return 'spoken + image';
    if(value === 'image-first') return 'image first';
    if(value === 'aac-style') return 'AAC style';
    return 'spoken cue';
  }

  function applyStudentFriendlyMode(){
    const active = state.viewMode === 'learner' && studentFriendlyModeEnabled();
    document.body.classList.toggle('student-friendly-on', active);
    if(ui.adminModeFab) ui.adminModeFab.hidden = state.viewMode !== 'learner';
    if(ui.teacherExitHold) ui.teacherExitHold.hidden = state.viewMode !== 'learner';
  }

  function scrollWorkspaceTarget(target, behavior='auto'){
    if(!target) return;
    const header = document.querySelector('.panel > .section:first-child');
    const headerHeight = header ? header.getBoundingClientRect().height : 0;
    const top = Math.max(0, target.getBoundingClientRect().top + window.scrollY - headerHeight - 16);
    try {
      window.scrollTo({ top, behavior });
    } catch(_err){
      window.scrollTo(0, top);
    }
  }

  function applyPanelView(view, options={}){
    state.panelView = view === 'admin' ? 'admin' : 'teacher';
    document.body.classList.toggle('panel-view-admin', state.panelView === 'admin');
    document.body.classList.toggle('panel-view-teacher', state.panelView !== 'admin');
    if(ui.teacherPanelTab){
      const active = state.panelView !== 'admin';
      ui.teacherPanelTab.classList.toggle('active', active);
      ui.teacherPanelTab.classList.remove('adminActive');
      ui.teacherPanelTab.setAttribute('aria-pressed', String(active));
    }
    if(ui.adminPanelTab){
      const active = state.panelView === 'admin';
      ui.adminPanelTab.classList.toggle('active', active);
      ui.adminPanelTab.classList.toggle('adminActive', active);
      ui.adminPanelTab.setAttribute('aria-pressed', String(active));
    }
    if(state.panelView === 'admin'){
      applyAdminPage(state.adminPage || 'overview', options);
      return;
    }
    const teacherSection = document.querySelector('.teacherSection');
    if(teacherSection) teacherSection.open = true;
    if(options.scroll && teacherSection){
      scrollWorkspaceTarget(teacherSection, options.behavior || 'auto');
    }
  }

  function applyTeacherPage(page, options={}){
    const nextPage = ['today', 'personalise', 'results'].includes(page) ? page : 'today';
    state.teacherPage = nextPage;
    ['today', 'personalise', 'results'].forEach(value => {
      document.body.classList.toggle(`teacher-page-${value}`, value === nextPage);
      const button = ui[`teacherNav${value.charAt(0).toUpperCase()}${value.slice(1)}`];
      if(button){
        const active = value === nextPage;
        button.classList.toggle('active', active);
        button.setAttribute('aria-pressed', String(active));
      }
    });
    const section = document.querySelector(`.teacherSection[data-teacher-view="${nextPage}"]`);
    if(section) section.open = true;
    if(options.scroll && section){
      const behavior = options.behavior || (currentMotionPreference() === 'reduced' ? 'auto' : 'smooth');
      scrollWorkspaceTarget(section, behavior);
    }
  }

  function applyAdminPage(page, options={}){
    const targets = {
      overview: ui.adminAnalyticsSection,
      sessions: ui.adminHistorySection,
      learners: ui.adminLearnerProfileSection,
      eeg: ui.adminEegSection,
      system: ui.adminPanelDetails
    };
    const buttons = {
      overview: ui.adminNavOverview,
      sessions: ui.adminNavSessions,
      learners: ui.adminNavLearners,
      eeg: ui.adminNavEeg,
      system: ui.adminNavSystem
    };
    const nextPage = targets[page] ? page : 'overview';
    state.adminPage = nextPage;
    Object.keys(buttons).forEach(value => {
      document.body.classList.toggle(`admin-page-${value}`, value === nextPage);
      if(!buttons[value]) return;
      const active = value === nextPage;
      buttons[value].classList.toggle('active', active);
      buttons[value].setAttribute('aria-pressed', String(active));
    });
    if(nextPage === 'system'){
      if(ui.adminPanelDetails) ui.adminPanelDetails.open = true;
    } else if(ui.adminResearchWorkspace){
      ui.adminResearchWorkspace.open = true;
    }
    if(nextPage === 'overview') refreshDashboard(true);
    if(nextPage === 'sessions') refreshHistoryManager();
    const target = targets[nextPage];
    if(options.scroll && target){
      const behavior = options.behavior || (currentMotionPreference() === 'reduced' ? 'auto' : 'smooth');
      scrollWorkspaceTarget(target, behavior);
    }
  }

  function openTeacherPanel(){
    applyViewMode('desktop');
    applyPanelView('teacher', { scroll: true, behavior: 'auto' });
    applyTeacherPage(state.teacherPage || 'today');
  }

  function openAdminPanel(){
    applyViewMode('desktop');
    applyPanelView('admin');
    window.requestAnimationFrame(() => {
      applyAdminPage(state.adminPage || 'overview', { scroll: true, behavior: 'auto' });
    });
  }

  function fidelityChecks(){
    return [
      !!(ui.fidelityEnvironmentReady && ui.fidelityEnvironmentReady.checked),
      !!(ui.fidelityRuleShown && ui.fidelityRuleShown.checked),
      !!(ui.fidelityPromptPlan && ui.fidelityPromptPlan.checked),
      !!(ui.fidelityBreaksOffered && ui.fidelityBreaksOffered.checked),
      !!(ui.fidelityRewardDelivered && ui.fidelityRewardDelivered.checked),
      !!(ui.fidelityDataChecked && ui.fidelityDataChecked.checked)
    ];
  }

  function fidelityScorePct(){
    const checks = fidelityChecks();
    return checks.length ? Math.round((checks.filter(Boolean).length / checks.length) * 100) : 0;
  }

  function dosageMinutesActual(){
    if(!state.sessionStartMs) return 0;
    return Number(((wallMs() - state.sessionStartMs) / 60000).toFixed(1));
  }

  function currentBlockIndex(){
    if(!state.questionIndex) return 1;
    return blockIndexForQuestion(state.questionIndex);
  }

  function markerTimeRelativeMs(){
    if(!state.sessionStartMs) return 0;
    return wallMs() - state.sessionStartMs;
  }

  function pushEegMarker(name, extras={}){
    const marker = {
      marker_id: uuid4(),
      code: EEG_EVENT_CODES[name] || 0,
      name,
      session_id: state.sessionId,
      learner: currentPupilName(),
      t_rel_ms: markerTimeRelativeMs(),
      t_wall_ms: wallMs(),
      t_perf_ms: Math.round(nowMs()),
      level: state.currentLevel,
      question_index: state.currentQuestion ? state.currentQuestion.questionIndex : state.questionIndex,
      block_index: currentBlockIndex(),
      research_condition: researchCondition(),
      ...extras
    };
    state.eeg.markers.push(marker);
    return marker;
  }

  function markerTsv(markers){
    const headers = ['marker_id', 'code', 'name', 'session_id', 'learner', 't_rel_ms', 't_wall_ms', 't_perf_ms', 'level', 'question_index', 'block_index', 'research_condition', 'trial_id', 'task_kind', 'task_variant', 'attention_domain', 'response_type', 'correct', 'omission', 'commission', 'artifact_type', 'break_reason'];
    const lines = [headers.join('\t')];
    markers.forEach(marker => {
      lines.push(headers.map(header => {
        const value = marker[header];
        return value == null ? '' : String(value).replace(/\t/g, ' ');
      }).join('\t'));
    });
    return lines.join('\n');
  }

  function getBlockRange(index){
    const size = eegBlockSize();
    const start = ((index - 1) * size) + 1;
    const end = start + size - 1;
    return { start, end };
  }

  function buildBlockSummaries(trials=state.trials, events=state.logs){
    const finalTrials = latestTrialsByQuestion(trials);
    const blocks = new Map();
    finalTrials.forEach(trial => {
      const index = Number(trial.block_index || blockIndexForQuestion(trial.question_index));
      if(!blocks.has(index)){
        blocks.set(index, { block_index: index, trials: [], events: [] });
      }
      blocks.get(index).trials.push(trial);
    });
    events.filter(event => event.type === 'artifact_noted').forEach(event => {
      const index = Number(event.block_index || 1);
      if(!blocks.has(index)){
        blocks.set(index, { block_index: index, trials: [], events: [] });
      }
      blocks.get(index).events.push(event);
    });
    return Array.from(blocks.values()).sort((a, b) => a.block_index - b.block_index).map(block => {
      const artifactCounts = {};
      block.events.forEach(event => {
        artifactCounts[event.artifact_type] = (artifactCounts[event.artifact_type] || 0) + 1;
      });
      const artifactPenalty = Object.keys(artifactCounts).reduce((sum, key) => sum + ((ARTIFACT_TYPES[key] && ARTIFACT_TYPES[key].penalty) || 0) * artifactCounts[key], 0);
      const omissions = block.trials.filter(trial => trial.omission).length;
      const commissions = block.trials.filter(trial => trial.commission).length;
      const interruptions = artifactCounts.interruption || 0;
      const qualityScore = clamp(100 - artifactPenalty - (omissions * 4) - (commissions * 4) - (interruptions * 6), 0, 100);
      const range = getBlockRange(block.block_index);
      return {
        block_index: block.block_index,
        trial_range: `${range.start}-${range.end}`,
        trial_count: block.trials.length,
        accuracy_pct: block.trials.length ? Math.round((block.trials.filter(trial => trial.correct).length / block.trials.length) * 100) : 0,
        omission_count: omissions,
        commission_count: commissions,
        artifact_count: block.events.length,
        artifact_counts: artifactCounts,
        quality_score: qualityScore,
        research_condition: (block.trials[0] && block.trials[0].research_condition) || researchCondition()
      };
    });
  }

  function currentBlockSummary(){
    const summaries = buildBlockSummaries();
    return summaries.find(item => item.block_index === currentBlockIndex()) || {
      block_index: currentBlockIndex(),
      trial_count: 0,
      artifact_count: 0,
      quality_score: 100,
      research_condition: researchCondition()
    };
  }

  function artifactEvents(){
    return state.logs.filter(event => event.type === 'artifact_noted');
  }

  function logArtifact(type){
    const meta = ARTIFACT_TYPES[type];
    if(!meta) return;
    logEvent('artifact_noted', {
      artifact_type: type,
      artifact_label: meta.label,
      block_index: currentBlockIndex(),
      question_index: state.currentQuestion ? state.currentQuestion.questionIndex : state.questionIndex,
      eeg_mode: eegModeEnabled()
    });
    pushEegMarker('artifact', {
      artifact_type: type,
      artifact_label: meta.label
    });
    refreshDashboard(true);
    flash('try', meta.label);
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
      ui.aboutBuildSummary.textContent = `Running ${buildVersionLabel(APP_BUILD)} from ${APP_BUILD.source_file}. This ChoiceTrain for ShowMe build keeps the classroom workflow simple while preserving EEG-ready markers, family-based dashboards, exports, and fidelity tracking in the admin layer.`;
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
      alias: name,
      lastLevel: 1,
      sessions: [],
      baseline: { ...SESSION_CONTEXT_DEFAULTS },
      contentFilters: normalizeContentFilters(),
      reviews: []
    };
  }

  function normalizeLearner(name, learner={}){
    const baseline = { ...(learner.baseline || {}) };
    if(!baseline.contextNotes && baseline.medicationContext) baseline.contextNotes = baseline.medicationContext;
    if(baseline.themeChoice) baseline.themeChoice = normalizeThemeChoice(baseline.themeChoice);
    return {
      name: learner.name || name,
      alias: learner.alias || learner.name || name,
      lastLevel: clamp(safeNumber(learner.lastLevel, 1), 1, 10),
      sessions: Array.isArray(learner.sessions) ? learner.sessions : [],
      baseline: { ...SESSION_CONTEXT_DEFAULTS, ...baseline },
      contentFilters: normalizeContentFilters(learner.contentFilters || {}),
      reviews: Array.isArray(learner.reviews) ? learner.reviews : []
    };
  }

  function getLearners(){
    const current = readJson(LEARNERS_KEY);
    if(current && typeof current === 'object') return current;
    const legacy = LEGACY_LEARNERS_KEYS.map(readJson).find(value => value && typeof value === 'object');
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
      useBlankInterval: ui.useBlankInterval.checked,
      blankIntervalSec: ui.blankIntervalSec.value,
      eegResearchMode: ui.eegResearchMode.checked,
      autoBlockPauses: ui.autoBlockPauses.checked,
      allowLearnerHelp: ui.allowLearnerHelp.checked,
      allowLearnerBreak: ui.allowLearnerBreak.checked,
      allowLearnerStop: ui.allowLearnerStop.checked,
      activeControlEnabled: ui.activeControlEnabled.checked,
      eegBlockSize: ui.eegBlockSize.value,
      eegAutoPauseSec: ui.eegAutoPauseSec.value,
      researchCondition: ui.researchCondition.value,
      eegExportFormat: ui.eegExportFormat.value,
      studentFriendlyMode: studentFriendlyModeEnabled(),
      faceName: ui.faceName.value,
      contextNotes: currentContextNotes(),
      rewardChoice: ui.rewardChoice.value,
      themeChoice: ui.themeChoice.value,
      fontChoice: currentFontChoice(),
      textScale: currentTextScale(),
      motionPreference: currentMotionPreference(),
      feedbackSoundMode: currentFeedbackSoundMode(),
      celebrationIntensity: currentCelebrationIntensity(),
      communicationSupportChoice: ui.communicationSupportChoice.value,
      preSessionPreference: ui.preSessionPreference.value,
      aacPreference: ui.aacPreference.value,
      sleepQuality: ui.sleepQuality.value,
      capTolerance: ui.capTolerance.value,
      dosageMinutesTarget: ui.dosageMinutesTarget.value,
      dosageSessionsPerWeek: ui.dosageSessionsPerWeek.value,
      fidelityEnvironmentReady: ui.fidelityEnvironmentReady.checked,
      fidelityRuleShown: ui.fidelityRuleShown.checked,
      fidelityPromptPlan: ui.fidelityPromptPlan.checked,
      fidelityBreaksOffered: ui.fidelityBreaksOffered.checked,
      fidelityRewardDelivered: ui.fidelityRewardDelivered.checked,
      fidelityDataChecked: ui.fidelityDataChecked.checked,
      coachingReviewNotes: ui.coachingReviewNotes.value,
      schemaVersion: DATA_SCHEMA_VERSION,
      customCategories: state.customCategories.slice(),
      contentFilters: contentFiltersFromUi(),
      viewMode: state.viewMode
    };
  }

  function loadSettings(){
    const settings = readJson(SETTINGS_KEY) || LEGACY_SETTINGS_KEYS.map(readJson).find(Boolean);
    if(!settings) return;
    state.customCategories = normalizeCustomCategories(settings.customCategories);
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
    if(ui.useBlankInterval) ui.useBlankInterval.checked = !!settings.useBlankInterval;
    if(ui.blankIntervalSec) ui.blankIntervalSec.value = settings.blankIntervalSec || 1;
    if(ui.eegResearchMode) ui.eegResearchMode.checked = !!settings.eegResearchMode;
    if(ui.autoBlockPauses) ui.autoBlockPauses.checked = settings.autoBlockPauses !== false;
    if(ui.allowLearnerHelp) ui.allowLearnerHelp.checked = settings.allowLearnerHelp !== false;
    if(ui.allowLearnerBreak) ui.allowLearnerBreak.checked = settings.allowLearnerBreak !== false;
    if(ui.allowLearnerStop) ui.allowLearnerStop.checked = settings.allowLearnerStop !== false;
    if(ui.activeControlEnabled) ui.activeControlEnabled.checked = !!settings.activeControlEnabled;
    if(ui.eegBlockSize) ui.eegBlockSize.value = settings.eegBlockSize || 4;
    if(ui.eegAutoPauseSec) ui.eegAutoPauseSec.value = settings.eegAutoPauseSec || 6;
    if(ui.researchCondition) ui.researchCondition.value = settings.researchCondition || 'training';
    if(ui.eegExportFormat) ui.eegExportFormat.value = settings.eegExportFormat || 'tsv';
    if(ui.studentFriendlyMode) ui.studentFriendlyMode.checked = settings.studentFriendlyMode !== false;
    if(ui.faceName) ui.faceName.value = settings.faceName || 'Mum';
    if(ui.contextNotes) ui.contextNotes.value = settings.contextNotes || settings.notes || settings.medicationContext || '';
    if(ui.rewardChoice) ui.rewardChoice.value = settings.rewardChoice || SESSION_CONTEXT_DEFAULTS.rewardChoice;
    if(ui.themeChoice) ui.themeChoice.value = normalizeThemeChoice(settings.themeChoice || SESSION_CONTEXT_DEFAULTS.themeChoice);
    if(ui.fontChoice) ui.fontChoice.value = settings.fontChoice || SESSION_CONTEXT_DEFAULTS.fontChoice;
    if(ui.textScale) ui.textScale.value = String(settings.textScale || SESSION_CONTEXT_DEFAULTS.textScale);
    if(ui.motionPreference) ui.motionPreference.value = settings.motionPreference || SESSION_CONTEXT_DEFAULTS.motionPreference;
    if(ui.feedbackSoundMode) ui.feedbackSoundMode.value = settings.feedbackSoundMode || SESSION_CONTEXT_DEFAULTS.feedbackSoundMode;
    if(ui.celebrationIntensity) ui.celebrationIntensity.value = settings.celebrationIntensity || SESSION_CONTEXT_DEFAULTS.celebrationIntensity;
    if(ui.communicationSupportChoice) ui.communicationSupportChoice.value = settings.communicationSupportChoice || SESSION_CONTEXT_DEFAULTS.communicationSupportChoice;
    if(ui.preSessionPreference) ui.preSessionPreference.value = settings.preSessionPreference || SESSION_CONTEXT_DEFAULTS.preSessionPreference;
    if(ui.aacPreference) ui.aacPreference.value = settings.aacPreference || SESSION_CONTEXT_DEFAULTS.aacPreference;
    if(ui.sleepQuality) ui.sleepQuality.value = settings.sleepQuality || SESSION_CONTEXT_DEFAULTS.sleepQuality;
    if(ui.capTolerance) ui.capTolerance.value = settings.capTolerance || SESSION_CONTEXT_DEFAULTS.capTolerance;
    if(ui.dosageMinutesTarget) ui.dosageMinutesTarget.value = settings.dosageMinutesTarget || 10;
    if(ui.dosageSessionsPerWeek) ui.dosageSessionsPerWeek.value = settings.dosageSessionsPerWeek || 3;
    if(ui.fidelityEnvironmentReady) ui.fidelityEnvironmentReady.checked = !!settings.fidelityEnvironmentReady;
    if(ui.fidelityRuleShown) ui.fidelityRuleShown.checked = !!settings.fidelityRuleShown;
    if(ui.fidelityPromptPlan) ui.fidelityPromptPlan.checked = !!settings.fidelityPromptPlan;
    if(ui.fidelityBreaksOffered) ui.fidelityBreaksOffered.checked = !!settings.fidelityBreaksOffered;
    if(ui.fidelityRewardDelivered) ui.fidelityRewardDelivered.checked = !!settings.fidelityRewardDelivered;
    if(ui.fidelityDataChecked) ui.fidelityDataChecked.checked = !!settings.fidelityDataChecked;
    if(ui.coachingReviewNotes) ui.coachingReviewNotes.value = settings.coachingReviewNotes || '';
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
    if(!img.naturalWidth || !img.naturalHeight) throw new Error('Image has no usable dimensions');
    if(img.naturalWidth * img.naturalHeight > MAX_DECODED_IMAGE_PIXELS) throw new Error('Decoded image is too large');
    const ratio = Math.min(1, maxEdge / Math.max(img.naturalWidth, img.naturalHeight));
    const width = Math.max(1, Math.round(img.naturalWidth * ratio));
    const height = Math.max(1, Math.round(img.naturalHeight * ratio));
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0, width, height);
    const outputType = options.outputType === 'image/png' ? 'image/png' : 'image/jpeg';
    return canvas.toDataURL(outputType, outputType === 'image/png' ? undefined : quality);
  }

  function imageOutputType(fileOrDataUrl){
    const value = typeof fileOrDataUrl === 'string' ? fileOrDataUrl : (fileOrDataUrl && fileOrDataUrl.type) || '';
    return /image\/(png|svg\+xml|gif)/i.test(value) ? 'image/png' : 'image/jpeg';
  }

  function validateImageFile(file){
    if(!file) throw new Error('No image file selected');
    const supported = /^image\/(jpeg|png|webp|gif|svg\+xml)$/i.test(file.type || '');
    if(!supported) throw new Error('Unsupported image type');
    if(file.size > MAX_IMAGE_FILE_BYTES) throw new Error('Image file is larger than 12 MB');
  }

  function rotatedCanvasForImage(img, rotation){
    const angle = [0, 90, 180, 270].includes(rotation) ? rotation : 0;
    const swap = angle === 90 || angle === 270;
    const canvas = document.createElement('canvas');
    canvas.width = swap ? img.naturalHeight : img.naturalWidth;
    canvas.height = swap ? img.naturalWidth : img.naturalHeight;
    const ctx = canvas.getContext('2d');
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate(angle * Math.PI / 180);
    ctx.drawImage(img, -img.naturalWidth / 2, -img.naturalHeight / 2);
    return canvas;
  }

  async function renderPhotoFromOriginal(originalSrc, editValue, outputType){
    const edit = normalizePhotoEdit(editValue);
    const img = await loadImageFromUrl(originalSrc);
    const rotated = rotatedCanvasForImage(img, edit.rotation);
    const cropSide = edit.squareCrop ? Math.min(rotated.width, rotated.height) / edit.zoom : null;
    const sourceX = cropSide == null ? 0 : clamp(edit.focusX * rotated.width - cropSide / 2, 0, rotated.width - cropSide);
    const sourceY = cropSide == null ? 0 : clamp(edit.focusY * rotated.height - cropSide / 2, 0, rotated.height - cropSide);
    const sourceWidth = cropSide == null ? rotated.width : cropSide;
    const sourceHeight = cropSide == null ? rotated.height : cropSide;
    const ratio = Math.min(1, DISPLAY_IMAGE_MAX_EDGE / Math.max(sourceWidth, sourceHeight));
    const canvas = document.createElement('canvas');
    canvas.width = Math.max(1, Math.round(sourceWidth * ratio));
    canvas.height = edit.squareCrop ? canvas.width : Math.max(1, Math.round(sourceHeight * ratio));
    const ctx = canvas.getContext('2d');
    ctx.drawImage(rotated, sourceX, sourceY, sourceWidth, sourceHeight, 0, 0, canvas.width, canvas.height);
    const type = outputType === 'image/png' ? 'image/png' : 'image/jpeg';
    return canvas.toDataURL(type, type === 'image/png' ? undefined : 0.84);
  }

  async function preparePhotoFile(file){
    validateImageFile(file);
    const dataUrl = await readFileAsDataUrl(file);
    const outputType = imageOutputType(file);
    const originalSrc = await compressImageDataUrl(dataUrl, {
      maxEdge: PREPARED_ORIGINAL_MAX_EDGE,
      quality: 0.88,
      outputType
    });
    const edit = normalizePhotoEdit();
    const src = await renderPhotoFromOriginal(originalSrc, edit, outputType);
    const decoded = await loadImageFromUrl(originalSrc);
    return {
      originalSrc,
      src,
      edit,
      originalMimeType: outputType,
      originalFileName: file.name || '',
      originalWidth: decoded.naturalWidth,
      originalHeight: decoded.naturalHeight,
      originalFileBytes: file.size || 0
    };
  }

  async function hydrateAssets(){
    const face = await idbGet(IDB_ASSETS_STORE, FAMILIAR_FACE_ASSET_KEY);
    const custom = await idbGet(IDB_ASSETS_STORE, CUSTOM_IMAGES_ASSET_KEY);
    if(face && face.value) state.familiarFace = face.value;
    if(custom && Array.isArray(custom.value)){
      state.storage.assetMigrationNeeded = custom.value.some(item =>
        safeNumber(item && item.schemaVersion, 0) < PHOTO_SCHEMA_VERSION
        || !item.originalSrc
        || !item.source
        || !Array.isArray(item.categoryIds)
        || !item.edit
      );
      state.customImages = custom.value.map(normalizePhotoItem);
    }
  }

  async function migrateLocalDataSchema(){
    if(!state.storage.useIndexedDb) return false;
    const key = 'schema:choice-train-data';
    const marker = await idbGet(IDB_META_STORE, key);
    if(marker && safeNumber(marker.version, 0) >= DATA_SCHEMA_VERSION && !state.storage.assetMigrationNeeded) return true;
    const assetsSaved = await persistAssets();
    if(!assetsSaved) return false;
    await idbPut(IDB_META_STORE, {
      key,
      version: DATA_SCHEMA_VERSION,
      photo_schema_version: PHOTO_SCHEMA_VERSION,
      migrated_at_wall_ms: wallMs()
    });
    state.storage.assetMigrationNeeded = false;
    return true;
  }

  async function persistAssets(){
    try {
      const db = await openDb();
      if(!db) return false;
      const faceSaved = await idbPut(IDB_ASSETS_STORE, { key: FAMILIAR_FACE_ASSET_KEY, value: state.familiarFace || null, updated_at_wall_ms: wallMs() });
      const imagesSaved = await idbPut(IDB_ASSETS_STORE, { key: CUSTOM_IMAGES_ASSET_KEY, value: state.customImages || [], updated_at_wall_ms: wallMs() });
      return !!(faceSaved && imagesSaved);
    } catch(_err){
      return false;
    }
  }

  function normalizePhotoItem(item={}){
    const legacyCategory = item.category || item.objectCategory || 'custom';
    const category = canonicalCategoryId(legacyCategory);
    const meta = categoryMeta(category);
    const learner = item.learner || item.pupilOwner || currentPupilName();
    const originalSrc = item.originalSrc || item.src || '';
    return {
      id: item.id || `photo-${uuid4()}`,
      learner,
      pupilOwner: item.pupilOwner || learner,
      label: item.label || 'Personalised photo',
      src: item.src || '',
      originalSrc,
      category,
      originalCategory: item.originalCategory || legacyCategory,
      categoryIds: categoryMemberships(category),
      source: normalizeImageSource(item.source || 'personalised'),
      relationshipType: item.relationshipType || '',
      useInQuestions: item.useInQuestions !== false,
      objectCategory: meta.objectCategory,
      edit: normalizePhotoEdit(item.edit),
      originalMimeType: item.originalMimeType || imageOutputType(originalSrc),
      originalFileName: item.originalFileName || '',
      originalWidth: safeNumber(item.originalWidth, 0),
      originalHeight: safeNumber(item.originalHeight, 0),
      originalFileBytes: safeNumber(item.originalFileBytes, 0),
      addedAt: item.addedAt || wallMs(),
      updatedAt: item.updatedAt || item.addedAt || wallMs(),
      schemaVersion: PHOTO_SCHEMA_VERSION
    };
  }

  function currentPupilPhotos(){
    return (state.customImages || []).filter(item => item.learner === currentPupilName());
  }

  function currentPupilQuestionPhotos(){
    return currentPupilPhotos().filter(item => item.useInQuestions);
  }

  function primaryFamiliarPhoto(){
    const photos = currentPupilPhotos();
    return photos.find(item => item.relationshipType && /mum|mom|mother|dad|father|teacher|carer|parent/i.test(item.relationshipType))
      || photos.find(item => optionMatchesCategory(item, 'family') || optionMatchesCategory(item, 'people'))
      || null;
  }

  function populateCategorySelect(select, selectedValue){
    if(!select) return;
    const wanted = canonicalCategoryId(selectedValue || select.value || 'people');
    clearNode(select);
    availableCategories().forEach(category => {
      const option = document.createElement('option');
      option.value = category.id;
      option.textContent = category.label;
      option.selected = category.id === wanted;
      select.appendChild(option);
    });
    if(Array.from(select.options).some(option => option.value === wanted)) select.value = wanted;
  }

  function renderCategoryChecklist(container, selectedIds, inputName){
    if(!container) return;
    clearNode(container);
    const selected = new Set(normalizeCategorySelection(selectedIds, []));
    availableCategories().forEach(category => {
      const label = document.createElement('label');
      label.className = 'categoryCheck';
      const input = document.createElement('input');
      input.type = 'checkbox';
      input.name = inputName;
      input.dataset.categoryId = category.id;
      input.checked = selected.has(category.id);
      input.addEventListener('change', () => {
        if(state.currentPupil) state.currentPupil.contentFilters = contentFiltersFromUi();
        saveSettingsSoon();
        saveCurrentLearnerProfile();
        refreshContentConfiguration();
      });
      const text = document.createElement('span');
      text.textContent = category.label;
      label.append(input, text);
      container.appendChild(label);
    });
  }

  function renderCategoryControls(filterValue){
    const filters = normalizeContentFilters(filterValue || contentFiltersFromUi());
    const selectedPhotoCategory = ui.photoCategory ? ui.photoCategory.value : 'people';
    const selectedBulkCategory = ui.bulkPhotoCategory ? ui.bulkPhotoCategory.value : selectedPhotoCategory;
    const selectedMoveCategory = ui.bulkMoveCategory ? ui.bulkMoveCategory.value : selectedPhotoCategory;
    populateCategorySelect(ui.photoCategory, selectedPhotoCategory);
    populateCategorySelect(ui.bulkPhotoCategory, selectedBulkCategory);
    populateCategorySelect(ui.bulkMoveCategory, selectedMoveCategory);
    renderCategoryChecklist(ui.findObjectCategoryList, filters.findObjectCategories, 'find-object-category');
    renderCategoryChecklist(ui.findCategoryCategoryList, filters.findCategoryCategories, 'find-category-category');
    if(ui.findObjectSourceMode) ui.findObjectSourceMode.value = filters.findObjectSource;
    if(ui.findCategorySourceMode) ui.findCategorySourceMode.value = filters.findCategorySource;
    if(ui.categoryCatalogueSummary){
      const builtInCount = Object.keys(PHOTO_CATEGORY_META).length;
      ui.categoryCatalogueSummary.textContent = `${builtInCount} built-in categories and ${state.customCategories.length} teacher-created categories are available.`;
    }
    refreshContentConfiguration();
  }

  function createCustomCategory(){
    const label = normalizeCategoryLabel(ui.createCategoryName && ui.createCategoryName.value);
    const status = ui.categoryCreateStatus;
    if(!label){
      if(status) status.textContent = 'Enter a category name first.';
      return;
    }
    const duplicate = availableCategories().some(category => category.label.toLowerCase() === label.toLowerCase());
    if(duplicate){
      if(status) status.textContent = 'That category already exists.';
      return;
    }
    const id = `custom-${categorySlug(label)}`;
    if(!categorySlug(label) || availableCategories().some(category => category.id === id)){
      if(status) status.textContent = 'Choose a more distinctive category name.';
      return;
    }
    state.customCategories = state.customCategories.concat({ id, label, createdAt: wallMs() });
    if(ui.createCategoryName) ui.createCategoryName.value = '';
    if(status) status.textContent = `${label} is ready to use.`;
    renderCategoryControls({
      ...contentFiltersFromUi(),
      findObjectCategories: contentFiltersFromUi().findObjectCategories.concat(id),
      findCategoryCategories: contentFiltersFromUi().findCategoryCategories.concat(id)
    });
    saveSettingsSoon();
    saveCurrentLearnerProfile();
  }

  function createPhotoField(labelText, control){
    const wrapper = document.createElement('label');
    wrapper.textContent = labelText;
    wrapper.appendChild(control);
    return wrapper;
  }

  function renderPhotoLibrary(){
    if(!ui.photoLibraryList || !ui.photoLibraryEmpty) return;
    clearNode(ui.photoLibraryList);
    const items = currentPupilPhotos().sort((a, b) => Number(b.addedAt || 0) - Number(a.addedAt || 0));
    const currentIds = new Set(items.map(item => item.id));
    state.selectedPhotoIds = new Set(Array.from(state.selectedPhotoIds).filter(id => currentIds.has(id)));
    ui.photoLibraryEmpty.style.display = items.length ? 'none' : 'block';
    items.forEach(item => {
      const card = document.createElement('div');
      card.className = 'photoCard';
      card.dataset.photoId = item.id;
      const thumb = document.createElement('div');
      thumb.className = 'photoThumb';
      const selected = document.createElement('input');
      selected.type = 'checkbox';
      selected.className = 'photoSelect';
      selected.checked = state.selectedPhotoIds.has(item.id);
      selected.setAttribute('aria-label', `Select ${item.label}`);
      selected.addEventListener('change', () => {
        if(selected.checked) state.selectedPhotoIds.add(item.id);
        else state.selectedPhotoIds.delete(item.id);
      });
      thumb.appendChild(selected);
      if(item.src){
        const img = document.createElement('img');
        img.src = item.src;
        img.alt = item.label;
        thumb.appendChild(img);
      } else {
        thumb.textContent = '\u{1F5BC}';
      }
      const source = document.createElement('span');
      source.className = `sourceBadge ${normalizeImageSource(item.source)}`;
      source.textContent = sourceLabel(item.source);
      const title = document.createElement('div');
      title.className = 'photoMetaTitle';
      title.textContent = item.label;
      const editorGrid = document.createElement('div');
      editorGrid.className = 'photoEditorGrid';
      const labelInput = document.createElement('input');
      labelInput.type = 'text';
      labelInput.value = item.label;
      labelInput.maxLength = 80;
      const categorySelect = document.createElement('select');
      populateCategorySelect(categorySelect, item.category);
      const sourceSelect = document.createElement('select');
      [['personalised', 'Personalised'], ['stock', 'Stock']].forEach(([value, label]) => {
        const option = document.createElement('option');
        option.value = value;
        option.textContent = label;
        sourceSelect.appendChild(option);
      });
      sourceSelect.value = normalizeImageSource(item.source);
      const useLabel = document.createElement('label');
      useLabel.className = 'toggle';
      const useInput = document.createElement('input');
      useInput.type = 'checkbox';
      useInput.checked = item.useInQuestions !== false;
      useLabel.append(useInput, document.createTextNode(' Use in questions'));
      editorGrid.append(
        createPhotoField('Label', labelInput),
        createPhotoField('Category', categorySelect),
        createPhotoField('Source', sourceSelect),
        useLabel
      );
      const meta = document.createElement('div');
      meta.className = 'photoMetaTiny';
      meta.textContent = `${categoryMeta(item.category).label}${item.relationshipType ? ` | ${item.relationshipType}` : ''} | ${item.originalWidth || '?'} x ${item.originalHeight || '?'} prepared pixels`;
      const actions = document.createElement('div');
      actions.className = 'photoActions';
      const saveBtn = document.createElement('button');
      saveBtn.type = 'button';
      saveBtn.textContent = 'Save details';
      saveBtn.addEventListener('click', async () => {
        const nextLabel = normalizeCategoryLabel(labelInput.value);
        if(!nextLabel){
          flash('try', 'Add a photo label');
          return;
        }
        item.label = nextLabel;
        item.category = canonicalCategoryId(categorySelect.value);
        item.objectCategory = item.category;
        item.categoryIds = categoryMemberships(item.category);
        item.source = normalizeImageSource(sourceSelect.value);
        item.useInQuestions = useInput.checked;
        item.updatedAt = wallMs();
        const saved = await persistAssets();
        renderPhotoLibrary();
        refreshContentConfiguration();
        flash(saved ? 'good' : 'try', saved ? 'Photo details saved' : 'Updated for now; local storage write failed');
      });
      const editBtn = document.createElement('button');
      editBtn.type = 'button';
      editBtn.textContent = 'Crop / rotate';
      editBtn.addEventListener('click', () => openImageEditor(item.id));
      const removeBtn = document.createElement('button');
      removeBtn.type = 'button';
      removeBtn.textContent = 'Remove';
      removeBtn.addEventListener('click', async () => {
        state.customImages = state.customImages.filter(photo => photo.id !== item.id);
        state.selectedPhotoIds.delete(item.id);
        const saved = await persistAssets();
        renderPhotoLibrary();
        refreshContentConfiguration();
        refreshDashboard(true);
        flash(saved ? 'good' : 'try', saved ? 'Photo removed' : 'Removed for now; local storage write failed');
      });
      actions.append(saveBtn, editBtn, removeBtn);
      card.append(thumb, source, title, editorGrid, meta, actions);
      ui.photoLibraryList.appendChild(card);
    });
  }

  function clearPhotoForm(){
    if(ui.photoLabel) ui.photoLabel.value = '';
    if(ui.photoType) ui.photoType.value = '';
    if(ui.photoUpload) ui.photoUpload.value = '';
    if(ui.photoCategory) ui.photoCategory.value = 'people';
    if(ui.photoUseInQuestions) ui.photoUseInQuestions.checked = true;
  }

  async function loadAndStoreFamiliarFace(file){
    try {
      const prepared = await preparePhotoFile(file);
      state.familiarFace = prepared.src;
      const label = (ui.faceName && ui.faceName.value.trim()) || 'Mum';
      const quickPhoto = normalizePhotoItem({
        id: `quick-face-${safeFilenamePart(currentPupilName())}`,
        learner: currentPupilName(),
        label,
        ...prepared,
        category: 'family',
        source: 'personalised',
        relationshipType: label,
        useInQuestions: true
      });
      state.customImages = state.customImages.filter(item => item.id !== quickPhoto.id).concat(quickPhoto);
      const saved = await persistAssets();
      flash(saved ? 'good' : 'try', saved ? 'Primary photo added' : 'Photo added for now; local storage write failed');
      saveSettingsSoon();
      renderPhotoLibrary();
      refreshContentConfiguration();
      refreshDashboard(true);
    } catch(err){
      flash('try', err && err.message ? err.message : 'Image failed');
    }
  }

  async function importPhotoFiles(files, options={}){
    const allFiles = Array.from(files || []);
    const list = allFiles.slice(0, MAX_IMPORT_FILES);
    const owner = options.owner || currentPupilName();
    const category = canonicalCategoryId(options.category || 'people');
    const useInQuestions = options.useInQuestions !== false;
    const imported = [];
    const failures = [];
    if(!list.length) return { imported, failures, saved: true, ignored: 0 };
    for(let i = 0; i < list.length; i++){
      const file = list[i];
      if(ui.bulkUploadStatus) ui.bulkUploadStatus.textContent = `Preparing ${i + 1} of ${list.length}: ${file.name}`;
      try {
        const prepared = await preparePhotoFile(file);
        imported.push(normalizePhotoItem({
          id: `photo-${uuid4()}`,
          learner: owner,
          pupilOwner: owner,
          label: normalizeCategoryLabel(file.name.replace(/\.[^.]+$/, '')) || `Photo ${i + 1}`,
          ...prepared,
          category,
          source: 'personalised',
          relationshipType: '',
          useInQuestions
        }));
      } catch(err){
        failures.push({ name: file.name || `File ${i + 1}`, reason: err && err.message ? err.message : 'Could not prepare image' });
      }
      if(i % 5 === 4) await new Promise(resolve => window.setTimeout(resolve, 0));
    }
    if(imported.length) state.customImages = state.customImages.concat(imported);
    const saved = imported.length ? await persistAssets() : true;
    return { imported, failures, saved, ignored: Math.max(0, allFiles.length - list.length) };
  }

  function importOutcomeText(result){
    const lines = [`${result.imported.length} imported, ${result.failures.length} failed${result.ignored ? `, ${result.ignored} over the 100-file limit ignored` : ''}.`];
    result.failures.slice(0, 8).forEach(item => lines.push(`${item.name}: ${item.reason}`));
    if(result.failures.length > 8) lines.push(`${result.failures.length - 8} more failures not shown.`);
    if(!result.saved) lines.push('The photos are available for this page only because IndexedDB could not save them.');
    return lines.join('\n');
  }

  async function loadAndStoreCustomImages(files){
    const owner = currentPupilName();
    const category = ui.bulkPhotoCategory ? ui.bulkPhotoCategory.value : 'people';
    const result = await importPhotoFiles(files, { owner, category, useInQuestions: true });
    if(ui.bulkUploadStatus) ui.bulkUploadStatus.textContent = importOutcomeText(result);
    renderPhotoLibrary();
    refreshContentConfiguration();
    refreshDashboard(true);
    flash(result.imported.length && result.saved ? 'good' : 'try', result.imported.length ? `${result.imported.length} photos imported` : 'No photos imported');
  }

  async function addPhotoToLibrary(){
    const file = ui.photoUpload && ui.photoUpload.files ? ui.photoUpload.files[0] : null;
    if(!file){
      flash('try', 'Choose a photo first');
      return;
    }
    try {
      const owner = currentPupilName();
      const category = ui.photoCategory ? ui.photoCategory.value : 'people';
      const prepared = await preparePhotoFile(file);
      const item = normalizePhotoItem({
        learner: owner,
        pupilOwner: owner,
        label: (ui.photoLabel && ui.photoLabel.value.trim()) || file.name.replace(/\.[^.]+$/, ''),
        ...prepared,
        category,
        source: 'personalised',
        relationshipType: ui.photoType ? ui.photoType.value.trim() : '',
        useInQuestions: !!(ui.photoUseInQuestions && ui.photoUseInQuestions.checked)
      });
      state.customImages = state.customImages.concat(item);
      const saved = await persistAssets();
      clearPhotoForm();
      renderPhotoLibrary();
      refreshContentConfiguration();
      refreshDashboard(true);
      flash(saved ? 'good' : 'try', saved ? 'Photo added' : 'Photo added for now; local storage write failed');
    } catch(err){
      flash('try', err && err.message ? err.message : 'Photo failed');
    }
  }

  async function moveSelectedPhotos(){
    const ids = new Set(state.selectedPhotoIds);
    if(!ids.size){
      flash('try', 'Select at least one photo');
      return;
    }
    const category = canonicalCategoryId(ui.bulkMoveCategory && ui.bulkMoveCategory.value);
    state.customImages.forEach(item => {
      if(!ids.has(item.id) || item.learner !== currentPupilName()) return;
      item.category = category;
      item.objectCategory = category;
      item.categoryIds = categoryMemberships(category);
      item.updatedAt = wallMs();
    });
    const saved = await persistAssets();
    renderPhotoLibrary();
    refreshContentConfiguration();
    flash(saved ? 'good' : 'try', saved ? `${ids.size} photos moved` : 'Moved for now; local storage write failed');
  }

  function updateImageEditorControls(editValue){
    const edit = normalizePhotoEdit(editValue);
    ui.imageEditorSquare.checked = edit.squareCrop;
    ui.imageEditorZoom.value = edit.zoom;
    ui.imageEditorFocusX.value = edit.focusX;
    ui.imageEditorFocusY.value = edit.focusY;
    ui.imageEditorRotation.value = edit.rotation;
  }

  function imageEditorValue(){
    return normalizePhotoEdit({
      squareCrop: ui.imageEditorSquare.checked,
      zoom: ui.imageEditorZoom.value,
      focusX: ui.imageEditorFocusX.value,
      focusY: ui.imageEditorFocusY.value,
      rotation: ui.imageEditorRotation.value
    });
  }

  async function updateImageEditorPreview(){
    const editor = state.imageEditor;
    if(!editor || !ui.imageEditorPreview) return;
    const token = uuid4();
    editor.previewToken = token;
    try {
      const preview = await renderPhotoFromOriginal(editor.originalSrc, imageEditorValue(), editor.outputType);
      if(state.imageEditor && state.imageEditor.previewToken === token) ui.imageEditorPreview.src = preview;
    } catch(_err){
      if(ui.imageEditorStatus) ui.imageEditorStatus.textContent = 'Preview could not be generated.';
    }
  }

  function closeImageEditor(){
    state.imageEditor = null;
    if(ui.imageEditor) ui.imageEditor.hidden = true;
    if(ui.imageEditorStatus) ui.imageEditorStatus.textContent = '';
  }

  function openImageEditor(photoId){
    const item = state.customImages.find(photo => photo.id === photoId && photo.learner === currentPupilName());
    if(!item) return;
    state.imageEditor = {
      photoId,
      originalSrc: item.originalSrc || item.src,
      outputType: item.originalMimeType || imageOutputType(item.originalSrc || item.src),
      previewToken: ''
    };
    updateImageEditorControls(item.edit);
    ui.imageEditor.hidden = false;
    updateImageEditorPreview();
  }

  async function applyImageEditor(){
    const editor = state.imageEditor;
    if(!editor) return;
    const item = state.customImages.find(photo => photo.id === editor.photoId);
    if(!item) return closeImageEditor();
    if(ui.imageEditorStatus) ui.imageEditorStatus.textContent = 'Preparing photo...';
    try {
      const edit = imageEditorValue();
      item.src = await renderPhotoFromOriginal(editor.originalSrc, edit, editor.outputType);
      item.originalSrc = editor.originalSrc;
      item.edit = edit;
      item.updatedAt = wallMs();
      const saved = await persistAssets();
      closeImageEditor();
      renderPhotoLibrary();
      refreshContentConfiguration();
      flash(saved ? 'good' : 'try', saved ? 'Photo framing saved' : 'Framing applied for now; local storage write failed');
    } catch(err){
      if(ui.imageEditorStatus) ui.imageEditorStatus.textContent = err && err.message ? err.message : 'Photo edit failed.';
    }
  }

  function objectPool(){
    const base = [
      { id: 'family-mum', label: 'Mum', emoji: '👩', category: 'family' },
      { id: 'family-dad', label: 'Dad', emoji: '👨', category: 'family' },
      { id: 'people-teacher', label: 'Teacher', emoji: '🧑‍🏫', category: 'people' },
      { id: 'people-friend', label: 'Friend', emoji: '🧒', category: 'people' },
      { id: 'fruit-apple', label: 'Apple', emoji: '🍎', category: 'fruit' },
      { id: 'fruit-banana', label: 'Banana', emoji: '🍌', category: 'fruit' },
      { id: 'fruit-orange', label: 'Orange', emoji: '🍊', category: 'fruit' },
      { id: 'food-bread', label: 'Bread', emoji: '🍞', category: 'food' },
      { id: 'food-pizza', label: 'Pizza', emoji: '🍕', category: 'food' },
      { id: 'animal-cat', label: 'Cat', emoji: '🐱', category: 'animals' },
      { id: 'animal-dog', label: 'Dog', emoji: '🐶', category: 'animals' },
      { id: 'animal-fish', label: 'Fish', emoji: '🐟', category: 'animals' },
      { id: 'transport-bus', label: 'Bus', emoji: '🚌', category: 'transport' },
      { id: 'transport-car', label: 'Car', emoji: '🚗', category: 'transport' },
      { id: 'transport-train', label: 'Train', emoji: '🚆', category: 'transport' },
      { id: 'shape-star', label: 'Star', symbol: SHAPE_SYMBOLS.star, color: 'amber', category: 'symbols-shapes' },
      { id: 'shape-circle', label: 'Circle', symbol: SHAPE_SYMBOLS.circle, color: 'blue', category: 'symbols-shapes' },
      { id: 'shape-square', label: 'Square', symbol: SHAPE_SYMBOLS.square, color: 'green', category: 'symbols-shapes' }
    ];
    const stock = base.map(item => ({
      ...item,
      source: 'stock',
      categoryIds: categoryMemberships(item.category)
    }));
    return stock.concat(currentPupilQuestionPhotos().map(item => ({
      id: item.id,
      label: item.label,
      src: item.src,
      category: canonicalCategoryId(item.category || item.objectCategory || 'custom'),
      categoryIds: optionCategoryMemberships(item),
      source: normalizeImageSource(item.source),
      relationshipType: item.relationshipType || '',
      personalised_photo: true
    })));
  }

  function normalizedConceptLabel(value){
    return normalizeCategoryLabel(value).toLowerCase();
  }

  function sourceModeMatches(option, sourceMode){
    const mode = normalizeSourceMode(sourceMode);
    return mode === 'both' || normalizeImageSource(option.source) === mode;
  }

  function uniqueOptions(items, requireUniqueLabels=false){
    const ids = new Set();
    const labels = new Set();
    return (items || []).filter(item => {
      if(!item || !item.id || ids.has(item.id)) return false;
      const label = normalizedConceptLabel(item.label);
      if(requireUniqueLabels && (!label || labels.has(label))) return false;
      ids.add(item.id);
      if(label) labels.add(label);
      return true;
    });
  }

  function eligibleContentPool(categories, sourceMode, pool=objectPool()){
    const selected = new Set(normalizeCategorySelection(categories, []));
    return uniqueOptions(pool.filter(item =>
      sourceModeMatches(item, sourceMode)
      && optionCategoryMemberships(item).some(category => selected.has(category))
    ));
  }

  function fairPromptCategories(categories, pool){
    const selected = normalizeCategorySelection(categories, []);
    return selected.filter(category => {
      const targets = pool.filter(item => optionMatchesCategory(item, category));
      const distractors = pool.filter(item => !optionMatchesCategory(item, category));
      return targets.length > 0 && distractors.length > 0;
    });
  }

  function contentOptionMetadata(item){
    return {
      id: item.id,
      label: item.label,
      category: canonicalCategoryId(item.category),
      category_ids: optionCategoryMemberships(item),
      source: normalizeImageSource(item.source),
      personalised_photo: !!item.personalised_photo
    };
  }

  function buildContentConfigurationSnapshot(){
    const filters = contentFiltersFromUi();
    const fullPool = objectPool();
    const findObjectItems = eligibleContentPool(filters.findObjectCategories, filters.findObjectSource, fullPool);
    const findCategoryItems = eligibleContentPool(filters.findCategoryCategories, filters.findCategorySource, fullPool);
    const findCategoryFair = fairPromptCategories(filters.findCategoryCategories, findCategoryItems);
    const categoryLabels = ids => ids.map(id => ({ id, label: categoryMeta(id).label }));
    return {
      schemaVersion: DATA_SCHEMA_VERSION,
      capturedAtWallMs: wallMs(),
      pupil: currentPupilName(),
      findObject: {
        categories: categoryLabels(filters.findObjectCategories),
        sourceMode: filters.findObjectSource,
        items: findObjectItems.map(item => ({ ...item })),
        itemMetadata: findObjectItems.map(contentOptionMetadata)
      },
      findCategory: {
        categories: categoryLabels(filters.findCategoryCategories),
        fairPromptCategories: categoryLabels(findCategoryFair),
        sourceMode: filters.findCategorySource,
        items: findCategoryItems.map(item => ({ ...item })),
        itemMetadata: findCategoryItems.map(contentOptionMetadata)
      }
    };
  }

  function exportableContentConfiguration(snapshot=state.sessionContentConfig){
    if(!snapshot) return null;
    return {
      schema_version: snapshot.schemaVersion,
      captured_at_wall_ms: snapshot.capturedAtWallMs,
      pupil: snapshot.pupil,
      find_object: {
        selected_categories: snapshot.findObject.categories,
        source_mode: snapshot.findObject.sourceMode,
        usable_item_count: snapshot.findObject.itemMetadata.length,
        items: snapshot.findObject.itemMetadata
      },
      find_category: {
        selected_categories: snapshot.findCategory.categories,
        fair_prompt_categories: snapshot.findCategory.fairPromptCategories,
        source_mode: snapshot.findCategory.sourceMode,
        usable_item_count: snapshot.findCategory.itemMetadata.length,
        items: snapshot.findCategory.itemMetadata
      }
    };
  }

  function findObjectConfiguration(snapshot=buildContentConfigurationSnapshot()){
    const config = snapshot.findObject;
    const uniqueLabels = uniqueOptions(config.items, true);
    const valid = config.categories.length > 0 && uniqueLabels.length >= 2;
    const categoryNames = config.categories.map(category => category.label).join(', ') || 'None';
    let message = `Categories: ${categoryNames}. Source: ${sourceModeLabel(config.sourceMode)}. ${uniqueLabels.length} distinct usable items.`;
    if(!config.categories.length) message = 'Select at least one category for Find object.';
    else if(uniqueLabels.length < 2) message = 'Find object needs at least two differently labelled usable items. Add content, enable photos for questions, or change the source/category selection.';
    return { valid, message, config, uniqueLabels };
  }

  function findCategoryConfiguration(snapshot=buildContentConfigurationSnapshot()){
    const config = snapshot.findCategory;
    const usableSelected = config.categories.filter(category => config.items.some(item => optionMatchesCategory(item, category.id)));
    const fair = config.fairPromptCategories;
    const valid = config.categories.length >= 2 && usableSelected.length >= 2 && fair.length >= 2;
    const categoryNames = config.categories.map(category => category.label).join(', ') || 'None';
    let message = `Categories: ${categoryNames}. Source: ${sourceModeLabel(config.sourceMode)}. ${config.items.length} usable items; ${usableSelected.length} usable categories; ${fair.length} can produce fair single-answer questions.`;
    if(config.categories.length < 2) message = 'Find category needs at least two selected categories.';
    else if(usableSelected.length < 2) message = 'At least two selected categories must contain usable items for this pupil and source choice.';
    else if(fair.length < 2) message = 'These categories overlap too much to create fair questions. Add another distinct category or change the selection.';
    return { valid, message, config, usableSelected, fair };
  }

  function effectiveConfiguredTaskKinds(){
    const selected = ui.sessionTaskType ? ui.sessionTaskType.value : 'auto';
    if(selected !== 'auto') return selected === 'cpat-suite' ? CPAT_TASK_ORDER.slice() : [selected];
    if(ui.autoLevelPath && ui.autoLevelPath.checked) return [levelSpec(clamp(safeNumber(ui.startLevel && ui.startLevel.value, 1), 1, 10)).kind];
    return ['moving-target', 'find-object', 'discriminate-object', 'find-category', 'choice-preference'];
  }

  function refreshContentConfiguration(){
    if(!ui.findObjectConfig || !ui.findCategoryConfig) return;
    const kinds = effectiveConfiguredTaskKinds();
    const snapshot = buildContentConfigurationSnapshot();
    const objectCheck = findObjectConfiguration(snapshot);
    const categoryCheck = findCategoryConfiguration(snapshot);
    ui.findObjectConfig.hidden = !kinds.includes('find-object');
    ui.findCategoryConfig.hidden = !kinds.includes('find-category');
    ui.findObjectConfigSummary.textContent = objectCheck.message;
    ui.findObjectConfigSummary.classList.toggle('invalid', !objectCheck.valid);
    ui.findCategoryConfigSummary.textContent = categoryCheck.message;
    ui.findCategoryConfigSummary.classList.toggle('invalid', !categoryCheck.valid);
  }

  function validateSessionContentSetup(){
    const kinds = effectiveConfiguredTaskKinds();
    const snapshot = buildContentConfigurationSnapshot();
    const problems = [];
    if(kinds.includes('find-object')){
      const check = findObjectConfiguration(snapshot);
      if(!check.valid) problems.push(check.message);
    }
    if(kinds.includes('find-category')){
      const check = findCategoryConfiguration(snapshot);
      if(!check.valid) problems.push(check.message);
    }
    return { valid: problems.length === 0, problems, snapshot };
  }

  function sessionPoolFor(kind){
    if(state.sessionContentConfig){
      if(kind === 'find-object') return state.sessionContentConfig.findObject.items.slice();
      if(kind === 'find-category') return state.sessionContentConfig.findCategory.items.slice();
    }
    const snapshot = buildContentConfigurationSnapshot();
    return kind === 'find-category' ? snapshot.findCategory.items : snapshot.findObject.items;
  }

  function getFaceObject(){
    const primary = primaryFamiliarPhoto();
    if(primary){
      return { id: primary.id, label: primary.label, src: primary.src, category: primary.category, categoryIds: optionCategoryMemberships(primary), source: normalizeImageSource(primary.source), relationshipType: primary.relationshipType || '', personalised_photo: true };
    }
    return state.familiarFace
      ? { id: 'familiar-face', label: ui.faceName.value || 'Mum', src: state.familiarFace, category: 'family', categoryIds: categoryMemberships('family'), source: 'personalised' }
      : { id: 'familiar-face', label: ui.faceName.value || 'Mum', emoji: '🙂', category: 'family', categoryIds: categoryMemberships('family'), source: 'stock' };
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

  function emojiOption(id, label, emoji, category='symbols'){
    return { id, label, emoji, category };
  }

  function cpatVariantId(kind, index){
    const order = CPAT_VARIANT_ORDER[kind] || ['default'];
    return order[Math.max(0, index - 1) % order.length];
  }

  function baseQuestionVariant(question, variantId, variantLabel, ruleText){
    return {
      ...question,
      variantId,
      variantLabel,
      ruleText
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
      const colorName = STIMULUS_COLOR_FALLBACKS[option.color] ? option.color : 'blue';
      const fallback = STIMULUS_COLOR_FALLBACKS[colorName];
      media.dataset.stimulusColor = colorName;
      media.style.color = `var(--stimulus-${colorName}, ${fallback})`;
      media.style.background = 'var(--surface-subtle)';
      media.style.border = `2px solid var(--stimulus-${colorName}, ${fallback})`;
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
      5: { kind: 'discriminate-object', size: 145 * scale, movable: false, subtitle: 'Level 5: choose the named item from two options.' },
      6: { kind: 'find-category', size: 140 * scale, movable: false, subtitle: 'Level 6: use reasoning to pick the correct category item.' },
      7: { kind: 'cpat-sustained', size: 170 * scale, movable: false, subtitle: 'Level 7: sustained attention. Tap only when the target appears.' },
      8: { kind: 'cpat-selective', size: 160 * scale, movable: false, subtitle: 'Level 8: selective-spatial attention. Find the correct target among distractors.' },
      9: { kind: 'cpat-orienting', size: 160 * scale, movable: false, subtitle: 'Level 9: orienting attention. Use the cue, then reorient when needed.' },
      10: { kind: 'cpat-executive', size: 160 * scale, movable: false, subtitle: 'Level 10: executive attention. Ignore conflict and follow the rule.' }
    };
    return specs[clamp(level || 1, 1, 10)];
  }

  function updateCurrentLevelDescription(){
    if(!ui.currentLevelDescription) return;
    const level = clamp(safeNumber(ui.startLevel && ui.startLevel.value, 1), 1, 10);
    const selectedTask = ui.sessionTaskType ? ui.sessionTaskType.value : 'auto';
    ui.currentLevelDescription.textContent = selectedTask === 'auto'
      ? levelSpec(level).subtitle
      : `Level ${level}: ${taskLabel(selectedTask)} is selected for this session instead of the automatic level task.`;
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

  function questionSubtitle(kind, automaticSubtitle){
    const selected = selectedSessionTaskMode();
    if(selected !== 'auto') return `Level ${state.currentLevel}: ${taskLabel(kind)} is selected for this session.`;
    if(ui.autoLevelPath && !ui.autoLevelPath.checked) return `Mixed practice: ${taskLabel(kind)}.`;
    return automaticSubtitle;
  }

  function buildFoundationTarget(){
    if(!state.sessionTarget){
      state.sessionTarget = ui.useFace.checked ? getFaceObject() : shuffle(objectPool())[0];
    }
    return state.sessionTarget;
  }

  function buildSelectiveStimuli(){
    return shuffle([
      shapeOption('selective-blue-star', 'star', 'blue', 'Blue star'),
      shapeOption('selective-green-star', 'star', 'green', 'Green star'),
      shapeOption('selective-blue-circle', 'circle', 'blue', 'Blue circle'),
      shapeOption('selective-green-circle', 'circle', 'green', 'Green circle'),
      shapeOption('selective-amber-square', 'square', 'amber', 'Amber square'),
      shapeOption('selective-red-triangle', 'triangle', 'red', 'Red triangle')
    ]);
  }

  function buildTicketHuntStimuli(){
    return shuffle([
      shapeOption('ticket-gold-target', 'diamond', 'amber', 'Gold ticket'),
      shapeOption('ticket-blue-ticket', 'diamond', 'blue', 'Blue ticket'),
      shapeOption('ticket-green-ticket', 'diamond', 'green', 'Green ticket'),
      shapeOption('ticket-gold-signal', 'circle', 'amber', 'Gold signal'),
      shapeOption('ticket-red-sign', 'square', 'red', 'Red sign'),
      shapeOption('ticket-blue-pass', 'circle', 'blue', 'Blue pass')
    ]);
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
      subtitle: questionSubtitle(currentKind, spec.subtitle),
      cueSummary: '',
      distractorCount: 0
    };

    if(currentKind === 'touch-screen'){
      const target = buildFoundationTarget();
      return {
        ...baseQuestion,
        prompt: buildFindPrompt(target.label, index),
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
        prompt: buildFindPrompt(target.label, index, currentKind === 'moving-target' ? 'moving' : 'familiar'),
        cueSummary: currentKind === 'moving-target' ? 'Find the moving target and tap it when you are ready.' : 'Find the pictured target and tap it when you are ready.',
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
      const eligible = uniqueOptions(sessionPoolFor('find-object'), true);
      const target = shuffle(eligible)[0];
      const distractorPool = eligible.filter(item => normalizedConceptLabel(item.label) !== normalizedConceptLabel(target.label));
      const others = pickDistinct(distractorPool, Math.min(optionCount - 1, distractorPool.length), [target.id]);
      return {
        ...baseQuestion,
        prompt: buildFindPrompt(target.label, index),
        cueSummary: 'Choose the named object from the set.',
        target,
        options: shuffle([target].concat(others)),
        correctId: target.id,
        renderMode: 'grid',
        distractorCount: others.length,
        contentConfiguration: exportableContentConfiguration(state.sessionContentConfig).find_object,
        expectedResponseType: 'hit'
      };
    }

    if(currentKind === 'discriminate-object'){
      const grouped = shuffle(pool.filter(item => item.category === 'fruit' || item.category === 'animals'));
      const target = grouped[0] || pool[0];
      const distractor = grouped.find(item => item.id !== target.id) || pickDistinct(pool, 1, [target.id])[0];
      return {
        ...baseQuestion,
        prompt: buildFindPrompt(target.label, index),
        cueSummary: 'Choose the named item from two options. Visual similarity is not guaranteed in this version.',
        target,
        options: shuffle([target, distractor]),
        correctId: target.id,
        renderMode: 'grid',
        distractorCount: 1,
        expectedResponseType: 'hit'
      };
    }

    if(currentKind === 'find-category'){
      const eligible = sessionPoolFor('find-category');
      const snapshot = state.sessionContentConfig || buildContentConfigurationSnapshot();
      const fairCategories = snapshot.findCategory.fairPromptCategories.map(item => item.id);
      const category = fairCategories[rand(fairCategories.length)];
      const targetCandidates = uniqueOptions(eligible.filter(item => optionMatchesCategory(item, category)), true);
      const target = shuffle(targetCandidates)[0];
      const distractorPool = uniqueOptions(eligible.filter(item =>
        !optionMatchesCategory(item, category)
        && normalizedConceptLabel(item.label) !== normalizedConceptLabel(target.label)
      ), true);
      const distractors = pickDistinct(distractorPool, Math.min(optionCount - 1, distractorPool.length), [target.id]);
      return {
        ...baseQuestion,
        prompt: buildCategoryPrompt(category, index),
        cueSummary: 'Use category knowledge to pick the correct item.',
        target,
        options: shuffle([target].concat(distractors)),
        correctId: target.id,
        renderMode: 'grid',
        distractorCount: distractors.length,
        targetCategory: category,
        targetCategoryLabel: categoryMeta(category).label,
        contentConfiguration: exportableContentConfiguration(snapshot).find_category,
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
        prompt: choosePromptVariant('preference', {}, index),
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
    const controlCondition = researchCondition() === 'active-control';
    const baseQuestion = {
      kind,
      family: taskMeta(kind).family,
      attentionDomain: taskMeta(kind).domain,
      level: state.currentLevel,
      questionIndex: index,
      responseWindowMs: currentQuestionResponseWindow(),
      subtitle: questionSubtitle(kind, spec.subtitle),
      distractorCount: 0,
      researchCondition: researchCondition(),
      controlCondition
    };

    if(kind === 'cpat-sustained'){
      const variantId = cpatVariantId(kind, index);
      const sustainedCycleIndex = Math.ceil(index / Math.max(1, (CPAT_VARIANT_ORDER[kind] || []).length || 1));
      const targetPresent = controlCondition ? true : (variantId === 'signal-station' ? true : sustainedCycleIndex % 2 === 1);
      if(variantId === 'signal-station'){
        const target = shapeOption('cpat-sustained-green-signal', 'circle', 'green', 'Green signal');
        const stopSignal = shapeOption('cpat-sustained-red-signal', 'circle', 'red', 'Red signal');
        const stimulus = target;
        return baseQuestionVariant({
          ...baseQuestion,
          prompt: controlCondition ? 'Tap the signal when it appears.' : 'Wait for green, then tap the signal.',
          cueSummary: controlCondition ? 'Matched control: every signal is a go trial.' : 'The signal starts red. Wait, then tap when it turns green.',
          promptPreviewOption: controlCondition ? target : stopSignal,
          promptPreviewText: controlCondition ? 'Signal is ready' : 'Red means wait',
          target: stimulus,
          stimulus,
          targetPresent: true,
          options: [stimulus],
          correctId: stimulus.id,
          renderMode: 'cpat-sustained',
          forcePromptStage: !controlCondition,
          promptDelayMs: 850,
          requiresResponse: true,
          nonResponseIsCorrect: false,
          choiceHint: controlCondition ? 'Every signal is a go trial.' : 'Green signal: tap now.',
          expectedResponseType: 'hit'
        }, variantId, 'Signal Station', controlCondition ? 'Rule: Tap every signal. This matched control removes the no-go demand.' : 'Rule: Wait through red. Tap when the signal turns green.');
      }
      const target = shapeOption('cpat-sustained-star', 'star', 'amber', 'Star');
      const nonTargets = [
        shapeOption('cpat-sustained-circle', 'circle', 'blue', 'Circle'),
        shapeOption('cpat-sustained-square', 'square', 'green', 'Square'),
        shapeOption('cpat-sustained-triangle', 'triangle', 'red', 'Triangle')
      ];
      const stimulus = targetPresent ? target : nonTargets[rand(nonTargets.length)];
      return baseQuestionVariant({
        ...baseQuestion,
        prompt: controlCondition ? 'Tap the shape when it appears.' : 'Tap only when you see the star.',
        cueSummary: controlCondition ? 'Matched control: every shape is a go trial.' : (targetPresent ? 'Target present: respond to the star.' : 'Target absent: wait without tapping.'),
        target: controlCondition ? stimulus : target,
        stimulus,
        targetPresent,
        options: [stimulus],
        correctId: controlCondition ? stimulus.id : target.id,
        renderMode: 'cpat-sustained',
        requiresResponse: controlCondition ? true : targetPresent,
        nonResponseIsCorrect: controlCondition ? false : !targetPresent,
        choiceHint: controlCondition ? 'Every shape is a go trial.' : (targetPresent ? 'Star present: tap now.' : 'Target absent: wait.'),
        expectedResponseType: controlCondition ? 'hit' : (targetPresent ? 'hit' : 'correct-rejection')
      }, variantId, 'Star Watch', controlCondition ? 'Rule: Tap each shape. This matched control removes the target-only rule.' : 'Rule: Tap when the star appears. Wait on every other shape.');
    }

    if(kind === 'cpat-selective'){
      const variantId = cpatVariantId(kind, index);
      if(variantId === 'ticket-hunt'){
        const stimuli = buildTicketHuntStimuli();
        const target = stimuli.find(item => item.id === 'ticket-gold-target') || stimuli[0];
        const distractors = shuffle(stimuli.filter(item => item.id !== target.id)).slice(0, 3);
        const options = shuffle([target, ...distractors]);
        return baseQuestionVariant({
          ...baseQuestion,
          prompt: controlCondition ? 'Tap the highlighted gold ticket.' : 'Find the gold ticket.',
          cueSummary: controlCondition ? 'Matched control: the target is highlighted so search demand is reduced.' : 'Ignore the other travel symbols and select the gold ticket.',
          target,
          options,
          correctId: target.id,
          renderMode: 'grid',
          distractorCount: options.length - 1,
          highlightCorrect: controlCondition,
          expectedResponseType: 'hit'
        }, variantId, 'Ticket Hunt', controlCondition ? 'Rule: Tap the highlighted ticket. This matched control reduces selective search demand.' : 'Rule: Ignore the other travel symbols. Select the gold ticket.');
      }
      const stimuli = buildSelectiveStimuli();
      const target = stimuli.find(item => item.id === 'selective-blue-star') || stimuli[0];
      const distractors = shuffle(stimuli.filter(item => item.id !== target.id)).slice(0, 3);
      const options = shuffle([target, ...distractors]);
      return baseQuestionVariant({
        ...baseQuestion,
        prompt: controlCondition ? 'Tap the highlighted blue star.' : 'Find the blue star.',
        cueSummary: controlCondition ? 'Matched control: the target is highlighted so search demand is reduced.' : 'Ignore other shapes and colours and select the blue star.',
        target,
        options,
        correctId: target.id,
        renderMode: 'grid',
        distractorCount: options.length - 1,
        highlightCorrect: controlCondition,
        expectedResponseType: 'hit'
      }, variantId, 'Blue Star Search', controlCondition ? 'Rule: Tap the highlighted star. This matched control reduces selective search demand.' : 'Rule: Ignore other colours and shapes. Select the blue star.');
    }

    if(kind === 'cpat-orienting'){
      const variantId = cpatVariantId(kind, index);
      const cueSide = rand(2) === 0 ? 'left' : 'right';
      const cueValidity = controlCondition ? true : rand(100) < 75;
      const targetSide = cueValidity ? cueSide : (cueSide === 'left' ? 'right' : 'left');
      if(variantId === 'platform-pointer'){
        const target = emojiOption('orienting-target-train', 'Train', '\u{1F686}', 'transport');
        const distractor = emojiOption('orienting-distractor-bus', 'Bus', '\u{1F68C}', 'transport');
        const left = targetSide === 'left' ? target : distractor;
        const right = targetSide === 'right' ? target : distractor;
        return baseQuestionVariant({
          ...baseQuestion,
          prompt: controlCondition ? 'Follow the cue, then tap the train.' : 'Use the cue, then tap the train.',
          cueSummary: controlCondition ? `Matched control: the cue reliably points ${cueSide}.` : (cueValidity ? `Valid cue: look ${cueSide} first.` : `Invalid cue: the cue points ${cueSide}, but the train will appear on the other side.`),
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
        }, variantId, 'Platform Pointer', controlCondition ? 'Rule: Follow the reliable cue to the train. This matched control removes reorienting conflict.' : 'Rule: Look where the cue points first, then tap the train even if the cue misleads.');
      }
      const target = shapeOption('orienting-target-star', 'star', 'green', 'Star');
      const distractor = shapeOption('orienting-distractor-circle', 'circle', 'blue', 'Circle');
      const left = targetSide === 'left' ? target : distractor;
      const right = targetSide === 'right' ? target : distractor;
      return baseQuestionVariant({
        ...baseQuestion,
        prompt: controlCondition ? 'Follow the cue, then tap the star.' : 'Use the cue, then tap the star.',
        cueSummary: controlCondition ? `Matched control: the cue reliably points ${cueSide}.` : (cueValidity ? `Valid cue: look ${cueSide} first.` : `Invalid cue: the cue points ${cueSide}, but the star will appear on the other side.`),
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
      }, variantId, 'Star Pointer', controlCondition ? 'Rule: Follow the reliable cue to the star. This matched control removes reorienting conflict.' : 'Rule: Look where the cue points first, then tap the star.');
    }

    if(kind === 'cpat-executive'){
      const variantId = cpatVariantId(kind, index);
      if(variantId === 'traffic-lights'){
        const target = shapeOption('executive-green-light', 'circle', 'green', 'Green light');
        const stopSignal = shapeOption('executive-red-light', 'circle', 'red', 'Red light');
        return baseQuestionVariant({
          ...baseQuestion,
          prompt: controlCondition ? 'Tap the green light.' : 'Wait for green, then tap Go.',
          cueSummary: controlCondition ? 'Matched control: the go light is shown directly with no wait demand.' : 'The light starts red. Wait, then tap when it turns green.',
          promptPreviewOption: controlCondition ? target : stopSignal,
          promptPreviewText: controlCondition ? 'Green means go' : 'Red means wait',
          target,
          options: [target],
          correctId: target.id,
          renderMode: 'cpat-sustained',
          forcePromptStage: !controlCondition,
          promptDelayMs: 900,
          requiresResponse: true,
          nonResponseIsCorrect: false,
          choiceHint: controlCondition ? 'Tap the green light now.' : 'Green means Go.',
          expectedResponseType: 'hit'
        }, variantId, 'Traffic Lights', controlCondition ? 'Rule: Tap the green light. This matched control removes the wait-to-go inhibition step.' : 'Rule: Wait through red. Tap when the light turns green.');
      }
      const congruent = controlCondition ? true : rand(2) === 0;
      const centerDirection = rand(2) === 0 ? 'left' : 'right';
      const flankerDirection = congruent ? centerDirection : (centerDirection === 'left' ? 'right' : 'left');
      const target = arrowOption(`executive-${centerDirection}`, centerDirection, centerDirection === 'left' ? 'Left' : 'Right');
      return baseQuestionVariant({
        ...baseQuestion,
        prompt: 'Tap the direction of the middle arrow.',
        cueSummary: controlCondition ? 'Matched control: all arrows point the same way.' : (congruent ? 'Congruent trial.' : 'Incongruent trial. Ignore the side arrows and follow the middle one.'),
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
      }, variantId, 'Middle Arrow', controlCondition ? 'Rule: Follow the middle arrow. This matched control removes flankers that conflict.' : 'Rule: Ignore the side arrows. Tap the direction of the middle arrow.');
    }

    return buildQuestion(index);
  }

  function currentQuestionFamily(){
    return state.currentQuestion ? state.currentQuestion.family : 'none';
  }

  function showScreen(id){
    ['screenWelcome', 'screenPrompt', 'screenChoice', 'screenReward', 'screenBlank', 'screenBreak', 'screenSummary'].forEach(screenId => {
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
        ? '<b>Learner view</b><span class="tiny">A calm, focused activity space</span>'
        : '<b>Teacher workspace</b><span class="tiny">Prepare today\'s session and review progress</span>';
    }
    applySensoryPreferences();
    applyStudentFriendlyMode();
    if(state.viewMode !== 'learner') applyPanelView(state.panelView || 'teacher');
    updateLearnerControls();
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
    ctx.strokeStyle = colourWithAlpha(themeToken('focus', STIMULUS_COLOR_FALLBACKS.blue), 0.8);
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
        ctx.strokeStyle = colourWithAlpha(themeToken('warning', STIMULUS_COLOR_FALLBACKS.amber), 0.95);
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

  function showRipple(x, y, color=themeToken('focus', STIMULUS_COLOR_FALLBACKS.blue)){
    if(performanceModeEnabled() && state.lastPointerType === 'touch') return;
    const ripple = document.createElement('div');
    ripple.className = 'ripple';
    ripple.style.left = `${x}px`;
    ripple.style.top = `${y}px`;
    ripple.style.borderColor = `${color}`;
    ripple.style.background = colourWithAlpha(color, 0.14);
    ripple.style.boxShadow = `0 0 18px ${colourWithAlpha(color, 0.32)}`;
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
      learner_alias: currentPupilAlias(),
      level: state.currentLevel,
      question_index: question.questionIndex,
      attempt_index: attemptIndex,
      repeat_count: Math.max(0, attemptIndex - 1),
      task_family: question.family,
      task_kind: question.kind,
      task_variant: question.variantId || '',
      variant_label: question.variantLabel || '',
      attention_domain: question.attentionDomain || '',
      research_condition: researchCondition(),
      eeg_research_mode: eegModeEnabled(),
      block_index: blockIndexForQuestion(question.questionIndex),
      trial_in_block: ((question.questionIndex - 1) % eegBlockSize()) + 1,
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
      target_category: question.targetCategory || (question.target && canonicalCategoryId(question.target.category)) || '',
      target_category_label: question.targetCategoryLabel || (question.target && categoryMeta(question.target.category).label) || '',
      target_source: question.target ? normalizeImageSource(question.target.source) : '',
      prompt_wording: question.prompt || '',
      option_labels: Array.isArray(question.options) ? question.options.map(option => option.label || '').filter(Boolean) : [],
      option_metadata: Array.isArray(question.options) ? question.options.map(contentOptionMetadata) : [],
      photo_labels_used: Array.isArray(question.options) ? question.options.filter(option => option && option.src).map(option => option.label || '').filter(Boolean) : [],
      content_configuration: question.contentConfiguration || null,
      student_friendly_mode: studentFriendlyModeEnabled(),
      selected_id: '',
      selected_label: '',
      distractor_count: question.distractorCount || 0,
      touch_anywhere_accepted: !!question.touchAnywhereAccepted,
      cue_summary: question.cueSummary || '',
      rule_text: question.ruleText || '',
      cue_validity: question.cueValidity == null ? null : question.cueValidity,
      cue_side: question.cueSide || '',
      target_side: question.targetSide || '',
      congruency: question.congruency || '',
      flanker_pattern: question.flankerPattern || '',
      context_notes: currentContextNotes(),
      session_context: learnerContextSnapshot(),
      learner_baseline: learnerBaselineSnapshot(),
      fidelity: fidelitySnapshot()
    };
  }

  function learnerBaselineSnapshot(){
    return {
      communication_mode: ui.communicationMode.value,
      motor_access_mode: ui.motorAccessMode.value,
      adaptive_functioning_band: ui.adaptiveFunctioningBand.value,
      teacher_attention_rating: safeNumber(ui.teacherAttentionRating.value, 3),
      teacher_independence_rating: safeNumber(ui.teacherIndependenceRating.value, 3),
      eeg_participation: ui.eegParticipation.value,
      aac_preference: ui.aacPreference.value,
      sleep_quality: ui.sleepQuality.value,
      cap_tolerance: ui.capTolerance.value,
      sensory_preferences: sensoryPreferenceSnapshot()
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
      classroom_transfer_notes: ui.classroomTransferNotes.value.trim(),
      context_notes: currentContextNotes(),
      reward_choice: currentRewardChoice(),
      theme_choice: currentThemeChoice(),
      communication_support_choice: ui.communicationSupportChoice.value,
      pre_session_preference: ui.preSessionPreference.value,
      coaching_review_notes: ui.coachingReviewNotes.value.trim(),
      student_friendly_mode: studentFriendlyModeEnabled(),
      sensory_preferences: sensoryPreferenceSnapshot()
    };
  }

  function fidelitySnapshot(){
    return {
      score_pct: fidelityScorePct(),
      dosage_minutes_target: safeNumber(ui.dosageMinutesTarget.value, 10),
      dosage_sessions_per_week: safeNumber(ui.dosageSessionsPerWeek.value, 3),
      dosage_minutes_actual: dosageMinutesActual(),
      environment_ready: !!ui.fidelityEnvironmentReady.checked,
      rule_shown: !!ui.fidelityRuleShown.checked,
      prompt_plan_followed: !!ui.fidelityPromptPlan.checked,
      breaks_offered: !!ui.fidelityBreaksOffered.checked,
      reward_delivered: !!ui.fidelityRewardDelivered.checked,
      data_checked: !!ui.fidelityDataChecked.checked,
      coaching_review_notes: ui.coachingReviewNotes.value.trim()
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
      task_variant: question.variantId || '',
      variant_label: question.variantLabel || '',
      attention_domain: question.attentionDomain || '',
      cue_validity: question.cueValidity == null ? null : question.cueValidity,
      cue_side: question.cueSide || '',
      cue_summary: question.cueSummary || '',
      highest_prompt_level: state.promptState.highestLevel
    });
    pushEegMarker('cue_onset', {
      trial_id: state.currentTrial.trial_id,
      task_kind: question.kind,
      task_variant: question.variantId || '',
      attention_domain: question.attentionDomain || ''
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
      task_variant: question.variantId || '',
      variant_label: question.variantLabel || '',
      attention_domain: question.attentionDomain || '',
      target_id: state.currentTrial.target_id,
      distractor_count: state.currentTrial.distractor_count,
      response_window_ms: question.responseWindowMs
    });
    pushEegMarker('stimulus_onset', {
      trial_id: state.currentTrial.trial_id,
      task_kind: question.kind,
      task_variant: question.variantId || '',
      attention_domain: question.attentionDomain || '',
      target_id: state.currentTrial.target_id
    });
    pushEegMarker(question.requiresResponse === false ? 'no_go' : 'target_present', {
      trial_id: state.currentTrial.trial_id,
      task_kind: question.kind,
      task_variant: question.variantId || '',
      attention_domain: question.attentionDomain || ''
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
      pushEegMarker('prompt_onset_support', {
        trial_id: state.currentTrial.trial_id,
        task_kind: state.currentQuestion ? state.currentQuestion.kind : '',
        prompt_level: meta.level,
        support_code: state.promptState.supportCode
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
    const focus = themeToken('focus', STIMULUS_COLOR_FALLBACKS.blue);
    targetNode.style.boxShadow = `0 0 0 10px ${colourWithAlpha(focus, 0.18)}, 0 0 28px ${colourWithAlpha(focus, 0.35)}`;
    targetNode.style.borderColor = focus;
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
      card.appendChild(buildChoiceMediaElement(question.promptPreviewOption || question.target, 'faceCircle'));
      const text = document.createElement('div');
      text.textContent = question.promptPreviewText || 'Tap only for the star';
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
      arrow.textContent = question.cueSide === 'left' ? '\u2190' : '\u2192';
      const sub = document.createElement('div');
      sub.textContent = question.cueValidity ? 'Cue may help' : 'Cue may mislead';
      card.append(arrow, sub);
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
    if(studentFriendlyModeEnabled()) return question.prompt;
    if(question.renderMode === 'cpat-sustained') return question.prompt;
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

  function decorateControlTarget(node){
    if(!node) return;
    const focus = themeToken('focus', STIMULUS_COLOR_FALLBACKS.blue);
    node.style.boxShadow = `0 0 0 10px ${colourWithAlpha(focus, 0.18)}, 0 0 30px ${colourWithAlpha(focus, 0.28)}`;
    node.style.borderColor = focus;
  }

  function updateLearnerControls(){
    if(ui.learnerHelpBtn) ui.learnerHelpBtn.hidden = !(ui.allowLearnerHelp && ui.allowLearnerHelp.checked);
    if(ui.learnerBreakBtn) ui.learnerBreakBtn.hidden = !(ui.allowLearnerBreak && ui.allowLearnerBreak.checked);
    if(ui.learnerStopBtn) ui.learnerStopBtn.hidden = !(ui.allowLearnerStop && ui.allowLearnerStop.checked);
  }

  function renderChoiceScreen(question){
    clearNode(ui.choiceGrid);
    ui.questionText.textContent = renderQuestionText(question);
    if(ui.questionVariant) ui.questionVariant.textContent = question.variantLabel || taskLabel(question.kind);
    if(ui.questionRule) ui.questionRule.textContent = question.ruleText || question.cueSummary || question.subtitle || '';
    ui.choiceGrid.style.position = question.renderMode === 'single-target' || question.renderMode === 'touch-screen' || question.renderMode === 'cpat-sustained' ? 'relative' : '';
    ui.choiceGrid.style.width = (question.renderMode === 'single-target' || question.renderMode === 'touch-screen' || question.renderMode === 'cpat-sustained') ? '100%' : '';
    ui.choiceGrid.style.maxWidth = (question.renderMode === 'single-target' || question.renderMode === 'touch-screen' || question.renderMode === 'cpat-sustained') ? '100%' : '';
    ui.choiceGrid.style.minHeight = (question.renderMode === 'single-target' || question.renderMode === 'touch-screen' || question.renderMode === 'cpat-sustained') ? '420px' : '';
    ui.choiceGrid.style.gridTemplateColumns = '';

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
      hint.textContent = 'Find the picture';
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
      hint.textContent = question.choiceHint || (question.requiresResponse ? 'Respond now.' : 'Wait without tapping.');
      setNodeChildren(btn, buildChoiceMediaElement(stimulus, 'choiceMedia'), label, hint);
      if(question.requiresResponse !== false) btn.dataset.role = 'correct-target';
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
      if(question.highlightCorrect && option.id === question.correctId){
        decorateControlTarget(btn);
      }
      ui.choiceGrid.appendChild(btn);
    });
  }

  function speak(text){
    if(!(ui.ttsToggle && ui.ttsToggle.checked) || !('speechSynthesis' in window) || !text) return;
    try {
      stopActiveSounds();
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

  function noResponseIsCorrect(question){
    return question && question.requiresResponse === false && question.nonResponseIsCorrect === true;
  }

  function finalizeTimeoutTrial(question){
    if(state.phase !== 'choice' || !state.currentTrial || !state.currentQuestion) return;
    const correctRejection = noResponseIsCorrect(question);
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
      task_variant: trial.task_variant,
      variant_label: trial.variant_label,
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
    if(result.selected){
      pushEegMarker('response', {
        trial_id: trial.trial_id,
        task_kind: trial.task_kind,
        task_variant: trial.task_variant,
        attention_domain: trial.attention_domain,
        response_type: trial.response_type,
        correct: trial.correct
      });
    }
    if(trial.omission){
      pushEegMarker('omission', {
        trial_id: trial.trial_id,
        task_kind: trial.task_kind,
        task_variant: trial.task_variant,
        attention_domain: trial.attention_domain
      });
    }
    if(trial.commission){
      pushEegMarker('commission', {
        trial_id: trial.trial_id,
        task_kind: trial.task_kind,
        task_variant: trial.task_variant,
        attention_domain: trial.attention_domain,
        response_type: trial.response_type
      });
    }
    pushEegMarker('feedback_onset', {
      trial_id: trial.trial_id,
      task_kind: trial.task_kind,
      task_variant: trial.task_variant,
      attention_domain: trial.attention_domain,
      response_type: trial.response_type
    });

    if(question.kind === 'touch-screen' || question.kind === 'touch-object' || question.kind === 'moving-target' || trial.correct){
      flash('good', trial.correct_rejection ? 'Waited' : 'Nice');
    } else {
      flash('try', trial.response_type === 'omission' ? 'No response' : 'Try');
    }

    playSoundCue(
      trial.correct_rejection ? 'wait' : trial.correct ? 'correct' : 'retry',
      { trial_id: trial.trial_id, task_kind: trial.task_kind, response_type: trial.response_type }
    );

    updateReward(trial.correct);
    updateStats();
    scheduleCurrentSessionPersist();
    state.phase = 'feedback';

    const rewardEnabled = ui.useReward.checked;
    const showFeedbackControls = rewardEnabled || !ui.autoAdvance.checked;
    if(showFeedbackControls){
      ui.screenReward.classList.toggle('feedbackOnly', !rewardEnabled);
      ui.rewardTitle.textContent = rewardEnabled
        ? (trial.correct ? 'Well Done!' : (trial.correct_rejection ? 'Good waiting!' : 'Good Try!'))
        : (trial.correct ? 'Nice work' : 'Let’s keep going');
      ui.rewardSub.textContent = studentFriendlyModeEnabled()
        ? (trial.correct ? 'Ready for the next one.' : 'Let’s try another one.')
        : trial.correct
          ? (ui.autoAdvance.checked ? 'Moving to the next question automatically.' : 'Next or repeat.')
          : trial.response_type === 'omission'
            ? (ui.autoAdvance.checked ? 'No response recorded. Repeat if more support is needed.' : 'No response recorded. Repeat or move on with support.')
            : (ui.autoAdvance.checked ? 'Moving on automatically. Repeat if more practice is needed.' : 'Repeat or move on with support.');
      state.phase = rewardEnabled ? 'reward' : 'feedback';
      if(rewardEnabled){
        pushEegMarker('reward_onset', {
          trial_id: trial.trial_id,
          task_kind: trial.task_kind,
          response_type: trial.response_type,
          correct: trial.correct
        });
      }
      showScreen('screenReward');
    } else {
      ui.screenReward.classList.remove('feedbackOnly');
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
    if(noResponseIsCorrect(question)){
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
    const symbol = rewardSymbol();
    Array.from(ui.rewardStars.children).forEach((star, index) => {
      star.textContent = symbol;
      star.classList.toggle('on', index < stars);
    });
    const progress = Math.min(100, Math.max(0, (summary.questions_answered / Math.max(1, state.totalQuestions)) * 100));
    if(ui.rewardRailFill) ui.rewardRailFill.style.width = `${progress}%`;
    if(ui.rewardTrain) ui.rewardTrain.style.left = `${progress}%`;
    if(ui.rewardJourneyLabel){
      ui.rewardJourneyLabel.textContent = progress >= 100
        ? 'You reached the station'
        : correct
          ? 'Your train moved forward'
          : 'Every try helps the journey continue';
    }
    if(ui.rewardCollection){
      const remaining = Math.max(0, state.totalQuestions - summary.questions_answered);
      ui.rewardCollection.textContent = remaining
        ? `${summary.questions_answered} completed, ${remaining} to go.`
        : 'The journey is complete. Great persistence.';
    }
  }

  function beginQuestion(question, attemptIndex){
    clearTimeout(state.timers.preview);
    clearTimeout(state.timers.response);
    clearTimeout(state.timers.reward);
    clearTimeout(state.timers.blank);
    clearTransientFeedback();
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
    if(ui.useTwoStage.checked || question.forcePromptStage){
      ui.promptTitle.textContent = (studentFriendlyModeEnabled() || ui.useTextPrompt.checked) ? question.prompt : taskLabel(question.kind);
      ui.promptSubtitle.textContent = studentFriendlyModeEnabled()
        ? (question.ruleText ? question.ruleText.split('. ')[0] : (question.cueSummary || question.subtitle))
        : (question.ruleText || question.cueSummary || question.subtitle);
      showScreen('screenPrompt');
      state.phase = 'prompt';
      logEvent('prompt_onset', {
        trial_id: state.currentTrial.trial_id,
        question_index: question.questionIndex,
        task_kind: question.kind,
        task_variant: question.variantId || '',
        prompt_mode: currentPromptModeLabel()
      });
      pushEegMarker('prompt_onset', {
        trial_id: state.currentTrial.trial_id,
        task_kind: question.kind,
        task_variant: question.variantId || '',
        attention_domain: question.attentionDomain || ''
      });
      speak(question.prompt);
      state.timers.preview = window.setTimeout(revealChoice, question.promptDelayMs || safeNumber(ui.delaySec.value, 1) * 1000);
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
    clearTimeout(state.timers.blank);
    logEvent('question_repeat', {
      question_index: state.currentQuestion.questionIndex,
      attempt_index: state.attemptIndex,
      task_kind: state.currentQuestion.kind
    });
    beginQuestion(state.currentQuestion, state.attemptIndex + 1);
  }

  function updateBreakScreen(reason, autoResumeMs=0){
    if(ui.breakTitle) ui.breakTitle.textContent = reason === 'auto-block-pause' ? 'Block Pause' : 'Take a Break';
    if(ui.breakSubtitle){
      ui.breakSubtitle.textContent = reason === 'auto-block-pause'
        ? `Block ${currentBlockIndex()} complete. A short pause is active before the next block.`
        : 'Pause, regulate, then continue when ready.';
    }
    if(ui.breakCountdown){
      ui.breakCountdown.textContent = autoResumeMs > 0
        ? `Resume in ${Math.max(1, Math.ceil(autoResumeMs / 1000))}s`
        : 'Resume when ready';
    }
  }

  function clearBreakCountdown(){
    clearTimeout(state.timers.breakCountdown);
  }

  function beginBreak(reason, options={}){
    clearTimeout(state.timers.preview);
    clearTimeout(state.timers.response);
    clearTimeout(state.timers.reward);
    clearTimeout(state.timers.blank);
    clearBreakCountdown();
    const autoResumeMs = Math.max(0, safeNumber(options.autoResumeMs, 0));
    state.blockPause = {
      reason,
      mode: options.mode || 'repeat-question',
      question: options.question || state.currentQuestion,
      attemptIndex: options.attemptIndex || state.attemptIndex || 1,
      nextQuestionIndex: options.nextQuestionIndex || state.questionIndex,
      autoResumeMs
    };
    if(options.incrementBreakCount !== false && ui.breakCount){
      ui.breakCount.value = String(safeNumber(ui.breakCount.value, 0) + 1);
    }
    if(state.currentTrial && (state.phase === 'prompt' || state.phase === 'choice')){
      logEvent('trial_interrupted', {
        trial_id: state.currentTrial.trial_id,
        question_index: state.currentTrial.question_index,
        task_kind: state.currentTrial.task_kind,
        reason
      });
    }
    state.phase = 'break';
    updateBreakScreen(reason, autoResumeMs);
    showScreen('screenBreak');
    setFooter(reason === 'auto-block-pause' ? 'Automatic block pause for EEG-ready pacing.' : 'Learner break requested.', 'Break');
    logEvent('break_onset', {
      reason,
      mode: state.blockPause.mode,
      next_question_index: state.blockPause.nextQuestionIndex,
      trial_id: state.currentTrial ? state.currentTrial.trial_id : '',
      block_index: currentBlockIndex()
    });
    pushEegMarker('break_onset', {
      break_reason: reason,
      trial_id: state.currentTrial ? state.currentTrial.trial_id : ''
    });
    if(autoResumeMs > 0){
      state.timers.breakCountdown = window.setTimeout(() => resumeFromBreak('continue'), autoResumeMs);
    }
    refreshDashboard(true);
  }

  function resumeFromBreak(action='continue'){
    if(!state.blockPause) return;
    clearBreakCountdown();
    const pause = state.blockPause;
    state.blockPause = null;
    logEvent('break_offset', {
      reason: pause.reason,
      resume_action: action,
      block_index: currentBlockIndex()
    });
    pushEegMarker('break_offset', {
      break_reason: pause.reason,
      response_type: action
    });
    if(action === 'repeat' || pause.mode === 'repeat-question'){
      if(pause.question){
        beginQuestion(pause.question, (pause.attemptIndex || 1) + 1);
        return;
      }
    }
    if(pause.mode === 'next-question'){
      state.questionIndex = pause.nextQuestionIndex;
      startQuestion();
      return;
    }
    startQuestion();
  }

  function maybePauseAfterCurrentQuestion(){
    if(!eegModeEnabled() || !autoBlockPausesEnabled()) return false;
    if(state.questionIndex >= state.totalQuestions) return false;
    if(state.questionIndex % eegBlockSize() !== 0) return false;
    beginBreak('auto-block-pause', {
      mode: 'next-question',
      nextQuestionIndex: state.questionIndex + 1,
      autoResumeMs: eegAutoPauseMs(),
      incrementBreakCount: true
    });
    return true;
  }

  function requestLearnerHelp(){
    if(!(ui.allowLearnerHelp && ui.allowLearnerHelp.checked) || !state.currentQuestion) return;
    logEvent('help_requested', {
      trial_id: state.currentTrial ? state.currentTrial.trial_id : '',
      question_index: state.currentQuestion.questionIndex,
      task_kind: state.currentQuestion.kind
    });
    const nextLevel = Math.min(5, (state.promptState.highestLevel || 0) + 1);
    markPromptLevel(nextLevel, promptMeta(nextLevel).supportCode);
    flash('good', 'Help');
  }

  function requestLearnerBreak(){
    if(!(ui.allowLearnerBreak && ui.allowLearnerBreak.checked)) return;
    beginBreak('learner-break', {
      mode: state.currentQuestion ? 'repeat-question' : 'next-question',
      question: state.currentQuestion,
      attemptIndex: state.attemptIndex,
      nextQuestionIndex: state.questionIndex
    });
  }

  function requestLearnerStop(){
    if(!(ui.allowLearnerStop && ui.allowLearnerStop.checked)) return;
    state.sessionEndedEarly = true;
    logEvent('learner_stop_requested', {
      question_index: state.currentQuestion ? state.currentQuestion.questionIndex : state.questionIndex
    });
    endSession();
  }

  function applyLearnerPreferences(){
    const mode = ui.communicationSupportChoice.value;
    if(mode === 'spoken'){
      ui.useTextPrompt.checked = true;
      ui.useImagePrompt.checked = false;
      ui.ttsToggle.checked = true;
    } else if(mode === 'spoken-plus-image'){
      ui.useTextPrompt.checked = true;
      ui.useImagePrompt.checked = true;
      ui.ttsToggle.checked = true;
    } else if(mode === 'image-first'){
      ui.useTextPrompt.checked = false;
      ui.useImagePrompt.checked = true;
      ui.ttsToggle.checked = true;
    } else {
      ui.useTextPrompt.checked = true;
      ui.useImagePrompt.checked = true;
      ui.ttsToggle.checked = false;
    }
    applyTheme();
    updateLearnerControls();
    logEvent('preference_check_completed', {
      reward_choice: currentRewardChoice(),
      theme_choice: currentThemeChoice(),
      communication_support_choice: ui.communicationSupportChoice.value,
      pre_session_preference: ui.preSessionPreference.value
    });
    if(ui.preferenceSaveStatus){
      ui.preferenceSaveStatus.textContent = 'Pupil preferences saved on this device and applied to this session.';
    }
    flash('good', 'Preferences saved');
    saveSettingsSoon();
    saveCurrentLearnerProfile();
    refreshDashboard(true);
  }

  function logPreferenceCheck(){
    logEvent('preference_check_logged', {
      reward_choice: currentRewardChoice(),
      theme_choice: currentThemeChoice(),
      communication_support_choice: ui.communicationSupportChoice.value,
      pre_session_preference: ui.preSessionPreference.value
    });
    flash('good', 'Preference logged');
  }

  function beginInterTrialBlank(nextQuestionIndex){
    const durationMs = blankIntervalMs();
    state.questionIndex = nextQuestionIndex;
    state.phase = 'blank';
    showScreen('screenBlank');
    setFooter('', 'Pause');
    logEvent('inter_trial_blank_onset', {
      next_question_index: nextQuestionIndex,
      duration_ms: durationMs
    });
    state.timers.blank = window.setTimeout(() => {
      logEvent('inter_trial_blank_offset', {
        next_question_index: nextQuestionIndex,
        duration_ms: durationMs
      });
      startQuestion();
    }, durationMs);
  }

  function advanceAfterFeedback(){
    clearTimeout(state.timers.reward);
    if(state.questionIndex >= state.totalQuestions || sessionTimedOut()){
      endSession();
      return;
    }
    if(maybePauseAfterCurrentQuestion()) return;
    const nextQuestionIndex = state.questionIndex + 1;
    if(blankIntervalEnabled()){
      beginInterTrialBlank(nextQuestionIndex);
      return;
    }
    state.questionIndex = nextQuestionIndex;
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
      label: ATTENTION_FAMILY_LABELS[key] || key,
      total: byDomain[key].total,
      accuracy_pct: byDomain[key].total ? Math.round((byDomain[key].correct / byDomain[key].total) * 100) : 0,
      omissions: byDomain[key].omissions,
      commissions: byDomain[key].commissions,
      mean_rt_ms: byDomain[key].rt.length ? Math.round(mean(byDomain[key].rt)) : 0,
      rt_sd_ms: byDomain[key].rt.length ? Math.round(standardDeviation(byDomain[key].rt)) : 0
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
      fidelity_score_pct: fidelityScorePct(),
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
      items.push('Keep the first stage simple and meaningful, for example "Find Mum" while any panel touch still counts.');
      return items;
    }
    if(summary.omission_count > 0) items.push('Omissions were recorded, so consider increasing the response window or adding an earlier prompt step.');
    if(summary.commission_count > 0) items.push('Commission-style errors were recorded, so reduce distractor pressure or strengthen the rule cue before progressing.');
    if(summary.rt_cv > 0.35) items.push('Reaction time variability is high, which may indicate unstable attention or regulation across trials.');
    if(summary.prompted_success_count > summary.independent_success_count) items.push('Prompted success currently outweighs independent success, so hold the current level and reduce prompt demands gradually.');
    if(summary.accuracy_pct >= 80 && summary.omission_count === 0) items.push('Accuracy is stable enough to consider moving to the next level or attention family.');
    if(summary.current_level >= 7) items.push('Later Attention Training stages should be interpreted using omission, commission, and RT-variability data rather than a generic attention label.');
    if(fidelityScorePct() < 70) items.push('Fidelity is below 70%, so check the setup, rule display, reward delivery, and prompt plan before interpreting change across sessions.');
    if(eegModeEnabled()) items.push('EEG mode is on, so keep blocks short, note artifacts when they happen, and use the marker export rather than the summary JSON alone.');
    return items;
  }

  function trialRowFromTrial(trial){
    return {
      q: trial.question_index,
      attempt: trial.attempt_index,
      task: trial.variant_label ? `${taskLabel(trial.task_kind)}: ${trial.variant_label}` : taskLabel(trial.task_kind),
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
    const summary = analyticsSummary();
    return {
      session_id: state.sessionId,
      learner: currentPupilName(),
      learner_alias: currentPupilAlias(),
      build: buildExportMeta(),
      schema_version: DATA_SCHEMA_VERSION,
      settings: settingsSnapshot(),
      learner_snapshot: currentLearnerRecord(),
      summary,
      fidelity: fidelitySnapshot(),
      research_condition: researchCondition(),
      eeg_markers: state.eeg.markers.slice(),
      block_summaries: buildBlockSummaries(),
      events: state.logs.slice(),
      trials: state.trials.slice(),
      context_notes: currentContextNotes(),
      classroom_transfer_notes: ui.classroomTransferNotes.value || '',
      theme_used: currentThemeChoice(),
      student_friendly_mode: studentFriendlyModeEnabled(),
      content_configuration: exportableContentConfiguration(),
      local_recommendation_summary: buildLocalRecommendationSummary(summary),
      photo_library_metadata: photoLibraryMetadata(),
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
      rewardChoice: currentRewardChoice(),
      themeChoice: currentThemeChoice(),
      fontChoice: currentFontChoice(),
      textScale: currentTextScale(),
      motionPreference: currentMotionPreference(),
      feedbackSoundMode: currentFeedbackSoundMode(),
      celebrationIntensity: currentCelebrationIntensity(),
      communicationSupportChoice: ui.communicationSupportChoice.value,
      preSessionPreference: ui.preSessionPreference.value,
      breakCount: safeNumber(ui.breakCount.value, 0),
      sleepQuality: ui.sleepQuality.value,
      capTolerance: ui.capTolerance.value,
      maintenanceStatus: ui.maintenanceStatus.value,
      generalisationStatus: ui.generalisationStatus.value,
      classroomTransferNotes: ui.classroomTransferNotes.value.trim(),
      contextNotes: currentContextNotes(),
      coachingReviewNotes: ui.coachingReviewNotes.value.trim(),
      studentFriendlyMode: studentFriendlyModeEnabled()
    };
    learner.alias = currentPupilAlias();
    learner.contentFilters = contentFiltersFromUi();
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
      learner_context: learnerContextSnapshot(),
      fidelity: fidelitySnapshot(),
      research_condition: researchCondition()
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
    ui.aacPreference.value = baseline.aacPreference || SESSION_CONTEXT_DEFAULTS.aacPreference;
    ui.staffMember.value = baseline.staffMember || '';
    ui.fatigueLevel.value = baseline.fatigueLevel || SESSION_CONTEXT_DEFAULTS.fatigueLevel;
    ui.sensoryState.value = baseline.sensoryState || SESSION_CONTEXT_DEFAULTS.sensoryState;
    ui.rewardChoice.value = baseline.rewardChoice || SESSION_CONTEXT_DEFAULTS.rewardChoice;
    ui.themeChoice.value = normalizeThemeChoice(baseline.themeChoice || SESSION_CONTEXT_DEFAULTS.themeChoice);
    if(ui.fontChoice) ui.fontChoice.value = baseline.fontChoice || SESSION_CONTEXT_DEFAULTS.fontChoice;
    if(ui.textScale) ui.textScale.value = String(baseline.textScale || SESSION_CONTEXT_DEFAULTS.textScale);
    if(ui.motionPreference) ui.motionPreference.value = baseline.motionPreference || SESSION_CONTEXT_DEFAULTS.motionPreference;
    if(ui.feedbackSoundMode) ui.feedbackSoundMode.value = baseline.feedbackSoundMode || SESSION_CONTEXT_DEFAULTS.feedbackSoundMode;
    if(ui.celebrationIntensity) ui.celebrationIntensity.value = baseline.celebrationIntensity || SESSION_CONTEXT_DEFAULTS.celebrationIntensity;
    ui.communicationSupportChoice.value = baseline.communicationSupportChoice || SESSION_CONTEXT_DEFAULTS.communicationSupportChoice;
    ui.preSessionPreference.value = baseline.preSessionPreference || SESSION_CONTEXT_DEFAULTS.preSessionPreference;
    ui.breakCount.value = baseline.breakCount || 0;
    ui.sleepQuality.value = baseline.sleepQuality || SESSION_CONTEXT_DEFAULTS.sleepQuality;
    ui.capTolerance.value = baseline.capTolerance || SESSION_CONTEXT_DEFAULTS.capTolerance;
    ui.maintenanceStatus.value = baseline.maintenanceStatus || SESSION_CONTEXT_DEFAULTS.maintenanceStatus;
    ui.generalisationStatus.value = baseline.generalisationStatus || SESSION_CONTEXT_DEFAULTS.generalisationStatus;
    if(ui.contextNotes) ui.contextNotes.value = baseline.contextNotes || '';
    ui.coachingReviewNotes.value = baseline.coachingReviewNotes || '';
    ui.classroomTransferNotes.value = baseline.classroomTransferNotes || '';
    renderCategoryControls(learner.contentFilters || normalizeContentFilters());
    applyTheme();
    applySensoryPreferences();
  }

  function selectPupil(name, options={}){
    const learner = normalizeLearner(name, state.learners[name] || buildDefaultLearner(name));
    state.learners[name] = learner;
    state.currentPupil = learner;
    state.currentPupilName = learner.name;
    state.selectedPhotoIds.clear();
    ui.pupilSelect.value = learner.name;
    ui.pupilAlias.value = learner.alias || learner.name;
    applyLearnerFields(learner);
    renderPhotoLibrary();
    refreshContentConfiguration();
    saveLearners();
    saveSettingsSoon();
    if(options.speakGreeting) speak(`Hello ${learner.name}`);
    updateSessionReadiness();
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
    if(ui.starBadge) ui.starBadge.textContent = `${rewardSymbol()} ${state.stars}`;
    if(ui.levelBadge) ui.levelBadge.textContent = `Level ${state.currentLevel}`;
    updateCurrentLevelDescription();
    updateSessionReadiness();
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
    ctx.fillStyle = themeToken('surface-raised', '#ffffff');
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    if(!group){
      ui.heatmapMeta.textContent = 'No heat map data available yet.';
      return;
    }
    group.trials.forEach(trial => {
      if(!Number.isFinite(trial.pointer_play_x) || !Number.isFinite(trial.pointer_play_y)) return;
      const x = clamp(trial.pointer_play_x / Math.max(ui.playArea.clientWidth || 1, 1) * canvas.width, 0, canvas.width);
      const y = clamp(trial.pointer_play_y / Math.max(ui.playArea.clientHeight || 1, 1) * canvas.height, 0, canvas.height);
      const color = trial.correct
        ? colourWithAlpha(themeToken('success', STIMULUS_COLOR_FALLBACKS.green), 0.55)
        : trial.omission
          ? colourWithAlpha(themeToken('warning', STIMULUS_COLOR_FALLBACKS.amber), 0.45)
          : colourWithAlpha(themeToken('danger', STIMULUS_COLOR_FALLBACKS.red), 0.55);
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
    ctx.fillStyle = themeToken('surface-raised', '#ffffff');
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    if(!values.length){
      ctx.fillStyle = themeToken('text-muted', '#52656d');
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

  function redrawThemeVisuals(){
    if(ui.trailCanvas) drawTrail();
    if(ui.heatmapCanvas && ui.heatmapQuestionSelect) renderHeatmap();
    if(ui.rtChart && ui.distChart){
      const finalTrials = latestTrialsByQuestion(state.trials);
      const rtValues = finalTrials.map(trial => trial.response_time_ms).filter(Number.isFinite);
      const distValues = finalTrials.map(trial => trial.distance_to_target_px).filter(Number.isFinite);
      drawMiniChart(ui.rtChart, rtValues, themeToken('primary', STIMULUS_COLOR_FALLBACKS.blue));
      drawMiniChart(ui.distChart, distValues, themeToken('warning', STIMULUS_COLOR_FALLBACKS.amber));
    }
  }

  function renderDashboard(){
    const summary = analyticsSummary();
    const finalTrials = latestTrialsByQuestion(state.trials);
    const rows = finalTrials.map(trialRowFromTrial);
    const blocks = buildBlockSummaries();
    const artifacts = artifactEvents();
    if(ui.dashLearner) ui.dashLearner.textContent = currentPupilName() === 'Unknown' ? 'Not set' : currentPupilName();
    if(ui.dashQuestions) ui.dashQuestions.textContent = String(state.totalQuestions);
    if(ui.dashPrompt) ui.dashPrompt.textContent = `${ui.useTwoStage.checked ? '2-stage' : '1-stage'} / ${currentPromptModeLabel()}`;
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
    if(ui.dashAttentionCall) ui.dashAttentionCall.textContent = 'Exploratory only - use family rows below';
    if(ui.dashCurrentLevel) ui.dashCurrentLevel.textContent = String(summary.current_level);
    if(ui.dashNextRule) ui.dashNextRule.textContent = 'Accuracy + omissions + commissions';
    if(ui.dashResearchCondition) ui.dashResearchCondition.textContent = RESEARCH_CONDITION_LABELS[researchCondition()] || researchCondition();
    if(ui.dashEegMode) ui.dashEegMode.textContent = eegModeEnabled() ? `On (${eegBlockSize()} per block)` : 'Off';
    if(ui.dashBlockCount) ui.dashBlockCount.textContent = String(blocks.length);
    if(ui.dashArtifactCount) ui.dashArtifactCount.textContent = String(artifacts.length);
    if(ui.eegCurrentBlock) ui.eegCurrentBlock.textContent = String(currentBlockIndex());
    if(ui.eegMarkerCount) ui.eegMarkerCount.textContent = String(state.eeg.markers.length);
    const currentBlock = currentBlockSummary();
    if(ui.artifactBlockCount) ui.artifactBlockCount.textContent = String(currentBlock.artifact_count || 0);
    if(ui.artifactQualityScore) ui.artifactQualityScore.textContent = `${currentBlock.quality_score || 100}%`;
    if(ui.fidelityScore) ui.fidelityScore.textContent = `${fidelityScorePct()}%`;
    if(ui.dosageMinutesActual) ui.dosageMinutesActual.textContent = `${dosageMinutesActual()} mins`;

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
    drawMiniChart(ui.rtChart, rtValues, themeToken('primary', STIMULUS_COLOR_FALLBACKS.blue));
    drawMiniChart(ui.distChart, distValues, themeToken('warning', STIMULUS_COLOR_FALLBACKS.amber));

    clearNode(ui.familySummaryBody);
    const familyRows = summary.domain_summaries && summary.domain_summaries.length
      ? summary.domain_summaries
      : [];
    if(!familyRows.length){
      const tr = document.createElement('tr');
      tr.innerHTML = '<td colspan="7" class="tiny">No family-specific data yet.</td>';
      ui.familySummaryBody.appendChild(tr);
    } else {
      familyRows.forEach(item => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td>${item.label || ATTENTION_FAMILY_LABELS[item.domain] || item.domain}</td>
          <td>${item.total}</td>
          <td>${item.accuracy_pct}%</td>
          <td>${item.omissions}</td>
          <td>${item.commissions}</td>
          <td>${item.mean_rt_ms || 0} ms</td>
          <td>${item.rt_sd_ms || 0} ms</td>
        `;
        ui.familySummaryBody.appendChild(tr);
      });
    }

    clearNode(ui.blockSummaryBody);
    if(!blocks.length){
      const tr = document.createElement('tr');
      tr.innerHTML = '<td colspan="6" class="tiny">No completed blocks yet.</td>';
      ui.blockSummaryBody.appendChild(tr);
    } else {
      blocks.forEach(block => {
        const artifactLabel = Object.keys(block.artifact_counts || {}).length
          ? Object.entries(block.artifact_counts).map(([key, count]) => `${ARTIFACT_TYPES[key] ? ARTIFACT_TYPES[key].label : key} x${count}`).join(', ')
          : 'None';
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td>${block.block_index} (${block.trial_range})</td>
          <td>${block.trial_count}</td>
          <td>${artifactLabel}</td>
          <td>${block.quality_score}%</td>
          <td>${RESEARCH_CONDITION_LABELS[block.research_condition] || block.research_condition}</td>
          <td>${block.accuracy_pct}% accuracy, ${block.omission_count} omissions, ${block.commission_count} commissions</td>
        `;
        ui.blockSummaryBody.appendChild(tr);
      });
    }

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
    if(state.currentLevel >= 10 && summary.accuracy_pct >= 80) return 'Level 10 complete. The learner is already at the final Attention Training stage.';
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
    clearTimeout(state.timers.blank);
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
    ui.summaryText.textContent = studentFriendlyModeEnabled()
      ? (advanced ? `Great work. You are ready for Level ${state.currentLevel}.` : 'Great work. This session is complete.')
      : `${summary.correct} correct, ${summary.incorrect} incorrect, ${summary.accuracy_pct}% accuracy, ${summary.omission_count} omissions, ${summary.commission_count} commissions, mean RT ${summary.mean_rt_ms || 0} ms, RT variability ${summary.rt_sd_ms || 0} ms. ${describeLevelOutcome(summary, advanced, false)} Fidelity ${fidelityScorePct()}%. ${state.sessionEndedEarly ? 'The session was stopped early.' : ''}`;
    showScreen('screenSummary');
    setFooter(advanced ? `Session complete. Ready for Level ${state.currentLevel}.` : 'Session complete. Export or start again.', advanced ? 'Next level' : 'Complete');
    logEvent('session_complete', { summary, next_level: state.currentLevel, progressed_level: advanced });
    pushEegMarker('session_complete', {
      response_type: state.sessionEndedEarly ? 'stopped-early' : 'completed',
      correct: summary.correct,
      omission: summary.omission_count,
      commission: summary.commission_count
    });
    playSoundCue('complete', {
      response_type: state.sessionEndedEarly ? 'stopped-early' : 'completed',
      correct: summary.correct
    });
    refreshDashboard(true);
  }

  function resetSession(){
    clearTimeout(state.timers.preview);
    clearTimeout(state.timers.response);
    clearTimeout(state.timers.reward);
    clearTimeout(state.timers.blank);
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
    state.sessionContentConfig = null;
    state.questionLayouts = {};
    state.stars = 0;
    state.importedDashboard = null;
    state.currentLevel = clamp(safeNumber(ui.startLevel.value, 1), 1, 10);
    state.totalQuestions = clamp(safeNumber(ui.sessionMax.value, 8), 1, 20);
    state.sessionTaskType = ui.sessionTaskType.value === 'auto' ? 'auto' : ui.sessionTaskType.value;
    state.singleTargetRepetitions = clamp(safeNumber(ui.singleTargetReps.value, 3), 1, 10);
    state.sessionEndedEarly = false;
    state.blockPause = null;
    state.eeg.markers = [];
    clearBreakCountdown();
    if(ui.sid) ui.sid.textContent = state.sessionId.slice(0, 8);
    if(ui.evCount) ui.evCount.textContent = '0';
    if(ui.summaryRestart) ui.summaryRestart.textContent = 'Start Again';
    createProgressTrack();
    clearTrail();
    showScreen('screenWelcome');
    setFooter('Tap Play to begin.', 'Ready');
    updateStats();
    refreshHistoryManager();
  }

  function startSession(){
    if(ui.pupilSelect && ui.pupilSelect.value && ui.pupilSelect.value !== currentPupilName()){
      selectPupil(ui.pupilSelect.value, { speakGreeting: false });
    }
    const contentValidation = validateSessionContentSetup();
    if(!contentValidation.valid){
      if(ui.sessionSetupStatus){
        ui.sessionSetupStatus.hidden = false;
        ui.sessionSetupStatus.classList.add('invalid');
        ui.sessionSetupStatus.textContent = contentValidation.problems.join(' ');
      }
      openTeacherPanel();
      applyTeacherPage('today', { scroll: true });
      flash('try', 'Check session content');
      return;
    }
    if(ui.sessionSetupStatus){
      ui.sessionSetupStatus.hidden = true;
      ui.sessionSetupStatus.classList.remove('invalid');
      ui.sessionSetupStatus.textContent = '';
    }
    clearTimeout(state.timers.preview);
    clearTimeout(state.timers.response);
    clearTimeout(state.timers.reward);
    clearTimeout(state.timers.blank);
    clearTimeout(state.timers.session);
    state.sessionId = uuid4();
    state.logs = [];
    state.trials = [];
    state.sessionTarget = null;
    state.sessionContentConfig = contentValidation.snapshot;
    state.questionLayouts = {};
    state.questionIndex = 1;
    state.attemptIndex = 0;
    state.phase = 'running';
    state.sessionStartMs = wallMs();
    state.totalQuestions = clamp(safeNumber(ui.sessionMax.value, 8), 1, 20);
    state.currentLevel = clamp(safeNumber(ui.startLevel.value, 1), 1, 10);
    state.sessionTaskType = ui.sessionTaskType.value === 'auto' ? 'auto' : ui.sessionTaskType.value;
    state.singleTargetRepetitions = clamp(safeNumber(ui.singleTargetReps.value, 3), 1, 10);
    state.sessionEndedEarly = false;
    state.blockPause = null;
    state.eeg.markers = [];
    clearBreakCountdown();
    saveCurrentLearnerProfile();
    if(ui.sid) ui.sid.textContent = state.sessionId.slice(0, 8);
    createProgressTrack();
    logEvent('session_start', {
      total_questions: state.totalQuestions,
      task_type: state.sessionTaskType,
      current_level: state.currentLevel,
      response_window_ms: responseWindowMs(),
      inter_trial_interval_ms: interTrialDelayMs(),
      blank_interval_enabled: blankIntervalEnabled(),
      blank_interval_ms: blankIntervalEnabled() ? blankIntervalMs() : 0,
      learner_context: learnerContextSnapshot(),
      learner_baseline: learnerBaselineSnapshot(),
      fidelity: fidelitySnapshot(),
      research_condition: researchCondition(),
      eeg_mode: eegModeEnabled(),
      content_configuration: exportableContentConfiguration()
    });
    pushEegMarker('session_start', {
      research_condition: researchCondition(),
      task_kind: state.sessionTaskType,
      attention_domain: selectedSessionTaskMode()
    });
    state.timers.session = window.setTimeout(() => {
      flash('try', 'Session time reached');
      endSession();
    }, safeNumber(ui.sessionMinutes.value, 3) * 60 * 1000);
    if(ui.preSessionPreference.value === 'needs-break'){
      beginBreak('pre-session-regulation', {
        mode: 'next-question',
        nextQuestionIndex: 1,
        autoResumeMs: 0,
        incrementBreakCount: true
      });
      updateStats();
      return;
    }
    startQuestion();
    updateStats();
  }

  async function exportLogs(){
    await persistCurrentSession();
    const summary = analyticsSummary();
    const payload = {
      app: APP_BUILD.app,
      build: buildExportMeta(),
      schema_version: DATA_SCHEMA_VERSION,
      exported_at_wall_ms: wallMs(),
      session_id: state.sessionId,
      pupil: currentPupilName(),
      pupil_alias: currentPupilAlias(),
      session_overview: {
        pupil_alias: currentPupilAlias(),
        exported_date: schoolTimestampParts().date,
        exported_time: schoolTimestampParts().time,
        level: state.currentLevel,
        task_type: selectedSessionTaskMode(),
        accuracy_pct: summary.accuracy_pct,
        mean_reaction_time_ms: summary.mean_rt_ms || null,
        mean_touch_distance_px: summary.mean_touch_distance_px == null ? null : Number(summary.mean_touch_distance_px.toFixed(1)),
        context_notes: currentContextNotes(),
        theme_used: currentThemeChoice(),
        sensory_preferences: sensoryPreferenceSnapshot(),
        student_friendly_mode: studentFriendlyModeEnabled(),
        blank_interval_enabled: blankIntervalEnabled(),
        blank_interval_ms: blankIntervalEnabled() ? blankIntervalMs() : 0,
        support_level: state.promptState.highestLevel,
        build_version: APP_BUILD.version
      },
      learner_profile: currentLearnerRecord(),
      summary,
      fidelity: fidelitySnapshot(),
      research_condition: researchCondition(),
      eeg_mode: eegModeEnabled(),
      context_notes: currentContextNotes(),
      theme_used: currentThemeChoice(),
      sensory_preferences: sensoryPreferenceSnapshot(),
      student_friendly_mode: studentFriendlyModeEnabled(),
      content_configuration: exportableContentConfiguration(),
      blank_interval_enabled: blankIntervalEnabled(),
      blank_interval_ms: blankIntervalEnabled() ? blankIntervalMs() : 0,
      photo_library_metadata: photoLibraryMetadata(),
      local_recommendation_summary: buildLocalRecommendationSummary(summary),
      eeg_marker_code_map: EEG_EVENT_CODES,
      eeg_markers: state.eeg.markers.slice(),
      block_summaries: buildBlockSummaries(),
      artifact_summary: artifactEvents(),
      marker_tsv: markerTsv(state.eeg.markers),
      trials: state.trials.slice(),
      events: state.logs.slice()
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    triggerBlobDownload(blob, schoolExportFilename('session', 'json'));
    logEvent('logs_exported', { export_bytes: JSON.stringify(payload).length });
  }

  async function exportEegMarkers(){
    await persistCurrentSession();
    const markers = state.eeg.markers.slice();
    const baseName = schoolExportFilename('eeg', 'tmp').replace(/\.tmp$/, '');
    const format = ui.eegExportFormat ? ui.eegExportFormat.value : 'tsv';
    const researchPayload = {
      app: APP_BUILD.app,
      build: buildExportMeta(),
      session_id: state.sessionId,
      learner: currentPupilName(),
      research_condition: researchCondition(),
      eeg_mode: eegModeEnabled(),
      sensory_preferences: sensoryPreferenceSnapshot(),
      fidelity: fidelitySnapshot(),
      eeg_marker_code_map: EEG_EVENT_CODES,
      markers,
      blocks: buildBlockSummaries(),
      artifacts: artifactEvents(),
      trials: state.trials.slice()
    };
    if(format === 'json' || format === 'both'){
      const blob = new Blob([JSON.stringify(researchPayload, null, 2)], { type: 'application/json' });
      triggerBlobDownload(blob, `${baseName}.json`);
    }
    if(format === 'tsv' || format === 'both'){
      const blob = new Blob([markerTsv(markers)], { type: 'text/tab-separated-values' });
      triggerBlobDownload(blob, `${baseName}.tsv`);
    }
    logEvent('eeg_markers_exported', {
      export_format: format,
      marker_count: markers.length
    });
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
      showRipple(
        playPoint.x,
        playPoint.y,
        pointerType === 'touch'
          ? themeToken('success', STIMULUS_COLOR_FALLBACKS.green)
          : themeToken('focus', STIMULUS_COLOR_FALLBACKS.blue)
      );
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
    bindAction(ui.exportEegBtn, exportEegMarkers);
    bindAction(ui.summaryRestart, startSession);
    bindAction(ui.repeatBtn, repeatQuestion);
    bindAction(ui.rewardRepeat, repeatQuestion);
    bindAction(ui.rewardNext, advanceAfterFeedback);
    bindAction(ui.continueFromBreak, () => resumeFromBreak('continue'));
    bindAction(ui.breakRepeatQuestion, () => resumeFromBreak('repeat'));
    bindAction(ui.nextBtn, () => {
      if(state.phase === 'reward' || state.phase === 'feedback') advanceAfterFeedback();
      else if(state.phase === 'choice') finalizeTimeoutTrial(state.currentQuestion);
    });
    bindAction(ui.fullscreenBtn, async () => {
      if(getFullscreenElement()) await exitAppFullscreen();
      else await requestAppFullscreen();
      updateFullscreenButton();
    });
    bindAction(ui.quickStartSessionBtn, () => {
      applyViewMode('learner');
      startSession();
    });
    bindAction(ui.learnerModeBtn, () => applyViewMode('learner'));
    bindAction(ui.adminModeFab, openAdminPanel);
    bindAction(ui.teacherPanelTab, openTeacherPanel);
    bindAction(ui.adminPanelTab, openAdminPanel);
    bindAction(ui.adminNavOverview, () => applyAdminPage('overview', { scroll: true }));
    bindAction(ui.adminNavSessions, () => applyAdminPage('sessions', { scroll: true }));
    bindAction(ui.adminNavLearners, () => applyAdminPage('learners', { scroll: true }));
    bindAction(ui.adminNavEeg, () => applyAdminPage('eeg', { scroll: true }));
    bindAction(ui.adminNavSystem, () => applyAdminPage('system', { scroll: true }));
    bindAction(ui.teacherNavToday, () => {
      openTeacherPanel();
      applyTeacherPage('today', { scroll: true });
    });
    bindAction(ui.teacherNavPersonalise, () => {
      openTeacherPanel();
      applyTeacherPage('personalise', { scroll: true });
    });
    bindAction(ui.teacherNavResults, () => {
      openTeacherPanel();
      applyTeacherPage('results', { scroll: true });
    });
    bindAction(ui.soundPreviewBtn, () => playSoundCue('preview', { source: 'teacher-preview' }));
    bindAction(ui.adminExportSessionBtn, exportLogs);
    bindAction(ui.adminExportResearchBtn, exportEegMarkers);
    bindAction(ui.adminExportHistoryBtn, exportStoredHistory);
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
    bindAction(ui.applyPreferencesBtn, applyLearnerPreferences);
    bindAction(ui.logPreferenceCheckBtn, logPreferenceCheck);
    bindAction(ui.addPhotoBtn, addPhotoToLibrary);
    bindAction(ui.createCategoryBtn, createCustomCategory);
    bindAction(ui.bulkMoveBtn, moveSelectedPhotos);
    bindAction(ui.selectAllPhotosBtn, () => {
      currentPupilPhotos().forEach(item => state.selectedPhotoIds.add(item.id));
      renderPhotoLibrary();
    });
    bindAction(ui.clearPhotoSelectionBtn, () => {
      state.selectedPhotoIds.clear();
      renderPhotoLibrary();
    });
    bindAction(ui.imageEditorClose, closeImageEditor);
    bindAction(ui.imageEditorCancel, closeImageEditor);
    bindAction(ui.imageEditorReset, () => {
      updateImageEditorControls(normalizePhotoEdit());
      updateImageEditorPreview();
    });
    bindAction(ui.imageEditorApply, applyImageEditor);
    bindAction(ui.refreshHistoryBtn, () => refreshStoredHistory());
    bindAction(ui.exportHistoryBtn, exportStoredHistory);
    bindAction(ui.archiveLearnerHistoryBtn, archiveCurrentLearnerHistory);
    bindAction(ui.pruneArchivedHistoryBtn, pruneArchivedHistory);
    bindAction(ui.learnerHelpBtn, requestLearnerHelp);
    bindAction(ui.learnerBreakBtn, requestLearnerBreak);
    bindAction(ui.learnerStopBtn, requestLearnerStop);
    bindAction(ui.artifactMovementBtn, () => logArtifact('movement'));
    bindAction(ui.artifactBlinkBtn, () => logArtifact('blink'));
    bindAction(ui.artifactSpeechBtn, () => logArtifact('speech'));
    bindAction(ui.artifactCapBtn, () => logArtifact('cap-adjust'));
    bindAction(ui.artifactInterruptBtn, () => logArtifact('interruption'));

    bindAction(ui.promptIndependentBtn, () => markPromptLevel(0, 'none'));
    bindAction(ui.promptCueBtn, () => markPromptLevel(1, 'verbal'));
    bindAction(ui.promptVerbalBtn, () => markPromptLevel(2, 'verbal'));
    bindAction(ui.promptVisualBtn, () => markPromptLevel(3, 'visual'));
    bindAction(ui.promptModelBtn, () => markPromptLevel(4, 'model'));
    bindAction(ui.promptFullSupportBtn, () => markPromptLevel(5, 'physical'));

    if(ui.teacherExitHold){
      const cancelTeacherExit = () => {
        clearTimeout(state.timers.teacherExit);
        state.timers.teacherExit = null;
        ui.teacherExitHold.classList.remove('is-holding');
      };
      const beginTeacherExit = event => {
        if(event && event.button != null && event.button !== 0) return;
        cancelTeacherExit();
        ui.teacherExitHold.classList.add('is-holding');
        state.timers.teacherExit = window.setTimeout(() => {
          cancelTeacherExit();
          openTeacherPanel();
          flash('good', 'Teacher workspace');
        }, 1200);
      };
      ui.teacherExitHold.addEventListener('pointerdown', beginTeacherExit);
      ui.teacherExitHold.addEventListener('pointerup', cancelTeacherExit);
      ui.teacherExitHold.addEventListener('pointercancel', cancelTeacherExit);
      ui.teacherExitHold.addEventListener('pointerleave', cancelTeacherExit);
      ui.teacherExitHold.addEventListener('click', event => {
        if(event.detail === 0) openTeacherPanel();
      });
    }

    document.addEventListener('pointerdown', () => {
      if(!state.sound.unlocked) ensureAudioContext();
    }, { passive: true });

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
        event.target.value = '';
      });
    }
    [ui.findObjectSourceMode, ui.findCategorySourceMode].forEach(node => {
      if(!node) return;
      node.addEventListener('change', () => {
        if(state.currentPupil) state.currentPupil.contentFilters = contentFiltersFromUi();
        saveSettingsSoon();
        saveCurrentLearnerProfile();
        refreshContentConfiguration();
      });
    });
    [ui.imageEditorSquare, ui.imageEditorZoom, ui.imageEditorFocusX, ui.imageEditorFocusY, ui.imageEditorRotation].forEach(node => {
      if(!node) return;
      node.addEventListener('input', updateImageEditorPreview);
      node.addEventListener('change', updateImageEditorPreview);
    });
    if(ui.imageEditor){
      ui.imageEditor.addEventListener('click', event => {
        if(event.target === ui.imageEditor) closeImageEditor();
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
      'useFace', 'ttsToggle', 'ttsLabelsToggle', 'studentFriendlyMode', 'autoAdvance', 'trackTrail', 'performanceMode',
      'liveDashboardDuringLearner', 'singleTargetStart', 'autoLevelPath', 'singleTargetReps', 'sessionTaskType',
      'moveSampleMs', 'dashboardRefreshMs', 'responseWindowSec', 'itiSec', 'useBlankInterval', 'blankIntervalSec',
      'eegResearchMode', 'autoBlockPauses',
      'allowLearnerHelp', 'allowLearnerBreak', 'allowLearnerStop', 'activeControlEnabled', 'eegBlockSize',
      'eegAutoPauseSec', 'researchCondition', 'eegExportFormat', 'faceName', 'contextNotes', 'rewardChoice',
      'themeChoice', 'fontChoice', 'textScale', 'motionPreference', 'feedbackSoundMode', 'celebrationIntensity',
      'communicationSupportChoice', 'preSessionPreference',
      'communicationMode', 'motorAccessMode', 'adaptiveFunctioningBand', 'teacherAttentionRating',
      'teacherIndependenceRating', 'eegParticipation', 'aacPreference', 'staffMember', 'fatigueLevel', 'sensoryState',
      'sleepQuality', 'capTolerance', 'breakCount', 'maintenanceStatus', 'generalisationStatus',
      'classroomTransferNotes', 'dosageMinutesTarget', 'dosageSessionsPerWeek', 'fidelityEnvironmentReady',
      'fidelityRuleShown', 'fidelityPromptPlan', 'fidelityBreaksOffered', 'fidelityRewardDelivered',
      'fidelityDataChecked', 'coachingReviewNotes', 'findObjectSourceMode', 'findCategorySourceMode'
    ];
    settingsInputs.forEach(id => {
      if(!ui[id]) return;
      const handler = () => {
        saveSettingsSoon();
        saveCurrentLearnerProfile();
        if(id === 'activeControlEnabled' && ui.researchCondition){
          ui.researchCondition.value = ui.activeControlEnabled.checked ? 'active-control' : 'training';
        }
        if(id === 'themeChoice' || id === 'rewardChoice') applyTheme();
        if(['fontChoice', 'textScale', 'motionPreference', 'feedbackSoundMode', 'celebrationIntensity'].includes(id)) applySensoryPreferences();
        if(id === 'studentFriendlyMode') applyStudentFriendlyMode();
        if(id === 'allowLearnerHelp' || id === 'allowLearnerBreak' || id === 'allowLearnerStop') updateLearnerControls();
        if(['sessionTaskType', 'startLevel', 'autoLevelPath', 'maxObjects', 'findObjectSourceMode', 'findCategorySourceMode'].includes(id)) refreshContentConfiguration();
        updateStats();
        updateSessionReadiness();
      };
      ui[id].addEventListener('change', handler);
      ui[id].addEventListener('input', handler);
    });

    if('PointerEvent' in window){
      ui.playArea.addEventListener('pointerdown', event => {
        state.lastPointerType = event.pointerType || 'mouse';
        state.isTouchDevice = state.isTouchDevice || state.lastPointerType === 'touch';
        handlePointerPosition(event.clientX, event.clientY, 'down', state.lastPointerType);
      });
      ui.playArea.addEventListener('pointermove', event => {
        handlePointerPosition(event.clientX, event.clientY, 'move', event.pointerType || state.lastPointerType);
      });
      ui.playArea.addEventListener('pointerup', event => {
        handlePointerPosition(event.clientX, event.clientY, 'up', event.pointerType || state.lastPointerType);
      });
    } else {
      ui.playArea.addEventListener('mousedown', event => {
        state.lastPointerType = 'mouse';
        handlePointerPosition(event.clientX, event.clientY, 'down', 'mouse');
      });
      ui.playArea.addEventListener('mousemove', event => {
        handlePointerPosition(event.clientX, event.clientY, 'move', 'mouse');
      });
      ui.playArea.addEventListener('mouseup', event => {
        handlePointerPosition(event.clientX, event.clientY, 'up', 'mouse');
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
    }
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
    await migrateLocalDataSchema();
    await refreshStoredHistory();
    renderPhotoLibrary();
    refreshContentConfiguration();
  }

  function initialSetup(){
    const persistedSettings = readJson(SETTINGS_KEY) || LEGACY_SETTINGS_KEYS.map(readJson).find(Boolean) || {};
    applyBuildInfo();
    loadSettings();
    applyTheme();
    applySensoryPreferences();
    applyStudentFriendlyMode();
    applyPanelView('teacher');
    applyTeacherPage('today');
    loadPupilList(persistedSettings.selectedPupil || '');
    applyViewMode(state.viewMode || 'desktop', false);
    updateLearnerControls();
    updateFullscreenButton();
    attachEventHandlers();
    initialiseImportedDashboardHandling();
    resizeCanvas();
    resetSession();
    updateStats();
    updateSessionReadiness();
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
