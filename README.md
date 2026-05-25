# ChoiceTrain

ChoiceTrain is an offline, touch-first interactive learning prototype designed to support structured choice-making, attention training, and early cognitive development. It is aimed at SEND and neurodiverse learners, especially those who benefit from simplified interfaces, repetition, familiar stimuli, and immediate feedback.

The published build runs as a browser-based HTML prototype with no cloud dependency. The current release (`V1.3.2`) uses a paired HTML and JavaScript snapshot so the runtime can stay cleaner, faster, and easier to validate before future prototypes are promoted from the experimental workspace into the live GitHub Pages copy.

## Live Site

GitHub Pages URL:
https://dioncroft.github.io/choice_train/

Current published build:
`V1.3.2`

Current experimental build:
future prototypes continue in the local `Experimental_Choice_Train` workspace before promotion

## Project Overview

ChoiceTrain is built around short, repeatable learning interactions that help learners practise:

- recognition
- attention
- categorisation
- intentional decision making
- early touch interaction and motor control

The design is grounded in touch-first accessibility principles, with large visual targets, minimal distractions, guided progression, and positive reinforcement.

## Two Main Modes

### Learner Mode

Learner Mode provides a calm, distraction-free experience focused on simple interaction. It is designed for pupils who may have limited reading ability, reduced fine motor control, or early-stage cognitive learning needs.

Core characteristics:

- large touch targets
- simple prompts
- immediate visual feedback
- reward-based progression
- full-screen friendly layout

### Practitioner Mode

Practitioner Mode gives educators, therapists, carers, or parents the tools to configure sessions and review performance.

It includes:

- session setup controls
- task configuration
- learner customisation
- touch scaling controls
- real-time analytics
- heatmaps and performance review
- export and import of session data

## Key Features

### Touch-First Learning

The prototype is designed primarily for touchscreen use. It reduces cognitive load by keeping interactions simple and visual, so learners can participate with minimal instruction.

### Progressive Choice-Making Tasks

The system supports a range of activities, including:

- touching a single familiar target
- finding an object among distractors
- discriminating between similar objects
- identifying categories
- open-ended choice tasks
- attention-based tasks

The current published build uses a 10-stage pathway that separates foundational touchscreen learning from a later CPAT-style attention suite:

- Level 1: touch screen
- Level 2: touch object
- Level 3: moving target
- Level 4: find object
- Level 5: discriminate object
- Level 6: find category
- Level 7: CPAT sustained attention
- Level 8: CPAT selective-spatial attention
- Level 9: CPAT orienting attention
- Level 10: CPAT executive attention

### Two-Stage Prompting

ChoiceTrain can present a concept first and then ask the learner to identify that same target among multiple options. This supports recognition, repetition, and memory formation. For very early learners, the system can also run in simple single-target mode.

### Personalised Learning Content

The system supports familiar-image learning by allowing practitioners to use personalised content such as:

- parents or carers
- teachers
- favourite toys
- favourite animals
- food items
- places and activities

This helps create emotionally meaningful and motivating interactions for individual learners.

### Adaptive Touch Scaling

A major feature of the prototype is its adaptive touch system, designed to improve accuracy across different screens and devices.

This includes:

- screen-aware touch scaling
- larger effective touch areas on smaller screens
- different behaviour for touch and mouse input
- adjustable manual touch scale
- automatic scaling controls
- real-time hit-radius feedback

### Touch Debugging and Validation

The prototype also includes debugging tools for validating touch behaviour and diagnosing alignment issues.

These tools can show:

- touch points
- target centres
- hit radius
- movement trails
- touch-to-target distance

### Data Logging and Analytics

ChoiceTrain records structured interaction data that can be used to review progress and adapt future sessions.

Examples include:

- response time
- accuracy
- touch position
- distance from target
- session timing
- interaction patterns
- EEG-ready event markers
- block summaries
- fidelity and dosage context
- observational artifact notes

The practitioner dashboard can present:

- accuracy trends
- reaction time trends
- touch distance trends
- omission and commission counts
- reaction time variability
- domain-specific attention summaries
- block-level EEG and artifact summaries
- fidelity and dosage indicators
- question-by-question review
- recommendations for pacing or difficulty

### Attention Modelling and Heatmaps

