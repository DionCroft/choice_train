# Changelog

All notable changes to ChoiceTrain are listed here.

## [1.8.0-alpha] - Unreleased

### Implemented on the feature branch

- isolated `choice_train_V1.8.0-alpha` HTML, JavaScript, and CSS files while leaving the V1.7.0 GitHub Pages entry unchanged
- schema version 8 with versioned skill IDs, structured single- and multi-cue category relationship metadata, lesson/generator provenance, null-safe descriptive research summaries, and interpretation boundaries in session exports
- a separate local migration version so research-schema changes do not trigger unnecessary IndexedDB photo-asset rewrites
- a separate `Research` Admin destination with current-session, current-learner, and all-learner scopes; archived sessions remain excluded unless selected
- accessible chart-and-table views for session accuracy and independent responding, speed versus accuracy, outcome balance, skill profiles, support, category exposure, fidelity, artifacts, EEG marker completeness, maintenance, generalisation, and transfer observations
- corrected longitudinal trial grouping so question numbers from separate sessions are not collapsed together
- deterministic, constraint-first procedural questions with exported lesson and question seeds, a frozen lesson-plan snapshot, and an optional Admin replay seed
- browser coverage proving that a fixed seed reproduces the exact target, ordered options, and prompt wording while preserving the original level after progression
- versioned per-skill practice states using recent accuracy, independent success, session count, recency, observed trend, and support direction without claiming mastery
- spaced retention observations that require a gap of at least seven days and label follow-ups with small samples rather than treating missing evidence as retention
- deterministic next-session proposals with human-readable rationale codes and mandatory teacher approve, adjust, or decline review
- local recommendation audit history with proposal, final task and level, reviewer note, decision timestamp, and revision linkage
- Research visualisations and accessible tables for practice status, retention observations, recommendation decisions, and review history
- frozen session identity and contextual metadata so selecting another pupil after a session cannot relabel its history or export; duplicate display aliases remain isolated by local profile name
- versioned EEG study metadata for protocol, pseudonymous participant code, visit, run, acquisition-system label, declared synchronisation method, planned markers, and clock/latency notes
- per-session browser diagnostics for core marker completeness, event ordering, response-timing differences, duplicate IDs, non-monotonic clocks, and protocol-field completeness
- Research cards, an accessible aggregate chart, and an expanded session table for marker completeness, ordered trials, timing differences, protocol coverage, and declared synchronisation method
- a separate pseudonymised AI/research export with behavioural features, relative marker times, skill summaries, and sanitised teacher decisions; it excludes names, aliases, free text, images, photo labels, exact timestamps, source session IDs, prompt wording, and raw touch coordinates
- persistent random research participant codes, with explicit wording that pseudonymised data is not anonymous and remains subject to school governance
- generator version 1.5.0 and skill graph version 1.3.0 with deterministic `balanced-before-repeat` category and target schedules for Find object, Find category, Match category, Complete the group, Find the different one, Discriminate object, and Choice preference
- a metadata-defined `Match category` lesson that keeps one non-selectable cue exemplar visible above the choices, requires a different same-category target, and excludes category-matching distractors
- a metadata-defined `Find the different one` lesson that presents at least two differently labelled members of one reference category and exactly one outside-category target; it records the reference category, target relationship, and generator constraints for audit and Research views
- a metadata-defined `Complete the group` lesson with two distinct non-selectable cue exemplars, one same-category target, outside-category distractors, structured cue-list metadata, and a separate `categorisation.complete_group` skill
- a four-task automatic Level 6 rotation across Find category, Match category, Complete the group, and Find the different one when at least three answer options are configured; two-option sessions retain all except Find the different one
- multi-seed browser safeguards for category-task grammar, distinct IDs and labels, source/category constraints, exactly one valid answer, reproducible provenance, and Level 6 task rotation
- an accessible category-matching Research profile for trials, categories, distinct cues, targets and cue-target pairs, accuracy, independent success, omissions, median RT, and stored generator-invariant coverage
- Research workspace summary export version 1.5.0 with category-level matching, group-completion, category-difference, and consolidated category-by-task coverage aggregates, fixed-condition adherence rows, and no cue or target item labels
- a consolidated category lesson coverage chart and accessible table for task-family exposure, distinct targets, cues and displayed items, personalised-content use, accuracy, independence, and omissions
- an accessible complete-the-group Research profile for cue, cue-set and target breadth, accuracy, independent success, omissions, median RT, and stored generator-invariant coverage
- an accessible category-difference Research profile for reference categories, group-exemplar and outside-target breadth, accuracy, independent success, omissions, median RT, and stored generator-invariant coverage
- local fixed-condition manifests with non-identifying condition IDs, deterministic settings fingerprints, required replay seeds, protected non-overwrite behaviour, and save/apply controls under Admin and research
- opt-in session-start enforcement that blocks missing or drifted fixed conditions while leaving ordinary classroom sessions unrestricted; the frozen manifest, adherence result, condition ID, and fingerprint are retained in session, EEG, and marker exports
- fixed-condition Research cards, chart, and accessible session table for condition use, adherence, exceptions, replay seed, and settings fingerprint, with explicit boundaries around allocation, blinding, preregistration, ethics approval, and hardware timing
- EEG protocol metadata version 1.1.0 and condition IDs propagated to browser marker exports; the privacy-minimised model-development export excludes condition IDs and manifest settings
- fair category rotation and target rotation across stock, personalised, and teacher-created content while preserving source/category filters and exactly one valid answer
- two-option discrimination that prefers a within-category contrast and exports the actual contrast type without claiming visual or attribute equivalence
- open-ended preference lessons that accept every configured option, retain the selected content, suppress arbitrary target-distance measures, and mark the response as valid but unscored
- a Research target-exposure chart, distinct-target/repeat/personalised counts, and an accessible object-level table with category, source, accuracy, reaction time, and support context
- multi-seed learner-flow invariant coverage for target presence, unique options, category fairness, source constraints, prompt grammar, and no premature repeats
- per-pupil local data-use declarations for research analysis, EEG linkage, and model-development purposes, with a separately held authority reference and review date
- deny-by-default pseudonymised model-development export that checks every pupil profile in scope and remains blocked for missing, classroom-only, or withdrawn declarations
- full exports retain the local governance declaration for audit, while the privacy-minimised dataset excludes authority references and review dates
- a dedicated Attention Training family profile for sustained, selective-spatial, orienting, and executive performance, including accuracy, independence, omissions, commissions, RT, RT variability, and touch distance
- current-learner family trajectories with an accessible table and a descriptive percentage-point slope only after three observed sessions; all-learner scope deliberately suppresses slope interpretation
- response-quality visualisations for per-session omission and commission rates, RT variability, and mean touch distance, with observed-value counts and missing values preserved
- optional target-centre geometry, target-relative touch deltas, play-area dimensions, and play-diagonal-normalised distance in new compatible V1.8 trial records
- target-relative touch visualisations using adaptive hit-radius distance bands and outside-radius left/right/above/below counts, with open-ended and touch-anywhere tasks excluded
- pooled all-learner response-quality points are left unconnected so they cannot be mistaken for one learner's longitudinal trajectory
- longitudinal support-fading and dosage visualisations for independent responding, prompt/assistance counts, unknown support status, mean prompt level, actual/target minutes, and fidelity
- training-cadence visualisations for observed cumulative minutes, active days, dose-field coverage, and current-learner inter-session gaps, with sequencing suppressed for pooled learners
- explicit session start/end, completion status, end reason, elapsed-time, planned-question, and completed-question metadata, plus Research views for completion, response-window use, duration, and timeouts; final completion events and markers are now persisted before the session record is written, including learner-stopped sessions with no completed response
- a scope-aware Research summary download containing derived coverage, performance, timing, skill/practice, Attention Training, support, task/category exposure, context, EEG-readiness, and teacher-decision data without raw trials, events, touch coordinates, images, photo labels, or free-text notes
- task-demand and response-opportunity visualisations for displayed options, distractors, moving-target exposure, target size, adaptive hit radius, response window, and two-stage prompting, with the same derived rows included in the Research summary export
- prompt-ladder and learner-agency visualisations for highest prompt level, help requests, prompt events, repeats, learner breaks, automatic pauses, early stops, reward onsets, and reward choice
- an end-to-end learner-flow test proving help, break, repeat, and reward events reach the Research view, with explicit non-deficit interpretation wording
- teacher-rating and transfer-observation visualisations for 1-5 attention/independence ratings and recorded maintenance/generalisation status counts, with all-learner points left unconnected
- corrected pupil-profile persistence for communication, motor access, adaptive functioning, teacher ratings, EEG participation, and AAC fields while retaining snake-case export compatibility
- per-session content-breadth visualisations for displayed categories, distinct scored targets, repeat exposures, personalised trials, and preference-selection counts
- an open-ended preference profile showing selected item, category, source, count, assistance, and recency without treating selections as accuracy, stable preference, or reinforcer evidence
- per-session browser-marker completeness, ordering, protocol-coverage, and heuristic block-quality trends, with pooled-learner lines suppressed
- practitioner-logged Movement, Blink, Speech, Cap adjust, and Interruption distributions with event counts, affected-session counts, and transparent heuristic weights
- aggregate EEG-readiness bars now preserve missing values instead of drawing unavailable checks as zero
- task/variant/condition profiles with trials, scored opportunities, accuracy, observed independence, omissions, commissions, and median RT
- session-context visualisations and tables for practitioner-recorded readiness/fatigue, sensory state, sleep, breaks, and pre-session choice alongside descriptive outcomes
- access and presentation context charts plus a per-session table for communication mode, motor access, AAC, prompt presentation, theme, font, text scale, motion, sound, speech, learner view, option count, and response window
- persistence coverage proving profile-level AAC and motor-access settings remain available after reload and match the frozen session context
- sticky, keyboard-accessible Research section navigation plus a per-session domain-coverage chart and table for behaviour, support, context, content, EEG/protocol, and transfer fields
- explicit `Not expected` handling for non-EEG sessions so absent research-mode data is not displayed as zero or treated as missing learner performance
- a dependency-free cross-platform build stamper that requires explicit runtime files and records version, label, channel, UTC date, branch, commit, source pair, publication status, and repository URLs
- a hash-safe dry-run mode, strict single-`APP_BUILD` validation, a PowerShell compatibility wrapper, and three release-tool unit tests wired into branch and Pages CI
- refreshed the V1.8 alpha build information from reviewed checkpoint `c24156c` while retaining the experimental channel and explicit non-published V1.7 boundary
- 26 focused V1.8 browser tests, including multi-seed group-completion and category-difference integrity, fixed-condition persistence, drift blocking, replay, export, marker, and Research-view coverage; the complete stable, archive, and alpha matrix passes 103 tests

