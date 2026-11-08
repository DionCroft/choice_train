# ChoiceTrain Technical Data Flow

## Runtime Boundary

ChoiceTrain is a static browser application. HTML, CSS, JavaScript, fonts, and branding assets are served locally or through GitHub Pages. The current runtime contains no analytics SDK, advertising tracker, cloud database, external API, LLM request, or automatic upload path.

```text
Teacher input + learner interaction + local photos
                       |
                       v
             ChoiceTrain browser runtime
                |                 |
                v                 v
          localStorage          IndexedDB
      settings, profiles,     photos, session
      declarations, small     history, metadata
      research manifests
                |                 |
                +--------+--------+
                         |
                         v
             Teacher/Admin/Research views
                         |
             explicit download action only
                         |
                         v
       Session / history / research / model JSON or TSV
                         |
                         v
      School or university approved storage and analysis
```

No arrow from the browser runtime to a remote research service exists in the current application.

## Browser Storage

| Store | Current key or store | Contents | Notes |
|---|---|---|---|
| `localStorage` | `choice_train_settings_v140` | Device/session defaults and presentation settings | Synchronous, browser-profile local |
| `localStorage` | `choice_train_learners_v140` | Pupil profiles, aliases, access preferences, governance declarations, recommendation reviews | Can contain personal data |
| `localStorage` | `choice_train_fixed_conditions_v180` | Non-identifying fixed research-condition manifests | Condition IDs must not contain pupil names |
| `localStorage` fallback | `choice_train_sessions_fallback_v130` | Bounded session fallback if IndexedDB is unavailable | Not the preferred long-term store |
| IndexedDB | `choice_train_runtime_v2/sessions` | Session summaries, trials, events, markers, context, and history | Primary history store |
| IndexedDB | `choice_train_runtime_v2/assets` | Familiar face and personalised photo assets | May contain identifiable images |
| IndexedDB | `choice_train_runtime_v2/meta` | Local migration and runtime metadata | No remote synchronisation by ChoiceTrain |

Clearing the browser profile may remove these records. Browser or operating-system sync and backup behaviour is controlled by the device environment, not by ChoiceTrain, and must be considered in the DPIA.

## Collection Sequence

1. A teacher selects a pupil and session configuration.
2. ChoiceTrain freezes pupil, content, presentation, task, protocol, governance, and delivery-context snapshots at Start.
3. The learner's responses create trial records and browser events, including response outcomes, prompt/support context, timing, and eligible touch geometry.
4. Session history is written to IndexedDB, with a bounded localStorage fallback when necessary.
5. Teacher/Admin/Research views derive descriptive summaries locally from the selected session scope.
6. A file is created only after an authorised user selects an export action.

Admin > Learners can delete the selected pupil's profile, owned personalised photos, and matching browser history after confirmation. The operation does not remove downloaded files, browser/device backups, external code mappings, or copies already moved to an approved analysis store.

## Export Paths

| Export | Identifying or sensitive content | Intended use | Automatic transmission |
|---|---|---|---|
| Session JSON | May include pupil/alias, context notes, labels, detailed trials, markers and coordinates | School record or approved research audit | No |
| Stored history JSON | May include multiple pupils and longitudinal records | Authorised local backup/review | No |
| EEG/research JSON or TSV | May include pupil/alias, protocol fields, raw browser markers and trials | Future approved acquisition or research workflow | No |
| Research scope summary | Includes aliases, day-level dates and configured category labels; excludes raw trials/events, images, photo labels, coordinates and free-text notes | Authorised descriptive analysis | No |
| Pseudonymised model-development JSON | Excludes names, aliases, free text, images, photo labels, exact dates, prompt wording, raw coordinates and source IDs | Separately governed future analysis/model review | No |
| Device-readiness JSON | No pupil or session fields; includes browser/device observations | Physical-device validation | No |
| EEG conformance fixture | Deterministic and pupil-free marker catalogue | External parser development | No |

Downloaded files are outside ChoiceTrain's control. The school or university must secure, transfer, retain, and delete them under its approved process.

## Derived Data and Interpretation

ChoiceTrain derives descriptive values such as accuracy, omissions, commissions, reaction-time summaries, touch distance, support/independence, attention-family rows, practice status, retention scheduling, content exposure, fidelity, and recommendation history.

These outputs are not diagnoses, clinical scores, autonomous teaching decisions, evidence of causation, proof of transfer, or proof of neural change. Missing values remain missing where possible. Recommendations are deterministic, local, explainable, and require teacher review before application.

## Restricted Model-Development Flow

The privacy-minimised export is a separate allowlist transform. It is blocked unless every represented pupil profile currently declares separately held model-development authority and has a valid governance review date that is not overdue.

Even after export, the dataset remains pseudonymised personal data. ChoiceTrain does not train a model, create a development/validation/test split, assess fairness, or determine whether the dataset is suitable. Any approved future project must keep learners separated across evaluation splits and apply the controls in [DATA_GOVERNANCE_PLAN.md](DATA_GOVERNANCE_PLAN.md).

## Technical Assurance

Automated checks cover:

- no external runtime requests during browser tests
- rejection of browser network-transport primitives in the V1.8 candidate
- schema and runtime contract alignment
- deterministic procedural lesson replay and one-answer constraints
- full and privacy-minimised export boundaries
- deny-by-default, withdrawn, missing, and overdue governance states
- local migration and persistence without destructive rewrites
- responsive learner and staff layouts in representative browser profiles

These checks do not replace physical-device, staff, learner, safeguarding, information-governance, accessibility, or institutional review.
