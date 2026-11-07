# ChoiceTrain User Guide

**Published version:** `V1.7.0`
**Project:** ChoiceTrain for ShowMe  
**Repository:** https://github.com/DionCroft/choice_train  
**Live site:** https://dioncroft.github.io/choice_train/

---

## 1. Introduction

ChoiceTrain is an offline-friendly, touch-first educational and research-support platform designed for SEND classrooms.

It supports learners who may benefit from:

- personalised visual content
- structured progression
- simple touch interaction
- calm learner presentation
- teacher-friendly setup and export tools
- optional research-ready data collection

ChoiceTrain is designed to:

- support engagement through familiar and personalised content
- build confidence through a staged learning pathway
- reduce teacher workload through simple classroom controls
- collect structured touch and session data for educational review
- remain usable on school devices without requiring cloud services

ChoiceTrain is a **teaching and research-support tool**. It is **not** a diagnostic, medical, or clinical system.

### About V1.7.0

V1.7.0 is the published GitHub Pages build. To open the same version locally after starting a server from the repository root, use:

`http://localhost:8000/choice_train_V1.7.0.html`

The release passed the automated engineering gate, but schools should still approve their own usability, safeguarding, consent, privacy, retention, and device processes before using identifiable pupil data.

The automated repository matrix contains 77 passing browser tests. This is technical validation, not a substitute for the staff and learner protocol in [V1.7.0_USABILITY_TEST_PLAN.md](V1.7.0_USABILITY_TEST_PLAN.md).

---

## 2. System Overview

ChoiceTrain has three main working views:

### Learner Mode

Learner Mode is the pupil-facing activity view.

It focuses on:

- large touch targets
- simple prompts
- personalised images
- calm progress feedback
- minimal distractions

Student-friendly mode is enabled by default for new users. A teacher can switch it off when the additional task labels are helpful, and the app respects that choice when learner mode opens.

### Teacher Panel

The Teacher Panel is for everyday classroom use.

Teachers and TAs can use it to:

- select or add a pupil
- set session length
- choose the number of questions
- review the current level and its task description
- choose a task for the session
- set answer count, prompt delay, question window, and inter-trial interval
- choose two-stage, text, image, reward, selected-label speech, and auto-advance options
- add an optional timed blank screen between questions
- add context notes
- choose a theme
- enable or disable speech
- upload personalised photos
- start, reset, or export a session

### Admin Panel

The Admin Panel is for advanced settings and research-related tools.

It includes:

- research and EEG mode
- touch debug and live trail
- heatmaps and detailed analytics
- Attention Training settings
- auto level path
- touch scaling
- advanced export options
- build and version information
- research and fidelity settings

The Admin Panel is hidden by default and is intended for advanced users rather than everyday classroom setup.

### V1.7 Workspace Navigation

V1.7.0 gives each role a focused workspace:

- `Today` contains pupil selection, session readiness, daily settings, context and the primary start action.
- `Personalise` contains pupil baseline preferences, images, categories and content choices.
- `Results` contains the current session summary and school-friendly export.
- `Admin & research` opens a full-width workspace with focused Overview, Sessions, Learners, EEG and System destinations. Only the groups relevant to the selected destination are shown, so staff do not need to search one very long research page.

Select `Start learner session` to apply learner view and begin in one action. In learner mode, press and hold the small lock control for about 1.2 seconds to return to the teacher workspace. A normal tap does not exit; keyboard activation remains immediate for staff who use keyboard access.

### V1.8 Alpha Research Preview

The development-only V1.8 alpha adds a separate `Research` destination inside `Admin & research`. It is available from `choice_train_V1.8.0-alpha.html` on the feature branch and is not the published GitHub Pages entry.

Research scope can be set to the current session, current learner history, or all locally stored learners. Archived sessions are excluded unless `Include archived sessions` is selected. The workspace pairs each chart with a table or text summary and covers session trends, accuracy and response speed, outcomes, versioned skills, support and independence, category exposure, fidelity, artifacts, EEG marker completeness, maintenance, generalisation, and classroom-transfer observations.

