# OPERATIONAL_STATE — Dex//Scavenge
project_id: westkitty/Dex_Scavenge
status: current-baseline / EXP-001 experimental
revision: 2
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
- M1/M4 and JavaScriptCore performance, zero-allocation claims, GitLab same-revision direct read, deep file-license exceptions, benchmark portability, user downstream integration.
- GitHub branch source/experiment commit 499ab6221c277597ba30c22af0c5883b5ecd2778 verified by remote blob SHA readbacks; GitHub Actions Python validation success (run 43147806187).
- Dedicated Google Drive ledger append VEL-20261111-001 verified by document text readback and parent folder ID 1XiFfXUPNO8RZR2ou4cTlKFMJNdIViI_H.
- TypeScript test/strict compile and second Linux benchmark run passed. Apple M1/M4 and raw per-tick sampling remain unverified.

## Nonregression guards
- Keep existing README/pipeline/governance/validator/test/workflows unchanged.
- No upstream Rust source copies; no unrelated projects or production promotion.
- Preserve old project Bible entries and append rather than replace historical decisions.