The current published build keeps an exploratory engagement indicator for quick practitioner review, but `V1.3.2` uses a more research-aligned model that emphasises task-family data such as omissions, commissions, mean reaction time, reaction time variability, and separate summaries for sustained, selective-spatial, orienting, and executive tasks.

Per-task heatmaps also help practitioners review target engagement, touch clustering, and motor precision visually.

Note:
any attention-style metric in ChoiceTrain should still be treated as exploratory practitioner-facing data. It is not a validated diagnostic or clinical measure.

### Positive Reinforcement

Each task is followed by feedback and reward elements designed to encourage continued engagement. These can include visual effects, progress markers, and learner-selectable reward styles such as stars, bubbles, music, or train-themed reinforcement.

## V1.2.2 Additions

V1.2.2 introduced the following stability and review improvements:

- history-aware heatmap scopes for `Current session`, `Current learner history`, `All stored history`, and imported data when available
- clearer heatmap labels showing question, attempt, task, and whether the answer was correct or needed support
- richer heatmap captions with learner, session, selected answer, reaction time, and touch-distance context
- repeat-aware scoring so dashboards and progression use the latest outcome per question instead of overcounting retries
- corrected automatic task sequencing after single-target trials
- touch selection on release rather than on initial contact, reducing accidental activations
- browser storage warnings when local persistence is full or unavailable
- a versioned release snapshot as `choice_train_V1.2.2.html`

## V1.2.3 Additions

V1.2.3 added clearer release visibility:

- an active build label in the practitioner panel so it is easy to see which version is running
- a footer version chip for quick at-a-glance confirmation during sessions
- version metadata embedded into exported session files
- imported dashboard files can show their originating build when that metadata is present
- a new versioned release snapshot as `choice_train_V1.2.3.html`

## V1.2.4 Additions

V1.2.4 added a more professional build and release surface:

- a dedicated `About / Build Info` section in practitioner mode
- clearly presented release, status, base commit, build date, source snapshot, live URL, and repository URL
- one-click copy actions for build information and the live site URL
- stronger release tracking through `CHANGELOG.md`
- a new versioned release snapshot as `choice_train_V1.2.4.html`

## V1.3.0 Release

`V1.3.0` was the previous published build and marked the larger research and production-readiness release for ChoiceTrain.

Major additions in this release:

- a cleaned runtime split into `choice_train_V1.3.0.html` and `choice_train_V1.3.0.js`, replacing the earlier duplicate-function generations with one active source of truth
- a universal trial schema across the whole app, not just the later attention tasks
- per-question response windows, inter-trial intervals, timeout handling, omission logging, commission-style error logging, and reaction-time variability metrics across the full ChoiceTrain pathway
- a structured prompt and support ladder with prompt level, support code, independence status, and assisted-versus-spontaneous capture
- a clearer developmental progression that starts with touching the screen itself, then touching the target, then moving targets, then object and category reasoning
- a fuller CPAT-style suite covering sustained attention, selective-spatial attention, orienting, and executive control instead of a single `Touch Star` screen
- learner baseline and school-context capture including communication mode, motor access, adaptive-functioning band, teacher ratings, fatigue, sensory state, maintenance status, generalisation status, and classroom transfer notes
- stronger history handling with IndexedDB-backed session records, compressed image storage, exportable session history, learner archiving, and pruning tools for long-term school use
- performance-focused changes including sampled touch-move logging, batched persistence, throttled dashboard refresh in learner mode, and cached dashboard and heatmap aggregation
- EEG-friendly event logging foundations through event markers such as cue onset, stimulus onset, prompt application, trial completion, and session start or completion
- an in-app `Documentation and terminology` section so practitioners can understand session settings, CPAT terms, support levels, and data labels without leaving the app
- a Playwright-based browser regression suite covering the full `1-10` auto path plus prompt, repeat, omission, commission, documentation, and history-export behavior

## V1.3.1 Release

`V1.3.1` was the previous published build and extended the research and production-readiness release with more engaging CPAT-style task variants.

Major additions in this release:

- a new versioned published snapshot as `choice_train_V1.3.1.html` with paired runtime `choice_train_V1.3.1.js`
- one new themed-but-measurably comparable variant for each CPAT-style family:
  `Signal Station`, `Ticket Hunt`, `Platform Pointer`, and `Traffic Lights`
