"""Offline checks for Second Brain Logger instructions and Markdown examples.

No server-side Obsidian behavior can be proven by these static tests.
Use mcp-live-checklist.md for connected integration checks.
"""
import datetime as dt
import json
import re
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SKILL = (ROOT / "SKILL.md").read_text(encoding="utf-8")
MCP = (ROOT / "references/mcp-operations.md").read_text(encoding="utf-8")
POLICY = (ROOT / "references/logging-policy.md").read_text(encoding="utf-8")
PROPS = (ROOT / "references/properties-and-naming.md").read_text(encoding="utf-8")
RECALL = (ROOT / "references/retrieval-and-promotion.md").read_text(encoding="utf-8")
README = (ROOT / "README.md").read_text(encoding="utf-8")
TEMPLATE = (ROOT / "templates/log.md").read_text(encoding="utf-8")
EXAMPLE = (ROOT / "examples/fix-login-redirect.md").read_text(encoding="utf-8")
ALL_DOCS = [ROOT / "SKILL.md", ROOT / "README.md", *ROOT.glob("references/*.md"),
            *ROOT.glob("templates/*.md"), *ROOT.glob("examples/*.md")]


def frontmatter(md):
    if not md.startswith("---\n"):
        raise AssertionError("Missing YAML frontmatter start")
    parts = md.split("\n---\n", 1)
    if len(parts) != 2:
        raise AssertionError("Missing YAML frontmatter end")
    return parts[0][4:], parts[1]


class StructureTests(unittest.TestCase):
    def test_skill_frontmatter_and_no_version(self):
        raw, body = frontmatter(SKILL)
        self.assertRegex(raw, r"(?m)^name: second-brain-logger$")
        self.assertRegex(raw, r"(?m)^description: Use when .+")
        self.assertNotRegex(raw, r"(?im)^\s*version\s*:")
        self.assertLess(len(body.split()), 780, "Keep SKILL.md focused; defer details to references")

    def test_referenced_files_exist(self):
        for reference in re.findall(r"\]\((references/[^)]+\.md|templates/[^)]+\.md|examples/[^)]+\.md)\)", SKILL):
            with self.subTest(reference=reference):
                self.assertTrue((ROOT / reference).is_file())

    def test_one_unversioned_package_contract(self):
        for doc in ALL_DOCS:
            txt = doc.read_text(encoding="utf-8")
            with self.subTest(doc=doc.name):
                self.assertNotRegex(txt, r"(?im)^\s*version\s*:")
                self.assertNotRegex(txt, r"(?i)\bv[0-9]+(?:\.[0-9]+)*\b")
                self.assertNotIn("Projects/Pionero/", txt)
                self.assertNotIn("<project-id>", txt)
                self.assertNotIn("SECOND_BRAIN_VAULT", txt)
                self.assertNotIn("scripts/write_log.py", txt)
                self.assertNotRegex(txt, r"\[\[logs/")
        self.assertFalse((ROOT / "scripts").exists())
        self.assertFalse((ROOT / "VERSION").exists())

    def test_project_mapping_and_paths(self):
        mapping = json.loads((ROOT / ".second-brain.example.json").read_text())
        self.assertEqual(set(mapping), {"project_name"})
        self.assertIn("Projects/<project-name>/", SKILL)
        self.assertIn("Projects/<project-name>/", README)
        for name in ["AGENTS.snippet.md", "CLAUDE.snippet.md"]:
            s = (ROOT / "templates" / name).read_text()
            self.assertIn("Projects/<project-name>/", s)
            self.assertIn("obsidian", s)

    def test_mcp_exclusive_and_no_fallback(self):
        self.assertIn("only tools actually exposed by MCP server", SKILL)
        self.assertIn("Never fall back to filesystem", SKILL)
        self.assertIn("vault-relative", SKILL)
        self.assertIn("correct Vault", README)
        self.assertIn("No project mapping", SKILL)