### Planned

- physical school-device, staff-usability, safeguarding, privacy, and measured EEG-timing validation

See [the V1.8 research and personalisation plan](docs/V1.8.0_RESEARCH_PERSONALISATION_PLAN.md) for evidence boundaries, milestones, and promotion gates.

## [1.7.0] - 2026-11-07

### Promoted

- promoted the reviewed V1.7 candidate to the stable versioned HTML, JavaScript, and CSS files
- updated `index.html` to the byte-identical V1.7.0 stable interface for GitHub Pages
- retained the alpha files and review documents for release traceability
- stamped the public interface as the stable V1.7.0 workspace rather than an alpha candidate

### Validated

- migrated the complete browser regression suite to the focused Today, Personalise, Results, Overview, Sessions, Learners, EEG, and System navigation paths
- verified the real full-screen learner flow for repeated Help escalation, deliberate teacher return, session history, EEG export, and photo-management workflows
- passed all 77 Playwright tests across the stable entry, archived release, Levels 1-10, Attention Training, EEG, exports, semantic themes, personalisation, responsive layouts, and local-only operation
- passed `node --check choice_train_V1.7.0.js`, whitespace validation, and exact `index.html`/versioned-HTML parity

### Release boundaries

- this promotion is an engineering and product-release milestone, not evidence of clinical efficacy, diagnosis, or universal SEND suitability
- physical Windows touchscreen, iPad Safari, Android Chrome, intended Kindle Silk, assistive-technology, teacher/TA, learner, privacy, and EEG timing checks remain ongoing school and study-readiness work

