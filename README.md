# ChoiceTrain for ShowMe

[![Browser tests](https://github.com/DionCroft/choice_train/actions/workflows/ci.yml/badge.svg)](https://github.com/DionCroft/choice_train/actions/workflows/ci.yml)
[![GitHub Pages](https://github.com/DionCroft/choice_train/actions/workflows/pages.yml/badge.svg)](https://github.com/DionCroft/choice_train/actions/workflows/pages.yml)

**[Live application](https://dioncroft.github.io/choice_train/)** | **[User guide](docs/USER_GUIDE.md)** | **[Ethics scope](docs/ETHICS_AND_RESEARCH_SCOPE.md)** | **[Data governance plan](docs/DATA_GOVERNANCE_PLAN.md)** | **[Technical data flow](docs/DATA_FLOW_MAP.md)** | **[V1.8 research plan](docs/V1.8.0_RESEARCH_PERSONALISATION_PLAN.md)** | **[Adaptive layout contract](docs/V1.8.0_ADAPTIVE_LAYOUT_CONTRACT.md)** | **[V1.8 release readiness](docs/V1.8.0_RELEASE_READINESS.md)** | **[External validation protocol](docs/V1.8.0_EXTERNAL_VALIDATION_PROTOCOL.md)** | **[Promotion evidence](docs/V1.8.0_PROMOTION_EVIDENCE.md)** | **[Research evidence](docs/RESEARCH_EVIDENCE.md)** | **[Data and privacy](docs/DATA_AND_PRIVACY.md)** | **[Release history](CHANGELOG.md)**

ChoiceTrain is a static, browser-based learning and research-support tool designed for SEND classrooms. It combines touch-first learner activities, teacher-friendly session setup, personalised pupil content, and research-ready session logging in a single offline-friendly web app.

## V1.8 Development Preview

The alpha now includes opt-in fixed-condition manifests for research delivery. Admin staff can save a non-identifying condition ID with a required replay seed, reapply the saved task/timing/prompt/content/block controls, and block Start when those controls drift. The frozen manifest and adherence state are exported and visualised in Research. Explicitly protocol-relevant speech, target-scale, touch-scaling, and learner-view controls are included; identity, notes, theme, font, communication mode, and motor-access profile remain outside the manifest. This is a software-settings check, not proof of preregistration, allocation, blinding, protocol approval, treatment equivalence, or EEG hardware synchronisation.

Stable `V1.7.0` remains the live GitHub Pages application. Development continues separately on `feature/v1.8.0-research-personalisation` in `choice_train_V1.8.0-alpha.html`; the alpha is not loaded by `index.html`.

The current alpha adds schema-versioned skill data, reproducible seeded lesson generation, and a dedicated local-only `Research` destination. Generator `1.7.0` and skill graph `1.4.0` cover named-object, category, cue-match, group-completion, category-difference, teacher-declared colour, teacher-declared discrimination sets, and open-ended preference lessons. `Find by colour` uses only controlled practitioner labels on personalised content, keeps alternatives in the same primary category, and includes exactly one matching answer. For Level 5, a teacher may optionally give two or more personalised items in the same category the same local discrimination-set code; ChoiceTrain then prioritises that two-item contrast and otherwise retains the same-category/cross-category fallback. ChoiceTrain does not analyse image pixels or claim that either label proves colour perception or visual similarity. Data schema 8 freezes lesson/question seeds, category, attribute, and discrimination constraints, support, outcomes, timing, touch, and delivery context for audit and replay. Research can visualise current-session, current-learner, or all-learner accuracy, independence, reaction time, omissions/commissions, touch behaviour, skills, category-by-skill state, practice status, retention, support fading, dosage, fidelity, session context, access settings, content/category/attribute/discrimination exposure, teacher decisions and explicitly linked plan use, transfer observations, artifacts, browser EEG-marker quality, future AI dataset composition, and versioned trial-recording completeness. The completeness view separates final trials from retained repeat attempts and reports observed-versus-expected timing, touch, support, prompt, provenance, option, outcome, and session fields. It does not score validity, consent, representativeness, or research usability. A scope-selectable touch map normalises each plotted target and response using that trial's recorded play-area dimensions, and distinguishes outcomes by shape as well as colour; it remains interface geometry rather than a motor, visual-field, attention, or diagnostic measure. The AI-composition view shows session depth, longitudinal representation, skill and condition coverage, outcome/support balance, teacher-review coverage, and local governance eligibility. It never scores model readiness or performs training or data splitting. Every Research canvas is explicitly linked to a readable table or text equivalent, missing values remain missing, pooled learner sequences avoid false trajectories, and all interpretations remain descriptive rather than diagnostic, causal, or evidence of neural change.

The task-demand panel makes displayed options, distractors, moving-target exposure, target size, adaptive hit radius, response window, and two-stage prompting visible alongside outcomes. A separate delivery-context view records the usable browser area, width band, orientation, pointer/touch capability, fullscreen state, and observed input types at session boundaries. These are delivered conditions rather than learner traits; pixel geometry remains device and layout dependent. Learner session context deliberately excludes raw user-agent, platform identifiers, device identifiers, and device-pixel ratio.

V1.8 treats adaptive browser layout as a product requirement. The learner workspace uses the browser's live usable visual height, dynamic-viewport fallbacks, notch-aware safe-area insets, compact landscape composition, fit-aware targets, and wrapping personalised labels; an active question is laid out again after rotation or usable-viewport changes without restarting its response timer or emitting duplicate research markers. Every small-screen learner-stage rule keeps using the same live visual height, preventing a later `dvh` override from placing the stage below the usable browser area. At 900 CSS pixels or less, the Teacher workspace shows setup only until staff explicitly select Start or Preview, then gives the learner the full usable viewport rather than stacking a second activity canvas below a long form. Teacher and Admin workspaces prevent page-level horizontal overflow, retain compact navigation and scalable form controls at 130% in-app text, constrain the photo editor to the usable viewport, and keep wide Research tables inside independently scrolling cards. Automated checks cover 320 x 568 and 360 x 480 small-phone portrait plus 568 x 320 small-phone landscape with six choices at 130% text, representative phone, Kindle-sized tablet, short laptop, live rotation and live visual-height reduction, phone-sized Research, mobile photo editing, and narrow enlarged-text staff views. The [adaptive layout contract](docs/V1.8.0_ADAPTIVE_LAYOUT_CONTRACT.md) defines the tested ranges. These checks are regression evidence only: intended Windows touchscreens, iPads, Android devices, Kindles, browser zoom, virtual keyboards, assistive access, and real school configurations still require physical review.

The V1.8 Admin `System` destination also provides a local Device readiness check and a schema-locked `1.0.0` JSON report. It records the current usable viewport, orientation, safe-area insets, reported pointer/touch capabilities, local storage support, accessibility media preferences, and visible control measurements. The report contains no pupil or session fields and is not transmitted by ChoiceTrain. It supports a school's physical-device record but does not approve a device, access method, browser, or classroom workflow.

Retention planning is configurable from 1 to 365 days, with seven days retained as the backward-compatible default. Research shows the configured interval, skills due now, skills not yet due, and observed spaced comparisons through cards, a chart, and a readable per-skill schedule. New sessions freeze the selected interval, and recommendation contract `1.5.0` uses that same value when proposing a delayed check. This is a transparent scheduling and observed-comparison aid, not a universal spacing prescription or evidence of mastery, memory change, transfer, or neural plasticity.

Category-skill state contract `1.0.0` combines teacher-defined category metadata with versioned skills. Research summary contract `2.3.0` adds privacy-minimised delivery context to the existing discrimination profile, visual accuracy matrix, and complete category-skill table. The discrimination view separates teacher-declared sets, same-category fallbacks, and cross-category fallbacks, and reports delivered trials, breadth, accuracy, independence, omissions, reaction time, and independently recalculated generator integrity. Recommendation contract `1.5.0` can use category-skill observations to suggest one category focus when the proposed task and current content can generate a valid activity. The teacher must approve, change, remove, or decline that focus; an approved focus is frozen for one session without changing the pupil's saved category preferences. Single-learner status requires repeated observations; all-learner scope reports pooled coverage and deliberately suppresses recent-window trajectories. These rows and suggestions support teacher review, but they are not mastery, diagnosis, visual-similarity validation, generalisation, causal, or neural-change measures.

V1.8 also offers a separate pseudonymised research/model-development export. It keeps relative behavioural, skill, support, teacher-decision, and browser-marker features while excluding pupil names and aliases, free text, image data, photo labels, exact session timestamps, prompt wording, source session IDs, and raw touch coordinates. EEG diagnostic summaries are recomputed from the raw in-scope records and copied through a schema-locked allowlist rather than trusting stored diagnostic extensions. This export is denied by default and remains blocked unless every pupil profile in the selected scope has a current local declaration that authority is recorded separately and model-development use is approved; a withdrawn or classroom-only profile blocks the export. ChoiceTrain stores the declaration, not the consent or other authority evidence. Pseudonymised does not mean anonymous: schools must still apply lawful-basis or consent controls, access, retention, safeguarding, and data governance.

Model dataset contract `1.4.0` includes the versioned retention interval, minimum comparison sample, sanitised category-focus provenance, a closed human-observation context, and an explicit invariant that every represented profile has a current purpose-specific authority review. Built-in categories retain a controlled code; teacher-created or legacy categories become generic `custom` records, and their labels are excluded. The observation context contains only confirmed 1-5 ratings, controlled maintenance/generalisation states, and a Boolean saying whether a transfer note exists. It does not add names, notes, exact dates, source-session IDs, or recommendation identifiers.

Teacher ratings now require an explicit `Ratings deliberately recorded` confirmation. The visible `3/5` values are placeholders until confirmed and are otherwise exported and visualised as missing. Recommendation `1.5.0` freezes the latest available confirmed human-observation context for teacher review, but `automatic_decision_influence` is always `false`: ratings, maintenance, generalisation, and transfer-note presence do not rank or select the deterministic proposal.

The Research toolbar also provides a local `Download scope summary` report for staff and authorised analysts. Version 2.3.0 mirrors the selected scope's derived coverage, session performance/timing, delivered task demands, privacy-minimised delivery context, fixed-condition adherence, skill and category-by-skill state, configurable retention schedule, Attention Training family, support, object-discrimination contrast basis, category matching, group completion, category difference, teacher-declared colour selection, category-by-task lesson coverage, trial-recording completeness, future-model dataset composition, context, EEG-readiness, teacher decisions, controlled human-observation context, and category-focused plan use. The aggregate model-composition block omits aliases and records that any future development/validation/test split must be participant-separated; ChoiceTrain does not create such a split. The wider scope report includes configured learner aliases, configured category labels, day-level dates, and coarse browser-area/access context but excludes raw trials/events, coordinates, images, photo labels, discrimination-set names, free-text notes, user-agent strings, platform identifiers, device identifiers, and device-pixel ratio. Core trial, Research-summary, data-quality, and privacy-minimised dataset contracts are published as local JSON Schema 2020-12 files under `schemas/` and checked against runtime versions, task/skill enums, recording flags, privacy invariants, and split-policy safeguards in CI. This report is not the more restricted model-development dataset and is never uploaded automatically.

The current stable release is `V1.7.0`. Historical versioned builds and the reviewed V1.7 alpha candidate remain available for traceability.

`V1.7.0` promotes the reviewed product-experience candidate into the GitHub Pages entry point. It introduces focused teacher, learner, and admin/research workspaces; one semantic colour system across staff and learner views; configurable presentation and sensory preferences; an original train-journey reward; and locally generated feedback sounds. See the [design decision record](docs/V1.7.0_ALPHA_DESIGN_DECISIONS.md), [colour-system audit](docs/V1.7.0_COLOUR_SYSTEM_AUDIT.md), [data dictionary](docs/DATA_DICTIONARY.md), and [school usability plan](docs/V1.7.0_USABILITY_TEST_PLAN.md). Promotion confirms the engineering release gate, not clinical efficacy or universal suitability for SEND learners.

Live site:
`https://dioncroft.github.io/choice_train/`

User guide:
[docs/USER_GUIDE.md](docs/USER_GUIDE.md)

School-readiness audit:
[docs/SCHOOL_READINESS_AUDIT.md](docs/SCHOOL_READINESS_AUDIT.md)

## What ChoiceTrain Is

ChoiceTrain is designed to help pupils practise:

- early touch confidence
- finding and recognising familiar people or objects
- object discrimination and category recognition
- structured choice making
- Attention Training (AT) activities across sustained, selective-spatial, orienting, and executive attention families

It is built as a static HTML, CSS, and JavaScript application so it can run on school devices without requiring cloud services.

## For Schools

ChoiceTrain is currently a teaching and research-support tool. It is not a diagnostic, medical, or clinical system.

The app can support structured classroom activities, teacher observation, and research-linked data collection, but practitioner judgement and school safeguarding processes still sit around its use.

Pupil data stays in the current browser unless a user deliberately downloads an export. Schools should review [the data and privacy notes](docs/DATA_AND_PRIVACY.md) before adding identifiable profiles or photographs.

The project owner has confirmed full university ethics approval for the currently approved non-EEG research. Approval documents and participant records remain outside this public repository, and the exact approved protocol still governs what may be collected. EEG acquisition is not currently active, and future model training is not performed by ChoiceTrain. See the [ethics and research scope](docs/ETHICS_AND_RESEARCH_SCOPE.md), [operational data-governance plan](docs/DATA_GOVERNANCE_PLAN.md), and [technical data-flow map](docs/DATA_FLOW_MAP.md).

The pupil-data-free [machine-readable data inventory](governance/data-inventory-v1.json) locks the current storage keys, collected data classes, export sensitivity, deletion boundary, and no-automatic-transmission guarantees to automated contract tests.

## Research Evidence

A dedicated peer-reviewed evidence list is available in [docs/RESEARCH_EVIDENCE.md](docs/RESEARCH_EVIDENCE.md).

That file groups the papers used to justify major ChoiceTrain feature areas, including:

- Attention Training design, informed by the published CPAT literature
- teacher fidelity and classroom workflow
- touch-first prompting
- learner choice and self-determination
- personalisation and preference-led support
- gamification decisions
- EEG and research-mode planning

It also notes the client-provided internal `ChoiceTrain.docx` project paper draft as useful background context, while keeping it clearly separate from the peer-reviewed evidence base.

## Current Release

Published files:

- `index.html`
- `choice_train_V1.7.0.html`
- `choice_train_V1.7.0.js`
- `choice_train_V1.7.0.css`
- `assets/showme-logo.png`

The runtime is versioned so experimental builds can be tested locally before a stable snapshot is promoted into the GitHub Pages copy.

### V1.7.0 Stable Release

The published versioned release is available locally at:

- `choice_train_V1.7.0.html`
- `choice_train_V1.7.0.js`
- `choice_train_V1.7.0.css`

Its main product decisions are:

- a focused `Today`, `Personalise`, and `Results` teacher workflow
- a separate full-width admin/research workspace with direct navigation and a local export centre
- focused Admin destinations that reveal only the controls relevant to Overview, Sessions, Learners, EEG, or System
- a distraction-reduced learner viewport with a deliberate press-and-hold teacher return
- a semantic product palette and complete learner-theme contract covering components, focus, outcomes, rewards, overlays, charts, heatmaps, and runtime-drawn effects
- locally bundled Atkinson Hyperlegible Next as one configurable high-legibility option, not a universal SEND or dyslexia treatment
- per-pupil text size, font, motion, sound, and celebration preferences
- original train-progress feedback and locally synthesised audio cues, with quiet and off settings
- retained local-first storage, Attention Training, touch logging, heatmaps, EEG markers, pupil profiles, exports, and personalisation

These decisions remain subject to school testing and are not claims that one visual or sensory configuration suits every learner. Automated regression, accessibility-token, local-only runtime, and responsive-layout gates passed before promotion. Staff usability, learner observation, physical-device, assistive-technology, privacy, and EEG timing validation remain ongoing.

## Teacher Panel and Admin Panel

`V1.7.0` separates the interface into focused Teacher and Admin workspaces and keeps ordinary classroom settings away from research and debug controls.

### Teacher Panel

The Teacher Panel is intended for everyday classroom use. It focuses on the controls a teacher or TA needs to run a session quickly:

- select pupil
- add pupil
- start session
- reset session
- export or download session
- current level
- live level and task description
- session length
- number of questions
- maximum answer options
- manual task selection
- prompt delay, question window, and inter-trial interval
- two-stage, text, image, reward, selected-label speech, and auto-advance options
- optional blank screen between the question and answer choices
- context notes
- theme selection
- student-friendly mode
- speech on or off
- basic photo upload and pupil personalisation

### Admin Panel

The Admin Panel is collapsed by default and keeps advanced options out of the way during normal use. It includes:

- touch debug
- live trail
- EEG and research mode
- detailed analytics
- Attention Training settings
- auto level path
- touch scale
- advanced export and debug tools
- build and version metadata
- research and fidelity settings

This split is intended to make the app usable in real classrooms without asking teachers to work through technical settings every time. Admin is a full-width workspace with focused `Overview`, `Sessions`, `Learners`, `EEG`, and `System` destinations rather than one very long mixed settings page.

How to open it:

- use `Teacher workspace` and `Admin & research` at the top of the panel
- use `Today`, `Personalise`, and `Results` for focused teacher workflows
- use `Overview`, `Sessions`, `Learners`, `EEG`, and `System` inside Admin
- in learner mode, press and hold the small lock control for about 1.2 seconds to return to the teacher workspace; keyboard activation is immediate

## Teacher Quick Start

The application now includes short in-app checklists for a pupil's first session and each later session. The intended daily flow is:

1. Select the pupil and check the saved level and task description.
2. Review the question count, session length, prompts, timing, speech, reward, and context note.
3. Select `Start session` and present the learner activity.
4. Review the basic results and download the session if required.

Settings save locally as they are changed. `Save pupil preferences` additionally applies the chosen prompt style to the visible text, image, and speech settings and provides an on-screen confirmation.

`Reset session` clears only the current unsaved attempt and returns to the welcome screen. It does not delete the pupil profile, saved settings, or stored session history.

### V1.7.0 Content Walkthrough

1. In `Pupil Personalisation`, enter a name under `Create new category`, then select `Save category`.
2. Choose that category under `Destination category` and use `Bulk photo import` to add one or more images.
3. Select photo cards, choose another category under `Manage selected photos`, and select `Move selected` when reassignment is needed.
4. Select `Crop / rotate` on one photo. Adjust square crop, focus, zoom, or rotation, then select `Apply`. `Cancel` leaves the stored edit unchanged and `Reset` restores the editor controls before applying.
5. Choose `Find object`, `Discriminate object`, or `Choice preference`; select one or more categories and a source mode; check the usable-item summary; then start the session.
6. Choose `Find category`, select at least two categories with eligible content, check that the summary reports fair question categories, then start the session.
7. Choose `Plain White` from the theme selector for a quiet white activity surface.

## Optional Blank Interval

Teachers can enable a calm blank screen between the displayed question and its answer choices, then set its duration from 0.25 to 10 seconds. Enabling it automatically uses the question-first stage: the prompt is shown for the configured prompt delay, the blank pause follows, and then the answer choices appear. It is off by default, its position and timing are recorded in the event log, and both are included in session exports so staff and researchers can interpret the pacing used.

## Student-Friendly Mode

Student-friendly mode is enabled by default for new users. Teachers can switch it off when the additional task labels are useful; the selected state is now respected when learner mode opens and persists locally.

When it is on, the app hides:

- debug text
- context-note editing
- technical labels
- analytics blocks
- admin settings
- EEG and research text
- build and debug status

The learner sees a simpler activity surface with:

- the prompt
- target images or choices
- progress feedback
- calm navigation

This mode is designed to work well on touchscreens and tablets.

## Collapsible Classroom Workflow

The side panel is organised into collapsible sections:

- Daily Teacher Setup
- Pupil Personalisation
- Session Controls
- Context Notes
- Basic Results
- Advanced Admin Settings
- Research / Debug Settings

The default view is intentionally calmer and more teacher-friendly than earlier builds.

## Context Notes

`V1.7.0` retains the classroom-friendly `context notes` wording introduced in the previous release.

Context notes are for daily classroom observations such as:

- learner mood
- attention on the day
- sensory environment
- tiredness
- support used
- regulation or engagement notes

These notes are part of normal teacher use, are stored locally with the session context, and are included in exported session data.

## Pupil Profiles

Each pupil profile can store:

- name and alias
- level progress
- preferred theme
- communication support preference
- reward preference
- prompt and support context
- personalised photo library
- selected familiar face or quick image content

Pupil data is kept locally on the device using browser storage.

## Photo Personalisation

Teachers can upload and manage multiple personalised photos for a pupil. Examples include:

- Mum
- Dad
- Teacher
- favourite toy
- favourite food
- favourite animal
- classroom object
- preferred activity

Each photo supports:

- label
- category
- source (`Stock` or `Personalised`)
- optional relationship or type
- optional controlled teacher-declared colour
- inclusion in question generation
- non-destructive square crop, focus, zoom, and rotation settings

The category catalogue includes Family, People, Animals, Transport, Food, Fruit, Symbols / Shapes, Toys, Classroom objects, Activities, and retained legacy Custom content. Teachers can create additional categories; blank and duplicate names are rejected.

Individual and bulk imports use a teacher-selected destination category. A batch can contain up to 100 files, with a 12 MB per-file limit and a 40-megapixel decoded-image safeguard. Supported formats are JPEG, PNG, WebP, GIF, and SVG. Files are prepared locally, and a failed file does not discard valid files in the same batch.

The photo library supports editable labels, categories, source metadata, optional colour declarations, question inclusion, individual crop/rotation, and multi-photo category reassignment. Full images use proportional `contain` framing by default to avoid cutting off portrait or landscape subjects. The declaration can enable deterministic `Find by colour` practice when enough differently labelled items exist in one primary category; it is practitioner metadata, not computer-vision analysis or evidence that the learner perceives the colour in a particular way.

The app uses the label during question generation and export. The exported session payload keeps photo label metadata by default rather than forcing large base64 image data into every file.

If a school wants to replace the placeholder ShowMe branding image, put the real logo in:

- `assets/showme-logo.png`

or replace it with a final approved logo file while keeping accessible alt text such as `ShowMe logo`.

## Themes

ChoiceTrain provides a teacher-facing theme selector with the following preset options:

- Calm Light (`V1.7.0` default)
- Calm Blue
- Soft Green
- Warm Neutral
- High Contrast
- Low Stimulation Dark
- Light Classroom
- Plain White

Themes are implemented through CSS variables and can change:

- background
- panel background
- text
- muted text
- buttons
- accent colour
- success colour
- warning colour
- error colour
- card background

In `V1.7.0`, each learner theme supplies the same semantic roles for canvas, surfaces, text, controls, primary actions, focus, success, warning, errors, rewards, overlays, and task-stimulus colours. Teacher/Admin components use a separate but equivalent product-shell token set. Runtime effects such as cue rings, pointer trails, heatmaps, and charts read the active tokens instead of introducing a second fixed palette.

Correct, incorrect, selected, current, and completed states use a symbol, wording, shape, or border treatment as well as colour. This helps preserve meaning when hue is difficult to distinguish.

Theme choice is stored locally and can also follow the selected pupil context.

Important:
theme choices are configurable classroom presentation options. They should be validated with learners and practitioners during school trials rather than treated as universally optimal.

## Prompt Wording and Procedural Variation

The learner-facing wording uses warmer, more natural prompts such as:

- `Find Mum`
- `Can you find Mum?`
- `Where is Mum?`
- `Show me Mum`
- `Let's find Mum`

Category and preference prompts are also varied so the activity is less repetitive while keeping the same learning target.

The app is designed so that the correct target is still included in the generated options.

## Teacher-Facing Helper Text

The teacher-facing settings now include short plain-English explanations for common controls such as:

- session length
- number of questions
- speech on or off
- student-friendly mode
- context notes
- auto level path

The aim is to make daily use clearer without requiring technical knowledge.

## Learner Pathway and Attention Training

The current build keeps the structured developmental pathway:

- Level 1: touch screen
- Level 2: touch object
- Level 3: moving target
- Level 4: find object
- Level 5: discriminate object
- Level 6: find category
- Level 7: sustained attention
- Level 8: selective-spatial attention
- Level 9: orienting attention
- Level 10: executive attention

Levels 7 to 10 are labelled Attention Training (AT) in the application. Their sustained, selective-spatial, orienting, and executive structure is informed by CPAT research, but ChoiceTrain does not claim to be the published CPAT programme or a clinically validated implementation.

## Filtered Find Tasks

Named-object/preference activities and `Find category` have independent teacher controls for selected categories and image source: Personalised only, Stock only, or Both. The category and source filters are combined, not treated as alternatives.

- `Find object`, `Discriminate object`, and `Choice preference` share the named-object content configuration and require at least two differently labelled eligible items.
- `Find category` requires at least two usable categories that can form fair, single-answer trials.
- Personalised content is limited to the selected pupil and must be enabled for questions.
- Targets and distractors never fall back to excluded content.
- Family also belongs to People, and Fruit also belongs to Food. The generator excludes overlapping distractors that would also satisfy the prompt.
- The selected configuration and actual eligible item metadata are snapshotted at session start and included in exports without image bytes.

`Discriminate object` remains Level 5 and uses two options. In `Personalise`, teachers can optionally assign the same local discrimination-set code to differently labelled personalised items in the same category. Generator 1.7 prioritises those sets, records only a session-scoped opaque group token in full trial audit data, and labels the delivered basis `teacher-declared-set`; when no valid set exists it preserves the within-category or cross-category fallback. The private set name remains in the local full photo-library metadata but is omitted from Research summaries and privacy-minimised model data. Set membership is a teacher declaration, not image analysis or proof that the learner perceives the items as similar. `Choice preference` uses two to four configured options; every selection is valid and the exported trial is marked `open_ended_choice: true` and `scored_response: false`. The numeric progression has not been changed.

## EEG and Research Support

The app includes a research mode that can log structured event markers such as:

- prompt onset
- cue onset
- stimulus onset
- target present
- no-go
- response
- omission
- commission
- feedback onset
- break onset
- break offset
- artifact note
- session completion

This is designed to support later EEG-linked work, fixed blocks, and ERP-style export preparation. The V1.8 alpha can freeze a study/protocol ID, random participant pseudonym, visit, run, acquisition-system label, research condition, declared synchronisation method, planned marker set, and technical clock notes at session start.

For fixed software conditions, Admin staff can save a local manifest covering the task, timing, prompts, configured content categories/sources, research condition, block settings, and replay seed. Start is blocked only when enforcement is explicitly enabled and the current controls no longer match. The Research view reports use, adherence, exceptions, seed, and settings fingerprint; the fingerprint is an audit aid rather than a cryptographic signature.

The V1.8 Research view visualises core marker-set completeness, event-order validity, response-time/marker differences, protocol-field coverage, artifacts, block quality, and the declared synchronisation method. These are browser-log quality checks only. A displayed `100%` does not establish hardware synchronisation or EEG signal quality.

Admin > EEG also provides deterministic JSON and TSV marker-conformance fixtures under schema `1.0.0`. They contain every current marker name and numeric code, synthetic relative offsets, build metadata, and no pupil or session data. An external bridge developer can use them to test parser and code-map compatibility before pupil testing. They do not stream markers or validate clocks, latency, jitter, display/audio onset, acquisition hardware, or signal quality.

At present, the app does not connect directly to an EEG device. It prepares the data structure and event timing layer needed for future integration. Publication-quality EEG work still requires a separately implemented and measured LSL/device-trigger bridge, latency validation, signal-quality procedures, a pre-specified protocol, an appropriate comparison condition, and ethics/information-governance approval.

## Local Storage and Privacy

ChoiceTrain currently keeps data local to the device. Depending on the feature, it uses browser storage such as:

- `localStorage`
- IndexedDB

This local data can include:

- saved settings
- pupil profiles
- personalised photo metadata
- session history
- touch logs
- heatmap data
- research markers

The current `V1.7.0` build does not send session data to any external service.

## Future LLM-Assisted Recommendations

Stable V1.7 includes a local structured summary that could later support LLM-assisted recommendations. The isolated V1.8 alpha now adds deterministic, rule-based next-session proposals and teacher approve/adjust/decline/defer records. Approval accepts the proposed plan, adjustment records an approved alternative, decline rejects it for now, and defer records that more information or time is needed. Declined and deferred reviews have no approved final plan. A teacher can explicitly stage an approved task, level, and optional category focus for one next session; ChoiceTrain freezes the review link only when that unchanged setup starts, and Research distinguishes reviewed plans from sessions that actually used them. The category focus is constraint-checked, one-use, and does not rewrite saved pupil preferences. Support direction remains advisory. These are inspectable local planning aids, not an LLM and not autonomous teaching decisions.

Planned purpose:

`The build therapy for pupils will evolve based on their experience. Session data may later support LLM-assisted recommendations, subject to consent, safeguarding, and data governance.`

Current position:

- all data stays local
- no cloud LLM calls are made
- no session data is currently transmitted externally

The V1.8 local summary includes learner level, recent accuracy, recent reaction time, support used, preferred content, per-skill and category-by-skill practice states, an explainable suggested next session, and teacher review history. No proposal changes a level, task, category focus, or support plan automatically.

The alpha's pseudonymised export prepares governed analysis data; it does not train or call a model. Teacher decisions are retained without reviewer names or free-text notes so future model-development work can evaluate reviewed choices rather than treating unapproved automated suggestions as ground truth.

The V1.8 learner profile can record a local data-use declaration, an internal governance reference, a review date, and separately approved research-analysis, EEG-linkage, and model-development purposes. Governance schema `1.1.0` labels the review as current, due today, missing, invalid, overdue, or not applicable. Restricted model-development export fails closed when any represented profile has a missing, invalid, or overdue review, as well as when authority is absent, classroom-only, withdrawn, or not approved for that purpose. The reference and review date remain in full local/session records for audit but are excluded from the pseudonymised dataset. This is an application safeguard, not proof that legal, ethical, school, or research approval exists.

## Exports

Session exports use school-friendly filenames such as:

`ChoiceTrain_PupilA_2026-06-04_1430_session.json`

Exports can include:

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
- support level
- build version

The app also supports richer research-oriented exports when those settings are enabled:

- full session JSON for authorised classroom audit and replay; this can contain personal or sensitive data
- EEG/research JSON or TSV with event-level browser timestamps and study metadata
- stored longitudinal history
- a privacy-minimised, pseudonymised research/model-development JSON with no external transmission

## Running Locally

### Quick option

Open `index.html` in a browser.

### Recommended local server

From the repository root, run a simple static server such as:

```bash
python -m http.server 8000
```

Then open:

`http://localhost:8000/`

### Versioned snapshot

If you want the published snapshot directly, open:

- `choice_train_V1.7.0.html`

Keep the paired script and stylesheet beside it:

- `choice_train_V1.7.0.js`
- `choice_train_V1.7.0.css`

## GitHub Pages Deployment

This repository is published as a static GitHub Pages site.

Basic deployment pattern:

1. Promote the tested versioned build into the repository root.
2. Run the release stamper in `--dry-run` mode and review version, channel, UTC date, branch, commit, source files, and publication status.
3. Stamp the explicit versioned JavaScript runtime only after approval.
4. Update `index.html` to the latest stable snapshot.
5. Run release-tool and browser tests, then commit and push to `main`.
6. GitHub Pages serves the static files from the repository root.

Example candidate dry run:

```bash
node scripts/stamp-build.js --version 1.8.0-alpha --file choice_train_V1.8.0-alpha.js --channel experimental --dry-run
```

The command refuses missing or duplicate `APP_BUILD` blocks and requires an explicit target file. Omit `--dry-run` only for a reviewed candidate or promotion. Windows users can call `scripts/stamp-build.ps1` with the equivalent parameters; it delegates to the same Node implementation.

Current live URL:
`https://dioncroft.github.io/choice_train/`

## Tests

The repository includes browser smoke and regression tests using Playwright.

Useful commands:

```bash
npm install
npm run test:release
npm run test:promotion
npm run test:schema
npm run test:coverage
npm run test:review-pack
npm run build:review-pack:v180
npm run check:candidate:v180
npm run test:browser
npm run test:browser:compat
npm run audit:visual:v170
```

`npm run test:coverage` validates the pupil-data-free [V1.8 implementation coverage manifest](docs/V1.8.0_IMPLEMENTATION_COVERAGE.json). Its five unit tests and repository audit trace 16 internal objective requirements to exact implementation, test, and documentation anchors while delegating all 13 external gates exclusively to the separate promotion record. The coverage manifest has no commit-freeze or approval fields and cannot authorise the candidate.

`npm run build:review-pack:v180` creates an ignored, pupil-data-free engineering hand-off under `test-results/v180-review-pack/`. It records the exact commit, build provenance, protected V1.7 hashes, internal requirement IDs, external-gate status codes, and commands reviewers must run. It also produces a blank worksheet for consistent staff, device, assistive-access, governance, safeguarding, ethics, EEG timing, finding, retest, and product-owner records. Complete that worksheet only in the approved external evidence location and never commit the completed copy. The generated files deliberately exclude pupil/session data, completed reviewer identities, evidence references, consent records, and EEG recordings. A clean tracked worktree is required by default; the pack neither freezes the candidate nor authorises promotion.

`npm run check:candidate:v180` is a fail-fast engineering gate for the isolated V1.8 candidate. It protects the live V1.7 entry point, checks paired assets, versioned data contracts, and implementation coverage, rejects implemented browser network transports, and confirms that CI retains the full release/promotion-guard/schema/coverage/candidate/browser sequence. A pass prepares a candidate for review; it does not authorise promotion or replace school, governance, physical-device, or EEG hardware validation. See the [V1.8 release-readiness checklist](docs/V1.8.0_RELEASE_READINESS.md).

`npm run check:promotion:v180` is intentionally different: it fails until the candidate is frozen and every human, device, governance, ethics, and EEG-timing gate has an authorised evidence reference in the [promotion record](docs/V1.8.0_PROMOTION_EVIDENCE.json). CI tests that this guard is fail-closed but cannot approve those external gates.

The `V1.7.0` release is validated with:

- `node --check choice_train_V1.7.0.js`
- 77 passing Playwright browser tests covering the live entry point, archived-release loading, levels 1-10, AT and EEG flows, focused Teacher/Admin navigation, Student-friendly mode, prompt wording, blank intervals, reset behavior, exports, history, category persistence, resilient bulk import, photo editing, filtered task generation, all semantic themes, local-only operation, reward and no-reward flows, and desktop/tablet/mobile layout

The V1.7-specific suite contains 21 checks for workspace separation and focused navigation, high-legibility font loading, staff and learner contrast, semantic-token completeness, runtime-drawn theme colours, learner viewport containment, deliberate teacher return, per-pupil sensory settings, reward progression, reward-disabled manual navigation, zero external runtime requests, reduced motion, local audio/EEG metadata, exports, and tablet/mobile sizing. The broader regression suite contributes the remaining 56 checks.

The isolated V1.8 suite adds 55 checks for its schema and skill graph, non-destructive and idempotent legacy-data migration, deterministic lesson replay, multi-seed category/target, teacher-created category, single-cue match, two-cue group-completion, category-difference, teacher-declared-colour and discrimination-set invariants, established Level 6 category rotation plus conditional colour practice, longitudinal scope isolation, independent recomputation of session and skill rows from raw exports, category-by-skill learner-state and pooled-scope safeguards, explicit teacher-rating observation safeguards, zero external runtime requests, accessible Research navigation, domain-coverage and versioned trial-completeness audits, normalised touch-map evidence, explicit table/text relationships for every Research canvas, future-AI dataset composition and participant-separated split safeguards, prompt/agency event visualisation, session-completion/timing persistence including zero-response learner stops, separate Attention Training family and response-quality visualisations, teacher-reviewed planning and explicit plan-to-session provenance, retention observations, EEG protocol/timing diagnostics, deterministic pupil-free EEG parser fixtures, fixed-condition persistence/drift blocking/replay/export visualisation, deny-by-default governance, withdrawal and overdue-review handling, isolated pupil/profile/photo/history deletion, pseudonymised-export exclusions, question-to-answer blank timing, portrait phone/Kindle-sized/short-laptop learner containment, six-choice small/short-phone portrait and landscape at 130% text, explicit narrow Teacher-to-learner routing, live usable-height rotation and visual-viewport reduction relayout, narrow enlarged-text Teacher/Admin access, phone-sized Research containment, mobile photo-editor containment, and a schema-validated pupil-data-free Device readiness report. The teacher-created category flow adds two local categories and six personalised images, replays the same seeded lesson, and verifies one-answer constraints, balanced exposure, Research visibility, and image-free export metadata. A separate three-profile compatibility smoke matrix runs two routes per profile: learner pacing/local-only/viewport containment and enlarged-text Teacher/Admin/System navigation in Android-like Chromium, iPad-like WebKit, and a Kindle Silk-shaped Chromium context. The complete stable, archive, alpha, and compatibility matrix passes 138 Playwright executions.

The release stamper has three dependency-free Node unit tests covering safe replacement, missing/duplicate-block rejection, explicit file parsing, and dry-run options. Branch and Pages CI run these, the promotion guard, machine-readable schema checks, implementation-coverage audit, review-pack tests, and V1.8 candidate gate before the Chromium regression matrix and compatibility smoke matrix. Emulation is useful engineering evidence but does not close the physical-device gates in the [external validation protocol](docs/V1.8.0_EXTERNAL_VALIDATION_PROTOCOL.md).

`npm run audit:visual:v170` creates a repeatable local visual-review set with 17 synthetic-data captures covering teacher and Admin workspaces, active learner tasks, reward and reward-disabled feedback, break mode, tablet, mobile, and every theme. The generated screenshots are ignored by Git because they are review evidence rather than product assets.

## Current Limitations

- data is local to the device unless exported manually
- there is no server-side account system or cross-device sync
- EEG support is export-oriented rather than hardware-linked at this stage
- analytics and engagement measures remain practitioner-facing support data, not diagnostic outputs
- personalised photos are stored locally and should be managed in line with school safeguarding and consent procedures
- theme preferences should be validated with real learners and staff during school trials
- automated Chromium and WebKit compatibility checks do not replace physical Windows touchscreen, iPad Safari, Android Chrome, Kindle Silk, keyboard, or assistive-technology evaluation

## Future Roadmap

Planned or likely next steps include:

- deeper EEG workflow integration
- attribute-dependent procedural lessons beyond implemented category membership, single-cue matching, group completion, and category difference, after reliable teacher-defined attributes and single-answer rules are specified
- additional AT variants that preserve the research-informed attention rules
- stronger classroom transfer and maintenance measures
- richer fidelity and implementation support for staff
- optional LLM-assisted local recommendations after consent and governance work
- continued UI simplification for everyday school use

## Repository Structure

Key files and folders:

- `index.html` - current live entry file
- `choice_train_V1.7.0.html` - current versioned HTML build
- `choice_train_V1.7.0.js` - paired current runtime and schema
- `choice_train_V1.7.0.css` - current workspace and learner presentation layer
- `choice_train_V1.7.0-alpha.*` - preserved reviewed candidate files for release traceability
- `assets/` - branding and static assets
- `assets/fonts/` - locally bundled, licensed interface fonts used by V1.7
- `LICENSES/` - third-party asset licences
- `docs/` - user, privacy, architecture, evidence, and school-readiness documentation
- `releases/` - preserved historical builds and their shared archive assets
- `tests/` - Playwright browser tests
- `schemas/` - machine-readable core contracts for trials, Research summaries, recording completeness, privacy-minimised dataset exports, pupil-data-free device-readiness reports, and the pupil-free EEG marker-conformance fixture
- `scripts/` - local test, static-server, and release-stamping utilities
- `.github/` - CI, GitHub Pages, issue, and pull-request configuration
- `CHANGELOG.md` - release history
- `CONTRIBUTING.md` - contribution and verification workflow
- `SECURITY.md` - private vulnerability-reporting guidance

For implementation boundaries and the release process, see [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md). Contributions should follow [CONTRIBUTING.md](CONTRIBUTING.md), particularly the prohibition on real pupil data in issues, fixtures, and pull requests.

## ShowMe Branding

This release adds neutral, professional ShowMe branding wording such as:

- `ChoiceTrain for ShowMe`
- `Developed for ShowMe`

No remote images are hotlinked, and the default repo includes a replaceable placeholder logo asset.
