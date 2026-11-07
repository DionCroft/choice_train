# Contributing to ChoiceTrain

Thank you for helping improve ChoiceTrain for teachers and SEND learners.

## Before Making Changes

1. Create a focused branch from the latest `main`.
2. Preserve the static, local-first architecture and historical release files.
3. Avoid diagnostic, medical, or clinically validated claims.
4. Never commit real pupil information, photographs, session exports, or research data.

## Development

```bash
npm ci
npm run test:browser
```

The published application is `index.html` plus the matching stable HTML, JavaScript, and CSS files. Experimental candidates must remain directly addressable versioned files and must not replace `index.html` until they pass the documented promotion gates.

## Pull Requests

Keep changes small enough to review. Describe classroom impact, data-model or migration effects, accessibility implications, and manual checks. Add Playwright coverage for behaviour changes and synthetic assets for image tests.

Run before requesting review:

```bash
node --check choice_train_V1.7.0.js
npm run test:browser
```

Do not promote a new `index.html` or stamp a stable build until the complete suite passes.

For V1.7 and later work, also review [the V1.7 decision record](docs/V1.7.0_ALPHA_DESIGN_DECISIONS.md), [data dictionary](docs/DATA_DICTIONARY.md), and [usability test plan](docs/V1.7.0_USABILITY_TEST_PLAN.md). Do not describe a font, palette, reward, or sensory option as universally SEND-friendly or clinically proven. Preserve user choice and record the configuration used.

Third-party fonts or other assets require a compatible licence in `LICENSES/`, local serving where possible, and attribution in the pull request. Never copy another product's characters, artwork, sounds, wording, or reward assets; product inspiration should remain at the level of general interaction principles.
