# Changelog

All notable changes to ChoiceTrain are listed here.

## [1.4.0] - 2026-06-04

### Added

- a clearer `Teacher Panel` for daily classroom use
- a collapsed `Admin Panel` for advanced research, CPAT, fidelity, and debug settings
- collapsible teacher-facing sections for setup, personalisation, controls, notes, results, and research settings
- `ShowMe` branding with a local placeholder logo asset in `assets/showme-logo-placeholder.svg`
- new SEND-oriented colour themes: `Calm Blue`, `Soft Green`, `Warm Neutral`, `High Contrast`, `Low Stimulation Dark`, and `Light Classroom`
- multi-photo pupil personalisation with label, category, type, and question-use metadata
- local structured summaries to support future LLM-assisted recommendations without sending data externally
- school-friendly export filenames such as `ChoiceTrain_PupilA_2026-06-04_1430_session.json`
- browser tests covering teacher/admin layout, student-friendly mode, context-note export, theme persistence, prompt wording, and photo personalisation

### Changed

- learner-facing wording now uses warmer prompt language such as `Find Mum`, `Can you find Mum?`, and `Where is Mum?`
- prompt generation now varies phrasing for familiar-object, category, and preference tasks while keeping the target intact
- `medical notes` style wording has been replaced with `context notes`
- student-friendly mode now hides technical labels, analytics, debug text, build details, and research wording by default in learner mode
- teacher-facing controls now include simpler plain-English helper text
- the published stable snapshot is now `choice_train_V1.4.0.html` with runtime `choice_train_V1.4.0.js`
- `index.html` now points to the `V1.4.0` stable release content

### Preserved

- learner mode
- teacher and practitioner workflow
- pupil profiles
- text-to-speech
- touch tracking and heatmaps
- session exports
- GitHub Pages static deployment model

## [1.3.2] - 2026-06-04

- added EEG research mode scaffolding, event markers, artifact tracking, family-specific dashboards, fidelity tools, regulation controls, and active-control support
- promoted `choice_train_V1.3.2.html` and `choice_train_V1.3.2.js` as the stable published snapshot

## [1.3.1] - 2026-06-04

- added themed CPAT-style variants across sustained, selective-spatial, orienting, and executive task families
- introduced learner-facing rule cards and expanded browser regression coverage

## [1.3.0] - 2026-06-04

- cleaned the runtime into a paired HTML and JavaScript build
- added a universal trial schema, prompt ladder, omission and commission logging, and broader research foundations

## [1.2.4] - 2026-05-24

- added professional release tracking with build info surfaces and changelog support

## [1.2.3] - 2026-05-24

- added visible build and version labels in the app and exports

## [1.2.2] - 2026-05-24

- improved heatmap history handling, repeat-aware scoring, and safer touch selection behavior

## [1.2.1] - 2026-05-19

- first GitHub-published ChoiceTrain site snapshot for GitHub Pages deployment
