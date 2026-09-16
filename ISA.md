---
task: "Five-tab offline AA inventory web app, phone-first"
slug: 20260916-175742_spot-check-inventory
project: spot-check-inventory
phase: climbing
progress: 24/36
started: 2026-09-16T17:57:42Z
updated: 2026-09-16T18:25:00Z
stated_goal: "I want to make a simple web program to do AA spot check inventories based on the methods written in the big book of alcoholics anonymous on pages 86 through 88."
stated_goal_source: prompt
stated_goal_signal: 2
stated_goal_locked: 2026-09-16T17:57:42Z
context_sufficient: true
interview_invoked: true
---

<!-- Shape discovered via the ISA Grill workflow, 13 questions. Full Q&A log and pre-mortem: ~/.claude/LIFEOS/MEMORY/WORK/spot-check-inventory/grill.md -->

## Problem

The Tenth and Eleventh Step practices described in *Alcoholics Anonymous* pp. 84–88 are daily, repeated, and written. In practice they get done in a paper notebook that is never where you are, or in a notes app whose blank page gives you no prompts, or not at all. The nightly review has a specific question set; the spot check has a different and much shorter one; both are easy to skip precisely when they matter most. The existing digital options are either general journaling apps with no structure, or inventory apps that upload deeply personal material to somebody else's server.

Two failures in particular keep the practice from sticking. Structured inventory forms present every question at once as a wall of empty text boxes, which is the least inviting thing to open when agitated. And the apps that solve that by pacing you one question at a time force an answer to every question, when most days only two or three are live.

## Vision

You are standing somewhere, agitated, and you tap one icon on your home screen. The app opens to Spot Check because that is where you were last time. Four short questions are already on screen, each one line, each collapsed. You expand the one that is actually true right now, write two sentences, and put the phone away. The whole thing took under a minute and you never read an instruction.

That night the same icon opens to Nightly, because that is where you were last. The p.86 questions are there with their citation, and you answer the four that apply and leave the rest alone without the app minding. Nothing syncs, nothing pings you later, nothing counts your streak. It reads like a well-set book rather than a piece of software, which is right for a practice that predates software by forty years.

## Out of Scope

- **No account, login, or sync.** Entries live in browser storage on one device. There is no server holding anyone's inventory, and there never will be.
- **No amends or follow-up tracking.** The pages go on to ask what corrective measures should be taken; this app records and does not manage. No open items, no badges, no checkboxes to clear.
- **No reminders or notifications.** Nothing nags. The practice is the user's, not the app's.
- **No pattern analysis, trends, streaks, or counts.** History is for rereading, not for measuring yourself.
- **No app lock, PIN, or encryption.** The device's own lock screen is the security boundary. A second gate is friction on a tool whose value is being openable in ten seconds.
- **No export or backup in v1.** Deliberately accepted risk, disclosed on the info page rather than engineered around.
- **No extended verbatim Big Book passages.** Short question phrases with page citations only.
- **No native apps, no framework, no build step, no package manager.**
- **No analytics, telemetry, or third-party scripts of any kind.**

## Principles

- A practice tool earns its place by being openable, not by being featureful. Every added surface is friction paid at the worst possible moment.
- Structure should prompt, never compel. Presenting a question is help; requiring an answer to it is the app overriding the person doing the inventory.
- Collapsed by default is what makes a long form short. The user decides which question deserves depth today, and the page should not have an opinion about it.
- Durability outranks developer comfort. Something meant to be used daily for years should still open in years, which means no toolchain that can rot.
- Privacy by architecture beats privacy by policy. If there is no server, there is no promise to break.
- Honesty about limits is part of the design. The storage can be evicted, and saying so plainly is better than a backup feature nobody uses.

## Constraints

