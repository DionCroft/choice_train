(() => {
  const APP_BUILD = Object.freeze({
    app: "ChoiceTrain for ShowMe",
    version: "1.8.0-alpha",
    release_label: "V1.8.0-alpha",
    channel: "experimental",
    source_file: "choice_train_V1.8.0-alpha.html",
    source_script: "choice_train_V1.8.0-alpha.js",
    based_on_branch: "feature/v1.8.0-research-personalisation",
    based_on_commit: "c24156c",
    build_date: "2026-11-07",
    published_entry: "not published; V1.7.0 remains live",
    live_url: "https://dioncroft.github.io/choice_train/",
    repo_url: "https://github.com/DionCroft/choice_train"
  });

  const SETTINGS_KEY = 'choice_train_settings_v140';
  const LEARNERS_KEY = 'choice_train_learners_v140';
  const FIXED_CONDITIONS_KEY = 'choice_train_fixed_conditions_v180';
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
  const LOCAL_DATA_MIGRATION_VERSION = 5;
  const DATA_SCHEMA_VERSION = 7;
  const SKILL_GRAPH_VERSION = '1.2.0';
  const GENERATOR_VERSION = '1.4.0';
  const RESEARCH_SUMMARY_VERSION = '1.0.0';
  const PRACTICE_STATUS_VERSION = '1.0.0';
  const RECOMMENDATION_VERSION = '1.0.0';
  const EEG_PROTOCOL_VERSION = '1.1.0';
  const FIXED_CONDITION_SCHEMA_VERSION = '1.0.0';
  const RESEARCH_WORKSPACE_EXPORT_VERSION = '1.3.0';
  const PRIVACY_EXPORT_VERSION = '1.0.0';
  const GOVERNANCE_SCHEMA_VERSION = '1.0.0';
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
  const EEG_PLANNED_MARKER_SET = Object.freeze([
    'session_start', 'prompt_onset', 'cue_onset', 'stimulus_onset', 'target_present', 'no_go',
    'response', 'omission', 'commission', 'feedback_onset', 'prompt_onset_support',
    'break_onset', 'break_offset', 'artifact', 'session_complete'
  ]);
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
    'match-category': { label: 'Match category', family: 'foundation', domain: 'reasoning' },
    'category-exclusion': { label: 'Find the different one', family: 'foundation', domain: 'reasoning' },
    'choice-preference': { label: 'Choice preference', family: 'foundation', domain: 'choice' },
    'cpat-suite': { label: 'AT suite', family: 'cpat', domain: 'mixed' },
    'cpat-sustained': { label: 'AT sustained attention', family: 'cpat', domain: 'sustained' },
    'cpat-selective': { label: 'AT selective-spatial', family: 'cpat', domain: 'selective-spatial' },
    'cpat-orienting': { label: 'AT orienting', family: 'cpat', domain: 'orienting' },
    'cpat-executive': { label: 'AT executive control', family: 'cpat', domain: 'executive' }
  };

  const SKILL_GRAPH = Object.freeze({
    'access.touch_screen': Object.freeze({ label: 'Initiate a screen touch', prerequisites: [] }),
    'access.touch_target': Object.freeze({ label: 'Select a pictured target', prerequisites: ['access.touch_screen'] }),
    'access.track_target': Object.freeze({ label: 'Track and select a moving target', prerequisites: ['access.touch_target'] }),
    'recognition.named_object': Object.freeze({ label: 'Find a named object', prerequisites: ['access.touch_target'] }),
    'discrimination.named_object': Object.freeze({ label: 'Discriminate a named object', prerequisites: ['recognition.named_object'] }),
    'categorisation.category_member': Object.freeze({ label: 'Select a category member', prerequisites: ['discrimination.named_object'] }),
    'categorisation.match_category': Object.freeze({ label: 'Match different members of a category', prerequisites: ['categorisation.category_member'] }),
    'categorisation.category_exclusion': Object.freeze({ label: 'Select an item outside a reference category', prerequisites: ['categorisation.category_member'] }),
    'choice.preference': Object.freeze({ label: 'Express a preference', prerequisites: ['access.touch_target'] }),
    'attention.sustained': Object.freeze({ label: 'Sustained attention practice', prerequisites: ['access.touch_target'] }),
    'attention.selective_spatial': Object.freeze({ label: 'Selective-spatial attention practice', prerequisites: ['attention.sustained'] }),
    'attention.orienting': Object.freeze({ label: 'Orienting attention practice', prerequisites: ['attention.sustained'] }),
    'attention.executive': Object.freeze({ label: 'Executive attention practice', prerequisites: ['attention.selective_spatial'] })
  });

  const TASK_SKILL_IDS = Object.freeze({
    'touch-screen': Object.freeze(['access.touch_screen']),
    'touch-object': Object.freeze(['access.touch_target']),
    'moving-target': Object.freeze(['access.track_target']),
    'find-object': Object.freeze(['recognition.named_object']),
    'discriminate-object': Object.freeze(['discrimination.named_object']),
    'find-category': Object.freeze(['categorisation.category_member']),
    'match-category': Object.freeze(['categorisation.match_category']),
    'category-exclusion': Object.freeze(['categorisation.category_exclusion']),
    'choice-preference': Object.freeze(['choice.preference']),
    'cpat-suite': Object.freeze(['attention.sustained', 'attention.selective_spatial', 'attention.orienting', 'attention.executive']),
    'cpat-sustained': Object.freeze(['attention.sustained']),
    'cpat-selective': Object.freeze(['attention.selective_spatial']),
    'cpat-orienting': Object.freeze(['attention.orienting']),
    'cpat-executive': Object.freeze(['attention.executive'])
  });

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
    dataUseStatus: 'not-recorded',
    researchAnalysisApproved: false,
    eegLinkageApproved: false,
    modelDevelopmentApproved: false,
    governanceReference: '',
    governanceReviewDate: '',
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
    family: { label: 'Family', objectCategory: 'family', promptFind: 'a family member', promptPredicate: 'family', promptMatch: 'another family member' },
    people: { label: 'People', objectCategory: 'people', promptFind: 'a person', promptPredicate: 'a person', promptMatch: 'another person' },
    animals: { label: 'Animals', objectCategory: 'animals', promptFind: 'an animal', promptPredicate: 'an animal', promptMatch: 'another animal' },
    transport: { label: 'Transport', objectCategory: 'transport', promptFind: 'transport', promptPredicate: 'transport', promptMatch: 'another vehicle' },
    food: { label: 'Food', objectCategory: 'food', promptFind: 'food', promptPredicate: 'food', promptMatch: 'another food item' },
    fruit: { label: 'Fruit', objectCategory: 'fruit', promptFind: 'fruit', promptPredicate: 'fruit', promptMatch: 'another fruit' },
    'symbols-shapes': { label: 'Symbols / Shapes', objectCategory: 'symbols-shapes', promptFind: 'a symbol or shape', promptPredicate: 'a symbol or shape', promptMatch: 'another symbol or shape' },
    toy: { label: 'Toys', objectCategory: 'toy', promptFind: 'a toy', promptPredicate: 'a toy', promptMatch: 'another toy' },
    classroom: { label: 'Classroom objects', objectCategory: 'classroom', promptFind: 'a classroom object', promptPredicate: 'a classroom object', promptMatch: 'another classroom object' },
    activity: { label: 'Activities', objectCategory: 'activity', promptFind: 'an activity', promptPredicate: 'an activity', promptMatch: 'another activity' },
    custom: { label: 'Legacy Custom', objectCategory: 'custom', promptFind: 'a custom item', promptPredicate: 'a custom item', promptMatch: 'another custom item' }
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
    sessionSnapshot: null,
    lessonPlanId: null,
    lessonPlan: null,
    lessonSeed: null,
    lessonSeedSource: null,
    activeRecommendation: null,
    sessionStartMs: 0,
    sessionEndMs: 0,
    sessionEndReason: '',
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
      currentTouchPoint: null,
      questionRandom: null
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

  function hashStringToSeed(value){
    let hash = 2166136261;
    const text = String(value || '');
    for(let index = 0; index < text.length; index += 1){
      hash ^= text.charCodeAt(index);
      hash = Math.imul(hash, 16777619);
    }
    return (hash >>> 0) || 1;
  }

  function canonicalJson(value){
    if(Array.isArray(value)) return value.map(canonicalJson);
    if(value && typeof value === 'object'){
      return Object.keys(value).sort().reduce((result, key) => {
        result[key] = canonicalJson(value[key]);
        return result;
      }, {});
    }
    return value;
  }

  function stableStringify(value){
    return JSON.stringify(canonicalJson(value));
  }

  function createSeededRandom(seed){
    let value = (Number(seed) >>> 0) || 1;
    return () => {
      value += 0x6D2B79F5;
      let result = value;
      result = Math.imul(result ^ (result >>> 15), result | 1);
      result ^= result + Math.imul(result ^ (result >>> 7), result | 61);
      return ((result ^ (result >>> 14)) >>> 0) / 4294967296;
    };
  }

  function randomUnit(){
    return state.runtime.questionRandom ? state.runtime.questionRandom() : Math.random();
  }

  function rand(max){
    return max > 0 ? Math.floor(randomUnit() * max) : 0;
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

  function balancedLessonOrder(items, salt, keyForItem=item => item.id){
    const lessonSeed = state.lessonSeed || 1;
    return items.slice().sort((a, b) => {
      const keyA = String(keyForItem(a));
      const keyB = String(keyForItem(b));
      const rankA = hashStringToSeed(`${GENERATOR_VERSION}|${lessonSeed}|${salt}|${keyA}`);
      const rankB = hashStringToSeed(`${GENERATOR_VERSION}|${lessonSeed}|${salt}|${keyB}`);
      return rankA - rankB || keyA.localeCompare(keyB);
    });
  }

  function balancedLessonChoice(items, occurrenceIndex, salt, keyForItem=item => item.id){
    if(!items.length) return null;
    const ordered = balancedLessonOrder(items, salt, keyForItem);
    return ordered[(Math.max(1, occurrenceIndex) - 1) % ordered.length];
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

  function fixedConditionId(){
    return String(ui.protocolConditionId && ui.protocolConditionId.value || '').trim();
  }

  function fixedConditionRegistry(){
    const stored = readJson(FIXED_CONDITIONS_KEY);
    return stored && typeof stored === 'object' && !Array.isArray(stored) ? stored : {};
  }

  function fixedConditionSettingsSnapshot(){
    const filters = normalizeContentFilters(contentFiltersFromUi());
    const seedText = String(ui.lessonSeedOverride && ui.lessonSeedOverride.value || '').trim();
    const seedNumber = Number(seedText);
    return {
      task_type: ui.sessionTaskType ? ui.sessionTaskType.value : 'auto',
      start_level: clamp(safeNumber(ui.startLevel && ui.startLevel.value, 1), 1, 10),
      question_count: clamp(safeNumber(ui.sessionMax && ui.sessionMax.value, 8), 1, 20),
      session_length_minutes: clamp(safeNumber(ui.sessionMinutes && ui.sessionMinutes.value, 3), 1, 60),
      max_answer_options: clamp(safeNumber(ui.maxObjects && ui.maxObjects.value, 4), 2, 6),
      prompt_delay_seconds: clamp(safeNumber(ui.delaySec && ui.delaySec.value, 1), 0, 10),
      response_window_seconds: clamp(safeNumber(ui.responseWindowSec && ui.responseWindowSec.value, 6), 1, 60),
      inter_trial_interval_seconds: clamp(safeNumber(ui.itiSec && ui.itiSec.value, 0.75), 0, 10),
      blank_interval_enabled: !!(ui.useBlankInterval && ui.useBlankInterval.checked),
      blank_interval_seconds: clamp(safeNumber(ui.blankIntervalSec && ui.blankIntervalSec.value, 1), 0.1, 10),
      two_stage_prompt: !!(ui.useTwoStage && ui.useTwoStage.checked),
      reward_screen: !!(ui.useReward && ui.useReward.checked),
      text_prompts: !!(ui.useTextPrompt && ui.useTextPrompt.checked),
      image_prompts: !!(ui.useImagePrompt && ui.useImagePrompt.checked),
      speech_prompts: !!(ui.ttsToggle && ui.ttsToggle.checked),
      speak_selected_label: !!(ui.ttsLabelsToggle && ui.ttsLabelsToggle.checked),
      familiar_target_enabled: !!(ui.useFace && ui.useFace.checked),
      target_scale_percent: clamp(safeNumber(ui.targetScale && ui.targetScale.value, 100), 80, 180),
      automatic_touch_scaling: !!(ui.autoTouchScale && ui.autoTouchScale.checked),
      student_friendly_mode: studentFriendlyModeEnabled(),
      auto_advance: !!(ui.autoAdvance && ui.autoAdvance.checked),
      auto_level_path: !!(ui.autoLevelPath && ui.autoLevelPath.checked),
      single_target_first_stage: !!(ui.singleTargetStart && ui.singleTargetStart.checked),
      single_target_repetitions: clamp(safeNumber(ui.singleTargetReps && ui.singleTargetReps.value, 3), 1, 10),
      eeg_research_mode: !!(ui.eegResearchMode && ui.eegResearchMode.checked),
      research_condition: researchCondition(),
      automatic_block_pauses: !!(ui.autoBlockPauses && ui.autoBlockPauses.checked),
      eeg_block_size: eegBlockSize(),
      automatic_pause_seconds: Math.round(eegAutoPauseMs() / 1000),
      lesson_replay_seed: seedText !== '' && Number.isFinite(seedNumber) && seedNumber > 0
        ? ((Math.floor(seedNumber) >>> 0) || 1)
        : null,
      content_filters: {
        find_object_categories: filters.findObjectCategories.slice().sort(),
        find_object_source: filters.findObjectSource,
        find_category_categories: filters.findCategoryCategories.slice().sort(),
        find_category_source: filters.findCategorySource
      }
    };
  }

  function fixedConditionFingerprint(settings){
    return hashStringToSeed(stableStringify(settings)).toString(16).padStart(8, '0');
  }

  function fixedConditionChangedFields(saved, current){
    const keys = Array.from(new Set(Object.keys(saved || {}).concat(Object.keys(current || {}))));
    return keys.filter(key => stableStringify(saved && saved[key]) !== stableStringify(current && current[key]));
  }

  function validateFixedCondition(){
    const enabled = !!(ui.fixedConditionEnabled && ui.fixedConditionEnabled.checked);
    const protocolConditionId = fixedConditionId();
    if(!enabled){
      return { enabled: false, valid: true, status: 'not-enabled', protocol_condition_id: null, changed_fields: [] };
    }
    if(!protocolConditionId){
      return { enabled: true, valid: false, status: 'missing-id', protocol_condition_id: null, changed_fields: [] };
    }
    if(!/^[A-Za-z0-9][A-Za-z0-9._-]{0,79}$/.test(protocolConditionId)){
      return { enabled: true, valid: false, status: 'invalid-id', protocol_condition_id: protocolConditionId, changed_fields: [] };
    }
    const manifest = fixedConditionRegistry()[protocolConditionId];
    if(!manifest || manifest.schema_version !== FIXED_CONDITION_SCHEMA_VERSION || !manifest.settings){
      return { enabled: true, valid: false, status: 'manifest-not-found', protocol_condition_id: protocolConditionId, changed_fields: [] };
    }
    const currentSettings = fixedConditionSettingsSnapshot();
    const changedFields = fixedConditionChangedFields(manifest.settings, currentSettings);
    const valid = changedFields.length === 0;
    return {
      enabled: true,
      valid,
      status: valid ? 'adherent' : 'settings-mismatch',
      protocol_condition_id: protocolConditionId,
      manifest,
      current_settings: currentSettings,
      current_fingerprint: fixedConditionFingerprint(currentSettings),
      changed_fields: changedFields
    };
  }

  function fixedConditionProtocolSnapshot(){
    const validation = validateFixedCondition();
    return {
      schema_version: FIXED_CONDITION_SCHEMA_VERSION,
      enabled: validation.enabled,
      protocol_condition_id: validation.protocol_condition_id,
      adherence_status: validation.status,
      settings_fingerprint: validation.manifest ? validation.manifest.settings_fingerprint : null,
      current_fingerprint: validation.enabled ? validation.current_fingerprint || null : null,
      changed_fields: validation.changed_fields || [],
      manifest: validation.manifest ? clonePlain(validation.manifest) : null,
      interpretation_boundary: 'Software-settings adherence only. This does not verify preregistration, allocation, blinding, protocol approval, treatment equivalence, or EEG hardware timing.'
    };
  }

  function renderFixedConditionOptions(){
    if(!ui.fixedConditionIdList) return;
    clearNode(ui.fixedConditionIdList);
    Object.keys(fixedConditionRegistry()).sort().forEach(id => {
      const option = document.createElement('option');
      option.value = id;
      ui.fixedConditionIdList.appendChild(option);
    });
  }

  function updateFixedConditionStatus(validation=validateFixedCondition()){
    if(!ui.fixedConditionStatus) return validation;
    renderFixedConditionOptions();
    const savedCount = Object.keys(fixedConditionRegistry()).length;
    let message = `Fixed-condition checks are off. ${savedCount} condition${savedCount === 1 ? '' : 's'} saved on this device; ordinary classroom sessions are not restricted.`;
    if(validation.status === 'missing-id') message = 'Enter a protocol condition ID, then save or apply its manifest.';
    else if(validation.status === 'invalid-id') message = 'Condition IDs may contain only letters, numbers, dots, hyphens, and underscores.';
    else if(validation.status === 'manifest-not-found') message = `No saved local manifest was found for ${validation.protocol_condition_id}. Save this setup or enter an existing ID.`;
    else if(validation.status === 'settings-mismatch') message = `Current controls differ from ${validation.protocol_condition_id}: ${validation.changed_fields.join(', ')}. Apply the saved condition or use a new condition ID.`;
    else if(validation.status === 'adherent') message = `${validation.protocol_condition_id} is ready. Settings match fingerprint ${validation.manifest.settings_fingerprint}.`;
    ui.fixedConditionStatus.textContent = message;
    ui.fixedConditionStatus.classList.toggle('invalid', validation.enabled && !validation.valid);
    return validation;
  }

  function saveFixedConditionManifest(){
    if(state.phase !== 'idle' && state.phase !== 'complete'){
      flash('try', 'Finish or reset the current session first');
      return;
    }
    if(ui.fixedConditionEnabled) ui.fixedConditionEnabled.checked = true;
    const protocolConditionId = fixedConditionId();
    if(!protocolConditionId || !/^[A-Za-z0-9][A-Za-z0-9._-]{0,79}$/.test(protocolConditionId)){
      updateFixedConditionStatus(validateFixedCondition());
      flash('try', 'Enter a valid condition ID');
      return;
    }
    const settings = fixedConditionSettingsSnapshot();
    if(!settings.lesson_replay_seed){
      updateFixedConditionStatus({ enabled: true, valid: false, status: 'settings-mismatch', protocol_condition_id: protocolConditionId, changed_fields: ['lesson_replay_seed'] });
      flash('try', 'Add a lesson replay seed before saving');
      return;
    }
    const fingerprint = fixedConditionFingerprint(settings);
    const registry = fixedConditionRegistry();
    const existing = registry[protocolConditionId];
    if(existing && existing.settings_fingerprint !== fingerprint){
      updateFixedConditionStatus({ enabled: true, valid: false, status: 'settings-mismatch', protocol_condition_id: protocolConditionId, manifest: existing, changed_fields: fixedConditionChangedFields(existing.settings, settings) });
      flash('try', 'Use a new ID for changed settings');
      return;
    }
    if(!existing && Object.keys(registry).length >= 100){
      flash('try', 'Local fixed-condition registry is full');
      return;
    }
    registry[protocolConditionId] = existing || {
      schema_version: FIXED_CONDITION_SCHEMA_VERSION,
      protocol_condition_id: protocolConditionId,
      settings_fingerprint: fingerprint,
      fingerprint_method: 'fnv1a32-canonical-json',
      created_at_wall_ms: wallMs(),
      created_with_build: buildExportMeta(),
      settings,
      interpretation_boundary: 'Local reproducibility manifest only; not a security signature or substitute for an approved study protocol.'
    };
    if(!persistJson(FIXED_CONDITIONS_KEY, registry)){
      flash('try', 'Could not save the local condition');
      return;
    }
    saveSettingsSoon();
    updateFixedConditionStatus(validateFixedCondition());
    flash('good', existing ? 'Fixed condition already matches' : 'Fixed condition saved locally');
  }

  function applyFixedConditionManifest(){
    if(state.phase !== 'idle' && state.phase !== 'complete'){
      flash('try', 'Finish or reset the current session first');
      return;
    }
    const protocolConditionId = fixedConditionId();
    const manifest = fixedConditionRegistry()[protocolConditionId];
    if(!manifest || manifest.schema_version !== FIXED_CONDITION_SCHEMA_VERSION || !manifest.settings){
      if(ui.fixedConditionEnabled) ui.fixedConditionEnabled.checked = true;
      updateFixedConditionStatus(validateFixedCondition());
      flash('try', 'Saved condition not found');
      return;
    }
    const settings = manifest.settings;
    const values = {
      sessionTaskType: settings.task_type,
      startLevel: settings.start_level,
      sessionMax: settings.question_count,
      sessionMinutes: settings.session_length_minutes,
      maxObjects: settings.max_answer_options,
      delaySec: settings.prompt_delay_seconds,
      responseWindowSec: settings.response_window_seconds,
      itiSec: settings.inter_trial_interval_seconds,
      useBlankInterval: settings.blank_interval_enabled,
      blankIntervalSec: settings.blank_interval_seconds,
      useTwoStage: settings.two_stage_prompt,
      useReward: settings.reward_screen,
      useTextPrompt: settings.text_prompts,
      useImagePrompt: settings.image_prompts,
      ttsToggle: settings.speech_prompts,
      ttsLabelsToggle: settings.speak_selected_label,
      useFace: settings.familiar_target_enabled,
      targetScale: settings.target_scale_percent,
      autoTouchScale: settings.automatic_touch_scaling,
      studentFriendlyMode: settings.student_friendly_mode,
      autoAdvance: settings.auto_advance,
      autoLevelPath: settings.auto_level_path,
      singleTargetStart: settings.single_target_first_stage,
      singleTargetReps: settings.single_target_repetitions,
      eegResearchMode: settings.eeg_research_mode,
      researchCondition: settings.research_condition,
      activeControlEnabled: settings.research_condition === 'active-control',
      autoBlockPauses: settings.automatic_block_pauses,
      eegBlockSize: settings.eeg_block_size,
      eegAutoPauseSec: settings.automatic_pause_seconds,
      lessonSeedOverride: settings.lesson_replay_seed
    };
    Object.keys(values).forEach(id => {
      const node = ui[id];
      if(!node) return;
      if(node.type === 'checkbox') node.checked = !!values[id];
      else node.value = String(values[id]);
    });
    if(ui.fixedConditionEnabled) ui.fixedConditionEnabled.checked = true;
    const filters = settings.content_filters || {};
    const normalizedFilters = normalizeContentFilters({
      findObjectCategories: filters.find_object_categories,
      findObjectSource: filters.find_object_source,
      findCategoryCategories: filters.find_category_categories,
      findCategorySource: filters.find_category_source
    });
    renderCategoryControls(normalizedFilters);
    if(state.currentPupil) state.currentPupil.contentFilters = normalizedFilters;
    saveCurrentLearnerProfile();
    saveSettingsSoon();
    refreshContentConfiguration();
    updateSessionReadiness();
    updateFixedConditionStatus(validateFixedCondition());
    flash('good', 'Fixed condition applied');
  }

  function studyProtocolSnapshot(participantPseudonym=currentResearchParticipantId()){
    const fixedCondition = fixedConditionProtocolSnapshot();
    return {
      protocol_schema_version: EEG_PROTOCOL_VERSION,
      study_protocol_id: String(ui.studyProtocolId && ui.studyProtocolId.value || '').trim(),
      participant_pseudonym: participantPseudonym,
      visit_id: String(ui.studyVisitId && ui.studyVisitId.value || '').trim(),
      run_number: clamp(safeNumber(ui.studyRunNumber && ui.studyRunNumber.value, 1), 1, 99),
      acquisition_system: String(ui.eegAcquisitionSystem && ui.eegAcquisitionSystem.value || '').trim(),
      declared_sync_method: ui.eegSyncMethod ? ui.eegSyncMethod.value : 'browser-only',
      research_condition: researchCondition(),
      protocol_condition_id: fixedCondition.protocol_condition_id,
      fixed_condition: fixedCondition,
      clock_latency_notes: String(ui.eegClockNotes && ui.eegClockNotes.value || '').trim(),
      planned_marker_set: EEG_PLANNED_MARKER_SET.slice(),
      browser_clock_sources: ['Date.now', 'performance.now'],
      hardware_synchronization_verified: false,
      interpretation_boundary: 'Declared study metadata only. Hardware or LSL synchronisation requires separate implementation and measured validation.'
    };
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

  function normalizeDataGovernance(record={}){
    const allowedStatuses = ['not-recorded', 'recorded-separately', 'classroom-only', 'withdrawn'];
    const status = allowedStatuses.includes(record.status || record.dataUseStatus)
      ? (record.status || record.dataUseStatus)
      : 'not-recorded';
    const approvedUses = record.approved_uses || {};
    return {
      governance_schema_version: GOVERNANCE_SCHEMA_VERSION,
      status,
      authority_evidence_stored_in_choice_train: false,
      governance_reference: String(record.governance_reference || record.governanceReference || '').trim(),
      review_date: String(record.review_date || record.governanceReviewDate || '').trim(),
      approved_uses: {
        research_analysis: approvedUses.research_analysis === true || record.researchAnalysisApproved === true,
        eeg_linkage: approvedUses.eeg_linkage === true || record.eegLinkageApproved === true,
        model_development: approvedUses.model_development === true || record.modelDevelopmentApproved === true
      },
      interpretation_boundary: 'Local declaration only. Consent or other lawful-authority evidence must be held and governed separately by the school or research team.'
    };
  }

  function dataGovernanceSnapshot(){
    return normalizeDataGovernance({
      status: ui.dataUseStatus ? ui.dataUseStatus.value : 'not-recorded',
      governance_reference: ui.governanceReference ? ui.governanceReference.value : '',
      review_date: ui.governanceReviewDate ? ui.governanceReviewDate.value : '',
      approved_uses: {
        research_analysis: !!(ui.researchAnalysisApproved && ui.researchAnalysisApproved.checked),
        eeg_linkage: !!(ui.eegLinkageApproved && ui.eegLinkageApproved.checked),
        model_development: !!(ui.modelDevelopmentApproved && ui.modelDevelopmentApproved.checked)
      }
    });
  }

  function dataGovernanceForLearner(name){
    const learner = name && state.learners[name];
    return learner ? normalizeDataGovernance(learner.baseline || {}) : normalizeDataGovernance();
  }

  function updateAiExportGovernanceStatus(scopeCheck=null){
    if(!ui.aiExportGovernanceStatus) return;
    if(scopeCheck && !scopeCheck.allowed){
      ui.aiExportGovernanceStatus.textContent = `Model-development export blocked for ${scopeCheck.blocked_count} of ${scopeCheck.participant_count} pupil profile(s) in this scope. Record current authority and approved model-development use for every included pupil.`;
      ui.aiExportGovernanceStatus.classList.add('invalid');
      return;
    }
    const governance = dataGovernanceSnapshot();
    const ready = governance.status === 'recorded-separately' && governance.approved_uses.model_development;
    ui.aiExportGovernanceStatus.textContent = ready
      ? 'Selected pupil is marked ready for pseudonymised model-development export. The separately held authority must still be current and applicable.'
      : 'Model-development export blocked for the selected pupil until authority is recorded separately and model-development use is approved.';
    ui.aiExportGovernanceStatus.classList.toggle('invalid', !ready);
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

  function buildCategoryMatchPrompt(categoryId, cueLabel, index){
    const meta = categoryMeta(categoryId);
    const safeCueLabel = normalizeCategoryLabel(cueLabel) || 'this one';
    const prompts = [
      `Find ${meta.promptMatch || `another item from ${meta.label}`}`,
      `Which one goes with ${safeCueLabel}?`,
      `Can you find another one like ${safeCueLabel}?`,
      `Which one is in the same group as ${safeCueLabel}?`
    ];
    return prompts[Math.max(0, index - 1) % prompts.length];
  }

  function buildCategoryExclusionPrompt(index){
    const prompts = [
      'Find the one that is different',
      'Which one is different?',
      'Can you find the one from a different group?',
      'Which one does not belong with the others?'
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

  function skillIdsForTask(kind){
    return (TASK_SKILL_IDS[kind] || []).filter(skillId => SKILL_GRAPH[skillId]).slice();
  }

  function skillGraphSnapshot(){
    return Object.keys(SKILL_GRAPH).map(skillId => ({
      skill_id: skillId,
      label: SKILL_GRAPH[skillId].label,
      prerequisites: SKILL_GRAPH[skillId].prerequisites.slice()
    }));
  }

  function currentLessonPlanId(){
    return state.lessonPlanId || (state.sessionId ? `${state.sessionId}:lesson-plan` : null);
  }

  function initializeLessonPlan(){
    const overrideText = ui.lessonSeedOverride ? String(ui.lessonSeedOverride.value || '').trim() : '';
    const overrideValue = Number(overrideText);
    const hasOverride = overrideText !== '' && Number.isFinite(overrideValue) && overrideValue > 0;
    state.lessonSeed = hasOverride
      ? ((Math.floor(overrideValue) >>> 0) || 1)
      : hashStringToSeed(`${GENERATOR_VERSION}|${state.sessionId}|${sessionPupilAlias()}|${state.currentLevel}|${state.sessionTaskType}`);
    state.lessonSeedSource = hasOverride ? 'admin-override' : 'session-generated';
    state.lessonPlanId = `lesson-${state.lessonSeed.toString(16).padStart(8, '0')}-${state.sessionId.slice(0, 8)}`;
    state.lessonPlan = {
      lesson_plan_id: state.lessonPlanId,
      lesson_seed: state.lessonSeed,
      lesson_seed_source: state.lessonSeedSource,
      generator_version: GENERATOR_VERSION,
      generator_mode: 'deterministic-seeded',
      constraints: {
        learner_alias: sessionPupilAlias(),
        level: state.currentLevel,
        task_mode: state.sessionTaskType,
        total_questions: state.totalQuestions,
        max_answer_options: clamp(safeNumber(ui.maxObjects && ui.maxObjects.value, 4), 2, 6),
        coverage_strategy: 'balanced-before-repeat',
        research_condition: researchCondition(),
        protocol_condition_id: state.sessionSnapshot && state.sessionSnapshot.study_protocol
          ? state.sessionSnapshot.study_protocol.protocol_condition_id
          : null,
        content_configuration: exportableContentConfiguration(state.sessionContentConfig)
      }
    };
  }

  function lessonPlanSnapshot(){
    if(state.lessonPlan){
      return {
        ...state.lessonPlan,
        constraints: {
          ...state.lessonPlan.constraints,
          content_configuration: state.lessonPlan.constraints.content_configuration
            ? { ...state.lessonPlan.constraints.content_configuration }
            : null
        }
      };
    }
    return {
      lesson_plan_id: currentLessonPlanId(),
      lesson_seed: state.lessonSeed,
      lesson_seed_source: state.lessonSeedSource,
      generator_version: GENERATOR_VERSION,
      generator_mode: 'deterministic-seeded',
      constraints: {
        learner_alias: sessionPupilAlias(),
        level: state.currentLevel,
        task_mode: selectedSessionTaskMode(),
        total_questions: state.totalQuestions,
        max_answer_options: clamp(safeNumber(ui.maxObjects && ui.maxObjects.value, 4), 2, 6),
        coverage_strategy: 'balanced-before-repeat',
        research_condition: researchCondition(),
        protocol_condition_id: state.sessionSnapshot && state.sessionSnapshot.study_protocol
          ? state.sessionSnapshot.study_protocol.protocol_condition_id
          : null,
        content_configuration: exportableContentConfiguration(state.sessionContentConfig)
      }
    };
  }

  function generatorConstraintsForQuestion(question){
    return {
      task_mode: selectedSessionTaskMode(),
      task_kind: question.kind,
      level: state.currentLevel,
      max_answer_options: clamp(safeNumber(ui.maxObjects && ui.maxObjects.value, 4), 2, 6),
      coverage_strategy: 'balanced-before-repeat',
      auto_level_path: !!(ui.autoLevelPath && ui.autoLevelPath.checked),
      response_window_ms: question.responseWindowMs == null ? null : question.responseWindowMs,
      target_category: question.targetCategory || null,
      reference_category: question.referenceCategory || null,
      category_relation: question.categoryRelation || null,
      cue_id: question.cueOption ? question.cueOption.id : null,
      cue_category: question.cueCategory || null,
      procedural_variant: question.proceduralVariant || null,
      discrimination_contrast: question.discriminationContrast || null,
      open_ended_choice: !!question.openEndedChoice,
      content_configuration: question.contentConfiguration || null
    };
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
        promptMatch: `another item from ${custom.label}`,
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
    return `ChoiceTrain_${safeFilenamePart(state.trials.length ? sessionPupilAlias() : currentPupilAlias())}_${stamp.date}_${stamp.time}_${suffix}.${extension}`;
  }

  // Local-only structured summary reserved for future LLM-assisted recommendations.
  // No session data is currently sent externally from this static build.
  function buildLocalRecommendationSummary(summary=analyticsSummary()){
    const learnerName = state.trials.length ? sessionPupilName() : currentPupilName();
    const learnerAlias = state.trials.length ? sessionPupilAlias() : currentPupilAlias();
    const sessions = planningSessionsForLearner(learnerName, learnerAlias);
    const practiceStates = skillPracticeStatesForSessions(sessions);
    const proposal = recommendationForSessions(sessions, learnerAlias);
    const learner = normalizeLearner(learnerName, state.learners[learnerName] || (state.sessionSnapshot && state.sessionSnapshot.learner_profile) || {});
    const photoMetadata = state.trials.length && state.sessionSnapshot
      ? state.sessionSnapshot.photo_library_metadata || []
      : photoLibraryMetadata();
    return {
      local_only: true,
      external_transmission: false,
      recommendation_version: RECOMMENDATION_VERSION,
      practice_status_version: PRACTICE_STATUS_VERSION,
      learner_level: state.currentLevel,
      recent_accuracy_pct: summary.accuracy_pct,
      recent_reaction_time_ms: summary.mean_rt_ms || null,
      prompt_support_used: summary.prompted_success_count,
      preferred_content: photoMetadata.slice(0, 6).map(item => item.label),
      recent_theme: state.trials.length && state.sessionSnapshot ? state.sessionSnapshot.theme_used : currentThemeChoice(),
      recent_context_notes: state.trials.length && state.sessionSnapshot ? state.sessionSnapshot.context_notes : currentContextNotes(),
      practice_states: practiceStates,
      suggested_next_session: proposal,
      teacher_review_history: learner.reviews.slice(-20),
      interpretation_boundary: 'Local planning structure only. Teacher review is required and no data is sent to an external model.'
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

  function currentResearchParticipantId(){
    const name = currentPupilName();
    const source = state.learners[name] || state.currentPupil || buildDefaultLearner(name);
    const learner = normalizeLearner(name, source);
    if(name && name !== 'Unknown' && (!state.learners[name] || state.learners[name].researchParticipantId !== learner.researchParticipantId)){
      state.learners[name] = learner;
      state.currentPupil = learner;
      saveLearners();
    }
    return learner.researchParticipantId;
  }

  function sessionPupilName(){
    return state.sessionSnapshot && state.sessionSnapshot.learner
      ? state.sessionSnapshot.learner
      : currentPupilName();
  }

  function sessionPupilAlias(){
    return state.sessionSnapshot && state.sessionSnapshot.learner_alias
      ? state.sessionSnapshot.learner_alias
      : currentPupilAlias();
  }

  function clonePlain(value){
    return value == null ? value : JSON.parse(JSON.stringify(value));
  }

  function sessionMatchesLearner(session, learnerName=currentPupilName(), learnerAlias=currentPupilAlias()){
    const storedName = String(session && session.learner || '').trim();
    if(storedName) return storedName === learnerName;
    return !!learnerAlias && String(session && session.learner_alias || '').trim() === learnerAlias;
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
      overview: ui.adminOverviewSection,
      research: ui.adminAnalyticsSection,
      sessions: ui.adminHistorySection,
      learners: ui.adminLearnerProfileSection,
      eeg: ui.adminEegSection,
      system: ui.adminPanelDetails
    };
    const buttons = {
      overview: ui.adminNavOverview,
      research: ui.adminNavResearch,
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
    if(nextPage === 'research') renderResearchWorkspace();
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
    const protocol = state.sessionSnapshot && state.sessionSnapshot.study_protocol;
    const marker = {
      marker_id: uuid4(),
      code: EEG_EVENT_CODES[name] || 0,
      name,
      session_id: state.sessionId,
      learner: sessionPupilName(),
      learner_alias: sessionPupilAlias(),
      t_rel_ms: markerTimeRelativeMs(),
      t_wall_ms: wallMs(),
      t_perf_ms: Math.round(nowMs()),
      level: state.currentLevel,
      question_index: state.currentQuestion ? state.currentQuestion.questionIndex : state.questionIndex,
      block_index: currentBlockIndex(),
      research_condition: protocol ? protocol.research_condition : researchCondition(),
      study_protocol_id: protocol ? protocol.study_protocol_id : '',
      protocol_condition_id: protocol ? protocol.protocol_condition_id : null,
      visit_id: protocol ? protocol.visit_id : '',
      run_number: protocol ? protocol.run_number : null,
      declared_sync_method: protocol ? protocol.declared_sync_method : 'browser-only',
      ...extras
    };
    state.eeg.markers.push(marker);
    return marker;
  }

  function markerTsv(markers){
    const headers = ['marker_id', 'code', 'name', 'session_id', 'learner', 'learner_alias', 'study_protocol_id', 'protocol_condition_id', 'visit_id', 'run_number', 'declared_sync_method', 't_rel_ms', 't_wall_ms', 't_perf_ms', 'level', 'question_index', 'block_index', 'research_condition', 'trial_id', 'task_kind', 'task_variant', 'attention_domain', 'response_type', 'correct', 'omission', 'commission', 'artifact_type', 'break_reason'];
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
      researchParticipantId: `ctp-${uuid4()}`,
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
      researchParticipantId: learner.researchParticipantId || `ctp-${uuid4()}`,
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
      studyProtocolId: ui.studyProtocolId ? ui.studyProtocolId.value : '',
      studyVisitId: ui.studyVisitId ? ui.studyVisitId.value : '',
      studyRunNumber: ui.studyRunNumber ? ui.studyRunNumber.value : 1,
      eegAcquisitionSystem: ui.eegAcquisitionSystem ? ui.eegAcquisitionSystem.value : '',
      eegSyncMethod: ui.eegSyncMethod ? ui.eegSyncMethod.value : 'browser-only',
      eegClockNotes: ui.eegClockNotes ? ui.eegClockNotes.value : '',
      lessonSeedOverride: ui.lessonSeedOverride ? ui.lessonSeedOverride.value : '',
      fixedConditionEnabled: !!(ui.fixedConditionEnabled && ui.fixedConditionEnabled.checked),
      protocolConditionId: fixedConditionId(),
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
    if(ui.studyProtocolId) ui.studyProtocolId.value = settings.studyProtocolId || '';
    if(ui.studyVisitId) ui.studyVisitId.value = settings.studyVisitId || '';
    if(ui.studyRunNumber) ui.studyRunNumber.value = settings.studyRunNumber || 1;
    if(ui.eegAcquisitionSystem) ui.eegAcquisitionSystem.value = settings.eegAcquisitionSystem || '';
    if(ui.eegSyncMethod) ui.eegSyncMethod.value = settings.eegSyncMethod || 'browser-only';
    if(ui.eegClockNotes) ui.eegClockNotes.value = settings.eegClockNotes || '';
    if(ui.lessonSeedOverride) ui.lessonSeedOverride.value = settings.lessonSeedOverride || '';
    if(ui.fixedConditionEnabled) ui.fixedConditionEnabled.checked = !!settings.fixedConditionEnabled;
    if(ui.protocolConditionId) ui.protocolConditionId.value = settings.protocolConditionId || '';
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
    if(marker && safeNumber(marker.version, 0) >= LOCAL_DATA_MIGRATION_VERSION && !state.storage.assetMigrationNeeded) return true;
    const assetsSaved = await persistAssets();
    if(!assetsSaved) return false;
    await idbPut(IDB_META_STORE, {
      key,
      version: LOCAL_DATA_MIGRATION_VERSION,
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
        updateFixedConditionStatus();
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

  function fairMatchCategories(categories, pool){
    const selected = normalizeCategorySelection(categories, []);
    return selected.filter(category => {
      const members = uniqueOptions(pool.filter(item => optionMatchesCategory(item, category)), true);
      const distractors = uniqueOptions(pool.filter(item => !optionMatchesCategory(item, category)), true);
      return members.length >= 2 && distractors.length > 0;
    });
  }

  function fairExclusionCategories(categories, pool){
    const selected = normalizeCategorySelection(categories, []);
    return selected.filter(category => {
      const members = uniqueOptions(pool.filter(item => optionMatchesCategory(item, category)), true);
      if(members.length < 2) return false;
      const memberLabels = new Set(members.map(item => normalizedConceptLabel(item.label)));
      const outsideItems = uniqueOptions(pool.filter(item => (
        !optionMatchesCategory(item, category)
        && !memberLabels.has(normalizedConceptLabel(item.label))
      )), true);
      return outsideItems.length > 0;
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
    const matchCategoryFair = fairMatchCategories(filters.findCategoryCategories, findCategoryItems);
    const exclusionCategoryFair = fairExclusionCategories(filters.findCategoryCategories, findCategoryItems);
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
        fairMatchCategories: categoryLabels(matchCategoryFair),
        fairExclusionCategories: categoryLabels(exclusionCategoryFair),
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
        fair_match_categories: snapshot.findCategory.fairMatchCategories,
        fair_exclusion_categories: snapshot.findCategory.fairExclusionCategories,
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
    if(!config.categories.length) message = 'Select at least one category for the object-based activities.';
    else if(uniqueLabels.length < 2) message = 'Object-based activities need at least two differently labelled usable items. Add content, enable photos for questions, or change the source/category selection.';
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

  function matchCategoryConfiguration(snapshot=buildContentConfigurationSnapshot()){
    const config = snapshot.findCategory;
    const fair = config.fairMatchCategories || [];
    const valid = fair.length >= 2;
    const categoryNames = config.categories.map(category => category.label).join(', ') || 'None';
    let message = `Categories: ${categoryNames}. Source: ${sourceModeLabel(config.sourceMode)}. ${config.items.length} usable items; ${fair.length} can produce fair cue-and-match questions.`;
    if(config.categories.length < 2) message = 'Match category needs at least two selected categories.';
    else if(fair.length < 2) message = 'Match category needs at least two categories with two differently labelled members and an item outside the category.';
    return { valid, message, config, fair };
  }

  function categoryExclusionConfiguration(snapshot=buildContentConfigurationSnapshot()){
    const config = snapshot.findCategory;
    const fair = config.fairExclusionCategories || [];
    const maxAnswerOptions = clamp(safeNumber(ui.maxObjects && ui.maxObjects.value, 4), 2, 6);
    const valid = maxAnswerOptions >= 3 && fair.length >= 2;
    const categoryNames = config.categories.map(category => category.label).join(', ') || 'None';
    let message = `Categories: ${categoryNames}. Source: ${sourceModeLabel(config.sourceMode)}. ${config.items.length} usable items; ${fair.length} can produce fair find-the-different-one questions.`;
    if(maxAnswerOptions < 3) message = 'Find the different one needs at least three answer options.';
    else if(config.categories.length < 2) message = 'Find the different one needs at least two selected categories.';
    else if(fair.length < 2) message = 'Find the different one needs at least two categories with two differently labelled members and a differently labelled item outside the category.';
    return { valid, message, config, fair };
  }

  function categoryLessonTaskKinds(){
    const maxAnswerOptions = clamp(safeNumber(ui.maxObjects && ui.maxObjects.value, 4), 2, 6);
    return maxAnswerOptions >= 3
      ? ['find-category', 'match-category', 'category-exclusion']
      : ['find-category', 'match-category'];
  }

  function effectiveConfiguredTaskKinds(){
    const selected = ui.sessionTaskType ? ui.sessionTaskType.value : 'auto';
    if(selected !== 'auto') return selected === 'cpat-suite' ? CPAT_TASK_ORDER.slice() : [selected];
    if(ui.autoLevelPath && ui.autoLevelPath.checked){
      const level = clamp(safeNumber(ui.startLevel && ui.startLevel.value, 1), 1, 10);
      return level === 6 ? categoryLessonTaskKinds() : [levelSpec(level).kind];
    }
    return ['moving-target', 'find-object', 'discriminate-object'].concat(categoryLessonTaskKinds(), ['choice-preference']);
  }

  function refreshContentConfiguration(){
    if(!ui.findObjectConfig || !ui.findCategoryConfig) return;
    const kinds = effectiveConfiguredTaskKinds();
    const snapshot = buildContentConfigurationSnapshot();
    const objectCheck = findObjectConfiguration(snapshot);
    const categoryCheck = findCategoryConfiguration(snapshot);
    const matchCheck = matchCategoryConfiguration(snapshot);
    const exclusionCheck = categoryExclusionConfiguration(snapshot);
    const usesObjectContent = kinds.some(kind => ['find-object', 'discriminate-object', 'choice-preference'].includes(kind));
    ui.findObjectConfig.hidden = !usesObjectContent;
    ui.findCategoryConfig.hidden = !kinds.some(kind => ['find-category', 'match-category', 'category-exclusion'].includes(kind));
    ui.findObjectConfigSummary.textContent = objectCheck.message;
    ui.findObjectConfigSummary.classList.toggle('invalid', !objectCheck.valid);
    const activeCategoryChecks = [
      kinds.includes('find-category') ? categoryCheck : null,
      kinds.includes('match-category') ? matchCheck : null,
      kinds.includes('category-exclusion') ? exclusionCheck : null
    ].filter(Boolean);
    const activeCategoryCheck = activeCategoryChecks.find(check => !check.valid) || activeCategoryChecks[activeCategoryChecks.length - 1] || categoryCheck;
    ui.findCategoryConfigSummary.textContent = activeCategoryCheck.message;
    ui.findCategoryConfigSummary.classList.toggle('invalid', !activeCategoryCheck.valid);
  }

  function validateSessionContentSetup(){
    const kinds = effectiveConfiguredTaskKinds();
    const snapshot = buildContentConfigurationSnapshot();
    const problems = [];
    if(kinds.some(kind => ['find-object', 'discriminate-object', 'choice-preference'].includes(kind))){
      const check = findObjectConfiguration(snapshot);
      if(!check.valid) problems.push(check.message);
    }
    if(kinds.includes('find-category')){
      const check = findCategoryConfiguration(snapshot);
      if(!check.valid) problems.push(check.message);
    }
    if(kinds.includes('match-category')){
      const check = matchCategoryConfiguration(snapshot);
      if(!check.valid) problems.push(check.message);
    }
    if(kinds.includes('category-exclusion')){
      const check = categoryExclusionConfiguration(snapshot);
      if(!check.valid) problems.push(check.message);
    }
    return { valid: problems.length === 0, problems, snapshot };
  }

  function sessionPoolFor(kind){
    if(state.sessionContentConfig){
      if(kind === 'find-object') return state.sessionContentConfig.findObject.items.slice();
      if(['find-category', 'match-category', 'category-exclusion'].includes(kind)) return state.sessionContentConfig.findCategory.items.slice();
    }
    const snapshot = buildContentConfigurationSnapshot();
    return ['find-category', 'match-category', 'category-exclusion'].includes(kind) ? snapshot.findCategory.items : snapshot.findObject.items;
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
      6: { kind: 'find-category', size: 140 * scale, movable: false, subtitle: 'Level 6: use category knowledge to find, match, and compare related items.' },
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
        left: movable ? 16 + randomUnit() * 68 : 50,
        top: movable ? 24 + randomUnit() * 42 : 56
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
    if(ui.autoLevelPath.checked){
      if(state.currentLevel === 6){
        const categoryKinds = categoryLessonTaskKinds();
        return categoryKinds[Math.max(0, index - 1) % categoryKinds.length];
      }
      return levelSpec(state.currentLevel).kind;
    }
    if(index <= state.singleTargetRepetitions && ui.singleTargetStart.checked) return index === 1 ? 'touch-screen' : 'touch-object';
    const cycle = ['moving-target', 'find-object', 'discriminate-object'].concat(categoryLessonTaskKinds(), ['choice-preference']);
    const cycleStart = ui.singleTargetStart.checked ? state.singleTargetRepetitions + 1 : 1;
    return cycle[Math.max(0, index - cycleStart) % cycle.length];
  }

  function taskOccurrenceIndex(kind, questionIndex){
    let occurrence = 0;
    for(let index = 1; index <= questionIndex; index++){
      if(chooseSessionTaskKind(index) === kind) occurrence += 1;
    }
    return Math.max(1, occurrence);
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
      const snapshot = state.sessionContentConfig || buildContentConfigurationSnapshot();
      const occurrence = taskOccurrenceIndex(currentKind, index);
      const configuredCategories = snapshot.findObject.categories
        .map(item => item.id)
        .filter(category => eligible.some(item => optionMatchesCategory(item, category)));
      const targetCategory = balancedLessonChoice(configuredCategories, occurrence, 'find-object:categories', item => item);
      const categoryOccurrence = Math.floor((occurrence - 1) / Math.max(1, configuredCategories.length)) + 1;
      const exactCategoryTargets = eligible.filter(item => canonicalCategoryId(item.category) === targetCategory);
      const targetCandidates = exactCategoryTargets.length
        ? exactCategoryTargets
        : eligible.filter(item => optionMatchesCategory(item, targetCategory));
      const target = balancedLessonChoice(targetCandidates, categoryOccurrence, `find-object:${targetCategory}:targets`)
        || balancedLessonChoice(eligible, occurrence, 'find-object:all-targets');
      const distractorPool = eligible.filter(item => normalizedConceptLabel(item.label) !== normalizedConceptLabel(target.label));
      const others = balancedLessonOrder(distractorPool, `find-object:q${index}:distractors:${target.id}`)
        .slice(0, Math.min(optionCount - 1, distractorPool.length));
      return {
        ...baseQuestion,
        prompt: buildFindPrompt(target.label, index),
        cueSummary: 'Choose the named object from the set.',
        target,
        options: shuffle([target].concat(others)),
        correctId: target.id,
        renderMode: 'grid',
        distractorCount: others.length,
        targetCategory,
        targetCategoryLabel: targetCategory ? categoryMeta(targetCategory).label : '',
        contentConfiguration: exportableContentConfiguration(snapshot).find_object,
        expectedResponseType: 'hit'
      };
    }

    if(currentKind === 'discriminate-object'){
      const eligible = uniqueOptions(sessionPoolFor('discriminate-object'), true);
      const snapshot = state.sessionContentConfig || buildContentConfigurationSnapshot();
      const occurrence = taskOccurrenceIndex(currentKind, index);
      const configuredCategories = snapshot.findObject.categories
        .map(item => item.id)
        .filter(category => eligible.some(item => optionMatchesCategory(item, category)));
      const targetCategory = balancedLessonChoice(configuredCategories, occurrence, 'discriminate-object:categories', item => item);
      const categoryOccurrence = Math.floor((occurrence - 1) / Math.max(1, configuredCategories.length)) + 1;
      const exactCategoryTargets = eligible.filter(item => canonicalCategoryId(item.category) === targetCategory);
      const targetCandidates = exactCategoryTargets.length
        ? exactCategoryTargets
        : eligible.filter(item => optionMatchesCategory(item, targetCategory));
      const target = balancedLessonChoice(targetCandidates, categoryOccurrence, `discriminate-object:${targetCategory}:targets`)
        || balancedLessonChoice(eligible, occurrence, 'discriminate-object:all-targets');
      const otherOptions = eligible.filter(item => item.id !== target.id && normalizedConceptLabel(item.label) !== normalizedConceptLabel(target.label));
      const withinCategory = otherOptions.filter(item => optionMatchesCategory(item, targetCategory));
      const distractorPool = withinCategory.length ? withinCategory : otherOptions;
      const distractor = balancedLessonChoice(distractorPool, occurrence, `discriminate-object:${targetCategory}:distractors:${target.id}`);
      const discriminationContrast = withinCategory.length ? 'within-category' : 'cross-category';
      return {
        ...baseQuestion,
        prompt: buildFindPrompt(target.label, index),
        cueSummary: discriminationContrast === 'within-category'
          ? 'Choose the named item from two options in the same category.'
          : 'Choose the named item from two category-balanced options.',
        target,
        options: shuffle([target, distractor]),
        correctId: target.id,
        renderMode: 'grid',
        distractorCount: 1,
        targetCategory,
        targetCategoryLabel: targetCategory ? categoryMeta(targetCategory).label : '',
        contentConfiguration: exportableContentConfiguration(snapshot).find_object,
        proceduralVariant: 'category-balanced-discrimination',
        discriminationContrast,
        expectedResponseType: 'hit'
      };
    }

    if(currentKind === 'find-category'){
      const eligible = sessionPoolFor('find-category');
      const snapshot = state.sessionContentConfig || buildContentConfigurationSnapshot();
      const fairCategories = snapshot.findCategory.fairPromptCategories.map(item => item.id);
      const occurrence = taskOccurrenceIndex(currentKind, index);
      const category = balancedLessonChoice(fairCategories, occurrence, 'find-category:categories', item => item);
      const targetCandidates = uniqueOptions(eligible.filter(item => optionMatchesCategory(item, category)), true);
      const categoryOccurrence = Math.floor((occurrence - 1) / Math.max(1, fairCategories.length)) + 1;
      const target = balancedLessonChoice(targetCandidates, categoryOccurrence, `find-category:${category}:targets`);
      const distractorPool = uniqueOptions(eligible.filter(item =>
        !optionMatchesCategory(item, category)
        && normalizedConceptLabel(item.label) !== normalizedConceptLabel(target.label)
      ), true);
      const distractors = balancedLessonOrder(distractorPool, `find-category:q${index}:distractors:${category}:${target.id}`)
        .slice(0, Math.min(optionCount - 1, distractorPool.length));
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

    if(currentKind === 'match-category'){
      const eligible = sessionPoolFor('match-category');
      const snapshot = state.sessionContentConfig || buildContentConfigurationSnapshot();
      const fairCategories = snapshot.findCategory.fairMatchCategories.map(item => item.id);
      const occurrence = taskOccurrenceIndex(currentKind, index);
      const category = balancedLessonChoice(fairCategories, occurrence, 'match-category:categories', item => item);
      const categoryOccurrence = Math.floor((occurrence - 1) / Math.max(1, fairCategories.length)) + 1;
      const members = uniqueOptions(eligible.filter(item => optionMatchesCategory(item, category)), true);
      const cue = balancedLessonChoice(members, categoryOccurrence, `match-category:${category}:cues`);
      const targetCandidates = members.filter(item => item.id !== cue.id);
      const target = balancedLessonChoice(targetCandidates, categoryOccurrence, `match-category:${category}:targets:${cue.id}`);
      const distractorPool = uniqueOptions(eligible.filter(item =>
        !optionMatchesCategory(item, category)
        && item.id !== cue.id
        && normalizedConceptLabel(item.label) !== normalizedConceptLabel(cue.label)
        && normalizedConceptLabel(item.label) !== normalizedConceptLabel(target.label)
      ), true);
      const distractors = balancedLessonOrder(distractorPool, `match-category:q${index}:distractors:${category}:${cue.id}:${target.id}`)
        .slice(0, Math.min(optionCount - 1, distractorPool.length));
      return {
        ...baseQuestion,
        prompt: buildCategoryMatchPrompt(category, cue.label, index),
        cueSummary: `${cue.label} is the cue. Choose a different item from the same teacher-defined category.`,
        cueOption: cue,
        cueCategory: category,
        promptPreviewOption: cue,
        promptPreviewText: `Find one that belongs with ${cue.label}`,
        target,
        options: shuffle([target].concat(distractors)),
        correctId: target.id,
        renderMode: 'grid',
        distractorCount: distractors.length,
        targetCategory: category,
        targetCategoryLabel: categoryMeta(category).label,
        contentConfiguration: exportableContentConfiguration(snapshot).find_category,
        proceduralVariant: 'category-exemplar-match',
        expectedResponseType: 'hit'
      };
    }

    if(currentKind === 'category-exclusion'){
      const eligible = sessionPoolFor('category-exclusion');
      const snapshot = state.sessionContentConfig || buildContentConfigurationSnapshot();
      const fairCategories = snapshot.findCategory.fairExclusionCategories.map(item => item.id);
      const occurrence = taskOccurrenceIndex(currentKind, index);
      const referenceCategory = balancedLessonChoice(fairCategories, occurrence, 'category-exclusion:categories', item => item);
      const categoryOccurrence = Math.floor((occurrence - 1) / Math.max(1, fairCategories.length)) + 1;
      const members = uniqueOptions(eligible.filter(item => optionMatchesCategory(item, referenceCategory)), true);
      const groupMembers = balancedLessonOrder(members, `category-exclusion:${referenceCategory}:members:${categoryOccurrence}`)
        .slice(0, Math.min(Math.max(2, optionCount - 1), members.length));
      const groupLabels = new Set(groupMembers.map(item => normalizedConceptLabel(item.label)));
      const outsideCandidates = uniqueOptions(eligible.filter(item => (
        !optionMatchesCategory(item, referenceCategory)
        && !groupLabels.has(normalizedConceptLabel(item.label))
      )), true);
      const target = balancedLessonChoice(outsideCandidates, categoryOccurrence, `category-exclusion:${referenceCategory}:targets`);
      const targetCategory = canonicalCategoryId(target.category);
      return {
        ...baseQuestion,
        prompt: buildCategoryExclusionPrompt(index),
        cueSummary: `Two or more items are from ${categoryMeta(referenceCategory).label}. Choose the one from a different teacher-defined category.`,
        target,
        options: shuffle(groupMembers.concat(target)),
        correctId: target.id,
        renderMode: 'grid',
        distractorCount: groupMembers.length,
        targetCategory,
        targetCategoryLabel: categoryMeta(targetCategory).label,
        referenceCategory,
        referenceCategoryLabel: categoryMeta(referenceCategory).label,
        categoryRelation: 'outside-reference-category',
        contentConfiguration: exportableContentConfiguration(snapshot).find_category,
        proceduralVariant: 'category-exclusion',
        expectedResponseType: 'hit'
      };
    }

    if(currentKind === 'choice-preference'){
      const eligible = uniqueOptions(sessionPoolFor('choice-preference'), true);
      const snapshot = state.sessionContentConfig || buildContentConfigurationSnapshot();
      const occurrence = taskOccurrenceIndex(currentKind, index);
      const configuredCategories = snapshot.findObject.categories
        .map(item => item.id)
        .filter(category => eligible.some(item => optionMatchesCategory(item, category)));
      const anchorCategory = balancedLessonChoice(configuredCategories, occurrence, 'choice-preference:categories', item => item);
      const categoryOccurrence = Math.floor((occurrence - 1) / Math.max(1, configuredCategories.length)) + 1;
      const anchorCandidates = eligible.filter(item => optionMatchesCategory(item, anchorCategory));
      const target = balancedLessonChoice(anchorCandidates, categoryOccurrence, `choice-preference:${anchorCategory}:anchors`)
        || balancedLessonChoice(eligible, occurrence, 'choice-preference:all-anchors');
      const otherOptions = eligible.filter(item => item.id !== target.id);
      const crossCategory = otherOptions.filter(item => !optionMatchesCategory(item, anchorCategory));
      const sameCategory = otherOptions.filter(item => optionMatchesCategory(item, anchorCategory));
      const orderedOthers = balancedLessonOrder(crossCategory, `choice-preference:q${index}:cross:${target.id}`)
        .concat(balancedLessonOrder(sameCategory, `choice-preference:q${index}:same:${target.id}`));
      const choices = shuffle([target].concat(orderedOthers.slice(0, Math.min(clamp(optionCount, 2, 4) - 1, orderedOthers.length))));
      return {
        ...baseQuestion,
        prompt: choosePromptVariant('preference', {}, index),
        cueSummary: 'Open-ended choice using the configured categories. Every option is accepted.',
        target,
        options: choices,
        correctId: target.id,
        renderMode: 'grid',
        distractorCount: Math.max(0, choices.length - 1),
        targetCategory: anchorCategory,
        targetCategoryLabel: anchorCategory ? categoryMeta(anchorCategory).label : '',
        contentConfiguration: exportableContentConfiguration(snapshot).find_object,
        proceduralVariant: 'category-balanced-preference',
        openEndedChoice: true,
        expectedResponseType: 'preference-selection'
      };
    }

    if(currentKind === 'cpat-suite'){
      return buildQuestionFromKind(CPAT_TASK_ORDER[(index - 1) % CPAT_TASK_ORDER.length], index);
    }

    return buildQuestionFromKind(currentKind, index);
  }

  function buildSeededQuestion(index){
    const lessonSeed = state.lessonSeed || hashStringToSeed(`${state.sessionId}|${sessionPupilAlias()}|${state.currentLevel}`);
    const questionSeed = hashStringToSeed(`${GENERATOR_VERSION}|${lessonSeed}|question-${index}`);
    const previousRandom = state.runtime.questionRandom;
    state.runtime.questionRandom = createSeededRandom(questionSeed);
    try {
      const question = buildQuestion(index);
      return {
        ...question,
        lessonSeed,
        questionSeed,
        generatorMode: 'deterministic-seeded'
      };
    } finally {
      state.runtime.questionRandom = previousRandom;
    }
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
      learner: sessionPupilName(),
      pupil_alias: sessionPupilAlias(),
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
      schema_version: DATA_SCHEMA_VERSION,
      skill_graph_version: SKILL_GRAPH_VERSION,
      skill_ids: skillIdsForTask(question.kind),
      lesson_plan_id: currentLessonPlanId(),
      lesson_seed: question.lessonSeed == null ? null : question.lessonSeed,
      question_seed: question.questionSeed == null ? null : question.questionSeed,
      generator_version: GENERATOR_VERSION,
      generator_mode: question.generatorMode || 'legacy-stochastic',
      generator_constraints: generatorConstraintsForQuestion(question),
      learner: sessionPupilName(),
      learner_alias: sessionPupilAlias(),
      level: state.currentLevel,
      question_index: question.questionIndex,
      attempt_index: attemptIndex,
      repeat_count: Math.max(0, attemptIndex - 1),
      task_family: question.family,
      task_kind: question.kind,
      task_variant: question.variantId || '',
      variant_label: question.variantLabel || '',
      attention_domain: question.attentionDomain || '',
      research_condition: state.sessionSnapshot && state.sessionSnapshot.study_protocol
        ? state.sessionSnapshot.study_protocol.research_condition
        : researchCondition(),
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
      reference_category: question.referenceCategory || '',
      reference_category_label: question.referenceCategoryLabel || '',
      category_relation: question.categoryRelation || '',
      target_source: question.target ? normalizeImageSource(question.target.source) : '',
      cue_id: question.cueOption ? question.cueOption.id : '',
      cue_label: question.cueOption ? question.cueOption.label : '',
      cue_category: question.cueCategory || (question.cueOption && canonicalCategoryId(question.cueOption.category)) || '',
      cue_category_label: question.cueCategory ? categoryMeta(question.cueCategory).label : '',
      cue_source: question.cueOption ? normalizeImageSource(question.cueOption.source) : '',
      cue_metadata: question.cueOption ? contentOptionMetadata(question.cueOption) : null,
      prompt_wording: question.prompt || '',
      option_labels: Array.isArray(question.options) ? question.options.map(option => option.label || '').filter(Boolean) : [],
      option_metadata: Array.isArray(question.options) ? question.options.map(contentOptionMetadata) : [],
      photo_labels_used: Array.from(new Set((Array.isArray(question.options) ? question.options : [])
        .concat(question.cueOption ? [question.cueOption] : [])
        .filter(option => option && option.src)
        .map(option => option.label || '')
        .filter(Boolean))),
      content_configuration: question.contentConfiguration || null,
      procedural_variant: question.proceduralVariant || '',
      discrimination_contrast: question.discriminationContrast || '',
      open_ended_choice: !!question.openEndedChoice,
      scored_response: !question.openEndedChoice,
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
      data_governance: dataGovernanceSnapshot(),
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
    const question = state.currentQuestion;
    const targetNode = question.openEndedChoice ? null : getCurrentTargetButton();
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
    } else if(question.promptPreviewOption || question.target){
      const previewOption = question.promptPreviewOption || question.target;
      const card = document.createElement('div');
      card.className = 'bigCard';
      card.appendChild(buildChoiceMediaElement(previewOption, previewOption.src ? 'imgCircle' : 'faceCircle'));
      const label = document.createElement('div');
      label.textContent = question.promptPreviewText || previewOption.label;
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

    if(question.kind === 'match-category' && question.cueOption){
      const cueCard = document.createElement('div');
      cueCard.className = 'bigCard matchCueCard';
      cueCard.dataset.cueId = question.cueOption.id;
      cueCard.setAttribute('aria-label', `Match with ${question.cueOption.label}`);
      const cueLead = document.createElement('div');
      cueLead.className = 'choiceSmall';
      cueLead.textContent = 'Match with';
      const cueLabel = document.createElement('div');
      cueLabel.className = 'choiceLabel';
      cueLabel.textContent = question.cueOption.label;
      setNodeChildren(cueCard, buildChoiceMediaElement(question.cueOption, 'choiceMedia'), cueLead, cueLabel);
      ui.choiceGrid.appendChild(cueCard);
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
    const targetNode = question.openEndedChoice ? null : getCurrentTargetButton();
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
    const playRect = ui.playArea.getBoundingClientRect();
    const targetPlayPoint = targetCentre
      ? { x: targetCentre.x - playRect.left, y: targetCentre.y - playRect.top }
      : null;
    const targetDelta = targetPlayPoint
      ? { x: playPoint.x - targetPlayPoint.x, y: playPoint.y - targetPlayPoint.y }
      : null;
    const playDiagonal = Math.hypot(playRect.width, playRect.height);

    let correct = option.id === question.correctId;
    let commission = !correct;
    let omission = false;
    let responseType = correct ? 'hit' : 'incorrect-selection';

    if(question.kind === 'touch-screen'){
      correct = true;
      commission = false;
      responseType = 'panel-touch';
    }
    if(question.openEndedChoice){
      correct = true;
      commission = false;
      responseType = 'preference-selection';
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
        target_play_x: targetPlayPoint ? Number(targetPlayPoint.x.toFixed(2)) : null,
        target_play_y: targetPlayPoint ? Number(targetPlayPoint.y.toFixed(2)) : null,
        target_width_px: targetCentre ? Number(targetCentre.rect.width.toFixed(2)) : null,
        target_height_px: targetCentre ? Number(targetCentre.rect.height.toFixed(2)) : null,
        touch_delta_x_px: targetDelta ? Number(targetDelta.x.toFixed(2)) : null,
        touch_delta_y_px: targetDelta ? Number(targetDelta.y.toFixed(2)) : null,
        play_area_width_px: Number(playRect.width.toFixed(2)),
        play_area_height_px: Number(playRect.height.toFixed(2)),
        raw_distance_to_target_px: rawDistance == null ? null : Number(rawDistance.toFixed(2)),
        distance_to_target_px: distance == null ? null : Number(distance.toFixed(2)),
        distance_to_target_play_diagonal: rawDistance == null || !playDiagonal
          ? null
          : Number((rawDistance / playDiagonal).toFixed(5)),
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
    const question = buildSeededQuestion(state.questionIndex);
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
    endSession('learner-stop');
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
      endSession(state.questionIndex >= state.totalQuestions ? 'planned-questions-complete' : 'session-time-limit');
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
      const key = `${trial.session_id || 'current'}|${trial.question_index}`;
      const existing = byQuestion.get(key);
      if(!existing || (trial.attempt_index || 1) >= (existing.attempt_index || 1)){
        byQuestion.set(key, trial);
      }
    });
    return Array.from(byQuestion.values()).sort((a, b) => {
      const sessionOrder = String(a.session_id || '').localeCompare(String(b.session_id || ''));
      return sessionOrder || a.question_index - b.question_index;
    });
  }

  function finiteTrialValues(trials, field){
    return trials.map(trial => trial[field]).filter(value => Number.isFinite(value));
  }

  function median(values){
    if(!values.length) return null;
    const sorted = values.slice().sort((a, b) => a - b);
    const middle = Math.floor(sorted.length / 2);
    return sorted.length % 2 ? sorted[middle] : (sorted[middle - 1] + sorted[middle]) / 2;
  }

  function researchSummaryForTrials(trials, generatedAtWallMs=wallMs()){
    const finalTrials = latestTrialsByQuestion(Array.isArray(trials) ? trials : []);
    const bySkill = new Map();
    let missingSkillAssignments = 0;

    finalTrials.forEach(trial => {
      const assigned = Array.isArray(trial.skill_ids) && trial.skill_ids.length
        ? trial.skill_ids.filter(skillId => SKILL_GRAPH[skillId])
        : skillIdsForTask(trial.task_kind);
      if(!assigned.length) missingSkillAssignments += 1;

      assigned.forEach(skillId => {
        if(!bySkill.has(skillId)){
          bySkill.set(skillId, {
            skill_id: skillId,
            label: SKILL_GRAPH[skillId].label,
            opportunities: 0,
            scored_opportunities: 0,
            response_count: 0,
            correct: 0,
            incorrect: 0,
            omissions: 0,
            commissions: 0,
            correct_rejections: 0,
            independent_responses: 0,
            assisted_responses: 0,
            independent_correct: 0,
            assisted_correct: 0,
            support_code_counts: {},
            prompt_levels: [],
            response_times: [],
            touch_distances: [],
            observed_times: []
          });
        }
        const item = bySkill.get(skillId);
        const scored = skillId !== 'choice.preference';
        const responded = !trial.omission && (trial.response_type != null || trial.selected_id || trial.correct_rejection);
        const assisted = trial.independence_status && trial.independence_status !== 'independent';
        item.opportunities += 1;
        if(scored){
          item.scored_opportunities += 1;
          if(trial.correct) item.correct += 1;
          else item.incorrect += 1;
          if(trial.correct && assisted) item.assisted_correct += 1;
          if(trial.correct && !assisted) item.independent_correct += 1;
        }
        if(responded){
          item.response_count += 1;
          if(assisted) item.assisted_responses += 1;
          else item.independent_responses += 1;
        }
        if(trial.omission) item.omissions += 1;
        if(trial.commission) item.commissions += 1;
        if(trial.correct_rejection) item.correct_rejections += 1;
        const supportCode = trial.support_code || 'unknown';
        item.support_code_counts[supportCode] = (item.support_code_counts[supportCode] || 0) + 1;
        if(Number.isFinite(trial.highest_prompt_level)) item.prompt_levels.push(trial.highest_prompt_level);
        if(Number.isFinite(trial.response_time_ms)) item.response_times.push(trial.response_time_ms);
        if(Number.isFinite(trial.distance_to_target_px)) item.touch_distances.push(trial.distance_to_target_px);
        [trial.cue_onset_wall_ms, trial.stimulus_onset_wall_ms, trial.response_wall_ms]
          .filter(Number.isFinite)
          .forEach(value => item.observed_times.push(value));
      });
    });

    const skillSummaries = Array.from(bySkill.values()).map(item => ({
      skill_id: item.skill_id,
      label: item.label,
      opportunities: item.opportunities,
      scored_opportunities: item.scored_opportunities,
      response_count: item.response_count,
      correct: item.correct,
      incorrect: item.incorrect,
      accuracy_pct: item.scored_opportunities ? Math.round((item.correct / item.scored_opportunities) * 100) : null,
      omissions: item.omissions,
      commissions: item.commissions,
      correct_rejections: item.correct_rejections,
      independent_responses: item.independent_responses,
      assisted_responses: item.assisted_responses,
      independent_correct: item.independent_correct,
      assisted_correct: item.assisted_correct,
      support_code_counts: item.support_code_counts,
      highest_prompt_level: item.prompt_levels.length ? Math.max(...item.prompt_levels) : null,
      median_reaction_time_ms: item.response_times.length ? Math.round(median(item.response_times)) : null,
      reaction_time_variability_ms: item.response_times.length > 1 ? Math.round(standardDeviation(item.response_times)) : null,
      mean_touch_distance_px: item.touch_distances.length ? Number(mean(item.touch_distances).toFixed(2)) : null,
      first_observed_wall_ms: item.observed_times.length ? Math.min(...item.observed_times) : null,
      last_observed_wall_ms: item.observed_times.length ? Math.max(...item.observed_times) : null
    })).sort((a, b) => a.skill_id.localeCompare(b.skill_id));

    const responseExpected = finalTrials.filter(trial => !trial.omission && !trial.correct_rejection);
    return {
      version: RESEARCH_SUMMARY_VERSION,
      generated_at_wall_ms: generatedAtWallMs,
      skill_graph_version: SKILL_GRAPH_VERSION,
      generator_version: GENERATOR_VERSION,
      source_trial_count: Array.isArray(trials) ? trials.length : 0,
      final_trial_count: finalTrials.length,
      skill_summaries: skillSummaries,
      data_quality: {
        missing_skill_assignment_count: missingSkillAssignments,
        response_time_observed_count: finiteTrialValues(finalTrials, 'response_time_ms').length,
        response_time_missing_when_expected_count: responseExpected.filter(trial => !Number.isFinite(trial.response_time_ms)).length,
        touch_distance_observed_count: finiteTrialValues(finalTrials, 'distance_to_target_px').length,
        context_note_trial_count: finalTrials.filter(trial => String(trial.context_notes || '').trim()).length
      },
      interpretation_boundary: 'Descriptive practice data only; not a diagnostic, mastery, transfer, or neural-plasticity measure.'
    };
  }

  function sessionObservedAt(session){
    const direct = Number(session && session.updated_at_wall_ms);
    if(Number.isFinite(direct)) return direct;
    const trialTimes = latestTrialsByQuestion((session && session.trials) || [])
      .flatMap(trial => [trial.response_wall_ms, trial.stimulus_onset_wall_ms, trial.cue_onset_wall_ms])
      .filter(Number.isFinite);
    return trialTimes.length ? Math.max(...trialTimes) : null;
  }

  function percentage(numerator, denominator){
    return denominator > 0 ? Math.round((numerator / denominator) * 100) : null;
  }

  function practiceStatusLabel(status){
    const labels = {
      'not-scored': 'Not scored',
      'insufficient-sample': 'More observations needed',
      'needs-support': 'Needs additional support',
      developing: 'Developing in current sample',
      'consistent-current-sample': 'Consistent in current sample'
    };
    return labels[status] || status;
  }

  function retentionStatusLabel(status){
    const labels = {
      'not-observed': 'No spaced check observed',
      'spaced-sample-small': 'Spaced sample too small',
      'observed-lower': 'Lower at spaced observation',
      'observed-similar': 'Similar at spaced observation',
      'observed-higher': 'Higher at spaced observation'
    };
    return labels[status] || status;
  }

  function trendStatusLabel(status){
    const labels = {
      'not-enough-data': 'Not enough data',
      lower: 'Lower in latest observation',
      similar: 'Broadly similar',
      higher: 'Higher in latest observation'
    };
    return labels[status] || status;
  }

  function supportDirectionLabel(status){
    const labels = {
      'consider-fading-one-step': 'Consider fading one prompt step',
      'hold-current-support': 'Hold current support',
      'increase-or-simplify': 'Increase support or simplify demand',
      'observe-before-changing': 'Observe before changing support'
    };
    return labels[status] || status;
  }

  function skillPracticeStatesForSessions(sessions, generatedAtWallMs=wallMs()){
    const ordered = (Array.isArray(sessions) ? sessions : [])
      .map(session => ({ session, observedAt: sessionObservedAt(session) }))
      .filter(item => Number.isFinite(item.observedAt))
      .sort((a, b) => a.observedAt - b.observedAt);
    const bySkill = new Map();

    ordered.forEach(({ session, observedAt }) => {
      const summary = researchSummaryForTrials(session.trials || [], observedAt);
      summary.skill_summaries.forEach(skill => {
        if(!bySkill.has(skill.skill_id)){
          bySkill.set(skill.skill_id, {
            skill_id: skill.skill_id,
            label: skill.label,
            observations: []
          });
        }
        bySkill.get(skill.skill_id).observations.push({
          session_id: session.session_id || '',
          observed_at_wall_ms: observedAt,
          level: session.summary && Number.isFinite(session.summary.current_level)
            ? session.summary.current_level
            : null,
          opportunities: skill.opportunities,
          scored_opportunities: skill.scored_opportunities,
          correct: skill.correct,
          independent_correct: skill.independent_correct,
          assisted_correct: skill.assisted_correct,
          omissions: skill.omissions,
          commissions: skill.commissions,
          median_reaction_time_ms: skill.median_reaction_time_ms,
          highest_prompt_level: skill.highest_prompt_level
        });
      });
    });

    return Array.from(bySkill.values()).map(item => {
      const observations = item.observations;
      const recent = observations.slice(-3);
      const totalOpportunities = observations.reduce((sum, entry) => sum + entry.opportunities, 0);
      const totalScored = observations.reduce((sum, entry) => sum + entry.scored_opportunities, 0);
      const recentScored = recent.reduce((sum, entry) => sum + entry.scored_opportunities, 0);
      const recentCorrect = recent.reduce((sum, entry) => sum + entry.correct, 0);
      const recentIndependent = recent.reduce((sum, entry) => sum + entry.independent_correct, 0);
      const recentAccuracy = percentage(recentCorrect, recentScored);
      const recentIndependentPct = percentage(recentIndependent, recentScored);
      const recentOmissions = recent.reduce((sum, entry) => sum + entry.omissions, 0);
      const recentCommissions = recent.reduce((sum, entry) => sum + entry.commissions, 0);
      const latest = observations[observations.length - 1];
      const daysSince = Number.isFinite(latest.observed_at_wall_ms)
        ? Math.max(0, Math.floor((generatedAtWallMs - latest.observed_at_wall_ms) / 86400000))
        : null;

      let practiceStatus = 'not-scored';
      if(totalScored > 0){
        if(totalScored < 5 || observations.length < 2) practiceStatus = 'insufficient-sample';
        else if(recentAccuracy != null && recentAccuracy < 60) practiceStatus = 'needs-support';
        else if(recentScored >= 8 && recentAccuracy >= 80 && recentIndependentPct >= 70) practiceStatus = 'consistent-current-sample';
        else practiceStatus = 'developing';
      }

      let trendStatus = 'not-enough-data';
      if(observations.length >= 2){
        const first = observations[0];
        const firstAccuracy = percentage(first.correct, first.scored_opportunities);
        const latestAccuracy = percentage(latest.correct, latest.scored_opportunities);
        if(firstAccuracy != null && latestAccuracy != null && first.scored_opportunities >= 2 && latest.scored_opportunities >= 2){
          const difference = latestAccuracy - firstAccuracy;
          trendStatus = difference >= 10 ? 'higher' : difference <= -10 ? 'lower' : 'similar';
        }
      }

      let retentionStatus = 'not-observed';
      let retentionGapDays = null;
      let retentionDifferencePct = null;
      for(let laterIndex = observations.length - 1; laterIndex > 0; laterIndex -= 1){
        const later = observations[laterIndex];
        const earlier = observations.slice(0, laterIndex).reverse().find(candidate => (
          later.observed_at_wall_ms - candidate.observed_at_wall_ms >= 7 * 86400000
        ));
        if(!earlier) continue;
        retentionGapDays = Math.floor((later.observed_at_wall_ms - earlier.observed_at_wall_ms) / 86400000);
        if(earlier.scored_opportunities < 3 || later.scored_opportunities < 3){
          retentionStatus = 'spaced-sample-small';
        } else {
          const earlierAccuracy = percentage(earlier.correct, earlier.scored_opportunities);
          const laterAccuracy = percentage(later.correct, later.scored_opportunities);
          retentionDifferencePct = laterAccuracy - earlierAccuracy;
          retentionStatus = retentionDifferencePct >= 10
            ? 'observed-higher'
            : retentionDifferencePct <= -10
              ? 'observed-lower'
              : 'observed-similar';
        }
        break;
      }

      let supportDirection = 'observe-before-changing';
      if(recentScored >= 5){
        if(recentAccuracy >= 80 && recentIndependentPct >= 70) supportDirection = 'consider-fading-one-step';
        else if(recentAccuracy != null && (recentAccuracy < 60 || recentOmissions + recentCommissions > 0)) supportDirection = 'increase-or-simplify';
        else supportDirection = 'hold-current-support';
      }

      return {
        version: PRACTICE_STATUS_VERSION,
        skill_id: item.skill_id,
        label: item.label,
        practice_status: practiceStatus,
        practice_status_label: practiceStatusLabel(practiceStatus),
        sessions_observed: observations.length,
        opportunities: totalOpportunities,
        scored_opportunities: totalScored,
        recent_window_sessions: recent.length,
        recent_scored_opportunities: recentScored,
        recent_accuracy_pct: recentAccuracy,
        recent_independent_success_pct: recentIndependentPct,
        recent_omissions: recentOmissions,
        recent_commissions: recentCommissions,
        last_practised_wall_ms: latest.observed_at_wall_ms,
        days_since_last_practice: daysSince,
        trend_status: trendStatus,
        trend_status_label: trendStatusLabel(trendStatus),
        retention_status: retentionStatus,
        retention_status_label: retentionStatusLabel(retentionStatus),
        retention_gap_days: retentionGapDays,
        retention_difference_pct: retentionDifferencePct,
        support_direction: supportDirection,
        support_direction_label: supportDirectionLabel(supportDirection),
        observations
      };
    }).sort((a, b) => a.skill_id.localeCompare(b.skill_id));
  }

  function preferredTaskKindForSkill(skillId){
    const preferredOrder = [
      'touch-screen', 'touch-object', 'moving-target', 'find-object', 'discriminate-object', 'find-category',
      'match-category', 'category-exclusion', 'choice-preference', 'cpat-sustained', 'cpat-selective', 'cpat-orienting', 'cpat-executive'
    ];
    return preferredOrder.find(kind => (TASK_SKILL_IDS[kind] || []).includes(skillId)) || 'auto';
  }

  function latestLevelFromSessions(sessions){
    const ordered = (Array.isArray(sessions) ? sessions : [])
      .slice()
      .sort((a, b) => Number(sessionObservedAt(a) || 0) - Number(sessionObservedAt(b) || 0));
    const latest = ordered[ordered.length - 1];
    if(!latest) return state.currentLevel;
    if(latest.summary && Number.isFinite(latest.summary.current_level)) return latest.summary.current_level;
    const trial = latestTrialsByQuestion(latest.trials || []).slice(-1)[0];
    return trial && Number.isFinite(trial.level) ? trial.level : state.currentLevel;
  }

  function recommendationActionLabel(action){
    const labels = {
      'collect-baseline': 'Collect a short baseline',
      'run-spaced-check': 'Run a spaced retention check',
      'strengthen-support': 'Strengthen support and simplify demand',
      'continue-practice': 'Continue focused practice',
      'extend-practice': 'Consider extending to the next linked skill'
    };
    return labels[action] || action;
  }

  function recommendationForSessions(sessions, learnerAlias=currentPupilAlias(), generatedAtWallMs=wallMs()){
    const usableSessions = Array.isArray(sessions) ? sessions : [];
    const states = skillPracticeStatesForSessions(usableSessions, generatedAtWallMs);
    const scoredStates = states.filter(item => item.scored_opportunities > 0);
    let selected = null;
    let action = 'collect-baseline';
    const rationaleCodes = [];
    const rationale = [];

    const dueRetention = scoredStates
      .filter(item => item.days_since_last_practice >= 7)
      .sort((a, b) => b.days_since_last_practice - a.days_since_last_practice)[0];
    const needsSupport = scoredStates
      .filter(item => item.practice_status === 'needs-support')
      .sort((a, b) => (a.recent_accuracy_pct || 0) - (b.recent_accuracy_pct || 0))[0];
    const developing = scoredStates
      .filter(item => ['developing', 'insufficient-sample'].includes(item.practice_status))
      .sort((a, b) => a.scored_opportunities - b.scored_opportunities)[0];
    const consistent = scoredStates
      .filter(item => item.practice_status === 'consistent-current-sample')
      .sort((a, b) => b.recent_independent_success_pct - a.recent_independent_success_pct)[0];

    if(dueRetention){
      selected = dueRetention;
      action = 'run-spaced-check';
      rationaleCodes.push('SPACED_CHECK_DUE');
      rationale.push(`${dueRetention.label} was last observed ${dueRetention.days_since_last_practice} day(s) ago; a short check can provide an observed retention comparison.`);
    } else if(needsSupport){
      selected = needsSupport;
      action = 'strengthen-support';
      rationaleCodes.push('RECENT_ACCURACY_BELOW_60');
      rationale.push(`${needsSupport.label} has ${needsSupport.recent_accuracy_pct}% accuracy in the latest three-session window.`);
      if(needsSupport.recent_omissions > 0) {
        rationaleCodes.push('RECENT_OMISSIONS');
        rationale.push(`${needsSupport.recent_omissions} omission(s) were observed in that window.`);
      }
    } else if(developing){
      selected = developing;
      action = 'continue-practice';
      rationaleCodes.push(developing.practice_status === 'insufficient-sample' ? 'MORE_OBSERVATIONS_NEEDED' : 'DEVELOPING_CURRENT_SAMPLE');
      rationale.push(`${developing.label} needs more repeated observations before support or progression is changed.`);
    } else if(consistent){
      selected = consistent;
      action = 'extend-practice';
      rationaleCodes.push('CONSISTENT_CURRENT_SAMPLE');
      rationale.push(`${consistent.label} is consistent in the current sample with ${consistent.recent_accuracy_pct}% recent accuracy and ${consistent.recent_independent_success_pct}% independent success.`);
    } else {
      rationaleCodes.push('NO_SCORED_HISTORY');
      rationale.push('No scored skill history is available for a longitudinal proposal yet.');
    }

    const recommendedLevel = clamp(latestLevelFromSessions(usableSessions), 1, 10);
    const recommendedTask = selected ? preferredTaskKindForSkill(selected.skill_id) : 'auto';
    const sessionIds = usableSessions.map(session => session.session_id).filter(Boolean).sort();
    const idSeed = [
      RECOMMENDATION_VERSION, learnerAlias, sessionIds.join(','), action,
      selected ? selected.skill_id : 'baseline', recommendedTask, recommendedLevel
    ].join('|');
    return {
      recommendation_id: `rec-${hashStringToSeed(idSeed).toString(16).padStart(8, '0')}`,
      version: RECOMMENDATION_VERSION,
      generated_at_wall_ms: generatedAtWallMs,
      learner_alias: learnerAlias,
      source_session_ids: sessionIds,
      action,
      action_label: recommendationActionLabel(action),
      skill_id: selected ? selected.skill_id : null,
      skill_label: selected ? selected.label : 'General baseline',
      recommended_task_kind: recommendedTask,
      recommended_task_label: recommendedTask === 'auto' ? 'Auto level path' : taskLabel(recommendedTask),
      recommended_level: recommendedLevel,
      support_direction: selected ? selected.support_direction : 'observe-before-changing',
      support_direction_label: selected ? selected.support_direction_label : supportDirectionLabel('observe-before-changing'),
      rationale_codes: rationaleCodes,
      rationale,
      metrics_snapshot: selected ? {
        practice_status: selected.practice_status,
        sessions_observed: selected.sessions_observed,
        scored_opportunities: selected.scored_opportunities,
        recent_accuracy_pct: selected.recent_accuracy_pct,
        recent_independent_success_pct: selected.recent_independent_success_pct,
        days_since_last_practice: selected.days_since_last_practice,
        retention_status: selected.retention_status
      } : null,
      review_required: true,
      external_transmission: false,
      interpretation_boundary: 'Planning proposal only. A teacher must review it; it is not a diagnostic, mastery, transfer, or neural-plasticity conclusion.'
    };
  }

  function planningSessionsForLearner(learnerName=currentPupilName(), learnerAlias=currentPupilAlias()){
    const sessions = state.history.sessions
      .filter(session => session.session_id !== state.sessionId)
      .filter(session => sessionMatchesLearner(session, learnerName, learnerAlias));
    if(state.trials.length && sessionPupilName() === learnerName){
      sessions.push({
        session_id: state.sessionId,
        learner: sessionPupilName(),
        learner_alias: sessionPupilAlias(),
        updated_at_wall_ms: wallMs(),
        summary: analyticsSummary(),
        trials: state.trials.slice()
      });
    }
    return sessions.sort((a, b) => Number(sessionObservedAt(a) || 0) - Number(sessionObservedAt(b) || 0));
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
      learner: sessionPupilName(),
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

  function currentSessionTimingSnapshot(){
    const completedQuestions = latestTrialsByQuestion(state.trials).length;
    const plannedQuestions = Math.max(0, Number(state.totalQuestions) || 0);
    const startedAt = Number.isFinite(state.sessionStartMs) && state.sessionStartMs > 0
      ? state.sessionStartMs
      : null;
    const endedAt = Number.isFinite(state.sessionEndMs) && state.sessionEndMs > 0
      ? state.sessionEndMs
      : null;
    const durationEnd = endedAt || (startedAt && state.phase !== 'idle' ? wallMs() : null);
    const durationMs = startedAt && durationEnd
      ? Math.max(0, durationEnd - startedAt)
      : null;
    const completionPct = plannedQuestions
      ? Math.round((Math.min(completedQuestions, plannedQuestions) / plannedQuestions) * 100)
      : null;
    return {
      started_at_wall_ms: startedAt,
      ended_at_wall_ms: endedAt,
      duration_ms: durationMs,
      planned_questions: plannedQuestions,
      completed_questions: completedQuestions,
      completion_pct: completionPct,
      completion_status: endedAt
        ? (state.sessionEndedEarly ? 'stopped-early' : state.sessionEndReason === 'session-time-limit' ? 'time-limit' : 'completed')
        : startedAt ? 'in-progress' : 'not-started',
      end_reason: state.sessionEndReason || null
    };
  }

  function buildSessionRecord(){
    const summary = analyticsSummary();
    const snapshot = state.sessionSnapshot;
    const protocol = snapshot && snapshot.study_protocol
      ? clonePlain(snapshot.study_protocol)
      : studyProtocolSnapshot(currentResearchParticipantId());
    return {
      session_id: state.sessionId,
      learner: sessionPupilName(),
      learner_alias: sessionPupilAlias(),
      build: buildExportMeta(),
      schema_version: DATA_SCHEMA_VERSION,
      skill_graph_version: SKILL_GRAPH_VERSION,
      generator_version: GENERATOR_VERSION,
      research_summary_version: RESEARCH_SUMMARY_VERSION,
      practice_status_version: PRACTICE_STATUS_VERSION,
      recommendation_version: RECOMMENDATION_VERSION,
      lesson_plan_id: currentLessonPlanId(),
      lesson_seed: state.lessonSeed,
      lesson_plan: lessonPlanSnapshot(),
      skill_graph: skillGraphSnapshot(),
      settings: snapshot ? clonePlain(snapshot.settings) : settingsSnapshot(),
      learner_snapshot: snapshot ? clonePlain(snapshot.learner_profile) : currentLearnerRecord(),
      session_timing: currentSessionTimingSnapshot(),
      summary,
      research_summary: researchSummaryForTrials(state.trials),
      fidelity: fidelitySnapshot(),
      research_condition: protocol.research_condition,
      protocol_condition_id: protocol.protocol_condition_id || null,
      fixed_condition: protocol.fixed_condition ? clonePlain(protocol.fixed_condition) : null,
      study_protocol: protocol,
      eeg_markers: state.eeg.markers.slice(),
      eeg_marker_diagnostics: markerDiagnostics({
        trials: state.trials,
        eeg_markers: state.eeg.markers,
        study_protocol: protocol
      }),
      block_summaries: buildBlockSummaries(),
      events: state.logs.slice(),
      trials: state.trials.slice(),
      context_notes: snapshot ? snapshot.context_notes : currentContextNotes(),
      classroom_transfer_notes: snapshot ? snapshot.classroom_transfer_notes : (ui.classroomTransferNotes.value || ''),
      theme_used: snapshot ? snapshot.theme_used : currentThemeChoice(),
      sensory_preferences: snapshot ? clonePlain(snapshot.sensory_preferences) : sensoryPreferenceSnapshot(),
      student_friendly_mode: snapshot ? snapshot.student_friendly_mode : studentFriendlyModeEnabled(),
      data_governance: snapshot && snapshot.data_governance
        ? clonePlain(snapshot.data_governance)
        : dataGovernanceSnapshot(),
      content_configuration: exportableContentConfiguration(),
      local_recommendation_summary: buildLocalRecommendationSummary(summary),
      photo_library_metadata: snapshot ? clonePlain(snapshot.photo_library_metadata) : photoLibraryMetadata(),
      archived: false,
      updated_at_wall_ms: wallMs()
    };
  }

  async function persistCurrentSession(){
    if(!state.trials.length && state.phase !== 'complete') return;
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
      communicationMode: ui.communicationMode.value,
      motorAccessMode: ui.motorAccessMode.value,
      adaptiveFunctioningBand: ui.adaptiveFunctioningBand.value,
      teacherAttentionRating: safeNumber(ui.teacherAttentionRating.value, 3),
      teacherIndependenceRating: safeNumber(ui.teacherIndependenceRating.value, 3),
      eegParticipation: ui.eegParticipation.value,
      aacPreference: ui.aacPreference.value,
      dataUseStatus: ui.dataUseStatus ? ui.dataUseStatus.value : 'not-recorded',
      researchAnalysisApproved: !!(ui.researchAnalysisApproved && ui.researchAnalysisApproved.checked),
      eegLinkageApproved: !!(ui.eegLinkageApproved && ui.eegLinkageApproved.checked),
      modelDevelopmentApproved: !!(ui.modelDevelopmentApproved && ui.modelDevelopmentApproved.checked),
      governanceReference: ui.governanceReference ? ui.governanceReference.value.trim() : '',
      governanceReviewDate: ui.governanceReviewDate ? ui.governanceReviewDate.value : '',
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
    ui.communicationMode.value = baseline.communicationMode || baseline.communication_mode || SESSION_CONTEXT_DEFAULTS.communicationMode;
    ui.motorAccessMode.value = baseline.motorAccessMode || baseline.motor_access_mode || SESSION_CONTEXT_DEFAULTS.motorAccessMode;
    ui.adaptiveFunctioningBand.value = baseline.adaptiveFunctioningBand || baseline.adaptive_functioning_band || SESSION_CONTEXT_DEFAULTS.adaptiveFunctioningBand;
    ui.teacherAttentionRating.value = baseline.teacherAttentionRating || baseline.teacher_attention_rating || SESSION_CONTEXT_DEFAULTS.teacherAttentionRating;
    ui.teacherIndependenceRating.value = baseline.teacherIndependenceRating || baseline.teacher_independence_rating || SESSION_CONTEXT_DEFAULTS.teacherIndependenceRating;
    ui.eegParticipation.value = baseline.eegParticipation || baseline.eeg_participation || SESSION_CONTEXT_DEFAULTS.eegParticipation;
    if(ui.dataUseStatus) ui.dataUseStatus.value = baseline.dataUseStatus || SESSION_CONTEXT_DEFAULTS.dataUseStatus;
    if(ui.researchAnalysisApproved) ui.researchAnalysisApproved.checked = baseline.researchAnalysisApproved === true;
    if(ui.eegLinkageApproved) ui.eegLinkageApproved.checked = baseline.eegLinkageApproved === true;
    if(ui.modelDevelopmentApproved) ui.modelDevelopmentApproved.checked = baseline.modelDevelopmentApproved === true;
    if(ui.governanceReference) ui.governanceReference.value = baseline.governanceReference || '';
    if(ui.governanceReviewDate) ui.governanceReviewDate.value = baseline.governanceReviewDate || '';
    ui.aacPreference.value = baseline.aacPreference || baseline.aac_preference || SESSION_CONTEXT_DEFAULTS.aacPreference;
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
    updateAiExportGovernanceStatus();
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

  function researchSessionsInScope(){
    const scope = ui.researchScopeSelect ? ui.researchScopeSelect.value : 'current-learner';
    if(scope === 'current-session') return state.trials.length ? [buildSessionRecord()] : [];
    const includeArchived = !!(ui.researchIncludeArchived && ui.researchIncludeArchived.checked);
    const learner = currentPupilName();
    return getKnownSessionRecords(true)
      .filter(session => includeArchived || !session.archived)
      .filter(session => scope !== 'current-learner' || sessionMatchesLearner(session, learner, currentPupilAlias()))
      .sort((a, b) => Number(a.updated_at_wall_ms || 0) - Number(b.updated_at_wall_ms || 0));
  }

  function fixedConditionResearchRow(session){
    const protocol = session && session.study_protocol && typeof session.study_protocol === 'object'
      ? session.study_protocol
      : {};
    const fixed = session && session.fixed_condition && typeof session.fixed_condition === 'object'
      ? session.fixed_condition
      : (protocol.fixed_condition && typeof protocol.fixed_condition === 'object' ? protocol.fixed_condition : {});
    const enabled = fixed.enabled === true;
    const manifestSettings = fixed.manifest && fixed.manifest.settings ? fixed.manifest.settings : {};
    return {
      date: researchDateLabel(Number(session && session.updated_at_wall_ms)),
      protocol_condition_id: enabled
        ? (fixed.protocol_condition_id || protocol.protocol_condition_id || session.protocol_condition_id || 'Missing')
        : null,
      research_condition: protocol.research_condition || session.research_condition || 'not recorded',
      enabled,
      adherence_status: enabled ? (fixed.adherence_status || 'not-recorded') : 'not-enabled',
      lesson_replay_seed: Number.isFinite(manifestSettings.lesson_replay_seed)
        ? manifestSettings.lesson_replay_seed
        : (Number.isFinite(session && session.lesson_seed) ? session.lesson_seed : null),
      settings_fingerprint: fixed.settings_fingerprint || (fixed.manifest && fixed.manifest.settings_fingerprint) || null,
      changed_fields: Array.isArray(fixed.changed_fields) ? fixed.changed_fields.slice() : []
    };
  }

  function researchDateLabel(timestamp){
    if(!Number.isFinite(timestamp)) return 'Unknown';
    const date = new Date(timestamp);
    if(Number.isNaN(date.getTime())) return 'Unknown';
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  }

  function appendResearchRow(body, values){
    const row = document.createElement('tr');
    values.forEach(value => {
      const cell = document.createElement('td');
      cell.textContent = value == null || value === '' ? '--' : String(value);
      row.appendChild(cell);
    });
    body.appendChild(row);
  }

  function renderResearchEmptyRow(body, columns, text='No data in this scope yet.'){
    clearNode(body);
    const row = document.createElement('tr');
    const cell = document.createElement('td');
    cell.colSpan = columns;
    cell.className = 'tiny';
    cell.textContent = text;
    row.appendChild(cell);
    body.appendChild(row);
  }

  function sessionTrendRow(session){
    const finalTrials = latestTrialsByQuestion(session.trials || []);
    const scored = finalTrials.filter(trial => !skillIdsForTask(trial.task_kind).includes('choice.preference'));
    const responded = finalTrials.filter(trial => !trial.omission);
    const supportObserved = responded.filter(trial => ['independent', 'prompted', 'assisted'].includes(trial.independence_status));
    const independent = supportObserved.filter(trial => trial.independence_status === 'independent');
    const responseTimes = finiteTrialValues(finalTrials, 'response_time_ms');
    const touchDistances = finiteTrialValues(finalTrials, 'distance_to_target_px');
    const accuracy = scored.length ? Math.round((scored.filter(trial => trial.correct).length / scored.length) * 100) : null;
    return {
      session,
      date: researchDateLabel(Number(session.updated_at_wall_ms)),
      learner: session.learner_alias || session.learner || 'Unknown',
      level: session.summary && Number.isFinite(session.summary.current_level)
        ? session.summary.current_level
        : (finalTrials[0] && finalTrials[0].level) || null,
      trials: finalTrials.length,
      accuracy_pct: accuracy,
      independent_pct: supportObserved.length ? Math.round((independent.length / supportObserved.length) * 100) : null,
      median_rt_ms: responseTimes.length ? Math.round(median(responseTimes)) : null,
      rt_observed_count: responseTimes.length,
      rt_variability_ms: responseTimes.length > 1 ? Math.round(standardDeviation(responseTimes)) : null,
      omissions: finalTrials.filter(trial => trial.omission).length,
      commissions: finalTrials.filter(trial => trial.commission).length,
      omission_pct: finalTrials.length ? Math.round((finalTrials.filter(trial => trial.omission).length / finalTrials.length) * 100) : null,
      commission_pct: finalTrials.length ? Math.round((finalTrials.filter(trial => trial.commission).length / finalTrials.length) * 100) : null,
      touch_observed_count: touchDistances.length,
      mean_touch_distance_px: touchDistances.length ? Number(mean(touchDistances).toFixed(1)) : null
    };
  }

  function sessionEvent(session, type){
    const events = Array.isArray(session.events) ? session.events : [];
    return events.find(event => event && event.type === type) || null;
  }

  function sessionTimingResearchRow(session){
    const finalTrials = latestTrialsByQuestion(session.trials || []);
    const timing = session.session_timing || {};
    const startEvent = sessionEvent(session, 'session_start');
    const completeEvent = sessionEvent(session, 'session_complete');
    const stopEvent = sessionEvent(session, 'learner_stop_requested');
    const trialStarts = finalTrials
      .flatMap(trial => [trial.cue_onset_wall_ms, trial.stimulus_onset_wall_ms])
      .filter(Number.isFinite);
    const trialEnds = finalTrials
      .flatMap(trial => [trial.feedback_onset_wall_ms, trial.response_wall_ms])
      .filter(Number.isFinite);
    const startedAt = Number.isFinite(timing.started_at_wall_ms)
      ? timing.started_at_wall_ms
      : startEvent && Number.isFinite(startEvent.t_wall_ms)
        ? startEvent.t_wall_ms
        : trialStarts.length ? Math.min(...trialStarts) : null;
    const endedAt = Number.isFinite(timing.ended_at_wall_ms)
      ? timing.ended_at_wall_ms
      : completeEvent && Number.isFinite(completeEvent.t_wall_ms)
        ? completeEvent.t_wall_ms
        : trialEnds.length ? Math.max(...trialEnds) : null;
    const plannedQuestions = Number.isFinite(timing.planned_questions)
      ? timing.planned_questions
      : startEvent && Number.isFinite(Number(startEvent.total_questions))
        ? Number(startEvent.total_questions)
        : Number.isFinite(Number(session.settings && session.settings.sessionMax))
          ? Number(session.settings.sessionMax)
          : null;
    const completedQuestions = finalTrials.length;
    const completionPct = plannedQuestions > 0
      ? Math.round((Math.min(completedQuestions, plannedQuestions) / plannedQuestions) * 100)
      : null;
    const durationMs = Number.isFinite(timing.duration_ms)
      ? timing.duration_ms
      : Number.isFinite(startedAt) && Number.isFinite(endedAt)
        ? Math.max(0, endedAt - startedAt)
        : null;
    const timedTrials = finalTrials.filter(trial => (
      Number.isFinite(trial.response_time_ms)
      && Number.isFinite(trial.timeout_after_ms)
      && trial.timeout_after_ms > 0
    ));
    const windowUse = timedTrials.map(trial => Math.min(100, Math.max(0, (trial.response_time_ms / trial.timeout_after_ms) * 100)));
    const endReason = timing.end_reason
      || (stopEvent ? 'learner-stop' : completionPct === 100 ? 'planned-questions-complete' : completeEvent ? 'session-ended' : 'not-recorded');
    const status = timing.completion_status
      || (endReason === 'learner-stop' ? 'stopped-early' : endReason === 'session-time-limit' ? 'time-limit' : completionPct === 100 ? 'completed' : 'incomplete');
    return {
      date: researchDateLabel(Number(session.updated_at_wall_ms)),
      learner: session.learner_alias || session.learner || 'Unknown',
      status,
      end_reason: endReason,
      planned_questions: plannedQuestions,
      completed_questions: completedQuestions,
      completion_pct: completionPct,
      duration_minutes: Number.isFinite(durationMs) ? Number((durationMs / 60000).toFixed(2)) : null,
      timed_response_count: timedTrials.length,
      median_window_use_pct: windowUse.length ? Number(median(windowUse).toFixed(1)) : null,
      timeout_count: finalTrials.filter(trial => trial.timed_out).length
    };
  }

  function sessionDemandResearchRow(session){
    const finalTrials = latestTrialsByQuestion(session.trials || []);
    const optionCounts = finalTrials.map(trial => {
      if(Array.isArray(trial.option_metadata) && trial.option_metadata.length) return trial.option_metadata.length;
      if(Array.isArray(trial.option_labels) && trial.option_labels.length) return trial.option_labels.length;
      return null;
    }).filter(Number.isFinite);
    const distractorCounts = finalTrials.map(trial => trial.distractor_count).filter(Number.isFinite);
    const targetSides = finalTrials.map(trial => {
      if(!Number.isFinite(trial.target_width_px) || !Number.isFinite(trial.target_height_px)) return null;
      return Math.sqrt(Math.max(0, trial.target_width_px * trial.target_height_px));
    }).filter(Number.isFinite);
    const hitRadii = finiteTrialValues(finalTrials, 'adaptive_hit_radius_px');
    const responseWindows = finiteTrialValues(finalTrials, 'timeout_after_ms').filter(value => value > 0);
    const distractorTrials = finalTrials.filter(trial => Number(trial.distractor_count) > 0).length;
    return {
      date: researchDateLabel(Number(session.updated_at_wall_ms)),
      learner: session.learner_alias || session.learner || 'Unknown',
      trials: finalTrials.length,
      mean_options: optionCounts.length ? Number(mean(optionCounts).toFixed(1)) : null,
      mean_distractors: distractorCounts.length ? Number(mean(distractorCounts).toFixed(1)) : null,
      distractor_trials: distractorTrials,
      moving_target_trials: finalTrials.filter(trial => trial.task_kind === 'moving-target').length,
      median_target_side_px: targetSides.length ? Math.round(median(targetSides)) : null,
      median_hit_radius_px: hitRadii.length ? Math.round(median(hitRadii)) : null,
      median_response_window_sec: responseWindows.length ? Number((median(responseWindows) / 1000).toFixed(1)) : null,
      two_stage_prompt: session.settings && typeof session.settings.useTwoStage === 'boolean'
        ? session.settings.useTwoStage
        : null,
      demand_observed: optionCounts.length > 0 || distractorCounts.length > 0 || targetSides.length > 0 || hitRadii.length > 0 || responseWindows.length > 0
    };
  }

  function coreMarkerCompleteness(session){
    const trials = latestTrialsByQuestion(session.trials || []);
    const markers = Array.isArray(session.eeg_markers) ? session.eeg_markers : [];
    let complete = 0;
    trials.forEach(trial => {
      const names = new Set(markers.filter(marker => marker.trial_id === trial.trial_id).map(marker => marker.name));
      const outcomeMarker = trial.omission
        ? names.has('omission')
        : trial.commission
          ? names.has('commission') && names.has('response')
          : trial.correct_rejection
            ? names.has('no_go')
            : names.has('response');
      if(names.has('stimulus_onset') && names.has('feedback_onset') && outcomeMarker) complete += 1;
    });
    return { complete, expected: trials.length };
  }

  function markerDiagnostics(session){
    const trials = latestTrialsByQuestion(session.trials || []);
    const markers = Array.isArray(session.eeg_markers) ? session.eeg_markers : [];
    const protocol = session.study_protocol || {};
    let orderedTrials = 0;
    let timingDifferenceCount = 0;
    let responseComparisons = 0;

    trials.forEach(trial => {
      const trialMarkers = markers.filter(marker => marker.trial_id === trial.trial_id);
      const first = name => trialMarkers.find(marker => marker.name === name);
      const stimulus = first('stimulus_onset');
      const condition = first(trial.correct_rejection || trial.requires_response === false ? 'no_go' : 'target_present')
        || first('target_present')
        || first('no_go');
      const response = first('response');
      const outcome = trial.omission
        ? first('omission')
        : trial.commission
          ? first('commission')
          : trial.correct_rejection
            ? condition
            : response;
      const feedback = first('feedback_onset');
      const cue = first('cue_onset');
      const sequence = [cue, stimulus, condition, response, outcome, feedback]
        .filter((marker, index, items) => marker && items.indexOf(marker) === index);
      const hasCore = !!(stimulus && condition && outcome && feedback);
      const nonDecreasing = sequence.every((marker, index) => (
        index === 0 || Number(marker.t_perf_ms) >= Number(sequence[index - 1].t_perf_ms)
      ));
      if(hasCore && nonDecreasing) orderedTrials += 1;

      if(stimulus && response && Number.isFinite(trial.response_time_ms)){
        responseComparisons += 1;
        const markerLatency = Number(response.t_perf_ms) - Number(stimulus.t_perf_ms);
        if(!Number.isFinite(markerLatency) || markerLatency < 0 || Math.abs(markerLatency - trial.response_time_ms) > 75){
          timingDifferenceCount += 1;
        }
      }
    });

    const nonMonotonicMarkerCount = markers.reduce((count, marker, index) => {
      if(index === 0) return count;
      return Number(marker.t_perf_ms) < Number(markers[index - 1].t_perf_ms) ? count + 1 : count;
    }, 0);
    const markerIds = markers.map(marker => marker.marker_id).filter(Boolean);
    const duplicateMarkerIdCount = markerIds.length - new Set(markerIds).size;
    const requiredProtocolValues = [
      protocol.study_protocol_id,
      protocol.visit_id,
      protocol.run_number,
      protocol.acquisition_system,
      protocol.declared_sync_method
    ];
    const protocolComplete = requiredProtocolValues.filter(value => value !== '' && value != null).length;
    return {
      version: EEG_PROTOCOL_VERSION,
      ordered_trials: orderedTrials,
      expected_order_trials: trials.length,
      ordering_pct: trials.length ? Math.round((orderedTrials / trials.length) * 100) : null,
      response_timing_comparisons: responseComparisons,
      timing_difference_count: timingDifferenceCount,
      response_timing_tolerance_ms: 75,
      non_monotonic_marker_count: nonMonotonicMarkerCount,
      duplicate_marker_id_count: duplicateMarkerIdCount,
      protocol_fields_complete: protocolComplete,
      protocol_fields_expected: requiredProtocolValues.length,
      protocol_completeness_pct: Math.round((protocolComplete / requiredProtocolValues.length) * 100),
      declared_sync_method: protocol.declared_sync_method || 'not recorded',
      hardware_synchronization_verified: protocol.hardware_synchronization_verified === true,
      interpretation_boundary: 'Browser event diagnostics only. They do not validate EEG hardware synchronisation or physiological signal quality.'
    };
  }

  function prepareResearchCanvas(canvas){
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = themeToken('surface-raised', '#ffffff');
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.font = '12px Atkinson Hyperlegible Next, sans-serif';
    ctx.textBaseline = 'middle';
    return ctx;
  }

  function drawResearchBars(canvas, items, options={}){
    const ctx = prepareResearchCanvas(canvas);
    if(!items.length){
      ctx.fillStyle = themeToken('text-muted', '#52656d');
      ctx.fillText('No data in this scope', 20, canvas.height / 2);
      return;
    }
    const max = Math.max(1, options.maxValue || Math.max(...items.map(item => item.value || 0)));
    const labelWidth = options.labelWidth || 138;
    const chartWidth = Math.max(40, canvas.width - labelWidth - 52);
    const rowHeight = Math.min(34, (canvas.height - 20) / items.length);
    items.forEach((item, index) => {
      const y = 10 + (index * rowHeight);
      const value = Number.isFinite(item.value) ? item.value : 0;
      const barWidth = chartWidth * clamp(value / max, 0, 1);
      ctx.fillStyle = themeToken('text', '#172b35');
      ctx.textAlign = 'left';
      const label = String(item.label || '').length > 22 ? `${String(item.label).slice(0, 21)}…` : item.label;
      ctx.fillText(label, 10, y + (rowHeight / 2));
      ctx.fillStyle = themeToken('surface-subtle', '#e7f1f0');
      ctx.fillRect(labelWidth, y + 5, chartWidth, Math.max(8, rowHeight - 10));
      ctx.fillStyle = item.color || themeToken('primary', STIMULUS_COLOR_FALLBACKS.blue);
      ctx.fillRect(labelWidth, y + 5, barWidth, Math.max(8, rowHeight - 10));
      ctx.fillStyle = themeToken('text', '#172b35');
      ctx.textAlign = 'right';
      ctx.fillText(options.suffix ? `${value}${options.suffix}` : String(value), canvas.width - 8, y + (rowHeight / 2));
    });
  }

  function drawResearchTrend(canvas, rows){
    const ctx = prepareResearchCanvas(canvas);
    const plot = { left: 42, top: 22, right: canvas.width - 20, bottom: canvas.height - 34 };
    ctx.strokeStyle = themeToken('border', '#738c91');
    ctx.fillStyle = themeToken('text-muted', '#52656d');
    ctx.textAlign = 'right';
    [0, 50, 100].forEach(value => {
      const y = plot.bottom - ((plot.bottom - plot.top) * value / 100);
      ctx.beginPath();
      ctx.moveTo(plot.left, y);
      ctx.lineTo(plot.right, y);
      ctx.stroke();
      ctx.fillText(`${value}%`, plot.left - 7, y);
    });
    if(!rows.length){
      ctx.textAlign = 'left';
      ctx.fillText('No sessions in this scope', plot.left + 12, (plot.top + plot.bottom) / 2);
      return;
    }
    const series = [
      { key: 'accuracy_pct', label: 'Accuracy', color: themeToken('primary', STIMULUS_COLOR_FALLBACKS.blue), square: false },
      { key: 'independent_pct', label: 'Independent', color: themeToken('success', STIMULUS_COLOR_FALLBACKS.green), square: true }
    ];
    series.forEach((entry, seriesIndex) => {
      const points = rows.map((row, index) => ({ value: row[entry.key], index })).filter(point => Number.isFinite(point.value));
      ctx.strokeStyle = entry.color;
      ctx.fillStyle = entry.color;
      ctx.lineWidth = 3;
      ctx.beginPath();
      points.forEach((point, index) => {
        const x = plot.left + ((plot.right - plot.left) * (rows.length === 1 ? 0.5 : point.index / (rows.length - 1)));
        const y = plot.bottom - ((plot.bottom - plot.top) * point.value / 100);
        if(index === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });
      ctx.stroke();
      points.forEach(point => {
        const x = plot.left + ((plot.right - plot.left) * (rows.length === 1 ? 0.5 : point.index / (rows.length - 1)));
        const y = plot.bottom - ((plot.bottom - plot.top) * point.value / 100);
        if(entry.square) ctx.fillRect(x - 4, y - 4, 8, 8);
        else { ctx.beginPath(); ctx.arc(x, y, 4, 0, Math.PI * 2); ctx.fill(); }
      });
      ctx.textAlign = 'left';
      ctx.fillRect(plot.left + (seriesIndex * 150), canvas.height - 20, 12, 4);
      ctx.fillStyle = themeToken('text', '#172b35');
      ctx.fillText(entry.label, plot.left + 18 + (seriesIndex * 150), canvas.height - 18);
    });
  }

  function drawResearchScatter(canvas, rows){
    const ctx = prepareResearchCanvas(canvas);
    const points = rows.filter(row => Number.isFinite(row.median_rt_ms) && Number.isFinite(row.accuracy_pct));
    const plot = { left: 54, top: 18, right: canvas.width - 18, bottom: canvas.height - 40 };
    ctx.strokeStyle = themeToken('border', '#738c91');
    ctx.beginPath();
    ctx.moveTo(plot.left, plot.top);
    ctx.lineTo(plot.left, plot.bottom);
    ctx.lineTo(plot.right, plot.bottom);
    ctx.stroke();
    if(!points.length){
      ctx.fillStyle = themeToken('text-muted', '#52656d');
      ctx.fillText('No timed sessions', plot.left + 20, (plot.top + plot.bottom) / 2);
      return;
    }
    const minRt = Math.min(...points.map(point => point.median_rt_ms));
    const maxRt = Math.max(...points.map(point => point.median_rt_ms));
    const rtRange = Math.max(1, maxRt - minRt);
    points.forEach((point, index) => {
      const x = plot.left + ((plot.right - plot.left) * ((point.median_rt_ms - minRt) / rtRange));
      const y = plot.bottom - ((plot.bottom - plot.top) * point.accuracy_pct / 100);
      ctx.fillStyle = themeToken('primary', STIMULUS_COLOR_FALLBACKS.blue);
      ctx.beginPath();
      ctx.arc(x, y, 6, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = themeToken('text', '#172b35');
      ctx.textAlign = 'center';
      ctx.fillText(String(index + 1), x, y - 12);
    });
    ctx.fillStyle = themeToken('text-muted', '#52656d');
    ctx.textAlign = 'left';
    ctx.fillText(`${minRt} ms`, plot.left, canvas.height - 20);
    ctx.textAlign = 'right';
    ctx.fillText(`${maxRt} ms`, plot.right, canvas.height - 20);
    ctx.save();
    ctx.translate(15, plot.bottom);
    ctx.rotate(-Math.PI / 2);
    ctx.textAlign = 'left';
    ctx.fillText('Accuracy 0–100%', 0, 0);
    ctx.restore();
  }

  function attentionDomainForTrial(trial){
    const domain = trial.attention_domain || trial.attentionDomain || taskMeta(trial.task_kind).domain;
    return ['sustained', 'selective-spatial', 'orienting', 'executive'].includes(domain) ? domain : null;
  }

  function descriptiveLinearSlope(values){
    if(values.length < 3) return null;
    const xMean = (values.length - 1) / 2;
    const yMean = mean(values);
    const numerator = values.reduce((sum, value, index) => sum + ((index - xMean) * (value - yMean)), 0);
    const denominator = values.reduce((sum, value, index) => sum + Math.pow(index - xMean, 2), 0);
    return denominator ? Number((numerator / denominator).toFixed(1)) : null;
  }

  function attentionFamilyResearchRows(sessions, allowLongitudinalSlope){
    const domains = ['sustained', 'selective-spatial', 'orienting', 'executive'];
    const aggregates = new Map(domains.map(domain => [domain, {
      domain,
      label: ATTENTION_FAMILY_LABELS[domain],
      sessions: 0,
      opportunities: 0,
      correct: 0,
      independentCorrect: 0,
      omissions: 0,
      commissions: 0,
      responseTimes: [],
      touchDistances: [],
      observations: []
    }]));

    sessions.forEach((session, sessionIndex) => {
      const finalTrials = latestTrialsByQuestion(session.trials || []);
      domains.forEach(domain => {
        const matching = finalTrials.filter(trial => attentionDomainForTrial(trial) === domain);
        if(!matching.length) return;
        const item = aggregates.get(domain);
        const correct = matching.filter(trial => trial.correct).length;
        item.sessions += 1;
        item.opportunities += matching.length;
        item.correct += correct;
        item.independentCorrect += matching.filter(trial => trial.correct && (!trial.independence_status || trial.independence_status === 'independent')).length;
        item.omissions += matching.filter(trial => trial.omission).length;
        item.commissions += matching.filter(trial => trial.commission).length;
        item.responseTimes.push(...finiteTrialValues(matching, 'response_time_ms'));
        item.touchDistances.push(...finiteTrialValues(matching, 'distance_to_target_px'));
        item.observations.push({
          session_index: sessionIndex,
          date: researchDateLabel(Number(session.updated_at_wall_ms)),
          learner: session.learner_alias || session.learner || 'Unknown',
          opportunities: matching.length,
          accuracy_pct: Math.round((correct / matching.length) * 100)
        });
      });
    });

    return domains.map(domain => {
      const item = aggregates.get(domain);
      const accuracyValues = item.observations.map(observation => observation.accuracy_pct);
      return {
        ...item,
        accuracy_pct: item.opportunities ? Math.round((item.correct / item.opportunities) * 100) : null,
        independent_success_pct: item.opportunities ? Math.round((item.independentCorrect / item.opportunities) * 100) : null,
        median_rt_ms: item.responseTimes.length ? Math.round(median(item.responseTimes)) : null,
        rt_variability_ms: item.responseTimes.length > 1 ? Math.round(standardDeviation(item.responseTimes)) : null,
        mean_touch_distance_px: item.touchDistances.length ? Number(mean(item.touchDistances).toFixed(1)) : null,
        descriptive_slope_pp_per_session: allowLongitudinalSlope ? descriptiveLinearSlope(accuracyValues) : null
      };
    }).filter(item => item.opportunities > 0);
  }

  function drawResearchAttentionTrend(canvas, rows, sessionCount, allowLongitudinalTrend){
    const ctx = prepareResearchCanvas(canvas);
    const plot = { left: 44, top: 24, right: canvas.width - 20, bottom: canvas.height - 48 };
    ctx.strokeStyle = themeToken('border', '#738c91');
    ctx.fillStyle = themeToken('text-muted', '#52656d');
    ctx.textAlign = 'right';
    [0, 50, 100].forEach(value => {
      const y = plot.bottom - ((plot.bottom - plot.top) * value / 100);
      ctx.beginPath();
      ctx.moveTo(plot.left, y);
      ctx.lineTo(plot.right, y);
      ctx.stroke();
      ctx.fillText(`${value}%`, plot.left - 7, y);
    });
    if(!allowLongitudinalTrend){
      ctx.textAlign = 'left';
      ctx.fillText('Choose Current learner history to view family trajectories.', plot.left + 12, (plot.top + plot.bottom) / 2);
      return;
    }
    if(!rows.length){
      ctx.textAlign = 'left';
      ctx.fillText('No Attention Training sessions in this scope', plot.left + 12, (plot.top + plot.bottom) / 2);
      return;
    }
    const colors = {
      sustained: themeToken('primary', STIMULUS_COLOR_FALLBACKS.blue),
      'selective-spatial': themeToken('success', STIMULUS_COLOR_FALLBACKS.green),
      orienting: themeToken('warning', STIMULUS_COLOR_FALLBACKS.amber),
      executive: themeToken('danger', STIMULUS_COLOR_FALLBACKS.red)
    };
    rows.forEach((row, seriesIndex) => {
      const color = colors[row.domain];
      ctx.strokeStyle = color;
      ctx.fillStyle = color;
      ctx.lineWidth = 3;
      ctx.beginPath();
      row.observations.forEach((observation, index) => {
        const x = plot.left + ((plot.right - plot.left) * (sessionCount <= 1 ? 0.5 : observation.session_index / (sessionCount - 1)));
        const y = plot.bottom - ((plot.bottom - plot.top) * observation.accuracy_pct / 100);
        if(index === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });
      ctx.stroke();
      row.observations.forEach(observation => {
        const x = plot.left + ((plot.right - plot.left) * (sessionCount <= 1 ? 0.5 : observation.session_index / (sessionCount - 1)));
        const y = plot.bottom - ((plot.bottom - plot.top) * observation.accuracy_pct / 100);
        ctx.beginPath();
        ctx.arc(x, y, 4, 0, Math.PI * 2);
        ctx.fill();
      });
      const legendX = plot.left + ((seriesIndex % 2) * 250);
      const legendY = canvas.height - 30 + (Math.floor(seriesIndex / 2) * 16);
      ctx.fillRect(legendX, legendY - 2, 12, 4);
      ctx.fillStyle = themeToken('text', '#172b35');
      ctx.textAlign = 'left';
      ctx.fillText(row.label, legendX + 18, legendY);
    });
  }

  function drawResearchMetricTrend(canvas, rows, series, options={}){
    const ctx = prepareResearchCanvas(canvas);
    const plot = { left: 54, top: 22, right: canvas.width - 18, bottom: canvas.height - 42 };
    const observedValues = series.flatMap(entry => rows.map(row => row[entry.key]).filter(Number.isFinite));
    const maxValue = Number.isFinite(options.maxValue)
      ? options.maxValue
      : Math.max(1, Math.ceil(Math.max(0, ...observedValues) * 1.1));
    ctx.strokeStyle = themeToken('border', '#738c91');
    ctx.fillStyle = themeToken('text-muted', '#52656d');
    ctx.textAlign = 'right';
    [0, maxValue / 2, maxValue].forEach(value => {
      const y = plot.bottom - ((plot.bottom - plot.top) * value / maxValue);
      ctx.beginPath();
      ctx.moveTo(plot.left, y);
      ctx.lineTo(plot.right, y);
      ctx.stroke();
      const display = Number.isInteger(value) ? value : Number(value.toFixed(1));
      ctx.fillText(`${display}${options.suffix || ''}`, plot.left - 7, y);
    });
    if(!observedValues.length){
      ctx.textAlign = 'left';
      ctx.fillText(options.emptyText || 'No observed values in this scope', plot.left + 12, (plot.top + plot.bottom) / 2);
      return;
    }
    series.forEach((entry, seriesIndex) => {
      const points = rows.map((row, index) => ({ value: row[entry.key], index })).filter(point => Number.isFinite(point.value));
      ctx.strokeStyle = entry.color;
      ctx.fillStyle = entry.color;
      ctx.lineWidth = 3;
      if(options.connectPoints !== false){
        ctx.beginPath();
        points.forEach((point, index) => {
          const x = plot.left + ((plot.right - plot.left) * (rows.length <= 1 ? 0.5 : point.index / (rows.length - 1)));
          const y = plot.bottom - ((plot.bottom - plot.top) * clamp(point.value / maxValue, 0, 1));
          if(index === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        });
        ctx.stroke();
      }
      points.forEach(point => {
        const x = plot.left + ((plot.right - plot.left) * (rows.length <= 1 ? 0.5 : point.index / (rows.length - 1)));
        const y = plot.bottom - ((plot.bottom - plot.top) * clamp(point.value / maxValue, 0, 1));
        if(seriesIndex % 2){
          ctx.fillRect(x - 4, y - 4, 8, 8);
        } else {
          ctx.beginPath();
          ctx.arc(x, y, 4, 0, Math.PI * 2);
          ctx.fill();
        }
      });
      const legendX = plot.left + (seriesIndex * 190);
      ctx.fillRect(legendX, canvas.height - 22, 12, 4);
      ctx.fillStyle = themeToken('text', '#172b35');
      ctx.textAlign = 'left';
      ctx.fillText(entry.label, legendX + 18, canvas.height - 20);
    });
  }

  function researchReviewsForSessions(sessions){
    const scope = ui.researchScopeSelect ? ui.researchScopeSelect.value : 'current-learner';
    const reviews = [];
    Object.keys(state.learners).forEach(name => {
      const learner = normalizeLearner(name, state.learners[name]);
      if(scope === 'all-learners' || name === currentPupilName()){
        learner.reviews.forEach(review => reviews.push({
          ...review,
          learner_name: review.learner_name || name,
          learner_alias: review.learner_alias || learner.alias || name
        }));
      }
    });
    const unique = new Map();
    reviews.forEach(review => unique.set(review.review_id || `${review.recommendation_id}|${review.reviewed_at_wall_ms}`, review));
    return Array.from(unique.values()).sort((a, b) => Number(a.reviewed_at_wall_ms || 0) - Number(b.reviewed_at_wall_ms || 0));
  }

  function populateRecommendationTaskOptions(){
    if(!ui.recommendationOverrideTask) return;
    const current = ui.recommendationOverrideTask.value;
    clearNode(ui.recommendationOverrideTask);
    const defaultOption = document.createElement('option');
    defaultOption.value = '';
    defaultOption.textContent = 'Use proposed task';
    ui.recommendationOverrideTask.appendChild(defaultOption);
    Object.keys(TASK_META)
      .filter(kind => kind !== 'cpat-suite')
      .sort((a, b) => taskLabel(a).localeCompare(taskLabel(b)))
      .forEach(kind => {
        const option = document.createElement('option');
        option.value = kind;
        option.textContent = taskLabel(kind);
        ui.recommendationOverrideTask.appendChild(option);
      });
    if(Array.from(ui.recommendationOverrideTask.options).some(option => option.value === current)){
      ui.recommendationOverrideTask.value = current;
    }
  }

  function renderRecommendationResearch(sessions, proposal){
    if(!ui.researchRecommendationSummary) return;
    state.activeRecommendation = proposal;
    const taskText = proposal.recommended_task_kind === 'auto' ? 'Auto level path' : proposal.recommended_task_label;
    ui.researchRecommendationSummary.textContent = `${proposal.action_label}: ${proposal.skill_label}. Suggested task: ${taskText}, Level ${proposal.recommended_level}. Support direction: ${proposal.support_direction_label}. Teacher review is required.`;
    clearNode(ui.researchRecommendationRationale);
    proposal.rationale.forEach(text => {
      const item = document.createElement('li');
      item.textContent = text;
      ui.researchRecommendationRationale.appendChild(item);
    });

    const reviews = researchReviewsForSessions(sessions);
    const currentReviews = reviews.filter(review => review.recommendation_id === proposal.recommendation_id);
    const latestReview = currentReviews[currentReviews.length - 1];
    ui.recommendationReviewStatus.textContent = latestReview
      ? `Latest decision: ${latestReview.decision} on ${new Date(latestReview.reviewed_at_wall_ms).toLocaleString()}. Saving again creates an auditable revision.`
      : 'No review saved for this proposal.';

    const decisionRows = ['approved', 'adjusted', 'declined'].map(decision => ({
      label: decision,
      value: reviews.filter(review => review.decision === decision).length,
      color: decision === 'approved' ? themeToken('success') : decision === 'declined' ? themeToken('danger') : themeToken('warning')
    }));
    drawResearchBars(ui.researchRecommendationChart, decisionRows, { labelWidth: 120 });
    if(reviews.length){
      clearNode(ui.researchRecommendationBody);
      reviews.forEach(review => appendResearchRow(ui.researchRecommendationBody, [
        researchDateLabel(Number(review.reviewed_at_wall_ms)),
        review.learner_alias || 'Unknown',
        recommendationActionLabel(review.proposal && review.proposal.action),
        review.proposal && review.proposal.skill_label,
        review.decision,
        review.final_plan && review.final_plan.task_label,
        review.final_plan && review.final_plan.level,
        review.note || 'No note'
      ]));
    } else renderResearchEmptyRow(ui.researchRecommendationBody, 8, 'No teacher recommendation reviews in this scope yet.');
  }

  function saveRecommendationReview(){
    const proposal = state.activeRecommendation;
    if(!proposal){
      flash('try', 'Refresh the Research view first');
      return;
    }
    const name = currentPupilName();
    if(!name || name === 'Unknown'){
      flash('try', 'Select a pupil before reviewing');
      return;
    }
    const decision = ui.recommendationDecision.value;
    const overrideTask = ui.recommendationOverrideTask.value;
    const overrideLevelText = String(ui.recommendationOverrideLevel.value || '').trim();
    const overrideLevel = overrideLevelText === '' ? null : clamp(safeNumber(overrideLevelText, proposal.recommended_level), 1, 10);
    const note = ui.recommendationReviewNote.value.trim();
    if(decision === 'adjusted' && !overrideTask && overrideLevel == null && !note){
      flash('try', 'Record the adjustment or add a note');
      return;
    }

    const learner = currentLearnerRecord();
    const previous = learner.reviews.filter(review => review.recommendation_id === proposal.recommendation_id).slice(-1)[0];
    const finalTask = decision === 'adjusted' && overrideTask ? overrideTask : proposal.recommended_task_kind;
    const finalLevel = decision === 'adjusted' && overrideLevel != null ? overrideLevel : proposal.recommended_level;
    const review = {
      review_id: uuid4(),
      recommendation_id: proposal.recommendation_id,
      recommendation_version: RECOMMENDATION_VERSION,
      learner_name: name,
      learner_alias: learner.alias || name,
      reviewed_at_wall_ms: wallMs(),
      reviewer: ui.staffMember.value.trim() || 'Not recorded',
      decision,
      note,
      supersedes_review_id: previous ? previous.review_id : null,
      proposal: {
        action: proposal.action,
        skill_id: proposal.skill_id,
        skill_label: proposal.skill_label,
        recommended_task_kind: proposal.recommended_task_kind,
        recommended_level: proposal.recommended_level,
        support_direction: proposal.support_direction,
        rationale_codes: proposal.rationale_codes.slice(),
        source_session_ids: proposal.source_session_ids.slice()
      },
      final_plan: {
        task_kind: finalTask,
        task_label: finalTask === 'auto' ? 'Auto level path' : taskLabel(finalTask),
        level: finalLevel,
        support_direction: proposal.support_direction
      }
    };
    learner.reviews = learner.reviews.concat(review).slice(-100);
    state.learners[name] = learner;
    state.currentPupil = learner;
    if(state.sessionSnapshot && state.sessionSnapshot.learner === name){
      state.sessionSnapshot.learner_profile = clonePlain(learner);
    }
    saveLearners();
    if(state.trials.length){
      logEvent('recommendation_reviewed', {
        recommendation_id: proposal.recommendation_id,
        review_id: review.review_id,
        decision,
        final_task_kind: finalTask,
        final_level: finalLevel
      });
    }
    ui.recommendationReviewNote.value = '';
    ui.recommendationOverrideTask.value = '';
    ui.recommendationOverrideLevel.value = '';
    renderResearchWorkspace();
    flash('good', 'Teacher review saved locally');
  }

  function isRecordedResearchValue(value){
    if(value == null) return false;
    if(typeof value !== 'string') return true;
    const normalized = value.trim().toLowerCase();
    return !!normalized && !['unknown', 'not-recorded', 'not recorded', 'not-run', 'not run'].includes(normalized);
  }

  function researchCoverageMetric(checks, applicable=true){
    if(!applicable) return { observed: 0, expected: 0, percent: null, applicable: false };
    const expected = checks.length;
    const observed = checks.filter(Boolean).length;
    return {
      observed,
      expected,
      percent: expected ? Math.round((observed / expected) * 100) : null,
      applicable: expected > 0
    };
  }

  function researchCoverageForSession(session){
    const finalTrials = latestTrialsByQuestion(session.trials || []);
    const behaviourChecks = finalTrials.flatMap(trial => [
      !!trial.trial_id,
      !!trial.task_kind,
      typeof trial.correct === 'boolean',
      Number.isFinite(trial.cue_onset_wall_ms) || Number.isFinite(trial.stimulus_onset_wall_ms)
    ]);
    const responded = finalTrials.filter(trial => !trial.omission);
    const supportChecks = responded.flatMap(trial => [
      ['independent', 'prompted', 'assisted'].includes(trial.independence_status),
      Number.isFinite(trial.highest_prompt_level),
      isRecordedResearchValue(trial.support_code)
    ]);
    const contentChecks = finalTrials.flatMap(trial => {
      const checks = [
        isRecordedResearchValue(trial.prompt_wording),
        isRecordedResearchValue(trial.generator_version)
      ];
      const hasOptions = (Array.isArray(trial.option_metadata) && trial.option_metadata.length)
        || (Array.isArray(trial.option_labels) && trial.option_labels.length);
      if(hasOptions) checks.push(Array.isArray(trial.option_labels) && trial.option_labels.length > 0);
      if(trial.scored_response !== false && !trial.correct_rejection && !trial.touch_anywhere_accepted){
        checks.push(isRecordedResearchValue(trial.target_label));
      }
      return checks;
    });

    const contextTrial = finalTrials.find(trial => trial.session_context && typeof trial.session_context === 'object');
    const baselineTrial = finalTrials.find(trial => trial.learner_baseline && typeof trial.learner_baseline === 'object');
    const context = contextTrial ? contextTrial.session_context : {};
    const trialBaseline = baselineTrial ? baselineTrial.learner_baseline : {};
    const profileBaseline = session.learner_snapshot && session.learner_snapshot.baseline
      ? session.learner_snapshot.baseline
      : {};
    const breakCount = Number.isFinite(context.breaks_used)
      ? context.breaks_used
      : profileBaseline.breakCount;
    const contextChecks = [
      isRecordedResearchValue(context.fatigue_level || profileBaseline.fatigueLevel),
      isRecordedResearchValue(context.sensory_state || profileBaseline.sensoryState),
      isRecordedResearchValue(trialBaseline.sleep_quality || profileBaseline.sleepQuality || profileBaseline.sleep_quality),
      Number.isFinite(breakCount),
      isRecordedResearchValue(context.pre_session_preference || profileBaseline.preSessionPreference),
      isRecordedResearchValue(session.context_notes || profileBaseline.contextNotes)
    ];

    const protocol = session.study_protocol || {};
    const eegExpected = !!(
      (session.settings && session.settings.eegResearchMode)
      || finalTrials.some(trial => trial.eeg_research_mode)
    );
    const markerSet = coreMarkerCompleteness(session);
    const protocolChecks = [
      isRecordedResearchValue(protocol.study_protocol_id),
      isRecordedResearchValue(protocol.visit_id),
      protocol.run_number != null,
      isRecordedResearchValue(protocol.acquisition_system),
      isRecordedResearchValue(protocol.declared_sync_method)
    ];
    const eegChecks = eegExpected
      ? Array(markerSet.expected).fill(false).map((_, index) => index < markerSet.complete).concat(protocolChecks)
      : [];

    const attentionRating = Number.isFinite(profileBaseline.teacherAttentionRating)
      ? profileBaseline.teacherAttentionRating
      : profileBaseline.teacher_attention_rating;
    const independenceRating = Number.isFinite(profileBaseline.teacherIndependenceRating)
      ? profileBaseline.teacherIndependenceRating
      : profileBaseline.teacher_independence_rating;
    const transferChecks = [
      Number.isFinite(attentionRating),
      Number.isFinite(independenceRating),
      isRecordedResearchValue(profileBaseline.maintenanceStatus || context.maintenance_status),
      isRecordedResearchValue(profileBaseline.generalisationStatus || context.generalisation_status),
      isRecordedResearchValue(session.classroom_transfer_notes || profileBaseline.classroomTransferNotes)
    ];

    return {
      date: researchDateLabel(Number(session.updated_at_wall_ms)),
      learner: session.learner_alias || session.learner || 'Unknown',
      domains: {
        behaviour: researchCoverageMetric(behaviourChecks),
        support: researchCoverageMetric(supportChecks),
        context: researchCoverageMetric(contextChecks),
        content: researchCoverageMetric(contentChecks),
        eeg: researchCoverageMetric(eegChecks, eegExpected),
        transfer: researchCoverageMetric(transferChecks)
      }
    };
  }

  function aggregateResearchCoverage(rows, key){
    const applicable = rows.map(row => row.domains[key]).filter(metric => metric.applicable);
    const observed = applicable.reduce((sum, metric) => sum + metric.observed, 0);
    const expected = applicable.reduce((sum, metric) => sum + metric.expected, 0);
    return {
      observed,
      expected,
      applicable_sessions: applicable.length,
      percent: expected ? Math.round((observed / expected) * 100) : null
    };
  }

  function researchCoverageCell(metric){
    if(!metric.applicable) return 'Not expected';
    return `${metric.observed}/${metric.expected} (${metric.percent}%)`;
  }

  function storedOptionMatchesCategory(option, categoryId){
    if(!option || !categoryId) return false;
    const memberships = Array.isArray(option.category_ids) && option.category_ids.length
      ? option.category_ids
      : [option.category];
    return memberships.filter(Boolean).map(canonicalCategoryId).includes(canonicalCategoryId(categoryId));
  }

  function categoryMatchIntegrity(trial){
    if(!trial || trial.task_kind !== 'match-category') return { observed: false, valid: false };
    const options = Array.isArray(trial.option_metadata) ? trial.option_metadata : [];
    const observed = !!(trial.cue_id && trial.target_id && trial.target_category && trial.cue_metadata && options.length);
    if(!observed) return { observed: false, valid: false };
    const matchingOptions = options.filter(option => storedOptionMatchesCategory(option, trial.target_category));
    return {
      observed: true,
      valid: trial.cue_id !== trial.target_id
        && storedOptionMatchesCategory(trial.cue_metadata, trial.target_category)
        && matchingOptions.length === 1
        && matchingOptions[0].id === trial.target_id
        && !options.some(option => option.id === trial.cue_id)
    };
  }

  function categoryMatchResearchRows(trials){
    const groups = new Map();
    (Array.isArray(trials) ? trials : [])
      .filter(trial => trial.task_kind === 'match-category')
      .forEach(trial => {
        const category = trial.target_category_label || trial.target_category || 'Not recorded';
        if(!groups.has(category)){
          groups.set(category, {
            category,
            trials: 0,
            correct: 0,
            independent_correct: 0,
            omissions: 0,
            cue_ids: new Set(),
            target_ids: new Set(),
            pair_ids: new Set(),
            response_times: [],
            integrity_observed: 0,
            integrity_valid: 0
          });
        }
        const item = groups.get(category);
        item.trials += 1;
        if(trial.correct) item.correct += 1;
        if(trial.correct && trial.independence_status === 'independent') item.independent_correct += 1;
        if(trial.omission) item.omissions += 1;
        if(trial.cue_id) item.cue_ids.add(trial.cue_id);
        if(trial.target_id) item.target_ids.add(trial.target_id);
        if(trial.cue_id && trial.target_id) item.pair_ids.add(`${trial.cue_id}|${trial.target_id}`);
        if(Number.isFinite(trial.response_time_ms)) item.response_times.push(trial.response_time_ms);
        const integrity = categoryMatchIntegrity(trial);
        if(integrity.observed){
          item.integrity_observed += 1;
          if(integrity.valid) item.integrity_valid += 1;
        }
      });
    return Array.from(groups.values()).map(item => ({
      category: item.category,
      trials: item.trials,
      distinct_cues: item.cue_ids.size,
      distinct_targets: item.target_ids.size,
      distinct_pairs: item.pair_ids.size,
      accuracy_pct: percentage(item.correct, item.trials),
      independent_success_pct: percentage(item.independent_correct, item.trials),
      omissions: item.omissions,
      median_reaction_time_ms: item.response_times.length ? Math.round(median(item.response_times)) : null,
      generator_integrity_observed: item.integrity_observed,
      generator_integrity_valid: item.integrity_valid,
      generator_integrity_pct: item.integrity_observed ? percentage(item.integrity_valid, item.integrity_observed) : null
    })).sort((a, b) => b.trials - a.trials || a.category.localeCompare(b.category));
  }

  function categoryExclusionIntegrity(trial){
    if(!trial || trial.task_kind !== 'category-exclusion') return { observed: false, valid: false };
    const options = Array.isArray(trial.option_metadata) ? trial.option_metadata : [];
    const observed = !!(trial.reference_category && trial.target_id && options.length >= 3);
    if(!observed) return { observed: false, valid: false };
    const matchingOptions = options.filter(option => storedOptionMatchesCategory(option, trial.reference_category));
    const outsideOptions = options.filter(option => !storedOptionMatchesCategory(option, trial.reference_category));
    return {
      observed: true,
      valid: matchingOptions.length >= 2
        && outsideOptions.length === 1
        && outsideOptions[0].id === trial.target_id
        && !storedOptionMatchesCategory(outsideOptions[0], trial.reference_category)
        && new Set(options.map(option => option.id)).size === options.length
        && new Set(options.map(option => normalizedConceptLabel(option.label))).size === options.length
    };
  }

  function categoryExclusionResearchRows(trials){
    const groups = new Map();
    (Array.isArray(trials) ? trials : [])
      .filter(trial => trial.task_kind === 'category-exclusion')
      .forEach(trial => {
        const category = trial.reference_category_label || trial.reference_category || 'Not recorded';
        if(!groups.has(category)){
          groups.set(category, {
            category,
            trials: 0,
            correct: 0,
            independent_correct: 0,
            omissions: 0,
            group_ids: new Set(),
            outside_target_ids: new Set(),
            response_times: [],
            integrity_observed: 0,
            integrity_valid: 0
          });
        }
        const item = groups.get(category);
        item.trials += 1;
        if(trial.correct) item.correct += 1;
        if(trial.correct && trial.independence_status === 'independent') item.independent_correct += 1;
        if(trial.omission) item.omissions += 1;
        (Array.isArray(trial.option_metadata) ? trial.option_metadata : [])
          .filter(option => storedOptionMatchesCategory(option, trial.reference_category))
          .forEach(option => item.group_ids.add(option.id));
        if(trial.target_id) item.outside_target_ids.add(trial.target_id);
        if(Number.isFinite(trial.response_time_ms)) item.response_times.push(trial.response_time_ms);
        const integrity = categoryExclusionIntegrity(trial);
        if(integrity.observed){
          item.integrity_observed += 1;
          if(integrity.valid) item.integrity_valid += 1;
        }
      });
    return Array.from(groups.values()).map(item => ({
      reference_category: item.category,
      trials: item.trials,
      distinct_group_exemplars: item.group_ids.size,
      distinct_outside_targets: item.outside_target_ids.size,
      accuracy_pct: percentage(item.correct, item.trials),
      independent_success_pct: percentage(item.independent_correct, item.trials),
      omissions: item.omissions,
      median_reaction_time_ms: item.response_times.length ? Math.round(median(item.response_times)) : null,
      generator_integrity_observed: item.integrity_observed,
      generator_integrity_valid: item.integrity_valid,
      generator_integrity_pct: item.integrity_observed ? percentage(item.integrity_valid, item.integrity_observed) : null
    })).sort((a, b) => b.trials - a.trials || a.reference_category.localeCompare(b.reference_category));
  }

  function renderResearchWorkspace(){
    if(!ui.researchScopeSelect) return;
    const sessions = researchSessionsInScope();
    const sessionRows = sessions.map(sessionTrendRow);
    const trials = sessions.flatMap(session => Array.isArray(session.trials) ? session.trials : []);
    const finalTrials = latestTrialsByQuestion(trials);
    const researchSummary = researchSummaryForTrials(trials);
    const scopeLabels = {
      'current-session': 'current session',
      'current-learner': `current learner history (${currentPupilAlias()})`,
      'all-learners': 'all locally stored learners'
    };
    const scope = ui.researchScopeSelect.value;
    const timestamps = sessions.map(session => Number(session.updated_at_wall_ms)).filter(Number.isFinite);
    const coverageRows = sessions.map(researchCoverageForSession);
    const coverageDomains = [
      { key: 'behaviour', label: 'Behaviour', color: themeToken('primary') },
      { key: 'support', label: 'Support', color: themeToken('success') },
      { key: 'context', label: 'Context', color: themeToken('secondary', themeToken('primary')) },
      { key: 'content', label: 'Content', color: themeToken('reward') },
      { key: 'eeg', label: 'EEG / protocol', color: themeToken('warning') },
      { key: 'transfer', label: 'Transfer', color: themeToken('danger') }
    ].map(domain => ({ ...domain, ...aggregateResearchCoverage(coverageRows, domain.key) }));
    const behaviourCoverage = coverageDomains.find(domain => domain.key === 'behaviour');
    const completeness = behaviourCoverage && Number.isFinite(behaviourCoverage.percent)
      ? behaviourCoverage.percent
      : null;

    ui.researchSessionCount.textContent = String(sessions.length);
    ui.researchTrialCount.textContent = String(finalTrials.length);
    ui.researchDateRange.textContent = timestamps.length
      ? `${researchDateLabel(Math.min(...timestamps))} to ${researchDateLabel(Math.max(...timestamps))}`
      : 'No data';
    ui.researchCompleteness.textContent = completeness == null ? '--' : `${completeness}%`;
    ui.researchSourceNote.textContent = `Showing ${scopeLabels[scope] || scope}. ${ui.researchIncludeArchived.checked ? 'Archived sessions included.' : 'Archived sessions excluded.'} Missing values stay missing rather than being treated as zero.`;

    drawResearchBars(ui.researchCoverageChart, coverageDomains
      .filter(domain => Number.isFinite(domain.percent))
      .map(domain => ({
        label: domain.label,
        value: domain.percent,
        color: domain.color
      })), { maxValue: 100, suffix: '%', labelWidth: 145 });
    if(coverageRows.length){
      clearNode(ui.researchCoverageBody);
      coverageRows.forEach(row => appendResearchRow(ui.researchCoverageBody, [
        row.date,
        row.learner,
        researchCoverageCell(row.domains.behaviour),
        researchCoverageCell(row.domains.support),
        researchCoverageCell(row.domains.context),
        researchCoverageCell(row.domains.content),
        researchCoverageCell(row.domains.eeg),
        researchCoverageCell(row.domains.transfer)
      ]));
    } else renderResearchEmptyRow(ui.researchCoverageBody, 8, 'No sessions in this scope yet.');
    const eegCoverage = coverageDomains.find(domain => domain.key === 'eeg');
    ui.researchCoverageNote.textContent = `Coverage shows recorded fields, not learner performance or data validity. Optional context and transfer fields may remain missing. ${eegCoverage && eegCoverage.applicable_sessions ? `EEG/protocol coverage applies to ${eegCoverage.applicable_sessions} session(s).` : 'EEG/protocol is not expected for the sessions in this scope.'}`;

    drawResearchTrend(ui.researchAccuracyChart, sessionRows);
    drawResearchScatter(ui.researchSpeedAccuracyChart, sessionRows);
    const timedRows = sessionRows.filter(row => Number.isFinite(row.median_rt_ms) && Number.isFinite(row.accuracy_pct));
    ui.researchSpeedAccuracyNote.textContent = timedRows.length
      ? `${timedRows.length} timed session(s). Point numbers follow the session table order; faster responses are not automatically better.`
      : 'No timed sessions in scope.';

    if(sessionRows.length){
      clearNode(ui.researchSessionTrendBody);
      sessionRows.forEach(row => appendResearchRow(ui.researchSessionTrendBody, [
        row.date, row.learner, row.level, row.trials,
        row.accuracy_pct == null ? null : `${row.accuracy_pct}%`,
        row.independent_pct == null ? null : `${row.independent_pct}%`,
        row.median_rt_ms == null ? null : `${row.median_rt_ms} ms`,
        row.omissions, row.commissions,
        row.mean_touch_distance_px == null ? null : `${row.mean_touch_distance_px} px`
      ]));
    } else renderResearchEmptyRow(ui.researchSessionTrendBody, 10);

    const preferenceTrials = finalTrials.filter(trial => skillIdsForTask(trial.task_kind).includes('choice.preference'));
    const outcomes = [
      { label: 'Correct', value: finalTrials.filter(trial => trial.correct && !skillIdsForTask(trial.task_kind).includes('choice.preference')).length, color: themeToken('success') },
      { label: 'Incorrect', value: finalTrials.filter(trial => !trial.correct && !trial.omission && !trial.correct_rejection && !skillIdsForTask(trial.task_kind).includes('choice.preference')).length, color: themeToken('danger') },
      { label: 'Omissions', value: finalTrials.filter(trial => trial.omission).length, color: themeToken('warning') },
      { label: 'Commissions', value: finalTrials.filter(trial => trial.commission).length, color: themeToken('danger') },
      { label: 'Correct rejections', value: finalTrials.filter(trial => trial.correct_rejection).length, color: themeToken('primary') },
      { label: 'Preference choices', value: preferenceTrials.length, color: themeToken('reward') }
    ];
    drawResearchBars(ui.researchOutcomeChart, outcomes, { labelWidth: 135 });
    ui.researchOutcomeSummary.textContent = outcomes.map(item => `${item.label}: ${item.value}`).join(' | ');

    const allowAttentionLongitudinal = scope === 'current-learner';
    const attentionFamilyRows = attentionFamilyResearchRows(sessions, allowAttentionLongitudinal);
    drawResearchBars(ui.researchAttentionFamilyChart, attentionFamilyRows.map(item => ({
      label: item.label,
      value: item.accuracy_pct,
      color: item.domain === 'sustained'
        ? themeToken('primary')
        : item.domain === 'selective-spatial'
          ? themeToken('success')
          : item.domain === 'orienting'
            ? themeToken('warning')
            : themeToken('danger')
    })), { maxValue: 100, suffix: '%', labelWidth: 190 });
    drawResearchAttentionTrend(ui.researchAttentionTrendChart, attentionFamilyRows, sessions.length, allowAttentionLongitudinal);
    if(attentionFamilyRows.length){
      clearNode(ui.researchAttentionFamilyBody);
      attentionFamilyRows.forEach(item => appendResearchRow(ui.researchAttentionFamilyBody, [
        item.label,
        item.sessions,
        item.opportunities,
        `${item.accuracy_pct}%`,
        `${item.independent_success_pct}%`,
        item.omissions,
        item.commissions,
        item.median_rt_ms == null ? null : `${item.median_rt_ms} ms`,
        item.rt_variability_ms == null ? null : `${item.rt_variability_ms} ms`,
        item.mean_touch_distance_px == null ? null : `${item.mean_touch_distance_px} px`,
        !allowAttentionLongitudinal
          ? 'Use learner scope'
          : item.descriptive_slope_pp_per_session == null
            ? 'Need 3 sessions'
            : `${item.descriptive_slope_pp_per_session > 0 ? '+' : ''}${item.descriptive_slope_pp_per_session} pp/session`
      ]));
    } else renderResearchEmptyRow(ui.researchAttentionFamilyBody, 11, 'No Attention Training trials in this scope yet.');
    ui.researchAttentionFamilyNote.textContent = scope === 'all-learners'
      ? 'Family totals are shown across learners. Select Current learner history before interpreting longitudinal change.'
      : 'Descriptive slopes require at least three observed sessions in a family. They summarise in-app practice only and do not establish transfer, causation, or neural change.';

    const connectBehaviourPoints = scope !== 'all-learners';
    drawResearchMetricTrend(ui.researchErrorRateChart, sessionRows, [
      { key: 'omission_pct', label: 'Omission rate', color: themeToken('warning') },
      { key: 'commission_pct', label: 'Commission rate', color: themeToken('danger') }
    ], { maxValue: 100, suffix: '%', connectPoints: connectBehaviourPoints });
    drawResearchMetricTrend(ui.researchRtVariabilityChart, sessionRows, [
      { key: 'rt_variability_ms', label: 'RT variability', color: themeToken('primary') }
    ], { suffix: ' ms', connectPoints: connectBehaviourPoints, emptyText: 'At least two timed responses per session are required' });
    drawResearchMetricTrend(ui.researchTouchDistanceChart, sessionRows, [
      { key: 'mean_touch_distance_px', label: 'Touch distance', color: themeToken('success') }
    ], { suffix: ' px', connectPoints: connectBehaviourPoints, emptyText: 'No touch-distance values in this scope' });
    if(sessionRows.length){
      clearNode(ui.researchBehaviourBody);
      sessionRows.forEach(row => appendResearchRow(ui.researchBehaviourBody, [
        row.date,
        row.learner,
        row.trials,
        row.omission_pct == null ? null : `${row.omission_pct}%`,
        row.commission_pct == null ? null : `${row.commission_pct}%`,
        `${row.rt_observed_count}/${row.trials}`,
        row.rt_variability_ms == null ? null : `${row.rt_variability_ms} ms`,
        `${row.touch_observed_count}/${row.trials}`,
        row.mean_touch_distance_px == null ? null : `${row.mean_touch_distance_px} px`
      ]));
    } else renderResearchEmptyRow(ui.researchBehaviourBody, 9);
    ui.researchBehaviourNote.textContent = scope === 'all-learners'
      ? 'Each point is one session; points are not connected across different learners. Missing timing and touch values remain missing.'
      : 'Rates use final trial outcomes. RT variability requires at least two observed response times; touch distance depends on task geometry and device setup.';

    const timingRows = sessions.map(sessionTimingResearchRow);
    const connectTimingPoints = scope !== 'all-learners';
    ui.researchCompletedSessions.textContent = String(timingRows.filter(row => row.status === 'completed').length);
    ui.researchStoppedSessions.textContent = String(timingRows.filter(row => row.status === 'stopped-early').length);
    ui.researchTimeLimitSessions.textContent = String(timingRows.filter(row => row.status === 'time-limit').length);
    ui.researchTimingCoverage.textContent = `${timingRows.filter(row => Number.isFinite(row.duration_minutes)).length}/${timingRows.length}`;
    drawResearchMetricTrend(ui.researchCompletionChart, timingRows, [
      { key: 'completion_pct', label: 'Question completion', color: themeToken('success') },
      { key: 'median_window_use_pct', label: 'Median window use', color: themeToken('primary') }
    ], {
      maxValue: 100,
      suffix: '%',
      connectPoints: connectTimingPoints,
      emptyText: 'No question-completion or response-window values in this scope'
    });
    drawResearchMetricTrend(ui.researchSessionDurationChart, timingRows, [
      { key: 'duration_minutes', label: 'Elapsed time', color: themeToken('warning') }
    ], {
      suffix: ' min',
      connectPoints: connectTimingPoints,
      emptyText: 'No elapsed session times in this scope'
    });
    if(timingRows.length){
      clearNode(ui.researchSessionTimingBody);
      timingRows.forEach(row => appendResearchRow(ui.researchSessionTimingBody, [
        row.date,
        row.learner,
        row.status.replace(/-/g, ' '),
        row.end_reason.replace(/-/g, ' '),
        row.planned_questions == null ? `${row.completed_questions}/--` : `${row.completed_questions}/${row.planned_questions}`,
        row.completion_pct == null ? null : `${row.completion_pct}%`,
        row.duration_minutes == null ? null : `${row.duration_minutes} min`,
        row.timed_response_count,
        row.median_window_use_pct == null ? null : `${row.median_window_use_pct}%`,
        row.timeout_count
      ]));
    } else renderResearchEmptyRow(ui.researchSessionTimingBody, 10, 'No sessions in this scope yet.');
    ui.researchSessionTimingNote.textContent = scope === 'all-learners'
      ? 'Each point is one session and points are not connected across learners. Timing describes delivery and opportunity; slower responses are not automatically worse.'
      : 'Response-window use is reaction time as a percentage of the configured trial window. It is descriptive context, not a speed target or judgement of ability.';

    const demandRows = sessions.map(sessionDemandResearchRow);
    const connectDemandPoints = scope !== 'all-learners';
    ui.researchDistractorExposure.textContent = String(demandRows.reduce((sum, row) => sum + row.distractor_trials, 0));
    ui.researchMovingExposure.textContent = String(demandRows.reduce((sum, row) => sum + row.moving_target_trials, 0));
    ui.researchTwoStageSessions.textContent = String(demandRows.filter(row => row.two_stage_prompt === true).length);
    ui.researchDemandCoverage.textContent = `${demandRows.filter(row => row.demand_observed).length}/${demandRows.length}`;
    drawResearchMetricTrend(ui.researchChoiceDemandChart, demandRows, [
      { key: 'mean_options', label: 'Displayed options', color: themeToken('primary') },
      { key: 'mean_distractors', label: 'Distractors', color: themeToken('warning') }
    ], {
      connectPoints: connectDemandPoints,
      emptyText: 'No option or distractor counts in this scope'
    });
    drawResearchMetricTrend(ui.researchTargetDemandChart, demandRows, [
      { key: 'median_target_side_px', label: 'Target side', color: themeToken('success') },
      { key: 'median_hit_radius_px', label: 'Hit radius', color: themeToken('primary') }
    ], {
      suffix: ' px',
      connectPoints: connectDemandPoints,
      emptyText: 'No target-size or hit-radius values in this scope'
    });
    if(demandRows.length){
      clearNode(ui.researchDemandBody);
      demandRows.forEach(row => appendResearchRow(ui.researchDemandBody, [
        row.date,
        row.learner,
        row.trials,
        row.mean_options,
        row.mean_distractors,
        row.distractor_trials,
        row.moving_target_trials,
        row.median_target_side_px == null ? null : `${row.median_target_side_px} px`,
        row.median_hit_radius_px == null ? null : `${row.median_hit_radius_px} px`,
        row.median_response_window_sec == null ? null : `${row.median_response_window_sec}s`,
        row.two_stage_prompt == null ? null : row.two_stage_prompt ? 'On' : 'Off'
      ]));
    } else renderResearchEmptyRow(ui.researchDemandBody, 11, 'No sessions in this scope yet.');
    ui.researchDemandNote.textContent = scope === 'all-learners'
      ? 'Points are not connected across learners. These are delivered task and interface demands, not measures of learner ability.'
      : 'Interpret performance alongside changes in options, distractors, target size, hit radius, response window, and prompt staging. Pixel values depend on device and layout.';

    const spatialRows = sessions.map(session => {
      const sessionTrials = latestTrialsByQuestion(session.trials || []);
      const eligible = sessionTrials.filter(trial => (
        !trial.open_ended_choice
        && !trial.touch_anywhere_accepted
        && Number.isFinite(trial.raw_distance_to_target_px)
        && Number.isFinite(trial.adaptive_hit_radius_px)
        && trial.adaptive_hit_radius_px > 0
      ));
      const bands = { within: 0, near: 0, mid: 0, far: 0 };
      const directions = { left: 0, right: 0, above: 0, below: 0 };
      const normalizedDistances = [];
      let directionObserved = 0;
      eligible.forEach(trial => {
        const ratio = trial.raw_distance_to_target_px / trial.adaptive_hit_radius_px;
        normalizedDistances.push(ratio);
        if(ratio <= 1) bands.within += 1;
        else if(ratio <= 2) bands.near += 1;
        else if(ratio <= 4) bands.mid += 1;
        else bands.far += 1;
        if(!Number.isFinite(trial.touch_delta_x_px) || !Number.isFinite(trial.touch_delta_y_px) || ratio <= 1) return;
        directionObserved += 1;
        if(Math.abs(trial.touch_delta_x_px) >= Math.abs(trial.touch_delta_y_px)){
          directions[trial.touch_delta_x_px < 0 ? 'left' : 'right'] += 1;
        } else {
          directions[trial.touch_delta_y_px < 0 ? 'above' : 'below'] += 1;
        }
      });
      return {
        date: researchDateLabel(Number(session.updated_at_wall_ms)),
        learner: session.learner_alias || session.learner || 'Unknown',
        trials: sessionTrials.length,
        observed: eligible.length,
        direction_observed: directionObserved,
        ...bands,
        ...directions,
        mean_hit_radius_ratio: normalizedDistances.length ? Number(mean(normalizedDistances).toFixed(2)) : null
      };
    });
    const spatialTotals = spatialRows.reduce((totals, row) => {
      ['within', 'near', 'mid', 'far', 'left', 'right', 'above', 'below'].forEach(key => {
        totals[key] += row[key];
      });
      return totals;
    }, { within: 0, near: 0, mid: 0, far: 0, left: 0, right: 0, above: 0, below: 0 });
    drawResearchBars(ui.researchTouchBandChart, [
      { label: 'Within hit radius', value: spatialTotals.within, color: themeToken('success') },
      { label: 'Near (1-2 radii)', value: spatialTotals.near, color: themeToken('primary') },
      { label: 'Mid (2-4 radii)', value: spatialTotals.mid, color: themeToken('warning') },
      { label: 'Far (>4 radii)', value: spatialTotals.far, color: themeToken('danger') }
    ], { labelWidth: 155 });
    drawResearchBars(ui.researchTouchDirectionChart, [
      { label: 'Left of target', value: spatialTotals.left, color: themeToken('primary') },
      { label: 'Right of target', value: spatialTotals.right, color: themeToken('secondary', themeToken('primary')) },
      { label: 'Above target', value: spatialTotals.above, color: themeToken('success') },
      { label: 'Below target', value: spatialTotals.below, color: themeToken('warning') }
    ], { labelWidth: 145 });
    if(spatialRows.length){
      clearNode(ui.researchTouchSpatialBody);
      spatialRows.forEach(item => appendResearchRow(ui.researchTouchSpatialBody, [
        item.date,
        item.learner,
        `${item.observed}/${item.trials}`,
        item.within,
        item.near,
        item.mid,
        item.far,
        `${item.direction_observed}/${item.observed}`,
        item.left,
        item.right,
        item.above,
        item.below,
        item.mean_hit_radius_ratio == null ? null : `${item.mean_hit_radius_ratio} radii`
      ]));
    } else renderResearchEmptyRow(ui.researchTouchSpatialBody, 13, 'No sessions in this scope yet.');
    ui.researchTouchSpatialNote.textContent = 'Distance bands divide raw target-centre distance by that trial’s adaptive hit radius. Direction excludes touches inside the hit radius and requires target geometry from a compatible V1.8 record. This is a descriptive interface measure, not a motor, visual-field, or diagnostic assessment.';

    const skillRows = researchSummary.skill_summaries;
    drawResearchBars(ui.researchSkillChart, skillRows.filter(item => item.accuracy_pct != null).map(item => ({
      label: item.label,
      value: item.accuracy_pct,
      color: themeToken('primary')
    })), { maxValue: 100, suffix: '%', labelWidth: 190 });
    if(skillRows.length){
      clearNode(ui.researchSkillBody);
      skillRows.forEach(item => appendResearchRow(ui.researchSkillBody, [
        item.label, item.opportunities, item.scored_opportunities,
        item.accuracy_pct == null ? 'Not scored' : `${item.accuracy_pct}%`,
        item.independent_correct, item.assisted_correct, item.omissions, item.commissions,
        item.median_reaction_time_ms == null ? null : `${item.median_reaction_time_ms} ms`,
        item.mean_touch_distance_px == null ? null : `${item.mean_touch_distance_px} px`
      ]));
    } else renderResearchEmptyRow(ui.researchSkillBody, 10);

    const taskVariantMap = new Map();
    finalTrials.forEach(trial => {
      const condition = trial.research_condition || 'not recorded';
      const taskKind = trial.task_kind || 'unknown';
      const variant = trial.variant_label || trial.task_variant || 'Default';
      const key = `${condition}|${taskKind}|${variant}`;
      if(!taskVariantMap.has(key)){
        taskVariantMap.set(key, {
          condition,
          task_kind: taskKind,
          task_label: taskLabel(taskKind),
          variant,
          trials: 0,
          scored: 0,
          correct: 0,
          support_observed: 0,
          independent: 0,
          omissions: 0,
          commissions: 0,
          response_times: []
        });
      }
      const item = taskVariantMap.get(key);
      const isPreference = skillIdsForTask(taskKind).includes('choice.preference');
      const scored = trial.scored_response !== false && !isPreference;
      const supportObserved = ['independent', 'prompted', 'assisted'].includes(trial.independence_status);
      item.trials += 1;
      if(scored){
        item.scored += 1;
        if(trial.correct) item.correct += 1;
      }
      if(supportObserved){
        item.support_observed += 1;
        if(trial.independence_status === 'independent') item.independent += 1;
      }
      if(trial.omission) item.omissions += 1;
      if(trial.commission) item.commissions += 1;
      if(Number.isFinite(trial.response_time_ms)) item.response_times.push(trial.response_time_ms);
    });
    const taskVariantRows = Array.from(taskVariantMap.values()).map(item => ({
      ...item,
      accuracy_pct: item.scored ? Math.round((item.correct / item.scored) * 100) : null,
      independent_pct: item.support_observed ? Math.round((item.independent / item.support_observed) * 100) : null,
      median_rt_ms: item.response_times.length ? Math.round(median(item.response_times)) : null
    })).sort((a, b) => b.trials - a.trials || a.task_label.localeCompare(b.task_label) || a.variant.localeCompare(b.variant));
    ui.researchTaskTypeCount.textContent = String(new Set(taskVariantRows.map(item => item.task_kind)).size);
    ui.researchTaskVariantCount.textContent = String(new Set(taskVariantRows.map(item => `${item.task_kind}|${item.variant}`)).size);
    ui.researchConditionCount.textContent = String(new Set(taskVariantRows.map(item => item.condition)).size);
    drawResearchBars(ui.researchTaskVariantChart, taskVariantRows
      .filter(item => item.accuracy_pct != null)
      .slice(0, 12)
      .map(item => ({
        label: `${item.task_label}: ${item.variant}`,
        value: item.accuracy_pct,
        color: item.condition === 'active-control' ? themeToken('warning') : themeToken('primary')
      })), { maxValue: 100, suffix: '%', labelWidth: 240 });
    if(taskVariantRows.length){
      clearNode(ui.researchTaskVariantBody);
      taskVariantRows.forEach(item => appendResearchRow(ui.researchTaskVariantBody, [
        RESEARCH_CONDITION_LABELS[item.condition] || item.condition,
        item.task_label,
        item.variant,
        item.trials,
        item.scored,
        item.accuracy_pct == null ? 'Not scored' : `${item.accuracy_pct}%`,
        item.independent_pct == null ? null : `${item.independent_pct}%`,
        item.omissions,
        item.commissions,
        item.median_rt_ms == null ? null : `${item.median_rt_ms} ms`
      ]));
    } else renderResearchEmptyRow(ui.researchTaskVariantBody, 10);

    const practiceStates = skillPracticeStatesForSessions(sessions);
    drawResearchBars(ui.researchPracticeChart, practiceStates.filter(item => item.recent_accuracy_pct != null).map(item => ({
      label: item.label,
      value: item.recent_accuracy_pct,
      color: item.practice_status === 'consistent-current-sample'
        ? themeToken('success')
        : item.practice_status === 'needs-support'
          ? themeToken('danger')
          : themeToken('primary')
    })), { maxValue: 100, suffix: '%', labelWidth: 190 });
    if(practiceStates.length){
      clearNode(ui.researchPracticeBody);
      practiceStates.forEach(item => appendResearchRow(ui.researchPracticeBody, [
        item.label,
        item.practice_status_label,
        item.sessions_observed,
        item.opportunities,
        item.recent_accuracy_pct == null ? 'Not scored' : `${item.recent_accuracy_pct}%`,
        item.recent_independent_success_pct == null ? 'Not scored' : `${item.recent_independent_success_pct}%`,
        item.last_practised_wall_ms ? `${researchDateLabel(item.last_practised_wall_ms)} (${item.days_since_last_practice}d ago)` : null,
        item.trend_status_label,
        item.retention_gap_days == null
          ? item.retention_status_label
          : `${item.retention_status_label} (${item.retention_gap_days}d gap)`,
        item.support_direction_label
      ]));
    } else renderResearchEmptyRow(ui.researchPracticeBody, 10);

    const currentAlias = currentPupilAlias();
    const currentName = currentPupilName();
    const currentLearnerSessions = sessions.filter(session => sessionMatchesLearner(session, currentName, currentAlias));
    const proposal = recommendationForSessions(currentLearnerSessions, currentAlias);
    renderRecommendationResearch(sessions, proposal);

    const supportOrder = ['independent', 'prompted', 'assisted', 'unknown'];
    const supportRows = supportOrder.map(status => {
      const matching = finalTrials.filter(trial => (trial.independence_status || 'unknown') === status);
      return { status, responses: matching.length, correct: matching.filter(trial => trial.correct).length };
    }).filter(item => item.responses);
    drawResearchBars(ui.researchSupportChart, supportRows.map(item => ({
      label: item.status,
      value: item.responses,
      color: item.status === 'independent' ? themeToken('success') : themeToken('warning')
    })), { labelWidth: 120 });
    if(supportRows.length){
      clearNode(ui.researchSupportBody);
      supportRows.forEach(item => appendResearchRow(ui.researchSupportBody, [item.status, item.responses, item.correct]));
    } else renderResearchEmptyRow(ui.researchSupportBody, 3);

    const connectLongitudinalPoints = scope !== 'all-learners';
    const supportTrendRows = sessions.map(session => {
      const sessionTrials = latestTrialsByQuestion(session.trials || []);
      const responded = sessionTrials.filter(trial => !trial.omission);
      const independenceStatus = trial => ['independent', 'prompted', 'assisted'].includes(trial.independence_status)
        ? trial.independence_status
        : 'unknown';
      const independent = responded.filter(trial => independenceStatus(trial) === 'independent').length;
      const prompted = responded.filter(trial => independenceStatus(trial) === 'prompted').length;
      const assisted = responded.filter(trial => independenceStatus(trial) === 'assisted').length;
      const unknown = responded.filter(trial => independenceStatus(trial) === 'unknown').length;
      const supportObserved = independent + prompted + assisted;
      const promptLevels = responded.map(trial => trial.highest_prompt_level).filter(Number.isFinite);
      const fidelity = session.fidelity || {};
      return {
        date: researchDateLabel(Number(session.updated_at_wall_ms)),
        learner: session.learner_alias || session.learner || 'Unknown',
        responses: responded.length,
        support_observed: supportObserved,
        independent,
        prompted,
        assisted,
        unknown,
        independent_pct: supportObserved ? Math.round((independent / supportObserved) * 100) : null,
        mean_prompt_level: promptLevels.length ? Number(mean(promptLevels).toFixed(1)) : null,
        dosage_actual_minutes: Number.isFinite(fidelity.dosage_minutes_actual) ? fidelity.dosage_minutes_actual : null,
        dosage_target_minutes: Number.isFinite(fidelity.dosage_minutes_target) ? fidelity.dosage_minutes_target : null,
        fidelity_pct: Number.isFinite(fidelity.score_pct) ? fidelity.score_pct : null
      };
    });
    drawResearchMetricTrend(ui.researchSupportTrendChart, supportTrendRows, [
      { key: 'independent_pct', label: 'Independent', color: themeToken('success') },
      { key: 'fidelity_pct', label: 'Fidelity', color: themeToken('primary') }
    ], { maxValue: 100, suffix: '%', connectPoints: connectLongitudinalPoints });
    drawResearchMetricTrend(ui.researchDosageChart, supportTrendRows, [
      { key: 'dosage_actual_minutes', label: 'Actual', color: themeToken('primary') },
      { key: 'dosage_target_minutes', label: 'Target', color: themeToken('warning') }
    ], { suffix: 'm', connectPoints: connectLongitudinalPoints });
    if(supportTrendRows.length){
      clearNode(ui.researchSupportTrendBody);
      supportTrendRows.forEach(item => appendResearchRow(ui.researchSupportTrendBody, [
        item.date,
        item.learner,
        item.responses,
        item.support_observed,
        item.independent_pct == null ? null : `${item.independent_pct}%`,
        item.prompted,
        item.assisted,
        item.unknown,
        item.mean_prompt_level,
        item.dosage_actual_minutes == null ? null : `${item.dosage_actual_minutes} min`,
        item.dosage_target_minutes == null ? null : `${item.dosage_target_minutes} min`,
        item.fidelity_pct == null ? null : `${item.fidelity_pct}%`
      ]));
    } else renderResearchEmptyRow(ui.researchSupportTrendBody, 12);
    ui.researchSupportTrendNote.textContent = scope === 'all-learners'
      ? 'Pooled learners are shown as unconnected points. Independent percentage uses responses with an observed support status; missing statuses remain unknown. These implementation observations do not establish transfer or neural change.'
      : 'Connected points follow sessions in date order. Independent percentage uses responses with an observed support status; missing statuses remain unknown. These implementation observations do not establish transfer or neural change.';

    const sequenceCadence = scope !== 'all-learners';
    let cumulativeDose = 0;
    let previousSessionTime = null;
    const cadenceRows = sessions.map(session => {
      const timestamp = Number(session.updated_at_wall_ms);
      const fidelity = session.fidelity || {};
      const actualDose = Number.isFinite(fidelity.dosage_minutes_actual) ? fidelity.dosage_minutes_actual : null;
      const targetDose = Number.isFinite(fidelity.dosage_minutes_target) ? fidelity.dosage_minutes_target : null;
      const gapDays = sequenceCadence && Number.isFinite(timestamp) && Number.isFinite(previousSessionTime)
        ? Number(((timestamp - previousSessionTime) / 86400000).toFixed(1))
        : null;
      if(sequenceCadence && Number.isFinite(actualDose)) cumulativeDose += actualDose;
      if(sequenceCadence && Number.isFinite(timestamp)) previousSessionTime = timestamp;
      return {
        date: researchDateLabel(timestamp),
        learner: session.learner_alias || session.learner || 'Unknown',
        condition: RESEARCH_CONDITION_LABELS[session.research_condition] || session.research_condition || 'Not recorded',
        trials: latestTrialsByQuestion(session.trials || []).length,
        actual_dose_minutes: actualDose,
        target_dose_minutes: targetDose,
        cumulative_dose_minutes: sequenceCadence && Number.isFinite(actualDose) ? Number(cumulativeDose.toFixed(2)) : null,
        gap_days: gapDays
      };
    });
    const observedDoseValues = cadenceRows.map(row => row.actual_dose_minutes).filter(Number.isFinite);
    const gapValues = cadenceRows.map(row => row.gap_days).filter(Number.isFinite);
    const activeDays = new Set(cadenceRows.map(row => row.date).filter(date => date !== 'Unknown')).size;
    ui.researchCumulativeDose.textContent = observedDoseValues.length
      ? `${Number(observedDoseValues.reduce((sum, value) => sum + value, 0).toFixed(2))} min`
      : '--';
    ui.researchActiveDays.textContent = String(activeDays);
    ui.researchMedianSessionGap.textContent = sequenceCadence && gapValues.length
      ? `${Number(median(gapValues).toFixed(1))} days`
      : '--';
    ui.researchDoseCoverage.textContent = `${observedDoseValues.length}/${sessions.length}`;
    drawResearchMetricTrend(ui.researchCumulativeDoseChart, cadenceRows, [
      { key: 'cumulative_dose_minutes', label: 'Cumulative dose', color: themeToken('primary') }
    ], {
      suffix: 'm',
      connectPoints: sequenceCadence,
      emptyText: sequenceCadence ? 'No observed dose values in this scope' : 'Select one learner to sequence cumulative exposure'
    });
    drawResearchMetricTrend(ui.researchSessionGapChart, cadenceRows, [
      { key: 'gap_days', label: 'Session gap', color: themeToken('secondary', themeToken('success')) }
    ], {
      suffix: 'd',
      connectPoints: sequenceCadence,
      emptyText: sequenceCadence ? 'At least two dated sessions are required' : 'Select one learner to calculate session gaps'
    });
    if(cadenceRows.length){
      clearNode(ui.researchCadenceBody);
      cadenceRows.forEach(item => appendResearchRow(ui.researchCadenceBody, [
        item.date,
        item.learner,
        item.condition,
        item.trials,
        item.actual_dose_minutes == null ? null : `${item.actual_dose_minutes} min`,
        item.target_dose_minutes == null ? null : `${item.target_dose_minutes} min`,
        item.cumulative_dose_minutes == null ? null : `${item.cumulative_dose_minutes} min`,
        item.gap_days == null ? null : `${item.gap_days} days`
      ]));
    } else renderResearchEmptyRow(ui.researchCadenceBody, 8, 'No sessions in this scope yet.');
    ui.researchCadenceNote.textContent = scope === 'all-learners'
      ? 'Total observed minutes and active days are pooled. Cumulative order and session gaps are suppressed because sessions from different learners are not one trajectory.'
      : 'Cumulative minutes and gaps follow dated sessions in order. Exposure and spacing describe delivery; they do not establish a dose-response relationship, transfer, or neural change.';

    const promptLevelRows = PROMPT_LADDER.map(prompt => {
      const matching = finalTrials.filter(trial => Number.isFinite(trial.highest_prompt_level) && trial.highest_prompt_level === prompt.level);
      return {
        level: prompt.level,
        label: prompt.label,
        trials: matching.length,
        scored_correct: matching.filter(trial => trial.scored_response !== false && trial.correct).length,
        omissions: matching.filter(trial => trial.omission).length
      };
    }).filter(item => item.trials > 0);
    const unknownPromptTrials = finalTrials.filter(trial => !Number.isFinite(trial.highest_prompt_level));
    if(unknownPromptTrials.length){
      promptLevelRows.push({
        level: null,
        label: 'Not recorded',
        trials: unknownPromptTrials.length,
        scored_correct: unknownPromptTrials.filter(trial => trial.scored_response !== false && trial.correct).length,
        omissions: unknownPromptTrials.filter(trial => trial.omission).length
      });
    }
    drawResearchBars(ui.researchPromptLevelChart, promptLevelRows.map(item => ({
      label: item.level == null ? item.label : `P${item.level} ${item.label}`,
      value: item.trials,
      color: item.level === 0 ? themeToken('success') : item.level == null ? themeToken('danger') : themeToken('warning')
    })), { labelWidth: 155 });
    if(promptLevelRows.length){
      clearNode(ui.researchPromptLevelBody);
      promptLevelRows.forEach(item => appendResearchRow(ui.researchPromptLevelBody, [
        item.level == null ? 'Not recorded' : `P${item.level}`,
        item.label,
        item.trials,
        item.scored_correct,
        item.omissions
      ]));
    } else renderResearchEmptyRow(ui.researchPromptLevelBody, 5, 'No final trials in this scope yet.');

    const agencyRows = sessions.map(session => {
      const events = Array.isArray(session.events) ? session.events : [];
      const markers = Array.isArray(session.eeg_markers) ? session.eeg_markers : [];
      const sessionTrials = latestTrialsByQuestion(session.trials || []);
      const contextTrial = sessionTrials.find(trial => trial.session_context && typeof trial.session_context === 'object');
      const context = contextTrial ? contextTrial.session_context : {};
      const countEvents = (type, predicate=() => true) => events.filter(event => event.type === type && predicate(event)).length;
      return {
        date: researchDateLabel(Number(session.updated_at_wall_ms)),
        learner: session.learner_alias || session.learner || 'Unknown',
        help: countEvents('help_requested'),
        prompts: countEvents('prompt_applied'),
        repeats: countEvents('question_repeat'),
        learner_breaks: countEvents('break_onset', event => event.reason === 'learner-break'),
        auto_pauses: countEvents('break_onset', event => event.reason === 'auto-block-pause'),
        stops: countEvents('learner_stop_requested'),
        rewards: markers.filter(marker => marker.name === 'reward_onset').length,
        reward_choice: context.reward_choice || (session.settings && session.settings.rewardChoice) || 'not recorded'
      };
    });
    const agencyEventTotals = [
      { key: 'help', label: 'Help requests', color: themeToken('primary') },
      { key: 'prompts', label: 'Prompt events', color: themeToken('warning') },
      { key: 'repeats', label: 'Repeats', color: themeToken('secondary', themeToken('primary')) },
      { key: 'learner_breaks', label: 'Learner breaks', color: themeToken('success') },
      { key: 'auto_pauses', label: 'Auto pauses', color: themeToken('reward') },
      { key: 'stops', label: 'Early stops', color: themeToken('danger') },
      { key: 'rewards', label: 'Reward onsets', color: themeToken('reward') }
    ].map(item => ({
      ...item,
      value: agencyRows.reduce((sum, row) => sum + row[item.key], 0)
    }));
    drawResearchBars(ui.researchAgencyEventChart, agencyEventTotals, { labelWidth: 150 });
    if(agencyRows.length){
      clearNode(ui.researchAgencyEventBody);
      agencyRows.forEach(item => appendResearchRow(ui.researchAgencyEventBody, [
        item.date,
        item.learner,
        item.help,
        item.prompts,
        item.repeats,
        item.learner_breaks,
        item.auto_pauses,
        item.stops,
        item.rewards,
        String(item.reward_choice).replace(/-/g, ' ')
      ]));
    } else renderResearchEmptyRow(ui.researchAgencyEventBody, 10, 'No sessions in this scope yet.');
    ui.researchAgencyEventNote.textContent = scope === 'all-learners'
      ? 'Counts are pooled across learners and are not a single longitudinal trajectory. Help, breaks, and repeats are communication and regulation observations, not deficit scores.'
      : 'Counts follow each session. Help, breaks, and repeats are communication and regulation observations; availability, task demands, and practitioner practice affect every count.';

    const categoryMap = new Map();
    finalTrials.forEach(trial => {
      const key = trial.target_category_label || trial.target_category || 'Uncategorised';
      if(!categoryMap.has(key)) categoryMap.set(key, { label: key, trials: 0, scored: 0, correct: 0, photoTrials: 0 });
      const item = categoryMap.get(key);
      item.trials += 1;
      if(!skillIdsForTask(trial.task_kind).includes('choice.preference')){
        item.scored += 1;
        if(trial.correct) item.correct += 1;
      }
      if(Array.isArray(trial.photo_labels_used) && trial.photo_labels_used.length) item.photoTrials += 1;
    });
    const categoryRows = Array.from(categoryMap.values()).sort((a, b) => b.trials - a.trials || a.label.localeCompare(b.label));
    drawResearchBars(ui.researchCategoryChart, categoryRows.slice(0, 8).map(item => ({ label: item.label, value: item.trials, color: themeToken('secondary', themeToken('primary')) })), { labelWidth: 130 });
    if(categoryRows.length){
      clearNode(ui.researchCategoryBody);
      categoryRows.forEach(item => appendResearchRow(ui.researchCategoryBody, [
        item.label, item.trials, item.scored ? `${Math.round((item.correct / item.scored) * 100)}%` : 'Not scored', item.photoTrials
      ]));
    } else renderResearchEmptyRow(ui.researchCategoryBody, 4);

    const targetMap = new Map();
    finalTrials
      .filter(trial => trial.task_kind !== 'choice-preference' && (trial.target_id || trial.target_label))
      .forEach(trial => {
        const key = trial.target_id || normalizedConceptLabel(trial.target_label);
        if(!targetMap.has(key)){
          targetMap.set(key, {
            label: trial.target_label || 'Unlabelled target',
            category: trial.target_category_label || trial.target_category || 'Uncategorised',
            source: trial.target_source || 'not recorded',
            trials: 0,
            correct: 0,
            personalised: false,
            assisted: 0,
            responseTimes: []
          });
        }
        const item = targetMap.get(key);
        item.trials += 1;
        if(trial.correct) item.correct += 1;
        if(trial.independence_status && trial.independence_status !== 'independent') item.assisted += 1;
        if(Number.isFinite(trial.response_time_ms)) item.responseTimes.push(trial.response_time_ms);
        if((Array.isArray(trial.photo_labels_used) && trial.photo_labels_used.length)
          || ['upload', 'uploaded', 'pupil-photo', 'personalised'].includes(trial.target_source)){
          item.personalised = true;
        }
      });
    const targetRows = Array.from(targetMap.values()).sort((a, b) => b.trials - a.trials || a.label.localeCompare(b.label));
    const targetExposureCount = targetRows.reduce((sum, item) => sum + item.trials, 0);
    ui.researchDistinctTargets.textContent = String(targetRows.length);
    ui.researchRepeatTargets.textContent = String(Math.max(0, targetExposureCount - targetRows.length));
    ui.researchPersonalisedTrials.textContent = String(targetRows.reduce((sum, item) => sum + (item.personalised ? item.trials : 0), 0));
    drawResearchBars(ui.researchTargetChart, targetRows.slice(0, 8).map(item => ({
      label: item.label,
      value: item.trials,
      color: item.personalised ? themeToken('secondary', themeToken('primary')) : themeToken('primary')
    })), { labelWidth: 130 });
    if(targetRows.length){
      clearNode(ui.researchTargetBody);
      targetRows.forEach(item => appendResearchRow(ui.researchTargetBody, [
        item.label,
        item.category,
        item.source,
        item.trials,
        `${Math.round((item.correct / item.trials) * 100)}%`,
        item.responseTimes.length ? `${Math.round(median(item.responseTimes))} ms` : null,
        `${item.assisted}/${item.trials}`
      ]));
    } else renderResearchEmptyRow(ui.researchTargetBody, 7, 'No scored target exposure in this scope yet.');

    const matchRows = categoryMatchResearchRows(finalTrials);
    const matchTrialCount = matchRows.reduce((sum, item) => sum + item.trials, 0);
    const matchPairCount = matchRows.reduce((sum, item) => sum + item.distinct_pairs, 0);
    const matchIntegrityObserved = matchRows.reduce((sum, item) => sum + item.generator_integrity_observed, 0);
    const matchIntegrityValid = matchRows.reduce((sum, item) => sum + item.generator_integrity_valid, 0);
    ui.researchMatchTrials.textContent = String(matchTrialCount);
    ui.researchMatchCategories.textContent = String(matchRows.length);
    ui.researchMatchPairs.textContent = String(matchPairCount);
    ui.researchMatchIntegrity.textContent = matchIntegrityObserved ? `${percentage(matchIntegrityValid, matchIntegrityObserved)}%` : 'Not recorded';
    drawResearchBars(ui.researchMatchCategoryChart, matchRows.map(item => ({
      label: item.category,
      value: item.accuracy_pct,
      color: themeToken('secondary', themeToken('primary'))
    })), { maxValue: 100, suffix: '%', labelWidth: 145 });
    if(matchRows.length){
      clearNode(ui.researchMatchCategoryBody);
      matchRows.forEach(item => appendResearchRow(ui.researchMatchCategoryBody, [
        item.category,
        item.trials,
        item.distinct_cues,
        item.distinct_targets,
        item.distinct_pairs,
        `${item.accuracy_pct}%`,
        `${item.independent_success_pct}%`,
        item.omissions,
        item.median_reaction_time_ms == null ? null : `${item.median_reaction_time_ms} ms`,
        item.generator_integrity_pct == null
          ? 'Not recorded'
          : `${item.generator_integrity_valid}/${item.generator_integrity_observed} (${item.generator_integrity_pct}%)`
      ]));
    } else renderResearchEmptyRow(ui.researchMatchCategoryBody, 10, 'No Match category trials in this scope yet.');
    ui.researchMatchCategoryNote.textContent = scope === 'all-learners'
      ? 'Rows pool learners and are not a single learning trajectory. Category matching describes delivered in-app tasks; generator integrity is an engineering/data-quality check, not a pupil outcome or evidence of generalisation.'
      : 'Category matching describes delivered in-app cue-and-choice tasks. Generator integrity is an engineering/data-quality check of stored cue, target, category, and option relationships; neither measure proves conceptual mastery or real-world generalisation.';

    const exclusionRows = categoryExclusionResearchRows(finalTrials);
    const exclusionTrialCount = exclusionRows.reduce((sum, item) => sum + item.trials, 0);
    const exclusionTargetCount = exclusionRows.reduce((sum, item) => sum + item.distinct_outside_targets, 0);
    const exclusionIntegrityObserved = exclusionRows.reduce((sum, item) => sum + item.generator_integrity_observed, 0);
    const exclusionIntegrityValid = exclusionRows.reduce((sum, item) => sum + item.generator_integrity_valid, 0);
    ui.researchExclusionTrials.textContent = String(exclusionTrialCount);
    ui.researchExclusionCategories.textContent = String(exclusionRows.length);
    ui.researchExclusionTargets.textContent = String(exclusionTargetCount);
    ui.researchExclusionIntegrity.textContent = exclusionIntegrityObserved ? `${percentage(exclusionIntegrityValid, exclusionIntegrityObserved)}%` : 'Not recorded';
    drawResearchBars(ui.researchExclusionCategoryChart, exclusionRows.map(item => ({
      label: item.reference_category,
      value: item.accuracy_pct,
      color: themeToken('reward', themeToken('primary'))
    })), { maxValue: 100, suffix: '%', labelWidth: 145 });
    if(exclusionRows.length){
      clearNode(ui.researchExclusionCategoryBody);
      exclusionRows.forEach(item => appendResearchRow(ui.researchExclusionCategoryBody, [
        item.reference_category,
        item.trials,
        item.distinct_group_exemplars,
        item.distinct_outside_targets,
        `${item.accuracy_pct}%`,
        `${item.independent_success_pct}%`,
        item.omissions,
        item.median_reaction_time_ms == null ? null : `${item.median_reaction_time_ms} ms`,
        item.generator_integrity_pct == null
          ? 'Not recorded'
          : `${item.generator_integrity_valid}/${item.generator_integrity_observed} (${item.generator_integrity_pct}%)`
      ]));
    } else renderResearchEmptyRow(ui.researchExclusionCategoryBody, 9, 'No Find the different one trials in this scope yet.');
    ui.researchExclusionCategoryNote.textContent = scope === 'all-learners'
      ? 'Rows pool learners and are not a single learning trajectory. This profile describes delivered in-app category-difference trials; it does not demonstrate conceptual mastery, transfer, or neural change.'
      : 'This profile describes delivered in-app category-difference trials. Generator integrity checks that exactly one stored option is outside the reference category; it is not a pupil outcome or evidence of conceptual mastery, transfer, or neural change.';

    const contentBreadthRows = sessions.map(session => {
      const sessionTrials = latestTrialsByQuestion(session.trials || []);
      const displayedCategories = new Set();
      sessionTrials.forEach(trial => {
        (Array.isArray(trial.option_metadata) ? trial.option_metadata : []).forEach(option => {
          const categories = Array.isArray(option.category_ids) && option.category_ids.length
            ? option.category_ids
            : (option.category ? [option.category] : []);
          categories.forEach(category => {
            if(category) displayedCategories.add(category);
          });
        });
      });
      const scoredTargetIds = sessionTrials
        .filter(trial => trial.task_kind !== 'choice-preference' && (trial.target_id || trial.target_label))
        .map(trial => trial.target_id || normalizedConceptLabel(trial.target_label));
      const distinctScoredTargets = new Set(scoredTargetIds).size;
      const repeatExposures = Math.max(0, scoredTargetIds.length - distinctScoredTargets);
      const personalisedTrials = sessionTrials.filter(trial => (
        (Array.isArray(trial.option_metadata) && trial.option_metadata.some(option => option.personalised_photo))
        || (Array.isArray(trial.photo_labels_used) && trial.photo_labels_used.length)
      )).length;
      const preferenceSelections = sessionTrials.filter(trial => trial.task_kind === 'choice-preference' && trial.selected_id).length;
      return {
        date: researchDateLabel(Number(session.updated_at_wall_ms)),
        learner: session.learner_alias || session.learner || 'Unknown',
        trials: sessionTrials.length,
        displayed_categories: displayedCategories.size,
        distinct_scored_targets: distinctScoredTargets,
        repeat_exposures: repeatExposures,
        repeat_pct: scoredTargetIds.length ? Math.round((repeatExposures / scoredTargetIds.length) * 100) : null,
        personalised_trials: personalisedTrials,
        personalised_pct: sessionTrials.length ? Math.round((personalisedTrials / sessionTrials.length) * 100) : null,
        preference_selections: preferenceSelections
      };
    });
    drawResearchMetricTrend(ui.researchContentBreadthChart, contentBreadthRows, [
      { key: 'displayed_categories', label: 'Categories', color: themeToken('secondary', themeToken('primary')) },
      { key: 'distinct_scored_targets', label: 'Scored targets', color: themeToken('primary') }
    ], { connectPoints: connectLongitudinalPoints });
    drawResearchMetricTrend(ui.researchContentMixChart, contentBreadthRows, [
      { key: 'personalised_pct', label: 'Personalised', color: themeToken('secondary', themeToken('success')) },
      { key: 'repeat_pct', label: 'Repeated', color: themeToken('warning') }
    ], { maxValue: 100, suffix: '%', connectPoints: connectLongitudinalPoints });
    if(contentBreadthRows.length){
      clearNode(ui.researchContentBreadthBody);
      contentBreadthRows.forEach(item => appendResearchRow(ui.researchContentBreadthBody, [
        item.date,
        item.learner,
        item.trials,
        item.displayed_categories,
        item.distinct_scored_targets,
        item.repeat_exposures,
        item.personalised_trials,
        item.preference_selections
      ]));
    } else renderResearchEmptyRow(ui.researchContentBreadthBody, 8);
    ui.researchContentBreadthNote.textContent = scope === 'all-learners'
      ? 'Pooled learners are shown as unconnected points. Breadth describes presented content and does not establish generalisation.'
      : 'Connected points follow sessions in date order. Breadth describes presented content and does not establish generalisation.';

    const preferenceMap = new Map();
    finalTrials
      .filter(trial => trial.task_kind === 'choice-preference' && (trial.selected_id || trial.selected_label))
      .forEach(trial => {
        const metadata = (Array.isArray(trial.option_metadata) ? trial.option_metadata : [])
          .find(option => option.id === trial.selected_id) || {};
        const key = trial.selected_id || normalizedConceptLabel(trial.selected_label);
        if(!preferenceMap.has(key)){
          preferenceMap.set(key, {
            label: trial.selected_label || metadata.label || 'Unlabelled selection',
            category: metadata.category ? categoryMeta(metadata.category).label : 'Not recorded',
            source: metadata.source || 'not recorded',
            selections: 0,
            assisted: 0,
            personalised: !!metadata.personalised_photo,
            most_recent_wall_ms: null
          });
        }
        const item = preferenceMap.get(key);
        item.selections += 1;
        if(trial.independence_status && trial.independence_status !== 'independent') item.assisted += 1;
        if(metadata.personalised_photo || ['upload', 'uploaded', 'pupil-photo', 'personalised'].includes(metadata.source)) item.personalised = true;
        const observedAt = [trial.response_wall_ms, trial.stimulus_onset_wall_ms].find(Number.isFinite);
        if(Number.isFinite(observedAt)) item.most_recent_wall_ms = Math.max(item.most_recent_wall_ms || 0, observedAt);
      });
    const preferenceRows = Array.from(preferenceMap.values()).sort((a, b) => b.selections - a.selections || a.label.localeCompare(b.label));
    ui.researchPreferenceSelections.textContent = String(preferenceRows.reduce((sum, item) => sum + item.selections, 0));
    ui.researchPreferenceDistinct.textContent = String(preferenceRows.length);
    ui.researchPreferencePersonalised.textContent = String(preferenceRows.reduce((sum, item) => sum + (item.personalised ? item.selections : 0), 0));
    drawResearchBars(ui.researchPreferenceChart, preferenceRows.slice(0, 10).map(item => ({
      label: item.label,
      value: item.selections,
      color: item.personalised ? themeToken('secondary', themeToken('success')) : themeToken('reward')
    })), { labelWidth: 150 });
    if(preferenceRows.length){
      clearNode(ui.researchPreferenceBody);
      preferenceRows.forEach(item => appendResearchRow(ui.researchPreferenceBody, [
        item.label,
        item.category,
        item.source,
        item.selections,
        item.assisted,
        item.most_recent_wall_ms ? researchDateLabel(item.most_recent_wall_ms) : null
      ]));
    } else renderResearchEmptyRow(ui.researchPreferenceBody, 6, 'No open-ended preference selections in this scope yet.');

    const fixedConditionRows = sessions.map(fixedConditionResearchRow);
    const fixedEnabledRows = fixedConditionRows.filter(row => row.enabled);
    const fixedAdherentRows = fixedEnabledRows.filter(row => row.adherence_status === 'adherent');
    const fixedExceptionRows = fixedEnabledRows.filter(row => row.adherence_status !== 'adherent');
    ui.researchFixedConditionSessions.textContent = String(fixedEnabledRows.length);
    ui.researchFixedConditionAdherent.textContent = String(fixedAdherentRows.length);
    ui.researchFixedConditionExceptions.textContent = String(fixedExceptionRows.length);
    drawResearchBars(ui.researchFixedConditionChart, [
      { label: 'Adherent', value: fixedAdherentRows.length, color: themeToken('success') },
      { label: 'Exception', value: fixedExceptionRows.length, color: themeToken('danger') },
      { label: 'Not enabled', value: fixedConditionRows.filter(row => !row.enabled).length, color: themeToken('text-muted') }
    ], { labelWidth: 140 });
    if(fixedConditionRows.length){
      clearNode(ui.researchFixedConditionBody);
      fixedConditionRows.forEach(row => appendResearchRow(ui.researchFixedConditionBody, [
        row.date,
        row.protocol_condition_id,
        row.research_condition,
        row.adherence_status.replace(/-/g, ' '),
        row.lesson_replay_seed,
        row.settings_fingerprint
      ]));
    } else renderResearchEmptyRow(ui.researchFixedConditionBody, 6, 'No sessions in this scope yet.');
    ui.researchFixedConditionNote.textContent = scope === 'all-learners'
      ? 'Counts pool sessions across learners. Adherence means the software controls matched a locally saved manifest at session start; it does not verify allocation, blinding, protocol approval, or EEG hardware timing.'
      : 'Adherence means the software controls matched a locally saved manifest at session start. It does not verify allocation, blinding, protocol approval, or EEG hardware timing.';

    const qualityRows = sessions.map(session => {
      const markerSet = coreMarkerCompleteness(session);
      const diagnostics = session.eeg_marker_diagnostics || markerDiagnostics(session);
      const events = Array.isArray(session.events) ? session.events : [];
      const markers = Array.isArray(session.eeg_markers) ? session.eeg_markers : [];
      const blocks = Array.isArray(session.block_summaries) ? session.block_summaries : buildBlockSummaries(session.trials || [], events);
      const artifactEvents = events.filter(event => event.type === 'artifact_noted');
      const artifactCounts = artifactEvents.reduce((counts, event) => {
        const type = ARTIFACT_TYPES[event.artifact_type] ? event.artifact_type : 'unknown';
        counts[type] = (counts[type] || 0) + 1;
        return counts;
      }, {});
      const blockQualityValues = blocks.map(block => block.quality_score).filter(Number.isFinite);
      return {
        date: researchDateLabel(Number(session.updated_at_wall_ms)),
        condition: session.research_condition || 'not recorded',
        fidelity: session.fidelity && Number.isFinite(session.fidelity.score_pct) ? session.fidelity.score_pct : null,
        blocks: blocks.length,
        mean_block_quality_pct: blockQualityValues.length ? Math.round(mean(blockQualityValues)) : null,
        artifacts: artifactEvents.length,
        artifact_counts: artifactCounts,
        markers: markers.length,
        markerSet,
        marker_completeness_pct: markerSet.expected ? Math.round((markerSet.complete / markerSet.expected) * 100) : null,
        ordering_pct: Number.isFinite(diagnostics.ordering_pct) ? diagnostics.ordering_pct : null,
        protocol_completeness_pct: Number.isFinite(diagnostics.protocol_completeness_pct) ? diagnostics.protocol_completeness_pct : null,
        diagnostics
      };
    });
    const fidelityValues = qualityRows.map(item => item.fidelity).filter(Number.isFinite);
    const markerComplete = qualityRows.reduce((sum, item) => sum + item.markerSet.complete, 0);
    const markerExpected = qualityRows.reduce((sum, item) => sum + item.markerSet.expected, 0);
    const orderedTrials = qualityRows.reduce((sum, item) => sum + item.diagnostics.ordered_trials, 0);
    const expectedOrderTrials = qualityRows.reduce((sum, item) => sum + item.diagnostics.expected_order_trials, 0);
    const protocolComplete = qualityRows.reduce((sum, item) => sum + item.diagnostics.protocol_fields_complete, 0);
    const protocolExpected = qualityRows.reduce((sum, item) => sum + item.diagnostics.protocol_fields_expected, 0);
    const markerCompletenessPct = markerExpected ? Math.round((markerComplete / markerExpected) * 100) : null;
    const orderingPct = expectedOrderTrials ? Math.round((orderedTrials / expectedOrderTrials) * 100) : null;
    const protocolCompletenessPct = protocolExpected ? Math.round((protocolComplete / protocolExpected) * 100) : null;
    ui.researchFidelity.textContent = fidelityValues.length ? `${Math.round(mean(fidelityValues))}%` : '--';
    ui.researchArtifacts.textContent = String(qualityRows.reduce((sum, item) => sum + item.artifacts, 0));
    ui.researchMarkers.textContent = String(qualityRows.reduce((sum, item) => sum + item.markers, 0));
    ui.researchMarkerCompleteness.textContent = markerCompletenessPct == null ? '--' : `${markerCompletenessPct}%`;
    ui.researchMarkerOrdering.textContent = orderingPct == null ? '--' : `${orderingPct}%`;
    ui.researchProtocolCompleteness.textContent = protocolCompletenessPct == null ? '--' : `${protocolCompletenessPct}%`;
    drawResearchBars(ui.researchEegQualityChart, [
      { label: 'Core marker sets', value: markerCompletenessPct, color: themeToken('primary') },
      { label: 'Ordered trials', value: orderingPct, color: themeToken('success') },
      { label: 'Protocol fields', value: protocolCompletenessPct, color: themeToken('warning') }
    ].filter(item => Number.isFinite(item.value)), { maxValue: 100, suffix: '%', labelWidth: 150 });
    drawResearchMetricTrend(ui.researchEegQualityTrendChart, qualityRows, [
      { key: 'marker_completeness_pct', label: 'Markers', color: themeToken('primary') },
      { key: 'ordering_pct', label: 'Ordering', color: themeToken('success') },
      { key: 'protocol_completeness_pct', label: 'Protocol', color: themeToken('warning') }
    ], { maxValue: 100, suffix: '%', connectPoints: connectLongitudinalPoints });
    drawResearchMetricTrend(ui.researchBlockQualityTrendChart, qualityRows, [
      { key: 'mean_block_quality_pct', label: 'Block quality', color: themeToken('secondary', themeToken('primary')) }
    ], { maxValue: 100, suffix: '%', connectPoints: connectLongitudinalPoints });
    const artifactRows = Object.keys(ARTIFACT_TYPES).map(type => {
      const events = qualityRows.reduce((sum, item) => sum + (item.artifact_counts[type] || 0), 0);
      const affectedSessions = qualityRows.filter(item => (item.artifact_counts[type] || 0) > 0).length;
      return {
        type,
        label: ARTIFACT_TYPES[type].label,
        events,
        affected_sessions: affectedSessions,
        heuristic_weight: ARTIFACT_TYPES[type].penalty
      };
    }).filter(item => item.events);
    drawResearchBars(ui.researchArtifactTypeChart, artifactRows.map(item => ({
      label: item.label,
      value: item.events,
      color: themeToken('warning')
    })), { labelWidth: 125 });
    if(artifactRows.length){
      clearNode(ui.researchArtifactTypeBody);
      artifactRows.forEach(item => appendResearchRow(ui.researchArtifactTypeBody, [
        item.label, item.events, item.affected_sessions, item.heuristic_weight
      ]));
    } else renderResearchEmptyRow(ui.researchArtifactTypeBody, 4, 'No practitioner-logged artifacts in this scope.');
    if(qualityRows.length){
      clearNode(ui.researchQualityBody);
      qualityRows.forEach(item => appendResearchRow(ui.researchQualityBody, [
        item.date,
        item.condition,
        item.fidelity == null ? null : `${item.fidelity}%`,
        item.blocks,
        item.mean_block_quality_pct == null ? null : `${item.mean_block_quality_pct}%`,
        item.artifacts,
        item.markers,
        item.markerSet.expected ? `${item.markerSet.complete}/${item.markerSet.expected}` : null,
        item.diagnostics.expected_order_trials ? `${item.diagnostics.ordered_trials}/${item.diagnostics.expected_order_trials}` : null,
        item.diagnostics.response_timing_comparisons
          ? `${item.diagnostics.timing_difference_count}/${item.diagnostics.response_timing_comparisons}`
          : null,
        `${item.diagnostics.protocol_fields_complete}/${item.diagnostics.protocol_fields_expected}`,
        item.diagnostics.declared_sync_method
      ]));
    } else renderResearchEmptyRow(ui.researchQualityBody, 12);
    ui.researchEegQualityNote.textContent = scope === 'all-learners'
      ? 'Pooled session checks are shown as unconnected points. Marker checks use browser logs only; the block-quality score is a logging heuristic, not EEG signal quality, and no value verifies hardware synchronisation.'
      : 'Connected points follow sessions in date order. Marker checks use browser logs only; the block-quality score is a logging heuristic, not EEG signal quality, and no value verifies hardware synchronisation.';

    const transferRows = sessions.map(session => {
      const baseline = session.learner_snapshot && session.learner_snapshot.baseline ? session.learner_snapshot.baseline : {};
      const sessionTrials = latestTrialsByQuestion(session.trials || []);
      const context = sessionTrials.find(trial => trial.session_context && typeof trial.session_context === 'object');
      const sessionContext = context ? context.session_context : {};
      const attentionRating = Number.isFinite(baseline.teacherAttentionRating)
        ? baseline.teacherAttentionRating
        : (Number.isFinite(baseline.teacher_attention_rating) ? baseline.teacher_attention_rating : null);
      const independenceRating = Number.isFinite(baseline.teacherIndependenceRating)
        ? baseline.teacherIndependenceRating
        : (Number.isFinite(baseline.teacher_independence_rating) ? baseline.teacher_independence_rating : null);
      return {
        date: researchDateLabel(Number(session.updated_at_wall_ms)),
        learner: session.learner_alias || session.learner || 'Unknown',
        attention_rating: attentionRating,
        independence_rating: independenceRating,
        maintenance: baseline.maintenanceStatus || sessionContext.maintenance_status || 'not-recorded',
        generalisation: baseline.generalisationStatus || sessionContext.generalisation_status || 'not-recorded',
        transfer: session.classroom_transfer_notes || baseline.classroomTransferNotes || '',
        context: !!String(session.context_notes || baseline.contextNotes || '').trim()
      };
    });
    drawResearchMetricTrend(ui.researchTeacherRatingChart, transferRows, [
      { key: 'attention_rating', label: 'Attention', color: themeToken('primary') },
      { key: 'independence_rating', label: 'Independence', color: themeToken('success') }
    ], { maxValue: 5, connectPoints: connectLongitudinalPoints, emptyText: 'No teacher ratings observed in this scope' });
    const transferStatusCounts = new Map();
    transferRows.forEach(item => {
      [
        { family: 'Maintenance', value: item.maintenance },
        { family: 'Generalisation', value: item.generalisation }
      ].forEach(entry => {
        if(!entry.value || ['not-run', 'not-recorded'].includes(entry.value)) return;
        const label = `${entry.family}: ${String(entry.value).replace(/-/g, ' ')}`;
        transferStatusCounts.set(label, (transferStatusCounts.get(label) || 0) + 1);
      });
    });
    drawResearchBars(ui.researchTransferStatusChart, Array.from(transferStatusCounts.entries()).map(([label, value]) => ({
      label,
      value,
      color: label.startsWith('Maintenance') ? themeToken('primary') : themeToken('secondary', themeToken('success'))
    })), { labelWidth: 190 });
    if(transferRows.length){
      clearNode(ui.researchTransferBody);
      transferRows.forEach(item => appendResearchRow(ui.researchTransferBody, [
        item.date,
        item.learner,
        item.attention_rating == null ? null : `${item.attention_rating}/5`,
        item.independence_rating == null ? null : `${item.independence_rating}/5`,
        String(item.maintenance).replace(/-/g, ' '),
        String(item.generalisation).replace(/-/g, ' '),
        item.transfer || 'Not recorded',
        item.context ? 'Yes' : 'No'
      ]));
    } else renderResearchEmptyRow(ui.researchTransferBody, 8);
    ui.researchTransferNote.textContent = scope === 'all-learners'
      ? 'Teacher-rating points from different learners are not connected. Status bars count recorded observations only; not-run and missing statuses are excluded. These observations do not establish transfer or causation.'
      : 'Connected teacher-rating points follow sessions in date order. These practitioner observations should be analysed separately from task accuracy and EEG outcomes.';

    const contextRows = sessions.map((session, index) => {
      const sessionTrials = latestTrialsByQuestion(session.trials || []);
      const contextTrial = sessionTrials.find(trial => trial.session_context && typeof trial.session_context === 'object');
      const baselineTrial = sessionTrials.find(trial => trial.learner_baseline && typeof trial.learner_baseline === 'object');
      const context = contextTrial ? contextTrial.session_context : {};
      const trialBaseline = baselineTrial ? baselineTrial.learner_baseline : {};
      const profileBaseline = session.learner_snapshot && session.learner_snapshot.baseline ? session.learner_snapshot.baseline : {};
      const trend = sessionRows[index] || sessionTrendRow(session);
      const breaksValue = Number.isFinite(context.breaks_used)
        ? context.breaks_used
        : (Number.isFinite(profileBaseline.breakCount) ? profileBaseline.breakCount : null);
      return {
        date: trend.date,
        learner: trend.learner,
        readiness: context.fatigue_level || profileBaseline.fatigueLevel || 'not-recorded',
        sensory_state: context.sensory_state || profileBaseline.sensoryState || 'not-recorded',
        sleep: trialBaseline.sleep_quality || profileBaseline.sleepQuality || profileBaseline.sleep_quality || 'not-recorded',
        breaks: breaksValue,
        pre_session_choice: context.pre_session_preference || profileBaseline.preSessionPreference || 'not-recorded',
        accuracy_pct: trend.accuracy_pct,
        independent_pct: trend.independent_pct
      };
    });
    const contextCountRows = key => Array.from(contextRows.reduce((counts, item) => {
      const value = item[key] || 'not-recorded';
      counts.set(value, (counts.get(value) || 0) + 1);
      return counts;
    }, new Map()).entries()).map(([value, count]) => ({
      label: String(value).replace(/-/g, ' '),
      value: count,
      color: themeToken('secondary', themeToken('primary'))
    }));
    drawResearchBars(ui.researchReadinessChart, contextCountRows('readiness'), { labelWidth: 125 });
    drawResearchBars(ui.researchSensoryStateChart, contextCountRows('sensory_state'), { labelWidth: 125 });
    if(contextRows.length){
      clearNode(ui.researchContextBody);
      contextRows.forEach(item => appendResearchRow(ui.researchContextBody, [
        item.date,
        item.learner,
        String(item.readiness).replace(/-/g, ' '),
        String(item.sensory_state).replace(/-/g, ' '),
        String(item.sleep).replace(/-/g, ' '),
        item.breaks,
        String(item.pre_session_choice).replace(/-/g, ' '),
        item.accuracy_pct == null ? null : `${item.accuracy_pct}%`,
        item.independent_pct == null ? null : `${item.independent_pct}%`
      ]));
    } else renderResearchEmptyRow(ui.researchContextBody, 9);

    const accessContextRows = sessions.map(session => {
      const sessionTrials = latestTrialsByQuestion(session.trials || []);
      const baselineTrial = sessionTrials.find(trial => trial.learner_baseline && typeof trial.learner_baseline === 'object');
      const contextTrial = sessionTrials.find(trial => trial.session_context && typeof trial.session_context === 'object');
      const trialBaseline = baselineTrial ? baselineTrial.learner_baseline : {};
      const context = contextTrial ? contextTrial.session_context : {};
      const profileBaseline = session.learner_snapshot && session.learner_snapshot.baseline
        ? session.learner_snapshot.baseline
        : {};
      const settings = session.settings || {};
      const sensory = session.sensory_preferences || context.sensory_preferences || {};
      const themeId = session.theme_used || context.theme_choice || settings.themeChoice || '';
      return {
        date: researchDateLabel(Number(session.updated_at_wall_ms)),
        learner: session.learner_alias || session.learner || 'Unknown',
        communication: trialBaseline.communication_mode || profileBaseline.communicationMode || profileBaseline.communication_mode || 'not recorded',
        motor_access: trialBaseline.motor_access_mode || profileBaseline.motorAccessMode || profileBaseline.motor_access_mode || 'not recorded',
        aac: trialBaseline.aac_preference || profileBaseline.aacPreference || profileBaseline.aac_preference || settings.aacPreference || 'not recorded',
        prompt_presentation: context.communication_support_choice || settings.communicationSupportChoice || 'not recorded',
        theme: THEME_META[themeId] ? THEME_META[themeId].label : (themeId || 'not recorded'),
        font: sensory.font || settings.fontChoice || 'not recorded',
        text_scale: Number.isFinite(Number(sensory.text_scale != null ? sensory.text_scale : settings.textScale))
          ? Number(sensory.text_scale != null ? sensory.text_scale : settings.textScale)
          : null,
        motion: sensory.motion || settings.motionPreference || 'not recorded',
        sound: sensory.feedback_sound || settings.feedbackSoundMode || 'not recorded',
        speech: typeof settings.ttsToggle === 'boolean' ? settings.ttsToggle : null,
        learner_view: typeof session.student_friendly_mode === 'boolean'
          ? session.student_friendly_mode
          : (typeof settings.studentFriendlyMode === 'boolean' ? settings.studentFriendlyMode : null),
        max_options: Number.isFinite(Number(settings.maxObjects)) ? Number(settings.maxObjects) : null,
        response_window_sec: Number.isFinite(Number(settings.responseWindowSec)) ? Number(settings.responseWindowSec) : null
      };
    });
    const settingLabel = value => {
      if(value == null) return 'Not recorded';
      if(typeof value === 'boolean') return value ? 'On' : 'Off';
      return String(value).replace(/-/g, ' ');
    };
    const countAccessSettings = definitions => {
      const counts = new Map();
      accessContextRows.forEach(row => definitions.forEach(definition => {
        const value = settingLabel(row[definition.key]);
        const label = `${definition.label}: ${value}`;
        counts.set(label, (counts.get(label) || 0) + 1);
      }));
      return Array.from(counts.entries())
        .map(([label, value]) => ({ label, value }))
        .sort((a, b) => b.value - a.value || a.label.localeCompare(b.label));
    };
    const accessSettingCounts = countAccessSettings([
      { key: 'communication', label: 'Communication' },
      { key: 'motor_access', label: 'Motor' },
      { key: 'aac', label: 'AAC' }
    ]);
    const presentationSettingCounts = countAccessSettings([
      { key: 'prompt_presentation', label: 'Prompt' },
      { key: 'theme', label: 'Theme' },
      { key: 'font', label: 'Font' },
      { key: 'motion', label: 'Motion' },
      { key: 'sound', label: 'Sound' },
      { key: 'speech', label: 'Speech' }
    ]);
    drawResearchBars(ui.researchAccessContextChart, accessSettingCounts.slice(0, 12).map(item => ({
      ...item,
      color: themeToken('secondary', themeToken('primary'))
    })), { labelWidth: 205 });
    drawResearchBars(ui.researchPresentationContextChart, presentationSettingCounts.slice(0, 12).map(item => ({
      ...item,
      color: themeToken('primary')
    })), { labelWidth: 205 });
    if(accessContextRows.length){
      clearNode(ui.researchAccessContextBody);
      accessContextRows.forEach(item => appendResearchRow(ui.researchAccessContextBody, [
        item.date,
        item.learner,
        settingLabel(item.communication),
        settingLabel(item.motor_access),
        settingLabel(item.aac),
        settingLabel(item.prompt_presentation),
        item.theme,
        settingLabel(item.font),
        item.text_scale == null ? null : `${Math.round(item.text_scale * 100)}%`,
        settingLabel(item.motion),
        settingLabel(item.sound),
        settingLabel(item.speech),
        item.learner_view == null ? null : (item.learner_view ? 'Student friendly' : 'Technical labels visible'),
        item.max_options,
        item.response_window_sec == null ? null : `${item.response_window_sec}s`
      ]));
    } else renderResearchEmptyRow(ui.researchAccessContextBody, 15, 'No sessions in this scope yet.');
    ui.researchAccessContextNote.textContent = scope === 'all-learners'
      ? 'Counts pool settings across learners and are not learner traits. Access and presentation choices are delivery context, not measures of ability or treatment effects.'
      : 'Settings are shown by session so changes in access or presentation can be reviewed alongside outcomes. They do not explain a performance change by themselves.';
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
    if(state.panelView === 'admin' && state.adminPage === 'research') renderResearchWorkspace();
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

  function endSession(reason='planned-questions-complete'){
    clearTimeout(state.timers.session);
    clearTimeout(state.timers.response);
    clearTimeout(state.timers.preview);
    clearTimeout(state.timers.blank);
    state.phase = 'complete';
    state.sessionEndMs = wallMs();
    state.sessionEndReason = reason;
    const summary = analyticsSummary();
    const advanced = shouldAdvanceLevel(summary);
    if(advanced){
      state.currentLevel = Math.min(10, state.currentLevel + 1);
      ui.startLevel.value = state.currentLevel;
    }
    savePupilProgress(summary, advanced);
    saveCurrentLearnerProfile();
    if(ui.summaryRestart) ui.summaryRestart.textContent = summaryRestartLabel(advanced);
    ui.summaryText.textContent = studentFriendlyModeEnabled()
      ? (advanced ? `Great work. You are ready for Level ${state.currentLevel}.` : 'Great work. This session is complete.')
      : `${summary.correct} correct, ${summary.incorrect} incorrect, ${summary.accuracy_pct}% accuracy, ${summary.omission_count} omissions, ${summary.commission_count} commissions, mean RT ${summary.mean_rt_ms || 0} ms, RT variability ${summary.rt_sd_ms || 0} ms. ${describeLevelOutcome(summary, advanced, false)} Fidelity ${fidelityScorePct()}%. ${state.sessionEndedEarly ? 'The session was stopped early.' : ''}`;
    showScreen('screenSummary');
    setFooter(advanced ? `Session complete. Ready for Level ${state.currentLevel}.` : 'Session complete. Export or start again.', advanced ? 'Next level' : 'Complete');
    logEvent('session_complete', {
      summary,
      next_level: state.currentLevel,
      progressed_level: advanced,
      session_timing: currentSessionTimingSnapshot()
    });
    pushEegMarker('session_complete', {
      response_type: state.sessionEndedEarly ? 'stopped-early' : reason === 'session-time-limit' ? 'time-limit' : 'completed',
      correct: summary.correct,
      omission: summary.omission_count,
      commission: summary.commission_count
    });
    persistCurrentSession().catch(() => {});
    playSoundCue('complete', {
      response_type: state.sessionEndedEarly ? 'stopped-early' : reason === 'session-time-limit' ? 'time-limit' : 'completed',
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
    state.sessionSnapshot = null;
    state.lessonPlanId = null;
    state.lessonPlan = null;
    state.lessonSeed = null;
    state.lessonSeedSource = null;
    state.sessionStartMs = 0;
    state.sessionEndMs = 0;
    state.sessionEndReason = '';
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
    const fixedConditionValidation = updateFixedConditionStatus(validateFixedCondition());
    if(!fixedConditionValidation.valid){
      if(ui.sessionSetupStatus){
        ui.sessionSetupStatus.hidden = false;
        ui.sessionSetupStatus.classList.add('invalid');
        ui.sessionSetupStatus.textContent = 'The fixed research condition is not ready. Review the condition ID, replay seed, and saved settings in Admin and research.';
      }
      openAdminPanel();
      applyAdminPage('eeg', { scroll: true, behavior: 'auto' });
      flash('try', 'Fixed condition needs attention');
      return;
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
    state.sessionSnapshot = null;
    state.lessonPlanId = null;
    state.lessonPlan = null;
    state.lessonSeed = null;
    state.lessonSeedSource = null;
    state.logs = [];
    state.trials = [];
    state.sessionTarget = null;
    state.sessionContentConfig = contentValidation.snapshot;
    state.questionLayouts = {};
    state.questionIndex = 1;
    state.attemptIndex = 0;
    state.phase = 'running';
    state.sessionStartMs = wallMs();
    state.sessionEndMs = 0;
    state.sessionEndReason = '';
    state.totalQuestions = clamp(safeNumber(ui.sessionMax.value, 8), 1, 20);
    state.currentLevel = clamp(safeNumber(ui.startLevel.value, 1), 1, 10);
    state.sessionTaskType = ui.sessionTaskType.value === 'auto' ? 'auto' : ui.sessionTaskType.value;
    state.singleTargetRepetitions = clamp(safeNumber(ui.singleTargetReps.value, 3), 1, 10);
    saveCurrentLearnerProfile();
    state.sessionSnapshot = {
      learner: currentPupilName(),
      learner_alias: currentPupilAlias(),
      learner_profile: clonePlain(currentLearnerRecord()),
      settings: clonePlain(settingsSnapshot()),
      context_notes: currentContextNotes(),
      classroom_transfer_notes: ui.classroomTransferNotes.value || '',
      theme_used: currentThemeChoice(),
      sensory_preferences: clonePlain(sensoryPreferenceSnapshot()),
      student_friendly_mode: studentFriendlyModeEnabled(),
      photo_library_metadata: clonePlain(photoLibraryMetadata()),
      data_governance: clonePlain(dataGovernanceSnapshot()),
      study_protocol: clonePlain(studyProtocolSnapshot(currentResearchParticipantId()))
    };
    initializeLessonPlan();
    state.sessionEndedEarly = false;
    state.blockPause = null;
    state.eeg.markers = [];
    clearBreakCountdown();
    if(ui.sid) ui.sid.textContent = state.sessionId.slice(0, 8);
    createProgressTrack();
    logEvent('session_start', {
      total_questions: state.totalQuestions,
      task_type: state.sessionTaskType,
      current_level: state.currentLevel,
      schema_version: DATA_SCHEMA_VERSION,
      skill_graph_version: SKILL_GRAPH_VERSION,
      generator_version: GENERATOR_VERSION,
      lesson_plan_id: currentLessonPlanId(),
      lesson_seed: state.lessonSeed,
      lesson_seed_source: state.lessonSeedSource,
      response_window_ms: responseWindowMs(),
      inter_trial_interval_ms: interTrialDelayMs(),
      blank_interval_enabled: blankIntervalEnabled(),
      blank_interval_ms: blankIntervalEnabled() ? blankIntervalMs() : 0,
      learner_context: learnerContextSnapshot(),
      learner_baseline: learnerBaselineSnapshot(),
      fidelity: fidelitySnapshot(),
      data_governance: clonePlain(state.sessionSnapshot.data_governance),
      research_condition: state.sessionSnapshot.study_protocol.research_condition,
      protocol_condition_id: state.sessionSnapshot.study_protocol.protocol_condition_id,
      fixed_condition: clonePlain(state.sessionSnapshot.study_protocol.fixed_condition),
      eeg_mode: eegModeEnabled(),
      study_protocol: clonePlain(state.sessionSnapshot.study_protocol),
      content_configuration: exportableContentConfiguration()
    });
    pushEegMarker('session_start', {
      research_condition: state.sessionSnapshot.study_protocol.research_condition,
      task_kind: state.sessionTaskType,
      attention_domain: selectedSessionTaskMode()
    });
    state.timers.session = window.setTimeout(() => {
      flash('try', 'Session time reached');
      endSession('session-time-limit');
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
    const snapshot = state.sessionSnapshot;
    const protocol = snapshot && snapshot.study_protocol
      ? clonePlain(snapshot.study_protocol)
      : studyProtocolSnapshot(currentResearchParticipantId());
    const payload = {
      app: APP_BUILD.app,
      build: buildExportMeta(),
      schema_version: DATA_SCHEMA_VERSION,
      skill_graph_version: SKILL_GRAPH_VERSION,
      generator_version: GENERATOR_VERSION,
      research_summary_version: RESEARCH_SUMMARY_VERSION,
      practice_status_version: PRACTICE_STATUS_VERSION,
      recommendation_version: RECOMMENDATION_VERSION,
      lesson_plan_id: currentLessonPlanId(),
      lesson_seed: state.lessonSeed,
      lesson_plan: lessonPlanSnapshot(),
      skill_graph: skillGraphSnapshot(),
      exported_at_wall_ms: wallMs(),
      session_id: state.sessionId,
      pupil: sessionPupilName(),
      pupil_alias: sessionPupilAlias(),
      session_timing: currentSessionTimingSnapshot(),
      session_overview: {
        pupil_alias: sessionPupilAlias(),
        exported_date: schoolTimestampParts().date,
        exported_time: schoolTimestampParts().time,
        level: state.currentLevel,
        task_type: selectedSessionTaskMode(),
        accuracy_pct: summary.accuracy_pct,
        mean_reaction_time_ms: summary.mean_rt_ms || null,
        mean_touch_distance_px: summary.mean_touch_distance_px == null ? null : Number(summary.mean_touch_distance_px.toFixed(1)),
        context_notes: snapshot ? snapshot.context_notes : currentContextNotes(),
        theme_used: snapshot ? snapshot.theme_used : currentThemeChoice(),
        sensory_preferences: snapshot ? clonePlain(snapshot.sensory_preferences) : sensoryPreferenceSnapshot(),
        student_friendly_mode: snapshot ? snapshot.student_friendly_mode : studentFriendlyModeEnabled(),
        blank_interval_enabled: blankIntervalEnabled(),
        blank_interval_ms: blankIntervalEnabled() ? blankIntervalMs() : 0,
        support_level: state.promptState.highestLevel,
        build_version: APP_BUILD.version,
        skill_graph_version: SKILL_GRAPH_VERSION,
        generator_version: GENERATOR_VERSION,
        lesson_plan_id: currentLessonPlanId(),
        lesson_seed: state.lessonSeed
      },
      learner_profile: snapshot ? clonePlain(snapshot.learner_profile) : currentLearnerRecord(),
      summary,
      fidelity: fidelitySnapshot(),
      research_condition: protocol.research_condition,
      protocol_condition_id: protocol.protocol_condition_id || null,
      fixed_condition: protocol.fixed_condition ? clonePlain(protocol.fixed_condition) : null,
      eeg_mode: eegModeEnabled(),
      study_protocol: protocol,
      context_notes: snapshot ? snapshot.context_notes : currentContextNotes(),
      theme_used: snapshot ? snapshot.theme_used : currentThemeChoice(),
      sensory_preferences: snapshot ? clonePlain(snapshot.sensory_preferences) : sensoryPreferenceSnapshot(),
      student_friendly_mode: snapshot ? snapshot.student_friendly_mode : studentFriendlyModeEnabled(),
      data_governance: snapshot && snapshot.data_governance
        ? clonePlain(snapshot.data_governance)
        : dataGovernanceSnapshot(),
      content_configuration: exportableContentConfiguration(),
      blank_interval_enabled: blankIntervalEnabled(),
      blank_interval_ms: blankIntervalEnabled() ? blankIntervalMs() : 0,
      photo_library_metadata: snapshot ? clonePlain(snapshot.photo_library_metadata) : photoLibraryMetadata(),
      local_recommendation_summary: buildLocalRecommendationSummary(summary),
      research_summary: researchSummaryForTrials(state.trials),
      eeg_marker_code_map: EEG_EVENT_CODES,
      eeg_markers: state.eeg.markers.slice(),
      eeg_marker_diagnostics: markerDiagnostics({
        trials: state.trials,
        eeg_markers: state.eeg.markers,
        study_protocol: protocol
      }),
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
      learner: sessionPupilName(),
      learner_alias: sessionPupilAlias(),
      lesson_plan: lessonPlanSnapshot(),
      research_condition: state.sessionSnapshot && state.sessionSnapshot.study_protocol
        ? state.sessionSnapshot.study_protocol.research_condition
        : researchCondition(),
      protocol_condition_id: state.sessionSnapshot && state.sessionSnapshot.study_protocol
        ? state.sessionSnapshot.study_protocol.protocol_condition_id
        : null,
      fixed_condition: state.sessionSnapshot && state.sessionSnapshot.study_protocol
        ? clonePlain(state.sessionSnapshot.study_protocol.fixed_condition)
        : fixedConditionProtocolSnapshot(),
      eeg_mode: eegModeEnabled(),
      study_protocol: state.sessionSnapshot && state.sessionSnapshot.study_protocol
        ? clonePlain(state.sessionSnapshot.study_protocol)
        : studyProtocolSnapshot(currentResearchParticipantId()),
      sensory_preferences: state.sessionSnapshot ? clonePlain(state.sessionSnapshot.sensory_preferences) : sensoryPreferenceSnapshot(),
      data_governance: state.sessionSnapshot && state.sessionSnapshot.data_governance
        ? clonePlain(state.sessionSnapshot.data_governance)
        : dataGovernanceSnapshot(),
      fidelity: fidelitySnapshot(),
      eeg_marker_code_map: EEG_EVENT_CODES,
      markers,
      marker_diagnostics: markerDiagnostics({
        trials: state.trials,
        eeg_markers: markers,
        study_protocol: state.sessionSnapshot && state.sessionSnapshot.study_protocol
          ? state.sessionSnapshot.study_protocol
          : studyProtocolSnapshot(currentResearchParticipantId())
      }),
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

  function buildResearchWorkspaceSummary(sessions){
    const scope = ui.researchScopeSelect ? ui.researchScopeSelect.value : 'current-learner';
    const allTrials = sessions.flatMap(session => Array.isArray(session.trials) ? session.trials : []);
    const finalTrials = latestTrialsByQuestion(allTrials);
    const summary = researchSummaryForTrials(allTrials);
    const taskGroups = new Map();
    const categoryGroups = new Map();
    const supportGroups = new Map();

    finalTrials.forEach(trial => {
      const taskKey = [trial.research_condition || 'not-recorded', trial.task_kind || 'unknown', trial.task_variant || 'default'].join('|');
      if(!taskGroups.has(taskKey)) taskGroups.set(taskKey, { condition: trial.research_condition || 'not-recorded', task_kind: trial.task_kind || 'unknown', task_variant: trial.task_variant || 'default', opportunities: 0, scored: 0, correct: 0, omissions: 0, commissions: 0 });
      const task = taskGroups.get(taskKey);
      task.opportunities += 1;
      if(trial.scored_response !== false){
        task.scored += 1;
        if(trial.correct) task.correct += 1;
      }
      if(trial.omission) task.omissions += 1;
      if(trial.commission) task.commissions += 1;

      const category = trial.target_category_label || trial.target_category || 'Not recorded';
      if(!categoryGroups.has(category)) categoryGroups.set(category, { category, opportunities: 0, scored: 0, correct: 0, personalised: 0 });
      const categoryItem = categoryGroups.get(category);
      categoryItem.opportunities += 1;
      if(trial.scored_response !== false){
        categoryItem.scored += 1;
        if(trial.correct) categoryItem.correct += 1;
      }
      if(trial.target_source === 'personalised') categoryItem.personalised += 1;

      const support = ['independent', 'prompted', 'assisted'].includes(trial.independence_status) ? trial.independence_status : 'unknown';
      if(!supportGroups.has(support)) supportGroups.set(support, { status: support, responses: 0, correct: 0 });
      supportGroups.get(support).responses += 1;
      if(trial.correct) supportGroups.get(support).correct += 1;
    });

    const sessionPerformance = sessions.map(session => {
      const { session: _session, ...row } = sessionTrendRow(session);
      return row;
    });
    const attentionFamilies = attentionFamilyResearchRows(sessions, scope === 'current-learner').map(item => ({
      domain: item.domain,
      label: item.label,
      sessions: item.sessions,
      opportunities: item.opportunities,
      accuracy_pct: item.accuracy_pct,
      independent_success_pct: item.independent_success_pct,
      omissions: item.omissions,
      commissions: item.commissions,
      median_rt_ms: item.median_rt_ms,
      rt_variability_ms: item.rt_variability_ms,
      mean_touch_distance_px: item.mean_touch_distance_px,
      descriptive_slope_pp_per_session: item.descriptive_slope_pp_per_session,
      observations: item.observations
    }));
    const practiceStates = skillPracticeStatesForSessions(sessions).map(item => ({
      skill_id: item.skill_id,
      label: item.label,
      practice_status: item.practice_status,
      sessions_observed: item.sessions_observed,
      scored_opportunities: item.scored_opportunities,
      recent_accuracy_pct: item.recent_accuracy_pct,
      recent_independent_success_pct: item.recent_independent_success_pct,
      recent_omissions: item.recent_omissions,
      recent_commissions: item.recent_commissions,
      days_since_last_practice: item.days_since_last_practice,
      trend_status: item.trend_status,
      retention_status: item.retention_status,
      retention_gap_days: item.retention_gap_days,
      retention_difference_pct: item.retention_difference_pct,
      support_direction: item.support_direction
    }));
    const context = sessions.map(session => {
      const trials = latestTrialsByQuestion(session.trials || []);
      const trial = trials.find(item => item.session_context || item.learner_baseline) || {};
      const baseline = (session.learner_snapshot && session.learner_snapshot.baseline) || trial.learner_baseline || {};
      const sessionContext = trial.session_context || {};
      return {
        date: researchDateLabel(Number(session.updated_at_wall_ms)),
        learner: session.learner_alias || session.learner || 'Unknown',
        fatigue_level: sessionContext.fatigue_level || baseline.fatigueLevel || null,
        sensory_state: sessionContext.sensory_state || baseline.sensoryState || null,
        sleep_quality: baseline.sleepQuality || baseline.sleep_quality || null,
        breaks_used: Number.isFinite(sessionContext.breaks_used) ? sessionContext.breaks_used : baseline.breakCount,
        maintenance_status: sessionContext.maintenance_status || baseline.maintenanceStatus || null,
        generalisation_status: sessionContext.generalisation_status || baseline.generalisationStatus || null,
        teacher_attention_rating: baseline.teacherAttentionRating || baseline.teacher_attention_rating || null,
        teacher_independence_rating: baseline.teacherIndependenceRating || baseline.teacher_independence_rating || null,
        dosage_minutes_actual: session.fidelity && Number.isFinite(session.fidelity.dosage_minutes_actual) ? session.fidelity.dosage_minutes_actual : null,
        dosage_minutes_target: session.fidelity && Number.isFinite(session.fidelity.dosage_minutes_target) ? session.fidelity.dosage_minutes_target : null,
        fidelity_score_pct: session.fidelity && Number.isFinite(session.fidelity.score_pct) ? session.fidelity.score_pct : null
      };
    });
    const eegReadiness = sessions.map(session => ({
      date: researchDateLabel(Number(session.updated_at_wall_ms)),
      learner: session.learner_alias || session.learner || 'Unknown',
      eeg_expected: !!((session.settings && session.settings.eegResearchMode) || latestTrialsByQuestion(session.trials || []).some(trial => trial.eeg_research_mode)),
      marker_count: Array.isArray(session.eeg_markers) ? session.eeg_markers.length : 0,
      artifact_count: Array.isArray(session.events) ? session.events.filter(event => event.type === 'artifact_noted').length : 0,
      core_marker_sets: coreMarkerCompleteness(session),
      diagnostics: markerDiagnostics(session)
    }));
    const teacherDecisions = researchReviewsForSessions(sessions).map(review => ({
      date: researchDateLabel(Number(review.reviewed_at_wall_ms)),
      learner_alias: review.learner_alias || 'Unknown',
      recommendation_id: review.recommendation_id,
      decision: review.decision,
      proposed_action: review.proposal && review.proposal.action,
      skill_id: review.proposal && review.proposal.skill_id,
      final_task_kind: review.final_plan && review.final_plan.task_kind,
      final_level: review.final_plan && review.final_plan.level
    }));

    return {
      app: APP_BUILD.app,
      build: buildExportMeta(),
      export_schema_version: RESEARCH_WORKSPACE_EXPORT_VERSION,
      exported_at_wall_ms: wallMs(),
      scope,
      archived_sessions_included: !!(ui.researchIncludeArchived && ui.researchIncludeArchived.checked),
      learner_aliases_included: true,
      session_count: sessions.length,
      final_trial_count: finalTrials.length,
      privacy_manifest: {
        local_download_only: true,
        external_transmission: false,
        raw_trials_included: false,
        raw_events_included: false,
        raw_touch_coordinates_included: false,
        image_data_included: false,
        photo_labels_included: false,
        free_text_notes_included: false,
        day_level_session_dates_included: true
      },
      data_quality: summary.data_quality,
      coverage_by_session: sessions.map(researchCoverageForSession),
      session_performance: sessionPerformance,
      session_timing: sessions.map(sessionTimingResearchRow),
      session_demands: sessions.map(sessionDemandResearchRow),
      fixed_conditions: sessions.map(fixedConditionResearchRow),
      skill_summaries: summary.skill_summaries.map(item => ({
        skill_id: item.skill_id,
        label: item.label,
        opportunities: item.opportunities,
        scored_opportunities: item.scored_opportunities,
        response_count: item.response_count,
        correct: item.correct,
        incorrect: item.incorrect,
        accuracy_pct: item.accuracy_pct,
        omissions: item.omissions,
        commissions: item.commissions,
        correct_rejections: item.correct_rejections,
        independent_responses: item.independent_responses,
        assisted_responses: item.assisted_responses,
        independent_correct: item.independent_correct,
        assisted_correct: item.assisted_correct,
        highest_prompt_level: item.highest_prompt_level,
        median_reaction_time_ms: item.median_reaction_time_ms,
        reaction_time_variability_ms: item.reaction_time_variability_ms,
        mean_touch_distance_px: item.mean_touch_distance_px
      })),
      practice_states: practiceStates,
      attention_families: attentionFamilies,
      support_summary: Array.from(supportGroups.values()),
      task_exposure: Array.from(taskGroups.values()).map(item => ({ ...item, accuracy_pct: item.scored ? Math.round((item.correct / item.scored) * 100) : null })),
      category_exposure: Array.from(categoryGroups.values()).map(item => ({ ...item, accuracy_pct: item.scored ? Math.round((item.correct / item.scored) * 100) : null })),
      category_matching: categoryMatchResearchRows(finalTrials),
      category_exclusion: categoryExclusionResearchRows(finalTrials),
      session_context: context,
      eeg_readiness: eegReadiness,
      teacher_decisions: teacherDecisions,
      interpretation_boundary: 'Descriptive teaching and research-support summary only. It is not diagnostic, does not establish causation or transfer, and does not demonstrate neural change or validated EEG synchronisation.'
    };
  }

  async function exportResearchWorkspaceSummary(){
    await persistCurrentSession();
    await refreshStoredHistory();
    const sessions = researchSessionsInScope();
    if(!sessions.length){
      flash('try', 'No research sessions in this scope');
      return;
    }
    const payload = buildResearchWorkspaceSummary(sessions);
    const stamp = schoolTimestampParts();
    const scopePart = payload.scope === 'all-learners'
      ? 'AllLearners'
      : payload.scope === 'current-session'
        ? 'CurrentSession'
        : safeFilenamePart(currentPupilAlias());
    const filename = `ChoiceTrain_Research_${scopePart}_${stamp.date}_${stamp.time}_summary.json`;
    triggerBlobDownload(new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' }), filename);
    if(state.trials.length){
      logEvent('research_scope_summary_exported', {
        export_schema_version: RESEARCH_WORKSPACE_EXPORT_VERSION,
        scope: payload.scope,
        session_count: payload.session_count,
        external_transmission: false
      });
    }
  }

  function participantCodeForSession(session, fallbackCodes){
    const snapshotCode = session && session.learner_snapshot && session.learner_snapshot.researchParticipantId;
    const storedLearner = session && session.learner ? state.learners[session.learner] : null;
    const storedCode = storedLearner && storedLearner.researchParticipantId;
    if(snapshotCode || storedCode) return String(snapshotCode || storedCode);
    const sourceKey = String(session && (session.learner || session.learner_alias || session.session_id) || 'unknown');
    if(!fallbackCodes.has(sourceKey)){
      fallbackCodes.set(sourceKey, `ctp-export-${String(fallbackCodes.size + 1).padStart(3, '0')}`);
    }
    return fallbackCodes.get(sourceKey);
  }

  function privacySafeSkillSummaries(trials){
    const summary = researchSummaryForTrials(trials || []);
    return summary.skill_summaries.map(skill => ({
      skill_id: skill.skill_id,
      opportunities: skill.opportunities,
      scored_opportunities: skill.scored_opportunities,
      correct: skill.correct,
      incorrect: skill.incorrect,
      accuracy_pct: skill.accuracy_pct,
      omissions: skill.omissions,
      commissions: skill.commissions,
      correct_rejections: skill.correct_rejections,
      independent_responses: skill.independent_responses,
      assisted_responses: skill.assisted_responses,
      independent_correct: skill.independent_correct,
      assisted_correct: skill.assisted_correct,
      support_code_counts: clonePlain(skill.support_code_counts),
      highest_prompt_level: skill.highest_prompt_level,
      median_reaction_time_ms: skill.median_reaction_time_ms,
      reaction_time_variability_ms: skill.reaction_time_variability_ms,
      mean_touch_distance_px: skill.mean_touch_distance_px
    }));
  }

  function privacySafeTrial(trial, trialIndex){
    const categoryId = trial.target_category && PHOTO_CATEGORY_META[trial.target_category]
      ? trial.target_category
      : (trial.target_category ? 'custom' : null);
    const cueCategoryId = trial.cue_category && PHOTO_CATEGORY_META[trial.cue_category]
      ? trial.cue_category
      : (trial.cue_category ? 'custom' : null);
    const referenceCategoryId = trial.reference_category && PHOTO_CATEGORY_META[trial.reference_category]
      ? trial.reference_category
      : (trial.reference_category ? 'custom' : null);
    const personalisedContent = !!(
      (Array.isArray(trial.photo_labels_used) && trial.photo_labels_used.length)
      || ['upload', 'uploaded', 'pupil-photo', 'personalised'].includes(trial.target_source)
      || ['upload', 'uploaded', 'pupil-photo', 'personalised'].includes(trial.cue_source)
    );
    return {
      trial_index: trialIndex + 1,
      question_index: trial.question_index,
      attempt_index: trial.attempt_index,
      repeat_count: trial.repeat_count,
      level: trial.level,
      block_index: trial.block_index,
      trial_in_block: trial.trial_in_block,
      task_family: trial.task_family,
      task_kind: trial.task_kind,
      task_variant: trial.task_variant || null,
      attention_domain: trial.attention_domain || null,
      skill_ids: Array.isArray(trial.skill_ids) ? trial.skill_ids.slice() : skillIdsForTask(trial.task_kind),
      schema_version: trial.schema_version || DATA_SCHEMA_VERSION,
      generator_version: trial.generator_version || null,
      generator_mode: trial.generator_mode || null,
      coverage_strategy: trial.generator_constraints && trial.generator_constraints.coverage_strategy || null,
      procedural_variant: trial.procedural_variant || null,
      discrimination_contrast: trial.discrimination_contrast || null,
      open_ended_choice: !!trial.open_ended_choice,
      scored_response: trial.scored_response !== false,
      research_condition: trial.research_condition || null,
      category_id: categoryId,
      cue_category_id: cueCategoryId,
      reference_category_id: referenceCategoryId,
      category_relation: trial.category_relation || null,
      cue_target_distinct: trial.cue_id ? trial.cue_id !== trial.target_id : null,
      personalised_content: personalisedContent,
      option_count: Array.isArray(trial.option_metadata)
        ? trial.option_metadata.length
        : (Array.isArray(trial.option_labels) ? trial.option_labels.length : null),
      distractor_count: Number.isFinite(trial.distractor_count) ? trial.distractor_count : null,
      response_type: trial.response_type || null,
      correct: !!trial.correct,
      omission: !!trial.omission,
      commission: !!trial.commission,
      correct_rejection: !!trial.correct_rejection,
      timed_out: !!trial.timed_out,
      response_time_ms: Number.isFinite(trial.response_time_ms) ? trial.response_time_ms : null,
      distance_to_target_px: Number.isFinite(trial.distance_to_target_px) ? trial.distance_to_target_px : null,
      selected_to_target_distance_px: Number.isFinite(trial.selected_to_target_distance_px)
        ? trial.selected_to_target_distance_px
        : null,
      highest_prompt_level: Number.isFinite(trial.highest_prompt_level) ? trial.highest_prompt_level : null,
      support_code: trial.support_code || null,
      independence_status: trial.independence_status || null,
      student_friendly_mode: trial.student_friendly_mode !== false
    };
  }

  function privacySafeMarkers(markers){
    return (markers || []).map((marker, index) => ({
      marker_index: index + 1,
      code: marker.code,
      name: marker.name,
      t_rel_ms: Number.isFinite(marker.t_rel_ms) ? marker.t_rel_ms : null,
      level: marker.level,
      question_index: marker.question_index,
      block_index: marker.block_index,
      research_condition: marker.research_condition || null,
      task_kind: marker.task_kind || null,
      task_variant: marker.task_variant || null,
      attention_domain: marker.attention_domain || null,
      response_type: marker.response_type || null,
      correct: typeof marker.correct === 'boolean' ? marker.correct : null,
      omission: typeof marker.omission === 'boolean' ? marker.omission : null,
      commission: typeof marker.commission === 'boolean' ? marker.commission : null,
      artifact_type: marker.artifact_type || null,
      break_reason: marker.break_reason || null
    }));
  }

  function privacySafeReviews(participantByLearner){
    const rows = [];
    Object.keys(state.learners).forEach(name => {
      const participantCode = participantByLearner.get(name);
      if(!participantCode) return;
      const learner = normalizeLearner(name, state.learners[name]);
      learner.reviews.forEach((review, index) => {
        rows.push({
          participant_code: participantCode,
          decision_index: index + 1,
          recommendation_version: review.recommendation_version || null,
          decision: review.decision || null,
          proposal: review.proposal ? {
            action: review.proposal.action || null,
            skill_id: review.proposal.skill_id || null,
            recommended_task_kind: review.proposal.recommended_task_kind || null,
            recommended_level: review.proposal.recommended_level || null,
            support_direction: review.proposal.support_direction || null,
            rationale_codes: Array.isArray(review.proposal.rationale_codes) ? review.proposal.rationale_codes.slice() : []
          } : null,
          final_plan: review.final_plan ? {
            task_kind: review.final_plan.task_kind || null,
            level: review.final_plan.level || null,
            support_direction: review.final_plan.support_direction || null
          } : null
        });
      });
    });
    return rows;
  }

  function modelExportGovernanceCheck(sessions){
    const participantNames = Array.from(new Set((sessions || [])
      .map(session => String(session && session.learner || '').trim())
      .filter(Boolean)));
    const blocked = participantNames.filter(name => {
      if(!state.learners[name]) return true;
      const governance = dataGovernanceForLearner(name);
      return governance.status !== 'recorded-separately' || !governance.approved_uses.model_development;
    });
    return {
      allowed: participantNames.length > 0 && blocked.length === 0,
      participant_count: participantNames.length,
      blocked_count: blocked.length
    };
  }

  function buildPrivacyMinimisedDataset(sessions, governanceCheck){
    const fallbackCodes = new Map();
    const participantByLearner = new Map();
    const grouped = new Map();
    sessions.forEach(session => {
      const participantCode = participantCodeForSession(session, fallbackCodes);
      if(session.learner) participantByLearner.set(session.learner, participantCode);
      if(!grouped.has(participantCode)) grouped.set(participantCode, []);
      grouped.get(participantCode).push(session);
    });

    const sessionRows = [];
    Array.from(grouped.keys()).sort().forEach(participantCode => {
      const participantSessions = grouped.get(participantCode)
        .slice()
        .sort((a, b) => Number(a.updated_at_wall_ms || 0) - Number(b.updated_at_wall_ms || 0));
      const firstTime = Number(participantSessions[0] && participantSessions[0].updated_at_wall_ms);
      let previousTime = null;
      participantSessions.forEach((session, index) => {
        const sessionTime = Number(session.updated_at_wall_ms);
        const trials = Array.isArray(session.trials) ? session.trials : [];
        const summary = session.summary || analyticsSummaryForTrials(trials);
        const protocol = session.study_protocol || {};
        const fixedCondition = fixedConditionResearchRow(session);
        const diagnostics = session.eeg_marker_diagnostics || markerDiagnostics(session);
        const daysSinceFirst = Number.isFinite(firstTime) && Number.isFinite(sessionTime)
          ? Math.max(0, Math.round((sessionTime - firstTime) / 86400000))
          : null;
        const daysSincePrevious = Number.isFinite(previousTime) && Number.isFinite(sessionTime)
          ? Math.max(0, Math.round((sessionTime - previousTime) / 86400000))
          : null;
        sessionRows.push({
          participant_code: participantCode,
          session_code: `${participantCode}-s${String(index + 1).padStart(3, '0')}`,
          session_index: index + 1,
          days_since_first_session: daysSinceFirst,
          days_since_previous_session: daysSincePrevious,
          build_version: session.build && session.build.version ? session.build.version : APP_BUILD.version,
          schema_version: session.schema_version || DATA_SCHEMA_VERSION,
          skill_graph_version: session.skill_graph_version || SKILL_GRAPH_VERSION,
          generator_version: session.generator_version || GENERATOR_VERSION,
          research_condition: session.research_condition || protocol.research_condition || null,
          fixed_condition: {
            enabled: fixedCondition.enabled,
            adherence_status: fixedCondition.adherence_status,
            settings_fingerprint: fixedCondition.settings_fingerprint
          },
          starting_level: trials.length && Number.isFinite(trials[0].level) ? trials[0].level : null,
          ending_level: summary.current_level == null ? null : summary.current_level,
          session_task_mode: summary.task_kind || null,
          context_note_recorded: !!String(session.context_notes || '').trim(),
          student_friendly_mode: session.student_friendly_mode !== false,
          theme_used: session.theme_used || null,
          summary: {
            questions_answered: summary.questions_answered || 0,
            total_attempts: summary.total_attempts || trials.length,
            repeated_attempts: summary.repeated_attempts || 0,
            correct: summary.correct || 0,
            incorrect: summary.incorrect || 0,
            accuracy_pct: Number.isFinite(summary.accuracy_pct) ? summary.accuracy_pct : null,
            omission_count: summary.omission_count || 0,
            commission_count: summary.commission_count || 0,
            independent_success_count: summary.independent_success_count || 0,
            prompted_success_count: summary.prompted_success_count || 0,
            mean_rt_ms: Number.isFinite(summary.mean_rt_ms) ? summary.mean_rt_ms : null,
            rt_sd_ms: Number.isFinite(summary.rt_sd_ms) ? summary.rt_sd_ms : null,
            rt_cv: Number.isFinite(summary.rt_cv) ? summary.rt_cv : null,
            mean_touch_distance_px: Number.isFinite(summary.mean_touch_distance_px) ? summary.mean_touch_distance_px : null,
            fidelity_score_pct: Number.isFinite(summary.fidelity_score_pct) ? summary.fidelity_score_pct : null
          },
          skill_summaries: privacySafeSkillSummaries(trials),
          eeg_protocol: {
            protocol_schema_version: protocol.protocol_schema_version || null,
            run_number: protocol.run_number || null,
            declared_sync_method: protocol.declared_sync_method || 'not recorded',
            hardware_synchronization_verified: protocol.hardware_synchronization_verified === true
          },
          eeg_marker_diagnostics: diagnostics,
          trials: trials.map(privacySafeTrial),
          eeg_markers: privacySafeMarkers(session.eeg_markers || [])
        });
        if(Number.isFinite(sessionTime)) previousTime = sessionTime;
      });
    });

    return {
      app: APP_BUILD.app,
      export_schema_version: PRIVACY_EXPORT_VERSION,
      build: buildExportMeta(),
      purpose: 'Local, privacy-minimised research dataset for governed analysis and future model-development review.',
      privacy_status: 'pseudonymised-not-anonymous',
      privacy_notice: 'Participant codes remain linkable on the source device. Apply school consent, access, retention, and data-governance controls before research or model use.',
      governance: {
        dataset_purpose: 'research-and-model-development-review',
        consent_or_other_authority_status: 'recorded-separately-local-declaration',
        participant_profiles_checked: governanceCheck.participant_count,
        all_participants_model_development_use_approved: governanceCheck.allowed,
        authority_evidence_included: false,
        human_review_required: true,
        automated_decision_making_enabled: false,
        model_training_performed_by_application: false
      },
      privacy_manifest: {
        names_included: false,
        aliases_included: false,
        free_text_included: false,
        image_data_included: false,
        photo_labels_included: false,
        exact_timestamps_included: false,
        raw_touch_coordinates_included: false,
        prompt_wording_included: false,
        source_session_ids_included: false,
        protocol_condition_ids_included: false,
        fixed_condition_settings_included: false,
        external_transmission: false
      },
      interpretation_boundary: 'Behavioural and browser-event data support exploratory teaching and research analysis. They are not diagnostic and do not prove neural change or validate EEG synchronisation.',
      participant_count: grouped.size,
      session_count: sessionRows.length,
      sessions: sessionRows,
      teacher_decisions: privacySafeReviews(participantByLearner)
    };
  }

  async function exportPseudonymisedAiDataset(){
    await persistCurrentSession();
    await refreshStoredHistory();
    const sessions = researchSessionsInScope();
    if(!sessions.length){
      flash('try', 'No research sessions in this scope');
      return;
    }
    const governanceCheck = modelExportGovernanceCheck(sessions);
    if(!governanceCheck.allowed){
      updateAiExportGovernanceStatus(governanceCheck);
      flash('try', 'Model-development export blocked by data-use settings');
      return;
    }
    updateAiExportGovernanceStatus(governanceCheck);
    const payload = buildPrivacyMinimisedDataset(sessions, governanceCheck);
    const stamp = schoolTimestampParts();
    const filename = `ChoiceTrain_Pseudonymised_${stamp.date}_${stamp.time}_research-dataset.json`;
    triggerBlobDownload(new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' }), filename);
    logEvent('pseudonymised_research_exported', {
      export_schema_version: PRIVACY_EXPORT_VERSION,
      participant_count: payload.participant_count,
      session_count: payload.session_count,
      external_transmission: false
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
    bindAction(ui.adminNavResearch, () => applyAdminPage('research', { scroll: true }));
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
    bindAction(ui.saveFixedConditionBtn, saveFixedConditionManifest);
    bindAction(ui.applyFixedConditionBtn, applyFixedConditionManifest);
    bindAction(ui.adminExportSessionBtn, exportLogs);
    bindAction(ui.adminExportResearchBtn, exportEegMarkers);
    bindAction(ui.adminExportHistoryBtn, exportStoredHistory);
    bindAction(ui.adminExportAiDatasetBtn, exportPseudonymisedAiDataset);
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
    bindAction(ui.refreshResearchBtn, async () => {
      await refreshStoredHistory();
      renderResearchWorkspace();
    });
    bindAction(ui.exportResearchSummaryBtn, exportResearchWorkspaceSummary);
    bindAction(ui.saveRecommendationReviewBtn, saveRecommendationReview);
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
    if(ui.researchScopeSelect){
      ui.researchScopeSelect.addEventListener('change', renderResearchWorkspace);
    }
    if(ui.researchIncludeArchived){
      ui.researchIncludeArchived.addEventListener('change', renderResearchWorkspace);
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
      'eegAutoPauseSec', 'researchCondition', 'studyProtocolId', 'studyVisitId', 'studyRunNumber',
      'eegAcquisitionSystem', 'eegSyncMethod', 'eegClockNotes', 'lessonSeedOverride',
      'fixedConditionEnabled', 'protocolConditionId', 'eegExportFormat',
      'faceName', 'contextNotes', 'rewardChoice',
      'themeChoice', 'fontChoice', 'textScale', 'motionPreference', 'feedbackSoundMode', 'celebrationIntensity',
      'communicationSupportChoice', 'preSessionPreference',
      'communicationMode', 'motorAccessMode', 'adaptiveFunctioningBand', 'teacherAttentionRating',
      'teacherIndependenceRating', 'eegParticipation', 'dataUseStatus', 'researchAnalysisApproved',
      'eegLinkageApproved', 'modelDevelopmentApproved', 'governanceReference', 'governanceReviewDate',
      'aacPreference', 'staffMember', 'fatigueLevel', 'sensoryState',
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
        if(['dataUseStatus', 'researchAnalysisApproved', 'eegLinkageApproved', 'modelDevelopmentApproved', 'governanceReference', 'governanceReviewDate'].includes(id)) updateAiExportGovernanceStatus();
        if(['sessionTaskType', 'startLevel', 'autoLevelPath', 'maxObjects', 'findObjectSourceMode', 'findCategorySourceMode'].includes(id)) refreshContentConfiguration();
        updateFixedConditionStatus();
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
    populateRecommendationTaskOptions();
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
      updateFixedConditionStatus();
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
