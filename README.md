# Homemade TOEFL Trainer — C1/C2

A static, GitHub Pages-ready TOEFL iBT training site for advanced learners aiming at CEFR C1/C2.

## What is included

- English-only interface and instructions
- Current TOEFL iBT structure used from 21 January 2026
- 40-item C1/C2-oriented diagnostic: 10 items per skill
- Balanced A/B/C/D answer positions in the diagnostic
- Progress dashboard with a 5 / 5.5 / 6 target, local saving, JSON export and import
- Reading: Complete the Words, Read in Daily Life, Read an Academic Passage
- Listening: Choose a Response, Conversation, Announcement, Academic Talk
- Speaking: Listen and Repeat, Take an Interview, local microphone recording
- Writing: Build a Sentence, Write an Email, Academic Discussion
- 51-item advanced academic vocabulary bank with pronunciation and My Words
- C-Level Lab: hedging, nominalisation, complex syntax, paraphrase, stance and cohesion
- Resources page with official ETS links, advanced English websites, and verified Lyon 1 library/SCEL resources
- Accessibility controls: text size, high contrast, readable font, reduced motion and focus mode
- Responsive smartphone layout and lightweight service-worker caching

## GitHub Pages deployment

1. Create a new GitHub repository, for example `homemade-toefl-trainer`.
2. Upload **all files from this folder to the repository root**.
3. In GitHub, open **Settings → Pages**.
4. Under **Build and deployment**, choose **Deploy from a branch**.
5. Select `main` and `/ (root)`, then save.

## Required files

- `index.html`
- `styles.css`
- `data.js`
- `app.js`
- `manifest.webmanifest`
- `sw.js`

## Privacy and local data

Progress is stored in the learner's browser with `localStorage`. No account, server or database is required. The site remains usable if browser storage is blocked, although progress will then not persist.

Speaking recording uses the browser `MediaRecorder` API. On GitHub Pages it requires microphone permission. Recordings stay in the browser and are not uploaded by this site.

## Important note about scoring

Any score produced by the diagnostic is a **pedagogical estimate**, not an official ETS score. Productive skills cannot be fully assessed by multiple-choice items; learners should also use the speaking and writing tasks with the C-level self-assessment criteria provided on the site.

## Current TOEFL format references

The test structure was checked in September 2026 against official ETS information:

- https://www.ets.org/toefl/test-takers/ibt/about/content.html
- https://www.ets.org/toefl/test-takers/ibt/prepare.html
- https://www.ets.org/toefl/test-takers/ibt/scores/understand-scores.html

The site is independent and is not affiliated with ETS. TOEFL and ETS are registered trademarks of ETS. All practice tasks are original.

Designed and developed by Eglantine Lecomte — Claude Bernard Lyon 1 University — with the assistance of ChatGPT.
