# EXP-001 — Apple Silicon cross-runtime verification (2026-11-11)

**Status:** PARTIAL CROSS-RUNTIME PROOF; M4 observed, M1 blocked by machine execution scheduler. No adoption/promotion. Reference source: `131d1193387861d35c74655662148f303c22c5b4` (Veloren official GitHub mirror); original independent TypeScript experiment Git blob `aae32faf776c1512d5590068a8fe7c23cc2a5b80` (commit `499ab6221c277597ba30c22af0c5883b5ecd2778`).

## Canonical workload and environment

Original EXP-001 script, seed `0xdeadbeef`; N=384/1536; churn 2%/70%; uniform/clustered; 24 queries/tick, radii 16/48/128; 32 warmup and 100 measured ticks per case; three repetitions per method per process. Differential oracle and cross-algorithm checksums mandatory. Methods: brute scan, tick-rebuilt uniform grid, incremental uniform grid. This is an independent exact-circle adaptation, not Veloren's two-scale AABR broadphase.

**M4:** macOS Darwin arm64, Apple M4 (10 logical CPUs), 32 GiB memory, Node.js v26.13.0. Both distinct Node process invocations passed deterministic differential tests and completed 8 cases. Wall durations: 1902.2 ms and 2189.1 ms. Execution in isolated scratch directory; original checkout, tests, and Linux raw results left unchanged. Node 26 rejects legacy `--experimental-transform-types`; native type stripping rejects parameter properties with `ERR_UNSUPPORTED_TYPESCRIPT_SYNTAX`. The pre-existing local TypeScript compiler v5.9.2 compiled the unchanged source with `tsc --strict --target ES2022 --module commonjs --skipLibCheck --noEmitOnError --outDir experiments/exp-001-spatial-grid experiments/exp-001-spatial-grid/run.ts`. Generated JS Git blob `618c83638ff63f27a1c6bf8631b03fa5542f12f6` is preserved as `run.node26.cjs`. Command executed from scratch root: `node experiments/exp-001-spatial-grid/run.js --test` then `--bench` in each process. No npm install or upstream script execution.

**MacBook Air:** Live `macbook-air.local` node fingerprint: Darwin arm64, user home and Node.js v26.13.0. CPU model not independently probed; expected M1 is based on project hardware inventory. At both read-only shell attempts, DEX//REACH returned `COORDINATOR_WAIT_TIMEOUT`: substantive slots exhausted `(3/1, including 3 uncoordinated heavy workload(s))`. Machine scheduler showed memory WARNING and ongoing uncoordinated heavy work. **No M1 benchmark was run, and no scheduler bypass was attempted.**

**Linux prior pilot:** Node v22.16.0, x86_64, original `results-exp-001.json` in the parent experiment directory; not directly comparable as a controlled hardware delta because Node and TypeScript execution mode differ.

## M4 measured results

Median complete tick duration in milliseconds; each displayed value is the median of three per-repetition p50 values from an independent Node process. Columns show **rebuilt / incremental**. Brute-force results and p95/p99 per-repetition fields are retained in the linked raw JSON.

| Entities | Distribution | Churn | Process 1 rebuilt / incremental | Process 2 rebuilt / incremental | Winner stability |
|---:|---|---:|---:|---:|---|
| 384 | uniform | 2% | 0.0245 / 0.0165 | 0.0454 / 0.0383 | incremental |
| 384 | clustered | 2% | 0.0343 / 0.0137 | 0.0350 / 0.0307 | incremental |
| 384 | uniform | 70% | 0.0205 / 0.0259 | 0.0454 / 0.0347 | FLIPPED |
| 384 | clustered | 70% | 0.0178 / 0.0195 | 0.0385 / 0.0436 | rebuilt |
| 1536 | uniform | 2% | 0.0720 / 0.0511 | 0.1182 / 0.0833 | incremental |
| 1536 | clustered | 2% | 0.0931 / 0.0630 | 0.0779 / 0.0645 | incremental |
| 1536 | uniform | 70% | 0.1296 / 0.1793 | 0.1257 / 0.1808 | rebuilt |
| 1536 | clustered | 70% | 0.1178 / 0.1200 | 0.1213 / 0.1340 | rebuilt |

All 8 cases in both processes passed oracle consistency and output identical cross-method checksums for matched workloads. Neither JSON file contains raw per-tick traces. Machine runtime interference, JIT tiering, timer quantization, and short warmup may explain variability; the experiment cannot attribute each fluctuation causally.

## Interpretation and stop rule

At N=1536, both process runs favored incremental for 2% churn and rebuilt for 70% churn. At N=384, uniform 70% churn **flipped winner between process invocations**; results there do not justify categorical selection. Most differences are measured in microseconds and p99 from 100 ticks per repetition is low-confidence. Index typed-array byte counts are not proof of zero heap allocation. 

**Reproducibility verdict: PARTIAL / M1 BLOCKED.** The M4 correctness and pilot are reproduced across two processes; cross-Apple-M1/M4 equivalence remains UNVERIFIED. Do not change algorithm choice, claim zero allocation or 60 Hz production readiness, run EXP-002/EXP-003, or modify downstream code on this evidence.

## Next bounded action

When MacBook DEX scheduler reports an available substantive slot and non-warning memory pressure, use `run.node26.cjs` byte-for-byte (verify Git blob `618c83638ff63f27a1c6bf8631b03fa5542f12f6`), run `--test` and two independent `--bench` invocations in an isolated scratch directory without touching active projects; preserve raw JSON separately and compare the same eight workloads at matching Node v26.13.0. If scheduler remains occupied, stop without bypassing it. M1's CPU model must be directly fingerprinted before claiming M1-specific execution.
