# Data and Privacy Notes

ChoiceTrain is a teaching and research-support tool for SEND settings. It is not a diagnostic or medical system.

## Local Data

The browser may store:

- pupil names or aliases
- classroom context notes
- personalised photographs and labels
- session settings and progress
- responses, timings, touch positions, and heatmap data
- prompting, fidelity, artifact, and EEG-preparation markers
- local fixed-condition manifests containing software settings, non-identifying condition IDs, and deterministic lesson seeds

This information remains on the device unless a user deliberately downloads an export. ChoiceTrain currently makes no external analytics, LLM, pupil-account, or cloud-storage request.

`V1.7.0` also stores presentation preferences: font choice, text scale, motion level, feedback-sound level, and celebration intensity. These settings may be associated with a local pupil profile because presentation needs can differ between learners. They are included in session exports so the conditions under which a result was collected can be interpreted.

The V1.7 semantic colour refactor changes presentation only. It does not add a data category, remote service, tracking request, or colour-based learner classification. Theme names and selections are access preferences and must not be interpreted as a diagnosis or sensory profile.

Alpha feedback sounds are generated on the device with the Web Audio API. ChoiceTrain does not use the microphone, record the learner, upload audio, or fetch sound files from a remote service.

The repository's repeatable visual-audit script uses synthetic/default pupil data. Its generated screenshots and bounds manifest are written under the ignored `test-results/` directory and are not committed or uploaded by the application. Staff must not substitute identifiable pupil profiles when creating development screenshots or attach pupil data to public issues.

## School Responsibilities

Schools should define an appropriate lawful basis, consent process, retention period, device-access policy, and export-storage process before using identifiable pupil data. Use aliases where possible and avoid unnecessary diagnostic or sensitive detail in context notes.

Personalised photographs should only be added with appropriate permission. Clearing browser storage can remove local profiles, images, and history, so required records should be exported and stored according to school policy.

Staff should treat presentation preferences as access settings, not diagnoses. Context notes should describe relevant daily classroom circumstances and avoid unnecessary medical, diagnostic, family, or safeguarding detail. Exported JSON files can contain personal data even when image bytes are omitted, so they need the same controlled storage and retention process as other school records.

## Research and EEG

Research mode prepares structured local markers and exports. It does not connect to EEG hardware or provide clinical interpretation. Any future device synchronisation, cloud recommendation, or LLM feature requires separate ethics, safeguarding, information-governance, and security review.

The V1.8 alpha can create deterministic local planning proposals and store teacher review decisions. These records include educational performance summaries, reviewer notes, and final task/level choices, so schools should apply the same access, retention, minimisation, and export controls used for session records. The proposal engine is rule based; it does not call an external AI or apply changes without teacher action.

V1.8 snapshots session identity and context at Start. Changing the selected pupil later does not relabel an existing session or its export. Aliases are pseudonymous display values, not guaranteed unique identifiers; longitudinal filtering uses the local pupil profile name when available and only falls back to alias for legacy records.

The alpha adds `audio_onset` and `reward_onset` browser markers. They provide event context for protocol development but are not substitutes for hardware triggers or measured end-to-end timing validation. See [DATA_DICTIONARY.md](DATA_DICTIONARY.md) for field meanings and [V1.7.0_USABILITY_TEST_PLAN.md](V1.7.0_USABILITY_TEST_PLAN.md) for pre-promotion checks.

### V1.8 export boundaries

The V1.8 alpha has separate exports for different authorised purposes:

- full session and stored-history exports can contain names or aliases, context notes, prompt and photo labels, precise event times, touch coordinates, and teacher review notes
- EEG/research exports retain detailed event timing and declared study-protocol metadata for audit and later alignment
- the `Pseudonymised AI research data` export applies a separate minimisation transform and is intended only as a governed analysis/model-development input

Schema-8 category trials can add an ordered local cue list, a teacher-defined reference-category ID, and an explicit same- or outside-category relationship. Full local session exports retain cue and category labels plus option metadata for audit. The privacy-minimised model-development transform excludes cue IDs and labels, keeps only a built-in reference-category ID or the generic value `custom`, and retains the relationship code; it excludes custom category names.

Each local pupil profile can record a data-use status, a school/research governance reference, a review date, and purpose-specific declarations for research analysis, EEG linkage, and model development. These fields are declarations only. The school or research team must hold the actual consent or other authority evidence in its approved system; ChoiceTrain neither stores nor validates that evidence.

The pseudonymised model-development export is denied by default. Before creating it, ChoiceTrain checks the current local profile for every pupil represented in the selected session scope. Every profile must be marked `recorded separately` with model-development use approved. Missing, not-recorded, classroom-only, and withdrawn profiles block the whole export, even if an older session snapshot contains a previous approval. This current-profile check supports withdrawal, but it does not replace an organisational withdrawal and deletion process.

The pseudonymised export excludes pupil names and aliases, free-text notes, image bytes, photo labels, exact session and event timestamps, source session IDs, exact prompt wording, reviewer identity, and raw touch coordinates. It retains random participant codes, relative session spacing, task and skill IDs, outcomes, reaction times, touch distances, support/independence fields, relative EEG marker times, diagnostic summaries, and sanitised teacher decisions.

The Research workspace also displays an aggregate future-AI dataset-composition profile. Its exported block omits aliases and reports only session-depth bands, skill/condition exposure, outcome/support counts, teacher-review counts, and governance-eligibility totals. This is a data-audit aid rather than a model-readiness score. ChoiceTrain performs no training and no automatic split. Any later approved development must split by participant, not by randomly mixing trials or sessions from the same learner across development, validation, and held-out evaluation groups, to reduce identity leakage and over-optimistic evaluation.

This output is **pseudonymised, not anonymous**. The random participant code is stored in the local pupil profile and can support longitudinal linkage; the source device or a separately held mapping may therefore permit re-identification. Governance references and review dates remain available in full session records but are excluded from the privacy-minimised dataset. Export creation does not establish consent or another lawful basis and does not transmit the file. Before research or model development, schools and researchers must define purpose, lawful basis or consent/authority, data minimisation, access, secure transfer, retention/deletion, train/validation/test separation, bias review, human oversight, and incident handling.

V1.8 protocol controls record the declared synchronisation method but do not activate LSL or hardware triggers. Marker completeness, event ordering, and timing-difference cards are software-log diagnostics. They do not validate amplifier clocks, display/audio latency, transport delay, cap quality, artifact removal, or physiological signal quality.

Fixed-condition enforcement is also a software control. It stores a local manifest and blocks Start when selected controls no longer match. It does not establish a study's randomisation, allocation, blinding, preregistration, ethics approval, or hardware timing. Condition IDs must not contain pupil names. The pseudonymised model-development export retains only enabled/adherence/fingerprint state and excludes the condition ID and manifest settings.

## Incident Reporting

Do not place pupil information in a public GitHub issue. Security concerns should follow [SECURITY.md](../SECURITY.md), and school data incidents should use the school's established safeguarding and data-protection process.
