# Changelog

All notable changes to ChoiceTrain are listed here.

## [1.5.0] - 2026-11-05

### Added

- in-app first-session and repeat-session instructions for teachers and TAs
- live plain-English descriptions for the selected level and manual task override
- an optional blank inter-trial screen with a teacher-configurable duration
- blank-interval state and timing in session logs and exports
- a school-readiness audit mapping Brackensfield feedback to implementation and deferred design questions
- browser tests for the revised Teacher Panel, preference save confirmation, Student-friendly mode, level descriptions, blank intervals, and reset behavior

### Changed

- moved maximum answer options, task selection, prompt delay, question window, inter-trial interval, two-stage prompts, reward screen, text/image prompts, selected-label speech, and auto advance into the Teacher Panel
- retained touch scaling/debugging, live trail, performance mode, learner-dashboard refresh, single-target sequencing, and auto-level path in the Admin Panel
- renamed `Apply preferences` to `Save pupil preferences` and added visible save confirmation
- clarified the Start session and Reset session behavior at the point of use
- removed the redundant desktop `Teacher view` button while retaining Teacher/Admin tabs and the learner-mode Admin return button
- increased ordinary form and button targets to at least 44 CSS pixels where controlled by the app
- updated the browser harness so hidden panel controls can be configured without stale visibility assumptions

### Fixed

- Student-friendly mode no longer switches itself back on when a teacher has explicitly disabled it
- stale blank-screen timers are cancelled on reset, restart, repeat, break, and session completion
- modern touch browsers no longer record duplicate raw movement events through simultaneous Pointer and legacy Touch listeners

### Validation

- `node --check choice_train_V1.5.0.js`
- 46 Playwright browser tests passed across the live entry point, levels 1-10, CPAT, EEG, history, exports, learner mode, panel switching, personalisation, and the new teacher workflow

### Deferred

- granular category-by-level progression is documented for practitioner design before implementation

## [1.4.2] - 2026-06-04

### Added

- clickable `Teacher Panel` and `Admin Panel` buttons at the top of the side panel
- the provided `ShowMe` logo image as `assets/showme-logo.png`
- a browser regression test covering teacher/admin top-tab switching

### Changed

- teacher-facing sections and admin-facing sections are now shown as separate panel groups instead of only being labelled visually
- the live entry point and test harness now target the `V1.4.2` stable snapshot

## [1.4.1] - 2026-06-04

### Fixed

- the floating `Admin` button now returns from learner mode to teacher view and opens `Advanced Admin Settings` directly
- student-friendly hiding now applies only in learner-facing mode instead of keeping Admin sections hidden after returning to desktop view
- the versioned test harness and static server now point at the `V1.4.1` stable snapshot

### Added

- a browser regression test covering Admin Panel access from learner mode

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
