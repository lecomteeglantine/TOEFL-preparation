# Homemade TOEFL Trainer + Reach C Level · V5

An independent browser-based platform for advanced learners. V5 keeps the audited TOEFL iBT 2026 practice system and adds a separate **Beyond TOEFL — Reach C Level** pathway for genuine C1/C2 development.

## Deploy on GitHub Pages

Upload these files together at the root of the repository:

- `index.html`
- `styles.css`
- `data.js`
- `clevel-data.js`
- `app.js`
- `clevel.js`
- `manifest.webmanifest`
- `sw.js`

V5 uses versioned assets and a network-first service worker. After replacing the files on GitHub, reload the public page so the new service worker can refresh cached assets.

## Two deliberately separate pathways

### TOEFL preparation

The existing system remains focused on the TOEFL iBT format in use since January 2026: diagnostic, Reading, Listening, Speaking, Writing, vocabulary, focused simulation, error log and TOEFL-oriented progress.

### Reach C Level — Beyond TOEFL

The new pathway tracks eight abilities separately:

1. Precision & Register
2. Advanced Grammar & Range
3. Natural English & Fluency
4. Nuance, Hedging & Implicit Meaning
5. Argumentation & Counterargument
6. Synthesis
7. Mediation
8. Pronunciation & Discourse

The C-Level profile never changes the TOEFL readiness figures. Objective accuracy and productive self-review also remain separate.

## New V5 content

- 24-item **C-Level Check** with no feedback until the end
- 64 objective C-level control drills
- 12 **Upgrade Machine** tasks turning B2 wording into controlled C-level English
- 8 C-Level Missions with 32 rotating prompts:
  - The Expert Panel
  - The Devil’s Advocate
  - The Diplomat
  - The Editor
  - The Impostor
  - The Spin Doctor
  - The Translator’s Trap
  - The One-Minute Expert
- Local audio recording for spoken C-Level Missions where supported by the browser
- Separate C-Level dashboard: objective accuracy + mission self-review
- Unified export/import: one JSON file now carries both TOEFL and Reach C Level progress
- C-Level work contributes to the general practice streak without contaminating TOEFL scores
- 100% English interface and task content

## Existing TOEFL bank retained

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

## V5 audit status

V5 passed:

- JavaScript syntax checks on all data/application files
- static HTML/CSS/asset integrity checks
- 0 duplicate DOM IDs
- 0 broken internal navigation targets
- C-Level data validation: 8 dimensions, 64 drills, 24-item check, 12 upgrades, 32 mission prompts
- **20/20 TOEFL regression interaction checks** from the V4 audit suite
- **32/32 Reach C Level interaction checks**
- mobile layout check at 390 px with no horizontal overflow
- unified export test confirming C-Level data is included
- reset/import round-trip confirming C-Level progress is restored correctly

See `V5-UPGRADE-NOTES.md` for the detailed changes.

## Important limitations

This is an independent pedagogical resource. It is not affiliated with ETS, does not reproduce ETS adaptive routing or official scoring, and does not issue official TOEFL or CEFR certification.

The C-Level Check is a training snapshot, not an official CEFR assessment. Spoken and extended written production use structured learner self-review rather than pretending to provide automated human-level evaluation.

Audio voices for TOEFL listening/speaking practice depend on the speech voices installed on the learner’s device.

TOEFL and ETS are registered trademarks of ETS.
