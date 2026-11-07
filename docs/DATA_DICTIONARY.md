# ChoiceTrain Data Dictionary

This dictionary documents the principal exported and locally stored fields used by the stable V1.7.0 application. It is an implementation reference, not a clinical scoring manual.

## Data Principles

- Data remains in the current browser unless a user downloads an export.
- Ordinary session exports omit raw image bytes and retain labels or content metadata.
- Context notes and pupil aliases can still be personal data.
- No field is a diagnosis, medical finding, or validated measure unless a future protocol establishes that separately.
- V1.7.0 uses export schema version 4. The isolated V1.8 alpha uses schema version 8.
- Machine-readable core contracts are published under `schemas/`; they intentionally allow documented optional audit fields and do not replace the full dictionary below.

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

### Research attention-family view

The Research workspace recomputes a separate descriptive profile for `sustained`, `selective-spatial`, `orienting`, and `executive` trials. For each observed family it shows session and opportunity counts, accuracy, independent correct responses, omissions, commissions, median reaction time, reaction-time variability, and mean touch distance. These values remain missing when the relevant signal was not observed; missing timing or touch data is not replaced with zero.

`Descriptive slope` is an on-screen percentage-point change per observed session, calculated from family-level session accuracy only when the current-learner scope contains at least three sessions for that family. It is not calculated in all-learner scope and is not a validated learning, transfer, or neural-plasticity estimate.

### Research response-quality view

The response-quality card derives session-level `omission_pct`, `commission_pct`, `rt_variability_ms`, and `mean_touch_distance_px` from final trial outcomes. It also displays `rt_observed_count` and `touch_observed_count` against the session's final-trial count. RT variability is missing unless at least two response times were observed. Touch distance remains missing when target geometry was unavailable and should be compared cautiously across tasks, layouts, devices, or touch-scaling settings.

Current-learner points may be connected in chronological order. All-learner points are deliberately unconnected because records from different learners are not one longitudinal series.

Compatible V1.8 response trials add `target_play_x`, `target_play_y`, `target_width_px`, `target_height_px`, `touch_delta_x_px`, `touch_delta_y_px`, `play_area_width_px`, `play_area_height_px`, and `distance_to_target_play_diagonal`. Values remain null when there is no meaningful target, including open-ended preference choices. The Research spatial view derives hit-radius bands from `raw_distance_to_target_px / adaptive_hit_radius_px` and a dominant outside-radius direction from the signed deltas. Full local session exports retain this geometry for audit. The pseudonymised model-development export excludes raw pointer coordinates, target coordinates, dimensions, and deltas; it currently retains only the existing distance features defined by its privacy manifest.

The spatial view is a description of interaction geometry. Device dimensions, layout, target size, touch scaling, posture, access method, and assistance can all affect it, so it is not a validated motor, visual-field, attention, or diagnostic measure.

### Research implementation and transfer-observation views

The support-fading table derives per-session response counts, observed support-status counts, independent percentage, prompted/assisted/unknown counts, mean highest prompt level, actual and target dosage minutes, and implementation-fidelity percentage. Independent percentage uses only responses whose support status was explicitly observed; an absent status remains unknown rather than being treated as independent.

The cadence view uses `fidelity.dosage_minutes_actual`, `fidelity.dosage_minutes_target`, and `updated_at_wall_ms`. For one learner it derives cumulative observed minutes and the elapsed days between consecutive dated sessions. It also reports active date count and the number of sessions with an observed dose value. All-learner scope may total observed minutes and active dates but suppresses cumulative ordering and gap calculations. These are delivery/exposure descriptors, not validated dose-response or neural-plasticity estimates.

### Session completion and timing context

New V1.8 session records and full session exports include `session_timing.started_at_wall_ms`, `ended_at_wall_ms`, `duration_ms`, `planned_questions`, `completed_questions`, `completion_pct`, `completion_status`, and `end_reason`. Expected status values are `in-progress`, `completed`, `time-limit`, and `stopped-early`; expected end reasons include `planned-questions-complete`, `session-time-limit`, and `learner-stop`. The final `session_complete` event and marker are appended before the completed record is persisted. A learner-stopped session is retained even when no trial response was completed, so use of the Stop option is not lost from longitudinal delivery data.

