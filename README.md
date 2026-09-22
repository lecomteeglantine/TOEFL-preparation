# Homemade TOEFL Trainer — C1/C2 · V4 audited build

An independent, browser-based TOEFL iBT practice site for advanced learners targeting C-level English.

## Deploy on GitHub Pages

Upload the production files from this package to the root of the GitHub repository used for the site. Keep `index.html`, `styles.css`, `data.js`, `app.js`, `manifest.webmanifest` and `sw.js` together at the root.

After deployment, reload the public page. V4 uses versioned CSS/JavaScript URLs plus a network-first service worker so corrected files replace stale cached versions more reliably.

## What V4 fixes

- Listening Practice now really keeps replay locked until the learner has answered once.
- Listening, diagnostic and simulation audio only count as “played” after playback completes successfully.
- Listen & Repeat now uses the current 8-second response window.
- Local streaks use the learner's local calendar date rather than UTC.
- Reading, Listening and Writing task families advance independently instead of sharing one index.
- Build a Sentence cannot be checked before every chunk is used; Clear no longer reshuffles the task.
- Complete the Words items now follow the current C-test construction rule used by the trainer: first sentence intact, then the second half of every second word removed until 10 gaps are produced.
- The dashboard prioritises recent objective accuracy while keeping all-time totals visible.
- Speaking/Writing self-review remains separate from objectively marked practice.
- The error log gives recent attempts priority, so old mistakes do not permanently dominate recommendations.
- Practice-simulation history is now visible and stores completion time.
- Repeat and recording object URLs/timers are cleaned up correctly when navigating away.
- Readable Font now applies to the full interface.
- Mobile header/navigation have been tightened and tested at 390 px without horizontal overflow.
- Dynamic practice buttons no longer create duplicate DOM IDs.
- Local progress import/export/reset is more defensive, with migration from earlier local-storage versions.

## Current practice bank

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

## V4 audit status

The release package passed the internal static/data audit with 0 errors and 0 warnings. It also passed 20 Chromium interaction checks covering Reading, linked Listening sets, Practice/Exam audio locking, Speaking timing, Build a Sentence state, simulation history, mobile navigation and horizontal overflow.

See `V4-AUDIT-NOTES.md` for the detailed checks and known limitations.

## Important limitations

This is an independent pedagogical resource. It is not affiliated with ETS, does not reproduce ETS adaptive routing or official scoring, and does not issue official TOEFL scores. The diagnostic is an internal baseline only. Speaking and extended Writing use learner self-review criteria rather than claiming automated official-style scoring.

Audio uses the English speech voices available on the learner's device. Accent selection is therefore exposure practice, not a guarantee that every device can provide every requested accent.

TOEFL and ETS are registered trademarks of ETS.
