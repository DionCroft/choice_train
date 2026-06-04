# ChoiceTrain User Guide

**Version:** `V1.4.2`  
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

Student-friendly mode is enabled by default when learner mode is opened.

### Teacher Panel

The Teacher Panel is for everyday classroom use.

Teachers and TAs can use it to:

- select or add a pupil
- set session length
- choose the number of questions
- review the current level
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
- CPAT settings
- manual task selection
- auto level path
- touch scaling
- advanced export options
- build and version information
- research and fidelity settings

The Admin Panel is hidden by default and is intended for advanced users rather than everyday classroom setup.

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

At the top of the side panel you will see two buttons:

- `Teacher Panel`
- `Admin Panel`

Use these to switch between the two panel groups.

### Teacher Panel

This should be the default panel for normal classroom use.

### Admin Panel

This opens the advanced settings sections:

- `Advanced Admin Settings`
- `Research / Debug Settings`

### During Learner Mode

If the app is currently showing the learner activity, use the floating `Admin` button to return to teacher view and open the Admin Panel directly.

---

## 5. Creating a Pupil

1. Open the `Teacher Panel`.
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
- an optional relationship or type
- use in question generation

This helps make tasks more familiar, motivating, and meaningful.

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

### Step 1

Select the pupil.

### Step 2

Set the main teacher options:

- session length
- number of questions
- current level or auto pathway
- theme
- speech on or off
- context notes if needed

### Step 3

Press `Start Session`.

The learner activity will open.

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

This mode is enabled automatically when learner mode is opened.

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

The earlier levels focus on touch confidence and basic target finding. The later levels introduce more structured CPAT-style attention work.

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

### CPAT-Style Attention Activities

The learner completes structured sustained, selective-spatial, orienting, or executive attention tasks through game-like variants.

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

- Calm Blue
- Soft Green
- Warm Neutral
- High Contrast
- Low Stimulation Dark
- Light Classroom

Themes are intended as configurable classroom presentation options. Teachers should choose whichever theme works best for the learner and setting.

Theme choice is stored locally and may also follow the selected pupil profile on that device.

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
- more CPAT-style variants
- stronger cross-session teacher summaries

Any future recommendation layer should remain subject to consent, safeguarding, and data governance.

---

## 21. Troubleshooting

### The app does not load properly

Use the hosted GitHub Pages version if possible:

`https://dioncroft.github.io/choice_train/`

### I cannot find the Admin Panel

Use the `Teacher Panel` and `Admin Panel` buttons at the top of the side panel.

If you are currently in learner mode, press the floating `Admin` button first to return to teacher view and open the Admin Panel.

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

- [README.md](README.md)
- [RESEARCH_EVIDENCE.md](RESEARCH_EVIDENCE.md)
- [CHANGELOG.md](CHANGELOG.md)

---

**Developed for ShowMe**  
Supporting personalised learning through accessible technology.