- visible in-task `Variant` and `Rule` cards so the active instruction stays stable on screen for learners and staff
- richer trial export detail through `task_variant`, `variant_label`, and rule-aware logging across the new games
- an updated Playwright regression suite covering the new variant rotation and the corrected `Traffic Lights` interaction
- a corrected `Traffic Lights` flow that now uses a red wait phase before the learner taps on green, rather than ending the item automatically on a correct wait

## V1.3.2 Release

`V1.3.2` is the current published build and promotes the school-facing research layer into the live prototype.

Major additions in this release:

- a new versioned published snapshot as `choice_train_V1.3.2.html` with paired runtime `choice_train_V1.3.2.js`
- `EEG research mode` with exact event markers for prompt onset, cue onset, stimulus onset, target-present or no-go state, response, omission, commission, feedback onset, break onset, break offset, artifact notes, and session completion
- automatic fixed block pauses plus ERP-friendly marker exports for later EEG alignment work
- observational artifact and data-quality tracking for movement, blink, speech, cap adjustment, and interrupted trials
- learner-facing `Help`, `Break`, and `Stop` controls plus quick preference, reward, theme, and prompt-style choices
- practitioner fidelity tools including a fidelity checklist, dosage tracking, and coaching review notes
- family-specific CPAT dashboards for sustained, selective-spatial, orienting, and executive attention rather than one generic attention call
- active-control scaffolding so future publication work can compare a matched non-core-demand condition against the training pathway
- a corrected `Signal Station` flow that now behaves as a true red-wait then green-tap sustained-attention round, instead of silently finishing on a passive wait
- updated Playwright coverage for EEG breaks, EEG export, learner help, active control, and the corrected sustained-attention flow

## Why These Changes Help SEND Learners

The newer dashboard and interaction changes were chosen to make the prototype fairer, calmer, and more useful for practitioner decision-making.

- Release-based touch confirmation helps reduce accidental answers for learners with variable motor control, impulsive touches, or exploratory hand movements.
- Repeat-aware scoring gives a clearer picture of what a learner finally achieved, rather than mixing first attempts and retries into one mastery score.
- Cross-session heatmap review helps practitioners notice patterns that are easy to miss in a single short session, such as consistent left-right bias, repeated near-misses, or improving target accuracy over time.
- Session and learner labels make it easier for staff, families, and therapists to review data together without confusing one learner or session with another.
- Storage warnings reduce the risk of silent data loss, which matters when practitioners are using logs to judge progress or plan next steps.
- A structured prompt ladder helps schools see whether success was independent, lightly prompted, or heavily assisted, which is often more meaningful than raw accuracy alone.
- Separating the developmental touch pathway from the later CPAT-style attention suite reduces overclaiming and makes it easier to match task demands to the learner's stage.

## Research-Informed Rationale

The design and the recent changes were informed by peer-reviewed literature. These papers do not validate ChoiceTrain itself, but they do support the direction of the interaction design, learner support approach, and practitioner review features.

### Touch interaction and reducing unnecessary distraction

- Kirkorian HL, Choi K, Pempek TA. *All Tapped Out: Touchscreen Interactivity and Young Children's Word Learning*. Front Psychol. 2016.
  Link: https://pmc.ncbi.nlm.nih.gov/articles/PMC5388766/
  Why it matters here: this paper supports the idea that simple, on-task interaction can help learning, while overly distracting or irrelevant interaction can get in the way. That fits ChoiceTrain's large targets, reduced clutter, guided prompts, and the move to a cleaner release-to-confirm touch flow.

- *Ability of children to perform touchscreen gestures and follow prompting techniques when using mobile apps*. 2020.
  Link: https://pmc.ncbi.nlm.nih.gov/articles/PMC7303424/
  Why it matters here: this work supports choosing interaction patterns that match children's motor abilities and using practical prompting strategies. That aligns with single-target starts, scaffolded task progression, large tap areas, and the need to avoid punishing accidental contact.

### Practitioner review, fidelity, and better progress decisions

- Brady L, Padden C, McGill P. *Improving procedural fidelity of behavioural interventions for people with intellectual and developmental disabilities: A systematic review*. J Appl Res Intellect Disabil. 2019.
  Link: https://pubmed.ncbi.nlm.nih.gov/30968529/
  Why it matters here: the review found a positive relationship between implementation fidelity and client outcomes. In ChoiceTrain, clearer history-aware dashboards, repeat-aware scoring, and exportable review data are intended to help staff notice what support was actually working and keep delivery more consistent across sessions.