`Attention Training family profile and observed change` keeps sustained, selective-spatial, orienting, and executive practice separate. The first chart compares family accuracy; the second shows observed current-learner session trajectories. The table adds independence, omissions, commissions, reaction time, RT variability, and touch distance. A descriptive slope needs at least three sessions in that family and is hidden in all-learner scope to avoid treating different pupils as one learning curve.

`Response quality and touch behaviour over time` shows omission and commission rates, reaction-time variability, and mean touch distance for each session. Check the table's `RT observed` and `Touch observed` counts before interpreting a chart. Touch distance is influenced by the task layout, target size, device, and touch scaling, so it is not a standalone motor or attention measure. In all-learner scope, points are intentionally not connected.

`Support fading and session dosage over time` compares independent responding with implementation fidelity and shows actual versus target session minutes. Its table keeps prompted, assisted, and unknown support statuses separate and reports mean prompt level. Independence uses only responses with an observed support status; missing support data is not counted as independent.

`Maintenance, generalisation, and classroom transfer observations` visualises the teacher's 1-5 attention and independence ratings and counts the recorded maintenance/generalisation statuses. `Not run` and missing statuses stay in the table but are excluded from the status bars. These observations should be reviewed alongside classroom evidence and separately from task performance or EEG outcomes. All-learner rating points are intentionally unconnected.

`Content breadth over time` shows how many categories were represented in the displayed options, how many different scored targets were practised, repeat exposures, personalised-content trials, and preference selections in each session. It helps staff see whether practice is narrow or varied, but does not show that learning transferred to unpractised content.

`Open-ended preference selections` counts the items the learner actually selected and reports category, source, assistance, and recency. It does not assign accuracy and should not be treated as a stable preference profile or formal reinforcer assessment; preferences can change with context and time.

Procedural questions in V1.8 use a stored lesson seed. The session export records the frozen lesson constraints and a separate seed for each question, allowing an authorised researcher to audit or replay the same generated content. `Lesson replay seed` in Admin and research is optional and intended for controlled comparison or debugging; leave it blank for normal sessions so ChoiceTrain creates a seed automatically.

Generator 1.2.0 uses `balanced-before-repeat` coverage for `Find object`, `Find category`, `Discriminate object`, and `Choice preference`. It rotates through configured usable categories before repeating a category, then rotates eligible content within each category. Discrimination uses two options and prefers a same-category contrast where possible. Preference uses two to four options, accepts every selection, and is recorded as an unscored preference rather than a right-or-wrong answer. This reduces accidental over-practice of one familiar picture while keeping the lesson reproducible from its seed. The Research `Target exposure and repetition` area shows distinct targets, repeat exposures, personalised trials, source, accuracy, median response time, and assisted responses so teachers can judge whether progress is broad or content-specific.

`Practice status and spaced retention observations` groups raw skill opportunities into transparent planning descriptions. The table shows its sample size, recent accuracy, independent success, last practice, trend, retention observation, and support direction. `Consistent in current sample` does not mean mastered. A retention comparison only appears after an observed follow-up at least seven days later, and small follow-up samples are labelled as such.

`Teacher-reviewed next-session planning` proposes one local, rule-based next step for the selected pupil. Review the evidence, then approve it, approve it with a different task or level, or decline it. Add a note explaining the decision. ChoiceTrain stores each revision in the pupil's local review history and exports the audit record, but never applies the proposal automatically.

ChoiceTrain freezes the session's selected pupil and context when `Start learner session` is pressed. Staff can select another pupil afterward to review their history without changing who completed the earlier session. An export alias does not need to be unique, but schools should still use a consistent alias policy.

The EEG quality area also shows marker-set completeness, event-order validity, response-timing differences, protocol-field coverage, and the declared synchronisation method. These are browser-log checks, not confirmation that an EEG amplifier is synchronised or that the physiological signal is usable.

The V1.8 preview adds per-session marker/protocol trends, a mean block-quality trend, and an artifact-type chart. Artifact rows count staff-logged Movement, Blink, Speech, Cap adjust, and Interruption events and show how many sessions contained each type. The block score is a transparent logging heuristic based on those events and response errors. It is not EEG signal quality, and a high score does not verify hardware timing.

