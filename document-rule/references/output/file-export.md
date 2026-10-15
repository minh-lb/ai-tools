# File Export and Formatting Rules

## Before returning a link

1. Is there a suitable tool for the requested format (Markdown, PDF, DOCX, etc.)?
2. Was the file actually created at the right path, with the right extension and structure?
3. Was it checked for non-empty content, required sections, and correct encoding?
4. If providing a link, does it point to the existing file rather than a guessed path?
5. If the user requested both inline content and a file, did you provide both rather than substituting one for the other?

## Formats

- Markdown: use a clear heading hierarchy, lists, tables, fenced code, and valid relative links.
- For a new Markdown document file with no user/project schema, use the default **root-level YAML frontmatter** below; never nest it under `properties:`. User/project schemas and format constraints take precedence over these defaults. Existing files retain their schema, including absence of frontmatter; do not retrofit metadata during an unrelated edit. Markdown document templates shipped with this skill show the default block with clearly marked placeholders and `status: draft`:

  ```yaml
  ---
  id: <stable unique identifier>
  title: <document title>
  type: <document type>
  status: draft
  created: YYYY-MM-DD
  updated: YYYY-MM-DD
  tags: []
  ---
  ```

  - Required by default: `id`, `title`, `type`, `created`, `updated`. Optional: `status`, `tags`.
  - Use a unique task/ticket ID when available; otherwise generate a UUID. Check for collisions within the target repository/vault when accessible, and disclose an unchecked uniqueness scope. Keep IDs stable across edits/renames; localized documents need distinct IDs under this default.
  - Use actual ISO `YYYY-MM-DD` dates: preserve `created`; update `updated` on content changes. Quote/escape YAML strings when needed. Never publish placeholder values as real metadata.
  - Under this default schema, `status` is only `draft` or `approved`; new documents use `draft`. Approval applies to a specific revision: a substantive edit returns it to `draft` unless the user explicitly approves the revised content. A formatting-only edit does not invalidate approval. A user/project schema may define different statuses; preserve those semantics rather than imposing this enum.
  - Domain/ADR decision statuses in the body are separate from document approval. Use `tags: []` when there are no tags. Do not add frontmatter to inline output, raw JSON/YAML, or Markdown explicitly requested without metadata.
- JSON: follow the exact schema/keys, ensure it parses, and omit comments/trailing commas.
- YAML: use valid indentation, types, and escaping.
- DOCX/PDF: when supported by the runtime, verify structure and render if possible.
- Multiple files: use stable names and navigation; check links between files.

## When capabilities are limited

If the requested file cannot be created, state the limitation; do not claim completion. If the content is too long to display, provide the complete file **only if it was actually created**, and clearly label the chat output as a preview rather than the full text. Do not silently change the requested file format.
