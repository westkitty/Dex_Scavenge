# Dex//Scavenge project bible

Append-only operational record. Earlier entries must not be rewritten or deleted.

## 2026-11-11 — Foundation and first uplift
**Project:** westkitty/Dex_Scavenge
**Purpose:** language-independent extraction of reusable engineering knowledge from open-source projects; Veloren is specimen 001.
**Existing verified state:** README, pipeline, governance, roadmap, registry, specimen dossier, templates, and empty research/framework directories were present on GitHub before this uplift.
**Uplift scope:** registry validation, unit tests, GitHub Actions workflow, prioritized Veloren research queue, project Bible.
**Protected invariants:** no Rust requirement; no copied Veloren source; no claims of verified Veloren mechanisms or benchmarks; no automatic framework promotion; preserve source and licensing evidence.
**Delivery:** GitHub connector file commits on existing main branch; no branch migration or dependency installation.
**Validation status:** remote file creation/readback can verify persistence; GitHub Actions execution and test results require separate observation.
**Known limitations:** Veloren upstream commit remains unpinned; research hypotheses unverified; no independent simulation experiment yet.
**Next:** confirm CI run, pin upstream revision, inspect implementation and license, then preregister the first TypeScript experiment.

## 2026-11-11 — First pinned source audit and independent spatial pilot
**Project:** westkitty/Dex_Scavenge. **Scope:** Veloren specimen 001 and EXP-001 only; previous entry preserved as historical state, not current status.
**Upstream source:** official GitHub mirror commit `131d1193387861d35c74655662148f303c22c5b4`, committed 2026-11-10T13:04:35Z, exact pinned files and blob SHA-1 IDs in `specimens/001-veloren/source_manifest.json`. The GitLab API master response was older cached data and was not used for the pin.
**Verified:** CachedSpatialGrid has two HashMap cell tiers of per-cell vectors, radius-dependent candidate search, clear/rebuild after physics movement, and at least one gizmo consumer. ActorKind and Simulated/Loaded declarations, ID mapping, mutation BitSets, and background tick constant 10 were read at same revision.
**Corrections to Argon:** not a flat zero-GC typed array; `in_circle_aabr` is a broadphase AABR query; Node/V8 performance and memory claims were unverified; crate version 0.18.0 is not a commit; original proposed benchmark is not feasible as a pilot.
**Implemented:** self-contained zero-runtime-dependency TypeScript experiment with brute-force, rebuilt typed-array grid, and incremental typed-array grid; explicit differential tests and 8 preregistered pilot workloads.
**Validation:** strict TypeScript compile PASS; Node 22 native TypeScript `--test` PASS; pilot benchmark generated comparison JSON; no M1/M4 or JSC measurements. Results environment-specific, no production framework promoted.
**Delivery state:** source and experiment files prepared for task-scoped branch commit; Google Drive dedicated ledger append pending successful remote commit.
**Outstanding:** complete MR merge-state check, source file-level licensing notices, perf/alloc profiling, cross-platform repeatability and full lifecycle experiments for MEC-002.
**Next bounded milestone:** independently rerun EXP-001 on M1 and M4 using the committed script and cross-check correctness and p95/p99 without expanding the algorithm matrix.

## 2026-11-11 — Delivery and independent readback of EXP-001
**Remote branch:** `scavenge/veloren-exp001-20261111`; initial source/experiment commit `499ab6221c277597ba30c22af0c5883b5ecd2778` verified by immutable GitHub file blob readbacks and compare against previous main HEAD. Commit created directly via GitHub connector (not local Git stage/push). Existing main was preserved.
**Tests:** strict TypeScript compile PASS and Node22 differential tests PASS, pilot benchmark executed and independently rerun in this Linux environment. GitHub Actions workflow `Validate research contracts` run 43147806187 concluded SUCCESS on source/experiment commit, testing registry and existing Python unit suite; Actions does not run the new TypeScript test.
**Drive evidence:** appended finding VEL-20261111-001 to dedicated `Veloren — Engineering Findings Ledger` native Doc ID `1JnRlzwBkkYP6lFu7-phdc_twcV74GbkCDWK_qf1HdYg`; readback found finding, commit, and metrics; Drive metadata confirmed parent Veloren folder `1XiFfXUPNO8RZR2ou4cTlKFMJNdIViI_H`. Experiment files also archived to the distinct `Veloren/EXP-001-Evidence` Drive folder.
**Current status:** GitHub and Drive preservation VERIFIED for the first finding. Production promotion BLOCKED pending Apple Silicon and more representative validation; raw per-tick traces absent; GitLab mirror equivalence and individual file-level licensing still UNKNOWN.
**Exact next task:** run the already committed EXP-001 pilot on Apple M1 and M4, with same seeds, correctness and statistical output; do not broaden into additional experiments without evidence.

## 2026-11-11 — EXP-001 M4 verification, M1 scheduler block
**Continuation:** Read original EXP-001 source blob `aae32faf776c1512d5590068a8fe7c23cc2a5b80`, current registry, and operational state before execution. DEX//REACH fingerprints confirmed Big Mac arm64/Node v26.13.0 and MacBook arm64/Node v26.13.0. Big Mac `sysctl` verified Apple M4 with 32 GiB. Isolated benchmark sources were transferred and read back with matching Git blob hashes.
**Runtime incompatibility:** Node v26 removed `--experimental-transform-types`; strip-only mode cannot parse TypeScript constructor parameter properties. TypeScript v5.9.2 compiled unchanged TS source to CommonJS. Generated JS blob `618c83638ff63f27a1c6bf8631b03fa5542f12f6` preserved in experiment folder as `run.node26.cjs`.
**Observed:** M4 differential tests PASS; 8 workloads completed in two independent processes, each with three internal repetitions per algorithm. At 1536 entities, 2% movement favored incremental in both runs; 70% movement favored rebuilt in both. The 384-uniform 70% case flipped winner. Raw results and comparison in `experiments/exp-001-spatial-grid/CROSS_RUNTIME_REPORT.md`.
**Blocked:** MacBook live node scheduler rejected two attempted read-only probes with substantive slots (3/1, three uncoordinated heavy workloads); memory warning. No M1 benchmark run. No workaround through other remote-control tools. Cross-runtime verdict PARTIAL.
**Preserved invariants:** Original `run.ts` untouched, Linux results preserved, no upstream source copied, no downstream integration and no algorithm promotion.
**Next:** Acquire an idle MacBook M1 execution slot and run exact preserved JS in scratch with same Node major/minor and experiment seed, then independently compare.