Before research export, an authorised staff member can use `Admin & research` > `Learners` to record the selected pupil's local data-use declaration. Choose whether authority is recorded separately, add a non-identifying internal reference and review date if required, and mark the permitted purposes. ChoiceTrain does not store the consent or authority document itself. If authority is missing, classroom-only, or withdrawn, the model-development export remains blocked.

The Export centre includes `Pseudonymised AI research data`. This creates a local, privacy-minimised file containing behavioural/skill features, relative marker times, and sanitised teacher decisions. It checks every pupil represented in the selected scope; all must have `recorded separately` status and model-development use approved. It excludes names, aliases, notes, images, photo and selected-response labels, exact dates/times, prompt wording, raw coordinates, governance references, and review dates. It is pseudonymised rather than anonymous, so use it only under the school's approved research and data-governance process.

The V1.8 research view is descriptive. It does not diagnose a learner, establish durable transfer, prove neural plasticity, or call an external AI service.

---

## 3. Opening the Application

ChoiceTrain can be opened in two main ways:

### Recommended

Use the hosted GitHub Pages version:

`https://dioncroft.github.io/choice_train/`

### Local

Open the local `index.html` file in a modern browser.

Recommended browsers:

- Chrome
- Edge
- Firefox
- Safari (latest available)
- Android Chrome

Older iPads and Kindle-based devices may work more reliably with the hosted GitHub Pages version than with direct `file://` opening.

---

## 4. Teacher Panel and Admin Panel

At the top of the workspace you will see two buttons:

- `Teacher workspace`
- `Admin & research`

Use these to switch between the two panel groups.

### Teacher Panel

This is the default workspace for normal classroom use. Use `Today`, `Personalise`, and `Results` to move between daily setup, pupil content, and classroom summaries. The Today page includes expandable instructions for a pupil's first session and each later session.

### Admin Panel

Select `Admin & research`, then use:

- `Overview` for export and the current analytics summary
- `Research` in the V1.8 alpha for longitudinal visualisation and data-quality review
- `Sessions` for stored history and session exports
- `Learners` for profile, prompt, and fidelity records
- `EEG` for research blocks, markers, and EEG exports
- `System` for advanced settings, debug controls, documentation, and build information

### During Learner Mode

If the app is currently showing the learner activity, press and hold the small lock control for about 1.2 seconds to return to the teacher workspace. A normal tap does not exit. Keyboard activation remains immediate for staff using keyboard access.

---

## 5. Creating a Pupil

1. Open `Teacher workspace`, then select `Today`.
2. In `Daily Teacher Setup`, enter a pupil name or alias.
3. Select `Add Pupil`.
4. Choose the pupil from the pupil selector.

Pupil profiles are stored locally on the device.

Each pupil can retain:

- current level
- theme preference
- uploaded personalised photos
- session history
- recent performance context

No password is required.

---

## 6. Uploading Personalised Content

ChoiceTrain supports multiple personalised photos per pupil.

Examples include:

- Mum
- Dad
- Teacher
- favourite toy
- favourite food
- favourite animal
- classroom object
- preferred activity

Each uploaded item can include:

- a label
- a category
- a source label: `Personalised` or `Stock`
- an optional relationship or type
- use in question generation
- non-destructive crop and rotation settings

This helps make tasks more familiar, motivating, and meaningful.

### Category Catalogue

The built-in catalogue includes Family, People, Animals, Transport, Food, Fruit, Symbols / Shapes, Toys, Classroom objects, Activities, and retained legacy Custom content.

To add a category:

1. Open `Pupil Personalisation`.
2. Enter a clear name under `Create new category`.
3. Select `Save category`.
4. The new category is immediately available for uploads, reassignment, and supported session filters.

Blank names and duplicates that differ only by capitalisation or spacing are rejected.

### Bulk Import and Reassignment

1. Select the pupil before starting the import.
2. Choose a `Destination category`.
3. Select up to 100 images under `Bulk photo import`.
4. Review the completion summary. A failed file does not discard the valid files in the same batch.
5. Select one or more photo cards, choose a category under `Manage selected photos`, and select `Move selected`.

