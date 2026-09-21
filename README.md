# Homemade TOEFL Trainer — C1/C2

A static, GitHub Pages-ready TOEFL iBT training site for advanced learners aiming at CEFR C1/C2.

## Audited build

**Audit date:** 21 September 2026

This build includes a functional and pedagogical audit of the previous C1/C2 version. The training tasks are original and the site is independent from ETS.

## What is included

- English-only interface and instructions
- TOEFL iBT structure currently in use after the January 2026 update
- 40-item C1/C2-oriented diagnostic: 10 items per skill
- Diagnostic feedback withheld until the end, with an error-review panel
- Progress dashboard combining the diagnostic baseline with recent scored practice
- Reading:
  - Complete the Words as 10-gap paragraph-level C-test practice
  - Read in Daily Life
  - Read an Academic Passage
- Listening:
  - Choose a Response
  - Conversation
  - Announcement
  - Academic Talk
- Speaking:
  - Listen and Repeat in seven-sentence scenario sets
  - Take an Interview in four-question contextualised sets
  - 45-second local microphone recording and playback
  - structured C1/C2 self-check
- Writing:
  - Build a Sentence with an intact lead-in
  - Write an Email with three explicit communicative requirements
  - Academic Discussion
  - 7-minute and 10-minute practice timers
  - structured self-check and model responses
- 51-item advanced academic vocabulary bank with pronunciation and My Words
- C-Level Lab: hedging, nominalisation, complex syntax, paraphrase, stance and cohesion
- Resources page with official ETS links, advanced English websites, and Lyon 1 BU/SCEL resources
- Accessibility controls: text size, high contrast, readable font, reduced motion and focus mode
- Responsive smartphone layout
- Local JSON export/import of learner progress
- Network-first service worker with cache-busting on the main CSS/JS files

## Important scoring note

The diagnostic and dashboard provide **internal pedagogical estimates only**. They do not reproduce ETS scoring. Speaking and Writing cannot be validly assessed through multiple-choice questions alone, so the diagnostic treats those items as language-control proxies and the practice sections use structured self-assessment for productive work.

## GitHub Pages deployment

1. Upload **all files in this folder to the repository root**.
2. Replace the existing files with these audited versions.
3. In GitHub, open **Settings → Pages** and deploy from `main` / root if this is not already configured.
4. After deployment, reload the public site. This build uses versioned CSS/JS URLs and a network-first service worker to reduce stale-cache problems after updates.

## Required files

- `index.html`
- `styles.css`
- `data.js`
- `app.js`
- `manifest.webmanifest`
- `sw.js`

`AUDIT-NOTES.md` is documentation only and may remain in the repository.

## Privacy and local data

Progress is stored in the learner's browser with `localStorage`. No account, server or database is required. Speaking recording uses the browser `MediaRecorder` API and requires microphone permission. Recordings are created locally and are not uploaded by this site.

## Current-format references

The site was rechecked in September 2026 against current public ETS information. Always verify ETS before a real test date because test specifications can change.

- https://www.ets.org/toefl/test-takers/ibt/about/content.html
- https://www.ets.org/toefl/test-takers/ibt/about/content/reading.html
- https://www.ets.org/toefl/test-takers/ibt/about/content/speaking.html
- https://www.ets.org/toefl/test-takers/ibt/scores/understand-scores.html

TOEFL and ETS are registered trademarks of ETS. All practice tasks in this site are original.

Designed and developed by Eglantine Lecomte — Claude Bernard Lyon 1 University — with the assistance of ChatGPT.
