# ChoiceTrain Architecture

## Overview

ChoiceTrain is a local-first static web application. It deliberately avoids a server runtime and external JavaScript dependencies in the learner application so it can run on GitHub Pages and school-managed devices.

## Runtime

- `index.html` is the published entry point.
- `choice_train_V1.6.0.html` is the current versioned interface snapshot.
- `choice_train_V1.6.0.js` contains application state, question generation, persistence, analytics, exports, accessibility behaviour, and research markers.
- `choice_train_V1.7.0-alpha.html`, `.js`, and `.css` form an isolated candidate build. They are not referenced by `index.html`.
- `assets/` contains local branding and alpha font files; `LICENSES/` records third-party licences.

## V1.7.0-alpha Workspace Model

The alpha adds a presentation layer around the existing static runtime rather than replacing its learning and research model:

- the teacher workspace exposes Today, Personalise, and Results task contexts
- learner mode occupies the dynamic viewport and hides configuration surfaces
- the admin/research workspace exposes Overview, Sessions, Learners, EEG, and System destinations

The views share one application state and one set of DOM controls. Navigation changes visibility and focus; it does not create duplicate settings. Admin groups declare their destinations with `data-admin-pages`; a body-level destination state exposes only the groups relevant to Overview, Sessions, Learners, EEG, or System. Header-aware scrolling is deferred until the full-width layout and stored-history hydration settle. A 1.2-second hold gesture protects the learner-to-teacher return control from accidental taps, while keyboard activation remains immediate.

## Presentation and Audio

The alpha stylesheet is separate so it can be evaluated or removed without changing the stable release. Atkinson Hyperlegible Next is served locally under the SIL Open Font License. It is one selectable interface option; the runtime also retains a familiar sans-serif alternative and per-pupil text scaling.

The visual system has two namespaces:

- `--shell-*` roles control the fixed ChoiceTrain teacher/Admin product shell.
- learner theme roles control the stage, task surfaces, controls, outcomes, reward, focus, overlays, and task-stimulus colours.

Legacy learner variables remain compatibility aliases, but edited alpha components use semantic roles. JavaScript resolves live colours through `themeToken()` and `colourWithAlpha()` before drawing CPAT symbols, pointer trails, cue rings, ripples, heatmaps, and charts. `applyTheme()` redraws affected canvases so a theme change does not require a reload. An alpha browser test rejects component-level colour literals outside the root token definitions.

Feedback audio is synthesised locally with the Web Audio API. There are no remote audio files, microphones, recordings, or copied third-party game sounds. Active tones are stopped before speech so feedback does not overlap a spoken prompt. Motion, sound, and celebration intensity can be reduced or disabled.

The application uses `localStorage` for settings and pupil profiles, and IndexedDB for larger assets and session history. Schema normalisation is idempotent and does not clear legacy data. The alpha uses data schema version 4 and adds presentation preferences without renaming the established storage keys, preserving compatibility with the V1.6 profile model.

## Data Boundaries

ChoiceTrain does not call a cloud API. Pupil profiles, context notes, photographs, touch events, and session history stay in the current browser unless a user explicitly downloads an export.

Ordinary exports include image labels and metadata but omit embedded image bytes. Future LLM and EEG integrations must remain opt-in and subject to consent, safeguarding, and data-governance review.

Alpha exports add a `sensory_preferences` object containing the selected font, text scale, motion, feedback sound, and celebration intensity. EEG event codes 32 and 33 represent audio and reward onset. These browser timestamps support later alignment work but are not hardware-synchronised EEG triggers.

## Testing and Deployment

- `tests/choice-train.spec.js` provides Playwright regression and visual smoke coverage.
- `tests/choice-train-v170-alpha.spec.js` verifies the isolated candidate without changing stable expectations.
- `scripts/run-browser-tests.js` starts the local static server and test process.
- `scripts/capture-v170-visual-audit.js` creates 17 ignored, synthetic-data screenshots and a bounds manifest for repeatable desktop, tablet, mobile, state, and theme review.
- `.github/workflows/ci.yml` validates branches and pull requests.
- `.github/workflows/pages.yml` reruns the browser suite before deploying `main` to GitHub Pages.

## Release Convention

Current versioned files stay at the root with `index.html`. Superseded snapshots move to `releases/` and remain unchanged. Release metadata is stamped with `scripts/stamp-build.ps1` after a candidate has passed the browser suite.

An alpha can be pushed on a feature branch, but promotion requires all tests, documented usability and device checks, a metadata stamp, and explicit approval. Promotion then updates the stable versioned pair and `index.html`; merely adding alpha files does not publish them as the live application. The local V1.7 matrix currently contains 56 stable/archive checks and 21 alpha checks, while the visual audit is review evidence rather than a screenshot-baseline gate.
