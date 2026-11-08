# Governance Contracts

This directory contains pupil-data-free, machine-readable governance metadata for ChoiceTrain.

- `data-inventory-v1.json` records current browser stores, data classes, export types, sensitivity boundaries, and prohibited repository content.

The inventory describes the V1.8 candidate; it does not contain participant records, establish a lawful basis, complete a DPIA, or approve a study. Update it whenever a runtime store, collected data class, export path, or external-transmission boundary changes.

Run `npm run test:schema` to check the inventory against the candidate runtime and governance documentation.
