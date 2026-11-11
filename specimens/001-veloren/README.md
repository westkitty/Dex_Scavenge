# Specimen 001 — Veloren

Source: https://gitlab.com/veloren/veloren
Language: primarily Rust.
Purpose: investigate language-independent simulation and architecture patterns for independent TypeScript implementations.

**Status: candidate / source revision not yet pinned.**
Do not claim that specific internal mechanisms, benchmarks, or licensing of individual files have been verified by this repository yet.

## Research targets
1. Background real-time world simulation (`rtsim`): entity activity, update cadence, persistence boundaries.
2. ECS: components, scheduling, ownership, query patterns.
3. Spatial indexing: nearby-entity queries, staleness and update semantics.
4. Procedural world generation: deterministic seeds and site/terrain stages.
5. Client/server separation and synchronization.
6. Asset/data-driven content and extension boundaries.

## First tasks
- Capture upstream commit SHA, retrieval date, default branch, license notices.
- Identify exact paths and lines supporting each proposed mechanism.
- Write three pattern dossiers using `templates/PATTERN.md`.
- Contrast at least one pattern with a simpler approach and one independent project.
- Choose one bounded TypeScript experiment; do not import Veloren code.
- Record all rejected hypotheses.

## Prohibited shortcuts
Do not equate a directory name with implementation proof. Do not assume update frequencies, scalability, or performance gains without source inspection and measurements. Do not require Rust in downstream projects.