- Vanilla HTML, CSS, and JavaScript. One `index.html`, one `manifest.webmanifest`, one `sw.js`. No npm, no bundler, no framework, no build step, no runtime dependency.
- Hosted on GitHub Pages at `https://fob698.github.io/spot-check-inventory/`. Browser storage is origin-scoped, so this origin is permanent: renaming the repository destroys every entry on every installed device.
- The repository must be public for free GitHub Pages.
- Phone-first. Target viewport 390px. Every interaction completable one-handed.
- Must function with the network fully unavailable, including a cold launch.
- Typographic register: serif question text at reading size, generous whitespace, warm off-white ground, one restrained accent, near-invisible chrome. Dark mode designed rather than derived, since the nightly review happens in a dark room. (Derived from the second stated want: "I want this to be elegantly laid out and intuitive to use.")
- Quoted Big Book material limited to individual question phrases, each carrying its page citation.
- No text or asset is fetched at runtime. Fonts are system or self-hosted and cached by the service worker.

## Goal

"I want to make a simple web program to do AA spot check inventories based on the methods written in the big book of alcoholics anonymous on pages 86 through 88." Ship a dependency-free, offline-capable, installable web app at `fob698.github.io/spot-check-inventory` with five tabs (Nightly, Spot Check, Morning, Resentment, History) plus an info page, where every tab is a single non-sequential form with collapsed-by-default long-form inputs, the last-used tab is restored on launch, all data stays in device storage with no server involved, and a spot check can be completed in under sixty seconds without reading an instruction.

## Not yet specified

- fog: How the p.87–88 pause material ("when agitated or doubtful, we pause and ask") divides between the Spot Check tab and the Morning tab. Both pages describe asking for the right thought or action. Resolves once the actual page text is transcribed side by side and the overlap is visible.
- fog: The exact column set for the Resentment grid. The p.64–67 text develops the columns across several pages and the fourth column arrives later than the first three. Resolves on transcription, before F4 is built.

## Features

### F0 · Cross-cutting — shell, storage, delivery

Why: every tab is worthless if the app will not open in a parking lot with no signal, or if the text you typed vanished when you took a phone call mid-entry. This feature is the substrate the other five stand on, and it is where the accepted storage risk is actually bounded.

- [x] ISC-1: The repository contains `index.html`, `manifest.webmanifest`, and `sw.js`, and contains no `package.json`, lockfile, or build configuration.
- [ ] ISC-2: A push to `main` publishes to `https://fob698.github.io/spot-check-inventory/`, which returns HTTP 200.
- [x] ISC-3: With the network disabled, a cold launch renders the tab shell and all five tabs.
- [x] ISC-4: An entry written while offline persists and reads back after a full relaunch (after: ISC-3).
- [ ] ISC-5: Publishing a new build updates an already-installed instance within one relaunch, with no manual cache clearing.
- [x] ISC-6: The last-selected tab is restored after full app termination.
- [x] ISC-7: In-progress input persists on a debounced keystroke; force-quitting mid-entry and relaunching restores the unsaved text.
- [x] ISC-8: No delete or clear action executes without a confirmation step.
- [ ] ISC-9: From the home-screen icon, any tab reaches a writable state in at most two taps.
- [x] ISC-10: First contentful paint on a cold launch is under 1000ms on throttled Fast 3G.
- [x] ISC-11: Dark mode follows `prefers-color-scheme`, and a manual override persists across relaunch.
- [x] ISC-12: Anti: zero network requests originate after the app shell has loaded.
- [x] ISC-13: Anti: no account, login, sync, amends-tracking, reminder, notification, badge, or streak surface exists anywhere in the build.
- [x] ISC-14: Anti: no quoted passage longer than a single question phrase appears in the app or the repository, and every quoted phrase carries its page citation.
- [ ] ISC-15: Antecedent: a spot check performed while actually agitated completes in under sixty seconds without the user reading any instructional text.

### F1 · Nightly Review (p.86)

Why: this is the anchor practice and the one most likely to be opened every day, so it sets the interaction pattern the other tabs inherit. Done means the whole p.86 question set is present and none of it is compulsory.

- [ ] ISC-16: The Nightly tab renders the p.86 question set with its page citation.
- [x] ISC-17: Every long-form input in Nightly renders collapsed on a fresh open of the tab.
- [x] ISC-18: A Nightly entry with exactly one question answered saves successfully (after: ISC-16).
- [x] ISC-18.1: No field in Nightly blocks a save with a validation error (after: ISC-16).
- [ ] ISC-19: A saved Nightly entry carries a timestamp and appears in History (after: ISC-18).

