# Audit notes — 21 September 2026

## High-priority bugs corrected

1. **Malformed HTML ending** — duplicate trailing closing tags and stray text were removed.
2. **Diagnostic count mismatch** — the interface said 32 items although the bank contains 40; all references now say 40.
3. **Frozen progress estimate** — the dashboard previously kept using the original diagnostic score even after practice. It now blends the diagnostic baseline with recent scored practice.
4. **Impossible 5.5 diagnostic band** — the old percentage thresholds made 5.5 effectively unreachable with ten questions per skill. The internal thresholds now support 3.0–6.0 in half-band steps while remaining deliberately demanding.
5. **Writing score inflation** — Build a Sentence and long-writing actions could be logged repeatedly. Scored actions now lock after one submission.
6. **Timer leaks** — writing and recording timers are cleaned up when the learner changes section.
7. **Speaking recording leaks** — microphone streams are stopped when leaving the section; abandoned recordings are not added to practice time.
8. **Stale GitHub Pages cache** — the service worker was cache-first and could preserve old JavaScript after deployment. The audited build uses network-first caching, a new cache version, `skipWaiting`, `clients.claim`, and versioned CSS/JS requests.
9. **Skill contamination** — the home C-level trap and C-Level Lab previously inflated the Writing skill score. They now count only as general practice.
10. **Outdated tutoring link** — the Lyon 1 SCEL tutoring link has been updated to the current tutoring page.

## Content corrections and upgrades implemented

### Reading
- Complete the Words is now paragraph-level C-test practice with exactly **10 missing word endings per text** rather than a single isolated multiple-choice word.
- Academic distractors continue to target scope, causality, robustness, inference and overclaiming.

### Listening
- Conversations, announcements and academic talks were lengthened and made more inferential.
- Topics now require tracking stance, causal reasoning, methodological limits and argumentative purpose rather than keyword matching.

### Speaking
- Listen and Repeat now uses **scenario-based sets of seven progressively longer sentences**.
- The transcript is hidden until the learner has listened and attempted the repetition.
- Take an Interview now uses **four connected questions in one context**, moving from personal/factual material towards broader evaluation.
- Interview recording is capped at 45 seconds per response.
- A six-criterion C1/C2 self-check can be logged once per recorded answer.

### Writing
- Build a Sentence now includes an intact lead-in before the chunk reconstruction task.
- Email tasks display three explicit communicative requirements.
- Email and Academic Discussion use 7-minute and 10-minute practice timers respectively.
- Long writing can only be logged after a structured self-check.
- Academic Discussion flags responses below the trainer's 100-word development target.

### Diagnostic and progress
- Diagnostic correctness is no longer revealed after every click; answers are reviewed at the end.
- Speaking/Writing diagnostic questions are explicitly identified as language-control proxies.
- The dashboard distinguishes diagnostic baseline from recent accuracy.

## Organisation improvements implemented

- Navigation label changed from **Progress** to **My Progress**.
- Test-format information remains separate from training so students can distinguish exam knowledge from practice.
- Resources stay grouped into: official TOEFL sources, C1/C2 language-development sources, Lyon 1 resources, and a weekly training routine.
- Lyon 1 resource cards distinguish catalogue selections, online subscriptions, print resources, on-site consultation and tutoring.

## Recommended next development stage

These are useful additions, but were deliberately not faked or rushed into this audited build:

1. **Full mock-test mode** with section-level timing, no feedback until the end, and a fixed exam-like route.
2. **Larger item bank** so frequent users see less repetition; ideally three difficulty tiers: high B2 bridge, C1, and C2 stretch.
3. **Human-recorded audio bank** with several accents. Device text-to-speech is functional but not an acoustic substitute for a real test recording.
4. **Teacher mode / CSV export** showing section attempts, recent accuracy and self-check history without collecting student data on a server.
5. **Speaking comparison workflow** with a model recording or transcript after the learner records, while avoiding unreliable automatic pronunciation scoring.
6. **Writing history** saved locally so students can compare first draft, revised draft and model response over time.
7. **Dedicated strategy micro-lessons** for note-taking, eliminating plausible distractors, scope/overclaiming, and interview response architecture.

## Audit limitations

The public GitHub Pages URL could not be fetched from the audit environment, so the functional audit was performed on the exact GitHub-ready package used for the deployed build. Critical external information and links were separately rechecked against current ETS and Lyon 1/SCEL pages. Browser-engine screenshot automation was unavailable in the audit container, so the final checks are static/runtime-logic checks rather than a claim of exhaustive testing on every browser/device combination.
