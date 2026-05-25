# Changelog

All notable changes to ChoiceTrain are documented in this file.

The format is inspired by Keep a Changelog and is written to match the way this project is released: experimental builds are developed in `Experimental_Choice_Train`, then stable snapshots are promoted into `GitHub/choice-train`.

## [Unreleased]

Future prototypes continue in `Experimental_Choice_Train` before promotion into this repo.

## [1.3.2] - 2026-05-25

### Added

- Published `V1.3.2` release with `index.html`, `choice_train_V1.3.2.html`, and the paired `choice_train_V1.3.2.js` runtime.
- `EEG research mode` with marker exports for prompt onset, cue onset, stimulus onset, target-present or no-go state, response, omission, commission, feedback onset, break onset, break offset, artifact notes, and session completion.
- Automatic block pauses, block summaries, and ERP-friendly export scaffolding for later EEG-aligned studies.
- Observational artifact logging for movement, blink, speech, cap adjustment, and interruptions.
- Learner-facing `Help`, `Break`, and `Stop` controls plus reward, theme, and quick preference choices.
- Practitioner fidelity and coaching tools, including a fidelity checklist, dosage tracking, and coaching review notes.
- Family-specific attention dashboard rows for sustained, selective-spatial, orienting, and executive CPAT-style performance.
- Active-control scaffolding for future publication work using matched lower-demand comparison conditions.
- Browser regression coverage for EEG break flow, EEG export, learner help, active control, and the corrected sustained-attention behavior.

### Changed

- The current published build is now `V1.3.2`.
- `Signal Station` now behaves as an actual red-wait then green-tap sustained-attention round, while target-absent correct-rejection logic stays in `Star Watch` where the learner-facing wording already matches that behavior.
- README guidance now reflects the new research-mode features, EEG exports, fidelity layer, and the promoted `V1.3.2` snapshot.

### Fixed

- CPAT sustained attention no longer auto-completes a `Signal Station` round on passive waiting with no green target shown.
- The sustained-attention browser coverage now matches the corrected learner flow across `Star Watch` and `Signal Station`.

## [1.3.1] - 2026-05-24

### Added

- Published `V1.3.1` release with `index.html`, `choice_train_V1.3.1.html`, and the paired `choice_train_V1.3.1.js` runtime.
- Four new CPAT-style game variants to improve engagement without changing the broader task families: `Signal Station`, `Ticket Hunt`, `Platform Pointer`, and `Traffic Lights`.
- Visible learner-facing `Variant` and `Rule` cards so the current task and instruction stay stable on screen.
- Trial export fields for `task_variant` and `variant_label` to support variant-level review.
- Browser regression coverage for CPAT variant rotation and the corrected `Traffic Lights` behavior.

### Changed

- The current published build is now `V1.3.1`.
- The browser regression harness now targets the `V1.3.1` snapshot.
- README guidance now reflects the new published snapshot and the additional CPAT-style variants.

### Fixed

- `Traffic Lights` no longer auto-completes on a passive wait while staying red. It now shows a red wait phase, then a green tap phase so the learner performs a true wait-then-go interaction.
- Transient success badges are cleared before the next auto-advanced question so the next learner item starts visually clean.

## [1.3.0] - 2026-05-24

### Added

- Published `V1.3.0` release with `index.html`, `choice_train_V1.3.0.html`, and the paired `choice_train_V1.3.0.js` runtime.
- A research-aligned 10-stage pathway that separates foundational touchscreen learning from a later CPAT-style suite for sustained, selective-spatial, orienting, and executive attention.
- A universal trial schema across the whole ChoiceTrain flow, including prompt level, support code, independence status, omission flags, commission flags, and richer session context.
- Whole-app omission, commission, mean reaction time, reaction time variability, and domain-summary analytics instead of relying only on accuracy and a generic attention label.
- A structured prompting and support ladder for SEND delivery, including coded prompt escalation and assisted-versus-independent capture.
- Learner baseline and longitudinal research fields such as communication mode, motor access, adaptive-functioning band, teacher ratings, fatigue, sensory state, maintenance status, generalisation status, and classroom transfer notes.
- Stronger storage and performance foundations, including IndexedDB-backed session history, compressed image persistence, history export and archiving tools, sampled move logging, and throttled dashboard refresh behavior.
- EEG-friendly event logging foundations covering cue onset, stimulus onset, prompt application, trial completion, and session-level events.
- An in-app `Documentation and terminology` section for practitioner guidance.
- A Playwright browser regression harness with package, config, scripts, and tests covering the full auto path plus prompt, repeat, omission, commission, documentation, and history-export behaviors.
- Extended `stamp-build.ps1` support for richer `APP_BUILD` metadata and external-script runtimes.

### Changed

- The runtime is now consolidated into one active JavaScript source of truth instead of keeping multiple duplicate generations of key functions inside a single HTML file.
- The developmental flow now starts with touching the screen itself before moving to touching the pictured target, moving targets, object discrimination, category reasoning, and later CPAT-style attention work.
- Attention reporting now emphasizes domain-specific measures and an exploratory engagement index rather than labels such as `Strong` or `Needs support`.
- The published browser-facing app now includes the tested documentation panel, research-aligned terminology, and release-ready versioned snapshot structure.

### Fixed

- Reward-screen `Auto advance` now moves to the next question instead of always waiting for a manual `Next`.
- Session-complete controls now match real progression behavior by showing `Start Level X` when the learner has advanced.
- CPAT selective-spatial prompts now always include the requested target in the visible answer set.
- Broken symbol rendering for stars and orienting arrows was corrected.
- Duplicate active definitions of core functions such as `analyticsSummary`, `renderChoiceScreen`, `savePupilProgress`, and `recommendationItems` were removed from the runtime.

## [1.2.4] - 2026-05-24

### Added

- Dedicated `About / Build Info` panel in practitioner mode.
- Copy actions for build info and the live URL.
- Build metadata now surfaces published entry, live site URL, and repository URL together in one place.
- Versioned snapshot file `choice_train_V1.2.4.html`.

## [1.2.3] - 2026-05-24

### Added

- Visible active build label in the practitioner panel.
- Footer version chip for quick at-a-glance build confirmation.
- Version metadata in exported session files.
- Imported dashboard files can surface their source build when that metadata exists.
- Versioned snapshot file `choice_train_V1.2.3.html`.

## [1.2.2] - 2026-05-19

### Added

- Heat map scope controls for current session, learner history, all stored history, and imported data.
- Clearer heat map labels with question, attempt, task, and correctness context.
- Richer heat map captions with learner, session, selection, reaction time, and touch-distance details.
- Versioned snapshot file `choice_train_V1.2.2.html`.

### Changed

- Dashboard summaries and progression now use the latest outcome per question instead of overcounting retries.
- Automatic task sequencing after the single-target phase was corrected.
- Touch answers now confirm on release rather than on initial contact.

### Fixed

- Storage persistence failures now raise a visible warning instead of failing silently.

## [1.2.1] - 2026-05-08

### Added

- Stable published snapshot `choice_train_V1.2.1.html`.
- GitHub Pages-compatible `index.html` deployment entry.
- Expanded README project overview and user-guide material.
