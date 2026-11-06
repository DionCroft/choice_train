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

The current application is `index.html` plus the matching versioned HTML and JavaScript pair. Test changes against both the versioned path and `/`.

## Pull Requests

Keep changes small enough to review. Describe classroom impact, data-model or migration effects, accessibility implications, and manual checks. Add Playwright coverage for behaviour changes and synthetic assets for image tests.

Run before requesting review:

```bash
node --check choice_train_V1.6.0.js
npm run test:browser
```

Do not promote a new `index.html` or stamp a stable build until the complete suite passes.