- Wang T, Ma Y, Du X, et al. *Digital interventions for autism spectrum disorders: A systematic review and meta-analysis*. Pediatr Investig. 2024.
  Link: https://pubmed.ncbi.nlm.nih.gov/39347529/
  Why it matters here: the broader evidence base suggests digital interventions can be useful when carefully designed and monitored. That supports building transparent review tools, keeping the app simple, and treating analytics as practice-support information rather than as a black-box judgement.

### Motivation, preference, and learner voice

- DeLeon IG, Fisher WW, Rodriguez-Catter V, et al. *Examination of relative reinforcement effects of stimuli identified through pretreatment and daily brief preference assessments*. J Appl Behav Anal. 2001.
  Link: https://pubmed.ncbi.nlm.nih.gov/11800185/
  Why it matters here: this supports the idea that learner motivation can change and that preferred reinforcers matter. That fits ChoiceTrain's use of personalised images, reward flow, and the longer-term plan to strengthen preference-based session setup.

- O'Brien MJ, Pauls AM, Schieltz KM, et al. *Mand Modality Preference Assessments among High- and Low-Tech Options for Individuals with Intellectual and Developmental Disabilities: A Systematic Review*. 2024.
  Link: https://pubmed.ncbi.nlm.nih.gov/38405296/
  Why it matters here: this review supports offering more than one communication or response route where possible. That is relevant to ChoiceTrain's longer-term direction around flexible response modes, personalised content, and not assuming one interaction style works for every learner.

- Wehmeyer ML. *Self-determination in adolescents and adults with intellectual and developmental disabilities*. Curr Opin Psychiatry. 2020.
  Link: https://pubmed.ncbi.nlm.nih.gov/31833947/
  Why it matters here: this supports giving learners meaningful choice and some control over activity flow. That fits open-ended choice tasks, repeat/next options, and the broader goal of making the app supportive rather than purely compliance-driven.

### CPAT clarification and later-level attention tasks

As of May 25, 2026, the published build in this repository is now `V1.3.2`, and it no longer treats `CPAT attention` as a single `Touch Star` screen.

The live pathway now separates later attention work into four CPAT-style families:

- sustained attention
- selective-spatial attention
- orienting
- executive control

`V1.3.2` keeps those themed variants inside the same families rather than turning them into unrelated mini-games. For example, sustained attention can appear as `Star Watch` or `Signal Station`, and executive control can appear as `Middle Arrow` or `Traffic Lights`.

That structure is much closer to the CPAT papers than the earlier single target-detection snapshot, although it should still be described as `CPAT-style` rather than a formally validated CPAT implementation.

- Shalev L, Tsal Y, Mevorach C. *Computerized progressive attentional training (CPAT) program: effective direct intervention for children with ADHD*. Child Neuropsychol. 2007.
  Link: https://pubmed.ncbi.nlm.nih.gov/17564853/
  Why it matters here: the original CPAT model was broader than a single repeated target. The abstract describes four structured task sets targeting sustained attention, selective attention, orienting, and executive attention, with automatic progression based on performance and structured feedback.

- Muller Spaniol M, Mevorach C, Shalev L, et al. *Attention training in autism as a potential approach to improving academic performance: a school-based pilot study*. 2018.
  Link: https://pure-oai.bham.ac.uk/ws/portalfiles/portal/44531197/Muller_Spaniol_et_al_Attention_training_in_Autism_Autism_and_Developmental_Disorders.pdf
  Why it matters here: this school-based ASD pilot describes CPAT in a much fuller way, using a computerized continuous performance task for sustained attention, a conjunctive search task for selective-spatial attention, and a shift Stroop-like task for executive attention. It also used progressive difficulty, reaction-time-sensitive advancement, and school-relevant outcome measures.

- Muller Spaniol M, Mevorach C, Shalev L, et al. *Attention training in children with autism spectrum disorder improves academic performance: A double-blind pilot application of the computerized progressive attentional training program*. Autism Res. 2021.
  Link: https://pubmed.ncbi.nlm.nih.gov/34227246/
  Why it matters here: this later ASD pilot reported improvements in maths, reading, writing, and attention that were maintained at follow-up. That supports the idea that attention training can matter in school settings, but also reinforces that the training should cover more than a single target-detection screen if it is going to be described as CPAT-like.

Practical design implication:

- a lone `Touch Star` screen is better described as a simple sustained-attention or target-detection exercise
- a fuller CPAT-style pathway should include target detection, distractor filtering, switching or inhibition demands, progressive difficulty, and advancement based on both accuracy and response timing

## Recommended Data To Collect

The touch and timing data are useful, and the `V1.3.2` release now captures much more of the recommended foundation across the whole app. That includes omissions, commissions, mean reaction time, reaction time variability, prompt level, support code, independence status, attention-domain tags, task variants, maintenance status, generalisation status, teacher ratings, classroom transfer notes, fidelity data, learner preference context, block summaries, and EEG-ready event markers.

The literature still suggests that a stronger SEND-facing training platform should continue to expand and validate broader behavioural, educational, and follow-up outcomes.

- Omission errors, commission errors, mean reaction time, and reaction time variability for any attention task.
  Why: continuous performance task literature repeatedly treats missed targets, false alarms, and RT variability as core attention measures rather than relying on simple mean speed alone. Links: https://pmc.ncbi.nlm.nih.gov/articles/PMC5858546/ and https://pmc.ncbi.nlm.nih.gov/articles/PMC3441931/

- Which attention function was being trained on each item: sustained attention, selective-spatial attention, orienting, or executive control.
  Why: the CPAT literature is structured around different attention functions, not one generic "attention score". That makes it easier to see whether a learner is improving in vigilance, distractor filtering, shifting, or conflict control. Links: https://pubmed.ncbi.nlm.nih.gov/17564853/ and https://pure-oai.bham.ac.uk/ws/portalfiles/portal/44531197/Muller_Spaniol_et_al_Attention_training_in_Autism_Autism_and_Developmental_Disorders.pdf

- Independence and support data such as prompt level, repeat count, whether the answer was spontaneous or assisted, and whether the learner needed a model or reminder.
  Why: for SEND practice, accuracy alone is not enough. Staff need to know whether success was independent, lightly supported, or heavily scaffolded. This is partly an inference from the broader fidelity literature already cited above, and it helps practitioners make safer progression decisions.

- Maintenance and generalisation outcomes, not just same-session gains.
  Why: both ASD and IDD attention-training studies measured follow-up and broader outcomes such as maths, reading, writing, executive functioning, and behaviour. Links: https://pubmed.ncbi.nlm.nih.gov/34227246/ and https://pubmed.ncbi.nlm.nih.gov/28257246/

- Classroom-linked outcomes such as teacher-rated attention, work completion, copying or writing fluency, numeracy, reading, confidence, and independence.
  Why: the school-based ASD pilot gathered academic measures and teacher or TA interviews, and the IDD trial assessed literacy, numeracy, executive functioning, and behavioural or emotional outcomes. Those are closer to what SEND schools actually need to see. Links: https://pure-oai.bham.ac.uk/ws/portalfiles/portal/44531197/Muller_Spaniol_et_al_Attention_training_in_Autism_Autism_and_Developmental_Disorders.pdf and https://pubmed.ncbi.nlm.nih.gov/28257246/

- Baseline learner characteristics that may predict benefit, especially adaptive functioning and pre-intervention attention ability.
  Why: response to digital cognitive training varies, and one IDD study found that lower adaptive functioning and stronger pre-intervention selective attention were linked to different training gains. Link: https://pubmed.ncbi.nlm.nih.gov/39818559/

- Session context variables such as time of day, duration tolerated, breaks requested, sensory regulation, and fatigue or frustration markers.
  Why: these are useful implementation variables in real school contexts and can help distinguish a true cognitive change from a good or bad day. This point is an inference from the school-based implementation literature and is especially relevant for SEND deployment.

## EEG And Neural Measurement Note

If ChoiceTrain is later paired with EEG, the safest research framing is that repeated training may support neuroplasticity and functional improvement, but that claim should remain exploratory until it is supported by well-controlled neural and behavioural data.

The `V1.3.2` release now logs a much stronger first research set for EEG-linked studies. It records session start, prompt onset, cue onset, stimulus onset, target-present or no-go state, response, omission, commission, feedback onset, prompted support changes, break onset and offset, artifact notes, exports, and session completion.

For later EEG-linked studies, it would still be helpful to keep or strengthen event markers for:

- cue onset
- target onset
- response time
- correct hits
- omissions
- commission errors
- repeats and prompted trials

Research direction:

