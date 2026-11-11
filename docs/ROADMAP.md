# Six-month program roadmap

Timeboxes are planning estimates, not guaranteed completion dates.

## Month 1 — Veloren source intelligence
Pin source revision and licenses; map rtsim, ECS, world generation, spatial indexing; create three evidence-backed candidate pattern dossiers. **Gate:** every claim traceable to inspected source.

## Month 2 — Cross-language experiments
Implement one narrow TypeScript baseline and one informed alternative, with deterministic fixtures, memory/time measurements, and counterexamples. **Gate:** repeatable results and no unexplained correctness differences.

## Month 3 — Reusable kernel decision
Only if evidence supports it, isolate independent scheduler/entity/event packages with versioned APIs. **Gate:** simpler implementation comparison and tests.

## Month 4 — Living-world demonstration
Build a small autonomous-agent prototype with persistence and replay, bounded workload and failure injection. **Gate:** deterministic recovery and measured performance.

## Month 5 — Real project integration
Choose one existing project with explicit permission, baseline protected behavior, integrate one component behind a rollback switch. **Gate:** actual regression proof and demonstrable value.

## Month 6 — Consolidate and expand
Review API stability, docs, licenses, integration outcomes; reject weak abstractions; select specimen 002 through a contrastive evidence review. **Gate:** independent cold-start reproduction.

## Stop conditions
Pause when source provenance is missing, legal reuse is unclear, results cannot be reproduced, the new abstraction underperforms a simple baseline without compensating benefits, or downstream integration damages core behavior.