## [1.7.0-alpha] - 2026-11-06

This is an isolated candidate build. The published GitHub Pages entry remains `V1.6.0` until school usability, device, accessibility, privacy, and regression checks support promotion.

### Added

- three distinct workspaces: a focused teacher workflow, a full-viewport learner experience, and a full-width admin/research workspace
- teacher navigation for Today, Personalise, and Results, with a readiness summary and one-action learner-session start
- admin navigation for Overview, Sessions, Learners, EEG, and System, plus a local export centre
- per-device and per-pupil font, text-scale, motion, feedback-sound, and celebration preferences
- locally bundled Atkinson Hyperlegible Next font files and the SIL Open Font License
- an original ChoiceTrain train-journey progress display and configurable celebration intensity
- locally generated Web Audio feedback cues with off, low, and standard settings; no downloaded or copied game sounds
- a deliberate press-and-hold teacher return from learner mode to reduce accidental exits
- EEG marker codes for `audio_onset` and `reward_onset`
- schema version 4 export fields for sensory and presentation preferences
- a dedicated alpha browser suite and decision, data-dictionary, and usability-test documentation
- a semantic colour contract for every learner theme and a parallel product-shell token set for teacher/admin controls
- a repeatable 17-view visual-audit script covering staff workspaces, learner states, responsive layouts, and all themes

