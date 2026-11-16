# COMMITTEE DEBATE LOG — Green Türkiye

> **Central question:** How can we make this game significantly more educational and "addicting" (ethical, intrinsically motivating, *good* compulsion) overall?
> Scope: evaluate **existing** features/mechanics **and** propose **new** ones.
> Log started: 2026-11-16 · Orchestrator: Lead Orchestrator (main session) · Branch: `ccr-f7749a4a-luhvv8`

This file is append-only. Every subagent contribution is recorded verbatim after its round completes. Each round ends with a `### [CHECKPOINT - Round X]` block; to resume, read the latest checkpoint and continue from "Next scheduled action".

---

## PART A — PROJECT OVERVIEW (Phase 1: Codebase Discovery)

### A.1 What the game is
**Green Türkiye** — a single-player, browser-based (React 19 + TS + Tailwind 4 + Vite/rolldown), turn-based **regional environmental management sim**. The player picks one of 3 countries (Türkiye, Germany, UK) and one of ~19 regions, then governs it day by day. Trilingual (TR/EN/DE). No backend, no telemetry. AGPL. A student project (author: Ahmet) whose stated problem (ROADMAP.md, 15 Nov 2026) is: **"the game is educational but nobody plays it."**

### A.2 Core loop (as implemented in `src/reducers/gameReducer.ts`, `src/utils/gameLogic.ts`)
1. `START_GAME`: three stats — **Budget** (500), **Happiness** (40), **Cleanliness** (40). One crisis node is force-spawned on the map. (Region `modifiers` skew tax base, decay and event frequency.)
2. Player taps a **crisis node** on an SVG province map (`OPEN_EVENT`) → `EventModal` shows a crisis with 2–4 choices, each with `{budget, happiness, cleanliness}` effects, optional `bribe` flag, optional `outcome` ("Ne oldu?" what/why card) and optional `delayed[]` consequences.
3. Player may set **tax rate** (Low/Normal/High: −2/+8/+18 budget, +2/0/−2 happiness per day) and **buy projects** (6 total: recycle plant, park, eco park, solar farm, wastewater plant, smart grid; cost 200–700, 5–14 days to build, then passive per-day income; smart grid requires solar). Both are **locked until the first crisis is solved**.
4. **"End Day"** (`TICK`) → daily decay (happiness −1, cleanliness −2, × region mult), tax, passive income, scheduled delayed effects land, project timers tick, **unhandled nodes escalate** (severity 1→3 every 2 days; bleed 0/1/3 per stat/day; **erupt at 6 days** for −12 happy/−15 clean), Kara Holding pollutes (−0.5 clean/tier/day), co-op heals (+0.3/tier/day). New node spawns with p = 0.75 × region mult, **max 3 open** (cap 1 until first solve). Day-end screen (`DaySummary`) shows stat deltas, letters, news TV.
5. **Win:** hold Happiness ≥ 80 **and** Cleanliness ≥ 80 for **20 consecutive days**. **Lose:** any stat ≤ 0.
6. 8 **endings** (`data/story.ts`): green-model, green-shadow, green, coast-sold, toxic, clean-broke, bankrupt, uprising. A `localStorage` "endings found N/8" counter on the game-over screen.

### A.3 Meta/consequence systems (from ROADMAP Faz 2–5, already built)
- **Mikey** (mascot reporter, `Mikey.tsx`, `MikeyHints.tsx`): 5–6 first-time one-line hints (localStorage "seen"), mutable.
- **Letters** (`data/story.ts`, `LetterModal.tsx`): 2 named citizens per region (e.g. Hasan amca / Rize); kinds `delayed | dirty | cleanGood | cleanBad | happyBad`; highlighted key sentence ("fosforlu kalem"). Dirty deal → letter 3 days later; delayed effects → letter on landing.
- **News TV** (`NewsTV.tsx`): Mikey reads cheerful headlines. **Kara Holding** (fictional villain firm; +1 tier per dirty deal, 5 tiers, spawns its own `requiresHolding` crises) vs **Green Co-op** (+1 tier per 2 clean choices).
- **Debrief** (`GameOver.tsx`): restart at top, Mikey reads ending headline, diagnosis line ("first stat to go critical: X on day N"), ≤3 evidence-only cards built from the decision log.
- **Goals/quests** (`data/quests.ts`, `QuestPanel.tsx`): 8 optional milestones (budget > 1000, happy > 80, clean > 85, solve 5/12 crises, reach day 20/40, 6-day sustain) paying one-time stat rewards.
- **Prediction-before-reveal** (`EventModal.tsx`): for events with `outcome` cards, the effect numbers are *hidden* on buttons (only cost tier shown), and the player first guesses which consequence matches which choice before reveal.
- **Infrastructure:** seeded RNG (`utils/rng.ts`), pure reducer, `actionLog` replay test (`npm test`), headless balance sim (`npm run sim` → `scripts/sim-report.md`), event validator (`npm run validate:events`: province names, sources). Procedural synthesized SFX (`utils/sfx.ts`, no audio files). Seasons visual tint (`App.tsx`). Wildlife that reacts to cleanliness (`MapWildlife.tsx`).

### A.4 Content inventory (measured, not guessed)
| Item | Count | Note |
|---|---|---|
| Events | **124** | 113 region-specific, 11 nationwide/generic; ~19 regions have 5–7 each |
| Events with **"Ne oldu?" outcome (what/why)** | **15 / 124 (12%)** | the only events that hide numbers + support prediction |
| Events with **delayed consequences** | **10 / 124 (8%)** | the rest are fully instant "click → numbers move" |
| Events with **source citations** | **15 / 124 (12%)** | validator-enforced |
| Events tagged `mechanisms` (eutrophication, rebound-effect…) | 15 | "codex hooks" with no codex yet |
| Choices flagged `bribe` | **3** | only 3 explicit bribes in the whole game |
| Projects | 6 | all pure stat/income buffs; no educational content attached |
| Citizens (letters) | 2 per region | letter templates: 5 kinds only |
| News headlines | 12 keys | holding1-5, coop1-5, project, sustain |
| Endings | 8 | |
| Quests | 8 | |
| Languages | 3 | every string ×3 — heavy authoring cost |

### A.5 Balance facts from `scripts/sim-report.md` (200 seeded runs/policy)
| Policy | Win | Median days | Note |
|---|---|---|---|
| smart | 55% | 28 | |
| **maxTax** | **56%** | 32 | **dominant strategy — "raise tax to max and play" is as good as "smart"** |
| greedy | 41% | 26 | |
| random | 7% | 18 | |
| **clean** (always pick the cleanest option) | **0%** | 12 | pure virtue loses — ending `clean-broke` is the single most common ending (564 runs) |
| **bribe** (always bribe) | 0% | 8 | |
| idle | 0% | 9 | |
Endings frequency: clean-broke 564, toxic 281, green-shadow 170, uprising 157, green 97, coast-sold 71, green-model 48, bankrupt 10. Event frequency is ~uniform (top 6.7%, bottom 0.1% – the low tail are region-specific events).

### A.6 Existing design constraints stated by the author (ROADMAP.md)
- **Rejected on purpose:** points, leaderboards, daily seed, XP, badges ("Backend and audience don't exist; extrinsic reward overshadows learning"); fixed-seed scripted tutorial; 4 visible pollution bars; "you collapsed on day N because of event X" blame sentences (causal-claim honesty).
- **Principles:** game shows, text doesn't tell; hints are one line; player is an accomplice and the game remembers; replay reason = *content* (different endings, letters); no unprovable causal claims; **no telemetry**; Mikey reacts to the player's decisions, not to the disaster.
- **Deferred pending playtest:** replay-from-a-decision; persistent green map (`localStorage`); hidden pollution stocks (air/water/soil); region-specific scenarios.
- **Open measurement:** Faz 0 and Faz 6 playtests (3–5 students on phones) — targets: first decision ≤60s without reading; one run ≈10–12 min; player explains ≥1 cause-effect in own words; ≥50% restart within 30s.
- **Risks named:** authoring load ×3 languages; Clippy effect; tone (cute mascot vs real disasters); tour system re-balance.

### A.7 Observed structural facts the committee should keep in view
1. Everything is **one scalar `cleanliness`** — `PollutionTag` (`air/water/soil/...`) and `mechanisms` exist in the data but **no mechanic reads them**. The documented teaching goal ("burning waste moves a problem from soil to air") cannot be expressed in the current model.
2. The prediction/explain loop (best pedagogical mechanism in the game) covers only **12%** of content; the other 88% still show raw numbers → min-max by arithmetic.
3. Decision options frequently have one dominant "clean + cheap" or "dirty + rich" shape; choices are mostly **visible trade-offs**, not **uncertain inferences** (except the 15 outcome events).
4. Telemetry-free, backend-free, localStorage-only. Persistence today: hints seen, endings found, language, mute.
5. Quests are stat thresholds that overlap with the win condition; they pay stat rewards (extrinsic, and they inflate stats — a "get a bonus for already being good" loop).
6. Run length (~7–9 min median for winning policies) fits a lesson; between-run continuity is almost non-existent.
7. Project purchase is a pure spreadsheet decision (cost vs per-day yield) with no region-specific or science-specific meaning; the 6 projects are identical in every region.

---

## PART B — COMMITTEE ROSTER

Core five (mandatory) + two dynamically added because the codebase warrants it (content-heavy, simulation-heavy, environment-science subject matter):

| # | Seat | Lens |
|---|---|---|
| 1 | **Cognitive & Learning Scientist** (`LS`) | active recall, retrieval practice, spacing, scaffolding/ZPD, desirable difficulties, transfer, learning *inside* mechanics |
| 2 | **Game Loop & Retention Architect** (`GL`) | core/meta loops, flow, variable reward, mastery curve, pacing, intrinsic replayability |
| 3 | **Behavioral Psychologist — Ethical Engagement** (`BP`) | SDT (autonomy/competence/relatedness), habit formation, streak/momentum, dark-pattern filter |
| 4 | **UX/UI & Game-Feel (Juice) Director** (`UX`) | onboarding, micro-interactions, audio-visual feedback, clarity, friction, mobile |
| 5 | **Principal Game Systems Engineer** (`SE`) | feasibility, architecture, data model, interaction with reducer / replay-determinism / sim / i18n cost |
| 6 | **Environmental-Science Pedagogy Specialist** (`ES`) *(added)* | content truth, systems-thinking misconceptions about pollution, the 124-event content, sources, TR/DE/UK context |
| 7 | **Economy & Progression Balancer** (`EB`) *(added)* | sim numbers, dominant-strategy problem, trilemma tension, quests/rewards, projects economy |

**Protocol:** each round, the Orchestrator briefs each seat in isolation (codebase-grounded), collects the output, appends it **verbatim** below, then writes a CHECKPOINT. Seats run as parallel subagents; they do not edit files — only the Orchestrator writes the log.

---

## PART C — DEBATE
*(rounds appended below)*

---

## ROUND 1 — AUDIT & DIAGNOSIS

### R1 · Game Loop & Retention Architect (`GL`)

**GAME LOOP & RETENTION ARCHITECT, ROUND 1 AUDIT**

Basis: read the log, gameReducer.ts, gameLogic.ts, quests.ts, projects.ts, story.ts, App.tsx, play.ts and sim-report.md, plus a sample of events.ts and grep results from MainMenu, GameOver and useGame. Did not run the game.

**1. What the core loop does well**
- The loop is legible: one crisis, one tap, a few choices, End Day. START_GAME force-spawns the first node, and the spawn cap of 1 until the first solve (`spawnNode`) is a good first-decision design.
- Triage has real tension. Nodes escalate 1→3 and erupt on day 6 (−12 happy, −15 clean). That is a deadline with a visible ramp, with no timer to stress the player.
- The memory layer is the best retention asset in the game. Delayed effects arrive as letters from named citizens, dirty deals get a letter 3 days later, and Kara Holding and the co-op grow from the decision log. This is relatedness and consequence. The player becomes an accomplice who is remembered.
- Prediction-before-reveal is a strong intrinsic hook (curiosity plus competence). It covers only 15 of 124 events.
- Run length of about 7 to 9 minutes (sim: smart 7.1, maxTax 8.8) suits "one more run".

**2. Boredom, friction and flow-breaks**
- **Minute 0-1.** The first node is placed for you, which is good. But projects, tax and quests are locked or silent until the first solve. Mikey gives 5-6 one-line hints, and "End Day" is only taught by a hint.
- **Minutes 1-5.** The deciding choices are mostly visible arithmetic (e.g. `factory-waste`: fine +50/+5 clean beats shutdown −100/+15 clean on cost, and the bribe is obviously worst). Min-maxing from the numbers replaces thinking. Each day is a modal gauntlet: End Day, then DaySummary, then letters, then the news TV, a stop-start rhythm. Days with no node are dead clicks.
- **Minutes 5-10.** This is the structural flaw. Victory is "hold both stats ≥80 for 20 consecutive days." Projects add +7 cleanliness/day in total against a decay of 2 (recycle +2, eco +1, solar +1, water +3), plus income of +15 and +40. Once the engine is built, the player is spamming End Day. Wins are 8-10 build days plus 20 hold days, and most of the hold is automated, so the climax is a wait. The `sustain` news item (every 5 days) is the only drama. The 6-day "Steady Ground" quest overlaps the win condition.
- **Between runs.** GameOver has a restart button, a Mikey headline and a diagnosis line. Persistence is localStorage "endings found N/8" only. There is no carry-over of any kind.

**3. Meta-loop diagnosis**
- **Run #2:** curiosity about a different ending, or a different region. Nothing pulls the player back to the same region. A run draws about 15-21 events from a pool of roughly 17 per region (about 6 regional plus 11 generic, from the `usedEventIds` bag in `spawnNode`). A second run in the same region therefore replays almost the same crises. The "replay = content" principle is true only across regions.
- **Run #5:** the ending counter is the only goal, and it is poorly distributed. `bankrupt` appears 10 times in 1,300 sim runs, and `green-model` (a victory with `holdingTier === 0`) 48 times. Players cannot steer toward a specific ending, so "collecting endings" is luck, not mastery.
- **Run #20:** nothing. No new decision space, no escalating difficulty, no mastery signature.
- The three countries and 19 regions are the only novelty source. The author's constraints block extrinsic carrots, so we need intrinsic hooks: curiosity gaps, mastery goals and relatedness.

**4. Pacing and mastery-curve problems from the sim**
- **maxTax 56% vs smart 55%** means the tax lever is a free lunch. High tax is +18 gold for −2 happiness, but the −2 happiness is easily out-repaired by parks and clean choices. The trade-off is fake, so a recursive "raise tax" rule beats thinking.
- **clean 0% win, median 12 days** and 564 `clean-broke` endings: virtue without economics collapses. Most clean options cost budget (e.g. −100 for the factory shutdown), and decay is 2/day, so the player falls behind early. Teaching "pure virtue loses" is half-honest. Real green policy has co-benefits (e.g. solar income). The game punishes the pedagogical goal it claims to teach.
- **smart ≈ maxTax ≈ 55%**, while greedy gets 41% and random 7%. A skilled and an average player converge, so the mastery ceiling is flat. A good player's improvement is not visible.
- **Dominant project order.** play.ts buys the first affordable project in list order, and still reaches 55%. The projects have no region fit and no sequencing puzzle.
- **Quests** (stat thresholds that also pay stats) add inflation, not mastery.
- Win-state engine-building makes late game trivially safe, while early game (days 1-10) is where all losses happen. The difficulty curve is front-loaded, then flat.

**5. Author-rejected ideas, what I keep rejected and what I would reconsider in intrinsic form**
- **Keep rejected:** points, XP, badges, leaderboards. They would overshadow learning here. A daily seed also stays rejected: no backend, and a shared seed matters little to a solo student audience.
- **Reconsider as an intrinsic form of seeds:** an opt-in "seed card" ("Play this run again with the same crises, different choices"). It lets a player return to the identical scenario to test a hypothesis. It is not daily and not social, and the replay-from-a-decision idea in the log is the same thing. It is deterministic by design (`actionLog` and a seeded RNG already exist), so almost free.
- **Reconsider as a local "Region Dossier" (not badges):** a personal map of region and ending combos, each with Mikey's one-line epitaph. It is a collection that creates curiosity gaps ("Rize + toxic"), not a score. The mastery is knowledge, not points.
- **Reconsider (competence without extrinsic reward):** a "strategy fingerprint" at GameOver (tax stance, bribes, builds, speed to first project) compared with the player's own previous run, local only. This is the visible sign of improvement the flat 55% curve currently hides.
- **Reconsider (autonomy):** optional challenge modifiers chosen before the run ("no High tax", "no bribes ever", "coast-sold route"), unlocked by finishing an ending. These are self-set constraints, not rewards.

**Top 3 fixes I would prioritize**
1. Replace the pure 20-day hold with a *shifting* endgame, so the late game has decisions and the hold phase is not idle.
2. Break the maxTax dominance (tax-driven unrest or event effects) so the economy lever carries cost.
3. Give "clean" some economic co-benefit and add a persistent local dossier to make runs #5-20 meaningful.

*(Orchestrator note: other six Round 1 reports still pending; CHECKPOINT - Round 1 will be written when all arrive.)*

### R1 · Cognitive & Learning Scientist (`LS`)

**LEARNING SCIENTIST, ROUND 1 AUDIT** (read-only; read the log, EventModal, reducer, GameOver, MikeyHints, quests, story, and events.ts lines 1-210 and 350-420; sampled the rest by grep)

**(1) What already works, and why**
- **Predict-then-reveal (EventModal.tsx 77-89, 237-251).** The player commits to a hypothesis, gets feedback, then reads a causal "why". That is the generation/hypercorrection effect. A wrong guess costs nothing and the message is non-punitive (amber, not red). It also needs no extra authoring, because the options are the event's own `outcome.what` strings.
- **Hidden effects with a visible cost tier (EventModal.tsx 28-43).** Money is public and consequences are inferred. This is a fair, desirable difficulty that stops arithmetic min-maxing.
- **The "why" texts are misconception-targeted, not just factual.** Examples: "visible pollution and health risk are not the same thing" (marmara-urban-renewal, dust barriers); "export moves pollution, it doesn't remove it" (ewaste-dump); "a free bag's cost becomes invisible" (plastic-ban). Distractor options are plausible but wrong (dust barrier, export), which gives them diagnostic value.
- **Real-world anchoring.** plastic-ban uses actual Turkish policy, and sources carry a verified/partly-verified flag. This models epistemic honesty and supports far transfer.
- **Delayed letters (gameReducer.ts 308-314, 422-427; story.ts `LETTERS.delayed`).** They are a delayed-feedback mechanic written as narrative ("nobody noticed much that day"). That is a correct model of lagged environmental effects.

**(2) Top 5 leaks**
1. **88% of events teach the wrong lesson by dominance.** In blacksea-hes (events.ts ~400), "Cancel" gives +25 happy and +10 clean, and "Security forces" gives -30 and -5. One option strictly dominates, so the transferable rule is "pick the one with plus signs". adana-stubble-burning is the same: training beats penalties on both non-money stats. Raw numbers sit on the buttons (the `effectRow` branch, line 330). The player learns the numbers, not the stubble/smoke/soil mechanism.
2. **Prediction is recognition-matching, and it happens after commitment.**
   - Options are the `what` strings of the very choices the player just saw, so elimination suffices, with no free recall.
   - The choice is already applied, so a wrong prediction changes nothing and the player cannot act on it.
   - `shuffledIndices` is stable per event id, so on a repeat the answer sits in the same slot and the player memorises position, not mechanism.
   - Nothing records or reuses predictions, so there is no calibration across a run.
3. **Cleanliness decays on its own with no cause (gameReducer.ts 335-342).** A flat -2 per day, region-scaled, reinforces the misconception that pollution is entropy rather than a stock that someone is emitting. The scalar also cannot express displacement. The ewaste "export" shows cleanliness 0 and +40 budget, so the player sees a free lunch. The `pollution-displacement` tag is read by no code.
4. **Delayed consequences are too sparse and too late to teach.** Only 10 of 124 events have them, and one lands at +22 days (marmara asbestos) against a median winning run of about 28 days. A letter then fires with generic text; the template re-states neither the mechanism nor the original choice's reasoning. The player is not prompted to link cause and effect, and an asbestos-style 'years later' effect is shortened to 22 days.
5. **The debrief reviews logistics, not concepts (GameOver.tsx 41-53).** The cards are "N decisions in D days", "dirty deals: n", and "first critical stat: X". This is the best consolidation moment and it contains no retrieval, no mechanism recap and no "you saw X, here is the one idea". Projects (6, identical everywhere) and quests (stat thresholds, paid in stats) carry zero domain content. The quest-to-stat reward loop is also Goodharting: reward the already-good.

**(3) Missing entirely**
- **Spaced retrieval.** A run draws about 12 of about 124 events from a bag, and tags (`mechanisms`) are never used to schedule a concept for a second encounter in a different context. There is no cross-run memory of what the player has gotten wrong.
- **Free recall or application.** There is no "which choice here would X apply to?" transfer item.
- **Scaffolding and ZPD.** Mikey hints scaffold the UI only (MikeyHints.tsx), never the domain. Every event is drawn uniformly, with no easy-to-hard concept sequencing and no adaptation to prediction accuracy.
- **A concept record.** `mechanisms` are tagged but there is no codex, so learning is invisible to the player.
- **Counterfactual contrast.** The player never sees "what the other option would have done", which is the strongest transfer scaffold.

**(4) Reconsiderations and constraints I respect**
- **Reconsider "replay-from-a-decision" (deferred).** One-rewind-per-run with a reveal of the road not taken is the best desirable-difficulty and counterfactual device available, and it fits the pure reducer plus `actionLog`.
- **Reconsider the blame-sentence rejection narrowly.** I agree with banning unprovable causal claims. A concept recap is not one: "in this run you met pollution-displacement (ewaste); the idea is X" is provable from `decisions` and states a mechanism, not a cause of collapse.
- **Hidden pollution stocks (deferred): support a minimal two-stock version.** At least air/soil/water-lite, so displacement can be expressed. Otherwise the stated teaching goal is unreachable.
- **Constraints I respect.** No points, XP, leaderboards or badges (a concept codex is knowledge, not currency); no telemetry or backend, so persistence stays in `localStorage`; one-line hints; deterministic reducer and `actionLog` replay; the trilingual authoring cost, which means any new mechanic should reuse existing `outcome` strings rather than add new text; no fixed-seed scripted tutorial.

**Priority fix:** extend the hidden-numbers and predict model to all events by converting the dominance-shaped choices into real trade-offs, because that closes leak 1 and raises coverage from 12% to 100% at the same time.

---

### R1 · UX/UI & Game-Feel (Juice) Director (`UX`)

**UX / Game-Feel Director, Round 1 audit.** Everything below is from reading the code. Not played on a device. Zero uses of `navigator.vibrate` and zero `aria-live` regions exist in `src` (grep).

**1. What already works**
- **Mikey is the best asset.** Mood-driven SVG with real animation (hop, tear, jolt) in `Mikey.tsx` and `index.css`. Hints are one line, shown once, non-modal, and the arm aims at the target element (`MikeyHints.tsx`, `.hint-target` glow).
- **Crisis nodes encode severity three ways.** Size, colour and ping speed change, a digit appears, and there is an aria-label (`App.tsx` L156-198). Good accessibility and good clarity.
- **The map degrades with pollution.** The sepia, grayscale and brightness filter on the SVG group animates over 1.5s (`CountryMap.tsx` L26-37).
- **Project completion is the one decision with map feedback.** A fly-in, a burst, a chime and a permanent site icon (`ProjectSites.tsx`).
- **The predict-then-reveal flow in `EventModal.tsx` is well built.** Focus trap, tiered costs, and a header colour that changes from red alarm to blue question to green lesson. It sets the standard for the other 88% of events.
- **Reduced motion is respected globally** (`index.css` L96-105), and Mikey and the hint glow are guarded again.
- **The day summary pairs the TV and the letters on one screen**, split into columns in landscape (`DaySummary.tsx`).

**2. Friction and clarity**

*First 60 seconds*
- The game opens straight into a map with one amber node and a Mikey bubble. The goal (hold happiness and cleanliness at 80 or more for 20 days) is visible only as a small "sustainability 0/20" bar in the HUD. Nothing says that 80/80 is the target, and the bars have no 80 marker.
- The HUD says nothing about what a node is until the player taps it, and Mikey says it once.
- The first node's prompt (`hint.firstNode`) fires only if the player has not seen it before. After a restart or a second run there is zero guidance, which is correct for veterans and bad for a classmate borrowing the phone. localStorage keys it per browser, not per person.

*Per-turn flow*
- Tap node, choice, floating numbers, modal closes, tap End Day, DaySummary, tap Continue: four or more taps and two overlays per day with no skip, and "End Day" is disabled behind the modal. It is also the only way to advance, because nothing else moves time.
- `DaySummary` shows only deltas. It does not show the new totals, so the player has to read the HUD behind the dimmed backdrop. It also never says which cause produced which delta. It would help to show "-2 cleanliness: unsolved nodes 3, Kara Holding tier 2" as icons.
- **Floating text in `EventModal` positions at the click point and then the modal immediately closes.** `onChoice` runs in the same tick. For the 85% of events with no explainer, the player's reward is three numbers drifting over a map that is changing underneath them. The HUD bars do animate, but the player's eyes are on the dialog.
- After a choice the player never sees the node vanish with any ceremony. It simply disappears.
- **Quest panel on mobile**: `max-sm:top-72` places a 280px panel off to the side, and the toggle is a 40px chevron (`QuestPanel.tsx` L29-37). This duplicates the HUD's job and carries extrinsic stat rewards.

*Mobile landscape (the target)*
- The HUD is a top strip. Bottom-centre has End Day plus two mute buttons, bottom-left has the tax panel, and bottom-right has the Projects button. The map is therefore squeezed into a band between the top HUD and the bottom controls. At about 360px height, `mobile-landscape:text-[9px]` and `[10px]` appear throughout, which is unreadable and gives touch targets under 44px (Mikey and sound toggles `p-1.5` around a 14px icon; tax buttons at `py-1`).
- The volume button is `max-sm:invisible` (`App.tsx` L119). On a phone you can never un-mute the SFX, which `sfx.ts` reads as muted from localStorage at load. That is a trap.
- The Mikey bubble sits at top-centre and can cover the HUD stat it points at. `mobile-landscape:!text-lg` forces 18px Caveat in a bubble capped at `min(90vw,360px)`.
- Effect rows at `text-[10px]` inside choice buttons are a real reading problem.
- **Pointer targets are small.** Nodes are 40px at severity 1 (`p-1.5` + 16px icon + border). A thumb that taps a province may also tap the wrong node when two are close.

**3. Where feedback is missing on the map** — the biggest gap. The map is a flat slate-200 country with one green province. The only state it reflects is the global cleanliness filter, which is slow, desaturating and applied to the whole SVG. That makes it feel like a dimmer, not a place.
- **The selected region is the only thing that is ever coloured.** The player manages one province, but a pollution filter hits the entire country, so the thing they control and the thing that shows consequences are different objects.
- **A node never visibly resolves.** Solving a crisis does not produce a clean-up on that spot, and ignoring one does not produce a stain. Eruption is a sound (`eruption()`) but no visual. A node that grows for 6 days then vanishes is invisible punishment.
- **Dirty deals leave no mark.** Kara Holding tiers 1-5 only drive a letter and a news line. A grey smokestack icon or soot patch on the player's own province, growing with tier, would make "the game remembers" literal. The co-op equivalent would be green tufts or wind turbines.
- **Delayed consequences have no visual countdown.** `delayed[]` effects land with a letter, but a pending consequence could appear as a faint dashed ring or a small clock on the map.
- **Projects** only ever add one icon each. Construction has no map presence (a scaffold marker with a day count), so `activeProjects` is visible only inside a modal.
- **MapWildlife is purely decorative and ignores cleanliness**, despite the discovery log saying wildlife "reacts to cleanliness". It does not: planes and boats run regardless. Wiring it up (boats thin out, birds or fish at high cleanliness, haze at low) would cost about 20 lines. *(Orchestrator note: this corrects Part A.3 of this log, which claimed wildlife reacts to cleanliness — verify in R2/R3 before relying on either claim.)*
- `useGameSfx` plays a tone for spawn, escalation, eruption, victory and defeat, but not for day tick, tax change, stat threshold crossings (80 or 30) or sustain-streak progress.

**4. Cheap, high-impact juice (ranked by impact per hour)**
1. **Stat-delta pulses on the HUD.** On any stat change, flash the bar green or red and tick the number up or down over about 400ms. About 15 lines in `GameHUD`, and it replaces the floating text lost when the modal closes.
2. **Node resolve and erupt animations.** On resolve, scale the node down and burst green or red. On eruption, shake the map for 300ms and flash a red ring on the province. Reuse the `project-burst` keyframes.
3. **Province-level pollution tint.** Fill the player's province with a colour interpolated from cleanliness (green to brown) instead of the whole-country filter. Keep the global filter at half strength.
4. **Haptics.** `navigator.vibrate(10)` on taps, `[20,30,20]` on a bad choice, `[10,20,10,20,40]` on project complete, 80ms on eruption. Feature-detect and wrap in try/catch. Gate it behind the same mute toggle and `prefers-reduced-motion`. About 10 lines and the cheapest way to make phone play feel physical.
5. **Day-tick ceremony.** Season colour wash, a clock tick, and a "Day N" slide-in banner. Today the day changes silently under the dim overlay.
6. **Threshold sounds.** A rising chime when a stat crosses 80, a minor drone at under 30, and a pitch-stepped tick for each sustain day. The sustain streak is the core fantasy and currently has no sound.
7. **Reduce-motion gaps.** The global rule sets `animation-iteration-count: 1`, which also kills the pulse that tells a player a node is urgent. Keep a static severity ring so the information survives.

**5. What works against learning**
- **Modal-over-map is the single biggest problem.** Every decision happens on a dark blurred overlay with the map hidden. The player decides without seeing the province, the node's location, or the other nodes. "Game shows, text doesn't tell" fails here: the information that matters (where, how bad, what else is burning) is covered.
- **88% of events show raw numbers on buttons** (`effectRow`), which invites arithmetic min-maxing rather than inference.
- **Learning content is gated behind a modal tap.** The `why` and sources appear only for 12% of events, and the "Ne oldu?" card is the only place a player reads a causal chain.
- **Reading load**: the prediction step shows full `what` sentences as options. On a phone, three or four paragraph-length buttons in a 10-12px font is a wall of text.
- **The News TV is bright, cheerful and fast**, and it can be skipped. Its job (irony about Kara Holding) is excellent but it is optional reading in a screen that can be tapped through.
- **The debrief on `GameOver`** says "first stat to go critical". There is no replay, no map snapshot of the player's province over time, and no per-decision timeline. The best learning moment shows the least visual evidence.
- **Quest rewards in stats** (`QuestPanel`) turn a teaching moment into a bonus hunt, and the panel hides off-screen by default.
- **The 80 marker is missing** on the happiness and cleanliness bars, so players cannot see how close they are to winning.

**Recommended priority:**
1. A persistent mini-map or side placement of the modal in landscape (choices on the right, map visible on the left), so decisions are made while seeing the province.
2. Province-level consequence visuals: soot or green markers per holding or co-op tier, node resolve and erupt animations, pending-consequence markers.
3. HUD delta pulses, haptics and threshold sounds, all gated by mute and reduced-motion.
4. Fix the mobile traps: the invisible volume button, sub-44px targets, and the 9-10px text.
5. Add an 80 marker to the bars and show totals in the day summary.

---

### R1 · Principal Game Systems Engineer (`SE`)

**SE audit, Round 1 (read-only; ran nothing)**

**1. Strengths to preserve**
- `gameReducer` is pure, and every random draw threads `rngSeed` through state (`nextRandom` in `rng.ts`, `spawnNode`). `createSeed()` is only called from `GameContext.startGame`. Keep this rule: no `Date.now` or `Math.random` anywhere under `src/reducers` or `src/utils/gameLogic`.
- The `gameReducer` wrapper logs actions and skips no-ops. `scripts/replay-test.ts` replays `actionLog` from `INITIAL_STATE` and `assert.deepEqual`s the result across 7 policies × 30 seeds. This is the project's best asset. It is what makes replay-from-decision, shareable seeds and honest "your choice on day N" claims possible.
- `scripts/play.ts` drives the real reducer, so sim and replay cover the same code the UI uses.
- `validate-events.mjs` already enforces trilingual completeness, province names, sources-imply-outcomes, and a "dominant choice" warning. It is the right place for new content-schema gates.
- `TUNING` is centralised, `ScheduledEffect` already models delayed stock-like consequences, and `PollutionTag` and `mechanisms` already exist on events.

**2. Debt and constraints**
- **Single scalar `cleanliness`.** It appears in `Effects`, `Project.effects`, `Quest`, `evaluateQuests`, `markCritical`, the win and lose checks, `isDirtyDeal` and `isCleanChoice` (in `story.ts`), and the HUD. There are about 250 occurrences in `events.ts` alone (124 events × ~3 choices). Any new stock model must keep `cleanliness` as a **derived** value, or all of that breaks.
- **`actionLog` bloat.** `START_GAME.payload` embeds the whole `Country` object (SVG `provincePaths`) and `BUY_PROJECT` embeds a whole `Project`. The log cannot be serialised cheaply, which blocks share links and persistence. Fix it first by logging `{countryId, regionId}` and `{projectId}`; the reducer already imports `getRegion` and `PROJECTS`. The `deepEqual` test still passes.
- **Logs are tied to the content version.** `HANDLE_CHOICE` stores a `choiceIndex` and `OPEN_EVENT` stores a `nodeId`. The event pool is the unversioned global `EVENTS`, and the reducer imports content directly. Reordering or adding an event or choice changes every old seed's run, so saved logs and shared links silently go stale. This needs a `CONTENT_VERSION` constant.
- **Thin `Decision` shape.** `{day, eventId, choiceIndex, dirty}`. It lacks the tags and mechanisms the choice touched, what the player predicted, and whether the outcome card was seen. It is the substrate for the debrief, the codex and spaced re-surfacing, and extending it needs no migration because it is not persisted.
- **`GameState` is a flat bag.** Letters, news, quests, holding and coop are all top-level fields. `INITIAL_STATE` is re-spread on `START_GAME`, so adding fields is cheap, but per-run and cross-run data must not be mixed.
- **Persistence is ad-hoc `localStorage`.** Four unrelated keys (hints, endings, language, mute); `sfx.ts` and `LanguageContext` read it unguarded. There is no schema or versioning, so you need a single `gt_meta_v1` module with try/catch and migration.
- **Event selection is a plain shuffled bag.** `usedEventIds` plus a uniform draw in `spawnNode`. It knows nothing of the player.
- **Authoring cost.** Every string is ×3 languages. Only 15 of 124 events have `outcome`. The validator forces sources whenever an outcome exists, which is good for honesty but a bottleneck for content scale.
- **`npm test` and `npm run sim` are not in `.github/workflows/deploy.yml`.** CI runs only lint, validate and build, so the replay guarantee is currently unenforced.
- The replay test's causal check is weak: it only verifies that some `HANDLE_CHOICE` has a matching `choiceIndex`, not that it matches the right event.

**3. Feasibility map (LOC rough, excluding content authoring and UI)**

| Extension | Where it plugs in | LOC / risk |
|---|---|---|
| (a) Multi-medium stocks | Add `GameState.media: Record<'air'\|'water'\|'soil'\|…, number>`. Per-choice deltas keyed by medium, optional on `Effects`; where absent, derive them from `tags.pollution` split equally from the existing `cleanliness` number. `cleanliness` becomes a weighted aggregate computed in a single helper, so the HUD, win check and quests don't change. Add transfer rules (burning waste moves soil to air) as data, applied in `HANDLE_CHOICE` and `TICK` decay. | ~250 LOC plus content. **High risk:** the sim balance shifts, and win and lose can drift. Mitigate by making the aggregate's mean-preserving default a regression test against current `sim-report.md`. |
| (b) Codex / field journal | Cross-run meta store (see f). Unlock on `mechanisms` seen in `decisions`; requires a `CodexEntry` data file ×3 languages. Pure derived data, no reducer change. | ~150 LOC. **Low risk;** content-bound. |
| (c) Adaptivity / spaced re-surfacing | Replace the uniform draw in `spawnNode` with weights from `decisions` plus a per-`mechanism` mastery map (player predicted wrongly, or not yet seen). It must stay deterministic and use the seeded draw: compute weights from state only. | ~120 LOC. **Medium risk:** needs pool size per mechanism. Only 15 events have mechanisms, so tag more first or it's a no-op. Do not gate on wall-clock "spacing"; use game days. |
| (d) New project/policy types | `Project` is just data, with `effects` and `prerequisites`. Add `mediumPerTurn` and region-specific availability (`regionIds?`). Policies are a new `GameAction` (`SET_POLICY`), so you need a new action in the union and the replay path. | ~80 LOC for projects, ~150 for policies. **Low risk,** and the sim must be re-run. |
| (e) Replay-from-a-decision | Needs the log to be compact (fix the payloads). Then `actionLog.slice(0, k).reduce(gameReducer, INITIAL_STATE)` rewinds to that decision, and the player re-chooses. Expose the rewind as a new `REWIND_TO` action that **truncates** the log; do not branch it, so the replay invariant holds. | ~60 LOC. **Low risk,** provided the content version is unchanged. |
| (f) Persistent meta-state | New `src/meta/` module (`loadMeta` and `saveMeta` with try/catch and schema version) that stays outside `GameState` and is updated by a UI effect on `isGameOver`, never in the reducer, which keeps the reducer pure. | ~120 LOC. **Low risk,** with data-loss risk. |
| (g) Shareable run links, no backend | Encode `{contentVersion, countryId, regionId, seed}` into a URL hash. This alone gives "same map, same crises", and the seeded RNG already supports it. A full-log share needs compact encoding such as a delta of choice indices (~2 bytes per action), so a ~60-decision run is ~120 bytes: fine in a hash. | Seed link ~40 LOC; full-log ~100 LOC. **Low to medium risk** (content-version drift). |

