# EXP-001 — spatial index maintenance pilot

Source question: Veloren's tick-rebuilt `CachedSpatialGrid`, pinned at `131d1193387861d35c74655662148f303c22c5b4`. This experiment is an **independently authored point-query adaptation**, not Veloren's implementation (which uses two `HashMap<Vec2<i32>, Vec<Entity>>` levels and broadphase AABR queries).

## Run

Node.js 22.16+ with the built-in experimental TypeScript transform (no npm install, no upstream scripts):

```sh
node --experimental-transform-types experiments/exp-001-spatial-grid/run.ts --test
node --experimental-transform-types experiments/exp-001-spatial-grid/run.ts --bench
```

The nearest `package.json` must set `"type": "commonjs"`, as provided in this experiment directory. Alternatively use an installed `tsc` to transpile as CommonJS, then run the generated JS. **Run from the repository root**. The benchmark overwrites only its own `results-exp-001.json` locally, which is intentionally not treated as an immutable original across repeated runs; preserve each run separately if comparing environments.

## Preregistered pilot

Algorithms: SoA brute-force oracle, flat `Int32Array` tick-rebuilt grid, and doubly linked incrementally maintained spatial grid. Exact-circle query results are identical. World bounds [-512,512), cell size 32, query radii 16/48/128. Dataset seed 0xdeadbeef. Entity counts 384/1536; churn 2%/70%; uniform/clustered; 24 queries per tick; 32 warmup plus 100 measured ticks per case, three repeats. Precomputed movements and queries are identical across methods and generated outside timed ticks. Every timed tick includes position writes, index maintenance, and proximity queries. An 45,000-ms wall-budget stop protects against runaway execution. Each workload has strict differential oracle checks before timing; cross-method checksums and hit counts agree after timing.

## Result interpretation

`results-summary.json` is the local Linux/Node pilot summary. `results-exp-001.json` holds full per-repetition timing summaries and memory telemetry. Neither contains raw per-tick samples; future versions should record those separately for stronger tail-latency statistics. No p99 guarantee is claimed from 100 samples/run. The 2% churn configurations generally favored incremental maintenance, while rebuilding was competitive or superior at 70% churn at the larger uniform case. Results are environment-specific and fluctuate at microsecond scale.

This does **not** establish zero allocations, performance on Apple M1/M4, superiority to Veloren's exact implementation, a production-ready component, or an adoption decision. Retain both the script and failed/negative outcomes.
