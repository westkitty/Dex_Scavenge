# Prioritized extraction queue

These are hypotheses awaiting source pinning and code inspection, not verified Veloren facts.

## 1. Background simulation boundaries
**Question:** What continues to change without an observing player, and which updates are approximate?
**Evidence required:** exact revision, source paths and lines, update scheduling, persistence boundary.
**Independent experiment:** 1,000 agents in deterministic fixed-tick TypeScript simulation with a simple all-agents baseline.
**Stop:** correctness divergence or no useful gain after measured overhead.

## 2. Entity organization and query cost
**Question:** How does Veloren organize entity state and system access?
**Evidence required:** concrete ECS components, query semantics, scheduling, update order.
**Independent experiment:** composition-based entity storage vs naive objects on the same workload.
**Stop:** added complexity without material value.

## 3. Spatial lookup
**Question:** What indexing strategy supports nearby-entity operations, and when does the index become stale?
**Evidence required:** index data structure, mutation/update path, consistency guarantees.
**Independent experiment:** brute-force distance queries vs a uniform spatial grid with moving agents.
**Stop:** incorrect nearest-neighbor results or weak gain at representative scales.

## Source verification checklist
- [ ] Resolve Veloren upstream 40-character commit SHA
- [ ] Record commit date and retrieval date
- [ ] Inspect root and file-level license notices
- [ ] Record paths and line anchors for each candidate
- [ ] Note source uncertainty and alternative interpretations
- [ ] Compare at least one independent alternative
- [ ] Approve experiment before code reuse or promotion

## Acceptance criteria for the first experiment
Repeatable correctness tests, documented workload and seed, baseline/candidate code, raw timing and memory results, environment fingerprint, regression test, and honest PASS/FAIL/UNVERIFIED verdict. No predetermined speedup claims.
