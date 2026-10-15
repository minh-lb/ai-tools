# File Export and Formatting Rules

## Before returning a link

1. Is there a suitable tool for the requested format (Markdown, PDF, DOCX, etc.)?
2. Was the file actually created at the right path, with the right extension and structure?
3. Was it checked for non-empty content, required sections, and correct encoding?
4. If providing a link, does it point to the existing file rather than a guessed path?
5. If the user requested both inline content and a file, did you provide both rather than substituting one for the other?

## Formats

- Markdown: use a clear heading hierarchy, lists, tables, fenced code, and valid relative links.
- When creating a Markdown document file, add YAML frontmatter with **root-level properties** at the top of the file. Do not wrap them in a nested `properties:` key. Follow the user's requested schema or an existing file's schema instead of replacing it. Every Markdown document template must also show this frontmatter block with valid, clearly marked placeholders for project-specific values and `status: draft`. Default properties:

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

  `id`, `title`, `type`, `created`, and `updated` are required by default. Follow an explicit user/project ID schema when one exists; otherwise, use a task/ticket ID as the document `id` when available and unique within the repository/vault. If no task/ticket ID is available or it would collide, generate a UUID. Keep the chosen ID stable across renames and edits. Use ISO `YYYY-MM-DD` dates; `created` is the creation date and `updated` is the date of the latest content change. `status` and `tags` are optional unless the requested/existing schema requires them. If the frontmatter `status` property is present, its value MUST be exactly `draft` or `approved`: use `draft` by default and use `approved` only after the user explicitly approves the document. Never infer approval or use another value. This restriction applies to the document's frontmatter status; domain states and decision statuses in the body (for example, an ADR decision status) follow their own contract. Use `[]` when there are no applicable tags. Do not copy placeholder values as real metadata. For an existing document, preserve its schema and update existing metadata without breaking compatibility. Do not add frontmatter to inline output, raw JSON/YAML, or Markdown when the user explicitly requests no metadata.
- JSON: follow the exact schema/keys, ensure it parses, and omit comments/trailing commas.
- YAML: use valid indentation, types, and escaping.
- DOCX/PDF: when supported by the runtime, verify structure and render if possible.
- Multiple files: use stable names and navigation; check links between files.

## When capabilities are limited

If the requested file cannot be created, state the limitation; do not claim completion. If the content is too long to display, provide the complete file **only if it was actually created**, and clearly label the chat output as a preview rather than the full text. Do not silently change the requested file format.