class SafetyContractTests(unittest.TestCase):
    def test_no_racy_check_then_overwrite(self):
        self.assertIn("atomic create-if-absent", MCP.lower())
        self.assertIn("read/list before an unconditional write", MCP)
        self.assertIn("**not** an atomic create", MCP)
        self.assertIn("guarded update", SKILL)
        self.assertIn("compare-and-swap", MCP)
        self.assertIn("no new note", MCP.lower())

    def test_durable_record_limitations_and_failure_matrix(self):
        for phrase in ["MCP absent, wrong Vault", "Read-back", "Concurrent", "Create-only unavailable", "Run terminated forcibly"]:
            with self.subTest(phrase=phrase):
                self.assertIn(phrase, MCP)
        self.assertIn("cannot guarantee", SKILL)
        self.assertIn("hard runtime crash", README)
        self.assertTrue((ROOT / "tests/mcp-live-checklist.md").is_file())

    def test_security_and_project_isolation(self):
        for phrase in ["untrusted historical data", "commands embedded in a retrieved note", "Redact secrets"]:
            self.assertIn(phrase, SKILL)
        self.assertIn("across project boundaries", MCP)
        self.assertIn("cross-platform unsafe", MCP)
        self.assertIn("3–5", SKILL)
        self.assertIn("2,000 words", RECALL)

    def test_work_unit_identity_and_retries(self):
        self.assertIn("One log belongs to **one writer/run**", MCP)
        self.assertIn("`log_id` equals the final", PROPS)
        self.assertIn("ambiguous", MCP)
        self.assertIn("do not duplicate", MCP.lower())

    def test_actual_evidence_and_decision_owner(self):
        for term in ["**Investigation**", "**Implementation**", "**Decisions**", "**Verification**", "**Outcome**"]:
            self.assertIn(term, POLICY)
        self.assertIn("autonomous", POLICY)
        self.assertIn("user_directed", POLICY)
        self.assertIn("tests", POLICY.lower())
        self.assertIn("no “passed” if not executed", POLICY.lower())

    def test_root_wikilinks_in_both_promotions(self):
        links = re.findall(r"\[\[([^\]]+)\]\]", RECALL)
        self.assertGreaterEqual(len(links), 2)
        for link in links:
            with self.subTest(link=link):
                self.assertTrue(link.startswith("Projects/my-backend/logs/"))
                self.assertFalse(link.endswith(".md"))


class MarkdownContractTests(unittest.TestCase):
    def test_example_and_template_have_required_sections(self):
        required = ["Problem", "Investigation", "Implementation", "Decisions", "Verification", "Outcome"]
        for md in [TEMPLATE, EXAMPLE]:
            for heading in required:
                with self.subTest(doc="example" if md == EXAMPLE else "template", heading=heading):
                    self.assertRegex(md, rf"(?m)^## {heading}$")

    def test_example_is_explicitly_hypothetical(self):
        self.assertIn("Illustrative example only", EXAMPLE)
        self.assertIn("hypothetical", EXAMPLE)
        self.assertIn("not run", EXAMPLE.lower())

    def test_yaml_properties_parse_and_types(self):
        try:
            import yaml
        except ImportError:
            self.skipTest("PyYAML not installed; static guidance tests still run")
        required = {"type", "log_id", "project", "title", "date", "created", "status", "result",
                    "category", "agent", "autonomous_decisions", "tags"}
        for label, text in [("template", TEMPLATE), ("example", EXAMPLE)]:
            head, _ = frontmatter(text)
            data = yaml.safe_load(head)
            with self.subTest(label=label):
                self.assertTrue(required.issubset(data))
                self.assertEqual(data["type"], "log")
                self.assertEqual(data["project"], "my-backend")
                self.assertIsInstance(data["date"], dt.date)
                self.assertIsInstance(data["created"], dt.datetime)
                self.assertIsNotNone(data["created"].tzinfo)
                self.assertEqual(data["date"], data["created"].date())
                self.assertTrue(data["log_id"].startswith(data["created"].strftime("%Y-%m-%d-%H%M%S-")))
                self.assertIsInstance(data["autonomous_decisions"], bool)
                self.assertTrue(data["autonomous_decisions"])
                self.assertIsInstance(data["tags"], list)
                self.assertEqual(data["tags"][0], "ai-log")
                self.assertLessEqual(len(data["tags"]), 5)
                self.assertEqual(len(data["tags"]), len(set(data["tags"])))
                self.assertRegex(data["log_id"], r"^\d{4}-\d{2}-\d{2}-\d{6}-[a-z0-9-]+$")
                self.assertIn("in_progress", PROPS)
                self.assertNotIn("model", data)  # Unknown metadata must not be invented

    def test_no_duplicate_yaml_top_level_keys(self):
        for label, md in [("template", TEMPLATE), ("example", EXAMPLE)]:
            front, _ = frontmatter(md)
            keys = re.findall(r"(?m)^([A-Za-z_][A-Za-z0-9_]*):", front)
            with self.subTest(label=label):
                self.assertEqual(len(keys), len(set(keys)))

    def test_all_properties_are_simple(self):
        for data in [frontmatter(TEMPLATE)[0], frontmatter(EXAMPLE)[0]]:
            self.assertNotRegex(data, r"(?m)^\s{2,}\w+:")
            self.assertIn("status: completed", data)
            self.assertIn("result: success", data)


if __name__ == "__main__":
    unittest.main()
