# Yeşil Türkiye — Educational Game Design Review

*Reviewer stance: an educational game designer and environmental-science educator. Target learners are high-school students aged about 14–18. The review looks at Türkiye; Germany and UK content is out of scope. It is based on commit `c98e9fa`.*

**How this review was done**

- **Read the code.** I read every file in `src/` and the README.
- **Played the game.** I ran the dev server (`npm run dev`) and played it in headless Chromium. Desktop runs were at 1280×720 and mobile-landscape runs at 844×390, with screenshots.
- **Simulated strategies.** I ran the real reducer (`gameReducer`) headless with scripted strategies, 300 runs per strategy per region, 4,200 runs per mode. These are heuristic bots, not humans. They open each crisis on the day it appears, and the "with projects" bots buy projects greedily. Read the numbers as evidence about the game's design, not as predictions of student behaviour.
- **Checked geometry.** I tested in the browser whether every spawn point and build slot actually falls inside its region.
- **Checked facts.** I verified real-world claims with web searches. Many primary pages could not be opened in full, so some figures rest on search-result excerpts; each is marked V / PV / U in §6.3, with links in §9.2.

---

## 1. Executive summary

1. **The answer is printed on the button.** `EventModal.tsx:100–118` shows every choice's exact effect on budget, happiness and cleanliness, colour-coded green, blue or yellow for good and red for bad. A bot that never reads a word of text, and only adds up the visible numbers, wins **82–100 %** of games in 5 of 7 regions (and 45–51 % in the other two). The educational text never enters the decision.
2. **The only real trade-off is money against "good", and money comes back.** In 44 of 48 Türkiye events the greenest option is the one that costs money; in 43 it is the most expensive. In 29 of 48 events, one option is at least as good as every other for both people and environment. The game teaches "green = expensive". It does not teach why pollution happens or what actually fixes it.
3. **Feedback is a number, never a reason.** No data field anywhere holds an explanation (`types/index.ts:48–55`). All effects are instant and forgotten (`gameReducer.ts:112–138`). Pollution never accumulates, never moves and never comes back. The game-over screen gives one line ("Bölge İflas Etti!", "The Region Went Bankrupt!").
4. **What wins is not what is learned.** Ignoring crises always loses, so the game trains reflex-clicking on pulsing red alarms. Polluting for cash and then buying projects wins Central Anatolia **94 %** of the time, more than any other strategy there. Goals reward survival time and the number of crises clicked.
5. **Geography is a difficulty slider.** A region changes four multipliers and which 5–6 events can appear. Events are not placed where they happen. **25 of 70** spawn and build coordinates fall outside their region or in the sea. The map has no rivers, lakes, seas or labels, and the player never has to know where anything is.

**Single biggest fix:** remove the numbers from the choice buttons. Replace them with **evidence → prediction → decision → "Ne oldu?" ("What happened?") explainer**. Consequences are hidden but can be worked out from the event's evidence, so knowing the mechanism, not reading arithmetic, becomes how you win (§8, Sketch 1).

---

## 2. How the game currently works

**Flow.**
- **Menu.** Choose a country (Türkiye, Almanya, Birleşik Krallık). Then choose one of 7 Turkish regions by clicking the SVG map. Each region has a description and a difficulty (Kolay / Orta / Zor, i.e. Easy / Medium / Hard). Then start (`MainMenu.tsx`).
- **Real-time loop.** `GameContext.tsx:343–356` dispatches `TICK` every 1000 ms, so **1 second = 1 game day**. The game pauses while an event or the project modal is open.

**What a TICK does (`gameReducer.ts:140–279`):**
1. Tax income: Low −2 / Normal +8 / High +18 budget per day, × region budget multiplier. Low tax adds 2 happiness; high tax costs 2 (`gameLogic.ts:56–78`).
2. Passive income from completed projects.
3. Constant decay: happiness −1/day and cleanliness −2/day, × region multipliers (`gameLogic.ts:17–18`).
4. Project countdown and one-time completion bonuses.
5. Crisis nodes age. Severity rises every 4 days. They drain 0, then 1, then 3 points per day, and **erupt** at 12 days for −12 happiness and −15 cleanliness (`gameLogic.ts:27–51`).
6. Quest (goal) check.
7. Win/lose check.
8. Spawn: chance 0.45 × region event multiplier per day, maximum 3 nodes. Events are drawn from a no-repeat bag of global events plus that region's events (`gameReducer.ts:219–260`).

**Resources.**

| Stat | Starts at | Range | Notes |
|---|---|---|---|
| Bütçe (Budget) | 500 M | unbounded | Game over at 0 |
| Mutluluk (Happiness) | 40 | 0–100 | Game over at 0 |
| Temizlik (Cleanliness) | 40 | 0–100 | Game over at 0. Map desaturates as it falls (`CountryMap.tsx:141–152`) |

**Player decisions.**
1. **Crisis events.** Click a pulsing node and a modal shows a title, a one-sentence description (9.8 words on average in Turkish) and **2 choices (45 of 48 events) or 3 (3 of 48)**. Each choice shows its exact numeric effects. There is no cancel button.
2. **Tax rate.** Three settings.
3. **Projects.** Six fixed projects, the same for every region and country (`projects.ts`): recycling plant, city park, eco park, solar plant (requires the recycling plant), water treatment plant, and smart grid (requires solar).

**Win and lose.**
- **Win:** hold happiness **and** cleanliness at or above 85 for 12 consecutive days (`gameLogic.ts:21–22`, `gameReducer.ts:198–216`).
- **Lose:** any stat reaches 0. The reason shown is one of "Bölge İflas Etti!" (The Region Went Bankrupt!), "Halk Ayaklandı!" (The People Revolted!) or "Bölge Zehirli Atık Bölgesi İlan Edildi!" (The Region Was Declared a Toxic Waste Zone!) (`App.tsx:64–73`).

**Feedback.**
- Floating numbers at the click position (`EventModal.tsx:24–50`).
- A good, bad or neutral sound chosen by `net = budget/50 + happiness + cleanliness` (`EventModal.tsx:52–55`).
- HUD bars and a sustainability streak bar.
- Goal toasts.
- After a choice, **no explanatory text of any kind** appears.

**Geography.**
- `provincePaths.ts` holds 81 provinces, each tagged with one of the 7 official regions. The region assignments are correct.
- In play the map is non-interactive (`App.tsx:166–174`, `interactive={false}`). The chosen region is painted green and everything else is grey.
- Province names exist only as SVG `<title>` hover tooltips.
- No seas, rivers, lakes, cities or labels are drawn.
- Nodes appear at one of four hard-coded points per region, jittered by ±2.5 % (`gameReducer.ts:244–248`). Where a node appears has nothing to do with the event's content.
- Seasons recolour the screen every 30 days (`App.tsx:75–83`). They do not affect any rules.

**Content volume.** There are 120 events; 48 can occur in Türkiye (9 global + 5–6 per region). That gives 14–15 possible events per region run. In my live Marmara playthrough, all 15 had appeared twice by about day 40.

**Observed strategy outcomes.** Win % over 300 runs per cell, with Normal tax.

*No projects bought (isolates event decisions):*

| Strategy | Marmara | Karadeniz | Ege | İç Anadolu | Akdeniz | Doğu | Güneydoğu |
|---|---|---|---|---|---|---|---|
| Never open crises | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| Always the "greenest" (max Temizlik) | 11 | 0 | 17 | 0 | 89 | 17 | 12 |
| Random button | 0 | 1 | 1 | 3 | 2 | 1 | 0 |
| Always the most money ("brown") | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| **Text-blind arithmetic** (max happiness + cleanliness + budget/40, keep ≥ 80 M) | **82** | **45** | **99** | **86** | **100** | **87** | **51** |

*With greedy project buying:*

| Strategy | Marmara | Karadeniz | Ege | İç Anadolu | Akdeniz | Doğu | Güneydoğu |
|---|---|---|---|---|---|---|---|
| Always greenest | 1 | 0 | 33 | 3 | 22 | 2 | 1 |
| Random | 4 | 13 | 66 | 45 | 52 | 21 | 24 |
| **Brown + projects** | 0 | 0 | 70 | **94** | 0 | 0 | 62 |
| Text-blind arithmetic | 31 | 30 | 83 | 63 | 75 | 57 | 63 |

What the three requested play styles showed:
- **(a) Always green.** Mostly goes bankrupt: 265–298 of 300 runs in most regions.
- **(b) Random.** Almost always loses without projects. With projects it does better than "always green".
- **(c) Careful.** Wins, but it does so purely by reading numbers.

The labelled difficulties also do not match outcomes. Karadeniz ("Orta", Medium) is the hardest region by simulation. İç Anadolu ("Kolay", Easy) is harder than Ege and Akdeniz ("Orta").

---

## 3. Why players click without learning (root-cause analysis)

### A1. The answer key is printed on every button (signposting)
**Evidence.**
- `EventModal.tsx:100–118` renders each choice's `budget`, `happiness` and `cleanliness` deltas with icons. Positive values are coloured `#16a34a` (green), `#2563eb` (blue) or `#eab308` (yellow); every negative is `#dc2626` (red).
- `EventModal.tsx:52–55` adds a "good" or "bad" sound based on the same numbers.
- The labels themselves moralise: "Görmezden Gel (Rüşvet)" (Look the Other Way, Bribe), "Projeyi Onayla (Temiz Enerji)" (Approve the Project, Clean Energy), "Kendi Kendine Geçmesini Bekle" (Wait for It to Pass on Its Own), "Doğal Akışına Bırak" (Let It Run Its Natural Course).
- The text-blind bot in §2 proves the point: delete every description and the game plays exactly the same.

**Diagnosis.** This is textbook *chocolate-covered broccoli* (Bruckman 1999), or in Habgood & Ainsworth's (2011) terms a lack of **intrinsic integration**. The learning content (environmental text) is separate from the core mechanic (comparing three integers). Cognitively, everything needed to decide is in the numbers, so the explanation never enters working memory. No germane processing happens.

**Missing mechanic:** consequences that are *hidden but can be inferred* from domain information.

### A2. There is no real dilemma, only "pay to be good"
**Evidence** (from analysing the effects in `src/data/events.ts`):
- In **44 of 48** Türkiye events the greenest option costs money; in **43** it is the most expensive.
- In **29 of 48**, one option is at least as good as every other for both happiness and cleanliness, so people and environment never conflict.
- **5 options are free lunches**, non-negative on every stat:
  - `izmir-wind-farm` "Projeyi Onayla" (Approve the Project): +60 / +5 / +15. The bird conflict in the event's own description costs nothing.
  - `urfa-solar` "Özel Sektörü Davet Et" (Invite the Private Sector).
  - `solar-incentive` "Sadece Çorak Araziye İzin Ver" (Only Allow Barren Land).
  - `factory-waste` "Ağır Para Cezası Kes" (Impose a Heavy Fine).
  - `tourist-season` "Eko-Turizm Kotası Koy" (Set an Eco-Tourism Quota).
- 45 of 48 events are binary, typically "act (pay)" against a **strawman**. For example, `istanbul-mucilage`'s "Kendi Kendine Geçmesini Bekle" (wait it out) costs −30 / −30.
- Budget regenerates every day (tax +8; smart grid +40), so even the money cost is soft.

**Diagnosis.** Real environmental policy is hard because of *who pays* (Konya farmers against an aquifer), *when* (short-term jobs against long-term health), and *where the pollution goes* (deep-sea discharge, exporting waste). The game has none of that. With no desirable difficulty (Bjork & Bjork 2011), there is nothing to reason about. Worse, the 29 "green = also popular" events teach a false heuristic: that environmental action is always popular.

