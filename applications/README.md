# Applications

Each job application should have its own folder:

```text
applications/
  android/
    company-role-slug/
      cv-data.json
      notes.md
      cover-letter.md
      cv-draft.md
  backend/
  fullstack/
```

`applications/index.json` powers the dashboard and should be updated whenever an application is created or its status changes.

## Suggested Status Values

- `lead`
- `draft`
- `review`
- `ready`
- `applied`
- `interview`
- `rejected`
- `archived`
