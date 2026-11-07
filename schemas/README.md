# ChoiceTrain Machine-Readable Contracts

These JSON Schema 2020-12 files define stable **core fields** for V1.8 research interoperability:

- `choice-train-trial-v8.schema.json` covers one raw trial record.
- `choice-train-research-summary-v1.7.schema.json` covers the current local Research scope summary, including teacher-declared attribute practice and the aggregate future-AI dataset-composition profile.
- `choice-train-research-summary-v1.6.schema.json` and `choice-train-research-summary-v1.5.schema.json` are retained as previous summary contracts for historical exports.
- `choice-train-model-dataset-v1.schema.json` covers the privacy-minimised, governance-gated model-development dataset.

The schemas intentionally allow additional properties because full local exports contain detailed audit and research fields documented in `docs/DATA_DICTIONARY.md`. A schema match does not establish data quality, consent, anonymity, diagnostic validity, EEG synchronisation, or research efficacy.

No schema causes external transmission. ChoiceTrain does not currently call or train an LLM.
