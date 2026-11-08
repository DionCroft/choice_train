# Ethics and Research Scope

## Status

The project owner confirmed on 8 November 2026 that the university has granted full ethics approval for the currently approved ChoiceTrain research. The approval document, reference number, approved protocol version, conditions, and participant materials are controlled records and are not stored in this public repository.

This repository statement records project scope only. It is not the approval evidence and does not extend the university decision beyond the protocol that was actually reviewed.

| Activity | Current project position | Repository control |
|---|---|---|
| Software engineering with synthetic data | In scope | Automated tests use synthetic profiles and generated assets |
| Classroom and behavioural research | Reported as university-approved | The principal investigator must confirm each activity matches the approved protocol before collection |
| Staff usability and physical-device testing | May proceed under the approved institutional and school process | Use synthetic data unless the approved protocol explicitly covers participant data |
| EEG acquisition or EEG-linked analysis | Not currently planned and not treated as authorised by this statement | EEG mode remains preparatory; hardware timing and EEG promotion gates remain open |
| Pupil-facing cloud AI or LLM calls | Not implemented | Candidate checks reject external runtime transport and tests verify no external requests |
| Training an AI model with pupil data | Not currently performed by ChoiceTrain | The model-development export is denied by default and requires a current, purpose-specific local authority declaration |
| Diagnostic, medical, or autonomous educational decision-making | Out of scope | Product wording and exports state non-diagnostic and human-review boundaries |

## Before Approved Pupil Data Collection

The principal investigator and participating school should confirm and retain outside GitHub:

1. University approval reference, decision date, approved protocol version, and any conditions.
2. Confirmation that the proposed school, participant group, recruitment route, tasks, measures, session schedule, and data fields match the approved protocol.
3. School or site permission and named safeguarding and data-protection contacts.
4. The approved parent or carer information and consent route, accessible pupil information and assent route, and withdrawal process.
5. The applicable DPIA, privacy information, controller and processor roles, access rules, retention schedule, deletion procedure, and secure export location.
6. Researcher training, DBS or equivalent organisational checks where required, distress and stopping rules, and an incident escalation route.

ChoiceTrain stores only a local declaration and optional non-identifying governance reference. It must not store signed consent forms, detailed approval correspondence, safeguarding records, or participant-identifying ethics evidence.

## Change-Control Triggers

Seek advice from the university ethics or research-governance route before implementing or collecting data for a material change such as:

- adding EEG acquisition, physiological sensors, or hardware-trigger synchronisation
- using a different participant group, school type, recruitment route, or setting
- adding new potentially sensitive data, recordings, photographs, or linkage sources
- changing session burden, incentives, stopping rules, or risk profile
- adding cloud storage, remote analytics, external APIs, or pupil-facing AI
- using pupil data for model training, validation, commercial development, or a secondary purpose not described in the approved materials
- sharing data with a new organisation or outside the approved secure environment
- changing retention, anonymisation, publication, or withdrawal arrangements

An amendment or fresh review may be required. The research team should follow the university's determination rather than inferring approval from the software's capabilities.

## Research Claims

The current behavioural study may investigate observed changes associated with repeated attention-training practice. ChoiceTrain does not by itself demonstrate causation, neural pathway formation, clinical benefit, diagnosis, or transfer to other settings.

Future EEG work should be described as investigating pre-specified behavioural and electrophysiological measures. It will require its own active protocol decision, acquisition-system validation, hardware timing evidence, artifact plan, stopping procedures, analysis plan, and governance review before pupil EEG collection begins.

## Relationship to Product Ethics

ChoiceTrain should also maintain product-level ethical and safeguarding principles covering learner welfare, accessibility, choice, breaks, withdrawal, minimisation, human oversight, transparency, bias review, retention, and incident handling. Those principles support good practice but do not replace university ethics approval, school permission, safeguarding review, or data-protection obligations.

See [DATA_GOVERNANCE_PLAN.md](DATA_GOVERNANCE_PLAN.md), [DATA_FLOW_MAP.md](DATA_FLOW_MAP.md), and [V1.8.0_EXTERNAL_VALIDATION_PROTOCOL.md](V1.8.0_EXTERNAL_VALIDATION_PROTOCOL.md).