The Research timing view derives median response-window use from `response_time_ms / timeout_after_ms` only when both values were observed, and counts `timed_out` final trials. Historical records without the new object use existing session events, trial timestamps, and frozen settings where available; unavailable values remain missing. Completion, duration, and window use describe delivery and response opportunity. They are not targets for speed, ability scores, or evidence of learning or neural change.

### Task demand and response opportunity

The Research demand view derives per-session mean displayed option count, mean distractor count, trials containing distractors, moving-target trials, median target side length (`sqrt(width * height)`), median adaptive hit radius, median configured response window, and frozen two-stage-prompt state. `session_demands` in the Research summary export contains the same rows. Missing geometry remains missing. Pixel measures depend on viewport, device, touch scaling, and layout; they are delivery covariates, not device-independent difficulty scores or measures of learner ability.

### Research workspace summary export

`Download scope summary` creates local JSON with `export_schema_version: 1.7.0` for the current Research scope. It contains derived `coverage_by_session`, `session_performance`, `session_timing`, `session_demands`, `fixed_conditions`, `skill_summaries`, `practice_states`, `attention_families`, `support_summary`, `task_exposure`, `category_exposure`, `category_matching`, `category_group_completion`, `category_exclusion`, `attribute_selection`, `category_lesson_coverage`, `model_dataset_composition`, `session_context`, `eeg_readiness`, and `teacher_decisions`. It preserves missing values rather than converting them to zero.

`model_dataset_composition` version 1.0.0 is an aggregate descriptive profile for future governed model-development planning. It records participant/session depth bands, longitudinal representation, skill and research-condition exposure, outcome and support-label counts, teacher-review counts, and current local governance eligibility. It excludes learner aliases and states that development, validation, and held-out evaluation must use participant-separated groups. `automatic_split_performed` and `random_trial_split_allowed` are both `false`. This profile does not determine dataset sufficiency, fairness, lawful use, model validity, teaching effectiveness, transfer, or neural change.

The summary includes configured learner aliases and day-level session dates. Its privacy manifest confirms that raw trials, raw events, raw coordinates, images, photo labels, and free-text notes are excluded. It is a local staff/research report, not an anonymous dataset and not the separately governed pseudonymised model-development export. ChoiceTrain does not transmit it externally.

`category_matching` contains one derived row per teacher-defined category represented in Match category trials: trial count, distinct cue count, distinct target count, distinct cue-target pair count, accuracy, independent-success percentage, omissions, median reaction time, and generator-integrity observed/valid counts. Generator integrity checks whether compatible records contain a distinct cue and target, a cue in the target category, exactly one same-category selectable option, that option as the target, and no selectable copy of the cue. It is an engineering/data-quality metric, not a pupil score. Item labels are not included in this derived section.

`category_group_completion` contains one derived row per teacher-defined category represented in Complete the group trials: trial count, distinct cue count, distinct two-cue set count, distinct target count, accuracy, independent-success percentage, omissions, median reaction time, and generator-integrity observed/valid counts. Integrity requires at least two distinct non-selectable cues in the reference category and exactly one selectable same-category option, which must be the target. It is an engineering/data-quality metric, not a pupil score or evidence that multiple examples caused generalisation. Item labels are not included in this derived section.

`category_exclusion` contains one derived row per teacher-defined reference category represented in Find the different one trials: trial count, distinct in-group exemplars, distinct outside targets, accuracy, independent-success percentage, omissions, median reaction time, and generator-integrity observed/valid counts. Integrity requires at least two unique options in the reference category and exactly one outside option, which must be the target. This is an engineering/data-quality check, not evidence of conceptual mastery, transfer, or neural change. Item labels are not included in this derived section.

`attribute_selection` contains one derived row per controlled teacher-declared attribute value and primary category represented in Find by colour trials. It reports trial count, distinct targets and displayed items, personalised exposure, accuracy, independent success, omissions, median reaction time, and generator-integrity observed/valid counts. Integrity requires every option to use the same primary category, every option to have a teacher-declared value, and exactly one option to match the requested value. The declaration is not image analysis and the row is not evidence of colour perception, mastery, transfer, or neural change.

