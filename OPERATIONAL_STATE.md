# OPERATIONAL_STATE — Dex//Scavenge
project_id: westkitty/Dex_Scavenge
status: current-baseline / EXP-001 experimental
revision: 3
date: 2026-11-11

## Protected purpose
Reusable source-backed engineering knowledge. Not a code-copying program, game-engine rewrite, or general repository list.

## Current baseline
- Source snapshot pinned from Veloren's official GitHub mirror to `131d1193387861d35c74655662148f303c22c5b4` (primary GitLab source remains authoritative; direct same-SHA GitLab blob fetch not independently available).
- Typed-array benchmark is a new independent implementation; spatial-index API intentionally differs from Veloren's broadphase semantics.
- Existing Python metadata intake v0.2, registry validator, CI and docs remain unchanged.

## Verified
- Source files and line anchors in source_manifest.json read at pinned SHA.
- TypeScript strict compilation, differential tests, and pilot run passed in Linux Node 22 in this workspace.

## Unverified or blocked
- MacBook Air/M1 and JavaScriptCore performance, zero-allocation claims, GitLab same-revision direct read, deep file-license exceptions, true cross-Apple benchmark portability, user downstream integration.
- GitHub branch source/experiment commit 499ab6221c277597ba30c22af0c5883b5ecd2778 verified by remote blob SHA readbacks; GitHub Actions Python validation success (run 43147806187).
- Dedicated Google Drive ledger append VEL-20261111-001 verified by document text readback and parent folder ID 1XiFfXUPNO8RZR2ou4cTlKFMJNdIViI_H.
- TypeScript and second Linux benchmark passed. Apple M4 now has two independent Node v26.13.0 process runs with differential PASS (8 cases each); full per-repetition summaries archived. Apple M1 and raw per-tick sampling remain unverified.

## Nonregression guards
- Keep existing README/pipeline/governance/validator/test/workflows unchanged.
- No upstream Rust source copies; no unrelated projects or production promotion.
- Preserve old project Bible entries and append rather than replace historical decisions.

## EXP-001 cross-runtime continuation — 2026-11-11
- **Verified:** M4 Apple Silicon fingerprint (Apple M4, 32 GiB, Darwin arm64, Node v26.13.0); unchanged TypeScript compiled by tsc 5.9.2, generated JS blob 618c83638ff63f27a1c6bf8631b03fa5542f12f6. Both process runs passed correctness and completed 8 workloads; explicit pilot result in CROSS_RUNTIME_REPORT.md.
- **Blocked:** MacBook DEX//REACH scheduler rejected read-only probes because of uncoordinated heavy workload and memory warning, so M1 was not benchmarked. Do not bypass machine scheduler or infer M1 timings from the M4.
- **Pending:** exact compiled JS run on M1 when resources safe; no production promotion or raw per-tick p99 evidence.
