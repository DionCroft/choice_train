# ChoiceTrain Data Governance Plan

## Purpose and Status

This operational plan helps the university, ShowMe, and participating schools decide how ChoiceTrain data will be collected, accessed, exported, retained, withdrawn, and deleted. It is a project template, not legal advice or a completed DPIA.

Complete the decision fields in the approved governance system before identifiable pupil use. Do not commit pupil information, consent evidence, completed DPIAs, security incidents, or school-specific credentials to GitHub.

ChoiceTrain is local-first. The current static application does not transmit pupil, photo, touch, session, research, or recommendation data to a remote service. A person must deliberately download an export before data leaves the browser profile.

## Accountability Record

Record the following outside this repository:

| Decision | Required record |
|---|---|
| Data controller | Named university, school, or joint-controller decision with responsibilities |
| Processors | Any managed-device, backup, storage, analysis, or support provider and its agreement |
| Principal investigator | Named owner of protocol compliance and research records |
| School owner | Named head, research lead, or delegated approver |
| Data protection contact | Named DPO or information-governance route |
| Safeguarding contact | Named DSL or approved safeguarding route |
| Ethics scope | Approval reference, version, decision date, conditions, and amendment history |
| DPIA | Reference, owner, approval date, review date, risks, controls, and residual-risk decision |
| Secure export location | Approved encrypted storage and authorised access group |
| Retention schedule | Approved duration and deletion trigger for every data class |

## Data Inventory and Purpose

| Data class | Example | Primary purpose | Default location | Main risk and control |
|---|---|---|---|---|
| Pupil profile | Name, alias, level, access preferences | Run and personalise sessions | Browser `localStorage` | Use an alias where practical; restrict shared-device access |
| Personalised content | Photo, label, category, relationship, declared attribute | Familiar and personalised questions | Browser IndexedDB | Obtain appropriate authority; avoid unnecessary identifying labels |
| Session context | Context note, readiness, support, break and fidelity fields | Interpret delivery conditions | Session record and local history | Record only relevant classroom context; avoid diagnostic narrative |
| Behavioural trial | Prompt, options, answer, accuracy, omission, commission, support | Teaching review and approved research | Session record and IndexedDB | Apply purpose limitation and pseudonymise before approved model-development use |
| Timing and touch | Reaction time, target geometry, touch coordinates and distance | Interaction and research analysis | Session record and IndexedDB | Treat raw coordinates and precise timings as detailed behavioural data |
| Teacher observation | Confirmed ratings, maintenance, generalisation, transfer-note presence | Human interpretation and planning | Pupil/session history | Keep free text minimal; recommendations remain teacher-reviewed |
| Browser markers | Cue, stimulus, response, feedback, break and artifact markers | Protocol development and later alignment | Session record and exports | Browser timing is not validated EEG synchronisation |
| Governance declaration | Status, purpose flags, review date, internal reference | Fail-closed export control | Pupil profile and full session export | Evidence remains in the approved record system, not ChoiceTrain |
| Ordinary export | Full session JSON or research marker file | School record or approved analysis | User-selected download destination | May contain personal data; move promptly to approved encrypted storage |
| Research summary | Derived rows, aliases, day-level dates, configured category labels | Authorised staff analysis | User-selected download destination | Not anonymous; excludes raw trials but still needs controlled access |
| Model-development export | Pseudonymous participant code and minimised behavioural features | Separately governed future analysis/model review | User-selected download destination | Denied by default; pseudonymised data remains personal data |

The detailed field definitions and exclusions are in [DATA_DICTIONARY.md](DATA_DICTIONARY.md). The technical storage and export paths are in [DATA_FLOW_MAP.md](DATA_FLOW_MAP.md).

The pupil-data-free machine-readable inventory is [`governance/data-inventory-v1.json`](../governance/data-inventory-v1.json). CI checks its storage keys, data classes, export boundaries, deletion support, and contract versions against the candidate runtime.

## Data-Minimisation Rules

- Collect only fields required by the approved teaching or research purpose.
- Prefer pupil aliases in routine interfaces and exports where the full name is unnecessary.
- Keep context notes factual, brief, classroom-relevant, and free from unnecessary medical, family, safeguarding, or diagnostic information.
- Use controlled values instead of free text where they answer the same research question.
- Do not place signed consent, ethics correspondence, safeguarding records, or detailed medical information in ChoiceTrain.
- Do not export image bytes unless the specific workflow requires and authorises them. Current school-friendly session exports record photo metadata rather than including large image data by default.
- Do not treat pseudonymisation as anonymisation. Keep the participant-code mapping separately with stricter access.
- Do not use a full classroom/session export as a future model-training file. Use only the restricted minimisation transform after its separate governance gate is satisfied.

## Access and Shared Devices

Before pupil use, the school should decide:

- which staff roles may create profiles, add photos, read context notes, review Research, and download each export type
- whether each browser profile is assigned to one authorised user or shared by a controlled staff group
- whether browser sync, cloud profile sync, consumer backup, autofill, or unmanaged downloads must be disabled
- how a lost, replaced, reimaged, or disposed device is handled
- where downloaded files are moved and when the local Downloads copy is deleted
- how staff lock the device or exit the learner view between pupils