`category_lesson_coverage` combines the five category and attribute task families by teacher-defined category. Each row contains delivered trial counts by task, distinct target/cue/displayed-item counts, personalised-content trial count, accuracy, independent success, and omissions. It is intended to reveal narrow or uneven delivered practice. The rows do not adjust for task difficulty, learner differences, support, or repeated content and must not be interpreted as causal task comparisons or proof of generalisation.

The prompt/agency view groups final trials by `highest_prompt_level` and counts `help_requested`, `prompt_applied`, `question_repeat`, learner and automatic `break_onset`, `learner_stop_requested`, and `reward_onset` records by session. Reward onsets come from the browser marker stream; other flow events come from the session event log. Counts depend on enabled controls, session opportunities, and practitioner practice. They are not deficit, motivation, or regulation scores.

The teacher-observation view displays the session-start 1-5 attention and independence ratings and counts recorded maintenance/generalisation statuses. `not-run` and missing statuses are excluded from status bars but remain visible in the table. These are practitioner-entered observations, not validated task scores or evidence of transfer. Current-learner points may be connected by session date; all-learner points are unconnected.

### Research content-breadth and preference views

The content-breadth view derives, per session, the count of categories represented across displayed option metadata, distinct scored target IDs, repeated scored-target exposures, trials containing personalised content, and completed open-ended preference selections. Preference trials do not create scored targets. Breadth is a description of presented content, not evidence that a skill generalised.

The preference view groups completed `choice-preference` trials by the actual `selected_id` and reports label, category, source, count, assisted count, and latest observed selection date. It does not use the generator's balancing anchor as a correct answer. These are context-specific choice observations and must not be presented as stable preferences or a formal reinforcer assessment.

### Research task and context views

The task/variant profile groups final trials by `research_condition`, `task_kind`, and `variant_label`/`task_variant`. It reports trial and scored counts, accuracy, observed independence, omissions, commissions, and median reaction time. Open-ended preferences remain unscored. Rows are descriptive and are not adjusted causal comparisons between tasks, variants, or research conditions.

The session-context view uses the frozen trial/session snapshot for `fatigue_level`, `sensory_state`, `sleep_quality`, `breaks_used`, and `pre_session_preference`, with profile fallbacks for older records. It places the recorded context beside session accuracy and observed independence. The view does not infer context from behaviour and must not be used to claim that a context factor caused performance.

The access/presentation view combines frozen learner baseline, session settings, sensory preferences, and trial context. It displays communication mode, motor access, AAC preference, prompt presentation, theme, font, text scale, motion, feedback sound, speech, student-friendly state, maximum options, and response window. These fields are potential access conditions and analysis covariates, not outcomes or ability labels. Older records retain `Not recorded` rather than inheriting the current device settings.

### Research domain-coverage view

The on-screen coverage audit groups planned fields into behaviour, support, context, content, EEG/protocol, and transfer domains. Each session cell reports `observed/expected (percentage)`. The aggregate chart combines only applicable denominators. EEG/protocol is `Not expected` when EEG mode was off and no markers were recorded; it is not converted to zero. Context and transfer include optional practitioner-entered fields, so incomplete coverage is a prompt to review collection procedures rather than a pupil score, validity judgement, or missing-value imputation. Coverage is derived locally for display and does not modify the stored session record.

## V1.8 Procedural Lesson Provenance

Generator version `1.6.0` applies a `balanced-before-repeat` coverage strategy to `Find object`, `Find category`, `Match category`, `Complete the group`, `Find the different one`, `Find by colour`, `Discriminate object`, and `Choice preference`. Data schema 8 retains structured multi-cue and declared-attribute fields; skill graph 1.4.0 adds `categorisation.declared_colour`.

