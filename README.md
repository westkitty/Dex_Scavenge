# Dex//Scavenge
**Open-Source Engineering Extraction** — a permanent, language-independent research and validation program.

> Stop solving the same hard problems repeatedly.

Dex//Scavenge studies sophisticated open-source projects, extracts transferable engineering knowledge, compares alternative designs, runs independent experiments, and promotes only validated reusable components. **Veloren is specimen 001**, not a dependency or a framework to port wholesale.

## Principles
1. Knowledge first; code only when it earns its existence.
2. Source-pin every claim to a repository, commit, path, and relevant lines.
3. Separate observed implementation from interpretation and hypothesis.
4. Compare against simpler baselines and independent precedents.
5. Prefer TypeScript/JavaScript for browser-facing implementations; Python for research automation. No Rust adoption requirement.
6. Preserve licenses and provenance; never assume that source-code reuse is unrestricted.
7. A failed experiment is valuable evidence. Never silently promote it.
8. Keep modules independently usable; no compulsory monolithic engine.

## Start here
- [Pipeline](docs/PIPELINE.md) — intake to maintenance
- [Governance](docs/GOVERNANCE.md) — evidence, licenses, promotion gates
- [Roadmap](docs/ROADMAP.md) — six-month staged plan
- [Veloren specimen](specimens/001-veloren/README.md) — first investigation
- [Pattern template](templates/PATTERN.md)
- [Experiment template](templates/EXPERIMENT.md)
- [Integration template](templates/INTEGRATION.md)
- [Registry](registry.json) — machine-readable queue

## Repository map
```
docs/           Program rules, roadmap, pipeline
specimens/      Source-project dossiers and evidence
patterns/       Transferable engineering patterns
experiments/    Independent hypotheses and measured results
frameworks/     Validated reusable components only
templates/      Required report contracts
registry.json   Intake and promotion states
```

## First milestone
Pin Veloren's upstream GitLab commit and license evidence; map `rtsim`, ECS, and spatial queries; document three candidate patterns; independently reproduce one in TypeScript; measure against a straightforward baseline. **None of these are yet validated or production-ready.**

## Status
Foundation initialized. No Veloren source copied. No experimental performance claims. No framework promoted.

## Upstream
Veloren: https://gitlab.com/veloren/veloren

Project name: **Dex//Scavenge**. Repository slug: `Dex_Scavenge`.
