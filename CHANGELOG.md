# Changelog

## v0.1.1 - A4 Preview Polish

Improves the CV preview and PDF output so generated documents match an A4 page more closely before export.

### Changed

- Refined CV template typography, spacing, and section rhythm for one-page A4 exports.
- Added explicit A4 layout variables for preview and print rendering.
- Preserved the A4 page model on small screens instead of switching CV previews to a fluid mobile layout.
- Tightened keyword chips and compact sections to reduce accidental PDF overflow.

### Added

- Committed `package-lock.json` for reproducible generator dependency installs.

## v0.1.0 - ApplyKit Preview

Initial public template release.

### Added

- Local-first workspace structure for AI-assisted job applications.
- Public-template mode with safe `.gitignore` defaults.
- Private-workspace mode guidance for users who want to version their own structured career data.
- HTML CV generator with role-focused templates:
  - Android
  - Backend
  - Fullstack
  - ATS-friendly plain layout
- Cover letter template and renderer.
- Local dashboard for tracking applications.
- JSON-driven application data model.
- Anonymous sample data for templates and dashboard.
- PDF export with Playwright.
- CLI scripts:
  - `npm run start`
  - `npm run new`
  - `npm run validate`
  - `npm run pdf`
  - `npm run export:all`
- JSON schemas for CV data, cover letters, and application index.
- ApplyKit logo and favicon.
- English and Spanish README files.
- Agent-oriented documentation and reusable prompts:
  - `AGENTS.md`
  - `PROMPTS.md`
  - `docs/agent-workflow.md`
  - `docs/git-modes.md`
  - `docs/templates.md`
- MIT license, contribution guide, security notes, and GitHub issue templates.

### Notes

- Real user documents, extracted master information, job applications, PDFs, previews, and temporary files are ignored by default.
- Users should add their own documents to `sources/` and build `master-info/` before generating real job applications.