| Field | Meaning |
| --- | --- |
| `lesson_plan.lesson_seed` | Session-level seed used to reproduce the lesson schedule |
| `lesson_plan.constraints.coverage_strategy` | `balanced-before-repeat` for generator 1.6.0 |
| `trial.question_seed` | Per-question seed used for reproducible option ordering and other question variation |
| `trial.generator_version` | Algorithm version required to interpret/replay the generated question |
| `trial.generator_constraints.coverage_strategy` | Coverage rule active for the question |
| `trial.target_category` | Configured category selected for the question |
| `trial.cue_id` / `trial.cue_label` | The non-selectable exemplar shown before a category-match response; blank for tasks without an exemplar cue |
| `trial.cue_category` / `trial.cue_category_label` | Teacher-defined category attached to the cue |
| `trial.cue_source` / `trial.cue_metadata` | Cue source and structured category metadata without image bytes |
| `trial.cue_ids` / `trial.cue_labels` | Ordered cue identities and labels; two entries for Complete the group |
| `trial.cue_metadata_list` | Structured metadata for every non-selectable cue, without image bytes |
| `trial.reference_category` / `trial.reference_category_label` | Teacher-defined in-group category for Find the different one |
| `trial.category_relation` | Explicit target relationship; `outside-reference-category` for Find the different one |
| `trial.target_attribute_key` / `trial.target_attribute_value` | Controlled teacher-declared rule used by Find by colour |
| `trial.attribute_source` | Provenance of the attribute; currently `teacher` for generated colour lessons |
| `trial.attribute_relation` | Required target relationship; `matches-teacher-declared-value` for Find by colour |
| `trial.procedural_variant` | Named generator path, including category-balanced discrimination or preference |
| `trial.discrimination_contrast` | `within-category` or `cross-category` for generated discrimination trials |
| `trial.open_ended_choice` | `true` when every presented option is an acceptable preference selection |
| `trial.scored_response` | `false` when the response must not contribute to accuracy or target scoring |

For `Find object`, configured usable categories rotate before repeating and eligible targets rotate within their category. For `Find category`, fair prompt categories rotate before repeating and eligible targets rotate within each prompted category. `Match category` shows one cue and requires a different member as the only selectable same-category answer. `Complete the group` shows two distinct non-selectable category members and requires a third member as the only same-category answer; cues never appear among the choices. `Find the different one` presents exactly one outside target alongside two or more reference-category items. `Find by colour` rotates fair primary-category/declared-colour rules, includes exactly one matching item, and uses same-primary-category alternatives with other declared colours. Options have unique IDs and labels, and the correct target appears exactly once. Automatic Level 6 adds Find by colour only when two or more fair declared-colour rules exist; otherwise its established category rotation is unchanged. `Discriminate object` prefers a same-category distractor but records a cross-category fallback when needed. `Choice preference` rotates category/content anchors only to balance exposure; the anchor is not a correct answer. Every preference option is accepted, target-distance fields remain missing, and `scored_response` is `false`.

Category-match, group-completion, category-difference, and teacher-declared colour accuracy describe performance on delivered in-app tasks. They are not, by themselves, evidence of colour perception, classroom generalisation, durable transfer, conceptual mastery, or neural change.

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
- structured category-match cue ID, label, category, source, and metadata when applicable
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
| `study_protocol.protocol_condition_id` | Non-identifying local fixed-condition ID when enforcement was enabled |
| `study_protocol.fixed_condition.schema_version` | Version of the local fixed-condition structure |
| `study_protocol.fixed_condition.enabled` | Whether fixed-condition enforcement was enabled at session start |
| `study_protocol.fixed_condition.adherence_status` | `adherent` for a verified match; non-adherent states remain visible for imported or incomplete records |
| `study_protocol.fixed_condition.settings_fingerprint` | Eight-character FNV-1a fingerprint of canonical manifest settings for comparison, not a cryptographic signature |
| `study_protocol.fixed_condition.manifest` | Frozen local manifest containing task, timing, prompt, content-filter, research-condition, block, and replay-seed controls |
| `study_protocol.clock_latency_notes` | Free-text technical notes; excluded from the pseudonymised model-development export |
| `study_protocol.planned_marker_set` | Marker names expected by the ChoiceTrain protocol layer |
| `study_protocol.hardware_synchronization_verified` | Always `false` in the current browser-only implementation |
| `eeg_marker_diagnostics.ordering_pct` | Percentage of final trials whose expected browser markers exist in non-decreasing order |
| `eeg_marker_diagnostics.timing_difference_count` | Response marker/trial-latency comparisons outside the current 75 ms software tolerance |
| `eeg_marker_diagnostics.protocol_completeness_pct` | Filled required protocol fields, not a signal-quality score |
| `eeg_marker_diagnostics.non_monotonic_marker_count` | Adjacent marker times that run backwards in the exported sequence |
| `eeg_marker_diagnostics.duplicate_marker_id_count` | Repeated browser marker IDs |

