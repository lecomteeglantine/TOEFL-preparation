# Homemade TOEFL Trainer + Reach C Level · V7

An independent browser-based platform for advanced learners. V7 keeps the current TOEFL iBT pathway and extends the separate **Reach C Level** pathway into a broader C1/C2 learning environment with study planning, error recycling, CEFR-informed interpretation, online interaction, mediation and revision evidence.

## Deploy on GitHub Pages

Upload these files together at the root of the repository, replacing the previous versions:

- `index.html`
- `styles.css`
- `data.js`
- `clevel-data.js`
- `cplus-data.js`
- `app.js`
- `clevel.js`
- `cplus.js`
- `manifest.webmanifest`
- `sw.js`
- `favicon.svg`
- `icon-192.png`
- `icon-512.png`
- `social-preview.png`

The service worker uses a V7 cache and a network-first strategy. Existing V5/V6 learner progress is migrated where compatible.

## What V7 adds

### Personal study plan

Learners can build a local 1–8 week plan using an optional TOEFL date, weekly availability, target and emphasis. When enough evidence exists, the plan uses the learner's TOEFL error log and C-Level profile. A rolling six-week plan is available without a test date.

### Mistake Recycler

Recurring objective weaknesses in Reading and Listening are surfaced as targeted categories. The learner is routed to a fresh item that practises the weak pattern rather than simply repeating the same question.

### CEFR-informed map

The site now interprets practice evidence through nine advanced communicative strands, including precision, range, fluency, nuance, argumentation, synthesis, mediation, phonological/discourse control and online interaction. The statements are pedagogical paraphrases, **not official CEFR certification descriptors**. Official Council of Europe descriptors remain the reference.

Online Interaction is deliberately tracked through portfolio evidence rather than an invented automatically scored objective band.

### Online Interaction Studio

Eight scenarios train advanced written/digital interaction: integrating earlier contributions, repairing misunderstandings, managing disagreement, moderating discussion and helping a group reach a next decision.

Each task follows:

1. first attempt;
2. explicit strategy/rubric review;
3. revised attempt;
4. reflection;
5. optional portfolio save.

### Mediation 2.0

Eight scenarios train audience adaptation, specialist-to-non-specialist explanation, data mediation, neutral synthesis, cultural misunderstanding repair, genre transformation and multilingual mediation.

### C-Level Portfolio

Learners can save first and revised attempts from the new studios, or manually archive revision evidence from TOEFL Writing, TOEFL Speaking, C-Level Missions or authentic work completed elsewhere. The site stores the material locally in the current browser unless the learner exports it.

Portfolio evidence is not treated as an official TOEFL or CEFR score.

### Sharing and PWA polish

V7 includes:

- canonical URL and OpenGraph/Twitter metadata;
- 1200 × 630 social preview;
- SVG favicon;
- 192 × 192 and 512 × 512 app icons;
- updated web app manifest;
- V7 service-worker cache.

## Existing pathways retained

### TOEFL preparation

- 40-item diagnostic
- 20 Complete the Words C-tests
- 20 Daily Life sets
- 15 Academic Passages
- 40 Choose a Response items
- 12 Conversations
- 10 Announcements
- 12 Academic Talks
- 8 Listen & Repeat sets
- 10 Interview sets
- 24 Build a Sentence tasks
- 12 Email prompts
- 12 Academic Discussion prompts
- 160 vocabulary/collocation cards
- focused non-adaptive practice simulation
- objective error log and progress dashboard

### Reach C Level

- 24-item rotating C-Level Check
- 64 objective C-level control drills
- 12 Upgrade Machine tasks
- 8 C-Level Missions / 32 rotating prompts
- dimension-specific productive review rubrics
- local recording support where the browser permits it

## Final V7 consistency fixes

The release package also corrects four small inconsistencies found during final packaging:

- the internal data version now reports V7 rather than V6;
- the Study Plan no longer refers to the removed legacy “C-Level Lab”;
- a TOEFL date within seven days generates a one-week plan rather than an impossible two-week plan;
- the vocabulary search field now has an explicit accessible label.

The CEFR-informed map also explicitly explains that Online Interaction is portfolio-evidence based.

## External references checked on 22 September 2026

Core links were rechecked against current public pages, including:

- ETS TOEFL content and structure
- ETS 40-minute sample test
- ETS score guidance
- Council of Europe CEFR descriptors
- Council of Europe mediation guidance
- Council of Europe online-interaction guidance
- Lyon 1 BU Languages
- Lyon 1 Espace Langues-Cargo
- Lyon 1 language tutoring
- Lyon 1 TOEFL preparation

The direct TestReady portal can reject automated crawlers, so the site treats ETS as the authoritative source if an official page or portal changes.

## Important limitations

This is an independent pedagogical resource. It is not affiliated with ETS, does not reproduce ETS adaptive routing or official scoring, and does not issue official TOEFL or CEFR certification.

The C-Level Check and portfolio are learning tools, not formal CEFR assessment. Extended Speaking and Writing use structured learner self-review rather than pretending to reproduce official human or automated scoring.

Audio uses browser/device speech synthesis. Accent-profile availability therefore varies by operating system and browser.

TOEFL and ETS are registered trademarks of ETS.
