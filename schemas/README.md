# ChoiceTrain Machine-Readable Contracts

These JSON Schema 2020-12 files define stable **core fields** for V1.8 research interoperability:

- `choice-train-trial-v8.schema.json` covers one raw trial record.
- `choice-train-research-summary-v1.7.schema.json` covers the current local Research scope summary, including teacher-declared attribute practice and the aggregate future-AI dataset-composition profile.
- `choice-train-research-summary-v1.6.schema.json` and `choice-train-research-summary-v1.5.schema.json` are retained as previous summary contracts for historical exports.
- `choice-train-data-quality-v1.schema.json` covers versioned trial-recording completeness counts, expected-field coverage, and stable recording flags embedded in current Research summaries.
- `choice-train-model-dataset-v1.schema.json` covers the privacy-minimised, governance-gated model-development dataset, including its closed EEG-diagnostic and teacher-decision records.

The wider trial and export schemas intentionally allow additional properties because full local exports contain detailed audit and research fields documented in `docs/DATA_DICTIONARY.md`. The data-quality object is closed to keep its recording flags and count names stable. A schema match or complete field set does not establish correctness, validity, consent, anonymity, representativeness, EEG synchronisation, or research efficacy.

No schema causes external transmission. ChoiceTrain does not currently call or train an LLM.