The Research workspace also derives per-session marker-completeness, ordering, protocol-coverage, and mean block-quality values. Block quality is the existing transparent browser-log heuristic: it starts at 100 and subtracts configured weights for practitioner-logged artifacts plus omission/commission penalties. The artifact view reports event counts and the number of affected sessions for Movement, Blink, Speech, Cap adjust, and Interruption. These values are not EEG signal-quality metrics, and even 100% marker completeness does not establish hardware synchronisation.

The fixed-condition Research rows report date, condition ID, research condition, adherence state, replay seed, and fingerprint. `adherent` means the current ChoiceTrain controls matched the locally saved manifest at Start. It does not verify randomisation, allocation concealment, blinding, preregistration, protocol approval, treatment equivalence, or EEG hardware timing. Protocol-relevant speech, target-scale, touch-scaling, and learner-view controls are fixed; pupil identity, notes, themes, fonts, communication mode, and motor-access profile are not.

## V1.8 Pseudonymised Research / Model-Development Export

This separate JSON uses `export_schema_version: 1.0.0` and `privacy_status: pseudonymised-not-anonymous`. Its `privacy_manifest` is machine-readable and records the excluded data classes. It contains:

- random participant codes and relative session order/spacing
- build, schema, skill-graph, and generator versions
- task, skill, outcome, support, reaction-time, and touch-distance features
- privacy-safe per-skill summaries
- relative EEG marker times and browser diagnostics
- fixed-condition enabled/adherence/fingerprint state without the condition ID or manifest settings
- sanitised teacher decisions, rationale codes, and final task/level without reviewer identity or free text

It excludes direct names and aliases, free text, images, photo labels, exact wall-clock/performance timestamps, source session/trial/recommendation IDs, prompt wording, selected labels, raw touch coordinates, fixed-condition IDs, and fixed manifest settings. `external_transmission` is `false`; clicking the button downloads a local file only.

### V1.8 Data-use governance declaration

Full pupil/session records use governance schema `1.0.0`:

| Field | Meaning |
|---|---|
| `data_governance.status` | `not-recorded`, `recorded-separately`, `classroom-only`, or `withdrawn` |
| `data_governance.approved_uses.research_analysis` | Local declaration for research-analysis use |
| `data_governance.approved_uses.eeg_linkage` | Local declaration for linking session and EEG records |
| `data_governance.approved_uses.model_development` | Local declaration for model-development use |
| `data_governance.governance_reference` | Internal reference to evidence held outside ChoiceTrain; must not contain a pupil name |
| `data_governance.review_date` | Local review/expiry date supplied by the governing team |
| `data_governance.authority_evidence_stored_in_choice_train` | Always `false` in V1.8 alpha |

The pseudonymised model-development export checks the current profile for every pupil in scope. It requires `recorded-separately` plus `model_development: true`; all other statuses block the export. The pseudonymised payload records aggregate gate results but excludes governance references, review dates, and authority evidence.

## Local Storage

- `localStorage` holds settings, profiles, lightweight summaries, and compatibility data.
- IndexedDB holds larger images/assets and session history.
- Clearing site data may remove both.
- Storage keys retain the established V1.4-compatible names in the alpha to avoid an unnecessary profile migration.

## Future LLM Summary

ChoiceTrain prepares local structured summaries with learner level, recent accuracy, recent reaction time, support used, preferred content, suggested next session, and context notes. It also offers the narrower pseudonymised export described above. No summary is sent to an LLM or external service, and no model is trained in the application. Any future use requires consent or another appropriate authority, safeguarding, information-governance, security, bias evaluation, purpose limitation, and human-review controls.