**Missing mechanic:** trade-offs across stakeholder, time and medium, where no option dominates.

### A3. Feedback is immediate but shallow
**Evidence.**
- `EventChoice` is just `{ text, effects }` (`types/index.ts:48–55`). There is nowhere to store a cause, a mechanism or a source.
- After clicking, the modal closes (`gameReducer.ts:136`, `activeEvent: null`) and numbers float away.

**Diagnosis.** The feedback only *verifies* (+/−). Reviews of formative feedback (Shute 2008; Hattie & Timperley 2007) consistently find *elaborated* feedback, which explains why, works better than verification alone. Players cannot build a causal model they are never shown.

**Missing mechanic:** a post-decision **causal explainer** ("Ne oldu, neden?", What happened, and why?).

### A4. Consequences are instant, forgotten and disconnected
**Evidence.**
- All effects are applied in one step in `HANDLE_CHOICE` (`gameReducer.ts:112–138`).
- `GameState` (`types/index.ts:89–110`) has no decision history, flags or pending effects. Taking the bribe in `factory-waste` never produces dead fish later. Overpumping in `konya-sinkhole` never produces a sinkhole later.
- Decay is a constant per region (`gameLogic.ts:17–18`). A +20 cleanliness choice cancels any earlier damage.

**Diagnosis.** Pollution is a **stock** problem: nutrients build up into mucilage, aquifers drain into sinkholes, heavy metals stay in soil. People are known to misjudge stocks and flows (Booth Sweeney & Sterman 2000, "bathtub dynamics"). The game models everything as a flow that resets instantly, so it reinforces exactly that misconception. It also makes "pollute now, buy tech later" a winning strategy (Brown + projects, 94 % in İç Anadolu).

**Missing mechanics:** persistent pollutant stocks, delayed effects and follow-up events.

### A5. You can win without reading, knowing or reasoning
**Evidence.**
- Nothing in the rules reads the description fields.
- Goals (`quests.ts`) reward budget over 1 billion, 80 % happiness, 85 % cleanliness, reaching day 20 or 40, and resolving 5 or 12 crises. All of these are volume or outcome targets.

**Diagnosis.** On Bloom's taxonomy, the highest level the game requires is *compare two numbers*. It does not require *remember* (no recall), *understand* (no explanation), *apply* (no new situations) or *evaluate* (nothing is genuinely contested).

**Missing mechanic:** any task where knowledge changes the outcome.

### A6. No prediction, retrieval or reflection
**Evidence.** The flow is click → choose → close. There is no prompt anywhere and no quiz, codex or end-of-run review.

**Diagnosis.** Predict–Observe–Explain (White & Gunstone 1992) and the **pretesting effect** both apply: even a *wrong* guess before seeing the answer improves later retention (Richland, Kornell & Kao 2009). Spaced retrieval also beats re-reading (Roediger & Karpicke 2006). The game wastes its natural retrieval opportunities: every event repeats about twice per run, but because the numbers are fixed, the repeat tests memory of the button, not of the science.

**Missing mechanics:** a predict-then-reveal step and spaced retrieval checkpoints.

### A7. Failure punishes but does not inform
**Evidence.**
- `GameOver.tsx:10–36` shows a title, a one-line reason and days survived, then "Tekrar Oyna" (Play Again).
- There is no timeline, no "which decision caused this", and no seeded replay, because randomness comes from `Math.random()` inside the reducer (`gameReducer.ts:224, 237, 245`).

**Diagnosis.** *Productive failure* (Kapur 2008) only works with a consolidation phase that compares the learner's attempt with the canonical explanation. Here failure leads only to a reshuffled, different game, so players cannot test a hypothesis and fall back to guessing.

**Missing mechanic:** a mistake-review report card ("Karne") and replayable scenarios.

### A8. The score rewards the wrong behaviour
**Evidence.**
- Victory is "both bars ≥ 85 for 12 days", which can be achieved with or without understanding.
- **Temizlik is one scalar** that lumps together air, water, soil, biodiversity (invasive fish, turtles, wolves), natural hazards (landslides) and energy. Two events have no cleanliness effect at all (`erzurum-snow`, `marmara-earthquake-retrofit`).
- In `izmir-wind-farm` *both* options give +15 cleanliness, so the event's own dilemma (birds) is invisible in the score.

