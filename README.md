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

### Positive Reinforcement

Each task is followed by feedback and reward elements designed to encourage continued engagement. These can include visual effects, progress markers, and star-based rewards.

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

## Repository Files

- `index.html` is the main published entry point for GitHub Pages.
- `choice_train_V1.2.1.html` is the versioned snapshot of the same build.

## GitHub Pages

To publish on GitHub Pages:

1. Open the repository settings on GitHub.
2. Go to `Pages`.
3. Set the source to `Deploy from a branch`.
4. Choose branch `main` and folder `/(root)`.
5. Save, then wait a minute or two for the site to go live.
