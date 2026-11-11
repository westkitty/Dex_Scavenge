#!/usr/bin/env python3
"""Read-only, evidence-first upstream specimen intake. Python standard library only.

No upstream code is executed. Network access is restricted to the configured GitLab
host, and source contents are not committed to the destination repository.
"""
import argparse
import datetime
import hashlib
import json
import pathlib
import re
import sys
import urllib.error
import urllib.parse
import urllib.request

ROOT = pathlib.Path(__file__).resolve().parents[1]
SHA = re.compile(r"^[0-9a-fA-F]{40}$")
DEFAULT_PATHS = ["README.md", "LICENSE", "LICENSE.md", "COPYING", "Cargo.toml",
                 "rtsim/Cargo.toml", "common/ecs/Cargo.toml", "world/Cargo.toml"]


def fetch_json(url, timeout=15):
    request = urllib.request.Request(url, headers={"User-Agent": "Dex-Scavenge/0.2", "Accept": "application/json"})
    with urllib.request.urlopen(request, timeout=timeout) as response:
        if response.status != 200:
            raise RuntimeError(f"unexpected HTTP status {response.status}")
        if int(response.headers.get("Content-Length", "0")) > 2_000_000:
            raise RuntimeError("response too large")
        raw = response.read(2_000_001)
        if len(raw) > 2_000_000:
            raise RuntimeError("response too large")
        return json.loads(raw)


def gitlab_url(project, suffix):
    encoded = urllib.parse.quote(project, safe="")
    return "https://gitlab.com/api/v4/projects/" + encoded + suffix


def resolve_commit(project, ref):
    if SHA.fullmatch(ref):
        return ref.lower()
    if not re.fullmatch(r"[A-Za-z0-9._/-]{1,120}", ref) or ref.startswith("-") or ".." in ref:
        raise ValueError("unsafe upstream ref")
    data = fetch_json(gitlab_url(project, "/repository/commits/" + urllib.parse.quote(ref, safe="")))
    commit = data.get("id", "")
    if not SHA.fullmatch(commit):
        raise RuntimeError("upstream did not return a full commit SHA")
    return commit.lower()


def fetch_tree(project, commit, limit=250):
    result = []
    page = 1
    while len(result) < limit and page <= 3:
        url = gitlab_url(project, "/repository/tree?recursive=true&per_page=100&page=" + str(page) + "&ref=" + commit)
        batch = fetch_json(url)
        if not isinstance(batch, list):
            raise RuntimeError("invalid tree response")
        result.extend({"path": item["path"], "type": item["type"]} for item in batch if isinstance(item, dict) and "path" in item and "type" in item)
        if len(batch) < 100:
            break
        page += 1
    return result[:limit]


def inspect(project, ref, paths=None):
    if project != "veloren/veloren":
        raise ValueError("v0.2 intake is restricted to veloren/veloren")
    commit = resolve_commit(project, ref)
    tree = fetch_tree(project, commit)
    paths = paths or DEFAULT_PATHS
    present = {item["path"] for item in tree}
    evidence = []
    for path in paths:
        evidence.append({
            "path": path,
            "listed_in_bounded_tree": path in present,
            "source_url": f"https://gitlab.com/{project}/-/blob/{commit}/{urllib.parse.quote(path, safe='/')}",
            "evidence_tier": "PATH_ONLY",
            "implementation_verified": False,
        })
    return {
        "schema_version": 1,
        "specimen": "001",
        "project": project,
        "commit": commit,
        "retrieved_utc": datetime.datetime.now(datetime.timezone.utc).isoformat(),
        "tree_truncated": len(tree) == 250,
        "tree_entries_examined": len(tree),
        "evidence": evidence,
        "license_verified": False,
        "implementation_verified": False,
        "promotion_eligible": False,
        "warning": "Tree/path discovery is not source-code inspection or license verification.",
    }


def main(argv=None):
    parser = argparse.ArgumentParser(description="Inspect pinned Veloren source metadata without running upstream code")
    parser.add_argument("--ref", default="master", help="upstream ref or full 40-character commit SHA")
    parser.add_argument("--output", help="write JSON snapshot to this path; defaults to stdout")
    args = parser.parse_args(argv)
    try:
        report = inspect("veloren/veloren", args.ref)
        output = json.dumps(report, indent=2) + "\n"
        if args.output:
            dest = pathlib.Path(args.output).resolve()
            if ROOT not in dest.parents:
                raise ValueError("output must be within repository")
            dest.parent.mkdir(parents=True, exist_ok=True)
            dest.write_text(output, encoding="utf-8")
            print(f"Saved {dest.relative_to(ROOT)}")
        else:
            print(output, end="")
        return 0
    except (ValueError, RuntimeError, urllib.error.URLError, TimeoutError, KeyError, json.JSONDecodeError) as exc:
        print("UNVERIFIED: " + str(exc), file=sys.stderr)
        return 2


if __name__ == "__main__":
    raise SystemExit(main())
