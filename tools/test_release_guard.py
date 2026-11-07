"""Adversarial release authorization checks. Author: Bob Robert."""
import json
import os
from pathlib import Path
import subprocess
import sys
import tempfile
import unittest
from release_guard import authorize

ROOT = Path(__file__).resolve().parents[1]
POLICY = json.loads((ROOT / "tools/release-policy.json").read_text())
SHA = "a" * 40


class ReleaseAuthorizationTests(unittest.TestCase):
    def setUp(self):
        self.context = {"event_name": "workflow_dispatch", "repository": POLICY["repository"], "actor": POLICY["owner"], "sha": SHA, "ref": POLICY["release_ref"]}
        self.event = {"inputs": {"release_mode": "production", "confirm_sha": SHA}}

    def test_exact_owner_request_authorizes_production(self):
        self.assertEqual(authorize(POLICY, self.context, self.event, SHA), {"production": "true", "release_sha": SHA})

    def test_default_run_never_authorizes_production(self):
        self.assertEqual(authorize(POLICY, self.context, {}, SHA)["production"], "false")

    def test_candidate_branch_can_validate_without_releasing(self):
        self.context["ref"] = "refs/heads/codex/candidate"
        self.assertEqual(authorize(POLICY, self.context, {"inputs": {"release_mode": "validate"}}, SHA)["production"], "false")

    def test_wrong_event_is_denied(self):
        for value in ["push", "pull_request", "pull_request_target", "workflow_run", "repository_dispatch", ""]:
            with self.subTest(value=value), self.assertRaises(ValueError):
                authorize(POLICY, self.context | {"event_name": value}, self.event, SHA)

    def test_other_actor_is_denied(self):
        for value in ["dependabot[bot]", "vercel[bot]", "other-user", ""]:
            with self.subTest(value=value), self.assertRaises(ValueError):
                authorize(POLICY, self.context | {"actor": value}, self.event, SHA)

    def test_other_repository_is_denied(self):
        with self.assertRaises(ValueError):
            authorize(POLICY, self.context | {"repository": "other/repository"}, self.event, SHA)

    def test_branch_pattern_cannot_release(self):
        for value in ["refs/heads/devin/another-branch", "refs/heads/main", "refs/tags/release", POLICY["release_ref"] + "/suffix", ""]:
            with self.subTest(value=value), self.assertRaises(ValueError):
                authorize(POLICY, self.context | {"ref": value}, self.event, SHA)

    def test_missing_or_wrong_confirmation_is_denied(self):
        for value in [None, "", "a" * 7, "b" * 40, SHA + "\n", "$(echo bad)"]:
            event = {"inputs": {"release_mode": "production", "confirm_sha": value}}
            with self.subTest(value=value), self.assertRaises(ValueError):
                authorize(POLICY, self.context, event, SHA)

    def test_mismatched_checkout_is_denied(self):
        with self.assertRaises(ValueError):
            authorize(POLICY, self.context, self.event, "b" * 40)

    def test_invalid_source_sha_is_denied(self):
        for value in ["", "HEAD", "a" * 7, "g" * 40, SHA + "\n", "$(echo bad)"]:
            with self.subTest(value=value), self.assertRaises(ValueError):
                authorize(POLICY, self.context | {"sha": value}, self.event, value)

    def test_unknown_mode_is_denied(self):
        with self.assertRaises(ValueError):
            authorize(POLICY, self.context, {"inputs": {"release_mode": "publish-all"}}, SHA)

    def test_command_checks_real_checkout_and_writes_only_authorized_output(self):
        actual_sha = subprocess.check_output(["git", "rev-parse", "HEAD"], cwd=ROOT, text=True).strip()
        with tempfile.TemporaryDirectory(prefix=".release-test-", dir=ROOT / "tools") as directory:
            event_path = Path(directory) / "event.json"
            output_path = Path(directory) / "output.txt"
            event_path.write_text(json.dumps({"inputs": {"release_mode": "production", "confirm_sha": actual_sha}}))
            env = os.environ | {"GITHUB_EVENT_NAME": "workflow_dispatch", "GITHUB_REPOSITORY": POLICY["repository"], "GITHUB_ACTOR": POLICY["owner"], "GITHUB_SHA": actual_sha, "GITHUB_REF": POLICY["release_ref"], "GITHUB_EVENT_PATH": str(event_path), "GITHUB_OUTPUT": str(output_path)}
            good = subprocess.run([sys.executable, str(ROOT / "tools/release_guard.py")], cwd=ROOT, env=env, capture_output=True, text=True)
            self.assertEqual(good.returncode, 0, good.stderr)
            self.assertEqual(output_path.read_text(), f"production=true\nrelease_sha={actual_sha}\n")
            output_path.unlink()
            bad = subprocess.run([sys.executable, str(ROOT / "tools/release_guard.py")], cwd=ROOT, env=env | {"GITHUB_SHA": "b" * 40}, capture_output=True, text=True)
            self.assertNotEqual(bad.returncode, 0)
            self.assertFalse(output_path.exists())


if __name__ == "__main__":
    unittest.main()