### F2 · Spot Check (p.84–85 and p.87–88)

Why: the tab the app is named for and the one used under pressure, where sixty seconds is the difference between a practice and an abandoned icon. Done means the shortest possible path from agitation to a written line.

- [ ] ISC-20: The Spot Check tab renders the watch for selfishness, dishonesty, resentment, and fear, with its p.84–85 citation.
- [ ] ISC-21: The Spot Check tab renders the pause prompt with its p.87–88 citation.
- [x] ISC-22: A Spot Check entry saves with exactly one question answered and the rest untouched (after: ISC-20).

### F3 · Morning (p.86–87)

Why: the third of the three practices on the requested pages, and the one that would otherwise be lost. Done means the morning plan and its asks are capturable in the same form pattern as the others.

- [ ] ISC-23: The Morning tab renders the p.86–87 content set with its page citation.
- [ ] ISC-23.1: A Morning entry saves under the same subset rules as ISC-18 (after: ISC-23).

### F4 · Resentment grid (p.64–67)

Why: a spot check sometimes turns up something too big for one line, and this is where it escalates to. Done means the four-column inventory is genuinely completable on a phone, which is the part most such grids fail.

- [x] ISC-24: The grid captures a row and adds further rows without leaving the tab.
- [x] ISC-25: The grid is completable one-handed at a 390px viewport with no horizontal page scroll.
- [ ] ISC-26: A grid entry saves and appears in History alongside the other entry types (after: ISC-24).

### F5 · History

Why: the reason local storage is worth anything at all is rereading what you wrote last month. Done means finding a past entry is faster than scrolling, and reading it does not require re-expanding every field.

- [x] ISC-27: History lists saved entries newest-first, each showing its date and its type.
- [x] ISC-28: An entry opened from History renders every answered field expanded and collapses only empty fields.
- [x] ISC-29: Text search in History matches against entry body content, not only titles and dates.

### F6 · Info page

Why: this is the only place the app speaks for itself, and it carries three obligations at once: the privacy statement, the honest disclosure of the storage risk, and the line that keeps a stranger from mistaking this for an official AA product.

- [x] ISC-30: The info page appears automatically on first open and dismisses in one tap.
- [ ] ISC-31: An info control is present on every tab and reopens the page (after: ISC-30).
- [x] ISC-32: The info page states that no data is held on any server and that everything remains on the device.
- [x] ISC-33: The info page explains that adding the app to the home screen keeps entries longer, and no part of the app requires or blocks on installation.
- [x] ISC-34: Anti: the info page states that the app is not affiliated with or approved by Alcoholics Anonymous World Services.

## Test Strategy

