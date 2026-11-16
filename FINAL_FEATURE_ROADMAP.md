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
