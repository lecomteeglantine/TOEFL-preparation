# V2 audit and rebuild notes — 21 September 2026

## Bugs fixed

- Prevented Writing timers from losing elapsed time when the countdown reaches 00:00.
- Prevented repeated scoring from repeated Check/Finish clicks.
- Added true one-play behaviour for Listening in Exam Conditions.
- Prevented diagnostic listening items from being answered before audio is played.
- Stopped Writing timers, microphone recording, text-to-speech and Listen & Repeat countdowns when the learner changes view.
- Guarded text-to-speech callbacks so cancelled audio cannot start an obsolete countdown on another screen.
- Removed stale blended-band logic that mixed diagnostic and practice data.
- Preserved legacy diagnostic/saved-word data while resetting older mixed practice scores during migration.
- Kept the service worker network-first and bumped asset/cache versions to reduce stale GitHub Pages deployments.

## Pedagogical rebuild

### Reading
- Complete the Words now uses full C-tests with 10 missing endings.
- Daily Life uses linked questions around one authentic-style practical stimulus.
- Academic Passage uses five linked questions per passage.
- Topics were diversified beyond research methodology: archaeology, ecology, astronomy, art history, economics, sociolinguistics, psychology, public policy, animal cognition and environmental design.

### Listening
- Conversations use two linked questions per audio.
- Announcements use two linked questions per audio.
- Academic Talks use four linked questions per audio.
- Practice mode allows replay only after the learner has committed an answer.
- Exam Conditions allows one play for the complete audio set and withholds feedback until the end of that set.

### Speaking and Writing
- Listen & Repeat uses seven-sentence scenarios with transcript hidden before production.
- Take an Interview uses four-question scenarios and local browser recording.
- Productive Speaking/Writing performance is stored as criteria-based self-review, not as objective TOEFL accuracy.
- Extended Writing uses task-specific timed prompts and C-level self-checks.

### Progress
- The dashboard now separates:
  - diagnostic baseline;
  - objectively scored Reading/Listening/language-control practice;
  - productive Speaking/Writing self-review.
- Error categories are logged and ranked so learners can see recurring weaknesses.
- Recommended practice is generated from weak objective categories and missing productive practice.

### Organisation
- Main navigation simplified to Home / Test / Practice / My Progress / Resources / Test Day.
- Reading, Listening, Speaking, Writing, Vocabulary and C-Level Lab are grouped in the Practice hub.
- Test contains the baseline diagnostic, a focused simulation and access to targeted practice.

## Deliberate limitations

- The simulation is labelled as a focused, non-adaptive practice simulation. It does not claim to reproduce ETS adaptive routing or official scoring.
- Browser text-to-speech is retained for a server-free site. Recorded human voices would be a worthwhile future improvement.
- The site does not send student data to a server; progress remains local unless the learner exports it.
