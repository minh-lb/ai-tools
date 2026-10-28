"""Offline package checks; behavioral scenarios are in scenarios.md."""
import re
import unittest
from pathlib import Path
from urllib.parse import unquote

ROOT = Path(__file__).resolve().parents[1]
CORE = ('SKILL.md', 'references/review-process.md', 'references/severity-model.md')


def headings(text):
    result = set()
    for title in re.findall(r'^#{1,6} (.+)$', text, re.M):
        title = re.sub(r'[^\w\- ]', '', title.lower()).replace(' ', '-')
        result.add(title)
    return result


class PackageTests(unittest.TestCase):
    def test_entrypoint_metadata(self):
        text = (ROOT / 'SKILL.md').read_text()
        self.assertTrue(text.startswith('---\n'))
        frontmatter = text.split('---', 2)[1]
        self.assertRegex(frontmatter, r'(?m)^name: review-code$')
        self.assertRegex(frontmatter, r'(?m)^description: .+')
        self.assertLess(len(frontmatter), 1024)

    def test_local_links_are_bundled_and_resolve(self):
        for source in ROOT.rglob('*.md'):
            for link in re.findall(r'\]\(([^)]+)\)', source.read_text()):
                if re.match(r'[a-z]+://', link):
                    continue
                path, _, anchor = unquote(link).partition('#')
                target = (source.parent / path).resolve() if path else source
                with self.subTest(source=source.relative_to(ROOT), link=link):
                    self.assertTrue(target.is_relative_to(ROOT), 'External dependency')
                    self.assertTrue(target.is_file(), 'Missing resource')
                    if anchor:
                        self.assertIn(anchor, headings(target.read_text()))

    def test_mandatory_reading_budget(self):
        words = sum(len((ROOT / p).read_text().split()) for p in CORE)
        self.assertLessEqual(words, 2000, f'Mandatory core: {words} words')
        self.assertLessEqual(len((ROOT / 'SKILL.md').read_text().split()), 650)

    def test_all_dimensions_in_template(self):
        template = (ROOT / 'templates/review-report.template.md').read_text()
        expected = 'CORR SEC PERF ARCH DB API UI A11Y TEST MAINT OBS CONC INFRA COMPAT'.split()
        rows = re.findall(r'^\| ([A-Z0-9]+) \|', template, re.M)
        self.assertCountEqual(rows, expected)


if __name__ == '__main__':
    unittest.main()
