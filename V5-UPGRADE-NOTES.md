# V5 upgrade notes — Beyond TOEFL / Reach C Level

## Why V5 exists

V4 was a strong TOEFL C1/C2 preparation site, but a high TOEFL result does not by itself demonstrate the full range of advanced English needed for university, professional and international communication. V5 therefore adds a second, deliberately separate pathway: **Reach C Level**.

## Organisation changes

- Added a main-navigation entry: **Reach C Level**.
- Home now presents the site as **TOEFL + Beyond TOEFL**.
- TOEFL Practice remains intact.
- The old small language-control lab is no longer the main C-level route; the Home calibration drill now opens the relevant Reach C Level module.
- My Progress contains a separate Beyond-TOEFL panel. C-Level results do not alter TOEFL readiness figures.

## C-Level Check

A new 24-item baseline samples three difficult distinctions in each of eight areas:

- Precision & Register
- Advanced Grammar & Range
- Natural English & Fluency
- Nuance / Hedging / Implicit Meaning
- Argumentation
- Synthesis
- Mediation
- Pronunciation & Discourse

Feedback is withheld until the end. The result is explicitly described as a pedagogical snapshot, not CEFR certification.

## Eight Control Labs

Each dimension has 8 automatically corrected items with explanations, for **64 drills total**. The tasks focus on distinctions advanced learners often mishandle despite grammatical accuracy: collocation, stance, concession, register, transferability, source integration, plain-language mediation, contrastive stress, discourse chunking and more.

## C-Level Upgrade Machine

12 transformation tasks require the learner to select the strongest upgrade from a B2-level formulation. The best answer is not simply longer: it must add precision, conceptual distinction, naturalness, qualification or argument structure without unnecessary inflation.

## C-Level Missions

V5 adds eight reusable productive scenarios with four rotating prompts each (**32 prompts**):

1. **The Expert Panel** — synthesise sources and make a recommendation.
2. **The Devil’s Advocate** — construct the strongest counter-case to the learner’s initial instinct.
3. **The Diplomat** — express strong disagreement while preserving professional cooperation.
4. **The Editor** — upgrade a B2 paragraph for precision, register and control.
5. **The Impostor** — repair grammatically possible but pragmatically unnatural English.
6. **The Spin Doctor** — compare framing and produce a neutral synthesis.
7. **The Translator’s Trap** — repair French-influenced English without displaying French task content.
8. **The One-Minute Expert** — explain a complex concept to a non-specialist with audible structure.

Spoken missions offer local browser recording when MediaRecorder is available. Every mission has a six-criterion self-review, and results are stored separately from objective accuracy.

## Progress and data

- New local C-Level state is stored separately from TOEFL scoring data.
- The general practice streak counts both TOEFL and C-Level activity.
- Each C-Level dimension shows:
  - recent objective accuracy;
  - recent mission self-review.
- Unified export now includes both progress stores in one JSON file.
- Import restores C-Level progress when present and remains compatible with older TOEFL-only exports.
- Reset removes both progress profiles.

## English-only consistency

All interface text and task content remain in English. The interference-focused Translator’s Trap uses deliberately unnatural English calques rather than French source sentences.

## Audit performed after integration

### Static/data validation

- all JavaScript files pass syntax checking;
- no duplicate HTML IDs;
- no missing internal navigation destinations;
- service-worker core includes the two new C-Level assets;
- CSS braces balanced;
- 8 C-Level dimensions present;
- exactly 8 drills per dimension;
- every drill has four options and a valid answer index;
- C-Level Check builds exactly 24 items;
- 12 Upgrade Machine tasks valid;
- 8 missions × 4 prompts = 32 mission prompts;
- no French accented source text remains in the new C-Level data.

### Browser interaction regression

The V4 TOEFL suite still passes **20/20** checks, including:

- C-test rendering;
- linked Daily Life questions;
- Listening Practice replay lock;
- Listening Exam one-play lock across linked questions;
- Listen & Repeat 8-second window;
- Build a Sentence completion and Clear behaviour;
- simulation history;
- dynamic ID uniqueness;
- mobile navigation and 390 px overflow.

The new C-Level suite passes **32/32** interaction checks, including:

- navigation;
- all eight module routes;
- feedback/next behaviour;
- Upgrade Machine;
- mission opening, self-review and independent prompt rotation;
- full 24-item C-Level Check;
- eight-dimension results;
- dashboard integration;
- streak integration;
- C-Level state persistence API;
- legacy TOEFL Reading continuity;
- mobile layout;
- readable-font accessibility.

Separate integration tests also confirmed:

- exported JSON contains `cLevelData`;
- reset clears the C-Level profile;
- importing the exported JSON restores the C-Level profile correctly.

## Deliberate limitations

- The site does not claim official CEFR certification.
- Productive C-Level Missions use self-review rather than automated scoring.
- Recording depends on browser microphone support and permission.
- The TOEFL simulator remains a pedagogical non-adaptive approximation and does not claim to reproduce ETS routing or scoring.
