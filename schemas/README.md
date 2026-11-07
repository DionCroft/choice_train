# ChoiceTrain Machine-Readable Contracts

These JSON Schema 2020-12 files define stable **core fields** for V1.8 research interoperability:

- `choice-train-trial-v8.schema.json` covers one raw trial record, including optional teacher-approved recommendation provenance when a reviewed plan explicitly shaped the session.
- `choice-train-research-summary-v2.2.schema.json` covers the current local Research scope summary, including configurable retention planning, category-by-skill state, reviewed category-focus decisions/use, controlled human-observation context, teacher-declared discrimination and attribute practice, and the aggregate future-AI dataset-composition profile.
- `choice-train-research-summary-v2.0.schema.json`, `choice-train-research-summary-v1.9.schema.json`, `choice-train-research-summary-v1.8.schema.json`, `choice-train-research-summary-v1.7.schema.json`, `choice-train-research-summary-v1.6.schema.json`, and `choice-train-research-summary-v1.5.schema.json` are retained as previous summary contracts for historical exports.
- `choice-train-data-quality-v1.schema.json` covers versioned trial-recording completeness counts, expected-field coverage, and stable recording flags embedded in current Research summaries.
- `choice-train-model-dataset-v1.schema.json` covers privacy-minimised model dataset contract 1.3.0, including its closed retention-planning, EEG-diagnostic, teacher-decision, recommendation-application, sanitised category-focus, and controlled human-observation records.

The wider trial and export schemas intentionally allow additional properties because full local exports contain detailed audit and research fields documented in `docs/DATA_DICTIONARY.md`. The data-quality object is closed to keep its recording flags and count names stable. A schema match or complete field set does not establish correctness, validity, consent, anonymity, representativeness, EEG synchronisation, or research efficacy.

No schema causes external transmission. ChoiceTrain does not currently call or train an LLM.
