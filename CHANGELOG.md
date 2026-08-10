# Changelog

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