| isc | type | check | threshold | tool | anchors_to |
|-----|------|-------|-----------|------|------------|
| ISC-1 | bash | `ls` the repo root and grep for build artifacts | zero matches for package.json/lock/config | bash | Constraints |
| ISC-2 | curl | HTTP status of the published URL after a push | 200 | curl | stated_goal |
| ISC-3 | manual-browser | offline cold launch, all five tabs render | no blank page, no error | Interceptor | Vision |
| ISC-4 | manual-browser | write offline, relaunch, read back | text identical | Interceptor | Vision |
| ISC-5 | manual-browser | publish new build, relaunch installed instance | new version served in one relaunch | Interceptor | Constraints |
| ISC-6 | manual-browser | select a tab, terminate, relaunch | same tab active | Interceptor | Goal |
| ISC-7 | manual-browser | type, force-quit, relaunch | in-progress text restored | Interceptor | Principles |
| ISC-8 | manual-browser | invoke every delete path | confirm step on each | Interceptor | Principles |
| ISC-9 | manual-browser | count taps from home-screen icon to writable field | ≤ 2 | Interceptor | Vision |
| ISC-10 | manual-browser | FCP on cold launch, Fast 3G throttle | < 1000ms | Interceptor | Vision |
| ISC-11 | manual-browser | toggle OS theme, then manual override, relaunch | override persists | Interceptor | Constraints |
| ISC-12 | manual-browser | network panel after shell load | zero requests | Interceptor | Out of Scope |
| ISC-13 | bash | grep the source for account/sync/notify/badge/streak surfaces | zero matches | grep | Out of Scope |
| ISC-14 | manual-review | read every quoted string in app and repo | no passage beyond one question phrase; citation on each | Read | Out of Scope |
| ISC-15 | manual-trial | timed spot check performed while actually agitated | < 60s, no instruction read | stopwatch | Vision |
| ISC-16 | manual-review | compare rendered questions against p.86 | full set present, cited | Read | stated_goal |
| ISC-17 | manual-browser | fresh tab open | every long-form input collapsed | Interceptor | Principles |
| ISC-18 | manual-browser | save with one question answered | entry persists | Interceptor | Principles |
| ISC-18.1 | manual-browser | attempt save with every field empty and with one filled | no validation error on any field | Interceptor | Principles |
| ISC-19 | manual-browser | saved entry appears in History with timestamp | present and correct | Interceptor | Goal |
| ISC-20 | manual-review | compare rendered questions against p.84–85 | four-horsemen set present, cited | Read | stated_goal |
| ISC-21 | manual-review | compare pause prompt against p.87–88 | present, cited | Read | stated_goal |
| ISC-22 | manual-browser | save with one answer only | saves | Interceptor | Principles |
| ISC-23 | manual-review | compare rendered content against p.86–87 | plan and asks present, cited | Read | stated_goal |
| ISC-23.1 | manual-browser | save with one answer only | entry persists | Interceptor | Principles |
| ISC-24 | manual-browser | add two rows without navigating away | both persist | Interceptor | Goal |
| ISC-25 | manual-browser | complete a row at 390px | no horizontal scroll, one-handed reach | Interceptor | Constraints |
| ISC-26 | manual-browser | grid entry appears in History | present, typed correctly | Interceptor | Goal |
| ISC-27 | manual-browser | History list order and labels | newest first, date and type shown | Interceptor | Vision |
| ISC-28 | manual-browser | open an entry with mixed filled and empty fields | filled expanded, empty collapsed | Interceptor | Principles |
| ISC-29 | manual-browser | search a string that appears only in a body field | entry returned | Interceptor | Vision |
| ISC-30 | manual-browser | first open with cleared storage | info page shown, one-tap dismiss | Interceptor | Goal |
| ISC-31 | manual-browser | info control present on each of five tabs | reopens page from all five | Interceptor | Goal |
| ISC-32 | manual-review | read the info page copy | server and device-only statement present | Read | Out of Scope |
| ISC-33 | manual-review | read the info page copy; attempt use without installing | explanation present; no install gate | Interceptor | Out of Scope |
| ISC-34 | manual-review | read the info page copy | non-affiliation statement present | Read | Out of Scope |

## Decisions

- 2026-09-16 — Interceptor is not installed on this Linux machine, so browser verification ran through headless Chromium driven over CDP instead. Same class of evidence (real renderer, real service worker, real storage), different driver. Screenshots and probe transcripts captured at 390px mobile viewport.
- 2026-09-16 — ISAGate flagged ISC-18 and ISC-23 as bundled under the Splitting Test. Both split at scaffold time into `.1` children with parent IDs preserved, per the ID-stability rule.

