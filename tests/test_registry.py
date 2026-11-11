"""Contract tests for the Dex//Scavenge registry validator."""
import unittest
from tools.validate_registry import check_registry


def fixture():
    return {
        "schema_version": 1, "project": "Dex//Scavenge",
        "specimens": [{"id": "001", "name": "Veloren", "source": "https://gitlab.com/veloren/veloren", "commit": None, "status": "candidate"}],
        "patterns": [{"id": "OSEE-PAT-001", "status": "hypothesis"}],
        "experiments": [], "promoted_components": [],
    }


class RegistryTests(unittest.TestCase):
    def test_valid_candidate(self):
        self.assertEqual(check_registry(fixture()), [])

    def test_missing_key(self):
        data = fixture()
        del data["experiments"]
        self.assertTrue(check_registry(data))

    def test_duplicate_ids(self):
        data = fixture()
        data["patterns"].append(dict(data["patterns"][0]))
        self.assertTrue(any("duplicate" in e for e in check_registry(data)))

    def test_unpinned_advanced_specimen(self):
        data = fixture()
        data["specimens"][0]["status"] = "mapped"
        self.assertTrue(any("pinned commit" in e for e in check_registry(data)))

    def test_bad_sha(self):
        data = fixture()
        data["specimens"][0]["commit"] = "not-a-sha"
        self.assertTrue(any("40 hex" in e for e in check_registry(data)))

    def test_reject_unpromoted_component(self):
        data = fixture()
        data["promoted_components"] = [{"id": "mod-1", "status": "validated"}]
        self.assertTrue(any("only promoted" in e for e in check_registry(data)))


if __name__ == "__main__":
    unittest.main()
