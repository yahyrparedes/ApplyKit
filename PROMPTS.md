# ApplyKit Prompts

Copy these prompts into ChatGPT, Claude Code, MiniMax, Cursor, or another AI coding agent.

## First-Time Setup From Documents

```text
I want you to use this repository as an ApplyKit workspace.

Before creating any job application, first check whether I have added source documents under:

- sources/cv/
- sources/supporting-documents/

If those folders are empty, stop and ask me to add my CVs, certificates, contracts, degrees, work letters, or other career evidence first.

If documents exist:

1. Read README.md and AGENTS.md.
2. Inspect the documents in sources/.
3. Extract reusable career information into master-info/master-cv.md.
4. Create ATS and positioning notes in master-info/ats-context.md.
5. Create or update master-info/work-timeline.md.
6. Mark uncertain dates, claims, skills, or role overlaps as pending instead of inventing facts.
7. Summarize what you learned and what still needs confirmation.

Do not create a tailored CV until the master-info layer exists.
```

## Create A Targeted CV From A Job Offer

```text
I want you to help me apply to this job using ApplyKit.

First read:

- README.md
- AGENTS.md
- master-info/master-cv.md
- master-info/ats-context.md
- master-info/work-timeline.md
- applications/index.json if it exists

Then:

1. Analyze the job offer.
2. Choose the best template: android, backend, fullstack, ats, or another role family if needed.
3. Create an application folder under applications/<role-family>/<company-role-slug>/.
4. Create cv-data.json with only truthful, role-relevant information.
5. Create notes.md with strategy, risks, missing information, and keywords.
6. Update applications/index.json.
7. Give me the HTML preview URL.
8. Wait for my review before exporting PDF unless I explicitly ask you to export immediately.

Rules:

- Do not invent facts.
- Do not reintroduce facts I have rejected.
- If a skill is adjacent but not directly proven, phrase it as familiarity or transferable experience.
- Keep the CV focused on the job offer.
```

## Review An Existing Application

```text
Review this ApplyKit application:

applications/<role-family>/<slug>/

Check:

- cv-data.json matches the selected role.
- Claims are supported by master-info.
- The CV is not too generic.
- Keywords from the job offer are present where truthful.
- The HTML preview is readable.
- The PDF can be regenerated.

Lead with risks, missing information, and concrete improvements.
```

## Generate A Cover Letter

```text
Generate a cover letter for this ApplyKit application:

applications/<role-family>/<slug>/

Use the job offer, notes.md, and cv-data.json.

Create cover-letter-data.json or cover-letter.md in the application folder.

Keep it concise, specific, and truthful.
Do not repeat the CV line by line.
```

## Prepare A Public Template Release

```text
Prepare this ApplyKit repository for public template release.

Check:

- No personal data in tracked files.
- generator/data samples are anonymous.
- sources/ is ignored except .gitkeep.
- master-info/ is ignored except .gitkeep.
- applications real data is ignored except README and .gitkeep files.
- output/ is ignored except .gitkeep.
- npm run validate passes.
- git add -n . shows only template-safe files.
```
