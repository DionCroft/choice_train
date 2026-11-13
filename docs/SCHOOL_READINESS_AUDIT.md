# ChoiceTrain School-Readiness Audit

**Audit date:** 13 November 2026

**Published release:** `V1.7.1`

**Reviewed candidate:** `V1.7.0-alpha`, promoted to stable V1.7.0
**Purpose:** Prepare ChoiceTrain for initial teacher-led pupil testing at Brackensfield while preserving the existing learner, research, EEG, analytics, personalisation, and export features.

## Implementation Status

The immediate usability scope was implemented in `V1.5.0`. `V1.6.0` adds teacher-controlled category catalogues and per-session content filters without changing the established level meanings. A broader automatic progression hierarchy remains deliberately deferred for practitioner design.

`V1.7.0` promotes the reviewed product-readiness candidate. It separates teacher, learner, and admin/research workspaces; adds configurable legibility and sensory presentation; introduces an original train progress reward and local generated sounds; and applies a consistent semantic colour system across all workspaces, themes, states, and runtime visuals. It changes the live `index.html` without changing the established learning pathway.

`V1.7.1` responds to anonymised first-use school feedback that six answers could overflow on iPad, Kindle, and some laptop displays, and that attempting to scroll could select an answer. The update keeps the V1.7.0 learning pathway while adding automatic item fitting, a simple Teacher size preset, visual-viewport relayout, and gesture cancellation.

### V1.7 Release Status

Implemented and automatically covered:

- focused Today, Personalise, and Results teacher navigation
- full-width, focused Overview, Sessions, Learners, EEG, and System admin destinations
- one-action learner start and deliberate press-and-hold return
- semantic staff-shell and learner-theme roles with automated contrast, token-completeness, runtime-canvas, and non-colour-state safeguards
- calm-light default, bundled licensed font, text scaling, reduced motion, sound and celebration controls
- learner dynamic-viewport containment and tablet target sizing
- mobile containment for prompt, progress, Help, Break, and Stop controls
- schema 4 sensory-preference exports and audio/reward EEG markers
- preservation of the local-only data boundary and historical release files

Still required for school rollout and research use:

- structured teacher/TA usability sessions at Brackensfield
- appropriately consented learner observation across different access and sensory preferences
- physical Windows touchscreen, iPad Safari, Android Chrome, and intended Kindle Silk checks
- keyboard and assistive-technology review beyond automated Chromium coverage
- school data-protection review of profiles, photographs, context notes and downloaded exports
- research-team review of browser marker semantics and a separate timing-validation plan before EEG synchronisation
- local school approval before identifiable pupil data is entered

The detailed protocol and acceptance criteria are in [V1.7.0_USABILITY_TEST_PLAN.md](V1.7.0_USABILITY_TEST_PLAN.md). The colour baseline, semantic contract, remediation, and evidence limits are in [V1.7.0_COLOUR_SYSTEM_AUDIT.md](V1.7.0_COLOUR_SYSTEM_AUDIT.md).

Stable release validation completed:

- JavaScript syntax check passed for `choice_train_V1.7.1.js`
- `index.html` is byte-identical to `choice_train_V1.7.1.html`
- all 84 Playwright tests passed together: 58 broad regression/archive checks and 26 V1.7-specific checks
- the V1.7 checks include focused workspace navigation, staff and learner contrast, semantic-token completeness, runtime theme colours, local-only requests, sensory persistence, reduced motion, learner containment, reward and reward-disabled flows, export metadata, and tablet/mobile sizing
- the repeatable visual audit produced 22 synthetic-data captures spanning teacher session/sensory controls, Admin, active learner, reward, reward-disabled feedback, break, tablet, mobile, dedicated six-choice device layouts, and every theme
- the tested version retains the static GitHub Pages deployment model

## Feedback Outcomes

| Feedback area | Baseline finding | Agreed change |
| --- | --- | --- |
| Teacher instructions | The user guide is detailed, but the application does not provide a short first-session and repeat-session checklist at the point of use. | Add concise in-app checklists and mirror them in the user guide. |
| Daily settings | Several settings needed during ordinary classroom setup are only available in the Admin Panel. | Move the requested presentation, timing, answer-count, and task-selection controls into the Teacher Panel without duplicating element IDs or state. |
| Advanced settings | Research and performance controls are mixed with daily session controls. | Keep touch scaling/debugging, live trail, performance, live dashboard, single-target sequencing, and auto-level path in Admin. Clarify the single-target setting. |
| Student-friendly mode | `applyViewMode('learner')` forcibly checks the option, so a teacher cannot keep it switched off. | Default it to on, but respect and persist the teacher's explicit choice. |
| Current level | A numeric level and separate task selector made progression harder to interpret. | Place a named `Current Level for Auto Advance` selector beside Task and label the automatic task option `Auto advance`. |
| Apply preferences | Settings are already auto-saved, while `Apply preferences` also changes prompt controls. The label does not explain this. | Rename the action, explain what is automatic, and provide visible save confirmation. |
| Start/reset rules | Runtime behavior exists but the consequences are not explained beside the buttons. | Explain that Start begins a fresh session with displayed settings and Reset clears the current unsaved attempt while retaining the pupil profile, settings, and saved history. |
| Blank intervals | Staff need to distinguish memory demand between prompt/answers from pacing between questions. | Provide separate `Between Q&A Screens` and `Between questions` options with one shared duration and distinct event/export fields. |
| Teacher view control | `Teacher view` is redundant in desktop mode because Teacher/Admin tabs already control the panel. | Remove the redundant desktop button and retain the floating return control from learner mode. |
| Granular progression | V1.6.0 now supports per-pupil, per-task session filters for Find object and Find category. | Keep automatic category-by-level progression as a separately designed follow-up so the established level sequence remains understandable. |
| Six-answer device fit | Dense one-stage activities could require scrolling on smaller school displays, and a scroll gesture could activate a choice. | V1.7.1 fits dense tasks automatically, adds a Teacher item-size preset, and rejects moved touch gestures. |

