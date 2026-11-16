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
