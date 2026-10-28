# Agent Instructions

ApplyKit is designed to be used by coding agents such as ChatGPT, Claude Code, MiniMax, and similar tools.

## Read Order

1. `README.md`
2. `AGENTS.md`
3. `PROMPTS.md`
4. `master-info/master-cv.md`
5. `master-info/ats-context.md`
6. `applications/index.json`
7. The specific application folder, if one exists

Only inspect `sources/` when evidence is missing or the user asks for source validation.

## Mandatory First-Time Setup

Before creating any real job application, verify that the user has added source documents under:

- `sources/cv/`
- `sources/supporting-documents/`

If those folders contain no user documents, stop and ask the user to add source documents first.

If documents exist but `master-info/` has not been created yet, build the master information layer before generating applications:

- `master-info/master-cv.md`
- `master-info/ats-context.md`
- `master-info/work-timeline.md`

Do not generate a tailored CV from raw memory alone when the source-to-master mapping has not been completed.

## Application Creation Protocol

When the user provides a job offer:

1. Confirm source documents and `master-info/` exist.
2. Identify the best role family: `android`, `backend`, `fullstack`, or create a new one if needed.
3. Create `applications/<role-family>/<company-role-slug>/`.
4. Create `cv-data.json` using the chosen template schema.
5. Create `notes.md` with strategy, risks, and positioning.
6. Register the application in `applications/index.json`.
7. Start the generator server and provide the preview URL.
8. Wait for user review before exporting PDF unless the user explicitly asks to export immediately.

## Truth Rules

- Do not invent education, employment, dates, certifications, language level, or direct tool experience.
- If a skill is adjacent but not directly proven, phrase it as familiarity, interest, or transferable experience.
- Keep role positioning aligned to the user's strategy, even when the master profile is stronger.
- If the user removes or rejects a fact, do not reintroduce it in future applications.

## Output Rules

- Final PDFs go in `output/pdf/<application-slug>/` and are named `<Short-Name>-CV-<Role>.pdf` by the exporter.
- Follow the European CV conventions in `docs/templates.md` (CEFR languages, MM/YYYY dates with location, single column, 2 pages max, alignment not printed).
- If Playwright's bundled Chromium is unavailable, set `CHROMIUM_PATH` to a local Chromium/Chrome binary before exporting.
- HTML previews or screenshots go in `output/preview/<application-slug>/`.
- Drafts and strategy notes stay in `applications/<role-family>/<application-slug>/`.
- The generator code stays generic and reusable.
