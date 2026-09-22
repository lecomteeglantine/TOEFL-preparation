# V6 Deep Audit Notes

## Audit goal

V6 was produced after a deeper consistency audit of the deployed V5 package. The goal was not to redesign the interface, but to remove hidden state inconsistencies, duplicated learning systems and progression problems that could appear after reloads or repeated use.

## Bugs and inconsistencies found in V5

### 1. Hidden legacy C-Level Lab still existed

V5 visually promoted the new Reach C Level pathway, but the old C-Level Lab still existed in the HTML, JavaScript handlers and data. It was hidden from normal navigation but remained a second competing C-level system in the code.

**V6 correction:** the legacy view, handlers and data are removed. Old `#clevel` links redirect to Reach C Level.

### 2. Large practice banks often restarted at item 1

Several TOEFL modules stored their current item only in runtime variables. A page reload could therefore return learners to the beginning despite the larger V3/V5 banks.

**V6 correction:** Reading, Listening, Speaking and Writing cursors are persisted. The selected Reading/Listening/Writing sub-tab and Listening mode are also restored.

### 3. Practice Simulation rotation became stuck after 10 stored results

The simulation selected content using the visible history length, while history was capped at 10 entries. After the tenth saved attempt, subsequent simulations could therefore reuse the same selection pattern.

**V6 correction:** a separate persistent `mockRuns` counter drives rotation while only the 10 latest visible results are retained.

### 4. C-Level Check retakes repeated the same form

The check always selected the first three tasks in each dimension.

**V6 correction:** retakes rotate through alternative tasks. The attempt counter and recent check history are stored independently.

### 5. Reach C Level module progress did not persist fully

Reopening/reloading could reset module positions, Upgrade Machine position or mission prompt rotation.

**V6 correction:** the active module and individual module cursors, Upgrade Machine cursor and mission prompt positions are persisted.

### 6. Mission timer could survive a prompt change

Selecting a new mission prompt could leave an old preparation timer running.

**V6 correction:** mission cleanup now stops timers and recording state before rendering a new prompt, resetting progress or importing data.

### 7. Productive mission scores were too generic

A mission could contribute the same overall self-review score to two different C-level dimensions even when the criteria did not measure both dimensions directly.

**V6 correction:** each dimension now has its own three-criterion rubric. Missions store dimension-specific scores. Legacy reviews remain readable through a safe fallback.

### 8. Pronunciation tracking lacked pronunciation-specific evidence

Some missions could feed the Pronunciation & Discourse profile without explicitly reviewing prosody.

**V6 correction:** pronunciation reviews now target thought groups/stress, pace/linking/articulation and intonation for stance/structure.

### 9. Academic reporting verb inconsistency

One Precision & Register item presented `allege` too neutrally.

**V6 correction:** it now uses `argue`, with an explanation that matches ordinary academic reporting use.

### 10. Minor lifecycle/memory cleanup

Audio recording object URLs could remain allocated after leaving a recording task.

**V6 correction:** transient cleanup now revokes the active recording URL as well as stopping timers/streams.

## Migration

TOEFL progress now uses a new state version with automatic migration from the recent V5/V6 formats. Reach C Level similarly migrates its V1 state to V2. Existing scores, history and completed work are preserved; new cursor and rotation fields receive safe defaults.

## Automated validation after the final patch

### Static/data integrity — 30/30

Includes:
- no duplicate static IDs
- every navigation target has a view
- no legacy C-Level view/handler/data
- English document language
- secure `_blank` links (`noopener`)
- all local assets present and V6-versioned
- V6 service-worker cache
- valid manifest settings
- 40 diagnostic items / 10 per skill
- 20 C-tests × 10 gaps
- 20 Daily Life sets
- 15 Academic Passages × 5 questions
- correct Listening bank sizes and linked-question counts
- 8 × 7 Listen & Repeat
- 10 × 4 Interviews
- 24/12/12 Writing banks
- 160 unique vocabulary entries
- valid answer indices
- 8 C-Level dimensions × 8 drills
- 8 missions × 4 prompts
- mission coverage for every C-level dimension
- no stale public V4/V5 version labels

### TOEFL browser regression — 20/20

Includes:
- dynamic duplicate-ID check
- Reading answer/next flows
- linked Daily Life questions
- Practice replay lock/unlock
- linked Conversation flow
- Exam-mode one-play behaviour
- Listen & Repeat response timing
- Build a Sentence completion/clear logic
- simulation history
- homepage calibration routing
- dynamic ID safety
- mobile navigation and no horizontal overflow at 390 px

### Deep interaction audit — 30/30

Includes:
- every navigation target activates the correct view
- no orphan views
- 24-item C-Level Check
- retake form changes
- mission prompt/timer reset
- C-Level module progression
- Upgrade Machine progression
- readable-font control
- mobile overflow checks across major views
- zero page errors / zero console errors in the tested flows

### Persistence/migration audit — 18/18

Includes:
- Reading cursor survives reload
- Reading tab survives reload
- Listening task + Practice/Exam mode survive reload
- Writing tab survives reload
- active C-Level module + cursor survive reload
- Upgrade Machine cursor survives reload
- new mission prompt kills old timer
- mission prompt rotation survives reload
- pronunciation mission exposes pronunciation-specific criteria
- mission review stores separate dimension scores
- C-Level Check form changes across reload
- previous TOEFL state migration preserves statistics
- previous C-Level state migration preserves statistics
- simulation still works after 10 stored histories
- simulation rotation continues on run 11
- visible mock history remains capped at 10
- C-Level reset stops an active timer
- zero runtime page errors in the tested persistence flows

## Final automated result

**98 / 98 checks passed.**

This means no known bug or internal inconsistency remains in the tested V6 paths. It is not a mathematical guarantee across every browser/device combination; device speech synthesis and microphone permissions remain browser/OS-dependent.

## Improvements deliberately not added in this audit

To keep V6 focused on reliability, the audit did not add another major content layer. Strong candidates for a later version are:

- human-recorded/licensed audio instead of device TTS
- optional teacher-facing CSV progress export
- proper installable PWA icons and a visible offline-status indicator
- first-attempt → revised-attempt comparison for extended Speaking/Writing/C-Level missions
- larger authentic-input pathways for independent C1/C2 reading/listening beyond test-style tasks
- optional accessibility audit against a formal WCAG checklist