- 2026-09-16 — Shape discovered via Grill, 13 questions. Full log at `~/.claude/LIFEOS/MEMORY/WORK/spot-check-inventory/grill.md`.
- 2026-09-16 — Recommended one-question-at-a-time paced flow; **overridden**. The author has built a version of this before and found he does not usually answer every question, so pacing forces answers he does not want to give. Single scrolling form with free navigation adopted, with collapsed-by-default long-form inputs as the mechanism that keeps it from reading as a wall.
- 2026-09-16 — Recommended a PIN plus WebCrypto encryption at rest; **overridden**. No lock of any kind. The device lock screen is the boundary, and a second gate is friction at the exact moment the tool needs to open fast.
- 2026-09-16 — Recommended tracking amends and corrective measures as open items; **overridden**. Record only. Turning amends into a checklist would make them chores to clear, and the visual register was chosen specifically because this is not a productivity tool.
- 2026-09-16 — Recommended a custom domain so the origin outlives the host; GitHub Pages chosen instead. Consequence accepted and recorded as a Constraint: the repository name is now permanent, because storage is origin-scoped.
- 2026-09-16 — Recommended a home-screen install prompt plus export to defeat iOS Safari's roughly seven-day eviction of script-writable storage on non-installed sites. Risk accepted on philosophical grounds: the value is in the writing, not the keeping. The mitigation is disclosure on the info page (ISC-33), not engineering. Revisit if entries are actually lost.
- 2026-09-16 — Scope grew from the requested pp. 86–88 to five tabs, adding the pp. 64–67 resentment grid and a History tab, by request. The two additions are the largest single source of build cost in this ISA.
- 2026-09-16 — Audience settled as "built for one person, written for anyone." Public URL, no promotion, no analytics, no support burden, and the info page written as a real privacy statement because a stranger may read it.
- 2026-09-16 — Big Book text stance: short verbatim question phrases with page citations, no extended passages. Revisit before any active distribution beyond handing the link to an individual.
- 2026-09-16 — ISA written to the project root rather than the WORK directory, because this is a repository with persistent identity rather than a one-off task. Written impersonally throughout, since the repository must go public for GitHub Pages.

## Verification

_Provenance stubs. Evidence lives in the headless-Chromium CDP probe transcripts and screenshots from 2026-09-16; the proof of record is the commit._

- ISC-1 — static check: repo holds index.html/manifest.webmanifest/sw.js, zero build artifacts
- ISC-3 — CDP cold launch with the origin server killed: 5 panels, 20 questions rendered
- ISC-4 — entry written with server dead persisted; 2 entries read back after relaunch
- ISC-6 — tab restored across reload (`On Awakening`, then `history`)
- ISC-7 — draft restored verbatim after reload from debounced keystroke save
- ISC-8 — confirm() stubbed false on all 3 destructive paths; data intact (2 entries before and after)
- ISC-10 — FCP 244ms, domInteractive 316ms on 180kbps/150ms throttle, cache disabled
- ISC-11 — manual override `light` persisted across reload
- ISC-12 — Network domain: 0 requests after Page.loadEventFired across all 5 tabs plus typing
- ISC-13 — grep: no account/sync/notification/badge surface; sole `login` hit is the About disclaimer
- ISC-14 — static check: longest quoted run is one sentence; all 5 leads carry page citations
- ISC-17 — 8/8 details collapsed, 0 open, on a fresh Nightly open
- ISC-18 — saved with 1 of 8 answered; entry persisted
- ISC-18.1 — no validation gate exists; save path has no required-field check
- ISC-22 — Spot Check saved with 1 of 7 answered while offline
- ISC-24 — 2 rows present after Add another
- ISC-25 — scrollWidth == innerWidth at 390px on all 5 tabs; screenshot O2/02-resentment
- ISC-27 — History listed the saved entry with kind and timestamp
- ISC-28 — expanded entry rendered its 1 answered field; empty fields absent
- ISC-29 — body-text search `parking` returned 1; `zzzznotfound` returned 0
- ISC-30 — info overlay visible on first open (1106 chars), dismissed in one click
- ISC-32 — About copy states no server and device-only storage
- ISC-33 — About explains home-screen storage benefit; no install gate in any code path
- ISC-34 — non-affiliation sentence present in About

**Not yet closed:** ISC-2 and ISC-5 need a real GitHub Pages deploy. ISC-9 needs a timed run on the phone. ISC-15 needs a real agitated moment and a stopwatch. ISC-16, ISC-19–ISC-21, ISC-23, ISC-23.1, ISC-26 and ISC-31 are wording-fidelity or cross-tab checks awaiting a read against the actual pages.

## Remaining Work

- [ ] Transcribe the exact question wording for all five tabs from pp. 64–67 and 84–88 — content gathering, not a claim, and it gates F1 through F4.
- [ ] Audit git history for anything personal before flipping the repository to public — a precondition of ISC-2, not part of it.
- [ ] Note the origin-permanence consequence in the README so the repository is never renamed casually.
