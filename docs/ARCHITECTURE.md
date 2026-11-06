# ChoiceTrain Architecture

## Overview

ChoiceTrain is a local-first static web application. It deliberately avoids a server runtime and external JavaScript dependencies in the learner application so it can run on GitHub Pages and school-managed devices.

## Runtime

- `index.html` is the published entry point.
- `choice_train_V1.6.0.html` is the current versioned interface snapshot.
- `choice_train_V1.6.0.js` contains application state, question generation, persistence, analytics, exports, accessibility behaviour, and research markers.
- `assets/` contains local branding files.

The application uses `localStorage` for settings and pupil profiles, and IndexedDB for larger assets and session history. Schema normalisation is idempotent and does not clear legacy data.

## Data Boundaries

ChoiceTrain does not call a cloud API. Pupil profiles, context notes, photographs, touch events, and session history stay in the current browser unless a user explicitly downloads an export.

Ordinary exports include image labels and metadata but omit embedded image bytes. Future LLM and EEG integrations must remain opt-in and subject to consent, safeguarding, and data-governance review.

## Testing and Deployment

- `tests/choice-train.spec.js` provides Playwright regression and visual smoke coverage.
- `scripts/run-browser-tests.js` starts the local static server and test process.
- `.github/workflows/ci.yml` validates branches and pull requests.
- `.github/workflows/pages.yml` reruns the browser suite before deploying `main` to GitHub Pages.

## Release Convention

Current versioned files stay at the root with `index.html`. Superseded snapshots move to `releases/` and remain unchanged. Release metadata is stamped with `scripts/stamp-build.ps1` after a candidate has passed the browser suite.