### Changed

- replaced the dense shared desktop layout in the alpha with task-focused teacher and admin views while preserving the complete underlying controls
- changed the alpha default presentation to a warm light, high-contrast shell with larger classroom controls
- made reduced motion, quiet feedback, text size, and familiar-font alternatives explicit rather than assuming one SEND-friendly configuration
- fitted learner mode to the dynamic viewport and removed unused page scrolling on tablet-sized screens
- prevented locally generated feedback tones from competing with prompt speech
- made Overview, Sessions, Learners, EEG, and System focused Admin destinations instead of exposing one continuously scrolling research page
- moved cue rings, pointer trails, ripples, task symbols, heatmaps, and analytics charts onto live theme tokens
- removed theme-specific learner patches so every theme controls the complete task, feedback, reward, footer, modal, and chart surface

### Fixed

- kept `Next` and `Repeat` available when rewards and auto advance are both disabled, preventing a learner-session trap
- replaced the opaque feedback wash with a readable semantic outcome ring and removed stale ripple elements between questions
- kept Help, Break, and Stop visible inside a 390-pixel mobile learner viewport
- corrected Admin landing alignment after history hydration and full-width reflow
- added non-colour check/cross cues to correct and incorrect choice states

### Preserved

- the published `V1.6.0` files and `index.html`
- levels 1-10, Attention Training families, pupil profiles, text-to-speech, photo personalisation, themes, local persistence, touch tracking, heatmaps, history, exports, EEG markers, fidelity tools, and GitHub Pages compatibility
- local-first operation with no external pupil-data, analytics, audio, or LLM service

### Evidence boundaries

- the high-legibility font is a configurable accessibility option, not a claim of universal benefit for SEND learners or dyslexia
- colour, motion, sound, and reward settings must be validated with each learner and practitioner
- gamification is intentionally lightweight so it supports engagement without replacing or obscuring the training rule
- the interface remains a teaching and research-support tool, not a diagnostic, medical, or clinically validated intervention

### Validation

