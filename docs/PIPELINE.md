# Extraction pipeline

Each stage produces durable evidence. A later stage cannot retroactively establish an earlier gate.

| Stage | Input | Output | Exit gate |
|---|---|---|---|
| 0 Discover | Candidate project | Intake note | Clear reusable question and legal source |
| 1 Pin | Source URL | Exact commit, license, date | Revision and license recorded |
| 2 Map | Pinned tree | Subsystem and dependency map | Relevant code paths located |
| 3 Extract | Code + docs | Pattern dossier | Mechanism and assumptions supported |
| 4 Compare | Pattern | Two independent analogues where useful | Tradeoffs and counterexamples documented |
| 5 Experiment | Testable hypothesis | Independent implementation + baseline | Correctness tests and measurements |
| 6 Validate | Reproducible results | Verdict and limits | Re-run, regression, portability, license |
| 7 Integrate | Validated module | Pilot integration | No protected behavior regresses |
| 8 Promote | Pilot evidence | Versioned component | Review approval, docs, tests, provenance |
| 9 Maintain | Upstream and downstream changes | Drift report | Changes reconciled or explicitly deferred |

## States
`candidate -> pinned -> mapped -> extracted -> compared -> experimental -> validated -> integrated -> promoted`. Any state may become `rejected`, `blocked`, or `superseded`. Never equate documentation with proof.

## Intake cadence
- Weekly: review up to three candidates; accept at most one new specimen without displacing active work.
- Every two weeks: one evidence review of the active specimen.
- Monthly: decide whether experiments deserve more time, and review upstream changes.
- Quarterly: inspect integration outcomes and retire unhelpful abstractions.
These are proposed operating cadences, not scheduled automations.

## Automated checks
Schema and link checks can be automated. Architectural interpretation, license conclusions, experimental fairness, and production promotion require explicit review.

## Experiment minimum
Define a baseline, representative workload, seed, hardware/runtime, warmup, repetition count, CPU/memory/timing collection, correctness oracle, and stopping threshold **before** running. Report actual observations, not illustrative values.

## Promotion rule
No production framework is promoted from source reading alone. Require reproducible independent tests, comparison against a simple solution, at least one real integration, clear licensing, rollback, and named reviewer approval.