ChoiceTrain does not provide user authentication or server-side access control. Managed-device and organisational controls therefore remain essential.

## Authority and Purpose Controls

The Admin learner record provides four states:

- `not-recorded`: no research/model authority declaration is available in ChoiceTrain
- `recorded-separately`: evidence is held in the approved external system
- `classroom-only`: ordinary classroom use only
- `withdrawn`: restricted research and model-development use must stop

Research analysis, EEG linkage, and model development are separate purpose flags. They must reflect the external approval; selecting a checkbox does not create authority.

Governance declaration schema `1.1.0` also derives a review status. Restricted model-development export requires every represented profile to have:

- `recorded-separately` status
- model-development purpose approved
- a valid review date that is today or in the future

Missing, invalid, overdue, classroom-only, withdrawn, or absent profiles block the complete model-development export. This is a software safeguard, not verification of the evidence.

## Retention and Deletion Schedule

Do not use one duration for every data class. Complete this schedule in the approved governance record:

| Data class | Approved duration | Start event | Review owner | Deletion method | Legal or research hold |
|---|---|---|---|---|---|
| Local pupil profile and preferences | To decide | Profile creation or last use | To assign | Delete profile/browser data under approved procedure | To decide |
| Local personalised photos | To decide | Upload or last use | To assign | Delete asset/profile/browser data under approved procedure | To decide |
| Local session history | To decide | Session date or study close | To assign | Archive/export if authorised, then prune/delete local history | To decide |
| Full school session exports | To decide | Session date | To assign | Secure deletion from approved store and Downloads | To decide |
| Research dataset and analysis copy | To decide | Study close/publication | To assign | Repository or secure-store deletion/anonymisation process | To decide |
| Pseudonym/code mapping | To decide; normally stricter and separate | Participant enrolment | To assign | Controlled mapping destruction | To decide |
| Model-development dataset | Not enabled until separately approved | Approved dataset creation | To assign | Dataset/version deletion and derived-artifact assessment | To decide |

ChoiceTrain can archive and prune local session history. Admin > Learners can also delete the selected pupil's local profile, owned personalised photos, and matching browser history after an explicit confirmation without deleting other pupil profiles. It cannot delete copies already downloaded, transferred, backed up, mapped externally, or incorporated into analysis. The responsible organisation needs a deletion log covering every approved location.

## Withdrawal Procedure

When a participant withdraws or authority changes:

1. Follow the approved protocol and determine which already collected data may or must be retained.
2. Mark the local profile `withdrawn` to block future restricted model-development export while the withdrawal decision is assessed.
3. Stop new collection or linkage outside any activity still lawfully authorised.
4. Locate local profiles, photos, IndexedDB sessions, downloaded exports, secure analysis copies, backups, and any participant-code mapping covered by the decision.
5. If local deletion is required, export any record that must lawfully be retained, then use Admin > Learners > `Delete selected pupil data` for the current browser.
6. Delete, restrict, or retain every external copy according to the approved withdrawal wording and document the action externally.
7. Confirm whether derived aggregates, publications, trained artifacts, or backups are in scope; ChoiceTrain cannot perform this assessment automatically.

## Incident Response

- Stop further export or sharing if a disclosure, loss, unauthorised access, wrong-pupil record, or corrupted dataset is suspected.
- Preserve only the minimum technical evidence needed for investigation and do not place pupil data in a GitHub issue.
- Notify the school's safeguarding and data-protection routes and the university research team under their incident procedures.
- Assess containment, affected data, people, devices, exports, backups, recipients, notification duties, and corrective action.
- Record non-identifying software findings privately and follow [SECURITY.md](../SECURITY.md) for vulnerability reporting.

## DPIA Completion Checklist

- Describe classroom, research, export, and future model-development purposes separately.
- Map every field, source, storage location, recipient, and deletion route.
- Confirm controller/processor roles and contracts.
- Assess children, SEND context, photographs, behavioural monitoring, detailed touch/timing data, shared devices, and future linkage.
- Confirm lawful basis and any special-category condition where applicable with the responsible DPO.
- Record necessity, proportionality, data minimisation, transparency, participant rights, and accessible information.
- Assess security, device management, browser storage, backups, downloads, re-identification, linkage, bias, and misuse.
- Record consultation with school staff, accessibility/safeguarding leads, pupils or families where appropriate, and the university.
- Approve residual risks and set a review date before live collection.

## Future AI and EEG Boundary

ChoiceTrain currently performs no model training and makes no cloud LLM call. Future model work requires a documented purpose, explicit scope, participant-separated evaluation, bias and subgroup review, human oversight, secure environment, retention/deletion plan, and confirmation that the approved participant information covers that use.

EEG collection is not currently active. Browser markers remain useful for protocol development, but no pupil EEG should be collected or linked until the relevant ethics, site, governance, safety, acquisition, artifact, and measured timing work is approved and complete.

## Release Sign-Off

Information-governance and ethics promotion gates should reference non-identifying external records only. A valid gate entry needs the frozen candidate commit, reviewer role, review date, evidence reference, outcome, and accepted limitations. Passing automated tests cannot approve governance or ethics.
