import unittest
from unittest.mock import patch
from tools import scavenge


class IntakeTests(unittest.TestCase):
    def test_unsafe_ref_rejected(self):
        with self.assertRaises(ValueError):
            scavenge.resolve_commit("veloren/veloren", "../bad")
    def test_sha_is_stable_and_offline(self):
        sha = "a" * 40
        self.assertEqual(scavenge.resolve_commit("veloren/veloren", sha), sha)
    def test_other_projects_blocked(self):
        with self.assertRaises(ValueError):
            scavenge.inspect("unknown/project", "a" * 40)
    @patch.object(scavenge, "fetch_tree", return_value=[{"path": "README.md", "type": "blob"}])
    def test_evidence_not_promoted(self, fetch):
        result = scavenge.inspect("veloren/veloren", "a" * 40)
        self.assertFalse(result["license_verified"])
        self.assertFalse(result["implementation_verified"])
        self.assertFalse(result["promotion_eligible"])
        self.assertEqual(result["evidence"][0]["evidence_tier"], "PATH_ONLY")
        self.assertTrue(result["evidence"][0]["listed_in_bounded_tree"])
        self.assertFalse(result["evidence"][0]["implementation_verified"])
    @patch.object(scavenge, "fetch_json", return_value={"id": "b" * 40})
    def test_ref_resolution(self, fetch):
        self.assertEqual(scavenge.resolve_commit("veloren/veloren", "master"), "b" * 40)


if __name__ == "__main__":
    unittest.main()
