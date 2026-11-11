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
