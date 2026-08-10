# Contributing

Thanks for considering a contribution to ApplyKit.

## Principles

- Keep the template safe to publish.
- Do not commit personal CVs, certificates, contracts, screenshots, PDFs, or real application data.
- Prefer generic examples under `generator/data/`.
- Keep generated outputs reproducible and ignored by default.
- Keep the generator dependency-light and easy for agents to edit.

## Local Setup

```bash
cd generator
npm install
npx playwright install chromium
npm run validate
npm run start
```

## Pull Request Checklist

- No personal data in tracked files.
- Samples remain anonymous.
- `npm run validate` passes.
- README or docs updated if workflow changes.
- New templates include HTML preview and PDF export support.
