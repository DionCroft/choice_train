# ChoiceTrain Data Dictionary

This dictionary documents the principal exported and locally stored fields used by the stable V1.7.0 application. It is an implementation reference, not a clinical scoring manual.

## Data Principles

- Data remains in the current browser unless a user downloads an export.
- Ordinary session exports omit raw image bytes and retain labels or content metadata.
- Context notes and pupil aliases can still be personal data.
- No field is a diagnosis, medical finding, or validated measure unless a future protocol establishes that separately.
- V1.7.0 uses export schema version 4. The isolated V1.8 alpha uses schema version 5.

## V1.8 Alpha Derived Planning Fields

The alpha retains raw trial records and adds recomputable, versioned planning fields. The rules are product defaults for school evaluation, not validated mastery or clinical thresholds.

| Field | Type | Meaning |
| --- | --- | --- |
| `practice_status_version` | string | Version of the transparent skill-state rules |
| `recommendation_version` | string | Version of the deterministic proposal rules |
| `local_recommendation_summary.practice_states` | array | Per-skill opportunity, recency, accuracy, independence, trend, retention, and support summaries |
| `practice_status` | enum | `not-scored`, `insufficient-sample`, `needs-support`, `developing`, or `consistent-current-sample` |
| `recent_window_sessions` | number | Number of latest observed sessions used, up to three |
| `retention_status` | enum | Observed spaced comparison or an explicit no/small-sample state |
| `retention_gap_days` | number or null | Whole-day gap between the two compared observations |
| `suggested_next_session` | object | Local proposal, rationale codes, source sessions, task, level, support direction, and interpretation boundary |
| `teacher_review_history` | array | Local approve/adjust/decline audit records for proposals |

Current alpha rules label samples below five scored opportunities or two sessions as needing more observations. `consistent-current-sample` requires at least eight recent scored opportunities, 80% recent accuracy, and 70% independent success. A retention comparison requires a gap of at least seven days and at least three scored opportunities on both sides; otherwise the sample is labelled too small.

Teacher review records preserve the proposal, decision, optional override, final task and level, note, reviewer label, timestamp, and any superseded review ID. A proposal never changes session settings automatically.

V1.8 freezes the selected local pupil name, export alias, profile snapshot, context, presentation settings, and photo metadata when a session starts. Later profile selection cannot relabel that session. The export alias is a display/pseudonym field rather than the local identity key, so two profiles may share an alias without their longitudinal records being merged.

## V1.8 Procedural Lesson Provenance

Generator version `1.1.0` adds a `balanced-before-repeat` coverage strategy for `Find object` and `Find category`.

| Field | Meaning |
| --- | --- |
| `lesson_plan.lesson_seed` | Session-level seed used to reproduce the lesson schedule |
| `lesson_plan.constraints.coverage_strategy` | `balanced-before-repeat` for generator 1.1.0 |
| `trial.question_seed` | Per-question seed used for reproducible option ordering and other question variation |
| `trial.generator_version` | Algorithm version required to interpret/replay the generated question |
| `trial.generator_constraints.coverage_strategy` | Coverage rule active for the question |
| `trial.target_category` | Configured category selected for the question |

For `Find object`, configured usable categories rotate before repeating and eligible targets rotate within their category. For `Find category`, fair prompt categories rotate before repeating and eligible targets rotate within each prompted category. Distractors remain outside the prompted category, option IDs are unique, and the correct target appears exactly once.

## Core Export Fields

| Field | Type | Meaning | Sensitivity |
| --- | --- | --- | --- |
| `app` | string | Application name | Low |
| `schema_version` | number | Export structure version | Low |
| `build.version` | string | Runtime version, for example `1.7.0` | Low |
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

## V1.7.0 Sensory Preferences

`sensory_preferences` is included in the session overview and research context:

| Field | Allowed values | Meaning |
| --- | --- | --- |
| `font` | `high-legibility`, `familiar` | Selected interface font path |
| `text_scale` | `0.9`, `1`, `1.15`, `1.3` | Interface text multiplier |
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

## V1.8 EEG Protocol and Diagnostics

The session-start protocol snapshot is immutable for that session. It records declared study provenance; it does not establish acquisition synchronisation.

| Field | Meaning |
| --- | --- |
| `study_protocol.protocol_schema_version` | Version of the protocol metadata structure |
| `study_protocol.study_protocol_id` | School/research protocol identifier; staff are instructed not to enter pupil names |
| `study_protocol.participant_pseudonym` | Random local `ctp-...` profile code rather than the display alias |
| `study_protocol.visit_id` | Declared visit label such as baseline or week-4 |
| `study_protocol.run_number` | Run number within the visit |
| `study_protocol.acquisition_system` | Locally entered equipment/amplifier label |
| `study_protocol.declared_sync_method` | `browser-only`, `manual-event-log`, `lsl-bridge`, or `hardware-trigger`; this is a declaration, not verification |
| `study_protocol.clock_latency_notes` | Free-text technical notes; excluded from the pseudonymised model-development export |
| `study_protocol.planned_marker_set` | Marker names expected by the ChoiceTrain protocol layer |
| `study_protocol.hardware_synchronization_verified` | Always `false` in the current browser-only implementation |
| `eeg_marker_diagnostics.ordering_pct` | Percentage of final trials whose expected browser markers exist in non-decreasing order |
| `eeg_marker_diagnostics.timing_difference_count` | Response marker/trial-latency comparisons outside the current 75 ms software tolerance |
| `eeg_marker_diagnostics.protocol_completeness_pct` | Filled required protocol fields, not a signal-quality score |
| `eeg_marker_diagnostics.non_monotonic_marker_count` | Adjacent marker times that run backwards in the exported sequence |
| `eeg_marker_diagnostics.duplicate_marker_id_count` | Repeated browser marker IDs |

## V1.8 Pseudonymised Research / Model-Development Export

This separate JSON uses `export_schema_version: 1.0.0` and `privacy_status: pseudonymised-not-anonymous`. Its `privacy_manifest` is machine-readable and records the excluded data classes. It contains:

- random participant codes and relative session order/spacing
- build, schema, skill-graph, and generator versions
- task, skill, outcome, support, reaction-time, and touch-distance features
- privacy-safe per-skill summaries
- relative EEG marker times and browser diagnostics
- sanitised teacher decisions, rationale codes, and final task/level without reviewer identity or free text

It excludes direct names and aliases, free text, images, photo labels, exact wall-clock/performance timestamps, source session/trial/recommendation IDs, prompt wording, selected labels, and raw touch coordinates. `external_transmission` is `false`; clicking the button downloads a local file only.

## Local Storage

- `localStorage` holds settings, profiles, lightweight summaries, and compatibility data.
- IndexedDB holds larger images/assets and session history.
- Clearing site data may remove both.
- Storage keys retain the established V1.4-compatible names in the alpha to avoid an unnecessary profile migration.

## Future LLM Summary

ChoiceTrain prepares local structured summaries with learner level, recent accuracy, recent reaction time, support used, preferred content, suggested next session, and context notes. It also offers the narrower pseudonymised export described above. No summary is sent to an LLM or external service, and no model is trained in the application. Any future use requires consent or another appropriate authority, safeguarding, information-governance, security, bias evaluation, purpose limitation, and human-review controls.

