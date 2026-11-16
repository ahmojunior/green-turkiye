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
