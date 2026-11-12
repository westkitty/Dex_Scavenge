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