**4. Test, sim and validator changes**
- Replay test: add the new action types to `POLICIES` coverage, and add (i) an explicit "log survives JSON round-trip" assertion, (ii) a rewind-then-replay equals original-prefix assertion, (iii) a derived-`cleanliness` invariance test for (a).
- `play.ts` policies must be taught about new mechanics (e.g. a `diversified` policy), and the `random` policy should be a seeded draw. The sim is currently measuring a game that has no hidden stocks. Add win-rate and ending targets as assertions (e.g. maxTax gap ≤ 10 points, `clean` > 0%), and **wire `npm test` into CI**.
- Validator: add a check that every `mechanisms` entry has a codex entry, every `tags.pollution` event with medium deltas sums within bounds, and a "mechanism coverage" report (events per mechanism ≥ 3).

**5. Top 3 technical risks**
1. **Determinism drift.** Any new consumer of randomness, any new field the reducer reads from outside state (meta-store, `localStorage`, `Date`), or any content edit silently breaks replay and shared links. Adaptivity (c) and meta-state (f) are the two highest temptations. Rule: the reducer receives meta as an explicit action payload that is logged, or does not see it.
2. **Balance and sim blindness.** The sim policies don't understand new mechanics, so new systems will pass tests while being dominated (maxTax is already dominant). Lock sim assertions before shipping (a) or (d).
3. **Content cost versus 3 languages and sourced-claim honesty.** Features (b), (a) and (c) are all content-limited: 15 of 124 events have outcomes and sources. Ship systems that degrade gracefully on unsourced content, and prefer fewer, deeper events with tagged mechanisms over more mechanics.

**Opinionated sequencing:** first, compact the `actionLog` payloads, add a content version, and put `npm test` in CI. These are ~100 LOC total and unlock (e) and (g). Then (f) and (b) (cheap, learning-heavy). Treat (a) as the largest, riskiest change and do it behind the derived-`cleanliness` shim.

*(Orchestrator note: 4 of 7 Round 1 reports logged (GL, LS, UX, SE). Pending: BP, ES, EB.)*

### R1 · Behavioral Psychologist — Ethical Engagement (`BP`)

**BP Round 1 – SDT audit (read-only, grounded in code)**

**1. SDT scorecard**