- 21 dedicated alpha Playwright checks cover loading, local-only operation, staff and learner contrast, semantic-token completeness, runtime theme effects, focused workspace navigation, exports, sensory persistence, learner containment, reward and no-reward flows, EEG/audio metadata, tablet controls, and mobile containment
- 77 Playwright tests passed across the stable entry, archived V1.5 path, V1.6 regression suite, and alpha candidate: 56 stable/archive checks plus 21 alpha checks
- the repeatable visual audit captured 17 synthetic-data views spanning teacher, Admin, active learner, reward, no-reward feedback, break, tablet, mobile, and every theme
- desktop Chromium visual review is complete; physical school-device, Safari, Silk, assistive-technology, staff, and learner testing remains a promotion gate

## [1.6.0] - 2026-11-06

### Added

- an extensible category catalogue with Family, People, Animals, Transport, Food, retained Fruit and Symbols / Shapes, and teacher-created categories with stable IDs
- explicit Stock and Personalised source metadata independent of image category
- destination-category controls for individual and bulk photo imports, per-file failure reporting, multi-photo selection, and bulk category reassignment
- a non-destructive per-photo editor with square crop, zoom, focus, rotation, Apply, Cancel, and Reset controls
- independent category and source filters for Find object and Find category, with live usable-content summaries and pre-session validation
- immutable session-start content snapshots and export metadata for selected categories, source mode, and actual eligible stimuli
- a Plain White theme with quiet learner surfaces, readable controls, and clear focus indicators
- versioned, idempotent local image-schema migration metadata
- focused Playwright coverage for category persistence, resilient imports, pupil ownership, reassignment, photo editing, filtered generation, export hygiene, and Plain White

### Changed

- renamed active ChoiceTrain interface wording from CPAT / CPAT-style to Attention Training (AT), while retaining compatible `cpat-*` internal IDs and historical research terminology
- changed active Vehicles / vehicle wording to Transport / transport and made category prompts grammar-aware
- reordered the manual task menu to Find object, Find category, then Discriminate object without changing Levels 5 and 6 or automatic progression
- clarified that Discriminate object currently presents a named-item choice between two options and does not guarantee visual similarity
- expanded the stock catalogue across family, people, animals, transport, food, fruit, and symbols / shapes
- changed all photo presentation surfaces to proportional `contain` framing by default instead of cutting images to fill a square
- expanded ordinary exports with schema and content-configuration metadata while continuing to omit raw image data
- reorganised superseded V1.2 to V1.5 builds into a documented `releases/` archive while keeping the current Pages entry and V1.6.0 pair at the root
- moved user, research, privacy, architecture, and school-readiness material into `docs/`
- moved release stamping into `scripts/` and added CI validation before GitHub Pages deployment
- added contribution, security, issue, pull-request, editor, citation, and line-ending metadata for a more maintainable public repository

### Fixed

- bulk imports no longer assign every image to Legacy Custom
- switching pupil or changing form controls during an import no longer cross-assigns successfully prepared files
- one unsupported or corrupt file no longer discards the rest of a valid batch
- failed IndexedDB writes no longer produce a misleading persistent-save success message
- Find object no longer creates duplicate-label or excluded-content choices
- Find category no longer falls back to an unrelated item when a category is empty and avoids overlapping distractors that would also satisfy the prompt

### Compatibility

- legacy `animal` / `animals`, `vehicle` / `transport`, and `symbol` / `shape` category values are normalised without deleting the original category metadata
- Family content also belongs to People, and Fruit content also belongs to Food for question generation
- historic versioned builds, task IDs, stored pupil data, and research paper titles remain intact
- deeper redesign of the Discriminate object algorithm and granular category-by-level progression remain deferred

### Validation

- `node --check choice_train_V1.6.0.js`
- 266 unique HTML element IDs with no duplicates
- 56 Playwright tests passed against the promoted `index.html`, versioned V1.6.0 build, and archived V1.5.0 path
- desktop and tablet screenshots were inspected for Plain White readability, portrait/landscape framing, the photo editor, and learner-mode target layout

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
