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

This information remains on the device unless a user deliberately downloads an export. ChoiceTrain currently makes no external analytics, LLM, pupil-account, or cloud-storage request.

`V1.7.0-alpha` also stores presentation preferences: font choice, text scale, motion level, feedback-sound level, and celebration intensity. These settings may be associated with a local pupil profile because presentation needs can differ between learners. They are included in session exports so the conditions under which a result was collected can be interpreted.

Alpha feedback sounds are generated on the device with the Web Audio API. ChoiceTrain does not use the microphone, record the learner, upload audio, or fetch sound files from a remote service.

## School Responsibilities

Schools should define an appropriate lawful basis, consent process, retention period, device-access policy, and export-storage process before using identifiable pupil data. Use aliases where possible and avoid unnecessary diagnostic or sensitive detail in context notes.

Personalised photographs should only be added with appropriate permission. Clearing browser storage can remove local profiles, images, and history, so required records should be exported and stored according to school policy.

Staff should treat presentation preferences as access settings, not diagnoses. Context notes should describe relevant daily classroom circumstances and avoid unnecessary medical, diagnostic, family, or safeguarding detail. Exported JSON files can contain personal data even when image bytes are omitted, so they need the same controlled storage and retention process as other school records.

## Research and EEG

Research mode prepares structured local markers and exports. It does not connect to EEG hardware or provide clinical interpretation. Any future device synchronisation, cloud recommendation, or LLM feature requires separate ethics, safeguarding, information-governance, and security review.

The alpha adds `audio_onset` and `reward_onset` browser markers. They provide event context for protocol development but are not substitutes for hardware triggers or measured end-to-end timing validation. See [DATA_DICTIONARY.md](DATA_DICTIONARY.md) for field meanings and [V1.7.0_USABILITY_TEST_PLAN.md](V1.7.0_USABILITY_TEST_PLAN.md) for pre-promotion checks.

## Incident Reporting

Do not place pupil information in a public GitHub issue. Security concerns should follow [SECURITY.md](../SECURITY.md), and school data incidents should use the school's established safeguarding and data-protection process.
