# ChoiceTrain

ChoiceTrain is an offline, touch-first interactive learning prototype designed to support structured choice-making, attention training, and early cognitive development. It is aimed at SEND and neurodiverse learners, especially those who benefit from simplified interfaces, repetition, familiar stimuli, and immediate feedback.

The prototype runs as a single self-contained HTML application, making it easy to open in a browser without external services, installation steps, or cloud dependencies.

## Live Site

GitHub Pages URL:
https://dioncroft.github.io/choice_train/

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

Difficulty increases progressively across six levels, moving from single large targets to more complex multi-object and attention-based interactions. Learners can advance automatically when success thresholds are met.

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

The practitioner dashboard can present:

- accuracy trends
- reaction time trends
- touch distance trends
- attention scores
- question-by-question review
- recommendations for pacing or difficulty

### Attention Modelling and Heatmaps

The prototype estimates learner attention using response timing and touch accuracy, then classifies performance into support levels such as Strong, Moderate, Emerging, or Needs Support.

Per-task heatmaps also help practitioners review target engagement, touch clustering, and motor precision visually.

Note:
The attention score is an exploratory in-app indicator for practitioner reflection. It is not a validated diagnostic or clinical measure.

### Positive Reinforcement

Each task is followed by feedback and reward elements designed to encourage continued engagement. These can include visual effects, progress markers, and star-based rewards.

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

The current published build also adds clearer release visibility:

- an active build label in the practitioner panel so it is easy to see which version is running
- a footer version chip for quick at-a-glance confirmation during sessions
- version metadata embedded into exported session files
- imported dashboard files can show their originating build when that metadata is present
- a new versioned release snapshot as `choice_train_V1.2.3.html`

## Why These Changes Help SEND Learners

The newer dashboard and interaction changes were chosen to make the prototype fairer, calmer, and more useful for practitioner decision-making.

- Release-based touch confirmation helps reduce accidental answers for learners with variable motor control, impulsive touches, or exploratory hand movements.
- Repeat-aware scoring gives a clearer picture of what a learner finally achieved, rather than mixing first attempts and retries into one mastery score.
- Cross-session heatmap review helps practitioners notice patterns that are easy to miss in a single short session, such as consistent left-right bias, repeated near-misses, or improving target accuracy over time.
- Session and learner labels make it easier for staff, families, and therapists to review data together without confusing one learner or session with another.
- Storage warnings reduce the risk of silent data loss, which matters when practitioners are using logs to judge progress or plan next steps.

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

1. Open `index.html` in a modern browser.
2. Use full screen if you want the learner interface to be more immersive.
3. Configure the session in Practitioner Mode, then begin the activity.

## Repository Workflow

- early prototypes and experiments should live in `Experimental_Choice_Train`
- stable builds that are ready to publish should then be promoted into `GitHub/choice-train`
- `index.html` is the GitHub Pages entry point
- versioned snapshots are kept alongside it for traceability

## Repository Files

- `index.html` is the main published entry point for GitHub Pages
- `choice_train_V1.2.1.html` is the earlier versioned snapshot
- `choice_train_V1.2.2.html` is the previous stable snapshot
- `choice_train_V1.2.3.html` is the current versioned snapshot

## GitHub Pages

To publish on GitHub Pages:

1. Open the repository settings on GitHub.
2. Go to `Pages`.
3. Set the source to `Deploy from a branch`.
4. Choose branch `main` and folder `/(root)`.
5. Save, then wait a minute or two for the site to go live.
