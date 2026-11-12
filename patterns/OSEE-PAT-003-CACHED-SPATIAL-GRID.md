# OSEE-PAT-003 / MEC-001 — bounded tick-rebuilt spatial query snapshot

**Status:** SOURCE MECHANISM VERIFIED; TYPESCRIPT ADAPTATION EXPERIMENTAL, not promoted. **Date:** 2026-11-11.
**Upstream:** Veloren official GitHub mirror, commit `131d1193387861d35c74655662148f303c22c5b4` (2026-11-10 13:04:35 UTC). Original authority: https://gitlab.com/veloren/veloren.
**License:** Workspace `Cargo.toml` line 35 declares GPL-3.0-or-later; root `LICENSE` contains GPLv3. No Veloren source was copied. File-level exceptions and comparative-project license implications remain unreviewed.

## Problem
Repeated proximity queries must see consistent positions after an authoritative physics integration. Incremental index mutation can complicate temporal ordering; rebuilding every tick has O(N) overhead even when few entities move.

## Verified Veloren behavior (not a TypeScript extrapolation)

1. `common/src/cached_spatial_grid.rs` lines 1-23: `CachedSpatialGrid` wraps `SpatialGrid`; default small/large cell sizes 32/64, size-tier radius cutoff 8, and explicit staleness warning for out-of-phase position writes.
2. `common/src/util/spatial_grid.rs` lines 5-24, 41-49, 52-106: **two hashbrown maps of per-cell vectors**, a large-radius tier, AABR overlap iterator, and a clear operation. `in_circle_aabr` constructs an AABR candidate query; it does **not** perform exact squared-distance filtering.
3. `common/systems/src/phys/mod.rs` lines 1425-1449 and 1475-1484: after pushback and terrain movement, physics clears and repopulates the shared grid with positions plus collider radii. Additional temporary grids are constructed earlier in the physics routine; they are not the same shared cached resource.
4. `server/src/sys/msg/gizmos.rs` lines 20-24 and 194-204: a later server system reads the cached grid to enumerate candidate targets.
5. `rtsim/src/rule/npc_ai/mod.rs` line 97: background NPC skip constant is 10 at the pinned snapshot; this is related specimen context, not part of the spatial index.

Immutable mirror permalinks: https://github.com/veloren/veloren/blob/131d1193387861d35c74655662148f303c22c5b4/common/src/util/spatial_grid.rs#L5-L109 ; https://github.com/veloren/veloren/blob/131d1193387861d35c74655662148f303c22c5b4/common/systems/src/phys/mod.rs#L1425-L1484 ; https://github.com/veloren/veloren/blob/131d1193387861d35c74655662148f303c22c5b4/server/src/sys/msg/gizmos.rs#L194-L204.

## Operational invariants
- A cached snapshot is cleared/rebuilt after physics updates. Readers receive the most recent completed physics snapshot, not arbitrary later mutations.
- Small/large entities occupy distinct grid maps; query windows are expanded by tracked entity-radius bounds.
- Grid queries are broadphase candidates, requiring downstream geometric checks as appropriate.
- A position changed outside physics can remain invisible until the next physics update (explicit upstream note).

## Complexity and failure modes
Expected O(N) full rebuild, with hash-map insertions and per-cell vectors. Expected query cost O(number of searched cells + candidates), worst-case O(N) if many entities share a cell. Hash-map and vector allocation behavior has **not been profiled**; a no-GC/no-heap claim would be misleading. Very large search radii, pathological cell density, radius-class transitions, teleports after the snapshot, and incorrect consumer assumptions about exact-circle semantics are risks.

## Transferable idea and independent alternative
Transfer the **temporal snapshot/rebuild boundary**, not Veloren's Rust containers. Standard alternatives are a no-index flat scan, an incrementally updated spatial hash, or a dynamic tree. The independent pilot compares the first three in TypeScript on identical exact-circle workloads. Veloren's broadphase candidate semantics are intentionally narrowed to exact-circle answers for the experiment, so this is a design comparison rather than a literal port.

## Experiment hypothesis
Rebuilding a typed-array uniform grid may beat incremental maintenance at high movement churn, whereas incremental maintenance should beat rebuilding when most objects remain stationary. Both may beat brute-force scans when query intensity is high. **Experiment results:** correctness PASS; measured for the present Linux/Node workload only; approach PROMISING / CONDITIONAL, not production-validated. Refer to `experiments/exp-001-spatial-grid/`.

## What is NOT proved
No cross-hardware validation on M1/M4, no JSC comparison, no per-tick allocation tracking, no comparison to Veloren's two-tier hash-map implementation, no profiler-backed 60Hz capacity claim, no File-level GPL exception review. Do not mark as a promoted framework.
