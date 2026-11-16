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
