# Changelog

All notable changes to ChoiceTrain are documented in this file.

The format is inspired by Keep a Changelog and is written to match the way this project is released: experimental builds are developed in `Experimental_Choice_Train`, then stable snapshots are promoted into `GitHub/choice-train`.

## [Unreleased]

## [1.2.4] - 2026-05-24

### Added

- Dedicated `About / Build Info` panel in practitioner mode.
- Copy actions for build info and the live URL.
- Build metadata now surfaces published entry, live site URL, and repository URL together in one place.
- Versioned snapshot file `choice_train_V1.2.4.html`.

## [1.2.3] - 2026-05-24

### Added

- Visible active build label in the practitioner panel.
- Footer version chip for quick at-a-glance build confirmation.
- Version metadata in exported session files.
- Imported dashboard files can surface their source build when that metadata exists.
- Versioned snapshot file `choice_train_V1.2.3.html`.

## [1.2.2] - 2026-05-19

### Added

- Heat map scope controls for current session, learner history, all stored history, and imported data.
- Clearer heat map labels with question, attempt, task, and correctness context.
- Richer heat map captions with learner, session, selection, reaction time, and touch-distance details.
- Versioned snapshot file `choice_train_V1.2.2.html`.

### Changed

- Dashboard summaries and progression now use the latest outcome per question instead of overcounting retries.
- Automatic task sequencing after the single-target phase was corrected.
- Touch answers now confirm on release rather than on initial contact.

### Fixed

- Storage persistence failures now raise a visible warning instead of failing silently.

## [1.2.1] - 2026-05-08

### Added

- Stable published snapshot `choice_train_V1.2.1.html`.
- GitHub Pages-compatible `index.html` deployment entry.
- Expanded README project overview and user-guide material.
