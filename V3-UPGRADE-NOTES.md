# V3 upgrade notes — 22 September 2026

## 1. Accent and audio training

- Added a default **TOEFL Mix** profile.
- Added North American, UK, Australian and New Zealand target profiles.
- Listening items, diagnostic listening prompts, Listen & Repeat sets and Interview sets now carry a deterministic accent profile.
- Added a visible **Accent & Audio Check** with four test buttons.
- Added device voice availability/fallback feedback.
- Manual accent selection is saved locally and overrides the automatic mix.
- Practice mode shows the target accent profile; Exam Conditions keeps the focus on the task rather than displaying extra guidance.
- Audio playback still uses the learner's installed device voices; no fake claim of human-recorded audio is made.

## 2. Bank expansion

### Reading
- 20 Complete the Words C-tests, each with 10 missing word endings.
- 20 Daily Life sets, each with linked questions.
- 15 Academic Passages, each with 5 linked questions.
- Added topics including conservation, ocean chemistry, memory, urban economics, acoustic ecology, bilingualism, battery recycling, digital archives and museum interpretation.

### Listening
- 40 Choose a Response items.
- 12 Conversations × 2 questions.
- 10 Announcements × 2 questions.
- 12 Academic Talks × 4 questions.
- New talks cover archaeology, memory, flood-risk modelling and art attribution as well as science and campus contexts.

### Speaking
- 8 Listen & Repeat scenarios × 7 sentences.
- 10 Interview scenarios × 4 questions.
- New interview themes include feedback, assessment, technology and campus sustainability.

### Writing
- 24 Build a Sentence tasks.
- 12 Email prompts.
- 12 Academic Discussion prompts.
- Additional prompts emphasise qualification, pragmatic control, fair comparison and explicit evaluation criteria.

### Vocabulary
- Expanded from 80 to 160 C1/C2 words and collocations.
- Added methodological and general academic language such as `corroborate`, `scope condition`, `operationalise`, `withstand`, `trade-off`, `boundary condition` and `measurement invariance`.

## 3. Resources

- Added ABC Radio National for sustained exposure to Australian English.
- Added a direct route from Resources to the Accent & Audio Check.
- Retained official ETS links and Lyon 1 BU/SCEL resources.

## 4. Cache/deployment

- Bumped the service-worker cache to `homemade-toefl-v6-20260922-v3`.
- Bumped CSS/JS/data query versions to `20260922v3`.
- Network-first behaviour remains in place to reduce stale GitHub Pages deployments.

## 5. Validation completed

- JavaScript syntax checks pass for `app.js` and `data.js`.
- No duplicate HTML IDs.
- All local deployment assets exist and return HTTP 200 from a local server.
- All multiple-choice answer indices are valid.
- Every C-test contains exactly 10 gaps.
- Every Conversation and Announcement has 2 questions.
- Every Academic Talk has 4 questions.
- Every Academic Passage has 5 questions.
- Every Listen & Repeat set has 7 sentences.
- Every Interview set has 4 questions.
- All Listening and Speaking sets have a valid accent profile.
- Vocabulary contains 160 unique entries.
