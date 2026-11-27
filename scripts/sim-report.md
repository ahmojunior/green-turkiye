# Sim report

200 seeded runs per policy, all countries and regions. Minutes assume 15 s per decision, 4 s per day and 8 s per project; playtests calibrate these.

| Policy | Win | Timeout | Days p25 / p50 / p75 | Minutes p50 |
|---|---|---|---|---|
| smart | 44% | 0 | 15 / 26 / 31 | 7.0 |
| bribe | 0% | 0 | 6 / 8 / 11 | 2.4 |
| clean | 0% | 0 | 8 / 13 / 21 | 3.5 |
| maxTax | 55% | 0 | 25 / 31 / 38 | 8.5 |
| greedy | 33% | 0 | 12 / 23 / 28 | 6.2 |
| random | 5% | 0 | 9 / 16 / 27 | 5.0 |
| idle | 0% | 0 | 9 / 9 / 10 | 0.5 |

**Dominant strategy:** maxTax (55% wins).

## Endings

How often each ending was reached across all policies. An ending at 0 is unreachable with these policies.

| Ending | Runs |
|---|---|
| green-model | 26 |
| green-shadow | 176 |
| green | 70 |
| coast-sold | 69 |
| toxic | 287 |
| clean-broke | 611 |
| bankrupt | 10 |
| uprising | 151 |

## Event frequency

18906 crises opened across all runs. 0 of 124 events never appeared.

| Most frequent | Count | Share |
|---|---|---|
| microplastic-water | 1273 | 6.7% |
| green-jobs-training | 1252 | 6.6% |
| forest-fire-risk | 1241 | 6.6% |
| factory-waste | 1237 | 6.5% |
| urban-heatwave | 1220 | 6.5% |

| Least frequent (seen) | Count | Share |
|---|---|---|
| dust-transport | 30 | 0.2% |
| ruhr-smog-alert | 32 | 0.2% |
| malatya-apricot | 33 | 0.2% |
| ergene-textile-dye | 33 | 0.2% |
| ruhr-urban-greening | 36 | 0.2% |