Each file can be up to 12 MB. ChoiceTrain also rejects decoded images over 40 megapixels to protect classroom-device performance. Image preparation remains local to the device.

### Crop and Rotation

ChoiceTrain shows the full proportional image by default rather than filling the square by cutting off the edges.

1. Select `Crop / rotate` on a photo card.
2. Optionally enable `Square crop` and adjust zoom and horizontal or vertical focus.
3. Choose a 0, 90, 180, or 270 degree rotation.
4. Select `Apply` to save the framing, `Cancel` to leave the existing edit unchanged, or `Reset` to return the editor controls to the full-image view before applying.

The prepared original is retained locally so later edits are generated from that source rather than repeatedly recompressing the last crop. Older images can only use the earliest asset still retained by the browser.

---

## 7. Context Notes

Context Notes allow teachers to record useful daily classroom observations.

Examples:

- tired today
- excited after break
- calm and engaged
- needed extra adult support
- noisy classroom
- easily distracted today

Context Notes are:

- intended for normal teacher use
- stored locally
- included in exports
- hidden from pupils in learner mode

ChoiceTrain avoids medical or diagnostic wording here. These notes are for classroom context, not clinical interpretation.

---

## 8. Running a Session

### First Session With a Pupil

1. Add or select the pupil and use an alias where appropriate.
2. Choose the starting level, task, question count, and session length.
3. Choose prompt, speech, reward, and timing options that suit the pupil.
4. Add familiar photos and a short context note if useful.
5. Press `Start session`, then hand over or turn the screen towards the pupil.

### Each Later Session

1. Select the pupil and check the saved level and task description.
2. Review today's context, timing, prompts, and reward settings.
3. Press `Start session`.
4. At the end, review the basic results and download the session if required.

Settings save locally as they are changed. `Save pupil preferences` also applies the selected prompt style to the text, image, and speech controls and displays a save confirmation.

`Reset session` clears the current unsaved attempt and returns to the welcome screen. It keeps the pupil profile, saved settings, and stored session history.

After a response, `Auto advance` can move to the next task automatically. If auto advance is off, use `Next` or `Repeat`. Those controls stay available when the reward screen is disabled; the learner sees concise feedback rather than a star celebration.

### Optional Blank Screen

Turn on `Show blank screen` to add a calm pause after feedback and before the next question. Set `Blank duration` between 0.25 and 10 seconds. This is off by default and the selected timing is included in the session export.

---

## 9. Student-Friendly Mode

Student-friendly mode is designed to keep the learner experience calm and uncluttered.

When enabled, it hides:

- debug information
- context-note editing
- analytics
- admin settings
- EEG and research labels
- technical build information

The learner sees only:

- the prompt
- the images or choices
- rewards and progress feedback
- calm navigation

This mode is enabled by default for new users, but teachers can switch it off. ChoiceTrain keeps the teacher's selected state when learner mode opens.

---

## 10. Learner Pathway

The current staged pathway is:

- `Level 1` - touch screen
- `Level 2` - touch object
- `Level 3` - moving target
- `Level 4` - find object
- `Level 5` - discriminate object
- `Level 6` - find category
- `Level 7` - sustained attention
- `Level 8` - selective-spatial attention
- `Level 9` - orienting attention
- `Level 10` - executive attention

The earlier levels focus on touch confidence and basic target finding. The later levels introduce more structured Attention Training (AT).

---

## 11. Task Types

ChoiceTrain supports several activity types.

### Single Target

The learner finds one large target.

Example:

`Find Mum`

### Multi-Choice

The learner chooses the correct item from several options.

Example:

`Can you find the apple?`

### Category Recognition

The learner identifies an object that belongs to a category.

Example:

`Which one is an animal?`

### Preference Tasks

The learner makes a simple personal choice.

Example:

`Which one do you like?`

### Attention Training Activities

The learner completes structured sustained, selective-spatial, orienting, or executive attention tasks through game-like variants.

The AT structure is informed by peer-reviewed CPAT literature. The application does not claim to be the published CPAT programme or a diagnostic tool.

### Object and Category Filters

