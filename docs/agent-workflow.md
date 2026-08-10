# Agent Workflow

ApplyKit is designed for AI-assisted job applications.

## Read Order

1. `README.md`
2. `AGENTS.md`
3. `PROMPTS.md`
4. `master-info/`
5. `applications/index.json`
6. The target application folder

Agents should avoid reading `sources/` unless source verification is needed.

## Mandatory Source Step

Before creating real applications, the user must add documents to:

```text
sources/cv/
sources/supporting-documents/
```

If the source folders are empty, ask the user to add documents first.

If source folders contain documents but `master-info/` is empty, build `master-info/` before tailoring any CV.

## Create A New Application

```bash
cd generator
npm run new -- --role android --company example-company --title android-developer --template android
```

Then edit:

```text
applications/android/example-company-android-developer/cv-data.json
applications/android/example-company-android-developer/notes.md
```

## Review

Open the generated preview URL, review with the user, then export PDF.

## Export

```bash
npm run pdf -- --template android --slug example-company-android-developer --path /applications/android/example-company-android-developer/cv-data.json
```
