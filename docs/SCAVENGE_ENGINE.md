# Scavenge Engine v0.2 — Veloren intake

This is a **bounded, read-only source metadata intake**, not an autonomous code analyst.

## Run locally
Python 3.10+; no third-party packages.

```sh
python -m unittest discover -s tests -v
python tools/validate_registry.py
python tools/scavenge.py --ref master --output reports/veloren-intake.json
```

The third command requires outbound HTTPS to GitLab. If blocked, it exits 2 and does not invent a commit or report.

## Run on GitHub
Go to **Actions → Veloren source intake → Run workflow**. Enter `master` or an exact 40-character commit SHA. Download the `veloren-intake-evidence` artifact from the completed run.

## What the engine actually does
- Resolves the selected upstream ref to a full Git commit SHA.
- Fetches a bounded GitLab tree (maximum 250 entries, three API pages).
- Records candidate source paths and immutable upstream URLs.
- Marks every finding `PATH_ONLY`, not verified implementation.
- Refuses to declare licensing, performance, or reusable framework readiness.
- Does not clone, execute, install, import, or copy upstream source code.
- Does not automatically change `registry.json` or promote patterns.

## Limitations and next phase
The bounded tree may omit paths beyond the first pages; `listed_in_bounded_tree=false` means **not observed**, not absent. License files are only path candidates. A second, explicitly reviewed stage must fetch exact file contents at the pinned commit, record line-level citations and license notices, and build genuine pattern dossiers. The third stage can generate and benchmark independent TypeScript experiments.

The first intake report is a GitHub Actions artifact, not an automatic repository commit. Human review controls source pin promotion.

## Security
No credentials or secrets are required for public GitLab API access. The only permitted upstream project is `veloren/veloren`; the tool does not run code from it. GitHub Actions uses read-only repository permissions.
