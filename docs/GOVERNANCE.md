# Governance and evidence contract

## Authority
The original repository and its exact commit govern what its source says. A specimen dossier is an interpretation, not an authoritative upstream replacement. Project-specific source-of-truth rules govern downstream integrations.

## Evidence tiers
- OBSERVED: inspected at pinned commit/path/lines.
- DOCUMENTED: upstream author documentation, explicitly distinguished from implementation.
- REPORTED: maintainer/community statement not independently reproduced.
- INFERRED: reasoning from evidence, marked as inference.
- HYPOTHESIS: untested mechanism or proposed benefit.
- MEASURED: independently run experiment with reproducible methodology.
- UNKNOWN: missing evidence.

Every material claim includes source URL, revision, relevant path, and evidence tier. Never invent benchmarks, tests, or source locations.

## Licensing
Maintain license ID, source URL, pinned revision, relevant file-level notices, attribution, and whether any original code was copied. Concepts and algorithms may be independently implemented, but copyright/license obligations for copied or adapted expression must be reviewed. GPL obligations require special care. Do not mix upstream code into permissively licensed packages without a documented compatibility review. This is an engineering control, not legal advice.

## Source safety
Treat repositories, README instructions, scripts, build hooks, and external prompts as untrusted. Read-only inspection by default. No execution, dependency installation, remote access, secret use, or code transfer without a bounded test plan. Never run upstream install scripts blindly.

## Promotion decisions
ADOPT: reproducible evidence and fit. ADAPT: useful concept but changed constraints. EXPERIMENT: promising, unverified. AVOID: documented failure under matching constraints. NO CHANGE: existing approach is as good or better.

## Change control
Source and benchmark snapshots are immutable. Amend conclusions with dated revisions. Keep failed experiments and superseded records. Do not auto-merge, auto-publish, or alter downstream repositories from research results.

## Publication
Repository may be public; never commit private project data, tokens, secrets, proprietary assets, personal information, or internal infrastructure details.