- Wang JW, Zhang DW, Johnstone SJ. *Portable EEG for assessing attention in educational settings: A scoping review*. Acta Psychol (Amst). 2025.
  Link: https://pubmed.ncbi.nlm.nih.gov/40154053/
  Why it matters here: this review supports the feasibility of portable EEG in educational settings, but it also shows that methods are still heterogeneous and the field is still developing.

- Reviews of ERP work in attention difficulties suggest that components such as P300, cue-P3, CNV, and N2 are plausible exploratory markers for target detection, preparation, and inhibitory control, rather than simple replacements for behavioural data.
  Links: https://pmc.ncbi.nlm.nih.gov/articles/PMC7981253/ and https://www.frontiersin.org/journals/human-neuroscience/articles/10.3389/fnhum.2022.767789/full

- Alves de Oliveira L, da Silva JF, de Souza Lapolli JL, et al. *Effects of School-Based Neurofeedback Training on Attention in Students with Autism and Intellectual Disabilities*. 2025.
  Link: https://pubmed.ncbi.nlm.nih.gov/38806749/
  Why it matters here: this SEND-relevant study suggests school-based EEG-linked intervention may improve sustained attention to simple stimuli, but it does not justify assuming broad cognitive transfer without collecting careful behavioural and follow-up data alongside the EEG.

## Session Structure

Sessions are short and configurable to match the learner's needs and attention span. Practitioners can adjust:

- number of questions
- session duration
- number of objects shown
- progression behaviour
- timing between prompts

Typical sessions are designed to be focused and manageable rather than long or cognitively heavy.

## Running the Prototype

The project is fully offline and browser-based.

To run it locally:

1. Open `index.html` if you want the current published GitHub Pages build.
2. Open `choice_train_V1.3.2.html` if you want the versioned published snapshot directly.
3. Keep `choice_train_V1.3.2.js` beside the HTML file, because `V1.3.2` loads its runtime from the paired script file.
4. Use full screen if you want the learner interface to be more immersive.
5. Configure the session in Practitioner Mode, then begin the activity.

## Browser Regression Testing

The repository now includes a Playwright browser regression suite so the published build can be checked before future releases are promoted.

To run the suite locally:

1. Run `npm install`
2. Run `npx playwright install chromium`
3. Run `npm run test:browser`

The current suite covers:

- the full auto path across Levels `1-10`
- CPAT-style variant rotation for sustained, selective-spatial, orienting, and executive tasks
- reward-screen auto advance
- omissions and commissions
- prompt-level logging
- repeat-question behavior
- session-history persistence and export
- in-app documentation visibility

## Repository Workflow

- early prototypes and experiments should live in `Experimental_Choice_Train`
- stable builds that are ready to publish should then be promoted into `GitHub/choice-train`
- `index.html` is the GitHub Pages entry point
- versioned snapshots are kept alongside it for traceability
- the browser regression suite should be run against the experimental build before promotion whenever practical

## Repository Files

- `index.html` is the main published entry point for GitHub Pages
- `choice_train_V1.2.1.html` is the earlier versioned snapshot
- `choice_train_V1.2.2.html` is the previous stable snapshot
- `choice_train_V1.2.3.html` is the previous stable snapshot
- `choice_train_V1.2.4.html` is the earlier stable snapshot
- `choice_train_V1.3.0.html` is the previous published snapshot
- `choice_train_V1.3.0.js` is the paired runtime for the previous published snapshot
- `choice_train_V1.3.2.html` is the current versioned published snapshot
- `choice_train_V1.3.2.js` is the paired runtime for the current published snapshot
- `package.json`, `playwright.config.js`, `scripts/`, and `tests/` support the browser regression workflow
- `stamp-build.ps1` stamps build metadata into inline or external runtime files during promotion work
- `CHANGELOG.md` tracks released and unreleased version history

## Release Tracking

- the currently published build can be checked in the app UI from the version label and footer chip
- exported session files include build metadata so review files can be traced back to the active app version
- `stamp-build.ps1` can be used to stamp version, release label, commit, channel, source file, and related metadata before promotion
- `CHANGELOG.md` records the promoted release history and the current unreleased work

## GitHub Pages

To publish on GitHub Pages:

1. Open the repository settings on GitHub.
2. Go to `Pages`.
3. Set the source to `Deploy from a branch`.
4. Choose branch `main` and folder `/(root)`.
5. Save, then wait a minute or two for the site to go live.
