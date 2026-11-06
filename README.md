# ChoiceTrain for ShowMe

ChoiceTrain is a static, browser-based learning and research-support tool designed for SEND classrooms. It combines touch-first learner activities, teacher-friendly session setup, personalised pupil content, and research-ready session logging in a single offline-friendly web app.

The current review release is `V1.6.0`. Historical versioned builds remain in the repository for traceability.

Live site:
`https://dioncroft.github.io/choice_train/`

User guide:
[userguide.md](userguide.md)

School-readiness audit:
[SCHOOL_READINESS_AUDIT.md](SCHOOL_READINESS_AUDIT.md)

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

## Research Evidence

A dedicated peer-reviewed evidence list is available in [RESEARCH_EVIDENCE.md](RESEARCH_EVIDENCE.md).

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
- `choice_train_V1.6.0.html`
- `choice_train_V1.6.0.js`
- `assets/showme-logo.png`

The runtime is versioned so experimental builds can be tested locally before a stable snapshot is promoted into the GitHub Pages copy.

## Teacher Panel and Admin Panel

`V1.6.0` separates the interface into two clear layers and keeps the settings teachers need during ordinary sessions in the Teacher Panel.

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
- optional blank screen between questions
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

This split is intended to make the app usable in real classrooms without asking teachers to work through technical settings every time.

How to open it:

- use the `Teacher Panel` and `Admin Panel` buttons at the top of the side panel to switch between the two panel groups
- in teacher view, the Admin tab reveals `Advanced Admin Settings` and `Research / Debug Settings`
- in learner mode, tap the floating `Admin` button to return to teacher view and open the Admin Panel directly

## Teacher Quick Start

The application now includes short in-app checklists for a pupil's first session and each later session. The intended daily flow is:

1. Select the pupil and check the saved level and task description.
2. Review the question count, session length, prompts, timing, speech, reward, and context note.
3. Select `Start session` and present the learner activity.
4. Review the basic results and download the session if required.

Settings save locally as they are changed. `Save pupil preferences` additionally applies the chosen prompt style to the visible text, image, and speech settings and provides an on-screen confirmation.

`Reset session` clears only the current unsaved attempt and returns to the welcome screen. It does not delete the pupil profile, saved settings, or stored session history.

### V1.6.0 Content Walkthrough

1. In `Pupil Personalisation`, enter a name under `Create new category`, then select `Save category`.
2. Choose that category under `Destination category` and use `Bulk photo import` to add one or more images.
3. Select photo cards, choose another category under `Manage selected photos`, and select `Move selected` when reassignment is needed.
4. Select `Crop / rotate` on one photo. Adjust square crop, focus, zoom, or rotation, then select `Apply`. `Cancel` leaves the stored edit unchanged and `Reset` restores the editor controls before applying.
5. Choose `Find object`, select one or more categories and a source mode, check the usable-item summary, then start the session.
6. Choose `Find category`, select at least two categories with eligible content, check that the summary reports fair question categories, then start the session.
7. Choose `Plain White` from the theme selector for a quiet white activity surface.

## Optional Blank Interval

Teachers can enable a calm blank screen between completed questions and set its duration from 0.25 to 10 seconds. It is off by default, is recorded in the event log, and is included in session exports so staff and researchers can interpret the pacing used.

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

`V1.6.0` retains the classroom-friendly `context notes` wording introduced in the previous release.

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
- inclusion in question generation
- non-destructive square crop, focus, zoom, and rotation settings

The category catalogue includes Family, People, Animals, Transport, Food, Fruit, Symbols / Shapes, Toys, Classroom objects, Activities, and retained legacy Custom content. Teachers can create additional categories; blank and duplicate names are rejected.

Individual and bulk imports use a teacher-selected destination category. A batch can contain up to 100 files, with a 12 MB per-file limit and a 40-megapixel decoded-image safeguard. Supported formats are JPEG, PNG, WebP, GIF, and SVG. Files are prepared locally, and a failed file does not discard valid files in the same batch.

The photo library supports editable labels, categories, source metadata, question inclusion, individual crop/rotation, and multi-photo category reassignment. Full images use proportional `contain` framing by default to avoid cutting off portrait or landscape subjects.

The app uses the label during question generation and export. The exported session payload keeps photo label metadata by default rather than forcing large base64 image data into every file.

If a school wants to replace the placeholder ShowMe branding image, put the real logo in:

- `assets/showme-logo.png`

or replace it with a final approved logo file while keeping accessible alt text such as `ShowMe logo`.

## Themes

ChoiceTrain provides a teacher-facing theme selector with the following preset options:

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

`Find object` and `Find category` have independent teacher controls for selected categories and image source: Personalised only, Stock only, or Both. The category and source filters are combined, not treated as alternatives.

- `Find object` requires at least two differently labelled eligible items.
- `Find category` requires at least two usable categories that can form fair, single-answer trials.
- Personalised content is limited to the selected pupil and must be enabled for questions.
- Targets and distractors never fall back to excluded content.
- Family also belongs to People, and Fruit also belongs to Food. The generator excludes overlapping distractors that would also satisfy the prompt.
- The selected configuration and actual eligible item metadata are snapshotted at session start and included in exports without image bytes.

`Discriminate object` remains Level 5 and follows `Find category` in the manual task menu. Its current rule is a named-item choice between two options; it does not yet guarantee visual similarity or attribute-based discrimination. The numeric progression has not been changed.

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

This is designed to support later EEG-linked work, fixed blocks, and ERP-style export preparation.

At present, the app does not connect directly to an EEG device. It prepares the data structure and event timing layer needed for future integration.

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

The current `V1.6.0` build does not send session data to any external service.

## Future LLM-Assisted Recommendations

The current build includes local structured summaries that could later support LLM-assisted recommendations. This is future-facing only.

Planned purpose:

`The build therapy for pupils will evolve based on their experience. Session data may later support LLM-assisted recommendations, subject to consent, safeguarding, and data governance.`

Current position:

- all data stays local
- no cloud LLM calls are made
- no session data is currently transmitted externally

The local summary structure now includes fields such as learner level, recent accuracy, recent reaction time, support used, preferred content, and a suggested next session summary.

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

The app also supports richer research-oriented exports when those settings are enabled.

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

- `choice_train_V1.6.0.html`

Keep the paired script beside it:

- `choice_train_V1.6.0.js`

## GitHub Pages Deployment

This repository is published as a static GitHub Pages site.

Basic deployment pattern:

1. Promote the tested versioned build into the repository root.
2. Update `index.html` to the latest stable snapshot.
3. Commit and push to `main`.
4. GitHub Pages serves the static files from the repository root.

Current live URL:
`https://dioncroft.github.io/choice_train/`

## Tests

The repository includes browser smoke and regression tests using Playwright.

Useful commands:

```bash
npm install
npm run test:browser
```

The `V1.6.0` work is validated with:

- `node --check choice_train_V1.6.0.js`
- 55 passing Playwright browser tests covering the live entry point, levels 1-10, AT and EEG flows, Teacher/Admin switching, Student-friendly mode, prompt wording, blank intervals, reset behavior, exports, history, category persistence, resilient bulk import, photo editing, filtered task generation, theme persistence, photo personalisation, and desktop/tablet visual review

## Current Limitations

- data is local to the device unless exported manually
- there is no server-side account system or cross-device sync
- EEG support is export-oriented rather than hardware-linked at this stage
- analytics and engagement measures remain practitioner-facing support data, not diagnostic outputs
- personalised photos are stored locally and should be managed in line with school safeguarding and consent procedures
- theme preferences should be validated with real learners and staff during school trials

## Future Roadmap

Planned or likely next steps include:

- deeper EEG workflow integration
- additional AT variants that preserve the research-informed attention rules
- stronger classroom transfer and maintenance measures
- richer fidelity and implementation support for staff
- optional LLM-assisted local recommendations after consent and governance work
- continued UI simplification for everyday school use

## Repository Structure

Key files and folders:

- `index.html` - current live entry file
- `choice_train_V1.6.0.html` - versioned review HTML snapshot
- `choice_train_V1.6.0.js` - paired runtime for the review snapshot
- `assets/` - branding and static assets
- `tests/` - Playwright browser tests
- `scripts/` - local test and utility scripts
- `SCHOOL_READINESS_AUDIT.md` - Brackensfield pilot feedback, audit findings, accessibility basis, and deferred progression questions
- `CHANGELOG.md` - release history

## ShowMe Branding

This release adds neutral, professional ShowMe branding wording such as:

- `ChoiceTrain for ShowMe`
- `Developed for ShowMe`

No remote images are hotlinked, and the default repo includes a replaceable placeholder logo asset.