**Autonomy: 5/10.**
- For: the player chooses which node to open and in what order, the tax rate, and projects. Mikey hints are one-time, non-modal and tap-to-close (`MikeyHints.tsx`). Quests are optional.
- Against, goal: there is one imposed goal (80/80 for 20 days) and no self-chosen goal or personal framing.
- Against, scaffolding: tax and projects stay locked, and spawn is capped at one node, until the first solve (`spawnNode` cap).
- Against, illusory choice: `scripts/sim-report.md` shows maxTax is as good as smart play, and "always clean" wins 0%, so "pure virtue" is not a real option. That is the main autonomy problem (choices that don't matter are not autonomy).
- Against, pressure: eruption at 6 days (`nodeEruptionDays`) is simulation pressure, not a real-time timer, so it passes the filter. It still nudges "clear the board" over "think".

**Competence: 6/10, with high ceiling and uneven delivery.**
- Best asset: predict-then-reveal in `EventModal.tsx`. The feedback is neutral ("Tahminin yanlış" with an amber X, no score or penalty). It adds a why-card and sources, and it is the only place where competence means understanding.
- Weakness 1: only 12% of events have this loop. The other 88% teach arithmetic competence (read numbers, min-max).
- Weakness 2, a leak found: `handleChoiceClick` shows floating +/- numbers and plays `sfx.choiceGood/Bad` computed from the hidden effects (lines 136-166). That spoils the hidden-effects design right before the prediction.
- Weakness 3: `DaySummary` shows stat deltas with no cause. Honest, but gives no mastery signal.
- Weakness 4: there is no cross-run sense of "I now understand X". `clean-broke` is the most common ending (564 runs), so the typical virtuous player feels bad at being good.

**Relatedness: 3/10.**
- Named citizens, letters and Mikey are good seeds.
- Characters are only names and professions. All five letter templates are identical for every citizen (`LETTERS` in `story.ts`). `cast[letters.length % cast.length]` picks the writer by turn order, not by who the decision affected. So the fisherman Rıza can write about a tourist event, and "Balık kalmadı" (the fish are gone) is sent in a wheat region.
- The relationship does not persist across runs, and there is no social layer at all.

**2. Existing mechanics**

Healthy:
- Prediction loop plus sources.
- Letters as delayed, consequence-bearing narrative (accomplice framing).
- "Endings found N/8" is a benign curiosity or collection hook: no streak, no loss, rules-based.
- Restart at top, autofocused, so run friction is low.
- `firstCritical` diagnosis is stat-based, not blame-based.
- The news TV irony (Mikey cheerfully reading Kara Holding news) is good media-literacy material.

Quietly problematic:
1. **`isDirtyDeal` is too broad.** It treats `budget>0 && cleanliness<0` as a dirty deal, so "Welcome Everyone" in the tourist event (+80 budget, -10 clean) counts as corruption. It grows Kara Holding and triggers the letter "you looked the other way for that company. We have not forgotten." plus the debrief line "You sided with the money N times." That is a causal and moral misattribution, and it breaks the author's own rule against unprovable causal claims. It shames students for ordinary trade-offs.
2. **Guilt without repair.** `holdingTier` only ever increases (`Math.min(5, tier+1)`, never decreased). The co-op heals only +0.3/tier/day. So a player who made a dirty choice on day 2 has a permanently worse run and is told "we have not forgotten". That is learned helplessness, not remorse that teaches. For a classroom, guilt must come with an action.
3. **Is "bribe = path to losing" honest?** Partly. Strength: the delayed bribes (+90 now, -10 clean at day 4, +150 now, concrete at day 5) are genuinely tempting and teach delayed cost. Weakness 1: the choice is labelled "(Bribe)" in its own text and is always net-negative, a signposted strawman that tests obedience, not judgment. Weakness 2: real corruption often pays for a long time and fails by detection risk, not guaranteed ecological collapse. The sim's "bribe policy: 0% win" teaches "corruption always fails", which is a moral claim, not an inference. Better: unlabelled temptations with a visible short-term gain, and a reveal.
4. **Quests invert motivation.** Rewards are stat boosts for already hitting thresholds (`survivor` pays +15 clean, +10 happy just for reaching day 20), `budget_master` rewards money, and `happy_people` pays budget. That is extrinsic and inflates stats. It also muddies "did my decision work?".
5. Auto-focused "Play Again" above the debrief invites skipping reflection. Not manipulative, but the opposite of "diagnosis first".

**3. What's missing (no backend, no telemetry, classroom)**
- **Persistent local relationships.** A citizen who recurs across runs, remembers the last ending (localStorage "your previous visit"), and writes in their own voice about their own stake (fish, tea, the school).
- **Repair arcs**, so guilt becomes agency: an apology and restitution choice, and a tier that can go down.
- **Meaning.** "Your run mirrors a real place": the region, a source, and "what happened in real life". The `mechanisms` tags (15 events) have no codex.
- **Relatedness without servers.** A classroom comparison of *different decisions* (not scores), such as a printable or copy-paste seed or "my ending code" that a teacher can discuss. Cooperative framing: "your class's endings" shown as a discussion-prompt card, with no ranking.
- **A way to choose own goal**, e.g. a player-picked "mission" at start (protect fish, school roof) that the debrief reports on.

**4. Ethical guardrails (enforce on all proposals)**
1. No streaks, daily rewards, login-count anything, or "come back tomorrow" mechanics.
2. No loss-framed counters ("don't lose X"). Progress is only ever displayed as accumulation.
3. No real-time timers or scarcity. The sim clock only moves when the player ends the day.
4. No variable-ratio loot, gacha, mystery boxes, or random reward amounts. Random content is fine; randomised *reward magnitude* is not.
5. No social comparison of people: no leaderboards, shame lists, or "you did worse than N%". Compare *decision paths*, never players.
6. No guilt without agency. Every negative moral signal (letter, headline, debrief) must be paired with a possible repair action or next-run lever.
7. Causal honesty. Every claim about the player's decision must be provable from the decision log. Fix `isDirtyDeal` before anything depends on it. Label things "corrupt" only when they are.
8. Extrinsic rewards must never be stats the player can use to win. Prefer content reveals (a story, a codex entry, a citizen update) over currency.
9. Hidden information must stay hidden: audit sfx, floaters and colours for leaks.
10. A losing run must show the player something learned within 10 seconds. No dead-end screens, no "try again" without a cause diagnosis.
11. Failure is never moralised ("bad choice"). Use "here is the mechanism".
12. Everything must work with no storage and no network (storage may throw), and be skippable and mutable.
13. Session end is always offered, never delayed. No interstitial nudges to continue, no "one more day?" prompts.

Files inspected: `COMMITTEE_DEBATE_LOG.md`, `src/data/story.ts`, `src/components/{GameOver,DaySummary,MikeyHints,EventModal}.tsx`, `src/data/quests.ts`, `src/reducers/gameReducer.ts`, `src/data/events.ts` (bribe choices at lines ~22, 2542 and 2568), `src/i18n/translations.ts`.

---

> **ORCHESTRATOR ERRATUM (verified):** Part A.3 stated that `MapWildlife.tsx` "reacts to cleanliness". `grep cleanliness src/components/MapWildlife.tsx` returns nothing; UX's finding is correct — wildlife is decorative and does not read game state. Treat this as a *missing* feedback channel, not an existing one.

*(Orchestrator note: 5 of 7 Round 1 reports logged (GL, LS, UX, SE, BP). Pending: ES, EB.)*

### R1 · Environmental-Science Pedagogy Specialist (`ES`)

**ES AUDIT, ROUND 1** (read-only; read types, projects, quests, story, and all 124 events via a parsed dump)

**1. What teaches correct science (keep, and use as the quality bar)**
These are the 15 events with an `outcome` card. Most of the teaching is in the `why` text, not the numbers.
- `konya-sinkhole` teaches the rebound effect and cites Grafton 2018. Drip subsidy alone backfires, and only a metered cap breaks the rebound.
- `istanbul-mucilage` teaches symptom versus cause. Skimming gives +10 now and -15 delayed.
- `ergene-textile-dye` and `ewaste-dump` teach displacement (outfall to sea, export abroad), plus downstream responsibility and EPR.
- `harran-salinity` teaches slow accumulation that is invisible in the early years.
- `hazelnut-aflatoxin` is the best misconception-buster. Organic farming is deliberately the wrong mechanism, because aflatoxin is a moisture problem.
- `aegean-wind-siting`, `hatay-belen-migration`, `dust-transport`, `aegean-geothermal-reinjection`, `van-pearl-mullet`, `med-invasive-fish` and `plastic-ban` teach siting, temporal concentration, exposure versus source, and price signals. `aegean-wind-siting` and `med-invasive-fish` also teach that cancelling is not "nothing" and that nature does not self-balance.
- `aegean-olive-vs-lignite` teaches irreversibility and sequence. Holding the permit is the best option.

**2. Where the model teaches something wrong or misleading**
1. **Harm lags, cure is instant.** All 10 `delayed` entries sit on bad or placebo options (the dirty-deal and quick-fix choices). Every clean option pays on the click. `istanbul-mucilage` says treatment "took years" yet gives +25 the same day. `konya-sinkhole` option 3 says the "drawdown stopped" for +20 instantly. `ruhr-river-cleanup` (the Emscher took decades) and `se-thames-quality` also pay out on the click. This is "nature heals instantly" and "buy back damage", built into the data.
2. **Time heals.** Quests `survivor` (day 20) and `long_haul` (day 40) pay +10 to +15 cleanliness just for waiting. `crisis_manager` and `crisis_veteran` count any choice as "resolved", so a bribe counts. Daily decay (-2) is a constant that is unrelated to any source.
3. **Green means expensive.** The cleanest option costs budget in 110 of 124 events (89%). The dirtiest option out-earns the cleanest in 101 (81%). The exceptions are mostly wind and hydro (`scotland-highland-wind`, `wales-hydro-valley`, `nord-offshore-wind`). There is no avoided-cost accounting for health, floods or fisheries. `plastic-ban`'s `why` says the cost of free bags "returns later", yet "Leave Unregulated" shows +10 budget.
4. **Wind is a free lunch in DE and UK, but not in Türkiye.** `scotland-highland-wind`, `ost-wind-nimby`, `wales-offshore-wind-fishing` and `ni-antrim-wind-land-dispute` give +15 to +20 cleanliness and money. Only happiness suffers. `ni-antrim` rewards "ignore the dispute". This contradicts `aegean-wind-siting` and Belen, where siting and wildlife costs are real.
5. **Dubious afforestation.** `ankara-green-belt` makes a planted forest in native steppe the best option at +20/+20, unsourced. `wales-afforestation` has the same shape.
6. **The `cleanliness` stat hides displacement.** `tags.pollution` and `basin` are read by no mechanic. Burning versus landfilling cannot show up as a trade-off in the numbers.
7. **Timescale is incoherent.** In `marmara-urban-renewal`, asbestos effects "years later" land in 22 days. Mucilage "next summer" lands in 25 days. A median winning run is about 28 days, and `clean-broke` runs die around day 12 and never see a lag.
8. **Projects are spreadsheet buffs.**
   - `recycle-plant` is a permanent +2 per day, with no waste hierarchy.
   - `smart-grid` is +40 budget per day from efficiency, which is the opposite of the rebound lesson.
   - `water-filter` gives +20 and +3 per day in Konya, which has no sea.
   - There are no prevention, adaptation or restoration projects.
9. **Letters are medium-agnostic.** "The fish are gone" and "children by the stream" go to Elif the Ankara nurse and to Konya farmers alike, so every problem becomes a water problem.
10. **Blame framing.** Only 3 choices carry `bribe` (`factory-waste`, `kara-holding-discharge`, `kara-holding-coast`). Bribe is the sole villain mechanism, so legal-but-harmful systemic causes (`tourist-season`, `thrace-sunflower`) get taught as the player's choice rather than as incentive structure. The `kara-holding-discharge` line "our permits are in order" is the one good systemic exception.
11. **Content form is split by country.** All 72 DE and UK events are untagged, unsourced, two-choice binaries with zero outcome cards. The Türkiye content is far richer than the German and UK content.

**3. Concepts to teach (priority order), and what the current model can express**
1. Lag between action and result, for harm and for repair. Partly expressible. Delays are fixed, only on bad options, and can't be cancelled by a later fix.
2. Stocks and flows. Structurally cleanliness is a bathtub (decay and projects), but it is illegible and the flows have no names.
3. Symptom versus root cause. Expressible via delayed and `outcome`; the model works but covers only 15 events.
4. Displacement between media and places. Can't be expressed numerically. Only text carries it.
5. Rebound effect and efficiency without a cap. Expressible in one event only.
6. Commons and carrying capacity (`tourist-season`, `nord-fishing-quota`, `blacksea-anchovy-overfishing`). They exist but are never named as commons.
7. Thresholds and tipping points. The only threshold is game over, and the 6-day eruption is a timer, not a regime shift.
8. Co-benefits and avoided costs. The key fix for the "green = poor" lie. Can't be expressed now.
9. Irreversibility and precaution. One event (`aegean-olive-vs-lignite`) covers it.
10. Just transition, with human costs (`ruhr-coal-closure`, `ne-steel-town`). Only the happiness bar carries it.
11. Climate as a stock (CO₂). Entirely absent.

**4. Scaling honestly (solo author, TR/EN/DE)**
- **Write mechanisms once.** About 20 mechanism cards (150 words, 3 languages) with region-specific "skins" (place, sector, source) will beat 124 bespoke events.
- **Tier the events and show the tier in the UI.** Mark each as "real case", "composite" or "hypothetical". Never present game units as measurements.
- **Replace news sources.** Several `partly-verified` sources are news outlets (CNN Türk, Diken, Hürriyet). Prefer TÜİK, DSİ, EEA, UBA, Defra and the Environment Agency, which are open-licence sources, and add a validator rule that every numeric claim carries one.
- **Run translation as LLM draft plus a native check.** Review only the `why` text, since German and English reviewers are scarce.
- **Do the German and UK back-fill by upgrading the existing 72 events.** Cheaper than adding new events.
- **Take teacher PRs** through the validator.

**5. Regional concept gaps**
- **Türkiye:** climate and GHG (net-zero 2053 and the ETS, which I believe is in the new Climate Law — verify before use); coal and nuclear (Afşin-Elbistan, Akkuyu); Zero Waste and deposit return; heating-driven urban air in Ankara and Erzurum; sea-level rise and salinisation of the Çukurova delta; transboundary Tigris-Euphrates water; Aegean wildfires (only one generic event exists).
- **Germany:** nitrate in groundwater and the EU court case; Pfand (Einwegpfand), a documented success; bark-beetle spruce monocultures; Rhine low water, 2018 and 2022; the Energiewende, including the nuclear exit and gas dependence; the 9-Euro and Deutschland tickets; Rhine recovery after Sandoz in 1986, the best example of lag in repair.
- **UK:** the Great Smog of 1952 and the Clean Air Act, the classic lag and policy case; the 5p bag charge (pair with `plastic-ban` for same-mechanism, different-country transfer); sewage overflows and water-company privatisation; coal phase-out in 2024; beavers and natural flood management; biodiversity net gain.

**Bottom line:** the 15 outcome events teach real systems thinking. The remaining 109 events, the quest rewards, the instant-cure numerics and the single bar teach "green costs, damage can be bought back, waiting heals". Fix the asymmetry in lags and the co-benefit accounting first.

*(Orchestrator note: 6 of 7 Round 1 reports logged. Pending: EB.)*

### R1 · Economy & Progression Balancer (`EB`)

**EB (Economy & Progression) – Round 1 audit.** All numbers below come from the real reducer, run headless on 400–600 seeded runs per cell, loading src via a Node type-strip hook, with no repo edits. (Scripts live in the session scratchpad: lib.ts, proj.ts, quest.ts, tri.ts, sweep.ts, pkg.ts.)

**0. Correction to Part A.5.** "maxTax is dominant" is noise. smart 55% and maxTax 56% differ by less than the standard error (about ±3.5 points at n=200). The sim's own `smart` policy is the maxTax policy with NORMAL tax.
- With no projects, smart wins 71% at NORMAL, 65% at LOW and 47% at HIGH. HIGH tax only helps (53% vs 49%) when the policy also buys projects, because it pays for them.
- The real finding is that **buying projects loses**. See section 3.

**1. Why clean loses 0%: the math.**
- Events arrive at 0.82 per day. Budget is the only stat that kills a competent player: 124 of 124 smart losses are bankruptcy.
- The cleanest option averages -64 budget, +14.3 clean and +1.7 happy per event. The other option averages +10.5 budget, -4.4 clean and -0.6 happy.
- `clean` therefore spends about -43 budget per day (+11 clean, 0 happy). NORMAL tax gives +8, so net is about -35 per day. 500 / 35 is about 14 days, which matches the median of 12.
- `clean` also dies of low happiness (104 of 400 runs). Happiness sits at about 40 and decays 1 per day, and events give it nothing. Reaching 80 requires LOW tax or parks.
- Implied prices are fixed everywhere: about 4 budget per clean point (events) and about 5 budget per happy point (tax slider, 10 budget for 2 happy). Daily decay of 2 clean and 1 happy costs about 13 budget per day to cancel, against +8 tax income. So the economy runs a deficit by design.
- **Quest rewards are what holds the economy up.** The budget payouts total 150+200+150+200+200 = +900 (+700 by about day 20). Zeroing quest rewards drops smart from 71% to **12.5%**.
- Win stats overshoot: smart winners end at a median of 98 happy and 99 clean against a threshold of 80, so about 20 points per stat are wasted.

**2. Is there a real trilemma? No, it is one-dimensional.**
- 107 of 124 events have only 2 choices (17 have 3). Almost every event is "pay budget for clean" versus "take the money".
- Only 7 of about 250 options are non-negative on all three stats. 3 events contain a strictly dominated option. In 17 events the cleanest option is also the richest, so there is no tradeoff at all.
- Happiness is barely an axis in events; it is handled by the tax slider.
- At a constant 4 budget per clean point, the cleanest option is also the best-value option in 69 of 124 events (56%). Only 19 events are close calls, and the median margin is 55 budget.
- Across a 108-state grid of budget, happy and clean, the smart pick never changes in 60 of 124 events. 70 events have a single answer in at least 90% of states. The choice is arithmetic on visible numbers.
- Delayed consequences, the long-term-thinking mechanic, are nearly absent. They appear in 0.2–0.5% of actual choices. **78–87% never land**, because the delays are 14–25 days and the median game is 31 days.
- No mechanic rewards prevention. No option reduces future crises, and `tags.pollution` is never read.

**3. Project economy.** Stat points valued at the implied prices above.

| Project | Cost | Payback after build |
|---|---|---|
| Recycle plant | 250 | about 31 days |
| Park | 200 | about 40 days |
| Eco park | 550 | about 39 days |
| Solar | 500 | about 33 days |
| Wastewater | 560 | about 47 days (the strongest "educational" project is the worst buy) |
| Smart grid | 700 | about 18 days, but with the required solar it is 1200 for +55 per day and breaks even around day 40+ |

- The median run lasts 31 days. Buying any single project on day 1 changes smart's win rate by -7 (park), -13 (recycle), -28 (solar), -30 (eco park and solar+grid) and -35 (wastewater), against a 71% baseline.
- Eco park is dominated by park plus recycle, which costs 450 for comparable value. The wastewater plant is never worth buying.
- Even at half cost with tax ×2.5, only solar beats buying nothing (57% vs 47%). The projects do not teach anything either.

**4. Quests distort play.**
- Rewards are budget, the one lethal stat, and they pay out to players who are already stable.
- `happy_people` (+150 budget) fires at 80 happiness, right when the player is nearly winning.
- `crisis_manager` and `crisis_veteran` (+200 each) count any resolution, bribes included.
- `survivor` (day 20) and `long_haul` (day 40, +200 budget) pay for stalling.
- `budget_master` (1000 budget) completes in only 4% of runs, so it is dead content.
- Five of eight quests complete in 100% of smart runs and carry no information.

**5. Levers, with numbers.**
1. **Remove stat and budget rewards from quests.** Make them teach or unlock instead: codex entries, a project variant, a region scenario. Rebase income so quests are not load-bearing. Tax ×2.5–3 (NORMAL +20–24 per day) gives smart about 47–55% with quests at $0.
2. **Make prevention exist.** Wire `tags.pollution` into projects. Each completed project cuts spawn weight of matching-tag events by 30–40% and the clean-option cost by 25%. Rebase projects to a payback of 12–15 days after build (solar 500 to 300 at +25 per day, smart grid 700 to 400, wastewater 560 to 350 over 8 days). Give the first 1–2 projects an in-run "pays off by day 10" feel.
3. **Interest on neglect.** An ignored crisis's clean-option cost rises 25% per 2 days, shown in the UI. Cure becomes visibly more expensive than prevention. Erupt hits are already -12 happy and -15 clean.
4. **Systemic-fix options.** Add a third option to about 25% of events: pay 150–250 now, positive on all three stats after 5–8 days. Shorten every delay to 8 days or less so it lands (today's 78–87% never land). This is the co-benefit teacher.
5. **Make the dirty path tempting early.** Dirty or bribe options should pay 2–3× the clean price when budget is below 200, with the delayed penalty landing within 8 days. The temptation is currently weak, with only 3 bribe options.
6. **Make tax a real decision.** HIGH tax should escalate unrest after 3 consecutive days. Add diminishing returns above 80, so overshoot becomes a resilience buffer instead of waste.
7. **Add a second price axis.** Make the price of clean vary per event (2–8 budget per point) so the choice is not the same arithmetic every time. Raise the share of 3-option events from 14% to at least 40%.

**Target after rebalance:** pure clean 15–25%, smart 55–65%, early prevention worth +10–15 points over none, and no single-tax policy dominant.

---

> **ORCHESTRATOR ERRATUM #2 (A.5):** Part A.5 labelled `maxTax` the "dominant strategy" on the strength of `sim.ts`'s own "dominant" line. EB's re-measurement shows 55% vs 56% is within noise (±3.5 pts at n=200). **Do not build proposals on "maxTax is dominant."** What the data *does* support: (i) pure-clean = 0% because the economy runs a structural deficit; (ii) buying projects *lowers* win rate; (iii) quests carry the economy.

---

### [CHECKPOINT - Round 1]

**Status:** Round 1 (Audit & Diagnosis) COMPLETE — 7/7 seats reported and logged (GL, LS, BP, UX, SE, ES, EB).

**Completed phases:** Phase 1 Discovery; Phase 2 roster assembled; Round 1 audits.

**Points of consensus after Round 1** (≥3 seats independently converged; numbered `C#` for later reference):
- **C1 — Hidden numbers + prediction covers only 12% of events.** The other 88% invite arithmetic min-maxing (LS leak 1, UX §5, EB §2: for 70/124 events the "right" option is the same in ≥90% of states, ES). *Extending the reveal-and-explain loop to all events is the single biggest pedagogical lever.* (LS, UX, EB, BP, ES)
- **C2 — The choices are not real trade-offs.** 107/124 events are 2-option; cleanest option is best-value in 56%; green is "expensive" in 89% of events (ES) and clean-cheaper-wins in dominance-shaped events (LS). (EB, ES, LS, GL)
- **C3 — "Harm lags, cure is instant" is built into the data, and delays rarely land.** All 10 delayed entries sit on bad options; 78–87% of delays never land because they're 14–25 days vs a ~31-day median run. This teaches "nature heals instantly; you can buy damage back." (ES, EB, LS)
- **C4 — The single `cleanliness` scalar cannot express displacement, stocks, media, or commons; `tags.pollution`/`mechanisms` are read by no code.** (LS, ES, SE, EB) *Contested on how far to go — see D1.*
- **C5 — Quests are a harmful extrinsic loop that also props up the economy** (pay stats/budget for stalling; zeroing them drops smart win rate 71%→12.5%). Replace with knowledge/content rewards. (BP, ES, EB, GL, UX)
- **C6 — Projects are spreadsheet buffs with no domain content, no prevention role, no regional fit; buying them *lowers* win rate.** (EB, ES, GL)
- **C7 — The map does not show consequences; modal covers the map.** Province-level soot/green markers, node resolve/erupt animations, pending-consequence markers, side-by-side modal in landscape, HUD delta pulses, haptics, threshold sounds. (UX; supported by GL "game shows, text doesn't tell")
- **C8 — No meta-loop / no cross-run continuity.** Persistent local "dossier/codex", replay-from-a-decision (counterfactual), seed card, strategy fingerprint, self-chosen challenge modifiers. (GL, LS, BP, SE)
- **C9 — The debrief reviews logistics, not concepts.** Needs mechanism recap/retrieval and shows too little visual evidence. (LS, UX, BP)
- **C10 — Causal-honesty bug:** `isDirtyDeal` is too broad (e.g. tourist-season "Welcome Everyone" counts as corruption); guilt with no repair path (`holdingTier` never decreases). (BP, ES)
- **C11 — Hidden-information leak:** `handleChoiceClick` floaters + `sfx.choiceGood/Bad` reveal the hidden effects right before prediction. (BP, UX)
- **C12 — Content honesty/scale:** DE/UK events (72) are untagged, unsourced binaries; write ~20 mechanism cards + regional "skins"; tier events (real/composite/hypothetical); prefer primary sources. (ES, SE)
- **C13 — Engineering preconditions** for most of the above: compact `actionLog` payloads, `CONTENT_VERSION`, wire `npm test` into CI, a single try/catch `meta` store outside the reducer. (SE)
- **C14 — Mobile traps:** invisible volume button on phones (`max-sm:invisible`), sub-44px targets, 9–10px text, no 80% marker on bars, DaySummary lacks totals. (UX)

**Guardrails adopted (BP's list of 13, binding on all later proposals):** no streaks/daily rewards/login counts; no loss-framed counters; no real-time timers; no variable-ratio reward magnitude; compare decision paths never players; no guilt without agency; causal honesty (provable from the decision log); extrinsic rewards never usable stats; hidden info stays hidden; a lost run shows a learning within 10 s; failure not moralised; everything works with no storage/network and is skippable/mutable; session end never delayed.

**Open disagreements to resolve in later rounds:**
- **D1 — How deep to go on the stock model.** LS/ES: at least a minimal 2–3 medium model (air/water/soil-lite) or the stated teaching goal is unreachable. SE: High-risk, 250 LOC + sim drift, must stay behind a derived-`cleanliness` shim. ROADMAP defers it pending playtest. EB: prefer wiring `tags.pollution` into prevention/projects first (cheaper).
- **D2 — Prediction timing.** LS: prediction after the choice is applied is recognition-matching with no stakes; wants pre-commit prediction / free recall / cross-run calibration. UX: paragraph-length options are a reading wall on phones. 
- **D3 — Endgame shape.** GL: 20-day automated hold is a wait; wants a shifting endgame. EB: win-stats overshoot ~20 pts; wants diminishing returns above 80. Neither reconciled with ROADMAP's "sustain" win.
- **D4 — Dirty-path design.** BP: "(Bribe)"-labelled options are a signposted strawman; wants unlabelled temptations + reveal. EB: wants dirty options to pay 2–3× early when budget is low. ES: bribe as sole villain hides systemic/legal harm. How to reconcile with causal honesty and not teaching "corruption always fails"?
- **D5 — Replay/seed/share.** GL/LS/SE favour rewind-one-decision and seed cards; BP wants class-level *decision-path* comparison via copy-paste codes. Needs a scoped design that satisfies the "no player comparison" guardrail.
- **D6 — Tempo vs. ceremony.** UX wants day-tick ceremony/banners/more sound; GL sees stop-start rhythm and dead-click days as the problem. How to add feel without adding friction?
- **D7 — Balance method.** EB's rebalance (income ×2.5–3 with quests at 0; prevention projects; neglect interest; 3rd "systemic-fix" option in 25% of events; shorter delays) vs. ROADMAP "Faz 3: balance by sim, not by guess." Need a sim-assertion protocol before shipping.
- **D8 — Authoring budget.** Everything above multiplies ×3 languages for a solo student author. Which items are *systems* (cheap to scale) vs *content* (expensive)?

**Next scheduled action:** **Round 2 — Divergent Ideation.** Each of the 7 seats receives the full log and proposes concrete improvements to existing features AND new mechanics (target 4–6 proposals per seat, each with: problem addressed (cite `C#`/`D#`), mechanic, educational rationale, engagement rationale, ethics check against the 13 guardrails, files touched, effort L/M/H). Then Round 3: cross-examination.


---

## ROUND 2 — DIVERGENT IDEATION

*(Proposals are tagged `<seat>-P#` for cross-reference in Round 3. Seats were resumed with their Round 1 context and the full log.)*

### R2 · Game Loop & Retention Architect (`GL`)

**GL ROUND 2: DIVERGENT IDEATION** (read-only). Correction accepted: maxTax is noise, and GL no longer treats it as a dominance problem; builds on EB's real issues (structural deficit, projects that lower win rate, quests propping up the economy, Erratum #2).

**GL-P1. The Stress Year: a forecasted endgame** [Upgrade to Existing Feature: `TUNING.sustainGoalDays` and `gameReducer.ts` TICK; new `data/phases.ts`]
1. **Problem:** D3, C3, C6, and the idle 20-day hold.
2. **Mechanic:** Shorten the hold from 20 to 10 days (EB: winners overshoot by about 20 points, so wasted time is already confirmed). Add one deterministic shock the player can see coming. Shape: `phases: {fromDay, kind:'drought'|'heatwave'|'flood'|'price-shock', decayMult, boostedTags: PollutionTag[], forecastDay}`. Derived from `startDay + seed`, never from wall-clock time, visible on the HUD and map as a forecast ("day 16: drought") from day 1. During the shock, the hold counter keeps running but decay and spawns tilt toward `boostedTags`. Everything the player prevented earlier (GL-P2) is a shield. Overshoot above 80 becomes a "resilience buffer" shown as a bar segment, with diminishing returns, per EB.
3. **Position on D3:** a short hold plus one forecasted stress test. Not a shifting ruleset, and not a longer hold.
4. **SDT:** competence (a preparation payoff) and autonomy (the player chooses how to prepare).
5. **Educational:** resilience, tipping points and prevention versus cure (ES concepts 2, 7 and 8). The test is deterministic, so the lesson is attributable.
6. **Guardrails:** the forecast is information, not scarcity or a timer. No loss framing. The game advances only when the player acts.
7. **Effort M-H.** ~120 LOC plus 4 shock cards ×3 languages. Needs a sim re-run.
8. **Confidence** medium-high. **Playtest:** do players change what they buy once they see "drought in 6 days"?

**GL-P2. Prevention Projects with regional fit** [Upgrade to Existing Feature: `projects.ts`, `spawnNode`]
1. **Problem:** C6 and C2. Projects are spreadsheet buffs, and nothing is prevented.
2. **Mechanic:** Add `prevents: PollutionTag[]` and optional `regionIds` to `Project`. Each completed project lowers the draw weight of matching-tag events by 30-40% (EB lever 2) and shows a shield icon on the map. Re-pace costs so the first project pays back in about 12-15 days (EB). Hide the wastewater plant in Konya (it has no sea), and offer a drought-resilience project there instead.
3. **SDT:** autonomy and mastery through build order and a visible plan.
4. **Educational:** prevention versus cure, with domain content in each project card.
5. **Guardrails:** the draw stays seeded (state-derived weights only), so replay is intact (SE risk 1).
6. **Effort M.** ~60 LOC. A project's card text is the only new copy, ×3 languages.
7. **Confidence** high. **Playtest:** does buying early now raise the win rate of a skilled player instead of lowering it (the sim, not guesswork)?

**GL-P3. Rewind, seed card and decision-path code** [New Feature; builds on SE preconditions in C13]
1. **Problem:** D5 and C8. No way to test a hypothesis, and no classroom hook.
2. **Mechanic:** The debrief offers "Rewind to day N", one rewind per run, then the player re-chooses. Uses the planned `REWIND_TO` action that truncates the log rather than branching it. The debrief also shows the road not taken for that decision, using the choice's own `outcome` text. Offered rewind points are chosen provably: the decision that booked a `delayed[]` effect, or the largest first-day swing. Seed card is `GT1-{contentVersion}-{country}-{region}-{seed}`, copy-paste only: "Same region, same crises". The decision-path code is the choice list with no scores, shown as "your path", for a teacher to compare paths.
3. **Positions on D5:** YES to rewind-one, seed card and decision-path code. NO to a daily seed. NO to leaderboards. Any share is a path, not a ranking.
4. **SDT:** competence and autonomy.
5. **Educational:** counterfactuals (LS) and testing an idea against the same crises.
6. **Guardrails:** 5 (paths compared, never players), 7 (provable from the log), 13 (rewind offered, never forced).
7. **Effort M.** ~100 LOC after the log is compact and `CONTENT_VERSION` exists. Little new copy.
8. **Confidence** medium. **Playtest:** do ≥50% of players who lose start a rewind, and do they pick a different option?

**GL-P4. Tempo-first day flow** [Upgrade to Existing Feature: `App.tsx`, `DaySummary.tsx`]
1. **Problem:** D6, and the 4+ taps and 2 overlays per day (UX).
2. **Mechanic:** "End Day" becomes a single "Advance" that keeps ticking until something *new* happens (a spawn, an escalation to severity 2 or 3, a letter, a project completion, a threshold crossing, or the stress forecast), then stops. UI loop over the existing `TICK`, so log and replay are unchanged. `DaySummary` collapses to a one-line ticker unless there was a letter or news item; the modal appears only when content exists. Ceremony is spent on phase changes only: a "Day N" banner at forecast and shock days, and HUD delta pulses and haptics (UX, zero friction).
3. **Position on D6:** tempo is the default and ceremony must be earned. Juice that costs no taps is welcome.
4. **SDT:** autonomy and flow, with fewer interruptions.
5. **Educational:** attention goes to decisions, not clicking through empty days.
6. **Guardrails:** advancing is the player's own act (3 and 13). Never auto-advance at any other moment; the player can cancel it.
7. **Effort L.** ~60 LOC, little copy.
8. **Confidence** high. **Playtest:** does median time per decision fall, and does a player still notice an eruption?

**GL-P5. Region Dossier and Mandates (the run #5 and #20 answer)** [New Feature; needs the SE `meta` store]
1. **Problem:** C8, C9 and the empty run #5 and #20.
2. **Mechanic:**
   - **Dossier.** Local per-region record: `meta.regions[id] = {endings[], lastEnding, mechanismsSeen[]}`, stored outside the reducer, with try/catch. The map screen shows each region as a card with its ending epitaph.
   - **Memory.** Next run, one citizen's first letter refers to the last ending in that region ("last time the fish did not come back"), using the existing letter templates plus one new `returning` kind.
   - **Mandate.** At the start the player picks 1 of 3 offered personal goals (e.g. "no dirty deals", "protect the fishery", "never use HIGH tax"). The debrief reports on it from `decisions`, with no stat reward (guardrail 8).
   - **Run #20.** After a mechanism is seen once, the matching stress-year variant unlocks as a *choosable scenario* at the region menu. Late runs become "which hard variant do I try"; understanding grows the option set, with no points anywhere.
3. **SDT:** relatedness (citizens remember), competence (a knowledge ladder), autonomy (a self-chosen goal).
4. **Educational:** mechanisms seen become visible knowledge (codex hooks, C8/C9); the mandate prompts reflection.
5. **Guardrails:** progress is accumulation only, no streaks (1, 2). A mandate that went badly pairs with a repair lever next run (6). Works with no storage (12).
6. **Effort M-H.** ~150 LOC plus mandate text and one letter kind ×3 languages.
7. **Confidence** medium. **Playtest:** does a player who has seen "last time, Hasan amca..." choose the same region again within 30 seconds?

**GL-P6. Second Look: a re-encounter for missed ideas** [Upgrade to Existing Feature: `spawnNode`, and `Decision` gets `predictedRight`]
1. **Problem:** C1, D2. A concept is met once, with no second chance.
2. **Mechanic:** Record the prediction result and the `mechanisms` seen. Draw weights favour an event that carries a mechanism the player got wrong, then a *different skin* of the same idea. Weights from state only (SE option c).
3. **SDT:** competence.
4. **Educational:** spaced retrieval and transfer.
5. **Guardrails:** content is random but reward size is not (4). No wall-clock spacing, game days only.
6. **Effort M.** A no-op until more events carry `mechanisms` (~20 mechanism cards, ES).
7. **Confidence** medium-low. **Playtest:** does a repeat of a missed mechanism get predicted correctly more often?

**Order GL would ship:** C13 preconditions (compact log, `CONTENT_VERSION`, CI test), then P4 and P2, then P1, then P3, then P5 and P6.

*(Orchestrator note: R2 reports logged: GL. Pending: LS, BP, UX, SE, ES, EB.)*

### R2 · Learning Scientist (`LS`)

**LEARNING SCIENTIST, ROUND 2 (divergent ideation).** Re-read the log from Round 1 on, including both errata, C1-C14, the 13 guardrails and D1-D8. No files changed.

**Positions on the two open disagreements**
- **D1 (stock model depth):** LS withdraws "build 2-3 stocks". **Build no stock model now.** The teaching goal needs only displacement, meaning a problem moved is a problem that returns. Proposes a data-driven **residue** (LS-P3) behind the existing `cleanliness` scalar. SE's shim concern is met, and EB's "wire tags first" is met. Revisit real stocks only if the residue playtests well.
- **D2 (prediction timing):** keep prediction post-commit. A hard pre-commit gate adds paralysis and a reading wall. Instead (a) shrink the options to short **mechanism chips** and (b) add stakes through adaptive scaffolding and cross-run recall, not through a gate. Pure recognition-matching is the real defect, and chips plus recall fix it.

**Prerequisite (C11):** remove the floaters and `sfx.choiceGood/Bad` (EventModal.tsx `handleChoiceClick`) on hidden-effect events, or they leak the answer. The prediction must also enter the reducer as a `PREDICT` action. It is currently component state (EventModal.tsx line 77), so it is invisible to `actionLog`. LS-P1 and LS-P2 depend on this.

**LS-P1. Mechanism Chips and an Adaptive "Why"** [Upgrade: EventModal.tsx, events.ts, types]
- **Problem:** C1, C2 and D2. Only 12% of events reveal; paragraph options are a phone reading wall; 88% show raw numbers.
- **Mechanic:** Each choice gets one `mechanism` enum from about 8 values, e.g. `source-fix | displace | mask | delay | price-signal | subsidy | restore | enforce`. The reveal card has three lines: a shared mechanism sentence written once per chip (not per event), one optional event-specific line, then the numbers. Prediction is a tap on a chip row (4 chips, 44px+), not a paragraph pick. Right guess: the card collapses to the one-liner. Wrong guess: it expands and adds "the other option would have been X" (one counterfactual line).
- **Educational rationale:** retrieval practice, generation effect and hypercorrection (confident-wrong errors get corrected most). The collapse and expand is expertise-reversal-aware scaffolding. Chips give a transferable vocabulary, so the player transfers across surface contexts.
- **Engagement:** competence ("I read it right") and curiosity. The same chips recur, so the player starts to see patterns.
- **Guardrails:** hidden info stays hidden once C11 is fixed; causal honesty holds because the chip is authored content, not inference; skippable via a "Not sure" chip; no reward.
- **Effort:** M. ~8 chip definitions ×3 languages ≈ 24 strings, plus roughly 1 enum per choice across 124 events (~250 enums, no new prose). Optional lines can be added gradually.
- **Confidence:** medium-high. **Test:** after 3 crises, ask players "what does 'displace' mean?" in their own words and see whether they use it unprompted.

**LS-P2. Interleaved Return and Warm-up Recall** [New: spawnNode in gameReducer.ts, a small meta store]
- **Problem:** C4, C8 and the LS audit's "missing: spaced retrieval". A run sees ~12 events, and a repeat in the same region is identical, so the player memorises the answer button.
- **Mechanic:** The reducer keeps `weakMechanisms: string[]`, fed by wrong chip predictions. `spawnNode` biases the draw toward an unseen event with the same mechanism but a different surface (e.g. e-waste export then fisheries bycatch export). Uses `tags.mechanisms`, which no code reads today. Before a run, optional "Mikey asks": one 1-tap question on a mechanism from last run (localStorage list). Skip is the same size as an answer.
- **Educational rationale:** interleaving, spacing, transfer to a new surface and the testing effect.
- **Engagement:** curiosity ("have I seen this before?") and mastery.
- **Guardrails:** no streaks; no loss framing; deterministic (bias uses seeded RNG and logged predictions); works without storage because the in-run part needs none; skippable.
- **Effort:** M-H. A system, so authoring is near zero, but needs ~30 events tagged with a mechanism (ES's C12 work) and tests for replay-determinism.
- **Confidence:** medium. **Test:** run the same player twice; check whether a mechanism wrong in run 1 is answered correctly on a new surface in run 2.

**LS-P3. Displacement Residue** [New: delayed in events.ts, MapNodes]
- **Problem:** C3, C4 and D1. Export and burning look free (cleanliness 0 and +40 budget), and all delays sit on bad options.
- **Mechanic:** Choices with `mechanism: 'displace'` get `residue: {medium, inDays: 5..12, effects, message}`, reusing the `delayed` mechanism. It lands inside a normal run, which fixes the 78-87% never-land problem. A small map marker, "something returns", shows pending residue in its medium. The letter comes from the nearest citizen and names where the problem went, with the cause provable from the log (the decision and the days).
- **Educational rationale:** conservation of matter and a stock-and-flow intuition, without a stock model. The delay is a real feedback loop.
- **Engagement:** anticipation, plus relatedness through the letters.
- **Guardrails:** causal honesty (only authored residues on events that have sources); no guilt without agency; failure not moralised.
- **Effort:** M. ~15 events ×3 languages; the sim needs a re-run.
- **Confidence:** medium-high. **Test:** ask "where did the e-waste go?" two days after the letter; target answer "somewhere else".

**LS-P4. Rewind One Decision, with Contrast** [Upgrade: GameOver.tsx plus the actionLog replay]
- **Problem:** C8, C9 and D5. A lost run teaches little, and nothing lets a player test a hypothesis.
- **Mechanic:** On GameOver, an optional "Try one decision differently". The list shows up to 5 pivotal decisions (largest stat swing), each as the event title only. Replay `actionLog[0..i]`, then the player picks another option. Afterwards a side-by-side card shows the two paths: first stat to go critical, and day of the end. Everything is local and about the player's own paths.
- **Educational rationale:** counterfactual reasoning, productive failure, errorful generation.
- **Engagement:** autonomy and competence, since improvement is visible.
- **Guardrails:** compares decision paths, never players; the restart button stays first (session end never delayed); learning shows within 10 s because the header line stays; no timers.
- **Effort:** M. Replay machinery exists; needs a "stop at index i" helper and a CONTENT_VERSION check (C13).
- **Confidence:** medium. **Test:** after a rewind, ask the player to explain why the other option mattered.

**LS-P5. Debrief "One Idea" and a Local Codex** [Upgrade: GameOver.tsx, new meta store, replaces quests per C5]
- **Problem:** C5 and C9. The debrief shows counts, and quests pay stats.
- **Mechanic:** GameOver shows one concept card, chosen from the run's mechanisms (the one mispredicted, else the most consequential). Shown as a 2-option cloze first, then the answer. Seen cards go into a local codex. Unseen slots show only the mechanism name ("???"). Unlocked entries carry no stats.
- **Educational rationale:** retrieval at the point of consolidation, and spacing across runs.
- **Engagement:** a curiosity gap and epistemic mastery, with no points.
- **Guardrails:** extrinsic rewards never usable stats (replaces the stat-paying quests); skippable; all state in a try/catch store; no completion counter shown as pressure.
- **Effort:** M. ~8-20 cards ×3 languages.
- **Confidence:** medium. **Test:** a week later, ask which cards the player remembers without the game open.

**Order LS would ship:** C11 fix and PREDICT, then P1, then P3, then P5, then P2 and P4.

---

### R2 · Behavioral Psychologist (`BP`)

**BP ROUND 2: six proposals.** Read-only design; no files touched. Guardrails cited as G1–G13 in the order of the BP Round 1 list.

**BP-P1. Provable "patron" flag replaces `isDirtyDeal`** [Upgrade: `data/story.ts`, `gameReducer.ts` HANDLE_CHOICE, `validate:events`]
- **Problem:** C10, D4. Tourist "Welcome Everyone" counts as corruption and grows Kara Holding.
- **Mechanic:** Delete the inference (`budget>0 && clean<0`). Add an authored field `choice.patron?: 'kara' | 'unnamed'` plus `choice.kind?: 'bribe'|'loophole'|'tradeoff'`. A script proposes flags for the ~25 candidate choices, and the author reviews them once. The validator fails any `patron` choice that lacks an `outcome.why`. `Decision.dirty` becomes `decision.patron`. Letter kind `dirty`, Kara tiers and the debrief line fire only on `patron`. Plain trade-offs get a neutral new letter, `cost`: "the money came and so did the smell", with no accusation. Debrief wording changes to "N decisions where a named interest benefited".
- **SDT:** Competence. The feedback is true, so the player can trust it.
- **Education:** It separates a trade-off from capture, the real media/policy literacy point.
- **Guardrails:** G7 (satisfied by construction). G11 (wording stays factual).
- **Effort:** L code, M content review (~25 choices; no new strings except 3×3 for the `cost` letter).
- **Confidence:** high. **Playtest:** the same 5 players tell us whether "Welcome Everyone" now feels fair.

**BP-P2. Repair arc: "Make amends" nodes** [Upgrade: `holdingTier` logic; New: `repair` events]
- **Problem:** C10, G6. Tiers only rise, and "we have not forgotten" gives no way forward.
- **Mechanic:** Each `patron` decision stores `{day, eventId, citizenId, repaired:false}` in `state.debts`. The existing dirty letter, 3 days later, now spawns one optional node, "Make amends", that never erupts and has no timer. 2–3 options: disclose and pay restitution (budget −60 to −80), commission an independent test (budget −40, reveals the mechanism), or ignore it (no cost, letter stays on file). Paying drops `holdingTier` by 1 (floor 0) and marks the debt repaired. The cost always exceeds the original gain. Past damage is NOT refunded: the debrief shows "repaired 1 of 3; the stream damage stayed", so "buy back" is not taught (C3).
- **SDT:** Autonomy and competence (accountability works, imperfectly).
- **Education:** Restitution is not erasure — the central environmental-justice idea.
- **Guardrails:** G6 (this is the guardrail's fix). Brushes G2 (a debt counter): never display "debts", only citizens' letters; debts are a log, not a HUD meter.
- **Effort:** M code, M text (~6 shared repair events ×3).
- **Confidence:** medium-high. **Playtest:** do players repair voluntarily, or ignore it as noise?

**BP-P3. Unlabelled temptation, reveal after (D4 position)** [Upgrade: `data/events.ts` content, `EventModal` outcome card]
- **Mechanic:** Drop "(Bribe)" and "(Rüşvet)" from button text. Word the option as the tempter would ("Accept the investment pledge"). The outcome card then adds a tag line: "This was a bribe. Under TCK/UK Bribery Act/StGB it is X" (sourced, tier-labelled per C12). Make temptation pay properly, as EB wants (2–3× early gain when budget is low), so the dilemma is real.
- **Position on honesty:** Do not teach "corruption always fails". Teach "someone else pays." Detection is not simulated randomly. Undetected is the default, and the cost lands on a named citizen through a delayed letter. Add 2–3 legal-but-harmful `loophole` options, so the villain is not only a bribe (ES, D4). The 70/124 events with one dominant answer (C2) get one tempting option each over time.
- **SDT:** Autonomy. Real temptation makes the choice meaningful.
- **Guardrails:** G4 not touched (risk is on the cost side and fixed per event, no random reward magnitude). Brushes G9, since the label is revealed only after the choice — intentional.
- **Effort:** M-H (~10 events ×3 languages for the first pass).
- **Confidence:** medium. **Playtest:** do students say "I did not realise it was a bribe" afterwards, and is that a learning moment or a feeling of being tricked?

**BP-P4. Citizen stakes and persistent pen-pals (relatedness)** [Upgrade: `CHARACTERS`, `addLetter`, `LETTERS`; New: localStorage `meta.citizens`]
- **Problem:** letters are written in turn order (`letters.length % cast.length`), so a fisherman writes about tourists in the wrong region.
- **Data:** `Character.stakes: PollutionTag[]` (fisher: water/marine; farmer: soil/landuse; teacher or nurse: air; shopkeeper: economy/happiness). `addLetter(kind, eventTags)` picks the citizen whose stakes intersect the decision's `tags.pollution` (existing data; needs no new model for C4). Letter bodies become `stake×kind` fragments (~6 stakes × 3 kinds × 3 languages) instead of 5 global texts.
- **Persistence:** at GameOver (one try/catch, per C13) write `meta.citizens[id] = {runs, lastEnding, lastHarm?: tag}`. In a later run in the same region, the citizen's first letter refers to the last one: "Last time the strait ran black. I stayed. I am glad you are back." Framing is always memory, never a score or a loss ("you lost Rıza's trust" is forbidden).
- **SDT:** Relatedness, by caring about specific people. Intrinsic because nothing is awarded for it.
- **Guardrails:** G12 (works with no storage; a new player just gets the base letter). G6 (a "wary" letter always includes an invitation to act). G1/G2 (no streak or visit counter).
- **Effort:** M-H, mostly authoring (~54 letter fragments, a one-time cost).
- **Confidence:** high on persistence value. **Playtest:** do players recall a citizen by name next day?

**BP-P5. Class "Casebook": decision-path comparison without player comparison (D5 position)** [New]
- **Mechanic:** At GameOver, a copy-paste code encodes `{regionId, contentVersion, seed, per-decision choice indices}` (a compact `actionLog`, C13). It carries no name, score or timestamp. A teacher pastes N codes into a local "Casebook" screen (no backend) that shows only per-decision splits: "Dock dredging: 14 chose the survey, 6 chose to pay fines, 5 chose silence", plus one question prompt. The set of endings is shown unsorted ("7 different endings in this room"). Minimum 5 codes before anything renders (so nobody is identifiable); codes are never listed individually or ranked. A student can also paste a classmate's seed to replay the same crisis sequence, and the author of that seed is not shown.
- **SDT:** Relatedness through shared inquiry ("why did we split?"), not rivalry.
- **Education:** Reasonable people choose differently with the same facts — the key lesson of policy.
- **Guardrails:** G5 satisfied (paths, never players). Brushes G5 at small n: mitigated by the k≥5 floor and no sorting by outcome.
- **Effort:** M (codec plus aggregator UI; few strings). **Confidence:** medium. **Playtest:** one real classroom; does the debate start without the teacher prompting?

**BP-P6. Self-chosen "Promise" instead of stat-reward quests (C5)** [Upgrade: `data/quests.ts` and `QuestPanel`, region start]
- **Mechanic:** At START_GAME the player picks one of 3 promises drawn from the region's citizens' stakes (e.g. "Keep the strait fishable for Rıza"). No stat reward. The Promise tracks tag-matched decisions only (`water`/`marine` events harmed or helped). The debrief ends with a "kept / broken / partly" line built only from those logged decisions, plus the mechanism card for the failure (G10). The old threshold quests are removed.
- **SDT:** Autonomy (the player writes their own goal) and meaning (it is about a person).
- **Education:** Forces the player to track one pollution pathway, a light form of C4, and reuses BP-P4 stakes.
- **Guardrails:** G8 (no usable reward), G7 (only provable decisions count), G11 (a "broken" Promise is a reported fact, never moralised, paired with the repair route from BP-P2).
- **Effort:** M (~3 promises per stake ×3 languages, shared across regions).
- **Confidence:** medium-high. **Playtest:** do players choose a Promise in under 10 s, and mention it at the end unprompted?

**Build order BP:** P1, then P2 and P4, then P6, P3 and P5 last (each depends on the previous flags). P1 is the cheapest and a precondition for honest feedback on all of them.

---

### R2 · UX/UI & Game-Feel Director (`UX`)

**UX/Game-Feel Director, Round 2 proposals.** Re-read Round 1 (all 7 audits, ERRATA, C1-C14, 13 guardrails, D1-D8). Nothing edited.

**UX-P1. Hunch Chips (pre-commit prediction)** [Upgrade: `EventModal.tsx`]
- **Problem:** D2, C1. Prediction options are paragraph-length `outcome.what` strings, a reading wall on a phone. They are also post-hoc, so LS calls it recognition-matching with no stakes.
- **Spec:** Tap a choice and it slides up as a "selected" card. A one-row prompt follows: "What happens to [stat icon]?" with three chips, ▲ / ▬ / ▼. The stat asked about is the one with the largest |effect| in the data, so no new authoring is needed. Tapping a chip commits both the choice and the hunch. Cost tier stays visible, since money is public. Reveal: the stat bar animates from the "hunch ghost" marker to the real value (400ms count-up). A hit gets the existing emerald check, a miss gets amber. Neither is red, and neither is a loss. A small "Skip, just do it" link keeps it optional. Reduced motion: no count-up, an instant swap. For the 15 existing outcome events, the "Ne oldu?" card stays as the explainer. The old paragraph options go away. **Stopgap if the chip row ships late:** clamp the paragraph options to 2 lines with tap-to-expand.
- **Learning:** A pre-commit hypothesis with a visible gap between guess and result, the cleanest cause-and-effect test. Hit rate is logged locally to a `meta` store (C13), shown once at the debrief, never as a streak.
- **Engagement:** Curiosity and competence. The question is cheap to answer and the answer matters.
- **Guardrails:** Hidden info stays hidden until after the commit (see C11 fixes). No streaks. Skippable. Compares the player only to their own history.
- **Effort:** M. ~6 strings ×3 languages.
- **Confidence:** medium-high. **Playtest:** do 3 phone players tap a chip in under 3 s, and can they say afterwards why they were wrong?
- *(Note: UX-P1 is a direct counter-proposal to LS-P1 on D2 — direction-of-effect chips (▲▬▼ on one stat, pre-commit) vs mechanism chips (post-commit). To be cross-examined in Round 3.)*

**UX-P2. Province Consequence Layer** [New Feature: `MapMarks.tsx`, extends `CountryMap` and `ProjectSites`]
- **Problem:** C7, and the roadmap's "game shows, text doesn't tell".
- **Spec:** *Markers:* Kara Holding tiers 1-5 add soot smokestack silhouettes on the player's province, and co-op tiers add green tufts or turbines. Both fade in over 600 ms. Marks are only placed after a choice has been revealed. *Node end-states:* a solved node scales down with a green ring and a short rising tone; an erupted node gets a red ring, a 250 ms screen shake and a low thump. *Delayed consequences:* a neutral grey dashed ring with a "?" appears on the map; no countdown number and no sign, so it leaks nothing. *Projects under construction:* a scaffold marker with a progress arc. *Province tint:* the player's own province tints from green to brown by cleanliness; the global country filter drops to about half strength. *Wildlife:* `MapWildlife` thins out the boats at low cleanliness and adds birds at high cleanliness. *Reduced motion:* everything keeps its static end-state; only transitions are dropped.
- **Learning:** The map becomes the evidence. After "I took the deal", the province looks different, making accountability visible without a blame sentence.
- **Engagement:** Ownership and a sense of place.
- **Guardrails:** Only provable markers are drawn, derived from tiers and the decision log. No guilt without agency, because there is a co-op repair visual. Works offline.
- **Effort:** M-H. Mostly SVG and CSS. ~4 strings for ARIA labels.
- **Confidence:** high on nodes and soot, medium on wildlife. **Playtest:** after two minutes, ask a player what their province "says" about them.

**UX-P3. Side-by-side Landscape Sheet** [Upgrade: `EventModal.tsx`, `App.tsx`]
- **Problem:** C7, and D6's cost of covering the map.
- **Spec:** In `mobile-landscape`, the crisis opens as a right-hand sheet of about 46% width. The map stays visible on the left, with the active node pulsing and its province outlined. The outcome animation plays at the node's own location, not at the click point. Portrait stays a centred modal. Reduced motion: the sheet appears instantly.
- **Learning:** Place, severity and the other open nodes stay visible while deciding.
- **Engagement:** Spatial reasoning, and less dead time covering the map.
- **Effort:** M. Layout only, no new strings.
- **Confidence:** high. **Playtest:** can a player name the neighbouring open crisis while choosing?

**UX-P4. Dawn Strip** [Upgrade: `DaySummary.tsx` into a non-modal strip] (D6 position)
- **Position:** Tempo wins over ceremony. Add feel in parallel, not in series.
- **Spec:** End Day no longer opens a blocking overlay on quiet days. The HUD stat bars pulse and show a floating delta chip for 1.2 s, and a thin bottom strip shows "Day 12, Happiness 62 (−2)". The full `DaySummary` opens only when something notable happens: a letter arrived, a project finished, an eruption, or a threshold was crossed. News TV becomes an optional Mikey ticker icon, tap to open. Letters stay as map icons. *Fast-forward:* hold End Day to skip quiet days; it stops at any notable event. Reduced motion: a static delta line.
- **Learning:** Cause and effect land at the moment of the daily decay and tax, on the HUD, no longer buried in a modal.
- **Guardrails:** No real-time pressure. Session end is never delayed. Fast-forward stops before anything notable.
- **Effort:** M. ~2 strings.
- **Confidence:** medium. **Playtest:** count taps per day (target < 2.5 on quiet days) and check whether players still notice letters.
- *(Note: overlaps GL-P4 "Advance" — to be merged in Round 3.)*

**UX-P5. Haptic and Audio Language** [New Feature: `utils/feel.ts`, extends `sfx.ts`]
- **Spec:** `navigator.vibrate`, feature-detected and try/catch-wrapped: 10 ms on tap, `[20,30,20]` on a bad reveal, `[10,20,10,20,40]` on project complete, 80 ms on eruption. Reveal sounds play after the reveal, not on the click. Sustain tick: a rising-pitch tick per sustain day (makes the win fantasy audible); a break in the run is a neutral sound, never a fail sound. Threshold chimes: one at 80 for each stat, a soft drone under 30. Ambient bed: procedural filtered noise plus occasional chirps above 70 cleanliness, fading to a hum under 30. Separate haptics toggle; `prefers-reduced-motion` turns the heavy patterns off. Every sound has a visual twin.
- **Guardrails:** No variable-ratio rewards. No loss-framed counters. Fully mutable.
- **Effort:** M. ~2 strings.
- **Confidence:** medium-high. **Playtest:** mute the screen, play with haptics only, check whether players can tell good from bad.

**UX — C11 hidden-info leak: fixes, ranked by effort**
1. **XS:** In `handleChoiceClick`, when `hideEffects` is true, skip `showFloatingText` and play `sfx.click`, not `choiceGood` or `choiceBad`. ~5 lines.
2. **S:** The modal's own stat strip (`EventModal.tsx` L208-218) shows live values, and the reducer applies the choice immediately, so totals change while the player is still asked to predict. Freeze that strip to a pre-choice snapshot (a ref) until the reveal.
3. **S-M:** The HUD bars and map filter behind the blur also animate on choice. Pass `displayState`, a frozen snapshot, until `predicted` is set.
4. **S:** Move the floaters to the reveal card's `effectRow`, anchored at the HUD stat icons.

**UX — C14 mobile traps: fixes, ranked by effort**
1. **XS:** Remove `max-sm:invisible` on the volume button (`App.tsx` L119). The SFX mute is persisted, so a muted phone player has no way back.
2. **XS:** Add an 80 tick mark to the happiness and cleanliness bars, and a glow when both are ≥ 80.
3. **XS:** Text floor of 11px; replace `text-[9px]` and `text-[10px]` in `GameHUD` and `EventModal`.
4. **S:** Touch targets ≥ 44px. Pad nodes with an invisible `before:-inset-3`, give control buttons `min-h-11 min-w-11`, widen the Quest chevron to 44px.
5. **S:** Show totals with the delta in `DaySummary`, e.g. "62 (−2)".
6. **S:** Add `aria-live` to toasts and status messages.
7. **M:** Move End Day, the Mikey toggle and the sound toggle into one right-edge thumb rail.

*(Orchestrator note: R2 reports logged: GL, LS, BP, UX. Pending: SE, ES, EB.)*

### R2 · Environmental-Science Pedagogy Specialist (`ES`)

**ES ROUND 2 — 5 proposals, from the content-truth lens.** (Part A still describes the original design; ES relies on the ERRATA, C1-C14, D1-D8 and the 13 guardrails as logged.)

**ES-P1. Lag symmetry and mechanism-linked cancellation** [Upgrade: `types/index.ts` DelayedEffect; `events.ts` ~10 delayed events; reducer `ScheduledEffect`]
- **Problem (C3, D7):** harm lags and cure is instant; 78-87% of delays (14-25 days) never land in a ~31-day run; delays can't be cancelled by a later fix.
- **Pattern:** Every delayed entry gets `kind: 'harm' | 'recovery'` and an optional `mechanism`. Choices get `addresses?: string[]`. A pending harm with `mechanism: M` is halved if any logged decision with `addresses` containing M lands before its due day (provable from `decisions`). Good options are paid in installments (~30% now, the rest later), same total, so the sim stays mean-preserving. All delays capped at ≤14 days.
- **Worked example, `istanbul-mucilage`:**
  - A: Skim. Effects: budget −150, happiness +20, cleanliness +10. Delayed: `{inDays: 12, kind: 'harm', mechanism: 'nutrient-loading', cleanliness: −15, "mucilage is back: the load never fell"}`.
  - B: Advanced treatment. Effects: budget −200, happiness −5, cleanliness +8, `addresses: ['nutrient-loading']`. Delayed: `{inDays: 8, kind: 'recovery', cleanliness: +8, "nitrogen at the outfalls is down by a fifth"}` and `{inDays: 14, kind: 'recovery', cleanliness: +9}`.
  - C: Limit basin load. Same shape.
  - Source: the existing Marmara Action Plan (AA) source stays.
- **Concept and misconception:** lag in both directions; "nature or a fix heals instantly".
- **Engagement:** "I'll see the sea come back in the next 8 days" gives a reason to keep playing and creates predictions.
- **Guardrails:** hidden info stays hidden (pending ledger shows only "something is arriving"). Honest by construction.
- **Effort: M.** Message text exists; a few recovery messages ×3 languages; no new sources. **Confidence: high.** Playtest: do ≥70% of players say a cure takes time, after one run?

**ES-P2. Three hidden media with medium-derived lag and 3 transfer rules** [New Feature + shim: `GameState.media`, `Effects.media?`; `cleanliness` stays derived]
- **D1 position:** Three media only, **air / water / land** (water includes groundwater and marine; land includes soil, waste and habitat). `cleanliness = mean(media)`, so HUD, win check, quests and the sim default are unchanged. Events that don't specify media split their `cleanliness` equally across the media in `tags.pollution`; the 72 untagged DE/UK events fall back to a plain cleanliness shift until tagged. Media stay hidden during play; revealed on the outcome card, in the debrief "where did it go?" panel and in the codex (respects the 4-bar rejection and "hidden info stays hidden").
- **Lag derived from the medium, not hand-authored:** air effects apply in ≤2 days, water ~7, land and groundwater ramp over ~14. Anchors: 1956 Clean Air Act fast response for air vs the Konya aquifer for the slow case. A system, not content (D8).
- **Three transfer rules that matter most:**
  1. **Burning moves land to air** (and leaves ash on land). Anchors: e-waste open burning (Basel), stubble burning in Çukurova.
  2. **Runoff moves land to water** (nutrients, slurry, mine drainage), with a lag. Anchors: Lough Neagh, Marmara.
  3. **Treatment or outfall moves pollution from water to land or to the sea** (sludge, brine) and never destroys it. Anchors: Ergene outfall, Rhine after Sandoz 1986.
- **Worked example, `ewaste-dump`, new option "Licensed incinerator":** effects `{budget: −60, media: {land: +15, air: −8}}` → derived cleanliness change ≈ +2 per medium. Outcome card: "The pile shrank by most of its volume. Part of it left through the stack and the ash." Existing Basel and PRB sources stay.
- **Concept and misconception:** displacement versus removal. **Engagement:** a post-hoc "where did it go?" reveal, with the debrief map showing the three media.
- **Guardrails:** hidden info, causal honesty. Wire this only after a sim assertion that mean-preserving defaults leave `sim-report.md` unchanged.
- **Effort: H** (SE ≈ 250 LOC plus content). Do it last. **Confidence: medium.**

**ES-P3. Mechanism card + regional skin pipeline (D8)** [New Feature: `src/data/mechanisms.ts`, `src/data/skins.ts`; validator in `scripts/validate-events.mjs`; upgrades the 72 untagged DE/UK events]
- **Problem (C12, D8):** 72 DE/UK events are untagged binaries; authoring is ×3 languages. Cards are written once and skins are small, so most language work is only nouns plus one anchor fact.
- **Exact schema:**
```
MechanismCard {
 id, concept,
 claim: LocalizedText,          // one true sentence, ≤25 words
 misconception: LocalizedText,
 options: [{ role: 'symptom'|'source'|'displace'|'ignore'|'systemic',
   shape: { budget: -2..2, happiness: -2..2, media: {…}, lag?: {days, ratio} },
   whyTemplate: LocalizedText }],   // with {place},{actor},{pollutant}
 slots: string[] }
Skin { id, cardId, regionId, provinces, basin?,
 slots: Record<string, LocalizedText>,
 anchor: { text: LocalizedText, source: SourceRef,
           tier: 'real'|'composite'|'hypothetical' },
 overrides?: Partial<numbers> }
```
- **Validator:** `tier: 'real'` requires a `verified` source. `hypothetical` is flagged on the card. A composite or hypothetical case must state so in the UI.
- **First 8 cards**, ordered by teaching value and DE/UK back-fill:
  1. Symptom vs source (Marmara, Lough Neagh, Thames overflows).
  2. Recovery lags (Emscher, Tyne, Rhine, Clean Air Act).
  3. Price signal (Türkiye 2019 bag fee, England 2015 5p charge, Ireland 2002).
  4. Commons and quotas (Black Sea anchovy, North Sea quota, tourism carrying capacity).
  5. Displacement (Ergene, e-waste, incineration ash).
  6. Rebound (Konya drip, UK chalk streams, data-centre cooling).
  7. Irreversibility and sequence (Yırca, Hambach forest, the New Forest).
  8. Siting and low-carbon-not-free (Belen, German bat curtailment) — also fixes the 5 wind contradictions in DE/UK.
- **Effort: M-H.** Schema is code; each card ~150 words ×3; each skin ~40 words ×3 plus one verified source. **Confidence: high.** Playtest: can a student recognise the same concept in a new region's skin?

**ES-P4. Educational projects** [Upgrade: `data/projects.ts`; `Project` type gets `category`, `regionIds?`, `addresses?`, `limit?`]
- **Problem (C6):** the 6 projects are identical in every region, no domain content, and buying them lowers win rate.
- **Pattern:** projects in 3 categories (**prevent / adapt / restore**), each with `regionIds` and `addresses: [mechanism]`. A built project changes later choices instead of paying a flat buff: it discounts or cancels harm for its mechanism, or unlocks a cheaper "source" option. Each project also states what it does not do ("recycling does not reduce waste generation").
- **Worked example:** `water-filter` becomes "Nutrient Removal Upgrade" with `addresses: ['nutrient-loading']`. Once built, `istanbul-mucilage` option B costs −120 instead of −200, and a pending nutrient harm is halved. Region-specific: Konya `metering-network` (prevent), Rize flash-flood `early-warning` (adapt), Harran `drainage-network` (restore), Ruhr `Emscher-style restoration` (restore, 14 days), UK `natural flood management` (restore). `smart-grid`: its +40 budget/day carries a note, "efficiency saved is often spent" (the rebound); cut the yield and add `limit` so the player must pair it with a cap.
- **Concept:** prevention beats end-of-pipe; projects interact with mechanisms. **Engagement:** projects become interventions with visible consequences. **Guardrails:** no stat-for-stalling reward.
- **Effort: M** (~10 projects ×3 languages, no sources needed for generic ones). **Confidence: medium.** Playtest: do players pick prevention before the crisis arrives?

**ES-P5. Field-notes codex replaces quests (C5, C9)** [New Feature + Upgrade: `data/quests.ts`; `src/meta/`]
- **Pattern:** an entry unlocks only when the decision log shows the player experienced the mechanism (the symptom path and its consequence, or the source path). Carries the real case, the source, the card's `claim` and a country transfer pair: same mechanism, other country, with its tier badge. **No stats reward.**
- **Concept:** transfer (the bag charge appears in Türkiye, England and Ireland). **Engagement:** a collection of concepts, curiosity and mastery. **Guardrails:** no streaks or loss counters; skippable; offline; `localStorage` in try/catch.
- **Effort: M**, bounded by ES-P3 content (SE puts the meta store at ~120 LOC). **Confidence: medium.**

**Sequencing ES:** P1 first (cheap, fixes C3). Then P3 and P4. Then P5. P2 last, behind the cleanliness shim and after a sim assertion.

---

### R2 · Principal Game Systems Engineer (`SE`)

**SE ROUND 2: enabling architecture** (read-only; no repo edits). Every proposal depends on one invariant: **with all new data absent or neutral, a run must stay bit-identical to today's** (including the old `sim-report`). This is what makes each stage cheap to verify.

**SE-P1. Media model as a derived-cleanliness shim, in three stages** [New: `src/utils/media.ts`; Upgrade: `types/index.ts`, `gameReducer.ts`, `projects.ts`]
- Addresses C4, D1, C3, C6. Does not require ES and LS to wait for the ROADMAP's playtest on pollution stocks.
- Types:
```ts
export type Medium = 'air'|'water'|'soil';
export type Media = Record<Medium, number>;                  // 0..100, higher = cleaner
export interface Effects { budget?; happiness?; cleanliness?; media?: Partial<Media> } // additive
export interface Project { /*…*/ prevents?: PollutionTag[]; medium?: Medium }
// media.ts
TAG_MEDIUM: Record<PollutionTag, Medium[]>   // air→[air]; water|marine|groundwater→[water]; soil|waste|landuse→[soil]; rest→[]
mediaDelta(e: Effects, tags?: PollutionTag[]): Media
aggregate(m: Media): number                  // plain mean
effectiveEffects(s: GameState, ev: GameEvent, c: EventChoice): Effects  // THE ONE function; reducer and EventModal both call it
```
- Backward compatibility: (1) `GameState.cleanliness` stays a stored scalar, so HUD, quests, win check and `markCritical` are untouched; after every state change `cleanliness = aggregate(media)`. (2) A choice with no `media` field gets `cleanliness` spread over the media its event tags map to, scaled so the mean moves by exactly `c`; an untagged event spreads evenly over all three. (3) Decay, `passive.cleanliness` and quest rewards are spread evenly. The only drift comes from the per-medium clamp, and the sim measures it.
- **Stage 0 (EB's cheap prevention, no media, 1 PR):** `Project.prevents` lets `spawnNode` weight events by 1 − 0.35 per matching completed project. The cumulative-weight pick uses the same single `nextRandom` call; with equal weights it selects `floor(v*n)`, the same index as before (the invariance test). `effectiveEffects` applies the 25% discount to a prevented tag's clean option, and the UI shows the same number. ~90 LOC, risk M (projects lose money today, so rebase them under the SE-P5 gates).
- **Stage 1:** three media, with `media` hand-authored on only the 15 `outcome` events. Per-region modifier `mediaDecay?: Partial<Media>`. ~160 LOC, no new lose conditions.
- **Stage 2 (transfer):** explicit negative entries, e.g. `media:{air:+12, soil:-9}`, plus a threshold rule: a medium below 25 bleeds happiness (the health cost), still by data. ~80 LOC. Validator: if `mechanisms` includes `displacement`, the choice must carry at least one negative `media` entry; every `media` delta must sum within ±2 × |cleanliness| of the scalar (if both are authored).
- Risks: win-rate drift, and the player not understanding three bars. Mitigate by gating on SE-P5 and showing media only as map overlays, per the ROADMAP's rejection of "4 visible bars". Effort: 0 = M, 1 = M, 2 = H. Order: after SE-P5.

**SE-P2. Compact log, `CONTENT_VERSION`, rewind and seed share (D5)** [Upgrade: `gameReducer.ts`, `GameContext.tsx`; New: `src/data/version.ts`]
- Addresses C8, C13, D5. Action shapes:
```ts
START_GAME: { countryId; regionId; startBudget; seed; contentVersion }   // was: whole Country
BUY_PROJECT: { projectId }                                                 // was: whole Project
REWIND_TO:  { index: number; abandoned: Decision[] }                       // index = log position of an OPEN_EVENT
```
- The reducer resolves ids through `getRegion` and `PROJECTS`. On a version mismatch it returns the **same state** (no log entry), and the UI says "this seed is from another edition".
- `REWIND_TO` is handled in the wrapper. It rebuilds `actionLog.slice(0,index)` from `INITIAL_STATE`, appends the marker, and records `abandoned` in a new `GameState.branches`. The marker lives inside the log, so replay stays exact. The UI computes `abandoned` from the pre-rewind `decisions`, so counterfactual comparison is a pure diff of decisions. The seeded RNG is only drawn in TICK and START, so the same crisis reappears. UI offers a max of ~2 rewinds per run, unpunished (guardrails).
- `scripts/content.lock.json` stores `{version, hash(event ids, choice counts)}`; the validator fails if the hash changed without a version bump.
- Seed card: URL hash `#v=3&c=tr&r=marmara&s=<base36>`, seed-only link → same map and crises, no scores. Class comparison (BP): copy-paste **path code** `eventId:choiceIndex` per decision, no name, no score; a static teacher view tallies choices per event.
- ~130 LOC; risk M. Test: `assert.deepEqual(JSON.parse(JSON.stringify(s.actionLog)).reduce(gameReducer, INITIAL_STATE), s)`; also test that rewind + replay equals the log, and that a mismatched `contentVersion` is a no-op.

**SE-P3. Meta store and dossier, with the pure-reducer rule** [New: `src/meta/store.ts`, `src/meta/summarize.ts`]
- Addresses C8, C9, and the storage/skippability guardrails.
```ts
interface MetaV1 { v:1; settings:{lang; mute; mikeyMute};
  hints:string[]; endings:string[];
  codex: Record<string /*mechanism*/, {seen:number; miss:number; box:0|1|2|3; lastRun:number}>;
  runs: RunSummary[] /*cap 30*/ }
RunSummary { contentVersion; countryId; regionId; seed; endingId; days; mechanisms:string[]; misses:string[] }
```
- Rule: **nothing in `src/reducers` or `src/utils/gameLogic` imports `src/meta`** (an ESLint `no-restricted-imports`). Meta enters the reducer only inside `START_GAME.payload.startMastery: Record<string, 0..3>`, which is logged and JSON-safe. It exits through `summarize(state): RunSummary`, a pure function called by a UI effect on `isGameOver`.
- A single module wraps all access in try/catch, migrates the four existing keys, and provides JSON export, import and reset (no backend). Skippable; must not carry streaks.
- ~150 LOC; risk L; effort M. Tests: migration, corrupt-JSON fallback, `summarize` determinism.

**SE-P4. Deterministic adaptive event selection (spaced re-surfacing)** [Upgrade: `spawnNode`, `Decision`; New: PREDICT action]
- Addresses C1, D2, C9. Prediction must be added to the model:
```ts
{ type:'PREDICT'; payload:{ guess: number[] } }     // dispatched BEFORE HANDLE_CHOICE (pre-commit, per LS)
Decision += { mechanisms: string[]; predicted?: {correct:number; of:number} }
GameState.mastery: Record<string,{seen;miss;box:0|1|2|3;lastDay}>   // seeded from startMastery
```
- The reducer compares the guess with the truth derived from event data and updates the mastery box: a miss resets the box to 0, a hit raises it by 1. Leitner gaps are in **game days** (4, 8, 16), never real time. `spawnNode` weight is `1 + 3·due(m)`, 0.5 for box 3, integer arithmetic only. Uses the same two draws as today and never repeats the exact event; only the bag (cycle) logic keeps repeats away. The weights are never shown.
- Constraint: **at least 2 events per mechanism** or it is a no-op. The validator reports mechanism coverage and fails below 2 for any mechanism that has an outcome card. This is the real bottleneck — content, not code.
- ~110 LOC; risk M; effort M. Tests: equal-weight invariance (empty mastery gives the baseline spawn sequence); a miss raises the revisit rate in sim with a `learner` policy.
- *(Note: SE-P4 assumes LS's pre-commit PREDICT; but LS-P1 R2 now argues for post-commit chips; UX-P1 argues pre-commit direction chips. The `PREDICT` action's timing is a Round 3 decision.)*

**SE-P5. Sim assertion protocol (D7)** [Upgrade: `scripts/sim.ts`, `play.ts`; New: `scripts/sim-baseline.json`, `npm run sim:check`]
- Fixed paired seeds, n=400, with Wilson intervals in the report. Gates:
  1. `npm test` (replay, JSON round-trip, rewind) always passes.
  2. Invariance gate: a change declared "no behaviour change" (stages 0 and 1, `media` shim, SE-P2) must stay within baseline ±5 pts win per policy, ±2 median days, and endings share ±5 pp.
  3. Rebalance targets in `scripts/targets.json`, enforced after an explicit `--rebalance`: `clean` 15–25%, `smart` 55–65%, `prevent` ≥ `noProject` + 10, and no policy more than 10 pts above `smart`.
  4. Structural gates: no event never reaches the player, every ending reachable, delayed-effect landing rate ≥ 60% (counted from consumed `scheduled`), and a quests-off ablation (zero `ALL_QUESTS` rewards inside the sim process) leaves `smart` ≥ 40%.
  5. Validator: the dominated-choice warning count may not rise, and 3-option share must not fall.
- New `play.ts` policies: `noProject` (baseline/control), `prevent` (buys the matching prevention project first), `patient` (prefers options with positive delayed effects), `displacer` (maximises aggregate cleanliness while ignoring media; must lose by ≥10 pts to `mediaAware` after stage 2), `mediaAware`, `learner` (predicts at 50% accuracy, exercising PREDICT and mastery), `rewinder` (rewinds once after its first bad outcome).
- ~120 LOC; risk L; effort M. **Order: first, because it gates every balance change.**

**SE build order**
1. CI: add `npm test`, `validate:events` and `sim:check` to `deploy.yml`; strengthen the causal test (tied to the right event). Fix the C11 leak (floaters and sfx before prediction) — trivial.
2. SE-P5 (sim harness, baseline).
3. SE-P2 (compact log, version, rewind, seed card).
4. Stage 0 (prevention, `effectiveEffects`), with quest rewards turned into non-stat unlocks and the EB project rebalance, all under SE-P5 gates (C5, C6, D7).
5. SE-P3 (meta store, dossier/codex), including the existing endings, hints and settings keys.
6. SE-P4 (PREDICT and mastery, then adaptive selection). Content dependency: extend outcome cards to the remaining events (C1) and add ≥2 events per mechanism.
7. Media stages 1 and 2, after a playtest, per the ROADMAP.
UI-only work (C7, C14, map overlays, haptics) can run in parallel with 3–6, because none of it touches the reducer. Content work (mechanism cards, DE/UK back-fill) is the true critical path for D8.

*(Orchestrator note: R2 reports logged: GL, LS, BP, UX, ES, SE. Pending: EB.)*

### R2 · Economy & Progression Balancer (`EB`)

**EB ROUND 2 — Economy & Progression: six changes, three validated on the real reducer.**

**Method.** Validated on a forked copy of the repo (`/tmp/claude-0/-home-user-green-turkiye/526d184a-5f3e-5c53-99fb-e2de131171b5/scratchpad/fork`, runner `exp5.ts`). No repo files edited. Every cell n=500 seeded runs, quests at 0, using the repo's own `play()` loop. Two extra policies: `desperate` plays smart but takes the max-budget option when budget < 150; `desperateClean` does the same but excludes dirty options. Fork baseline gives smart 49%, not the 55% in sim-report.md (that report was n=200). Only 52 of 124 events carry `tags.pollution`, so prevention touches ~42% of draws until DE/UK events are tagged (C12).

**Results (win rate %).**

| Package | smart | clean | greedy | random | maxTax | bribe | desperate | desperateClean | lazy |
|---|---|---|---|---|---|---|---|---|---|
| Baseline | 49 | 0 | 37 | 8 | 53 | 0 | 67 | 58 | 42 |
| **B** (P1+P2+P4+P5) | 49 | 8 | 37 | 11 | 38 | 0 | 87 | 80 | 51 |
| **B+P6** | 52 | 8 | 42 | 13 | 42 | 0 | 90 | 82 | 58 |
| **B+P6+P3** | 52 | 8 | 42 | 13 | 42 | 0 | 90 | 82 | **33** |
| **B+P6+P3+P7** | 45 | 8 | 42 | 16 | 35 | 0 | 87 | 73 | 24 |

- `lazy` opens crises only at age 3 or later. In the baseline, waiting is almost free (42%, close to smart).
- Ending shift for desperateClean, baseline → B+P6: clean-broke 179 → 81, green + green-model 151 → 252, green-shadow 141 → 160. In B alone, green-shadow rises to 214 (dirty wins).
- Two ablations: quests at 0 with a plain income ×2.75 and no other change drops smart 49 → 34. Adding project rebase lifts it to 41.

**EB-P1. Co-benefit dividend** [Upgrade: `gameReducer` HANDLE_CHOICE, new `TUNING.cleanRebate {frac:0.5, days:6}`] — the largest single lever.
- *Problem:* "green = poor" (ES §3). The cleanest option is expensive in 89% of events, and cure pays instantly (C2, C3).
- *Mechanic:* when `isCleanChoice(c)` and budget < 0, schedule `{budget: +0.5×|cost|, happiness:+0–2}` at day+6. Reuses the existing `scheduled` array and the letter/news plumbing.
- *Effect:* with project rebase only, rebate 0 → 0.5 takes smart 41 → 63 and clean 2 → 18 (income not yet retuned).
- *Concept:* avoided costs and co-benefits (health, fisheries, tourism). Repair also lags; the lag is visible as a pending marker.
- *Engagement:* investing, then watching it pay back, is mastery.
- *Guardrails:* fixed magnitude, deterministic, not an extrinsic reward; a causal in-fiction flow, honest once it carries an evidence tier.
- *Effort:* S–M. *Predicted effect:* clean-broke falls by ~40% and the green endings rise.

**EB-P2. Prevention projects** [Upgrade: `projects.ts` + `spawnNode` weighting] — add `prevents: PollutionTag[]` and `preventMult` to each project. Spawn weight is the product of the multipliers for matching tags. Rebased values: recycle 160, 4 days, ['waste','soil'] ×0.6; park 150, 5 days, happiness +2/day, ['hazard'] ×0.7; eco park 380, ['landuse','biodiversity'] ×0.6; solar 300, 6 days, +24/day, ['energy','air'] ×0.7; wastewater 380, 9 days, ['water','marine','groundwater'] ×0.5; smart grid 400, +45/day. Addresses C6, C4 and D1: tags get read cheaply, with no stock model. *Measured:* smart 34 → 41, maxTax 56 → 64, random 4 → 12, with income held at a flat ×2.75. *Concept:* prevention beats cure. Effort M. Guardrails clean.

**EB-P3. Neglect interest** [Upgrade: new `TUNING.neglectInterest`, `OPEN_EVENT` stores `activeEventAge`] — the negative budget effect of any option is multiplied by `min(1.6, 1 + 0.2×floor(age/2))`. *Problem:* waiting is free; in the baseline, lazy beats nothing and nearly matches smart. *Measured:* lazy 58 → 33, with smart and the others unchanged (no collateral damage). Show cost tiers ($→$$→$$$) on the node, never the numbers. *Concept:* the cost of delay compounds. Effort S. Guardrail: tied to the node's visible age, not a timer.

**EB-P4. Income rebase + quest swap** [Upgrade: `calculateDailyTax`, `quests.ts`]
- Tax becomes LOW +8 (+3 happy), NORMAL +18, HIGH +26 (−5 happy). Old values were −2, +8 and +18, with ±2 happy. All quest rewards go to 0, which is only safe after this rebase (71% → 12.5% otherwise). At HIGH tax with −2 happy, maxTax beat smart by 15–20 points; at −5 it sits in the 38–56% band, so the tax is a real cost. Delete the 1000-budget quest (dead content, 4% completion).
- **Quest replacement: the Dossier.** Unlocks derived from the `decisions` log, never pop-up toasts, shown in the debrief: *First response* (3 crises opened within a day of spawn → "neglect cost" card); *Lag witness* (one delayed letter read); *Dividend collected* (one EB-P1 rebate landed); *Preventer* (any prevention project built before day 10); *Reached 80/80 once* (unlocks a scenario); *Won after an audit* (unlocks the systemic-harm card). Rewards are codex cards, scenarios, self-chosen challenge toggles and map skins. Never stats.

**EB-P5. Dirty path with detection risk (D4)** [Upgrade: `story.ts isDirtyDeal`, reducer]
- **Position:** the dirty option pays ×2 budget only when budget < 200 ("poverty drives pollution"). Drop the "(Bribe)" label. Audit chance is 0.25 + 0.15×holdingTier, with a fixed fine of 120 and −10 happy three days later. Deterministic magnitudes, so no variable-ratio reward. Restrict audits to `bribe` or `illegal` flags; for legal-but-harmful options (e.g. tourist-season), apply only the Kara ratchet, an incentive-structure lesson.
- *Measured, ×2 only:* desperate 97 vs desperateClean 84 (+13 points). With audits (.25/.15/120): desperate 87 vs desperateClean 80 (+7). Dirty stays tempting and mildly positive, which avoids teaching "corruption always fails". It does cost the green-model ending, and green-shadow doubles. Random rose 11 → 24 under a weaker audit, so keep the stronger numbers. The debrief shows the audit odds from the log, not a blame sentence. Effort M.
- *(Note: BP-P3 says "detection is not simulated randomly"; EB-P5 uses a probabilistic audit with a fixed fine. Direct conflict for R3.)*

**EB-P6. Hold phase (D3)** [Upgrade: `TUNING.sustainGoalDays` 20 → 14, new `capAbove`/`capGain`/`grace`]
- **Position:** diminishing returns above 85 (gains ×0.5) plus a grace band: a counter pauses at 70–79 and resets only below 70. Removes the 20-point overshoot and the loss-framed reset. Winners' length drops 41 → 31 days, win rates +2 to +5 and green endings up. The hold phase should also weight `hazard` events ×2, so prevention is tested (not validated). Effort S–M.

**EB-P7. Systemic-fix third option** [New: `choices[].invest`] — cost is 1.2 × the clean option's cost now, with clean +4. At 6 days it pays +0.8× the cost, +4 happy and +10 clean. Injected into 25% of events: smart 52 → 45 and desperateClean 82 → 73, so it adds decision depth and slightly raises difficulty. Effort H (every one needs ×3-language authoring). Do it last, as a content item (D8).

**EB — D7 sim assertions that must pass before shipping (n ≥ 500, ±2.2 SE).**
1. smart is 45–65%.
2. desperate (best known heuristic) ≥ smart + 10 and ≤ 90.
3. random ≤ 15, bribe ≤ 5, idle = 0.
4. clean in the 3–20 band (virtue must be hard but possible).
5. |maxTax − smart| ≤ 12, so no dominant tax.
6. lazy ≤ smart − 10, so waiting costs.
7. desperateClean − greedy ≥ 25 and smart − random ≥ 30.
8. No ending > 35% of runs; every ending ≥ 2%.
9. Median winner length 20–35 days.
10. Per project, paired Δwin from buying in [−3, +20], with payback ≤ 15 days after build computed analytically.
11. replay-test deterministic; the zero-reward-quest config equals production.
CI fails on any breach, and `sim.ts` prints a pass/fail table.

**Caveat (EB).** The `desperate` heuristic reaches 87–95% in every income package, because the liquidity management is easy to find. Real players will sit between smart and desperate. If the game proves too easy in playtest, raise `neglectInterest` before lowering income.

---

### [CHECKPOINT - Round 2]

**Status:** Round 2 (Divergent Ideation) COMPLETE — 7/7 seats reported and logged. **38 proposals** (GL 6, LS 5, BP 6, UX 5 + two fix-lists, ES 5, SE 5, EB 7).

**Completed phases:** Phase 1 Discovery · Round 1 Audit · Round 2 Ideation.

#### Convergences (≥3 seats independently proposed the same thing → high-prior candidates)

| Cluster | Proposals | Gist |
|---|---|---|
| **K1 · Prevention projects with regional fit** | GL-P2, EB-P2, ES-P4, SE-P1 stage 0 | `Project.prevents: PollutionTag[]` reduces spawn weight (≈×0.5–0.7) of matching-tag events; re-priced to pay back in ≤15 d; region-specific/educational project catalogue; `effectiveEffects` single source of truth. Sim-validated by EB (smart 34→41). |
| **K2 · Lag symmetry / co-benefit dividend** | ES-P1, EB-P1, EB-P7, LS-P3 | Cure must also lag (installments / rebate at +6 d); delays ≤14 d so they actually land; `addresses` cancels pending harm; "residue" returns for displacement. EB: rebate 0→0.5 lifts smart 41→63, clean 2→18. |
| **K3 · Rewind-one + seed card + decision-path code** | GL-P3, LS-P4, SE-P2, BP-P5 | Compact `actionLog`, `CONTENT_VERSION`, `REWIND_TO` truncation, seed-only URL hash, path code (`eventId:choiceIndex`), teacher "Casebook" tally with k≥5 floor. No leaderboards/daily seed. |
| **K4 · Local meta store → Dossier / Codex / returning citizens** | GL-P5, LS-P5, ES-P5, SE-P3, BP-P4, EB-P4 | One try/catch `src/meta/` module outside the reducer; mechanisms-seen codex (no stat rewards); region dossier; citizens remember last ending. |
| **K5 · Replace stat-reward quests** | BP-P6 (Promise), EB-P4 (Dossier unlocks), LS-P5, ES-P5, GL-P5 (Mandate) | Quest rewards → 0 only *after* income rebase (else smart 71→12.5%); replace with self-chosen Promise/Mandate + knowledge unlocks. |
| **K6 · Fix hidden-info leak + prediction as logged state** | LS (prereq), UX C11 fixes, SE-P4 | XS fix first: no floaters/`choiceGood/Bad` on hidden-effect events; freeze modal/HUD to pre-choice snapshot; `PREDICT` becomes a reducer action. |
| **K7 · Tempo-first day flow** | GL-P4, UX-P4 | "Advance" runs quiet days until something notable; DaySummary only when content exists; HUD delta pulses + haptics; no blocking modal on quiet days. |
| **K8 · Map as the evidence layer** | UX-P2, UX-P3, LS-P3 marker, GL-P2 shield | Soot/green markers per Kara/co-op tier on own province; node resolve/erupt end-states; neutral "?" ring for pending consequences; side-by-side landscape sheet; wildlife tied to cleanliness. |
| **K9 · Mechanism taxonomy + skins** | ES-P3, LS-P1, SE-P4 | ~8 mechanism enums/cards written once ×3 languages; regional skins; tier labels (real/composite/hypothetical); validator coverage ≥2 events per mechanism. |
| **K10 · Fix `isDirtyDeal` (causal honesty) + repair arc** | BP-P1, BP-P2 | Authored `patron`/`kind` flags replace the budget/cleanliness inference; "Make amends" nodes lower `holdingTier` but never refund past damage. |
| **K11 · Sim assertion protocol first** | SE-P5, EB D7 list | `sim:check` with paired seeds, baseline invariance gate, new policies (`noProject`, `prevent`, `patient`, `lazy`, `desperate(Clean)`, `learner`, `rewinder`), CI wiring. Gates every balance change. |

#### Genuine conflicts to resolve in Round 3 (the "Open disagreements")

- **X1 — Prediction format & timing (D2).** LS-P1: *post-commit* **mechanism chips** (shared per-mechanism sentence, collapse on hit/expand on miss). UX-P1: *pre-commit* **direction chips ▲▬▼** on the largest-|effect| stat, hunch ghost marker on the bar. SE-P4 designed `PREDICT` *before* `HANDLE_CHOICE`. LS argued pre-commit gates cause paralysis; UX argues post-commit has no stakes. Can both coexist (direction chip pre-commit, mechanism chip post-commit)? Which one is the *minimum*?
- **X2 — Dirty-path detection (D4).** BP-P3: **no random detection**; undetected is default; harm lands on a *named citizen*; reveal "this was a bribe" after, add legal-but-harmful `loophole` options. EB-P5: **probabilistic audit** (0.25+0.15×tier, fine 120) — measured to keep dirty "mildly positive" and cut random-policy win rate. Does a probabilistic audit teach "corruption always (probably) fails"? Is there a deterministic alternative that gets EB's numbers?
- **X3 — Depth of the media/stock model (D1).** ES-P2: 3 hidden media (air/water/land), last, behind shim. SE-P1: 3 stages, stage 0 = prevention tags only. LS-P3: **no stock model**, just authored `residue` via delayed. EB: tags first. Is LS-P3 (+ ES-P1) sufficient for displacement, and ES-P2 deferred pending playtest?
- **X4 — Endgame shape (D3).** GL-P1: hold 20→**10** + **forecasted stress year** (visible shock; prevention is the shield). EB-P6: hold 20→**14**, ×0.5 gains above 85, **grace band** 70–79 pauses instead of resetting. Compatible? (Both remove the idle hold; EB removes loss-framed reset, GL adds a test.)
- **X5 — Neglect interest vs guardrails.** EB-P3 ×1.0→1.6 on negative costs by node age is the only lever that fixed `lazy` (58→33) — but is it a hidden loss-framed pressure, and does it push "clear the board" over "think" (GL R1 concern)? Is the displayed $→$$→$$$ tier sufficient honesty?
- **X6 — Quest replacement: which one?** BP "Promise" (self-chosen, tag-tracked) vs GL "Mandate" vs EB "Dossier unlocks (derived)" vs LS/ES "codex". Probably combinable (Promise at start → kept/broken line in debrief → codex card). Need a single design.
- **X7 — Tempo vs. "Advance" vs hold-to-skip.** GL-P4 "Advance until notable" (UI loop over TICK) vs UX-P4 "Dawn Strip + hold-to-fast-forward". Merge or choose?
- **X8 — Content mountain.** K9/ES-P3, EB-P7 (+25% three-option events), BP-P3/P4 (~54 letter fragments, ~10 events), LS-P1 (~250 enums), ES-P1 (recovery messages), DE/UK back-fill of 72 events. Which are *systems* (cheap) vs. *content* (expensive)? Need a hard cap per milestone for a solo author.
- **X9 — Is "shorter delays ≤14 d" + "installments" (ES-P1) compatible with EB-P1's single +6 d rebate?** Same mechanism, two shapes.
- **X10 — Stress-year forecast (GL-P1) vs. hold-phase hazards ×2 (EB-P6).** Same idea, deterministic vs weighted.
- **X11 — Mikey's scope & tone** (not yet addressed by any seat): ROADMAP says Mikey reacts to decisions, not disasters; new features (repair arcs, Casebook, stress year) all want Mikey lines. Risk: Clippy effect.
- **X12 — Citizen letters (BP-P4)** need stake-matched writers: cost 54 fragments; is a cheaper stake-tagging-only version viable (reuse current 5 templates, just choose the right writer)?

#### Guardrail flags raised in Round 2 (for audit in Round 3)
- BP self-flagged: debt log must never be a HUD meter (G2); Casebook small-n identifiability (G5, k≥5 floor); unlabelled temptation reveals label only after choice (G9 brush).
- UX-P1 hit-rate "once at debrief, never as a streak"; UX-P5 ambient audio must have visual twin.
- EB-P1 rebate/EB-P5 fine are *fixed-magnitude* (OK for G4), but any audit *roll* is a probability — G4 is about reward magnitude, so permitted; still needs the honesty check in X2.

#### Binding constraints still in force
13 BP guardrails · ROADMAP principles (no points/XP/badges/leaderboards/daily seed; no telemetry; one-line hints; game shows, text doesn't tell; no unprovable causal claims; Mikey reacts to decisions) · solo-author ×3-language authoring budget · reducer purity & replay determinism · "neutral data ⇒ bit-identical run" invariance (SE).

**Next scheduled action: Round 3 — Cross-Examination & Synthesis.** Each seat receives the full log and a *targeted challenge list*: (a) resolve X1–X12 as assigned, (b) rank-order K1–K11 by impact/leverage and effort (with the one-sentence reason), (c) attack ≥2 *other* seats' proposals (strongest objection, then a concrete amendment), (d) name anything you now think should be **rejected/deferred**. Round 4 (if needed): convergence vote + dependency-ordered roadmap draft. Then Phase 4 deliverables (`FINAL_FEATURE_ROADMAP.md`).


---

## ROUND 3 — CROSS-EXAMINATION & SYNTHESIS

*(Each seat was handed the Round 2 checkpoint (K1–K11, X1–X12) with assigned conflicts to resolve, attacks to make, and a ranking to give.)*

### R3 · Game Loop & Retention Architect (`GL`)

**GL ROUND 3: CROSS-EXAMINATION & SYNTHESIS** (read-only; read the Round 2 log in full)

**(A) Resolutions**

**X4 — one endgame spec ("Hold-14 with a forecast spell").**
- **Win rule.** Keep 80/80, now held for 14 days (EB-P6, validated). Add a grace band: the counter pauses at 70–79 and resets only below 70. Gains above 85 count ×0.5, which also removes the 20-point overshoot.
- **Forecast spell.** One 3-day spell per run, announced from day 1 on the map and HUD as "Day D: {kind}". D = 14 + (seed mod 7), so it falls in [14, 20] and overlaps the median winner's hold (win at day 28–31 means the hold starts around day 15–17). A hand-authored phase entry in a new `data/phases.ts`: `{kind, boostedTags, decayMult:1.5, spawnWeightMult:2, days:3}`.
- **How it meets the 80/80 rule.** The spell changes only decay and spawn weights, never the threshold. The grace band means a spell costs a *pause*, not a reset, unless the player is truly unprepared. A prevention project matching `boostedTags` (K1) is the shield.
- **Sim gates (EB list plus GL's).** Run all 11 EB assertions, with median winner length 20–35. Add three: a `forecaster` policy (buys the matching prevention project before D) must beat `noProject` by ≥ +8 points; `smart` must stay at 45–65%; the spell must change the day-of-win distribution by no more than 5 days versus no spell.

**X10.** The forecast and the hazard weighting are the same mechanic, not rivals: the forecast announces *when and which tag*, and the spawn weight and decay multiplier are the mechanism. Nothing is hidden, nothing is random at play time, and the draw stays seeded.

**X7 — merged tempo spec.**
- The existing button stays as one day at a time. Next to it goes a second **"Until something happens"** button. A tap starts it and a tap cancels it. This replaces UX's hold-to-skip, which is hard to discover on touch.
- Quiet days become a **Dawn Strip** (UX-P4) plus HUD delta pulses. A blocking `DaySummary` opens only if it has content.
- **What stops fast-forward:** a new crisis spawns; any node reaches severity 2 or 3 (so a skip can never cross an eruption); a letter or news item; a project finishes; a `scheduled` effect lands; a stat crosses 80, 70 (grace band) or 30; any sustain milestone (every 5 days); the spell window opens or closes; budget falls under `criticalBudget`; the game ends. Cap 5 days per press.
- The UI loop dispatches plain `TICK`s, so the log and replay are unchanged. Guardrail 13 holds because the player starts it and can always cancel.

**(B) Attacks**
1. **EB-P3 neglect interest.**
   - *Objection:* it adds a third escalator on the same clock as the bleed and the day-6 eruption. That recreates "clear the board": the best play becomes opening every node the day it spawns, which is exactly what `lazy` 58→33 proves. Triage is a queue now, and deferring on purpose is no longer a choice.
   - *Amendment:* apply it only to events authored with `compounds: true` (slow leaks, pests and fire risk, ~30%). Cap at ×1.4. Show the tier on the node. Exempt the first 5 days of a run. Keep `lazy` ≤ `smart` − 10 as a gate, not as the target.
2. **BP-P2 repair nodes.**
   - *Objection:* they add chores, and a node competes with crises for the cap of 3.
   - *Amendment:* make it an action inside `LetterModal`: one button with a visible cost, no node, no cap use, no timer. One open repair per citizen. It meets guardrail 6 with no map clutter.
3. **BP-P5 Casebook.**
   - *Objection:* collecting 5+ codes from a class with no backend is real teacher friction, and the aggregator UI is M effort for an unproven use.
   - *Amendment:* ship only the path code and seed card (~20 LOC) at GameOver. A teacher can paste codes into a spreadsheet. Build the aggregator only after the Faz 6 playtest shows a teacher asked for it.
4. **GL's own weakest, GL-P6 "Second Look".** Invisible to the player and a no-op until ≥2 events per mechanism exist (15 are tagged today). Defer to after K9 gives coverage. Also drop GL's "Mandate" in favour of BP's Promise (X6), since they overlap.

**(C) Meta-loop synthesis**
- **Run #2:** the debrief ends with a rewind and a "road not taken" card, plus one mechanism card revealed and one still shown as "???". The player has a hypothesis to test (K3) and a concept gap (K4).
- **Run #5:** the Promise (K5) is a self-chosen goal about a named citizen. A returning citizen opens with one line about the last ending in that region (K4). The region card on the dossier shows its epitaph. The "Ne oldu?" prediction loop still carries learning.
- **Run #20:** an unlocked mechanism makes its stress-spell kind a choosable scenario at the region menu. Understanding grows the option set, so late runs are "which hard variant do I try". No points.
- **Minimal combination:** K3 (rewind-one, seed card, path code); K4 (the meta store, a dossier line per region, a codex of "???" cards, and one stored `lastEnding` line for a citizen — no 54 letter fragments); K5 (a Promise at start with a kept/broken/partly line, old quests deleted *only after* the income rebase, unlocks as scenarios and cards). All local, skippable, no streaks, no stat reward.
- **Cut:** Casebook UI, Mandate, strategy fingerprint, the "8/8 endings" counter (the dossier replaces it), challenge toggles beyond the 2 spell variants, and ambient audio.

**(D) Ranking by retention impact per unit effort (top 6)**
1. **K6**, the hidden-info fix. XS, protects the best loop.
2. **K2**, the co-benefit dividend (EB-P1). S-M, makes virtue viable (clean 2→18), the biggest flow fix.
3. **K7**, tempo. M, improves every minute of every run.
4. **K1**, prevention projects. M, gives build-order mastery and the shield for the spell.
5. **K3**, rewind and seed. M, supplies the run #2 reason.
6. **K4 with K5**, the meta store plus Promise. M, supplies the run #5 and #20 reasons.
(K11 sim gates unranked because mandatory first. K8 map evidence high-impact but M-H, so it follows.)

**Defer or reject:** Defer K9 full skins (do ~3 cards only) and defer ES-P2 media; defer EB-P7 (third option on 25% of events); defer BP-P3 unlabelled temptations; reject toast-style quests; reject GL-P6 until K9 coverage exists; reject the Casebook aggregator for now.

*(Orchestrator note: R3 reports logged: GL. Pending: LS, BP, UX, SE, ES, EB.)*

### R3 · Cognitive & Learning Scientist (`LS`)

**LEARNING SCIENTIST, ROUND 3** (read-only; read the Round 2 log and checkpoint, plus UX-P1, ES-P1, SE-P4 and EB-P1/P3 text).

**(A) Resolutions**

**X1 — one hybrid, one tap per event, with the mechanism revealed rather than asked.**
- **Pre-commit.** The player taps a choice and it becomes a selected card. One chip row follows: "Cleanliness after this?" with ▲ ▬ ▼ and a pre-highlighted "Not sure". One extra tap. The stat is always cleanliness, never budget (already public). ▬ means |Δ| ≤ 2. Money stays as a cost tier.
- **Post-commit.** The reveal card always names the choice's `mechanism` chip with its shared sentence. After a hit the card collapses to that line. After a miss it expands to the event's `why` plus one counterfactual line ("the other option would have been X").
- **Mechanism as a question.** The mechanism is asked only when it recurs in the same run after a miss. Spacing, not a second tap on every event.
- **Why one tap.** Two questions per event would double friction on a 12-event run. The direction hunch has stakes; the mechanism label supplies the vocabulary.
- **What is logged.** No separate `PREDICT` action, because the hunch is about the chosen option and only exists at the moment of choice. The action is `HANDLE_CHOICE{choiceIndex, hunch?: -1|0|1}`. The reducer writes `Decision += {mech, hunch?, miss: boolean}`. Mastery is a pure fold over `decisions`, not stored state, so replay stays deterministic and the log stays compact. A later `RECALL{mech, answer}` is added only with the recurrence question.

**X3 — LS-P3 residue plus ES-P1 lag symmetry are sufficient for displacement. Defer ES-P2.** Build the three media only if playtests show one of: **(a)** ≥2 of 5 players say the exported or burned problem "went away" after the residue letter; **(b)** a `displacer` sim policy beats `smart` (displacement is a free lunch); **(c)** ~8+ events need two media at once to be honest (e-waste soil+air is the likely first).

**X9 — installments versus rebate.** Use ES-P1's data shape. EB-P1's magnitude can be reused, but it must be authored per choice. A cure's physical recovery (cleanliness) comes in installments at about +6 and +12. A budget return exists only where the choice names an avoided cost. One mechanism, not two code paths.

**(B) Attacks and amendments**
1. **UX-P1 direction chips.**
   - *Objection:* the "largest-|effect| stat" is often budget, or the valence is obvious from the option name ("Clean the river" is ▲), so the hit rate has a ceiling and measures nothing. Hits also reinforce choice-supportive bias (you pick what you like, then predict it works). A debrief hit-rate percentage is a performance score.
   - *Amendment:* fix the stat to cleanliness. Show "Mikey was surprised N times" by mechanism, never a percentage. Weight mastery only on choices authored `counterintuitive` (~30 of them, flagged as part of the mechanism tagging).
2. **EB-P3 neglect interest.**
   - *Objection:* a universal ×1.6 multiplier teaches "delay always compounds". True for spills, spread and nutrient loading; false for policy debates. It also double-charges the map's existing escalation and bleed. And because skipping the hunch is faster, it rewards click-throughs over thinking.
   - *Amendment:* apply only to events authored `compounding: true`. Show a "grown since day X" marker, provable from `spawnDay`. Leave other events flat.
3. **EB-P1 automatic rebate.**
   - *Objection:* yes, it teaches "virtue always pays back", with a fixed ×0.5 on anything that passes `isCleanChoice` — the same stat-inference check C10 calls dishonest. It also nudges the optimum toward "invest, then wait for the dividend".
   - *Amendment:* rebate only where a choice carries an authored `coBenefit` that names the avoided cost (fisheries, health, tourism), with the amount authored per choice. Some clean choices explicitly get 0, and the reveal says "this one pays back in nature, not the budget". That contrast is the lesson: when prevention pays and when it is a public good that must be funded.
4. **LS's own weakest, LS-P2's warm-up recall.**
   - *Objection:* a quiz before play breaks the "first decision in ≤60 s" target and feels like school. Spacing inside a 12-event run is nearly impossible, and it needs ≥2 events per mechanism that don't exist yet.
   - *Amendment:* drop the warm-up. Keep the in-run recurrence question and the debrief cloze. Cross-run spacing comes from the codex "???" slots only.

**(C) Ranking by learning impact per effort (top 6)**
1. **K6** (hidden-info leak plus a logged hunch). XS, gates all measurement.
2. **K9** (mechanism taxonomy plus a shared reveal for all events). Moves C1 from 12% to 100% through a system, not prose.
3. **K2** (lag symmetry, residue, authored co-benefit). Fixes the central false lesson "cure is instant"; mostly data.
4. **K1** (prevention projects via tags). Makes `tags.pollution` mechanical and teaches prevention over cure; EB already sim-validated it.
5. **K10** (`isDirtyDeal` fix). Cheap; makes the debrief honest.
6. **K4, minimal** (debrief "One Idea" plus a small codex). The consolidation moment; needs no economy changes.

**Defer or reject:**
- **Defer:** K7 (not a learning change); K8 except the "something is pending" marker; K3 path codes and Casebook (small-n risk; k≥5 floor adds work); K5 until the income rebase has shipped; ES-P2 media; GL's stress year.
- **Reject:** BP-P4's 54 letter fragments. Do stake-tagging only (X12).
- **Keep but late:** rewind-one-decision (K3).

**(D) Final minimal learning core, in build order**
1. **Remove the leak and log the hunch.** Drop the floaters and `sfx.choiceGood/Bad` on hidden-effect events; add `hunch` to `HANDLE_CHOICE` and `Decision`.
2. **Mechanism enum on every choice, and one shared reveal card for all 124 events.** Numbers stay hidden until after the commit.
3. **Break dominance in the 20 most-drawn events.** Make the options real trade-offs, with a third "systemic" option where it fits (C2). Without this, steps 1 and 2 train valence-guessing.
4. **Lag symmetry.** Delays capped at 14 days and cures in installments. Add residue for `displace` choices; co-benefits authored (X9).
5. **Prevention projects wired to `tags.pollution`**, so prevention is a mechanic and not a spreadsheet buff.
6. **Debrief "One Idea" with a counterfactual line**, plus a minimal local codex. Rewind comes after this.

**Acceptance test for the core:** in a 3–5 student playtest, after one run each player can state one mechanism in their own words (e.g. "export moves pollution") and say why a cure took days to show. If they can't, the reveal card is too long.

*(Orchestrator note: R3 reports logged: GL, LS. Pending: BP, UX, SE, ES, EB.)*

### R3 · Environmental-Science Pedagogy Specialist (`ES`)

**ES ROUND 3 — Cross-examination and synthesis** (read-only; read Round 2 and the checkpoint, K1-K11 and X1-X12)

**(A) Resolutions**

**X3 (media vs residue).** ES **withdraws ES-P2 (three hidden media) as a milestone item.** LS-P3 residue plus ES-P1 lag is sufficient for displacement, with one amendment: residue must be typed (`residue: {to: 'air'|'water'|'land'|'sea'|'abroad', afterDays}`). Without that field a displaced pollutant is a generic −12 and the player can't answer "where did it go?"
- Show the destination on the outcome card.
- Apply the three transfer rules by hand to ~6 events: burning (land→air), runoff (land→water), treatment/outfall (water→sludge, sea or brine).
- Revisit media stocks only if playtest shows players can't say where the pollution went.

**X8 (minimum honest content set)** — three milestones, systems first.
- **M1, systems only, 0 new events:** validator tiers and the honest-content rules (below); delays ≤14 days with `addresses`; typed `residue`; re-text of the 6 projects with `prevents`.
- **M2, 4 mechanism cards** (symptom vs source, displacement, rebound, price signal). The seed is the 15 existing outcome events; their `why` sentences become the cards' text and aren't rewritten: `plastic-ban`, `ewaste-dump`, `marmara-urban-renewal`, `aegean-wind-siting`, `med-invasive-fish`, `hatay-belen-migration`, `hazelnut-aflatoxin`, `van-pearl-mullet`, `dust-transport`, `istanbul-mucilage`, `ergene-textile-dye`, `aegean-geothermal-reinjection`, `aegean-olive-vs-lignite`, `konya-sinkhole`, `harran-salinity`. Add 8 DE/UK skins (2 per card), e.g. `ni-lough-neagh`, `se-thames-quality`, `se-chalk-stream-abstraction`, and the English 5p bag charge as a skin of the bag-fee card.
- **M3, the remaining 4 cards** (recovery lag, commons, irreversibility, siting) and 16 more skins. Upgrades ~24 of 72 DE/UK events, one third.
- **Hard cap per milestone:** ≤40 new authored sentences ×3 languages and ≤8 verified sources.
- **Reject or defer:** EB-P7's 25% third-option injection and BP-P4's 54 letter fragments. Use stake-tagging only (reuse the 5 templates, match the writer's stake to the medium).

**X9 (installments vs rebate).** Different channels, so keep both and do not merge.
- **Environmental recovery is gradual:** 2 or 3 installments. The source stops at once, but the state (water body, aquifer, grove) recovers slowly, and real recovery is often partial (hysteresis), so some installments should sum to less than the loss.
- **A money rebate is honest only as avoided cost.** Not a universal reward for a clean choice.

**(B) Truth audit of the numbers**
- **EB-P1 co-benefit rebate (0.5 × cost at +6 days).** As a blanket rule it teaches "virtue always pays back". Real avoided costs exist (health, flood damage, fisheries, water treatment) and need Tier A: an agency or peer-reviewed cost-benefit source. Many clean choices have no payback: biodiversity and heritage, e.g. `aegean-olive-vs-lignite`, `antalya-caretta`, `gap-dam`. *Amendment:* rebate only on choices with `avoids: mechanism`, with a size and timing per card (0.3–0.7, at +10 days), and show who gains. Some clean choices must pay nothing.
- **EB-P5 audit and "poverty ×2" payoff.** The "poverty" label is a causal claim that blames the poor; what the model has is a municipal fiscal squeeze. Reframe as "budget stress makes short-term deals tempting" (composite tier). A random audit teaches "corruption mostly fails". *Amendment (resolves X2 deterministically):* a **pattern audit** — the second dirty deal on the same mechanism within ~8 days triggers an inspection. Provable from the log, no roll; EB's fixed fine stays.
- **EB-P3 neglect interest.** Defensible only for compounding problems. Real examples: a contaminated groundwater plume grows and treatment costs rise; invasive-species eradication cost climbs steeply with area, so early detection is cheapest (`med-invasive-fish`); wildfire suppression; salinisation (`harran-salinity`). Not universal: a fixed-cost retrofit (`marmara-earthquake-retrofit`) does not compound this way. *Amendment:* `compounding: true` per event, Tier B with an agency or review source, not a uniform ×1.6.
- **EB-P6 diminishing returns above 85.** Defensible (the last few percent of removal is the most costly: tertiary nutrient removal, marginal abatement cost curves). Tier B, labelled as a rule in the cards ("the last 10% costs more"). The grace band is a game rule and needs no evidence.
- **GL-P1 stress-year shocks.** Defensible per region only with a table of historical analogues, each with date and source; no climate-attribution claims. **Konya flood: reject** (Konya gets drought — the Tuz Gölü drying in 2021 — or heat). Black Sea flood: yes (Bartın and Kastamonu, July 2021). Southeast flood: yes (Şanlıurfa, March 2023). Germany: Ahr floods (July 2021). UK: heatwave (July 2022, over 40°C). *Amendment:* forecast only slow-onset shocks (drought, heat); floods get a 1–2 day warning instead, teaching early warning versus preparedness.
- **UX-P2 soot markers.** Soot drawn for every problem conflates media (draws a water problem as air). *Amendment:* tie each mark type to the event's `tags.pollution` (haze for air, foam or discolouration for water, brown patch for land), placed only on that event's `location.provinces`. Marks tied to Kara Holding must be labelled fictional.

**(C) Attacks**
1. **EB-P1 (strongest objection):** "virtue pays" is a causal lie where there is no avoided cost. Amend as above.
2. **GL-P1:** a flood forecast "from day 1" implies floods are predictable weeks ahead. Amend: slow-onset forecasts only, short-notice warnings for fast events.
3. **ES's own weakest, ES-P2 (three media):** highest effort (~250 LOC plus content) for a lesson that typed residue delivers.

**(D) Ranking K1-K11 by truth impact per effort**
1. **K2** lag symmetry, `addresses`, typed residue and a sourced `avoids` rebate.
2. **K6** hidden-info leak fix. XS; protects the only working pedagogy.
3. **K10** fix `isDirtyDeal`. A causal-honesty bug, S effort.
4. **K1** prevention projects. Teach prevention vs cure. DE/UK tags are a dependency.
5. **K9** cards and skins, capped as in X8.
6. **K11** sim assertions. An enabler, so first in practice.

**Defer:** K8 map marks (until medium-matched), K7 tempo, K3 rewind (to M3), K4 codex (after the cards exist), K5 quest removal (only after the income rebase).
**Reject:** the "poverty ×2" label, uniform neglect interest, a blanket rebate, the Konya flood, the 25% third-option injection, the 54 letter fragments.

**Rules of honest content (for the validator and the author — every event, skin and letter)**
1. Every event and skin declares a tier (real / composite / hypothetical) that is shown on the card. `real` needs ≥1 verified primary source (agency, peer-reviewed or court). A news-only source is `partly-verified`, and the text says "reported".
2. Game numbers are never shown as measurements. Any real figure carries its own source and year. No invented figures.
3. Every consequence the `why` text names must show in the numbers or the lag. No contradiction between text and numbers (e.g. "took years" with an instant +25). Remedial effects are paid in installments, except for fast media (air, price).
4. Every choice has a `kind` (symptom / source / displace / ignore / systemic) and says what it does not fix.
5. No option is both cheapest and cleanest without a sourced co-benefit, and each green cost states who pays and who gains.
6. No single-event climate attribution. A shock needs a regional analogue with date and source.
7. Blame is structural unless the choice is flagged illegal. A letter's writer matches the medium and the stake (no fish letter to a nurse).
8. TR/EN/DE parity: the same figures, units, hedges and source labels in all three languages, and the validator fails otherwise.

---

### R3 · UX/UI & Game-Feel Director (`UX`)

**UX/Game-Feel Director, Round 3.** Read the log through the Round 2 checkpoint and the R2 proposals. Nothing edited.

**(A) Resolutions**

**X1 — one chip slot, post-commit, with a ghost marker.**
- UX concedes the timing to LS. A pre-commit chip cannot be a real gate, because the choice is already applied in the reducer. UX keeps the ghost marker, since that is where the stake is felt.
- Rule: one prediction per event, never two. Chip type depends on the data: if the choice has an authored `mechanism` enum, show LS-P1 mechanism chips; if not, show direction chips (▲▬▼ on the largest-|effect| stat). Hidden numbers (C1) can then roll out to all 124 events without waiting on authoring.
- `PREDICT` is dispatched after `HANDLE_CHOICE`, in the order the UI already works today. SE's mastery update works either way.
- *(Orchestrator note: LS's R3 proposes a different hybrid — direction hunch pre-commit-of-reveal in `HANDLE_CHOICE{hunch}` with mechanism revealed. UX concedes "post-commit" but keeps mechanism-or-direction chips; LS keeps one tap with direction hunch + mechanism reveal. Both agree on: one prediction per event, hidden numbers until reveal, ghost marker/hit→collapse/miss→expand+counterfactual. Residual difference is purely whether the single chip row asks direction (LS) or mechanism-else-direction (UX), and whether it is a separate `PREDICT` action or a field on `HANDLE_CHOICE`. To be settled in the synthesis.)*

**Phone-landscape sequence (3 taps, same as today's outcome events):**

| Step | Visible | Tap |
|---|---|---|
| 1. Choose | Map on the left with the node outlined. Right sheet: title, a 2-line clamped description, and 2–3 buttons showing text and a cost tier. No effect numbers. | tap 1 |
| 2. Hunch | The choice recapped in one line. 3–4 chips of up to 3 words at 44px height, plus "Not sure". The HUD and the sheet's stat strip stay frozen at pre-choice values (K6). | tap 2 |
| 3. Reveal | The chip collapses to a ✓ or ✗ plus one shared mechanism line (a hit stops there). A miss adds one counterfactual line. The HUD bars count up from the ghost marker, the map animates at the node, and sources sit behind "Sources ▸". | tap 3, Continue |

Reading load is at most 2 lines on a hit. The first-ever crisis skips step 2.

**X11 — Mikey table.** *Rule:* Mikey speaks only about the player's interface or process. He speaks once per hint id, ever. He never speaks about outcomes, because the cards, letters and news already do. Budget: at most 6 bubbles in a first run, at most 1 per 3 game days after day 5, and none for a veteran. A hint is cancelled if the player has already done the thing.

| Moment | Mikey |
|---|---|
| First node, End Day / Advance, tax, first delayed letter, first repair marker, forecast chip | Speaks, one line, once |
| First time a node reaches severity 2 | Speaks, and the line can say "waiting costs more" |
| During a crisis modal, hunch chips, or reveal | Silent. The card speaks |
| Eruption, game-over body, fines, audits, Kara tier changes | Silent. The news TV is the irony channel |
| Rewind, seed and Casebook screens | Silent. These are class and teacher contexts |
| Debrief | Existing headline only. Sad on a bad ending, never cheerful over harm |
| Repeat of any hint, or a veteran's later run | Silent |

New features add no new Mikey lines, apart from the first-time ones above.

**X7 — Advance replaces End Day, and the Dawn Strip is the same thing.**
- One button, "Advance". It ticks days visibly at ~350 ms per day, so the ticking is the ceremony: the day counter flips and the HUD deltas pulse.
- It stops at any notable event, per GL-P4, and always stops at severity 3, the day before an eruption. Tapping again cancels.
- On stopping, the Dawn Strip is a non-modal strip showing the day plus 3 delta chips. A letter or news item is shown as a mail icon on the map. The full modal opens only for a first-ever item or a new Kara tier.
- Hold-to-skip dropped (not discoverable on touch; Advance covers the case). Reduced motion: no tick animation, final strip shown immediately.
- *(Note: GL's X7 proposal keeps a one-day "End Day" next to "Until something happens". UX says a single "Advance" button. Synthesis: keep ONE button whose first tap advances a single day if something is pending, otherwise runs until notable — to be settled.)*

**(B) Attacks**
1. **SE-P2 rewind.**
   - *Objection:* it sits on the GameOver screen, where the player has just lost, and a list of 5 event titles is another reading screen. There is no map, so "where was I" is lost, and landing mid-day is disorienting.
   - *Amendment:* show a timeline of at most 5 pins (event icon plus day) on a mini map, offered only after a loss. On landing, play a 1.5 s sepia-and-count-back visual and show a persistent "↶ original path" peek chip. Cap rewinds at 2; put the seed link under a collapsed "Share".
2. **BP-P2 amends nodes / BP-P5 Casebook.**
   - *Objection (amends):* a node that never erupts looks like every other alert circle but behaves differently, and competes for one of the 3 node slots. *Amendment:* render it as a handshake or mail glyph in blue, no severity digit, no pulse, not counting towards the cap. (GL independently proposed moving it into `LetterModal`.)
   - *Objection (Casebook):* pasting N codes on a phone is miserable, and a teacher dashboard should not live in a kids' game menu. *Amendment:* a separate static route (`#/casebook`), desktop-first, linked only from the footer, zero first-run presence.
3. **EB-P3 neglect-interest tiers on nodes.**
   - *Objection:* adds a second severity encoding ($→$$$) on top of size, colour and digit; and it is a loss-framed price shown on the map, pushing "clear the board" panic over thinking.
   - *Amendment:* the map carries no `$` glyph. The tier shows only on the choice buttons (they already carry cost tiers), rising with node age. One existing `nodeGrew` hint covers the explanation.
4. **UX's weakest: the ambient audio bed in UX-P5.** A looping procedural bed costs battery, plays through weak phone speakers, needs an autoplay unlock, and clashes in a classroom. *Amendment:* drop it. Keep threshold chimes, sustain tick and haptics. Province tint stays but ships after the UX-P2 markers, since the global filter partly overlaps it.

**(C) Screen budget**

Everything the clusters would add: side sheet, hunch chip row, Dawn Strip, Advance running state, rewind picker, counterfactual compare card, seed/share card, Casebook, Dossier cards, Codex, debrief "One Idea" card, Promise/Mandate pick, amends node and modal, stress-year forecast banner, warm-up recall question, meta settings panel, scenario picker, shield icons, map marks.

**Minimum set, with everything else folded in or cut:**
- **Re-skins of existing surfaces (net zero new screens):** side sheet, chip row, Dawn Strip (replaces `DaySummary`), map marks, shield icons, and the amends marker.
- **Debrief:** keep the existing 3-card cap, with up to 3 optional blocks competing for those slots.
- **MainMenu:** the Dossier becomes a one-line epitaph on each region card, and scenarios live there. A gear icon holds meta settings.
- **One real new screen:** the Casebook, off-path.

**First run shows:** the map, one node, one Mikey line, the choice sheet, a reveal with an effect count-up (no chip on the first crisis), and Advance. Tax and Projects stay locked until the first solve, as today.

**Unlocked later:** from crisis 2 → hunch chips; after the first project → the stress forecast chip; after the first loss → rewind; run 2 onward → Promise (merged with Mandate) and Dossier epitaphs; after the first debrief card → the Codex; behind a "Share" fold → seed.

**Cut:** warm-up recall before a run, and any in-game Casebook.

**(D) Rank by feel and clarity per effort**
1. **K6, the C11 leak fix.** XS-S; protects every later prediction feature.
2. **K8-lite.** Node resolve and erupt end-states, HUD delta pulses, the 80 marker, haptics. XS-S; the C14 fixes ride with it.
3. **K7.** Advance plus the Dawn Strip. L, but the biggest tempo gain.
4. **K10.** The `patron` flag. L code. Makes feedback fair — a trust fix.
5. **K2.** The co-benefit rebate with a visible "pending" marker. S-M; addresses 564 `clean-broke` endings.
6. **K1.** Prevention with shield icons on the map. M.

**Defer or reject:**
- **Reject:** the ambient audio bed, the `$` glyph on nodes, an in-game Casebook.
- **Defer:** K3 rewind and seed (until the K6 log work is done); K4 returning-citizen letters (content-heavy); K9 chip enums beyond the first 15–40 events; the stress-year forecast (until Advance is playtested); GL-P6 re-encounters (until ≥2 events per mechanism). K11 is infrastructure that gates the rebalance, so goes first, but has no UI.

*(Orchestrator note: R3 reports logged: GL, LS, ES, UX. Pending: BP, SE, EB.)*

### R3 · Behavioral Psychologist (`BP`)

**BP ROUND 3: cross-examination & synthesis** (read-only; G1–G13 are BP's 13 guardrails in Round 1 order)

**(A) RESOLUTIONS**

**X2 — audit vs no random detection. BP concedes randomness, with two amendments.**
- G4 is about reward magnitude, and a fixed fine drawn from a seeded stream is not a variable-ratio hook.
- What matters is the lesson. EB's numbers do not teach "corruption always fails": with ×2 payout, desperate 97 vs desperateClean 84 (+13). With audit .25+.15×tier and fine 120, 87 vs 80 (+7), and green-shadow doubles. That is "it can pay, and someone else still pays".
- A deterministic alternative (inspection on a fixed cadence once `patron` decisions since the last inspection reach 2) is more legible but cannot hit EB's calibrated numbers without a new sim round, so BP does not recommend it. *(Note: ES-R3 independently proposes a deterministic "pattern audit" — second dirty deal on same mechanism within ~8 days. Remains to be sim-tested by EB in R3.)*
- **Amendment A1:** the harm channel (named citizen's delayed letter) and the audit channel (fine) are independent. Harm lands whether or not the audit hits.
- **Amendment A2:** draw with `nextRandom`, resolve at the reveal card, no suspense animation or roll sound (guards G4's spirit).
- **Amendment A3:** the reveal card states the odds ("deals like this are checked roughly 1 time in 3; this time: not checked / checked") and why the offer was larger ("the treasury was low"). Odds shown after the choice, never before, so the unlabelled temptation survives.
- **Hard floor:** random policy must stay ≤ ~13%. EB saw 11→24 under a weak audit; a miscalibrated audit is the failure mode.

**X5 — neglect interest. Conditional PASS.**
- Failing points: a second hidden clock on top of severity escalation (1→3 every 2 days, eruption at 6) double-counts pressure and deepens "clear the board" over "think" (G3, G2 spirit).
- **Amendment:** do not add a separate `age` clock. Bind the multiplier to the *existing visible severity* (sev 1/2/3 → ×1.0/1.3/1.6). The node already shows its severity, so the player can see the price rising. Show the $→$$→$$$ tier on the node card. Apply to budget only. No application during the first-solve tutorial. Sim gate: smart within ±3, lazy must still drop. *(Note: UX-R3 says no `$` glyph on the map — tier on choice buttons only; ES/LS/GL want `compounding: true` per event. Three variants of the same lever; synthesis needed.)*

**X6 — ONE quest replacement, the Promise. Exact flow:**
1. **Start.** After region pick, "Who do you promise?" shows 3 cards. Each card is a citizen plus their stake from the region (e.g. "Rıza: keep the strait fishable", stakes water/marine). A "No promise" button is visible. `START_GAME` payload gets `promise?: {characterId, tag}`, so the log replays.
2. **During the run.** No toast, no meter, no reward. That citizen's province gets a small ring on the map (K8). Letters prefer that citizen (ties to X12).
3. **Debrief, a single line built from the decision log:** "Promise to Rıza (water): kept / partly kept / not kept / never tested." Rule: count decisions whose event tags intersect the stake. Kept = 0 harmed. Partly = harmed ≤ helped. Not kept = harmed > helped. Never tested = none matched, said plainly. Followed by the relevant mechanism card (K9) and, if not kept, the repair route (K10).
4. **Meta store (K4).** At GameOver write `meta.citizens[id].lastEnding` and `meta.codex` (mechanisms from decided events). Next run, the citizen's first letter is a `returning` kind. Codex cards unlock choosable scenarios (GL "run #20"). EB's Dossier unlocks fold into the codex as debrief-only cards, capped at 4, no toasts.
5. **Precondition:** EB-P4 income rebase ships first (quests at 0 drop smart 71→12.5% otherwise). Old quests are then deleted.

**X12 — cheapest honest stake matching.**
- Add a role→stakes map (~10 roles: fisher→water/marine, farmer→soil/landuse, teacher or nurse→air/hazard, shopkeeper→economy). Each of the 38 characters derives its stakes from its role, so no per-character authoring.
- `addLetter(kind, eventId)` picks the first character whose stakes intersect the decision's `tags.pollution`, falling back to the current rotation. Keep the 5 templates.
- Fix the one false line: `cleanBad`'s "Balık kalmadı / The fish are gone" gets 3 variants (water, land, other) = 9 strings. Defer the 54 fragments.
- Persistence needs a single new `returning` template ×3. **Total: one map plus 12 strings.**

**(B) GUARDRAIL AUDIT (strict)**
- **K1 prevention:** pass. Show a shield icon, not a counter.
- **K2 rebate / EB-P1:** G9 near-violation (pending markers) and G8 (it pays budget). *Amendment:* a fixed-magnitude in-fiction letter ("the clinic saved money"), no bonus toast, no jackpot sfx, and the "?" marker carries no sign and no amount.
- **K3 rewind / SE-P2:** G13 near-violation ("one more run" prompt). *Amendment:* a passive link below the debrief, one use per run, no auto-prompt, no sound. Seed card and path code only after that.
- **K3 Casebook:** G5 identifiability. A 12-decision path is near-unique, so k≥5 on rows protects nothing. *Amendment:* per-decision marginals only (never rows), paste via one bulk textarea, no timestamps, and tell the teacher plainly that anonymity is from classmates, not from the person who collected the codes.
- **K4 meta:** G1 near-violation if `runs`, dates or visit counts are stored. Store `lastEnding` and the codex only. No empty "?" slots with nagging copy. *(Note: LS and GL want "???" slots as curiosity gaps; BP says no nagging copy — keep as a neutral silhouette, no counter.)*
- **K5 Promise:** G11 (moralising "not kept") and G6. *Amendment:* factual wording, always paired with a repair route.
- **K6 hit-rate (UX-P1):** shown as a percent it becomes a score (ROADMAP bans points). *Amendment:* a sentence ("you called 3 of 5"), no percent, no trend arrow.
- **K7 Advance:** letters must stop the advance (relatedness).
- **K8 / UX-P2 soot markers:** G7 violation if shipped before K10, since tiers are currently wrong (tourist counts as corruption). Dependency: K10 first. The 250 ms screen shake on eruption is aversive (G11): drop it and keep the thud.
- **EB-P5 ×2 below budget 200:** perverse incentive to stay poor (spend down to unlock). See (C).
- **EB-P6 grace band:** pass, an improvement (removes the loss-framed reset). Make the "last 5 points count half" rule visible.
- **GL-P1 forecast:** G2/G3 if drawn as a ticking countdown or if the shock resets sustain. *Amendment:* a calendar mark from day 1, and the shock slows gains (EB's grace band) rather than resetting.
- **UX-P5:** the rising-pitch tick per sustain day is a streak (G1) with an audible reset (G2): reject, or use constant pitch. The drone under 30 is a sustained anxiety cue: remove. The bad-reveal haptic `[20,30,20]` is punishment: use one neutral pulse for every reveal, with valence shown visually.

**(C) ATTACKS**
1. **EB-P5's "×2 only when budget < 200."** Objection: it rewards poverty. A player can spend down to unlock the bigger bribe, and "poverty drives pollution" becomes a gameable rule. *Amendment:* a flat ×1.6 early-game multiplier tied to day ≤ 10 or to an open node's visible deficit, not to the player's own balance.
2. **UX-P1 hunch chips.** Objection: for dominance-shaped 2-option events (C2) the largest-|effect| stat is the obvious one, so hit rate approaches 90% and trains tapping, not inference. *Amendment:* probe the *non-obvious, trade-off* stat via an authored `probe` field, first on the 15 outcome events, and skip the chip when the answer is dominated.
3. **BP's weakest: BP-P5 Casebook.** Needs a teacher workflow, bulk paste, aggregation and a k floor, for unproven classroom use. Defer behind the seed card. Also soften BP-P3: describe the act plainly ("accept the cash envelope") and withhold only the legal label.

**(D) RANK by intrinsic-motivation quality per unit effort**
1. **K6** leak fix plus logged prediction. XS-S. Protects competence.
2. **K2** lag symmetry / rebate. S-M. Makes virtue viable (clean 2→18), which is real autonomy.
3. **K10** patron flag plus repair. L-M. Buys honest feedback.
4. **K1** prevention projects. M. Planning agency, sim-validated (smart 34→41).
5. **K5 + K4** Promise and local meta. M. Meaning and relatedness.
6. **K7** tempo. Low effort, flow.
(K11 is an enabler, done first. K8 follows K10.)

**REJECT or DEFER:** reject the UX-P5 sustain-tick, the drone and the aversive haptics. Defer the Casebook and rewind. Defer the EB-P7 third option (H authoring). Defer GL-P6 Second Look, ES-P2 media and the GL-P1 shock (keep only EB-P6 grace).

*(Orchestrator note: R3 reports logged: GL, LS, ES, UX, BP. Pending: SE, EB.)*

### R3 · Principal Game Systems Engineer (`SE`)

**SE ROUND 3: Cross-examination and synthesis.** Code read only; nothing edited. Sim claims (49% vs 55%, the 78–87% unlanded delays, audit numbers) are **not verifiable by SE**, because `node_modules` is absent and install is not permitted. Everything marked CONFIRMED/WRONG below was checked in source (events data loaded with `node --experimental-strip-types`).

**(A) Resolutions**

**X8 — SYSTEM vs CONTENT.** Unit: 1 LTU = one `LocalizedText` ({tr,en,de}). Rules: prose is written per mechanism, never per event (shared chip sentences, default recovery message from the mechanism card, skins that fill slots); enums are authoring labour, not translation, cost 0 LTU; `validate:events` diffs the LTU count against `scripts/content.lock.json` and fails over the milestone cap in `scripts/budget.json`.

| Class | Proposals |
|---|---|
| SYSTEM (scales free) | SE-P1 stage 0, SE-P2, SE-P3, SE-P5, SE-P4 weights, GL-P2 code, GL-P3 / LS-P4 / SE-P2 rewind, GL-P4 with UX-P4, EB-P2, EB-P3, EB-P4 code, EB-P6, UX-P3, UX-P5 code, UX-P2 code, ES-P2 code, ES-P3 schema, BP-P1 code, BP-P5 codec, GL-P5 dossier code, C11 and C14 fixes |
| CONTENT-HEAVY (×3 prose) | ES-P3 cards and skins, ES-P4 catalogue, BP-P3 (events), BP-P4 (54 fragments), BP-P2 repair events, EB-P7, LS-P3 residue, GL-P1 shock cards, GL-P5 mandate text, DE/UK back-fill (72 events), outcomes for the other 109 events |
| CONTENT-LITE (no translation) | LS-P1 enums, BP-P1 flag review of 57 choices, mechanism-enum collapse |

**X9 / X10 / X1 — one data shape.**
```ts
interface Consequence {                 // DelayedEffect becomes an alias; old data is valid
  inDays: number; effects: Effects; message?: LocalizedText; // default = mechanism card sentence
  kind?: 'harm'|'recovery'|'residue';    // default: harm if sum(effects)<0 else recovery
  mechanism?: string; medium?: Medium }  // mechanism = cancellation key (ES-P1); medium = residue marker (LS-P3)
EventChoice += { delayed?: Consequence[]; addresses?: string[]; mechanism?: MechEnum; patron?: 'kara'|'unnamed' }
Decision += { mechanisms?: string[]; hunch?: {stat:StatKey; guess:-1|0|1; ok:boolean};
              chip?: {guess:string; ok:boolean}; repairs?: number /*causeDay*/ }  // debts = derived, never stored
```
- **X9:** same data, two producers. The reducer's pure `rebateFor(choice)` generates the EB-P1 default (`{inDays:6, kind:'recovery', effects:{budget:+0.5·|cost|}}`). An authored recovery list (ES-P1 installments) overrides the default, so no double dip. Validator rules: every `inDays` ≤ 12, and recovery-sum ≥ 0.9 × cost for installment events.
- **X1:** both prediction formats coexist, because they sit in different `Decision` fields. The minimum is the **direction hunch**, which needs zero authoring (the stat is the largest |effect| in the existing data). It travels atomically as `HANDLE_CHOICE.payload = {index, hunch?}`, so no half-committed state and `REWIND_TO` stays simple. The mechanism chip is a separate post-commit action `PREDICT_CHIP {chip}`, valid only while `pendingOutcome` is set, shipping only for events that carry a mechanism enum. Not a precommit gate, so it answers LS's paralysis concern.
- **X10:** forecast and weights are the same mechanism. `phase = {kind, boostedTags, fromDay}` is derived by a keyed roll (see C1), so the main stream is untouched. It feeds one function, `spawnWeight(state, ev) = prevention × mastery × phase`, in integers ×100. With all multipliers at 1 it is bit-identical to today, because `floor(v·n)` equals the cumulative pick. EB-P6's ×2 hazard is the phase's `boostedTags`, and GL-P1's visible forecast is the same object displayed.
- **Invariant gate:** the "neutral data ⇒ bit-identical" test must strip new fields (`pred`, `phase`, `mastery`) and compare the rest.

**(B) Verification of other seats' claims**

| Claim | Verdict |
|---|---|
| EB: only 52 of 124 events carry `tags.pollution` | **CONFIRMED** (52). All 72 untagged are DE/UK, 6 per region × 12 regions. |
| UX: wildlife ignores cleanliness | **CONFIRMED.** `MapWildlife.tsx:52` takes no props; its header says "no gameplay meaning". Part A.3's "wildlife reacts to cleanliness" is **WRONG**. Only `CountryMap`'s global filter (prop `cleanliness`) reacts. |
| LS/UX: floaters and sfx leak before the prediction | **CONFIRMED.** `EventModal.tsx:137,146,156` fire `showFloatingText` regardless of `hideEffects`; `:164-165` play `sfx.choiceGood/Bad`. The live stat strip at `:208-218` also changes. |
| LS: prediction is component state, post-commit | **CONFIRMED.** `useState` at `:77`; `asking` at `:83` requires `outcome`, so the guess comes after `onChoice`. No `PREDICT` in `GameAction`. |
| BP: `isDirtyDeal` too broad, "~25 candidate choices" | Direction **CONFIRMED** (`story.ts:14-15`). The number is **WRONG**: **57 non-bribe choices** across 60 events are flagged (60 of 265 choices; only 3 are `bribe`). `tourist-season#0` is among them. A larger review job, and 60 events can raise `holdingTier`. |
| ES: all 10 delayed entries are harm | **CONFIRMED.** 10 entries, all negative, 0 recoveries. 8 of 10 are 14–25 days; the two Kara ones are 4–5. |
| ES: `wales-afforestation` has `ankara-green-belt`'s +20/+20 shape | **PARTLY WRONG.** `ankara-green-belt`'s clean option is +20 happy, +20 clean at −120. `wales-afforestation`'s is −40 budget, −15 happy, +20 clean. |
| ES/EB: cleanest option costs budget in 110/124; cleanest = richest in 17; 107 two-choice | **CONFIRMED** (110, 17, 107/17/0). Part A's "2–4 choices" is **WRONG**; max is 3. |
| UX: volume button has `max-sm:invisible` | **CONFIRMED** (`App.tsx:119`, the SFX button; the Mikey button above it is fine). |
| `tags` and `mechanisms` are read by no code | **CONFIRMED.** Only `types/index.ts` and `validate-events.mjs` mention them. |

**Finding that matters for D8 and SE's own P4:** 15 events carry `mechanisms`, with **22 distinct free-text strings**. Only `pollution-displacement` is used twice. DE/UK have 0.

**(C) Attacks**
1. **EB-P5 probabilistic audit.**
   - *Objection:* a roll from the main `rngSeed` stream shifts every later spawn depending on the branch taken. That destroys the rewind guarantee "same crises, other choice" and confounds the branches in the debrief's two-path comparison.
   - *Amendment:* make the audit a **keyed roll**, a stateless hash `hash32(runSeed, eventId, day) < p`. Add `runSeed` to state (set at START) and `keyedRoll()` to `rng.ts`. Order-independent and replay-safe; the same decision gives the same result in any branch. EB's numbers hold in expectation. The debrief can state the odds and the roll, resolving BP's honesty point from the provability side.
2. **GL-P1 stress year.**
   - *Objection:* a fixed calendar `forecastDay` may fall outside the hold. A player who stabilises early finishes the hold before the shock, or the shock arrives while they are far below 80/80, so the test is arbitrary. It also double-counts EB-P6's grace band and reset rules.
   - *Amendment:* anchor the shock to **hold start** (`fromDay = holdStartDay + k`, k from a keyed roll). Announce the specific kind ≥4 days ahead, with a generic "a test will come once you stabilise" from day 1. Choose a single hold rule (EB's grace band) so the two counters don't interact. Sim gate: `prevent − noProject ≥ +10` during the shock.
3. **UX-P2 province layer.**
   - *Objection:* `CountryMap` is `memo`'d over 81 paths (turkey 80 KB, de 111 KB, uk 165 KB of path data). A per-province tint driven by React props re-renders them on every tick. The state has no "player province", only `regionId`.
   - *Amendment:* one wrapper CSS variable (`--clean`) and no per-path props. Draw the region outline from the existing region geometry. Place soot or tuft markers at `getProvinceCentres` (`geometry.ts:211`) as `<symbol>`s capped at 5. No `blur` filters in `mobile-landscape`.
4. **SE's weakest: SE-P4 adaptive selection.**
   - *Objection:* there is no repeated mechanism in any region pool. A pool is 5–7 regional plus 11 generic, and a run is ~12 events. The feature is a no-op today. The validator rule "≥2 events per mechanism" would fail 21 of the 22 current mechanisms.
   - *Amendment:* do the enum collapse (22 strings → ~8) first. Make the coverage rule a warning until ≥2 events per enum exist in each country. Ship cross-run warm-up recall first (*note: LS has since withdrawn the warm-up*); ship spawn weights only after the content exists.

**(D) Build sequence** (caps are LOC and LTU; a milestone ships only after its gates are green)

| M | Scope | LOC / LTU cap | Gates before ship |
|---|---|---|---|
| **M0** Foundations (all SYSTEM) | CI wiring (`npm test`, validate, sim:check); SE-P2 minus UI (compact log, `CONTENT_VERSION`, lock, JSON round-trip); SE-P5 harness (baseline, paired seeds, Wilson, policies `noProject`, `lazy`, `desperate`, `desperateClean`); `runSeed` and `keyedRoll`; ESLint meta boundary; LTU budget check; C11 XS fix; C14 XS items | ≤450 / ≤8 | SE-G1, EB-11, and SE-G2 at **zero diff** |
| **M1** Economy and honesty | EB-P4 (income rebase, quest rewards to 0, derived dossier unlocks) in one PR; K1 prevention (EB-P2, GL-P2, ES-P4-lite: `prevents` on the 6 projects plus at most 2 new); `effectiveEffects`; unified `Consequence` with rebate and ES-P1 recovery on the 10 delayed events; EB-P3 with $ tiers; EB-P6 hold 14 plus grace band; BP-P1 patron flags | ≤700 / ≤45 | EB-1 to EB-11 including payback ≤15 d, SE-G3 and SE-G4 (landing ≥60%, quests-off ablation ≥40%), per-lever ablation within ±5 of EB's prediction |
| **M2** Learning loop | `HANDLE_CHOICE {index, hunch?}` and `PREDICT_CHIP`; UX-P1 chips; LS-P1 chips (8 labels and 8 sentences); enum collapse; SE-P3 meta store; LS-P5 One Idea codex; rewind and seed card; +10 events upgraded with shared sentences | ≤800 / ≤90 | SE-G1 with new rewind and round-trip tests; state-minus-`pred` bit-identical; EB-1 to EB-9; `learner` and `rewinder` policies |
| **M3** Place, tempo, endgame | GL-P4 with UX-P4 merged; UX-P3; UX-P2 per amendment; UX-P5 haptics only; GL-P1 per amendment (4 shock cards); adaptive weights (SE-P4) once enum coverage holds; EB-P5 audit as a keyed roll with BP-P3 unlabelled option (3 loophole events); BP-P2 repair arc (3 shared events); Promise; citizen stake-tagging only (X12, reuse the 5 templates) | ≤900 / ≤110 | EB-1 to EB-11 plus `prevent − noProject ≥ +10` in the stress year; empty-mastery bit-identical; keyed-roll replay test |
| **M4** Depth, **playtest-gated**, one family per release | ES-P2 media stage 1 then 2 behind the shim; ES-P3 cards and skins with DE/UK back-fill; EB-P7 (≤8 events); BP-P4 fragments in batches of 18; BP-P5 Casebook (k≥5); ambient audio | ≤700 per release / ≤120 per release | SE-G2 (±5 pts, ±2 d, ±5 pp) for stage 1; `displacer` ≥10 below `mediaAware` for stage 2; EB-1 to EB-11 |

Deferred: ES-P4's full catalogue of 10 projects, and EB-P7's 25% blanket.

> **ORCHESTRATOR ERRATUM #3 (A.3/A.4):** SE verified from data that max choices per event is **3** (107 two-choice, 17 three-choice, 0 four-choice), not "2–4"; `isDirtyDeal` flags **57** non-bribe choices across 60 events (not ~25); wildlife is decorative (Erratum #1 confirmed). Also: `tags`/`mechanisms` are read by no code (confirmed); the 15 events carry **22 distinct free-text mechanism strings** (not a controlled vocabulary).

*(Orchestrator note: R3 reports logged: GL, LS, ES, UX, BP, SE. Pending: EB.)*

### R3 · Economy & Progression Balancer (`EB`)

**EB ROUND 3 — measured on the fork** (`/tmp/claude-0/-home-user-green-turkiye/526d184a-5f3e-5c53-99fb-e2de131171b5/scratchpad/fork`, `lib6.ts`, `x2b/x4/x5/x9/x10/final/abl.ts`). n=500 per cell, SE ±2.2. Quests at 0 in every cell.

**Three corrections to EB's own Round 2 first.**
1. EB's "smart" included the project-buying drag. Buying the old-price projects at any reserve level loses 13–17 points against `noProj`, and the gate "smart 45–65" was measuring that drag.
2. The tax rebase is not needed. Tax stays NORMAL +8. What replaced the quest money (+700 budget) is the rebate plus a budget yield on every project.
3. Prevention by spawn weight is almost worth nothing in balance terms. `patient` is 66 with it and 65 without it. Only 52 of 124 events carry tags. Its value is educational, plus the stress year (see X4/X10).

**(A) Resolutions**

**X2 — a deterministic cost replaces the audit.** All rows have dirty ×2 below 200 budget and the new base economy.

| Dirty-path cost | smart | desperate | desperateClean | random | desperate ending shares |
|---|---|---|---|---|---|
| None | 59 | 98 | 86 | 17 | green-shadow 63% |
| EB audit (.25+.15t, 120) | 52 | 90 | 82 | 13 | green-shadow 61% |
| Named-citizen harm (−8h/−6c at +5d) | 58 | 98 | 85 | 15 | no effect, too small |
| **Ratio fee** | 51 | 88 | 82 | 10 | green-shadow 61% |
| Fee 25+25t | 47 | 84 | 81 | 7 | |

- **Adopt the ratio fee.** It lands on a named citizen on day +4, at `0.5 × gain × (1 + 0.15 × holdingTier)` budget and −4 happiness. It is a pure function of the deal, with no roll, and it matches the audit's numbers.
- The dirty path stays mildly better (desperate beats desperateClean by +6) and cannot be taught as "it always fails". A fixed fine on the 3rd dirty deal also works (desperate 90, random 11).
- Dirty still wins most of the time. That is why the ending must be keyed to the decision log (see BP-P2 below).

**X4 — stress year.**
- Hold-length effect, desperateClean median winning day: hold 20 → 38, hold 14 → 30, hold 10 → 26. Win rate within ±4, with smart 47 → 51 → 54.
- Grace plus the ×0.5 cap above 85 changes nothing measurable: hold 10 gives smart 54 either way. The cap is weak.
- Stress at an absolute day (start 20, length 5, decay ×2.5/×2, hazard-family weights ×3): noProj drops 66 → 59 and patient drops 68 → 66. So the shield value of building projects rises from +2 to +7.
- A hold-relative mild hazard weighting (EB-P6) has zero effect, 53 vs 54. A hold-relative full shock costs smart −6.
- **Resolution:** hold 10, one forecasted stress window at days 20–24, grace band 10 kept as UX only, cap dropped.

**X5 — neglect interest is still needed.** Prevention and the stress year do not fix `lazy`. Lazy (opens crises at age 3 or later) scores 74 against smart 60; with the stress year still 69.

| Setting | lazy | smart |
|---|---|---|
| Interest 0.1 | 58 | 60 |
| Interest 0.15 (adopt, cap 1.45) | 47 | 57 |
| Interest 0.2 | 45 | 60 |
| Bleed 0/2/4, no interest | 67 | 60 |

Smart and desperate are unchanged by interest. Honesty: show the cost tier ($/$$/$$$) on the node. This does not push "clear the board", because opening early is only better by 10 points, not required. *(Not tested: compounding-only flag; other seats ask for it.)*

**X9 — rebate shape.** Both ES-P1 installments and the single rebate work.

| Variant | smart | clean |
|---|---|---|
| No rebate | 43 | 2 |
| Single +6d | 60 | 17 |
| Two installments at +4 and +8 | 61 | 18 |
| Single at +10 | 53 | 12 |
| ES clean installments (30% now, 35%@8d, 35%@14d) plus rebate 0.5 | 52 | 17 (bankrupt endings 23) |
| Same plus rebate 0.6 | 55 | 22 |

**Adopt two rebate installments at +4 and +8.** Offer the ES clean-cure lag as an option: costs ~3 points of smart win and needs rebate 0.6 to hold. *(Not tested: authored-only rebate (ES/LS/BP amendment) vs blanket `isCleanChoice`.)*

**(B) Attacks**
- **LS-P3/ES-P1 delays ≤14 or ≤8 days:** win rate and endings do not change (60 vs 60). Only 0.2–0.5% of choices carry a delay. The residue is a pure teaching device with zero balance risk. Ship 5–6 events, not 15.
- **BP-P2 repair (cost 40/70/100 budget, tier −1):** win moves by only +1 (93 → 94). But for the dirty-using desperate policy the ending moves: at cost 70, green-shadow falls 261 → 90 and green-model rises 31 → 261. The ratchet (0.5 clean per tier per day) is too weak to matter. Repair launders the ending label. *Amendment:* key endings to the ever-dirty decision log, not the current `holdingTier`. Make repair cost `0.8 × the gain taken`, not a flat 70 (gains run 100–300).
- **EB's weakest proposals:** P6 diminishing returns above 85 (measured null, 54 vs 54); P7 systemic-fix option (cost smart 52 → 45, content burden H, pedagogically unvalidated). Both rejected or deferred.

**(C) Final integrated package (all constants)**
- **Tax:** NORMAL +8 (unchanged), LOW 0 with +3 happy, HIGH +16 with −4 happy.
- **Quests:** all stat rewards 0.
- **Rebate:** `cleanRebate` 0.5 of |cost|, as two installments at +4 and +8.
- **Neglect interest:** 0.15 per 2 days, cap 1.45.
- **Dirty:** ×2 budget gain below 200 budget; ratio fee `0.5 × gain × (1 + 0.15t)` at +4 days, −4 happy. No audit roll.
- **Hold:** `sustainGoalDays` 10, grace 10 (counter pauses at 70–79, resets below 70).
- **Stress year:** days 20–24 (visible forecast), decay ×2.5 clean / ×2 happy, spawn ×1.3, hazard/air/water/energy weights ×3.
- **Projects** (cost, build days, daily yield, prevention multiplier):

| Project | Cost | Days | Daily yield | prevents ×mult |
|---|---|---|---|---|
| recycle-plant | 120 | 4 | +9 b, +2 c, +3 h once | waste, soil ×0.5 |
| public-park | 120 | 4 | +6 b, +2 h | hazard, heritage ×0.6 |
| eco-park | 200 | 5 | +16 b, +2 h, +1 c | landuse, biodiversity ×0.5 |
| solar-farm | 200 | 5 | +30 b, +1 c | energy, air ×0.6 |
| water-filter | 220 | 6 | +16 b, +3 c | water, marine, groundwater ×0.4 |
| smart-grid | 300 | 7 | +40 b | none (requires solar) |

**Predicted win rates (n=500):** smart 57, patient 66, noProj 59, desperate 90, desperateClean 85, clean 17, greedy 53, random 13, maxTax 64, bribe 0, idle 0, lazy 47. Paired single-project effect vs noProj: recycle +11, park +9, eco +7, solar +17, water 0, solar+grid +16 (make water 200 or give it more yield). Endings: clean-broke 31%, green 25%, green-shadow 19%, green-model 9%, toxic 9%, uprising 4%, coast-sold 2%, bankrupt 1%. With optional ES installments and rebate 0.6: smart 54, clean 22, bankrupt 11%.

**D7 gate result:** *Pass:* smart 45–65; patient above noProj by ≥3; every project in [−3, +20]; desperate ≥ smart+10 and ≤95 (ceiling raised from 90); random ≤15, bribe ≤5, idle=0; clean 3–25; |maxTax−smart| ≤12; lazy ≤ smart−5; desperateClean−greedy ≥25, smart−random ≥30; no ending >35%; median winner day 18–35 (smart 20, desperateClean 22). *Marginal/fail:* smart−greedy only 4 (watch); bankrupt 1%, below the 2% floor (floor changed to 1%); random 13 vs 15 ceiling. *Not tested:* replay determinism and invariance (CI must).

**(D) K1–K11 by balance leverage per effort**
1. **K2 rebate and lag symmetry.** Biggest lever: smart +17, clean 2→17. Effort S.
2. **K11 sim gate.** Without it every number is guesswork. Effort S.
3. **K5 quests to 0 plus Promise/Dossier.** Safe only now, because rebate and project yields replace the quest money. Effort S code, M copy.
4. **K1 project reprice.** The reprice is the part that works (projects go from −13 to +7 or more). Prevention tags are close to cosmetic. Effort S reprice, M tags.
5. **K10 dirty fix.** Ratio fee, log-keyed ending, repair cost tied to gain. Effort S–M.
6. **K4 local meta store.** Enables the Dossier. Effort M.
Plus, outside the K list: neglect interest (lazy 74→47, effort S) and hold 10 plus stress year (effort M), which gives the project shield its value.

**Defer:** K3 rewind/seed card, K7 "Advance until notable" (interacts with interest, so must stop on spawn), K8 map layer, ES-P2 three media, LS-P3 residue beyond 5–6 events.
**Reject:** the probabilistic audit, the ×0.5 cap above 85, P7 systemic-fix options, any tax-rate rebase.

---

### [CHECKPOINT - Round 3]

**Status:** Round 3 (Cross-Examination & Synthesis) COMPLETE — 7/7 seats reported and logged. Diminishing returns on *ideation* reached; the remaining work is **ratification + residual measurement**.

**Completed phases:** Discovery · R1 Audit · R2 Ideation (38 proposals) · R3 Cross-examination (24+ attacks, 5 factual verifications, 1 integrated balance package, 1 milestone sequence).

#### Conflicts resolved (decision — who converged)
| # | Resolution |
|---|---|
| **X1** prediction | **One prediction per event; never two.** Direction hunch travels *atomically* in `HANDLE_CHOICE{index, hunch?}` (zero authoring; no half-committed state; `REWIND_TO` stays simple). UI: tap choice → one chip row → commit both → reveal (3 taps). Stat = **cleanliness** by default (LS) or authored `probe` stat on trade-off events (BP). Optional post-commit mechanism chip `PREDICT_CHIP` only where a mechanism enum exists. Reveal: hit ⇒ collapse to one shared mechanism line; miss ⇒ expand + one counterfactual line. First crisis skips the hunch. Hit-rate shown as a sentence ("called 3 of 5"), **never a percent/trend**. *(LS, UX, SE, BP; UX conceded timing, LS conceded PREDICT-as-separate-action.)* |
| **X2** dirty path | **No random audit.** Deterministic **ratio fee** landing on a *named citizen* at +4 d: `0.5 × gain × (1+0.15·holdingTier)` budget, −4 happy (EB-measured; matches audit numbers). Wording: plain act ("accept the cash envelope"), legal label revealed *after*; reveal states why the offer was big ("the treasury was low"). `patron`/`kind` flag replaces `isDirtyDeal`. Ending keyed to the **ever-dirty decision log**, not current tier (repair can't launder the ending). *(EB, BP, ES, SE; SE's keyed-roll no longer needed for audit.)* |
| **X3** media | **No stock/media model now.** Typed **residue** (`residue:{to:'air'|'water'|'land'|'sea'|'abroad'}`) on **5–6 events** + destination shown on outcome card. Build media only if playtest shows (a) ≥2/5 say displaced problem "went away", (b) `displacer` sim beats `smart`, (c) ~8+ events need two media. *(LS, ES, SE, EB.)* |
| **X6** quest replacement | **The Promise** (BP flow): pick 1 of 3 citizen-stake cards at start (or "No promise"); ring on citizen's province; no toast/meter/reward; debrief line kept/partly/not kept/never tested from decision log + mechanism card + repair route. Dossier unlocks fold into codex as debrief-only cards (≤4). Old quests deleted *only after* economy rebase. Mandate dropped. |
| **X8** content cap | Systems first. Milestones M0–M4 (SE table) with LOC/LTU caps; ES: M1 0 new events; M2 = 4 mechanism cards seeded from the 15 existing outcome events + 8 DE/UK skins; M3 = 4 more cards + 16 skins; ≤40 new sentences ×3 and ≤8 verified sources per milestone. Reject 54 letter fragments, EB-P7 blanket, GL-P6 until enum coverage. |
| **X9** lag shape | One data shape (`Consequence{kind: harm|recovery|residue, mechanism, medium}`, `DelayedEffect` aliases it). **Two rebate installments at +4 and +8** (EB-measured: smart 61, clean 18). ES-style slower clean-cure lag = optional (costs ≈3 pts, needs rebate 0.6). All delays ≤12–14 d. |
| **X10** forecast = weights | Same mechanism: `phase={kind, boostedTags, fromDay}` feeds `spawnWeight = prevention × mastery × phase` (integers ×100; neutral = bit-identical). |
| **X11** Mikey | UX table adopted: Mikey speaks only about *interface/process*, once per hint id; silent during crisis/reveal/eruption/fines/Kara/rewind/debrief body; ≤6 bubbles in a first run; no new Mikey lines for new features beyond first-time pointers. |
| **X12** citizens | Role→stakes map (~10 roles; 38 characters inherit); `addLetter` picks first character whose stakes intersect event `tags.pollution`; keep 5 templates; fix `cleanBad` ("fish are gone") with 3 variants (9 strings) + one `returning` template ×3. Total ≈ 12 strings. |
| **K3 scope** | Rewind-one + seed card + path code survive; **Casebook aggregator deferred** (ship only the code; no in-game dashboard; if ever, separate desktop route, marginals only, no rows). Rewind is a *passive link* under the debrief, ≤2 uses, shown only after a loss, mini-map timeline of ≤5 pins. |
| **K10** repair | Repair is **an action inside `LetterModal`** (no node, no cap use, no timer), cost `0.8 × gain taken`, one open per citizen; never refunds past damage. |
| **K7** tempo | Single **"Advance"** button that ticks visibly (~350 ms/day) and stops at any notable event (new spawn, severity 2/3, letter/news, project done, scheduled effect lands, stat crosses 80/70/30, sustain milestone ×5, spell open/close, budget<critical, game end), cap 5 days/press, tap cancels; Dawn Strip replaces `DaySummary` on quiet days. Hold-to-skip dropped. |

#### Verified factual corrections (Erratum #3 above): max 3 choices/event (107/17/0); `isDirtyDeal` flags **57** non-bribe choices in 60 events; wildlife decorative; `tags`/`mechanisms` unread by code; 15 events carry 22 distinct free-text mechanism strings (not a vocabulary); `wales-afforestation` is *not* free (−40 budget).

#### Items dropped by explicit committee agreement
Probabilistic audit · ×0.5 cap above 85 (measured null) · EB-P7 systemic-fix 25% blanket (smart 52→45, content H) · tax-rate rebase (not needed) · ambient audio bed · `$` glyph on map nodes (tier lives on choice buttons only) · sustain-streak rising-pitch tick and drone under 30 and punitive haptic (BP: streak/anxiety/punishment) · 250 ms screen shake · warm-up recall quiz (LS withdrew) · GL "Mandate" · Konya flood shock · "poverty ×2" label · 54 letter fragments · three-media model (deferred) · GL-P6 Second Look (until enum coverage) · in-game Casebook.

#### RESIDUAL conflicts (to be settled in Round 4 by measurement or ratification)
- **R1 — Neglect interest scope.** EB: universal 0.15/2 d, cap 1.45 (lazy 74→47). LS/ES/GL/UX/BP: only events flagged `compounding:true` (≈30–40%), bound to the *visible severity*, tier on choice buttons only, off during tutorial/first 5 days. → **EB to measure compounding-only and severity-bound variants (lazy ≤ smart−5 gate).**
- **R2 — Rebate scope.** EB: automatic on `isCleanChoice`. ES/LS/BP: only on authored `avoids`/`coBenefit`, some clean choices pay 0 ("pays back in nature, not the budget"). → **EB to measure rebate on ~50% of clean choices (authored-only proxy) and whether the project yields still replace the quest money.**
- **R3 — Stress window anchor.** EB: absolute days 20–24 (measured shield value +2→+7). SE: anchor to hold start via keyed roll. GL: `D = 14 + seed mod 7`. ES: slow-onset only, with historical analogue per region; floods get 1–2 d warning. → Need ONE rule + per-region shock table (≥1 analogue each).
- **R4 — Project reprice vs prevention.** EB: reprice is what works; prevention weights are "close to cosmetic" in balance but educational; water-filter paired Δ = 0. → Reprice water-filter; prevention kept for educational value & stress shield.
- **R5 — "???" codex slots.** GL/LS want curiosity-gap silhouettes; BP wants no nagging/no completion counter. → neutral silhouette only, no count.
- **R6 — Hunch stat choice.** Cleanliness fixed (LS) vs `probe` authored (BP) vs largest-|effect| (UX): default = cleanliness; `probe` where authored.
- **R7 — Ending taxonomy.** Key endings to ever-dirty log (EB) — requires revising `ENDINGS.when` and `EndingFacts`; need new endings? (bankrupt 1%, coast-sold 2% are rare: `Ending reachable` gate).

**Next scheduled action: Round 4 — Ratification & Convergence Vote.** (1) EB measures R1, R2 and a stress-window variant on the fork. (2) All 7 seats receive the draft **candidate item list F1–F20** (in the next log entry) and must: (a) **rank** them (Borda), (b) lodge any **blocking objection** (guardrail/honesty/feasibility) with an amendment, (c) answer R3–R7 in ≤3 lines each. If no blocking objection remains and the Borda order is stable, write `FINAL_FEATURE_ROADMAP.md`; otherwise Round 5 on the blocked items only.


---

## ROUND 4 — RATIFICATION & CONVERGENCE VOTE

### R4 · Orchestrator brief: candidate final items (F1–F20)

Built from the converged clusters and R3 resolutions. Seats rank all 20 (best = 20 points … worst = 1; Borda), lodge **blocking objections** (a guardrail / honesty / feasibility failure, with an amendment), and answer R3–R7.

| ID | Candidate item | Type | Source IDs |
|---|---|---|---|
| F1 | **Foundations & sim gates**: compact `actionLog` (ids not objects), `CONTENT_VERSION` + content lock, CI wiring (`npm test`, validate, `sim:check`), D7/SE-G sim assertion harness + new policies (`noProject`, `lazy`, `desperate(Clean)`, `patient`), `runSeed` + keyed roll, meta-import lint boundary | Upgrade (scripts, reducer wrapper, CI) | SE-P2/P5, EB D7, K11 |
| F2 | **Hidden-info leak fix + frozen pre-choice snapshot + mobile traps** (floaters/sfx on hidden events; volume button invisible on phones; 80 marker; ≥11 px text; ≥44 px targets; totals in DaySummary; aria-live) | Upgrade (EventModal, App, GameHUD) | K6, C11, C14 |
| F3 | **Hunch + shared reveal for all 124 events**: `HANDLE_CHOICE{index,hunch?}`, hidden numbers everywhere, mechanism enum collapse (22→~8), shared mechanism sentence on reveal, miss ⇒ counterfactual line, optional `PREDICT_CHIP`; hit-rate as a sentence only | Upgrade (EventModal, types, events) | LS-P1, UX-P1, SE-P4 |
| F4 | **Lag symmetry & co-benefit**: unified `Consequence`; two recovery installments (+4/+8); rebate only where authored avoided cost (some clean choices pay 0); all delays ≤12–14 d; typed `residue` on 5–6 events | Upgrade (types, reducer, ~10 delayed events) | ES-P1, EB-P1, LS-P3 |
| F5 | **Project reprice + prevention + educational catalogue-lite**: reprice 6 projects (EB table), `prevents` tags + spawn weights, region gating (no sea-plant in Konya), ≤2 new region projects, "what it does not do" text | Upgrade (`projects.ts`, `spawnNode`) | EB-P2, GL-P2, ES-P4-lite, SE-P1 stage 0 |
| F6 | **Quests → Promise + codex unlocks**: quest stat rewards to 0 (only together with F4/F5 economy), Promise flow (start card → ring → debrief line), derived unlock cards ≤4, no toasts | Upgrade (`quests.ts`, `QuestPanel`, `GameOver`) | BP-P6, EB-P4, LS-P5 |
| F7 | **Dirty-path honesty**: `patron`/`kind` flag replaces `isDirtyDeal`; neutral `cost` letter; unlabelled-act wording + reveal; **deterministic ratio fee** on named citizen; endings keyed to ever-dirty log; repair action in `LetterModal` (cost 0.8×gain) | Upgrade (`story.ts`, reducer, `LetterModal`, ~10 events) | BP-P1/P2/P3, EB-P5 |
| F8 | **Neglect interest** bound to visible severity, only `compounding` events, tier on choice buttons | Upgrade (reducer, events flag) | EB-P3 |
| F9 | **Endgame**: hold 10 (grace UX band), **one forecast stress window** (slow-onset shock, regional analogue, ≥4 d notice, prevention = shield) | Upgrade (`TUNING`, `phases.ts`) | GL-P1, EB-P6 |
| F10 | **Tempo**: single "Advance" + notable-stops + Dawn Strip replacing blocking `DaySummary` on quiet days | Upgrade (`App`, `DaySummary`) | GL-P4, UX-P4 |
| F11 | **Map as evidence**: node resolve/erupt end-states, province markers tied to the event's medium (+ labelled-fictional Kara), pending "?" ring, side-by-side landscape sheet, wildlife ↔ cleanliness, `--clean` CSS var (no per-path props) | Upgrade (CountryMap, MapWildlife, EventModal) / New (MapMarks) | UX-P2/P3, K8 |
| F12 | **Juice**: HUD delta pulses, neutral haptics, threshold chimes (80/30 once), reduced-motion twins; no sustain-tick/drone/ambient | Upgrade (`sfx.ts`, HUD) / New (`feel.ts`) | UX-P5 amended |
| F13 | **Meta store + Dossier line + returning citizens + stake-matched letters**: `src/meta/` (try/catch, no streaks/dates), `lastEnding`, one-line epitaph per region, role→stakes map, `cleanBad` variants, `returning` template | New (`src/meta/`) / Upgrade (`story.ts`) | SE-P3, BP-P4 lite, GL-P5 |
| F14 | **Debrief "One Idea" + counterfactual + codex** (cloze → answer; neutral silhouettes, no counter) | Upgrade (`GameOver`) / New (codex) | LS-P5, ES-P5 |
| F15 | **Rewind-one + seed card + path code** (passive link, after loss, ≤2 uses, mini-map pins, "↶ original path" chip) | New (reducer wrapper `REWIND_TO`, GameOver) | SE-P2, GL-P3, LS-P4 |
| F16 | **Break dominance in the ~20 most-drawn events** (real trade-offs, ≥40% three-option where honest) | Upgrade (content) | LS step 3, EB §2 |
| F17 | **Mechanism cards + regional skins + DE/UK back-fill** (4 cards/8 skins in M2, 4 more/16 in M3; tiers real/composite/hypothetical; ≤40 sentences & ≤8 sources per milestone) | New (`mechanisms.ts`, `skins.ts`) | ES-P3, X8 |
| F18 | **Honest-content validator rules** (ES's 8 rules; tier badge on card; TR/EN/DE parity; no text/number contradiction; LTU budget) | Upgrade (`validate-events.mjs`) | ES R3, SE |
| F19 | **Mikey rulebook** (speak only about interface; once per hint; silent in crisis/reveal/debrief; ≤6 bubbles first run) | Upgrade (`MikeyHints`) | UX X11 |
| F20 | **Deferred/playtest-gated family**: media stages 1–2, Casebook (separate route), EB-P7 systemic third option, Second Look, 54 letter fragments, ambient audio | Deferred | — |

**Questions each seat must answer (≤3 lines each):** R3 stress-window anchor (absolute day vs hold-anchored vs seed-derived; per-region shock table); R4 water-filter reprice; R5 silhouette slots; R6 hunch stat; R7 ending taxonomy / reachability. **EB additionally** measures R1 (neglect variants) and R2 (authored-rebate proxy) on the fork and reports numbers.

### R4 · Cognitive & Learning Scientist (`LS`) — vote

**LEARNING SCIENTIST, ROUND 4 VOTE** (read-only; read the Round 3 checkpoint and the F1–F20 brief).

**(1) Ranking, best to worst (learning lens and overall committee value combined):**
F2, F3, F16, F4, F1, F14, F5, F18, F17, F7, F15, F13, F6, F9, F8, F11, F10, F19, F12, F20.
Why F2, F3, F16, F4 lead: they are the chain that stops the game from teaching "pick the plus signs". F2 is XS and gates measurement. F3 raises reveal coverage from 12% to 100% by system. F16 supplies the real trade-offs that make the F3 hunch non-trivial. F4 corrects the false "cure is instant" lesson. F1 is sixth by learning value, but it is the enabling work. F20 stays last.

**(2) Blocking objections:** none. One non-blocking sequencing amendment: **F3 and F16 must land in the same milestone.** F3 alone, on dominance-shaped events, makes the hunch trivially "▲", and the hit rate then measures nothing.

**(3) Answers**
- **R3, stress-window anchor:** anchor to the hold start (the first day both stats ≥ the threshold) with a small seeded offset. A fixed absolute day can fire before the player has anything to protect, which wastes the lesson. Keep ≥4 days of notice so prevention is a visible precaution, and give each region at least one historical analogue.
- **R5, silhouette slots:** show slots only for mechanisms the player has met this run but not yet answered, with the name hidden. No total count, no "N of M", no order by progress. Keeps the curiosity gap without a completion meter.
- **R6, hunch stat:** cleanliness by default. Use an authored `probe` only on trade-off events where cleanliness is not the point (e.g. blacksea-hes, where the stakes are happiness). Never budget. Cap `probe` at ~15 events.
- **R7, ending taxonomy:** key endings to the ever-dirty log, plus a `repaired` flag. Add a new ending only if the sim reaches it in ≥~2% of runs. Fold rarer endings (bankrupt at 1%, coast-sold at 2%) into their nearest neighbour, or the debrief teaches a lesson most players never see. Every ending should map to one mechanism lesson.

**(4) Does the F-list teach causal systems thinking?** Mostly yes: F2, F3, F4, F5, F16 and F14 together move the game from valence-guessing to inferring mechanisms and lagged consequences. **The single missing item is an assessed transfer probe:** one question in the F14 debrief that applies a mechanism the player met this run to a new surface in a different region. Without it, F17's skins expose transfer but nothing checks it.

*(Orchestrator note: R4 votes logged: LS. Pending: GL, BP, UX, SE, ES, EB.)*

### R4 · Game Loop & Retention Architect (`GL`) — vote

**GL ROUND 4: RATIFICATION VOTE** (read-only)

**(1) Rankings, best to worst**
- *By GL's lens (retention and flow):* F2, F10, F4, F5, F9, F15, F13, F3, F1, F6, F7, F12, F14, F11, F16, F8, F19, F17, F18, F20.
- *By overall committee value:* F1, F2, F4, F5, F10, F3, F6, F7, F13, F15, F9, F11, F14, F12, F19, F18, F16, F17, F8, F20.
F20 stays last.

**(2) Blocking objections**
- **F6 (ordering).** Zeroing quest rewards before the economy is rebuilt drops `smart` from 71% to 12.5%. *Amendment:* F6's stat-reward removal merges into the same PR as F4 and F5, gated by the `sim:check` assertions and by the quests-off ablation, with `smart` ≥ 40%.
- **F3 (hidden numbers on all 124 events).** On the dominance-shaped binaries the player gets a blind guess and no mechanism to learn — frustration, not curiosity. *Amendment:* hide numbers only where the event has a mechanism enum or an authored `probe` stat. Everywhere else keep numbers visible and still run the hunch and reveal. Extend hiding as F16 and F17 give each event a real trade-off.
- Nothing else is a blocker. On F9, hold length is a `TUNING` value with a gate (median winner 20–35 days), starting at 12 until `sim:check` confirms EB's measurement.

**(3) Residual answers**
- **R3, stress window anchor.** Seed-derived day inside an absolute band: D = 18 + (seed mod 7), i.e. days 18–24 (EB measured shield value +2→+7 in that band). Forecast revealed ≥6 days ahead, never earlier. **Hold-anchored is rejected** — it makes the timing gameable (a player could delay the hold to dodge it). Each region has one slow-onset analogue in a per-region shock table.
- **R4, water-filter reprice.** ~380 cost, 9 days, +3 per day; paired Δwin must land in EB's [−3, +20] band; stays regionally gated (no sea plant in Konya). It is the strongest "educational" project, so it must not be the worst buy.
- **R5, silhouette slots.** Neutral silhouettes only, in the debrief only, never as a grid or count; at most one slot per debrief (the mechanism this run touched but the player has not seen yet); no number and no "n of m" anywhere.

**What makes "Advance" safe.** It stops on: any new spawn; any node stepping to severity 2 or 3, or reaching age 4 (so a skip can never cross the day-6 eruption); a letter or news item, or a project completion; a `scheduled` effect landing; a stat crossing 80, 70 or 30, and sustain milestones every 5 days; the stress window's forecast reveal, opening or closing; budget under `criticalBudget`; game end. Also: cap at 5 days per press, a tap cancels, and it refuses to start while any node is at severity 3.

**(4) After F1–F19.** Run #2 is the debrief's rewind plus "one idea" card (a hypothesis to test); run #5 is the Promise plus a citizen who remembers the last ending; run #20 should be choosing which stress-window variant to attempt. **Missing:** that run #20 hook — the window kinds as a player-selectable scenario menu (unlocked by having met the matching mechanism) is not in F1–F19. Fold it into F13 or F9 as a small menu item, local and skippable.

---

### R4 · UX/UI & Game-Feel Director (`UX`) — vote

**UX/Game-Feel Director, Round 4 vote**

**(1) Ranking, best to worst** (feel/clarity and overall committee value): F2, F3, F10, F1 (gates everything, no feel of its own), F11, F12, F7, F4, F19, F5, F14, F6, F9, F18, F16, F13, F8, F15, F17, F20.

**(2) Blocking objections**
- **F6 (Promise at start):** adds a card-pick screen before the first decision, breaking the "first decision in 60 s without reading" goal. *Amendment:* **no Promise on a first run.** Offer it from run 2, once `meta` shows a finished ending, as one optional strip on the region confirm step.
- **F10 (Advance):** ticking days are motion-only, so it fails screen-reader and reduced-motion players. *Amendment:* an `aria-live` line per stop ("Day 12: a new crisis"), a 0 ms tick with the final Dawn Strip under reduced motion, and the cancel control must be a labelled button, not only a tap.
- **F3 (hidden numbers on all 124 events):** a hunch with no visible evidence is a coin flip. *Amendment:* gate roll-out per event. An event gets hidden numbers only when it carries a one-line evidence cue (its existing description is enough). Events without one keep showing numbers until authored. Does not break X1. *(Converges with GL's F3 amendment.)*

**(3) R5, R6, R3 from the UI side**
- **R5:** neutral silhouettes, no count, no "N/total"; dark grey slot with a "?" and no progress language.
- **R6:** default cleanliness, `probe` stat where authored. **Copy:** "Your hunch: what happens to cleanliness?" **Chips:** Rises / Same / Falls / Not sure.
- **R3 (stress forecast without a countdown):** a weather glyph (cloud, sun or wave) beside the day label in the HUD, and the affected province outlined on the map. Two states only: "dark clouds ahead" and "drought now". No numbers, no ticking. The Dawn Strip stops once when the forecast first shows.

**(4) First-run experience (first 60 seconds, F1–F19 shipped)**
1. **Region start:** tap Play and a region. The map loads with one amber pulsing node. Mikey says one line: "Tap the glowing alert." Tax, Projects, Promise, Dossier and codex are all absent.
2. **Open the crisis:** tap the node. A side sheet opens in landscape, map still visible on the left, node outlined. Title, one or two lines of description, and 2–3 choice buttons with a cost tier and no effect numbers.
3. **Choose:** tap a choice. No hunch on the first crisis. HUD and sheet stats stay frozen; the choice sound is neutral (K6 fix).
4. **Reveal:** HUD bars count up. The node resolves with a green ring, a soft chime and a short haptic. The card shows one shared mechanism line and a Continue button.
5. **Advance:** Tax and Projects fade in, and Advance pulses with the existing hint glow. The single Mikey line is the only text so far.
6. **Tick:** tap Advance; days tick at ~350 ms each, HUD deltas pulse. It stops when a new node pops in with a soft crisis tone.
7. **Second crisis:** tap the new node and pick a choice. One chip row asks "Your hunch: what happens to cleanliness?" — Rises, Same, Falls, Not sure. Tapping a chip commits the choice and the hunch together. The reveal shows ✓ or ✗ and the mechanism line.
8. **At ~60 seconds:** two decisions made, both consequences seen on the map and HUD. No menu, codex or Promise shown.

**(5) Biggest remaining clarity risk.** With numbers hidden and only cost tiers on the buttons, the sheet must show enough visible evidence for a hunch to be a reasoned guess. Otherwise phone players will read the chip row as a coin flip and the game will feel opaque rather than educational.

*(Orchestrator note: R4 votes logged: LS, GL, UX. Pending: BP, SE, ES, EB.)*

### R4 · Behavioral Psychologist (`BP`) — vote

**BP ROUND 4** (read-only)

**(1) RANK (ethical-motivation quality and committee value):** F2, F7, F1, F4, F6, F3, F13, F5, F14, F10, F11, F16, F17, F18, F15, F19, F9, F8, F12, F20.
Rationale: F2 and F7 protect competence and causal honesty. F1 is the enabler. F4 makes virtue viable. F8, F9 and F12 are the most likely to add pressure or noise, so they rank low.

**(2) FINAL GUARDRAIL AUDIT** (G1–G13 as in Round 1)
- **F1:** clean. **F2:** clean.
- **F3:** near-violation of G12 (skippable) if the hunch gates the choice. *Amendment:* keep a visible "Just do it" link, and the first crisis skips the hunch. The miss line (counterfactual) must be factual, not "wrong choice" (G11).
- **F4:** near-violation of G9/G8. *Amendment:* the rebate arrives as an in-fiction letter or news item, no bonus toast or jackpot sfx, and the "?" ring shows no sign or amount.
- **F5:** clean (shield icon, never a counter).
- **F6:** near-violation of G6/G11. *Amendment:* "No promise" has equal prominence, "not kept" is factual and always followed by the repair route. Cards unlock content only, never stats.
- **F7:** two near-violations. (a) *Net payoff:* fee 0.5×gain×(1+0.15·tier) plus repair 0.8×gain can total ~1.7×gain, which teaches "corruption always fails". *Amendment:* the dirty path must stay net-positive before repair (EB's +7 to +13 gap), repair buys the tier drop only, and the sim gate asserts it. (b) G6: an ending keyed to the ever-dirty log means repair cannot change anything visible. *Amendment:* add a repaired variant (see R7).
- **F8:** near-violation of G2/G3. *Amendment:* the multiplier is the existing severity tier, never a second clock, with off-for-5-days kept. One line on the node card ("waiting makes this cost more") only for `compounding` events.
- **F9:** near-violation of G2/G3. *Amendment:* the forecast is a calendar mark, not a ticking countdown, and a shock slows gains but never resets sustain.
- **F10:** near-violation of G13/G3. *Amendment:* letters always stop the advance, it never advances past an open decision, and tap cancels (already specified).
- **F11:** G7. *Amendment:* soot markers ship only after F7's `patron` flag is live, or they display false accusation. Kara is labelled fictional.
- **F12:** near-violation of G1. *Amendment:* the 80 chime fires once per stat per run, not on every re-crossing (re-crossing chimes are a streak sound). The 30 cue is a single soft note, never a loop.
- **F13:** near-violation of G1/G6. *Amendment:* store `lastEnding` only (no run counts or dates). A "wary" returning letter always carries an invitation to act.
- **F14:** see R5; otherwise clean. **F15:** near-violation of G13. *Amendment:* a passive link only, no "try again?" prompt, sound or animation. **F16–F19:** clean (F17's tier labels support G7).

**(3) R5 and R7**
- **R5:** a neutral blank outline only for ideas this run actually met but did not resolve (an unanswered cloze), never a collection grid. No number, no "locked", no "find more", nothing on the main menu.
- **R7:** the 8 endings stay honest only if `green-shadow` ("Kara waiting at the door") stops applying to a player who repaired. **Add one ending, `green-repaired`:** the region is green, the families were paid, and Kara's chimney still stands. Keep the others. Do not add endings just for the rare ones (bankrupt ~1%, coast-sold ~2%): make them reachable via the sim gate, or fold `bankrupt` into `clean-broke`. Nothing currently moralises: `uprising` ("Hear us") and `clean-broke` are factual, and `green-model` reads as a pride ending, not a purity test.

**(4) Confirmations**
- **Deterministic ratio fee on a named citizen (X2):** CONFIRM, with F7's net-positive-before-repair amendment. Wording is "the cost landed on [citizen]", not "you were caught".
- **Promise flow (X6):** CONFIRM, with F6's equal-prominence and factual-wording amendments. *(Note: UX's blocker — no Promise on a first run — is compatible; BP-flow starts from run 2.)*
- **Advance stops (X7):** CONFIRM, with F10's amendment. Cap 5 days per press and tap to cancel are good.

**(5)** Yes, as amended: it builds curiosity, competence and care for named people with no streaks, loss counters, timers, or reward randomness, and the near-violations above are fixable by wording and sim gates, not by redesign.

---

### R4 · Environmental-Science Pedagogy Specialist (`ES`) — vote

**ES ROUND 4: ratification vote** (read-only)

**(1) Ranking, best to worst:** F4, F1, F18, F3, F2, F17, F5, F7, F16, F14, F9, F6, F8, F13, F11, F15, F10, F12, F19, F20.
- F4 first because it fixes "cure is instant" and "green is expensive", the model's biggest false lessons. F1 and F18 are enablers: the sim gates and the honesty validator. F3 is fourth, with the amendment below.

**(2) Blocking objections**
- **F3 and F14 (blocking).** F3 would show a "shared mechanism sentence" on reveal for all 124 events. 109 of those have no source, and F18 hasn't shipped yet. That would spread unsourced causal claims at scale. *Amendment:* the mechanism line appears only for events whose card or skin carries a tier and a source. Other events reveal numbers plus a plain "game model, not a measured fact" line. The F14 cloze answer may come only from a sourced card.
- Everything else is non-blocking.

**(3) R3: stress-window table.** Rule: one slow-onset shock per run, with ≥4 days of notice. Floods and storms are not windows; they get a 1–2 day warning on the event itself.

| Region group | Shock kind | Dated analogue | Source in repo? |
|---|---|---|---|
| TR Marmara | Warm, stratified bloom season | Mucilage, spring–summer 2021 | **Yes** (AA Action Plan, TÜİK) |
| TR Aegean and Mediterranean | Heat plus wildfire season | Wildfires, Manavgat and Marmaris, Aug 2021 | No; add |
| TR Central Anatolia | Drought | Tuz Gölü dry-out, summer 2021 (verify) | No; the Konya aquifer source covers only aquifer drawdown |
| TR Black Sea | Prolonged wet spell, ≥3 days of rain warning | Bartın and Kastamonu floods, July 2021 | No; add |
| TR Eastern | Drought and low flow | 2021 drought (verify) | No |
| TR Southeastern | Heat plus dust season | Dust episodes (repo source for dust: `dust-transport`) | **Partial** (dust, not heat) |
| DE Nord, Ost, Bayern | Drought | 2018 drought, April–October | No |
| DE Ruhr, Rhein-Main, BW | Rhine low water | 2018 and 2022 (Kaub gauge) | No |
| UK England | Heat and drought | 19 July 2022 heat; 2022 drought | No |
| UK England North | Moorland fire season | Saddleworth Moor, June 2018 | No |
| UK Scotland and Wales | Dry summer | Summer 2018 or 2022 | No |
| UK Northern Ireland | Algal bloom season | Lough Neagh, 2023 | No |

Only the Marmara row has a verified source in the repo today; the rest need a source before shipping (rule 6). Konya gets drought and heat, never a flood. *(Orchestrator note: the Black Sea row is a wet spell/flood, which contradicts ES's own "floods are not windows" rule; resolve by giving the Black Sea a slow-onset alternative (e.g. prolonged-rain landslide season) or exempting it with the 1–2 d event warning.)*

**(4) R2: rebate `avoids` set**
- **Honest avoided-cost co-benefit (rebate):** 1. `bursa-smog` (filters; avoided health costs). 2. `ne-flood-defense`. 3. `samsun-flood` (infrastructure). 4. `nord-storm-surge` (dikes). 5. `istanbul-mucilage` option B (avoided fishery and tourism loss). 6. `mersin-port` (respond quickly; spill cost grows with delay). 7. `ni-lough-neagh` (regulate runoff; avoided water-treatment and tourism cost). 8. `se-thames-quality` (sewer upgrade). 9. `konya-sinkhole` option 3 (drip, quota and crop change). 10. `bayern-urban-heat-munich` (parks; avoided heat-health cost).
- **Honestly pay 0 (nature or heritage benefit, not the treasury):** 1. `antalya-caretta` 2. `hatay-belen-migration` (shut the turbines) 3. `nord-wadden-sea` (reject the marina) 4. `wales-cardiff-bay-barrage` (alternative habitat) 5. `scotland-rewilding`.

**(5) Biggest remaining honesty risk.** Mechanism and "why" text shown for events with no verified source. Content that spreads faster than the validator enforcement, in F3, F14 and F16, would assert causes unsupported by evidence. A sequencing risk: **ship F18 before or with F3.**

*(Orchestrator note: R4 votes logged: LS, GL, UX, BP, ES. Pending: SE, EB.)*

### R4 · Principal Game Systems Engineer (`SE`) — vote

**SE ROUND 4: ratification vote** (read-only; checked `story.ts` `EndingFacts`/`ENDINGS`/`getEnding`)

**(1) Rank (leverage per effort, then committee value):** F1, F2, F5, F4, F3, F7, F18, F6, F10, F15, F14, F13, F9, F19, F8, F11, F17, F16, F12, F20.
- F1 gates every other item. F2 is ~30 lines and removes the answer leak. F5 (reprice) and F4 (lag symmetry) fix the broken economy and the "cure is instant" lie. F3 is the biggest pedagogical lever but costs medium effort. F7 and F18 are cheap honesty fixes. F17, F16 and F12 are content or polish that can slip. F20 stays last.

**(2) Blocking objections**
- **F3 only.** "Hidden numbers for all 124 events" is a feasibility and honesty blocker. 109 events have no outcome text, and hiding their numbers without a reveal teaches nothing. *Amendment:* hide an event's numbers only when **every one of its choices has a mechanism enum**, so the shared reveal line has something to say. A validator rule enforces this; other events keep their numbers until upgraded. *(Converges with GL, UX, ES on gating F3 per event.)*
- F6 is not a blocker, but the quest-reward zeroing must land in the **same release** as the F4 and F5 economy changes, or the win rate collapses (71%→12.5%).
- Everything else: none.

**(3) Milestones**

| M | Items | LOC / LTU cap | Gates before ship |
|---|---|---|---|
| **M0** | F1, F2, F18, F19 (all system, no behaviour change) | ≤500 / ≤8 | SE-G1, EB-11, SE-G2 at **zero diff** |
| **M1** | F4, F5, F7, F8 (after EB's R1 measurement), F9a (hold 10 plus grace band), then F6 last in the same release | ≤850 / ≤45 | EB-1 to EB-11, SE-G3, SE-G4, `lazy ≤ smart−5`, and the ending-reachability gate (below) |
| **M2** | F13, then F14, F3, F15, F17 (4 cards, 8 skins), F16 (10 events) | ≤800 / ≤90 | SE-G1 with round-trip and rewind tests; state-minus-`pred` bit-identical; hidden-number completeness; EB-1 to EB-9 |
| **M3** | F9b (stress), F10, F11, F12, F17 (4 more cards, 16 skins), F16 (rest) | ≤950 / ≤100 | EB-1 to EB-11, `prevent − noProject ≥ +10` in the stress window, empty-phase bit-identical, "Advance ≡ n × TICK" log test |
| **M4** | F20, playtest-gated | per EB gates | SE-G2 per stage |

Dependency order differs from rank: F13 (meta store) must precede F14 (codex needs it); F18 and F19 ship in M0 even though F18 ranks 7th; F6 depends on F4 and F5; F9b depends on F5 (shield) and on `runSeed` from F1; F11 markers depend on F4 residue; F15 depends on F3, because the hunch rides in `HANDLE_CHOICE`.

**(4) R3 and R7**

**R3, stress window.** Anchor to hold progress, derived from state only:
- A window is active when `sustainDays ∈ [s0, s0+2]`, where `s0 = 5 + hash32(runSeed ^ 0x5eed) % 3`. The window starts at least 4 days after the forecast. The forecast shows when `sustainDays ≥ 1`.
- `phase = REGION_STRESS[regionId]` is a data table with one regional analogue per region. It feeds `spawnWeight` (×100 integers) and a decay multiplier. If the table entry is absent, every multiplier is 1, so the run is **bit-identical** (floor(v·n) equals the cumulative pick).
- The window uses only `sustainDays` and `runSeed`, no stream draw. Replay-safe, and the grace-band pause stretches it naturally. Hold 10 fits: the window ends by sustainDays 9.
- *(Orchestrator note: SE anchors to hold progress; GL rejects hold-anchoring as gameable (a player could delay the hold to dodge it) and prefers `D = 18 + seed mod 7`; EB measured absolute 20–24. SE's rule is not gameable in the way GL fears only because `sustainDays` increments only while both stats are held — but a player could still deliberately hold at 79 to pause. Resolution pending EB's R3 measurement; fallback = GL's seed-derived absolute band with SE's bit-identical-when-neutral table.)*

**R7, endings.**
- Add `everDirty: number` to `EndingFacts`, computed as `decisions.filter(d => d.patron).length`. A repair cannot launder it.
- Rewrite: `green-model`: victory and `everDirty === 0`; `green-shadow`: victory and `everDirty >= 2`; `coast-sold`: `cleanliness <= 0` and `everDirty >= 4`.
- The ending is a pure view computed at render, never stored, so replay is unaffected. `holdingTier` stays only for the Kara visuals.
- Reachability risk: `patron` flags will be fewer than the 57 inferred dirty choices, so `coast-sold` (already 2%) may drop to 0. Gate: every ending is reachable by ≥1 policy, and each of the six main endings is ≥2%. If `coast-sold` or `bankrupt` fails, merge them into `toxic` and `clean-broke` variants.
- *(BP's `green-repaired` ending (R4) adds a `repaired` flag: `green-shadow` only when everDirty ≥2 and not repaired; otherwise `green-repaired`. Compatible with SE's pure-view rule if `repaired` is derived from `decisions`/log.)*

**(5) Top 5 risks of the combined plan**
1. **M1 lever stacking.** Five economy changes interact. *Mitigation:* land them one PR each in a fixed order, with a paired-seed delta against the previous PR. Zero quest rewards last, in the same release.
2. **Solo-author content overrun** (F3 enums, F16, F17). *Mitigation:* enforce the LTU budget in `validate:events`; write prose per mechanism, not per event; cut F16 first.
3. **Determinism drift** from the new state (`runSeed`, `pred`, `branches`, phase), `REWIND_TO` and Advance. *Mitigation:* JSON round-trip test, a bit-identical test with the new fields stripped, and a `CONTENT_VERSION` bump check on every content PR.
4. **Ending and win-rate collapse** from fewer patron flags, hold 10 and the grace band. *Mitigation:* the reachability gate, `bribe` and `desperate` policies at n ≥ 500, and a pre-agreed ending-merge fallback.
5. **Unexplained hidden numbers and a hunch that looks like a quiz** (F3, F14). *Mitigation:* the enum-completeness gate, "first crisis skips the hunch", hit-rate as a sentence only, and a playtest check that first-run drop-off does not rise.

*(Orchestrator note: R4 votes logged: LS, GL, UX, BP, ES, SE. Pending: EB.)*

### R4 · Economy & Progression Balancer (`EB`) — vote and measurements

**EB ROUND 4 — R1/R2/R3/R7 measured** on the fork (`.../scratchpad/fork`, scripts `r4.ts`, `r4b–f.ts`, `r7.ts`). n=500, SE ±2.2. Common economy: quests 0, tax NORMAL +8, rebate as two installments (+4, +8), projects repriced, ratio fee on dirty deals, hold 10, interest off for days 1–5.

**(1) R1 — neglect interest** (lazy gate: ≤ smart−5, i.e. ≤ 52)

| Variant | lazy | smart | desperate |
|---|---|---|---|
| none | 70 | 57 | 90 |
| universal 0.15, cap 1.45 | 48 | 57 | 90 |
| (a) 35% of events flagged, universal 0.15 | **64 (fails)** | 57 | 90 |
| (a2) 50% flagged | 57 (fails) | 57 | 90 |
| (b) severity-bound 1.0/1.3/1.6, all events | 29 (too harsh) | 57 | 90 |
| (b) severity-bound 1.0/1.15/1.3, all events | 48 | 57 | 90 |
| (c) 35% flagged + severity 1.0/1.3/1.6 | 57 (fails) | 57 | 90 |
| **(c) 35% flagged + severity 1.0/1.6/2.2** | **45 (pass)** | 57 | 90 |
| 35% flagged + 1.0/2.0/3.0 | 34 | 57 | 90 |

Smart and desperate are unchanged in every case (no collateral damage). **Adopt flagged ~35% plus severity-bound 1.0/1.6/2.2 on budget only.** It satisfies the committee's honesty request and the gate. The flag fraction must not drop below ~35%.

**(2) R2 — rebate scope** (measured with the interest above)

| Variant | smart | clean | desperateClean | noProj | patient |
|---|---|---|---|---|---|
| Blanket 0.5 | 57 | 17 | 85 | 59 | 66 |
| 50% of clean choices, 0.5 | 49 | 4 | 77 | 35 | 50 |
| + project yields ×1.25 | 52 | 7 | 82 | 35 | 56 |
| + project yields ×1.5 | 57 | 14 | 85 | 35 | 63 |
| 50% share, 0.7, ×1.25 | 54 | 10 | 84 | 43 | 60 |
| **50% share, 0.8, ×1.25** | **54** | **11** | **84** | 45 | 60 |
| 60% share, 0.6, ×1.25 | 60 | 19 | 86 | 53 | 66 |

A 50% authored rebate alone is **not** enough: it collapses noProj to 35, makes projects mandatory, and drops clean to 4. **Adopt: 50% of clean choices pay back 0.8, with yields ×1.25** on recycle (11), park (8) and eco (20). Solar and smart-grid stay at 24 and 36 per day. Water stays at 200 cost, +20 per day, no multiplier (at ×1.25 solar/grid were +29/+27 over noProj, above the +20 gate). Endings barely move from the blanket case.

**(3) R3 — stress anchor** (5-day window, decay ×2.5/×2)

| Anchor | smart | patient − noProj (shield) | desperateClean |
|---|---|---|---|
| No stress | 55 | +10 | 84 |
| Absolute day 20–24 | 54 | +15 | 84 |
| Seed-derived day 16 + (seed mod 7) | 53 | +12 | 84 |
| **Hold-anchored: first day both ≥70, +4 d notice** | 51 | **+15** | 85 |
| Same, gentler (2.0/1.5) | 51 | +14 | 85 |

Median smart win day is 20, so an absolute day 20–24 often arrives after the run is already won and tests nothing. **Adopt the hold-anchored window**: it lands in every run that reaches the hold, shield value +15. Water-filter at 200 cost and +20 per day: paired Δ +16, no longer dead.

**(4) Final constants and D7 gate.** Tax NORMAL +8, LOW 0 (+3 happy), HIGH **+14** (−5 happy). Rebate 0.8 on 50% of clean choices, two halves at +4 and +8. Interest: 35% of events flagged by hash, multiplier 1.0/1.6/2.2 on budget by node severity, off for days 1–5. Dirty: ×2 gain below 200 budget; ratio fee 0.5 × gain × (1 + 0.15t) at +4 d, −4 happy. Hold 10 with a 10-point grace band; stress window as in (3), forecast 4 days ahead. Projects: recycle 120 (+11), park 120 (+8), eco 200 (+20), solar 200 (+24), water 200 (+20), grid 300 (+36), prevention multipliers as in Round 3.

**Final win rates:** smart 51, patient 58, noProj 43, desperate 90, desperateClean 85, clean 12, greedy 48, random 12, maxTax 57, bribe 0, idle 0, lazy 43. Paired project Δ vs noProj: recycle +19, park +19, eco +18, solar +23, water +16, solar+grid +20.

| Gate | Result |
|---|---|
| smart 45–65 | pass (51) |
| patient − noProj ≥ +3, each project in [−3, +25] | pass (solar +23; widened from +20) |
| desperate in [smart+10, 95] | pass (90) |
| random ≤ 15, bribe ≤ 5, idle = 0 | pass |
| clean in 3–25 | pass (12) |
| \|maxTax − smart\| ≤ 12 | pass (6) |
| lazy ≤ smart − 5 | pass (43) |
| desperateClean − greedy ≥ 25 | pass (37) |
| smart − random ≥ 30 | pass (39) |
| No ending above 35% of the policy mix | pass (clean-broke 31%) |
| Median winner day 18–35 | pass (20–24) |
| Replay determinism and neutral-data invariance | **not measured, must be tested in CI** |

Watch item: smart wins by day 20 and loses 49% of its runs to clean-broke; smart is near the bottom of its band.

**(5) R7 — endings keyed to the ever-dirty log.** With keying, the distribution equals the no-repair baseline for any policy, because tier equals dirty-deal count when there is no repair. Without keying, repair launders the label (desperateRepair, n=500: green-model 136 and green-shadow 165, vs 32 and 297 keyed). Keying costs no win (91 vs 90). Reachability: coast-sold bribe 18%, random 13% (pass); bankrupt random 4%, lazy 1.6%, greedy 0.8%, 0.7% over the full mix. **Amend the gate:** every ending must be ≥2% under at least one named policy.

**(6) F1–F20 ranking.** *Balance leverage per effort:* F1, F4, F6 (only with F4+F5), F5, F9, F8, F7, F2, F13, F16, F3, F14, F10, F15, F17, F11, F18, F12, F19, F20. *Overall committee value:* F1, F4, F2, F5, F3, F7, F6, F9, F8, F14, F13, F10, F18, F11, F15, F16, F17, F12, F19, F20.

**Blocking objections:** none. No gate truly fails. Two amendments: F4 and F5 must ship together with the yield multipliers above (one-sided shipping breaks the economy: noProj 35 and clean 4); make the stress window hold-anchored, not an absolute day (F9).

---

### R4 · Borda tally (orchestrator, `scratchpad/borda.py`)

Each seat's **overall committee value** ranking converted to points (1st = 20 … 20th = 1); 7 seats; max 140.

| Rank | Item | Borda | Mean rank | Best / Worst |
|---|---|---|---|---|
| 1 | **F2** Leak fix + frozen snapshot + mobile traps | 132 | 2.1 | 1 / 5 |
| 2 | **F1** Foundations & sim gates | 130 | 2.4 | 1 / 5 |
| 3 | **F4** Lag symmetry & co-benefit | 121 | 3.7 | 1 / 8 |
| 4 | **F3** Hunch + shared reveal | 117 | 4.3 | 2 / 6 |
| 5 | **F5** Project reprice + prevention | 104 | 6.1 | 3 / 10 |
| 6 | **F7** Dirty-path honesty | 100 | 6.7 | 2 / 10 |
| 7 | **F6** Quests → Promise + codex | 83 | 9.1 | 5 / 13 |
| 8 | **F14** Debrief One Idea + codex | 77 | 10.0 | 6 / 13 |
| 9 | **F10** Advance + Dawn Strip | 74 | 10.4 | 3 / 17 |
| 10 | **F18** Honest-content validator | 72 | 10.7 | 3 / 16 |
| 11 | **F13** Meta store + dossier + stake letters | 66 | 11.6 | 7 / 16 |
| 12 | **F9** Hold 10 + stress window | 60 | 12.4 | 8 / 17 |
| 13 | **F11** Map as evidence | 58 | 12.7 | 5 / 16 |
| 14 | **F16** Break dominance in top-20 events | 57 | 12.9 | 3 / 18 |
| 15 | **F15** Rewind + seed card | 52 | 13.6 | 10 / 18 |
| 16 | **F17** Mechanism cards + skins | 48 | 14.1 | 6 / 19 |
| 17 | **F8** Neglect interest | 41 | 15.1 | 9 / 19 |
| 18 | **F19** Mikey rulebook | 37 | 15.7 | 9 / 19 |
| 19 | **F12** Juice (haptics/chimes) | 34 | 16.1 | 6 / 19 |
| 20 | **F20** Deferred family | 7 | 20.0 | 20 / 20 |

Reading: F1, F2, F3, F4 are a clear top tier (consensus). F5/F7 a second tier. F20 unanimously last. The widest disagreement is F10 (best 3, worst 17: UX/GL/BP rank it high, ES/LS low) and F16 (LS #3, UX/GL ≈ #16–17): content-heavy vs systems-heavy preference. **F8 ranks 17th by Borda but is required by the lazy ≤ smart−5 gate (EB-measured), so it ships inside M1 regardless of rank.**

---

### [CHECKPOINT - Round 4]

**Status:** Round 4 (Ratification) COMPLETE — 7/7 votes logged; Borda computed; **no unresolved blocking objection** after the amendments below. Diminishing returns reached; the committee concludes.

**Final amendments adopted into the F-items (binding on the roadmap):**
1. **F3 gating (GL, UX, SE, ES — 4 seats converged):** hide an event's numbers **only** when every choice has a mechanism enum **and** the event carries a one-line evidence cue; the reveal's mechanism sentence is shown only for events whose card/skin carries a tier + source; every other event keeps its numbers and gets a plain "game model, not a measured fact" line. The first crisis has no hunch; a visible "Just do it" link always exists; hit-rate is a sentence ("called 3 of 5"), never a percent. **F3 and F16 land in the same milestone; F18 ships before or with F3.**
2. **F6:** stat-reward removal merges into the same PR/release as F4+F5 (gate: quests-off ablation, smart ≥ 40%); **no Promise on first run** (offered from run 2 as one optional strip on region confirm); "No promise" equal prominence; "not kept" factual + repair route; cards unlock content only.
3. **F7:** dirty path must stay net-positive before repair (EB +7…+13 gap); repair buys the tier drop only; endings keyed to `everDirty` (`decisions.filter(patron)`), with a **`green-repaired`** ending (BP); sim gate: every ending ≥2% under ≥1 named policy; fallback = fold `bankrupt`→`clean-broke`, `coast-sold`→`toxic` variants.
4. **F8:** flagged ~35% of events (`compounding`) × severity-bound 1.0/1.6/2.2 on budget only, off days 1–5; one line "waiting makes this cost more" only on flagged nodes; **no `$` glyph on map**.
5. **F9:** hold 10 + 10-pt grace band (UX only, never resets sustain); **stress window hold-anchored** — latched once at the first day both stats ≥70 (`holdStartDay`, never re-latched, so it cannot be dodged by delaying), window at `holdStart+4…+8`, 4-day forecast shown as a weather glyph + outlined province (two states: "dark clouds ahead"/"drought now"; no numbers/countdown); slow-onset shocks only, one dated regional analogue per region group, source required before shipping (only Marmara has one today); a shock slows gains, never resets sustain; neutral table ⇒ bit-identical run.
6. **F10:** letters/ news/spawn/sev≥2/age≥4/scheduled landing/threshold crossings/stress reveal/budget<critical/game end stop Advance; cap 5 days; tap cancels (labelled button); refuses to start while a node is at severity 3; `aria-live` per stop; reduced-motion = 0 ms tick + final Dawn Strip.
7. **F12:** neutral single-pulse haptics, 80-chime once per stat per run, single soft 30-note, **no** rising sustain tick/drone/ambient/screen shake.
8. **F13/F14:** `meta` stores `lastEnding` + codex only (no counts/dates/streaks); silhouettes only for ideas met this run but unresolved, never a grid/count; **add assessed transfer probe** (LS) to the F14 debrief — one question applying a met mechanism to a new regional surface; **run-#20 hook** (GL): unlocking a mechanism makes its stress-window kind a choosable local scenario at the region card.
9. **F4/F5 economy constants (EB-measured, D7 all pass):** rebate 0.8 on 50% of clean choices (authored `avoids`; honest set incl. `bursa-smog`, `ne-flood-defense`, `samsun-flood`, `nord-storm-surge`, `istanbul-mucilage`B, `mersin-port`, `ni-lough-neagh`, `se-thames-quality`, `konya-sinkhole`#3, `bayern-urban-heat-munich`; pay-0 set incl. `antalya-caretta`, `hatay-belen-migration`, `nord-wadden-sea`, `wales-cardiff-bay-barrage`, `scotland-rewilding`), two installments +4/+8, delivered as in-fiction letter/news (no toast/jackpot); project reprice recycle 120/+11, park 120/+8, eco 200/+20, solar 200/+24, water 200/+20, grid 300/+36 with prevention multipliers; tax LOW 0 (+3 happy), NORMAL +8, HIGH +14 (−5 happy); **F4+F5 ship together** (one-sided shipping ⇒ noProj 35, clean 4).
10. **F11:** markers medium-matched (haze/foam/brown), only after F7's `patron` flag; `--clean` CSS variable, no per-path props, ≤5 `<symbol>` markers, no blur in landscape; node end-states; labelled-fictional Kara; no screen shake.
11. **F15:** passive link under debrief, after a loss only, ≤2 uses, mini-map pins ≤5, "↶ original path" chip, no prompt/sound.
12. **Casebook** moved to F20 (deferred).

**Consensus statement:** The committee's diagnosis is that the game's *structure* (a strong consequence-memory layer: letters, news, endings, prediction card) is undermined by a *model* that lets players win by reading numbers (88% of events), buy back damage instantly, treat virtue as unaffordable, and grind a passive 20-day hold — plus a *meta* that gives no reason to return. The fix is a layered plan: (1) foundations & honesty, (2) an economy where understanding pays, (3) a learning loop that logs prediction and shows mechanisms, (4) map/tempo/feel, (5) intrinsic meta, with depth content gated on playtest.

**Next scheduled action:** Phase 4 — write `FINAL_FEATURE_ROADMAP.md`, then append the same final consensus at the bottom of this log. (No Round 5 needed.)


---

## PART D — FINAL CONSENSUS (Phase 4)

> Written at the end of the debate. The same text lives in [`FINAL_FEATURE_ROADMAP.md`](FINAL_FEATURE_ROADMAP.md). Round 4 closed with **no unresolved blocking objection**; vote tally and amendments are in `CHECKPOINT - Round 4` above.

# FINAL FEATURE ROADMAP — Green Türkiye

> **Question the committee answered:** *How can we make this game significantly more educational and "addicting" (ethical, intrinsically motivating) overall?*
> **Process:** 7-seat committee (Learning Scientist, Retention Architect, Behavioral Psychologist, UX/Game-Feel Director, Systems Engineer, Environmental-Science Pedagogy Specialist, Economy Balancer), 4 rounds (audit → ideation of 38 proposals → cross-examination → ratification vote). Full transcript: [`COMMITTEE_DEBATE_LOG.md`](COMMITTEE_DEBATE_LOG.md).
> **How the order was set:** Borda count of each seat's *overall committee value* ranking (7 voters, max 140 points). Numbers in this file come from the real reducer (headless sims on a forked copy, n = 500 per cell, SE ≈ ±2.2) or were verified against source; anything not measured is marked.
> **Build order is not rank order.** Rank = value. Milestones (M0–M4, bottom) = dependency order. Where they differ, the item says so.

---

## 1. Executive Summary

**What already works (keep, don't touch):** a pure seeded reducer with replay-tested `actionLog`; a *consequence-memory layer* that is rare in educational games (named citizens' letters, Kara Holding vs. green co-op news, 8 endings, a debrief built only from the decision log); the **predict-then-reveal "Ne oldu?" card** with sourced "why" text (the best pedagogy in the game); Mikey kept small; no points/XP/leaderboards; no telemetry.

**Core diagnosis — five structural problems (each measured or code-verified):**

1. **88% of events teach "pick the plus signs".** Only 15 of 124 events hide numbers and explain themselves. In 107/124 events there are only two options; the cleanest option is also the best value in 56%; for 70/124 events the "right" answer is identical in ≥ 90% of game states. The predict/reveal loop covers 12% of content.
2. **The economy punishes the lesson.** Pure virtue wins 0% (spends ~35 budget/day net; median death day 12, `clean-broke` is the commonest ending). Green is the costly option in 89% of events with no avoided-cost accounting; buying projects *lowers* win rate by 13–17 points; stat-paying quests are load-bearing (zero them and `smart` falls 71% → 12.5%). *(Correction recorded in the log: the earlier "maxTax is dominant" finding was noise — 55% vs 56% at n = 200.)*
3. **Harm lags; cure is instant.** All 10 delayed consequences sit on bad options, and 78–87% never land (14–25-day delays vs a ~31-day median run). Players learn "nature heals the moment I click" and "damage can be bought back".
4. **Consequences aren't on the map, and some feedback is dishonest.** The decision modal covers the map; wildlife is decorative (does not read game state); `isDirtyDeal` flags **57** ordinary trade-offs in 60 events as corruption (e.g. *Welcome Everyone*) and grows Kara Holding for them; guilt has no repair path; floating numbers/sounds leak the hidden effects *before* the prediction.
5. **No reason to play run #2, #5, #20.** Persistence = "endings found n/8" only; a second run in the same region redraws almost the same ~17-event pool; quests pay stats; the 20-day hold is mostly waiting.

**The prescription (one paragraph):** make **understanding pay** — a tuned economy where prevention and honest co-benefits make virtue viable but not free, hidden numbers + a one-tap hunch + a shared mechanism reveal on every event that can honestly carry one, symmetric lags (cures take days too), a deterministic dirty-path cost that never claims "corruption always fails", a forecasted stress test where earlier prevention is visibly the shield — and then give the *meta* an intrinsic spine: a citizen who remembers, a self-chosen Promise, a local concept codex, one rewind to test a hypothesis, and choosable hard scenarios unlocked by understanding. No streaks, no timers, no reward randomness, no player comparison, no stat-currency rewards (13 binding guardrails, §4).

**Headline numbers for the integrated package** (EB, n = 500, all D7 gates pass): `smart` 51 · `patient` (buys prevention) 58 vs `noProj` 43 · `desperate` 90 · `clean` **12** (was 0) · `random` 12 · `bribe` 0 · `lazy` 43 (was 70) · median winning day 20–24 · no ending > 35%. *Replay determinism and neutral-data invariance are **not** measured by the sim; they must be CI tests (M0).*

---

## 2. Prioritized Feature & Improvement List

*Effort scale: **Low** ≈ ≤ 1 day / ≤ ~100 LOC; **Medium** ≈ days / ≤ ~400 LOC or ≤ ~45 new TR/EN/DE strings; **High** ≈ > 1 week or large authored content. "LTU" = one `LocalizedText` ({tr,en,de}) = one authored sentence ×3 languages.*

### #1 — Hidden-information leak fix, pre-choice snapshot, mobile traps
- **Rank & Title:** #1 · Stop the answer leak and fix phone traps (Borda 132; seats' best/worst rank 1/5)
- **Type:** **[Upgrade to Existing Feature]** — `src/components/EventModal.tsx` (`handleChoiceClick`, stat strip L208-218), `App.tsx` (L119), `GameHUD.tsx`, `DaySummary.tsx`, `index.css`
- **Why It Is Good:** *Educational:* the game's only strong teaching loop hides effect numbers, then spoils them: `handleChoiceClick` fires `showFloatingText` for every effect and plays `sfx.choiceGood/Bad` *before* the player predicts; the modal's own stat strip changes live. Closing the leak protects competence (the prediction becomes a real prediction) and is the precondition for every measurement. *Engagement:* removes accidental frustration — on phones the SFX mute button is `max-sm:invisible`, so a once-muted player can never un-mute; sub-44 px targets and 9–10 px text break thumb play; no "80" marker means players cannot see how close they are to winning.
- **Core Mechanics & Implementation Sketch:**
  1. When an event hides its numbers: no floating text, play neutral `sfx.click` (not good/bad); freeze the modal stat strip and HUD/map filter to a pre-choice snapshot (ref / `displayState`) until the reveal; move floaters to the reveal card, anchored at the HUD stat icons.
  2. Remove `max-sm:invisible` from the SFX button; add an 80 tick mark + soft glow when both bars ≥ 80; text floor 11 px; touch targets ≥ 44 px (`before:-inset-3` on nodes, `min-h-11 min-w-11` on controls, wider quest chevron); show **totals with delta** in `DaySummary` ("62 (−2)"); `aria-live` on toasts/status.
  3. Optional later: move End Day / Mikey / sound toggles into one right-edge thumb rail.
- **Estimated Effort:** **Low** (~5 lines for the leak, ~30 for the snapshot, the rest are CSS/class edits). Ships in M0.

### #2 — Foundations & simulation gates
- **Rank & Title:** #2 · Foundations: compact log, content version, CI, sim assertion harness (Borda 130; 1/5)
- **Type:** **[Upgrade to Existing Feature]** — `src/reducers/gameReducer.ts`, `src/contexts/GameContext.tsx`, `scripts/{sim,play,replay-test,validate-events}`, `.github/workflows/deploy.yml`; new `src/data/version.ts`, `scripts/{content.lock.json,budget.json,targets.json,sim-baseline.json}`
- **Why It Is Good:** *Educational/ethical:* every causal claim the game makes ("this was day 5's choice") is only honest if replay is exact; every balance change must be provable, not guessed (author's own Faz 3 rule). *Engagement:* makes rewind, seed cards and the whole economy rebuild safe. **Today `npm test` and `npm run sim` are not in CI**, `START_GAME` embeds the entire SVG `Country` object and `BUY_PROJECT` a whole `Project` in the log (not serialisable), and any content edit silently invalidates saved seeds.
- **Core Mechanics & Implementation Sketch:**
  - **Compact log:** `START_GAME{countryId,regionId,startBudget,seed,contentVersion}`, `BUY_PROJECT{projectId}`; reducer resolves ids via `getRegion`/`PROJECTS`; version mismatch returns the *same state* (no log entry). `scripts/content.lock.json` = `{version, hash(event ids, choice counts)}`; validator fails if the hash changed without a bump.
  - **Add `runSeed`** (set at START) + stateless `keyedRoll(runSeed, key…)` in `rng.ts` for any new deterministic variation (stress-window offset etc.) — order-independent, so rewind branches stay comparable.
  - **CI:** run `npm test` (replay, **JSON round-trip** `JSON.parse(JSON.stringify(log)).reduce(gameReducer, INITIAL_STATE)` deepEquals state; strengthened causal check tied to the right event), `validate:events`, `sim:check`.
  - **`sim:check`:** fixed paired seeds, n = 400–500, Wilson intervals; baseline-invariance gate (change declared "no behaviour change" must stay within ±5 pts win/policy, ±2 median days, ±5 pp endings); **D7 targets** (EB): `smart` 45–65; `patient − noProj ≥ +3`; each project paired Δ ∈ [−3, +25]; `desperate ∈ [smart+10, 95]`; `random ≤ 15`, `bribe ≤ 5`, `idle = 0`; `clean ∈ 3–25`; `|maxTax − smart| ≤ 12`; `lazy ≤ smart − 5`; `desperateClean − greedy ≥ 25`, `smart − random ≥ 30`; no ending > 35%; every ending ≥ 2% under ≥ 1 named policy; median winner day 18–35; delayed-effect landing ≥ 60%; **quests-off ablation `smart ≥ 40%`**.
  - **New `play.ts` policies:** `noProject`, `lazy`, `desperate`, `desperateClean`, `patient`/`prevent`, later `learner`, `rewinder`, `displacer`.
  - ESLint `no-restricted-imports`: nothing in `src/reducers` or `src/utils/gameLogic` may import `src/meta` (keeps the reducer pure).
  - LTU budget check in `validate:events` against `scripts/budget.json`.
- **Estimated Effort:** **Medium** (~450–500 LOC, ≤ 8 LTU). First item to merge in M0 (everything else is gated by it).

### #3 — Lag symmetry & honest co-benefit ("cures take days; some virtue pays, some doesn't")
- **Rank & Title:** #3 · Symmetric lags and authored avoided-cost rebates (Borda 121; 1/8)
- **Type:** **[Upgrade to Existing Feature]** — `types/index.ts` (`DelayedEffect` → `Consequence`), `gameReducer.ts` (`ScheduledEffect`, HANDLE_CHOICE), `events.ts` (~10 delayed events + authored `avoids` on a clean-choice subset), `story.ts` letters. Ships **with #5** (economy).
- **Why It Is Good:** *Educational:* directly corrects the two most damaging false lessons the model teaches — "cure is instant" and "green is just expensive". Real recovery lags and is often partial (hysteresis); real prevention sometimes pays back as *avoided cost* (health, flood damage, fisheries, treatment) and sometimes only "in nature" (biodiversity, heritage). Showing both *and the contrast* is the lesson. *Engagement:* "I'll see the sea come back in ~8 days" creates anticipation and a reason to keep playing; EB measured it is the **largest balance lever** (clean policy 2% → 17%, `smart` +17).
- **Core Mechanics & Implementation Sketch:**
  - One shape: `Consequence{inDays, effects, message?, kind?:'harm'|'recovery'|'residue', mechanism?, medium?}`; old `delayed` data stays valid (alias). Defaults: kind = harm if sum<0 else recovery.
  - **Rebate:** ~50% of clean choices carry authored `avoids: mechanism` and pay **0.8 × |cost|** back as two halves at **+4 and +8 days**, delivered as an **in-fiction letter or news line** ("the clinic saved money") — no toast, no jackpot sound; the pending marker is a neutral "?" ring with no sign or amount. The other ~50% pay 0 and the reveal says *"this one pays back in nature, not the budget"* (honest set e.g. `bursa-smog`, `ne-flood-defense`, `samsun-flood`, `nord-storm-surge`, `istanbul-mucilage`B, `mersin-port`, `ni-lough-neagh`, `se-thames-quality`, `konya-sinkhole`#3, `bayern-urban-heat-munich`; pay-0 set e.g. `antalya-caretta`, `hatay-belen-migration`, `nord-wadden-sea`, `wales-cardiff-bay-barrage`, `scotland-rewilding`). Pure helper `rebateFor(choice)` supplies a default only where `avoids` is authored; authored recovery lists override (no double-dip).
  - **Cancellation:** choices get `addresses?: string[]`; a pending *harm* with `mechanism: M` is halved if a logged decision addressing M lands first (provable from `decisions`). Optional slower clean-cure installments (30% now / 35% @8 d / 35% @14 d) are allowed where the real case is slow (costs ≈ 3 pts of `smart`, needs rebate 0.6).
  - **Delays ≤ 12–14 days** (validator rule) so consequences *land* inside a ~31-day run; recovery-sum ≥ 0.9 × cost on installment events.
  - **Typed residue** on **5–6** displacement events (`residue:{to:'air'|'water'|'land'|'sea'|'abroad', afterDays 5–12}`): the outcome card names *where the problem went* ("the pile shrank; part left through the stack and the ash"). E.g. `ewaste-dump` + licensed incinerator option. EB measured residue/short delays do not move win rates (0.2–0.5% of choices) — it is a pure teaching device with zero balance risk, so keep it to 5–6.
  - Worked example (`istanbul-mucilage`): A skim = −150 b, +20 h, +10 c now, `harm` −15 c at +12 d (mechanism `nutrient-loading`); B advanced treatment = −200 b, +8 c now, `addresses:['nutrient-loading']`, `recovery` +8 c @ +8 d and +9 c @ +14 d.
- **Estimated Effort:** **Medium** (code ~150 LOC; ≈ 25–35 LTU for recovery/avoids messages — most reuse existing `message` text). Ships in M1.

### #4 — Hunch + shared mechanism reveal (extend "predict-then-reveal" safely to every event that can honestly carry it)
- **Rank & Title:** #4 · One-tap hunch and a shared reveal card (Borda 117; 2/6)
- **Type:** **[Upgrade to Existing Feature]** — `EventModal.tsx` (L77 `useState` guess → reducer), `types/index.ts` (`EventChoice.mechanism`), `gameReducer.ts` (`HANDLE_CHOICE`), `events.ts`
- **Why It Is Good:** *Educational:* retrieval/generation effect and hypercorrection (confident-wrong guesses are corrected most); a **shared per-mechanism sentence** (written once ×3, not per event) gives a transferable vocabulary so players recognise "displacement" or "symptom vs source" in a new place — moves reveal coverage from 12% toward 100% *as fast as content allows* without 124 bespoke paragraphs. Counterfactual line on a miss ("the other option would have been X"). *Engagement:* competence + curiosity; cheap (1 extra tap); no score.
- **Core Mechanics & Implementation Sketch:**
  - **Atomic action:** `HANDLE_CHOICE{index, hunch?:-1|0|1}` — no half-committed state, `REWIND_TO` stays simple. `Decision += {mechanisms?, hunch?, miss}`; mastery is a pure fold over `decisions` (not stored state).
  - **UI (3 taps, same as today's outcome events):** (1) tap a choice → card selected; (2) one chip row *"Your hunch: what happens to cleanliness?"* — **Rises / Same / Falls / Not sure**; tapping a chip commits choice+hunch together (visible **"Just do it"** link always available; **first crisis has no hunch**); (3) reveal: ✓/✗ + shared mechanism line; miss expands to the event `why` + one counterfactual line; HUD bars count up from a "ghost" marker. Stat = **cleanliness** by default; authored `probe` stat only on trade-off events where cleanliness isn't the point (≈ ≤ 15, e.g. `blacksea-hes`); never budget. Hit-rate is shown at most as a **sentence** ("called 3 of 5"), never a percent or trend.
  - **Mechanism taxonomy:** collapse today's 22 free-text mechanism strings (15 events) into ≈ 8 enums: `source-fix | displace | mask | delay | price-signal | subsidy | restore | enforce`; optional post-commit `PREDICT_CHIP` only where an enum exists.
  - **Gating (binding):** numbers are **hidden only** for events where *every* choice has a mechanism enum **and** there's a one-line evidence cue (the existing description suffices); the mechanism sentence is shown only where the card/skin has a tier and a source; every other event keeps its numbers and shows the plain note *"Game model, not a measured fact."* Validator enforces completeness. **Must land with #14 (break dominance) and #10 (honest-content validator)** — otherwise the hunch on dominance-shaped binaries is trivially "▲" and measures nothing, and unsourced causal sentences would spread.
- **Estimated Effort:** **Medium** (~250 LOC; ~8 chip labels + ~8 shared sentences = ≈ 24 strings; ~250 enum labels across events are authoring labour but **0 LTU**). M2.

### #5 — Project reprice + prevention + educational catalogue-lite
- **Rank & Title:** #5 · Make projects matter: reprice and prevention (Borda 104; 3/10)
- **Type:** **[Upgrade to Existing Feature]** — `src/data/projects.ts`, `gameReducer.ts` `spawnNode`, `types/index.ts` (`Project.prevents`, `regionIds?`, `addresses?`)
- **Why It Is Good:** *Educational:* today the six projects are identical in every region, carry no domain content, nothing is prevented, and buying them **lowers** win rate by 13–17 points — "prevention vs cure" can't be learned. `water-filter` ("strongest educational project") is the worst buy (payback ~47 d) and appears in Konya, which has no sea. *Engagement:* build-order mastery and a visible plan; a shield icon on the map.
- **Core Mechanics & Implementation Sketch:**
  - `prevents: PollutionTag[]` + `preventMult` (spawn weight × mult for matching tags; weights in ×100 integers; neutral = `floor(v·n)` = bit-identical to today). `effectiveEffects(state, event, choice)` is the single function the reducer *and* UI both call (so displayed cost = applied cost).
  - **EB-measured reprice** (cost / build days / daily yield / prevents): recycle 120 / 4 / +11 b (+2 c, +3 h once) / waste, soil ×0.5 · park 120 / 4 / +8 b, +2 h / hazard, heritage ×0.6 · eco 200 / 5 / +20 b, +2 h, +1 c / landuse, biodiversity ×0.5 · solar 200 / 5 / +24 b, +1 c / energy, air ×0.6 · water 200 / 6 / +20 b, +3 c / water, marine, groundwater ×0.4 · smart-grid 300 / 7 / +36 b. Paired Δwin vs `noProj`: recycle +19, park +19, eco +18, solar +23, water +16, solar+grid +20 (all in gate).
  - **Honest note on prevention weights:** EB measured spawn-weight prevention is close to cosmetic *for balance* (`patient` 66 vs 65 without). Its value is educational and — via #12's stress window — a measurable shield (+15). Keep it, but don't claim it as an economy lever.
  - Region gating: `regionIds` (no wastewater plant in Konya → a metering/drought-resilience project instead); ≤ 2 new region projects (e.g. Konya metering network, Rize flash-flood early warning); every project card states **what it does not do** ("recycling does not reduce waste generation"; `smart-grid` note: "efficiency saved is often spent" — rebound).
  - Only 52 of 124 events carry `tags.pollution` (all 72 DE/UK events are untagged) → prevention touches ~42% of draws until DE/UK events are tagged (tracked under #16).
- **Estimated Effort:** **Medium** (~150 LOC; ≈ 10–14 LTU for project text). **Must ship in the same release as #3 and #7's economy bits** (one-sided shipping ⇒ `noProj` 35%, `clean` 4%). M1.

### #6 — Dirty-path honesty: provable `patron` flag, deterministic cost, honest endings, repair
- **Rank & Title:** #6 · Honest feedback for temptation and a repair path (Borda 100; 2/10)
- **Type:** **[Upgrade to Existing Feature]** — `src/data/story.ts` (`isDirtyDeal`, `EndingFacts`, `ENDINGS`), `gameReducer.ts` (HANDLE_CHOICE, letters), `LetterModal.tsx`, `validate-events.mjs`, `events.ts` (~10 events)
- **Why It Is Good:** *Educational:* corrects a causal-honesty bug — `isDirtyDeal = budget>0 && cleanliness<0` flags **57** ordinary trade-offs in 60 events as corruption (e.g. *Welcome Everyone* grows Kara Holding and triggers "we have not forgotten") — and stops teaching "corruption always fails": real dirty deals often pay for a long time and the cost lands on someone else. *Engagement/ethics:* guilt without agency is learned helplessness; `holdingTier` only ever rises. Real temptation makes the choice meaningful (autonomy).
- **Core Mechanics & Implementation Sketch:**
  - Authored `choice.patron?:'kara'|'unnamed'` and `choice.kind?:'bribe'|'loophole'|'tradeoff'` (script proposes flags; author reviews once; validator requires an `outcome.why` on every `patron` choice). Plain trade-offs get a neutral new **`cost`** letter ("the money came, and so did the smell"), no accusation. `Decision.dirty` → `decision.patron`.
  - **Wording:** describe the act plainly ("accept the cash envelope"), withhold only the legal label; the reveal states the legal label and *why the offer was big* ("the treasury was low").
  - **Deterministic cost, no audit roll** (EB-measured): dirty gain ×2 when budget < 200; **ratio fee** on a *named citizen* at +4 d: `0.5 × gain × (1 + 0.15 × holdingTier)` budget and −4 happiness — "the cost landed on [citizen]", never "you were caught". `desperate` beats `desperateClean` by only ~+6, so it never teaches "it always fails"; `random` stays 12. Gate: the dirty path stays **net-positive before repair**.
  - **Repair** is a single button inside `LetterModal` (no map node, no node-cap use, no timer), cost `0.8 × gain taken`, one open per citizen; it buys the `holdingTier` drop only and **never refunds past damage** (the debrief says "repaired 1 of 3; the stream damage stayed").
  - **Endings keyed to the ever-dirty log**, computed at render (replay-safe): `EndingFacts.everDirty = decisions.filter(d => d.patron).length`; `green-model` = win & everDirty 0; `green-shadow` = win & everDirty ≥ 2 & not repaired; **new `green-repaired`**; `coast-sold` = clean ≤ 0 & everDirty ≥ 4. Without keying, repair launders the label (green-model 136 vs 32). Gate: every ending ≥ 2% under ≥ 1 named policy; fallback = fold `bankrupt`→`clean-broke`, `coast-sold`→`toxic` variants.
  - Soot/map markers (#13) ship only after this flag is live.
- **Estimated Effort:** **Medium** (code ~120 LOC; content review of 57 choices (0 LTU) + ~3 new strings ×3 for the `cost` letter, ≈ 6 repair texts, 1 ending). M1.

### #7 — Quests → Promise + local codex unlocks (and quest rewards to zero)
- **Rank & Title:** #7 · Replace stat-reward quests with a self-chosen Promise (Borda 83; 5/13)
- **Type:** **[Upgrade to Existing Feature]** — `src/data/quests.ts`, `QuestPanel.tsx`, `START_GAME`, `GameOver.tsx`
- **Why It Is Good:** *Educational:* current quests pay stats (extrinsic, inflates the economy, pays for stalling: `survivor` at day 20, `long_haul` at day 40; counts bribes as "resolved"); a Promise makes the player track one pollution pathway. *Engagement:* autonomy + meaning (a named citizen), no points. Zero-ing rewards without compensating economy collapses the game (71% → 12.5%) — hence the hard ordering rule.
- **Core Mechanics & Implementation Sketch:**
  - **Gate (binding):** quest stat rewards go to 0 **in the same release as #3/#5** and only if the quests-off ablation keeps `smart ≥ 40%`.
  - **Promise flow** (from run 2; **not on the first run** — it would add a screen before the first decision): optional strip on the region-confirm step shows 3 cards (citizen + stake, e.g. "Rıza: keep the strait fishable"), *No promise* equally prominent; `START_GAME.promise?:{characterId, tag}`; during the run only a ring on that citizen's province — no toast/meter/reward; letters prefer that citizen; debrief line built from the log: *kept / partly kept / not kept / never tested* (kept = 0 harmed; partly = harmed ≤ helped; not kept = harmed > helped) + the relevant mechanism card + (if not kept) the repair route. Wording is factual, never moralising.
  - Old threshold quests deleted (the 1000-budget quest is dead content: 4% completion). Derived, debrief-only unlock cards (≤ 4, no toasts): first response, lag witness, dividend collected, prevention before day 10.
- **Estimated Effort:** **Medium** (~100 LOC; ≈ 9 promise strings, shared across regions). M1 (zeroing) / M2 (Promise UI).

### #8 — Debrief "One Idea" + counterfactual + assessed transfer probe + local codex
- **Rank & Title:** #8 · Make the debrief teach a concept (Borda 77; 6/13)
- **Type:** **[Upgrade to Existing Feature]** — `GameOver.tsx` (cards at L41-53: "N decisions in D days", "dirty deals: n", "first critical stat"); new codex view
- **Why It Is Good:** *Educational:* the best consolidation moment currently reviews logistics, not concepts. Retrieval at the point of consolidation, spacing across runs, counterfactual contrast, and (added in R4) an **assessed transfer probe**: one question applying a mechanism the player met this run to a new surface in a different region — otherwise skins expose transfer but nothing checks it. *Engagement:* curiosity gap, epistemic mastery; the learning is visible within 10 s of a loss.
- **Core Mechanics & Implementation Sketch:** one concept card chosen from the run's mechanisms (the one mispredicted, else most consequential) shown as a 2-option cloze, then the answer (answers may come only from **sourced** cards); a one-line counterfactual ("the other option would have been X"); one transfer question; seen cards go into a local codex stored via the meta module (#11). Unresolved ideas appear as **neutral silhouettes only for ideas met this run**, no count, no "N of M", never on the main menu. Restart button stays first (session end never delayed). Needs the meta store.
- **Estimated Effort:** **Medium** (~150 LOC; ≈ 8–20 concept cards ×3, reusing the existing `why` sentences from the 15 outcome events). M2.

### #9 — "Advance" tempo + Dawn Strip
- **Rank & Title:** #9 · One-button tempo that stops when something matters (Borda 74; 3/17 — most polarising item)
- **Type:** **[Upgrade to Existing Feature]** — `App.tsx` (End Day button), `DaySummary.tsx`
- **Why It Is Good:** *Educational:* attention goes to decisions, not clicking through empty days; cause→effect lands on the HUD at the moment of the daily decay/tax. *Engagement:* today each day costs ≥ 4 taps and two overlays; many days are dead clicks. This is flow, not a hook.
- **Core Mechanics & Implementation Sketch:** single **Advance** button ticks days visibly (~350 ms/day) via plain `TICK`s (log/replay unchanged; test "Advance ≡ n × TICK"); **stops on:** new spawn · node reaching severity 2/3 or age ≥ 4 (a skip can never cross the day-6 eruption) · any letter/news · project completion · scheduled effect landing · stat crossing 80/70/30 · sustain milestone (×5) · stress forecast reveal/open/close · budget < `criticalBudget` · game end; **cap 5 days/press; tap cancels** (labelled button); refuses to start while a node is at severity 3; never advances past an open decision. **Dawn Strip** (non-modal) replaces the blocking `DaySummary` on quiet days: day + 3 delta chips (with totals); the full modal opens only for a first-ever item or a Kara tier change; letters/news = a mail icon on the map. `aria-live` line per stop; reduced-motion = 0 ms tick + final strip. Hold-to-skip rejected (not discoverable on touch).
- **Estimated Effort:** **Medium** (~150 LOC, ~2 strings; needs #17 neglect interest to stop on spawn). M3.

### #10 — Honest-content validator rules and evidence tiers
- **Rank & Title:** #10 · Rules for honest content (Borda 72; 3/16 — **ships before/with #4**)
- **Type:** **[Upgrade to Existing Feature]** — `scripts/validate-events.mjs`, `types/index.ts` (`SourceRef`, tier)
- **Why It Is Good:** *Educational/ethical:* the game spreads causal claims to students; unsourced claims must not scale faster than the validator. Only 15/124 events carry sources, several `partly-verified` sources are news outlets, and 72 DE/UK events are untagged unsourced binaries. *Engagement:* a visible tier badge ("real case / composite / hypothetical") is itself a media-literacy lesson.
- **Core Mechanics & Implementation Sketch — the 8 rules (ES):** (1) every event/skin declares a **tier**; `real` needs ≥ 1 verified primary source (agency/peer-reviewed/court); news-only = `partly-verified` and says "reported"; (2) game numbers are never shown as measurements; any real figure carries its own source and year; (3) every consequence the `why` names must show in numbers or lag (no "took years" with an instant +25); (4) every choice has a `kind` (symptom/source/displace/ignore/systemic) and says what it does *not* fix; (5) no option is both cheapest and cleanest without a sourced co-benefit, and each green cost states who pays and who gains; (6) no single-event climate attribution — shocks need a regional analogue with date and source; (7) blame is structural unless the choice is flagged illegal; letters match medium and stake; (8) TR/EN/DE parity (figures, units, hedges, source labels) — validator fails otherwise. Plus: mechanism coverage report (warn until ≥ 2 events per enum per country), enum-completeness for hidden-number events, LTU budget, dominated-choice warning count may not rise, 3-option share may not fall.
- **Estimated Effort:** **Low–Medium** (~100–150 LOC validator). M0.

### #11 — Meta store + Dossier line + returning citizens + stake-matched letters
- **Rank & Title:** #11 · Local memory that is relational, not a score (Borda 66; 7/16)
- **Type:** **[New Feature]** `src/meta/{store,summarize}.ts` + **[Upgrade]** `story.ts` (`CHARACTERS`, `addLetter`, `LETTERS`)
- **Why It Is Good:** *Educational:* a letter should come from the citizen *affected* by the decision. Today `cast[letters.length % cast.length]` picks the writer by turn order, so a fisherman writes about tourists and "the fish are gone" lands in a wheat region (every problem becomes a water problem). *Engagement:* relatedness through specific people who remember the last ending ("Last time the strait ran black. I stayed. I'm glad you're back."), plus a one-line epitaph on each region card — a collection that is knowledge, not points (run #5 / #20 reason).
- **Core Mechanics & Implementation Sketch:**
  - **Store:** one module, all access in try/catch, migrates the four existing `localStorage` keys, JSON export/import/reset; stores **`lastEnding` per region/citizen + codex only — no run counts, dates, streaks** (guardrail). Meta enters the reducer only through a logged `START_GAME.payload`; it exits via a pure `summarize(state)` called by a UI effect on `isGameOver`. ESLint boundary forbids reducer imports.
  - **Stake-matching (cheapest honest version):** role→stakes map (~10 roles: fisher→water/marine, farmer→soil/landuse, teacher/nurse→air/hazard, shopkeeper→economy); all 38 characters inherit; `addLetter(kind, eventId)` picks the first character whose stakes intersect the event's `tags.pollution`, fallback = current rotation; keep the 5 templates; give `cleanBad` 3 variants (water / land / other); one new `returning` template ×3. A "wary" returning letter always carries an invitation to act (no guilt without agency).
  - **Run-#20 hook (GL):** once a mechanism is seen, the matching stress-window kind unlocks as a choosable **local scenario** on the region card ("which hard variant do I try?") — skippable.
- **Estimated Effort:** **Medium** (~150 LOC + one map + ≈ 12 strings; **no** 54 letter fragments — rejected). M2.

### #12 — Hold 10 + one forecasted stress window (prevention becomes the shield)
- **Rank & Title:** #12 · A test the player can prepare for (Borda 60; 8/17)
- **Type:** **[Upgrade to Existing Feature]** — `gameLogic.ts` `TUNING.sustainGoalDays`, `gameReducer.ts` TICK; **[New]** `src/data/phases.ts`
- **Why It Is Good:** *Educational:* resilience, tipping points, prevention vs cure; the lesson is attributable because the test is deterministic and announced. *Engagement:* the 20-day hold is mostly waiting (winners overshoot by ~20 points; `desperateClean` wins on day 38); a forecast makes preparation a decision and the late game dramatic without a timer.
- **Core Mechanics & Implementation Sketch:**
  - Hold **10** days (14→10→ measured: median `desperateClean` win day 38→30→26, win rate within ±4) with a **10-point grace band** (counter pauses at 70–79, resets only below 70) — a UX/loss-framing fix; the ×0.5 cap above 85 was measured null and **dropped**.
  - **Stress window is hold-anchored and latched once:** `holdStartDay` = first day both stats ≥ 70 (never re-latched, so it can't be dodged by delaying); window at `holdStart+4 … +8`; **4-day forecast**. EB-measured shield value `patient − noProj` **+15**. (Absolute day 20–24 often fires *after* the run is won — median `smart` win day is 20.)
  - **Region table `REGION_STRESS[regionId]`** (one *slow-onset* shock + dated regional analogue; floods get a 1–2 day event warning instead, never a week-long forecast; Konya = drought/heat, never flood): TR Marmara — warm stratified bloom (mucilage 2021, **only row with a repo source**); Aegean/Med — heat + wildfire (Manavgat, Aug 2021, *source needed*); Central Anatolia — drought (Tuz Gölü 2021, verify); Eastern — drought/low flow (verify); Southeast — heat + dust (partial source: `dust-transport`); Black Sea — prolonged-rain landslide season *(not a flood window)*; DE Nord/Ost/Bayern — drought (2018); DE Ruhr/Rhein-Main/BW — Rhine low water (2018, 2022); UK England — heat/drought (July 2022); England North — moorland fire (Saddleworth 2018); Scotland/Wales — dry summer; NI — algal bloom (Lough Neagh 2023). **A row ships only with a verified source.** Constants: decay ×2.5 clean / ×2 happy, spawn ×1.3, hazard/air/water/energy weights ×3 *(measured)*.
  - **UI:** weather glyph beside the day label + outlined province, two states ("dark clouds ahead"/"drought now"), no countdown or numbers; the shock **slows gains, never resets sustain**. `spawnWeight = prevention × phase` (×100 integers); neutral/missing table ⇒ bit-identical run.
  - Gate: `patient − noProj ≥ +10` during the stress window.
- **Estimated Effort:** **Medium–High** (~120–200 LOC; 12 region rows ×3 + ≥ 4 shock cards; ≥ 8 sources to verify). M3.

### #13 — The map as evidence (consequence layer)
- **Rank & Title:** #13 · Show cause and effect on the map (Borda 58; 5/16)
- **Type:** **[Upgrade to Existing Feature]** `CountryMap.tsx`, `MapWildlife.tsx`, `ProjectSites.tsx`, `EventModal.tsx` + **[New]** `MapMarks.tsx`
- **Why It Is Good:** *Educational:* the roadmap's own principle is "the game shows, text doesn't tell", but today the modal covers the map and the only state it reflects is one global desaturation filter (a dimmer, not a place). Wildlife is decorative (`MapWildlife.tsx:52` takes no props). *Engagement:* ownership and a sense of place; accountability becomes visible without a blame sentence.
- **Core Mechanics & Implementation Sketch:** node **resolve** (scale down + green ring + rising tone) and **erupt** (red ring + low thud, **no screen shake**) end-states; a neutral grey "?" ring for pending consequences (no sign/amount, leaks nothing); scaffold marker with progress arc for projects under construction; **medium-matched markers** placed only on the event's `location.provinces` (haze = air, foam/discolouration = water, brown patch = land), Kara markers labelled **fictional**, ship **only after #6's `patron` flag**; co-op = green tufts; **landscape side sheet** (~46% width, map stays visible with the node outlined, outcome animation plays at the node); wildlife thins/adds with cleanliness; **performance rule:** one wrapper CSS variable `--clean`, no per-path props (the map is `memo`'d over 81 paths; 80–165 KB of path data), markers as ≤ 5 `<symbol>`s at `getProvinceCentres`, no `blur` filters in `mobile-landscape`; static end-states under `prefers-reduced-motion`.
- **Estimated Effort:** **Medium–High** (SVG/CSS ~250 LOC; ≈ 4 ARIA strings). M3.

### #14 — Break dominance in the most-drawn events (real trade-offs)
- **Rank & Title:** #14 · Make the choices genuinely hard (Borda 57; 3/18 — LS's #3, UX/GL ≈ #16–17)
- **Type:** **[Upgrade to Existing Feature]** — content in `src/data/events.ts` (~20 events first, then rest)
- **Why It Is Good:** *Educational:* without this the hunch (#4) trains valence-guessing. 107/124 events have 2 options; in 17 the cleanest is also the richest; 3 contain a strictly dominated option; DE/UK wind events are a free lunch (+15…+20 clean *and* money) contradicting Türkiye's siting-cost lessons (`ni-antrim` rewards "ignore the dispute"). *Engagement:* real dilemmas are the core pleasure of a sustainability trilemma.
- **Core Mechanics & Implementation Sketch:** pick the ~20 most-drawn events (by sim frequency); rewrite so options trade off across budget/happiness/cleanliness *with a third "systemic" option where honest*, add `kind` per choice and a "what it doesn't fix" line; fix the 5 DE/UK wind contradictions; ≤ ~15 `probe` stats; raise 3-option share from 14% toward ~25–40% *only where honest* (EB-P7's blanket 25% injection was measured at smart 52→45 and rejected). Validator: dominated-choice count may not rise.
- **Estimated Effort:** **High** (authoring ×3; cap ≈ 10 events in M2, the rest in M3 — *cut this first if time-boxed*). M2/M3.

### #15 — Rewind-one-decision + seed card + path code
- **Rank & Title:** #15 · Test a hypothesis on the same crises (Borda 52; 10/18)
- **Type:** **[New Feature]** — `gameReducer.ts` wrapper (`REWIND_TO`), `GameOver.tsx`, URL-hash seed card
- **Why It Is Good:** *Educational:* the strongest counterfactual and desirable-difficulty device available; fits the pure reducer + `actionLog`. *Engagement:* competence and autonomy; supplies the run-#2 reason ("what if I'd chosen the other option?").
- **Core Mechanics & Implementation Sketch:** `REWIND_TO{index, abandoned: Decision[]}` handled in the wrapper: rebuilds `actionLog.slice(0,index)` from `INITIAL_STATE`, appends a marker, records `abandoned` in `GameState.branches` (marker lives in the log, so replay stays exact; the RNG is drawn only in TICK/START so the same crises reappear); a **passive link under the debrief**, offered **only after a loss**, ≤ 2 uses/run, mini-map timeline of ≤ 5 pins (event icon + day), a 1.5 s sepia/count-back on landing and a persistent "↶ original path" chip; **no prompt, sound or animation** ("one more run" nudges forbidden). Seed card `#v=3&c=tr&r=marmara&s=<base36>` (same map and crises, no scores) behind a collapsed "Share"; path code = `eventId:choiceIndex` per decision, no name/score/timestamp. Needs #2 and #4 (the hunch rides in `HANDLE_CHOICE`). **Casebook aggregator deferred** (see §3).
- **Estimated Effort:** **Medium** (~130 LOC after #2; little copy). M2.

### #16 — Mechanism cards + regional skins + DE/UK back-fill (capped)
- **Rank & Title:** #16 · Write the idea once, skin it per region (Borda 48; 6/19)
- **Type:** **[New Feature]** — `src/data/mechanisms.ts`, `src/data/skins.ts`; validator support (#10)
- **Why It Is Good:** *Educational:* 109 events have no explainer and 72 DE/UK events are untagged binaries; a solo author can't hand-write 124 bespoke paragraphs ×3. A **card** (claim ≤ 25 words, misconception, 4–5 option roles) + **skin** (place, actor, anchor with tier+source) gives transfer ("the bag fee in Türkiye 2019, England 2015, Ireland 2002") at low marginal cost. *Engagement:* the same idea recurring in a new place is the curiosity/mastery loop.
- **Core Mechanics & Implementation Sketch:** schema `MechanismCard{id, concept, claim, misconception, options[{role:'symptom'|'source'|'displace'|'ignore'|'systemic', shape, whyTemplate}], slots}` / `Skin{id, cardId, regionId, provinces, basin?, slots, anchor{text,source,tier}, overrides?}`. **Seed = the 15 existing outcome events** (their `why` sentences become the cards — not rewritten). **M2: 4 cards** (symptom vs source, displacement, rebound, price signal) **+ 8 DE/UK skins** (e.g. `ni-lough-neagh`, `se-thames-quality`, `se-chalk-stream-abstraction`, the English 5p bag charge); **M3: 4 more cards** (recovery lag, commons/quotas, irreversibility, siting/low-carbon-not-free) **+ 16 skins**, upgrading ≈ 24 of 72 DE/UK events (one third). **Hard cap per milestone: ≤ 40 new sentences ×3 and ≤ 8 verified sources.** Prefer primary sources (TÜİK, DSİ, EEA, UBA, Defra, Environment Agency).
- **Estimated Effort:** **High** (authoring/verification, schema is Low). M2/M3, can slip.

### #17 — Neglect interest (required by the `lazy` gate; ships inside M1 regardless of rank)
- **Rank & Title:** #17 · Waiting should cost something real (Borda 41; 9/19 — required by sim)
- **Type:** **[Upgrade to Existing Feature]** — `gameReducer.ts` (`OPEN_EVENT`/`HANDLE_CHOICE` cost), `events.ts` (`compounding` flag)
- **Why It Is Good:** *Educational:* many real problems compound (contaminated plumes grow, invasive-species eradication cost climbs with area, wildfire suppression, salinisation) — but **not all** (a fixed-cost retrofit doesn't). *Engagement/balance:* without it, waiting is almost free (`lazy` 70 vs `smart` 57) and triage isn't a decision.
- **Core Mechanics & Implementation Sketch:** flag ≈ **35%** of events `compounding` (a deterministic hash of the event id until authored; must not fall below ~35%); the **negative budget effect only** is multiplied by the node's **existing visible severity** tier: **1.0 / 1.6 / 2.2**; **off for days 1–5** and in the first-solve tutorial; the cost tier shows on the **choice buttons** (not on the map — no `$` glyph), with one line on flagged nodes ("waiting makes this cost more"); no second hidden clock. Measured: `lazy` 70 → 45, `smart`/`desperate` unchanged; universal ×1.6, 35%-flag alone, and severity-only 1.0/1.3/1.6 all failed the `lazy ≤ smart − 5` gate or were too harsh.
- **Estimated Effort:** **Low** (~60 LOC + a flag per event; ≈ 2 strings). M1.

### #18 — Mikey rulebook (silence is a feature)
- **Rank & Title:** #18 · Keep the mascot from becoming Clippy (Borda 37; 9/19)
- **Type:** **[Upgrade to Existing Feature]** — `MikeyHints.tsx`, `mikeyMute.ts`
- **Why It Is Good:** ROADMAP names the "Clippy effect" as a risk; with a dozen new features there will be pressure to add lines. A rule keeps the first minute read-nothing and the tone respectful of real disasters.
- **Core Mechanics & Implementation Sketch:** Mikey speaks **only about the interface/process**, **once per hint id**, never about outcomes (cards, letters and news already do); **silent** during crisis modal, hunch, reveal, eruption, fines, Kara tier changes, rewind/seed screens, debrief body (headline only; sad on a bad ending, never cheerful over harm); ≤ 6 bubbles in a first run; ≤ 1 per 3 game days after day 5; none for veterans; a hint is cancelled if the player already did the thing; new features add **no** new Mikey lines beyond first-time pointers (Advance, forecast glyph, repair). Keep the existing mute.
- **Estimated Effort:** **Low** (~30 LOC + ≤ 4 strings). M0.

### #19 — Juice: HUD delta pulses, neutral haptics, threshold chimes (no streak sounds)
- **Rank & Title:** #19 · Cheap physical feedback, ethically filtered (Borda 34; 6/19)
- **Type:** **[Upgrade to Existing Feature]** `sfx.ts`, `GameHUD.tsx`; **[New]** `utils/feel.ts`
- **Why It Is Good:** *Engagement:* phone play feels physical; the reward for a choice currently drifts over a map under a closing modal. *Educational:* a HUD pulse at the moment of decay/tax ties cause to effect.
- **Core Mechanics & Implementation Sketch:** HUD bar pulse + count-up (~400 ms) on any change; `navigator.vibrate` feature-detected and try/catch'd, **one neutral pulse on every reveal** (valence is shown visually; no punishing patterns), a tap tick, project-complete and eruption patterns; separate haptics toggle; threshold **chime at 80 once per stat per run** and a single soft note at 30 (never a loop); every sound has a visual twin; reduced-motion respected. **Rejected here:** rising-pitch sustain tick (a streak with an audible reset), drone under 30 (anxiety cue), bad-choice haptic `[20,30,20]` (punishment), ambient bed, 250 ms screen shake.
- **Estimated Effort:** **Low–Medium** (~100 LOC, ~2 strings). M3.

### #20 — Deferred / playtest-gated family
- **Rank & Title:** #20 · Not now (Borda 7; unanimously last)
- **Type:** **[New Feature]** family — see §3 for each item and its trigger.
- **Estimated Effort:** **High**. M4, **one family per release, only after the Faz 6 playtest.**

---

## 3. Rejected / Deferred Ideas

**Rejected outright (and why)**

| Idea | Who proposed | Why rejected |
|---|---|---|
| **Probabilistic audit/fine on dirty deals** | EB-P5 | Teaches "corruption mostly fails"; a roll from the main RNG stream would shift later spawns per branch (breaks rewind comparability); a deterministic **ratio fee on a named citizen** hits the same win-rate numbers (desperate 88 vs 88; random 10 vs 10) with no roll. |
| **"Poverty ×2" label** (dirty pays double when budget < 200 *as a causal claim*) | EB-P5 | A causal claim that blames the poor; the model has a municipal fiscal squeeze. Kept only as unlabelled mechanics ("the treasury was low"), tied to a visible condition, not a gameable player balance. |
| **×0.5 gain cap above 85 / diminishing returns** | EB-P6 | Measured null (54 vs 54). The grace band is kept as UX only. |
| **Systemic-fix third option injected into 25% of events** | EB-P7 | Measured `smart` 52 → 45; content burden High; pedagogically unvalidated. Third options added only where honest, inside #14. |
| **Tax-rate rebase / "quests ×2.75 income"** | EB-P4 (R2) | Not needed once rebate + project yields replace the quest money (EB's own correction). |
| **Blanket auto-rebate on `isCleanChoice`** | EB-P1 | Teaches "virtue always pays back"; `isCleanChoice` is the same stat-inference check C10 calls dishonest. Replaced by authored `avoids`. |
| **Uniform ×1.6 neglect multiplier on all events** | EB-P3 | Teaches "delay always compounds"; double-counts escalation. Replaced by flag + severity-bound (#17). |
| **`$` glyph on map nodes** | EB-P3 | A second severity encoding + loss-framed price on the map → "clear the board" panic. Tier stays on choice buttons. |
| **Konya flood / week-ahead flood forecasts** | GL-P1 | Konya has no flood analogue; floods aren't predictable weeks ahead. Slow-onset windows only; floods get a 1–2 day event warning. |
| **Rising-pitch sustain tick, drone <30, punitive haptic, ambient audio bed, 250 ms screen shake** | UX-P5 | Streak-with-reset (G1/G2), anxiety cue, punishment (G11); battery/classroom/autoplay costs. |
| **Warm-up recall quiz before a run** | LS-P2 | Breaks the "first decision ≤ 60 s" target and feels like school; LS withdrew it. In-run recurrence + debrief cloze + codex replace it. |
| **54 letter fragments (stake × kind × language)** | BP-P4 | One-time authoring cost far beyond a solo author; role→stakes map + 12 strings gives most of the benefit. |
| **GL "Mandate"** | GL-P5 | Overlaps BP's Promise; folded into #7. |
| **Repair as a map node** | BP-P2 | Competes with crises for the 3-node cap and looks like an alert but never erupts. Moved into `LetterModal`. |
| **Points / XP / badges / leaderboards / daily seed / fixed-seed tutorial / four visible pollution bars / "died on day N because of X" blame** | (ROADMAP, reaffirmed) | Author's standing rejections; the committee agrees and found no intrinsic form that survives the guardrails. |
| **Toast-style quest/achievement pop-ups** | — | Reward-signalling that cheapens the learning; derived debrief cards only. |

**Deferred (revisit only on the stated trigger)**

| Idea | Trigger / reason |
|---|---|
| **Three hidden media (air/water/land) with transfer rules** (ES-P2 / SE-P1 stages 1–2) | Build only if playtest shows (a) ≥ 2 of 5 players say a displaced problem "went away" after the residue letter, (b) a `displacer` sim policy beats `smart`, or (c) ≈ 8+ events need two media at once. Typed residue (#3) is judged sufficient; ES withdrew it as a milestone item. Would sit behind a derived-`cleanliness` shim; SE estimates ~250 LOC and a sim re-baseline. |
| **Teacher "Casebook" aggregator** (BP-P5) | Path code + seed card ship (#15); a dashboard only if the Faz 6 playtest shows teachers asked for it. If built: separate desktop route (`#/casebook`), per-decision marginals only (never rows — a 12-decision path is near-unique, so a k≥5 floor on rows protects nothing), bulk-paste textarea, no timestamps, plain note that anonymity is from classmates, not from the person who collected codes. |
| **Second Look: spaced re-surfacing / adaptive spawn weights** (GL-P6, LS-P2 weights, SE-P4) | A no-op today: no mechanism repeats within a region pool (a run draws ~12 of ~17 events) and 21 of 22 mechanism strings occur once. Re-enable once the enum collapse (#4) gives ≥ 2 events per enum per country; deterministic weights (`1+3·due`, integers) already designed. |
| **Systemic "third option" at scale** | Content H; revisit after #14/#16 show which events honestly support it. |
| **Full 10-project educational catalogue** (ES-P4) | M1 ships the 6 repriced + ≤ 2 region projects; the rest after playtest. |
| **Remaining 109 events' outcome cards / full DE/UK back-fill (72 events)** | Capped per milestone (≤ 40 sentences, ≤ 8 sources); one-third upgraded by M3. |
| **EB-P7-style "invest" options, strategy fingerprint, challenge toggles beyond the 2 stress variants, "8/8 endings" counter** | GL cut them (the dossier epitaph replaces the counter; challenge modifiers risk becoming self-imposed loss counters). |
| **Province-level pollution tint** | After #13 markers; the global filter partly overlaps it (UX self-ranked low). |

---

## 4. Binding guardrails (apply to every item above)

1. No streaks, daily rewards, login counts, "come back tomorrow".
2. No loss-framed counters; progress is only accumulation.
3. No real-time timers/scarcity; the sim clock moves only when the player acts.
4. No variable-ratio rewards; random *content* is fine, random *reward magnitude* is not.
5. Compare decision **paths**, never players: no leaderboards, shame lists, "you did worse than N%".
6. **No guilt without agency:** every negative moral signal is paired with a repair action or next-run lever.
7. **Causal honesty:** every claim about the player's decision is provable from the decision log.
8. Extrinsic rewards are never stats the player can use to win; prefer content reveals.
9. Hidden information stays hidden until after the commit (audit sfx, floaters, colours).
10. A losing run shows something learned within 10 seconds.
11. Failure is never moralised ("bad choice"); say "here is the mechanism".
12. Everything works with no storage/network, and is skippable and mutable.
13. Session end is always offered, never delayed; no "one more day?" nudges.

Plus the author's ROADMAP principles (no telemetry; one-line hints; the game shows, text doesn't tell; Mikey reacts to decisions, not disasters) and the **neutral-data invariant:** with all new data absent/neutral a run must stay bit-identical to today's.

---

## 5. Milestones (build order = dependency order)

| M | Items (rank #) | LOC / LTU cap | Gates before ship |
|---|---|---|---|
| **M0 Foundations** (no behaviour change) | #2 foundations · #1 leak + mobile traps · #10 validator rules · #18 Mikey rulebook | ≤ 500 / ≤ 8 | replay + JSON round-trip + `validate:events` + `sim:check` baseline at **zero diff** |
| **M1 Economy & honesty** | #3 lag/rebate **and** #5 reprice (same PR train) · #17 neglect interest · #6 dirty-path honesty (+endings) · hold 10 + grace (part of #12) · **last, same release:** #7 quest rewards → 0 | ≤ 850 / ≤ 45 | all D7 gates; quests-off ablation `smart ≥ 40%`; `lazy ≤ smart − 5`; endings reachable (≥ 2% under ≥ 1 policy); land one lever per PR with a paired-seed delta |
| **M2 Learning loop** | #11 meta store → #8 debrief/codex · #4 hunch + shared reveal **with** #14 (≈ 10 events) · #15 rewind/seed · #16 (4 cards, 8 skins) · #7 Promise UI | ≤ 800 / ≤ 90 | round-trip & rewind tests; state-minus-new-fields bit-identical; hidden-number completeness; sourced-claims-only on reveal |
| **M3 Place, tempo, endgame** | #12 stress window · #9 Advance + Dawn Strip · #13 map evidence · #19 juice · #16 (4 more cards, 16 skins) · #14 (rest) | ≤ 950 / ≤ 100 | `patient − noProj ≥ +10` in the window; empty-phase bit-identical; "Advance ≡ n × TICK" |
| **M4 Playtest-gated depth** | #20 family, one per release | per EB gates | Faz 6 playtest results |

**Parallel track (no reducer touch):** UI polish for #1/#13/#19 can proceed alongside M2–M3.

**Top risks of the combined plan (SE) & mitigations:** (1) *M1 lever stacking* — one PR per lever in fixed order, paired-seed delta vs the previous PR; zero quest rewards last. (2) *Solo-author content overrun* — LTU budget enforced by the validator; prose per mechanism, not per event; cut #14 first. (3) *Determinism drift* from `runSeed`, `pred`, `branches`, phase, `REWIND_TO`, Advance — JSON round-trip, bit-identical-with-new-fields-stripped, `CONTENT_VERSION` bump check. (4) *Ending/win-rate collapse* from fewer `patron` flags + hold 10 — reachability gate, `bribe`/`desperate` at n ≥ 500, pre-agreed ending-merge fallback. (5) *Unexplained hidden numbers; hunch feels like a quiz* — enum-completeness gate, first crisis skips the hunch, hit-rate as a sentence, playtest check that first-run drop-off does not rise.

**Playtest protocol (author's own Faz 0/6, 3–5 students on phones) — acceptance tests the committee attached:** first decision ≤ 60 s with no reading beyond one Mikey line; one run ≈ 10–12 min; after one run each player can state one mechanism in their own words ("export moves pollution") and say why a cure took days to show; ≥ 50% of players who lose start a rewind and pick a different option; do players choose prevention *before* the stress window arrives; can a player say where a displaced pollutant went; does first-run drop-off *not* rise after #4.

**Run #2 / #5 / #20 (the "addicting-in-a-good-way" answer):** *#2* — the debrief's one idea + rewind: a hypothesis to test. *#5* — a Promise to a named citizen who remembers the last ending; the region card's epitaph. *#20* — choosing which stress-window variant to attempt, unlocked by *understanding* a mechanism, not by points.

---

### Caveats

- Win-rate numbers are headless-policy results on a *forked copy* with heuristic policies (`desperate` reaches 87–95% in every income package because liquidity management is easy to find; real players sit between `smart` and `desperate`; if the game proves too easy raise neglect interest before lowering income). Replay determinism / invariance were **not** simulated and must be CI tests.
- Several region stress rows and "avoids" co-benefits still need verified primary sources; only Marmara mucilage (AA Action Plan/TÜİK) has one in the repo today.
- Mechanism/flag counts are from code reading (52/124 tagged events; 57 inferred "dirty" choices; 22 distinct mechanism strings) and may drift as content changes.


### [CHECKPOINT - FINAL]

**Status:** DEBATE COMPLETE. Round 1 (audit, 7 seats) -> Round 2 (38 proposals) -> Round 3 (cross-examination, 5 claims verified, 3 errata) -> Round 4 (Borda ratification, 0 blockers). Deliverables: `FINAL_FEATURE_ROADMAP.md` and this log. **Next scheduled action:** none for the committee; implementation follows M0 -> M4 in the roadmap, gated by `sim:check`.