When `Find object`, `Discriminate object`, or `Choice preference` is selected, choose one or more session categories and one source mode: Personalised only, Stock only, or Both. ChoiceTrain requires at least two differently labelled eligible items and shows a usable-item summary before the session starts.

When `Find category` is selected, use the equivalent controls. At least two selected categories must still contain eligible items after the source and pupil filters are applied, and they must support fair single-answer questions.

Personalised content always belongs to the selected pupil and must be enabled for question generation. Excluded stock, another pupil's photos, duplicate fillers, and unrelated fallback items are not added to make up the grid.

Family items also count as People, and Fruit items also count as Food. The generator avoids using an overlapping distractor when it would also be a correct answer.

`Discriminate object` asks the learner to choose one named item from two options. It prefers another eligible item in the same category, but does not yet guarantee visual similarity or an attribute-matched contrast. The export records whether the actual contrast was within-category or cross-category.

`Choice preference` presents two to four eligible configured items. Any selection is accepted. The selected option is retained, but the trial is marked as open-ended and unscored, and target-distance measures are left missing because there is no correct target.

---

## 12. Procedural Prompt Generation

ChoiceTrain varies prompt wording to reduce repetition while keeping the same learning goal.

Examples:

- `Find Mum`
- `Can you find Mum?`
- `Where is Mum?`
- `Show me Mum`
- `Let's find Mum`

Category and preference prompts also vary in similar ways.

The prompt generator is designed so that:

- prompts stay simple and classroom-friendly
- the correct target is always included
- wording avoids older mechanical phrasing such as `Touch Mum`

---

## 13. Text-to-Speech

ChoiceTrain can read prompts and feedback aloud for learners who benefit from audio support.

Examples:

- `Find Mum`
- `Well done`
- `Good try`

Teachers can enable or disable speech from the Teacher Panel.

If browser speech support is unavailable, the app should continue working without it.

---

## 14. Colour Themes

The current theme options are:

- Calm Light (`V1.7.0` default)
- Calm Blue
- Soft Green
- Warm Neutral
- High Contrast
- Low Stimulation Dark
- Light Classroom
- Plain White

Themes are intended as configurable classroom presentation options. Teachers should choose whichever theme works best for the learner and setting.

Theme choice is stored locally and may also follow the selected pupil profile on that device.

In V1.7.0, every theme controls the full learner activity, including prompts, cards, choices, feedback, rewards, footer controls, cue effects, heatmaps, and charts. Correct and incorrect responses also use check/cross cues; progress and selection use labels, borders, shapes, or position as well as colour.

### Alpha Display and Sensory Preferences

V1.7.0 adds:

- high-legibility or familiar sans-serif font
- 90%, 100%, 115% or 130% text size
- reduced, gentle or full motion
- off, low or standard feedback sounds
- quiet, gentle or lively celebrations

These are individual access and presentation choices. A setting should be tried with the learner and adjusted when it causes distraction, discomfort or reduced task understanding. No font, colour, sound or animation is described as universally SEND-friendly.

Atkinson Hyperlegible Next is bundled locally as the high-legibility option. It was designed to make letters more distinguishable for low-vision readers, but ChoiceTrain does not claim that it treats dyslexia or improves every learner's reading.

### Reward and Sound

V1.7.0 uses an original train journey to show progress through the session. It applies general short-feedback and visible-progress principles without copying another product's artwork, characters, sounds or language.

Feedback cues are generated locally on the device. They can be muted, do not use a microphone and are not recordings. ChoiceTrain stops active tones before speaking a prompt to reduce overlap. In a research session, audio and reward onset are logged so presentation conditions can be interpreted.

---

## 15. Analytics and Touch Data

ChoiceTrain can collect:

- reaction time
- accuracy
- target position
- touch position
- touch distance
- prompt wording
- session duration
- level and task type
- theme used
- context notes
- pupil alias

If enabled, the app can also support:

- heatmaps
- omission and commission tracking
- advanced attention-family summaries
- structured research markers

---

## 16. Heatmaps

Heatmaps provide a visual view of touch behaviour.

They help show:

- where the target was
- where touches landed
- how close touches were to the intended target
- whether patterns change over time

This can be useful for both classroom reflection and research review.