**Diagnosis.** If one bar stands for everything, the player cannot learn distinctions such as "this moves pollution from water to air" or "this harms biodiversity but not air quality". The extrinsic rewards (goal toasts for clicking 12 crises) also displace intrinsic, competence-based motivation (Deci & Ryan's self-determination theory).

### A9. "Red buttons" train reflexes
**Evidence.**
- Nodes are pulsing amber, orange and red `AlertCircle` buttons with ping animations (`App.tsx:178–211`).
- Every event, including opportunities such as `solar-incentive` and `green-jobs-training`, opens under a red `AlertTriangle` header (`EventModal.tsx:78–86`).
- Unanswered nodes drain stats and erupt (`gameLogic.ts:45–51`). A player who never opens a crisis loses every time, by day 11–17.

**Diagnosis.** The game's strongest, most consistent lesson is "click red things quickly". That is exactly the behaviour the developer reports seeing. The modal does pause time (`GameContext.tsx:355`), so reading is not penalised, but nothing in the modal makes reading worthwhile.

### What already works (keep it)
- `TUNING` centralises balance (`gameLogic.ts:10–34`).
- The reducer is close to pure and easy to simulate (I drove it headless without changes).
- The win condition, *sustained stability rather than a spike*, is a good seed for systems thinking.
- Escalating node severity creates real triage.
- The no-repeat event bag works.
- The modal pauses the game.
- The map visibly degrades as cleanliness falls.
- Events already reference real, recognisable Turkish places and controversies: mucilage, obruks (sinkholes), HES protests, Caretta caretta, a Hasankeyf-like dam.
- The three-language structure is in place.
- There is a tutorial, and a mobile-landscape layout variant.

---

## 4. General improvements

### 4.1 Gameplay, balance and pacing
- **Difficulty labels are wrong.** Re-derive them from simulation (see the §2 tables). Run the bot harness as a balance check whenever `TUNING` or event effects change.
- **Pacing is too fast and too short.**
  - At 1 s per day, winning runs end around **day 34–59**, under a minute of live ticking (`GameContext.tsx:349`).
  - Seasons change every 30 days (`App.tsx:78`), so winter (day 90+) is almost never reached, and seasons do nothing anyway.
  - Fix: add a speed control (0.5×, 1×, 2×) and make a "day" represent a week or a month. Make seasons matter: stubble burning in summer and autumn, coal-heating smog in winter, fire risk and tourism peaks in summer.
- **Projects are generic and illogical.**
  - The solar plant requires the recycling plant (`projects.ts:48`). There is no causal reason for this.
  - "Akıllı Şebeke" (Smart Grid) produces +40 budget per day "through efficiency" (`projects.ts:67–77`). It is the dominant economic engine and teaches nothing.
  - The same six projects exist in every region. Make projects region-specific and tied to a medium. For example: advanced biological treatment with N/P removal (Marmara), drip irrigation with a water quota (Konya), flue-gas desulfurisation (coal provinces), a sanitary landfill instead of a wild dump, and coastal setback zoning (Aegean and Mediterranean).
- **Content runs out.** 14–15 events per region repeat within one run. The target should be ≥ 25 per region before adding mechanics that need variety.
- **Goals** (`quests.ts`) should reward understanding, for example "Explain 3 causes of mucilage" or "Correctly predict 5 outcomes", rather than survival and click counts.

### 4.2 UX and UI
- Use different visual framing for crises, opportunities and policy debates. Not every event should be a red alarm.
- Add a "Detaylar / Kaynak" (Details / Source) expander to events.
- Place floating numbers near the HUD bar they affect, not at the cursor (`EventModal.tsx:24–50`), so cause and effect are visually linked.
- The game-over screen needs a decision timeline and the main contributing causes (see §8).
- The modal cannot be dismissed. That is acceptable, but add `role="dialog"`, focus trapping and an Escape key that does nothing harmful.

### 4.3 Mobile and responsive
- The menu **forces portrait** (`MainMenu.tsx:97–100`, orientation lock at line 37) while the game **forces landscape** (`App.tsx:93–96`, lock at `MainMenu.tsx:444`). Players have to rotate twice.
- In portrait the region-select map is about 320 px wide. Provinces become a few pixels across, far below a 44×44 px touch target. A list of the 7 regions as large buttons next to the map would fix this.
- At 844×390 landscape the tax panel covers the western third of the map (Ege and Marmara), and nodes can spawn underneath it. The sustainability label also overlaps its counter in the HUD. The README already lists "Mobile Optimization" as open.

### 4.4 Accessibility
- `index.html:2` declares `<html lang="en">`, but the default UI language is Turkish (`LanguageContext.tsx:21`). Screen readers will mispronounce everything. Set `lang` dynamically.
- `src/` contains **zero** `aria-*` or `role` attributes. Crisis nodes carry only a `title`.
- Effect colours `#2563eb` and `#dc2626` on the near-black modal come out at roughly 3.4–3.6 : 1 by my calculation (background approximated). That is below WCAG AA's 4.5 : 1 for 14 px bold text.
- Nothing respects `prefers-reduced-motion`; there are permanent `animate-ping` pulses.
- Severity is shown by colour, size and animation only. Add a text or number badge (1/2/3).

### 4.5 Code quality and architecture limits on content
- **`src/data/events.ts` is 2,042 lines** of hand-written objects in three languages, with no schema, no source field and no country field. Region IDs share one global namespace.
  - Adding even one field means editing 120 objects.
  - Move to one JSON file per country and region, with a schema validator run in CI. The validator should require `location`, `explanation`, `sources[]` and `tags.pollutionType` on every event.
- **Randomness inside the reducer** (`gameReducer.ts:224, 237, 245`) makes runs impossible to reproduce. Put a seeded RNG state into `GameState`. That enables replays, a fixed "case study" seed, fair classroom comparisons and deterministic tests.
- **There are no tests.** The reducer is easy to test. Add Vitest and the simulation harness, for example asserting that "a text-blind bot must not exceed X % wins once numbers are hidden".
- **ESLint currently fails** with 3 `react-refresh/only-export-components` errors (`GameContext.tsx:19`, `GameEffectsContext.tsx:50`, `LanguageContext.tsx:54`). CI (`.github/workflows/deploy.yml`) only builds, so lint is never enforced. The workflow also uses `npm install` instead of `npm ci`.
- **Dead code:** `src/data/countries/turkey/countryOutline.ts` is not imported anywhere, and it names a generator script (`scripts/gen-country-outline.cjs`) that is not in the repo.
- Choices are referenced by array index (`HANDLE_CHOICE` payload). Give them stable `id`s before adding analytics or a decision log.

### 4.6 Bugs and inconsistencies found
- **Off-region coordinates.** 25 of 70 spawn points and build slots fall outside their region or in the sea at 1280×720:
  - All 3 eastern Karadeniz spawn points are in the sea.
  - 5 of 6 Akdeniz build slots are in Konya, Aksaray or Kayseri.
  - Güneydoğu builds land in Kahramanmaraş, Malatya and Elazığ.
  - Two Ege spawn points are in the sea.

  There are two causes: the coordinates are hand-tuned percentages, and the nodes layer measures from a wrapper that includes `CountryMap`'s `p-4` padding (`CountryMap.tsx:158`). Because that padding is fixed in pixels, the error changes with viewport size. Fix it by placing nodes at province centroids computed from `getBBox()` or precomputed, in SVG coordinates.
- **Province name typos** (`provincePaths.ts`): 'Kinkkale' → Kırıkkale (line 70), 'Eskisehir' → Eskişehir (46), 'Elaziğ' → Elazığ (75), 'Adiyaman' → Adıyaman (79), 'Diyarbakir' → Diyarbakır (80), 'Gümüshane' → Gümüşhane (84), 'K. Maraş' → Kahramanmaraş (71).
- **Delayed game over.** `HANDLE_CHOICE` can push budget to 0 or below, but game over is only checked on the next `TICK`.
- **Lost toasts.** When two goals complete in the same tick, only the last one's toast is shown (`gameLogic.ts:134`).
- **Translation.** The German text for *inci kefali* is "Perlmuräne" (`events.ts`, `van-lake-pollution`). *Muräne* means moray eel, so this is very likely wrong. A native speaker should check it.

---

## 5. Educational improvements

### 5.1 Content audit (accuracy, depth, clarity)

| Item (file) | What the game says or implies | Problem | Fix |
|---|---|---|---|
| `istanbul-mucilage` (events.ts:319) | "Acil Temizlik Seferberliği" (Launch an Emergency Cleanup Effort) is the best answer (+20/+20) | It teaches treating the symptom. Mucilage is driven by nitrogen and phosphorus loading from insufficiently treated wastewater, combined with warming and stratification. The government's response centred on advanced biological treatment (see §6.3). | Rewrite with three options: surface skimming (fast, temporary), advanced biological N/P removal (slow, expensive, durable) and diffuse-source control (fertiliser, industry). Make the regrowth a delayed effect. |
| `ewaste-dump` (events.ts:93) | Exporting e-waste gives +40 budget **and +5 cleanliness** | It rewards moving pollution elsewhere. Transboundary hazardous-waste movement is regulated (Basel Convention). | The export option should give cleanliness 0 locally plus a legal or reputational risk event, with an explainer on pollution displacement. |
| `konya-sinkhole` (events.ts:483) | "Modern Sulamaya Geç" (Switch to Modern Irrigation) is a clean win | Efficiency gains often expand the irrigated area instead of saving water (the rebound or Jevons effect; Grafton et al. 2018 [S44], FAO [S45]). | Add a delayed follow-up: drip irrigation without a quota leads to irrigated area expanding and the water table still falling. |
| `izmir-wind-farm` (events.ts:144) | A Çeşme wind farm "sits directly on a migratory bird route" | **Unverified:** I found no documentation of Çeşme as a migration bottleneck (opposition there rests on protected-site and landscape grounds). The documented bottlenecks are the Bosphorus and the Belen Pass in Hatay (case 16). The bird concern also has no effect in the game. | Move the event to Belen (Hatay, Akdeniz) or İstanbul's northern forests, or reword it around a protected natural site in Çeşme. Model the bird impact in a biodiversity stat. |
| `izmir-geothermal` (events.ts:337) | Generic "energy vs farmland" | The documented controversies are in Aydın (Germencik), Denizli (Kızıldere) and Manisa (Alaşehir): H₂S odour and boron- or arsenic-rich brine. The impact depends on reinjection. | Relocate the event and teach "low-carbon is not the same as impact-free": reinjection versus surface discharge. |
| `fındık-pesticide` (events.ts:230) | Hazelnut shipments rejected for pesticide residue | Inaccurate as framed. EU notifications for Turkish nuts are mainly for **aflatoxin**; pesticide-residue problems concentrate on lemons, peppers and grapes (case 37). | Make it an aflatoxin and storage-moisture event, or move the pesticide story to products where it is documented. |
| `marmara-urban-renewal` (events.ts:110) | Demolition causes "moloz ve toz" (rubble and dust) | It misses the key hazard, **asbestos** in old building stock. | Name asbestos and add a "safe demolition protocol" option. |
| `dust-transport` (events.ts:282) | An afforestation barrier helps against Syrian desert dust | Local tree belts cannot stop dust carried at the scale of weather systems. This is an oversimplification. | Options: early-warning system and health advisories (effective), regional cooperation (slow), local afforestation (helps with local soil erosion only). |
| `med-invasive-fish` (events.ts:162) | Bounty → +5 "Temizlik" | The bounty is real policy (5 TL per tail, 2021–2023). But this is biodiversity, not cleanliness, and silver-cheeked toadfish are poisonous (tetrodotoxin). | Tag it as biodiversity and add a food-safety line. |
| `southeastern-tigris-dye-pollution` | Small textile dye-houses polluting the Dicle (Tigris) | **Unverified** as a documented Dicle-specific problem. Textile-dye pollution is well documented in the Ergene and Thrace (§6.3). | Re-anchor it to the Ergene, or source it before keeping it. |
| `solar-incentive` (events.ts:74) | Solar on farmland gives the highest cleanliness (+20) | This mixes up a land-use conflict with pollution. | Score land and food security separately. |
| `olive-mining` (events.ts:447) | Muğla lignite against olive groves | It is real-ish, but the documented cases are Yırca (Soma, Manisa, 2014: about 6,000 olive trees) and Akbelen (Muğla, 2023: forest). | Split it into two accurate, sourced cases (§6.3). |
| Projects (`projects.ts`) | "Su Arıtma Tesisi" (Water Treatment Plant) | It is ambiguous whether this means drinking-water treatment or **wastewater** treatment ("atık su arıtma"), which is what reduces pollution. "Geri Dönüşüm Tesisi" (Recycling Plant) "sorts waste"; the zero-waste hierarchy (reduce > reuse > recycle) is absent. | Rename them and add tiers (pre-treatment, biological, advanced N/P removal). |
| Region text (`regions.ts:30`) | Karadeniz: "Doğa kendini toparlar" (nature recovers by itself) | This is misleading. The Black Sea region had the 2021 Bozkurt flood, HES conflicts and quarry conflicts (§6.3). | Remove it. |
| Region text and modifiers (`regions.ts:68, 79`) | İç Anadolu: "Sakin… İyi bir başlangıç bölgesi" (calm, a good starter region); cleanliness decay 0.8 "Low industry" | The region has Turkey's most acute groundwater crisis (the Konya Closed Basin) and large industrial zones in Ankara, Kayseri, Konya and Eskişehir. | Rewrite it. The "easy" region should not be the one with the worst water stock problem. |
| Non-pollution events | `erzurum-snow`, `marmara-earthquake-retrofit`, `eastern-wolf-livestock`, `rize-tea-landslide`, `malatya-apricot`, `gap-dam` | These are fine as civic or hazard content, but they dilute the pollution focus and are all scored as "Temizlik". | Tag them as hazard, biodiversity or heritage, and score them in the matching dimension. |
| Every description | About 10 words, with no numbers, causes or sources | There is not enough information to reason from. | Use 2–3 sentences, add one data point, and cite one source per event. |

### 5.2 Mechanics that turn clicking into learning
Ordered by learning return per unit of effort:

1. **Hide numbers, show evidence (inferable consequences).** Each event shows 2–3 *Kanıt* (evidence) cards, such as a measurement, a stakeholder quote or a map overlay. Options show only a qualitative cost tier ("Maliyet: Yüksek", Cost: High) and a time horizon ("Etki: uzun vadeli", Effect: long-term). An optional "Uzmana Danış" (Ask an Expert) action costs budget and reveals one more clue, so information has value.
2. **Predict → reveal → explain.** Before the choice is committed, ask one question: "Sence 30 gün sonra en çok hangi gösterge değişir?" (Which indicator do you think will change most in 30 days?). Or, on a first encounter, a pretest such as "Obruklar neden oluşur?" (Why do sinkholes form?). Then show a **"Ne oldu?"** card with:
   - what happened;
   - *why*, as a short causal chain;
   - one real Turkish case and its source;
   - whether the prediction was right, and why.
3. **Dilemmas with no dominant option.** Each event offers three options that differ on *who pays*, *when* it pays off and *where* the pollution ends up. Example rewrite of `konya-sinkhole`:
   - (a) Close illegal wells. Aquifer recovers slowly; farmer happiness drops sharply; enforcement costs money.
   - (b) Subsidise drip irrigation *without* a quota. Popular and expensive; **delayed**: irrigated area expands and the water table keeps falling.
   - (c) Drip irrigation **plus** a metered water quota **plus** a crop shift away from water-hungry crops. Expensive and slow, moderately unpopular; it is the only option that stabilises the aquifer.

   A player who knows the rebound effect picks (c). Without that knowledge, (b) looks best.
4. **Stocks, delays and follow-ups.** Pollutant stocks for each medium; choices change daily *pressure* rather than a one-off jump. Flags trigger follow-up events. For example, "Görmezden Gel (Rüşvet)" sets `factoryBribed`, and 15–25 days later "Ergene'de balık ölümleri" (fish deaths in the Ergene) appears downstream.
5. **Multi-dimensional environment.** Replace Temizlik with **Hava** (air), **Su** (water), **Toprak** (soil), **Biyoçeşitlilik** (biodiversity), plus a derived **Halk Sağlığı** (public health) that feeds happiness. Players learn categories by seeing which bar moves.
6. **Codex ("Çevre Ansiklopedisi", Environmental Encyclopedia).** Entries on mechanisms (eutrophication, groundwater drawdown, PM2.5), places and policies, unlocked by events. Each entry has one real chart (§5.4) and one source.
7. **Retrieval checkpoints ("Saha Raporu", Field Report).** Every about 10 days, one question from codex entries unlocked earlier, spaced and interleaved. A correct answer gives *Bilgi Puanı* (knowledge points), which can be spent on expert consultations. A wrong answer gives a two-line explanation.
8. **Mistake review ("Karne", Report Card) at the end of every run.** A decision timeline, the three decisions that moved the outcome most, prediction accuracy per topic, and "Bu krizi tekrar oyna" (Replay this crisis), which replays from a saved seed.
9. **Case-study scenarios.** Scripted 10–15 minute missions built on real cases (Marmara 2021, Konya Basin, Ergene, Bozkurt 2021) with fixed seeds, so a class can compare results.
10. **Adaptive scaffolding.** Show hints on a player's first encounters with a topic, then fade them (worked examples, then fading). Weight event selection towards topics the player keeps getting wrong.

### 5.3 Measuring learning
- **Write learning objectives first, tagged with Bloom levels.** For example:
  - "Explains how nutrient loading leads to mucilage" (Understand).
  - "Links groundwater over-extraction to sinkhole formation in the Konya Basin" (Understand).
  - "Places a pollution source in its river basin and predicts downstream impact" (Apply).
  - "Compares short- and long-term effects of two policies" (Analyse).
  - "Justifies a solution while weighing stakeholder interests" (Evaluate).
- **Pre/post test.** 8 items (parallel forms A and B), given at first launch and after the third run or at the end of a scenario. Include 2 *transfer* items about places or problems not in the game.
- **In-game mastery.** For each tag (pollution type, mechanism, region), track an exponentially weighted accuracy of predictions, retrieval answers and map-location answers. Show it in the Karne.
- **Separate playing well from learning well.** Log win rate *and* prediction accuracy. If win rate rises while prediction accuracy stays flat, the game can still be gamed.
- **Privacy.** Players are minors, so keep data in `localStorage` by default (KVKK, Turkey's data-protection law, applies). An optional teacher export can be a copy-paste summary code; no server is needed.

### 5.4 Pollution coverage
This is my tagging of the 48 Türkiye events. Some events have more than one tag.

| Type | Events now | State | What's missing |
|---|---|---|---|
| Air | ~8 (Bursa smog, Ankara traffic, stubble burning, dust, demolition, quarry, balloons, Bosphorus ships) | Generic | Coal power plants (Afşin-Elbistan, Çatalağzı); winter coal heating in eastern provinces; WHO vs national limits; PM2.5 health burden |
| Fresh water | 5 | Shallow | Ergene, Gediz, wastewater treatment as a system (only 76.9 % of the municipal population is served by treatment plants, TÜİK 2024: case 39); the river-basin concept |
| Marine | 3 | Mucilage is mis-modelled | İzmir Bay hypoxia, İzmit Bay industry, marine litter, deep-sea discharge |
| Groundwater / quantity | 4 | Konya, Tuz Gölü, citrus, Euphrates | The rebound effect; Harran salinisation; nitrate pollution |
| Soil / land | 5 | Mostly land use | Heavy metals, mining waste, asbestos, salinisation |
| Plastic / waste | 4 | Plastic bags (the real 1 Jan 2019 fee of 25 kuruş, which reportedly cut use by about 75 %, is not named: case 35), greenhouse plastic, e-waste, microplastics | Wild dumps against sanitary landfills, Sıfır Atık (Zero Waste), plastic waste imports |
| Noise | ~2 (incidental) | Underdeveloped | Urban traffic noise, noise maps |
| Light | **0** | Missing | Urban skyglow; turtle hatchlings disoriented by beach lighting; dark-sky siting of observatories (TÜBİTAK TUG and DAG, cases 11, 30, 40) |
| Industrial | ~6 | Generic factories | OSB joint treatment; Dilovası; İskenderun steel; cyanide gold mining (Kaz Dağları, İliç) |
| Agricultural | ~7 | Mostly water quantity | Fertiliser runoff, pesticide residues done accurately, stubble burning in its season |
| Energy | ~9 | Renewables only, plus one HES | Coal: air, ash, health; geothermal fluid handling; the fuel-switch story |
| Cross-border | 1 (dust) | Thin | Black Sea inflow to the Marmara; downstream Euphrates and Tigris |

---

## 6. Geography education improvements

### 6.1 How geography is represented today, and why it can be ignored
- **The region is a difficulty preset.** It sets four multipliers (`regions.ts`) and the regional event list. Nothing else changes.
- **Events and locations are not linked.** The event text names places (Rize, Bursa, Van, Konya, Mersin), but its node appears at a random spawn point anywhere in the region (`gameReducer.ts:244–248`). Nine global events appear everywhere. A "Van Gölü" crisis can pulse over Erzurum.
- **The map carries almost no information.** It has no water bodies, no rivers, no basins, no protected areas, no cities and no labels. In play it is non-interactive. Province names are hover-only tooltips, and seven of them are misspelled (§4.6).
- **Nothing crosses region borders.** There is no interaction between regions, no flow downstream and no single-country view.
- **The result: the player never needs to know where anything is.** Geographic knowledge cannot affect the outcome.

### 6.2 Making location matter mechanically
1. **Bind events to places.** Add `location: { provinces: ['Konya','Aksaray'], basin: 'Konya Kapalı Havzası', feature: 'obruk', coast?: 'Marmara' }`. Spawn the node at the centroid of one of those provinces, computed with `path.getBBox()` once and cached.
2. **"Nerede?" (Where?) tasks.** For a share of events (more of them early on), ask the player to tap the province or basin before the modal opens. Feedback is graded by distance: "Doğru il!" (Right province!), "Komşu il — Konya'nın batısındasın" (Neighbouring province: you're west of Konya), "Yanlış bölge" (Wrong region). Correct answers earn Bilgi Puanı.
3. **Map layers the player can toggle:**
   - Seas: Karadeniz, Marmara, Ege, Akdeniz.
   - Major rivers: Kızılırmak, Yeşilırmak, Sakarya, Fırat, Dicle, Gediz, Büyük Menderes, Ergene–Meriç, Seyhan, Ceyhan.
   - Lakes: Van, Tuz, Beyşehir, Eğirdir.
   - River basins.
   - Protected areas (special environmental protection areas, Ramsar sites).
   - Industrial corridors (Gebze–Dilovası–İzmit, Bursa, Ergene/Çorlu–Çerkezköy, İskenderun).
   - Coal belts (Zonguldak, Soma, Muğla, Afşin-Elbistan).
   - Climate zones.
4. **Consequences that travel.** A small flow graph, for example:
   - Ergene → Meriç → north Aegean.
   - Gediz → İzmir Bay.
   - Black Sea surface water → Bosphorus → Marmara.
   - Euphrates: Keban → Karakaya → Atatürk dam chain → downstream.
   - Prevailing winds carrying a coal-plant plume.

   Pollution added upstream shows up downstream after a delay. This is the most direct way to teach basin thinking.
5. **Geography-dependent rules.**
   - Coastal provinces can host marine events; inland ones cannot.
   - Karstic or closed basins (Konya) amplify groundwater-depletion effects.
   - Cold eastern provinces add winter heating smog.
   - Mediterranean and Aegean summers raise fire and tourism pressure.
   - Black Sea slopes amplify flood and landslide risk from building in stream beds.
6. **Country mode (big bet).** Manage several regions with one national budget. This creates upstream/downstream conflicts, as on the Euphrates or in the Ergene–Marmara system, and makes regional interdependence visible.

### 6.3 Real, documented Turkish cases to use as content
Status codes: **V** = verified against the cited source(s); **PV** = partly verified (some details only in news or NGO reports); **U** = unverified and needs a source before it is used. Source links are in §9.

Verification note: facts were checked with web searches. Many official pages and PDFs could not be opened in full, because WebFetch failed with DNS errors on several sites, so some figures rest on search-result excerpts of the cited sources. Open the primary document before any figure ships to students.

#### Marmara

| # | Case (place) | One-line accurate description | Game mechanic it can power | Status | Src |
|---|---|---|---|---|---|
| 1 | **Marmara Sea mucilage, 2021** (İstanbul, Kocaeli, whole sea) | Phytoplankton mucilage blanketed the sea in spring 2021. The drivers were nitrogen/phosphorus loading from poorly treated wastewater, warming and stratified water. A 22-point action plan followed (6 Jun 2021), and the whole sea was declared a Special Environmental Protection Area (Resmî Gazete, 5 Nov 2021). | Stock and delay model (nutrients accumulate, then bloom); three-option treatment dilemma (skimming vs advanced biological treatment vs diffuse sources); scenario mission | V | S1–S4 |
| 2 | **Ergene River** (Tekirdağ, Edirne, Kırklareli) | Textile and leather industrial-zone effluent and municipal sewage made the Ergene one of Turkey's most polluted rivers. Joint treatment and a deep-sea discharge pipe into the Marmara followed. | Basin propagation (Ergene → Meriç / Marmara); "pollution displacement" lesson (the deep-sea outfall moves the load, it does not remove it) | PV | S5, S6 |
| 3 | **İzmit Bay and Dilovası** (Kocaeli) | A heavily industrialised bay with a hypoxic lower layer. Dilovası exceeded the daily PM10 limit 42–92 times a year in 2016–2018 at one station. | Industrial-corridor air events; "Nerede?" task on the Gebze–İzmit corridor | PV | S7, S8 |
| 4 | **Istanbul and national air quality** | Istanbul's 2022 PM10 average (~38 µg/m³) roughly met the national limit but was ~2.5× the WHO 2021 guideline. THHP estimates tens of thousands of PM2.5-attributable premature deaths a year in Turkey (NGO model). | "Whose standard?" data card (national vs WHO); health stat in Sketch 2 | PV | S9 |
| 5 | **Kaz Dağları / Kirazlı gold mine** (Çanakkale) | A cyanide heap-leach gold project in the Atikhisar dam catchment cleared forest. That led to the 2019 "Su ve Vicdan Nöbeti" (Water and Conscience Watch) protest; tree-loss estimates range from 13,400 to ~195,000. | Stakeholder dilemma (jobs vs drinking-water catchment); handling disputed evidence (teach "estimates differ") | PV | S10, S11 |

#### Ege (Aegean)

| # | Case | Description | Mechanic | Status | Src |
|---|---|---|---|---|---|
| 6 | **İzmir Bay fish deaths** (İzmir) | Mass fish deaths in the inner bay in late summer 2023 and again in 2024, from oxygen depletion driven by nutrient loading and algal blooms. | Downstream consequence of untreated Gediz and urban loads; delayed event | PV | S12, S13 |
| 7 | **Gediz basin** (Manisa, İzmir) | Organised industrial zones, including three tannery zones, plus agro-industry and sewage. Ministry sampling rated the river Class IV ("very polluted") in 2023. | Flow graph Manisa → İzmir Bay; basin-identification task | PV | S14, S15 |
| 8 | **Soma 2014 and Yırca** (Manisa) | 301 miners died in the Soma mine disaster (13 May 2014). In Yırca village, about 6,000 olive trees were cut for a coal plant on 7 Nov 2014. | Energy vs health vs livelihoods dilemma; coal life-cycle codex entry | V | S16, S17 |
| 9 | **Akbelen forest and Yatağan** (Muğla) | Akbelen forest near İkizköy was felled from 24 Jul 2023 to expand lignite mining for the Yeniköy-Kemerköy plants. Yatağan's 1982 plant has a long-running SO₂ dispute. | Replace `olive-mining` with an accurate case; air and land dual impact | V / PV | S18, S19 |
| 10 | **Geothermal in the Büyük Menderes and Gediz grabens** (Aydın, Denizli, Manisa) | Low-carbon power whose boron- and arsenic-rich brine and H₂S cause local impacts when fluids are not reinjected. | "Low-carbon ≠ impact-free" lesson; reinjection-vs-discharge choice | PV | S20, S21 |

#### Akdeniz (Mediterranean)

| # | Case | Description | Mechanic | Status | Src |
|---|---|---|---|---|---|
| 11 | **Caretta caretta nesting beaches** (Dalyan-İztuzu [Muğla], Patara, Belek, Çıralı, Anamur, Göksu, Samandağ…) | Turkey has roughly 20 main loggerhead nesting beaches; the season runs May–September. Coastal building and lighting threaten them. | Coastal zoning; **light pollution** (hatchlings are drawn to lights); map identification of the beaches | V | S22 |
| 12 | **Lessepsian invaders** (whole coast, first in Hatay/İskenderun) | The silver-cheeked toadfish (poisonous) drew a state bounty of 5 TL per tail (2021–2023). Lionfish were first recorded in İskenderun Bay in 2014 and reached the Aegean in 2015. | Biodiversity stat; spread along the coast over time (Suez → east → west) | V | S23, S24 |
| 13 | **2021 forest fires** (Manavgat, Marmaris) | About 177,000 ha burned in Turkey from January to August 2021 (EFFIS). Manavgat was the largest fire on record in Turkey. | Seasonal (summer) risk event; air-quality spike | PV | S25 |
| 14 | **Çukurova stubble burning** (Adana) | Banned under the Environmental Law (Çevre Kanunu) and fined by governorship circular, but it recurs after harvest. | Seasonal air event; enforcement vs farmer support | PV | S26 |
| 15 | **İskenderun Bay heavy industry** (Hatay) | Iron-steel, coal power, cement and fertiliser plants are concentrated around the bay. Studies found metals in particulate matter at Payas. | Industrial corridor; multi-medium pressure sources | PV | S27 |
| 16 | **Belen Pass soaring-bird bottleneck** (Hatay) | One of Turkey's main migration bottlenecks alongside the Bosphorus; tens to hundreds of thousands of storks and raptors pass each season. | A *correct* home for the wind-farm-vs-birds dilemma (instead of Çeşme) | V | S28, S29 |
| 17 | **Afşin-Elbistan lignite complex** (Kahramanmaraş) | A coal complex linked to severe air pollution (modelled health impacts are NGO estimates). Its Çöllolar mine slope failure killed 11 people in February 2011. | Air plume via the wind graph; coal-pollution case study | V (slide) / model (health) | S30, S31 |
| 18 | **Asbestos in 2023 earthquake debris** (Hatay, Kahramanmaraş, Adıyaman) | Chamber and medical-association sampling found asbestos in debris samples; the debris volume exceeds 100 million m³. | Fix `marmara-urban-renewal`; safe-demolition protocol choice; health stat | V | S32, S33 |

#### Karadeniz (Black Sea)

| # | Case | Description | Mechanic | Status | Src |
|---|---|---|---|---|---|
| 19 | **Bozkurt flood, 11 Aug 2021** (Kastamonu, Sinop, Bartın) | About 80 people died (AFAD reported 78 within a week). The Ezine Çayı bed had been narrowed and built on. | Land use → hazard chain; replace "Doğa kendini toparlar" (nature recovers by itself) | V | S34, S35 |
| 20 | **HES, quarry and mine conflicts** (Rize-İkizdere 2021, Artvin-Cerattepe) | Run-of-river hydro plants divert streams into pipes; valley communities have protested since about 2007. İkizdere quarry (2021) and Cerattepe copper mine (2015–2017 litigation). | Stakeholder dilemma (renewable energy vs streams); legal process timeline | V / PV | S36–S38 |
| 21 | **Anchovy (hamsi)** (whole coast) | The General Fisheries Commission for the Mediterranean (GFCM) rates Black Sea anchovy as possibly overexploited. Catches swing widely (TÜİK: 262,544 t in 2019; 125,980 t in 2022). | Real-data chart in the Codex; quota vs livelihoods | PV | S39, S40 |
| 22 | **Zonguldak–Çatalağzı coal plants** (Zonguldak) | Several coal units are concentrated in one small town; ministry mobile measurements exceeded daily limits. | Coal-heating and power-plant air case; ash as soil pressure | PV | S41, S42 |

#### İç Anadolu (Central Anatolia)

| # | Case | Description | Mechanic | Status | Src |
|---|---|---|---|---|---|
| 23 | **Konya Closed Basin sinkholes** (Konya, Karaman, Aksaray) | Irrigation pumping lowers the water table (estimates around 1 m/yr or more in Karapınar–Ereğli). About 660–684 sinkholes have been recorded. | Groundwater stock (very slow recovery); **rebound effect** delayed consequence (§8 Sketch 1) | PV | S43–S45 |
| 24 | **Tuz Gölü and the 2021 flamingo die-off** (Aksaray, Konya, Ankara) | The shrinking hypersaline lake has been a Special Environmental Protection Area since 2000. In July 2021, roughly 1,000 to 5,000 flamingo chicks died after feeder canals were diverted. | Water diversion → biodiversity chain; estimates-differ literacy | V | S46–S48 |
| 25 | **Ankara's 1980s smog** (Ankara) | Lignite heating trapped in the city's basin caused severe winter smog. Switching to natural gas from 1988 brought SO₂ and PM10 down. | Worked example of a *successful* policy with measurable results; topography (inversion) | V | S49, S50 |

#### Doğu Anadolu (Eastern Anatolia)

| # | Case | Description | Mechanic | Status | Src |
|---|---|---|---|---|---|
| 26 | **Lake Van and the pearl mullet (inci kefali)** (Van, Bitlis) | The world's largest soda lake. The endemic *Alburnus tarichi* migrates to freshwater streams to spawn and is protected by a fishing ban from 15 April to 15 July. Domestic sewage and shoreline building are listed pollution sources. | Seasonal ban mechanic; river-mouth map task; treatment plant + sludge dredging | PV | S51–S53 |
| 27 | **İliç–Çöpler heap-leach collapse, 13 Feb 2024** (Erzincan) | A cyanide heap-leach pile at a gold mine collapsed, killing 9 workers. Officials reported no confirmed Euphrates contamination; experts warned of the risk. | Upstream mining → Euphrates flow-graph risk; permit and monitoring dilemma | V (contamination: U) | S54, S55 |
| 28 | **Winter coal-heating PM10** (Iğdır, Muş, Ağrı, Malatya) | Iğdır ranked as Turkey's worst PM10 province for 4 years in a row. Causes are household coal plus truck traffic, made worse by basin topography. | Season = winter event weighting; climate-zone rule | V | S9, S56 |
| 29 | **Malatya apricot frost** (Malatya) | Late spring frosts (2014, 2025) wiped out most of the dried-apricot crop. | Climate-risk event (tag as climate, not pollution) | PV | S57, S58 |
| 30 | **Eastern Anatolia Observatory (DAG)** (Erzurum, 3,170 m) | A dark, high site for a 4 m infrared telescope. | Light-pollution codex: why observatories are sited far from cities | PV | S59 |

#### Güneydoğu Anadolu (Southeastern Anatolia)

| # | Case | Description | Mechanic | Status | Src |
|---|---|---|---|---|---|
| 31 | **Hasankeyf / Ilısu Dam; Zeugma / Birecik** (Batman; Gaziantep) | Ilısu's reservoir submerged Hasankeyf in early 2020 after some monuments were moved. Birecik partly flooded Zeugma in 2000, and its mosaics are now in a museum. | Ground `gap-dam` in fact; energy vs heritage vs downstream water | V | S60–S62 |
| 32 | **Harran Plain salinisation** (Şanlıurfa) | Irrigation since 1995 with poor drainage raised the water table and salinised about 20,000–25,000 ha. | Soil stock (slowest recovery); "more water is not always better" | V | S63, S64 |
| 33 | **Cross-border desert dust** (Şanlıurfa, Mardin, Diyarbakır) | Dust from the Syrian, Iraqi, Arabian and Saharan deserts arrives mainly in spring and autumn, with PM10 spikes and more respiratory emergency visits. | Wind-graph propagation from outside the country; correct the `dust-transport` options | V | S65, S66 |
| 34 | **Batman / Şırnak PM** | Topped the 2021 national PM rankings (Kara Rapor) at 5–8× the WHO guideline. | Data card and ranking quiz | V | S56 |

#### Cross-cutting national cases

| # | Case | Description | Mechanic | Status | Src |
|---|---|---|---|---|---|
| 35 | **Plastic bag fee** (1 Jan 2019, 25 kuruş) | The Ministry reports a ~75 % drop in bag use. | Ground `plastic-ban` in the real policy; "price signals work" worked example | V (secondary) | S67 |
| 36 | **Plastic waste imports** | Polyethylene waste imports were banned in July 2021 and the ban was reversed within days in favour of licences and quotas. | "Whose waste?" dilemma; fixes the `ewaste-dump` export logic | V | S68 |
| 37 | **Food-safety rejections at EU borders** | Turkish nut notifications are mainly **aflatoxin**. Pesticide-residue problems concentrate on lemons, peppers and grapes (chlorpyrifos). | Rewrite `fındık-pesticide` | V | S69–S71 |
| 38 | **Environmental noise rules** | The 2005/2010 regulation was replaced by the Çevresel Gürültü Kontrol Yönetmeliği (Environmental Noise Control Regulation, RG 32029, 30 Nov 2022). Istanbul has strategic noise maps. | New noise events; map overlay of a noise map | V | S72, S73 |
| 39 | **Wastewater treatment coverage** (TÜİK 2024) | 76.9 % of the municipal population is served by wastewater treatment plants, versus 98.8 % served by drinking-water networks. | Excellent Codex data card; explains mucilage and İzmir Bay | V (secondary) | S74 |
| 40 | **TÜBİTAK National Observatory** (Saklıkent, Antalya) | Sited for dark skies; now threatened by Antalya's light pollution. | Light-pollution event (currently 0 events) | PV | S75 |

**Misconceptions to design against (from the research):**
- "Mucilage is caused by heat." Heat amplifies it; nutrients drive it.
- "Deep-sea discharge solved the Ergene." It moved the load.
- "Drip irrigation saves water at basin scale." It does not without a quota.
- "Within national limits = safe air." Turkish limits are looser than WHO guidelines.
- "Geothermal is clean." It is low-carbon, with real local impacts.
- "Tuz Gölü's flamingos died of climate change alone." Canal diversion was a direct cause.
- "The pearl mullet is a mullet." It is a cyprinid.
- "Treatment coverage = network coverage." 76.9 % vs 98.8 %.

---

## 7. Prioritised roadmap

### Quick wins (< 1 day each)

| Change | Category | Learning impact | Effort | Files affected | Priority |
|---|---|---|---|---|---|
| Hide numeric effects on choice buttons; show them only after the choice | Learning | H | L | `EventModal.tsx` | P0 |
| Add `outcome: {what, why}` to choices and show a "Ne oldu?" card after each decision (start with the 10 most-played events) | Learning | H | L code, M content | `types/index.ts`, `gameReducer.ts`, `EventModal.tsx`, `events.ts` | P0 |
| Fix the factual problems in §5.1 (mucilage, e-waste export, hazelnut, wind farm, geothermal, asbestos, region texts) | Content accuracy | H | L | `events.ts`, `regions.ts`, `projects.ts` | P0 |
| Rename "Su Arıtma Tesisi" → "Atık Su Arıtma Tesisi"; drop the solar → recycling prerequisite | Content | M | L | `projects.ts` | P1 |
| Fix province name typos | Geography | M | L | `provincePaths.ts` | P1 |
| Spawn nodes at the event's province centroid (add `location.provinces`) | Geography | H | L–M | `types/index.ts`, `gameReducer.ts`, `events.ts`, `App.tsx` | P0 |
| Fix off-region coordinates and the `p-4` offset | Bug | L | L | `regions.ts`, `CountryMap.tsx`, `App.tsx` | P1 |
| Expand the game-over screen: last 10 decisions and which stat collapsed, and why | Learning | M | L | `GameOver.tsx`, `gameReducer.ts` (decision log) | P1 |
| Dynamic `<html lang>`, ARIA on modal and nodes, colour contrast, `prefers-reduced-motion` | Accessibility | L | L | `index.html`, `LanguageContext.tsx`, `EventModal.tsx`, `App.tsx`, `index.css` | P1 |
| Game speed control; make one tick represent a week | Pacing | M | L | `GameContext.tsx`, `gameLogic.ts` | P2 |
| Fix lint errors; add lint and `npm ci` to CI; delete `countryOutline.ts` or restore its script | Code health | – | L | contexts, `deploy.yml` | P2 |

### Medium (1–3 days each)

| Change | Category | Learning impact | Effort | Files affected | Priority |
|---|---|---|---|---|---|
| Predict-then-reveal flow with prediction scoring (Sketch 1) | Learning | H | M | `EventModal.tsx`, `gameReducer.ts`, `types/index.ts` | P0 |
| Evidence cards and qualitative cost/horizon tags in place of numbers | Learning | H | M (content-heavy) | `events.ts` → JSON, `EventModal.tsx` | P0 |
| Delayed effects and follow-up events via flags | Systems thinking | H | M | `gameReducer.ts`, `types/index.ts`, events data | P0 |
| Rewrite all 48 Türkiye events as three-option dilemmas with no dominant choice; add a validator that rejects dominated sets | Learning | H | M–H | events data, new `scripts/validate-events.ts` | P1 |
| "Nerede?" map tasks and map layers (seas, rivers, lakes, basins) | Geography | H | M | `CountryMap.tsx`, new `data/countries/turkey/geoLayers.ts` | P1 |
| Codex with unlockable entries | Learning | M–H | M | new `data/codex.ts`, new `components/Codex.tsx` | P1 |
| Karne (report card / mistake review) and seeded replay | Learning | H | M | `GameOver.tsx`, `gameReducer.ts` (seeded RNG) | P1 |
| Pre/post test and per-tag mastery in localStorage | Measurement | H (for evidence) | M | new `components/Assessment.tsx`, `utils/mastery.ts` | P1 |
| Season-dependent event weighting | Content | M | L–M | `gameReducer.ts`, events data | P2 |
| Move events to JSON with schema, `sources[]` and `tags`; add the bot simulation as a CI balance test | Architecture | M (enables everything) | M | `src/data/**`, new tests | P1 |
| Mobile: region list for portrait; collapsible tax panel in landscape | UX | L | M | `MainMenu.tsx`, `ManagementPanel.tsx` | P2 |

### Big bets

| Change | Category | Learning impact | Effort | Files affected | Priority |
|---|---|---|---|---|---|
| Multi-medium pollution model (Hava, Su, Toprak, Biyoçeşitlilik → Halk Sağlığı) with stocks and pressures (Sketch 2) | Systems thinking | H | H | `types`, `gameReducer.ts`, `gameLogic.ts`, `GameHUD.tsx`, all content | P1 |
| Geographic propagation along rivers, seas and wind (Sketch 3) | Geography | H | H | new `geo/flowGraph.ts`, `gameReducer.ts`, `CountryMap.tsx` | P1 |
| Region-specific projects tied to media (advanced treatment, metered irrigation, flue-gas desulfurisation, sanitary landfill) | Learning | M–H | M–H | `projects.ts`, `ManagementPanel.tsx` | P2 |
| Case-study scenarios with real-data charts (Marmara 2021, Konya, Ergene, Bozkurt) | Learning | H | H | new `scenarios/`, `Codex.tsx` | P2 |
| Country mode with one national budget and upstream/downstream conflicts | Geography | H | H | most of the engine | P3 |
| Teacher mode: seeded class runs, exportable Karne codes | Measurement | M | M–H | new components | P3 |
| Adaptive difficulty and fading hints driven by mastery | Learning | M | M | event selection in `gameReducer.ts`, `utils/mastery.ts` | P3 |

---

## 8. Design sketches for the three highest-impact changes

### Sketch 1: Evidence → Prediction → Decision → "Ne oldu?"

**Player flow**
1. The player taps a node over **Konya**. The modal opens with a location chip: "📍 Konya · Konya Kapalı Havzası".
2. The situation text is 2–3 sentences:
   > *"Karapınar'da bir tarlanın ortasında 30 metrelik bir çukur açıldı. Çiftçiler mısır ve şeker pancarı için her yıl daha derin kuyu açıyor."*
   > (A 30-metre hole opened in the middle of a field in Karapınar. Every year farmers dig deeper wells for maize and sugar beet.)
   >
   > *The 30 m is an illustration only; replace it with a sourced figure.*
3. **Kanıt (evidence) cards:**
   - 📈 "Konya, Karaman ve Aksaray'da yaklaşık 660–684 obruk kayda geçti" (About 660–684 sinkholes have been recorded in Konya, Karaman and Aksaray). Source: case 23, partly verified; confirm against the AFAD obruk map before shipping. Any well-depth figure must also come from a verified source.
   - 🗣️ Çiftçi (farmer): "Su olmazsa ekmek de yok." (No water, no bread.)
   - 🗣️ Hidrojeolog (hydrogeologist): "Karstik kayaç, su seviyesi düştükçe taşıyıcı desteğini kaybediyor." (As the water level falls, the karst rock loses its supporting pressure.)
4. **Options.** Text only, with qualitative tags and no numbers:
   - A. "Kaçak kuyuları kapat" (Close the illegal wells) · Maliyet: Orta (Cost: Medium) · Etki: Uzun vadeli (Effect: long-term) · 😠 Çiftçiler (farmers angry)
   - B. "Damla sulamayı teşvik et" (Encourage drip irrigation) · Maliyet: Yüksek (Cost: High) · Etki: Hızlı (Effect: fast) · 🙂 Çiftçiler (farmers pleased)
   - C. "Damla sulama + sayaçlı su kotası + ürün desenini değiştir" (Drip irrigation + metered water quota + change the crop pattern) · Maliyet: Yüksek (Cost: High) · Etki: Uzun vadeli (Effect: long-term) · 😐 Çiftçiler (farmers neutral)
5. **Prediction prompt** (shown once the player selects an option, before confirming):
   > *"Sence B seçeneğinden 2 yıl sonra yeraltı suyu seviyesi ne olur?"* (Two years after option B, what do you think happens to the groundwater level?)
   > ○ Yükselir (rises) ○ Sabit kalır (stays the same) ○ Düşmeye devam eder (keeps falling)
6. **Confirm.** The immediate effect is applied: budget and happiness. The aquifer change is scheduled as a delayed effect.
7. **"Ne oldu?" card:**
   > **Ne oldu?** Çiftçiler damla sulamaya geçti ve tasarruf ettikleri suyla daha fazla alan suladı. (Farmers switched to drip irrigation and used the water they saved to irrigate more land.)
   > **Neden?** Verimlilik arttı ama kota olmadığı için toplam çekim azalmadı → su tablası düşmeye devam etti → karstik boşluklar desteksiz kaldı → obruk riski sürdü. (Efficiency rose, but with no quota total extraction did not fall → the water table kept falling → karst cavities lost their support → sinkhole risk continued.)
   > **Tahminin:** "Düşmeye devam eder" ✔️ Doğru! Buna *geri tepme (rebound) etkisi* denir. (Your prediction, "keeps falling": correct! This is called the *rebound effect*.)
   > 📚 Ansiklopediye eklendi (Added to the encyclopedia): *Obruk*, *Geri tepme etkisi* (Sinkhole, Rebound effect) · Kaynak (Source): Grafton et al. 2018, *Science* [S44]
8. **About 20 days later**, a follow-up toast links back to the decision: "20 gün önceki kararın: Karapınar'da yeni obruk." (Your decision 20 days ago: a new sinkhole in Karapınar.)

**Data-structure changes** (example only):
```ts
type PollutionType = 'air'|'water'|'marine'|'groundwater'|'soil'|'waste'|'noise'|'light'|'biodiversity';
interface SourceRef { label: string; url: string; status: 'verified'|'partly'|'unverified' }

interface EventChoiceV2 {
  id: string;                               // stable id (analytics, flags, Karne)
  text: LocalizedText;
  costTier: 'low'|'medium'|'high';
  horizon: 'fast'|'long';
  stakeholderMood?: Record<string, -1|0|1>; // e.g. { ciftci: 1 }
  effects: Effects;                         // immediate, hidden until chosen
  delayed?: { inDays: number; effects: Effects; message: LocalizedText }[];
  setsFlags?: string[];
  outcome: { what: LocalizedText; why: LocalizedText };
  predictionAnswer?: number;                // index into event.prediction.options
}

interface GameEventV2 {
  id: string; title: LocalizedText; situation: LocalizedText;
  location: { provinces: string[]; basin?: string; coast?: 'karadeniz'|'marmara'|'ege'|'akdeniz' };
  evidence: { kind: 'data'|'quote'|'map'; text: LocalizedText; source?: SourceRef }[];
  prediction?: { prompt: LocalizedText; options: LocalizedText[] };
  tags: { pollution: PollutionType[]; mechanisms: string[]; bloom: 'understand'|'apply'|'analyze'|'evaluate' };
  codexUnlocks: string[]; sources: SourceRef[];
  requiresFlags?: string[]; excludesFlags?: string[]; seasons?: ('spring'|'summer'|'autumn'|'winter')[];
  choices: EventChoiceV2[];
}

// GameState additions
scheduled: { dueDay: number; effects: Effects; message: LocalizedText; fromChoice: string }[];
flags: string[];
decisionLog: { day: number; eventId: string; choiceId: string; predicted?: number; correct?: boolean }[];
pendingOutcome: { eventId: string; choiceId: string } | null;   // drives the "Ne oldu?" card
mastery: Record<string, { seen: number; score: number }>;       // per tag, EW accuracy
```

**Reducer pseudocode**
```ts
case 'HANDLE_CHOICE': {
  const { choiceIndex, predicted } = action.payload;
  const ev = state.activeEvent!; const ch = ev.choices[choiceIndex];
  const correct = ev.prediction ? predicted === ch.predictionAnswer : undefined;
  return {
    ...applyEffects(state, ch.effects),
    scheduled: [...state.scheduled, ...(ch.delayed ?? []).map(d => ({ dueDay: state.day + d.inDays, ...d, fromChoice: ch.id }))],
    flags: [...state.flags, ...(ch.setsFlags ?? [])],
    decisionLog: [...state.decisionLog, { day: state.day, eventId: ev.id, choiceId: ch.id, predicted, correct }],
    mastery: correct === undefined ? state.mastery : updateMastery(state.mastery, ev.tags, correct),
    pendingOutcome: { eventId: ev.id, choiceId: ch.id },   // modal now shows "Ne oldu?"
    // keep activeEvent until the player closes the outcome card, so the loop stays paused
  };
}
// In TICK: fire scheduled items whose dueDay === nextDay; pick next event only among
// those whose requiresFlags ⊆ flags and excludesFlags ∩ flags = ∅.
```
**Success check.** Re-run the bot harness. With numbers hidden from the bot's policy, the text-blind strategy should drop towards chance. A "knowledge" bot that knows the canonical mechanism for each event should win most games.

### Sketch 2: A multi-medium pollution model with stocks, pressures and delays

**Player-facing change.** The HUD's single Temizlik bar becomes four small bars: 🌫️ Hava (air), 💧 Su (water), 🟫 Toprak (soil), 🐢 Biyoçeşitlilik (biodiversity). A ❤️ Halk Sağlığı (public health) indicator is derived from them and drives part of happiness. Hovering or tapping a bar shows *"Neden düşüyor?"* (Why is it falling?) with the top three pressure sources, for example "Tekstil OSB deşarjı −1.2/gün; Kentsel atıksu −0.8/gün" (Textile industrial-zone discharge −1.2/day; urban wastewater −0.8/day).

**Model.** Each medium *m* has a stock *S_m* (0–100, higher is cleaner) and a list of active pressures *P_m,i* (per day):
```
S_m(t+1) = S_m(t) − Σ_i P_m,i + r_m · (100 − S_m(t))
```
`r_m` is a natural recovery rate that differs by medium. Air is fast (about 0.15), surface water is medium (about 0.05), soil and groundwater are very slow (about 0.005). The numbers are illustrative, for tuning only. This *teaches by structure*: an air-pollution fix shows results within days, while a soil or aquifer fix takes most of a run.

- Choices **add or remove pressures** instead of applying one-off jumps. "Filtre Zorunluluğu Getir" (Require Filters) removes 70 % of the "Bursa sanayi baca gazı" (Bursa industrial flue gas) pressure on air.
- **Some choices transfer pressure from one medium to another.** Burning waste moves it from soil to air. Deep-sea discharge moves it from river water to marine water. The Codex names this *kirliliğin yer değiştirmesi* (pollution displacement).
- **Health** = a weighted function of air and water, with a lag. Health feeds happiness, so "pollute for cash" now costs happiness later, and the brown strategy stops winning.

**Data sketch**
```ts
interface Pressure { id: string; medium: 'air'|'water'|'soil'|'bio'; perDay: number; source: LocalizedText; province?: string }
interface EnvState { stocks: Record<'air'|'water'|'soil'|'bio', number>; pressures: Pressure[] }

// EventChoiceV2 gains:
addPressures?: Pressure[]; removePressures?: { id: string; fraction: number }[];
transfer?: { from: Medium; to: Medium; fraction: number; pressureId: string };
```

**Migration.**
1. Map every current `cleanliness` delta to the medium its event tag points to (air, water, and so on).
2. Map one-off deltas to a pressure change of roughly delta/10 per day for 10 days, then hand-tune.
3. Keep `TUNING` as the single source of rates.
4. The win condition becomes "Halk Sağlığı ≥ X and every medium ≥ Y for N days".

### Sketch 3: Geography that matters (located events, "Nerede?" tasks, propagation)

**Player flow**
1. A crisis appears as a node **on Manisa**, not in a random corner of the region. The map shows the Gediz River as a thin blue line flowing into İzmir Bay.
2. In early runs, the first time a topic appears, the node is grey with a "?" and a prompt: *"Bu kriz hangi nehir havzasında? Haritada dokun."* (Which river basin is this crisis in? Tap it on the map.) Feedback:
   - correct: *"Gediz Havzası ✔️ +1 Bilgi"* (Gediz Basin, +1 knowledge point);
   - near: *"Komşu havza (Küçük Menderes). Gediz, Manisa'dan İzmir Körfezi'ne akar."* (Neighbouring basin, Küçük Menderes. The Gediz flows from Manisa into İzmir Bay.)
3. The player chooses "Deri OSB'sini ortak arıtmaya bağla" (Connect the leather industrial zone to joint treatment) or delays.
4. If the player delays, after about 8–12 days the water pressure **propagates** downstream along the flow graph. A secondary node appears at İzmir Bay: *"İç körfezde oksijen düştü, balık ölümleri"* (Oxygen has dropped in the inner bay: fish deaths). The modal draws an arrow from Manisa to the bay: *"Bu kriz, 10 gün önce Manisa'da ertelediğin karardan geliyor."* (This crisis comes from the decision you postponed in Manisa 10 days ago.)
5. The Karne includes a "Coğrafya" (Geography) row: map-identification accuracy by region and basin, and a mini-map of the player's decisions with their downstream effects.

**Data sketch** (`src/data/countries/turkey/geo.ts`, examples only; build the full graph from authoritative basin data):
```ts
export const PROVINCE_META: Record<string, { region: string; basin: string; coast?: string; climate: 'karadeniz'|'akdeniz'|'karasal' }> = {
  'Manisa':  { region: 'aegean', basin: 'Gediz', climate: 'akdeniz' },
  'İzmir':   { region: 'aegean', basin: 'Gediz', coast: 'ege', climate: 'akdeniz' },
  'Tekirdağ':{ region: 'marmara', basin: 'Meriç-Ergene', coast: 'marmara', climate: 'karasal' },
  'Konya':   { region: 'anatolian', basin: 'Konya Kapalı', climate: 'karasal' },
  // …
};

export const FLOW_EDGES: { from: string; to: string; medium: 'water'|'marine'|'air'; delayDays: number; fraction: number }[] = [
  { from: 'Manisa',   to: 'İzmir-Körfez',   medium: 'water',  delayDays: 10, fraction: 0.6 },
  { from: 'Tekirdağ', to: 'Edirne-Meriç',   medium: 'water',  delayDays: 8,  fraction: 0.5 },
  { from: 'Karadeniz',to: 'Marmara',        medium: 'marine', delayDays: 15, fraction: 0.3 },
  { from: 'Kahramanmaraş-Afşin', to: 'Malatya', medium: 'air', delayDays: 1, fraction: 0.2 },
];

// TICK, after pressures update:
for (const e of FLOW_EDGES) {
  const src = pressureAt(state, e.from, e.medium);
  if (src > THRESHOLD) schedule({ dueDay: day + e.delayDays, at: e.to, medium: e.medium,
                                 perDay: src * e.fraction, spawnEventTag: 'downstream' });
}
```

**Node placement fix** (this also solves the bug in §4.6):
```ts
// once, after the SVG mounts
const centroids = Object.fromEntries([...svg.querySelectorAll('path')].map(p => {
  const b = p.getBBox(); return [p.dataset.name, { x: (b.x + b.width/2) / vbW * 100, y: (b.y + b.height/2) / vbH * 100 }];
}));
// render nodes in the SVG's own coordinate box (put the node layer inside the same sized wrapper as <svg>, no padding)
```

---

## 9. Sources and open questions

### 9.1 Learning science
- Bruckman, A. (1999). *Can educational be fun?* Game Developers Conference. The origin of "chocolate-covered broccoli".
- Habgood, M. P. J., & Ainsworth, S. E. (2011). Motivating children to learn effectively: Exploring the value of intrinsic integration in educational games. *Journal of the Learning Sciences, 20*(2), 169–206. https://doi.org/10.1080/10508406.2010.508029
- Shute, V. J. (2008). Focus on formative feedback. *Review of Educational Research, 78*(1), 153–189. https://doi.org/10.3102/0034654307313795
- Hattie, J., & Timperley, H. (2007). The power of feedback. *Review of Educational Research, 77*(1), 81–112. https://doi.org/10.3102/003465430298487
- Bjork, E. L., & Bjork, R. A. (2011). Making things hard on yourself, but in a good way: Creating desirable difficulties to enhance learning. In *Psychology and the Real World*. Worth.
- Roediger, H. L., & Karpicke, J. D. (2006). Test-enhanced learning. *Psychological Science, 17*(3), 249–255. https://doi.org/10.1111/j.1467-9280.2006.01693.x
- Richland, L. E., Kornell, N., & Kao, L. S. (2009). The pretesting effect. *Journal of Experimental Psychology: Applied, 15*(3), 243–257. https://doi.org/10.1037/a0016496
- Kapur, M. (2008). Productive failure. *Cognition and Instruction, 26*(3), 379–424. https://doi.org/10.1080/07370000802212669
- Booth Sweeney, L., & Sterman, J. D. (2000). Bathtub dynamics. *System Dynamics Review, 16*(4), 249–286. https://doi.org/10.1002/sdr.198
- White, R., & Gunstone, R. (1992). *Probing Understanding*. Falmer Press. (Predict–Observe–Explain.)
- Wouters, P., & van Oostendorp, H. (2013). A meta-analytic review of the role of instructional support in game-based learning. *Computers & Education, 60*(1), 412–425. https://doi.org/10.1016/j.compedu.2012.07.018
- Clark, D. B., Tanner-Smith, E. E., & Killingsworth, S. S. (2016). Digital games, design, and learning: A systematic review and meta-analysis. *Review of Educational Research, 86*(1), 79–122. https://doi.org/10.3102/0034654315582065

### 9.2 Turkish environmental cases
These links are as found during research, between September and October 2026. Ministry and TÜİK figures marked "secondary" were seen through news reports of the official release, not the bulletin itself. Advocacy-group and news sources are labelled as such; prefer the official or peer-reviewed source when writing content for students.

- **S1** ÇŞİDB (Ministry of Environment), Marmara Denizi Eylem Planı (Marmara Sea Action Plan, 6 Jun 2021): https://csb.gov.tr/bakan-kurum-marmara-denizi-eylem-planini-acikladi-bakanlik-faaliyetleri-31923
- **S2** ÇŞİDB, advanced biological treatment deadline expired: https://csb.gov.tr/marmarada-ileri-biyolojik-aritma-tesisi-kurulumu-icin-taninan-yasal-sure-doldu-bakanlik-faaliyetleri-41706
- **S3** ÇŞİDB, "Marmara Hepimizin" action plan page: https://marmarahepimizin.csb.gov.tr/eylem-plani-i-102110
- **S4** İTÜ (Istanbul Technical University), 10 recommendations on mucilage (Jun 2021): https://haberler.itu.edu.tr/en/newsdetail/2021/06/22/10-solution-suggestions-from-itu-to-the-problem-of-mucilage
- **S5** Greenpeace Türkiye, "Sorun müsilaj değil, kirlilik" (The problem is pollution, not mucilage; NGO): https://www.greenpeace.org/turkey/basin-bultenleri/sorun-musilaj-degil-kirlilik/
- **S6** Ergene Havzası Koruma Eylem Planı (Ergene Basin Protection Action Plan; news): https://www.sondakika.com/guncel/haber-ergene-havzasi-koruma-eylem-plani-8104033/
- **S7** İTÜ thesis/publication, Dilovası air quality: https://polen.itu.edu.tr/entities/publication/8e757541-7da4-4db2-950f-23fd6accdaec
- **S8** Uludağ University repository, İzmit Bay industrial effluent: https://acikerisim.uludag.edu.tr/items/c97ab7aa-0b2e-45c9-b872-d58870519f09
- **S9** Temiz Hava Hakkı Platformu (Right to Clean Air Platform), Kara Rapor 2024 press release (NGO): https://www.temizhavahakki.org/wp-content/uploads/2024/09/KARA-RAPOR-2024_-BASIN-BULTENI.pdf
- **S10** Diken, Kaz Dağları tree-cut figures (news): https://www.diken.com.tr/?p=707255
- **S11** Bianet, Kaz Dağları watch (news): https://bianet.org/haber/kaz-daglari-nda-binlerce-agac-kesildi-halk-nobette-210968
- **S12** Diken, İzmir Bay fish deaths (news): https://www.diken.com.tr/izmir-korfezinde-balik-olumleri-devam-ediyor/
- **S13** Sözcü, İzmir Bay (news): https://www.sozcu.com.tr/izmir-korfezi-nden-kotu-kokular-geliyor-balik-olumleri-suruyor-p77050
- **S14** DHA, Gediz Class IV (news): https://www.dha.com.tr/foto-galeri/gediz-nehrindeki-kirlilik-4uncu-dereceye-ulasti-2305829
- **S15** TBMM (Grand National Assembly), plenary speech on Gediz: https://www.tbmm.gov.tr/Milletvekili/UyeGenelKurulKonusmalariDetay?eid=3899
- **S16** Soma mine disaster overview (tertiary; use for orientation only): https://en.wikipedia.org/wiki/Soma_mine_disaster
- **S17** Yırca olive grove (news): https://www.cumhuriyet.com.tr/haber/bile-bile-kesmisler-139223 · https://www.birgun.net/haber/termik-icin-zeytinlik-kestiler-68788
- **S18** Akbelen felling, 24 Jul 2023 (news): https://medyascope.tv/2023/07/24/akbelen-ormaninda-kiyim-agac-kesimi-basladi-ikizkoyluler-ve-cevreciler-ayakta/
- **S19** Yatağan power plant (news): https://bianet.org/haber/yatagan-termik-santrali-derhal-kapanmali-90108
- **S20** Kızıldere geothermal wastewater and boron (peer-reviewed): https://www.inderscience.com/info/inarticle.php?artid=3741
- **S21** Germencik geothermal fluid chemistry (preprint): https://arxiv.org/pdf/2111.06626 · Alaşehir court case (news): https://www.birgun.net/haber/alasehir-de-jes-e-yargi-freni-kalkti-700079
- **S22** Caretta caretta nesting beaches (news): https://www.hurriyet.com.tr/haberleri/caretta-carettalar
- **S23** Pufferfish bounty, Resmî Gazete (Official Gazette) decision (news): https://www.cnnturk.com/turkiye/resmi-gazetede-yayimlandi-balon-baligi-avlayana-5-tl-para-verilecek · https://www.ekonomist.com.tr/haberler/balon-baligi-avciligina-destek-odemelerinin-sartlari-belli-oldu-21681
- **S24** Lionfish in Turkish waters (academic repository): https://acikerisim.comu.edu.tr/items/a31203d3-23d0-45c0-83f7-e85c42e8de39/full
- **S25** 2021 fires, burned area (news citing EFFIS and GTÜ): https://www.diken.com.tr/?p=989215
- **S26** Çukurova stubble burning (news): https://www.sozcu.com.tr/yasaklamak-yetmez-takip-de-edilmeli-p49333
- **S27** İskenderun/Payas particulate metals (MKU, Hatay Mustafa Kemal University, repository): https://openaccess.mku.edu.tr/items/c729c881-6816-47e6-84eb-32dab9e35763/full
- **S28** Belen and Bosphorus soaring-bird counts (ÖHÜ, Niğde Ömer Halisdemir University, repository): https://acikerisim.ohu.edu.tr/items/e62e8fed-8eb8-4381-ac79-b6f4f466e9b4
- **S29** World Bank / CIF (Climate Investment Funds) presentation, Belen bottleneck: https://www.cif.org/sites/cif_enc/files/4%20Worldbank_sunum_0.pdf
- **S30** CREA (Centre for Research on Energy and Clean Air), Afşin A expansion health impacts (NGO model): https://energyandcleanair.org/afsin-a-expansion-health-impacts/ · Bianet: https://bianet.org/haber/maras-thermal-plant-linked-to-thousands-of-deaths-still-running-without-filters-312569
- **S31** NASA Earth Observatory, Çöllolar mine collapse 2011: https://science.nasa.gov/earth/earth-observatory/mine-collapse-in-turkey-78321
- **S32** TTB (Turkish Medical Association) and THHP asbestos report (27 Oct 2023): https://www.ttb.org.tr/userfiles/files/tthp_ttb_asbest_raporu_27ekim2023.pdf
- **S33** Bianet, asbestos in Kahramanmaraş samples (news): https://bianet.org/haber/thhp-ve-ttb-marastan-alinan-21-ornegin-sekizinde-asbest-var-287069
- **S34** İSO (Istanbul Chamber of Industry) Yeşil Bülten, Bozkurt flood (Aug 2021): https://www.iso.org.tr/surdurulebilirlik/docs/03-ISO-Yesil-Bulten_v6_20210818.pdf
- **S35** Bianet, İkizdere quarry (news): https://bianet.org/haber/villagers-resist-pro-government-company-s-stone-quarry-project-in-black-sea-valley-243117
- **S36** Bianet, HES (run-of-river hydro) stream watches (news): https://bianet.org/haber/karadenizliler-hes-lere-karsi-dere-nobetinde-109141
- **S37** BirGün, Cerattepe Danıştay (Council of State) ruling (news): https://www.birgun.net/haber/danistay-cerattepe-de-madencilik-yapilabilir-kararini-onadi-168559
- **S38** Bianet, Cerattepe (news): https://bianet.org/haber/danistay-cerrattepe-de-madenin-onunu-acti-188068
- **S39** FAO GFCM (General Fisheries Commission for the Mediterranean), Black Sea anchovy benchmark: https://www.fao.org/gfcm/technical-meetings/detail/en/c/1717315
- **S40** TÜİK fisheries 2024 (secondary): https://www.alomaliye.com/2025/06/04/su-urunleri-avciligi-2024-yilinda-yuzde-21-6-azaldi/
- **S41** Çatalağzı power plants (news): https://www.karar.com/termik-santraller-catalagzina-nefes-aldirmiyor-991723
- **S42** HEAL (Health and Environment Alliance) briefing, Zonguldak (NGO): https://www.env-health.org/wp-content/uploads/2022/01/CC_Briefing-Turkey_Zonguldak_TR.pdf
- **S43** Karapınar groundwater (ÖHÜ repository): https://acikerisim.ohu.edu.tr/items/ebbc9dd3-3f87-452c-b1c1-656f197f430b · Ankara University: https://avesis.ankara.edu.tr/yayin/6edbff9d-28b1-48fe-84d6-8afb4db9ef2a
- **S44** Grafton, R. Q. et al. (2018). The paradox of irrigation efficiency. *Science* 361:748–750. https://doi.org/10.1126/science.aat9314 (summary: https://ifpri.org/?p=26064)
- **S45** FAO, Perry & Steduto (2017), *Does improved irrigation technology save water?*: https://openknowledge.fao.org/items/bf3be54b-2f7b-449d-a10d-5fe181cda94c
- **S46** EEA (European Environment Agency) document listing Tuz Gölü as a SEPA (Special Environmental Protection Area); Hürriyet topic page: https://www.hurriyet.com.tr/haberleri/tuz-golu-ozel-cevre-koruma-bolgesi
- **S47** Tuz Gölü salt-crust and groundwater study (*Environ. Monit. Assess.*, 2022): https://link.springer.com/article/10.1007/s10661-022-10793-3
- **S48** Flamingo deaths, 2021 (news): https://www.cumhuriyet.com.tr/haber/bakan-pakdemirli-dogruladi-binlerce-flamingo-susuzluktan-olmus-1852571
- **S49** JICA (Japan International Cooperation Agency), Ankara air pollution control study: https://openjicareport.jica.go.jp/619/619_314.html
- **S50** Ankara thesis critiquing the green-belt plantations: https://acikbilim.yok.gov.tr/handle/20.500.12812/160025
- **S51** Daily Sabah, pearl mullet protection (news): https://www.dailysabah.com/turkiye/turkiye-rushes-to-protect-endangered-pearl-mullet-in-lake-van
- **S52** ÇŞİDB, Van İl Çevre Durum Raporu (Van provincial environmental status report) 2022: https://webdosya.csb.gov.tr/db/ced/icerikler/van-ilcdr-2022-20231027133953.pdf
- **S53** Van Gölü sludge dredging (news): https://www.cumhuriyet.com.tr/cevre/murat-kurum-van-golunden-500-bin-metrekup-dip-camuru-cikartildi-1977415
- **S54** Çöpler mine disaster overview (tertiary): https://en.wikipedia.org/wiki/Çöpler_mine_disaster
- **S55** Duvar English, recovery of the last victim (news): https://www.duvarenglish.com/search-team-recovers-body-from-ilic-mine-seven-weeks-after-disaster-news-64146
- **S56** Bianet, Kara Rapor rankings (news): https://bianet.org/haber/turkiye-de-sadece-2-sehrin-havasi-temiz-251109
- **S57** Dünya, TZOB (Union of Turkish Chambers of Agriculture) on the 2014 apricot frost (news): https://www.dunya.com/sektorler/tarim/tzob-kayisi-ureticisinin-kaybi-buyuk-haberi-245592
- **S58** Halk TV, 2025 apricot frost (news): https://halktv.com.tr/ekonomi/malatyadan-buz-kestiecek-haber-kayisi-yok-962077h
- **S59** Eastern Anatolia Observatory (tertiary): https://en.wikipedia.org/wiki/Eastern_Anatolia_Observatory
- **S60** NASA Earth Observatory, "Slowly flooding history" (Hasankeyf): https://earthobservatory.nasa.gov/images/146439/slowly-flooding-history
- **S61** Bianet, Ilısu Dam timeline (news): https://bianet.org/haber/1954-ten-2019-a-ilisu-baraji-hasankeyf-209799
- **S62** Al Jazeera, Zeugma (news): https://www.aljazeera.com/news/2004/5/31/clashes-over-treasures-of-zeugma
- **S63** Özel, Bozdağ & Baba (2019), Harran groundwater (İYTE, İzmir Institute of Technology, repository): https://hdl.handle.net/11147/7234
- **S64** Harran soil salinity (*Soil Studies*): https://dergipark.org.tr/en/pub/soilst/article/1996171
- **S65** Şanlıurfa dust-source study (YÖK thesis repository): https://acikbilim.yok.gov.tr/handle/20.500.12812/92211
- **S66** Dust event, 7 Apr 2022 (E3S Web of Conferences, 2024): https://www.e3s-conferences.org/10.1051/e3sconf/202457502001
- **S67** Capital, plastic bag use −75 % (secondary, citing Ministry data): https://www.capital.com.tr/haberler/tum-haberler/plastik-poset-kullanimi-yuzde-75-azaldi
- **S68** bne IntelliNews, PE waste import ban reversed (news): https://www.intellinews.com/turkey-reverses-ban-on-pe-based-recycled-plastic-imports-215460
- **S69** RASFF (EU Rapid Alert System for Food and Feed) notifications for Turkish products (*Turkish J. Agriculture – Food Science & Technology*): https://www.agrifoodscience.com/index.php/TURJAF/article/view/1155
- **S70** Aflatoxins in hazelnuts, 2025 (industry slide deck): https://www.nocciolare.it/wp-content/uploads/2025/12/8-Aflatoxins-2025.pdf
- **S71** Eurofruit, EU controls on Turkish lemons and grapefruit (trade press): https://www.fruitnet.com/eurofruit/eu-tightens-controls-on-turkish-lemons-and-grapefruit/247874.article
- **S72** Resmî Gazete (Official Gazette), Çevresel Gürültü Kontrol Yönetmeliği (Environmental Noise Control Regulation, 30 Nov 2022): https://www.resmigazete.gov.tr/eskiler/2022/11/20221130-1.htm
- **S73** AA (Anadolu Agency), Istanbul noise mapping (news): https://www.aa.com.tr/tr/turkiye/gurultusuz-istanbul-hayal-degil/915708
- **S74** TÜİK Su ve Atık Su İstatistikleri (Water and Wastewater Statistics) 2024 (secondary): https://www.trthaber.com/haber/ekonomi/turkiyede-2024te-su-kaynaklarindan-203-milyar-metrekup-su-cekildi-928225.html · https://www.sozcu.com.tr/turkiye-nin-su-bilancosu-aciklandi-cekilen-suyun-yarisi-tatli-su-kaynaklarindan-p268817
- **S75** TÜBİTAK, National Observatory visit and light-pollution threat: https://tubitak.gov.tr/tr/haber/bakan-isik-tubitak-tugu-ziyaret-etti

**Explicitly UNVERIFIED (do not ship without a source):**
- Çeşme as a migratory-bird bottleneck.
- Textile-dye pollution specific to the Dicle (Tigris).
- Contamination of the Euphrates after the İliç collapse (it was a risk, not confirmed).
- The Dilovası cancer-death share.
- A launch year for Ankara's Yeşil Kuşak (green belt).
- Mucilage in Lake Van.
- Barriers on Van tributaries that block fish migration.
- A national light-pollution regulation.
- Exact basin-wide Konya groundwater decline rates.
- Province-count claims from Kara Rapor editions.

### 9.3 Open questions for the developer
1. **Curriculum alignment.** Should the game map onto specific MEB (Ministry of National Education) high-school *Coğrafya* (Geography) or *Biyoloji* (Biology) learning outcomes? I did not verify current outcome codes. A teacher should supply them, and they should drive the learning objectives in §5.3.
2. **Classroom or home?** In a classroom, the teacher-mode and seeded-scenario items move up the roadmap.
3. **Germany and UK content.** Will it receive the same rework? If not, consider hiding it until it does, so the Türkiye content gets the effort.
4. **Political sensitivity.** Many strong real cases (HES protests, Akbelen, Kaz Dağları, Cerattepe) are contested. Recommended framing: present stakeholder positions and evidence without assigning blame to named companies or people, and cite sources.
5. **Numbers in content.** Every figure shown to students should carry a `SourceRef`. Items marked **U** above should not ship until they are sourced.
6. **Simulation bots are heuristics.** Before balancing, playtest with 5–10 students using think-aloud protocols, to confirm that the "click red, compare numbers" behaviour shows up in humans as it does in the bots.
