#!/usr/bin/env python3
"""Dex//Scavenge registry contract validator. Standard library only."""
import json
import pathlib
import sys

ROOT = pathlib.Path(__file__).resolve().parents[1]
STATES = {"candidate", "pinned", "mapped", "extracted", "compared", "experimental", "validated", "integrated", "promoted", "rejected", "blocked", "superseded"}
PATTERN_STATES = STATES | {"hypothesis"}
REQUIRED = {"schema_version", "project", "specimens", "patterns", "experiments", "promoted_components"}


def check_registry(data):
    errors = []
    if not isinstance(data, dict):
        return ["root must be an object"]
    missing = REQUIRED - set(data)
    if missing:
        errors.append("missing keys: " + ", ".join(sorted(missing)))
    if data.get("schema_version") != 1:
        errors.append("schema_version must be 1")
    if data.get("project") != "Dex//Scavenge":
        errors.append("project name must be Dex//Scavenge")
    seen = set()
    for group in ("specimens", "patterns", "experiments", "promoted_components"):
        records = data.get(group)
        if not isinstance(records, list):
            errors.append(group + " must be an array")
            continue
        for index, item in enumerate(records):
            label = f"{group}[{index}]"
            if not isinstance(item, dict):
                errors.append(label + " must be an object")
                continue
            ident = item.get("id")
            if not isinstance(ident, str) or not ident.strip():
                errors.append(label + " needs nonempty id")
            elif (group, ident) in seen:
                errors.append(label + " duplicate id: " + ident)
            else:
                seen.add((group, ident))
            status = item.get("status")
            if status not in (PATTERN_STATES if group == "patterns" else STATES):
                errors.append(label + " invalid status: " + repr(status))
            if group == "specimens":
                if not isinstance(item.get("source"), str) or not item["source"].startswith("https://"):
                    errors.append(label + " requires https source")
                if status not in {"candidate", "blocked", "rejected"} and not item.get("commit"):
                    errors.append(label + " must have pinned commit before advancing")
                if item.get("commit") is not None:
                    sha = item["commit"]
                    if not isinstance(sha, str) or len(sha) != 40 or any(c not in "0123456789abcdefABCDEF" for c in sha):
                        errors.append(label + " commit must be 40 hex characters")
            if group == "promoted_components" and status != "promoted":
                errors.append(label + " promoted_components may contain only promoted records")
    return errors


def main():
    path = ROOT / "registry.json"
    try:
        data = json.loads(path.read_text(encoding="utf-8"))
    except (OSError, ValueError) as exc:
        print("FAIL: registry unreadable: " + str(exc), file=sys.stderr)
        return 1
    errors = check_registry(data)
    if errors:
        for error in errors:
            print("FAIL: " + error, file=sys.stderr)
        return 1
    print("PASS: registry contract valid")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