## Additional Audit Findings

### High priority

- Resolved in `V1.5.0`: the Playwright setup no longer depends on hidden panel controls being visibly clickable, while dedicated tests still verify the actual Teacher/Admin navigation.
- Resolved in `V1.5.0`: modern browsers use Pointer Events only, while older browsers receive separate touch and mouse fallbacks. This prevents dual Pointer/Touch emission from inflating raw research logs.
- Resolved in `V1.7.0`: disabling both rewards and auto advance no longer traps the learner; the feedback surface keeps `Next` and `Repeat` available.
- Resolved in `V1.7.0`: Admin history hydration no longer shifts the selected destination into a large blank area, and a 390-pixel mobile learner viewport retains the regulation controls.
- Resolved in `V1.7.1`: automatic scaling no longer enlarges dense choices on smaller devices; six-answer iPad-, Kindle-, phone-, and laptop-sized layouts stay inside the learner viewport.
- Resolved in `V1.7.1`: named progression, task selection, Auto Advance flow, themes, sensory settings, and both blank-screen options now follow the requested Teacher workflow.

### Medium priority

- All styling and markup remain embedded in large versioned HTML files. This preserves the static deployment model but increases release-diff size and maintenance risk.
- V1.7 moves its new presentation rules into a separate versioned stylesheet, but the inherited HTML and JavaScript remain large single files. A module-level refactor is deferred until after school workflow validation to avoid changing tested task logic and persistence at the same time as the interface.
- Settings auto-save on both `input` and `change`; the debounce limits writes, but text/number changes can still trigger repeated pupil-profile persistence.
- Dashboard/reporting changes remain intentionally deferred until further school feedback defines the first useful teacher report.
- Automated Chromium contrast and screenshot checks do not establish suitability for a learner or replace physical Safari, Silk, touchscreen, keyboard, and assistive-technology review.

### Preserved behavior

- Learner mode and student-facing tasks
- Pupil profiles and local-first storage
- Personalised photo uploads and categories
- Text-to-speech
- Touch logging, heatmaps, history, and exports
- Attention Training task families, with compatible historic CPAT identifiers
- EEG/research markers and advanced settings
- GitHub Pages static deployment

## Accessibility and Usability Basis

The implementation will use the following established guidance without claiming clinical validation:

- [WCAG 2.2 input modalities](https://www.w3.org/WAI/WCAG22/Understanding/input-modalities) supports concurrent mouse, touch, keyboard, and other input methods and recognises the need for larger touch targets.
- [WCAG 2.2 target size](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum) sets a 24 by 24 CSS pixel minimum target or adequate spacing; ChoiceTrain will retain larger classroom-friendly controls.
- [W3C clear controls guidance](https://www.w3.org/WAI/WCAG2/supplemental/patterns/o1p05-clear-controls/) recommends recognisable controls and instructions that explain their use.
- [WCAG labels or instructions](https://www.w3.org/WAI/WCAG21/Understanding/labels-or-instructions) supports concise labels and enough guidance to complete a task without undue confusion.
- [WCAG consistent navigation](https://www.w3.org/WAI/WCAG21/Understanding/consistent-navigation) supports predictable placement and ordering, especially for people with cognitive and intellectual disabilities.
- [Department for Education digital accessibility guidance](https://www.gov.uk/guidance/meeting-digital-and-technology-standards-in-schools-and-colleges/digital-accessibility) recommends involving SEND and accessibility leads in school technology decisions.

## Release Acceptance Criteria

- Teacher Panel contains all settings requested for daily classroom use.
- Admin Panel retains only advanced/research/performance controls and remains accessible.
- Student-friendly mode can be turned on or off and remains at the teacher-selected value.
- Level number and task description update together.
- Settings save automatically; the pupil-preference action has an unambiguous label and confirmation.
- Start and reset consequences are explained in the interface and guide.
- Optional blank inter-trial screen works with a configurable duration and is logged/exported.
- Existing session, Attention Training, EEG, export, photo, theme, and learner-mode tests continue to pass.
- New browser tests cover the revised teacher controls, student-friendly persistence, blank interval, task description, and reset behavior.
- Every learner theme supplies the complete semantic contract; runtime-drawn cues and analytics follow theme changes; important states retain non-colour cues.
- Focused Admin destinations and reward-disabled/manual navigation remain operable at desktop, tablet, and tested mobile sizes.

## Implemented Session Filtering

`V1.6.0` resolves the immediate category-control need for Find object and Find category:

- selections are saved per pupil and independently for each task
- categories and Stock / Personalised source mode are combined as filters
- personalised content is limited to the selected pupil and enabled photos
- session configuration is validated before starting and snapshotted for the active session
- Family / People and Fruit / Food overlap is handled explicitly to avoid multiple valid answers
- selected categories, source mode, and eligible stimulus metadata are included in exports without image bytes

## Deferred Design Discussion

The broader progression hierarchy still needs a practitioner design session before implementation. That discussion should define:

- how category selections should change automatically by level or teaching target
- whether progression should use allowed categories, required categories, or both
- how teacher-created categories map to curriculum outcomes
- progression and regression rules
- how category mastery should appear in longitudinal reporting beyond the V1.6.0 session snapshot

This is deliberately separated from the immediate usability work to avoid introducing an untested progression model during the first school pilot.
