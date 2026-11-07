# ChoiceTrain Architecture

## Overview

ChoiceTrain is a local-first static web application. It deliberately avoids a server runtime and external JavaScript dependencies in the learner application so it can run on GitHub Pages and school-managed devices.

## Runtime

- `index.html` is the published entry point.
- `choice_train_V1.7.0.html` is the current versioned interface snapshot and matches `index.html`.
- `choice_train_V1.7.0.js` contains application state, question generation, persistence, analytics, exports, accessibility behaviour, and research markers.
- `choice_train_V1.7.0.css` contains the stable workspace and learner presentation layer.
- `choice_train_V1.7.0-alpha.*` preserves the reviewed candidate for release traceability and is not loaded by `index.html`.
- `choice_train_V1.8.0-alpha.*` is the isolated research-and-personalisation candidate. It is loaded only when opened directly or by its dedicated browser tests and does not change the V1.7 GitHub Pages entry point.
- `assets/` contains local branding and font files; `LICENSES/` records third-party licences.

## V1.7.0 Workspace Model

V1.7 adds a presentation layer around the existing static runtime rather than replacing its learning and research model:

- the teacher workspace exposes Today, Personalise, and Results task contexts
- learner mode occupies the dynamic viewport and hides configuration surfaces
- the admin/research workspace exposes Overview, Sessions, Learners, EEG, and System destinations

The views share one application state and one set of DOM controls. Navigation changes visibility and focus; it does not create duplicate settings. Admin groups declare their destinations with `data-admin-pages`; a body-level destination state exposes only the groups relevant to Overview, Sessions, Learners, EEG, or System. Header-aware scrolling is deferred until the full-width layout and stored-history hydration settle. A 1.2-second hold gesture protects the learner-to-teacher return control from accidental taps, while keyboard activation remains immediate.

## Presentation and Audio

The versioned stylesheet keeps presentation concerns separate from the inherited static interface. Atkinson Hyperlegible Next is served locally under the SIL Open Font License. It is one selectable interface option; the runtime also retains a familiar sans-serif alternative and per-pupil text scaling.

The visual system has two namespaces:

- `--shell-*` roles control the fixed ChoiceTrain teacher/Admin product shell.
- learner theme roles control the stage, task surfaces, controls, outcomes, reward, focus, overlays, and task-stimulus colours.

Legacy learner variables remain compatibility aliases, but V1.7 components use semantic roles. JavaScript resolves live colours through `themeToken()` and `colourWithAlpha()` before drawing Attention Training symbols, pointer trails, cue rings, ripples, heatmaps, and charts. `applyTheme()` redraws affected canvases so a theme change does not require a reload. A V1.7 browser test rejects component-level colour literals outside the root token definitions.

Feedback audio is synthesised locally with the Web Audio API. There are no remote audio files, microphones, recordings, or copied third-party game sounds. Active tones are stopped before speech so feedback does not overlap a spoken prompt. Motion, sound, and celebration intensity can be reduced or disabled.

The application uses `localStorage` for settings and pupil profiles, and IndexedDB for larger assets and session history. Schema normalisation is idempotent and does not clear legacy data. V1.7 uses data schema version 4 and adds presentation preferences without renaming the established storage keys, preserving compatibility with the V1.6 profile model. The isolated V1.8 alpha uses data schema 8, skill graph 1.3.0, and generator 1.5.0. Its procedural category tasks use frozen seeds and teacher-selected metadata to preserve one-answer constraints; group completion records an ordered multi-cue list, while category difference records an explicit reference category and outside-category relationship. V1.8 also adds a separate versioned `choice_train_fixed_conditions_v180` local registry for small research-control manifests; it does not place session history or image data back into synchronous storage.

## Data Boundaries

ChoiceTrain does not call a cloud API. Pupil profiles, context notes, photographs, touch events, and session history stay in the current browser unless a user explicitly downloads an export.

Ordinary exports include image labels and metadata but omit embedded image bytes. Future LLM and EEG integrations must remain opt-in and subject to consent, safeguarding, and data-governance review.

V1.7 exports include a `sensory_preferences` object containing the selected font, text scale, motion, feedback sound, and celebration intensity. EEG event codes 32 and 33 represent audio and reward onset. These browser timestamps support later alignment work but are not hardware-synchronised EEG triggers.

## Testing and Deployment

- `tests/choice-train.spec.js` provides Playwright regression and visual smoke coverage.
- `tests/choice-train-v170.spec.js` verifies the stable V1.7 workspace, theme, accessibility, export, and responsive-layout contract.
- `scripts/run-browser-tests.js` starts the local static server and test process.
- `scripts/capture-v170-visual-audit.js` creates 17 ignored, synthetic-data screenshots and a bounds manifest for repeatable desktop, tablet, mobile, state, and theme review.
- `scripts/stamp-build.js` is the cross-platform release metadata source of truth; `scripts/stamp-build.ps1` is a Windows compatibility wrapper.
- `scripts/stamp-build.test.js` validates replacement safety, explicit targeting, and dry-run argument handling with the built-in Node test runner.
- `schemas/` contains JSON Schema 2020-12 core contracts, and `scripts/schema-contract.test.js` keeps their versions, task/skill enums, and privacy invariants aligned with the V1.8 runtime.
- `.github/workflows/ci.yml` validates branches and pull requests.
- `.github/workflows/pages.yml` reruns release-tool and browser suites before deploying `main` to GitHub Pages.

## Release Convention

Current versioned files stay at the root with `index.html`. Superseded snapshots move to `releases/` and remain unchanged. Release metadata is stamped in the explicit versioned JavaScript runtime with `scripts/stamp-build.js` after a candidate has passed the browser suite. The tool defaults to the current Git branch, short commit, and UTC date, supports a no-write dry run, and refuses files with zero or multiple `APP_BUILD` blocks.

A candidate can be pushed on a feature branch, but promotion requires the complete automated suite, documented review, a metadata stamp, and explicit product-owner approval. Promotion updates the stable versioned HTML, JavaScript, and CSS plus `index.html`; merely adding candidate files does not publish them. V1.7 passed 77 Playwright checks, while the visual audit remains review evidence rather than a screenshot-baseline gate. Physical school-device, staff, learner, privacy, and research-timing validation remain separate deployment and study-readiness activities.
