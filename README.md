# ChoiceTrain for ShowMe

ChoiceTrain is a static, browser-based learning and research-support tool designed for SEND classrooms. It combines touch-first learner activities, teacher-friendly session setup, personalised pupil content, and research-ready session logging in a single offline-friendly web app.

The current stable release is `V1.4.1`.

Live site:
`https://dioncroft.github.io/choice_train/`

## What ChoiceTrain Is

ChoiceTrain is designed to help pupils practise:

- early touch confidence
- finding and recognising familiar people or objects
- object discrimination and category recognition
- structured choice making
- CPAT-style attention activities across sustained, selective-spatial, orienting, and executive attention families

It is built as a static HTML, CSS, and JavaScript application so it can run on school devices without requiring cloud services.

## For Schools

ChoiceTrain is currently a teaching and research-support tool. It is not a diagnostic, medical, or clinical system.

The app can support structured classroom activities, teacher observation, and research-linked data collection, but practitioner judgement and school safeguarding processes still sit around its use.

## Current Release

Published files:

- `index.html`
- `choice_train_V1.4.1.html`
- `choice_train_V1.4.1.js`
- `assets/showme-logo-placeholder.svg`

The runtime is versioned so experimental builds can be tested locally before a stable snapshot is promoted into the GitHub Pages copy.

## Teacher Panel and Admin Panel

`V1.4.1` separates the interface into two clearer layers.

### Teacher Panel

The Teacher Panel is intended for everyday classroom use. It focuses on the controls a teacher or TA needs to run a session quickly:

- select pupil
- add pupil
- start session
- reset session
- export or download session
- current level
- session length
- number of questions
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
- CPAT settings
- manual task selection
- auto level path
- touch scale
- advanced export and debug tools
- build and version metadata
- research and fidelity settings

This split is intended to make the app usable in real classrooms without asking teachers to work through technical settings every time.

How to open it:

- in teacher view, open `Advanced Admin Settings`
- in learner mode, tap the floating `Admin` button to return to teacher view and open the Admin Panel directly

## Student-Friendly Mode

Student-friendly mode is enabled by default when learner mode is opened.

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

`V1.4.1` replaces older medical-style wording with `context notes`.

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
- optional relationship or type
- inclusion in question generation

The app uses the label during question generation and export. The exported session payload keeps photo label metadata by default rather than forcing large base64 image data into every file.

If a school wants to replace the placeholder ShowMe branding image, put the real logo in:

- `assets/showme-logo-placeholder.svg`

or replace it with a final approved logo file while keeping accessible alt text such as `ShowMe logo`.

## Themes

`V1.4.1` adds a teacher-facing theme selector with the following preset options:

- Calm Blue
- Soft Green
- Warm Neutral
- High Contrast
- Low Stimulation Dark
- Light Classroom

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

The learner-facing wording in `V1.4.1` uses warmer, more natural prompts such as:

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

## Learner Pathway and CPAT Tasks

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

CPAT-style task families are presented through game-like variants while preserving the intended attention rule.

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

The current `V1.4.1` build does not send session data to any external service.

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

- `choice_train_V1.4.1.html`

Keep the paired script beside it:

- `choice_train_V1.4.1.js`

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

The `V1.4.1` work was validated with:

- `node --check choice_train_V1.4.1.js`
- Playwright browser regression coverage for teacher panel structure, Admin Panel access from learner mode, student-friendly mode, prompt wording, exports, theme persistence, and photo personalisation

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
- additional CPAT-consistent task variants
- stronger classroom transfer and maintenance measures
- richer fidelity and implementation support for staff
- optional LLM-assisted local recommendations after consent and governance work
- continued UI simplification for everyday school use

## Repository Structure

Key files and folders:

- `index.html` - current live entry file
- `choice_train_V1.4.1.html` - versioned stable HTML snapshot
- `choice_train_V1.4.1.js` - paired runtime for the stable snapshot
- `assets/` - branding and static assets
- `tests/` - Playwright browser tests
- `scripts/` - local test and utility scripts
- `CHANGELOG.md` - release history

## ShowMe Branding

This release adds neutral, professional ShowMe branding wording such as:

- `ChoiceTrain for ShowMe`
- `Developed for ShowMe`

No remote images are hotlinked, and the default repo includes a replaceable placeholder logo asset.
