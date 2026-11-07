"""Authorize an exact, owner-requested release. Author: Bob Robert."""
import json
import os
from pathlib import Path
import re
import subprocess
import sys


def authorize(policy, context, event, checkout_sha):
    inputs = event.get("inputs") or {}
    mode = inputs.get("release_mode", "validate")
    if context.get("event_name") != "workflow_dispatch":
        raise ValueError("Only an explicit manual run is permitted")
    if context.get("repository") != policy["repository"]:
        raise ValueError("Unexpected repository")
    if context.get("actor") != policy["owner"]:
        raise ValueError("Only the named owner can authorize this workflow")
    sha = context.get("sha", "")
    if not re.fullmatch(r"[0-9a-f]{40}", sha) or checkout_sha != sha:
        raise ValueError("Checkout does not match the exact workflow commit")
    if mode not in {"validate", "production"}:
        raise ValueError("Unknown release mode")
    if mode == "production":
        if context.get("ref") != policy["release_ref"]:
            raise ValueError("Production requires the exact release branch")
        if inputs.get("confirm_sha") != sha:
            raise ValueError("Owner confirmation must match the complete commit SHA")
    return {"production": "true" if mode == "production" else "false", "release_sha": sha}


def main():
    root = Path(__file__).resolve().parents[1]
    policy = json.loads((root / "tools/release-policy.json").read_text())
    context = {key: os.environ.get("GITHUB_" + key.upper(), "") for key in ["event_name", "repository", "actor", "sha", "ref"]}
    try:
        event = json.loads(Path(os.environ["GITHUB_EVENT_PATH"]).read_text())
        checkout_sha = subprocess.check_output(["git", "rev-parse", "HEAD"], cwd=root, text=True).strip()
        output = authorize(policy, context, event, checkout_sha)
        with open(os.environ["GITHUB_OUTPUT"], "a", encoding="utf-8") as stream:
            for key, value in output.items():
                stream.write(f"{key}={value}\n")
    except (KeyError, ValueError, OSError, subprocess.CalledProcessError) as error:
        print(f"Release denied: {error}", file=sys.stderr)
        return 1
    print("Exact source verified. Production authorized: " + output["production"])
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
