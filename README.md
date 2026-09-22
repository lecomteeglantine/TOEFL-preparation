# Homemade TOEFL Trainer + Reach C Level · V6

An independent browser-based platform for advanced learners. V6 keeps the TOEFL iBT 2026 practice pathway and the separate **Beyond TOEFL — Reach C Level** pathway, while fixing the state, progression and scoring inconsistencies found in a deep internal audit of V5.

## Deploy on GitHub Pages

Upload these files together at the root of the repository, replacing the previous versions:

- `index.html`
- `styles.css`
- `data.js`
- `clevel-data.js`
- `app.js`
- `clevel.js`
- `manifest.webmanifest`
- `sw.js`

The site uses versioned assets and a network-first service worker. V6 uses a new cache version, so the latest assets replace older cached copies after deployment.

## What V6 fixes

### Persistent progression

V5 contained large practice banks, but several modules kept their current position only in JavaScript memory. Reloading the page could therefore send a learner back to the first exercise. V6 persists the current position and selected sub-section for Reading, Listening, Speaking, Writing and Reach C Level.

### Simulation rotation

Practice Simulation history is still limited to the 10 most recent results for a clean dashboard, but the total simulation-run counter is now stored separately. This prevents the simulation content from becoming stuck once the visible history reaches 10 attempts.

### Reach C Level consistency

- The hidden legacy C-Level Lab has been removed completely. There is now one C-level pathway only: **Reach C Level**.
- C-Level Check retakes rotate through alternative items where the bank allows instead of always repeating the first form.
- Module, Upgrade Machine and mission positions survive reloads.
- Mission timers and recordings are cleaned up when the learner changes prompt, resets progress or imports a file.
- Productive missions now use **dimension-specific review criteria and scores** instead of applying one generic total to every dimension.
- Pronunciation & Discourse is evaluated through stress/chunking, pacing/linking/articulation and meaningful intonation rather than through unrelated criteria.

### Content consistency

A misleading use of `allege` as a neutral academic reporting verb was replaced by `argue`. TOEFL overview figures and version labels have also been brought into line with the current V6 content.

## Two deliberately separate pathways

### TOEFL preparation

Diagnostic, Reading, Listening, Speaking, Writing, vocabulary, focused simulation, error log and TOEFL-oriented progress. Objective scores and productive self-review remain separate.

### Reach C Level — Beyond TOEFL

Eight abilities are tracked separately:

1. Precision & Register
2. Advanced Grammar & Range
3. Natural English & Fluency
4. Nuance, Hedging & Implicit Meaning
5. Argumentation & Counterargument
6. Synthesis
7. Mediation
8. Pronunciation & Discourse

The C-Level profile never changes TOEFL readiness figures.

## Content banks

### TOEFL

- 20 Complete the Words C-tests (10 gaps each)
- 20 Daily Life sets
- 15 Academic Passages (5 questions each)
- 40 Choose a Response items
- 12 Conversations (2 questions each)
- 10 Announcements (2 questions each)
- 12 Academic Talks (4 questions each)
- 8 Listen & Repeat scenarios (7 sentences each)
- 10 Interview scenarios (4 questions each)
- 24 Build a Sentence tasks
- 12 Email prompts
- 12 Academic Discussion prompts
- 160 vocabulary/collocation cards

### Reach C Level

- 24-item rotating C-Level Check
- 64 objective C-level control drills
- 12 Upgrade Machine tasks
- 8 C-Level Missions with 32 rotating prompts
- Dimension-specific productive review rubrics
- Local audio recording for oral missions where supported by the browser

## V6 audit status

After the final V6 patch, the production code passed **98/98 automated checks** across four suites:

- 30/30 static/data integrity checks
- 20/20 TOEFL browser interaction checks
- 30/30 deep navigation/C-Level/mobile checks
- 18/18 persistence, migration, timer, rotation and dimension-scoring checks

The checks cover duplicate IDs, internal navigation, bank structure, answer ranges, timers, one-play audio logic, mobile overflow, C-Level retakes, mission cleanup, progress persistence after reload, V5→V6 migration, simulation rotation beyond 10 attempts, reset/import behaviour and runtime console errors.

See `V6-AUDIT-NOTES.md` for the detailed findings and corrections.

## Progress migration

V6 automatically reads the previous V5/V6 TOEFL progress formats and the V1 Reach C Level format. Existing scores and history are retained while the new cursor/rotation fields are initialised safely.

## Important limitations

This is an independent pedagogical resource. It is not affiliated with ETS, does not reproduce ETS adaptive routing or official scoring, and does not issue official TOEFL or CEFR certification.

The C-Level Check is a training snapshot, not an official CEFR assessment. Spoken and extended written production use structured learner self-review rather than pretending to provide automated human-level evaluation.

Audio voices depend on the speech voices installed on the learner's device; accent availability therefore varies by browser and operating system.

TOEFL and ETS are registered trademarks of ETS.
