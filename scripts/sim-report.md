# Sim report

200 seeded runs per policy, all countries and regions. Minutes assume 15 s per decision, 4 s per day and 8 s per project; playtests calibrate these.

| Policy | Win | Timeout | Days p25 / p50 / p75 | Minutes p50 |
|---|---|---|---|---|
| smart | 55% | 0 | 19 / 28 / 31 | 7.1 |
| bribe | 0% | 0 | 6 / 8 / 11 | 2.4 |
| clean | 0% | 0 | 8 / 12 / 20 | 3.4 |
| maxTax | 56% | 1 | 27 / 32 / 45 | 8.8 |
| greedy | 41% | 0 | 15 / 26 / 30 | 6.8 |
| random | 7% | 1 | 10 / 18 / 30 | 5.2 |
| idle | 0% | 0 | 9 / 9 / 10 | 0.5 |

**Dominant strategy:** maxTax (56% wins).

## Endings

How often each ending was reached across all policies. An ending at 0 is unreachable with these policies.

| Ending | Runs |
|---|---|
| green-model | 48 |
| green-shadow | 170 |
| green | 97 |
| coast-sold | 71 |
| toxic | 281 |
| clean-broke | 564 |
| bankrupt | 10 |
| uprising | 157 |

## Event frequency

20606 crises opened across all runs. 0 of 124 events never appeared.

| Most frequent | Count | Share |
|---|---|---|
| microplastic-water | 1379 | 6.7% |
| green-jobs-training | 1361 | 6.6% |
| forest-fire-risk | 1354 | 6.6% |
| factory-waste | 1342 | 6.5% |
| urban-heatwave | 1334 | 6.5% |

| Least frequent (seen) | Count | Share |
|---|---|---|
| dust-transport | 30 | 0.1% |
| malatya-apricot | 31 | 0.2% |
| harran-salinity | 35 | 0.2% |
| southeastern-desertification | 36 | 0.2% |
| ruhr-smog-alert | 36 | 0.2% |
