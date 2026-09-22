# V7 final audit notes

Audit date: 22 September 2026

## Scope

The final V7 packaging audit covered:

- production file references;
- JavaScript syntax;
- duplicate HTML IDs;
- literal JavaScript selector/ID resolution;
- manifest and PWA image dimensions;
- service-worker core cache list;
- TOEFL/C-Level/CPlus bank structure;
- answer-index validity for objective questions;
- accessibility labels for static form controls;
- visible version/terminology consistency;
- current core external reference pages.

## Final corrections made

### 1. Stale internal V6 version

`data.js` still reported the deep-audit V6 label even though the interface and storage format were V7. The metadata now reports V7 and describes the V7 feature set.

### 2. Removed-module terminology in Study Plan

The V7 Study Plan still generated labels beginning with `C-Level Lab`, despite the legacy lab having been removed in V6. These routes now use `Reach C Level` terminology consistently.

### 3. Test-date planning edge case

A TOEFL date seven days or less away previously generated a two-week plan. The planner now generates a one-week plan in that case. Dates in the past are rejected; no-date plans remain rolling six-week plans.

### 4. Vocabulary search accessibility

The vocabulary search field relied only on placeholder text. It now has an explicit `aria-label="Search vocabulary"`.

### 5. Online Interaction evidence clarity

The CEFR-informed map contains nine strands while the objective Reach C Level control profile contains eight. This is deliberate: Online Interaction is a productive/portfolio strand and is not given a fabricated objective band. The interface now says this explicitly.

## Static and data integrity results

The final production files passed JavaScript syntax checks for:

- `app.js`
- `clevel.js`
- `cplus.js`
- `data.js`
- `clevel-data.js`
- `cplus-data.js`
- `sw.js`

HTML checks found:

- 0 duplicate static IDs;
- 0 missing local CSS/JS/manifest/icon references;
- 0 missing literal JavaScript ID targets when static and generated IDs are considered together;
- all navigation targets represented by matching views.

PWA/media checks found:

- `icon-192.png`: 192 × 192;
- `icon-512.png`: 512 × 512;
- `social-preview.png`: 1200 × 630;
- manifest references resolve to production files;
- V7 service-worker cache includes all production assets.

### TOEFL bank integrity

Verified expected counts:

- diagnostic: 40;
- vocabulary: 160;
- Complete the Words: 20, each with exactly 10 gaps;
- Daily Life: 20, each with 2–3 linked questions;
- Academic Passages: 15, each with 5 questions;
- Choose a Response: 40;
- Conversations: 12 × 2 questions;
- Announcements: 10 × 2 questions;
- Academic Talks: 12 × 4 questions;
- Listen & Repeat sets: 8;
- Interview sets: 10;
- Build a Sentence: 24;
- Emails: 12;
- Academic Discussions: 12.

Objective answer indices were checked to remain within their option arrays.

### Reach C Level / V7 extension integrity

Verified:

- 8 core C-Level dimensions;
- 8 objective module banks with 8 tasks each;
- 12 Upgrade Machine tasks;
- 8 C-Level Missions;
- 9 CEFR-informed map strands;
- 8 Online Interaction Studio tasks;
- 8 Mediation 2.0 tasks;
- every new productive studio task contains 4 review criteria.

## External reference check

Current public pages were successfully retrieved for the ETS TOEFL structure, ETS sample test, ETS score guidance, Council of Europe descriptors/mediation/online interaction and Lyon 1 language resources. The direct TestReady application returned an automated-access 403 to the audit crawler; that is a crawler-access limitation rather than evidence that the learner-facing portal is broken.

## Accessibility notes

The main primary-button gradient now provides more than 4.5:1 white-text contrast at both endpoints. The site retains skip navigation, keyboard focus styling, contrast/readable-font/reduced-motion options and modal focus trapping/return.

## Runtime limitation of this packaging audit

The sandbox blocks Chromium navigation to local HTTP/file URLs. A DOM-injection browser harness was attempted for final packaging, but the complete runtime suite could not be reproduced reliably after the final micro-patches. The final changes listed above are narrow and were followed by syntax, selector, structure and data-integrity rechecks. Earlier V7 interaction suites had already covered the new study-plan, studio, portfolio and mobile flows before this packaging pass.

## Release status

No known structural/data inconsistency remains in the final package. Browser/device-specific speech synthesis and microphone behaviour still depend on the learner's environment, and no independent educational website can honestly guarantee zero defects on every browser/OS combination.
