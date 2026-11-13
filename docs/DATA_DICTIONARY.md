# ChoiceTrain Data Dictionary

This dictionary documents the principal exported and locally stored fields used by the stable V1.7.1 application. It is an implementation reference, not a clinical scoring manual.

## Data Principles

- Data remains in the current browser unless a user downloads an export.
- Ordinary session exports omit raw image bytes and retain labels or content metadata.
- Context notes and pupil aliases can still be personal data.
- No field is a diagnosis, medical finding, or validated measure unless a future protocol establishes that separately.
- V1.7.1 uses export schema version 4.

## Core Export Fields

| Field | Type | Meaning | Sensitivity |
| --- | --- | --- | --- |
| `app` | string | Application name | Low |
| `schema_version` | number | Export structure version | Low |
| `build.version` | string | Runtime version, for example `1.7.1` | Low |
| `build.channel` | string | Release channel such as stable or alpha | Low |
| `pupil_alias` / learner identity fields | string | School-selected name or alias | Personal |
| `date` / timestamps | ISO string or epoch | Session and event timing | Personal when linked |
| `level` | number | ChoiceTrain progression level | Educational |
| `task_type` | string | Task rule used | Educational |
| `accuracy` | number | Correct responses divided by scored attempts | Educational |
| `reaction_time` | number | Response latency, normally milliseconds | Research/educational |
| `touch_distance` | number | Distance from touch to intended target | Research/educational |
| `context_notes` | string | Daily teacher observations | Potentially sensitive |
| `theme_used` | string | Active visual theme ID | Access context |
| `student_friendly_mode` | boolean | Whether technical learner content was hidden | Access context |
| `trials` | array | Trial-level prompts, options, responses and outcomes | Research/educational |
| `events` / `eeg_markers` | array | Time-ordered runtime events | Research |

## V1.7.1 Sensory Preferences

`sensory_preferences` is included in the session overview and research context:

| Field | Allowed values | Meaning |
| --- | --- | --- |
| `font` | `high-legibility`, `familiar` | Selected interface font path |
| `text_scale` | `0.9`, `1`, `1.15`, `1.3` | Interface text multiplier |
| `item_size_preset` | `auto`, `compact`, `standard`, `large`, `custom` | Learner target-layout preference; `auto` adapts to the available viewport |
| `motion` | `reduced`, `gentle`, `full` | Animation intensity |
| `feedback_sound` | `off`, `low`, `standard` | Generated sound level |
| `celebration_intensity` | `quiet`, `gentle`, `lively` | Reward presentation level |

These are presentation choices, not inferred sensory profiles. They may be stored on the selected pupil's local baseline so that a preferred presentation can be restored on the same device.

## Trial and Support Context

Trial records can include:

- exact generated prompt wording
- target and option labels
- target-present or no-go state
- response, omission, or commission outcome
- reaction time and touch location/distance
- prompt level and support used
- spontaneous or assisted response context
- repeat status
- task family and variant
- personalised photo label/category metadata without image bytes

Field availability depends on the task and enabled logging mode. Missing data must not be interpreted as a zero score.

## EEG Marker Codes

| Code | Marker | Meaning |
| --- | --- | --- |
| 1 | `session_start` | Session timing origin |
| 10 | `prompt_onset` | Primary prompt shown |
| 11 | `cue_onset` | Cue shown |
| 12 | `stimulus_onset` | Stimulus presented |
| 13 | `target_present` | Target-present trial state |
| 14 | `no_go` | No-go trial state |
| 20 | `response` | Learner response received |
| 21 | `omission` | Required response not received in time |
| 22 | `commission` | Response made when it should have been withheld |
| 30 | `feedback_onset` | Feedback display began |
| 31 | `prompt_onset_support` | Additional support prompt shown |
| 32 | `audio_onset` | Generated feedback audio requested |
| 33 | `reward_onset` | Reward journey presentation began |
| 40 | `break_onset` | Break began |
| 41 | `break_offset` | Break ended |
| 50 | `artifact` | Practitioner-recorded artifact/context event |
| 90 | `session_complete` | Session ended |

These are browser event times. Real EEG synchronisation still requires a hardware/LSL integration and measured clock, display, audio, and transport latency.

## Local Storage

- `localStorage` holds settings, profiles, lightweight summaries, and compatibility data.
- IndexedDB holds larger images/assets and session history.
- Clearing site data may remove both.
- Storage keys retain the established V1.4-compatible names in the alpha to avoid an unnecessary profile migration.

## Future LLM Summary

ChoiceTrain may prepare local structured summaries with learner level, recent accuracy, recent reaction time, support used, preferred content, suggested next session, and context notes. No summary is currently sent to an LLM or external service. Any future use requires consent, safeguarding, information-governance, security, bias, and human-review controls.

