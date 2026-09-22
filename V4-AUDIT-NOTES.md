# V4 internal audit — 22 September 2026

## Release status

**Static/data audit:** 0 errors · 0 warnings  
**Chromium interaction audit:** 20/20 checks passed  
**JavaScript syntax:** `app.js`, `data.js`, `sw.js` passed syntax checks  
**Visible-language heuristic:** no French UI strings detected in `index.html`, `app.js` or `data.js`

This does not mean that software can be proven to contain no possible bug on every browser/device. It means no known functional inconsistency remains after the checks below.

## Corrected functional issues

### Listening
- Practice replay was available too early even though the interface said it would unlock after the first answer. It is now genuinely locked until the learner answers.
- A failed/cancelled speech-synthesis playback could previously consume a one-play state. Playback now counts only after successful completion.
- The same completion rule now applies to diagnostic and simulation audio.
- Exam Conditions keep a single-play lock across all linked questions in the set.

### Speaking
- Listen & Repeat uses an 8-second response window.
- Leaving a repeat task cancels pending countdowns and speech cleanly.
- Interview recording object URLs are revoked when replaced, reducing browser-memory leakage.

### Dates and saved progress
- Activity streaks use the learner's local date rather than UTC, avoiding a wrong day around midnight in Europe.
- Imported state is sanitised before use.
- Older local-progress versions are migrated.
- Reset removes legacy progress keys as well as the current key.
- Re-importing the same JSON file works because the file input is reset after use.

### Practice state
- Reading subtypes advance independently.
- Listening subtypes advance independently.
- Writing subtypes advance independently.
- Build a Sentence cannot be scored while chunks are missing.
- Clear restores the current task without silently reshuffling the chunks.

### Dashboard and recommendations
- Objective performance now emphasises recent practice once enough recent items exist, while retaining all-time totals.
- Productive self-review is calculated from recent self-reviews rather than being blended into objective accuracy.
- Error-category recommendations prioritise recent attempts.
- The saved practice-simulation history is now displayed, including accuracy and completion time.

### Content consistency
- All 20 Complete the Words items contain exactly 10 gaps and were rebuilt with a consistent C-test pattern.
- Duplicate scenario titles identified in the bank were renamed.
- Home micro-drills now route to exercises that actually match the promised skill (for example inference or lecturer purpose).
- The Lyon 1 tutoring card now accurately distinguishes general language tutoring from TOEFL-specific preparation and states the current eligibility information.

### Accessibility and responsive layout
- Readable Font now overrides interface fonts correctly.
- Mobile navigation opens correctly.
- No horizontal page overflow was detected at 390 px.
- Dynamic exercise controls no longer create duplicate DOM IDs.

### Cache / GitHub Pages reliability
- V4 assets use a new version query.
- Service-worker registration is versioned.
- The cache name was changed for this release.
- Network-first behaviour remains in place, with an offline cache fallback that ignores asset query strings.

## Data-bank validation

Validated automatically:

- Diagnostic: 40 items, 10 per skill.
- Complete the Words: 20 sets, 10 gaps each.
- Daily Life: 20 sets, linked questions and valid answers.
- Academic Passages: 15 sets, 5 questions each.
- Choose a Response: 40 valid items.
- Conversations: 12 sets, 2 questions each.
- Announcements: 10 sets, 2 questions each.
- Academic Talks: 12 sets, 4 questions each.
- Listen & Repeat: 8 sets, 7 sentences each.
- Interviews: 10 sets, 4 questions each.
- Writing banks: valid task structures and answer indexes.
- Vocabulary: 160 unique entries.
- No duplicate static HTML IDs.
- No broken internal navigation targets.

## Chromium interaction checks passed

1. No duplicate DOM IDs after initial render.
2. Home opens as active section.
3. C-test renders exactly 10 inputs.
4. Reading feedback unlocks Next.
5. Daily Life advances to linked question 2.
6. Practice replay stays locked before first answer.
7. Practice replay unlocks after the first answer.
8. Conversation advances to linked question 2.
9. Exam mode preserves the one-play lock across linked questions.
10. Listen & Repeat starts the 8-second response window.
11. Build check is disabled while the sentence is incomplete.
12. Build check unlocks only after every chunk is used.
13. Clear preserves the visible chunk order.
14. Clear relocks Check.
15. Simulation history renders.
16. Daily C-Level Trap renders answer options.
17. No duplicate DOM IDs after cross-section interaction.
18. Mobile menu button is visible.
19. Mobile navigation opens.
20. No horizontal page overflow at 390 px.

## External-resource verification

Key ETS and Lyon 1 resource destinations were rechecked on 22 September 2026. Some third-party sites may block automated crawlers even when their public page remains available; the site therefore does not infer that a resource is broken merely from a crawler restriction.