---

## 17. Session Export

Sessions can be exported from the Teacher Panel.

Files use a school-friendly naming format such as:

```text
ChoiceTrain_John_2026-06-05_1430_session.json
```

Exports may include:

- pupil alias
- date and time
- level
- task type
- accuracy
- reaction time
- touch distance
- context notes
- theme used
- student-friendly mode state
- prompt wording used
- photo labels used
- support level if present
- build version

The app is designed to keep data local-first unless a school chooses to manage exported files separately.

---

## 18. Research and EEG Support

ChoiceTrain includes an optional research mode for structured data collection.

Depending on settings, this can include:

- event markers
- omission and commission logging
- heatmap-ready touch data
- artifact and data-quality notes
- advanced export fields

For a planned EEG session in V1.8, Admin staff can record the study/protocol ID, visit, run number, acquisition-system label, declared synchronisation method, and technical clock/latency notes. Use identifiers that do not contain pupil names. These values are frozen when the learner session starts.

Use the Research destination after a session to check marker completeness, event ordering, response-timing differences, and protocol metadata. A complete software record is useful for audit, but it does not replace LSL/device triggers, measured end-to-end latency, cap/signal checks, or the research team's artifact-cleaning procedure.

The app currently supports **research preparation and export**, not direct clinical or diagnostic interpretation.

Future EEG integration may build on these exported markers and structured event timings.

---

## 19. Local Data Storage

ChoiceTrain stores data locally in the browser on the current device.

This can include:

- pupil profiles
- session history
- uploaded images
- theme preferences
- context notes
- recent settings

If browser data is cleared, locally stored ChoiceTrain information may also be removed.

---

## 20. Future Development

Planned or discussed future directions include:

- deeper EEG synchronisation
- longitudinal reporting
- LLM-assisted session recommendations
- richer school dashboards
- more AT variants that preserve the research-informed attention rules
- stronger cross-session teacher summaries

Any future recommendation layer should remain subject to consent, safeguarding, and data governance.

---

## 21. Troubleshooting

### The app does not load properly

Use the hosted GitHub Pages version if possible:

`https://dioncroft.github.io/choice_train/`

### I cannot find the Admin Panel

Use `Teacher workspace` and `Admin & research` at the top of the workspace.

If you are currently in learner mode, press and hold the small lock control for about 1.2 seconds to return to the teacher workspace.

Choose Overview, Sessions, Learners, EEG, or System in stable V1.7. The V1.8 alpha also includes Research. Advanced settings, debug controls, documentation, and build metadata are under `System`.

### Speech does not work

Check:

- speech is enabled
- the browser supports Web Speech
- device audio is available

### Pupil profiles seem to be missing

Profiles are stored locally on the current device. Clearing browser storage can remove them.

---

## 22. Educational and Research Use

ChoiceTrain is intended to support educational practice and research-linked classroom work by combining teacher judgement with structured digital measures.

It is designed to help staff review:

- engagement
- accuracy
- touch behaviour
- progression
- attention-style task performance

ChoiceTrain should always be used alongside professional educational judgement. It is not intended to diagnose medical, developmental, or psychiatric conditions.

---

## 23. Related Documentation

- [README.md](../README.md)
- [RESEARCH_EVIDENCE.md](RESEARCH_EVIDENCE.md)
- [SCHOOL_READINESS_AUDIT.md](SCHOOL_READINESS_AUDIT.md)
- [DATA_AND_PRIVACY.md](DATA_AND_PRIVACY.md)
- [V1.7.0_ALPHA_DESIGN_DECISIONS.md](V1.7.0_ALPHA_DESIGN_DECISIONS.md)
- [V1.7.0_COLOUR_SYSTEM_AUDIT.md](V1.7.0_COLOUR_SYSTEM_AUDIT.md)
- [DATA_DICTIONARY.md](DATA_DICTIONARY.md)
- [V1.7.0_USABILITY_TEST_PLAN.md](V1.7.0_USABILITY_TEST_PLAN.md)
- [CHANGELOG.md](../CHANGELOG.md)

---

**Developed for ShowMe**  
Supporting personalised learning through accessible technology.
