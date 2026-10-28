# ApplyKit

**A reusable workspace for AI-assisted job applications.**

🌐 Website: https://yahyrparedes.github.io/ApplyKit/

Spanish documentation: [README.es.md](README.es.md)

ApplyKit helps you organize career sources, generate role-focused CVs, review them in HTML, export polished PDFs, write cover letters, and track every application from one local dashboard.

It is designed for people who apply seriously and want a repeatable workflow instead of rewriting the same CV from scratch for every job.

## Why ApplyKit?

Most applications fail because candidates reuse one generic CV everywhere.

ApplyKit gives you a structured workflow:

- Store original CVs, certificates, contracts, degrees, and work evidence.
- Extract reusable career memory into Markdown.
- Generate targeted CVs for Android, Backend, Fullstack, ATS-only, or custom role families.
- Review every CV as HTML before exporting PDF.
- Generate cover letters from structured data.
- Track applications by company, role, date, status, preview, notes, and PDF.
- Work with any AI coding agent: ChatGPT, Claude Code, MiniMax, Cursor, or others.

## Project Structure

```text
sources/
  cv/
  supporting-documents/

master-info/
  master-cv.md
  ats-context.md
  work-timeline.md

generator/
  templates/
  assets/
  data/
  scripts/

applications/
  index.json
  android/
  backend/
  fullstack/

output/
  pdf/
  preview/

schema/
docs/
temp/
```

## Quick Start

### 1. Add Your Source Documents

Before generating real applications, add your career evidence:

```text
sources/cv/
sources/supporting-documents/
```

Recommended documents:

- existing CVs;
- certificates;
- work contracts;
- work letters;
- degrees;
- course certificates;
- portfolio notes;
- any document that helps verify dates, roles, skills, or achievements.

ApplyKit works best when an AI agent first builds `master-info/` from your sources. Do not start tailoring applications until the career memory layer exists.

Use the first prompt in [PROMPTS.md](PROMPTS.md) for this setup step.

### 2. Install And Run

```bash
cd generator
npm install
npx playwright install chromium
npm run validate
npm run start
```

Open:

```text
http://127.0.0.1:4173
```

## Create A New Application

```bash
cd generator
npm run new -- --role android --company example-company --title android-developer --template android
```

This creates:

```text
applications/android/example-company-android-developer/
  cv-data.json
  notes.md
```

## Preview A CV

```text
http://127.0.0.1:4173/generator/templates/android.html?path=/applications/android/example-company-android-developer/cv-data.json
```

## Export PDF

```bash
cd generator
npm run pdf -- --template android --slug example-company-android-developer --path /applications/android/example-company-android-developer/cv-data.json
```

The PDF is generated at:

```text
output/pdf/example-company-android-developer/<Short-Name>-CV-<Role>.pdf
```

## Export Cover Letter

```bash
cd generator
npm run pdf -- --kind cover-letter --slug example-company-android-developer --data cover-letter-sample
```

## Git Modes

ApplyKit supports two workflows.

### Public Template Mode

Default mode. Safe for publishing.

Tracked:

- generator code
- documentation
- schemas
- anonymous sample data
- empty folder placeholders

Ignored:

- personal CVs
- certificates and contracts
- extracted career memory
- real job applications
- generated PDFs and screenshots
- temporary files

### Private Workspace Mode

Use this if the repository is private and you want to version your structured career data.

The `.gitignore` includes a commented allow-list for:

- `master-info/*.md`
- `applications/index.json`
- `applications/**/*.json`
- `applications/**/*.md`

Generated PDFs and previews should usually remain ignored because they can be recreated.

## Philosophy

ApplyKit is not a resume builder.

It is a local-first, AI-ready job application system where raw career evidence becomes structured memory, and structured memory becomes focused applications.

Spend less time formatting documents and more time sending relevant, high-quality applications.
