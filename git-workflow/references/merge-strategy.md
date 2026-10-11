# Pull Request / Merge Strategy

Follow the target repository's contribution guide, branch protections, merge settings, and accepted history. This reference is for GitFlow-oriented work, not a universal PR convention.

## Choose the target and merge mode

- Verify the actual source/target project and branch roles; do not assume names such as `origin`, `develop`, or `main` identify them correctly.
- Follow the repository's PR/MR title, language, template, review, and merge-mode conventions. Do not invent a ticket ID, require a scope/prefix, or impose an English title or length limit.
- Prefer the repository's configured merge mode. Preserve release/hotfix ancestry when the release workflow and verification depend on the source tip being an ancestor. Do not squash/rebase-and-merge where it would break that guarantee.
- Never bypass protected-branch reviews, status checks, or access policy. If local guidance conflicts with the hosting settings, stop and ask.

## Readiness

Before creating a PR/MR, inspect the complete branch diff and commit history relevant to the target, confirm intended files are committed, and run applicable checks when available. Check for conflicts, secrets, debug artifacts, migration/compatibility impact, and required documentation. Report skipped checks accurately.

Prepare the description from `templates/pull-request-template.md` when it applies. Fill relevant sections with evidence, remove irrelevant placeholders instead of inventing content, and state test status truthfully. Include task links only when available or required by the repository.

## Preview and approval

Before an external create action or a push not already approved by the user, show a complete preview and wait for explicit approval. Include:

- Source project/owner and branch, plus its local tip SHA.
- Fetch/base remote, source push remote, and the single effective push destination (redact credentials).
- Target project and branch.
- Whether a source-branch push is needed.
- The full proposed title and description.

Use the user's known language preference and the repository's title convention; ask only when the choice materially affects the result and is unclear. Approval applies to the exact preview. If the source SHA, project, branch, title, description, or push plan changes, show the revised preview and obtain approval again.

## Push safety

Pushing is a remote side effect. Before any push, enumerate all effective destinations with:

```bash
git remote get-url --push --all <push-remote>
```

Treat the output as sensitive; do not expose URLs with embedded credentials. Proceed only when exactly one effective destination matches the approved source project. Stop if enumeration fails, returns no destination, returns multiple destinations, or the destination differs. Recheck immediately before the push.

Compare the approved local tip SHA with the remote source ref. If the ref is absent, push only if that exact push was included in the approved preview. If an existing ref differs, stop; never overwrite it. Before pushing, verify the local tip still matches approval and the destination is unchanged. Do not force-push. After pushing, verify that the remote branch tip exactly matches the approved SHA. A fork push does not integrate into the target project.

## Create and verify

Use an available authenticated MCP integration when it can explicitly bind the approved source and target projects. Otherwise use the matching authenticated CLI (`gh` or `glab`) only after confirming it is installed and authenticated. Do not rely on the current directory, browser tab, or default remote to select a fork source or target. If the tool cannot represent the approved source/target pair, stop and provide the approved preview rather than silently targeting another repository.

Illustrative same-project GitHub command (replace all fields with approved values):

```bash
gh pr create \
  --repo <target-owner>/<target-repo> \
  --base <target-branch> \
  --head <source-branch> \
  --title "<approved-title>" \
  --body-file <approved-description-file>
```

For a cross-fork source, use the CLI's supported explicit `<source-owner>:<source-branch>` form and confirm installed-version behavior first. For GitLab forks, inspect `glab mr create --help` and proceed only if the installed version can explicitly select source and target projects. Do not expose remote credentials in command output or reports.

After creation, inspect the created record and verify URL, source/target projects and branches, title, state, and description. Report only confirmed details; if verification fails, say so and do not claim successful creation.
